# Cat RPG: Browser Showcase Slice, Implementation Plan

| | |
|---|---|
| **Owner** | technical-director, with the prototyper |
| **Date** | 2026-11-24 |
| **Status** | Plan only; nothing is built. Approve it, or change the defaults in §8 first |
| **What it is** | A 10–15 minute playable showcase in one shareable claude.ai Artifact page, for stakeholders, showing gameplay and art direction |
| **What it is not** | The Unreal Engine 5.8 build or the 2–2.5 h vertical slice (`design/GDD.md` §4). The code is throwaway; data, tuning and findings carry over (§7) |
| **Canon** | `design/GDD.md` and the system docs. Simplifications are listed in §2.4; the design is never changed here |

---

## 1. Purpose and success criteria

### 1.1 What a stakeholder must experience in one sitting

1. **The look.** Within 30 seconds: "a hand-painted anime I can walk around in". Inked cel cats over painted streets and sky, from any camera angle.
2. **The brawl.** They switch cats and command a Move in Slow Blink. Before minute 4 they finish their first **two-cat Pile-On**.
3. **A Rival who remembers.** Togemaru returns and **cites yesterday** (≈ 7:20). They give him a **Verdict**, and it shows on his model (a Scar) and on the Fence Line.
4. **Territory.** They read a raid forecast, **post a Sentry**, sleep, and find the result **as a pile of fish on the Doorstep**.
5. **Home.** The HUD fades at the garden wall and the camera drops to cat height. **The Call** (E4–G4–C4), the bell on the fourth beat, then a wordless scene with Haru at the upright piano: Mikan walks the keys and she plays a bass line under the steps.

**The conclusion we want:** "Boss outside, pet at home works, and this team can make it look like this."

### 1.2 What it proves (against `final-assessment.md` §4)

| §4 item | This build | Evidence |
|---|---|---|
| 11 Reference closeness | **Answers it** (main purpose) | M0 go/no-go; 3D frames under a free camera |
| 10 Cat scale 1.25× at home | **Answers it** | Piano bench and lap shot |
| 2, 3, 4 Readable brawl; does it hit; personalities read | **Partly** | Random-pause shots; tier feel on one frame plus flash screening (not a certified Harding pass); three Crew personalities plus a Braggart enemy |
| 1, 5, 8, 9 Conducting fun; Pile-On worth it; wordless beat; hum the Call | **First signal** | Session telemetry on the end card; a muted home run; the Call heard three times |
| 12–14 Want home; care; real posting | **Shows, not proves** | One forecast, three cats, a counter and a neighbour, resolved by the real formula |
| 6, 7, 15–17 | **Not tested** | Need the engine slice |

**Deliberately not proven:** the 25-minute day, the 7-day economy, Boss pacing, long-run Rival emergence, Unreal performance.

### 1.3 Acceptance

- The main path takes **11–15 min** for a first-time player without help (fast path ≈ 11), measured by an in-page timer.
- Title within **≤ 6 s** on broadband, **≤ 12 MB** total download, **≥ 50 fps** at 1080p on an Iris Xe or M1-class laptop.
- **Zero** requests to non-allowlisted hosts and zero console errors. The page boots with `localStorage` blocked.
- At phone width the game plays in landscape with touch. Portrait shows a rotate prompt. Below 360 px it shows a "best on desktop" card that still opens the home chapter.
- Every milestone's screenshots are retained in `production/qa/evidence/artifact-slice/`.

---

## 2. Scope: the showcase slice

Life 1 days 1–2 stay almost intact (≈ 9 min). Then the Life 1→2 montage, and a jump to **Life 2 day 2** for one posting decision, one evening at home and one tribute morning (≈ 5 min). The rules run for real; a director script decides where things happen.

### 2.1 Content list

| Kind | In |
|---|---|
| **Places** | Shrine steps in rain (K1.1). Haru's House: garden, Doorstep, entryway, Main Room with the upright piano and Gran's cushion. Hidamari Lane: **Low Wall Corner** (red-mailbox Scent Post, Sunspot), **Laundry Pole Yard** (gatepost, High Perch), the lane between them. Persimmon Alley's mouth and Daifuku's wall are skyline dressing only. **The Lot** (kei truck, Turf Board). ≈ 120 m of walkable lane; a simplified High Road (walls and fence tops as walkable ribbons, auto-hop at ledges, per R-H) |
| **Phases** | Morning, Day, Dusk; Night only as the overnight diorama; rain only in K1.1 |
| **Cats** | **Mikan** (a kitten in Life 1, a young adult in Life 2; Scrapper). **Hige** (Stalwart · Bruiser; joins ≈ 2:00, "Use your whiskers, Collar."). **Pon** (Goofball · Yowler) and **Kinako** (Fraidy · Scrapper), both in the Life 2 state. **Togemaru** (Braggart · Scrapper), joins only on a Recruit |
| **Rivals** | **Togemaru, the First Thorn** (arc lead, then declared Nemesis). Wall Sitter Toughs **Goma** and **Sasa**. 2 Strays, the Keeper Stray, 2 crows. Daifuku and Kagi appear only on the Fence Line and as skyline silhouettes |
| **Moves (6 of the 8 ★)** | Mikan: Face Swat, Bunny-Kick · Hige: Shoulder Check, Belly Flop · Pon: Withering Hiss, Purr · Kinako: string only |
| **Combat** | 3-hit string with Style finishers, Hop, Skitter, Brace, Hiss (yellow interrupt, Back Down), switch, **Tag-In** (0.35 s), **Relay** (2–4 cats), Paws, **Slow Blink** (×5%, chained commands), Ruffled and Frazzle, **Quick Pile-On** and **Full Pile-On** (5 pips), the **bucket** (Water Fear) |
| **Rivals layer** | Standoff name-card with a yowl-sting. Memory. The **day-2 memory line**, branched per `nemesis-system.md` §3.8. **Verdict** compass (all four, honest tells). Silhouette Scar by finisher type. Title *Bell-Ringer*. **Declaration card**. **Fence Line** (8 seats) |
| **Territory** | Rub, Counter-Spray, Claim Spray, the Spray rescue, 1–4 wisps. Two Patches taken live. **Turf Board** first use as one decision (open item 10). **One forecast raid** resolved by `territory-management.md` §4.5. **Tribute** by §4.2 as a physical pile. Stash count |
| **Home** | K1.1 and K1.3 condensed, the M1 montage, and **Storyboard B "A Tuesday in Life 2"** with T2.2's piano duet folded in. One daily find (the bag charm). The Knock tutorial (chipped Bowl). Lap |
| **Audio** | The Call (voice), the bell, Haru's Melody (answer phrase, 16-bar AABA), Gran's Foundation (reed organ), the Lane theme (Day and Dusk mixes), a brawl loop, the Brass Call cell, Togemaru's sting, the Dusk chime, ≈ 40 SFX by tier, Murmur. All synthesised (§3.6) |
| **Text** | English UI, cat speech, hint cards ≤ 6 words. Sound words in English, with a Japanese toggle. Human writing is Scribble only |

### 2.2 Player script (reference path; [fast path])

| Time | Beat | Teaches | Run by |
|---|---|---|---|
| — | **Title**: painted Dusk vista, the bell, "Click or tap to begin" (this click also unlocks audio). Options: Reduce Flashes, Reduce Motion, shake, onomatopoeia, Kitten difficulty | — | — |
| 0:00–1:00 | **K1.1** condensed. The kitten shivers, mews and climbs the box rim. Yellow raincoat; Haru's face (face event 1); she **hums the answer phrase**, not the Call. Black, a heartbeat. Entryway: plum slippers planted, yellow socks shifting, the saucer goes down. Morning: the collar goes on, and **the bell's first ring** ends the scene | Camera, move | Vignette; input latched across cuts |
| 1:00–1:45 | Garden → **crow on the lane-side wall top**. Home ↔ Explore camera blend at the wall | Move, Hop, Attack, Skitter | Systemic; tutorial fights can't wipe |
| 1:45–2:15 | **Hige**: "Use your whiskers, Collar." Whisker Sense trail; he joins | Whisker Sense | Scripted join |
| 2:15–3:45 | **Two Strays.** Switch, Paw, Slow Blink, command Hige's Shoulder Check (Splat), Frazzle → **two-cat Quick Pile-On ≈ 3:35** [3:00]. If no Frazzle by 3:15, it fills faster (day-loop §3.9) | Switch, command, **Pile-On** (hint card only, R-E) | Systemic |
| 3:45–4:45 | **Low Wall Corner** (PP-03): Rub −10, Counter-Spray −30 (a sparkle cloud), the Keeper Stray: a yellow telegraph, Hiss, Back Down → **Claim Spray: Patch 1**; the Brass Call on melodica | Scent, Spray, Hiss | Systemic Scent; scripted wave |
| 4:45–5:35 | **Togemaru Standoff**: "Nice bell, Collar. Does it ring when you run?" A short fight; he bolts on a 1.0 s yellow windup | Standoff, Brace | Systemic. If he is Routed, the Verdict comes now and day 2 follows the §3.8 table |
| 5:35–6:50 | **Sunspot nap → Dusk.** Lamp wave → chime → **the Call** one bar later → the bell glint on beat four → the Head Home thread → the wall blend (1.0 s) → **K1.3**: socks, the blue-and-white Bowl, Tap-Tap, a stroke with the bell, Gran's fish flake, the Lamp; Knock chips the Bowl (optional). Sleep in the Box | Nap, Head Home | Vignette; the phase dial jumps |
| 6:50–7:10 | **The Doorstep**: the first Tribute pile. 1-item Sniff: Togemaru's fresh mark on his gatepost | Tribute, Sniff | Formula |
| 7:10–8:40 | **Laundry Pole Yard.** **Memory line ≈ 7:20**: "I ran yesterday. Not off my own post, Collar." (unskippable 1 s). Mikan + Hige vs Togemaru + Goma. **Tag-In** taught on the first two windows. Togemaru Frazzled → Quick Pile-On (last enemy) → **Scar** (chance 100% for the showcase) → **Verdict** (a Life 1 Recruit is free) → **Patch 2** | Tag-In, Verdict | Systemic; the Verdict branches Life 2 |
| 8:40–9:15 | **M1 The Kitten Grows** (35 s): seasons through the glass; the Piece through the walls, better each season, always stopping at the same bar. "Life 2" | Wordless; piano motif | Scripted |
| 9:15–9:45 | **Life 2 day 2, the Doorstep**: a bigger pile. **Declaration card** (Sworn Enemy, storm mark, notch, *Bell-Ringer*, his best line). **Forecast** for Laundry Pole Yard: two portraits, motive "?" (no Schemer posted) | Declaration, forecast | Snapshot; forecast from data |
| 9:45–10:30 | **The Lot → Turf Board (one decision)**: the forecast Patch and three portraits. **Hige** (Stalwart, the habit pick), **Pon** (Goofball, counters `grudge` ×2, but sulks off the Posse) or **Kinako** (weak alone; bonded neighbour to Hige on Low Wall Corner). Scent, Tribute and odds as paw marks: the only place territory numbers appear | Sentries, counters, neighbours | Systemic; seeded per save |
| 10:30–11:30 | *Optional* [fast path: "Nap to Dusk"]. 4-cat fight: Goma, Sasa and 2 Strays, with the **bucket** and a **Relay**. Then optionally **Spray the gatepost to 90** (a Strong Patch cannot be Lost) | Relay, Fears, the Spray rescue | Systemic |
| 11:30–13:00 | **Dusk → home (Storyboard B).** Call, thread, loafers kicked askew (she was late), Feeding, **Whisker Sense: a yellow trail to the bag charm**. Haru at the upright stops at the same bar, twice. Mikan walks the keys (quantised, the Call cell masked). She plays **a bass under Mikan's steps**, then lifts Mikan to her lap (the face clamp is released). Gran's slippers stop in the doorway and stay [≈ 1:00] | Piano, Lap | Scripted beats, free roam between |
| 13:00–13:30 | **Overnight diorama.** Moon-blue silhouettes at the gatepost act out the rolled outcome (Repelled, Scuffed or Lost) in 10–15 s; the Fence Line shifts a seat | Overnight steps 2–4 | Systemic outcome, staged |
| 13:30–14:10 | **Tribute morning.** The pile shows the night (full; a gap with paw prints and twice the Patch's pay stolen; or Sage wisps on the post). Result card → **Fence Line** → end card: session stats and two questions ("Name a Rival and what you did to him." "Name one thing Haru does.") | Consequence | Systemic |

Fast path ≈ 11:00–11:30. There is no fail state; the Head Home thread and drowsiness bring a dawdler home.

### 2.3 Branches

- **Togemaru's Verdict.** Chase, Humble or a snubbed Nose-Touch → **state A**: he is the Nemesis and raids with `grudge`. Recruit or an accepted Nose-Touch → **state B**: he is Crew (Aloof, notched), Goma becomes the arc lead and raids with `pretender`, nobody can counter it, and Hige is the right post. Both states are authored One-Cat-Schema snapshots.
- **The raid** draws from `rng(save_seed, day, 2, "territory", patch)`, so it is reproducible. Chapter select offers "new seed".

### 2.4 What runs for real and what is scripted

| Runs for real (data-driven, by the docs) | Scripted or faked |
|---|---|
| Combat F1–F6, telegraphs, attack tokens, poise, Ruffled, the 6 s Frazzle window | Where encounters spawn and what they contain |
| Posse AI by personality (Combat §3.11), the R-G self-cast toggle on | Tutorial fights can't wipe; the Frazzle boost |
| The tier table T0–T5 and the DR-50 safety arbiter | Hige's join; the Life 2 snapshot (levels, Loyalty, Scents) |
| Grudge/Regard ledger, Memory, bark score F8, Scar from damage type | The Declaration on schedule; Scar chance 100% |
| Scent bands, wisps, Claim and Spray | The phase clock jumps on naps and beats (no 16-min real clock) |
| Raid resolve §4.5, Tribute §4.2 | The overnight diorama stages the rolled result |
| Camera states and collision from `camera_states.json` | All vignettes: shots, timelines, Murmur takes |

### 2.5 OUT

Daifuku and the Den; Kagi and Tofu Shop Step; Zoomies; Lessons, Bribes, Share and prices; XP and levels; Loyalty arithmetic (the tier word only); the Caterwaul and Night roaming; Late Home; K1.4, K2.1–K2.5, T1.1, T2.1; the Gift Jar beyond one curio; Ambushes; adaptation and Strengths; extra wall events; Persimmon Alley and Tofu Shop Step as playable Patches; full High Road platforming; damage numerals; full remapping; mid-chapter saves; a Japanese UI; generated Crew; street humans.

**IN despite its size:** a **combat sandbox chapter** (Mikan, Hige, Pon and Kinako vs Goma, Sasa and Strays, with the bucket). Stakeholders will ask to "just fight", and it reuses everything.

---

## 3. Art pipeline in code

**The constraint:** no artist and no image generator, so every pixel comes from code agents write. There are three moves:

1. **Reuse the preview kit.** Its SVG helpers already match the palette, the line and the paint grammar, so we bake them to textures in headless Chromium.
2. **Build cats as signed distance fields (SDFs).** Smooth bean, chestnut and pom primitives are polygonised offline into seamless skinned meshes.
3. **Let shaders enforce "ink what acts, paint what stays".**

### 3.1 Characters (inked cels)

- **Modelling.**
  - Base meshes are Round, Standard and Long, plus Mikan's kitten head and pom tail. Each is authored in `tools/cats/*.sdf.js` as smooth-unions of ellipsoids and capsules over a ≈ 24-bone skeleton (spine, neck, head, jaw, 2 ears, 6 tail bones, 4 legs).
  - `bake-meshes.mjs` polygonises with surface nets (≈ 4–6k triangles), bakes **smoothed normals** into a second attribute for the outline, derives 4-influence skin weights from distance to each bone, and writes `.bin` plus JSON.
  - Ears and tails are rigid parts, from the generator's 4 tail shapes and 3 ear shapes. Scars per art bible §3.5: the ear notch is an SDF subtraction; the kinked tail is 2 bones locked at 40°.
- **Coat patterns without UVs.** Object-space mask functions run in the fragment shader. Mikan's cap is a head-local height test plus a sphere over the left eye. Tabby is banded noise along the spine. Calico is 3 Voronoi blocks. Edges are hard and **borderless** (L-7). Colours come from `Kit.COATS`; shades come from the kit's lavender multiply.
- **Toon shading.** Two tones with a hard terminator, shade share 15–25% under Day, and a **separate character key light** per phase (E-3). Characters receive **no** shadow map. Shade on a cat is a **zone tint**: one sun ray from the cat's root against the collision boxes, blended over 80 ms. Under every cat sits a feathered Shadow Wisteria contact blob at 45% (E-4).
- **Faces.** The kit's 12 front-head expressions are baked into a 1024² decal atlas and drawn on a curved card skinned to the head bone. Expressions swap on twos.
- **Outline (L-3 to L-5).**
  - An **inverted hull** from the smoothed normals, expanded in clip space by `px × 2 / renderTargetHeight`. That gives 2.0 px at 1080p at any distance, falling to 1 px below 4% of screen height.
  - Combatants get three hulls: Ink → Clowder keyline (Bell-Gold or Sage, 2 px) → 1 px Paper Cream rim.
  - Interior lines live in the face atlas and in thin mesh strips.
  - There is **no screen-space edge pass**, so the environment is never inked.
- **Animation.** Poses are JSON (bone quaternions plus scale for squash and stretch), authored in an in-page pose editor (`?tool=pose`) that shows the flat-black silhouette check.
  - **Locomotion runs on ones.** It uses a procedural gait per personality: the Braggart's fourth-step hitch, the Fraidy's stop-start, the Goofball's skip. Tail carriage is a pose layer that matches the kit's `carry` options.
  - **Actions run on twos.** Strings, finishers, Tag-In leaps, takes, Routed bolts and Pile-On flourishes are pose-to-pose clips sampled at 1/12 s of *sim* time, so hit-stop and Slow Blink lengthen the holds (art bible §8.4).
  - **Smears** are a 1–2 drawing stretch pose (×1.6 along the velocity) plus an inked multi-paw decal.
- **Humans from cat height.** Haru and Gran are built from column legs, soft-box hems, detailed shoes and socks, and **hands with ≈ 15 finger poses** (Tap-Tap, chin scratch, palm-down approach, the lift). Faces appear only in the two face events and the lap shot, as a decal on a simple head.

### 3.2 Environment (painted, unlined, from any angle)

- **Geometry** comes from `world/lane.json`: extruded walls and houses, roof prisms, fence runs, tube poles and wires, steps, the shrine set. A little vertex noise gives the hand wobble ("straight but never ruled"). Every block also emits **collision boxes** for movement and the camera.
- **Painted textures baked from the kit.** `bake-textures.mjs` runs `design/previews/kit/kit.js` in Playwright and renders its painting helpers (`surface`, `wall` with the pale coping ribbon, `fence`, `roof`, `ground`, `foliage`, `flowers`, `grass`, `cloud`, `sky`, `hill`, `sea`, `texture`). The output is packed into 2048² trim-sheet atlases per phase. Texel density is E-7 halved to fit the download: ground 256 px/m, walls 128, roofs 64.
- **The environment shader** uses a **soft 2-band sun ramp** (10–15% terminator, E-1), phase shadow tint (never grey) and baked vertex ambient occlusion, with phase uniforms that blend over ≈ 20 s. Cast shadows: on **desktop**, one 1024² shadow map that only environment surfaces receive, with wide filtering and a Wisteria tint. On **phones**, baked painted shadow decals per phase.
- **Painted from any angle:**
  - a painted sky dome per phase (`Kit.PHASES`);
  - 2–3 parallax backdrop card rings at 150–400 m (sea, the headland, the far town; E-6);
  - drifting cumulus cards;
  - **foliage clumps** of 6–12 crossed alpha-cut cards with sphere-projected normals, so each clump shades as one painted mass;
  - a fade to the horizon colour beyond 40 m;
  - pitch clamped to −10°…+55° as in the camera doc.
- **Paint post-process (desktop, decided at M0).** The environment renders to a target with depth. A fullscreen pass adds paper grain, light colour quantisation and a 3×3 Kuwahara-lite filter. **Characters render after it**, so the cels stay crisp ("printed characters, painted world").
- **Rules checked by tests:** walkable ground at L* 35–80, and the E-5 separation test (§5.2).

### 3.3 VFX (inked, flat, on twos)

- **Source.** Drawings are baked from the kit into sprite atlases: `slashArc`, `impactBurst`, `dustCloud` (an 8-drawing Pile-On loop), `speedLines`, `sparkle`, `frazzleOrbit`, `scentWisps`, `ribbon` (the Head Home thread and Tag-In streak) and the three telegraph decals.
- **Slash arcs** are world-space ribbons along each hit's authored paw path, so the three string hits read as three different arcs.
- **Speed lines** are a screen overlay that swaps between 3 drawings and keeps the centre third clear.
- **Impact frames.**
  - **Local (T3):** a disc masked to ≤ 15% of the screen.
  - **Full-screen (T4/T5):** a three-value flatten. The background becomes one mid tone matched to the frame's mean luminance (±0.10), characters become Ink silhouettes through a stencil, and the effect shape keeps its colour.
- **Onomatopoeia.** The kit's `sfx()` renders the 16 English and 16 Japanese words (art bible §10.7) at T4 (12% of screen height) and T5 (30%). They are baked to a signed-distance-field atlas and world-anchored, with at most one on screen, never over the controlled cat or the HUD.
- **The safety arbiter** (`sim/combat/safety.js`) owns the single screen-wide channel. It allows ≤ 1 full-screen frame per second, ≤ 2 flashes per second and 6 per rolling 5 s, global hit-stop ≤ 200 ms per rolling second, and ≥ 2 frames for every look event. Reduce Flashes and Reduce Motion work as specified. It filters every event before VFX and the camera receive it.

### 3.4 HUD and screens (DOM over the canvas)

- **`kit.css` is used directly** (bean panels, pom buttons, gauges, ribbons, bubbles, `k-band`, `k-drowsy`), plus `Kit.ui.*` SVG for the phase dial, button glyphs, icons, wisp rows and **chestnut portraits**. Portraits are drawn from the live coat seed, so a new Scar shows on the portrait.
- **Fonts:** M PLUS Rounded 1c and Dela Gothic One from Google Fonts, with a rounded system fallback.
- **Screens:** Title, Options, Chapter select, the street HUD, the combat HUD (`hud.md` §4.1), the Slow Blink menu, the Standoff band, the Verdict compass (hold 600 ms or press), the Morning Sniff stamp cards, the Turf Board (a top-down orthographic render with drag-and-drop portraits), the Fence Line (a side-on diorama at vFOV 20°), Pause, and the end card.
- **Sizing:** scales from `min(vw, vh)`; text floor 28 px at 1080p, 150% option. Home shows pictograms only; the HUD fades over 800 ms at the wall.

### 3.5 Look risks, fallbacks, originality

Look risks and their fallbacks are §8 risks 1–3. Technical fallbacks: hull artefacts at joints → view-space offset and depth bias on tail and ear hulls; bake drift → bakes and tests share one Chromium and baked PNGs are diffed; phones → Ink hull only plus a gold or sage ground ring.

**Originality (applies at full reference closeness too).** Original characters; our own UI shapes (no brown name tags or cloud balloons); **no inside-looking-out veranda-to-garden pet shot**; no reference names or logos on the page. The final assessment's earlier "print-stylised" recommendation is superseded by the user's reference-close decision (2026-11-24).

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

- **Music** is JSON scores played by a lookahead scheduler. Stems mute at phrase boundaries (the Melody leaves with Haru; `sound-bible.md` §4.4). The Call ducks all music by ≥ 9 dB. Hit-stop freezes the voices in its scope. The voice cap is 32.
- **Phone fallback:** `prerender-audio.mjs` renders the loops offline in headless Chromium to 22 kHz mono Opus (≈ 2.5 MB).

---

## 4. Technical architecture

### 4.1 Library and versions

- **Three.js r160.1, UMD global**, the last release that ships `build/three.min.js` (checked on npm: r161 drops it; released 2024-01-22).
  - Production tag: `<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>`.
  - At M0, check whether cdnjs (preferred) carries `https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.min.js`; switch to it if so.
  - Nothing else loads from a CDN. Any `examples/jsm` add-on is vendored into our bundle with `three` mapped to the global `THREE` (none planned).
- **Runtime:** plain DOM and kit.css, WebAudio. No other libraries.
- **Dev tooling (local only):** npm `three@0.160.1` as the CDN stand-in (the sandbox can't reach CDNs). `esbuild` bundles `src/` into one IIFE, `game.js`. Playwright 1.63 is installed globally; headless WebGL uses `--use-angle=swiftshader --enable-unsafe-swiftshader`. Unit tests use `node:test`; pixel checks use `pngjs`.

### 4.2 File layout

Code lives in **`prototypes/artifact-slice/`**: throwaway prototypes sit outside the code root (`directory-structure.md`), and the Unreal build will own `Source/`. Plans stay in `production/artifact-slice/`; evidence goes in `production/qa/evidence/artifact-slice/`.

```
prototypes/artifact-slice/
  page/index.html      # PUBLISHED fragment (no doctype/html/head/body): CSS, HUD DOM, three CDN tag, game.js
  page/dev.html        # full document, local three copy
  src/core/            loop fsm events rng clock save quality testhooks
  src/input/           keyboard-mouse gamepad touch actions
  src/data/*.json      # §4.4, mirrors the GDD tables
  src/sim/             combat/ (damage frazzle paws pileon tagin ai/ enemies tiers safety)
                       nemesis/ territory/ day/ (director overnight phases) narrative/
  src/render/          toon outline env sky foliage shadows post impact cats/ humans/ vfx/
  src/anim/            skeleton poses clips gait stepper smear
  src/camera/          rig states collision framing shake home-clamp
  src/audio/           engine mixer scheduler instruments/ sfx murmur scores/
  src/ui/              hud plates slowblink verdict sniff turfboard fenceline title chapters endcard
  src/world/           lane.json house.json lot.json builder collide
  tools/               build serve bake-textures bake-meshes prerender-audio check-budget
                       flash-analyse pixel-checks cats/*.sdf.js
  tests/unit/  tests/smoke/
  dist/                index.html game.js data/ tex/ mesh/ audio/    # the publish set
```

**The publish set is ≈ 25–40 files.** Targets: page ≤ 200 KB, `game.js` ≤ 1.5 MB, textures ≤ 8 MB with no file over 4 MB, meshes ≤ 1 MB, audio ≤ 3 MB. `check-budget.mjs` fails the build on any Artifact limit.

### 4.3 Loop and state machine

- **Loop:** a fixed 60 Hz simulation with an accumulator and interpolated rendering. Three clocks: **real** (camera, UI), **sim** (×0.05 in Slow Blink, 0 in global hit-stop, local hit-stop per entity) and **step** (sim time quantised to 1/12 s for actions on twos).
- **Top-level FSM:** `Boot → Title → ChapterSelect → {Vignette | Home | Street} ⇄ Screen(Sniff | TurfBoard | FenceLine | Pause | Options) → Overnight → EndCard`. `Street` holds Explore, WhiskerSense, Standoff and Combat; `Combat` holds Realtime, SlowBlink, Cinematic, Verdict and Gloat.
- **The director** is a JSON beat list (`beats.json`): preconditions, spawns, gates and next. Systems emit the canon events from `GDD.md` §16 (`EncounterStarted`, `CatRouted`, `VerdictApplied`, `PatchChanged`, `RaidResolved`, `TributeDelivered`, `HomeArrived`, `PhaseChanged`, …) on one bus; the director, HUD, audio and VFX only subscribe.
- **The overnight** runs canon steps 0–6 with seeded substreams `(save_seed, day, step, subsystem, cat, ordinal)`.

### 4.4 Data (mirrors the GDD; this is what transfers)

Every table is a JSON array of rows keyed by `Name`, importable straight into a UE DataTable (§7).

| File | Source |
|---|---|
| `moves.json` | Combat §3.10 fields (`id, name, style, cost, type, mv, fz, role, creates/pays_on, target, range, ai_use, flags, feel_tier`) |
| `tiers.json` | Combat §3.17, T0–T5, plus the safety caps |
| `combat_constants.json` | F1–F6 constants, poise, tokens, Frazzle decay, `ai_fill`, the R-G toggle, Pile-On k, Relay bonuses |
| `styles.json`, `personalities.json` | AI targeting, Paw habit, perk, `guard_mod`, counters, bonds and clashes, gait and tail-carriage parameters |
| `cats.json`, `snapshots/*.json` | One Cat Schema rows; the Life 2 states A and B |
| `rivals.json`, `barks.json` | Nemesis §3.5 event table and caps, Memory kinds, the Scar map, Verdicts, bark templates and tags (≤ 60 characters) |
| `patches.json`, `territory_constants.json` | Territory §3.1–3.3, the §4.5 variables, motives, §4.2 tribute |
| `camera_states.json` | Camera §3.2 table, springs, blends, collision, framing k/m/W, the face clamp |
| `phases.json` | Art bible §4.4 phase keys and Lane swatches |
| `beats.json`, `vignettes.json` | Director beats; shot lists per `dual-story-progression.md` §3.8 |
| `scores/*.json`, `sfx.json` | Music and SFX by tier |

### 4.5 Camera

`camera/rig.js` implements the `camera-system.md` states:

| State | Values |
|---|---|
| Explore | 3.0 m, +10°, recentre after 1.5 s; High Road and Low Ceiling sub-states |
| Whisker | +0.5 m, +8° |
| Combat | Framing point `lerp(C, T, 0.35)`, width 8.8–10.6 m, distance 4.5–7.2 m; soft and hard lock; Tag-In retarget 0.3 s |
| Slow Blink | 8.5 m, +50° |
| Cinematic | Standoff push-in; Pile-On wide |
| Home | 1.8 m, 0.3–0.6 m high; the §4.3 face clamp, released on Lap |
| Vignette | Authored shots; input latched across cuts |

- **Blends** use smootherstep, then the doc's half-life springs.
- **Collision:** five rays against the level boxes approximate a 0.15 m sphere-cast. The camera snaps in and eases out with a 0.4 s half-life. Camera-soft objects (laundry, slats, foliage) dither to 30%.
- **Shake** is the stepped deterministic pattern from `tiers.json`: each step held ≥ 2 frames, total clamped at 1.8%.

### 4.6 Input

- **One action map** with DR-08 bindings in `input.json`.
- **Keyboard and mouse:** WASD, LMB, RMB, Space, Shift, E, F, Tab, 1–4, Z X C V, J, Esc. **Pointer lock is optional** (toggled by a desktop click); drag-to-orbit works otherwise.
- **Gamepad:** the standard mapping.
- **Touch (landscape):** a floating left stick and right-half drag to orbit. Buttons: Attack, Hop, Skitter, Hiss/Pile-On, Brace, and **Slow Blink**, the only route to Moves. **Tapping a Posse plate switches cats** (the Tag-In window is 0.5 s on touch). Interact appears as a context bubble.
- **Constraints:** every hold has a toggle. No audio before a gesture. No `alert`, `confirm`, `prompt` or downloads.

### 4.7 Save

A try/catch wrapper around `localStorage` with an in-memory fallback. It stores the options, the chapters reached, the Verdict and snapshot, the raid seed and the post. Nothing depends on it, and chapter select is always open in showcase mode.

### 4.8 Performance budget

| | Mid laptop (Iris Xe / M1, 1080p) | Phone (2021+ mid-range, landscape) |
|---|---|---|
| Target | 60 fps (floor 50), DPR ≤ 1.5, dynamic resolution 0.7–1.0 | 30 fps, DPR 1, scale 0.75 |
| Draw calls | ≤ 350 (environment merged per block ≈ 120, cats ≤ 60, VFX ≤ 60, sky ≤ 20) | ≤ 150 (one hull, no shadow pass, no post) |
| Visible triangles | ≤ 500k | ≤ 150k |
| Texture memory | ≤ 160 MB | ≤ 80 MB (half-resolution atlases) |
| CPU per frame | sim ≤ 3 ms, submit ≤ 4 ms, audio ≤ 1.5 ms | sim ≤ 6 ms; pre-rendered music |

`quality.js` picks a tier from a 1 s GPU probe, the core count and the screen size, and steps down if frame time stays over budget for 3 s. Headless runs can't measure GPU speed, so from M2 on each milestone also logs a **manual capture on a real laptop and a real phone** with the `?fps=1` overlay.

---

## 5. Milestones

An **agent-session** is one focused session by one specialist agent (≈ 2–4 h of agent work) that ends in a reviewed, runnable build. **Every milestone ends with a publish to the same Artifact URL** (§6.3).

| # | Milestone | Deliverable (demo-able) | Acceptance | Sessions |
|---|---|---|---|---|
| **M0** | **Look-dev spike: GO/NO-GO on the art target** | Adult Mikan and one Wall Sitter (idle and walk) in **one lane corner**: plaster wall with coping, board fence, laundry pole, stone-lantern Scent Post, hydrangeas, a foliage clump, sky dome, sea card. Day and Dusk, free orbit camera. A comparison page beside `01-exploration.png` | (1) Side-by-side at the 01 framing in Day and Dusk, judged by the art- and creative-directors, then **the user**. (2) Pixel checks: line 2.0 ± 0.5 px at 1080p and at 85% scale; Ink ΔE ≤ 3; E-5 separation ≥ 20 L*; no grey shadows. (3) 8 orbit shots 45° apart, none reading as untextured 3D. (4) A silhouette strip of the 6 tail carriages. **Decision:** GO / GO with fixes / pivot to the §8 risk 1–2 fallbacks | **5–6** |
| **M1** | **Combat grey box** | The sandbox chapter: the full verb set, Tag-In and Relay, Slow Blink, Quick and Full Pile-On, the 6 Moves, personality AI, tiers and the arbiter, the combat camera and HUD | Unit tests reproduce F1–F6 worked examples (e.g. Pile-On 48 / 34.3 / 55.1 MV). The same seed and input log give the same outcome hash. A smoke run reaches a Pile-On. 10 random-pause shots. Flash screening passes on a Pile-On. The R-G toggle can be switched for A/B | **7–8** |
| **M2** | **Lane, exploration, territory** | ≈ 120 m of lane with two Patches, High Road ribbons, Whisker Sense, Rub, Spray, Claim and wisps, the Explore camera with collision, Day → Dusk with the lamp wave, the Head Home thread, the street HUD, the wall blend | A 5-min bot walk: zero frames with the camera inside geometry; the cat in frame ≥ 98%. Scent unit tests. 6 vantage shots × 2 phases. A real-device frame log | **6–7** |
| **M3** | **Rivals, Verdict, Fence Line** | The Togemaru arc over L1D1–L1D2: Standoff, sting, memory branch line, Verdict, Scars, the Fence Line, the Declaration card | Ledger tests against Nemesis §3.5 and its caps. One smoke run per Verdict checks the stored state and the branch. Screenshots of each screen | **4–5** |
| **M4** | **Home and story** | The house, Haru's and Gran's legs and hands, K1.1, K1.3, M1, Storyboard B with the piano duet and Lap, the Home camera, the Call system | No standing-adult face in 200 random free-roam frames. Shot-list screenshots. **A muted run reviewed against the Tier A lines.** The Call's pitches verified by FFT on an offline render (E4, G4, C4 ± 10 cents) | **7–8** |
| **M5** | **Day loop, overnight, full script** | The director runs §2.2 end to end: Sniff, the Lot and Turf Board, raid, the overnight diorama, the tribute morning, chapter select, the end card, both branches | Raid odds match the §4.5 worked table (Stalwart single raider 90/5/5; Pon `grudge` counter 78%). A full-run smoke test reaches the end card in states A and B with no console errors. A timed human run ≤ 15 min | **4–5** |
| **M6** | **Audio** (in parallel from M1) | Instruments, the scores, ≈ 40 SFX, Murmur, the mix, the pre-render fallback | Property test: 10k random key-walks never form the Call. Duck ≥ 9 dB. Peaks ≤ −1 dBFS. Audio-director sign-off. A 3-person "hum the Call" check | **5–6** |
| **M7** | **Polish, touch, accessibility, hardening** | Touch and the phone tier, all options, the JP sound words, Kitten difficulty, a loader, final screening | The full §5.2 suite green. A real-phone run. Flash screening on the densest capture. No horizontal scroll at 390×844. The final evidence set | **4–5** |

**Total: 42–50 sessions.** The critical path M0 → M1 → M2 → M3 → M5 → M7 is ≈ 31–36 sessions. M4 can run alongside M1–M2 after M0; M6 runs alongside from M1. With 2–3 agents in parallel that is **≈ 6–8 weeks**, plus the user's time at each gate.

**Cut order** (first cut first): the optional story fight (keep the sandbox) → JP sound words → the paint post → pre-rendered audio → the Knock tutorial → the montage shortened to 15 s. **Never cut:** the two-cat Pile-On, the memory line and Verdict, the post plus the morning pile, the Call, the piano scene.

### 5.2 Automated harness (every milestone)

- **Test hooks:** `?test=1&seed=N&chapter=X&fixedStep=1` exposes `window.__cat` with `step(n)`, `input(log)`, `state()`, `hash()` and `shot(name)`, and turns off real-time pacing so runs are deterministic.
- **Sandbox checks (Playwright):**
  - any request that is not relative, or the local stand-in for the CDN, fails the run;
  - `alert`, `confirm`, `prompt` and downloads are stubbed and asserted unused;
  - a throwing `localStorage` stub must still boot;
  - no AudioContext starts before a click;
  - the fragment has no `html`, `head` or `body` tags;
  - `THREE` exists before `game.js` runs;
  - `check-budget.mjs` passes.
- **Pixel checks:** line width by scanline; Ink and palette ΔE2000; E-5 blur-and-ring separation; no neutral-grey shadows; no HUD pixels in the bottom-centre band.
- **Flash screening** (`flash-analyse.mjs`): a fixed 60 fps capture, scored with relative luminance. It counts general and red flashes over > 20% of the screen, and full-screen frames per second, against the DR-50 caps. It is **a screening tool, not a certified Harding test**.
- **Evidence:** `production/qa/evidence/artifact-slice/M<n>/` with one line per shot.

---

## 6. How the work is run with the studio's agents

### 6.1 Roles

| Agent (model tier) | Owns |
|---|---|
| **technical-director** (`opus`) | This plan, architecture and budgets, the M0 GO/NO-GO write-up, code and performance review at every gate, final acceptance |
| **prototyper** (`sonnet`) | Build lead: loop, FSM, director, data plumbing, integration, publishing; throwaway discipline |
| **technical-artist** (`inherit`) | Shaders, the SDF cat pipeline and bakes, VFX atlases, pixel checks |
| **art-director** (`inherit`) | Look review at M0, M2, M4 and M7; pose and silhouette strips; phase keys |
| **gameplay-programmer** (`inherit`) | The combat sim, territory and raid, Verdict effects, unit tests |
| **ai-programmer** (`inherit`) | Personality AI, enemy tokens and telegraphs, the flee rule |
| **ui-programmer** (`inherit`) | The DOM HUD from kit.css, screens, touch, Turf Board, Fence Line |
| **audio-director** + **sound-designer** (`inherit`) | Instrument models, scores, the SFX map, the mix; sign-off on the Call and piano |
| **narrative-director** + **writer** (`inherit`) | Vignette shot lists, barks (≤ 60 characters), the muted Tier A review, end-card questions |
| **qa-tester** (`inherit`) | Smoke and branch runs, evidence, the timed-run checklist |
| **creative-director** (`opus`) | Taste calls at M0 and M7; art vs readability conflicts |
| **producer** (`inherit`) | Sessions against estimates; owns the cut list |

### 6.2 Review loop per milestone (maximum three iterations)

1. The owners build against the milestone's acceptance list and run the §5.2 suite.
2. **Iteration 1:** the technical-director (code, performance, fidelity to the GDD) and the domain reviewer (art-, audio- or narrative-director) each return PASS or a fix list. Every fix cites a failed acceptance item or a doc rule; taste notes go once to the creative-director.
3. **Iterations 2 and 3:** fix, then re-review.
4. After iteration 3, open items are logged as "unresolved" in the milestone notes, each with a recommended default, and the milestone ships. **Only** a broken hard constraint blocks shipping: the sandbox rules, flash safety, or a crash.
5. Publish, and show the user the link and the evidence. **The user's go opens the next milestone.** Per CLAUDE.md, agents ask before writing outside the paths a milestone names, and nothing is committed without the user's instruction.

### 6.3 Publishing

- **One Artifact, updated in place.** M0 creates it (icon "game", title "Cat RPG Showcase"). Each later milestone republishes `dist/index.html` from the same path, so **the URL never changes**.
- Supporting files go through the `files` map (`game.js`, `data/`, `tex/`, `mesh/`, `audio/`); removed files are mapped to `null`. Each publish carries a `label` (e.g. "M2 Lane and territory").
- The page has an explicit background, colour tokens, a short `<title>`, and works at phone width.
- **It stays private.** The user decides who gets the link (§8, Q4), because of the patent and style-proximity risks (`GDD.md` §19–20).

---

## 7. What transfers to Unreal 5.8 and what is throwaway

| Transfers | How |
|---|---|
| **Data tables** (Moves, tiers, combat constants, personalities, cats, Rival events, barks, Patches, raid, tribute, camera, phases) | JSON row arrays keyed by `Name` → UE DataTable import with matching `USTRUCT` rows; GDD field names kept |
| **Tuning changed in play** | Every edit is logged per milestone with its reason. It becomes the UE starting tuning and a GDD change request (`/propagate-design-change`), never a silent edit |
| **State machines and rules** (the combat FSM, personality AI rules, the beat schema, the overnight step order, event names and payloads) | Rebuilt as UE State Trees or Behavior Trees and gameplay events with the same names. The F1–F6 and §4.5 worked-example tests port as UE automation tests |
| **Feel tiers and safety rules** | The table and arbiter logic port directly; the flash screening method becomes the UE capture check |
| **Camera parameters** | `camera_states.json` → the UE camera manager and modifiers |
| **Look decisions** | Shade share, line widths, outline order, zone-tint lighting, phase keys, value bands, paint settings: kept as validated targets plus screenshots, with notes mapping each technique to a UE material (inverted hull → duplicate-shell material; zone tint → custom primitive data) |
| **Proportions and poses** | SDF cats exported to glTF as blockouts for the character artist; pose frames and silhouette strips as references |
| **Music** | JSON scores → MIDI sketches for the composer (the Call, Melody, Foundation, Lane, brawl) |
| **UX flows** | Turf Board first use, the Verdict compass, the Sniff: references for UMG |

**Throwaway:** all rendering code and GLSL, the WebAudio instruments, the DOM HUD, input, procedural meshes and gait, build tools, the director's shortcuts (snapshots, a fixed Declaration, Scar chance 100%), and all performance numbers.

---

## 8. Risks and open questions

### 8.1 Risks

| # | Risk | L / I | Mitigation and fallback |
|---|---|---|---|
| 1 | **Agents can't reach the reference look in code**, especially the cats (blobby toys) | High / High | M0 is a hard go/no-go before gameplay spend; the kit already proves the 2D grammar. Fallback: sharper SDF shapes, then a **hybrid head** (the kit's drawn front head on a camera-facing card over the 3D body) |
| 2 | **Painted-from-any-angle environments read as cheap 3D** | Med / High | Card rings, foliage clumps, distance fade, baked paint; judged on 8 orbit shots at M0. Fallback: heavier paint post, pitch clamp −5°…+35°, painted AO decals |
| 3 | **Procedural animation lacks appeal** | Med / High | Pose-to-pose on twos hides interpolation; pose editor with silhouette checks; one strong clip per verb; art-director sign-off at M0 and M1 |
| 4 | **Synthesised audio sounds cheap** or breaks the reserved timbres | Med / Med | Model acoustic timbres; a small palette (voice, bell, piano, organ carry the story); silence is a valid fallback except for the Call and the bell |
| 5 | **Phone performance and touch** | Med / Med | A quality tier, one hull, no post or shadows, Moves through Slow Blink; fallback "best on desktop" with the home chapter on touch |
| 6 | **Scope creep toward the 2.5 h slice** | Med / High | The OUT list, the cut order, the producer tracking sessions; new asks go to the Unreal backlog |
| 7 | **Headless SwiftShader differs from real GPUs** | High / Low | Fixed settings for pixel checks; real-device captures from M2 |
| 8 | **Style proximity and the nemesis patent** | Med / High | The originality rules (§3.5), a private link, legal review per `GDD.md` §20 before any public showing |
| 9 | **The flash screening isn't certified** | Low / High | Runtime arbiter caps; screening on every build; no public footage before a certified test |
| 10 | **The CDN stand-in hides a load-order bug** | Low / Med | Smoke assert that `THREE` exists before `game.js`; a manual check of the live URL after every publish |

### 8.2 Questions for the user (default applies if unanswered)

| # | Question | Default |
|---|---|---|
| Q1 | ~~Reference closeness~~ | **Settled by the user (2026-11-24): reference-close.** 3D cel-shaded characters over painted-2D-looking environments, free third-person camera, §3.5 originality rules apply. No print-stylised comparison frame is needed |
| Q2 | **Phone support** | Full touch play in landscape, simplified (Moves only through Slow Blink); portrait shows a rotate prompt |
| Q3 | **Budget**: 42–50 agent-sessions (≈ 6–8 weeks with parallel agents)? | Yes. If not, cut from the top of the §5 cut order; M0 still runs first |
| Q4 | **Audience** | A private link to named internal stakeholders until the legal review and the style call are done |
| Q5 | ~~Name on the page~~ | **Settled by the user (2026-11-24): "Cat RPG"** is the final title |
| Q6 | **Code location** `prototypes/artifact-slice/` | Yes; each milestone asks before writing there |
| Q7 | **Togemaru's Recruit branch**: support both Life 2 states? | Yes (≈ +1 session); it makes the Verdict honest |
| Q8 | **JP onomatopoeia toggle** | Include it; it is the first cut if time is short |

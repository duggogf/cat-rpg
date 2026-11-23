# Accessibility Requirements — Cat RPG

*Owner: ux-designer · Date: 2026-11-23 · Status: v1 (commissioned by DR-56; slice scope) · Canon: `design/creative-brief.md` v1.2 §8, `design/reviews/round-1/director-rulings.md` DR-08, DR-48, DR-50, DR-51, DR-54*

**What this is.** The project-wide floor. Every GDD, screen spec and build of the vertical slice must meet it; `design/ux/hud.md` and `design/ux/key-screens.md` apply it. Where a feel value in any doc (Combat's tier table, the art bible) conflicts with §1, **§1 wins** (DR-50). Requirements marked **REQUEST** are not yet agreed by the owning doc and are not promised to players until they are.

**Target tier for the slice:** motor, vision and hearing basics complete; photosensitivity verified by tool. A named tier (e.g. "Comprehensive") is not claimed until the slice audit passes.

---

## 1. Flash and motion safety (mirror of DR-50; overrides all feel values)

| Rule | Limit |
|---|---|
| General flashes | **≤ 3 in any 1 s** where the flashing area exceeds 20% of the screen (WCAG 2.3.1) |
| Full-screen impact frames | **≤ 1 per second**, enforced by a runtime budget arbiter (a second request in the same second downgrades to a local frame) |
| Local impact frames | ≤ 15% of the screen |
| Red | **No saturated red changing over > 5% of the screen** |
| Full-field speed lines | Ink or Paper Cream only |
| Onomatopoeia colour | Ink/Cream or the damage-type colour |
| Frame timing | Every "look" event lasts ≥ 2 rendered frames (no single-frame flashes at any frame rate) |
| Shake | Stepped offsets, never per-frame noise; never applied to screen-anchored HUD |
| Hit-stop | Global hit-stop ≤ 20% of any second |
| Screen-wide effects | One at a time (brief §4.1) |

**Gate:** the default configuration passes an automated **Harding-style analysis** on captured footage of: the Daifuku fight (all 3 phases), a 6-enemy encounter with a Pile-On, a Zoomies, and the Dusk lamp wave. **No public footage before it passes** (DR-03, DR-50). Re-run on any change to the tier table.

### 1.1 Options (ship in the slice)

| Option | Effect | Default |
|---|---|---|
| **Reduce Flashes** | Impact frames become a local Ink outline pulse; full-screen frames off; glyph bursts lose their white core | Off |
| **Reduce Motion** | Shake off; T4/T5 camera punches off; parallax off; HUD bump off; Fence Line replay becomes a list; Verdict cards cut instead of fanning | Off |
| Screen shake | Slider 0–100% in 25% steps | 100% |
| Hit-stop intensity | 0 / 50 / 100% (Combat confirms 0% keeps timings fair) | 100% |
| Onomatopoeia | On / Smaller (T5 at T4 size) / Off | On |
| Camera (DR-48) | FOV slider, camera speed, auto-centre toggle, motion comfort (dampened orbit, no auto-swing) | Combat/Camera defaults |
| First-launch prompt | Offers Reduce Flashes and Reduce Motion before the cold open, with a photosensitivity note | Shown once |

---

## 2. Colour-blind safety

**Rule: no game state is carried by colour alone.** Each colour signal has a named non-colour twin:

| Signal | Colour | Non-colour twin |
|---|---|---|
| Posse vs enemies | Bell-gold keyline vs Clowder outlines, each with a 1 px Paper Cream rim | Overhead chevron tick (Posse); Clowder emblem pip on enemy bars |
| Controlled cat | Bell-gold | Bell over the head + ground ring |
| Telegraphs | White / Paper Cream / Frazzle Magenta | Solid ring (dodge) / dashed + triangle (Hiss it) / zigzag edge (get out) |
| Patch owner | Clowder colour wisps | Clowder emblem on the Scent Post and Patch tag |
| Scent strength | Wisp brightness | Wisp **count** 1–4; number on the Turf Board |
| Frazzle | Magenta zigzag bar | Zigzag shape; Frazzled countdown ring + pips |
| Damage weakness / resist | Tint | Numeral frame shape |
| Household members | Yellow / teal / coral / plum | Textile motif and lightness step: Haru plain/round, Sora stripes, Koharu dots, Gran cross-hatch (art bible §4.5) |
| Call glyph | Singer's colour | Shape codes the voice (Haru: three smooth arcs) |
| Disabled UI | — | Halftone overlay, contrast ≥ 3:1 (DR-51) |

**Tests:** every combat, street and screen capture in the slice is checked under deuteranopia, protanopia and tritanopia simulation and in greyscale; each signal above remains distinguishable. Sage (`#A8C878`) against Bell-gold and Magenta is the known risk pair; the rim and shape twins must carry it.

A colour-blind palette preset is **not** required if the twins pass; it moves to Backlog.

---

## 3. Deaf and hard-of-hearing parity (the music-told story)

The human story is told partly by music (the Call, Haru's piano, the Dusk chime) and Murmur. The language rule forbids subtitles for humans, so **parity comes from visual carriers, not captions** (DR-54; carriers drawn by Art).

| Audio event | Visual carrier |
|---|---|
| **The Call** (Haru's sung motif) | **Call glyph always on**: three smooth Haru-Yellow arcs drawn as the Call's contour, from the singer's direction; Sora's whistle and later voices use their colour and a different shape |
| The bell's fourth beat | A bell glint on Mikan's collar on the downbeat |
| The Dusk chime | **The Dusk lamp wave** runs uphill with the chime |
| Off-screen sound at home | Mikan's ear-and-head turn + an **ear Sense Icon** pointing at the source |
| Murmur tone | **Tone Sense Icons over Mikan** (warm, sad, sharp, laughter), authored per vignette. Never a translation |
| Haru's piano | Visible hands and keys; tone Sense Icon for how it sounded (badly at 16) |
| A Rival's yowl-sting | **Sting contour glyph** on the name-card and Rival card, so the sting can be learned by sight |
| Rival Ambush yowl-sting | Directional edge flare with a 2.0 s drain arc; the last 0.75 s (the counter window) turns Ink |
| Telegraph vocals | Every telegraph has a ground decal and an overhead glyph |
| Caterwaul | TL flare + edge arrow + shrinking ring |
| Tag-In bell tick | Spark ring + plate glyph pop |
| Cat speech | Already readable text balloons |
| Combat feel | **Haptics on by default** (impact tiers mapped to rumble; Call and bell as gentle pulses at home) |

**Settings:** speech balloon size (100/125/150%); balloon background opacity 100% (fixed); "More Sense Icons" (adds tone icons to Textures as well as Keystones); haptics intensity 0–100%.

**Test (DR-03):** every Keystone's Tier A fact reaches **90% of unbriefed testers with audio muted**. Include deaf and hard-of-hearing players in the slice playtest panel and before the slice gate.

**Language veto applies to accessibility:** no setting may caption, translate or paraphrase human speech or writing. Scribble never becomes readable at any text size.

---

## 4. Hold and toggle

Every hold has a toggle; every chord has a single-button alternative (DR-08).

| Hold / chord | Alternative |
|---|---|
| Whisker Sense (R2 / Tab hold) | Toggle |
| Stalk (L2 / Ctrl hold) | Toggle |
| Dash → sprint (East hold) | Toggle sprint / auto-sprint after 1 s |
| Brace (R1 / RMB hold) | Toggle (cancelled by any attack or Skitter) |
| Head Home (D-pad Down / H hold) | Single press opens the thread |
| Shortcut layer (L1 hold + face) | Toggle layer (tap L1, then the face button within 2 s) |
| Zoomies (L1 + R1) | Bind to one button |
| Verdict hold-to-commit (600 ms) | Press, then confirm |
| Unskippable 1 s memory line | Kept (story rule); no input needed during it |
| Repeated mashing | None required anywhere; the 3-hit string is three presses, not a hold |

---

## 5. Slow-mo and timing assists

| Assist | Status |
|---|---|
| **Slow Blink full pause** (time 0% instead of 5% while the menu is open) | Agreed; slice |
| Difficulty: Kitten / Alley (default) / Feral (brief §8) | Agreed; scales enemy Nerve, damage, aggression only |
| Longer telegraphs, generous Ambush counter window | Agreed (Combat values) |
| Auto lock-on | Agreed |
| Damage numerals Off | Agreed |
| **Auto Slow Blink** (opens when a cat gains a Paw while no telegraph is live) | **REQUEST** to Combat; highest-value missing assist |
| **Wider Tag-In window** (e.g. 0.35 s → 0.6 s) | **REQUEST** to Combat |
| **Combat speed 70% / 85%** | **REQUEST** to Combat |
| **Hold-to-string** (hold Attack runs the 3-hit string) | **REQUEST** to Combat |

Cut: Slow Blink at 2% (no distinct need), "Crew initiative" (Tactics are Backlog).

---

## 6. Text size and legibility

- **Floor: 28 px at 1080p / 18 px at 720p** for every glyph-bearing element, including damage numerals and balloons (DR-51).
- Text scale: 100 / 125 / 150%; HUD scale 80–150%. Layouts must hold at 150% at 1280×720 without overlap or clipping (verified by capture).
- Contrast: 7:1 target, 4.5:1 minimum for text on panels; disabled ≥ 3:1; world-anchored text on its own backing or with a 3 px Ink outline.
- Collar Crimson fills carry Cream text (DR-51).
- Lettered onomatopoeia is art, not text; it is exempt from scaling but never carries information required to play.
- Icons ≥ 40 px at 720p; every icon has a legend entry (View hold).

---

## 7. Remapping

- **Full remapping** of every action on gamepad and keyboard/mouse, separately per context (exploration, combat, Slow Blink, menus), from the DR-08 default.
- Conflict detection within a context; the same input may be reused across contexts.
- Positional naming in the UI (West/North/South/East) with the current device's glyphs; **all prompts read the live binding**.
- Mouse: sensitivity, invert X/Y; stick: sensitivity, invert, dead zones.
- Presets: Default, Left-handed keyboard (arrow cluster). One-handed presets are Backlog until prototyped.
- Remaps persist per profile and survive device swaps mid-session.

---

## 8. Cognitive load and comfort (slice)

- Suspend-on-quit anywhere; autosave each phase (DR-15).
- No time-pressure fail states (anti-pillar); the clock pauses in combat, menus, the Lot and at home.
- Hint log in Options; hint cards dismissible.
- Content note (opt-in, in Options) for the home story's themes (E-6 default).

---

## 9. Acceptance checklist (slice gate)

- [ ] Harding-style analysis passes on the four captures (§1).
- [ ] Reduce Flashes and Reduce Motion each verified on the same captures.
- [ ] Every signal in §2 distinguishable under three CVD simulations and greyscale.
- [ ] Tier A facts reach 90% of testers with audio muted; deaf/HoH players on the panel.
- [ ] Every hold and chord in §4 has a working alternative.
- [ ] The slice is completable with keyboard only, and with gamepad only.
- [ ] All text meets §6 at 1080p and 720p, at 150% scale.
- [ ] Every action remappable; prompts update live.
- [ ] String audit: no human speech or writing rendered in any setting.

---

## Backlog (post-slice)

- Agreement and implementation of the four Combat REQUESTs (§5).
- One-handed presets (prototype the right-stick-moves preset first).
- Colour-blind palette presets (only if the twins fail testing).
- Handheld (720p device) verification of §6 and §1 (E-5).
- Screen-reader / menu narration for system UI (never for human content).
- Life 8 carriers (the silenced Call; Home Scent note) per Narrative §9.
- Full-game audit against a named accessibility tier.

## Revision Log

**2026-11-23, v1 (new doc commissioned by DR-56; carries UX-10 and accessibility rulings).**

| ID | Status | How |
|---|---|---|
| UX-10 | FIXED | Agreed assists listed (§5); Slow Blink 2% and Crew initiative cut; Auto Slow Blink, combat speed, hold-to-string kept as REQUESTs marked unagreed; no tier claimed until audit; household motifs cited (§2); one-handed presets to Backlog. |
| UX-X14 | FIXED | Text floor 28 px / 18 px (§6). |
| UX-X17 | FIXED (safety side) | Full-screen impact frames rate-limited to 1/s by a runtime arbiter (§1); the tier table itself is Combat's (DR-07). |
| UX-8 (deaf/HoH part) | FIXED | Ear and tone Sense Icons replace sound chips and Murmur Ribbons (§3). |
| DR-50, DR-51, DR-54 | IMPLEMENTED | §1, §2/§6, §3. |

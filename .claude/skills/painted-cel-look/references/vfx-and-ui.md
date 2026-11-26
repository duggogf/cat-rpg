# VFX and UI in the painted-cel look

Source: `design/art/art-bible.md` §7 (UI) and §10 (combat VFX).

## VFX are cels

1. **Every effect is a drawing:** hard-edged, 2–3 flat tones (a cream core, one colour, ink edge), on twos,
   3–8 drawings long. No soft particles, additive glows, gradients or fading sprite trails.
2. **Shape first, colour second** — damage types differ by shape (claw = three thin tapering crescents;
   thump = expanding thick cream ring with ink edge; sound = concentric wavy crescents; heal = soft rising
   rings with hearts, the only gentle effect).
3. **Effects end by breaking** into 2–3 wedges or dots, or a halftone dissolve; never an alpha fade.
4. One screen-wide effect at a time. The player's character is never covered.
5. No liquid, ever (water is opaque flat blobs).
6. Slash arcs follow the real limb path, sit in world space facing the camera, ≥ 4 px thick.
7. Hit flash on a character: a cream flash for ≥ 2 rendered frames (~120–150 ms), character-local.
8. Damage numbers: chunky rounded numerals, spawned in world space at the target's position (not glued to
   it); red for damage taken by the player's side.

## Lines, impact frames, cut-ins

- **Speed/action lines:** ink wedges of uneven length; swap between 3 drawings on twos, never scroll.
  Local streak (behind a dashing character), radial focus (centre third kept clear), full-field (scene
  replaced by a flat colour panel with ink/cream lines).
- **Impact frame:** drawing 1 = limited-palette inversion (background one mid tone matched to the frame's
  mean luminance ±0.10, figures solid ink with cream lines, effect keeps its colour); drawing 2 = a local
  cream flash on the effect shape; then hit-stop on the normal pose with the line +1 px.
- **Special/finisher cut-ins:** camera punches in, time stops, only the character renders over a flat
  impact background (radial lines, a panel in the character's colour, value-matched), ~1 s.
- **Screen shake:** stepped offsets, one new offset per 33 ms, never continuous jitter.
- **Onomatopoeia:** hand-lettered drawings, readable, ≤ 30% screen height, never over the player or HUD.

## Flash safety (overrides every drawing)

- ≤ 3 luminance flashes per second; any full-screen panel's arrival counts as one.
- Full-screen colour changes are value-matched or enter behind a ≥ 3-drawing halftone wipe.
- A "Reduce flashes" option turns impact frames into a line-thicken + freeze.
- Prototype tooling: a screener that counts flashes per second and saturated-red area changes in captured
  frames.

## UI: warm, rounded, bubbly paper

- Panels are opaque **beans** in Paper Cream `#FFF6E3` with a Cocoa `#6B4A35` frame (3 px at 1080p) and a
  soft Wisteria drop shadow (3 px offset). Not translucent, not glassy, no painted texture.
- Buttons are **poms** / pill-beans; primary = Cocoa fill with cream text; confirm = Collar Crimson with
  cream text only.
- Portrait windows are **chestnuts** (head-shaped), never circles. Name ribbons in the faction colour.
- Speech balloons: opaque cream beans with a wedge tail and Cocoa frame.
- Type: one rounded sans (e.g. M PLUS Rounded 1c, OFL), two weights; body 32 px at 1080p, floor 28 px;
  ink on cream (13:1).
- Motion: bouncy and stepped — pop in 110% → 100% over 3 drawings, press squash 92%, nothing eases
  smoothly for longer than 200 ms; transitions are halftone wipes or a pom iris, not cross-fades.
- Menus that show characters (e.g. a rival roster) stage the 3D cels as a calm diorama with the painted
  world behind; keep it uncluttered — the owner rejected a crowded first version. Undiscovered characters
  are flat silhouettes.

# Palette and values

All hex values are sRGB as they must arrive on screen. Use them as raw numbers in shaders (no colour
management, no tone mapping). Source of truth for Cat RPG: `design/art/art-bible.md` §4.

## Core palette (12)

| Name | Hex | Role |
|---|---|---|
| Aubergine Ink | `#33273B` | Every character, prop and VFX line; UI body text. "Our black." |
| Paper Cream | `#FFF6E3` | UI ground, balloons, dust clouds, outline rims |
| Cocoa | `#6B4A35` | UI frames, headers, primary buttons (cream text) |
| Hero accent (Mikan Ginger) | `#F28C28` | Reserved for the protagonist; never in environment palettes |
| Collar Crimson | `#D02A45` | One "confirm"/love accent; never damage |
| Bell-Gold | `#F2B01E` | Player-side: ally outline, player's marks |
| Haru Yellow | `#FFD23F` | A household human's colour (indoors) |
| Shadow Wisteria | `#6E6AA8` | The shadow family everywhere. **No grey or black shadows.** |
| Summer Sky | `#3F9BE6` | Day sky zenith |
| Garden Green | `#5A9E4B` | Gardens, hedges, hills |
| Wall Sitter Sage | `#A8C878` | An enemy group colour |
| Frazzle Magenta | `#FF3D8B` | Loudest combat state / red-class telegraph |

Enemy outline in combat: Rival Vermilion `#E04A2C` (with a shape cue — an overhead chevron — so colour is
never the only signal).

Rule of thumb when adding colours: each human, each faction, each time-of-day *owns* one colour; keep
semantic colours ≥ ΔE2000 15 from environment swatches and each other, including under protan/deutan/tritan
simulation. If a clash appears, move the environment swatch, not the identity colour.

## Tone rules

- Every cel colour has exactly **two tones** (lit, shade). Author the shade: hue +8–15° toward violet,
  saturation +5–10, value −18–24 (HSV). Whites → lavender `#D8D2EA`.
- Shade share on a character in the day key: **15–25%**, hard terminator.
- Walkable painted ground: L* 35–80, local contrast ≤ 15 L*. Cels own the value extremes.
- Saturation: painted backgrounds ≤ 70% HSV, sky ≤ 75%, cels/VFX/hero objects ≤ 90%.
- Contact blob: Shadow Wisteria at 45%, feathered.

## Example environment swatches (a sunny seaside lane)

| Role | Hex |
|---|---|
| Plaster (dominant) | `#F3E3C3` |
| Sun-baked lane ground | `#B9AC93` |
| Garden green | `#5A9E4B` |
| Accent (hydrangea) | `#7E8FD8` |
| Roof tile | `#6F8296` |
| Warm wood | `#C28A52` |
| Laundry white | `#FFFDF4` |
| Lamp (night glow) | `#FFD98A` |

## Phase keys

The table from the art bible (all four phases):

| Phase | Sky zenith | Sky horizon | Key light | Shadow | Cel tint |
|---|---|---|---|---|---|
| Morning | `#BFE3F2` | `#FFE9C7` | `#FFF4DC` | `#8FA0CF` | `#FFF6E8` |
| Day | `#3F9BE6` | `#A9DBF5` | `#FFFBEF` | `#6E6AA8` | `#FFFFFF` |
| Dusk | `#8E6FB0` | `#F7A45A` | `#FFC27A` | `#7A4E8C` | `#FFDDB5` |
| Night | `#1F2F6B` | `#3F5FB0` | `#BFD4FF` | `#2A3470` | `#B8C8F5` |

At night, dark-coated characters swap their line to a reverse ink `#8C82A8` so the silhouette survives.
Night keeps a value floor of L* 22 in the play space with warm lamp pools; end-of-phase vignettes are
cream, never dark.

### Implemented values (Day, Dusk) — `assets/reference-impl/phase-keys.js`

| Key | Day | Dusk |
|---|---|---|
| sun elevation / azimuth (°) | 58 / −62 | 16 / 3 |
| shadeK (shade = albedo × mix(1, tint, k)) | 0.60 | 0.62 |
| shadowTint | `#6F6CC4` | `#7A4E8C` |
| bounce / bounceK | `#FFD9A0` / 0.22 | `#FFB070` / 0.20 |
| haze / max / near / far (m) | `#D6ECF6` / 0.62 / 22 / 260 | `#F4B98C` / 0.70 / 18 / 220 |
| cloud light / shade | `#FFFFFF` / `#C9D8F0` | `#FFD9A6` / `#B88FBE` |
| backdrop key | `#FFFFFF` | `#FFD2A0` |
| sun glow / k | `#FFF6D8` / 0.55 | `#FFE0A0` / 0.90 |
| character key / shade | `#FFFBEF` / `#6E6AA8` | `#FFC27A` / `#7A4E8C` |
| character key dir | (−0.35, 0.906, 0.24) | (0.45, 0.80, 0.30) |
| vertical lift | 0.50 | 0.35 |
| window glow | 0 | 0.9 |

Blend phases by lerping every field (colours in sRGB) over ~20 s.

## Numeric constants that define the look

| Thing | Value |
|---|---|
| Silhouette line | 2.0–2.5 px at 1080p (× rtHeight/1080); interior 1.25 px; < 4% screen height → 1 px, no interior |
| Cel terminator | hard; AA = fwidth(ndl) × 0.75 |
| Env ramp | smoothstep(−0.04, 0.16, ndl) |
| Foliage ramp | smoothstep(−0.35, 0.45, ndl), shade lifted 18% |
| Shadow PCF | 12-tap rotated Poisson, 2048² map, soft ≈ 2.6 texels |
| Paint post | wobble 1.8 px, Kuwahara 4×(2×2), grain 10% |
| Sky gradient | over 0–22° elevation; brush ±18% |
| Dither floor | 30% (Bayer 4×4) |
| Animation | actions/VFX on twos (12 fps), locomotion on ones |

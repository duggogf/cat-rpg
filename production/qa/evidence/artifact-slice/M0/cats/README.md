# M0 cats: look-dev evidence (character half)

Captured 2026-11-24 with `node tools/shot.mjs` (headless Chromium + SwiftShader, 1920×1080, DPR 1) from
`prototypes/artifact-slice/dist/catlab.html`. All frames are deterministic (`t=` steps the sim at 1/60 s).
Day key unless noted (art bible §4.4: key `#FFFBEF`, shade `#6E6AA8`, sun ≈ 65°). Cat scale 1.25.

| File | What it shows | Lab URL query |
|---|---|---|
| `01-front34-day.png` | Mikan + Wall Sitter, front 3/4, third-person camera height (0.95 m, 2.0 m) | `view=front34&dist=2.0&h=0.95` |
| `02-side-day.png` | Side profile, idle | `view=side&dist=2.0&h=0.95` |
| `03-back34-day.png` | Back 3/4: the gameplay read (cap, collar, back, tail) | `view=back34&dist=2.0&h=0.95` |
| `04-walk-midstride-side.png` | Walk mid-stride at 0.6 m/s, side | `view=side&gait=walk&speed=0.6&dist=2.0&h=0.75` |
| `05-tail-carriages-silhouette.png` | M0 test (4): six personality tail carriages on one generated cat, flat black, from behind at exploration-camera height. Left to right: flag (Braggart), post (Stalwart), spring (Goofball), blade (Schemer), anchor (Brooder), comma (Fraidy) | `strip=1` |
| `06-tail-carriages-colour.png` | Same six, in colour | `strip=1&sil=0` |
| `07-explore-distance-back-day.png` | Mikan from behind at the Explore camera (3.0 m), cf. `design/previews/01-exploration.png` | `view=back&cast=mikan&dist=3.0&h=1.05` |
| `08-back34-dusk.png` | Same as 03 under the Dusk key (`setLighting` phase change) | `view=back34&phase=dusk&dist=2.0&h=0.95` |
| `09-closeup-faces.png` | Close-up: face decals (kit `faceFront` eyes, nose, mouth; Wall Sitter smug lids) | `view=front34&cam=close` |
| `10-walk-back34.png` | Walk from behind 3/4 | `view=back34&gait=walk&speed=0.6&t=1.3` |

Measured: silhouette ink runs on `02` are mostly 2 px wide at 1080p (L-3 target 2.0 ± 0.5). The 1 px runs are antialiased edge pixels. This is a quick scanline count, not the §5.2 harness check.
Cost: 2 cats = 8 draw calls, ≈ 43.5k triangles drawn (fill + hull); about 11k triangles per cat mesh.

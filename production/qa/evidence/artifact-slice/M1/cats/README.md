# M1 cats: the slice cast lineup

Captured 2026-11-24 with `node tools/shot.mjs` (headless SwiftShader) from `prototypes/artifact-slice/dist/catlab.html?lineup=1`. Day key; cat scale 1.25 × rank.

**Lineup, left to right:** mikan, hige, pon, kinako, togemaru, kagi, daifuku, then tough1 (cream tabby, Brooder), tough2 (charcoal bicolour, Stalwart, stub tail) and tough3 (silver solid, Schemer).

| File | What it shows | Lab URL query |
|---|---|---|
| `00-lineup-sheet.png` | The three rows below, stacked | composed |
| `01-lineup-front34-day.png` | Front 3/4: the faces and per-personality expressions | `lineup=1&view=front34&fov=26` |
| `02-lineup-back34-day.png` | Back 3/4: the gameplay read | `lineup=1&view=back34&fov=26` |
| `03-lineup-back-silhouette.png` | Flat black from straight behind, at the 3 m Explore camera height: build, ears, tail carriage and scars only | `lineup=1&view=back&sil=1&h=1.5` |
| `04-scars-togemaru-hige.png` | Silhouette Scars up close: Togemaru's deep V notch (his right ear, viewer's right front-on) and spiky cheek ruff; Hige's notched ear | `cast=togemaru|hige&angle=0|180` |

## Casts (createCat signature unchanged; all are additions)

| cast | Build | Ears | Tail and carriage | Coat | Scars / regalia | Rank |
|---|---|---|---|---|---|---|
| `hige` | Long, heavy jowls | tall | whip, post (Stalwart) | grey solid | notched right ear | 1.0 |
| `pon` | Round | round, left ear half-folded | plume, spring (Goofball) | white calico (marmalade, charcoal) | — | 0.9 |
| `kinako` | Long | huge | whip, comma (Fraidy), ears back, half-crouch | fawn, seal points | — | 1.0 |
| `togemaru` | Long | standard | plume, flag (Braggart) | black-and-tan tuxedo | notched left ear (+X), cheek ruff | 1.0 |
| `kagi` | Long | tall | whip, blade (Schemer), ears swivel | silver, slate tabby | cream clothes-peg on his right ear | 1.15 (Captain) |
| `daifuku` | Huge (Round at maximum puff) | round | stub, anchor (Brooder) | white with grey saddle and cap | folded jowls | 1.6 (Boss) |
| `tough` | `build`: round / standard / long | `ears`: standard / tall / round | `tail`: whip / plume / ringed / stub; `personality` → carriage | `coat` + `pattern` (solid, bicolour, tabby, patched, pointed, tuxedo, saddle) | — | `rank` |

## Cost

- **Per cat:** about 23k triangles per mesh (Mikan 24.5k with collar and bell), drawn as fill + hull. 4 draw calls per cat.
- **Shared mesh parts:** 34 parts cover all 7 named casts and all 36 tough combinations, about 4 MB of binary (about 5.4 MB as base64 JSON).
- **Shared shader:** every cat except Mikan and the M0 wallSitter shares one generic coat shader. The pattern is a uniform.

## Known weak spots

- Daifuku's grey cap reads a little like a helmet in front 3/4.
- From straight behind, Mikan's curled long tail and stub-tailed toughs leave the silhouette to the ears and build.

## Level of detail (M1 performance)

| File | What it shows |
|---|---|
| `05-lod-full-vs-low-5m-7m.png` | The 10-cat lineup from an elevated combat camera (fov 45°, 2.2 m high). Rows: 5 m full, 5 m low, 7 m full, 7 m low. Silhouette, faces, ink weight and tail carriage read the same |
| `06-lod-full-vs-low-7m-zoom2x.png` | The first four cats at 7 m, enlarged 2×: full (top) against low (bottom) |

- **How it works:** each part bakes a second, decimated index over the same vertices, so the LOD costs index data only (+0.4 MB). Each cat has its own geometry that shares every buffer and picks the full or low index range through its two groups. Extra hull shells built on the cat's geometry (the combat keyline and rim) therefore follow the LOD automatically.
- **Selection:** `auto` (default) uses the full mesh above 18% of screen height and the low mesh below 15%. `Cat.setLod('full')` is for the controlled cat. `createCat({ lod })`, `Cat.lod` and `Cat.triangles` are additions.
- **Rim:** a shell named `keyline-rim` in the cat's subtree is hidden below 5% of screen height.
- **Triangles per pass:** Mikan 24.5k full / 7.2k low; the other casts 23k / about 6.8k.

**10-cat brawl, per pass** (controlled cat forced to full):

| Camera distance | Per pass | Fill + ink + keyline + rim (4 passes) |
|---|---|---|
| 7 m | 85.8k | about 343k |
| 4.5 m (Daifuku stays full because he is large on screen) | 102k | about 408k |

Before LOD, the same brawl drew about 0.86–0.92M triangles.

# Cat RPG preview art kit

Shared drawing kit for the static mock screenshots in `design/previews/`. It is not game code. Every frame built from it should look like the same game: **ink what acts, paint what stays** (`design/art/art-bible.md` §1.1).

- **Inked cels** (cats, humans, props a cat can act on, VFX): flat two-tone fills, one even Aubergine Ink line (2.5 px on screen at any scale), shade by lavender multiply.
- **Painted world** (sky, clouds, foliage, walls, ground): no line; layered flat shapes pushed through SVG turbulence/displacement filters.
- **UI**: opaque cream-and-cocoa beans, poms and chestnuts from `kit.css`.

## Render

```
node design/previews/render.js <file.html> <out.png>     # 1920x1080, deviceScaleFactor 1
node design/previews/render.js design/previews/kit/sheet.html design/previews/kit/sheet.png   # model sheet (full page)
```

## Page skeleton

```html
<link rel="stylesheet" href="kit/kit.css">
<div class="k-stage" id="stage"></div>
<script src="kit/kit.js"></script>
<script>
  const K = Kit, s = [];
  s.push(K.sky({ w: 1920, h: 470 }), K.cloud({ x: 1200, y: 350, w: 700, h: 400, seed: 3 }));
  s.push(K.cat({ ...K.CAST.mikan, pose: 'back', x: 900, y: 930, scale: 2.1 }));
  stage.innerHTML = K.svg(1920, 1080, s.join(''), 'class="k-world"')   // K.svg adds the filter <defs>
    + `<div class="k-abs k-prompt" style="left:1180px;top:300px">${K.ui.faceButtons({})}${K.ui.icon({ name: 'spray' })}Spray</div>`;
</script>
```

Everything returns an SVG string. Positions are in stage pixels. Paint order is the order you push. `01-exploration.html` is the worked example (it also shows the one-line perspective helper used to place things in a third-person view).

## Characters

**`Kit.cat(o)`**: origin at the ground under the cat; `scale: 1` is about 105 px to the ear tips.

| Option | Values |
|---|---|
| `pose` | `back` (from behind: the exploration camera) · `side-walk` · `side-pounce` · `front-sit` · `loaf` · `hiss` · `frazzled` |
| `coat` | `{base, white, patch, patch2}` hexes, or a `Kit.COATS` key (white, cream, silver, grey, charcoal, black, marmalade, chocolate, fawn, seal; `ginger` is Mikan's) |
| `pattern` | `solid` · `bicolour` · `tabby` · `patched` · `pointed` · `tuxedo` · `saddle` · `mikan` |
| `tail` | `whip` · `plume` · `ringed` · `stub` · `pom` (Mikan only) |
| `carry` | tail carriage = personality: `flag` (Braggart) · `anchor` (Brooder) · `blade` (Schemer) · `comma` (Fraidy) · `post` (Stalwart) · `spring` (Goofball) · `level` |
| `ears` / `build` | `standard` · `tall` · `round` / `round` · `standard` · `long` |
| `scars` | array of `notch` · `fold` · `kink` · `puff` · `cowlick` · `plaster` |
| `collar` | `bell` (red collar + brass bell, Mikan only) · `cord` (Bell Clowder gold cord at the tail base) |
| `outline` | `ink` (exploration) · `gold` (Posse keyline + cream rim) · `sage` (Wall Sitters) · `stray` · `magenta` (Frazzled) · `reverse` (dark coats at Night) |
| `eye`, `expr` | amber, green, yellowgreen, blue, copper · neutral, smug, angry, happy, sleepy, shock, hiss, spiral |
| `x`, `y`, `scale`, `flip`, `shadow`, `lw` | placement; `flip` faces left; `lw` is line width in screen px |

**`Kit.CAST`**: ready-made cats to spread into `cat()`: `mikan`, `daifuku` (use ~1.6x), `oldWallCat`, and one per personality: `braggart`, `schemer`, `goofball`, `fraidy`, `brooder`, `stalwart`. Example: `K.cat({ ...K.CAST.schemer, pose: 'hiss', outline: 'sage', x: 600, y: 800, scale: 1.4 })`.

**`Kit.human(o)`**: a human as a cat sees them (legs, hem, shoes, one hand; drawn up to the chest so the frame crops the rest). Same units as the cats. `pose`: `walk` (side) · `stand` (front) · `reach` (crouched, hand offered). `palette`: `street`, `streetB`, `haruUniform`, `haruHome`, `gran`, or `{skin, bottom, top, sock, shoe, sole, bag, accent}`. `garment`: `skirt` · `trousers` · `shorts`. `carry`: `bag` · `none`. Plus `x, y, scale, flip, shadow`.

**Inked props**: `Kit.stoneLantern({x, y, scale})` (a Scent Post), `Kit.prop({kind: 'pot' | 'bucket', x, y, scale})`. For your own props use `Kit.celGroup({parts: [{d, fill}], shade, lines}, {lw: 2.5, ol: Kit.OUTLINES.ink})` or `Kit.inked(d, fill)`.

## Painted world (never outlined)

| Helper | Draws |
|---|---|
| `sky({w, h, phase})` | gradient sky; phases `morning`, `day`, `dusk`, `night` (`Kit.PHASES` has the keys) |
| `cloud({x, y, w, h, seed})` | towering cumulus; `x` centre, `y` base line |
| `foliage({x, y, w, h, seed, far, tones})` | gouache leaf clump; `far: true` for hazy distance |
| `flowers({x, y, w, h, color})`, `grass({x1, y1, x2, y2, n, h})` | hydrangea clusters, grass tufts along a line |
| `surface({pts, color})` | any painted polygon (plaster, wood, stone) with gradient, grain and grime |
| `wall({quad, color, copingH})` | plaster wall with a pale coping ribbon (the High Road read) |
| `fence({quad, n})`, `roof({quad, rows, cols})` | board fence, tiled roof; `quad` = `[tl, tr, br, bl]`, so they follow perspective |
| `ground({pts, color})` | sun-baked lane with flat gouache strokes |
| `pole({x, y, h, w})`, `wires({pts, sag})`, `sea({x, y, w, h})`, `hill({pts, baseY})` | utility pole, wires, sea band, far headland |
| `shadow({x, y, rx, ry})` | soft contact shadow (already under every cat, human and prop) |
| `castShadow(d, opacity)`, `glow(x, y, rx, ry, color, opacity)` | Wisteria cast shadow (never grey), warm light pool |
| `texture(x, y, w, h, kind, opacity)` | paint grain overlay: `grain`, `brush`, `brush-v`, `mottle`, `mottle-light` |

Filters available on any element: `filter="url(#k-rough)"` (hand wobble), `k-leaf`, `k-leaf-fine`, `k-cloud`, `k-dab`, `k-soft`, `k-soft2`, `k-soft3`, `k-dry`.

## VFX (inked, flat, no glow)

`slashArc({x, y, r, a0, a1})` · `speedLines({mode: 'parallel' | 'radial', x, y, w, h, angle, count})` · `impactBurst({x, y, r, star, color})` · `dustCloud({x, y, r, puffs})` · `scentWisps({x, y, count, color, h})` · `ribbon({pts, color, width})` (Head Home thread, Tag-In streak) · `sfx({text, x, y, size, rot, color})` (lettered sound word) · `sparkle({x, y, r})` · `frazzleOrbit({x, y, r})` · `ticks({x, y, r, n})` · `telegraph({kind: 'white' | 'yellow' | 'red', x, y, rx, ry})`.

## UI

CSS classes (`kit.css`; palette is on `:root` as `--ink`, `--cream`, `--cocoa`, `--gold`, `--sage`, and so on):

- `.k-panel` (bean panel; `--recessed`, `--sm`) · `.k-h`, `.k-body`, `.k-small` (44 / 32 / 28 px)
- `.k-bubble` (bark balloon with wedge tail; `--up`, `--right`, `--notail`) with a `.k-ribbon` name tag inside (`--gold`, `--sage`, `--stray`)
- `.k-btn` (pom button; `--primary`, `--confirm`, `--focus`, `--disabled`, `.k-key`) · `.k-prompt` (glyph + pictogram; `--hold`)
- `.k-gauge` with `<i>` fill and `style="--v:60%"` (`--low`, `--zoomies`, `--frazzle`) · `.k-pads` · `.k-pill` (`--gold`, `--sage`, `--cream`, `--crimson`)
- `.k-patchtag` · `.k-band` (wedge-ended Standoff band) · `.k-drowsy` (cream edge vignette) · `.k-abs` (absolute positioning on the stage)

SVG pictograms: `Kit.ui.phaseDial({phase, t, size})`, `ui.paw({size, fill})`, `ui.faceButtons({lit})`, `ui.dpad({lit})`, `ui.icon({name})` (`spray`, `sniff`, `nap`, `bell`, `brick`, `fish`, `heart`, `storm`), `ui.wispRow({n})`, `ui.portrait({cat, ring})` (chestnut window).

## House rules

1. Never outline the environment; never leave a character, interactive prop or VFX drawing unlined.
2. Shadows are Shadow Wisteria (`castShadow`, `shadow`), never grey or black.
3. Mikan Ginger, the pom tail and the red collar belong to Mikan alone.
4. Human writing is Scribble (illegible strokes). Only cat speech and system UI are readable text.
5. UI stays in the corners; the bottom-centre band belongs to the cat.
6. Fonts are local (`kit/fonts`): M PLUS Rounded 1c for UI, Dela Gothic One as the stand-in for hand lettering.

# M0 look-dev: creative director review

PROTOTYPE - NOT FOR PRODUCTION. Reviewer: creative-director. Date: 2026-11-24.
Scope: milestone M0 of the browser showcase (artifact slice), environment and cat halves.

**Target (owner's decision):** the look of *Shin chan: Shiro and the Coal Town*: cel-shaded 3D
characters that read as 2D cartoon cels, over environments that read as lush painted anime
backgrounds, with a free third-person camera. Characters and world are original.

**Evidence read:** `design/reviews/refs/style-reference.webp`, `design/previews/01-exploration.png`,
`env/compare-01.png`, `env/compare-01-day-full.png`, `env/compare-01-dusk-full.png`,
`env/view01-day.png`, `env/orbit-day-sheet.png`, `env/orbit-dusk-sheet.png`,
`cats/01-front34-day.png`, `cats/03-back34-day.png`, `cats/09-closeup-faces.png`,
`cats/10-walk-back34.png`, both evidence READMEs, art bible §mood table (Explore Day / Dusk rows),
creative brief §2 Pillars.

---

## Verdict: GO WITH FIXES

**Show the owner now, as a direction check. Show stakeholders only after fixes 1 to 3.**

The core bet works. The split the reference depends on, inked cel characters over un-inked
painted ground, is already on screen and it is right. At the 01 framing (`view01-day.png`), a
stranger would call this an anime alley, not a 3D game. Nothing here argues for a pivot. The
fixes below add to what is there; none of them reverses a decision, so the owner should confirm
the direction before the team spends on dressing.

The stills do not yet sell **"lush summer"**. They sell **"clean alley"**. The orbit sheets show
the risk plainly: once the free camera leaves the 01 framing, 5 of the 8 day views are a bare
plaster slab or a bare fence over tan dirt. A stakeholder who drags the camera will see a
tidy tech-demo corridor, not Coal Town.

## Would a stakeholder believe the final game can look like the reference?

- **From the 01 framing: yes, mostly.** Painted foliage clumps, tinted (never grey) shade, a
  cumulus over the sea gap and the laundry line all read as anime background art. The tree
  masses are the strongest environment element on screen.
- **Under a free camera: not yet.** The reference frame is packed edge to edge: layered
  mountains, three depths of greenery, a doghouse, stepping stones, flowers, a lived-in porch.
  Ours has one lantern, one hydrangea bush and grass tufts, then nothing. The vista at the end
  of the lane is a mushy strip of white blobs; the reference's distance is crisp, layered and
  saturated.
- **Light is the gap you feel before you can name it.** The reference and the art bible's
  Explore Day row ("high near-white sun, short wisteria shadows... bright, crisp, saturated")
  are high-key: sunlit ground is pale cream, greens are bright, the sky is deep. Our day lit
  ground is a mid ochre-tan, the shade is one large flat purple shape, and nothing says *the
  sun is right there*. Dusk is the stronger frame (warm, nostalgic), but the warm light bands on
  the plaster wall read as smeared texture, not light, and the art bible's dusk carrier,
  windows switching on, is missing.

## Is the charm there? Would someone fall for Mikan?

**From the front: yes.** `09-closeup-faces.png` is the best image in the set: big amber eyes
with two highlights, the small `w` smile, the gold bell on the red collar, the orange cap. This
is a cat people will screenshot. The Wall Sitter's heavy smug lids are a good foil and already
carry Pillar 4's "every named cat has a face you remember".

**From the gameplay camera, not yet.** About 90% of play is Mikan from behind
(`03`, `10`, `view01`). From behind she is a readable, iconic shape (orange cap, white body,
orange pom tail), which must be kept, but a shape is not charm. Charm from behind has to come
from **motion**, and `10-walk-back34.png` is almost identical to the idle `03-back34-day.png`:
no visible stride, no bob, no tail carriage change. If the walk is as stiff in motion as the
stills suggest, the stakeholder never meets the face that would win them.

## The single biggest thing: sunlight through leaves, moving

If only one thing changes, make it **animated dappled sunlight (komorebi)**: the overhanging
trees cast broken, leaf-shaped light and shade on the lane, the wall and Mikan, and the pattern
sways slowly. In anime summer it is the cue that says "hot day, real place, time passing", and
it works at once on light, colour, atmosphere and motion. It also costs little compared with
modelling more set dressing, and it hides the empty plaster and dirt by breaking them up. Pair
it with a higher-key exposure on lit surfaces so the dapples read as bright sun, not grey
patches.

## Changes, in priority order (at most 5)

1. **Sun and dappled light (the one above).** Raise lit-surface value toward the 01 target
   (pale cream ground, bright greens, deeper sky gradient); replace the single flat tree-shadow
   blob with a projected leaf-dapple pattern from every overhanging tree, animated by a slow
   wind sway (roughly 0.2 to 0.4 Hz drift); let the dapple fall on Mikan as well as the ground.
   Keep the shade tint (wisteria by day, plum at dusk). Add a faint warm haze and bloom at the
   bright sea gap so the end of the lane glows.
2. **Dress all 360 degrees, at the density of `01-exploration.png`.** The free camera is the
   product, so every orbit angle needs a foreground, a middle and a background. Minimum kit per
   side of the lane: potted plants and a blue bucket, a drain cover, utility wires crossing
   overhead, posters and a gate on the plaster wall, ivy or tree mass spilling over the fence
   tops, an air-con unit or a bicycle, a vending machine glow somewhere in the depth. Behind the
   walls: roofs and greenery stacked in layers, and **a mountain or hill silhouette** like the
   reference, so no angle ends on bare plaster or sky. Re-shoot the orbit sheets as the test:
   no frame may be more than about 40% unbroken wall or ground. The budget allows it (62 draw
   calls of 350, 66k triangles of 500k).
3. **Give Mikan life in motion.** A walk with a readable stride, head bob and a little
   squash-settle on each step, and the pom tail bouncing a beat behind the body; an idle with
   ear flicks, blinks and a tail swish; and **turn her head toward things of interest** (the
   Wall Sitter, the lantern) so the player sees the face from the gameplay camera. Re-capture
   `10-walk-back34` at the passing pose and the contact pose as proof.
4. **Ambient motion everywhere.** Foliage clumps sway, laundry flutters, grass tufts bend,
   clouds drift, and the Wall Sitter's tail hangs and twitches. Stillness is what makes a
   painted background look like a screenshot; the reference's world breathes even in a still
   dialogue scene.
5. **Repaint the vista and fix the dusk carriers.** Replace the white-blob town at the end of
   the lane with crisp, shape-designed rooftops in two or three value layers against the sea; at
   dusk, light the windows (`#FFD98A`, art bible Dusk row) and turn the wall's warm bands into
   clean, shaped light (slat and branch shadows) rather than smears. While there, fix the
   translucent occluder ghost visible in the lower-left of orbit frame 4 (day and dusk).

## What must NOT be lost

- **The split itself:** inked, flat-cel cats over **un-inked** painted environment. Do not ink the
  environment to "match"; the reference doesn't, and that contrast is the look.
- **Mikan's silhouette from behind:** orange cap, white body, orange pom tail, red collar. It is
  the gameplay read; keep it at least as clean while adding motion and dapple.
- **The face:** big amber eyes with double highlights, `w` mouth, the gold bell. The Wall Sitter's
  smug lids.
- **Tinted shade:** 0% neutral-grey shadow (README measurements), wisteria by day and plum at dusk.
  Brighter sun must not drag shade toward grey.
- **The warm ink line** (`#33273B`, about 2 px at 1080p). The README flags it as falling to 1.44 px
  at 85% render scale and E-5 separation just under 20 L* at orbit 0; keep both on the art
  director's list, but do not trade the line for them.
- **The painted foliage clumps and the cumulus sky:** they are already at reference quality.
- **The dusk mood:** it is the most emotional frame in the set and serves Pillar 2's pull home.
- **Performance headroom:** dress with instancing and atlased props; the showcase must stay
  smooth in the browser.

## Pillar check

- **Pillar 1, Cat's-Eye Truth:** the low camera and tall walls already make the world feel big to
  a cat. Dressing should stay at cat-relevant scale: things a cat sits on, hides behind or sniffs.
  No readable human text on posters (the scribble glyphs are correct).
- **Pillar 2, Two Lives, One Clock:** Day to Dusk is the clock made visible; lit windows at dusk
  are its strongest cue and are missing.
- **Pillar 4, Rivals Remember:** the Wall Sitter already has a memorable face; give it ambient
  motion so it feels watched, not placed.

## Show plan

- **Owner, now:** `compare-01-day-full.png`, `compare-01-dusk-full.png`, `09-closeup-faces.png`
  **and** both orbit sheets, with this review. Show the orbit sheets honestly; they are the reason
  for fixes 1 and 2.
- **Stakeholders, after fixes 1 to 3,** captured as a 20 to 30 second orbit-and-walk video at Day
  and Dusk, not stills. The pitch is the look *in motion*.

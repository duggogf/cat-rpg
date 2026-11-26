# Characters: modelling, faces and the anatomy lessons

## Contents
1. Shape language
2. Modelling method (SDF → mesh)
3. Rig and animation
4. Faces as decals
5. Identity from behind
6. Owner corrections — what went wrong and what fixed it
7. Review checklist for any character pass

## 1. Shape language

- Bodies are **beans** (soft asymmetric capsules), heads **chestnuts** (round, a little wider low),
  accents **poms** (small imperfect circles), ears/claws/danger **wedges** (triangle, one soft corner).
- No straight lines on a character; at most one sharp point per feature.
- Spiky shapes are reserved for danger: claws, slash arcs, impact bursts, the "frazzled" fur puff.
- Hero shapes belong to one owner only (e.g. the protagonist's tail and cap). Supporting characters stay
  lower in contrast and saturation than any hero shape on screen.

## 2. Modelling method (SDF → mesh)

We build characters procedurally as **signed-distance smooth unions** and bake them to skinned meshes
(`prototypes/artifact-slice/tools/cats/casts.sdf.js`, `sdf.js`, `surfacenets.js`, `tools/bake-meshes.mjs`;
primitives copied in `assets/reference-impl/sdf-primitives.js`).
- Primitives: ellipsoids, capsules with two radii, wedge ears (a triangle in a local frame with thickness,
  cup and tip rounding), each bound to a bone, joined with a smooth-min radius `k`.
- Separate **shells** per part (body, legs, head, tail, collar, bell…). Legs as their own shell gives the
  drawn-cel overlap line where a leg crosses the body.
- Polygonise with surface nets; the SDF gradient gives **smooth normals** that double as the outline's
  extrusion normals (no cracks in the hull). Skin weights = soft-min over each bone's primitives.
- Decimate with meshoptimizer to a budget (browser spike: ≈ 20k tris per hero, LOD ≈ 7k for crowds;
  a production target would be 4–6k). Quantise (half-float positions, 8-bit normals/weights).
- Builds (round / standard / long / huge) are proportion tables on one skeleton; variants (ear shape,
  tail type, scars) are parameters, so a whole cast comes out of one generator.
- Real-world scale in metres keeps lighting and camera numbers meaningful.

## 3. Rig and animation

- One skeleton for all cats: root, hips, chest, neck, head, two ears, 6-bone tail, 2-bone legs.
- Head pivot low and behind the skull centre: nods and look-ats read well.
- Procedural gaits + poses; tail carriage and ear set carry personality; a look-at that turns head and
  neck toward a world point (aim at the *other character's head height*, never a ground point — a ground
  target pitches the face into the chest).
- Actions and comedy takes **on twos**; locomotion on ones.
- Scars and history marks live on the model (e.g. a V-notch cut into the ear's outer edge: discard the fill
  in a wedge so the ink hull shows through, with a coloured fresh-cut rim). Make them big enough to read at
  gameplay framing.

## 4. Faces as decals

`assets/reference-impl/face-decals.js` draws faces on a 2D canvas in the preview kit's units and projects
them onto the head:
- **Nose + mouth card:** planar projection along the head's +Z onto the muzzle, flat (never shaded).
- **Each eye:** its own planar decal with its own axis and tangent, so on a 3/4 view each eye turns toward
  the camera on its side of the head — this is what lets the front-on cartoon face survive a free camera
  without a side-profile swap.
- Eye = coat-colour lid area, coloured iris disc, tall ink pupil, one hard white highlight upper-left, ink
  rim. Expressions (smug, sleepy, happy ^ ^, shock with small pupils, angry) and blink are atlas frames.
- **Eye turning (per frame):** take the camera position in the head's rest space, `psi = atan2(x, z)`
  relative to the head centre. For the eye on the camera's side, `w = smoothstep(0, 1, |psi| / 90°)`; rotate
  that eye's projection axis by up to **68°·w** toward the camera, slide its anchor round the skull by up to
  **40°·w**, and grow it by up to **12%** (tangent length 1/(1+0.12w)). Rotating the axis alone gives a
  sliver eye in profile — the anchor slide is what keeps it round. The far eye stays on +Z and is hidden by
  the head. Code: `assets/reference-impl/cel-character-runtime.js`, `update()`.
- Faces switch off (decals hidden) when the character is < 4% of screen height.
- Line weight on the decal matches the hull width at gameplay distance.

## 5. Identity from behind

The third-person camera sees the character from behind and above, so identity is built in this order:
tail (shape and carriage) → ears → back pattern → build and gait → face (close-ups only). Design the
top/back view first. Team/side reads from the outline colour in combat.

## 6. Owner corrections — what went wrong and what fixed it

These are the expensive lessons from the Cat RPG protagonist. Apply them to any stylised animal.

| Attempt | Owner reaction | Lesson |
|---|---|---|
| Matching a turnaround 1:1 | "Have an art director look over this instead of mapping the model 1:1" | Every shape pass gets an **art-director review on anatomy and appeal**, not a literal match. |
| Hind thighs wide to the side | "Too fat to the side, spread out too much" | Hind legs sit under the hip, **narrow from behind**; haunches live inside the body's pear shape. |
| Front legs set back under the belly | "Too deep into the back — push further front, on the upper chest" | Front legs descend from the shoulder at the **front of the chest, under the neck base**. |
| "Widest at the cheeks" head | Read as a pear / sack | Keep the **round fat face** front-on; width is in the round skull, not low jowls. |
| Muzzle pushed forward | "Nose too long, like a dog" | Cats have a flat face. |
| Completely flat profile | "No snout coming out, no visible nose bridge" | A **small** snout and a visible nose bridge: between flat and dog. The nose sits barely ahead of the cheek. |
| Thin, very long tail | "Unnatural, thin, too long" | Thick, moderately long, soft **S-curve**, rising, tip colour change; it starts at the top of the rump continuing the back line. |
| Swapping to a side-profile face at 90° | "We don't need that switching" | Per-eye decals turning to camera; keep the goofy front face everywhere. |
| (kept) | "It looks stupid and funny" — keep it | Appeal beats accuracy: preserve the face the owner likes while fixing anatomy. |

General process lessons:
- Get real anatomy references (skeleton/wireframe, side profile) for the animal, not just the stylised
  turnaround, and check joint placement against them.
- Change one region per pass and show before/after screenshots from front, side, back and 3/4.
- When feedback contradicts an earlier correction ("too long" then "too flat"), the answer is in between —
  record both in the brief so later passes don't overshoot again.

## 7. Review checklist for any character pass

- [ ] Reads as a flat cel from every orbit angle; two tones; line even.
- [ ] Silhouette identifiable from behind at gameplay size (tail, ears, back pattern).
- [ ] Anatomy: legs under shoulders/hips, narrow stance from behind, no bulges at overlaps.
- [ ] Face front-on keeps its appeal; 3/4 view eyes turn, no swap, nothing floats off the head.
- [ ] No ink line around coat patches.
- [ ] LOD version keeps the silhouette.
- [ ] Owner-approved features unchanged (diff screenshots against the last approved set).

# User feedback on the preview gallery — 2026-11-24

Left by the project owner as comments on the preview gallery Artifact
(https://claude.ai/artifact/UWgvyxoFUBKw7mX8Jebjfb), in the order written.
Quoted verbatim. These are design direction from the owner and are binding,
subject to the patent guardrails in `design/legal/nemesis-patent-analysis.md`.
The owner also asked that all further agent work run on Opus at high effort.

---

## C1 — "Rivals that remember" (07:31)

> This Rival feature that equals to the nemesis system, still lacks the Nemesis-like UI with a row unique cats (with mostly boss or special cats).
>
> Basically, every unique cats that are in the game will be displayed in a silhouette until you discover them. It also shows what are the relationships between each of these cats (only if both cats are already discovered) by moving your mouse on one cat, and it will show a small tag on other cats like: Boss, Rival(NPC has rival too), Cousins, etc. And it affects those cats in the way that, when you recruit its gang and face that boss in a fight with the cat you recruited, the boss will talk shit and stare down at the cat you recruited, making it scared (unless their personality are against it). In the UI it will also show how angry they are every time you do something bad on it's territory too, resulting in them get combat buff which are expensed after a fight, whether you lose or not.
>
> But please check carefully on what is patent on this nemesis system to avoid lawsuits

## C2 — "Combat: conduct the brawl" (07:33)

> One thing about combat is that, you can lose. Unlike in FF7R where if your party lose, you game over.
>
> Here when you lose, the time skip to the night time and you cannot do anything else except for going home to interact with your owner.

## C3 — "The Fence Line" (07:38)

> From what you showed me here, it looks like the district's cats only? The Rival system covers all the unique and boss cats you have to fight, but for the district, we can do like; you fight with every gang in the district you see and pee on the territory, gaining the influence while lowering their influence. Once you reach full influence, the boss of that district will now start to roam the streets, open the window for you to challenge it in a fight.
>
> The influence goes down over time if you don't do anything about it. Same goes to the territory you already own. Other cats can also take back your territory, and even the cats you have recruited (rare)

## C4 — "The Verdict" (07:44)

> To keep it simple, have only:
> - Recruit for a bribe
> - Chase off. This boss is gone. Over time, new boss may appear, mainly when you lose an influence over some of your territory completely, then a new character will be created and own that place.
> - Nose touch: You own the territory, the boss now peacefully steps down and will not fight you for a few weeks. And base on who you are fighting, perhaps you are fighting a rival of that cat, there's a chance that the cat will also join you dynamically in a fight.

## C5 — "The Turf Board" (07:46)

> The turf board looks great, although the UI are all over the place. Would be great if you can unify it a bit, make it more ease to use.
>
> And as I mentioned before in the previous comments, it's not about just gain control of a territory and done, sometimes some new cats are coming to town to challenge your territory and gain control over it.
>
> Play around the system a bit more, but don't over-bloat it.

## C6 — Rivals board layout (chat, after the redraw)

> About the Rival menu, I want it to display similarly to this instead of a line from left to right. This shows more dynamic.

Reference image: `design/reviews/refs/rivals-board-layout-ref.webp` (layout reference only). It shows one gang staged
as a scene in a narrow alley seen in deep perspective: the boss on a raised porch perch at the far end (vanishing
point, crown), the gang arranged down the stone steps and path toward the camera by rank, each cat with a name ribbon
and a role tag (e.g. Lieutenant, Enforcer, Sentry, Brawler, Scout, Patrol), dashed arrows between cats showing who
answers to whom, a header bar with the place name and influence, a left column of facts (Raid, Scent, Objective), a
boss card bottom-left (personality, anger, ties) and a button bar bottom-right.

## C7 — Mikan's 3D shape (chat, after reshape pass 1)

> Maybe you'd want to have an art director looking over this instead of just map the model with the reference
> image 1:1. Because, from your latest version, the cat back thighs are too fat to the side and it spread out too
> much on the side. Check this new reference again to clean it up (1st image)
>
> and the front legs (2nd image) is too deep into the back. Push it a little further front, on the upper chest.
> Check cat anatomy (3rd image)

References: `design/reviews/refs/mikan-turnaround-ref-v2.webp` (turnaround, shape target), `mikan-legs-feedback.png`
(owner's red circles: reference front leg under the chest vs our front leg set too far back),
`cat-anatomy-wireframe.png` (real cat anatomy: front legs descend from the shoulder at the front of the chest, under
the neck base; hind legs under the hip, narrow from behind). Process note from the owner: every cat shape pass gets
an art-director review on anatomy and appeal, not a literal match to the reference.

## C8 — Mikan's face shape and tail (chat, after the anatomy round 2)

> The new facial shape looks weird now. While the front profile of the first image, I think it nails right. Round
> face fat cat, the 2nd one which is your latest iterations make the face shaped like a ball sack.
>
> And for the side profile, what you have right now is super weird. What is that on the nose that you have in the
> 3rd image? It doesn't look right. The nose is too long like a dog. Please have a look at the 4th image of the cat
> side profile that I can and re-evaluate what you need to do more. And let's try a long tail this time.

References: `design/reviews/refs/mikan-front-round-face-good.png` (KEEP: the earlier round, fat face, front-on),
`mikan-front-pear-face-bad.png` (latest: pear/sack-shaped head — reject), `mikan-side-dog-snout-bad.png` (latest:
protruding dog-like snout — reject), `cat-side-profile-ref.png` (target side profile: round skull, flat face, short
muzzle, small nose barely ahead of the cheek, eye near the front of the face, long tail). **Canon change: Mikan gets a
long tail** (replaces the bobtail pom) — recorded in the brief and art bible.

## C9 — snout, nose bridge and tail (chat, after C8)

> * At the reference image, it does have a small snout (as marked in the red) coming out and its nose-bridge is
>   visible (as marked in the orange)
> * Your model doesn't have a snout coming out not a visible nose-bridge (as marked in the red)
> * The tail looks unnatural, thin, and too long. Look at the 2nd image as a reference.

References: `design/reviews/refs/mikan-snout-bridge-feedback.webp` (left: reference cat profile with a small snout
(red) and visible nose bridge (orange); right: our flat profile, marked), `mikan-tail-ref.png` (tail target: thick,
moderately long, rising in a soft S-curve, orange with a white tip). Between C8 ("too long like a dog") and C9: a
SMALL snout and a visible nose bridge — not flat, not a dog muzzle.

## C10 — combat after playing M1 (chat)

> * About the combat, I feel like the combat is too fast. Everything from movement and action is way too fast right now.
> * Despite having everything fast, the action is not responsive at all. When clicking to attack, it has a brief delay before the attack is performed and land. When I click 3 times in sequence, instead of just landing out that 1st or 2nd attack due to the timing, it queues up 3 attack
> * Let's extend the combat combo a bit. Right now it's too straightforward. Let's add light attack and heavy attack, and some basic combos for when pressing these buttons in sequence, like 3 light attacks then 1 heavy attack, etc.
> * The movement is not so fluid. While attacking, you are locked in place, even after finishing an attack there's brief delay before it lets me move.
> * Remove the option to control other cats. Other cats are purely controlled by AI, but you can still force them to use skills.
> * On staggered, zoom into the character that staggered, time slow briefly, and make a shattered blinking effects like in FF7 remake.
> * When an enemy is staggered, pressing "F" will have you do a special attack (on used, the camera zoom-in to you briefly, time stop, only render you above something that is like an impact frame background, creating some shonen ultimate move kind of feeling). If the other crews are nearby and they all use special attack once, the team KA-BLAM (whatever you call it) will be triggered. So, this is similar design to Grandblue Fantasy Relink's Full Burst system.
> * Right now, abilities are barely visible when I use it or someone is using it.

Follow-up:

> * Camera lock is now not locked by default. Pressing Tab will lock the nearest enemy, pressing it again, if the nearest enemy is the new one it will lock on the new one. Otherwise, it will unlock, allowing players to move their camera freely like in third person camera.
> * F is now the button to activate skill bar instead.
> * Player doesn't need to wait until the attack animation is fully completed to move. There's the gradients towards the end that already allow player to move a bit before the animation ends, to make it feels more responsive.
> * For finisher, do light, light, light, heavy
> * When I say the combat has to be slower, that means all the AI will not just run towards the nearest enemies and start attacking. Be like cats. They roam and look at each other, find the opportunity to dash in and start doing combos. You can imagine a fight in Assassin's Creed, not every enemies coming to you all at once, although it's not the strict rule we have to follow like that game, I just want AI to think a tiny bit before charging in and attacks, getting some flank, circle around, etc.
>
> Decision: Crew specials in the chain: Automatic. Zoomies: fold it into the special.

Final bindings, owner's last word: "Do F for special on staggered enemies, R for skill bar". Ruled into
`design/reviews/owner-feedback/combat-m1.1-spec.md`.

## C11 — combat after playing M1.1 (chat)

> * The combat still doesn't feel so responsive. Research on how the combat works in Nier Automata, where dash move can cancel the action. I mentioned before to make the player regain movement faster, not having to wait until the attack animation is done. Right now it's still there. Please make it so player can already start moving at 60% of the animation length. Make light attack much faster, so it's more snappy and more like it happen instantly when you click, while making the heavy attack slower, with the anticipation before the attack, to create some impact to it.
> * Add damage numbers too, so i know when someone's taking damage.
> * Make the flash when a character takes damage slightly longer, both on you, your team, and the enemies.
> * Make it so you can slightly move your character, and slowly, while the attack is happen. Not locking the player in place.
> * Make it clearer who's enemies who's ally. ... yellow outline on your team and red outline on enemies?
> * The camera control needs some work. The camera following needs to be smoother, with better lerp. Right now it's very blurry and ghostly when I move. ... Rotation of my mouse when I don't lock on any enemies are super slow. ... Vertical speed is fine, but horizontal doesn't work.
> * The combat is still too fast. Lower the movement speed down to make it equal to when you do fast walk in Lane mode.
> * Dash is too far. And there's no cooldown to dash, make some.
> * Special (F) can be used at any time, doesn't need to be while the enemy is staggered.
> * Special can only be used after the previous character finishes its animation, similar to Grandblue Fantasy Relink. ... the full burst is the extra damage on top.
> * Daifuku shouldn't be fighting on the wall anymore. Fight down there like any other cats.
> * Right now, you hide objects and cats that are too close to the camera, don't do that. ... do a dither fade instead.
> * When the last opponent is defeated, do the zoom-in camera, frame freeze, with a background, then slow motion, similar to ... Street Fighter.
> * When enemy is surrounded (1 vs 4) they rarely attack. ...
> * Change the Tab action. Tab to lock, again to unlock. While locking, moving your mouse through a certain threshold to the left/right side, it will select the next enemies that are on the left/right side of your screen.
> * Daifuku fight stuck after phase 1 end.
>
> Decisions: "Do a ground version for Daifuku, but no need the wash tub anymore. Make it universal. The rest, however you suggest. Go"

Ruled into `design/reviews/owner-feedback/combat-m1.2-spec.md`.

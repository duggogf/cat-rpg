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

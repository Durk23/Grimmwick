# District 3 — Witchwood (design)

The haunted witch forest. Broomhilda's domain. Deep green-purple woods, crooked braided trees, witch huts on stilts, bubbling cauldron clearings, riderless brooms, glowing potion light, and **spiders everywhere** (this is THE spider district). Harder than Ravenmoor — the "fairly competitive begins" tier of the curve, but always fair/telegraphed.

## The five levels (no two consecutive share a gimmick; each feels like WHERE it is)
| id | name | region | signature gimmick |
|---|---|---|---|
| w3l1 | THE CROOKED PATH | forest | Braided-tree platforming + **riderless BROOM ZOOMERS** that sweep low to bowl you over (dodge/leap) + first drop-spiders; **Toadstool bouncers** (soft mushrooms that bounce you — helpful or off a ledge). The on-ramp, tenser than D2. |
| w3l2 | THE WEB GALLERY | giant webs | **THE spider level + GIANT-WEB CLIMBING** (D3 climbing showcase): Weblings build web-walls you must break/climb/skirt, Widowmite swarms, drop-spiders; big climbable webs, web-strand traverses. |
| w3l3 | THE CAULDRON CLEARING | potion | **CAULDRON DIPS** (jump into a small bubbling cauldron → a random short brew-buff, reusing shield/moon/wings/salt) + potion-lob hazards + glowing potion platforms; the **Mystery Cauldron** gamble container (dip → Widowmite swarm ambush). |
| w3l4 | WITCH-HUT ROW | stilted huts | Verticality among witch huts on stilts; **enchanted brooms** sweep low across gaps to knock you off; potion-light climbs; drop-spiders from the eaves. |
| w3l5 | BROOMHILDA'S HOLLOW | deep wood | The pre-boss gauntlet: a **broom-sweep corridor** (riderless brooms cast down the approach, à la the Witch Cannon's bats but ground-sweeping) leading to Broomhilda's clearing + her doorstep loom. |

## New enemies (Witchwood roster — foundation)
- **Webling** — a fat spider that periodically spins a WEB-WALL (a breakable barrier across the lane); break it (spin/salt/stomp the webling, or hit the wall) or climb over. Deterministic spin cycle.
- **Widowmite** — tiny fast skittering spider; comes in small swarms (2-3 placed together, telegraphed). Easy stomp, quick.
- **BroomZoomer** — a riderless broom that sweeps horizontally low across the ground on a fixed patrol (a comedy Bullet-Bill-ish ground threat you leap); non-homing.
- **ToadstoolBouncer** — a big soft mushroom (non-damaging) that BOUNCES the player (a bounce pad enemy) — sometimes helpful, sometimes launches you toward a hazard. Comedy.
- (reuse Spider from 07_enemies as the district's drop-spiders; reuse SwoopBat sparingly.)

## New kit (foundation — new file src/09??_w3kit.js; reuses 09_levelkit levelBegin/exitGate/updateLevelCommon)
- `W3PAL` palette (deep green-purple, potion glow, web white, cauldron teal-green).
- `w3Parallax(S,x1,x2)` (braided-tree forest depths, witch-hut skyline, potion-glow midground) + `w3Ambience` (drifting spores, floating potion motes, fireflies) returned in updateAmbience's shape + `w3LevelFinish(G,x1,x2,theme)`.
- Deco: braided crooked tree, witch hut on stilts, cauldron (deco + the dip vessel), hanging web / web-wall, giant mushroom, potion bottles, will-o'-potion lights.
- Climbables: giant webs (reuse buildWebNet flavor, bigger).
- **MysteryCauldron** gamble container (CursedCoffin/RestlessUrn contract: `.opened/.group.position/.open(G)/.promptLabel`; ambush = Widowmite swarm on the fixed scatter ring + spawnGrace).
- **CauldronDip** power-up vessel: touch/jump-in → grants a random timed brew-buff (reuse the existing power-up grants).
- `W3_LEVELS = []; LEVEL_LISTS.push(W3_LEVELS);` — each level self-registers `{id:'w3l1',district:'w3',name,build,update,parTime}`.

## Wiring (already generic — minimal work)
- Gate opens on `save.worlds.w2` (req chain already set: w3.req='w2'). District map resolves via LEVEL_LISTS. Save schema generic. Level-intro subtitle uses WORLDS name. **Only new wiring:** the boss3 build + switchArea dispatch (`area==='boss3'` → buildBossArena3) + bossBuilt('boss3') in 12_main.

## Broomhilda, the Broom Witch (boss — phase 3)
Rides a broomstick; swooping dive-bombs, potion lobs that leave goo, raises thorn walls; never lands. **Secret takedown:** when she hovers low to cast, her broom's bristles SPARKLE — spin-attack the bristles 2× → the broom bucks her off → long ground stun → hit her. Hint: bristles visibly sparkle; a sign "a broom's pride is its bristles." **Reward:** THE BROOMSTICK rideable mount (deferred follow-up: hold-jump glide-fly bursts; store sells broom skins later).

## Build order (mirror Ravenmoor)
1. Foundation: this doc + kit + enemies (parallel agents). 2. The 5 levels (parallel, one agent each). 3. Broomhilda boss + boss3 wiring. 4. Integration gauntlet (build, playtest, height audit, review, fix, deploy). Broom mount = follow-up.

## Standing rules (all levels obey — same as D1/D2)
Comparable heights (tap 1.8/held 2.6/double 3.3/spring 4.4/bounce 3.5/mega 7); ~4-min length, full introduce→twist→escalate→master arc; 3-4 checkpoints; STRUCTURED CHAOS + "chaos not clutter"; CLEAR-PATCH LAW for cauldron/gamble vessels; CLIMBING IS FUN (web gallery); determinism (seeded rand only in deco); readability (enemies pop); one quiet-storytelling prop per level; the BOMBARDMENT archetype once (the broom-sweep corridor in 3-5).

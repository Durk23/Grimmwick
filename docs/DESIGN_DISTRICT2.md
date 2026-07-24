# District 2 — Ravenmoor Cemetery (design of record)

The graveyard that goes DOWN. Surface levels among the graves, then the district descends into the **Catacombs**. Colder, darker, harder than the Pumpkin Patch — where "fairly competitive" begins. Difficulty band per CLAUDE.md: 6–9 enemies, first combos, moving platforms over hazards, occasional deaths expected. Levels are the ~4-minute meaty length from the start (full introduce→twist→escalate→master arcs, 3–4 checkpoints each). The Sunken Crypt in 1-1 foreshadowed this.

## The five levels (no two consecutive share a gimmick; each feels like WHERE it is)

| id | name | surface/deep | signature gimmick |
|---|---|---|---|
| w2l1 | RAVENMOOR GATE | surface | Tombstone-hop rhythm + **crow flocks** (air pressure); a colder, tenser welcome |
| w2l2 | THE WEEPING ROWS | surface→dusk | **WISPS + DARKNESS**: stay in lantern light; wisps chase in the dark, freeze/scatter in light. Relight dark lanterns to open the path |
| w2l3 | THE BELL TOWER | descent | **CHAIN/BELL-ROPE CLIMB** — a playful vertical DESCENT into the catacombs (D2's climbing showcase): branching chains, bell-rope swings, rung-timing, climb→drop combos |
| w2l4 | THE GLITTERING DEEP | catacombs | **CRYSTAL CAVERNS + UNDERGROUND RIVER**: glowing crystal platforms, a flowing current (moving hazard/conveyor), bats pouring from cracks (the BOMBARDMENT set-piece — bats from the ceiling on a fixed clock) |
| w2l5 | THE LONG BARROW | deep catacombs | **THE COMEDY ROSTER + low-doorway gags**: the Lost Tour Group, Gravedigger Moles, Sir Reginald; MIND-YOUR-HEAD crawls; leads to Mossgrave's tomb |

Mini-boss slot (X-3 homage) is optional here; the Bell Tower's descent is the set-piece.

## New enemies (Ravenmoor roster — build in the foundation)

Contract (same as 07_enemies.js): `isEnemy=true, hitR, headH, hitY, touchDamage, touchR`, implement `update(dt)`, inherit `takeHit(player,kind)` / `die()`; register via `G.ents.add(...)`. Deterministic (seeded rand / fixed clocks). Emissive-lifted colors so they READ in the dark (readability rule — the D1 pass learned this the hard way).

- **Wisp** — a floating will-o-wisp. In DARK it drifts toward the player (slow, telegraphed glow-pulse before it lunges); in LIGHT (near a lit lantern / light pool) it recoils and goes dormant. Its own body is the light source (bright emissive cyan/green). The darkness mechanic's centerpiece.
- **Gravemite** — a small skittering ground pest (knee-high). Scuttles in fixed patrol dashes, chirps. Easy to stomp; comes in small groups but never a gang on one beat. Bright eyes so it reads low to the ground.
- **Crow (flock)** — reuse/extend the ambient Crow into a THREAT variant: a crow that dive-bombs on a fixed telegraphed arc (like the Swoop Bat but corvid), or a small flock that wheels and passes. Air lane for the surface levels.
- **Coffin Hopper** (comedy) — a coffin hopping on little bare feet; hops a fixed pattern, occasionally trips (stumble frame = free stomp window). Harmless-goofy.
- **Lost Tour Group** (comedy set-piece, w2l5) — six skeletons holding hands shuffling behind a bored tour-guide wisp; HARMLESS as a line, but break the line (attack one) and all six turn hostile for a few seconds. A deterministic set-piece, not a patrol.
- (Later/optional: Gravedigger Moles on union break, Sir Reginald who announces attacks, Barkibald the fetch-dog, The Committee bat-swarm — add in w2l5 or a follow-up.)

## New kit pieces (foundation — new file, reuses 09_levelkit's levelBegin/exitGate/levelFinish/updateLevelCommon)

- **Ravenmoor palette**: colder greys/blue-greens on the surface; catacomb cyan/violet crystal glow below. Define D2 colors; per-district parallax (headstone skyline, then cave walls).
- **Deco builders**: bigger mausoleums, iron fences, weeping angels/statues, hanging chains, bell in a tower, glowing crystals (clusters, emissive), stalactites/stalagmites, underground river surface, catacomb arches, bone piles.
- **Climbables**: hanging **chains** and **bell-ropes** (world volume `type:'climb'`, like buildVine).
- **Restless Urn** (gamble container — the D2 CursedCoffin equivalent): an urn on a grave plinth; same 42% candy / 28% jackpot / 30% ambush gamble system + CLEAR-PATCH LAW + 1s spawnGrace, but the ambush is a **BAT SWARM** pouring out (reuse the coffin gamble code path with a bat-ambush + urn skin).
- **Light pools / relightable lanterns**: a lantern that starts DARK and lights when relit (interact or hit), creating a safe pool that repels Wisps — the darkness mechanic's tool.
- `W2_LEVELS = []` registry + `LEVEL_LISTS.push(W2_LEVELS)`; each level file self-registers `{id:'w2l1', district:'w2', name, build, update, parTime}`.

## Wiring (shared files — main handles, minimal/surgical)

- **Hub gate unlock** (08_hub.js): w2's gate opens when `save.worlds.w1` is true. Change gate `open` to `w.open || (w.req && save.worlds[w.req])`; set `w2.req='w1'` (and w3.req='w2', etc. for the chain).
- **District map** (11_ui.js): generalize `renderMap` to pull the district's levels from `LEVEL_LISTS`/`findLevel` (currently hardcoded to `W1_LEVELS`) so `showMap('w2')` shows Ravenmoor's nodes. The map scene (10z_mapscene) already themes districts.
- **Save schema** (12_main.js): `save.levels` already generic (w2l1… keys just work); `save.gp.w2`, `save.best.w2boss`; loadSave migration unaffected. `enterLevel`/`completeLevel` are already district-generic (use `levelDef.district`).
- **Boss2** (12_main.js + new 10b_boss2.js): register `area==='boss2'` → `buildBossArena2`; `startBoss2`; generalize `onBossDefeated` to the current district (set `worlds[district]=true`, `embers=max(embers,2)`, `best[district+'boss']`, refill lives). Boss node on the w2 map → `startBoss2`.

## Mossgrave, the Tombstone Titan (boss — phase 3)

A huge cracked haunted gravestone. **Brute path**: headstone-slam shockwaves + **homing bat swarms**; stone hide, swings barely chip him. **SECRET takedown**: bats flash orange the instant they're swattable → **spin-swat a bat back at him (tennis!)** → it homes on HIM, topples him face-down, exposing the glowing **moss runes** on his back → hit the runes for big damage. **Hint**: bats flash orange; gravedigger NPC line "moss only grows where he can't scratch." Reward: **Bat Swarm** boss-skill + story: reunites Pip with **Granny Wick** → **the Summon** (👵🪡). Three-layer boss rule applies.

## Phasing (build order)

1. **Foundation** (parallel): Ravenmoor enemies · Ravenmoor kit+deco+palette+registry · main wires the gate/map/save/boss-registration.
2. **The 5 levels** (fan out, one per level, ~4-min each, D2 curve, all accumulated rules: comparable heights, chaos-not-clutter, clear-patch, fun climbing, determinism/seeded, readable emissive enemies).
3. **Mossgrave boss** + the tennis-swat secret.
4. **Integration gauntlet**: build → height audit → playtest → adversarial review → fix → Simulator.
5. **Follow-up** (after the district is playable): the equippable **Bat Swarm** boss-skill + **Granny Wick Summon** systems (net-new HUD/ability systems — deferred so the district ships playable first).

# Grimmwick — Relight the Night

Cute-spooky 3D platformer (Mario-64 style) for **iPhone, iPad, and Mac**.
Free-to-play with cosmetic monetization (costumes, characters, Spook Pass).
Built as a single-bundle Three.js web game, wrapped for the App Store with Capacitor → Xcode.

**Current state: v1.0 — CONTENT-COMPLETE: all 5 Districts BUILT** (25 levels + 5 bosses playable, start to the ending). Hub town + district-map level-select, per-level saves/stars (fast/all-candy/no-damage), save system (key `grimmwick_save`, migrates old saves), iOS Capacitor project in `ios/` (SPM, no CocoaPods). The full story is playable through to inviting Grimm to the festival. Remaining before launch is polish/tuning/audio/IAP/leaderboards (see Roadmap), not story content.
- **D1 Pumpkin Patch** (`09a…09e`) — Levels 1-1…1-5 + **Pumpkin King** (`10_boss1`). Enemies: Boo, Hopper, Skelly, Spider, Swoop Bat, Barnaby Rat.
- **D2 Ravenmoor Cemetery** (`09o…09s` via `09n_w2kit`, enemies `07r`) — 5 levels + **Mossgrave** (`10b_boss2`, tennis-swat bat secret). Darkness/Wisp mechanic (`G.lightPools`); Salt Shaker pickup weapon; witch bat-cannon caster; glowing checkpoints. (Pacing-passed to D3's flow: air-lane divers, high roads, live darkness beats.)
- **D3 Witchwood** (`09v…09z` via `09u_w3kit`, enemies `07w`) — 5 levels + **Broomhilda** (`10c_boss3`, spin-the-bristles buck-off secret). Webling/Widowmite/BroomZoomer/ToadstoolBouncer; giant climbable webs; MysteryCauldron gamble + CauldronDip vessel.
- **D4 Ghost Harbor** (`09zb…09zf` via `09za_w4kit`, enemies `07x`) — 5 levels + **Captain Wraith** (`10d_boss4`, stare-lock him + relight the 4 deck lanterns under cannon fire → solid → hit ×3; defeat brings the sea rushing back). Dried-seabed pirate galleon. Boo Buccaneer/Barrel Mimic/Cannon Crab/Rigging Wraith; NEW mechanics: tide platforms, **cannon-launch** (DKC barrel; `player.captured`/`launchT` hooks), listing deck, rolling cannonballs, bilge flood, TreasureChest gamble. Leap-of-Faith #2 in 4-2's open water; Old Shortcut warp in 4-4.
- **D5 Cursed Castle** (`09zh…09zl` via `09zg_w5kit`, enemies `07y`) — 5 levels + **Grimm's Cursed Cauldron** (`10e_boss5`, THE FINALE): feed the 4 recovered embers to the 4 arena burners under fire (each strips one of Grimm's attacks + sweetens the brew) → he's flushed out → **invite him to the festival** (any action button, not an attack) → the wholesome ending (Everflame relights whole, Grimm becomes night-watchman) → victory. Clockwork keep. Clockwork Knight (bow-telegraph)/Shadow Copy/Mirror Boo; NEW mechanics: gear platforms, pendulum blades, clock-chain climb, GrimmGift gamble (Shadow-Pip ambush), the midnight-clock Old Shortcut warp (hit minute→hour gear in order).
Gate chain (`WORLDS` in `08_hub`): beating a district's guardian opens the next (`req` field). The whole 5-district story is content-complete.

## Commands

```bash
npm install          # three@0.165.0 + playwright (dev)
npm run build        # → dist/grimmwick.html (single file) + dist_cap/index.html (for Capacitor)
npm test             # headless Chromium playtest: boots game, simulates input, screenshots, checks errors
```

Play locally: open `dist/grimmwick.html` in any browser. Desktop: WASD + Space (jump/double-jump) + J (spin attack) + K (ground pound) + E (interact) + mouse drag (camera). Touch devices get a virtual joystick + JUMP/SPIN/💥 buttons automatically.

Debug URL params: `?test=1` (skip title, mute), `&scene=level1|boss1` (jump to area).
Debug console API: `window.__game.state()`, `.warp(x,y,z)`, `.scene('boss1')`, `.errors`.

## Architecture

Everything is hand-built procedural geometry (three.js primitives + vertex colors + emissive) — **no external assets, no textures, no model files**. This is a deliberate constraint: it keeps the whole game in one reviewable codebase, makes reskins trivial, and keeps the bundle ~800KB.

`build.js` concatenates `src/` **in filename order** into one `<script type="module">` inside a single HTML file (three.js is embedded as a JSON string and imported via a Blob URL, so the file works offline and inside Capacitor with zero network).

| File | Owns |
|---|---|
| `src/00_utils.js` | `PAL` palette, `rand/lerp/damp`, `mat()/emat()/geo()/mesh()` cached factories, `bakeGroup()` static-merge, `blobShadow()`, `Particles` |
| `src/01_audio.js` | `AUDIO` — WebAudio synth SFX + procedural spooky-waltz music loop. No audio files. Init on first user gesture. |
| `src/02_input.js` | `INPUT` — unified keyboard + touch (dynamic joystick left half, camera drag right half, buttons via UI). Edge-triggered flags cleared in `endFrame()`. |
| `src/03_physics.js` | `PhysWorld` — AABB colliders, circle-vs-rect XZ resolve, step-up (≤0.45), landing/ceiling, `bounce`/`hazard`/`trigger` types, moving platforms (`addMover`), `groundHeight()` for shadows. |
| `src/04_camera.js` | `CamCtrl` — third-person follow, manual orbit, auto-align-behind (only when moving away/across camera — never toward, prevents spiral), shake, `moveDir()` for camera-relative input. |
| `src/05_entities.js` | `EntityMgr` + pickups: `Candy` (magnet), `Heart`, `GoldPumpkin` (3 hidden per world), `Checkpoint` lanterns. |
| `src/06_player.js` | `COSTUMES` dict + `Player` — rig built from primitives per costume, moveset (run/jump/double/pound/bag-spin/spring-charge), hearts, i-frames, squash&stretch, stomp detection. |
| `src/07_enemies.js` | `Enemy` base + `Boo` (shy — freezes when faced), `Hopper`, `Skelly` (telegraph→lunge), `Spider` (hang→drop→chase). |
| `src/08_hub.js` | `WORLDS` table (5 districts), `buildHub/updateHub`, Everflame centerpiece, Mayor Boo NPC, Costume Cauldron, gates (open/locked/beaten-relit), shared deco builders (`deadTree`, `pumpkinDeco`, `fenceRun`, `makeBats`). |
| `src/09_levelkit.js` | Shared level-building kit: `grave/bigPumpkin/hayBale/platform/groundX/mudPitX/signPost/thornsX`, the `W1_LEVELS` registry + `findLevel(id)`, `levelBegin/exitGate/levelFinish/updateLevelCommon`. |
| `src/09a…09e_w1lN.js` | One file per District-1 level (`w1l1` GRAVEYARD LANE · `w1l2` PUMPKIN FIELD (warp) · `w1l3` THE CROOKED BARN · `w1l4` THE WITCH'S GARDEN (leap of faith) · `w1l5` THE KING'S DOORSTEP). Each self-registers in `W1_LEVELS`. |
| `src/09t_tutorial.js` | `buildTutorial/updateTutorial` — Gran's Backyard move-teaching area. |
| `src/10_boss1.js` | `buildBossArena` + `PumpkinKing` — phase state machine (intro→hop→bigslam→stun→enrage→seeds→defeat), shockwave rings, seed lobs, minion spawns. |
| `src/11_ui.js` | `UI` — all DOM/CSS: HUD, title, story intro slides, dialogue, prompts, toasts, pause/settings, store (3 tabs), death/victory, boss bar, touch controls, fade. |
| `src/12_main.js` | `G` — renderer, scene lifecycle (`switchArea` rebuilds per area), save (`Store` safe-storage wrapper), game-state machine, main loop, adaptive pixel-ratio, `__game` debug hooks. |

### Key contracts
- **Enemy contract**: set `isEnemy=true`, `hitR`, `headH` (stomp height), `touchDamage`, implement `update(dt)` + inherit `takeHit(player, kind)` / `die()`. Register via `G.ents.add(...)`. Player stomp/attack/pound detection then works automatically.
- **World/collider contract**: visible mesh + `G.world.addBox(...)` (or `addMesh`) — physics is invisible-box-driven, meshes are decoration. Merge non-interactive deco with `bakeGroup()` (one draw call).
- **Scene lifecycle**: `G.switchArea('hub'|'level1'|'boss1')` tears down and rebuilds. Never keep references across areas.
- **Save schema**: `{candy, embers, worlds:{w1:true}, gp:{w1:[b,b,b]}, levels:{w1l1:{done,stars:{time,candy,clean},best}}, best:{w1boss}, owned:[keys], equipped, seenIntro, lastLevel}` → JSON in localStorage key `grimmwick_save` (in-memory fallback; auto-migrates old `hollowville_save`, and a beaten pre-split World 1 marks all five levels done).

### Performance budget (60fps on A14+ / M1)
- Point lights: physical falloff (three r165) — use intensity ~30–70 with distance set; **max ~6 per scene**.
- Draw calls < 300: bake all static deco; entities are cheap primitive groups.
- No shadow maps — blob shadows only. `basePR` auto-drops when fps < 40.

## Story (canon — keep consistent)

Grimmwick is the town where Halloween never ends. Every 100 years the **Ember Moon** recharges the **Everflame**, the bonfire that keeps every spirit sweet. Tonight, **Grimm, the Forgotten Guest** — the one spirit never invited to the festival — swallowed the flame and shattered it into **5 embers** across the town's 5 districts, corrupting each district's beloved **guardian**. **Pip**, the smallest kid in town ("too little for adventures"), is the only one Grimm overlooked. Beat guardians → free them → recover embers → each district visibly relights in the hub. Finale: Grimm fights from his **Cursed Cauldron**, where he brews the stolen embers. He isn't destroyed — Pip **invites him to the festival**. He becomes the town's night-watchman (and a future playable character). Wholesome ending, sequel-ready (seasonal spin-offs: Winterfest, etc.).

## GAMEPLAY IS SIDE-SCROLLING (owner decision — supersedes earlier 3D free-roam)

**Levels play like Super Mario World: side-view, left-to-right, with modern 3D art ("2.5D" — DKC/Kirby style).** ✅ Converted: `G.mode==='side'` locks movement to the x-axis lane (z=0), the camera is a fixed side view with velocity lookahead, and levels are built along +X with background depth at z<0 and foreground silhouettes at z>0. The hub town remains free-roam 3D — it is the "overworld map." All future levels are side-scroll. Graphics bar: ACES filmic tone mapping, layered parallax (near hills / glowing town / far hills), fireflies, vignette, grass-lip ground highlights — push further with per-district palettes and optional bloom on capable devices.

## Reference games (owner-cited — what each one contributes)

- **Super Mario World / Mario Land 2 (GB) / Mario Maker** → STRUCTURE: linear side-scrolling levels (enter left, gate right), overworld map, secret exits, boss castles, deterministic layouts.
- **Hollow Knight** → FEEL & ATMOSPHERE: tight weighty air control, pogo-bounce off enemies (our stomp-bounce), moody layered parallax darkness pierced by glow. NOT its Metroidvania structure — that would be a future spin-off, not this game.
- **Donkey Kong Country** → momentum, bounce chains, collect-hunting, animated 3D-styled art in a side-view game.

## Design north star: Super Mario World (SNES)

The owner's reference for how this game should FEEL as a package (structure, not camera — movement stays 3D Mario-64 style):
- **Overworld map** with level dots and connecting paths per district (the hub town is the world map; each gate opens a district map screen). Completed levels glow; secret discoveries visibly branch the path.
- **Short, focused, replayable levels** with one idea introduced, twisted, then mastered.
- **Secret exits** — our Old Shortcut warps are SMW's keyholes. Stretch goal: warps can additionally unlock a hidden **bonus level per district** ("the Quiet Side trials" — Granny Wick's serene, brutal challenge levels = our Star Road) as post-launch content.
- **A castle/boss capping every district**, each with its own gimmick.
- **Gentle start, demanding finish** — Yoshi's Island 1 up front, Special Zone energy by the end. See the curve below.

## District themes (owner-set — every level must feel like WHERE it is)

Owner's four requested section themes, mapped into the five districts (with one canon upgrade):

| District | Theme | The feel |
|---|---|---|
| 1 · Pumpkin Patch | Moonlit farm | Warm intro: fields, barns, scarecrows, bouncy gourds |
| 2 · Ravenmoor Cemetery | **Spooky graveyard → SPOOKY CAVES** | Surface levels among the graves (2-1, 2-2), then the district DESCENDS into the **Catacombs** (2-3 → 2-5): glowing crystals, wisps in the dark, underground rivers, bats pouring from the deep. The cave section lives here. |
| 3 · Witchwood | **Haunted forest with witches** | Crooked braided trees, witch huts on stilts, bubbling cauldron clearings, riderless brooms, glowing potion light. Broomhilda's domain. |
| 4 · Ghost Harbor | **Haunted pirate ship in a DRIED-UP harbor** (owner's idea — canon upgraded): when the Everflame shattered, the SEA ITSELF went out with it. The harbor is a cracked, dried seabed — dead coral, stranded shipwrecks, tide-pool puddles, the **Salty Phantom** beached on its side. Board the dead ship where it lies. When Captain Wraith is freed, **the sea comes rushing back** — the district's relight moment is a returning ocean. |
| 5 · Cursed Castle | Clockwork castle | Stopped clocks, gears, shadow gauntlets, Grimm's throne. (Its dungeon levels can echo the catacombs for a full-circle feel.) |

Rule of fit: the cave theme belongs UNDER the cemetery (caves as a whole district would break the town-map geography); the dried harbor replaces the old tide/fog framing everywhere it appears.

## DETAIL DENSITY CHECKLIST (owner directive: "as much detail as possible" — every level ships with ALL of these)

✅ = implemented in Level 1 as the reference standard:
1. ✅ **Three parallax depths** (near hills, glowing town silhouettes, far hills) + **sky life** (drifting clouds over the moon, wheeling bats)
2. ✅ **Falling ambient** — autumn leaves in the Patch; per-district: drifting dust motes (Catacombs), spores (Witchwood), salt-mist (Dry Harbor), clock-soot (Castle)
3. ✅ **Fireflies/wisps** pulsing through the midground
4. ✅ **Ground clutter every ~2 units, ALL BAKED** (zero runtime cost): rocks, grass tufts, scattered bones, stray hay, tiny mushrooms — themed per district
5. ✅ **Reactive ambient critters** (2–3 per level): crows that flap off when approached; later: mice, frogs, moths around lanterns — the detail players FEEL
6. ✅ **Light pools** along the path (lantern glows) — max 6 real lights, emissive fakes elsewhere
7. ✅ **One quiet storytelling prop per level** (never signposted): Level 1 has a tidy grave with a plate of cookies on it. Story-readers gasp; everyone else walks past. Every level hides one.
8. ✅ **Foreground silhouettes** (z>0 graves/pumpkins) for depth framing
9. ✅ **Micro-motion everywhere**: portal shimmer, gem pulses, ear wiggles, scarecrow sway — nothing is perfectly still
Perf guardrails: bake all statics (`bakeGroup`), cull entities >70u, draw calls <300, pixel-ratio auto-drop.

## THE BEAUTIFUL MAP (owner directive — the district/level-select screen is a jewel, not a menu)

When built (top of the roadmap), the map is a **living illustrated night-map of Grimmwick** viewed from above: the town glowing at center, five districts arranged around it, level nodes as little lanterns along winding paths. Requirements: completed levels' lanterns burn warm; the current level pulses; secret exits visibly branch the path once found; each freed district VISIBLY relights on the map (and the sea floods back into the Dry Harbor); clouds drift across the map; the Everflame at center grows with each ember. Same engine, same art language — think SMW's map with Grimmwick's soul.

## Difficulty curve (owner directive: easy first district, "fairly competitive" after)

Difficulty comes from **level design, never damage sponges** — always fair telegraphs, and the safety valves (hearts, checkpoints, Second Wind, Granny Wick) keep the floor accessible while stars/warps/leaderboards raise the ceiling for competitive players.

| District (levels) | Target feel | Enemies/level | Checkpoints | Platforming | Boss |
|---|---|---|---|---|---|
| 1 (1–5) | Warm welcome — ~95% of players finish, but ALIVE (owner: 'easy ≠ empty') | 4–7, single types | 2 per level | Wide platforms, safe gaps | 3 HP, long stun windows |
| 2 (6–10) | First real tests, occasional deaths | 6–9, first combos | 2 per level | Moving platforms over hazards | Faster, projectiles (bats) |
| 3 (11–15) | "Fairly competitive" begins — retries expected | 8–11, mixed ambushes | 1–2 | Verticality, timed platforms, thorn mazes | Aerial boss, stays mobile |
| 4 (16–20) | Precision + pressure | 9–12, elite variants appear | 1 | Fading/tide platforms over void | Intangibility puzzle under fire |
| 5 (21–25) | Mastery exam | 10–14, everything combined | 1, mid-level only | Chained mechanics, tight windows | Multi-phase finale |

Tuning knobs live in one place when levels are built: enemy count/speed multipliers, hazard coverage %, checkpoint count, platform timing windows, gap widths. Post-game **Nightmare Mode** remixes shift every district one column right.

## Game structure (target)

**5 districts × 5 well-constructed levels + 1 boss each = 25 levels, 5 bosses.** (Owner decision: quality over quantity — 25 excellent levels beat 50 padded ones.) Levels are meaty but mobile-friendly (2–3 minutes), selected from a district map screen; every 5th gate is the guardian fight, so players hit a boss — the best content — twice as often, and the story breadcrumbs land faster. Difficulty rises per level via a tuning table (enemy density/speed, hazard coverage, checkpoint spacing, platform timing windows), and each boss is a major spike with more phases than the last. The current World 1 is one long ~5-minute course — **split it into Levels 1-1 … 1-5** (one existing section per level, expanded) as the first restructure task.

**Multi-route levels (owner directive — most levels have 2–3 routes):**
- **LOW ROAD** — the safe, obvious path along the ground. Anyone can finish the level here.
- **HIGH ROAD** — an elevated platforming route: harder jumps, more enemies in awkward spots, noticeably more candy, and usually the path to a Golden Pumpkin. The all-candy star typically requires it.
- **EXPERT LINE** — hidden or skill-gated (mega-bounce, bat wings, later broom/cannons): warp shortcuts, secret rooms, jackpot coffins.
- **TRAP ROUTES** (owner directive) — some paths are lies. Always *subtly telegraphed* (darker/crooked geometry, dead flowers, a crow staring, a sign pointing the wrong way) so observation is the counter-skill. Severity scales with the curve: Districts 1–2, a trap costs a heart and a checkpoint walk-back (✅ Level 1's rotten bridge at the first gap — the easy-looking low crossing crumbles); Districts 4–5, true certain-death pits that restart the level; Nightmare Mode, full-restart traps everywhere. Rule: a trap must never be the ONLY visible route, and the honest route must be visible from the trap's entrance.
- **LEAPS OF FAITH — exactly TWO in the entire game.** A gap that looks like certain death (you cannot see below; no tell of ANY kind, ever) where jumping in completes the level instantly with all rewards. ✅ One is live: Level 1, the second half of the ghost-platform gap. The other belongs somewhere in Ghost Harbor's open water. These are never hinted — they are community-legend fuel, discovered by accident or dared by friends. Do not add more; two is the magic number.
Routes must **cross visibly at junction moments** — a player on the low road should SEE the high road's candy overhead (creates the "next run I'm going up there" itch). Rewards always scale with risk. ✅ Level 1 demonstrates all three: ground route through the mud/pumpkins (low), elevated platform chain over the field (high, ends at Golden Pumpkin #1), and the mega-bounce warp island crowning the high road (expert).

**Cursed Coffins** (✅ implemented — 2 in Level 1): ornate vampire coffins tucked off the main path. **The container is themed per district** — same gamble system, different skin and themed ambush:
| District | Gamble container | Ambush |
|---|---|---|
| 1 Pumpkin Patch ✅ | Cursed Coffin (pulsing red gem) | Spider burst |
| 2 Ravenmoor | Restless Urn on a grave plinth | Bat swarm pours out |
| 3 Witchwood | Mystery Cauldron (bubbling glow — you dip in) | Widowmite swarm |
| 4 Ghost Harbor | **Glowing pirate TREASURE CHEST** (barnacled, gold light leaking from the seams) | Boo Buccaneers burst out |
| 5 Cursed Castle | Grimm's Gift Box (black present, silver ribbon... suspicious) | Shadow-copies of Pip |

They GLOW with a pulsing red light — temptation visible from across the level. **CLEAR-PATCH LAW (owner call, July 22 2026):** every gamble container sits in a clear pocket — no patrol routes within ~6 units, so opening is a deliberate safe act; ambush spawns emerge on a fixed scatter ring with a ~1s harmless grace (`spawnGrace`) before they can bite. The gamble is the CHOICE, never a cheap hit. Open one and it's a gamble: 42% a few candies, 28% JACKPOT (candy fountain + a heart + a random POWER-UP), 30% AMBUSH (four spiders burst out and scatter). Ambush enemies still drop candy, so opening is always net-positive-ish — kids keep opening, which is the point. Place 1–2 per level in later districts; extend the jackpot table with cosmetic shards/broom skin pieces once those exist.

**Old Shortcuts — secret expert warps** (✅ first one implemented in Level 1): 5 levels (one per district) hide a skip-to-the-end warp that only skilled, observant players will find. Rules: the tell is always **a lone purple lantern glow** somewhere it shouldn't be (players learn the language); reaching the warp requires mastery of that district's mechanic; using it teleports to the end of the level, awards the level's **full candy bonus**, and (once stars exist) counts toward the time star — Golden Pumpkins still require real exploration. Once per run. These are the speedrun/leaderboard meta.

| District | The warp | Skill gate |
|---|---|---|
| 1 Pumpkin Patch ✅ | Floating graveyard island west of the pumpkin field, past the fence and the void | Ground-pound mega-bounce off a giant pumpkin + air-steering |
| 2 Ravenmoor | A cracked grave slab drops into the catacombs | Ground-pound the same slab 3× in rhythm |
| 3 Witchwood | Hedge-maze wall opens | Relight the level's 3 dark lanterns in reverse order |
| 4 Ghost Harbor | Crow's nest of the sunken ferry | Freeze-stare a Boo mid-path and use his head as a stepping platform |
| 5 Cursed Castle | The stopped clock strikes midnight, face opens | Hit the minute gear then hour gear in the right order |

### Power-ups, weapons & the item economy (what drops from what)

**Vessels** — where the goodies come from:

| Vessel | How the player triggers it | What comes out |
|---|---|---|
| **Bonk Lanterns** ✅ (our "? block" — a floating glowing jack-o'-lantern) | Spin-attack it, stomp it from above (bounces you), or catch it in a pound shockwave | A power-up (contents fixed per placement, for design control) |
| **Cursed Coffins** ✅ | Walk up + interact | The gamble: candy / jackpot / ambush |
| **Enemies** ✅ | Defeat them | Candy (2–4). Rare **golden variants** of any enemy drop a power-up |
| **Piñata Boo** (rare, flees squeaking) | Chase it down and hit it 3× before it escapes | Candy shower + guaranteed power-up |
| **Checkpoint lanterns** ✅ | Walk past | Occasionally a heart |
| **Cauldron dips** (Witchwood+) | Jump into a small bubbling cauldron | A random short brew-buff |

**Power-up set** (timed; one active at a time — the shield persists alongside):

1. 🛡️ **Gummy Shield** ✅ implemented — a wobbly gummy bubble that absorbs one hit
2. 🌙 **Moon Drop** ✅ implemented — 10s invincible + 1.35× speed; enemies crumble on contact (the Star)
3. 🦇 **Bat Wings** ✅ implemented — 18s; up to 4 mid-air flutter-jumps per flight + gentle glide (the Cape)
4. 👻🌶️ **Ghost Pepper** — 10s spectral: walk *through* enemies and ghost-gates (opens secret routes)
5. 🔥🍬 **Ember Pop** — 30s; the spin attack launches a short-range ember projectile (the Fire Flower)
6. ⚡ **Sugar Rush** — 20s; speed boost + double candy-magnet radius
7. Future: **Candy Pocket** — SMW's reserve item box: carry one stored power-up, tap to use it when needed

**Weapons**: the candy bag is the default. Earnable **sidegrades** (equal power, different feel — found in coffins/piñata boos/completion milestones, NEVER sold): Bone Club (slower, wider arc), Lollipop Hammer (bigger pound radius), Wraith Whip (longer reach, narrow). Cosmetic *skins* for each are the sellable part (store + pass), per the monetization rules.

### Enemy rosters by district (variety mandate — no district reuses more than 2 earlier enemies)

- **Pumpkin Patch** ✅: Boo, Jump-o'-Lantern, Skelly, Web Spider (barn), Swoop Bat (air lane — fixed patrol, squeak-telegraphed snapshot dive, never homing)
- **Ravenmoor Cemetery**: Wisps (chase in darkness), Gravemites, crow flocks, Skelly variants; spiders in the crypt levels
- **Witchwood**: THE spider district — Weblings (web-wall builders), Widowmite swarms, drop-Spiders everywhere; enchanted brooms that sweep you off ledges
- **Ghost Harbor / the Salty Phantom**: **Boo Buccaneers** — ghost pirates with bandanas and cutlasses, and a twist on the learned rule: stare at them and they *wink and keep creeping, just slower* (the harbor's ghosts are bolder); **Barrel Mimics** — deck barrels that sprout teeth and lunge when you pass (trust no prop on a haunted ship); **Cannon Crabs** — crabs in cannon-shell armor lobbing arcing shots (tide pools + deck); and the unique one: the **Rigging Wraith** — a specter that travels ONLY along the ship's ropes and rigging, sliding like a zipline predator above the deck fight
- **Cursed Castle**: shadow-copies of everything (Grimm's brew), clockwork knights, mirror Boos

### The CATACOMBS roster (owner-inspired by Dungeon Crawler Carl's ENERGY — absurd, funny-deadly — all creatures 100% ORIGINAL; never copy that IP's monsters/characters/names)

- **The Lost Tour Group** — six skeletons holding hands in a line, shuffling behind a bored tour-guide wisp holding a tiny flag. Completely harmless... unless you break the line, at which point all six are VERY upset at once.
- **Gravedigger Moles (Local 111)** — hard-hatted moles who burrow up swinging tiny shovels — but stop mid-chase when the break whistle blows, sit down, and sip tea. Union rules. Attack them on break and every mole in the level gets involved.
- **Barkibald** — the catacombs' skeletal guard dog. Relentless... but he's still a good boy: hit a bone pile and he ABANDONS the chase to go fetch. Throwable-bone distraction mechanic.
- **The Committee** — a swarm of bats flying in formation as ONE GIANT BAT. Hit it and it disbands into arguing members who reform after "reaching quorum" (3 seconds).
- **Sir Reginald III, Esq.** — a dueling skeleton in a ruff collar who formally ANNOUNCES each attack ("A thrust! ...A parry!"). The announcement IS the telegraph — Mario-fair, played for pomp.
- **Low-Doorway Gag** (environment comedy): "MIND YOUR HEAD" signs before crawl-height passages — Pip fits; the tall enemies chasing you CLONK and see stars.

**THE FIELD GUIDE (bestiary — the DCC-flavored feature done legally):** every enemy type gets a collectible Field Guide entry (unlocked on first bonk) with a deadpan-funny description in Grimmwick's own voice — e.g. Boo: "Terribly shy. Committed to the bit." Barnaby Rat: "Not technically a criminal. Technically." Completionists hunt entries; the humor becomes the game's voice. Original flavor text ONLY — the comedic-bestiary FORM is a genre tradition, the words are ours.

### The GOOFY roster (owner directive: comedy characters & enemies)

- **Barnaby Rats** ✅ implemented (2 loose in Level 1) — big round barn rats that scurry in panicky dashes and STEAL loose candy off the ground, growing fatter with every piece. Bonk one and it coughs up everything it ate plus 50% interest. Comedy + economy in one enemy.
- **Mummy Lurch** (Ravenmoor catacombs) — shambles slowly, arms out, bandages dragging. Hit him and he UNRAVELS: spins across the floor like a top (dodge the spin-out!) leaving behind a skinny, embarrassed skeleton who covers himself and sprints away — catch the runner for bonus candy.
- **Scaredy-Crow** (Pumpkin Patch) — a scarecrow that is terrified of YOU. Flails, shrieks, and flees when approached; corner one and it faints, dropping candy. Not dangerous. Deeply satisfying.
- **Coffin Hoppers** (Ravenmoor) — coffins hopping around with little bare feet sticking out the bottom. Occasionally trip over.
- **Broom Zoomers + Toadstool Bouncers** (Witchwood) — riderless brooms that sweep low trying to bowl you over; big soft mushroom fellows who don't hurt you at all, they just BOUNCE you, sometimes helpfully, sometimes off a ledge.
- **Ghost pirates = the Boo Buccaneers** ✅ designed (Dried Harbor) — bandanas, cutlasses, and the wink (staring only SLOWS them). Their crewmate **Peg-Leg Polly**, a skeleton parrot with a tiny peg leg, squawks hints and insults from the rigging (comic NPC).
- **Three Rats in a Trench Coat** (Witchwood shop) — a "totally normal witch" who runs a back-alley potion stall. It is three Barnaby rats stacked in a coat and hat. Everyone in Grimmwick is too polite to mention it. Sells nothing useful. Beloved.
- **Clockwork Butlers** (Cursed Castle) — over-polite armored knights who BOW before each attack (the bow IS the telegraph — Mario-hard fairness, played for laughs).

**Replay depth stretches 25 levels into 50+ hours-worth of goals**: per-level star ratings (fast time / all candy / no damage), 3 hidden Golden Pumpkins per district, secret-takedown speedruns for leaderboards, and post-launch **Nightmare Mode** (remixed hard variants of all 25 levels — doubles content cheaply once the base game ships) plus an endless **Boo Rush** survival mode as season content.

Districts, guardians & **boss skills** (see `WORLDS` in `08_hub.js`). Beating a guardian grants their signature skill as an **equippable ability** (one active slot, HUD button, cooldown-based) — the Mega Man hook.

### Ghost Harbor & THE SALTY PHANTOM (haunted pirate galleon — District 4 centerpiece)

Captain Wraith's beloved ferry, corrupted into a ghost galleon: tattered glowing sails, barnacled hull, green lantern light, a spectral crew of boo-sailors. The district's five levels build up to it and then board it:

| Level | Beat |
|---|---|
| 4-1 | **The Misty Docks** — crates, cranes, rope-swing intro, first Boo sailors; the galleon looms offshore in the fog |
| 4-2 | **Tide Pools** — platforms that sink/surface with a rhythmic tide; ghost crabs; timing-focused |
| 4-3 | **The Lighthouse** — vertical climb, rotating light beam reveals invisible plank paths (light = the district's language) |
| 4-4 | **Boarding the Salty Phantom** — cannon-launch from the dock (aim + fire, DKC-barrel style), then deck-to-rigging platforming: swinging ropes, tilting deck as waves roll, sail-slides, boo crew ambushes from hatches |
| 4-5 | **Below Decks** — the ship's haunted interior: rolling cannonballs, flooding bilge sections, the ghost crew's mess hall; ends climbing back up through the captain's cabin to the deck — **boss fight ON the deck** (Captain Wraith, intangible until the 4 deck lanterns are lit; the stare-freeze rule works on him) |

Ship-specific mechanics to build: **cannon-launch** (enter cannon → aim arc preview → fire; reused for secrets), **rope swings**, **tilting deck** (deck slowly rolls ±8°, physics-slide), **tide platforms** (sink on a shared clock). The district's Old Shortcut warp = freeze-stare a Boo sailor mid-gangplank, hop off his head into the **crow's nest** of the Phantom.

**Boss design rule — every boss has three layers:**
1. a *brute-force path* that is hard and gets harder each boss (more phases, faster telegraphs, overlapping attacks),
2. a *secret takedown* the player must discover that trivializes or shortcuts the fight, and
3. an *in-world hint* (NPC foreshadowing, arena prop, crowd chant) that rewards observation without spelling it out.
Speedrunners and leaderboard players compete on discovering + executing the secrets.

| # | District | Boss | Fight (brute path) | SECRET takedown | Hint | Reward |
|---|---|---|---|---|---|---|
| 1 | Pumpkin Patch | **The Pumpkin King** ✅ built | Hop-slams, shockwave rings, seed volleys, minions; stomp only during post-slam dizzy (3 hits) | ✅ IMPLEMENTED: ground-pound an arena pumpkin → mega-bounce onto his head = crit any time (one crit per bounce) | Mayor: "bring your bouncing shoes"; crowd chants "BOUNCE!" if the fight drags | Skill: **Gourd Slam** |
| 2 | Ravenmoor Cemetery | **Mossgrave, the Tombstone Titan** — a huge cracked haunted gravestone | Headstone slam shockwaves + **homing bat swarms**; stone hide, swings barely chip him | Spin-swat a bat back at him (tennis!) → it homes on HIM, topples him face-down, exposing the glowing moss runes on his back → hit the runes for big damage | Bats flash orange in the instant they're swattable; gravedigger NPC: "moss only grows where he can't scratch" | Skill: **Bat Swarm** + story reward: **Granny Wick's Thimble — the Summon** (see below) |
| 3 | Witchwood | **Broomhilda the Broom Witch** — rides a broomstick | Swooping dive-bombs, potion lobs that leave goo, raises thorn walls; she never lands | When she hovers low to cast, her broom's bristles sparkle — spin-attack the bristles 2× → the broom bucks her off → long ground stun | Bristles visibly sparkle; sign: "a broom's pride is its bristles"; cauldron fumes make her sneeze mid-cast (dodge cue) | **THE BROOMSTICK** — rideable mount (see below) |
| 4 | Ghost Harbor | **Captain Wraith** — the ghost boss, fought on the deck of his haunted galleon **The Salty Phantom** | Intangible most of the fight (attacks pass through), anchor sweeps, cannon volleys from the rigging, boo crew, the deck tilts with the waves | Boos freeze when stared at — HE does too. Face him to lock him in place while backing toward the 4 dark dock lanterns; relight all 4 → his mist burns away, he turns solid & stunnable | Player already learned the stare rule on Boos in levels; lanterns visibly unlit; parrot NPC: "he hates the light, squawk!" | Skill: **Phantom Dash** (invincible dash) |
| 5 | Cursed Castle | **Grimm's Cursed Cauldron** — final: a giant possessed CAULDRON with Grimm's shadow arms & glowing eyes rising from the black brew (he's been brewing the stolen embers in it) | 3 phases; goo tidal waves, potion rain, the brew spawns shadow-versions of earlier enemies, shadow-arm slams; the darkness shrinks the arena as the fight goes on | Feed your 4 recovered embers to the four burners around the arena — each one *sweetens* the brew (black → candy-pink), strips an attack, and shrinks the shadow, until Grimm is flushed out of the pot. The killing blow is not an attack: walk up and **invite him to the festival** (interact button) | Burners flare when an ember is near; the whole story has been about relighting flames | Skill: **Shadow Leap** + ending + Grimm playable (post-story) |

**Boss skills are earn-only — never sold.** Monetization stays cosmetic so the game is fair-to-play and safe for a low age rating.

**THE SUMMON — Granny Wick's Silver Thimble** (unlocked after Boss 2, separate from the boss-skill slot):
- Story: freeing Mossgrave reunites Pip with **Granny Wick**, Pip's gran on the Quiet Side (she sewed Pip's ghost-sheet costume). She gives Pip her Silver Thimble — squeeze it and she comes running, even from the Quiet Side.
- Mechanic: its own HUD button (👵🪡, bottom-left above the joystick) with a radial cooldown sweep. On use: screen dims, spectral glow, Granny Wick swoops across the area — damages and scatters ALL nearby enemies, briefly stuns bosses (~2s), restores 1 heart, waves goodbye.
- **Recharge: 120 seconds** ("crossing over takes a lot out of an old ghost — let me catch my breath"). Timer runs on game-time, persists across levels within a session, resets fresh at each boss.
- Tuning intent: a panic button, not a rotation ability — long enough that using it feels like calling for help, not a combo piece. Never usable during the final invite sequence (she appears IN that cutscene instead, standing behind Pip).
- **Never monetized**: no skins, no cooldown reductions in the store or pass. This one is sacred.
- Implementation notes: `player.summonCD` on save-less session state; `Summon.play(G)` cinematic = 3s of spawned ghost-rig flying a spline through enemies calling `takeHit(player,'summon')`; input lockout 0.8s; works in levels and bosses.

**The Broomstick economy** (owner decision, current recommendation): the broom *mount* is the reward for beating Broomhilda (earned, keeps fairness + makes boss 3 a huge moment). The store then sells **broom skins** (Shadow Broom, Candy-Cane Broom, Golden Gourd Broom...) and the Spook Pass premium track includes exclusive broom skins — the Fortnite-glider model: everyone earns the mount, whales collect the looks. Alternative if desired: sell the broom itself as an early-unlock convenience purchase (auto-granted at boss-3 victory for non-payers) — more revenue, slightly worse fairness optics for a kids-rated game.

**Competitive layer**: per-level star ratings (fast time / all candy / no damage), Game Center leaderboards for level times, later async "ghost" racing against friends' runs.

**Candy economy**: enemies burst into candy on death (implemented — pop physics + magnet pickup); candy is the only soft currency. Sinks: costumes, **Heart Containers** (permanent extra max hearts — 500 then 1500, deliberately expensive), and **Second Wind** (200 candy to revive on the spot at the death screen instead of returning to the lantern — implemented). The Spook Pass premium track showers candy, so passholders reach heart upgrades much faster while free players grind — exactly the intended pull toward the pass without selling power directly.

**Pass purchase = INSTANT payoff** (owner directive, ✅ implemented in test mode): buying the pass immediately grants that season's marquee outfit — Season 1: **NIGHTSTITCH** (night-sky indigo, glowing cyan stitch-seams, star trail) — equipped on the spot with fanfare. More clothing lands along the track (Ember Spirit t5, cobweb cape t13, ghost-anchor backbling t18, broom skin t20, Grimm's Herald t25). Rule: the purchase must feel amazing within ten seconds.

**Spook Pass (seasonal battle pass)**: tier progress advances on **level completions** (and stars). Free track for everyone (candy, small cosmetics); premium track (paid) unlocks characters, outfits, and weapon skins at those same completions. Season 1 = "The Ember Moon" themed around launch content; new seasons ship with new districts.

## Lives, checkpoints & death rules (owner directives)

- **Every level has checkpoint lanterns** (2 in Districts 1-2, 1-2 in D3, 1 in D4-5 per the curve). Death returns to the last lit lantern - NEVER the level start (Level 1 has three).
- **5 lives.** Each death costs one. Out of lives = GAME OVER -> restart the current level with 5 fresh lives (implemented). Owner originally proposed full reset to Level 1 - current recommendation: level-restart for the main game (protects ratings/retention with kids), full-run reset reserved for Nightmare Mode where brutality is the badge of honor.
- **Getting lives back**: beat a boss -> ALL lives refill (guardian's blessing, implemented). Rare Ghostly 1-UPs drop from gamble containers (8%, implemented); lives stack to 9. Candy continue at game over: 500 candy for 3 lives (implemented). Second Wind (200 candy) revives on the spot and refunds the life.
- **Real-money lives** (owner option, not yet wired): recommended shape is a StoreKit "candy pack" (money -> candy -> continues) so money never buys progression directly. Direct $-for-lives is documented as the alternative but flagged: it collides with the no-greed positioning and kids-app optics.

## Level fabric rules (owner directives)

- **Gaps are core vocabulary**: every level has jumpable gaps - D1: 1-2 friendly gaps, scaling to D5: chained gap sequences over hazards with moving/fading platforms. Falls cost a heart + lantern walk-back, not a life (unless hearts run out).
- **Enemy density is "a decent amount"** - always something to avoid or bonk (see the difficulty curve for per-district counts); long empty stretches are a design smell. Mix ground patrollers, air floaters, and ceiling droppers so all three lanes of attention stay busy.

## THE THREE JOYS (owner's north star — every design decision serves one of these)

1. **The First Clear** — challenging and enjoyable to BEAT. Mario-hard: you die, you learn, you triumph. Never unfair, never empty.
2. **The Hunt** — enjoyable to SPEEDRUN and explore: warps, leaps of faith, secret takedowns, high roads, all-candy stars, the leaderboard (time → damage → candy).
3. **Mastery** — SATISFYING once you know a level by heart. Determinism makes levels learnable; flow design (bounce chains, momentum lines, candy-combo pitch rising as you chain pickups) makes a perfect run feel like music.

A feature that serves none of the three joys doesn't ship.

## LEVEL DESIGN CONSTITUTION (owner-ratified - every level obeys these)

1. **FLOW & MOMENTUM.** Donkey Kong Country energy: keep moving, bounce chains, rhythm jumps. Thinking happens at route junctions, not mid-jump. A player in the zone should be able to clear a level without ever stopping dead.
2. **HEARTS ALWAYS - no instant death.** Every hazard costs a heart; pits cost a heart + lantern return. No spike ever one-shots. Difficulty scales through density, timing, and checkpoint spacing - never through cheap kills. (Nightmare Mode may bend this; the main game never does.)
3. **ONE SIGNATURE GIMMICK PER LEVEL** (Nintendo's kishotenketsu): introduce it safely -> twist it -> escalate it -> master it. Name levels after their gimmick internally ("2-2 Sinking Graves", "4-2 The Tide"). Players should remember levels as "the one with the ___".
4. **COLLECT-HUNTING MATTERS** (DKC-style): candy trails teach the routes and telegraph jumps; the 3 Golden Pumpkins per level follow the rule *one visible-but-tricky, one behind a secret, one skill-gated*; full-clearing a level is a genuine hunt that feeds stars and pass tiers.
**Difficulty calibration (owner-set benchmark): "same level of hard as Mario games."** An average player should beat any level after a handful of honest attempts — challenge comes from execution, and because levels never change (determinism rule), every death teaches. Full completion (all stars, all pumpkins, all secrets) is the REAL challenge and can be genuinely tough. Never Kaizo, never unfair, never unbeatable — hard the way Mario is hard: you always feel one good run away.

5. **DETERMINISM - the speedrun covenant** (owner's Super Mario Land 2 "three pigs" principle): a level plays IDENTICALLY every attempt. Fixed enemy placements, fixed hazard cycles, movers on fixed clocks from level start. Death costs progress, never knowledge. RNG lives ONLY in opt-in side content (gamble coffins) - never on the critical path. This is what makes levels learnable, masterable, and speedrunnable.

6a. **CLIMBING IS FUN, NOT A LADDER-CHORE (owner call, July 22 2026 — "lets have fun climbing levels too"):** climbing beats must be playful — branching climbs with route choices, climb→boosted-hop→bounce combos, traverses, rhythm candy on the way up. Every district ships at least ONE climb-centric level using its climbable flavor: D1 the Crooked Barn (webs/vines) · D2 a vertical bell-tower/chain DESCENT into the catacombs · D3 giant webs · D4 the Salty Phantom's rigging (4-4) · D5 clock chains. The climb-exit boosted hop is a toy — levels should give it targets.
6. **CLIMBING IS A CORE VERB** (✅ implemented — vines & web-nets, world volume type `'climb'`): press up to grab, climb in four directions, jump off with a boosted hop. Level 1 has a web-net onto the high road and a vine up the silo. Every district gets its climbable flavor: vines (Patch), hanging chains & bell-ropes (Cemetery), giant webs (Witchwood), ship rigging & rope ladders (Harbor), clock chains (Castle).
7. **REGIONAL IDENTITY — every level must feel like WHERE it is** (owner directive): each district has its own palette, parallax skyline, deco set, music theme, enemy roster, climbable type, and gimmick family — and each level within a district still introduces its own signature gimmick. No two consecutive levels may share a gimmick. The map placement must make geographic sense (the Patch borders the town, the Castle looms farthest). A player shown any screenshot should name the district instantly. The bar: "I loved these games growing up — I want people to love playing this." Build like someone's childhood memory is being made.

**Mini-boss slot (homage):** level X-3 of each district may host a mid-boss. The first is **THE GOURD TRIPLETS** - three rolling pumpkins that take turns charging across the arena in fixed, learnable patterns (a loving nod to Mario Land 2's Three Little Pigheads). Stomp each triplet once while the others roll. Deterministic patterns, pure attention test.

## Owner decisions locked (July 2026 Q&A)

- **FEEL-PASS #1** (owner call, July 22 2026, after playing 1-1): the intro level stays gentle — "an enemy here and there to learn to defeat one" — but never empty, and later levels carry the real chaos ("lots of enemy and flying objects to avoid... an actual challenge... fun for the long run"). Every level must have ≥2 visible routes (1-1 shipped with one — high road added same day). Airborne threats are a standing requirement; the Swoop Bat is their D1 form. Skill-gated pickups must have their move telegraphed by a candy trail.
- **SET-PIECE ARCHETYPE: THE BOMBARDMENT (owner call, July 22 2026):** the intense-fight template — "3-4 ground enemies and something shot at them from the sky that needs to be dodged over and over." Ground pressure stops camping; sky projectiles on a FIXED repeating pattern (deterministic clock) with impact points telegraphed ~0.7s ahead (growing target glow), generous safe lanes, candy tracing the dodge rhythm. One per district max, always themed: D1 the Pumpkin King's seed volleys on his own doorstep (1-5) · D2 crow dive-bombs · D4 the Salty Phantom's cannon volleys (canon 4-4/4-5) · D5 Grimm's potion rain. Dodging must feel like dancing, never RNG. Intensity calibration (owner): "same level as Super Nintendo Mario" — SMW's Bullet Bill gauntlet energy, 3-4 simultaneous threats max, never bullet-hell.
- **FEEL-PASS #3 / LEVEL LENGTH** (owner call, July 22 2026 — "loving it, it definitely gets harder... we just need to make the levels longer"): D1 levels expanded from ~60s slices to the canonical 2–3 minute meaty length (~2.5× geometry), each gimmick getting its full introduce→twist→escalate→master arc. D1 checkpoint rule amended: 2 lanterns, 3 when a level exceeds ~100 units (walk-back mercy scales with length). Pars retuned to the longer courses.
- **FEEL-PASS #2** (owner call, July 22 2026, after Simulator session): "a lot going on in EACH LEVEL" — density is a standing bar for every level after the intro; the tutorial gets practice enemies (a volunteer Boo + a Hopper, Gran-signposted) so players learn to defeat one before Level 1; jump raised slightly (single 9.4→10.0, double 8.6→9.0) per owner feel.
- **COMPARABLE HEIGHTS (owner directive, July 2026 — "that is key"):** every rise and gap in every level must be COMFORTABLE against the jump model — never an exact-height jump, never an unreachable-looking-reachable ledge. Prefer slight over-clearance ("rather over jumps here and there vs an under"). Working margins: main-route step-ups ≤ 2.2 (held jump 2.6 with margin) · double-jump routes ≤ 3.0 · anything higher must be explicitly gated (climb, spring ≤ 4.0, mega-bounce ≤ 6.5) with the verb telegraphed. Jumpable gaps: ≤ 4 for tap-speed, ≤ 5.5 held, ≥ 6 requires movers/bounce. The height audit script (runtime collider dump) enforces this — run it when levels change.
- **JUMP MODEL (level-design constants, owner-tuned July 2026):** three tiers — TAP ≈ 1.8u (0.10s full-power grace before the release-cut to vy 6.5; owner speedrun rule: a tap must ALWAYS clear common enemies) · LONG-HOLD ≈ 2.6u on device (gravity eases 24→16 while held & rising, first 0.22s — "hold to jump over enemies or onto them") · DOUBLE ≈ 3.3u+. Jump vy 10.0 / double 9.0. "Held" MUST merge all input sources (touch OR keyboard OR gamepad) — branching on isTouch broke keyboards on touch devices. Bounce vy 13, pound-mega-bounce ×1.35 ≈ 7u apex (unaffected by hold-lift). **SPRING JUMP** (owner request): hold pound (K/💥/B) while grounded — Pip squashes, charge fills in 0.6s and holds forever ("easy to hold"), release launches vy 11–14.5 ≈ 2.9–4.4u (deliberately below the w1l5 shelf/mega-bounce gates; hold-lift never stacks on it). Movement locks while winding. Taught by Gran at tutorial x71.5. Design platforms/gaps against these numbers.
- **TOUCH LAYOUT (owner vision, July 2026): landscape-first**, semi-opaque dynamic joystick on the left half, semi-opaque action buttons on the right — matches the shipped touch UI (dynamic stick spawns under the thumb; JUMP/SPIN/💥 buttons right). Polish pass planned: opacity tuning, thumb-arc button placement, landscape-default nudge.
- **STRUCTURED CHAOS** (owner call, July 22 2026 — "make sure the levels have structured chaos and they are challenging and fun"): levels should feel ALIVE and busy — overlapping motion, enemies on multiple lanes, bounce chains, particles, near-misses — but every element deterministic, telegraphed, and fair (the constitution's flow + determinism rules ARE the "structure"; the density and energy are the "chaos"). Fun-first: when a tuning call is close, pick the more exciting option.
- **LAUNCH SCOPE LOCKED AT 25 (owner call, July 22 2026 — "ok. like that"):** 25 levels + 5 bosses at launch, no growth before October. The bar for every one of them (owner's words): "chaotic, challenging, but also makes sense and has a flow" — structured chaos + the constitution's flow rule, with each level's gimmick introduced→twisted→escalated so the chaos always reads as fair. Post-launch CONTENT CALENDAR (all story/level content FREE forever — never paid DLC; cosmetics/pass are the business, updates are the marketing): **Season 2 (Nov 2026)** Nightmare Mode — remixed hard variants of all 25 levels (curve shifts one column right, full-restart traps legal) + cosmetics wave · **Season 3 (Dec 2026)** Boo Rush endless survival + a Winterfest seasonal drop · **2027** Granny Wick's "Quiet Side trials" (the Star Road — brutal serene challenge levels), Madame Webweaver mini-boss season, new-district spin-offs. Cadence: something new every month; every update is a fresh App Store featuring opportunity.
- **RELEASE SHAPE: the whole game ships at once** (owner call, July 22 2026 — "i want the whole game released at once"): all 5 districts + the Grimm finale at launch; no partial or seasonal story launch. Target: App Store launch October 1 2026 ("earlier the better"), content-complete quality gate ~Sept 15, submission ~Sept 22. Post-launch seasons carry modes/cosmetics (Nightmare Mode, Boo Rush, new districts as spin-off seasons) — never the base story. Audio budget is $0: the in-engine synth is the launch soundtrack (upgrade it, don't replace it) unless a free/credit composer materializes via docs/COMPOSER_BRIEF.md. English-only at launch. Test devices: owner's iPhone 15/16 + MacBook Air; perf floor stays A14.

- **PIP IS VISIBLY HUMAN by default** (owner call, updated July 22 2026): default skin "Just Pip" — visible face, chestnut hair, and the owner-specified EVERYKID OUTFIT: open RED FLANNEL over a white t-shirt, blue jeans, white Converse-style sneakers ("a human going through this different world of beasts and magic"). Reasons: relatability (the ordinary-kid rule — the plainer the human, the more magical the world), readability (red/white separates the hero from the orange-purple world; white shoes = landing beacons), and it makes every costume feel like a transformation. The old orange hoodie lives on as the free "Pumpkin Hoodie" costume. Pip stays a KID — never age him up. Future: first-run skin-tone picker (5 tones).
- **WARDROBE SLOTS (owner call, July 22 2026 — "the pass and store can have lots of clothing and accessory items"):** the human base unlocks mix-and-match cosmetics — slots for TOP (flannel plaids/colors, tees, jackets), BOTTOMS, SHOES (sneaker colorways, boots), and ACCESSORY (hats, glasses, backbling — candy-bag skins). Store + Spook Pass tiers drip individual pieces (deeper, cheaper-per-item monetization surface); full costumes (Ghost Sheet, NIGHTSTITCH, skeleton...) remain whole-look overrides. Build the wardrobe system alongside real IAP (roadmap item 7); keep everything cosmetic-only per the monetization rules.
  **Accessory pricing (owner call, July 22 2026 — "im even open to .50 cent sunglasses"):** Apple's sub-dollar tiers make $0.49 items possible. Shape: MOST accessories priced in candy (earnable — fair-to-play + a pass-seller since the pass showers candy) · 2–3 direct $0.49 "starter" accessories as first-purchase conversion hooks · costumes $1.99–2.99 and the $4.99 pass as price anchors · candy packs as the only money→currency bridge. Keep the SKU list small and clear (parent-statement optics for a 4+ game).

- **Music direction: ORCHESTRAL CUTE-SPOOKY** — the composer brief: Danny-Elfman-meets-Luigi's-Mansion; music box, theremin, pizzicato strings, tuba, glockenspiel. Timeless storybook feel, cuts great in trailers. (Brief goes out by Aug 1.)
- **Spook Pass price: $4.99 per season** — the mobile battle-pass standard; leaves room for $1.99 costume packs beneath it.
- **Developer identity: a STUDIO NAME** (owner to pick the name — candidates: Little Lantern Games, Night Candy Studios, Ember Moon Games). ⚠️ PRACTICAL FLAG: showing a studio name as the App Store "Seller" requires enrolling Apple Developer as an ORGANIZATION, which needs a legal entity (LLC) + D-U-N-S number — that can take 1–2 weeks. Options: (a) form the LLC NOW to keep the Oct 1 timeline, or (b) enroll as individual (personal name as seller) and migrate to the org later. Decide this week.
- **COZY MODE: YES** (✅ implemented) — pause-menu toggle: +2 hearts, enemies at 72% speed, leaderboard records and best-times paused while on. Never gates content; normal mode required for records/stars. The parents' feature that protects ratings.

## Monetization philosophy (HARD RULES — owner's call, do not revisit)

**No ads. Ever, for now.** No ad SDKs, no banners, no interstitials, no "watch to continue." This is a strategic choice, not just a nice one:
- Ads are the #1 source of 1-star reviews in free games; no ads = better ratings = better rank = better conversion.
- No ad/tracking SDKs means the privacy nutrition label can honestly say **"Data Not Collected"** — a trust signal players and parents actually read, and a cleaner App Review every update.
- App Store featuring favors polished, respectful, premium-feeling experiences. An ad-free cute platformer with a wholesome story is exactly the profile editorial teams pick up.
- Revenue model: monetize love, not annoyance. The store (costumes, characters, broom skins, heart containers via earned candy) and the **Spook Pass** are the only revenue. Nothing pay-to-win, boss skills and Granny Wick are never sold, and everything purchasable is visible in-game being fabulous — that's the whole funnel.
- If ads are EVER reconsidered (future owner decision only): opt-in rewarded video for bonus candy at most — never forced, never for kids' attention.

Implementation guardrails: never add an analytics/ads dependency to package.json or the Capacitor project; IAP goes through StoreKit only; keep the store's buy buttons honest (price, what you get, restore purchases).

## Roadmap (in priority order)

1. **Feel pass with real players** — tune jump heights, camera distance, enemy density from feedback.
2. ✅ **DONE (July 2026): Restructure to level-select** — district map UI (functional v1; the BEAUTIFUL MAP jewel pass still to come), World 1 split into Levels 1-1…1-5 + boss node, per-level save/stars. Known minors deferred: a movement key held across the map screen needs a re-press in the level; tutorial keeps its pre-existing 1-unit slot behind spawn; baked clutter props poke through mud-pool surfaces in w1l2/w1l5.
3. **District 2: Ravenmoor Cemetery** — 10 levels + Mossgrave boss (bat swarms). New enemies: Wisp (chases in the dark), Gravemite, Crow flocks. Implement the boss-skill system with Gourd Slam + Bat Swarm as the first two skills.
4. **District 3: Witchwood + the Broomstick** — Broomhilda fight, broom mount (hold jump to glide-fly bursts), broom skins in store + pass. Spider enemies/webs live here as level hazards (Madame Webweaver becomes a Season 2 mini-boss).
5. **Districts 4–5 + bosses** — Ghost Harbor stare/lantern fight, Grimm finale with the invite finisher; keep the difficulty tuning table.
6. **Characters**: ✅ Grimm SHIPPED (1.1): post-story character unlock, SHADOW LEAP double-jump (forward phase burst + 0.45s ghost i-frames; `character:true` in COSTUMES, own shop section, auto-granted at w5 defeat). Zoe the Witchling (double-jump = broom glide) still future.
7. **Real IAP** — Capacitor + StoreKit 2 (or RevenueCat). Products: costume/character packs (non-consumable), Spook Pass season (non-renewing), candy doublers — **cosmetic/progression only, no pay-to-win**. Wire `UI.renderShop` buy buttons to native purchase + restore. Keep test-mode fallback for web builds.
8. **Spook Pass implementation** — tier progression off level completions per the structure above (UI already stubs the track).
9. **Leaderboards (Game Center)** — OWNER SPEC for the main board: rank ALL players by **time to beat the game**; ties broken by **least damage taken**; still tied → **most candy collected**. Encoded as one lower-is-better int64: `timeCS*1e7 + min(damage,999)*1e4 + (9999 - min(candy,9999))`. Run tracking is implemented (`G.runT` game-time clock, `G.runDamage`, per-run candy); the composite formula + submit hook sit in `onBossDefeated`. Original notes: — the competitive centerpiece: **"Fastest Night" full-game speedrun board** (total play-clock from New Game to inviting Grimm, fastest = #1), plus per-district and per-level time boards. Groundwork is DONE in-game: `G.runT` is a pause-aware speedrun clock, per-world bests persist in `save.best`, and the victory screen shows 🏆 NEW RECORD. Wire-up at Capacitor time: create leaderboard IDs in App Store Connect (e.g. `hollowville.fullrun`, `hollowville.w1.speedrun`, score = centiseconds, lower-is-better), submit via a Game Center Capacitor plugin (e.g. capacitor-game-connect) at the hook already left in `onBossDefeated`. Game Center = no backend, no accounts to build, Apple-managed identity (clean for a young audience; ship with a 4+ rating WITHOUT enrolling in the Made-for-Kids category so Game Center stays available). Note: scores are client-submitted — fine for a friendly leaderboard; add sanity bounds server-side only if it ever becomes serious esports.
   **THE NIGHT BOARD (owner directive, July 2026 — "a leaderboards tab that has everything"):** one in-game Leaderboards tab in Grimmwick's own art style (not Apple's stock Game Center popup) that shows EVERYTHING in one place: the Fastest Night full-run board (the centerpiece), per-district and per-level time boards, a friends filter, your own rank + bests + stars, and the Race the Leader button. Reads Game Center data via GKLeaderboard in the wrap; web/test builds show local bests. Same jewel-not-menu bar as the district map.
   **GHOST RACING (owner directive, July 2026 — "a ghost race option against the leader"):** race translucent replay ghosts through levels. The determinism rule makes this cheap and exact: record the player's position ~10×/sec during a run (a 2–3 min level ≈ 10–15KB), play it back as a spectral Pip. **Phase 1 (launch):** race your own best ghost per level — fully local, no backend, huge practice/mastery value. **Phase 2 (post-launch):** race friends' ghosts and THE LEADER's ghost — replay blobs stored in CloudKit public database keyed by Game Center player ID (free tier, no server to run, Apple-managed identity; fetch the #1 score's ID from Game Center, then their ghost from CloudKit). Ghosts never collide with the player, render at ~40% opacity with a candle-flame trail. Beating the leader's ghost locally does NOT claim rank — only a real submitted time does.
10. **Polish**: haptics (Capacitor Haptics on stomp/pound/boss hits), Game Center achievements, app icon + launch screen, iCloud save sync.
11. **Compliance**: age rating 4+, no tracking/analytics SDKs (COPPA-friendly), privacy nutrition label = "Data Not Collected" if you keep it clean.

## Controller support (✅ implemented)

Standard Gamepad API in `02_input.js` — works with Xbox, PlayStation, and MFi controllers on Mac (browser), and on iPhone/iPad. Mapping: left stick / d-pad = move · A/Cross = jump (held = higher jump) · X/Square = spin attack · B/Circle or RB = ground pound · Y/Triangle = interact · Start = pause. Touch controls auto-hide is a polish TODO when a pad is active (`INPUT.gpActive`). At Capacitor time, verify Gamepad API events fire inside WKWebView on target iOS versions; if flaky, bridge native `GCController` through a tiny plugin to the same INPUT flags. List controller support in App Store metadata — Apple runs "great with controllers" collections, free discovery for exactly this kind of game.

## Audio production plan (owner directive: music & sound must be ON POINT)

The in-engine synth (mood-driven: hub waltz / level adventure / boss drive, ✅ upgraded) is a quality PLACEHOLDER — good enough for TestFlight, not for launch. For launch:

**Music — commission real tracks (start by Aug 1, longest lead time of any asset):**
| Track | Use | Notes |
|---|---|---|
| "The Grimmwick Waltz" (title/hub) | The brand's theme | Worth the most money — this is the melody people remember. Minor-key waltz, music-box + theremin + strings |
| District 1 theme | Levels 1-5 | Upbeat spooky adventure, 90-120s seamless loop |
| Boss theme | All bosses (variations later) | Driving, 140bpm |
| Victory + game-over stings | 5-10s each | |
| (post-launch) one theme per district | | Ship with each district update |
Sourcing: a composer via SoundBetter/Fiverr ($75-300/track indie rates, exclusive license) or curated licensing (premium marketplace tracks, non-exclusive). Deliver as .m4a loops; play via native audio in the wrap, WebAudio buffer in web builds. Duck music -6dB under dialogue/stings.

**SFX — hybrid**: keep the synth for UI ticks; replace the ~20 core gameplay sounds (jump, stomp, candy, pound-hit, boss hits, coffin creak, warp) with designed sounds — either a licensed Halloween/cartoon foley pack or a sound designer batch ($100-300). Keep the candy combo-pitch system (rising pentatonic per rapid pickup, ✅ implemented) — pitch the SAMPLE up, it's the tastiest sound in the game.

**Feel already in-engine**: hit-stop on boss hits & stomps (✅), camera shake, haptics at wrap time (pair every hit-stop with a haptic). Budget for all audio: ~$400-1,500 — the single highest-leverage money this game will spend.

## App Store wrap (Capacitor → Xcode, same flow as before)

```bash
npm run build
npm i @capacitor/core @capacitor/cli @capacitor/ios
npx cap init Grimmwick com.YOURNAME.hollowville --web-dir=dist_cap
npx cap add ios
npx cap open ios     # opens Xcode — sign with your team, run on device, Archive → upload
```

- One target covers **iPhone + iPad**. For **Mac**, either tick "Mac (Designed for iPad)" in the target's destinations (zero code, runs on Apple Silicon) or enable Mac Catalyst.
- In App Store Connect: reserve the name **Grimmwick** (checked available July 2026 — no exact-name app on the store; final confirmation happens when you register it).
- WKWebView notes already handled in-game: `viewport-fit=cover` + safe-area insets, audio unlock on first touch, localStorage fallback.
- Orientation: works portrait & landscape; landscape recommended default for platforming.

## Testing

`npm test` runs `test/playtest.js` (Playwright, headless): boots the game, verifies zero console/page errors, simulates movement/jump, jumps between hub/level/boss, screenshots into `test/`. Headless GPU (swiftshader) runs slower than real time — verify game logic against `G.time` (game-seconds), not wall-clock. There is also `/tmp`-style flow testing precedent: drive `window.__game` + DOM directly to test death/victory/shop flows end-to-end.

When adding features, keep `npm test` green and eyeball the screenshots — lighting/readability regressions show up there first.

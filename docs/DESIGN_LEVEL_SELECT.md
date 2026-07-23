# Level-Select Restructure — Design (Phase A)

Goal: World 1's single long course becomes **5 selectable levels + boss node** behind the hub's D1 gate, with per-level saves and stars. This is the foundation for the Spook Pass, Night Board, ghost racing, and Districts 2–5. Phase A = functional; the "beautiful map" jewel pass comes later.

## Save schema v2 (additive, migrating)

```js
save.levels = {
  w1l1: { done:true, stars:{time:true,candy:false,clean:true}, best: 62 }, // secs
  // … w1l2..w1l5
}
```

- `worlds`, `gp` (district-keyed golden pumpkins), `best` (district speedrun) stay as-is — the boss/ember/relight flow is untouched.
- **Migration**: `worlds.w1 === true && !save.levels` → mark w1l1…w1l5 `done` (no stars — earn them by replaying).
- **Cozy runs** complete levels but never earn stars or bests (existing rule).

## Level registry (new file `09_levels.js`)

```js
const LEVELS = {
  w1: {
    name: 'Pumpkin Patch',
    levels: [
      { id:'w1l1', name:'…', build: buildW1L1, update: updateW1L1, parTime: 75 },
      // … five entries
    ],
  },
};
```

- Each `build(G)` returns `{ spawnX, exitX }`. Levels are built along +X starting at x≈0, each with its own parallax/sky (shared builder, length param), START platform and END exit-gate arch.
- **All-candy star is automatic**: the build counts Candy entities it spawns → `G.levelCandyTotal`; star = collected === total. No manual bookkeeping, ever.
- **File layout** (build.js concatenates by filename): `09_levels.js` (registry + shared per-level scaffolding) then `09a_w1l1.js` … `09e_w1l5.js` (one builder per file — parallel-safe to author). Old `09_level1.js` is retired; its sections transplant into the five builders with x rebased.

## Flow

- Hub D1 gate → `UI.showMap('w1')` (was: directly starting level1).
- **Map screen** (11_ui.js, existing screen conventions): full-screen night overlay, winding path, 5 lantern nodes + boss node. States: locked (dim) / available (pulsing) / done (lit + ⭐×n). Boss node unlocks when w1l5 is done; beaten districts show it relit. Arrow keys/tap to select, Enter/tap to start, Esc back to hub.
- `G.switchArea(id)` accepts `'hub' | 'boss1' | any level id`. Debug: `?scene=w1l3` works; `level1` aliases `w1l1`.
- **Exit gate** touch → `G.completeLevel()`: stop clock, compute stars (`time ≤ parTime`, all-candy, `runDamage === 0`), persist, LEVEL CLEAR screen (stars + time + best) → **Next Level** / **Map** buttons.
- The old in-level boss-gate trigger is removed; the boss is reached from the map. `onBossDefeated` unchanged.
- Death/lives/checkpoint rules unchanged; respawn = last lantern in the current level (level start by default).

## Stars (per level)

⭐ time ≤ par · ⭐ all candy · ⭐ no damage — evaluated only on normal (non-cozy) runs; stars accumulate across runs (best-of).

## Fixed implementation contract (all workstreams code against this)

**`09_levelkit.js`** (concatenates before the level files):
- Helpers moved verbatim from 09_level1.js: `grave, bigPumpkin, hayBale, platform, groundX, mudPitX, signPost, thornsX`.
- `const W1_LEVELS = []` — each level file self-registers:
  `W1_LEVELS.push({ id:'w1l1', district:'w1', name:'GRAVEYARD LANE', build:buildW1L1, update:updateW1L1, parTime:75 })`
- `function findLevel(id)` → entry or null.
- `function levelBegin(G)` — FIRST call in every build: `G.signs=[]; G.coffins=[]; G._warpUsed=false; G._leaped=false; G._exitHit=false; G.spawnPoint.set(0,0.6,0); G.world.killY=-14;`
- `function exitGate(G, x)` — end-of-level relight arch (visual language of the old boss gate, scaled down) + shimmer portal stored as `G.lvlPortal` + `addBox(x-0.6,0,0, 1.2,3.5,4, {type:'trigger', onTouch})` → `if(!G._exitHit && G.state==='play'){ G._exitHit=true; G.completeLevel(); }` + solid end wall ~x+2.5 and back wall at x=-10.5.
- `function levelFinish(G, x1, x2, theme)` — common tail: `G.checkpoint.copy(G.spawnPoint)`, `G.bats=makeBats(...)`, `G.amb=buildAmbience(S,x1,x2)`, `buildClutter` over the range with the theme.
- `function updateLevelCommon(G, dt)` — extracted from updateLevel1: bats, ambience, lvlPortal shimmer, coffin (≤2.8) / sign (≤2.6) proximity prompts + interact. Level updates call this, then their extras (warp portal in w1l2, leap in w1l4).

**G API (12_main.js)**: `G.enterLevel(id)` · `G.completeLevel(opts={warp,leap})` · `G.openMap(district)` / `G.closeMap()` / `G.toMap(district)` · `G.currentLevel` · `G.levelCandyTotal` (counted after build). New states: `'map'`, `'levelclear'` (fx-only loop branches).

**UI API (11_ui.js)**: `UI.showMap(district)` / `UI.hideMap()` · `UI.levelClear(stats)` with `stats = {levelId, levelName, time, best, isRecord, stars:{time,candy,clean}, candy, candyTotal, nextId|null, cozy}`. Map nodes call `G.enterLevel(id)` (boss node → `G.startBoss1()`); clear-screen buttons → Next `G.enterLevel(nextId)` / Replay / Map `G.toMap('w1')`.

**Level assignments** (x-windows from the old file; rebase each to start ≈0):
| id | name | source | par |
|---|---|---|---|
| w1l1 | GRAVEYARD LANE | Section A (−8..48) + Gap 1 rotten-bridge trap (48..58) | 75s |
| w1l2 | PUMPKIN FIELD | Section B high road + warp island (58..102), warp → `completeLevel({warp:true})` | 60s |
| w1l3 | THE CROOKED BARN | Section C (102..140) | 60s |
| w1l4 | THE WITCH'S GARDEN | Gap 2 + Leap of Faith (140..152) + Section D (152..186), leap → `completeLevel({leap:true})` | 70s |
| w1l5 | THE KING'S DOORSTEP | NEW gauntlet from the kit, ends at the old Section E gate arch | 65s |

Every level: 2 checkpoint lanterns, candy trails that teach the line, ≥1 bonk lantern, foreground silhouettes, **structured chaos** (owner directive — alive and busy, always fair/deterministic).

## Out of scope for Phase A (tracked, not built now)

Beautiful-map art pass · level expansion to full 2–3 min each · pass-tier hooks on completion · per-level Game Center boards (IDs planned: `grimmwick.w1l1.time` …) · ghost recording (schema slot: `levels[id].ghost` — Phase 1 ghosts arrive with the Night Board work).

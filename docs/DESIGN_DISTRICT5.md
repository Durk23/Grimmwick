# District 5 — The Cursed Castle (Grimm's Keep · the finale)

**Canon:** the castle looms farthest from the town — Grimm's Keep, a **clockwork castle** where every clock
stopped the night he swallowed the Everflame. Stopped clocks, giant gears, pendulums, shadow gauntlets, and
at the heart of it **Grimm's Cursed Cauldron**, where he's been brewing the 4 stolen embers. This is the
MASTERY EXAM (curve D5): everything combined, tight windows, 10–14 threats/level, **1 mid-level checkpoint
only**. Its dungeon levels echo the catacombs for a full-circle feel. Beating Grimm isn't destruction — Pip
**invites him to the festival**; he becomes the town's night-watchman. Wholesome ending, sequel-ready.

Gate: `w5.req='w4'` (beat Captain Wraith → the Keep opens). Boss router `boss5`. Reward: **Shadow Leap** + the ending.

## Regional identity (reads "stopped clockwork castle")
- **Palette (W5PAL):** gunmetal + verdigris brass, cold shadow-purple, clock-face cream, cog-tooth steel,
  ember-orange glow (the one warm accent — the stolen embers), deep midnight-violet sky. Shadows read PURPLE-BLACK.
- **Parallax:** near broken cog-teeth & pendulum silhouettes · mid a castle-rampart / stopped-clock-tower skyline
  with Grimm's Keep + a giant cracked clock-face looming · far jagged mountain spires under a stopped moon-clock.
- **Falling ambient:** drifting **clock-soot** + cog-dust motes (leaves channel); fireflies → cold ember-sparks;
  low shadow-fog banks (clouds).
- **Climbable:** **clock chains** (hanging pendulum chains — reuse the `{type:'climb'}` volume).

## New mechanics (09zg kit + 07y)
- **Gear platforms** — `gearPlat(G,x,y,{...})`: a toothed cog you ride; it turns (cosmetic) and some travel a
  short fixed orbit/line on the shared clock (deterministic). Rows make a clockwork rhythm.
- **Pendulum blades** — `PendulumBlade(G,x,pivotY,{...})`: a blade swinging on a fixed arc/clock; heart-cost
  graze (never one-shot), telegraphed by its steady swing you time.
- **Midnight-clock warp (Old Shortcut)** — a giant stopped clock; hit the MINUTE gear then the HOUR gear in
  order → the face swings open → warp to level end + full candy (skill-gated on the two-step order).
- **GrimmGift** — the D5 gamble container (a black present w/ silver ribbon... suspicious). SAME gamble table +
  clear-patch + spawnGrace; ambush = **Shadow-copies of Pip** (ShadowCopy) burst out.

## Enemy roster (07y — "shadow-copies of everything" theme licenses some reuse)
- **Clockwork Knight** — armored knight that **BOWS before each attack** (the courtly bow IS the telegraph —
  Mario-hard fairness, played for pomp); a slow lunge/swing after the bow. Armored hp2 (pound one-shots).
- **Shadow Copy** — a purple-black spectral copy from Grimm's brew that **chases** on the lane; hp1 stomp. The
  Gift-Box ambush spawns these (shadow-Pips).
- **Mirror Boo** — a Boo that drifts the MIRRORED direction (moves away when you approach on one side); a
  disorienting ceiling/air floater; hp1. Reuse-flavored ghost, tinted shadow-purple.
- (Reuse as shadow-tints where a beat wants them: earlier D1–D4 enemies are canon here as Grimm's shadow-copies.)

## The five levels (mastery exam)

| # | File | Name & signature | GP idx | Notes |
|---|------|------------------|--------|-------|
| 5-1 | 09zh_w5l1 | **THE STOPPED GATE** — intro clockwork: first gear platforms, Clockwork Knights (learn the bow-telegraph), stopped clocks | **0** (visible-but-tricky, atop a big cog) | still the mastery tier — dense but teaches the new verbs; 1 CP + start |
| 5-2 | 09zi_w5l2 | **THE GEARWORKS** — gear-platform traversal + **pendulum blades** swinging over gaps; timing gauntlet | — | chained timing; high road pays a Heart |
| 5-3 | 09zj_w5l3 | **THE SHADOW GALLERY** — Grimm's brew: Shadow Copies + Mirror Boos in a catacomb-echo hall; a shadow gauntlet | **1** (behind a secret, a dark mirror alcove) | full-circle nod to D2 catacombs; mirror/shadow reads |
| 5-4 | 09zk_w5l4 | **THE PENDULUM RAMPARTS** — vertical **clock-chain climb** up the tower past swinging blades; the **midnight-clock Old Shortcut** warp | — | climb-centric; the two-gear midnight warp lives here |
| 5-5 | 09zl_w5l5 | **GRIMM'S APPROACH** — everything combined + **the BOMBARDMENT: Grimm's potion rain** over a ground gauntlet; ends at the throne-room door | **2** (skill-gated, up a clock-chain) | 1 CP mid; the hardest level; leads to the boss |

Every level: ≥2 visible routes crossing in sight, candy arcs trace every jump, ONE quiet unsignposted prop,
comparable heights, structured chaos, full detail (w5Parallax + w5Ambience + baked clutter + a reactive critter).

## Boss — GRIMM'S CURSED CAULDRON (`10e_boss5`) — the final, multi-phase, with the invite finisher
- **The arena:** Grimm's throne room, a giant possessed CAULDRON center-stage with Grimm's **shadow arms &
  glowing eyes** rising from the black brew (the 4 stolen embers bubbling in it). **Four burners** ring the
  arena. The darkness **shrinks the arena** as the fight goes (encroaching shadow walls).
- **Brute path (3 phases):** goo tidal-wave sweeps (jump), **potion rain** (telegraphed drops, the bombardment),
  the brew **spawns shadow-copies** of earlier enemies, and **shadow-arm slams** (telegraphed). Attacks pass
  through / he can't be hit conventionally — surviving alone never wins.
- **SECRET takedown (the whole story pays off):** Pip carries the **4 recovered embers**. Feed each to one of
  the **4 burners** (walk to a burner → it FLARES, brew sweetens black→candy-pink over that quarter, **strips one
  of his 4 attacks**, and **shrinks the shadow / re-grows the arena**). All 4 fed → Grimm is **flushed out of the
  pot**, sitting small and startled on the rim. The killing blow is NOT an attack: walk up and **INTERACT** —
  *"Come to the festival, Grimm. You were always invited."*
- **Hint:** burners **flare when an ember is near** (guides you); Mayor-Boo / crowd foreshadowing; the whole game
  has been about relighting flames. Nothing spelled out on UI.
- **THE ENDING (defeat):** the invite cutscene — Grimm accepts, the Cauldron sweetens fully, the **Everflame
  relights whole**, the town glows warm, Grimm becomes the **night-watchman**; a wholesome close + a
  sequel-ready wink (Winterfest). Then `G.onBossDefeated()` (district w5 → `embers=5`, game content-complete) →
  the victory screen. Reward skill: **Shadow Leap**.

## Build order
07y enemies → 09zg kit (palette/parallax/ambience/finish/deco/gearPlat/PendulumBlade/clock-chain/GrimmGift/
midnight-warp/registry/clutter) → 09zh–09zl levels → 10e boss + ending + 12_main wiring (switchArea `boss5`,
`bossBuilt`, `startBoss`/`bossAreaFor` already maps w5→boss5) → extend test/playtest.js (+w5, +['w5','boss5'])
& test/heightaudit.js → gauntlet → deploy → CLAUDE.md v1.0 (25 levels + 5 bosses, content-complete).

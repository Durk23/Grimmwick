# District 4 — Ghost Harbor (the dried seabed & the Salty Phantom)

**Canon:** when the Everflame shattered, the SEA went out with it. The harbor is a cracked, dried
seabed — dead coral, stranded shipwrecks, tide-pool puddles, the ghost galleon **Salty Phantom**
beached on its side. Board the dead ship where it lies. Freeing **Captain Wraith** makes **the sea
come rushing back** — the district's relight moment.

Gate: `w4.req = 'w3'` (beat Broomhilda → Ghost Harbor opens). Boss router `boss4`. Reward: **Phantom Dash**.

## Regional identity (every level must read "dried haunted harbor")
- **Palette (W4PAL):** bleached driftwood tan/grey, cracked teal-grey seabed, barnacle green, dead-coral
  mauve, rope hemp, ghost-green lantern light, brass/verdigris, deep-teal night sky. Water reads as
  glowing tide-pool puddles (emissive teal) in a mostly-dry world.
- **Parallax:** near dead-coral & wreck-rib silhouettes · mid a stranded-hull/dock-crane skyline with the
  Salty Phantom looming offshore + a lighthouse · far dry-dune seabed hills under a low teal moon.
- **Falling ambient:** drifting **salt-mist** motes + the odd floating dandelion of sea-foam (the "leaves"
  channel); fireflies → **glinting brine sparks**; low **fog banks** rolling over the seabed (clouds).
- **Climbable:** ship **rigging / rope ladders** (reuse the `{type:'climb'}` volume; net + rope).
- **Light = the district's language** (learned in 4-3, paid off at the boss): light reveals the way.

## New mechanics (built in 09za_w4kit + 07x)
- **Tide platforms** — `tidePlat(G,x,baseY,{amp,phase,...})`: a barnacled slab on the SHARED tide clock
  (`G.tideT`, fixed from level start) that sinks below / rises above the lane on a sine. Deterministic;
  the amp/phase set per platform so a row makes a walkable rhythm. Falling off costs a heart.
- **Cannon-launch** — `CannonBarrel` entity (DKC barrel): walk in → captured (input locked, aim arc sweeps
  a fixed 0..1 sine) → JUMP fires you along the aimed vector. Deterministic aim clock so the fire window is
  learnable. Used to board the Phantom (4-4) and for a secret or two.
- **Rope swing** — reuse `w2BellRope` (a rope is a rope): climb + boosted leap-off across a gap.
- **Listing deck** — `deckList(G, mesh, {amp,period})`: the deck MESH tilts ±~8° for the LOOK (cosmetic,
  deterministic), paired with **rolling cannonball** hazards on a fixed clock (the felt danger). Colliders
  stay flat (AABB can't rotate) — the tilt is visual + the rolling hazards sell the roll fairly.
- **TreasureChest** — the D4 gamble container (barnacled, gold light leaking from the seams). SAME gamble
  table as MysteryCauldron/urn/coffin, SAME clear-patch + 1s spawnGrace, ambush = **Boo Buccaneers** burst.

## Enemy roster (07x — variety mandate; reuses ≤2 earlier types: Boo family + SwoopBat air)
- **Boo Buccaneer** — ghost pirate (bandana + cutlass). The TWIST on the stare rule: facing it makes it
  **wink and keep creeping, just slower** (never fully freezes — the harbor's ghosts are bolder). Stompable.
- **Barrel Mimic** — a deck barrel that sits inert until the player passes, then **sprouts teeth and lunges**
  once (telegraphed rattle), then reverts. Trust-no-prop. Stompable while inert or mid-lunge-recover.
- **Cannon Crab** — a crab in cannon-shell armor that lobs an **arcing shell** on a fixed clock (telegraphed
  fuse-spark ~0.7s). Shell lands on the lane, small blast. Armored front (stomp the shell/back; a spin pops).
- **Rigging Wraith** — a specter that travels **ONLY along a rope/rigging span** (a zipline predator): slides
  x1↔x2 on a fixed clock at rigging height, swoops if you're beneath. Can't leave its wire. Spin/stomp on pass.
- **Peg-Leg Polly** (NPC, optional) — skeleton parrot; squawks a hint near the boss ("he hates the light!").

## The five levels

| # | File | Name & signature gimmick | GP idx | Notes |
|---|------|--------------------------|--------|-------|
| 4-1 | 09zb_w4l1 | **THE MISTY DOCKS** — intro: crates, cranes, a first **rope swing**, first Boo Buccaneers; the galleon looms offshore in fog | **0** (visible-but-tricky, high crane) | gentle re-teach in the new district; salt-mist everywhere; 1 CP + a start CP |
| 4-2 | 09zc_w4l2 | **THE DRY TIDE** — signature **tide platforms** (sink/surface rhythm) over the cracked seabed; Cannon Crabs in the tide-pools | — | timing-focus; **LEAP OF FAITH #2** hidden here, out over the "open water" (a fog-hidden gap that completes the level) |
| 4-3 | 09zd_w4l3 | **THE LIGHTHOUSE** — vertical **climb**; a rotating light beam reveals **ghost planks** (visible only when lit) — teaches light=truth for the boss | **1** (behind a secret, off the beam path) | rope ladders + rigging; Rigging Wraith intro on a wire |
| 4-4 | 09ze_w4l4 | **BOARDING THE SALTY PHANTOM** — **cannon-launch** onto the deck, then rigging climb + **listing deck** + rolling cannonballs + Boo crew from hatches | — | the climb-centric level; Old Shortcut warp = freeze-stare a Boo mid-gangplank, hop to the crow's nest |
| 4-5 | 09zf_w4l5 | **BELOW DECKS** — the haunted interior: rolling cannonballs, a rising **bilge flood** (rhythmic hazard), the ghost crew's mess; climb up through the captain's cabin — **the BOMBARDMENT** (cannon volley) caps it | **2** (skill-gated, up the rigging) | 1 CP mid-level; ends at Captain Wraith's door |

Difficulty (curve D4 = "precision + pressure"): 9–12 enemies/level, elite variants appear, **1 checkpoint**
(2 in 4-1), fading/tide platforms over void, structured chaos, every level ≥2 visible routes + a quiet prop.

## The Old Shortcut (D4) & the Leap of Faith #2
- **Old Shortcut** (4-4): a lone **purple lantern** by the gangplank; freeze-stare a Boo Buccaneer mid-plank
  and use its head as a step into the Phantom's **crow's nest** → warp to the level end + full candy bonus.
- **Leap of Faith #2** (4-2): the game's SECOND (and last) leap — out over the fog-shrouded "open water"
  where the sea used to be; no tell of any kind; jumping in completes the level with all rewards. Never hinted.

## Boss — CAPTAIN WRAITH (fought ON the Phantom's deck, `10d_boss4`)
- **Brute path:** intangible most of the fight (attacks pass through him — anchor sweeps, **cannon volleys
  from the rigging**, Boo crew from hatches, the deck lists). Swings barely faze him.
- **SECRET takedown:** Boos freeze when stared at — **HE does too**. Face him to lock him in place while
  backing toward the **4 dark deck lanterns**; relight all 4 (walk into each while he's stare-locked) → his
  mist burns away, he turns **solid & stunnable** → hit ×3 (phases rise: faster volleys, more Boos, deck lists harder).
- **Hint:** the player already learned the stare rule on Boo Buccaneers; the 4 lanterns sit visibly UNLIT;
  **Peg-Leg Polly** squawks "he hates the light, squawk!".
- **Defeat:** not destroyed — Pip's win **brings the sea rushing back** (arena floods with returning glowing
  water as the relight). `G.onBossDefeated()` → district relit on the hub. Reward skill: **Phantom Dash**.

## Build order
07x enemies → 09za kit (palette/parallax/ambience/finish/deco/tide/cannon/chest/registry/clutter) →
09zb–09zf levels → 10d boss + 12_main wiring (switchArea `boss4`, `bossBuilt`, `startBoss`/`bossAreaFor`) →
extend test/playtest.js (+w4 levels, +['w4','boss4']) & test/heightaudit.js → gauntlet → deploy → CLAUDE.md v0.4.

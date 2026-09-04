# FROSTMERE — Winter District 1: GLIMMERFIELDS (design lock, Sept 4 2026)

The Winterfest drop: **Frostmere square (second hub) + Winter District 1 (w6): 5 levels + 1 boss.**
Frostmere is the second TOWN (per docs/EXPANSIONS.md): Captain Wraith's restored Salty Phantom
sails Pip from a new ferry dock in Grimmwick's square to the town where winter never ends.
Their great flame — **the Hearthlight** — is freezing over; the kid who relit the night gets the call.
Grimm (night-watchman now) rides along as the hint-giver NPC. **All content FREE forever**
(owner model lock, Sept 1: candy packs are the only real-money product — this supersedes the
old paid-expansion note in EXPANSIONS.md).

**Owner seed list (Sept 4, all in):** spooky snowman · penguins · dropping spike icicles ·
Pip's throw weapon becomes SNOWBALLS here · Christmas-light levels · unlockable SNOW SHOES
(slight speed, unequippable, candy-buy OK) · igloos · ICE CROWN as the winter unlock.

## The verb & the feel
Every era gets one new verb (base game: CLIMB). Winter's is **SLIDE/SKATE** — ice-surface
momentum physics (`ice:true` colliders → low grounded accel/decel). Frozen rivers are
speedrun lanes; determinism law fully applies (fixed clocks, no RNG on the path).
Second theme: **light thaws ice** — the relight motif continues (lanterns melt frozen
platforms/doors). Palette: deep blue-violet nights, warm amber/red/green festival light
strings, aurora ribbons in the far parallax. A screenshot must read WINTER + GRIMMWICK instantly.

## District: GLIMMERFIELDS (w6) — snowy village outskirts under festival lights
| Level | Name | Signature gimmick (intro→twist→escalate→master) |
|---|---|---|
| 6-1 | LANTERN LANE | Arrival road strung with WINTERFEST LIGHTS (the beauty statement). Gentle ice patches teach the slide. Snow-Boos + penguin intro. One decorative snowman turns its head when you're not looking (foreshadow). |
| 6-2 | THE FROZEN POND | Full skate level: momentum lanes, fishing holes (fall in = heart + pop out, never death), penguin belly-slide chargers, first icicle ceilings. |
| 6-3 | ICICLE GROTTO | The climb level (constitution 6a): frozen-waterfall climb wall; DROPPING ICICLES on fixed clocks (0.7s shimmer+drip telegraph), dropped icicles embed as platforms. Mid-boss slot: **THE SNOWBALL TRIPLETS** — three rolling snowballs that GROW as they roll, fixed lanes (Gourd Triplets tradition). |
| 6-4 | GLIMMERGLADE | Freeze/thaw: relight lanterns to melt ice walls/platforms; hit the star-switch and a whole light string blazes into a walkable bridge of light. Dark-frost pockets reuse the D2 wisp-light language. |
| 6-5 | GRUMBLE'S DOORSTEP | Mastery mix + the district's BOMBARDMENT: snowball mortars from the hills on a fixed pattern (target-glow telegraphs, safe lanes, candy traces the dodge dance). |
| Boss | **GRUMBLE, THE ABOMINABLE SNOWMAN** | See below. |

Rules carried: 2–3 routes/level with visible junctions · trap routes subtly telegraphed ·
**NO new Leaps of Faith (two per game, forever — sacred)** · one quiet storytelling prop per
level (6-1: a tiny snowman built by mittened hands next to two big ones — a snow-family) ·
detail-density checklist in full (snowfall ambient, aurora parallax, breath puffs on Pip,
ice sparkle motes, reactive critters: cardinals that scatter, a shivering mouse warming
itself at a bulb).

## Enemy roster (w6 — ≤2 reuses, three attention lanes)
1. **SPOOKY SNOWMAN** (owner) — the Boo rule INVERTED: stands innocently still while watched;
   hops closer whenever you look away (Grimmwick's Weeping Angel, kid-safe). Stomp = head
   pops off; blind body waddles after it (comedy + vulnerability window); rebuilds once,
   second stomp defeats. Field Guide: "Made by children. Unmade by one."
2. **FROSTBITE PENGUIN** (owner) — squawk-flap telegraph → straight belly-slide charge;
   slides farther on ice, one wall-bounce. Field Guide: "Formal wear, informal manners."
3. **SNOW-BOO** — scarfed boo; stared at, it freezes SOLID into an ice block for 2s —
   stompable as a platform, then shatters free. (Stare-language twist #3 after D4's wink.)
4. **BLIZZARD BAT** (reuse: Swoop Bat pattern, white/ice skin) — the air lane.
5. Hazard, not enemy: **SPIKE ICICLES** (owner) — ceiling clusters on deterministic clocks.
Mini-boss: Snowball Triplets (6-3). Reuse budget spent: Swoop Bat only.

## Boss: GRUMBLE, THE ABOMINABLE SNOWMAN (10f_boss6)
Frostmere's guardian — the giant snowman the town rebuilds every Winterfest, frozen mean
by the deep cold. Fight: stomp him apart tier by tier; each knockdown he REBUILDS from
arena snow, bigger gimmick each phase (snowball lobs → rolling snowball ring → icicle rain).
**Secret takedown:** relight the 4 hearth-braziers around the arena → the loose snow melts →
he can't rebuild → fight shortcuts to the final tier. **Hint:** penguins huddle by the cold
braziers; sign: "Snow that never melts only means the fires went out."
**Defeat = wholesome:** Pip pats him back together SMALL — Grumble becomes a friendly
hub-square snowman. District relights: the lights of Glimmerfields blaze, aurora ignites.

## Rewards & economy
- **❄️ SNOW SHOES — the 5th Trick** (owner: candy-buy approved): 🍬10,000 in the Cauldron.
  +10% grounded top speed, +15% ground accel; **airborne horizontal speed capped at base max**
  so every gap/height in the game stays comparable-heights legal (this implements the parked
  Pip-speed-up itch SAFELY). Equip/unequip toggle like all tricks; sealed in Nightmare;
  equipped = Flawless taint (tricks law, consistent).
- **👑 ICE CROWN mask** — earned, never sold: **all 15 stars of Glimmerfields** (3×5 levels).
  Crowns stay prestigious (Nightmare Crown = 25 honest conquests; First/Black Flame = rank 1).
  Granted with coronation fanfare; rack-gated by `save.earnedIce`.
- **Gamble container: THE MYSTERY IGLOO** — warm light leaking from the door tunnel, red
  pulse. Same 42/28/30 table; ambush = Frostbite Penguin squad slide-charges out on the
  scatter ring (spawnGrace + clear-patch law as always).
- **Old Shortcut (w6):** a snowman built WRONG (smallest ball on the bottom) near a lone
  purple lantern (the language). Ground-pound its tiers biggest→smallest → the hat pops
  open into the warp. Once per run, full candy bonus, counts for time star.
- **Ember Pop in Frostmere throws SNOWBALLS** (owner): same damage/range/cooldown, snow
  skin + puff burst + soft "paff". Shop card gets the flavor line "Travels incognito as
  snowballs in Frostmere."

## Structure & gating
- Ferry dock appears in Grimmwick square for everyone (anticipation); **sailing requires the
  story finished** (canon: the ending's first-snow scene IS the invitation; Grimm at the dock
  tells pre-finale players "finish relighting OUR night first, kiddo").
- Frostmere square (hub2, compact v1): the frozen Hearthlight centerpiece, Grumble's gate
  (open), w7–w10 gates frozen solid with teaser plaques, Grimm the hint-giver, the docked
  ferry home, snow-family deco, one big lit tree.
- w6 in WORLDS with `req` = story done; district map reuses the standard map screen with
  the winter palette. Nightmare/challenge integration for winter levels ships LATER
  (winter nm remix = a January content beat, not this drop).
- Difficulty: tuned to D3-ish ("fairly competitive" — the audience is post-story veterans),
  but 2 checkpoints per level and ice never combines with pits until 6-4.
- Music: 'winter' mood — the Grimmwick waltz recast with bell/glockenspiel voices (synth).

## Ship plan
1. Foundation: ice physics + snowfall + string-lights builder + kit file (09zm_w6kit) +
   enemies (07z) + WORLDS/map/save wiring + ferry dock + Frostmere square (08b).
2. Levels 6-1…6-5 (09zn…09zr) + Grumble (10f) — agent-fleet build + adversarial review +
   playability gauntlet (height/climb/spawn/pit audits), same as Districts 2–5.
3. Tricks: snow shoes; masks: Ice Crown; igloo container; snowball skin.
4. Polish pass on-device, screenshots, THE WINTERFEST UPDATE listing kit.
Target: ship as 1.5 in early-to-mid December (five featuring shots: one district/month).

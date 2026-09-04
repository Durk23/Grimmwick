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
- **Difficulty (owner call, Sept 4 2026): BEYOND DISTRICT 5.** Glimmerfields is the post-story
  mastery exam — every player arriving has beaten all 25 levels and Grimm, so winter greets them
  one column right of D5 on the curve: 12–15 enemies/level (internal ramp 6-1→6-5), checkpoints
  = CP0 + ONE lit mid-level lantern, chained-mechanic set-pieces in every escalate/master beat
  (D5 is the owner's favorite district for "obstacles and things" — its composition style is the
  bar, in winter vocabulary). Still main-game fair, never Kaizo: hearts-always, ≥0.6s telegraphs,
  fixed clocks, ≤4 simultaneous threats, one-good-run-away. Ice+pits legal from 6-3 on
  (6-1/6-2 still teach the verb cleanly). Grumble tuned to hardest-guardian (12 hits, 3/4/5),
  one notch under the Grimm finale; the brazier secret shines brighter against the harder brute path.
- Music: 'winter' mood — the Grimmwick waltz recast with bell/glockenspiel voices (synth).

## Winter District 2 seeds (owner call, Sept 4 2026 — build AFTER the w6 drop ships)
**W7 = FROZEN LAKE FELL, pulled forward** (was slotted w9; Evergreen Deep slides back — the owner's
lake idea IS a district signature, so it gets the next drop). Signature mechanic: **CRACKING ICE** —
frozen lakes you cross where STANDING STILL is the hazard (owner: "if standing still too long in an
area pip falls in and death action happens"):
- `CrackIce` panels: dwell on a panel builds a crack budget (~1.1s at D5+ tuning); leaving/jumping
  drains it. Telegraph stages: spiderweb cracks at 40% → deep cracks + CREAK + shudder at 75% →
  SHATTER: Pip plunges into the black water below with the full Mario death-plunge spectacle
  (the pit-impact sequence: splash, flash, pop-flip) — heart cost + lantern walk-back, death when
  hearts run out (hearts-always law holds; at exam tuning this WILL kill careless players).
  Panels refreeze ~3.2s later so routes never soft-lock. Deterministic: budget = time-stood,
  identical every run (the gearPlat dwell-spike's proven pattern — pure D5 DNA in winter clothes).
- Composition beats: whole lake crossings where the only floor is cracking panels · panel hops
  between grippy islands · cracking ice UNDER icicle waves (move, but move THROUGH the pattern) ·
  penguin lanes that slide across panels without cracking them (they're light — the tell that
  weight matters) · trap-route panels over TRUE deep water on marked trap branches (D5 trap law).

## THE AVALANCHE — expansion set-piece archetype (owner seed, Sept 4 2026)
A GIANT snowball released on a fixed clock (default **every 5 seconds**) that rolls THROUGH the
course. Counters: double-jump it (top 2.8 vs the 3.3 double) · the **TIMELY HIT** (spin/pound
shatters it into candy — standing in its path to swing IS the timing test) · stomp-BOUNCE off its
top (a moving platform — the expert line rides the balls). Terrain-following (rolls flats, tumbles
off ledges, dies in pits — bite cut 1.5u before its end so a dying ball never bumps anyone in).
Kit: `AvalancheBall`/`AvalancheSpawner` in 09zm. ✅ FIRST DEPLOYMENT: 6-5's finale — Grumble bowls
them down his own hill (replaced mortar battery D; plants his P3 rolling-ring hint). **w7–w10: one
FULL avalanche level per district** ("the one with the snowballs") — whole-level release clocks,
e.g. w7: balls crossing CRACKING LAKES (shatter the panels ahead of you — dodge the ball, then its
holes); w8: mine-shaft slopes where balls accelerate; w9/w10 escalations. A few levels of the 25, per the owner.

## w7+ roster seeds (owner, Sept 4 2026): HAUNTED POLAR BEARS & REINDEER
- **THE SOMNAMBEAR** (haunted polar bear, w7 Frozen Lake Fell) — a huge pale bear sleepwalking a
  fixed patrol, eyes closed, snoring little ghost-flakes. Harmless until WOKEN (attack it, or let
  its patrol meet you): one furious telegraphed swipe-lunge... then it yawns and resumes sleepwalking.
  On the lakes its lunge SLAM instantly shatters nearby CrackIce panels — the bear rewrites the floor.
  Cute-spooky bar: it wears a tiny nightcap. Field Guide: "Do not wake. It needs its hundred years."
- **THE WRAITHDEER TEAM** (haunted reindeer, w7/w8 air lane) — a spectral sleigh-team of 3-4 glowing
  reindeer that sweeps through on a fixed route pulling NOTHING (the ghost of a delivery round that
  never ended). You HEAR the sleigh bells ~1s out — the jingle IS the telegraph — then they streak
  across the lane. Antlers glow the cold cyan; the lead deer's nose glows warm amber (never named —
  the joke is in the glow). Solo variant: a single Wraithdeer that CHARGES like a Skelly with a
  bell-shake telegraph, antlers down.

## Ship plan
1. Foundation: ice physics + snowfall + string-lights builder + kit file (09zm_w6kit) +
   enemies (07z) + WORLDS/map/save wiring + ferry dock + Frostmere square (08b).
2. Levels 6-1…6-5 (09zn…09zr) + Grumble (10f) — agent-fleet build + adversarial review +
   playability gauntlet (height/climb/spawn/pit audits), same as Districts 2–5.
3. Tricks: snow shoes; masks: Ice Crown; igloo container; snowball skin.
4. Polish pass on-device, screenshots, THE WINTERFEST UPDATE listing kit.
Target: ship as 1.5 in early-to-mid December (five featuring shots: one district/month).

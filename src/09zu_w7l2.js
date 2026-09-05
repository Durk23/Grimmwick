// ============ LEVEL 7-2 — BELLS ON THE ICE (District 7 · Frostmere · Frozen Lake Fell) ============
// THE WRAITHDEER LEVEL. Out on the great white ice, a spectral sleigh-team still runs a delivery round
// that ended a century ago — you HEAR the bells ~1s before they streak through at hop height. The whole
// level is one lesson deepened four times: GROUNDED BOOTS ARE INVISIBLE TO THE ROUND. Walking never gets
// you hit; a mistimed hop always can. Then the lake starts CRACKING under your stillness, and the two
// rules begin to argue — that argument IS 7-2.
// DIFFICULTY (locked owner call): beyond District 5 from level one — the post-story mastery-exam band,
// still MAIN-GAME FAIR: hearts-always, every threat telegraphed >=0.6s (jingle 1s · angler glow 0.7s ·
// bear roar 0.7s · penguin squawk 0.6s), <=4 simultaneous threats, every clock fixed from level start.
// Checkpoints: EXACTLY CP0 (noLight) + ONE lit lantern at x96 (~54% of the 176u run). The walk-back is
// part of the price. 13 threat systems (3 deer teams + 1 Somnambear + 2 penguins + 2 anglers + 2 Snow-Boos
// + 2 cubs + 1 Blizzard Bat).
//   BEAT 1 THE SHORE & THE GRIPPY REACH (INTRODUCE)  x -8..44  — CP0, the Fisher's Hut in its clear pocket,
//          the QUIET PROP at the round's turning point, then rough shore ice (grippy — no slide yet) under
//          TEAM A's lane (y1.85): learn the jingle, learn to stay low, hop the Polar Cub BETWEEN sweeps.
//   BEAT 2 THE FIRST CRACKING RUN (TWIST)            x 44..66.8 — Team A's same lane crosses a CrackIce
//          run: the ice hates a lingerer, the deer hate a hopper. Budget your stillness AROUND the bells
//          (walking counts as low — cracking panels never demand a stop). An Ice Angler stalks below,
//          lunging up wherever YOUR mistakes opened the floor. High-road platforms cross the run dry,
//          ABOVE every lane — the trade, visible from the junction at 45.
//   BEAT 3 THE SLEEPWALKER'S STRIP (breath + compose) x 66.8..84 — a huge Somnambear dreaming back and
//          forth across the road while Teams A and B sweep overhead: wait out her patrol, double-jump her
//          high (feet>2.0 skips the wake), or wake her ON PURPOSE and hold your jump through the one
//          telegraphed swipe — reading the bear's clock AND the bells is the level's first true composite.
//   BEAT 4 THE DOUBLE RUN (ESCALATE)                  x 84..130 — two COUNTER-PHASED teams (A right-to-left
//          12.5s · B left-to-right 11s — two independent clocks, the w6l5 A/B-seam law) over two more panel
//          runs, the lone LIT LANTERN on the solid pocket between them, an Angler under the glass, a
//          Blizzard Bat guarding the high road, then penguins + a Snow-Boo working the tow-launch strip.
//   BEAT 5 THE ROPE-TOW CROSSING (MASTER · set-piece) x 130..158 — the wide SHATTERED BASIN: open water,
//          no floor but the T-BARS. Ride the bottom run while TEAM C sweeps the bar line's height (y3.2)
//          on its own fixed clock: hear the bells, HOLD a jump and let the line catch you (bar-to-bar and
//          top-run escapes both live, math pinned below). Mid-basin: the SIDE ISLAND with the FROZEN
//          BELL-BUOY — the district warp under its lone purple lantern (port → starboard → port).
// Reads UNMISTAKABLY Lake Fell: W7PAL glass-and-brass over the deep water dark, the far-shore village a
// thin lit line across miles of white, wind-driven snow, the moon glade, the aurora riding big — DARKER
// and lonelier than Glimmerfields; its light is the aurora + machine lanterns (only two modest festival
// strings, one per shore — the town's reach ends where the ice begins).
// COMPARABLE HEIGHTS (tap 1.8 / held 2.6 / double 3.3): low road is FLAT the whole way; high-road first
// steps 1.6-1.7 (held, over-cleared), runs at 3.3-3.6 with gaps 1.2-1.6; T-bar tops at 2.82 from ground —
// double-jump-gated (<=3.0 law) and candy-traced at both boarding points. HEARTS ALWAYS: every deer/brush/
// swipe/lunge costs one heart (i-frames cap a whole team pass at 1), every plunge charges the kit's full
// pit price (heart + lantern walk-back) — nothing one-shots, and NO extra hazard sits at any hole.
// DETERMINISM: three deer clocks, the bear patrol, penguins, cubs, anglers, the tow loop — all fixed
// phases from level start; Math.random lives only in baked deco and the opt-in Fisher's Hut gamble.
// DEER LANE MATH (the class bites while `pl.y > laneY-1.6` and `pl.y < laneY+0.9`, lane bobs ±0.18):
//   · lane y1.85 (A): grounded threshold 1.85-0.18-1.6 = +0.07 — a grounded player (y=0) is DETERMINISTICALLY
//     safe; tap-apex 1.8 is deep inside the window (the "never mid-hop-apex" rule); clearing OVER needs
//     feet > 2.93 → double-jump territory. Lane B y1.9: threshold +0.12, top 2.98. High road >=3.3 rides
//     0.32+ clear of both windows even mid-jump-between-platforms — deer-free as advertised.
//   · lane y3.2 (C, the tow): bar-riders' feet at 2.82 sit inside (1.42..4.28) — must dodge; a HELD hop
//     from the bar (apex 5.42) clears 4.28 for ~0.6s vs the ~0.5s team passage; the top-run bars (feet
//     4.72 > 4.28) and the island (grounded 0 < 1.42) are both safe floors. All pinned again at the beat.
// NO GoldPumpkin (per district plan) · NO Leap of Faith (both of the game's two are placed and sacred) ·
// THE WARP IS HERE: the Bell-Buoy island is 7-2's assignment — the only level that places it.

// ---- THE QUIET PROP (never signposted): a small wrapped gift waiting on a stump at the exact spot the
// wraithdeer round turns for home — the tag carries no name, only a drawn antler. Somebody in Grimmwick
// still leaves presents out for the deer, every winter, a hundred years after the sleigh stopped coming.
// Fully baked; story-readers stop, everyone else walks past. That's the point. ----
function w7l2DeerGift(x, z){
  const g = new THREE.Group();
  const stump = mesh('cyl',[0.3,0.38,0.52,8], mat(0x4a3626)); stump.position.set(x,0.26,z); g.add(stump);
  const ring  = mesh('cyl',[0.26,0.26,0.03,8], mat(0x6a5238)); ring.position.set(x,0.53,z); g.add(ring);
  const snow  = mesh('sph',[0.34,7,5], mat(W6PAL.snow)); snow.scale.y=0.3; snow.position.set(x,0.55,z); g.add(snow);
  const box   = mesh('box',[0.4,0.34,0.4], emat(0x8a2e3a, 0x4a161e, 0.2)); box.position.set(x,0.76,z); crook(box,0.05); g.add(box);
  const rib1  = mesh('box',[0.44,0.36,0.09], mat(0xf0e6c8)); rib1.position.set(x,0.76,z); g.add(rib1);
  const rib2  = mesh('box',[0.09,0.36,0.44], mat(0xf0e6c8)); rib2.position.set(x,0.76,z); g.add(rib2);
  const bow   = mesh('tor',[0.08,0.03,4,8], mat(0xf0e6c8)); bow.position.set(x,0.97,z); bow.rotation.x=Math.PI/2; g.add(bow);
  // the tag — a little pale card, tilted; its whole message is a tiny antler in brown strokes
  const tag   = mesh('box',[0.2,0.14,0.02], mat(0xf4f1e4)); tag.position.set(x+0.26,0.7,z+0.14); tag.rotation.z=-0.35; tag.rotation.y=0.3; g.add(tag);
  const a1 = mesh('cyl',[0.008,0.01,0.09,4], mat(0x6a4a34)); a1.position.set(x+0.25,0.71,z+0.16); a1.rotation.z=-0.1; g.add(a1);
  const a2 = mesh('cyl',[0.007,0.009,0.055,4], mat(0x6a4a34)); a2.position.set(x+0.275,0.725,z+0.16); a2.rotation.z=-0.85; g.add(a2);
  const a3 = mesh('cyl',[0.007,0.009,0.05,4], mat(0x6a4a34)); a3.position.set(x+0.235,0.735,z+0.16); a3.rotation.z=0.55; g.add(a3);
  return g;
}

function buildW7L2(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;     // shore snowpack (grippy)
  const ROUGH = W7PAL.iceD;     // rough grippy shore-ice — matte, NO tag:'ice' (only CrackIce is slick here);
                                //   the slick surface keeps the district's glossy/emissive read, this one reads dull
  const HIGH = W6PAL.snow;      // the bright high-road platforms (brighter = the dry road reads from below)

  const deco = new THREE.Group();          // every static bakes to one draw call at the tail
  const L = w6LightsBegin();               // exactly TWO modest strings — the lonely-lake light budget

  // =============================== BEAT 1 — THE SHORE (x -8..14) + THE GRIPPY REACH (x 14..44) ===============================
  groundX(G, -8, 14, SNOW);                                            // the shore — the deer keep to the open ice
  groundX(G, 14, 44, ROUGH);                                           // rough shore-ice: GRIPPY (learn the deer without the slide)
  G.ents.add(new Checkpoint(1.5, 0, 1.6, 0, {noLight:true}));          // CP0 — the only other light is the one you'll earn
  // SPAWN SAFETY (idle body 1.1..1.9, grounded y=0): Team A's lane ends at x16 (bite floor x12 with the 4u
  // trailer allowance — 10u clear laterally, AND a grounded player is below its +0.07 bite threshold anyway) ·
  // cub #1 lane bite starts 23.2 · boo #1 chases only players within 14 of x38 (player >=24) · everything
  // else lives past x48. Nothing in the level can touch an idle player at CP0.
  signPost(G, 3.6, 1.7, -0.1, "BELLS ON THE ICE. When you hear sleigh bells, get LOW and STAY low - the Wraithdeer run their round at hop height, and they have not stopped for a pedestrian in one hundred years. Grounded boots are invisible to a delivery that never ended. Walk all you like. Just don't hop.");
  // THE FISHER'S HUT — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math):
  // Team A's bite floor x12 (6.5u from the hut at 5.5; the lane bites airborne players only — a grounded
  // opener is doubly unreachable) · cub #1 bite min 23.2 (17.7u) · boo #1 leashed chaseR 14 from home 38 →
  // never activates for a player at the hut (32.5u; worst post-chase trail ~x22.8, 17.3u) · angler #1 wakes
  // at player x>=48 · bear/penguins/bat live past x69. The ambush (four panicked cubs) spawns on the kit's
  // fixed ring with 1.0s grace. Opening is a deliberate, safe act.
  { const h = new FisherHut(5.5, 0, -1.5, 0.35); G.coffins.push(h); G.ents.add(h); }
  // the shore's one festival string — the town's light ends here
  deco.add(w6LightPost(-3.5, -1.8, 3)); deco.add(w6LightPost(2.8, -1.8, 3));
  w6String(L, -3.5, 2.95, 2.8, 2.95, {z:-1.7});
  candyLine(G, [[8.5,0.9,0],[10.5,0.9,0],[12.5,0.9,0]], 3);
  G.ents.add(new Crow(7, 0.95, 2.3));                                  // lake crow #1
  // THE QUIET PROP — at x12, right where Team A's ghosts wink out and turn for home
  deco.add(w7l2DeerGift(12, -2.1));

  // TEAM A — the level's spine: y1.85, sweeping RIGHT-TO-LEFT down the whole working ice (120 -> 16),
  // period 12.5s (runT 8.7s — every point on the lane gets one brief pass per cycle, jingled 1s ahead).
  // phase 4.0: run #1 is already mid-lake at spawn — the player watches the round finish its lap from the
  // safe shore (the reveal), and every pass after that arrives jingled. Grounded bite threshold +0.07:
  // standing, walking, and sliding are all safe; tap-apex 1.8 is not.
  G.ents.add(new WraithdeerTeam(G, {x0:120, x1:16, y:1.85, n:3, period:12.5, phase:4.0, speed:12}));
  signPost(G, 16.5, 1.7, 0.1, "THE OPEN ICE. Rough and honest underfoot - the lake only turns to glass past the point. Practice here: bells, then LOW, then on your way. The round comes through every long moment, regular as a church clock.");
  candyLine(G, [[18,0.9,0],[22,0.9,0],[26,0.9,0]], 3);                 // the low line — candy at boot height the whole reach
  candyLine(G, [[30,0.9,0],[34,0.9,0],[38,0.9,0]], 3);
  // POLAR CUB #1 — a fixed rolling lane UNDER the deer lane: hop the cub BETWEEN sweeps (stomping it is a
  // 1.7u-high act — the bells tell you when that act is legal). Bite span 23.2..36.8.
  G.ents.add(new PolarCub(G, 24, 0, 0, {x1:36, speed:3.4, phase:0.0, pause:1.2}));
  // SNOW-BOO #1 — drifts the reach's far end (home 38, leashed chaseR 14 → active for players 24..52).
  // SANCTIONED TECH taught here, cashed on the lakes: stare it SOLID and its ice block is your own collider —
  // standing on a frozen boo drains no crack budget (groundCol is the block, not the panel). The fort beats
  // the ice, NOT the bells: the block's top (~1.9) sits inside lane A's window — don't perch through a sweep.
  G.ents.add(new SnowBoo(G, 38, 0, 0, {phase:0.9, speed:2.1, range:9, freezeMax:2.6}));

  // =============================== JUNCTION (x 44..50): the high road shows itself ===============================
  groundX(G, 44, 50, SNOW);                                            // solid lip before the glass
  signPost(G, 46, 1.7, -0.12, "THE LAKE OPENS HERE. Glass ice hates a lingerer - it cracks under stillness and forgives you the moment you move along. The deer hate a hopper. Listen for the bells, plan your stillness, spend it all in one place. And if the water GLOWS and bubbles under a hole: that is not a welcome. Move your boots.");
  // HIGH ROAD ACCESS — the dry crossing, visible from the low road (junction rule): first steps 1.6/1.7
  // (held-jump law, over-cleared), then the run rides >=3.3 — ABOVE both deer windows (2.93/2.98) even
  // mid-jump. H1 itself sits INSIDE lane A's window: the climb is the timed commitment, don't perch on it.
  platform(G, 46, 1.6, 0, 2.6, 3, HIGH);                               // H1 spans 44.7..47.3 (+1.6 held)
  platform(G, 50, 3.3, 0, 2.8, 3, HIGH);                               // H2 spans 48.6..51.4 (+1.7 from H1, gap 1.3)
  candyLine(G, [[46,2.4,0],[48.5,3.6,0],[50,4.2,0]], 3);              // the verb, traced (skill-gated pickup law)

  // =============================== BEAT 2 — THE FIRST CRACKING RUN (x 50..66.8): TWIST ===============================
  // 7 slick panels (tag:'ice'): stand ~1.1s and one spiderwebs -> CREAKS -> drops you to the kit's full pit
  // price. The deer force LOW during sweeps — but low never means STOPPED (walking is grounded; the slick-
  // panel law holds: no precision stop is ever demanded on cracking ice, motion itself is the answer).
  w7CrackLake(G, 50, 66.8);
  candyLine(G, [[52,0.9,0],[56,0.9,0],[60,0.9,0]], 3);                 // the keep-moving line
  candyLine(G, [[63,0.9,0],[66,0.9,0]], 2);
  // ICE ANGLER #1 — stalks under the glass (active for players 48..70), lunging ONLY through openings the
  // player's own lingering shattered (0.7s glow+bubble telegraph; a stomp mid-lunge pops it — the brave line).
  // No fish holes anywhere in 7-2: every hole in this level is one somebody EARNED.
  G.ents.add(new IceAngler(G, 59, 0, 0, {phase:0.8, speed:2.8, range:11}));
  // the high road crosses the run dry (>=3.3: clear of lane A's 2.93 window top by 0.37+ even mid-hop)
  platform(G, 54.5, 3.5, 0, 3.0, 3, HIGH);                             // H3 spans 53..56 (gap 1.6, +0.2)
  platform(G, 59,   3.4, 0, 3.0, 3, HIGH);                             // H4 spans 57.5..60.5 (gap 1.5, -0.1)
  platform(G, 63.5, 3.6, 0, 3.0, 3, HIGH);                             // H5 spans 62..65 (gap 1.5, +0.2)
  G.ents.add(new BonkLantern(G, 59, 5.0, 0, 'bat'));                   // high-road prize: BAT WINGS (a kind hand for the basin ahead)
  candyLine(G, [[54.5,4.3,0],[59,4.2,0]], 2);
  candyLine(G, [[63.5,4.4,0],[66.8,2.6,0]], 2);                        // ...and the off-ramp down to the strip

  // =============================== BEAT 3 — THE SLEEPWALKER'S STRIP (x 66.8..84) ===============================
  groundX(G, 66.8, 84, SNOW);
  signPost(G, 68.5, 1.7, 0.1, "MIND THE SLEEPWALKER. She is dreaming, and the dream is going somewhere. Don't be underfoot, don't knock - and if you absolutely must, she only ever swings once, and she always warns you first. Then she forgets you entirely. Try not to take it personally.");
  // THE SOMNAMBEAR — home 76, range 3 (patrol 73..79, speed 0.9). Three honest lines, all under lanes A+B:
  //   WAIT — her patrol is a slow fixed clock; pass behind her heading.
  //   OVER — the wake probe needs |your feet - her feet| < 2.0: a double-jump crossing (apex 3.3) skips the
  //          wake entirely... airtime that lanes A/B (windows to 2.93/2.98) get a vote on. Read the bells.
  //   THROUGH — wake her ON PURPOSE (step in / hit her): 0.7s roar telegraph, then ONE 7u/s swipe — HOLD a
  //          jump over it (her body tops ~1.9; held 2.6 clears) and stroll past during the 1.4s yawn.
  // SLAM SAFETY MATH (her wake calls G._bearSlam, radius 3.2 — the lakes answer): patrol reach 73..79;
  // swipe can carry her to 69.85..82.15; wake positions therefore span 69.85..82.15 → slam coverage
  // 66.65..85.35. Lake 1's last panel center is 65.6 (|65.6-69.85|=4.25 > 3.2 — NEVER reached). Lake 2a's
  // first panel (85.2) is reachable ONLY from a wake at x>=82.0 — and waking her there requires the player
  // within 1.8u (x<=83.95, ON SOLID) or hitting her (adjacent, on solid): the slam can shatter a panel, but
  // never one under the player's own feet. Player-caused, player-safe, spectacle intact.
  G.ents.add(new Somnambear(G, 76, 0, 0, {phase:0.6, range:3, dir:-1, speed:0.9, candy:6}));
  // TEAM B — the counter-runner: y1.9, sweeping LEFT-TO-RIGHT (68 -> 120) on its own 11s clock, phase 5.5.
  // From here to the tow launch you read TWO independent deer clocks (the A/B two-clock law, w6l5 precedent) —
  // their drift means the overlap changes, but grounded stays safe under both, always.
  G.ents.add(new WraithdeerTeam(G, {x0:68, x1:120, y:1.9, n:3, period:11, phase:5.5, speed:11.5}));
  candyLine(G, [[69.5,0.9,0],[71.5,0.9,0]], 2);                        // flank candy — the middle belongs to the bear
  candyLine(G, [[81.5,0.9,0],[83,0.9,0]], 2);

  // =============================== BEAT 4 — THE DOUBLE RUN (x 84..130): ESCALATE ===============================
  // NOTE the build ORDER of the three CrackLakes: the kit exposes ONE G._bearSlam hook and each call
  // overwrites it, so run 2a (84..93.6) is created LAST (below, after run 2b) — it is the only run the
  // bear's wake-slam can physically reach (slam coverage tops out at 85.35; see the beat-3 math).
  candyLine(G, [[86,0.9,0],[89,0.9,0],[92,0.9,0]], 3);
  groundX(G, 93.6, 100, SNOW);                                         // the solid pocket between the runs
  // THE LANTERN — the level's ONE lit checkpoint (exam law: CP0 + one, x96 = ~54% of the 176u run).
  // REST-POCKET MATH, idle player at 96 (body 95.6..96.4, grounded y=0):
  //   · deer lanes A/B overhead: grounded bite thresholds +0.07/+0.12 — an idle player is deterministically
  //     untouchable (the lanes are the level's SUBJECT; the pocket is safe because idle means grounded)
  //   · angler #2 lunges only via holes with the player within hole.r+1.2=2.4: nearest possible hole centers
  //     are 92.4 (trigger reach 94.8 — 0.8u short of the body edge) and 101.2 (reach 98.8 — 2.4u clear);
  //     both refreeze in 3.2s regardless. No hole can open closer: the pocket is solid ground.
  //   · bear's absolute reach 82.15+touchR ≈ 83.4 (12.2u) · penguin #1's worst wake-slide reach 104.9 (8.5u)
  //   · Blizzard Bat: patrol 105.5..110.5 at y5.2, aggroR 3.5 — from the GROUND the 5.2u vertical gap alone
  //     exceeds its trigger (it can only ever be woken from the high road); worst post-dive drift ~x100 (3.6u)
  //   · boo #2 chase gate: player >=110 · cubs/penguins/team C all live further right. Idle = zero threats.
  G.ents.add(new Checkpoint(96, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 98, 1.5, 0, 'shield'));                // armor before the double run's essay question
  G.ents.add(new Crow(94.2, 0.95, 2.4));                               // lake crow #2 — staring back at the glass you crossed
  w7CrackLake(G, 100, 112);                                            // run 2b — 5 panels, the exam proper
  w7CrackLake(G, 84, 93.6);                                            // run 2a — 4 panels under BOTH lanes (built LAST: the bear's G._bearSlam binds here)
  candyLine(G, [[102,0.9,0],[106,0.9,0],[110,0.9,0]], 3);
  // ICE ANGLER #2 — under the double run (active for players 89..121). Worst on-panel simultaneity:
  // lane A pass + lane B pass + angler lunge + the cracking itself = the owner's 4-threat ceiling, exactly.
  G.ents.add(new IceAngler(G, 105, 0, 0, {phase:1.7, speed:3.0, range:16}));
  // the high road, second wing — same contract (>=3.3 clears both windows), now bat-guarded
  platform(G, 101,   1.7, 0, 2.6, 3, HIGH);                            // H6 spans 99.7..102.3 (+1.7 held; in-window transition — climb on a quiet bar)
  platform(G, 105,   3.4, 0, 3.0, 3, HIGH);                            // H7 spans 103.5..106.5 (+1.7, gap 1.2)
  platform(G, 109.5, 3.6, 0, 3.0, 3, HIGH);                            // H8 spans 108..111 (gap 1.5, +0.2)
  platform(G, 114,   3.5, 0, 3.0, 3, HIGH);                            // H9 spans 112.5..115.5 (gap 1.5, -0.1)
  platform(G, 118.5, 3.3, 0, 3.0, 3, HIGH);                            // H10 spans 117..120 (gap 1.5) — then drop to the launch strip
  // BLIZZARD BAT — the high road's toll (squeak-telegraphed snapshot dive). It cannot be triggered from the
  // ground (see the lantern math); up here it patrols right over H7/H8.
  G.ents.add(new BlizzardBat(G, 108, 5.2, 0, {phase:0.5, range:2.5, period:3.6, aggroR:3.5}));
  G.ents.add(new Heart(114, 4.6, 0));                                  // the heart the low road sees overhead (junction itch)
  candyLine(G, [[101,2.5,0],[103.5,3.9,0],[105,4.3,0]], 3);
  candyLine(G, [[109.5,4.5,0],[114,4.4,0],[118.5,4.2,0]], 3);
  // THE LAUNCH STRIP (x 112..130) — ground pressure before the crossing: two penguins + a Snow-Boo under
  // TEAM C's lane edge (bite floor x118 at y3.2 — grounded stays safe, boarding hops don't). Worst
  // simultaneity: penguin slide + penguin squawk + boo drift + a C pass = 4, the ceiling, spread over 12u.
  groundX(G, 112, 130, SNOW);
  G.ents.add(new FrostbitePenguin(G, 116, 0, 0, {phase:0.4, range:2.2, dir:-1}));    // patrol 113.8..118.2; worst slide reach 104.9 left
  G.ents.add(new FrostbitePenguin(G, 120.5, 0, 0, {phase:1.3, range:2.2, dir:1}));   // patrol 118.3..122.7; a right-slide can overshoot the lip by ~1.6u of harmless ghost-hover
  // SNOW-BOO #2 — the boarding heckler (home 124, chase gate: player 110..138). ACCESSIBILITY TECH, sanctioned:
  // stare it solid AT the lip and its 1.5u block is a boarding step — hop block, hop bar, no double-jump needed.
  G.ents.add(new SnowBoo(G, 124, 0, 0, {phase:1.6, speed:2.2, range:9, freezeMax:2.6}));
  candyLine(G, [[122.5,0.9,0],[125.5,0.9,0]], 2);

  // =============================== BEAT 5 — THE ROPE-TOW CROSSING (x 130..158): MASTER ===============================
  signPost(G, 127, 1.7, -0.1, "THE ROPE-TOW. Stand on the T-bar and the line does the walking. Over the deep there is NO other floor - so when the bells ring, JUMP, hold it, and let the line catch you coming down. The top run rides home, if you'd rather travel backwards than swim. Most do, once.");
  // THE SHATTERED BASIN — 28u of open water. The plunge charges the kit's full pit price via the ticker
  // below (heart + walk-back to the x96 lantern; HEARTS ALWAYS — the water never one-shots, and nothing
  // else is stacked on it: no angler ranges here, no holes, no second hazard anywhere near the deep).
  { const water = mesh('box',[30, 0.5, 9], emat(W7PAL.water, W7PAL.waterG, 0.35)); water.position.set(144, -2.6, 0); S.add(water);
    const gleam = new THREE.Group();
    for(let i=0;i<13;i++){ const gl=mesh('sph',[rand(0.05,0.1),4,4], emat(0x2a6a9a,0x2a6a9a,0.8)); gl.position.set(rand(130,158), rand(-2.2,-1.4), rand(-1.5,1.5)); gleam.add(gl); }
    // the SHATTER — drifting slabs of the floor this basin used to have (baked, resting on the water)
    for(let i=0;i<10;i++){ const sl=new THREE.Mesh(geo('box',rand(0.8,1.8),0.16,rand(0.8,1.6)), new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.7}));
      sl.position.set(rand(130.5,157.5), -2.28, rand(-2.2,2.2)); sl.rotation.y=rand(TAU); sl.rotation.z=rand(-0.12,0.12); gleam.add(sl); }
    S.add(bakeGroup(gleam));
    // the plunge ticker (the kit's own CrackLake price, applied to open water; island 141..145 is solid ground)
    G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
      update(dt, GG){
        const pl = GG.player;
        if(pl && !pl.dead && pl.pos.y < -1.4 && pl.pos.x > 129.8 && pl.pos.x < 158.2){   // lip-grazers included — grounded players can never be below -1.4 on the solid edges
          GG.fx.spawn(new THREE.Vector3(pl.pos.x, -1.2, pl.pos.z), 0x4a9ed0, 18, {speed:4, life:0.6});
          GG.fx.spawn(new THREE.Vector3(pl.pos.x, -1.0, pl.pos.z), 0xcfe4f4, 10, {speed:3, life:0.5});
          AUDIO.noise && AUDIO.noise({t:0.4, vol:0.2, fFrom:800, fTo:120});
          GG.onPlayerFell();
        }
      } });
  }
  G.ents.add(new Crow(129, 0.95, 2.3));                                // lake crow #3 — ON the lip, staring at the water (the house tell)
  // THE TOW — posts on solid ground both sides (127.5 / 160.5), bottom run y2.6 → bar tops 2.82 (mover box
  // y..y+0.22). 14 bars on the 70.4u loop = one every 5.03u (~2.0s apart at 2.5u/s): boarding windows are
  // constant, and a bar-to-bar forward hop is a 5.03u center-to-center held jump (<=5.5 law) with the shared
  // drift making it shorter in practice (both bars advance under you). BOARDING: double-jump-gated
  // (2.82 <= the 3.0 double law), candy-traced below — or the frozen-boo step for the single-jump line.
  w7RopeTow(G, {x0:127.5, x1:160.5, y:2.6, n:14, speed:2.5});
  candyLine(G, [[128.4,1.4,0],[129.3,2.7,0]], 2);                      // the boarding verb, traced
  // TEAM C — THE BAR-LINE SWEEP: y3.2, head-on across the basin (155 -> 122), period 7.5 (runT 3.0s) — a
  // rider meets 1-2 jingled passes per 13s crossing, on a fixed offset against the tow clock (both clocks
  // run from level start: the same bar meets the same sweep at the same spot, every run — the covenant).
  // THE DODGE MATH, pinned: bar-riders' feet 2.82 sit inside C's window (1.42..4.28). HELD hop apex 5.42 →
  // ~0.6s above the window vs the ~0.5s team passage (jump ON the jingle, not on the antlers). Escapes:
  // double-jump to a TOP-RUN bar (feet 4.72 > 4.28 — safe, drifts you backward: the price), or drop to the
  // island (grounded 0 < 1.42). Lane bite span 118..155: the dismount shore (158+) is never swept.
  G.ents.add(new WraithdeerTeam(G, {x0:155, x1:122, y:3.2, n:3, period:7.5, phase:2.0, speed:11}));
  candyLine(G, [[134,3.7,0],[139,3.7,0]], 2);                          // the ride line...
  candyLine(G, [[148,3.7,0],[153,3.7,0]], 2);
  // THE SIDE ISLAND (x 141..145) — drop off the bars mid-basin onto the old channel-marker's berg.
  groundX(G, 141, 145, W7PAL.iceD, 7);
  { const skirt = new THREE.Mesh(geo('box', 4.6, 1.5, 6.4), new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.55}));
    skirt.position.set(143, -1.9, 0); S.add(skirt); }                  // the berg's waterline root — the island sits IN the water, not over it
  candyLine(G, [[142,1.0,0],[144,1.0,0]], 2);
  G.ents.add(new Candy(143, 2.4, 0));                                  // the way BACK up, traced (island 0 → bar top 2.82, double-jump law)
  // THE FROZEN BELL-BUOY — the DISTRICT WARP (7-2 is the level that places it): the lone purple lantern
  // burns over the ice-locked buoy; ring PORT → STARBOARD → PORT and the old channel remembers the way
  // (teleports to x170, full candy bonus, once per run). Skill gate = reading the tow drop + the bells;
  // stranded ringers are never stuck: a bottom-run bar passes every ~2s, double-jump aboard (2.82 <= 3.0).
  // Grounded islanders sit below lane C's 1.42 bite floor — bell-ringing is a safe act.
  G.ents.add(new BellBuoy(G, 143, {warpX:170, candy:40}));

  // =============================== THE FAR SHORE (x 158..184) — dismount, one last lane, the gate ===============================
  groundX(G, 158, 184, SNOW);
  // dismount at 158..160.5 (bars ride over solid before the far wheel) — Team C's bite ends at 155 (2.6u+
  // clear of the earliest dismount hop) and cub #2's bite floor is 161.7 (1.2u clear of the landing zone).
  candyLine(G, [[159.5,0.9,0],[162,0.9,0]], 2);
  // POLAR CUB #2 — rolls the arrival road head-on (173 -> 162.5, fixed clock): one last low-lane read with
  // legs still shaking from the crossing. Bite span 161.7..173.8: it winks out 1.2u short of the dismount
  // landing zone AND spawns 1u shy of the exit gate's trigger edge (174.8) — both mercies pinned.
  G.ents.add(new PolarCub(G, 173, 0, 0, {x1:162.5, speed:3.8, phase:0.7, pause:1.0}));
  candyLine(G, [[168,0.9,0],[171,0.9,0]], 2);
  // the far shore's one string — the first town light since the near shore: you made it across
  deco.add(w6LightPost(167.5, -1.9, 3)); deco.add(w6LightPost(173.5, -1.9, 3));
  w6String(L, 167.5, 2.95, 173.5, 2.95, {z:-1.8});
  // (the sign lives in the dismount pocket at 160.2 — reading it never puts you in the cub's lane)
  signPost(G, 160.2, 1.7, -0.08, "THE FAR SHORE. Across the whole white nothing, and the bells never once caught you napping. The fisherfolk here say the deer only sweep for folk who forgot how to listen. They also say the lake is bottomless. They say a lot, the fisherfolk.");
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(174.5, 3.4, -1); S.add(lamp); }   // the level's one added real light
  exitGate(G, 176);

  // =============================== DECO · SILHOUETTES · PILES · PARALLAX ===============================
  // shoreline pines (both ends only — the working ice stays bare and enormous)
  deco.add(w6Pine(-6, -2.9, 1.3)); deco.add(w6Pine(-1.5, -3.1, 1.1));
  deco.add(w6Pine(166, -3.0, 1.2)); deco.add(w6Pine(175.5, -2.8, 1.4)); deco.add(w6Pine(181, -3.1, 1.1));
  deco.add(w6SnowmanDeco(170.5, -2.5, 0.8, 0.5));                      // somebody's harbor-watch snowman
  // high-road PILES — timber posts driven into the lake behind the platforms (z<0, lake-industry read;
  // deco only — physics stays the invisible platform boxes)
  for(const [px,py] of [[50,3.3],[54.5,3.5],[59,3.4],[63.5,3.6],[105,3.4],[109.5,3.6],[114,3.5],[118.5,3.3]]){
    const pil = mesh('cyl',[0.16,0.22,py+2.4,6], mat(W7PAL.rope)); pil.position.set(px+0.6, (py-2.4)/2, -3.1); pil.rotation.z=0.03; deco.add(pil);
    const cap = mesh('sph',[0.2,6,5], mat(W6PAL.snow)); cap.scale.y=0.45; cap.position.set(px+0.6, py+0.05, -3.1); deco.add(cap);
  }
  // machine lanterns on the tow posts (emissive fakes — the aurora and the brass do the district's lighting)
  for(const px of [127.5, 160.5]){
    const cage = mesh('box',[0.26,0.3,0.26], mat(0x2a3048)); cage.position.set(px, 5.2, -0.9); deco.add(cage);
    const lampM = mesh('sph',[0.14,7,6], emat(0xffb85e, 0xffb85e, 1)); lampM.position.set(px, 4.95, -0.9); deco.add(lampM);   // the bulb HANGS below the cage — visible, warm
  }
  // FOREGROUND silhouettes (z>0): up-thrust pressure slabs framing the depth
  for(const [fx2, fr] of [[20,0.3],[48,-0.4],[73,0.2],[98,-0.3],[133,0.35],[156,-0.25],[179,0.3]]){
    const slab = new THREE.Mesh(geo('box', rand(1.1,2.0), rand(0.5,1.1), 0.5), new THREE.MeshLambertMaterial({color:0x101c34}));
    slab.position.set(fx2, 0.25, 2.7); slab.rotation.z=fr; deco.add(slab);
    if(rand()<0.6){ const shard=mesh('cone',[rand(0.15,0.3),rand(0.6,1.2),4], mat(0x18274a)); shard.position.set(fx2+rand(-0.8,0.8), 0.5, 2.9); shard.rotation.z=rand(-0.3,0.3); deco.add(shard); }
  }
  S.add(bakeGroup(deco));

  // the winter moon, low over the far shore (its glade already lies across the ice via the kit parallax)
  const moon = mesh('circ',[3.8,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(60, 16, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.2,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(60, 16, -30.2); S.add(moonH);

  // pressure ridges / the far-shore village line / the great fells + aurora + moon glade
  w7Parallax(S, -8, 184);

  // festival strings live (two strings, one twinkle ticker)
  w6LightsFinish(G, L);

  // W7 tail — clutter passed null and laid manually on SOLID spans only (the kit scatter would bake junk
  // hovering over the basin water and onto vanishing CrackIce panels; w6l5 precedent for the manual split)
  w7LevelFinish(G, -8, 184, null);
  w7Clutter(G, -8, 49, 'lake');
  w7Clutter(G, 67.5, 83.5, 'lake');
  w7Clutter(G, 94, 99.5, 'lake');
  w7Clutter(G, 112.5, 129, 'lake');
  w7Clutter(G, 158.5, 184, 'lake');

  return {spawnX: 0, exitX: 176};
}

function updateW7L2(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none — the three deer teams, both anglers, the bear, the tow loop, and the basin
  // plunge are all cull:false fixed-clock tickers registered in build; the kit runs the lakes, lights,
  // aurora, and snowfall. The whole night is identical every attempt (determinism rule) — death costs
  // progress, never knowledge.
}

W7_LEVELS.push({id:'w7l2', district:'w7', name:'BELLS ON THE ICE', build:buildW7L2, update:updateW7L2, parTime:185});

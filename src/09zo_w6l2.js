// ============ LEVEL 6-2 — THE FROZEN POND (District 6 · FROSTMERE · Glimmerfields) ============
// The great pond behind the village, frozen shore to shore, strung with Winterfest lights. This is the SKATE
// level and Frostmere's momentum exam: long w6IceX runs where the pond keeps every bit of speed you give it
// (tag:'ice' — accel 9, friction 1.4 — the slide is REAL). Full introduce->twist->escalate->master on ICE
// MOMENTUM at POST-STORY MASTERY heat (owner call, Sept 4 2026: Glimmerfields plays one column RIGHT of D5 —
// everyone here has already invited Grimm): 13 enemies across three always-busy lanes (ground penguin traffic ·
// floating boos + watching snowmen · diving bats), D5-style CHAINED set-pieces in winter vocabulary — and
// still MAIN-GAME FAIR: every threat squawk/stare/squeak-telegraphed, every clock fixed, hearts-always:
//   BEAT 1 THE SKATERS' SHORE (grip, safely)   x -8..26   — CP0. Snow grips; learn the Frostbite Penguin's
//          squawk->toboggan on honest footing before the ice asks you to dodge it at speed. Festival lights.
//   BEAT 2 FIRST GLIDE (INTRODUCE momentum)    x 26..56   — a wide SAFE ice lake: candy speed-lines reward
//          keeping the glide, a bonk-lantern to stomp without stopping, and Snow-Boo #1 teaches the freeze.
//   BEAT 3 THE FISHING HOLES (TWIST)           x 56..86   — dark w6FishHoles punctuate the ice in learnable
//          clusters (a dunk = a heart + a shivering pop-out, never death); candy arcs trace the safe weave.
//          The QUIET PROP waits beside the first hole. Freeze the trailing boo to catch a runaway slide.
//   BEAT 4 WATCHER'S ISLAND (breather + CP1)   x 86..98   — a snowbank island: grippy relief, a PAIR of
//          Spooky Snowmen (one ahead, one behind — you cannot watch both at once; that's the toll), CP1
//          (lit — the level's ONE mid lantern, D5 law), and the HIGH ROAD's launch point.
//   BEAT 5 PENGUIN TRAFFIC (ESCALATE)          x 98..114  — THREE penguins toboggan the cove on woven
//          homes/dirs: chained squawk->slides read like rush-hour traffic — time the hops (a tap always
//          clears one; a held jump clears a converged pair). Overhead, the HIGH ROAD island-hops snow (grip)
//          and ice (slick) platforms with a Heart + a Moon Drop at the end.
//   BEAT 6 THE WRONG SNOWMAN'S ISLAND          x 114..130 — somebody built him ALL WRONG, and a lone PURPLE
//          lantern burns where none should — the district's Old Shortcut. Pound his balls big-to-small.
//   BEAT 7 THE RUSH-HOUR SLALOM (MASTER)       x 130..164 — the chained set-piece: FOUR holes on the floor,
//          TWO penguin lanes crossing the gaps between them, THREE Blizzard Bats phase-staggered over the
//          air lane, and a Snow-Boo to freeze as an emergency brake. Candy paves the one racing line
//          through all three clocks; skate it like you mean it.
//   BEAT 8 THE FESTIVAL SHORE (finish)         x 164..186 — snow underfoot again, the Mystery Igloo glowing
//          in its clear pocket, light strings overhead, and the gate home.
// Reads UNMISTAKABLY Frostmere: W6PAL moonlit snow + glassy cyan ice, warm bulb strings on every shore, the
// aurora breathing overhead, snow-shouldered pines framing the lane, a winter moon laying a glade across the
// pond. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; the one main-route rise is the gated
// high-road CHOICE at 2.0 with held-jump clearance; all gaps <=4.8 and every high-road miss lands on safe
// ground/ice below — this level has NO void pits, per the D6 law: ice never meets a pit in 6-1..6-3, and a
// fishing hole costs a heart, never a life). TWO lanterns only (mastery retune): CP0 + the island lantern at
// x95 (54% of the course) — a slalom death walks back through the traffic cove, and that walk-back is part
// of the price (the D5 checkpoint law). Deterministic to the flake — fixed penguin homes/phases, static
// holes, fixed bat clocks; the boos and snowmen are player-reactive state machines (same approach = same
// result); seeded rand() only inside baked cosmetic deco. No Math.random on the critical path. GP: NONE (the
// district's Golden Pumpkins live in 6-1, 6-3 and 6-4 — this one pays out in speed).

// ---- THE QUIET PROP: a pair of tiny ice skates left NEATLY beside the first fishing hole, laces tucked in,
// next to a thermos still standing upright. Skates that small only fit somebody Pip's size — some little
// skater sat down here, took them off to fish, and went home warm. Never signposted. Fully baked. ----
function w6l2QuietProp(x, z){
  const g = new THREE.Group();
  const boot = mat(0x8a3040), sole = mat(0x2a2436), blade = emat(0xd8e4f4, 0xaac4e0, 0.35);
  for(const s of [-1,1]){                                    // the pair, side by side, toes aligned
    const bx = x + s*0.16;
    const foot = mesh('box',[0.13,0.1,0.3], boot); foot.position.set(bx,0.13,z); g.add(foot);
    const ankle = mesh('box',[0.12,0.12,0.14], boot); ankle.position.set(bx,0.23,z-0.07); g.add(ankle);
    const sl = mesh('box',[0.13,0.03,0.32], sole); sl.position.set(bx,0.065,z); g.add(sl);
    const bl = mesh('box',[0.02,0.05,0.26], blade); bl.position.set(bx,0.025,z); g.add(bl);
    const lace = mesh('box',[0.1,0.02,0.02], mat(0xf0e6c8)); lace.position.set(bx,0.3,z-0.12); g.add(lace);
  }
  const thermos = mesh('cyl',[0.09,0.1,0.3,8], mat(0x3a6a4c)); thermos.position.set(x+0.48,0.15,z+0.1); g.add(thermos);
  const cap = mesh('cyl',[0.06,0.06,0.06,8], mat(0xc4d2ec)); cap.position.set(x+0.48,0.33,z+0.1); g.add(cap);
  const cup = mesh('cyl',[0.05,0.06,0.05,8], mat(0xc4d2ec)); cup.position.set(x+0.62,0.03,z-0.05); cup.rotation.z=1.4; g.add(cup);   // the cup, set down empty
  return g;
}

// ---- a low SNOWBANK hump-run: soft baked drifts along an island's edge so the banks read as banks (visual
// only — island colliders are the flat groundX; no surprise bumps on the racing line). ----
function w6l2Bank(x1, x2, z){
  const g = new THREE.Group();
  for(let x=x1; x<x2; x+=rand(1.1,2.0)){
    const h = mesh('sph',[rand(0.6,1.3),8,6], mat(rand()<0.5?W6PAL.snow:W6PAL.snowD));
    h.position.set(x, rand(-0.05,0.1), z+rand(-0.4,0.4)); h.scale.y=0.35; g.add(h);
  }
  return g;
}

// ---- the far shore's ICE-FISHING HUT (deco): warm window, snow-capped roof, a crooked stovepipe — the
// village edge leaning over its pond. Baked with the rest. ----
function w6l2FishHut(x, z){
  const g = new THREE.Group();
  const body = mesh('box',[1.7,1.5,1.3], mat(W6PAL.wood)); body.position.set(x,0.75,z); crook(body,0.04); g.add(body);
  const roof = mesh('cone',[1.5,0.9,4], mat(W6PAL.woodD)); roof.position.set(x,1.9,z); roof.rotation.y=Math.PI/4; g.add(roof);
  const cap = mesh('cone',[1.52,0.34,4], mat(W6PAL.pineSnow)); cap.position.set(x,2.2,z); cap.rotation.y=Math.PI/4; g.add(cap);
  const win = mesh('box',[0.4,0.44,0.08], emat(W6PAL.window,W6PAL.window,0.85)); win.position.set(x-0.3,0.85,z+0.68); g.add(win);
  const pipe = mesh('cyl',[0.09,0.09,0.7,6], mat(0x2a3048)); pipe.position.set(x+0.5,2.2,z); pipe.rotation.z=0.08; g.add(pipe);
  return g;
}

function buildW6L2(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const SNOW = W6PAL.snow;      // grippy snowbank shores & islands
  const SNOWD = W6PAL.snowD;    // shaded snow ledge tops (high-road grip platforms)

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();        // Winterfest bulb strings — merged to 5 draw calls at the tail

  // =============================== BEAT 1 — THE SKATERS' SHORE (x -8..26): grip, safely ===============================
  groundX(G, -8, 26, SNOW);                                            // honest snow underfoot to learn on
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "THE FROZEN POND. The whole village skates tonight - now it's your turn. SNOW GRIPS, ICE GLIDES: out there the pond keeps every push you give it, so lean in early and steer gentle. And mind the dark fishing holes. Nobody comes out of a cold dunk smiling.");
  // FROSTBITE PENGUIN #1 — alone on grippy snow: learn the flippers-up SQUAWK (~0.5s) -> belly-toboggan here,
  // where your feet still answer. A tap-jump ALWAYS clears the slide (owner speedrun rule).
  G.ents.add(new FrostbitePenguin(G, 14, 0, 0, {phase:0.0, range:2.4, dir:1, wakeR:4.5}));
  candyLine(G, [[6,0.9,0],[9.5,0.9,0],[13,0.9,0]], 3);
  candyLine(G, [[19,0.9,0],[23,0.9,0]], 2);
  G.ents.add(new Crow(9, 0.95, 2.4));                                  // winter crow #1 — flaps off in a puff when neared
  signPost(G, 24, 1.7, 0.1, "Pond wisdom: a Snow-Boo, stared at hard enough, freezes into honest ice you can STAND ON. The skaters call that 'making an island.' Handy, when the glide gets away from you.");
  // festival lights over the shore (posts + two sagging strings — the Winterfest read from the first step)
  deco.add(w6LightPost(0, -1.8, 3)); deco.add(w6LightPost(9, -1.8, 3)); deco.add(w6LightPost(18, -1.8, 3));
  w6String(L, 0,3, 9,3, {z:-1.8}); w6String(L, 9,3, 18,3, {z:-1.8});

  // =============================== BEAT 2 — FIRST GLIDE (x 26..56): INTRODUCE momentum, zero hazards ===============================
  w6IceX(G, 26, 86);                                                   // THE POND — one glassy sheet to Watcher's Island
  // candy speed-lines: collecting at full glide IS the lesson (flow rule — thinking happens before the push)
  candyLine(G, [[28,0.9,0],[31.5,0.9,0],[35,0.9,0]], 3);
  // a bonk-lantern mid-glide — stomp it WITHOUT stopping (the bounce keeps your momentum; shield mercy for the holes ahead)
  G.ents.add(new BonkLantern(G, 36, 2.4, 0, 'shield'));
  candyLine(G, [[33.5,1.1,0],[35,1.9,0],[36.5,1.9,0]], 3);            // the hop-arc onto the lantern, telegraphed
  candyLine(G, [[51,0.9,0],[54,0.9,0]], 2);                           // (the 41..46 line was traded to the slalom's 4th hole-arc — candy budget; the boo at 46 holds this stretch's attention)
  // SNOW-BOO #1 — drifts after you the moment you look away; STARE it into a grippy ice block and stand on it.
  // Introduced over SAFE ice so the freeze is a toy before the holes make it a tool. (It trails at 2.0 to your
  // 7.2 glide — resolve it here or outskate it; it can never keep pace to the igloo's pocket 125u downstream.)
  G.ents.add(new SnowBoo(G, 46, 0.5, 0, {phase:0.0, speed:2.0, range:9}));

  // =============================== BEAT 3 — THE FISHING HOLES (x 56..86): TWIST — the ice is punctuated ===============================
  // dark holes in learnable clusters: pair -> pair -> solo. A dunk costs a heart and pops you out shivering —
  // never a death (hearts-always law). Candy arcs trace the safe weave; at glide speed it plays as rhythm hops.
  w6FishHole(G, 58);  w6FishHole(G, 62);                               // pair — 4u apart, a clean landing between
  candyLine(G, [[56.8,0.9,0],[58,1.9,0],[59.2,0.9,0]], 3);            // the arc OVER each hole is the lesson
  candyLine(G, [[60.8,0.9,0],[62,1.9,0],[63.2,0.9,0]], 3);
  // THE QUIET PROP (never signposted): tiny skates + a thermos, left neatly beside the first hole (x59.4, off-lane)
  deco.add(w6l2QuietProp(59.4, -1.3));
  w6FishHole(G, 70);  w6FishHole(G, 73);                               // tighter pair — one HELD jump clears both (candy shows it)
  candyLine(G, [[68.6,1.0,0],[70.5,2.1,0],[72.5,2.1,0],[74.4,1.0,0]], 4);
  w6FishHole(G, 79);                                                   // solo — read it coming at full speed
  candyLine(G, [[77.8,0.9,0],[79,1.9,0],[80.2,0.9,0]], 3);

  // =============================== BEAT 4 — WATCHER'S ISLAND (x 86..98): breather + CP1 + the high-road launch ===============================
  groundX(G, 86, 98, SNOW);                                            // grippy snowbank relief mid-pond
  // THE WATCHERS — a PAIR of Spooky Snowmen (mastery retune, +1 on the islands): each stands utterly still
  // while watched, hops closer every moment you look away (eyes flare cyan mid-hop, the tell you can trust).
  // One ahead, one behind: past x87 you cannot stare at both — crossing the island is a stare ROTATION, and a
  // missed rotation costs a heart, never more. LANTERN SAFETY (reach math): an idle player at CP1 x95 —
  // #1 home 87 + aggroR 5.5 = trigger boundary x92.5 (2.5u clear); #2 home 90.5 + aggroR 3.0 = boundary x93.5
  // (1.5u clear). A snowman only begins hopping at players INSIDE its boundary, so neither ever starts on a
  // fresh respawner (kiting one closer is a deliberate act, and Pip outwalks the hop trivially).
  G.ents.add(new SpookySnowman(G, 87, 0, 0, {phase:0.0, watchR:9, aggroR:5.5}));   // fleet-audit fix kept: home 89 hopped to within 0.5u of CP1's respawn — 87 keeps the courtesy gap
  G.ents.add(new SpookySnowman(G, 90.5, 0, 0, {phase:0.7, watchR:9, aggroR:3.0})); // the second watcher — tighter aggro so its boundary (93.5) stays clear of CP1
  G.ents.add(new Checkpoint(95, 0, 1.6, 1));                           // CP1 — LIT, the level's ONE mid lantern (54%; the slalom's walk-back is the price — D5 law)
  candyLine(G, [[92.5,0.9,0],[96,0.9,0]], 2);
  G.ents.add(new Crow(92, 0.95, 2.3));                                 // winter crow #2
  deco.add(w6LightPost(87, -1.8, 3)); deco.add(w6LightPost(97, -1.8, 4.5));
  w6String(L, 87,3, 97,3, {z:-1.8});
  // ...and one long string right across the traffic cove to the Wrong Snowman's island — bulbs twinkling
  // over the penguin lanes (depth z-1.9, well behind the play lane)
  w6String(L, 97,4.5, 115,4.5, {z:-1.9});

  // =============================== BEAT 5 — PENGUIN TRAFFIC (x 98..114): ESCALATE + THE HIGH ROAD ===============================
  w6IceX(G, 98, 114);                                                  // the traffic cove
  // THREE penguins on woven homes/dirs (mastery retune — the lane doubles up): chained squawk->slides cross
  // like rush-hour traffic, adjacent pairs converging/diverging alternately (fixed homes/dirs = the identical
  // weave every run; ESCALATE composes ice momentum + the 3-lane weave, with the high road as the skill out).
  // Wakes stagger by home spacing (~1.8u), so slides arrive as a hop-hop-hop rhythm, never one wall — and a
  // tap always clears one toboggan (owner speedrun rule); a held jump clears a converged pair. Reach math,
  // pinned BOTH ways: leftmost patrol point x101 (home 102.6 - range 1.6) makes the wake boundary x96 — an
  // idle player on a fresh CP1 respawn at x95 never wakes the cove (1.0u clear, same margin the pre-retune
  // pair shipped with). Rightmost patrol point x107.7 (home 106.1 + range 1.6) caps the worst-case slide
  // (squawk at 107.7 + toboggan 8.5*1.05 = 8.9u) at x116.6 — a full clear patch short of the Wrong Snowman's
  // balls at 117.8 (the warp pocket stays a deliberate, safe act).
  G.ents.add(new FrostbitePenguin(G, 102.6, 0, 0, {phase:0.0, range:1.6, dir:-1}));
  G.ents.add(new FrostbitePenguin(G, 104.4, 0, 0, {phase:1.1, range:1.6, dir:1}));
  G.ents.add(new FrostbitePenguin(G, 106.1, 0, 0, {phase:2.2, range:1.6, dir:-1}));
  candyLine(G, [[100.5,0.9,0],[102,1.9,0],[103.5,0.9,0]], 3);          // hop-arcs pace the traffic rhythm
  candyLine(G, [[104.5,0.9,0],[106,1.9,0],[107.5,0.9,0]], 3);
  // THE HIGH ROAD — an island-hop chain over the cove's north side: SNOW platforms grip, ICE platforms don't
  // (the route's own twist). Harder footing, more candy, a Heart, and a MOON DROP at the end — then the leap
  // down lands you at the Wrong Snowman's island, right past his purple lantern (junction moments, visibly).
  candyLine(G, [[98.6,1.3,0],[100.2,2.9,0]], 2);                       // the lure UP off the island edge (held jump, 2.0 rise)
  platform(G, 101, 2.0, 0, 3, 2.6, SNOWD);                             // P1 snow — grip (spans 99.5..102.5)
  w6IcePlat(G, 105.5, 2.4, 0, 2.6, 2.6);                               // P2 ICE — slick (+0.4, gap 1.7)
  platform(G, 110, 2.8, 0, 3, 2.6, SNOWD);                             // P3 snow (+0.4, gap 1.7)
  G.ents.add(new Heart(110, 3.9, 0));                                  // the Heart the low road sees overhead
  w6IcePlat(G, 116, 2.6, 0, 2.6, 2.6);                                 // P4 ICE (-0.2, gap 3.2)
  platform(G, 124, 2.9, 0, 4, 2.8, SNOWD);                             // P5 snow (+0.3, gap 4.7 — a held leap; a miss lands SAFE on the island below)
  G.ents.add(new BonkLantern(G, 124.5, 4.1, 0, 'moon'));               // MOON DROP — invincible speed into the slalom (fun-first)
  candyLine(G, [[105,3.4,0],[110,3.7,0],[116,3.5,0]], 3);              // the chain, traced
  candyLine(G, [[118,3.6,0],[120.2,4.1,0],[122.4,3.9,0]], 3);          // the big leap-arc — sails right past the purple tell
  // (the low road's own 110..112.5 line was traded to the slalom's 4th hole-arc — candy budget; the Heart at
  // 110/y3.9 stays the junction tell the low road looks up at)

  // =============================== BEAT 6 — THE WRONG SNOWMAN'S ISLAND (x 114..130): the Old Shortcut ===============================
  groundX(G, 114, 130, SNOW);
  // THE DISTRICT WARP — somebody built him ALL WRONG: three balls scattered by a bare pole under a lone PURPLE
  // lantern (the warp language). Pound beside each ball LARGEST FIRST to stack him true; he tips his hat and
  // remembers a shortcut to the festival shore. CLEAR POCKET (owner law, re-audited after the retune): the
  // pound pocket spans ~x116..123.8 (ball homes 117.8/118.8/122 + reach r+1.3). Cove side: nearest patrol
  // tops out at x107.7, worst slide reach x116.6 vs. balls from 117.8. Slalom side: bat #1's leftmost aggro
  // boundary is x130 and penguin lane A's worst LEFT slide reaches x130.3 — both 6u+ clear of the pocket's
  // far edge. The puzzle is still pounded in peace. warpX lands just before the exit gate; once per run.
  // NOTE (mastery retune): the lit lantern that stood at x127 is GONE — the level's one mid checkpoint is the
  // island lantern at x95, so a slalom death pays the traffic-cove walk-back (the D5 checkpoint law).
  G.ents.add(new WrongSnowman(G, 120, {warpX:172.5, candy:40}));
  deco.add(w6LightPost(115, -1.8, 4.5)); deco.add(w6LightPost(129, -1.8, 3));
  w6String(L, 115,4.5, 129,3, {z:-1.8});
  // sign at 129: one unit clear of Blizzard Bat #1's leftmost aggro trigger (x130) — nobody gets dived on mid-read
  signPost(G, 129, 1.7, 0.1, "THE RUSH-HOUR SLALOM. Holes below, two penguin lanes crossing, three bats working the sky - and no lantern past this sign. The racing line is paved in candy. Skate it like you mean it.");

  // =============================== BEAT 7 — THE RUSH-HOUR SLALOM (x 130..164): MASTER — three clocks, one line ===============================
  w6IceX(G, 130, 164);
  // THE CHAINED SET-PIECE (the D5 soul, translated to winter): ~20u of racing line (136..156) where all three
  // lanes run fixed clocks AT ONCE — FOUR fishing holes on the floor, TWO penguin lanes crossing the gaps
  // between them (counter-phased so the crossings ALTERNATE: when A slides, B waddles), and THREE Blizzard
  // Bats phase-staggered overhead (squeak-telegraphed SNAPSHOT dives, never homing — periods 3.2/3.4/3.6
  // never beat-lock, so no two dives share a window). At full glide (7.2) the forced hole-arcs land ~0.83s
  // apart — tight but honest: dodging is a FORWARD dance, the candy paves the one line through all three
  // clocks, and worst simultaneous pressure is hole + one penguin + one bat (bombardment-cap legal; the
  // Snow-Boo is the mercy you can turn INTO the level — freeze it and stand on the brake).
  G.ents.add(new BlizzardBat(G, 138, 5.2, 0, {phase:0.1, range:3.5, period:3.2, aggroR:4.5}));
  w6FishHole(G, 138);
  candyLine(G, [[136.8,0.9,0],[138,1.9,0],[139.2,0.9,0]], 3);
  // penguin lane A — patrols 139.2..142.8, exactly the 138/144 hole gap (deterministic)
  G.ents.add(new FrostbitePenguin(G, 141, 0, 0, {phase:0.5, range:1.8, dir:1}));
  w6FishHole(G, 144);
  candyLine(G, [[142.8,0.9,0],[144,1.9,0],[145.2,0.9,0]], 3);
  // BAT #3 (mastery retune) — the rush hour's middle clock: patrol 142.5..149.5 pressures BOTH inner hole-arcs
  G.ents.add(new BlizzardBat(G, 146, 5.4, 0, {phase:1.2, range:3.5, period:3.4, aggroR:4.5}));
  // penguin lane B (mastery retune) — patrols 145.5..148.9, the 144/150 hole gap, clear of both hole rims;
  // counter-phased to lane A so one crossing is always opening while the other closes
  G.ents.add(new FrostbitePenguin(G, 147.2, 0, 0, {phase:1.4, range:1.7, dir:-1}));
  w6FishHole(G, 150);
  candyLine(G, [[148.8,0.9,0],[150,1.9,0],[151.2,0.9,0]], 3);
  // SNOW-BOO #2 — drifts low over the line between the last two holes: stare it solid and its block is a
  // grippy island to kill a slide that's carrying you at a hole (the sign's lesson, cashed in under pressure).
  // IGLOO LAW (reach math): leash pinned to chaseR 11 — chase boundary = home 152.5 + 11 = x163.5, half a unit
  // short of the igloo's ~6u clear zone (x164..176), so it can never trail a player into the pocket; its home
  // also keeps the 15u+ boo-home distance from the igloo at 170. (SnowBoo doesn't unpack a chaseR opt — set
  // the property on the instance, where the leash reads this.chaseR||14.)
  { const boo2 = new SnowBoo(G, 152.5, 0.5, 0, {phase:0.6, speed:2.0, range:9}); boo2.chaseR = 11; G.ents.add(boo2); }
  w6FishHole(G, 156);                                                  // hole #4 (mastery retune) — one last read at full speed, under bat #2's watch
  candyLine(G, [[154.8,0.9,0],[156,1.9,0],[157.2,0.9,0]], 3);
  G.ents.add(new BlizzardBat(G, 154, 5.6, 0, {phase:2.3, range:4, period:3.6, aggroR:4.5}));   // retune-verify: 4.5 deletes the 1u triple-bat overlap sliver at x145 — the ≤4-threat cap keeps headroom
  candyLine(G, [[159.5,0.9,0],[162,0.9,0]], 2);                        // the sprint out

  // =============================== BEAT 8 — THE FESTIVAL SHORE (x 164..186): finish ===============================
  groundX(G, 164, 186, SNOW);
  candyLine(G, [[166,0.9,0],[168.5,0.9,0]], 2);
  // THE MYSTERY IGLOO — warm light through the door, the red gamble-pulse through the bricks. CLEAR POCKET
  // (owner law, re-audited after the retune): the far shore still holds no enemies at all. Nearest reaches:
  // bat #2's home caps at 158 with aggro boundary ~163 (its documented post-dive drift stays well short of
  // the pocket); boo #2's leash boundary is x163.5 (chaseR 11, pinned above); penguin lane B's worst RIGHT
  // slide is 148.9+8.9 = x157.8. Everything stops before x164 — the ~6u pocket around the igloo at 170 is
  // untouched, opening is a deliberate act, and the penguin ambush pours out onto GRIPPY snow with its 1s
  // spawnGrace.
  { const ig = new MysteryIgloo(170, 0, -1.0, 0.5); G.coffins.push(ig); G.ents.add(ig); }
  deco.add(w6LightPost(166, -1.8, 3)); deco.add(w6LightPost(174, -1.8, 3.4)); deco.add(w6LightPost(184, -1.8, 3));
  w6String(L, 166,3, 174,3.4, {z:-1.8}); w6String(L, 174,3.4, 184,3, {z:-1.8});
  exitGate(G, 176);

  // =============================== DECO · BANKS · PINES · HUT · MOONGLADE · PARALLAX ===============================
  // snowbank humps soften every shoreline (visual only — colliders stay flat, the racing line stays honest)
  deco.add(w6l2Bank(-8, 25, 2.3));  deco.add(w6l2Bank(-8, 25, -2.4));
  deco.add(w6l2Bank(86.5, 97.5, 2.3)); deco.add(w6l2Bank(86.5, 97.5, -2.4));
  deco.add(w6l2Bank(114.5, 129.5, 2.3)); deco.add(w6l2Bank(114.5, 129.5, -2.4));
  deco.add(w6l2Bank(164, 185, 2.3)); deco.add(w6l2Bank(164, 185, -2.4));
  // snow-shouldered pines on the shores and islands (never out of the pond — banks grow trees, water doesn't)
  deco.add(w6Pine(-2, -2.6, 1.3)); deco.add(w6Pine(21, -2.7, 1.1));
  deco.add(w6Pine(88, -2.6, 1.0)); deco.add(w6Pine(96.5, -2.8, 1.2));
  deco.add(w6Pine(117, -2.7, 1.1)); deco.add(w6Pine(128, -2.6, 1.3));
  deco.add(w6Pine(167, -2.7, 1.2)); deco.add(w6Pine(179, -2.8, 1.0));
  deco.add(w6l2FishHut(182, -2.6));                                    // the village leaning over its pond
  deco.add(w6SnowmanDeco(19.5, -2.2, 0.9, 0.4));                       // a PROPER snowman on the shore (foil for the spooky one)
  // FOREGROUND silhouettes (z>0) framing depth — pines and a little snowman up front
  deco.add(w6Pine(-5, 2.5, 1.5)); deco.add(w6Pine(33, 2.7, 1.3)); deco.add(w6Pine(76, 2.4, 1.4));
  deco.add(w6Pine(134, 2.6, 1.5)); deco.add(w6Pine(163, 2.4, 1.3)); deco.add(w6Pine(184, 2.6, 1.4));
  deco.add(w6SnowmanDeco(108, 2.4, 0.8, -0.5));
  S.add(bakeGroup(deco));

  // the winter moon, low and huge, laying a MOONGLADE across the pond ice
  const moon = mesh('circ',[4.8,28], emat(0xe8eeff, 0xdce6ff, 0.85)); moon.position.set(96,15.5,-30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',7.6,28), new THREE.MeshBasicMaterial({color:0xaac4ee, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(96,15.5,-30.2); S.add(moonH);
  const glade = mesh('box',[30,0.02,1.2], emat(0xdfe8ff, 0xaac4ee, 0.3)); glade.position.set(96,0.1,-2.4); S.add(glade);

  // three-depth Glimmerfields skyline (snowdrifts & birches / the lamplit village + eave bulbs / blue peaks)
  w6Parallax(S, -8, 186);

  // NO pitDressing — this level has no void pits (D6 law: ice never meets a pit in 6-1..6-3; the pond's
  // only teeth are its fishing holes, and those cost a heart, never a life)

  // exit + the Frostmere tail (fog/sky retint, aurora, snowfall, bulb-twinkle ticker). Clutter on the SNOW
  // spans only — the pond keeps its glassy sparkle-fleck surface clean for the read of the slide
  w6LightsFinish(G, L);
  w6LevelFinish(G, -8, 186, null);
  w6Clutter(G, -8, 26, 'winter');
  w6Clutter(G, 86, 98, 'winter');
  w6Clutter(G, 114, 130, 'winter');
  w6Clutter(G, 164, 186, 'winter');

  return {spawnX: 0, exitX: 176};
}

function updateW6L2(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the pond's motion is deterministic and self-driven (penguins/boos/snowmen
  // are player-reactive state machines on fixed homes, bats fly fixed clocks, bulbs twinkle on the kit's own
  // ticker, and the holes never move). The ice itself is the level's clockwork.
}

W6_LEVELS.push({id:'w6l2', district:'w6', name:'THE FROZEN POND', build:buildW6L2, update:updateW6L2, parTime:165});

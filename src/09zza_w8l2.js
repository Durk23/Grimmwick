// ============ LEVEL 8-2 — THE ORE LINES (District 8 · Frostmere · The Icicle Mines) ============
// POST-STORY MASTERY BAND (owner lock): the Mines open BEYOND District 5 — but stay MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away).
// 8-2 is the BUCKET-LINE level: the great chasms of the deep workings are crossed on looping aerial ore
// buckets that never stopped hauling. One machine, four readings — introduce, twist, escalate, master —
// and THE DISTRICT WARP lives here: the Off-Limits Bucket on the level's last line (purple lantern tell).
// 11 enemies + 2 drills: 2 Knocker Sprites + 2 Gem Mimics + 2 Rubblekins + 2 Crystal Moths + 1 Snow-Boo +
// 2 Blizzard Bats (cave bats — the roster's two reuses) + 2 crystal drills. NO Golden Pumpkin (8-2 keeps
// none), NO Leap of Faith (both of the game's two are placed and sacred).
//
//   BEAT 1 THE LAMP ROOM              x -8..20    — CP0 (noLight). The Glimmering Geode in its clear pocket,
//          the ORE LINES sign, the quiet prop waiting off the path. Nothing bites here; the first line
//          glitters ahead and its buckets are already running.
//   BEAT 2 THE FIRST HAUL (INTRODUCE) x 20..44    — a short line over a SAFE floor: board at the pylon
//          scaffold, ride the low cable, step off before the wheel. The floor has opinions (Rubblekin #1 +
//          Blizzard Bat #1) so the ride earns its keep — but a fall here costs only the walk back.
//   BEAT 3 THE LONG HAUL (TWIST)      x 44..70    — a DENSE line over the first chasm: 9 buckets, 5.0u
//          apart on the bottom run (offset phases, one loop clock). Stay aboard = the safe slow crossing;
//          HOP THE LINE bucket-to-bucket (held jump spans the fixed 5.0u gap — buckets share a speed, so
//          the gap never breathes) = the haulers' fast line. Crystal Moth #1 weaves the mid-span.
//   BEAT 4 THE KNOCKING TUNNEL (ESC.) x 70..100   — the composition: ride the line while DRILLS grind the
//          floor and KNOCKER SPRITES work the rock brows above the cable. The drills never look up (floor
//          runners' problem); the knockers never reach the floor (riders' problem). Brow #1 is phase-locked
//          COLD — every bucket watches the burst punch empty air ~4u ahead (the lesson). Brow #2 is
//          phase-locked HOT — every straight ride meets the burst: bail down at the marked pocket, finish
//          on foot past drill #2, or jump the burst clean (the expert stay-aboard line).
//   BEAT 5 THE LANTERN LANDING        x 100..110  — THE lantern (x102, ~52% of the run — the level's ONE
//          lit checkpoint), a heart, a shield lantern, the yardmaster's sign. A true breath.
//   BEAT 6 THE TRANSFER YARD (MASTER) x 110..158  — the chained set-piece: LINE A (low, y4.0) ends over
//          the great chasm; LINE B (high, y6.6) begins mid-chasm and finishes the haul. Equal spans, equal
//          speeds, one shared clock: every time an A bucket enters the overlap, a B bucket DROPS DOWN THE
//          MID-CHASM PYLON beside it and levels off 0.32u ahead, 2.6u up — double-jump across on the
//          lamplit candy arc. Windows recur every 8.0s; a missed window just rides you round the loop.
//          Crystal Moth #2 patrols the transfer air; Gem Mimics wait among real crystals on the arrival.
//   BEAT 7 THE ARRIVAL                x 156..176  — mimic ground (a crow stares at the crystals that bite),
//          Snow-Boo #1 drifting the walk-up, and the old inspection chain up to a lookout perch — from it
//          you can watch the last line's far wheel... and the one bucket that never unloads.
//   BEAT 8 THE OFF-LIMITS LINE        x 176..202  — the exhale crossing + THE DISTRICT WARP: the level's
//          last line carries the purple-lantern bucket (#0). Ride IT up past the far pylon instead of
//          hopping off and the old line remembers its secret station (warp to the gate + 40 candy).
//          Never signposted — the lantern IS the language.
//
// ROUTES (2-3 visible, junctions sighted): B2 floor vs ride (each route's candy visible from the other) ·
// B4 floor (drills) vs cable (knockers) with the bail pocket + mid scaffold crossing them mid-tunnel ·
// EXPERT = hop-the-line speed crossings, the brow-#2 burst-jump, and the Off-Limits Bucket itself.
// COMPARABLE HEIGHTS (owner law): every scaffold step-up <=1.6 (law 2.2) · every boarding hop is a 1.02u
// tap onto a bucket top (tap 1.8, over-clearance) · the ONE double-jump gate is the yard transfer, a 2.6u
// rise (law 3.0), candy-traced · twist hop gaps 5.0u held (law 5.5) and always optional · chasms are
// contraption-gated (the law's "contraptions gate the rest").
// HEARTS ALWAYS: every enemy/drill/pebble costs exactly 1 · chasm falls pay the kit's full pit price
// (heart + lantern walk-back via killY/G.onPlayerFell, pitDressing 'winter' showing the danger).
// DETERMINISM: every bucket line runs one fixed loop clock from level start (all movers share the world
// clock) · knocker periods EQUAL the tunnel line's bucket-pass interval (6.48s), so every bucket meets
// every brow at the same phase, forever · drills, moths, and the yard alignment are fixed clocks · mimics/
// rubblekins/boo are player-reactive on FIXED homes (the w7l4 angler precedent — determinism holds) ·
// NO Math.random on the critical path (rand() only inside baked deco + the opt-in geode gamble).
//
// ---- THE YARD MATH (why the transfer window is free): lines A and B share span (24), speed (2.2) and
// bucket count (3), so their loop periods are identical (Pm=53.03) and their bucket offsets are the SAME
// set {0, 17.68, 35.35}. When an A bucket sits at bottom-run arc-length s (x=116+s), some B bucket sits at
// s-17.68 (x=134+s-17.68 = x_A+0.32) — for all s in [18,24): the pair rides the whole 6u overlap together,
// B forever 0.32 ahead and 2.6 above. Better: the B partner's previous segment is its descent at the
// mid-chasm pylon (x134), so the window ANNOUNCES itself — a bucket drops out of the dark beside you,
// levels off, and the candy arc points up at it. Windows every Pm/3/speed = 8.03s. ----
//
// ---- THE TUNNEL PHASE-LOCK (knocker clocks): tunnel line span 26, speed 2.2, n=4 → a bucket passes any
// fixed x every 57.03/4/2.2 = 6.48s. Both knockers run period 6.48 → phase relations never drift. A
// knocker bursts at its glide end (x1); hot window = local cycle [5.38, 6.18] (0.9s of audible knocks
// first — the miners' oldest warning, >=0.6s law honored with margin). Riders cross a burst zone
// (x1 +-1.0u) in 0.91s. Knocker #1 (burst x84): riders cross at t=4.55 mod 6.48; phase 2.78 puts the burst
// at t=[2.60,3.40] — 0.69s clear, punched into empty air 4.3u ahead of every arriving bucket (the teach).
// Knocker #2 (burst x94): riders cross at t=[2.16,3.07]; phase 3.18 puts the burst at t=[2.20,3.00] —
// dead on every straight ride (the exam; the bail pocket, the floor lane, and the burst-jump all answer).
// Knockers can NEVER bite a grounded player (touch band y 3.22..5.17 — a floor head tops out at 1.2);
// drills can never bite a rider (band y < 1.4, |z| < 0.9). Lanes are honest. The two knockers carry
// cull=false: the phase-lock needs their clocks ticking with the mover clock from level start (frozen
// far-culled clocks would drift the lock by however long the player dawdled west — the one nondeterminism
// this level cannot afford). Brow geometry: underside 4.42 = wallY (the bump rides ON the face), slabs sit
// at z -1.5..0 so the camera-side lane plane stays clear of the rider, tops at 4.9 clear the top-run
// buckets (mesh min 5.15) and the hang rods below (4.375). ----

// ---- THE QUIET PROP: one bucket on a snapped side-cable — grounded where it fell, still upright, full of
// seep-water frozen to black ice, and out of the ice a tiny fern of frost, growing. The line moved on;
// something small made a home of what it dropped. Never signposted; fully baked. ----
function w8l2FallenBucket(x, z){
  const g = new THREE.Group();
  const stub = mesh('box',[0.2,1.7,0.24], mat(W8PAL.steel)); stub.position.set(x-1.35,0.72,z); stub.rotation.z=0.38; g.add(stub);
  const cross = mesh('box',[0.7,0.14,0.2], mat(W8PAL.brassD)); cross.position.set(x-1.62,1.46,z); cross.rotation.z=0.38; g.add(cross);
  // the snapped cable, drooping from the stub, frayed end curled on the ground
  const c1 = mesh('cyl',[0.03,0.03,1.4,4], mat(0x1a1626)); c1.position.set(x-0.95,0.86,z); c1.rotation.z=1.02; g.add(c1);
  const c2 = mesh('cyl',[0.03,0.03,0.8,4], mat(0x1a1626)); c2.position.set(x-0.32,0.3,z); c2.rotation.z=1.42; g.add(c2);
  const curl = mesh('tor',[0.12,0.03,4,8,4.5], mat(0x1a1626)); curl.position.set(x+0.02,0.1,z); curl.rotation.x=Math.PI/2; g.add(curl);
  // the bucket itself — settled a little into the floor, leaning, dented but holding
  const bucket = mesh('cyl',[0.65,0.5,0.7,9], emat(0x4a4458,0x241c30,0.12)); bucket.position.set(x+0.55,0.34,z); bucket.rotation.z=0.1; g.add(bucket);
  const rim = mesh('tor',[0.65,0.05,5,12], mat(W8PAL.brassD)); rim.position.set(x+0.52,0.66,z); rim.rotation.z=0.1; rim.rotation.x=Math.PI/2; g.add(rim);
  const rod = mesh('cyl',[0.035,0.035,0.5,4], mat(0x1a1626)); rod.position.set(x+0.62,0.92,z); rod.rotation.z=0.55; g.add(rod);
  // the rainwater-ice, frozen flush with the rim
  const ice = mesh('cyl',[0.55,0.55,0.06,9], emat(0xa8dcf4,0x5eb8e8,0.35)); ice.position.set(x+0.52,0.64,z); ice.rotation.z=0.1; g.add(ice);
  // and the frost fern — a small green-white life the mines never asked for
  const stem = mesh('cyl',[0.015,0.025,0.5,4], mat(0xdfe8f8)); stem.position.set(x+0.5,0.9,z); stem.rotation.z=-0.12; g.add(stem);
  for(let i=0;i<4;i++){
    const leaf = mesh('cone',[0.045,0.22,4], emat(0xdff4ff,0x9fd8e8,0.4));
    const s = (i%2)?1:-1;
    leaf.position.set(x+0.5+s*0.09, 0.78+i*0.09, z); leaf.rotation.z = s*1.15; g.add(leaf);
  }
  return g;
}

function buildW8L2(G){
  const S = G.scene;
  levelBegin(G);

  const ROCK = W8PAL.rock;                  // amethyst-dark mine stone underfoot
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE LAMP ROOM (x -8..20) ===============================
  groundX(G, -8, 50, ROCK);                 // one solid run to the first chasm's lip at 50
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  // SPAWN SAFETY (idle player at x0/z0, CP0 respawn at x2/z1.6): nearest FIXED threats — Rubblekin #1 home
  // 30, worst reach wakeR5+4 = 21 (19u clear) · Bat #1 home 33: trigger min 33-2.5-4.5 = 26, post-dive
  // drift -2 → 24 (22u) · the intro line's buckets never dip below y3.0 and never west of x23.3 · Moth #1
  // west edge 56 · drill #1 zone starts 74.1 · no knocker/mimic/boo/cart/boulder lane exists west of x79 ·
  // the geode at x11 is opt-in (its ambush ring spawns at ±2.6 with the kit's 1s grace). All clear.
  signPost(G, 5.5, 1.7, -0.12, "THE ORE LINES. The buckets never stopped hauling. Board at a pylon, ride the LOW cable, and step off before the wheel - the line doesn't stop. Neither did the shift.");
  candyLine(G, [[5,0.9,0],[7,0.9,0],[9,0.9,0]], 3);
  // THE GLIMMERING GEODE — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math, all
  // distances from x11): Rubblekin #1 waddle reach = wakeR+4 → 21 (10.0u clear, >=6u law honored) · Bat #1
  // trigger+drift reach 24 (13u) · Gem Mimic snap reach = wake edge+3.4 → nearest mimic 158.9-6.0 = 152.9
  // (141.9u) · knocker bursts live at x84/94 and can't touch the floor anyway · drills >=74.1 (63.1u) ·
  // moths, boo, lines: all east of 47. Opening is a deliberate, safe act; the mimic-nest ambush spawns on
  // the kit's fixed ring with 1s spawnGrace.
  { const gd = new GlimmeringGeode(11, 0, -0.9, 0.25); G.coffins.push(gd); G.ents.add(gd); }
  // THE QUIET PROP (never signposted): the fallen bucket on its snapped cable, iced over, growing a fern
  deco.add(w8l2FallenBucket(16.2, -2.4));
  G.ents.add(new Crow(17.5, 0.95, 2.1));    // mine crow #1 — flaps off when neared
  deco.add(w8TimberFrame(3, 3.4));
  deco.add(w8CrystalCluster(7.2, -1.6, 0.8));
  deco.add(w8CrystalCluster(13.8, 1.3, 0.6, W8PAL.crysA));

  // =============================== BEAT 2 — THE FIRST HAUL (x 20..44): INTRODUCE the line ===============================
  // A short line over safe floor: learn to board (scaffold at the near pylon — every boarding in the level
  // repeats this shape), ride, and dismount before the far wheel. Bucket tops ride at y3.22; the boarding
  // platform tops at 2.2 (a 1.02u tap, over-clearance law); platform east edge sits 1.1u shy of the pylon
  // so a descending bucket can never squash a waiting player. Buckets pass every 7.5s.
  platform(G, 20.6, 1.1, 0, 1.4, 1.7, W8PAL.timber);          // step (rise 1.1)
  platform(G, 22.1, 2.2, 0, 1.6, 1.7, W8PAL.timber);          // boarding deck (rise 1.1)
  candyLine(G, [[20.8,1.7,0],[22.2,2.9,0]], 2);
  w8BucketLine(G, {x0:24, x1:44, y:3.0, n:3, speed:2.0});
  candyLine(G, [[28,4.1,0],[33,4.1,0],[38,4.1,0]], 3);        // the ride line...
  candyLine(G, [[29,0.9,0],[34,0.9,0],[39,0.9,0]], 3);        // ...and the floor line — each visible from the other (the junction itch)
  // the floor has opinions: a rubble pile that stands up (0.7s assembly telegraph) + the cave bat's
  // squeak-telegraphed snapshot dive — both routes stay honest, neither stacks past 2 systems.
  G.ents.add(new Rubblekin(G, 30, 0, 0, {phase:0.4, wakeR:5, speed:1.6, lobP:3.4}));
  G.ents.add(new BlizzardBat(G, 33, 4.8, 0, {phase:0.7, range:2.5, period:3.6, aggroR:4.5}));
  deco.add(w8TimberFrame(40.5, 3.8));
  deco.add(w8CrystalCluster(36.5, 1.4, 0.7, W8PAL.crysC));

  // =============================== BEAT 3 — THE LONG HAUL (x 44..70): TWIST — hop the line ===============================
  // 9 buckets on one loop (span 20, Pm 45.03, speed 2.0): bottom-run spacing a FIXED 5.0u (offset phases,
  // one clock — the gap between buckets never changes because they share a speed). Stay aboard and the
  // line carries you over the chasm in 10 slow seconds; hop bucket-to-bucket (5.0u held jumps, law 5.5)
  // and you cross in three. Moth #1 figure-eights the mid-span (x56..62, y3.9..6.1) — duck it by hopping
  // a bucket forward or back, or time your boarding. Buckets pass the pylon every 2.5s: no waiting here.
  signPost(G, 43.2, 1.7, 0.1, "The long haul. A slow bucket never made quota - the old haulers HOPPED THE LINE, bucket to bucket, mid-air. Management disapproved. Management is gone.");
  platform(G, 44.6, 1.2, 0, 1.4, 1.7, W8PAL.timber);
  platform(G, 46.1, 2.4, 0, 1.6, 1.7, W8PAL.timber);
  candyLine(G, [[44.7,1.8,0],[46.2,3.1,0]], 2);
  w8BucketLine(G, {x0:48, x1:68, y:3.2, n:9, speed:2.0});
  pitDressing(G, 50, 66, 'winter');                            // the chasm shows its teeth (heart + walk-back, never a cheap kill)
  candyLine(G, [[52,4.0,0],[57,4.0,0],[62,4.0,0],[66.5,4.0,0]], 4);
  G.ents.add(new CrystalMoth(G, 59, 5.0, 0, {phase:0.8, rx:3, ry:1.1, period:5.2, color:0x7ae8ff}));
  candyLine(G, [[67.5,0.9,0],[69,0.9,0]], 2);
  G.ents.add(new Crow(69.2, 0.95, 2.3));    // mine crow #2 — on the far lip, unimpressed by your hop count
  deco.add(w8CrystalCluster(67.2, -1.8, 0.7, W8PAL.crysV));

  // =============================== BEAT 4 — THE KNOCKING TUNNEL (x 70..100): ESCALATE ===============================
  groundX(G, 66, 118, ROCK);                // twist landing + tunnel floor + lantern landing + yard boarding
  signPost(G, 69.4, 1.7, -0.1, "TUNNEL RULES: when the rock knocks three times, be somewhere else. The drills never look up - the floor is theirs, the cable is yours. Pick your lane, and keep picking.");
  platform(G, 70.6, 1.3, 0, 1.4, 1.7, W8PAL.timber);
  platform(G, 72.1, 2.6, 0, 1.6, 1.7, W8PAL.timber);
  candyLine(G, [[70.7,1.9,0],[72.2,3.3,0]], 2);
  w8BucketLine(G, {x0:74, x1:100, y:3.4, n:4, speed:2.2});     // pass interval 6.48s — the tunnel's master clock
  // THE ROCK BROWS — overhangs the knockers live in (baked; underside 4.42..top 4.9 threads the gap between
  // the hang rods (4.375) and the top-run buckets (5.15+); z -1.5..0 keeps the camera-side lane plane clear
  // of the rider's head; no collider — nothing on the main route bonks a head)
  for(const [bx,bw] of [[81.75,5.5],[91.75,5.5]]){
    const brow = mesh('box',[bw,0.48,1.5], mat(W8PAL.rockD)); brow.position.set(bx, 4.66, -0.75); deco.add(brow);
    const lip2 = mesh('box',[bw+0.4,0.18,1.6], mat(W8PAL.rockL)); lip2.position.set(bx, 4.96, -0.75); deco.add(lip2);
  }
  // KNOCKER SPRITES — tap... tap... TAP (0.9s audible telegraph), then the burst at the glide's end.
  // wallY 4.42 = the brow underside (the bump bulges along the face); bite band y (3.22, 5.17) holds a
  // standing rider (feet 3.62, head 4.82) with margin and can never touch the floor. Periods equal the
  // bucket-pass interval: every bucket meets every brow at the same phase, forever — so both clocks are
  // pinned cull=false (see the header's TUNNEL PHASE-LOCK note).
  { const k1 = new KnockerSprite(G, 79, 4.42, 0, {phase:2.78, x0:79, x1:84, wallY:4.42, period:6.48});   // #1 — COLD on every crossing: the burst punches air 4.3u ahead of each arriving bucket (the teach)
    k1.cull = false; G.ents.add(k1); }
  { const k2 = new KnockerSprite(G, 89, 4.42, 0, {phase:3.18, x0:89, x1:94, wallY:4.42, period:6.48});   // #2 — HOT on every crossing: bail, take the floor, or jump the burst (the exam)
    k2.cull = false; G.ents.add(k2); }
  // THE DRILLS — floor lanes on fixed shuttle clocks; damage band y<1.4 only (riders untouchable)
  w8Drill(G, {x0:75, x1:82,   y:0.7, period:5.0, phase:0.0});
  w8Drill(G, {x0:89.5, x1:96.5, y:0.7, period:5.0, phase:2.5});
  // THE BAIL POCKET (x83.7..87.8 — clear of both drill zones: #1 east reach 83.7, #2 west reach 87.8):
  // the marked safe floor between the brows, with the mid scaffold to re-board (rise 1.3+1.3, hop 1.02)
  platform(G, 84.8, 1.3, 0, 1.4, 1.7, W8PAL.timber);
  platform(G, 86.4, 2.6, 0, 1.6, 1.7, W8PAL.timber);
  candyLine(G, [[85,0.9,0],[86.6,0.9,0]], 2);
  candyLine(G, [[78,4.3,0],[86,4.3,0]], 2);                    // the ride line, clear of both burst zones
  candyLine(G, [[78.5,0.9,0],[91.5,0.9,0],[95.5,0.9,0]], 3);   // the floor rhythm through the drill lanes
  G.ents.add(new Candy(99, 1.2, 0));                           // the dismount marker, past drill #2's reach (98.2) — single candy (candyLine needs ≥2 pts/n)
  // RUBBLEKIN #2 — floor pressure through the east half (home 90: wake band 85..95, worst waddle reach
  // 81..99 — 3.0u shy of the lantern; floor runners face it + drill #2 = 2 systems, riders face knocker #2
  // = 1; the tunnel never exceeds 3 anywhere)
  G.ents.add(new Rubblekin(G, 90, 0, 0, {phase:1.1, wakeR:5, speed:1.7, lobP:3.0}));
  deco.add(w8TimberFrame(76.5, 3.9)); deco.add(w8TimberFrame(97.5, 3.9));

  // =============================== BEAT 5 — THE LANTERN LANDING (x 100..110): the breath ===============================
  // THE lantern — the level's ONE lit checkpoint (x102 of a 210u run ≈ 52%). Rest-pocket ledger, idle
  // player at x102/z1.6: drill #2 east reach 98.2 (3.8u — and its bite needs |z|<0.9 besides) · knocker
  // burst zones end at 94.66 and can never touch a grounded player · Rubblekin #2 worst reach 99 (3.0u;
  // its wake needs px<=95, so a lantern-camper never wakes it) · Bat #2 trigger min 113-2-4.5 = 106.5,
  // post-dive drift -2 → 104.5 (2.5u past its OWN trigger floor — an idle player at 102 never triggers
  // it in the first place; the dive threatens only walkers already committed east) · Gem Mimic worst
  // reach 152.9 · Moth #2 west edge 134.6 · Boo leash west edge 160 · the tunnel line's far wheel (x100)
  // keeps its buckets at y>=3.4 · no cart routes or boulder lanes exist in this level. A true breath.
  G.ents.add(new Checkpoint(102, 0, 1.6, 1));
  G.ents.add(new Heart(100.6, 1.0, 0));
  G.ents.add(new BonkLantern(G, 103.9, 1.5, 0, 'shield'));     // armor before the exam's second page
  candyLine(G, [[100.6,0.9,0],[103,0.9,0]], 2);
  signPost(G, 105.4, 1.7, 0.1, "THE TRANSFER YARD. Line A ends over the dark. Line B drops in beside you and rides high to the far landing. Follow the lamplit candy, and JUMP TWICE.");
  deco.add(w8TimberFrame(108.5, 3.6));
  deco.add(w8CrystalCluster(109.3, 1.1, 0.7));

  // =============================== BEAT 6 — THE TRANSFER YARD (x 110..158): MASTER ===============================
  // The chained set-piece (see THE YARD MATH in the header): equal spans + equal speeds + one shared
  // world clock = a transfer window that announces itself every 8.03s. Line A's far pylon stands mid-void
  // (staying aboard past it just loops you home along the top run — a missed window costs time, never a
  // heart). The rise A-top → B-top is 2.6u: the level's one double-jump gate, candy-arc traced.
  platform(G, 112.3, 1.6, 0, 1.6, 1.7, W8PAL.timber);          // rise 1.6
  platform(G, 114.1, 3.2, 0, 1.6, 1.7, W8PAL.timber);          // rise 1.6 (law 2.2)
  candyLine(G, [[112.4,2.2,0],[114.2,3.9,0]], 2);
  w8BucketLine(G, {x0:116, x1:140, y:4.0, n:3, speed:2.2});    // LINE A — the low haul
  w8BucketLine(G, {x0:134, x1:158, y:6.6, n:3, speed:2.2});    // LINE B — the high finish (shared clock)
  pitDressing(G, 118, 156, 'winter');
  // old ore-pillars shoulder the mid-chasm pylons (deco, z-1.1 — the yard didn't build on air)
  for(const px of [134, 140]){
    const pillar = mesh('box',[1.7,4.4,1.9], mat(W8PAL.rockD)); pillar.position.set(px, -2.2, -1.1); deco.add(pillar);
    const cap2 = mesh('box',[2.1,0.3,2.1], mat(W8PAL.rockL)); cap2.position.set(px, -0.05, -1.1); deco.add(cap2);
  }
  candyLine(G, [[122,5.0,0],[128,5.0,0]], 2);                  // the A ride
  candyLine(G, [[136.6,5.4,0],[137.5,6.3,0],[138.4,7.1,0]], 3); // THE TRANSFER ARC — the lamplit candy (double-jump trace, rise 2.6)
  candyLine(G, [[146,7.6,0],[152,7.6,0]], 2);                  // the B ride home
  // BAT #2 — owns the boarding airspace (patrol 113..117 at y5.6): dodge dives while you time the climb.
  // Its trigger floor (106.5) and worst drift (104.5) both sit east of the lantern's rest pocket.
  G.ents.add(new BlizzardBat(G, 115, 5.6, 0, {phase:1.5, range:2, period:3.8, aggroR:4.5}));
  // MOTH #2 — patrols the transfer air (x134.6..139.4, y7.6..9.6): it grazes the top of the double-jump
  // and dips at B riders' heads — watch its slow eight, then go. One threat system in the air, ever.
  G.ents.add(new CrystalMoth(G, 137, 8.6, 0, {phase:2.1, rx:2.4, ry:1.0, period:6.0, color:0xb08aff}));

  // =============================== BEAT 7 — THE ARRIVAL (x 156..176): trust no treasure ===============================
  groundX(G, 156, 176, ROCK);
  // GEM MIMICS among REAL crystal decoys — same colors, same clusters, until one GLINTS and rattles (0.6s)
  // and hops. The crow stares at them (the house trap-tell); the honest candy sits between the clusters.
  // Mimic #1 (violet, x158.9) worst reach 165.5; #2 (cyan, x161.2) worst reach 167.2 — the chain (167.8)
  // and boarding scaffold (171.7+) stay clear of both.
  deco.add(w8CrystalCluster(157.4, -0.6, 0.75, W8PAL.crysV));
  deco.add(w8CrystalCluster(158.2, 0.9, 0.6, W8PAL.crysV));
  deco.add(w8CrystalCluster(159.7, -1.1, 0.7, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 158.9, 0, 0.15, {phase:0.3, color:0xb08aff}));
  deco.add(w8CrystalCluster(160.3, 0.7, 0.65, W8PAL.crysC));
  deco.add(w8CrystalCluster(162.2, -0.9, 0.75, W8PAL.crysC));
  deco.add(w8CrystalCluster(163.1, 0.6, 0.55, W8PAL.crysC));
  G.ents.add(new GemMimic(G, 161.2, 0, -0.2, {phase:1.2, color:0x7ae8ff}));
  candyLine(G, [[157.6,0.9,0],[160.4,0.9,0]], 2);
  G.ents.add(new Crow(159.8, 0.95, 2.4));   // mine crow #3 — staring hard at the crystals. Observation is the counter-skill.
  // SNOW-BOO #1 — drifts the walk-up (home 165, leashed to 160..170): stare it into a solid ice block for
  // a breather, or pop it. The mines' cold spirits kept ONE cemetery habit.
  { const boo = new SnowBoo(G, 165, 0, 0, {phase:0.6, speed:2.0, range:9, freezeMax:2.4}); boo.chaseR = 5; G.ents.add(boo); }
  // THE INSPECTION CHAIN — the district's climb flavor: up to the old lookout perch. From it you watch the
  // last line's far wheel turn... and the purple-lantern bucket ride up, over, and back, never unloading.
  // (The sightline is the warp's only teacher. The climb-exit boosted hop lands the perch.)
  deco.add(w8TimberFrame(167.8, 5.0));
  w5Chain(G, 167.8, 0, 4.6);
  platform(G, 169.3, 4.2, 0, 1.6, 1.7, W8PAL.timber);
  candyLine(G, [[169,5.0,0],[169.7,5.0,0]], 2);

  // =============================== BEAT 8 — THE OFF-LIMITS LINE (x 176..202): exhale + the legend ===============================
  // The confidence-lap crossing: a short line over the last pit — any bucket carries you across; hop off
  // at the far lip like always. Bucket #0 wears the lone PURPLE LANTERN (the district tell, never
  // explained): stay aboard past the far pylon and the old line remembers its secret station — the warp
  // to the gate, full candy bonus, once per run. THE DISTRICT WARP lives here (8-2's Old Shortcut).
  platform(G, 171.7, 1.1, 0, 1.4, 1.7, W8PAL.timber);
  platform(G, 173.1, 2.2, 0, 1.6, 1.7, W8PAL.timber);
  candyLine(G, [[171.8,1.8,0],[173.2,3.0,0]], 2);
  w8BucketLine(G, {x0:175, x1:188, y:3.0, n:3, speed:2.0, warpX:190.5, candy:40});
  pitDressing(G, 176, 184, 'winter');       // the pit ends where the far shore's ground begins (no bed under solid floor)
  candyLine(G, [[179,3.9,0],[182.5,3.9,0],[186.5,1.2,0]], 3);
  groundX(G, 184, 202, ROCK);
  signPost(G, 189.3, 1.7, -0.1, "End of the line. The buckets clock out, swing round, and start the haul again. Nobody ever told them to stop. Nobody ever will.");
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(191.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 193);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  deco.add(w8TimberFrame(190.5, 3.6));
  deco.add(w8CrystalCluster(172.5, -1.5, 0.65, W8PAL.crysA));
  deco.add(w8CrystalCluster(187.6, 1.2, 0.7, W8PAL.crysV));
  deco.add(w8CrystalCluster(196.5, -1.2, 0.8, W8PAL.crysC));
  // FOREGROUND silhouettes (z>0): stalagmite teeth framing the depth
  for(const [fx,fh] of [[30,1.6],[75,1.3],[112,1.7],[163,1.4],[195,1.6]]){
    const st = mesh('cone',[0.8,fh,5], mat(0x121c34)); st.position.set(fx, fh*0.35, 2.7); deco.add(st);
  }
  S.add(bakeGroup(deco));

  w8Parallax(S, -8, 202);
  w8LevelFinish(G, -8, 202, null);          // null clutter: the chasms must stay bare (baked props can't float over the void — w7l4 precedent)
  w8Clutter(G, -8, 49.5, 'mine');           // ...so the solid spans are cluttered manually
  w8Clutter(G, 66.5, 117.5, 'mine');
  w8Clutter(G, 156.5, 175.5, 'mine');
  w8Clutter(G, 186.5, 201, 'mine');

  return {spawnX: 0, exitX: 193};
}

function updateW8L2(G, dt){
  updateLevelCommon(G, dt);
}

W8_LEVELS.push({id:'w8l2', district:'w8', name:'THE ORE LINES', build:buildW8L2, update:updateW8L2, parTime:210});

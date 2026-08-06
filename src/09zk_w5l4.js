// ============ LEVEL 5-4 — THE PENDULUM RAMPARTS (District 5 · The Cursed Castle) ============
// District 5's VERTICAL, climb-centric level: Pip scales the outer face of Grimm's clock-tower on the
// swaying CLOCK-CHAINS (w5Chain — press UP to grab, JUMP to leap off with a boost) while the great
// PENDULUM BLADES sweep the ramparts on their fixed, learnable clocks. The signature verb is the chain
// climb; the signature hazard is the blade you time — you climb when the blade swings AWAY, and leap the
// gaps between its passes. Branching strands give route choice (a safe left rope · a candy+Heart high road
// past a blade · a tucked purple-lit ALCOVE hiding this district's Old Shortcut). This is the mastery tier:
// three lanes always busy (armored Clockwork Knights that BOW before they lunge · Mirror Boos drifting the
// wrong way through the air over the climb · Shadow-Copies chasing up the strands · the pendulum blades),
// every element on a deterministic clock and telegraphed ~0.7s ahead.
//   BEAT 1 THE GATEHOUSE (INTRODUCE)     x -8..24  — courtyard ground: a Clockwork Knight to learn the bow,
//          then the FIRST clock-chain up (safe — falls here land back on the courtyard stone).
//   BEAT 2 THE FIRST STRANDS (INTRODUCE) x 24..49  — learn the chain + the first pendulum blade over a ledge;
//          climb strand B up to the ramparts proper. Mirror Boo over the air lane.
//   BEAT 3 THE BRANCHING ASCENT (TWIST)  x 47..68  — a tucked ALCOVE up a side-chain (the purple-lit Old
//          Shortcut), a blade-guarded strand, then a WIDE ledge with CP1 and a Heart high-road branch.
//   BEAT 4 THE GIFT & THE CLIMB (ESCALATE) x 68..88 — GrimmGift gamble in a CLEAR pocket, a Knight on the
//          pre-summit ledge, the tallest chain up to the parapet.
//   BEAT 5 THE HIGH RAMPARTS (PEAK)      x 88..105 — the summit parapet: a big pendulum-blade gauntlet, a
//          Mirror Boo, a mercy Heart, and the QUIET PROP — a bronze bell with no clapper, roped off.
//   BEAT 6 THE LONG DROP (MASTER)        x 105..134 — descend the inner steps & a gear-cog under a chasing
//          Shadow-Copy and a blade swinging over a gap; back down toward the courtyard floor.
//   BEAT 7 THE INNER STAIR (finish)      x 134..168 — a short courtyard run to the keep gate; boss foreshadow.
// Reads UNMISTAKABLY Cursed Castle: W5PAL gunmetal masonry, verdigris brass cogs, shadow-purple ghosts, an
// ember-glow accent, a stopped clock-tower skyline with a giant cracked clock-face, drifting clock-soot,
// background clock-pendulums swaying, cog-scrap clutter. Comparable heights throughout (tap 1.8 / held 2.6 /
// double 3.3; every big rise is a GATED chain climb; gaps <=4). Deterministic to the cog — fixed placements,
// fixed blade/gear/warp clocks; seeded rand() only inside baked cosmetic deco. No Math.random on the crit path.

// ---- module state: the live background clock-pendulums (cosmetic castle micro-motion, ticked in updateW5L4) ----
let W5L4_pends = [];

// ---- the QUIET PROP: a bronze bell with NO clapper, roped off on the parapet. Grimm stopped every clock at
// midnight; this bell will never ring it again. Unsignposted — story-readers feel it, everyone else climbs past.
function w5l4Bell(x, y, z){
  const g = new THREE.Group();
  const bronze = mat(W5PAL.brass), bronzeD = mat(W5PAL.brassD);
  for(const sx of [-0.7,0.7]){ const post=mesh('box',[0.12,1.15,0.12], mat(W5PAL.stoneD)); post.position.set(sx,0.57,0); g.add(post); }
  const beam = mesh('box',[1.7,0.14,0.14], mat(W5PAL.steelD)); beam.position.set(0,1.12,0); g.add(beam);
  const yoke = mesh('cyl',[0.05,0.05,0.24,5], mat(W5PAL.steelD)); yoke.position.set(0,0.98,0); g.add(yoke);
  const dome = mesh('cone',[0.5,0.82,12], bronze); dome.position.set(0,0.62,0); g.add(dome);
  const lip  = mesh('cyl',[0.5,0.42,0.16,12], bronzeD); lip.position.set(0,0.2,0); g.add(lip);
  const crown= mesh('sph',[0.12,8,7], bronzeD); crown.position.set(0,1.02,0); g.add(crown);
  // (deliberately NO clapper inside — it will never ring midnight)
  for(const sx of [-1.45,1.45]){ const st=mesh('cyl',[0.06,0.07,0.72,6], bronzeD); st.position.set(sx,0.36,0.42); g.add(st); const ball=mesh('sph',[0.08,7,6], bronze); ball.position.set(sx,0.74,0.42); g.add(ball); }
  const cord = mesh('cyl',[0.03,0.03,2.9,5], emat(W5PAL.shadowP,W5PAL.shadowP,0.4)); cord.rotation.z=Math.PI/2; cord.position.set(0,0.5,0.42); crook(cord,0.06); g.add(cord);
  g.position.set(x,y,z);
  return g;
}

// ---- a live background clock-pendulum: swings on the game clock (deterministic), pure castle deco (z<0, not a
// hazard — the real hazards are PendulumBlade entities). Pivot at the group origin so rotation.z reads as a swing.
function w5l4BgPendulum(G, x, pivotY, len, amp, period, phase){
  const g = new THREE.Group(); g.position.set(x, pivotY, -6.5);
  const rod = mesh('cyl',[0.05,0.06,len,6], mat(0x14121e)); rod.position.y=-len/2; g.add(rod);
  const bob = mesh('sph',[0.42,10,8], emat(W5PAL.brassD, W5PAL.ember, 0.14)); bob.position.y=-len; g.add(bob);
  G.scene.add(g);
  W5L4_pends.push({g, amp, period, phase});
}

function buildW5L4(G){
  const S = G.scene;
  levelBegin(G);
  W5L4_pends = [];

  // palette handles for this course
  const STONE  = W5PAL.stone;     // masonry gunmetal (ground + main ledges)
  const STONEL = W5PAL.stoneL;    // lighter masonry (landing ledges — the read for "step here")
  const STONED = W5PAL.stoneD;    // dark masonry (the tucked alcove — a subtle "special" tell)

  const deco = new THREE.Group(); // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE GATEHOUSE (x -8..24): INTRODUCE ===============================
  // ground extends to x32 so the FIRST-chain mistakes land safely on the courtyard (gentle even in the mastery tier)
  groundX(G, -8, 32, STONE);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "THE PENDULUM RAMPARTS. Grimm's tower stopped at midnight. Climb the clock-chains to the top - press UP to grab a chain, JUMP to leap off with a boost. Time the swinging blades: climb when the blade swings AWAY.");
  G.ents.add(new ClockworkKnight(G, 13, 0, 0, {phase:0, range:2.6, dir:-1, candy:4}));  // learn the courtly BOW telegraph
  G.ents.add(new Crow(9, 0.95, 2.4));                                  // reactive courtyard critter
  candyLine(G, [[6,0.9,0],[8,0.9,0]], 3); candyLine(G, [[16,0.9,0],[18,0.9,0]], 3);
  signPost(G, 21, 1.7, 0.12, "The first clock-chain. Up you go - and mind the blades on the ramparts above.");
  w5Chain(G, 22.4, 0.2, 7.2);                                         // CHAIN A — ground -> the ramparts (sits LEFT of A1's edge with body clearance, tops ABOVE it so you climb into open air and hop right onto the deck — never under the slab)
  candyLine(G, [[22.4,2,0],[22.4,3.5,0],[22.4,5,0]], 3);              // rhythm candy up the strand

  // =============================== BEAT 2 — THE FIRST STRANDS (x 24..49): INTRODUCE the blade ===============================
  platform(G, 27, 6.5, 0, 8, 3, STONEL);                             // LEDGE A1 (top 6.5, spans 23..31) — pop off CHAIN A
  G.ents.add(new PendulumBlade(G, 28.5, 11, {len:4, amp:0.9, period:2.6, phase:0, r:0.55}));  // blade #1 over the ledge (safe landing at x24)
  candyLine(G, [[25,7.2,0],[26.5,7.2,0]], 2);                        // safe entry candy, left of the blade
  G.ents.add(new MirrorBoo(G, 32, 9.5, 0, {phase:0, range:3.5, mirror:0.85, candy:3}));  // air lane over the climb
  platform(G, 35, 7.2, 0, 5, 3, STONE);                             // LEDGE A2 (top 7.2, spans 32.5..37.5)
  candyLine(G, [[31,7.6,0],[33,7.8,0]], 2);                          // trace the A1->A2 hop
  w5Chain(G, 38.7, 6.7, 14.0);                                       // CHAIN B — the big climb (grab from A2's right edge; sits just LEFT of B1 and tops ABOVE it, so you pop out onto the deck instead of stalling under the slab)
  candyLine(G, [[38.7,8,0],[38.7,9.5,0],[38.7,11,0],[38.7,12.7,0]], 4);  // rhythm candy up the strand
  platform(G, 43.5, 13.2, 0, 8, 3.2, STONEL);                       // LEDGE B1 (top 13.2, spans 39.5..47.5)
  G.ents.add(new ClockworkKnight(G, 44, 13.2, 0, {phase:0.5, range:2, dir:1, candy:4}));  // Knight #2 on the ledge
  candyLine(G, [[45.5,14,0],[46.5,14,0]], 2);

  // =============================== BEAT 3 — THE BRANCHING ASCENT (x 47..68): TWIST + the ALCOVE + CP1 ===============================
  // THE OLD SHORTCUT (off the rightward flow): a side clock-chain up to a dark alcove holding the MIDNIGHT CLOCK.
  // Its lone PURPLE lantern-glow (the district's warp language) is the only tell — never signposted. Skill gate:
  // hit the MINUTE gear (jump-spin, upper-left) THEN the HOUR gear (spin, lower-right) in order -> the face swings
  // open and warps to the keep gate with the full candy bonus. Hour-first does nothing — the two-step order is the gate.
  w5Chain(G, 44.9, 13, 18.7);                                        // CHAIN E — the alcove access (grab standing on B1; sits LEFT of the ALCOVE with body clearance, tops above it -> clean pop-out)
  candyLine(G, [[44.9,14.5,0],[44.9,16,0],[44.9,17.5,0]], 3);        // a quiet candy lure up, for the observant
  platform(G, 47.5, 18, 0, 4, 3, STONED);                           // the tucked ALCOVE ledge (dark stone = a subtle tell)
  G.ents.add(new MidnightClock(G, 47.5, 20, {warpX:155, candy:40})); // the OLD SHORTCUT warp (minute-then-hour)

  // the main way forward: a blade-guarded strand-ledge, then the wide checkpoint terrace
  platform(G, 52, 13.6, 0, 6, 3, STONE);                            // LEDGE B2 (top 13.6, spans 49..55)
  G.ents.add(new PendulumBlade(G, 53, 18.5, {len:3.6, amp:0.85, period:2.4, phase:1.2, r:0.6}));  // blade #2 over the strand-ledge
  candyLine(G, [[50,14.3,0],[54,14.3,0]], 2);
  G.ents.add(new ShadowCopy(G, 56, 13.6, 0, {phase:0, speed:2.4, candy:2}));  // Shadow-Copy chases up the strand
  gearPlat(G, 58, 15.2, {w:2.8, d:3});                              // a brass cog step (top 15.2)
  candyLine(G, [[55.5,14.6,0],[57,15.2,0]], 2);
  w5Chain(G, 59.4, 14.5, 21.2);                                      // CHAIN C — up to the checkpoint terrace (grab from the cog@58; sits LEFT of TERRACE C1 with body clearance, tops above it -> pop out onto the terrace)
  candyLine(G, [[59.4,16,0],[59.4,17.5,0],[59.4,19,0]], 3);
  platform(G, 64, 20.5, 0, 8, 3.4, STONE);                          // WIDE TERRACE C1 (top 20.5, spans 60..68)
  G.ents.add(new Checkpoint(64, 20.5, 1.8, 1));                      // CP1 — the one lit mid-level checkpoint
  G.ents.add(new MirrorBoo(G, 66, 22.5, 0, {phase:0.4, range:3.5, mirror:0.85, candy:3}));
  // HIGH ROAD branch (visible from the terrace): a cog up to a Heart, then drop onto the gift ledge
  gearPlat(G, 70, 22, {w:2.6, d:3});                                // brass cog (top 22) — the branch step
  G.ents.add(new Heart(70, 23.4, 0));                               // the high-road reward, in sight of the low road
  candyLine(G, [[68.5,21.3,0],[70,22.7,0]], 2);

  // =============================== BEAT 4 — THE GIFT & THE CLIMB (x 68..88): ESCALATE ===============================
  // THE GAMBLE in a CLEAR pocket (owner's clear-patch law): no enemy patrol/diver base within ~6u of the gift x.
  // Nearest threats are Mirror Boo (home x66, and it drifts AWAY as you approach) and Knight #3 (x82) — both >=6u.
  platform(G, 74, 20.5, 0, 7, 3.4, STONEL);                        // GIFT LEDGE (top 20.5, spans 70.5..77.5)
  { const gift = new GrimmGift(74, 20.5, 0, 0); G.coffins.push(gift); G.ents.add(gift); }
  candyLine(G, [[71.5,21.3,0],[76.5,21.3,0]], 3);
  platform(G, 83, 22, 0, 5, 3, STONE);                             // PRE-SUMMIT LEDGE M (top 22, spans 80.5..85.5)
  G.ents.add(new ClockworkKnight(G, 82, 22, 0, {phase:0.8, range:2, dir:-1, candy:4}));  // Knight #3
  G.ents.add(new BonkLantern(G, 83, 24, 0, 'shield'));             // a Gummy Shield before the parapet gauntlet (route reward)
  candyLine(G, [[81,22.8,0],[84,22.8,0]], 2);
  w5Chain(G, 87.3, 21.5, 25.2);                                     // CHAIN D — the tallest strand (grab from LEDGE M; sits just LEFT of the parapet, tops above it -> pop out onto the parapet at x88, the blade's safe side)
  candyLine(G, [[87.3,23,0],[87.3,24,0]], 2);

  // =============================== BEAT 5 — THE HIGH RAMPARTS (x 88..105): PEAK — the blade gauntlet ===============================
  platform(G, 93, 24.5, 0, 10, 3.4, STONE);                        // THE PARAPET (top 24.5, spans 88..98) — pop off CHAIN D at the left
  G.ents.add(new PendulumBlade(G, 94, 29.5, {len:4.5, amp:0.85, period:2.4, phase:0, r:0.6}));  // blade #3 — the rampart gauntlet (safe landing left at x88-90)
  G.ents.add(new Heart(95, 25.8, 0));                              // mercy Heart under the swing — reward for timing it
  candyLine(G, [[89.5,25.3,0],[91,25.3,0]], 2); candyLine(G, [[96,25.3,0],[97.5,25.3,0]], 2);
  G.ents.add(new MirrorBoo(G, 99, 26.5, 0, {phase:0.2, range:4, mirror:0.85, candy:3}));  // air at the parapet's far end
  platform(G, 102, 24.5, 0, 6, 3, STONEL);                         // PARAPET WALK (top 24.5, spans 99..105)

  // =============================== BEAT 6 — THE LONG DROP (x 105..134): MASTER — descend under pressure ===============================
  platform(G, 109, 21, 0, 5, 3, STONE);                            // step 1 (top 21, spans 106.5..111.5) — drop off the parapet
  G.ents.add(new ShadowCopy(G, 112, 21, 0, {phase:0, speed:2.6, candy:2}));  // a Shadow-Copy chases you down
  candyLine(G, [[106.5,21.7,0],[110,21.7,0]], 3);
  gearPlat(G, 115, 17.5, {w:2.8, d:3});                            // a brass cog step down (top 17.5)
  G.ents.add(new PendulumBlade(G, 119, 18.5, {len:4.5, amp:0.8, period:2.2, phase:0.6, r:0.6}));  // blade #4 swings over the drop-gap
  platform(G, 122, 14, 0, 5, 3, STONEL);                           // step 3 (top 14, spans 119.5..124.5)
  candyLine(G, [[112,17.8,0],[115,17.7,0]], 2); candyLine(G, [[118,14.6,0],[121,14.4,0]], 2);
  platform(G, 129, 10, 0, 5, 3, STONE);                            // step 4 (top 10, spans 126.5..131.5)
  platform(G, 136, 5.5, 0, 5, 3, STONEL);                          // step 5 (top 5.5, spans 133.5..138.5) — last step to the floor
  candyLine(G, [[128,10.7,0],[131,10.3,0]], 2); candyLine(G, [[135,6.2,0],[137,6,0]], 2);

  // =============================== BEAT 7 — THE INNER STAIR (x 134..168): finish ===============================
  groundX(G, 134, 168, STONE);
  signPost(G, 142, 1.7, -0.1, "THE KEEP'S INNER STAIR. You climbed the ramparts and read the blades' rhythm - the throne room is close now, and Grimm's brew with it. Through here.");
  G.ents.add(new Crow(148, 0.95, 2.4));                            // second reactive critter on the run-out
  candyLine(G, [[140,0.9,0],[143,0.9,0]], 3); candyLine(G, [[150,0.9,0],[152,0.9,0]], 3);
  exitGate(G, 160);                                                // (the MidnightClock warp lands at x155, a short run-in)

  // =============================== DECO · TOWER FACE · MOON · PARALLAX ===============================
  // the tower wall the climb clings to (baked, z<0): dark masonry panels with stopped clock-faces set into them
  { const wall = new THREE.Group();
    for(let x=18; x<=104; x+=22){ const panel=mesh('box',[16,30,2], mat(W5PAL.stoneD)); panel.position.set(x,12,-7); wall.add(panel);
      const band=mesh('box',[16,0.6,2.1], mat(W5PAL.steelD)); band.position.set(x,22,-6.9); wall.add(band); }
    deco.add(wall); }
  deco.add(clockFaceDeco(24, 9,  -6, 1.4));
  deco.add(clockFaceDeco(56, 17, -6, 1.2));
  deco.add(clockFaceDeco(90, 20, -6, 1.5));
  // hanging chandeliers over the ramparts (baked, static — the live micro-motion is the bg pendulums below)
  deco.add(chandelier(52, 20, -1.2, 1.0));
  deco.add(chandelier(93, 30.5, -1.2, 1.1));
  // broken pillars framing the two courtyards
  deco.add(brokenPillar(-4, -4, 1.4)); deco.add(brokenPillar(29, -4, 1.1));
  deco.add(brokenPillar(140, -4, 1.3)); deco.add(brokenPillar(164, -3.5, 1.4));
  // the QUIET PROP — the clapperless bell, roped off on the parapet (foreground, z>0). Never signposted.
  deco.add(w5l4Bell(90, 24.5, 1.4));
  // foreground silhouettes (z>0) for depth framing at the course ends
  deco.add(brokenPillar(6, 3.4, 1.7)); deco.add(brokenPillar(154, 3.4, 1.7));
  { const fcog = cogMesh(1.6, 0x0f0d18); fcog.position.set(20, 2, 3.6); deco.add(fcog);
    const fcog2 = cogMesh(1.3, 0x0f0d18); fcog2.position.set(146, 1.6, 3.6); deco.add(fcog2); }
  S.add(bakeGroup(deco));

  // live background clock-pendulums swaying behind the tower (bespoke micro-motion, ticked in updateW5L4)
  w5l4BgPendulum(G, 34, 21, 5.5, 0.34, 3.6, 0.0);
  w5l4BgPendulum(G, 68, 27, 6.5, 0.28, 4.4, 1.3);
  w5l4BgPendulum(G, 100, 24, 5.0, 0.36, 3.1, 2.4);

  // a cold stopped moon-clock low behind the tower
  const moon = mesh('circ',[5,28], emat(0xe8e2d0,0xd8d2c0,0.7)); moon.position.set(120,18,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0xcfc7ff, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(120,18,-31.2); S.add(moonH);

  // three-depth Cursed-Castle skyline (cog-teeth & pendulums / rampart clock-towers + Grimm's Keep / mountain spires)
  w5Parallax(S, -8, 170);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 37.5, 39.5, 'castle');
  pitDressing(G, 55, 60, 'castle');
  pitDressing(G, 68, 70.5, 'castle');
  pitDressing(G, 77.5, 80.5, 'castle');
  pitDressing(G, 85.5, 88, 'castle');
  pitDressing(G, 111.5, 119.5, 'castle');
  pitDressing(G, 124.5, 126.5, 'castle');
  pitDressing(G, 131.5, 133.5, 'castle');

  // exit + the D5 tail. clutter placed manually on the two GROUND spans only (the middle is all tower/void)
  w5LevelFinish(G, -8, 170, null);
  w5Clutter(G, -8, 32, 'castle');
  w5Clutter(G, 134, 168, 'castle');

  return {spawnX: 0, exitX: 160};
}

function updateW5L4(G, dt){
  updateLevelCommon(G, dt);
  // bespoke castle micro-motion: the background clock-pendulums sway on the game clock (deterministic, cosmetic).
  // The gameplay entities (chains' colliders, PendulumBlades, gear-plats, the MidnightClock, the GrimmGift) all
  // self-tick through G.ents — nothing here touches the critical path.
  for(const p of W5L4_pends){
    p.g.rotation.z = Math.sin(G.time*(TAU/p.period) + p.phase) * p.amp;
  }
}

W5_LEVELS.push({id:'w5l4', district:'w5', name:'THE PENDULUM RAMPARTS', build:buildW5L4, update:updateW5L4, parTime:165});

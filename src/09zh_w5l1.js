// ============ LEVEL 5-1 — THE STOPPED GATE (District 5 · Cursed Castle · Grimm's Keep) ============
// The Keep's gatehouse — the FIRST clockwork level and District 5's welcome mat to the mastery exam.
// Every clock here stopped the night Grimm swallowed the Everflame; the great gears froze mid-turn. This
// level TEACHES the district's two new verbs on fair, safe ground before the Gearworks (5-2) makes them
// deadly: (1) STANDABLE GEAR PLATFORMS — brass cogs you ride up a high rampart road — and (2) the
// CLOCKWORK KNIGHT'S BOW: an armored automaton that COURTLY-BOWS before every lunge, the bow itself the
// telegraph (Mario-hard fairness, played for pomp). The first knight stands ALONE on wide safe ground so
// the player learns "bow -> step back -> punish"; later knights arrive under light pressure. Full
// introduce->twist->escalate->master, but at D5 density (10 threats, 3 lanes) with structured, telegraphed chaos:
//   BEAT 1 THE GATEHOUSE (INTRODUCE the bow)   x -8..30  — CP0. One Clockwork Knight alone on safe stone;
//          learn the bow tell. A stopped clock-face watches from the wall; a startled crow on the parapet.
//   BEAT 2 THE FIRST COGS (INTRODUCE gears)    x 30..54  — the HIGH ROAD branches UP a stair of standable
//          brass cogs onto a rampart, a Gummy-Shield lantern its reward; a 2nd knight + a Mirror Boo below.
//   BEAT 3 THE COG STACK & GP (visible GP)     x 54..92  — the rampart rides the cogs to a big cog stack;
//          GOLDEN PUMPKIN #0 floats over its crown (double-jump, candy-traced, safe ground). Descend, land by a 3rd knight.
//   BEAT 4 THE STOPPED CLOCKS (TWIST)          x 92..118 — CP1 (lit, mid-level). The QUIET PROP: a stopped
//          grandfather clock frozen a minute to midnight. A GrimmGift in a clear pocket; a Mirror Boo drifts the air.
//   BEAT 5 THE GEAR BRIDGE (ESCALATE)          x 118..150 — cross the frozen-gear chasm on a rhythm of cogs
//          over the void (a miss = a heart + the walk back to CP1), a Swoop Bat working the air lane above.
//   BEAT 6 THE STOPPED GATE (MASTER · finish)  x 150..185 — a last knight guards the run-out to the great
//          stopped gate; read the bow one more time and step through into the Keep.
// Reads UNMISTAKABLY Cursed Castle: W5PAL gunmetal masonry, verdigris-brass cogs, shadow-purple ghosts, clock-cream
// faces, the one warm ember accent, a stopped-clock-tower skyline with Grimm's cracked Keep-clock looming. Three
// lanes busy the whole way (ground knights/shadows · air Mirror Boos + Swoop Bats · the climbing cog road). Comparable
// heights throughout (tap 1.8 / held 2.6 / double 3.3; every rise slight-over-clearance, bridge gaps <=4). Deterministic
// to the tooth — fixed enemy phases, static cogs, the grandfather clock frozen forever; seeded rand() only inside baked
// cosmetic deco. No Math.random on the critical path.

// ---- THE QUIET PROP: a stopped grandfather clock, its hands frozen at 11:59 — the exact minute the Everflame
// went out, a breath before the Ember Moon should have crowned midnight. Never signposted. Fully baked (one draw
// call), utterly still — the stillness IS the story. Built positioned; the caller folds it into the deco bake. ----
function w5l1Grandfather(x, z, s=1){
  const g = new THREE.Group();
  const wood = mat(0x2c2236), woodD = mat(0x1e1728), brass = mat(W5PAL.brass);
  const caseBox = mesh('box',[1.3*s,4.4*s,0.85*s], wood); caseBox.position.set(x,2.2*s,z); g.add(caseBox);
  const plinth = mesh('box',[1.5*s,0.5*s,1.0*s], woodD); plinth.position.set(x,0.25*s,z); g.add(plinth);
  const hood = mesh('box',[1.45*s,0.7*s,0.95*s], woodD); hood.position.set(x,4.5*s,z); g.add(hood);
  const finial = mesh('cone',[0.28*s,0.7*s,6], brass); finial.position.set(x,5.1*s,z); g.add(finial);
  // the cream face high in the hood, ringed in brass — hands frozen a minute to midnight
  const face = mesh('cyl',[0.62*s,0.62*s,0.16*s,18], emat(W5PAL.cream,0x2a2436,0.12)); face.rotation.x=Math.PI/2; face.position.set(x,3.7*s,z+0.44*s); g.add(face);
  const rim = mesh('tor',[0.62*s,0.07*s,6,18], brass); rim.position.set(x,3.7*s,z+0.46*s); g.add(rim);
  for(let i=0;i<12;i++){ const a=i/12*TAU; const tick=mesh('box',[0.04*s,0.1*s,0.05], mat(W5PAL.stoneD)); tick.position.set(x+Math.cos(a)*0.5*s, 3.7*s+Math.sin(a)*0.5*s, z+0.5*s); tick.rotation.z=a; g.add(tick); }
  const hMin = mesh('box',[0.045*s,0.5*s,0.04], mat(0x1a1626)); hMin.position.set(x,3.92*s,z+0.51*s); hMin.rotation.z=0.10;   // ~59 min: a hair left of straight up
  const hHr  = mesh('box',[0.06*s,0.32*s,0.04], mat(0x1a1626)); hHr.position.set(x,3.85*s,z+0.51*s); hHr.rotation.z=-0.02;    // ~11: all but home to midnight
  g.add(hMin,hHr);
  // the pendulum behind a slim window — caught STOPPED, off-centre, never to swing again
  const win = mesh('box',[0.5*s,1.7*s,0.05], emat(0x14101e,0x14101e,0.1)); win.position.set(x,1.9*s,z+0.44*s); g.add(win);
  const rod = mesh('cyl',[0.03*s,0.03*s,1.5*s,5], mat(W5PAL.chain)); rod.position.set(x-0.24*s,2.2*s,z+0.46*s); rod.rotation.z=0.16; g.add(rod);
  const bob = mesh('cyl',[0.22*s,0.22*s,0.06*s,14], emat(W5PAL.brassD,W5PAL.ember,0.18)); bob.rotation.x=Math.PI/2; bob.position.set(x-0.48*s,1.5*s,z+0.46*s); g.add(bob);
  crook(g, 0.03);   // a faint dusty lean
  return g;
}

// ---- a big stalled COG STACK: baked static gears of falling radius, the "atop a big cog stack" read under GP #0.
// Purely decorative (the standable top is a gearPlat placed by the caller); one draw call, never re-rotated. ----
function w5l1CogStack(x, z){
  const g = new THREE.Group();
  const cols = [W5PAL.brassD, W5PAL.verd, W5PAL.steelD, W5PAL.brass];
  const rads = [2.3, 1.9, 1.5, 1.1], ys = [1.2, 3.0, 4.6, 6.0];
  for(let i=0;i<rads.length;i++){ const cog = cogMesh(rads[i], cols[i]); cog.position.set(x, ys[i], z); cog.rotation.z = i*0.4; g.add(cog); }
  return g;
}

function buildW5L1(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const STONE = W5PAL.stone;    // gunmetal masonry — the low road
  const BRASS = W5PAL.brass;    // brass rampart / high-road ledges

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE GATEHOUSE (x -8..30): INTRODUCE the bow ===============================
  groundX(G, -8, 118, STONE);                                          // the low road runs unbroken to the chasm at 118
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "GRIMM'S KEEP. Every clock here stopped the night the flame went out. Mind the brass knights - they BOW before they strike, so the bow is your cue to step aside and answer. Ride the cogs high for the treasure.");
  // CLOCKWORK KNIGHT #1 — alone on wide safe stone. Watch it bow (~0.6s), sidestep the lunge, then punish (a pound one-shots).
  G.ents.add(new ClockworkKnight(G, 16, 0, 0, {phase:0.0, range:2.4, dir:-1, speed:1.3}));
  candyLine(G, [[6,0.9,0],[10,0.9,0],[13,0.9,0]], 3);
  G.ents.add(new Crow(9, 0.95, 2.4));                                  // reactive parapet critter — flaps off when neared

  // =============================== BEAT 2 — THE FIRST COGS (x 30..54): INTRODUCE gear platforms ===============================
  // THE HIGH ROAD branches up a stair of standable brass cogs (over safe ground — a miss just drops to the low road).
  gearPlat(G, 34, 2.2);                                               // cog A (top 2.2) — held-jump from the stone
  gearPlat(G, 38, 3.9);                                               // cog B (+1.7)
  gearPlat(G, 42, 5.5);                                               // cog C (+1.6)
  platform(G, 48, 6.2, 0, 6, 3, BRASS);                              // THE RAMPART (spans 45..51, top 6.2; +0.7)
  candyLine(G, [[34,3.0,0],[38,4.7,0],[42,6.3,0]], 3);               // candy traces the climb
  candyLine(G, [[46,7.0,0],[49,7.0,0]], 2);
  G.ents.add(new BonkLantern(G, 51, 7.6, 0, 'shield'));              // high-road reward — a Gummy Shield (spin/stomp it)
  // the LOW ROAD stays busy below: a 2nd knight to read, and a Mirror Boo working the air (it slides the MIRRORED way)
  G.ents.add(new ClockworkKnight(G, 50, 0, 0, {phase:0.8, range:2.4, dir:1, speed:1.4}));
  G.ents.add(new MirrorBoo(G, 40, 3.2, 0, {range:4.0, mirror:0.8}));
  candyLine(G, [[30,0.9,0],[44,0.9,0]], 2);

  // =============================== BEAT 3 — THE COG STACK & GP #0 (x 54..92): visible-but-tricky ===============================
  // the rampart rides on across the cogs to a big stalled cog stack; GP #0 floats over its crown.
  gearPlat(G, 55, 6.6);                                              // cog D (+0.4 off the rampart)
  gearPlat(G, 60, 7.0);                                              // cog E (+0.4)
  gearPlat(G, 63, 7.2);                                              // cog F (+0.2) — the crown of the stack
  deco.add(w5l1CogStack(63, -0.7));                                  // the big baked cog stack behind/under the crown
  G.ents.add(new GoldPumpkin(63, 10.2, 0, 0));                       // GOLDEN PUMPKIN #0 — a double-jump over safe ground
  candyLine(G, [[55,7.4,0],[60,7.8,0],[63,8.4,0]], 3);              // candy lures up onto the crown...
  candyLine(G, [[63,9.4,0],[63,10.2,0]], 2);                        // ...and up into the pumpkin (telegraphs the double-jump)
  // DESCEND the far side of the stack back to the low road (each drop safe)
  gearPlat(G, 68, 5.6);                                             // cog G (-1.6)
  gearPlat(G, 73, 3.8);                                             // cog H (-1.8)
  gearPlat(G, 78, 2.2);                                             // cog I (-1.6) -> step off to the stone at ~82
  candyLine(G, [[68,6.3,0],[73,4.5,0],[78,2.9,0]], 3);
  // land beside a 3rd knight (light pressure now that the bow is learned)
  G.ents.add(new ClockworkKnight(G, 84, 0, 0, {phase:0.4, range:2.2, dir:-1, speed:1.4}));
  // SHADOW COPY #1 — the first copy seeps from Grimm's brew. NOTE: Shadow Copies are relentless lane-chasers with no
  // patrol home; each spawns to the RIGHT and converges left onto the player as a fair, glowing, hp1 head-on threat
  // (they resolve in beats 2-3, well clear of the gift ahead — never a patrol/dive inside its clear pocket).
  G.ents.add(new ShadowCopy(G, 72, 0, 0, {phase:0.0, speed:2.8}));
  G.ents.add(new SwoopBat(G, 84, 6.0, 0, {phase:0.2, range:3, period:3.4, aggroR:4.0}));  // air lane; base reach ≤91 stays ~5.5u clear of the GrimmGift@99 open-zone (SwoopBat re-homes toward the player)
  candyLine(G, [[88,0.9,0],[92,0.9,0]], 2);

  // =============================== BEAT 4 — THE STOPPED CLOCKS (x 92..118): TWIST + CP1 + quiet prop + GrimmGift ===============================
  G.ents.add(new Checkpoint(94, 0, 1.6, 1));                         // CP1 — LIT, the one mid-level checkpoint
  // THE QUIET PROP (never signposted): the stopped grandfather clock, hands frozen a minute to midnight (x104, back wall)
  deco.add(w5l1Grandfather(104, -1.7, 1.0));
  // THE GRIMM GIFT — the D5 gamble, in a CLEAR POCKET (no patrol/dive reaches within ~6u of x99: knights sit at 84 & 158,
  // the Mirror Boo homes at 110, the Swoop Bat patrols <=90 — all clear; ambush = shadow-copies of Pip on a fixed grace ring)
  const gift = new GrimmGift(99, 0, 0, -0.2);
  G.coffins.push(gift); G.ents.add(gift);
  G.ents.add(new MirrorBoo(G, 110, 3.0, 0, {range:4.5, mirror:0.85}));  // disorienting air floater by the clocks
  candyLine(G, [[101,0.9,0],[106,0.9,0],[110,0.9,0],[114,0.9,0]], 4);
  G.ents.add(new Crow(106, 0.95, 2.6));                             // foreground critter
  signPost(G, 116, 1.7, 0.1, "THE FROZEN GEARS. The floor gives out ahead - the great cogs stalled mid-turn make the only crossing. Read their rhythm and hop tooth to tooth.");

  // =============================== BEAT 5 — THE GEAR BRIDGE (x 118..150): ESCALATE — cross the chasm on cogs ===============================
  // the low road ENDS at 118; a frozen-gear chasm to 150 (a miss = a heart + the walk back to CP1). Static standable cogs
  // on a gentle rhythm of heights, all gaps <=4 (comfortable taps). Deterministic from level start.
  gearPlat(G, 121.5, 1.0);
  gearPlat(G, 125.0, 1.7);
  gearPlat(G, 128.5, 1.0);
  gearPlat(G, 132.0, 1.8);
  gearPlat(G, 135.5, 1.1);
  gearPlat(G, 139.0, 1.7);
  gearPlat(G, 142.5, 1.0);
  gearPlat(G, 146.0, 1.3);
  candyLine(G, [[121.5,1.9,0],[125,2.6,0],[128.5,1.9,0],[132,2.7,0]], 4);
  candyLine(G, [[135.5,2.0,0],[139,2.6,0],[142.5,1.9,0],[146,2.2,0]], 4);
  G.ents.add(new SwoopBat(G, 132, 5.0, 0, {phase:0.6, range:4, period:3.2, aggroR:5.0}));  // the air lane over the crossing (squeak-telegraphed dive)
  G.ents.add(new ShadowCopy(G, 130, 0, 0, {phase:0.4, speed:2.8}));  // SHADOW COPY #2 — a copy pours from the frozen gears and rushes the lane

  // =============================== BEAT 6 — THE STOPPED GATE (x 150..185): MASTER + finish ===============================
  groundX(G, 150, 185, STONE);
  // a last knight guards the run-out — the bow read one final time, now with the gate in sight
  G.ents.add(new ClockworkKnight(G, 158, 0, 0, {phase:1.2, range:2.6, dir:-1, speed:1.5}));
  G.ents.add(new ShadowCopy(G, 172, 0, 0, {phase:0.8, speed:2.8}));  // SHADOW COPY #3 — the gate's shadow peels off and gives chase
  candyLine(G, [[152,0.9,0],[156,0.9,0],[160,0.9,0]], 3);
  candyLine(G, [[166,0.9,0],[170,0.9,0]], 2);
  G.ents.add(new Crow(168, 0.95, 2.3));
  signPost(G, 172, 1.7, -0.1, "THE STOPPED GATE. Beyond it the Keep's gears wait to grind again. Grimm brews the stolen embers somewhere in the dark ahead - step through.");
  exitGate(G, 176);

  // =============================== DECO · TOWERS · CLOCKS · MOON · PARALLAX ===============================
  // stopped clock-faces watching from the walls, broken pillars, a dead chandelier — all baked to one draw call
  deco.add(clockFaceDeco(22, 4.6, -2.2, 1.1));
  deco.add(clockFaceDeco(70, 5.2, -2.4, 0.9));
  deco.add(clockFaceDeco(156, 4.4, -2.2, 1.15));
  deco.add(brokenPillar(0, -2.6, 1.2)); deco.add(brokenPillar(112, -2.8, 1.4)); deco.add(brokenPillar(180, -2.5, 1.2));
  deco.add(chandelier(30, 7.2, -2.6, 1.0)); deco.add(chandelier(120, 7.6, -2.6, 1.1));
  // FOREGROUND silhouettes (z>0) framing depth — broken pillars + a low stopped clock-face up front
  deco.add(brokenPillar(18, 3.0, 1.3)); deco.add(brokenPillar(90, 3.3, 1.5)); deco.add(brokenPillar(164, 3.1, 1.4));
  deco.add(clockFaceDeco(52, 2.0, 3.0, 0.8));
  S.add(bakeGroup(deco));

  // a cold, stopped moon behind the Keep
  const moon = mesh('circ',[4.4,28], emat(0xd9d2ec,0xcfc6e6,0.85)); moon.position.set(70,15,-30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',7,28), new THREE.MeshBasicMaterial({color:0xb9aee6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(70,15,-30.2); S.add(moonH);

  // three-depth Cursed Castle skyline (near cog-teeth & pendulums / stopped-clock towers + Grimm's cracked Keep-clock / mountain spires)
  w5Parallax(S, -8, 185);

  // exit + the D5 tail. clutter placed manually on the two GROUND spans only (the chasm 118..150 is open void)
  w5LevelFinish(G, -8, 185, null);
  w5Clutter(G, -8, 118, 'castle');
  w5Clutter(G, 150, 185, 'castle');

  return {spawnX: 0, exitX: 176};
}

function updateW5L1(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the level's motion is deterministic and self-driven (gearPlat cogs spin on their
  // own tickers, PendulumBlade-free intro, entities carry fixed phases). The grandfather clock stays frozen by design.
}

W5_LEVELS.push({id:'w5l1', district:'w5', name:'THE STOPPED GATE', build:buildW5L1, update:updateW5L1, parTime:160});

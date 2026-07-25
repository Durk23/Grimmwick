// ============ W4-1 — THE MISTY DOCKS (District 4, Level 1 — the Ghost Harbor on-ramp) ============
// Ghost Harbor's front door. The sea went out with the Everflame, so this is a cracked, dried seabed:
// stranded wrecks, dead coral, glowing tide-pool puddles where the water used to be, and the ghost
// galleon SALTY PHANTOM looming offshore in the fog. A GENTLE re-teach in a new district — the "precision
// + pressure" tier is coming, but 4-1 is where the player learns the harbor's language calmly.
// SIGNATURE GIMMICK: the FIRST ROPE SWING — a braided ship's-bell rope strung over a dried-seabed gap
// (climb up, boosted-hop across). Alongside it the district's headline enemy, the BOO BUCCANEER, is
// introduced ALONE on safe ground so the player reads the TWIST on the stare rule (facing it makes it wink
// and creep SLOWER — bolder than a shy Boo, never fully frozen). Crates become standable terrain, dock
// cranes and wreck ribs frame the depth. Full introduce->twist->escalate->master arc:
//   INTRODUCE  a lone Boo Buccaneer on flat open dock — learn stare->SLOW (beat 1)
//   TWIST      the ground gives out — cross the dried gap on the bell-rope swing (beat 2)
//   ESCALATE-1 crate stacks: a Barrel Mimic (trust-no-prop lunge) + the high crate/crane road to GP idx0 (beat 3)
//   BREATHE    the calm wreck backwater — a Treasure Chest gamble in a clear pocket, a mercy heart (beat 4)
//   ESCALATE-2 a tide-pool puddle hop, a second Barrel Mimic + Boo, a Swoop Bat working the air lane (beat 5)
//   MASTER     the high dock-plank road (candy the low road sees), a last Boo, then the Dock Gate (beat 6)
// Reads UNMISTAKABLY as a dried haunted harbor: w4Parallax wreck/crane/galleon skyline + lighthouse, salt-mist
// motes, glowing tide-pools, barnacled crates, dead coral, wheeling gulls. Structured chaos kept gentle: 8
// threats over ~198 units across the ground + air lanes, singles and telegraphed set-pieces with real breathing
// room. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3 / boosted rope-hop gated / gaps <=4).
// Deterministic to the pebble — fixed placements, fixed patrol/dive/aim clocks, seeded rand() only in baked
// cosmetic deco. No Math.random on the critical path.
function buildW4L1(G){
  const S = G.scene;
  levelBegin(G);

  // ---- palette handles for this course ----
  const SEABED = W4PAL.seabed;    // cracked teal-grey dry seabed (the running lane)
  const PLANK  = W4PAL.wood;      // bleached driftwood crate/plank tops
  const PLANKL = W4PAL.woodL;     // the brighter dock-plank high road

  const deco  = new THREE.Group();   // all opaque static deco bakes into one draw call at the tail
  const crates = new THREE.Group();  // baked crate visuals (colliders added alongside)

  // ---- standable dock crate: baked visual + an AABB collider under it (top = y + 0.95*s). The kit's crate()
  // builds at absolute world coords with no group transform, so it bakes cleanly (no spin-about-origin trap). ----
  const boxCrate = (x, y, z=0, s=1)=>{
    crates.add(crate(x, y, z, s));
    G.world.addBox(x, y, z, 0.95*s, 0.95*s, 0.95*s, {});
  };
  // a candy arc tracing one hop (start+0.5 / apex+1.2 / end+0.5 shape) — teaches the jump, telegraphs the gap
  const hopCandy = (xa,ya,xb,yb,n=4)=>{
    candyLine(G, [[xa, ya+0.5, 0],[(xa+xb)/2, Math.max(ya,yb)+1.2, 0],[xb, yb+0.5, 0]], n);
  };

  // =============================== BEAT 1 — THE MISTY DOCKS (x -8..36): INTRODUCE the Boo Buccaneer ===============================
  groundX(G, -8, 36, SEABED);
  signPost(G, 2, 1.7, -0.2, 'THE MISTY DOCKS — the sea went out with the flame. Mind the ghost crew: a pirate Boo winks and slows when you FACE it, but the bold ones never quite stop. Watch its feet.');
  // BOO BUCCANEER #1 — the headline enemy in isolation on flat, safe ground. Slow + short range so the player
  // has room to FACE it and read the stare->SLOW twist (it keeps creeping, just at 0.42x). A tap-stomp pops it.
  G.ents.add(new BooBuccaneer(G, 16, 0.2, 0, {phase:0.0, speed:2.1, range:9, candy:3}));
  candyLine(G, [[8,0.9,0],[11,0.9,0],[14,0.9,0]], 3);
  candyLine(G, [[20,0.9,0],[23,0.9,0]], 2);
  G.ents.add(new Crow(24, 0.9, -2.4));                    // a gull perched on the dock — flaps off as you pass
  G.ents.add(new Checkpoint(28, 0, 1.5, 0, {noLight:true}));

  // =============================== BEAT 2 — THE DRIED GAP (x 36..42): TWIST — the FIRST ROPE SWING ===============================
  // The dock ends at a crack in the seabed. A braided ship's-bell rope hangs over it: jump on, climb, and
  // boosted-hop to the far dock. Near-edge->rope 2u (an easy grab), rope->far 4u (a boosted climb-hop clears it).
  // Falling into the crack costs a heart + the lantern walk-back — never an instant loss (the dried seabed floor
  // with its half-buried wreck ribs is menace, not death).
  signPost(G, 34, 1.6, 0.15, 'The dock gives out here. Grab the bell-rope, climb, and leap for the far planks — a rope is a rope.');
  w2BellRope(G, 38, 0, 3.8, 0, {bell:true});
  candyLine(G, [[36.5,0.6,0],[38,2.4,0],[40,1.6,0],[41.8,0.6,0]], 5);   // the swing arc, start to landing
  { const rib1 = shipwreckRib(38, 0, 1.0); rib1.position.y=-2.2; deco.add(rib1);     // wreck ribs deep in the crack (the menace tell)
    const cor1 = deadCoral(40, 0, 1.1); cor1.position.y=-2.0; deco.add(cor1); }

  // =============================== BEAT 3 — THE CRATE YARD (x 42..80): ESCALATE-1 — Barrel Mimic + the high road to GP idx0 ===============================
  groundX(G, 42, 116, SEABED);
  // BARREL MIMIC #1 — trust no prop on a haunted dock. Sits inert (safe to stand near) until you close in, then
  // RATTLES (~0.45s tell) and lunges ONCE before reverting. Placed just past the rope landing so the first thing
  // on the far dock teaches "the barrel that shudders is about to bite." Stompable anytime.
  G.ents.add(new BarrelMimic(G, 48, 0, 0, {phase:0.0, wakeR:3.2, dir:-1, candy:3}));
  candyLine(G, [[44,0.9,0],[46,0.9,0]], 2);
  // THE HIGH CRATE/CRANE ROAD -> GOLDEN PUMPKIN idx 0 (VISIBLE BUT TRICKY): a lashed crate stack climbs to a
  // double-jump grab of the gold, glinting over the yard the whole approach. Missing just drops you to the solid
  // yard below (no pit) — a fair, low-stakes first taste of a high road. Candy traces every step.
  boxCrate(50, 0);  boxCrate(51, 0);          // a lashed base pair (top 0.95)
  boxCrate(50.5, 0.95);                        // one crate on top (top 1.9)
  deco.add(dockCrane(52, -1.6, 1.1));          // a rusted crane looms over the stack (background deco — sells "high crane")
  candyLine(G, [[50,1.35,0],[50.5,2.4,0]], 2); // up the stack
  G.ents.add(new GoldPumpkin(53.5, 3.4, 0, 0));                                  // the gold — a double-jump off the 1.9 crate-top (apex ~5.2u clears it easily)
  hopCandy(50.5, 1.9, 53.5, 3.4, 4);                                             // arc from crate-top to the gold
  platform(G, 56.5, 2.6, 0, 3, 2.4, PLANKL);   // a crane-deck ledge to land on past the grab (x55..58)
  candyLine(G, [[54.5,3.4,0],[56.5,3.0,0]], 2);
  // BOO BUCCANEER #2 — sweeps the yard floor beneath the gold, so the low road and the high grab share the space
  // (routes cross visibly). Its base sits well clear of the chest pocket further on.
  G.ents.add(new BooBuccaneer(G, 62, 0.2, 0, {phase:0.6, speed:2.4, range:11, candy:3}));
  candyLine(G, [[66,0.9,0],[69,0.9,0]], 2);
  G.ents.add(new Checkpoint(72, 0, 1.5, 1, {noLight:true}));

  // =============================== BEAT 4 — THE WRECK BACKWATER (x 80..108): BREATHE — the Treasure Chest gamble ===============================
  // The calm stretch: a beached wreck, a tide-pool, and the D4 gamble container in a CLEAR pocket. CLEAR-PATCH
  // LAW: Boo #2 ends its patrol ~11u back (x<=73), the Swoop Bat's base sits at x100 (aggroR 4 -> never wakes at
  // the chest), so opening is a deliberate safe act. Ambush = Boo Buccaneers on the fixed scatter ring w/ 1s grace.
  { const chest = new TreasureChest(88, 0, 1.6, -0.15); G.ents.add(chest); G.coffins.push(chest);
    G.world.addBox(88, 0, 1.6, 1.5, 0.9, 1.1, {}); }                             // solid off-lane pallet under it (z 1.05..2.15 — never blocks the z=0 run)
  candyLine(G, [[82,0.9,0],[85,0.9,0]], 2);
  G.ents.add(new Heart(96, 1.1, 0));                                             // backwater mercy heart
  // QUIET STORYTELLING PROP (never signposted): a sailor's last letter, folded on a crate and weighted under a
  // green bottle so the salt-wind can't take it. Addressed to someone who'll never read it now the tide is dead.
  // Story-readers pause; everyone else walks past.
  { const m = new THREE.Group();
    const box = mesh('box',[0.9,0.55,0.9], mat(PLANK)); box.position.y=0.28;
    for(const e of [[-0.45,0],[0.45,0]]){ const b=mesh('box',[0.06,0.57,0.9], mat(W4PAL.woodD)); b.position.set(e[0],0.28,0); m.add(b); }
    const letter = mesh('box',[0.36,0.02,0.28], mat(0xe8e0cc)); letter.position.set(0,0.57,0.03); letter.rotation.z=0.05;
    const fold   = mesh('box',[0.36,0.02,0.14], mat(0xd8cfb4)); fold.position.set(0,0.60,-0.09); fold.rotation.x=-0.35;
    const bottle = mesh('cyl',[0.07,0.09,0.32,8], emat(W4PAL.verdigris,W4PAL.verdigris,0.3)); bottle.position.set(0.03,0.73,0.06);
    const neck   = mesh('cyl',[0.03,0.04,0.12,6], mat(W4PAL.verdigris)); neck.position.set(0.03,0.93,0.06);
    m.add(box, letter, fold, bottle, neck);
    m.position.set(80, 0, 2.3); m.rotation.y=-0.3; deco.add(m); }
  // a beached wreck hull framing the backwater (background) + a foreground rib silhouette for depth
  deco.add(shipwreckRib(92, -4.5, 1.5));
  deco.add(shipwreckRib(104, 2.8, 1.2));
  G.ents.add(new Crow(112, 0.9, 2.3));                                           // a gull on the far wreck — startles as you leave the calm

  // =============================== BEAT 5 — THE TIDE-POOL FLATS (x 108..150): ESCALATE-2 — a puddle hop + doubled pressure ===============================
  // The ground breaks again for the sea's last puddle; past it the pressure doubles (barrel + boo + an air diver).
  // A tap clears the puddle; falling in the crack costs a heart. The dried-seabed floor glows teal far below.
  candyLine(G, [[110,0.9,0],[113,0.9,0]], 2);
  // GAP2 — a small tide-pool crack (x116..119.5, 3.5u tap). groundX resumes at 119.5.
  groundX(G, 119.5, 190, SEABED);
  hopCandy(115.5, 0.0, 120, 0.0, 3);                                            // the tap arc over the puddle
  G.ents.add(new BooBuccaneer(G, 107, 0.2, 0, {phase:0.3, speed:2.4, range:11, candy:3}));   // #3 — patrols the flats up to the puddle edge
  // SWOOP BAT #1 — the air lane arrives: a fixed snapshot-dive over the puddle crossing (ground+air pressure).
  // Base x100, small range -> its dive reach stays WEST of the chest pocket (never wakes at x88; clear-patch kept).
  G.ents.add(new SwoopBat(G, 100, 4.6, 0, {phase:0.0, range:3, aggroR:4, period:3.6}));
  // BARREL MIMIC #2 — a second trust-no-prop, now with a Boo bearing down so you can't stop to stare it out.
  G.ents.add(new BarrelMimic(G, 124, 0, 0, {phase:0.4, wakeR:3.2, dir:-1, candy:3}));
  // SWOOP BAT #2 — a second diver working the air over the flats, its arc tracing the run to the high road.
  G.ents.add(new SwoopBat(G, 131, 4.8, 0, {phase:1.6, range:4, aggroR:5, period:3.4}));
  candyLine(G, [[121,0.9,0],[123,0.9,0]], 2);
  G.ents.add(new Heart(134, 1.1, 0));
  G.ents.add(new Checkpoint(140, 0, 1.5, 2, {noLight:true}));
  // tide-pool jewels dotting the flats (kept LIVE below so their glow reads)

  // =============================== BEAT 6 — THE DOCK GATE (x 145..190): MASTER — the high plank road + finish ===============================
  // The MASTER beat: a raised dock-plank walkway crowned with candy the low road SEES overhead (the "next run I'm
  // up there" itch), reachable by crate steps OR a straight double-jump. A last Boo guards the run-in to the gate.
  boxCrate(146, 0);  boxCrate(146, 0.95);      // a two-high crate step (top 1.9)
  platform(G, 150, 2.8, 0, 2.6, 2.2, PLANK);   // step up (x148.7..151.3)
  platform(G, 156, 3.0, 0, 8, 2.2, PLANKL);    // the dock-plank high road (x152..160)
  candyLine(G, [[146,1.35,0],[148,2.4,0],[150,3.3,0]], 3);                       // up the crate steps
  candyLine(G, [[153,3.7,0],[156,3.7,0],[159,3.7,0]], 4);                        // the high-road reward — visible from the low lane
  G.ents.add(new Heart(156, 3.9, 0));                                           // a heart crowning the plank road
  candyLine(G, [[162,0.9,0],[165,0.9,0]], 2);                                   // the low road under the planks
  // BOO BUCCANEER #4 — the master test: one last winking pirate on the run to the gate. You know the read by now.
  G.ents.add(new BooBuccaneer(G, 170, 0.2, 0, {phase:0.0, speed:2.7, range:12, candy:3}));
  candyLine(G, [[176,0.9,0],[179,0.9,0],[182,0.9,0]], 3);
  G.ents.add(new Crow(178, 0.9, -2.5));
  const gateLight = new THREE.PointLight(W4PAL.lantern, 26, 10); gateLight.position.set(186, 3.2, -1); S.add(gateLight);   // ghost-green harbor finish glow

  // =============================== DECO · MOON · TIDE-POOLS · PARALLAX ===============================
  // dead coral + beached ribs threaded through the flats (background z<0 and a few foreground z>0 silhouettes)
  for(const [x,z,s] of [[6,-4.5,1.1],[30,-5,1.0],[58,-5.5,1.15],[86,-4.8,1.2],[126,-5,1.05],[162,-5.5,1.2],
                        [13,3.0,0.8],[70,3.2,0.9],[144,3.1,0.85],[186,3.3,1.0]])
    deco.add(deadCoral(x, z, s));
  for(const [x,z,s] of [[22,-6,1.0],[122,-6.2,1.1],[172,-6,1.0]]) deco.add(shipwreckRib(x, z, s));
  // a couple more dock cranes on the skyline (background)
  deco.add(dockCrane(108, -5.5, 1.0));
  deco.add(dockCrane(148, -6, 1.05));
  S.add(bakeGroup(deco));
  S.add(bakeGroup(crates));

  // glowing tide-pool puddles (kept LIVE — their transparent teal water reads as the sea's last light; a handful
  // of draw calls, well within budget). One sits at the BOTTOM of the beat-5 crack so the puddle-gap has depth.
  for(const [x,z,s,y] of [[26,-1.8,1.1,0],[66,2.0,1.0,0],[97,-2.0,1.2,0],[117.75,0,1.7,-1.2],[128,1.9,1.0,0],[168,-2.0,1.1,0],[182,2.1,1.0,0]]){
    const pool = tidePoolDeco(x, z, s); pool.position.y=y; S.add(pool); }

  // a low teal harbor-moon hung far behind the skyline
  const moon = mesh('circ',[5.0,28], emat(0xd6fff2,0xbdffe6,0.85)); moon.position.set(40,13,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8.0,28), new THREE.MeshBasicMaterial({color:0x8ffff0, transparent:true, opacity:0.13, depthWrite:false}));
  moonH.position.set(40,13,-31.2); S.add(moonH);

  // three-depth dried-harbor skyline (wreck ribs + dock/galleon/lighthouse + dune hills) behind everything
  w4Parallax(S, -8, 192);

  // exit + the D4 tail. clutterTheme null -> placed manually so no seabed clutter floats over the two cracks.
  exitGate(G, 186);
  w4LevelFinish(G, -8, 192, null);
  for(const [a,b] of [[-8,36],[42,116],[119.5,190]])
    w4Clutter(G, a, b, 'harbor');

  return {spawnX: 0, exitX: 186};
}

function updateW4L1(G, dt){
  updateLevelCommon(G, dt);
}

W4_LEVELS.push({id:'w4l1', district:'w4', name:'THE MISTY DOCKS', build:buildW4L1, update:updateW4L1, parTime:150});

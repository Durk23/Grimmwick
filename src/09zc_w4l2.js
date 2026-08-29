// ============ W4-2 — THE DRY TIDE (District 4, Level 2 — the cracked seabed crossings) ============
// Ghost Harbor's signature timing level. The sea is GONE — but the old stones still rise and sink on a
// tide that isn't there. SIGNATURE GIMMICK: TIDE PLATFORMS (tidePlat) — barnacled slabs bobbing on the
// shared tide sine over bottomless dry fog-chasms. Adjacent slabs run the SAME amp/freq with a FIXED
// phase-delta, so their tops stay within ~1.2u of each other at every instant (COMPARABLE HEIGHTS holds
// no matter WHEN you hop — the rhythm is a flourish, never a fail-gate). Cannon Crabs lob arcing shells
// from the flanks (fuse-telegraphed, snapshot arcs, safe lanes), Swoop Bats own the air, Boo Buccaneers
// creep the ground (stare to slow them). Full introduce->twist->escalate->master arc for the tide:
//   INTRODUCE  (A, x-8..30) meet a Boo (stare-slow) + a Cannon Crab lob on SAFE ground
//   TWIST-1    (GAP1, 30..44) the first tide crossing — hop the bobbing slabs, a Swoop Bat overhead
//   TWIST-2    (B, 44..78) the RIGGING high road (climb+leap for a Heart & candy, visible from below);
//              low road: a Boo, a Crab, a Barrel Mimic + the quiet prop
//   ESCALATE   (GAP2, 78..92) a longer crossing UNDER a Crab bombardment lobbing across it
//   BREATHE    (C, 92..124) the drying flats — a Treasure Chest gamble in a clear pocket, a shield, a heart
//   MASTER     (OPEN WATER, 124..146) the longest tide crossing out over the fog where the sea died...
//              **and hidden in that fog, the game's SECOND and LAST LEAP OF FAITH** (never hinted)
//   FINISH     (D, 146..182) the far shore + the Harbor Gate
// Reads UNMISTAKABLY as the dried haunted harbor: w4Parallax wreck/crane/galleon skyline, salt-mist +
// brine motes, deep fog chasms, dead coral, tide-pools, ship rigging. Deterministic to the barnacle —
// fixed tide/crab/bat clocks, seeded rand() only in baked cosmetic deco. No Math.random on the crit path.
function buildW4L2(G){
  const S = G.scene;
  levelBegin(G);
  G.world.killY = -8;                 // snappy dry-chasm falls: a heart + a walk-back to the last lantern

  // ---- palette handles ----
  const SAND  = W4PAL.seabed;         // cracked teal-grey seabed floor
  const WOOD  = W4PAL.wood;
  const WOODD = W4PAL.woodD;

  const deco = new THREE.Group();     // all opaque static deco bakes to ONE draw call at the tail

  // ---- a bobbing tide slab (the signature) — same amp/freq per row, staggered phase = a walkable wave ----
  const slab = (x, phase, opts={})=>tidePlat(G, x, opts.baseY!==undefined?opts.baseY:0.6, {
    amp: opts.amp!==undefined?opts.amp:1.0, freq: opts.freq||1.4, phase, w: opts.w||2.4, d: opts.d||3 });
  // a candy arc tracing one slab-to-slab hop at a representative height (teaches the cadence, telegraphs the jump)
  const hopCandy = (xa,ya,xb,yb,n=3)=>candyLine(G, [[xa, ya+0.6, 0],[(xa+xb)/2, Math.max(ya,yb)+1.4, 0],[xb, yb+0.6, 0]], n);
  // live translucent fog banks filling a dry chasm — you CANNOT see the bottom (kept identical across all
  // three chasms so the open-water leap is indistinguishable from an ordinary lethal gap: no tell of any kind)
  const fogFill = (x1,x2)=>{
    const n = Math.max(3, Math.floor((x2-x1)/4));
    for(let i=0;i<n;i++){
      const m = new THREE.Mesh(geo('sph',rand(3.4,5.2),8,6), new THREE.MeshBasicMaterial({color:0x1b2a2d, transparent:true, opacity:0.5, depthWrite:false}));
      m.scale.set(1.7,0.68,0.5); m.position.set(rand(x1+2,x2-2), rand(-2.6,-0.6), rand(-1.6,1.4)); S.add(m);
    }
    // a couple of drowned wreck-ribs jutting up out of the murk (background depth)
    deco.add(shipwreckRib(rand(x1+2,x2-2), -7.5, rand(0.9,1.3)));
  };

  // =============================== BEAT: THE DRIED SHALLOWS (A, x -8..30) — INTRODUCE ===============================
  groundX(G, -8, 30, SAND);
  signPost(G, 2, 1.7, -0.2, "THE DRY TIDE: the sea's gone, but the old stones still remember it. They rise and sink on a tide that isn't there. Cross when they lift.");
  candyLine(G, [[3,0.9,0],[6,0.9,0],[9,0.9,0]], 3);
  // BOO BUCCANEER — the stare-slow re-teach on flat ground (face it and it winks + creeps slower)
  G.ents.add(new BooBuccaneer(G, 14, 0, 0, {phase:0.0, speed:2.2, range:10}));
  // CANNON CRAB — the arcing-lob re-teach on SAFE ground: watch the fuse-spark ~0.7s, then sidestep the shell
  G.ents.add(new CannonCrab(G, 27, 0, 0, {phase:0.0, range:2.2, period:3.4, tele:0.8, firstFire:1.6}));
  candyLine(G, [[20,0.9,0],[23,0.9,0]], 2);
  G.ents.add(new Crow(8, 0.95, 2.4));   // reactive critter — flaps off when neared

  // =============================== BEAT: THE FIRST CROSSING (GAP1, 30..44) — TWIST-1 ===============================
  // A bottomless dry chasm. Hop the bobbing tide slabs across; a Swoop Bat cuts the airspace above the crossing.
  fogFill(30, 44);
  slab(32.5, 0.0); slab(35.8, 1.1); slab(39.1, 2.2); slab(42.4, 3.3);     // dphase 1.1 → tops stay within ~1.2u
  hopCandy(30.5,0.4, 32.5,0.6, 3); hopCandy(32.5,0.6, 35.8,0.6, 3); hopCandy(35.8,0.6, 39.1,0.6, 3);
  hopCandy(39.1,0.6, 42.4,0.6, 3); hopCandy(42.4,0.6, 44.5,0.2, 3);
  G.ents.add(new SwoopBat(G, 37, 4.6, 0, {phase:0.0, range:5, aggroR:5.5, period:3.6}));

  // =============================== BEAT: THE DOCK FLATS + RIGGING HIGH ROAD (B, 44..78) — TWIST-2 ===============================
  groundX(G, 44, 78, SAND);
  signPost(G, 45.5, 1.7, 0.2, "Rigging still hangs from the dead cranes. Grab it (UP) and climb. Leap off the top for the high catch.");
  // --- HIGH ROAD: a rope of ship rigging (climb volume — never walls the lane) up to a driftwood catwalk of
  // dock crates & planks carrying a HEART and a fat candy trail. The Heart glows OVER the low road (routes cross
  // in sight — the classic "next run I'm going up there" itch). Reconverges by a drop back to the seabed. ---
  w2BellRope(G, 47, 0, 4.4, 0, {});
  candyLine(G, [[47,1.3,0],[47,2.5,0],[47,3.7,0]], 3);                    // candy up the rigging = "climb here"
  platform(G, 50.5, 3.8, 0, 3.4, 2.2, WOOD);                             // leap off the rope onto the first plank
  platform(G, 56.0, 4.2, 0, 3.0, 2.2, WOODD);
  platform(G, 61.5, 3.5, 0, 3.0, 2.2, WOOD);                             // step-down plank → drop back to the flats
  G.ents.add(new Heart(56, 4.9, 0));                                     // the high-road payoff (no GP in this level)
  candyLine(G, [[50.5,4.4,0],[53.2,4.9,0],[56,5.0,0]], 4); candyLine(G, [[58.5,4.6,0],[61.5,4.1,0]], 3);
  // --- LOW ROAD: the honest ground line under the catwalk ---
  G.ents.add(new BooBuccaneer(G, 52, 0, 0, {phase:0.6, speed:2.3, range:9}));
  G.ents.add(new CannonCrab(G, 62, 0, 0, {phase:1.0, range:2.4, period:3.2, tele:0.75, firstFire:2.0}));
  G.ents.add(new BarrelMimic(G, 74, 0, 0, {phase:0.0, wakeR:3.0, dir:-1}));   // trust no prop: a deck barrel that rattles->lunges once
  candyLine(G, [[49,0.9,0],[52,0.9,0]], 2); candyLine(G, [[66,0.9,0],[69,0.9,0]], 2);
  // QUIET STORYTELLING PROP (never signposted): a child's toy sailboat, marooned and tipped over in a shrinking
  // tide-pool, its little sail gone pale. Someone small used to play at the water's edge here, before the sea left.
  { const boat = new THREE.Group();
    const hull  = mesh('box',[0.64,0.2,0.26], mat(W4PAL.woodL)); hull.position.y=0.14;
    const deck  = mesh('box',[0.5,0.1,0.2], mat(WOOD)); deck.position.y=0.25;
    const prow  = mesh('cone',[0.14,0.3,4], mat(W4PAL.woodL)); prow.rotation.z=-Math.PI/2; prow.position.set(0.37,0.16,0);
    const mast  = mesh('cyl',[0.02,0.02,0.5,5], mat(WOODD)); mast.position.set(-0.03,0.5,0);
    const sail  = mesh('box',[0.02,0.34,0.28], mat(0xdfe8e6)); sail.position.set(-0.03,0.55,0.03);
    boat.add(hull,deck,prow,mast,sail);
    boat.position.set(65,0.02,2.4); boat.rotation.set(0,-0.4,0.34);      // tipped over, half-beached in the drying pool
    deco.add(boat); }
  S.add(tidePoolDeco(65, 2.4, 0.85));                                    // the last of its puddle (live: transparent + glow)
  G.ents.add(new Checkpoint(70, 0, 1.3, 0, {noLight:true}));
  { const cp = new THREE.PointLight(W4PAL.lantern, 24, 10); cp.position.set(70, 3.2, -1); S.add(cp); }

  // =============================== BEAT: THE CANNON CROSSING (GAP2, 78..92) — ESCALATE ===============================
  // A longer chasm — and a Cannon Crab on the far shore lobs shells ACROSS it while you time the slabs (the
  // BOMBARDMENT flavor: ground gap + arcing sky threat, both on fixed clocks with generous safe windows).
  fogFill(78, 92);
  slab(80.5, 0.0, {amp:1.1, freq:1.5}); slab(83.8, 1.15, {amp:1.1, freq:1.5});
  slab(87.1, 2.3, {amp:1.1, freq:1.5}); slab(90.4, 3.45, {amp:1.1, freq:1.5});
  hopCandy(78.5,0.4, 80.5,0.6, 3); hopCandy(80.5,0.6, 83.8,0.6, 3); hopCandy(83.8,0.6, 87.1,0.6, 3);
  hopCandy(87.1,0.6, 90.4,0.6, 3); hopCandy(90.4,0.6, 92.5,0.2, 3);
  G.ents.add(new SwoopBat(G, 85, 4.8, 0, {phase:0.8, range:4.5, aggroR:5, period:3.8}));

  // =============================== BEAT: THE DRYING FLATS (C, 92..124) — BREATHE ===============================
  groundX(G, 92, 124, SAND);
  signPost(G, 94, 1.7, -0.15, "Cannon Crabs lob from the tide-pools. Watch the fuse-spark, then step out of the shell's shadow.");
  // the crab that bombarded GAP2 patrols the near flat (armored hp2 — a pound one-shots it)
  G.ents.add(new CannonCrab(G, 96, 0, 0, {phase:0.4, range:2.6, period:3.2, tele:0.75, firstFire:1.4, aggroX:9}));   // aggroX 22→9 so its shells can't reach the TreasureChest@108 (CLEAR-PATCH)
  candyLine(G, [[100,0.9,0],[103,0.9,0]], 2);
  G.ents.add(new Heart(100, 1.1, 0));
  G.ents.add(new Crow(102, 0.95, -2.6));
  // THE TREASURE CHEST — the D4 gamble, in a CLEAR pocket off the run lane (CLEAR-PATCH LAW): the crab ends
  // its patrol ~12u back, the shield lantern & Boo sit 8u+/14u on, no diver reaches here. Opening is a chosen act.
  { const chest = new TreasureChest(108, 0, 1.7, 0.3);
    G.coffins.push(chest); G.ents.add(chest);
    G.world.addBox(108, 0, 1.7, 1.5, 0.9, 1.5, {}); }                    // solid off-lane plinth (z 0.95..2.45 — never blocks z=0)
  G.ents.add(new BonkLantern(G, 116, 1.6, 0, 'shield'));                 // armor up before the long crossing
  G.ents.add(new BooBuccaneer(G, 122, 0, 0, {phase:0.0, speed:2.2, range:8}));   // a chaser onto the open water
  candyLine(G, [[112,0.9,0],[119,0.9,0]], 2);

  // =============================== BEAT: THE OPEN WATER (124..146) — MASTER + THE LEAP OF FAITH ===============================
  // The longest tide crossing, out over the fog where the sea itself died. The honest route hops the slabs to
  // the far shore. Hidden in the murk below is the game's SECOND and FINAL LEAP OF FAITH — a fall that LOOKS
  // like every other lethal chasm but instead COMPLETES the level with all rewards. It is never hinted: no
  // candy, no light, no tell of any kind, ever. Discovered by accident, or dared by a friend. Community legend.
  fogFill(124, 146); fogFill(124, 146);                                  // extra-thick murk — you cannot see a bottom
  slab(127.0, 0.2, {amp:0.95}); slab(130.3, 1.2, {amp:0.95}); slab(133.6, 2.2, {amp:0.95});
  slab(136.9, 3.2, {amp:0.95}); slab(140.2, 4.2, {amp:0.95}); slab(143.5, 5.2, {amp:0.95});
  hopCandy(124.5,0.4, 127,0.6, 3); hopCandy(127,0.6, 130.3,0.6, 3); hopCandy(130.3,0.6, 133.6,0.6, 3);
  hopCandy(133.6,0.6, 136.9,0.6, 3); hopCandy(136.9,0.6, 140.2,0.6, 3); hopCandy(140.2,0.6, 143.5,0.6, 3);
  hopCandy(143.5,0.6, 146,0.2, 3);
  G.ents.add(new SwoopBat(G, 140, 5.0, 0, {phase:1.4, range:4.5, aggroR:5, period:4.0}));
  // THE LEAP-OF-FAITH TRIGGER — a wide catch-volume across the fog floor, well above killY so a fall here is
  // NEVER a death: the dead sea "catches" you. Fires once. (Same contract as W1-4's leap — the only two in the game.)
  G.world.addBox(135, -6.5, 0, 22, 2.0, 12, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._leaped) return;
    G._leaped = true;
    AUDIO.portal(); AUDIO.victory();
    G.addCandy(50);
    G.completeLevel({leap:true});
  }});

  // =============================== BEAT: THE FAR SHORE + THE HARBOR GATE (D, 146..182) — FINISH ===============================
  groundX(G, 146, 182, SAND);
  G.ents.add(new Heart(150, 1.1, 0));                                    // shore mercy-heart (for the crossers who made it)
  candyLine(G, [[153,0.9,0],[156,0.9,0]], 2);
  G.ents.add(new BooBuccaneer(G, 158, 0, 0, {phase:0.3, speed:2.4, range:9}));   // last chaser
  candyLine(G, [[164,0.9,0],[167,0.9,0],[170,0.9,0]], 3);
  G.ents.add(new Crow(170, 0.95, 2.3));
  { const gl = new THREE.PointLight(W4PAL.lantern, 26, 10); gl.position.set(176, 3.2, -1); S.add(gl); }

  // =============================== DECO · WRECKS · CORAL · PARALLAX · MOON ===============================
  // beached wreck-hulls + dead-coral fans threaded along the shores (background z<0 and a few foreground z>0 silhouettes)
  for(const [x,z,s] of [[6,-5.5,1.1],[24,-4.6,1.3],[54,-5.2,1.2],[100,-5.6,1.15],[118,-4.8,1.25],[156,-5.4,1.1],[176,-6,1.2]])
    deco.add(shipwreckRib(x, z, s));
  for(const [x,z,s] of [[10,-3.2,1.2],[26,3.0,1.0],[50,-3.4,1.3],[97,3.1,1.1],[120,-3.2,1.2],[152,3.0,1.0],[172,-3.2,1.15],
                        [16,2.7,0.9],[104,2.8,1.0],[168,2.6,0.95]])
    deco.add(deadCoral(x, z, s));
  // rusted dock cranes looming on the skyline (background)
  deco.add(dockCrane(20, -6.5, 1.1)); deco.add(dockCrane(72, -6.8, 1.2)); deco.add(dockCrane(160, -6.6, 1.15));
  // a few lashed crates piled on the dry docks (deco only — off the lane so nothing walls z=0)
  deco.add(crate(12, 0, -2.8, 1.0)); deco.add(crate(12.9, 0, -2.6, 0.8));
  deco.add(crate(112, 0, -2.9, 1.0)); deco.add(crate(148, 0, -2.7, 0.9)); deco.add(crate(148, 0.9, -2.7, 0.9));
  // decorative glowing tide-pools set into the dry flats (LIVE — transparent water + emissive glints keep their glow)
  for(const [x,z,s] of [[8,-2.0,0.9],[28,2.2,0.8],[58,-2.3,1.0],[102,2.2,0.9],[150,-2.1,0.9],[174,2.2,0.8]])
    S.add(tidePoolDeco(x, z, s));
  S.add(bakeGroup(deco));

  // a low teal harbor-moon hung far behind the wrecks + a soft halo
  const moon = mesh('circ',[5.0,28], emat(0xd8fff2,0xbdf2e6,0.85)); moon.position.set(60,15,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0x8ffff0, transparent:true, opacity:0.13, depthWrite:false}));
  moonH.position.set(60,15,-31.2); S.add(moonH);

  // three-depth dried-harbor skyline (near coral/ribs · mid hulls+cranes+the Salty Phantom+a lighthouse · far dunes)
  w4Parallax(S, -8, 182);

  // exit + the D4 tail. clutterTheme null → clutter placed per SOLID span so nothing floats over the three chasms.
  exitGate(G, 178);
  w4LevelFinish(G, -8, 182, null);
  for(const [a,b] of [[-8,30],[44,78],[92,124],[146,182]]) w4Clutter(G, a, b, 'harbor');

  return {spawnX: 0, exitX: 178};
}

function updateW4L2(G, dt){
  updateLevelCommon(G, dt);
}

W4_LEVELS.push({id:'w4l2', district:'w4', name:'THE DRY TIDE', build:buildW4L2, update:updateW4L2, parTime:155});

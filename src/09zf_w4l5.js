// ============ W4-5 — BELOW DECKS (District 4, Level 5 — the Salty Phantom's haunted interior) ============
// The last course before Captain Wraith. You go DOWN into the ship's belly, ride the flooding bilge, weave the
// ghost crew's mess, then CLIMB back up through the captain's cabin to his door — and the whole run tips into
// THE BOMBARDMENT: a Cannon Crab gun-deck volley raining shells over a Boo Buccaneer gauntlet you dodge on the
// move. Four signature threats braided through one interior:
//   INTRODUCE  the ROLLING CANNONBALLS on the gun deck — iron balls you JUMP (never stomp), a trust-no-prop mimic
//   TWIST      the BILGE FLOOD — a rising teal tide over the deck floor; ride the rhythm, hop the refuge ledges,
//              a Rigging Wraith owning the airspace on its wire (ground/floor + air/wire lanes both live)
//   BREATHE    the MESS HALL — the ghost crew, a barnacled Treasure Chest gamble in a clear pocket, the quiet prop
//   ESCALATE   the CABIN CLIMB — a rope-rig up and over the aft bulkhead; skill-gated Golden Pumpkin up the rigging
//   MASTER     THE BOMBARDMENT — 3 Cannon Crabs lob from the gun-ports while 2 Boo Buccaneers press the floor;
//              keep moving, the crew fires where you WERE (candy traces the safe forward lane) — then Wraith's door
// Reads UNMISTAKABLY as the dried-harbour galleon interior: w4Parallax wreck/lighthouse skyline + the looming
// Phantom, salt-mist + brine motes, bleached hull planking, gun-port cannons, ghost-green lanterns, dead coral and
// glowing tide-pools set into the bilge. Structured chaos, all deterministic: 11 enemies + 2 rolling balls + the
// flood over ~206 units, every threat on a FIXED clock/phase and telegraphed. Comparable heights throughout
// (tap 1.8 / held 2.6 / double 3.3 / bounce 3.5, refuge hops <=2.2, the rigging gates the gold behind a climb).
// No bottomless pit — the interior floor is continuous, so every hazard is a fair heart-cost, never a cheap kill.
// Seeded rand() only inside baked cosmetic deco; nothing random on the critical path.
function buildW4L5(G){
  const S = G.scene;
  levelBegin(G);

  // ---- palette handles for this course ----
  const DECK   = W4PAL.hull;      // dark wreck-hull deck planking (the interior floor)
  const DECKL  = W4PAL.hullL;     // lighter cabin/gun-deck timber
  const BULK   = W4PAL.hullD;     // the aft-bulkhead planking (the wall you climb over)
  const LEDGE  = W4PAL.wood;      // bleached driftwood refuge crates / beams

  const deco = new THREE.Group();   // all static Lambert deco bakes into one draw call at the tail

  // ---- a candy arc tracing one hop (start+0.5 / apex+1.2 / end+0.5) — teaches the cadence, telegraphs the jump ----
  const hopCandy = (xa,ya,xb,yb,n=3)=>{
    candyLine(G, [[xa, ya+0.5, 0],[(xa+xb)/2, Math.max(ya,yb)+1.2, 0],[xb, yb+0.5, 0]], n);
  };
  // ---- a baked gun-port cannon poking from the hull (background z<0) — the interior's signature silhouette ----
  const gunPort = (x, z, ry=0)=>{
    const g = new THREE.Group();
    const port = mesh('box',[1.3,1.3,0.3], mat(BULK)); port.position.set(x,1.0,z);
    const rim  = mesh('tor',[0.55,0.09,5,12], mat(W4PAL.verdigris)); rim.rotation.x=Math.PI/2; rim.position.set(x,1.0,z+0.16);
    const tube = mesh('cyl',[0.22,0.26,1.1,10], mat(W4PAL.brass)); tube.rotation.z=Math.PI/2; tube.rotation.y=ry; tube.position.set(x,1.0,z+0.4);
    g.add(port,rim,tube); return g;
  };
  // ---- a hanging ghost-lantern (emissive fake; the real point-lights are budgeted by hand below) ----
  const hangLantern = (x, y, z)=>{
    const g = new THREE.Group();
    const chain = mesh('cyl',[0.02,0.02,0.5,4], mat(W4PAL.ropeD)); chain.position.set(x,y+0.3,z);
    const cage  = mesh('cyl',[0.16,0.13,0.34,8], mat(W4PAL.brass)); cage.position.set(x,y,z);
    const flame = mesh('sph',[0.12,8,7], emat(W4PAL.lantern,W4PAL.lantern,0.9)); flame.position.set(x,y,z);
    g.add(chain,cage,flame); return g;
  };

  // =============================== BEAT 0 — THE HATCH (x -6..14): INTRODUCE — into the belly ===============================
  groundX(G, -6, 14, DECK);
  signPost(G, 2, 1.7, -0.2, 'BELOW DECKS. The Salty Phantom groans around you. Iron rolls in the dark, the bilge is rising, and the crew never left. Up and out through the cabin — the Captain waits at the far door.');
  // FIRST BOO BUCCANEER — the re-teach: face it and it winks and only SLOWS (never freezes). A tap-stomp pops it.
  G.ents.add(new BooBuccaneer(G, 12, 0, 0, {phase:0.0, speed:2.2, range:9}));   // pushed +4u off spawn so the chaser doesn't crowd the start
  candyLine(G, [[4,0.9,0],[7,0.9,0],[10,0.9,0]], 3);
  // a warm ghost-lantern pool at the hatch (REAL light #1 of the hand-budget)
  { const l = new THREE.PointLight(W4PAL.lantern, 30, 11); l.position.set(4, 3.0, -1); S.add(l); }
  deco.add(hangLantern(4, 3.0, -1));

  // =============================== BEAT 1 — THE GUN DECK (x 14..50): the ROLLING CANNONBALLS + a trust-no-prop mimic ===============================
  groundX(G, 14, 50, DECK);
  signPost(G, 16, 1.7, 0.15, 'THE GUN DECK. Loose shot rolls the boards — iron, and it will not stomp. JUMP it, and mind the barrels: not all of them are just barrels.');
  // TWO rolling cannonballs on FIXED clocks, staggered speed/phase so the deck is never safe for long — you JUMP each
  // as it overtakes you (a tap clears the ~0.8u ball with room). Deterministic (x is a pure fn of the clock).
  G.ents.add(new RollingBall(G, 16, 42, 0, {speed:5.0, phase:0.0, r:0.42}));
  G.ents.add(new RollingBall(G, 18, 46, 0, {speed:6.4, phase:1.7, r:0.42}));
  candyLine(G, [[24,1.8,0],[27,2.0,0],[30,1.8,0]], 3);                             // the jump rhythm over the rolling lane
  // BARREL MIMIC — sits INERT as a harmless prop; walk close and it rattles (the tell), sprouts teeth, LUNGES once,
  // reverts. The inert barrel is safe to stand by; the bite is always the telegraph you ignored.
  G.ents.add(new BarrelMimic(G, 34, 0, 0, {phase:0.3, wakeR:3.2, dir:-1}));
  // HIGH ROAD — a hull-beam shelf over the gun deck: a crate step up onto a beam that carries a fat candy cache and a
  // heart, in plain sight of the floor runner (routes cross here — "next run I'm going up there"). Rejoins on the far side.
  platform(G, 22, 1.4, 0, 2.0, 2.4, LEDGE);                                        // crate step (tap 1.8 from floor)
  platform(G, 28, 3.0, 0, 4.2, 2.4, DECKL);                                        // the beam shelf (double 3.3 / step from the crate)
  hopCandy(22,1.4, 28,3.0, 3);
  candyLine(G, [[26,3.6,0],[28,3.7,0],[30,3.6,0]], 3);
  G.ents.add(new Heart(28, 3.9, 0));
  hopCandy(28,3.0, 33,0.0, 3);                                                     // and back down to the deck past the mimic
  deco.add(gunPort(20,-2.6)); deco.add(gunPort(38,-2.6,0.2));

  // =============================== BEAT 2 — THE BILGE (x 50..92): the FLOOD RHYTHM + a Rigging Wraith on its wire ===============================
  groundX(G, 50, 92, DECK);
  signPost(G, 52, 1.7, -0.15, 'THE BILGE. The sea remembers this hold. It climbs, it falls — ride the low water, and take the crates when it swells. Watch the rigging: something rides the ropes above.');
  G.ents.add(new Checkpoint(52, 0, 1.6, 0, {noLight:true}));                        // the level's ONE mid-course checkpoint

  // --- THE BILGE FLOOD: an emissive teal water plane + a 'hazard' collider whose top rises/falls on a FIXED sine.
  // High water submerges the bilge floor (a HEART-cost graze — never death, i-frames cap it); the refuge crates sit
  // safely above the crest, so the rhythm always has an out. Telegraphed by the visibly rising plane + a brightening
  // glow as it peaks. Deterministic from level start; slow enough that the low-water window easily covers the run. ---
  const bX1=54, bX2=88, bCx=(bX1+bX2)/2, bW=bX2-bX1;
  const floodLow=-0.5, floodHigh=1.5, floodPeriod=5.4, floodPhase=0.6;
  const water = mesh('box',[bW,0.5,7], emat(W4PAL.water, W4PAL.water, 0.55)); water.position.set(bCx, floodLow, 0); S.add(water);
  const sheen = new THREE.Mesh(geo('plane', bW, 7), new THREE.MeshBasicMaterial({color:W4PAL.waterP, transparent:true, opacity:0.22, depthWrite:false}));
  sheen.rotation.x=-Math.PI/2; sheen.position.set(bCx, floodLow+0.26, 0); S.add(sheen);
  const bilgeHaz = G.world.addBox(bCx, -3, 0, bW, 0.1, 7, {type:'hazard', damage:1});   // bottom fixed low; top tracks the surface
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0,
    update(dt){
      this.t += dt;
      const u = 0.5 + 0.5*Math.sin(this.t*(TAU/floodPeriod) + floodPhase);
      const top = floodLow + (floodHigh-floodLow)*u;
      bilgeHaz.max.y = top;                                  // the danger surface
      water.position.y = top - 0.25; sheen.position.y = top + 0.01;
      water.material.emissiveIntensity = 0.4 + u*0.55;       // brightens as it swells (the telegraph)
    }
  });
  // REFUGE CRATES — driftwood ledges whose tops sit 0.7u clear of the crest; a held jump from the floor reaches them.
  for(const rx of [58, 66, 74, 82]){
    platform(G, rx, 2.2, 0, 2.4, 3.0, LEDGE);
    G.ents.add(new Candy(rx, 2.7, 0));                       // a refuge-ledge reward candy
    deco.add(deadCoral(rx-0.7, 1.2, 0.8));                   // barnacled crate flavour
  }
  candyLine(G, [[56,0.9,0],[62,0.9,0],[70,0.9,0],[78,0.9,0],[86,0.9,0]], 5);        // the low-water advance line
  // RIGGING WRAITH — the district-unique air threat: a specter confined to a rope span above the bilge, sliding on a
  // fixed clock and SWOOPING (0.5s telegraph) when you pass beneath. Stomp/spin it on the pass; it can never leave the wire.
  G.ents.add(new RiggingWraith(G, 62, 4.6, 0, {phase:0.4, x1:55, x2:87, period:5.2, swoopDrop:2.6, tele:0.5}));
  // bilge deco — glowing tide-pools + dead coral set into the wet boards (live, transparent) + a wire strung overhead
  S.add(tidePoolDeco(55, 2.4, 0.7)); S.add(tidePoolDeco(88, -2.6, 0.9));
  { const wire = mesh('cyl',[0.03,0.03,34,4], mat(W4PAL.ropeD)); wire.rotation.z=Math.PI/2; wire.position.set(bCx,5.0,-0.4); deco.add(wire); }
  deco.add(gunPort(70,-2.7)); deco.add(shipwreckRib(90, -2.2, 1.0));
  // bilge lantern pool (REAL light #2)
  { const l = new THREE.PointLight(W4PAL.lantern, 26, 11); l.position.set(70, 4.2, -1); S.add(l); }
  deco.add(hangLantern(70, 4.2, -1));

  // =============================== BEAT 3 — THE MESS HALL (x 92..128): BREATHE — the ghost crew, the gamble, the quiet prop ===============================
  groundX(G, 92, 128, DECK);
  signPost(G, 94, 1.7, 0.2, "THE CREW'S MESS. They still take their supper. Slip past, or knock them off their stools — but the whole hold was hiding somewhere.");
  // THE TREASURE CHEST — the D4 gamble, dropped in a CLEAR alcove the instant you enter the mess (CLEAR-PATCH LAW):
  // the bilge wraith is confined to its wire ending 9u back, and the nearest crewman's home (110) sits 14u off — past
  // a Boo Buccaneer's 12u chase range — so nothing patrols/aggros within 6u while you pry it open. Ambush = the crew bursts.
  { const ch = new TreasureChest(101, 0, 1.8, -0.3);   // moved 96→101: 7u clear of the sign@94 so the "Read sign" prompt never steals the chest's interact
    G.coffins.push(ch); G.ents.add(ch);
    G.world.addBox(101, 0, 1.8, 1.5, 0.9, 1.2, {}); }                              // its solid off-lane plinth (z 1.2..2.4 — never blocks the z=0 run)
  // THE GHOST CREW — three Boo Buccaneers around the mess table; face them to slow the press and weave/stomp through.
  G.ents.add(new BooBuccaneer(G, 115, 0, 0, {phase:0.2, speed:2.4, range:9}));   // crew pushed +5u so nothing aggros within ~14u of the chest@101 (clear-patch: opening is a safe deliberate act)
  G.ents.add(new BooBuccaneer(G, 120, 0, 0, {phase:0.9, speed:2.4, range:9, slowMul:0.42}));
  G.ents.add(new BooBuccaneer(G, 125, 0, 0, {phase:1.5, speed:2.4, range:9}));
  G.ents.add(new Heart(103, 1.2, 0));                                              // a breather heart in the clear stretch
  candyLine(G, [[100,0.9,0],[106,0.9,0]], 2);
  candyLine(G, [[113,0.9,0],[119,0.9,0],[125,0.9,0]], 3);
  // QUIET STORYTELLING PROP (never signposted): the ship's MANIFEST — the crew roster nailed to a post by the mess
  // table, every name struck through with a carved line... but ONE, still un-crossed, glowing faint ghost-green. The
  // last of the crew never mustered out. Story-readers stop; everyone else runs past to the next fight.
  { const m = new THREE.Group();
    const post  = mesh('cyl',[0.06,0.08,1.7,6], mat(W4PAL.woodD)); post.position.y=0.85;
    const board = mesh('box',[0.9,1.2,0.08], mat(W4PAL.woodL)); board.position.y=1.35; crook(board,0.05);
    m.add(post, board);
    for(let i=0;i<6;i++){                                                          // six carved names, five struck through
      const line = mesh('box',[0.6,0.05,0.02], mat(0x4a4038)); line.position.set(0, 1.75-i*0.16, 0.05); m.add(line);
      if(i<5){ const strike = mesh('box',[0.66,0.035,0.03], mat(0x2a2420)); strike.position.set(0, 1.75-i*0.16, 0.07); strike.rotation.z=0.06; m.add(strike); }
      else   { const glow   = mesh('box',[0.6,0.05,0.02], emat(W4PAL.lantern,W4PAL.lantern,0.6)); glow.position.set(0, 1.75-i*0.16, 0.07); m.add(glow); }   // the one name left
    }
    m.position.set(120, 0, 2.2); m.rotation.y=-0.25; S.add(m); }
  deco.add(gunPort(100,-2.7,0.15));
  // a long mess table + stools (background dressing)
  { const tbl = mesh('box',[6,0.2,1.0], mat(W4PAL.woodD)); tbl.position.set(114,1.0,-2.3); deco.add(tbl);
    for(const sx of [110,114,118]){ const leg=mesh('box',[0.12,1.0,0.12], mat(BULK)); leg.position.set(sx,0.5,-2.3); deco.add(leg);
      const stool=mesh('cyl',[0.22,0.22,0.55,8], mat(W4PAL.woodL)); stool.position.set(sx,0.28,-1.7); deco.add(stool); } }

  // =============================== BEAT 4 — THE CAPTAIN'S CABIN (x 128..162): ESCALATE — climb up & over, GP up the rigging ===============================
  groundX(G, 128, 162, DECK);
  signPost(G, 128.5, 1.7, -0.2, "THE AFT BULKHEAD. No way through — only up. Take the rigging over the cabin. The old rope still holds a foot... and there's gold in the top-rigging for the one who climbs highest.");
  // THE AFT-BULKHEAD WALL — a solid hull wall (top y4.2) barring the floor. A double-jump (3.3) can't clear it: you
  // CLIMB. (An expert spring-jump ~4.4 can top it — a legit skip; the intended route is the rigging.)
  { const wall = mesh('box',[1.2,4.2,4], mat(BULK)); wall.position.set(130,2.1,0);
    const trim = mesh('box',[1.3,0.2,4.1], mat(W4PAL.verdigris)); trim.position.set(130,4.25,0);
    deco.add(wall, trim); G.world.addBox(130, 0, 0, 1.2, 4.2, 4, {}); }
  // the RIGGING LADDER up the mess-side of the bulkhead (climb volume + baked rope), then a boosted leap over the top
  w2BellRope(G, 128.6, 0, 5.0, 0);
  candyLine(G, [[128.6,1.4,0],[128.6,2.6,0],[128.6,3.8,0]], 3);                     // candy up the climb (telegraphs the route)
  // the CABIN WALKWAY behind the bulkhead — climb to the top, hop right over the wall onto it, cross, drop to the deck
  platform(G, 134, 4.4, 0, 8, 3, DECKL);
  candyLine(G, [[132,4.9,0],[135,4.9,0],[138,4.9,0]], 3);
  // GOLDEN PUMPKIN idx 2 — SKILL-GATED up the top-rigging: from the walkway (4.4) hop up to grab the rigging at 5.5 and
  // climb to the gold at ~9. Nothing from the deck floor reaches it (a double-jump tops out ~3.3) — the climb is the key.
  w2BellRope(G, 140, 5.5, 9.6, 0, {bell:true});
  hopCandy(138,4.4, 140,5.8, 3);
  candyLine(G, [[140,6.6,0],[140,7.6,0],[140,8.6,0]], 3);
  G.ents.add(new GoldPumpkin(140, 9.2, 0, 2));
  // cabin dressing — the captain's wheel + a chart desk on the walkway backdrop
  { const wheel = mesh('tor',[0.7,0.1,6,12], mat(W4PAL.woodL)); wheel.position.set(146,5.2,-1.4); deco.add(wheel);
    for(let i=0;i<8;i++){ const spk=mesh('box',[0.08,1.3,0.08], mat(W4PAL.woodD)); spk.position.set(146,5.2,-1.4); spk.rotation.z=i*Math.PI/4; deco.add(spk); }
    const desk = mesh('box',[1.6,0.9,0.9], mat(W4PAL.woodD)); desk.position.set(152,0.45,-2.4); deco.add(desk); }
  hopCandy(138,4.4, 143,0.0, 3);                                                   // the drop back down to the deck to press on
  // cabin lantern pool (REAL light #3)
  { const l = new THREE.PointLight(W4PAL.lantern, 28, 12); l.position.set(146, 5.6, -1); S.add(l); }
  deco.add(hangLantern(134, 5.4, -1));

  // =============================== BEAT 5 — THE BOMBARDMENT (x 162..200): MASTER — a Cannon Crab volley over a Boo gauntlet ===============================
  groundX(G, 162, 200, DECK);
  signPost(G, 163, 1.7, 0.15, "THE OPEN GUN-DECK. The crew mans the ports. Keep moving — they fire where you WERE, not where you're going. The Captain's door is dead ahead.");
  // THREE CANNON CRABS in the gun-ports (background z=-2.7) — they DON'T block the lane; their shells arc onto z=0 on a
  // fixed, staggered clock (0.7s fuse telegraph, impact snapshots your x). Keep moving forward and every shell lands behind.
  G.ents.add(new CannonCrab(G, 170, 0, -2.7, {phase:0.0, firstFire:1.2, period:3.0, tele:0.7, range:1.4, aggroX:26}));
  G.ents.add(new CannonCrab(G, 178, 0, -2.7, {phase:0.5, firstFire:2.2, period:3.0, tele:0.7, range:1.4, aggroX:26}));
  G.ents.add(new CannonCrab(G, 186, 0, -2.7, {phase:1.0, firstFire:3.2, period:3.0, tele:0.7, range:1.4, aggroX:26}));
  // TWO BOO BUCCANEERS press the floor — the "3-4 ground enemies AND something from the sky" gauntlet; stare to slow them.
  G.ents.add(new BooBuccaneer(G, 172, 0, 0, {phase:0.3, speed:2.6, range:12}));
  G.ents.add(new BooBuccaneer(G, 182, 0, 0, {phase:1.1, speed:2.6, range:12}));
  G.ents.add(new Heart(166, 1.2, 0));                                              // mercy heart before the cap
  candyLine(G, [[168,0.9,0],[174,0.9,0],[180,0.9,0],[186,0.9,0],[191,0.9,0]], 5);   // the forward safe lane (collect = keep dodging)
  deco.add(gunPort(170,-2.9)); deco.add(gunPort(178,-2.9,0.1)); deco.add(gunPort(186,-2.9,-0.1));
  // Captain Wraith's door — the finish glow (REAL light #4... GP + Chest make 6 total; within budget)
  { const gl = new THREE.PointLight(W4PAL.lantern, 30, 12); gl.position.set(194, 3.4, -1); S.add(gl); }

  // =============================== DECO · WRECKS · PARALLAX · AMBIENT CRITTERS · MOON ===============================
  // beached wreck ribs + dead coral threaded through the interior backdrop (baked, z<0) and a few foreground z>0 silhouettes
  for(const [x,z,s] of [[6,-2.4,0.9],[26,-2.6,1.0],[46,-2.5,0.9],[112,-2.4,1.0],[150,-2.6,0.95],[192,-2.4,1.0],
                        [12,2.6,0.8],[84,2.7,0.85],[158,2.6,0.9]])
    deco.add(shipwreckRib(x, z, s));
  for(const [x,z] of [[10,2.4],[40,-2.8],[100,2.5],[156,-2.7],[188,2.5]]) deco.add(deadCoral(x, z, rand(0.8,1.1)));
  // baked crate stacks dressing the hold (background)
  for(const [x,z,s] of [[18,-3.0,1.0],[48,-3.1,0.9],[124,-3.0,1.0],[164,-3.1,0.95]]){
    deco.add(crate(x,0,z,s)); deco.add(crate(x+0.5,0.9*s,z,s*0.8)); }
  S.add(bakeGroup(deco));

  // emissive brine-glow lanterns hung through the hold (no light cost) added LIVE so their halos stay soft
  for(const [x,y,z] of [[30,3.4,-2.2],[60,3.6,-2.0],[92,3.2,-2.2],[124,3.6,-2.0],[156,3.4,-2.2],[188,3.2,-2.0]])
    S.add(hangLantern(x, y, z));

  // reactive critters — perched harbour crows that flap off when approached (a mangy gull in the rigging)
  G.ents.add(new Crow(50, 0.95, 2.4));
  G.ents.add(new Crow(158, 0.95, -2.5));

  // a low teal harbour moon hung far behind the hull skyline
  const moon = mesh('circ',[5,28], emat(0xdafff2,0xbfffe8,0.85)); moon.position.set(40,15,-32); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0x9dffe0, transparent:true, opacity:0.13, depthWrite:false}));
  moonH.position.set(40,15,-32.2); S.add(moonH);

  // three-depth Ghost Harbour skyline behind everything (wreck ribs / dock cranes / the looming Salty Phantom + lighthouse)
  w4Parallax(S, -6, 202);

  // exit gate = Captain Wraith's door. clutterTheme null → clutter placed manually, split around the flooded bilge core.
  exitGate(G, 194);
  w4LevelFinish(G, -6, 202, null);
  w4Clutter(G, -6, 54, 'harbor');
  w4Clutter(G, 90, 202, 'harbor');

  return {spawnX: 0, exitX: 194};
}

function updateW4L5(G, dt){
  updateLevelCommon(G, dt);
}

W4_LEVELS.push({id:'w4l5', district:'w4', name:'BELOW DECKS', build:buildW4L5, update:updateW4L5, parTime:165});

// ============ W4-4 — BOARDING THE SALTY PHANTOM (District 4, Level 4 — the showcase, climb-centric) ============
// The moment the whole district builds to: you leave the dried dock and BOARD the beached ghost galleon.
// SIGNATURE GIMMICK STACK: a CANNON-LAUNCH flings you across a gap no jump can clear, then it's all SHIP —
// a LISTING DECK that rolls ±8° underfoot, ROLLING CANNONBALLS you leap on a fixed clock, RIGGING you CLIMB
// (bell-rope ascents + a rope-swing crossing), a RIGGING WRAITH owning the airspace over the boards, and the
// BOO BUCCANEER crew boiling up from the hatches. Full introduce->twist->escalate->master arc:
//   INTRODUCE  the misty dock: two crewghosts to re-learn the stare->slow read, crates, the galleon looming (beat 1)
//   THE GATE   the gangplank: a lone PURPLE lantern + a crew-ghost mid-plank — bounce his head into the crow's nest (warp)
//   CANNON     climb the barrel, read the aim-arc, fire aboard across the open hold (beat 2)
//   TWIST      the fore deck ROLLS: first rolling shot to leap, a barrel that isn't, a wraith on the wire (beat 3)
//   CLIMB      up the rigging (high road: candy + a Heart over the low road), then a ROPE-SWING over the hold (beat 4)
//   ESCALATE   the mid deck: two rolling lanes, more crew, the barnacled TREASURE CHEST gamble in a clear pocket (beat 5)
//   MASTER     the aft deck to the captain's cabin: a faster roll, the last rigging climb, the cabin door (beat 6)
// Reads UNMISTAKABLY as Ghost Harbor: w4Parallax dried-seabed/wreck/lighthouse/galleon skyline, salt-mist motes,
// bleached driftwood + barnacle green + ghost-green lantern light, tattered sails, brine glow. Structured chaos, not
// clutter: 10 threats + 3 rolling shots across ground/deck, air-wire and hazard lanes over ~183 units — singles and
// telegraphed set-pieces with real breathing room. Comparable heights (tap 1.8 / held 2.6 / double 3.3; the big gap is
// cannon-gated, the nest is boo-bounce-gated, the rigging is climb-gated — never an exact-height or fake-reach ledge).
// Deterministic to the pebble: fixed cannon aim clock, fixed rolling-ball/wire clocks, fixed patrols, seeded rand() only
// inside baked cosmetic deco. No Math.random on the critical path.
function buildW4L4(G){
  const S = G.scene;
  levelBegin(G);

  const DECK_Y = 2.0;      // the ship's deck plane — everything aboard stands here
  const DECK_D = 5.0;      // deck depth (z)

  // ---- LISTING-DECK TILE: a pivot-centered plank tile that ROLLS ±8° via deckList (cosmetic — the felt danger is the
  // rolling shots on their own clock; AABB colliders can't rotate, so the deck COLLIDER is a separate flat slab). Built
  // around its own origin (children local, group.position set) so rotation.z tilts it IN PLACE. Short tiles (~9u) keep
  // the end-swing small and, phase-staggered down the hull, make the whole ship read as rolling in a traveling wave. ----
  const deckTile = (cx, w, phase, planked)=>{
    const grp = new THREE.Group();
    const floor = mesh('box',[w, 0.4, DECK_D], mat(planked?W4PAL.hullL:W4PAL.hull)); floor.position.y=-0.2; grp.add(floor);
    const lip = mesh('box',[w, 0.12, DECK_D+0.12], emat(W4PAL.wood, W4PAL.woodD, 0.15)); lip.position.y=0.0; grp.add(lip);
    for(const sz of [-DECK_D*0.28, DECK_D*0.28]){ const seam=mesh('box',[w,0.42,0.06], mat(W4PAL.hullD)); seam.position.set(0,-0.19,sz); grp.add(seam); }
    // fore rail (toward the camera, z+) — hemp rope on stub posts
    const rail = mesh('box',[w,0.05,0.05], mat(W4PAL.rope)); rail.position.set(0,0.55,DECK_D/2-0.12); grp.add(rail);
    for(const px of [-w*0.36, 0, w*0.36]){ const post=mesh('cyl',[0.05,0.05,0.6,5], mat(W4PAL.woodD)); post.position.set(px,0.3,DECK_D/2-0.12); grp.add(post); }
    // a barnacle-crusted hull skirt hanging below the boards (visual — the beached hull)
    const skirt = mesh('box',[w*0.98,1.8,DECK_D*0.82], mat(W4PAL.hullD)); skirt.position.set(0,-1.2,0); grp.add(skirt);
    grp.position.set(cx, DECK_Y, 0); S.add(grp);
    deckList(G, grp, {amp:0.14, period:5.2, phase});
    return grp;
  };
  // a flat, honest deck-floor COLLIDER under a run of tiles (top = DECK_Y); the tiles only rock the LOOK
  const deckFloor = (x1, x2)=>{ G.world.addBox((x1+x2)/2, DECK_Y-0.5, 0, (x2-x1), 0.5, DECK_D, {}); };
  // a candy arc tracing one jump (start+0.5 / apex+1.2 / end+0.5) — collect = clear
  const arc = (xa,ya,xb,yb,n=4)=>{ candyLine(G, [[xa, ya+0.5, 0],[(xa+xb)/2, Math.max(ya,yb)+1.2, 0],[xb, yb+0.5, 0]], n); };

  const deco = new THREE.Group();   // all static deco bakes into one draw call at the tail

  // =============================== BEAT 1 — THE MISTY DOCKS & THE GANGPLANK (x -8..44) ===============================
  groundX(G, -8, 31, W4PAL.seabed);
  signPost(G, 2, 1.7, -0.2, 'BOARDING THE SALTY PHANTOM. The tide went out with the Everflame and left her beached. Board her where she lies — mind her crew, and mind her rolling deck.');
  // re-teach the stare->slow read on flat, safe dock ground (the harbor ghosts never freeze — they wink and creep on)
  G.ents.add(new BooBuccaneer(G, 11, 0, 0, {phase:0.0, range:9, speed:2.2}));
  G.ents.add(new BooBuccaneer(G, 22, 0, 0, {phase:0.6, range:9, speed:2.2}));
  candyLine(G, [[6,0.9,0],[9,0.9,0],[16,0.9,0],[19,0.9,0]], 4);
  // dock props: lashed crates (a couple standable), a rusted crane, tide-pool puddles, dead coral
  { const c1 = crate(14, 0, -2.2, 1.0); deco.add(c1); }
  { const c2 = crate(26, 0, 2.0, 1.0); deco.add(c2); }
  deco.add(dockCrane(8, -3.4, 1.1));
  deco.add(dockCrane(30, 4.0, 0.9));
  deco.add(tidePoolDeco(18, -2.6, 1.1)); deco.add(tidePoolDeco(24, 2.4, 0.9));
  deco.add(deadCoral(5, 2.4, 1.2)); deco.add(deadCoral(28, -2.6, 1.0));
  deco.add(shipwreckRib(-4, -2.8, 1.0));
  G.ents.add(new Crow(20, 0.95, -2.5));   // a reactive dock crow — flaps off when neared
  G.ents.add(new Checkpoint(29, 0, 1.6, 0, {noLight:true}));   // CP0 — the last dock lantern before the boarding

  // ---- THE GANGPLANK: a short rising plank onto the ship. Everyone climbs it to reach the cannon; the crow's-nest
  // WARP is the optional bounce off the plank crew-ghost's head. ----
  platform(G, 31.5, 0.6, 0, 3.4, 4.2, W4PAL.wood);           // step up off the dock (top 0.6 — a tap)
  platform(G, 38, 1.2, 0, 13, 4.2, W4PAL.woodL);            // the gangplank landing (top 1.2, x31.5..44.5) — carries the cannon
  arc(29,0.0, 31.5,0.6, 2); arc(31.5,0.6, 34,1.2, 2);
  signPost(G, 34, 1.6, 0.12, "The plank's too short and the gap too wide to jump. Climb into the cannon — read the aim-arc, and let her fling you aboard.");
  // THE CROW'S-NEST WARP (Old Shortcut) — the tell is a lone PURPLE lantern where no dock-lantern should burn.
  // Skill gate: freeze-stare the plank crew-ghost (a stare only SLOWS a Buccaneer), stomp-bounce off his head, and
  // air-steer up into the nest. Non-bounce double from the plank tops out ~4.5u; the nest sits at 5.0 (gated), the
  // head-bounce apex clears ~5.5u. Once per run -> warp to the level end + full candy bonus.
  const NEST_Y = 5.0;
  { // the lone purple lantern (emissive-only, no light budget spent) hung off the gangplank rail
    const cage = mesh('box',[0.34,0.44,0.34], mat(0x2c2140)); cage.position.set(35,2.35,0.5);
    const flame = mesh('sph',[0.19,10,8], emat(PAL.purpleFx, PAL.purpleFx, 1.2)); flame.position.set(35,2.35,0.5);
    const hook = mesh('cyl',[0.03,0.03,0.5,4], mat(W4PAL.ropeD)); hook.position.set(35,2.75,0.5);
    S.add(cage, flame, hook); }
  // the plank crew-ghost you bounce (short patrol so he stays mid-plank; CLEAR of the dock crew's range)
  G.ents.add(new BooBuccaneer(G, 37, 1.2, 0, {phase:0.0, range:3, speed:1.8, slowMul:0.4}));
  // the mast + crow's nest
  { const mast = mesh('cyl',[0.2,0.26, NEST_Y+1.4, 8], mat(W4PAL.hullD)); mast.position.set(40,(NEST_Y+1.4)/2,-0.3); S.add(mast);
    const ring = mesh('cyl',[1.15,1.15,0.7,14,1,true], mat(W4PAL.woodD)); ring.position.set(40,NEST_Y+0.35,0); S.add(ring); }
  platform(G, 40, NEST_Y, 0, 2.2, 2.2, W4PAL.wood);         // the nest floor (top 5.0)
  arc(37,1.6, 40,NEST_Y, 3);                                 // a faint candy hint up the bounce line
  const warpPm = new THREE.MeshBasicMaterial({color:PAL.purpleFx, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const warpPortal = new THREE.Mesh(geo('plane',1.8,2.2), warpPm); warpPortal.position.set(40,NEST_Y+1.05,0); S.add(warpPortal); G.warpPortal = warpPortal;
  const wl = new THREE.PointLight(0xb37dff, 42, 12); wl.position.set(40,NEST_Y+1.0,0.6); S.add(wl);
  const wflame = mesh('sph',[0.2,7,6], emat(PAL.purpleFx,PAL.purpleFx,1)); wflame.position.set(40,NEST_Y+0.4,0.5); S.add(wflame);
  G.world.addBox(40, NEST_Y, 0, 2.0, 2.6, 2.2, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._warpUsed) return;
    G._warpUsed = true;
    AUDIO.portal(); AUDIO.goldPumpkin();
    G.fx.spawn(new THREE.Vector3(40,NEST_Y+1.2,0), PAL.purpleFx, 24, {speed:4, life:0.8});
    G.addCandy(40);
    G.completeLevel({warp:true});
  }});

  // =============================== BEAT 2 — THE CANNON (x 42.5) : fired across the open hold (x44..52 void) ===============================
  // The barrel captures you, sweeps a fixed aim-arc (the dotted preview IS the telegraph), and JUMP fires you aboard.
  // Power/aim tuned so any read in the window lands on the wide fore deck (~x54..56 at deck height) — the gap (8u of
  // void) is un-jumpable, so the cannon is the mandatory low road. A mis-timed shot costs a heart + the CP0 walk-back.
  G.ents.add(new CannonBarrel(42.5, 1.2, 0, {dir:1, power:17.5, aimMin:0.62, aimMax:0.98, aimPeriod:1.9}));
  candyLine(G, [[46,3.2,0],[49,5.0,0],[52.5,3.2,0]], 5);     // the flight arc, traced in candy over the void

  // =============================== BEAT 3 — THE FORE DECK: THE ROLL BEGINS (x 52..88) ===============================
  deckFloor(52, 88);
  for(let i=0;i<4;i++) deckTile(56.5 + i*9, 9, i*0.6, i%2===0);   // 4 rolling plank tiles, traveling-wave phases
  G.ents.add(new Checkpoint(55, DECK_Y, 1.5, 1, {noLight:true}));   // CP1 — you land right on it; deck deaths never re-run the cannon
  { const dl = new THREE.PointLight(W4PAL.lantern, 34, 9); dl.position.set(56, DECK_Y+2.6, 0.5); S.add(dl); }   // a ghost-lantern deck pool (real light)
  G.ents.add(new BonkLantern(G, 60, DECK_Y+1.2, 0, 'shield'));      // arm up for the gauntlet (a wobbly gummy shield)
  signPost(G, 58, 1.5, -0.15, "Her deck never stops rolling. Leap the loose cannonballs before they roll you flat — and trust no barrel aboard.");
  // ROLLING SHOT #1 — a fixed-clock cannonball down the boards; you JUMP it (iron — not stompable)
  G.ents.add(new RollingBall(G, 56, 86, DECK_Y, {speed:5.0, phase:0.0, r:0.45}));
  arc(62,DECK_Y, 65,DECK_Y, 2);
  // BOO CREW #1 — boils up amidships; face it to slow the creep, then a tap-stomp pops it
  G.ents.add(new BooBuccaneer(G, 66, DECK_Y, 0, {phase:0.0, range:8, speed:2.4}));
  // BARREL MIMIC — the "trust no barrel" beat: inert until you pass, then one telegraphed rattle -> lunge
  G.ents.add(new BarrelMimic(G, 74, DECK_Y, 0, {phase:0.0, wakeR:3.0, dir:-1}));
  // RIGGING WRAITH #1 — the wire predator over the fore deck; it swoops when you pass beneath, then climbs back
  G.ents.add(new RiggingWraith(G, 71, 5.0, 0, {phase:0.0, x1:58, x2:84, period:6.0, swoopDrop:2.6}));
  // CANNON CRAB — a lobbed arcing shell adds the air-arc lane; short patrol, gated to near range so it never fires blind
  G.ents.add(new CannonCrab(G, 82, DECK_Y, 0, {phase:0.4, range:2.2, period:3.4, tele:0.7, firstFire:1.6, aggroX:14, dir:-1}));
  arc(76,DECK_Y, 80,DECK_Y, 2);

  // ---- HIGH ROAD (rigging climb) — up a bell-rope onto a rigging walkway that crosses OVER the deck: extra candy +
  // a Heart hanging in plain sight of the low-roader below (routes cross visibly). Optional; drops back to the boards. ----
  w2BellRope(G, 68, DECK_Y, 5.6, 0, {bell:true});
  candyLine(G, [[68,2.7,0],[68,3.7,0],[68,4.7,0]], 3);       // up the rigging
  platform(G, 73, 5.6, 0, 4.4, 2.2, W4PAL.woodL);           // rigging walkway A (top 5.6, x70.8..75.2)
  platform(G, 79, 5.9, 0, 4.0, 2.2, W4PAL.woodL);           // rigging walkway B (top 5.9)
  arc(75,5.6, 79,5.9, 3);
  G.ents.add(new Heart(79, 6.7, 0));                         // the high-road prize, visible from the deck below

  // =============================== BEAT 4 — THE ROPE-SWING OVER THE HOLD (x 88..95 void) ===============================
  // The boards break away over an open hold. The low road across is a CLIMB: jump onto the bell-rope mid-gap, ride it,
  // boosted-hop to the mid deck. (The high road also lands you here.) A fall costs a heart + the CP1 walk-back.
  w2BellRope(G, 91, DECK_Y-0.2, 5.4, 0, {});
  candyLine(G, [[88.5,2.6,0],[91,3.6,0],[91,4.4,0],[94.5,2.6,0]], 5);   // the swing arc: grab, ride, leap off
  deco.add(shipwreckRib(91, -3.0, 1.1));                    // broken ribs in the exposed hold (the tell is real)

  // =============================== BEAT 5 — THE MID DECK & THE TREASURE CHEST (x 95..135) ===============================
  deckFloor(95, 135);
  for(let i=0;i<4;i++) deckTile(100 + i*10, 10, 0.4 + i*0.6, i%2===1);
  // ROLLING SHOT #2 — runs only the west half (97..118), leaving a clean, patrol-free chest pocket to the east
  G.ents.add(new RollingBall(G, 97, 118, DECK_Y, {speed:5.6, phase:1.2, r:0.45}));
  // BOO CREW #2 — short leash (range 7 -> reaches only ~x111), so it never wanders the chest pocket
  G.ents.add(new BooBuccaneer(G, 104, DECK_Y, 0, {phase:0.3, range:7, speed:2.5}));
  // RIGGING WRAITH #2 — the mid-deck wire; its swoop window is west of the chest
  G.ents.add(new RiggingWraith(G, 108, 5.0, 0, {phase:1.5, x1:100, x2:116, period:6.4, swoopDrop:2.6}));
  arc(106,DECK_Y, 110,DECK_Y, 2);
  // THE TREASURE CHEST — the D4 gamble, in a CLEAR pocket (CLEAR-PATCH LAW): no rolling shot reaches (ball ends x118),
  // Boo #2 tops out ~x111 (11u clear) and Boo #3 tops out ~x128 (6u clear); opening is a deliberate, safe choice. The
  // ambush (Boo Buccaneers bursting from the hold) spawns on a fixed scatter ring with a 1s harmless grace.
  { const chest = new TreasureChest(122, DECK_Y, 1.3, -0.25); G.ents.add(chest); G.coffins.push(chest); }
  candyLine(G, [[118,2.6,0],[125,2.6,0],[130,2.6,0]], 4);
  // BOO CREW #3 — the mid->aft handoff; aggro range 5 (only wakes at x>=129) keeps its reach clear of the x116..128
  // chest pocket, so no crew-ghost (west Boo #2 tops out ~x111, east Boo #3 wakes ~x129) can trail into the open moment.
  G.ents.add(new BooBuccaneer(G, 134, DECK_Y, 0, {phase:0.8, range:5, speed:2.6}));

  // =============================== BEAT 6 — THE AFT DECK & THE CABIN DOOR (x 135..178) : MASTER + finish ===============================
  deckFloor(135, 178);
  for(let i=0;i<5;i++) deckTile(140 + i*9, 9, 0.2 + i*0.5, i%2===0);
  // ROLLING SHOT #3 — faster, the mastery beat; you leap it in the rolling-deck rhythm you learned amidships
  G.ents.add(new RollingBall(G, 138, 172, DECK_Y, {speed:6.2, phase:0.6, r:0.45}));
  G.ents.add(new BooBuccaneer(G, 148, DECK_Y, 0, {phase:0.2, range:8, speed:2.6}));
  G.ents.add(new BooBuccaneer(G, 160, DECK_Y, 0, {phase:0.7, range:8, speed:2.7}));
  arc(144,DECK_Y, 148,DECK_Y, 2);
  // last rigging climb (climb-centric master): a bell-rope to a short aft walkway with a Bat-Wings reward, then drop
  w2BellRope(G, 144, DECK_Y, 5.6, 0, {bell:true});
  platform(G, 150, 5.7, 0, 4.2, 2.2, W4PAL.woodL);
  candyLine(G, [[144,2.7,0],[144,3.9,0],[144,4.9,0]], 3);
  G.ents.add(new BonkLantern(G, 150, 6.6, 0, 'bat'));       // the high-road reward crowning the last climb
  // THE QUIET STORYTELLING PROP (never signposted): the captain's brass SPYGLASS resting on a barrel, still trained on
  // the horizon where the sea used to be. He was watching for the tide to come back. Story-readers pause; others pass.
  { const m = new THREE.Group();
    const bar = mesh('cyl',[0.42,0.46,0.9,12], mat(W4PAL.woodD)); bar.position.y=0.45; m.add(bar);
    for(const by of [0.2,0.7]){ const band=mesh('cyl',[0.47,0.47,0.06,12], mat(W4PAL.brass)); band.position.y=by; m.add(band); }
    const stand = mesh('cyl',[0.03,0.03,0.5,6], mat(W4PAL.brass)); stand.position.set(0,1.05,0); m.add(stand);
    const scope = mesh('cyl',[0.07,0.1,0.72,10], mat(W4PAL.brass)); scope.position.set(0.16,1.24,0); scope.rotation.z=0.55; m.add(scope);
    const lens = mesh('cyl',[0.1,0.1,0.05,10], emat(W4PAL.waterP, W4PAL.water, 0.5)); lens.position.set(0.44,1.42,0); lens.rotation.z=0.55; m.add(lens);
    m.position.set(156, DECK_Y, 1.9); m.rotation.y=-0.35; S.add(m); }
  { const al = new THREE.PointLight(W4PAL.lantern, 30, 9); al.position.set(168, DECK_Y+2.6, 0.5); S.add(al); }   // aft ghost-lantern pool
  candyLine(G, [[164,2.9,0],[168,2.9,0]], 2);
  signPost(G, 170, 1.5, -0.2, "THE CAPTAIN'S CABIN. He's beyond that door, waiting on a tide that never turned. Almost there, little one.");

  // =============================== SHIP DECO · MOON · WISPS · PARALLAX ===============================
  // masts, tattered sails, rigging lines and hanging ghost-lanterns strung down the hull (baked, z<0 behind the lane)
  const ship = new THREE.Group();
  for(const [mx] of [[64],[112],[162]]){
    const mast = mesh('cyl',[0.18,0.24, 7, 8], mat(W4PAL.hullD)); mast.position.set(mx, DECK_Y+3.2, -1.7); ship.add(mast);
    const yard = mesh('box',[4.2,0.16,0.16], mat(W4PAL.hullD)); yard.position.set(mx, DECK_Y+4.4, -1.7); crook(yard,0.03); ship.add(yard);
    const sail = mesh('box',[3.6,2.4,0.06], mat(W4PAL.sailD)); sail.position.set(mx, DECK_Y+3.2, -1.85); crook(sail,0.05); ship.add(sail);
    const rig1 = mesh('cyl',[0.03,0.03,4.6,4], mat(W4PAL.rope)); rig1.position.set(mx-1.6, DECK_Y+3.1, -1.6); rig1.rotation.z=0.5; ship.add(rig1);
    const rig2 = mesh('cyl',[0.03,0.03,4.6,4], mat(W4PAL.rope)); rig2.position.set(mx+1.6, DECK_Y+3.1, -1.6); rig2.rotation.z=-0.5; ship.add(rig2);
    const lant = mesh('sph',[0.16,8,6], emat(W4PAL.lantern, W4PAL.lantern, 0.85)); lant.position.set(mx+2.0, DECK_Y+3.8, -1.55); ship.add(lant);
  }
  // hatch squares the crew boil up from (deck-level, static — the ambush spots)
  for(const hx of [66,104,148]){ const hatch = mesh('box',[1.4,0.06,1.4], mat(0x10181a)); hatch.position.set(hx, DECK_Y+0.02, -0.7); ship.add(hatch);
    const rim = mesh('box',[1.55,0.1,1.55], mat(W4PAL.woodD)); rim.position.set(hx, DECK_Y-0.02, -0.7); ship.add(rim); }
  // the captain's cabin facade behind the exit
  { const wall = mesh('box',[4.2,3.2,0.5], mat(W4PAL.hull)); wall.position.set(177, DECK_Y+1.6, -1.2); ship.add(wall);
    const win = mesh('box',[0.9,0.9,0.1], emat(W4PAL.lantern, W4PAL.lantern, 0.5)); win.position.set(175.6, DECK_Y+1.8, -0.95); ship.add(win);
    const win2 = win.clone(); win2.position.x=178.4; ship.add(win2); }
  S.add(bakeGroup(ship));

  // foreground silhouettes (z>0) for depth framing — wreck ribs & coral along the dock, a foreground crate on deck
  const fore = new THREE.Group();
  fore.add(shipwreckRib(12, 3.4, 1.3)); fore.add(deadCoral(2, 3.6, 1.4)); fore.add(deadCoral(23, 3.5, 1.2));
  { const fc = crate(112, DECK_Y, 2.4, 1.1); fore.add(fc); }
  S.add(bakeGroup(fore));

  // baked static deco (dock props + hold ribs)
  S.add(bakeGroup(deco));

  // brine will-o'-wisps hung through the harbor — emissive fakes (no light cost), added LIVE so halos stay soft
  for(const [x,y,z] of [[16,2.6,-2.2],[50,4.2,-2.0],[70,4.6,2.2],[104,4.4,-2.2],[122,3.4,-2.2],[150,4.8,2.0],[172,3.2,-2.2]]){
    const wisp = mesh('sph',[0.16,8,7], emat(W4PAL.waterP, W4PAL.water, 1)); wisp.position.set(x,y,z); S.add(wisp);
    const halo = new THREE.Mesh(geo('sph',0.42,10,8), new THREE.MeshBasicMaterial({color:W4PAL.water, transparent:true, opacity:0.16, depthWrite:false})); halo.position.set(x,y,z); S.add(halo);
  }

  // a low teal harbor-moon hung far behind the skyline
  const moon = mesh('circ',[5.5,28], emat(0xdaf6ef, 0xbfeee2, 0.85)); moon.position.set(60,16,-32); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8.5,28), new THREE.MeshBasicMaterial({color:W4PAL.water, transparent:true, opacity:0.13, depthWrite:false}));
  moonH.position.set(60,16,-32.2); S.add(moonH);

  // three-depth dried-harbor skyline behind everything (wreck ribs / dock cranes / the galleon looming / lighthouse)
  w4Parallax(S, -8, 183);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 44.5, 52, 'harbor');      // the open hold under the cannon flight
  pitDressing(G, 88, 95, 'harbor');        // the exposed hold under the rope-swing

  // exit + the D4 tail. clutter only the DOCK seabed (the ship's deck is up at y2 — kit clutter sits on the seabed).
  exitGate(G, 175);
  w4LevelFinish(G, -8, 183, null);
  w4Clutter(G, -8, 30, 'harbor');

  return {spawnX: 0, exitX: 175};
}

function updateW4L4(G, dt){
  updateLevelCommon(G, dt);
  // the crow's-nest warp portal shimmers until spent (updateLevelCommon animates the exit portal, not this one)
  if(G.warpPortal) G.warpPortal.material.opacity = G._warpUsed ? 0.06 : (0.3 + Math.sin(G.time*2.6)*0.12);
}

W4_LEVELS.push({id:'w4l4', district:'w4', name:'BOARDING THE SALTY PHANTOM', build:buildW4L4, update:updateW4L4, parTime:165});

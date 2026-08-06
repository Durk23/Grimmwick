// ============ W3-1 — THE CROOKED PATH (District 3, Level 1 — the Witchwood on-ramp) ============
// Witchwood's front door. Harder and busier than Ravenmoor's on-ramp, but still learnable — the
// "fairly competitive begins" tier is coming, this level is where the player first tastes it.
// SIGNATURE GIMMICK: the WANDERING BROOM — riderless BroomZoomers sweeping low across the ground you
// LEAP, braided-tree limb hops for terrain, TOADSTOOL BOUNCERS as traversal toys, and the district's
// first DROP-SPIDERS opening the ceiling lane. Full introduce->twist->escalate->master arc:
//   INTRODUCE  leap ONE broom on safe ground over a few easy Widowmite stomps (beat 1)
//   TWIST      the terrain lifts — braided-limb hops over a friendly void, the first drop-spider (beat 2)
//   ESCALATE-1 a toadstool LAUNCH up to the district's first Golden Pumpkin, a second broom below (beat 3)
//   BREATHE    the cauldron clearing — a Mystery Cauldron gamble in a clear pocket + a Cauldron Dip (beat 4)
//   ESCALATE-2 the toadstool OVERSHOOT trap (bounce greedily = the thorns) + a Widowmite pair (beat 5a)
//   MASTER     a limb crossing under a diving Swoop Bat, then a last broom leap to the Forest Gate (beat 5b/6)
// Reads UNMISTAKABLY as a witch forest: w3Parallax braided-tree/witch-hut skyline, spores + potion motes,
// braided trees, witch huts on stilts, red toadstools, hanging webs, potion bottles, will-o'-wisps.
// Structured chaos, not clutter: 11 threats over ~192 units — singles and telegraphed set-pieces with
// real breathing room, ground/ceiling/air lanes all busy. Comparable heights throughout (tap 1.8 /
// held 2.6 / double 3.3 / bounce ~3.5 / gaps <=4). Deterministic to the pebble — fixed placements, fixed
// patrol/dive clocks, seeded rand() only inside baked cosmetic deco. No Math.random on the critical path.
function buildW3L1(G){
  const S = G.scene;
  levelBegin(G);

  // ---- palette handles for this course ----
  const FLOOR  = W3PAL.ground;     // mossy forest floor
  const GLADE  = W3PAL.groundL;    // the warmer cauldron-clearing turf
  const LIMB   = W3PAL.bark;       // braided-limb platform bark
  const DARKW  = W3PAL.groundD;    // the darker, crooked ground by the overshoot trap (a tell)

  // ---- baked braided-tree LIMB stepping-stone: a flat mossy top you land on, a knuckly braided stub
  // behind (out of the landing lane). Collider = the flat top (axis-aligned, always level). Over a void
  // baseY drops so the limb reads as a branch rising from the hollow. Visuals bake into `limbs` (1 draw). ----
  const limbs = new THREE.Group();
  const treeLimb = (x, topY, opts={})=>{
    const w = opts.w!==undefined?opts.w:1.9, d = opts.d!==undefined?opts.d:2.2;
    const baseY = opts.baseY!==undefined?opts.baseY:0, h = topY-baseY;
    G.world.addBox(x, baseY, 0, w, h, d, {});                                    // the standable top sits at topY
    const body = mesh('box',[w, h, d*0.85], mat(LIMB)); body.position.set(x, baseY+h/2, 0);
    const lipCol = new THREE.Color(W3PAL.canopyL).multiplyScalar(1.25).getHex();
    const lip = mesh('box',[w+0.12, 0.14, d*0.85+0.16], mat(lipCol)); lip.position.set(x, topY-0.02, 0);   // mossy landing beacon
    const stub = mesh('cyl',[w*0.2, w*0.27, 0.95, 6], mat(W3PAL.barkD)); stub.position.set(x, topY+0.46, -d*0.34); crook(stub,0.12);   // braided trunk stub at the BACK edge
    const knot = mesh('sph',[0.55,8,7], mat(W3PAL.canopy)); knot.position.set(x, topY+1.0, -d*0.34); knot.scale.set(1.25,0.8,0.8);
    limbs.add(body, lip, stub, knot);
  };
  // a candy arc tracing one hop from limb-top to limb-top (teaches the cadence, telegraphs the jump)
  const hopCandy = (xa,ya,xb,yb,n=3)=>{
    candyLine(G, [[xa, ya+0.5, 0],[(xa+xb)/2, Math.max(ya,yb)+1.2, 0],[xb, yb+0.5, 0]], n);
  };
  // a small baked dead-bramble — the darker crooked geometry that TELLS "trap/hazard here" (trap-tell language)
  const bramble = (x, z)=>{
    const g = new THREE.Group();
    for(let i=0;i<5;i++){ const b=mesh('cyl',[0.02,0.03,rand(0.4,0.8),4], mat(W3PAL.barkD)); b.position.set(x+rand(-0.3,0.3), rand(0.2,0.5), z+rand(-0.3,0.3)); b.rotation.set(rand(-0.9,0.9),rand(TAU),rand(-0.9,0.9)); g.add(b); }
    const flower=mesh('sph',[0.06,6,5], mat(0x5a4a3a)); flower.position.set(x,0.12,z); g.add(flower);   // a single dead flower, head bowed
    return g;
  };

  const deco = new THREE.Group();   // everything static bakes into one draw call at the tail
  // braidedTree()/cauldronDeco() build their meshes at ABSOLUTE world coords but then spin the whole
  // GROUP by rand(TAU) about its origin (world 0,0,0) — which, once baked (bakeGroup applies matrixWorld),
  // hurls the tree far from its intended x. The kit's own good builders (witchHut, w3Parallax trees) never
  // combine absolute children with a group rotation; these two do. Reset the group transform to identity so
  // the pieces land where asked — the per-segment braid twist + randomized foliage keep them crooked-looking.
  const bTree     = (x,z,s)=>{ const t=braidedTree(x,z,s);  t.rotation.set(0,0,0); return t; };
  const bCauldron = (x,z,s)=>{ const t=cauldronDeco(x,z,s); t.rotation.set(0,0,0); return t; };

  // =============================== BEAT 1 — THE TRAILHEAD (x -8..30): INTRODUCE the broom leap ===============================
  groundX(G, -8, 30, FLOOR);
  signPost(G, 2, 1.7, -0.2, 'THE CROOKED PATH — the trees lean where no wind blows. Leap the wandering brooms, and watch the crooks: spiders nest up there.');
  // a Widowmite SWARM (3) — knee-high, an easy tap-stomp each; teaches the tap-jump before anything bites hard
  G.ents.add(new Widowmite(G, 8,  0, 0, {phase:0.0, range:2, axis:'x', speed:4.4}));
  G.ents.add(new Widowmite(G, 10, 0, 0, {phase:0.5, range:2, axis:'x', speed:4.4, dir:-1}));
  G.ents.add(new Widowmite(G, 12, 0, 0, {phase:1.0, range:2, axis:'x', speed:4.4}));
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12,0.9,0]], 3);
  // BROOM #1 — the signature threat in isolation: a slow sweep on flat open ground. Low headH → a tap clears it.
  G.ents.add(new BroomZoomer(G, 19, 0.35, 0, {phase:0.0, range:5, speed:4.8}));   // sweeps 14..24
  candyLine(G, [[16,1.6,0],[19,2.2,0],[22,1.6,0]], 3);                            // the leap arc over the broom's lane
  G.ents.add(new Checkpoint(27, 0, 1.5, 0, {noLight:true}));

  // =============================== BEAT 2 — INTO THE CROOKED WOOD (x 30..52): TWIST — braided-limb hops + first drop-spider ===============================
  groundX(G, 30, 38, FLOOR);
  signPost(G, 33, 1.6, 0.15, 'Beyond here the ground gives out. The old branches remember how to hold a foot — if you trust them.');
  // three braided limbs over a FRIENDLY void (short hops, gentle rise/fall) → land on the clearing
  treeLimb(41, 1.2, {baseY:-4});
  treeLimb(45, 1.6, {baseY:-4});
  treeLimb(49, 1.3, {baseY:-4});
  hopCandy(38,0.0, 41,1.2, 3); hopCandy(41,1.2, 45,1.6, 3); hopCandy(45,1.6, 49,1.3, 3); hopCandy(49,1.3, 52,0.0, 3);
  groundX(G, 52, 88, FLOOR);
  // SPIDER #1 — the district's first drop-spider, hung over the landing so it opens the CEILING lane as you touch down
  G.ents.add(new Spider(G, 54, 5.5, 0, {groundY:0}));
  G.ents.add(new Checkpoint(60, 0, 1.5, 1, {noLight:true}));

  // =============================== BEAT 3 — THE TOADSTOOL LAUNCH & THE GOLD (x 52..88): ESCALATE-1 — bounce up to GP idx0, a broom below ===============================
  signPost(G, 61, 1.6, -0.15, 'A polite mushroom will spring you skyward. Aim before you leap — it bounces the greedy just as high.');
  // TOADSTOOL BOUNCER #1 — helpful traversal: run onto it and the ~3.5u bounce carries you up onto the canopy shelf
  G.ents.add(new ToadstoolBouncer(G, 64, 0, 0, {}));
  // the canopy shelf, set FORWARD of the pad so the bounce column stays clear (no head-bonk) — you carry right onto it
  platform(G, 68, 3.0, 0, 3.6, 2.4, W3PAL.barkL);
  deco.add(bTree(68, -0.6, 1.15));                                                // the tree the shelf grows from
  candyLine(G, [[65,1.8,0],[66.5,3.2,0],[68,3.6,0]], 4);                          // traces the bounce+steer up to the gold
  // GOLDEN PUMPKIN idx 0 — VISIBLE BUT TRICKY: it glows over the clearing all the way in; the toadstool launch is the key
  G.ents.add(new GoldPumpkin(68, 3.7, 0, 0));
  // BROOM #2 — sweeps the clearing floor below the gold, so the low road and the high grab share the space (routes cross visibly)
  G.ents.add(new BroomZoomer(G, 73, 0.35, 0, {phase:0.6, range:5, speed:5.5}));   // sweeps 68..78
  candyLine(G, [[56,0.9,0],[58.5,0.9,0]], 2);
  candyLine(G, [[81,0.9,0],[84,0.9,0],[86.5,0.9,0]], 3);
  // QUIET STORYTELLING PROP (never signposted): a familiar's little grave — a paw carved in mossy stone,
  // a saucer of milk still full, ringed by tiny toadstools. A witch's cat that hasn't come home since the
  // Everflame went out. Story-readers pause; everyone else walks past.
  { const m = new THREE.Group();
    const stone = mesh('box',[0.7,0.5,0.16], mat(W3PAL.cauldronR)); stone.position.y=0.28; crook(stone,0.06);
    const paw = mesh('sph',[0.11,7,6], emat(W3PAL.potionP,W3PAL.potion,0.4)); paw.scale.set(1,1,0.4); paw.position.set(0,0.34,0.1);   // a glowing carved paw
    const saucer = mesh('cyl',[0.2,0.22,0.05,12], mat(0xdad2c0)); saucer.position.set(0.4,0.03,0.3);
    const milk = mesh('cyl',[0.16,0.16,0.04,12], emat(0xf4f0e6,0xf4f0e6,0.35)); milk.position.set(0.4,0.06,0.3);   // still full
    const yarn = mesh('sph',[0.12,8,7], mat(0x8a52a4)); yarn.position.set(-0.4,0.12,0.28);
    m.add(stone,paw,saucer,milk,yarn);
    for(let i=0;i<5;i++){ const a=i/5*TAU; const cap=mesh('sph',[0.09,7,6], mat(W3PAL.cap)); cap.position.set(Math.cos(a)*0.55, 0.1, 0.1+Math.sin(a)*0.4); cap.scale.set(1.2,0.7,1.2); m.add(cap); }
    m.position.set(82, 0, 1.9); m.rotation.y=-0.2; deco.add(m); }

  // =============================== BEAT 4 — THE CAULDRON CLEARING (x 88..118): BREATHE — the Mystery Cauldron + a Cauldron Dip ===============================
  groundX(G, 88, 118, GLADE);
  signPost(G, 90, 1.6, 0.2, "Broomhilda's clearing. Mind what bubbles... and mind what bubbles back.");
  // THE MYSTERY CAULDRON — the D3 gamble, in a CLEAR pocket off the running lane (CLEAR-PATCH LAW): the
  // nearest patrol is broom #2 ending ~10u back and spider #2 ~18u on; nothing sweeps within 6u of it.
  { const mc = new MysteryCauldron(94, 0, 1.7, -0.2);
    G.ents.add(mc); G.coffins.push(mc);
    G.world.addBox(94, 0, 1.7, 1.6, 1.1, 1.6, {}); }                              // solid off-lane hearth (z 0.9..2.5 — never blocks the z=0 run)
  // THE CAULDRON DIP — a fun repeatable brew-buff right on the lane: jump in for a random shield/moon/wings/
  // salt to carry into the escalate. Hero placement earns one real light (a warm pool in the clearing).
  G.ents.add(new CauldronDip(102, 0, 0, {light:true}));
  G.ents.add(new Heart(108, 1.1, 0));                                             // clearing mercy-heart
  G.ents.add(new Checkpoint(106, 0, 1.5, 2, {noLight:true}));
  // SPIDER #2 — drops on the way OUT of the clearing, so the breather ends with a fresh ceiling threat
  G.ents.add(new Spider(G, 112, 5.5, 0, {groundY:0}));
  candyLine(G, [[96,0.9,0],[99,0.9,0]], 2);
  candyLine(G, [[114,0.9,0],[116.5,0.9,0]], 2);
  // clearing deco: a witch hut on stilts overlooking the cauldron + a bubbling deco cauldron on the ground
  deco.add(witchHut(110, -4.2, 1.1));
  deco.add(bCauldron(90, 2.4, 0.9));
  deco.add(potionBottle(97, 2.2)); deco.add(potionBottle(105, -2.4)); deco.add(potionBottle(116, 2.3));

  // =============================== BEAT 5a — THE OVERSHOOT TRAP (x 118..150): ESCALATE-2 — greedy bounce = the thorns ===============================
  groundX(G, 118, 150, FLOOR);
  candyLine(G, [[120,0.9,0],[123,0.9,0]], 2);
  // TOADSTOOL BOUNCER #2 — the "careful, don't overshoot" moment. A tidy candy stack hangs straight up:
  // a CONTROLLED bounce (ease off the stick) grabs it and drops you back safe. Carry momentum / hold
  // forward and the arc sails you RIGHT into the thorn hedge just ahead. The honest reward is visible from
  // the trap's mouth; the trap is a heart, never a pit (District-1/2 severity — fair for the on-ramp).
  G.ents.add(new ToadstoolBouncer(G, 128, 0, 0, {}));
  candyLine(G, [[128,1.7,0],[128,2.6,0],[128,3.5,0]], 3);                         // the straight-up reward for the controlled spring
  thornsX(G, 134, 3);                                                            // the overshoot hazard (glows purple) — spans 132.5..135.5, a tap clears it deliberately
  deco.add(bramble(133, 1.9)); deco.add(bramble(135, -1.7));                      // dead-bramble tell flanking the thorns (the darker crooked geometry)
  { const dt2 = mesh('box',[6,0.14,10], mat(DARKW)); dt2.position.set(134,0.03,0); deco.add(dt2); }   // a darker turf patch under the thorns — the ground itself warns you
  G.ents.add(new Crow(133, 0.95, 2.2));                                          // a crow perched by the thorns, staring (the trap-tell critter) — flaps off when neared
  // a WIDOWMITE PAIR skitters the far half of the run — dodge/stomp while you reset from the trap
  G.ents.add(new Widowmite(G, 143, 0, 0, {phase:0.0, range:2.4, axis:'x', speed:5.0}));
  G.ents.add(new Widowmite(G, 145, 0, 0, {phase:0.6, range:2.4, axis:'x', speed:5.0, dir:-1}));
  candyLine(G, [[138,0.9,0],[140,0.9,0]], 2);
  G.ents.add(new Heart(149, 1.1, 0));                                            // a heart before the crossing (mercy scales with the climb ahead)
  G.ents.add(new Checkpoint(148, 0, 1.5, 3, {noLight:true}));

  // =============================== BEAT 5b — THE HOLLOW CROSSING (x 150..164): a limb hop under a diving Swoop Bat ===============================
  // The air lane arrives at the pinch point: braided limbs over a real void while a Swoop Bat squeaks and
  // dives a fixed snapshot arc. Ground gone, ceiling learned, air now too — a sidestep on a limb beats the dive.
  treeLimb(153, 1.4, {baseY:-5});
  treeLimb(157, 1.8, {baseY:-5});
  treeLimb(161, 1.5, {baseY:-5});
  hopCandy(150,0.0, 153,1.4, 3); hopCandy(153,1.4, 157,1.8, 3); hopCandy(157,1.8, 161,1.5, 3); hopCandy(161,1.5, 164,0.0, 3);
  G.ents.add(new SwoopBat(G, 156, 4.8, 0, {phase:0.0, range:5, aggroR:5.5, period:3.4}));

  // =============================== BEAT 6 — THE FOREST GATE (x 164..188): MASTER + finish ===============================
  groundX(G, 164, 188, FLOOR);
  signPost(G, 166, 1.6, -0.2, 'THE FOREST GATE. One last broom stands between you and the deeper wood. You know this leap by now.');
  // BROOM #3 — a final, faster sweep on the run-in: master the leap you learned at the trailhead, then the gate
  G.ents.add(new BroomZoomer(G, 173, 0.35, 0, {phase:0.0, range:5, speed:6.0}));  // sweeps 168..178
  candyLine(G, [[170,1.6,0],[173,2.2,0],[176,1.6,0]], 3);
  candyLine(G, [[180,0.9,0],[182,0.9,0]], 2);
  const gateLight = new THREE.PointLight(0x9d7bff, 26, 10); gateLight.position.set(184, 3.2, -1); S.add(gateLight);   // warm potion-violet finish glow

  // =============================== DECO · MOON · WISPS · AMBIENT CRITTERS · PARALLAX ===============================
  // braided trees threaded through the wood (background z<0 and a few foreground z>0 silhouettes for depth)
  for(const [x,z,s] of [[-4,-4,1.2],[7,-5.5,1.0],[22,-4.5,1.3],[35,-6,1.1],[57,-5,1.15],[71,-6,1.0],
                        [92,-6,1.2],[113,-5.5,1.1],[126,-4.8,1.15],[147,-6,1.0],[168,-5,1.25],[184,-6,1.1],
                        [3,3.0,0.85],[48,3.2,0.8],[100,3.4,0.9],[158,3.2,0.85]])
    deco.add(bTree(x, z, s));
  // witch huts perched on the skyline (background)
  deco.add(witchHut(28, -6.5, 1.0));
  deco.add(witchHut(78, -6.8, 0.9));
  deco.add(witchHut(180, -6.5, 1.05));
  // red-toadstool ground jewels + hanging webs strung in the tree forks + potion bottles (all baked)
  for(const [x,z] of [[5,-2.6],[24,2.4],[53,-2.8],[86,2.6],[104,-2.7],[140,2.5],[171,-2.6],[186,2.4]])
    deco.add(mushroomCluster(x, z, rand(0.8,1.2)));
  for(const [x,z,y] of [[15,-3.0,2.6],[46,-3.2,2.2],[75,-3.0,2.8],[112,-3.2,2.4],[160,-3.0,2.6]]){
    const hw = hangingWeb(x, z, 1.2); hw.position.y=y; deco.add(hw); }
  for(const [x,z] of [[11,2.3],[62,-2.5],[120,2.4],[176,2.5]]) deco.add(potionBottle(x, z));
  S.add(bakeGroup(deco));
  S.add(bakeGroup(limbs));

  // will-o'-wisps hung through the wood — emissive fakes (no light cost), added LIVE so their halos stay soft
  for(const [x,y,z] of [[13,2.2,-2.4],[43,3.0,-1.6],[70,2.4,2.2],[99,2.8,-2.2],[131,2.6,-2.0],[156,3.2,2.0],[178,2.4,-2.2]])
    S.add(willOWisp(x, y, z));

  // a pale witch-moon hung far behind the forest skyline
  const moon = mesh('circ',[5.5,28], emat(0xe6fff4,0xd6ffe8,0.85)); moon.position.set(34,16,-32); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8.5,28), new THREE.MeshBasicMaterial({color:0x9dffe0, transparent:true, opacity:0.14, depthWrite:false}));
  moonH.position.set(34,16,-32.2); S.add(moonH);

  // reactive critters — perched crows that flap off when approached (the thorn-trap crow lives up in beat 5a)
  G.ents.add(new Crow(20, 0.95, -2.6));
  G.ents.add(new Crow(180, 0.95, 2.3));

  // three-depth braided-forest skyline behind everything
  w3Parallax(S, -8, 190);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 38, 52, 'wood');     // beat-2 limb hops over the friendly hollow
  pitDressing(G, 150, 164, 'wood');   // beat-5b hollow crossing under the Swoop Bat

  // exit + the D3 tail. clutterTheme null → placed manually below so no clutter floats over the two voids.
  exitGate(G, 184);
  w3LevelFinish(G, -8, 190, null);
  for(const [a,b] of [[-8,30],[30,38],[52,88],[88,118],[118,150],[164,188]])
    w3Clutter(G, a, b, 'forest');

  return {spawnX: 0, exitX: 184};
}

function updateW3L1(G, dt){
  updateLevelCommon(G, dt);
}

W3_LEVELS.push({id:'w3l1', district:'w3', name:'THE CROOKED PATH', build:buildW3L1, update:updateW3L1, parTime:150});

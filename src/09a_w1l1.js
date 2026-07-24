// ============ W1-L1 — GRAVEYARD LANE ============
// District 1's teaching level, grown to a full ~4-minute course (owner: "wish it was longer").
// ACT 1 (x -8..48): the original opening — spawn runway, signs, first Boos, high road,
//   the coffin at 41. Design intact; retuned to the owner's "chaos but not cluttered
//   enemies" band (singles, breathing room) and the coffin CLEAR-PATCH law (no threat
//   routes within ~6u of a coffin — opening one is a deliberate, safe act).
// ACT 2 (x 48..132): THE OLD CRYPTS — the graveyard deepens. Mausoleum rows loom in the
//   background, sarcophagi bump the lane, two FRIENDLY gravestone-hop gaps (68..76 and
//   96..105) twist-then-escalate the hop rhythm the finale will test, a crypt-roof high
//   stretch carries a bat-guarded heart, an ivy-clad obelisk offers a playful CLIMB up
//   to the roof-run mid-stretch, and a second coffin sits tucked off-path (clear pocket).
// ACT 3 (x 132..196): THE SUNKEN CRYPT — a FRESH new act (not more lane). The ground OPENS
//   and you can DESCEND into a candle-lit underground crypt pocket — a first taste of
//   District 2's catacombs. It's a real ROUTE CHOICE: the scenic CRYPT below (a low-ceiling
//   "mind your head" traverse, a coffin-LID rhythm section on a fixed clock, wisp light, one
//   new quiet prop, a heart + richer candy, then a root-CLIMB back up) — or the honest
//   BOARDWALK up top (safe, less candy). The routes run parallel and SEE each other, then
//   reconverge (checkpoint 4 + mercy shield) before the bridge.
// FINALE (x 196..214): the rotten-bridge trap gap + honest gravestone hops + landing strip
//   + relight arch — the old finale transplanted +64, unchanged in design.
// Threats: 15 over ~214u (~4.2 per 60u, D1 band). 4 checkpoints. Every gameplay placement is
//   fixed coordinates; rand() (level-seeded) appears only in baked deco scatter.

// ---- in-file deco: a crypt/mausoleum silhouette (baked by callers — no collider) ----
function w1l1Crypt(x,z,s=1,lit=false){
  const g = new THREE.Group();
  const stone = mat(0x565070), dark = mat(0x38294f);
  const body = mesh('box',[2.6*s,1.9*s,1.8*s], stone); body.position.y=0.95*s;
  const roof = mesh('cone',[1.95*s,1.1*s,4], dark); roof.position.y=2.45*s; roof.rotation.y=Math.PI/4;
  const door = mesh('box',[0.72*s,1.15*s,0.12], mat(0x1c1826)); door.position.set(0,0.62*s,0.92*s);
  const lintel = mesh('box',[1.05*s,0.18*s,0.2], dark); lintel.position.set(0,1.3*s,0.92*s);
  const fin = mesh('box',[0.12*s,0.42*s,0.12*s], dark); fin.position.y=3.1*s;
  const finC = mesh('box',[0.32*s,0.1*s,0.12*s], dark); finC.position.y=3.02*s;
  g.add(body,roof,door,lintel,fin,finC);
  if(lit){ // emissive fake only — the real point-light budget is spent on coffins + lanterns
    const slit = mesh('box',[0.12*s,0.72*s,0.06], emat(0x9955ff,0x9955ff,0.9)); slit.position.set(0,0.6*s,0.99*s);
    g.add(slit);
  }
  g.position.set(x,0,z); g.rotation.y=rand(-0.12,0.12); crook(g,0.03);
  return g;
}
// ---- in-file deco: a lane sarcophagus — a standable rhythm bump on the low road ----
function w1l1LaneTomb(G,x){
  const g = new THREE.Group();
  const base = mesh('box',[1.7,1.0,1.3], mat(0x565070)); base.position.y=0.5;
  const lid = mesh('box',[1.9,0.16,1.5], mat(0x6b6580)); lid.position.y=1.08; crook(lid,0.03);
  g.add(base,lid); g.position.set(x,0,0);
  G.scene.add(g);
  G.world.addBox(x,0,0,1.7,1.16,1.3,{}); // top 1.16 — tap jump (1.8) clears with margin
  return g;
}
// ---- in-file: the sunken-crypt stone floor (top at y=-2.4 — the descent depth; camera-safe) ----
// A missed hop in the crypt just drops onto this solid floor, never to death (hearts-always law).
function w1l1CryptFloor(G, x1, x2){
  const w = Math.abs(x2-x1), cx = (x1+x2)/2, top = -2.4;
  const slab = mesh('box',[w,1.2,6], mat(0x2c2740)); slab.position.set(cx, top-0.6, 0);
  const lip  = mesh('box',[w,0.12,6.3], mat(0x4a4368)); lip.position.set(cx, top+0.02, 0); // stone highlight (like groundX's grass lip)
  G.scene.add(slab, lip);
  G.world.addBox(cx, top-1.2, 0, w, 1.2, 6, {});
}
// ---- in-file: a candle-wisp — emissive FAKE light + micro-motion. No real point light (6-light budget). ----
function w1l1Wisp(G, x, y, z, warm){
  const col = warm ? 0xffcf87 : 0x9affd6;
  const orb  = new THREE.Mesh(geo('sph',0.15,8,7), new THREE.MeshBasicMaterial({color:col}));
  const halo = new THREE.Mesh(geo('sph',0.34,8,7), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:0.16}));
  orb.position.set(x,y,z); halo.position.set(x,y,z);
  G.scene.add(halo);
  G.ents.add({group:orb, dead:false, cull:true, t:rand(0,6), bx:x, by:y, update(dt){
    this.t+=dt;
    const nx = this.bx + Math.sin(this.t*0.9+1.3)*0.16, ny = this.by + Math.sin(this.t*1.6)*0.28;
    orb.position.set(nx,ny,z); halo.position.set(nx,ny,z);
    const s = 1+Math.sin(this.t*3.4)*0.25; orb.scale.setScalar(s); halo.scale.setScalar(s);
  }});
}
// ---- in-file: dangling burial-roots CLIMB from the crypt floor back up to the surface ----
function w1l1CryptRoots(G, x, z, y0, y1){
  const g = new THREE.Group();
  for(let y=y0; y<y1; y+=0.5){
    const seg = mesh('cyl',[0.07,0.09,0.55,5], mat(0x6b5a3a));
    seg.position.set(x+Math.sin(y*2.4)*0.12, y+0.25, z); seg.rotation.z=Math.sin(y*2.4)*0.18;
    g.add(seg);
    if(rand()<0.45){ const lf = mesh('sph',[0.13,6,5], mat(0x5f8a3a)); lf.position.set(x+Math.sin(y*2.4)*0.12+rand(-0.18,0.18), y+0.25, z+0.08); lf.scale.set(1.2,0.4,0.8); g.add(lf); }
  }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, y0, z, 1.1, (y1-y0), 1.2, {type:'climb'});
}

function buildW1L1(G){
  const S = G.scene;
  levelBegin(G);
  G.camMinY = -3.5;   // the Sunken Crypt descends to y=-2.4 — let the camera follow down into it

  // ================= ACT 1 — Graveyard (x -8..48; layout intact, threats retuned) =================
  groundX(G, -8, 68, 0x3f5c4c); // one seamless slab: act 1 (-8..48) + crypt row west (48..68)
  const decoA = new THREE.Group();
  fenceRun(decoA, -8, -3.4, 48, -3.4, 22);
  for(let i=0;i<12;i++) decoA.add(grave(rand(-6,46), rand(-5.5,-2.2)));
  for(let i=0;i<7;i++) decoA.add(deadTree(rand(-6,47), rand(-8,-4.5), rand(0.8,1.4)));
  for(let i=0;i<8;i++) decoA.add(pumpkinDeco(rand(-6,46), rand(-2.8,-1.6), rand(0.5,0.9), rand(0,1)<0.4));
  for(let i=0;i<5;i++) decoA.add(grave(rand(0,46), rand(2.6,3.4)));
  for(let i=0;i<4;i++) decoA.add(pumpkinDeco(rand(2,44), rand(2.4,3.2), rand(0.6,1), false));
  S.add(bakeGroup(decoA));
  signPost(G, 3, 1.8, -0.25, INPUT.isTouch ?
    'Welcome to the Pumpkin Patch! Joystick: run left/right. A: jump (tap twice to double jump!). B: spin your candy bag.' :
    'Welcome to the Pumpkin Patch! A/D or arrows run - SPACE jump (twice = double jump!) - J spin attack - K ground pound.');
  signPost(G, 22, 1.8, 0.2, 'Boos are shy - face them and they freeze! Turn your back... and they creep. Bonk or stomp them for candy.');
  G.ents.add(new BonkLantern(G, 8, 1.3, 0, 'shield'));
  // singles with breathing room (owner: "chaos but not cluttered enemies") — the old
  // Boo-15 and Hopper-43 are cut; motion (crows, arcs, the bat set-piece) fills the air
  G.ents.add(new Boo(G, 10, 0, 0, {speed:1.8, range:9}));
  G.ents.add(new Boo(G, 26, 0, 0, {speed:2.0, range:8}));   // range capped — chase stops 7u shy of the coffin
  G.ents.add(new Hopper(G, 34, 0, 0, {aggroR:6}));          // can't reach a player standing at the coffin (41)
  candyLine(G, [[5,0.8,0],[12,0.8,0]], 5);
  candyLine(G, [[20,0.8,0],[27,1.6,0],[31,0.8,0]], 6);
  G.ents.add(new Rat(G, 30, 0, 0));                          // hunts the candy trail; dashes never near the coffin pocket

  // ---- HIGH ROAD: gravestone-top hops above the lane — extra candy + the heart ----
  hayBale(G, 13, 0, 0, 2, 1.2, 1.6);
  platform(G, 16.5, 2.2, 0, 2.4, 3, 0x6b6580);
  platform(G, 21, 2.9, 0, 2.4, 3, 0x6b6580);
  platform(G, 25.5, 3.4, 0, 2.6, 3, 0x6b6580);
  platform(G, 30, 3.4, 0, 2.6, 3, 0x6b6580);
  platform(G, 34.5, 3.0, 0, 2.4, 3, 0x6b6580);
  platform(G, 39, 2.6, 0, 2.4, 3, 0x6b6580);
  platform(G, 44, 2.1, 0, 2.6, 3, 0x6b6580);
  candyLine(G, [[16.5,3.0,0],[21,3.7,0],[25.5,4.2,0]], 6);
  candyLine(G, [[30,4.2,0],[34.5,3.8,0],[39,3.4,0],[44,2.9,0]], 7);
  G.ents.add(new Heart(30, 4.4, 0));
  // the Patch's first swoop bat guards the prize — learn the squeak-then-dive rule here
  // (patrol 29.5..34.5: sweeps the heart plats but its dive envelope ends ~6u shy of the coffin)
  G.ents.add(new SwoopBat(G, 32, 3.9, 0, {range:2.5, aggroR:4}));
  G.ents.add(new Checkpoint(23, 0, 1.2, 0)); // lantern 1 — keeps its act-1 beat
  // CLEAR PATCH: the coffin pocket (35..48) holds no threat routes — gamble in peace
  const cofA = new CursedCoffin(41, 0, -1.6, 0.3);
  G.ents.add(cofA); G.coffins.push(cofA);
  G.world.addBox(41, 0, -1.6, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(45, 0, 1.2, 1)); // lantern 2 — keeps its after-the-coffin beat
  // ambient life: crows that flap off when approached (motion in the quiet pockets)
  G.ents.add(new Crow(20, 1.35, -2.2));
  G.ents.add(new Crow(44.5, 0.72, -3.3)); // fence-sitter by lantern 2 — startles as you pass
  // the quiet prop: a tidy little grave with a plate of cookies on it (story-readers will know)
  const gGrave = new THREE.Group();
  const gs = mesh('box',[0.7,1,0.2], mat(0x7a7490)); gs.position.y=0.5;
  const gt = mesh('cyl',[0.35,0.35,0.2,10], mat(0x7a7490)); gt.rotation.x=Math.PI/2; gt.position.y=1;
  const plate = mesh('cyl',[0.22,0.25,0.04,10], mat(0xf4f4f8)); plate.position.set(0,0.06,0.55);
  for(let i=0;i<3;i++){ const ck = mesh('sph',[0.05,5,5], mat(0xc27a3f)); ck.position.set(rand(-0.1,0.1),0.1,0.55+rand(-0.08,0.08)); gGrave.add(ck); }
  const flowers = mesh('sph',[0.1,6,5], mat(0xff5ea8)); flowers.position.set(0.25,0.1,0.45);
  gGrave.add(gs,gt,plate,flowers);
  gGrave.position.set(33,0,-2.2);
  S.add(gGrave);

  // ================= ACT 2 — THE OLD CRYPTS =================
  // ---- Crypt Row west (x 48..68): mausoleums rise, sarcophagi bump the lane ----
  const decoB = new THREE.Group();
  fenceRun(decoB, 48, -3.4, 67, -3.4, 9);
  for(let i=0;i<7;i++) decoB.add(grave(rand(49,66), rand(-5.5,-2.2)));
  for(let i=0;i<4;i++) decoB.add(deadTree(rand(49,66), rand(-8,-4.5), rand(0.9,1.4)));
  decoB.add(w1l1Crypt(53,-5,1.35,true), w1l1Crypt(58,-6.6,1.1,false), w1l1Crypt(63,-4.6,1.7,false)); // the big silhouettes
  for(let i=0;i<3;i++) decoB.add(grave(rand(50,66), rand(2.6,3.4)));                                  // foreground framing
  for(let i=0;i<2;i++) decoB.add(pumpkinDeco(rand(50,65), rand(2.4,3.2), rand(0.5,0.9), false));
  S.add(bakeGroup(decoB));
  signPost(G, 50, 1.8, -0.2, 'The Old Crypts. Grimmwick\'s oldest families rest here - LIGHTLY. Gravestones make fine stepping stones... follow the candy over the gaps.');
  w1l1LaneTomb(G, 52);
  w1l1LaneTomb(G, 62);
  G.ents.add(new Boo(G, 55, 0, 0, {speed:2.1, range:9}));   // ONE Boo owns the crypt row — the tombs and arcs keep it busy
  candyLine(G, [[50.5,1.2,0],[52,2.2,0],[53.5,1.2,0]], 4);  // arc over tomb 1 — teaches the bump-hop
  candyLine(G, [[56.5,0.8,0],[60.8,1.2,0],[62.3,2.2,0],[64.2,0.9,0]], 6);
  G.ents.add(new BonkLantern(G, 65.8, 1.3, 0, 'candy'));    // a treat before the first open grave

  // ---- Friendly gap 1 (x 68..76): the gravestone-hop rhythm, introduced safely ----
  // (edge gaps 1.0-1.6u, rises ≤0.7 — pure rhythm, the finale's language without the danger)
  platform(G, 70.8, 0.7, 0, 2.4, 4, 0x6b6580);
  platform(G, 74.2, 1.2, 0, 2.4, 4, 0x6b6580);
  candyLine(G, [[67.5,1.4,0],[70.8,1.9,0],[74.2,2.4,0],[76.8,1.2,0]], 6); // the line IS the lesson

  // ---- Crypt courtyard (x 76..96): roof-run high stretch, Hopper pocket, coffin 2 ----
  groundX(G, 76, 96, 0x3f5c4c);
  const decoC = new THREE.Group();
  fenceRun(decoC, 77, -3.4, 95, -3.4, 9);
  for(let i=0;i<5;i++) decoC.add(grave(rand(78,94), rand(-5.5,-2.6)));
  for(let i=0;i<3;i++) decoC.add(deadTree(rand(78,94), rand(-8,-5), rand(0.9,1.3)));
  decoC.add(w1l1Crypt(83,-2.6,1.05,false), w1l1Crypt(92,-2.7,1.5,true)); // rooflines pace the high plats — "you're running the crypt roofs"
  { // the ivy obelisk — the monument the climb-vine grows up (deco; the vine itself carries the climb volume)
    const oShaft = mesh('box',[0.7,3.4,0.7], mat(0x565070)); oShaft.position.set(89.6,1.7,-0.85);
    const oCap = mesh('cone',[0.55,0.6,4], mat(0x38294f)); oCap.position.set(89.6,3.68,-0.85); oCap.rotation.y=Math.PI/4;
    crook(oShaft,0.02);
    decoC.add(oShaft,oCap);
  }
  for(let i=0;i<2;i++) decoC.add(grave(rand(79,94), rand(2.6,3.4)));
  for(let i=0;i<2;i++) decoC.add(pumpkinDeco(rand(79,93), rand(2.4,3.2), rand(0.5,0.9), false));
  S.add(bakeGroup(decoC));
  G.ents.add(new Rat(G, 78, 0, 0));                          // candy-thief on the low trail — comedy-motion, not a gang
  G.ents.add(new Hopper(G, 84, 0, 0, {aggroR:6}));           // ONE hopper owns the courtyard; can't reach the coffin pocket
  candyLine(G, [[79,0.8,0],[84,0.8,0],[89,0.8,0]], 6);
  // ambient life: the courtyard crow watches from a crypt roof
  G.ents.add(new Crow(83, 2.15, -2.5));
  // ---- CLIMB BEAT (owner: "fun climbing levels too"): ivy up the old obelisk — a playful
  // alternate way onto the roof-run mid-stretch (climb, then a boosted hop east onto the 92 roof)
  buildVine(G, 89.6, 0, 3.6);
  // coffin 2 — tucked off-path in the lee of the lit crypt; CLEAR PATCH: nearest threat
  // route (hopper zone edge 90 / bat patrol edge 99.5) stays 6u+ away — gamble in peace
  const cofB = new CursedCoffin(93, 0, -1.8, -0.25);
  G.ents.add(cofB); G.coffins.push(cofB);
  G.world.addBox(93, 0, -1.8, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(94.5, 0, 1.2, 2)); // lantern 3 — NEW, mid-act, right before the junction gap

  // ---- HIGH STRETCH: crypt-roof run (x 80.5..113) — richer candy + the guarded heart ----
  // entry: sarcophagus step (1.16) → roofs climb 2.1→2.7→3.2→3.4; every rise ≤1.0, edge gaps ≤2.5
  w1l1LaneTomb(G, 80.5);
  platform(G, 83,   2.1, 0, 2.6, 3, 0x565070);
  platform(G, 87.5, 2.7, 0, 2.6, 3, 0x565070);
  platform(G, 92,   3.2, 0, 2.6, 3, 0x565070);
  platform(G, 97,   3.4, 0, 2.6, 3, 0x565070);   // crosses ABOVE friendly gap 2 — the junction moment:
  platform(G, 101.5,4.2, 0, 2.6, 3, 0x565070);   // low-roaders SEE this candy + heart overhead (4.2: leaves full headroom over the 102.5 hop stone — no exact-change ceiling)
  platform(G, 106,  2.9, 0, 2.6, 3, 0x565070);   // descent back to the lane over solid ground
  platform(G, 110.5,2.3, 0, 2.6, 3, 0x565070);
  candyLine(G, [[80.5,2.3,0],[83,3.3,0]], 3);    // candy telegraphs the way up (owner rule)
  candyLine(G, [[87.5,3.9,0],[92,4.4,0],[97,4.6,0]], 5);
  candyLine(G, [[101.5,4.6,0],[106,4.1,0],[110.5,3.5,0]], 5);
  G.ents.add(new Heart(101.5, 5.8, 0));          // the guarded prize — the bat's beat sweeps right through it

  // ---- Friendly gap 2 (x 96..105): the hops escalate — higher stones, air pressure ----
  platform(G, 99,   0.9, 0, 2.4, 4, 0x6b6580);
  platform(G, 102.5,1.6, 0, 2.4, 4, 0x6b6580);
  candyLine(G, [[96.5,1.6,0],[99,2.1,0],[102.5,2.8,0],[105.5,1.1,0]], 6);
  // ONE swoop bat owns the junction as a telegraphed set-piece — it pressures the low hops
  // AND the heart plats above (deterministic patrol, phase 0; squeak learned in act 1).
  // Patrol 99.5..105.5: sweeps the whole gap, dive envelope never reaches coffin 2 or lantern 3.
  G.ents.add(new SwoopBat(G, 102.5, 5.6, 0, {range:3, aggroR:4, period:3.4}));   // patrol line clears the raised junction platform

  // ---- The Lane east (x 105..132): mastery lane — mixed pockets, shield before the test ----
  groundX(G, 105, 132, 0x3f5c4c);
  const decoD = new THREE.Group();
  fenceRun(decoD, 106, -3.4, 131, -3.4, 12);
  for(let i=0;i<7;i++) decoD.add(grave(rand(107,130), rand(-5.5,-2.2)));
  for(let i=0;i<4;i++) decoD.add(deadTree(rand(107,130), rand(-8,-4.5), rand(0.9,1.4)));
  decoD.add(w1l1Crypt(113,-5.4,1.8,false), w1l1Crypt(122,-6,1.3,true)); // the row recedes toward the bridge
  for(let i=0;i<3;i++) decoD.add(grave(rand(108,129), rand(2.6,3.4)));
  for(let i=0;i<2;i++) decoD.add(pumpkinDeco(rand(108,128), rand(2.4,3.2), rand(0.5,0.9), false));
  S.add(bakeGroup(decoD));
  // two singles, sequential beats: hop the hopper, then out-stare the last Boo — whose
  // chase stops at 131, so the CRYPT FORK ahead can be READ in peace (observation is the counter-skill)
  G.ents.add(new Hopper(G, 112, 0, 0, {aggroR:6}));
  G.ents.add(new Boo(G, 124, 0, 0, {speed:2.2, range:7}));
  candyLine(G, [[107.5,0.8,0],[113,0.8,0]], 5);
  candyLine(G, [[121.5,0.8,0],[126.5,0.8,0]], 5);
  G.ents.add(new BonkLantern(G, 120, 1.3, 0, 'shield'));   // fixed drop: one hit of mercy heading into the crypt
  // (the ROAD CLOSED bridge-trap sign now lives in the crypt reconvergence, right before its bridge)
  // the quiet prop's counterpart: the same tidy grave, deeper in — plate empty now, just
  // crumbs and a white flower laid in thanks. Nobody signposts it. Story-readers gasp.
  const gGrave2 = new THREE.Group();
  const g2s = mesh('box',[0.7,1,0.2], mat(0x7a7490)); g2s.position.y=0.5;
  const g2t = mesh('cyl',[0.35,0.35,0.2,10], mat(0x7a7490)); g2t.rotation.x=Math.PI/2; g2t.position.y=1;
  const plate2 = mesh('cyl',[0.22,0.25,0.04,10], mat(0xf4f4f8)); plate2.position.set(0,0.06,0.55);
  for(let i=0;i<4;i++){ const cr = mesh('sph',[0.025,4,4], mat(0xc27a3f)); cr.position.set(rand(-0.12,0.12),0.08,0.55+rand(-0.1,0.1)); gGrave2.add(cr); }
  const flower2 = mesh('sph',[0.09,6,5], mat(0xf4f4f8)); flower2.position.set(-0.02,0.1,0.55);
  gGrave2.add(g2s,g2t,plate2,flower2);
  gGrave2.position.set(128.5,0,-2.3);
  S.add(gGrave2);

  // ================= ACT 3 — THE SUNKEN CRYPT (x 132..196) =================
  // FRESH IDEA — a real new act, not more lane: the graveyard OPENS and you may DESCEND into a
  // candle-lit underground crypt (foreshadows District 2's catacombs). ROUTE CHOICE: scenic CRYPT
  // below (low-ceiling traverse, coffin-LID rhythm on a fixed clock, wisps, the quiet prop, a heart
  // + richer candy, a root-climb out) vs the honest BOARDWALK up top (safe, less candy). The two run
  // parallel and SEE each other, then reconverge (checkpoint 4 + mercy) before the transplanted bridge.

  // ---- Approach & the FORK (x 132..137): step DOWN into the crypt, or hop UP to the boards ----
  groundX(G, 132, 137, 0x3f5c4c);
  signPost(G, 134, 1.8, -0.2, INPUT.isTouch ?
    'THE SUNKEN CRYPT. Step DOWN into the dark for richer pickings (hold UP on the roots to climb back out) - or keep to the BOARDS up top if you like your head where it is.' :
    'THE SUNKEN CRYPT. Step DOWN into the dark for richer pickings - or keep to the BOARDS up top if you like your head where it is.');
  candyLine(G, [[133,0.8,0],[135.5,0.8,0]], 3);
  G.ents.add(new Crow(136, 0.72, -3.1)); // startles as you reach the fork

  // ---- the crypt shell: floor collider + baked deco (back wall, arches, floor litter, silhouettes) ----
  w1l1CryptFloor(G, 140, 171.5);
  const decoCrypt = new THREE.Group();
  for(let bx=138; bx<171.5; bx+=3.4){ // masonry back wall — encloses the crypt (the underground read vs open sky)
    const block = mesh('box',[3.2,rand(4.2,5.0),0.8], mat(pick([0x2a2440,0x322b4c,0x241f3a])));
    block.position.set(bx+rand(-0.2,0.2), -0.2, -3.3); crook(block,0.02);
    decoCrypt.add(block);
  }
  for(const ax of [137, 170.5]){ // stone arches framing the descent (137) and the climb-out (170.5)
    const pL = mesh('box',[0.5,3.0,0.8], mat(0x4a4368)); pL.position.set(ax-0.9,-0.9,-0.4);
    const pR = pL.clone(); pR.position.x = ax+0.9;
    const lin = mesh('box',[2.6,0.5,0.9], mat(0x565070)); lin.position.set(ax,0.7,-0.4); crook(lin,0.03);
    decoCrypt.add(pL,pR,lin);
  }
  { const c1=mesh('cyl',[0.4,0.5,2.2,7], mat(0x1f1b30)); c1.position.set(146,-1.4,2.7); crook(c1,0.08);   // foreground broken columns (z>0 framing)
    const c2=mesh('cyl',[0.4,0.5,1.4,7], mat(0x1f1b30)); c2.position.set(163,-1.8,2.8); crook(c2,0.1);
    decoCrypt.add(c1,c2); }
  S.add(bakeGroup(decoCrypt));
  const decoCryptFloor = new THREE.Group(); // crypt-floor litter at the crypt DEPTH (own baked pass — never floats over the surface)
  for(let i=0;i<16;i++){
    const x = rand(141,170), z = rand(-2.4,2.4), r = rand();
    if(r<0.4){ const bone = mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,-2.33,z); decoCryptFloor.add(bone); }
    else if(r<0.7){ const rock = mesh('sph',[rand(0.1,0.2),6,5], mat(0x3a3358)); rock.position.set(x,-2.3,z); rock.scale.y=0.6; decoCryptFloor.add(rock); }
    else { const sl = mesh('box',[rand(0.4,0.7),0.08,rand(0.4,0.7)], mat(0x4a4368)); sl.position.set(x,-2.36,z); crook(sl,0.06); decoCryptFloor.add(sl); }
  }
  S.add(bakeGroup(decoCryptFloor));

  // ---- DESCENT STEPS (crypt route, x 137..140): short safe drops down into the dark ----
  platform(G, 137.6, -0.6, 0, 1.5, 4, 0x565070);
  platform(G, 138.6, -1.2, 0, 1.5, 4, 0x4f4a68);
  platform(G, 139.6, -1.8, 0, 1.5, 4, 0x4a4568);
  candyLine(G, [[137.6,-0.1,0],[138.6,-0.7,0],[139.6,-1.3,0],[141,-1.9,0]], 5); // the trail leads DOWN — teaches the descent

  // ---- LOW PASSAGE (x 141..148): "MIND YOUR HEAD" — a real stone ceiling, no room to jump ----
  { const m = mesh('box',[7,0.6,4], mat(0x322b4c)); m.position.set(144.5,-0.2,0);
    const lip = mesh('box',[7,0.1,4.2], mat(0x241f3a)); lip.position.set(144.5,-0.5,0);
    S.add(m, lip);
    G.world.addBox(144.5, -0.5, 0, 7, 0.6, 4, {}); }  // underside -0.5 over the -2.4 floor: walk-through only
  let mindHead=false;
  G.world.addBox(140.9, -2.4, 0, 1.0, 1.8, 3, {type:'trigger', onTouch:()=>{
    if(mindHead || G.state!=='play') return; mindHead=true;
    UI.toast('🪦 MIND YOUR HEAD - no room to jump down here!');
  }});
  candyLine(G, [[142,-1.7,0],[144.5,-1.7,0],[147,-1.7,0]], 4); // head-height candy through the tunnel
  G.ents.add(new Rat(G, 144, -2.4, 0)); // a crypt rat scurries the tunnel (steals only LOOSE candy - comedy, not a wall)

  // ---- WISP CHAMBER + the quiet prop (x 148..152): the ceiling opens; candle-wisps light it ----
  w1l1Wisp(G, 149.5, -1.4, -0.6, false);
  w1l1Wisp(G, 151.5, -1.0, 0.4, false);
  w1l1Wisp(G, 150.5, -1.8, -1.2, true);
  { // THE ONE NEW QUIET PROP (never signposted): a child's little hobby-horse left at a small tomb,
    // a burnt-down candle still lit beside it, one wrapped candy set down in visit. Story-readers gasp.
    const prop = new THREE.Group();
    const tomb = mesh('box',[1.1,0.5,0.7], mat(0x565070)); tomb.position.y=0.25;
    const rockerL = mesh('box',[0.5,0.06,0.05], mat(0x7a5a3a)); rockerL.position.set(0,0.53,0.12);
    const rockerR = rockerL.clone(); rockerR.position.z=-0.12;
    const hbody = mesh('box',[0.34,0.1,0.14], mat(0x9a6f42)); hbody.position.set(0,0.62,0);
    const hstick = mesh('cyl',[0.03,0.03,0.34,5], mat(0x7a5a3a)); hstick.position.set(0.14,0.72,0); hstick.rotation.z=-0.5;
    const hhead = mesh('sph',[0.09,7,6], mat(0x9a6f42)); hhead.position.set(0.27,0.86,0); hhead.scale.set(1,1.1,0.8);
    const hear = mesh('cone',[0.04,0.09,4], mat(0x7a5a3a)); hear.position.set(0.24,0.96,0);
    const stub = mesh('cyl',[0.05,0.06,0.14,6], mat(0xf0e8d0)); stub.position.set(-0.4,0.57,0.15);
    const flame = new THREE.Mesh(geo('sph',0.05,6,6), new THREE.MeshBasicMaterial({color:0xffcf87})); flame.position.set(-0.4,0.68,0.15); flame.scale.y=1.5;
    const treat = mesh('box',[0.09,0.05,0.05], emat(PAL.candy1,PAL.candy1,0.4)); treat.position.set(0.35,0.53,0.2);
    prop.add(tomb,rockerL,rockerR,hbody,hstick,hhead,hear,stub,flame,treat);
    prop.position.set(150.5,-2.4,-0.9);
    S.add(prop);
    // flicker (own material — safe). NO `group` on this entity: flame stays parented to `prop`
    // at its correct world spot — only its scale animates (a group here would reparent it to the scene root).
    G.ents.add({dead:false, cull:false, t:rand(0,6), update(dt){ this.t+=dt; flame.scale.set(1+Math.sin(this.t*9)*0.2, 1.5+Math.sin(this.t*11)*0.3, 1); }});
  }

  // ---- COFFIN-LID RHYTHM (x 152..160): 3 lids rise & sink on a FIXED clock — ride the wave ----
  // deterministic phases from level start; the solid crypt floor below means a missed hop just drops you, never kills.
  const lidMesh = ()=>{ const g=new THREE.Group();
    const slabm = mesh('box',[1.7,0.3,2.0], mat(0x4a2a3d)); slabm.position.y=0.15;
    const c1 = mesh('box',[0.16,0.1,1.0], emat(0xc9a227,0x7a5a10,0.4)); c1.position.y=0.3;
    const c2 = mesh('box',[0.68,0.1,0.16], emat(0xc9a227,0x7a5a10,0.4)); c2.position.set(0,0.3,-0.32);
    g.add(slabm,c1,c2); S.add(g); return g; };
  G.world.addMover(1.7,0.3,2.2, t=>new THREE.Vector3(152.5, -1.7+Math.sin(t*1.3)*0.7, 0), lidMesh);
  G.world.addMover(1.7,0.3,2.2, t=>new THREE.Vector3(155.8, -1.7+Math.sin(t*1.3+2.1)*0.7, 0), lidMesh);
  G.world.addMover(1.7,0.3,2.2, t=>new THREE.Vector3(159.1, -1.7+Math.sin(t*1.3+4.2)*0.7, 0), lidMesh);
  candyLine(G, [[152.5,-0.5,0],[155.8,-0.5,0],[159.1,-0.5,0]], 6); // candy rides the lid peaks — times your hops
  G.ents.add(new Skelly(G, 156, -2.4, 0, {px:2.4})); // the crypt's skeleton — telegraphed rattle->lunge; learn to defeat one
  G.ents.add(new Heart(160.5, -1.5, 0)); // the scenic route's guaranteed reward

  // ---- ASCENT (x 160..171): roots dangle into the crypt — CLIMB back to the surface (climbing is fun) ----
  w1l1Wisp(G, 165, -1.6, 0.5, true);
  candyLine(G, [[162,-2.0,0],[166,-2.0,0],[169.5,-1.6,0]], 5);
  w1l1CryptRoots(G, 170.5, 0, -2.4, 0.6);            // climb volume + dangling-root visual (crypt floor -> surface)
  candyLine(G, [[170.5,-0.4,0],[170.5,0.6,0]], 2);   // a couple candies up the roots — telegraphs the climb-up
  G.world.addBox(171.6, -2.4, 0, 0.5, 2.4, 3, {});   // crypt east wall (top flush with the surface at y0): the roots are the ONLY way out — never a walk-off pit

  // ---- BOARDWALK — the honest SURFACE route over the crypt (x 138..170): safe, less candy ----
  // board0 sits clear of the approach-ground edge (137) so the fork is a clean up-hop, not a wall;
  // the mid boards arch UP over the lid chamber so their undersides never head-bonk a lid-peak hop.
  const boardX=[138.4,141.1,144.7,148.3,151.9,155.5,159.1,162.7,166.3,169.9];
  const boardY=[0.8, 1.0, 1.1, 1.0, 1.4, 1.5, 1.4, 0.9, 0.8, 0.6];
  for(let i=0;i<boardX.length;i++) platform(G, boardX[i], boardY[i], 0, 2.4, 2.6, 0x5a4a70);
  candyLine(G, [[139.3,1.5,0],[142.9,1.8,0],[146.5,1.9,0]], 4);
  candyLine(G, [[153.7,2.0,0],[157.3,1.9,0],[160.9,1.7,0],[164.5,1.6,0]], 5);
  G.ents.add(new Crow(148.3, 1.72, 0));   // perched on the boards — flaps off as you cross
  G.ents.add(new Crow(162.7, 1.62, 0));
  G.ents.add(new SwoopBat(G, 152, 2.6, 0, {range:3.5, aggroR:4, period:3.6})); // one bat works the air over the boards (squeak learned in act 1)

  // ---- RECONVERGENCE (x 171..196): both routes rejoin; checkpoint 4 + mercy before the bridge ----
  groundX(G, 171.2, 196, 0x3f5c4c);
  const decoRC = new THREE.Group();
  fenceRun(decoRC, 173, -3.4, 195, -3.4, 11);
  for(let i=0;i<6;i++) decoRC.add(grave(rand(174,194), rand(-5.5,-2.4)));
  for(let i=0;i<3;i++) decoRC.add(deadTree(rand(174,194), rand(-8,-4.5), rand(0.9,1.4)));
  decoRC.add(w1l1Crypt(180,-5.2,1.4,false), w1l1Crypt(190,-6,1.2,true)); // the crypt row rises back toward the surface
  for(let i=0;i<2;i++) decoRC.add(grave(rand(175,193), rand(2.6,3.3)));
  S.add(bakeGroup(decoRC));
  G.ents.add(new Hopper(G, 178, 0, 0, {aggroR:6}));      // one last bounce before the bridge
  candyLine(G, [[173.5,0.8,0],[178,0.8,0]], 5);
  candyLine(G, [[182,0.8,0],[186,0.8,0]], 4);
  G.ents.add(new BonkLantern(G, 184, 1.3, 0, 'shield')); // mercy: one hit before the trap
  G.ents.add(new Checkpoint(188, 0, 1.2, 3));            // lantern 4 — NEW, right before the finale (fair walk-back for the bridge trap)
  // observation is the counter-skill: readers get the warning, skimmers meet the bridge (relocated to sit before its bridge)
  signPost(G, 192.5, 1.8, 0.3, 'ROAD CLOSED AHEAD - old bridge awaiting repairs since 1926. Kindly hop the gravestones instead. - Grimmwick Dept. of Roads & Hauntings');

  // ================= FINALE — Gap 3: gravestone hops (x 196..206, transplanted +64) =================
  // TRAP ROUTE: a tempting rotten bridge crosses low... and crumbles.
  // (tell: darker, crooked planks — the honest route is the gravestone hops above)
  {
    const planks = new THREE.Group();
    for(let i=0;i<6;i++){
      const p = mesh('box',[1.6,0.18,2.2], mat(0x2e2138));
      p.position.set(196.8+i*1.7, 0.1, 0);
      p.rotation.z = rand(-0.09,0.09); p.rotation.y = rand(-0.06,0.06);
      planks.add(p);
    }
    S.add(planks);
    const bridgeCol = G.world.addBox(201, -0.3, 0, 10.5, 0.4, 2.4, {});
    let trapped = false;
    G.world.addBox(201, 0.1, 0, 9.5, 0.4, 2.4, {type:'trigger', onTouch:()=>{   // low trigger: only bridge-WALKERS spring it — the honest hop route above stays clear (observation wins)
      if(trapped || G.state!=='play') return;
      trapped = true;
      AUDIO.noise({t:0.5,vol:0.3,fFrom:700,fTo:90});
      G.camc.shake(0.25,0.4);
      UI.toast('💀 ...that bridge did NOT sound healthy.');
      setTimeout(()=>{
        const i = G.world.cols.indexOf(bridgeCol);
        if(i>=0) G.world.cols.splice(i,1);
        G.ents.add({group:planks, dead:false, cull:false, t:0, update(dt){
          this.t+=dt;
          planks.children.forEach((p,j)=>{ p.position.y -= (8+j)*dt; p.rotation.z += dt*(j%2?2:-2); });
          if(this.t>2) this.dead=true;
        }});
        AUDIO.poundHit();
      }, 350);
    }});
    candyLine(G, [[198,1,0],[204,1,0]], 4); // the bait
  }
  platform(G, 198.5, 0.6, 0, 2.4, 4, 0x6b6580);
  platform(G, 202, 1.4, 0, 2.4, 4, 0x6b6580);
  platform(G, 205, 2.2, 0, 2.4, 4, 0x6b6580);
  candyLine(G, [[198.5,1.8,0],[202,2.6,0],[205,3.4,0]], 5);

  // ================= Landing strip → the relight arch (x 206..214) =================
  groundX(G, 206, 214, 0x3f5c4c);
  const decoE = new THREE.Group();
  fenceRun(decoE, 206, -3.4, 214, -3.4, 4);
  decoE.add(grave(207.5,-2.6), grave(211,-3), deadTree(209.5,-5.5,1.1), grave(208.5,2.8));
  S.add(bakeGroup(decoE));
  candyLine(G, [[206.5,1.8,0],[209,0.9,0],[211,0.8,0]], 4); // glide-down trail off the last gravestone
  exitGate(G, 212);

  levelFinish(G, -8, 214, null);
  // clutter split around every void (gaps 68..76, 96..105; the crypt opening 137..171; the
  // bridge gap 196..206) — no props float over open graves, crypt, or the trap approach
  buildClutter(G, -8, 47, 'grave');
  buildClutter(G, 48, 67, 'grave');
  buildClutter(G, 77, 95, 'grave');
  buildClutter(G, 106, 130, 'grave');
  buildClutter(G, 132, 136, 'grave');   // crypt approach (short — the fork is at 137)
  buildClutter(G, 173, 195, 'grave');   // reconvergence surface lane
  buildClutter(G, 207, 213, 'grave');   // finale landing strip (was 143..149, +64)
  return {spawnX:0, exitX:212};
}
function updateW1L1(G, dt){ updateLevelCommon(G, dt); }
W1_LEVELS.push({id:'w1l1', district:'w1', name:'GRAVEYARD LANE', build:buildW1L1, update:updateW1L1, parTime:180});

// ============ W1-L1 — GRAVEYARD LANE ============
// District 1's teaching level, grown to a full course (owner: "make the levels longer").
// ACT 1 (x -8..48): the original opening — spawn runway, signs, first Boos, high road,
//   the coffin at 41. Design intact; retuned to the owner's "chaos but not cluttered
//   enemies" band (singles, breathing room) and the coffin CLEAR-PATCH law (no threat
//   routes within ~6u of a coffin — opening one is a deliberate, safe act).
// ACT 2 (x 48..132): THE OLD CRYPTS — the graveyard deepens. Mausoleum rows loom in the
//   background, sarcophagi bump the lane, two FRIENDLY gravestone-hop gaps (68..76 and
//   96..105) twist-then-escalate the hop rhythm the finale will test, a crypt-roof high
//   stretch carries a bat-guarded heart, an ivy-clad obelisk offers a playful CLIMB up
//   to the roof-run mid-stretch, and a second coffin sits tucked off-path (clear pocket).
//   Encounters stay D1-warm singles with motion between them: crows, candy arcs, bobbing
//   lanterns, glowing crypt doors — chaos from overlapping SYSTEMS, not enemy density.
// FINALE (x 132..150): the rotten-bridge trap gap + honest gravestone hops + landing
//   strip + relight arch — the old 48..66 finale transplanted +84, unchanged in design.
// Threats: 11 over ~150u (~4-5 per 60u, D1 band). Every gameplay placement is fixed
//   coordinates; rand() (level-seeded) appears only in baked deco scatter.

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

function buildW1L1(G){
  const S = G.scene;
  levelBegin(G);

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
  // chase stops at 131, so the bridge can be READ in peace (observation is the counter-skill)
  G.ents.add(new Hopper(G, 112, 0, 0, {aggroR:6}));
  G.ents.add(new Boo(G, 124, 0, 0, {speed:2.2, range:7}));
  candyLine(G, [[107.5,0.8,0],[113,0.8,0]], 5);
  candyLine(G, [[121.5,0.8,0],[126.5,0.8,0]], 5);
  G.ents.add(new BonkLantern(G, 120, 1.3, 0, 'shield'));   // fixed drop: one hit of mercy before the finale
  // observation is the counter-skill: readers get the warning, skimmers meet the bridge
  signPost(G, 127.5, 1.8, 0.3, 'ROAD CLOSED AHEAD - old bridge awaiting repairs since 1926. Kindly hop the gravestones instead. - Grimmwick Dept. of Roads & Hauntings');
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

  // ================= FINALE — Gap 3: gravestone hops (x 132..142, transplanted +84) =================
  // TRAP ROUTE: a tempting rotten bridge crosses low... and crumbles.
  // (tell: darker, crooked planks — the honest route is the gravestone hops above)
  {
    const planks = new THREE.Group();
    for(let i=0;i<6;i++){
      const p = mesh('box',[1.6,0.18,2.2], mat(0x2e2138));
      p.position.set(132.8+i*1.7, 0.1, 0);
      p.rotation.z = rand(-0.09,0.09); p.rotation.y = rand(-0.06,0.06);
      planks.add(p);
    }
    S.add(planks);
    const bridgeCol = G.world.addBox(137, -0.3, 0, 10.5, 0.4, 2.4, {});
    let trapped = false;
    G.world.addBox(137, 0.1, 0, 9.5, 0.4, 2.4, {type:'trigger', onTouch:()=>{   // low trigger: only bridge-WALKERS spring it — the honest hop route above stays clear (observation wins)
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
    candyLine(G, [[134,1,0],[140,1,0]], 4); // the bait
  }
  platform(G, 134.5, 0.6, 0, 2.4, 4, 0x6b6580);
  platform(G, 138, 1.4, 0, 2.4, 4, 0x6b6580);
  platform(G, 141, 2.2, 0, 2.4, 4, 0x6b6580);
  candyLine(G, [[134.5,1.8,0],[138,2.6,0],[141,3.4,0]], 5);

  // ================= Landing strip → the relight arch (x 142..150) =================
  groundX(G, 142, 150, 0x3f5c4c);
  const decoE = new THREE.Group();
  fenceRun(decoE, 142, -3.4, 150, -3.4, 4);
  decoE.add(grave(143.5,-2.6), grave(147,-3), deadTree(145.5,-5.5,1.1), grave(144.5,2.8));
  S.add(bakeGroup(decoE));
  candyLine(G, [[142.5,1.8,0],[145,0.9,0],[147,0.8,0]], 4); // glide-down trail off the last gravestone
  exitGate(G, 148);

  levelFinish(G, -8, 150, null);
  // clutter split around the three gap voids (68..76, 96..105, 132..142) — no props
  // floating over open graves, and the trap approach stays clean to read (130..142)
  buildClutter(G, -8, 47, 'grave');
  buildClutter(G, 48, 67, 'grave');
  buildClutter(G, 77, 95, 'grave');
  buildClutter(G, 106, 130, 'grave');
  buildClutter(G, 143, 149, 'grave');
  return {spawnX:0, exitX:148};
}
function updateW1L1(G, dt){ updateLevelCommon(G, dt); }
W1_LEVELS.push({id:'w1l1', district:'w1', name:'GRAVEYARD LANE', build:buildW1L1, update:updateW1L1, parTime:130});

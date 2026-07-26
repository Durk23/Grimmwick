// ============ LEVEL 1-3 — THE CROOKED BARN (expanded to a full ~4-min course) ============
// District 1's climbing showcase. Signature gimmick: BARN VERTICALITY + CLIMBING —
// introduced (hay-stair + web-net + silo vine, Act 1), twisted (farmyard coop hops under
// the open sky), escalated (the OLD barn: loft → branching web-net climb → rafters, with
// a bouncy hay mountain as both safety net and express route), mastered (the hay-chute
// slide that fires you out the far door)... and then ONE fresh act before the finale:
// ACT 3 — THE HAY-WAGON DASH: the level's single horizontal MOMENTUM beat (DKC-minecart
// energy after all that climbing). Dash the threshing floor hopping deterministic ROLLING
// BALES, take the granary web → boosted-hop onto the high BEAM CATWALK (the route choice),
// then ride the flush HAY-WAGON FERRY across the thresher pit into the moonlit run.
// Layout: Act 1 barn+silo x -8..30 · farmyard+coop 30..66 · gap 66..69.4 ·
// the OLD barn 69.4..94 (+chute to 95.4) · ACT 3 hay-wagon dash 94..156 (pit 118.5..127.5)
// · moonlit run 156..164, arch at 162.
function buildW1L3(G){
  const S = G.scene;
  levelBegin(G);

  // ---- ground: entry pad (-8) through barn/silo and the farmyard to the gap lip (66) ----
  groundX(G, -8, 42, 0x4c3f68);
  groundX(G, 42, 66, 0x49603f);          // the farmyard opens up — moonlit grass

  // ---- baked deco: fences either side of the barn + fg silhouettes ----
  const decoC = new THREE.Group();
  fenceRun(decoC, -8, -3.4, 2, -3.4, 5);
  fenceRun(decoC, 20, -3.4, 42, -3.4, 10);
  for(let i=0;i<4;i++) decoC.add(deadTree(pick([rand(-7,0), rand(28,41)]), rand(-8,-4.5), rand(0.9,1.4)));
  for(let i=0;i<5;i++) decoC.add(pumpkinDeco(rand(-7,41), rand(-3,-1.8), rand(0.5,0.9), rand(0,1)<0.35));
  for(let i=0;i<4;i++) decoC.add(pumpkinDeco(rand(-4,40), rand(2.4,3.2), rand(0.6,1), false));
  S.add(bakeGroup(decoC));

  // ---- hay-stair climb up to the loft (shifted -1.5 from strict rebase so spawn x=0 is clear) ----
  hayBale(G, -5, 0, 0, 2.2, 1.25, 1.6, 0.1);
  hayBale(G, -2, 1.25, 0, 2.2, 1.25, 1.6, -0.1);
  hayBale(G, 1, 2.5, 0, 2.2, 1.2, 1.6);

  // ---- the crooked barn ----
  const barn = new THREE.Group();
  const bwall = mesh('box',[16,7.5,0.6], mat(0x7a3040)); bwall.position.set(11,3.75,-3.2);
  const broofL = mesh('box',[9,0.5,4], mat(0x54324a)); broofL.position.set(7.2,7.6,-2.2); broofL.rotation.z=0.35;
  const broofR = mesh('box',[9,0.5,4], mat(0x54324a)); broofR.position.set(14.8,7.6,-2.2); broofR.rotation.z=-0.35;
  const bwin = mesh('circ',[0.9,10], emat(PAL.window,PAL.window,0.9)); bwin.position.set(11,5.4,-2.85);
  barn.add(bwall,broofL,broofR,bwin);
  S.add(barn);
  platform(G, 11, 3.8, 0, 14, 3.4, 0x8a3848);   // the loft
  platform(G, 11, 6.4, 0, 6, 3, 0x54324a);      // upper loft
  G.ents.add(new Spider(G, 6, 4.6, 0, {groundY:0}));   // pushed +3u off spawn so the first drop-spider isn't right on top of you
  G.ents.add(new Spider(G, 7, 5.4, 0, {groundY:3.8}));    // these two hang over the loft — drop onto its slab, not through it
  G.ents.add(new Spider(G, 14, 5.6, 0, {groundY:3.8}));
  // rafter bats — a barn's rightful tenants, and the loft run's air lane
  G.ents.add(new SwoopBat(G, 8, 5.6, 0, {range:3.5, period:3}));
  G.ents.add(new SwoopBat(G, 26, 4.2, 0, {range:5, phase:1.7}));
  G.ents.add(new Boo(G, 20, 0, 0, {speed:2.1}));
  G.ents.add(new Rat(G, 30, 0, 0));                     // barn rat, obviously
  G.ents.add(new Rat(G, 9, 0, 0));
  G.ents.add(new Skelly(G, 11, 3.8, 0, {px:4}));  // loft patroller
  candyLine(G, [[-5,2,0],[1,4,0],[7,5.2,0]], 6);
  candyLine(G, [[6,4.8,0],[15,4.8,0]], 5);        // loft run — visible from the ground route
  G.ents.add(new Heart(11, 7.6, 0));              // upper-loft prize, guarded by webs
  // honest re-entry to the loft from the right side: a spider-lent web-net
  buildWebNet(G, 18.6, 0.4, 1.8, 3.6);
  G.ents.add(new Checkpoint(16, 0, 1.4, 0));
  G.ents.add(new BonkLantern(G, 20, 1.4, 0, 'bat'));
  signPost(G, 18, 1.8, 0.25, 'Something shiny sits on the silo... bat wings sure would help. Webs above - watch your head!');

  // ---- the silo + its gold ----
  const silo = mesh('cyl',[1.8,2,7.5,12], mat(0x9aa7b8)); silo.position.set(25,3.75,0); S.add(silo);
  const siloCap = mesh('cone',[2,1.4,12], mat(0x6a3c8f)); siloCap.position.set(25,8.2,0); S.add(siloCap);
  G.world.addBox(25,0,0, 3.7,7.5,3.7,{});
  buildVine(G, 22.6, 0.4, 7.8);   // climb the silo vine — the honest route to the gold
  G.ents.add(new GoldPumpkin(25, 9.3, 0, 1));
  G.ents.add(new Boo(G, 28, 0, 0, {speed:2.3}));
  G.ents.add(new Checkpoint(30, 0, 1.4, 1));

  // ---- run-out past the silo: never a dead stretch ----
  G.ents.add(new Hopper(G, 35, 0, 0, {aggroR:8}));
  candyLine(G, [[32,0.8,0],[38,0.8,0]], 4);
  G.ents.add(new Crow(34, 0.95, -2.4));

  // cobwebs in the barn corners
  for(const wx of [4.5, 17.5]){
    const web = new THREE.Mesh(geo('circ',0.7,3), new THREE.MeshBasicMaterial({color:0xd8d8e8, transparent:true, opacity:0.28, side:THREE.DoubleSide}));
    web.position.set(wx, 7, -1.6);
    web.rotation.z = wx<11 ? -0.6 : 0.6;
    S.add(web);
  }

  // ================= ACT 2a: HENRIETTA'S FARMYARD (x 42..66) =================
  // Breathing room under the open sky: the coop-hop toy, the rat pair working the
  // candy corn, and a cursed coffin sitting in its own quiet clearing.
  const decoD = new THREE.Group();
  fenceRun(decoD, 42, -3.4, 65.5, -3.4, 11);
  for(let i=0;i<3;i++) decoD.add(deadTree(rand(43,64), rand(-8,-4.8), rand(0.85,1.3)));
  for(let i=0;i<4;i++) decoD.add(pumpkinDeco(rand(43,64), rand(-3,-1.9), rand(0.5,0.85), rand(0,1)<0.35));
  for(let i=0;i<3;i++) decoD.add(pumpkinDeco(rand(44,64), rand(2.4,3.2), rand(0.6,0.95), false));
  // the chicken coop (collider added below — its flat roof is the first hop)
  const coopBody = mesh('box',[2.6,2.0,2.4], mat(0x7a4a34)); coopBody.position.set(51.5,1.0,-0.8);
  const coopRoof = mesh('box',[3.0,0.16,2.8], mat(0x54324a)); coopRoof.position.set(51.5,2.08,-0.8);
  const coopDoor = mesh('box',[0.7,0.9,0.1], mat(0x2c1c28)); coopDoor.position.set(51.2,0.45,0.42);
  const coopRamp = mesh('box',[0.6,0.08,1.1], mat(PAL.woodD)); coopRamp.position.set(51.2,0.18,0.95); coopRamp.rotation.x=0.5;
  const trough = mesh('box',[1.4,0.3,0.5], mat(PAL.woodD)); trough.position.set(54.6,0.15,-1.9);
  decoD.add(coopBody,coopRoof,coopDoor,coopRamp,trough);
  // awning posts under the perch platform
  for(const [px,pz] of [[53.5,-1],[55.1,-1],[53.5,1],[55.1,1]]){
    const post = mesh('cyl',[0.06,0.08,2.4,5], mat(PAL.woodD)); post.position.set(px,1.2,pz); decoD.add(post);
  }
  // the girls (baked hens — one supervises from the roof)
  const hen = (x,z,ry)=>{
    const h = new THREE.Group();
    const body = mesh('sph',[0.2,8,6], mat(0xe8e2d4)); body.position.y=0.2; body.scale.set(1,0.9,1.25);
    const head = mesh('sph',[0.11,7,6], mat(0xe8e2d4)); head.position.set(0,0.42,0.16);
    const comb = mesh('cone',[0.05,0.1,4], mat(0xd94f4f)); comb.position.set(0,0.55,0.14);
    const beak = mesh('cone',[0.035,0.1,4], mat(0xd9a02e)); beak.rotation.x=Math.PI/2; beak.position.set(0,0.42,0.3);
    const tail = mesh('cone',[0.09,0.2,5], mat(0xcfc5b2)); tail.rotation.x=-0.9; tail.position.set(0,0.32,-0.22);
    h.add(body,head,comb,beak,tail);
    h.position.set(x,0,z); h.rotation.y=ry;
    return h;
  };
  decoD.add(hen(50.4,-1.9,0.6), hen(52.9,-2.1,-1.2), hen(49.1,-1.6,2.6));
  const roofHen = hen(52.3,-1.4,2.2); roofHen.position.y=2.16; decoD.add(roofHen);
  S.add(bakeGroup(decoD));

  signPost(G, 43.5, 1.8, 0.25, "Henrietta's yard. Mind the girls - and COUNT YOUR CANDY. The rats have been ambitious lately.");
  G.ents.add(new Crow(44.5, 0.95, -2.4));
  candyLine(G, [[45,0.8,0],[49.5,0.8,0]], 6);       // loose candy corn on the ground...
  G.ents.add(new Rat(G, 46, 0, 0));                 // ...and the pair working it (sign-telegraphed set-piece)
  G.ents.add(new Rat(G, 48.5, 0, 0));

  // the coop-hop: bale → flat roof → feed-shed awning — every rise comfy (1.2 / 0.96 / 0.44)
  hayBale(G, 49.7, 0, 0.4, 2, 1.2, 1.5, 0.15);
  G.world.addBox(51.5, 0, -0.8, 2.6, 2.16, 2.4, {});   // coop collider — top aligns with the roof slab
  platform(G, 54.3, 2.6, 0, 2, 2.4, 0x6b4a2e);          // the feed-shed awning
  candyLine(G, [[49.7,2.0,0],[51.5,3.1,0],[54.3,3.7,0]], 5);
  G.ents.add(new BonkLantern(G, 56.5, 3.4, 0, 'shield'));
  // micro-motion: the weathervane rooster turns lazily in the night breeze
  const vane = new THREE.Group();
  const vp = mesh('cyl',[0.03,0.03,0.7,4], mat(0x2c2140)); vp.position.y=0.35;
  const vArrow = new THREE.Group();
  const vShaft = mesh('box',[0.7,0.04,0.04], mat(0x2c2140));
  const vHead = mesh('cone',[0.06,0.16,4], mat(0x2c2140)); vHead.rotation.z=-Math.PI/2; vHead.position.x=0.38;
  const vRoo = mesh('cone',[0.09,0.22,5], mat(0x2c2140)); vRoo.position.set(-0.25,0.12,0);
  vArrow.add(vShaft,vHead,vRoo); vArrow.position.y=0.72;
  vane.add(vp,vArrow);
  vane.position.set(51.5, 2.16, -0.8);
  S.add(vane);
  G._w1l3Vane = vArrow;

  // the coffin clearing — deliberately quiet (clear-patch: no patrol within ~10u)
  const cofB = new CursedCoffin(58.5, 0, -1.9, 0.3);
  G.ents.add(cofB); G.coffins.push(cofB);
  G.world.addBox(58.5, 0, -1.9, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(60.5, 0, 1.4, 2));      // lantern between the barns
  signPost(G, 64.5, 1.8, -0.2, "The OLD barn. Nobody mucks it out anymore, on account of the... everything in there. Webs make fine ladders, and the hay chute off the high beams is the fastest way out. - H.");
  candyLine(G, [[62.5,0.8,0],[64.5,0.8,0]], 3);
  G.ents.add(new Crow(65.3, 0.95, 2.3));            // startles off the gap lip as you line up the jump

  // ---- the yard gap (x 66..69.4) — District 1 friendly, arc of candy shows the line ----
  candyLine(G, [[65.2,1.2,0],[67.7,2.4,0],[70.2,1.2,0]], 5);

  // ================= ACT 2b: THE OLD BARN (x 69.4..91) =================
  groundX(G, 69.4, 94, 0x4c3f68);
  const barnB = new THREE.Group();
  const owall = mesh('box',[21,10,0.6], mat(0x6b2836)); owall.position.set(80.5,5,-3.4);
  const oroofL = mesh('box',[12,0.5,4], mat(0x54324a)); oroofL.position.set(74.9,10.0,-2.3); oroofL.rotation.z=0.30;
  const oroofR = mesh('box',[12,0.5,4], mat(0x54324a)); oroofR.position.set(86.1,10.0,-2.3); oroofR.rotation.z=-0.30;
  const owinL = mesh('circ',[0.8,10], emat(PAL.window,PAL.window,0.9)); owinL.position.set(75.5,7.6,-3.05);
  const owinR = mesh('circ',[0.8,10], emat(PAL.window,PAL.window,0.9)); owinR.position.set(85.5,7.6,-3.05);
  barnB.add(owall,oroofL,oroofR,owinL,owinR);
  // door frames both ends — the far pair is the doorway the chute fires you through
  for(const dx of [70.2, 91.2]){
    const postB = mesh('box',[0.5,6.4,0.5], mat(0x54324a)); postB.position.set(dx,3.2,-1.3);
    const postF = mesh('box',[0.5,6.4,0.5], mat(0x3a2030)); postF.position.set(dx,3.2,1.4);   // fg silhouette
    const lintel = mesh('box',[0.8,0.6,3.6], mat(0x54324a)); lintel.position.set(dx,6.9,0);
    barnB.add(postB,postF,lintel);
  }
  // the quiet prop (never signposted): a milking stool in the corner — wool, crossed
  // needles, and a scarf knitted exactly halfway. Somebody's gran used to sit here.
  const quiet = new THREE.Group();
  const stool = mesh('cyl',[0.3,0.34,0.36,7], mat(PAL.woodD)); stool.position.y=0.18;
  const yarn = mesh('sph',[0.13,7,6], mat(0xd97a9e)); yarn.position.set(0.42,0.12,0.1);
  const needle1 = mesh('cyl',[0.012,0.012,0.5,4], mat(0xd8d4c8)); needle1.position.set(0.1,0.42,0); needle1.rotation.z=0.6;
  const needle2 = needle1.clone(); needle2.rotation.z=-0.4; needle2.position.x=0.16;
  const scarf = mesh('box',[0.4,0.05,0.5], mat(0x8a3848)); scarf.position.set(0,0.39,0.05); scarf.rotation.y=0.3;
  quiet.add(stool,yarn,needle1,needle2,scarf);
  quiet.position.set(70.8,0,-2.6); quiet.rotation.y=0.5;
  barnB.add(quiet);

  // THE HAY MOUNTAIN — blocks the ground lane, but it's SOFT: a bounce pad that
  // catches rafter falls with a boing and doubles as the express route up (bounce-gated)
  const m1 = mesh('sph',[2.8,10,8], mat(0xc2a24f)); m1.position.set(85.6,1.0,0); m1.scale.set(1.15,0.8,1.1);
  const m2 = mesh('sph',[1.7,9,7], mat(0xcfae55)); m2.position.set(84.9,2.2,-0.3); m2.scale.set(1.1,0.7,1);
  const m3 = mesh('sph',[1.4,8,7], mat(0xc2a24f)); m3.position.set(86.4,2.3,0.2); m3.scale.set(1.05,0.7,1);
  const mband = mesh('box',[3.4,0.14,3.2], mat(0x8a6f2e)); mband.position.set(85.6,1.5,0);
  const fork = mesh('cyl',[0.035,0.045,2.6,5], mat(PAL.woodD)); fork.position.set(84.1,3.2,0.9); fork.rotation.z=0.45;
  barnB.add(m1,m2,m3,mband,fork);
  // the hoist beam over the rafters (its rope sways — see below)
  const hoistBeam = mesh('box',[2.6,0.3,0.3], mat(PAL.woodD)); hoistBeam.position.set(87.6,9.3,-0.6);
  barnB.add(hoistBeam);

  // ---- THE HAY CHUTE: one long ramp visual, stair-stepped colliders — fast, safe, loud ----
  const slTop = {x:89.0, y:6.2}, slBot = {x:95.4, y:0.5};
  const sdx = slBot.x-slTop.x, sdy = slTop.y-slBot.y, sLen = Math.hypot(sdx,sdy);
  const ramp = mesh('box',[sLen,0.35,2.6], mat(0xc2a24f));
  ramp.position.set((slTop.x+slBot.x)/2, (slTop.y+slBot.y)/2-0.22, 0);
  ramp.rotation.z = -Math.atan2(sdy,sdx);
  barnB.add(ramp);
  for(const rz of [-1.2, 1.2]){
    const rail = mesh('box',[sLen,0.14,0.14], mat(0x8a6f2e));
    rail.position.set((slTop.x+slBot.x)/2, (slTop.y+slBot.y)/2+0.05, rz);
    rail.rotation.z = -Math.atan2(sdy,sdx);
    barnB.add(rail);
  }
  S.add(bakeGroup(barnB));
  const nStep = 13;
  for(let i=0;i<nStep;i++){
    const t = i/(nStep-1);
    G.world.addBox(slTop.x+sdx*t, (slTop.y-sdy*t)-0.5, 0, 0.95, 0.5, 2.4, {});
  }
  G.world.addBox(85.6, 0, 0, 4.6, 3.4, 5, {type:'bounce', bounce:13});  // the mountain collider
  hayBale(G, 96.6, 0, -2.2, 1.6, 0.9, 1.2, 0.5);   // spilled hay where the chute lets out

  // ---- the climb: bales → loft → the branching web-net → rafters ----
  G.ents.add(new Spider(G, 70.3, 4.6, 0, {groundY:0}));   // doorway greeter — drops onto open ground
  hayBale(G, 72, 0, 0, 2.2, 1.25, 1.6, 0.08);
  hayBale(G, 74.2, 1.25, 0, 2.2, 1.25, 1.6, -0.08);
  platform(G, 78.2, 3.6, 0, 7.5, 3.2, 0x8a3848);          // the old loft
  candyLine(G, [[75.5,4.4,0],[81,4.4,0]], 5);
  G.ents.add(new Skelly(G, 78, 3.6, 0, {px:2.6}));        // its lone patroller
  // THE GREAT WEB — climbable floor-to-rafters; at the top you CHOOSE: hop LEFT to the
  // moon shelf, or RIGHT onto the beams toward the heart and the chute
  buildWebNet(G, 82.2, 0.4, 1.8, 7.2);
  candyLine(G, [[82.2,1.8,0.4],[82.2,6.6,0.4]], 4);       // rhythm up the strands
  platform(G, 79.8, 7.4, 0, 2.2, 2.2, 0x54324a);          // branch LEFT: the moon shelf
  G.ents.add(new BonkLantern(G, 79.8, 8.6, 0, 'moon'));   // ...bonk it, then ride the chute unstoppable
  candyLine(G, [[79.4,8.2,0],[80.4,8.2,0]], 3);
  platform(G, 88.4, 6.2, 0, 2.6, 2.2, 0x54324a);          // branch RIGHT: the rafter beam — offset PAST the mountain's bounce column
  // (a second beam used to roof the bounce apex — the express route must never be sealed by its own target)
  candyLine(G, [[85.6,4.4,0],[86.8,5.6,0],[88.2,6.4,0]], 4);   // traces the mountain-bounce: launch, steer right, land flush with the chute
  G.ents.add(new Heart(88.4, 7.5, 0));                    // the risk prize, high on the rafter beam
  G.ents.add(new SwoopBat(G, 86.5, 7.9, 0, {range:3.4, period:3.1, phase:0.8}));  // owns the high air
  candyLine(G, [[89.6,6.9,0],[92.2,4.4,0],[94.8,1.6,0]], 7);   // the chute trail — combo-pitch heaven
  // the hoist rope sways gently over the beams (micro-motion)
  G._w1l3Hoist = new THREE.Group();
  const rope = mesh('cyl',[0.03,0.03,2.1,4], mat(0x8a6f2e)); rope.position.y=-1.05;
  const hook = mesh('tor',[0.16,0.04,5,10], mat(0x9aa7b8)); hook.position.y=-2.2;
  G._w1l3Hoist.add(rope,hook);
  G._w1l3Hoist.position.set(86.6,9.15,-0.6);
  S.add(G._w1l3Hoist);
  // cobwebs in the old barn's high corners
  for(const [wx,wy] of [[72.6,8.6],[88.4,8.8]]){
    const web = new THREE.Mesh(geo('circ',0.8,3), new THREE.MeshBasicMaterial({color:0xd8d8e8, transparent:true, opacity:0.25, side:THREE.DoubleSide}));
    web.position.set(wx, wy, -1.9);
    web.rotation.z = wx<80.5 ? -0.6 : 0.6;
    S.add(web);
  }

  // ================= ACT 3: THE HAY-WAGON DASH (x 94..156) — the FRESH idea =================
  // After a whole level of climbing, one pure MOMENTUM act: threshing-floor dash + rolling
  // bales + a high-beam catwalk route + a real moving hay-wagon ferry over the thresher pit.
  // The chute from the old barn fires you straight in here at speed. Everything deterministic.

  // rolling-bale hazard: a hay roll that trundles a FIXED cycle across the floor. It never
  // blocks (hazard = pass-through) — HOP it (a tap clears its 0.8 top) or eat one heart and
  // keep flowing. Mesh is synced to the collider (and rolled) in updateW1L3.
  G._w1l3Bales = [];
  const rollBale = (cx, z, range, speed, phase)=>{
    const r = 0.45;
    const grp = new THREE.Group();
    const barrel = mesh('cyl',[r,r,1.5,12], mat(0xc2a24f)); barrel.rotation.x=Math.PI/2;
    const seam1 = mesh('box',[0.09,0.09,1.5], mat(0x8a6f2e)); seam1.position.set(r-0.02,0,0);
    const seam2 = mesh('box',[0.09,0.09,1.5], mat(0x8a6f2e)); seam2.position.set(0,r-0.02,0);
    const capL = mesh('cyl',[r+0.02,r+0.02,0.06,12], mat(0x9a7f3e)); capL.rotation.x=Math.PI/2; capL.position.z=0.75;
    const capR = capL.clone(); capR.position.z=-0.75;
    grp.add(barrel,seam1,seam2,capL,capR);
    grp.position.set(cx, r, z);
    S.add(grp);
    const bm = G.world.addMover(1.0,0.8,1.6, t=>new THREE.Vector3(cx+Math.sin(t*speed+phase)*range, 0, z), null);
    bm.col.type='hazard'; bm.col.damage=1;    // roll ON a fixed clock from level start — same every run
    G._w1l3Bales.push({col:bm.col, mesh:grp, r});
  };

  // ---- Floor A: the threshing yard (INTRODUCE) x 94..118.5 ----
  groundX(G, 94, 118.5, 0x49603f);             // moonlit stubble, tying back to Henrietta's yard
  const decoF = new THREE.Group();
  fenceRun(decoF, 94, -3.4, 118, -3.4, 12);
  for(let i=0;i<3;i++) decoF.add(deadTree(rand(95,117), rand(-8,-4.8), rand(0.85,1.3)));
  for(let i=0;i<4;i++) decoF.add(pumpkinDeco(rand(95,117), rand(-3,-1.9), rand(0.5,0.85), rand(0,1)<0.3));
  for(let i=0;i<3;i++) decoF.add(pumpkinDeco(rand(96,116), rand(2.4,3.2), rand(0.6,0.95), false));
  const gsilo = mesh('cyl',[1.5,1.7,5.5,12], mat(0x9aa7b8)); gsilo.position.set(100,2.75,-1.7);   // granary backing the web
  const gcap = mesh('cone',[1.7,1.1,12], mat(0x6a3c8f)); gcap.position.set(100,6.1,-1.7);
  decoF.add(gsilo, gcap);
  S.add(bakeGroup(decoF));
  signPost(G, 96.5, 1.8, 0.2, "THE THRESHING RUN. The old hay-wagon still rides the rail across the pit - hop the loose bales, and MIND YOUR HEAD on the low rafters!");
  G.ents.add(new Checkpoint(99, 0, 1.4, 3));    // CP4 (idx 3) — safe BEFORE any dash or the ferry gap
  candyLine(G, [[95.4,0.9,0],[97.8,0.9,0]], 4);

  // HIGH ROAD (the route choice): granary web → boosted-hop onto the beam catwalk over the
  // whole dash. Richer pickings; the low road SEES this candy overhead. Climb-then-launch toy.
  signPost(G, 100.2, 1.8, -0.2, "Quick hands take the HIGH BEAMS: up the granary webbing, then LEAP right for the catwalk.");
  buildWebNet(G, 100, 0.4, 1.8, 4.2);                       // climb to ~4.0
  platform(G, 105.5, 4.8, 0, 7, 2.4, 0x54324a);            // the beam catwalk (surface 4.8) — 2u launch gap off the web
  candyLine(G, [[100,4.4,0],[102,5.2,0],[103.8,5.3,0]], 3); // traces the boosted hop web→catwalk
  candyLine(G, [[102.5,5.4,0],[108.5,5.4,0]], 6);           // the reward run up top
  G.ents.add(new Heart(105.5, 5.7, 0));
  G.ents.add(new BonkLantern(G, 108.5, 5.9, 0, 'shield'));  // armor for the ferry, high-road only
  G.ents.add(new Spider(G, 105, 6.8, 0, {groundY:4.8}));    // barn tenant — drops onto the catwalk slab, not through it
  candyLine(G, [[109,5.0,0],[110.5,3.0,0],[112,0.9,0]], 5); // the high road spills back down to the floor at 112

  // LOW ROAD dash
  G.ents.add(new Boo(G, 104, 0, 0, {speed:2.2, range:7}));
  rollBale(106, 0, 2.2, 1.3, 0.0);                          // INTRODUCE the bale-hop
  candyLine(G, [[104,0.9,0],[106,2.2,0],[108,0.9,0]], 5);   // arc telegraphs the hop
  G.ents.add(new Hopper(G, 110, 0, 0, {aggroR:6}));
  candyLine(G, [[110.5,0.9,0],[113,0.9,0]], 3);
  G.ents.add(new SwoopBat(G, 115.5, 3.6, 0, {range:3.5, phase:0.7}));   // air lane over the boarding
  candyLine(G, [[115,0.9,0],[117.6,0.9,0]], 3);            // pulls you fully onto the wagon

  // ---- the HAY-WAGON FERRY (centrepiece) x 118.5..127.5 — a flush moving platform ----
  // A shuttle on a fixed clock (like w1l4's ghost ferries): wait for it at the near dock,
  // walk aboard, ride across the thresher pit, step off at the far dock. Surface is flush at
  // y=0 so boarding and landing are seamless (movers land within reach). Pit is 9u — far too
  // wide to jump, so the wagon is the only way across.
  const decoBr = new THREE.Group();
  for(const dx of [118.5, 127.5]){
    const post = mesh('box',[0.4,4.2,0.4], mat(PAL.woodD)); post.position.set(dx, 2.1, -1.4);
    const postF = mesh('box',[0.35,3.6,0.35], mat(0x3a2030)); postF.position.set(dx, 1.8, 1.5);   // fg silhouette
    decoBr.add(post, postF);
  }
  for(const rx of [120.5, 123, 125.5]){                     // covered-run rafters, well above the rider (atmosphere + light pools)
    const beam = mesh('box',[0.3,0.3,3.6], mat(PAL.woodD)); beam.position.set(rx, 3.9, -0.2);
    const lantern = mesh('sph',[0.15,7,6], emat(PAL.window,PAL.window,1)); lantern.position.set(rx, 3.5, -0.4);
    const lstr = mesh('cyl',[0.02,0.02,0.35,4], mat(0x2c2140)); lstr.position.set(rx, 3.72, -0.4);
    decoBr.add(beam, lantern, lstr);
  }
  const ridge = mesh('box',[9.4,0.2,0.3], mat(0x54324a)); ridge.position.set(123, 4.15, -1.2);
  decoBr.add(ridge);
  for(const gx of [121,125]){ const gear = mesh('cyl',[1.1,1.1,0.3,10], mat(0x241a30)); gear.rotation.x=Math.PI/2; gear.position.set(gx,-4.5,-0.5); decoBr.add(gear); }  // dark thresher gears deep in the pit — reads "don't fall in"
  S.add(bakeGroup(decoBr));
  const wagonMesh = ()=>{
    const g = new THREE.Group();
    const bed = mesh('box',[4.8,0.35,2.3], mat(0x6b4a2e)); bed.position.y=0.33;      // top ~y0, flush with the collider
    const skid = mesh('box',[4.6,0.16,2.1], mat(0x54341f)); skid.position.y=0.1;
    const railB = mesh('box',[4.8,0.5,0.14], mat(0x54341f)); railB.position.set(0,0.72,-1.05);
    const railF = mesh('box',[4.8,0.26,0.14], mat(0x3a2416)); railF.position.set(0,0.6,1.05);   // low front board — Pip shows above it
    for(const sx of [-2.2,-0.8,0.8,2.2]){ const st=mesh('cyl',[0.06,0.06,0.5,5], mat(0x54341f)); st.position.set(sx,0.7,-1.05); g.add(st); }
    const hay = mesh('box',[3.4,0.5,0.85], mat(0xc2a24f)); hay.position.set(0,0.82,-0.95);       // load rides at the back
    const hayB = mesh('box',[3.5,0.12,0.95], mat(0x8a6f2e)); hayB.position.set(0,0.82,-0.95);
    for(const wx of [-1.7,1.7]){
      const wheel = mesh('cyl',[0.6,0.6,0.2,12], mat(0x2c1c28)); wheel.rotation.x=Math.PI/2; wheel.position.set(wx,-0.02,0.85);
      const hub = mesh('cyl',[0.14,0.14,0.24,8], mat(0x9a7f3e)); hub.rotation.x=Math.PI/2; hub.position.set(wx,-0.02,0.85);
      g.add(wheel,hub);
    }
    g.add(bed,skid,railB,railF,hay,hayB);
    G.scene.add(g);
    return g;
  };
  // w=5, surface flush at y=0; centre swings 120..126 (T≈7.7s) so it touches BOTH docks with ~1u overlap
  G.world.addMover(5,0.5,2.6, t=>new THREE.Vector3(123+3*Math.sin(t*0.82), -0.5, 0), wagonMesh);
  candyLine(G, [[120,0.7,0],[123,0.7,0],[126,0.7,0]], 5);   // collected as the wagon carries you through
  G.ents.add(new Crow(126.5, 2.1, -2.1));                   // startles off the far dock post as you arrive

  // ---- Floor C: the threshing run (ESCALATE → MASTER) x 127.5..156 ----
  groundX(G, 127.5, 156, 0x49603f);
  const decoG = new THREE.Group();
  fenceRun(decoG, 128, -3.4, 155.5, -3.4, 13);
  for(let i=0;i<3;i++) decoG.add(deadTree(rand(129,154), rand(-8,-4.8), rand(0.85,1.3)));
  for(let i=0;i<4;i++) decoG.add(pumpkinDeco(rand(129,154), rand(-3,-1.9), rand(0.5,0.85), rand(0,1)<0.3));
  for(let i=0;i<3;i++) decoG.add(pumpkinDeco(rand(130,153), rand(2.4,3.2), rand(0.6,0.95), false));
  const lbeam = mesh('box',[0.35,0.35,3.4], mat(PAL.woodD)); lbeam.position.set(135, 1.62, -0.2);   // the low rafter — Pip ducks under (flavor gag, no collider)
  const llant = mesh('sph',[0.16,7,6], emat(PAL.window,PAL.window,1)); llant.position.set(135, 1.3, -0.5);
  const lstr2 = mesh('cyl',[0.02,0.02,0.3,4], mat(0x2c2140)); lstr2.position.set(135, 1.55, -0.5);
  decoG.add(lbeam, llant, lstr2);
  S.add(bakeGroup(decoG));
  candyLine(G, [[128,0.9,0],[130,0.9,0]], 3);
  rollBale(131, 0, 2.2, 1.5, 1.0);
  candyLine(G, [[129,0.9,0],[131,2.2,0],[133,0.9,0]], 5);
  G.ents.add(new Boo(G, 133, 0, 0, {speed:2.3, range:7}));
  signPost(G, 134, 1.8, 0.2, "MIND YOUR HEAD! (Henrietta has lost three good hats to that beam.)");
  rollBale(137, 0, 2.0, 1.7, 2.2);                          // ESCALATE — faster, tighter to the last
  candyLine(G, [[135,0.9,0],[137,2.2,0],[139,0.9,0]], 5);
  G.ents.add(new SwoopBat(G, 138.5, 3.7, 0, {range:4, phase:1.4}));
  G.ents.add(new Hopper(G, 141, 0, 0, {aggroR:6}));
  // a playful little hay-step up-and-over (this IS the climbing level) — rhythm candy on top
  hayBale(G, 143, 0, 0, 2, 1.1, 1.5, 0.1);
  hayBale(G, 145.2, 1.1, 0, 1.8, 1.0, 1.5, -0.1);
  candyLine(G, [[143,1.7,0],[145.2,2.7,0],[147,0.9,0]], 5);
  rollBale(149, 0, 2.4, 1.5, 0.5);                          // MASTER — last hop before the door
  candyLine(G, [[147.5,0.9,0],[149,2.2,0],[150.5,0.9,0]], 5);
  candyLine(G, [[151,0.9,0],[154,0.9,0]], 4);
  signPost(G, 152, 1.8, -0.2, "The far door at last. Give the girls a wave - moonlight's just past it. - H.");

  // ================= FINALE: the moonlit run (x 156..164) — transplanted +62, unchanged =================
  groundX(G, 156, 164, 0x3f5c4c);
  const decoE = new THREE.Group();
  fenceRun(decoE, 156, -3.4, 164, -3.4, 4);
  decoE.add(deadTree(157.8,-5.5,1.15), deadTree(162.5,-6,0.95));
  decoE.add(pumpkinDeco(158.8,-2.4,0.7,true), pumpkinDeco(161.6,-2.1,0.55,false));
  decoE.add(pumpkinDeco(159.6,2.6,0.8,false), pumpkinDeco(162.8,2.4,0.6,false));
  S.add(bakeGroup(decoE));
  candyLine(G, [[158.5,0.8,0],[160.8,0.8,0]], 4);
  G.ents.add(new Hopper(G, 159.5, 0, 0, {aggroR:7}));   // one last bounce on the way to the arch
  G.ents.add(new Crow(160.5, 0.95, -2.5));

  exitGate(G, 162);
  levelFinish(G, -8, 164, null);                 // ambience spans the whole course...
  buildClutter(G, -8, 66, 'farm');               // ...clutter split so nothing floats over
  buildClutter(G, 69.4, 82.8, 'farm');           // the gap or pokes through mountain/chute
  buildClutter(G, 96.5, 118, 'farm');            // threshing floor A (clear of chute/mountain, stops before the pit)
  buildClutter(G, 127.5, 156, 'farm');           // threshing floor C (starts past the pit)
  buildClutter(G, 158, 164, 'farm');             // the moonlit finale
  return {spawnX:0, exitX:162};
}
function updateW1L3(G, dt){
  updateLevelCommon(G, dt);
  if(G._w1l3Vane) G._w1l3Vane.rotation.y = G.time*0.35 + Math.sin(G.time*0.8)*0.5;
  if(G._w1l3Hoist) G._w1l3Hoist.rotation.z = Math.sin(G.time*0.7)*0.16;
  // roll the hay bales to match their (mover-driven) collider positions
  if(G._w1l3Bales) for(const b of G._w1l3Bales){
    const cx = (b.col.min.x + b.col.max.x)/2;
    b.mesh.position.x = cx;
    b.mesh.rotation.z = -cx/b.r;
  }
}
W1_LEVELS.push({id:'w1l3', district:'w1', name:'THE CROOKED BARN', build:buildW1L3, update:updateW1L3, parTime:150});

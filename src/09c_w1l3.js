// ============ LEVEL 1-3 — THE CROOKED BARN (Section C transplant, rebased -108) ============
// The spider barn: hay-stair + web-net climbs onto the loft, ceiling droppers, the silo gold.
function buildW1L3(G){
  const S = G.scene;
  levelBegin(G);

  // ---- ground: entry pad (-8) through barn/silo to the gate apron (42) ----
  groundX(G, -8, 42, 0x4c3f68);

  // ---- baked deco: fences either side of the barn + fg silhouettes ----
  const decoC = new THREE.Group();
  fenceRun(decoC, -8, -3.4, 2, -3.4, 5);
  fenceRun(decoC, 20, -3.4, 42, -3.4, 10);
  for(let i=0;i<4;i++) decoC.add(deadTree(pick([rand(-7,0), rand(28,41)]), rand(-8,-4.5), rand(0.9,1.4)));
  for(let i=0;i<5;i++) decoC.add(pumpkinDeco(rand(-7,41), rand(-3,-1.8), rand(0.5,0.9), Math.random()<0.35));
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
  G.ents.add(new Spider(G, 3, 4.6, 0, {groundY:0}));
  G.ents.add(new Spider(G, 7, 5.4, 0, {groundY:3.8}));    // these two hang over the loft — drop onto its slab, not through it
  G.ents.add(new Spider(G, 14, 5.6, 0, {groundY:3.8}));
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

  // ---- run-out to the gate: never a dead stretch ----
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

  exitGate(G, 40);
  levelFinish(G, -8, 42, 'farm');
  return {spawnX:0, exitX:40};
}
function updateW1L3(G, dt){
  updateLevelCommon(G, dt);
}
W1_LEVELS.push({id:'w1l3', district:'w1', name:'THE CROOKED BARN', build:buildW1L3, update:updateW1L3, parTime:60});

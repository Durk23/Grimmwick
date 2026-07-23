// ============ W1-L1 — GRAVEYARD LANE ============
// Section A of the old course (x -8..48, original coordinates) + Gap 1's rotten-bridge
// trap and gravestone hops (48..58), then a landing strip to the relight arch.
function buildW1L1(G){
  const S = G.scene;
  levelBegin(G);

  // ================= Graveyard (x -8..48) =================
  groundX(G, -8, 48, 0x3f5c4c);
  const decoA = new THREE.Group();
  fenceRun(decoA, -8, -3.4, 48, -3.4, 22);
  for(let i=0;i<12;i++) decoA.add(grave(rand(-6,46), rand(-5.5,-2.2)));
  for(let i=0;i<7;i++) decoA.add(deadTree(rand(-6,47), rand(-8,-4.5), rand(0.8,1.4)));
  for(let i=0;i<8;i++) decoA.add(pumpkinDeco(rand(-6,46), rand(-2.8,-1.6), rand(0.5,0.9), Math.random()<0.4));
  for(let i=0;i<5;i++) decoA.add(grave(rand(0,46), rand(2.6,3.4)));
  for(let i=0;i<4;i++) decoA.add(pumpkinDeco(rand(2,44), rand(2.4,3.2), rand(0.6,1), false));
  S.add(bakeGroup(decoA));
  signPost(G, 3, 1.8, -0.25, INPUT.isTouch ?
    'Welcome to the Pumpkin Patch! Joystick: run left/right. A: jump (tap twice to double jump!). B: spin your candy bag.' :
    'Welcome to the Pumpkin Patch! A/D or arrows run - SPACE jump (twice = double jump!) - J spin attack - K ground pound.');
  signPost(G, 22, 1.8, 0.2, 'Boos are shy - face them and they freeze! Turn your back... and they creep. Bonk or stomp them for candy.');
  G.ents.add(new BonkLantern(G, 8, 1.3, 0, 'shield'));
  G.ents.add(new Boo(G, 10, 0, 0, {speed:1.8, range:9}));
  G.ents.add(new Boo(G, 15, 0, 0, {speed:1.9}));
  G.ents.add(new Boo(G, 26, 0, 0, {speed:2.0}));
  G.ents.add(new Hopper(G, 34, 0, 0));
  G.ents.add(new Hopper(G, 43, 0, 0, {aggroR:8}));
  candyLine(G, [[5,0.8,0],[12,0.8,0]], 5);
  candyLine(G, [[20,0.8,0],[27,1.6,0],[31,0.8,0]], 6);
  G.ents.add(new Rat(G, 38, 0, 0));

  // ---- HIGH ROAD: gravestone-top hops above the lane — extra candy + the heart, rejoins at the gap ----
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
  G.ents.add(new SwoopBat(G, 33, 3.9, 0, {range:4.5, aggroR:4.5}));
  G.ents.add(new Checkpoint(23, 0, 1.2, 0)); // District 1 curve: 2 lanterns per level
  const cofA = new CursedCoffin(41, 0, -1.6, 0.3);
  G.ents.add(cofA); G.coffins.push(cofA);
  G.world.addBox(41, 0, -1.6, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(45, 0, 1.2, 1));
  // ambient life: a crow that flaps off when approached
  G.ents.add(new Crow(20, 1.35, -2.2));
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

  // ================= Gap 1: gravestone hops (x 48..58) =================
  // TRAP ROUTE: a tempting rotten bridge crosses low... and crumbles.
  // (tell: darker, crooked planks — the honest route is the gravestone hops above)
  {
    const planks = new THREE.Group();
    for(let i=0;i<6;i++){
      const p = mesh('box',[1.6,0.18,2.2], mat(0x2e2138));
      p.position.set(48.8+i*1.7, 0.1, 0);
      p.rotation.z = rand(-0.09,0.09); p.rotation.y = rand(-0.06,0.06);
      planks.add(p);
    }
    S.add(planks);
    const bridgeCol = G.world.addBox(53, -0.3, 0, 10.5, 0.4, 2.4, {});
    let trapped = false;
    G.world.addBox(53, 0.1, 0, 9.5, 1.4, 2.4, {type:'trigger', onTouch:()=>{
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
    candyLine(G, [[50,1,0],[56,1,0]], 4); // the bait
  }
  platform(G, 50.5, 0.6, 0, 2.4, 4, 0x6b6580);
  platform(G, 54, 1.4, 0, 2.4, 4, 0x6b6580);
  platform(G, 57, 2.2, 0, 2.4, 4, 0x6b6580);
  candyLine(G, [[50.5,1.8,0],[54,2.6,0],[57,3.4,0]], 5);

  // ================= Landing strip → the relight arch (x 58..66) =================
  groundX(G, 58, 66, 0x3f5c4c);
  const decoE = new THREE.Group();
  fenceRun(decoE, 58, -3.4, 66, -3.4, 4);
  decoE.add(grave(59.5,-2.6), grave(63,-3), deadTree(61.5,-5.5,1.1), grave(60.5,2.8));
  S.add(bakeGroup(decoE));
  candyLine(G, [[58.5,1.8,0],[61,0.9,0],[63,0.8,0]], 4); // glide-down trail off the last gravestone
  exitGate(G, 64);

  levelFinish(G, -8, 66, null);
  buildClutter(G, -8, 47, 'grave');   // split around the Gap-1 void — no props floating where the trap asks you to read the ground
  buildClutter(G, 58, 66, 'grave');
  return {spawnX:0, exitX:64};
}
function updateW1L1(G, dt){ updateLevelCommon(G, dt); }
W1_LEVELS.push({id:'w1l1', district:'w1', name:'GRAVEYARD LANE', build:buildW1L1, update:updateW1L1, parTime:75});

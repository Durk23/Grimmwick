// ============ LEVEL 1-4 — THE WITCH'S GARDEN (Gap 2 + Section D transplant, rebased -138) ============
// Opens with the ghost-platform gap (and its secret), then the thorn garden to the King's gate.
// (Gap+garden sit +8 right of the strict -146 rebase so an entry runway fits before the gap.)
function buildW1L4(G){
  const S = G.scene;
  levelBegin(G);

  // ---- entry runway: solid ground under the spawn, lantern lit BEFORE the gap ----
  groundX(G, -8, 2, 0x3e5347);
  const decoR = new THREE.Group();
  fenceRun(decoR, -8, -3.4, 1, -3.4, 4);
  for(let i=0;i<2;i++) decoR.add(deadTree(rand(-7,-1), rand(-8,-4.2), rand(0.9,1.4)));
  for(let i=0;i<2;i++) decoR.add(pumpkinDeco(rand(-7,0), rand(-3,-1.9), rand(0.5,0.8), i===0));
  decoR.add(grave(rand(-5,0), rand(2.6,3.2)));
  S.add(bakeGroup(decoR));
  signPost(G, -2.2, 1.8, -0.25, 'Ghost platforms drift over the dark - they rise and sink on the night wind. Jump as they lift!');
  G.ents.add(new Checkpoint(0.6, 0, 1.3, 0));
  candyLine(G, [[1.2,1.2,0],[4,2.6,0]], 3);

  // ---- GAP 2: moving ghost platforms (x 2..14) ----
  const gpm = ()=>{ const m = new THREE.Mesh(geo('box',2.8,0.45,3), new THREE.MeshLambertMaterial({color:0xbfb8ff, transparent:true, opacity:0.75})); S.add(m); return m; };
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(5.5, 1.4+Math.sin(t*1.1)*1.2, 0), gpm);
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(10.5, 2.2+Math.sin(t*1.1+2.6)*1.2, 0), gpm);
  candyLine(G, [[5.5,3.4,0],[10.5,4.2,0]], 4);
  // THE LEAP OF FAITH (one of exactly two in the whole game): jump DOWN into the
  // second half of this gap - it looks like certain death, nothing marks it - and
  // an unseen current catches you: instant level completion with ALL rewards.
  G.world.addBox(8, -8.5, 0, 2.2, 2.5, 10, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._leaped) return;
    G._leaped = true;
    AUDIO.portal(); AUDIO.victory();
    G.addCandy(50);
    G.runPumpkins[2] = true;   // the leap awards THIS level's pumpkin — never the other levels' hunts
    G.completeLevel({leap:true});
  }});

  // ---- SECTION D: the Witch's Garden (x 14..48) ----
  groundX(G, 14, 50, 0x3e5347);
  const decoD = new THREE.Group();
  fenceRun(decoD, 14, -3.4, 48, -3.4, 14);
  for(let i=0;i<8;i++) decoD.add(deadTree(rand(15,46), rand(-8,-4.2), rand(0.9,1.5)));
  for(let i=0;i<4;i++) decoD.add(grave(rand(16,45), rand(2.6,3.3)));
  S.add(bakeGroup(decoD));
  G.ents.add(new BonkLantern(G, 16, 1.4, 0, 'shield'));  // armor up before the thorns
  thornsX(G, 20, 6);
  platform(G, 20, 1.15, 0, 2.6, 3, 0x5a4066);
  thornsX(G, 30, 6);
  platform(G, 30, 1.2, 0, 2.6, 3, 0x5a4066);
  candyLine(G, [[17,1,0],[20,2.4,0],[23,1,0]], 5);
  candyLine(G, [[27,1,0],[30,2.5,0],[33,1,0]], 5);
  G.ents.add(new Skelly(G, 18, 0, 0, {px:2}));
  G.ents.add(new Skelly(G, 25, 0, 0, {px:2.5}));
  G.ents.add(new Skelly(G, 36, 0, 0, {px:3.5}));
  G.ents.add(new Hopper(G, 32, 0, 0, {aggroR:9}));
  G.ents.add(new Boo(G, 42, 0, 0, {speed:2.6, range:13}));
  G.ents.add(new Boo(G, 44, 0, 0, {speed:2.2, range:10}));
  G.ents.add(new Heart(30, 2.3, 0));
  G.ents.add(new SwoopBat(G, 33, 3.6, 0, {range:5.5}));   // garden air patrol — thorns below, wings above
  G.ents.add(new Hopper(G, 24, 0, 0, {aggroR:7}));
  G.ents.add(new Rat(G, 38, 0, 0));                       // garden thief
  const cofB = new CursedCoffin(35, 0, 1.7, -0.4);
  G.ents.add(cofB); G.coffins.push(cofB);
  G.world.addBox(35, 0, 1.7, 1.4, 0.9, 2.4, {});
  // the ruined crypt cradling the last gold
  const cw1 = mesh('box',[0.5,1.7,3], mat(0x565070)); cw1.position.set(39.2,0.85,0); S.add(cw1);
  const cw2 = cw1.clone(); cw2.position.x=42.2; S.add(cw2);
  const croof = mesh('cone',[2.4,1.4,4], mat(0x3d3854)); croof.position.set(40.7,3.6,-1.8); croof.rotation.y=Math.PI/4; S.add(croof);
  const cbase = mesh('box',[3.6,2.4,1], mat(0x565070)); cbase.position.set(40.7,1.2,-1.9); S.add(cbase);
  G.world.addMesh(cw1); G.world.addMesh(cw2);
  G.ents.add(new GoldPumpkin(40.7, 1, 0, 2));
  G.ents.add(new Checkpoint(45, 0, 1.4, 2));
  candyLine(G, [[43,0.8,0],[46,0.8,0]], 3);
  signPost(G, 47, 1.8, -0.3, 'The Pumpkin King waits beyond this gate. He was the kindest guardian of all... until the ember burned his heart. Free him, Pip!');
  G.ents.add(new Crow(20, 1.3, -2.1));

  exitGate(G, 48);
  buildClutter(G, -7, 1, 'garden');   // runway clutter only — nothing may float over the gap
  levelFinish(G, 14, 48, 'garden');
  return {spawnX:0, exitX:48};
}
function updateW1L4(G, dt){
  updateLevelCommon(G, dt);
}
W1_LEVELS.push({id:'w1l4', district:'w1', name:"THE WITCH'S GARDEN", build:buildW1L4, update:updateW1L4, parTime:70});

// ============ W1-L2 — PUMPKIN FIELD ============
// Section B of the old course (x 58..102, rebased -64 → -6..38): mud-pit bounce field,
// the elevated high road, and the Old Shortcut warp island. Outro strip to the arch at 46.
function buildW1L2(G){
  const S = G.scene;
  levelBegin(G);

  // ================= Pumpkin field (x -6..38) + outro (38..48) =================
  groundX(G, -6, 48, 0x49603f);
  signPost(G, -4.5, 1.8, -0.3, 'Giant pumpkins are EXTRA bouncy. Ground pound one for a MEGA bounce... and keep your eyes open up there.');
  G.ents.add(new BonkLantern(G, -3, 1.3, 0, 'moon'));
  mudPitX(G, 6.5, 7); // pulled off the spawn pad (was 0..10 pre-rebase) — fair start
  // gourds sit IN the mud as stepping-bounces — clear 3-unit runway from spawn (flow rule)
  bigPumpkin(G, 4.8, -0.5, 0, 1.5);
  bigPumpkin(G, 8.2, -0.5, 0, 2.0);
  mudPitX(G, 23, 14);
  bigPumpkin(G, 19, -0.5, 0, 1.8);
  bigPumpkin(G, 25, -0.5, 0, 1.5);
  G.ents.add(new Hopper(G, 11, 0, 0, {aggroR:6})); // guards the mud-pit landing — spawn runway stays calm
  G.ents.add(new Hopper(G, 16.5, 0, 0));
  G.ents.add(new Hopper(G, 32, 0, 0, {aggroR:10}));
  G.ents.add(new Boo(G, 6, 0, 0, {speed:2.2}));
  G.ents.add(new Boo(G, 28, 0, 0, {speed:2.4}));
  G.ents.add(new Skelly(G, 15, 0, 0, {px:2.5}));
  G.ents.add(new SwoopBat(G, 30, 4.5, 0, {range:5}));   // air pressure over the second mud crossing
  G.ents.add(new Rat(G, 24, 0, 0));                     // mud-edge scavenger
  G.ents.add(new Boo(G, 38, 0, 0, {speed:2.3}));
  G.ents.add(new Heart(13.5, 1.2, 0));
  G.ents.add(new Checkpoint(12.5, 0, 1.6, 0)); // District 1 curve: 2 lanterns per level
  const decoB = new THREE.Group();
  fenceRun(decoB, -6, -3.4, 46, -3.4, 21);
  for(let i=0;i<9;i++) decoB.add(pumpkinDeco(rand(-5,36), rand(-3,-1.8), rand(0.5,1), Math.random()<0.35));
  for(let i=0;i<2;i++) decoB.add(pumpkinDeco(rand(39,45), rand(-3,-1.8), rand(0.5,0.9), Math.random()<0.35));
  for(let i=0;i<4;i++) decoB.add(deadTree(rand(-4,36), rand(-7.5,-4.5), rand(0.9,1.3)));
  const scare = new THREE.Group();
  const sPole = mesh('cyl',[0.08,0.1,2.4,6], mat(PAL.woodD)); sPole.position.y=1.2;
  const sArms = mesh('cyl',[0.06,0.06,2,5], mat(PAL.woodD)); sArms.rotation.z=Math.PI/2; sArms.position.y=1.7;
  const sHead = pumpkinDeco(0,0,0.9,true); sHead.position.y=1.9;
  const sCoat = mesh('cone',[0.7,1.2,6], mat(0x6b4a2e)); sCoat.position.y=1.1;
  scare.add(sPole,sArms,sCoat,sHead);
  scare.position.set(29,0,-2.6);
  decoB.add(scare);
  S.add(bakeGroup(decoB));
  hayBale(G, 33, 0, 0, 2, 1.2, 1.6);
  platform(G, 36, 2.9, 0, 2.6, 3, 0x4a3a6e);
  G.ents.add(new GoldPumpkin(36, 4.1, 0, 0));
  G.ents.add(new Checkpoint(37, 0, 1.6, 1));
  // ambient life: a crow right by the spawn fence
  G.ents.add(new Crow(-0.5, 0.95, -2.6));

  // ===== HIGH ROAD: elevated route above the pumpkin field (harder, richer) =====
  // enter via the web-net at -3 (or mega-bounce) — exits at the gold-pumpkin ledge (x36)
  platform(G, -3, 2.9, 0, 2.6, 3, 0x5a4066);   // was 3.2 — exactly at the double-jump ceiling (owner rule: margin, never exact)
  platform(G, 2.5, 4.2, 0, 2.4, 3, 0x5a4066);
  platform(G, 8, 5.0, 0, 2.6, 3, 0x5a4066);
  platform(G, 14, 5.5, 0, 3.0, 3, 0x5a4066);
  platform(G, 20, 5.8, 0, 2.4, 3, 0x5a4066);   // bridges the 14→26 stretch — the high road must not dead-end
  platform(G, 26, 4.7, 0, 2.6, 3, 0x5a4066);
  platform(G, 32, 3.8, 0, 2.4, 3, 0x5a4066);
  G.ents.add(new Boo(G, 14, 6.0, 0, {speed:2.0}));   // floater fits the narrow platform — a hopper would hop off and hover the void
  G.ents.add(new Boo(G, 26, 4.2, 0, {speed:2.2, range:9}));
  G.ents.add(new Spider(G, 20, 8.4, 0, {groundY:6.8}));   // drops onto the warp island's top, not through it
  candyLine(G, [[-3,4.4,0],[2.5,5.4,0],[8,6.2,0]], 6);
  candyLine(G, [[14,6.7,0],[26,5.9,0],[32,5,0]], 6);
  G.ents.add(new Heart(8, 6.4, 0));

  // climbable web-net: an honest way up to the high road
  buildWebNet(G, -3, 0.4, 1.8, 3.4);

  // ===== THE OLD SHORTCUT: floating island high above the pumpkin field =====
  platform(G, 22, 6.8, 0, 4.4, 4.4, 0x4a3a6e);
  const wpL = mesh('box',[0.45,3,0.45], mat(0x38294f)); wpL.position.set(20.9,8.3,-1);
  const wpR = wpL.clone(); wpR.position.x=23.1;
  const wpT = mesh('box',[2.9,0.5,0.6], mat(0x38294f)); wpT.position.set(22,9.9,-1); crook(wpT,0.05);
  S.add(wpL,wpR,wpT);
  const warpPm = new THREE.MeshBasicMaterial({color:PAL.purpleFx, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const warpPortal = new THREE.Mesh(geo('plane',2.1,2.9), warpPm);
  warpPortal.position.set(22,8.3,-1);
  S.add(warpPortal);
  G.warpPortal = warpPortal;
  const wl = new THREE.PointLight(0xb37dff, 50, 13); wl.position.set(22,8.6,0); S.add(wl);
  const wflame = mesh('sph',[0.2,7,6], emat(PAL.purpleFx,PAL.purpleFx,1)); wflame.position.set(22,7.6,0.6); S.add(wflame);
  G.world.addBox(22, 6.8, 0, 2.2, 2.8, 2.5, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._warpUsed) return;
    G._warpUsed = true;
    AUDIO.portal(); AUDIO.goldPumpkin();
    G.fx.spawn(new THREE.Vector3(22,7.8,0), PAL.purpleFx, 24, {speed:4, life:0.8});
    G.addCandy(35);
    G.completeLevel({warp:true});
  }});

  // ================= Outro strip → the relight arch (x 38..48) =================
  candyLine(G, [[40,0.8,0],[44,0.8,0]], 4);
  G.ents.add(new Rat(G, 42, 0, 0)); // candy-thief on the victory lap — keep it lively
  exitGate(G, 46);

  levelFinish(G, -6, 48, 'farm');
  return {spawnX:0, exitX:46};
}
function updateW1L2(G, dt){
  updateLevelCommon(G, dt);
  if(G.warpPortal) G.warpPortal.material.opacity = G._warpUsed?0.06:(0.3+Math.sin(G.time*2.6)*0.12);
}
W1_LEVELS.push({id:'w1l2', district:'w1', name:'PUMPKIN FIELD', build:buildW1L2, update:updateW1L2, parTime:60});

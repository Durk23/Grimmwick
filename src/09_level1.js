// ============ LEVEL 1 — Pumpkin Patch Panic (SIDE-SCROLL, SMW-style) ============
// The level runs along +X. The play lane is z=0; z<0 is background depth, z>0 foreground.
function grave(x,z,ry){
  const g = new THREE.Group();
  const slab = mesh('box',[0.8,1.1,0.22], mat(0x6b6580)); slab.position.y=0.55;
  const top = mesh('cyl',[0.4,0.4,0.22,10], mat(0x6b6580)); top.rotation.x=Math.PI/2; top.position.y=1.1;
  g.add(slab,top); g.position.set(x,0,z); g.rotation.y=ry!==undefined?ry:rand(-0.3,0.3); crook(g,0.05);
  return g;
}
function bigPumpkin(G, x,y,z, s, bouncy=true){
  const g = new THREE.Group();
  const body = mesh('sph',[s,12,10], emat(PAL.pumpkin, 0x7a3000, 0.25)); body.scale.set(1.12,0.82,1.12);
  for(let i=0;i<4;i++){
    const seg = mesh('sph',[s,10,9], mat(PAL.pumpkinD));
    seg.scale.set(1.05,0.78,0.25); seg.rotation.y=i*Math.PI/4;
    g.add(seg);
  }
  const stem = mesh('cyl',[s*0.1,s*0.16,s*0.4,6], mat(PAL.stem)); stem.position.y=s*0.85;
  g.add(body,stem);
  g.position.set(x, y+s*0.05, z);
  G.scene.add(g);
  const top = y + s*0.82;
  G.world.addBox(x, y-0.4, z, s*1.5, top-y+0.4, s*1.5, bouncy?{type:'bounce', bounce:13}:{});
  return g;
}
function hayBale(G,x,y,z,w=2,h=1.2,d=1.4,ry=0){
  const b = mesh('box',[w,h,d], mat(0xc2a24f));
  const band1 = mesh('box',[w+0.04,0.12,d+0.04], mat(0x8a6f2e)); band1.position.y=0;
  const g = new THREE.Group(); g.add(b,band1);
  g.position.set(x,y+h/2,z); g.rotation.y=ry;
  G.scene.add(g);
  G.world.addBox(x,y,z,w,h,d,{});
  return g;
}
function platform(G,x,y,z,w,d,color,opts={}){
  const m = mesh('box',[w,0.5,d], mat(color||0x4a3a6e));
  m.position.set(x,y-0.25,z);
  G.scene.add(m);
  G.world.addBox(x,y-0.5,z,w,0.5,d,opts);
  return m;
}
// ground running along X
function groundX(G, x1, x2, color, d=10){
  const w = Math.abs(x2-x1), cx = (x1+x2)/2;
  const m = mesh('box',[w,1.2,d], mat(color||PAL.grass));
  m.position.set(cx,-0.6,0);
  // bright grass lip on top edge (reads like SMW's ground highlight)
  const lipColor = new THREE.Color(color||PAL.grass).multiplyScalar(1.45).getHex();
  const lip = mesh('box',[w,0.14,d+0.25], mat(lipColor));
  lip.position.set(cx,0.02,0);
  G.scene.add(m, lip);
  G.world.addBox(cx,-1.2,0,w,1.2,d,{});
}
function mudPitX(G, x, w){
  const m = mesh('box',[w,0.14,5], emat(0x6b48b8, 0x4a2f90, 0.65));
  m.position.set(x,0.03,0);
  G.scene.add(m);
  G.world.addBox(x,-0.05,0,w,0.4,5,{type:'hazard',damage:1});
}
function signPost(G,x,z,ry,text){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(PAL.woodD)); pole.position.y=0.7;
  const board = mesh('box',[1.5,0.8,0.1], mat(PAL.wood)); board.position.y=1.5; crook(board,0.04);
  g.add(pole,board);
  g.position.set(x,0,z); g.rotation.y=ry;
  G.scene.add(g);
  G.signs.push({x,z,text});
}
function thornsX(G, x, w){
  const tG = new THREE.Group();
  for(let i=0;i<Math.floor(w*3);i++){
    const th = mesh('cone',[0.14,rand(0.4,0.7),5], emat(0x7a3fbf,0x5b2fa0,0.5));
    th.position.set(x+rand(-w/2,w/2), 0.25, rand(-1.6,1.6));
    th.rotation.z=rand(-0.3,0.3);
    tG.add(th);
  }
  G.scene.add(bakeGroup(tG));
  G.world.addBox(x,0,0,w,0.7,3.6,{type:'hazard',damage:1});
}

function buildLevel1(G){
  const S = G.scene;
  G.signs = [];
  G.coffins = [];
  G._warpUsed = false;
  G._leaped = false;

  // ================= SECTION A: Graveyard (x -8..48) =================
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
  const cofA = new CursedCoffin(41, 0, -1.6, 0.3);
  G.ents.add(cofA); G.coffins.push(cofA);
  G.world.addBox(41, 0, -1.6, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(45, 0, 1.2, 0));

  // ================= GAP 1: gravestone hops (x 48..58) =================
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

  // ================= SECTION B: Pumpkin Field (x 58..102) =================
  groundX(G, 58, 102, 0x49603f);
  signPost(G, 59.5, 1.8, -0.3, 'Giant pumpkins are EXTRA bouncy. Ground pound one for a MEGA bounce... and keep your eyes open up there.');
  G.ents.add(new BonkLantern(G, 61, 1.3, 0, 'moon'));
  mudPitX(G, 69, 10);
  bigPumpkin(G, 66, -0.5, 0, 1.7);
  bigPumpkin(G, 71.5, -0.5, 0, 2.0);
  mudPitX(G, 87, 14);
  bigPumpkin(G, 83, -0.5, 0, 1.8);
  bigPumpkin(G, 89, -0.5, 0, 1.5);
  G.ents.add(new Hopper(G, 64, 0, 0, {aggroR:8}));
  G.ents.add(new Hopper(G, 77, 0, 0));
  G.ents.add(new Hopper(G, 96, 0, 0, {aggroR:10}));
  G.ents.add(new Boo(G, 70, 0, 0, {speed:2.2}));
  G.ents.add(new Boo(G, 92, 0, 0, {speed:2.4}));
  G.ents.add(new Skelly(G, 79, 0, 0, {px:2.5}));
  G.ents.add(new Heart(77.5, 1.2, 0));
  const decoB = new THREE.Group();
  fenceRun(decoB, 58, -3.4, 102, -3.4, 18);
  for(let i=0;i<9;i++) decoB.add(pumpkinDeco(rand(59,100), rand(-3,-1.8), rand(0.5,1), Math.random()<0.35));
  for(let i=0;i<4;i++) decoB.add(deadTree(rand(60,100), rand(-7.5,-4.5), rand(0.9,1.3)));
  const scare = new THREE.Group();
  const sPole = mesh('cyl',[0.08,0.1,2.4,6], mat(PAL.woodD)); sPole.position.y=1.2;
  const sArms = mesh('cyl',[0.06,0.06,2,5], mat(PAL.woodD)); sArms.rotation.z=Math.PI/2; sArms.position.y=1.7;
  const sHead = pumpkinDeco(0,0,0.9,true); sHead.position.y=1.9;
  const sCoat = mesh('cone',[0.7,1.2,6], mat(0x6b4a2e)); sCoat.position.y=1.1;
  scare.add(sPole,sArms,sCoat,sHead);
  scare.position.set(93,0,-2.6);
  decoB.add(scare);
  S.add(bakeGroup(decoB));
  hayBale(G, 97, 0, 0, 2, 1.2, 1.6);
  platform(G, 100, 2.9, 0, 2.6, 3, 0x4a3a6e);
  G.ents.add(new GoldPumpkin(100, 4.1, 0, 0));
  G.ents.add(new Checkpoint(101, 0, 1.6, 1));

  // ===== HIGH ROAD: elevated route above the pumpkin field (harder, richer) =====
  // enter from the top gravestone (x57) — exits at the gold-pumpkin ledge (x100)
  platform(G, 61, 3.2, 0, 2.6, 3, 0x5a4066);
  platform(G, 66.5, 4.2, 0, 2.4, 3, 0x5a4066);
  platform(G, 72, 5.0, 0, 2.6, 3, 0x5a4066);
  platform(G, 78, 5.5, 0, 3.0, 3, 0x5a4066);
  platform(G, 90, 4.7, 0, 2.6, 3, 0x5a4066);
  platform(G, 96, 3.8, 0, 2.4, 3, 0x5a4066);
  G.ents.add(new Hopper(G, 78, 5.5, 0, {aggroR:7}));
  G.ents.add(new Boo(G, 90, 4.2, 0, {speed:2.2, range:9}));
  G.ents.add(new Spider(G, 84, 8.4, 0, {groundY:0}));
  candyLine(G, [[61,4.4,0],[66.5,5.4,0],[72,6.2,0]], 6);
  candyLine(G, [[78,6.7,0],[90,5.9,0],[96,5,0]], 6);
  G.ents.add(new Heart(72, 6.4, 0));

  // climbable web-net: an honest way up to the high road
  buildWebNet(G, 61, 0.4, 1.8, 3.4);

  // ===== THE OLD SHORTCUT: floating island high above the pumpkin field =====
  platform(G, 86, 6.8, 0, 4.4, 4.4, 0x4a3a6e);
  const wpL = mesh('box',[0.45,3,0.45], mat(0x38294f)); wpL.position.set(84.9,8.3,-1);
  const wpR = wpL.clone(); wpR.position.x=87.1;
  const wpT = mesh('box',[2.9,0.5,0.6], mat(0x38294f)); wpT.position.set(86,9.9,-1); crook(wpT,0.05);
  S.add(wpL,wpR,wpT);
  const warpPm = new THREE.MeshBasicMaterial({color:PAL.purpleFx, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const warpPortal = new THREE.Mesh(geo('plane',2.1,2.9), warpPm);
  warpPortal.position.set(86,8.3,-1);
  S.add(warpPortal);
  G.warpPortal = warpPortal;
  const wl = new THREE.PointLight(0xb37dff, 50, 13); wl.position.set(86,8.6,0); S.add(wl);
  const wflame = mesh('sph',[0.2,7,6], emat(PAL.purpleFx,PAL.purpleFx,1)); wflame.position.set(86,7.6,0.6); S.add(wflame);
  G.world.addBox(86, 6.8, -0.9, 2.2, 2.8, 0.9, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._warpUsed) return;
    G._warpUsed = true;
    AUDIO.portal(); AUDIO.goldPumpkin();
    G.state='transition';
    UI.fade(true, 350);
    setTimeout(()=>{
      G.player.pos.set(184,0.6,0);
      G.player.vel.set(0,0,0);
      G.setCheckpoint(184,0.8,0);
      G.addCandy(35);
      G.camc.snapSide(G.player);
      G.state='play';
      UI.fade(false, 350);
      UI.toast('THE OLD SHORTCUT! +35 candy - straight to the boss gate. Experts only!');
      G.fx.spawn(new THREE.Vector3(184,1.5,0), PAL.purpleFx, 24, {speed:4, life:0.8});
    }, 400);
  }});

  // ================= SECTION C: Crooked Barn (x 102..140) =================
  groundX(G, 102, 140, 0x4c3f68);
  hayBale(G, 104.5, 0, 0, 2.2, 1.25, 1.6, 0.1);
  hayBale(G, 107.5, 1.25, 0, 2.2, 1.25, 1.6, -0.1);
  hayBale(G, 110.5, 2.5, 0, 2.2, 1.2, 1.6);
  const barn = new THREE.Group();
  const bwall = mesh('box',[16,7.5,0.6], mat(0x7a3040)); bwall.position.set(119,3.75,-3.2);
  const broofL = mesh('box',[9,0.5,4], mat(0x54324a)); broofL.position.set(115.2,7.6,-2.2); broofL.rotation.z=0.35;
  const broofR = mesh('box',[9,0.5,4], mat(0x54324a)); broofR.position.set(122.8,7.6,-2.2); broofR.rotation.z=-0.35;
  const bwin = mesh('circ',[0.9,10], emat(PAL.window,PAL.window,0.9)); bwin.position.set(119,5.4,-2.85);
  barn.add(bwall,broofL,broofR,bwin);
  S.add(barn);
  platform(G, 119, 3.8, 0, 14, 3.4, 0x8a3848);
  platform(G, 119, 6.4, 0, 6, 3, 0x54324a);
  G.ents.add(new Spider(G, 111, 4.6, 0, {groundY:0}));
  G.ents.add(new Spider(G, 115, 5.4, 0, {groundY:0}));
  G.ents.add(new Spider(G, 122, 5.6, 0, {groundY:0}));
  G.ents.add(new Rat(G, 117, 0, 0));
  G.ents.add(new Skelly(G, 119, 3.8, 0, {px:4}));
  G.ents.add(new Boo(G, 136, 0, 0, {speed:2.3}));
  candyLine(G, [[104.5,2,0],[110.5,4,0],[115,5.2,0]], 6);
  G.ents.add(new BonkLantern(G, 128, 1.4, 0, 'bat'));
  signPost(G, 126, 1.8, 0.25, 'Something shiny sits on the silo... bat wings sure would help. Webs above - watch your head!');
  const silo = mesh('cyl',[1.8,2,7.5,12], mat(0x9aa7b8)); silo.position.set(133,3.75,0); S.add(silo);
  const siloCap = mesh('cone',[2,1.4,12], mat(0x6a3c8f)); siloCap.position.set(133,8.2,0); S.add(siloCap);
  G.world.addBox(133,0,0, 3.7,7.5,3.7,{});
  buildVine(G, 130.6, 0.4, 7.8);   // climb the silo vine — the honest route to the gold
  G.ents.add(new GoldPumpkin(133, 9.3, 0, 1));

  // ================= GAP 2: moving ghost platforms (x 140..152) =================
  const gpm = ()=>{ const m = new THREE.Mesh(geo('box',2.8,0.45,3), new THREE.MeshLambertMaterial({color:0xbfb8ff, transparent:true, opacity:0.75})); S.add(m); return m; };
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(143.5, 1.4+Math.sin(t*1.1)*1.2, 0), gpm);
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(148.5, 2.2+Math.sin(t*1.1+2.6)*1.2, 0), gpm);
  candyLine(G, [[143.5,3.4,0],[148.5,4.2,0]], 4);
  // THE LEAP OF FAITH (one of exactly two in the whole game): jump DOWN into the
  // second half of this gap - it looks like certain death, nothing marks it - and
  // an unseen current catches you: instant level completion with ALL rewards.
  G.world.addBox(146, -8.5, 0, 2.2, 2.5, 10, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._leaped) return;
    G._leaped = true;
    AUDIO.portal(); AUDIO.victory();
    G.state='transition';
    UI.fade(true, 300);
    setTimeout(()=>{
      G.runPumpkins=[true,true,true];
      G.addCandy(50);
      G.player.pos.set(186,0.6,0);
      G.player.vel.set(0,0,0);
      G.setCheckpoint(186,0.8,0);
      G.camc.snapSide(G.player);
      G.state='play';
      UI.fade(false, 400);
      UI.updateHUD();
      UI.toast('🕳️✨ THE LEAP OF FAITH!! All pumpkins, +50 candy - the legends were true!');
      G.fx.spawn(new THREE.Vector3(186,1.5,0), PAL.gold, 30, {speed:5, life:1});
    }, 350);
  }});

  // ================= SECTION D: Witch's Garden (x 152..186) =================
  groundX(G, 152, 186, 0x3e5347);
  const decoD = new THREE.Group();
  fenceRun(decoD, 152, -3.4, 186, -3.4, 14);
  for(let i=0;i<8;i++) decoD.add(deadTree(rand(153,184), rand(-8,-4.2), rand(0.9,1.5)));
  for(let i=0;i<4;i++) decoD.add(grave(rand(154,183), rand(2.6,3.3)));
  S.add(bakeGroup(decoD));
  thornsX(G, 158, 6);
  platform(G, 158, 1.15, 0, 2.6, 3, 0x5a4066);
  thornsX(G, 168, 6);
  platform(G, 168, 1.2, 0, 2.6, 3, 0x5a4066);
  G.ents.add(new Skelly(G, 156, 0, 0, {px:2}));
  G.ents.add(new Skelly(G, 163, 0, 0, {px:2.5}));
  G.ents.add(new Skelly(G, 174, 0, 0, {px:3.5}));
  G.ents.add(new Hopper(G, 170, 0, 0, {aggroR:9}));
  G.ents.add(new Boo(G, 180, 0, 0, {speed:2.6, range:13}));
  G.ents.add(new Boo(G, 187, 0, 0, {speed:2.2, range:10}));
  G.ents.add(new Heart(168, 2.3, 0));
  const cofB = new CursedCoffin(173, 0, 1.7, -0.4);
  G.ents.add(cofB); G.coffins.push(cofB);
  G.world.addBox(173, 0, 1.7, 1.4, 0.9, 2.4, {});
  const cw1 = mesh('box',[0.5,1.7,3], mat(0x565070)); cw1.position.set(177.2,0.85,0); S.add(cw1);
  const cw2 = cw1.clone(); cw2.position.x=180.2; S.add(cw2);
  const croof = mesh('cone',[2.4,1.4,4], mat(0x3d3854)); croof.position.set(178.7,3.6,-1.8); croof.rotation.y=Math.PI/4; S.add(croof);
  const cbase = mesh('box',[3.6,2.4,1], mat(0x565070)); cbase.position.set(178.7,1.2,-1.9); S.add(cbase);
  G.world.addMesh(cw1); G.world.addMesh(cw2);
  G.ents.add(new GoldPumpkin(178.7, 1, 0, 2));
  G.ents.add(new Checkpoint(183, 0, 1.4, 2));
  signPost(G, 185, 1.8, -0.3, 'The Pumpkin King waits beyond this gate. He was the kindest guardian of all... until the ember burned his heart. Free him, Pip!');

  // ================= SECTION E: Boss Gate (x 186..194) =================
  groundX(G, 186, 194, 0x3f5c4c);
  const gGate = new THREE.Group();
  const gL = mesh('box',[1,6,1], mat(0x38294f)); gL.position.set(189,3,-1.2);
  const gR = gL.clone(); gR.position.x=192.2;
  const gT = mesh('box',[4.4,1,1.2], mat(0x38294f)); gT.position.set(190.6,6.2,-1.2);
  const crest = pumpkinDeco(0,0,1.2,true); crest.position.set(190.6,6.8,-1.2);
  gGate.add(gL,gR,gT,crest);
  S.add(gGate);
  const doorPm = new THREE.MeshBasicMaterial({color:PAL.pumpkin, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const doorPortal = new THREE.Mesh(geo('plane',3.4,5), doorPm);
  doorPortal.position.set(190.6,2.8,-1.2);
  S.add(doorPortal);
  G.lvlPortal = doorPortal;
  G.world.addBox(190.6,0,0, 1.6,5,4, {type:'trigger', onTouch:()=>{ if(G.state==='play' && !G._entering){ G._entering=true; AUDIO.portal(); G.startBoss1(); } }});
  G.world.addBox(196,0,0, 3,9,12,{});
  G.world.addBox(-10.5,0,0, 3,9,12,{});

  G.spawnPoint.set(0,0.6,0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 6, 30);
  G.amb = buildAmbience(S, -10, 196);
  // themed ground clutter — one piece every couple of units, all baked
  buildClutter(G, -8, 48, 'grave');
  buildClutter(G, 58, 102, 'farm');
  buildClutter(G, 102, 140, 'farm');
  buildClutter(G, 152, 186, 'garden');
  // ambient life: crows that flap off when you come close
  G.ents.add(new Crow(20, 1.35, -2.2));
  G.ents.add(new Crow(63.5, 0.95, -2.6));
  G.ents.add(new Crow(158, 1.3, -2.1));
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
  // cobwebs in the barn corners
  for(const wx of [112.5, 125.5]){
    const web = new THREE.Mesh(geo('circ',0.7,3), new THREE.MeshBasicMaterial({color:0xd8d8e8, transparent:true, opacity:0.28, side:THREE.DoubleSide}));
    web.position.set(wx, 7, -1.6);
    web.rotation.z = wx<119 ? -0.6 : 0.6;
    S.add(web);
  }
}

function updateLevel1(G, dt){
  updateBats(G.bats, dt);
  updateAmbience(G.amb, G.time);
  if(G.lvlPortal) G.lvlPortal.material.opacity = 0.32+Math.sin(G.time*3)*0.12;
  if(G.warpPortal) G.warpPortal.material.opacity = G._warpUsed?0.06:(0.3+Math.sin(G.time*2.6)*0.12);
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  for(const c of (G.coffins||[])){
    if(!c.opened && c.group.position.distanceTo(pl.pos)<2.8){ prompt={kind:'coffin', label:'⚰️ Open the cursed coffin...?', coffin:c}; break; }
  }
  if(!prompt) for(const s of G.signs){
    if(Math.hypot(s.x-pl.pos.x, s.z-pl.pos.z)<2.6){ prompt={kind:'sign', label:'📖 Read sign', sign:s}; break; }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge){
    if(prompt.kind==='coffin') prompt.coffin.open(G);
    else UI.dialogue('🪧', prompt.sign.text);
  }
}

// ============ TUTORIAL — Gran's Backyard Course ============
function buildTutorial(G){
  const S = G.scene;
  G.signs = [];
  G.coffins = [];
  // cozy backyard: ground, fences, Gran's house silhouette
  groundX(G, -8, 88, 0x3f5544);
  const deco = new THREE.Group();
  fenceRun(deco, -8, -3.2, 88, -3.2, 30);
  fenceRun(deco, -8, 3.2, 88, 3.2, 30);
  // Gran's cottage in the background
  const cot = new THREE.Group();
  const cw = mesh('box',[6,4,3], mat(0x5c4380)); cw.position.set(-2,2,-6);
  const cr = mesh('cone',[4.6,2.6,4], mat(0x6a3c8f)); cr.position.set(-2,5.3,-6); cr.rotation.y=Math.PI/4;
  const cwin = mesh('box',[1,1.1,0.1], emat(PAL.window,PAL.window,1)); cwin.position.set(-2,2.2,-4.4);
  cot.add(cw,cr,cwin);
  deco.add(cot);
  for(let i=0;i<8;i++) deco.add(pumpkinDeco(rand(-4,84), rand(-2.6,-1.8), rand(0.5,0.9), Math.random()<0.5));
  for(let i=0;i<5;i++) deco.add(deadTree(rand(0,84), rand(-8,-4.5), rand(0.8,1.2)));
  S.add(bakeGroup(deco));

  // 1) run
  signPost(G, 3, 1.8, -0.2, INPUT.isTouch ?
    'Push the stick and RUN, little boo! \u2014 Gran \u2665' :
    'Hold D (or \u2192) and RUN, little boo! \u2014 Gran \u2665');
  candyLine(G, [[6,0.8,0],[14,0.8,0]], 5);

  // 2) jump + double jump (hay steps, no pits — nothing here can hurt you)
  signPost(G, 19, 1.8, 0.2, INPUT.isTouch ?
    'Tap A to JUMP... and tap it AGAIN in the air. My double-boo bounce! \u2014 Gran \u2665' :
    'SPACE to JUMP... and press it AGAIN in the air. My double-boo bounce! \u2014 Gran \u2665');
  hayBale(G, 24, 0, 0, 2.2, 1.2, 1.6);
  hayBale(G, 28, 0, 0, 2.2, 2.4, 1.6);
  candyLine(G, [[24,2,0],[28,3.6,0]], 4);

  // 3) climb the web-net
  signPost(G, 34, 1.8, -0.25, 'See the practice web? Hold UP to climb it. The spiders lent it to me. \u2014 Gran \u2665');
  buildWebNet(G, 38, 0.4, 1.8, 3.6);
  platform(G, 41.5, 3.4, 0, 3, 3, 0x5a4066);
  candyLine(G, [[38,2,0],[41.5,4.6,0]], 4);

  // 4) spin attack targets
  signPost(G, 47, 1.8, 0.2, INPUT.isTouch ?
    'SPIN your candy bag (B) at the practice pumpkins! Or bop them from above. \u2014 Gran \u2665' :
    'SPIN your candy bag (J) at the practice pumpkins! Or bop them from above. \u2014 Gran \u2665');
  G.ents.add(new BonkLantern(G, 51, 1.3, 0, 'candy'));
  G.ents.add(new BonkLantern(G, 54, 1.3, 0, 'candy'));

  // 5) ground pound mega-bounce
  signPost(G, 59, 1.8, -0.2, INPUT.isTouch ?
    'Jump, then press \ud83d\udca5 in the air \u2014 the GROUND POUND! Pound the big pumpkin for a MEGA bounce! \u2014 Gran \u2665' :
    'Jump, then press K in the air \u2014 the GROUND POUND! Pound the big pumpkin for a MEGA bounce! \u2014 Gran \u2665');
  bigPumpkin(G, 63.5, -0.5, 0, 1.8);
  platform(G, 68.5, 5.6, 0, 3.4, 3, 0x4a3a6e);
  candyLine(G, [[68.5,6.8,0],[68.5,6.8,0]], 3);
  G.ents.add(new Heart(68.5, 7, 0));

  // 6) checkpoint + go
  signPost(G, 74, 1.8, 0.2, 'Light every lantern you pass \u2014 they remember your place. Now off you go, my little hero. \u2014 Gran \u2665');
  G.ents.add(new Checkpoint(77, 0, 1.4, 0));
  // gate to town
  const gL = mesh('box',[0.8,5,0.8], mat(0x38294f)); gL.position.set(81,2.5,-1);
  const gR = gL.clone(); gR.position.x=84;
  const gT = mesh('box',[3.8,0.8,1], mat(0x38294f)); gT.position.set(82.5,5.2,-1);
  S.add(gL,gR,gT);
  const pm = new THREE.MeshBasicMaterial({color:0xffc95e, transparent:true, opacity:0.35, side:THREE.DoubleSide});
  const portal = new THREE.Mesh(geo('plane',2.8,4.2), pm);
  portal.position.set(82.5,2.4,-1);
  S.add(portal);
  G.tutPortal = portal;
  G.world.addBox(82.5,0,0, 1.4,4.5,4, {type:'trigger', onTouch:()=>{
    if(G.state==='play' && !G._tutDone){ G._tutDone=true; G.finishTutorial(); }
  }});
  G.world.addBox(88.5,0,0, 3,8,12,{});
  G.world.addBox(-10.5,0,0, 3,8,12,{});
  G.spawnPoint.set(0,0.6,0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 4, 24);
  G.amb = buildAmbience(S, -10, 90);
  buildClutter(G, -6, 84, 'farm');
  G.ents.add(new Crow(45, 0.9, -2.8));
}
function updateTutorial(G, dt){
  updateBats(G.bats, dt);
  updateAmbience(G.amb, G.time);
  if(G.tutPortal) G.tutPortal.material.opacity = 0.3+Math.sin(G.time*3)*0.1;
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  for(const s of G.signs){
    if(Math.hypot(s.x-pl.pos.x, s.z-pl.pos.z)<2.6){ prompt={kind:'sign', label:'\ud83d\udc9c Read Gran\'s note', sign:s}; break; }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge) UI.dialogue('\ud83e\uddf5', prompt.sign.text);
}

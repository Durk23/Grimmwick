// ============ HUB — Grimmwick town square ============
const WORLDS = [
  {key:'w1', name:'Pumpkin Patch',  sub:'The Harvest District', guardian:'The Pumpkin King', angle: -0.62, color:PAL.pumpkin, open:true},
  {key:'w2', name:'Ravenmoor Cemetery', sub:'The Silent District', guardian:'Mossgrave, the Tombstone Titan', angle: -1.42, color:0x9fe066, open:false},
  {key:'w3', name:'Witchwood',      sub:'The Wild District',    guardian:'Broomhilda the Broom Witch', angle: Math.PI+1.42, color:0xb37dff, open:false},
  {key:'w4', name:'Ghost Harbor',   sub:'The Misty District',   guardian:'Captain Wraith',   angle: Math.PI+0.62, color:0x63e6e2, open:false},
  {key:'w5', name:'Cursed Castle',  sub:'Grimm\'s Keep',        guardian:'Grimm, the Forgotten Guest', angle: Math.PI, color:0xff5e7a, open:false},
];

function buildHouse(x,z,rotY,w,h,c1,c2,winColor){
  const g = new THREE.Group();
  const base = mesh('box',[w,h,w*0.8], mat(c1)); base.position.y=h/2;
  // crooked upper floor
  const up = mesh('box',[w*1.08,h*0.6,w*0.84], mat(c2)); up.position.y=h+h*0.3; up.rotation.y=rand(-0.05,0.05); up.rotation.z=rand(-0.04,0.04);
  // roof
  const roof = mesh('cone',[w*0.95,h*0.85,4], mat(PAL.roof)); roof.position.y=h*1.6+h*0.42; roof.rotation.y=Math.PI/4; roof.rotation.z=rand(-0.06,0.06);
  // chimney
  const chim = mesh('box',[0.3,0.8,0.3], mat(c2)); chim.position.set(w*0.25, h*1.8, 0);
  g.add(base,up,roof,chim);
  // glowing windows
  const wm = emat(winColor, winColor, 1);
  for(let i=0;i<2;i++){
    const win = mesh('box',[0.42,0.5,0.05], wm);
    win.position.set(-w/4+i*w/2, h*0.55, w*0.4+0.01);
    g.add(win);
    const win2 = mesh('box',[0.36,0.44,0.05], wm);
    win2.position.set(-w/4+i*w/2, h*1.28, w*0.42+0.01);
    win2.rotation.copy(up.rotation);
    g.add(win2);
  }
  const door = mesh('box',[0.55,0.9,0.06], mat(0x33254a)); door.position.set(0,0.45,w*0.4+0.02);
  g.add(door);
  g.position.set(x,0,z); g.rotation.y=rotY;
  return g;
}
function deadTree(x,z,s=1){
  const g = new THREE.Group();
  const trunk = mesh('cyl',[0.14*s,0.22*s,2.4*s,6], mat(0x241a33)); trunk.position.y=1.2*s; trunk.rotation.z=rand(-0.12,0.12);
  g.add(trunk);
  for(let i=0;i<3;i++){
    const br = mesh('cyl',[0.03*s,0.08*s,1.3*s,5], mat(0x241a33));
    br.position.set(rand(-0.3,0.3)*s, (1.8+i*0.35)*s, rand(-0.3,0.3)*s);
    br.rotation.z = rand(0.5,1.1)*(i%2?1:-1);
    br.rotation.x = rand(-0.5,0.5);
    g.add(br);
  }
  g.position.set(x,0,z);
  return g;
}
function fenceRun(g, x1,z1,x2,z2,seg){
  for(let i=0;i<=seg;i++){
    const t=i/seg;
    const post = mesh('box',[0.12,0.9,0.12], mat(PAL.woodD));
    post.position.set(lerp(x1,x2,t), 0.45, lerp(z1,z2,t));
    post.rotation.z=rand(-0.08,0.08);
    g.add(post);
  }
  const rail = mesh('box',[Math.hypot(x2-x1,z2-z1),0.08,0.06], mat(PAL.wood));
  rail.position.set((x1+x2)/2, 0.62, (z1+z2)/2);
  rail.rotation.y = -Math.atan2(z2-z1, x2-x1);
  g.add(rail);
}
function pumpkinDeco(x,z,s=1,lit=false){
  const g = new THREE.Group();
  const body = mesh('sph',[0.4*s,9,7], mat(PAL.pumpkin)); body.position.y=0.32*s; body.scale.set(1.15,0.85,1.15);
  const stem = mesh('cyl',[0.05*s,0.08*s,0.2*s,5], mat(PAL.stem)); stem.position.y=0.68*s;
  g.add(body,stem);
  if(lit){
    const fm = emat(0xffe08a,0xffb02e,1);
    const eL = mesh('cone',[0.07*s,0.1*s,3], fm); eL.position.set(-0.14*s,0.4*s,0.36*s);
    const eR = eL.clone(); eR.position.x=0.14*s;
    const mo = mesh('box',[0.2*s,0.05*s,0.04], fm); mo.position.set(0,0.26*s,0.38*s);
    g.add(eL,eR,mo);
  }
  g.position.set(x,0,z);
  return g;
}

function buildHub(G){
  const S = G.scene;
  const R = 26; // town radius
  // ground: big cobble disc + outer grass
  const ground = mesh('cyl',[R,R,1,28], mat(PAL.path)); ground.position.y=-0.5; S.add(ground);
  G.world.addBox(0,-1,0, R*2,1,R*2,{});
  const outer = mesh('cyl',[R+22,R+22,0.8,24], mat(PAL.ground)); outer.position.y=-0.62; S.add(outer);
  // cobble detail circles
  const deco = new THREE.Group();
  for(let i=0;i<26;i++){
    const c = mesh('cyl',[rand(0.4,0.9),rand(0.4,0.9),0.04,7], mat(0x554478));
    const a=rand(TAU), r=rand(3,R-2);
    c.position.set(Math.cos(a)*r, 0.02, Math.sin(a)*r);
    deco.add(c);
  }
  // ---- THE EVERFLAME (story centerpiece — currently stolen/dim) ----
  const plinthG = new THREE.Group();
  const plinth = mesh('cyl',[2.6,3.1,1.1,10], mat(0x3d2f5c)); plinth.position.y=0.55; plinthG.add(plinth);
  const bowl = mesh('cyl',[1.9,1.3,1,10], mat(0x322550)); bowl.position.y=1.6; plinthG.add(bowl);
  // giant carved jack-o-lantern brazier, hollow & dark
  const jack = mesh('sph',[1.5,12,10], emat(0xc7803a, 0x7a4a10, 0.35)); jack.position.y=2.9; jack.scale.set(1.15,0.9,1.15); plinthG.add(jack);
  const fm = emat(0x453035, 0x221a20, 0.4);
  const jeL = mesh('cone',[0.3,0.42,3], fm); jeL.position.set(-0.55,3.15,1.32); plinthG.add(jeL);
  const jeR = jeL.clone(); jeR.position.x=0.55; plinthG.add(jeR);
  const jmo = mesh('box',[1.1,0.2,0.1], fm); jmo.position.set(0,2.6,1.4); plinthG.add(jmo);
  // tiny sad ember floating inside
  G.hubEmber = mesh('sph',[0.16,8,6], emat(0xff7b2e,0xff7b2e,1)); G.hubEmber.position.set(0,3.1,0); plinthG.add(G.hubEmber);
  G.hubEmberLight = new THREE.PointLight(0xff8c3e, 45, 15); G.hubEmberLight.position.set(0,3.4,0); plinthG.add(G.hubEmberLight);
  S.add(plinthG);
  G.world.addMesh(plinth); G.world.addMesh(bowl);
  G.world.addBox(0,2.1,0, 2.4,1.8,2.4,{});

  // ---- houses ring ----
  const houseCols = [[0x4a3566,0x5c4380],[0x3d4a66,0x4a5c80],[0x59396b,0x6b4580],[0x445536,0x556b45]];
  for(let i=0;i<9;i++){
    const a = (i/9)*TAU + 0.22;
    // leave gaps at gate angles
    let skip=false;
    for(const w of WORLDS){ if(Math.abs(angleLerp(0, w.angle-a, 1))<0.34) skip=true; }
    if(skip) continue;
    const r = R+6.5;
    const [c1,c2] = pick(houseCols);
    const h = buildHouse(Math.sin(a)*r, Math.cos(a)*r, -a+Math.PI, rand(3.2,4.4), rand(2.6,3.4), c1, c2, pick([PAL.window,0xffa04a,0x9fe0ff]));
    S.add(h);
  }
  // ---- lamps ----
  G.hubLamps = [];
  for(let i=0;i<5;i++){
    const a = (i/5)*TAU+0.5;
    const g = new THREE.Group();
    const pole = mesh('cyl',[0.09,0.13,3.1,6], mat(0x241c38)); pole.position.y=1.55; crook(pole,0.04);
    const lant = mesh('box',[0.5,0.55,0.5], mat(0x241c38)); lant.position.y=3.15;
    const bulb = mesh('sph',[0.17,7,6], emat(PAL.window,PAL.window,1)); bulb.position.y=3.15;
    g.add(pole,lant,bulb);
    g.position.set(Math.sin(a)*12, 0, Math.cos(a)*12);
    S.add(g);
    G.world.addBox(g.position.x, 0, g.position.z, 0.35,3,0.35,{});
    if(i<3){
      const l = new THREE.PointLight(0xffc95e, 55, 13);
      l.position.set(g.position.x, 3.2, g.position.z);
      S.add(l);
      G.hubLamps.push(l);
    }
  }
  // ---- deco: trees, pumpkins, fences, hay ----
  for(let i=0;i<10;i++){
    const a=rand(TAU), r=rand(R+2,R+16);
    deco.add(deadTree(Math.sin(a)*r, Math.cos(a)*r, rand(0.8,1.5)));
  }
  for(let i=0;i<12;i++){
    const a=rand(TAU), r=rand(5,R-3);
    deco.add(pumpkinDeco(Math.sin(a)*r, Math.cos(a)*r, rand(0.7,1.3), Math.random()<0.5));
  }
  S.add(bakeGroup(deco));

  // ---- the five district gates ----
  G.gates = [];
  for(const w of WORLDS){
    const g = new THREE.Group();
    const x = Math.sin(w.angle)*(R-1.2), z = Math.cos(w.angle)*(R-1.2);
    const beaten = G.save.worlds[w.key];
    const open = w.open || false;
    // arch
    const pL = mesh('box',[0.7,4.6,0.7], mat(0x38294f)); pL.position.set(-1.9,2.3,0);
    const pR = pL.clone(); pR.position.x=1.9;
    const top = mesh('box',[4.6,0.8,0.9], mat(0x38294f)); top.position.y=4.7; crook(top,0.03);
    g.add(pL,pR,top);
    // lantern pair — lit if beaten (district relit!)
    for(const sx of [-1.9,1.9]){
      const litc = beaten ? w.color : 0x3a3350;
      const lb = mesh('sph',[0.22,7,6], emat(litc, litc, beaten?1:0.35)); lb.position.set(sx,4.15,0.45);
      g.add(lb);
    }
    if(open){
      // swirling portal
      const pm = new THREE.MeshBasicMaterial({color:w.color, transparent:true, opacity:0.35, side:THREE.DoubleSide});
      const portal = new THREE.Mesh(geo('plane',3.1,3.8), pm);
      portal.position.y=2.2;
      g.add(portal);
      w.portalMesh = portal;
      const ring = mesh('tor',[1.7,0.09,6,24], emat(w.color,w.color,0.9));
      ring.position.y=2.2; g.add(ring);
      w.ringMesh = ring;
    } else {
      // boarded up + chains
      for(let i=0;i<3;i++){
        const board = mesh('box',[3.6,0.5,0.12], mat(PAL.wood));
        board.position.set(0,1.1+i*1.1,0); board.rotation.z=rand(-0.15,0.15);
        g.add(board);
      }
      const lock = mesh('sph',[0.35,7,6], mat(0x8a8a99)); lock.position.set(0,2.2,0.3); lock.scale.set(0.8,1,0.4);
      g.add(lock);
    }
    g.position.set(x,0,z);
    g.rotation.y = w.angle+Math.PI;
    S.add(g);
    // colliders: pillars, and a trigger for open gates
    const px1 = x+Math.cos(w.angle)*(-1.9), pz1 = z-Math.sin(w.angle)*(-1.9);
    const px2 = x+Math.cos(w.angle)*(1.9), pz2 = z-Math.sin(w.angle)*(1.9);
    G.world.addBox(px1,0,pz1, 0.8,4.6,0.8,{});
    G.world.addBox(px2,0,pz2, 0.8,4.6,0.8,{});
    if(!open){
      G.world.addBox(x,0,z, 4,4,0.8,{});
    }
    G.gates.push({w, x, z, open, beaten});
  }
  // invisible town boundary
  for(let i=0;i<20;i++){
    const a=(i/20)*TAU;
    let nearGate = false;
    for(const w of WORLDS){ if(w.open && Math.abs(angleLerp(0,w.angle-a,1))<0.25) nearGate=true; }
    if(nearGate) continue;
    G.world.addBox(Math.sin(a)*(R+2.5), 0, Math.cos(a)*(R+2.5), 6,6,3, {});
  }

  // ---- Mayor Boo NPC ----
  const mayor = new THREE.Group();
  const mm = new THREE.MeshLambertMaterial({color:0xf6f4ff, transparent:true, opacity:0.95});
  const mb = new THREE.Mesh(geo('sph',0.85,12,10), mm); mb.position.y=1.25; mb.scale.set(1,1.15,1);
  const mtail = new THREE.Mesh(geo('cone',0.7,1,9), mm); mtail.position.y=0.45; mtail.rotation.x=Math.PI;
  const meL = mesh('sph',[0.1,6,6], mat(0x14101f)); meL.position.set(-0.26,1.42,0.72);
  const meR = meL.clone(); meR.position.x=0.26;
  const brow = mesh('box',[0.24,0.06,0.05], mat(0xd8d4f0)); brow.position.set(-0.26,1.58,0.74); brow.rotation.z=0.2;
  const brow2 = brow.clone(); brow2.position.x=0.26; brow2.rotation.z=-0.2;
  // mayor's top hat + sash
  const hatB = mesh('cyl',[0.5,0.5,0.08,10], mat(0x241c38)); hatB.position.y=2.05;
  const hatT = mesh('cyl',[0.34,0.36,0.6,10], mat(0x241c38)); hatT.position.y=2.4;
  const band = mesh('cyl',[0.365,0.375,0.14,10], mat(PAL.pumpkin)); band.position.y=2.18;
  const sash = mesh('tor',[0.55,0.09,6,16], mat(PAL.pumpkin)); sash.position.y=1.15; sash.rotation.x=0.5; sash.rotation.z=0.6;
  const stache = mesh('box',[0.4,0.09,0.06], mat(0xd0ccec)); stache.position.set(0,1.22,0.78);
  mayor.add(mb,mtail,meL,meR,brow,brow2,hatB,hatT,band,sash,stache);
  mayor.position.set(4.2,0.35,6.5);
  S.add(mayor);
  G.mayor = mayor;
  G.mayorHome = mayor.position.clone();

  // ---- Costume Cauldron shop stall ----
  const shop = new THREE.Group();
  const table = mesh('box',[3.2,0.9,1.6], mat(PAL.wood)); table.position.y=0.45;
  const canopyPoles = [];
  for(const sx of [-1.4,1.4]) for(const sz of [-0.6,0.6]){
    const p = mesh('cyl',[0.06,0.06,2.6,5], mat(PAL.woodD)); p.position.set(sx,1.3,sz); shop.add(p);
  }
  const canopy = mesh('cone',[2.6,1,4], mat(0x8e5bd9)); canopy.position.y=3; canopy.rotation.y=Math.PI/4;
  const cauldron = mesh('sph',[0.6,10,8], mat(0x1e1830)); cauldron.position.y=1.25; cauldron.scale.set(1,0.85,1);
  const brew = mesh('cyl',[0.5,0.5,0.1,10], emat(0x7dff9e,0x7dff9e,1)); brew.position.y=1.55;
  const brewLight = new THREE.PointLight(0x7dff9e, 32, 8); brewLight.position.set(0,2,0);
  shop.add(table,canopy,cauldron,brew,brewLight);
  shop.position.set(-6.5,0,5.5);
  shop.rotation.y = 0.6;
  S.add(shop);
  G.world.addBox(-6.5,0,5.5, 3.2,1.4,1.8,{});
  G.shopPos = new THREE.Vector3(-6.5,0,5.5);
  G.brewMesh = brew;

  // ---- ambient wandering boos (harmless deco) ----
  G.hubBoos = [];
  for(let i=0;i<3;i++){
    const bg = new THREE.Group();
    const m = new THREE.MeshLambertMaterial({color:0xf2f0ff, transparent:true, opacity:0.5});
    const b = new THREE.Mesh(geo('sph',0.32,8,7), m); b.position.y=0.5;
    const tl = new THREE.Mesh(geo('cone',0.26,0.4,7), m); tl.position.y=0.15; tl.rotation.x=Math.PI;
    const e1 = mesh('sph',[0.05,5,5], mat(0x14101f)); e1.position.set(-0.1,0.56,0.28);
    const e2 = e1.clone(); e2.position.x=0.1;
    bg.add(b,tl,e1,e2);
    bg.position.set(rand(-14,14),rand(0.5,2),rand(-14,14));
    bg.userData = {a:rand(TAU), r:rand(6,15), sp:rand(0.1,0.25), yo:rand(0.5,2), t:rand(10)};
    S.add(bg);
    G.hubBoos.push(bg);
  }
  // ---- bats ----
  G.bats = makeBats(S, 9, 40);
  G.hubTime = 0;
  // spawn
  G.spawnPoint.set(0,0.6,10);
  G.world.killY = -20;
}

function makeBats(S, n, spread){
  const bats = [];
  for(let i=0;i<n;i++){
    const g = new THREE.Group();
    const body = mesh('sph',[0.14,6,5], mat(0x1c1428));
    const wL = mesh('box',[0.5,0.04,0.22], mat(0x1c1428)); wL.position.x=-0.3;
    const wR = wL.clone(); wR.position.x=0.3;
    g.add(body,wL,wR);
    g.userData={a:rand(TAU), r:rand(8,spread), h:rand(5,11), sp:rand(0.3,0.8), t:rand(10), wL, wR};
    S.add(g);
    bats.push(g);
  }
  return bats;
}
function updateBats(bats, dt){
  for(const b of bats){
    const u = b.userData;
    u.t += dt; u.a += u.sp*dt;
    b.position.set(Math.cos(u.a)*u.r, u.h+Math.sin(u.t*2)*0.8, Math.sin(u.a)*u.r);
    b.rotation.y = -u.a+Math.PI;
    const flap = Math.sin(u.t*16)*0.7;
    u.wL.rotation.z = flap; u.wR.rotation.z = -flap;
  }
}

function updateHub(G, dt){
  G.hubTime += dt;
  const t = G.hubTime;
  // ember pulse
  if(G.hubEmber){
    G.hubEmber.scale.setScalar(1+Math.sin(t*3)*0.25);
    G.hubEmberLight.intensity = 36+Math.sin(t*3)*12 + (G.save.embers*15);
  }
  // lamps flicker
  G.hubLamps && G.hubLamps.forEach((l,i)=>{ l.intensity = 48+Math.sin(t*11+i*2)*7+rand(-2,2); });
  // portal spin
  for(const w of WORLDS){
    if(w.ringMesh){ w.ringMesh.rotation.z = t*1.2; w.ringMesh.scale.setScalar(1+Math.sin(t*2.4)*0.05); }
    if(w.portalMesh){ w.portalMesh.material.opacity = 0.28+Math.sin(t*3)*0.1; }
  }
  // mayor bob
  if(G.mayor){
    G.mayor.position.y = G.mayorHome.y + Math.sin(t*1.8)*0.18;
    if(G.player){
      const d = G.mayor.position.distanceTo(G.player.pos);
      if(d<8) G.mayor.rotation.y = angleDamp(G.mayor.rotation.y, Math.atan2(G.player.pos.x-G.mayor.position.x, G.player.pos.z-G.mayor.position.z), 4, dt);
    }
  }
  if(G.brewMesh) G.brewMesh.position.y = 1.55+Math.sin(t*4)*0.04;
  // ambient boos drift
  for(const b of G.hubBoos){
    const u=b.userData; u.t+=dt; u.a+=u.sp*dt;
    b.position.set(Math.cos(u.a)*u.r, u.yo+0.6+Math.sin(u.t*1.5)*0.4, Math.sin(u.a)*u.r);
    b.rotation.y = -u.a;
  }
  updateBats(G.bats, dt);

  // ---- interactions ----
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  // mayor
  if(G.mayor.position.distanceTo(pl.pos)<3.2) prompt = {kind:'mayor', label:'💬 Talk to Mayor Boo'};
  // shop
  else if(G.shopPos.distanceTo(pl.pos)<3.6) prompt = {kind:'shop', label:'🎩 Costume Cauldron'};
  else {
    for(const gate of G.gates){
      const d = Math.hypot(gate.x-pl.pos.x, gate.z-pl.pos.z);
      if(d<3.4){
        prompt = gate.open ? {kind:'enter', gate, label:'🎃 Enter '+gate.w.name} : {kind:'locked', gate, label:'🔒 '+gate.w.name+' — locked'};
        break;
      }
    }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge){
    if(prompt.kind==='mayor') UI.mayorDialogue();
    else if(prompt.kind==='shop') UI.openShop();
    else if(prompt.kind==='enter'){ AUDIO.portal(); G.openMap(prompt.gate.w.key||'w1'); }
    else if(prompt.kind==='locked') UI.toast('🔒 This district is still dark... free the other guardians first! (Coming in the next update)');
  }
}

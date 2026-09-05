// ============ FROSTMERE SQUARE — the second town (the Winterfest expansion's hub) ============
// Sorts after 08_hub (uses its deco idioms + makeBats) and before 09_levelkit. Reached by Captain Wraith's
// restored ferry from Grimmwick's square (post-story — the ending's first-snow scene IS the invitation).
// Free-roam like the home square: G.switchArea('hub2') / updateFrostHub in the main loop. Compact v1:
// the frozen HEARTHLIGHT centerpiece, the w6 gate (open), four deep-winter teaser gates, Grimm the
// hint-giver by the dock, the ferry home, the great lit tree, snowfall + aurora + festival strings.

// Frostmere's five winter districts (one ships per month through winter — the five featuring shots)
const FWORLDS = [
  {key:'w6',  name:'Glimmerfields',    sub:'the festival farms',  guardian:'Grumble, the Abominable Snowman', angle:-0.72,      color:0xffb85e, open:true},
  {key:'w7',  name:'Frozen Lake Fell', sub:'the great white ice',  guardian:'Ursa Major, the Great White', angle:-1.55,         color:0xb08aff, open:false, req:'w6'},
  {key:'w8',  name:'The Icicle Mines', sub:'the glittering dark',  guardian:'Prismus the Unlit', angle:Math.PI+1.55,            color:0x7ae8ff, open:false, req:'w7'},
  {key:'w9',  name:'Evergreen Deep',   sub:'the whispering pines', guardian:'Old Tannenbaum', angle:Math.PI+0.72,               color:0x58e08a, open:false, req:'w8'},
  {key:'w10', name:'The Aurora Palace',sub:'where the cold sits crowned', guardian:'The First Frost', angle:Math.PI-0.28,       color:0xff5e6a, open:false, req:'w9'},
];

function buildFrostHub(G){
  const S = G.scene;
  const R = 20;   // a snug square — Frostmere is a smaller, huddled-together town
  // the winter night — colder and bluer than Grimmwick's
  S.background = new THREE.Color(W6PAL.sky);
  if(S.fog) S.fog.color.set(W6PAL.fog);
  // ground: packed-snow disc over deep drifts
  const ground = mesh('cyl',[R,R,1,28], mat(0xcdd9ee)); ground.position.y=-0.5; S.add(ground);
  G.world.addBox(0,-1,0, R*2,1,R*2,{});
  const outer = mesh('cyl',[R+22,R+22,0.8,24], mat(0x9fb2d6)); outer.position.y=-0.66; S.add(outer);
  const deco = new THREE.Group();
  for(let i=0;i<24;i++){   // trodden-snow patches
    const c = mesh('cyl',[rand(0.4,0.9),rand(0.4,0.9),0.04,7], mat(0xb9c8e6));
    const a=rand(TAU), r=rand(3,R-2);
    c.position.set(Math.cos(a)*r, 0.02, Math.sin(a)*r);
    deco.add(c);
  }

  // ---- THE HEARTHLIGHT (Frostmere's great flame — frozen over; each freed district warms it) ----
  const beatenN = FWORLDS.filter(w=>G.save.worlds[w.key]).length;
  const hg = new THREE.Group();
  const plinth = mesh('cyl',[2.4,2.9,1.0,10], mat(0x44507a)); plinth.position.y=0.5; hg.add(plinth);
  const hearth = mesh('box',[2.6,1.9,1.6], mat(0x38436b)); hearth.position.y=1.9; hg.add(hearth);
  const arch = mesh('tor',[0.95,0.22,6,12,Math.PI], mat(0x2c3557)); arch.position.set(0,1.9,0.82); hg.add(arch);
  const chimney = mesh('box',[1.0,1.6,0.9], mat(0x2c3557)); chimney.position.y=3.4; hg.add(chimney);
  // the flame, sealed in a block of old ice — a faint blue ember beating inside
  const iceM = new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.35, transparent:true, opacity:0.62});
  const seal = new THREE.Mesh(geo('box',1.5,1.4,1.1), iceM); seal.position.set(0,1.85,0.35); hg.add(seal);
  G.hearthlight = mesh('sph',[0.22,8,7], emat(0x7ae8ff,0x7ae8ff,1)); G.hearthlight.position.set(0,1.85,0.35); hg.add(G.hearthlight);
  if(beatenN>0){
    // the first warm breath: a small true flame licks through the crack Grumble's freedom opened
    const fl = new THREE.Mesh(geo('cone',0.4+beatenN*0.1,0.9+beatenN*0.3,8), new THREE.MeshLambertMaterial({color:0xffa050, emissive:0xff8a3a, emissiveIntensity:1.0, transparent:true, opacity:0.92}));
    fl.position.set(0,2.15,0.35); hg.add(fl);
    G.hearthlight = fl;
    seal.scale.setScalar(1-beatenN*0.16); seal.material.opacity = 0.62-beatenN*0.1;
  }
  // frost-crusted icicles along the hearth's mantle
  for(let i=0;i<6;i++){ const ic=new THREE.Mesh(geo('cone',0.07,rand(0.25,0.5),5), iceM); ic.rotation.x=Math.PI; ic.position.set(-1.1+i*0.44, 2.75, 0.85); hg.add(ic); }
  S.add(hg);
  G.world.addBox(0,0,0, 3.4,3.4,2.2,{});

  // ---- THE GREAT WINTERFEST TREE (lit, waiting for the festival that hasn't dared start) ----
  const treeX=-7.5, treeZ=-5.5;
  deco.add(w6Pine(treeX, treeZ, 2.6));
  const L = w6LightsBegin();
  // spiral strings around the tree
  for(let i=0;i<3;i++) w6String(L, treeX-2.2+i*0.5, 2.2+i*1.9, treeX+2.2-i*0.5, 3.2+i*1.9, {sag:0.5, z:treeZ+1.6});
  const star = mesh('sph',[0.26,8,7], emat(0xffd23f,0xffd23f,1)); star.position.set(treeX, 8.6, treeZ); S.add(star);
  for(let i=0;i<5;i++) deco.add(w6GiftBox(treeX+rand(-2.4,2.4), treeZ+rand(1.2,2.6), rand(0.8,1.2)));
  G.world.addBox(treeX,0,treeZ, 2.2,6,2.2,{});

  // ---- lamp posts + festival strings ringing the plaza ----
  const lampPos = [];
  for(let i=0;i<7;i++){
    const a = i/7*TAU + 0.35;
    const lx = Math.cos(a)*(R-5), lz = Math.sin(a)*(R-5);
    deco.add(w6LightPost(lx, lz, 3.1));
    const flame = mesh('sph',[0.13,7,6], emat(0xffc87a,0xffb85e,1)); flame.position.set(lx, 2.85, lz); S.add(flame);
    lampPos.push({x:lx, z:lz});
  }
  for(let i=0;i<lampPos.length;i++){
    const a1=lampPos[i], a2=lampPos[(i+1)%lampPos.length];
    // strings run post to post; z-flattened into the vertical plane between them reads fine at hub camera ranges
    w6String(L, a1.x, 3.0, a2.x, 3.0, {z:(a1.z+a2.z)/2, sag:0.9, segs:9});
  }
  w6LightsFinish(G, L);
  // two real warm lights for the square (budget: ≤6)
  const pl1 = new THREE.PointLight(0xffb85e, 40, 16); pl1.position.set(0, 4.5, 1); S.add(pl1);
  const pl2 = new THREE.PointLight(0x7ae8ff, 26, 14); pl2.position.set(treeX, 6, treeZ); S.add(pl2);

  // ---- huddled cottages between the gates (warm windows — someone's always home) ----
  for(let i=0;i<7;i++){
    const a = i/7*TAU + 0.78;
    let nearGate=false;
    for(const w of FWORLDS) if(Math.abs(Math.atan2(Math.sin(w.angle-a),Math.cos(w.angle-a)))<0.42) nearGate=true;
    if(Math.abs(Math.atan2(Math.sin(Math.PI/2-a),Math.cos(Math.PI/2-a)))<0.5) nearGate=true;   // the ferry way stays clear
    if(nearGate) continue;
    const hx=Math.cos(a)*(R-2.2), hz=Math.sin(a)*(R-2.2);
    const hw=rand(2.6,3.4), hh=rand(2.2,2.8);
    const house=mesh('box',[hw,hh,2.4], mat(0x3a4468)); house.position.set(hx,hh/2,hz); house.lookAt(0,hh/2,0); deco.add(house);
    const roof=mesh('cone',[hw*0.75,1.6,4], mat(0x2c3557)); roof.position.set(hx,hh+0.75,hz); roof.rotation.y=Math.atan2(-hx,-hz)+Math.PI/4; deco.add(roof);
    const cap=mesh('cone',[hw*0.77,0.45,4], mat(0xdfe8f8)); cap.position.set(hx,hh+1.42,hz); cap.rotation.y=roof.rotation.y; deco.add(cap);
    const win=mesh('box',[0.5,0.6,0.12], emat(W6PAL.window,W6PAL.window,0.85)); win.position.set(hx*0.94,hh*0.5,hz*0.94); win.lookAt(0,hh*0.5,0); deco.add(win);
    G.world.addBox(hx,0,hz, hw,hh,2.4,{});
  }

  // ---- THE QUIET PROP: a snow family — two big snowmen and one very small one, holding stick hands ----
  deco.add(w6SnowmanDeco(6.5, 6.8, 1.0, -2.4));
  deco.add(w6SnowmanDeco(8.0, 7.4, 0.85, -2.6));
  deco.add(w6SnowmanDeco(7.3, 8.3, 0.45, -2.5));

  // ---- DISTRICT GATES (w6 open; the deep winter still frozen shut) ----
  G.fgates = [];
  for(const w of FWORLDS){
    const gx = Math.sin(w.angle)*(R-1.2), gz = Math.cos(w.angle)*(R-1.2);
    const open = w.open || (w.req && G.save.worlds[w.req]) || false;
    const beaten = !!G.save.worlds[w.key];
    const gateG = new THREE.Group();
    // an arch of ice blocks
    for(const s of [-1,1]){ const post=new THREE.Mesh(geo('box',0.8,3.4,0.8), iceM.clone()); post.position.set(gx+Math.cos(w.angle)*s*1.5, 1.7, gz-Math.sin(w.angle)*s*1.5); gateG.add(post); }
    const lintel=new THREE.Mesh(geo('box',3.8,0.7,0.9), iceM.clone()); lintel.position.set(gx, 3.6, gz); lintel.lookAt(0,3.6,0); gateG.add(lintel);
    if(open){
      const portal = new THREE.Mesh(geo('plane',2.6,2.9), new THREE.MeshBasicMaterial({color:w.color, transparent:true, opacity:0.34, side:THREE.DoubleSide, depthWrite:false}));
      portal.position.set(gx,1.6,gz); portal.lookAt(0,1.6,0); S.add(portal);
      w.portalMesh = portal;
      const ring = mesh('tor',[1.5,0.06,5,18], emat(w.color,w.color,0.9)); ring.position.set(gx,1.6,gz); ring.lookAt(0,1.6,0); S.add(ring);
      w.ringMesh = ring;
      if(beaten){ const fl2=mesh('sph',[0.18,7,6], emat(w.color,w.color,1)); fl2.position.set(gx,4.2,gz); S.add(fl2); }
    } else {
      // frozen SOLID — a wall of old ice with the district's name carved above ("the deep winter is coming")
      const slab = new THREE.Mesh(geo('box',2.8,2.9,0.5), new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x3a76a8, emissiveIntensity:0.2, transparent:true, opacity:0.8}));
      slab.position.set(gx,1.55,gz); slab.lookAt(0,1.55,0); gateG.add(slab);
      const glowc = mesh('sph',[0.12,6,5], emat(w.color,w.color,0.7)); glowc.position.set(gx,3.0,gz); gateG.add(glowc);
    }
    S.add(gateG);
    G.fgates.push({w, x:gx, z:gz, open, beaten});
  }

  // ---- THE FERRY HOME — the Salty Phantom at Frostmere's dock (south) ----
  const fa = Math.PI/2;   // dock bearing (x+)
  const dx = Math.cos(fa)*0, dz=0;   // dock runs off the +z edge
  const dock = new THREE.Group();
  for(let i=0;i<5;i++){ const plank=mesh('box',[2.6,0.3,1.6], mat(W6PAL.woodD)); plank.position.set(0, -0.1, R-1+i*1.7); crook(plank,0.02); dock.add(plank); }
  for(const px of [-1.1,1.1]) for(const pz of [R+0.5, R+5.5]){ const pile=mesh('cyl',[0.14,0.17,1.4,6], mat(0x46301f)); pile.position.set(px,0.4,pz); dock.add(pile); }
  S.add(bakeGroup(dock));
  G.world.addBox(0,-1,R+2.6, 2.6,1,7,{});
  // the ferry itself — the old girl waits, lanterns lit, dusted with snow
  if(typeof galleonSilhouette==='function'){ const ship=galleonSilhouette(0, 0, 1.15); ship.rotation.y=Math.PI/2; ship.position.set(0.5, 0, R+9.5); S.add(ship); }
  const shipLamp = mesh('sph',[0.16,7,6], emat(0x9fe066,0x9fe066,0.9)); shipLamp.position.set(0.8, 3.2, R+8.6); S.add(shipLamp);
  G.hubFerry = new THREE.Vector3(0, 0, R+3.6);

  // ---- GRIMM, THE TRAVELING NIGHT-WATCHMAN (he rode along — this time he's the guide) ----
  const grimm = new THREE.Group();
  const gm = new THREE.MeshLambertMaterial({color:0x5a5578, emissive:0x8a7fd0, emissiveIntensity:0.14});   // ghost-grey with a cool sheen — he must read GRIMM, not snowman
  const body = new THREE.Mesh(geo('sph',0.62,10,9), gm); body.position.y=1.0; body.scale.set(1,1.35,0.9); grimm.add(body);
  const hood = new THREE.Mesh(geo('sph',0.42,9,8), gm); hood.position.y=1.9; grimm.add(hood);
  for(const s of [-1,1]){ const eye=mesh('sph',[0.07,6,6], emat(0xffd98a,0xffd98a,1)); eye.position.set(s*0.14,1.92,0.32); grimm.add(eye); }
  const lantern = mesh('box',[0.22,0.3,0.22], mat(0x2a3048)); lantern.position.set(0.66,1.1,0.2); grimm.add(lantern);
  const lflame = mesh('sph',[0.09,6,5], emat(0xffb85e,0xffb85e,1)); lflame.position.set(0.66,1.1,0.2); grimm.add(lflame);
  const scarf = mesh('tor',[0.34,0.1,6,12], emat(0xd83a4a,0x8a1e2c,0.3)); scarf.position.y=1.6; scarf.rotation.x=0.16; grimm.add(scarf);   // someone knitted him a scarf. he has not stopped wearing it.
  grimm.position.set(3.4, 0, R-4.5); grimm.lookAt(0,0,0);
  S.add(grimm);
  G.fhGrimm = grimm.position.clone();

  // ---- GRUMBLE, PATTED BACK TOGETHER SMALL (after w6 — the boss's wholesome ending, visible at home) ----
  if(G.save.worlds.w6){
    const gr = w6SnowmanDeco(-4.2, R-6.5, 0.9, 2.6);
    S.add(gr);
    G.hubGrumble = new THREE.Vector3(-4.2, 0, R-6.5);
  }

  // ---- boundary (invisible), with gaps at the open gate and the dock ----
  for(let i=0;i<20;i++){
    const a=i/20*TAU;
    let gap=false;
    for(const w of FWORLDS) if(w.open && Math.abs(Math.atan2(Math.sin(w.angle-Math.atan2(Math.sin(a)*(R+2.5), Math.cos(a)*(R+2.5))),1))<0.001) gap=true;   // (gates auto-enter before the wall matters)
    if(Math.abs(Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2)))<0.28) gap=true;   // the dock way out
    if(gap) continue;
    G.world.addBox(Math.cos(a)*(R+2.5), 0, Math.sin(a)*(R+2.5), 4.2, 6, 4.2, {});
  }

  S.add(bakeGroup(deco));
  w6Clutter(G, -R+4, R-4, 'winter');
  G.amb = w6Ambience(S, -R-6, R+6);
  w6Aurora(G, -R, R);
  G.bats = makeBats(S, 3, 26);
  G.spawnPoint.set(0, 1, R-5.5);
  G.world.killY = -30;

  // first arrival — let the moment breathe
  if(!G.save.metFrostmere){
    G.save.metFrostmere = true;
    G.save.winterStartT = G.save.playT||0;   // the WINTERFEST board's clock starts the moment you step off the ferry
    G.persist();
    setTimeout(()=>{ window.UI && UI.toast('❄️ FROSTMERE — the town where winter never ends.', 5200); }, 900);
    setTimeout(()=>{ window.UI && UI.dialogue && UI.dialogue('🫥', '"Their Hearthlight froze solid, Pip. Whole flame, solid ice. The deep cold has spirits of its own... and this town was too shy to ask for help. So I asked for them."'); }, 6400);
  }
}

function updateFrostHub(G, dt){
  const t = G.time;
  // the hearthlight beats (ice-blue while sealed, warm once breathing)
  if(G.hearthlight){
    const k = 1+Math.sin(t*2.2)*0.18;
    G.hearthlight.scale.setScalar(k);
  }
  updateBats(G.bats, dt);
  updateAmbience(G.amb, t);

  // ---- interactions ----
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  if(G.fhGrimm && G.fhGrimm.distanceTo(pl.pos)<3.2) prompt = {kind:'grimm2', label:'🏮 Talk to Grimm'};
  else if(G.hubGrumble && G.hubGrumble.distanceTo(pl.pos)<2.8) prompt = {kind:'grumble', label:'⛄ Say hi to Grumble'};
  else if(G.hubFerry && G.hubFerry.distanceTo(pl.pos)<3.0) prompt = {kind:'ferry', label:'⛵ Sail home to Grimmwick'};
  else {
    for(const gate of G.fgates||[]){
      const d = Math.hypot(gate.x-pl.pos.x, gate.z-pl.pos.z);
      if(d<3.4){
        const built = (typeof LEVEL_LISTS!=='undefined') && LEVEL_LISTS.some(Lst=>Lst.some(l=>l.district===gate.w.key));
        if(gate.open && built && d<1.7){ AUDIO.portal(); G.openMap(gate.w.key); return; }
        prompt = !gate.open ? {kind:'frozen', gate, label:'🧊 '+gate.w.name+': frozen shut'}
               : built ? {kind:'enter2', gate, label:'❄️ Walk into '+gate.w.name}
               : {kind:'soon2', gate, label:'🚧 '+gate.w.name+': coming soon!'};
        break;
      }
    }
  }
  if(prompt) prompt.hot = true;
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge){
    if(prompt.kind==='grimm2'){
      const lines = [
        '"The snowmen here move when you look away. I have TRIED telling people. They pat my hood and say \'sure, Grimm.\'"',
        '"Grumble was built by the town\'s children, every Winterfest, for three hundred years. Whatever froze him mean... it isn\'t him."',
        '"Penguins slide FASTER on ice. This should not have surprised me as much as it did."',
        '"The braziers matter, Pip. Snow that never melts only means the fires went out."',
        '"Their festival lights still work. They just stopped plugging them in. That\'s the saddest thing I\'ve ever said."',
        '"You relit a whole town once. This one only needs someone to go FIRST."',
      ];
      G._grimm2Line = ((G._grimm2Line??-1)+1) % lines.length;
      UI.dialogue('🫥', lines[G._grimm2Line]);
    }
    else if(prompt.kind==='grumble'){
      const lines = [
        '"grumble." (He means thank you.)',
        '"grumble!" (He\'s pointing his stick arm at the Hearthlight. He wants to see it burn.)',
        '"grr-umble." (He\'d like his hat adjusted. You adjust it. Perfect.)',
      ];
      G._grumbleLine = ((G._grumbleLine??-1)+1) % lines.length;
      UI.dialogue('⛄', lines[G._grumbleLine]);
    }
    else if(prompt.kind==='ferry'){
      AUDIO.portal();
      G.state='transition';
      UI.fade(true, 500);
      setTimeout(()=>{ G.switchArea('hub'); G.state='play'; UI.fade(false, 500); UI.toast('🏮 Home. The Everflame kept your place warm.'); }, 550);
    }
    else if(prompt.kind==='enter2'){ AUDIO.portal(); G.openMap(prompt.gate.w.key); }
    else if(prompt.kind==='soon2') UI.toast('🚧 '+prompt.gate.w.name+' is still being carved from the ice. Coming soon!');
    else if(prompt.kind==='frozen') UI.toast('🧊 Frozen solid until the deep winter arrives. Warm Glimmerfields first!');
  }
}

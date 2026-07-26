// ============ LEVEL KIT — shared side-scroll scaffolding + level registry ============
// Levels run along +X. The play lane is z=0; z<0 is background depth, z>0 foreground.
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
  for(let i=0;i<Math.floor(w*4.5);i++){                                  // DENSER so the bed reads as filled (no misleading gaps over the hazard)
    const th = mesh('cone',[0.15,rand(0.55,0.8),5], emat(0x8a5fd0,0x6a3fc0,0.7));   // taller + brighter so the spikes clearly match their hitbox
    th.position.set(x+rand(-w/2,w/2), 0.25, rand(-1.2,1.2));
    th.rotation.z=rand(-0.3,0.3);
    tG.add(th);
  }
  G.scene.add(bakeGroup(tG));
  // hazard box INSET + shorter than the visible bed: only bites where the spikes actually are (fixes "it got me and I didn't touch it"), and a jump clears 0.55 comfortably
  G.world.addBox(x,0,0,w-0.4,0.55,2.6,{type:'hazard',damage:1});
}

// level registry — each level file self-registers: W1_LEVELS.push({id,district,name,build,update,parTime})
const W1_LEVELS = [];
const LEVEL_LISTS = [W1_LEVELS]; // future districts append their arrays here
function findLevel(id){
  for(const list of LEVEL_LISTS) for(const l of list) if(l.id===id) return l;
  return null;
}

// FIRST call in every level build
function levelBegin(G){
  G.signs = [];
  G.coffins = [];
  G._warpUsed = false;
  G._leaped = false;
  G._exitHit = false;
  G.spawnPoint.set(0,0.6,0);
  G.world.killY = -14;
  G.camMinY = 0;   // side-camera vertical floor; a level that descends underground lowers this
  G.lightPools = [];   // D2 darkness mechanic: lit lanterns push {x,z,r}; Wisps read this to know where it's safe
}

// end-of-level relight arch — the boss gate's visual language, scaled down
function exitGate(G, x){
  const S = G.scene;
  const gGate = new THREE.Group();
  const gL = mesh('box',[0.8,5,0.8], mat(0x38294f)); gL.position.set(x-1.4,2.5,-1.2);
  const gR = gL.clone(); gR.position.x=x+1.4;
  const gT = mesh('box',[3.6,0.8,1], mat(0x38294f)); gT.position.set(x,5.2,-1.2);
  const crest = pumpkinDeco(0,0,1,true); crest.position.set(x,5.7,-1.2);
  gGate.add(gL,gR,gT,crest);
  S.add(gGate);
  const doorPm = new THREE.MeshBasicMaterial({color:PAL.pumpkin, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const doorPortal = new THREE.Mesh(geo('plane',2.6,4), doorPm);
  doorPortal.position.set(x,2.3,-1.2);
  S.add(doorPortal);
  G.lvlPortal = doorPortal;
  G.world.addBox(x-0.6,0,0, 1.2,3.5,4, {type:'trigger', onTouch:()=>{
    if(!G._exitHit && G.state==='play'){ G._exitHit=true; G.completeLevel(); }
  }});
  G.world.addBox(x+2.5,0,0, 3,9,12,{});
  G.world.addBox(-10.5,0,0, 3,9,12,{});
  G.world.addBox(-8.75,-1.2,0, 4.5,1.2,10,{});   // hidden floor to the back wall — no untelegraphed pit behind spawn
}

// common tail for every level build
function levelFinish(G, x1, x2, theme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 6, 30);
  G.amb = buildAmbience(G.scene, x1, x2);
  if(theme) buildClutter(G, x1, x2, theme);   // pass null and clutter manually when the span crosses a pit
}

function updateLevelCommon(G, dt){
  updateBats(G.bats, dt);
  updateAmbience(G.amb, G.time);
  if(G.lvlPortal) G.lvlPortal.material.opacity = 0.32+Math.sin(G.time*3)*0.12;
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  for(const c of (G.coffins||[])){
    if(!c.opened && c.group.position.distanceTo(pl.pos)<2.8){ prompt={kind:'coffin', label:c.promptLabel||'⚰️ Open the cursed coffin...?', coffin:c}; break; }
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

// ============ D2 KIT — Ravenmoor Cemetery building blocks (surface graveyard + catacombs) ============
// Sorts after 09_levelkit.js (so LEVEL_LISTS exists) and before the D2 level files (09n... < 09o...).
// REUSES 09_levelkit's levelBegin/exitGate/updateLevelCommon and 00_utils/08_hub builders wherever
// they fit; this file only adds what Ravenmoor needs on top. All static deco is BAKED (bakeGroup) —
// zero draw-call cost; crystals/glows are EMISSIVE fakes (bakeGroup lifts emissive into vertex colour),
// so the ≤6 real-PointLight budget stays free for the few hero lanterns that ask for opts.light.
// Determinism: cosmetic scatter uses rand() (switchArea seeds per area — identical every replay).
//
// TWO CONTRACTS D2 LEVEL FILES MUST HONOUR (documented here because this kit can't edit levelBegin):
//  1. LIGHT POOLS — reset `G.lightPools = []` at the TOP of every D2 level build (right after
//     levelBegin(G)). w2Lantern / w2DarkLantern push {x,z,r} onto it; the Wisp enemy (07-side)
//     reads it to know where the safe light is. The builders self-init the array defensively too.
//  2. AMBIENCE — call w2LevelFinish(G, x1, x2, mode, clutterTheme) as the tail INSTEAD of
//     09_levelkit's levelFinish (whose buildAmbience paints the orange Pumpkin-Patch skyline).
//     w2LevelFinish sets G.checkpoint / G.bats / G.amb the same way, but with Ravenmoor's backdrop.

// ---- Ravenmoor palette: cold greys / blue-greens up top, cyan-violet crystal glow below ----
const W2PAL = {
  stone:    0x5a5670,  stoneD:   0x3c3a52,  stoneL:   0x736f8c,   // headstone greys
  moss:     0x5f7a55,  iron:     0x272536,                        // blue-green moss · wrought iron
  hillNear: 0x263042,  hillFar:  0x1a2233,                        // cold surface hills
  cryptWin: 0x8fd6c8,  mist:     0x8492ac,                        // pale-teal crypt glow · cold mist
  caveWall: 0x241f37,  caveWallD:0x161327,  caveWallL:0x342d49,   // catacomb rock
  crystal:  0x63e6e2,  crystalV: 0xb37dff,  crystalP: 0x7dff9e,   // cyan · violet · green crystal
  river:    0x4fd6ff,  dust:     0xcfc9e6,                        // glowing river · pale dust mote
  chain:    0x6b6676,  rope:     0x9a7b4a,                        // iron chain · bell rope
};

// =============================== 1) BACKDROPS + AMBIENCE ===============================
// w2Parallax(S, x1, x2, mode): baked three-depth skyline. mode 'surface' = headstone/hill graveyard,
// mode 'cave' = layered cave walls + hanging stalactites + distant crystal glimmer.
function w2Parallax(S, x1, x2, mode){
  return mode==='cave' ? _w2ParallaxCave(S,x1,x2) : _w2ParallaxSurface(S,x1,x2);
}
function _w2ParallaxSurface(S, x1, x2){
  const near = new THREE.Group();
  for(let x=x1-30; x<x2+30; x+=rand(9,14)){
    const h = mesh('sph',[rand(6,11),10,8], mat(W2PAL.hillNear)); h.position.set(x, rand(-4,-1.5), -14); h.scale.y=rand(0.35,0.55); near.add(h);
  }
  // a row of headstone + mausoleum silhouettes at mid-depth (the graveyard reads instantly)
  for(let x=x1-15; x<x2+15; x+=rand(5,9)){
    if(rand()<0.62){
      const w=rand(0.8,1.4), hh=rand(1.6,2.8);
      const st = mesh('box',[w,hh,0.6], mat(W2PAL.stoneD)); st.position.set(x, hh/2, -10.5); crook(st,0.05);
      const cap = mesh('cyl',[w*0.5,w*0.5,0.5,8], mat(W2PAL.stoneD)); cap.rotation.x=Math.PI/2; cap.position.set(x, hh, -10.5);
      near.add(st, cap);
    } else near.add(mausoleum(x, -11.6, rand(0.7,1.0), rand()<0.4));
  }
  S.add(bakeGroup(near));
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(14,20)){ const h=mesh('sph',[rand(10,16),9,7], mat(W2PAL.hillFar)); h.position.set(x, rand(-5,-2), -28); h.scale.y=rand(0.4,0.6); far.add(h); }
  S.add(bakeGroup(far));
  // distant crypt-town with pale-teal window glows
  const town = new THREE.Group();
  for(let x=x1-20; x<x2+20; x+=rand(22,36)){
    const b = mesh('box',[rand(1.6,2.4),rand(2.5,4.5),1.5], mat(0x161326)); b.position.set(x,1.5,-20); town.add(b);
    const r = mesh('cone',[rand(1.1,1.5),rand(1.4,2.2),4], mat(0x1b1730)); r.position.set(x, b.geometry.parameters.height+2, -20); r.rotation.y=Math.PI/4; town.add(r);
    if(rand()<0.85){ const w=mesh('box',[0.28,0.42,0.1], emat(W2PAL.cryptWin,W2PAL.cryptWin,0.9)); w.position.set(x+rand(-0.4,0.4), rand(1.4,2.8), -19.2); town.add(w); }
  }
  S.add(bakeGroup(town));
}
function _w2ParallaxCave(S, x1, x2){
  // layered cave-wall masses receding, jagged tops
  for(const [zz,cc,hh] of [[-6,0x201b30,5.5],[-12,W2PAL.caveWallD,7],[-20,0x120f22,9]]){
    const g = new THREE.Group();
    for(let x=x1-20; x<x2+20; x+=rand(4,7)){
      const bh = rand(hh*0.5, hh);
      const b = mesh('box',[rand(4,7), bh, 3], mat(cc)); b.position.set(x, bh/2-3.5, zz); crook(b,0.04); g.add(b);
    }
    S.add(bakeGroup(g));
  }
  // ceiling stalactite band + distant crystal glimmer (emissive specks)
  const ceil = new THREE.Group();
  for(let x=x1-10; x<x2+10; x+=rand(2.5,4.5)) ceil.add(stalactite(x, 9+rand(-0.5,1.2), rand(0.7,1.3), rand(-4,-8)));
  for(let i=0;i<Math.floor((x2-x1)/4);i++){
    const cc = pick([W2PAL.crystal,W2PAL.crystalV,W2PAL.crystalP]);
    const sp = mesh('cone',[rand(0.1,0.22), rand(0.4,0.9), 5], emat(cc,cc,0.9));
    sp.position.set(rand(x1,x2), rand(-1,4), rand(-10,-16)); sp.rotation.z=rand(-0.5,0.5);
    ceil.add(sp);
  }
  S.add(bakeGroup(ceil));
}

// w2Ambience(S, x1, x2, mode): drifting motes + glints + (surface) low ground-fog, returned in the
// shape 09_levelkit's updateAmbience already animates ({flies, leaves, clouds, x1, x2}) — no engine edit.
function w2Ambience(S, x1, x2, mode){
  const cave = mode==='cave';
  const leaves = [];   // updateAmbience's "leaf" channel, repurposed as dust (cave) / cold mist (surface)
  const moteM = new THREE.MeshBasicMaterial({color: cave?W2PAL.dust:W2PAL.mist, transparent:true, opacity: cave?0.55:0.32, side:THREE.DoubleSide, depthWrite:false});
  for(let i=0;i<(cave?16:12);i++){
    const lf = new THREE.Mesh(geo('circ', cave?0.08:0.5, 6), moteM.clone());
    lf.userData = {x0:rand(x1,x2), y0:rand(cave?1:2, cave?7:9), sp:rand(cave?0.15:0.3, cave?0.4:0.7), ph:rand(9), sw:rand(cave?0.4:1.2, cave?1.0:2.4)};
    S.add(lf); leaves.push(lf);
  }
  const fg = new THREE.BufferGeometry(); const fp=[]; const n = cave?42:28;
  for(let i=0;i<n;i++) fp.push(rand(x1,x2), rand(0.4, cave?6:7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color: cave?W2PAL.crystal:0x9fd6a0, size: cave?0.12:0.13, transparent:true, opacity:0.8}));
  S.add(flies);
  const clouds = [];   // low graveyard ground-fog banks (surface only) — updateAmbience drifts them in x
  if(!cave) for(let i=0;i<4;i++){
    const cl = new THREE.Mesh(geo('sph',rand(4,7),8,6), new THREE.MeshBasicMaterial({color:0x2a3040, transparent:true, opacity:0.4}));
    cl.scale.set(1.8,0.22,0.6);
    cl.userData = {y:rand(0.4,1.4), sp:rand(0.3,0.7), x:rand(x1-20,x2+20)};
    cl.position.set(cl.userData.x, cl.userData.y, -3.5);
    S.add(cl); clouds.push(cl);
  }
  return {flies, leaves, clouds, x1, x2};
}

// w2LevelFinish(G, x1, x2, mode, clutterTheme): the D2 tail — the drop-in replacement for
// 09_levelkit.levelFinish (whose ambience is Pumpkin-Patch orange). Sets checkpoint/bats/amb + clutter.
function w2LevelFinish(G, x1, x2, mode, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, mode==='cave'?8:6, mode==='cave'?24:32);
  G.amb  = w2Ambience(G.scene, x1, x2, mode);
  if(clutterTheme) w2Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) DECO BUILDERS (baked by caller) ===============================
// The silhouette builders below take NO G and add NO collider — return a Group; the caller merges it
// with bakeGroup (one draw call). Add a platform()/addBox collider yourself where a piece is standable.

// mausoleum(x,z,s,lit): a columned crypt building — the district's signature background silhouette.
function mausoleum(x, z, s=1, lit=false){
  const g = new THREE.Group();
  const stone=mat(W2PAL.stone), dark=mat(W2PAL.stoneD), trim=mat(W2PAL.stoneL);
  const base = mesh('box',[3.9*s,0.4*s,2.9*s], dark); base.position.y=0.2*s;
  const body = mesh('box',[3.4*s,2.6*s,2.4*s], stone); body.position.y=1.3*s;
  for(const cx of [-1.3,1.3]){ const col=mesh('cyl',[0.22*s,0.24*s,2.3*s,8], trim); col.position.set(cx*s,1.35*s,1.2*s); g.add(col); }
  const ped = mesh('box',[3.6*s,0.5*s,2.6*s], dark); ped.position.y=2.75*s;
  const roof = mesh('cone',[2.4*s,1.2*s,4], dark); roof.position.y=3.6*s; roof.rotation.y=Math.PI/4;
  const door = mesh('box',[1.0*s,1.7*s,0.2], mat(0x120f1e)); door.position.set(0,0.95*s,1.22*s);
  const lintel = mesh('box',[1.3*s,0.24*s,0.28*s], trim); lintel.position.set(0,1.9*s,1.22*s);
  const fin1 = mesh('box',[0.14*s,0.6*s,0.14*s], dark); fin1.position.y=4.35*s;
  const fin2 = mesh('box',[0.42*s,0.14*s,0.14*s], dark); fin2.position.y=4.3*s;
  g.add(base,body,ped,roof,door,lintel,fin1,fin2);
  if(lit){
    const win = mesh('box',[0.5*s,0.9*s,0.06], emat(W2PAL.cryptWin,W2PAL.cryptWin,0.9)); win.position.set(0,1.2*s,1.24*s);
    const slit = mesh('box',[0.12*s,0.7*s,0.06], emat(W2PAL.crystal,W2PAL.crystal,0.7)); slit.position.set(-1.0*s,1.4*s,1.23*s);
    g.add(win,slit);
  }
  g.position.set(x,0,z); g.rotation.y=rand(-0.08,0.08); crook(g,0.02);
  return g;
}

// ironFence(g, x1,z1,x2,z2,seg): wrought-iron railing with pointed finials — same signature as
// 08_hub.fenceRun (adds posts+rail to a group `g` the caller bakes). D2's fence flavour.
function ironFence(g, x1,z1,x2,z2,seg){
  const im = mat(W2PAL.iron);
  for(let i=0;i<=seg;i++){
    const t=i/seg, px=lerp(x1,x2,t), pz=lerp(z1,z2,t);
    const post = mesh('cyl',[0.05,0.05,1.0,5], im); post.position.set(px,0.5,pz); post.rotation.z=rand(-0.05,0.05); g.add(post);
    const spike = mesh('cone',[0.06,0.18,4], im); spike.position.set(px,1.05,pz); g.add(spike);
  }
  for(const yy of [0.35,0.85]){
    const rail = mesh('box',[Math.hypot(x2-x1,z2-z1),0.05,0.05], im);
    rail.position.set((x1+x2)/2, yy, (z1+z2)/2); rail.rotation.y=-Math.atan2(z2-z1,x2-x1); g.add(rail);
  }
}

// weepingStatue(x,z): a mossy grieving-angel monument (head bowed into folded hands, folded wings).
function weepingStatue(x, z){
  const g = new THREE.Group();
  const stone=mat(W2PAL.stoneL), moss=mat(W2PAL.moss);
  const ped = mesh('box',[0.9,0.9,0.9], mat(W2PAL.stone)); ped.position.y=0.45;
  const cap = mesh('box',[1.05,0.14,1.05], stone); cap.position.y=0.95;
  const robe = mesh('cyl',[0.28,0.5,1.4,8], stone); robe.position.y=1.75;
  const head = mesh('sph',[0.24,10,8], stone); head.position.set(0,2.45,0.14);
  const armL = mesh('cyl',[0.08,0.08,0.7,6], stone); armL.position.set(-0.18,2.15,0.2); armL.rotation.x=-0.9; armL.rotation.z=0.3;
  const armR = armL.clone(); armR.position.x=0.18; armR.rotation.z=-0.3;
  const wingL = mesh('box',[0.14,1.3,0.7], stone); wingL.position.set(-0.32,1.9,-0.2); wingL.rotation.z=0.25; wingL.rotation.y=0.3;
  const wingR = wingL.clone(); wingR.position.x=0.32; wingR.rotation.z=-0.25; wingR.rotation.y=-0.3;
  const m1 = mesh('sph',[0.16,6,5], moss); m1.position.set(0.2,1.2,0.22); m1.scale.set(1,1.4,0.4);
  const m2 = mesh('sph',[0.12,6,5], moss); m2.position.set(-0.3,0.6,0.4); m2.scale.set(1.3,0.8,0.4);
  g.add(ped,cap,robe,head,armL,armR,wingL,wingR,m1,m2);
  g.position.set(x,0,z); g.rotation.y=rand(-0.2,0.2); crook(g,0.02);
  return g;
}

// bonePile(x,z): a heap of ribs/limbs topped with a hollow-eyed skull. boneRow(x,z): a scatter line.
function bonePile(x, z){
  const g = new THREE.Group(); const bm=mat(PAL.bone);
  for(let i=0;i<5;i++){
    const b = mesh('cyl',[0.045,0.05,rand(0.4,0.7),5], bm);
    b.position.set(rand(-0.3,0.3), 0.08+rand(0,0.12), rand(-0.3,0.3));
    b.rotation.set(rand(TAU),rand(TAU),rand(TAU)); g.add(b);
  }
  const skull = mesh('sph',[0.16,9,8], bm); skull.position.set(rand(-0.1,0.1),0.16,0.05); skull.scale.set(1,1.05,0.95);
  const jaw = mesh('box',[0.16,0.06,0.12], bm); jaw.position.set(0,0.08,0.1);
  const e1 = mesh('sph',[0.04,5,5], mat(0x120f1e)); e1.position.set(-0.05,0.18,0.16);
  const e2 = e1.clone(); e2.position.x=0.05;
  g.add(skull,jaw,e1,e2); g.position.set(x,0,z);
  return g;
}
function boneRow(x, z){
  const g = new THREE.Group(); const bm=mat(PAL.bone);
  for(let i=0;i<4;i++){
    const b = mesh('cyl',[0.035,0.04,rand(0.3,0.5),5], bm);
    b.rotation.z=Math.PI/2; b.rotation.y=rand(-0.3,0.3);
    b.position.set(-0.5+i*0.34+rand(-0.05,0.05), 0.05, rand(-0.1,0.1)); g.add(b);
  }
  g.position.set(x,0,z);
  return g;
}

// crystalCluster(x,z,s,color): the catacombs' light AND beauty — a knot of emissive faceted spires
// on a rock base. Emissive-only (baked); a level can drop a real budgeted PointLight on a hero cluster.
function crystalCluster(x, z, s=1, color){
  const c = color||W2PAL.crystal;
  const g = new THREE.Group();
  const glow = emat(c, c, 0.9);
  const base = mesh('sph',[0.4*s,7,6], mat(W2PAL.caveWallL)); base.position.y=0.12*s; base.scale.set(1.4,0.5,1.2); g.add(base);
  const n = 3+Math.floor(rand(0,3));
  for(let i=0;i<n;i++){
    const h=rand(0.5,1.3)*s, r=rand(0.09,0.16)*s, a=rand(TAU), rr=rand(0,0.35)*s;
    const cr = mesh('cyl',[r*0.35, r, h, 6], glow);
    cr.position.set(Math.cos(a)*rr, h*0.45, Math.sin(a)*rr); cr.rotation.z=rand(-0.35,0.35); cr.rotation.x=rand(-0.35,0.35);
    const tip = mesh('sph',[r*0.5,5,5], emat(0xffffff, c, 1)); tip.position.set(cr.position.x, h*0.88, cr.position.z);
    g.add(cr,tip);
  }
  g.position.set(x,0,z);
  return g;
}

// stalactite(x,y,s,z): a cave-spike hanging from ceiling height y. stalagmite(x,s,z): rising from floor.
function stalactite(x, y, s=1, z=0){
  const g = new THREE.Group(); const h=rand(1.2,2.2)*s;
  const cone = mesh('cone',[0.3*s,h,6], mat(W2PAL.caveWall)); cone.rotation.x=Math.PI; cone.position.y=-h/2;   // base at y, tip hangs to y-h
  g.add(cone); g.position.set(x,y,z); g.rotation.y=rand(TAU); crook(g,0.03);
  return g;
}
function stalagmite(x, s=1, z=0){
  const g = new THREE.Group(); const h=rand(0.8,1.8)*s;
  const cone = mesh('cone',[0.34*s,h,6], mat(W2PAL.caveWallL)); cone.position.y=h/2;
  g.add(cone); g.position.set(x,0,z); g.rotation.y=rand(TAU); crook(g,0.02);
  return g;
}

// catacombArch(x,z,s): a stone archway of voussoir blocks framing the passage at background depth.
function catacombArch(x, z=-1, s=1){
  const g = new THREE.Group(); const m=mat(W2PAL.caveWallL), md=mat(W2PAL.caveWallD);
  const pL = mesh('box',[0.6*s,3.0*s,0.7*s], m); pL.position.set(-1.5*s,1.5*s,0);
  const pR = pL.clone(); pR.position.x=1.5*s;
  for(let i=0;i<5;i++){
    const a = Math.PI*(0.15+0.7*(i/4)), bx=Math.cos(a)*1.5*s, by=3.0*s+Math.sin(a)*0.9*s;
    const blk = mesh('box',[0.7*s,0.5*s,0.7*s], i%2?md:m); blk.position.set(bx,by,0); blk.rotation.z=a-Math.PI/2; g.add(blk);
  }
  const key = mesh('box',[0.6*s,0.6*s,0.75*s], md); key.position.set(0,3.95*s,0);
  g.add(pL,pR,key); g.position.set(x,0,z); crook(g,0.02);
  return g;
}

// undergroundRiver(G, x1, x2, opts): a glowing flowing water strip. VISUAL by default; pass
// opts.hazard=true to make falling in cost a heart (the catacomb current). Streaks drift on a fixed
// clock (deterministic). For a true CONVEYOR/current, a level can lay a thin trigger over it that adds
// to player.vel in onTouch — physics has no conveyor type, so that stays a level concern (note).
function undergroundRiver(G, x1, x2, opts={}){
  const w=Math.abs(x2-x1), cx=(x1+x2)/2, y=opts.y!==undefined?opts.y:0.04, z=opts.z||0, d=opts.d||4.4, col=opts.color||W2PAL.river;
  const bed = mesh('box',[w,0.5,d+0.4], mat(0x121826)); bed.position.set(cx,y-0.4,z);
  const bank = mesh('box',[w,0.16,d+0.7], emat(0x2a5a70,0x1c3a4a,0.4)); bank.position.set(cx,y-0.05,z);   // damp glowing bank rim
  const surf = mesh('box',[w,0.12,d], emat(col,col,0.5)); surf.position.set(cx,y,z);                       // luminous water (toned so it reads as a river, not a lit floor)
  G.scene.add(bed, bank, surf);
  const streaks=[], baseM=new THREE.MeshBasicMaterial({color:0xdff6ff, transparent:true, opacity:0.5, depthWrite:false});
  for(let i=0;i<Math.max(3,Math.floor(w/6));i++){
    const m = new THREE.Mesh(geo('box',1.4,0.06,0.5), baseM.clone());
    m.position.set(x1+rand(0,w), y+0.09, z+rand(-d/2+0.5, d/2-0.5)); G.scene.add(m);
    streaks.push({m, ph:rand(0,w)});
  }
  const dir=opts.dir||1, sp=opts.speed||2.2;
  G.ents.add({dead:false, cull:false, t:0, update(dt){
    this.t+=dt;
    for(const st of streaks){ st.m.position.x = x1 + (((st.ph + this.t*sp*dir) % w)+w)%w; st.m.material.opacity = 0.25+0.3*Math.sin(this.t*3+st.ph); }
  }});
  if(opts.hazard) G.world.addBox(cx, y-0.1, z, w, 0.5, d, {type:'hazard', damage:1});
  return {surf};
}

// =============================== 3) CLIMBABLES (D2 flavour) ===============================
// Modelled on 00_utils.buildVine: baked visual + a {type:'climb'} world volume (press up to grab,
// jump off with a boosted hop). z defaults to the play lane; returns the climb collider.

// w2Chain(G, x, y0, y1, z): a hanging iron chain — the Bell Tower descent's rung.
function w2Chain(G, x, y0, y1, z=0){
  const g = new THREE.Group(); const lm=mat(W2PAL.chain);
  let i=0;
  for(let y=y0; y<y1; y+=0.3, i++){
    const link = mesh('tor',[0.11,0.045,4,8], lm);
    link.position.set(x+Math.sin(y*3)*0.05, y+0.15, z);
    link.rotation.x=Math.PI/2; if(i%2) link.rotation.z=Math.PI/2;   // adjacent links perpendicular
    g.add(link);
  }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, y0, z, 1.0, (y1-y0), 1.2, {type:'climb'});
}
// w2BellRope(G, x, y0, y1, z, opts): a braided bell-rope; opts.bell adds the bell at the top.
function w2BellRope(G, x, y0, y1, z=0, opts={}){
  const g = new THREE.Group(); const rm=mat(W2PAL.rope);
  for(let y=y0; y<y1; y+=0.18){
    const seg = mesh('cyl',[0.06,0.06,0.2,5], rm);
    seg.position.set(x+Math.sin(y*6)*0.05, y+0.1, z+Math.cos(y*6)*0.05); g.add(seg);
  }
  if(opts.bell){
    const bell = mesh('cyl',[0.5,0.28,0.6,10], mat(0x9a7b3a)); bell.position.set(x,y1+0.32,z);
    const lip  = mesh('cyl',[0.52,0.5,0.12,10], emat(0xc9a227,0x7a5a10,0.4)); lip.position.set(x,y1+0.04,z);
    const yoke = mesh('box',[0.14,0.14,1.2], mat(W2PAL.iron)); yoke.position.set(x,y1+0.62,z);
    g.add(bell,lip,yoke);
  }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, y0, z, 1.0, (y1-y0), 1.2, {type:'climb'});
}

// =============================== 4) RESTLESS URN — the D2 gamble container ===============================
// Ravenmoor's CursedCoffin equivalent: SAME gamble table (8% 1-UP / 24% jackpot / 38% treats /
// 30% ambush), SAME CLEAR-PATCH LAW (levels place it in a clear pocket, no patrols within ~6u), SAME
// 1s spawnGrace on the ambush — but the ambush is a BAT SWARM (4 SwoopBat pouring out, air-positioned).
// Integrates EXACTLY like CursedCoffin: has .opened / .group.position / .open(G); a level pushes it to
// G.coffins and 09_levelkit.updateLevelCommon renders the interact prompt + calls .open(G) on interact.
// (Label note: updateLevelCommon's prompt string is hard-coded "cursed coffin"; .promptLabel below is
//  carried for when that shared prompt is generalised — until then the urn shares the coffin wording.)
class RestlessUrn {
  constructor(x, y, z, ry=0){
    this.group = new THREE.Group();
    const stone=mat(W2PAL.stone), stoneD=mat(W2PAL.stoneD), stoneL=mat(W2PAL.stoneL);
    // grave plinth base
    const slab = mesh('box',[1.7,0.25,1.7], stoneD); slab.position.y=0.125;
    const plinth = mesh('box',[1.2,0.7,1.2], stone); plinth.position.y=0.6;
    const cap = mesh('box',[1.4,0.16,1.4], stoneL); cap.position.y=1.03; crook(cap,0.02);
    // the funeral urn (its own group so it can shudder / pop its lid)
    this.urn = new THREE.Group();
    const foot = mesh('cyl',[0.22,0.3,0.18,10], stoneD); foot.position.y=0.09;
    const belly = mesh('sph',[0.42,12,10], stoneL); belly.position.y=0.5; belly.scale.set(1,1.15,1);
    const neck = mesh('cyl',[0.26,0.32,0.2,10], stone); neck.position.y=0.92;
    const rim = mesh('cyl',[0.34,0.34,0.1,10], stoneL); rim.position.y=1.02;
    const hL = mesh('tor',[0.12,0.04,5,10], stone); hL.position.set(-0.4,0.62,0); hL.rotation.y=Math.PI/2;
    const hR = hL.clone(); hR.position.x=0.4;
    this.gem = mesh('sph',[0.12,8,7], emat(0xff2040,0xff2040,1)); this.gem.position.set(0,0.62,0.34);   // cursed red gem
    this.lid = mesh('cyl',[0.3,0.22,0.16,10], stone); this.lid.position.y=1.12;
    this.urn.add(foot,belly,neck,rim,hL,hR,this.gem,this.lid);
    this.urn.position.y=1.11;
    this.glow = new THREE.PointLight(0xff2040, 22, 8); this.glow.position.set(0,1.7,0);   // temptation, visible from afar
    this.group.add(slab, plinth, cap, this.urn, this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='⚱️ Disturb the restless urn...?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      this.gem.scale.setScalar(1+Math.sin(this.t*3)*0.25);
      this.glow.intensity = 16+Math.sin(this.t*2.4)*10;
      this.urn.position.y = 1.11 + Math.sin(this.t*2.2)*0.02;   // a restless little shudder
    } else {
      this.glow.intensity = damp(this.glow.intensity, 0, 2, dt);
      this.lid.position.y = damp(this.lid.position.y, 1.55, 4, dt);   // lid pops off
      this.lid.rotation.z = damp(this.lid.rotation.z, 1.2, 4, dt);
    }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    AUDIO.tone({f:150,f2:60,type:'sawtooth',t:0.7,vol:0.22});
    AUDIO.noise({t:0.5,vol:0.18,fFrom:1100,fTo:150});
    G.camc.shake(0.2,0.4);
    const scene = G.scene;   // payout must land in THE SAME scene — a switchArea inside the 650ms window would spawn into the new area
    setTimeout(()=>{
      if(G.scene !== scene) return;
      const r = Math.random();
      if(r < 0.08){
        // GHOSTLY 1-UP — the rarest prize
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1);
        G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart(); AUDIO.ghostGiggle();
        UI.updateHUD();
        UI.toast('⚱️👻 A GHOSTLY 1-UP rose from the ashes! Lives: '+G.save.lives);
      } else if(r < 0.32){
        // JACKPOT — candy fountain + a heart + a random POWER-UP
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.0, 0));
        G.ents.add(new PowerUp(p.x+1.2, p.y+1.4, p.z, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.2,p.z), PAL.gold, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin();
        UI.toast('⚱️✨ JACKPOT! The urn was some old miser\'s hoard — candy, a heart, AND a treasure!');
      } else if(r < 0.7){
        // modest treats
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.2,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy(0);
        UI.toast('⚱️ A few candies... and a puff of very old dust.');
      } else {
        // AMBUSH — a BAT SWARM pours out of the urn!
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.2,p.z), 0x8a72c0, 22, {speed:4.5});
        AUDIO.bossRoar();
        G.camc.shake(0.4,0.45);
        const offs=[-2.6,-1.4,1.4,2.6];   // fixed scatter ring — never on the player, tight enough for the pocket
        for(let i=0;i<4;i++){
          const bx=p.x+offs[i], by=p.y+2.4;
          const bat = new SwoopBat(G, bx, by, 0, {range:1.6, aggroR:5, period:3.0, phase:i*0.9});   // air-positioned, distinct phases
          bat.group.position.set(bx, by, 0);
          bat.spawnGrace = 1.0;             // a breath to react before they can bite (the gamble is never a cheap hit)
          G.ents.add(bat);
        }
        UI.toast('⚱️🦇 BATS!! The whole swarm was NAPPING in there!!');
      }
    }, 650);
  }
}

// =============================== 5) RELIGHTABLE LANTERNS / LIGHT POOLS ===============================
// Light-pool contract: a lit lantern pushes {x, z, r} onto G.lightPools. The Wisp enemy reads that
// array — inside any pool's radius it recoils/goes dormant; in the dark it drifts toward the player.
//   const inLight = (G.lightPools||[]).some(pl => Math.hypot(wx-pl.x, wz-pl.z) < pl.r);
// w2DarkLantern starts DARK and lights on PROXIMITY (like a Checkpoint — no prompt-system dependency,
// which updateLevelCommon reserves for coffins/signs). w2Lantern starts lit (baseline safe pool).
// opts: {r:pool radius (5), relightR:proximity to ignite (2.4), light:add a real budgeted PointLight}.
function w2Lantern(G, x, y, z, opts={}){ return _w2lantern(G, x, y, z, true, opts); }
function w2DarkLantern(G, x, y, z, opts={}){ return _w2lantern(G, x, y, z, false, opts); }
function _w2lantern(G, x, y, z, startLit, opts){
  G.lightPools = G.lightPools || [];   // defensive — but levels should reset this to [] after levelBegin
  const gy = y===undefined?0:y;
  const grp = new THREE.Group();
  const pole = mesh('cyl',[0.09,0.13,2.6,6], mat(W2PAL.iron)); pole.position.y=1.3; crook(pole,0.04);
  const arm  = mesh('cyl',[0.05,0.05,0.5,5], mat(W2PAL.iron)); arm.rotation.z=Math.PI/2; arm.position.set(0.22,2.5,0);
  const cage = mesh('box',[0.42,0.55,0.42], mat(W2PAL.iron)); cage.position.set(0.44,2.35,0);
  const capc = mesh('cone',[0.32,0.28,4], mat(W2PAL.iron)); capc.position.set(0.44,2.78,0); capc.rotation.y=Math.PI/4;
  const flame = mesh('sph',[0.17,8,6], emat(0x555a6e,0x555a6e,0.6)); flame.position.set(0.44,2.35,0);
  grp.add(pole, arm, cage, capc, flame);
  const halo = new THREE.Mesh(geo('sph',0.4,8,7), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0, depthWrite:false}));
  halo.position.copy(flame.position); grp.add(halo);
  grp.position.set(x, gy, z);
  // ground light-pool disc (world-space, so it sits flat on the floor; fades in on ignite)
  const disc = new THREE.Mesh(geo('circ', opts.r||5, 24), new THREE.MeshBasicMaterial({color:0xffcf87, transparent:true, opacity:0, depthWrite:false}));
  disc.rotation.x=-Math.PI/2; disc.position.set(x, gy+0.05, z); disc.renderOrder=1; G.scene.add(disc);
  let light=null;
  if(opts.light){ light = new THREE.PointLight(0xffb85e, 0, opts.lightR||11); light.position.set(x+0.44, gy+2.35, z); G.scene.add(light); }
  const pool = {x, z, r: opts.r||5};
  const ent = {
    group: grp, dead:false, cull:false, t:rand(0,6), lit:false, pooled:false,
    ignite(G2, silent){
      if(this.lit) return;
      this.lit = true;
      flame.material = emat(0xffe0a0, 0xffb02e, 1);
      if(!this.pooled){ G2.lightPools.push(pool); this.pooled=true; }
      if(!silent){
        AUDIO.checkpoint && AUDIO.checkpoint();
        G2.fx && G2.fx.spawn(new THREE.Vector3(x+0.44, gy+2.6, z), 0xffcf87, 14, {speed:2.4, gravity:1});
        window.UI && UI.toast('🕯️ Lantern relit — the wisps shrink from the light!');
      }
    },
    update(dt, G2){
      this.t += dt;
      if(this.lit){
        flame.scale.setScalar(1+Math.sin(this.t*7)*0.15);
        halo.material.opacity = damp(halo.material.opacity, 0.26+Math.sin(this.t*5)*0.06, 4, dt);
        disc.material.opacity = damp(disc.material.opacity, 0.14+Math.sin(this.t*2.5)*0.03, 3, dt);
        disc.scale.setScalar(1+Math.sin(this.t*2)*0.03);
        if(light) light.intensity = 40+Math.sin(this.t*9)*8;
      } else {
        flame.scale.setScalar(1+Math.sin(this.t*2)*0.05);   // cold, barely-alive shudder
        const pl = G2.player;
        if(pl && Math.hypot(pl.pos.x-x, pl.pos.z-z) < (opts.relightR||2.4)) this.ignite(G2);
      }
    }
  };
  if(startLit) ent.ignite(G, true);   // baseline lantern: lit + pooled from the start, silently
  G.ents.add(ent);
  return ent;
}

// =============================== 6) LEVEL REGISTRY ===============================
// D2 level files self-register into W2_LEVELS: {id:'w2l1', district:'w2', name, build, update, parTime}.
const W2_LEVELS = [];
LEVEL_LISTS.push(W2_LEVELS);   // findLevel() now resolves w2 levels once files register

// =============================== THEMED CLUTTER (own copy — 00_utils.buildClutter can't be edited here) ===============================
// w2Clutter(G, x1, x2, theme): baked ground clutter. theme 'grave' (cold rocks, bones, moss tufts,
// tiny crosses, deathcap shrooms) up top · 'catacomb' (rubble, bones, baby stalagmites, glow-crystal
// shards, pebbles) below. Split the span around any pit/river so nothing floats over a void.
function w2Clutter(G, x1, x2, theme){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.2);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(theme==='catacomb'){
      if(r<0.3){ const rock=mesh('sph',[rand(0.12,0.24),6,5], mat(W2PAL.caveWallL)); rock.position.set(x,0.08,z); rock.scale.y=0.6; g.add(rock); }
      else if(r<0.52){ const bone=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.05,z); g.add(bone); }
      else if(r<0.72){ const st=mesh('cone',[rand(0.08,0.14),rand(0.2,0.45),5], mat(W2PAL.caveWallL)); st.position.set(x,rand(0.1,0.22),z); g.add(st); }
      else if(r<0.9){ const cc=pick([W2PAL.crystal,W2PAL.crystalV]); const cry=mesh('cone',[0.05,rand(0.18,0.4),5], emat(cc,cc,0.9)); cry.position.set(x,0.14,z); cry.rotation.z=rand(-0.4,0.4); g.add(cry); }
      else { const pb=mesh('sph',[rand(0.08,0.14),5,4], mat(W2PAL.stoneD)); pb.position.set(x,0.06,z); pb.scale.y=0.5; g.add(pb); }
    } else { // 'grave' surface
      if(r<0.3){ const rock=mesh('sph',[rand(0.1,0.22),6,5], mat(0x4a4860)); rock.position.set(x,0.08,z); rock.scale.y=0.6; g.add(rock); }
      else if(r<0.5){ const bone=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.05,z); g.add(bone); }
      else if(r<0.72){ const tuft=mesh('cone',[0.08,rand(0.2,0.4),4], mat(W2PAL.moss)); tuft.position.set(x,0.15,z); crook(tuft,0.25); g.add(tuft); }
      else if(r<0.9){ const cr=new THREE.Group(); const v=mesh('box',[0.06,0.34,0.06], mat(W2PAL.stoneD)); const hb=mesh('box',[0.2,0.06,0.06], mat(W2PAL.stoneD)); hb.position.y=0.08; cr.add(v,hb); cr.position.set(x,0.17,z); crook(cr,0.15); g.add(cr); }
      else { const shroom=mesh('sph',[0.08,6,5], mat(0x6a5a9e)); shroom.position.set(x,0.1,z); const stt=mesh('cyl',[0.03,0.04,0.1,4], mat(0xd8d4c8)); stt.position.set(x,0.04,z); g.add(shroom,stt); }
    }
  }
  G.scene.add(bakeGroup(g));
}

// ============ W6 KIT — FROSTMERE · Glimmerfields building blocks (the Winterfest expansion's first district) ============
// Sorts after every base-game kit/level (09zm > 09zl_w5l5) and before the w6 level files (09zn...). REUSES
// 09_levelkit's levelBegin/exitGate/updateLevelCommon and 00_utils builders. All static deco BAKED (bakeGroup);
// festival-light bulbs share FIVE materials and merge via mergeStrands (5 draw calls for a whole level of lights).
// Determinism: cosmetic scatter uses seeded rand(); icicle/roller/light clocks are fixed from level start.
//
// FROSTMERE'S CONTRACTS:
//  - build tail: call w6LevelFinish(G, x1, x2, clutterTheme) INSTEAD of levelFinish — sets checkpoint/bats/amb,
//    retints the scene fog/sky to the winter night, spawns the aurora, and starts the bulb-twinkle ticker.
//  - ICE: any collider with tag:'ice' is slick underfoot (06_player reads groundCol.tag) — lay w6IceX/w6IcePlat.
//  - LIGHT THAWS ICE: w6Lantern (relightable) + ThawBlock (melts when its linked lantern lights).

// ---- Frostmere palette: moonlit snow + deep blue-violet night, warm festival bulbs, icy cyan for the cold spirits ----
const W6PAL = {
  snow:    0xeef3ff,  snowD:   0xc4d2ec,  snowL:   0xffffff,   // moonlit snowbanks
  ice:     0xa8dcf4,  iceD:    0x5eb8e8,  iceDeep: 0x2a6ea8,   // frozen pond / icicle glass
  sky:     0x0e1830,  fog:     0x1e3054,                       // the winter night (deeper + bluer than Grimmwick's)
  pine:    0x1e4436,  pineD:   0x122c22,  pineSnow:0xdfe8f8,   // snow-shouldered evergreens
  wood:    0x6a4a34,  woodD:   0x46301f,                       // warm cottage timber
  bulbs:   [0xffb85e, 0xff5e6a, 0x58e08a, 0x7ae8ff, 0xffd23f], // WINTERFEST light strings (amber/red/green/cyan/gold)
  window:  0xffc87a,                                           // lamplit cottage windows
  coldFx:  0x7ae8ff,                                           // the deep cold's spirit-glow
  aurora:  [0x58e0a8, 0x7ae8ff, 0xb08aff],                     // the northern ribbons
  hillNear:0x18243e,  hillFar: 0x101a30,
};

// =============================== 1) BACKDROPS + AMBIENCE ===============================
function w6Parallax(S, x1, x2){
  // NEAR — snowdrift mounds, bare birches, and the odd watching snowman silhouette
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(5,9)){
    const r0 = rand();
    if(r0<0.45){ const drift=mesh('sph',[rand(1.6,2.8),8,6], mat(0x1c2a46)); drift.position.set(x, rand(-1.2,-0.4), -12.5); drift.scale.y=0.5; near.add(drift); }
    else if(r0<0.8){ const trunk=mesh('cyl',[0.06,0.1,rand(2.4,3.8),5], mat(0x24304c)); trunk.position.set(x, rand(0.8,1.6), -12.8); trunk.rotation.z=rand(-0.15,0.15); near.add(trunk);
      for(let b=0;b<3;b++){ const br=mesh('cyl',[0.02,0.04,rand(0.7,1.2),4], mat(0x24304c)); br.position.set(x+rand(-0.4,0.4), rand(2,3.4), -12.8); br.rotation.z=rand(-1.2,1.2); near.add(br); } }
    else { const b1=mesh('sph',[0.55,8,6], mat(0x202c48)); b1.position.set(x,0.1,-12.6); const b2=mesh('sph',[0.4,8,6], mat(0x202c48)); b2.position.set(x,0.75,-12.6); const b3=mesh('sph',[0.28,8,6], mat(0x202c48)); b3.position.set(x,1.25,-12.6); near.add(b1,b2,b3); }
  }
  S.add(bakeGroup(near));
  // MID — the lamplit village skyline: peaked cottages with warm windows, snow-capped pines, light strings on the eaves
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(10,17)){
    if(rand()<0.62){
      const bw=rand(2.6,4.2), bh=rand(2,3.2);
      const house=mesh('box',[bw,bh,1.4], mat(0x1a2440)); house.position.set(x,bh/2,-19); mid.add(house);
      const roof=mesh('cone',[bw*0.72,rand(1.4,2),4], mat(0x141c34)); roof.position.set(x,bh+0.7,-19); roof.rotation.y=Math.PI/4; mid.add(roof);
      const cap=mesh('cone',[bw*0.74,0.5,4], mat(0xbfd0ec)); cap.position.set(x,bh+1.45,-19); cap.rotation.y=Math.PI/4; mid.add(cap);   // snow on the ridge
      const nwin = 1+Math.floor(rand(0,2.4));
      for(let wI=0;wI<nwin;wI++){ const win=mesh('box',[0.34,0.44,0.1], emat(W6PAL.window,W6PAL.window,0.9)); win.position.set(x+(wI-(nwin-1)/2)*0.8, bh*0.55, -18.2); mid.add(win); }
      const chim=mesh('box',[0.3,0.8,0.3], mat(0x141c34)); chim.position.set(x+bw*0.25, bh+1.2, -19); mid.add(chim);
      // eave bulbs — tiny festive dots along the roofline (baked; the LIVE twinklers are the level's own strings)
      for(let bI=0;bI<4;bI++){ const cc=pick(W6PAL.bulbs); const bb=mesh('sph',[0.07,5,4], emat(cc,cc,0.95)); bb.position.set(x-bw*0.36+bI*bw*0.24, bh+0.15, -18.4); mid.add(bb); }
    } else {
      const th=rand(3,5);
      const pine=mesh('cone',[rand(1.2,1.8),th,6], mat(W6PAL.pineD)); pine.position.set(x,th/2,-19.4); mid.add(pine);
      const snowCap=mesh('cone',[rand(0.5,0.8),th*0.3,6], mat(0xaebfe0)); snowCap.position.set(x,th*0.92,-19.3); mid.add(snowCap);
    }
  }
  S.add(bakeGroup(mid));
  // FAR — great blue peaks under the winter moon
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(9,15)){ const peak=mesh('cone',[rand(4,7),rand(9,17),4], mat(W6PAL.hillFar)); peak.position.set(x,rand(-2,2),-28); far.add(peak);
    const snowTip=mesh('cone',[rand(1,1.8),rand(2.4,4),4], mat(0x2a3a5e)); snowTip.position.set(x,rand(8,13),-27.8); far.add(snowTip); }
  S.add(bakeGroup(far));
  // COLD-GLOW MIDGROUND — scattered spirit-motes and bulb-glow flecks
  const glow = new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/6);i++){ const cc=pick([W6PAL.coldFx, 0xffb85e, 0xffd23f]); const g=mesh('sph',[rand(0.09,0.2),6,5], emat(cc,cc,0.8)); g.position.set(rand(x1,x2), rand(1.5,6), rand(-9,-4)); glow.add(g); }
  S.add(bakeGroup(glow));
}

function w6Ambience(S, x1, x2){
  // leaves channel — SNOWFALL (slow, swaying, endless)
  const leaves = [];
  for(let i=0;i<22;i++){ const lf=new THREE.Mesh(geo('circ',rand(0.07,0.13),5), new THREE.MeshBasicMaterial({color:pick([0xffffff,0xeef3ff,0xdfe8fa]), transparent:true, opacity:rand(0.55,0.85), side:THREE.DoubleSide, depthWrite:false})); lf.userData={x0:rand(x1,x2), y0:rand(4,10), sp:rand(0.16,0.4), ph:rand(9), sw:rand(0.9,2.0)}; S.add(lf); leaves.push(lf); }
  // flies channel — ice-sparkle motes drifting the midground
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<38;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0xbfe8ff, size:0.1, transparent:true, opacity:0.7}));
  S.add(flies);
  const clouds = [];
  for(let i=0;i<5;i++){ const cl=new THREE.Mesh(geo('sph',rand(6,9),8,6), new THREE.MeshBasicMaterial({color:0x223252, transparent:true, opacity:0.4})); cl.scale.set(2.1,0.22,0.6); cl.userData={y:rand(0.4,1.4), sp:rand(0.2,0.5), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.5); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

// THE AURORA — three slow ribbons of northern light breathing across the far sky. Unbaked (they live), but
// three additive planes cost nothing. Registered as a G.ents ticker so every winter area gets the same sky.
function w6Aurora(G, x1, x2){
  const ribbons = [];
  for(let i=0;i<3;i++){
    const cc = W6PAL.aurora[i];
    const rb = new THREE.Mesh(new THREE.PlaneGeometry((x2-x1)*0.7+40, 3.2+i*1.4, 1, 1),
      new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0.10, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
    rb.position.set((x1+x2)/2 + (i-1)*14, 16+i*2.6, -29.5-i*0.3);
    rb.rotation.z = (i-1)*0.05;
    G.scene.add(rb); ribbons.push(rb);
  }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), group:new THREE.Group(),
    update(dt){ this.t+=dt;
      for(let i=0;i<ribbons.length;i++){ const rb=ribbons[i];
        // breathe around a PER-RIBBON BASE (w10 audit fix: the old absolute assign overwrote any
        // district boost every frame — the aurora's home cranks userData.base instead)
        rb.material.opacity = (rb.userData.base!==undefined?rb.userData.base:0.11) + Math.sin(this.t*0.35 + i*2.1)*0.05;
        rb.position.y = 16+i*2.6 + Math.sin(this.t*0.22 + i)*0.8;
        rb.scale.y = 1 + Math.sin(this.t*0.5 + i*1.7)*0.18;
      } } });
}

function w6LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 4, 32);
  G.amb  = w6Ambience(G.scene, x1, x2);
  w6Aurora(G, x1, x2);
  // the winter night is colder and bluer than Grimmwick's — retint the fresh scene (per-area; switchArea rebuilds)
  G.scene.background = new THREE.Color(W6PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W6PAL.fog);
  if(clutterTheme) w6Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) WINTERFEST LIGHT STRINGS (owner seed: "good winter lights") ===============================
// Bulbs share FIVE materials level-wide and merge to 5 draw calls; ONE ticker makes the whole level twinkle in
// five staggered phase-groups. Usage: const L=w6LightsBegin(); w6String(L, x1,y1, x2,y2); ... w6LightsFinish(G, L);
function w6LightsBegin(){
  const sets = W6PAL.bulbs.map(c=>[new THREE.Group(), new THREE.MeshBasicMaterial({color:c, transparent:true, opacity:0.95})]);
  return {sets, wires:new THREE.Group(), n:0};
}
function w6String(L, x1,y1, x2,y2, opts={}){
  const segs = opts.segs || Math.max(6, Math.floor(Math.hypot(x2-x1,y2-y1)*1.4));
  const sag = opts.sag!==undefined?opts.sag:Math.min(1.2, Math.hypot(x2-x1,y2-y1)*0.09);
  const z = opts.z!==undefined?opts.z:-1.6;
  let px=x1, py=y1;
  for(let i=1;i<=segs;i++){
    const t=i/segs;
    const qx=lerp(x1,x2,t), qy=lerp(y1,y2,t)-Math.sin(t*Math.PI)*sag;
    const len=Math.hypot(qx-px,qy-py);
    const wseg=mesh('cyl',[0.015,0.015,len,3], mat(0x141a2c));
    wseg.position.set((px+qx)/2,(py+qy)/2,z);
    wseg.rotation.z = Math.atan2(qx-px, qy-py) * -1 + Math.PI;   // align along the run
    L.wires.add(wseg);
    if(i<segs){ const set = L.sets[(L.n++)%L.sets.length];
      const bulb=mesh('sph',[0.075,6,5], set[1]); bulb.position.set(qx,qy-0.09,z); set[0].add(bulb);
      const cap=mesh('cyl',[0.03,0.03,0.05,4], mat(0x2a3048)); cap.position.set(qx,qy-0.02,z); L.wires.add(cap); }
    px=qx; py=qy;
  }
}
function w6LightsFinish(G, L){
  G.scene.add(bakeGroup(L.wires));
  const mats = [];
  for(const [bg,bm] of L.sets){ if(bg.children.length){ G.scene.add(mergeStrands(bg,bm)); mats.push(bm); } }
  if(mats.length) G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), group:new THREE.Group(),
    update(dt){ this.t+=dt; for(let i=0;i<mats.length;i++){ mats[i].opacity = 0.72 + Math.sin(this.t*2.1 + i*1.35)*0.26; } } });
}
// a simple light-strung post pair for ground-level strings
function w6LightPost(x, z, h=3){
  const g=new THREE.Group();
  const pole=mesh('cyl',[0.07,0.1,h,6], mat(W6PAL.woodD)); pole.position.set(x,h/2,z); g.add(pole);
  const cap=mesh('sph',[0.12,6,5], mat(0xbfd0ec)); cap.position.set(x,h+0.05,z); g.add(cap);   // snow knob
  return g;
}

// =============================== 3) ICE GROUND & PLATFORMS (the SLIDE verb) ===============================
// tag:'ice' is the whole mechanism — 06_player reads groundCol.tag and swaps accel/friction. Slick reads GLOSSY:
// pale glassy top with an emissive sheen strip so players see the surface change coming (telegraphed, always).
function w6IceX(G, x1, x2, d=10){
  const w=Math.abs(x2-x1), cx=(x1+x2)/2;
  const m=mesh('box',[w,1.2,d], mat(W6PAL.iceDeep)); m.position.set(cx,-0.6,0);
  const top=mesh('box',[w,0.16,d+0.2], emat(W6PAL.ice,0x3a8ec8,0.28)); top.position.set(cx,0.0,0);
  G.scene.add(m, top);
  // frozen-in sparkle flecks (baked)
  const fl=new THREE.Group();
  for(let i=0;i<Math.floor(w/1.6);i++){ const s=mesh('sph',[rand(0.04,0.08),4,4], emat(0xdff4ff,0xbfe8ff,0.8)); s.position.set(rand(x1,x2),0.09,rand(-2.5,2.5)); s.scale.y=0.4; fl.add(s); }
  G.scene.add(bakeGroup(fl));
  return G.world.addBox(cx,-1.2,0,w,1.2,d,{tag:'ice'});
}
function w6IcePlat(G,x,y,z,w,d){
  const m=mesh('box',[w,0.5,d], emat(W6PAL.ice,0x3a8ec8,0.22)); m.position.set(x,y-0.25,z); G.scene.add(m);
  return G.world.addBox(x,y-0.5,z,w,0.5,d,{tag:'ice'});
}
// a fishing hole in a frozen pond — falling in costs a heart and pops you out shivering (never a death)
function w6FishHole(G, x, w=1.6){
  const rim=mesh('cyl',[w*0.62,w*0.62,0.1,10], mat(0x18324e)); rim.position.set(x,0.06,0); rim.scale.z=0.75; G.scene.add(rim);
  const water=mesh('cyl',[w*0.55,w*0.55,0.06,10], emat(0x123048,0x1a4a6a,0.5)); water.position.set(x,0.08,0); water.scale.z=0.75; G.scene.add(water);
  G.world.addBox(x,-0.4,0,w,0.5,2.2,{type:'hazard',damage:1});
}

// =============================== 4) SPIKE ICICLES (owner seed — the ceiling lane) ===============================
// Hangs under a ceiling/overhang at (x, hangY). Fixed clock: shimmer+drip telegraph (~0.7s, with a growing floor
// target-glow — the bombardment language) → DROPS (heart-cost hit) → shatters on the floor → regrows next cycle.
// opts.embed:true = the FIRST drop embeds in the snow as a standable platform, forever (deterministic timing).
class SpikeIcicle {
  constructor(G, x, hangY, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false;
    this.x=x; this.hangY=hangY; this.floorY=opts.floorY||0;
    this.period=opts.period||4.2; this.phase=opts.phase||0; this.tele=0.7;
    this.embed=!!opts.embed; this.embedded=false;
    this.len=opts.len||1.15; this.t=this.phase; this.state='hang'; this.vy=0;
    this.group=new THREE.Group();
    this.iceM = new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.3, transparent:true, opacity:0.85});
    this.spike = new THREE.Mesh(geo('cone',0.17,this.len,6), this.iceM);
    this.spike.rotation.x=Math.PI; this.spike.position.set(x, hangY-this.len/2, 0); this.group.add(this.spike);
    const root=mesh('sph',[0.2,6,5], this.iceM); root.scale.y=0.5; root.position.set(x,hangY,0); this.group.add(root);
    // the floor target-glow (telegraph — grows during the shimmer)
    this.glow = new THREE.Mesh(geo('circ',0.5,12), new THREE.MeshBasicMaterial({color:W6PAL.coldFx, transparent:true, opacity:0, depthWrite:false}));
    this.glow.rotation.x=-Math.PI/2; this.glow.position.set(x,this.floorY+0.04,0); this.group.add(this.glow);
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    if(this.embedded) return;
    const cyc = this.t % this.period;
    const pl=G.player;
    if(this.state==='hang'){
      const toTele = this.period - this.tele;
      if(cyc >= toTele){
        const k=(cyc-toTele)/this.tele;
        this.iceM.emissiveIntensity = 0.3 + Math.sin(this.t*26)*0.5*k;   // the shimmer
        this.glow.material.opacity = k*0.4; this.glow.scale.setScalar(0.5+k*0.7);
        if(k<0.08) G.fx.spawn(new THREE.Vector3(this.x,this.hangY-this.len,0), 0xbfe8ff, 1, {speed:0.4, life:0.5, gravity:4});   // the drip
      } else { this.iceM.emissiveIntensity=0.3; this.glow.material.opacity=damp(this.glow.material.opacity,0,6,dt); }
      if(cyc < dt*1.5 && this.t > this.tele){ this.state='fall'; this.vy=0; }
    } else if(this.state==='fall'){
      this.vy -= 26*dt;
      this.spike.position.y += this.vy*dt;
      this.glow.material.opacity = 0.4;
      if(pl && !pl.dead && Math.abs(pl.pos.x-this.x)<0.5 && Math.abs(pl.pos.z)<0.9 &&
         pl.pos.y < this.spike.position.y+this.len*0.5 && pl.pos.y+1.2 > this.spike.position.y-this.len*0.5){
        pl.damage(1, new THREE.Vector3(this.x, this.spike.position.y, 0));
      }
      if(this.spike.position.y - this.len/2 <= this.floorY){
        if(this.embed){
          // EMBEDS — a standable ice stump, forever (the level's own clock makes this identical every run)
          this.embedded=true;
          this.spike.position.y = this.floorY + this.len*0.32;
          this.spike.rotation.x = Math.PI; this.iceM.emissiveIntensity=0.25; this.glow.material.opacity=0;
          this.G.world.addBox(this.x, this.floorY, 0, 0.62, this.len*0.62, 0.9, {});
          AUDIO.stomp && AUDIO.stomp();
          this.G.fx.spawn(new THREE.Vector3(this.x,this.floorY+0.3,0), 0xbfe8ff, 8, {speed:2.5, life:0.4});
        } else {
          this.state='regrow'; this.glow.material.opacity=0;
          AUDIO.noise && AUDIO.noise({t:0.2,vol:0.13,fFrom:2400,fTo:500});
          this.G.fx.spawn(new THREE.Vector3(this.x,this.floorY+0.2,0), 0xbfe8ff, 10, {speed:3, life:0.4});
          this.spike.visible=false;
        }
      }
    } else { // regrow at the root
      if(cyc < this.period-this.tele-0.2 && cyc > 0.4){
        this.spike.visible=true;
        this.spike.position.y = this.hangY - this.len/2;
        const k = Math.min(1, cyc/1.2);
        this.spike.scale.set(k,k,k);
        if(k>=1) this.state='hang';
      }
    }
  }
}

// =============================== 5) LIGHT THAWS ICE (the relight motif — 6-4's gimmick) ===============================
// w6Lantern: an UNLIT festival lantern on a post — spin/pound beside it to light it (pushes G.lightPools).
// ThawBlock: a wall/floor of solid ice that MELTS when its linked lantern lights. Both via G.ents.add.
class W6Lantern {
  constructor(G, x, y, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,9);
    this.x=x; this.y=y; this.lit=!!opts.lit; this.r=opts.r||5;
    this.group=new THREE.Group();
    const post=mesh('cyl',[0.07,0.1,y+1.1,6], mat(W6PAL.woodD)); post.position.set(x,(y+1.1)/2,0); this.group.add(post);
    const cage=mesh('box',[0.42,0.5,0.42], mat(0x2a3048)); cage.position.set(x,y+1.1,0); this.group.add(cage);
    this.flame=mesh('sph',[0.14,7,6], emat(0xffc87a,0xffb85e,1)); this.flame.position.set(x,y+1.1,0); this.group.add(this.flame);
    this.halo=new THREE.Mesh(geo('sph',0.5,8,7), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0.16, depthWrite:false}));
    this.halo.position.set(x,y+1.1,0); this.group.add(this.halo);
    this._setLit(this.lit, true);
    G.scene.add(this.group);
  }
  _setLit(on, silent){
    this.lit=on;
    this.flame.visible=on; this.halo.visible=on;
    if(on){
      this.G.lightPools && this.G.lightPools.push({x:this.x, z:0, r:this.r});
      if(!silent){ AUDIO.checkpoint && AUDIO.checkpoint();
        this.G.fx.spawn(new THREE.Vector3(this.x,this.y+1.2,0), 0xffc87a, 12, {speed:2.5, life:0.5}); }
    }
  }
  update(dt, G){
    this.t+=dt;
    if(this.lit){ this.halo.scale.setScalar(1+Math.sin(this.t*3)*0.12); return; }
    const pl=G.player;
    if(pl && !pl.dead && (pl.attackT>0 || pl.pounding) && Math.abs(pl.pos.x-this.x)<1.7 && Math.abs(pl.pos.z)<1.6){
      this._setLit(true);
      window.UI && UI.toast('🏮 The lantern takes the flame — feel the air warm.');
    }
  }
}
class ThawBlock {
  constructor(G, x, y, w, h, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,9);
    this.lantern=opts.lantern||null; this.melting=false; this.mT=0;
    this.mesh=new THREE.Mesh(geo('box',w,h,opts.d||2.2),
      new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.25, transparent:true, opacity:0.72}));
    this.mesh.position.set(x, y+h/2, 0); this.group=new THREE.Group(); this.group.add(this.mesh);
    this.col=G.world.addBox(x, y, 0, w, h, opts.d||2.2, {});
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    if(this.melting){
      this.mT+=dt;
      const k=Math.min(1, this.mT/1.2);
      this.mesh.scale.y = 1-k*0.96; this.mesh.position.y = this.mesh.position.y - dt*0.8;
      this.mesh.material.opacity = 0.72*(1-k);
      if(this.mT>0.1 && this.col.type!=='ghost'){ this.col.type='ghost'; }
      if(k>=1){ this.mesh.visible=false; this.dead=true; }   // fully melted: retire the ticker (collider is already ghost)
      return;
    }
    this.mesh.material.emissiveIntensity = 0.2+Math.sin(this.t*2)*0.08;
    if(this.lantern && this.lantern.lit){
      this.melting=true; this.mT=0;
      AUDIO.noise && AUDIO.noise({t:0.5,vol:0.14,fFrom:1600,fTo:200});
      const p=this.mesh.position;
      this.G.fx.spawn(new THREE.Vector3(p.x,p.y,p.z), 0xa8dcf4, 16, {speed:2.5, life:0.7});
      window.UI && UI.toast('💧 The ice gives way to the light!');
    }
  }
}

// =============================== 6) THE MYSTERY IGLOO — Frostmere's gamble container (owner seed) ===============================
// Warm light leaks from the door tunnel; the red gamble-pulse glows through the snow bricks. Same table as every
// district (8% 1-UP / 24% jackpot / 38% candy / 30% AMBUSH), CLEAR-PATCH law, 1s spawnGrace. The ambush is a
// squad of Frostbite Penguins tobogganing OUT THE DOOR. Integrates like CursedCoffin (G.coffins + G.ents.add).
class MysteryIgloo {
  constructor(x, y, z, ry=0){
    this.group = new THREE.Group();
    const brickM = emat(0xdfe8f8, 0x8aa4d0, 0.12);
    const dome = mesh('sph',[1.5,12,8], brickM); dome.scale.y=0.78; this.group.add(dome);
    for(let ring=0;ring<3;ring++){ const tor=mesh('tor',[1.42-ring*0.34, 0.05, 5, 14], mat(0xb8c8e4)); tor.rotation.x=Math.PI/2; tor.position.y=0.3+ring*0.42; this.group.add(tor); }
    // the door tunnel, warm light spilling out
    const tun = mesh('cyl',[0.62,0.66,0.9,10,1,false,Math.PI,Math.PI], brickM); tun.rotation.z=Math.PI/2; tun.rotation.y=Math.PI/2; tun.position.set(0,0.34,1.4); this.group.add(tun);
    this.door = mesh('circ',[0.5,10], emat(0xffc87a,0xffb85e,0.9)); this.door.position.set(0,0.42,1.86); this.group.add(this.door);
    // the gamble tell — red pulse bleeding through the snow bricks
    this.seam = mesh('sph',[1.53,10,7], new THREE.MeshBasicMaterial({color:0xff4a5a, transparent:true, opacity:0.12, depthWrite:false})); this.seam.scale.y=0.78; this.group.add(this.seam);
    this.glow = new THREE.PointLight(0xff7a6a, 12, 7); this.glow.position.set(0,1.2,0); this.group.add(this.glow);
    const cap=mesh('sph',[0.3,7,5], mat(0xffffff)); cap.scale.y=0.4; cap.position.y=1.2; this.group.add(cap);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🧊 Peek inside the mystery igloo...?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      const pulse=0.08+Math.abs(Math.sin(this.t*2.6))*0.14; this.seam.material.opacity=pulse;
      this.glow.intensity=9+Math.sin(this.t*2.2)*5;
      this.door.material.emissiveIntensity=0.7+Math.sin(this.t*3.1)*0.25;
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.seam.material.opacity=damp(this.seam.material.opacity,0,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    AUDIO.tone && AUDIO.tone({f:220,f2:90,type:'triangle',t:0.4,vol:0.18});
    AUDIO.noise && AUDIO.noise({t:0.25,vol:0.14,fFrom:900,fTo:300});
    G.camc.shake(0.15,0.35);
    const scene = G.scene;   // payout lands in THE SAME scene (the coffin-family switchArea guard)
    setTimeout(()=>{
      if(G.scene !== scene) return;
      const r = Math.random();
      if(r < 0.08){
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('🧊👻 A GHOSTLY 1-UP was keeping warm in there! Lives: '+G.save.lives);
      } else if(r < 0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.0, 0)); G.ents.add(new PowerUp(p.x+1.2, p.y+1.2, 0, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), 0xffd23f, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('🧊✨ JACKPOT! Somebody\'s whole winter stash — candy, a heart, AND a treasure!');
      } else if(r < 0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('🧊 A few frosty candies... and a draft.');
      } else {
        G.fx.spawn(new THREE.Vector3(p.x,p.y+0.6,p.z+1.6), 0xf0f4ff, 22, {speed:4.5});
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.35,0.4);
        _iglooAmbush(G, p);
        window.UI && UI.toast('🧊🐧 PENGUINS!! It was FULL of penguins!!');
      }
    }, 650);
  }
}
function _iglooAmbush(G, p){
  const offs = [-2.6, -1.4, 1.4, 2.6];
  for(let i=0;i<offs.length;i++){
    const bx = p.x+offs[i];
    const m = new FrostbitePenguin(G, bx, p.y, 0, {phase:i*0.3, range:2.2, dir:offs[i]>0?1:-1});
    m.group.position.set(bx, p.y, 0); m.spawnGrace = 1.0; G.ents.add(m);
  }
}

// =============================== 7) THE WRONG SNOWMAN — Frostmere's Old Shortcut warp ===============================
// Somebody built him ALL WRONG: his three balls lie scattered by a bare pole, under a lone PURPLE lantern (the
// warp language). Ground-pound beside each ball LARGEST FIRST to stack him right — finish him and he tips his
// hat: the warp opens. Wrong order and the stack hops off to start over. Once per run, full candy bonus.
class WrongSnowman {
  constructor(G, x, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this.x=x; this.warpX=opts.warpX!==undefined?opts.warpX:x+8; this.candy=opts.candy||40; this.used=false;
    this.group=new THREE.Group();
    const snow = emat(0xf0f4ff, 0x8aa4d0, 0.2);
    this.pole = mesh('cyl',[0.05,0.07,2.2,5], mat(0x4a3826)); this.pole.position.set(x,1.1,0); this.group.add(this.pole);
    // the scattered balls: big / mid / small(+face) — pound order is big → mid → small
    this.balls = [
      {r:0.62, home:new THREE.Vector3(x-2.2,0.62,0.4), stackY:0.62},
      {r:0.45, home:new THREE.Vector3(x+2.0,0.45,-0.3), stackY:1.55},
      {r:0.32, home:new THREE.Vector3(x-1.2,0.32,-0.9), stackY:2.2},
    ];
    for(const b of this.balls){
      b.mesh = mesh('sph',[b.r,10,9], snow); b.mesh.position.copy(b.home); this.group.add(b.mesh);
      b.stacked=false;
    }
    // the smallest ball is the head — coal smile so it reads
    const face=this.balls[2].mesh;
    for(let i=0;i<3;i++){ const c=mesh('sph',[0.03,4,4], mat(0x1a1a28)); c.position.set(-0.08+i*0.08, -0.05, 0.29); face.add(c); }
    const hat=mesh('cyl',[0.16,0.18,0.22,10], mat(0x1e1a2c)); hat.position.y=0.3; face.add(hat);
    // THE TELL: the lone purple lantern
    this.tell = mesh('sph',[0.18,8,7], emat(0x9a5fd0,0x9a5fd0,1)); this.tell.position.set(x,3.1,0); this.group.add(this.tell);
    const post=mesh('cyl',[0.04,0.05,3.0,4], mat(0x2a2436)); post.position.set(x+0.4,1.5,-0.5); this.group.add(post);
    this.next=0; this._poundWas=false;
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    this.tell.scale.setScalar(1+Math.sin(this.t*3)*0.25);
    if(this.used) return;
    const pl=G.player;
    if(!pl || pl.dead) return;
    // a pound LANDING beside a ball claims it (edge-detect so one pound = one ball)
    const pounding = pl.pounding && pl.grounded;
    if(pounding && !this._poundWas){
      let hit=-1;
      for(let i=0;i<this.balls.length;i++){ const b=this.balls[i];
        if(!b.stacked && Math.hypot(pl.pos.x-b.mesh.position.x, pl.pos.z-b.mesh.position.z) < b.r+1.3){ hit=i; break; } }
      if(hit>=0){
        if(hit===this.next){
          const b=this.balls[hit]; b.stacked=true; this.next++;
          b.mesh.position.set(this.x, b.stackY, 0);
          AUDIO.stomp && AUDIO.stomp();
          G.fx.spawn(new THREE.Vector3(this.x,b.stackY,0), 0xf0f4ff, 10, {speed:2.5, life:0.4});
          if(this.next>=3) this._open(G);
          else window.UI && UI.toast(this.next===1 ? '⛄ The big ball hops onto the pole... next!' : '⛄ Almost whole... the head now!');
        } else {
          // wrong order — the stack shakes itself apart
          for(const b of this.balls){ b.stacked=false; b.mesh.position.copy(b.home); }
          this.next=0;
          AUDIO.noise && AUDIO.noise({t:0.2,vol:0.12,fFrom:400,fTo:150});
          window.UI && UI.toast('⛄ The balls hop off, offended. Biggest first, builder.');
        }
      }
    }
    this._poundWas = pounding;
  }
  _open(G){
    this.used=true;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin(); G.camc.shake(0.4,0.5);
    G.fx.spawn(new THREE.Vector3(this.x,2.2,0), 0x9a5fd0, 30, {speed:6, life:1});
    window.UI && UI.toast('⛄✨ He tips his hat — and remembers a SHORTCUT! Off you go!');
    G.addCandy(this.candy);
    G.persist && G.persist();
    G._warpUsed = true;
    const pl=G.player; pl.pos.set(this.warpX, 2, 0); pl.vel.set(0,0,0);
    window.UI && UI.updateHUD();
  }
}

// =============================== 8) DECO BUILDERS (baked by caller) ===============================
function w6Pine(x, z, s=1){
  const g=new THREE.Group();
  const trunk=mesh('cyl',[0.12*s,0.18*s,0.8*s,6], mat(W6PAL.woodD)); trunk.position.set(x,0.4*s,z); g.add(trunk);
  for(let i=0;i<3;i++){ const tier=mesh('cone',[(1.3-i*0.32)*s,1.1*s,7], mat(i%2?W6PAL.pine:W6PAL.pineD)); tier.position.set(x,(1.1+i*0.75)*s,z); g.add(tier);
    const cap=mesh('cone',[(1.0-i*0.26)*s,0.34*s,7], mat(W6PAL.pineSnow)); cap.position.set(x,(1.45+i*0.75)*s,z); g.add(cap); }
  return g;
}
function w6SnowmanDeco(x, z, s=1, ry=0){
  const g=new THREE.Group();
  const snow=mat(W6PAL.snow);
  const b1=mesh('sph',[0.5*s,9,8], snow); b1.position.set(x,0.42*s,z); g.add(b1);
  const b2=mesh('sph',[0.36*s,9,8], snow); b2.position.set(x,1.0*s,z); g.add(b2);
  const b3=mesh('sph',[0.26*s,9,8], snow); b3.position.set(x,1.46*s,z); g.add(b3);
  const carrot=mesh('cone',[0.05*s,0.24*s,5], mat(0xe8833a)); carrot.rotation.x=Math.PI/2; carrot.position.set(x+Math.sin(ry)*0.26*s, 1.46*s, z+Math.cos(ry)*0.26*s); g.add(carrot);
  for(const e of [-0.09,0.09]){ const c=mesh('sph',[0.03*s,4,4], mat(0x1a1a28)); c.position.set(x+e*s+Math.sin(ry)*0.22*s, 1.54*s, z+Math.cos(ry)*0.22*s); g.add(c); }
  const brim=mesh('cyl',[0.2*s,0.2*s,0.04*s,10], mat(0x1e1a2c)); brim.position.set(x,1.66*s,z); g.add(brim);
  const top=mesh('cyl',[0.13*s,0.14*s,0.2*s,10], mat(0x1e1a2c)); top.position.set(x,1.78*s,z); g.add(top);
  return g;
}
function w6GiftBox(x, z, s=1, col){
  const g=new THREE.Group();
  const c = col||pick([0xd83a4a, 0x3aa060, 0x4a7ae0, 0xffd23f]);
  const box=mesh('box',[0.5*s,0.44*s,0.5*s], emat(c, new THREE.Color(c).multiplyScalar(0.4).getHex(), 0.15)); box.position.set(x,0.22*s,z); crook(box,0.06); g.add(box);
  const rib=mesh('box',[0.54*s,0.46*s,0.1*s], mat(0xf0e6c8)); rib.position.set(x,0.23*s,z); g.add(rib);
  const rib2=mesh('box',[0.1*s,0.46*s,0.54*s], mat(0xf0e6c8)); rib2.position.set(x,0.23*s,z); g.add(rib2);
  return g;
}

// =============================== 8b) THE AVALANCHE (owner seed, Sept 4 2026) ===============================
// A GIANT snowball released on a fixed clock (default every 5s) that rolls THROUGH the course — double-jump
// it, or land the TIMELY HIT: a spin/pound SHATTERS it into candy (standing in its path to swing is the
// timing test — mistime it and the ball wins). A stomp doesn't hurt it: you BOUNCE off the top (a moving
// high-road step, DKC energy). It follows the terrain: rolls the flats, tumbles off ledges, and dies at
// endX (or in a pit) as harmless spectacle — touchDamage cuts out 1.5u before its end so a dying ball can
// never knock anyone into the hole it's about to fill. Deterministic: releases ride one fixed clock from
// level start; every run meets every ball at the same step. Hearts-always: contact = 1 heart, never more.
class AvalancheBall extends Enemy {
  constructor(G, x, y, opts={}){
    super(G, x, y, 0);
    this.dir = opts.dir||-1; this.speed = opts.speed||5; this.r = opts.r||1.4;
    this.endX = opts.endX!==undefined?opts.endX:(x + this.dir*60);
    this.cull = false;                     // it rolls the WHOLE course — never despawn off-camera
    this.hitR = this.r*0.9; this.headH = this.r*2; this.hitY = this.r; this.touchR = this.r*0.95;
    this.touchDamage = 1; this.candyDrop = 3;
    this.vy = 0; this.falling = false;
    const snow = emat(0xf0f4ff, 0x8aa4d0, 0.22);
    this.ball = mesh('sph',[this.r,14,12], snow); this.group.add(this.ball);
    for(let i=0;i<7;i++){ const fl=mesh('sph',[rand(0.1,0.18),5,4], mat(0x5a6478)); const a=i/7*TAU; fl.position.set(Math.cos(a)*this.r*0.88, Math.sin(a)*this.r*0.88, this.r*0.3); this.ball.add(fl); }
    this.group.position.y = y + this.r;
    G.scene.add(this.group);
  }
  takeHit(player, kind){
    if(this.dead) return;
    if(kind==='stomp'){                    // the top is a springboard, not a weak point
      AUDIO.stomp && AUDIO.stomp();
      this.ball.scale.y = 0.82;            // a big soft squash; update() eases it back
      return;
    }
    this.die();                            // the TIMELY HIT — spin/pound shatters it (Enemy.die pays the candy)
  }
  update(dt){
    this.t += dt;
    const p = this.group.position;
    this.ball.scale.y = damp(this.ball.scale.y, 1, 8, dt);
    p.x += this.dir*this.speed*dt;
    this.ball.rotation.z += -this.dir*(this.speed/this.r)*dt;
    const gh = this.G.world.groundHeight(p.x, p.z, p.y + 0.5);
    if(this.falling){
      this.vy -= 26*dt; p.y += this.vy*dt;
      if(gh > -Infinity && p.y - this.r <= gh){ p.y = gh + this.r; this.falling=false; this.vy=0;
        this.G.fx.spawn(new THREE.Vector3(p.x, gh+0.15, p.z), 0xf0f4ff, 8, {speed:2.5, life:0.4});
        this.G.camc && this.G.camc.shake(0.12, 0.2); }
      else if(p.y < -4){ this.candyDrop = 0; this.die(); return; }   // swallowed by a pit — quiet spectacle, no loot down a hole
    } else {
      if(gh === -Infinity || (p.y - this.r) - gh > 0.45){ this.falling = true; this.vy = 0; }
      else p.y = gh + this.r;
    }
    // a dying ball is harmless: cut the bite before the end so it can't bump anyone into its own grave
    if(this.dir<0 ? p.x <= this.endX+1.5 : p.x >= this.endX-1.5) this.touchDamage = 0;
    if(this.dir<0 ? p.x <= this.endX : p.x >= this.endX){
      if(this.candyDrop && !this._endBurst){ this._endBurst=true; }
      this.candyDrop = 0; this.die(); return;                        // end of the line — pure snow-burst
    }
    // rolling rumble when near (cosmetic)
    const pl = this.G.player;
    if(pl && Math.abs(pl.pos.x-p.x)<9 && Math.random()<dt*3) this.G.fx.spawn(new THREE.Vector3(p.x-this.dir*this.r, p.y-this.r*0.6, p.z), 0xeef3ff, 1, {speed:1.2, life:0.3});
    this.touchPlayer(dt); this.updateShadow();
  }
}
// AvalancheSpawner(G, {x, y, dir, speed, r, period, firstAt, endX}): the release clock. One fixed timeline
// from level start (firstAt, then every period seconds) — the level's heartbeat. Distant WHUMP on release.
class AvalancheSpawner {
  constructor(G, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.group=new THREE.Group();
    this.x=opts.x||0; this.y=opts.y||0; this.o=opts;
    this.period=opts.period||5; this.nextAt=opts.firstAt!==undefined?opts.firstAt:1.5;
    this.t=0;
  }
  update(dt, G){
    this.t += dt;
    if(this.t >= this.nextAt){
      this.nextAt += this.period;
      G.ents.add(new AvalancheBall(G, this.x, this.y, this.o));
      G.fx.spawn(new THREE.Vector3(this.x, this.y+1.2, 0), 0xf0f4ff, 6, {speed:2, life:0.4});
      AUDIO.noise && AUDIO.noise({t:0.3, vol:0.12, fFrom:220, fTo:60});   // the distant WHUMP — count your five seconds
    }
  }
}

// =============================== 9) LEVEL REGISTRY ===============================
const W6_LEVELS = [];
LEVEL_LISTS.push(W6_LEVELS);   // findLevel / completeLevel / renderMap pick w6 up from here

// =============================== 10) THEMED CLUTTER ===============================
// w6Clutter: baked snowy-ground clutter — snow lumps, ice shards, candy canes, holly, pinecones, tiny snowmen,
// frozen puddles, the odd half-buried gift. Split the span around any pit.
function w6Clutter(G, x1, x2, theme='winter'){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.24){ const lump=mesh('sph',[rand(0.18,0.4),6,5], mat(W6PAL.snow)); lump.scale.y=0.5; lump.position.set(x,0.08,z); g.add(lump); }
    else if(r<0.4){ const shard=mesh('cone',[rand(0.06,0.12),rand(0.2,0.45),5], emat(W6PAL.ice,0x4a9ed0,0.4)); shard.position.set(x,0.12,z); shard.rotation.z=rand(-0.4,0.4); g.add(shard); }
    else if(r<0.53){ const caneA=mesh('cyl',[0.035,0.035,rand(0.3,0.5),5], mat(0xf0f0f0)); caneA.position.set(x,0.2,z); caneA.rotation.z=rand(-0.3,0.3); g.add(caneA);
      const hook=mesh('tor',[0.09,0.035,4,8,Math.PI], mat(0xd83a4a)); hook.position.set(x+0.05,0.44,z); g.add(hook); }
    else if(r<0.66){ const holly=mesh('sph',[0.12,5,4], mat(W6PAL.pine)); holly.scale.y=0.4; holly.position.set(x,0.05,z); g.add(holly);
      for(let hB=0;hB<2;hB++){ const berry=mesh('sph',[0.035,4,4], emat(0xd83a4a,0x8a1e2c,0.5)); berry.position.set(x+rand(-0.08,0.08),0.1,z+rand(-0.08,0.08)); g.add(berry); } }
    else if(r<0.76){ const cone=mesh('sph',[rand(0.07,0.11),5,4], mat(0x46301f)); cone.scale.y=1.4; cone.position.set(x,0.08,z); g.add(cone); }
    else if(r<0.86){ const pud=mesh('cyl',[rand(0.25,0.5),rand(0.25,0.5),0.03,8], emat(W6PAL.ice,0x3a8ec8,0.3)); pud.position.set(x,0.03,z); g.add(pud); }
    else if(r<0.94){ g.add(w6SnowmanDeco(x, z, rand(0.24,0.4), rand(TAU))); }
    else { g.add(w6GiftBox(x, z, rand(0.6,0.9))); }
  }
  G.scene.add(bakeGroup(g));
}

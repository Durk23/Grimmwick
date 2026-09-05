// ============ W10 KIT — THE AURORA PALACE building blocks (Winter District 5 · where the cold sits crowned) ============
// Sorts after the w9 files and before the w10 levels (09zzl...). REUSES 09_levelkit + every winter kit
// (w6Aurora BOOSTED here — this is the aurora's HOME), 00_utils. The First Frost's palace: colonnades of
// ancient ice, rose-windows glowing with sky-fire, a court that kept its manners for ten thousand years of
// being forgotten. Contraptions at the D5-gear bar: geyser pillars, the clockwork Advent Wall, marching toy
// soldiers, the frost organ. Every clock fixed from level start.

const W10PAL = {
  ice:     0xcfe0f4,  iceD:    0x9fb8dc,  wall:    0x6a84b8,   // palace ice
  regalS:  0xc9d4ec,  regalG:  0xd8b84a,                       // court silver / gilt
  velvet:  0x3a2050,  velvetD: 0x281438,                       // the runner carpets
  frost:   0x7ae8ff,
  sky:     0x0c0e24,  fog:     0x1a2044,                       // the crowned night
  aur1:    0x58e0a8,  aur2:    0x7ae8ff,  aur3:    0xb08aff,
};

// =============================== 1) BACKDROP + AMBIENCE ===============================
function w10Parallax(S, x1, x2){
  // NEAR — ice balustrades + fallen regalia silhouettes
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(4,8)){
    const r0=rand();
    if(r0<0.55){ const bal=mesh('cyl',[0.22,0.3,rand(1.2,2),7], mat(0x1a2340)); bal.position.set(x,0.8,-12.5); near.add(bal);
      const railN=mesh('box',[2.2,0.2,0.3], mat(0x141c34)); railN.position.set(x,1.9,-12.5); near.add(railN); }
    else { const drape=mesh('cone',[rand(0.6,1),rand(1.6,2.8),5], mat(0x201538)); drape.position.set(x,1.2,-12.7); near.add(drape); }
  }
  S.add(bakeGroup(near));
  // MID — the great hall: colonnade of ice pillars + ROSE WINDOWS glowing with aurora light
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(9,15)){
    const ph=rand(8,12);
    const pillar=mesh('cyl',[0.9,1.1,ph,9], new THREE.MeshLambertMaterial({color:W10PAL.wall, emissive:0x3a5488, emissiveIntensity:0.15, transparent:true, opacity:0.9}));
    pillar.position.set(x,ph/2,-19.5); mid.add(pillar);
    const capP=mesh('box',[2.4,0.5,1.6], mat(0x2a3a60)); capP.position.set(x,ph,-19.5); mid.add(capP);
    if(rand()<0.55){ const cc=pick([W10PAL.aur1,W10PAL.aur2,W10PAL.aur3]);
      const rose=mesh('cyl',[1.3,1.3,0.2,10], emat(cc, cc, 0.5)); rose.rotation.x=Math.PI/2; rose.position.set(x+rand(-3,3), rand(5,8), -20.5); mid.add(rose);
      const rim=mesh('tor',[1.3,0.12,5,14], mat(0x2a3a60)); rim.position.copy(rose.position); mid.add(rim);
      for(let sp=0;sp<5;sp++){ const a=sp/5*TAU; const spoke=mesh('box',[0.08,1.2,0.06], mat(0x2a3a60)); spoke.position.set(rose.position.x+Math.cos(a)*0.6, rose.position.y+Math.sin(a)*0.6, -20.3); spoke.rotation.z=a; mid.add(spoke); } }
  }
  S.add(bakeGroup(mid));
  // FAR — the palace spires against the crowned night
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(10,18)){
    const sh=rand(10,17);
    const spire=mesh('cyl',[0.8,1.6,sh,6], mat(0x101830)); spire.position.set(x,sh/2,-28); far.add(spire);
    const tip=mesh('cone',[0.9,rand(2.5,4),6], mat(0x141c38)); tip.position.set(x,sh+1.4,-28); far.add(tip);
    const gem=mesh('sph',[0.22,6,5], emat(W10PAL.frost,W10PAL.frost,0.9)); gem.position.set(x,sh+3.2,-27.8); far.add(gem);
  }
  S.add(bakeGroup(far));
  // regal glow motes
  const glow=new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/6);i++){ const cc=pick([W10PAL.regalG, W10PAL.frost, W10PAL.aur3]); const g=mesh('sph',[rand(0.08,0.18),6,5], emat(cc,cc,0.8)); g.position.set(rand(x1,x2), rand(1.5,7), rand(-9,-4)); glow.add(g); }
  S.add(bakeGroup(glow));
}

function w10Ambience(S, x1, x2){
  // leaves channel — drifting frost veils + gilt flecks
  const leaves = [];
  for(let i=0;i<18;i++){ const gilt=i%4===0;
    const lf=new THREE.Mesh(geo('circ',gilt?rand(0.05,0.08):rand(0.08,0.14),5),
      new THREE.MeshBasicMaterial({color:gilt?0xd8b84a:0xdfe8fa, transparent:true, opacity:rand(0.4,0.7), side:THREE.DoubleSide, depthWrite:false}));
    lf.userData={x0:rand(x1,x2), y0:rand(4,10), sp:rand(0.15,0.35), ph:rand(9), sw:rand(0.6,1.4)}; S.add(lf); leaves.push(lf); }
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<40;i++) fp.push(rand(x1,x2), rand(0.4,8), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0x9fe8d0, size:0.1, transparent:true, opacity:0.7}));
  S.add(flies);
  const clouds = [];
  for(let i=0;i<4;i++){ const cl=new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x223052, transparent:true, opacity:0.28})); cl.scale.set(2.2,0.18,0.6); cl.userData={y:rand(0.3,1), sp:rand(0.2,0.4), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.4); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

function w10LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 3, 28);
  G.amb  = w10Ambience(G.scene, x1, x2);
  w6Aurora(G, x1, x2);
  // THE AURORA'S HOME: crank the ribbons well past the outdoor districts (audit fix: set the ticker's
  // per-ribbon BASE term — a raw opacity write was overwritten on the next tick)
  G.scene.traverse(o=>{ if(o.material && o.material.blending===THREE.AdditiveBlending && o.geometry && o.geometry.type==='PlaneGeometry' && o.position.z<-28){ o.userData.base=0.26; } });
  G.scene.background = new THREE.Color(W10PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W10PAL.fog);
  if(clutterTheme) w10Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) FROZEN FOUNTAIN GEYSER (contraption #1 — ride the eruption) ===============================
// A palace fountain erupting on a fixed clock: basin glow + bubbling 0.7s, then the spray FREEZES MID-AIR
// into a standing pillar — its cap is a PLATFORM that rises with the eruption, holds ~2.4s, and shatters.
// Ride the bursts upward. w10Geyser(G, {x, period, phase, height, holdT}).
class W10Geyser {
  constructor(G, x, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false;
    this.x=x; this.period=opts.period||5.2; this.t=opts.phase||0;
    this.h=opts.height||3.6; this.holdT=opts.holdT||2.4; this.baseY=opts.baseY||0;
    this.state='idle';
    // the basin (baked-ish but small)
    const basin=mesh('cyl',[1.1,1.3,0.5,10], mat(W10PAL.iceD)); basin.position.set(x,this.baseY+0.25,0); G.scene.add(basin);
    this.glowB=mesh('cyl',[0.8,0.8,0.1,10], emat(0x2a6a9a,0x3a8ec8,0.4)); this.glowB.position.set(x,this.baseY+0.52,0); G.scene.add(this.glowB);
    // the pillar (scales up on eruption)
    this.pillar=new THREE.Mesh(geo('cyl',0.55,0.7,1,9), new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.35, transparent:true, opacity:0.7}));
    this.pillar.visible=false; G.scene.add(this.pillar);
    this.cap=new THREE.Mesh(geo('cyl',0.85,0.8,0.26,9), new THREE.MeshLambertMaterial({color:0xeef6ff, emissive:0x7ab0e0, emissiveIntensity:0.3}));
    this.cap.visible=false; G.scene.add(this.cap);
    this.col=G.world.addBox(x, this.baseY, 0, 1.6, 0.26, 1.6, {type:'ghost'});
    this.group=new THREE.Group();
  }
  update(dt, G){
    this.t+=dt;
    const cyc=this.t % this.period;
    const teleAt=this.period-0.7-this.holdT-0.5;   // timeline: idle → 0.7 tele → 0.5 rise → hold → shatter at period end
    if(cyc < teleAt){
      this.state='idle';
      this.pillar.visible=this.cap.visible=false; this.col.type='ghost';
      this.glowB.material.emissiveIntensity=0.3+Math.sin(this.t*2)*0.1;
    } else if(cyc < teleAt+0.7){
      this.state='tele';
      const k=(cyc-teleAt)/0.7;
      this.glowB.material.emissiveIntensity=0.4+k*0.8+Math.sin(this.t*24)*0.3*k;
      if(Math.random()<dt*12) G.fx.spawn(new THREE.Vector3(this.x+rand(-0.5,0.5), this.baseY+0.6, 0), 0xbfe8ff, 1, {speed:1, life:0.4});
    } else if(cyc < teleAt+0.7+0.5){
      if(this.state!=='rise'){ this.state='rise';
        AUDIO.noise && AUDIO.noise({t:0.4,vol:0.15,fFrom:300,fTo:1400});
        G.fx.spawn(new THREE.Vector3(this.x, this.baseY+0.8, 0), 0xcfe4f4, 10, {speed:3, life:0.5}); }
      const k=(cyc-teleAt-0.7)/0.5;
      const hh=this.h*k;
      this.pillar.visible=this.cap.visible=true;
      this.pillar.scale.y=Math.max(0.05,hh); this.pillar.position.set(this.x, this.baseY+hh/2, 0);
      this.cap.position.set(this.x, this.baseY+hh+0.13, 0);
      this.col.type='solid';
      this.col.min.set(this.x-0.8, this.baseY+hh, -0.8); this.col.max.set(this.x+0.8, this.baseY+hh+0.26, 0.8);
      // carry a rider up (the col teleports upward between frames; give standing players the lift by hand)
      const pl=G.player;
      if(pl && pl.grounded && pl.groundCol===this.col){ pl.pos.y=this.baseY+hh+0.26; }
    } else if(cyc < this.period-0.05){
      this.state='hold';
      this.pillar.scale.y=this.h; this.pillar.position.set(this.x, this.baseY+this.h/2, 0);
      this.cap.position.set(this.x, this.baseY+this.h+0.13, 0);
      // crack warning in the last 0.6s of the hold
      if(this.period-cyc < 0.65){ this.cap.material.emissiveIntensity=0.3+Math.sin(this.t*30)*0.4;
        this.pillar.position.x=this.x+Math.sin(this.t*40)*0.015; }
      else this.cap.material.emissiveIntensity=0.3;
    } else {
      if(this.state!=='gone'){ this.state='gone';
        AUDIO.noise && AUDIO.noise({t:0.25,vol:0.14,fFrom:2200,fTo:400});
        G.fx.spawn(new THREE.Vector3(this.x, this.baseY+this.h, 0), 0xcfe4f4, 14, {speed:3.5, life:0.5});
        this.pillar.visible=this.cap.visible=false; this.col.type='ghost'; }
    }
  }
}
function w10Geyser(G, x, opts={}){ const g=new W10Geyser(G, x, opts); G.ents.add(g); return g; }

// =============================== 3) THE CLOCKWORK ADVENT WALL (contraption #2 — doors on a schedule) ===============================
// A great wall pierced by numbered doors that slide open/shut on one shared clock — open doors are the way
// through (and sometimes hide an alcove treat). w10AdventWall(G, {x, w, h, doors:[{dx,dy,slot}], period, openT}).
// Each door is solid while shut, ghost while open; the door's number glows during its slot's last 0.7s (the
// "about to shut" warning). Route segments thread the wall through whichever doors their slots allow.
function w10AdventWall(G, opts={}){
  const x=opts.x||0, w=opts.w||3, h=opts.h||7, period=opts.period||8, openT=opts.openT||2.2;
  const doors=opts.doors||[{dx:0, dy:0, slot:0}];
  // the wall itself (solid around the doorways — built as segments the caller sizes via doors)
  const wallM=new THREE.MeshLambertMaterial({color:W10PAL.wall, emissive:0x2a3a60, emissiveIntensity:0.15, transparent:true, opacity:0.94});
  const wallMesh=new THREE.Mesh(geo('box',w,h,3), wallM); wallMesh.position.set(x,h/2,0); G.scene.add(wallMesh);
  G.world.addBox(x, 0, 0, w, h, 3, {});
  const made=[];
  for(const d of doors){
    const dx=x+(d.dx||0), dy=d.dy||0;
    // the doorway: a ghost tunnel through the wall + a sliding door plug
    const hole=G.world.addBox(dx, dy, 0, 1.7, 2.3, 3.2, {type:'ghost'});
    const doorM=new THREE.MeshLambertMaterial({color:W10PAL.regalS, emissive:0x6a84b8, emissiveIntensity:0.25});
    const doorMesh=new THREE.Mesh(geo('box',1.6,2.2,0.5), doorM); doorMesh.position.set(dx, dy+1.1, 1.55); G.scene.add(doorMesh);
    const frame=mesh('box',[1.9,0.2,0.6], mat(W10PAL.regalG)); frame.position.set(dx, dy+2.35, 1.55); G.scene.add(frame);
    const num=mesh('sph',[0.12,6,5], emat(W10PAL.regalG,W10PAL.regalG,0.8)); num.position.set(dx, dy+1.9, 1.85); G.scene.add(num);
    const plug=G.world.addBox(dx, dy, 0.9, 1.7, 2.3, 1.4, {});   // the door's solid body (front face of the wall)
    made.push({d, dx, dy, doorMesh, num, plug});
  }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:opts.phase||0, group:new THREE.Group(),
    update(dt, GG){
      this.t+=dt;
      const cyc=this.t % period;
      for(const m of made){
        const s0=(m.d.slot||0)*openT % period;
        const open = cyc>=s0 && cyc<s0+openT;
        const closing = open && (s0+openT-cyc)<0.7;
        m.doorMesh.position.y = damp(m.doorMesh.position.y, open ? m.dy+3.1 : m.dy+1.1, 8, dt);
        m.plug.type = open ? 'ghost' : 'solid';
        m.num.material.emissiveIntensity = closing ? 0.8+Math.sin(this.t*26)*0.5 : 0.8;
        if(closing && Math.random()<dt*6) GG.fx.spawn(new THREE.Vector3(m.dx, m.dy+2.2, 1.8), W10PAL.regalG, 1, {speed:0.8, life:0.3});
      }
    } });
  return made;
}

// =============================== 4) TOY SOLDIER (contraption #3 — march on the hat) ===============================
// A palace nutcracker marching a fixed route, about-facing at each end — his flat hat is your platform.
// w10Soldier(G, {x0, x1, y, speed, phase}). D5-gear craft: jaw, plume, epaulettes, working legs.
function w10Soldier(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||10, y=opts.y!==undefined?opts.y:0, speed=opts.speed||1.8, phase=opts.phase||0;
  const span=Math.abs(x1-x0), P=span/speed;
  const soldier = G.world.addMover(1.3, 0.22, 1.3, (t)=>{
    const tt=(t+phase)%(P*2);
    const k=tt<P ? tt/P : 2-tt/P;
    return new THREE.Vector3(lerp(x0,x1,k), y+3.28, 0);
  }, ()=>{
    const g=new THREE.Group();
    const hat=mesh('cyl',[0.62,0.66,0.5,10], mat(0x1a1a2e)); hat.position.y=-0.14; g.add(hat);
    const brim=mesh('cyl',[0.72,0.72,0.08,10], mat(W10PAL.regalG)); brim.position.y=-0.42; g.add(brim);
    const plume=mesh('sph',[0.14,6,5], emat(0xd83a4a,0x8a1e2c,0.4)); plume.position.set(0.3,0.14,0); g.add(plume);
    const head=mesh('box',[0.6,0.66,0.55], emat(0xe8cfa8,0x9a8468,0.15)); head.position.y=-0.8; g.add(head);
    const jaw=mesh('box',[0.6,0.24,0.5], mat(0xd8bf98)); jaw.position.set(0,-1.16,0.04); g.add(jaw);
    for(const s of [-1,1]){ const eye=mesh('sph',[0.06,5,4], mat(0x1a1a2e)); eye.position.set(s*0.14,-0.72,0.29); g.add(eye); }
    const stash=mesh('box',[0.34,0.08,0.05], mat(0x1a1a2e)); stash.position.set(0,-0.98,0.29); g.add(stash);
    const torso=mesh('box',[0.8,1.1,0.6], emat(0xd83a4a,0x7a1020,0.25)); torso.position.y=-1.85; g.add(torso);
    for(const s of [-1,1]){ const ep=mesh('box',[0.24,0.1,0.62], mat(W10PAL.regalG)); ep.position.set(s*0.5,-1.36,0); g.add(ep); }
    for(let b=0;b<3;b++){ const btn=mesh('sph',[0.05,5,4], mat(W10PAL.regalG)); btn.position.set(0,-1.55-b*0.26,0.32); g.add(btn); }
    const legL=mesh('box',[0.26,0.9,0.3], mat(0x2a3450)); legL.position.set(-0.2,-2.85,0); g.add(legL);
    const legR=legL.clone(); legR.position.x=0.2; g.add(legR);
    g.userData.legs=[legL,legR];
    return g;
  });
  G.scene.add(soldier.mesh);
  // the march: legs swing, body faces travel, about-face at ends
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(), _lx:null,
    update(dt){
      this.t+=dt;
      const m=soldier.mesh; if(!m) return;
      const cx=(soldier.col.min.x+soldier.col.max.x)/2;
      const dir=this._lx===null?1:Math.sign(cx-this._lx)||1; this._lx=cx;
      m.rotation.y = damp(m.rotation.y, dir>0?Math.PI/2:-Math.PI/2, 8, dt);
      if(m.userData.legs) m.userData.legs.forEach((l,i)=>{ l.rotation.x=Math.sin(this.t*6+i*Math.PI)*0.5; });
    } });
  return soldier;
}

// =============================== 5) THE FROST ORGAN (contraption #4 — launch on the chord) ===============================
// A rank of great organ pipes: each pipe INHALES (glow + particle draw, its beat's telegraph) then FIRES a
// chord-note air blast — stand on the pipe mouth and the blast launches you (vy ~13, bounce-grade). The rank
// fires its pipes on a fixed sequence: the chord progression is the platforming. w10Organ(G, {x, pipes, period, phase, vy}).
function w10Organ(G, opts={}){
  const x=opts.x||0, n=opts.pipes||4, period=opts.period||4.8, phase=opts.phase||0, vy=opts.vy||13;
  const NOTES=[262, 330, 392, 523, 659];
  const mouths=[];
  const deco=new THREE.Group();
  for(let i=0;i<n;i++){
    const px=x+i*1.7;
    const ph=2.2+((i*2)%3)*0.8;
    const pipe=mesh('cyl',[0.55,0.6,ph,10], emat(W10PAL.regalS,0x6a84b8,0.3)); pipe.position.set(px,ph/2,0); deco.add(pipe);
    const collar=mesh('cyl',[0.66,0.66,0.18,10], mat(W10PAL.regalG)); collar.position.set(px,ph-0.3,0); deco.add(collar);
    G.world.addBox(px, 0, 0, 1.2, ph, 1.2, {});
    const mouthGlow=new THREE.Mesh(geo('cyl',0.45,0.45,0.08,10), new THREE.MeshBasicMaterial({color:W10PAL.frost, transparent:true, opacity:0.25, depthWrite:false}));
    mouthGlow.position.set(px, ph+0.06, 0); G.scene.add(mouthGlow);
    mouths.push({px, top:ph, glow:mouthGlow, slot:i});
  }
  G.scene.add(bakeGroup(deco));
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(), _fired:{},
    update(dt, GG){
      this.t+=dt;
      const cyc=this.t % period;
      const slotT=period/n;
      for(const m of mouths){
        const s0=m.slot*slotT;
        const inhale = cyc>=s0 && cyc<s0+0.7;
        const fireAt = s0+0.7;
        m.glow.material.opacity = inhale ? 0.3+Math.sin(this.t*22)*0.25 : 0.18;
        if(inhale && Math.random()<dt*10) GG.fx.spawn(new THREE.Vector3(m.px+rand(-0.5,0.5), m.top+rand(0.4,1.2), 0), 0xbfe8ff, 1, {speed:-0.5, life:0.35, gravity:-3});
        const key='p'+m.slot+'_'+Math.floor(this.t/period);
        if(cyc>=fireAt && cyc<fireAt+0.2 && !this._fired[key]){
          this._fired[key]=true;
          const pl=GG.player;
          if(pl && Math.abs(pl.pos.x-m.px)<20) AUDIO.tone && AUDIO.tone({f:NOTES[m.slot%NOTES.length], type:'triangle', t:0.7, vol:0.13});
          GG.fx.spawn(new THREE.Vector3(m.px, m.top+0.3, 0), 0xcfe4f4, 8, {speed:3, life:0.5, gravity:-2});
          if(pl && !pl.dead && pl.grounded && Math.abs(pl.pos.x-m.px)<0.75 && Math.abs(pl.pos.z)<0.9 && Math.abs(pl.pos.y-m.top)<0.5){
            pl.vel.y = vy; pl.grounded=false;
            pl._springAir = true;   // audit fix: bypass the variable-jump release-cut (it clamped launches to 6.5 next frame — apex +0.82u instead of +3.5u); the flag clears itself on landing
            AUDIO.bounce && AUDIO.bounce();
          }
          // GC the fired ledger each full period
          if(Object.keys(this._fired).length>n*3) this._fired={};
        }
      }
    } });
  return mouths;
}

// =============================== 6) THE FROST-LOCKED CHEST — w10's gamble container ===============================
// A royal treasury chest sealed inside a block of ancient clear ice, the gamble's red pulse beating within.
// Same table, CLEAR-PATCH, 1s grace. Ambush: FOUR FLURRY spirits spin out of the shattering ice.
class FrostChest {
  constructor(x, y, z, ry=0){
    this.group=new THREE.Group();
    const chest=new THREE.Group();
    const body=mesh('box',[1.3,0.8,0.9], mat(0x5a3a20)); body.position.y=0.55; chest.add(body);
    const lid=mesh('cyl',[0.46,0.46,1.3,10,1,false,Math.PI,Math.PI], mat(0x6a4628)); lid.rotation.z=Math.PI/2; lid.position.y=0.98; chest.add(lid);
    for(const bx of [-0.45,0.45]){ const band=mesh('box',[0.14,0.85,0.94], mat(W10PAL.regalG)); band.position.set(bx,0.55,0); chest.add(band); }
    const lock=mesh('box',[0.24,0.3,0.12], mat(W10PAL.regalG)); lock.position.set(0,0.62,0.5); chest.add(lock);
    this.group.add(chest);
    this.iceM=new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.25, transparent:true, opacity:0.55});
    const block=new THREE.Mesh(geo('box',1.9,1.7,1.4), this.iceM); block.position.y=0.85; this.group.add(block);
    this.pulse=mesh('sph',[0.3,7,6], new THREE.MeshBasicMaterial({color:0xff4a5a, transparent:true, opacity:0.5, depthWrite:false})); this.pulse.position.y=0.8; this.group.add(this.pulse);
    this.glow=new THREE.PointLight(0xff7a8a, 12, 7); this.glow.position.set(0,1.3,0.6); this.group.add(this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='👑 Crack the frost-locked chest...?';
  }
  update(dt, G){
    this.t+=dt;
    if(!this.opened){
      this.pulse.material.opacity=0.3+Math.abs(Math.sin(this.t*2.6))*0.35;
      this.glow.intensity=9+Math.sin(this.t*2.2)*5;
      this.iceM.emissiveIntensity=0.2+Math.sin(this.t*1.8)*0.08;
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.pulse.material.opacity=damp(this.pulse.material.opacity,0,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened=true;
    const p=this.group.position;
    AUDIO.noise && AUDIO.noise({t:0.35,vol:0.16,fFrom:2200,fTo:300});
    G.camc.shake(0.2,0.4);
    const scene=G.scene;
    setTimeout(()=>{
      if(G.scene!==scene) return;
      const r=Math.random();
      if(r<0.08){
        G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('👑👻 A GHOSTLY 1-UP, kept on ice! Lives: '+G.save.lives);
      } else if(r<0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1,p.y+1.0,0)); G.ents.add(new PowerUp(p.x+1.2,p.y+1.2,0, pick(['shield','moon','bat'])));
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('👑✨ JACKPOT! The crown treasury — candy, a heart, AND a treasure!');
      } else if(r<0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('👑 A few candies... and a very formal thank-you note, unsigned.');
      } else {
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.35,0.4);
        const offs=[-2.6,-1.4,1.4,2.6];
        for(let i=0;i<offs.length;i++){
          // west lanes never run past x5.5 (audit fix: a chest near the start looped its ambush lanes over CP0's respawn forever)
          const f=new FlurryTriplet(G, p.x+offs[i], p.y, 0, {x1: offs[i]>0 ? p.x+offs[i]+10 : Math.max(p.x+offs[i]-10, 5.5), phase:i*0.35, speed:4.2});
          f.spawnGrace=1.0; G.ents.add(f);
        }
        G.fx.spawn(new THREE.Vector3(p.x,p.y+0.9,p.z), W10PAL.frost, 22, {speed:4.5});
        window.UI && UI.toast('👑❄️ FLURRIES!! The ice was the treasure\'s bodyguard!!');
      }
    }, 650);
  }
}

// =============================== 7) THE THRONE'S SHADOW — w10's Old Shortcut warp ===============================
// Beside the great throne stands a small, unadorned second seat — the guest chair that never once held a
// guest, under a lone PURPLE lantern. SIT IN IT (interact) and stay seated THREE full seconds — in a game
// that punishes standing still, the stillness IS the skill gate: find your safe window, then keep the
// appointment nobody ever kept. The palace opens the court passage. Once per run, full candy bonus.
class ThroneShadow {
  constructor(G, x, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this.x=x; this.warpX=opts.warpX!==undefined?opts.warpX:x+8; this.candy=opts.candy||40; this.used=false;
    this.sitT=0; this.sitting=false;
    this.group=new THREE.Group();
    // the great throne (context) + the small bare guest seat (the point)
    const great=new THREE.Group();
    const gseat=mesh('box',[1.6,0.5,1.2], mat(W10PAL.iceD)); gseat.position.set(x-2.2,0.7,-0.8); great.add(gseat);
    const gback=mesh('box',[1.6,2.6,0.4], mat(W10PAL.iceD)); gback.position.set(x-2.2,2.1,-1.3); great.add(gback);
    const gcrown=mesh('cone',[0.4,0.9,6], emat(W10PAL.frost,W10PAL.frost,0.6)); gcrown.position.set(x-2.2,3.8,-1.3); great.add(gcrown);
    for(const s of [-1,1]){ const armr=mesh('box',[0.24,0.8,1.1], mat(W10PAL.wall)); armr.position.set(x-2.2+s*0.8,1.1,-0.75); great.add(armr); }
    this.group.add(great);
    const seat=mesh('box',[0.9,0.4,0.8], mat(0x8a94ac)); seat.position.set(x,0.5,-0.5); this.group.add(seat);
    const back=mesh('box',[0.9,1.1,0.18], mat(0x8a94ac)); back.position.set(x,1.25,-0.85); this.group.add(back);
    // it is dusted but not dirty: someone kept it ready
    const dust=mesh('box',[0.86,0.04,0.76], mat(W10PAL.regalS)); dust.position.set(x,0.72,-0.5); this.group.add(dust);
    this.tell=mesh('sph',[0.18,8,7], emat(0x9a5fd0,0x9a5fd0,1)); this.tell.position.set(x,3.0,0); this.group.add(this.tell);
    this.ring=new THREE.Mesh(geo('tor',0.8,0.05,5,18), new THREE.MeshBasicMaterial({color:0x9a5fd0, transparent:true, opacity:0, depthWrite:false}));
    this.ring.rotation.x=-Math.PI/2; this.ring.position.set(x,0.15,-0.3); this.group.add(this.ring);
    this.promptLabel='🪑 Take the seat that waited...?';
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    this.tell.scale.setScalar(1+Math.sin(this.t*3)*0.25);
    if(this.used) return;
    const pl=G.player;
    if(!pl || pl.dead){ this.sitting=false; this.sitT=0; this.ring.material.opacity=0; return; }
    const near = Math.abs(pl.pos.x-this.x)<1.2 && Math.abs(pl.pos.z)<1.6;
    if(this.sitting){
      // seated: locked in place; any damage or input breaks it (Player.damage sets iframes — detect via hearts drop)
      this.sitT += dt;
      this.ring.material.opacity = 0.25+0.5*(this.sitT/3);
      this.ring.scale.setScalar(1+Math.sin(this.t*4)*0.06);
      pl.pos.x=this.x; pl.pos.z=-0.1; pl.vel.set(0,0,0);
      if(this._hearts!==pl.hearts || Math.abs(INPUT.moveX)>0.3 || INPUT.jumpEdge){
        this.sitting=false; this.sitT=0; this.ring.material.opacity=0;
        window.UI && UI.toast('🪑 The appointment breaks. Find a quieter moment.');
      }
      if(this.sitT>=3) this._open(G);
    } else {
      this.ring.material.opacity=damp(this.ring.material.opacity,0,4,dt);
      if(near && INPUT.interactEdge){
        this.sitting=true; this.sitT=0; this._hearts=pl.hearts;
        AUDIO.ui && AUDIO.ui();
        window.UI && UI.toast('🪑 You sit. The palace holds its breath. (Stay seated...)');
      }
    }
  }
  _open(G){
    this.used=true;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin(); G.camc.shake(0.3,0.5);
    G.fx.spawn(new THREE.Vector3(this.x,1.5,0), 0x9a5fd0, 30, {speed:6, life:1});
    window.UI && UI.toast('🪑✨ THE GUEST ARRIVED. Ten thousand years late is still ARRIVED — the court passage opens!');
    G.addCandy(this.candy);
    G.persist && G.persist();
    G._warpUsed = true;
    const pl=G.player; pl.pos.set(this.warpX, 2, 0); pl.vel.set(0,0,0);
    window.UI && UI.updateHUD();
  }
}

// =============================== 8) LEVEL REGISTRY + CLUTTER ===============================
const W10_LEVELS = [];
LEVEL_LISTS.push(W10_LEVELS);

function w10Clutter(G, x1, x2, theme='palace'){
  const g=new THREE.Group();
  const n=Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.18){ const crown=mesh('tor',[0.16,0.04,4,10], mat(W10PAL.regalG)); crown.rotation.x=Math.PI/2; crown.position.set(x,0.05,z); g.add(crown);
      for(let pt=0;pt<3;pt++){ const a=pt/3*TAU; const tip=mesh('cone',[0.03,0.1,4], mat(W10PAL.regalG)); tip.position.set(x+Math.cos(a)*0.15,0.12,z+Math.sin(a)*0.15); g.add(tip); } }   // a fallen crown, one of many
    else if(r<0.34){ const shard=mesh('cone',[rand(0.07,0.14),rand(0.25,0.55),5], new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.4, transparent:true, opacity:0.85})); shard.position.set(x,0.14,z); shard.rotation.z=rand(-0.4,0.4); g.add(shard); }
    else if(r<0.5){ const cand=mesh('cyl',[0.05,0.06,rand(0.2,0.4),6], mat(W10PAL.regalS)); cand.position.set(x,0.15,z); g.add(cand);
      const fl=mesh('sph',[0.05,5,4], emat(0x7ae8ff,0x7ae8ff,0.9)); fl.position.set(x,0.36,z); g.add(fl); }   // candles burning COLD
    else if(r<0.64){ const rose=mesh('sph',[0.09,6,5], emat(0xdfe8fa,0x9fb8dc,0.4)); rose.position.set(x,0.08,z); g.add(rose);
      const stem2=mesh('cyl',[0.015,0.02,0.2,4], mat(0x4a5a7a)); stem2.position.set(x,0.02,z); stem2.rotation.z=rand(-0.6,0.6); g.add(stem2); }   // frost roses
    else if(r<0.78){ const banner=mesh('box',[0.3,rand(0.4,0.7),0.03], mat(W10PAL.velvet)); banner.position.set(x,0.25,z); banner.rotation.set(rand(-1.2,-0.6),rand(TAU),0); g.add(banner); }
    else if(r<0.9){ const goblet=mesh('cyl',[0.08,0.04,0.16,7], mat(W10PAL.regalG)); goblet.position.set(x,0.08,z); goblet.rotation.z=rand()<0.5?1.4:0; g.add(goblet); }
    else { const lump=mesh('sph',[rand(0.2,0.4),6,5], mat(0xdfe8fa)); lump.scale.y=0.4; lump.position.set(x,0.06,z); g.add(lump); }
  }
  G.scene.add(bakeGroup(g));
}

// ============ W9 KIT — EVERGREEN DEEP building blocks (Winter District 4 · the whispering pines) ============
// Sorts after the w8 files and before the w9 levels (09zzf...). REUSES 09_levelkit + the winter kits
// (w6Pine/w6SnowmanDeco/w6GiftBox/w6LightsBegin family, SpikeIcicle, AvalancheBall/Spawner, PendulumBlade
// idioms) and 00_utils. The forest strung for a festival that went quiet mid-song: garlands between the
// great pines, ornaments the size of doors, moonbeams through the canopy — and THE GIANT MUSIC BOX, the
// district's jewel: platforming synced to its own tune. Contraptions at the D5-gear bar; clocks all fixed.

const W9PAL = {
  pine:    0x1a3c2c,  pineD:   0x102418,  pineL:   0x2a5c40,   // the deep evergreens
  bark:    0x3c2f22,  barkD:   0x281e14,
  ornR:    0xd83a4a,  ornG:    0xffd23f,  ornE:    0x3aa060,   // ornament red / gilt / green
  brass:   0x9a8a4a,  brassD:  0x5a4f20,
  snow:    0xdfe8f8,
  sky:     0x0a1420,  fog:     0x152838,                       // the under-canopy dark
  beam:    0xcfe0f4,                                           // moonbeam silver
};

// =============================== 1) BACKDROP + AMBIENCE ===============================
function w9Parallax(S, x1, x2){
  // NEAR — snowy underbrush, stumps, the odd leaning sled
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(4,8)){
    const r0=rand();
    if(r0<0.5){ const bush=mesh('sph',[rand(0.8,1.6),7,6], mat(0x122030)); bush.scale.y=0.6; bush.position.set(x,rand(-0.3,0.3),-12.5); near.add(bush); }
    else if(r0<0.8){ const stump=mesh('cyl',[rand(0.4,0.7),rand(0.5,0.8),rand(0.8,1.4),8], mat(0x1c1620)); stump.position.set(x,0.5,-12.7); near.add(stump); }
    else { const cap=mesh('cone',[rand(0.9,1.4),rand(2,3.4),6], mat(0x14222e)); cap.position.set(x,1.4,-12.6); near.add(cap); }
  }
  S.add(bakeGroup(near));
  // MID — THE GREAT PINES: towering decorated trees, garlands sagging between them, a lit woodcutter camp
  const mid = new THREE.Group();
  let lastX=null;
  for(let x=x1-16; x<x2+16; x+=rand(8,14)){
    const th=rand(8,13);
    const trunk=mesh('cyl',[0.5,0.8,th*0.4,7], mat(0x1a141e)); trunk.position.set(x,th*0.2,-19.5); mid.add(trunk);
    for(let tier=0;tier<4;tier++){ const tr=mesh('cone',[3.2-tier*0.6, th*0.28, 7], mat(tier%2?0x122a20:0x0e2018)); tr.position.set(x, th*0.3+tier*th*0.18, -19.5); mid.add(tr); }
    const cap=mesh('cone',[1.0,th*0.12,7], mat(0x24384a)); cap.position.set(x,th*0.95,-19.4); mid.add(cap);
    // ornaments on the boughs — big warm dots
    for(let o=0;o<4;o++){ const cc=pick([W9PAL.ornR,W9PAL.ornG,W9PAL.ornE,0x7ae8ff]); const orn=mesh('sph',[rand(0.18,0.32),6,5], emat(cc,cc,0.7)); orn.position.set(x+rand(-2.2,2.2), rand(th*0.3,th*0.8), -18.8); mid.add(orn); }
    // a sagging garland to the previous pine
    if(lastX!==null){ const midX=(lastX+x)/2, sag=1.1;
      for(let gsi=0;gsi<7;gsi++){ const t2=gsi/6; const gx=lerp(lastX,x,t2), gy=6.5-Math.sin(t2*Math.PI)*sag;
        const seg=mesh('sph',[0.1,4,4], mat(0x1e3a2a)); seg.position.set(gx,gy,-19); mid.add(seg);
        if(gsi%2===0){ const cc=pick([W9PAL.ornR,W9PAL.ornG]); const bulb=mesh('sph',[0.09,4,4], emat(cc,cc,0.8)); bulb.position.set(gx,gy-0.18,-18.9); mid.add(bulb); } } }
    lastX=x;
  }
  S.add(bakeGroup(mid));
  // FAR — the pine wall, near-black
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(5,9)){ const p=mesh('cone',[rand(2.5,4),rand(8,14),5], mat(0x0c1622)); p.position.set(x,rand(1,3),-28); far.add(p); }
  S.add(bakeGroup(far));
  // MOONBEAMS through the canopy — tall silver shafts (additive, still; the forest's cathedral light)
  for(let i=0;i<Math.floor((x2-x1)/24)+2;i++){
    const bx=x1+((i*37)%Math.max(1,Math.floor(x2-x1)));
    const beam=new THREE.Mesh(new THREE.PlaneGeometry(rand(1.6,3), 18),
      new THREE.MeshBasicMaterial({color:W9PAL.beam, transparent:true, opacity:0.09, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));   // 0.05 was invisible in renders (3 verifiers) — the cathedral light should LAND
    beam.position.set(bx, 9, -10); beam.rotation.z=rand(-0.12,0.06);
    S.add(beam);
  }
}

function w9Ambience(S, x1, x2){
  // leaves channel — pine needles + snow sifting through the canopy
  const leaves = [];
  for(let i=0;i<20;i++){
    const isNeedle = i%3!==0;
    const lf=new THREE.Mesh(isNeedle ? new THREE.PlaneGeometry(0.04,0.22) : geo('circ',rand(0.06,0.1),5),
      new THREE.MeshBasicMaterial({color:isNeedle?0x2a5c40:0xffffff, transparent:true, opacity:rand(0.5,0.8), side:THREE.DoubleSide, depthWrite:false}));
    lf.userData={x0:rand(x1,x2), y0:rand(4,10), sp:rand(0.2,0.5), ph:rand(9), sw:rand(0.8,1.6)}; S.add(lf); leaves.push(lf);
  }
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<36;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0xffd98a, size:0.1, transparent:true, opacity:0.7}));
  S.add(flies);
  const clouds = [];
  for(let i=0;i<4;i++){ const cl=new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x1a3040, transparent:true, opacity:0.3})); cl.scale.set(2.2,0.18,0.6); cl.userData={y:rand(0.2,0.8), sp:rand(0.2,0.4), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.4); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

function w9LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 4, 30);
  G.amb  = w9Ambience(G.scene, x1, x2);
  G.scene.background = new THREE.Color(W9PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W9PAL.fog);
  if(clutterTheme) w9Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) THE GIANT MUSIC BOX (the district's jewel) ===============================
// A great brass cylinder studded with PIN PLATFORMS, turning on a fixed clock — ride the pins around, and
// every time a pin passes the comb the box PLAYS ITS NOTE (pentatonic, by pin index): the platforming IS
// the tune. w9MusicBox(G, {x, y, r, speed, pins}) — pins are level movers on the cylinder's circle.
function w9MusicBox(G, opts={}){
  const x=opts.x||0, cy=opts.y!==undefined?opts.y:4.0, r=opts.r||3.0, speed=opts.speed||0.55, nPins=opts.pins||5;
  const NOTES=[523, 587, 659, 784, 880, 1046];   // the box's pentatonic voice
  // the cylinder (spins), the case (baked), the comb (baked, at 9 o'clock where the notes strike)
  const cyl=new THREE.Group();
  const drum=mesh('cyl',[r*0.82, r*0.82, 2.0, 18], emat(W9PAL.brass, W9PAL.brassD, 0.3)); drum.rotation.x=Math.PI/2; cyl.add(drum);
  for(let i=0;i<14;i++){ const a=(i/14)*TAU; const stud=mesh('sph',[0.09,5,4], mat(W9PAL.brassD)); stud.position.set(Math.cos(a)*r*0.82, Math.sin(a)*r*0.82, rand(-0.7,0.7)); cyl.add(stud); }
  cyl.position.set(x,cy,0); G.scene.add(cyl);
  const kase=new THREE.Group();
  const base=mesh('box',[r*2.6, 0.6, 3.2], mat(W9PAL.bark)); base.position.set(x, cy-r-0.5, 0); kase.add(base);
  for(const s of [-1,1]){ const wallP=mesh('box',[0.5, r*1.4, 2.6], mat(W9PAL.barkD)); wallP.position.set(x+s*(r+0.9), cy-r*0.3, 0); kase.add(wallP); }
  const comb=new THREE.Group();
  for(let i=0;i<6;i++){ const tooth=mesh('box',[0.7-i*0.06,0.08,0.16], mat(0xc9a24a)); tooth.position.set(x-r-0.55, cy-0.5+i*0.22, -0.5+i*0.2); comb.add(tooth); }
  kase.add(comb);
  const crank=mesh('tor',[0.4,0.06,5,12], mat(W9PAL.brassD)); crank.position.set(x+r+1.2, cy, 0); G.scene.add(crank);
  G.scene.add(bakeGroup(kase));
  // the pins — level platforms riding the drum's circle (ferris math: they stay upright)
  const movers=[];
  for(let i=0;i<nPins;i++){
    movers.push(G.world.addMover(1.5, 0.22, 1.6, (t)=>{
      const a=t*speed + i/nPins*TAU;
      return new THREE.Vector3(x+Math.cos(a)*r, cy+Math.sin(a)*r-0.11, 0);
    }, ()=>{ const g=new THREE.Group();
      const pin=mesh('cyl',[0.18,0.22,0.5,8], mat(W9PAL.brassD)); pin.rotation.z=Math.PI/2; pin.position.y=-0.1; g.add(pin);
      const plat=mesh('box',[1.45,0.18,1.5], emat(W9PAL.brass,W9PAL.brassD,0.25)); plat.position.y=0.1; g.add(plat);
      const snowCap=mesh('box',[1.3,0.07,1.35], mat(W9PAL.snow)); snowCap.position.y=0.23; g.add(snowCap);
      return g; }));
  }
  for(const m of movers) G.scene.add(m.mesh);
  // the voice: one ticker spins the drum + fires each pin's note as it crosses the comb (9 o'clock)
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(), _last:new Array(nPins).fill(0),
    update(dt, GG){
      this.t+=dt;
      cyl.rotation.z += speed*dt;
      crank.rotation.z -= speed*2.2*dt;
      for(let i=0;i<nPins;i++){
        const a=(this.t*speed + i/nPins*TAU) % TAU;
        const prev=this._last[i]; this._last[i]=a;
        // crossing π (9 o'clock, the comb's station) — the note strikes
        if(prev<Math.PI && a>=Math.PI){
          const pl=GG.player;
          if(pl && Math.abs(pl.pos.x-x)<26) AUDIO.tone && AUDIO.tone({f:NOTES[i%NOTES.length], type:'sine', t:0.5, vol:0.11});
          GG.fx.spawn(new THREE.Vector3(x-r, cy, 0.3), 0xffd98a, 3, {speed:1.2, life:0.5});
        }
      }
    } });
  return movers;
}

// =============================== 3) ORNAMENT WRECKING-BAUBLE (pendulum hazard) ===============================
// A giant glass ornament swinging from a bough on a fixed arc — the forest's pendulum blade, in festival
// dress. Heart-cost graze, learnable swing, gorgeous. w9Bauble(G, {x, pivotY, len, amp, period, phase, r, color}).
class W9Bauble {
  constructor(G, x, pivotY, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false;
    this.x=x; this.pivotY=pivotY; this.len=opts.len||3.4; this.amp=opts.amp||0.9; this.period=opts.period||2.8;
    this.t=opts.phase||0; this.r=opts.r||0.7;
    this.group=new THREE.Group();
    const bough=mesh('cyl',[0.1,0.14,2.2,6], mat(W9PAL.bark)); bough.rotation.z=Math.PI/2; bough.position.set(x,pivotY,0); this.group.add(bough);
    this.arm=new THREE.Group(); this.arm.position.set(x,pivotY,0);
    const wire=mesh('cyl',[0.025,0.025,this.len,4], mat(0x8a8f9a)); wire.position.y=-this.len/2; this.arm.add(wire);
    const cc=opts.color||pick([W9PAL.ornR, W9PAL.ornG, 0x7ae8ff]);
    const ball=mesh('sph',[this.r,12,10], new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.4})); ball.position.y=-this.len; this.arm.add(ball);
    const cap=mesh('cyl',[this.r*0.3,this.r*0.34,0.2,8], mat(0xc9a24a)); cap.position.y=-this.len+this.r+0.08; this.arm.add(cap);
    const shine=mesh('sph',[this.r*0.24,6,5], emat(0xffffff,0xffffff,0.6)); shine.position.set(-this.r*0.4,-this.len+this.r*0.4,this.r*0.6); this.arm.add(shine);
    this.group.add(this.arm);
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    const ang=Math.sin(this.t*(TAU/this.period))*this.amp;
    this.arm.rotation.z=ang;
    const bx=this.x+Math.sin(ang)*this.len, by=this.pivotY-Math.cos(ang)*this.len;
    const pl=G.player;
    if(pl && !pl.dead && Math.abs(pl.pos.x-bx)<this.r+0.3 && Math.abs(pl.pos.z)<1.1 && Math.abs(pl.pos.y+0.6-by)<this.r+0.4){
      pl.damage(1, new THREE.Vector3(bx,by,0));
    }
  }
}

// =============================== 4) CANDY-CANE SWING (pendulum PLATFORM — ride the crook) ===============================
// A giant candy cane hanging crook-down, swinging on a fixed arc: the crook is a RIDEABLE platform — board
// at the near apex, ride the swing across the gap, hop off at the far apex. Pendulum mover, fully visible.
function w9CaneSwing(G, opts={}){
  const x=opts.x||0, pivotY=opts.pivotY||6.5, len=opts.len||4.2, amp=opts.amp||0.85, P=opts.period||3.4, phase=opts.phase||0;
  // the pivot bough + the cane (the cane visual hangs from a group we swing in a ticker; the SEAT is the mover)
  const bough=mesh('cyl',[0.12,0.16,2.4,6], mat(W9PAL.bark)); bough.rotation.z=Math.PI/2; bough.position.set(x,pivotY,0); G.scene.add(bough);
  const arm=new THREE.Group(); arm.position.set(x,pivotY,0);
  const shaft=new THREE.Group();
  const seg=(y0,h,red)=>{ const s2=mesh('cyl',[0.14,0.14,h,8], mat(red?0xd83a4a:0xf0f0f0)); s2.position.y=y0; shaft.add(s2); };
  const nSeg=Math.floor(len/0.45);
  for(let i=0;i<nSeg;i++) seg(-0.22-i*0.45, 0.45, i%2===0);
  shaft.position.y=0; arm.add(shaft);
  const crook=mesh('tor',[0.55,0.14,7,14,Math.PI], mat(0xd83a4a)); crook.position.y=-len; crook.rotation.z=Math.PI; arm.add(crook);
  G.scene.add(arm);
  const seat = G.world.addMover(1.0, 0.18, 1.2, (t)=>{
    const ang=Math.sin((t+phase)*(TAU/P))*amp;
    return new THREE.Vector3(x+Math.sin(ang)*len, pivotY-Math.cos(ang)*len-0.05, 0);
  }, ()=>{ const g=new THREE.Group();
    const pad=mesh('box',[0.95,0.14,1.1], mat(0xf0f0f0)); pad.position.y=0.07; g.add(pad);
    return g; });
  G.scene.add(seat.mesh);
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(),
    update(dt){ this.t+=dt; arm.rotation.z=Math.sin(this.t*(TAU/P))*amp; } });
  return seat;
}

// =============================== 5) CHIMNEY UPDRAFT (loft column at the woodcutter camps) ===============================
// A stone chimney breathing warm smoke: stand in the column and rise gently — the forest's vertical verb.
// Visible smoke particles mark the exact lane; deterministic lift, no RNG in the physics.
function w9Updraft(G, x, opts={}){
  const w=opts.w||1.8, top=opts.top||7.5, baseY=opts.baseY||0;
  const chim=new THREE.Group();
  const stack=mesh('box',[1.2,2.2,1.2], mat(0x3a3444)); stack.position.set(x,baseY+1.1,-1.4); chim.add(stack);
  const rim=mesh('box',[1.5,0.3,1.5], mat(0x2a2434)); rim.position.set(x,baseY+2.3,-1.4); chim.add(rim);
  const glowB=mesh('box',[0.7,0.3,0.7], emat(0xff8a3a,0xff6a20,0.9)); glowB.position.set(x,baseY+2.2,-1.4); chim.add(glowB);
  G.scene.add(bakeGroup(chim));
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), group:new THREE.Group(),
    update(dt, GG){
      this.t+=dt;
      if(Math.random()<dt*7) GG.fx.spawn(new THREE.Vector3(x+rand(-w*0.3,w*0.3), baseY+2.5+rand(0,(top-baseY)*0.8), -1.2+rand(0,1.2)), 0x9aa4b8, 1, {speed:0.5, life:1.2, gravity:-1.2, size:0.8});
      const pl=GG.player;
      if(pl && !pl.dead && Math.abs(pl.pos.x-x)<w/2 && pl.pos.y>baseY+1.8 && pl.pos.y<top && Math.abs(pl.pos.z)<1.6){
        pl.vel.y = Math.max(pl.vel.y, Math.min(5.2, pl.vel.y+16*dt));   // the warm lift — floaty, capped, honest
      }
    } });
}

// =============================== 6) THE ADVENT STUMP — w9's gamble container ===============================
// A great hollow stump wrapped in lights, one numbered door set in its bark, warm glow under the lid, the
// gamble-red pulse in the knothole. Same table, CLEAR-PATCH, 1s grace. Ambush: ORNAMENT SPIDERS drop —
// four baubles descend on threads and unfold.
class AdventStump {
  constructor(x, y, z, ry=0){
    this.group=new THREE.Group();
    const stump=mesh('cyl',[1.2,1.5,1.6,11], mat(W9PAL.bark)); stump.position.y=0.8; this.group.add(stump);
    const capS=mesh('cyl',[1.28,1.28,0.2,11], mat(W9PAL.snow)); capS.position.y=1.7; this.group.add(capS);
    const door=mesh('box',[0.7,0.95,0.12], mat(W9PAL.barkD)); door.position.set(0,0.6,1.28); this.group.add(door);
    const num=mesh('box',[0.24,0.3,0.04], emat(W9PAL.ornG,W9PAL.ornG,0.7)); num.position.set(0,0.72,1.36); this.group.add(num);   // the 25 (abstract, glowing)
    const knob=mesh('sph',[0.06,5,4], mat(0xc9a24a)); knob.position.set(0.24,0.55,1.36); this.group.add(knob);
    // lights wound around the bark
    for(let i=0;i<10;i++){ const a=i/10*TAU*1.6-0.5; const cc=pick([W9PAL.ornR,W9PAL.ornG,0x7ae8ff]);
      const b=mesh('sph',[0.07,5,4], emat(cc,cc,0.85)); b.position.set(Math.cos(a)*1.25, 0.4+i*0.13, Math.sin(a)*1.25); this.group.add(b); }
    this.pulse=mesh('sph',[0.16,6,5], new THREE.MeshBasicMaterial({color:0xff4a5a, transparent:true, opacity:0.6, depthWrite:false})); this.pulse.position.set(-0.5,1.1,1.1); this.group.add(this.pulse);
    this.glow=new THREE.PointLight(0xffb85e, 12, 7); this.glow.position.set(0,1.6,0.6); this.group.add(this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🎄 Open door twenty-five...?';
  }
  update(dt, G){
    this.t+=dt;
    if(!this.opened){
      this.pulse.material.opacity=0.35+Math.abs(Math.sin(this.t*2.6))*0.35;
      this.glow.intensity=9+Math.sin(this.t*2.2)*4;
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.pulse.material.opacity=damp(this.pulse.material.opacity,0,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened=true;
    const p=this.group.position;
    AUDIO.tone && AUDIO.tone({f:660,f2:880,type:'sine',t:0.3,vol:0.14});
    G.camc.shake(0.12,0.3);
    const scene=G.scene;
    setTimeout(()=>{
      if(G.scene!==scene) return;
      const r=Math.random();
      if(r<0.08){
        G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('🎄👻 A GHOSTLY 1-UP behind door 25! Lives: '+G.save.lives);
      } else if(r<0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1,p.y+1.0,0)); G.ents.add(new PowerUp(p.x+1.2,p.y+1.2,0, pick(['shield','moon','bat'])));
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('🎄✨ JACKPOT! Somebody saved the BEST door for you!');
      } else if(r<0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('🎄 A few candies... and a very old chocolate shaped like a bell.');
      } else {
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.3,0.4);
        const offs=[-2.4,-1.2,1.2,2.4];
        for(let i=0;i<offs.length;i++){
          const sp=new OrnamentSpider(this._G||G, p.x+offs[i], p.y+3.2, 0, {phase:i*0.3, dropY:p.y+0.8, wakeR:12, period:2.6});
          sp.spawnGrace=1.0; sp.state='unfold'; sp.st=-0.2-i*0.15;
          G.ents.add(sp);
        }
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), W9PAL.ornR, 20, {speed:4});
        window.UI && UI.toast('🎄🕷️ THE ORNAMENTS!! They were NEVER ornaments!!');
      }
    }, 650);
  }
}

// =============================== 7) THE QUIET CAROL — w9's Old Shortcut warp ===============================
// Three wind-chime tubes hanging from a bough under a lone PURPLE lantern. The forest taught you its tune —
// ring them LOW, HIGH, MIDDLE (spin beside each) and the pines open the old sled path. Wrong order resets.
class QuietCarol {
  constructor(G, x, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this.x=x; this.warpX=opts.warpX!==undefined?opts.warpX:x+8; this.candy=opts.candy||40; this.used=false;
    this.seq=0; this._hitWas=false;
    this.group=new THREE.Group();
    const bough=mesh('cyl',[0.12,0.16,3.4,6], mat(W9PAL.bark)); bough.rotation.z=Math.PI/2; bough.position.set(x,4.6,0); this.group.add(bough);
    this.tubes=[]; this.freqs=[440, 880, 660];   // low, high, middle — rung in that order
    const xs=[-1.1, 0, 1.1], lens=[1.4, 0.8, 1.1];
    for(let i=0;i<3;i++){
      const wire=mesh('cyl',[0.015,0.015,0.5,4], mat(0x8a8f9a)); wire.position.set(x+xs[i],4.3,0); this.group.add(wire);
      const tube=mesh('cyl',[0.09,0.09,lens[i],8], emat(0xc9ccd8,0x8a8f9a,0.5)); tube.position.set(x+xs[i], 4.0-lens[i]/2, 0); this.group.add(tube);
      this.tubes.push(tube);
    }
    this.tell=mesh('sph',[0.18,8,7], emat(0x9a5fd0,0x9a5fd0,1)); this.tell.position.set(x,5.4,0); this.group.add(this.tell);
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    this.tell.scale.setScalar(1+Math.sin(this.t*3)*0.25);
    this.tubes.forEach((tb,i)=>{ tb.rotation.x=damp(tb.rotation.x,0,4,dt); });
    if(this.used) return;
    const pl=G.player;
    if(!pl || pl.dead) return;
    const hitting = pl.attackT>0 || pl.pounding;
    if(hitting && !this._hitWas){
      const order=[0,1,2];   // tube indices: low(left), high(middle), middle(right)? — freqs array IS the order
      // nearest tube within reach
      let best=-1, bd=1.4;
      this.tubes.forEach((tb,i)=>{ const d=Math.abs(pl.pos.x-tb.position.x); if(d<bd && Math.abs(pl.pos.z)<1.6){ bd=d; best=i; } });
      if(best>=0){
        this.tubes[best].rotation.x=0.5;
        AUDIO.tone && AUDIO.tone({f:this.freqs[best], type:'sine', t:0.6, vol:0.15});
        if(best===this.seq){ this.seq++;
          this.G.fx.spawn(this.tubes[best].position.clone(), 0xc9ccd8, 6, {speed:1.5});
          if(this.seq>=3) this._open(G);
          else window.UI && UI.toast(this.seq===1 ? '🎐 The low note hangs in the air...' : '🎐 The high note answers... one more.');
        } else if(this.seq>0){ this.seq=0;
          window.UI && UI.toast('🎐 The chimes tangle. Low, high, middle — the way the forest sang it.'); }
      }
    }
    this._hitWas=hitting;
  }
  _open(G){
    this.used=true;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin(); G.camc.shake(0.4,0.5);
    G.fx.spawn(new THREE.Vector3(this.x,4,0), 0x9a5fd0, 30, {speed:6, life:1});
    window.UI && UI.toast('🎐✨ THE QUIET CAROL! The pines remember the old sled path — go!');
    G.addCandy(this.candy);
    G.persist && G.persist();
    G._warpUsed = true;
    const pl=G.player; pl.pos.set(this.warpX, 2, 0); pl.vel.set(0,0,0);
    window.UI && UI.updateHUD();
  }
}

// =============================== 8) LEVEL REGISTRY + CLUTTER ===============================
const W9_LEVELS = [];
LEVEL_LISTS.push(W9_LEVELS);

function w9Clutter(G, x1, x2, theme='forest'){
  const g=new THREE.Group();
  const n=Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.2){ const cone2=mesh('sph',[rand(0.08,0.13),5,4], mat(0x3c2f22)); cone2.scale.y=1.5; cone2.position.set(x,0.1,z); g.add(cone2); }
    else if(r<0.38){ const needleTuft=mesh('cone',[rand(0.12,0.2),rand(0.2,0.4),5], mat(W9PAL.pineL)); needleTuft.position.set(x,0.12,z); needleTuft.rotation.z=rand(-0.4,0.4); g.add(needleTuft); }
    else if(r<0.52){ const cc=pick([W9PAL.ornR,W9PAL.ornG,0x7ae8ff]); const orn=mesh('sph',[rand(0.1,0.18),6,5], emat(cc,cc,0.6)); orn.position.set(x,0.1,z); g.add(orn);
      const capO=mesh('cyl',[0.04,0.05,0.06,6], mat(0xc9a24a)); capO.position.set(x,0.24,z); g.add(capO); }   // a fallen ornament, unbroken
    else if(r<0.66){ const lump=mesh('sph',[rand(0.2,0.45),6,5], mat(W9PAL.snow)); lump.scale.y=0.45; lump.position.set(x,0.06,z); g.add(lump); }
    else if(r<0.78){ const branch=mesh('cyl',[0.03,0.05,rand(0.5,1.0),4], mat(W9PAL.bark)); branch.position.set(x,0.06,z); branch.rotation.z=Math.PI/2; branch.rotation.y=rand(TAU); g.add(branch); }
    else if(r<0.9){ const holly=mesh('sph',[0.12,5,4], mat(W9PAL.pine)); holly.scale.y=0.4; holly.position.set(x,0.05,z); g.add(holly);
      for(let hB=0;hB<2;hB++){ const berry=mesh('sph',[0.035,4,4], emat(W9PAL.ornR,0x8a1e2c,0.5)); berry.position.set(x+rand(-0.08,0.08),0.1,z+rand(-0.08,0.08)); g.add(berry); } }
    else { g.add(w6GiftBox(x, z, rand(0.5,0.8))); }
  }
  G.scene.add(bakeGroup(g));
}

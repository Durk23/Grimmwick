// ============ W8 KIT — THE ICICLE MINES building blocks (Winter District 3 · the glittering dark) ============
// Sorts after the w7 files and before the w8 levels (09zz...). REUSES 09_levelkit, the w6/w7 winter kits
// (SpikeIcicle = stalactites, AvalancheBall/Spawner, w6LightsBegin family, w5Chain climbables) and 00_utils.
// The mines are UNDERGROUND: no moon, no aurora — the "sky" is a ceiling of glowing crystal constellations.
// Contraptions at the D5-gear craft bar: minecarts on real rails, ore-bucket cable lines, traveling crystal
// drills, counterweight seesaw lifts. Every clock fixed from level start.

const W8PAL = {
  rock:    0x342c44,  rockD:   0x241c30,  rockL:   0x453a58,   // amethyst-dark mine stone
  crysC:   0x7ae8ff,  crysV:   0xb08aff,  crysA:   0xffb85e,   // the three crystal glows (cyan/violet/amber)
  brass:   0x9a8a4a,  brassD:  0x5a4f20,  steel:   0x6a6f7a,  rail: 0x8a8f9a,
  timber:  0x5a4632,  timberD: 0x3c2f20,
  sky:     0x0c0918,  fog:     0x191026,                       // the deep dark between the glitter
};

// =============================== 1) BACKDROP + AMBIENCE ===============================
function w8Parallax(S, x1, x2){
  // NEAR — stalagmite teeth + timber shoring silhouettes
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(3.5,7)){
    if(rand()<0.6){ const st=mesh('cone',[rand(0.5,1.2),rand(1.5,3.5),5], mat(0x1a1426)); st.position.set(x,rand(-0.5,0.5),-12.5); near.add(st); }
    else { const post=mesh('box',[0.35,rand(3,5),0.4], mat(0x241a12)); post.position.set(x,1.8,-12.8); near.add(post);
      const beam=mesh('box',[rand(2,3.5),0.35,0.4], mat(0x241a12)); beam.position.set(x,rand(3.4,4.4),-12.8); near.add(beam); }
  }
  S.add(bakeGroup(near));
  // MID — crystal seams + distant scaffolds with lit foreman-shack windows
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(6,11)){
    const r0=rand();
    if(r0<0.5){ const cc=pick([W8PAL.crysC,W8PAL.crysV,W8PAL.crysA]);
      for(let i=0;i<3;i++){ const cr=mesh('cone',[rand(0.25,0.5),rand(1,2.4),5], emat(cc,cc,0.45)); cr.position.set(x+rand(-1,1),rand(0,2.5),-19); cr.rotation.z=rand(-0.5,0.5); mid.add(cr); } }
    else { const legH=rand(3,6);
      for(const s of [-0.8,0.8]){ const leg=mesh('box',[0.25,legH,0.3], mat(0x1c1626)); leg.position.set(x+s,legH/2,-19.5); mid.add(leg); }
      const deck=mesh('box',[2.4,0.3,1], mat(0x1c1626)); deck.position.set(x,legH,-19.5); mid.add(deck);
      if(rand()<0.6){ const shack=mesh('box',[1.2,1,0.9], mat(0x221a2e)); shack.position.set(x,legH+0.65,-19.5); mid.add(shack);
        const win=mesh('box',[0.24,0.28,0.1], emat(W6PAL.window,W6PAL.window,0.85)); win.position.set(x,legH+0.6,-19); mid.add(win); } }
  }
  S.add(bakeGroup(mid));
  // FAR — the great dark + THE CRYSTAL CEILING: a constellation field of glow-points high overhead
  const wall=mesh('box',[x2-x1+90, 40, 1], mat(0x0a0714)); wall.position.set((x1+x2)/2, 12, -30); S.add(wall);
  const stars=new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/1.6)+30;i++){
    const cc=pick([W8PAL.crysC,W8PAL.crysV,W8PAL.crysA,0xdff4ff]);
    const s=mesh('sph',[rand(0.05,0.14),4,4], emat(cc,cc,0.9));
    s.position.set(rand(x1-30,x2+30), rand(9,20), -28.5); stars.add(s);
  }
  // a few great ceiling crystals hanging like chandeliers
  for(let i=0;i<Math.floor((x2-x1)/28);i++){ const cc=pick([W8PAL.crysC,W8PAL.crysV]);
    const ch=mesh('cone',[rand(0.8,1.4),rand(2.5,4),6], emat(cc,cc,0.5)); ch.rotation.x=Math.PI; ch.position.set(rand(x1,x2), rand(11,15), -27); stars.add(ch); }
  S.add(bakeGroup(stars));
}

function w8Ambience(S, x1, x2){
  // leaves channel — falling crystal dust (tiny glinting flecks)
  const leaves = [];
  for(let i=0;i<18;i++){ const cc=pick([0x7ae8ff,0xb08aff,0xdff4ff]); const lf=new THREE.Mesh(geo('circ',rand(0.04,0.08),4), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:rand(0.5,0.85), side:THREE.DoubleSide, depthWrite:false})); lf.userData={x0:rand(x1,x2), y0:rand(4,10), sp:rand(0.2,0.5), ph:rand(9), sw:rand(0.4,1.0)}; S.add(lf); leaves.push(lf); }
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<40;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0xb08aff, size:0.1, transparent:true, opacity:0.7}));
  S.add(flies);
  const clouds = [];   // low cave-mist banks
  for(let i=0;i<4;i++){ const cl=new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x2a2240, transparent:true, opacity:0.3})); cl.scale.set(2.2,0.18,0.6); cl.userData={y:rand(0.2,0.8), sp:rand(0.2,0.4), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.4); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

function w8LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 5, 30);   // cave bats, obviously
  G.amb  = w8Ambience(G.scene, x1, x2);
  G.scene.background = new THREE.Color(W8PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W8PAL.fog);
  if(clutterTheme) w8Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) DECO — crystals everywhere (the glitter half of the dark) ===============================
function w8CrystalCluster(x, z, s=1, color){
  const g=new THREE.Group();
  const cc=color||pick([W8PAL.crysC,W8PAL.crysV,W8PAL.crysA]);
  const m=new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.4, transparent:true, opacity:0.9});
  for(let i=0;i<4;i++){ const sh=new THREE.Mesh(geo('cone', (0.14+((i*7)%3)*0.05)*s, (0.4+((i*5)%4)*0.16)*s, 5), m);
    sh.position.set(x-0.25*s+i*0.17*s, 0.2*s, z+((i*3)%2?0.1:-0.1)*s); sh.rotation.z=(-0.35+i*0.22); g.add(sh); }
  return g;
}
function w8TimberFrame(x, h=3.4){
  const g=new THREE.Group();
  for(const s of [-1.2,1.2]){ const post=mesh('box',[0.3,h,0.35], mat(W8PAL.timber)); post.position.set(x+s,h/2,-1.6); g.add(post); }
  const beam=mesh('box',[3.0,0.3,0.35], mat(W8PAL.timberD)); beam.position.set(x,h,-1.6); g.add(beam);
  return g;
}

// =============================== 3) MINECARTS ON RAILS (contraption #1) ===============================
// w8Rails: baked twin rails + sleepers along a span. w8Cart: a riveted ore cart shuttling that span — a
// moving platform with wheels that actually turn. Ride it, hop between carts, mind the buffers.
function w8Rails(G, x0, x1, y=0){
  const g=new THREE.Group();
  const w=Math.abs(x1-x0), cx=(x0+x1)/2;
  for(const zz of [-0.55,0.55]){ const rail=mesh('box',[w,0.08,0.08], mat(W8PAL.rail)); rail.position.set(cx,y+0.06,zz); g.add(rail); }
  for(let x=Math.min(x0,x1)+0.4; x<Math.max(x0,x1); x+=1.1){ const tie=mesh('box',[0.5,0.06,1.5], mat(W8PAL.timberD)); tie.position.set(x,y+0.02,0); g.add(tie); }
  G.scene.add(bakeGroup(g));
}
function w8Cart(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||14, y=opts.y!==undefined?opts.y:0, speed=opts.speed||2.6, phase=opts.phase||0;
  const span=Math.abs(x1-x0), P=span/speed;
  const cart = G.world.addMover(1.9, 0.25, 1.5, (t)=>{
    const tt=(t+phase)%(P*2);
    const k=tt<P ? tt/P : 2-tt/P;
    return new THREE.Vector3(lerp(x0,x1,k), y+1.0, 0);
  }, ()=>{
    const g=new THREE.Group();
    const box=mesh('box',[1.8,0.8,1.4], emat(0x4a4458,0x241c30,0.15)); box.position.y=-0.5; g.add(box);
    for(const s of [-0.85,0.85]){ const band=mesh('box',[0.1,0.85,1.44], mat(W8PAL.brassD)); band.position.set(s,-0.5,0); g.add(band); }
    const lip=mesh('box',[1.9,0.12,1.5], mat(W8PAL.steel)); lip.position.y=-0.12; g.add(lip);
    for(const wx of [-0.6,0.6]) for(const wz of [-0.6,0.6]){ const wh=mesh('cyl',[0.24,0.24,0.14,9], mat(0x1a1626)); wh.rotation.x=Math.PI/2; wh.position.set(wx,-0.95,wz); g.add(wh); }
    const ore=mesh('sph',[0.5,7,6], emat(W8PAL.crysV,W8PAL.crysV,0.5)); ore.scale.y=0.5; ore.position.y=-0.08; g.add(ore);   // a glowing load — the cart doubles as a lamp
    return g;
  });
  G.scene.add(cart.mesh);
  return cart;
}

// =============================== 4) ORE-BUCKET CABLE LINE (contraption #2 — ride the buckets) ===============================
// A looping aerial line: pylons, cable, hanging ore buckets you stand in/on, crossing the chasms. Same
// continuous-loop math as the w7 rope-tow (bottom run = the ride). Pass warpX to make bucket #0 THE
// OFF-LIMITS BUCKET (purple lantern, the district's Old Shortcut): stay aboard past the last pylon and it
// carries you into the sealed tunnel — the warp. Once per run, full candy bonus.
function w8BucketLine(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||26, y=opts.y!==undefined?opts.y:3.2, n=opts.n||3, speed=opts.speed||2.2;
  const topY=y+2.1, span=Math.abs(x1-x0), wr=0.8;
  const Pm=2*span + 2*Math.PI*wr;
  const deco=new THREE.Group();
  for(const px of [x0,x1]){
    for(const s of [-0.5,0.5]){ const leg=mesh('box',[0.22,topY+1,0.26], mat(W8PAL.steel)); leg.position.set(px+s,(topY+1)/2,-1.1); leg.rotation.z=s*0.12; deco.add(leg); }
    const cross=mesh('box',[1.6,0.22,0.3], mat(W8PAL.brassD)); cross.position.set(px,topY+0.9,-1.1); deco.add(cross);
  }
  for(const cy of [y+0.75, topY+0.75]){ const cable=mesh('cyl',[0.03,0.03,span,4], mat(0x1a1626)); cable.rotation.z=Math.PI/2; cable.position.set((x0+x1)/2, cy, 0); deco.add(cable); }
  G.scene.add(bakeGroup(deco));
  const wheels=[];
  for(const px of [x0,x1]){ const wh=cogMesh(wr, W8PAL.brassD); wh.position.set(px,(y+topY)/2+0.75,-0.6); G.scene.add(wh); wheels.push(wh); }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt){ this.t+=dt; for(const wh of wheels) wh.rotation.z -= (speed/wr)*dt; } });
  const movers=[];
  for(let i=0;i<n;i++){
    const off=(i/n)*Pm;
    const isWarp = i===0 && opts.warpX!==undefined;
    const mv = G.world.addMover(1.4, 0.22, 1.2, (t)=>{
      let s=((t*speed+off)%Pm+Pm)%Pm;
      const cyMid=(y+topY)/2, half=(topY-y)/2;
      if(s<span) return new THREE.Vector3(lerp(x0,x1,s/span), y, 0);
      s-=span;
      if(s<Math.PI*wr){ const a=-Math.PI/2 + (s/(Math.PI*wr))*Math.PI; return new THREE.Vector3(x1, cyMid+Math.sin(a)*half, 0); }
      s-=Math.PI*wr;
      if(s<span) return new THREE.Vector3(lerp(x1,x0,s/span), topY, 0);
      s-=span;
      { const a=Math.PI/2 + (s/(Math.PI*wr))*Math.PI; return new THREE.Vector3(x0, cyMid+Math.sin(a)*half, 0); }
    }, ()=>{
      const g=new THREE.Group();
      const hang=mesh('cyl',[0.035,0.035,0.75,4], mat(0x1a1626)); hang.position.y=0.6; g.add(hang);
      const bucket=mesh('cyl',[0.65,0.5,0.7,9], emat(isWarp?0x3a2a5e:0x4a4458, isWarp?0x2a1a4e:0x241c30, 0.15)); bucket.position.y=0.0; g.add(bucket);
      const rim2=mesh('tor',[0.65,0.05,5,12], mat(W8PAL.brassD)); rim2.position.y=0.24; g.add(rim2);
      if(isWarp){ const lant=mesh('sph',[0.14,7,6], emat(0x9a5fd0,0x9a5fd0,1)); lant.position.set(0,1.0,0); g.add(lant); }
      else { const glowOre=mesh('sph',[0.32,6,5], emat(W8PAL.crysA,W8PAL.crysA,0.5)); glowOre.scale.y=0.5; glowOre.position.y=0.22; g.add(glowOre); }
      return g;
    });
    G.scene.add(mv.mesh);
    movers.push(mv);
    if(isWarp){
      // THE OFF-LIMITS BUCKET — stay aboard through the far pylon and the old line remembers where it went
      G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(), _fired:false,
        update(dt, GG){
          if(this._fired || GG._warpUsed) return;
          const pl=GG.player;
          if(!pl || pl.dead || !pl.grounded || pl.groundCol!==mv.col) return;
          const bx=(mv.col.min.x+mv.col.max.x)/2, by=mv.col.max.y;
          const nearFar = Math.abs(bx - x1) < 0.6 && by > y+0.8;   // riding UP AND OVER the far wheel
          if(nearFar){
            this._fired=true;
            AUDIO.goldPumpkin && AUDIO.goldPumpkin(); GG.camc.shake(0.4,0.5);
            GG.fx.spawn(new THREE.Vector3(bx,by+1,0), 0x9a5fd0, 30, {speed:6, life:1});
            window.UI && UI.toast('🪣✨ THE OFF-LIMITS LINE! The old bucket remembers its secret station!');
            GG.addCandy(opts.candy||40); GG.persist && GG.persist();
            GG._warpUsed = true;
            pl.pos.set(opts.warpX, 2, 0); pl.vel.set(0,0,0);
            window.UI && UI.updateHUD();
          }
        } });
    }
  }
  return movers;
}

// =============================== 5) THE CRYSTAL DRILL (contraption #3 — traveling hazard) ===============================
// A brass drill-head grinding along a track: spinning fluted cone, spark spray, heart-cost contact. The
// mines' IceSaw cousin — same shuttle clock, angrier bit.
function w8Drill(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||10, y=opts.y!==undefined?opts.y:0.7, P=opts.period||5, phase=opts.phase||0;
  const slot=mesh('box',[Math.abs(x1-x0)+1.4, 0.08, 0.3], mat(0x1a1626)); slot.position.set((x0+x1)/2, y-0.55, 0); G.scene.add(slot);
  const rig=new THREE.Group();
  const body=mesh('box',[0.9,0.7,0.8], emat(W8PAL.brass,W8PAL.brassD,0.25)); rig.add(body);
  const drill=new THREE.Group();
  const bit=mesh('cone',[0.34,0.9,8], emat(W8PAL.steel,0x3a3f48,0.4)); bit.rotation.z=-Math.PI/2; bit.position.x=0.9; drill.add(bit);
  for(let i=0;i<3;i++){ const flute=mesh('box',[0.7,0.07,0.07], mat(W8PAL.brassD)); flute.position.x=0.75; flute.rotation.x=i/3*TAU; drill.add(flute); }
  rig.add(drill); rig.userData.drill=drill;
  const lamp=mesh('sph',[0.09,6,5], emat(W8PAL.crysA,W8PAL.crysA,1)); lamp.position.set(-0.4,0.5,0); rig.add(lamp);
  G.scene.add(rig);
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(), _lx:x0,
    update(dt, GG){
      this.t+=dt;
      const tt=this.t%(P*2), k=tt<P?tt/P:2-tt/P;
      const bx=lerp(x0,x1,k);
      const dir=Math.sign(bx-this._lx)||1; this._lx=bx;
      rig.position.set(bx, y, 0);
      rig.rotation.y = dir>0?0:Math.PI;
      rig.userData.drill.rotation.x += 14*dt;
      if(Math.random()<dt*6) GG.fx.spawn(new THREE.Vector3(bx+dir*1.2, y, 0), pick([0xffb85e,0xffd23f]), 1, {speed:2, life:0.25});
      const pl=GG.player;
      if(pl && !pl.dead && Math.abs(pl.pos.x-(bx+dir*0.9))<0.8 && Math.abs(pl.pos.z)<0.9 && pl.pos.y<y+0.7 && pl.pos.y+1.2>y-0.7){
        pl.damage(1, new THREE.Vector3(bx,y,0));
      }
    } });
}

// =============================== 6) THE COUNTERWEIGHT SEESAW (contraption #4 — paired lift platforms) ===============================
// Two platforms chained over a pulley on a slow FIXED clock: as one rises the other sinks — read the wheel,
// board low, ride high. (Clocked, not weight-driven: the speedrun covenant beats physics toys.)
function w8Seesaw(G, opts={}){
  const x=opts.x||0, gap=opts.gap||5, y0=opts.y0||2.2, amp=opts.amp||1.6, P=opts.period||5.2, phase=opts.phase||0;
  const xA=x-gap/2, xB=x+gap/2;
  // the pulley frame
  const frame=new THREE.Group();
  const beam=mesh('box',[gap+1.6,0.3,0.4], mat(W8PAL.timber)); beam.position.set(x, y0+amp+1.6, -0.9); frame.add(beam);
  for(const s of [-1,1]){ const leg=mesh('box',[0.28,y0+amp+1.6,0.32], mat(W8PAL.timberD)); leg.position.set(x+s*(gap/2+0.7),(y0+amp+1.6)/2,-0.9); frame.add(leg); }
  G.scene.add(bakeGroup(frame));
  const wheel=cogMesh(0.55, W8PAL.brassD); wheel.position.set(x, y0+amp+1.2, -0.6); G.scene.add(wheel);
  const chainA=mesh('cyl',[0.03,0.03,1,4], mat(0x1a1626)); G.scene.add(chainA);
  const chainB=chainA.clone(); G.scene.add(chainB);
  const mk=(px, sgn)=>G.world.addMover(2.0, 0.28, 1.7, (t)=>new THREE.Vector3(px, y0 + Math.sin((t+phase)*TAU/P)*amp*sgn, 0),
    ()=>{ const g=new THREE.Group();
      const p=mesh('box',[1.95,0.26,1.65], mat(W8PAL.brass)); p.position.y=0.13; g.add(p);
      for(const cz of [-0.7,0.7]){ const ring=mesh('tor',[0.09,0.03,4,8], mat(W8PAL.brassD)); ring.position.set(0,0.36,cz); g.add(ring); }
      return g; });
  const A=mk(xA, 1), B=mk(xB, -1);
  G.scene.add(A.mesh); G.scene.add(B.mesh);
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(),
    update(dt){
      this.t+=dt;
      wheel.rotation.z = Math.sin(this.t*TAU/P)*2.2;
      const yA=A.col.max.y, yB=B.col.max.y, wy=y0+amp+1.2;
      chainA.position.set(xA, (yA+wy)/2, -0.2); chainA.scale.y=Math.max(0.1, wy-yA);
      chainB.position.set(xB, (yB+wy)/2, -0.2); chainB.scale.y=Math.max(0.1, wy-yB);
    } });
  return [A,B];
}

// =============================== 7) THE CRYSTAL BOULDER (the mines' avalanche skin) ===============================
class CrystalBoulder extends AvalancheBall {
  constructor(G, x, y, opts={}){
    super(G, x, y, opts);
    this.ball.material = emat(0x4a4058, W8PAL.crysV, 0.35);
    this.ball.children.forEach(fl=>{ fl.material = emat(W8PAL.crysV, W8PAL.crysV, 0.7); fl.scale.setScalar(1.4); });
  }
}
class CrystalBoulderSpawner extends AvalancheSpawner {
  update(dt, G){
    this.t += dt;
    if(this.t >= this.nextAt){
      this.nextAt += this.period;
      G.ents.add(new CrystalBoulder(G, this.x, this.y, this.o));
      G.fx.spawn(new THREE.Vector3(this.x, this.y+1.2, 0), W8PAL.crysV, 6, {speed:2, life:0.4});
      AUDIO.noise && AUDIO.noise({t:0.3, vol:0.13, fFrom:180, fTo:50});
    }
  }
}

// =============================== 8) THE GLIMMERING GEODE — w8's gamble container ===============================
// A giant sealed geode, light leaking from its crack, the gamble-red pulse deep inside. Same table
// (8/24/38/30), CLEAR-PATCH, 1s grace. The ambush: the geode was a GEM MIMIC NEST — four burst out.
class GlimmeringGeode {
  constructor(x, y, z, ry=0){
    this.group=new THREE.Group();
    const shellM=emat(0x3a3448,0x1a1424,0.12);
    const shell=mesh('sph',[1.3,11,9], shellM); shell.position.y=0.9; shell.scale.set(1.15,1,1); this.group.add(shell);
    for(let i=0;i<5;i++){ const wart=mesh('sph',[rand(0.2,0.4),6,5], shellM); const a=i/5*TAU; wart.position.set(Math.cos(a)*1.1, 0.9+Math.sin(a)*0.7, 0.4); this.group.add(wart); }
    // the crack — a jagged glowing seam
    this.seam=new THREE.Group();
    for(let i=0;i<4;i++){ const sg=mesh('box',[0.1,rand(0.3,0.55),0.1], emat(W8PAL.crysV,W8PAL.crysV,1)); sg.position.set(-0.3+i*0.2, 0.6+((i%2)*0.4), 1.22); sg.rotation.z=(i%2?0.4:-0.3); this.seam.add(sg); }
    this.group.add(this.seam);
    this.pulse=mesh('sph',[0.35,8,7], new THREE.MeshBasicMaterial({color:0xff4a5a, transparent:true, opacity:0.5, depthWrite:false})); this.pulse.position.set(0,0.9,1.1); this.group.add(this.pulse);
    this.glow=new THREE.PointLight(0xb08aff, 13, 7); this.glow.position.set(0,1.3,0.8); this.group.add(this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='💎 Crack open the glimmering geode...?';
  }
  update(dt, G){
    this.t+=dt;
    if(!this.opened){
      this.pulse.material.opacity=0.3+Math.abs(Math.sin(this.t*2.6))*0.35;
      this.glow.intensity=10+Math.sin(this.t*2.2)*5;
      this.seam.children.forEach((s,i)=>{ s.material.emissiveIntensity=0.7+Math.sin(this.t*3+i)*0.3; });
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.pulse.material.opacity=damp(this.pulse.material.opacity,0,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened=true;
    const p=this.group.position;
    AUDIO.noise && AUDIO.noise({t:0.35,vol:0.16,fFrom:400,fTo:1600});
    G.camc.shake(0.2,0.4);
    const scene=G.scene;
    setTimeout(()=>{
      if(G.scene!==scene) return;
      const r=Math.random();
      if(r<0.08){
        G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('💎👻 A GHOSTLY 1-UP slept in the hollow! Lives: '+G.save.lives);
      } else if(r<0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1,p.y+1.0,0)); G.ents.add(new PowerUp(p.x+1.2,p.y+1.2,0, pick(['shield','moon','bat'])));
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('💎✨ JACKPOT! The heart of the geode — candy, a heart, AND a treasure!');
      } else if(r<0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('💎 A few candied crystals... pretty, at least.');
      } else {
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.35,0.4);
        const offs=[-2.6,-1.4,1.4,2.6];
        for(let i=0;i<offs.length;i++){
          const m=new GemMimic(G, p.x+offs[i], p.y, 0, {phase:i*0.3, wakeR:9});
          m.spawnGrace=1.0; m.state='glint'; m.st=-0.4-i*0.15;   // they wake OFFENDED, staggered
          G.ents.add(m);
        }
        G.fx.spawn(new THREE.Vector3(p.x,p.y+0.9,p.z), W8PAL.crysV, 22, {speed:4.5});
        window.UI && UI.toast('💎🦷 IT WAS A NEST!! The geode was FULL of gem mimics!!');
      }
    }, 650);
  }
}

// =============================== 9) LEVEL REGISTRY + CLUTTER ===============================
const W8_LEVELS = [];
LEVEL_LISTS.push(W8_LEVELS);

function w8Clutter(G, x1, x2, theme='mine'){
  const g=new THREE.Group();
  const n=Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.22){ const ore=mesh('sph',[rand(0.15,0.3),6,5], mat(W8PAL.rockD)); ore.scale.y=0.7; ore.position.set(x,0.1,z); g.add(ore); }
    else if(r<0.42){ g.add(w8CrystalCluster(x, z, rand(0.4,0.8))); }
    else if(r<0.54){ const pick3=mesh('box',[0.5,0.05,0.05], mat(0x6a5a48)); pick3.position.set(x,0.06,z); pick3.rotation.y=rand(TAU); g.add(pick3);
      const head=mesh('box',[0.08,0.16,0.05], mat(W8PAL.steel)); head.position.set(x+0.22,0.08,z); g.add(head); }
    else if(r<0.66){ const helm=mesh('sph',[0.16,7,6], mat(0xc9a24a)); helm.scale.y=0.7; helm.position.set(x,0.1,z); g.add(helm); }
    else if(r<0.78){ const wheel2=mesh('cyl',[0.2,0.2,0.1,9], mat(0x1a1626)); wheel2.position.set(x,0.12,z); wheel2.rotation.z=rand(-1.5,1.5); g.add(wheel2); }
    else if(r<0.9){ const stub=mesh('box',[0.28,rand(0.3,0.7),0.3], mat(W8PAL.timberD)); stub.position.set(x,0.2,z); crook(stub,0.1); g.add(stub); }
    else { const lamp2=mesh('sph',[0.08,5,4], emat(W8PAL.crysA,W8PAL.crysA,0.7)); lamp2.position.set(x,0.08,z); g.add(lamp2); }
  }
  G.scene.add(bakeGroup(g));
}

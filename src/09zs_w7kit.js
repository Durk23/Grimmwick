// ============ W7 KIT — FROZEN LAKE FELL building blocks (Winter District 2 · the great white ice) ============
// Sorts after the w6 files (09zs > 09zr) and before the w7 levels (09zt...). REUSES 09_levelkit +
// the w6 kit's builders (W6PAL, w6Pine, w6SnowmanDeco, w6LightsBegin/String/Finish, SpikeIcicle,
// AvalancheSpawner, w6IceX) and 00_utils. All statics BAKED; the contraptions are the D5-gear standard
// (owner directive: "fun cool obstacles that don't look plain and simple") — brass + ice + bolts +
// readable motion, the machine IS the platform. Determinism: every clock fixed from level start.
//
// W7 CONTRACTS:
//  - build tail: w7LevelFinish(G, x1, x2, clutterTheme) — checkpoint/bats/amb + winter retint + BIG aurora.
//  - THE CRACKING LAKES (owner centerpiece): w7CrackLake(G, x1, x2, opts) — stand still too long and the
//    panel spiderwebs → CREAKS → SHATTERS: the plunge is the full death-action (heart + lantern walk-back
//    via G.onPlayerFell). Panels refreeze ~3.2s. Registers holes in G._anglerHoles (the Ice Angler's menu)
//    and exposes G._bearSlam (the Somnambear's wake-slam shatters nearby panels).

const W7PAL = {
  ice:     0xdfeaf8,  iceD:    0xb8cce8,  glass:   0xcfe4f4,   // the great white expanse
  water:   0x0c2438,  waterG:  0x14486a,                       // what waits below
  brass:   0x9a8a4a,  brassD:  0x5a4f20,  steel:   0x6a6f7a,   // lake-industry machinery (the D5 gear metals)
  buoy:    0xd83a4a,  rope:    0x8a7a5c,
  sky:     0x0a1428,  fog:     0x18294a,                       // deeper night than Glimmerfields — the open ice
  hillNear:0x142038,  hillFar: 0x0e1830,
};

// =============================== 1) BACKDROP + AMBIENCE ===============================
function w7Parallax(S, x1, x2){
  // NEAR — pressure ridges: rafts of up-thrust ice slabs (the lake fighting itself)
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(4,8)){
    const slab=mesh('box',[rand(1.2,2.6),rand(0.5,1.6),0.5], mat(0x1a2846)); slab.position.set(x,rand(0,0.6),-12.5); slab.rotation.z=rand(-0.5,0.5); near.add(slab);
    if(rand()<0.4){ const shard=mesh('cone',[rand(0.2,0.4),rand(0.8,1.6),4], mat(0x223354)); shard.position.set(x+rand(-1,1),rand(0.3,0.9),-12.7); shard.rotation.z=rand(-0.3,0.3); near.add(shard); }
  }
  S.add(bakeGroup(near));
  // MID — the FAR SHORE: a thin line of tiny lit village + pines across miles of white (the loneliness read)
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(7,13)){
    if(rand()<0.4){ const h=mesh('box',[rand(0.8,1.4),rand(0.6,1),1], mat(0x16223e)); h.position.set(x,0.5,-20); mid.add(h);
      const w=mesh('box',[0.16,0.2,0.1], emat(W6PAL.window,W6PAL.window,0.85)); w.position.set(x,0.5,-19.4); mid.add(w);
      const r=mesh('cone',[0.7,0.7,4], mat(0x101a32)); r.position.set(x,1.35,-20); mid.add(r); }
    else { const p=mesh('cone',[rand(0.5,0.9),rand(1.4,2.6),6], mat(0x122036)); p.position.set(x,1,-20.5); mid.add(p); }
  }
  // a beached trawler silhouette on the far shore
  if(typeof galleonSilhouette==='function'){ const tr=galleonSilhouette((x1+x2)/2+18, -21, 0.55); tr.rotation.z=0.06; mid.add(tr); }
  S.add(bakeGroup(mid));
  // FAR — great blue fells under the aurora
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(10,16)){ const f=mesh('cone',[rand(5,8),rand(7,13),4], mat(W7PAL.hillFar)); f.position.set(x,rand(-2,1),-28); far.add(f); }
  S.add(bakeGroup(far));
  // the MOON GLADE — a long blade of moonlight lying across the ice (one emissive strip, pure mood)
  const glade=mesh('box',[(x2-x1)*0.5, 0.02, 3.4], emat(0xdfeaf8, 0x8fb4e0, 0.22)); glade.position.set((x1+x2)/2, 0.03, -6.5); S.add(glade);
}

function w7Ambience(S, x1, x2){
  // leaves channel — WIND-DRIVEN snow (faster, flatter sway than Glimmerfields' drift: the open-ice wind)
  const leaves = [];
  for(let i=0;i<20;i++){ const lf=new THREE.Mesh(geo('circ',rand(0.06,0.11),5), new THREE.MeshBasicMaterial({color:pick([0xffffff,0xeef3ff]), transparent:true, opacity:rand(0.5,0.8), side:THREE.DoubleSide, depthWrite:false})); lf.userData={x0:rand(x1,x2), y0:rand(3,9), sp:rand(0.3,0.6), ph:rand(9), sw:rand(2.2,3.6)}; S.add(lf); leaves.push(lf); }
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<34;i++) fp.push(rand(x1,x2), rand(0.3,6), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0xbfe8ff, size:0.09, transparent:true, opacity:0.65}));
  S.add(flies);
  const clouds = [];   // low blowing-snow banks scudding across the ice
  for(let i=0;i<6;i++){ const cl=new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x9fb2d6, transparent:true, opacity:0.16})); cl.scale.set(2.6,0.14,0.6); cl.userData={y:rand(0.2,0.9), sp:rand(0.5,1.0), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.2); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

function w7LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 3, 30);
  G.amb  = w7Ambience(G.scene, x1, x2);
  w6Aurora(G, x1, x2);   // the aurora rides bigger out here — the kit ticker handles it
  G.scene.background = new THREE.Color(W7PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W7PAL.fog);
  if(clutterTheme) w7Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) THE CRACKING LAKES (owner centerpiece, Sept 4 2026) ===============================
// w7CrackLake(G, x1, x2, opts): a run of ice PANELS over open water. Stand on one and its crack budget fills
// (~1.1s); leave and it drains. Stages: spiderweb (45%) → deep cracks + CREAK + shudder (80%) → SHATTER — the
// panel drops away and the plunge charges the full pit price (G.onPlayerFell: splash, heart, lantern walk-back).
// Panels refreeze after ~3.2s (scale-in) so a route never soft-locks. Deterministic: budget = time-stood.
// opts: {budget:1.1, refreeze:3.2, grip:false (tag:'ice' by default — cracking AND slick), d:5}
function w7CrackLake(G, x1, x2, opts={}){
  const B=opts.budget||1.1, RF=opts.refreeze||3.2, pw=2.4, d=opts.d||5;
  const areaAtBuild = G.area;
  // the water below — dark, patient (visual only; the ticker charges the plunge)
  const water=mesh('box',[x2-x1, 0.5, d+4], emat(W7PAL.water, W7PAL.waterG, 0.35)); water.position.set((x1+x2)/2, -2.6, 0); G.scene.add(water);
  const gleam=new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/2.2);i++){ const gl=mesh('sph',[rand(0.05,0.1),4,4], emat(0x2a6a9a,0x2a6a9a,0.8)); gl.position.set(rand(x1,x2), rand(-2.2,-1.4), rand(-1.5,1.5)); gleam.add(gl); }
  G.scene.add(bakeGroup(gleam));
  G._anglerHoles = G._anglerHoles || [];
  const panels=[];
  for(let cx=x1+pw/2; cx<x2; cx+=pw){
    const m=new THREE.Mesh(geo('box', pw-0.08, 0.3, d), new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.18, transparent:true, opacity:0.82}));
    m.position.set(cx,-0.15,0); G.scene.add(m);
    const col=G.world.addBox(cx,-0.3,0,pw,0.3,d, opts.grip?{}:{tag:'ice'});
    // crack overlays: stage-1 shows two hairlines, stage-2 the whole web (thin dark strips, prebuilt + hidden)
    const cr=new THREE.Group();
    for(let k=0;k<5;k++){ const ln=mesh('box',[rand(0.5,pw*0.7),0.02,0.05], mat(0x2a4668)); ln.position.set(cx+rand(-0.7,0.7), 0.02, rand(-d*0.3,d*0.3)); ln.rotation.y=rand(TAU); ln.userData.stage=k<2?1:2; ln.visible=false; cr.add(ln); }
    G.scene.add(cr);
    panels.push({cx, m, col, cr, budget:0, stage:0, open:false, reAt:0, hole:{x:cx, r:pw/2}});
  }
  const shatter=(p)=>{
    if(p.open) return;
    p.open=true; p.stage=0; p.budget=0; p.reAt=RF;
    p.m.visible=false; p.col.type='ghost';
    p.cr.children.forEach(l=>l.visible=false);
    G._anglerHoles.push(p.hole);
    AUDIO.noise && AUDIO.noise({t:0.3,vol:0.16,fFrom:2000,fTo:200});
    G.fx.spawn(new THREE.Vector3(p.cx,0.1,0), 0xcfe4f4, 14, {speed:3.5, life:0.5});
    G.camc && G.camc.shake(0.12,0.2);
  };
  // the Somnambear hook — her wake-slam rewrites the floor (guarded against stale areas)
  G._bearSlam = (bx, r)=>{ if(G.area!==areaAtBuild) return; for(const p of panels) if(!p.open && Math.abs(p.cx-bx)<r) shatter(p); };
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), group:new THREE.Group(),
    update(dt, GG){
      this.t+=dt;
      const pl=GG.player;
      for(const p of panels){
        if(p.open){
          p.reAt-=dt;
          if(p.reAt<=0){   // REFREEZE — the lake heals (scale-in so the return reads)
            p.open=false; p.m.visible=true; p.m.scale.set(0.2,1,0.2); p.col.type='solid';
            const hi=GG._anglerHoles.indexOf(p.hole); if(hi>=0) GG._anglerHoles.splice(hi,1);
            GG.fx.spawn(new THREE.Vector3(p.cx,0.05,0), 0xbfe8ff, 5, {speed:1.5, life:0.4});
          }
          continue;
        }
        p.m.scale.x = damp(p.m.scale.x, 1, 4, dt); p.m.scale.z = damp(p.m.scale.z, 1, 4, dt);
        const on = pl && !pl.dead && pl.grounded && pl.groundCol===p.col;
        p.budget = on ? p.budget+dt : Math.max(0, p.budget-dt*1.6);
        const k=p.budget/B;
        const st = k>=1?3 : k>0.8?2 : k>0.45?1 : 0;
        if(st!==p.stage){
          p.stage=st;
          p.cr.children.forEach(l=>{ l.visible = st>=l.userData.stage; });
          if(st===2){ AUDIO.noise && AUDIO.noise({t:0.22,vol:0.13,fFrom:160,fTo:60}); GG.camc && GG.camc.shake(0.06,0.15); }   // the CREAK — last warning
          if(st===3) shatter(p);
        }
        if(p.stage===2) p.m.position.x = p.cx + Math.sin(this.t*40)*0.02;   // the shudder
        else p.m.position.x = p.cx;
      }
      // THE PLUNGE — fell through: splash + the full pit price (heart + lantern walk-back, death when hearts run out)
      if(pl && !pl.dead && pl.pos.y < -1.4 && pl.pos.x>x1-0.5 && pl.pos.x<x2+0.5){
        GG.fx.spawn(new THREE.Vector3(pl.pos.x, -1.2, pl.pos.z), 0x4a9ed0, 18, {speed:4, life:0.6});
        GG.fx.spawn(new THREE.Vector3(pl.pos.x, -1.0, pl.pos.z), 0xcfe4f4, 10, {speed:3, life:0.5});
        AUDIO.noise && AUDIO.noise({t:0.4,vol:0.2,fFrom:800,fTo:120});
        GG.onPlayerFell();
      }
    } });
  return panels;
}
// a fishing hole that also feeds the Angler's menu (w6FishHole + registration)
function w7FishHole(G, x, w=1.6){
  w6FishHole(G, x, w);
  (G._anglerHoles = G._anglerHoles || []).push({x, r:w*0.55});
}

// =============================== 3) THE ICE POLISHER (contraption #1 — ride the roof, dodge the brush) ===============================
// A brass lake-buffing machine trundling a fixed ping-pong route: rounded cab, chuffing stack, a SPINNING
// FRONT BRUSH (heart-cost contact), and a flat riveted ROOF that is a moving platform. Behind it the ice
// gleams freshly polished. The D5-gear bar: machinery with a face, motion you can read, comedy included.
function w7IcePolisher(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||20, speed=opts.speed||2.2, phase=opts.phase||0;
  const span=Math.abs(x1-x0), P=span/speed;
  const mover = G.world.addMover(2.4, 0.3, 1.8, (t)=>{
    const tt=(t+phase)%(P*2);
    const k=tt<P ? tt/P : 2-tt/P;
    return new THREE.Vector3(lerp(x0,x1,k), 1.5, 0);
  }, ()=>{
    const g=new THREE.Group();
    const body=mesh('box',[2.2,1.1,1.6], emat(W7PAL.brass,W7PAL.brassD,0.25)); body.position.y=-0.85; g.add(body);
    const cab=mesh('cyl',[0.8,0.8,1.5,10,1,false,0,Math.PI], mat(W7PAL.steel)); cab.rotation.z=Math.PI/2; cab.rotation.y=Math.PI/2; cab.position.set(-0.3,-0.28,0); g.add(cab);
    const win=mesh('box',[0.5,0.4,0.08], emat(W6PAL.window,W6PAL.window,0.9)); win.position.set(0.45,-0.5,0.82); g.add(win);
    for(const s of [-1,1]) for(const wx of [-0.7,0.7]){ const wh=mesh('cyl',[0.32,0.32,0.18,10], mat(0x2a3048)); wh.rotation.x=Math.PI/2; wh.position.set(wx,-1.42,s*0.75); g.add(wh);
      const hub=mesh('cyl',[0.1,0.1,0.2,6], mat(W7PAL.brassD)); hub.rotation.x=Math.PI/2; hub.position.set(wx,-1.42,s*0.76); g.add(hub); }
    const stack=mesh('cyl',[0.12,0.16,0.7,7], mat(W7PAL.brassD)); stack.position.set(-0.8,0.3,0.4); g.add(stack);
    const roofRail=mesh('box',[2.3,0.06,0.06], mat(W7PAL.brassD)); roofRail.position.set(0,0.18,0.85); g.add(roofRail);
    const roofRail2=roofRail.clone(); roofRail2.position.z=-0.85; g.add(roofRail2);
    const brush=mesh('cyl',[0.42,0.42,1.5,10], emat(0x8a3040,0x5a1a28,0.3)); brush.rotation.x=Math.PI/2; brush.position.set(1.35,-1.15,0); g.add(brush);
    for(let i=0;i<6;i++){ const tuft=mesh('box',[0.5,0.06,0.1], mat(0xc8a24a)); const a=i/6*TAU; tuft.position.set(Math.sin(a)*0.4, Math.cos(a)*0.4, 0); tuft.rotation.z=a; brush.add(tuft); }   // bristle ridges spin WITH the brush
    const lamp=mesh('sph',[0.1,6,5], emat(0xffb85e,0xffb85e,1)); lamp.position.set(1.1,-0.2,0); g.add(lamp);
    g.userData.brush=brush; g.userData.stack=stack;
    return g;
  });
  G.scene.add(mover.mesh);   // fleet-audit fix: addMover builds the mesh but the CALLER owns the scene-add (the invisible-machine bug)
  // brush hazard + chuff + polish gleam (one ticker)
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,3), group:new THREE.Group(), _lastX:x0,
    update(dt, GG){
      this.t+=dt;
      const mp=mover.col.min.x + 1.2;   // machine center x
      const dir = Math.sign(mp - this._lastX) || 1; this._lastX = mp;
      const mesh0=mover.mesh;
      if(mesh0 && mesh0.userData.brush){ mesh0.userData.brush.rotation.z += dir*7*dt;
        mesh0.rotation.y = dir>0 ? 0 : Math.PI; }
      if(Math.random()<dt*3 && mesh0) GG.fx.spawn(new THREE.Vector3(mp-dir*0.8, 2.3, 0.4), 0xdfeaf8, 1, {speed:0.6, life:0.6});   // the chuff
      const pl=GG.player;
      if(pl && !pl.dead){
        const bx=mp+dir*1.35, by=0.35;
        if(Math.abs(pl.pos.x-bx)<0.75 && Math.abs(pl.pos.z)<1.1 && pl.pos.y<by+0.5){ pl.damage(1, new THREE.Vector3(bx,by,0)); }
      }
    } });
  return mover;
}

// =============================== 4) THE ICE-SAW MILL (contraption #2 — track blades + floating cut blocks) ===============================
// w7IceSaw(G, {x0, x1, y, period, phase}): a toothed circular blade shuttling a slot-track — heart-cost contact,
// motion always visible, an emissive rim so it reads across the level. Pure D5 gear DNA, lake industry skin.
function w7IceSaw(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||10, y=opts.y!==undefined?opts.y:0.55, P=opts.period||5, phase=opts.phase||0;
  const slot=mesh('box',[Math.abs(x1-x0)+1.2, 0.06, 0.24], mat(0x2a3048)); slot.position.set((x0+x1)/2, y-0.45, 0); G.scene.add(slot);
  const blade=new THREE.Group();
  const disc=cogMesh(0.75, W7PAL.steel); blade.add(disc);
  const rim=mesh('tor',[0.75,0.05,5,18], emat(0xd8dce8,0x8a8f9a,0.7)); blade.add(rim);
  const hub=mesh('cyl',[0.16,0.16,0.3,8], mat(W7PAL.brassD)); hub.rotation.x=Math.PI/2; blade.add(hub);
  G.scene.add(blade);
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:phase, group:new THREE.Group(),
    update(dt, GG){
      this.t+=dt;
      const tt=this.t%(P*2), k=tt<P?tt/P:2-tt/P;
      const bx=lerp(x0,x1,k);
      blade.position.set(bx, y, 0);
      blade.rotation.z -= 9*dt;
      if(Math.random()<dt*4) GG.fx.spawn(new THREE.Vector3(bx, y-0.5, 0), 0xcfe4f4, 1, {speed:1.4, life:0.3});
      const pl=GG.player;
      if(pl && !pl.dead && Math.abs(pl.pos.x-bx)<0.85 && Math.abs(pl.pos.z)<0.9 && pl.pos.y<y+0.8 && pl.pos.y+1.2>y-0.8){
        pl.damage(1, new THREE.Vector3(bx,y,0));
      }
    } });
}
// a cut ice BLOCK afloat on open water — a bobbing mover platform (the saw mill's product, your road)
function w7FloatBlock(G, x, y, opts={}){
  const w=opts.w||2.2, amp=opts.amp||0.25, per=opts.period||2.6, phase=opts.phase||0;
  const fb = G.world.addMover(w, 0.5, 2.4, (t)=>new THREE.Vector3(x, y + Math.sin((t+phase)*TAU/per)*amp, 0),
    ()=>{ const g=new THREE.Group();
      const b=new THREE.Mesh(geo('box',w,0.5,2.4), new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.2, transparent:true, opacity:0.85}));
      b.position.y=0.25; g.add(b);
      const cap=mesh('box',[w+0.06,0.1,2.5], mat(W6PAL.snow)); cap.position.y=0.52; g.add(cap);
      return g; });
  G.scene.add(fb.mesh);   // fleet-audit fix: the caller owns the scene-add
  return fb;
}

// =============================== 5) THE ROPE-TOW (contraption #3 — ride the T-bars over the deep ice) ===============================
// A frozen ski-tow: two wheel-posts, a looping cable, hanging T-bars that travel the bottom run (stand on the
// seat!), swing up over the far wheel, ride the top run back. No teleports — the loop is continuous, so the
// mover carry stays honest. w7RopeTow(G, {x0, x1, y, n, speed}). Bars are standable platforms.
function w7RopeTow(G, opts={}){
  const x0=opts.x0||0, x1=opts.x1||24, y=opts.y!==undefined?opts.y:2.6, n=opts.n||3, speed=opts.speed||2.4;
  const topY=y+1.9, span=Math.abs(x1-x0), wr=0.7;
  const Pm = 2*span + 2*Math.PI*wr;   // loop perimeter
  // the posts + wheels + cable (baked except the spinning wheels)
  const deco=new THREE.Group();
  for(const px of [x0, x1]){
    const post=mesh('cyl',[0.14,0.2,topY+0.8,7], mat(W7PAL.rope)); post.position.set(px,(topY+0.8)/2,-0.9); deco.add(post);
    const cap2=mesh('sph',[0.24,6,5], mat(W6PAL.snow)); cap2.scale.y=0.5; cap2.position.set(px,topY+0.85,-0.9); deco.add(cap2);
  }
  for(const [cy,zz] of [[y,0],[topY,0]]){ const cable=mesh('cyl',[0.025,0.025,span,4], mat(0x2a3048)); cable.rotation.z=Math.PI/2; cable.position.set((x0+x1)/2, cy+0.65, zz); deco.add(cable); }
  G.scene.add(bakeGroup(deco));
  const wheels=[];
  for(const px of [x0,x1]){ const wh=cogMesh(wr, W7PAL.brassD); wh.position.set(px,(y+topY)/2+0.65,-0.5); G.scene.add(wh); wheels.push(wh); }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt){ this.t+=dt; for(const wh of wheels) wh.rotation.z -= (speed/wr)*dt; } });
  // the bars — movers tracing the loop perimeter (bottom run = the ride; the rest is the return trip)
  const movers=[];
  for(let i=0;i<n;i++){
    const off=(i/n)*Pm;
    movers.push(G.world.addMover(1.3, 0.22, 1.1, (t)=>{
      let s=((t*speed+off)%Pm+Pm)%Pm;
      const cyMid=(y+topY)/2, half=(topY-y)/2;
      if(s<span) return new THREE.Vector3(lerp(x0,x1,s/span), y, 0);                        // bottom run → (the ride)
      s-=span;
      if(s<Math.PI*wr){ const a=-Math.PI/2 + (s/(Math.PI*wr))*Math.PI; return new THREE.Vector3(x1, cyMid+Math.sin(a)*half, 0); }   // far wheel: rise y→topY, continuous
      s-=Math.PI*wr;
      if(s<span) return new THREE.Vector3(lerp(x1,x0,s/span), topY, 0);                     // top run ← (the trip home)
      s-=span;
      { const a=Math.PI/2 + (s/(Math.PI*wr))*Math.PI; return new THREE.Vector3(x0, cyMid+Math.sin(a)*half, 0); }   // near wheel: descend, continuous
    }, ()=>{
      const g=new THREE.Group();
      const hang=mesh('cyl',[0.03,0.03,0.7,4], mat(0x2a3048)); hang.position.y=0.55; g.add(hang);
      const seat=mesh('box',[1.25,0.14,1.0], mat(W7PAL.brass)); seat.position.y=0.12; g.add(seat);
      const grip=mesh('tor',[0.16,0.03,4,10], mat(W7PAL.brassD)); grip.position.y=0.9; g.add(grip);
      const ic=mesh('cone',[0.05,0.22,4], emat(W7PAL.glass,0x4a8ec8,0.4)); ic.rotation.x=Math.PI; ic.position.set(0.4,0.02,0.3); g.add(ic);
      return g; }));
  }
  for(const m of movers) G.scene.add(m.mesh);   // fleet-audit fix: visible T-bars (the caller owns the scene-add)
  return movers;
}

// =============================== 6) THE MILL WHEEL (contraption #4 — ride the paddles around) ===============================
// The fishery's great half-frozen waterwheel, still turning: six level paddles ride a spinning frame like
// ferris gondolas. w7MillWheel(G, {x, y, r, speed}) — climb aboard low, ride high, hop off at the top.
function w7MillWheel(G, opts={}){
  const x=opts.x||0, cy=opts.y!==undefined?opts.y:4.2, r=opts.r||3.4, speed=opts.speed||0.5;
  // the frame (spins as one ticker; spokes + rims + frozen drip)
  const frame=new THREE.Group();
  for(const zz of [-0.9,0.9]){ const rim=mesh('tor',[r,0.09,6,22], mat(W7PAL.brassD)); rim.position.z=zz; frame.add(rim); }
  for(let i=0;i<6;i++){ const a=i/6*TAU; for(const zz of [-0.9,0.9]){ const sp=mesh('box',[0.1,r*2*0.96,0.08], mat(W7PAL.steel)); sp.position.set(0,0,zz); sp.rotation.z=a; frame.add(sp); } }
  const hub=mesh('cyl',[0.4,0.4,2.2,10], mat(W7PAL.brass)); hub.rotation.x=Math.PI/2; frame.add(hub);
  frame.position.set(x,cy,0); G.scene.add(frame);
  const strut=mesh('box',[0.24,cy,0.24], mat(W7PAL.rope)); strut.position.set(x+r*0.9, cy/2, -1.1); G.scene.add(strut);
  for(let i=0;i<5;i++){ const ic=mesh('cone',[0.06,rand(0.3,0.6),4], emat(W7PAL.glass,0x4a8ec8,0.4)); ic.rotation.x=Math.PI; ic.position.set(x+rand(-r,r)*0.5, cy-r-0.2, rand(-0.8,0.8)); G.scene.add(ic); }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt){ frame.rotation.z += speed*dt; } });
  // the six paddle-gondolas: level movers on the wheel's circle (deterministic — same clock as the frame)
  const movers=[];
  for(let i=0;i<6;i++){
    movers.push(G.world.addMover(1.7, 0.22, 1.6, (t)=>{
      const a=t*speed + i/6*TAU;
      return new THREE.Vector3(x+Math.cos(a)*r, cy+Math.sin(a)*r-0.11, 0);
    }, ()=>{ const g=new THREE.Group();
      const p=mesh('box',[1.65,0.2,1.5], mat(W7PAL.brass)); p.position.y=0.1; g.add(p);
      const lip=mesh('box',[1.7,0.08,0.1], mat(W7PAL.brassD)); lip.position.set(0,0.26,0.75); g.add(lip);
      const snow2=mesh('box',[1.5,0.08,1.3], mat(W6PAL.snow)); snow2.position.y=0.28; g.add(snow2);
      return g; }));
  }
  for(const m of movers) G.scene.add(m.mesh);   // fleet-audit fix: visible gondola paddles (the caller owns the scene-add)
  return movers;
}

// =============================== 7) THE FISHER'S HUT — w7's gamble container ===============================
// A dark ice-fishing hut, stove-warm light leaking under the door, the gamble's red pulse in its window.
// Same table (8/24/38/30), CLEAR-PATCH, 1s grace — the ambush is FOUR PANICKED POLAR CUBS bowling out the door.
class FisherHut {
  constructor(x, y, z, ry=0){
    this.group=new THREE.Group();
    const wood=mat(0x5a4a38), woodD=mat(0x3c3024);
    const body=mesh('box',[2.0,1.9,1.7], wood); body.position.y=0.95; crook(body,0.05); this.group.add(body);
    const roof=mesh('cone',[1.8,1.0,4], woodD); roof.position.y=2.35; roof.rotation.y=Math.PI/4; this.group.add(roof);
    const cap=mesh('cone',[1.82,0.4,4], mat(W6PAL.pineSnow)); cap.position.y=2.7; cap.rotation.y=Math.PI/4; this.group.add(cap);
    const pipe=mesh('cyl',[0.09,0.09,0.8,6], mat(0x2a3048)); pipe.position.set(0.6,2.7,0); pipe.rotation.z=0.08; this.group.add(pipe);
    const door=mesh('box',[0.7,1.3,0.1], woodD); door.position.set(0,0.65,0.88); this.group.add(door);
    this.doorGlow=mesh('box',[0.74,0.1,0.12], emat(0xffc87a,0xffb85e,0.9)); this.doorGlow.position.set(0,0.06,0.9); this.group.add(this.doorGlow);
    this.win=mesh('box',[0.44,0.44,0.1], emat(0xff4a5a,0xff2a3a,0.7)); this.win.position.set(-0.55,1.25,0.88); this.group.add(this.win);   // the gamble pulse
    this.glow=new THREE.PointLight(0xff7a6a, 11, 6.5); this.glow.position.set(0,1.4,0.6); this.group.add(this.glow);
    const rod=mesh('cyl',[0.02,0.03,1.4,4], mat(0x6a4a34)); rod.position.set(1.15,0.7,0.3); rod.rotation.z=-0.5; this.group.add(rod);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🎣 Knock on the fisher\'s hut...?';
  }
  update(dt, G){
    this.t+=dt;
    if(!this.opened){
      this.win.material.emissiveIntensity=0.5+Math.abs(Math.sin(this.t*2.6))*0.5;
      this.glow.intensity=8+Math.sin(this.t*2.2)*4;
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.win.material.emissiveIntensity=damp(this.win.material.emissiveIntensity,0.1,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened=true;
    const p=this.group.position;
    AUDIO.tone && AUDIO.tone({f:180,f2:80,type:'triangle',t:0.35,vol:0.16});
    G.camc.shake(0.12,0.3);
    const scene=G.scene;
    setTimeout(()=>{
      if(G.scene!==scene) return;
      const r=Math.random();
      if(r<0.08){
        G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('🎣👻 A GHOSTLY 1-UP was warming its hands in there! Lives: '+G.save.lives);
      } else if(r<0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1,p.y+1.0,0)); G.ents.add(new PowerUp(p.x+1.2,p.y+1.2,0, pick(['shield','moon','bat'])));
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('🎣✨ JACKPOT! The fisher\'s whole winter haul — candy, a heart, AND a treasure!');
      } else if(r<0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('🎣 A few candies... and one very old sandwich. You leave the sandwich.');
      } else {
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.35,0.4);
        const offs=[-2.8,-1.5,1.5,2.8];
        for(let i=0;i<offs.length;i++){
          const c=new PolarCub(G, p.x+offs[i], p.y, 0, {x1:p.x+offs[i]+(offs[i]>0?11:-11), phase:i*0.4, speed:4.0});
          c.spawnGrace=1.0; G.ents.add(c);
        }
        G.fx.spawn(new THREE.Vector3(p.x,p.y+0.6,p.z+1.2), 0xf2f0e8, 20, {speed:4});
        window.UI && UI.toast('🎣🐻 CUBS!! The hut was FULL of napping polar cubs — and now they\'re rolling!!');
      }
    }, 650);
  }
}

// =============================== 8) THE FROZEN BELL-BUOY — w7's Old Shortcut warp ===============================
// A harbor bell-buoy locked in the ice, under a lone PURPLE lantern (the warp language). Ring its two bells
// PORT → STARBOARD → PORT (spin beside each in order) and the old channel remembers itself. Wrong order resets.
class BellBuoy {
  constructor(G, x, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this.x=x; this.warpX=opts.warpX!==undefined?opts.warpX:x+8; this.candy=opts.candy||40; this.used=false;
    this.seq=0; this._hitWas=false;
    this.group=new THREE.Group();
    const base=mesh('cyl',[1.0,1.3,0.8,10], mat(W7PAL.buoy)); base.position.set(x,0.4,0); this.group.add(base);
    const stripe=mesh('cyl',[1.05,1.05,0.24,10], mat(0xf0e6c8)); stripe.position.set(x,0.55,0); this.group.add(stripe);
    const mast=mesh('cyl',[0.07,0.09,2.2,6], mat(0x2a3048)); mast.position.set(x,1.9,0); this.group.add(mast);
    const cross=mesh('box',[1.8,0.09,0.09], mat(0x2a3048)); cross.position.set(x,2.5,0); this.group.add(cross);
    this.bells=[];
    for(const s of [-1,1]){ const bell=mesh('cone',[0.24,0.4,9], emat(W7PAL.brass,W7PAL.brassD,0.4)); bell.position.set(x+s*0.8,2.28,0); this.group.add(bell); this.bells.push(bell); }
    // frozen in — a collar of ice slabs
    for(let i=0;i<5;i++){ const a=i/5*TAU; const sl=new THREE.Mesh(geo('box',rand(0.5,0.9),0.3,0.5), new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.7})); sl.position.set(x+Math.cos(a)*1.3,0.12,Math.sin(a)*0.9); sl.rotation.y=a; this.group.add(sl); }
    this.tell=mesh('sph',[0.18,8,7], emat(0x9a5fd0,0x9a5fd0,1)); this.tell.position.set(x,3.3,0); this.group.add(this.tell);
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    this.tell.scale.setScalar(1+Math.sin(this.t*3)*0.25);
    if(this.used) return;
    const pl=G.player;
    if(!pl || pl.dead) return;
    const hitting = pl.attackT>0 || pl.pounding;
    if(hitting && !this._hitWas){
      const want=[-1,1,-1][this.seq];   // port → starboard → port
      const side=Math.sign(pl.pos.x-this.x)||-1;
      if(Math.abs(pl.pos.x-this.x)<2.0 && Math.abs(pl.pos.z)<1.8){
        const bell=this.bells[side<0?0:1];
        bell.rotation.z = side*0.5;
        if(side===want){ this.seq++;
          AUDIO.tone && AUDIO.tone({f:this.seq===1?880:this.seq===2?1046:1318, f2:600, type:'sine', t:0.4, vol:0.16});
          G.fx.spawn(new THREE.Vector3(this.x+side*0.8,2.3,0), W7PAL.brass, 8, {speed:2});
          if(this.seq>=3) this._open(G);
          else window.UI && UI.toast(this.seq===1 ? '🔔 The port bell rings true... now the other side.' : '🔔 Starboard answers... once more to port!');
        } else if(this.seq>0){ this.seq=0;
          AUDIO.noise && AUDIO.noise({t:0.2,vol:0.1,fFrom:300,fTo:120});
          window.UI && UI.toast('🔔 The bells fall out of tune. Port first, sailor.'); }
      }
    }
    this._hitWas=hitting;
    this.bells.forEach(b=>{ b.rotation.z=damp(b.rotation.z,0,6,dt); });
  }
  _open(G){
    this.used=true;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin(); G.camc.shake(0.4,0.5);
    G.fx.spawn(new THREE.Vector3(this.x,2.4,0), 0x9a5fd0, 30, {speed:6, life:1});
    window.UI && UI.toast('🔔✨ THE OLD CHANNEL! The lake remembers the way — off you go!');
    G.addCandy(this.candy);
    G.persist && G.persist();
    G._warpUsed = true;
    const pl=G.player; pl.pos.set(this.warpX, 2, 0); pl.vel.set(0,0,0);
    window.UI && UI.updateHUD();
  }
}

// =============================== 9) LEVEL REGISTRY + CLUTTER ===============================
const W7_LEVELS = [];
LEVEL_LISTS.push(W7_LEVELS);

function w7Clutter(G, x1, x2, theme='lake'){
  const g=new THREE.Group();
  const n=Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.2){ const ridge=mesh('box',[rand(0.4,0.9),rand(0.15,0.4),0.3], new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.8})); ridge.position.set(x,0.12,z); ridge.rotation.set(rand(-0.3,0.3),rand(TAU),rand(-0.4,0.4)); g.add(ridge); }
    else if(r<0.36){ const lump=mesh('sph',[rand(0.2,0.45),6,5], mat(W6PAL.snow)); lump.scale.y=0.4; lump.position.set(x,0.06,z); g.add(lump); }
    else if(r<0.5){ const coil=mesh('tor',[rand(0.15,0.25),0.05,5,10], mat(W7PAL.rope)); coil.rotation.x=Math.PI/2; coil.position.set(x,0.05,z); g.add(coil); }
    else if(r<0.62){ const fish=mesh('sph',[0.12,6,5], emat(0x8ab4d0,0x4a7a9a,0.3)); fish.scale.set(1.6,0.6,0.5); fish.position.set(x,0.08,z); fish.rotation.y=rand(TAU); g.add(fish);
      const tail2=mesh('cone',[0.07,0.14,4], mat(0x6a94b0)); tail2.position.set(x-0.22,0.08,z); tail2.rotation.z=Math.PI/2; g.add(tail2); }   // a frozen fish, mid-flop, forever
    else if(r<0.74){ const bucket=mesh('cyl',[0.14,0.11,0.22,8], mat(W7PAL.steel)); bucket.position.set(x,0.11,z); crook(bucket,0.1); g.add(bucket); }
    else if(r<0.86){ const shard=mesh('cone',[rand(0.06,0.12),rand(0.2,0.5),5], emat(W7PAL.glass,0x4a8ec8,0.4)); shard.position.set(x,0.12,z); shard.rotation.z=rand(-0.4,0.4); g.add(shard); }
    else { const rod2=mesh('cyl',[0.02,0.025,rand(0.8,1.2),4], mat(0x6a4a34)); rod2.position.set(x,0.3,z); rod2.rotation.z=rand(-1.2,1.2); g.add(rod2); }
  }
  G.scene.add(bakeGroup(g));
}

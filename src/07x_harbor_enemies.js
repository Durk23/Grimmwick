// ============ GHOST HARBOR ROSTER — District 4 enemies (Boo Buccaneer, Barrel Mimic, Cannon Crab + Shell, Rigging Wraith) ============
// Extends the Enemy base in 07_enemies.js. Same contract: isEnemy/hitR/headH/hitY/touchDamage/touchR, update(dt)
// calls touchPlayer + updateShadow, inherit takeHit/die (kinds 'swing'/'stomp'/'pound'/'moon'/'salt'). Register via
// G.ents.add; the player's stomp/spin/pound/salt detection then works automatically. DETERMINISTIC: gameplay runs off
// fixed clocks (this.t from opts.phase, fixed cannon/tide/wire clocks) and patrol-edge reversals — NO Math.random on the
// critical path. The base Enemy seeds this.t=rand(0,10), so every class OVERRIDES this.t; rand() is COSMETIC-ONLY jitter.
// EMISSIVE-LIFTED bodies + bright eyes so pirates/crabs/wraiths POP against the dried teal-grey harbor. Colour language:
// ghost-crew read GHOST-GREEN, cannon/brass reads VERDIGRIS, the danger fuse-spark reads HOT-ORANGE, rope reads HEMP.

// ---- Boo Buccaneer: a ghost pirate. THE TWIST on the stare rule: facing it makes it WINK and keep creeping, just
// SLOWER — the harbor's ghosts are bolder, they never fully freeze. Stompable (hp1). Teaches the stare→slow read that
// the Captain Wraith boss pays off (there, a full stare-lock). Chases on the lane; a tap-stomp pops it. ----
class BooBuccaneer extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.speed = opts.speed||2.4;
    this.slowMul = opts.slowMul!==undefined?opts.slowMul:0.42;   // still creeps when stared at (not 0 like a shy Boo)
    this.range = opts.range||12;
    this.hitR=0.55; this.headH=1.1; this.hitY=0.5; this.touchR=0.72; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    const bodyM = new THREE.MeshLambertMaterial({color:0x8fd8c0, emissive:0x2c6a58, emissiveIntensity:0.55, transparent:true, opacity:0.9});
    this.bodyMesh = new THREE.Mesh(geo('sph',0.5,10,9), bodyM); this.bodyMesh.position.y=0.75; this.bodyMesh.scale.set(1,1.1,1);
    const tail = new THREE.Mesh(geo('cone',0.42,0.6,8), bodyM); tail.position.y=0.28; tail.rotation.x=Math.PI;
    this.eyeL = mesh('sph',[0.09,6,6], mat(0x10201c)); this.eyeL.position.set(-0.17,0.85,0.42);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.17;
    // pirate bandana (red) + a little skull knot, and a verdigris cutlass
    const band = mesh('box',[0.86,0.2,0.86], emat(0xc0392b,0x7a2018,0.5)); band.position.set(0,1.02,0); band.scale.set(1.02,1,1.02);
    const knot = mesh('sph',[0.1,6,5], mat(0x8a2418)); knot.position.set(0.42,1.02,-0.34);
    this.cutlass = mesh('box',[0.06,0.62,0.02], emat(0x9fead0,0x4a9a80,0.5)); this.cutlass.position.set(0.55,0.7,0.2); this.cutlass.rotation.z=-0.5;
    this.armL = new THREE.Mesh(geo('sph',0.12,6,6), bodyM); this.armL.position.set(-0.5,0.7,0);
    this.armR = new THREE.Mesh(geo('sph',0.12,6,6), bodyM); this.armR.position.set(0.5,0.7,0);
    this.group.add(this.bodyMesh, tail, this.eyeL, this.eyeR, band, knot, this.cutlass, this.armL, this.armR);
    G.scene.add(this.group);
    this.stared=false;
  }
  update(dt){
    this.t += dt;
    const pl = this.G.player, p = this.group.position;
    p.y = this.home.y + Math.sin(this.t*2.4)*0.16 + 0.35;
    if(pl && !pl.dead){
      const dx = pl.pos.x-p.x, dz = pl.pos.z-p.z, d = Math.hypot(dx,dz)||1;
      if(d < this.range){
        const pfx = Math.sin(pl.facing), pfz = Math.cos(pl.facing);
        const dirX = (p.x-pl.pos.x)/d, dirZ = (p.z-pl.pos.z)/d;
        const face = pfx*dirX + pfz*dirZ;
        const wasStared = this.stared;
        this.stared = face > 0.25;
        if(this.stared && !wasStared && d<9) AUDIO.ghostGiggle();   // *wink*
        // BOLDER than a shy Boo: keeps creeping when stared at, just slowed
        if(d>1.1){
          const mul = this.stared ? this.slowMul : 1;
          p.x += dirX*-1*this.speed*mul*dt;   // dirX points boo→player already? dirX=(p.x-pl.x)/d → boo-to-player is -dir; move toward player = -dirX
          p.z += dirZ*-1*this.speed*mul*dt;
          this.group.rotation.y = Math.atan2(pl.pos.x-p.x, pl.pos.z-p.z);
        }
      } else this.stared=false;
    }
    // wink: one eye squints when stared at; cutlass raises when charging free
    this.eyeL.scale.y = damp(this.eyeL.scale.y, this.stared?0.3:1, 12, dt);
    this.cutlass.rotation.z = damp(this.cutlass.rotation.z, this.stared?-0.2:-0.6, 8, dt);
    this.bodyMesh.material.opacity = this.stared?0.62:0.9;
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- Barrel Mimic: a deck barrel that sits INERT (a harmless-looking prop) until the player comes close, then it
// RATTLES (telegraph), sprouts teeth, and LUNGES once toward the player before reverting to inert. Trust no prop on a
// haunted ship. Stompable anytime (hp1). Only bites during the lunge — the inert barrel is safe to stand near, so the
// hit is always earned by the telegraph you ignored, never a cheap ambush. Deterministic: purely player-proximity driven. ----
class BarrelMimic extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=0.9; this.hitY=0.45; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    this.groundY=y; this.wakeR=opts.wakeR||3.2; this.lungeSpeed=opts.lungeSpeed||7.2; this.dir=opts.dir||-1;
    this.state='inert'; this.st=0; this.touchDamage=0;   // inert = harmless prop
    const woodM=emat(0x6a5236,0x3f3120,0.35), bandM=emat(0x3a2c1c,0x241a10,0.4);
    this.bodyG = new THREE.Group();
    const barrel = mesh('cyl',[0.42,0.42,0.9,10], woodM); barrel.position.y=0.5; barrel.scale.set(1,1,0.86); this.bodyG.add(barrel);
    for(const by of [0.2,0.5,0.8]){ const b=mesh('cyl',[0.45,0.45,0.07,10], bandM); b.position.y=by; b.scale.set(1,1,0.86); this.bodyG.add(b); }
    // hidden teeth + eyes (revealed on wake)
    this.mouth = new THREE.Group();
    for(let i=0;i<5;i++){ const t=mesh('cone',[0.05,0.16,4], mat(0xf2ead6)); t.position.set(-0.28+i*0.14,0.62,0.4); this.mouth.add(t); }
    this.eyeL=mesh('sph',[0.07,6,6], emat(0xffca3a,0xffca3a,1)); this.eyeL.position.set(-0.14,0.82,0.36);
    this.eyeR=this.eyeL.clone(); this.eyeR.position.x=0.14; this.mouth.add(this.eyeL,this.eyeR);
    this.mouth.visible=false; this.bodyG.add(this.mouth);
    this.group.add(this.bodyG); G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    if(this.state==='inert'){
      this.touchDamage=0; this.mouth.visible=false;
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<2 && pl.pos.y<p.y+1.4){
        this.state='rattle'; this.st=0; this.dir=(pl.pos.x<p.x)?-1:1;
        AUDIO.noise && AUDIO.noise({t:0.2,vol:0.16,fFrom:600,fTo:1100});   // the RATTLE = the tell
      }
    } else if(this.state==='rattle'){
      this.bodyG.rotation.z=Math.sin(this.st*40)*0.12;   // shudder in place (~0.45s telegraph)
      this.mouth.visible=true;
      if(this.st>0.45){ this.state='lunge'; this.st=0; this.bodyG.rotation.z=0; this.touchDamage=1; }
    } else if(this.state==='lunge'){
      p.x += this.dir*this.lungeSpeed*dt;
      this.bodyG.rotation.z = -this.dir*Math.min(this.st*3,0.5);   // tips into the charge
      if(this.st>0.42){ this.state='recover'; this.st=0; }
    } else { // recover — teeth retract, back to a harmless prop
      this.touchDamage=0;
      this.bodyG.rotation.z = damp(this.bodyG.rotation.z, 0, 8, dt);
      if(this.st>0.9){ this.state='inert'; this.st=0; }
    }
    this.eyeL.scale.setScalar(this.state==='inert'?0.01:1);
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- Cannon Crab: a crab in barnacled cannon-shell armor that lobs an arcing CrabShell on a FIXED clock. A fuse-spark
// brightens ~0.7s before each lob (the telegraph); the shell arcs onto the lane and bursts. Armored hp2 (a spin/stomp
// chips, a pound one-shots). Scuttles slowly on a short patrol. Firing is GATED to player proximity so it never lobs
// offscreen. Deterministic cast grid (nextFire += period from a fixed phase). ----
class CannonCrab extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hp = 2; this.hitR=0.6; this.headH=0.7; this.hitY=0.3; this.touchR=0.74; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    this.groundY=y; this.range=opts.range||2.4; this.dir=opts.dir||1; this.speed=opts.speed||1.6;
    this.period=opts.period||3.2; this.tele=opts.tele||0.7; this.firstFire=opts.firstFire!==undefined?opts.firstFire:1.4;
    this.nextFire=this.firstFire; this.aggroX=opts.aggroX||26; this.shellSpeed=opts.shellSpeed||opts.batSpeed||0;
    const shellM=emat(0x3f6b52,0x244032,0.4), brassM=emat(0x8a7b3a,0x5a4f20,0.45);
    // cannon-shell carapace
    const shell = mesh('sph',[0.6,12,10], shellM); shell.position.y=0.55; shell.scale.set(1.15,0.8,1); this.group.add(shell);
    for(let i=0;i<5;i++){ const bar=mesh('sph',[0.09,6,5], mat(0x557a63)); const a=rand(TAU); bar.position.set(Math.cos(a)*0.4,0.6+rand(0,0.2),Math.sin(a)*0.35); this.group.add(bar); }   // barnacles (cosmetic)
    // the muzzle (points up-forward) + the fuse spark
    this.muzzle = mesh('cyl',[0.16,0.2,0.5,10], brassM); this.muzzle.position.set(0.25,0.85,0); this.muzzle.rotation.z=-0.7; this.group.add(this.muzzle);
    this.fuse = mesh('sph',[0.1,7,6], emat(0xffca3a,0xffca3a,1)); this.fuse.position.set(0.4,1.05,0); this.fuse.scale.setScalar(0.01); this.group.add(this.fuse);
    // crab eyes on stalks + little legs
    for(const ex of [-0.16,0.16]){ const st=mesh('cyl',[0.03,0.03,0.24,4], shellM); st.position.set(ex,0.9,0.3); this.group.add(st); const ey=mesh('sph',[0.08,6,6], emat(0xffe14d,0xffe14d,1)); ey.position.set(ex,1.04,0.3); this.group.add(ey); }
    this.legs=[]; for(let s=-1;s<=1;s+=2) for(let i=0;i<3;i++){ const lg=mesh('cyl',[0.03,0.03,0.34,4], mat(0x3a5a48)); lg.position.set(s*0.5,0.28,-0.2+i*0.2); lg.rotation.z=s*0.7; this.legs.push(lg); this.group.add(lg); }
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player, p=this.group.position;
    this.legs.forEach((l,i)=>{ l.rotation.x=Math.sin(this.t*12+i)*0.35; });
    // short scuttle patrol
    p.x += this.speed*this.dir*dt;
    if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; }
    else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; }
    // fixed-clock lob, gated to player proximity (never fires offscreen)
    const near = pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.aggroX;
    const untilFire = this.nextFire - this.t;
    this.fuse.scale.setScalar(near && untilFire<this.tele && untilFire>0 ? 0.6+Math.sin(this.t*30)*0.4 : 0.01);   // spark up in the telegraph window
    if(this.t>=this.nextFire){
      this.nextFire += this.period;
      if(near){
        const tx = pl.pos.x;   // snapshot — move and the arc lands where you WERE
        this.G.ents.add(new CrabShell(this.G, p.x+0.3, p.y+1.0, 0, {targetX:tx, targetY:this.groundY}));
        AUDIO.noise && AUDIO.noise({t:0.16,vol:0.16,fFrom:900,fTo:300});
        this.muzzle.rotation.z=-1.0;
      }
    }
    this.muzzle.rotation.z = damp(this.muzzle.rotation.z, -0.7, 8, dt);
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- CrabShell: the Cannon Crab's arcing projectile. A verdigris cannonball on a fixed parabola to a snapshot of the
// player's x; bursts on landing (small telegraphed splash) then despawns. Damages on contact; a spin/stomp/salt pops it
// harmlessly (clean poof, NOT an enemy kill — no candy). cull:false so it always completes its short flight. ----
class CrabShell extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.G.scene.remove(this.shadow); this.shadow = blobShadow(0.4); G.scene.add(this.shadow);
    this.cull=false; this.candyDrop=0; this.touchDamage=1; this.touchR=0.44; this.hitR=0.4; this.headH=0.6; this.hitY=0.3;
    const tx=opts.targetX!==undefined?opts.targetX:x+4, ty=opts.targetY!==undefined?opts.targetY:0;
    const flight=opts.flight||0.9;
    this.vx=(tx-x)/flight; this.landY=ty; this.vy=(ty-y)/flight + 0.5*22*flight;   // solve for vy so it lands at ty in `flight`s under g=22
    this.life=flight+0.4; this.st=0; this.landed=false;
    const ball=mesh('sph',[0.28,10,9], emat(0x2f6b52,0x163c2a,0.5)); ball.position.y=0; this.ballMesh=ball;
    this.fuse=mesh('sph',[0.07,6,5], emat(0xffca3a,0xff8a2a,1)); this.fuse.position.set(0,0.28,0);
    this.group.add(ball,this.fuse); G.scene.add(this.group);
  }
  _poof(noCandy){ if(this.dead) return; this.dead=true; const p=this.group.position;
    this.G.fx.spawn(new THREE.Vector3(p.x,p.y,0), 0x9fead0, 12, {speed:3, life:0.4}); this.G.scene.remove(this.shadow); }
  takeHit(player, kind){ this._poof(true); }   // popped in the air — harmless, no candy
  die(){ this._poof(true); }
  update(dt){
    this.st+=dt; const p=this.group.position;
    if(!this.landed){
      this.vy -= 22*dt; p.x += this.vx*dt; p.y += this.vy*dt;
      this.ballMesh.rotation.x += dt*10;
      if(p.y<=this.landY){ p.y=this.landY; this.landed=true; this.st=0;
        this.G.fx.spawn(new THREE.Vector3(p.x,this.landY+0.1,0), 0x9fead0, 14, {speed:3.4, life:0.4});
        this.G.camc && this.G.camc.shake(0.12,0.2); AUDIO.noise && AUDIO.noise({t:0.14,vol:0.12,fFrom:400,fTo:120});
      }
    } else { this.fuse.visible=false; if(this.st>0.35) this._poof(true); }   // brief ground-burst window, then gone
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- Rigging Wraith: a specter that travels ONLY along a rope/rigging span — a zipline predator sliding x1↔x2 at
// rigging height on a FIXED clock. When the player passes BENEATH it, it SWOOPS down on a telegraph, then climbs back
// to its wire. It can never leave the wire (its x is a pure function of the shared clock). Spin/stomp on the pass; hp1.
// The one district-unique threat: it owns the airspace over the deck fight without ever touching the ground. ----
class RiggingWraith extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=1.4; this.hitY=0.7; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    this.wireY=y; this.x1=opts.x1!==undefined?opts.x1:x-4; this.x2=opts.x2!==undefined?opts.x2:x+4;
    this.period=opts.period||5; this.swoopDrop=opts.swoopDrop||2.6; this.tele=opts.tele||0.5; this.cool=0;
    this.state='ride'; this.st=0;
    const bodyM=new THREE.MeshLambertMaterial({color:0x7fc8b4, emissive:0x255a4a, emissiveIntensity:0.6, transparent:true, opacity:0.82});
    this.body=new THREE.Mesh(geo('sph',0.42,10,9), bodyM); this.body.scale.set(1,1.3,0.9); this.body.position.y=0; this.group.add(this.body);
    // tattered shroud tail
    for(let i=0;i<4;i++){ const rag=new THREE.Mesh(geo('cone',0.13,0.5,5), bodyM); rag.position.set(-0.24+i*0.16,-0.5,0); rag.rotation.x=Math.PI; this.ragI=this.ragI||[]; this.ragI.push(rag); this.group.add(rag); }
    this.eyeL=mesh('sph',[0.08,6,6], emat(0xffe14d,0xff8a2a,1)); this.eyeL.position.set(-0.15,0.12,0.34);
    this.eyeR=this.eyeL.clone(); this.eyeR.position.x=0.15; this.group.add(this.eyeL,this.eyeR);
    // a spectral hand-hook riding the wire
    this.hook=mesh('tor',[0.12,0.03,4,8, Math.PI], mat(0x9fb8b0)); this.hook.position.y=0.5; this.group.add(this.hook);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt; if(this.cool>0) this.cool-=dt;
    const pl=this.G.player, p=this.group.position;
    // ride the wire — x is a pure fn of the clock (deterministic, confined)
    const u=0.5+0.5*Math.sin(this.t*(TAU/this.period));
    p.x = this.x1+(this.x2-this.x1)*u;
    if(this.ragI) this.ragI.forEach((r,i)=>{ r.rotation.z=Math.sin(this.t*8+i)*0.3; });
    if(this.state==='ride'){
      p.y = damp(p.y, this.wireY, 8, dt);
      this.group.rotation.y = (Math.cos(this.t*(TAU/this.period))>=0)?Math.PI/2:-Math.PI/2;
      if(this.cool<=0 && pl && !pl.dead && Math.abs(pl.pos.x-p.x)<1.5 && pl.pos.y < this.wireY-1){
        this.state='telegraph'; this.st=0; AUDIO.noise && AUDIO.noise({t:0.16,vol:0.18,fFrom:1400,fTo:700});
      }
    } else if(this.state==='telegraph'){
      p.y += Math.sin(this.st*32)*0.03;
      if(this.st>this.tele){ this.state='swoop'; this.st=0; }
    } else if(this.state==='swoop'){
      const u2=Math.min(this.st/0.4,1);
      p.y = this.wireY - Math.sin(u2*Math.PI)*this.swoopDrop;   // dip down and back up along the wire
      if(u2>=1){ this.state='ride'; this.st=0; this.cool=1.4; }
    }
    this.touchPlayer(dt); this.updateShadow();
  }
}

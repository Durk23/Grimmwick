// ============ RAVENMOOR ROSTER — District 2 enemies (Wisp, Gravemite, DiveCrow, CoffinHopper, LostTourGroup) ============
// Extends the Enemy base in 07_enemies.js. Same contract: isEnemy/hitR/headH/hitY/touchDamage/touchR,
// update(dt) calls touchPlayer + updateShadow, inherit takeHit/die. DETERMINISTIC (seeded rand for cosmetic
// jitter only; fixed clocks/phases drive gameplay). EMISSIVE-LIFTED bodies so everything READS in the dark catacombs.

// The darkness mechanic's tool: levels push {x,z,r} pools onto G.lightPools when a lantern is lit.
// Empty/undefined = dark everywhere (the default). Player is "in the light" inside any pool.
function playerLit(G){
  const pl = G.player; if(!pl || pl.dead) return false;
  const pools = G.lightPools;
  if(!pools || !pools.length) return false;
  for(const L of pools){
    const dx = pl.pos.x-L.x, dz = pl.pos.z-L.z, r = L.r||5;
    if(dx*dx+dz*dz < r*r) return true;
  }
  return false;
}

// ---- Wisp: will-o-wisp — IS a light source; hunts you in the dark, recoils in the light or when stared at ----
// DARK + not-faced → drifts toward you, glow-pulse TELEGRAPH (~0.5s), then a short fixed LUNGE. Never homing-fast.
class Wisp extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.baseY = y;
    this.hitR=0.5; this.headH=0.85; this.hitY=0.5; this.touchR=0.62;
    this.candyDrop=2;
    this.driftSpeed = opts.speed||1.4;      // slow — a menace you can out-walk
    this.lungeDist  = opts.lunge||3.2;       // fixed lunge reach
    this.wakeR = opts.range||9;              // won't stalk from beyond this
    this.state='stalk'; this.st=0; this._glow=0.6;
    this.lungeFrom={x:x,z:z}; this.lungeTo={x:x,z:z};
    const CY = opts.color||0x8fffe0, HALO = opts.halo||0x4dffc0;
    // own (un-cached) materials so per-instance pulsing doesn't bleed across wisps
    this.coreMat = new THREE.MeshBasicMaterial({color:CY, transparent:true, opacity:0.9});
    this.core = new THREE.Mesh(geo('sph',0.32,12,10), this.coreMat); this.core.position.y=0.55;
    this.haloMat = new THREE.MeshBasicMaterial({color:HALO, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false});
    this.halo = new THREE.Mesh(geo('sph',0.6,12,10), this.haloMat); this.halo.position.y=0.55;
    this.flames=[];
    for(let i=0;i<3;i++){
      const f = new THREE.Mesh(geo('cone',0.13,0.4,6), new THREE.MeshBasicMaterial({color:CY, transparent:true, opacity:0.7}));
      f.position.set(0,0.24-i*0.13,0); f.rotation.x=Math.PI; f.scale.setScalar(1-i*0.22);
      this.flames.push(f);
    }
    const eM = mat(0x0e2a24);
    const eL = mesh('sph',[0.05,6,6], eM); eL.position.set(-0.1,0.6,0.26);
    const eR = eL.clone(); eR.position.x=0.1;
    this.group.add(this.core, this.halo, eL, eR, ...this.flames);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const p=this.group.position, pl=this.G.player;
    const bob = Math.sin(this.t*2.2)*0.14;
    this.group.rotation.y = this.t*0.8;
    this.flames.forEach((f,i)=>{ f.scale.y=(1-i*0.22)*(0.8+Math.sin(this.t*12+i)*0.25); });
    // repelled if the player is in a light pool OR facing me from close range
    let facingMe=false, d=99;
    if(pl && !pl.dead){
      const dx=p.x-pl.pos.x, dz=p.z-pl.pos.z; d=Math.hypot(dx,dz)||1;
      const pfx=Math.sin(pl.facing), pfz=Math.cos(pl.facing);
      facingMe = (pfx*(dx/d)+pfz*(dz/d))>0.55 && d<5.5;
    }
    // recoil if the player is lit, is facing me, OR I myself have drifted into a light pool (the flavor: wisps shrink from light)
    let inLight=false; const pools=this.G.lightPools;
    if(pools) for(const L of pools){ const lx=p.x-L.x, lz=p.z-L.z, r=(L.r||5); if(lx*lx+lz*lz<r*r){ inLight=true; break; } }
    const repelled = playerLit(this.G) || facingMe || inLight;
    if(repelled && this.state!=='dormant'){ this.state='dormant'; this.st=0; }

    if(this.state==='dormant'){
      this._glow = damp(this._glow, 0.32, 6, dt);
      p.x = damp(p.x, this.home.x, 2.2, dt);
      p.z = damp(p.z, this.home.z, 2.2, dt);
      p.y = damp(p.y, this.baseY+bob, 3, dt);
      if(!repelled && this._glow<0.45){ this.state='stalk'; this.st=0; }   // re-kindle once safe & dark
    } else if(this.state==='stalk'){
      this._glow = damp(this._glow, 0.7, 4, dt);
      if(pl && !pl.dead && d<this.wakeR){
        p.x += (pl.pos.x-p.x)/d*this.driftSpeed*dt;
        p.z += (pl.pos.z-p.z)/d*this.driftSpeed*dt;
      }
      p.y = damp(p.y, this.baseY+0.4+bob, 3, dt);
      if(d<4.5 && this.st>1.2){ this.state='telegraph'; this.st=0; }        // close enough → wind up
    } else if(this.state==='telegraph'){
      this._glow = damp(this._glow, 1.4, 10, dt);                          // BRIGHTEN + swell = the tell
      p.y += Math.sin(this.st*36)*0.02;
      if(this.st>=0.5){
        this.state='lunge'; this.st=0;
        const dx=pl?pl.pos.x-p.x:0, dz=pl?pl.pos.z-p.z:0, dd=Math.hypot(dx,dz)||1;
        this.lungeFrom={x:p.x,z:p.z};
        this.lungeTo={x:p.x+dx/dd*this.lungeDist, z:p.z+dz/dd*this.lungeDist}; // snapshot — a sidestep beats it
      }
    } else if(this.state==='lunge'){
      const u=Math.min(this.st/0.3,1);
      p.x = this.lungeFrom.x+(this.lungeTo.x-this.lungeFrom.x)*u;
      p.z = this.lungeFrom.z+(this.lungeTo.z-this.lungeFrom.z)*u;
      p.y = this.baseY+0.4+bob;
      this._glow = damp(this._glow, 0.85, 8, dt);
      if(u>=1){ this.state='recover'; this.st=0; }
    } else { // recover
      this._glow = damp(this._glow, 0.6, 5, dt);
      if(this.st>0.8) this.state='stalk';
    }
    // glow → visuals
    const g=this._glow;
    this.core.scale.setScalar(0.85+g*0.3); this.coreMat.opacity = 0.5+g*0.5;
    this.halo.scale.setScalar(0.7+g*0.95); this.haloMat.opacity = 0.12+g*0.4;
    this.flames.forEach(f=>{ f.material.opacity = 0.3+g*0.5; });
    // dormant = harmless (you're actively repelling it — never a cheap hit)
    this.touchDamage = this.state==='dormant' ? 0 : 1;
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- Gravemite: knee-high skittering ground pest — fixed dash/pause patrol, bright eyes so it reads low ----
class Gravemite extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hitR=0.34; this.headH=0.44; this.hitY=0.2; this.touchR=0.5;
    this.candyDrop=2; this.shadow.scale.setScalar(0.6);
    this.groundY=y;
    this.range = opts.range||3;              // patrol half-width
    this.dir = opts.dir||1;
    this.axis = opts.axis||'x';
    this.speed = opts.speed||3.6;
    this.state='pause'; this.st=rand(0,0.4);  // seeded phase — deterministic per area, groups don't sync
    // emissive-lifted carapace + plates so the low silhouette reads in the murk
    const shellM = emat(0x5c4f80, 0x3a3068, 0.65);
    const shell = mesh('sph',[0.3,9,7], shellM); shell.position.y=0.2; shell.scale.set(1.2,0.78,1.1);
    for(let i=0;i<3;i++){ const plt=mesh('tor',[0.18-i*0.03,0.03,4,8], emat(0x8478b0,0x4a3d72,0.5)); plt.rotation.x=Math.PI/2; plt.position.set(0,0.26,-0.12+i*0.12); shell.add(plt); }
    const eM = emat(0xffe14d,0xffd21a,1);      // bright bug eyes
    this.eL = mesh('sph',[0.06,6,6], eM); this.eL.position.set(-0.09,0.32,0.24);
    this.eR = this.eL.clone(); this.eR.position.x=0.09;
    this.legs=[];
    for(let s=-1;s<=1;s+=2) for(let i=0;i<3;i++){
      const leg = mesh('cyl',[0.018,0.012,0.22,4], mat(0x241a34));
      leg.position.set(s*0.22,0.09,-0.14+i*0.14); leg.rotation.z=s*0.7;
      this.legs.push(leg);
    }
    this.group.add(shell, this.eL, this.eR, ...this.legs);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const p=this.group.position; p.y=this.groundY;
    this.legs.forEach((l,i)=>{ l.rotation.x = Math.sin(this.t*22+i*1.3)*(this.state==='dash'?0.6:0.14); });
    if(this.state==='pause'){
      this.eL.position.y = this.eR.position.y = 0.32+Math.sin(this.t*6)*0.02;
      if(this.st>0.7){
        this.state='dash'; this.st=0;
        const off = this.axis==='x'? p.x-this.home.x : p.z-this.home.z;   // reverse at edges (deterministic)
        if(off>this.range) this.dir=-1; else if(off<-this.range) this.dir=1;
        AUDIO.tone && AUDIO.tone({f:1500,f2:1950,type:'square',t:0.05,vol:0.05});   // chirp
      }
    } else {
      const step = this.speed*dt*this.dir;
      if(this.axis==='x'){ p.x+=step; p.x=clamp(p.x,this.home.x-this.range,this.home.x+this.range); this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2; }
      else { p.z+=step; p.z=clamp(p.z,this.home.z-this.range,this.home.z+this.range); this.group.rotation.y = this.dir>0?0:Math.PI; }
      if(this.st>0.42){ this.state='pause'; this.st=0; }
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- DiveCrow: corvid air-lane threat — fixed patrol loop, CAWS, then dives a fixed arc at a SNAPSHOT ----
// Modelled on SwoopBat (patrol/telegraph/dive/recover). Never homing — a sidestep always beats the dive.
class DiveCrow extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;                   // fixed phase = identical flight every attempt
    this.baseY=y; this.rangeX=opts.range||6; this.aggroR=opts.aggroR||6; this.period=opts.period||4.2;
    this.hitR=0.5; this.headH=0.55; this.hitY=0.15; this.touchR=0.62; this.candyDrop=2;
    this.state='patrol'; this.st=0; this.cool=0;
    this.diveFrom=new THREE.Vector3(); this.diveTo=new THREE.Vector3();
    // dark corvid body, emissive-lifted so the shape reads against the night; bright eye/beak = the tell
    const bodyM = emat(0x343054, 0x1e1a3a, 0.5);
    this.body = mesh('sph',[0.36,9,8], bodyM); this.body.scale.set(1,0.85,1.28);
    const head = mesh('sph',[0.23,8,7], bodyM); head.position.set(0,0.13,0.32);
    const eM = emat(0xffcf3a,0xffcf3a,1);
    const eL = mesh('sph',[0.065,6,6], eM); eL.position.set(-0.1,0.19,0.44);
    const eR = eL.clone(); eR.position.x=0.1;
    const beak = mesh('cone',[0.1,0.3,5], emat(0xffb02e,0xe08a1a,0.9)); beak.rotation.x=Math.PI/2; beak.position.set(0,0.1,0.62);
    const wingM = emat(0x423d63, 0x252140, 0.45);
    const mkWing = (s)=>{ const wg=new THREE.Group();
      const w = mesh('box',[0.62,0.05,0.34], wingM); w.position.x=s*0.34;
      const e = mesh('box',[0.66,0.055,0.11], emat(0xa9a4d8,0x6660a0,0.7)); e.position.set(s*0.34,0.006,0.2);
      wg.add(w,e); return wg; };
    this.wingL = mkWing(-1); this.wingR = mkWing(1);
    const tail = mesh('box',[0.16,0.045,0.42], wingM); tail.position.set(0,0,-0.42);
    this.group.add(this.body, head, eL, eR, beak, this.wingL, this.wingR, tail);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; if(this.cool>0) this.cool-=dt;
    const p=this.group.position, pl=this.G.player;
    const flap = this.state==='dive'?16:9;
    this.wingL.rotation.z =  Math.sin(this.t*flap)*0.8;
    this.wingR.rotation.z = -Math.sin(this.t*flap)*0.8;
    if(this.state==='patrol'){
      const ph = this.t*(TAU/this.period);
      p.x = this.home.x + Math.sin(ph)*this.rangeX;
      p.y = this.baseY + Math.sin(ph*2)*0.4;
      this.group.rotation.x = damp(this.group.rotation.x, 0, 8, dt);
      this.group.rotation.y = Math.cos(ph)>=0?Math.PI/2:-Math.PI/2;
      if(pl && !pl.dead && this.cool<=0 && Math.abs(pl.pos.x-p.x)<this.aggroR && pl.pos.y<p.y+0.5){
        this.state='telegraph'; this.st=0;
        AUDIO.noise && AUDIO.noise({t:0.18,vol:0.22,fFrom:1100,fTo:600});   // CAW = the warning
      }
    } else if(this.state==='telegraph'){
      this.st+=dt;
      p.y += Math.sin(this.st*30)*0.03;                                     // agitated pull-up
      this.group.rotation.x = damp(this.group.rotation.x, -0.3, 8, dt);
      if(this.st>0.5 && pl){
        this.state='dive'; this.st=0;
        this.diveFrom.copy(p);
        this.diveTo.set(pl.pos.x, pl.pos.y+0.3, 0);                         // snapshot NOW — move and it misses
      }
    } else if(this.state==='dive'){
      this.st+=dt;
      const u=Math.min(this.st/0.5,1);
      p.x = this.diveFrom.x+(this.diveTo.x-this.diveFrom.x)*u;
      p.y = this.diveFrom.y+(this.diveTo.y-this.diveFrom.y)*u*u;
      this.group.rotation.x = 0.5;
      this.group.rotation.y = this.diveTo.x>=this.diveFrom.x?Math.PI/2:-Math.PI/2;
      if(u>=1){ this.state='recover'; this.st=0; this.diveFrom.copy(p); }
    } else { // recover — climb back to the patrol line
      this.st+=dt;
      const u=Math.min(this.st/0.85,1);
      p.y = this.diveFrom.y+(this.baseY-this.diveFrom.y)*u;
      this.group.rotation.x = damp(this.group.rotation.x, 0, 6, dt);
      if(u>=1){ this.state='patrol'; this.cool=1.8; this.home.x = p.x - Math.sin(this.t*(TAU/this.period))*this.rangeX; }
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- CoffinHopper: a coffin hopping on little bare feet — fixed hop patrol; every 4th hop it TRIPS (free stomp) ----
class CoffinHopper extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hitR=0.5; this.headH=1.0; this.hitY=0.5; this.touchR=0.62; this.candyDrop=3;
    this.groundY=y; this.vy=0; this.hvx=0;
    this.range=opts.range||4; this.dir=opts.dir||1; this.hopDist=opts.hopDist||1.6;
    this.state='crouch'; this.st=rand(0,0.3); this.hops=0;
    const woodM = emat(0x4a3557,0x2a1d38,0.45), trimM = emat(0x6a4f80,0x3a2a52,0.4);
    this.bodyG = new THREE.Group();
    const top = mesh('box',[0.55,0.9,0.34], woodM); top.position.y=0.95;
    const bot = mesh('box',[0.4,0.5,0.34], woodM); bot.position.y=0.4;
    const cv = mesh('box',[0.09,0.5,0.05], emat(0xd9c48a,0xb59a4a,0.6)); cv.position.set(0,1.05,0.19);   // bright lid cross
    const ch = mesh('box',[0.3,0.09,0.05], emat(0xd9c48a,0xb59a4a,0.6)); ch.position.set(0,1.16,0.19);
    const tr = mesh('box',[0.58,0.06,0.37], trimM); tr.position.y=1.36;
    const eye = mesh('sph',[0.06,6,6], emat(0x8fffd0,0x4dffb0,1)); eye.position.set(0.11,0.7,0.19);        // spooky peek
    this.bodyG.add(top,bot,cv,ch,tr,eye);
    const footM = mat(0xf0d8b0);
    this.footL = mesh('sph',[0.12,7,6], footM); this.footL.position.set(-0.16,0.1,0.06); this.footL.scale.set(0.9,0.7,1.35);
    this.footR = mesh('sph',[0.12,7,6], footM); this.footR.position.set(0.16,0.1,0.06); this.footR.scale.set(0.9,0.7,1.35);
    this.group.add(this.bodyG, this.footL, this.footR);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const p=this.group.position;
    this.touchDamage = this.state==='trip' ? 0 : 1;   // harmless while flat on its face
    if(this.state==='hop'){
      this.vy -= 26*dt; p.y += this.vy*dt; p.x += this.hvx*dt;
      this.footL.rotation.x = Math.sin(this.t*18)*0.8;
      this.footR.rotation.x = -Math.sin(this.t*18)*0.8;
      this.bodyG.rotation.z = this.dir*0.12*Math.sin(this.st*10);
      if(p.y<=this.groundY){
        p.y=this.groundY; this.vy=0; this.hvx=0; this.hops++;
        this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.05,p.z), 0x776688, 3, {speed:1,life:0.2,size:0.5});
        if(this.hops%4===0){ this.state='trip'; this.st=0; AUDIO.tone && AUDIO.tone({f:420,f2:150,type:'sawtooth',t:0.22,vol:0.09}); }  // whoops!
        else { this.state='crouch'; this.st=0; }
      }
    } else if(this.state==='crouch'){
      this.bodyG.scale.y = damp(this.bodyG.scale.y, 0.82, 12, dt);
      this.bodyG.rotation.z = damp(this.bodyG.rotation.z, 0, 10, dt);
      if(this.st>0.35){
        const off = p.x-this.home.x;                                       // reverse at edges (deterministic)
        if(off>this.range) this.dir=-1; else if(off<-this.range) this.dir=1;
        this.state='hop'; this.st=0; this.vy=6.5; this.hvx=this.dir*this.hopDist/0.5; this.bodyG.scale.y=1.12;
        AUDIO.tone && AUDIO.tone({f:240,f2:400,type:'sine',t:0.1,vol:0.08});
      }
    } else { // trip — fallen flat, vulnerable, harmless (the free-stomp window)
      this.bodyG.rotation.z = damp(this.bodyG.rotation.z, this.dir*1.35, 10, dt);
      this.bodyG.scale.y = damp(this.bodyG.scale.y, 1, 8, dt);
      this.footL.rotation.x = Math.sin(this.t*20)*1.1;                      // legs flail in the air
      this.footR.rotation.x = -Math.sin(this.t*22)*1.1;
      if(this.st>1.2){ this.state='crouch'; this.st=0; this.bodyG.rotation.z=0; }
    }
    this.group.position.x = clamp(this.group.position.x, this.home.x-this.range, this.home.x+this.range);   // never hop past the patrol footprint (off ledges / into urn clear-patch)
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- LostTourGroup: comedy SET-PIECE — six hand-holding skeletons shuffling behind a tour-guide wisp with a flag ----
// HARMLESS as an intact line (touchDamage 0, slow fixed path). Break the line (hit any member) → all six turn
// hostile & chase for ~4s, then reform. ONE registered entity managing its own children. On die, poofs the whole group.
class LostTourGroup extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    G.scene.remove(this.shadow);                    // per-member shadows instead
    this.hp = 6; this.touchDamage=0; this.hitR=0.6; this.headH=1.35; this.hitY=0.6; this.candyDrop=0;
    this.groundY=y; this.range=opts.range||6; this.dir=opts.dir||1; this.speed=opts.speed||0.9; this.spacing=1.05;
    this._baseX=x; this.state='tour'; this.angryT=0;
    this.line = new THREE.Group(); G.scene.add(this.line);
    // tour-guide wisp holding a tiny flag
    this.guide = new THREE.Group();
    const gcore = new THREE.Mesh(geo('sph',0.22,10,8), new THREE.MeshBasicMaterial({color:0xbfffe6}));
    gcore.position.y=1.05;
    const ghalo = new THREE.Mesh(geo('sph',0.38,10,8), new THREE.MeshBasicMaterial({color:0x66ffcc, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false}));
    ghalo.position.y=1.05;
    const pole = mesh('cyl',[0.02,0.02,0.95,4], mat(0xd8d0b6)); pole.position.set(0.16,1.42,0);
    this.flag = mesh('box',[0.36,0.24,0.02], emat(0xff5ea8,0xd93a80,0.55)); this.flag.position.set(0.36,1.72,0);
    this.guide.add(gcore,ghalo,pole,this.flag);
    this.guideShadow = blobShadow(0.4); G.scene.add(this.guideShadow);
    this.line.add(this.guide);
    // six hand-holding skeletons (bright bone reads great in the dark)
    this.mem=[];
    for(let i=0;i<6;i++){ const s=this.buildSkelly(i); this.line.add(s.g); s.shadow=blobShadow(0.38); G.scene.add(s.shadow); this.mem.push(s); }
  }
  buildSkelly(i){
    const g=new THREE.Group(); const boneM=emat(PAL.bone, 0x44425e, 0.3);   // slight lift so bone reads in near-dark
    const skull=mesh('sph',[0.23,9,8], boneM); skull.position.y=1.12; skull.scale.set(1,1.05,0.95);
    const jaw=mesh('box',[0.2,0.08,0.15], boneM); jaw.position.set(0,0.96,0.04);
    const eL=mesh('sph',[0.045,6,6], emat(0x9ad6ff,0x6ab0ff,0.9)); eL.position.set(-0.075,1.14,0.18);
    const eR=eL.clone(); eR.position.x=0.075;
    const spine=mesh('cyl',[0.05,0.05,0.4,5], boneM); spine.position.y=0.66;
    for(let r=0;r<2;r++){ const rib=mesh('tor',[0.15-r*0.03,0.026,5,9], boneM); rib.rotation.x=Math.PI/2; rib.position.y=0.8-r*0.14; rib.scale.z=0.7; g.add(rib); }
    const legL=mesh('cyl',[0.04,0.04,0.38,5], boneM); legL.position.set(-0.1,0.21,0);
    const legR=mesh('cyl',[0.04,0.04,0.38,5], boneM); legR.position.set(0.1,0.21,0);
    const armL=mesh('cyl',[0.033,0.033,0.34,5], boneM); armL.position.set(-0.24,0.78,0); armL.rotation.z=0.95;   // reaching to hold hands
    const armR=mesh('cyl',[0.033,0.033,0.34,5], boneM); armR.position.set(0.24,0.78,0); armR.rotation.z=-0.95;
    g.add(skull,jaw,eL,eR,spine,legL,legR,armL,armR);
    return {g, legL, legR, phase:i*0.5, x:0, z:0};
  }
  takeHit(player, kind){
    if(this.dead) return;
    this.hp -= (kind==='pound'?2:1);
    this.hurtFlash=0.15;
    if(this.state!=='angry' && window.UI) UI.toast('💀 You broke the line! The tour is FURIOUS.');
    this.state='angry'; this.angryT=4; this.touchDamage=1;
    AUDIO.stomp();
    if(this.hp<=0) this.die();
  }
  die(){
    this.dead=true; AUDIO.enemyPoof && AUDIO.enemyPoof();
    const wp=new THREE.Vector3();
    for(const m of [this.guide, ...this.mem.map(s=>s.g)]){
      m.getWorldPosition(wp);
      this.G.fx.spawn(wp.clone(), 0xffffff, 8, {speed:3});
      this.G.fx.spawn(wp.clone(), PAL.purpleFx, 5, {speed:2.5});
    }
    candyBurst(this.G, this.group.position, 14);
    this.G.scene.remove(this.line, this.guideShadow);
    for(const s of this.mem) this.G.scene.remove(s.shadow);
    this.G.onEnemyKilled && this.G.onEnemyKilled(this);
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player;
    if(this.state==='angry'){
      this.angryT-=dt;
      if(this.angryT<=0){ this.state='tour'; this.touchDamage=0; this.hp=6; if(window.UI) UI.toast('💀 ...the tour reassembles. Ahem.'); }
    }
    if(this.state==='tour'){
      this.home.x += this.dir*this.speed*dt;                               // slow fixed shuffle, reverse at edges
      if(this.home.x>this._baseX+this.range) this.dir=-1;
      else if(this.home.x<this._baseX-this.range) this.dir=1;
      const lx=this.home.x;
      this.guide.position.set(lx, this.groundY+Math.sin(this.t*3)*0.05, this.home.z);
      this.guide.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
      for(let i=0;i<6;i++){
        const s=this.mem[i], tx=lx-this.dir*(i+1)*this.spacing;
        s.x=tx; s.z=this.home.z;
        s.g.position.set(tx, this.groundY+Math.abs(Math.sin(this.t*4+s.phase))*0.05, this.home.z);
        s.g.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
        s.legL.rotation.x = Math.sin(this.t*4+s.phase)*0.3;
        s.legR.rotation.x = -Math.sin(this.t*4+s.phase)*0.3;
      }
    } else { // angry — skeletons scatter and chase; guide panics overhead
      for(let i=0;i<6;i++){
        const s=this.mem[i];
        if(pl && !pl.dead){
          const dx=pl.pos.x-s.x, dz=pl.pos.z-s.z, d=Math.hypot(dx,dz)||1, sp=2.6+i*0.14;
          s.x+=dx/d*sp*dt; s.z+=dz/d*sp*dt; s.g.rotation.y=Math.atan2(dx,dz);
          if(this.touchDamage>0 && dx*dx+dz*dz<0.68*0.68 && pl.pos.y<this.groundY+1.2 && pl.pos.y+pl.height>this.groundY)
            pl.damage(1, s.g.position);
        }
        s.g.position.set(s.x, this.groundY+Math.abs(Math.sin(this.t*10+s.phase))*0.12, s.z);
        s.legL.rotation.x = Math.sin(this.t*12+s.phase)*0.7;
        s.legR.rotation.x = -Math.sin(this.t*12+s.phase)*0.7;
      }
      this.guide.position.y = this.groundY+1.0+Math.sin(this.t*8)*0.2;
    }
    this.flag.rotation.z = Math.sin(this.t*(this.state==='angry'?14:5))*0.4;
    // logical hit-position tracks the member NEAREST the player, so the built-in stomp/attack detection
    // (which reads this.group.position) fires when the player hits ANY member of the line.
    let best={x:this.guide.position.x,z:this.guide.position.z}, bestD=1e9;
    const cand=[best].concat(this.mem.map(s=>({x:s.x,z:s.z})));
    if(pl) for(const c of cand){ const d=(c.x-pl.pos.x)**2+(c.z-pl.pos.z)**2; if(d<bestD){ bestD=d; best=c; } }
    this.group.position.set(best.x, this.groundY, best.z);
    // shadows
    this.guideShadow.position.set(this.guide.position.x, this.groundY+0.02, this.guide.position.z);
    for(const s of this.mem) s.shadow.position.set(s.x, this.groundY+0.02, s.z);
  }
}

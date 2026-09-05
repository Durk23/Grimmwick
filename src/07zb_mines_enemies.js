// ============ ICICLE MINES ROSTER — Winter District 3 enemies (Knocker Sprite, Gem Mimic, Rubblekin, Crystal Moth) ============
// Extends the Enemy base (07_enemies) + the winter language. The mines are the GLITTERING dark — crystal glow
// everywhere, spirits IN the rock, and half the treasure has teeth. Same contract as every roster; deterministic
// state machines, fixed clocks, no Math.random on the critical path.

// ---- KNOCKER SPRITE: a mine spirit that travels INSIDE the rock — you track its lantern-glow bump gliding
// along the wall/ceiling face. It KNOCKS three times (tap... tap... TAP — audio + a pulsing ring at the spot,
// ~0.9s total: the miners' oldest warning) then BURSTS out at the knock point in a short lunge, and melts back
// in. Ceiling-and-wall lane pressure with a fully audible telegraph. hp1 — catch it mid-burst. ----
class KnockerSprite extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.45; this.headH=0.9; this.hitY=0.4; this.touchR=0.6; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    this.x0=opts.x0!==undefined?opts.x0:x-4; this.x1=opts.x1!==undefined?opts.x1:x+4;
    this.wallY=opts.wallY!==undefined?opts.wallY:y;   // the face it lives in (a ceiling underside or wall line)
    this.period=opts.period||6.5; this.speed=opts.speed||2.0;
    this.state='glide'; this.st=0; this.touchDamage=0;
    // the bump — a glow traveling the rock (always visible; the sprite itself hides inside)
    this.bump = mesh('sph',[0.32,8,7], new THREE.MeshLambertMaterial({color:0xffd98a, emissive:0xffb85e, emissiveIntensity:0.7, transparent:true, opacity:0.55}));
    this.bump.scale.set(1.3,0.5,1); this.group.add(this.bump);
    // the sprite (hidden until the burst): a little hardhat spirit, all glow
    this.sprite = new THREE.Group();
    const bod = mesh('sph',[0.32,9,8], emat(0xffe9b0,0xffc87a,0.8)); this.sprite.add(bod);
    const hat = mesh('cyl',[0.24,0.3,0.16,10], mat(0xc9a24a)); hat.position.y=0.3; this.sprite.add(hat);
    const lampf = mesh('sph',[0.07,6,5], emat(0x7ae8ff,0x7ae8ff,1.2)); lampf.position.set(0,0.34,0.24); this.sprite.add(lampf);
    for(const s of [-1,1]){ const eye=mesh('sph',[0.05,5,4], mat(0x2a2036)); eye.position.set(s*0.11,0.06,0.28); this.sprite.add(eye); }
    const pick2 = mesh('box',[0.34,0.05,0.05], mat(0x6a5a48)); pick2.position.set(0.3,-0.1,0.1); pick2.rotation.z=0.5; this.sprite.add(pick2);
    this.sprite.visible=false; this.group.add(this.sprite);
    this.ring = new THREE.Mesh(geo('tor',0.4,0.03,5,16), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0, depthWrite:false}));
    this.group.add(this.ring);
    G.scene.add(this.group);
    this.shadow.visible=false;
  }
  update(dt){
    this.t+=dt; this.st+=dt;   // st drives the knock/burst timers (GemMimic idiom — without it the sprite gilded forever and never knocked)
    const pl=this.G.player, p=this.group.position;
    const cyc=this.t % this.period;
    const span=this.x1-this.x0;
    if(this.state==='glide'){
      this.touchDamage=0; this.sprite.visible=false; this.bump.visible=true;
      const k = (cyc/(this.period-2.0)) % 2;   // glide the face, leaving 2.0s for knock+burst
      const kk = k<1?k:2-k;
      p.x = this.x0 + span*kk; p.y = this.wallY;
      this.bump.position.set(0,0,0);
      this.ring.material.opacity = 0;
      // ONE knock per cycle (fleet-audit fix: returning to glide inside the same tail re-armed the
      // trigger — every period fired a second, undocumented burst at a spurious spot)
      if(cyc < this.period-2.0) this._fired = false;
      if(cyc >= this.period-2.0 && !this._fired){ this._fired = true; this.state='knock'; this.st=0;
        this.ring.position.set(0,0,0.3); }
    } else if(this.state==='knock'){
      // tap... tap... TAP (0.3s apart; the ring pulses with each)
      const kn = Math.floor(this.st/0.3);
      this.ring.material.opacity = 0.6 - (this.st%0.3)*1.6;
      this.ring.scale.setScalar(1 + (this.st%0.3)*2);
      if(this._kn!==kn && kn<3){ this._kn=kn;
        AUDIO.tone && AUDIO.tone({f:220+kn*60, f2:180, type:'square', t:0.05, vol:0.12}); }
      if(this.st>0.9){ this.state='burst'; this.st=0; this._kn=-1;
        this.sprite.visible=true; this.bump.visible=false; this.touchDamage=1;
        this._dir = pl ? Math.sign(pl.pos.x-p.x)||1 : 1;
        AUDIO.noise && AUDIO.noise({t:0.15,vol:0.13,fFrom:500,fTo:1200}); }
    } else { // burst — a short lunge out of the rock, then melt back
      const k=this.st/0.8;
      const out = Math.sin(Math.min(k,1)*Math.PI);
      this.sprite.position.set(this._dir*out*1.4, (this.wallY>2 ? -out*1.2 : out*0.8) - 0 , out*0.4);
      this.sprite.rotation.z = -this._dir*out*0.5;
      if(k>=1){ this.state='glide'; this.st=0; this.touchDamage=0;
        this.sprite.visible=false; this.bump.visible=true; }
    }
    if(this.state==='burst') this.touchPlayer(dt);
  }
}

// ---- GEM MIMIC: a crystal cluster that is mostly teeth. It sits dead-still among REAL crystal deco (place it
// in decoy clusters — the Spooky Snowman's lesson, mineral edition); come close and it GLINTS + rattles (0.6s)
// then snap-hops at you once, scattering sparkle. hp1 stomp/spin. Trust no treasure. ----
class GemMimic extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=0.9; this.hitY=0.4; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.wakeR=opts.wakeR||2.6;
    this.state='still'; this.st=0; this.touchDamage=0; this.groundY=y; this.vy=0;
    const cc = opts.color||0xb08aff;
    this.crysM = new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.35, transparent:true, opacity:0.9});
    this.bodyG = new THREE.Group();
    for(let i=0;i<4;i++){ const sh=new THREE.Mesh(geo('cone', 0.16+((i*7)%3)*0.05, 0.5+((i*5)%4)*0.14, 5), this.crysM);
      sh.position.set(-0.25+i*0.17, 0.25, ((i*3)%2?0.12:-0.1)); sh.rotation.z=(-0.3+i*0.2); this.bodyG.add(sh); }
    const base=new THREE.Mesh(geo('sph',0.34,8,7), this.crysM); base.scale.y=0.5; base.position.y=0.1; this.bodyG.add(base);
    // the teeth (hidden in the seam until it wakes)
    this.maw = new THREE.Group();
    for(let i=0;i<4;i++){ const th=mesh('cone',[0.05,0.14,4], mat(0xf0f4ff)); th.position.set(-0.18+i*0.12, 0.16, 0.26); this.maw.add(th); }
    this.maw.visible=false; this.bodyG.add(this.maw);
    this.group.add(this.bodyG);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    if(this.state==='still'){
      this.touchDamage=0;
      this.crysM.emissiveIntensity = 0.35;   // exactly as boring as the real ones
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<1.6 && Math.abs(pl.pos.y-p.y)<1.8){
        this.state='glint'; this.st=0;
        AUDIO.noise && AUDIO.noise({t:0.12,vol:0.1,fFrom:2400,fTo:3200});   // the rattle
      }
    } else if(this.state==='glint'){
      this.crysM.emissiveIntensity = 0.35 + Math.sin(this.st*30)*0.5;   // the GLINT — 0.6s of "that rock is looking at me"
      this.bodyG.rotation.z = Math.sin(this.st*26)*0.06;
      if(this.st>0.6){ this.state='snap'; this.st=0; this.maw.visible=true; this.touchDamage=1;
        this.vy=5.5; this._dir = pl ? Math.sign(pl.pos.x-p.x)||1 : 1; }
    } else if(this.state==='snap'){
      this.vy -= 18*dt;
      p.y += this.vy*dt; p.x += this._dir*3.4*dt;
      this.bodyG.rotation.z = -this._dir*0.2;
      if(p.y<=this.groundY){ p.y=this.groundY; this.state='rest'; this.st=0; this.touchDamage=0;
        this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.3,p.z), 0xb08aff, 6, {speed:2, life:0.4}); }
    } else { // rest — settles, re-disguises
      this.maw.visible=false;
      this.bodyG.rotation.z = damp(this.bodyG.rotation.z, 0, 6, dt);
      if(this.st>1.1){ this.state='still'; this.st=0; }
    }
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- RUBBLEKIN: a knee-high golem that ASSEMBLES from an innocent rubble pile when you pass — stacks itself,
// waddles after you, and lobs one pebble on a fixed clock (arcing shot, glow telegraph on the pebble). A stomp
// SCATTERS it back to rubble... and it reassembles once, pebbles angrier. Second stomp ends it. ----
class Rubblekin extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=1.0; this.hitY=0.45; this.touchR=0.68; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.wakeR=opts.wakeR||5.5; this.speed=opts.speed||1.6; this.lobP=opts.lobP||3.4;
    this.state='pile'; this.st=0; this.touchDamage=0; this.rebuilt=false; this.groundY=y;
    const rock = emat(0x4a4058, 0x241c30, 0.15), rockD = emat(0x3a3448, 0x1a1424, 0.1);
    this.parts=[];
    const mkP=(r,px,py,pz,m)=>{ const s=mesh('sph',[r,7,6], m||rock); s.position.set(px,py,pz); s.userData.home={x:px,y:py,z:pz}; this.group.add(s); this.parts.push(s); return s; };
    mkP(0.36, 0, 0.3, 0);            // torso
    mkP(0.24, 0, 0.78, 0, rockD);    // head
    mkP(0.14, -0.4, 0.3, 0.1);       // arm L
    mkP(0.14, 0.4, 0.3, -0.05);      // arm R
    mkP(0.17, -0.2, 0.05, 0.15, rockD); mkP(0.17, 0.22, 0.05, -0.1, rockD);   // feet
    this.eyeL=mesh('sph',[0.05,5,4], emat(0xffb85e,0xffb85e,0.9)); this.eyeL.position.set(-0.08,0.82,0.2); this.group.add(this.eyeL);
    this.eyeR=this.eyeL.clone(); this.eyeR.position.x=0.08; this.group.add(this.eyeR);
    this._flatten();   // starts as an innocent pile
    G.scene.add(this.group);
  }
  _flatten(){ // collapse to rubble
    this.parts.forEach((s,i)=>{ s.position.set(s.userData.home.x*1.6, 0.1+((i*13)%3)*0.06, s.userData.home.z*1.6); });
    this.eyeL.visible=this.eyeR.visible=false;
  }
  takeHit(player, kind){
    if(this.dead) return;
    if(this.state!=='pile' && !this.rebuilt){
      this.state='pile'; this.st=0; this.touchDamage=0; this.rebuilt=true; this._flatten();
      AUDIO.stomp && AUDIO.stomp();
      const p=this.group.position;
      this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.5,p.z), 0x4a4058, 10, {speed:3, life:0.4});
    } else this.die();
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    if(this.state==='pile'){
      const wakeAt = this.rebuilt ? 1.2 : 0;   // the rebuilt pile needs a breath before it can rise
      if(pl && !pl.dead && this.st>wakeAt && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<2){
        this.state='rise'; this.st=0;
        AUDIO.noise && AUDIO.noise({t:0.3,vol:0.12,fFrom:120,fTo:400});
      }
    } else if(this.state==='rise'){
      const k=Math.min(this.st/0.7,1);   // stones fly home — 0.7s of unmistakable assembly
      this.parts.forEach(s=>{ const h=s.userData.home;
        s.position.x=damp(s.position.x,h.x,10,dt); s.position.y=damp(s.position.y,h.y,10,dt); s.position.z=damp(s.position.z,h.z,10,dt); });
      if(k>=1){ this.state='waddle'; this.st=0; this.touchDamage=1; this.eyeL.visible=this.eyeR.visible=true; this._lobT=this.lobP*0.6; }
    } else if(this.state==='waddle'){
      // LEASH (fleet-audit fix, 3 verifiers): an unleashed waddle could be kited into checkpoint rest
      // pockets. Past wakeR+9 of HOME it forgets you, trudges home, and piles back up — reach envelopes
      // in level ledgers are now code-enforced.
      if(pl && !pl.dead && Math.hypot(pl.pos.x-this.home.x, pl.pos.z-this.home.z) > this.wakeR+9){
        const hx=this.home.x-p.x;
        if(Math.abs(hx)>0.4){ p.x += Math.sign(hx)*this.speed*dt; this.group.rotation.y = hx>0?Math.PI/2:-Math.PI/2; this.group.rotation.z = Math.sin(this.t*8)*0.1; }
        else { this.state='pile'; this.st=0; this.touchDamage=0; this._flatten(); }
        this.updateShadow(); return;
      }
      if(pl && !pl.dead){
        const dx=pl.pos.x-p.x;
        if(Math.abs(dx)>1.1){ p.x += Math.sign(dx)*this.speed*(this.rebuilt?1.35:1)*dt; this.group.rotation.y = dx>0?Math.PI/2:-Math.PI/2; }
        this.group.rotation.z = Math.sin(this.t*8)*0.1;
        this._lobT -= dt;
        if(this._lobT<=0){ this._lobT=this.lobP;
          // one pebble, arcing, glowing — the fixed-clock shot
          const pe = { dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
            px:p.x, py:p.y+1.0, vx:Math.sign(dx)*4.2, vy:5.8, G:this.G,
            m: mesh('sph',[0.14,6,5], emat(0xffb85e,0xff9a50,0.9)),
            update(dt2, GG){ this.t+=dt2; this.vy-=16*dt2; this.px+=this.vx*dt2; this.py+=this.vy*dt2;
              this.m.position.set(this.px,this.py,0);
              const pl2=GG.player;
              if(pl2 && !pl2.dead && Math.abs(pl2.pos.x-this.px)<0.5 && Math.abs(pl2.pos.z)<0.9 && this.py>pl2.pos.y && this.py<pl2.pos.y+1.4){
                pl2.damage(1, new THREE.Vector3(this.px,this.py,0)); this.dead=true; GG.scene.remove(this.m); }
              if(this.py<-2 || this.t>3){ this.dead=true; GG.scene.remove(this.m); } } };
          pe.m.position.set(pe.px,pe.py,0); this.G.scene.add(pe.m); this.G.ents.add(pe);
          AUDIO.tone && AUDIO.tone({f:340,f2:180,type:'triangle',t:0.1,vol:0.1});
        }
      }
    }
    if(this.state==='waddle') this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- CRYSTAL MOTH: the mines' gentle air lane — a big glowing moth drifting a fixed figure-eight, shedding
// sparkle. 1-heart touch, hp1, utterly readable; its job is to make the air lane EXIST while the walls knock
// and the treasure bites. Pretty on purpose (every district needs one creature you feel bad bonking). ----
class CrystalMoth extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.rx=opts.rx||3.2; this.ry=opts.ry||1.1; this.period=opts.period||5.2;
    this.hitR=0.45; this.headH=0.8; this.hitY=0.3; this.touchR=0.6; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    const cc=opts.color||0x7ae8ff;
    const wingM = new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.55, transparent:true, opacity:0.6, side:THREE.DoubleSide});
    this.body = mesh('sph',[0.2,8,7], emat(0xdff4ff,0x9fd8ff,0.6)); this.body.scale.set(1,1.5,1); this.group.add(this.body);
    this.wL = new THREE.Mesh(geo('circ',0.5,7), wingM); this.wL.position.x=-0.4; this.group.add(this.wL);
    this.wR = new THREE.Mesh(geo('circ',0.5,7), wingM); this.wR.position.x=0.4; this.group.add(this.wR);
    for(const s of [-1,1]){ const ant=mesh('cyl',[0.015,0.02,0.3,4], mat(0x2a3048)); ant.position.set(s*0.08,0.42,0); ant.rotation.z=s*0.4; this.group.add(ant); }
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const p=this.group.position;
    const a=this.t*(TAU/this.period);
    p.x = this.home.x + Math.sin(a)*this.rx;
    p.y = this.home.y + Math.sin(a*2)*this.ry;   // the figure-eight
    this.wL.rotation.y =  Math.sin(this.t*10)*0.9;
    this.wR.rotation.y = -Math.sin(this.t*10)*0.9;
    this.group.rotation.y = Math.cos(a)>=0 ? 0.4 : -0.4;
    if(Math.random()<dt*4) this.G.fx.spawn(new THREE.Vector3(p.x,p.y-0.2,p.z), 0x7ae8ff, 1, {speed:0.4, life:0.5, gravity:0.5});
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- THE GRAVEL TRIPLETS: three Rubblekin who curl up and ROLL fixed lanes — the mines' trio (a proud
// Frostmere tradition at this point; the signs have started apologizing for it). SnowballRoller clock, rock skin. ----
class GravelTriplet extends SnowballRoller {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z, Object.assign({r0:0.8, r1:0.8, speed:opts.speed||4.4}, opts));
    this.candyDrop = opts.candy!==undefined?opts.candy:4;
    this.ball.material = emat(0x4a4058, 0x241c30, 0.2);
    for(let i=0;i<4;i++){ const chip=mesh('box',[0.2,0.16,0.2], emat(0x5a5068,0x2a2438,0.15)); const a=i/4*TAU+0.4; chip.position.set(Math.cos(a)*0.6, Math.sin(a)*0.6, 0.4); this.ball.add(chip); }
    const eye=mesh('sph',[0.07,5,4], emat(0xffb85e,0xffb85e,0.9)); eye.position.set(0,0.2,0.78); this.ball.add(eye);
    const eye2=eye.clone(); eye2.position.set(0.22,0.1,0.75); this.ball.add(eye2);
  }
}

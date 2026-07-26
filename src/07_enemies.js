// ============ ENEMIES — Boo, Jump-o'-Lantern, Skelly, Web Spider ============
class Enemy {
  constructor(G, x,y,z){
    this.G = G;
    this.group = new THREE.Group();
    this.group.position.set(x,y,z);
    this.home = new THREE.Vector3(x,y,z);
    this.isEnemy = true;
    this.dead = false;
    this.hp = 1;
    this.hitR = 0.6; this.headH = 1.0; this.hitY = 0.5;
    this.touchDamage = 1;
    this.touchR = 0.75;
    this.t = rand(0,10);
    this.hurtFlash = 0;
    this.shadow = blobShadow(0.55);
    G.scene.add(this.shadow);
  }
  takeHit(player, kind){
    if(this.dead) return;
    this.hp -= (kind==='pound'?2:1);
    this.hurtFlash = 0.15;
    if(this.hp<=0) this.die();
    else {
      AUDIO.stomp();
      // knockback
      const p=this.group.position;
      const dx=p.x-player.pos.x, dz=p.z-player.pos.z, d=Math.hypot(dx,dz)||1;
      p.x += dx/d*0.8; p.z += dz/d*0.8;
    }
  }
  die(){
    this.dead = true;
    AUDIO.enemyPoof();
    const p = this.group.position;
    this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.6,p.z), 0xffffff, 12, {speed:3.5, life:0.5});
    this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.6,p.z), PAL.purpleFx, 8, {speed:2.5, life:0.6});
    candyBurst(this.G, p, this.candyDrop!==undefined?this.candyDrop:randi(2,4));
    this.G.scene.remove(this.shadow);
    this.G.onEnemyKilled && this.G.onEnemyKilled(this);
  }
  touchPlayer(dt){
    if(this.spawnGrace>0){ this.spawnGrace -= dt; return; }   // ambush spawns emerge harmless — opening a coffin is never a cheap hit
    const pl = this.G.player;
    if(!pl || pl.dead) return;
    const p = this.group.position;
    const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z;
    if(dx*dx+dz*dz < this.touchR*this.touchR && pl.pos.y < p.y+(this.headH||1) - 0.15 && pl.pos.y+pl.height > p.y){
      pl.damage(this.touchDamage, p);
    }
  }
  updateShadow(){
    const p = this.group.position;
    const gh = this.G.world.groundHeight(p.x, p.z, p.y+0.2);
    if(gh>-Infinity){
      this.shadow.visible=true;
      this.shadow.position.set(p.x, gh+0.02, p.z);
    } else this.shadow.visible=false;
  }
  flash(meshes){
    if(this.hurtFlash>0){ this.hurtFlash-=0.016; }
  }
}

// ---- Boo: shy ghost — freezes and hides when you face it ----
class Boo extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.speed = opts.speed||2.1;
    this.range = opts.range||11;
    this.hitR=0.55; this.headH=1.1;
    const bodyM = new THREE.MeshLambertMaterial({color:PAL.ghost, transparent:true, opacity:0.92});
    this.bodyMesh = new THREE.Mesh(geo('sph',0.5,10,9), bodyM);
    this.bodyMesh.position.y=0.75; this.bodyMesh.scale.set(1,1.1,1);
    const tail = new THREE.Mesh(geo('cone',0.42,0.6,8), bodyM);
    tail.position.y=0.28; tail.rotation.x=Math.PI;
    this.eyeL = mesh('sph',[0.09,6,6], mat(0x14101f)); this.eyeL.position.set(-0.17,0.85,0.42);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.17;
    this.armL = new THREE.Mesh(geo('sph',0.12,6,6), bodyM); this.armL.position.set(-0.5,0.7,0);
    this.armR = new THREE.Mesh(geo('sph',0.12,6,6), bodyM); this.armR.position.set(0.5,0.7,0);
    this.group.add(this.bodyMesh, tail, this.eyeL, this.eyeR, this.armL, this.armR);
    G.scene.add(this.group);
    this.shy = false;
  }
  update(dt){
    this.t += dt;
    const pl = this.G.player;
    const p = this.group.position;
    p.y = this.home.y + Math.sin(this.t*2.4)*0.18 + 0.35;
    if(this.anchor){ p.x = this.home.x; p.z = this.home.z; }   // a fixed stepping-stone Boo: never chases or drifts off station (undoes stomp knockback)
    if(pl && !pl.dead){
      const dx = pl.pos.x-p.x, dz = pl.pos.z-p.z;
      const d = Math.hypot(dx,dz);
      if(d < this.range){
        // is the player facing me?
        const fx = Math.sin(pl.facing), fz = Math.cos(pl.facing);
        const dot = (dx*-1*fx + dz*-1*fz)/(d||1); // player-forward vs dir-from-player-to-boo... compute properly:
        const toBooX = -dx/d, toBooZ = -dz/d;      // from boo to player is (dx,dz); player→boo is (-dx,-dz)
        const facingDot = fx*(-toBooX*-1)+0;        // simplify below
        const pfx = Math.sin(pl.facing), pfz = Math.cos(pl.facing);
        const dirX = (p.x-pl.pos.x)/d, dirZ = (p.z-pl.pos.z)/d;
        const face = pfx*dirX + pfz*dirZ;
        const wasShy = this.shy;
        this.shy = face > 0.25;
        if(this.shy && !wasShy && d<9) AUDIO.ghostGiggle();
        if(!this.shy && d>1.2 && !this.anchor){
          p.x += (pl.pos.x-p.x)/d*this.speed*dt;
          p.z += (pl.pos.z-p.z)/d*this.speed*dt;
          this.group.rotation.y = Math.atan2(pl.pos.x-p.x, pl.pos.z-p.z);
        }
      } else this.shy=false;
      // shy pose: cover eyes
      const cover = this.shy?1:0;
      this.armL.position.x = damp(this.armL.position.x, cover?-0.17:-0.5, 10, dt);
      this.armL.position.y = damp(this.armL.position.y, cover?0.85:0.7, 10, dt);
      this.armL.position.z = damp(this.armL.position.z, cover?0.44:0, 10, dt);
      this.armR.position.x = damp(this.armR.position.x, cover?0.17:0.5, 10, dt);
      this.armR.position.y = damp(this.armR.position.y, cover?0.85:0.7, 10, dt);
      this.armR.position.z = damp(this.armR.position.z, cover?0.44:0, 10, dt);
      this.bodyMesh.material.opacity = this.shy?0.55:0.92;
      this.touchPlayer(dt);
    }
    this.updateShadow();
  }
}

// ---- Jump-o'-Lantern: hopping pumpkin ----
class Hopper extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hitR=0.62; this.headH=0.95;
    this.aggroR = opts.aggroR||9;
    this.vy = 0; this.groundY = y;
    this.hopCD = rand(0.3,1);
    const body = mesh('sph',[0.55,10,8], mat(PAL.pumpkin));
    body.scale.set(1.1,0.9,1.1); body.position.y=0.5;
    for(let i=0;i<3;i++){
      const seg = mesh('sph',[0.55,8,8], mat(PAL.pumpkinD));
      seg.scale.set(1.02,0.85,0.3); seg.position.y=0.5; seg.rotation.y=i*Math.PI/3;
      this.group.add(seg);
    }
    const stem = mesh('cyl',[0.06,0.09,0.22,5], mat(PAL.stem)); stem.position.y=1.02;
    // glowing evil-cute face
    const fm = emat(0xffe08a, 0xffb02e, 1);
    const eL = mesh('cone',[0.09,0.14,3], fm); eL.position.set(-0.2,0.62,0.5); eL.rotation.x=0.2;
    const eR = eL.clone(); eR.position.x=0.2;
    const mouth = mesh('box',[0.3,0.08,0.06], fm); mouth.position.set(0,0.38,0.54);
    const t1 = mesh('box',[0.07,0.09,0.06], fm); t1.position.set(-0.09,0.44,0.54);
    const t2 = t1.clone(); t2.position.x=0.09;
    this.group.add(body, stem, eL, eR, mouth, t1, t2);
    this.bodyG = body;
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const p = this.group.position;
    const pl = this.G.player;
    // simple hop physics
    if(p.y > this.groundY || this.vy>0){
      this.vy -= 22*dt;
      p.y += this.vy*dt;
      if(p.y<=this.groundY){
        p.y=this.groundY; this.vy=0;
        this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.05,p.z), 0x997755, 3, {speed:1, life:0.25, size:0.5});
        this.hopCD = rand(0.35,0.7);
      }
    } else if(pl && !pl.dead){
      const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz);
      this.hopCD -= dt;
      if(d<this.aggroR && this.hopCD<=0 && Math.abs(pl.pos.y-p.y)<3){
        this.vy = 7.2;
        const sp = 3.6;
        this.hx = dx/d*sp; this.hz = dz/d*sp;
        this.group.rotation.y = Math.atan2(dx,dz);
      }
      // squash idle
      const sq = 1+Math.sin(this.t*5)*0.04;
      this.bodyG.scale.set(1.1*(2-sq),0.9*sq,1.1*(2-sq));
    }
    if(this.vy!==0 && p.y>this.groundY){
      p.x += (this.hx||0)*dt; p.z += (this.hz||0)*dt;
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- Skelly: patrols, rattles, then lunges ----
class Skelly extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hp = 2;
    this.hitR=0.55; this.headH=1.35; this.candyDrop=4;
    this.patrolA = new THREE.Vector3(x - (opts.px||3), y, z - (opts.pz||0));
    this.patrolB = new THREE.Vector3(x + (opts.px||3), y, z + (opts.pz||0));
    this.state = 'patrol'; this.stateT = 0; this.dir = 1;
    const boneM = mat(PAL.bone);
    const skull = mesh('sph',[0.3,9,8], boneM); skull.position.y=1.25; skull.scale.set(1,1.05,0.95);
    const jaw = mesh('box',[0.3,0.12,0.22], boneM); jaw.position.set(0,1.02,0.05);
    this.jaw = jaw;
    const eL = mesh('sph',[0.07,6,6], emat(0x88ffcc,0x88ffcc,0.9)); eL.position.set(-0.11,1.3,0.24);
    const eR = eL.clone(); eR.position.x=0.11;
    const spine = mesh('cyl',[0.06,0.06,0.5,5], boneM); spine.position.y=0.72;
    for(let i=0;i<3;i++){
      const rib = mesh('tor',[0.2-i*0.03,0.035,5,9], boneM);
      rib.rotation.x=Math.PI/2; rib.position.y=0.9-i*0.14; rib.scale.z=0.7;
      this.group.add(rib);
    }
    this.legL = mesh('cyl',[0.05,0.05,0.45,5], boneM); this.legL.position.set(-0.12,0.25,0);
    this.legR = mesh('cyl',[0.05,0.05,0.45,5], boneM); this.legR.position.set(0.12,0.25,0);
    this.armL = mesh('cyl',[0.045,0.045,0.42,5], boneM); this.armL.position.set(-0.3,0.85,0); this.armL.rotation.z=0.35;
    this.armR = this.armL.clone(); this.armR.position.x=0.3; this.armR.rotation.z=-0.35;
    this.group.add(skull,jaw,eL,eR,spine,this.legL,this.legR,this.armL,this.armR);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.stateT+=dt;
    const p = this.group.position;
    const pl = this.G.player;
    const walk = (target, sp)=>{
      const dx=target.x-p.x, dz=target.z-p.z, d=Math.hypot(dx,dz);
      if(d>0.2){ p.x+=dx/d*sp*dt; p.z+=dz/d*sp*dt; this.group.rotation.y=Math.atan2(dx,dz); }
      return d;
    };
    if(this.state==='patrol'){
      const target = this.dir>0?this.patrolB:this.patrolA;
      if(walk(target, 1.6)<0.3) this.dir*=-1;
      this.legL.rotation.x = Math.sin(this.t*8)*0.6;
      this.legR.rotation.x = -Math.sin(this.t*8)*0.6;
      if(pl && !pl.dead){
        const d = Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z);
        if(d<6.5 && Math.abs(pl.pos.y-p.y)<2){ this.state='rattle'; this.stateT=0; }
      }
    } else if(this.state==='rattle'){
      // telegraph: shake and chatter jaw
      this.group.position.x = p.x + Math.sin(this.t*40)*0.03;
      this.jaw.position.y = 1.02 + Math.abs(Math.sin(this.t*30))*0.06;
      if(this.stateT>0.55){
        this.state='lunge'; this.stateT=0;
        if(pl){ const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz)||1; this.lx=dx/d; this.lz=dz/d;
          this.group.rotation.y=Math.atan2(dx,dz); }
        AUDIO.noise({t:0.2,vol:0.2,fFrom:2500,fTo:600});
      }
    } else if(this.state==='lunge'){
      p.x += this.lx*7.5*dt; p.z += this.lz*7.5*dt;
      this.body && (this.body.rotation.x = 0.4);
      this.legL.rotation.x = 0.8; this.legR.rotation.x = -0.8;
      if(this.stateT>0.5){ this.state='rest'; this.stateT=0; }
    } else if(this.state==='rest'){
      this.jaw.position.y=1.02;
      if(this.stateT>0.8) { this.state='patrol'; this.stateT=0; }
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- Web Spider: hangs above path, drops, scuttles ----
class Spider extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hangY = y;              // y here = hanging height
    this.groundY = opts.groundY!==undefined?opts.groundY:0;
    this.state='hang'; this.stateT=0;
    this.hitR=0.5; this.headH=0.6; this.candyDrop=3;
    const spiderM = emat(0x6a5a92, 0x453a68, 0.4);   // lifted out of the murk so it reads on drop (readability pass)
    const body = mesh('sph',[0.38,9,8], spiderM); body.scale.set(1,0.8,1.15);
    const head = mesh('sph',[0.22,8,7], spiderM); head.position.set(0,0.05,0.42);
    const eM = emat(0xff5e5e,0xff5e5e,0.9);
    for(const [ex,ey] of [[-0.08,0.12],[0.08,0.12],[-0.14,0.04],[0.14,0.04]]){
      const e = mesh('sph',[0.045,5,5], eM); e.position.set(ex,ey+0.05,0.6); this.group.add(e);
    }
    this.legs=[];
    for(let s=-1;s<=1;s+=2) for(let i=0;i<4;i++){
      const leg = mesh('cyl',[0.03,0.02,0.7,4], spiderM);
      leg.position.set(s*0.4, 0.05, -0.25+i*0.18);
      leg.rotation.z = s*0.9;
      this.legs.push(leg); this.group.add(leg);
    }
    this.group.add(body, head);
    this.thread = new THREE.Mesh(geo('cyl',0.015,0.015,1,4), mat(0xcccccc));
    G.scene.add(this.group, this.thread);
    this.group.position.y = this.hangY;
  }
  update(dt){
    this.t+=dt; this.stateT+=dt;
    const p = this.group.position;
    const pl = this.G.player;
    // legs wiggle
    this.legs.forEach((l,i)=>{ l.rotation.x = Math.sin(this.t*10+i)*0.3; });
    if(this.state==='hang'){
      p.y = this.hangY + Math.sin(this.t*1.5)*0.25;
      this.thread.visible=true;
      const top = this.hangY+6;
      this.thread.position.set(p.x, (p.y+top)/2, p.z);
      this.thread.scale.y = (top-p.y);
      if(pl && !pl.dead && Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z)<2.8 && pl.pos.y<p.y){
        this.state='drop'; this.stateT=0;
        AUDIO.tone && AUDIO.tone({f:900,f2:200,type:'sawtooth',t:0.25,vol:0.12});
      }
    } else if(this.state==='drop'){
      p.y -= 16*dt;
      const top = this.hangY+6;
      this.thread.position.set(p.x,(p.y+top)/2,p.z);
      this.thread.scale.y = Math.max(top-p.y, 0.1);
      if(p.y<=this.groundY+0.35){ p.y=this.groundY+0.35; this.state='chase'; this.thread.visible=false;
        this.G.fx.spawn(p, 0x666677, 5, {speed:2, life:0.3}); }
    } else if(this.state==='chase'){
      if(pl && !pl.dead){
        const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz);
        if(d>0.5 && d<12){ p.x+=dx/d*3.4*dt; p.z+=dz/d*3.4*dt; this.group.rotation.y=Math.atan2(dx,dz); }
      }
    }
    this.touchPlayer(dt);
    if(this.state==='chase') this.updateShadow(); else this.shadow.visible=false;
  }
  die(){ this.thread.visible=false; this.G.scene.remove(this.thread); super.die(); }
}


// ---- Bonk Lantern: the "? block" of Grimmwick — hit/stomp it, a power-up pops out ----
class BonkLantern extends Enemy {
  constructor(G,x,y,z,drop){
    super(G,x,y,z);
    this.drop = drop||'shield';
    this.touchDamage = 0;
    this.hitR = 0.5; this.headH = 0.55;
    this.candyDrop = 0;
    G.scene.remove(this.shadow); // it floats — no blob shadow
    const body = mesh('sph',[0.42,10,8], emat(PAL.pumpkin, 0xff8c2e, 0.55));
    body.scale.set(1.12,0.9,1.12);
    const stem = mesh('cyl',[0.05,0.08,0.18,5], mat(PAL.stem)); stem.position.y=0.45;
    const fm = emat(0xffe08a, 0xffb02e, 1);
    const eL = mesh('cone',[0.08,0.12,3], fm); eL.position.set(-0.15,0.1,0.38);
    const eR = eL.clone(); eR.position.x=0.15;
    const mo = mesh('box',[0.24,0.06,0.05], fm); mo.position.set(0,-0.08,0.4);
    this.group.add(body, stem, eL, eR, mo);
    this.body = body;
    G.scene.add(this.group);
  }
  touchPlayer(){}
  takeHit(player, kind){
    if(this.dead) return;
    this.dead = true;
    AUDIO.stomp();
    const p = this.group.position;
    this.G.fx.spawn(p, PAL.pumpkin, 14, {speed:4});
    this.G.fx.spawn(p, 0xffe08a, 8, {speed:2.5});
    if(this.drop==='candy') candyBurst(this.G, p, 6);
    else this.G.ents.add(new PowerUp(p.x, p.y, p.z, this.drop));
  }
  update(dt){
    this.t += dt;
    const p = this.group.position;
    p.y = this.home.y + Math.sin(this.t*2.2)*0.12;
    this.group.rotation.y = this.t*1.6;
    this.body.scale.setScalar(1+Math.sin(this.t*4)*0.05);
  }
}


// ---- Barnaby the Barn Rat: goofy candy THIEF — scurries, steals, grows; bonk to get it all back ----
class Rat extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.hitR=0.55; this.headH=0.7; this.candyDrop=3;
    this.eaten = 0;
    this.state='idle'; this.stateT=rand(0,1);
    this.dashDir = 1;
    const fur = mat(0x8a7668);
    const furD = mat(0x6b5a4e);
    this.bodyM = mesh('sph',[0.42,10,8], fur); this.bodyM.position.y=0.38; this.bodyM.scale.set(1.25,0.85,1);
    const snout = mesh('cone',[0.2,0.42,7], furD); snout.rotation.z=-Math.PI/2; snout.position.set(0.55,0.4,0);
    const nose = mesh('sph',[0.07,6,5], mat(0xd97a8a)); nose.position.set(0.78,0.4,0);
    const earM = mat(0xb59a8c);
    this.earL = mesh('circ',[0.18,10], earM); this.earL.position.set(0.2,0.72,0.14); this.earL.rotation.y=0.4;
    this.earR = this.earL.clone(); this.earR.position.z=-0.14; this.earR.rotation.y=-0.4;
    const t1 = mesh('box',[0.05,0.1,0.04], mat(0xffffff)); t1.position.set(0.68,0.28,0.04);
    const t2 = t1.clone(); t2.position.z=-0.04;
    const eL = mesh('sph',[0.06,6,6], mat(0x14101f)); eL.position.set(0.45,0.52,0.18);
    const eR = eL.clone(); eR.position.z=-0.18;
    this.tail = mesh('cyl',[0.035,0.015,0.9,5], mat(0xd9a0a8));
    this.tail.position.set(-0.6,0.35,0); this.tail.rotation.z=1.1;
    this.group.add(this.bodyM, snout, nose, this.earL, this.earR, t1, t2, eL, eR, this.tail);
    G.scene.add(this.group);
  }
  die(){
    // cough it ALL back up, with interest
    this.candyDrop = 3 + this.eaten + Math.ceil(this.eaten*0.5);
    if(this.eaten>0 && window.UI) UI.toast('🐀 The rat coughed up '+(this.eaten+Math.ceil(this.eaten*0.5))+' candy! Thief!');
    super.die();
  }
  update(dt){
    this.t += dt; this.stateT += dt;
    const p = this.group.position;
    const pl = this.G.player;
    // find nearby loose candy to steal
    let target = null, bestD = 11;
    for(const e of this.G.ents.list){
      if(e.constructor.name!=='Candy' || e.dead || e.magnet) continue;
      if(e._placed) continue;                                   // rats steal LOOSE candy only — never the level's placed trails (all-candy star must stay winnable)
      if(Math.abs(e.group.position.y-p.y) > 1.6) continue;      // no telekinetic snacking on the high road
      const d = Math.hypot(e.group.position.x-p.x, e.group.position.z-p.z);
      if(d < bestD){ bestD = d; target = e; }
    }
    const plDist = pl ? Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) : 99;
    // scurry in dash bursts
    if(this.state==='idle'){
      if(this.stateT > 0.42){
        this.state='dash'; this.stateT=0;
        if(target && (bestD < plDist || plDist > 6)){
          this.tx = target.group.position.x; this.tz = target.group.position.z;
          this.dashSpeed = 6.5;
        } else if(plDist < 7){
          this.tx = p.x + Math.sign(p.x - pl.pos.x)*4 || 4;  // flee!
          this.tz = 0;
          this.dashSpeed = 7.5 + this.eaten*0.3;
        } else {
          this.tx = Math.abs(p.x - this.home.x) > 5 ? this.home.x : p.x + pick([-3,3]);
          this.tz = 0;
          this.dashSpeed = 5;
        }
        AUDIO.tone({f:900+rand(0,300), f2:1400, type:'sine', t:0.06, vol:0.06});
      }
    } else if(this.state==='dash'){
      const dx = this.tx - p.x, dzz = this.tz - p.z, dd = Math.hypot(dx,dzz)||1;
      p.x += dx/dd*this.dashSpeed*dt;
      p.z = clamp(p.z + dzz/dd*this.dashSpeed*dt, -2.6, 2.6);
      this.group.rotation.y = dx>0 ? Math.PI/2 : -Math.PI/2;
      this.tail.rotation.x = Math.sin(this.t*20)*0.5;
      this.bodyM.scale.y = 0.85 + Math.sin(this.t*24)*0.08;
      if(this.stateT > 0.38 || dd < 0.3){ this.state='idle'; this.stateT=0; }
    }
    // eat candy on contact — and GROW
    if(target && bestD < 1.15){
      target.dead = true;
      this.eaten++;
      this.group.scale.setScalar(Math.min(1 + this.eaten*0.07, 1.6));
      this.hitR = 0.55 * this.group.scale.x;
      AUDIO.tone({f:500,f2:300,type:'square',t:0.08,vol:0.1});
      this.G.fx.spawn(p, 0xff5ea8, 4, {speed:1.5, life:0.3, size:0.5});
      if(this.eaten===3 && window.UI) UI.toast('🐀 That rat is STEALING your candy!');
    }
    this.earL.rotation.z = Math.sin(this.t*9)*0.2;
    this.earR.rotation.z = -Math.sin(this.t*9)*0.2;
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- Swoop Bat: patrols the night air on a fixed loop; squeaks, then dives a fixed arc ----
// The dive targets a SNAPSHOT of the player's position — never homing, a sidestep always beats it.
class SwoopBat extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;              // fixed phase — identical flight every attempt (determinism rule)
    this.baseY = y;
    this.rangeX = opts.range||5;
    this.aggroR = opts.aggroR||5.5;
    this.period = opts.period||3.4;
    this.hitR=0.5; this.headH=0.5; this.hitY=0.15; this.touchR=0.6;
    this.candyDrop = 2;
    this.state='patrol'; this.st=0; this.cool=0;
    this.diveFrom=new THREE.Vector3(); this.diveTo=new THREE.Vector3();
    // moonlit lavender + emissive lift so the flyer reads clearly against the dark sky (owner readability pass)
    const bodyM = emat(0xb49ae0, 0x7a5fc0, 0.55);
    this.body = mesh('sph',[0.32,8,7], bodyM); this.body.scale.set(1,0.9,0.8);
    const belly = mesh('sph',[0.2,7,6], emat(0xe0d2f7, 0x8a72c0, 0.5)); belly.position.set(0,-0.05,0.18);
    this.earL = mesh('cone',[0.09,0.28,5], bodyM); this.earL.position.set(-0.14,0.32,0);
    this.earR = this.earL.clone(); this.earR.position.x=0.14;
    const eL = mesh('sph',[0.07,6,6], emat(0xffd34d, 0xffd34d, 1)); eL.position.set(-0.12,0.05,0.27);
    const eR = eL.clone(); eR.position.x=0.12;
    this.wingL = mesh('box',[0.55,0.05,0.3], bodyM); this.wingL.position.set(-0.42,0.05,0);
    this.wingR = this.wingL.clone(); this.wingR.position.x=0.42;
    const halo = new THREE.Mesh(geo('sph',0.5,10,8), new THREE.MeshBasicMaterial({color:0xffd34d, transparent:true, opacity:0.15, depthWrite:false})); halo.position.set(0,0.05,0);   // soft glow so the dive READS against dark backgrounds
    this.group.add(this.body, belly, this.earL, this.earR, eL, eR, this.wingL, this.wingR, halo);
    G.scene.add(this.group);
  }
  update(dt){
    this.t += dt;
    if(this.cool>0) this.cool -= dt;
    const p = this.group.position, pl = this.G.player;
    const flap = this.state==='dive' ? 14 : 8;
    this.wingL.rotation.z =  Math.sin(this.t*flap)*0.7;
    this.wingR.rotation.z = -Math.sin(this.t*flap)*0.7;
    if(this.state==='patrol'){
      const ph = this.t*(TAU/this.period);
      p.x = this.home.x + Math.sin(ph)*this.rangeX;
      p.y = this.baseY + Math.sin(ph*2)*0.35;
      this.group.rotation.y = Math.cos(ph)>=0 ? Math.PI/2 : -Math.PI/2;
      if(pl && !pl.dead && this.cool<=0){
        const dx = pl.pos.x-p.x;
        if(Math.abs(dx)<this.aggroR && pl.pos.y < p.y+0.5){
          this.state='telegraph'; this.st=0;
          AUDIO.noise({t:0.14, vol:0.2, fFrom:1500, fTo:950});   // the squeak IS the warning
        }
      }
    } else if(this.state==='telegraph'){
      this.st += dt;
      p.y += Math.sin(this.st*40)*0.02;                          // agitated hover
      if(this.st>0.45 && pl){
        this.state='dive'; this.st=0;
        this.diveFrom.copy(p);
        this.diveTo.set(pl.pos.x, pl.pos.y+0.3, 0);              // snapshot taken NOW — move and it misses
      }
    } else if(this.state==='dive'){
      this.st += dt;
      const u = Math.min(this.st/0.55, 1);
      p.x = this.diveFrom.x + (this.diveTo.x-this.diveFrom.x)*u;
      p.y = this.diveFrom.y + (this.diveTo.y-this.diveFrom.y)*u*u;
      if(u>=1){ this.state='recover'; this.st=0; this.diveFrom.copy(p); }
    } else { // recover — climb back to the patrol line
      this.st += dt;
      const u = Math.min(this.st/0.9, 1);
      p.y = this.diveFrom.y + (this.baseY-this.diveFrom.y)*u;
      if(u>=1){
        this.state='patrol'; this.cool = 1.6;
        this.home.x = p.x - Math.sin(this.t*(TAU/this.period))*this.rangeX;  // resume patrol from here, no teleport
      }
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ============ CURSED CASTLE ROSTER — District 5 enemies (Clockwork Knight, Shadow Copy, Mirror Boo) ============
// Extends the Enemy base in 07_enemies.js. Same contract: isEnemy/hitR/headH/hitY/touchDamage/touchR, update(dt)
// calls touchPlayer + updateShadow, inherit takeHit/die (kinds 'swing'/'stomp'/'pound'/'moon'/'salt'). Register via
// G.ents.add. DETERMINISTIC: fixed clocks (this.t from opts.phase) + player-proximity state machines — NO Math.random
// on the critical path (rand() seeded per area = cosmetic jitter only; base seeds this.t=rand so classes override it).
// EMISSIVE-LIFTED so brass knights / purple-black shadows POP against the gunmetal castle. Colour language: clockwork
// reads BRASS/VERDIGRIS, Grimm's shadow-brew reads PURPLE-BLACK, the danger/attack tell reads a bright flash. The
// finale's "shadow-copies of everything" theme also licenses reusing earlier D1-D4 enemies as shadow-tinted threats.

// ---- Clockwork Knight: an armored automaton that BOWS before every attack — the courtly bow IS the telegraph
// (Mario-hard fairness, played for pomp). It stands/patrols slowly; when the player is in range it bows (tips forward
// ~0.6s), then LUNGES forward with a sword-sweep, then winds back up. Armored hp2 (a spin/stomp chips, a pound one-shots).
// Only bites during the lunge — the bow always gives you the out. ----
class ClockworkKnight extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hp = 2; this.hitR=0.6; this.headH=1.5; this.hitY=0.7; this.touchR=0.78; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.groundY=y; this.range=opts.range||2.4; this.dir=opts.dir||-1; this.speed=opts.speed||1.4;
    this.wakeR=opts.wakeR||4.5; this.lungeSpeed=opts.lungeSpeed||8.0;
    this.state='patrol'; this.st=0; this.touchDamage=1;
    const steel=emat(0x6a6f7a,0x3a3f48,0.4), brass=emat(0x9a8a4a,0x5a4f20,0.45), dark=emat(0x2f2a3a,0x1a1626,0.3);
    // armored body + helm with a glowing visor slit
    const body = mesh('box',[0.8,1.1,0.6], steel); body.position.y=0.85; this.group.add(body);
    for(let i=0;i<3;i++){ const plate=mesh('box',[0.84,0.1,0.62], brass); plate.position.y=0.5+i*0.32; this.group.add(plate); }
    const helm = mesh('sph',[0.34,9,8], steel); helm.position.y=1.55; helm.scale.set(1,1.15,1); this.group.add(helm);
    this.visor = mesh('box',[0.4,0.09,0.05], emat(0xff5e7a,0xff5e7a,1)); this.visor.position.set(0,1.55,0.34); this.group.add(this.visor);
    // a shoulder pauldron + the sword arm (swings on lunge)
    this.arm = new THREE.Group();
    const sword = mesh('box',[0.08,1.0,0.05], emat(0xb8bcc8,0x6a6f7a,0.4)); sword.position.y=0.5; this.arm.add(sword);
    const hilt = mesh('box',[0.24,0.1,0.1], brass); hilt.position.y=0.05; this.arm.add(hilt);
    this.arm.position.set(0.5,1.0,0.15); this.arm.rotation.z=-0.3; this.group.add(this.arm);
    this.legs=[]; for(const lx of [-0.22,0.22]){ const lg=mesh('box',[0.22,0.5,0.28], dark); lg.position.set(lx,0.25,0); this.legs.push(lg); this.group.add(lg); }
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    if(this.state==='patrol'){
      this.touchDamage=1;
      p.x += this.speed*this.dir*dt;
      if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; }
      else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; }
      this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
      this.arm.rotation.z = damp(this.arm.rotation.z, -0.3, 6, dt);
      this.legs.forEach((l,i)=>{ l.rotation.x=Math.sin(this.t*4+i*Math.PI)*0.3; });
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<2 && pl.pos.y<p.y+1.8){
        this.state='bow'; this.st=0; this.dir=(pl.pos.x<p.x)?-1:1; this.group.rotation.y=this.dir>0?Math.PI/2:-Math.PI/2;
        AUDIO.noise && AUDIO.noise({t:0.14,vol:0.1,fFrom:500,fTo:800});   // a courtly *creak* — "A THRUST!"
      }
    } else if(this.state==='bow'){
      // the BOW — tips forward, sword rears back (~0.6s telegraph)
      this.group.rotation.x = damp(this.group.rotation.x, 0.4, 8, dt);
      this.arm.rotation.z = damp(this.arm.rotation.z, -1.6, 8, dt);
      if(this.st>0.6){ this.state='lunge'; this.st=0; }
    } else if(this.state==='lunge'){
      this.group.rotation.x = damp(this.group.rotation.x, 0, 10, dt);
      this.arm.rotation.z = damp(this.arm.rotation.z, 0.6, 14, dt);   // the sweep
      p.x += this.dir*this.lungeSpeed*dt;
      if(this.st>0.4){ this.state='recover'; this.st=0; }
    } else { // recover — wind back up, briefly harmless
      this.touchDamage=0;
      this.arm.rotation.z = damp(this.arm.rotation.z, -0.3, 6, dt);
      if(this.st>0.7){ this.state='patrol'; this.st=0; }
    }
    this.visor.material.emissiveIntensity = this.state==='bow' ? 0.4+Math.sin(this.t*18)*0.4 : 1;
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- Shadow Copy: a purple-black spectral copy poured from Grimm's brew that CHASES on the lane (never freezes,
// never stops). A wispy shadow-Pip silhouette with hot-violet eyes. hp1 stomp. The Gift-Box ambush spawns these. ----
class ShadowCopy extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.speed = opts.speed||3.0;
    this.hitR=0.5; this.headH=1.05; this.hitY=0.5; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:2;
    const shadowM = new THREE.MeshLambertMaterial({color:0x2a2440, emissive:0x6a3fbf, emissiveIntensity:0.5, transparent:true, opacity:0.86});
    this.bodyMat = shadowM;
    const body = new THREE.Mesh(geo('sph',0.44,10,9), shadowM); body.position.y=0.7; body.scale.set(1,1.2,0.85); this.group.add(body);
    const tail = new THREE.Mesh(geo('cone',0.4,0.7,8), shadowM); tail.rotation.x=Math.PI; tail.position.y=0.2; this.group.add(tail);
    this.eyeL = mesh('sph',[0.07,6,6], emat(0xc77bff,0xc77bff,1)); this.eyeL.position.set(-0.14,0.82,0.36);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.14; this.group.add(this.eyeL,this.eyeR);
    this.wisp=[]; for(let i=0;i<3;i++){ const w=new THREE.Mesh(geo('sph',0.1,6,5), shadowM); this.wisp.push(w); this.group.add(w); }
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player, p=this.group.position;
    p.y = this.home.y + Math.sin(this.t*3)*0.14 + 0.35;
    if(pl && !pl.dead){
      const dx=pl.pos.x-p.x, d=Math.abs(dx)||1;
      if(d>1.0){ p.x += Math.sign(dx)*this.speed*dt; this.group.rotation.y = dx>0?Math.PI/2:-Math.PI/2; }
    }
    // trailing shadow wisps (cosmetic)
    this.wisp.forEach((w,i)=>{ const a=this.t*4 - i*0.5; w.position.set(Math.sin(a)*0.3, 0.5-i*0.12, -0.2-i*0.1); w.scale.setScalar(0.8-i*0.2); });
    this.bodyMat.emissiveIntensity = 0.4+Math.sin(this.t*6)*0.15;
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- Mirror Boo: a shadow-ghost that MIRRORS the player — it hovers and slides to the opposite side of its home as
// the player moves (approach from the left and it drifts right, and vice versa), dipping to threaten when you cross.
// A disorienting air floater; hp1. The tell: it always mirrors your move, so you feint it into an opening. ----
class MirrorBoo extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hoverY = y; this.range = opts.range||4.5; this.mirror = opts.mirror!==undefined?opts.mirror:0.8;
    this.hitR=0.5; this.headH=1.0; this.hitY=0.5; this.touchR=0.64; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    const ghostM = new THREE.MeshLambertMaterial({color:0x3a2f55, emissive:0x7a5fbf, emissiveIntensity:0.5, transparent:true, opacity:0.8});
    this.bodyMat = ghostM;
    const body = new THREE.Mesh(geo('sph',0.46,10,9), ghostM); body.position.y=0; body.scale.set(1,1.1,0.9); this.group.add(body);
    const tail = new THREE.Mesh(geo('cone',0.4,0.55,8), ghostM); tail.rotation.x=Math.PI; tail.position.y=-0.45; this.group.add(tail);
    // a cracked-mirror shard on its face + eyes
    const shard = mesh('box',[0.34,0.4,0.03], emat(0xb9b9e0,0x6a6aa0,0.4)); shard.position.set(0,0.05,0.4); shard.rotation.z=0.2; this.group.add(shard);
    this.eyeL = mesh('sph',[0.07,6,6], emat(0xc77bff,0xc77bff,1)); this.eyeL.position.set(-0.15,0.1,0.42);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.15; this.group.add(this.eyeL,this.eyeR);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player, p=this.group.position;
    if(pl && !pl.dead){
      // mirror: target x = home reflected AWAY from the player's offset (approach → it slides opposite)
      const off = pl.pos.x - this.home.x;
      const targetX = this.home.x - off*this.mirror;
      const clamped = clamp(targetX, this.home.x-this.range, this.home.x+this.range);
      p.x = damp(p.x, clamped, 5, dt);
    }
    // dip on a slow bob (the threat window when it crosses your lane)
    p.y = this.hoverY + Math.sin(this.t*1.6)*0.6;
    this.bodyMat.emissiveIntensity = 0.4+Math.sin(this.t*5)*0.15;
    this.eyeL.scale.setScalar(0.9+Math.sin(this.t*8)*0.2); this.eyeR.scale.setScalar(this.eyeL.scale.x);
    this.touchPlayer(dt); this.updateShadow();
  }
}

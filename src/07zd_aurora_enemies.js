// ============ AURORA PALACE ROSTER — Winter District 5 enemies (Frost Herald, Mirror Frost, Aurora Wisp, Frost Knight) ============
// Where the cold sits crowned: the FIRST FROST's palace — the very first winter, forgotten because the town
// only ever celebrated the warmth. Its court is regal, formal, and lonely. Same Enemy contract; fixed clocks;
// no Math.random on the critical path. Colour language: palace ice + regal silver/gold; the cold reads cyan.

// ---- FROST HERALD: a court trumpeter spirit. Raises its long silver horn (0.7s — the bell-gleam is the
// telegraph, and a rising inhale note) then BLOWS: a freezing gust-beam sweeps a short horizontal lane
// (duck under it or hop it, and it PUSHES while it bites). Then a courteous bow-pause. hp1. ----
class FrostHerald extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=1.2; this.hitY=0.55; this.touchR=0.68; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.period=opts.period||5.2; this.beamY=opts.beamY!==undefined?opts.beamY:y+0.9; this.reach=opts.reach||4.2;
    this.dir=opts.dir||-1;
    this.state='court'; this.st=0;
    const robeM = new THREE.MeshLambertMaterial({color:0x8a9fd0, emissive:0x5a7ac0, emissiveIntensity:0.3, transparent:true, opacity:0.82});
    const robe=new THREE.Mesh(geo('cone',0.5,1.3,9), robeM); robe.position.y=0.65; this.group.add(robe);
    const head=new THREE.Mesh(geo('sph',0.28,9,8), robeM); head.position.y=1.45; this.group.add(head);
    const crown=mesh('tor',[0.2,0.03,4,10], emat(0xc9d4ec,0x8a9fd0,0.6)); crown.position.y=1.62; crown.rotation.x=0.3; this.group.add(crown);
    for(const s of [-1,1]){ const eye=mesh('sph',[0.05,5,4], emat(0x7ae8ff,0x7ae8ff,1)); eye.position.set(s*0.1,1.48,0.24); this.group.add(eye); }
    // the horn — long, silver, ceremonial
    this.horn=new THREE.Group();
    const tube=mesh('cyl',[0.045,0.09,1.5,7], emat(0xc9d4ec,0x8a9fd0,0.5)); tube.rotation.z=Math.PI/2; tube.position.x=0.75; this.horn.add(tube);
    const bell=mesh('cone',[0.22,0.3,9], emat(0xdfe8fa,0xaac0e8,0.6)); bell.rotation.z=-Math.PI/2; bell.position.x=1.55; this.horn.add(bell);
    this.horn.position.set(0.2,1.3,0.1); this.horn.rotation.z=-0.5; this.group.add(this.horn);
    // the gust beam (hidden; scaled out during the blow). Local +z maps to world ±x under the group's
    // ±π/2 facing — depth is the beam's long axis, and +z is correct for BOTH facings (world_x = dir·z).
    this.beam = new THREE.Mesh(geo('box',0.9,0.5,1), new THREE.MeshBasicMaterial({color:0xbfe8ff, transparent:true, opacity:0.4, depthWrite:false}));
    this.beam.visible=false; this.group.add(this.beam);
    G.scene.add(this.group);
    this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    const cyc=this.t % this.period;
    if(this.state==='court'){
      this.horn.rotation.z = damp(this.horn.rotation.z, -0.5, 6, dt);
      this.beam.visible=false;
      this.group.position.y = this.home.y + Math.sin(this.t*2)*0.08;
      if(cyc >= this.period-1.5 && cyc < this.period-0.8){ this.state='raise'; this.st=0;
        AUDIO.tone && AUDIO.tone({f:392,f2:523,type:'triangle',t:0.5,vol:0.1}); }   // the inhale — rising third
    } else if(this.state==='raise'){
      // the horn comes up level — 0.7s of unmistakable ceremony
      this.horn.rotation.z = damp(this.horn.rotation.z, 0, 10, dt);
      if(this.st>0.7){ this.state='blow'; this.st=0;
        this.beam.visible=true;
        AUDIO.noise && AUDIO.noise({t:0.6,vol:0.16,fFrom:1200,fTo:400}); }
    } else { // blow — the gust lane extends, bites, and pushes
      const k=Math.min(this.st/0.55,1);
      const len=this.reach*k;
      this.beam.scale.set(1,1,Math.max(0.01,len));
      this.beam.position.set(0, this.beamY-p.y, 0.8+len/2);   // local +z → world dir·x for both facings
      // world-space beam occupancy: from the horn outward along dir
      const bx0=p.x+this.dir*0.8, bx1=p.x+this.dir*(0.8+len);
      if(pl && !pl.dead){
        const lo=Math.min(bx0,bx1), hi=Math.max(bx0,bx1);
        if(pl.pos.x>lo && pl.pos.x<hi && Math.abs(pl.pos.z-p.z)<1.1 &&
           pl.pos.y+1.2 > this.beamY-0.35 && pl.pos.y < this.beamY+0.35){
          pl.vel.x += this.dir*14*dt;   // the shove
          pl.damage(1, new THREE.Vector3(p.x,this.beamY,p.z));
        }
      }
      if(this.st>1.0){ this.state='court'; this.st=0; this.beam.visible=false; }
    }
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- MIRROR FROST: a walking pane of palace ice with Pip's frosted silhouette caught inside — it MIRRORS
// your horizontal movement (you step left, it steps right) within its hall. Feint it to the wall, then run
// by. hp1 spin (it shatters gorgeously). The palace remembers everyone who ever walked its halls. ----
class MirrorFrost extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.range=opts.range||5; this.mirror=opts.mirror!==undefined?opts.mirror:1.0;
    this.hitR=0.5; this.headH=1.4; this.hitY=0.65; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    const paneM = new THREE.MeshLambertMaterial({color:0xcfe0f4, emissive:0x7ab0e0, emissiveIntensity:0.3, transparent:true, opacity:0.5});
    const pane=new THREE.Mesh(geo('box',0.9,1.5,0.16), paneM); pane.position.y=0.75; this.group.add(pane);
    const frame=mesh('box',[1.0,1.62,0.1], mat(0x8a9fd0)); frame.position.y=0.75; frame.position.z=-0.05; this.group.add(frame);
    // the silhouette inside — a frost-sketch of a small person, mid-step
    const sil = new THREE.MeshBasicMaterial({color:0xeef6ff, transparent:true, opacity:0.55, depthWrite:false});
    const sbody=new THREE.Mesh(geo('sph',0.2,7,6), sil); sbody.position.set(0,0.7,0.02); sbody.scale.set(1,1.4,0.4); this.group.add(sbody);
    const shead=new THREE.Mesh(geo('sph',0.13,7,6), sil); shead.position.set(0,1.12,0.02); shead.scale.z=0.4; this.group.add(shead);
    for(const s of [-1,1]){ const sleg=new THREE.Mesh(geo('cyl',0.05,0.05,0.36,4), sil); sleg.position.set(s*0.09,0.28,0.02); sleg.scale.z=0.4; this.group.add(sleg); }
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player, p=this.group.position;
    if(pl && !pl.dead){
      // mirrored walk: it moves opposite your x-velocity, clamped to its hall
      const step = -pl.vel.x*this.mirror*dt;
      p.x = clamp(p.x + step, this.home.x-this.range, this.home.x+this.range);
      this.group.rotation.y = pl.vel.x>0.2 ? -0.15 : pl.vel.x<-0.2 ? 0.15 : 0;
    }
    this.group.position.y = this.home.y + Math.sin(this.t*2.4)*0.06;
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- AURORA WISP: a ribbon-spirit swimming a fixed sine lane, trailing a short FREEZING WAKE — glowing
// trail segments that bite for ~0.8s then fade (the fading color IS the countdown). The threat is where it
// WAS, not where it is: cross behind it on the fade, never on the glow. Unkillable (it is weather). ----
class AuroraWisp {
  constructor(G, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false;
    this.x0=opts.x0||0; this.x1=opts.x1||18; this.y=opts.y!==undefined?opts.y:2.2;
    this.period=opts.period||7; this.amp=opts.amp||0.9; this.t=opts.phase||0;
    this.group=new THREE.Group();
    const cc=opts.color||pick([0x58e0a8,0x7ae8ff,0xb08aff]);
    const headM=new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.8, transparent:true, opacity:0.75});
    this.head=new THREE.Mesh(geo('sph',0.28,8,7), headM); this.group.add(this.head);
    this.ribbon=[];
    for(let i=0;i<5;i++){ const seg=new THREE.Mesh(geo('sph',0.2-i*0.03,7,6), headM.clone()); seg.material.opacity=0.55-i*0.09; this.group.add(seg); this.ribbon.push(seg); }
    // the wake — pooled trail markers (bite 0.8s, fade out)
    this.wake=[];
    for(let i=0;i<7;i++){ const w={m:new THREE.Mesh(geo('sph',0.24,7,6), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0, depthWrite:false})), age:99, x:0, y:0};
      this.group.add(w.m); this.wake.push(w); }
    this._drop=0;
    G.scene.add(this.group);
  }
  _pos(t){
    const span=this.x1-this.x0, P=this.period;
    const k=(t%(P*2))/P;
    const kk=k<1?k:2-k;
    return {x:this.x0+span*kk, y:this.y+Math.sin(t*2.1)*this.amp};
  }
  update(dt, G){
    this.t+=dt;
    const c=this._pos(this.t);
    this.head.position.set(c.x, c.y, 0);
    for(let i=0;i<this.ribbon.length;i++){ const pp=this._pos(this.t-(i+1)*0.12); this.ribbon[i].position.set(pp.x,pp.y,0); }
    // drop a wake marker every 0.45s
    this._drop-=dt;
    if(this._drop<=0){ this._drop=0.45;
      const w=this.wake.reduce((a,b)=>a.age>b.age?a:b);
      w.age=0; w.x=c.x; w.y=c.y; w.m.position.set(c.x,c.y,0);
    }
    const pl=G.player;
    for(const w of this.wake){
      w.age+=dt;
      const alive=w.age<0.8;
      w.m.material.opacity = alive ? 0.5*(1-w.age/0.8)+0.15 : Math.max(0, 0.15-(w.age-0.8)*0.5);
      w.m.scale.setScalar(alive?1:1+(w.age-0.8)*1.5);
      if(alive && pl && !pl.dead && Math.abs(pl.pos.x-w.x)<0.5 && Math.abs(pl.pos.z)<0.9 && pl.pos.y+1.1>w.y-0.4 && pl.pos.y<w.y+0.4){
        pl.damage(1, new THREE.Vector3(w.x,w.y,0));
      }
    }
    // the head itself bites too (standard)
    if(pl && !pl.dead && Math.abs(pl.pos.x-c.x)<0.55 && Math.abs(pl.pos.z)<0.9 && pl.pos.y+1.1>c.y-0.4 && pl.pos.y<c.y+0.4){
      pl.damage(1, new THREE.Vector3(c.x,c.y,0));
    }
  }
}

// ---- FROST KNIGHT: the palace guard — ice armor, a glass halberd, and the COURTLY BOW before every lunge
// (the Cursed Castle's law, learned by the First Frost long ago from watching the Keep: the vets will smile).
// Bow 0.7s → lunge → recover. hp2 (a pound one-shots). ----
class FrostKnight extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hp=2; this.hitR=0.6; this.headH=1.5; this.hitY=0.7; this.touchR=0.78; this.candyDrop=opts.candy!==undefined?opts.candy:5;
    this.groundY=y; this.range=opts.range||2.4; this.dir=opts.dir||-1; this.speed=opts.speed||1.5;
    this.wakeR=opts.wakeR||4.5; this.lungeSpeed=opts.lungeSpeed||8.5;
    this.state='patrol'; this.st=0; this.touchDamage=1;
    const iceA = new THREE.MeshLambertMaterial({color:0xbfd4ec, emissive:0x7a9fd0, emissiveIntensity:0.35, transparent:true, opacity:0.85});
    const dark = emat(0x2a3450,0x1a2036,0.2);
    const body=new THREE.Mesh(geo('box',0.8,1.1,0.6), iceA); body.position.y=0.85; this.group.add(body);
    for(let i=0;i<3;i++){ const plate=new THREE.Mesh(geo('box',0.84,0.1,0.62), dark); plate.position.y=0.5+i*0.32; this.group.add(plate); }
    const helm=new THREE.Mesh(geo('sph',0.34,9,8), iceA); helm.position.y=1.55; helm.scale.set(1,1.2,1); this.group.add(helm);
    const plume=mesh('cone',[0.08,0.4,5], emat(0x7ae8ff,0x7ae8ff,0.8)); plume.position.set(0,1.95,0); this.group.add(plume);
    this.visor=mesh('box',[0.4,0.09,0.05], emat(0x7ae8ff,0x7ae8ff,1)); this.visor.position.set(0,1.55,0.34); this.group.add(this.visor);
    this.arm=new THREE.Group();
    const haft=new THREE.Mesh(geo('cyl',0.045,0.045,1.3,5), dark); haft.position.y=0.5; this.arm.add(haft);
    const blade=new THREE.Mesh(geo('cone',0.2,0.5,4), iceA); blade.position.y=1.2; this.arm.add(blade);
    this.arm.position.set(0.5,0.9,0.15); this.arm.rotation.z=-0.3; this.group.add(this.arm);
    this.legs=[]; for(const lx of [-0.22,0.22]){ const lg=new THREE.Mesh(geo('box',0.22,0.5,0.28), dark); lg.position.set(lx,0.25,0); this.legs.push(lg); this.group.add(lg); }
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
        AUDIO.noise && AUDIO.noise({t:0.14,vol:0.1,fFrom:600,fTo:900});
      }
    } else if(this.state==='bow'){
      this.group.rotation.x = damp(this.group.rotation.x, 0.42, 8, dt);
      this.arm.rotation.z = damp(this.arm.rotation.z, -1.6, 8, dt);
      if(this.st>0.7){ this.state='lunge'; this.st=0; }
    } else if(this.state==='lunge'){
      this.group.rotation.x = damp(this.group.rotation.x, 0, 10, dt);
      this.arm.rotation.z = damp(this.arm.rotation.z, 0.6, 14, dt);
      p.x += this.dir*this.lungeSpeed*dt;
      if(this.st>0.4){ this.state='recover'; this.st=0; }
    } else {
      this.touchDamage=0;
      this.arm.rotation.z = damp(this.arm.rotation.z, -0.3, 6, dt);
      if(this.st>0.7){ this.state='patrol'; this.st=0; }
    }
    this.visor.material.emissiveIntensity = this.state==='bow' ? 0.4+Math.sin(this.t*18)*0.4 : 1;
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- THE FLURRY TRIPLETS: three spiky snowflake-orb spirits rolling fixed lanes — the last trio (the signs
// have made their peace with it). SnowballRoller clock, six-pointed frost skin. ----
class FlurryTriplet extends SnowballRoller {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z, Object.assign({r0:0.8, r1:0.8, speed:opts.speed||4.6}, opts));
    this.candyDrop = opts.candy!==undefined?opts.candy:4;
    this.ball.material = new THREE.MeshLambertMaterial({color:0xdfe8fa, emissive:0x7ae8ff, emissiveIntensity:0.45, transparent:true, opacity:0.85});
    for(let i=0;i<6;i++){ const a=i/6*TAU; const spike=new THREE.Mesh(geo('cone',0.12,0.5,4), this.ball.material);
      spike.position.set(Math.cos(a)*0.85, Math.sin(a)*0.85, 0); spike.rotation.z=a-Math.PI/2; this.ball.add(spike); }
    const core=mesh('sph',[0.24,7,6], emat(0x7ae8ff,0x7ae8ff,1)); this.ball.add(core);
  }
}

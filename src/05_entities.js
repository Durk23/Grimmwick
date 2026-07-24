// ============ ENTITIES — pickups (candy, hearts, golden pumpkins), helpers ============
class EntityMgr {
  constructor(scene){
    this.scene = scene;
    this.list = [];
  }
  add(e){ this.list.push(e); if(e.group) this.scene.add(e.group); return e; }
  update(dt, G){
    for(let i=this.list.length-1;i>=0;i--){
      const e = this.list[i];
      if(e.dead){ if(e.group) this.scene.remove(e.group); this.list.splice(i,1); continue; }
      if(e.cull!==false && G.player){
        const d = e.group ? Math.abs(e.group.position.x-G.player.pos.x)+Math.abs(e.group.position.z-G.player.pos.z) : 0;
        if(d>70) continue;
      }
      e.update(dt, G);
    }
  }
  clear(){
    for(const e of this.list){ if(e.group) this.scene.remove(e.group); }
    this.list.length=0;
  }
}

// ---- candy pickup ----
const CANDY_COLORS = [PAL.candy1, PAL.candy2, PAL.candy3];
class Candy {
  constructor(x,y,z, opts={}){
    this.group = new THREE.Group();
    const color = pick(CANDY_COLORS);
    const body = mesh('sph',[0.22,8,6], emat(color, color, 0.45));
    body.scale.set(1,0.75,0.75);
    const w1 = mesh('cone',[0.12,0.18,5], emat(color,color,0.45)); w1.rotation.z = Math.PI/2; w1.position.x = -0.3;
    const w2 = w1.clone(); w2.rotation.z = -Math.PI/2; w2.position.x = 0.3;
    this.group.add(body,w1,w2);
    this.group.position.set(x,y,z);
    this.base = y;
    this.t = rand(0,6);
    this.magnet = false;
    this.pop = opts.pop||null; // pop physics when dropped by enemy
    this.dead = false;
    this.shadow = null;
  }
  update(dt, G){
    this.t += dt;
    const p = this.group.position;
    if(this.pop){
      this.pop.vy -= 18*dt;
      p.x += this.pop.vx*dt; p.z += this.pop.vz*dt; p.y += this.pop.vy*dt;
      const gh = G.world.groundHeight(p.x,p.z,p.y+1);
      const floor = (gh>-Infinity?gh:0)+0.3;
      if(p.y<=floor && this.pop.vy<0){ p.y=floor; this.pop.vy*=-0.4; this.pop.vx*=0.7; this.pop.vz*=0.7; if(Math.abs(this.pop.vy)<0.8){this.pop=null; this.base=p.y;} }
    } else if(!this.magnet){
      p.y = this.base + Math.sin(this.t*2.6)*0.12;
    }
    this.group.rotation.y = this.t*2.2;
    const pl = G.player;
    if(pl && !pl.dead){
      const dx=pl.pos.x-p.x, dy=(pl.pos.y+0.8)-p.y, dz=pl.pos.z-p.z;
      const d2 = dx*dx+dy*dy+dz*dz;
      if(d2 < 12) this.magnet = true;
      if(this.magnet){
        const d = Math.sqrt(d2)||0.001;
        const sp = 14*dt/d;
        p.x += dx*sp; p.y += dy*sp; p.z += dz*sp;
        if(d<0.7){
          this.dead = true;
          G.addCandy(1);
          if(this._placed) G.runCandyPicked = (G.runCandyPicked||0)+1;   // all-candy star counts placed candy only
          AUDIO.candy(G.save.candy);
          G.fx.spawn(p, pick(CANDY_COLORS), 4, {speed:2, life:0.3, size:0.5});
        }
      }
    }
  }
}
function candyLine(G, pts, n){
  // scatter candies along a polyline/arc of points
  for(let i=0;i<n;i++){
    const t = i/(n-1);
    const seg = Math.min(Math.floor(t*(pts.length-1)), pts.length-2);
    const lt = t*(pts.length-1)-seg;
    const a=pts[seg], b=pts[seg+1];
    G.ents.add(new Candy(lerp(a[0],b[0],lt), lerp(a[1],b[1],lt), lerp(a[2],b[2],lt)));
  }
}
function candyBurst(G, pos, n){
  for(let i=0;i<n;i++){
    // scatter along the lane, barely in depth — side-scroller drops must stay reachable
    const c = new Candy(pos.x, pos.y+0.5, pos.z, {pop:{vx:rand(-3.5,3.5), vy:rand(4,8), vz:rand(-0.7,0.7)}});
    G.ents.add(c);
  }
}

// ---- heart pickup ----
class Heart {
  constructor(x,y,z){
    this.group = new THREE.Group();
    const m = emat(0xff4d6d, 0xff4d6d, 0.5);
    const l = mesh('sph',[0.2,8,7],m); l.position.x=-0.13;
    const r = mesh('sph',[0.2,8,7],m); r.position.x=0.13;
    const b = mesh('cone',[0.29,0.42,4],m); b.rotation.x=Math.PI; b.rotation.y=Math.PI/4; b.position.y=-0.24;
    this.group.add(l,r,b);
    this.group.position.set(x,y,z);
    this.base=y; this.t=rand(0,9); this.dead=false;
  }
  update(dt,G){
    this.t+=dt;
    this.group.position.y = this.base+Math.sin(this.t*2)*0.15;
    this.group.rotation.y = this.t*1.8;
    const pl=G.player;
    if(pl && !pl.dead && this.group.position.distanceTo(new THREE.Vector3(pl.pos.x,pl.pos.y+0.8,pl.pos.z))<1.1){
      if(pl.hearts < pl.maxHearts){
        this.dead=true; pl.heal(1); AUDIO.heart();
        G.fx.spawn(this.group.position, 0xff4d6d, 10, {speed:2.5});
      }
    }
  }
}

// ---- golden pumpkin (hidden collectible) ----
class GoldPumpkin {
  constructor(x,y,z,idx){
    this.group = new THREE.Group();
    const body = mesh('sph',[0.5,10,8], emat(PAL.gold, PAL.gold, 0.55));
    body.scale.set(1.15,0.85,1.15);
    const stem = mesh('cyl',[0.07,0.1,0.28,5], mat(PAL.stem)); stem.position.y=0.45;
    // ridges
    for(let i=0;i<4;i++){
      const r = mesh('sph',[0.5,8,8], emat(0xffdf70, PAL.gold, 0.45));
      r.scale.set(0.92,0.8,0.28);
      r.rotation.y = i*Math.PI/4;
      this.group.add(r);
    }
    this.group.add(body,stem);
    const glow = new THREE.PointLight(PAL.gold, 40, 7); glow.position.y=0.5;
    this.group.add(glow);
    this.group.position.set(x,y,z);
    this.base=y; this.t=0; this.idx=idx; this.dead=false;
  }
  update(dt,G){
    this.t+=dt;
    this.group.position.y=this.base+Math.sin(this.t*1.6)*0.2;
    this.group.rotation.y=this.t*1.4;
    const pl=G.player;
    if(pl && !pl.dead && this.group.position.distanceTo(new THREE.Vector3(pl.pos.x,pl.pos.y+0.8,pl.pos.z))<1.5){
      this.dead=true;
      G.collectGoldPumpkin(this.idx);
      G.fx.spawn(this.group.position, PAL.gold, 22, {speed:4, life:1});
      AUDIO.goldPumpkin();
    }
  }
}

// ---- checkpoint lantern ----
class Checkpoint {
  constructor(x,y,z,idx,opts={}){
    this.group = new THREE.Group();
    const pole = mesh('cyl',[0.09,0.12,2.6,6], mat(0x2c2140)); pole.position.y=1.3;
    const cage = mesh('box',[0.55,0.6,0.55], mat(0x2c2140)); cage.position.y=2.75;
    this.flame = mesh('sph',[0.19,8,6], emat(0x666688, 0x666688, 0.8)); this.flame.position.y=2.75;
    // soft glow halo — invisible until lit, then stays glowing so a passed checkpoint reads as ON for the rest of the level
    this.halo = new THREE.Mesh(geo('sph',0.7,10,8), new THREE.MeshBasicMaterial({color:PAL.purpleFx, transparent:true, opacity:0, depthWrite:false}));
    this.halo.position.y=2.75; this.halo.renderOrder=1;
    this.group.add(pole,cage,this.flame,this.halo);
    // opts.noLight: emissive flame only, no real PointLight (keeps long levels within the ~6-light budget)
    if(!opts.noLight){ this.light = new THREE.PointLight(0x9955ff, 0, 10); this.light.position.y=2.8; this.group.add(this.light); }
    this.group.position.set(x,y,z);
    this.idx=idx; this.lit=false; this.dead=false; this.t=0;
  }
  update(dt,G){
    this.t+=dt;
    if(this.lit){
      const pulse = 1+Math.sin(this.t*7)*0.15;
      this.flame.scale.setScalar(pulse);
      this.halo.scale.setScalar(pulse);
      if(this.light) this.light.intensity = 55+Math.sin(this.t*9)*12;
    }
    const pl=G.player;
    if(!this.lit && pl && Math.hypot(pl.pos.x-this.group.position.x, pl.pos.z-this.group.position.z)<2.6){
      this.lit=true;
      this.flame.material = emat(0xe6ccff, PAL.purpleFx, 1.8);   // brighter, and it stays lit from here on
      this.halo.material.opacity = 0.42;
      G.setCheckpoint(this.group.position.x, this.group.position.y+0.2, this.group.position.z);
      AUDIO.checkpoint();
      G.fx.spawn(new THREE.Vector3(this.group.position.x, this.group.position.y+2.7, this.group.position.z), PAL.purpleFx, 14, {speed:2.5, gravity:1});
      if(window.UI) UI.toast('🕯️ Checkpoint!');
    }
  }
}


// ---- Cursed Coffin: risk/reward chest — treats, jackpots, or an ambush ----
class CursedCoffin {
  constructor(x,y,z,ry=0){
    this.group = new THREE.Group();
    const wood = mat(0x3a2030);
    const trim = emat(0xc9a227, 0x7a5a10, 0.35);
    // stone slab base
    const slab = mesh('box',[1.6,0.25,2.7], mat(0x565070)); slab.position.y=0.125;
    // coffin body (tapered look via two boxes)
    const base = mesh('box',[1.1,0.55,2.2], wood); base.position.y=0.52;
    const foot = mesh('box',[0.85,0.5,0.5], wood); foot.position.set(0,0.5,1.3);
    // gold trim rails
    for(const tz of [-1.05, 1.05]){
      const t = mesh('box',[1.14,0.06,0.08], trim); t.position.set(0,0.78,tz); this.group.add(t);
    }
    // lid (hinged on the left long edge)
    this.lid = new THREE.Group();
    const lidM = mesh('box',[1.1,0.12,2.2], mat(0x4a2a3d)); lidM.position.set(0.55,0,0);
    const cross1 = mesh('box',[0.16,0.14,1.1], trim); cross1.position.set(0.55,0.02,0);
    const cross2 = mesh('box',[0.7,0.14,0.16], trim); cross2.position.set(0.55,0.02,-0.35);
    this.gem = mesh('sph',[0.12,8,7], emat(0xff2040,0xff2040,1)); this.gem.position.set(0.55,0.12,0.55);
    this.lid.add(lidM, cross1, cross2, this.gem);
    this.lid.position.set(-0.55,0.85,0);
    this.glow = new THREE.PointLight(0xff2040, 22, 8); this.glow.position.set(0,1.4,0);
    this.group.add(slab, base, foot, this.lid, this.glow);
    this.group.position.set(x,y,z);
    this.group.rotation.y = ry;
    this.opened = false;
    this.dead = false;
    this.t = rand(0,9);
  }
  update(dt,G){
    this.t += dt;
    if(!this.opened){
      this.gem.scale.setScalar(1+Math.sin(this.t*3)*0.25);
      this.glow.intensity = 16+Math.sin(this.t*2.4)*10;
    } else {
      this.glow.intensity = damp(this.glow.intensity, 0, 2, dt);
      // swing lid open
      this.lid.rotation.z = damp(this.lid.rotation.z, -2.4, 5, dt);
    }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    AUDIO.tone({f:130,f2:55,type:'sawtooth',t:0.7,vol:0.22});
    AUDIO.noise({t:0.5,vol:0.18,fFrom:900,fTo:120});
    G.camc.shake(0.2,0.4);
    setTimeout(()=>{
      if(!G.scene) return;
      const r = Math.random();
      if(r < 0.08){
        // GHOSTLY 1-UP - the rarest prize
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1);
        G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.2,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart(); AUDIO.ghostGiggle();
        UI.updateHUD();
        UI.toast('⚰️👻 A GHOSTLY 1-UP! Lives: '+G.save.lives);
      } else if(r < 0.32){
        // JACKPOT — candy fountain + a random POWER-UP + a heart
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.6, p.z));
        G.ents.add(new PowerUp(p.x+1.2, p.y+1.2, p.z, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1,p.z), PAL.gold, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin();
        UI.toast('⚰️✨ JACKPOT! Candy, a heart, AND a treasure from the vampire\'s stash!');
      } else if(r < 0.7){
        // modest treats
        candyBurst(G, new THREE.Vector3(p.x,p.y+0.8,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy(0);
        UI.toast('⚰️ A few candies... and a lot of dust.');
      } else {
        // AMBUSH — spiders BURST out of the coffin!
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1,p.z), 0xff3030, 20, {speed:4.5});
        AUDIO.bossRoar();
        G.camc.shake(0.4,0.45);
        const offs = [-2.8, -1.6, 1.6, 2.6];   // fixed scatter ring — never on the player, tight enough to stay on every coffin's ground pocket
        for(let i=0;i<4;i++){
          const sp = new Spider(G, p.x+offs[i], 0.35, p.z, {groundY:0});
          sp.state='chase'; sp.thread.visible=false;
          sp.group.position.y = 0.35;
          sp.spawnGrace = 1.0;             // a breath to react before they can bite
          G.ents.add(sp);
        }
        UI.toast('⚰️🕷️ SPIDERS!! SO MANY SPIDERS!!');
      }
    }, 650);
  }
}


// ---- Power-up pickups (dropped by Bonk Lanterns) ----
class PowerUp {
  constructor(x,y,z,type){
    this.type = type;
    this.group = new THREE.Group();
    if(type==='shield'){
      const body = new THREE.Mesh(geo('sph',0.32,9,8), new THREE.MeshLambertMaterial({color:0x63c6e6, transparent:true, opacity:0.85, emissive:0x2a7fa8, emissiveIntensity:0.5}));
      body.scale.set(1,1.15,0.9);
      const earL = new THREE.Mesh(geo('sph',0.12,6,6), body.material); earL.position.set(-0.18,0.33,0);
      const earR = earL.clone(); earR.position.x=0.18;
      this.group.add(body, earL, earR); // a wobbly gummy bear
    } else if(type==='bat'){
      const bm = new THREE.MeshLambertMaterial({color:0x5b3a8e, emissive:0x3d2178, emissiveIntensity:0.5, side:THREE.DoubleSide});
      const bb = new THREE.Mesh(geo('sph',0.18,8,7), bm);
      this.wL = new THREE.Mesh(geo('box',0.5,0.03,0.28), bm); this.wL.position.x=-0.32;
      this.wR = this.wL.clone(); this.wR.position.x=0.32;
      const e1 = mesh('sph',[0.045,5,5], emat(0xffe08a,0xffe08a,1)); e1.position.set(-0.07,0.06,0.15);
      const e2 = e1.clone(); e2.position.x=0.07;
      this.group.add(bb, this.wL, this.wR, e1, e2); // fluttering bat charm
    } else if(type==='salt'){
      // a floating salt shaker — a WEAPON grant (persistent), not a timed power-up
      const glass = mesh('cyl',[0.12,0.15,0.3,9], emat(0xf4f6ff, 0xbfe0ff, 0.6));
      const saltFill = mesh('cyl',[0.1,0.12,0.16,9], emat(0xffffff, 0xffffff, 0.6)); saltFill.position.y=-0.05;
      const cap = mesh('cyl',[0.14,0.12,0.1,9], mat(0xc9ccd6)); cap.position.y=0.2;
      const knob = mesh('sph',[0.04,6,5], mat(0xd6d9e2)); knob.position.y=0.26;
      this.group.add(glass, saltFill, cap, knob);
    } else {
      const orb = mesh('sph',[0.3,10,9], emat(0xfff2c4, 0xffe08a, 0.9));
      const ring = mesh('tor',[0.42,0.04,6,20], emat(0xb37dff, 0xb37dff, 0.8));
      ring.rotation.x = Math.PI/2;
      this.group.add(orb, ring); // a little captured moon
    }
    this.group.position.set(x,y,z);
    this.base = y; this.t = rand(0,9); this.dead = false;
    this.vx = rand(-1.5,1.5); this.vz = rand(-1.5,1.5);
  }
  update(dt,G){
    this.t += dt;
    if(this.wL){ const f=Math.sin(this.t*14)*0.6; this.wL.rotation.z=f; this.wR.rotation.z=-f; }
    const p = this.group.position;
    // gentle slide + bob
    p.x += this.vx*dt; p.z += this.vz*dt;
    this.vx *= Math.exp(-1.2*dt); this.vz *= Math.exp(-1.2*dt);
    p.y = this.base + Math.sin(this.t*3)*0.15 + 0.1;
    this.group.rotation.y = this.t*2;
    const pl = G.player;
    if(pl && !pl.dead && p.distanceTo(new THREE.Vector3(pl.pos.x, pl.pos.y+0.7, pl.pos.z)) < 1.1){
      this.dead = true;
      if(this.type==='shield'){
        pl.gainShield();
        UI.toast('🛡️ GUMMY SHIELD! Absorbs one hit.');
      } else if(this.type==='bat'){
        pl.gainBat();
        UI.toast('🦇 BAT WINGS! Tap jump in the air to flutter — 4 beats per flight!');
        AUDIO.ghostGiggle();
      } else if(this.type==='salt'){
        pl.armWeapon('salt');   // persistent weapon — keeps until a death or a different weapon replaces it
        UI.toast('🧂 SALT SHAKER! Spin to fling salt — ghosts HATE it. (Keeps until you fall.)');
        AUDIO.goldPumpkin();
      } else {
        pl.moonT = 10;
        UI.toast('🌙 MOON DROP! Unstoppable for 10 seconds!');
        AUDIO.goldPumpkin();
      }
      G.fx.spawn(p, this.type==='shield'?0x63c6e6:0xffe08a, 14, {speed:3.5});
      AUDIO.heart();
    }
  }
}


// ---- Crow: ambient life — perches, then flaps off when you get close ----
class Crow {
  constructor(x,y,z){
    this.group = new THREE.Group();
    const bm = mat(0x1c1826);
    const body = mesh('sph',[0.16,8,6], bm); body.scale.set(1,0.9,1.4);
    const head = mesh('sph',[0.1,7,6], bm); head.position.set(0,0.12,0.16);
    const beak = mesh('cone',[0.035,0.12,4], mat(0xd9a02e)); beak.rotation.x=Math.PI/2; beak.position.set(0,0.11,0.3);
    const eye = mesh('sph',[0.02,4,4], mat(0xffe08a)); eye.position.set(0.06,0.15,0.2);
    this.wL = mesh('box',[0.3,0.03,0.18], bm); this.wL.position.set(-0.15,0.05,0);
    this.wR = this.wL.clone(); this.wR.position.x=0.15;
    this.group.add(body,head,beak,eye,this.wL,this.wR);
    this.group.position.set(x,y,z);
    this.state='perch'; this.t=rand(0,9); this.dead=false; this.vx=0; this.vy=0;
  }
  update(dt,G){
    this.t+=dt;
    const p = this.group.position;
    if(this.state==='perch'){
      // little head bobs
      this.group.rotation.y = Math.sin(this.t*0.7)*0.5;
      if(Math.floor(this.t*2)%5===0) p.y += Math.sin(this.t*20)*0.003;
      const pl = G.player;
      if(pl && Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) < 3.5){
        this.state='fly';
        this.vx = Math.sign(p.x-pl.pos.x)||1;
        AUDIO.tone({f:700,f2:380,type:'square',t:0.12,vol:0.1});
        AUDIO.tone({f:650,f2:350,type:'square',t:0.1,vol:0.08});
      }
    } else {
      p.x += this.vx*4.5*dt;
      p.y += 3.2*dt;
      const flap = Math.sin(this.t*22)*0.9;
      this.wL.rotation.z = flap; this.wR.rotation.z = -flap;
      this.group.rotation.y = this.vx>0 ? Math.PI/2 : -Math.PI/2;
      if(p.y > 16) this.dead = true;
    }
  }
}


// ---- SALT SHAKER weapon: a pinch of salt wards off spirits (non-violent projectile) ----
// A small white salt-pinch that flies forward along the player's facing x-direction (side-scroller),
// short range, popping the first spirit it overlaps via the same hit-path a stomp/swing uses. A few can
// be airborne at once. Deterministic straight-line motion. Bosses (G.boss) aren't in ents.list, so it
// never chips their stone hide.
class SaltPinch {
  constructor(G, x, y, z, dir){
    this.G = G;
    this.dir = dir;            // +1 (right) or -1 (left)
    this.group = new THREE.Group();
    const gm = emat(0xffffff, 0xf4f4ff, 0.75);   // bright so it reads against the dark levels
    for(let i=0;i<4;i++){
      const gr = mesh('box',[0.08,0.08,0.08], gm);
      gr.position.set(rand(-0.07,0.07), rand(-0.07,0.07), rand(-0.07,0.07));
      gr.rotation.set(rand(TAU), rand(TAU), rand(TAU));
      this.group.add(gr);
    }
    this.group.position.set(x,y,z);
    this.speed = 15;           // deterministic forward speed
    this.life = 0.55;          // short range (~8u)
    this.dead = false;
    this.cull = false;         // never cull a live projectile — it's short-lived and always near the player
    this.t = 0;
  }
  update(dt, G){
    this.t += dt;
    this.life -= dt;
    if(this.life<=0){ this.dead = true; return; }
    const p = this.group.position;
    p.x += this.dir*this.speed*dt;
    this.group.rotation.z -= this.dir*dt*11;   // tumble
    // little salt trail
    G.fx.spawn(new THREE.Vector3(p.x,p.y,p.z), 0xffffff, 1, {speed:0.5, life:0.2, gravity:6, size:0.35});
    // pop the first spirit it overlaps
    for(const e of G.ents.list){
      if(!e.isEnemy || e.dead) continue;
      const ep = e.group.position;
      const dx = ep.x-p.x, dz = ep.z-p.z, dy = (ep.y+(e.hitY||0.5))-p.y;
      const rr = (e.hitR||0.6)+0.45;
      if(dx*dx+dz*dz < rr*rr && Math.abs(dy)<1.1){
        e.takeHit(G.player, 'swing');   // same path a bag-swing uses — pops Boos/Wisps/Gravemites/etc.
        this.G.fx.spawn(new THREE.Vector3(p.x,p.y,p.z), 0xffffff, 7, {speed:2.6, life:0.3, gravity:3, size:0.6});
        AUDIO.stomp();
        this.dead = true;   // one pinch, one pop
        return;
      }
    }
  }
}

// ---- Salt Crypt: the tomb you take the Salt Shaker from ----
// Integrates EXACTLY like CursedCoffin/RestlessUrn: has .opened / .group.position / .open(G) / .promptLabel;
// a level pushes it to G.coffins AND G.ents.add(...)s it, so 09_levelkit.updateLevelCommon renders the
// interact prompt and calls .open(G) on interact. Opening GRANTS the persistent Salt Shaker weapon.
class SaltCrypt {
  constructor(x,y,z,ry=0){
    this.group = new THREE.Group();
    const stone = mat(0x6c6f86), stoneD = mat(0x4a4c63), stoneL = mat(0x8e91a8);
    const slab = mesh('box',[1.5,0.22,2.2], stoneD); slab.position.y=0.11;
    const box  = mesh('box',[1.15,0.72,1.85], stone); box.position.y=0.52;
    const rune = mesh('box',[0.5,0.5,0.06], emat(0xbfe0ff,0x8ac6ff,0.5)); rune.position.set(0,0.55,0.94);   // salt-ward carving
    // the salt shaker glowing inside (revealed as the lid slides off)
    this.shaker = new THREE.Group();
    const glass = mesh('cyl',[0.13,0.16,0.34,10], emat(0xf4f6ff,0xbfe0ff,0.6));
    const saltFill = mesh('cyl',[0.11,0.13,0.2,10], emat(0xffffff,0xffffff,0.7)); saltFill.position.y=-0.05;
    const cap = mesh('cyl',[0.15,0.13,0.12,10], mat(0xc9ccd6)); cap.position.y=0.22;
    for(let i=0;i<5;i++){ const h=mesh('sph',[0.02,4,4], emat(0xffffff,0xffffff,1)); const a=i/5*TAU; h.position.set(Math.cos(a)*0.06, 0.27, Math.sin(a)*0.06); this.shaker.add(h); }
    this.shaker.add(glass, saltFill, cap);
    this.shaker.position.set(0,0.95,0);
    // sliding lid
    this.lid = mesh('box',[1.2,0.16,1.9], stoneL); this.lid.position.set(0,0.94,0);
    const lidRune = mesh('box',[0.4,0.4,0.05], emat(0xbfe0ff,0x8ac6ff,0.4)); lidRune.rotation.x=Math.PI/2; lidRune.position.set(0,1.03,0);
    this.lid.add(lidRune);
    this.glow = new THREE.PointLight(0xbfe0ff, 14, 7); this.glow.position.set(0,1.3,0);
    this.group.add(slab, box, rune, this.shaker, this.lid, this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='⚰️🧂 Take the Salt Shaker from the crypt?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      this.shaker.position.y = 0.95 + Math.sin(this.t*2.2)*0.05;
      this.shaker.rotation.y = this.t*1.2;
      this.glow.intensity = 11 + Math.sin(this.t*2.6)*6;
    } else {
      this.lid.position.z = damp(this.lid.position.z, 2.0, 4, dt);       // lid slides off
      this.glow.intensity = damp(this.glow.intensity, 0, 2.5, dt);
      this.shaker.position.y = damp(this.shaker.position.y, 1.7, 3, dt); // shaker rises...
      this.shaker.scale.setScalar(damp(this.shaker.scale.x, 0.01, 4, dt)); // ...and is taken
    }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    G.camc.shake(0.15,0.3);
    AUDIO.noise({t:0.2, vol:0.12, fFrom:5000, fTo:2000});   // salt pour
    AUDIO.goldPumpkin();
    G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), 0xffffff, 20, {speed:3.5, life:0.7, gravity:4, size:0.6});
    if(G.player) G.player.armWeapon('salt');
    if(window.UI) UI.toast('🧂 SALT SHAKER! Spin to fling salt — ghosts HATE it. (Keeps until you fall.)');
  }
}

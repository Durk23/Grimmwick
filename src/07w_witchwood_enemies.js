// ============ WITCHWOOD ROSTER — District 3 enemies (Webling + WebWall, Widowmite, BroomZoomer, ToadstoolBouncer) ============
// Extends the Enemy base in 07_enemies.js. Same contract: isEnemy/hitR/headH/hitY/touchDamage/touchR, update(dt)
// calls touchPlayer + updateShadow, inherit takeHit/die (kinds 'swing'/'stomp'/'pound'/'moon'). Register via G.ents.add;
// the player's stomp/spin/pound/salt detection then works automatically. DETERMINISTIC: gameplay runs off fixed clocks
// (this.t from an opts.phase, nextWeb += period) and patrol-edge reversals — NO Math.random on the critical path. The
// base Enemy seeds this.t=rand(0,10), so every class OVERRIDES this.t; rand() (seeded per area) is COSMETIC-ONLY jitter.
// EMISSIVE-LIFTED bodies + bright eyes so the spiders/brooms/mushrooms POP against Witchwood's deep green-purple forest.
// Colour language: webs read WHITE, witch-magic reads VIOLET, black-widow danger reads HOT-RED, the friendly toadstool
// reads warm ROSE (never a threat colour). THE spider district — no cheap hits: every obstacle is telegraphed + fair.

// ---- WebWall: the breakable barrier a Webling spins across the lane (helper entity, spawned by Webling) ----
// A telegraphed vertical spiderweb panel. It GROWS in over ~forming seconds (harmless, NO collider yet — the player
// sees it coming, never an instant block), then becomes a SOLID box spanning the lane. Break it with ANY hit
// (spin/salt/stomp/pound) or leap onto its top / skirt it; it also dissolves on its own after opts.life seconds, so it
// can never soft-lock the level. Never damages the player (blocks only). NOT counted as an enemy kill (custom break —
// no candyBurst/onEnemyKilled). Always frees its physics collider on break/dissolve and notifies its parent Webling.
class WebWall extends Enemy {
  constructor(G, x, y, z, opts={}){
    super(G, x, y, z);
    this.G.scene.remove(this.shadow);            // a web casts no blob shadow
    this.cull = false;                           // always update so it expires + frees its collider even if the player runs off
    this.touchDamage = 0;                        // fair: it BLOCKS, it never bites
    this.candyDrop = 0;
    this.parent  = opts.parent||null;
    this.webW    = opts.webW||2.6;               // visual width of the web curtain (x, faces the side camera)
    this.hgt     = opts.hgt||3.0;
    this.laneW   = opts.laneW||3.0;              // collider z-depth (catches the z=0 lane)
    this.groundY = y;
    this.forming = opts.forming||0.55;           // grow-in telegraph (harmless)
    this.life    = opts.life||4.0;               // stands this long, then dissolves on its own
    this.state='form'; this.st=0; this.col=null;
    this.hitR=this.webW*0.5; this.headH=this.hgt; this.hitY=this.hgt*0.5;   // stompable from on top; spin/salt reaches it
    // ---- rig: a spiderweb CURTAIN in the x-y plane facing the camera (side-scroll barrier, like the exit-gate portal) ----
    // fresh (un-cached) material — opacity is animated per-wall, so it must not bleed into other webs
    this.strandM = new THREE.MeshLambertMaterial({color:0xe6e6f4, emissive:0x9a86c8, emissiveIntensity:0.4, transparent:true, opacity:0.5});
    this.web = new THREE.Group();
    const W=this.webW, H=this.hgt, halfW=W/2, cy=H*0.5, spokeR=Math.min(W,H)*0.5;
    for(let i=0;i<=6;i++){                        // vertical strands across the width
      const v = new THREE.Mesh(geo('cyl',0.03,0.03,H,4), this.strandM);
      v.position.set(-halfW+(i/6)*W, H/2, 0);
      this.web.add(v);
    }
    for(let j=0;j<=5;j++){                        // horizontal strands up the height
      const h = new THREE.Mesh(geo('cyl',0.03,0.03,W,4), this.strandM);
      h.rotation.z=Math.PI/2; h.position.set(0, (j/5)*H, 0);   // cyl default lies along y → rotate to lie along x
      this.web.add(h);
    }
    for(let k=0;k<6;k++){                          // radial spokes (the spider-web read)
      const sp = new THREE.Mesh(geo('cyl',0.026,0.026,spokeR*1.6,4), this.strandM);
      sp.position.set(0,cy,0); sp.rotation.z=k/6*Math.PI;
      this.web.add(sp);
    }
    for(const rr of [spokeR*0.42, spokeR*0.72]){  // concentric rings (torus lies in x-y plane by default → faces the camera)
      const ring = new THREE.Mesh(geo('tor',rr,0.028,5,18), this.strandM);
      ring.position.set(0, cy, 0.01); this.web.add(ring);
    }
    const hub = new THREE.Mesh(geo('sph',0.12,8,7), this.strandM); hub.position.set(0,cy,0); this.web.add(hub);
    this.web.scale.set(0.08, 0.08, 1);           // starts tiny, spun outward across the screen plane on 'form'
    this.group.add(this.web);
    G.scene.add(this.group);
  }
  touchPlayer(){}                                 // a wall never bites — it only blocks (via the solid collider)
  _freeCollider(){ if(this.col){ const i=this.G.world.cols.indexOf(this.col); if(i>=0) this.G.world.cols.splice(i,1); this.col=null; } }
  _break(){
    if(this.dead) return;
    this._freeCollider();
    const p=this.group.position;
    this.G.fx.spawn(new THREE.Vector3(p.x, this.groundY+this.hgt*0.5, 0), 0xe6e6f4, 16, {speed:3.6, life:0.5});
    AUDIO && AUDIO.noise && AUDIO.noise({t:0.16, vol:0.12, fFrom:2600, fTo:800});
    AUDIO && AUDIO.stomp && AUDIO.stomp();
    this.dead=true;
    if(this.parent) this.parent.wall=null;
  }
  takeHit(player, kind){ this._break(); }        // ANY hit tears the whole web (no hp counting)
  die(){ this._break(); }                         // safety (e.g. moon-rush contact) — same clean break, still not an enemy-kill
  update(dt){
    this.t+=dt; this.st+=dt;
    const p=this.group.position;
    if(this.state==='form'){
      const g=clamp(this.st/this.forming,0,1);
      this.web.scale.set(g, g, 1);               // spin outward across the screen plane to full size
      this.strandM.opacity = 0.4 + 0.5*g;
      if(g>=1){                                  // now it's solid — add the thin blocking collider (blocks +x travel)
        this.state='stand'; this.st=0;
        this.col = this.G.world.addBox(p.x, this.groundY, 0, 0.7, this.hgt, this.laneW, {type:'solid'});
      }
    } else if(this.state==='stand'){
      this.strandM.opacity = 0.9;
      this.web.rotation.z = Math.sin(this.t*3)*0.015;   // faint shimmer
      if(this.st>=this.life){ this._freeCollider(); this.state='dissolve'; this.st=0; }
    } else {                                      // dissolve — fade + shrink, then remove
      const d=clamp(this.st/0.4,0,1);
      this.strandM.opacity = 0.9*(1-d);
      this.web.scale.set(1-d*0.6, 1-d, 1);
      if(d>=1){ this.dead=true; if(this.parent) this.parent.wall=null; }
    }
    // NOTE: no touchPlayer — the collider is the only interaction; updateShadow skipped (shadow removed)
  }
}

// ---- Webling: a FAT planted spider that periodically WEAVES a WebWall across the lane ----
// Sits still on a fixed web clock (nextWeb += period, ~6s). ~tele seconds before each cast it TELEGRAPHS (rears up,
// front legs wave, spinnerets brighten), then spawns a WebWall (which itself grows in — a second, visible warning
// before it blocks). Only weaves when no wall of its own stands (skips the cycle otherwise — deterministic grid).
// hp 2, stompable (a stomp chips it, a pound one-shots it); killing it also tears down any wall it's holding.
class Webling extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;                       // FIXED web clock (override the base's rand seed)
    this.hp = 2; this.candyDrop = opts.candy!==undefined?opts.candy:4;
    this.hitR=0.62; this.headH=0.95; this.hitY=0.45; this.touchR=0.72; this.touchDamage=1;
    this.groundY = y;
    this.period    = opts.period||6;              // fixed spin interval
    this.firstWeb  = opts.firstWeb!==undefined?opts.firstWeb:2.2;
    this.nextWeb   = this.firstWeb;
    this.webAt     = opts.webAt||0;               // wall x-offset from the spider (default: weaves across its own lane)
    this.webLife   = opts.webLife||4;
    this.webW      = opts.webW||2.6;              // web-curtain width
    this.wallH     = opts.wallH||3.0;
    this.wall = null; this.state='idle'; this.st=0; this.tele=0.7;
    // ---- rig: a bulbous witch-purple spider — fat abdomen, poison-green eye cluster + mark, spinnerets that glow to weave ----
    const bodyM = emat(0x6a4a90, 0x3c2860, 0.55);
    const abM   = emat(0x7a52a4, 0x452e68, 0.5);
    this.abd = mesh('sph',[0.5,11,9], abM); this.abd.position.set(0,0.5,-0.3); this.abd.scale.set(1.18,1.05,1.28);
    const ceph = mesh('sph',[0.34,9,8], bodyM); ceph.position.set(0,0.46,0.28);
    const mark = mesh('sph',[0.5,8,8], emat(0x9dff5e,0x6ad83a,0.7)); mark.scale.set(0.5,0.62,0.32); mark.position.set(0,0.66,-0.58);   // witch mark
    const eM = emat(0x9dff5e,0x7dff9e,1);
    for(const [ex,ey] of [[-0.1,0.56],[0.1,0.56],[-0.18,0.48],[0.18,0.48]]){
      const e = mesh('sph',[0.05,6,6], eM); e.position.set(ex,ey,0.56); this.group.add(e);
    }
    const fangM = emat(0xe6e6f4,0xc9c4dd,0.4);
    const fL = mesh('cone',[0.05,0.2,4], fangM); fL.position.set(-0.09,0.32,0.5); fL.rotation.x=Math.PI;
    const fR = fL.clone(); fR.position.x=0.09;
    // eight fat legs (pivoting groups so front legs can wave on the weave telegraph)
    this.legs=[];
    for(let s=-1;s<=1;s+=2) for(let i=0;i<4;i++){
      const lg = new THREE.Group();
      const up = mesh('cyl',[0.05,0.04,0.5,5], bodyM); up.rotation.x=Math.PI/2; up.position.set(0,0,0.25);
      const dn = mesh('cyl',[0.04,0.028,0.46,5], bodyM); dn.rotation.x=Math.PI/2.3; dn.position.set(0,-0.2,0.5);
      lg.add(up,dn);
      lg.position.set(s*0.34, 0.44, -0.24+i*0.16); lg.rotation.y = s*(0.5+i*0.12);
      this.legs.push({g:lg, s, i}); this.group.add(lg);
    }
    // spinnerets — fresh material (its emissive is animated, must not bleed into cached materials)
    this.spinM = new THREE.MeshLambertMaterial({color:0xe6e6f4, emissive:0x9a86c8, emissiveIntensity:0.2});
    this.spin = mesh('sph',[0.13,7,6], this.spinM); this.spin.position.set(0,0.42,-0.8);
    this.group.add(this.abd, ceph, mark, fL, fR, this.spin);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const p=this.group.position; p.y=this.groundY;
    if(this.wall && this.wall.dead) this.wall=null;
    // idle breathing
    this.abd.scale.set(1.18+Math.sin(this.t*2)*0.03, 1.05, 1.28);
    if(this.state==='idle'){
      this.abd.position.y = damp(this.abd.position.y, 0.5, 8, dt);
      this.spinM.emissiveIntensity = damp(this.spinM.emissiveIntensity, 0.2, 6, dt);
      this.legs.forEach(l=>{ l.g.rotation.z = Math.sin(this.t*3 + l.i)*0.08; l.g.rotation.x = 0; });
      if(this.t >= this.nextWeb - this.tele){
        if(this.wall){ this.nextWeb += this.period; }          // a wall still stands — skip this cycle (fixed grid)
        else { this.state='weave'; this.st=0; AUDIO && AUDIO.tone && AUDIO.tone({f:760,f2:1180,type:'sawtooth',t:this.tele,vol:0.1}); }
      }
    } else { // weave — TELEGRAPH: rear up, front legs wave fast, spinnerets brighten
      const prog = clamp(this.st/this.tele,0,1);
      this.abd.position.y = 0.5 + prog*0.14;
      this.spinM.emissiveIntensity = 0.2 + prog*1.1;
      this.legs.forEach(l=>{ if(l.i>=2) l.g.rotation.x = Math.sin(this.t*22)*0.5*prog; });
      if(this.st>=this.tele){
        this.wall = new WebWall(this.G, p.x+this.webAt, this.groundY, 0, {parent:this, webW:this.webW, hgt:this.wallH, life:this.webLife});
        this.G.ents.add(this.wall);
        this.nextWeb += this.period; this.state='idle'; this.st=0;
        AUDIO && AUDIO.tone && AUDIO.tone({f:420,f2:200,type:'sine',t:0.2,vol:0.1});
      }
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
  die(){ if(this.wall && !this.wall.dead) this.wall._break(); super.die(); }
}

// ---- Widowmite: a tiny fast black-widow — skitters a fixed patrol; an easy 1-hit stomp. Placed in swarms of 2-3 ----
// Small hitR/headH so a tap-jump clears it; a hot-red eye cluster + red hourglass keep it readable at knee height.
// Deterministic: fixed-speed skitter, reverses at the patrol edges with a short dwell (a seeded per-instance phase
// keeps a swarm from marching in perfect lockstep, but replays identically every attempt).
class Widowmite extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.3; this.headH=0.4; this.hitY=0.18; this.touchR=0.46;
    this.candyDrop = opts.candy!==undefined?opts.candy:2;
    this.shadow.scale.setScalar(0.55);
    this.groundY=y; this.dwell=0;
    this.range = opts.range||3; this.dir=opts.dir||1; this.axis=opts.axis||'x'; this.speed=opts.speed||5.2;
    // ---- rig: a glossy little black-widow — dark body, HOT-RED eyes + a red hourglass mark ----
    const bodyM = emat(0x3a2d55, 0x241a3e, 0.5);
    const abd = mesh('sph',[0.26,9,8], bodyM); abd.position.set(0,0.2,-0.12); abd.scale.set(1.1,1.0,1.25);
    const ceph = mesh('sph',[0.16,8,7], bodyM); ceph.position.set(0,0.18,0.16);
    const hour = mesh('sph',[0.26,7,7], emat(0xff3020,0xff1810,1)); hour.scale.set(0.34,0.5,0.26); hour.position.set(0,0.3,-0.28);   // danger hourglass
    const eM = emat(0xff3b3b,0xff2020,1);
    const eL = mesh('sph',[0.045,6,6], eM); eL.position.set(-0.07,0.24,0.3);
    const eR = eL.clone(); eR.position.x=0.07;
    this.legs=[];
    for(let s=-1;s<=1;s+=2) for(let i=0;i<4;i++){
      const lg = mesh('cyl',[0.02,0.014,0.36,4], bodyM);
      lg.position.set(s*0.16,0.17,-0.11+i*0.09); lg.rotation.z=s*0.9;
      this.legs.push(lg);
    }
    this.group.add(abd,ceph,hour,eL,eR,...this.legs);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const p=this.group.position;
    this.legs.forEach((l,i)=>{ l.rotation.x = Math.sin(this.t*30 + i*1.2)*0.5; });   // fast skitter legs
    if(this.dwell>0){
      this.dwell-=dt; p.y=this.groundY; this.touchPlayer(dt); this.updateShadow(); return;
    }
    const step = this.speed*dt*this.dir;
    if(this.axis==='x'){
      p.x+=step;
      if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; this.dwell=0.18; }
      else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; this.dwell=0.18; }
      this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
    } else {
      p.z+=step;
      if(p.z>this.home.z+this.range){ p.z=this.home.z+this.range; this.dir=-1; this.dwell=0.18; }
      else if(p.z<this.home.z-this.range){ p.z=this.home.z-this.range; this.dir=1; this.dwell=0.18; }
      this.group.rotation.y = this.dir>0?0:Math.PI;
    }
    p.y = this.groundY + Math.abs(Math.sin(this.t*26))*0.045;   // scurry bob
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- BroomZoomer: a riderless enchanted broom that SWEEPS low across the ground on a fixed patrol ----
// A comedy Bullet-Bill-ish GROUND threat you LEAP over (low headH → a tap-jump clears it cleanly). Bristles lead the
// sweep; it pings between the patrol edges (never homing, fully fixed). Body contact hurts; stompable to pop it. A
// faint violet magic shimmer trails it so the enchantment (and the incoming threat) reads against the forest.
class BroomZoomer extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.baseY = opts.baseY!==undefined?opts.baseY:y;
    this.range = opts.range||5; this.dir=opts.dir||1; this.speed=opts.speed||6.5;
    this.hitR=0.55; this.headH=0.6; this.hitY=0.25; this.touchR=0.62;
    this.candyDrop = opts.candy!==undefined?opts.candy:2;
    // ---- rig: built along +z (bristles at the +z front); rotation.y aims it down its sweep so bristles always lead ----
    const woodM = emat(0x7a5636, 0x3a2410, 0.35);          // handle — lifted so the wood reads in the dark wood
    const bindM = emat(0xb37dff, 0x8a5fd0, 0.55);          // enchanted binding — the violet magic tell
    const strawM= emat(0xe0b84a, 0xb8902a, 0.55);          // bright straw bristles (pop against green-purple)
    const handle = mesh('cyl',[0.05,0.07,1.5,6], woodM); handle.rotation.x=Math.PI/2; handle.position.set(0,0.5,-0.4);
    const knob = mesh('sph',[0.09,7,6], woodM); knob.position.set(0,0.5,-1.12);
    const binding = mesh('cyl',[0.12,0.12,0.2,8], bindM); binding.rotation.x=Math.PI/2; binding.position.set(0,0.47,0.28);
    const bristles = new THREE.Group();
    for(let i=0;i<11;i++){
      const a=(i/10-0.5);
      const b = mesh('cyl',[0.02,0.055,0.62,4], strawM);
      b.position.set(a*0.44, 0.36-Math.abs(a)*0.1, 0.62); b.rotation.x=0.7; b.rotation.z=a*0.5;
      bristles.add(b);
    }
    this.group.add(handle, knob, binding, bristles);
    this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt;
    const p=this.group.position;
    p.x += this.speed*this.dir*dt;
    if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; }
    else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; }
    this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
    p.y = this.baseY + Math.abs(Math.sin(this.t*7))*0.12;    // low sweeping hover
    this.group.rotation.z = Math.sin(this.t*7)*0.12;         // sweep wobble
    if(Math.floor(this.t*10)!==Math.floor((this.t-dt)*10))   // faint magic shimmer trail
      this.G.fx.spawn(new THREE.Vector3(p.x,p.y+0.2,p.z), 0xb37dff, 1, {speed:0.6, life:0.4, gravity:-0.5, size:0.5});
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- ToadstoolBouncer: a big soft friendly mushroom — a BOUNCE PAD, never a threat ----
// touchDamage 0, indestructible (takeHit just makes it jiggle). It launches the player like a trampoline via a physics
// BOUNCE collider capping the mushroom (the same mechanism as the level-kit's bigPumpkin) — reliable + deterministic,
// ~3.5u apex by default, matching the height model's "bounce". Sometimes helpful, sometimes flings you toward a hazard
// (that's the level designer's placement — not this enemy's concern). A gentle squish/wobble plays on each bounce.
class ToadstoolBouncer extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = 0;
    this.noStomp = true;                          // the player's stomp check skips it — the bounce collider does the launching
    this.touchDamage = 0; this.candyDrop = 0;     // NEVER hurts, never drops (it isn't defeated)
    this.scl = opts.scale||1;
    this.capR = (opts.capR||1.0)*this.scl;
    this.groundY = y;
    this.bounceVy = opts.bounce||13;              // vy 13 ≈ 3.5u apex (the height model's "bounce")
    this._wob=0; this._lb=null;
    // ---- rig: a plump toadstool — warm rose cap + cream spots, cream stem, gentle face (reads instantly as FRIENDLY) ----
    this.cap = new THREE.Group();
    const capM  = emat(0xff6a8a, 0xc23a5c, 0.4);
    const spotM = emat(0xf5ecd0, 0xd8cca8, 0.3);
    const dome = mesh('sph',[this.capR,16,11], capM); dome.scale.set(1,0.62,1);
    const rim  = mesh('cyl',[this.capR*0.86,this.capR*1.02,0.2,18], capM); rim.position.y=-0.16;
    this.cap.add(dome, rim);
    for(let i=0;i<7;i++){                          // cream spots sitting on the dome surface
      const a=i/7*TAU + 0.6, f=rand(0.25,0.8);
      const s = mesh('sph',[this.capR*rand(0.1,0.17),8,7], spotM);
      s.position.set(Math.cos(a)*this.capR*f, this.capR*0.62*Math.sqrt(Math.max(0,1-f*f)), Math.sin(a)*this.capR*f);
      s.scale.set(1,0.45,1); this.cap.add(s);
    }
    this.cap.position.y = 0.95*this.scl;
    const stemM = emat(0xefe6cf, 0xcfc4a6, 0.28);
    const stem  = mesh('cyl',[0.34*this.scl,0.44*this.scl,0.95*this.scl,12], stemM); stem.position.y=0.47*this.scl;
    const skirt = mesh('cyl',[0.44*this.scl,0.3*this.scl,0.13,12], stemM); skirt.position.y=0.8*this.scl;
    const eM = mat(0x2a2036);
    const eL = mesh('sph',[0.05,6,6], eM); eL.position.set(-0.13*this.scl,0.6*this.scl,0.34*this.scl);
    const eR = eL.clone(); eR.position.x=0.13*this.scl;
    const chM = emat(0xffb0c0, 0xff80a0, 0.3);
    const cL = mesh('sph',[0.06,6,6], chM); cL.position.set(-0.2*this.scl,0.52*this.scl,0.31*this.scl); cL.scale.set(1,0.7,0.5);
    const cR = cL.clone(); cR.position.x=0.2*this.scl;
    this.group.add(stem, skirt, this.cap, eL, eR, cL, cR);
    this.shadow.scale.setScalar(1.1*this.scl);
    G.scene.add(this.group);
    // the launch: a physics BOUNCE collider capping the mushroom (like bigPumpkin) — the player lands + springs off
    const capTop = y + 0.95*this.scl + this.capR*0.35;   // where feet rest on the springy cap
    this.col = G.world.addBox(x, y-0.3, z, this.capR*1.7, capTop-(y-0.3), this.capR*1.7, {type:'bounce', bounce:this.bounceVy});
  }
  takeHit(player, kind){ this._wob = 1; AUDIO && AUDIO.bounce && AUDIO.bounce(); }   // indestructible — a hit just jiggles it
  update(dt){
    this.t+=dt;
    const p=this.group.position, pl=this.G.player;
    // the engine stamps pl.lastBounce when a bounce-collider launches the player → if that was OUR cap, wobble + puff
    if(pl && pl.lastBounce!==undefined && pl.lastBounce!==this._lb){
      const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z;
      if(dx*dx+dz*dz < (this.capR+0.5)*(this.capR+0.5)){
        this._wob = 1;
        this.G.fx.spawn(new THREE.Vector3(pl.pos.x, p.y+0.95*this.scl, pl.pos.z), 0xffd9e2, 8, {speed:2.5, life:0.4});
        AUDIO && AUDIO.bounce && AUDIO.bounce();
      }
      this._lb = pl.lastBounce;
    }
    if(this._wob>0) this._wob = Math.max(0, this._wob - dt*2.2);
    const sq = 1 - Math.sin(this._wob*Math.PI)*0.28;         // squish on bounce, spring back
    this.cap.scale.set(1+(1-sq)*0.5, sq, 1+(1-sq)*0.5);
    this.cap.position.y = (0.95 - (1-sq)*0.25)*this.scl;
    this.cap.rotation.z = Math.sin(this.t*2)*0.02 + Math.sin(this._wob*TAU)*0.06;   // idle sway + wobble
    this.updateShadow();
  }
}

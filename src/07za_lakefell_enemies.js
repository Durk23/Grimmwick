// ============ FROZEN LAKE FELL ROSTER — Winter District 2 enemies (Somnambear, Wraithdeer, Ice Angler, Polar Cub) ============
// Extends the Enemy base (07_enemies) + the winter language (07z). Owner seeds, Sept 4 2026: "spooky or haunted
// polar bears and reindeers." Same contract: isEnemy/hitR/headH/hitY/touchDamage/touchR, update(dt), G.ents.add.
// DETERMINISTIC: fixed clocks + player-reactive state machines, no Math.random on the critical path. Colour
// language: the deep cold's spirits read ICY CYAN 0x7ae8ff; the lake's own creatures read pale moon-white.

// ---- THE SOMNAMBEAR: a huge haunted polar bear SLEEPWALKING a fixed patrol — eyes shut, tiny nightcap,
// little spirit-flakes snoring out of it. Harmless while it walks... WAKE it (bump it, hit it, or stand in
// its path) and it ROARS (0.7s telegraph, the whole bear rears) then throws ONE furious swipe-lunge — then
// yawns, forgets why it was upset, and sleepwalks on. On the lakes its wake-slam SHATTERS nearby CrackIce
// (the bear rewrites the floor — G._bearSlam hook, wired by the lake ticker). hp3; a stomp WAKES it. ----
class Somnambear extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hp = 3; this.hitR=1.1; this.headH=1.9; this.hitY=1.0; this.touchR=1.25; this.candyDrop=opts.candy!==undefined?opts.candy:6;
    this.range=opts.range||4.5; this.dir=opts.dir||1; this.speed=opts.speed||0.9;
    this.state='sleepwalk'; this.st=0; this.touchDamage=0;   // asleep = a soft wall, not a hit
    const fur = emat(0xf2f0e8, 0x9aa4c0, 0.18), furD = emat(0xd8d4c8, 0x8a94b0, 0.14);
    this.body = new THREE.Group();
    const torso = mesh('sph',[1.05,12,10], fur); torso.scale.set(1.35,1,1); torso.position.y=1.05; this.body.add(torso);
    const rump = mesh('sph',[0.85,10,9], furD); rump.position.set(-0.9,1.0,0); this.body.add(rump);
    this.headG = new THREE.Group();
    const skull = mesh('sph',[0.55,10,9], fur); this.headG.add(skull);
    const snout = mesh('sph',[0.3,8,7], furD); snout.scale.set(1.2,0.8,1); snout.position.set(0.42,-0.1,0); this.headG.add(snout);
    this.nose = mesh('sph',[0.12,7,6], mat(0x1a1a28)); this.nose.position.set(0.66,-0.08,0); this.headG.add(this.nose);
    for(const s of [-1,1]){ const ear=mesh('sph',[0.14,6,5], furD); ear.position.set(-0.1,0.48,s*0.34); this.headG.add(ear); }
    // eyes SHUT — two little sleeping arcs (never open; even awake she swings blind, which is scarier)
    for(const s of [-1,1]){ const lid=mesh('tor',[0.09,0.02,4,8,Math.PI], mat(0x2a2a38)); lid.position.set(0.38,0.14,s*0.22); lid.rotation.x=Math.PI/2; lid.rotation.z=Math.PI; this.headG.add(lid); }
    // THE NIGHTCAP (the cute-spooky bar) — striped, with a pom
    const cap = mesh('cone',[0.4,0.65,9], emat(0x6a4a9e,0x3a2a5e,0.25)); cap.position.set(-0.05,0.68,0); cap.rotation.z=0.5; this.headG.add(cap);
    const pom = mesh('sph',[0.13,6,5], mat(0xf0e6c8)); pom.position.set(-0.42,0.92,0); this.headG.add(pom);
    this.headG.position.set(1.35,1.5,0); this.body.add(this.headG);
    this.legs=[]; for(const [lx,lz] of [[0.7,0.45],[0.7,-0.45],[-0.7,0.45],[-0.7,-0.45]]){ const lg=mesh('cyl',[0.22,0.26,0.9,7], fur); lg.position.set(lx,0.45,lz); this.legs.push(lg); this.body.add(lg); }
    this.armR = mesh('cyl',[0.2,0.24,1.1,7], fur); this.armR.position.set(1.0,1.2,0.5); this.armR.rotation.z=0.4; this.armR.visible=false; this.body.add(this.armR);
    this.group.add(this.body);
    // snore flakes — three drifting spirit-Zs (tiny glowing motes on a loop)
    this.zs=[]; for(let i=0;i<3;i++){ const zz=mesh('sph',[0.06,5,4], emat(0x7ae8ff,0x7ae8ff,0.8)); this.group.add(zz); this.zs.push(zz); }
    G.scene.add(this.group);
    this.shadow.scale.setScalar(2.2);
  }
  takeHit(player, kind){
    if(this.dead) return;
    this.hp -= (kind==='pound'?2:1);
    AUDIO.stomp && AUDIO.stomp();
    if(this.hp<=0){ this.die(); return; }
    if(this.state==='sleepwalk') this._wake();   // poking a sleeping bear works exactly as advertised
  }
  _wake(){
    this.state='roar'; this.st=0;
    AUDIO.bossRoar && AUDIO.bossRoar();
    const p=this.group.position;
    this.G.fx.spawn(new THREE.Vector3(p.x,p.y+2.2,p.z), 0x7ae8ff, 12, {speed:3.5, life:0.5});
    this.G.camc && this.G.camc.shake(0.25,0.35);
    if(this.G._bearSlam) this.G._bearSlam(p.x, 3.2);   // the lakes answer: nearby CrackIce panels shatter
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    if(this.state==='sleepwalk'){
      this.touchDamage=0; this.armR.visible=false;
      p.x += this.speed*this.dir*dt;
      if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; }
      else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; }
      this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
      this.body.position.y = Math.abs(Math.sin(this.t*2.6))*0.06;
      this.legs.forEach((l,i)=>{ l.rotation.x=Math.sin(this.t*2.6+i*Math.PI/2)*0.35; });
      this.headG.rotation.z = Math.sin(this.t*1.1)*0.06 - 0.12;   // the heavy dreaming head
      this.zs.forEach((z,i)=>{ const k=((this.t*0.5+i/3)%1); z.position.set(1.6+k*0.8, 2.0+k*0.9, Math.sin(k*9)*0.2); z.material.opacity=1-k; z.scale.setScalar(0.6+k*0.8); });
      // stand in a sleepwalking bear's path and the path wins
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<1.8 && Math.abs(pl.pos.z-p.z)<1.4 && Math.abs(pl.pos.y-p.y)<2.0) this._wake();
    } else if(this.state==='roar'){
      // rears up — 0.7s of unmistakable warning
      this.body.rotation.z = damp(this.body.rotation.z, -0.5, 9, dt);
      this.headG.rotation.z = damp(this.headG.rotation.z, 0.5, 9, dt);
      this.zs.forEach(z=>z.visible=false);
      if(this.st>0.7){ this.state='swipe'; this.st=0; this.armR.visible=true;
        this._dir = pl ? (Math.sign(pl.pos.x-p.x)||this.dir) : this.dir;
        this.group.rotation.y = this._dir>0?Math.PI/2:-Math.PI/2; }
    } else if(this.state==='swipe'){
      // ONE furious blind lunge — fast, short, then it's over
      this.touchDamage=1;
      this.body.rotation.z = damp(this.body.rotation.z, 0.15, 14, dt);
      this.armR.rotation.z = -0.4 - Math.sin(Math.min(this.st*7,Math.PI))*1.2;
      p.x += this._dir*7.0*dt;
      if(this.st>0.45){ this.state='yawn'; this.st=0; this.touchDamage=0; }
    } else { // yawn — stretches, forgets, resumes the dream
      this.armR.visible=false;
      this.body.rotation.z = damp(this.body.rotation.z, 0, 5, dt);
      this.headG.rotation.z = damp(this.headG.rotation.z, -0.12, 5, dt);
      if(this.st>1.4){ this.state='sleepwalk'; this.st=0; this.zs.forEach(z=>z.visible=true);
        this.dir = p.x>this.home.x?-1:1; }
    }
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- THE WRAITHDEER TEAM: a spectral sleigh-team sweeping a fixed air lane pulling NOTHING — the ghost of
// a delivery round that never ended. You HEAR the sleigh bells ~1s before they enter (the jingle IS the
// telegraph), then 3-4 glowing deer streak through in a line. Spectral: attacks pass through them (they are
// weather, not war) — you duck, hop, or hold the safe lane. The lead deer's nose glows warm amber. ----
class WraithdeerTeam {
  constructor(G, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false;   // spectral — not stompable, the class does its own touch
    this.x0=opts.x0!==undefined?opts.x0:60; this.x1=opts.x1!==undefined?opts.x1:-10;
    this.y=opts.y!==undefined?opts.y:1.6; this.n=opts.n||3;
    this.period=opts.period||9; this.phase=opts.phase||0; this.speed=opts.speed||11;
    this.t=this.phase; this._jingled=false;
    this.group=new THREE.Group();
    this.deer=[];
    const ghostM = new THREE.MeshLambertMaterial({color:0xcfe0f4, emissive:0x7ae8ff, emissiveIntensity:0.45, transparent:true, opacity:0.55});
    for(let i=0;i<this.n;i++){
      const d=new THREE.Group();
      const body=new THREE.Mesh(geo('sph',0.42,9,8), ghostM); body.scale.set(1.5,0.9,0.8); d.add(body);
      const neck=new THREE.Mesh(geo('cyl',0.14,0.18,0.6,6), ghostM); neck.position.set(0.55,0.35,0); neck.rotation.z=-0.6; d.add(neck);
      const head=new THREE.Mesh(geo('sph',0.22,8,7), ghostM); head.position.set(0.78,0.58,0); d.add(head);
      // antlers — the cold cyan crowns
      for(const s of [-1,1]){ const a1=mesh('cyl',[0.025,0.035,0.5,4], emat(0x7ae8ff,0x7ae8ff,0.9)); a1.position.set(0.72,0.95,s*0.14); a1.rotation.z=s*0.15; a1.rotation.x=s*0.5; d.add(a1);
        const a2=mesh('cyl',[0.02,0.03,0.3,4], emat(0x7ae8ff,0x7ae8ff,0.9)); a2.position.set(0.62,1.02,s*0.2); a2.rotation.x=s*1.1; d.add(a2); }
      const nose=mesh('sph',[0.07,6,5], i===0 ? emat(0xffb85e,0xff9a50,1.2) : new THREE.MeshLambertMaterial({color:0x2a3048}));
      nose.position.set(1.0,0.56,0); d.add(nose);   // the lead deer's warm glow — never named, always known
      for(const [lx,lz] of [[0.35,0.2],[0.35,-0.2],[-0.35,0.2],[-0.35,-0.2]]){ const lg=new THREE.Mesh(geo('cyl',0.05,0.06,0.5,4), ghostM); lg.position.set(lx,-0.45,lz); d.add(lg); }
      // ghost harness — a strand of faint bells back to the next deer
      if(i>0){ const strap=new THREE.Mesh(geo('cyl',0.02,0.02,1.4,4), ghostM); strap.rotation.z=Math.PI/2; strap.position.set(-1.05,0.2,0); d.add(strap);
        for(let b=0;b<3;b++){ const bell=mesh('sph',[0.05,5,4], emat(0xffd23f,0xffd23f,0.8)); bell.position.set(-0.6-b*0.35,0.12,0); d.add(bell); } }
      d.visible=false;
      this.group.add(d); this.deer.push(d);
    }
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    const cyc = this.t % this.period;
    const dir = Math.sign(this.x1-this.x0)||-1;
    const span = Math.abs(this.x1-this.x0);
    const runT = span/this.speed;
    // THE JINGLE — one second of sleigh bells before the sweep enters (the telegraph you learn to trust)
    if(cyc >= this.period-1 && !this._jingled){ this._jingled=true;
      const pl=G.player;
      if(pl && Math.abs(pl.pos.x-(this.x0+this.x1)/2) < span/2+16){
        AUDIO.tone && AUDIO.tone({f:2200,f2:1800,type:'sine',t:0.1,vol:0.08});
        setTimeout(()=>AUDIO.tone && AUDIO.tone({f:2400,f2:2000,type:'sine',t:0.1,vol:0.08}), 180);
        setTimeout(()=>AUDIO.tone && AUDIO.tone({f:2100,f2:1700,type:'sine',t:0.12,vol:0.08}), 380);
      } }
    if(cyc < runT){
      this._jingled=false;
      const headX = this.x0 + dir*this.speed*cyc;
      for(let i=0;i<this.deer.length;i++){
        const d=this.deer[i];
        const dx = headX - dir*i*1.9;
        const on = dir<0 ? (dx<=this.x0 && dx>=this.x1-4) : (dx>=this.x0 && dx<=this.x1+4);
        d.visible=on;
        if(on){ d.position.set(dx, this.y + Math.sin((this.t*7)+i*1.1)*0.18, 0);
          d.rotation.y = dir>0?Math.PI/2:-Math.PI/2;
          d.rotation.z = Math.sin(this.t*9+i)*0.08; }
        // spectral touch — each deer bites once per pass at most (i-frames handle overlap)
        const pl=G.player;
        // LOAD-BEARING CONSTANT (fleet-audit pin): the 1.1 body-reach here is what keeps GROUNDED players
        // safe under lanes at y>=1.6 by ~0.07u — levels place their lanes against THIS number. Do not
        // "clean it up" to pl.height (1.25) without re-auditing every deer lane in the district.
        if(on && pl && !pl.dead && Math.abs(pl.pos.x-dx)<0.85 && Math.abs(pl.pos.z)<1.2 &&
           pl.pos.y+1.1 > d.position.y-0.5 && pl.pos.y < d.position.y+0.9){
          pl.damage(1, new THREE.Vector3(dx, d.position.y, 0));
        }
      }
    } else this.deer.forEach(d=>d.visible=false);
  }
}

// ---- THE ICE ANGLER: a pale glow cruising UNDER the lake ice — it stalks your steps from below, harmless
// through the frozen glass... until it finds an OPENING (a fishing hole, a shattered CrackIce panel). Then:
// the glow swells, bubbles rise (~0.7s), and it LUNGES up through the hole, all teeth, and slaps back under.
// A stomp landed mid-lunge pops it (candy 5 — the brave line). Holes are registered by levels/lake tickers
// via G._anglerHoles (array of {x,r}); no holes in reach = it just follows, glowing, patient. ----
class IceAngler extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.speed=opts.speed||2.6; this.range=opts.range||14;
    this.hitR=0.5; this.headH=0.9; this.hitY=0.3; this.touchR=0.7; this.candyDrop=opts.candy!==undefined?opts.candy:5;
    this.state='stalk'; this.st=0; this.touchDamage=0;
    this.underY = opts.underY!==undefined?opts.underY:-0.9;
    const gM = new THREE.MeshLambertMaterial({color:0xbfe8ff, emissive:0x7ae8ff, emissiveIntensity:0.7, transparent:true, opacity:0.5});
    this.bodyG = new THREE.Group();
    const body=new THREE.Mesh(geo('sph',0.42,9,8), gM); body.scale.set(1.4,0.8,0.8); this.bodyG.add(body);
    const tail=new THREE.Mesh(geo('cone',0.28,0.5,7), gM); tail.rotation.z=Math.PI/2; tail.position.set(-0.65,0,0); this.bodyG.add(tail);
    // the lure — a warm little lantern on a stalk (an angler's oldest trick, now in festival colors)
    const stalk=new THREE.Mesh(geo('cyl',0.02,0.03,0.5,4), gM); stalk.position.set(0.45,0.42,0); stalk.rotation.z=-0.5; this.bodyG.add(stalk);
    this.lure=mesh('sph',[0.1,7,6], emat(0xffb85e,0xffb85e,1.1)); this.lure.position.set(0.62,0.6,0); this.bodyG.add(this.lure);
    // teeth, folded away until the lunge
    this.jaw = new THREE.Group();
    for(let i=0;i<4;i++){ const th=mesh('cone',[0.05,0.14,4], mat(0xf0f4ff)); th.position.set(0.5, -0.12, -0.18+i*0.12); th.rotation.z=Math.PI; this.jaw.add(th); }
    this.jaw.visible=false; this.bodyG.add(this.jaw);
    this.group.add(this.bodyG);
    this.group.position.y = this.underY;
    G.scene.add(this.group);
    this.shadow.visible=false;   // it IS the shadow under the ice
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    const holes = this.G._anglerHoles || [];
    if(this.state==='stalk'){
      this.touchDamage=0;
      p.y = this.underY + Math.sin(this.t*2)*0.08;
      this.bodyG.rotation.z = Math.sin(this.t*3)*0.1;
      this.lure.material.emissiveIntensity = 0.8+Math.sin(this.t*4)*0.3;
      if(pl && !pl.dead && Math.abs(pl.pos.x-this.home.x)<this.range){
        const dx=pl.pos.x-p.x;
        if(Math.abs(dx)>0.4){ p.x += Math.sign(dx)*this.speed*dt; this.bodyG.rotation.y = dx>0?0:Math.PI; }
        // found an opening under the player's feet?
        for(const h of holes){
          if(Math.abs(h.x-p.x)<0.9 && Math.abs(pl.pos.x-h.x)<h.r+1.2 && pl.pos.y<2.2){
            this.state='tele'; this.st=0; this._hx=h.x;
            AUDIO.noise && AUDIO.noise({t:0.4,vol:0.1,fFrom:300,fTo:900});   // the water stirs
            break;
          }
        }
      }
    } else if(this.state==='tele'){
      // the glow swells + bubbles — 0.7s to move your feet
      p.x = damp(p.x, this._hx, 10, dt);
      this.lure.material.emissiveIntensity = 1.2+Math.sin(this.t*22)*0.6;
      if(Math.random()<dt*14) this.G.fx.spawn(new THREE.Vector3(this._hx, 0.15, 0), 0xbfe8ff, 1, {speed:0.8, life:0.4});
      if(this.st>0.7){ this.state='lunge'; this.st=0; this.jaw.visible=true; this.touchDamage=1;
        AUDIO.noise && AUDIO.noise({t:0.25,vol:0.16,fFrom:600,fTo:1400}); }
    } else if(this.state==='lunge'){
      // up through the hole in a snapping arc, then back under
      const k=this.st/0.55;
      p.y = this.underY + Math.sin(Math.min(k,1)*Math.PI)*2.3;
      this.bodyG.rotation.z = -0.9 + k*1.6;
      if(k>=1){ this.state='stalk'; this.st=0; this.jaw.visible=false; this.touchDamage=0;
        this.G.fx.spawn(new THREE.Vector3(p.x, 0.1, 0), 0xbfe8ff, 6, {speed:2, life:0.4});
        p.y=this.underY; }
    }
    if(this.state==='lunge') this.touchPlayer(dt);
  }
}

// ---- THE POLAR TRIPLETS: three bear CUBS who ball up and roll fixed lanes — the 7-3 mid-boss (the Gourd
// Triplets tradition, now fluffy). Same deterministic roller clock as the snowballs, no growth, tiny face. ----
class PolarCub extends SnowballRoller {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z, Object.assign({r0:0.85, r1:0.85, speed:opts.speed||4.2}, opts));
    this.candyDrop = opts.candy!==undefined?opts.candy:4;
    // give the snowball a cub's face + stubby paws (visible as it rolls — kids will feel bad. briefly.)
    this.ball.material = emat(0xf2f0e8, 0x9aa4c0, 0.2);
    const snout=mesh('sph',[0.22,7,6], emat(0xd8d4c8,0x8a94b0,0.15)); snout.position.set(0,0,0.85); this.ball.add(snout);
    const nose=mesh('sph',[0.09,6,5], mat(0x1a1a28)); nose.position.set(0,0,1.02); this.ball.add(nose);
    for(const s of [-1,1]){ const eye=mesh('sph',[0.06,5,4], mat(0x1a1a28)); eye.position.set(s*0.3,0.28,0.82); this.ball.add(eye);
      const ear=mesh('sph',[0.14,6,5], emat(0xd8d4c8,0x8a94b0,0.15)); ear.position.set(s*0.45,0.75,0.35); this.ball.add(ear);
      const paw=mesh('sph',[0.16,6,5], emat(0xd8d4c8,0x8a94b0,0.15)); paw.position.set(s*0.5,-0.5,0.5); this.ball.add(paw); }
  }
}

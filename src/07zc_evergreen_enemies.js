// ============ EVERGREEN DEEP ROSTER — Winter District 4 enemies (Ornament Spider, Carol Boo, Wreath Wisp, Tinsel Tangler) ============
// The whispering pines: a haunted forest strung for a festival that went quiet mid-song. Same Enemy contract,
// deterministic state machines, fixed clocks. Colour language: ornament reds/golds against pine-dark green;
// the cold spirits still read icy cyan. By this district players check EVERYTHING for teeth — that's the joke.

// ---- ORNAMENT SPIDER: a glossy bauble hanging from a bough... with legs folded flat. It hangs dead-still
// among REAL baubles; come near and it RATTLES + unfolds (0.6s — eight legs where no legs should be) then
// drops on its thread and reels up/down a fixed lane, snipping. hp1 stomp/spin. Trust no decoration. ----
class OrnamentSpider extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hangY=y; this.dropY=opts.dropY!==undefined?opts.dropY:Math.max(0.8, y-2.6);
    this.wakeR=opts.wakeR||3.0; this.period=opts.period||3.2;
    this.hitR=0.45; this.headH=0.8; this.hitY=0.3; this.touchR=0.62; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.state='hang'; this.st=0; this.touchDamage=0;
    const cc=opts.color||0xd83a4a;
    this.baubleM = new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.35});
    this.thread = mesh('cyl',[0.015,0.015,1,4], mat(0x8a8f9a)); this.group.add(this.thread);
    this.bodyG = new THREE.Group();
    const ball=new THREE.Mesh(geo('sph',0.34,10,9), this.baubleM); this.bodyG.add(ball);
    const cap=mesh('cyl',[0.1,0.12,0.12,8], mat(0xc9a24a)); cap.position.y=0.38; this.bodyG.add(cap);
    const loop=mesh('tor',[0.06,0.02,4,8], mat(0xc9a24a)); loop.position.y=0.48; this.bodyG.add(loop);
    const band=mesh('tor',[0.34,0.03,4,14], emat(0xffd23f,0xc9a24a,0.4)); band.rotation.x=Math.PI/2; band.position.y=0.05; this.bodyG.add(band);   // the gilt stripe
    this.legs=[];
    for(let i=0;i<8;i++){ const s=i<4?-1:1; const leg=mesh('cyl',[0.02,0.03,0.5,4], mat(0x2a2036));
      leg.position.set(s*0.22, -0.05, -0.18+(i%4)*0.12); leg.rotation.z=s*1.3; leg.visible=false; this.legs.push(leg); this.bodyG.add(leg); }
    this.eyes=[];
    for(const s of [-1,1]){ const eye=mesh('sph',[0.045,5,4], emat(0x7ae8ff,0x7ae8ff,1)); eye.position.set(s*0.1,0.1,0.3); eye.visible=false; this.eyes.push(eye); this.bodyG.add(eye); }
    this.group.add(this.bodyG);
    G.scene.add(this.group);
    this.group.position.y=this.hangY;
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    // the thread always runs from the bough anchor down to the body
    const anchorY=this.home.y+1.2;
    this.thread.position.y = (anchorY-p.y)/2 + 0.4;
    this.thread.scale.y = Math.max(0.1, anchorY-p.y+0.4);
    if(this.state==='hang'){
      this.touchDamage=0;
      p.y = damp(p.y, this.hangY, 5, dt);
      this.bodyG.rotation.z = Math.sin(this.t*0.8)*0.05;   // the innocent sway — same as every real bauble
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<1.8){
        this.state='unfold'; this.st=0;
        AUDIO.noise && AUDIO.noise({t:0.12,vol:0.1,fFrom:2600,fTo:3400});   // the rattle
      }
    } else if(this.state==='unfold'){
      this.baubleM.emissiveIntensity = 0.35 + Math.sin(this.st*30)*0.4;
      if(this.st>0.3){ this.legs.forEach(l=>l.visible=true); this.eyes.forEach(e=>e.visible=true); }
      if(this.st>0.6){ this.state='reel'; this.st=0; this.touchDamage=1; }
    } else { // reel — rides its thread up and down a fixed lane, legs working
      const k=Math.sin(this.st*(TAU/this.period));
      p.y = (this.hangY+this.dropY)/2 + k*(this.hangY-this.dropY)/2;
      this.legs.forEach((l,i)=>{ l.rotation.z = (i<4?-1:1)*(1.3+Math.sin(this.t*10+i)*0.25); });
      this.bodyG.rotation.z = Math.sin(this.t*6)*0.1;
      // player walks away far enough → it re-disguises (and the next visitor gets the same show)
      if(pl && Math.abs(pl.pos.x-p.x)>this.wakeR+5){ this.state='hang'; this.st=0; this.touchDamage=0;
        this.legs.forEach(l=>l.visible=false); this.eyes.forEach(e=>e.visible=false); this.baubleM.emissiveIntensity=0.35; }
    }
    if(this.state==='reel') this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- CAROL BOO: they sing in ROUNDS. Placed in trios sharing one carol clock — each boo takes a VERSE
// (glow swells + a three-note phrase), and at its verse's end it dips into a gentle swoop-lunge. The singing
// IS the telegraph: hear the voice, know the swoop. THE COUNTER-VERB: stare at a singer and it gets stage
// fright — hides, skips its verse, and its swoop never comes. Silence the round one voice at a time. ----
class CarolBoo extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.verse = opts.verse||0;              // 0, 1, 2 — my slot in the round
    this.period = opts.period||6.0;          // the full carol
    this.hoverY=y; this.range=opts.range||9;
    this.hitR=0.5; this.headH=1.0; this.hitY=0.4; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:3;
    this.touchDamage=1;
    const notes=[[523,659,784],[587,740,880],[659,830,988]];
    this.notes = notes[this.verse%3];
    const bodyM = new THREE.MeshLambertMaterial({color:0xe8f0e2, emissive:0x8ac8a0, emissiveIntensity:0.25, transparent:true, opacity:0.88});
    this.bodyMat=bodyM;
    const body=new THREE.Mesh(geo('sph',0.48,10,9), bodyM); body.position.y=0.7; body.scale.set(1,1.15,0.95); this.group.add(body);
    const tail=new THREE.Mesh(geo('cone',0.4,0.55,8), bodyM); tail.rotation.x=Math.PI; tail.position.y=0.22; this.group.add(tail);
    // the mouth — a little caroler's O (it never quite closes)
    this.mouth=mesh('sph',[0.09,6,5], mat(0x14101f)); this.mouth.position.set(0,0.66,0.42); this.mouth.scale.set(1,1.3,0.5); this.group.add(this.mouth);
    for(const s of [-1,1]){ const eye=mesh('tor',[0.06,0.015,4,8,Math.PI], mat(0x14101f)); eye.position.set(s*0.16,0.84,0.42); eye.rotation.z=Math.PI; this.group.add(eye); }   // happy singing eyes
    const scarf=mesh('tor',[0.28,0.07,6,12], emat(0x3aa060,0x1e6038,0.3)); scarf.position.y=0.42; scarf.rotation.x=0.15; this.group.add(scarf);
    const book=mesh('box',[0.3,0.22,0.04], mat(0xf0e6c8)); book.position.set(0,0.4,0.4); book.rotation.x=-0.5; this.group.add(book);   // the tiny carol book
    G.scene.add(this.group);
    this.shy=false;
    // THE ROUND NEVER PAUSES (fleet-audit fix, empirically proven): the 70u entity cull froze trio members
    // one at a time as the player approached, de-syncing the shared clock — two voices swooping at once
    // breaks the round's whole promise (and the w9l2 music-box harmony, whose movers never pause). A carol
    // is a CLOCK: it runs whether or not anyone is listening. Cost: a few always-on updates per level.
    this.cull=false;
  }
  update(dt){
    this.t+=dt;
    const pl=this.G.player, p=this.group.position;
    p.y = this.hoverY + Math.sin(this.t*2.2)*0.16;
    const cyc = this.t % this.period;
    const vLen = this.period/3;
    const myStart = this.verse*vLen;
    const inVerse = cyc>=myStart && cyc<myStart+vLen;
    // the stare — stage fright silences the verse (the learned boo language, choral edition)
    if(pl && !pl.dead){
      const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz)||1;
      const pfx=Math.sin(pl.facing), pfz=Math.cos(pl.facing);
      this.shy = d<this.range && (pfx*(p.x-pl.pos.x)/d + pfz*(p.z-pl.pos.z)/d) > 0.25;
    }
    this.bodyMat.opacity = this.shy?0.45:0.88;
    this.mouth.scale.y = this.shy?0.3:1.3;
    if(inVerse && !this.shy){
      // SINGING: glow swells, the phrase plays (one note per third of the verse), the swoop lands on the last beat
      const vk=(cyc-myStart)/vLen;
      this.bodyMat.emissiveIntensity = 0.25 + Math.sin(vk*Math.PI)*0.5;
      const noteI = Math.floor(vk*3);
      if(this._n!==noteI && noteI<3){ this._n=noteI;
        const pl2=this.G.player;
        if(pl2 && Math.abs(pl2.pos.x-p.x)<18) AUDIO.tone && AUDIO.tone({f:this.notes[noteI], type:'sine', t:vLen/3*0.8, vol:0.09}); }
      if(vk>0.72 && !this._swooped){ this._swooped=true; this._sw0={x:p.x, y:p.y};
        this._swDir = pl ? Math.sign(pl.pos.x-p.x)||1 : 1; }
      if(this._swooped){
        const sk=Math.min((vk-0.72)/0.28, 1);
        p.x = this._sw0.x + this._swDir*Math.sin(sk*Math.PI)*2.6;
        p.y = this._sw0.y - Math.sin(sk*Math.PI)*1.6;
        this.group.rotation.z = -this._swDir*Math.sin(sk*Math.PI)*0.4;
      }
    } else {
      this._n=-1;
      if(this._swooped && !inVerse){ this._swooped=false; this.group.rotation.z=0; }
      this.bodyMat.emissiveIntensity = damp(this.bodyMat.emissiveIntensity, 0.25, 4, dt);
      if(this._sw0){ p.x = damp(p.x, this.home.x, 3, dt); }
    }
    this.touchPlayer(dt); this.updateShadow();
  }
}

// ---- WREATH WISP: a floating ring of holly-fire drifting a slow fixed oval. The CENTER is safe — jump
// THROUGH the wreath (candy sometimes waits inside); the burning rim costs a heart. A threat you thread. ----
class WreathWisp extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.rx=opts.rx||2.6; this.ry=opts.ry||0.9; this.period=opts.period||6.4;
    this.R=opts.r||1.05;                      // ring radius (the hole you thread)
    this.hitR=this.R+0.2; this.headH=this.R*2; this.hitY=0; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.touchDamage=0;                       // rim damage is bespoke — the center must stay safe
    const ringM = emat(0x2a5c38, 0x3aa060, 0.5);
    this.ring = mesh('tor',[this.R,0.16,7,22], ringM); this.group.add(this.ring);
    for(let i=0;i<8;i++){ const a=i/8*TAU; const berry=mesh('sph',[0.06,5,4], emat(0xd83a4a,0xd83a4a,0.9)); berry.position.set(Math.cos(a)*this.R, Math.sin(a)*this.R, 0.08); this.ring.add(berry); }
    this.flames=[];
    for(let i=0;i<6;i++){ const a=i/6*TAU; const fl=mesh('cone',[0.09,0.26,5], emat(0x7ae8ff,0x7ae8ff,0.9)); fl.position.set(Math.cos(a)*this.R, Math.sin(a)*this.R, 0); fl.rotation.z=a-Math.PI/2; this.flames.push(fl); this.ring.add(fl); }
    const bow=mesh('box',[0.3,0.2,0.08], emat(0xd83a4a,0x8a1e2c,0.3)); bow.position.set(0,-this.R,0.1); this.ring.add(bow);
    G.scene.add(this.group);
  }
  takeHit(player, kind){ this.die(); }        // pop it if you must — but threading it is faster (speedrun bait)
  update(dt){
    this.t+=dt;
    const p=this.group.position;
    const a=this.t*(TAU/this.period);
    p.x = this.home.x + Math.sin(a)*this.rx;
    p.y = this.home.y + Math.sin(a*2)*this.ry;
    this.ring.rotation.z += dt*0.6;
    this.flames.forEach((f,i)=>{ f.scale.y = 1+Math.sin(this.t*9+i)*0.3; });
    // bespoke rim check: hurt only within the TORUS band, never the hole
    const pl=this.G.player;
    if(pl && !pl.dead && Math.abs(pl.pos.z-p.z)<0.9){
      const dx=pl.pos.x-p.x, dy=(pl.pos.y+0.6)-p.y;
      const d=Math.hypot(dx,dy);
      if(Math.abs(d-this.R)<0.32) pl.damage(1, new THREE.Vector3(p.x+dx,p.y+dy,p.z));
    }
    this.updateShadow();
  }
}

// ---- TINSEL TANGLER: a tinsel-wrapped gremlin whose lasso attacks your TIME, not your hearts — the
// speedrun-era threat. It twirls (0.7s glittering telegraph) then throws a short tinsel loop: get caught
// and you're SLOWED 40% for 1.2s (tinsel trails from your ankles; a spin shakes it early). Touching the
// gremlin itself costs the usual heart. hp1. Runners will hate it correctly. ----
class TinselTangler extends Enemy {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z);
    this.t = opts.phase||0;
    this.hitR=0.5; this.headH=0.95; this.hitY=0.4; this.touchR=0.66; this.candyDrop=opts.candy!==undefined?opts.candy:4;
    this.range=opts.range||2.4; this.dir=opts.dir||1; this.speed=opts.speed||1.4;
    this.wakeR=opts.wakeR||5.5; this.lassoP=opts.lassoP||4.0;
    this.state='patrol'; this.st=0; this._lt=this.lassoP*0.5;
    const skin = emat(0x4a6a4a, 0x2a3e2a, 0.2);
    const body=mesh('sph',[0.34,9,8], skin); body.position.y=0.55; body.scale.set(1,1.2,0.9); this.group.add(body);
    const head=mesh('sph',[0.24,8,7], skin); head.position.y=1.0; this.group.add(head);
    for(const s of [-1,1]){ const ear=mesh('cone',[0.08,0.26,4], skin); ear.position.set(s*0.18,1.2,0); ear.rotation.z=s*0.5; this.group.add(ear);
      const eye=mesh('sph',[0.05,5,4], emat(0xffd23f,0xffd23f,1)); eye.position.set(s*0.1,1.02,0.2); this.group.add(eye); }
    // wrapped head to toe in stolen tinsel — it glitters when it moves
    this.tinsel=[];
    for(let i=0;i<4;i++){ const tw=mesh('tor',[0.28-i*0.03,0.03,4,12], emat(pick([0xd83a4a,0xffd23f,0x7ae8ff]), 0x8a8f9a, 0.5)); tw.position.y=0.35+i*0.2; tw.rotation.x=Math.PI/2; tw.rotation.z=i*0.4; this.tinsel.push(tw); this.group.add(tw); }
    this.lasso = mesh('tor',[0.3,0.03,4,14], emat(0xffd23f,0xc9a24a,0.7)); this.lasso.position.set(0.4,1.3,0); this.lasso.visible=false; this.group.add(this.lasso);
    G.scene.add(this.group);
  }
  update(dt){
    this.t+=dt; this.st+=dt;
    const pl=this.G.player, p=this.group.position;
    this.tinsel.forEach((tw,i)=>{ tw.rotation.z += dt*(0.5+i*0.2); });
    if(this.state==='patrol'){
      this.touchDamage=1;
      p.x += this.speed*this.dir*dt;
      if(p.x>this.home.x+this.range){ p.x=this.home.x+this.range; this.dir=-1; }
      else if(p.x<this.home.x-this.range){ p.x=this.home.x-this.range; this.dir=1; }
      this.group.rotation.y = this.dir>0?Math.PI/2:-Math.PI/2;
      this.group.position.y = this.home.y + Math.abs(Math.sin(this.t*7))*0.08;
      if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.wakeR && Math.abs(pl.pos.z-p.z)<2){
        this._lt-=dt;
        if(this._lt<=0){ this._lt=this.lassoP; this.state='twirl'; this.st=0;
          this._dir=Math.sign(pl.pos.x-p.x)||1; this.group.rotation.y=this._dir>0?Math.PI/2:-Math.PI/2;
          this.lasso.visible=true;
          AUDIO.noise && AUDIO.noise({t:0.5,vol:0.08,fFrom:3000,fTo:4000}); }   // the glitter-whir
      }
    } else if(this.state==='twirl'){
      // 0.7s of visible lasso-spinning over its head
      this.lasso.position.set(0,1.5,0);
      this.lasso.rotation.x = this.t*18;
      this.lasso.scale.setScalar(1+this.st*0.8);
      if(this.st>0.7){ this.state='throw'; this.st=0; }
    } else { // throw — the loop sails a short fixed arc; catch = SLOW, not damage
      const k=this.st/0.5;
      this.lasso.position.set(this._dir*k*3.2, 1.5-k*1.1, 0);
      if(pl && !pl.dead && k<1){
        const lx=p.x+this._dir*k*3.2, ly=p.y+1.5-k*1.1;
        if(Math.abs(pl.pos.x-lx)<0.55 && Math.abs(pl.pos.z-p.z)<1.0 && Math.abs(pl.pos.y+0.6-ly)<0.9 && !pl._tangled){
          pl._tangled = 1.2;   // 06_player consumes this: 40% slow, tinsel trail, spin shakes it early
          AUDIO.tone && AUDIO.tone({f:2200,f2:800,type:'sine',t:0.2,vol:0.1});
          this.G.fx.spawn(new THREE.Vector3(pl.pos.x,pl.pos.y+0.8,pl.pos.z), 0xffd23f, 10, {speed:2, life:0.6});
          window.UI && UI.toast('🎀 TANGLED! Spin to shake the tinsel!');
        }
      }
      if(k>=1){ this.state='patrol'; this.st=0; this.lasso.visible=false; this.lasso.scale.setScalar(1); }
    }
    if(this.state!=='throw') this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- THE BAUBLE TRIPLETS: three giant glass ornaments rolling fixed lanes — Evergreen's trio (the signs
// have stopped explaining). SnowballRoller clock, glass-ornament skin with caps. ----
class BaubleTriplet extends SnowballRoller {
  constructor(G,x,y,z,opts={}){
    super(G,x,y,z, Object.assign({r0:0.82, r1:0.82, speed:opts.speed||4.3}, opts));
    this.candyDrop = opts.candy!==undefined?opts.candy:4;
    const cc=opts.color||pick([0xd83a4a,0xffd23f,0x3aa060]);
    this.ball.material = new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.35});
    const cap=mesh('cyl',[0.2,0.24,0.22,9], mat(0xc9a24a)); cap.position.y=0.85; this.ball.add(cap);
    const loop=mesh('tor',[0.1,0.03,4,8], mat(0xc9a24a)); loop.position.y=1.02; this.ball.add(loop);
    const shine=mesh('sph',[0.16,6,5], emat(0xffffff,0xffffff,0.6)); shine.position.set(-0.3,0.35,0.6); this.ball.add(shine);
  }
}

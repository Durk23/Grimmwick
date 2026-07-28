// ============ BOSS 1 — The Pumpkin King ============
function buildBossArena(G){
  const S = G.scene;
  // ---- side-view arena: a wide pumpkin-field stage, lane z=0 ----
  const W = 46, D = 12;
  const ground = mesh('box',[W,1.4,D], mat(0x51427a)); ground.position.set(0,-0.7,0); S.add(ground);
  G.world.addBox(0,-1.4,0,W,1.4,D,{});
  // background: fence, watching pumpkin crowd, trees, moonlit hills
  const deco = new THREE.Group();
  fenceRun(deco, -22, -4.4, 22, -4.4, 20);
  for(let i=0;i<12;i++) deco.add(pumpkinDeco(rand(-20,20), rand(-5.6,-3.2), rand(0.5,1), true));
  for(let i=0;i<7;i++) deco.add(deadTree(rand(-21,21), rand(-9,-5.8), rand(0.9,1.6)));
  for(let i=0;i<4;i++) deco.add(pumpkinDeco(rand(-18,18), rand(3.4,4.6), rand(0.5,0.8), true));
  S.add(bakeGroup(deco));
  // torches light the stage
  for(const tx of [-15,-5,5,15]){
    const t = mesh('cyl',[0.1,0.14,2.2,6], mat(0x241c38)); t.position.set(tx,1.1,-3.4); S.add(t);
    const fl = mesh('sph',[0.22,7,6], emat(PAL.pumpkin,PAL.pumpkin,1)); fl.position.set(tx,2.4,-3.4); S.add(fl);
    const l = new THREE.PointLight(0xff8c3e,60,15); l.position.set(tx,2.6,-2); S.add(l);
  }
  // SECRET TAKEDOWN tools: bouncy pumpkins at the arena edges
  bigPumpkin(G, -16, -0.5, 0, 1.6);
  bigPumpkin(G, 16, -0.5, 0, 1.6);
  // walls
  G.world.addBox(-24.5,0,0, 4,10,D,{});
  G.world.addBox(24.5,0,0, 4,10,D,{});
  G.spawnPoint.set(-13,0.6,0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 5, 26);
  G.amb = buildAmbience(S, -24, 24);
  buildClutter(G, -20, 20, 'farm');
  G.boss = new PumpkinKing(G);
}

class PumpkinKing {
  constructor(G){
    this.G = G;
    this.maxHp = 3; this.hp = 3;
    this.dead = false;
    this.pos = new THREE.Vector3(8, 0, 0);
    this.vy = 0;
    this.state = 'intro'; this.stateT = 0;
    this.slamCount = 0;
    this.phase = 1;
    this.shockwaves = [];
    this.seeds = [];
    this.vulnerable = false;
    this.t = 0;
    this.buildRig();
    this.shadow = blobShadow(2.6);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('The Pumpkin King', this.hp, this.maxHp); }
    AUDIO.bossRoar();
  }
  buildRig(){
    this.group = new THREE.Group();
    const body = new THREE.Group();
    // big pumpkin body
    const b = mesh('sph',[2.3,14,12], emat(PAL.pumpkin, 0xcc4a00, 0.25)); b.position.y=2.1; b.scale.set(1.12,0.88,1.12);
    for(let i=0;i<5;i++){
      const seg = mesh('sph',[2.3,12,10], mat(PAL.pumpkinD));
      seg.scale.set(1.06,0.84,0.22); seg.position.y=2.1; seg.rotation.y=i*Math.PI/5;
      body.add(seg);
    }
    const stem = mesh('cyl',[0.28,0.42,0.9,7], mat(PAL.stem)); stem.position.y=4.35; stem.rotation.z=0.2;
    // corrupted ember crown
    const crown = new THREE.Group();
    for(let i=0;i<5;i++){
      const a=(i/5)*TAU;
      const spike = mesh('cone',[0.16,0.55,4], emat(0xff5030,0xff2e10,0.9));
      spike.position.set(Math.cos(a)*0.75, 4.6, Math.sin(a)*0.75);
      crown.add(spike);
    }
    // angry glowing face
    const fm = emat(0xffdf70, 0xffb02e, 1);
    this.eyeL = mesh('cone',[0.42,0.6,3], fm); this.eyeL.position.set(-0.85,2.7,2.15); this.eyeL.rotation.x=0.15; this.eyeL.rotation.z=-0.35;
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.85; this.eyeR.rotation.z=0.35;
    this.mouth = new THREE.Group();
    const m1 = mesh('box',[1.7,0.3,0.15], fm); m1.position.set(0,1.55,2.3);
    for(let i=0;i<3;i++){
      const tooth = mesh('box',[0.3,0.35,0.14], fm);
      tooth.position.set(-0.5+i*0.5, 1.78, 2.3);
      this.mouth.add(tooth);
    }
    this.mouth.add(m1);
    // ember heart glow inside
    this.ember = mesh('sph',[0.4,9,7], emat(0xff3010,0xff2000,1)); this.ember.position.set(0,2.1,0);
    this.emberLight = new THREE.PointLight(0xff5020, 70, 20); this.emberLight.position.set(0,3,0);
    // stubby vine arms
    this.armL = new THREE.Group();
    const aL1 = mesh('cyl',[0.22,0.3,1.8,6], mat(PAL.vine)); aL1.rotation.z=1; aL1.position.set(-2.6,2.4,0);
    const handL = mesh('sph',[0.45,8,7], mat(PAL.vine)); handL.position.set(-3.4,1.9,0);
    this.armL.add(aL1,handL);
    this.armR = new THREE.Group();
    const aR1 = mesh('cyl',[0.22,0.3,1.8,6], mat(PAL.vine)); aR1.rotation.z=-1; aR1.position.set(2.6,2.4,0);
    const handR = mesh('sph',[0.45,8,7], mat(PAL.vine)); handR.position.set(3.4,1.9,0);
    this.armR.add(aR1,handR);
    body.add(b, stem, crown, this.eyeL, this.eyeR, this.mouth, this.ember, this.emberLight, this.armL, this.armR);
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // dizzy stars (hidden until stunned)
    this.stars = new THREE.Group();
    for(let i=0;i<3;i++){
      const st = mesh('sph',[0.18,6,5], emat(0xffe66e,0xffe66e,1));
      this.stars.add(st);
    }
    this.stars.visible = false;
    this.stars.position.y = 5.1;
    this.group.add(this.stars);
  }
  onPlayerPound(pos){
    // ground pound near the king while vulnerable also counts as a hit
    if(this.vulnerable && Math.hypot(pos.x-this.pos.x, pos.z-this.pos.z) < 4.2) this.takeHit();
  }
  takeHit(){
    if(this.dead || !this.vulnerable) return;
    this.hp--;
    this.vulnerable = false;
    AUDIO.bossHit();
    this.G.hitstop = 0.09;
    this.G.camc.shake(0.5,0.4);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+3,this.pos.z), 0xffdf70, 20, {speed:5});
    UI.updateBossBar(this.hp);
    UI.toast(this.hp>0 ? ['','"OW! My crown! GRRRR!"','"You... you little SPROUT!"'][this.hp] : '');
    if(this.hp<=0){ this.defeat(); return; }
    this.phase = this.maxHp-this.hp+1;
    this.state='enrage'; this.stateT=0;
  }
  defeat(){
    this.dead = true;
    this.state='defeat'; this.stateT=0;
    AUDIO.victory();
    UI.hideBossBar();
    // clear every live threat so the 4.2s celebration can't hurt/kill the player (matches boss 2's bat dissipate)
    for(const e of this.G.ents.list){ if(e.isEnemy && !e.dead){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); } }
    for(const sw of this.shockwaves) this.G.scene.remove(sw.mesh);
    this.shockwaves.length = 0;
    for(const s of this.seeds) this.G.scene.remove(s.mesh, s.shadow);
    this.seeds.length = 0;
    const p = this.pos;
    for(let i=0;i<4;i++){
      setTimeout(()=>{
        if(this.G.scene) this.G.fx.spawn(new THREE.Vector3(p.x+rand(-2,2), p.y+rand(1,4), p.z+rand(-2,2)), pick([PAL.gold,PAL.pumpkin,0xffffff]), 14, {speed:5});
      }, i*280);
    }
    candyBurst(this.G, new THREE.Vector3(p.x,p.y+2,p.z), 24);
    this.G.onBossDefeated();
  }
  hurtPlayer(n, from){
    const pl = this.G.player;
    if(pl) pl.damage(n, from||this.pos);
  }
  spawnShockwave(){
    AUDIO.shockwave();
    const ring = new THREE.Mesh(geo('tor',1,0.28,7,30), emat(0xffb02e,0xff8c2e,0.9));
    ring.rotation.x = Math.PI/2;
    ring.position.set(this.pos.x, 0.32, this.pos.z);
    this.G.scene.add(ring);
    this.shockwaves.push({mesh:ring, r:1, speed:this.phase>=3?10:8, hit:false});
    this.G.camc.shake(0.4,0.3);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x,0.4,this.pos.z), 0xbb9955, 12, {speed:4, life:0.4});
  }
  spawnSeeds(){
    const pl = this.G.player;
    const n = this.phase>=3?5:3;
    for(let i=0;i<n;i++){
      const seed = mesh('sph',[0.3,7,6], emat(0xf0e6b0,0xd9c86e,0.6));
      seed.scale.set(1,1.25,1);
      seed.position.set(this.pos.x, this.pos.y+2.5, this.pos.z);
      this.G.scene.add(seed);
      // lob toward player with spread
      const tx = clamp(pl.pos.x+rand(-4,4)*(i>0?1:0.2), -21, 21), tz = rand(-0.6,0.6);
      const dx=tx-this.pos.x, dz=tz-this.pos.z, d=Math.hypot(dx,dz)||1;
      const T = 1.1;
      const shadow = blobShadow(0.4);
      shadow.position.set(tx,0.03,tz);
      this.G.scene.add(shadow);
      this.seeds.push({mesh:seed, shadow, vx:dx/T, vz:dz/T, vy: 0.5*22*T - (this.pos.y+2.5)/T, t:0, T});
    }
  }
  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    const G = this.G, pl = G.player;
    const p = this.pos;
    const distToPlayer = pl ? Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) : 99;

    // SECRET: a bounce-launched head stomp crits him even when he isn't dizzy
    if(pl && !this.dead && this.state!=='intro' && this.state!=='defeat' && !this.vulnerable){
      const headY = p.y + this.body.position.y + 3.2;
      if(pl.vel.y < -1 && G.time - (pl.lastBounce||-99) < 3 && distToPlayer < 2.8 && pl.pos.y > headY-0.8 && pl.pos.y < headY+1.4){
        pl.bounceOff(13);
        AUDIO.stomp();
        this.vulnerable = true;   // open the window for takeHit
        this.takeHit();
        pl.lastBounce = -99;      // one bounce = one crit (chain crits need a fresh pumpkin bounce)
        UI.toast('💥 CRITICAL! He never could resist a bounce!');
        this.G.fx.spawn(new THREE.Vector3(p.x, headY, p.z), 0xffdf70, 26, {speed:6});
      }
    }
    // gentle discovery hint if the fight drags on at full health
    if(!this._chant && this.t > 28 && this.hp === this.maxHp && !this.dead){
      this._chant = true;
      UI.toast("🎃 The pumpkin crowd chants: 'BOUNCE! BOUNCE! BOUNCE!'");
    }

    // face player
    if(pl && this.state!=='defeat'){
      const want = Math.atan2(pl.pos.x-p.x, pl.pos.z-p.z);
      this.group.rotation.y = angleDamp(this.group.rotation.y, want, this.state==='stun'?1:4, dt);
    }

    switch(this.state){
      case 'intro':
        this.body.position.y = Math.max(0, 8-this.stateT*10);
        if(this.stateT>1.1){ this.state='taunt'; this.stateT=0;
          G.camc.shake(0.6,0.4);
          UI.dialogue('🎃', '"WHO DARES enter MY patch?! This ember is MINE now... and so is ALL the candy in Grimmwick!"');
        }
        break;
      case 'taunt':
        if(this.stateT>1.2){ this.state='hop'; this.stateT=0; this.slamCount=0; }
        break;
      case 'hop': {
        // hop toward player, 3 hops then big slam
        this.vy -= 22*dt;
        p.y += this.vy*dt;
        if(p.y<=0){
          p.y=0;
          if(this.vy<-1){
            // landed a hop
            G.fx.spawn(new THREE.Vector3(p.x,0.2,p.z), 0x997755, 6, {speed:2,life:0.3});
            this.slamCount++;
            if(this.slamCount>=3){ this.state='bigslam'; this.stateT=0; this.vy=13; AUDIO.bossRoar(); }
            else this.vy = 8.5;
          } else if(this.vy===0 && this.stateT>0.1){
            this.vy = 8.5;
          }
          if(this.vy>0 && pl){
            const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz)||1;
            const sp = clamp(d*0.85, 2.5, this.phase>=2?7.5:6);
            this.hx=dx/d*sp; this.hz=dz/d*sp;
          }
        } else {
          p.x += (this.hx||0)*dt; p.z += (this.hz||0)*dt;
        }
        // contact damage while hopping
        if(pl && distToPlayer<2.9 && pl.pos.y < p.y+3.5) this.hurtPlayer(1);
        break;
      }
      case 'bigslam': {
        this.vy -= 30*dt;
        p.y += this.vy*dt;
        if(this.vy>0 && pl){ // track player mid-air
          const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz)||1;
          p.x += dx/d*Math.min(d,7)*dt*1.6; p.z += dz/d*Math.min(d,7)*dt*1.6;
        }
        if(p.y<=0 && this.vy<0){
          p.y=0;
          AUDIO.poundHit();
          this.spawnShockwave();
          if(this.phase>=2) setTimeout(()=>{ if(!this.dead && this.state==='stun') this.spawnShockwave(); }, 420);
          if(pl && distToPlayer<3.4) this.hurtPlayer(1);
          this.state='stun'; this.stateT=0; this.vulnerable=true;
          this.stars.visible=true;
          UI.toast('⭐ He\'s dizzy! Jump on his head!');
        }
        if(pl && distToPlayer<2.9 && pl.pos.y<p.y+3.5 && this.vy<0) this.hurtPlayer(1);
        break;
      }
      case 'stun': {
        // vulnerable window
        const stunLen = this.phase>=3?3.2:4.2;
        this.body.rotation.z = Math.sin(this.t*2)*0.08;
        this.body.position.y = -0.5; // slumped low so head is reachable
        this.stars.children.forEach((st,i)=>{
          const a = this.t*3+i*(TAU/3);
          st.position.set(Math.cos(a)*1.1, 0, Math.sin(a)*1.1);
        });
        // player stomp detection on head
        if(pl && this.vulnerable){
          const headY = p.y + 3.2;
          if(pl.vel.y<0 && distToPlayer<2.7 && pl.pos.y>headY-0.7 && pl.pos.y<headY+1.2){
            pl.bounceOff(12);
            AUDIO.stomp();
            this.takeHit();
            break;
          }
        }
        if(this.stateT>stunLen){
          this.state='recover'; this.stateT=0; this.vulnerable=false; this.stars.visible=false;
        }
        break;
      }
      case 'recover':
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        if(this.stateT>0.8){
          this.stateT=0; this.slamCount=0;
          // fixed pattern, not Math.random() — boss time feeds the leaderboard, so the fight must replay identically
          this.seq = (this.seq||0)+1;
          if(this.phase>=2 && (this.seq%2===1)){ this.state='seeds'; this.spawnSeeds(); }
          else this.state='hop';
        }
        break;
      case 'seeds':
        if(this.stateT>1.4){ this.state='hop'; this.stateT=0; this.slamCount=0; }
        break;
      case 'enrage': {
        // vine sweep spin after taking a hit
        this.body.position.y = damp(this.body.position.y, 0, 8, dt);
        this.stars.visible=false;
        this.body.rotation.y += dt*(6+this.phase);
        this.armL.scale.x = 1.9; this.armR.scale.x = 1.9;
        // sweeping vine hits player if close & low
        if(pl && this.stateT>0.3 && distToPlayer<6.2 && pl.pos.y < p.y+1.6){
          this.hurtPlayer(1);
        }
        if(this.stateT>2.1){
          this.state='hop'; this.stateT=0; this.slamCount=0;
          this.body.rotation.y=0; this.armL.scale.x=1; this.armR.scale.x=1;
          UI.toast(this.phase>=3 ? '🔥 Final phase — he\'s furious!' : '⚡ Phase '+this.phase+'!');
        }
        break;
      }
      case 'defeat': {
        this.body.rotation.z = Math.sin(this.stateT*3)*0.1;
        this.body.scale.setScalar(Math.max(0.45, 1-this.stateT*0.18));
        this.ember.scale.setScalar(1+this.stateT*0.8);
        if(this.stateT>2.6 && !this._farewell){
          this._farewell = true;
          UI.dialogue('🎃', '"...oh my gourd. What have I done? Take the ember, little Pip. And... that shadow. I KNOW that shadow. He helped me plant the very first pumpkin, back before the first Festival. Why did I ever forget him?" 🧡');
        }
        break;
      }
    }

    // ---- shockwaves ----
    for(let i=this.shockwaves.length-1;i>=0;i--){
      const sw = this.shockwaves[i];
      sw.r += sw.speed*dt;
      sw.mesh.scale.set(sw.r, sw.r, 1);
      sw.mesh.material.opacity = 1;
      if(pl && !sw.hit){
        const d = Math.hypot(pl.pos.x-sw.mesh.position.x, pl.pos.z-sw.mesh.position.z);
        if(Math.abs(d-sw.r)<0.8 && pl.pos.y<0.75){
          sw.hit=true;
          this.hurtPlayer(1, new THREE.Vector3(sw.mesh.position.x, 0, sw.mesh.position.z));
        }
      }
      if(sw.r>22){ this.G.scene.remove(sw.mesh); this.shockwaves.splice(i,1); }
    }
    // ---- seeds ----
    for(let i=this.seeds.length-1;i>=0;i--){
      const s = this.seeds[i];
      s.t += dt;
      s.vy -= 22*dt;
      s.mesh.position.x += s.vx*dt;
      s.mesh.position.z += s.vz*dt;
      s.mesh.position.y += s.vy*dt;
      s.shadow.scale.setScalar(clamp(1-s.mesh.position.y*0.06,0.3,1));
      if(s.mesh.position.y<=0.2){
        if(pl && Math.hypot(pl.pos.x-s.mesh.position.x, pl.pos.z-s.mesh.position.z)<1.2 && pl.pos.y<1) this.hurtPlayer(1, s.mesh.position);
        this.G.fx.spawn(s.mesh.position, 0xd9c86e, 6, {speed:2.5, life:0.35});
        this.G.scene.remove(s.mesh, s.shadow);
        this.seeds.splice(i,1);
      }
    }
    // ---- minions during phase>=2 (fixed 4s clock — deterministic, replaces the old per-frame Math.random gate) ----
    if(this.phase>=2 && !this.dead && this.state==='hop'){
      const minions = this.G.ents.list.filter(e=>e.isEnemy && !e.dead).length;
      if(this.nextMinion===undefined) this.nextMinion = this.t + 4;
      if(minions<this.phase && this.t>=this.nextMinion){
        this.nextMinion = this.t + 4;
        this.minionSide = -(this.minionSide||1);   // alternate sides, learnable
        this.G.ents.add(new Hopper(this.G, clamp(p.x+7*this.minionSide, -20, 20), 0, 0, {aggroR:40}));
      }
    }

    // visuals
    this.group.position.copy(p);
    this.ember.scale.setScalar((this.dead?this.ember.scale.x:1)+Math.sin(this.t*6)*0.15);
    this.emberLight.intensity = 60+Math.sin(this.t*7)*20;
    this.shadow.position.set(p.x, 0.03, p.z);
    this.shadow.scale.setScalar(clamp(1-p.y*0.05, 0.4, 1));
    // mouth chomp while hopping
    this.mouth.position.y = (this.state==='hop'||this.state==='bigslam') ? Math.abs(Math.sin(this.t*8))*0.12 : 0;
  }
}

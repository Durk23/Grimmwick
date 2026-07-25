// ============ BOSS 5 — Grimm's Cursed Cauldron (Cursed Castle · THE FINALE) ============
// The last guardian — and the whole story's turn. Grimm the Forgotten Guest has been brewing the 4 stolen
// embers in a giant possessed CAULDRON, his shadow arms and glowing eyes rising from the black brew. He is
// intangible — swings/stomps do nothing to the mist. The killing blow is NOT a blow.
//
// THE SECRET TAKEDOWN (the whole game pays off): FOUR burners ring the arena. Pip feeds the 4 recovered embers
// by REACHING each burner (walk to it under fire). Each lit burner SWEETENS the brew a quarter (black→candy-pink),
// STRIPS one of Grimm's four attacks, and pushes the encroaching shadow back. All 4 fed → Grimm is FLUSHED OUT of
// the pot, small and startled on the rim. Then the finisher is not an attack — walk up and INTERACT (E / 👆):
// "Come to the festival, Grimm. You were always invited." He accepts. The Everflame relights whole; he becomes
// the town's night-watchman. Wholesome ending, sequel-ready.
//
// FAIRNESS / DETERMINISM: every attack is telegraphed (potion-rain fuse + ground ring; the arm-slam target glow;
// the goo-wave's steady sweep) on FIXED clocks; the fight gets EASIER as you light burners (fewer attacks), so it
// always resolves. The shrinking dark is COSMETIC (never traps — walls never fully close, and burners reopen them).
// Contact/hazards are heart-cost with i-frames, never a combo death. rand() (seeded per area) is cosmetic jitter.
//
// ENGINE CONTRACT (mirrors 10_boss1..10d_boss4): G.boss singleton with update(dt) (reads this.G); NOT an ents
// entity. Boss bar via UI.showBossBar/updateBossBar/hideBossBar (shows the 4 attacks remaining). defeat() plays
// the ending cutscene then calls G.onBossDefeated(). buildBossArena5 sets G.spawnPoint/world/bats/amb + G.boss.

class GrimmCauldron {
  constructor(G){
    this.G = G;
    this.dead = false; this.t = 0; this.state = 'intro'; this.stateT = 0;
    this.pos = new THREE.Vector3(0, 1.6, 0);        // Grimm rises from the cauldron at center
    // ---- the 4 burners (relight objective), each tied to one attack it strips ----
    this.burnerX = [-11, -5.5, 5.5, 11];
    this.burners = [];
    this.litCount = 0;
    this.attacks = ['potion','shadow','arm','goo'];  // burner i strips attacks[i]
    this.stripped = {potion:false, shadow:false, arm:false, goo:false};
    // ---- attack clocks ----
    this.nextAtk = 2.5; this.atkI = 0; this.shadows = []; this.slam = null; this.wave = null;
    // ---- flushed / invite ----
    this.flushed = false; this._endStage = -1; this._endT = 0;
    this._introDlg = false; this._hint = false; this._flushHint = false;
    this.buildRig();
    this.buildBurners();
    G.scene.add(this.group);
    if(window.UI){ UI.showBossBar('Grimm, the Forgotten Guest', 4, 4); }
    AUDIO.bossRoar && AUDIO.bossRoar();
  }

  buildRig(){
    this.group = new THREE.Group();
    // the great cauldron (static, center)
    const iron=mat(0x1a1622), rim=mat(W5PAL.shadowL);
    const belly = mesh('sph',[2.4,16,14], iron); belly.position.y=1.4; belly.scale.set(1,0.82,1); this.group.add(belly);
    const lip = mesh('cyl',[2.5,2.7,0.4,20], rim); lip.position.y=2.7; this.group.add(lip);
    // the brew surface (its own animated instance: black → candy-pink as burners light)
    this.brew = mesh('cyl',[2.3,2.3,0.2,20], emat(0x1a0e22, W5PAL.shadowP, 0.6).clone()); this.brew.position.y=2.72; this.group.add(this.brew);
    for(let i=0;i<3;i++){ const leg=mesh('cyl',[0.18,0.22,1.4,6], iron); const a=i/3*TAU; leg.position.set(Math.cos(a)*1.7,0.7,Math.sin(a)*1.7); leg.rotation.z=Math.cos(a)*0.2; leg.rotation.x=-Math.sin(a)*0.2; this.group.add(leg); }
    // Grimm — a shadow figure rising from the brew: hooded body, big glowing eyes, two shadow arms
    this.grimm = new THREE.Group();
    const shadowM = new THREE.MeshLambertMaterial({color:0x1a1428, emissive:W5PAL.shadowP, emissiveIntensity:0.6, transparent:true, opacity:0.9});
    this.grimmMat = shadowM;
    const hood = new THREE.Mesh(geo('sph',0.9,12,10), shadowM); hood.scale.set(1,1.3,0.9); hood.position.y=0.5; this.grimm.add(hood);
    const cowl = new THREE.Mesh(geo('cone',0.95,1.4,10), shadowM); cowl.position.y=1.1; this.grimm.add(cowl);
    this.eyeL = mesh('sph',[0.16,8,7], emat(0xff8a3a,0xff8a3a,1)); this.eyeL.position.set(-0.3,0.7,0.7);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.3; this.grimm.add(this.eyeL,this.eyeR);
    this.armL = this._arm(shadowM,-1); this.armR = this._arm(shadowM,1);
    this.grimm.add(this.armL, this.armR);
    this.grimm.position.set(0, 2.9, 0); this.group.add(this.grimm);
    // encroaching shadow walls (COSMETIC pressure — never solid)
    this.darkL = new THREE.Mesh(geo('box',6,14,10), new THREE.MeshBasicMaterial({color:0x0e0a16, transparent:true, opacity:0.85}));
    this.darkR = this.darkL.clone(); this.darkL.position.set(-24,4,-1); this.darkR.position.set(24,4,-1);
    this.group.add(this.darkL, this.darkR);
  }
  _arm(m, s){
    const arm = new THREE.Group();
    for(let i=0;i<4;i++){ const seg=new THREE.Mesh(geo('sph',0.24-i*0.03,8,7), m); seg.position.set(s*(0.7+i*0.5), -i*0.2, 0); arm.add(seg); }
    arm.position.set(s*0.6, 0.4, 0);
    return arm;
  }
  buildBurners(){
    const S = this.G.scene;
    for(let k=0;k<this.burnerX.length;k++){
      const lx = this.burnerX[k];
      const g = new THREE.Group();
      const post = mesh('cyl',[0.14,0.18,1.2,6], mat(W5PAL.brassD)); post.position.y=0.6;
      const bowl = mesh('cyl',[0.4,0.28,0.36,10], mat(W5PAL.brass)); bowl.position.y=1.3;
      const flame = mesh('sph',[0.24,8,6], emat(0x2a2440, 0x2a2440, 0.4)); flame.position.y=1.5;   // dark until fed
      const halo = new THREE.Mesh(geo('sph',0.7,10,8), new THREE.MeshBasicMaterial({color:W5PAL.ember, transparent:true, opacity:0, depthWrite:false})); halo.position.y=1.5;
      g.add(post, bowl, flame, halo); g.position.set(lx, 0, -0.8); S.add(g);
      this.burners.push({x:lx, group:g, flame, halo, lit:false, light:null, attack:this.attacks[k]});
    }
  }
  _feedBurner(b){
    if(b.lit) return;
    b.lit = true; this.litCount++;
    this.stripped[b.attack] = true;
    b.flame.material = emat(0xffffff, W5PAL.ember, 2); b.halo.material.opacity = 0.55;
    b.light = new THREE.PointLight(W5PAL.ember, 30, 12); b.light.position.set(b.x, 2, -0.8); this.G.scene.add(b.light);
    AUDIO.goldPumpkin && AUDIO.goldPumpkin();
    this.G.fx.spawn(new THREE.Vector3(b.x, 1.8, -0.8), W5PAL.ember, 18, {speed:3, gravity:1});
    this.G.camc.shake(0.25, 0.3);
    // sweeten the brew a quarter + push the dark back
    const litFrac = this.litCount/4;
    this.brew.material.color.lerpColors(new THREE.Color(0x1a0e22), new THREE.Color(0xff9ecf), litFrac);
    this.brew.material.emissive.lerpColors(new THREE.Color(W5PAL.shadowP), new THREE.Color(0xffb0d8), litFrac);
    window.UI && UI.updateBossBar(4 - this.litCount);
    window.UI && UI.toast(this.litCount>=4 ? '🔥 The brew is SWEET — Grimm is flushed out!' : `🔥 Ember ${this.litCount}/4 fed — an attack fades, the dark recoils! (${b.attack} stripped)`);
  }

  // ---- attacks (each fixed-clock; stripped ones are skipped) ----
  _fireAttack(){
    const active = this.attacks.filter(a=>!this.stripped[a]);
    if(!active.length) return;
    const a = active[this.atkI % active.length]; this.atkI++;
    const pl = this.G.player;
    if(a==='potion'){
      for(const sx of [-9,-3,3,9]){ if(typeof CrabShell!=='undefined') this.G.ents.add(new CrabShell(this.G, sx, 11, 0, {targetX:sx, targetY:0, flight:1.2})); }
      AUDIO.noise && AUDIO.noise({t:0.2,vol:0.14,fFrom:900,fTo:200});
    } else if(a==='shadow'){
      if(typeof ShadowCopy!=='undefined' && this.shadows.filter(s=>!s.dead).length < 3){ const sx=this.pos.x+(pl&&pl.pos.x>0?-8:8); const s=new ShadowCopy(this.G, sx, 1, 0, {speed:2.6}); this.shadows.push(s); this.G.ents.add(s); }
    } else if(a==='arm'){
      const sx = pl?pl.pos.x:0;
      this.slam = {x: sx, tele:0.85, t:0, done:false};   // shadow-arm slam at your position
      const ring = new THREE.Mesh(geo('circ',2.2,20), new THREE.MeshBasicMaterial({color:W5PAL.shadowP, transparent:true, opacity:0.5, depthWrite:false}));
      ring.rotation.x=-Math.PI/2; ring.position.set(sx,0.06,0); this.G.scene.add(ring); this.slam.tell=ring;   // the TELEGRAPH (target ring during the 0.85s wind-up)
      AUDIO.noise && AUDIO.noise({t:0.25,vol:0.12,fFrom:300,fTo:800});
    } else if(a==='goo'){
      this.wave = {x:-22, dir:1, t:0};   // a goo sweep left→right you JUMP over
      const goo = new THREE.Mesh(geo('box',1.3,1.7,10), new THREE.MeshBasicMaterial({color:W5PAL.shadowP, transparent:true, opacity:0.75}));
      goo.position.set(-22,0.85,0); this.G.scene.add(goo); this.wave.mesh=goo;   // the VISIBLE wave (was an invisible hazard)
      AUDIO.noise && AUDIO.noise({t:0.3,vol:0.12,fFrom:280,fTo:150});
    }
  }

  hurtPlayer(n){ const pl=this.G.player; if(pl && !pl.dead) pl.damage(n, this.pos); }

  defeat(){
    // start the ENDING cutscene (multi-beat dialogue); onBossDefeated fires at the end
    this.dead = true; this.state = 'ending'; this.stateT = 0; this._endStage = 0; this._endT = 0;
    for(const s of this.shadows) if(!s.dead){ s.dead=true; if(s.group) this.G.scene.remove(s.group); }
    for(const b of this.burners) if(b.light) b.light.intensity = 40;
    window.UI && UI.hideBossBar();
    AUDIO.victory && AUDIO.victory();
    // brew goes fully sweet
    this.brew.material.color.set(0xff9ecf); this.brew.material.emissive.set(0xffb0d8);
    this.G.camc.shake(0.4, 0.5);
  }

  update(dt){
    this.t += dt; this.stateT += dt;
    const G = this.G, pl = G.player, p = this.pos;
    // brew simmer + Grimm bob + eye pulse
    this.brew.material.emissiveIntensity = 0.5 + Math.sin(this.t*4)*0.15;
    this.grimm.position.y = damp(this.grimm.position.y, this.flushed ? 1.9 : 2.9, 3, dt) + Math.sin(this.t*2)*0.06;
    this.armL.rotation.z = Math.sin(this.t*1.6)*0.3; this.armR.rotation.z = -Math.sin(this.t*1.6)*0.3;
    // the cosmetic dark recedes as burners light (never past the walls)
    const openX = 24 + this.litCount*3;   // farther out with each ember
    this.darkL.position.x = damp(this.darkL.position.x, -openX, 2, dt);
    this.darkR.position.x = damp(this.darkR.position.x, openX, 2, dt);
    // Grimm tracks the player's side (menace)
    this.grimm.rotation.y = (pl && pl.pos.x < p.x) ? 0.3 : -0.3;

    switch(this.state){
      case 'intro': {
        if(this.stateT>1.0 && !this._introDlg){ this._introDlg=true; G.camc.shake(0.5,0.5);
          window.UI && UI.dialogue('🫥', '"You. The little one they FORGOT to forget. You took back my embers, my districts, my SHADOWS... but you\'ll not take my brew. Come and be a copy, like all the rest."'); }
        if(this.stateT>1.3 && !this._hint){ this._hint=true; window.UI && UI.toast('🔥 The whole night has been about relighting flames — FEED the 4 embers to the 4 burners. He hates a sweet brew.'); }
        if(this.stateT>1.5){ this.state='fight'; this.stateT=0; this.nextAtk=this.t+2.0; }
        break;
      }
      case 'fight': {
        // feed burners on touch
        if(pl && !pl.dead){ for(const b of this.burners){ if(!b.lit && Math.abs(pl.pos.x-b.x)<1.7 && Math.abs(pl.pos.z-(-0.8))<2.4) this._feedBurner(b); } }
        // fire attacks on the fixed clock (fewer as burners light → it always resolves)
        if(this.t >= this.nextAtk){ const active = this.attacks.filter(a=>!this.stripped[a]).length; this.nextAtk += Math.max(1.6, 3.4 - this.litCount*0.4); if(active>0) this._fireAttack(); }
        // resolve the arm-slam telegraph
        if(this.slam){ this.slam.t += dt;
          if(this.slam.tell) this.slam.tell.material.opacity = 0.3 + Math.abs(Math.sin(this.slam.t*12))*0.5;   // pulse the telegraph during wind-up
          if(!this.slam.done && this.slam.t>this.slam.tele){ this.slam.done=true;
            if(this.slam.tell){ G.scene.remove(this.slam.tell); this.slam.tell=null; }
            G.fx.spawn(new THREE.Vector3(this.slam.x, 0.3, 0), W5PAL.shadowP, 20, {speed:5}); G.camc.shake(0.4,0.3); AUDIO.poundHit && AUDIO.poundHit();
            if(pl && !pl.dead && Math.abs(pl.pos.x-this.slam.x)<2.2 && pl.pos.y<2.4) this.hurtPlayer(1);
          }
          if(this.slam.t>this.slam.tele+0.5){ if(this.slam.tell) G.scene.remove(this.slam.tell); this.slam=null; }
        }
        // resolve the goo wave (a VISIBLE floor sweep you JUMP)
        if(this.wave){ this.wave.t += dt; this.wave.x += this.wave.dir*9*dt;
          if(this.wave.mesh) this.wave.mesh.position.x = this.wave.x;
          if(pl && !pl.dead && Math.abs(pl.pos.x-this.wave.x)<1.0 && pl.pos.y<0.9) this.hurtPlayer(1);
          if(Math.abs(this.wave.x)>24){ if(this.wave.mesh) G.scene.remove(this.wave.mesh); this.wave=null; }
        }
        if(this.litCount>=4 && !this.flushed){ this.flushed=true; this.state='flushed'; this.stateT=0; G.camc.shake(0.6,0.5);
          this.grimmMat.emissiveIntensity = 0.2; this.grimmMat.opacity = 1;
          G.fx.spawn(new THREE.Vector3(0,2.2,0), W5PAL.emberL, 30, {speed:6, life:1});
          window.UI && UI.dialogue('🫥', '"...no. NO! The sweetness — it BURNS! What have you— what did you—"'); }
        break;
      }
      case 'flushed': {
        // Grimm sits small on the rim, startled — walk up and INVITE (interact). No more attacks.
        if(this.slam){ if(this.slam.tell) G.scene.remove(this.slam.tell); this.slam=null; }
        if(this.wave){ if(this.wave.mesh) G.scene.remove(this.wave.mesh); this.wave=null; }
        this.eyeL.scale.setScalar(0.7); this.eyeR.scale.setScalar(0.7);
        if(!this._flushHint){ this._flushHint=true; window.UI && UI.toast('👆 Walk up to Grimm and press ANY button (JUMP / SPIN / 💥 / E) — you know what to do. (It was never a fight.)'); }
        // ACCEPT ANY ACTION PRESS as the invite — he's harmless now, and touch has no interact affordance during a
        // boss (the #prompt button is display:none'd every frame in boss areas). This keeps the finale completable on iPhone/iPad.
        if(pl && !pl.dead && Math.abs(pl.pos.x - p.x) < 3.2 && (INPUT.interactEdge || INPUT.jumpEdge || INPUT.attackEdge || INPUT.poundEdge)){
          INPUT.interactEdge=false; INPUT.jumpEdge=false; INPUT.attackEdge=false; INPUT.poundEdge=false; this.defeat();
        }
        break;
      }
      case 'ending': {
        // the wholesome close — a few timed beats, then hand off to the victory flow
        this._endT += dt;
        this.grimm.position.y = damp(this.grimm.position.y, 1.6, 2, dt);
        if(this._endStage===0 && this._endT>0.6){ this._endStage=1; window.UI && UI.dialogue('🧒', '"You were never a monster, Grimm. You were just... never invited. So — come to the festival. There\'s a lantern with your name on it."'); }
        else if(this._endStage===1 && this._endT>3.2){ this._endStage=2; window.UI && UI.dialogue('🫥', '"...a lantern. For ME? ...after everything?" *the shadow softens, warm at the edges* "...Well. I never could resist a good party."'); }
        else if(this._endStage===2 && this._endT>6.2){ this._endStage=3;
          for(const b of this.burners){ this.G.fx.spawn(new THREE.Vector3(b.x,2,-0.8), W5PAL.emberL, 20, {speed:4}); }
          this.G.fx.spawn(new THREE.Vector3(0,3,0), 0xffffff, 40, {speed:7, life:1.2}); this.G.camc.shake(0.5,0.6);
          window.UI && UI.dialogue('🔥', 'The Everflame roars back whole. Grimmwick glows warm to its rooftops — and the Forgotten Guest takes up the night-watch, lantern in hand, at last one of the family. Happy Halloween, Pip. (...is that snow?)'); }
        else if(this._endStage===3 && this._endT>9.5){ this._endStage=4; G.onBossDefeated(); }
        break;
      }
    }
    this.group.position.set(0,0,0);
  }
}

// =============================== ARENA ===============================
function buildBossArena5(G){
  const S = G.scene;
  const x1 = -22, x2 = 22, W = 52, D = 12;
  // throne-room floor (flat, lane z=0; only Grimm's telegraphed hazards bite)
  const floor = mesh('box',[W,1.4,D], mat(W5PAL.stone)); floor.position.set(0,-0.7,0); S.add(floor);
  const tiles = new THREE.Group();
  for(let x=-W/2; x<W/2; x+=1.6){ const t=mesh('box',[1.4,0.1,D], mat((Math.floor(x/1.6)%2)?W5PAL.stoneD:W5PAL.stoneL)); t.position.set(x,0.02,0); tiles.add(t); }
  S.add(bakeGroup(tiles));
  G.world.addBox(0,-1.4,0, W,1.4,D, {});
  // containment walls (learned from boss4 — never let the finale knock you into a void)
  G.world.addBox(-25,-2,0, 2,14,D, {}); G.world.addBox(25,-2,0, 2,14,D, {});

  w5Parallax(S, x1, x2);

  // baked deco: a broken throne, pillars, giant stopped gears, chains, chandeliers
  const deco = new THREE.Group();
  for(const px of [-20,-13,13,20]) deco.add(brokenPillar(px, -4.5, rand(1.2,1.6)));
  { const throne=new THREE.Group(); const seat=mesh('box',[2.4,0.4,1.6], mat(W5PAL.stoneD)); seat.position.set(0,1.4,-4.5);
    const back=mesh('box',[2.4,3.2,0.4], mat(W5PAL.stoneD)); back.position.set(0,3.0,-5.1); crook(back,0.03);
    const spikeL=mesh('cone',[0.3,1.2,5], mat(W5PAL.stoneL)); spikeL.position.set(-1.0,4.8,-5.1);
    const spikeR=spikeL.clone(); spikeR.position.x=1.0; throne.add(seat,back,spikeL,spikeR); deco.add(throne); }
  for(const [gx,gy,gr] of [[-16,6,2.4],[16,6.5,2.8],[0,9,3.2]]){ const cog=cogMesh(gr,0x1c1a28); cog.position.set(gx,gy,-8); deco.add(cog); }
  deco.add(chandelier(-8,6,-3,1.2), chandelier(8,6,-3,1.2));
  // foreground chain silhouettes (z>0)
  for(const cx of [-14,-4,10,18]){ for(let i=0;i<6;i++){ const lk=mesh('tor',[0.12,0.04,4,8], mat(W5PAL.chain)); lk.rotation.x=(i%2)?Math.PI/2:0; lk.position.set(cx, 6.5-i*0.5, 4.4); deco.add(lk); } }
  S.add(bakeGroup(deco));

  // ≤6 real lights: two chandelier glows + a throne up-light (the 4 burners light themselves in-fight)
  for(const [lx,col] of [[-8,W5PAL.ember],[8,W5PAL.ember],[0,W5PAL.shadowP]]){ const l=new THREE.PointLight(col, 20, 16); l.position.set(lx, 5, -3); S.add(l); }

  // boss lifecycle
  G.spawnPoint.set(-16, 1, 0);
  G.player.pos.copy(G.spawnPoint); G.player.vel.set(0,0,0); G.player.captured=false;
  G.world.killY = -12; G.camMinY = -2;
  G.bats = makeBats(S, 5, 30);
  G.amb  = w5Ambience(S, x1, x2);
  G.boss = new GrimmCauldron(G);
}

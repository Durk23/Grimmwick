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
    // burner i strips attacks[i] — weakest first: the natural left-to-right feed keeps the potion
    // barrage (the only area attack) alive until the LAST burner, so the fight climbs, never deflates
    this.attacks = ['goo','arm','shadow','potion'];
    this.stripped = {potion:false, shadow:false, arm:false, goo:false};
    // ---- attack clocks (nextAtk set at intro exit) ----
    this.nextAtk = 0; this.atkI = 0; this.shadows = []; this.slams = []; this.waves = [];
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
      this.burners.push({x:lx, group:g, flame, halo, lit:false, feedT:0, light:null, attack:this.attacks[k]});
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
    window.UI && UI.toast(this.litCount>=4 ? '🔥 The brew is SWEET! Grimm is flushed out!' : `🔥 Ember ${this.litCount}/4 fed: one of Grimm's tricks fizzles out, and the dark shrinks back!`);
  }

  // ---- attacks (each fixed-clock; stripped ones are skipped) ----
  _fireAttack(){
    const active = this.attacks.filter(a=>!this.stripped[a]);
    if(!active.length) return;
    const a = active[this.atkI % active.length]; this.atkI++;
    const pl = this.G.player;
    if(a==='potion'){
      // rain covers the UNLIT burner lanes too — the objective is never a free camp; shrinks to 4 lanes as burners light
      const spots = [-9,-3,3,9, ...this.burners.filter(b=>!b.lit).map(b=>b.x)];
      for(const sx of spots){ if(typeof CrabShell!=='undefined') this.G.ents.add(new CrabShell(this.G, sx, 11, 0, {targetX:sx, targetY:0, flight:1.0})); }
      AUDIO.noise && AUDIO.noise({t:0.2,vol:0.14,fFrom:900,fTo:200});
    } else if(a==='shadow'){
      const alive = this.shadows.filter(s=>!s.dead).length;
      if(typeof ShadowCopy!=='undefined' && alive < 2 + this.litCount){
        const sx=this.pos.x+(pl&&pl.pos.x>0?-8:8);
        const s=new ShadowCopy(this.G, sx, 1, 0, {speed:3.2 + this.litCount*0.4});   // faster with each ember — pressure, still outrunnable (player 7.2)
        this.shadows.push(s); this.G.ents.add(s);
      } else if(active.length > 1){ return this._fireAttack(); }   // capped → the turn falls through to the next attack, never a free tick
    } else if(a==='arm'){
      // slam-CHAIN: from 2 embers, three slams walk toward where you're headed (deterministic — reads your velocity at fire time)
      const sx = pl?pl.pos.x:0;
      const tele = Math.max(0.55, 0.85 - this.litCount*0.1);
      const dir = pl ? (Math.sign(pl.vel.x) || (pl.pos.x >= 0 ? -1 : 1)) : 1;
      const count = this.litCount>=2 ? 3 : 1;
      for(let i=0;i<count;i++){
        const s = {x: Math.max(-21, Math.min(21, sx + dir*3.5*i)), tele, t:-0.35*i, done:false};
        const ring = new THREE.Mesh(geo('circ',2.2,20), new THREE.MeshBasicMaterial({color:W5PAL.shadowP, transparent:true, opacity:0.5, depthWrite:false}));
        ring.rotation.x=-Math.PI/2; ring.position.set(s.x,0.06,0); this.G.scene.add(ring); s.tell=ring;   // the TELEGRAPH ring per slam
        this.slams.push(s);
      }
      AUDIO.noise && AUDIO.noise({t:0.25,vol:0.12,fFrom:300,fTo:800});
    } else if(a==='goo'){
      // sweep speeds up per ember; at 3 embers a second wave answers from the right — a converging pincer, each cleared with a normal jump
      const sp = 9 + this.litCount*2;
      const mk = (x0, dir, delay) => {
        const wv = {x:x0, dir, sp, t:-delay};
        const goo = new THREE.Mesh(geo('box',1.3,1.7,10), new THREE.MeshBasicMaterial({color:W5PAL.shadowP, transparent:true, opacity:0.75}));
        goo.position.set(x0,0.85,0); this.G.scene.add(goo); wv.mesh=goo;
        this.waves.push(wv);
      };
      mk(-22, 1, 0);
      if(this.litCount>=3) mk(22, -1, 0.5);
      AUDIO.noise && AUDIO.noise({t:0.3,vol:0.12,fFrom:280,fTo:150});
    }
  }

  hurtPlayer(n){ const pl=this.G.player; if(pl && !pl.dead) pl.damage(n, this.pos); }

  onPlayerPound(pos){}   // boss contract — player calls this on every landed pound; the cauldron ignores it (pound is even an invite button here)

  _clearShells(){
    const G = this.G;
    for(const e of (G.ents.list||[])){
      if(!e.dead && e.constructor && e.constructor.name==='CrabShell'){
        e.dead = true;
        if(e.group) G.scene.remove(e.group);
        if(e.shadow) G.scene.remove(e.shadow);
      }
    }
  }

  defeat(){
    // THE INVITE LANDS — start the ending cutscene; onBossDefeated fires at its last beat.
    // The speedrun clock stops HERE (the invite press is the finish line) — the tap-through
    // banners after this moment must never count against the recorded time.
    if(this.G.save && !this.G.save.nightDone) this.G.save._finishT = this.G.save.playT||0;
    this.G._bossEndT = this.G.runT||0;   // the boss record also stops at the invite — reading speed is not skill
    this.dead = true; this.state = 'ending'; this.stateT = 0; this._endStage = 0; this._endT = 0;
    this._clearShells();   // a potion volley mid-air at the invite must never bonk Pip during the speech
    for(const s of this.shadows) if(!s.dead){ s.dead=true; if(s.group) this.G.scene.remove(s.group); if(s.shadow) this.G.scene.remove(s.shadow); }
    for(const b of this.burners) if(b.light) b.light.intensity = 40;
    if(this._marker){ this.G.scene.remove(this._marker); this._marker=null; }
    window.UI && UI.hideBossBar();
    window.UI && UI.closeDialogue();   // clear the flushed-state dialogue — the cinematic banners own the stage now
    AUDIO.victory && AUDIO.victory();
    this.G.hitstop = 0.22;   // the world holds its breath
    this.G.fx.spawn(new THREE.Vector3(0,3,0), 0xffffff, 30, {speed:6, life:0.8});
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
    // Grimm tracks the player's side (menace) — until the ending, where he turns to face you instead
    if(this.state!=='ending') this.grimm.rotation.y = (pl && pl.pos.x < p.x) ? 0.3 : -0.3;

    switch(this.state){
      case 'intro': {
        if(this.stateT>1.0 && !this._introDlg){ this._introDlg=true; G.camc.shake(0.5,0.5);
          window.UI && UI.dialogue('🫥', '"You. The little one even I forgot. You took back my embers, my districts, my SHADOWS... but you\'ll not take my brew. Come and be a copy, like all the rest."'); }
        if(this.stateT>1.3 && !this._hint){ this._hint=true; window.UI && UI.toast('🔥 STAND CLOSE to a burner to pour an ember in. The whole night has led to this. He HATES a sweet brew.'); }
        if(this.stateT>1.5){ this.state='fight'; this.stateT=0; this.nextAtk=this.t+1.0; }
        break;
      }
      case 'fight': {
        // feed burners by CHANNELING — stand close and hold your ground under fire; later embers pour slower
        if(pl && !pl.dead){ for(const b of this.burners){ if(b.lit) continue;
          const need = 0.5 + this.litCount*0.35;
          if(Math.abs(pl.pos.x-b.x)<1.7 && Math.abs(pl.pos.z-(-0.8))<2.4){
            b.feedT += dt;
            b.halo.material.opacity = Math.min(0.45, b.feedT/need*0.45);   // the halo fills as the ember pours
            if(b.feedT >= need) this._feedBurner(b);
          } else if(b.feedT){ b.feedT = 0; b.halo.material.opacity = 0; }
        } }
        // the attack clock ACCELERATES with each fed ember — the finale climbs as you win;
        // from 2 embers Grimm fires TWO different attacks per tick (overlapping threats)
        if(this.t >= this.nextAtk){ const active = this.attacks.filter(a=>!this.stripped[a]).length;
          this.nextAtk += [2.6, 2.0, 1.5, 1.1][Math.min(3, this.litCount)];
          if(active>0){ this._fireAttack(); if(this.litCount>=2) this._fireAttack(); } }
        // resolve the arm-slam telegraphs (chain slams carry a start delay via negative t)
        for(let i=this.slams.length-1;i>=0;i--){ const s = this.slams[i]; s.t += dt;
          if(s.tell) s.tell.material.opacity = s.t<0 ? 0.18 : 0.3 + Math.abs(Math.sin(s.t*12))*0.5;
          if(!s.done && s.t>s.tele){ s.done=true;
            if(s.tell){ G.scene.remove(s.tell); s.tell=null; }
            G.fx.spawn(new THREE.Vector3(s.x, 0.3, 0), W5PAL.shadowP, 20, {speed:5}); G.camc.shake(0.4,0.3); AUDIO.poundHit && AUDIO.poundHit();
            if(pl && !pl.dead && Math.abs(pl.pos.x-s.x)<2.2 && pl.pos.y<2.4) this.hurtPlayer(1);
          }
          if(s.t>s.tele+0.5){ if(s.tell) G.scene.remove(s.tell); this.slams.splice(i,1); }
        }
        // resolve the goo waves (VISIBLE floor sweeps you JUMP; the pincer's second wave waits out its delay at the wall)
        for(let i=this.waves.length-1;i>=0;i--){ const wv = this.waves[i]; wv.t += dt;
          if(wv.t >= 0){
            wv.x += wv.dir*wv.sp*dt;
            if(wv.mesh) wv.mesh.position.x = wv.x;
            if(pl && !pl.dead && Math.abs(pl.pos.x-wv.x)<1.0 && pl.pos.y<0.9) this.hurtPlayer(1);
          }
          if(wv.t > 0 && Math.abs(wv.x)>24){ if(wv.mesh) G.scene.remove(wv.mesh); this.waves.splice(i,1); }
        }
        if(this.litCount>=4 && !this.flushed){ this.flushed=true; this.state='flushed'; this.stateT=0; G.camc.shake(0.6,0.5);
          this.grimmMat.emissiveIntensity = 0.2; this.grimmMat.opacity = 1;
          G.fx.spawn(new THREE.Vector3(0,2.2,0), W5PAL.emberL, 30, {speed:6, life:1});
          window.UI && UI.dialogue('🫥', '"...no. NO! The sweetness... it BURNS! What have you... what did you..."'); }
        break;
      }
      case 'flushed': {
        // Grimm sits small on the rim, startled — walk up and INVITE (interact). No more attacks.
        for(const s of this.slams){ if(s.tell) G.scene.remove(s.tell); } this.slams.length = 0;
        for(const wv of this.waves){ if(wv.mesh) G.scene.remove(wv.mesh); } this.waves.length = 0;
        this._clearShells();   // shells launched moments before the flush keep falling — sweep them every frame here
        this.eyeL.scale.setScalar(0.7); this.eyeR.scale.setScalar(0.7);
        if(!this._flushHint){ this._flushHint=true;
          window.UI && UI.finaleBanner('🫥 GRIMM IS FLUSHED OUT: walk up & press ANY button', 3600);
          window.UI && UI.toast('👆 It was never a fight. Walk up to Grimm and press ANY button: jump, spin, anything.');
          // an unmissable bouncing golden marker over his head — the "come here" every platformer kid knows
          const mk = new THREE.Group();
          const arrow = new THREE.Mesh(geo('cone',0.34,0.7,6), new THREE.MeshLambertMaterial({color:0xffd23f, emissive:0xffb020, emissiveIntensity:1}));
          arrow.rotation.x = Math.PI; mk.add(arrow);
          const mring = new THREE.Mesh(geo('tor',0.5,0.06,6,18), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0.8}));
          mk.add(mring);
          mk.position.set(0, 5.4, 0); G.scene.add(mk);
          this._marker = mk;
        }
        if(this._marker){ this._marker.position.y = 5.2 + Math.abs(Math.sin(this.t*3.2))*0.5; this._marker.rotation.y = this.t*2; this._marker.children[1].scale.setScalar(1+Math.sin(this.t*6)*0.2); }
        // ACCEPT ANY ACTION PRESS as the invite — he's harmless now, and touch has no interact affordance during a
        // boss (the #prompt button is display:none'd every frame in boss areas). This keeps the finale completable on iPhone/iPad.
        if(pl && !pl.dead && Math.abs(pl.pos.x - p.x) < 3.2 && (INPUT.interactEdge || INPUT.jumpEdge || INPUT.attackEdge || INPUT.poundEdge)){
          INPUT.interactEdge=false; INPUT.jumpEdge=false; INPUT.attackEdge=false; INPUT.poundEdge=false; this.defeat();
        }
        break;
      }
      case 'ending': {
        // the wholesome close — cinematic beats with BANNERS (small dialogue read as "did I even win?")
        this._endT += dt;
        this.grimm.position.y = damp(this.grimm.position.y, 1.6, 2, dt);
        this.grimm.rotation.y = damp(this.grimm.rotation.y, 0, 3, dt);   // he turns to face you
        // Grimm's TRANSFORMATION — shadow melts to warmth over ~1.6s once the lantern is offered
        if(this._warm !== undefined && this._warm < 1){
          this._warm = Math.min(1, this._warm + dt/1.6);
          this.grimmMat.color.lerpColors(new THREE.Color(0x1a1428), new THREE.Color(0x5a5578), this._warm);
          this.grimmMat.emissive.lerpColors(new THREE.Color(W5PAL.shadowP), new THREE.Color(0xff9a50), this._warm);
          this.grimmMat.emissiveIntensity = 0.6 - this._warm*0.3;
          this.grimmMat.opacity = 0.9 + this._warm*0.1;
          const es = 0.7 + this._warm*0.45;                            // eyes go from wary slits to big warm rounds
          this.eyeL.scale.setScalar(es); this.eyeR.scale.setScalar(es);
        }
        if(this._lantern){ this._lantern.scale.setScalar(Math.min(1, this._lantern.scale.x + dt*2)); this._lantern.rotation.y += dt*0.8;
          this._lantern.children[1].material.emissiveIntensity = 1 + Math.sin(this.t*6)*0.3; }
        if(this._granny){ this._granny.position.y = 0.12 + Math.sin(this.t*1.6)*0.08; }
        // the great flame column breathes; fireworks pop; snow drifts
        if(this._flame){ const s = 1 + Math.sin(this.t*7)*0.12; this._flame.scale.set(s,1+Math.sin(this.t*5.2)*0.18,s);
          this._flameIn.scale.set(1+Math.sin(this.t*9+1)*0.15, 1+Math.sin(this.t*6.4+2)*0.2, 1); }
        if(this._party){
          this._fireworkT -= dt;
          if(this._fireworkT <= 0){ this._fireworkT = 0.55;
            const fx = rand(-16,16), fy = rand(5,9.5);
            G.fx.spawn(new THREE.Vector3(fx,fy,rand(-2,1)), pick([0xff5ea8,0x63e6e2,0xffd23f,0xb37dff,0xff8c2e]), 22, {speed:6, life:1.1, gravity:2});
            AUDIO.tone && AUDIO.tone({f:rand(700,1100), f2:rand(1300,1900), type:'sine', t:0.14, vol:0.06});
          }
          if(this._snow) for(const fl of this._snow){ const u=fl.userData; const f=((this.t*u.sp+u.ph)%1); fl.position.set(u.x0+Math.sin(this.t+u.ph)*0.8, 11*(1-f), u.z0); }
        }
        // TAP-TO-CONTINUE (owner call): each line STAYS until the player taps/presses — kids read at
        // their own pace while the fireworks and snow keep falling behind. Auto-advances after 14s so
        // a set-down phone still reaches the end. (_stageT = per-stage clock; 0.9s guard eats mash-taps.)
        // Speech uses the game's own dialogue card (finaleLine); big EVENTS use the glow banner.
        this._stageT = (this._stageT||0) + dt;
        const adv = () => {
          if(this._stageT > 0.9 && INPUT.anyEdge){ INPUT.anyEdge=false; this._stageT=0; AUDIO.ui && AUDIO.ui(); return true; }
          if(this._stageT > 14){ this._stageT=0; return true; }
          return false;
        };
        if(this._endStage===0 && this._endT>0.5){ this._endStage=1; this._stageT=0;
          window.UI && UI.finaleLine('🫥', '“...me? You fought through my whole night... just to ask ME something?”'); }
        else if(this._endStage===1 && adv()){ this._endStage=2;
          window.UI && UI.finaleLine('🧒', '“Come to the festival, Grimm. There\'s a lantern with your name on it.”');
          // the lantern appears in his hand — the night-watchman is born
          const lan = new THREE.Group();
          const cage = mesh('box',[0.34,0.42,0.34], mat(0x241c38));
          const glow = new THREE.Mesh(geo('sph',0.14,8,6), new THREE.MeshLambertMaterial({color:0xffe9b0, emissive:0xffc050, emissiveIntensity:1}));
          lan.add(cage, glow);
          lan.position.set(1.15, 2.6, 0.4); lan.scale.setScalar(0.01);
          this.group.add(lan); this._lantern = lan;
          AUDIO.heart && AUDIO.heart(); }
        else if(this._endStage===2 && adv()){ this._endStage=21;
          window.UI && UI.finaleLine('🫥', '“The spell of forgetting should have erased me from every heart in town. How can you still SEE me?”'); }
        else if(this._endStage===21 && adv()){ this._endStage=22;
          window.UI && UI.finaleLine('🧒', '“The whole town is named after you. GRIMMWICK never forgot.”'); }
        else if(this._endStage===22 && adv()){ this._endStage=25;
          // GRIMM'S ANSWER — the beat the whole game builds to. He warms from shadow to lamplight AS he says it.
          window.UI && UI.finaleLine('🫥', '“...yes, little one. I would love to come home.”');
          this._warm = 0;                                             // the transformation begins with the yes
          AUDIO.heart && AUDIO.heart(); }
        else if(this._endStage===25 && adv()){ this._endStage=3;
          window.UI && UI.closeDialogue();
          window.UI && UI.finaleBanner('✨ THE SPELL OF FORGETTING SHATTERS ✨<br><span style="font-size:0.6em">A hundred years of memories come flooding home.</span>', 15000);
          // memory motes — a hundred years of memories drifting back into the world
          for(let i=0;i<44;i++) G.fx.spawn(new THREE.Vector3(rand(-20,20), rand(1,8), rand(-2,2)), pick([0xfff2c4,0xffd98a,0xb37dff,0x63e6e2]), 1, {speed:1.1, life:1.7, gravity:-0.35, size:0.7});
          // GRANNY WICK appears behind Pip — she promised she'd be here for this
          const gr = new THREE.Group();
          const wm = new THREE.MeshLambertMaterial({color:0xf2f0ff, emissive:0xd8d4f0, emissiveIntensity:0.5, transparent:true, opacity:0.88});
          const gb = new THREE.Mesh(geo('cone',0.5,1.1,9), wm); gb.position.y=0.55; gr.add(gb);
          const gh = new THREE.Mesh(geo('sph',0.34,10,8), wm); gh.position.y=1.25; gr.add(gh);
          const bun = new THREE.Mesh(geo('sph',0.14,7,6), wm); bun.position.set(0,1.56,-0.12); gr.add(bun);
          const ge1 = mesh('sph',[0.05,5,5], mat(0x14101f)); ge1.position.set(-0.1,1.28,0.3); gr.add(ge1);
          const ge2 = ge1.clone(); ge2.position.x=0.1; gr.add(ge2);
          const sp1 = mesh('tor',[0.09,0.02,5,10], mat(0xd8b46a)); sp1.position.set(-0.1,1.28,0.33); gr.add(sp1);
          const sp2 = sp1.clone(); sp2.position.x=0.1; gr.add(sp2);
          gr.position.set((pl?pl.pos.x:0)-2.4, 0.12, -0.7);
          G.scene.add(gr); this._granny = gr;
          G.fx.spawn(gr.position.clone().setY(1.2), 0xf2f0ff, 14, {speed:2, life:0.7});
          // THE RELIGHT — a roaring flame column erupts from the cauldron
          this._flame = new THREE.Mesh(geo('cone',1.8,4.6,10), new THREE.MeshLambertMaterial({color:0xff7020, emissive:0xff6a1a, emissiveIntensity:0.9, transparent:true, opacity:0.94}));
          this._flame.position.set(0,5.0,0); this.group.add(this._flame);
          this._flameIn = new THREE.Mesh(geo('cone',0.7,2.6,8), new THREE.MeshLambertMaterial({color:0xffd98a, emissive:0xffb050, emissiveIntensity:1.1, transparent:true, opacity:0.95}));
          this._flameIn.position.set(0,4.3,0); this.group.add(this._flameIn);
          // trade the two chandelier lights for the Everflame's own big warm light (stays ≤6 total)
          if(this.arenaLights) for(const l of this.arenaLights) G.scene.remove(l);
          const big = new THREE.PointLight(0xffa050, 95, 36); big.position.set(0,5.5,2); G.scene.add(big);
          for(const b of this.burners){ this.G.fx.spawn(new THREE.Vector3(b.x,2,-0.8), W5PAL.emberL, 20, {speed:4}); }
          G.fx.spawn(new THREE.Vector3(0,4,0), 0xffffff, 50, {speed:8, life:1.3});
          G.camc.shake(0.6,0.7);
          AUDIO.goldPumpkin && AUDIO.goldPumpkin();
          // candy fireworks + the first snow of Winterfest
          this._party = true; this._fireworkT = 0.2;
          this._snow = [];
          for(let i=0;i<26;i++){
            const fl = new THREE.Mesh(geo('circ',0.09,5), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.85, side:THREE.DoubleSide}));
            fl.userData = {x0:rand(-20,20), z0:rand(-2,3), sp:rand(0.14,0.3), ph:rand(9)};
            G.scene.add(fl); this._snow.push(fl);
          } }
        else if(this._endStage===3 && adv()){ this._endStage=4;
          // THE WALK HOME — the ending is PLAYED, not read: a light gate opens, Grimm follows Pip through it
          window.UI && UI.finaleBanner('🏮 Walk Grimm home ➜<br><span style="font-size:0.6em">The whole town remembers him now.</span>', 60000);
          const gate = new THREE.Group();
          const postM = emat(0xffd98a, 0xffb02e, 0.7);
          const pgL = mesh('box',[0.4,4.4,0.5], postM); pgL.position.set(-1.3,2.2,0); gate.add(pgL);
          const pgR = pgL.clone(); pgR.position.x=1.3; gate.add(pgR);
          const top2 = mesh('box',[3.4,0.5,0.5], postM); top2.position.y=4.55; gate.add(top2);
          this._gatePortal = new THREE.Mesh(geo('box',2.2,4.0,0.1), new THREE.MeshBasicMaterial({color:0xffe9b0, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false}));
          this._gatePortal.position.y=2.1; gate.add(this._gatePortal);
          gate.position.set(20.6,0,0); G.scene.add(gate); this._gate = gate;
          // the small night-watchman steps out of the great shadow, lantern in hand
          this.grimm.visible = false;
          G.fx.spawn(new THREE.Vector3(this.pos.x, 2.5, 0), 0xff9a50, 24, {speed:4, life:0.8});
          const wk = new THREE.Group();
          const gm2 = new THREE.MeshLambertMaterial({color:0x5a5578, emissive:0xff9a50, emissiveIntensity:0.35});
          const robe2 = new THREE.Mesh(geo('cone',0.62,1.3,9), gm2); robe2.position.y=0.55; wk.add(robe2);
          const hood2 = new THREE.Mesh(geo('sph',0.52,11,9), gm2); hood2.scale.set(1,1.25,0.9); hood2.position.y=1.05; wk.add(hood2);
          const cowl2 = new THREE.Mesh(geo('cone',0.56,0.9,9), gm2); cowl2.position.y=1.5; wk.add(cowl2);
          const weL = mesh('sph',[0.09,7,6], emat(0xffb46a,0xff9a3a,1)); weL.position.set(-0.17,1.12,0.42); wk.add(weL);
          const weR = weL.clone(); weR.position.x=0.17; wk.add(weR);
          const wlan = new THREE.Group();
          const wc = mesh('box',[0.2,0.26,0.2], mat(0x241c38));
          const wg = mesh('sph',[0.09,7,6], emat(0xffe9b0,0xffc050,1));
          wlan.add(wc,wg); wlan.position.set(0.62,0.95,0.2); wk.add(wlan);
          wk.position.set(this.pos.x, 0, 0);
          G.scene.add(wk); this._walker = wk; this._walkT = 0;
          this._walkArmed = !(pl && pl.pos.x > 17); }   // already at the gate? the walk arms once they step back toward Grimm
        else if(this._endStage===4){
          this._walkT = (this._walkT||0) + dt;
          if(!this._walkArmed && pl && pl.pos.x < 17) this._walkArmed = true;
          if(this._gatePortal) this._gatePortal.material.opacity = 0.3 + Math.sin(this.t*3.2)*0.12;
          if(this._walker && pl){
            const tx = Math.min(pl.pos.x - 1.7, 19.6);
            this._walker.position.x = damp(this._walker.position.x, tx, 2.2, dt);
            this._walker.position.y = Math.abs(Math.sin(this.t*5))*0.06;
          }
          // through the gate (or a set-down phone after 45s) → the festival; the walk beat itself can't be skipped
          if((this._walkArmed && pl && pl.pos.x > 19.4) || this._walkT > 45){
            this._endStage = 5;
            window.UI && UI.finaleBanner('🎆 GRIMMWICK IS SAVED! HAPPY HALLOWEEN!', 3200);
            window.UI && UI.fade(true, 700);
            AUDIO.portal && AUDIO.portal();
            setTimeout(()=>{ if(G.boss===this && G.area==='boss5') G.onBossDefeated(); }, 800);   // a restart during the fade must not double-complete
          } }
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

  // ≤6 real lights AT PEAK: two chandelier glows + the 4 in-fight burner lights = 6 (the throne up-light was the 7th — cut)
  const arenaLights = [];
  for(const [lx,col] of [[-8,W5PAL.ember],[8,W5PAL.ember]]){ const l=new THREE.PointLight(col, 20, 16); l.position.set(lx, 5, -3); S.add(l); arenaLights.push(l); }

  // boss lifecycle (switchArea builds the fresh Player AFTER this and spawns it at spawnPoint)
  G.spawnPoint.set(-16, 1, 0);
  G.world.killY = -12; G.camMinY = -2;
  G.bats = makeBats(S, 5, 30);
  G.amb  = w5Ambience(S, x1, x2);
  G.boss = new GrimmCauldron(G);
  G.boss.arenaLights = arenaLights;   // the ending trades these for the Everflame's own light (budget stays ≤6)
}

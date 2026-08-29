// ============ BOSS 3 — Broomhilda the Broom Witch (Witchwood) ============
// District 3 guardian. An AERIAL, always-mobile boss: she rides her broom and NEVER LANDS — she weaves
// high over a witch-forest clearing, swooping DIVE-BOMBS, lobbing POTIONS that leave goo puddles, and
// raising THORN WALLS to herd you around. Her dives pass through and she's out of reach up high, so normal
// swings/stomps do nothing to her in the air — the SECRET is the only real opening (harder than boss 2).
//
// THE SECRET TAKEDOWN (three-layer boss rule):
//   * BRUTE PATH — survive the aerial loop; you cannot hit her while she flies.
//   * SECRET — every so often she drops to a LOW HOVER to cast a big spell. In that window her broom's
//     BRISTLES SPARKLE (the whole tell). SPIN-ATTACK the sparkling bristles TWICE and the broom BUCKS her
//     off — she crashes to the ground in a long dizzy STUN. THEN you hit her (stomp / spin / 💥) for one
//     real hit. 3 hits = defeat. (Two-step, like Mossgrave's tennis→rune.)
//   * IN-WORLD HINT — the bristles visibly sparkle; a sign in the arena reads "A BROOM'S PRIDE IS ITS
//     BRISTLES"; a toast surfaces the same line; and the cauldron fumes make her SNEEZE mid-cast (a bonus
//     dodge/strike cue). Nothing is spelled out on a UI element.
//
// FAIRNESS / DETERMINISM: every attack is telegraphed (rear-back + ground warning strip for dives, growing
// target rings for potions, a rising rumble for thorns). The floor is SAFE — the only hazards are her own
// telegraphed goo/thorns, always with generous safe lanes. Her whole pattern runs off FIXED clocks and
// FIXED positions (nextAction pattern, fixed cast x, fixed potion/thorn spots, hover weave = f(this.t)) —
// zero Math.random on the critical path, so the fight replays IDENTICALLY every attempt (the speedrun
// covenant). rand() (seeded per area in switchArea) is COSMETIC-only jitter (sparkle motes, thorn cones).
//
// ENGINE CONTRACT (mirrors 10_boss1.js / 10b_boss2.js exactly where main cares): she is the G.boss
// singleton with update(dt) (main calls it with dt only — read this.G, never a passed arg); she is NOT an
// ents-list entity, so — like boss 1's head-stomp and boss 2's rune-smash — she SELF-DETECTS the player's
// spin (pl.attackT), stomp (pl.vel.y<0 over her), and pound (G.boss.onPlayerPound(pos) from player.js).
// Boss bar via UI.showBossBar/updateBossBar/hideBossBar; defeat calls G.onBossDefeated() (the engine wires
// the w3 rewards + the BROOMSTICK mount reward separately — this file only calls the hook). buildBossArena3
// sets G.spawnPoint / G.world / G.bats / G.amb / G.lightPools + G.boss; it does NOT set mode/camera
// (main's switchArea snaps the boss3 side-camera).

class Broomhilda {
  constructor(G){
    this.G = G;
    this.maxHp = 3; this.hp = 3;              // 3 hits to defeat (mirrors the King / Mossgrave)
    this.dead = false;
    this.pos = new THREE.Vector3(22, 6.5, 0); // starts high, off to the right — sweeps in on the intro
    this.hoverY = 5.2;                        // cruising altitude (out of reach)
    this.lowY   = 1.6;                        // low-cast altitude — bristles become spinnable
    this.diveLowY = 1.1;                      // the grazing bottom of a dive-bomb
    this.state = 'intro'; this.stateT = 0; this.t = 0;
    this.phase = 1;
    this.faceDir = -1;                        // -1 faces left (toward spawn), +1 right
    // ---- deterministic sequencing ----
    this.seq = 0; this._castIdx = 0; this._thornIdx = 0; this._volleyIdx = 0;
    this._castX = -6;
    // ---- the bristle secret ----
    this.bristleOpen = false;                 // true only during the low-hover cast window
    this.bristleHits = 0; this._swingLatched = false;
    this.bristleR = 2.2; this.bristleYR = 1.7;
    // ---- grounded-stun hit window ----
    this.vulnerable = false; this.hitDone = false; this.groundR = 2.4;
    // ---- live hazards she spawns (managed inline arrays; each frees its own collider) ----
    this.potions = []; this.puddles = []; this.thorns = []; this.diveWarn = null;
    // ---- one-shot flags ----
    this._introDlg = false; this._castHint = false; this._hint = false;
    this._sneezed = false; this._enrShot = false; this._farewell = false;
    this._diveInit = false; this._released = false;
    this.buildRig();
    this.shadow = blobShadow(2.2);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('Broomhilda the Broom Witch', this.hp, this.maxHp); }
    AUDIO.bossRoar();
  }

  buildRig(){
    this.group = new THREE.Group();
    this.body = new THREE.Group();

    // ---- broom (flips via rotation.y for facing; bristles trail at the local -x end) ----
    this.broom = new THREE.Group();
    const wood = emat(0x7a5636, 0x3a2410, 0.35);
    const handle = mesh('cyl',[0.06,0.08,1.9,6], wood); handle.rotation.z = Math.PI/2; handle.position.set(0.2,0,0);
    const knob   = mesh('sph',[0.1,7,6], wood); knob.position.set(1.15,0,0);
    const bindM  = emat(0xb37dff, 0x8a5fd0, 0.55);
    const binding = mesh('cyl',[0.13,0.13,0.18,8], bindM); binding.rotation.z = Math.PI/2; binding.position.set(-0.55,0,0);
    // bristles — OWN material instance so the SPARKLE emissive is real (emat()/mat() are cached & shared)
    this.bristleMat = new THREE.MeshLambertMaterial({color:0xe0b84a, emissive:0xb8902a, emissiveIntensity:0.35});
    this.bristles = new THREE.Group();
    for(let i=0;i<12;i++){
      const a = (i/11 - 0.5);
      const b = mesh('cyl',[0.02,0.06,0.66,4], this.bristleMat);
      b.position.set(-0.95 - Math.abs(a)*0.08, a*0.34, 0);
      b.rotation.z = 1.4 + a*0.4;
      this.bristles.add(b);
    }
    this.broom.add(handle, knob, binding, this.bristles);

    // ---- witch (kept facing the camera; never mirrored, so her face always reads) ----
    this.witch = new THREE.Group();
    const robe = emat(0x5a3a9a, 0x2e1a5a, 0.4), robeD = mat(0x3a2568), skin = emat(0x7cc46a, 0x3f7a34, 0.4);
    const gown = mesh('cone',[0.5,1.25,10], robe); gown.position.y = 0.75;
    const sash = mesh('cyl',[0.42,0.5,0.14,10], robeD); sash.position.y = 0.5;
    const head = mesh('sph',[0.34,11,9], skin); head.position.y = 1.42; head.scale.set(1,1.05,0.98);
    const nose = mesh('cone',[0.1,0.42,6], skin); nose.rotation.x = Math.PI/2 + 0.5; nose.position.set(0,1.4,0.34);
    const wart = mesh('sph',[0.05,6,5], mat(0x4f7a34)); wart.position.set(0.05,1.32,0.5);
    const eM = emat(0xffe08a, 0xffb02e, 1);
    const eL = mesh('sph',[0.06,7,6], eM); eL.position.set(-0.14,1.5,0.28);
    const eR = eL.clone(); eR.position.x = 0.14;
    const mouth = mesh('box',[0.2,0.07,0.05], mat(0x2a1420)); mouth.position.set(0,1.28,0.3);
    const tooth = mesh('box',[0.05,0.07,0.04], mat(0xf4f4e0)); tooth.position.set(-0.03,1.31,0.31);
    const hairM = mat(0x9a92a8);
    for(let i=0;i<5;i++){
      const a = (i/4 - 0.5)*1.3;
      const h = mesh('cyl',[0.03,0.02,rand(0.4,0.7),4], hairM);
      h.position.set(Math.sin(a)*0.32, 1.28 + Math.cos(a)*0.05, -0.05 + Math.cos(a)*0.15);
      h.rotation.z = a; this.witch.add(h);
    }
    const hatM = mat(0x241a3d);
    const brim = mesh('cyl',[0.55,0.55,0.05,14], hatM); brim.position.y = 1.66;
    const cone = mesh('cone',[0.32,0.9,10], hatM); cone.position.y = 2.16; cone.rotation.z = 0.16; crook(cone,0.05);
    const band = mesh('cyl',[0.33,0.33,0.12,12], bindM); band.position.y = 1.78;
    const armL = mesh('cyl',[0.07,0.09,0.6,6], robe); armL.rotation.z = 0.9; armL.position.set(-0.34,0.9,0.05);
    const handL = mesh('sph',[0.1,7,6], skin); handL.position.set(-0.58,0.62,0.08);
    const armR = mesh('cyl',[0.07,0.09,0.55,6], robe); armR.rotation.z = -1.1; armR.position.set(0.36,0.92,0.05);
    const handR = mesh('sph',[0.1,7,6], skin); handR.position.set(0.6,0.66,0.08);
    this.witch.add(gown, sash, head, nose, wart, eL, eR, mouth, tooth, brim, cone, band, armL, handL, armR, handR);
    this.witch.position.y = 0.15;

    this.body.add(this.broom, this.witch);
    this.group.add(this.body);
    this.group.position.copy(this.pos);

    // dizzy stars (hidden until she's bucked to the ground)
    this.stars = new THREE.Group();
    for(let i=0;i<3;i++){ const st = mesh('sph',[0.16,6,5], emat(0xffe66e,0xffe66e,1)); this.stars.add(st); }
    this.stars.visible = false; this.stars.position.y = 2.4;
    this.group.add(this.stars);
  }

  // world position of the sparkling bristle hit-zone (bristles trail behind the broom by facing)
  bristleWorld(){ return { x: this.pos.x - this.faceDir*0.95, y: this.pos.y + 0.2, z: this.pos.z }; }

  hurtPlayer(n, from){ const pl = this.G.player; if(pl) pl.damage(n, from||this.pos); }

  // ---------- the secret: spin the bristles twice ----------
  bristleHit(){
    if(this.dead || !this.bristleOpen) return;
    this.bristleHits++;
    AUDIO.stomp(); AUDIO.bounce();
    this.G.hitstop = 0.05; this.G.camc.shake(0.2, 0.25);
    const b = this.bristleWorld();
    this.G.fx.spawn(new THREE.Vector3(b.x, b.y, 0), 0xffe08a, 16, {speed:4});
    window.UI && UI.toast(this.bristleHits >= 2 ? '🧹💥 The broom BUCKS her off!' : '✨ SWAT! SPIN the bristles once more!');
    if(this.bristleHits >= 2) this.buckOff();
  }
  buckOff(){
    this.bristleOpen = false;
    this.bristleHits = 0;   // swats persist ACROSS cast windows (owner tuning) — reset only when a buck-off cashes them in
    this.state = 'bucked'; this.stateT = 0;
    AUDIO.bossRoar(); this.G.camc.shake(0.5, 0.5);
  }

  // ---------- the grounded-stun hit ----------
  onPlayerPound(pos){
    // player ground-pound landing routes here (player.js) — a pound on the dizzy witch counts
    if(this.state!=='grounded' || this.hitDone || !this.vulnerable || this.dead) return;
    if(Math.hypot(pos.x - this.pos.x, pos.z - this.pos.z) < this.groundR + 0.4) this.hitBoss('pound');
  }
  hitBoss(kind){
    if(this.dead || this.hitDone || !this.vulnerable) return;
    this.hitDone = true; this.hp--;
    AUDIO.bossHit(); this.G.hitstop = 0.1; this.G.camc.shake(0.55, 0.45);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+1.5, 0), 0xb37dff, 24, {speed:6});
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+1.5, 0), 0xffffff, 12, {speed:4});
    window.UI && UI.updateBossBar(this.hp);
    window.UI && UI.toast(this.hp>0 ? ['', '"My BRISTLES! You horrid little TOAD!"', '"Not my broom... NOT MY BROOM!"'][this.hp] : '');
    if(this.hp<=0){ this.defeat(); return; }
    this.phase = this.maxHp - this.hp + 1;
    this.vulnerable = false; this.stars.visible = false;
    this.state = 'enrage'; this.stateT = 0; this._enrShot = false;
  }

  defeat(){
    this.dead = true; this.state = 'defeat'; this.stateT = 0;
    this.vulnerable = false; this.stars.visible = false; this.bristleOpen = false;
    AUDIO.victory();
    window.UI && UI.hideBossBar();
    // clean up every live hazard + collider she left behind
    for(const pd of this.puddles) this._freeCol(pd.col);
    for(const th of this.thorns) if(th.col) this._freeCol(th.col);
    for(const s of this.potions) this.G.scene.remove(s.mesh, s.ring);
    for(const pd of this.puddles) this.G.scene.remove(pd.group);
    for(const th of this.thorns) this.G.scene.remove(th.group);
    this.potions.length = this.puddles.length = this.thorns.length = 0;
    this._clearDiveWarn();
    const p = this.pos;
    for(let i=0;i<4;i++){
      setTimeout(()=>{ if(this.G.scene) this.G.fx.spawn(new THREE.Vector3(p.x+rand(-2,2), p.y+rand(1,4), p.z+rand(-2,2)), pick([0xb06bff,0x7dff9e,0xffffff]), 16, {speed:5}); }, i*280);
    }
    candyBurst(this.G, new THREE.Vector3(p.x, p.y+1.5, p.z), 24);
    this.G.onBossDefeated();
  }

  // ---------- deterministic attack picker ----------
  nextAction(){
    // lowcast (the ONLY damage window) recurs often so a player always gets openings; denser dives/potions
    // between them as phases rise. Fixed pattern → deterministic.
    const pat = this.phase>=3 ? ['dive','potion','dive','lowcast','thorns','potion','dive','lowcast']
              : this.phase>=2 ? ['dive','potion','lowcast','thorns','dive','lowcast','potion','lowcast']
              :                 ['dive','lowcast','potion','lowcast','thorns','lowcast'];
    const a = pat[this.seq % pat.length]; this.seq++;
    if(a==='lowcast'){ this._castX = [-6, 8, 0, -12][this._castIdx % 4]; this._castIdx++; }
    return a;
  }

  // ---------- attacks ----------
  spawnPotionVolley(n){
    const spots = [-16, -9, -2, 5, 13];                 // fixed landing lanes with generous gaps between
    AUDIO.tone && AUDIO.tone({f:520, f2:760, type:'sine', t:0.2, vol:0.1});
    for(let i=0;i<n;i++){
      const tx = spots[(this._volleyIdx + i*2) % spots.length];
      // TELEGRAPH — a growing target ring on the ground where the potion will land (~0.7s+ ahead)
      const ring = new THREE.Mesh(geo('tor',1.2,0.12,6,20), new THREE.MeshBasicMaterial({color:0xb06bff, transparent:true, opacity:0}));
      ring.rotation.x = Math.PI/2; ring.position.set(tx, 0.12, 0); ring.scale.setScalar(0.4);
      this.G.scene.add(ring);
      const potion = mesh('sph',[0.26,8,7], emat(0xb06bff, 0xd8a0ff, 0.8)); potion.position.set(this.pos.x, this.pos.y+0.3, 0);
      this.G.scene.add(potion);
      const T = 1.0, g = 22, x0 = this.pos.x, y0 = this.pos.y+0.3, yL = 0.3;
      const vy = (yL - y0 + 0.5*g*T*T)/T, vx = (tx - x0)/T;
      this.potions.push({mesh:potion, ring, x0, y0, vx, vy, g, t:0, T, tx});
    }
    this._volleyIdx++;
  }
  spawnGoo(x){
    const w = 2.4;
    const disc = new THREE.Mesh(geo('cyl', w*0.5, w*0.5, 0.1, 16), new THREE.MeshBasicMaterial({color:0x7dff9e, transparent:true, opacity:0.55}));
    disc.position.set(x, 0.06, 0);
    const g = new THREE.Group(); g.add(disc);
    // a couple of bubbling blobs so the puddle reads as caustic brew, not decoration
    for(let i=0;i<3;i++){ const b = mesh('sph',[rand(0.1,0.18),6,5], emat(0xb06bff,0x7dff9e,0.8)); b.position.set(x+rand(-0.9,0.9), 0.14, rand(-1.0,1.0)); g.add(b); }
    this.G.scene.add(g);
    const col = this.G.world.addBox(x, -0.05, 0, w, 0.4, 3.0, {type:'hazard', damage:1});
    this.puddles.push({group:g, disc, col, t:0, life:2.8});   // goo clears faster — the floor stays runnable
    this.G.fx.spawn(new THREE.Vector3(x, 0.3, 0), 0xb06bff, 12, {speed:3});
    AUDIO.noise && AUDIO.noise({t:0.2, vol:0.12, fFrom:900, fTo:200});
  }
  spawnThorns(){
    const pairs = [[-11,5],[-4,11],[-16,2],[3,13]];     // fixed wall pairs, always a safe lane between them
    const [ax,bx] = pairs[this._thornIdx % pairs.length]; this._thornIdx++;
    this._raiseThorn(ax); this._raiseThorn(bx);
    this.G.camc.shake(0.3, 0.3);
    AUDIO.noise && AUDIO.noise({t:0.4, vol:0.14, fFrom:400, fTo:120});
  }
  _raiseThorn(x){
    const w = 2.0, H = 1.6;
    const g = new THREE.Group();
    for(let i=0;i<7;i++){
      const th = mesh('cone',[0.16, rand(0.9,1.5), 5], emat(0x7a3fbf, 0x5b2fa0, 0.5));
      th.position.set(x - w/2 + rand(0,w), 0.4, rand(-1.4,1.4)); th.rotation.z = rand(-0.25,0.25);
      g.add(th);
    }
    g.position.y = -H;                                   // starts underground → rises in (harmless until fully up)
    this.G.scene.add(g);
    this.thorns.push({group:g, col:null, x, w, H, t:0, state:'rise'});
  }
  _freeCol(col){ if(!col) return; const i = this.G.world.cols.indexOf(col); if(i>=0) this.G.world.cols.splice(i,1); }

  _showDiveWarn(cx){
    this._clearDiveWarn();
    const m = new THREE.Mesh(geo('box',16,0.08,3.2), new THREE.MeshBasicMaterial({color:0xff4d6d, transparent:true, opacity:0.4}));
    m.position.set(cx, 0.08, 0);
    this.G.scene.add(m); this.diveWarn = m;
  }
  _clearDiveWarn(){ if(this.diveWarn){ this.G.scene.remove(this.diveWarn); this.diveWarn = null; } }

  _sneeze(){
    window.UI && UI.toast('🤧 Cauldron fumes make Broomhilda SNEEZE. Now\'s your chance!');
    const p = this.pos;
    this.G.fx.spawn(new THREE.Vector3(p.x, p.y+0.4, 0.5), 0x9dffe0, 8, {speed:3, life:0.4});
    AUDIO.noise && AUDIO.noise({t:0.15, vol:0.14, fFrom:1200, fTo:400});
  }

  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    const G = this.G, pl = G.player, p = this.pos;

    // face the player (cosmetic) while airborne
    if(pl && this.state!=='defeat' && this.state!=='grounded' && this.state!=='bucked'){
      this.faceDir = (pl.pos.x < p.x) ? -1 : 1;
    }
    // gentle discovery hint if the fight drags at full health (mirrors boss 1/2)
    if(!this._hint && this.t > 16 && this.hp === this.maxHp && !this.dead){
      this._hint = true;
      window.UI && UI.toast("🧹 A hedge-witch whispers: 'a broom's pride is its bristles...'");
    }

    // ---- BRISTLE SPIN self-detection (boss is not an ents entity — detect the player's spin here) ----
    // one count per swing: latch while pl.attackT>0, clear when the swing ends (attackT<=0). Two → buck.
    if(this.bristleOpen && pl && pl.attackT > 0 && !this._swingLatched && !this.dead){
      const b = this.bristleWorld();
      if(Math.hypot(pl.pos.x - b.x, pl.pos.z - b.z) < this.bristleR && Math.abs(pl.pos.y + 0.4 - b.y) < this.bristleYR){
        this._swingLatched = true;
        this.bristleHit();
      }
    }
    if(pl && pl.attackT <= 0) this._swingLatched = false;

    switch(this.state){
      case 'intro':
        p.x = damp(p.x, 6, 3, dt);
        p.y = damp(p.y, this.hoverY, 3, dt);
        this.body.rotation.z = Math.sin(this.t*3)*0.1;
        if(this.stateT > 1.4 && !this._introDlg){
          this._introDlg = true; G.camc.shake(0.5, 0.4);
          window.UI && UI.dialogue('🧹', '"Heeheehee! A little TRICK-OR-TREATER, this far into MY wood? You\'ll make a lovely newt, dearie. My broom and I have places to BE!"');
        }
        if(this.stateT > 1.5){ this.state = 'taunt'; this.stateT = 0; }
        break;
      case 'taunt':
        this.body.rotation.z = damp(this.body.rotation.z, 0, 4, dt);
        p.y = damp(p.y, this.hoverY, 4, dt);
        if(this.stateT > 1.2){ this.state = 'hover'; this.stateT = 0; }
        break;

      case 'hover': {
        // aerial weave (deterministic — pure function of this.t) + bob; pulls her back after a dive/potion
        p.x = damp(p.x, Math.sin(this.t*0.8)*13, 3, dt);
        p.y = damp(p.y, this.hoverY + Math.sin(this.t*1.6)*0.3, 4, dt);
        this.body.rotation.z = Math.sin(this.t*2)*0.05;
        this.body.rotation.x = damp(this.body.rotation.x, 0, 6, dt);
        const breather = this.phase>=3 ? 0.55 : (this.phase>=2 ? 0.7 : 0.9);
        if(this.stateT > breather){
          const a = this.nextAction(); this.stateT = 0;
          if(a === 'dive'){ this.state = 'dive'; this._diveInit = false; }
          else if(a === 'potion'){ this.state = 'potion'; this._released = false; }
          else if(a === 'thorns'){ this.state = 'thorns'; this._released = false; }
          else { this.state = 'lowcast'; this.bristleOpen = false; }   // bristleHits deliberately NOT reset — one swat per window is enough (both-in-one was the difficulty wall)
        }
        break;
      }

      case 'dive': {
        const tele = this.phase>=3 ? 0.5 : (this.phase>=2 ? 0.65 : 0.85);   // phase-1 dives announce themselves longer
        if(!this._diveInit){
          this._diveInit = true;
          this.diveFromX = p.x;
          this.diveToX = p.x >= 0 ? -20 : 20;
          this.faceDir = this.diveToX > p.x ? 1 : -1;
          this._showDiveWarn((this.diveFromX + this.diveToX)/2);
          AUDIO.noise && AUDIO.noise({t:0.2, vol:0.18, fFrom:1600, fTo:700});
        }
        if(this.stateT < tele){
          // TELEGRAPH — rear back at altitude, the ground warning strip pulses under the sweep
          this.body.rotation.x = damp(this.body.rotation.x, -0.5, 8, dt);
          p.y = damp(p.y, this.hoverY + 0.6, 6, dt);
          if(this.diveWarn) this.diveWarn.material.opacity = 0.3 + Math.abs(Math.sin(this.t*16))*0.4;
        } else {
          const u = clamp((this.stateT - tele)/0.7, 0, 1);
          p.x = lerp(this.diveFromX, this.diveToX, u);
          p.y = this.hoverY + (this.diveLowY - this.hoverY)*Math.sin(u*Math.PI);   // parabolic swoop, low at u=0.5
          this.body.rotation.x = damp(this.body.rotation.x, 0.4, 10, dt);
          if(pl && !pl.dead && Math.hypot(pl.pos.x - p.x, pl.pos.z - p.z) < 1.3 && pl.pos.y < p.y + 1.3){
            this.hurtPlayer(1, new THREE.Vector3(p.x, p.y, 0));
          }
          if(u >= 1){ this._clearDiveWarn(); this.state = 'hover'; this.stateT = 0; }
        }
        break;
      }

      case 'potion': {
        this.body.rotation.x = damp(this.body.rotation.x, -0.2, 8, dt);
        p.y = damp(p.y, this.hoverY, 5, dt);
        if(!this._released && this.stateT > 0.5){ this._released = true; this.spawnPotionVolley(this.phase>=3 ? 3 : 2); }
        if(this.stateT > 1.3){ this.body.rotation.x = 0; this.state = 'hover'; this.stateT = 0; }
        break;
      }

      case 'thorns': {
        p.y = damp(p.y, this.hoverY, 5, dt);
        this.body.rotation.z = Math.sin(this.t*8)*0.08;   // she gestures the hedge up
        if(!this._released && this.stateT > 0.6){
          this._released = true; this.spawnThorns();
          window.UI && UI.toast('🌿 Thorn hedges! MOVE to the gap!');
        }
        if(this.stateT > 1.2){ this.body.rotation.z = 0; this.state = 'hover'; this.stateT = 0; }
        break;
      }

      case 'lowcast': {
        const castLen = this.phase>=3 ? 2.0 : (this.phase>=2 ? 2.4 : 2.8);   // longer spin windows (owner: fight read as too hard)
        p.x = damp(p.x, this._castX, 5, dt);
        p.y = damp(p.y, this.lowY, 5, dt);           // DESCEND — bristles come into spin range
        this.body.rotation.x = damp(this.body.rotation.x, 0, 8, dt);
        if(!this.bristleOpen && Math.abs(p.y - this.lowY) < 0.6){
          this.bristleOpen = true;
          if(!this._castHint){ this._castHint = true; window.UI && UI.toast('✨ Her bristles are SPARKLING! SPIN them TWICE to buck her off! One swat now still counts next time!'); }
          if(!this._sneezed){ this._sneezed = true; this._sneeze(); }   // one-time flavor dodge/strike cue
        }
        if(this.bristleOpen){ this.body.rotation.z = Math.sin(this.t*6)*0.06; }   // weaving a spell
        if(this.stateT > castLen){
          // window survived — she finishes the cast (a parting lob) and climbs back out of reach
          this.bristleOpen = false;
          this.spawnPotionVolley(1);
          this.state = 'hover'; this.stateT = 0;
        }
        break;
      }

      case 'bucked': {
        // the broom bucks — it spins wild, she flails and loses altitude, then CRASHES
        this.broom.rotation.z += dt*18;
        this.body.rotation.z = Math.sin(this.t*30)*0.4;
        p.y = damp(p.y, 0.2, 7, dt);
        if(this.stateT > 0.6){
          p.y = 0; this.broom.rotation.z = 0;
          this.state = 'grounded'; this.stateT = 0;
          this.vulnerable = true; this.hitDone = false;
          this.stars.visible = true;
          AUDIO.poundHit(); G.camc.shake(0.6, 0.4);
          this.G.fx.spawn(new THREE.Vector3(p.x, 0.3, 0), 0xb37dff, 20, {speed:5});
          window.UI && UI.toast('⭐ She\'s down and DIZZY! HIT her! (stomp / spin / 💥)');
        }
        break;
      }

      case 'grounded': {
        const stunLen = this.phase>=3 ? 2.8 : (this.phase>=2 ? 3.4 : 4.0);   // more time to cash in the buck-off you earned
        this.body.rotation.z = Math.sin(this.t*2)*0.1;
        this.body.position.y = damp(this.body.position.y, -0.2, 6, dt);   // slump
        this.stars.children.forEach((st,i)=>{ const a = this.t*3 + i*(TAU/3); st.position.set(Math.cos(a)*1.0, 0, Math.sin(a)*1.0); });
        // ---- self-detected real hit (the boss isn't an ents entity — like boss 2's rune-hit) ----
        if(pl && this.vulnerable && !this.hitDone){
          const topY = p.y + 1.7;
          const dxz = Math.hypot(pl.pos.x - p.x, pl.pos.z - p.z);
          if(pl.vel.y < 0 && dxz < this.groundR && pl.pos.y > topY-0.7 && pl.pos.y < topY+1.3){
            pl.bounceOff(pl.pounding ? 13 : 11);          // stomp / pound-descent onto the dizzy witch
            this.hitBoss('stomp'); break;
          } else if(pl.attackT > 0 && dxz < this.groundR + 0.6 && Math.abs((pl.pos.y + 0.7) - (p.y + 1.0)) < 1.6){
            this.hitBoss('spin'); break;                  // spin-swat from the side (she's low when down)
          }
        }
        if(this.stateT > stunLen){ this.state = 'groundRec'; this.stateT = 0; this.vulnerable = false; this.stars.visible = false; }
        break;
      }

      case 'groundRec':
        // missed the window — she heaves back onto the broom and lifts out of reach
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        p.y = damp(p.y, this.hoverY, 5, dt);
        if(this.stateT > 0.8 && p.y > this.hoverY - 0.6){ this.state = 'hover'; this.stateT = 0; }
        break;

      case 'enrage':
        // furious flare after a real hit — lift back up + one pressure volley, then resume the loop
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        this.body.position.y = damp(this.body.position.y, 0, 8, dt);
        p.y = damp(p.y, this.hoverY, 4, dt);
        if(!this._enrShot && this.stateT > 0.5){ this._enrShot = true; this.spawnPotionVolley(this.phase>=3 ? 3 : 2); AUDIO.bossRoar(); }
        if(this.stateT > 1.5){
          this.state = 'hover'; this.stateT = 0;
          window.UI && UI.toast(this.phase>=3 ? '🔥 Final phase! She\'s SHRIEKING!' : '⚡ Phase '+this.phase+'!');
        }
        break;

      case 'defeat':
        p.y = damp(p.y, 0.3, 3, dt);
        this.body.rotation.z = Math.sin(this.stateT*3)*0.12;
        this.body.scale.setScalar(Math.max(0.5, 1 - this.stateT*0.16));
        this.broom.rotation.z += dt*4;
        if(this.stateT > 2.6 && !this._farewell){
          this._farewell = true;
          window.UI && UI.dialogue('🧹', '"...my broom. She hasn\'t bucked me like that since I was a GIRL. Oh... I remember now. Take your ember, child, and take the old girl too. She likes you. Just mind her bristles. 💜"');
        }
        break;
    }

    // ---- potions in flight ----
    for(let i=this.potions.length-1;i>=0;i--){
      const s = this.potions[i]; s.t += dt;
      s.mesh.position.x = s.x0 + s.vx*s.t;
      s.mesh.position.y = s.y0 + s.vy*s.t - 0.5*s.g*s.t*s.t;
      s.mesh.rotation.x += dt*8;
      const k = clamp(s.t/s.T, 0, 1);
      s.ring.scale.setScalar(0.4 + k*1.0);
      s.ring.material.opacity = 0.25 + k*0.5;
      if(s.t >= s.T){
        this.G.scene.remove(s.mesh, s.ring);
        this.spawnGoo(s.tx);
        this.potions.splice(i,1);
      }
    }
    // ---- goo puddles (hazard; fair — telegraphed, generous safe lanes, fades out) ----
    for(let i=this.puddles.length-1;i>=0;i--){
      const pd = this.puddles[i]; pd.t += dt;
      const k = clamp((pd.life - pd.t)/0.6, 0, 1);
      pd.disc.material.opacity = 0.55 * Math.min(1,k) * (0.8 + 0.2*Math.sin(pd.t*8));
      if(pd.t >= pd.life){ this._freeCol(pd.col); this.G.scene.remove(pd.group); this.puddles.splice(i,1); }
    }
    // ---- thorn walls (rise harmless → stand as hazard → retract, freeing the collider) ----
    for(let i=this.thorns.length-1;i>=0;i--){
      const th = this.thorns[i]; th.t += dt;
      if(th.state === 'rise'){
        th.group.position.y = Math.min(0, -th.H + th.t*(th.H/0.6));
        if(th.t >= 0.6){ th.group.position.y = 0; th.state = 'stand'; th.t = 0; th.col = this.G.world.addBox(th.x, 0, 0, th.w, 1.2, 2.8, {type:'hazard', damage:1}); }
      } else if(th.state === 'stand'){
        if(th.t >= 2.6){ this._freeCol(th.col); th.col = null; th.state = 'retract'; th.t = 0; }
      } else {
        th.group.position.y = -th.t*(th.H/0.4);
        if(th.t >= 0.4){ this.G.scene.remove(th.group); this.thorns.splice(i,1); }
      }
    }

    // ---- visuals ----
    this.broom.rotation.y = this.faceDir > 0 ? 0 : Math.PI;     // flip only the broom; the witch face stays to camera
    const spk = this.bristleOpen ? (0.8 + Math.abs(Math.sin(this.t*16))*0.9) : 0.35;
    this.bristleMat.emissiveIntensity = spk;
    if(this.bristleOpen && Math.floor(this.t*12) !== Math.floor((this.t-dt)*12)){
      const b = this.bristleWorld();
      this.G.fx.spawn(new THREE.Vector3(b.x + rand(-0.3,0.3), b.y + rand(-0.2,0.2), 0), 0xfff2b0, 1, {speed:1.2, life:0.4, gravity:-1, size:0.5});
    }
    this.group.position.copy(p);
    this.shadow.position.set(p.x, 0.03, p.z);
    this.shadow.scale.setScalar(clamp(1 - p.y*0.06, 0.3, 1));
  }
}

// ============ the arena — a Witchwood clearing ============
function buildBossArena3(G){
  const S = G.scene;
  const x1 = -24, x2 = 24, W = 52, D = 12;
  // ---- side-view forest clearing: wide, FLAT, SAFE mossy floor, lane z=0 (only her goo/thorns are hazards) ----
  const ground = mesh('box',[W,1.4,D], mat(W3PAL.ground)); ground.position.set(0,-0.7,0); S.add(ground);
  const lip = mesh('box',[W,0.14,D+0.3], mat(W3PAL.groundL)); lip.position.set(0,0.02,0); S.add(lip);
  G.world.addBox(0,-1.4,0, W,1.4,D, {});

  // ---- layered witch-forest parallax + floating potion motes (D3 art language) ----
  w3Parallax(S, x1, x2);

  // ---- baked deco: braided trees ringing the clearing, witch huts, cauldrons, toadstools, webs, thorn hedges ----
  const deco = new THREE.Group();
  for(let i=0;i<6;i++) deco.add(braidedTree(rand(x1,x2), rand(-9,-5.5), rand(1.1,1.7)));          // back tree wall
  deco.add(braidedTree(-20,-3.4,1.5), braidedTree(20,-3.4,1.5));
  deco.add(braidedTree(-15,3.8,1.2), braidedTree(16,4.0,1.2));                                    // foreground framing (z>0)
  deco.add(witchHut(-18,-6.5,1.1), witchHut(17,-7,1.0));
  deco.add(cauldronDeco(-22,-3.0,1.1), cauldronDeco(22,-3.0,1.1));
  for(let i=0;i<5;i++) deco.add(mushroomCluster(rand(x1,x2), rand(2.6,4.4), rand(0.7,1.2)));       // foreground toadstools
  // static thorn-hedge framing (pure deco — her ATTACK thorns are separate live hazards)
  for(let i=0;i<4;i++){ const tx = rand(x1,x2); for(let j=0;j<5;j++){ const th = mesh('cone',[0.14,rand(0.5,0.9),5], emat(0x7a3fbf,0x5b2fa0,0.4)); th.position.set(tx+rand(-0.8,0.8), 0.3, rand(3.0,4.6)); th.rotation.z = rand(-0.25,0.25); deco.add(th); } }
  // hanging webs lifted into the tree forks
  const hw1 = hangingWeb(-12,-4.2,1.1); hw1.position.y = 2.6; deco.add(hw1);
  const hw2 = hangingWeb(11,-4.2,1.1);  hw2.position.y = 2.6; deco.add(hw2);
  S.add(bakeGroup(deco));

  // ---- live will-o'-wisps drifting in the midground (translucent — kept live, not baked) ----
  for(const [wx,wy,wz] of [[-8,2.4,-2],[6,3.0,-2.5],[-2,1.8,-1.5]]) S.add(willOWisp(wx,wy,wz));

  // ---- ≤6 real lights: two hut windows + two hero cauldron glows ----
  for(const [lx,col] of [[-18,W3PAL.hutWin],[17,W3PAL.hutWin],[-22,0x40e6a0],[22,0x40e6a0]]){
    const l = new THREE.PointLight(col, 26, 16); l.position.set(lx, 2.8, -2.4); S.add(l);
  }

  // ---- IN-WORLD HINT board: "A BROOM'S PRIDE IS ITS BRISTLES" (baked deco; the toast delivers the words) ----
  const sign = new THREE.Group();
  const post = mesh('box',[0.14,1.4,0.14], mat(W3PAL.hutD)); post.position.y = 0.7;
  const board = mesh('box',[1.8,0.9,0.1], mat(W3PAL.hut)); board.position.y = 1.5; crook(board,0.04);
  for(let i=0;i<3;i++){ const line = mesh('box',[1.2,0.07,0.03], emat(W3PAL.potion,W3PAL.potion,0.6)); line.position.set(0,1.72-i*0.22,0.07); board.add(line); }
  // a straw broom leaning on the sign — the visual rhyme with the tell
  const bshaft = mesh('cyl',[0.03,0.04,1.0,5], emat(0x7a5636,0x3a2410,0.35)); bshaft.position.set(0.95,0.5,0.12); bshaft.rotation.z = 0.4;
  for(let i=0;i<6;i++){ const s = mesh('cyl',[0.015,0.04,0.3,4], emat(0xe0b84a,0xb8902a,0.5)); s.position.set(1.24, 0.08, 0.12+(i-3)*0.03); s.rotation.z = 1.5; sign.add(s); }
  sign.add(post, board, bshaft); sign.position.set(-9,0,2.6); S.add(bakeGroup(sign));

  // ---- QUIET STORY PROP (never signposted): Granny Wick's knitting left on a stump — a half-sewn ghost-
  //      sheet + a glinting silver thimble. Story-readers know Gran's on the Quiet Side; everyone else walks past. ----
  const stump = mesh('cyl',[0.5,0.6,0.7,10], mat(W3PAL.barkD)); stump.position.set(-23,0.35,3.4); S.add(stump);
  const cloth = mesh('box',[0.7,0.16,0.6], emat(0xf2f0ff,0xd8d4f0,0.25)); cloth.position.set(-23,0.78,3.4); crook(cloth,0.06); S.add(cloth);
  const thimble = mesh('cyl',[0.07,0.09,0.13,10], emat(0xe4e8f2,0xcfe0ff,1.0)); thimble.position.set(-22.7,0.86,3.55); S.add(thimble);

  // ---- walls, spawn, feel wiring (mirrors buildBossArena2; do NOT set mode/camera — main handles boss3) ----
  G.world.addBox(-26.5,0,0, 4,12,D, {});
  G.world.addBox( 26.5,0,0, 4,12,D, {});
  G.spawnPoint.set(-14, 0.6, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 7, 34);
  G.amb  = w3Ambience(S, x1, x2);
  w3Clutter(G, x1, -3, 'forest'); w3Clutter(G, 3, x2, 'forest');   // skip the centre lane where the fight happens
  G.lightPools = [];
  G.boss = new Broomhilda(G);
}

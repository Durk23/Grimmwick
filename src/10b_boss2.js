// ============ BOSS 2 — Mossgrave, the Tombstone Titan (Ravenmoor Catacombs) ============
// District 2 guardian. A huge cracked haunted GRAVESTONE, rooted in a crystal-lit tomb chamber.
// His stone hide shrugs off normal attacks — direct swings/stomps barely chip him. The ONLY real
// damage is the TENNIS SECRET: when he summons a homing bat swarm, each bat FLASHES ORANGE for a
// window as it closes in; SPIN-ATTACK ('swing') a bat while it's orange and it reverses, homing back
// at Mossgrave. A returned bat topples him face-down, exposing the glowing MOSS RUNES on his back →
// smash the runes (stomp / spin / pound) for a real rune-hit. 3 rune-hits = defeat.
//
// Harder than the Pumpkin King (boss 1): faster slam telegraphs, shockwave rings, AND ranged homing
// projectiles (the bats). Every attack is telegraphed; the floor is safe ground (no cheap kills).
// Deterministic: fixed attack pattern + fixed clocks (no Math.random on the critical path).
//
// Mirrors 10_boss1.js exactly where the engine cares: buildBossArena2(G) sets G.spawnPoint / G.world /
// G.boss = new Mossgrave(G); the boss is the G.boss singleton with update(dt) (main calls it with dt
// only — read this.G, never a passed arg); UI boss bar via UI.showBossBar/updateBossBar/hideBossBar;
// player pound routes through onPlayerPound(pos); defeat calls G.onBossDefeated() (w2 rewards wired
// separately by the main dev). The bats are MossBat entities extending Enemy (07_enemies.js), so the
// player's built-in spin/stomp detection calls their takeHit(player,kind) automatically.

// ---- MossBat: Mossgrave's homing projectile + the tennis tool ----
// Spectral bat. Homes toward the player (a deliberate boss-only exception to the roster "never homing"
// rule — kept fair by a slow capped speed, a small cap on how many fly at once, and a bright ORANGE
// swattable window). While NOT flashing orange it is spectral: attacks pass through (this forces the
// player to learn the timing). While orange + hit by a SPIN ('swing') it REVERSES and homes at
// Mossgrave; reaching him topples him. Any other hit during the window just pops it harmlessly (you
// may defend, but only a spin sends it back).
class MossBat extends Enemy {
  constructor(G, x, y, z, opts={}){
    super(G, x, y, z);
    this.hitR = 0.5; this.headH = 0.6; this.hitY = 0.35; this.touchR = 0.62;
    this.candyDrop = 1;
    this.state = 'spawn'; this.st = 0;
    this.reversed = false; this.swattable = false;
    this.homeSpeed = opts.speed || 2.6;   // slow — a player can out-walk it and set up a swing
    this.swatRange = 4.6;                  // horizontal distance at which it flashes orange (the tell)
    this.life = opts.life || 7.5;          // self-destructs if it never resolves (no swarm build-up)
    this.spawnGrace = 0.5;                 // harmless while emerging (base touchPlayer drains this)
    // OWN materials so one bat flashing orange never tints the rest of the swarm
    this.bodyMat = new THREE.MeshLambertMaterial({color:0x4a3f6e, emissive:0x2a2350, emissiveIntensity:0.5});
    this.body = mesh('sph',[0.32,8,7], this.bodyMat); this.body.scale.set(1,0.9,0.85);
    const belly = mesh('sph',[0.2,7,6], emat(0x6a5aa0,0x3a2f6a,0.5)); belly.position.set(0,-0.05,0.16);
    this.earL = mesh('cone',[0.09,0.28,5], this.bodyMat); this.earL.position.set(-0.14,0.3,0);
    this.earR = this.earL.clone(); this.earR.position.x = 0.14;
    const eM = emat(0xffd34d,0xffd34d,1);
    const eL = mesh('sph',[0.07,6,6], eM); eL.position.set(-0.12,0.05,0.26);
    const eR = eL.clone(); eR.position.x = 0.12;
    const wingM = emat(0x5b4f86,0x342a5e,0.45);
    this.wingL = mesh('box',[0.55,0.05,0.32], wingM); this.wingL.position.set(-0.42,0.05,0);
    this.wingR = this.wingL.clone(); this.wingR.position.x = 0.42;
    this.group.add(this.body, belly, this.earL, this.earR, eL, eR, this.wingL, this.wingR);
    G.scene.add(this.group);
  }
  dissipate(atBoss){
    if(this.dead) return;
    this.dead = true;                        // EntityMgr removes .group next frame; no candy (it's a summon/projectile)
    AUDIO.enemyPoof();
    this.G.fx.spawn(this.group.position.clone(), atBoss?0x9ad6ff:0x8a72c0, atBoss?14:8, {speed:3, life:0.5});
    if(this.shadow) this.G.scene.remove(this.shadow);
  }
  takeHit(player, kind){
    if(this.dead || this.reversed) return;
    if(!this.swattable) return;              // spectral until it flashes orange — swings pass through
    if(kind === 'swing'){
      // TENNIS! spin-swat sends it back at Mossgrave
      this.reversed = true; this.state = 'return'; this.st = 0;
      this.touchDamage = 0; this.life = 6;
      AUDIO.bounce(); AUDIO.stomp();
      this.G.hitstop = 0.05; this.G.camc.shake(0.18, 0.25);
      this.G.fx.spawn(this.group.position.clone(), 0xffd34d, 16, {speed:4});
      const boss = this.G.boss;
      if(boss && !boss._mossTaught){ boss._mossTaught = true; window.UI && UI.toast('🦇➡️ SWAT! You knocked it back at Mossgrave!'); }
    } else {
      // any other swattable-window hit just pops it (you defended — but only a SPIN reverses it)
      this.dissipate();
    }
  }
  update(dt){
    this.t += dt; this.st += dt;
    const p = this.group.position, pl = this.G.player, boss = this.G.boss;
    const flap = Math.sin(this.t * (this.state==='return'?20:12));
    this.wingL.rotation.z =  0.4 + flap*0.7;
    this.wingR.rotation.z = -0.4 - flap*0.7;

    if(this.state === 'spawn'){
      p.y += 1.2 * dt;                       // rise out of the titan; harmless (spawnGrace)
      if(this.st > 0.45){ this.state = 'home'; this.st = 0; }
    } else if(this.state === 'home'){
      this.life -= dt;
      if(pl && !pl.dead){
        const tx = pl.pos.x, ty = pl.pos.y + 0.9, tz = 0;   // torso height, on the lane — reachable by a spin
        const dx = tx-p.x, dy = ty-p.y, dz = tz-p.z, d = Math.hypot(dx,dy,dz) || 1;
        p.x += dx/d*this.homeSpeed*dt; p.y += dy/d*this.homeSpeed*dt; p.z += dz/d*this.homeSpeed*dt;
        this.group.rotation.y = Math.atan2(dx, dz || 1e-4);
        this.swattable = Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) < this.swatRange;
      }
      if(this.life <= 0){ this.dissipate(); return; }
      this.touchPlayer(dt);                  // fair contact damage if it reaches you (telegraphed, dodgeable)
    } else if(this.state === 'return'){
      const bx = boss ? boss.pos.x : p.x;
      const by = (boss ? boss.pos.y + (boss.runeY||1.4) : 1.4) + 0.6;
      const bz = (boss ? boss.pos.z : 0) - 0.4;
      const dx = bx-p.x, dy = by-p.y, dz = bz-p.z, d = Math.hypot(dx,dy,dz) || 1;
      const sp = 8;
      p.x += dx/d*sp*dt; p.y += dy/d*sp*dt; p.z += dz/d*sp*dt;
      this.group.rotation.y = Math.atan2(dx, dz || 1e-4);
      if(d < 1.6){ if(boss && boss.onBatReturn) boss.onBatReturn(this); this.dissipate(true); return; }
    }
    // ---- colour state: the ORANGE swattable flash is the whole tell ----
    if(this.reversed){
      this.bodyMat.color.setHex(0xffffff); this.bodyMat.emissive.setHex(0x9ad6ff); this.bodyMat.emissiveIntensity = 0.9;
    } else if(this.swattable){
      const g = 0.6 + Math.abs(Math.sin(this.t*14))*0.5;
      this.bodyMat.color.setHex(0xff8a1e); this.bodyMat.emissive.setHex(0xff5e00); this.bodyMat.emissiveIntensity = g;
    } else {
      this.bodyMat.color.setHex(0x4a3f6e); this.bodyMat.emissive.setHex(0x2a2350); this.bodyMat.emissiveIntensity = 0.5;
    }
    this.updateShadow();
  }
}

// ---- Mossgrave, the Tombstone Titan ----
class Mossgrave {
  constructor(G){
    this.G = G;
    this.runeMax = 3; this.runeHp = 3;     // 3 rune-hits to defeat (mirrors the King's 3 HP)
    this.dead = false;
    this.pos = new THREE.Vector3(8, 0, 0); // ROOTED — a planted gravestone; he never chases (attacks are ranged)
    this.state = 'rise'; this.stateT = 0; this.t = 0;
    this.phase = 1;
    this.seq = 0;                          // deterministic attack-pattern index
    this.shockwaves = [];
    this.batCap = 3;                       // max bats aloft at once (fairness)
    this.runeDone = false;                 // one rune-hit per topple (like one crit per bounce in boss 1)
    this.runeY = 1.3;                      // logical height of the exposed back-runes when toppled
    this.runeR = 2.6;                      // horizontal reach of the rune zone
    this._released = false; this._enrShot = false;
    this._mossTaught = false; this._batHint = false; this._hint = false;
    this.buildRig();
    this.shadow = blobShadow(2.8);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('Mossgrave, the Tombstone Titan', this.runeHp, this.runeMax); }
    AUDIO.bossRoar();
  }
  buildRig(){
    this.group = new THREE.Group();
    const body = new THREE.Group();
    const stone = emat(W2PAL.stone, 0x2a2740, 0.16), stoneD = mat(W2PAL.stoneD), stoneL = mat(W2PAL.stoneL);
    const moss = mat(W2PAL.moss);
    // plinth the titan roots into
    const plinth = mesh('box',[4.4,0.6,2.4], stoneD); plinth.position.y = 0.3;
    // main headstone slab + rounded cap (the classic gravestone silhouette, reads instantly)
    const slab = mesh('box',[3.6,4.6,1.3], stone); slab.position.y = 2.7;
    const cap = mesh('cyl',[1.8,1.8,1.3,18], stone); cap.rotation.x = Math.PI/2; cap.position.set(0,4.9,0);
    // a jagged crack down the face (he's "cracked")
    const crack = mesh('box',[0.14,3.2,0.1], stoneD); crack.position.set(-0.3,3.0,0.66); crook(crack,0.12);
    const crack2 = mesh('box',[0.12,1.3,0.1], stoneD); crack2.position.set(0.15,1.7,0.66); crook(crack2,0.2);
    // moss patches (blue-green, the district's colour)
    const m1 = mesh('sph',[0.6,7,6], moss); m1.position.set(-1.3,1.2,0.6); m1.scale.set(1.1,0.7,0.4);
    const m2 = mesh('sph',[0.5,7,6], moss); m2.position.set(1.2,0.7,0.62); m2.scale.set(1.2,0.6,0.4);
    const m3 = mesh('sph',[0.45,7,6], moss); m3.position.set(0.9,3.9,0.55); m3.scale.set(1.0,0.7,0.4);
    // angry spectral face on the FRONT (+z) — own eye material so it can dim when he's dazed
    this.eyeMat = new THREE.MeshLambertMaterial({color:0x8fffe0, emissive:0x4dffc0, emissiveIntensity:1});
    this.eyeL = mesh('cone',[0.34,0.5,3], this.eyeMat); this.eyeL.position.set(-0.7,3.5,0.66); this.eyeL.rotation.x = 0.2; this.eyeL.rotation.z = -0.35;
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x = 0.7; this.eyeR.rotation.z = 0.35; this.eyeR.material = this.eyeMat;
    this.mouth = new THREE.Group();
    const mo = mesh('box',[1.5,0.26,0.14], this.eyeMat); mo.position.set(0,2.5,0.68);
    for(let i=0;i<3;i++){ const tooth = mesh('box',[0.26,0.3,0.13], this.eyeMat); tooth.position.set(-0.5+i*0.5,2.7,0.68); this.mouth.add(tooth); }
    this.mouth.add(mo);
    // stubby stone arms
    this.armL = mesh('cyl',[0.3,0.34,1.7,7], stoneL); this.armL.rotation.z = 1.0; this.armL.position.set(-2.2,2.2,0);
    this.armR = mesh('cyl',[0.3,0.34,1.7,7], stoneL); this.armR.rotation.z = -1.0; this.armR.position.set(2.2,2.2,0);
    // ---- THE MOSS RUNES on the BACK (-z): faint always (foreshadow), BLAZE when toppled ----
    // own materials so the "expose the runes" tell is a real emissive change
    this.runeMats = [];
    this.runeGroup = new THREE.Group();
    const mkRune = (geoKind, args, x, y) => {
      const rm = new THREE.MeshLambertMaterial({color:W2PAL.crystalP, emissive:0x7dff9e, emissiveIntensity:0.35});
      const r = mesh(geoKind, args, rm); r.position.set(x, y, -0.7); this.runeMats.push(rm); this.runeGroup.add(r); return r;
    };
    const rc = mkRune('tor',[0.5,0.07,6,14], 0, 3.1); rc.rotation.x = Math.PI/2;
    mkRune('box',[0.1,1.0,0.08], 0, 3.1);
    mkRune('box',[0.8,0.1,0.08], 0, 2.5);
    const rc2 = mkRune('tor',[0.34,0.06,6,12], -0.9, 1.8); rc2.rotation.x = Math.PI/2;
    const rc3 = mkRune('tor',[0.34,0.06,6,12], 0.9, 1.8); rc3.rotation.x = Math.PI/2;
    mkRune('box',[0.6,0.09,0.08], 0, 1.1);

    body.add(plinth, slab, cap, crack, crack2, m1, m2, m3, this.eyeL, this.eyeR, this.mouth,
             this.armL, this.armR, this.runeGroup);
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    this.body.position.y = -6;             // starts buried — rises in the intro
  }

  // ---------- the tennis + rune loop ----------
  onBatReturn(bat){
    if(this.dead) return;
    // only an ACTIVE, upright Mossgrave can be toppled; if already down, the extra bat just splashes
    if(this.state==='idle' || this.state==='slamWind' || this.state==='slamRec' || this.state==='summon' || this.state==='enrage'){
      this.topple();
    }
  }
  topple(){
    this.state = 'toppled'; this.stateT = 0; this.runeDone = false;
    AUDIO.bossRoar(); this.G.camc.shake(0.6, 0.5);
    // knock the in-flight (non-reversed) bats out of the sky so the player gets a clean window
    for(const e of this.G.ents.list) if(e instanceof MossBat && !e.dead && !e.reversed) e.dissipate();
    window.UI && UI.toast('💥 TIMBER! Mossgrave topples — SMASH the glowing moss runes on his back!');
  }
  runeHit(kind){
    if(this.dead || this.state!=='toppled' || this.runeDone) return;
    this.runeDone = true;
    this.runeHp--;
    AUDIO.bossHit();
    this.G.hitstop = 0.1; this.G.camc.shake(0.55, 0.45);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+this.runeY, this.pos.z), 0x7dff9e, 24, {speed:6});
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+this.runeY, this.pos.z), 0xffffff, 12, {speed:4});
    window.UI && UI.updateBossBar(this.runeHp);
    if(this.runeHp <= 0){ this.defeat(); return; }
    this.phase = this.runeMax - this.runeHp + 1;
    this.batCap = this.phase>=3 ? 4 : 3;
    window.UI && UI.toast(['', '"You... you CRACKED me! You little WEED!"', '"MMH! The MOSS — hide the MOSS!"'][this.runeHp] || '');
    this.state = 'enrage'; this.stateT = 0; this._enrShot = false;
  }
  onPlayerPound(pos){
    // player ground-pound landing routes here (player.js) — a pound on the exposed back counts
    if(this.state!=='toppled' || this.runeDone || this.dead) return;
    if(Math.hypot(pos.x-this.pos.x, pos.z-this.pos.z) < this.runeR+0.4) this.runeHit('pound');
  }
  defeat(){
    this.dead = true; this.state = 'defeat'; this.stateT = 0;
    AUDIO.victory();
    window.UI && UI.hideBossBar();
    for(const e of this.G.ents.list) if(e instanceof MossBat && !e.dead) e.dissipate();
    const p = this.pos;
    for(let i=0;i<4;i++){
      setTimeout(()=>{ if(this.G.scene) this.G.fx.spawn(new THREE.Vector3(p.x+rand(-2,2), p.y+rand(1,5), p.z+rand(-2,2)), pick([W2PAL.crystal,0x7dff9e,0xffffff]), 16, {speed:5}); }, i*280);
    }
    candyBurst(this.G, new THREE.Vector3(p.x, p.y+2, p.z), 24);
    this.G.onBossDefeated();
  }
  hurtPlayer(n, from){ const pl = this.G.player; if(pl) pl.damage(n, from||this.pos); }

  // ---------- attacks ----------
  nextAction(){
    // deterministic pattern; denser summons as phases rise (no Math.random on the critical path)
    const pat = this.phase>=3 ? ['summon','slam','summon','slam','summon']
              : this.phase>=2 ? ['slam','summon','slam','summon','summon']
              :                 ['slam','summon','slam','summon'];
    const a = pat[this.seq % pat.length]; this.seq++;
    return a;
  }
  spawnShockwave(){
    AUDIO.shockwave();
    const ring = new THREE.Mesh(geo('tor',1,0.28,7,30), emat(W2PAL.cryptWin, 0x6fd6c8, 0.9));
    ring.rotation.x = Math.PI/2;
    ring.position.set(this.pos.x, 0.32, this.pos.z);
    this.G.scene.add(ring);
    this.shockwaves.push({mesh:ring, r:1, speed: this.phase>=3?11:(this.phase>=2?10:9), hit:false});
    this.G.camc.shake(0.4, 0.3);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, 0.4, this.pos.z), 0x8492ac, 12, {speed:4, life:0.4});
  }
  spawnBatSwarm(n){
    const active = this.G.ents.list.filter(e=>e instanceof MossBat && !e.dead && !e.reversed).length;
    n = Math.min(n, Math.max(0, this.batCap - active));
    const offs = [-1.8, 1.8, -0.6, 0.6];   // fixed spawn spread around his head (deterministic)
    for(let i=0;i<n;i++){
      const bx = this.pos.x + offs[i % offs.length], by = this.pos.y + 4.4;
      const bat = new MossBat(this.G, bx, by, 0, {speed: this.phase>=3?3.1:(this.phase>=2?2.9:2.6)});
      bat.group.position.set(bx, by, 0);
      this.G.ents.add(bat);
      this.G.fx.spawn(new THREE.Vector3(bx, by, 0), 0x8a72c0, 6, {speed:3, life:0.4});
    }
    AUDIO.noise({t:0.3, vol:0.22, fFrom:1400, fTo:500});
    if(!this._batHint){ this._batHint = true; window.UI && UI.toast('🦇 Bats! SPIN one while it flashes ORANGE to send it back at him!'); }
  }

  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    const G = this.G, pl = G.player, p = this.pos;

    // gentle discovery hint if the fight drags at full health (mirrors boss 1's crowd chant)
    if(!this._hint && this.t > 26 && this.runeHp === this.runeMax && !this.dead){
      this._hint = true;
      window.UI && UI.toast("🪦 A gravedigger ghost mutters: 'moss only grows where he can't scratch...'");
    }
    // face the player only while upright (he's rooted, so this is just a slow head-turn feel)
    if(pl && this.state!=='defeat' && this.state!=='toppled' && this.state!=='rise'){
      const want = Math.atan2(pl.pos.x - p.x, pl.pos.z - p.z);
      this.group.rotation.y = angleDamp(this.group.rotation.y, want, 2.2, dt);
    }

    switch(this.state){
      case 'rise':
        this.body.position.y = Math.min(0, -6 + this.stateT*7);
        if(this.stateT < 0.06) G.fx.spawn(new THREE.Vector3(p.x, 0.2, p.z), 0x6b5a4e, 14, {speed:4, life:0.6});
        if(this.stateT > 1.0){ this.state='taunt'; this.stateT=0; this.body.position.y=0;
          G.camc.shake(0.6, 0.4);
          window.UI && UI.dialogue('🪦', '"Who rattles the stones of Ravenmoor? Turn back, little sprout — my roots run DEEP, and my hide is STONE."');
        }
        break;
      case 'taunt':
        if(this.stateT > 1.4){ this.state='idle'; this.stateT=0; }
        break;
      case 'idle': {
        const breather = this.phase>=3 ? 0.55 : (this.phase>=2 ? 0.7 : 0.85);
        this.body.rotation.x = damp(this.body.rotation.x, 0, 8, dt);
        if(this.stateT > breather){
          const a = this.nextAction();
          this.state = (a==='slam') ? 'slamWind' : 'summon';
          this.stateT = 0; this._released = false;
        }
        break;
      }
      case 'slamWind': {
        // TELEGRAPH — rear the slab back, flare a warning, faster than the King's wind-up
        const tele = this.phase>=3 ? 0.5 : (this.phase>=2 ? 0.6 : 0.7);
        this.body.rotation.x = damp(this.body.rotation.x, -0.45, 9, dt);
        if(this.stateT > tele){
          this.state = 'slamRec'; this.stateT = 0;
          this.body.rotation.x = 0.45;         // snap forward — SMASH
          AUDIO.poundHit(); G.camc.shake(0.5, 0.35);
          this.spawnShockwave();
          if(this.phase >= 2) setTimeout(()=>{ if(!this.dead && (this.state==='slamRec'||this.state==='idle')) this.spawnShockwave(); }, 400);
        }
        break;
      }
      case 'slamRec':
        this.body.rotation.x = damp(this.body.rotation.x, 0, 7, dt);
        if(this.stateT > 0.55){ this.state='idle'; this.stateT=0; }
        break;
      case 'summon': {
        // rear back and SCREECH, then pour out the swarm (release once, on a fixed clock)
        this.body.rotation.x = damp(this.body.rotation.x, -0.28, 8, dt);
        if(!this._released && this.stateT > 0.5){
          this._released = true;
          this.spawnBatSwarm(this.phase>=3 ? 4 : 3);
        }
        if(this.stateT > 1.25){ this.state='idle'; this.stateT=0; }
        break;
      }
      case 'toppled': {
        // face-DOWN, dazed — the moss runes on his back blaze and become hittable
        this.body.rotation.x = damp(this.body.rotation.x, 1.45, 8, dt);
        this.body.position.y = damp(this.body.position.y, -0.4, 6, dt);
        this.eyeMat.emissiveIntensity = 0.25;
        const blaze = 1.2 + Math.sin(this.t*8)*0.3;
        for(const rm of this.runeMats) rm.emissiveIntensity = blaze;
        // ---- rune-hit detection (the boss isn't an ents-list entity, so detect here, like boss 1's head-stomp) ----
        if(pl && !this.runeDone){
          const runeTopY = p.y + this.runeY;
          const dxz = Math.hypot(pl.pos.x - p.x, pl.pos.z - p.z);
          if(pl.vel.y < 0 && dxz < this.runeR && pl.pos.y > runeTopY-0.7 && pl.pos.y < runeTopY+1.3){
            // stomp / pound-descent onto the exposed back
            pl.bounceOff(pl.pounding ? 13 : 11);
            this.runeHit('stomp');
            break;
          } else if(pl.attackT > 0 && dxz < this.runeR+0.6 && Math.abs(pl.pos.y - runeTopY) < 1.6){
            // spin-swat the runes from the side (ground level works — the back is low when he's down)
            this.runeHit('spin');
            break;
          }
        }
        if(this.stateT > 3.6){ this.state='toppleRec'; this.stateT=0; }   // missed the window — he heaves back up
        break;
      }
      case 'toppleRec':
        this.body.rotation.x = damp(this.body.rotation.x, 0, 6, dt);
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        this.eyeMat.emissiveIntensity = damp(this.eyeMat.emissiveIntensity, 1, 6, dt);
        for(const rm of this.runeMats) rm.emissiveIntensity = damp(rm.emissiveIntensity, 0.35, 6, dt);
        if(this.stateT > 0.7){ this.state='idle'; this.stateT=0; }
        break;
      case 'enrage': {
        // furious flare after a rune-hit — keep the pressure on, then resume the loop
        this.body.rotation.x = damp(this.body.rotation.x, 0, 6, dt);
        this.body.position.y = damp(this.body.position.y, 0, 8, dt);
        this.eyeMat.emissiveIntensity = 1 + Math.sin(this.t*20)*0.4;
        for(const rm of this.runeMats) rm.emissiveIntensity = damp(rm.emissiveIntensity, 0.35, 6, dt);
        if(!this._enrShot && this.stateT > 0.5){ this._enrShot = true; this.spawnShockwave(); this.spawnBatSwarm(1); }
        if(this.stateT > 1.5){
          this.state='idle'; this.stateT=0;
          window.UI && UI.toast(this.phase>=3 ? '🔥 He\'s cracked and RAGING — one more!' : '⚡ Phase '+this.phase+'!');
        }
        break;
      }
      case 'defeat': {
        this.body.rotation.z = Math.sin(this.stateT*3)*0.08;
        this.body.scale.setScalar(Math.max(0.5, 1 - this.stateT*0.16));
        for(const rm of this.runeMats) rm.emissiveIntensity = 0.35 + Math.sin(this.t*4)*0.2;
        if(this.stateT > 2.6 && !this._farewell){
          this._farewell = true;
          window.UI && UI.dialogue('🪦', '"...the moss. Someone tended the moss on my back, once. My roots remember warm hands. Take the ember, child — and tell your Gran her Mossgrave is himself again." 💚');
        }
        break;
      }
    }

    // ---- shockwaves (jump to clear them; only bite a grounded, low player) ----
    for(let i=this.shockwaves.length-1;i>=0;i--){
      const sw = this.shockwaves[i];
      sw.r += sw.speed*dt;
      sw.mesh.scale.set(sw.r, sw.r, 1);
      if(pl && !sw.hit){
        const d = Math.hypot(pl.pos.x - sw.mesh.position.x, pl.pos.z - sw.mesh.position.z);
        if(Math.abs(d - sw.r) < 0.8 && pl.pos.y < 0.75){
          sw.hit = true;
          this.hurtPlayer(1, new THREE.Vector3(sw.mesh.position.x, 0, sw.mesh.position.z));
        }
      }
      if(sw.r > 24){ this.G.scene.remove(sw.mesh); this.shockwaves.splice(i,1); }
    }

    // ---- visuals ----
    this.group.position.copy(p);
    this.shadow.position.set(p.x, 0.03, p.z);
    if(this.state!=='toppled' && this.state!=='enrage' && this.state!=='defeat' && this.state!=='rise'){
      // idle breathing sway + faint rune shimmer (nothing perfectly still)
      this.body.rotation.z = Math.sin(this.t*1.6)*0.02;
      const s = 0.35 + Math.sin(this.t*3)*0.08;
      for(const rm of this.runeMats) rm.emissiveIntensity = s;
      this.eyeMat.emissiveIntensity = 0.9 + Math.sin(this.t*6)*0.2;
    }
  }
}

// ---- the arena ----
function buildBossArena2(G){
  const S = G.scene;
  const x1 = -24, x2 = 24;
  // ---- side-view catacomb tomb: wide, FLAT, SAFE stone floor, lane z=0 (no hazards, no pits) ----
  const W = 52, D = 12;
  const ground = mesh('box',[W,1.4,D], mat(W2PAL.caveWall)); ground.position.set(0,-0.7,0); S.add(ground);
  const floorTop = mesh('box',[W,0.12,D], emat(W2PAL.caveWallL, W2PAL.caveWallL, 0.18)); floorTop.position.set(0,0.06,0); S.add(floorTop);
  G.world.addBox(0,-1.4,0, W,1.4,D, {});

  // ---- layered cave parallax + framing silhouettes (D2 art language, all baked) ----
  w2Parallax(S, x1, x2, 'cave');
  const deco = new THREE.Group();
  deco.add(catacombArch(-11, -3.4, 1.5), catacombArch(11, -3.4, 1.5));
  deco.add(mausoleum(-19, -5.6, 1.0, true), mausoleum(19, -5.6, 1.0, true));
  for(let i=0;i<7;i++) deco.add(stalagmite(rand(x1,x2), rand(0.7,1.2), rand(3.2,4.6)));      // foreground spikes (z>0)
  for(let i=0;i<6;i++) deco.add(stalactite(rand(x1,x2), 9.2, rand(0.7,1.3), rand(-5,-8)));   // hanging teeth
  deco.add(bonePile(-6, 3.4), bonePile(14, 3.6), boneRow(-2, 3.2));
  // QUIET STORY PROP — Granny Wick foreshadowing: a weeping statue off to the side (never signposted)
  deco.add(weepingStatue(-22, 3.6));
  S.add(bakeGroup(deco));
  // ...cradling a glinting SILVER THIMBLE (Gran gives Pip the Thimble the moment Mossgrave is freed)
  const thimble = mesh('cyl',[0.09,0.12,0.16,10], emat(0xe4e8f2, 0xcfe0ff, 1.0)); thimble.position.set(-21.75, 2.35, 3.95); S.add(thimble);

  // ---- crystal light: emissive clusters everywhere (baked) + a few real budgeted PointLights (≤6) ----
  const crys = new THREE.Group();
  for(let i=0;i<9;i++) crys.add(crystalCluster(rand(x1+2,x2-2), rand(-3.5,4.2), rand(0.7,1.3), pick([W2PAL.crystal,W2PAL.crystalV,W2PAL.crystalP])));
  S.add(bakeGroup(crys));
  for(const [lx,col] of [[-16,0x63e6e2],[-2,0xb37dff],[10,0x63e6e2],[20,0x7dff9e]]){
    const l = new THREE.PointLight(col, 34, 18); l.position.set(lx, 3.2, -1.5); S.add(l);   // 4 real lights (boss may add none extra)
  }

  // ---- IN-WORLD HINT sign: a stone tablet carved with the gravedigger's rule ----
  const sign = new THREE.Group();
  const post = mesh('box',[0.16,1.4,0.16], mat(W2PAL.iron)); post.position.y = 0.7;
  const tablet = mesh('box',[1.5,1.0,0.12], mat(W2PAL.stoneL)); tablet.position.y = 1.55; crook(tablet,0.03);
  for(let i=0;i<3;i++){ const line = mesh('box',[1.0,0.07,0.02], emat(W2PAL.crystalP,0x7dff9e,0.6)); line.position.set(0,1.75-i*0.24,0.07); tablet.add(line); }
  sign.add(post, tablet); sign.position.set(-11.5, 0, 2.4); S.add(bakeGroup(sign));

  // ---- walls, spawn, feel wiring (mirrors buildBossArena) ----
  G.world.addBox(-26.5,0,0, 4,12,D, {});
  G.world.addBox( 26.5,0,0, 4,12,D, {});
  G.spawnPoint.set(-14, 0.6, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 6, 28);
  G.amb = w2Ambience(S, x1, x2, 'cave');
  w2Clutter(G, x1, -3, 'catacomb'); w2Clutter(G, 3, x2, 'catacomb');   // skip the centre where the titan roots
  G.lightPools = [];                                                    // D2 contract (no wisps here, but keep it consistent)
  G.boss = new Mossgrave(G);
}

// ============ BOSS 6 — GRUMBLE, THE ABOMINABLE SNOWMAN (Frostmere · Glimmerfields guardian) ============
// A HUGE three-tier snowman (crooked hat, coal eyes burning icy cyan, stick arms, a too-small festive scarf).
// THE FIGHT: stomp him apart TIER BY TIER — and he REBUILDS himself from the arena's snowdrifts between
// phases, with a bigger gimmick each time:
//   PHASE 1 (3 hits) — hop-chases Pip on learnable arcs, ground shudder on every landing; 3 hops → big slam
//                      → dizzy window (stomp the head / spin the body). Top tier bursts → REBUILD spectacle.
//   PHASE 2 (3 hits) — adds SNOWBALL LOBS on a fixed clock (arcing shots, growing target-glow telegraph
//                      for the full 1.15s flight — ≥0.7s, the bombardment language), hops faster.
//   PHASE 3 (4 hits) — adds the ROLLING RING (2 SnowballRollers on fixed crossing tracks) + telegraphed
//                      SpikeIcicle drops from the frost bough + a one-time pair of FrostbitePenguin adds.
// SECRET TAKEDOWN (the speedrun meta): FOUR cold HEARTH-BRAZIERS on the arena rim. Spin one to LIGHT it —
// each lit hearth MELTS a quarter of the loose snow (the drift mounds visibly steam away). All 4 lit and
// Grumble CANNOT REBUILD: his next knockdown skips straight to the FINAL PHASE REMNANT (hp clamped to 2,
// tierless and furious — and with the snow gone there is nothing left to lob or roll, only the icicles).
// Hints: two penguin spectators huddle shivering by the cold western hearth; the sign by the gate reads
// "Snow that never melts only means the fires went out."
// DEFEAT (the series signature — NO death): his last tier pops, the coal eyes fade cyan → warm amber, and
// Pip PATS HIM BACK TOGETHER SMALL (~4s auto-cutscene: the three smallest snowballs restack at 0.9 scale,
// the hat drops on, the scarf finally fits). Then G.onBossDefeated() — district comes from G.bossDistrict.
// G._bossEndT is stamped at the last hit (the w5 idiom) so the pat never pollutes the boss-time record.
//
// ENGINE CONTRACT (mirrors 10_boss1 exactly): G.boss singleton with update(dt), NOT an ents entity. The
// boss runs its OWN stomp/spin detection during the dizzy window (the player's generic stomp/swing loops
// only reach G.ents enemies) and exposes onPlayerPound(pos) — 06_player calls it on every landed pound.
// Boss bar via UI.showBossBar/updateBossBar (10 hit-pips: 3+3+4). Adds/rollers ARE ents (stompable, drop
// candy, cleared on defeat like boss1/boss2). HEARTS-ALWAYS: every attack costs exactly 1 heart.
// DETERMINISM: all clocks fixed-phase from their start; volley spreads are fixed offsets; rand() (seeded
// per area) touches cosmetic jitter only. Difficulty: D3 boss — hotter than Broomhilda's opener, cooler
// than Wraith.

class Grumble {
  constructor(G, opts={}){
    this.G = G;
    this.maxHp = 10; this.hp = 10;          // 3 (P1) + 3 (P2) + 4 (P3) — knockdowns at hp 7 and hp 4
    this.dead = false;
    this.phase = 1;
    this.remnant = false;                    // the brazier shortcut's final form
    this.pos = new THREE.Vector3(9, 0, 0);
    this.vy = 0;
    this.state = 'intro'; this.stateT = 0;
    this.hopCount = 0; this.seq = 0;
    this.vulnerable = false; this.hitCD = 0;
    this.t = 0;
    this.snowballs = [];                     // live lobs {mesh, glow, vx, vy, t, T, tx}
    this.icicles = [];                       // phase-3 SpikeIcicles (ours to freeze on defeat)
    this.rollers = [];                       // phase-3 SnowballRollers (ents, tracked for the melt rule)
    this.drifts = opts.drifts || [];         // the 4 meltable snow mounds (built by the arena)
    this.driftMelt = [];                     // {mesh, t} shrink animations
    this._swingClaimed = false;
    this._signShown = false; this._p3Spawned = false;
    this.buildRig();
    this.buildBraziers();
    this.litCount = 0;
    this.shadow = blobShadow(2.4);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('GRUMBLE, THE ABOMINABLE SNOWMAN', this.hp, this.maxHp); }
    AUDIO.bossRoar();
  }

  buildRig(){
    this.group = new THREE.Group();
    const body = new THREE.Group();
    const snow = emat(0xf0f4ff, 0x8aa4d0, 0.22), snowD = emat(0xd8e2f6, 0x7a94c0, 0.16);
    // ---- three tiers, ~4.5u to the hat ----
    this.tierB = mesh('sph',[1.15,12,10], snow);  this.tierB.position.y = 0.92; this.tierB.scale.set(1.06,0.92,1.06);
    this.tierM = mesh('sph',[0.85,12,10], snowD); this.tierM.position.y = 2.32;
    body.add(this.tierB, this.tierM);
    // coal buttons on the belly
    this.buttons = new THREE.Group();
    for(let i=0;i<3;i++){ const c = mesh('sph',[0.09,5,5], mat(0x1a1a28)); c.position.set(0, 2.05+i*0.42, 0.78); this.buttons.add(c); }
    body.add(this.buttons);
    // ---- the head (its own group — it slumps, bursts, and finally comes back small) ----
    this.headG = new THREE.Group();
    const skull = mesh('sph',[0.62,12,10], snow); this.headG.add(skull);
    this.eyeM = new THREE.MeshLambertMaterial({color:0x14141f, emissive:W6PAL.coldFx, emissiveIntensity:0.5});
    this.eyeL = new THREE.Mesh(geo('sph',0.1,6,6), this.eyeM); this.eyeL.position.set(-0.2,0.12,0.52);
    this.eyeR = new THREE.Mesh(geo('sph',0.1,6,6), this.eyeM); this.eyeR.position.set(0.2,0.12,0.52);
    this.headG.add(this.eyeL, this.eyeR);
    const carrot = mesh('cone',[0.09,0.42,6], emat(0xe8833a,0x9a4f1a,0.3)); carrot.rotation.x=Math.PI/2; carrot.position.set(0,-0.04,0.72); this.headG.add(carrot);
    // grumpy coal mouth — a downturned arc of chips
    for(let i=0;i<4;i++){ const m = mesh('sph',[0.045,4,4], mat(0x1a1a28)); m.position.set(-0.21+i*0.14, -0.26+Math.abs(i-1.5)*0.06, 0.54); this.headG.add(m); }
    // the crooked hat
    this.hat = new THREE.Group();
    const brim = mesh('cyl',[0.56,0.56,0.07,12], mat(0x1e1a2c)); brim.position.y=0.5; this.hat.add(brim);
    const top = mesh('cyl',[0.34,0.38,0.52,12], mat(0x1e1a2c)); top.position.y=0.78; this.hat.add(top);
    const band = mesh('cyl',[0.365,0.395,0.12,12], emat(0xd83a4a,0x8a1e2c,0.3)); band.position.y=0.6; this.hat.add(band);
    this.hat.rotation.z = 0.17;              // crooked — something's off about this one too
    this.headG.add(this.hat);
    this.headLocalY = 3.55;
    this.headG.position.y = this.headLocalY;
    body.add(this.headG);
    // stick arms with twig fingers
    this.armL = new THREE.Group();
    const aL = mesh('cyl',[0.05,0.08,1.7,5], mat(0x4a3826)); aL.rotation.z=1.15; aL.position.set(-1.5,2.6,0); this.armL.add(aL);
    for(const f of [-0.3,0.25]){ const tw = mesh('cyl',[0.025,0.035,0.5,4], mat(0x4a3826)); tw.rotation.z=1.15+f; tw.position.set(-2.2,2.95,0); this.armL.add(tw); }
    this.armR = new THREE.Group();
    const aR = mesh('cyl',[0.05,0.08,1.7,5], mat(0x4a3826)); aR.rotation.z=-1.15; aR.position.set(1.5,2.6,0); this.armR.add(aR);
    for(const f of [-0.25,0.3]){ const tw = mesh('cyl',[0.025,0.035,0.5,4], mat(0x4a3826)); tw.rotation.z=-1.15+f; tw.position.set(2.2,2.95,0); this.armR.add(tw); }
    body.add(this.armL, this.armR);
    // the too-small festive scarf (it does NOT fit — until the ending)
    this.scarf = mesh('tor',[0.5,0.11,6,14], emat(0xd83a4a,0x8a1e2c,0.3)); this.scarf.position.y=3.05; this.scarf.rotation.x=0.18;
    this.scarfTail = mesh('box',[0.2,0.5,0.1], emat(0xd83a4a,0x8a1e2c,0.3)); this.scarfTail.position.set(0.4,2.75,0.3); this.scarfTail.rotation.z=-0.3;
    body.add(this.scarf, this.scarfTail);
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // dizzy stars (hidden until stunned)
    this.stars = new THREE.Group();
    for(let i=0;i<3;i++) this.stars.add(mesh('sph',[0.18,6,5], emat(0xffe66e,0xffe66e,1)));
    this.stars.visible = false;
    this.stars.position.y = 4.9;
    this.group.add(this.stars);
    // intro: he ASSEMBLES from the drifts (teaches the rebuild language before the first knockdown)
    this.body.scale.setScalar(0.12);
  }

  buildBraziers(){
    // four cold hearths on the rim — spin (or pound) beside one to light it; each melts a drift quarter
    const S = this.G.scene;
    this.brazierX = [-17, -6, 6, 17];
    this.braziers = [];
    for(let k=0;k<4;k++){
      const bx = this.brazierX[k];
      const g = new THREE.Group();
      const post = mesh('cyl',[0.16,0.22,1.1,7], mat(W6PAL.woodD)); post.position.y=0.55; g.add(post);
      const bowl = mesh('cyl',[0.55,0.4,0.4,10], mat(0x3a3244)); bowl.position.y=1.25; g.add(bowl);
      for(let i=0;i<3;i++){ const log = mesh('cyl',[0.05,0.05,0.5,4], mat(0x46301f)); log.position.set(0,1.42,0); log.rotation.z=Math.PI/2; log.rotation.y=i*1.05; g.add(log); }
      const snowCap = mesh('sph',[0.28,7,5], mat(W6PAL.snow)); snowCap.scale.y=0.35; snowCap.position.y=1.52; g.add(snowCap);   // the COLD tell: snow ON the hearth
      // clone — emat() is a CACHED factory, and this material's emissiveIntensity animates per-brazier below
      const flame = mesh('sph',[0.26,8,6], emat(0x2a3440, 0x2a3440, 0.35).clone()); flame.position.y=1.62; g.add(flame);
      const halo = new THREE.Mesh(geo('sph',0.8,10,8), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0, depthWrite:false})); halo.position.y=1.62; g.add(halo);
      g.position.set(bx, 0, -0.9); S.add(g);
      this.braziers.push({x:bx, group:g, flame, halo, snowCap, lit:false, light:null});
    }
  }

  _lightBrazier(b, idx){
    if(b.lit) return;
    b.lit = true; this.litCount++;
    b.flame.material = emat(0xffd98a, 0xffb85e, 2);
    b.halo.material.opacity = 0.5;
    b.snowCap.visible = false;
    b.light = new THREE.PointLight(0xffb85e, 30, 13); b.light.position.set(b.x, 2, -0.9); this.G.scene.add(b.light);
    this.G.lightPools && this.G.lightPools.push({x:b.x, z:-0.9, r:6});
    AUDIO.checkpoint && AUDIO.checkpoint();
    this.G.fx.spawn(new THREE.Vector3(b.x, 1.9, -0.9), 0xffb85e, 16, {speed:3, life:0.6});
    this.G.camc.shake(0.2, 0.3);
    // MELT a quarter of the arena's loose snow — the paired drift steams away, visibly
    const drift = this.drifts[idx];
    if(drift){ this.driftMelt.push({mesh:drift, t:0}); this.G.fx.spawn(drift.position.clone().setY(1.2), 0xf0f4ff, 14, {speed:2, life:0.8, gravity:-1}); }
    if(this.litCount>=4){
      window.UI && UI.toast('🔥 Every hearth burns — the arena\'s snow is MELTED! He can\'t rebuild!');
      // no snow, no snowballs: the rolling ring runs out of material too
      for(const r of this.rollers) if(!r.dead){ r.dead = true; if(r.shadow) this.G.scene.remove(r.shadow); this.G.fx.spawn(r.group.position.clone(), 0xf0f4ff, 12, {speed:3, life:0.5}); }
      this.rollers.length = 0;
    } else {
      window.UI && UI.toast(`🔥 The hearth takes the flame — a quarter of the snow steams away! (${this.litCount}/4)`);
    }
  }

  headWorldY(){ return this.pos.y + this.body.position.y + this.headLocalY*this.body.scale.y; }

  onPlayerPound(pos){
    // a pound landing near him while dizzy counts (boss1 parity)
    if(this.vulnerable && Math.hypot(pos.x-this.pos.x, pos.z-this.pos.z) < (this.remnant?3.2:4.0)) this.takeHit();
  }

  takeHit(){
    if(this.dead || !this.vulnerable || this.hitCD>0) return;
    this.hp--;
    this.hitCD = 0.35;                       // one stomp/swing = one hit; the dizzy window allows a second
    AUDIO.bossHit();
    this.G.hitstop = 0.09;
    this.G.camc.shake(0.5, 0.4);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.headWorldY(), this.pos.z), 0xf0f4ff, 18, {speed:5});
    UI.updateBossBar(this.hp);
    if(this.hp<=0){ this.defeat(); return; }
    if(this.hp===7 || this.hp===4){ this._knockdown(); return; }
    UI.toast(pick2([ '⛄ "Grumble!!"', '⛄ "GRUMBLE?!"', '⛄ "...grumble."' ], this.hp));
  }

  _knockdown(){
    // a tier bursts — and either the drifts answer, or (all 4 hearths lit) NOTHING does
    this.vulnerable = false; this.stars.visible = false;
    this.state = 'burst'; this.stateT = 0;
    AUDIO.poundHit();
    this.G.camc.shake(0.6, 0.5);
    const hy = this.headWorldY();
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, hy, this.pos.z), 0xf0f4ff, 30, {speed:6, life:0.7});
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, hy-1.2, this.pos.z), 0xd8e2f6, 18, {speed:4, life:0.6});
    this.headG.visible = false; this.tierM.visible = false; this.buttons.visible = false;
    this.scarf.visible = false; this.scarfTail.visible = false;
    UI.toast('💥 His top tiers BURST apart!');
  }

  _applyPhase(){
    // phase stats in one place (the tuning table)
    const P = this.remnant
      ? {hopVy:9.0, sp:7.8, dizzy:2.6, eyes:1.2}
      : [{hopVy:8.4, sp:5.2, dizzy:4.2, eyes:0.5}, {hopVy:8.7, sp:6.4, dizzy:3.6, eyes:0.8}, {hopVy:9.0, sp:7.2, dizzy:3.0, eyes:1.05}][this.phase-1];
    this.hopVy = P.hopVy; this.chaseSp = P.sp; this.dizzyLen = P.dizzy;
    this.eyeM.emissiveIntensity = P.eyes;
    if(this.phase>=3 && !this.remnant && !this._p3Spawned){
      this._p3Spawned = true;
      // THE ROLLING RING — two SnowballRollers on fixed crossing tracks (lane-world orbit); clocks start now
      const r1 = this.G.ents.add(new SnowballRoller(this.G, -19, 0, 0, {x1:19,  speed:4.2, r0:0.4, r1:1.05, pause:1.5, phase:0}));
      const r2 = this.G.ents.add(new SnowballRoller(this.G,  19, 0, 0, {x1:-19, speed:4.2, r0:0.4, r1:1.05, pause:1.5, phase:5.3}));
      this.rollers.push(r1, r2);
      // icicles under the frost bough — fixed period, staggered phases, the built-in 0.7s target-glow telegraph
      for(let i=0;i<3;i++) this.icicles.push(this.G.ents.add(new SpikeIcicle(this.G, [-9,0,9][i], 7.0, {period:4.6, phase:i*1.55, floorY:0})));
      // the one-time penguin pair (spawnGrace per the clear-patch law — ambushes never bite instantly)
      const pl = this.G.player, px = pl?pl.pos.x:0;
      for(const s of [-1,1]){
        const pg = new FrostbitePenguin(this.G, clamp(px+7*s, -19, 19), 0, 0, {phase:s>0?0.5:0, range:3, dir:s, wakeR:7});
        pg.spawnGrace = 1.0; this.G.ents.add(pg);
      }
    }
  }

  _becomeRemnant(){
    // the shortcut's payoff: no snow to rebuild with — he fights on as what's left, small and furious
    this.remnant = true; this.phase = 3;
    this.hp = Math.min(this.hp, 2); UI.updateBossBar(this.hp);
    this.tierB.visible = false;
    this.tierM.visible = true; this.tierM.position.y = 0.85;
    this.headG.visible = true; this.headG.position.y = 2.05; this.headLocalY = 2.05;
    this.buttons.visible = false;
    this.scarf.visible = true; this.scarf.position.y = 1.55;
    this.scarfTail.visible = true; this.scarfTail.position.set(0.35,1.3,0.3);
    this.armL.position.y = -1.35; this.armR.position.y = -1.35;
    this.stars.position.y = 3.3;
    this._applyPhase();
  }

  _lobVolley(){
    // fixed spreads around the player's x at cast (player-reactive state, zero RNG — the determinism rule)
    const pl = this.G.player; if(!pl) return;
    const offs = this.phase>=3 ? [-3.2, 0, 3.2] : [-1.8, 1.8];
    const sy = this.headWorldY();
    for(const o of offs){
      const tx = clamp(pl.pos.x + o, -20, 20);
      const ball = mesh('sph',[0.42,9,8], emat(0xf0f4ff, 0x8aa4d0, 0.3));
      ball.position.set(this.pos.x, sy, 0);
      // the growing floor target-glow — visible for the FULL flight (1.15s ≥ the 0.7s telegraph law)
      const glow = new THREE.Mesh(geo('circ',0.6,12), new THREE.MeshBasicMaterial({color:W6PAL.coldFx, transparent:true, opacity:0, depthWrite:false}));
      glow.rotation.x = -Math.PI/2; glow.position.set(tx, 0.05, 0);
      this.G.scene.add(ball, glow);
      const T = 1.15;
      this.snowballs.push({mesh:ball, glow, tx, vx:(tx-this.pos.x)/T, vy:0.5*22*T - sy/T, t:0, T});
    }
    AUDIO.noise && AUDIO.noise({t:0.25, vol:0.16, fFrom:400, fTo:900});
  }

  hurtPlayer(n, from){
    const pl = this.G.player;
    if(pl) pl.damage(n, from||this.pos);
  }

  defeat(){
    // THE LAST HIT LANDS — the record stops HERE; the pat-cutscene is a gift, not a timer (the w5 idiom)
    this.G._bossEndT = this.G.runT||0;
    this.dead = true;
    this.state = 'patscene'; this.stateT = 0;
    this.vulnerable = false; this.stars.visible = false;
    AUDIO.victory();
    UI.hideBossBar();
    this.G.hitstop = 0.18;
    // clear every live threat so the celebration can't hurt the player (boss1 parity)
    for(const e of this.G.ents.list){ if(e.isEnemy && !e.dead){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); } }
    for(const ic of this.icicles){ ic.embedded = true; if(ic.glow) ic.glow.material.opacity = 0; if(ic.spike){ ic.spike.visible = true; ic.spike.position.y = ic.hangY - ic.len/2; ic.spike.scale.setScalar(1); } }
    for(const s of this.snowballs){ this.G.scene.remove(s.mesh, s.glow); }
    this.snowballs.length = 0;
    // the last tier pops — everything but the hat, which tumbles down to wait
    const p = this.pos;
    this.G.fx.spawn(new THREE.Vector3(p.x, this.headWorldY(), p.z), 0xf0f4ff, 34, {speed:6, life:0.8});
    this.G.fx.spawn(new THREE.Vector3(p.x, 1, p.z), 0xd8e2f6, 20, {speed:4, life:0.7});
    this.body.visible = false;
    // build the SMALL SNOWMAN, hidden — the pat-scene restacks him ball by ball at 0.9 scale
    const s = 0.9;
    const snow = emat(0xf0f4ff, 0x8aa4d0, 0.22);
    this.small = new THREE.Group();
    this.smallBalls = [];
    const radii = [0.5, 0.36, 0.28], ys = [0.42, 1.0, 1.46];
    for(let i=0;i<3;i++){ const b = mesh('sph',[radii[i]*s,10,9], snow); b.position.y = ys[i]*s; b.scale.setScalar(0.001); this.small.add(b); this.smallBalls.push(b); }
    // the warm face — coal eyes gone AMBER, and a little smile now
    this.smallFace = new THREE.Group();
    for(const e of [-0.09, 0.09]){ const c = mesh('sph',[0.045,5,5], emat(0xffb85e, 0xffb85e, 0.9)); c.position.set(e, 1.53*s, 0.24*s); this.smallFace.add(c); }
    const nose = mesh('cone',[0.04,0.2,5], emat(0xe8833a,0x9a4f1a,0.3)); nose.rotation.x=Math.PI/2; nose.position.set(0, 1.46*s, 0.3*s); this.smallFace.add(nose);
    for(let i=0;i<3;i++){ const m = mesh('sph',[0.025,4,4], mat(0x1a1a28)); m.position.set(-0.06+i*0.06, (1.36-Math.abs(i-1)*0.03)*s, 0.26*s); this.smallFace.add(m); }
    this.smallFace.visible = false; this.small.add(this.smallFace);
    // the hat, falling from where the head burst — it lands beside him, then hops on at the right beat
    this.smallHat = new THREE.Group();
    const brim2 = mesh('cyl',[0.2,0.2,0.05,10], mat(0x1e1a2c)); this.smallHat.add(brim2);
    const top2 = mesh('cyl',[0.12,0.14,0.22,10], mat(0x1e1a2c)); top2.position.y=0.13; this.smallHat.add(top2);
    this.smallHat.position.set(p.x+1.3, this.headWorldY(), 0); this.G.scene.add(this.smallHat);
    this._hatV = 0; this._hatDown = false;
    // the scarf that FINALLY fits
    this.smallScarf = mesh('tor',[0.26*s,0.08,6,12], emat(0xd83a4a,0x8a1e2c,0.3)); this.smallScarf.position.y=1.28*s; this.smallScarf.rotation.x=0.15;
    this.smallScarf.visible = false; this.small.add(this.smallScarf);
    this.small.position.set(clamp(p.x, -19, 19), 0, 0);
    this.G.scene.add(this.small);
    this._doneFired = false; this._stung = false; this._toasted = false;
  }

  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    if(this.hitCD>0) this.hitCD -= dt;
    const G = this.G, pl = G.player;
    const p = this.pos;
    const distToPlayer = pl ? Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) : 99;

    // ---- drift melts (brazier payoff — the mounds visibly steam away) ----
    for(let i=this.driftMelt.length-1;i>=0;i--){
      const m = this.driftMelt[i];
      m.t += dt;
      const k = Math.min(1, m.t/1.5);
      m.mesh.scale.setScalar(1-k*0.86);
      m.mesh.position.y = -k*0.7;
      if((m.t*10|0)%3===0) G.fx.spawn(m.mesh.position.clone().setY(0.8), 0xffffff, 1, {speed:0.8, life:0.6, gravity:-1.5});
      if(k>=1) this.driftMelt.splice(i,1);
    }
    // ---- braziers: spin/pound beside a cold hearth to light it (works in ANY state — downtime is strategy) ----
    if(pl && !pl.dead && !this.dead && (pl.attackT>0 || pl.pounding)){
      for(let i=0;i<this.braziers.length;i++){
        const b = this.braziers[i];
        if(!b.lit && Math.abs(pl.pos.x-b.x)<1.8 && Math.abs(pl.pos.z)<1.9) this._lightBrazier(b, i);
      }
    }
    // cold hearths shimmer faintly icy (the "these are OFF" read)
    for(const b of this.braziers) if(!b.lit) b.flame.material.emissiveIntensity = 0.25+Math.sin(this.t*2.3+b.x)*0.12;
    // ---- the sign by the gate (the secret's in-world hint, once) ----
    if(!this._signShown && pl && pl.pos.x < -18.2 && Math.abs(pl.pos.z)<3){
      this._signShown = true;
      window.UI && UI.toast('🪧 "Snow that never melts only means the fires went out."');
    }
    // one-per-swing guard for the spin hit
    if(pl && pl.attackT<=0) this._swingClaimed = false;

    // face the player (side-view lean, boss1 parity)
    if(pl && this.state!=='patscene'){
      const want = Math.atan2(pl.pos.x-p.x, pl.pos.z-p.z);
      this.group.rotation.y = angleDamp(this.group.rotation.y, want, this.state==='dizzy'?1:4, dt);
    }

    switch(this.state){
      case 'intro': {
        // he ASSEMBLES from the drifts — the rebuild language, taught before it matters
        const k = Math.min(1, this.stateT/1.1);
        this.body.scale.setScalar(0.12+0.88*k);
        if((this.stateT*14|0)!==this._introTick){ this._introTick = this.stateT*14|0;
          for(const d of this.drifts){ const dp = d.position; G.fx.spawn(new THREE.Vector3(lerp(dp.x,p.x,rand(0.3,0.9)), rand(0.5,3), 0), 0xf0f4ff, 1, {speed:1.5, life:0.4}); } }
        if(this.stateT>1.15){ this.state='taunt'; this.stateT=0;
          this.body.scale.setScalar(1);
          G.camc.shake(0.5,0.4);
          UI.dialogue('⛄', '"GRRRUMBLE. Grumble grumble GRUMBLE!!" (No translation available. The tone is unmistakable: this is HIS snow.)');
        }
        break;
      }
      case 'taunt':
        if(this.stateT>1.3){ this.state='hop'; this.stateT=0; this.hopCount=0; this._applyPhase(); }
        break;
      case 'hop': {
        // hop-chase on learnable arcs — 3 hops, then the big slam; ground shudder on every landing
        this.vy -= 22*dt;
        p.y += this.vy*dt;
        if(p.y<=0){
          p.y=0;
          if(this.vy<-1){
            // landed a hop — the shudder
            AUDIO.land();
            G.camc.shake(0.18,0.16);
            G.fx.spawn(new THREE.Vector3(p.x,0.2,p.z), 0xf0f4ff, 7, {speed:2.2, life:0.35});
            this.hopCount++;
            if(this.hopCount>=3){ this.state='slam'; this.stateT=0; this.vy=12.5; AUDIO.bossRoar(); }
            else this.vy = this.hopVy;
          } else if(this.vy===0 && this.stateT>0.1){
            this.vy = this.hopVy;
          }
          if(this.vy>0 && pl){
            const dx=pl.pos.x-p.x, dz=pl.pos.z-p.z, d=Math.hypot(dx,dz)||1;
            const sp = clamp(d*0.85, 2.5, this.chaseSp);
            this.hx=dx/d*sp; this.hz=dz/d*sp;
          }
        } else {
          p.x += (this.hx||0)*dt; p.z += (this.hz||0)*dt;
        }
        p.x = clamp(p.x, -21, 21);
        // squash & lean while airborne
        this.body.rotation.z = clamp(-(this.hx||0)*0.02, -0.12, 0.12);
        // contact damage while hopping (the spec: touchDamage active while hopping)
        if(pl && distToPlayer<(this.remnant?1.9:2.5) && pl.pos.y < p.y+(this.remnant?2.4:3.4)) this.hurtPlayer(1);
        break;
      }
      case 'slam': {
        this.vy -= 30*dt;
        p.y += this.vy*dt;
        if(this.vy>0 && pl){ // track mid-air — the rising arc IS the ≥0.6s telegraph
          const dx=pl.pos.x-p.x, d=Math.abs(dx)||1;
          p.x += Math.sign(dx)*Math.min(d,6.5)*dt*1.5;
          p.x = clamp(p.x, -21, 21);
        }
        if(p.y<=0 && this.vy<0){
          p.y=0;
          AUDIO.poundHit();
          G.camc.shake(0.55,0.45);
          G.fx.spawn(new THREE.Vector3(p.x,0.3,p.z), 0xf0f4ff, 18, {speed:5, life:0.5, gravity:4});
          if(pl && distToPlayer<3.4 && pl.pos.y<1.2) this.hurtPlayer(1);
          this.state='dizzy'; this.stateT=0; this.vulnerable=true;
          this.stars.visible=true;
          UI.toast('⭐ He\'s dizzy! Stomp the head — or spin into him!');
        }
        if(pl && distToPlayer<2.5 && pl.pos.y<p.y+3.4 && this.vy<0) this.hurtPlayer(1);
        break;
      }
      case 'dizzy': {
        // THE window — multiple hits allowed (hitCD spaces them); the boss runs its own stomp/spin detection
        this.body.rotation.z = Math.sin(this.t*2.2)*0.09;
        this.body.position.y = this.remnant ? -0.6 : -1.3;   // slumped so the head is jump-reach
        this.stars.children.forEach((st,i)=>{
          const a = this.t*3+i*(TAU/3);
          st.position.set(Math.cos(a)*1.1, 0, Math.sin(a)*1.1);
        });
        this.stars.position.y = this.headLocalY + this.body.position.y + 1.5;
        if(pl && this.vulnerable){
          const headY = this.headWorldY();
          // stomp on the head
          if(pl.vel.y<0 && distToPlayer<(this.remnant?2.0:2.6) && pl.pos.y>headY-0.7 && pl.pos.y<headY+1.2){
            pl.bounceOff(12);
            AUDIO.stomp();
            this.takeHit();
            break;
          }
          // spin into the body
          if(pl.attackT>0 && !this._swingClaimed && distToPlayer<(this.remnant?2.3:2.9) &&
             Math.abs((pl.pos.y+0.7)-(p.y+this.body.position.y+1.6))<1.9){
            this._swingClaimed = true;
            this.takeHit();
            break;
          }
        }
        if(this.stateT>this.dizzyLen){
          this.state='recover'; this.stateT=0; this.vulnerable=false; this.stars.visible=false;
        }
        break;
      }
      case 'recover':
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        if(this.stateT>0.8){
          this.stateT=0; this.hopCount=0;
          // fixed alternation — never RNG (boss time feeds the leaderboard; the fight must replay identically)
          this.seq++;
          const canLob = this.phase>=2 && !this.remnant;   // no snow left to scoop in the remnant
          if(canLob && this.seq%2===1){ this.state='lob'; this._lobFired=false; }
          else this.state='hop';
        }
        break;
      case 'lob':
        // scoop-and-throw: 0.45s wind-up squash, then the volley (each ball carries its own 1.15s floor glow)
        this.body.scale.y = 1-Math.sin(Math.min(this.stateT/0.45,1)*Math.PI)*0.12;
        if(this.stateT>0.45 && !this._lobFired){ this._lobFired=true; this._lobVolley(); }
        if(this.stateT>1.3){ this.state='hop'; this.stateT=0; this.hopCount=0; this.body.scale.y=1; }
        break;
      case 'burst': {
        // the knocked-down base slumps and shivers
        this.body.position.y = damp(this.body.position.y, -0.4, 8, dt);
        this.body.rotation.z = Math.sin(this.t*9)*0.05;
        if(this.stateT>1.1){
          this.stateT=0;
          if(this.litCount>=4 && !this.remnant){ this.state='meltfail'; AUDIO.noise && AUDIO.noise({t:0.4,vol:0.15,fFrom:600,fTo:150}); }
          else { this.state='rebuild'; AUDIO.bossRoar(); UI.toast('❄️ The drifts answer — snow streams back to him...'); }
        }
        break;
      }
      case 'rebuild': {
        // ~3s vulnerable-free SPECTACLE — snow streams from every unmelted drift as he restacks, bigger trouble
        const k = Math.min(1, this.stateT/3.0);
        if(k>0.25){
          this.tierM.visible = true; this.buttons.visible = true;
          const kk = Math.min(1,(k-0.25)/0.5);
          this.tierM.scale.setScalar(0.001+kk*0.999);
        }
        if(k>0.55){
          this.headG.visible = true; this.scarf.visible = true; this.scarfTail.visible = true;
          const kk = Math.min(1,(k-0.55)/0.4);
          this.headG.scale.setScalar(0.001+kk*0.999);
        }
        this.body.position.y = damp(this.body.position.y, 0, 4, dt);
        if((this.stateT*16|0)!==this._streamTick){ this._streamTick=this.stateT*16|0;
          for(let i=0;i<this.drifts.length;i++){
            if(this.braziers[i] && this.braziers[i].lit) continue;   // melted quarters have nothing to give
            const dp = this.drifts[i].position;
            G.fx.spawn(new THREE.Vector3(lerp(dp.x,p.x,rand(0.25,0.9)), rand(0.5,3.5), 0), 0xf0f4ff, 1, {speed:1.8, life:0.4});
          }
        }
        if(this.stateT>3.0){
          this.state='hop'; this.stateT=0; this.hopCount=0;
          this.tierM.scale.setScalar(1); this.headG.scale.setScalar(1);
          this.phase++;
          this._applyPhase();
          G.camc.shake(0.4,0.4);
          UI.toast(this.phase>=3 ? '⛄ Rebuilt AGAIN — and now the whole arena ROLLS!' : '⛄ Rebuilt — and now he\'s THROWING the snow!');
        }
        break;
      }
      case 'meltfail': {
        // the shortcut lands: he grasps at air where the drifts were... and nothing comes
        this.armL.rotation.z = Math.sin(this.t*7)*0.4;
        this.armR.rotation.z = -Math.sin(this.t*7)*0.4;
        if(this.stateT>0.7 && !this._failToasted){ this._failToasted=true;
          UI.toast('🔥 Nothing answers. The snow is WATER — he can\'t rebuild!'); }
        if(this.stateT>1.5){
          this.state='hop'; this.stateT=0; this.hopCount=0;
          this.armL.rotation.z = 0; this.armR.rotation.z = 0;
          this.body.position.y = 0;
          this._becomeRemnant();
          AUDIO.bossRoar();
          UI.toast('⛄ What\'s left of him is SMALL, FAST, and FURIOUS!');
        }
        break;
      }
      case 'patscene': {
        // THE ENDING — no death, a pat. Runs on the state machine (never setTimeout) so a quit can't strand it.
        const T = this.stateT;
        // the hat tumbles down and waits
        if(!this._hatDown){
          this._hatV -= 18*dt;
          this.smallHat.position.y += this._hatV*dt;
          this.smallHat.rotation.z += dt*3;
          if(this.smallHat.position.y<=0.1){ this.smallHat.position.y=0.1; this.smallHat.rotation.z=0.4; this._hatDown=true; }
        }
        // the three smallest snowballs restack, one warm beat at a time
        const beats = [[1.0,0],[1.6,1],[2.2,2]];
        for(const [bt,i] of beats){
          if(T>bt){ const k=Math.min(1,(T-bt)/0.45); this.smallBalls[i].scale.setScalar(0.001+k*0.999);
            if(k<0.15) G.fx.spawn(this.small.position.clone().setY(this.smallBalls[i].position.y), 0xf0f4ff, 5, {speed:1.6, life:0.4}); }
        }
        if(T>2.5 && !this.smallFace.visible){ this.smallFace.visible = true; }   // amber eyes open
        if(T>2.9 && this._hatDown && !this._hatOn){
          // the hat hops on
          const hk = Math.min(1,(T-2.9)/0.4);
          this.smallHat.position.x = lerp(this.smallHat.position.x, this.small.position.x, hk);
          this.smallHat.position.y = lerp(0.1, 1.62*0.9, hk) + Math.sin(hk*Math.PI)*0.8;
          this.smallHat.rotation.z = lerp(0.4, 0.08, hk);   // still a LITTLE crooked. It's him.
          if(hk>=1) this._hatOn = true;
        }
        if(T>3.3 && !this._stung){
          this._stung = true;
          this.smallScarf.visible = true;                   // the scarf finally fits
          AUDIO.heart && AUDIO.heart();                     // the warm sting
          G.fx.spawn(this.small.position.clone().setY(1.2), 0xffb85e, 14, {speed:2.5, life:0.7});
          candyBurst(G, this.small.position.clone().setY(1), 22);
        }
        if(T>3.6 && !this._toasted){
          this._toasted = true;
          UI.toast('⛄ "grumble." (He means thank you.)');
        }
        if(T>4.4 && !this._doneFired){
          this._doneFired = true;
          G.onBossDefeated();                               // district comes from G.bossDistrict — no arguments
        }
        break;
      }
    }

    // ---- snowball lobs in flight ----
    for(let i=this.snowballs.length-1;i>=0;i--){
      const s = this.snowballs[i];
      s.t += dt;
      s.vy -= 22*dt;
      s.mesh.position.x += s.vx*dt;
      s.mesh.position.y += s.vy*dt;
      s.mesh.rotation.z -= dt*6;
      const k = Math.min(1, s.t/s.T);
      s.glow.material.opacity = k*0.45;                     // the growing target-glow
      s.glow.scale.setScalar(0.6+k*0.9);
      if(s.mesh.position.y<=0.3 && s.vy<0){
        if(pl && Math.abs(pl.pos.x-s.mesh.position.x)<1.35 && Math.abs(pl.pos.z)<1.4 && pl.pos.y<1.1)
          this.hurtPlayer(1, s.mesh.position);
        G.fx.spawn(s.mesh.position, 0xf0f4ff, 9, {speed:3, life:0.4});
        AUDIO.land();
        G.scene.remove(s.mesh, s.glow);
        this.snowballs.splice(i,1);
      }
    }

    // ---- visuals ----
    this.group.position.copy(p);
    this.shadow.visible = !this.dead;
    this.shadow.position.set(p.x, 0.03, p.z);
    this.shadow.scale.setScalar(clamp((this.remnant?0.65:1)-p.y*0.05, 0.35, 1));
    // coal eyes breathe icy cyan — hotter with every phase, flaring while airborne
    if(!this.dead){
      const base = this.remnant?1.2:[0.5,0.8,1.05][this.phase-1];
      this.eyeM.emissiveIntensity = base + (p.y>0.2?0.4:0) + Math.sin(this.t*5)*0.1;
      // the hat never sits right
      this.hat.rotation.z = 0.17+Math.sin(this.t*1.7)*0.03;
    }
  }
}

// deterministic pick from a fixed list by index — toast variety without RNG on the fight path
function pick2(arr, i){ return arr[Math.abs(i)%arr.length]; }

// =============================== ARENA ===============================
function buildBossArena6(G){
  const S = G.scene;
  const x1 = -22, x2 = 22, W = 46, D = 12;
  // ---- the snow bowl: packed-snow floor (deliberately NOT tag:'ice' — a boss deserves honest footing) ----
  const base = mesh('box',[W,1.4,D], mat(W6PAL.snowD)); base.position.set(0,-0.78,0); S.add(base);
  const top = mesh('box',[W,0.16,D+0.2], mat(W6PAL.snow)); top.position.set(0,-0.08,0); S.add(top);
  G.world.addBox(0,-1.4,0, W,1.4,D, {});
  // bowl walls — great drift banks (colliders + baked mounds), nobody gets knocked out of the fight
  G.world.addBox(-24.4,0,0, 4,12,D, {});
  G.world.addBox(24.4,0,0, 4,12,D, {});
  const walls = new THREE.Group();
  for(const s of [-1,1]) for(let i=0;i<3;i++){
    const m = mesh('sph',[rand(2.2,3.4),9,7], mat(i%2?W6PAL.snow:W6PAL.snowD));
    m.position.set(s*(22.6+i*0.9), rand(0.2,1.6+i), rand(-3,2)); m.scale.y=0.75; walls.add(m);
  }
  S.add(bakeGroup(walls));

  w6Parallax(S, x1, x2);

  // ---- festival-light strings sagging overhead (5 shared materials, one twinkle ticker) ----
  const deco = new THREE.Group();
  deco.add(w6LightPost(-21, -1.8, 5), w6LightPost(21, -1.8, 5));
  const L = w6LightsBegin();
  w6String(L, -21, 4.9, -8, 6.3, {z:-1.8});
  w6String(L, -8, 6.3, 8, 6.3, {z:-1.8});
  w6String(L, 8, 6.3, 21, 4.9, {z:-1.8});
  w6LightsFinish(G, L);

  // ---- the FROST BOUGH — an icy arch over the bowl; phase 3's icicles hang from it ----
  const bough = new THREE.Group();
  for(let i=0;i<7;i++){
    const bx = -10.5+i*3.5;
    const seg = mesh('cyl',[0.16,0.22,3.7,6], emat(W6PAL.ice, 0x3a8ec8, 0.25));
    seg.position.set(bx+1.75, 7.25+Math.sin((i+0.5)/7*Math.PI)*0.5, 0);
    seg.rotation.z = Math.PI/2 - Math.cos((i+0.5)/7*Math.PI)*0.16;
    bough.add(seg);
    const frost = mesh('sph',[0.26,6,5], mat(W6PAL.pineSnow)); frost.scale.y=0.5; frost.position.set(bx+1.75, 7.5+Math.sin((i+0.5)/7*Math.PI)*0.5, 0); bough.add(frost);
  }
  deco.add(bough);

  // ---- THE SIGN outside the gate (the hint; the boss toasts its text on approach) ----
  { const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(W6PAL.woodD)); pole.position.set(-20.6,0.7,-1.6);
    const board = mesh('box',[1.6,0.8,0.1], mat(W6PAL.wood)); board.position.set(-20.6,1.5,-1.6); crook(board,0.05);
    const capS = mesh('box',[1.7,0.1,0.16], mat(W6PAL.snow)); capS.position.set(-20.6,1.95,-1.6);
    deco.add(pole, board, capS); }
  S.add(bakeGroup(deco));

  // ---- the 4 MELTABLE DRIFTS (live meshes — the rebuild source AND the brazier payoff; never baked) ----
  const drifts = [];
  for(const dx of [-20.2, -11, 11, 20.2]){
    const g = new THREE.Group();
    const m1 = mesh('sph',[1.7,9,7], mat(W6PAL.snow));  m1.position.set(0,0.25,0);    m1.scale.y=0.62; g.add(m1);
    const m2 = mesh('sph',[1.1,8,6], mat(W6PAL.snowD)); m2.position.set(1.1,0.2,-0.8); m2.scale.y=0.6; g.add(m2);
    const m3 = mesh('sph',[0.7,7,6], mat(W6PAL.snowL)); m3.position.set(-0.9,0.5,-0.5); m3.scale.y=0.7; g.add(m3);
    g.position.set(dx, 0, -2.6);
    S.add(g); drifts.push(g);
  }

  // ---- the shivering penguin spectators (the huddle by the cold western hearth — the living hint) ----
  const specs = [];
  for(const [sx, ry] of [[-18.6, 0.5], [-17.9, -0.4]]){
    const pg = new THREE.Group();
    const tux = emat(0x23283a,0x11141f,0.25), belly = emat(0xf2f5ff,0xaab8d8,0.3);
    const back = mesh('sph',[0.28,9,8], tux); back.scale.set(1,1.25,0.95); back.position.y=0.38; pg.add(back);
    const front = mesh('sph',[0.24,9,8], belly); front.scale.set(1,1.15,0.8); front.position.set(0,0.35,0.1); pg.add(front);
    const hd = mesh('sph',[0.17,8,7], tux); hd.position.y=0.72; pg.add(hd);
    const bk = mesh('cone',[0.05,0.16,5], emat(0xf0913a,0xa05a1a,0.3)); bk.rotation.x=Math.PI/2; bk.position.set(0,0.7,0.2); pg.add(bk);
    const sc = mesh('tor',[0.14,0.05,6,10], emat(pick([0xd83a4a,0x3aa060]),0x8a1e2c,0.25)); sc.position.y=0.58; sc.rotation.x=0.15; pg.add(sc);
    pg.position.set(sx, 0, -2.1); pg.rotation.y = ry;
    S.add(pg); specs.push(pg);
  }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt, G2){ this.t+=dt;
      const warm = G2.boss && G2.boss.braziers && G2.boss.braziers[0].lit;
      for(let i=0;i<specs.length;i++){
        if(warm){ specs[i].position.y = Math.abs(Math.sin(this.t*6+i*1.3))*0.14; specs[i].rotation.z = 0; }   // happy bouncing
        else { specs[i].rotation.z = Math.sin(this.t*22+i*2.1)*0.045; }                                        // the shiver
      } } });

  // themed clutter at the edges only — the fight floor stays clean and readable
  w6Clutter(G, -21.5, -15);
  w6Clutter(G, 15, 21.5);

  // the winter night retint (w6LevelFinish's lines — we don't call it; the boss owns its own lifecycle)
  G.scene.background = new THREE.Color(W6PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W6PAL.fog);

  // lights budget: 0 at rest + up to 4 brazier lights as they're earned = ≤6 always (emissives carry the rest)
  G.spawnPoint.set(-16, 1, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -12;
  G.bats = makeBats(S, 4, 30);
  G.amb = w6Ambience(S, x1, x2);
  w6Aurora(G, x1, x2);
  G.lightPools = G.lightPools || [];
  G.boss = new Grumble(G, {drifts});
}

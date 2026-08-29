// ============ BOSS 4 — Captain Wraith (Ghost Harbor, fought ON the deck of the Salty Phantom) ============
// District 4 guardian. An INTANGIBILITY-PUZZLE-UNDER-FIRE boss. Captain Wraith is a ghost — most of the
// fight he's INTANGIBLE (swings/stomps pass through him) and he CHASES you across the listing deck while
// cannon shells rain from the rigging and Boo-crew ambush from the hatches. You cannot damage the mist.
//
// THE SECRET TAKEDOWN (three-layer boss rule, paid off from the whole district):
//   * BRUTE PATH — you cannot hit him while he's mist; surviving alone never wins.
//   * SECRET — Boos FREEZE when you stare at them (learned all district). SO DOES HE: FACE him (turn toward
//     him) and he locks in place. Use that breathing room to reach the FOUR dark deck lanterns and RELIGHT
//     them (touch each). Light all 4 → his mist BURNS AWAY, he drops SOLID onto the deck, briefly stunned —
//     THEN you hit him (stomp / spin / 💥). 3 hits = freed. Each hit re-scatters the lanterns dark + enrages
//     (faster volleys, more crew, the deck lists harder).
//   * IN-WORLD HINT — the 4 lanterns sit visibly UNLIT; Peg-Leg Polly squawks "he hates the light, squawk!";
//     the player already learned the stare rule on Boo Buccaneers in the levels. Nothing spelled out on UI.
//
// FAIRNESS / DETERMINISM: cannon volleys land on FIXED telegraphed spots on a FIXED clock; crew spawn on a
// fixed cadence; the deck-list is cosmetic. Contact with Wraith costs a heart (with i-frames), never a combo
// death; staring stops his advance so you always have an out. Everything is a pure fn of this.t + fixed
// positions → replays IDENTICALLY (speedrun covenant). rand() (seeded per area) is COSMETIC-only jitter.
//
// ENGINE CONTRACT (mirrors 10_boss1/10b_boss2/10c_boss3): G.boss singleton with update(dt) (reads this.G);
// NOT an ents entity — SELF-DETECTS the player's spin (pl.attackT), stomp (pl.vel.y<0 over him) and pound
// (onPlayerPound(pos) from player.js) during the stun window. Boss bar via UI.showBossBar/updateBossBar/
// hideBossBar; defeat calls G.onBossDefeated(). buildBossArena4 sets G.spawnPoint/world/bats/amb + G.boss.

class CaptainWraith {
  constructor(G){
    this.G = G;
    this.maxHp = 3; this.hp = 3; this.dead = false;
    this.pos = new THREE.Vector3(20, 1.6, 0);    // sweeps in from the right on the intro
    this.driftY = 1.5;                           // hover height while chasing
    this.state = 'intro'; this.stateT = 0; this.t = 0; this.phase = 1;
    this.stared = false; this.driftSpeed = 2.0;
    // ---- the 4 deck lanterns (relight objective) ----
    this.lanternX = [-9, -3.2, 3.2, 9];
    this.lanterns = [];
    this.litCount = 0;
    // ---- stun (exposed) hit window ----
    this.vulnerable = false; this.hitDone = false; this.groundR = 2.3; this.exposeT = 0;
    // ---- ambient hazard clocks ----
    this.nextVolley = 2.2; this.nextCrew = 3.5; this.crew = [];
    // ---- one-shots ----
    this._introDlg = false; this._pollyHint = false; this._exposeHint = false;
    this.buildRig();
    this.buildLanterns();
    this.shadow = blobShadow(1.6);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('Captain Wraith', this.hp, this.maxHp); }
    AUDIO.bossRoar && AUDIO.bossRoar();
  }

  buildRig(){
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    const ghostM = new THREE.MeshLambertMaterial({color:0x8fd8c0, emissive:0x2c6a58, emissiveIntensity:0.6, transparent:true, opacity:0.82});
    this.bodyMat = ghostM;
    // spectral torso tapering to a wispy tail
    const torso = new THREE.Mesh(geo('sph',0.62,12,10), ghostM); torso.scale.set(1,1.25,0.9); torso.position.y=0.9; this.body.add(torso);
    const tail = new THREE.Mesh(geo('cone',0.5,1.1,10), ghostM); tail.rotation.x=Math.PI; tail.position.y=0.1; this.body.add(tail);
    // captain's coat (verdigris) + a big collar
    const coat = mesh('box',[1.0,0.7,0.7], emat(0x2f5a4c,0x18332a,0.4)); coat.position.set(0,0.7,0.02); this.body.add(coat);
    // tricorn hat
    const hat = mesh('cyl',[0.42,0.5,0.28,10], mat(0x22201c)); hat.position.set(0,1.5,0); this.body.add(hat);
    const brim = mesh('cyl',[0.7,0.7,0.06,3], mat(0x1a1814)); brim.position.set(0,1.36,0); brim.rotation.y=Math.PI/6; this.body.add(brim);
    // glowing eyes + a ghostly beard
    this.eyeL = mesh('sph',[0.09,6,6], emat(0xffe14d,0xff8a2a,1)); this.eyeL.position.set(-0.16,1.02,0.5);
    this.eyeR = this.eyeL.clone(); this.eyeR.position.x=0.16; this.body.add(this.eyeL,this.eyeR);
    const beard = new THREE.Mesh(geo('cone',0.26,0.5,7), ghostM); beard.position.set(0,0.72,0.42); beard.rotation.x=0.3; this.body.add(beard);
    // a spectral anchor he swings (also his stun visual)
    this.anchor = mesh('tor',[0.34,0.09,5,10], emat(0x9fb8b0,0x4a6a60,0.4)); this.anchor.position.set(0.85,0.7,0.1); this.body.add(this.anchor);
    this.group.add(this.body);
  }

  buildLanterns(){
    const S = this.G.scene;
    for(const lx of this.lanternX){
      const g = new THREE.Group();
      const post = mesh('cyl',[0.08,0.1,1.4,6], mat(W4PAL.woodD)); post.position.y=0.7;
      const cage = mesh('box',[0.4,0.5,0.4], mat(0x2a2620)); cage.position.y=1.55;
      const flame = mesh('sph',[0.18,8,6], emat(W4PAL.lanternU, W4PAL.lanternU, 0.5)); flame.position.y=1.55;
      const halo = new THREE.Mesh(geo('sph',0.6,10,8), new THREE.MeshBasicMaterial({color:W4PAL.lantern, transparent:true, opacity:0, depthWrite:false})); halo.position.y=1.55;
      g.add(post, cage, flame, halo); g.position.set(lx, 0, -0.6); S.add(g);
      this.lanterns.push({x:lx, group:g, flame, halo, lit:false, light:null});
    }
  }
  _lightLantern(l){
    if(l.lit) return;
    l.lit = true; this.litCount++;
    l.flame.material = emat(0xffffff, W4PAL.lantern, 2);
    l.halo.material.opacity = 0.5;
    // one real PointLight per newly-lit lantern (max 4 — within budget on this deck arena)
    l.light = new THREE.PointLight(W4PAL.lantern, 34, 12); l.light.position.set(l.x, 2.2, -0.6); this.G.scene.add(l.light);
    AUDIO.checkpoint && AUDIO.checkpoint();
    this.G.fx.spawn(new THREE.Vector3(l.x, 1.8, -0.6), W4PAL.lantern, 14, {speed:2.5, gravity:1});
    this.G.camc.shake(0.15, 0.2);
    if(window.UI) UI.toast(this.litCount>=4 ? '🔦 All four lit: his mist BURNS away!' : `🔦 Lantern ${this.litCount}/4. Keep STARING him down and light the rest!`);
  }
  _darkenLanterns(){
    for(const l of this.lanterns){
      if(!l.lit) continue;
      l.lit = false; l.flame.material = emat(W4PAL.lanternU, W4PAL.lanternU, 0.5); l.halo.material.opacity = 0;
      if(l.light){ this.G.scene.remove(l.light); l.light = null; }
    }
    this.litCount = 0;
  }

  hurtPlayer(n){ const pl=this.G.player; if(pl && !pl.dead) pl.damage(n, this.pos); }

  hitBoss(kind){
    if(this.dead || this.hitDone || !this.vulnerable) return;
    this.hitDone = true; this.hp--;
    AUDIO.bossHit && AUDIO.bossHit(); this.G.hitstop = 0.1; this.G.camc.shake(0.55, 0.45);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+1.2, 0), W4PAL.lantern, 24, {speed:6});
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, this.pos.y+1.2, 0), 0xffffff, 12, {speed:4});
    window.UI && UI.updateBossBar(this.hp);
    window.UI && UI.toast(this.hp>0 ? ['', '"My SHIP... my CREW...!"', '"LIGHT? The light went out when the SEA did, little spark!"'][this.hp] : '');
    if(this.hp<=0){ this.defeat(); return; }
    this.phase = this.maxHp - this.hp + 1;
    this.vulnerable = false; this.state = 'enrage'; this.stateT = 0;
    this._darkenLanterns();
  }
  // player ground-pound routes here (player.js) — a pound on the stunned captain counts
  onPlayerPound(pos){
    if(this.state!=='exposed' || this.hitDone || !this.vulnerable || this.dead) return;
    if(Math.hypot(pos.x - this.pos.x, pos.z - this.pos.z) < this.groundR + 0.4) this.hitBoss('pound');
  }

  _fireVolley(){
    // cannon shells rain from the rigging onto FIXED telegraphed spots (denser as phases rise)
    const spots = this.phase>=3 ? [-8,-2,3,9] : (this.phase>=2 ? [-6,0,7] : [-5,4]);
    for(const sx of spots){ this.G.ents.add(new CrabShell(this.G, sx, 9, 0, {targetX:sx, targetY:0, flight:1.1})); }
    AUDIO.noise && AUDIO.noise({t:0.2, vol:0.16, fFrom:800, fTo:200});
  }
  _spawnCrew(){
    if(this.crew.filter(c=>!c.dead).length >= (this.phase>=3?4:this.phase>=2?3:2)) return;
    const sx = this.pos.x + (this.pos.x>0?-6:6);
    const b = new BooBuccaneer(this.G, sx, 1.2, 0, {speed:2.0});
    this.crew.push(b); this.G.ents.add(b);
  }

  defeat(){
    this.dead = true; this.state = 'defeat'; this.stateT = 0; this.vulnerable = false;
    AUDIO.victory && AUDIO.victory();
    window.UI && UI.hideBossBar();
    // clear the crew + in-flight shells so the sea-rushes-back cutscene can't hurt/kill the player
    for(const e of this.G.ents.list){ if(!e.dead && ((typeof BooBuccaneer!=='undefined' && e instanceof BooBuccaneer) || (typeof CrabShell!=='undefined' && e instanceof CrabShell))){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); } }
    for(const l of this.lanterns) if(l.light){ this.G.scene.remove(l.light); l.light=null; }
    // THE SEA RUSHES BACK — a wall of returning glowing water sweeps the arena (the district's relight moment)
    const S = this.G.scene;
    this.flood = new THREE.Mesh(geo('box',60,6,26), new THREE.MeshBasicMaterial({color:W4PAL.water, transparent:true, opacity:0.55}));
    this.flood.position.set(-40, -2, 0); S.add(this.flood);
    this._floodT = 0;
    const p = this.pos;
    candyBurst(this.G, new THREE.Vector3(p.x, p.y+1.2, 0), 26);
    for(let i=0;i<5;i++) setTimeout(()=>{ if(this.G.scene) this.G.fx.spawn(new THREE.Vector3(p.x+rand(-4,4), rand(1,4), 0), pick([W4PAL.water,W4PAL.waterP,0xffffff]), 16, {speed:5}); }, i*260);
    window.UI && UI.toast('🌊 The sea comes RUSHING back! Ghost Harbor breathes again!');
    this.G.onBossDefeated();
  }

  update(dt){
    this.t += dt; this.stateT += dt;
    const G = this.G, pl = G.player, p = this.pos;
    // spectral bob + facing
    this.body.position.y = Math.sin(this.t*2.6)*0.12;
    this.anchor.rotation.z += dt*2;
    // reflect stun-solid vs mist in the material
    this.bodyMat.opacity = damp(this.bodyMat.opacity, this.state==='exposed'?1:0.82, 6, dt);
    this.bodyMat.emissiveIntensity = damp(this.bodyMat.emissiveIntensity, this.state==='exposed'?0.15:0.6, 6, dt);

    // keep lanterns' halos gently pulsing while lit
    for(const l of this.lanterns){ if(l.lit){ l.halo.scale.setScalar(1+Math.sin(this.t*6)*0.12); if(l.light) l.light.intensity = 30+Math.sin(this.t*7)*8; } }

    switch(this.state){
      case 'intro': {
        p.x = damp(p.x, 6, 3, dt); p.y = damp(p.y, this.driftY, 3, dt);
        if(this.stateT>1.2 && !this._introDlg){ this._introDlg=true; G.camc.shake(0.5,0.4);
          window.UI && UI.dialogue('🏴‍☠️', '"Har! Another little tide-treader for my crew? The sea went out with the flame, child... and I\'ll take YOU before I let a single spark near my deck!"'); }
        if(this.stateT>1.4 && !this._pollyHint){ this._pollyHint=true; window.UI && UI.toast('🦜 Peg-Leg Polly squawks: "He HATES the light! Stare him down, light the four! SQUAWK!"'); }
        if(this.stateT>1.6){ this.state='hunt'; this.stateT=0; }
        break;
      }
      case 'hunt': {
        // STARE-LOCK: facing toward him (side-mode facing = last move dir) freezes his advance
        p.y = damp(p.y, this.driftY + Math.sin(this.t*2)*0.15, 5, dt);
        if(pl && !pl.dead){
          const dx = p.x - pl.pos.x, d = Math.abs(dx)||1;
          const pfx = Math.sin(pl.facing);
          const face = pfx * (dx/d);
          this.stared = face > 0.25 && d < 15;
          if(!this.stared){
            p.x += Math.sign(pl.pos.x - p.x) * this.driftSpeed * (this.phase>=3?1.35:this.phase>=2?1.15:1) * dt;
          }
          this.group.rotation.y = (pl.pos.x < p.x) ? -Math.PI/2 : Math.PI/2;
          // cover-eyes hiss when stared
          this.eyeL.scale.setScalar(this.stared?0.3:1); this.eyeR.scale.setScalar(this.stared?0.3:1);
          // contact costs a heart (player i-frames prevent a spiral)
          if(Math.abs(dx) < 0.9 && Math.abs(pl.pos.z) < 1.2 && pl.pos.y < p.y+1.3) this.hurtPlayer(1);
          // relight lanterns on touch
          for(const l of this.lanterns){ if(!l.lit && Math.abs(pl.pos.x - l.x) < 1.7 && Math.abs(pl.pos.z - (-0.6)) < 2.4) this._lightLantern(l); }
        }
        // ambient fire (fixed clocks, scaled by phase) — the "under fire" pressure
        if(this.t >= this.nextVolley){ this.nextVolley += (this.phase>=3?2.4:this.phase>=2?3.0:3.6); this._fireVolley(); }
        if(this.t >= this.nextCrew){ this.nextCrew += (this.phase>=3?5:this.phase>=2?6:7.5); this._spawnCrew(); }
        if(this.litCount>=4){ this.state='exposed'; this.stateT=0; this.vulnerable=true; this.hitDone=false; this.exposeT=(this.phase>=3?3.0:3.6);
          p.y=0.9; G.camc.shake(0.5,0.4); AUDIO.poundHit && AUDIO.poundHit();
          this.G.fx.spawn(new THREE.Vector3(p.x,1.2,0), W4PAL.lantern, 22, {speed:5});
          if(!this._exposeHint){ this._exposeHint=true; window.UI && UI.toast('⭐ He\'s SOLID and DIZZY! HIT him! (stomp / spin / 💥)'); } }
        break;
      }
      case 'exposed': {
        // solid, low, stunned — the hit window
        p.y = damp(p.y, 0.9, 8, dt);
        this.body.rotation.z = Math.sin(this.t*10)*0.12;   // dazed sway
        if(pl && this.vulnerable && !this.hitDone){
          const dxz = Math.hypot(pl.pos.x - p.x, pl.pos.z - p.z);
          const topY = p.y + 1.6;
          if(pl.vel.y < 0 && dxz < this.groundR && pl.pos.y > topY-0.7 && pl.pos.y < topY+1.3){
            pl.bounceOff(pl.pounding ? 13 : 11); this.hitBoss('stomp'); break;
          } else if(pl.attackT > 0 && dxz < this.groundR+0.6 && Math.abs((pl.pos.y+0.7) - (p.y+1.0)) < 1.6){
            this.hitBoss('spin'); break;
          }
        }
        if(this.stateT > this.exposeT){   // window survived — he re-forms as mist and it starts over
          this.vulnerable=false; this.body.rotation.z=0; this._darkenLanterns();
          this.state='hunt'; this.stateT=0;
          window.UI && UI.toast('👻 His mist swirls back together! Light the lanterns again!');
        }
        break;
      }
      case 'enrage': {
        // brief roar after a hit, then back to the hunt (faster)
        p.y = damp(p.y, this.driftY, 6, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        this.eyeL.scale.setScalar(1); this.eyeR.scale.setScalar(1);
        if(this.stateT > 1.0){ this.state='hunt'; this.stateT=0; this.nextVolley=this.t+1.2; this.nextCrew=this.t+2.5; }
        break;
      }
      case 'defeat': {
        // the sea sweeps in
        this._floodT += dt;
        if(this.flood){ this.flood.position.x = damp(this.flood.position.x, 0, 1.6, dt); this.flood.position.y = damp(this.flood.position.y, -0.5, 1.2, dt); }
        this.body.position.y = damp(this.body.position.y, 2.5, 1.5, dt);
        this.bodyMat.opacity = damp(this.bodyMat.opacity, 0.4, 1.5, dt);
        this.group.rotation.z += dt*0.4;
        break;
      }
    }
    this.shadow.visible = this.state!=='defeat';
    if(this.shadow.visible){ const gh=G.world.groundHeight(p.x,0,p.y+0.2); this.shadow.position.set(p.x, gh>-Infinity?gh+0.02:0, 0); }
    this.group.position.set(p.x, p.y, 0);
  }
}

// =============================== ARENA ===============================
function buildBossArena4(G){
  const S = G.scene;
  const x1 = -22, x2 = 22, W = 48, D = 12;
  // ---- the Salty Phantom's DECK: a wide flat weathered-plank floor, lane z=0 (only the volleys/crew are hazards) ----
  const deck = mesh('box',[W,1.4,D], mat(W4PAL.hull)); deck.position.set(0,-0.7,0); S.add(deck);
  const planks = new THREE.Group();
  for(let x=-W/2; x<W/2; x+=1.4){ const pl=mesh('box',[1.2,0.12,D], mat(x%2.8<1.4?W4PAL.hullD:W4PAL.hullL)); pl.position.set(x,0.02,0); planks.add(pl); }
  S.add(bakeGroup(planks));
  G.world.addBox(0,-1.4,0, W,1.4,D, {});
  // containment walls at the deck edges (mirrors boss1/2/3 walled arenas) — the boss knocks Pip around, so
  // the open deck edge must not drop him into the void.
  G.world.addBox(-25, -2, 0, 2, 14, D, {});
  G.world.addBox(25, -2, 0, 2, 14, D, {});

  // ---- harbor parallax + the wrecked-harbor backdrop ----
  w4Parallax(S, x1, x2);

  // ---- baked deco: masts, rigging, a wheel, barrels, coiled rope, the stern rail ----
  const deco = new THREE.Group();
  for(const mx of [-14, 0, 14]){
    const mast = mesh('cyl',[0.3,0.4,10,8], mat(W4PAL.hullD)); mast.position.set(mx, 4.5, -2); deco.add(mast);
    const yard = mesh('box',[6,0.3,0.3], mat(W4PAL.hullD)); yard.position.set(mx, 6.5, -2); deco.add(yard);
    const sail = mesh('box',[5,3,0.1], emat(W4PAL.sailD,W4PAL.sailD,0.15)); sail.position.set(mx, 4.6, -2.2); deco.add(sail);
  }
  // rigging lines fanning from the masts (the wraith-crew's airspace, cosmetic here)
  for(const mx of [-14,0,14]) for(let s=-1;s<=1;s+=2){ const line=mesh('cyl',[0.03,0.03,7,4], mat(W4PAL.rope)); line.position.set(mx+s*2.4, 3.2, -1.8); line.rotation.z=s*0.5; deco.add(line); }
  const wheel = mesh('tor',[0.7,0.09,6,12], mat(W4PAL.woodD)); wheel.position.set(-18,1.4,-1.5); deco.add(wheel);
  for(let i=0;i<6;i++){ const spoke=mesh('cyl',[0.04,0.04,1.5,4], mat(W4PAL.woodD)); spoke.position.set(-18,1.4,-1.5); spoke.rotation.z=i/6*TAU; deco.add(spoke); }
  for(const bx of [-20, 19]){ deco.add(crate(bx, 0, 3.6, 1)); }
  for(let i=0;i<4;i++){ const rope=mesh('tor',[0.2,0.05,4,10], mat(W4PAL.rope)); rope.rotation.x=Math.PI/2; rope.position.set(rand(x1,x2), 0.06, rand(3,4.4)); deco.add(rope); }
  // stern rail (foreground framing z>0)
  const rail = mesh('box',[W,0.14,0.14], mat(W4PAL.woodD)); rail.position.set(0,1.0,4.6); deco.add(rail);
  for(let x=-W/2; x<W/2; x+=2){ const post=mesh('box',[0.12,1.0,0.12], mat(W4PAL.woodD)); post.position.set(x,0.5,4.6); deco.add(post); }
  S.add(bakeGroup(deco));

  // ---- Peg-Leg Polly on a barrel (the hint NPC — deco; her squawk is the toast on intro) ----
  const polly = new THREE.Group();
  const pbody = mesh('sph',[0.22,8,7], emat(0xd8d0c0,0x8a8478,0.3)); pbody.position.y=0.24; polly.add(pbody);
  const phead = mesh('sph',[0.14,7,6], emat(0xd8d0c0,0x8a8478,0.3)); phead.position.set(0.08,0.5,0); polly.add(phead);
  const pbeak = mesh('cone',[0.06,0.16,5], mat(W4PAL.brass)); pbeak.rotation.z=-Math.PI/2; pbeak.position.set(0.24,0.5,0); polly.add(pbeak);
  const ppeg = mesh('cyl',[0.03,0.03,0.24,5], mat(W4PAL.woodD)); ppeg.position.set(0,0.02,0); polly.add(ppeg);
  const peye = mesh('sph',[0.04,5,5], emat(0xffca3a,0xffca3a,1)); peye.position.set(0.14,0.54,0.08); polly.add(peye);
  polly.position.set(21, 1.4, 3.0); S.add(polly);

  // ---- ≤6 real lights: two rigging-lantern glows + the sky moon fill (the 4 deck lanterns light themselves in-fight) ----
  for(const [lx,col] of [[-16, W4PAL.lantern],[16, W4PAL.lantern]]){ const l=new THREE.PointLight(col, 20, 14); l.position.set(lx, 5, -2); S.add(l); }

  // ---- boss lifecycle (switchArea builds the fresh Player AFTER this and spawns it at spawnPoint) ----
  G.spawnPoint.set(-16, 1, 0);
  G.world.killY = -12; G.camMinY = -2;   // physics reads world.killY (G.killY was a no-op → stale kill plane)
  G.bats = makeBats(S, 5, 30);
  G.amb  = w4Ambience(S, x1, x2);
  G.boss = new CaptainWraith(G);
}

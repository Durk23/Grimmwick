// ============ BOSS 7 — URSA MAJOR, THE GREAT WHITE (Frostmere · Frozen Lake Fell guardian) ============
// A COLOSSAL sleepwalking polar bear — the Somnambear the levels taught, at 2.6x scale, nightcap and all.
// HER LAW: she NEVER opens her eyes. Not while fighting, not while stirring, not even beaten — the whole
// fight is a dream she's having, and Pip is just the loudest thing in it.
// THE ARENA: a ~46u ice bowl whose floor is w7CrackLake panels over black water, with 4 grippy snow bergs.
// THE FIGHT'S GENIUS: her own paw-slams call G._bearSlam — THE FLOOR SHATTERS WHERE SHE FIGHTS, refreezing
// on the kit clock, so her attacks strand you BOTH on shrinking ice. She rewrites the arena by dreaming.
//   PHASE 1 (3 hits) — sleep-shuffles after Pip (slow, huge); telegraphed paw SLAMS (0.75s wind, growing
//                      floor target-glow, ≥ the 0.65s floor). After 3 slams she SNORES (2.2s): hit the
//                      NOSE (spin/stomp the snout hitbox — the snout ONLY, she's a mountain) = 1 pip.
//   PHASE 2 (4 hits) — adds the SLEEP-ROLL (0.8s telegraphed curl → she balls up, PolarCub homage, and
//                      rolls an arena lane) + a one-time pair of PolarCub adds. Snore shortens to 1.7s.
//   PHASE 3 (5 hits) — adds DREAM-FISH: 3 spectral fish-wisps on fixed air lanes (unkillable, 1-heart
//                      touch, glowing + full-lane approach = the telegraph); slams come in PAIRS. Snore 1.4s.
// SECRET TAKEDOWN (the speedrun meta): THREE AURORA BELLS on ice pillars around the rim — spin-ring each
// (swing-edge detect, one ring per swing). All 3 rung → THE AURORA BLAZES (ribbon flare + sky flash) and
// she DREAMS DEEP: one 5s snore window where every hit counts DOUBLE (2 pips). Ring the sky, halve the
// fight. Hints: the sign outside the arena — "She always slept best under the lights." — and the penguin
// spectators huddled expectantly by the western bell.
// DEFEAT (the series signature — NO death, and NO waking): eyes STAY closed. She sits up, yawns enormously,
// finds Pip with her NOSE, and gives him one slow approving nose-boop, then bows. ~4.5s cutscene run on the
// state machine (never setTimeout). G._bossEndT is stamped at the last hit (the w5 idiom); the boop is a
// gift, not a timer. Then G.onBossDefeated() once, NO arguments — district comes from G.bossDistrict.
//
// ENGINE CONTRACT (mirrors 10f_boss6 exactly): G.boss singleton with update(dt), NOT an ents entity. Runs
// its OWN stomp/spin detection during the snore window (the player's generic loops only reach ents) and
// exposes onPlayerPound(pos) — 06_player calls it on every landed pound. Boss bar via UI.showBossBar /
// updateBossBar (12 hit-pips: 3+4+5, boundaries at hp 9 and hp 5). Adds (PolarCubs) ARE ents — stompable,
// drop candy, cleared on defeat. HEARTS-ALWAYS: every attack costs exactly 1 heart (slam, roll, fish, cub);
// her sleep-shuffling body is a SOFT WALL, never a hit — the Somnambear language the levels already taught.
// The plunge through shattered ice charges the kit's pit price (heart + lantern walk-back), never a death.
// DETERMINISM: all clocks fixed-phase from their start; slam targets and roll lanes are player-reactive
// state-machine reads captured AT the telegraph (like every boss); rand() (seeded per area) is cosmetic only.
// DIFFICULTY (OWNER CALL, Sept 2026): BEYOND-D5 — the hardest guardian alongside Grumble, one notch under
// a finale. Pressure comes from the SHRINKING FLOOR, never damage sponges.
// THREAT BUDGET: ≤4 simultaneous threats at any instant, pinned per phase —
//   P1: bear action (slams serialize through one body) = 1.
//   P2: bear action 1 + 2 PolarCubs = 3. (Cubs are RETIRED at P3 entry so budgets never stack.)
//   P3: bear action 1 + dream-fish ≤2 + the refreezing floor (self-caused, positional) 1 = 4.
//       Fish math: period 7.5s, traversal 52u/12u·s = 4.33s, entry delays 0.9/3.5/6.1 (gaps 2.6s) →
//       actives [0.9–5.23] [3.5–7.83] [6.1–10.43]: pairwise overlaps only, NO triple intersection. ≤2. ∎

class UrsaMajor {
  constructor(G, opts={}){
    this.G = G;
    this.maxHp = 12; this.hp = 12;           // 3 (P1) + 4 (P2) + 5 (P3) — stirs at hp 9 and hp 5
    this.dead = false;
    this.phase = 1;
    this.pos = new THREE.Vector3(13, 0, 0);
    this.state = 'intro'; this.stateT = 0;
    this.t = 0;
    this.facing = -1;                        // she enters dreaming her way toward the west shore
    this.vulnerable = false; this.hitCD = 0;
    this.deep = false;                       // the aurora's 5s double-pip window
    this.deepUsed = false; this._deepQueued = false;
    this.queue = [];                         // the phase's fixed action rotation (refilled each cycle)
    this.shuffleT = 0;
    this.fish = [];                          // phase-3 DreamFish (ours — spectral, not ents)
    this.cubs = [];                          // phase-2 PolarCub adds (ents, tracked for the P3 retirement)
    this.panels = opts.panels || [];         // the CrackLake floor (defeat calms it panel by panel)
    this._swingClaimed = false;
    this._signShown = false; this._snoreToasted = false; this._curlToasted = false;
    this.bellCount = 0; this._blazed = false;
    this.buildRig();
    this.buildBells();
    this.buildBlaze();
    this._nv = new THREE.Vector3();          // reusable snout-world scratch
    this.shadow = blobShadow(3.4);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('URSA MAJOR, THE GREAT WHITE', this.hp, this.maxHp); }
    AUDIO.bossRoar();                        // heard through the ice, it's just a very big snore
  }

  buildRig(){
    // the Somnambear vocabulary at 2.6x — same silhouette the levels taught, now weather-sized.
    // Rig forward = LOCAL +X; group.rotation.y flips 0/π so she reads in clean side profile.
    this.group = new THREE.Group();
    const body = new THREE.Group();
    const fur = emat(0xf6f4ee, 0x9aa4c0, 0.18), furD = emat(0xdcd8cc, 0x8a94b0, 0.14);
    const torso = mesh('sph',[2.7,14,12], fur); torso.scale.set(1.35,1,1); torso.position.y = 2.7; body.add(torso);
    const rump = mesh('sph',[2.2,12,10], furD); rump.position.set(-2.3,2.55,0); body.add(rump);
    // ---- the head (droops in dream, settles for the snore, boops at the end) ----
    this.headG = new THREE.Group();
    const skull = mesh('sph',[1.45,12,10], fur); this.headG.add(skull);
    const snout = mesh('sph',[0.8,10,8], furD); snout.scale.set(1.2,0.8,1); snout.position.set(1.1,-0.25,0); this.headG.add(snout);
    // THE NOSE — the only place she can be hit; it gets its own material so the snore window can glow it
    this.noseM = new THREE.MeshLambertMaterial({color:0x1a1a28, emissive:0x7ae8ff, emissiveIntensity:0});
    this.nose = new THREE.Mesh(geo('sph',0.34,8,7), this.noseM); this.nose.position.set(1.75,-0.2,0); this.headG.add(this.nose);
    this.noseHalo = new THREE.Mesh(geo('sph',0.85,10,8), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0, depthWrite:false}));
    this.noseHalo.position.copy(this.nose.position); this.headG.add(this.noseHalo);
    for(const s of [-1,1]){ const ear = mesh('sph',[0.37,7,6], furD); ear.position.set(-0.26,1.25,s*0.9); this.headG.add(ear); }
    // eyes SHUT — two sleeping arcs. THEY NEVER OPEN. (Even beaten she swings blind — that's the law.)
    for(const s of [-1,1]){ const lid = mesh('tor',[0.24,0.05,4,10,Math.PI], mat(0x2a2a38)); lid.position.set(1.0,0.37,s*0.57); lid.rotation.x=Math.PI/2; lid.rotation.z=Math.PI; this.headG.add(lid); }
    // THE NIGHTCAP (cute-spooky bar, 2.6x) — striped, pommed, entirely too small for a mountain
    const cap = mesh('cone',[1.05,1.7,10], emat(0x6a4a9e,0x3a2a5e,0.25)); cap.position.set(-0.15,1.75,0); cap.rotation.z=0.5; this.headG.add(cap);
    const capBand = mesh('tor',[0.82,0.14,6,14], emat(0xd83a4a,0x8a1e2c,0.3)); capBand.position.set(-0.02,1.32,0); capBand.rotation.x=Math.PI/2; capBand.rotation.z=0.5; this.headG.add(capBand);
    this.pom = mesh('sph',[0.34,7,6], mat(0xf0e6c8)); this.pom.position.set(-1.1,2.4,0); this.headG.add(this.pom);
    this.headHomeY = 3.9;
    this.headG.position.set(3.5, this.headHomeY, 0);
    body.add(this.headG);
    // ---- legs: rear pair fixed, front pair pivoted at the shoulder (the near-front leg IS the slam paw) ----
    this.legs = []; this.pawG = null;
    for(const [lx,lz,front] of [[1.8,1.15,true],[1.8,-1.15,true],[-1.8,1.15,false],[-1.8,-1.15,false]]){
      const lg = new THREE.Group(); lg.position.set(lx,2.5,lz);
      const bone = mesh('cyl',[0.55,0.66,2.5,8], fur); bone.position.y = -1.25; lg.add(bone);
      const paw = mesh('sph',[0.72,8,7], furD); paw.scale.y=0.6; paw.position.y = -2.45; lg.add(paw);
      body.add(lg); this.legs.push(lg);
      if(front && lz>0) this.pawG = lg;      // the camera-side foreleg throws the slams
    }
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // snore flakes — three drifting spirit-Zs, boss-sized (visible whenever she dreams, which is ALWAYS)
    this.zs = [];
    for(let i=0;i<3;i++){ const zz = mesh('sph',[0.16,6,5], emat(0x7ae8ff,0x7ae8ff,0.8)); this.group.add(zz); this.zs.push(zz); }
    // ---- THE SLEEP-ROLL BALL (hidden until she curls) — the PolarCub homage at weather scale ----
    this.ballG = new THREE.Group();
    const ball = mesh('sph',[2.2,14,12], emat(0xf6f4ee,0x9aa4c0,0.2)); this.ballG.add(ball);
    const bSnout = mesh('sph',[0.55,8,7], furD); bSnout.position.set(0,0,1.9); ball.add(bSnout);
    const bNose = mesh('sph',[0.24,6,5], mat(0x1a1a28)); bNose.position.set(0,0,2.3); ball.add(bNose);
    for(const s of [-1,1]){ const bEar = mesh('sph',[0.36,6,5], furD); bEar.position.set(s*1.1,1.7,0.9); ball.add(bEar);
      const bPaw = mesh('sph',[0.42,6,5], furD); bPaw.position.set(s*1.2,-1.2,1.2); ball.add(bPaw); }
    const bCap = mesh('cone',[0.8,1.3,9], emat(0x6a4a9e,0x3a2a5e,0.25)); bCap.position.set(0,2.0,0); bCap.rotation.z=0.5; ball.add(bCap);
    this.ball = ball;
    this.ballG.visible = false;
    this.group.add(this.ballG);
    // ---- the slam target-glow (reused every wind — grows for the FULL telegraph, the bombardment language) ----
    this.slamGlow = new THREE.Mesh(geo('circ',1.1,14), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0, depthWrite:false}));
    this.slamGlow.rotation.x = -Math.PI/2; this.slamGlow.position.y = 0.06;
    this.G.scene.add(this.slamGlow);
  }

  buildBells(){
    // THREE AURORA BELLS on ice pillars around the rim — swing-edge ring detect (one ring per swing, the
    // W6Lantern spin-beside verb with the BellBuoy's edge discipline). All 3 = the deep dream.
    const S = this.G.scene;
    this.bells = [];
    for(const bx of [-20.2, 2.2, 20.2]){
      const g = new THREE.Group();
      const pillar = new THREE.Mesh(geo('cyl',0.32,0.42,1.5,8), new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.2, transparent:true, opacity:0.85}));
      pillar.position.y = 0.75; g.add(pillar);
      const capS = mesh('sph',[0.42,7,5], mat(W6PAL.snow)); capS.scale.y=0.4; capS.position.y=1.52; g.add(capS);
      const bell = mesh('cone',[0.5,0.85,10], emat(W7PAL.brass, W7PAL.brassD, 0.45)); bell.position.y=2.05; g.add(bell);
      const clap = mesh('sph',[0.12,6,5], mat(0x2a3048)); clap.position.y=1.68; g.add(clap);
      // the cold tell above each silent bell — a faint aurora-green wisp (never purple; purple is warp language)
      const wisp = new THREE.Mesh(geo('sph',0.2,7,6), new THREE.MeshBasicMaterial({color:0x63f2b8, transparent:true, opacity:0.4, depthWrite:false}));
      wisp.position.y = 2.9; g.add(wisp);
      g.position.set(bx, 0, -1.3); S.add(g);
      this.bells.push({x:bx, group:g, bell, wisp, rung:false, ringT:0});
    }
    this._ringWas = false;
  }

  buildBlaze(){
    // the aurora's answer — three ribbon flares layered additively over the kit aurora + one sky flash.
    // (w6Aurora's own ticker owns its ribbons' opacity every frame, so the blaze gets its OWN planes.)
    const S = this.G.scene;
    this.blazeRibbons = [];
    for(let i=0;i<3;i++){
      const rb = new THREE.Mesh(new THREE.PlaneGeometry(78, 4.2+i*1.6, 1, 1),
        new THREE.MeshBasicMaterial({color:W6PAL.aurora[i], transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
      rb.position.set((i-1)*10, 15.5+i*2.5, -29.2);
      rb.rotation.z = (1-i)*0.06;
      S.add(rb); this.blazeRibbons.push(rb);
    }
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(140, 60, 1, 1),
      new THREE.MeshBasicMaterial({color:0xbfffe0, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
    this.flash.position.set(0, 18, -29.4);
    S.add(this.flash);
    this.blazeK = 0; this.blazeTarget = 0; this.flashT = 0;
  }

  snoutWorld(){ this.nose.getWorldPosition(this._nv); return this._nv; }

  onPlayerPound(pos){
    // a pound landing on/near the SNOUT during the snore counts (boss1 parity, nose-only discipline)
    if(!this.vulnerable) return;
    const nv = this.snoutWorld();
    if(Math.hypot(pos.x-nv.x, pos.z-nv.z) < 2.8 && Math.abs(pos.y-nv.y) < 2.2) this.takeHit();
  }

  takeHit(){
    if(this.dead || !this.vulnerable || this.hitCD>0) return;
    const was = this.hp;
    this.hp = Math.max(0, this.hp - (this.deep?2:1));   // the deep dream doubles every pip — the bells' payoff
    this.hitCD = 0.55;
    AUDIO.bossHit();
    this.G.hitstop = this.deep ? 0.12 : 0.09;
    this.G.camc.shake(0.5, 0.4);
    const nv = this.snoutWorld();
    this.G.fx.spawn(new THREE.Vector3(nv.x, nv.y, nv.z), this.deep?0x63f2b8:0xf0f4ff, this.deep?26:16, {speed:5});
    UI.updateBossBar(this.hp);
    if(this.hp<=0){ this.defeat(); return; }
    if(was>9 && this.hp<=9){ this._stir(2); return; }
    if(was>5 && this.hp<=5){ this._stir(3); return; }
    UI.toast(pick2([ '🐻‍❄️ "...zzz?"', '🐻‍❄️ "...mmf."', '🐻‍❄️ (She swats at the dream.)' ], this.hp));
  }

  _applyPhase(){
    // the tuning table, one place. BEYOND-D5 TUNE: she stays SLOW (a mountain never sprints — the shrinking
    // floor is the pressure), the windows shrink instead. All winds ≥ the 0.65s telegraph floor; wind2 is
    // the paired slam's re-aim (0.65 exactly, the razor's edge of legal). Snore 2.2→1.7→1.4.
    // actions = the FIXED rotation per cycle — never RNG (the determinism rule; her time feeds the boards).
    const P = [
      {sp:1.7, wind:0.75, wind2:0,    snore:2.2, actions:['slam','slam','slam']},
      {sp:2.1, wind:0.70, wind2:0,    snore:1.7, actions:['slam','roll','slam']},
      {sp:2.4, wind:0.70, wind2:0.65, snore:1.4, actions:['slam2','roll','slam2']},
    ][this.phase-1];
    this.chaseSp = P.sp; this.windLen = P.wind; this.wind2Len = P.wind2; this.snoreLen = P.snore;
    this.actions = P.actions;
    this.queue = this.actions.slice();
  }

  _stir(phase){
    // a phase boundary — she STIRS (rises, shudders, snores like thunder) but NEVER wakes, never falls:
    // no knockdown-rebuild here. The dream just gets bigger.
    this.phase = phase;
    this.vulnerable = false; this.deep = false;
    this.noseM.emissiveIntensity = 0; this.noseHalo.material.opacity = 0;
    this._stirY0 = this.body.position.y;     // she stirs FROM the snore slump — no pose pop
    this.state = 'stir'; this.stateT = 0;
    AUDIO.bossRoar();
    this.G.camc.shake(0.55, 0.5);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, 5.5, 0), 0x7ae8ff, 22, {speed:4, life:0.7});
  }

  _stirDone(){
    this._applyPhase();
    if(this.phase===2 && !this._cubsSpawned){
      this._cubsSpawned = true;
      // the one-time cub pair — fixed crossing lanes, spawnGrace per the clear-patch law (never a cheap hit).
      // P2 budget: bear 1 + cubs 2 = 3 ≤ 4.
      const c1 = new PolarCub(this.G, -19, 0, 0, {x1:19,  speed:4.4, pause:1.4, phase:0});
      const c2 = new PolarCub(this.G,  19, 0, 0, {x1:-19, speed:4.4, pause:1.4, phase:2.6});
      c1.spawnGrace = 1.0; c2.spawnGrace = 1.0;
      this.cubs.push(this.G.ents.add(c1), this.G.ents.add(c2));
      UI.toast('🐻‍❄️ She stirs — and the dream rolls WITH her! (Cubs!)');
    } else if(this.phase===3){
      // RETIRE surviving cubs before the fish clock in — the ≤4 budget is enforced, not hoped for
      for(const c of this.cubs) if(!c.dead){ c.dead = true; if(c.shadow) this.G.scene.remove(c.shadow); this.G.fx.spawn(c.group.position.clone(), 0xf6f4ee, 10, {speed:3, life:0.5}); }
      this.cubs.length = 0;
      if(!this._fishSpawned){
        this._fishSpawned = true;
        // DREAM-FISH — 3 fixed air lanes, clocks fixed from THIS instant (boss6's P3-spawn precedent).
        // period 7.5 / traversal 4.33 / delays 0.9, 3.5, 6.1 → never more than 2 in the air (see header ∎).
        // Lanes: y0.9 = hop it · y1.8 = stay grounded (clips jumps) · y2.6 = high lane, safe standing.
        this.fish.push(this.G.ents.add(new DreamFish(this.G, {y:0.9, x0:-26, x1:26, speed:12, period:7.5, delay:0.9})));
        this.fish.push(this.G.ents.add(new DreamFish(this.G, {y:2.6, x0:26, x1:-26, speed:12, period:7.5, delay:3.5})));
        this.fish.push(this.G.ents.add(new DreamFish(this.G, {y:1.8, x0:-26, x1:26, speed:12, period:7.5, delay:6.1})));
      }
      UI.toast('🐻‍❄️ The dream goes DEEP — dream-fish fill the night air!');
    }
    this.state = 'shuffle'; this.stateT = 0; this.shuffleT = 0;
  }

  _ringBell(b, idx){
    if(b.rung || this.deepUsed) return;
    b.rung = true; b.ringT = 0.001; this.bellCount++;
    b.wisp.visible = false;
    b.bell.material = emat(0xffd98a, 0xb08a3a, 1.1);
    AUDIO.tone && AUDIO.tone({f:[660,880,1174][this.bellCount-1], f2:520, type:'sine', t:0.6, vol:0.18});
    this.G.fx.spawn(new THREE.Vector3(b.x, 2.2, -1.3), 0x63f2b8, 14, {speed:2.5, life:0.7});
    this.G.camc.shake(0.15, 0.25);
    if(this.bellCount>=3){
      this._blazed = true; this._deepQueued = true;
      this.blazeTarget = 1; this.flashT = 0.6;
      AUDIO.goldPumpkin && AUDIO.goldPumpkin();
      UI.toast('🌌 ALL THREE BELLS — THE AURORA BLAZES!');
    } else {
      this.blazeTarget = this.bellCount*0.14;
      UI.toast(this.bellCount===1 ? '🔔 The bell hums into the sky... the lights stir.' : '🔔 Two bells — the aurora leans closer...');
    }
  }

  _enterSnore(){
    // settle → snore. If the bells have spoken, THIS window is the deep dream: 5s, every hit double.
    this.state = 'snore'; this.stateT = 0; this.vulnerable = true;
    this._swingClaimed = true;               // a swing already in flight never claims the fresh window
    if(this._deepQueued && !this.deepUsed){
      this._deepQueued = false; this.deepUsed = true; this.deep = true;
      this.snoreNow = 5.0;
      AUDIO.heart && AUDIO.heart();
      UI.toast('🌌 She dreams DEEP under the blazing lights — every hit counts DOUBLE!');
    } else {
      this.deep = false;
      this.snoreNow = this.snoreLen;
      if(!this._snoreToasted){ this._snoreToasted = true; UI.toast('💤 She SNORES — hit her NOSE! (Only the nose. She\'s a mountain.)'); }
    }
    AUDIO.noise && AUDIO.noise({t:0.6, vol:0.14, fFrom:110, fTo:55});   // thunder, but cozy
  }

  _beginAction(){
    const act = this.queue.shift();
    const pl = this.G.player;
    if(act==='slam' || act==='slam2'){
      this._pair = (act==='slam2'); this._pairDone = false;
      // target captured AT the telegraph, then FIXED — the glow never lies (bombardment language)
      this._tx = clamp(pl ? pl.pos.x : this.pos.x, Math.max(-21, this.pos.x-6.5), Math.min(21, this.pos.x+6.5));
      this._windNow = this.windLen;
      this.state = 'wind'; this.stateT = 0;
    } else { // roll
      this._rollDir = pl ? (Math.sign(pl.pos.x-this.pos.x)||this.facing) : this.facing;
      this.state = 'curl'; this.stateT = 0;
      AUDIO.noise && AUDIO.noise({t:0.5, vol:0.13, fFrom:200, fTo:80});
      if(!this._curlToasted){ this._curlToasted = true; UI.toast('🐻‍❄️ She curls up — CLEAR THE LANE!'); }
    }
  }

  _slamImpact(){
    const G = this.G, tx = this._tx;
    AUDIO.poundHit();
    G.camc.shake(0.6, 0.5);
    G.fx.spawn(new THREE.Vector3(tx, 0.4, 0), 0xcfe4f4, 18, {speed:5, life:0.5, gravity:4});
    G.fx.spawn(new THREE.Vector3(tx, 0.2, 0), 0xf0f4ff, 10, {speed:3, life:0.4});
    this.slamGlow.material.opacity = 0;
    // THE ARENA ANSWERS — her slam shatters the lake where it lands (the kit refreezes it on its own clock)
    if(G._bearSlam) G._bearSlam(tx, 3.5);
    const pl = G.player;
    if(pl && !pl.dead && Math.abs(pl.pos.x-tx)<2.3 && Math.abs(pl.pos.z)<1.8 && pl.pos.y<1.5) this.hurtPlayer(1, new THREE.Vector3(tx,0.5,0));
  }

  hurtPlayer(n, from){
    const pl = this.G.player;
    if(pl) pl.damage(n, from||this.pos);
  }

  defeat(){
    // THE LAST HIT LANDS — the record stops HERE; the boop is a gift, not a timer (the w5 idiom)
    this.G._bossEndT = this.G.runT||0;
    this.dead = true;
    this.state = 'boopscene'; this.stateT = 0;
    this.vulnerable = false; this.deep = false;
    this.noseM.emissiveIntensity = 0; this.noseHalo.material.opacity = 0;
    this.slamGlow.material.opacity = 0;
    this.ballG.visible = false; this.body.visible = true;
    AUDIO.victory();
    UI.hideBossBar();
    this.G.hitstop = 0.18;
    // clear every live threat so the celebration can't hurt the player (boss1 parity)
    for(const e of this.G.ents.list){ if(e.isEnemy && !e.dead){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); } }
    for(const f of this.fish){ f.retired = true; f.group.visible = false; }
    // the sky keeps whatever the bells earned, plus a warm settling glow for the ending
    this.blazeTarget = Math.max(this.blazeTarget, 0.35);
    this._boopDone = false; this._yawned = false; this._booped = false; this._bowed = false; this._toasted = false; this._doneFired = false;
  }

  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    if(this.hitCD>0) this.hitCD -= dt;
    const G = this.G, pl = G.player;
    const p = this.pos;

    // ---- the aurora blaze (bells → ribbons; runs in every state, defeat included) ----
    this.blazeK = damp(this.blazeK, this.blazeTarget, 2.5, dt);
    for(let i=0;i<this.blazeRibbons.length;i++){
      const rb = this.blazeRibbons[i];
      rb.material.opacity = this.blazeK*(0.24 + Math.sin(this.t*1.3+i*2.1)*0.08);
      rb.position.y = 15.5+i*2.5 + Math.sin(this.t*0.4+i)*0.9;
    }
    if(this.flashT>0){ this.flashT -= dt; this.flash.material.opacity = Math.max(0,this.flashT)*0.55; }
    // the deep window ends → the sky eases back to a keepsake glow (brighter than it started, forever)
    if(this.deepUsed && !this.deep && !this.dead && this.blazeTarget>0.4) this.blazeTarget = 0.35;

    // ---- bells: swing-edge ring detect (one ring per swing — deliberate, never a drive-by) ----
    const hitting = pl && !pl.dead && (pl.attackT>0 || pl.pounding);
    if(hitting && !this._ringWas && !this.dead){
      for(let i=0;i<this.bells.length;i++){
        const b = this.bells[i];
        if(!b.rung && Math.abs(pl.pos.x-b.x)<2.0 && Math.abs(pl.pos.z)<1.9) this._ringBell(b, i);
      }
    }
    this._ringWas = !!hitting;
    for(const b of this.bells){
      if(b.ringT>0){ b.ringT += dt; b.bell.rotation.z = Math.sin(b.ringT*14)*0.4*Math.max(0,1-b.ringT*0.7); if(b.ringT>1.6) b.ringT = 0; }
      if(!b.rung) b.wisp.material.opacity = 0.28+Math.sin(this.t*2.2+b.x)*0.14;   // the cold tell breathes
    }
    // the deep dream queues in from ANY interruptible state (mid-slam/roll it waits for the action's end)
    if(this._deepQueued && !this.deepUsed && !this.dead){
      if(this.state==='shuffle'){ this.state='settle'; this.stateT=0; }
      else if(this.state==='snore'){ this._enterSnore(); }   // upgrade the open window on the spot
    }

    // ---- the sign outside the gate (the secret's in-world hint, once) ----
    if(!this._signShown && pl && pl.pos.x < -18.8 && Math.abs(pl.pos.z)<3){
      this._signShown = true;
      window.UI && UI.toast('🪧 "She always slept best under the lights."');
    }
    // one-per-swing guard for the spin hit
    if(pl && pl.attackT<=0) this._swingClaimed = false;

    // ---- facing (side-profile flip; she only re-aims while shuffling — mid-action she commits) ----
    if(pl && (this.state==='shuffle' || this.state==='intro' || this.state==='dream')){
      const wantF = this.state==='intro' ? -1 : (Math.sign(pl.pos.x-p.x)||this.facing);
      this.facing = wantF;
    }
    this.group.rotation.y = angleDamp(this.group.rotation.y, this.facing>0?0:Math.PI, this.state==='boopscene'?2.5:4, dt);

    // ---- the snore Zs (she is ALWAYS asleep — they only hide while she's balled up) ----
    const zOn = this.state!=='roll' && this.state!=='curl' && this.state!=='unroll';
    const zBig = (this.state==='snore') ? (this.deep?2.0:1.4) : 1;
    for(let i=0;i<this.zs.length;i++){
      const z = this.zs[i]; z.visible = zOn;
      if(zOn){ const k = ((this.t*0.45+i/3)%1);
        z.position.set((4.2+k*1.6)*this.facing, 5.2+k*2.2, Math.sin(k*9)*0.4);
        z.scale.setScalar((0.6+k*0.9)*zBig); }
    }

    switch(this.state){
      case 'intro': {
        // she's ALREADY HERE, mid-dream, shuffling the ice like she owns it (she does; she's asleep on it)
        p.x -= 1.4*dt;
        this._shuffleAnim(dt, 0.8);
        if(this.stateT>1.4){
          this.state='dream'; this.stateT=0;
          UI.dialogue('🐻‍❄️', '"Zzzzz... zzz... ZZZ." (The snore rolls across the lake like weather. She has no idea you\'re here. She will fight you anyway — in her sleep.)');
        }
        break;
      }
      case 'dream':
        this._shuffleAnim(dt, 0.4);
        if(this.stateT>1.3){ this._applyPhase(); this.state='shuffle'; this.stateT=0; this.shuffleT=0; }
        break;
      case 'shuffle': {
        // the sleep-shuffle: slow, huge, inevitable. Her body is a SOFT WALL (Somnambear law) — the paw
        // is the attack; contact just... moves you. Politely. Like furniture.
        this.shuffleT += dt;
        if(pl){
          const dx = pl.pos.x-p.x;
          if(Math.abs(dx)>1.2) p.x += Math.sign(dx)*this.chaseSp*dt;
          p.x = clamp(p.x, -19.5, 19.5);
          // the soft wall
          const d = pl.pos.x-p.x;
          if(Math.abs(d)<3.2 && Math.abs(pl.pos.z)<2.0 && pl.pos.y<4.2){
            pl.pos.x += (Math.sign(d)||this.facing*-1)*(3.2-Math.abs(d))*dt*5;
          }
        }
        this._shuffleAnim(dt, 1);
        // action trigger: in paw range, or she's shuffled long enough (she never stalls; kiting is not a win)
        if(this.shuffleT>0.6 && pl && (Math.abs(pl.pos.x-p.x)<6.4 || this.shuffleT>4)){
          if(this.queue.length===0){ this.state='settle'; this.stateT=0; }
          else this._beginAction();
        }
        break;
      }
      case 'wind': {
        // the paw rises — the glow at the target grows for the FULL telegraph. Fixed target, honest glow.
        const k = Math.min(1, this.stateT/this._windNow);
        if(this.pawG) this.pawG.rotation.z = -1.35*Math.sin(k*Math.PI*0.5);
        this.body.rotation.z = -0.12*k;
        this.slamGlow.position.x = this._tx;
        this.slamGlow.material.opacity = k*0.5;
        this.slamGlow.scale.setScalar(0.5+k*1.5);   // visual r ≈ 2.2 at full — matches the 2.3 damage band
        if(this.stateT>=this._windNow){
          this._slamImpact();
          this.state='slamhit'; this.stateT=0;
        }
        break;
      }
      case 'slamhit': {
        // the paw is down, the lake is broken, she doesn't notice
        if(this.pawG) this.pawG.rotation.z = damp(this.pawG.rotation.z, 0.2, 12, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 8, dt);
        if(this.stateT>0.35){
          if(this.pawG) this.pawG.rotation.z = 0;
          if(this._pair && !this._pairDone){
            // the P3 pair: re-aim (player-reactive read) and re-telegraph — 0.65s, the legal floor, exactly
            this._pairDone = true;
            this._tx = clamp(pl ? pl.pos.x : p.x, Math.max(-21, p.x-6.5), Math.min(21, p.x+6.5));
            this._windNow = this.wind2Len;
            this.state='wind'; this.stateT=0;
          } else { this.state='shuffle'; this.stateT=0; this.shuffleT=0; }
        }
        break;
      }
      case 'curl': {
        // 0.8s telegraphed curl (≥ the 0.65 floor, with margin — she's big, the wind-up reads from orbit)
        const k = Math.min(1, this.stateT/0.8);
        this.body.scale.y = 1-0.3*k; this.body.scale.x = 1-0.12*k;
        this.body.position.y = -k*0.8;
        if(this.stateT>=0.8){
          this.state='roll'; this.stateT=0;
          this.body.visible = false; this.ballG.visible = true;
          this.body.scale.set(1,1,1); this.body.position.y = 0;
          this.ballG.position.set(0, 2.2, 0);
          AUDIO.bossRoar();
          G.camc.shake(0.3,0.3);
        }
        break;
      }
      case 'roll': {
        // the sleep-roll: one lane, one direction, captured at the curl. Curled = her weight spreads like a
        // snowdrift, so the lake HOLDS (dream logic; also the roll must never strand the whole floor at once
        // — only slams call _bearSlam). Contact = 1 heart, hop it or hold an island.
        p.x += this._rollDir*9.5*dt;
        this.ball.rotation.z -= this._rollDir*(9.5/2.2)*dt;
        if((this.t*14|0)!==this._rollTick){ this._rollTick=this.t*14|0; G.fx.spawn(new THREE.Vector3(p.x-this._rollDir*1.8, 0.3, 0), 0xcfe4f4, 1, {speed:1.5, life:0.35}); }
        if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<2.4 && Math.abs(pl.pos.z)<1.9 && pl.pos.y<3.2) this.hurtPlayer(1, new THREE.Vector3(p.x,2.0,0));
        if((this._rollDir>0 && p.x>=19.5) || (this._rollDir<0 && p.x<=-19.5)){
          p.x = clamp(p.x, -19.5, 19.5);
          this.state='unroll'; this.stateT=0;
          this.ballG.visible = false; this.body.visible = true;
          this.facing = -this._rollDir;   // she fetches up against the drift bank facing back into the bowl
          G.camc.shake(0.35,0.35);
          G.fx.spawn(new THREE.Vector3(p.x, 1.5, 0), 0xf0f4ff, 14, {speed:3.5, life:0.5});
        }
        break;
      }
      case 'unroll':
        // a sleepy stretch, then the dream resumes
        this.body.rotation.z = Math.sin(this.stateT*9)*0.06*(1-this.stateT/0.7);
        if(this.stateT>0.7){ this.body.rotation.z=0; this.state='shuffle'; this.stateT=0; this.shuffleT=0; }
        break;
      case 'settle': {
        // she eases down for the snore — haunches sink, the great head droops to jump-reach
        const k = Math.min(1, this.stateT/0.5);
        this.body.position.y = -0.9*k;
        this.headG.position.y = lerp(this.headHomeY, 2.5, k);
        this.headG.rotation.z = -0.25*k;
        if(this.stateT>=0.5) this._enterSnore();
        break;
      }
      case 'snore': {
        // THE WINDOW — nose only, hitCD spaces the pips; the boss runs its own stomp/spin detection
        this.body.rotation.z = Math.sin(this.t*1.6)*0.03;
        this.body.position.y = -0.9 + Math.sin(this.t*2.4)*0.06;   // the huge breathing
        this.noseM.emissiveIntensity = (this.deep?1.4:0.8) + Math.sin(this.t*6)*0.35;
        this.noseHalo.material.opacity = (this.deep?0.4:0.25) + Math.sin(this.t*6)*0.1;
        this.noseHalo.scale.setScalar(1+Math.sin(this.t*3)*0.15);
        if((this.t*2|0)!==this._snoreTick){ this._snoreTick=this.t*2|0; AUDIO.noise && AUDIO.noise({t:0.45, vol:0.08, fFrom:100, fTo:60}); }
        if(pl && this.vulnerable && !pl.dead){
          const nv = this.snoutWorld();
          const dxz = Math.hypot(pl.pos.x-nv.x, pl.pos.z-nv.z);
          // stomp the snout
          if(pl.vel.y<0 && dxz<1.8 && pl.pos.y>nv.y-0.6 && pl.pos.y<nv.y+1.6){
            pl.bounceOff(12);
            AUDIO.stomp();
            this.takeHit();
            break;
          }
          // spin into the nose
          if(pl.attackT>0 && !this._swingClaimed && dxz<2.2 && Math.abs((pl.pos.y+0.7)-nv.y)<1.8){
            this._swingClaimed = true;
            this.takeHit();
            break;
          }
        }
        if(this.stateT>this.snoreNow){
          this.state='rise'; this.stateT=0; this.vulnerable=false; this.deep=false;
          this.noseM.emissiveIntensity = 0; this.noseHalo.material.opacity = 0;
        }
        break;
      }
      case 'rise': {
        // up she comes — a huff, a headshake, eyes still shut (always)
        const k = Math.min(1, this.stateT/0.8);
        this.body.position.y = -0.9*(1-k);
        this.headG.position.y = lerp(2.5, this.headHomeY, k);
        this.headG.rotation.z = -0.25*(1-k) + Math.sin(this.stateT*16)*0.05*(1-k);
        if(this.stateT>=0.8){
          this.queue = this.actions.slice();   // the rotation refills — same order, every cycle, forever
          this.state='shuffle'; this.stateT=0; this.shuffleT=0;
        }
        break;
      }
      case 'stir': {
        // the phase boundary — she rears tall and SNORES LIKE THUNDER. Never falls. Never wakes.
        const k = Math.min(1, this.stateT/0.6);
        const up = Math.min(1, this.stateT/0.4);   // eases out of the snore slump first — no pose pop
        this.body.rotation.z = -0.4*Math.sin(k*Math.PI) - 0.1*Math.sin(this.stateT*11)*(1-k);
        this.body.position.y = lerp(this._stirY0||0, 0, up) + 0.5*Math.sin(k*Math.PI);
        this.headG.position.y = damp(this.headG.position.y, this.headHomeY, 6, dt);
        this.headG.rotation.z = damp(this.headG.rotation.z, -0.12, 6, dt);
        if(this.stateT>1.6){ this.body.rotation.z=0; this.body.position.y=0; this._stirDone(); }
        break;
      }
      case 'boopscene': {
        // THE ENDING — no death, no waking: a boop. State-machine driven (never setTimeout) so quits can't strand it.
        const T = this.stateT;
        // her own dream calms the lake — every panel stills and heals while she says goodbye
        for(const pn of this.panels){ pn.budget = 0; if(pn.open) pn.reAt = Math.min(pn.reAt, 0.15); }
        // beat 1 (0→1.2): she sits up SLOWLY from the snore slump — haunches down, great front up, head lifting
        const k1 = Math.min(1, T/1.2);
        this.body.rotation.z = -0.55*k1;
        this.body.position.y = lerp(-0.9, -0.4, k1);
        if(T<1.2){ this.headG.position.y = lerp(2.5, this.headHomeY, k1); this.headG.rotation.z = lerp(-0.25, 0.35, k1); }
        // beat 2 (1.2): THE YAWN — enormous, head back, the aurora ripples with it
        if(T>1.2 && !this._yawned){ this._yawned = true;
          AUDIO.tone && AUDIO.tone({f:140, f2:70, type:'triangle', t:1.0, vol:0.2});
          this.flashT = Math.max(this.flashT, 0.35);
          G.fx.spawn(new THREE.Vector3(p.x+this.facing*4, 5.5, 0), 0x7ae8ff, 16, {speed:2.5, life:0.8});
        }
        if(T>1.2 && T<2.1){ const yk = Math.sin(Math.min(1,(T-1.2)/0.9)*Math.PI); this.headG.rotation.z = 0.35 + 0.45*yk; }
        // beat 3 (2.1→3.1): she finds Pip with her NOSE — the head swings down and out, sniffing
        if(T>2.1 && T<3.1 && pl){
          const sk = Math.min(1,(T-2.1)/1.0);
          this.facing = Math.sign(pl.pos.x-p.x)||this.facing;
          this.headG.rotation.z = lerp(0.35, -0.75, sk);
          this.headG.position.y = lerp(this.headHomeY, 1.9, sk);
          if((T*8|0)!==this._sniffTick){ this._sniffTick=T*8|0; const nv=this.snoutWorld(); G.fx.spawn(new THREE.Vector3(nv.x+this.facing*0.5, nv.y, nv.z), 0xbfe8ff, 1, {speed:0.7, life:0.4}); }
        }
        // beat 4 (3.1): THE BOOP — one slow approving nose-boop (the warm sting)
        if(T>3.1 && !this._booped){ this._booped = true;
          AUDIO.heart && AUDIO.heart();
          if(pl){ const nv = this.snoutWorld();
            pl.pos.x += this.facing*0.5;   // the gentlest shove in Grimmwick
            G.fx.spawn(new THREE.Vector3(nv.x, nv.y, nv.z), 0xff9ab0, 16, {speed:2.5, life:0.8});
          }
          candyBurst(G, new THREE.Vector3(p.x+this.facing*4.5, 1.5, 0), 24);
        }
        // beat 5 (3.8): she straightens — and BOWS. Eyes closed. They were always closed.
        if(T>3.8){
          const bk = Math.min(1,(T-3.8)/0.5);
          this.headG.rotation.z = lerp(-0.75, -0.5, bk);
          this.headG.position.y = lerp(1.9, 2.6, bk*0.5);
          this.body.rotation.z = lerp(-0.55, -0.2, bk);
          if(!this._bowed && bk>=1) this._bowed = true;
        }
        if(T>4.1 && !this._toasted){ this._toasted = true;
          UI.toast('🐻‍❄️ The Great White pads off to nap by the Hearthlight. She bows first.');
        }
        if(T>4.5 && !this._doneFired){
          this._doneFired = true;
          G.onBossDefeated();                 // district comes from G.bossDistrict — no arguments
        }
        break;
      }
    }

    // ---- visuals ----
    this.group.position.copy(p);
    this.shadow.visible = true;               // she never bursts, never vanishes — the shadow stays hers
    this.shadow.position.set(p.x, 0.03, p.z);
    this.shadow.scale.setScalar(this.state==='roll'?0.72:1);
    // the pom never sits still (micro-motion law)
    this.pom.position.y = 2.4 + Math.sin(this.t*2.1)*0.08;
  }

  _shuffleAnim(dt, k){
    // the sleepwalk gait — heavy bob, swinging legs, the dreaming head too heavy for the neck
    this.body.position.y = Math.abs(Math.sin(this.t*2.2))*0.1*k;
    for(let i=0;i<this.legs.length;i++) this.legs[i].rotation.z = Math.sin(this.t*2.2+i*Math.PI/2)*0.28*k;
    if(this.state!=='boopscene'){
      this.headG.rotation.z = Math.sin(this.t*1.0)*0.05 - 0.12;
      this.headG.position.y = this.headHomeY;
    }
  }
}

// ---- DREAM-FISH: a spectral fish-wisp swimming a fixed air lane — unkillable (it isn't even really there),
// 1-heart touch, and its telegraph is honesty itself: it glows, and you watch it cross 46 units of open air
// before it ever reaches you (plus a 0.7s shimmer at the lane's mouth before each entry). Pure clock. ----
class DreamFish {
  constructor(G, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.retired=false;
    this.y=opts.y||1.6; this.x0=opts.x0||-26; this.x1=opts.x1||26;
    this.speed=opts.speed||12; this.period=opts.period||7.5;
    this.runT = Math.abs(this.x1-this.x0)/this.speed;
    // t starts period-delay: first entry lands 'delay' seconds after spawn, WITH its mouth-shimmer lead-in
    this.t = this.period - (opts.delay||1);
    this.group = new THREE.Group();
    const gM = new THREE.MeshLambertMaterial({color:0xcfe0f4, emissive:0x7ae8ff, emissiveIntensity:0.8, transparent:true, opacity:0.55});
    const body = new THREE.Mesh(geo('sph',0.42,9,8), gM); body.scale.set(1.6,0.8,0.7); this.group.add(body);
    const tail = new THREE.Mesh(geo('cone',0.26,0.5,6), gM); tail.rotation.z=Math.PI/2; tail.position.set(-0.7,0,0); this.group.add(tail);
    const fin = new THREE.Mesh(geo('cone',0.16,0.35,5), gM); fin.position.set(0.05,0.42,0); this.group.add(fin);
    for(const s of [-1,1]){ const lid = mesh('tor',[0.07,0.015,4,8,Math.PI], mat(0x2a3048)); lid.position.set(0.42,0.1,s*0.22); lid.rotation.x=Math.PI/2; lid.rotation.z=Math.PI; this.group.add(lid); }   // asleep too. Everything here is.
    this.glow = new THREE.Mesh(geo('sph',0.75,9,7), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0.18, depthWrite:false}));
    this.group.add(this.glow);
    this.group.visible=false;
    G.scene.add(this.group);
  }
  update(dt, G){
    if(this.retired){ this.group.visible=false; return; }
    this.t += dt;
    const cyc = this.t % this.period;
    // the lane-mouth shimmer — 0.7s before every entry (≥ the 0.65 floor; rate-gated, zero RNG)
    if(cyc > this.period-0.7){
      if((this.t*10|0)!==this._teleTick){ this._teleTick=this.t*10|0;
        G.fx.spawn(new THREE.Vector3(this.x0, this.y, 0), 0x7ae8ff, 1, {speed:0.8, life:0.4}); }
    }
    if(cyc < this.runT){
      const k = cyc/this.runT, dir = Math.sign(this.x1-this.x0);
      const fx = lerp(this.x0, this.x1, k);
      const fy = this.y + Math.sin(this.t*6)*0.16;
      this.group.visible = true;
      this.group.position.set(fx, fy, 0);
      this.group.rotation.y = dir>0?0:Math.PI;
      this.group.rotation.z = Math.sin(this.t*8)*0.12;
      this.glow.material.opacity = 0.14+Math.sin(this.t*5)*0.06;
      const pl = G.player;
      if(pl && !pl.dead && Math.abs(pl.pos.x-fx)<0.8 && Math.abs(pl.pos.z)<1.2 &&
         pl.pos.y+1.1 > fy-0.55 && pl.pos.y < fy+0.75){
        pl.damage(1, new THREE.Vector3(fx, fy, 0));   // i-frames make each pass bite once at most
      }
    } else this.group.visible = false;
  }
}

// =============================== ARENA ===============================
function buildBossArena7(G){
  const S = G.scene;
  const x1 = -23, x2 = 23;   // the ~46u ice bowl
  // ---- THE FLOOR IS THE FIGHT: CrackIce panels over black water (grip:false → tag:'ice', slick AND fragile).
  // The kit's ticker owns cracking/refreeze and the plunge (heart + lantern walk-back — never a death);
  // it also installs G._bearSlam, which her paw-slams call. Her attacks shrink the ground you share. ----
  const panels = w7CrackLake(G, x1, x2, {d:6});
  // ---- 4 GRIPPY SNOW ISLANDS — thick bergs pinned to the lakebed: they never crack, never slide.
  // The safe squares in her chess game; step-up 0.4 ≤ the 0.45 step limit, so they read as ground, not jumps.
  const bergs = new THREE.Group();
  for(const ix of [-17.5, -6, 6, 17.5]){
    G.world.addBox(ix, -0.7, 0, 3.4, 1.1, 5, {});
    const core = new THREE.Mesh(geo('box',3.4,1.6,5), new THREE.MeshLambertMaterial({color:W7PAL.iceD, emissive:0x2a5a8a, emissiveIntensity:0.15}));
    core.position.set(ix,-0.4,0); bergs.add(core);
    const capS = mesh('box',[3.5,0.22,5.1], mat(W6PAL.snow)); capS.position.set(ix,0.32,0); bergs.add(capS);
    const mound = mesh('sph',[1.1,8,6], mat(W6PAL.snowD)); mound.scale.y=0.35; mound.position.set(ix+rand(-0.8,0.8),0.42,rand(-1.6,-0.8)); bergs.add(mound);
  }
  S.add(bakeGroup(bergs));
  // ---- bowl walls — pressure-ridge banks (colliders + baked slab chaos), nobody leaves the dream ----
  G.world.addBox(-25.4, 0, 0, 4, 14, 12, {});
  G.world.addBox(25.4, 0, 0, 4, 14, 12, {});
  const walls = new THREE.Group();
  for(const s of [-1,1]) for(let i=0;i<4;i++){
    const slab = new THREE.Mesh(geo('box',rand(1.6,3),rand(1.5,3.5+i),0.9), new THREE.MeshLambertMaterial({color:i%2?W7PAL.ice:W7PAL.iceD, transparent:true, opacity:0.9}));
    slab.position.set(s*(23.6+i*0.8), rand(0.4,1.8), rand(-2.5,1.5)); slab.rotation.z = s*rand(0.1,0.45); walls.add(slab);
    const snowc = mesh('sph',[rand(0.9,1.5),7,5], mat(W6PAL.snow)); snowc.scale.y=0.5; snowc.position.set(s*(23.8+i*0.8), rand(1.5,3), rand(-2,1)); walls.add(snowc);
  }
  S.add(bakeGroup(walls));

  w7Parallax(S, x1, x2);

  // ---- THE SIGN outside the gate (the hint; the boss toasts its text on approach) ----
  const deco = new THREE.Group();
  { const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(W7PAL.rope)); pole.position.set(-21.4,0.7,-1.7);
    const board = mesh('box',[1.7,0.8,0.1], mat(0x5a4a38)); board.position.set(-21.4,1.5,-1.7); crook(board,0.05);
    const capS2 = mesh('box',[1.8,0.1,0.16], mat(W6PAL.snow)); capS2.position.set(-21.4,1.95,-1.7);
    deco.add(pole, board, capS2); }
  S.add(bakeGroup(deco));

  // ---- penguin spectators huddled by the WESTERN bell (the living hint — they came for the show) ----
  const specs = [];
  for(const [sx, ry] of [[-19.1, 0.5], [-18.4, -0.4]]){
    const pg = new THREE.Group();
    const tux = emat(0x23283a,0x11141f,0.25), belly = emat(0xf2f5ff,0xaab8d8,0.3);
    const back = mesh('sph',[0.28,9,8], tux); back.scale.set(1,1.25,0.95); back.position.y=0.38; pg.add(back);
    const front = mesh('sph',[0.24,9,8], belly); front.scale.set(1,1.15,0.8); front.position.set(0,0.35,0.1); pg.add(front);
    const hd = mesh('sph',[0.17,8,7], tux); hd.position.y=0.72; pg.add(hd);
    const bk = mesh('cone',[0.05,0.16,5], emat(0xf0913a,0xa05a1a,0.3)); bk.rotation.x=Math.PI/2; bk.position.set(0,0.7,0.2); pg.add(bk);
    const sc = mesh('tor',[0.14,0.05,6,10], emat(pick([0xd83a4a,0x3aa060]),0x8a1e2c,0.25)); sc.position.y=0.58; sc.rotation.x=0.15; pg.add(sc);
    pg.position.set(sx, 0, -2.2); pg.rotation.y = ry;
    S.add(pg); specs.push(pg);
  }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt, G2){ this.t+=dt;
      const blazed = G2.boss && G2.boss._blazed;
      for(let i=0;i<specs.length;i++){
        if(blazed){ specs[i].position.y = Math.abs(Math.sin(this.t*6+i*1.3))*0.16; specs[i].rotation.z = 0; }   // the lights! the LIGHTS!
        else { specs[i].rotation.z = Math.sin(this.t*2.4+i*2.1)*0.06; specs[i].position.y = 0; }               // patient craning at the bell
      } } });

  // ---- the winter night, wired (contract order per the kit; the boss owns its own lifecycle) ----
  G.scene.background = new THREE.Color(W7PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W7PAL.fog);
  G.spawnPoint.set(-17, 1, 0);   // atop the western berg — dry feet for the opening read
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -12;           // formality: the CrackLake plunge catches everything first at y<-1.4
  G.bats = makeBats(G.scene, 3, 28);
  G.amb = w7Ambience(S, x1, x2);
  w6Aurora(G, x1, x2);           // the kit sky; the bells add their OWN blaze ribbons on top
  G.lightPools = G.lightPools || [];
  // lights budget: 0 point lights, always — bells/aurora/nose are all emissive+additive. ≤6 with room to spare.
  G.boss = new UrsaMajor(G, {panels});
}

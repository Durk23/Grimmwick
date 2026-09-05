// ============ BOSS 9 — OLD TANNENBAUM (Frostmere · Evergreen Deep guardian) ============
// A COLOSSAL walking Winterfest tree — the FIRST tree the town ever decorated, three hundred years the
// center of the festival, frozen bitter when the song stopped mid-verse. His STAR TOPPER is dark; his
// ornaments went out tier by tier; his face is a KNOT in the trunk, mouth still open on the note nobody
// finished. He WALKS on two great root-legs, and every step rings the floor.
//   PHASE 1 (3 hits) — root-stomp pursuit: slow quake-steps, then telegraphed STOMPS (0.7s lifted root +
//                      growing floor glow) that ring a shockwave along the ground to hop. After his 3-step
//                      rotation he pauses WINDED (2.2s): the knot-face glows — hit it.
//   PHASE 2 (4 hits) — adds ORNAMENT LOBS from his boughs (fixed rotation slot: 0.7s glint telegraph on
//                      the bough, then 3 arcing ornaments with landing-glow discs that grow the FULL
//                      flight). Knot windows shrink to 1.7s.
//   PHASE 3 (5 hits) — adds the NEEDLE-SPIN (full-body telegraph: the boughs DRAW IN for 0.8s, then he
//                      spins, shedding one horizontal needle-wave you jump) + a one-time pair of
//                      OrnamentSpider adds dropped from the garlands. Knot 1.4s.
// SECRET TAKEDOWN (the speedrun meta): RELIGHT HIS STAR — ride either chimney updraft to crown height and
// SPIN THE STAR (swing-edge detect beside it): it BLAZES and he stops mid-swing — three hundred years of
// being loved come back at once: 5s of calm with the knot glowing the WHOLE time and every hit counting
// DOUBLE. Once per phase the cold re-darkens the star (he shakes it out); the hp-9/hp-5 boundaries
// interrupt a calm, so one calm can at most clear the CURRENT phase (3/4/5 pips) — re-earn it each phase
// (his own pursuit carries the crown to your chimney; you only have to be up there when it arrives).
// Hints: the sign outside the arena — "Every tree remembers its star." — and the 9-5 grove sign already
// planted in the levels.
// DEFEAT (wholesome — the series signature): NO felling. He KNEELS, and PLANTS HIMSELF — roots settling
// into the grove's heart; every ornament relights tier by tier, bottom to crown, the star LAST, and paper
// stars drift down over the snow. He is the festival tree again. ~4.5s cutscene run on the state machine
// (never setTimeout). G._bossEndT is stamped at the last hit (the w5 idiom); the planting is a gift, not
// a timer. Then G.onBossDefeated() once, NO arguments — district comes from G.bossDistrict.
//
// ENGINE CONTRACT (mirrors 10g_boss7 / 10h_boss8 exactly): G.boss singleton with update(dt), NOT an ents
// entity. Runs its OWN stomp/spin detection on the knot (the player's generic loops only reach ents) and
// exposes onPlayerPound(pos) — 06_player calls it on every landed pound. Boss bar via UI.showBossBar /
// updateBossBar (12 hit-pips: 3+4+5, boundaries at hp 9 and hp 5). Adds (OrnamentSpiders) ARE ents —
// stompable, drop candy, cleared on defeat. Projectiles (rings/waves/ornaments) are ents with _bossProj
// (all meshes live in e.group so EntityMgr owns removal). HEARTS-ALWAYS: every attack costs exactly 1
// heart (stomp ring, root, ornament, needle-wave, spider); his shambling body is a SOFT WALL, never a
// hit. All telegraphs ≥ the 0.65s floor (stomp 0.7 · lob glint 0.7 · needle draw-in 0.8).
// DETERMINISM: action rotations are FIXED per phase; stomp points / lob targets are player-reactive
// state-machine reads captured AT the telegraph (like every boss); the star-calm is player-triggered;
// rand()/pick() are cosmetic only.
// DIFFICULTY (OWNER BAND): BEYOND-D5 guardian — peer of Ursa and Prismus, one notch under a finale.
// Pressure comes from the RINGING FLOOR and the climb-for-the-star gamble, never damage sponges.
// THREAT BUDGET: ≤4 simultaneous threats at any instant, pinned per phase —
//   Ring lifetimes: stomp ring (9.6−0.6)/8 = 1.125s · needle-wave (11−0.8)/8.5 = 1.2s. Consecutive
//   hazard spawns are ≥ hold 0.45 + pursue 0.6 + wind 0.7 = 1.75s apart (ONE state machine, actions
//   serialize) → no two rings/waves ever coexist. ∎
//   P1: tree action 1 + its ring 1 = 2. ✓
//   P2: lob wave ≤3 ornaments aloft (launches 0.35s apart, flight 1.0s → orn 1 lands at t=1.0, orn 3
//       launches at t=0.7: a 0.3s triple at worst) = 3. Steps/rings serialize as P1. ✓
//   P3 (spiders up): lobs AND spins are WITHHELD while an OrnamentSpider lives (he lets his ornaments
//       fight) → tree step 1 + ring 1 + spiders 2 = 4. ✓
//   P3 (full): worst instant = the lob's 0.3s triple = 3; the needle-wave is one object (two fronts,
//       only one can reach the player). ≤4 everywhere. ∎
// KNOT/STAR REACH (comparable-heights law — every ask is comfortable):
//   KNOT: body-local y 2.4; winded slump −0.7 → world ≈1.7, calm slump −0.5 → ≈1.9 — both inside the
//   ground spin band (|py+0.7−ky| < 1.6 with py=0) and a tap-hop stomps it. ✓
//   STAR: body-local y 7.35 (he is ~7.5u tall). The chimney updrafts (top 9.0) float Pip at crown
//   height; his pursuit clamp (±19) carries the crown to within 1.5u of the chimney lanes (x ±20.5) —
//   spin reach 2.4 covers it. Entering a column needs a jump above y 1.8 → double-jump 3.3 ✓, and the
//   rising smoke marks the exact lane (the verb is telegraphed, per the updraft kit). ✓

class Tannenbaum {
  constructor(G, opts={}){
    this.G = G;
    this.maxHp = 12; this.hp = 12;           // 3 (P1) + 4 (P2) + 5 (P3) — shifts at hp 9 and hp 5
    this.dead = false;
    this.phase = 1;
    this.pos = new THREE.Vector3(12, 0, 0);
    this.state = 'intro'; this.stateT = 0;
    this.t = 0;
    this.facing = -1;                        // he looms at the east end, dark as the year's last night
    this.vulnerable = false; this.hitCD = 0;
    this.calm = false;                       // the star's 5s double-pip remembrance
    this._starUsed = {1:false, 2:false, 3:false};   // once per phase (the boundary caps its value)
    this.queue = [];                         // the phase's fixed action rotation (refilled each cycle)
    this.pursueT = 0;
    this.spiders = [];                       // phase-3 OrnamentSpider adds (ents)
    this.garlandMats = opts.garlandMats || [];   // arena garland bulbs — the finale relights them too
    this._tierIn = 0;                        // needle-spin draw-in factor (0 = boughs at rest)
    this._swingClaimed = false; this._starSwing = false; this._clinkClaim = false;
    this._signShown = false; this._stepToasted = false; this._lobToasted = false;
    this._spinToasted = false; this._knotToasted = false; this._windToasted = false;
    this.buildRig();
    this._kv = new THREE.Vector3();          // reusable knot-world scratch
    this._sv = new THREE.Vector3();          // reusable star-world scratch
    this.shadow = blobShadow(2.7);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('OLD TANNENBAUM', this.hp, this.maxHp); }
    AUDIO.bossRoar();                        // three hundred winters creaking at once
  }

  // ---------------------------------------------------------------- rig
  buildRig(){
    // a tree that decided to stand up. Rig forward = LOCAL +X; group.rotation.y flips 0/π so he reads
    // in clean side profile. EVERY animatable material is bespoke — never mutate the mat() caches.
    this.group = new THREE.Group();
    const body = new THREE.Group();
    const barkM = mat(W9PAL.bark), barkDM = mat(W9PAL.barkD);
    // ---- root-legs: two great walkers, splayed toes (rz>0 is the camera-side stomp root) ----
    this.roots = []; this.rootF = null;
    for(const rz of [0.8, -0.8]){
      const rg = new THREE.Group(); rg.position.set(0, 1.5, rz);
      const shin = mesh('cyl',[0.36,0.52,1.7,7], barkDM); shin.position.y = -0.85; rg.add(shin);
      for(let i=0;i<3;i++){ const toe = mesh('cone',[0.16,0.7,5], barkM);
        toe.position.set(-0.3+i*0.3, -1.5, (i%2?0.2:-0.2)); toe.rotation.z = -Math.PI/2+(i-1)*0.3; rg.add(toe); }
      body.add(rg); this.roots.push(rg);
      if(rz>0) this.rootF = rg;
    }
    // ---- the great trunk ----
    const trunk = mesh('cyl',[0.62,1.0,3.6,9], barkM); trunk.position.y = 3.0; body.add(trunk);
    // ---- THE KNOT — his face, frozen mid-verse (the weak point; it glows in windows) ----
    this.knotG = new THREE.Group(); this.knotG.position.set(0.8, 2.4, 0);
    this.knotM = new THREE.MeshLambertMaterial({color:0x6a5238, emissive:0xffd98a, emissiveIntensity:0.06});
    const burl = new THREE.Mesh(geo('sph',0.62,10,9), this.knotM); burl.scale.set(0.55,1,1); this.knotG.add(burl);
    this.eyeM = new THREE.MeshLambertMaterial({color:0x2a2036, emissive:0xffd23f, emissiveIntensity:0.4});
    for(const s of [-1,1]){
      const eye = new THREE.Mesh(geo('sph',0.09,6,5), this.eyeM); eye.position.set(0.28,0.16,s*0.2); this.knotG.add(eye);
      const brow = mesh('box',[0.05,0.16,0.05], barkDM); brow.position.set(0.32,0.32,s*0.2); brow.rotation.x = s*0.5; this.knotG.add(brow);
    }
    this.mouth = new THREE.Mesh(geo('sph',0.11,7,6), mat(0x14101f));
    this.mouth.scale.set(0.6,1.35,1); this.mouth.position.set(0.31,-0.16,0); this.knotG.add(this.mouth);   // the O of the unfinished note
    body.add(this.knotG);
    this.knotHalo = new THREE.Mesh(geo('sph',1.0,10,8), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0, depthWrite:false}));
    this.knotHalo.position.copy(this.knotG.position); body.add(this.knotHalo);
    // ---- four bough-tiers with ornaments (per-tier bespoke materials — the finale's tier-by-tier dial;
    // index-math placement, zero RNG: he is IDENTICAL every attempt) ----
    this.tiers = []; this.tierMats = [];
    this._tierY = [3.3, 4.5, 5.6, 6.55];
    const tierR = [3.1, 2.5, 1.95, 1.4], tierH = [1.7, 1.55, 1.4, 1.25];
    const ORN_C = [W9PAL.ornR, W9PAL.ornG, W9PAL.ornE, 0x7ae8ff];
    for(let ti=0; ti<4; ti++){
      const tg = new THREE.Group(); tg.position.y = this._tierY[ti];
      const bough = mesh('cone',[tierR[ti], tierH[ti], 9], ti%2 ? mat(W9PAL.pineD) : mat(W9PAL.pine));
      bough.position.y = tierH[ti]*0.3; tg.add(bough);
      const om = new THREE.MeshLambertMaterial({color:ORN_C[ti], emissive:ORN_C[ti], emissiveIntensity:0.12});
      this.tierMats.push(om);
      const nO = 6-ti;
      for(let oi=0; oi<nO; oi++){
        const a = oi/nO*TAU + ti*0.7;
        const orn = new THREE.Mesh(geo('sph',0.2,7,6), om);
        orn.position.set(Math.cos(a)*tierR[ti]*0.72, -0.12, Math.sin(a)*tierR[ti]*0.72);
        tg.add(orn);
      }
      const snowCap = mesh('sph',[tierR[ti]*0.34,7,5], mat(W9PAL.snow));
      snowCap.scale.y = 0.28; snowCap.position.set(tierR[ti]*0.42, tierH[ti]*0.62, 0.3); tg.add(snowCap);
      body.add(tg); this.tiers.push(tg);
    }
    // ---- THE STAR TOPPER — dark. Three hundred years of being first-lit, and it's DARK. ----
    this.starG = new THREE.Group(); this.starG.position.set(0, 7.35, 0);
    this.starM = new THREE.MeshLambertMaterial({color:0x4a4034, emissive:0xffd23f, emissiveIntensity:0.05});
    this.starCore = new THREE.Mesh(geo('sph',0.26,8,7), this.starM); this.starG.add(this.starCore);
    for(let i=0;i<5;i++){
      const a = Math.PI/2 + i/5*TAU;
      const pt = new THREE.Mesh(geo('cone',0.15,0.6,5), this.starM);
      pt.position.set(Math.cos(a)*0.42, Math.sin(a)*0.42, 0);
      pt.rotation.z = a - Math.PI/2;
      this.starG.add(pt);
    }
    this.starHalo = new THREE.Mesh(geo('sph',1.0,10,8), new THREE.MeshBasicMaterial({color:0xffd23f, transparent:true, opacity:0, depthWrite:false}));
    this.starG.add(this.starHalo);
    body.add(this.starG);
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // ---- the stomp target-glow (reused every wind — grows for the FULL telegraph, bombardment language) ----
    this.stepGlow = new THREE.Mesh(geo('circ',1.1,14), new THREE.MeshBasicMaterial({color:0xcfe0f4, transparent:true, opacity:0, depthWrite:false}));
    this.stepGlow.rotation.x = -Math.PI/2; this.stepGlow.position.y = 0.06;
    this.G.scene.add(this.stepGlow);
  }

  // ---------------------------------------------------------------- helpers
  knotWorld(){ this.knotG.getWorldPosition(this._kv); return this._kv; }
  starWorld(){ this.starCore.getWorldPosition(this._sv); return this._sv; }
  spiderAlive(){ for(const s of this.spiders) if(!s.dead) return true; return false; }

  onPlayerPound(pos){
    // a pound landing on/near the KNOT during a window counts (boss1 parity, knot-only discipline)
    if(!this.vulnerable) return;
    const kv = this.knotWorld();
    if(Math.hypot(pos.x-kv.x, pos.z-kv.z) < 2.6 && Math.abs(pos.y-kv.y) < 2.2) this.takeHit();
  }

  takeHit(){
    if(this.dead || !this.vulnerable || this.hitCD>0) return;
    const was = this.hp;
    this.hp = Math.max(0, this.hp - (this.calm?2:1));   // the blazing star doubles every pip — its payoff
    this.hitCD = 0.55;
    AUDIO.bossHit();
    this.G.hitstop = this.calm ? 0.12 : 0.09;
    this.G.camc.shake(0.5, 0.4);
    const kv = this.knotWorld();
    this.G.fx.spawn(new THREE.Vector3(kv.x, kv.y, kv.z), this.calm?0xffd23f:0xffd98a, this.calm?26:16, {speed:5});
    UI.updateBossBar(this.hp);
    if(this.hp<=0){ this.defeat(); return; }
    // phase boundaries INTERRUPT a calm — one calm can never clear more than the current phase
    if(was>9 && this.hp<=9){ this._phaseShift(2); return; }
    if(was>5 && this.hp<=5){ this._phaseShift(3); return; }
    UI.toast(pick2([ '🎄 "...ow. That\'s sap. I\'m LEAKING TRADITION."',
      '🎄 (A bauble drops. A root catches it. Priorities.)',
      '🎄 "Three hundred years, and THIS is the carol I get?"' ], this.hp));
  }

  _applyPhase(){
    // the tuning table, one place. BEYOND-D5 TUNE: he stays a slow mountain (the ringing floor is the
    // pressure, never his feet); the knot windows shrink instead. All winds ≥ the 0.65s floor.
    // actions = the FIXED rotation per cycle — never RNG (determinism; his time feeds the boards).
    const P = [
      {sp:1.6, winded:2.2, spread:0,   lobT:1.0, actions:['step','step','step']},
      {sp:1.9, winded:1.7, spread:2.6, lobT:1.0, actions:['step','lob','step']},
      {sp:2.2, winded:1.4, spread:2.1, lobT:0.9, actions:['step','lob','spin']},
    ][this.phase-1];
    this.chaseSp = P.sp; this.windedLen = P.winded; this.spread = P.spread; this.lobT = P.lobT;
    this.actions = P.actions;
    this.queue = this.actions.slice();
  }

  _phaseShift(phase){
    // a phase boundary — he grinds TALLER, the dead ornaments rattle... and the cold takes the star back.
    this.phase = phase;
    this.vulnerable = false;
    if(this.calm) this._darkStar();
    this._clearAttackVisuals();
    this._shiftY0 = this.body.position.y;    // he rears FROM whatever slump he held — no pose pop
    this.state = 'shift'; this.stateT = 0;
    AUDIO.bossRoar();
    this.G.camc.shake(0.55, 0.5);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, 4.5, 0), 0x3aa060, 22, {speed:4, life:0.7});
  }

  _shiftDone(){
    this._applyPhase();
    if(this.phase===2){
      UI.toast('🎄 He shudders taller — the boughs WAKE! Ornaments incoming!');
    } else if(this.phase===3 && !this._spidersSpawned){
      this._spidersSpawned = true;
      // the one-time spider pair — dropped from the garlands, fixed posts, spawnGrace per the clear-patch
      // law (never a cheap hit). Budget: while one lives, lobs/spins are withheld → 1+1+2 = 4 ≤ 4.
      const s1 = new OrnamentSpider(this.G, -6, 5.4, 0, {phase:0,   dropY:0.9, wakeR:14, period:2.8, color:0xd83a4a});
      const s2 = new OrnamentSpider(this.G,  6, 5.4, 0, {phase:1.4, dropY:0.9, wakeR:14, period:2.8, color:0xffd23f});
      s1.spawnGrace = 1.0; s2.spawnGrace = 1.0;
      s1.state = 'unfold'; s1.st = -0.2; s2.state = 'unfold'; s2.st = -0.45;
      this.spiders.push(this.G.ents.add(s1), this.G.ents.add(s2));
      UI.toast('🎄🕷️ The garland stirs — two of his ornaments were NEVER ornaments!!');
    }
    this.state = 'pursue'; this.stateT = 0; this.pursueT = 0;
  }

  // ---------------------------------------------------------------- the star
  _lightStar(){
    this._starUsed[this.phase] = true;
    this._clearAttackVisuals();
    this.calm = true;
    this._remY0 = this.body.position.y;      // he eases into the memory FROM here — no pose pop
    this.state = 'remember'; this.stateT = 0;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin();
    this.G.camc.shake(0.4, 0.5);
    const sv = this.starWorld();
    this.G.fx.spawn(new THREE.Vector3(sv.x, sv.y, sv.z), 0xffd23f, 30, {speed:6, life:0.9});
    UI.toast('⭐ THE STAR BLAZES — he REMEMBERS being loved! The knot glows... every hit counts DOUBLE!');
  }

  _darkStar(){
    this.calm = false;
    this.starM.emissiveIntensity = 0.05;
    this.starHalo.material.opacity = 0;
    for(const m of this.tierMats) m.emissiveIntensity = 0.12;
  }

  _clearAttackVisuals(){
    this.stepGlow.material.opacity = 0;
    this._tierIn = 0;
    if(this.rootF){ this.rootF.position.y = 1.5; this.rootF.rotation.z = 0; }
    this.body.rotation.y = 0;
    this.tiers[1].rotation.z = 0;
  }

  // ---------------------------------------------------------------- actions
  _beginAction(){
    let act = this.queue.shift();
    // P3 budget substitution: lobs AND spins are withheld while a spider add lives (≤4, enforced not hoped)
    if(this.phase===3 && act!=='step' && this.spiderAlive()) act = 'step';
    const pl = this.G.player;
    if(act==='step'){
      // his stride lands ahead of him, toward the player (facing was captured by the pursuit) — FIXED now
      this._sx = clamp(this.pos.x + this.facing*2.2, -19, 19);
      this.state = 'stepwind'; this.stateT = 0;
      if(!this._stepToasted){ this._stepToasted = true; UI.toast('🌲 A root RISES — when it falls, the floor RINGS! Hop the ring!'); }
      AUDIO.noise && AUDIO.noise({t:0.5, vol:0.1, fFrom:80, fTo:160});
    } else if(act==='lob'){
      // targets captured AT the telegraph, then FIXED — the discs never lie (bombardment language)
      const px = clamp(pl ? pl.pos.x : this.pos.x, -21, 21);
      this._targets = [px, clamp(px-this.spread,-21.5,21.5), clamp(px+this.spread,-21.5,21.5)];
      this._lobsFired = 0;
      this.state = 'lobwind'; this.stateT = 0;
      if(!this._lobToasted){ this._lobToasted = true; UI.toast('🎄 The boughs GLINT — ornaments away! Read the landing rings!'); }
      AUDIO.noise && AUDIO.noise({t:0.3, vol:0.09, fFrom:1600, fTo:2800});   // glass singing
    } else { // spin
      this.state = 'spinwind'; this.stateT = 0;
      if(!this._spinToasted){ this._spinToasted = true; UI.toast('🌲 The boughs DRAW IN — needle-wave!! JUMP it!'); }
      AUDIO.noise && AUDIO.noise({t:0.6, vol:0.11, fFrom:200, fTo:700});
    }
  }

  _stepSlam(){
    const G = this.G, sx = this._sx;
    AUDIO.poundHit();
    G.camc.shake(0.55, 0.45);
    G.fx.spawn(new THREE.Vector3(sx, 0.4, 0), 0xdfe8f8, 16, {speed:4.5, life:0.5, gravity:4});
    G.fx.spawn(new THREE.Vector3(sx, 0.2, 0), 0x3c2f22, 8, {speed:3, life:0.4});
    this.stepGlow.material.opacity = 0;
    this._spawnRing(sx, false);
    const pl = G.player;
    // the root itself — standing under a falling tree-leg is 1 heart (the glow warned for the full 0.7s)
    if(pl && !pl.dead && Math.abs(pl.pos.x-sx)<1.5 && Math.abs(pl.pos.z)<1.8 && pl.pos.y<1.2) this.hurtPlayer(1, new THREE.Vector3(sx,0.5,0));
  }

  _spawnRing(cx, needle){
    // the floor answers: an expanding ring. Stomp ring = low, HOP it (band y<0.85, tap clears with 2x
    // margin). Needle-wave = taller, JUMP it (y<1.35 — a tap's 1.8u apex still clears, the owner rule).
    // Both are ents with _bossProj: EntityMgr owns cleanup, defeat() retires them.
    const speed = needle?8.5:8.0, r0 = needle?0.8:0.6, rMax = needle?11:9.6;
    const band = needle?0.55:0.5, hMax = needle?1.35:0.85, ry = needle?0.6:0.32;
    const ring = { dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, group:new THREE.Group(),
      update(dt, GG){
        this.t += dt;
        const r = r0 + this.t*speed;
        if(r>=rMax){ this.dead = true; return; }
        this.m.scale.set(r, r, 1);
        this.m.material.opacity = Math.max(0.15, 0.8 - this.t*0.45);
        if(needle && (this.t*16|0)!==this._nt){ this._nt = this.t*16|0;   // needles fly off the wavefront
          GG.fx.spawn(new THREE.Vector3(cx+r, 0.7, 0), 0x3aa060, 1, {speed:1.5, life:0.3});
          GG.fx.spawn(new THREE.Vector3(cx-r, 0.7, 0), 0x3aa060, 1, {speed:1.5, life:0.3}); }
        const pl = GG.player;
        if(pl && !pl.dead){
          const d = Math.abs(pl.pos.x-cx);
          if(Math.abs(d-r)<band && pl.pos.y<hMax && Math.abs(pl.pos.z)<1.9) pl.damage(1, new THREE.Vector3(pl.pos.x, 0.6, 0));
        }
      } };
    ring.m = new THREE.Mesh(geo('tor',1,0.05,6,30), new THREE.MeshBasicMaterial({color:needle?0x3aa060:0xcfe0f4, transparent:true, opacity:0.8, depthWrite:false}));
    ring.m.rotation.x = Math.PI/2; ring.m.position.set(cx, ry, 0);
    ring.group.add(ring.m);
    this.G.ents.add(ring);
  }

  _lobOrnament(tx, idx){
    // one glass ornament: fixed 0.35s launch spacing, fixed flight (this.lobT), landing disc grows the
    // WHOLE flight (0.9–1.0s ≥ the 0.65 floor — plus the 0.7s bough glint before the first). Landing
    // damage only, radius 1.5 = the disc's honest final size. Colors index-cycled, zero RNG.
    const G = this.G;
    const x0 = this.pos.x + this.facing*1.2, y0 = 4.6, T = this.lobT;
    const cc = [W9PAL.ornR, W9PAL.ornG, W9PAL.ornE][idx%3];
    const orn = { dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, group:new THREE.Group(),
      update(dt, GG){
        this.t += dt;
        const k = Math.min(1, this.t/T);
        this.m.position.set(lerp(x0,tx,k), lerp(y0,0.3,k)+Math.sin(k*Math.PI)*3.4, 0);
        this.m.rotation.z += 7*dt;
        this.disc.material.opacity = 0.12+k*0.42;
        this.disc.scale.setScalar(0.4+k*0.6);
        if(k>=1){
          this.dead = true;
          AUDIO.tone && AUDIO.tone({f:1900, f2:400, type:'square', t:0.1, vol:0.1});   // glass!
          GG.camc.shake(0.2, 0.22);
          GG.fx.spawn(new THREE.Vector3(tx,0.4,0), cc, 14, {speed:4, life:0.45, gravity:4});
          const pl = GG.player;
          if(pl && !pl.dead && Math.abs(pl.pos.x-tx)<1.5 && Math.abs(pl.pos.z)<1.6 && pl.pos.y<1.3) pl.damage(1, new THREE.Vector3(tx,0.5,0));
        }
      } };
    const mg = new THREE.Group();
    const ball = new THREE.Mesh(geo('sph',0.34,9,8), new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.6}));
    mg.add(ball);
    const cap = mesh('cyl',[0.1,0.12,0.12,8], mat(0xc9a24a)); cap.position.y = 0.38; mg.add(cap);
    mg.position.set(x0, y0, 0);
    orn.m = mg;
    orn.disc = new THREE.Mesh(geo('circ',1.5,14), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0.1, depthWrite:false}));
    orn.disc.rotation.x = -Math.PI/2; orn.disc.position.set(tx, 0.06, 0);
    orn.group.add(mg, orn.disc);              // all meshes in e.group → EntityMgr owns cleanup
    G.ents.add(orn);
    G.fx.spawn(new THREE.Vector3(x0, y0, 0), cc, 4, {speed:2, life:0.3});
  }

  _enterWinded(){
    this.state = 'winded'; this.stateT = 0;
    this._swingClaimed = true;               // a swing already in flight never claims the fresh window
    if(!this._windToasted){ this._windToasted = true; UI.toast('🌲 He stands WINDED — the knot-face GLOWS! Hit it!'); }
    AUDIO.noise && AUDIO.noise({t:0.6, vol:0.11, fFrom:160, fTo:60});   // an old forest, sighing
  }

  hurtPlayer(n, from){
    const pl = this.G.player;
    if(pl) pl.damage(n, from||this.pos);
  }

  // ---------------------------------------------------------------- defeat
  defeat(){
    // THE LAST HIT LANDS — the record stops HERE; the planting is a gift, not a timer (the w5 idiom)
    this.G._bossEndT = this.G.runT||0;
    this.dead = true;
    this.state = 'plantscene'; this.stateT = 0;
    this.calm = false; this.vulnerable = false;
    this._clearAttackVisuals();
    this._plantY0 = this.body.position.y;
    AUDIO.victory();
    UI.hideBossBar();
    this.G.hitstop = 0.18;
    // clear every live threat so the celebration can't hurt the player (boss1 parity):
    // spiders die softly; boss projectiles retire (their meshes live in e.group → auto-removed)
    for(const e of this.G.ents.list){
      if(e.isEnemy && !e.dead){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); }
      if(e._bossProj) e.dead = true;
    }
    this._tierLit = [false,false,false,false];
    this._planted = false; this._starLit = false; this._toasted = false; this._doneFired = false;
    this._paperTick = -1;
  }

  // ---------------------------------------------------------------- the loop
  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    if(this.hitCD>0) this.hitCD -= dt;
    const G = this.G, pl = G.player;
    const p = this.pos;

    // ---- the vulnerability truth, computed once per frame (knot only opens in windows) ----
    this.vulnerable = !this.dead && (this.state==='winded' || this.state==='remember');

    // ---- the knot-face glow (his face is always there; it BURNS in windows) ----
    const hot = this.vulnerable;
    if(hot){
      this.knotM.emissiveIntensity = (this.calm?1.3:0.9) + Math.sin(this.t*6)*0.35;
      this.knotHalo.material.opacity = (this.calm?0.42:0.26) + Math.sin(this.t*6)*0.08;
      this.eyeM.emissiveIntensity = 1.1;
    } else {
      this.knotM.emissiveIntensity = damp(this.knotM.emissiveIntensity, 0.06, 5, dt);
      this.knotHalo.material.opacity = damp(this.knotHalo.material.opacity, 0, 6, dt);
      this.eyeM.emissiveIntensity = damp(this.eyeM.emissiveIntensity, 0.4, 5, dt);
    }
    this.knotHalo.scale.setScalar(1+Math.sin(this.t*3)*0.15);

    // ---- the star (dark ember flicker at rest — micro-motion law; BLAZE while the calm holds) ----
    if(this.calm){
      this.starM.emissiveIntensity = 1.2 + Math.sin(this.t*7)*0.4;
      this.starHalo.material.opacity = 0.35 + Math.sin(this.t*5)*0.1;
      this.starHalo.scale.setScalar(1+Math.sin(this.t*4)*0.18);
    } else if(this.state!=='plantscene'){
      this.starM.emissiveIntensity = 0.05 + Math.sin(this.t*1.3)*0.02;
      this.starHalo.material.opacity = damp(this.starHalo.material.opacity, 0, 5, dt);
    }

    // ---- needle-spin draw-in (shared so every state eases the boughs honestly) ----
    const tin = 1 - 0.26*this._tierIn;
    for(const tg of this.tiers){ tg.scale.x = damp(tg.scale.x, tin, 10, dt); tg.scale.z = damp(tg.scale.z, tin, 10, dt); }

    // ---- THE STAR SPIN (swing-edge detect beside the crown — the chimney updrafts are the ladder) ----
    const swinging = pl && !pl.dead && pl.attackT>0;
    const starLive = !this.dead && !this.calm && !this._starUsed[this.phase] &&
      this.state!=='intro' && this.state!=='shift' && this.state!=='shakeout' && this.state!=='plantscene';
    if(swinging && !this._starSwing && starLive){
      const sv = this.starWorld();
      if(Math.hypot(pl.pos.x-sv.x, pl.pos.z-sv.z)<2.4 && Math.abs((pl.pos.y+0.7)-sv.y)<2.2){
        this._starSwing = true;
        this._lightStar();
      }
    }
    if(pl && pl.attackT<=0){ this._starSwing = false; this._swingClaimed = false; }

    // ---- the CLONK teach: swings on the trunk outside windows bounce off (edge-gated, one per swing) ----
    const hittingBody = pl && !pl.dead && (pl.attackT>0 || pl.pounding);
    if(hittingBody && !this._clinkClaim && !this.dead && !this.vulnerable &&
       Math.abs(pl.pos.x-p.x)<2.6 && Math.abs(pl.pos.z)<2.0 && pl.pos.y<5.5){
      this._clinkClaim = true;
      AUDIO.tone && AUDIO.tone({f:220, f2:140, type:'square', t:0.07, vol:0.1});
      G.fx.spawn(new THREE.Vector3(pl.pos.x+(p.x>pl.pos.x?0.5:-0.5), pl.pos.y+0.9, 0), 0x3c2f22, 4, {speed:2, life:0.3});
      if(!this._knotToasted){ this._knotToasted = true;
        UI.toast('🪵 CLONK! Bark like old iron — wait for him to catch his breath, then hit the KNOT when it glows!'); }
    }
    if(!hittingBody) this._clinkClaim = false;

    // ---- the sign outside the gate (the secret's echo, once) ----
    if(!this._signShown && pl && pl.pos.x < -18.8 && Math.abs(pl.pos.z)<3){
      this._signShown = true;
      window.UI && UI.toast('🪧 "Every tree remembers its star."');
    }

    // ---- facing (side-profile flip; he only re-aims while pursuing — mid-action he commits) ----
    if(pl && (this.state==='pursue' || this.state==='intro')){
      this.facing = this.state==='intro' ? -1 : (Math.sign(pl.pos.x-p.x)||this.facing);
    }
    this.group.rotation.y = angleDamp(this.group.rotation.y, this.facing>0?0:Math.PI, this.state==='plantscene'?2:4, dt);

    // ---- knot hit detection (the boss runs its own — generic player loops only reach ents) ----
    if(this.vulnerable && pl && !pl.dead){
      const kv = this.knotWorld();
      const dxz = Math.hypot(pl.pos.x-kv.x, pl.pos.z-kv.z);
      // stomp the knot (bounce out — the pogo language)
      if(pl.vel.y<0 && dxz<1.7 && pl.pos.y>kv.y-0.6 && pl.pos.y<kv.y+1.7){
        pl.bounceOff(12);
        AUDIO.stomp();
        this.takeHit();
      }
      // spin into the face (one claim per swing)
      else if(pl.attackT>0 && !this._swingClaimed && dxz<2.1 && Math.abs((pl.pos.y+0.7)-kv.y)<1.6){
        this._swingClaimed = true;
        this.takeHit();
      }
    }

    switch(this.state){
      case 'intro': {
        // he is ALREADY the grove: a dark tower at the east end, creaking in a wind that isn't blowing
        this.body.position.y = Math.sin(this.t*0.8)*0.03;
        this.body.rotation.z = Math.sin(this.t*0.6)*0.02;
        if(this.stateT>1.5){
          this._applyPhase();
          this.state = 'pursue'; this.stateT = 0; this.pursueT = 0;
          UI.dialogue('🎄', '"Three hundred years I stood at the middle of the song. First lit, last dark, EVERY winter. Then the song stopped — and nobody came to take me down. The grove is closed, little candle. Go out."');
        }
        break;
      }
      case 'pursue': {
        // the quake-step shamble: slow, huge, inevitable. His body is a SOFT WALL — the stomps are the attack.
        this.pursueT += dt;
        if(pl){
          const dx = pl.pos.x-p.x;
          if(Math.abs(dx)>1.4) p.x += Math.sign(dx)*this.chaseSp*dt;
          p.x = clamp(p.x, -19, 19);
          const d = pl.pos.x-p.x;   // the polite furniture shove
          if(Math.abs(d)<2.7 && Math.abs(pl.pos.z)<2.0 && pl.pos.y<5.0){
            pl.pos.x += (Math.sign(d)||-this.facing)*(2.7-Math.abs(d))*dt*5;
          }
        }
        this._walkAnim(dt, 1);
        if(this.pursueT>0.6 && pl && (Math.abs(pl.pos.x-p.x)<7.5 || this.pursueT>3.5)){
          if(this.queue.length===0){ this._sy0 = this.body.position.y; this.state='settle'; this.stateT=0; }
          else this._beginAction();
        }
        break;
      }
      case 'stepwind': {
        // the root rises — the glow at the stomp point grows for the FULL 0.7s. Fixed target, honest glow.
        const k = Math.min(1, this.stateT/0.7);
        this.rootF.position.y = 1.5 + Math.sin(k*Math.PI*0.5)*1.1;
        this.rootF.rotation.z = -0.55*k;
        this.body.rotation.z = -0.1*k;
        this.stepGlow.position.x = this._sx;
        this.stepGlow.material.opacity = k*0.5;
        this.stepGlow.scale.setScalar(0.4+k*1.0);   // visual r ≈ 1.54 at full — matches the 1.5 root band
        if(this.stateT>=0.7){
          this._stepSlam();
          this.state = 'stepslam'; this.stateT = 0;
        }
        break;
      }
      case 'stepslam': {
        // the root is down, the floor is ringing, the stride carries him onto it
        this.rootF.position.y = damp(this.rootF.position.y, 1.5, 18, dt);
        this.rootF.rotation.z = damp(this.rootF.rotation.z, 0, 12, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 8, dt);
        p.x = damp(p.x, clamp(this._sx - this.facing*1.2, -19, 19), 8, dt);
        if(this.stateT>0.45){
          this.rootF.position.y = 1.5; this.rootF.rotation.z = 0;
          this.state = 'pursue'; this.stateT = 0; this.pursueT = 0;
        }
        break;
      }
      case 'lobwind': {
        // 0.7s GLINT — every dead ornament shivers with borrowed light; the boughs wind up
        const k = Math.min(1, this.stateT/0.7);
        for(const m of this.tierMats) m.emissiveIntensity = 0.12 + Math.abs(Math.sin(this.stateT*22))*0.55*k;
        this.body.rotation.z = -0.07*k;
        if(this.stateT>=0.7){
          for(const m of this.tierMats) m.emissiveIntensity = 0.12;
          this.state = 'lob'; this.stateT = 0;
        }
        break;
      }
      case 'lob': {
        // 3 ornaments on the fixed spacing (0, 0.35, 0.7) — ≤3 aloft, see the budget header
        while(this._lobsFired<3 && this.stateT>=this._lobsFired*0.35){
          this._lobOrnament(this._targets[this._lobsFired], this._lobsFired);
          this._lobsFired++;
          this.tiers[1].rotation.z = 0.08;   // the bough flicks
        }
        this.tiers[1].rotation.z = damp(this.tiers[1].rotation.z, 0, 8, dt);
        this.body.rotation.z = damp(this.body.rotation.z, 0, 6, dt);
        if(this.stateT>1.0){ this.tiers[1].rotation.z = 0; this.state='pursue'; this.stateT=0; this.pursueT=0; }
        break;
      }
      case 'spinwind': {
        // 0.8s full-body telegraph: the boughs DRAW IN (the shared damp block does the easing) — reads from orbit
        this._tierIn = Math.min(1, this.stateT/0.8);
        this.body.rotation.z = Math.sin(this.stateT*18)*0.03;
        if(this.stateT>=0.8){
          this._tierIn = 1;
          this.state = 'spin'; this.stateT = 0; this._waveFired = false;
          AUDIO.bossRoar();
        }
        break;
      }
      case 'spin': {
        // he SPINS, shedding the needle-wave — one wave per spin, fired on a fixed beat
        this.body.rotation.y += 13*dt;
        if(!this._waveFired && this.stateT>=0.12){
          this._waveFired = true;
          this._spawnRing(p.x, true);
          G.camc.shake(0.35, 0.3);
          AUDIO.noise && AUDIO.noise({t:0.5, vol:0.12, fFrom:900, fTo:200});
        }
        if((this.t*14|0)!==this._spinTick){ this._spinTick = this.t*14|0;
          G.fx.spawn(new THREE.Vector3(p.x+Math.sin(this.t*9)*2.5, 1.2+Math.sin(this.t*13)*0.8, 0.5), 0x2a5c40, 1, {speed:3, life:0.35}); }
        if(this.stateT>0.9){
          this.state = 'spinout'; this.stateT = 0;
          this.body.rotation.y = this.body.rotation.y % TAU;
          if(this.body.rotation.y>Math.PI) this.body.rotation.y -= TAU;
        }
        break;
      }
      case 'spinout': {
        // the boughs breathe back out; the world stops turning
        this._tierIn = Math.max(0, 1-this.stateT/0.4);
        this.body.rotation.y = damp(this.body.rotation.y, 0, 8, dt);
        if(this.stateT>0.5){
          this.body.rotation.y = 0; this._tierIn = 0;
          this.state = 'pursue'; this.stateT = 0; this.pursueT = 0;
        }
        break;
      }
      case 'settle': {
        // the rotation is spent — he eases down, winded, the knot-face drooping into jump-reach
        const k = Math.min(1, this.stateT/0.5);
        this.body.position.y = lerp(this._sy0||0, -0.7, k);
        this.body.rotation.z = -0.08*k;
        if(this.stateT>=0.5) this._enterWinded();
        break;
      }
      case 'winded': {
        // THE WINDOW — knot only, hitCD spaces the pips; the boss runs its own stomp/spin detection
        this.body.position.y = -0.7 + Math.sin(this.t*2.2)*0.06;   // the huge weary breathing
        this.body.rotation.z = -0.08 + Math.sin(this.t*1.7)*0.02;
        if((this.t*2|0)!==this._huffTick){ this._huffTick = this.t*2|0;
          AUDIO.noise && AUDIO.noise({t:0.4, vol:0.07, fFrom:120, fTo:70}); }
        if(this.stateT>this.windedLen){ this._riseY0 = this.body.position.y; this.state='riseup'; this.stateT=0; }
        break;
      }
      case 'riseup': {
        // up he creaks — a shudder, a rattle of dead glass, the pursuit resumes. Eases FROM the recorded
        // slump so there is never a pose pop (the stir discipline).
        const k = Math.min(1, this.stateT/0.6);
        this.body.position.y = lerp(this._riseY0!==undefined?this._riseY0:-0.7, 0, k);
        this.body.rotation.z = -0.08*(1-k) + Math.sin(this.stateT*14)*0.03*(1-k);
        if(this.stateT>=0.6){
          this.body.position.y = 0; this.body.rotation.z = 0;
          if(this.queue.length===0) this.queue = this.actions.slice();   // same order, every cycle, forever
          this.state = 'pursue'; this.stateT = 0; this.pursueT = 0;
        }
        break;
      }
      case 'remember': {
        // THE CALM — 5s. The star blazes, and for a moment he is three hundred years younger: swaying to
        // a song only he can hear, ornaments warming, the knot glowing the whole time. Hits count DOUBLE.
        const k = Math.min(1, this.stateT/0.5);
        this.body.position.y = lerp(this._remY0||0, -0.5, k) + Math.sin(this.t*1.8)*0.05;
        this.body.rotation.z = Math.sin(this.t*0.9)*0.04;   // the old sway — the waltz, remembered
        for(const m of this.tierMats) m.emissiveIntensity = damp(m.emissiveIntensity, 0.55, 3, dt);
        if((this.t*5|0)!==this._memTick){ this._memTick = this.t*5|0;
          G.fx.spawn(new THREE.Vector3(p.x+Math.sin(this.t*2.7)*2.2, 2.5+Math.sin(this.t*1.9)*1.5, 0.6), 0xffd98a, 1, {speed:1.0, life:0.9, gravity:-0.6}); }
        if(this.stateT>5.0){ this.state='shakeout'; this.stateT=0; }
        break;
      }
      case 'shakeout': {
        // the cold wins again — he shakes the crown until the star goes dark (once per phase, re-earn it)
        this.starG.rotation.z = Math.sin(this.stateT*26)*0.35*Math.max(0, 1-this.stateT/0.7);
        this.body.rotation.z = Math.sin(this.stateT*22)*0.05;
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        if(this.stateT>0.25 && !this._reDarked){ this._reDarked = true;
          this._darkStar();
          const sv = this.starWorld();
          G.fx.spawn(new THREE.Vector3(sv.x, sv.y, sv.z), 0x9aa4b8, 12, {speed:3, life:0.6});
          AUDIO.noise && AUDIO.noise({t:0.4, vol:0.12, fFrom:1200, fTo:150});
          UI.toast('❄️ The cold takes the star back — he shakes it out. (It can blaze again next phase.)');
        }
        for(const m of this.tierMats) m.emissiveIntensity = damp(m.emissiveIntensity, 0.12, 4, dt);
        if(this.stateT>0.7){
          this.starG.rotation.z = 0; this.body.rotation.z = 0; this._reDarked = false;
          this._riseY0 = this.body.position.y;
          this.state = 'riseup'; this.stateT = 0;
        }
        break;
      }
      case 'shift': {
        // the phase boundary — he rears TALLER and every dead ornament rattles. Never falls. Never fells.
        const k = Math.min(1, this.stateT/0.6);
        const up = Math.min(1, this.stateT/0.4);   // eases out of whatever slump first — no pose pop
        this.body.rotation.z = -0.3*Math.sin(k*Math.PI) - 0.06*Math.sin(this.stateT*11)*(1-k);
        this.body.position.y = lerp(this._shiftY0||0, 0, up) + 0.4*Math.sin(k*Math.PI);
        for(const m of this.tierMats) m.emissiveIntensity = 0.12 + Math.abs(Math.sin(this.stateT*14))*0.5*Math.max(0, 1-this.stateT/1.6);
        if(this.stateT>1.6){
          this.body.rotation.z = 0; this.body.position.y = 0;
          for(const m of this.tierMats) m.emissiveIntensity = 0.12;
          this._shiftDone();
        }
        break;
      }
      case 'plantscene': {
        // THE ENDING — no felling: a planting. State-machine driven (never setTimeout) so quits can't strand it.
        const T = this.stateT;
        // the grove's heart draws him — he shifts, settles, stays
        p.x = damp(p.x, 0, 0.7, dt);
        // beat 1 (0→1.0): he KNEELS — the great trunk sinks, the roots splaying wide
        const k1 = Math.min(1, T/1.0);
        this.body.position.y = lerp(this._plantY0||0, -1.0, k1);
        if(T<1.0) this.body.rotation.z = -0.12*k1;
        for(const rg of this.roots) rg.rotation.x = Math.sign(rg.position.z)*0.4*k1;
        // beat 2 (1.0): THE PLANTING — the roots drive down, and the ground ACCEPTS them
        if(T>1.0 && !this._planted){ this._planted = true;
          AUDIO.poundHit();
          G.camc.shake(0.5, 0.5);
          G.fx.spawn(new THREE.Vector3(p.x, 0.3, 0), 0x3c2f22, 18, {speed:4, life:0.6, gravity:4});
          G.fx.spawn(new THREE.Vector3(p.x, 0.2, 0), 0xdfe8f8, 12, {speed:3, life:0.5});
        }
        if(T>1.0){
          for(const rg of this.roots) rg.position.y = damp(rg.position.y, 0.7, 4, dt);
          this.body.rotation.z = damp(this.body.rotation.z, 0, 3, dt);
        }
        // beat 3 (1.4→2.9): tier by tier, bottom to crown, the ornaments REMEMBER their light
        for(let ti=0; ti<4; ti++){
          if(T>1.4+ti*0.5 && !this._tierLit[ti]){ this._tierLit[ti] = true;
            this.tierMats[ti].emissiveIntensity = 1.0;
            AUDIO.tone && AUDIO.tone({f:[523,659,784,1046][ti], type:'sine', t:0.5, vol:0.14});
            G.fx.spawn(new THREE.Vector3(p.x, this._tierY[ti]-1.0, 0.6), [W9PAL.ornR,W9PAL.ornG,W9PAL.ornE,0x7ae8ff][ti], 10, {speed:2.5, life:0.6});
            G.camc.shake(0.12, 0.2);
          }
        }
        // beat 4 (3.4): THE STAR — last, and brightest. The first tree is LIT.
        if(T>3.4 && !this._starLit){ this._starLit = true;
          AUDIO.goldPumpkin && AUDIO.goldPumpkin();
          G.camc.shake(0.4, 0.5);
          const sv = this.starWorld();
          G.fx.spawn(new THREE.Vector3(sv.x, sv.y, sv.z), 0xffd23f, 30, {speed:6, life:1.0});
          candyBurst(G, new THREE.Vector3(p.x+2.5, 1.5, 0), 24);
        }
        if(this._starLit){
          this.starM.emissiveIntensity = 1.5 + Math.sin(this.t*6)*0.3;
          this.starHalo.material.opacity = 0.45 + Math.sin(this.t*4)*0.1;
          // the arena garlands take the light back too, and paper stars drift down over the snow
          for(const m of this.garlandMats) m.emissiveIntensity = damp(m.emissiveIntensity, 1.0, 2, dt);
          if((T*7|0)!==this._paperTick){ this._paperTick = T*7|0;
            G.fx.spawn(new THREE.Vector3(p.x+Math.sin(this._paperTick*2.7)*9, 8.5, Math.sin(this._paperTick*1.3)*1.5),
              pick([0xf0e6c8,0xffd98a,0xffffff]), 1, {speed:0.5, life:1.6, gravity:0.7}); }
        }
        if(T>4.1 && !this._toasted){ this._toasted = true;
          UI.toast('🎄 Old Tannenbaum stands where he always stood — at the center of it. The song picks back up.');
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
    this.shadow.visible = true;               // he never bursts, never vanishes — the grove keeps him
    this.shadow.position.set(p.x, 0.03, p.z);
  }

  _walkAnim(dt, k){
    // the quake gait — heavy bob, alternating root-legs, the dark star nodding along (micro-motion law);
    // each footfall thuds through the floor (cosmetic ticks, fixed rhythm — the SHUDDER, not the attack)
    const w = 2.0;
    this.body.position.y = Math.abs(Math.sin(this.t*w))*0.14*k;
    this.body.rotation.z = Math.sin(this.t*w)*0.04*k;
    for(let i=0;i<this.roots.length;i++) this.roots[i].rotation.z = Math.sin(this.t*w+i*Math.PI)*0.3*k;
    this.starG.rotation.z = Math.sin(this.t*w*0.5)*0.06;
    if((this.t*(w/Math.PI)|0)!==this._stepTick){ this._stepTick = this.t*(w/Math.PI)|0;
      AUDIO.noise && AUDIO.noise({t:0.14, vol:0.08, fFrom:70, fTo:40});
      this.G.camc.shake(0.07, 0.12);
      this.G.fx.spawn(new THREE.Vector3(this.pos.x+this.facing*0.6, 0.2, 0.4), 0xdfe8f8, 2, {speed:1.5, life:0.3});
    }
  }
}

// =============================== ARENA ===============================
function buildBossArena9(G){
  const S = G.scene;
  const x1 = -23, x2 = 23;   // the ~46u GROVE — the clearing where the first tree was ever decorated
  // ---- snow floor — SOLID (the fight rings ACROSS the floor; it never opens) ----
  G.world.addBox(0, -1, 0, 60, 1, 12, {});
  const floorG = new THREE.Group();
  const slab = mesh('box',[60,1,12], mat(W9PAL.snow)); slab.position.y = -0.5; floorG.add(slab);
  const soil = mesh('box',[60,0.3,12], mat(W9PAL.barkD)); soil.position.y = -1.1; floorG.add(soil);
  const lip = mesh('box',[60,0.12,0.3], mat(0xffffff)); lip.position.set(0,0.02,2.6); floorG.add(lip);
  S.add(bakeGroup(floorG));
  w9Clutter(G, x1+1, x2-1, 'forest');   // fallen ornaments, holly, pinecones — the festival's litter, baked
  // ---- rim walls — snowbanks + hedge pines (colliders + baked chaos), nobody leaves the grove ----
  G.world.addBox(-25.4, 0, 0, 4, 16, 12, {});
  G.world.addBox(25.4, 0, 0, 4, 16, 12, {});
  const walls = new THREE.Group();
  for(const s of [-1,1]) for(let i=0;i<4;i++){
    const bank = mesh('sph',[rand(1.4,2.4),8,6], mat(i%2?W9PAL.snow:0xcfd8ec));
    bank.scale.y = rand(0.5,0.8); bank.position.set(s*(23.6+i*0.7), rand(0.2,1.2), rand(-2.2,1.4)); walls.add(bank);
    const hedge = mesh('cone',[rand(1.2,2.0),rand(3,5.5+i),6], mat(i%2?W9PAL.pine:W9PAL.pineD));
    hedge.position.set(s*(23.8+i*0.8), rand(1.2,2.4), rand(-2.5,1)); walls.add(hedge);
  }
  S.add(bakeGroup(walls));

  // ---- TWO STONE CHIMNEYS at the flanks — the woodcutters' old camp stacks; their updrafts are the
  // star's ladder (the kit builds the stack + smoke lane; top 9.0 floats Pip at crown height) ----
  w9Updraft(G, -20.5, {w:2.2, top:9.0});
  w9Updraft(G,  20.5, {w:2.2, top:9.0});
  // camp furniture so the chimneys read as HEARTHS, not props (quiet storytelling: someone kept the
  // fires burning by the closed grove all this time, waiting for the tree to come back)
  const camp = new THREE.Group();
  for(const s of [-1,1]){
    const bench = mesh('box',[1.4,0.16,0.5], mat(W9PAL.bark)); bench.position.set(s*18.6, 0.45, -1.9); camp.add(bench);
    for(const bx of [-0.5,0.5]){ const legB = mesh('box',[0.12,0.4,0.4], mat(W9PAL.barkD)); legB.position.set(s*18.6+bx, 0.2, -1.9); camp.add(legB); }
    const kettle = mesh('sph',[0.24,7,6], mat(0x3a3444)); kettle.scale.y = 0.8; kettle.position.set(s*19.6, 0.2, -1.6); camp.add(kettle);
    const logs = mesh('cyl',[0.14,0.14,0.9,5], mat(W9PAL.barkD)); logs.rotation.z = Math.PI/2; logs.position.set(s*17.6, 0.14, -1.6); camp.add(logs);
  }
  S.add(bakeGroup(camp));

  // ---- GARLANDS OVERHEAD — four post-pines with sagging strands across the grove. The bulbs share ONE
  // bespoke material the finale relights (boss8's blazeMats idiom); strands/posts are baked. ----
  const garlandM = new THREE.MeshLambertMaterial({color:0xffd98a, emissive:0xffd98a, emissiveIntensity:0.16});
  const garlandMats = [garlandM];
  const postXs = [-15, -5, 5, 15];
  const posts = new THREE.Group();
  for(const px2 of postXs){
    const pole = mesh('cyl',[0.16,0.24,7.4,6], mat(W9PAL.barkD)); pole.position.set(px2, 3.7, -2.2); posts.add(pole);
    const tuft = mesh('cone',[0.7,1.3,6], mat(W9PAL.pine)); tuft.position.set(px2, 7.6, -2.2); posts.add(tuft);
    const capS = mesh('sph',[0.3,6,5], mat(W9PAL.snow)); capS.scale.y = 0.4; capS.position.set(px2, 8.2, -2.2); posts.add(capS);
  }
  for(let gi=0; gi<postXs.length-1; gi++){
    const xA = postXs[gi], xB = postXs[gi+1];
    for(let sg=0; sg<7; sg++){ const t2 = sg/6;
      const strand = mesh('sph',[0.09,4,4], mat(0x1e3a2a));
      strand.position.set(lerp(xA,xB,t2), 7.2-Math.sin(t2*Math.PI)*1.2, -2.1); posts.add(strand);
    }
  }
  S.add(bakeGroup(posts));
  for(let gi=0; gi<postXs.length-1; gi++){   // the bulbs — un-baked, ~12 tiny draws; garlandM is the finale's dial
    const xA = postXs[gi], xB = postXs[gi+1];
    for(let sg=0; sg<4; sg++){ const t2 = 0.125+sg/4*0.75;
      const bulb = new THREE.Mesh(geo('sph',0.11,5,4), garlandM);
      bulb.position.set(lerp(xA,xB,t2), 7.0-Math.sin(t2*Math.PI)*1.2, -2.05); S.add(bulb);
    }
  }

  w9Parallax(S, x1, x2);   // the great decorated pines watch from the dark — his children, arguably

  // ---- foreground silhouettes (depth framing law) — two young pines, never lit ----
  for(const [fx2,fh] of [[-10,2.8],[12,3.4]]){
    const sil = mesh('cone',[1.1,fh,5], mat(0x0c1622)); sil.position.set(fx2, fh/2-0.2, 3.6); S.add(sil);
  }

  // ---- THE SIGN outside the gate (the hint; the boss toasts its text on approach) ----
  const deco = new THREE.Group();
  { const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(W9PAL.barkD)); pole.position.set(-21.4,0.7,-1.7);
    const board = mesh('box',[1.7,0.8,0.1], mat(0x5a4a38)); board.position.set(-21.4,1.5,-1.7); crook(board,0.05);
    const capS2 = mesh('box',[1.8,0.1,0.16], mat(W9PAL.snow)); capS2.position.set(-21.4,1.95,-1.7);
    deco.add(pole, board, capS2); }
  S.add(bakeGroup(deco));

  // ---- the deep forest night, wired (contract order per the kit; the boss owns its own lifecycle) ----
  G.scene.background = new THREE.Color(W9PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W9PAL.fog);
  G.spawnPoint.set(-17, 1, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -12;           // formality: the floor is solid and the grove is walled
  G.bats = makeBats(G.scene, 4, 28);
  G.amb = w9Ambience(S, x1, x2);
  G.lightPools = G.lightPools || [];
  // lights budget: 0 point lights, always — star/knot/ornaments/garland/chimney-embers are all emissive.
  G.boss = new Tannenbaum(G, {garlandMats});
}

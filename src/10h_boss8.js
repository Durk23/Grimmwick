// ============ BOSS 8 — PRISMUS THE UNLIT (Frostmere · Icicle Mines guardian) ============
// A COLOSSAL crystal golem who SWALLOWED THE MINE'S LIGHT — his thousand facets are all DULL, and he
// cannot bear to give the glow back. The arena is the CRYSTAL CATHEDRAL: dark rock, great dead columns,
// the ceiling-constellation the only glitter left... and FOUR UNLIT MINE LANTERNS on posts around the rim.
// THE FIGHT'S GENIUS — LIGHT REVEALS HIM: with 0 lanterns burning he is dull and INVULNERABLE (hits CLINK
// off; a toast teaches once). Each lit lantern REFRACTS through him: at 1+ lit, ONE WEAK FACET glows on
// his body (it MIGRATES to a new spot each phase — chest → drill shoulder → crown, each a taller ask).
// Hit the lit facet (stomp/spin) during his RECOVERY windows = 1 pip. HE HATES IT: on a fixed per-phase
// clock he SNUFFS a lantern with a dark pulse. The rhythm: tend your lights, dodge the wave, punish.
//   PHASE 1 (3 hits) — slow stomping pursuit + FACET VOLLEY on a fixed clock: 3 crystal shards arc out,
//                      0.7s glint telegraph + landing-glow discs that grow for the FULL flight.
//   PHASE 2 (4 hits) — adds the DRILL-ARM SWEEP (0.8s wind-up — the arm BECOMES a drill — then a low
//                      horizontal sweep you jump); volleys tighten; snuffs every ~11s.
//   PHASE 3 (5 hits) — adds 2 GemMimic guards once + CEILING SHARDS (stalactite drops with the learned
//                      0.7s shimmer + landing glow, one riding each volley); sweeps come in PAIRS.
// SECRET TAKEDOWN (the speedrun meta): ALL 4 LANTERNS LIT AT ONCE → TOTAL REFRACTION — he lights up like
// a chandelier and staggers BLINDED by his own brilliance: a long 5s stun, the weak facet stays lit
// through it, and hits count DOUBLE. Keeping all 4 alive against his snuffing IS the skill. Once per
// phase; the hp-9/hp-5 phase boundaries interrupt a stagger, so one stagger can at most clear the
// CURRENT phase (3/4/5 pips) — a shortcut you must re-earn against ever-faster snuffing. When it ends he
// flinches back into the dark and snuffs TWO lanterns. Hints: the 8-5 sign, and TWO KNOCKER SPRITES
// tapping excitedly on the wall beside the western lantern (deco-grade ticker — the miners know).
// DEFEAT (wholesome — the series signature): he doesn't shatter. He GIVES THE LIGHT BACK — every
// swallowed glow streams out of him into the walls, the whole cathedral BLAZES, and he rises to settle
// into the ceiling as its permanent chandelier: the mines' keeper of lights. ~4.5s cutscene run on the
// state machine (never setTimeout). G._bossEndT is stamped at the last hit (the w5 idiom); the light-
// giving is a gift, not a timer. Then G.onBossDefeated() once, NO arguments (district = G.bossDistrict).
//
// ENGINE CONTRACT (mirrors 10g_boss7 exactly): G.boss singleton with update(dt), NOT an ents entity.
// Runs its OWN stomp/spin detection on the weak facet (the player's generic loops only reach ents) and
// exposes onPlayerPound(pos) — 06_player calls it on every landed pound. Boss bar via UI.showBossBar /
// updateBossBar (12 hit-pips: 3+4+5, boundaries at hp 9 and hp 5). Adds (GemMimics) ARE ents —
// stompable, drop candy, cleared on defeat. Projectiles (shards/stalactites) are ents with _bossProj
// (all meshes live in e.group so EntityMgr owns removal). HEARTS-ALWAYS: every attack costs exactly 1
// heart (shard, sweep, stalactite, mimic); his stomping body is a SOFT WALL, never a hit; the snuff
// pulse is pure economy, never damage. All telegraphs ≥ the 0.65s floor (sweepWind2 = 0.65 exactly, the
// razor's edge of legal). DETERMINISM: action rotations are FIXED per phase; snuff clock fixed-period
// from phase start; shard targets / sweep direction / stalactite drop are player-reactive state-machine
// reads captured AT the telegraph (like every boss); the doomed lantern = the lit one nearest HIM at the
// gather (positional, readable); rand() (seeded per area) is cosmetic only.
// DIFFICULTY (OWNER BAND): BEYOND-D5 guardian — peer of Grumble and Ursa, one notch under a finale.
// Pressure comes from LANTERN UPKEEP under the waves, never damage sponges.
// THREAT BUDGET: ≤4 simultaneous threats at any instant, pinned per phase —
//   P1: volley wave ≤3 shards aloft (launches 0.35s apart, flight 1.0s → shard 1 lands at t=1.0, shard 3
//       launches at t=0.7: a 0.3s triple at worst) = 3. Boss body serializes everything else. ≤4. ✓
//   P2: rotation ALTERNATES volley(3)/sweep(1) — one state machine, never simultaneous → ≤3. ✓
//   P3 (guards up): volleys are WITHHELD while a GemMimic guard lives (he lets his treasure fight) —
//       sweep 1 + mimics 2 = 3. ✓
//   P3 (full):     volley wave = 3 shards + 1 ceiling stalactite (exactly one per wave, riding the
//       volley clock: 0.7s shimmer + 0.79s fall = done at t≈1.49, inside the wave's own 1.7s) = 4.
//       Paired sweeps serialize through the ONE drill arm = 1. Snuff pulse is harmless. ≤4. ∎
// FACET REACH (comparable-heights law — every window is comfortably reachable):
//   recover slump lowers the body 1.1 → facet world-y ≈ P1 2.0 (ground spin) · P2 3.25 (tap-jump 1.8 apex
//   reaches the spin band) · P3 4.25 (double-jump 3.3 apex — the mastery ask). Stagger doubles him over
//   (-1.4) → 1.7 / 2.95 / 3.95: every phase's facet stays inside the double-jump envelope. ✓

const PRISMUS_FACET_SPOTS = [   // body-local weak-facet homes, one per phase (the migration)
  {x:0.55, y:3.15, z:0.95},     // P1 — the chest panel (ground-level spin)
  {x:1.50, y:4.40, z:0.75},     // P2 — the drill shoulder (a hop)
  {x:0.15, y:5.40, z:0.85},     // P3 — the brow of the crown (double-jump territory)
];

class Prismus {
  constructor(G, opts={}){
    this.G = G;
    this.maxHp = 12; this.hp = 12;           // 3 (P1) + 4 (P2) + 5 (P3) — shifts at hp 9 and hp 5
    this.dead = false;
    this.phase = 1;
    this.pos = new THREE.Vector3(10, 0, 0);
    this.state = 'intro'; this.stateT = 0;
    this.t = 0;
    this.facing = -1;                        // he looms at the east end, dull as the dark
    this.vulnerable = false; this.hitCD = 0;
    this.stagger = false;                    // TOTAL REFRACTION — the double-pip window
    this._staggerUsed = {1:false, 2:false, 3:false};   // once per phase (the boundary caps its value)
    this.queue = [];                         // the phase's fixed action rotation (refilled each cycle)
    this.snuffT = 0;                         // the snuff clock — fixed period per phase, fires from advance
    this.guards = [];                        // phase-3 GemMimic adds (ents)
    this.blazeMats = opts.blazeMats || [];   // arena crystal materials — the defeat cranks them to BLAZE
    this._swingClaimed = false; this._clinkClaim = false;
    this._signShown = false; this._clinkToasted = false; this._facetToasted = false;
    this._reelToasted = false; this._snuffToasted = false; this._facetSeen = false;
    this.buildRig();
    this.buildLanterns();
    this.buildBlaze();
    this._fv = new THREE.Vector3();          // reusable facet-world scratch
    this.shadow = blobShadow(3.2);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('PRISMUS THE UNLIT', this.hp, this.maxHp); }
    AUDIO.bossRoar();                        // stone grinding on stone, five stories of it
  }

  // ---------------------------------------------------------------- rig
  buildRig(){
    // a mountain that decided to stand up. Rig forward = LOCAL +X; group.rotation.y flips 0/π so he
    // reads in clean side profile. EVERY animatable material is bespoke — never mutate the mat() caches.
    this.group = new THREE.Group();
    const body = new THREE.Group();
    this.rockM  = new THREE.MeshLambertMaterial({color:0x3a3448, emissive:0x7ae8ff, emissiveIntensity:0.03});
    this.rockDM = new THREE.MeshLambertMaterial({color:0x241c30, emissive:0x7ae8ff, emissiveIntensity:0.02});
    // his thousand facets — ALL DULL (this one shared material is the whole tragedy, and the finale's dial)
    this.facetM = new THREE.MeshLambertMaterial({color:0x4a4462, emissive:0xb08aff, emissiveIntensity:0.06, transparent:true, opacity:0.95});
    const pelvis = mesh('box',[2.6,1.2,1.9], this.rockDM); pelvis.position.y = 2.0; body.add(pelvis);
    const torso = mesh('box',[3.0,2.2,2.2], this.rockM); torso.position.y = 3.5; torso.rotation.y = 0.1; body.add(torso);
    const chest = mesh('box',[2.2,1.6,1.7], this.rockDM); chest.position.set(0.4,3.8,0.45); chest.rotation.z = 0.08; body.add(chest);
    for(const s of [-1,1]){ const sh = mesh('sph',[0.95,9,8], this.rockM); sh.position.set(s*1.75,4.45,0); body.add(sh); }
    // ---- the head + the dead crown ----
    this.headG = new THREE.Group(); this.headG.position.set(0.25,5.5,0);
    const skull = mesh('box',[1.35,1.1,1.25], this.rockM); this.headG.add(skull);
    for(let i=0;i<4;i++){ const spike = mesh('cone',[0.26-((i%2)*0.06), 0.8+((i*3)%3)*0.25, 5], this.facetM);
      spike.position.set(-0.45+i*0.3, 0.75, ((i%2)?0.22:-0.22)); spike.rotation.z = -0.2+i*0.13; this.headG.add(spike); }
    // eyes: two hoarded glimmers — the only light he kept for himself (they flare when the light fights back)
    this.eyeM = new THREE.MeshLambertMaterial({color:0x2a2036, emissive:0xffb85e, emissiveIntensity:0.35});
    for(const s of [-1,1]){ const eye = mesh('box',[0.16,0.22,0.1], this.eyeM); eye.position.set(0.45,0.05,s*0.34); eye.rotation.y = 0.15; this.headG.add(eye); }
    body.add(this.headG);
    // ---- arms: left hangs, RIGHT is the drill arm ----
    this.armL = new THREE.Group(); this.armL.position.set(-1.75,4.45,0);
    const upL = mesh('cyl',[0.42,0.5,1.9,7], this.rockDM); upL.position.y = -0.95; this.armL.add(upL);
    const fistL = mesh('sph',[0.62,8,7], this.rockM); fistL.position.y = -2.0; this.armL.add(fistL);
    body.add(this.armL);
    this.armR = new THREE.Group(); this.armR.position.set(1.75,4.45,0);
    const upR = mesh('cyl',[0.42,0.5,1.9,7], this.rockDM); upR.position.y = -0.95; this.armR.add(upR);
    const fistR = mesh('sph',[0.66,8,7], this.rockM); fistR.position.y = -2.0; this.armR.add(fistR);
    body.add(this.armR);
    // ---- legs: two quarry pillars ----
    for(const s of [-1,1]){ const leg = mesh('cyl',[0.62,0.74,1.6,7], this.rockDM); leg.position.set(s*0.85,0.8,0); body.add(leg); }
    // ---- the thousand facets (well, eighteen — the rest are implied): dull cones studding the mass.
    // Index-math placement, zero RNG — he is IDENTICAL every attempt (determinism rule). ----
    for(let i=0;i<18;i++){
      const fc = mesh('cone',[0.16+((i*7)%3)*0.05, 0.34+((i*5)%4)*0.13, 5], this.facetM);
      const ring = i%3, a = (i/18)*TAU + ring*0.35;
      fc.position.set(Math.cos(a)*(1.15+ring*0.25), 2.2+((i*11)%14)*0.24, Math.sin(a)*(0.95+ring*0.14));
      fc.rotation.z = Math.cos(a)*0.9; fc.rotation.x = -Math.sin(a)*0.9;
      body.add(fc);
    }
    // ---- THE WEAK FACET — one bright panel, repositioned each phase (migration). Own material + halo. ----
    this.weakM = new THREE.MeshLambertMaterial({color:0xdff4ff, emissive:0x7ae8ff, emissiveIntensity:0});
    this.weakFacet = new THREE.Mesh(geo('box',0.72,0.72,0.24), this.weakM);
    const sp0 = PRISMUS_FACET_SPOTS[0];
    this.weakFacet.position.set(sp0.x, sp0.y, sp0.z); this.weakFacet.rotation.z = 0.6; this.weakFacet.rotation.x = 0.3;
    this.weakFacet.visible = false; body.add(this.weakFacet);
    this.facetHalo = new THREE.Mesh(geo('sph',0.95,10,8), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0, depthWrite:false}));
    this.facetHalo.position.copy(this.weakFacet.position); body.add(this.facetHalo);
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // ---- THE SWEEP DRILL (scene-level, hidden until the wind): shaft + fluted bit, telescopes the lane ----
    this.drillRig = new THREE.Group();
    this.drillShaft = mesh('cyl',[0.3,0.34,1,7], new THREE.MeshLambertMaterial({color:W8PAL.brass, emissive:W8PAL.brassD, emissiveIntensity:0.3}));
    this.drillShaft.rotation.z = Math.PI/2; this.drillRig.add(this.drillShaft);
    this.drillSpin = new THREE.Group();
    const bit = mesh('cone',[0.44,1.1,8], new THREE.MeshLambertMaterial({color:W8PAL.steel, emissive:0x7ae8ff, emissiveIntensity:0.35}));
    bit.rotation.z = -Math.PI/2; bit.position.x = 0.55; this.drillSpin.add(bit);
    for(let i=0;i<3;i++){ const flute = mesh('box',[0.9,0.09,0.09], mat(W8PAL.brassD)); flute.rotation.x = i/3*TAU; this.drillSpin.add(flute); }
    this.drillRig.add(this.drillSpin);
    this.drillRig.visible = false;
    this.G.scene.add(this.drillRig);
    // the sweep's low lane telegraph — an honest glow strip that grows for the FULL wind-up
    this.sweepGlow = new THREE.Mesh(new THREE.PlaneGeometry(1,1.9,1,1), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.sweepGlow.rotation.x = -Math.PI/2; this.sweepGlow.position.y = 0.08;
    this.G.scene.add(this.sweepGlow);
    // the snuff pulse — a swallowing dark orb with a violet rim (his oldest habit)
    this.darkOrb = new THREE.Group();
    const core = mesh('sph',[0.34,9,8], new THREE.MeshBasicMaterial({color:0x0c0918}));
    const rim = new THREE.Mesh(geo('sph',0.5,9,8), new THREE.MeshBasicMaterial({color:0x9a5fd0, transparent:true, opacity:0.35, depthWrite:false}));
    this.darkOrb.add(core, rim); this.darkOrb.visible = false;
    this.G.scene.add(this.darkOrb);
  }

  buildLanterns(){
    // FOUR MINE LANTERNS on posts around the rim — the W6Lantern verb (spin/pound BESIDE it to light it),
    // now snuffable. Each carries its own PointLight: 4 max, ≤ the 6-light budget with room to spare.
    const S = this.G.scene;
    this.lanterns = [];
    for(const lx of [-19, -7, 7, 19]){
      const g = new THREE.Group();
      const post = mesh('cyl',[0.08,0.12,2.1,6], mat(W8PAL.timberD)); post.position.set(lx,1.05,-1.2); g.add(post);
      const brace = mesh('box',[0.5,0.1,0.12], mat(W8PAL.timber)); brace.position.set(lx,1.9,-0.95); brace.rotation.x = 0.5; g.add(brace);
      const cage = mesh('box',[0.46,0.54,0.46], mat(0x2a2438)); cage.position.set(lx,2.2,-0.7); g.add(cage);
      const flameM = new THREE.MeshLambertMaterial({color:0xffd98a, emissive:0xffb85e, emissiveIntensity:1});
      const flame = new THREE.Mesh(geo('sph',0.16,7,6), flameM); flame.position.set(lx,2.2,-0.7); flame.visible = false; g.add(flame);
      const halo = new THREE.Mesh(geo('sph',0.55,8,7), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0, depthWrite:false}));
      halo.position.set(lx,2.2,-0.7); g.add(halo);
      const light = new THREE.PointLight(0xffc87a, 0, 9); light.position.set(lx,2.4,-0.4); g.add(light);
      S.add(g);
      this.lanterns.push({x:lx, group:g, flame, flameM, halo, light, lit:false, doomT:0, litT:0});
    }
  }

  buildBlaze(){
    // the cathedral's answer for the finale — one big additive flash plane behind the parallax midline
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(150, 60, 1, 1),
      new THREE.MeshBasicMaterial({color:0xcfeaff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
    this.flash.position.set(0, 14, -26.5);
    this.G.scene.add(this.flash);
    this.flashT = 0;
  }

  // ---------------------------------------------------------------- helpers
  litCount(){ let n=0; for(const l of this.lanterns) if(l.lit) n++; return n; }
  facetWorld(){ this.weakFacet.getWorldPosition(this._fv); return this._fv; }
  mimicAlive(){ for(const m of this.guards) if(!m.dead) return true; return false; }

  onPlayerPound(pos){
    // a pound landing on/near the LIT FACET during a window counts (boss1 parity, facet-only discipline)
    if(!this.vulnerable) return;
    const fv = this.facetWorld();
    if(Math.hypot(pos.x-fv.x, pos.z-fv.z) < 2.6 && Math.abs(pos.y-fv.y) < 2.2) this.takeHit();
  }

  takeHit(){
    if(this.dead || !this.vulnerable || this.hitCD>0) return;
    const was = this.hp;
    this.hp = Math.max(0, this.hp - (this.stagger?2:1));   // TOTAL REFRACTION doubles every pip
    this.hitCD = 0.6;
    AUDIO.bossHit();
    this.G.hitstop = this.stagger ? 0.12 : 0.09;
    this.G.camc.shake(0.5, 0.4);
    const fv = this.facetWorld();
    this.G.fx.spawn(new THREE.Vector3(fv.x, fv.y, fv.z), this.stagger?0xdff4ff:0x7ae8ff, this.stagger?26:16, {speed:5});
    UI.updateBossBar(this.hp);
    if(this.hp<=0){ this.defeat(); return; }
    // phase boundaries INTERRUPT a stagger — one stagger can never clear more than the current phase
    if(was>9 && this.hp<=9){ this._phaseShift(2); return; }
    if(was>5 && this.hp<=5){ this._phaseShift(3); return; }
    UI.toast(pick2([ '💎 "...it STINGS. The light stings."', '💎 "Give it back? It\'s MINE."', '💎 (A facet cracks. He hugs the glow tighter.)' ], this.hp));
  }

  _applyPhase(){
    // the tuning table, one place. BEYOND-D5 TUNE: he stays a slow mountain (lantern upkeep is the
    // pressure, never his feet); the waves tighten instead. All winds ≥ the 0.65s telegraph floor.
    // actions = the FIXED rotation per cycle — never RNG (determinism; his time feeds the boards).
    const P = [
      {sp:1.5, snuffP:14, recoverLen:2.2, spread:2.8, shardT:1.0,  actions:['volley']},
      {sp:1.8, snuffP:11, recoverLen:1.9, spread:2.2, shardT:0.9,  actions:['volley','sweep']},
      {sp:2.1, snuffP:10, recoverLen:1.7, spread:1.9, shardT:0.85, actions:['volley','sweep2']},
    ][this.phase-1];
    this.chaseSp = P.sp; this.snuffP = P.snuffP; this.recoverLen = P.recoverLen;
    this.spread = P.spread; this.shardT = P.shardT;
    this.actions = P.actions;
    this.queue = this.actions.slice();
  }

  _phaseShift(phase){
    // a phase boundary — he grinds TALLER, the facets ripple... and the weak facet MIGRATES.
    this.phase = phase;
    this.vulnerable = false;
    this._endStaggerVisuals();
    this._clearAttackVisuals();
    this.state = 'shift'; this.stateT = 0;
    this.snuffT = 0;
    AUDIO.bossRoar();
    this.G.camc.shake(0.55, 0.5);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, 4.5, 0), 0xb08aff, 22, {speed:4, life:0.7});
  }

  _shiftDone(){
    this._applyPhase();
    // THE MIGRATION — the old spot dulls, a new panel wakes somewhere taller
    const fvOld = this.facetWorld();
    this.G.fx.spawn(new THREE.Vector3(fvOld.x, fvOld.y, fvOld.z), 0x7ae8ff, 10, {speed:3, life:0.5});
    const sp = PRISMUS_FACET_SPOTS[this.phase-1];
    this.weakFacet.position.set(sp.x, sp.y, sp.z);
    this.facetHalo.position.copy(this.weakFacet.position);
    const fvNew = this.facetWorld();
    this.G.fx.spawn(new THREE.Vector3(fvNew.x, fvNew.y, fvNew.z), 0xdff4ff, 14, {speed:3, life:0.6});
    if(this.phase===2){
      UI.toast('💎 He grinds taller — the DRILL-ARM wakes! (...and the weak facet migrates.)');
    } else if(this.phase===3 && !this._guardsSpawned){
      this._guardsSpawned = true;
      // the one-time guard pair — fixed posts, spawnGrace per the clear-patch law (never a cheap hit).
      // Budget: while a guard lives his volleys are WITHHELD → sweep 1 + mimics 2 = 3 ≤ 4.
      const m1 = new GemMimic(this.G, -5, 0, 0, {phase:0,   wakeR:8});
      const m2 = new GemMimic(this.G,  5, 0, 0, {phase:1.3, wakeR:8});
      m1.spawnGrace = 1.0; m2.spawnGrace = 1.0;
      this.guards.push(this.G.ents.add(m1), this.G.ents.add(m2));
      UI.toast('💎 The cathedral trembles — his treasure WAKES, and the ceiling weeps shards!');
    }
    this.state = 'advance'; this.stateT = 0;
  }

  // ---------------------------------------------------------------- lanterns
  _lightLantern(l){
    l.lit = true; l.litT = 0.001; l.doomT = 0;
    l.flame.visible = true;
    l.light.intensity = 32;
    AUDIO.checkpoint && AUDIO.checkpoint();
    this.G.fx.spawn(new THREE.Vector3(l.x, 2.4, -0.6), 0xffc87a, 12, {speed:2.5, life:0.5});
    if(!this._facetToasted){ this._facetToasted = true;
      UI.toast('💎 The lanternlight REFRACTS through him — a WEAK FACET glows! Strike it when he reels!'); }
    // ALL FOUR AT ONCE → TOTAL REFRACTION (once per phase; mid-action interrupts are the drama)
    if(this.litCount()>=4 && !this._staggerUsed[this.phase] && !this.dead &&
       this.state!=='intro' && this.state!=='shift' && this.state!=='stagger' && this.state!=='snuff' && this.state!=='endscene'){
      this._enterStagger();
    }
  }

  _snuffLantern(l){
    l.lit = false; l.doomT = 0;
    l.flame.visible = false; l.halo.material.opacity = 0;
    l.light.intensity = 0;
    AUDIO.noise && AUDIO.noise({t:0.3, vol:0.13, fFrom:900, fTo:120});
    this.G.fx.spawn(new THREE.Vector3(l.x, 2.3, -0.6), 0x2a1a4e, 10, {speed:2, life:0.5});
    if(!this._snuffToasted){ this._snuffToasted = true; UI.toast('🕯️ He SNUFFS a lantern — relight it! Tend your lights!'); }
  }

  _doomedLantern(){
    // deterministic read: the lit lantern nearest HIM at the gather (positional, watchable, learnable)
    let best = null, bd = 1e9;
    for(const l of this.lanterns) if(l.lit){ const d = Math.abs(l.x-this.pos.x); if(d < bd-0.001){ bd = d; best = l; } }
    return best;
  }

  _updateLanterns(dt){
    const pl = this.G.player;
    for(const l of this.lanterns){
      if(l.lit){
        l.litT += dt;
        l.halo.material.opacity = 0.2 + Math.sin(this.t*3+l.x)*0.07;
        l.halo.scale.setScalar(1 + Math.sin(this.t*2.6+l.x)*0.12);
        l.flame.position.y = 2.2 + Math.sin(this.t*5+l.x)*0.03;   // micro-motion law: flames breathe
        if(l.doomT>0){ // the dark pulse gathers — the doomed flame flickers violet (the read)
          l.doomT += dt;
          l.flameM.emissiveIntensity = 0.4 + Math.abs(Math.sin(l.doomT*22))*0.8;
          l.flameM.color.setHex((l.doomT*12|0)%2 ? 0x9a5fd0 : 0xffd98a);
        } else { l.flameM.emissiveIntensity = 1; l.flameM.color.setHex(0xffd98a); }
      }
      // the relight verb — W6Lantern's exact idiom: spin/pound BESIDE the post
      if(!l.lit && !this.dead && pl && !pl.dead && (pl.attackT>0 || pl.pounding) &&
         Math.abs(pl.pos.x-l.x)<1.7 && Math.abs(pl.pos.z)<1.6){
        this._lightLantern(l);
      }
    }
  }

  // ---------------------------------------------------------------- TOTAL REFRACTION
  _enterStagger(){
    this._staggerUsed[this.phase] = true;
    this._clearAttackVisuals();
    this._stagY0 = this.body.position.y; this._stagR0 = this.body.rotation.z;   // ease FROM here — no pose pop
    this.state = 'stagger'; this.stateT = 0;
    this.stagger = true; this.vulnerable = true;
    this.snuffT = 0;                          // the snuff clock holds its breath — he can't see to snuff
    AUDIO.goldPumpkin && AUDIO.goldPumpkin();
    this.G.camc.shake(0.5, 0.55);
    this.flashT = 0.5;
    this.G.fx.spawn(new THREE.Vector3(this.pos.x, 4.5, 0), 0xdff4ff, 30, {speed:6, life:0.8});
    UI.toast('💎✨ TOTAL REFRACTION — blinded by his own brilliance!! Every hit counts DOUBLE!');
  }

  _endStaggerVisuals(){
    this.stagger = false;
    this.facetM.emissiveIntensity = 0.06;
    this.eyeM.emissiveIntensity = 0.35;
  }

  _endStagger(){
    this._endStaggerVisuals();
    this._clearAttackVisuals();   // unclutches his face — the arms fall home before the rise
    // he flinches back into the dark — TWO lights die at once (the angry, deterministic reset:
    // the two lit lanterns nearest him). Keeping four alive must be re-earned, every phase.
    for(let k=0;k<2;k++){ const l = this._doomedLantern(); if(l) this._snuffLantern(l); }
    UI.toast('💨 He flinches back into the dark — two lights die!');
    this._riseY0 = this.body.position.y;
    this.state = 'riseup'; this.stateT = 0; this.vulnerable = false;
  }

  _clearAttackVisuals(){
    this.drillRig.visible = false;
    this.sweepGlow.material.opacity = 0;
    this.darkOrb.visible = false;
    this.armR.rotation.z = 0; this.armL.rotation.z = 0;
  }

  // ---------------------------------------------------------------- actions
  _beginAction(){
    let act = this.queue.shift();
    // P3 budget substitution: volleys are withheld while a GemMimic guard lives (≤4, enforced not hoped)
    if(act==='volley' && this.phase===3 && this.mimicAlive()) act = 'sweep2';
    const pl = this.G.player;
    if(act==='volley'){
      // targets captured AT the telegraph, then FIXED — the discs never lie (bombardment language)
      const px = clamp(pl ? pl.pos.x : this.pos.x, -21, 21);
      this._targets = [px, clamp(px-this.spread,-21.5,21.5), clamp(px+this.spread,-21.5,21.5)];
      this._shardsFired = 0;
      // P3: ONE ceiling stalactite rides each volley — captured now, shimmer starts now (0.7s + 0.79s fall)
      if(this.phase===3) this._dropStalactite(px);
      this.state = 'volleywind'; this.stateT = 0;
      AUDIO.noise && AUDIO.noise({t:0.3, vol:0.1, fFrom:1800, fTo:3200});   // the glint sings
    } else { // sweep / sweep2
      this._pair = (act==='sweep2'); this._pairDone = false;
      this._sweepDir = pl ? (Math.sign(pl.pos.x-this.pos.x)||this.facing) : this.facing;
      this._windNow = 0.8;
      this.state = 'sweepwind'; this.stateT = 0;
      AUDIO.noise && AUDIO.noise({t:0.5, vol:0.13, fFrom:120, fTo:480});    // the drill spins up
    }
  }

  _launchShard(tx){
    // one crystal shard: fixed 0.35s launch spacing, fixed flight (this.shardT), landing disc grows the
    // WHOLE flight (0.85–1.0s ≥ the 0.65 floor — plus the 0.7s glint wind before the first). Landing
    // damage only, radius 1.5 = the disc's honest final size.
    const G = this.G;
    const x0 = this.pos.x + this.facing*0.9, y0 = 4.2, T = this.shardT;
    const shard = { dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, group:new THREE.Group(),
      update(dt, GG){
        this.t += dt;
        const k = Math.min(1, this.t/T);
        this.m.position.set(lerp(x0,tx,k), lerp(y0,0.25,k)+Math.sin(k*Math.PI)*2.8, 0);
        this.m.rotation.z += 9*dt;
        this.disc.material.opacity = 0.12+k*0.4;
        this.disc.scale.setScalar(0.4+k*0.6);
        if(k>=1){
          this.dead = true;
          AUDIO.poundHit && AUDIO.poundHit();
          GG.camc.shake(0.22, 0.25);
          GG.fx.spawn(new THREE.Vector3(tx,0.4,0), 0x7ae8ff, 12, {speed:4, life:0.45, gravity:4});
          const pl = GG.player;
          if(pl && !pl.dead && Math.abs(pl.pos.x-tx)<1.5 && Math.abs(pl.pos.z)<1.6 && pl.pos.y<1.3) pl.damage(1, new THREE.Vector3(tx,0.5,0));
        }
      } };
    shard.m = mesh('cone',[0.3,0.9,6], new THREE.MeshLambertMaterial({color:0x7ae8ff, emissive:0x7ae8ff, emissiveIntensity:0.8, transparent:true, opacity:0.9}));
    shard.m.position.set(x0,y0,0);
    shard.disc = new THREE.Mesh(geo('circ',1.5,14), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0.1, depthWrite:false}));
    shard.disc.rotation.x = -Math.PI/2; shard.disc.position.set(tx,0.06,0);
    shard.group.add(shard.m, shard.disc);          // all meshes in e.group → EntityMgr owns cleanup
    G.ents.add(shard);
    G.fx.spawn(new THREE.Vector3(x0,y0,0), 0x7ae8ff, 5, {speed:2.5, life:0.35});
    AUDIO.tone && AUDIO.tone({f:880, f2:440, type:'triangle', t:0.12, vol:0.1});
  }

  _dropStalactite(cx){
    // the learned language: 0.7s ceiling shimmer + a growing landing glow, THEN the fall (~0.79s at a=28
    // from y 9.2). Exactly one per volley wave — the P3 budget's 4th and final slot.
    const stal = { dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, vy:0, hitDone:false, group:new THREE.Group(),
      update(dt, GG){
        this.t += dt;
        if(this.t < 0.7){ // shimmer
          const k = this.t/0.7;
          this.spike.scale.setScalar(0.3+k*0.7);
          this.spike.material.emissiveIntensity = 0.5 + Math.sin(this.t*26)*0.45;
          this.disc.material.opacity = k*0.42;
          this.disc.scale.setScalar(0.4+k*0.6);
          return;
        }
        this.vy += 28*dt;
        this.spike.position.y -= this.vy*dt;
        const sy = this.spike.position.y;
        const pl = GG.player;
        if(!this.hitDone && pl && !pl.dead && Math.abs(pl.pos.x-cx)<1.0 && Math.abs(pl.pos.z)<1.5 &&
           pl.pos.y+1.3 > sy-1.0 && pl.pos.y < sy+0.5){
          this.hitDone = true; pl.damage(1, new THREE.Vector3(cx,sy,0));
        }
        if(sy<=0.45){
          this.dead = true;
          AUDIO.stomp && AUDIO.stomp(); GG.camc.shake(0.2,0.2);
          GG.fx.spawn(new THREE.Vector3(cx,0.5,0), 0xb08aff, 12, {speed:4, life:0.45, gravity:5});
        }
      } };
    stal.spike = mesh('cone',[0.4,1.6,6], new THREE.MeshLambertMaterial({color:0xb08aff, emissive:0xb08aff, emissiveIntensity:0.5, transparent:true, opacity:0.92}));
    stal.spike.rotation.x = Math.PI; stal.spike.position.set(cx, 9.2, 0);
    stal.disc = new THREE.Mesh(geo('circ',1.1,12), new THREE.MeshBasicMaterial({color:0xb08aff, transparent:true, opacity:0, depthWrite:false}));
    stal.disc.rotation.x = -Math.PI/2; stal.disc.position.set(cx,0.06,0);
    stal.group.add(stal.spike, stal.disc);
    this.G.ents.add(stal);
  }

  _enterRecover(){
    this._clearAttackVisuals();
    this.state = 'recover'; this.stateT = 0;
    this._swingClaimed = true;   // a swing already in flight never claims the fresh window
    if(this.litCount()>0 && !this._facetSeen){ this._facetSeen = true;
      UI.toast('💎 He REELS — the weak facet burns bright! NOW!'); }
    AUDIO.noise && AUDIO.noise({t:0.5, vol:0.11, fFrom:200, fTo:70});   // a mountain, sighing
  }

  hurtPlayer(n, from){
    const pl = this.G.player;
    if(pl) pl.damage(n, from||this.pos);
  }

  // ---------------------------------------------------------------- defeat
  defeat(){
    // THE LAST HIT LANDS — the record stops HERE; giving the light back is a gift, not a timer (w5 idiom)
    this.G._bossEndT = this.G.runT||0;
    this.dead = true;
    this.state = 'endscene'; this.stateT = 0;
    this.stagger = false; this.vulnerable = false;
    this._clearAttackVisuals();
    AUDIO.victory();
    UI.hideBossBar();
    this.G.hitstop = 0.18;
    // clear every live threat so the celebration can't hurt the player (boss1 parity):
    // enemies (mimics) die softly; boss projectiles retire (their meshes live in e.group → auto-removed)
    for(const e of this.G.ents.list){
      if(e.isEnemy && !e.dead){ e.dead = true; if(e.shadow) this.G.scene.remove(e.shadow); }
      if(e._bossProj) e.dead = true;
    }
    // all four lanterns take the flame — he is DONE keeping it from them
    for(const l of this.lanterns) if(!l.lit){ l.lit = true; l.flame.visible = true; l.light.intensity = 32; }
    this._blazed = false; this._risen = false; this._toasted = false; this._doneFired = false;
    this._streamTick = -1;
  }

  // ---------------------------------------------------------------- the loop
  update(dt){
    if(!this.group) return;
    this.t += dt; this.stateT += dt;
    if(this.hitCD>0) this.hitCD -= dt;
    const G = this.G, pl = G.player;
    const p = this.pos;
    const lit = this.litCount();

    // ---- the vulnerability truth, computed once per frame (facet only opens in windows, and only in light)
    this.vulnerable = !this.dead && (this.state==='stagger' || (this.state==='recover' && lit>0));

    // ---- lanterns (relight verb + doom flicker + halo breathing) ----
    this._updateLanterns(dt);

    // ---- the flash plane (stagger + finale) ----
    if(this.flashT>0){ this.flashT -= dt; this.flash.material.opacity = Math.max(0,this.flashT)*0.5; }

    // ---- THE WEAK FACET: shows at 1+ lit (the refraction), pulses hard in windows ----
    const showFacet = (lit>0 && !this.dead) || this.state==='endscene';
    this.weakFacet.visible = showFacet;
    if(showFacet){
      const hot = this.vulnerable;
      this.weakM.emissiveIntensity = (hot ? 1.3 : 0.55) + Math.sin(this.t*6)*(hot?0.4:0.15);
      this.facetHalo.material.opacity = (hot ? 0.4 : 0.16) + Math.sin(this.t*6)*0.08;
      this.facetHalo.scale.setScalar(1+Math.sin(this.t*3)*0.15);
    } else { this.weakM.emissiveIntensity = 0; this.facetHalo.material.opacity = 0; }
    // stagger: EVERY facet blazes — he is the chandelier he refuses to be
    if(this.state==='stagger'){
      this.facetM.emissiveIntensity = 0.9 + Math.sin(this.t*8)*0.35;
      this.eyeM.emissiveIntensity = 1.2;
    }

    // ---- the CLINK teach: swings on a dull golem bounce off (edge-gated, one clink per swing) ----
    const swinging = pl && !pl.dead && (pl.attackT>0 || pl.pounding);
    if(swinging && !this._clinkClaim && !this.dead && !this.vulnerable &&
       Math.abs(pl.pos.x-p.x)<3.4 && Math.abs(pl.pos.z)<2.2 && pl.pos.y<6.2){
      this._clinkClaim = true;
      AUDIO.tone && AUDIO.tone({f:1400, f2:900, type:'square', t:0.06, vol:0.1});
      G.fx.spawn(new THREE.Vector3(pl.pos.x+(p.x>pl.pos.x?0.5:-0.5), pl.pos.y+0.9, 0), 0x8a94b0, 4, {speed:2, life:0.3});
      if(lit===0 && !this._clinkToasted){ this._clinkToasted = true;
        UI.toast('💠 CLINK! Dull as slate — no light, no way in. LIGHT THE MINE LANTERNS!'); }
      else if(lit>0 && !this._reelToasted){ this._reelToasted = true;
        UI.toast('💠 The facet only opens when he REELS — survive his wave, then strike!'); }
    }
    if(!swinging) this._clinkClaim = false;
    if(pl && pl.attackT<=0) this._swingClaimed = false;

    // ---- the sign outside the gate (the secret's echo, once) ----
    if(!this._signShown && pl && pl.pos.x < -18.8 && Math.abs(pl.pos.z)<3){
      this._signShown = true;
      window.UI && UI.toast('🪧 "Four lamps for the deep seam. He hates a full house." — the Foreman');
    }

    // ---- the snuff clock: fixed period per phase, held during stagger/shift/cutscenes, fires from advance
    if(!this.dead && this.state!=='stagger' && this.state!=='shift' && this.state!=='intro' && this.state!=='endscene'){
      this.snuffT += dt;
    }

    // ---- facing (side-profile flip; he only re-aims while advancing — mid-action he commits) ----
    if(pl && (this.state==='advance' || this.state==='intro')){
      this.facing = this.state==='intro' ? -1 : (Math.sign(pl.pos.x-p.x)||this.facing);
    }
    this.group.rotation.y = angleDamp(this.group.rotation.y, this.facing>0?0:Math.PI, this.state==='endscene'?2:4, dt);

    // ---- facet hit detection (the boss runs its own — generic player loops only reach ents) ----
    if(this.vulnerable && pl && !pl.dead){
      const fv = this.facetWorld();
      const dxz = Math.hypot(pl.pos.x-fv.x, pl.pos.z-fv.z);
      // stomp the facet (bounce out — the pogo language)
      if(pl.vel.y<0 && dxz<1.6 && pl.pos.y>fv.y-0.6 && pl.pos.y<fv.y+1.7){
        pl.bounceOff(12);
        AUDIO.stomp();
        this.takeHit();
      }
      // spin into the facet (one claim per swing)
      else if(pl.attackT>0 && !this._swingClaimed && dxz<1.9 && Math.abs((pl.pos.y+0.7)-fv.y)<1.5){
        this._swingClaimed = true;
        this.takeHit();
      }
    }

    switch(this.state){
      case 'intro': {
        // he is ALREADY the room: a dull mountain at the east end, not deigning to move yet
        this.body.position.y = Math.sin(this.t*0.8)*0.03;   // breathing, barely (micro-motion law)
        if(this.stateT>1.5){
          this._applyPhase();
          this.state = 'advance'; this.stateT = 0;
          UI.dialogue('💎', '"Mine. Every glow this seam ever grew — MINE. I swallowed the shine so it could never leave... and I will NOT give it back."');
        }
        break;
      }
      case 'advance': {
        // the stomping pursuit: slow, huge, inevitable. His body is a SOFT WALL — the waves are the attack.
        if(pl){
          const dx = pl.pos.x-p.x;
          if(Math.abs(dx)>1.6) p.x += Math.sign(dx)*this.chaseSp*dt;
          p.x = clamp(p.x, -20, 20);
          const d = pl.pos.x-p.x;   // the polite furniture shove
          if(Math.abs(d)<3.2 && Math.abs(pl.pos.z)<2.0 && pl.pos.y<5.2){
            pl.pos.x += (Math.sign(d)||-this.facing)*(3.2-Math.abs(d))*dt*5;
          }
        }
        this._stompAnim(dt, 1);
        // snuff first (the economy war outranks the waves), then the rotation
        if(this.snuffT>=this.snuffP && lit>0){
          this.snuffT = 0;
          this._doomed = this._doomedLantern();
          if(this._doomed){ this._doomed.doomT = 0.001; this.state='snuff'; this.stateT=0;
            AUDIO.noise && AUDIO.noise({t:0.6, vol:0.12, fFrom:300, fTo:60}); }
          break;
        }
        if(this.stateT>0.6 && pl && (Math.abs(pl.pos.x-p.x)<8.5 || this.stateT>3.5)){
          if(this.queue.length===0) this.queue = this.actions.slice();   // same order, every cycle, forever
          this._beginAction();
        }
        break;
      }
      case 'snuff': {
        // 0.7s gather (the doomed flame flickers violet — the read) → the dark pulse flies 0.45s → out
        const chest = new THREE.Vector3(p.x+this.facing*0.9, 3.8, 0);
        if(this.stateT<0.7){
          this.darkOrb.visible = true;
          this.darkOrb.position.copy(chest);
          this.darkOrb.scale.setScalar(0.3+this.stateT);
          this.body.rotation.z = -0.06*Math.sin(this.stateT*9);
        } else if(this.stateT<1.15 && this._doomed){
          const k = (this.stateT-0.7)/0.45;
          this.darkOrb.scale.setScalar(1.3-k*0.5);
          this.darkOrb.position.set(lerp(chest.x, this._doomed.x, k), lerp(chest.y, 2.2, k), lerp(0, -0.7, k));
        } else {
          if(this._doomed && this._doomed.lit) this._snuffLantern(this._doomed);
          this._doomed = null;
          this.darkOrb.visible = false;
          this.body.rotation.z = 0;
          if(this.stateT>1.3){ this.state='advance'; this.stateT=0; }
        }
        break;
      }
      case 'volleywind': {
        // 0.7s GLINT — his facets shiver light down the body; the P3 stalactite's shimmer runs in parallel
        const k = Math.min(1, this.stateT/0.7);
        this.facetM.emissiveIntensity = 0.06 + Math.abs(Math.sin(this.stateT*24))*0.5*k;
        this.armL.rotation.z = 0.5*k; this.armR.rotation.z = -0.5*k;   // arms flare wide — the tell reads from orbit
        this.body.rotation.z = -0.08*k;
        if(this.stateT>=0.7){
          this.facetM.emissiveIntensity = 0.06;
          this.state='volley'; this.stateT=0;
        }
        break;
      }
      case 'volley': {
        // 3 shards on the fixed spacing (0, 0.35, 0.7) — ≤3 aloft, see the budget header
        while(this._shardsFired<3 && this.stateT>=this._shardsFired*0.35){
          this._launchShard(this._targets[this._shardsFired]);
          this._shardsFired++;
          this.body.rotation.z = 0.1;   // the recoil twitch
        }
        this.body.rotation.z = damp(this.body.rotation.z, -0.04, 8, dt);
        this.armL.rotation.z = damp(this.armL.rotation.z, 0, 6, dt);
        this.armR.rotation.z = damp(this.armR.rotation.z, 0, 6, dt);
        if(this.stateT>1.0){ this.body.rotation.z = 0; this._enterRecover(); }
        break;
      }
      case 'sweepwind': case 'sweepwind2': {
        // the arm BECOMES a drill: 0.8s wind (0.65s exactly on the pair's re-aim — the legal floor),
        // the low lane glows brighter the whole way. Captured direction, fixed reach: 1.2 → 6.6.
        const W = this.state==='sweepwind' ? this._windNow : 0.65;
        const k = Math.min(1, this.stateT/W);
        this.drillRig.visible = true;
        this.drillSpin.rotation.x += (4+k*16)*dt;
        this.armR.rotation.z = -2.2*k*this.facing;   // the arm plunges down-and-forward
        const reach = 0.8+k*1.0;
        this.drillRig.position.set(p.x+this._sweepDir*(0.9+reach*0.5), lerp(3.4,0.7,k), 0);
        this.drillRig.rotation.y = this._sweepDir>0?0:Math.PI;
        this.drillShaft.scale.y = reach; this.drillShaft.position.x = 0;
        this.drillSpin.position.x = reach/2;
        this.sweepGlow.material.opacity = k*0.4;
        this.sweepGlow.scale.x = 5.4;
        this.sweepGlow.position.x = p.x+this._sweepDir*3.9;   // the honest lane: 1.2→6.6 from his center
        if(this.stateT>=W){
          this._sweepX0 = p.x;   // he plants his feet — the lane never lies
          this.state='sweep'; this.stateT=0;
          AUDIO.poundHit && AUDIO.poundHit();
          G.camc.shake(0.3,0.3);
        }
        break;
      }
      case 'sweep': {
        // the drill tip grinds the lane 1.2→6.6 over 0.85s at y 0.7 — a TAP jump (1.8u) clears it clean
        const k = Math.min(1, this.stateT/0.85);
        const tipX = this._sweepX0 + this._sweepDir*(1.2+k*5.4);
        this.drillRig.position.set((this._sweepX0+this._sweepDir*0.6+tipX)/2, 0.7, 0);
        this.drillRig.rotation.y = this._sweepDir>0?0:Math.PI;
        this.drillShaft.scale.y = Math.abs(tipX-(this._sweepX0+this._sweepDir*0.6));
        this.drillSpin.position.x = this.drillShaft.scale.y/2;
        this.drillSpin.rotation.x += 22*dt;
        this.sweepGlow.material.opacity = 0.22;
        if((this.t*12|0)!==this._grindTick){ this._grindTick=this.t*12|0;
          G.fx.spawn(new THREE.Vector3(tipX,0.5,0), pick([0xffb85e,0xffd23f]), 1, {speed:2, life:0.25}); }
        if(pl && !pl.dead && Math.abs(pl.pos.x-tipX)<1.0 && Math.abs(pl.pos.z)<1.6 && pl.pos.y<1.35){
          this.hurtPlayer(1, new THREE.Vector3(tipX,0.7,0));
        }
        if(k>=1){
          if(this._pair && !this._pairDone){
            // the P3 pair: re-aim (player-reactive read captured NOW) + 0.65s re-telegraph
            this._pairDone = true;
            this._sweepDir = pl ? (Math.sign(pl.pos.x-p.x)||this._sweepDir) : this._sweepDir;
            this.state='sweepwind2'; this.stateT=0;
            AUDIO.noise && AUDIO.noise({t:0.4, vol:0.11, fFrom:150, fTo:420});
          } else this._enterRecover();
        }
        break;
      }
      case 'recover': {
        // THE WINDOW — he sags, spent (body -1.1 brings the facet into the phase's jump envelope; see
        // the reach header). Facet-only, hitCD-spaced; wasted if no lantern burns (the lesson).
        const k = Math.min(1, this.stateT/0.45);
        this.body.position.y = -1.1*k + Math.sin(this.t*2.2)*0.05;   // the huge weary breathing
        this.body.rotation.z = -0.18*k;
        this.armL.rotation.z = damp(this.armL.rotation.z, 0.25, 5, dt);
        this.armR.rotation.z = damp(this.armR.rotation.z, -0.25, 5, dt);
        if(this.stateT>this.recoverLen){ this._riseY0 = this.body.position.y; this.state='riseup'; this.stateT=0; }
        break;
      }
      case 'riseup': {
        // up he grinds — a shudder, a glare, the war for the dark resumes. Eases FROM the recorded
        // slump (-1.1 recover / -1.4 stagger) so there is never a pose pop (the stir discipline).
        const k = Math.min(1, this.stateT/0.6);
        this.body.position.y = lerp(this._riseY0!==undefined?this._riseY0:-1.1, 0, k);
        this.body.rotation.z = -0.18*(1-k) + Math.sin(this.stateT*14)*0.03*(1-k);
        if(this.stateT>=0.6){
          this.body.position.y = 0; this.body.rotation.z = 0;
          this.state='advance'; this.stateT=0;
        }
        break;
      }
      case 'stagger': {
        // TOTAL REFRACTION — 5s doubled over, blinded by his own hoard. Deepest slump (-1.4): every
        // phase's facet sits inside the double-jump envelope (1.7 / 2.95 / 3.95 — reach header).
        const k = Math.min(1, this.stateT/0.4);
        this.body.position.y = lerp(this._stagY0||0, -1.4, k) + Math.sin(this.t*7)*0.05;    // reeling, shivering with light
        this.body.rotation.z = lerp(this._stagR0||0, -0.3, k) + Math.sin(this.t*11)*0.04;
        this.armL.rotation.z = 1.1*k;  this.armR.rotation.z = -1.1*k;   // hands to his face — too bright, too bright
        if((this.t*6|0)!==this._glitTick){ this._glitTick=this.t*6|0;
          G.fx.spawn(new THREE.Vector3(p.x+Math.sin(this.t*3.1)*1.6, 3.5+Math.sin(this.t*4.7)*1.5, 0.6), 0xdff4ff, 1, {speed:1.2, life:0.5}); }
        if(this.stateT>5.0) this._endStagger();
        break;
      }
      case 'shift': {
        // the phase boundary — he grinds TALLER and roars light through every dead facet. Never falls.
        const k = Math.min(1, this.stateT/0.6);
        this.body.position.y = damp(this.body.position.y, 0.4*Math.sin(k*Math.PI), 8, dt);
        this.body.rotation.z = -0.25*Math.sin(k*Math.PI);
        this.facetM.emissiveIntensity = 0.06 + Math.abs(Math.sin(this.stateT*14))*0.6*(1-this.stateT/1.6);
        this.armL.rotation.z = damp(this.armL.rotation.z, 0, 5, dt);
        this.armR.rotation.z = damp(this.armR.rotation.z, 0, 5, dt);
        if(this.stateT>1.6){
          this.body.position.y = 0; this.body.rotation.z = 0; this.facetM.emissiveIntensity = 0.06;
          this._shiftDone();
        }
        break;
      }
      case 'endscene': {
        // THE ENDING — he GIVES THE LIGHT BACK. State-machine driven (never setTimeout) so quits can't strand it.
        const T = this.stateT;
        // beat 1 (0→0.8): stillness. The great head bows; the eyes soften from hoard-amber to lamp-warm.
        const k1 = Math.min(1, T/0.8);
        this.body.position.y = damp(this.body.position.y, 0, 4, dt);
        this.body.rotation.z = damp(this.body.rotation.z, -0.12, 4, dt);
        this.headG.rotation.z = -0.3*k1;
        this.eyeM.emissiveIntensity = 0.35 + k1*0.8;
        // beat 2 (0.8→2.6): THE GIVING — every swallowed glow streams OUT of him into the walls
        if(T>0.8 && T<3.2){
          this.facetM.emissiveIntensity = Math.min(1.5, this.facetM.emissiveIntensity + dt*1.2);
          this.rockM.emissiveIntensity = Math.min(0.4, this.rockM.emissiveIntensity + dt*0.3);
          this.weakM.emissiveIntensity = 1.2;
          if((T*14|0)!==this._streamTick){ this._streamTick = T*14|0;
            const a = this._streamTick*1.7;
            G.fx.spawn(new THREE.Vector3(p.x+Math.cos(a)*1.8, 3.2+Math.sin(a*1.3)*2.0, 0.5), pick([0x7ae8ff,0xb08aff,0xffb85e]), 2, {speed:6, life:0.9});
          }
        }
        // beat 3 (2.0): THE CATHEDRAL BLAZES — columns, seams, lanterns, sky-flash, candy
        if(T>2.0 && !this._blazed){ this._blazed = true;
          this.flashT = 0.7;
          AUDIO.goldPumpkin && AUDIO.goldPumpkin();
          G.camc.shake(0.45, 0.6);
          candyBurst(G, new THREE.Vector3(p.x-this.facing*3.5, 1.5, 0), 24);
        }
        if(this._blazed){
          for(const m of this.blazeMats) m.emissiveIntensity = damp(m.emissiveIntensity, 1.0, 1.6, dt);
          for(const l of this.lanterns){ l.light.intensity = damp(l.light.intensity, 46, 2, dt);
            l.halo.material.opacity = 0.3+Math.sin(this.t*3+l.x)*0.08; }
        }
        // beat 4 (2.6→4.3): he RISES — up into the dark he made, to fill it. Arms fold. He hangs. He GLOWS.
        if(T>2.6){
          this._risen = true;
          p.y = damp(p.y, 8.6, 1.6, dt);
          this.shadow.visible = false;                    // he doesn't cast shadow anymore. He casts LIGHT.
          this.armL.rotation.z = damp(this.armL.rotation.z, 2.0, 2, dt);
          this.armR.rotation.z = damp(this.armR.rotation.z, -2.0, 2, dt);
          this.headG.rotation.z = damp(this.headG.rotation.z, 0, 2, dt);
          this.group.rotation.y += 0.12*dt;               // the slow chandelier turn
          if((T*6|0)!==this._dripTick){ this._dripTick=T*6|0;
            G.fx.spawn(new THREE.Vector3(p.x+Math.sin(T*2.3)*1.2, p.y-3.4, 0), 0xdff4ff, 1, {speed:0.6, life:1.1, gravity:1}); }
        }
        if(T>4.1 && !this._toasted){ this._toasted = true;
          UI.toast('💎 The mines remember how to shine. Prismus keeps the lights now.');
        }
        if(T>4.5 && !this._doneFired){
          this._doneFired = true;
          G.onBossDefeated();                             // district comes from G.bossDistrict — no arguments
        }
        break;
      }
    }

    // ---- visuals ----
    this.group.position.copy(p);
    if(!this._risen){
      this.shadow.visible = true;   // he never bursts, never vanishes — until he becomes the light
      this.shadow.position.set(p.x, 0.03, p.z);
    }
    // outside the stagger/shift/wind flickers, the thousand facets stay heartbreak-dull
    if(this.state!=='stagger' && this.state!=='shift' && this.state!=='volleywind' && this.state!=='endscene'){
      this.facetM.emissiveIntensity = damp(this.facetM.emissiveIntensity, 0.06, 5, dt);
      this.eyeM.emissiveIntensity = damp(this.eyeM.emissiveIntensity, 0.35, 5, dt);
    }
  }

  _stompAnim(dt, k){
    // the quarry gait — heavy bob; each footfall thuds through the floor (cosmetic ticks, fixed rhythm)
    this.body.position.y = Math.abs(Math.sin(this.t*2.6))*0.16*k;
    this.body.rotation.z = Math.sin(this.t*2.6)*0.04*k;
    this.armL.rotation.z = Math.sin(this.t*2.6)*0.14*k;
    this.armR.rotation.z = -Math.sin(this.t*2.6)*0.14*k;
    if((this.t*(2.6/Math.PI)|0)!==this._stepTick){ this._stepTick = this.t*(2.6/Math.PI)|0;
      AUDIO.noise && AUDIO.noise({t:0.12, vol:0.07, fFrom:90, fTo:45});
      this.G.camc.shake(0.06, 0.1);
      this.G.fx.spawn(new THREE.Vector3(this.pos.x+this.facing*0.8, 0.2, 0), 0x453a58, 2, {speed:1.5, life:0.3});
    }
  }
}

// =============================== ARENA ===============================
function buildBossArena8(G){
  const S = G.scene;
  const x1 = -23, x2 = 23;   // the ~46u CRYSTAL CATHEDRAL
  // ---- dark rock floor — SOLID, no cracking (the fight is fought in the light economy, not the ground)
  G.world.addBox(0, -1, 0, 60, 1, 12, {});
  const floorM = new THREE.Group();
  const slab = mesh('box',[60,1,12], mat(W8PAL.rockD)); slab.position.y = -0.5; floorM.add(slab);
  const lip = mesh('box',[60,0.14,0.3], mat(W8PAL.rockL)); lip.position.set(0,0.02,2.6); floorM.add(lip);
  // baked dull clutter — ore lumps, dead crystal stubs, dropped picks (detail-density law, zero runtime cost)
  for(let i=0;i<26;i++){
    const cx = rand(x1+1,x2-1), cz = rand(-2.6,2.4), r0 = rand();
    if(r0<0.4){ const ore = mesh('sph',[rand(0.14,0.3),6,5], mat(W8PAL.rock)); ore.scale.y=0.6; ore.position.set(cx,0.08,cz); floorM.add(ore); }
    else if(r0<0.7){ const stub = mesh('cone',[rand(0.1,0.2),rand(0.25,0.5),5], mat(0x4a4462)); stub.position.set(cx,0.15,cz); crook(stub,0.2); floorM.add(stub); }
    else { const pk = mesh('box',[0.5,0.05,0.05], mat(0x6a5a48)); pk.position.set(cx,0.06,cz); pk.rotation.y = rand(TAU); floorM.add(pk); }
  }
  S.add(bakeGroup(floorM));
  // ---- GREAT DULL CRYSTAL COLUMNS — the cathedral's dead pillars. Bespoke shared materials so the
  // finale can crank them to BLAZE (never mutate the mat() caches). A couple of extra draws — arena-cheap.
  const blazeMats = [];
  const colM = (c)=>{ const m = new THREE.MeshLambertMaterial({color:c, emissive:c, emissiveIntensity:0.06, transparent:true, opacity:0.92}); blazeMats.push(m); return m; };
  const mCyan = colM(W8PAL.crysC), mViolet = colM(W8PAL.crysV), mAmber = colM(W8PAL.crysA);
  const colMats = [mCyan, mViolet, mAmber];
  for(let i=0;i<6;i++){
    const cx = -20+i*8, m = colMats[i%3];
    const col = new THREE.Mesh(geo('cyl', 0.9+((i*7)%3)*0.25, 1.3+((i*5)%3)*0.3, 9+((i*3)%3)*2.5, 6), m);
    col.position.set(cx, (9+((i*3)%3)*2.5)/2, -3.6-((i*11)%3)); col.rotation.z = ((i%2)?1:-1)*0.06; S.add(col);
    const tip = new THREE.Mesh(geo('cone', 0.8+((i*7)%3)*0.2, 2.2, 6), m);
    tip.position.set(cx, 9+((i*3)%3)*2.5+1.0, col.position.z); tip.rotation.z = col.rotation.z; S.add(tip);
  }
  // wall seams — low crystal clusters along the rim that also join the blaze
  for(let i=0;i<8;i++){
    const cx = -21+i*6, m = colMats[(i+1)%3];
    for(let j=0;j<3;j++){ const c2 = new THREE.Mesh(geo('cone', 0.2+((j*5)%3)*0.07, 0.6+((j*7)%4)*0.22, 5), m);
      c2.position.set(cx+j*0.4-0.4, 0.25, -2.5); c2.rotation.z = -0.35+j*0.3; S.add(c2); }
  }
  // foreground silhouettes (depth framing law) — two dead teeth, never lit
  for(const [fx2,fh] of [[-11,2.6],[13,3.2]]){
    const sil = mesh('cone',[1.0,fh,5], mat(0x140f20)); sil.position.set(fx2, fh/2-0.2, 3.6); S.add(sil);
  }
  // ---- rim walls — collapsed rock banks (colliders + baked slab chaos), nobody leaves the dark ----
  G.world.addBox(-25.4, 0, 0, 4, 16, 12, {});
  G.world.addBox(25.4, 0, 0, 4, 16, 12, {});
  const walls = new THREE.Group();
  for(const s of [-1,1]) for(let i=0;i<4;i++){
    const slab2 = mesh('box',[rand(1.6,3),rand(2,4.5+i),1.0], mat(i%2?W8PAL.rock:W8PAL.rockL));
    slab2.position.set(s*(23.6+i*0.8), rand(0.5,2.2), rand(-2.5,1.5)); slab2.rotation.z = s*rand(0.1,0.4); walls.add(slab2);
    const brace = mesh('box',[0.3,rand(2.5,4),0.34], mat(W8PAL.timberD)); brace.position.set(s*(23.2+i*0.7), 1.6, rand(-1.8,0.5)); crook(brace,0.08); walls.add(brace);
  }
  S.add(bakeGroup(walls));

  w8Parallax(S, x1, x2);   // the ceiling-constellation — the only glitter he couldn't reach

  // ---- THE SIGN outside the gate (the hint; the boss toasts its text on approach) ----
  const deco = new THREE.Group();
  { const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(W8PAL.timberD)); pole.position.set(-21.4,0.7,-1.7);
    const board = mesh('box',[1.7,0.8,0.1], mat(0x5a4a38)); board.position.set(-21.4,1.5,-1.7); crook(board,0.05);
    const lamp = mesh('sph',[0.07,5,4], emat(W8PAL.crysA,W8PAL.crysA,0.7)); lamp.position.set(-21.4,2.0,-1.6);
    deco.add(pole, board, lamp); }
  S.add(bakeGroup(deco));

  // ---- TWO KNOCKER SPRITES tapping excitedly on the wall beside the WESTERN lantern (the living hint —
  // no penguins underground; the miners' spirits came to see their lights won back). Deco-grade ticker. ----
  const knockers = [];
  for(const [kx, ky] of [[-21.6, 1.4], [-21.2, 2.3]]){
    const kg = new THREE.Group();
    const bod = mesh('sph',[0.26,8,7], emat(0xffe9b0,0xffc87a,0.7)); kg.add(bod);
    const hat = mesh('cyl',[0.2,0.26,0.14,9], mat(0xc9a24a)); hat.position.y=0.26; kg.add(hat);
    const lampf = mesh('sph',[0.06,5,4], emat(0x7ae8ff,0x7ae8ff,1.1)); lampf.position.set(0,0.3,0.2); kg.add(lampf);
    for(const s of [-1,1]){ const eye = mesh('sph',[0.045,5,4], mat(0x2a2036)); eye.position.set(s*0.1,0.05,0.23); kg.add(eye); }
    const fist = mesh('sph',[0.09,5,4], emat(0xffe9b0,0xffc87a,0.5)); fist.position.set(0.24,0.05,0.08); kg.add(fist);
    kg.userData.fist = fist;
    kg.position.set(kx, ky, -1.2); kg.rotation.y = 0.9;   // leaning at the wall, pointing lantern-ward
    S.add(kg); knockers.push(kg);
  }
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt, G2){ this.t+=dt;
      const boss = G2.boss, litN = boss && boss.lanterns ? boss.litCount() : 0;
      const wild = boss && (litN>=4 || boss.state==='stagger' || boss.dead);
      for(let i=0;i<knockers.length;i++){
        const kg = knockers[i];
        if(wild){ kg.position.y = ([1.4,2.3][i]) + Math.abs(Math.sin(this.t*7+i*1.3))*0.22; kg.rotation.z = Math.sin(this.t*9+i)*0.15; }   // the LIGHTS! the LIGHTS!!
        else {    // tap-tap-tap ... (the miners' oldest signal, aimed straight at that lantern)
          const cyc = (this.t*1.4+i*0.5)%2;
          kg.position.y = [1.4,2.3][i];
          kg.rotation.z = Math.sin(this.t*2+i*2.1)*0.05;
          kg.userData.fist.position.x = 0.24 + (cyc<0.9 ? Math.abs(Math.sin(cyc*10.5))*0.1 : 0);
        }
      } } });

  // ---- the deep dark, wired (contract order per the kit; the boss owns its own lifecycle) ----
  G.scene.background = new THREE.Color(W8PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W8PAL.fog);
  G.spawnPoint.set(-17, 1, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -12;           // formality: the floor is solid and the rim is walled
  G.bats = makeBats(G.scene, 4, 28);
  G.amb = w8Ambience(S, x1, x2);
  G.lightPools = G.lightPools || [];
  // lights budget: the four mine lanterns carry the ONLY PointLights (0 until lit, 4 max) — ≤6 with room.
  G.boss = new Prismus(G, {blazeMats});
}

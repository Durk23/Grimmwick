// ============ BOSS 10 — THE FIRST FROST (Frostmere · Aurora Palace · THE WINTER FINALE) ============
// The spirit of the very first winter — before the town, before the festivals, before ANYONE. It was never
// invited because nobody knew it was THERE: winter itself, waiting politely outside every window for ten
// thousand years. It froze the Hearthlight not from malice — it just wanted to be near the warmth. It keeps
// the frozen ember at center-stage of its throne hall like a fireplace it is afraid to touch.
// THE ENDING IS THE POINT (the 10e finale template, one turn further): this time GRIMM does the inviting.
//
// THE FIGHT — 12 pips (3/4/5, boundaries at hp 9 and hp 5) + THE INVITE (the 13th "hit" is not a hit):
//   PHASE 1 (3) — FROST WAVES: expanding floor rings from his feet (hop them; 0.7s floor-glow telegraph
//                 grows the full wind), between a slow drifting pursuit. After each 3rd wave he BREATHES
//                 (2.0s): the crown-glow DIPS TO THE CHEST — hit the chest-light (stomp or spin).
//   PHASE 2 (4) — adds the MIRROR COURT (2 MirrorFrost adds, once, spawnGrace 1.0 per the clear-patch law)
//                 + GUST CROSSINGS: a herald-style wind-front sweeps the hall (0.7s floor-gleam + inhale
//                 note; jump the front). Breath windows 1.6s.
//   PHASE 3 (5) — adds the BLIZZARD WALTZ: he DANCES (formal, 3/4 time) sweeping the hall on a fixed
//                 figure while icicle-fall columns step around it on the bar downbeats (learned language:
//                 0.7s shimmer + growing floor glow, landing damage only). Breath 1.3s.
// THE BRAZIER MERCY (the burner-echo — feeding Grimm's burners, learned by the whole series): four AURORA
// BRAZIERS around the rim, unlit. Spin/pound BESIDE one (the W6Lantern verb, edge-detected) and it takes
// the flame PERMANENTLY — each lit brazier strips one attack family in fixed count order (1st: waves ·
// 2nd: gusts · 3rd: icicles · 4th: the waltz SLOWS — what is left of it is just his drifting cold) AND
// warms the hall's palette a step. Light all 4 and only the drifting pursuit remains (his slow moving
// aura, touch-1 with i-frames, outrun 3.5-to-1) — the observant player's finale, exactly like
// sweetening the brew. (An attack already in flight when its family strips finishes honestly — it was
// telegraphed; only FUTURE picks are filtered.) In-world hint: Grimm's own hub line — "The braziers
// matter, Pip. Snow that never melts only means the fires went out."
// THE INVITE (series law — the killing blow is not an attack): after pip 12 he KNEELS, flickering, small
// ... and the hall gate opens: GRIMM WALKS IN carrying a lantern (the hooded ghost-grey rig from
// 08b_frosthub, scarf and all, walking a spline to center). Prompt: '🏮 Stand with Grimm' (ANY action
// button beside him). The ~10s ending runs on the state machine (never setTimeout), UNTIMED —
// G._bossEndT was stamped at pip 12, the w5 idiom, so the reading pace never pollutes records. Grimm
// speaks his exact line, the lantern is held out TOGETHER, the First Frost takes it with both hands —
// and the FROZEN HEARTHLIGHT EMBER SHATTERS ITS ICE AND ROARS ALIGHT: the arena floods warm, every
// emissive cranks, the aurora turns GOLD (ribbon materials retinted — their ticker owns opacity, never
// color), and gentle snow begins to fall (26 flake billboards, the 10e first-snow idiom). Then
// G.onBossDefeated() ONCE, NO args — the victory card's w10 copy + hub2's Hearthlight (FWORLDS beaten
// count) take it from there.
//
// ENGINE CONTRACT (mirrors 10g/10h/10i exactly): G.boss singleton with update(dt), NOT an ents entity.
// Runs its OWN stomp/spin detection on the chest-light (generic player loops only reach ents) and exposes
// onPlayerPound(pos). Boss bar via UI.showBossBar/updateBossBar (12 hp pips). Adds (MirrorFrost) ARE ents;
// projectiles (rings / gust front / icicles) are ents with _bossProj, all meshes in e.group so EntityMgr
// owns removal; defeat() retires every live threat and raises pipSafe (nothing touches Pip from pip 12 on).
// HEARTS-ALWAYS: every hazard costs exactly 1 heart (ring, gust, icicle, mirror touch, his cold aura);
// falls impossible (solid floor, walled hall). His attacks are WEATHER — formal and beautiful; he never
// stomps, never roars.
// TELEGRAPHS (all ≥ the 0.65s floor): wave floor-glow 0.7 · gust gleam+inhale 0.7 · icicle shimmer+glow
// 0.7 · waltz draw-up-and-bow 0.8 · breath entry is a 0.5s settle before the window even opens.
// DETERMINISM: fixed action rotations per phase; the wave center / gust direction / icicle targets are
// player-reactive state-machine reads captured AT the telegraph then FIXED (like every boss); the waltz
// figure is a fixed clock; rand()/pick() are cosmetic only.
// DIFFICULTY (OWNER BAND): the Frostmere finale — a peer of Grimm's cauldron. Pressure comes from
// tending braziers UNDER weather, never damage sponges; the fight only ever gets EASIER as you light.
// THREAT BUDGET ≤4 simultaneous, pinned:
//   His hazards serialize on ONE state machine, and each hazard object dies before the machine can mint
//   the next: wave ring life (10−0.6)/8 = 1.175s < wave-out 0.3 + drift ≥0.6 + wind 0.7 = 1.6s gap → no
//   two rings ever coexist; the GUST state HOLDS him until his front leaves the hall (≤46u at 13u/s ≤
//   3.6s) → one front, ever; icicle life 0.7+0.35 ≈ 1.05s < the 1.5s bar spacing → one icicle, ever.
//   P1: aura 1 + ring 1 = 2 ✓
//   P2: aura 1 + (ring|front) 1 + mirrors 2 = 4 ✓ (mirrors are hp1 — killable pressure)
//   P3: the WALTZ IS WITHHELD while a mirror lives (a wave substitutes — the court dances first) → aura
//       1 + ring 1 + mirrors 2 = 4 ✓; full waltz: dancing aura 1 + icicle 1 = 2 ✓. ≤4 everywhere. ∎
//   His cold aura bites ONLY while he MOVES ('drift' and 'waltz' — motion is the telegraph, speed ≤2.1
//   vs player 7.2); in wind-ups he politely shoves; while BREATHING he is harmless (you must reach the
//   chest). Never a combo death: i-frames on every hit.
// CHEST REACH (comparable-heights law): chest-light body-local y 2.05; the breath slump (−0.55) puts it
//   at world ≈1.5 — inside the ground spin band (|py+0.7−cy| = 0.8 < 1.6 with py=0) and a tap-hop stomps
//   it. ✓ BRAZIER flames at y 1.82, lit from the ground beside the post (no jump asked). ✓ Gust front
//   bites y<1.35 — a TAP (1.8u) always clears it, the owner rule; wave rings y<0.85, hop with 2× margin. ✓
// LIGHTS BUDGET: 1 (the sealed ember's small warm heart) + 4 brazier lights as they light = 5 ≤ 6; the
//   ending cranks the ember's own light instead of adding one. Everything else is emissive.

class FirstFrost {
  constructor(G, opts={}){
    this.G = G;
    this.maxHp = 12; this.hp = 12;             // 3 (P1) + 4 (P2) + 5 (P3) — boundaries at hp 9 and hp 5
    this.dead = false;
    this.phase = 1;
    this.pos = new THREE.Vector3(12, 0, 0);    // he waits mid-hall, between you and his throne
    this.state = 'intro'; this.stateT = 0;
    this.t = 0;
    this.vulnerable = false; this.hitCD = 0;
    this.queue = [];                           // the phase's fixed action rotation (refilled each cycle)
    this.stripped = {wave:false, gust:false, icicle:false};   // the brazier mercy, in count order
    this.waltzSlow = false;                    // 4th brazier: the dance slows and loses its bite
    this.litCount = 0;
    this.mirrors = [];                         // phase-2 MirrorFrost adds (ents)
    this.auroraMats = opts.auroraMats || [];   // the sky ribbons — the ending turns them GOLD
    this.roseMats = opts.roseMats || [];       // the hall's rose windows — the ending cranks them
    this.velvetM = opts.velvetM || null;       // the runner carpet — warms with each brazier
    this._gust = null;
    this._swingClaimed = false; this._chillClaim = false;
    this._introDlg = false; this._hintShown = false;
    this._waveToasted = false; this._gustToasted = false; this._waltzToasted = false;
    this._breathToasted = false; this._chillToasted = false;
    this.buildRig();
    this.buildShrine();
    this.buildBraziers();
    this._cv = new THREE.Vector3();            // reusable chest-world scratch
    this.shadow = blobShadow(1.5);
    G.scene.add(this.group, this.shadow);
    if(window.UI){ UI.showBossBar('THE FIRST FROST', this.hp, this.maxHp); }
    AUDIO.bossRoar && AUDIO.bossRoar();        // ten thousand winters, exhaling at once
  }

  // ---------------------------------------------------------------- rig
  buildRig(){
    // a tall regal figure of LIVING FROST, ~5u: a crown that is PART of its head, a mantle of falling
    // snow, aurora ribbons moving THROUGH its body, a face that is mostly two sad patient eyes.
    // EVERY animatable material is bespoke — never mutate the mat()/emat() caches.
    this.group = new THREE.Group();
    const body = new THREE.Group();
    this.gownM = new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x5a8ec8, emissiveIntensity:0.3, transparent:true, opacity:0.82});
    this.trimM = new THREE.MeshLambertMaterial({color:W10PAL.regalS, emissive:0x8aa4d8, emissiveIntensity:0.35, transparent:true, opacity:0.9});
    // ---- the gown: a great hem that never quite touches the floor ----
    const gown = new THREE.Mesh(geo('cone',1.15,3.3,10), this.gownM); gown.position.y=1.75; body.add(gown);
    this.hem = new THREE.Mesh(geo('tor',1.05,0.09,6,16), this.trimM); this.hem.rotation.x=Math.PI/2; this.hem.position.y=0.22; body.add(this.hem);
    const sash = new THREE.Mesh(geo('tor',0.62,0.06,5,14), this.trimM); sash.rotation.x=Math.PI/2; sash.position.y=2.6; body.add(sash);
    // ---- torso + the CHEST-LIGHT (the weak point; the crown-glow dips here when he breathes) ----
    const torso = new THREE.Mesh(geo('sph',0.72,10,9), this.gownM); torso.scale.set(1,1.25,0.85); torso.position.y=3.15; body.add(torso);
    this.chestM = new THREE.MeshLambertMaterial({color:0xffe9c8, emissive:0xffb85e, emissiveIntensity:0.18});
    const chest = new THREE.Mesh(geo('sph',0.2,8,7), this.chestM); chest.position.set(0,2.05,0.52); body.add(chest);
    this.chestG = chest;
    this.chestHalo = new THREE.Mesh(geo('sph',0.85,10,8), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0, depthWrite:false}));
    this.chestHalo.position.set(0,2.05,0.4); body.add(this.chestHalo);
    // ---- shoulders + the mantle of snow (caps here; the trickle is fx, see update) ----
    for(const s of [-1,1]){
      const cap = new THREE.Mesh(geo('sph',0.34,8,6), this.trimM); cap.scale.y=0.55; cap.position.set(s*0.66,3.72,0); body.add(cap);
      const snowc = new THREE.Mesh(geo('sph',0.26,7,5), new THREE.MeshLambertMaterial({color:0xeef4ff, emissive:0xaac4e8, emissiveIntensity:0.2}));
      snowc.scale.y=0.4; snowc.position.set(s*0.66,3.88,0); body.add(snowc);
    }
    // ---- arms: long, slender, folded formal (they reach only for the lantern) ----
    this.armL = this._arm(this.gownM,-1); this.armR = this._arm(this.gownM,1);
    body.add(this.armL, this.armR);
    // ---- the head, and the CROWN THAT IS PART OF IT (same material — grown, not worn) ----
    this.headM = new THREE.MeshLambertMaterial({color:0xdfe8fa, emissive:0x7ab0e0, emissiveIntensity:0.35, transparent:true, opacity:0.92});
    const head = new THREE.Mesh(geo('sph',0.52,11,9), this.headM); head.position.y=4.25; body.add(head);
    this.crownM = new THREE.MeshLambertMaterial({color:0xcfe8ff, emissive:0x7ae8ff, emissiveIntensity:0.9});
    for(let i=0;i<5;i++){
      const a=(i-2)*0.42;
      const spike=new THREE.Mesh(geo('cone',0.11,0.55+ (i===2?0.35:0.12*(2-Math.abs(i-2))),5), this.crownM);
      spike.position.set(Math.sin(a)*0.42, 4.62+Math.cos(a)*0.28, 0); spike.rotation.z=-a*0.8; body.add(spike);
    }
    this.crownHalo = new THREE.Mesh(geo('sph',0.8,10,8), new THREE.MeshBasicMaterial({color:0x9fe8ff, transparent:true, opacity:0.16, depthWrite:false}));
    this.crownHalo.position.y=4.8; body.add(this.crownHalo);
    // ---- the face: mostly two sad, patient eyes (drooped lids; no mouth — winter says little) ----
    this.eyeM = new THREE.MeshLambertMaterial({color:0xeaf4ff, emissive:0xcfe8ff, emissiveIntensity:0.7});
    for(const s of [-1,1]){
      const eye=new THREE.Mesh(geo('sph',0.13,8,7), this.eyeM); eye.position.set(s*0.19,4.24,0.42); eye.scale.set(1,1.25,0.6); body.add(eye);
      const lid=new THREE.Mesh(geo('box',0.26,0.07,0.1), this.headM); lid.position.set(s*0.19,4.4,0.46); lid.rotation.z=s*0.35; body.add(lid);   // the tilt that reads SAD, not fierce
    }
    // ---- aurora ribbons moving THROUGH the body (bespoke additive planes; gold at the ending) ----
    this.bodyRibbons=[];
    const AURC=[W10PAL.aur1, W10PAL.aur2, W10PAL.aur3];
    for(let i=0;i<3;i++){
      const rb=new THREE.Mesh(new THREE.PlaneGeometry(2.7,0.32,1,1),
        new THREE.MeshBasicMaterial({color:AURC[i], transparent:true, opacity:0.3, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
      rb.position.set(0, 1.5+i*1.15, 0.12); rb.rotation.z=(i-1)*0.22;
      body.add(rb); this.bodyRibbons.push(rb);
    }
    this.body = body;
    this.group.add(body);
    this.group.position.copy(this.pos);
    // ---- reusable telegraph meshes: wave foot-glow + gust floor-gleam ----
    this.footGlow = new THREE.Mesh(geo('circ',1.2,16), new THREE.MeshBasicMaterial({color:0x9fe8ff, transparent:true, opacity:0, depthWrite:false}));
    this.footGlow.rotation.x=-Math.PI/2; this.footGlow.position.y=0.06; this.G.scene.add(this.footGlow);
    this.gleam = new THREE.Mesh(new THREE.PlaneGeometry(1,1.6,1,1), new THREE.MeshBasicMaterial({color:0xbfe8ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.gleam.rotation.x=-Math.PI/2; this.gleam.position.y=0.07; this.G.scene.add(this.gleam);
  }
  _arm(m, s){
    const arm=new THREE.Group();
    const upper=new THREE.Mesh(geo('cyl',0.13,0.1,1.15,6), m); upper.position.y=-0.55; arm.add(upper);
    const hand=new THREE.Mesh(geo('sph',0.15,7,6), m); hand.position.y=-1.18; arm.add(hand);
    arm.position.set(s*0.72, 3.55, 0.18);
    arm.rotation.z = s*0.55; arm.rotation.x = 0.25;   // folded in front — court manners
    return arm;
  }

  buildShrine(){
    // THE FROZEN HEARTHLIGHT EMBER, center-stage — a caged warm glow wrapped in ancient ice. What it
    // took; what it holds; what it could never bring itself to melt. The ending shatters the shell.
    const S=this.G.scene, g=new THREE.Group();
    const plinth=mesh('cyl',[1.0,1.3,0.7,10], mat(0x44507a)); plinth.position.set(0,0.35,-2.4); g.add(plinth);
    const step=mesh('cyl',[1.6,1.8,0.24,12], mat(0x38436b)); step.position.set(0,0.12,-2.4); g.add(step);
    this.shellM = new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.35, transparent:true, opacity:0.6});
    this.shell = new THREE.Mesh(geo('box',1.15,1.05,0.95), this.shellM); this.shell.position.set(0,1.25,-2.4); g.add(this.shell);
    this.emberM = new THREE.MeshLambertMaterial({color:0xffb87a, emissive:0xff8a3a, emissiveIntensity:0.7});
    this.ember = new THREE.Mesh(geo('sph',0.28,9,8), this.emberM); this.ember.position.set(0,1.25,-2.4); g.add(this.ember);
    // the one warm light in the hall from the start — the heart of the room (budget: 1 + 4 braziers = 5)
    this.emberLight = new THREE.PointLight(0xffa050, 10, 8); this.emberLight.position.set(0,1.6,-1.8); g.add(this.emberLight);
    S.add(g); this.shrine=g;
  }

  buildBraziers(){
    // FOUR AURORA BRAZIERS around the rim, unlit — the burner-echo. W6Lantern verb lights them.
    const S=this.G.scene;
    this.braziers=[];
    for(const bx of [-20,-10,10,20]){
      const g=new THREE.Group();
      const post=mesh('cyl',[0.16,0.22,1.3,7], mat(0x2a3a60)); post.position.y=0.65; g.add(post);
      const bowl=mesh('cyl',[0.52,0.34,0.4,10], mat(W10PAL.regalS)); bowl.position.y=1.5; g.add(bowl);
      const gilt=mesh('tor',[0.5,0.05,5,14], mat(W10PAL.regalG)); gilt.rotation.x=Math.PI/2; gilt.position.y=1.7; g.add(gilt);
      const flameM=new THREE.MeshLambertMaterial({color:0x2a3450, emissive:0x2a3450, emissiveIntensity:0.4});
      const flame=new THREE.Mesh(geo('sph',0.26,8,6), flameM); flame.position.y=1.82; g.add(flame);
      const halo=new THREE.Mesh(geo('sph',0.8,10,8), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0, depthWrite:false})); halo.position.y=1.82; g.add(halo);
      g.position.set(bx,0,-0.8); S.add(g);
      this.braziers.push({x:bx, group:g, flame, flameM, halo, lit:false, light:null});
    }
  }

  // ---------------------------------------------------------------- helpers
  chestWorld(){ this.chestG.getWorldPosition(this._cv); return this._cv; }
  mirrorAlive(){ for(const m of this.mirrors) if(!m.dead) return true; return false; }

  onPlayerPound(pos){
    // a pound landing on/near the CHEST-LIGHT during a breath counts (boss1 parity, chest-only discipline)
    if(!this.vulnerable) return;
    const cv=this.chestWorld();
    if(Math.hypot(pos.x-cv.x, pos.z-cv.z)<2.4 && Math.abs(pos.y-cv.y)<2.0) this.takeHit();
  }

  takeHit(){
    if(this.dead || !this.vulnerable || this.hitCD>0) return;
    const was=this.hp;
    this.hp = Math.max(0, this.hp-1);
    this.hitCD = 0.55;
    AUDIO.bossHit && AUDIO.bossHit();
    this.G.hitstop = 0.09;
    this.G.camc.shake(0.5, 0.4);
    const cv=this.chestWorld();
    this.G.fx.spawn(new THREE.Vector3(cv.x,cv.y,cv.z), 0xffd98a, 16, {speed:5});
    window.UI && UI.updateBossBar(this.hp);
    if(this.hp<=0){ this.defeat(); return; }
    // phase boundaries interrupt the breath — one window can never clear more than the current phase
    if(was>9 && this.hp<=9){ this._phaseShift(2); return; }
    if(was>5 && this.hp<=5){ this._phaseShift(3); return; }
    UI.toast(pick2([ '❄️ "...oh. Warm hands. Nobody ever—" (He composes himself.)',
      '❄️ (A drift of snow slides off his mantle. He apologizes to it.)',
      '❄️ "Ten thousand winters of manners, and still nobody KNOCKS."' ], this.hp));
  }

  _applyPhase(){
    // the tuning table, one place — fixed rotations, never RNG (his time feeds the boards)
    const P = [
      {sp:1.1, breath:2.0, actions:['wave','wave','wave']},
      {sp:1.4, breath:1.6, actions:['wave','gust','wave']},
      {sp:1.7, breath:1.3, actions:['gust','wave','waltz']},
    ][this.phase-1];
    this.chaseSp = P.sp; this.breathLen = P.breath;
    this.actions = P.actions;
    this.queue = this.actions.slice();
  }

  _phaseShift(phase){
    this.phase = phase;
    this.vulnerable = false;
    this._clearAttackVisuals();
    this._shiftY0 = this.body.position.y;
    this.state='shift'; this.stateT=0;
    AUDIO.bossRoar && AUDIO.bossRoar();
    this.G.camc.shake(0.5, 0.5);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x,3.5,0), 0x9fe8ff, 22, {speed:4, life:0.7});
  }

  _shiftDone(){
    this._applyPhase();
    if(this.phase===2 && !this._courtSpawned){
      this._courtSpawned = true;
      // THE MIRROR COURT — one-time pair, fixed posts, spawnGrace per the clear-patch law
      if(typeof MirrorFrost!=='undefined'){
        const m1=new MirrorFrost(this.G,-8,0,0,{range:5, phase:0});
        const m2=new MirrorFrost(this.G, 8,0,0,{range:5, phase:1.2});
        m1.spawnGrace=1.0; m2.spawnGrace=1.0;
        this.mirrors.push(this.G.ents.add(m1), this.G.ents.add(m2));
      }
      UI.toast('❄️ The court WAKES — two panes of palace ice take the floor, and the wind learns to CROSS the hall!');
    } else if(this.phase===3){
      UI.toast('❄️🎶 He draws himself up to DANCE — the BLIZZARD WALTZ. Icicles keep the time.');
    }
    this.state='drift'; this.stateT=0; this.driftT=0;
  }

  // ---------------------------------------------------------------- braziers (the mercy)
  _lightBrazier(b){
    if(b.lit) return;
    b.lit=true; this.litCount++;
    // strip families in fixed COUNT order — the arrow chain: waves → gusts → icicles → the waltz slows
    if(this.litCount===1) this.stripped.wave=true;
    else if(this.litCount===2) this.stripped.gust=true;
    else if(this.litCount===3) this.stripped.icicle=true;
    else if(this.litCount===4) this.waltzSlow=true;
    b.flameM.color.set(0xffd98a); b.flameM.emissive.set(0xffb85e); b.flameM.emissiveIntensity=2;
    b.halo.material.opacity=0.5;
    b.light=new THREE.PointLight(0xffc87a, 26, 11); b.light.position.set(b.x,2,-0.8); this.G.scene.add(b.light);
    AUDIO.goldPumpkin && AUDIO.goldPumpkin();
    this.G.fx.spawn(new THREE.Vector3(b.x,1.9,-0.8), 0xffb85e, 18, {speed:3, gravity:1});
    this.G.camc.shake(0.25, 0.3);
    this._warmStep();
    UI.toast(['','🔥 1/4 — the hall warms a step. His FROST WAVES forget themselves!',
      '🔥 2/4 — warmer still. The GUSTS lie down!',
      '🔥 3/4 — the ICICLES hold their breath!',
      '🔥 4/4 — the cold has nothing left but the dance. Let him breathe... then strike.'][this.litCount]);
    // a family stripped mid-waltz: the dance finishes but spawns no more icicles (handled by the filter);
    // everything already in flight was telegraphed and lands honestly.
  }
  _warmStep(){
    const k=this.litCount/4, S=this.G.scene;
    S.background.lerpColors(new THREE.Color(W10PAL.sky), new THREE.Color(0x2c1a30), k);
    if(S.fog) S.fog.color.lerpColors(new THREE.Color(W10PAL.fog), new THREE.Color(0x46284a), k);
    if(this.velvetM){ this.velvetM.emissive.lerpColors(new THREE.Color(0x1a0e26), new THREE.Color(0xb85e2e), k);
      this.velvetM.emissiveIntensity=0.15+k*0.3; }
    this.emberLight.intensity = 10+k*8;
  }
  _updateBraziers(dt){
    const pl=this.G.player;
    for(const b of this.braziers){
      if(b.lit){
        b.halo.material.opacity=0.35+Math.sin(this.t*3+b.x)*0.1;
        b.halo.scale.setScalar(1+Math.sin(this.t*2.6+b.x)*0.12);
        b.flame.position.y=1.82+Math.sin(this.t*5+b.x)*0.04;   // micro-motion law: flames breathe
        continue;
      }
      b.flameM.emissiveIntensity=0.35+Math.sin(this.t*1.6+b.x)*0.1;   // the dark pilot — visibly waiting
      // the relight verb — W6Lantern's exact idiom: spin/pound BESIDE the post (no edge latch needed:
      // lit flips before a second frame can double-count)
      if(!this.dead && pl && !pl.dead && (pl.attackT>0 || pl.pounding) &&
         Math.abs(pl.pos.x-b.x)<1.8 && Math.abs(pl.pos.z)<1.6){
        this._lightBrazier(b);
      }
    }
  }

  // ---------------------------------------------------------------- actions
  _nextAction(){
    while(this.queue.length){
      let a=this.queue.shift();
      if(a==='waltz' && this.mirrorAlive()) a='wave';        // budget: the court dances first (≤4, enforced)
      if(a==='waltz' && this.waltzSlow) return 'waltz';     // the slowed dance still runs — its cold aura IS the drifting pursuit now
      if(this.stripped[a]) continue;                          // the mercy: stripped families are skipped
      return a;
    }
    return null;
  }
  _beginAction(act){
    const pl=this.G.player;
    if(act==='wave'){
      this._wx = clamp(this.pos.x, -21, 21);                 // captured at the telegraph, then FIXED
      this.state='wavewind'; this.stateT=0;
      if(!this._waveToasted){ this._waveToasted=true; UI.toast('❄️ FROST WAVES — the floor answers him. HOP the rings!'); }
      AUDIO.noise && AUDIO.noise({t:0.5, vol:0.1, fFrom:200, fTo:600});
    } else if(act==='gust'){
      this._gdir = pl ? (Math.sign(pl.pos.x-this.pos.x)||1) : 1;   // captured at the telegraph, then FIXED
      this.state='gustwind'; this.stateT=0;
      if(!this._gustToasted){ this._gustToasted=true; UI.toast('🌬️ A GUST CROSSING — the wind sweeps the hall. JUMP the front!'); }
      AUDIO.tone && AUDIO.tone({f:392, f2:523, type:'triangle', t:0.55, vol:0.1});   // the herald's inhale — rising third
    } else { // waltz
      this.state='waltzwind'; this.stateT=0;
      if(!this._waltzToasted){ this._waltzToasted=true; UI.toast('❄️🎶 THE BLIZZARD WALTZ — watch the floor-glow; the icicles fall on the beat!'); }
      AUDIO.noise && AUDIO.noise({t:0.6, vol:0.1, fFrom:500, fTo:1400});
    }
  }

  _spawnRing(cx){
    // the frost wave: an expanding floor ring you HOP (band y<0.85 — a tap clears with 2× margin).
    // ent with _bossProj: EntityMgr owns cleanup; defeat() retires it.
    const speed=8.0, r0=0.6, rMax=10.0, band=0.5, hMax=0.85;
    const ring={ dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, group:new THREE.Group(),
      update(dt, GG){
        this.t+=dt;
        const r=r0+this.t*speed;
        if(r>=rMax){ this.dead=true; return; }
        this.m.scale.set(r,r,1);
        this.m.material.opacity=Math.max(0.15, 0.8-this.t*0.45);
        if((this.t*14|0)!==this._ft){ this._ft=this.t*14|0;   // frost flecks fly off the wavefront
          GG.fx.spawn(new THREE.Vector3(cx+r,0.5,0), 0x9fe8ff, 1, {speed:1.2, life:0.3});
          GG.fx.spawn(new THREE.Vector3(cx-r,0.5,0), 0x9fe8ff, 1, {speed:1.2, life:0.3}); }
        const pl=GG.player;
        if(pl && !pl.dead){
          const d=Math.abs(pl.pos.x-cx);
          if(Math.abs(d-r)<band && pl.pos.y<hMax && Math.abs(pl.pos.z)<1.9) pl.damage(1, new THREE.Vector3(pl.pos.x,0.6,0));
        }
      } };
    ring.m=new THREE.Mesh(geo('tor',1,0.05,6,30), new THREE.MeshBasicMaterial({color:0x9fe8ff, transparent:true, opacity:0.8, depthWrite:false}));
    ring.m.rotation.x=Math.PI/2; ring.m.position.set(cx,0.3,0);
    ring.group.add(ring.m);
    this.G.ents.add(ring);
  }

  _fireGust(dir){
    // the crossing: one wind-front sweeping from him to the far wall at 13u/s. Bites y<1.35 (a tap
    // always clears) and SHOVES while it bites. The gust state holds him until it leaves the hall.
    const G=this.G, x0=this.pos.x+dir*1.4;
    const front={ dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, x:x0, group:new THREE.Group(),
      update(dt, GG){
        this.t+=dt; this.x+=dir*13*dt;
        this.g.position.x=this.x;
        this.g.children[0].material.opacity=0.3+Math.sin(this.t*20)*0.1;
        if((this.t*16|0)!==this._ft){ this._ft=this.t*16|0;
          GG.fx.spawn(new THREE.Vector3(this.x, 0.4+((this._ft%3)*0.4), 0), 0xbfe8ff, 1, {speed:1.4, life:0.25}); }
        const pl=GG.player;
        if(pl && !pl.dead && Math.abs(pl.pos.x-this.x)<0.8 && Math.abs(pl.pos.z)<1.9 && pl.pos.y<1.35){
          pl.vel.x += dir*12*dt;   // the polite, insistent shove
          pl.damage(1, new THREE.Vector3(this.x,0.7,0));
        }
        if(Math.abs(this.x)>22.5) this.dead=true;
      } };
    const g=new THREE.Group();
    const veil=new THREE.Mesh(geo('box',0.7,1.3,3.4), new THREE.MeshBasicMaterial({color:0xbfe8ff, transparent:true, opacity:0.35, depthWrite:false}));
    veil.position.y=0.65; g.add(veil);
    for(let i=0;i<3;i++){ const streak=new THREE.Mesh(geo('box',1.6,0.05,0.05), new THREE.MeshBasicMaterial({color:0xeaf6ff, transparent:true, opacity:0.5, depthWrite:false}));
      streak.position.set(-dir*0.8, 0.35+i*0.4, (i-1)*0.7); g.add(streak); }
    g.position.set(x0,0,0);
    front.g=g; front.group.add(g);
    this._gust=front; G.ents.add(front);
    AUDIO.noise && AUDIO.noise({t:0.6, vol:0.15, fFrom:1400, fTo:300});
  }

  _dropIcicle(tx){
    // one icicle-fall column: 0.7s shimmer + growing floor glow (the learned language), then the fall.
    // LANDING damage only, radius 1.1 = the disc's honest final size.
    const G=this.G;
    const ic={ dead:false, cull:false, isEnemy:false, _bossProj:true, t:0, group:new THREE.Group(),
      update(dt, GG){
        this.t+=dt;
        if(this.t<0.7){
          const k=this.t/0.7;
          this.disc.material.opacity=0.12+k*0.45; this.disc.scale.setScalar(0.4+k*0.6);
          this.shard.material.emissiveIntensity=0.3+Math.abs(Math.sin(this.t*22))*0.5;
        } else {
          const y=9.4-26*(this.t-0.7);
          this.shard.position.y=y;
          if(!this._hit && y<=0.8){ this._hit=true; this.dead=true;
            AUDIO.tone && AUDIO.tone({f:2100, f2:300, type:'square', t:0.09, vol:0.1});   // glass on stone
            GG.camc.shake(0.18, 0.2);
            GG.fx.spawn(new THREE.Vector3(tx,0.5,0), 0xcfe8ff, 12, {speed:3.5, life:0.4, gravity:4});
            const pl=GG.player;
            if(pl && !pl.dead && Math.abs(pl.pos.x-tx)<1.1 && Math.abs(pl.pos.z)<1.6 && pl.pos.y<1.6) pl.damage(1, new THREE.Vector3(tx,0.6,0));
          }
        }
      } };
    ic.shard=new THREE.Mesh(geo('cone',0.28,1.5,6), new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x7ab0e0, emissiveIntensity:0.3, transparent:true, opacity:0.92}));
    ic.shard.rotation.x=Math.PI; ic.shard.position.set(tx,9.4,0);
    ic.disc=new THREE.Mesh(geo('circ',1.1,14), new THREE.MeshBasicMaterial({color:0x7ae8ff, transparent:true, opacity:0.1, depthWrite:false}));
    ic.disc.rotation.x=-Math.PI/2; ic.disc.position.set(tx,0.06,0);
    ic.group.add(ic.shard, ic.disc);
    G.ents.add(ic);
  }

  _clearAttackVisuals(){
    this.footGlow.material.opacity=0;
    this.gleam.material.opacity=0;
    this.body.rotation.z=0;
    this.armL.rotation.z=-0.55; this.armR.rotation.z=0.55;
  }
  _clearThreats(){
    for(const m of this.mirrors) if(!m.dead){ m.dead=true; if(m.shadow) this.G.scene.remove(m.shadow); }
    for(const e of (this.G.ents.list||[])){
      if(e._bossProj) e.dead=true;
      if(e.isEnemy && !e.dead){ e.dead=true; if(e.shadow) this.G.scene.remove(e.shadow); }
    }
    this._gust=null;
    this._clearAttackVisuals();
  }

  hurtPlayer(n, from){
    const pl=this.G.player;
    if(pl && !pl.dead) pl.damage(n, from||this.pos);
  }

  // ---------------------------------------------------------------- defeat → THE INVITE
  defeat(){
    // PIP 12 LANDS — the record stops HERE (the w5 idiom); the invite is a gift, not a timer.
    this.G._bossEndT = this.G.runT||0;
    this.pipSafe = true;                       // nothing touches Pip from this moment
    this.dead = true;
    this.vulnerable = false;
    this.state='kneel'; this.stateT=0;
    this._kneelY0 = this.body.position.y;
    this._gateBuilt=false; this._grimmIn=false; this._marker=null; this._hintT=0; this._nextHint=undefined;
    this._clearThreats();
    window.UI && UI.hideBossBar();
    window.UI && UI.closeDialogue();
    AUDIO.victory && AUDIO.victory();
    this.G.hitstop = 0.2;                      // the hall holds its breath
    this.G.camc.shake(0.4, 0.5);
    this.G.fx.spawn(new THREE.Vector3(this.pos.x,3,0), 0xffffff, 30, {speed:6, life:0.8});
  }

  _buildGate(){
    // the hall gate opens — the boss5 light-gate rig, in palace silver
    const G=this.G, gate=new THREE.Group();
    const postM=new THREE.MeshLambertMaterial({color:W10PAL.regalS, emissive:0x8aa4d8, emissiveIntensity:0.7});
    const pgL=new THREE.Mesh(geo('box',0.4,4.6,0.5), postM); pgL.position.set(-1.3,2.3,0); gate.add(pgL);
    const pgR=pgL.clone(); pgR.position.x=1.3; gate.add(pgR);
    const top2=new THREE.Mesh(geo('box',3.4,0.5,0.5), postM); top2.position.y=4.75; gate.add(top2);
    this._gatePortal=new THREE.Mesh(geo('box',2.2,4.2,0.1), new THREE.MeshBasicMaterial({color:0xffe9b0, transparent:true, opacity:0.32, blending:THREE.AdditiveBlending, depthWrite:false}));
    this._gatePortal.position.y=2.2; gate.add(this._gatePortal);
    gate.position.set(22.8,0,0); G.scene.add(gate); this._gate=gate;
    AUDIO.portal && AUDIO.portal();
    G.fx.spawn(new THREE.Vector3(22.8,2.5,0), 0xffe9b0, 16, {speed:3, life:0.7});
  }
  _buildGrimm(){
    // GRIMM, the night-watchman — the hooded ghost-grey rig from 08b_frosthub, lantern first, scarf on
    const G=this.G, gr=new THREE.Group();
    const gm=new THREE.MeshLambertMaterial({color:0x5a5578, emissive:0x8a7fd0, emissiveIntensity:0.22});
    const body=new THREE.Mesh(geo('sph',0.62,10,9), gm); body.position.y=1.0; body.scale.set(1,1.35,0.9); gr.add(body);
    const hood=new THREE.Mesh(geo('sph',0.42,9,8), gm); hood.position.y=1.9; gr.add(hood);
    for(const s of [-1,1]){ const eye=mesh('sph',[0.07,6,6], emat(0xffd98a,0xffd98a,1)); eye.position.set(s*0.14,1.92,0.32); gr.add(eye); }
    this._grimmLan=new THREE.Group();
    const cage=mesh('box',[0.22,0.3,0.22], mat(0x2a3048));
    this._grimmFlame=new THREE.Mesh(geo('sph',0.09,6,5), new THREE.MeshLambertMaterial({color:0xffb85e, emissive:0xffb85e, emissiveIntensity:1}));
    this._grimmLan.add(cage, this._grimmFlame); this._grimmLan.position.set(0.66,1.1,0.2); gr.add(this._grimmLan);
    const scarf=mesh('tor',[0.34,0.1,6,12], emat(0xd83a4a,0x8a1e2c,0.3)); scarf.position.y=1.6; scarf.rotation.x=0.16; gr.add(scarf);   // still wearing it. of course he is.
    gr.position.set(26,0,0); gr.rotation.y=-Math.PI/2;
    G.scene.add(gr); this._grimm=gr;
  }

  // ---------------------------------------------------------------- the loop
  update(dt){
    if(!this.group) return;
    this.t+=dt; this.stateT+=dt;
    if(this.hitCD>0) this.hitCD-=dt;
    const G=this.G, pl=G.player, p=this.pos;

    // ---- the vulnerability truth, once per frame (the chest only opens while he breathes) ----
    this.vulnerable = !this.dead && this.state==='breathe';

    // ---- the crown/chest crossfade (the crown-glow DIPS TO THE CHEST when he breathes) ----
    if(this.vulnerable){
      this.chestM.emissiveIntensity = 1.3+Math.sin(this.t*6)*0.35;
      this.chestHalo.material.opacity = 0.3+Math.sin(this.t*6)*0.08;
      this.crownM.emissiveIntensity = damp(this.crownM.emissiveIntensity, 0.12, 8, dt);
      this.crownHalo.material.opacity = damp(this.crownHalo.material.opacity, 0.03, 8, dt);
    } else {
      this.chestM.emissiveIntensity = damp(this.chestM.emissiveIntensity, 0.18, 5, dt);
      this.chestHalo.material.opacity = damp(this.chestHalo.material.opacity, 0, 6, dt);
      this.crownM.emissiveIntensity = damp(this.crownM.emissiveIntensity, 0.9, 4, dt) + (this.dead?0:Math.sin(this.t*3)*0.1);
      this.crownHalo.material.opacity = damp(this.crownHalo.material.opacity, 0.16, 4, dt);
    }
    this.chestHalo.scale.setScalar(1+Math.sin(this.t*3.2)*0.15);

    // ---- micro-motion: aurora ribbons swim through him; the snow mantle trickles; the hem drifts ----
    for(let i=0;i<this.bodyRibbons.length;i++){
      const rb=this.bodyRibbons[i];
      rb.position.x=Math.sin(this.t*0.7+i*2.1)*0.5;
      rb.material.opacity=0.22+Math.sin(this.t*0.9+i*1.6)*0.1;
    }
    this.hem.rotation.z += dt*0.3;
    if((this.t*6|0)!==this._mantleTick){ this._mantleTick=this.t*6|0;
      const s=(this._mantleTick%2)?1:-1;
      G.fx.spawn(new THREE.Vector3(p.x+s*0.6, this.body.position.y+3.7, 0.3), 0xdfe8fa, 1, {speed:0.3, life:0.8, gravity:2, size:0.5});
    }

    // ---- braziers (always tended, even mid-attack — the mercy never waits) ----
    this._updateBraziers(dt);

    // ---- chest hit detection (the boss runs its own — generic player loops only reach ents) ----
    if(this.vulnerable && pl && !pl.dead){
      const cv=this.chestWorld();
      const dxz=Math.hypot(pl.pos.x-cv.x, pl.pos.z-cv.z);
      if(pl.vel.y<0 && dxz<1.6 && pl.pos.y>cv.y-0.6 && pl.pos.y<cv.y+1.7){
        pl.bounceOff(12);
        AUDIO.stomp && AUDIO.stomp();
        this.takeHit();
      } else if(pl.attackT>0 && !this._swingClaimed && dxz<2.1 && Math.abs((pl.pos.y+0.7)-cv.y)<1.6){
        this._swingClaimed=true;
        this.takeHit();
      }
    }
    if(pl && pl.attackT<=0) this._swingClaimed=false;

    // ---- the pass-through teach: swings on living frost outside a breath just... pass through ----
    const swingingBody = pl && !pl.dead && (pl.attackT>0 || pl.pounding);
    if(swingingBody && !this._chillClaim && !this.dead && !this.vulnerable &&
       Math.abs(pl.pos.x-p.x)<2.2 && Math.abs(pl.pos.z)<1.8 && pl.pos.y<4.5){
      this._chillClaim=true;
      G.fx.spawn(new THREE.Vector3(pl.pos.x, pl.pos.y+1, 0.3), 0xbfe8ff, 3, {speed:1.5, life:0.3});
      if(!this._chillToasted){ this._chillToasted=true;
        UI.toast('❄️ Your bag passes THROUGH the living frost — wait for him to BREATHE, then strike the chest-light!'); }
    }
    if(!swingingBody) this._chillClaim=false;

    // ---- his cold aura: bites ONLY while he moves (drift/waltz — motion is the telegraph);
    //      polite shove during wind-ups; harmless while breathing (you must reach the chest) ----
    if(pl && !pl.dead && !this.dead){
      const dx=pl.pos.x-p.x;
      const near = Math.abs(dx)<1.35 && Math.abs(pl.pos.z)<1.7 && pl.pos.y<3.4;
      if(near && (this.state==='drift' || this.state==='waltz')) this.hurtPlayer(1);
      else if(near && (this.state==='wavewind' || this.state==='gustwind' || this.state==='gust' || this.state==='waltzwind')){
        pl.pos.x += (Math.sign(dx)||1)*(1.35-Math.abs(dx))*dt*5;
      }
    }

    // ---- facing: a subtle regal turn toward the player (he never wheels — court posture) ----
    if(!this.dead && this.state!=='intro') this.body.rotation.y = damp(this.body.rotation.y, (pl && pl.pos.x<p.x)?0.3:-0.3, 4, dt);

    switch(this.state){
      case 'intro': {
        // he is already there, mid-hall, hands folded — a figure that has been waiting for ten thousand years
        this.body.position.y = Math.sin(this.t*0.9)*0.06;
        if(this.stateT>1.0 && !this._introDlg){ this._introDlg=true; G.camc.shake(0.3,0.4);
          window.UI && UI.dialogue('❄️', '"A guest. For ME. ...I stood outside every window in the world for ten thousand winters, and nobody knew to invite the winter in. I am not angry, little flame. I have never once been angry. Come sit where the warm is. I keep it very safe."', 12000); }
        if(this.stateT>1.3 && !this._hintShown){ this._hintShown=true;
          window.UI && UI.toast('🔥 Four AURORA BRAZIERS stand dark around the hall. SPIN beside one — every flame you give it unmakes a piece of his weather.'); }
        if(this.stateT>1.5){ this._applyPhase(); this.state='drift'; this.stateT=0; this.driftT=0; }
        break;
      }
      case 'drift': {
        // the slow drifting pursuit — inevitable, unhurried, ten thousand years of patience
        this.driftT=(this.driftT||0)+dt;
        if(pl){
          const dx=pl.pos.x-p.x;
          if(Math.abs(dx)>2.2) p.x += Math.sign(dx)*this.chaseSp*dt;
          p.x = clamp(p.x, -19, 19);
        }
        this.body.position.y = damp(this.body.position.y, 0, 4, dt) + Math.sin(this.t*1.4)*0.07;
        if(this.driftT>0.6 && pl && (Math.abs(pl.pos.x-p.x)<8.5 || this.driftT>3.2)){
          if(this.queue.length===0){ this._sy0=this.body.position.y; this.state='settle'; this.stateT=0; }
          else {
            const act=this._nextAction();
            if(act===null){ this._sy0=this.body.position.y; this.state='settle'; this.stateT=0; }   // all stripped → he only breathes
            else this._beginAction(act);
          }
        }
        break;
      }
      case 'wavewind': {
        // 0.7s — the glow at his feet grows for the FULL wind (bombardment language). Fixed center.
        const k=Math.min(1, this.stateT/0.7);
        this.footGlow.position.x=this._wx;
        this.footGlow.material.opacity=k*0.5;
        this.footGlow.scale.setScalar(0.4+k*1.0);
        this.body.position.y = damp(this.body.position.y, 0.25, 8, dt);   // he lifts — the floor inhales
        if(this.stateT>=0.7){
          this.footGlow.material.opacity=0;
          this._spawnRing(this._wx);
          AUDIO.poundHit && AUDIO.poundHit();
          G.camc.shake(0.3, 0.3);
          this.state='waveout'; this.stateT=0;
        }
        break;
      }
      case 'waveout': {
        this.body.position.y = damp(this.body.position.y, 0, 8, dt);
        if(this.stateT>0.3){ this.state='drift'; this.stateT=0; this.driftT=0; }
        break;
      }
      case 'gustwind': {
        // 0.7s — a gleam strip races the floor from him to the wall he'll sweep; his arms rise
        const k=Math.min(1, this.stateT/0.7);
        const wall=this._gdir>0?22.5:-22.5;
        const len=Math.abs(wall-p.x);
        this.gleam.scale.x=len; this.gleam.position.x=p.x+this._gdir*len/2; this.gleam.position.z=0;
        this.gleam.material.opacity=0.1+k*0.3+Math.sin(this.t*18)*0.06*k;
        this.armL.rotation.z=damp(this.armL.rotation.z,-1.5,8,dt); this.armR.rotation.z=damp(this.armR.rotation.z,1.5,8,dt);
        if(this.stateT>=0.7){
          this.gleam.material.opacity=0;
          this._fireGust(this._gdir);
          this.state='gust'; this.stateT=0;
        }
        break;
      }
      case 'gust': {
        // he holds the exhale until his front leaves the hall (the serialization that pins the budget)
        this.body.rotation.z = this._gdir*-0.08;
        if(!this._gust || this._gust.dead){
          this._gust=null;
          this.body.rotation.z=0;
          this.armL.rotation.z=-0.55; this.armR.rotation.z=0.55;
          this.state='drift'; this.stateT=0; this.driftT=0;
        }
        break;
      }
      case 'waltzwind': {
        // 0.8s full-body telegraph: he draws himself UP and BOWS — the court knows what comes next
        const k=Math.min(1, this.stateT/0.8);
        this.body.position.y = damp(this.body.position.y, 0.3, 6, dt);
        this.body.rotation.x = Math.sin(k*Math.PI)*0.22;   // the bow
        if(this.stateT>=0.8){
          this.body.rotation.x=0;
          this.state='waltz'; this.stateT=0;
          this._waltzX0=clamp(p.x,-10,10); this._bar=-1;
          this._barLen=this.waltzSlow?2.4:1.5;
          AUDIO.noise && AUDIO.noise({t:0.4, vol:0.08, fFrom:800, fTo:1600});
        }
        break;
      }
      case 'waltz': {
        // THE BLIZZARD WALTZ — 4 bars of 3/4 on a fixed figure; icicles step around it on the downbeats.
        // Slowed (4th brazier): biteless and slower — the dance IS the drifting pursuit now.
        const T=this.stateT, barLen=this._barLen, danceT=barLen*4;
        p.x = clamp(this._waltzX0 + 9*Math.sin(TAU*T/danceT), -19, 19);
        this.body.position.y = 0.1+Math.abs(Math.sin(Math.PI*T/barLen*3))*0.09;   // ONE-two-three
        this.body.rotation.z = Math.sin(TAU*T/barLen)*0.09;                        // the sway
        const bar=Math.floor(T/barLen);
        if(bar!==this._bar && bar<4){
          this._bar=bar;
          // the downbeat: an icicle steps around the figure at a FIXED offset (captured now, fixed)
          if(!this.stripped.icicle){
            const off=[4.5,-4.5,6,-6][bar];
            this._dropIcicle(clamp(p.x+off, -21, 21));
          }
          AUDIO.tone && AUDIO.tone({f:196, type:'triangle', t:0.14, vol:0.07});    // oom
        }
        const beat=Math.floor((T%barLen)/(barLen/3));
        if(beat!==this._beat){ this._beat=beat;
          if(beat>0) AUDIO.tone && AUDIO.tone({f:beat===1?392:440, type:'triangle', t:0.1, vol:0.05}); }   // pah-pah
        if((this.t*10|0)!==this._twirlTick){ this._twirlTick=this.t*10|0;
          G.fx.spawn(new THREE.Vector3(p.x+Math.sin(this.t*7)*1.4, 1+Math.sin(this.t*9)*0.7, 0.4), 0x9fe8ff, 1, {speed:1.2, life:0.4}); }
        if(T>=danceT){
          this.body.rotation.z=0;
          this.state='waltzout'; this.stateT=0;
        }
        break;
      }
      case 'waltzout': {
        // the closing bow — the hall applauds with silence
        this.body.rotation.x = Math.sin(Math.min(1,this.stateT/0.5)*Math.PI)*0.18;
        this.body.position.y = damp(this.body.position.y, 0, 6, dt);
        if(this.stateT>0.5){ this.body.rotation.x=0; this.state='drift'; this.stateT=0; this.driftT=0; }
        break;
      }
      case 'settle': {
        // the rotation is spent — he sinks, and the crown-light slides down to his chest
        const k=Math.min(1, this.stateT/0.5);
        this.body.position.y = lerp(this._sy0||0, -0.55, k);
        this.body.rotation.x = 0.1*k;
        if(this.stateT>=0.5){
          this.state='breathe'; this.stateT=0;
          if(!this._breathToasted){ this._breathToasted=true;
            UI.toast('❄️ He BREATHES — the crown-glow sinks to his CHEST. Strike the chest-light!'); }
          AUDIO.noise && AUDIO.noise({t:0.6, vol:0.1, fFrom:400, fTo:120});   // ten thousand winters, sighing
        }
        break;
      }
      case 'breathe': {
        // THE WINDOW — chest only; hitCD spaces the pips; he is harmless while he inhales the warm
        this.body.position.y = -0.55+Math.sin(this.t*2.4)*0.05;
        this.body.rotation.x = 0.1+Math.sin(this.t*1.8)*0.02;
        if(this.stateT>this.breathLen){ this._rY0=this.body.position.y; this.state='rise'; this.stateT=0; }
        break;
      }
      case 'rise': {
        const k=Math.min(1, this.stateT/0.6);
        this.body.position.y = lerp(this._rY0!==undefined?this._rY0:-0.55, 0, k);
        this.body.rotation.x = 0.1*(1-k);
        if(this.stateT>=0.6){
          this.body.position.y=0; this.body.rotation.x=0;
          if(this.queue.length===0) this.queue=this.actions.slice();   // same order, every cycle, forever
          this.state='drift'; this.stateT=0; this.driftT=0;
        }
        break;
      }
      case 'shift': {
        // a phase boundary — the weather changes key. He rises; the aurora churns; nothing bites.
        const k=Math.min(1, this.stateT/0.6);
        this.body.position.y = lerp(this._shiftY0||0, 0, Math.min(1,this.stateT/0.4)) + 0.35*Math.sin(k*Math.PI);
        this.crownM.emissiveIntensity = 0.9+Math.abs(Math.sin(this.stateT*14))*0.6;
        for(const rb of this.bodyRibbons) rb.material.opacity = 0.3+Math.abs(Math.sin(this.stateT*10))*0.3;
        if(this.stateT>1.4){
          this.body.position.y=0;
          this._shiftDone();
        }
        break;
      }
      case 'kneel': {
        // PIP 12 — he kneels, flickering, small... and the doors open for the one guest who understands
        const T=this.stateT;
        p.x = damp(p.x, 0, 1.2, dt);
        this.body.position.y = damp(this.body.position.y, -1.1, 3, dt);
        this.body.rotation.x = damp(this.body.rotation.x, 0.3, 3, dt);
        const sc = damp(this.body.scale.x, 0.78, 2, dt);
        this.body.scale.setScalar(sc);
        // the flicker — a candle deciding whether it is allowed to stay lit
        const fl = 0.6+Math.abs(Math.sin(T*9))*0.3*Math.max(0.3,1-T*0.1);
        this.gownM.opacity = 0.55+fl*0.3;
        if(T>0.8 && !this._kneltDlg){ this._kneltDlg=true;
          window.UI && UI.dialogue('❄️', '"...there. Take it back. I only wanted to stand a little nearer. Cold does not get to warm itself. That is the whole rule of me."', 10000); }
        if(T>1.6 && !this._gateBuilt){ this._gateBuilt=true;
          this._buildGate(); this._buildGrimm();
          window.UI && UI.toast('🏮 The doors open — GRIMM walks in, lantern first. He knows this exact silence.'); }
        if(this._gatePortal) this._gatePortal.material.opacity = 0.28+Math.sin(this.t*3.2)*0.1;
        if(this._grimm){
          // the walk-in spline: gate → center, a small bobbing determined figure
          this._grimm.position.x = damp(this._grimm.position.x, 2.3, 1.6, dt);
          this._grimm.position.y = Math.abs(Math.sin(this.t*5))*0.05;
          this._grimm.rotation.y = damp(this._grimm.rotation.y, -Math.PI/2, 4, dt);
          if(!this._grimmIn && this._grimm.position.x<3.4){
            this._grimmIn=true;
            // the "come here" marker every platformer kid knows
            const mk=new THREE.Group();
            const arrow=new THREE.Mesh(geo('cone',0.34,0.7,6), new THREE.MeshLambertMaterial({color:0xffd23f, emissive:0xffb020, emissiveIntensity:1}));
            arrow.rotation.x=Math.PI; mk.add(arrow);
            const mring=new THREE.Mesh(geo('tor',0.5,0.06,6,18), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0.8}));
            mk.add(mring);
            mk.position.set(2.3,3.4,0); G.scene.add(mk); this._marker=mk;
          }
        }
        if(this._grimmIn){
          this._hintT+=dt;
          if(this._nextHint===undefined || this._hintT>=this._nextHint){
            this._nextHint=this._hintT+14;
            window.UI && UI.dialogue('🏮', 'Stand with Grimm. (Press ANY button.)');
          }
          if(this._marker){ this._marker.position.y=3.3+Math.abs(Math.sin(this.t*3.2))*0.5; this._marker.rotation.y=this.t*2;
            this._marker.children[1].scale.setScalar(1+Math.sin(this.t*6)*0.2); }
          // THE INVITE — any action button beside Grimm (touch has no interact affordance in boss areas)
          if(pl && !pl.dead && Math.abs(pl.pos.x-2.3)<3.2 && (INPUT.interactEdge || INPUT.jumpEdge || INPUT.attackEdge || INPUT.poundEdge)){
            INPUT.interactEdge=false; INPUT.jumpEdge=false; INPUT.attackEdge=false; INPUT.poundEdge=false;
            this.state='ending'; this.stateT=0; this._endStage=0;
            if(this._marker){ G.scene.remove(this._marker); this._marker=null; }
            window.UI && UI.closeDialogue();
          }
        }
        break;
      }
      case 'ending': {
        // THE WHOLESOME CLOSE — ~10s on the state machine, UNTIMED (the record stopped at pip 12).
        const T=this.stateT;
        this.gownM.opacity = damp(this.gownM.opacity, 0.85, 3, dt);
        this.body.rotation.y = damp(this.body.rotation.y, 0, 3, dt);   // he turns to face you both
        if(this._grimm) this._grimm.position.y = Math.abs(Math.sin(this.t*2.2))*0.03;
        // stage 0 — GRIMM SPEAKS. His exact line — he has been on both sides of this door.
        if(this._endStage===0 && T>0.4){ this._endStage=1;
          window.UI && UI.dialogue('🫥', '"I know what you are. I was what you are. Come to the festival — both of them."', 12000);
          AUDIO.heart && AUDIO.heart();
        }
        // stage 1 — the lantern is held out TOGETHER (it lifts from Grimm's hand to the space between)
        else if(this._endStage===1 && T>3.6){ this._endStage=2;
          if(this._grimmLan){
            this._grimm.remove(this._grimmLan);
            this._grimmLan.position.set(this._grimm.position.x+0.3, 1.4, 0.3);   // lifts from his hand, no pop
            G.scene.add(this._grimmLan);
          }
          G.fx.spawn(new THREE.Vector3(this._grimm.position.x+0.3, 1.7, 0.3), 0xffd98a, 12, {speed:2, life:0.6, gravity:-0.5});
          AUDIO.heart && AUDIO.heart();
        }
        // stage 2 — the First Frost takes it WITH BOTH HANDS; the thaw begins in his face first
        else if(this._endStage===2 && T>5.2){ this._endStage=3;
          this._warm=0;
        }
        // stage 3 — THE FROZEN HEARTHLIGHT EMBER SHATTERS ITS ICE AND ROARS ALIGHT
        else if(this._endStage===3 && T>6.6){ this._endStage=4;
          this.shell.visible=false;
          G.fx.spawn(new THREE.Vector3(0,1.3,-2.2), 0xcfe8ff, 26, {speed:6, life:0.7, gravity:2});   // the ice, leaving
          this._flame=new THREE.Mesh(geo('cone',1.3,3.8,10), new THREE.MeshLambertMaterial({color:0xff7020, emissive:0xff6a1a, emissiveIntensity:0.9, transparent:true, opacity:0.94}));
          this._flame.position.set(0,3.2,-2.4); G.scene.add(this._flame);
          this._flameIn=new THREE.Mesh(geo('cone',0.55,2.2,8), new THREE.MeshLambertMaterial({color:0xffd98a, emissive:0xffb050, emissiveIntensity:1.1, transparent:true, opacity:0.95}));
          this._flameIn.position.set(0,2.7,-2.4); G.scene.add(this._flameIn);
          this.emberLight.intensity=90; this.emberLight.distance=36; this.emberLight.position.set(0,4,-1.2);
          this.emberM.emissiveIntensity=1.4;
          // the hall floods warm — every emissive cranks; the aurora turns GOLD
          this._warmTargetBg=new THREE.Color(0x3a2233); this._warmTargetFog=new THREE.Color(0x5a3244);
          const GOLD=[0xffd23f,0xffb85e,0xffe9b0];
          for(let i=0;i<this.auroraMats.length;i++) this.auroraMats[i].color.setHex(GOLD[i%3]);
          for(let i=0;i<this.bodyRibbons.length;i++) this.bodyRibbons[i].material.color.setHex(GOLD[i%3]);
          for(const rm of this.roseMats){ rm.emissive && rm.emissive.setHex(0xffb85e); rm.emissiveIntensity=0.9; }
          for(const b of this.braziers){ if(b.flameM){ b.flameM.color.set(0xffd98a); b.flameM.emissive.set(0xffb85e); b.flameM.emissiveIntensity=2; } if(b.halo) b.halo.material.opacity=0.5; }
          if(this.velvetM){ this.velvetM.emissive.set(0xb85e2e); this.velvetM.emissiveIntensity=0.5; }
          // gentle snow begins — the finale's first-snow echo (26 flake billboards, the 10e idiom)
          this._snow=[];
          for(let i=0;i<26;i++){
            const fl2=new THREE.Mesh(geo('circ',0.09,5), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.85, side:THREE.DoubleSide}));
            fl2.userData={x0:rand(-20,20), z0:rand(-2,3), sp:rand(0.14,0.3), ph:rand(9)};
            G.scene.add(fl2); this._snow.push(fl2);
          }
          window.UI && UI.finaleBanner('🔥 THE HEARTHLIGHT ROARS ALIGHT', 5200);
          G.camc.shake(0.6, 0.7);
          AUDIO.goldPumpkin && AUDIO.goldPumpkin();
          candyBurst(G, new THREE.Vector3(2.5,1.5,0), 24);
        }
        // stage 4 — the toast, over falling snow
        else if(this._endStage===4 && T>8.2){ this._endStage=5;
          window.UI && UI.toast('❄️ The First Frost makes it snow — gently, on every festival, forever. It always wanted to.', 6500);
        }
        // stage 5 — done, ONCE, no args (the victory card's w10 copy + hub2's Hearthlight take it from here)
        else if(this._endStage===5 && T>10.6 && !this._doneFired){
          this._doneFired=true;
          G.onBossDefeated();
        }
        // ---- continuous ending motion ----
        // the lantern floats to his chest as his arms reach for it (both hands — the first thing
        // he has ever been handed)
        if(this._endStage>=3){
          this.armL.rotation.z = damp(this.armL.rotation.z, -1.1, 3, dt); this.armL.rotation.x = damp(this.armL.rotation.x, -0.5, 3, dt);
          this.armR.rotation.z = damp(this.armR.rotation.z, 1.1, 3, dt);  this.armR.rotation.x = damp(this.armR.rotation.x, -0.5, 3, dt);
          if(this._grimmLan){
            this._grimmLan.position.x = damp(this._grimmLan.position.x, p.x, 2.2, dt);
            this._grimmLan.position.y = damp(this._grimmLan.position.y, this.body.position.y+2.1, 2.2, dt);
            this._grimmLan.position.z = damp(this._grimmLan.position.z, 0.55, 2.2, dt);
            this._grimmLan.rotation.y += dt*0.8;
            if(this._grimmFlame) this._grimmFlame.material.emissiveIntensity = 1+Math.sin(this.t*6)*0.3;
          }
          this.body.position.y = damp(this.body.position.y, -0.6, 1.5, dt);       // he stays low — holding it like it might break
          this.body.scale.setScalar(damp(this.body.scale.x, 0.9, 1.5, dt));
        }
        if(this._warm!==undefined && this._warm<1){
          // the thaw: pale patient ice warms toward hearth-light; the sad eyes go round and gold
          this._warm=Math.min(1, this._warm+dt/1.6);
          this.gownM.emissive.lerpColors(new THREE.Color(0x5a8ec8), new THREE.Color(0xc88a5e), this._warm);
          this.headM.emissive.lerpColors(new THREE.Color(0x7ab0e0), new THREE.Color(0xd8a070), this._warm);
          this.eyeM.emissive.lerpColors(new THREE.Color(0xcfe8ff), new THREE.Color(0xffd98a), this._warm);
          this.eyeM.emissiveIntensity = 0.7+this._warm*0.5;
          this.crownM.emissive.lerpColors(new THREE.Color(0x7ae8ff), new THREE.Color(0xffd23f), this._warm);
          this.crownM.emissiveIntensity = 0.9;
          this.chestM.emissiveIntensity = 0.3+this._warm*0.7;
        }
        if(this._flame){
          const s=1+Math.sin(this.t*7)*0.12;
          this._flame.scale.set(s, 1+Math.sin(this.t*5.2)*0.18, s);
          this._flameIn.scale.set(1+Math.sin(this.t*9+1)*0.15, 1+Math.sin(this.t*6.4+2)*0.2, 1);
          this.G.scene.background.lerp(this._warmTargetBg, Math.min(1,dt*1.2));
          if(this.G.scene.fog) this.G.scene.fog.color.lerp(this._warmTargetFog, Math.min(1,dt*1.2));
        }
        if(this._snow) for(const fl2 of this._snow){ const u=fl2.userData; const f=((this.t*u.sp+u.ph)%1); fl2.position.set(u.x0+Math.sin(this.t+u.ph)*0.8, 11*(1-f), u.z0); }
        break;
      }
    }

    // ---- visuals ----
    this.group.position.copy(p);
    this.ember.scale.setScalar(1+Math.sin(this.t*2.2)*0.15);   // the caged warmth, beating — always
    this.shadow.visible = true;
    this.shadow.position.set(p.x, 0.03, p.z);
  }
}

// =============================== ARENA ===============================
function buildBossArena10(G){
  const S = G.scene;
  const x1 = -24, x2 = 24;   // THE THRONE HALL, ~48u — where the cold sits crowned
  // ---- floor: ancient ice tiles under a velvet runner (solid; the weather is the only hazard) ----
  G.world.addBox(0, -1, 0, 60, 1, 12, {});
  const floorG = new THREE.Group();
  const slab = mesh('box',[60,1,12], mat(W10PAL.iceD)); slab.position.y=-0.5; floorG.add(slab);
  for(let x=-27; x<27; x+=1.8){
    const t = mesh('box',[1.6,0.08,11], mat((Math.floor(x/1.8)%2)?W10PAL.ice:W10PAL.iceD)); t.position.set(x+0.9,0.01,0); floorG.add(t);
  }
  for(const gz of [-1.5,1.5]){ const gilt=mesh('box',[48,0.05,0.14], mat(W10PAL.regalG)); gilt.position.set(0,0.05,gz); floorG.add(gilt); }
  S.add(bakeGroup(floorG));
  // the runner — bespoke material: it WARMS as the braziers light (the boss holds the dial)
  const velvetM = new THREE.MeshLambertMaterial({color:W10PAL.velvet, emissive:0x1a0e26, emissiveIntensity:0.15});
  const runner = new THREE.Mesh(geo('box',48,0.06,2.6), velvetM); runner.position.set(0,0.04,0); S.add(runner);
  // ---- rim walls — nobody leaves the court unheard ----
  G.world.addBox(-25.5, -2, 0, 3, 18, 12, {});
  G.world.addBox(25.5, -2, 0, 3, 18, 12, {});
  const walls = new THREE.Group();
  for(const s of [-1,1]){
    for(let i=0;i<3;i++){
      const buttress = mesh('box',[1.6,5+i*2.4,2.2], mat(W10PAL.wall)); buttress.position.set(s*(24.2+i*0.7), (5+i*2.4)/2, -1+i*0.5); walls.add(buttress);
      const capB = mesh('cone',[1.1,1.6,4], mat(0x2a3a60)); capB.position.set(s*(24.2+i*0.7), 5.8+i*2.4, -1+i*0.5); walls.add(capB);
    }
  }
  S.add(bakeGroup(walls));

  // ---- the GREAT THRONE (center-back) + colonnade — the court that kept its manners ----
  const deco = new THREE.Group();
  { const seat=mesh('box',[2.6,0.7,1.6], mat(W10PAL.iceD)); seat.position.set(0,1.1,-5.2); deco.add(seat);
    const back=mesh('box',[2.6,4.2,0.5], mat(W10PAL.iceD)); back.position.set(0,3.2,-5.9); deco.add(back);
    const crown=mesh('cone',[0.5,1.3,6], emat(W10PAL.frost,W10PAL.frost,0.6)); crown.position.set(0,5.8,-5.9); deco.add(crown);
    for(const s of [-1,1]){
      const armr=mesh('box',[0.4,1.1,1.4], mat(W10PAL.wall)); armr.position.set(s*1.3,1.5,-5.1); deco.add(armr);
      const finial=mesh('sph',[0.2,7,6], emat(0x7ae8ff,0x7ae8ff,0.7)); finial.position.set(s*1.3,2.2,-4.6); deco.add(finial);
      const spire=mesh('cone',[0.3,2.2,5], mat(W10PAL.iceD)); spire.position.set(s*1.55,5.2,-5.9); deco.add(spire);
    } }
  for(const px of [-16,-6,6,16]){
    const pillar=mesh('cyl',[0.7,0.9,9,9], mat(W10PAL.wall)); pillar.position.set(px,4.5,-6.5); deco.add(pillar);
    const capP=mesh('box',[2,0.5,1.4], mat(0x2a3a60)); capP.position.set(px,9,-6.5); deco.add(capP);
    const base=mesh('cyl',[1.05,1.15,0.5,9], mat(0x2a3a60)); base.position.set(px,0.25,-6.5); deco.add(base);
  }
  S.add(bakeGroup(deco));

  // ---- ROSE WINDOWS flanking the throne — bespoke emissives the ending cranks gold ----
  const roseMats = [];
  for(const [rx,cc] of [[-12,W10PAL.aur1],[12,W10PAL.aur3]]){
    const rm = new THREE.MeshLambertMaterial({color:cc, emissive:cc, emissiveIntensity:0.5});
    const rose = new THREE.Mesh(geo('cyl',1.7,1.7,0.2,12), rm); rose.rotation.x=Math.PI/2; rose.position.set(rx,7,-8.5); S.add(rose);
    const rim = mesh('tor',[1.7,0.14,5,16], mat(0x2a3a60)); rim.position.copy(rose.position); S.add(rim);
    for(let sp=0;sp<6;sp++){ const a=sp/6*TAU; const spoke=mesh('box',[0.09,1.6,0.07], mat(0x2a3a60));
      spoke.position.set(rx+Math.cos(a)*0.8, 7+Math.sin(a)*0.8, -8.3); spoke.rotation.z=a; S.add(spoke); }
    roseMats.push(rm);
  }

  // ---- foreground silhouettes (depth framing law) — fallen drapes and a toppled candelabrum ----
  const fore = new THREE.Group();
  for(const [fx2,fh] of [[-11,2.6],[13,3.1]]){
    const drape=mesh('cone',[1.0,fh,5], mat(0x140f26)); drape.position.set(fx2,fh/2-0.2,3.8); fore.add(drape);
  }
  { const cand=mesh('cyl',[0.09,0.12,2.6,6], mat(0x141c34)); cand.rotation.z=1.35; cand.position.set(4,0.35,3.5); fore.add(cand); }
  S.add(bakeGroup(fore));

  w10Parallax(S, x1, x2);
  w10Clutter(G, x1+2, x2-2, 'palace');   // fallen crowns, frost roses, candles burning cold — baked

  // ---- the crowned night, wired (contract order per the kit; the boss owns its own lifecycle) ----
  G.scene.background = new THREE.Color(W10PAL.sky);
  if(G.scene.fog) G.scene.fog.color.set(W10PAL.fog);
  G.spawnPoint.set(-18, 1, 0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -12;           // formality: the floor is solid and the hall is walled
  G.camMinY = -2;
  G.bats = makeBats(G.scene, 3, 26);
  G.amb = w10Ambience(S, x1, x2);
  w6Aurora(G, x1, x2);
  // THE AURORA'S HOME, at full court dress: crank the ribbons (the w10 kit idiom) and KEEP the
  // materials — the ending turns them gold (the ticker owns opacity, never color)
  const auroraMats = [];
  S.traverse(o=>{ if(o.material && o.material.blending===THREE.AdditiveBlending && o.geometry && o.geometry.type==='PlaneGeometry' && o.position.z<-28){ o.material.opacity=0.22; auroraMats.push(o.material); } });
  G.lightPools = G.lightPools || [];
  // lights budget: the sealed ember's small heart (1) + up to 4 brazier lights as they light = 5 ≤ 6;
  // the ending cranks the ember's own light instead of adding one. Everything else is emissive.
  G.boss = new FirstFrost(G, {auroraMats, roseMats, velvetM});
}

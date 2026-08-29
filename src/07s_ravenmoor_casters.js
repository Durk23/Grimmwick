// ============ RAVENMOOR CASTERS — District 2 projectile / ranged threats ============
// THE BOMBARDMENT archetype (CLAUDE.md): telegraphed, fixed repeating pattern, deterministic clocks
// from level start, generous safe lanes, SNES-Mario intensity (never bullet-hell). Extends the Enemy
// base in 07_enemies.js — same contract (isEnemy/hitR/headH/hitY/touchDamage/touchR, update(dt) calls
// touchPlayer + updateShadow, inherit takeHit/die). EMISSIVE-LIFTED bodies + bright glowing eyes so the
// threats READ against the dark catacombs (owner readability pass). Threats are colour-coded: the
// BulletBat glows DANGER-RED, the caster's magic glows VIOLET — the player learns the language.
//
// Determinism: gameplay runs off this.t (accumulated from a fixed opts.phase) and a fixed cast grid
// (nextCast += period) — NO Math.random on the critical path. rand() (seeded per area) drives cosmetic
// jitter only. A dive/lob always targets a SNAPSHOT, so a single sidestep beats it — never homing.

// ---- BulletBat: the Bullet Bill — a BIG menacing bat FIRED horizontally, flies dead-straight, stompable ----
// A pure projectile: constant speed along the lane at a fixed y (no gravity, no homing). Side/body contact
// hurts; JUMP OVER it and it passes underneath and keeps going; STOMP it (headH) to pop it in a salt-poof.
// Despawns silently once it flies past opts.despawnX (or way off-lane). Squeaks on spawn. dir -1 = leftward
// (fired from the finish-end toward the player); dir +1 fires rightward.
class BulletBat extends Enemy {
  constructor(G, x, y, z, opts={}){
    super(G, x, y, z);
    this.cull = false;                       // a fired bullet must traverse + despawn even if the player runs ahead
    this.t = opts.phase||0;                  // fixed phase → identical wobble/flap every attempt
    this.dir = opts.dir!==undefined ? opts.dir : -1;
    this.speed = opts.speed||7.2;            // constant horizontal speed
    this.flyY = y;                           // locked flight height
    this.despawnX = opts.despawnX!==undefined ? opts.despawnX : (this.dir<0 ? x-90 : x+90);
    this.candyDrop = opts.candy!==undefined ? opts.candy : 3;
    // big menacing hitbox — reads as a real incoming threat, bigger than the SwoopBat
    this.hitR=0.62; this.headH=0.88; this.hitY=0.4; this.touchR=0.72; this.touchDamage=1;
    // ---- rig: a BIG menacing bat, built FACING THE CAMERA (+z) so its angry face + spread wings read in
    //      the side-scroll profile view; a slight yaw toward travel gives it the 3/4 "incoming" menace ----
    const bodyM = emat(0x9a86c8, 0x6a4fb0, 0.6);          // lifted steel-violet body
    const bellyM= emat(0x5a4a86, 0x3a2d68, 0.45);
    const memM  = emat(0xbaa4e8, 0x8a6fd0, 0.6);          // lit wing membrane (reads against the dark sky)
    const strutM= emat(0x6a5a92, 0x453a68, 0.45);         // wing struts / claws
    const eyeM  = emat(0xff5230, 0xff2a10, 1);            // HOT red eyes = incoming danger
    const fangM = mat(0xf4f0e2);                          // bright bone fangs
    this.body = mesh('sph',[0.56,12,10], bodyM); this.body.scale.set(1.05,0.95,1.05);
    const belly = mesh('sph',[0.4,9,8], bellyM); belly.position.set(0,-0.08,0.34); belly.scale.set(0.9,0.85,0.7);
    // angry face on the +z front
    const browL = mesh('box',[0.3,0.1,0.1], strutM); browL.position.set(-0.19,0.28,0.44); browL.rotation.z=-0.42;
    const browR = browL.clone(); browR.position.x=0.19; browR.rotation.z=0.42;
    const eL = mesh('sph',[0.16,9,8], eyeM); eL.position.set(-0.2,0.12,0.46); eL.scale.set(1,0.92,1);
    const eR = eL.clone(); eR.position.x=0.2;
    const pL = mesh('sph',[0.06,6,6], mat(0x1a0e08)); pL.position.set(-0.2,0.1,0.61);   // menacing pupils
    const pR = pL.clone(); pR.position.x=0.2;
    const mouth = mesh('sph',[0.2,8,7], mat(0x260f18)); mouth.position.set(0,-0.15,0.48); mouth.scale.set(1,0.62,0.5);
    const fL = mesh('cone',[0.065,0.22,4], fangM); fL.position.set(-0.1,-0.14,0.62); fL.rotation.x=Math.PI;
    const fR = fL.clone(); fR.position.x=0.1;
    // big swept-back ears (up +y), glowing inner
    this.earL = mesh('cone',[0.16,0.52,5], bodyM); this.earL.position.set(-0.27,0.5,-0.02); this.earL.rotation.z=0.36; this.earL.rotation.x=-0.2;
    this.earR = this.earL.clone(); this.earR.position.x=0.27; this.earR.rotation.z=-0.36;
    const inL = mesh('cone',[0.08,0.32,4], emat(0xff5230,0xff2a10,0.7)); inL.position.set(0,0.02,0.04); this.earL.add(inL);
    const inR = inL.clone(); this.earR.add(inR);
    // BIG bat wings in the x-y plane (fully visible in the side view); pivoting groups flapping around z
    const mkWing=(s)=>{ const wg=new THREE.Group();
      const arm = mesh('box',[0.92,0.1,0.14], strutM); arm.position.x=s*0.5;
      const mem = mesh('box',[0.98,0.52,0.05], memM); mem.position.set(s*0.5,-0.16,0);
      for(let i=0;i<3;i++){ const sc=mesh('cone',[0.17,0.22,3], memM); sc.position.set(s*(0.14+i*0.33),-0.42,0); sc.rotation.x=Math.PI; wg.add(sc); }   // scalloped bat-wing edge
      const claw=mesh('cone',[0.07,0.22,4], fangM); claw.position.set(s*0.98,0.03,0); claw.rotation.z=-s*Math.PI/2;
      wg.add(arm, mem, claw); wg.position.set(s*0.18,0.16,0); return wg; };
    this.wingL = mkWing(-1); this.wingR = mkWing(1);
    // danger glow rimming the whole bat — two additive layers fake a soft gradient so it reads as a
    // menacing RED aura (a single flat disc tone-maps to muddy brown), telegraphing the incoming threat
    this.halo = new THREE.Mesh(geo('sph',0.7,12,10), new THREE.MeshBasicMaterial({color:0xff3418, transparent:true, opacity:0.42, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.halo.scale.set(1.25,1.12,0.85);
    this.halo2 = new THREE.Mesh(geo('sph',0.7,12,10), new THREE.MeshBasicMaterial({color:0xff5a34, transparent:true, opacity:0.14, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.halo2.scale.set(2.15,1.7,0.85);
    this.group.add(this.halo2, this.halo, this.body, belly, browL, browR, eL, eR, pL, pR, mouth, fL, fR, this.earL, this.earR, this.wingL, this.wingR);
    this.group.rotation.y = this.dir<0 ? -0.42 : 0.42;   // 3/4 view, nose yawed toward travel
    G.scene.add(this.group);
    // the squeak IS the on-spawn warning — only when the player is near (a bat spawned 200u offscreen shouldn't be heard)
    if(G.player && Math.abs(G.player.pos.x - x) < 34){
      AUDIO && AUDIO.noise && AUDIO.noise({t:0.14, vol:0.18, fFrom:2700, fTo:1200});
      AUDIO && AUDIO.tone  && AUDIO.tone({f:1500, f2:640, type:'sawtooth', t:0.16, vol:0.12});
    }
  }
  despawn(){ this.dead = true; this.G.scene.remove(this.shadow); }   // silent exit — no reward, unlike a stomp-kill
  die(){
    const p = this.group.position;
    this.G.fx.spawn(new THREE.Vector3(p.x,p.y,p.z), 0xf4f0e2, 16, {speed:4.5, life:0.5});   // salt poof
    super.die();   // standard poof + candyBurst + shadow removal + onEnemyKilled
  }
  update(dt){
    this.t += dt;
    const p = this.group.position;
    p.x += this.dir * this.speed * dt;
    p.y = this.flyY + Math.sin(this.t*6 + p.x*0.5)*0.12;          // slight menacing wobble
    // hard flapping + a little roll-wobble
    const flap = Math.sin(this.t*20)*1.0;
    this.wingL.rotation.z = 0.2 + flap; this.wingR.rotation.z = -0.2 - flap;
    this.body.rotation.z = Math.sin(this.t*6)*0.08;
    this.halo.material.opacity = 0.34 + Math.abs(Math.sin(this.t*10))*0.14;   // pulsing menace
    // silent despawn past the far edge (or wildly off-lane as a safety net)
    if((this.dir<0 && p.x < this.despawnX) || (this.dir>0 && p.x > this.despawnX) || Math.abs(p.x-this.home.x)>240){
      this.despawn(); return;
    }
    this.touchPlayer(dt);       // side/body contact hurts; jumping ABOVE flyY+headH passes harmlessly under
    this.updateShadow();        // the ground shadow lets the player track the incoming bullet
  }
}

// ---- WitchCannon: the caster SET-PIECE — a stationary spectral graveyard-hag who fires BulletBats ----
// Planted at a fixed x (the level's finish-end). On a FIXED clock (opts.period, default 10s) she rears
// back for a ~0.8s telegraph (staff-orb swells + brightens + a rising warning wail), then conjures a
// BulletBat that flies toward the level start (dir -1). She is a HAZARD-EMITTER: invulnerable by default
// (she cackles off hits — the player's job is to survive the bats and reach the gate). Pass opts.hp to make
// her defeatable (killing her stops the barrage). Deterministic: casts land on the level-time grid, so the
// pattern is learnable / speedrunnable (cull=false keeps her clock running regardless of distance).
class WitchCannon extends Enemy {
  constructor(G, x, y, z, opts={}){
    super(G, x, y, z);
    this.t = opts.phase||0;                  // FIXED clock from level start (base Enemy seeds this.t=rand(0,10) — override it)
    this.cull = false;                       // the barrage runs on the fixed level clock, not on player proximity
    this.dir = opts.dir!==undefined ? opts.dir : -1;   // fire toward the level start (leftward)
    this.period = opts.period||10;           // FIXED cast interval
    this.tele   = opts.tele||0.8;            // telegraph (rear-back) duration
    this.firstCast = opts.firstCast!==undefined ? opts.firstCast : 4.0;   // first cast time (level-start-relative)
    this.batSpeed = opts.batSpeed||7.2;
    this.despawnX = opts.despawnX!==undefined ? opts.despawnX : x - (opts.reach||90);
    this.invuln = opts.hp===undefined;       // set dressing unless a level makes her killable
    this.hp = opts.hp||1;
    this.candyDrop = opts.candy!==undefined ? opts.candy : 6;
    this.touchDamage = 0;                     // SHE is not a contact threat — the bats are
    this.noStomp = this.invuln;               // don't bounce off an unkillable hag
    this.nextCast = this.firstCast; this.casting = false; this.castCount = 0; this._fireT = 0;
    // ---- rig: a hunched tattered hag; upper body pivots so she can rear back on the telegraph ----
    const robeM = emat(0x3b3660, 0x201c44, 0.5);         // dark robe, lifted so she reads as a violet silhouette
    const hemM  = emat(0x2c2850, 0x18142e, 0.45);
    const skinM = mat(W2PAL.stoneL);                     // ashen grey hands/face
    const staffM= mat(0x4a3a2e);
    const eyeM  = emat(0x9dff5e, 0x7dff9e, 1);           // sickly-green witch eyes (distinct from the red bats)
    // lower robe (grounded) — a wide tattered cone
    const skirt = mesh('cone',[0.72,1.7,9], robeM); skirt.position.y=0.85;
    // tattered hem points
    for(let i=0;i<9;i++){ const a=i/9*TAU; const tp=mesh('cone',[0.12,rand(0.3,0.55),4], hemM); tp.position.set(Math.cos(a)*0.6, 0.16, Math.sin(a)*0.6); tp.rotation.x=Math.PI; g_addCrook(tp); this.group.add(tp); }
    // UPPER body group (pivot at the waist) — hood, head, arms, staff
    this.upper = new THREE.Group(); this.upper.position.y=1.45;
    const torso = mesh('cyl',[0.34,0.5,0.7,9], robeM); torso.position.y=0.1;
    const hood  = mesh('cone',[0.42,0.75,9], robeM); hood.position.y=0.72;
    const cowl  = mesh('sph',[0.34,10,8], hemM); cowl.position.set(0,0.5,0.16); cowl.scale.set(1,0.9,0.7);   // shadowed hood opening
    const face  = mesh('sph',[0.2,9,8], skinM); face.position.set(this.dir*0.06,0.46,0.24); face.scale.set(1,1.05,0.8);
    const nose  = mesh('cone',[0.06,0.26,5], skinM); nose.position.set(this.dir*0.06,0.42,0.42); nose.rotation.x=Math.PI/2*this.dir + Math.PI/2;
    const eL = mesh('sph',[0.06,6,6], eyeM); eL.position.set(this.dir*0.06-0.09,0.52,0.36);
    const eR = eL.clone(); eR.position.x=this.dir*0.06+0.09;
    this.eyeMeshes=[eL,eR];
    // staff on the fire side, angled outward toward where the bats will fly
    const shaft = mesh('cyl',[0.045,0.06,1.9,6], staffM); shaft.position.set(this.dir*0.5, 0.35, 0.05);
    shaft.rotation.z = -this.dir*0.22; g_addCrook(shaft);
    // gnarled bony hand gripping the staff
    const hand = mesh('sph',[0.11,7,6], skinM); hand.position.set(this.dir*0.42, 0.55, 0.08); hand.scale.set(1,0.8,1);
    // the CAST ORB at the staff head (the telegraph tell)
    this.orbY = 1.35;                                    // orb height above her base (staff head)
    this.orb = mesh('sph',[0.17,10,9], emat(0xffffff, W2PAL.crystalV, 1));
    this.orb.position.set(this.dir*0.62, 1.25, 0.08);
    this.orbHalo = new THREE.Mesh(geo('sph',0.34,10,9), new THREE.MeshBasicMaterial({color:W2PAL.crystalV, transparent:true, opacity:0.4, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.orbHalo.position.copy(this.orb.position);
    this.upper.add(torso, hood, cowl, face, nose, eL, eR, shaft, hand, this.orb, this.orbHalo);
    this.group.add(skirt, this.upper);
    G.scene.add(this.group);
    this.hitR=0.7; this.headH=2.6; this.hitY=1.4;
  }
  touchPlayer(){ /* the hag herself never bites — only her conjured bats do */ }
  takeHit(player, kind){
    if(this.dead) return;
    if(this.invuln){                          // unkillable set dressing — a stagger + an occasional cackle (never a spammy toast)
      this._stagger = 0.2;
      if(this.t - (this._lastCackle||-9) > 1.6){
        this._lastCackle = this.t;
        AUDIO && AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        if(window.UI) UI.toast('🧙 The hag cackles! She shrugs it right off!');
      }
      return;
    }
    this.hp -= (kind==='pound'?2:1);
    this._stagger = 0.2;
    if(this.hp<=0){ if(window.UI) UI.toast('🧙 The hag is banished! The barrage stops!'); this.die(); }
    else AUDIO && AUDIO.stomp && AUDIO.stomp();
  }
  fire(){
    const p = this.group.position;
    const pl = this.G.player;
    const near = pl && Math.abs(pl.pos.x - p.x) < 34;   // presentation gate — the clock still runs (determinism), but a witch 200u offscreen never shakes the screen or makes noise
    const sx = p.x + this.dir*0.62, sy = p.y + this.orbY;
    const bat = new BulletBat(this.G, sx, sy, 0, {dir:this.dir, speed:this.batSpeed, despawnX:this.despawnX, phase:this.castCount*0.7});
    this.G.ents.add(bat);
    this.castCount++;
    this._fireT = 0.18;                        // forward thrust follow-through
    if(near){
      this.G.fx.spawn(new THREE.Vector3(sx,sy,0), W2PAL.crystalV, 14, {speed:3.5, life:0.45});
      this.G.fx.spawn(new THREE.Vector3(sx,sy,0), 0xffffff, 6, {speed:2, life:0.3});
      AUDIO && AUDIO.tone && AUDIO.tone({f:220, f2:90, type:'sawtooth', t:0.3, vol:0.2});
      AUDIO && AUDIO.noise && AUDIO.noise({t:0.25, vol:0.15, fFrom:1400, fTo:300});
      this.G.camc && this.G.camc.shake && this.G.camc.shake(0.12, 0.2);
    }
  }
  update(dt){
    this.t += dt;
    const p = this.group.position;
    // ambient: idle sway + green-eye flicker
    const idleSway = Math.sin(this.t*1.6)*0.03;
    this.eyeMeshes.forEach(e=> e.material.emissiveIntensity = 0.85 + Math.sin(this.t*6)*0.15);
    // --- fixed cast schedule (deterministic level-time grid) ---
    // begin the telegraph tele-seconds before the scheduled cast
    if(!this.casting && this.t >= this.nextCast - this.tele){
      this.casting = true;
      AUDIO && AUDIO.tone && AUDIO.tone({f:380, f2:1150, type:'sine', t:this.tele, vol:0.16});   // rising warning wail
      AUDIO && AUDIO.tone && AUDIO.tone({f:190, f2:520, type:'triangle', t:this.tele, vol:0.1});
    }
    if(this.casting){
      const prog = clamp(1 - (this.nextCast - this.t)/this.tele, 0, 1);   // 0→1 across the telegraph
      this.upper.rotation.z = idleSway + this.dir*0.4*prog;               // REAR BACK, winding up
      const sw = 1 + prog*1.4;                                            // orb swells + brightens = the tell
      this.orb.scale.setScalar(sw); this.orbHalo.scale.setScalar(sw*1.1);
      this.orbHalo.material.opacity = 0.4 + prog*0.5;
      this.orb.material.emissiveIntensity = 1;
      if(this.t >= this.nextCast){
        this.fire();
        this.casting = false;
        this.nextCast += this.period;                                     // next cast stays on the fixed grid
      }
    } else {
      // relax back toward rest; the fire-thrust leans her briefly forward
      if(this._fireT>0){ this._fireT -= dt; this.upper.rotation.z = idleSway - this.dir*0.3*(this._fireT/0.18); }
      else this.upper.rotation.z = damp(this.upper.rotation.z, idleSway, 8, dt);
      this.orb.scale.setScalar(damp(this.orb.scale.x, 1, 8, dt));
      this.orbHalo.scale.setScalar(damp(this.orbHalo.scale.x, 1, 8, dt));
      this.orbHalo.material.opacity = damp(this.orbHalo.material.opacity, 0.4, 6, dt);
    }
    if(this._stagger>0){ this._stagger-=dt; this.upper.position.x = Math.sin(this.t*50)*0.03; }
    else this.upper.position.x = damp(this.upper.position.x, 0, 10, dt);
    this.updateShadow();
  }
}

// ---- AirborneCaster: a hovering ranged monster — a floating skull-witch that LOBS arcing spell-bolts ----
// Patrols a small air arc; when the player is within opts.aggroR AND still AHEAD of it (hasn't run past),
// it fires on a fixed clock (opts.period, default 3s) with a ~0.6s telegraph (a violet orb charges in
// front of it). Each cast lobs a SLOW arcing SpellBolt at a SNAPSHOT of the player's position — never
// homing, a single step beats it. KILLABLE via the normal contract (stomp/spin/pound/moon, hp 2). To stop
// the barrage the player RUNS PAST it (leaves its "ahead" arc) or KILLS it.
class AirborneCaster extends Enemy {
  constructor(G, x, y, z, opts={}){
    super(G, x, y, z);
    this.t = opts.phase||0;                  // fixed phase → identical patrol every attempt
    this.baseY = y;
    this.dir = opts.dir!==undefined ? opts.dir : -1;   // faces toward the level start (where the player comes from)
    this.aggroR = opts.aggroR||10;           // fires only within this horizontal range
    this.arcX = opts.arcX!==undefined ? opts.arcX : 1.4;   // patrol half-width
    this.arcY = opts.arcY!==undefined ? opts.arcY : 0.4;
    this.period = opts.period||3.0;          // FIXED cast interval (~2.5–3.5s band)
    this.tele   = opts.tele||0.6;            // charge telegraph
    this.firstCast = opts.firstCast!==undefined ? opts.firstCast : 1.6;
    this.boltColor = opts.boltColor||W2PAL.crystalV;
    this.boltFlight= opts.boltFlight||1.15;  // slow, dodgeable
    this.boltArc   = opts.boltArc||1.7;
    this.hp = opts.hp||2; this.candyDrop = opts.candy!==undefined ? opts.candy : 3;
    this.hitR=0.5; this.headH=1.0; this.hitY=0.55; this.touchR=0.62; this.touchDamage=1;
    this.nextCast = this.firstCast; this.charging=false; this._wasCharging=false; this._fireFlash=0;
    // ---- rig: a floating grave-wisp skull in a witch hat with a spectral tail ----
    const boneM = emat(0xe8e4d8, 0x8a86a0, 0.4);         // lifted bone reads in the murk
    const hatM  = emat(0x2a2440, 0x18142e, 0.4);
    const bandM = emat(0x4a3d72, 0x342d49, 0.5);
    const eyeM  = emat(W2PAL.crystalV, W2PAL.crystalV, 1);   // violet sockets (matches its bolts = the tell)
    this.skull = mesh('sph',[0.32,11,9], boneM); this.skull.position.y=0.6; this.skull.scale.set(1,1.05,0.95);
    const jaw = mesh('box',[0.26,0.12,0.2], boneM); jaw.position.set(0,0.4,0.06);
    const cheekL = mesh('sph',[0.09,6,6], boneM); cheekL.position.set(-0.22,0.62,0.06);
    const cheekR = cheekL.clone(); cheekR.position.x=0.22;
    const eL = mesh('sph',[0.1,8,7], eyeM); eL.position.set(-0.13,0.64,0.24); eL.scale.set(1,1.15,1);
    const eR = eL.clone(); eR.position.x=0.13;
    const socketHalo = new THREE.Mesh(geo('sph',0.5,10,9), new THREE.MeshBasicMaterial({color:W2PAL.crystalV, transparent:true, opacity:0.16, blending:THREE.AdditiveBlending, depthWrite:false}));
    socketHalo.position.y=0.62;
    // witch hat
    const brim = mesh('cyl',[0.5,0.5,0.05,12], hatM); brim.position.y=0.92;
    const band = mesh('cyl',[0.34,0.36,0.09,12], bandM); band.position.y=0.98;
    const cone = mesh('cone',[0.32,0.75,10], hatM); cone.position.y=1.35; cone.rotation.z=0.14; g_addCrook(cone);
    const tip  = mesh('sph',[0.06,6,6], hatM); tip.position.set(0.11,1.72,0);
    // spectral wisp tail (translucent, tapering down) — makes it read as a floating spirit
    this.tail=[];
    for(let i=0;i<3;i++){ const tc=new THREE.Mesh(geo('cone',0.26-i*0.07,0.4,8), new THREE.MeshBasicMaterial({color:W2PAL.crystalV, transparent:true, opacity:0.34-i*0.08, depthWrite:false})); tc.position.y=0.32-i*0.2; tc.rotation.x=Math.PI; this.tail.push(tc); }
    // the CHARGE ORB in front (hidden until the telegraph)
    this.orb = mesh('sph',[0.16,10,9], emat(0xffffff, this.boltColor, 1));
    this.orb.position.set(this.dir*0.5, 0.55, 0.28); this.orb.visible=false;
    this.orbHalo = new THREE.Mesh(geo('sph',0.32,10,9), new THREE.MeshBasicMaterial({color:this.boltColor, transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.orbHalo.position.copy(this.orb.position); this.orbHalo.visible=false;
    this.group.add(socketHalo, this.skull, jaw, cheekL, cheekR, eL, eR, brim, band, cone, tip, ...this.tail, this.orb, this.orbHalo);
    G.scene.add(this.group);
  }
  fire(pl){
    const p = this.group.position;
    const from = new THREE.Vector3(p.x + this.dir*0.5, p.y+0.05, 0);
    const to   = new THREE.Vector3(pl.pos.x, pl.pos.y+0.4, 0);    // SNAPSHOT — a sidestep beats it
    this.G.ents.add(new SpellBolt(this.G, from, to, {color:this.boltColor, flight:this.boltFlight, arc:this.boltArc}));
    this._fireFlash = 0.12;
    this.G.fx.spawn(from, this.boltColor, 10, {speed:2.6, life:0.35});
    AUDIO && AUDIO.tone && AUDIO.tone({f:640, f2:180, type:'sawtooth', t:0.22, vol:0.16});
    AUDIO && AUDIO.noise && AUDIO.noise({t:0.14, vol:0.1, fFrom:1600, fTo:300});
  }
  update(dt){
    this.t += dt; if(this._fireFlash>0) this._fireFlash-=dt;
    const p = this.group.position, pl = this.G.player;
    // patrol a small deterministic air arc
    p.x = this.home.x + Math.sin(this.t*0.9)*this.arcX;
    p.y = this.baseY + Math.sin(this.t*1.7)*this.arcY;
    this.group.rotation.y = this.dir<0 ? -0.4 : 0.4;   // slight 3/4 yaw toward the player so the skull face reads
    // spectral tail flicker
    this.tail.forEach((tc,i)=> tc.scale.y = 0.8 + Math.sin(this.t*10 + i)*0.3);
    // aggro: in range AND still ahead of it (player hasn't run past the ~1.2u threshold)
    const aggro = pl && !pl.dead && Math.abs(pl.pos.x - p.x) < this.aggroR && (pl.pos.x - p.x)*this.dir > -1.2;
    // --- fixed cast grid, gated by aggro ---
    this.charging = aggro && (this.nextCast - this.t) <= this.tele && (this.nextCast - this.t) > 0;
    if(this.charging && !this._wasCharging){   // warning wind-up the instant charging begins
      AUDIO && AUDIO.tone && AUDIO.tone({f:420, f2:1050, type:'sine', t:this.tele, vol:0.13});
    }
    this._wasCharging = this.charging;
    while(this.t >= this.nextCast){
      if(aggro) this.fire(pl);
      this.nextCast += this.period;            // grid stays fixed even when it skips a (non-aggro) cast
    }
    // orb visuals: charge = grow+glow; brief post-fire flash
    const showOrb = this.charging || this._fireFlash>0;
    this.orb.visible = this.orbHalo.visible = showOrb;
    if(this.charging){
      const prog = clamp(1 - (this.nextCast - this.t)/this.tele, 0, 1);
      const sw = 0.4 + prog*1.0;
      this.orb.scale.setScalar(sw); this.orbHalo.scale.setScalar(sw*1.15);
      this.orbHalo.material.opacity = 0.35 + prog*0.4;
    } else if(this._fireFlash>0){
      this.orb.scale.setScalar(1.4); this.orbHalo.scale.setScalar(1.6);
    }
    this.touchPlayer(dt);
    this.updateShadow();
  }
}

// ---- SpellBolt: the AirborneCaster's projectile — a slow glowing orb on a deterministic parabolic arc ----
// Lightweight ent (NOT stompable — it's a bolt, not a monster). Flies from → to over a fixed flight time
// with a sine-parabola hump; deals pl.damage(1, pos) on contact, then bursts. Bursts on landing too. cull
// off so its short flight always animates. Deterministic arc; the SNAPSHOT target means a step dodges it.
class SpellBolt {
  constructor(G, from, to, opts={}){
    this.G = G; this.dead = false; this.cull = false;
    this.t = 0; this.flight = opts.flight||1.15; this.arc = opts.arc||1.7;
    this.from = {x:from.x, y:from.y}; this.to = {x:to.x, y:to.y};
    this.color = opts.color||W2PAL.crystalV;
    this.group = new THREE.Group();
    this.core = mesh('sph',[0.2,10,9], emat(0xffffff, this.color, 1));
    this.halo = new THREE.Mesh(geo('sph',0.36,10,9), new THREE.MeshBasicMaterial({color:this.color, transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false}));
    this.group.add(this.core, this.halo);
    this.group.position.set(from.x, from.y, 0);   // EntityMgr.add() parents this.group into the scene
  }
  burst(){
    if(this.dead) return;
    this.dead = true;
    this.G.fx.spawn(this.group.position.clone(), this.color, 10, {speed:3, life:0.4});
    AUDIO && AUDIO.noise && AUDIO.noise({t:0.12, vol:0.1, fFrom:1100, fTo:200});
  }
  update(dt, G){
    this.t += dt;
    const u = Math.min(this.t/this.flight, 1);
    const p = this.group.position;
    p.x = lerp(this.from.x, this.to.x, u);
    p.y = lerp(this.from.y, this.to.y, u) + this.arc*Math.sin(u*Math.PI);   // parabolic hump
    p.z = 0;
    this.core.rotation.y = this.t*8;
    this.halo.scale.setScalar(1 + Math.sin(this.t*20)*0.15);
    // wispy trail
    if(Math.floor(this.t*24)!==Math.floor((this.t-dt)*24)) G.fx.spawn(p.clone(), this.color, 1, {speed:0.5, life:0.35, gravity:-0.5, size:0.6});
    // hit test (its own damage path — pl.damage handles i-frames/shield/knockback)
    const pl = G.player;
    if(pl && !pl.dead){
      const dx=pl.pos.x-p.x, dy=(pl.pos.y+0.6)-p.y, dz=pl.pos.z-p.z;
      if(dx*dx+dy*dy+dz*dz < 0.72*0.72){ pl.damage(1, new THREE.Vector3(p.x,p.y,p.z)); this.burst(); return; }
    }
    if(u>=1) this.burst();   // fizzle where it lands
  }
}

// tiny local alias for 00_utils' crook() (defined earlier in filename order) — a small spooky tilt.
function g_addCrook(o){ return crook(o, 0.05); }

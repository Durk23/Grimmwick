// ============ W3-L5 — BROOMHILDA'S HOLLOW (District 3 finale · the MASTERY PEAK · Broomhilda's doorstep) ============
// Witchwood's deepest wood — the hardest FAIR level of the district, and the pre-boss processional to
// Broomhilda's clearing. Sorts after 09u_w3kit.js (W3PAL / w3Parallax / w3Ambience / w3LevelFinish /
// the deco+climb+vessel builders + W3_LEVELS) and after every earlier level, so all the kit exists.
//
// SIGNATURE GIMMICK: THE BROOM-SWEEP GAUNTLET — riderless brooms CAST down the final corridor on a FIXED
// clock (the D3 analog of w2l5's Witch-Cannon bat corridor, but ground-sweeping brooms). Run through the
// full kishotenketsu arc, with the district's fullest roster woven as an escalating medley building to it:
//   INTRODUCE (Act 1, x -8..48): meet each Witchwood verb ALONE on safe flat ground — a lone BROOM ZOOMER
//     to LEAP, a friendly TOADSTOOL to bounce, a WIDOWMITE pair to stomp, a drop-SPIDER in plain sight.
//   TWIST (Act 2, x 48..98): THE WEB GALLERY — a WEBLING weaves a wall you break or climb past; a GIANT-WEB
//     high road (climb → boosted hop) crosses OVER a thorn hazard the low road platforms through; then the
//     MYSTERY CAULDRON gamble in a clear pocket. Routes cross in sight (the low-roader sees the high Heart).
//   ESCALATE (Act 3, x 98..152): THE POTION CLEARING — a broom + widowmites COMBINED; a TIMED potion
//     platform over a void; the skill-gated GOLDEN PUMPKIN up a tall giant-web climb; a last webling + spider.
//   MASTER (Act 4, x 152..216): arm up at the CAULDRON DIP, then THE BROOM PROCESSIONAL — the fixed-clock
//     broom gauntlet — then the GRAND DOORSTEP under the looming silhouette of BROOMHILDA on her broom.
//     The exitGate completes the level; the boss is its own area, reached from the map's node.
// Threats: the district's fullest roster, SPREAD (singles/pairs + set-pieces, breathing room) — 4 BroomZoomers
//   worth of gauntlet + patrols, 2 Weblings, 6 Widowmites, 3 Spiders, 1 Toadstool — all telegraphed, D3 band.
//   4 checkpoints (one right before the gauntlet). ONE GoldPumpkin (idx 2, skill-gated). ONE MysteryCauldron
//   (clear pocket). ONE CauldronDip (arm-up before the gauntlet). Deterministic; rand() only in baked deco.

// ---- in-file: THE BROOM RACK — the gauntlet's self-contained emitter (D3's BOMBARDMENT set-piece) ----
// A floating enchanted broom-rack planted at the corridor's finish end. On a FIXED clock it rears a warning
// glow (the telegraph), then LAUNCHES a BroomZoomer sweeping LEFT (dir -1) down the lane toward the player.
// despawnX caps each broom to the corridor so the barrage never floods the level. Deterministic from level
// start (the pattern is learnable / speedrunnable); presentation is gated to when the player is near so a
// rack 60u offscreen never shakes the screen. SNES-Mario tension (~1-2 brooms airborne), never bullet-hell.
function w3l5BroomRack(G, x, opts={}){
  const S = G.scene;
  const period    = opts.period!==undefined ? opts.period : 2.7;   // FIXED cast interval
  const tele      = opts.tele!==undefined ? opts.tele : 0.8;        // telegraph (glow wind-up)
  const firstCast = opts.firstCast!==undefined ? opts.firstCast : 2.6;
  const speed     = opts.speed || 7.0;
  const despawnX  = opts.despawnX!==undefined ? opts.despawnX : x-40;
  const rackY     = opts.rackY!==undefined ? opts.rackY : 4.4;
  // ---- visual rig: a hovering rack of hung brooms, a witch-hat crest, and a violet cast-orb (LIVE — animated) ----
  const rack = new THREE.Group();
  const woodM  = emat(0x5a4326, 0x2e1c0e, 0.3);
  const bindM  = emat(0xb37dff, 0x8a5fd0, 0.5);
  const strawM = emat(0xe0b84a, 0xb8902a, 0.5);
  const beam = mesh('box',[1.1,0.26,3.8], woodM); beam.position.set(x, rackY, -0.5); crook(beam,0.03); rack.add(beam);
  for(const pz of [-1.6,1.4]){ const post = mesh('cyl',[0.08,0.1,2.4,6], woodM); post.position.set(x, rackY+1.15, pz-0.5); crook(post,0.05); rack.add(post); }
  const crossbar = mesh('box',[0.9,0.18,3.2], woodM); crossbar.position.set(x, rackY+2.3, -0.5); rack.add(crossbar);
  // a witch-hat crest crowning the rack (Broomhilda's mark over her brooms)
  const crest = mesh('cone',[0.7,1.5,10], mat(0x140e22)); crest.position.set(x, rackY+3.1, -0.5); crest.rotation.z=0.16; crook(crest,0.03); rack.add(crest);
  // four hung brooms (deco silhouettes — one rattles on each telegraph)
  const brooms = [];
  for(let i=0;i<4;i++){
    const bz = -1.6 + i*0.95 - 0.5;
    const handle = mesh('cyl',[0.045,0.06,1.4,6], woodM); handle.position.set(x, rackY-0.4, bz); rack.add(handle);
    const bind = mesh('cyl',[0.1,0.1,0.16,8], bindM); bind.position.set(x, rackY-1.0, bz); rack.add(bind);
    const br = new THREE.Group();
    for(let k=0;k<7;k++){ const a=(k/6-0.5); const s=mesh('cyl',[0.02,0.05,0.55,4], strawM); s.position.set(a*0.32, -1.5, 0); s.rotation.z=a*0.5; br.add(s); }
    br.position.set(x, rackY, bz); rack.add(br); brooms.push(br);
  }
  // the enchanted cast-orb (own material — its glow is the tell)
  const orb = mesh('sph',[0.22,10,9], emat(0xffffff, W3PAL.potionV, 1).clone()); orb.position.set(x-0.95, rackY-0.3, 0.25);
  const orbHalo = new THREE.Mesh(geo('sph',0.44,10,9), new THREE.MeshBasicMaterial({color:W3PAL.potionV, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false}));
  orbHalo.position.copy(orb.position);
  rack.add(orb, orbHalo);
  S.add(rack);
  // ---- the emitter ent (no group → EntityMgr never culls it; the clock runs on level-time, deterministic) ----
  const em = { dead:false, cull:false, t:0, nextCast:firstCast, casting:false, castCount:0, brooms:[] };
  em.update = function(dt){
    this.t += dt;
    // cap each cast broom to the corridor — a silent despawn once it sweeps past the left edge (never a reward)
    for(const b of this.brooms){ if(!b.dead && b.group.position.x < despawnX){ b.dead = true; if(b.shadow) G.scene.remove(b.shadow); } }
    this.brooms = this.brooms.filter(b=>!b.dead);
    // telegraph begins tele seconds before the scheduled cast
    if(!this.casting && this.t >= this.nextCast - tele){
      this.casting = true;
      if(G.player && Math.abs(G.player.pos.x - x) < 40){
        AUDIO && AUDIO.tone && AUDIO.tone({f:520, f2:1160, type:'sawtooth', t:tele, vol:0.12});   // rising warning wail
        AUDIO && AUDIO.tone && AUDIO.tone({f:240, f2:520, type:'triangle', t:tele, vol:0.08});
      }
    }
    if(this.casting){
      const prog = clamp(1 - (this.nextCast - this.t)/tele, 0, 1);
      const sw = 1 + prog*1.6;
      orb.scale.setScalar(sw); orbHalo.scale.setScalar(sw*1.1);
      orbHalo.material.opacity = 0.35 + prog*0.5;
      const rb = brooms[this.castCount % brooms.length]; rb.rotation.z = Math.sin(this.t*40)*0.14*prog;   // the next broom rattles loose
      if(this.t >= this.nextCast){ this.fire(); this.casting = false; this.nextCast += period; }
    } else {
      orb.scale.setScalar(damp(orb.scale.x, 1, 8, dt));
      orbHalo.scale.setScalar(damp(orbHalo.scale.x, 1, 8, dt));
      orbHalo.material.opacity = damp(orbHalo.material.opacity, 0.3, 6, dt);
      orb.material.emissiveIntensity = 0.8 + Math.sin(this.t*3)*0.2;
      brooms.forEach((b,i)=> b.rotation.z = Math.sin(this.t*1.4 + i)*0.05);   // gentle idle sway
    }
  };
  em.fire = function(){
    const near = G.player && Math.abs(G.player.pos.x - x) < 40;
    // range 80 >> corridor length so the broom NEVER reverses inside the corridor — it despawns at despawnX first
    const b = new BroomZoomer(G, x-1.1, 0.3, 0, {phase:this.castCount*0.5, baseY:0.25, range:80, dir:-1, speed:speed, candy:2});
    b.cull = false;                          // deterministic flight regardless of distance (mirrors the fired-bat contract)
    G.ents.add(b); this.brooms.push(b); this.castCount++;
    if(near){
      G.fx.spawn(new THREE.Vector3(x-1.0, rackY-0.3, 0.15), W3PAL.potionV, 12, {speed:3.5, life:0.4});
      G.fx.spawn(new THREE.Vector3(x-1.0, rackY-0.3, 0.15), 0xe0b84a, 6, {speed:2.5, life:0.35});
      AUDIO && AUDIO.tone && AUDIO.tone({f:300, f2:110, type:'sawtooth', t:0.28, vol:0.16});
      AUDIO && AUDIO.noise && AUDIO.noise({t:0.22, vol:0.12, fFrom:1500, fTo:320});
      G.camc && G.camc.shake && G.camc.shake(0.1, 0.18);
    }
  };
  G.ents.add(em);
  return em;
}

// ---- in-file: BROOMHILDA LOOMS — the huge witch-on-a-broom silhouette felt on the horizon behind the gate ----
// The district's guardian, felt before she's fought (w1l5's King-loom / w2l5's Mossgrave-loom language, in
// Witchwood violet). Body baked (static); the glowing eyes + the broom-bristle SPARKLE (foreshadowing the
// boss's secret takedown — "a broom's pride is its bristles") self-animate via a registered ent.
function w3l5BroomhildaLoom(G, x){
  const S = G.scene, Z = -18;
  const loom = new THREE.Group();
  const cloakM = mat(0x1c1430), cloakD = mat(0x120c22), hatM = mat(0x0f0a1c), stickM = mat(0x2e1c10), strawM = mat(0x8a6a2a), skinM = mat(0x5a4a6a);
  // the broomstick she rides (long, horizontal) + straw tail fanning back toward the level
  const stick = mesh('cyl',[0.3,0.4,12,8], stickM); stick.rotation.z=Math.PI/2; stick.position.set(x, 9.6, Z); crook(stick,0.02); loom.add(stick);
  for(let i=0;i<11;i++){ const a=(i/10-0.5); const b=mesh('cone',[0.42,rand(2.2,3.4),5], strawM); b.position.set(x-6.6, 9.6+a*2.0, Z); b.rotation.z=Math.PI/2 + a*0.42; loom.add(b); }
  // hunched cloak over the stick, tattered hem, an outstretched claw-arm
  const cloak  = mesh('cone',[3.2,8.6,10], cloakM); cloak.position.set(x+1.4,12.7,Z); cloak.rotation.z=-0.5; crook(cloak,0.03);
  const cloak2 = mesh('cone',[2.3,6.4,9], cloakD); cloak2.position.set(x+2.4,11.6,Z); cloak2.rotation.z=-0.72;
  for(let i=0;i<7;i++){ const tp=mesh('cone',[0.5,rand(1.2,2.2),4], cloakD); tp.position.set(x+0.3+i*0.5,8.7,Z); tp.rotation.x=Math.PI; loom.add(tp); }
  const arm = mesh('cyl',[0.28,0.34,3.8,6], cloakM); arm.position.set(x+1.1,13.4,Z-0.2); arm.rotation.z=1.0; crook(arm,0.04);
  // head + pointed crooked witch hat
  const head = mesh('sph',[1.1,10,9], skinM); head.position.set(x+3.0,15.5,Z);
  const brim = mesh('cyl',[2.2,2.2,0.3,14], hatM); brim.position.set(x+3.0,16.4,Z);
  const cone = mesh('cone',[1.4,4.3,12], hatM); cone.position.set(x+3.2,18.8,Z); cone.rotation.z=-0.24; crook(cone,0.03);
  const tip  = mesh('sph',[0.3,7,6], hatM); tip.position.set(x+2.6,20.9,Z);
  loom.add(cloak, cloak2, arm, head, brim, cone, tip);
  S.add(bakeGroup(loom));
  // glowing eyes (own materials) + broom-bristle sparkle — animated by the ent (updateW3L5 stays pure)
  const eyeM = new THREE.MeshBasicMaterial({color:W3PAL.potionV, transparent:true, opacity:0.7});
  const eL = new THREE.Mesh(geo('sph',0.34,9,8), eyeM); eL.position.set(x+3.5,15.7,Z+0.75);
  const eR = new THREE.Mesh(geo('sph',0.34,9,8), eyeM.clone()); eR.position.set(x+2.6,15.6,Z+0.75);
  const sparks = [];
  for(let i=0;i<6;i++){ const sp=new THREE.Mesh(geo('sph',0.16,7,6), new THREE.MeshBasicMaterial({color:0xfff0b0, transparent:true, opacity:0.7})); sp.position.set(x-6.6+rand(-0.7,0.7), 9.6+rand(-2.0,2.0), Z+0.5); S.add(sp); sparks.push(sp); }
  S.add(eL, eR);
  G.ents.add({dead:false, cull:false, t:rand(0,6), update(dt){
    this.t += dt;
    const p = 0.42 + Math.sin(this.t*1.4)*0.26 + Math.max(0,Math.sin(this.t*0.5))*0.18;
    eL.material.opacity = p; eR.material.opacity = p;
    const s = 1 + Math.sin(this.t*2.0)*0.08; eL.scale.setScalar(s); eR.scale.setScalar(s);
    sparks.forEach((sp,i)=>{ const tw = Math.max(0, Math.sin(this.t*3 + i*1.3)); sp.material.opacity = tw*0.85; sp.scale.setScalar(0.5 + tw*0.9); });
  }});
}

// ---- in-file: THE QUIET PROP — Broomhilda's abandoned Traveler's Rest (deep-lore; NEVER signposted) ----
// Before Grimm's stolen ember twisted her, Broomhilda was the Hollow's kindly hedge-witch: she SWEPT the
// forest paths clear so lost travelers could always find their way home, and left a basket of free healing
// brews at a little rest stop — "TAKE WHAT YOU NEED." The curse turned her sweeping-to-help into her brooms
// sweeping travelers OFF the path. The rest sits abandoned now, dust on the bench, all but one brew gone
// dark — one still faintly glowing, proof of who she was. Story-readers connect it to the gauntlet outside.
function w3l5TravelersRest(G, x, z){
  const prop = new THREE.Group();
  const woodM = mat(W3PAL.hut), woodD = mat(W3PAL.hutD);
  // a worn bench
  const seat = mesh('box',[1.5,0.13,0.42], woodM); seat.position.set(0,0.5,0); crook(seat,0.04);
  for(const lx of [-0.58,0.58]){ const leg=mesh('box',[0.11,0.5,0.38], woodD); leg.position.set(lx,0.25,0); prop.add(leg); }
  // a leaning signboard (deco only — NOT a G.signs entry, so it's never a read-prompt)
  const spost = mesh('cyl',[0.06,0.08,1.35,5], woodD); spost.position.set(-1.0,0.67,-0.1); crook(spost,0.06);
  const board = mesh('box',[0.95,0.5,0.05], woodM); board.position.set(-1.0,1.3,-0.1); crook(board,0.05);
  // a little hand-broom leaned against the bench (the one she used to sweep the path CLEAR for others)
  const bh = mesh('cyl',[0.03,0.04,0.85,5], woodD); bh.position.set(0.82,0.56,-0.06); bh.rotation.z=0.5;
  const bb = mesh('cone',[0.12,0.32,6], mat(0xb8902a)); bb.position.set(0.66,0.16,-0.06); bb.rotation.z=0.5;
  // the basket of healing brews — mostly gone dark
  const basket = mesh('cyl',[0.33,0.27,0.32,10], mat(0x6a5233)); basket.position.set(0.5,0.16,0.18);
  prop.add(seat, spost, board, bh, bb, basket);
  const dimM = mat(0x24322a);
  for(let i=0;i<4;i++){ const a=i/4*TAU; const d=mesh('sph',[0.1,8,7], dimM); d.position.set(0.5+Math.cos(a)*0.15, 0.34, 0.18+Math.sin(a)*0.13); d.scale.set(1,1.3,1); prop.add(d); }
  // THE one brew still glowing (own materials — animated below)
  const lastP = new THREE.Mesh(geo('sph',0.12,9,8), new THREE.MeshBasicMaterial({color:W3PAL.potionP})); lastP.position.set(0.5,0.42,0.18); lastP.scale.set(1,1.4,1);
  const halo  = new THREE.Mesh(geo('sph',0.36,10,9), new THREE.MeshBasicMaterial({color:W3PAL.potion, transparent:true, opacity:0.2, depthWrite:false})); halo.position.copy(lastP.position);
  prop.add(lastP, halo);
  prop.position.set(x,0,z); prop.rotation.y = rand(-0.2,0.2);
  G.scene.add(prop);
  G.ents.add({dead:false, cull:false, t:rand(0,6), update(dt){
    this.t += dt;
    const b = 1 + Math.sin(this.t*2)*0.2; lastP.scale.set(b, b*1.4, b);
    halo.material.opacity = 0.14 + Math.sin(this.t*1.6)*0.08; halo.scale.setScalar(1 + Math.sin(this.t*1.6)*0.1);
  }});
}

function buildW3L5(G){
  const S = G.scene;
  levelBegin(G);
  const GRND = W3PAL.ground;

  // one enchanted-wood backdrop over the whole course (baked three-depth forest + witch-hut skyline + potion glow)
  w3Parallax(S, -14, 220);

  // ================= ACT 1 — THE CROOKED THRESHOLD (x -8..48) : INTRODUCE each verb =================
  groundX(G, -8, 48, GRND);
  signPost(G, 2, 1.9, -0.2, "BROOMHILDA'S HOLLOW — the deepest Witchwood, where the paths were once kept clean and safe. They are... not, anymore. Mind the brooms.");
  G.ents.add(new BonkLantern(G, 4, 1.3, 0, 'shield'));                 // opening mercy vessel
  G.ents.add(new Checkpoint(8, 0, 1.4, 0, {noLight:true}));            // lantern 1 (emissive only — save the light budget)
  candyLine(G, [[0,0.9,0],[4.5,0.9,0]], 3);
  // INTRODUCE the BROOM ZOOMER — one lone slow sweep on flat ground, a candy arc teaching the leap
  signPost(G, 11, 1.9, 0.2, "BROOM ZOOMERS: riderless brooms that sweep low along the ground. They do not turn to chase — just LEAP them as they pass.");
  G.ents.add(new BroomZoomer(G, 17, 0.3, 0, {phase:0, baseY:0.25, range:4, dir:-1, speed:5.0, candy:2}));   // patrol 13..21
  candyLine(G, [[13.5,1.0,0],[17,2.4,0],[20.5,1.0,0]], 5);            // arc over the sweep — jump to collect = jump to clear
  // INTRODUCE the TOADSTOOL bounce — a friendly springy mushroom up to a candy ledge + an early Heart
  signPost(G, 25, 1.9, -0.2, "TOADSTOOLS are soft and friendly — they never hurt you, they BOUNCE you. Hop on the cap to spring up high.");
  G.ents.add(new ToadstoolBouncer(G, 29, 0, 0, {}));
  platform(G, 33, 3.6, 0, 2.6, 3, W3PAL.canopyL);                     // bounce-reachable ledge (apex clears it comfortably)
  candyLine(G, [[29,1.6,0],[31,3.0,0],[33,3.9,0]], 4);               // the trail teaches the bounce
  G.ents.add(new Heart(33, 4.2, 0));                                  // early cushion for the mastery peak ahead
  // INTRODUCE the WIDOWMITE swarm — a telegraphed pair of easy stomps
  G.ents.add(new Widowmite(G,39, 0, 0, {phase:0, range:2, dir:1, speed:4.6, candy:2}));
  G.ents.add(new Widowmite(G,41.5, 0, 0, {phase:0.5, range:2, dir:-1, speed:4.6, candy:2}));
  candyLine(G, [[37,0.9,0],[43,0.9,0]], 4);
  // INTRODUCE the drop-SPIDER — hanging in plain sight
  G.ents.add(new Spider(G, 46, 4.0, 0, {groundY:0}));
  candyLine(G, [[45,0.9,0],[47,0.9,0]], 2);
  // Act-1 deco (baked): crooked braided trees, mushroom knots, hung webs, potion bottles, foreground silhouettes
  const decoA = new THREE.Group();
  decoA.add(braidedTree(6,-4.5,1.2), braidedTree(24,-5.4,1.4), braidedTree(44,-4.8,1.1));
  decoA.add(braidedTree(14,3.2,1.0), braidedTree(38,3.6,1.2));        // z>0 foreground framing
  for(let i=0;i<4;i++) decoA.add(mushroomCluster(rand(-6,47), rand(-2.9,-1.9), rand(0.7,1.1)));
  for(let i=0;i<3;i++) decoA.add(mushroomCluster(rand(-4,46), rand(2.4,3.1), rand(0.6,1.0)));
  decoA.add(hangingWeb(10,-3.4,1.0), hangingWeb(30,3.0,0.9));
  for(let i=0;i<3;i++) decoA.add(potionBottle(rand(-4,46), rand(-2.6,2.6)));
  S.add(bakeGroup(decoA));

  // ================= ACT 2 — THE WEB GALLERY (x 48..98) : TWIST — climb + weblings + the gamble =================
  groundX(G, 48, 98, GRND);
  G.ents.add(new Checkpoint(52, 0, 1.4, 1, {noLight:true}));          // lantern 2
  signPost(G, 50, 1.9, -0.2, "WEBLINGS spin walls across the path. Break one with a swing (or a stomp on the spider), or take the GIANT WEB up and over. The high road pays better.");
  candyLine(G, [[54,0.9,0],[57,0.9,0]], 3);
  // the Webling weaves a breakable wall across the low lane
  G.ents.add(new Webling(G, 58, 0, 0, {phase:0, period:5.5, firstWeb:2.6, webW:2.6, wallH:3.0, webLife:4, candy:4}));
  // --- HIGH ROAD: a giant climbable web → boosted hop onto ledges that sail OVER the thorn hazard (richer candy + a Heart) ---
  w3Web(G, 63, 0, 4.2, 0, 3);                                         // grab (press up), climb, boosted-hop off the top
  platform(G, 66.5, 4.5, 0, 3, 3, W3PAL.canopyL);
  platform(G, 70.5, 4.4, 0, 2.6, 3, W3PAL.canopyL);
  platform(G, 74.5, 4.2, 0, 2.6, 3, W3PAL.canopyL);                  // crowns the thorns below — the routes cross in sight
  candyLine(G, [[63,1.4,0],[63,2.8,0],[63,4.2,0]], 4);              // up the web (telegraphs the climb — owner rule)
  candyLine(G, [[65.5,4.9,0],[68.5,4.9,0],[70.5,4.8,0]], 4);
  candyLine(G, [[72.5,4.6,0],[74.5,4.6,0]], 2);
  G.ents.add(new Heart(70.5, 4.9, 0));                               // the high-road reward, in sight of the low-road thorns
  // --- LOW ROAD: a thorn hazard, honest single hop across on a low platform ---
  thornsX(G, 76, 4);                                                 // hazard x74..78
  platform(G, 76, 1.4, 0, 2.4, 3, W3PAL.canopyD);                   // the honest low hop (tap-clearance both sides)
  candyLine(G, [[72.5,1.0,0],[76,2.0,0],[79.5,1.0,0]], 4);
  // a widowmite pair + a drop-spider past the thorns
  G.ents.add(new Widowmite(G,82, 0, 0, {phase:0, range:2.5, dir:1, speed:4.8, candy:2}));
  G.ents.add(new Widowmite(G,84, 0, 0, {phase:0.4, range:2.5, dir:-1, speed:4.8, candy:2}));
  G.ents.add(new Spider(G, 87, 4.2, 0, {groundY:0}));
  // THE MYSTERY CAULDRON — D3 gamble container, in a CLEAR POCKET (no patrols within ~6u of x=95; ambush mites scatter ±2.6)
  const cauldron = new MysteryCauldron(95, 0, -1.5, -0.2);
  G.ents.add(cauldron); G.coffins.push(cauldron);
  G.world.addBox(95, 0, -1.5, 1.5, 1.05, 1.5, {});                  // stand-on plinth collider
  candyLine(G, [[90,0.9,0],[92.5,0.9,0]], 2);
  // Act-2 deco (baked): giant hung webs in the tree forks, braided trees, mushrooms, potion bottles
  const decoB = new THREE.Group();
  decoB.add(braidedTree(56,-5.0,1.3), braidedTree(80,-5.6,1.5), braidedTree(60,3.4,1.1), braidedTree(90,3.2,1.2));
  decoB.add(hangingWeb(56,-3.2,1.3), hangingWeb(70,3.0,1.1), hangingWeb(88,-3.3,1.2));
  for(let i=0;i<4;i++) decoB.add(mushroomCluster(rand(49,97), rand(-2.9,-1.9), rand(0.7,1.1)));
  for(let i=0;i<3;i++) decoB.add(mushroomCluster(rand(49,97), rand(2.4,3.1), rand(0.6,1.0)));
  for(let i=0;i<3;i++) decoB.add(potionBottle(rand(49,96), rand(-2.6,2.6)));
  S.add(bakeGroup(decoB));

  // ================= ACT 3 — THE POTION CLEARING (x 98..152) : ESCALATE — combos, timed platform, skill-gate =================
  groundX(G, 98, 114, GRND);
  groundX(G, 122, 152, GRND);                                        // the void 114..122 is the timed-platform crossing
  G.ents.add(new Checkpoint(102, 0, 1.4, 2, {noLight:true}));         // lantern 3
  signPost(G, 100, 1.9, 0.2, "THE POTION CLEARING. The paths braid and split here. Brooms AND mites at once now — leap the one, stomp the others. Then a hop across the brew on a floating pad.");
  // COMBINE: a faster broom sweep with two widowmites skittering beneath it
  G.ents.add(new BroomZoomer(G, 108, 0.3, 0, {phase:0, baseY:0.25, range:5, dir:1, speed:6.5, candy:2}));   // patrol 103..113
  G.ents.add(new Widowmite(G,105.5, 0, 0, {phase:0, range:2, dir:1, speed:5.0, candy:2}));
  G.ents.add(new Widowmite(G,111, 0, 0, {phase:0.6, range:2, dir:-1, speed:5.0, candy:2}));
  candyLine(G, [[104,1.0,0],[108,2.4,0],[112,1.0,0]], 5);           // the arc over the broom
  // --- TIMED POTION PLATFORM over the void (x 114..122): static lily-ledges each side, one mover on a fixed clock ---
  platform(G, 114.5, 1.3, 0, 2, 3, W3PAL.canopyD);                  // launch ledge at the left lip
  platform(G, 121.5, 1.3, 0, 2, 3, W3PAL.canopyD);                  // landing ledge at the right lip
  const potionPad = ()=>{
    const g = new THREE.Group();
    const pad  = mesh('box',[2.4,0.5,2.6], emat(0x244a3a, 0x152e24, 0.3)); pad.position.y=0.25;
    const rim  = mesh('cyl',[1.3,1.4,0.16,16], emat(W3PAL.brewV, W3PAL.brewV, 0.5)); rim.position.y=0.5;
    const brew = mesh('cyl',[1.1,1.1,0.06,16], emat(W3PAL.brew, W3PAL.brew, 0.9)); brew.position.y=0.53;
    g.add(pad, rim, brew); S.add(g); return g;
  };
  // fixed clock from level start (period 4.2s) — kisses both lips; the pad top rides at y1.6
  G.world.addMover(2.4, 0.5, 2.6, t=>new THREE.Vector3(lerp(116.4, 120.6, 0.5+0.5*Math.sin(t*TAU/4.2)), 1.1, 0), potionPad);
  candyLine(G, [[114.5,1.9,0],[118,2.0,0],[121.5,1.9,0]], 4);
  // --- SKILL-GATED GOLDEN PUMPKIN (idx 2): only a TALL giant-web climb + boosted hop reaches it (a ground double can't) ---
  w3Web(G, 128, 0, 5.4, 0, 3);                                       // the climb IS the gate
  platform(G, 130.5, 5.6, 0, 2.4, 3, W3PAL.canopyL);
  G.ents.add(new GoldPumpkin(131, 6.2, 0, 2));
  candyLine(G, [[128,1.5,0],[128,3.0,0],[128,4.5,0]], 3);          // up the web...
  candyLine(G, [[129.5,5.7,0],[131,6.3,0]], 2);                     // ...boosted hop to the prize
  // a last webling + a spider before the doorstep
  G.ents.add(new Webling(G, 140, 0, 0, {phase:0, period:5.0, firstWeb:2.2, webW:2.6, wallH:3.0, webLife:4, candy:4}));
  G.ents.add(new Spider(G, 145, 4.0, 0, {groundY:0}));
  candyLine(G, [[135,0.9,0],[138,0.9,0]], 2);
  candyLine(G, [[147,0.9,0],[150,0.9,0]], 2);
  signPost(G, 149, 1.9, -0.2, "Her clearing is just ahead — and so are her brooms. Arm up at the cauldron, then run the gauntlet. Do NOT stop moving.");
  // Act-3 deco (baked): a bubbling deco-cauldron cluster, braided trees, mushrooms, potion bottles (void 114..122 kept clear)
  const decoC = new THREE.Group();
  decoC.add(cauldronDeco(99,-2.6,1.0), cauldronDeco(136,-2.7,1.1), cauldronDeco(112,2.8,0.9));
  decoC.add(braidedTree(104,-5.2,1.3), braidedTree(126,-5.6,1.5), braidedTree(144,-5.0,1.2), braidedTree(150,3.2,1.1));
  decoC.add(hangingWeb(126,-3.3,1.3), hangingWeb(140,3.0,1.1));
  for(let i=0;i<3;i++) decoC.add(mushroomCluster(rand(98,113), rand(-2.9,3.0), rand(0.6,1.0)));
  for(let i=0;i<4;i++) decoC.add(mushroomCluster(rand(122,151), rand(-2.9,3.0), rand(0.6,1.0)));
  for(let i=0;i<4;i++) decoC.add(potionBottle(rand(122,151), rand(-2.6,2.6)));
  S.add(bakeGroup(decoC));

  // ================= ACT 4 — THE BROOM PROCESSIONAL + BROOMHILDA'S DOORSTEP (x 152..216) : MASTER =================
  groundX(G, 152, 216, GRND);                                        // one flat run — the gauntlet stays clean for a readable rhythm
  G.ents.add(new Checkpoint(154, 0, 1.4, 3, {noLight:true}));         // lantern 4 — the mercy right BEFORE the gauntlet
  G.ents.add(new CauldronDip(156.5, 0, 0, {light:true}));            // ARM UP — a random brew (shield/moon/wings/salt) for the run
  signPost(G, 158, 1.9, 0.2, "THE BROOM PROCESSIONAL. Her brooms sweep the whole approach on a fixed rhythm. Time your leaps, use the stumps to catch a breath. Reach her clearing.");
  // THE BROOM-SWEEP GAUNTLET: the rack at the finish end casts brooms LEFT down the corridor 159..194, on a fixed clock
  w3l5BroomRack(G, 194, {period:2.7, tele:0.8, firstCast:2.6, speed:7.0, despawnX:159, rackY:4.4});
  // two safe stumps to perch on above a sweep (a broom passes harmlessly under a y1.2 perch) — the "generous safe lanes"
  platform(G, 170, 1.2, 0, 2, 2.6, W3PAL.canopyD);
  platform(G, 184, 1.2, 0, 2, 2.6, W3PAL.canopyD);
  candyLine(G, [[169,1.8,0],[171,1.8,0]], 2); candyLine(G, [[183,1.8,0],[185,1.8,0]], 2);
  // candy at jump height traces the leap rhythm through the corridor (the dodge dance made legible)
  candyLine(G, [[162,0.9,0],[164,2.0,0],[166,0.9,0]], 5);
  candyLine(G, [[174,0.9,0],[176,2.0,0],[178,0.9,0]], 5);
  candyLine(G, [[188,0.9,0],[190,2.0,0],[192,0.9,0]], 5);
  G.ents.add(new Spider(G, 196, 4.2, 0, {groundY:0}));                  // a capstone drop right at the rack (east of the broom spawn — never overlaps a sweep)
  // --- THE GRAND DOORSTEP (x 196..216): her clearing, felt under the looming witch ---
  w3l5BroomhildaLoom(G, 206);                                        // Broomhilda on her broom, on the horizon
  w3l5TravelersRest(G, 201, -2.7);                                   // THE QUIET PROP (never signposted)
  G.ents.add(new Widowmite(G,203, 0, 0, {phase:0, range:2, dir:1, speed:4.6, candy:2}));   // one low pest so the doorstep isn't empty
  signPost(G, 205, 1.9, 0.2, "Broomhilda's clearing. She rides above it and will not come down. She will see you now — good luck.");
  // clearing deco (baked): witch-huts on stilts, hero-less deco cauldrons, thorn framing, mushrooms
  const decoD = new THREE.Group();
  decoD.add(witchHut(199,-6.0,1.1), witchHut(212,-6.6,1.2), witchHut(207,5.2,1.0));
  decoD.add(cauldronDeco(198,-2.7,1.1), cauldronDeco(210,-2.8,1.0), cauldronDeco(204,2.9,0.95));
  decoD.add(braidedTree(215,-5.2,1.5), braidedTree(200,3.4,1.2));
  decoD.add(hangingWeb(214,-3.2,1.4));
  for(let i=0;i<4;i++) decoD.add(mushroomCluster(rand(196,215), rand(-2.9,3.0), rand(0.7,1.2)));
  for(let i=0;i<3;i++) decoD.add(potionBottle(rand(196,214), rand(-2.6,2.6)));
  S.add(bakeGroup(decoD));
  // thorn silhouettes framing the very back of the clearing (deco-only bake — set off the lane)
  const thornFrame = new THREE.Group();
  for(let i=0;i<10;i++){ const th=mesh('cone',[0.18,rand(0.6,1.3),5], emat(0x7a3fbf,0x5b2fa0,0.5)); th.position.set(rand(196,216), 0.4, rand(3.2,4.2)); th.rotation.z=rand(-0.3,0.3); thornFrame.add(th); }
  S.add(bakeGroup(thornFrame));

  // exit gate at the clearing's threshold
  exitGate(G, 210);

  // ---- floating will-o'-wisps threading the wood (LIVE — kept translucent; bobbed by a tiny updater) ----
  const wisps = [];
  for(const [wx,wy,wz] of [[22,2.2,-2.6],[72,3.0,2.4],[118,2.6,-2.6],[176,2.4,2.6]]){
    const w = willOWisp(wx, wy, wz); S.add(w); wisps.push({m:w, y0:wy, ph:rand(0,TAU)});
  }
  G.ents.add({dead:false, cull:false, t:0, update(dt){ this.t+=dt; for(const w of wisps){ w.m.position.y = w.y0 + Math.sin(this.t*1.1 + w.ph)*0.4; w.m.children.forEach((c,i)=>{ if(c.material && c.material.opacity!==undefined && i<2) c.material.opacity = (i?0.55:0.4)*(0.7+Math.sin(this.t*2.5+w.ph)*0.3); }); } }});

  // reactive ambient critters — crows that flap off when approached (the detail players FEEL)
  G.ents.add(new Crow(20, 0.95, -2.7));
  G.ents.add(new Crow(88, 0.95, 2.7));
  G.ents.add(new Crow(150, 0.95, -2.6));

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 114, 122, 'wood');   // the timed potion-pad void in Act 3

  // ================= tail: ambience + bats + clutter (Witchwood spore-and-potion backdrop) =================
  w3LevelFinish(G, -14, 220, null);                                  // spores/motes/fireflies + bats; clutter placed manually below
  w3Clutter(G, -8, 48, 'forest');                                    // act 1
  w3Clutter(G, 48, 73, 'forest');                                    // act 2 up to the thorns
  w3Clutter(G, 79, 98, 'forest');                                    // act 2 past the thorns
  w3Clutter(G, 98, 113, 'forest');                                   // act 3 before the void
  w3Clutter(G, 122, 152, 'forest');                                  // act 3 after the void
  w3Clutter(G, 152, 208, 'forest');                                  // the gauntlet corridor + doorstep
  return {spawnX: 0, exitX: 210};
}

function updateW3L5(G, dt){ updateLevelCommon(G, dt); }
W3_LEVELS.push({id:'w3l5', district:'w3', name:"BROOMHILDA'S HOLLOW", build:buildW3L5, update:updateW3L5, parTime:165});

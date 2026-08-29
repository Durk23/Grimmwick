// ============ W2-L5 — THE LONG BARROW (District 2 finale · the COMEDY PEAK · Mossgrave's doorstep) ============
// Ravenmoor's deepest, richest catacomb — the climax of the district's descent, and its funniest level.
// SIGNATURE GIMMICK: THE COMEDY ROSTER + LOW-DOORWAY GAGS, run through the full kishotenketsu arc:
//   INTRODUCE (Act 1, x -8..50): meet the Coffin Hopper (learn its every-4th-hop TRIP = free stomp)
//     and the first "MIND YOUR HEAD" low-barrow crawl (Pip ducks; the tall thing behind him CLONKS).
//   TWIST (Act 2, x 50..113): THE LOST TOUR GROUP set-piece — six hand-holding skeletons shuffling
//     behind a bored guide. Harmless as a LINE, furious for ~4s if you poke one. A real risk/choice:
//     holster your bag and slip THROUGH for the ground candy, or take the crystal HIGH ROAD over the
//     crowd (more candy + a Heart) and never risk it. Then the RestlessUrn gamble in a clear pocket.
//   ESCALATE (Act 3, x 113..169): THE SUNKEN GALLERY — the ground OPENS and you DESCEND to y=-2.4,
//     the deepest floor in the game. Wisps hunt in the dark (relight a lantern to hold a safe pool);
//     a lower "MIND YOUR HEAD" crawl; the skill-gated Golden Pumpkin up a hanging chain; and, tucked
//     off the line in the one warm light down here, the quiet prop — Mossgrave's little gardener shrine.
//   MASTER (Act 4, x 169..216): the climb back up, a last comedy medley, a FINAL low doorway, then the
//     GRAND DOORSTEP — an ornate barrow arch under the looming, moss-runed bulk of MOSSGRAVE himself.
//     The exitGate completes the level; the boss is its own area, reached from the map's node.
// Threats: 9 discrete (5 Coffin Hoppers, 2 Gravemites, 2 Wisps) + the harmless Lost-Tour set-piece —
//   D2 band, all soft/comedic, spaced, every one telegraphed. 4 checkpoints. ONE GoldPumpkin (idx 2,
//   skill-gated). ONE RestlessUrn (clear pocket). Deterministic; rand() only in baked deco scatter.

// ---- in-file: the sunken barrow floor (a solid stone floor at `top`; a missed hop just drops, never kills) ----
function w2l5BarrowFloor(G, x1, x2, top){
  const w = Math.abs(x2-x1), cx = (x1+x2)/2;
  const slab = mesh('box',[w,1.4,6.4], mat(W2PAL.caveWallD)); slab.position.set(cx, top-0.7, 0);
  const lip  = mesh('box',[w,0.12,6.7], emat(W2PAL.caveWallL, W2PAL.caveWallL, 0.22)); lip.position.set(cx, top+0.02, 0);
  G.scene.add(slab, lip);
  G.world.addBox(cx, top-1.4, 0, w, 1.4, 6, {});
}

// ---- in-file: a "MIND YOUR HEAD" low-doorway crawl — a real stone ceiling (walk-through only) + THE GAG ----
// clearance 1.6 > Pip's 1.25 standing height, so he strolls under; but a jump bonks instantly — no room.
// On entry a one-shot trigger fires the Low-Doorway Gag: *CLONK* — whatever tall thing was chasing you
// did NOT duck. Pure comedy, deterministic, harmless (never touches the player).
function w2l5LowCrawl(G, x1, x2, floorTop, opts={}){
  const clear = opts.clear!==undefined?opts.clear:1.6;
  const w = Math.abs(x2-x1), cx = (x1+x2)/2, uy = floorTop+clear;
  const slab = mesh('box',[w,0.7,4], mat(W2PAL.caveWallD)); slab.position.set(cx, uy+0.35, 0);
  const warn = mesh('box',[w,0.1,4.1], emat(0xffb02e,0xffb02e,0.5)); warn.position.set(cx, uy-0.02, 0);   // bright "DUCK" underside stripe
  G.scene.add(slab, warn);
  // a few stalactite teeth hung off the sides (frames the tight passage; deco only, kept off Pip's centre)
  const teeth = new THREE.Group();
  let ti=0;
  for(let tx=x1+0.7; tx<x2; tx+=1.5, ti++){ const tz = ti%2 ? rand(1.0,1.7) : rand(-1.7,-1.0); teeth.add(stalactite(tx, uy-0.05, 0.32, tz)); }
  G.scene.add(bakeGroup(teeth));
  G.world.addBox(cx, uy, 0, w, 0.7, 4, {});
  let clonked=false;
  G.world.addBox(x1+0.7, floorTop, 0, 1.0, 1.5, 3, {type:'trigger', onTouch:()=>{
    if(clonked || G.state!=='play') return; clonked=true;
    AUDIO.poundHit && AUDIO.poundHit();
    G.fx.spawn(new THREE.Vector3(x1-0.5, uy+0.1, 0), 0xffe14d, 12, {speed:3, life:0.5});   // little "seeing stars"
    G.camc.shake(0.12,0.16);
    if(window.UI) UI.toast(opts.toast || '🪦 MIND YOUR HEAD! ...*CLONK* — the tall one behind you did not.');
  }});
}

// ---- in-file: THE QUIET PROP — Mossgrave's gardener shrine (deep-lore; NEVER signposted) ----
// Before the curse made him the Tombstone Titan, Mossgrave was the barrow's gentle groundskeeper who
// tended the moss and left flowers for the resting. Down here, in the one warm light, someone STILL
// keeps his little shrine: a worn stone, his tipped-over watering can, his trowel, a tuft of living
// glowing moss (the only green in the dead deep) — and one fresh white flower. Story-readers gasp.
function w2l5Memorial(G, x, z, floorTop){
  const prop = new THREE.Group();
  const stoneM = mat(W2PAL.stoneL);
  const slab = mesh('box',[0.66,0.9,0.18], stoneM); slab.position.y=0.45; crook(slab,0.05);
  const top  = mesh('cyl',[0.33,0.33,0.18,10], stoneM); top.rotation.x=Math.PI/2; top.position.y=0.9;
  const can   = mesh('cyl',[0.15,0.19,0.32,10], mat(0x6a5a3a)); can.rotation.z=Math.PI/2; can.position.set(-0.52,0.14,0.22);
  const spout = mesh('cyl',[0.028,0.055,0.32,6], mat(0x6a5a3a)); spout.position.set(-0.8,0.2,0.22); spout.rotation.z=0.7;
  const handle= mesh('tor',[0.11,0.03,4,8], mat(0x6a5a3a)); handle.position.set(-0.4,0.28,0.22); handle.rotation.y=Math.PI/2;
  const trowelH = mesh('box',[0.045,0.3,0.045], mat(0x8a7a5a)); trowelH.position.set(0.36,0.2,0.12); trowelH.rotation.z=0.42;
  const trowelB = mesh('cone',[0.07,0.16,4], mat(0x9a9ab0)); trowelB.position.set(0.28,0.03,0.12); trowelB.rotation.z=0.42;
  // living glowing moss (own materials — animated below)
  const moss1 = new THREE.Mesh(geo('sph',0.17,7,6), new THREE.MeshBasicMaterial({color:0x9dffb8})); moss1.position.set(0.12,0.1,0.16); moss1.scale.set(1.3,0.7,0.9);
  const moss2 = new THREE.Mesh(geo('sph',0.12,7,6), new THREE.MeshBasicMaterial({color:0x7dff9e})); moss2.position.set(-0.16,0.08,0.2); moss2.scale.set(1.2,0.6,0.8);
  const halo  = new THREE.Mesh(geo('sph',0.5,10,9), new THREE.MeshBasicMaterial({color:0x7dff9e, transparent:true, opacity:0.14, blending:THREE.AdditiveBlending, depthWrite:false})); halo.position.set(0,0.4,0.1);
  // one fresh white flower on a thin green stem (someone was JUST here)
  const stem   = mesh('cyl',[0.012,0.012,0.34,4], mat(0x5f8a3a)); stem.position.set(-0.02,0.27,0.24);
  const flower = new THREE.Mesh(geo('sph',0.07,7,6), new THREE.MeshBasicMaterial({color:0xf4f4f8})); flower.position.set(-0.02,0.45,0.24);
  const petal  = new THREE.Mesh(geo('tor',0.09,0.03,5,9), new THREE.MeshBasicMaterial({color:0xffe6f2})); petal.position.set(-0.02,0.45,0.24); petal.rotation.x=Math.PI/2;
  prop.add(slab,top,can,spout,handle,trowelH,trowelB,moss1,moss2,halo,stem,flower,petal);
  prop.position.set(x, floorTop, z); prop.rotation.y = rand(-0.15,0.15);
  G.scene.add(prop);
  // gentle life: the moss breathes, the flower sways. No `group` on the ent (keeps meshes parented to `prop`).
  G.ents.add({dead:false, cull:false, t:rand(0,6), update(dt){
    this.t+=dt;
    const b = 1+Math.sin(this.t*2.2)*0.14; moss1.scale.set(1.3*b,0.7*b,0.9*b); moss2.scale.set(1.2*b,0.6*b,0.8*b);
    halo.material.opacity = 0.1+Math.sin(this.t*1.7)*0.05;
    flower.position.x = -0.02+Math.sin(this.t*1.3)*0.02; petal.position.x = flower.position.x;
  }});
}

// ---- in-file: MOSSGRAVE LOOMS — the colossal cracked, moss-runed gravestone on the horizon behind the gate ----
// The District's guardian, felt before he's fought (w1l5's King-loom language, in Ravenmoor stone).
// Body baked (static); the glowing moss-rune eyes self-animate via a registered ent (so updateW2L5 stays pure).
function w2l5MossgraveLoom(G, x){
  const S = G.scene;
  const loom = new THREE.Group();
  const bodyM = mat(0x3c3a52), darkM = mat(0x201d33), mossM = mat(W2PAL.moss);
  const base  = mesh('box',[13,2.4,4], darkM); base.position.set(x,1.2,-17);
  const body  = mesh('box',[9,13,3.4], bodyM); body.position.set(x,8.4,-17); crook(body,0.012);
  const crown = mesh('cyl',[4.5,4.5,3.4,18], bodyM); crown.rotation.x=Math.PI/2; crown.position.set(x,14.9,-17);
  // fault cracks running down the face
  for(const [cx,cy,rot,len] of [[x-1.6,10.5,0.5,6.5],[x+2.1,7.5,-0.7,5.2],[x-0.5,4.2,0.28,4.4],[x+1.2,12,0.9,3.6]]){
    const cr = mesh('box',[0.26,len,0.35], darkM); cr.position.set(cx,cy,-15.3); cr.rotation.z=rot; loom.add(cr);
  }
  // creeping moss — the gentle gardener still under there, buried by the curse
  for(let i=0;i<12;i++){ const m=mesh('sph',[rand(0.5,1.2),6,5], mossM); m.position.set(x+rand(-4.2,4.2), rand(2.2,8), -15.35); m.scale.set(1.3,0.7,0.5); loom.add(m); }
  loom.add(base, body, crown);
  S.add(bakeGroup(loom));
  // glowing moss-rune EYES + brow (own materials; no real light — animated by the ent)
  const eL = new THREE.Mesh(geo('sph',0.9,10,9), new THREE.MeshBasicMaterial({color:0x8dffb0, transparent:true, opacity:0.6}));
  eL.position.set(x-2.2, 9.6, -14.7); eL.scale.set(1,1.3,0.6);
  const eR = eL.clone(); eR.material = eL.material.clone(); eR.position.x = x+2.2;
  const brow = new THREE.Mesh(geo('box',6,0.42,0.42), new THREE.MeshBasicMaterial({color:0x8dffb0, transparent:true, opacity:0.4}));
  brow.position.set(x,11.2,-14.7);
  S.add(eL, eR, brow);
  G.ents.add({dead:false, cull:false, t:rand(0,6), update(dt){
    this.t+=dt;
    const p = 0.42 + Math.sin(this.t*1.3)*0.2 + Math.max(0,Math.sin(this.t*0.45))*0.16;
    eL.material.opacity = p; eR.material.opacity = p; brow.material.opacity = 0.25+p*0.35;
    const s = 1+Math.sin(this.t*2.1)*0.07; eL.scale.set(s,s*1.3,0.6); eR.scale.set(s,s*1.3,0.6);
  }});
}

function buildW2L5(G){
  const S = G.scene;
  levelBegin(G);
  G.camMinY = -3.5;                 // the Sunken Gallery drops to y=-2.4 — let the camera follow down
  G.lightPools = [];                // D2 darkness mechanic (levelBegin already resets; explicit per the kit contract)
  const FLOOR = 0x322c4e;           // deep catacomb stone (groundX brightens the top lip)

  // one cave backdrop over the whole course (baked three-depth walls + stalactites + crystal glimmer)
  w2Parallax(S, -14, 220, 'cave');

  // ================= ACT 1 — THE BARROW MOUTH (x -8..50) : learn the tools =================
  groundX(G, -8, 50, FLOOR);
  signPost(G, 3, 1.8, -0.2, INPUT.isTouch ?
    'THE LONG BARROW — the deepest deep, where Grimmwick lays its guardians to rest. The locals are... characterful. Golden rule down here: MIND YOUR HEAD.' :
    'THE LONG BARROW — the deepest deep, where Grimmwick lays its guardians to rest. The locals are... characterful. Golden rule down here: MIND YOUR HEAD.');
  w2Lantern(G, 6, 0, -1.6, {r:5.5, light:true});          // the barrow-mouth hero pool (real light #1)
  G.ents.add(new Checkpoint(11, 0, 1.2, 0, {noLight:true}));   // lantern 1 (emissive only — save the light budget)
  candyLine(G, [[3,0.8,0],[8,0.8,0],[12,1.4,0]], 5);
  signPost(G, 14, 1.8, 0.25, 'COFFIN HOPPER: hops about on little bare feet, and every fourth hop it TRIPS flat on its face. THAT is your moment — hop on the lid while it is down.');
  G.ents.add(new CoffinHopper(G, 19, 0, 0, {range:3, dir:1}));   // the district's comedy star, taught safely
  candyLine(G, [[17,0.8,0],[22,1.4,0]], 4);
  G.ents.add(new Gravemite(G, 27, 0, 0, {range:2.5, dir:1}));    // knee-high pest — bright eyes read low
  candyLine(G, [[25,0.8,0],[30,0.8,0]], 4);
  // open the AIR lane for the whole finale — the district's diver, met first on flat ground (clean rep)
  G.ents.add(new DiveCrow(G, 31, 3.2, 0, {range:5, aggroR:5, period:4.2, phase:0}));
  candyLine(G, [[28,1.6,0],[31,1.9,0],[34,1.6,0]], 3);           // dodge-height arc under the dive
  // ACT-1 HIGH ROAD (the opening act's missing second route): a crystal-ledge hop chain over the low walk,
  // riding over Gravemite@27 + the diver@31 — a low-roader sees the Heart overhead ("next run I'm going up there").
  platform(G, 23, 1.0, 0, 2.0, 3, W2PAL.caveWallL);
  platform(G, 26.5, 1.8, 0, 2.2, 3, W2PAL.crystalV);
  platform(G, 30, 2.2, 0, 2.2, 3, W2PAL.caveWallL);
  platform(G, 33.5, 1.4, 0, 2.0, 3, W2PAL.caveWallL);
  candyLine(G, [[23,1.7,0],[26.5,2.6,0],[30,3.0,0],[33.5,2.2,0]], 6);
  G.ents.add(new Heart(30, 3.0, 0));                             // the high-road reward, in sight of the low road
  // ACT-1 low-doorway crawl (x 36..43): the recurring motif, introduced on flat safe ground
  signPost(G, 33, 1.8, -0.2, 'LOW BARROW AHEAD. Walk on through — NO JUMPING, there is no room. (The tall ones never read this sign.)');
  w2l5LowCrawl(G, 36, 43, 0, {toast:'🪦 MIND YOUR HEAD! ...*CLONK* — something tall behind you just met the ceiling.'});
  candyLine(G, [[37.2,0.9,0],[39.5,0.9,0],[41.8,0.9,0]], 4);      // head-height candy through the tunnel
  G.ents.add(new CoffinHopper(G, 46, 0, 0, {range:2.5, dir:-1})); // waits just past the crawl — it could not follow through
  // Act-1 deco (baked): background arches, mausolea, crystal light, bones
  const decoA = new THREE.Group();
  decoA.add(catacombArch(-4, -2.6, 1.1), catacombArch(24, -2.7, 1.0), catacombArch(48, -2.6, 1.15));
  decoA.add(mausoleum(2, -6.4, 0.8, true), mausoleum(30, -7.0, 0.9, false));
  for(let i=0;i<5;i++) decoA.add(crystalCluster(rand(-6,49), rand(-3.2,3.0), rand(0.7,1.2), pick([W2PAL.crystal,W2PAL.crystalV])));
  for(let i=0;i<4;i++) decoA.add(bonePile(rand(-4,48), rand(-2.8,2.8)));
  for(let i=0;i<5;i++) decoA.add(stalagmite(rand(-6,49), rand(0.7,1.2), rand(2.0,3.2)));   // foreground z>0 framing
  decoA.add(weepingStatue(21, -2.9));
  S.add(bakeGroup(decoA));

  // ================= ACT 2 — THE LOST TOUR GALLERY (x 50..113) : the set-piece + the urn =================
  groundX(G, 50, 113, FLOOR);
  G.ents.add(new Checkpoint(52, 0, 1.2, 1, {noLight:true}));   // lantern 2
  G.ents.add(new BonkLantern(G, 54, 1.3, 0, 'shield'));        // mercy vessel before the crowd
  G.ents.add(new Gravemite(G, 58, 0, 0, {range:2, dir:1, speed:4.0}));    // bag OUT here — then you must holster it (nudged +11%)
  signPost(G, 61, 1.8, -0.2, 'GUIDED TOUR IN PROGRESS. The guests are perfectly harmless — SO LONG AS you do not poke them. No candy-bag swinging, please. — Barrow Historical Society');

  // THE LOST TOUR GROUP — six hand-holding skeletons behind a bored guide (footprint ~x 62.7..79).
  // Harmless as a LINE; break it (hit any member) and all six chase furiously for ~4s, then reassemble.
  G.ents.add(new LostTourGroup(G, 74, 0, 0, {range:5, dir:1, speed:0.85}));
  candyLine(G, [[64,0.8,0],[68,0.8,0],[72,0.8,0],[76,0.8,0]], 8);   // ground candy — WALK it (no attack needed)
  // a diver patrols over the tour corridor: threading the harmless line now also means timing a crow dive,
  // and it gives the crystal high road (below) a real reason — the crowd-free line is the crow-shared one.
  // Home 72 keeps its base aggro (≤x81) ~6.7u WEST of urn@90's open-zone so it never dive-bombs the opener.
  G.ents.add(new DiveCrow(G, 72, 3.4, 0, {range:4, aggroR:5, period:4.0, phase:1.4}));
  candyLine(G, [[68,2.0,0],[72,2.4,0],[76,2.0,0]], 4);             // dodge-height arc over the tour

  // HIGH ROAD over the tour (crystal ledges): the safe alternative + more candy + a Heart. Routes cross
  // in sight — a low-roader threading the crowd SEES this line and the Heart overhead.
  platform(G, 60, 1.0, 0, 1.8, 3, W2PAL.caveWallL);           // easy step up onto the ledges
  platform(G, 63, 2.2, 0, 2.6, 3, W2PAL.caveWallL);
  platform(G, 67, 2.6, 0, 2.6, 3, W2PAL.caveWallL);
  platform(G, 71, 2.6, 0, 2.6, 3, W2PAL.caveWallL);
  platform(G, 75, 2.4, 0, 2.6, 3, W2PAL.caveWallL);
  platform(G, 79, 2.2, 0, 2.6, 3, W2PAL.caveWallL);
  candyLine(G, [[60,1.6,0],[63,2.9,0],[67,3.3,0]], 5);
  candyLine(G, [[71,3.3,0],[75,3.1,0],[79,2.9,0]], 5);
  G.ents.add(new Heart(71, 3.5, 0));                          // the high-road reward, floating above the crowd
  signPost(G, 83, 1.8, 0.25, 'Thank you for not disturbing the tour. The Society notes your excellent manners. — B.H.S.');

  // THE RESTLESS URN — D2 gamble container, in a CLEAR POCKET (no patrol routes within ~6u of x=90).
  const urn = new RestlessUrn(90, 0, -1.5, -0.2);
  G.ents.add(urn); G.coffins.push(urn);
  G.world.addBox(90, 0, -1.5, 1.5, 1.05, 1.5, {});           // stand-on plinth collider
  candyLine(G, [[95,0.8,0],[100,0.8,0],[105,0.8,0]], 6);
  G.ents.add(new CoffinHopper(G, 100, 0, 0, {range:2.5, dir:1}));   // patrol 97.5..102.5 — stays 7u+ off the urn
  // Act-2 deco (baked): the gallery of the dead
  const decoB = new THREE.Group();
  decoB.add(catacombArch(56, -2.6, 1.2), catacombArch(86, -2.7, 1.0), catacombArch(110, -2.6, 1.15));
  decoB.add(mausoleum(88, -6.8, 1.0, true), mausoleum(106, -7.2, 0.85, false));
  for(let i=0;i<6;i++) decoB.add(crystalCluster(rand(51,112), rand(-3.2,3.0), rand(0.7,1.3), pick([W2PAL.crystal,W2PAL.crystalV,W2PAL.crystalP])));
  for(let i=0;i<4;i++) decoB.add(bonePile(rand(52,111), rand(-2.8,2.8)));
  for(let i=0;i<5;i++) decoB.add(stalagmite(rand(51,112), rand(0.7,1.3), rand(2.0,3.2)));
  decoB.add(weepingStatue(97, -2.8), weepingStatue(108, 2.7));
  ironFence(decoB, 50, -3.4, 112, -3.4, 20);
  S.add(bakeGroup(decoB));

  // ================= ACT 3 — THE SUNKEN GALLERY (x 113..169, floor y=-2.4) : the descent climax =================
  G.ents.add(new Checkpoint(108, 0, 1.2, 2, {noLight:true}));  // lantern 3 — at the lip, right before the descent
  // SALT RE-ARM — bonk to get the Salt Shaker back before the deep (it's lost on a death; the 2-1 crypt is
  // the source). Arms you for the Sunken-Gallery wisps (x124, x148) AND the Witch Cannon's bats on the
  // doorstep (spin/salt pops them mid-air). Clear pocket: nearest patrol (CoffinHopper@100, edge 102.5) is >7u off.
  G.ents.add(new BonkLantern(G, 110, 1.4, 0, 'salt'));
  signPost(G, 111, 1.8, -0.2, 'THE BARROW GOES DEEPER. Down into the dark the guardian sleeps. Relight a lantern to hold the wisps at bay — and MIND YOUR HEAD.');
  // DESCENT steps down off the y=0 lip onto the -2.4 floor (drops of 0.6 — a gentle, telegraphed climb-down)
  platform(G, 113.5, -0.6, 0, 1.7, 4, W2PAL.caveWallL);
  platform(G, 114.7, -1.2, 0, 1.7, 4, 0x2c2742);
  platform(G, 115.9, -1.8, 0, 1.7, 4, 0x2a2540);
  w2l5BarrowFloor(G, 115, 169, -2.4);
  candyLine(G, [[113.5,-0.1,0],[114.7,-0.7,0],[115.9,-1.3,0],[117.5,-1.9,0]], 5);   // the trail leads DOWN

  // the darkness beat: a relightable lantern to make a safe pool, a wisp to repel, then a lower crawl
  w2DarkLantern(G, 120, -2.4, -1.4, {r:5, relightR:2.6});      // relight it → wisps shrink from the pool
  G.ents.add(new Wisp(G, 124, -1.4, 0, {range:8, speed:1.6})); // hunts in the dark; face it (or the pool) to repel it (nudged +14%)
  // (crawl 2 is telegraphed by the descent sign's "MIND YOUR HEAD", the bright DUCK stripe, and the entry gag —
  //  no signPost down here: signPost has no y-arg and would float at y=0 above the -2.4 gallery)
  w2l5LowCrawl(G, 126, 133, -2.4, {toast:'🪦 DUCK! ...*CLONK-clatter* — a wisp just face-planted the barrow ceiling. Serves it right.'});
  candyLine(G, [[127.2,-1.5,0],[129.5,-1.5,0],[131.8,-1.5,0]], 4);

  // the warm heart of the deep: a lit lantern over the quiet shrine, a second wisp beyond it
  w2Lantern(G, 144, -2.4, -1.9, {r:5.2, light:true});         // real light #2 — lights Mossgrave's shrine
  w2l5Memorial(G, 143, -1.1, -2.4);                            // THE QUIET PROP (never signposted)
  G.ents.add(new Heart(140, -1.5, 0));                         // the reward for taking the dark line
  G.ents.add(new Checkpoint(142, -2.4, 1.2, 3, {noLight:true}));   // CP3 (NEW) — lantern-lit beacon splitting the 70u gallery gap, right before the GP climb + ascent
  // the darkness gimmick finally BITES: move the wisp into the unlit x133..139 gap between crawl-2 and the
  // pool, so emerging from the crawl into the dark is a genuine hunt (it was dormant inside the pool at x148).
  G.ents.add(new Wisp(G, 136, -1.4, 0, {range:8, speed:1.6}));

  // SKILL-GATED GOLDEN PUMPKIN (idx 2): only reachable by CLIMBING the hanging chain and boosted-hopping
  // east onto the crystal ledge — a floor-level double-jump (apex ~-0.9) can never touch a y=2.5 ledge.
  w2Chain(G, 150, -2.4, 1.2, 0);                               // grab (press up), climb, then hop off
  platform(G, 152, 2.5, 0, 2.4, 3, W2PAL.crystalV);
  G.ents.add(new GoldPumpkin(152, 3.0, 0, 2));
  candyLine(G, [[150,-1.4,0],[150,0.1,0],[150,1.3,0],[152,2.9,0]], 5);   // candy telegraphs the climb (owner rule)

  G.ents.add(new CoffinHopper(G, 157, -2.4, 0, {range:2.5, dir:1}));     // comedy on the deepest floor
  candyLine(G, [[154,-1.9,0],[159,-1.9,0],[164,-1.9,0]], 6);
  // ASCENT steps back up to the surface (rises of 0.6 — a gentle, playful climb-out)
  platform(G, 165.5, -1.8, 0, 1.7, 4, 0x2a2540);
  platform(G, 166.7, -1.2, 0, 1.7, 4, 0x2c2742);
  platform(G, 167.9, -0.6, 0, 1.7, 4, W2PAL.caveWallL);
  candyLine(G, [[165.5,-1.3,0],[166.7,-0.7,0],[167.9,-0.1,0]], 4);
  // a purely-decorative glowing stream along the back of the gallery floor (the catacomb's underground river)
  undergroundRiver(G, 118, 166, {z:-2.9, y:-2.3, d:1.4, speed:1.6});
  // Sunken-gallery deco AT DEPTH (own baked pass at y=-2.4 — never floats over the y=0 lanes)
  const decoG = new THREE.Group();
  for(const [ax,az,as] of [[116,-2.6,1.2],[168,-2.6,1.2]]){ const a=catacombArch(ax,az,as); a.position.y=-2.4; decoG.add(a); }   // frame the descent + ascent
  for(let bx=117; bx<168; bx+=3.6){ const blk=mesh('box',[3.3,rand(4.4,5.2),0.8], mat(pick([0x201d33,0x25203c,0x1a1730]))); blk.position.set(bx+rand(-0.2,0.2), -2.6, -3.4); crook(blk,0.02); decoG.add(blk); }   // enclosing back wall
  for(let i=0;i<7;i++){ const c=crystalCluster(rand(118,167), rand(-2.6,2.6), rand(0.7,1.4), pick([W2PAL.crystal,W2PAL.crystalV,W2PAL.crystalP])); c.position.y=-2.4; decoG.add(c); }
  for(let i=0;i<5;i++){ const b=bonePile(rand(118,167), rand(-2.4,2.4)); b.position.y=-2.4; decoG.add(b); }
  for(let i=0;i<6;i++){ const s=stalagmite(rand(118,167), rand(0.7,1.4), rand(2.0,2.8)); s.position.y=-2.4; decoG.add(s); }
  S.add(bakeGroup(decoG));
  // gallery floor litter at depth (separate baked pass — never over the surface)
  const litG = new THREE.Group();
  for(let i=0;i<18;i++){ const lx=rand(117,167), lz=rand(-2.4,2.4), r=rand();
    if(r<0.4){ const bone=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(lx,-2.35,lz); litG.add(bone); }
    else if(r<0.7){ const rock=mesh('sph',[rand(0.1,0.2),6,5], mat(W2PAL.caveWallL)); rock.position.set(lx,-2.32,lz); rock.scale.y=0.6; litG.add(rock); }
    else { const cc=pick([W2PAL.crystal,W2PAL.crystalV]); const cry=mesh('cone',[0.05,rand(0.18,0.4),5], emat(cc,cc,0.9)); cry.position.set(lx,-2.28,lz); cry.rotation.z=rand(-0.4,0.4); litG.add(cry); }
  }
  S.add(bakeGroup(litG));

  // ================= ACT 4 — MOSSGRAVE'S DOORSTEP (x 169..216) : the grand barrow entrance =================
  groundX(G, 169, 216, FLOOR);
  G.ents.add(new Checkpoint(178, 0, 1.2, 4, {noLight:true}));  // lantern 5 (idx bumped 3→4 for the new gallery CP) — a fair walk-back before the tomb
  signPost(G, 172, 1.8, -0.2, 'You climbed back into the light — and now you walk straight toward a tomb. The Society salutes your spirit. — B.H.S. (increasingly worried)');
  G.ents.add(new Gravemite(G, 174, 0, 0, {range:2, dir:1, speed:3.8}));   // one low pest so the doorstep walk-in isn't empty; sits LEFT of CP4 (x178), 3.5u clear of the CoffinHopper's patrol (179.5..184.5)
  G.ents.add(new CoffinHopper(G, 182, 0, 0, {range:2.5, dir:1}));   // the doorstep medley
  // the finale's air lane pays off: a diver over the doorstep medley = a ground+air master beat feeding
  // straight into the bombardment (telegraphed caw→dive, so a CP4 respawn is never a cheap hit).
  G.ents.add(new DiveCrow(G, 176, 3.2, 0, {range:5, aggroR:6, period:3.8, phase:0.7}));
  candyLine(G, [[174,0.8,0],[179,0.8,0]], 5);
  candyLine(G, [[173,1.7,0],[176,2.0,0],[179,1.7,0]], 3);   // dodge-height arc under the doorstep diver
  G.ents.add(new BonkLantern(G, 184, 1.3, 0, 'shield'));       // last mercy before the guardian's rest
  // the FINAL low doorway — one last duck before the tomb opens
  signPost(G, 186, 1.8, 0.2, 'THE LAST LOW DOORWAY. Beyond it: the guardian rests. Mind your head once more, brave thing.');
  w2l5LowCrawl(G, 189, 195, 0, {toast:'🪦 DUCK — one last time. ...*CLONK.* Whatever that was, it will not be joining you inside.'});
  candyLine(G, [[190.2,0.9,0],[192.5,0.9,0],[194.2,0.9,0]], 4);
  candyLine(G, [[197,0.8,0],[202,0.8,0],[207,0.9,0]], 6);
  signPost(G, 200, 1.8, 0.25, 'BEYOND LIES MOSSGRAVE, the Tombstone Titan. He does NOT do guided tours. Turn back... or do not. — B.H.S.');

  // THE GRAND DOORSTEP DECO — an ornate barrow arch under the looming guardian
  w2l5MossgraveLoom(G, 210);                                   // Mossgrave himself, felt on the horizon
  const court = new THREE.Group();
  // the big ceremonial barrow arch framing the gate (scaled catacombArch + capstone that occludes the gate crest)
  { const a = catacombArch(213, -1.1, 1.9); court.add(a);
    const cap = mesh('box',[7.6,1.1,1.4], mat(W2PAL.stoneD)); cap.position.set(213,6.4,-1.1); crook(cap,0.02); court.add(cap);
    const capTrim = mesh('box',[7.8,0.22,1.5], emat(W2PAL.moss,W2PAL.moss,0.4)); capTrim.position.set(213,7.0,-1.1); court.add(capTrim); }
  // mourner statues turned toward the tomb, funeral banners, bone piles, mausolea
  court.add(weepingStatue(204, -2.6), weepingStatue(208, 2.6), weepingStatue(214, 2.7));
  court.add(mausoleum(198, -6.8, 1.0, true), mausoleum(212, -7.4, 0.9, true));
  for(let i=0;i<5;i++) court.add(bonePile(rand(196,214), rand(-2.9,2.9)));
  for(let i=0;i<4;i++) court.add(crystalCluster(rand(196,215), rand(-3.0,3.0), rand(0.8,1.3), pick([W2PAL.crystalP,W2PAL.crystal])));
  for(const bx of [197, 202, 207]){
    const bp = mesh('cyl',[0.06,0.08,3.2,5], mat(W2PAL.iron)); bp.position.set(bx,1.6,-2.7);
    const cloth = mesh('box',[0.9,1.8,0.07], mat(0x2c3a52)); cloth.position.set(bx,2.5,-2.5); crook(cloth,0.03);
    const band = mesh('box',[0.9,0.2,0.09], emat(W2PAL.moss,W2PAL.moss,0.4)); band.position.set(bx,3.3,-2.5);
    court.add(bp, cloth, band);
  }
  ironFence(court, 169, -3.4, 195, -3.4, 9);
  S.add(bakeGroup(court));
  // emissive torch-lanterns lining the final approach (fakes — no real lights; but they DO pool light for the wisps' rule)
  w2Lantern(G, 196, 0, -1.9, {r:4.5, light:false});
  w2Lantern(G, 205, 0, 1.9, {r:4.5, light:false});
  signPost(G, 207, 1.8, -0.2, 'You came all this way. Of course you are not turning back. Deep breath, then. — R. Gravely');

  // ===== THE WITCH CANNON — the pre-boss BULLET-BAT gauntlet (D2's BOMBARDMENT, on Mossgrave's doorstep) =====
  // A spectral graveyard-hag half-risen from the tomb threshold, planted just inside the exit, casts big
  // menacing BulletBats LEFT (dir -1) down the final approach on a FIXED clock — deterministic from level
  // start, so the pattern is learnable and speedrunnable. She sits at y=-0.5 so the bats fly at ~0.85 (chest
  // height): a standing Pip IS hit and must act, but a tap-jump clears them (apex ~1.8 > ~1.7 pass-over), and
  // a spin / thrown SALT / stomp pops them — several fair counters (the salt re-armed at x110 flings them out
  // of the air). despawnX 196.5 caps the barrage to the flat 196.5..210 corridor (past the last low crawl), so
  // it never floods the level and never reaches the safe crawl/entry (195). period 2.5s → ~1 bat airborne at a
  // time, ~2-3 met across the crossing — SNES-Mario tension, never bullet-hell. She is INVULNERABLE set-dressing
  // (no hp / no collider): the job is to survive the tense walk to the guardian, not to fight her.
  { const nback = mesh('box',[3.4,3.8,0.5], mat(0x140f22)); nback.position.set(210, 1.4, -1.6); S.add(nback); }   // the tomb's dark mouth behind her (dresses the half-risen base)
  // GROUND PRESSURE so the player can't camp under the bat pattern — THE BOMBARDMENT wants ground AND sky
  // dodged over and over (owner's archetype). Two coffin-hoppers trip the corridor; the cannon tightens to
  // ~2 bats overlapping (denser but fair — salt@110 + shield@184 are the counters).
  G.ents.add(new CoffinHopper(G, 199, 0, 0, {range:2, dir:1}));
  G.ents.add(new CoffinHopper(G, 206, 0, 0, {range:2, dir:-1}));
  G.ents.add(new WitchCannon(G, 210, -0.5, 0, {period:2.2, tele:0.8, firstCast:2.5, batSpeed:6.6, despawnX:196.5, dir:-1}));
  candyLine(G, [[198,1.6,0],[201,1.7,0],[204,1.6,0],[208,1.6,0]], 4);   // jump-height candy traces the moving dodge rhythm through both lanes

  exitGate(G, 213);

  // ================= tail: ambience + bats + clutter =================
  w2LevelFinish(G, -14, 220, 'cave', null);        // cave motes/fireflies + bats; clutter placed manually below
  // surface clutter only over the y=0 strips (the sunken gallery 113..169 gets its own depth litter above)
  w2Clutter(G, -8, 35, 'catacomb');                // act 1 up to the crawl
  w2Clutter(G, 43, 50, 'catacomb');                // act 1 past the crawl
  w2Clutter(G, 50, 112, 'catacomb');               // act 2 gallery
  w2Clutter(G, 169, 188, 'catacomb');              // doorstep approach up to the last crawl
  w2Clutter(G, 195, 214, 'catacomb');              // the courtyard
  return {spawnX: 0, exitX: 213};
}

function updateW2L5(G, dt){ updateLevelCommon(G, dt); }
W2_LEVELS.push({id:'w2l5', district:'w2', name:'THE LONG BARROW', build:buildW2L5, update:updateW2L5, parTime:160});

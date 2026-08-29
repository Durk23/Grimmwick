// ============ LEVEL 1-4 — THE WITCH'S GARDEN (x -8..187, ~4 min) ============
// Signature gimmick (Acts 1-2): GHOST MOVERS over the dark, run through the full kishotenketsu arc:
//   introduce (two bobbing platforms over Gap 1 — plus its unmarked secret), twist (a pair
//   on OPPOSITE clocks that trade places around a stone shelf), escalate (a mover that sinks
//   past a briar while you ride), master (one long diagonal ride DOWN into the clearing).
// SECOND gimmick (Act 3 — THE CAULDRON CLEARING, x104..167): Broomhilda's cauldrons are hexed
//   BOUNCE PADS. Bounce-chain across a potion-bog void — introduce (one bounce), twist (a chain
//   over a timed brew GEYSER), escalate (a chain past a sweeping BROOM). A vine-climb candy DETOUR
//   at the junction loops back (all-candy stays single-run winnable) and hands out Bat Wings.
// Every mover/hazard clock runs from level start — deterministic, learnable, speedrunnable.
// (Act 1 sits +8 right of the strict -146 rebase so an entry runway fits before the gap.)
function buildW1L4(G){
  const S = G.scene;
  levelBegin(G);

  // ---- entry runway: solid ground under the spawn, lantern lit BEFORE the gap ----
  groundX(G, -8, 2, 0x3e5347);
  const decoR = new THREE.Group();
  fenceRun(decoR, -8, -3.4, 1, -3.4, 4);
  for(let i=0;i<2;i++) decoR.add(deadTree(rand(-7,-1), rand(-8,-4.2), rand(0.9,1.4)));
  for(let i=0;i<2;i++) decoR.add(pumpkinDeco(rand(-7,0), rand(-3,-1.9), rand(0.5,0.8), i===0));
  decoR.add(grave(rand(-5,0), rand(2.6,3.2)));
  S.add(bakeGroup(decoR));
  signPost(G, -2.2, 1.8, -0.25, 'Ghost platforms drift over the dark - they rise and sink on the night wind. Jump as they lift!');
  G.ents.add(new Checkpoint(0.6, 0, 1.3, 0));
  candyLine(G, [[1.2,1.2,0],[4,2.6,0]], 3);

  // ---- GAP 1: moving ghost platforms (x 2..14) — INTRODUCE, exactly as shipped: do not alter ----
  const gpm = ()=>{ const m = new THREE.Mesh(geo('box',2.8,0.45,3), new THREE.MeshLambertMaterial({color:0xbfb8ff, transparent:true, opacity:0.75})); S.add(m); return m; };
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(5.5, 1.4+Math.sin(t*1.1)*1.2, 0), gpm);
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(10.5, 2.2+Math.sin(t*1.1+2.6)*1.2, 0), gpm);
  candyLine(G, [[5.5,3.4,0],[10.5,4.2,0]], 4);
  // THE LEAP OF FAITH (one of exactly two in the whole game): jump DOWN into the
  // second half of this gap - it looks like certain death, nothing marks it - and
  // an unseen current catches you: instant level completion with ALL rewards.
  G.world.addBox(8, -8.5, 0, 2.2, 2.5, 10, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._leaped) return;
    G._leaped = true;
    AUDIO.portal(); AUDIO.victory();
    G.addCandy(50);
    G.runPumpkins[2] = true;   // the leap awards THIS level's pumpkin — never the other levels' hunts
    G.completeLevel({leap:true});
  }});

  // ================= ACT 1 — the Witch's Garden (x 14..50) =================
  groundX(G, 14, 50, 0x3e5347);
  const decoD = new THREE.Group();
  fenceRun(decoD, 14, -3.4, 48, -3.4, 14);
  for(let i=0;i<8;i++) decoD.add(deadTree(rand(15,46), rand(-8,-4.2), rand(0.9,1.5)));
  for(let i=0;i<4;i++) decoD.add(grave(rand(16,45), rand(2.6,3.3)));
  S.add(bakeGroup(decoD));
  G.ents.add(new BonkLantern(G, 16, 1.4, 0, 'shield'));  // armor up before the thorns
  thornsX(G, 20, 6);
  platform(G, 20, 1.15, 0, 2.6, 3, 0x5a4066);
  thornsX(G, 30, 6);
  platform(G, 30, 1.2, 0, 2.6, 3, 0x5a4066);
  candyLine(G, [[17,1,0],[20,2.4,0],[23,1,0]], 5);
  candyLine(G, [[27,1,0],[30,2.5,0],[33,1,0]], 5);
  // enemy lane (owner: chaos = motion, not crowding — singles, spaced, one threat per beat):
  G.ents.add(new Skelly(G, 18, 0, 0, {px:2}));            // thorn-bed 1 patroller
  G.ents.add(new Hopper(G, 24, 0, 0, {aggroR:4}));        // between the briars — you meet threats one at a time
  G.ents.add(new Boo(G, 42, 0, 0, {speed:2.4, range:6})); // crypt lurker — range trimmed so the coffin pocket stays calm
  G.ents.add(new Heart(30, 2.3, 0));
  // CLEAR-PATCH LAW: the coffin sits in a deliberate calm pocket (x 29..41 — no patrol
  // routes, no aggro circles reach it). Opening the gamble is a chosen act, never an accident.
  const cofB = new CursedCoffin(35, 0, 1.7, -0.4);
  G.ents.add(cofB); G.coffins.push(cofB);
  G.world.addBox(35, 0, 1.7, 1.4, 0.9, 2.4, {});
  // the ruined crypt cradling the last gold
  const cw1 = mesh('box',[0.5,1.7,3], mat(0x565070)); cw1.position.set(39.2,0.85,0); S.add(cw1);
  const cw2 = cw1.clone(); cw2.position.x=42.2; S.add(cw2);
  const croof = mesh('cone',[2.4,1.4,4], mat(0x3d3854)); croof.position.set(40.7,3.6,-1.8); croof.rotation.y=Math.PI/4; S.add(croof);
  const cbase = mesh('box',[3.6,2.4,1], mat(0x565070)); cbase.position.set(40.7,1.2,-1.9); S.add(cbase);
  G.world.addMesh(cw1); G.world.addMesh(cw2);
  G.ents.add(new GoldPumpkin(40.7, 1, 0, 2));
  // CP2 immediately before the crossing-pair gap — a walk-back over a mover gap is misery
  G.ents.add(new Checkpoint(48, 0, 1.4, 1));
  candyLine(G, [[43,0.8,0],[46,0.8,0]], 3);
  signPost(G, 46.6, 1.8, -0.3, 'Deeper in, the ghost platforms dance in PAIRS - when one rises, its partner sinks. Watch one full turn, then go.');
  G.ents.add(new Crow(20, 1.3, -2.1));
  G.ents.add(new Crow(39, 0.15, -2.4));   // pocket motion instead of pocket enemies — flaps off past the crypt

  // ================= ACT 2 — THE DEEPER GROUNDS (x 50..104) =================

  // ---- GAP 2: the crossing pair (x 50..64) — TWIST: two movers on OPPOSITE clocks ----
  // C rises as D sinks (anti-phase) around a static stone shelf. Read one full turn, then flow.
  // Envelopes (surface = fn.y+0.45): C 0.55..2.55 from ground y0 · shelf 1.8 · D 1.45..3.45
  // from the shelf — every extreme lands within held-jump reach (2.6) with margin (heights rule).
  const gpmW = w => () => { const m = new THREE.Mesh(geo('box',w,0.45,3), new THREE.MeshLambertMaterial({color:0xbfb8ff, transparent:true, opacity:0.75})); S.add(m); return m; };
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(53.5, 1.1+Math.sin(t*1.2)*1.0, 0), gpmW(2.8));
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(61.5, 2.0+Math.sin(t*1.2+Math.PI)*1.0, 0), gpmW(2.8));
  platform(G, 57.5, 1.8, 0, 2.6, 3, 0x5a4066);   // the witch's stone shelf — a breath mid-gap
  candyLine(G, [[51,1.6,0],[53.5,3.0,0],[57.3,2.7,0]], 5);   // trails trace the crossing rhythm
  candyLine(G, [[57.7,2.7,0],[61.5,3.9,0],[63.8,1.4,0]], 5);

  // ---- landing + briar pressure (x 64..78) — ESCALATE: the ferry SINKS past the thorns ----
  groundX(G, 64, 95, 0x37493f);
  G.ents.add(new Crow(65.5, 0.95, -3.4));   // perched on the first fencepost past the gap
  G.ents.add(new Skelly(G, 67.5, 0, 0, {px:1.5}));   // patrol 66..69 — clear of the landing AND the briar
  candyLine(G, [[64.6,0.8,0],[66.8,0.8,0]], 3);
  thornsX(G, 73, 8);   // too wide to jump — the ferry is the way across
  // sinker surface runs 0.85..3.05: at its lowest it visually brushes the bristles while your
  // feet stay 0.15 above the hazard top (0.7) — all drama, never a cheap hit
  G.world.addMover(3.2,0.45,3, t=>new THREE.Vector3(73, 1.5+Math.sin(t*1.5+2.0)*1.1, 0), gpmW(3.2));
  candyLine(G, [[68.5,1.5,0],[71,2.8,0],[73,3.3,0],[75,2.8,0],[77.6,1.2,0]], 7);
  G.ents.add(new Heart(73, 3.65, 0));   // collected at the top of the ride

  // ---- the potion garden (x 78..91): Broomhilda's outfield — brews, wisps, spaced singles ----
  G.ents.add(new BonkLantern(G, 78.6, 1.4, 0, 'shield'));   // armor up for the last stretch
  signPost(G, 82.6, 1.8, 0.25, 'Brew of the month: MOONLIGHT & MISCHIEF. Absolutely no free samples. - B.');
  G.ents.add(new Boo(G, 84, 0, 0, {speed:2.2, range:7}));   // lurks under the vine — can't reach a climber
  G.ents.add(new SwoopBat(G, 87.5, 3.8, 0, {range:4, phase:1.3}));   // fixed phase — same flight every run
  candyLine(G, [[79,0.8,0],[82,0.8,0]], 3);
  candyLine(G, [[84.5,1.0,0],[88,1.0,0]], 4);

  // CLIMB BEAT (owner: "fun climbing levels too"): the braided witch tree — vine up the trunk
  // to a prize branch above the whole garden; the boosted hop off the top drops into a candy-arc
  // glide that skims the swoop bat's patrol line. Optional, playful, and NOWHERE near the leap.
  buildVine(G, 80.5, 0.4, 6.2);
  platform(G, 82.4, 5.6, 0, 2.2, 2.6, 0x453153);   // the prize branch
  candyLine(G, [[81.6,6.4,0],[83.2,6.4,0]], 3);
  candyLine(G, [[83.6,5.8,0],[86,4.2,0],[88.6,1.6,0]], 5);   // the glide down rejoins the path

  // ---- CP3 + THE RIDE DOWN (x 91..104) — MASTER of the ghost-mover arc: one long diagonal mover down into the clearing ----
  G.ents.add(new Checkpoint(90.2, 0, 1.4, 2));   // immediately before the last ghost-mover gap (Act 3's bounce gaps get CP4)
  signPost(G, 91.3, 1.8, -0.3, 'The last ghost platform rides the night wind DOWN the hill. Step aboard when it greets you - it knows the way.');
  platform(G, 91.9, 1.2, 0, 2.4, 3, 0x5a4066);   // boarding step
  platform(G, 94, 2.4, 0, 2.6, 3, 0x5a4066);     // the departure ledge
  // ~6s round trip: upper-left (96.4, 3.0) ↔ lower-right (102.6, 0.2) — board high, ride it down
  G.world.addMover(2.8,0.45,3, t=>new THREE.Vector3(99.5+Math.sin(t*1.05)*3.1, 1.6-Math.sin(t*1.05)*1.4, 0), gpmW(2.8));
  candyLine(G, [[95.2,3.9,0],[97.5,3.3,0],[100,2.3,0],[102.6,1.2,0]], 6);   // the descent line
  G.ents.add(new Boo(G, 99, 1.8, 0, {speed:1.9, range:8}));   // drifts beside the ride — stare to freeze him

  // (The hedge walk + King's gate finale transplants RIGHT, past the new Act 3 — rebuilt below at x167..187.)

  // ---- Act 2 deco — all baked, one draw call ----
  const decoD2 = new THREE.Group();
  fenceRun(decoD2, 64, -3.4, 90.5, -3.4, 12);
  for(let i=0;i<6;i++) decoD2.add(deadTree(rand(65,93), rand(-8,-4.2), rand(1.0,1.6)));
  for(let i=0;i<3;i++) decoD2.add(grave(rand(65,90), rand(-5.2,-3.8)));
  // foreground silhouettes for depth framing (z>0)
  decoD2.add(pumpkinDeco(66.5, 2.5, 0.7, false));
  decoD2.add(grave(79, 2.7));
  decoD2.add(pumpkinDeco(86.5, 2.4, 0.85, false));
  decoD2.add(grave(92.5, 2.6));
  // the braided witch tree that carries the vine + prize branch
  const tr1 = mesh('cyl',[0.28,0.42,6.4,7], mat(0x241a33)); tr1.position.set(80.2,3.2,-0.9); tr1.rotation.z=0.08;
  const tr2 = mesh('cyl',[0.2,0.3,6.2,6], mat(0x2e2140)); tr2.position.set(80.8,3.1,-1.1); tr2.rotation.z=-0.1;
  const limb = mesh('cyl',[0.14,0.2,2.6,5], mat(0x241a33)); limb.position.set(81.7,5.1,-0.4); limb.rotation.z=1.15;
  const can1 = mesh('sph',[1.5,8,7], mat(0x2e4a3d)); can1.position.set(80.4,7.0,-1.0); can1.scale.set(1.3,0.75,1.1);
  const can2 = mesh('sph',[1.0,8,7], mat(0x35543f)); can2.position.set(82.4,6.6,-0.8); can2.scale.set(1.2,0.7,1);
  decoD2.add(tr1,tr2,limb,can1,can2);
  // brew cauldrons — pot/legs baked; the glowing surfaces stay live so they can breathe
  const brews = [];
  const cauldron = (px,pz,s,fire)=>{
    const cg = new THREE.Group();
    const pot = mesh('sph',[0.8*s,12,9], mat(0x1e1830)); pot.position.y=0.72*s; pot.scale.set(1,0.8,1);
    const rim = mesh('tor',[0.66*s,0.09*s,6,14], mat(0x141020)); rim.rotation.x=Math.PI/2; rim.position.y=1.18*s;
    cg.add(pot,rim);
    for(let i=0;i<3;i++){
      const a=i/3*TAU+0.5;
      const leg = mesh('cyl',[0.05*s,0.07*s,0.5*s,5], mat(0x141020));
      leg.position.set(Math.cos(a)*0.5*s, 0.22*s, Math.sin(a)*0.5*s);
      cg.add(leg);
    }
    if(fire) for(let i=0;i<4;i++){
      const fl = mesh('cone',[0.09*s,rand(0.2,0.35)*s,4], emat(0xffb02e,0xff8c2e,0.9));
      fl.position.set(rand(-0.3,0.3)*s, 0.14*s, rand(-0.3,0.3)*s);
      cg.add(fl);
    }
    cg.position.set(px,0,pz);
    decoD2.add(cg);
    const brew = mesh('cyl',[0.58*s,0.58*s,0.1,12], emat(0x7dff9e,0x4ecf6f,0.9));
    brew.position.set(px,1.18*s,pz);
    brew.userData.y0 = 1.18*s;
    S.add(brew); brews.push(brew);
  };
  cauldron(82.8,-2.2,1.0,false);
  cauldron(85.2,-1.7,1.45,true);    // the centerpiece — carries the act's one real light
  cauldron(88.2,-2.35,0.85,false);
  cauldron(84.6,2.3,0.9,false);     // foreground silhouette brew
  // light budget: 4 checkpoints (Act 3 adds CP4) + gold pumpkin + coffin + this brewLight = 7 —
  // the only PointLight in the ~180u course; Act 3's cauldrons/geyser/broom/brews are emissive fakes.
  const brewLight = new THREE.PointLight(0x7dff9e, 45, 9); brewLight.position.set(85.2, 2.4, -1.7); S.add(brewLight);
  // the quiet prop (never signposted): a stool, a still-warm cup, and someone's knitting —
  // the witch stepped away mid-row. Story-readers will wonder; everyone else walks past.
  const teaBreak = new THREE.Group();
  const stool = mesh('cyl',[0.26,0.3,0.34,7], mat(0x453153)); stool.position.y=0.17;
  const cup = mesh('cyl',[0.09,0.07,0.12,8], mat(0xf4f4f8)); cup.position.set(0.06,0.4,0.02);
  const tea = mesh('circ',[0.07,8], emat(0x7dff9e,0x4ecf6f,0.6)); tea.rotation.x=-Math.PI/2; tea.position.set(0.06,0.47,0.02);
  const kn1 = mesh('cyl',[0.02,0.02,0.5,4], mat(PAL.bone)); kn1.position.set(-0.25,0.42,0.1); kn1.rotation.z=0.7;
  const kn2 = kn1.clone(); kn2.rotation.z=-0.5; kn2.position.x=-0.15;
  const yarn = mesh('sph',[0.11,7,6], mat(0xff5ea8)); yarn.position.set(-0.32,0.1,0.26);
  teaBreak.add(stool,cup,tea,kn1,kn2,yarn);
  teaBreak.position.set(87.1,0,-2.1);
  decoD2.add(teaBreak);
  S.add(bakeGroup(decoD2));   // (the hedge-walk frames transplant RIGHT with the finale — rebuilt in Act 3 below)

  // brew-wisps: three little lights doing slow laps of the centerpiece cauldron, and the
  // brew surfaces breathe. Fixed phases — the same dance every night (determinism rule).
  const wispG = new THREE.Group();
  wispG.position.set(85.2, 0, -1.7);
  const wisps = [];
  for(let i=0;i<3;i++){
    const w = mesh('sph',[0.09,6,5], emat(0x9effc9, 0x7dff9e, 1));
    wispG.add(w); wisps.push(w);
  }
  G.ents.add({group:wispG, dead:false, t:0, update(dt){
    this.t += dt;
    wisps.forEach((w,i)=>{
      const a = this.t*(0.6+i*0.22)+i*2.1;
      w.position.set(Math.sin(a)*2.4, 2.0+Math.sin(this.t*1.3+i*1.7)*0.7, Math.cos(a)*1.0);
    });
    brews.forEach((b,i)=>{
      b.position.y = b.userData.y0 + Math.sin(this.t*2.2+i*1.9)*0.05;
      b.scale.setScalar(1+Math.sin(this.t*3.1+i)*0.04);
    });
  }});

  // ================= ACT 3 — THE CAULDRON CLEARING (x 104..167) =================
  // FRESH gimmick beyond ghost-movers: Broomhilda's cauldrons are hexed BOUNCE PADS. Bounce-chain
  // across a potion-bog void — INTRODUCE (one bounce onto the bank), TWIST (a 2-pad chain over a
  // rising brew GEYSER you time), ESCALATE (a chain past a riderless SWEEP-BROOM). At the junction, a
  // CLIMB DETOUR (vine -> hedge-top candy stash + Bat Wings, loops back) rewards the greedy and tames
  // the broom. Every gap is crossed by a bounce (>=6u = the verb-gate); a mistimed hop costs a heart
  // into the brew, never a life. Every clock runs from level start — learnable, speedrunnable.

  // landing apron (the ride-down mover sets Pip down here) — arm up, read the clearing's rules
  groundX(G, 104, 113, 0x3a4c42);
  G.ents.add(new BonkLantern(G, 108, 1.4, 0, 'shield'));            // shield before the bog
  signPost(G, 110.5, 1.8, -0.3, "Broomhilda's brewing clearing. Her cauldrons are hexed to BOUNCE - hop the brew-pots across the bog. Mind the geyser's spout... and the tidy-up broom.");
  candyLine(G, [[105.5,0.9,0],[108,0.9,0],[110.6,0.9,0]], 4);
  G.ents.add(new Crow(106.3, 0.95, -2.8));                          // ambient — flaps off the apron fence

  // cauldron bounce-pad factory: bounce ON TOP (surface y1.2 -> ~3.5u apex; hold-lift never stacks on bounces)
  const decoAct = new THREE.Group();
  const bounceCauldron = (px, w)=>{
    G.world.addBox(px, 0.2, 0, w, 1.0, 3, {type:'bounce', bounce:13});   // solid sides, springy top at y1.2
    const cg = new THREE.Group();
    const pot = mesh('sph',[1.15,14,10], mat(0x1e1830)); pot.position.y=0.6; pot.scale.set(1.08,0.78,1.08);
    const rim = mesh('tor',[0.98,0.12,6,16], mat(0x120e1e)); rim.rotation.x=Math.PI/2; rim.position.y=1.2;
    cg.add(pot, rim);
    for(let i=0;i<3;i++){ const a=i/3*TAU+0.4; const leg=mesh('cyl',[0.08,0.1,0.62,6], mat(0x120e1e)); leg.position.set(Math.cos(a)*0.72, 0.28, Math.sin(a)*0.72); cg.add(leg); }
    cg.position.set(px,0,0); decoAct.add(cg);
    const brew = mesh('cyl',[0.9,0.9,0.12,16], emat(0x8dffb0, 0x4ecf6f, 0.9)); brew.position.set(px,1.24,0); decoAct.add(brew);   // the glowing bounce lip
  };

  // ---- INTRODUCE (Gap I, x113..121.5): a single bounce onto the mid-bank ----
  bounceCauldron(116.5, 3.0);
  candyLine(G, [[114.5,1.7,0],[116.5,4.4,0],[119,3.4,0],[121.6,1.2,0]], 6);   // the arc, taught by candy
  groundX(G, 121.5, 130, 0x37493f);
  G.ents.add(new Checkpoint(123.5, 0, 1.3, 3, {noLight:true}));     // CP4 (the 4th) — before the twist & escalate gaps; noLight keeps the level at 6 real lights
  G.ents.add(new Skelly(G, 127.5, 0, 0, {px:1.5}));                 // the landing patroller (paces 126..129)
  candyLine(G, [[125,0.9,0],[128.5,0.9,0]], 3);

  // ---- TWIST (Gap II, x130..142): a 2-pad bounce-chain over a fixed-cycle brew GEYSER ----
  bounceCauldron(134, 2.8);
  bounceCauldron(141, 2.8);
  candyLine(G, [[132,1.6,0],[134,4.4,0],[137.5,4.7,0],[141,4.4,0],[143,1.4,0]], 7);   // cross HIGH, and only when the spout sleeps
  {   // the geyser: dormant ~1.7s -> swells 0.6s (telegraph) -> erupts ~0.9s, tall enough to singe even the apex.
    const gx = 137.5;                                              // wait it out on C2 (bounce in place), then chain across.
    const colMat = new THREE.MeshLambertMaterial({color:0x9dffb8, emissive:0x4ecf6f, emissiveIntensity:0.85, transparent:true, opacity:0.2});
    const col = new THREE.Mesh(geo('cyl',0.7,0.45,5.4,10), colMat);
    col.position.set(gx, 0.1, 0); col.scale.y = 0.02; S.add(col);
    const cap = mesh('sph',[0.95,10,8], emat(0x7dff9e, 0x4ecf6f, 0.6)); cap.position.set(gx, 0.25, 0); cap.scale.y=0.5; S.add(cap);
    G.ents.add({ group:col, dead:false, cull:false, gt:0, update(dt){   // cull:false — the geyser clock runs from level start (deterministic, speedrun-fair)
      this.gt += dt;
      const c = this.gt % 3.2;
      let e, danger=false;
      if(c < 1.7) e = 0.02;                                         // dormant — a quiet surface
      else if(c < 2.3) e = 0.02 + (c-1.7)/0.6*0.33;                 // TELEGRAPH — the brew swells & brightens (still safe)
      else { e = 0.35 + (1 - Math.abs(c-2.75)/0.45)*0.65; danger = true; }   // ERUPT — the spout shoots up
      e = clamp(e, 0.02, 1);
      col.scale.y = e; col.position.y = 2.7*e; colMat.opacity = 0.18 + e*0.6;
      cap.scale.setScalar(1 + Math.sin(this.gt*7)*0.1 + (c>1.7 ? 0.6 : 0));
      const pl = G.player;                                          // singe only within the VISIBLE spout (fair: hazard tracks the column top)
      if(danger && pl && !pl.dead && Math.abs(pl.pos.x-gx) < 1.0 && pl.pos.y < 5.4*e){
        pl.damage(1, new THREE.Vector3(gx, 0.4, 0));
      }
    }});
  }

  // ---- chain-bank + the route junction (x142..152) ----
  groundX(G, 142, 152, 0x37493f);
  G.ents.add(new Boo(G, 148, 0, 0, {speed:2.0, range:5}));          // stare to freeze — range trimmed off the pads & the climber
  G.ents.add(new SwoopBat(G, 146, 4.2, 0, {range:2.5, aggroR:3.5, phase:0.7}));   // air lane over SOLID ground — aggro trimmed so its dive can't reach the bounce pads (no void-knock)
  signPost(G, 152, 1.8, 0.3, "Climb the hedge for a candy stash and BAT WINGS - the wings make the sweep-broom a breeze. Skip it and hop the cauldrons the hard way.");
  candyLine(G, [[143,0.9,0],[145.6,0.9,0]], 3);

  // CLIMB HIGH ROAD — a candy DETOUR that REJOINS (climb, grab the greedy stash + BAT WINGS, drop back
  // onto the chain-bank): the wings then turn the low-road broom into an easy glide. The all-candy star
  // wants this climb — but it loops back, so a single run can still collect every candy in the level.
  buildVine(G, 144, -0.4, 6.0);
  platform(G, 148.25, 5.6, 0, 5.5, 2.6, 0x2e4a3d);                 // hedge-top prize ledge (145.5..151) over the SOLID chain-bank
  G.ents.add(new BonkLantern(G, 147, 6.2, 0, 'bat'));             // Bat Wings — telegraphed by the sign; spin/stomp to pop it
  candyLine(G, [[145.8,6.3,0],[148,6.3,0],[150.5,6.3,0]], 5);      // the greedy high line
  G.ents.add(new Heart(150.6, 6.3, 0));                            // a heart before the drop back down to continue

  // ---- ESCALATE (Gap III, x152..167): a bounce-chain past the sweeping broom ----
  bounceCauldron(156, 2.8);
  bounceCauldron(163, 2.8);
  candyLine(G, [[154,1.6,0],[156,4.4,0],[159.5,4.7,0],[163,4.4,0],[165,1.6,0]], 7);
  {   // riderless sweep-broom: slides across the chain at apex-height on a fixed clock — fly over when it's swept aside.
    const cx = 159.5;
    const bg = new THREE.Group();
    const handle = mesh('cyl',[0.05,0.06,1.7,6], mat(0x6b4a2e)); handle.rotation.z = Math.PI*0.42;
    const bris = mesh('cone',[0.26,0.62,7], mat(0xc2a24f)); bris.position.set(0,-0.85,0);
    const tie = mesh('tor',[0.16,0.04,5,10], mat(0x8a6f2e)); tie.rotation.x=Math.PI/2; tie.position.y=-0.5;
    bg.add(handle, bris, tie); bg.position.set(cx, 5.0, 0); S.add(bg);
    G.ents.add({ group:bg, dead:false, cull:false, bt:0, update(dt){   // cull:false — the broom sweep runs from level start (deterministic)
      this.bt += dt;
      const ph = this.bt*1.85;                                      // period ~3.4s
      const x = cx + Math.sin(ph)*2.5;
      bg.position.x = x; bg.position.y = 5.0 + Math.sin(this.bt*3)*0.12;
      bg.rotation.z = 0.4 + Math.sin(ph)*0.25;
      const pl = G.player;                                          // tight hitbox — you must be right ON the broom
      if(pl && !pl.dead){
        const dx = pl.pos.x - x, dy = (pl.pos.y+0.6) - bg.position.y;
        if(dx*dx*0.7 + dy*dy < 0.85) pl.damage(1, new THREE.Vector3(x, bg.position.y, 0));
      }
    }});
  }

  // ---- convergence + the transplanted hedge walk to the King's gate (x167..187) ----
  groundX(G, 167, 187, 0x3e5347);
  candyLine(G, [[168.5,0.9,0],[171,0.9,0]], 3);                     // the low-road chain lands here
  candyLine(G, [[178,0.8,0],[182,0.8,0]], 4);
  G.ents.add(new Crow(178.6, 1.78, -2.7));                          // on the hedge top — flaps off as you pass
  G.ents.add(new Hopper(G, 181, 0, 0, {aggroR:3.5}));              // the King's outer guard
  signPost(G, 180.8, 1.8, -0.3, 'The Pumpkin King waits beyond this gate. He was the kindest guardian of all... until the ember burned his heart. Free him, Pip!');

  // ---- Act 3 deco (baked, one draw call): glowing bog floors, background trees, the hedge-tree, silhouettes ----
  for(const g of [[113,121.5],[130,142],[152,167]]){
    const bog = mesh('box',[g[1]-g[0], 0.2, 4.4], emat(0x2f6b45, 0x1e4a30, 0.7));
    bog.position.set((g[0]+g[1])/2, -0.85, 0); decoAct.add(bog);    // the brew below each void (scenery, well under the pads)
  }
  for(let i=0;i<7;i++) decoAct.add(deadTree(rand(106,186), rand(-8,-4.4), rand(1.0,1.6)));
  const bt1 = mesh('cyl',[0.3,0.44,6.6,7], mat(0x241a33)); bt1.position.set(143.7,3.3,-0.7); bt1.rotation.z=0.07;
  const bt2 = mesh('cyl',[0.22,0.32,6.4,6], mat(0x2e2140)); bt2.position.set(144.4,3.2,-0.9); bt2.rotation.z=-0.09;
  const bcan = mesh('sph',[1.6,8,7], mat(0x2e4a3d)); bcan.position.set(144.1,6.6,-0.8); bcan.scale.set(1.3,0.8,1.1);
  decoAct.add(bt1, bt2, bcan);                                      // the braided hedge-tree that carries the vine
  for(let i=0;i<9;i++){ const puff = mesh('sph',[rand(0.5,0.75),7,6], mat(0x35543f)); puff.position.set(145.5+i*0.7+rand(-0.25,0.25), 5.85+rand(0,0.3), rand(-0.9,0.9)); decoAct.add(puff); }   // hedge-top foliage on the prize ledge
  decoAct.add(pumpkinDeco(126.5, 2.5, 0.7, false), grave(139, 2.6), pumpkinDeco(159, 2.6, 0.85, false), grave(171, 2.7));   // foreground silhouettes (z>0)
  // a stray broom leaning at the junction (regular deco — this level's ONE quiet prop is Act 2's tea-break)
  const leanB = new THREE.Group();
  const lh = mesh('cyl',[0.04,0.05,1.5,6], mat(0x6b4a2e)); lh.position.y=0.72; lh.rotation.z=0.5;
  const lbr = mesh('cone',[0.2,0.5,7], mat(0xc2a24f)); lbr.position.set(0.36,1.4,0); lbr.rotation.z=0.5;
  leanB.add(lh, lbr); leanB.position.set(146.5, 0, 1.8); decoAct.add(leanB);
  // the hedge frames for the final walk (transplanted from the old finale, shifted right +73)
  for(const hz of [-2.7, 2.5]){   // frames end BEFORE the gate — the foreground row was covering the portal's lower glow
    const row = mesh('box',[9.6,1.7,1.1], mat(0x2e4a3d)); row.position.set(175.5,0.85,hz); decoAct.add(row);
    for(let i=0;i<5;i++){ const puff = mesh('sph',[rand(0.5,0.75),7,6], mat(0x35543f)); puff.position.set(171.5+i*2.1+rand(-0.35,0.35), 1.65+rand(0,0.3), hz+rand(-0.3,0.3)); decoAct.add(puff); }
  }
  decoAct.add(pumpkinDeco(177.9,-2.0,0.6,true), pumpkinDeco(179.5,1.95,0.55,true));
  S.add(bakeGroup(decoAct));

  exitGate(G, 184);

  // themed death-pit dressing (visual — the fall is the hazard). NEVER in Gap 1 (x 2..14):
  // its second half is the LEAP OF FAITH — zero tells of any kind, ever (sacred). The Act 3
  // bog voids stay undressed too: their glowing brew surface already spans them.
  pitDressing(G, 50, 64, 'patch');    // Gap 2 — the crossing pair
  pitDressing(G, 95, 104, 'patch');   // the ride-down gap into the clearing
  // Act-3 brew-bog voids: their glowing surface is the visual — register them so Pip SPLASHES in
  // with the full impact sequence instead of silently falling through. (Gap 1 at x2..14 is the
  // LEAP OF FAITH — never registered, never dressed, never a tell.)
  pitRegister(G, 113, 121.5, 'patch', -2.0);
  pitRegister(G, 130, 142, 'patch', -2.0);
  pitRegister(G, 152, 167, 'patch', -2.0);

  // clutter per solid span ONLY — never over a void, and NOTHING inside x 2..14: the leap
  // gap keeps its zero-tell rule (no clutter, no lights, no signs, no geometry hints — sacred).
  buildClutter(G, -7, 1, 'garden');     // runway clutter only — nothing may float over the gap
  buildClutter(G, 14, 49, 'garden');
  buildClutter(G, 64.5, 90.5, 'garden');
  buildClutter(G, 104, 112.5, 'garden');     // apron (solid 104..113) — stops before Gap I at 113
  buildClutter(G, 122, 129.5, 'garden');     // mid-bank
  buildClutter(G, 142.5, 151.5, 'garden');   // chain-bank
  buildClutter(G, 167.5, 186, 'garden');     // convergence + hedge walk
  levelFinish(G, -8, 187, null);        // ambience spans the whole level; theme=null keeps kit clutter off the gaps
  return {spawnX:0, exitX:184};
}
function updateW1L4(G, dt){
  updateLevelCommon(G, dt);
}
W1_LEVELS.push({id:'w1l4', district:'w1', name:"THE WITCH'S GARDEN", build:buildW1L4, update:updateW1L4, parTime:155});

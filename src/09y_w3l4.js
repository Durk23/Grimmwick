// ============ W3-L4 — WITCH-HUT ROW (District 3 · Witchwood · x -8..200, ~4 min) ============
// Sorts after 09u_w3kit.js (W3_LEVELS, the D3 kit + roster all exist) and self-registers below.
// SIGNATURE GIMMICK: VERTICALITY AMONG STILTED WITCH HUTS + ENCHANTED BROOMS SWEEPING THE GAPS.
// You climb UP onto the row and hop plank→porch→roof over a potion-bog void, while riderless
// BroomZoomers sweep low across the gaps (time your crossing) or across the walkways (leap them),
// drop-Spiders fall from the eaves, and a witch's ferry-plank (addMover, fixed clock) carries you
// between huts. Full kishotenketsu arc on the hut-hop + broom-dodge:
//   INTRODUCE (Act 1, x -8..56)  — on the LANE BELOW the huts: meet the sweeping brooms (leap one
//     on flat ground), meet an eave drop-Spider, one Widowmite pair. Everything safe, ground-level.
//   TWIST (Act 2, x 56..112)     — UP ONTO THE ROW: porch→porch→roof planks over the bog void; a
//     broom sweeps the FIRST gap (time it) and a broom sweeps a ROOF WALKWAY (leap it); a Widowmite
//     SWARM on the market porch; an eave spider over the roof; then a hut courtyard with the
//     Mystery Cauldron gamble in a clear pocket + a CauldronDip brew-boost before the escalate.
//   ESCALATE (Act 3, x 112..140) — THE HIGH ROOFS: the ferry-plank MOVER over a wide void between
//     two roofs, TWO brooms on offset clocks (one leap-walkway, one time-the-gap), an eave spider.
//   MASTER (Act 4, x 140..200)   — THE TALL GABLE: a web CLIMB to a high porch (climbing is fun),
//     an eave spider on the landing, then the LAST ferry-plank down past a sweeping broom to the way
//     out — everything learned, at once. exitGate completes the level.
// Threats: ~18 discrete (BroomZoomers, drop-Spiders, Widowmites) — D3 "fairly competitive" band,
//   spread, every one telegraphed (violet broom-shimmer, spider thread, hot-red widow). NO Golden
//   Pumpkin (the district's three live in 3-1/3-2/3-5) — reward spots are candy + 3 Hearts + the
//   gamble/dip. 4 checkpoints (each on solid ground BEFORE a void/mover span — no walk-back over a
//   mover). COMPARABLE HEIGHTS: ground→porch 2.2 (held 2.6, margin), porch→roof 1.8 (tap), gaps
//   ≤3.5 (tap ≤4), mover surfaces land within held reach of both banks. Deterministic: every broom,
//   spider, mover + geyser-free clock runs from level start; rand() is COSMETIC deco scatter only.
//   Real PointLights: CP0 + Mystery Cauldron + CauldronDip = 3 (≤6 budget); all else emissive fakes.

// ---- in-file: the potion-bog void floor (pure DECO, well below the planks — a miss is a fall, not a wall)
// A missed hop drops past killY → onPlayerFell (a heart + a walk-back to the last lantern), never a life.
function w3l4Bog(G, x1, x2){
  brewBed(G, x1, x2, -1.0, 'green');   // bubbling green witch's-brew lava (dressed + splash-registered in one call)
}

// ---- in-file: THE QUIET PROP — "a young witch's first flying lesson" (deep-lore; NEVER signposted) ----
// Someone small lives on this row: a doll-sized training broom lying on a rug, an open picture-book
// ("How to Fly"), a half-finished tiny witch hat on a stool, a knocked-over cup, a faint potion
// nightlight. A witch family — kids and all — makes the hut village a HOME. Story-readers linger.
function w3l4QuietProp(x, z){
  const g = new THREE.Group();
  const rug  = mesh('box',[1.3,0.05,0.9], mat(0x6a3a5a)); rug.position.y=0.03;
  const trim = mesh('box',[1.34,0.03,0.94], emat(W3PAL.potionV,W3PAL.potionV,0.3)); trim.position.y=0.05;
  const th = mesh('cyl',[0.03,0.04,0.9,6], mat(0x7a5636)); th.rotation.z=Math.PI/2; th.position.set(0.05,0.12,0.1);   // mini broom handle
  const tb = mesh('cone',[0.11,0.28,6], emat(0xe0b84a,0xb8902a,0.3)); tb.rotation.z=-Math.PI/2; tb.position.set(-0.46,0.12,0.1);   // bristles
  const pgL = mesh('box',[0.34,0.02,0.28], mat(0xefe6cf)); pgL.position.set(0.42,0.16,-0.2); pgL.rotation.z=0.18; pgL.rotation.x=0.12;   // open book, two pages
  const pgR = mesh('box',[0.34,0.02,0.28], mat(0xefe6cf)); pgR.position.set(0.42,0.16,0.14); pgR.rotation.z=-0.18; pgR.rotation.x=-0.12;
  const spine= mesh('box',[0.05,0.05,0.42], mat(0x8a3a2e)); spine.position.set(0.42,0.18,-0.03);
  const stool= mesh('cyl',[0.14,0.16,0.24,7], mat(0x453153)); stool.position.set(-0.5,0.12,-0.32);
  const hat  = mesh('cone',[0.16,0.34,7], emat(0x3a2f4a,0x2a2038,0.2)); hat.position.set(-0.5,0.42,-0.32); crook(hat,0.12);   // half-finished hat
  const brim = mesh('cyl',[0.24,0.24,0.03,10], mat(0x2a2038)); brim.position.set(-0.5,0.26,-0.32);
  const cup  = mesh('cyl',[0.06,0.05,0.1,8], mat(0xf4f4f8)); cup.rotation.z=Math.PI/2.3; cup.position.set(0.16,0.09,0.34);   // knocked over
  const nite = mesh('sph',[0.09,7,6], emat(W3PAL.potionP,W3PAL.potionP,0.7)); nite.position.set(-0.04,0.2,0.36);   // a potion nightlight catches the eye
  g.add(rug,trim,th,tb,pgL,pgR,spine,stool,hat,brim,cup,nite);
  g.position.set(x,0,z); g.rotation.y = rand(-0.2,0.2);
  return g;
}

function buildW3L4(G){
  const S = G.scene;
  levelBegin(G);
  const GND = W3PAL.ground;         // groundX brightens the top lip automatically
  const PORCH_C = 0x7a5f3e;         // warm lit porch timber — reads as a standable plank in the dark wood
  const ROOF_C  = 0x6a5450;         // violet-timber roof walkway
  const PORCH = 2.2, ROOF = 4.0, HIGH = 5.6;   // the height model: ground→porch 2.2 (held), porch→roof 1.8 (tap)

  // one enchanted-wood backdrop over the whole course (baked three-depth trees + witch-hut skyline + potion glow)
  w3Parallax(S, -14, 205);

  // the witch's FERRY-PLANK — the mover mesh (a plank with a broom slung beneath). Built + added to the
  // scene here; addMover parks it at fn(t) (center-BOTTOM, so the standable surface sits h=0.5 above fn.y).
  const ferryPlank = (w)=> ()=>{
    const g = new THREE.Group();
    const plank = mesh('box',[w,0.4,3], mat(ROOF_C));
    const lip   = mesh('box',[w,0.1,3.1], emat(W3PAL.potionP, W3PAL.potionP, 0.4)); lip.position.y=0.22;   // glowing lip = readable landing
    const handle= mesh('cyl',[0.05,0.06,w*0.82,6], emat(0x7a5636,0x3a2410,0.3)); handle.rotation.z=Math.PI/2; handle.position.y=-0.34;
    const bris  = mesh('cone',[0.22,0.5,7], emat(0xe0b84a,0xb8902a,0.4)); bris.rotation.z=Math.PI/2; bris.position.set(-w*0.44,-0.34,0);
    const bind  = mesh('cyl',[0.1,0.1,0.16,8], emat(0xb37dff,0x8a5fd0,0.5)); bind.rotation.z=Math.PI/2; bind.position.set(-w*0.28,-0.34,0);
    g.add(plank,lip,handle,bris,bind); S.add(g); return g;
  };
  // a few live will-o'-wisps bobbing through the midground (micro-motion; kept LIVE so the halo stays soft)
  const addWisp = (x,y,z)=>{ const w = willOWisp(x,y,z); S.add(w); G.ents.add({group:w, dead:false, cull:false, t:rand(0,7), update(dt){ this.t+=dt; w.position.y = y + Math.sin(this.t*1.4)*0.4; w.position.x = x + Math.sin(this.t*0.7)*0.5; w.scale.setScalar(1+Math.sin(this.t*3)*0.08); }}); };

  // ============== ACT 1 — THE LANE BELOW THE HUTS (x -8..56) : learn the tools, ground-level ==============
  groundX(G, -8, 48, GND);
  groundX(G, 48, 56, GND);          // act-2 staging, continuous with act 1 (solid -8..56)
  signPost(G, 2, 1.8, -0.2, 'WITCH-HUT ROW. Riderless brooms sweep the lane and the gaps between the huts — leap them, or time your crossing. And mind the eaves: spiders drop. Up onto the porches you go!');
  G.ents.add(new Checkpoint(4, 0, 1.4, 0));                       // CP0 (real light #1 — a warm welcome)
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12,1.4,0]], 5);

  // BROOM — introduced on flat, safe ground: it sweeps low and never turns; hop over as it passes.
  signPost(G, 12, 1.8, 0.2, 'Enchanted brooms! They sweep low and never turn back — a little hop clears one. Watch the rhythm, then go.');
  G.ents.add(new BroomZoomer(G, 18, 0.15, 0, {baseY:0.15, range:5, speed:5.4, phase:0}));   // ground sweep 13..23 — leap it
  candyLine(G, [[15,0.9,0],[18,2.0,0],[21,0.9,0]], 5);           // the arc teaches the leap height

  // EAVE DROP-SPIDER — introduced hanging from a hut's eave; drops when you pass beneath, then chases.
  G.ents.add(new Spider(G, 30, 5, 0, {groundY:0}));
  candyLine(G, [[26,0.9,0],[30,0.9,0],[34,0.9,0]], 5);

  // a Widowmite pair — tiny fast skitterers, an easy stomp (learn the swarm before Act 2's brood)
  G.ents.add(new Widowmite(G, 43, 0, 0, {range:1.6, dir:1, phase:0}));
  G.ents.add(new Widowmite(G, 45, 0, 0, {range:1.6, dir:-1, phase:0.5}));
  candyLine(G, [[42,0.9,0],[46,0.9,0]], 3);
  G.ents.add(new BonkLantern(G, 52, 1.4, 0, 'shield'));           // mercy: armor up before the porch chain

  // Act-1 deco (baked, one draw call): the hut row looming behind + beside the lane, trees, ground jewels
  const decoA = new THREE.Group();
  decoA.add(witchHut(6, -2.8, 1.0), witchHut(20, -3.2, 1.1), witchHut(30, -1.3, 1.0), witchHut(40, -3.0, 1.05));
  for(let i=0;i<5;i++) decoA.add(braidedTree(rand(-6,47), rand(-8,-4.4), rand(0.9,1.4)));
  for(let i=0;i<5;i++) decoA.add(mushroomCluster(rand(-6,47), rand(-3.2,3.0), rand(0.7,1.1)));
  decoA.add(hangingWeb(30, 0.6, 1.2));                            // the eave web the drop-spider hangs from (visual tell)
  decoA.add(mushroomCluster(24, 2.6, 0.9), potionBottle(37, 2.4), grave(52, 2.7));   // foreground silhouettes (z>0)
  S.add(bakeGroup(decoA));
  addWisp(16, 2.4, -2.5); addWisp(38, 3.0, -3.0);
  G.ents.add(new Crow(22, 0.15, -2.6));                           // reactive critter — flaps off as you near

  // =================== ACT 2 — UP ONTO THE ROW (x 56..112) : TWIST — hop the gaps ===================
  G.ents.add(new Checkpoint(50, 0, 1.4, 1, {noLight:true}));      // CP1 (emissive only) — on solid ground before the void
  signPost(G, 54, 1.8, 0.2, 'Onto the porches now — hop up, then cross plank to plank. A broom sweeps the first gap: cross when it has swept aside.');
  w3l4Bog(G, 56, 77);                                            // the potion-bog void beneath the porch chain (deco only)

  // step UP onto the row (ground→P1, rise 2.2 held-jump; P1's left lip overlaps the ground for a clean step)
  platform(G, 57.6, PORCH, 0, 3.6, 3, PORCH_C);                  // P1  (55.8..59.4)
  candyLine(G, [[56,1.5,0],[57.6,2.9,0]], 3);

  // GAP A (porch level) — a broom sweeps the gap P1→P2: TIME YOUR CROSSING (cross when it's at the far edge).
  G.ents.add(new BroomZoomer(G, 61, PORCH, 0, {baseY:PORCH, range:2.2, speed:5.2, phase:0}));   // sweeps 58.8..63.2 at porch height
  platform(G, 64, PORCH, 0, 4.6, 3, PORCH_C);                    // P2 = the MARKET PORCH (61.7..66.3)
  candyLine(G, [[59.4,2.9,0],[61,3.6,0],[63,2.9,0]], 4);         // arc HIGH over the low broom sweep

  // the market porch WIDOWMITE SWARM (three, skittering their own lanes — an easy but busy stomp fest)
  G.ents.add(new Widowmite(G, 63, PORCH, 0, {range:1.0, dir:1,  phase:0.0}));
  G.ents.add(new Widowmite(G, 64, PORCH, 0, {range:1.0, dir:-1, phase:0.4}));
  G.ents.add(new Widowmite(G, 65, PORCH, 0, {range:1.0, dir:1,  phase:0.8}));

  // GAP B — up onto the ROOF WALKWAY R1 (porch→roof, rise 1.8): a broom sweeps ACROSS R1 — LEAP it as
  // you traverse; and an eave spider drops onto the walk. Two flavours of the broom in one beat.
  platform(G, 70, ROOF, 0, 4.2, 3, ROOF_C);                      // R1 roof walkway (67.9..72.1)
  G.ents.add(new BroomZoomer(G, 70, ROOF, 0, {baseY:ROOF, range:2.0, speed:5.6, phase:0.6}));   // sweeps the walkway 68..72 — leap it
  G.ents.add(new Spider(G, 72, 7.5, 0, {groundY:ROOF}));         // eave drop onto R1
  G.ents.add(new Heart(70, 4.8, 0));                             // the high-road reward, grabbed at the walkway apex
  candyLine(G, [[66.3,3.2,0],[68,3.8,0],[70,4.6,0]], 4);

  // GAP C — descend R1→P3 (roof→porch, drop 1.8): a gentle step down, back toward the courtyard
  platform(G, 76, PORCH, 0, 3.6, 3, PORCH_C);                    // P3 (74.2..77.8)
  candyLine(G, [[72.1,3.6,0],[74,2.8,0],[76,2.6,0]], 4);

  // THE HUT COURTYARD (x 77..112, solid ground) — the calm bay that carries the gamble + the brew-boost
  groundX(G, 77, 112, GND);
  signPost(G, 80, 1.8, 0.2, 'A cauldron left simmering, a red gem winking on the brew... dip a hand in, if you dare. (Something might be nesting.)');
  // MYSTERY CAULDRON — the D3 gamble, in a CLEAR POCKET (CLEAR-PATCH LAW: nearest patrol is the swarm ~13u
  // west and the courtyard spider ~16u east — no route within ~6u, so opening it is a chosen, safe act).
  const myc = new MysteryCauldron(84, 0, 1.4, -0.15);
  G.ents.add(myc); G.coffins.push(myc);
  G.world.addBox(84, 0, 1.4, 2.0, 1.05, 2.0, {});               // the hearth (off the z=0 lane — you approach to dip)
  candyLine(G, [[88,0.9,0],[92,0.9,0],[96,0.9,0]], 5);
  G.ents.add(new Spider(G, 100, 5, 0, {groundY:0}));            // an eave drop keeps the courtyard's east end alive
  candyLine(G, [[100,0.9,0],[104,0.9,0]], 3);
  // CauldronDip — a repeatable brew-buff vessel (jump IN → a random shield/moon/wings/salt) to arm the escalate.
  G.ents.add(new CauldronDip(108, 0, 0, {light:true, r:1.5, cool:6}));   // real light #2

  // Act-2 deco (baked): huts framing the porch row + the courtyard, the quiet prop, foreground jewels
  const decoB = new THREE.Group();
  decoB.add(witchHut(62, -1.2, 1.15), witchHut(72, -3.0, 1.0), witchHut(90, -1.3, 1.15), witchHut(104, -3.0, 1.05));
  for(let i=0;i<5;i++) decoB.add(braidedTree(rand(78,110), rand(-8,-4.4), rand(1.0,1.5)));
  for(let i=0;i<5;i++) decoB.add(mushroomCluster(rand(78,110), rand(-3.0,3.0), rand(0.7,1.1)));
  decoB.add(hangingWeb(72, 5.2, 1.1));                          // the R1 eave web (visual tell for the drop-spider)
  decoB.add(w3l4QuietProp(91, 1.6));                            // THE QUIET PROP — the young witch's flying lesson
  decoB.add(mushroomCluster(98, 2.6, 0.9), potionBottle(82, 2.3), grave(107, 2.7));   // foreground silhouettes
  S.add(bakeGroup(decoB));
  addWisp(86, 2.6, -2.6); addWisp(100, 3.2, -2.2);
  G.ents.add(new Crow(85, 0.15, 2.2));

  // =================== ACT 3 — THE HIGH ROOFS (x 112..140) : ESCALATE — the ferry-plank ===================
  G.ents.add(new Checkpoint(110, 0, 1.4, 2, {noLight:true}));    // CP2 — solid ground, immediately before the mover void
  signPost(G, 105, 1.8, -0.2, 'THE HIGH ROOFS. A witch\'s ferry-plank drifts between the huts — board it when it comes to you, ride across, and mind the sweepers. Dip in the cauldron first for a lucky brew.');
  w3l4Bog(G, 112, 140);                                         // the wide void the ferry crosses (deco only)

  // climb up onto the roofs: ground→P4 (rise 2.2 held) → R2 (rise 1.8 tap)
  platform(G, 114, PORCH, 0, 3.0, 3, PORCH_C);                  // P4 (112.5..115.5) — steps off the ground edge
  platform(G, 118.5, ROOF, 0, 3.4, 3, ROOF_C);                  // R2 boarding roof (116.8..120.2)
  candyLine(G, [[113,1.5,0],[114,2.9,0],[116,3.6,0],[118.5,4.6,0]], 5);

  // THE FERRY-PLANK MOVER — a ~7s shuttle (period 2π/0.9). Surface = fn.y+0.5 = 4.0, level with the roofs.
  // Board from R2 when it's at its LEFT extreme (its right edge 121.1 overlaps R2's 120.2); step off onto
  // R3 at its RIGHT extreme (its right edge 127.9 reaches within 1.3u of R3's left 129.2). Every extreme
  // lands within a step of solid roof — comparable heights, fixed clock, learnable + speedrunnable.
  G.world.addMover(3, 0.5, 3, t=>new THREE.Vector3(123 + Math.sin(t*0.9)*3.4, 3.5, 0), ferryPlank(3));
  candyLine(G, [[120.2,4.6,0],[123,4.6,0],[126,4.6,0]], 4);     // the ride line

  platform(G, 131, ROOF, 0, 3.6, 3, ROOF_C);                   // R3 (129.2..132.8)
  // TWO brooms, offset clocks: one sweeps ACROSS R3 (leap it on the walkway), one sweeps the R3→R4 GAP
  // (time the crossing). An eave spider drops onto the far roof R4 — the escalate's three-lane pressure.
  G.ents.add(new BroomZoomer(G, 131, ROOF, 0, {baseY:ROOF, range:2.0, speed:6.0, phase:0.0}));   // R3 walkway sweep 129..133
  G.ents.add(new BroomZoomer(G, 135, ROOF, 0, {baseY:ROOF, range:1.8, speed:5.6, phase:2.0}));   // R3→R4 gap sweep 133.2..136.8
  platform(G, 138, ROOF, 0, 3.4, 3, ROOF_C);                   // R4 (136.3..139.7) — same-height gap 3.5 (tap ≤4)
  G.ents.add(new Spider(G, 138, 7.5, 0, {groundY:ROOF}));      // eave drop onto R4
  G.ents.add(new Heart(138, 4.8, 0));
  candyLine(G, [[132.8,4.6,0],[135,4.6,0],[137,4.6,0]], 4);

  // Act-3 deco (baked): the tall huts the ferry threads between + eave webs + foreground jewels
  const decoC = new THREE.Group();
  decoC.add(witchHut(120, -1.4, 1.25), witchHut(131, -3.0, 1.0), witchHut(138, -1.3, 1.2));
  for(let i=0;i<4;i++) decoC.add(braidedTree(rand(113,139), rand(-8,-4.6), rand(1.1,1.6)));
  decoC.add(hangingWeb(138, 5.4, 1.1));
  decoC.add(mushroomCluster(126, 2.7, 0.8), potionBottle(133, 2.5));
  S.add(bakeGroup(decoC));
  addWisp(124, 3.4, -2.4); addWisp(135, 4.0, -2.8);

  // =================== ACT 4 — THE TALL GABLE (x 140..200) : MASTER — climb, then the last ferry ===================
  groundX(G, 140, 158, GND);                                   // the landing/staging bay
  G.ents.add(new BroomZoomer(G, 147, 0.15, 0, {baseY:0.15, range:3, speed:6.0, phase:0}));   // ground sweep 144..150 — a leap to shake off the roofs
  candyLine(G, [[141,1.0,0],[144,0.9,0],[150,0.9,0]], 5);
  G.ents.add(new Checkpoint(155, 0, 1.4, 3, {noLight:true}));   // CP3 — solid ground before the web-climb + void + final mover
  signPost(G, 154, 1.8, -0.2, 'The tall gable-hut. Climb the web to its high porch, then ride the last ferry to the way out — everything you learned, all at once now.');
  w3l4Bog(G, 158, 178);                                        // void beneath the climb + the last ferry

  // THE WEB CLIMB (climbing is FUN): grab the giant web (press up), climb, boosted-hop east onto the HIGH
  // porch. A y=5.6 porch is unreachable by any floor jump — the climb is the gate, telegraphed by candy.
  w3Web(G, 160, 0.5, 6.2, 0, 3);                               // climbable web 158.5..161.5, y 0.5..6.2
  platform(G, 164, HIGH, 0, 3.4, 3, ROOF_C);                   // HP high porch (162.3..165.7)
  G.ents.add(new Spider(G, 164, 8.6, 0, {groundY:HIGH}));      // the gable eave drops onto the high porch
  G.ents.add(new Heart(164, 6.4, 0));                          // the climber's reward
  candyLine(G, [[160,3.0,0],[160,5.5,0],[161.6,6.2,0],[164,6.0,0]], 6);   // candy traces the climb + the boosted hop

  // THE LAST FERRY — surface = fn.y+0.5 = 4.8. Board from HP (drop 5.6→4.8) at its LEFT extreme; step off
  // onto R5 (drop 4.8→4.0) at its RIGHT extreme. A broom sweeps ACROSS R5 — leap it the instant you land.
  G.world.addMover(3, 0.5, 3, t=>new THREE.Vector3(170 + Math.sin(t*0.85)*3.0, 4.3, 0), ferryPlank(3));
  candyLine(G, [[166,5.4,0],[170,5.2,0],[173,4.8,0]], 4);
  platform(G, 178, ROOF, 0, 3.6, 3, ROOF_C);                  // R5 landing roof (176.2..179.8)
  G.ents.add(new BroomZoomer(G, 178, ROOF, 0, {baseY:ROOF, range:2.2, speed:6.2, phase:0}));   // R5 walkway sweep 175.8..180.2

  // descend R5 → the exit lane (drop onto ground, safe), one last ground broom, then the way out
  groundX(G, 178, 200, GND);
  G.ents.add(new BroomZoomer(G, 187, 0.15, 0, {baseY:0.15, range:4, speed:6.0, phase:1.0}));   // final ground sweep 183..191
  candyLine(G, [[180,3.4,0],[182,1.0,0],[186,1.6,0],[190,0.9,0]], 6);
  signPost(G, 193, 1.8, 0.2, 'The way out. One last hop — then go relight the night, Pip.');

  // Act-4 deco (baked): the tall gable-hut over the climb, huts down the exit lane, foreground jewels
  const decoD = new THREE.Group();
  decoD.add(witchHut(163, -1.5, 1.4), witchHut(176, -3.0, 1.05), witchHut(188, -1.3, 1.1));   // 163 = the gable the web hangs from
  for(let i=0;i<5;i++) decoD.add(braidedTree(rand(141,199), rand(-8,-4.4), rand(1.0,1.5)));
  for(let i=0;i<5;i++) decoD.add(mushroomCluster(rand(141,199), rand(-3.0,3.0), rand(0.7,1.1)));
  decoD.add(hangingWeb(164, 6.4, 1.2));                        // the gable eave web (drop-spider tell)
  decoD.add(mushroomCluster(150, 2.6, 0.9), potionBottle(184, 2.4), grave(196, 2.6));
  S.add(bakeGroup(decoD));
  addWisp(150, 2.8, -2.6); addWisp(184, 3.0, -2.4);
  G.ents.add(new Crow(184, 0.15, -2.6));

  exitGate(G, 196);
  // (the bog voids are dressed + splash-registered by w3l4Bog/brewBed above)

  // ---- tail: ambience + bats + clutter (clutter on SOLID spans only — never floating over a void) ----
  w3LevelFinish(G, -14, 205, null);          // spores/potion-motes/fireflies + bats; theme=null keeps kit clutter off the gaps
  w3Clutter(G, -8, 55, 'forest');            // act 1 lane + act-2 staging (continuous solid)
  w3Clutter(G, 78, 111, 'forest');           // the hut courtyard + act-3 staging
  w3Clutter(G, 141, 157, 'forest');          // the act-4 landing bay
  w3Clutter(G, 179, 199, 'forest');          // the exit lane
  return {spawnX: 0, exitX: 196};
}

function updateW3L4(G, dt){ updateLevelCommon(G, dt); }
W3_LEVELS.push({id:'w3l4', district:'w3', name:'WITCH-HUT ROW', build:buildW3L4, update:updateW3L4, parTime:160});

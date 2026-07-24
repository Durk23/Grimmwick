// ============ W1-L2 — PUMPKIN FIELD ============
// ~4-minute course. The kishotenketsu of the BOUNCY-GOURDS+MUD gimmick fills x -6..96, then a
// FRESH ACT — THE OLD MILL (a working windmill you ride the turning sails up) — carries x 96..158,
// before the master-beat bounce-run FINALE at x 159..172.
//   ACT 1 (x -6..38, the original slice, intact): introduce — gourds as stepping-bounces over
//     two mud pits, the elevated HIGH ROAD, and the Old Shortcut warp island (untouched).
//   TRANSITION (x 38..53): the field gate — breather, sign, checkpoint, shield before the deep field.
//   ACT 2A (x 54..76): escalate — the MUD LAKE, crossed by a 4-gourd bounce-CHAIN with candy
//     tracing every arc; twist — a SwoopBat patrols the arcs and a Hopper times the far landing.
//     The high road reaches out over the lake and ends at a heart ledge (mega-bounce risk branch).
//   ACT 2B (x 76..96): breathe — the scarecrow flats: crop rows, union-meeting scarecrows,
//     a windmill turning on the skyline, one patrolling Skelly, and a coffin in a CLEAR PATCH
//     (clear-patch law: no patrol route within ~6u — opening it is a deliberate, safe act).
//   ACT 3 · THE OLD MILL (x 96..158) — THE NEW IDEA: not gourds, not mud — RIDE THE TURNING SAILS.
//     Four sail-platforms sweep a slow vertical wheel on a fixed deterministic clock. It is a ROUTE
//     CHOICE: climb the mill's gear-chain and ride the sails up to the loft (harder, richer — a
//     heart, bat wings, candy), or take the low road round the back at ground level (safe, plain).
//     The roads cross in plain sight UNDER the wheel (the low-roader sees the loft candy overhead),
//     a wind-caught sail glides you back down, and both rejoin for one lively run to the gate. CP4
//     sits right before the movers (walk-back over movers is misery). Grain-sacks keep it springy.
//   FINALE (x 159..172): master — one clean rising bounce-run over the mud, under a swooping bat,
//     straight through the relight arch. Threat budget stays in the D1 band: chaos = motion, not gangs.
function buildW1L2(G){
  const S = G.scene;
  levelBegin(G);

  // little farmhand: same geometry the original scarecrow shipped with, parameterized for the flats
  const scarecrowAt = (px, pz, ry=0, s=1)=>{
    const g = new THREE.Group();
    const sPole = mesh('cyl',[0.08*s,0.1*s,2.4*s,6], mat(PAL.woodD)); sPole.position.y=1.2*s;
    const sArms = mesh('cyl',[0.06*s,0.06*s,2*s,5], mat(PAL.woodD)); sArms.rotation.z=Math.PI/2; sArms.position.y=1.7*s;
    const sHead = pumpkinDeco(0,0,0.9*s,true); sHead.position.y=1.9*s;
    const sCoat = mesh('cone',[0.7*s,1.2*s,6], mat(0x6b4a2e)); sCoat.position.y=1.1*s;
    g.add(sPole,sArms,sCoat,sHead);
    g.position.set(px,0,pz); g.rotation.y=ry;
    return g;
  };

  // ================= ACT 1: Pumpkin field (x -6..38) — the original slice, intact =================
  groundX(G, -6, 176, 0x49603f);   // one continuous farm floor under the whole 4-min course (mud pits sit on top)
  signPost(G, -4.5, 1.8, -0.3, 'Giant pumpkins are EXTRA bouncy. Ground pound one for a MEGA bounce... and keep your eyes open up there.');
  G.ents.add(new BonkLantern(G, -3, 1.3, 0, 'moon'));
  mudPitX(G, 6.5, 7); // pulled off the spawn pad (was 0..10 pre-rebase) — fair start
  // gourds sit IN the mud as stepping-bounces — clear 3-unit runway from spawn (flow rule)
  bigPumpkin(G, 4.8, -0.5, 0, 1.5);
  bigPumpkin(G, 8.2, -0.5, 0, 2.0);
  mudPitX(G, 23, 14);
  bigPumpkin(G, 19, -0.5, 0, 1.8);
  bigPumpkin(G, 25, -0.5, 0, 1.5);
  G.ents.add(new Hopper(G, 11, 0, 0, {aggroR:6})); // guards the mud-pit landing — spawn runway stays calm
  G.ents.add(new Hopper(G, 16.5, 0, 0));
  G.ents.add(new Hopper(G, 32, 0, 0, {aggroR:10}));
  G.ents.add(new Boo(G, 6, 0, 0, {speed:2.2}));
  G.ents.add(new Boo(G, 28, 0, 0, {speed:2.4}));
  G.ents.add(new Skelly(G, 15, 0, 0, {px:2.5}));
  G.ents.add(new SwoopBat(G, 30, 4.5, 0, {range:5}));   // air pressure over the second mud crossing
  G.ents.add(new Rat(G, 24, 0, 0));                     // mud-edge scavenger
  G.ents.add(new Boo(G, 38, 0, 0, {speed:2.3}));
  G.ents.add(new Heart(13.5, 1.2, 0));
  G.ents.add(new Checkpoint(12.5, 0, 1.6, 0));
  const decoB = new THREE.Group();
  fenceRun(decoB, -6, -3.4, 46, -3.4, 21);
  for(let i=0;i<9;i++) decoB.add(pumpkinDeco(rand(-5,36), rand(-3,-1.8), rand(0.5,1), rand(0,1)<0.35));
  for(let i=0;i<2;i++) decoB.add(pumpkinDeco(rand(39,45), rand(-3,-1.8), rand(0.5,0.9), rand(0,1)<0.35));
  for(let i=0;i<4;i++) decoB.add(deadTree(rand(-4,36), rand(-7.5,-4.5), rand(0.9,1.3)));
  decoB.add(scarecrowAt(29, -2.6));
  S.add(bakeGroup(decoB));
  hayBale(G, 33, 0, 0, 2, 1.2, 1.6);
  platform(G, 36, 2.9, 0, 2.6, 3, 0x4a3a6e);
  G.ents.add(new GoldPumpkin(36, 4.1, 0, 0));
  G.ents.add(new Checkpoint(37, 0, 1.6, 1));
  // ambient life: a crow right by the spawn fence
  G.ents.add(new Crow(-0.5, 0.95, -2.6));

  // ===== HIGH ROAD: elevated route above the pumpkin field (harder, richer) =====
  // enter via the web-net at -3 (or mega-bounce) — exits at the gold-pumpkin ledge (x36)
  platform(G, -3, 2.9, 0, 2.6, 3, 0x5a4066);   // was 3.2 — exactly at the double-jump ceiling (owner rule: margin, never exact)
  platform(G, 2.5, 4.2, 0, 2.4, 3, 0x5a4066);
  platform(G, 8, 5.0, 0, 2.6, 3, 0x5a4066);
  platform(G, 14, 5.5, 0, 3.0, 3, 0x5a4066);
  platform(G, 20, 3.4, 0, 2.4, 3, 0x5a4066);   // bridges 14→26 by DUCKING UNDER the warp island — at 5.8 the physics top-snap (≤1.0u) teleported you onto the island and auto-warped
  platform(G, 26, 4.7, 0, 2.6, 3, 0x5a4066);
  platform(G, 32, 3.8, 0, 2.4, 3, 0x5a4066);
  G.ents.add(new Boo(G, 14, 6.0, 0, {speed:2.0}));   // floater fits the narrow platform — a hopper would hop off and hover the void
  G.ents.add(new Boo(G, 26, 4.2, 0, {speed:2.2, range:9}));
  G.ents.add(new Spider(G, 20, 8.4, 0, {groundY:6.8}));   // drops onto the warp island's top, not through it
  candyLine(G, [[-3,4.4,0],[2.5,5.4,0],[8,6.2,0]], 6);
  candyLine(G, [[14,6.7,0],[26,5.9,0],[32,5,0]], 6);
  G.ents.add(new Heart(8, 6.4, 0));

  // climbable web-net: an honest way up to the high road
  buildWebNet(G, -3, 0.4, 1.8, 3.4);

  // ===== THE OLD SHORTCUT: floating island high above the pumpkin field =====
  platform(G, 22, 6.8, 0, 4.4, 4.4, 0x4a3a6e);
  const wpL = mesh('box',[0.45,3,0.45], mat(0x38294f)); wpL.position.set(20.9,8.3,-1);
  const wpR = wpL.clone(); wpR.position.x=23.1;
  const wpT = mesh('box',[2.9,0.5,0.6], mat(0x38294f)); wpT.position.set(22,9.9,-1); crook(wpT,0.05);
  S.add(wpL,wpR,wpT);
  const warpPm = new THREE.MeshBasicMaterial({color:PAL.purpleFx, transparent:true, opacity:0.4, side:THREE.DoubleSide});
  const warpPortal = new THREE.Mesh(geo('plane',2.1,2.9), warpPm);
  warpPortal.position.set(22,8.3,-1);
  S.add(warpPortal);
  G.warpPortal = warpPortal;
  const wl = new THREE.PointLight(0xb37dff, 50, 13); wl.position.set(22,8.6,0); S.add(wl);
  const wflame = mesh('sph',[0.2,7,6], emat(PAL.purpleFx,PAL.purpleFx,1)); wflame.position.set(22,7.6,0.6); S.add(wflame);
  G.world.addBox(22, 6.8, 0, 2.2, 2.8, 2.5, {type:'trigger', onTouch:()=>{
    if(G.state!=='play' || G._warpUsed) return;
    G._warpUsed = true;
    AUDIO.portal(); AUDIO.goldPumpkin();
    G.fx.spawn(new THREE.Vector3(22,7.8,0), PAL.purpleFx, 24, {speed:4, life:0.8});
    G.addCandy(35);
    G.completeLevel({warp:true});
  }});

  // ================= TRANSITION: the field gate (x 38..53) — breather before the deep field =================
  candyLine(G, [[40,0.8,0],[44,0.8,0]], 4);
  G.ents.add(new Rat(G, 42, 0, 0)); // candy-thief on the old victory lap — keep it lively
  signPost(G, 49.2, 1.8, -0.3, 'THE DEEP FIELD. The gourds grow wild out here — bounce the chain, never wade. Mud ruins sneakers AND evenings. — Farmhand Maud');
  candyLine(G, [[47,0.8,0],[51,0.8,0]], 4);
  G.ents.add(new Checkpoint(51.5, 0, 1.6, 2));   // the lake lantern — death in the deep field never re-runs Act 1
  G.ents.add(new BonkLantern(G, 52.7, 1.3, 0, 'shield'));   // armor up before the crossing

  // ===== HIGH ROAD EXTENSION: reaches into the deep field, crossing over the low road =====
  // JUNCTION: the whole run 41..65 floats directly over the gate + lake start — a low-roader at
  // the checkpoint stands under this candy and SEES next run's route (the "I'm going up there" itch)
  platform(G, 41, 3.4, 0, 2.4, 3, 0x5a4066);
  platform(G, 46, 4.0, 0, 2.4, 3, 0x5a4066);
  platform(G, 51, 4.6, 0, 2.4, 3, 0x5a4066);
  platform(G, 56, 5.2, 0, 2.6, 3, 0x5a4066);
  platform(G, 60.5, 5.6, 0, 2.4, 3, 0x5a4066);
  G.ents.add(new BonkLantern(G, 46, 5.4, 0, 'candy'));   // the high road pays richer
  candyLine(G, [[41,4.6,0],[46,5.2,0],[51,5.8,0]], 5);
  candyLine(G, [[56,6.4,0],[60.5,6.8,0],[65,6.4,0]], 5);

  // ================= ACT 2A: THE MUD LAKE (x 54..76) — the gimmick escalated: a bounce-CHAIN =================
  mudPitX(G, 65, 22);   // mud is hazard-not-blocker: wading costs hearts, the gourds ARE the route
  bigPumpkin(G, 57,   -0.5, 0, 1.6);   // chain tops rise and fall: 0.81 → 1.22 → 0.73 → 1.47
  bigPumpkin(G, 61.5, -0.5, 0, 2.1);
  bigPumpkin(G, 66,   -0.5, 0, 1.5);
  bigPumpkin(G, 70.5, -0.5, 0, 2.4);
  // candy traces every arc — the trail IS the tutorial (collect-hunting teaches the route)
  candyLine(G, [[54.5,1.2,0],[57,2.3,0]], 3);
  candyLine(G, [[57,2.4,0],[59.3,4.4,0],[61.5,2.9,0]], 5);
  candyLine(G, [[61.5,2.9,0],[63.8,4.8,0],[66,2.3,0]], 5);
  candyLine(G, [[66,2.3,0],[68.3,4.3,0],[70.5,3.1,0]], 5);
  candyLine(G, [[70.5,3.1,0],[73.3,4.9,0],[76.5,1.4,0]], 5);
  // THE TWIST — the chain's sole air threat: a fixed-phase bat patrols the arcs. Its squeak is the
  // telegraph; its dive snapshots your position — keep bouncing and it whiffs behind you.
  G.ents.add(new SwoopBat(G, 63, 5.0, 0, {range:5.5, phase:0.9}));
  // RISK BRANCH: the heart ledge — where the high road ends, hanging over the middle of the chain.
  // Honest entry: the platform run above. Expert entry: pound-MEGA-bounce the big second gourd
  // (top 1.22 + ~6.4 mega apex — comfortable, never exact). A plain bounce can't reach: risk stays risk.
  platform(G, 65, 5.3, 0, 2.8, 3, 0x5a4066);
  G.ents.add(new Heart(65, 6.5, 0));

  // ================= ACT 2B: SCARECROW FLATS (x 76..96) — breathe, then tempt =================
  G.ents.add(new Hopper(G, 77.5, 0, 0, {aggroR:5.5}));   // times its hop against your final chain landing
  G.ents.add(new Crow(79.5, 0.95, -2.6));                // flaps off as you pass — the detail players FEEL
  candyLine(G, [[79,0.8,0],[84,0.8,0]], 4);
  signPost(G, 84.3, 1.8, 0.25, 'SCARECROW UNION LOCAL 13 — NIGHT MEETING IN PROGRESS. Please scream quietly.');
  // the meeting: two delegates sway in the night wind, out of phase (motion, not threats —
  // owner call: chaos is overlapping SYSTEMS, never enemy gangs)
  const swayA = scarecrowAt(82.5, -2.4, 0.3);
  const swayB = scarecrowAt(86, 2.3, 3.3);   // stands in the foreground crop row, facing the meeting
  S.add(swayA, swayB);
  G._w1l2Sway = [swayA, swayB];
  G.ents.add(new Skelly(G, 84, 0, 0, {px:2}));   // patrols the meeting (82..86) — the flats' one real guard
  candyLine(G, [[86.5,0.8,0],[90.5,0.8,0]], 4);
  // the temptation on the way out — pulsing red glow visible from the lake's far bank.
  // CLEAR-PATCH LAW: nearest patrol edges are the Skelly at 84 and the mill-yard Rat at 103 —
  // both ≥6u away; opening the lid is a deliberate act, never a drive-by ambush stack.
  const cofC = new CursedCoffin(92.5, 0, 1.8, -0.35);
  G.ents.add(cofC); G.coffins.push(cofC);
  G.world.addBox(92.5, 0, 1.8, 1.4, 0.9, 2.4, {});
  hayBale(G, 95, 0, 0, 2, 1.1, 1.6);   // the step up into the mill yard — sight-line to the sails ahead

  // ================= ACT 3 · THE OLD MILL (x 96..158) — the fresh idea: ride the turning sails =================
  // grain-sack bounce pad — the mill's springy sacks (bounce 12 ≈ 3.0u apex over the sack's 1.05 top)
  const grainSack = (px, pz, s=1, bounce=12)=>{
    const g = new THREE.Group();
    const sack = mesh('box',[1.2*s,1.0*s,1.2*s], mat(0xbfa46a)); sack.position.y=0.5*s;
    const neck = mesh('cyl',[0.24*s,0.4*s,0.42*s,7], mat(0xa88f52)); neck.position.y=1.02*s;
    const tie = mesh('tor',[0.28*s,0.06*s,5,9], mat(0x6b5a2e)); tie.rotation.x=Math.PI/2; tie.position.y=1.12*s;
    const seam = mesh('box',[1.24*s,0.05*s,0.05*s], mat(0x8a7440)); seam.position.set(0,0.5*s,0.61*s);
    g.add(sack,neck,tie,seam);
    g.position.set(px,0,pz); crook(g,0.03);
    G.scene.add(g);
    G.world.addBox(px, 0, pz, 1.2*s, 1.05*s, 1.2*s, {type:'bounce', bounce});
    return g;
  };

  // ---- MILL YARD APPROACH (x 96..110) ----
  signPost(G, 100.5, 1.8, -0.3, 'THE OLD MILL still turns on the night wind. Ride the sails up to the loft for the good stuff — or take the low road round the back if you value your sneakers. — Farmhand Maud');
  G.ents.add(new Rat(G, 103, 0, 0));                    // a grain-mill rat — thematic thief; steals loose candy only
  candyLine(G, [[97,0.8,0],[99,0.8,0]], 3);
  grainSack(G, 106, 0);                                 // springy sack — bounce for the overhead candy (teaches the bounce, safely)
  candyLine(G, [[105.5,2.6,0],[106.5,3.4,0],[107.5,2.6,0]], 3);
  G.ents.add(new Checkpoint(108, 0, 1.6, 3, {noLight:true}));   // CP4 (NEW) — before the mill's movers; noLight keeps the level at 6 real lights
  G.ents.add(new BonkLantern(G, 109.5, 1.3, 0, 'shield'));   // armor up for the climb + the ride

  // ---- THE JUNCTION: low road round the back vs. up through the mill (x 110..131) ----
  // LOW ROAD (safe, plain): stays on the ground at y=0, straight under the wheel, to the rejoin (~131).
  G.ents.add(new Boo(G, 118, 0.4, 0, {speed:2.0, range:6}));   // drifts under the wheel on the low road
  G.ents.add(new Crow(126, 0.95, -2.6));                       // low-road ambient life — no dead stretch
  candyLine(G, [[112,0.8,0],[116,0.8,0]], 3);
  candyLine(G, [[121,0.8,0],[128,0.8,0]], 4);

  // ---- HIGH ROAD: the gear-chain climb + the loft (owner rule 6a: climbing is fun, not a chore) ----
  const gearChain = (px, pz, h)=>{
    const g = new THREE.Group();
    for(let y=0.4; y<h; y+=0.55){                       // the drive chain — links the player grabs
      const lk = mesh('tor',[0.11,0.045,4,8], mat(0x6b5a44));
      lk.position.set(px, y, pz); lk.rotation.x = (Math.round(y/0.55)%2)?0:Math.PI/2;
      g.add(lk);
    }
    for(const gy of [1.4, 3.6, 5.6]){                   // cog wheels the chain runs over
      const cog = mesh('cyl',[0.5,0.5,0.16,9], mat(0x5a4a3a)); cog.rotation.x=Math.PI/2; cog.position.set(px-0.02,gy,pz-0.1);
      for(let k=0;k<8;k++){ const th=mesh('box',[0.14,0.14,0.16], mat(0x6b5a44)); const a=k/8*TAU; th.position.set(px-0.02+Math.cos(a)*0.56, gy+Math.sin(a)*0.56, pz-0.1); g.add(th); }
      g.add(cog);
    }
    G.scene.add(bakeGroup(g));
    return G.world.addBox(px, 0, pz, 1.1, h, 1.2, {type:'climb'});   // press UP to grab — the low road walks past it
  };
  gearChain(114, 0, 6.0);
  platform(G, 116, 6.0, 0, 2.4, 3, 0x4a3a55);           // G1 — the gear landing, offset from the climb (jump off the top onto it, w1l4-style)
  candyLine(G, [[114,1.6,0],[114,3.4,0],[114,5.2,0]], 3);   // rhythm candy up the climb
  candyLine(G, [[115,6.6,0],[116.8,6.8,0],[118.4,7.6,0]], 3);   // the climb-exit hop onto G1, then onto an ascending sail

  // ---- THE TURNING SAILS: four sail-platforms on a slow vertical wheel (x 117..123) ----
  // Deterministic clock: hub (120, 5.7 collider), radius 2.4, ω 0.5 rad/s CLOCKWISE (θ = phase − t·0.5).
  // Sails ASCEND on the left (board from G1), and vertical speed → 0 at the TOP (a clean hover). Envelope
  // SURFACES (fn.y+0.45): bottom 3.75 · left 6.15 · TOP 8.55 · right 6.15. Board step G1→left = +0.15;
  // dismount top→loft = +0.65 (a tap); the low road clears the 3.3 underside (head 1.25). Comparable-heights ✓.
  const sailMesh = ()=>{
    const g = new THREE.Group();
    const board = mesh('box',[2.0,0.45,2.4], mat(0x6b5844)); board.position.y=0.225;   // local [0,0.45] → visual top = collider top
    const canvas = mesh('box',[1.86,0.06,1.9], emat(0xe6dcb8, 0xcbbd8a, 0.25)); canvas.position.y=0.5;
    const rib = mesh('box',[0.1,0.06,2.0], mat(0x4a3d33)); rib.position.y=0.53;
    g.add(board, canvas, rib);
    G.scene.add(g); return g;
  };
  for(const ph of [0, Math.PI/2, Math.PI, Math.PI*1.5]){
    G.world.addMover(2.0,0.45,2.4, t=> new THREE.Vector3(120 + Math.cos(ph - t*0.5)*2.4, 5.7 + Math.sin(ph - t*0.5)*2.4, 0), sailMesh);
  }

  // ---- THE LOFT (top-of-mill vista, surface 9.2) — the reward for the harder road ----
  platform(G, 120.5, 9.2, 0, 3.6, 3, 0x4a3a55);         // sits just above the sails' top point (no overlap): 8.7 > 8.55
  G.ents.add(new Heart(119.4, 9.9, 0));
  G.ents.add(new BonkLantern(G, 121.6, 9.5, 0, 'bat'));   // BAT WINGS — glide the descent (or anywhere): a high-road prize
  candyLine(G, [[120,8.7,0],[120,9.05,0]], 2);          // bridges the top→loft dismount hop
  candyLine(G, [[119.4,9.9,0],[120.5,10.0,0],[121.6,9.9,0]], 4);
  G.ents.add(new Crow(120.5, 9.5, -2.4));                // a lookout crow shares the view (ambient)

  // ---- THE RIDE DOWN: a wind-caught sail glides you off the loft (x 123..131) ----
  // Diagonal mover, HOVERS at both extremes (clean board + dismount): upper-right (123, surf 9.1) beside
  // the loft ↔ lower-right (131, surf 1.9) at the rejoin. Period ~7.9s. Low road clears its 1.45 underside.
  const glideMesh = ()=>{
    const g = new THREE.Group();
    const board = mesh('box',[2.4,0.45,2.4], mat(0x6b5844)); board.position.y=0.225;
    const sail = mesh('box',[0.06,1.6,1.8], emat(0xe6dcb8, 0xcbbd8a, 0.25)); sail.position.set(-1.1,0.95,0); sail.rotation.z=0.22;
    g.add(board, sail);
    G.scene.add(g); return g;
  };
  G.world.addMover(2.4,0.45,2.4, t=> new THREE.Vector3(127 - Math.cos(t*0.8)*4, 5.05 + Math.cos(t*0.8)*3.6, 0), glideMesh);
  candyLine(G, [[123,8.4,0],[126,5.6,0],[129,3.2,0],[131,2.0,0]], 5);   // the descent line — trails teach the timing

  // ---- the playable mill body + its live sail-cross (visual; emissive window keeps the light budget) ----
  const millB = new THREE.Group();
  millB.add(mesh('cyl',[2.2,2.7,1.2,10], mat(0x565070)));                                  // stone base (placed below)
  millB.children[0].position.set(120,0.6,-2.5);
  const millBody = mesh('cyl',[1.9,2.6,7.0,10], mat(0x4a3a55)); millBody.position.set(120,3.5,-2.5);
  const millCap = mesh('cone',[2.2,1.8,10], mat(0x38294f)); millCap.position.set(120,7.9,-2.5);
  const winFrame = mesh('box',[1.15,1.35,0.16], mat(PAL.woodD)); winFrame.position.set(120,6.4,-0.6);
  const win = mesh('box',[0.9,1.1,0.14], emat(PAL.window, PAL.window, 0.9)); win.position.set(120,6.4,-0.55);
  millB.add(millBody, millCap, winFrame, win);
  S.add(bakeGroup(millB));
  const sails = new THREE.Group();
  sails.add(mesh('cyl',[0.55,0.55,0.3,10], mat(0x5a4a3a)).rotateX(Math.PI/2));             // hub cog
  sails.add(mesh('sph',[0.3,8,7], mat(PAL.woodD)));                                        // hub boss
  for(let i=0;i<4;i++){
    const pv = new THREE.Group(); pv.rotation.z = i*Math.PI/2;
    const arm = mesh('box',[0.18,2.4,0.12], mat(0x4a3d33)); arm.position.y=1.2; pv.add(arm);
    const latt = mesh('box',[0.7,1.6,0.04], emat(0xcbbd8a,0x9e9060,0.15)); latt.position.set(0.35,1.4,0); pv.add(latt);
    sails.add(pv);
  }
  sails.position.set(120, 5.925, -0.45);   // arm tips meet the sail-platforms (which ride at z=0)
  S.add(sails);
  G._w1l2Sails = sails;
  G._w1l2SailT0 = G.time;   // the movers' clock starts at 0 at build; offset the visual so the arms track the platforms

  // ---- REJOIN + RUN TO THE GATE (x 131..158) — both roads converge, one lively stretch ----
  G.ents.add(new Skelly(G, 136, 0, 0, {px:2}));
  candyLine(G, [[132.5,0.8,0],[135,0.8,0]], 3);
  grainSack(G, 140, 0);                                  // a bounce-chain flourish
  bigPumpkin(G, 143, -0.5, 0, 1.8);                      // a friendly gourd hop keeps momentum (the motif, no mud)
  candyLine(G, [[139.5,2.4,0],[141.5,3.4,0],[143,3.6,0],[145,2.6,0]], 5);
  G.ents.add(new SwoopBat(G, 147, 4.4, 0, {range:4.5, phase:0.5}));   // fixed-phase air threat — same flight every run
  G.ents.add(new Hopper(G, 152, 0, 0, {aggroR:5}));
  candyLine(G, [[149,0.8,0],[154,0.8,0]], 4);
  hayBale(G, 158.5, 0, 0, 2, 1.1, 1.6);                  // the finale launch step — sight-line to the arch arcs

  // ---- mill-act deco (x 96..158) — baked, one draw call; nothing over a mud span (there is none here) ----
  const decoM = new THREE.Group();
  fenceRun(decoM, 96, -3.4, 113, -3.4, 8);
  fenceRun(decoM, 128, -3.4, 158, -3.4, 14);
  for(let i=0;i<5;i++) decoM.add(deadTree(rand(97,157), rand(-8,-4.6), rand(0.9,1.4)));
  for(let i=0;i<4;i++) decoM.add(pumpkinDeco(rand(97,112), rand(-3,-1.9), rand(0.5,0.9), rand(0,1)<0.4));
  for(let i=0;i<4;i++) decoM.add(pumpkinDeco(rand(132,156), rand(-3,-1.9), rand(0.5,0.9), rand(0,1)<0.4));
  for(const [sx,sz] of [[103,2.5],[133,2.6],[150,2.4]]){   // foreground sack-stack silhouettes (z>0)
    const sk = mesh('box',[1.0,0.85,1.0], mat(0x8a7440)); sk.position.set(sx,0.42,sz); crook(sk,0.05); decoM.add(sk);
  }
  for(const [sx,sz] of [[116.5,-2.3],[117.6,-2.5],[124,-2.4]]){   // grain sacks piled at the mill base (deco)
    const sk = mesh('box',[0.9,0.8,0.9], mat(0xbfa46a)); sk.position.set(sx,0.4,sz); crook(sk,0.05); decoM.add(sk);
  }
  const cart = new THREE.Group();   // a wooden hand-cart in the yard
  const cbed = mesh('box',[1.8,0.3,1.0], mat(PAL.woodD)); cbed.position.y=0.7; cart.add(cbed);
  const cwA = mesh('cyl',[0.45,0.45,0.12,10], mat(0x2c2140)); cwA.rotation.x=Math.PI/2; cwA.position.set(-0.5,0.45,0.55); cart.add(cwA);
  const cwB = cwA.clone(); cwB.position.z=-0.55; cart.add(cwB);
  cart.position.set(99, 0, -2.6); decoM.add(cart);
  S.add(bakeGroup(decoM));

  // ================= FINALE: the last bounce-run (x 159..172) — one clean rising line into the arch =================
  mudPitX(G, 164, 8);
  bigPumpkin(G, 161.5, -0.5, 0, 1.7);
  bigPumpkin(G, 165.3, -0.3, 0, 2.1);   // rises toward the gate — the level ends going UP
  G.ents.add(new SwoopBat(G, 166, 4.6, 0, {range:3, aggroR:4.5, phase:1.6}));   // arch harasser — patrol 163..169, clear of the rejoin
  candyLine(G, [[159,2.0,0],[161.5,3.7,0],[163.4,4.4,0]], 4);
  candyLine(G, [[163.4,4.4,0],[165.3,4.8,0],[168.5,2.4,0]], 4);
  candyLine(G, [[169.2,0.9,0],[171,0.9,0]], 3);
  G.ents.add(new Crow(167.8, 0.95, -2.6));   // one last witness on the apron fence
  const decoF = new THREE.Group();
  fenceRun(decoF, 158, -3.4, 172, -3.4, 7);
  for(let i=0;i<2;i++) decoF.add(pumpkinDeco(rand(168.5,171.5), rand(-3,-1.9), rand(0.5,0.85), true));
  for(let i=0;i<2;i++) decoF.add(deadTree(rand(159,171), rand(-7.5,-4.8), rand(0.9,1.3)));
  S.add(bakeGroup(decoF));
  exitGate(G, 172);

  // ================= deep-field deco (x 48..111) — crop rows, fences, the windmill =================
  const decoC = new THREE.Group();
  fenceRun(decoC, 48, -3.4, 74, -3.4, 12);
  fenceRun(decoC, 78, -3.4, 95, -3.4, 10);   // stops at the flats' end — the mill yard has its own deco
  for(let i=0;i<4;i++) decoC.add(deadTree(rand(50,94), rand(-8,-4.6), rand(0.9,1.4)));
  // deco pumpkins NEVER in the mud spans — a bouncy-looking gourd in a hazard would read as a false route
  for(let i=0;i<2;i++) decoC.add(pumpkinDeco(rand(48,53), rand(-3,-1.9), rand(0.5,0.9), rand(0,1)<0.35));
  for(let i=0;i<5;i++) decoC.add(pumpkinDeco(rand(77,94), rand(-3,-1.8), rand(0.5,1), rand(0,1)<0.4));
  // foreground silhouettes (z>0) frame the flats — span stops short of the coffin's clear patch
  for(let i=0;i<4;i++) decoC.add(pumpkinDeco(rand(78,91), rand(2.2,3.1), rand(0.55,0.95), rand(0,1)<0.3));
  // crop rows — dry cornstalks in ranks behind and before the path
  for(const [rz,rx1,rx2] of [[-2.1,79,93],[-2.9,80,92],[2.35,81,91]]){
    for(let x=rx1; x<=rx2; x+=0.85){
      const st = mesh('cyl',[0.03,0.045,rand(1.0,1.3),4], mat(0x9a8a4e));
      st.position.set(x+rand(-0.12,0.12), 0.55, rz+rand(-0.12,0.12)); crook(st,0.08);
      const lf = mesh('cone',[0.06,rand(0.25,0.4),4], mat(0x7a7a3e));
      lf.position.set(st.position.x+rand(-0.1,0.1), rand(0.5,0.8), st.position.z);
      lf.rotation.z = rand(0.7,1.2)*(rand(0,1)<0.5?1:-1);
      decoC.add(st, lf);
    }
  }
  // stacked bales by the meeting
  const bale1 = mesh('box',[1.6,0.9,1.2], mat(0xc2a24f)); bale1.position.set(80.8,0.45,-2.5); crook(bale1,0.03);
  const bale2 = mesh('box',[1.3,0.8,1.1], mat(0xb5964a)); bale2.position.set(80.9,1.3,-2.5); bale2.rotation.y=0.3;
  decoC.add(bale1,bale2);
  // windmill tower (blades turn — see below)
  const mTower = mesh('cyl',[0.5,0.95,5.4,7], mat(0x4a3a55)); mTower.position.set(86,2.7,-8.6);
  const mCap = mesh('cone',[0.9,1.0,7], mat(0x38294f)); mCap.position.set(86,5.75,-8.6);
  decoC.add(mTower, mCap);
  // THE QUIET PROP (never signposted): the smallest scarecrow wears a hand-knit scarf —
  // and the only crow in Grimmwick that never flies away is perched on its arm.
  const little = scarecrowAt(91.8, -2.85, 0.35, 0.62);
  const scarf = mesh('box',[0.36,0.1,0.34], mat(0xa8323e)); scarf.position.y=1.04; little.add(scarf);
  const scarfTail = mesh('box',[0.1,0.34,0.06], mat(0xa8323e)); scarfTail.position.set(0.16,0.86,0.14); scarfTail.rotation.z=0.15; little.add(scarfTail);
  const pcB = mesh('sph',[0.11,7,6], mat(0x1c1826)); pcB.scale.set(1,0.9,1.3); pcB.position.set(0.5,1.13,0); little.add(pcB);
  const pcH = mesh('sph',[0.07,6,5], mat(0x1c1826)); pcH.position.set(0.5,1.22,0.1); little.add(pcH);
  const pcBk = mesh('cone',[0.025,0.09,4], mat(0xd9a02e)); pcBk.rotation.x=Math.PI/2; pcBk.position.set(0.5,1.21,0.2); little.add(pcBk);
  decoC.add(little);
  S.add(bakeGroup(decoC));
  // windmill blades — a separate live group so the skyline keeps moving (deterministic, time-driven)
  const mill = new THREE.Group();
  const hub = mesh('sph',[0.2,7,6], mat(PAL.woodD)); mill.add(hub);
  for(let i=0;i<4;i++){
    const pv = new THREE.Group(); pv.rotation.z = i*Math.PI/2;
    const bl = mesh('box',[0.16,2.4,0.05], mat(0x8a7d5a)); bl.position.y=1.25;
    pv.add(bl); mill.add(pv);
  }
  mill.position.set(86, 5.6, -8.45);
  S.add(mill);
  G._w1l2Mill = mill;

  // ambience spans the whole course; clutter is placed manually in segments so nothing
  // bakes over mud (a prop poking through goo reads as false ground)
  levelFinish(G, -6, 176, null);
  buildClutter(G, -6, 3, 'farm');
  buildClutter(G, 10, 16, 'farm');
  buildClutter(G, 30, 54, 'farm');
  buildClutter(G, 76, 96, 'farm');
  buildClutter(G, 96, 159, 'farm');    // the mill act — no mud span here, clutter is safe
  buildClutter(G, 168.5, 175, 'farm'); // after the finale mud (164, spans 160..168) — never over the goo
  return {spawnX:0, exitX:172};
}
function updateW1L2(G, dt){
  updateLevelCommon(G, dt);
  if(G.warpPortal) G.warpPortal.material.opacity = G._warpUsed?0.06:(0.3+Math.sin(G.time*2.6)*0.12);
  if(G._w1l2Mill) G._w1l2Mill.rotation.z = -G.time*0.55;
  if(G._w1l2Sails) G._w1l2Sails.rotation.z = -(G.time - (G._w1l2SailT0||0))*0.5;   // the playable wheel — synced to the sail-platform movers
  if(G._w1l2Sway) G._w1l2Sway.forEach((s,i)=>{ s.rotation.z = Math.sin(G.time*0.8 + i*2.1)*0.045; });
}
W1_LEVELS.push({id:'w1l2', district:'w1', name:'PUMPKIN FIELD', build:buildW1L2, update:updateW1L2, parTime:150});

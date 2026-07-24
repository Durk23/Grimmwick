// ============ W1-L2 — PUMPKIN FIELD ============
// Signature gimmick: BOUNCY GOURDS + MUD, given the full kishotenketsu arc across x -6..112:
//   ACT 1 (x -6..38, the original slice, intact): introduce — gourds as stepping-bounces over
//     two mud pits, the elevated HIGH ROAD, and the Old Shortcut warp island (untouched).
//   TRANSITION (x 38..53): the field gate — breather, sign, checkpoint, shield before the deep field.
//   ACT 2A (x 54..76): escalate — the MUD LAKE, crossed by a 4-gourd bounce-CHAIN with candy
//     tracing every arc; twist — a SwoopBat patrols the arcs and a Hopper times the far landing.
//     The high road reaches out over the lake and ends at a heart ledge (mega-bounce risk branch).
//   ACT 2B (x 76..96): breathe — the scarecrow flats: crop rows, union-meeting scarecrows,
//     a windmill turning on the skyline, one patrolling Skelly, and a coffin in a CLEAR PATCH
//     (clear-patch law: no patrol route within ~6u — opening it is a deliberate, safe act).
//   FINALE (x 96..112): master — one clean rising bounce-run under a swooping bat, straight
//     through the relight arch. Threat budget stays in the D1 band: chaos = motion, not gangs.
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
  groundX(G, -6, 112, 0x49603f);
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
  // CLEAR-PATCH LAW: nearest patrol edges are the Skelly at 86 and the finale bat at 99 —
  // both ≥6u away; opening the lid is a deliberate act, never a drive-by ambush stack.
  const cofC = new CursedCoffin(92.5, 0, 1.8, -0.35);
  G.ents.add(cofC); G.coffins.push(cofC);
  G.world.addBox(92.5, 0, 1.8, 1.4, 0.9, 2.4, {});
  hayBale(G, 95, 0, 0, 2, 1.1, 1.6);   // the launch step — sight-line to the finale arcs

  // ================= FINALE: the last bounce-run (x 96..112) — one clean rising line into the arch =================
  mudPitX(G, 100, 8);
  bigPumpkin(G, 97.5, -0.5, 0, 1.7);
  bigPumpkin(G, 101.3, -0.3, 0, 2.1);   // rises toward the gate — the level ends going UP
  G.ents.add(new SwoopBat(G, 102, 4.6, 0, {range:3, aggroR:4.5, phase:1.6}));   // arch harasser — patrol 99..105 stays 6u+ off the coffin patch
  candyLine(G, [[95,2.0,0],[97.5,3.7,0],[99.4,4.4,0]], 4);
  candyLine(G, [[99.4,4.4,0],[101.3,4.8,0],[104.5,2.4,0]], 4);
  candyLine(G, [[105.2,0.9,0],[107,0.9,0]], 3);
  G.ents.add(new Crow(103.8, 0.95, -2.6));   // one last witness on the apron fence
  exitGate(G, 108);

  // ================= deep-field deco (x 48..111) — crop rows, fences, the windmill =================
  const decoC = new THREE.Group();
  fenceRun(decoC, 48, -3.4, 74, -3.4, 12);
  fenceRun(decoC, 78, -3.4, 108, -3.4, 14);
  for(let i=0;i<4;i++) decoC.add(deadTree(rand(50,106), rand(-8,-4.6), rand(0.9,1.4)));
  // deco pumpkins NEVER in the mud spans — a bouncy-looking gourd in a hazard would read as a false route
  for(let i=0;i<2;i++) decoC.add(pumpkinDeco(rand(48,53), rand(-3,-1.9), rand(0.5,0.9), rand(0,1)<0.35));
  for(let i=0;i<5;i++) decoC.add(pumpkinDeco(rand(77,94), rand(-3,-1.8), rand(0.5,1), rand(0,1)<0.4));
  for(let i=0;i<2;i++) decoC.add(pumpkinDeco(rand(104.5,107.5), rand(-3,-1.9), rand(0.5,0.85), true));
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
  levelFinish(G, -6, 112, null);
  buildClutter(G, -6, 3, 'farm');
  buildClutter(G, 10, 16, 'farm');
  buildClutter(G, 30, 54, 'farm');
  buildClutter(G, 76, 96, 'farm');
  buildClutter(G, 104, 111, 'farm');
  return {spawnX:0, exitX:108};
}
function updateW1L2(G, dt){
  updateLevelCommon(G, dt);
  if(G.warpPortal) G.warpPortal.material.opacity = G._warpUsed?0.06:(0.3+Math.sin(G.time*2.6)*0.12);
  if(G._w1l2Mill) G._w1l2Mill.rotation.z = -G.time*0.55;
  if(G._w1l2Sway) G._w1l2Sway.forEach((s,i)=>{ s.rotation.z = Math.sin(G.time*0.8 + i*2.1)*0.045; });
}
W1_LEVELS.push({id:'w1l2', district:'w1', name:'PUMPKIN FIELD', build:buildW1L2, update:updateW1L2, parTime:110});

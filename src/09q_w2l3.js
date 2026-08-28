// ============ LEVEL 2-3 — THE BELL TOWER (District 2 · Ravenmoor Cemetery) ============
// The district's CLIMBING SHOWCASE and the DESCENT from the surface graveyard into the
// CATACOMBS. Signature gimmick: CHAIN & BELL-ROPE CLIMBING, played as a playful DOWNWARD
// journey (introduce -> twist -> escalate -> master):
//   ACT 1 THE BELFRY (surface, y+5..0) — the tower fell; its great bell dropped into the
//         earth. Learn the descent: step down broken beams, catch the FIRST CHAIN, drop to
//         the belfry base. Gentle. (INTRODUCE the grab/hold-down/leap-off verbs.)
//   ACT 2 THE TOWER SHAFT (y0..-2) — the hollow shaft. BRANCHING: a brave chain drops PAST
//         the obvious ledge into a hidden alcove (the Golden Pumpkin); a BELL-ROPE SWING
//         carries you over a stalagmite pit (climb -> leap-off boost). A Restless Urn waits
//         in a clear pocket. (TWIST: route choice + rope swing + air steer.)
//   ACT 3 THE CATACOMBS + UNDERGROUND RIVER (y-2..-3) — full cave now: crystals, wisps in
//         the dark, a glowing river below a void gap crossed on BOBBING CRYSTAL SLABS on a
//         fixed clock, rope in / chain out. A lit lantern is your safe rest. (ESCALATE:
//         rung-timing over hazards, darkness.)
//   ACT 4 THE FALLEN BELL (y-3 -> 0) — the great bell rests at the bottom by the old
//         bell-ringer who rode it down. The MASTER beat: climb the grand bell-rope UP out of
//         the dark to the catacomb passage onward. (MASTER: one triumphant climb.)
// Trends DOWNWARD as it goes +X; surface parallax up top, cave parallax below; because the
// player descends below y=0, G.camMinY is lowered so the side camera follows down (w1l1's
// crypt used -3.5; our lowest walkable floor is -3, river void beneath, so we use -5).
// Uses the D2 kit (09n_w2kit): w2Chain/w2BellRope climb volumes, w2Lantern/w2DarkLantern
// light pools (Wisp repel), RestlessUrn gamble, undergroundRiver, cave deco, w2LevelFinish.

// baked catacomb clutter at an arbitrary FLOOR height (the kit's w2Clutter assumes y~0) —
// bones, cave pebbles, glow-crystal shards, baby stalagmites. Split around any void by caller.
function _w2l3Clutter(G, x1, x2, floorY){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.3);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.6,2.6), r=rand();
    if(r<0.34){ const b=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); b.rotation.z=Math.PI/2; b.rotation.y=rand(TAU); b.position.set(x,floorY+0.05,z); g.add(b); }
    else if(r<0.58){ const rk=mesh('sph',[rand(0.1,0.2),6,5], mat(W2PAL.caveWallL)); rk.position.set(x,floorY+0.07,z); rk.scale.y=0.6; g.add(rk); }
    else if(r<0.8){ const cc=pick([W2PAL.crystal,W2PAL.crystalV,W2PAL.crystalP]); const cr=mesh('cone',[0.05,rand(0.2,0.45),5], emat(cc,cc,0.9)); cr.position.set(x,floorY+0.14,z); cr.rotation.z=rand(-0.4,0.4); g.add(cr); }
    else { const st=mesh('cone',[rand(0.1,0.16),rand(0.25,0.5),5], mat(W2PAL.caveWallL)); st.position.set(x,floorY+0.15,z); crook(st,0.06); g.add(st); }
  }
  G.scene.add(bakeGroup(g));
}
// baked cold-graveyard clutter for the surface ledges (moss tufts, bones, tiny crosses).
function _w2l3SurfClutter(G, x1, x2, floorY){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.3);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.4,2.4), r=rand();
    if(r<0.34){ const rk=mesh('sph',[rand(0.1,0.2),6,5], mat(0x4a4860)); rk.position.set(x,floorY+0.07,z); rk.scale.y=0.6; g.add(rk); }
    else if(r<0.6){ const b=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); b.rotation.z=Math.PI/2; b.rotation.y=rand(TAU); b.position.set(x,floorY+0.05,z); g.add(b); }
    else if(r<0.82){ const tf=mesh('cone',[0.08,rand(0.2,0.4),4], mat(W2PAL.moss)); tf.position.set(x,floorY+0.16,z); crook(tf,0.25); g.add(tf); }
    else { const cr=new THREE.Group(); const v=mesh('box',[0.06,0.32,0.06], mat(W2PAL.stoneD)); const hb=mesh('box',[0.2,0.06,0.06], mat(W2PAL.stoneD)); hb.position.y=0.07; cr.add(v,hb); cr.position.set(x,floorY+0.17,z); crook(cr,0.15); g.add(cr); }
  }
  G.scene.add(bakeGroup(g));
}

function buildW2L3(G){
  const S = G.scene;
  levelBegin(G);
  // start high in the belfry and let the camera follow the descent below y=0
  G.spawnPoint.set(0, 5.6, 0);
  G.camMinY = -5;              // lowest walkable floor is -4 (GP alcove) — camera tracks the descent down
  G.world.killY = -8;          // snappier river/pit falls (nothing walkable is below -4); fall = 1 heart + checkpoint
  G.lightPools = [];          // D2 darkness contract: lit lanterns push {x,z,r}; Wisps read this

  // ================= ACT 1 — THE BELFRY (x -3..24, y +5..0.6) =================
  // The crumbling top of the bell tower, on the surface. Its bell already fell into the earth.
  // A gentle first descent: broken beams, then the first CHAIN down to the belfry base.

  // belfry deck (spawn stands here)
  platform(G, 3.5, 5, 0, 12, 5, W2PAL.stone);
  S.add(bakeGroup((()=>{ const g=new THREE.Group();     // deck trim + moss (baked deco)
    for(let x=-2; x<9; x+=1.6){ const plank=mesh('box',[1.4,0.1,4.6], mat(W2PAL.stoneD)); plank.position.set(x,5.02,0); g.add(plank); }
    g.add(weepingStatue(-1.4,-1.9)); g.children[g.children.length-1].position.y=5;   // a grieving angel keeps watch on the deck
    return g; })()));
  // the empty bell-yoke where the great bell used to hang (deco) + a snapped chain dangling
  { const frame=new THREE.Group();
    for(const px of [1.2,5.8]){ const post=mesh('box',[0.34,4.2,0.34], mat(W2PAL.iron)); post.position.set(px,7.1,-1.3); frame.add(post); }
    const beam=mesh('box',[5.2,0.4,0.4], mat(W2PAL.iron)); beam.position.set(3.5,9.0,-1.3);
    const yoke=mesh('cyl',[0.16,0.16,3.6,6], mat(W2PAL.iron)); yoke.rotation.z=Math.PI/2; yoke.position.set(3.5,8.6,-1.3);
    frame.add(beam,yoke);
    const roofL=mesh('box',[3.4,0.3,3], mat(W2PAL.caveWallD)); roofL.position.set(2.0,9.7,-1.3); roofL.rotation.z=0.32;
    const roofR=mesh('box',[3.4,0.3,3], mat(W2PAL.caveWallD)); roofR.position.set(5.0,9.7,-1.3); roofR.rotation.z=-0.32;
    frame.add(roofL,roofR);
    S.add(bakeGroup(frame)); }
  // left back-wall so you never walk off the belfry behind spawn
  G.world.addBox(-3.8, -8, 0, 1.5, 22, 12, {});
  signPost(G, 1.2, 5.6, -0.15, INPUT.isTouch ?
    'THE BELL TOWER fell into the earth. Follow it DOWN: touch a chain or rope and hold DOWN to climb down, UP to climb, JUMP to leap off.' :
    'THE BELL TOWER fell into the earth. Follow it DOWN: grab a chain/rope (UP) and hold DOWN to descend - hold UP to climb - SPACE to leap off.');
  G.ents.add(new Checkpoint(7, 5, 0, 0, {noLight:true}));   // CP0 — before the first chain
  G.ents.add(new Gravemite(G, 5.5, 5, 0, {range:2.2, axis:'x'}));
  G.ents.add(new Crow(8.2, 5.2, -2.2));                     // ambient — flaps off the belfry rail as you approach

  // the surface air-lane threat: a crow that dive-bombs the descent on a fixed arc
  G.ents.add(new DiveCrow(G, 14, 6.2, 0, {range:5, aggroR:6, period:4.6, phase:0}));

  // beam ledge, then the FIRST CHAIN down to the belfry base (forgiving: base floor catches a fumble)
  platform(G, 12.5, 3.4, 0, 4, 4, W2PAL.stoneL);            // top 3.4 (drop 1.6 off the deck edge)
  w2Chain(G, 15.3, 0.9, 3.9, 0);                            // grab from the ledge edge, ride down
  candyLine(G, [[15.3,3.4,0],[15.3,2.2,0],[15.3,1.1,0]], 4);
  platform(G, 16.5, 0.6, 0, 17, 4, W2PAL.stoneD);          // belfry base floor, top 0.6 (x8..25) — also catches a fumbled first hop
  G.ents.add(new Gravemite(G, 20.5, 0.6, 0, {range:3, axis:'x', speed:3.9}));   // belfry-base pest, nudged +8%
  candyLine(G, [[16.5,1.2,0],[21,1.2,0]], 4);
  G.ents.add(new BonkLantern(G, 23, 1.9, 0, 'shield'));     // mercy before the shaft

  // ================= ACT 2 — THE TOWER SHAFT (x 24..56, y 0.4..-2) =================
  // The hollow shaft. A brave chain drops PAST the obvious ledge to a hidden alcove (the GP);
  // a bell-rope SWING carries you over a stalagmite pit; a Restless Urn tempts from a clear pocket.

  platform(G, 28, 0.4, 0, 9, 4, W2PAL.stoneD);             // shaft entrance ledge (x23.5..32.5)
  signPost(G, 26.5, 1.0, 0.12, 'The shaft drops away. That candy trailing DOWNWARD leads somewhere the careful climber goes... and the ropes carry you over what you should not stand on.');
  platform(G, 34.5, -0.8, 0, 3.5, 3.5, W2PAL.stoneL);      // step-down ledge (drop 1.2)
  platform(G, 38, -1.8, 0, 6, 4, W2PAL.stoneD);            // mid-shaft floor A (x35..41)
  G.ents.add(new Checkpoint(39, -1.8, 0, 1, {noLight:true}));   // CP1 — before the rope-swing pit
  G.ents.add(new SwoopBat(G, 43, -0.4, 0, {range:3, period:3.2, phase:0.4}));   // owns the shaft air
  // the ~19u descent no longer reads as a threatless elevator ride: two cheap ground pests keep the low
  // lane alive while you weigh the GP route-choice. The Coffin Hopper's every-4th-hop TRIP is a free stomp
  // (a beat, not a wall) — introduced here so its Act-4 bell-chamber reprise reads as a callback.
  G.ents.add(new Gravemite(G, 30, 0.4, 0, {range:2.5, axis:'x'}));          // entrance ledge (x23.5..32.5)
  G.ents.add(new CoffinHopper(G, 38, -1.8, 0, {range:2, hopDist:1.6}));     // mid-shaft floor A (x35..41)

  // GOLDEN PUMPKIN (idx 1) — "behind a secret": most players tap over the little gap; the brave
  // climber follows the candy DOWN the chain past the ledge into the hidden alcove.
  w2Chain(G, 41.8, -4.2, -1.2, 0);
  platform(G, 41.8, -4, 0, 3.6, 3.5, W2PAL.caveWallL);     // alcove floor (top -4)
  G.ents.add(new GoldPumpkin(41.8, -3.2, 0, 1));
  candyLine(G, [[41.8,-2.4,0],[41.8,-3.4,0]], 3);          // the lure downward
  { const glowCrys = crystalCluster(42.5, -1.2, 1.1, W2PAL.crystalP); glowCrys.position.y=-4; S.add(glowCrys); }  // marks the alcove (behind the lane)
  platform(G, 44.5, -1.8, 0, 5, 4, W2PAL.stoneD);          // mid-shaft floor B (x42..47) — 1.6u gap over the chain

  // the STALAGMITE-PIT rope swing: void gap x47..53, crossed on bell-rope D (climb -> leap-off)
  S.add(bakeGroup((()=>{ const g=new THREE.Group();       // spikes deep in the pit (menace; the tell is real)
    for(const sx of [48,50,52]){ const sm=stalagmite(sx, rand(1.2,1.7), 0); sm.position.y=-4.6; g.add(sm); }
    return g; })()));
  w2BellRope(G, 47.8, -1.5, 1.8, 0, {bell:true});
  candyLine(G, [[47,-0.8,0],[47.8,1.0,0],[50,0.2,0],[52.6,-1.0,0]], 6);   // the swing arc
  platform(G, 53.8, -1.6, 0, 5, 4, W2PAL.stoneD);          // far ledge of the swing (x51.3..56.3)
  G.ents.add(new Gravemite(G, 53, -1.6, 0, {range:1.8, axis:'x'}));
  // put the AIR lane onto a CLIMB for the first time: a diver over the swing crossing = the level's first
  // ground+air pressure. Reach kept WEST of the urn@61's open-zone (base aggro ≤x53, ~5.6u clear) so it
  // never dive-bombs the urn-opener (CLEAR-PATCH LAW; the crow re-homes toward its dives, so it must not
  // reach the urn approach in the first place).
  G.ents.add(new DiveCrow(G, 46, 1.2, 0, {range:3, aggroR:4, period:4.2, phase:1.5}));
  // CLIMB HIGH-ROAD (best-fit for a climbing showcase): chain up off the far ledge, then boosted-hop ACROSS
  // onto a candy shelf OFFSET east of the chain (never capping it), then drop forward onto the urn ledge.
  w2Chain(G, 55.5, -1.6, 1.0, 0);
  platform(G, 58, 1.4, 0, 2.2, 3, W2PAL.stoneL);          // shelf offset +2.5u from the chain top — climb → hop across, not a cap
  candyLine(G, [[55.5,-0.6,0],[55.5,0.4,0],[55.5,1.2,0]], 3);   // up the chain
  candyLine(G, [[56.4,1.6,0],[58,1.9,0]], 3);             // the boosted-hop reward onto the shelf

  // the RESTLESS URN — clear pocket (no patrols within ~6u), 1s spawnGrace on the bat ambush
  platform(G, 60.5, -2, 0, 8, 5.2, W2PAL.stoneD);          // the urn ledge (x56.5..64.5)
  { const urn = new RestlessUrn(61, -2, -1.5, 0); G.ents.add(urn); G.coffins.push(urn);
    G.world.addBox(61, -2, -1.5, 1.7, 1.1, 1.7, {}); }
  candyLine(G, [[57.5,-1.2,0],[64,-1.2,0]], 4);

  // ================= ACT 3 — THE CATACOMBS + UNDERGROUND RIVER (x 64..106, y -2.2..-3) =================
  // Full cave. Descend a chain to the near bank; cross the river void on BOBBING CRYSTAL SLABS
  // (rung-timing on a fixed clock); a wisp hunts the dark middle, the lit lantern is your safe rest.

  // a stone archway marks the mouth of the catacombs (background)
  { const arch = catacombArch(60, -1.2, 1.2); arch.position.y=-2; S.add(bakeGroup((()=>{const g=new THREE.Group(); g.add(arch); return g;})())); }
  platform(G, 68, -2.2, 0, 9, 5, W2PAL.caveWallD);         // catacomb entry floor (x63.5..72.5)
  { const cc = new THREE.Group();                          // hero crystals lighting the entry (emissive, baked)
    cc.add(crystalCluster(65, -2.2, 1.3, W2PAL.crystal), crystalCluster(71, 2.4, 1.0, W2PAL.crystalV));
    cc.children.forEach(c=>{ if(c.position.y===0) c.position.y=-2.2; });
    S.add(bakeGroup(cc)); }
  G.ents.add(new BonkLantern(G, 66.5, -1, 0, 'moon'));     // a Moon Drop reward (invincible, not flight — the climb/timing still stands)
  candyLine(G, [[64.5,-1.4,0],[70,-1.4,0]], 4);

  // descend the terrain step to the near bank (the marquee climbs live on the crossing + the finale)
  platform(G, 76.5, -3, 0, 11, 5, W2PAL.caveWallD);        // near bank (x71..82) — overlaps the entry so the step down is clean, no pit
  G.ents.add(new Checkpoint(80, -3, 0, 2));                // CP2 — right before the river (short walk-back)
  w2Lantern(G, 76, -3, 0, {r:5.5});                        // SAFE POOL (emissive) — wisps shrink from it; a rest
  // SALT RE-ARM — bonk this lantern to get the Salt Shaker back mid-district (it's lost on a death; the
  // 2-1 crypt is the source). Arms you for the river wisp (x89) and the final-climb wisp (x124). Clear
  // pocket: the nearest patrol is the river wisp 11u off (CLEAR-PATCH honoured).
  G.ents.add(new BonkLantern(G, 78, -1.9, 0, 'salt'));
  signPost(G, 77.5, -2.2, -0.15, 'THE UNDERGROUND RIVER. Time the crystal steps - they rise and fall on their own. Stay in the light where you can; the wisps love the dark.');

  // the river — pure glowing VISUAL at the bottom of the void; falling in costs a heart + the lantern
  undergroundRiver(G, 82, 96.5, {hazard:false, y:-5, z:0, d:4.2, speed:2.4, dir:1});

  // rope IN, three BOBBING CRYSTAL SLABS (fixed clock), chain OUT
  w2BellRope(G, 83.5, -3.5, -0.7, 0, {});
  const crystalSlab = ()=>{
    const g = new THREE.Group();
    const slab = mesh('box',[2.4,0.5,3], emat(W2PAL.crystal, W2PAL.crystalV, 0.5)); slab.position.y=0.25;
    const rim  = mesh('box',[2.55,0.12,3.15], emat(W2PAL.crystal, W2PAL.crystal, 0.85)); rim.position.y=0.5;
    for(const sx of [-0.9,0.9]){ const cr=mesh('cone',[0.12,0.42,5], emat(W2PAL.crystalP,W2PAL.crystalP,0.8)); cr.position.set(sx,0.62,0); g.add(cr); }
    g.add(slab, rim); G.scene.add(g); return g;
  };
  // bob on a shared clock (t*1.4), offset phases -> a learnable rhythm, identical every run
  G.world.addMover(2.4, 0.5, 3, t=>new THREE.Vector3(87,   -3 + Math.sin(t*1.4)*0.7,     0), crystalSlab);
  G.world.addMover(2.4, 0.5, 3, t=>new THREE.Vector3(90.5, -3 + Math.sin(t*1.4 + 1.6)*0.7, 0), crystalSlab);
  G.world.addMover(2.4, 0.5, 3, t=>new THREE.Vector3(94,   -3 + Math.sin(t*1.4 + 3.2)*0.7, 0), crystalSlab);
  w2Chain(G, 96.5, -3.5, -1.6, 0);                         // climb out onto the far bank
  candyLine(G, [[83.5,-1.2,0],[87,-1.8,0],[90.5,-1.8,0],[94,-1.8,0],[96.5,-2.2,0]], 7);   // rhythm across
  G.ents.add(new Wisp(G, 89, -2, 0, {range:8, speed:1.6}));   // hunts the dark middle; face it or stay lit (nudged +14%)
  // the showcase crossing becomes THREE deterministic lanes at once — darkness (wisp) + slab-timing + a
  // telegraphed air dive. Capped at ONE diver (w2l4 owns the full bat bombardment; one crow is a lane, not a storm).
  G.ents.add(new DiveCrow(G, 90, -0.5, 0, {range:4, aggroR:6, period:4.6, phase:0.8}));

  // far bank + reward
  platform(G, 101, -2.6, 0, 8, 5, W2PAL.caveWallD);        // far bank (x97..105)
  w2DarkLantern(G, 99, -2.6, 0, {relightR:2.6, r:5});      // lights as you arrive — a safe pocket after the crossing
  G.ents.add(new Heart(102, -1.7, 0));                     // the crossing's guaranteed prize
  G.ents.add(new Gravemite(G, 103.5, -2.6, 0, {range:1.6, axis:'x'}));
  candyLine(G, [[97.5,-1.8,0],[104,-1.8,0]], 3);

  // ================= ACT 4 — THE FALLEN BELL (x 106..143, y -3 -> 0) =================
  // The great bell rests at the very bottom, beside the old bell-ringer who rode it down.
  // The MASTER climb: the grand bell-rope carries you UP out of the dark to the passage onward.

  platform(G, 108.5, -2.8, 0, 7, 5, W2PAL.caveWallD);      // corridor step (x105..112) — meets the far bank, no pit
  platform(G, 116, -3, 0, 9, 6, W2PAL.caveWallD);          // the bell chamber floor (x111.5..120.5)
  G.ents.add(new Checkpoint(114, -3, 0, 3));               // CP3 — before the grand climb
  G.ents.add(new BonkLantern(G, 118.5, -1.8, 0, 'shield')); // last mercy before the climb
  // the ~20u dead breather before the grand rope now carries a beat: a Coffin Hopper (a callback to the
  // shaft) trips through the bell tomb, re-arming momentum so the MASTER climb lands on a moving player.
  G.ents.add(new CoffinHopper(G, 117, -3, 0, {range:2.5, hopDist:1.6}));   // bell chamber floor (x111.5..120.5)

  // the great fallen bell (a live group — it sways ever so slightly; micro-motion)
  const bellGrp = new THREE.Group();
  const bellBody = mesh('cyl',[1.15,0.72,1.5,16], emat(0x9a7b3a,0x6a4f1a,0.35)); bellBody.position.y=0.85;
  const bellLip  = mesh('cyl',[1.2,1.15,0.3,16], emat(0xc9a227,0x7a5a10,0.45)); bellLip.position.y=0.18;
  const bellCrown= mesh('box',[0.32,0.34,0.32], mat(W2PAL.iron)); bellCrown.position.y=1.62;
  bellGrp.add(bellBody, bellLip, bellCrown);
  bellGrp.position.set(116.5, -3, -0.3); bellGrp.rotation.z = 0.16;   // toppled, resting crooked
  S.add(bellGrp);
  G._w2l3Bell = bellGrp;

  // THE QUIET PROP (never signposted): the old bell-ringer who rode the bell down and stayed at
  // his post - a small slumped skeleton still gripping the rope-end, a stopped pocket-watch and a
  // wilted flower set beside him. Story-readers will understand.
  { const q = new THREE.Group();
    const skull = mesh('sph',[0.2,9,8], mat(PAL.bone)); skull.position.set(0,0.55,0); skull.scale.set(1,1.05,0.95); skull.rotation.z=0.5;
    const ribs  = mesh('cyl',[0.16,0.12,0.4,7], mat(PAL.bone)); ribs.position.set(-0.1,0.28,0); ribs.rotation.z=0.7;
    const armR  = mesh('cyl',[0.035,0.035,0.5,5], mat(PAL.bone)); armR.position.set(0.18,0.4,0.05); armR.rotation.z=-0.9;   // reaching up to the rope-end
    const ropeEnd = mesh('cyl',[0.05,0.05,0.5,5], mat(W2PAL.rope)); ropeEnd.position.set(0.34,0.6,0.05); ropeEnd.rotation.z=0.25;
    const watch = mesh('cyl',[0.09,0.09,0.03,10], emat(0xc9a227,0x7a5a10,0.4)); watch.position.set(-0.4,0.06,0.2); watch.rotation.x=Math.PI/2;
    const flower= mesh('sph',[0.07,6,5], mat(0x8a6f9e)); flower.position.set(-0.55,0.08,0.1);
    const stem  = mesh('cyl',[0.015,0.015,0.16,4], mat(W2PAL.moss)); stem.position.set(-0.55,0.02,0.1); stem.rotation.z=0.4;
    q.add(skull,ribs,armR,ropeEnd,watch,flower,stem);
    q.position.set(115, -3, 0.5); q.rotation.y=0.3;
    S.add(bakeGroup(q)); }

  // the GRAND bell-rope: the master climb UP to the exit passage (rope-gated; the void beside it
  // and the candy up it make the intended path plain). Its bell finally rings you out.
  w2BellRope(G, 122, -3.2, 0.3, 0, {bell:true});
  candyLine(G, [[122,-2.4,0],[122,-1.2,0],[122,0.0,0]], 4);
  G.ents.add(new Wisp(G, 124, -0.6, -0.4, {range:7, speed:1.5}));   // a last wisp lunges as you climb - face it, or hurry (nudged +15%)

  // the exit landing — the catacomb passage onward (to 2-4 The Glittering Deep)
  platform(G, 130, 0, 0, 14, 5, W2PAL.caveWallL);          // top y0 (x123..137) — hop off the rope-top onto it
  platform(G, 140, 0, 0, 8, 5, W2PAL.caveWallL);           // (x136..144) run to the gate
  { const arch = catacombArch(133, -1.2, 1.3); S.add(bakeGroup((()=>{const g=new THREE.Group(); g.add(arch); return g;})())); }
  { const cc = new THREE.Group(); cc.add(crystalCluster(127, 2.5, 1.1, W2PAL.crystal), crystalCluster(138, -2.4, 1.0, W2PAL.crystalP)); S.add(bakeGroup(cc)); }
  G.ents.add(new Gravemite(G, 131, 0, 0, {range:2, axis:'x'}));   // keeps the run-out honest
  G.ents.add(new SwoopBat(G, 128, 2.6, 0, {range:3.5, period:3.4, phase:0.5}));   // one air threat over the exit run so the catacomb walk-out isn't empty (owner: no long empty stretches) — air lane paired with the ground gravemite, over solid floor
  candyLine(G, [[124.5,0.6,0],[128,0.6,0],[135,0.6,0]], 5);

  exitGate(G, 140);

  // ================= AMBIENCE / PARALLAX / CLUTTER (split so nothing floats over the river void) =====
  w2Parallax(S, -6, 58, 'surface');    // the graveyard, seen from up in the tower
  w2Parallax(S, 50, 148, 'cave');      // cave walls + stalactites + distant crystal glimmer below
  // a few foreground silhouettes (z>0) for depth framing
  S.add(bakeGroup((()=>{ const g=new THREE.Group();
    g.add(grave(6, 3.4)); g.children[g.children.length-1].position.set(6,4.6,3.2);
    const st1 = stalagmite(70, 1.4, 0); st1.position.set(70,-2.2,3.0); g.add(st1);
    const st2 = stalagmite(103, 1.6, 0); st2.position.set(103,-2.6,3.1); g.add(st2);
    const cr  = crystalCluster(89, 3.2, 1.2, W2PAL.crystalV); cr.position.y=-4.6; g.add(cr);
    return g; })()));
  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 47, 51.3, 'grave');       // the stalagmite-pit rope swing (joins the baked stalagmites)
  pitDressing(G, 120.5, 123, 'grave');     // the void beside the grand bell-rope
  pitDressing(G, 35, 40, 'grave', -7.4);   // the drop west of the GP alcove (alcove floor y-4 → deep bed, killY -8)
  pitDressing(G, 43.6, 47, 'grave', -7.4); // the mirror drop east of the alcove

  w2LevelFinish(G, -6, 148, 'cave', null);   // bats + cave dust/mote ambience + checkpoint(=spawn); clutter done manually

  // baked clutter at each FLOOR height, split so nothing floats over a gap or the river void (x82..96.5)
  _w2l3SurfClutter(G, -2, 9, 5);       // belfry deck
  _w2l3SurfClutter(G, 9, 25, 0.6);     // belfry base
  _w2l3SurfClutter(G, 25, 32, 0.4);    // shaft entrance ledge
  _w2l3SurfClutter(G, 35, 41, -1.8);   // mid-shaft floor A (stops before the GP gap)
  _w2l3SurfClutter(G, 42, 47, -1.8);   // mid-shaft floor B (resumes after the GP gap)
  _w2l3SurfClutter(G, 51.5, 56, -1.6); // swing far ledge
  _w2l3SurfClutter(G, 57, 64, -2);     // urn ledge
  _w2l3Clutter(G, 64, 72, -2.2);       // catacomb entry
  _w2l3Clutter(G, 72, 81.5, -3);       // near bank (stops before the river)
  _w2l3Clutter(G, 97, 105, -2.6);      // far bank
  _w2l3Clutter(G, 105, 120, -2.9);     // corridor + bell chamber
  _w2l3Clutter(G, 123, 144, 0);        // the exit passage

  return {spawnX:0, exitX:140};
}

function updateW2L3(G, dt){
  updateLevelCommon(G, dt);
  // micro-motion: the great fallen bell rocks a hair in the deep draft (nothing is ever perfectly still)
  if(G._w2l3Bell) G._w2l3Bell.rotation.z = 0.16 + Math.sin(G.time*0.9)*0.02;
}

W2_LEVELS.push({id:'w2l3', district:'w2', name:'THE BELL TOWER', build:buildW2L3, update:updateW2L3, parTime:155});

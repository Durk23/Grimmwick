// ============ LEVEL 5-3 — THE SHADOW GALLERY (District 5 · Cursed Castle) ============
// The finale's full-circle nod to the D2 catacombs: a long, DIM MIRRORED HALL deep in Grimm's
// keep, hung with dead chandeliers and cracked looking-glasses, where the brew leaks COPIES.
// Signature gimmick: SHADOW & MIRROR reads. Grimm's cauldron pours SHADOW COPIES (relentless
// lane-chasers, hp1) into the hall, and the mirrors breed MIRROR BOOS that drift the WRONG way
// as you approach (feint them into an opening). Read the fakes, keep moving — a shadow gauntlet.
// The dim is intentional: chandeliers + a couple of real ember light-pools carve pockets of warm
// light out of the shadow-purple murk, so you always see the threat that matters. Full arc
// (introduce -> twist -> escalate -> master):
//   BEAT 1 THE GALLERY DOORS (INTRODUCE)   x -8..32  — enter the mirrored hall; a lone SHADOW COPY
//          to learn the chaser (it never stops - stomp it or lose it), light-pool + a startled raven.
//   BEAT 2 THE MIRROR WALK (INTRODUCE)     x 32..58  — the MIRROR BOO (drifts away as you close in),
//          a bowing CLOCKWORK KNIGHT, and Grimm's GIFT up on a clear reliquary ledge (the D5 gamble).
//   BEAT 3 THE DARK SLOT & THE SECRET (TWIST) x 58..66 — a shadow slot in the floor drops into a DARK
//          mirror alcove off the flow (the tell is the darker stone) hiding GOLDEN PUMPKIN #1; a clock-
//          chain climbs you back out. CP1 on the far lip before the gauntlet.
//   BEAT 4 THE SHADOW GAUNTLET (ESCALATE)  x 66..116 — the dense core: gear-cog stepping over a shadow
//          void, three Shadow Copies + a Mirror Boo + a DIVE CROW air lane; a HIGH ROAD of candy and a
//          Gummy Shield runs overhead in sight of the low road. Fall = a heart + the CP1 walk-back.
//   BEAT 5 THE HALL OF FAKES (MASTER)      x 116..164 — a second Knight, a drop-Spider from a chandelier,
//          a last Mirror Boo, a chasing Shadow Copy - all at once, all telegraphed. The QUIET PROP hides
//          here: a cracked mirror whose reflection of Pip waves back a half-beat late. A mercy heart.
//   BEAT 6 THE FAR DOOR (finish)           x 164..187 — the run-out to the gallery gate; one last raven.
// Reads UNMISTAKABLY Cursed Castle: W5PAL gunmetal masonry + verdigris-brass cogs, shadow-purple murk,
// clock-cream faces, the one warm ember accent. Three-depth clockwork parallax, clock-soot drift, cold
// ember-sparks, foreground broken pillars. Structured chaos over three lanes (ground chasers/knights ·
// air mirror-boos/dive-crow · the drop-spider) - 12 threats, every one on a fixed clock or a visible tell.
// COMPARABLE HEIGHTS throughout (tap 1.8 / held 2.6 / double 3.3; every gap <=4 with over-clearance; the
// only sub-floor is the OPTIONAL dark alcove, gated by a clock-chain climb). Deterministic to the pebble:
// fixed enemy phases, fixed cog spins; seeded rand() only inside baked cosmetic deco. No RNG on the path.

// ---- module state (reset each build): the cracked-mirror quiet prop + a short lag buffer so the
// reflection mirrors Pip a HALF-BEAT LATE. Cosmetic only (a decorative prop, never a gameplay input),
// so reading the player here does not touch the determinism covenant. ----
let W5L3_reflGroup = null;   // the ghostly Pip reflection inside the cracked mirror
let W5L3_reflArm   = null;   // its waving hand
let W5L3_mirrorX   = 0;      // the mirror's world x (reflection leans off the MIRRORED offset)
let W5L3_pipBuf    = [];     // rolling player-x history -> the "late" lag

function buildW5L3(G){
  const S = G.scene;
  levelBegin(G);
  G.camMinY = -3.5;                       // the optional dark alcove dips to y-2.4 — let the side-cam follow it down
  W5L3_reflGroup = null; W5L3_reflArm = null; W5L3_mirrorX = 0; W5L3_pipBuf = [];

  // palette handles for this course
  const STONE = W5PAL.stone;              // gunmetal hall floor
  const LEDGE = W5PAL.stoneL;             // lighter masonry — a readable standable top
  const DARK  = W5PAL.shadow;             // shadow-purple — the DARK ALCOVE's "this is hidden" tell

  const deco = new THREE.Group();         // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE GALLERY DOORS (x -8..32): INTRODUCE the chaser ===============================
  groundX(G, -8, 32, STONE);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 4, 1.7, -0.12, "THE SHADOW GALLERY. Grimm's brew leaks COPIES down here - shades of you that chase, and mirror-ghosts that drift the wrong way. Don't trust a reflection. Keep moving to the far door.");
  // SHADOW COPY #1 — the lone teacher: it chases on the lane and never stops. Stomp it, or leave it behind.
  G.ents.add(new ShadowCopy(G, 16, 0, 0, {phase:0.0, speed:2.6}));
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12,0.9,0]], 3);
  G.ents.add(new Crow(8, 0.95, 2.3));                                  // reactive gallery raven — flaps off when neared
  // a warm ember light-pool at the doors so the dim reads as a mood, not a mistake
  const pool1 = new THREE.PointLight(W5PAL.ember, 34, 13); pool1.position.set(13, 5, -0.5); S.add(pool1);
  deco.add(chandelier(13, 6.4, -0.4, 1.15));
  candyLine(G, [[20,0.9,0],[24,0.9,0],[28,0.9,0]], 3);

  // =============================== BEAT 2 — THE MIRROR WALK (x 32..58): INTRODUCE the Mirror Boo + the GIFT ===============================
  groundX(G, 32, 58, STONE);
  // MIRROR BOO #1 — hovers and slides to the OPPOSITE side as you approach; feint it, then cross under.
  G.ents.add(new MirrorBoo(G, 34, 2.5, 0, {phase:0.0, range:3, mirror:0.85}));
  candyLine(G, [[31,0.9,0],[38,0.9,0]], 3);
  // GRIMM'S GIFT (the D5 gamble) up on a CLEAR reliquary ledge — no chaser/floater base within ~6u, and a
  // ground shade can't reach a ledge, so opening it is always the deliberate SAFE act the clear-patch law wants.
  platform(G, 44, 2.8, 0, 4, 3.5, LEDGE);                             // reliquary ledge (top 2.8) — a double-jump up, candy-traced
  candyLine(G, [[41,1.2,0],[42.5,2.3,0],[44,3.2,0]], 3);              // the lure up to the gift
  { const gift = new GrimmGift(44, 2.8, 0, 0.3); G.coffins.push(gift); G.ents.add(gift); }
  // CLOCKWORK KNIGHT #1 — the courtly BOW is the telegraph; only the lunge bites. Pound one-shots the armor.
  G.ents.add(new ClockworkKnight(G, 53, 0, 0, {phase:0.0, range:2, dir:-1, speed:1.2}));
  candyLine(G, [[47,0.9,0],[50,0.9,0]], 2);
  deco.add(chandelier(46, 6.2, -0.4, 1.0));

  // =============================== BEAT 3 — THE DARK SLOT & THE SECRET (x 58..66): TWIST + GP idx1 ===============================
  // A shadow SLOT breaks the floor. Most players jump the little gap and flow on; the observant see the darker
  // stone and the faint gold glimmer below, and DROP IN. Down there, a DARK MIRROR ALCOVE hides GOLDEN PUMPKIN #1,
  // its own glow the only light. You go LEFT (against the flow), into the dark, to earn it - then climb the clock-
  // chain back out. Never a death pit (a floor catches you) and never a trap (the chain is an obvious way up).
  groundX(G, 60.2, 66, STONE);                                        // the far lip of the slot (slot spans 58..60.2)
  platform(G, 55, -2.4, 0, 11, 4, DARK);                             // the sunken dark alcove floor (spans 49.5..60.5 — fully catches the slot drop)
  G.ents.add(new GoldPumpkin(52, -1.6, 0, 1));                        // GP idx 1 — behind the secret, left into the dark
  candyLine(G, [[53.5,-1.7,0],[52,-1.7,0]], 2);
  w5Chain(G, 59, -2.4, 0.6, 0);                                       // the clock-chain OUT (climb up, hop to the far lip)
  candyLine(G, [[59,-1.4,0],[59,-0.2,0],[59,1.0,0]], 3);             // candy up the chain — teaches the way back
  // the SLOT's tell: two shadow-purple mirror pillars framing the gap (darker geometry = "something's here")
  { const fr = new THREE.Group();
    for(const px of [58, 60.2]){ const p = mesh('box',[0.5,3.2,0.6], emat(W5PAL.shadow,0x140f22,0.25)); p.position.set(px,1.4,-0.9); crook(p,0.04); fr.add(p);
      const gl = mesh('sph',[0.16,7,6], emat(W5PAL.shadowP,W5PAL.shadowP,0.7)); gl.position.set(px,3.0,-0.9); fr.add(gl); }
    deco.add(fr); }
  // a dead looking-glass down in the alcove, so it reads as a MIRROR alcove (deco)
  { const m = new THREE.Group();
    const frame = mesh('tor',[0.9,0.12,6,16], mat(W5PAL.brassD)); frame.position.set(50,-1.2,-1.6); frame.scale.set(1,1.35,1);
    const glass = mesh('box',[1.4,2.3,0.06], emat(0x120f1e,0x120f1e,0.15)); glass.position.set(50,-1.2,-1.7);
    m.add(frame, glass); deco.add(m); }
  G.ents.add(new Checkpoint(63, 0, 1.6, 1));                          // CP1 — LIT, on the slot's far lip, before the gauntlet

  // =============================== BEAT 4 — THE SHADOW GAUNTLET (x 66..116): ESCALATE — the dense core ===============================
  // Cog-hop over a shadow void. LOW ROAD (the cogs + ledges) completes it; a HIGH ROAD of candy + a Gummy Shield
  // runs directly overhead, in plain sight of the low road (the "next run I'm going up there" itch). Chasers ride
  // the ledges, a Mirror Boo owns the high gap, a Dive Crow works the air. Fall -> a heart + the CP1 walk-back.
  gearPlat(G, 70, 0.8, {spin:1.1});                                   // cog 1 (top 0.8) — 2.8 hop off the lip, +0.8
  gearPlat(G, 74.5, 1.2, {spin:-1.3});                               // cog 2 (top 1.2) — 2.1 hop, +0.4
  platform(G, 80, 1.2, 0, 6, 4, LEDGE);                              // LEDGE B (spans 77..83)
  candyLine(G, [[67,1.2,0],[70,1.5,0]], 2); candyLine(G, [[72,1.7,0],[74.5,1.9,0]], 2);
  candyLine(G, [[78,1.9,0],[81,1.9,0]], 2);
  G.ents.add(new ShadowCopy(G, 81, 1.2, 0, {phase:0.4, speed:2.8})); // chaser on Ledge B (rides its lane, floats the void)
  // THE HIGH ROAD (in sight above the low road, with headroom): more candy + a Gummy Shield, rejoining at Ledge D
  platform(G, 85, 3.6, 0, 6, 3, LEDGE);                              // HIGH LEDGE 1 (spans 82..88) — held jump up +2.4 from Ledge B
  G.ents.add(new BonkLantern(G, 85, 4.3, 0, 'shield'));             // the high-road reward (spin/stomp -> Gummy Shield)
  candyLine(G, [[83,4.3,0],[85,4.6,0],[87,4.3,0]], 3);
  gearPlat(G, 88, 1.2, {spin:1.4});                                  // cog 3 (top 1.2) — low road on: 3.8 hop from Ledge B
  candyLine(G, [[85,1.9,0],[88,1.9,0]], 2);
  // MIRROR BOO #2 — parked over the low-road gap AND under the high road's leap: feint it either way
  G.ents.add(new MirrorBoo(G, 91, 3.4, 0, {phase:0.7, range:2.6, mirror:0.8}));
  gearPlat(G, 91.5, 1.6, {spin:-1.1});                              // cog 4 (top 1.6) — low road: 1.1 hop, +0.4
  platform(G, 93.5, 4.0, 0, 6, 3, LEDGE);                           // HIGH LEDGE 2 (spans 90.5..96.5, top 4.0) — clears cog 4's headroom
  candyLine(G, [[90.5,4.7,0],[93.5,4.7,0],[96,4.7,0]], 3);
  platform(G, 99, 1.6, 0, 6, 4, LEDGE);                             // LEDGE D (spans 96..102) — low: 3.3 hop from cog 4; HIGH ROAD drops in here (-2.4)
  candyLine(G, [[91,1.9,0],[91.5,2.1,0]], 2); candyLine(G, [[94,2.0,0],[96.5,2.3,0]], 2);
  G.ents.add(new ShadowCopy(G, 100, 1.6, 0, {phase:0.2, speed:3.0}));// chaser on Ledge D
  // DIVE CROW — the air lane (a shadow-tinted corvid of the brew): patrols, CAWs, dives a SNAPSHOT. Sidestep beats it.
  G.ents.add(new DiveCrow(G, 100, 6.2, 0, {phase:0.0, range:5, aggroR:6, period:4.2}));
  platform(G, 107, 1.2, 0, 6, 4, LEDGE);                            // LEDGE E (spans 104..110) — 2.0 hop, -0.4
  candyLine(G, [[102.5,1.9,0],[104,1.7,0]], 2); candyLine(G, [[106,1.7,0],[108,1.7,0]], 2);
  G.ents.add(new ShadowCopy(G, 108, 1.2, 0, {phase:0.6, speed:2.7}));// chaser on Ledge E
  gearPlat(G, 113, 0.6, {spin:1.2});                                // cog 5 (top 0.6) — 1.8 hop, steps down toward the floor

  // =============================== BEAT 5 — THE HALL OF FAKES (x 116..164): MASTER — everything at once ===============================
  groundX(G, 116, 187, STONE);                                       // solid ground through the finish
  candyLine(G, [[114,0.9,0],[117,0.9,0],[120,0.9,0]], 3);
  signPost(G, 122, 1.7, 0.1, "THE HALL OF FAKES. Every glass down here breeds another copy. Past this hall, the last stair to Grimm's throne. Steady now.");
  // CLOCKWORK KNIGHT #2 — a wider patrol; bow-telegraph, pound-through
  G.ents.add(new ClockworkKnight(G, 132, 0, 0, {phase:0.3, range:2.6, dir:1, speed:1.4}));
  // a chasing SHADOW COPY overlapping the knight = the mastery pinch (deal with the fake while the knight bows)
  G.ents.add(new ShadowCopy(G, 138, 0, 0, {phase:0.1, speed:3.0}));
  candyLine(G, [[128,0.9,0],[131,0.9,0]], 2);
  // a drop-SPIDER from a dead chandelier — its hang-line is the tell; drops when you cross beneath (shadow-tinted brood)
  G.ents.add(new Spider(G, 146, 6.0, 0, {groundY:0}));
  deco.add(chandelier(146, 6.6, 0, 1.1));
  // MIRROR BOO #3 — the last feint, low over the lane
  G.ents.add(new MirrorBoo(G, 150, 2.4, 0, {phase:0.5, range:3, mirror:0.85}));
  candyLine(G, [[142,0.9,0],[144,0.9,0]], 2); candyLine(G, [[152,0.9,0],[155,0.9,0]], 2);
  G.ents.add(new Heart(158, 1.2, 0));                                // mercy heart before the run-out
  const pool2 = new THREE.PointLight(W5PAL.ember, 34, 13); pool2.position.set(138, 5, -0.5); S.add(pool2);

  // THE QUIET PROP (never signposted): a great CRACKED MIRROR against the back wall. Its reflection of Pip is
  // there... but it lifts a hand and waves back a HALF-BEAT LATE, and leans the wrong way. Story-readers will
  // catch the wrongness and shiver; everyone else walks past to the door. Built LIVE so the reflection animates.
  { const mir = new THREE.Group();
    const frame = mesh('tor',[1.15,0.16,6,18], mat(W5PAL.brass)); frame.position.set(0,1.5,0); frame.scale.set(1,1.5,1);
    const glass = new THREE.Mesh(geo('box',1.9,3.1,0.08), new THREE.MeshLambertMaterial({color:0x1a1730, emissive:0x2a2440, emissiveIntensity:0.3, transparent:true, opacity:0.9}));
    glass.position.set(0,1.5,-0.05);
    const crack1 = mesh('box',[0.04,2.4,0.02], emat(0x8a86a8,0x8a86a8,0.4)); crack1.position.set(0.25,1.6,0.02); crack1.rotation.z=0.28;
    const crack2 = mesh('box',[0.03,1.5,0.02], emat(0x8a86a8,0x8a86a8,0.4)); crack2.position.set(-0.3,1.2,0.02); crack2.rotation.z=-0.4;
    // the reflection: a small, dim, ghostly Pip (his flannel-red + pale face, drained by the murk)
    W5L3_reflGroup = new THREE.Group();
    const rBody = mesh('box',[0.34,0.5,0.22], emat(0x7a3232,0x3a1818,0.25)); rBody.position.y=0.32;
    const rHead = mesh('sph',[0.2,9,8], emat(0xc9b9a2,0x4a4038,0.2)); rHead.position.y=0.72;
    const rLeg = mesh('box',[0.12,0.28,0.14], emat(0x2f2a48,0x18142a,0.2)); rLeg.position.set(0,0.02,0);
    // the waving hand — a Group pivoting at the shoulder so rotation.z swings the arm cleanly (no cached-geo mutation)
    W5L3_reflArm = new THREE.Group(); W5L3_reflArm.position.set(-0.22,0.5,0.02);
    const rArmSeg = mesh('box',[0.1,0.34,0.1], emat(0x7a3232,0x3a1818,0.25)); rArmSeg.position.y=-0.17; W5L3_reflArm.add(rArmSeg);
    W5L3_reflGroup.add(rLeg, rBody, rHead, W5L3_reflArm);
    W5L3_reflGroup.position.set(0, 0.35, 0.12); W5L3_reflGroup.rotation.y = Math.PI;   // faces back into the glass
    mir.add(frame, glass, crack1, crack2, W5L3_reflGroup);
    mir.position.set(156, 0, -1.3);
    S.add(mir);                                                       // LIVE (not baked) — the reflection ticks in updateW5L3
    W5L3_mirrorX = 156;
  }

  // =============================== BEAT 6 — THE FAR DOOR (x 164..187): finish ===============================
  G.ents.add(new Crow(170, 0.95, 2.4));                              // one last raven on the run-out
  candyLine(G, [[164,0.9,0],[167,0.9,0],[170,0.9,0]], 3);
  exitGate(G, 177);

  // =============================== DECO · PILLARS · CLOCKS · MOON · PARALLAX ===============================
  // background masonry: broken pillars + stopped clock-faces down the hall (baked to one draw call)
  for(const [x,s] of [[10,1.1],[26,1.3],[50,1.2],[122,1.15],[152,1.3],[172,1.2]]) deco.add(brokenPillar(x, -2.2, s));
  for(const [x,y] of [[22,4.2],[120,4.6],[162,4.0]]) deco.add(clockFaceDeco(x, y, -2.6, 1.2));
  deco.add(chandelier(28, 6.3, -0.4, 1.05)); deco.add(chandelier(120, 6.5, -0.4, 1.1));
  // foreground silhouettes (z>0) framing the hall — near broken pillars catch the eye and add depth
  deco.add(brokenPillar(20, 2.7, 1.6)); deco.add(brokenPillar(118, 2.9, 1.7)); deco.add(brokenPillar(168, 2.8, 1.55));
  S.add(bakeGroup(deco));

  // a cold stopped moon-clock low behind the keep
  const moon = mesh('circ',[5,28], emat(W5PAL.cream, W5PAL.creamD, 0.8)); moon.position.set(70,15,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0xbfb8ff, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(70,15,-31.2); S.add(moonH);

  // three-depth clockwork parallax (near cog-teeth/pendulums · rampart + Grimm's cracked clock-tower · mountain spires)
  w5Parallax(S, -8, 187);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 66, 77, 'castle');
  pitDressing(G, 88, 90.5, 'castle');
  pitDressing(G, 102, 104, 'castle');
  pitDressing(G, 110, 116, 'castle');

  // exit + the D5 tail. clutter placed manually on the GROUND spans only (the gauntlet is all void/cog)
  w5LevelFinish(G, -8, 187, null);
  w5Clutter(G, -8, 58, 'castle');
  w5Clutter(G, 60.2, 66, 'castle');
  w5Clutter(G, 116, 187, 'castle');

  return {spawnX: 0, exitX: 177};
}

function updateW5L3(G, dt){
  updateLevelCommon(G, dt);
  const pl = G.player;
  if(!pl) return;
  // THE QUIET PROP — the cracked mirror's reflection of Pip, a half-beat late and leaning the wrong way.
  // Purely decorative: it reads player state to unsettle, never to gate anything (the determinism covenant
  // only guards the critical path). A short lag buffer makes the reflection arrive ~a quarter-second behind.
  if(W5L3_reflGroup){
    W5L3_pipBuf.push(pl.pos.x);
    if(W5L3_pipBuf.length > 16) W5L3_pipBuf.shift();                  // ~0.27s of lag = the "half-beat late"
    const pastX = W5L3_pipBuf[0];
    const off = clamp((W5L3_mirrorX - pastX) * 0.5, -0.55, 0.55);    // leans off the MIRRORED offset (wrong way)
    W5L3_reflGroup.position.x = off;
    const near = Math.abs(pl.pos.x - W5L3_mirrorX) < 5.5;
    const targ = near ? (0.5 + Math.sin(G.time*3.4 - 1.4)*0.7) : -0.05;   // waves back... a beat behind
    if(W5L3_reflArm) W5L3_reflArm.rotation.z = damp(W5L3_reflArm.rotation.z, targ, 5, dt);
  }
}

W5_LEVELS.push({id:'w5l3', district:'w5', name:'THE SHADOW GALLERY', build:buildW5L3, update:updateW5L3, parTime:165});

// ============ LEVEL 4-3 — THE LIGHTHOUSE (District 4 · Ghost Harbor) ============
// The district's VERTICAL level and its thesis statement: LIGHT SHOWS THE WAY. Pip climbs the
// dead keeper's lighthouse on rope ladders and rigging while the great lamp's beam sweeps the dark
// on a fixed clock, and its wash REVEALS the "ghost planks" — driftwood stairs that hang dim and
// half-seen until the light finds them, flaring bright as the beam passes. The planks are ALWAYS
// SOLID (never an invisible-death trap — that would be unfair); the challenge is reading the beam's
// RHYTHM so you always jump into the light, not the dark. This is the lesson the Captain Wraith boss
// pays off (there, relighting the deck lanterns burns his mist away). Full introduce->twist->escalate->master:
//   BEAT 1 THE DRIED SHORE (INTRODUCE)   x -8..28  — re-teach the harbor: a Boo Buccaneer to stare-slow,
//          a Cannon Crab lobbing shells across a tide-pool, then the keeper's first rope ladder up.
//   BEAT 2 THE BASE CLIMB (INTRODUCE)    x 28..44  — learn the ladder + the ghost planks: dim driftwood
//          steps up to Ledge B that flare as the beam sweeps them. CP1 before the first real drop.
//   BEAT 3 THE WIRE CROSSING (TWIST)     x 44..64  — the RIGGING WRAITH: a specter riding a horizontal
//          rigging wire, swooping the instant you pass beneath it, over a ghost-plank gap into the void.
//   BEAT 4 THE BRANCH & THE SECRET (ESCALATE) x 60..70 — the main rope ladder climbs on; a subtler rigging
//          rope up-LEFT hides GOLDEN PUMPKIN #1 in a dark back nook the beam never touches (behind a secret).
//   BEAT 5 THE LAMP GALLERY (PEAK)       x 68..90  — the summit: the rotating beacon itself, a lit checkpoint
//          at the light, a mercy heart, and the QUIET PROP — the old keeper's log, still open, candle still lit.
//   BEAT 6 THE FAR STAIR (MASTER)        x 90..124 — descend the far side on beam-lit planks under a SECOND
//          Rigging Wraith + Swoop Bats, a Gummy Shield tucked on the high line, back down to the seabed.
//   BEAT 7 THE KEEPER'S DOOR (finish)    x 124..168 — a short shore run to the gallery gate; the boss foreshadow.
// Reads UNMISTAKABLY Ghost Harbor: W4PAL dried teal-grey seabed, bleached driftwood ledges, wreck ribs and
// dock cranes, dead-coral silhouettes deep in the void, tide-pool glows, salt-mist + brine ambience. Structured
// chaos over three lanes (ground Boos/Crab · air Swoop Bats · the rigging Wraiths) — 10 threats, every one on a
// fixed clock and telegraphed. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3 / gaps <=4; every
// big rise is a GATED rope-ladder climb). Deterministic to the pebble — fixed placements, fixed patrol/dive/beam
// clocks; seeded rand() only inside baked cosmetic deco. No Math.random on the critical path.

// ---- the beam clock + the live ghost planks it reveals (reset per build; ticked in updateW4L3) ----
let W4L3_planks = [];
let W4L3_beamT = 0;
let W4L3_beacon = null;      // the rotating beam blades
let W4L3_beaconCore = null;  // the lamp core (pulses)
let W4L3_lampLight = null;   // the one real lamp PointLight (pulses)

// ---- a keeper's rope ladder: a baked rope-and-rung visual + a {type:'climb'} world volume (press UP to grab,
// climb freely, JUMP to leap off with a boosted hop). The GATED way to gain big height on the tower. In-palette. ----
function w4l3Ladder(G, x, y0, y1){
  const g = new THREE.Group();
  const rm = mat(W4PAL.rope), rung = mat(W4PAL.woodL);
  for(const sx of [-0.32, 0.32]){                                     // two hemp side-ropes
    const rope = mesh('cyl',[0.05,0.05,(y1-y0),5], rm);
    rope.position.set(x+sx, (y0+y1)/2, 0); crook(rope,0.02); g.add(rope);
  }
  for(let y=y0+0.4; y<y1; y+=0.6){                                     // driftwood rungs
    const r = mesh('cyl',[0.045,0.045,0.74,5], rung); r.rotation.z=Math.PI/2; r.position.set(x, y, 0); g.add(r);
  }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, y0, 0, 1.0, (y1-y0), 1.2, {type:'climb'});
}

// ---- a GHOST PLANK: a barnacled driftwood step that is ALWAYS SOLID but hangs dim (low emissive, semi-transparent)
// until the lighthouse beam sweeps over it, then flares bright. Kept LIVE (its own MeshLambertMaterial, animated in
// updateW4L3 — the cached emat() would be shared across planks). Collider top sits exactly at topY (like platform()). ----
function w4l3GhostPlank(G, x, topY, w=2.6){
  const m = new THREE.MeshLambertMaterial({color:0x24363a, emissive:W4PAL.lantern, emissiveIntensity:0.14, transparent:true, opacity:0.5});
  const plank = new THREE.Mesh(geo('box', w, 0.4, 3), m);
  plank.position.set(x, topY-0.2, 0);
  // a faint barnacle nub or two, welded into the same mesh's material by sharing it (still one draw call per plank)
  G.scene.add(plank);
  G.world.addBox(x, topY-0.4, 0, w, 0.4, 3, {});                       // SOLID — standable top at topY
  const u = (x - (-8)) / (168 - (-8));                                 // normalized position → the reveal wave travels left->right
  W4L3_planks.push({mat:m, u});
}

function buildW4L3(G){
  const S = G.scene;
  levelBegin(G);
  W4L3_planks = []; W4L3_beamT = 0; W4L3_beacon = null; W4L3_beaconCore = null; W4L3_lampLight = null;

  // palette handles for this course
  const SEA   = W4PAL.seabed;    // cracked teal-grey shore
  const WOOD  = W4PAL.wood;      // bleached driftwood ledges
  const HULL  = W4PAL.hull;      // darker wreck-plank ledges (the far stair)
  const NOOK  = W4PAL.hullD;     // the dark secret-nook shelf (off the beam path — a tell it's hidden)

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE DRIED SHORE (x -8..28): INTRODUCE ===============================
  groundX(G, -8, 28, SEA);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 4, 1.7, -0.15, "THE LIGHTHOUSE. The keeper's lamp still sweeps the dark. Its light finds the dim planks in turn - watch the rhythm, and always leap into the glow. Climb to the lamp.");
  // BOO BUCCANEER #1 — re-teach the harbor's stare rule (facing it only SLOWS it; it never freezes)
  G.ents.add(new BooBuccaneer(G, 10, 0, 0, {phase:0.0}));
  candyLine(G, [[5,0.9,0],[7.5,0.9,0]], 3);
  // CANNON CRAB #1 — lobs an arcing shell on a fixed clock across the tide-pool as you approach (fuse telegraph)
  G.ents.add(new CannonCrab(G, 20, 0, 0, {phase:0.4, period:3.2, tele:0.7, range:2, aggroX:12, dir:1}));   // aggroX 22→12 so it can't lob a shell onto the spawn (x0, 20u away) before you can move
  candyLine(G, [[13,0.9,0],[16,0.9,0]], 3);
  signPost(G, 25, 1.7, 0.12, "The keeper's ladder. Up you go - and mind the rigging: the ghosts on the wires only stir when you pass beneath them.");
  G.ents.add(new Crow(7, 0.95, 2.3));                                  // reactive shore critter — flaps off when neared

  // =============================== BEAT 2 — THE BASE CLIMB (x 28..44): INTRODUCE the ladder + ghost planks ===============================
  // the void opens here (planks/ledges over the dried deep) — dead coral far below reads "don't fall"
  w4l3Ladder(G, 28, 0, 5.2);
  candyLine(G, [[28,1.6,0],[28,3.2,0],[28,4.6,0]], 3);                 // rhythm candy up the first ladder
  platform(G, 31.5, 5.2, 0, 4, 3, WOOD);                              // LEDGE A (top 5.2) — leap off the ladder onto it
  w4l3GhostPlank(G, 35.5, 6.6);                                       // dim until the beam finds it (+1.4)
  w4l3GhostPlank(G, 39.5, 7.8);                                       // (+1.2)
  platform(G, 43.5, 8.4, 0, 4, 3, WOOD);                              // LEDGE B (top 8.4)
  candyLine(G, [[33,5.9,0],[35.5,7.1,0]], 3); candyLine(G, [[37.5,8.3,0],[39.5,8.3,0]], 2);
  candyLine(G, [[41.5,8.9,0],[43.5,8.9,0]], 2);
  G.ents.add(new SwoopBat(G, 37, 10, 0, {phase:0.2, range:4, period:3.4, aggroR:5}));  // the air lane over the base planks
  G.ents.add(new Checkpoint(43.5, 8.4, 1.6, 1, {noLight:true}));       // CP1 — on Ledge B, before the void crossing

  // =============================== BEAT 3 — THE WIRE CROSSING (x 44..64): TWIST — the Rigging Wraith ===============================
  // ghost planks over the void while a RIGGING WRAITH slides a rigging wire above and swoops beneath you.
  w4l3GhostPlank(G, 48, 8.6, 2.4);
  w4l3GhostPlank(G, 52, 8.8, 2.4);
  w4l3GhostPlank(G, 56, 8.6, 2.4);
  platform(G, 60.5, 8.4, 0, 5, 3, WOOD);                              // LEDGE C (spans 58..63)
  candyLine(G, [[46,8.9,0],[48,8.9,0]], 2); candyLine(G, [[50,9.1,0],[52,9.1,0]], 2);
  candyLine(G, [[54,8.9,0],[56,8.9,0]], 2);
  // the wraith rides x47..57 at wireY 12.4 on a fixed clock; its swoop dips to ~9.8 — a fair, telegraphed near-miss
  G.ents.add(new RiggingWraith(G, 52, 12.4, 0, {x1:47, x2:57, period:5, phase:0.0, swoopDrop:2.6, tele:0.5}));

  // =============================== BEAT 4 — THE BRANCH & THE SECRET (x 60..70): ESCALATE + GP idx1 ===============================
  // THE SECRET (off the main beam path): a subtler rigging ROPE up-LEFT to a dark nook the beam never lights.
  // The Golden Pumpkin's own glow is the only light in it — you go BACKWARD, against the level's rightward flow, to find it.
  w2BellRope(G, 60, 8.0, 13.2, 0, {});                                // a hanging rigging rope (climb + boosted leap-off)
  candyLine(G, [[60,9.2,0],[60,10.8,0],[60,12.4,0]], 3);              // the quiet lure upward
  platform(G, 57, 12.4, 0, 3, 3, NOOK);                              // the dark back nook (leap off the rope to the LEFT)
  G.ents.add(new GoldPumpkin(57, 13.2, 0, 1));                        // GOLDEN PUMPKIN idx 1 — behind the secret, off the beam
  candyLine(G, [[58.6,12.9,0],[57.2,12.9,0]], 2);
  // THE MAIN WAY (forward-up): the keeper's upper ladder to Ledge D
  w4l3Ladder(G, 63.5, 8.4, 14.2);
  candyLine(G, [[63.5,9.6,0],[63.5,11.4,0],[63.5,13.2,0]], 3);
  platform(G, 67.5, 14.2, 0, 4, 3, WOOD);                            // LEDGE D (top 14.2)
  G.ents.add(new SwoopBat(G, 72, 18, 0, {phase:0.5, range:4, period:3.2, aggroR:5}));

  // =============================== BEAT 5 — THE LAMP GALLERY (x 68..90): PEAK — beacon · CP2 · quiet prop ===============================
  w4l3GhostPlank(G, 72, 15.4);                                       // beam-lit steps up to the lamp (+1.2)
  w4l3GhostPlank(G, 76, 16.4);                                       // (+1.0)
  w4l3GhostPlank(G, 80, 17.2);                                       // (+0.8)
  platform(G, 86, 17.6, 0, 8, 3.4, WOOD);                           // THE LAMP GALLERY (wide, spans 82..90)
  candyLine(G, [[70,14.9,0],[72,16.0,0]], 2); candyLine(G, [[74,16.9,0],[76,16.9,0]], 2);
  candyLine(G, [[78,17.7,0],[80,17.7,0]], 2); candyLine(G, [[82.5,18.2,0],[85,18.2,0]], 3);
  G.ents.add(new Heart(84, 18.6, 0));                                // mercy heart at the summit
  G.ents.add(new Checkpoint(86, 17.6, 1.8, 2));                      // CP2 — LIT (the light itself), right before the far stair
  G.ents.add(new BooBuccaneer(G, 90, 17.6, 0, {phase:0.4, range:9, speed:2.2}));  // patrols the gallery

  // THE BEACON — the rotating lamp whose sweep reveals the ghost planks. Lamp core pulses; two beam blades spin on
  // the beam clock; one real ghost-green PointLight (the district's language). Live (animated), not baked.
  { const beacon = new THREE.Group(); beacon.position.set(86, 21, -1.5);
    W4L3_beaconCore = new THREE.Mesh(geo('sph',0.85,10,9), new THREE.MeshLambertMaterial({color:W4PAL.lantern, emissive:W4PAL.lantern, emissiveIntensity:1.2}));
    const housing = mesh('cyl',[1.05,1.15,1.5,12], mat(W4PAL.hullD)); housing.position.y=-1.4;
    const cap = mesh('cone',[1.15,1.0,12], mat(W4PAL.brass)); cap.position.y=1.1;
    beacon.add(W4L3_beaconCore, housing, cap);
    W4L3_beacon = new THREE.Group();                                  // the spinning blades
    for(let s=0;s<2;s++){
      const blade = new THREE.Mesh(geo('cone',3.0,17,4,1,true), new THREE.MeshBasicMaterial({color:W4PAL.lantern, transparent:true, opacity:0.14, side:THREE.DoubleSide, depthWrite:false}));
      blade.rotation.z = Math.PI/2 + s*Math.PI; blade.position.set(s? -8.5:8.5, 0, 0);
      W4L3_beacon.add(blade);
    }
    beacon.add(W4L3_beacon); S.add(beacon);
    W4L3_lampLight = new THREE.PointLight(W4PAL.lantern, 44, 24); W4L3_lampLight.position.set(86, 21, 0); S.add(W4L3_lampLight);
  }
  // the lighthouse tower itself, standing in the near-background under the lamp (baked)
  { const t = new THREE.Group();
    for(let i=0;i<6;i++){ const seg=mesh('cyl',[1.75-i*0.13, 1.95-i*0.13, 3.3, 12], i%2?mat(W4PAL.woodL):mat(W4PAL.hullD)); seg.position.set(86, 1.65+i*3.3, -7); t.add(seg); }
    const gallery=mesh('cyl',[2.1,2.1,0.8,12], mat(W4PAL.brass)); gallery.position.set(86, 20.5, -7); t.add(gallery);
    const rail=mesh('cyl',[2.2,2.2,0.14,12], mat(W4PAL.verdigris)); rail.position.set(86, 20.95, -7); t.add(rail);
    deco.add(t); }

  // THE QUIET PROP (never signposted): the old lighthouse-keeper's LOG, still open on its lectern — the candle
  // burned down but still faintly lit, spectacles folded beside it. He kept the light... and then the sea went out,
  // and he never came back to close the book. Story-readers will feel it; everyone else climbs past to the beacon.
  { const q = new THREE.Group();
    const legM = mat(W4PAL.woodD);
    const top = mesh('box',[0.95,0.09,0.62], legM); top.position.set(0,0.52,0); top.rotation.x=-0.32;
    for(const [lx,lz] of [[-0.38,0.22],[0.38,0.22],[-0.38,-0.22],[0.38,-0.22]]){ const lg=mesh('cyl',[0.05,0.05,0.52,5], legM); lg.position.set(lx,0.26,lz); q.add(lg); }
    const pageL = mesh('box',[0.36,0.02,0.46], emat(0xe8e2d0,0xe8e2d0,0.2)); pageL.position.set(-0.19,0.64,0); pageL.rotation.set(-0.32,0,0.09);
    const pageR = mesh('box',[0.36,0.02,0.46], emat(0xe8e2d0,0xe8e2d0,0.2)); pageR.position.set(0.19,0.64,0); pageR.rotation.set(-0.32,0,-0.09);
    const spine = mesh('box',[0.05,0.04,0.48], mat(W4PAL.hullD)); spine.position.set(0,0.65,0); spine.rotation.x=-0.32;
    const candle = mesh('cyl',[0.05,0.06,0.16,7], mat(0xd6cdba)); candle.position.set(0.56,0.7,0.16);
    const flame = mesh('sph',[0.05,6,5], emat(W4PAL.lantern,W4PAL.lantern,1.0)); flame.position.set(0.56,0.83,0.16); flame.scale.set(1,1.5,1);
    const specs = mesh('tor',[0.06,0.014,4,10], mat(W4PAL.brass)); specs.rotation.x=Math.PI/2; specs.position.set(-0.42,0.68,0.19);
    q.add(top, pageL, pageR, spine, candle, flame, specs);
    q.position.set(89, 17.6, 1.7); q.rotation.y=-0.35; deco.add(q); }

  G.ents.add(new SwoopBat(G, 82, 21, 0, {phase:0.8, range:3.5, period:3.0, aggroR:5}));  // owns the air over the gallery

  // =============================== BEAT 6 — THE FAR STAIR (x 90..124): MASTER — descend under a 2nd Wraith ===============================
  w4l3GhostPlank(G, 94, 16.0);                                       // beam-lit descent (-1.6)
  w4l3GhostPlank(G, 98, 14.4);                                       // (-1.6)
  w4l3GhostPlank(G, 102, 12.8);                                      // (-1.6)
  platform(G, 106, 11.4, 0, 4, 3, HULL);                            // LEDGE E (wreck-plank; spans 104..108)
  candyLine(G, [[92,16.9,0],[94,16.4,0]], 2); candyLine(G, [[96,15.0,0],[98,14.7,0]], 2);
  candyLine(G, [[100,13.4,0],[102,13.1,0]], 2);
  // the SECOND Rigging Wraith rides x94..108 at wireY 17.4 (faster clock) — swoops as you thread the descent
  G.ents.add(new RiggingWraith(G, 101, 17.4, 0, {x1:94, x2:108, period:4.6, phase:0.6, swoopDrop:2.8, tele:0.5}));
  G.ents.add(new BonkLantern(G, 106, 12.6, 0, 'shield'));            // a Gummy Shield tucked on the high line (route reward)
  w4l3GhostPlank(G, 110, 9.8);                                       // (-1.6)
  w4l3GhostPlank(G, 114, 8.2);                                       // (-1.6)
  w4l3GhostPlank(G, 118, 6.6);                                       // (-1.6)
  platform(G, 122, 5.0, 0, 4, 3, WOOD);                             // LEDGE F (spans 120..124) — steps down to the seabed
  candyLine(G, [[108.5,11.9,0],[110,10.4,0]], 2); candyLine(G, [[112,8.8,0],[114,8.7,0]], 2);
  candyLine(G, [[116,7.2,0],[118,7.1,0]], 2);
  G.ents.add(new SwoopBat(G, 114, 12, 0, {phase:0.3, range:4, period:3.4, aggroR:5}));

  // =============================== BEAT 7 — THE KEEPER'S DOOR (x 124..168): finish ===============================
  groundX(G, 124, 168, SEA);
  signPost(G, 128, 1.7, -0.1, "THE KEEPER'S DOOR. You climbed to the lamp and read its rhythm - the Captain out where the sea used to be fears exactly that light. Through here.");
  G.ents.add(new BooBuccaneer(G, 134, 0, 0, {phase:0.2}));           // one last ground ghost on the run-out
  candyLine(G, [[126,0.9,0],[129,0.9,0]], 3);
  candyLine(G, [[144,0.9,0],[147,0.9,0],[150,0.9,0]], 3);
  G.ents.add(new Crow(151, 0.95, 2.3));
  exitGate(G, 160);

  // =============================== DECO · DEEP · MOON · PARALLAX ===============================
  // shore & run-out scenery (baked): wreck ribs, dock cranes, dead coral, tide pools, foreground silhouettes
  deco.add(shipwreckRib(-5, -6, 1.4));
  deco.add(dockCrane(14, -7.5, 1.15));
  deco.add(deadCoral(6, -3, 1.4)); deco.add(deadCoral(22, 2.6, 1.3));
  deco.add(tidePoolDeco(18, 2.4, 1.1)); deco.add(tidePoolDeco(140, -2.4, 1.1));
  deco.add(crate(-2.4, 0, 2.6, 1.0)); deco.add(crate(-1.6, 0, 2.6, 0.85));
  deco.add(shipwreckRib(146, -6, 1.5));
  deco.add(dockCrane(158, -7.5, 1.05));
  deco.add(deadCoral(132, -3, 1.4)); deco.add(deadCoral(150, 2.6, 1.3));
  // foreground silhouettes (z>0) framing the shore ends
  deco.add(deadCoral(27, 3.4, 1.7)); deco.add(deadCoral(126, 3.4, 1.7));
  // the rigging wires the wraiths ride — thin hemp lines up in the dark (baked)
  { const wm=mat(W4PAL.ropeD);
    const w1=mesh('cyl',[0.03,0.03,10,5], wm); w1.rotation.z=Math.PI/2; w1.position.set(52,12.4,0); deco.add(w1);
    const w2=mesh('cyl',[0.03,0.03,14,5], wm); w2.rotation.z=Math.PI/2; w2.position.set(101,17.4,0); deco.add(w2); }
  S.add(bakeGroup(deco));

  // dead coral fans deep in the void floor — the "don't fall" read under the whole climb (sunk below the lane)
  { const deep = new THREE.Group();
    for(const [x,z] of [[36,-1.4],[50,1.2],[66,-1.6],[80,1.4],[98,-1.4],[112,1.6]]) deep.add(deadCoral(x, z, rand(1.3,1.9)));
    deep.position.y = -6; S.add(bakeGroup(deep)); }

  // a low teal harbor moon behind the tower
  const moon = mesh('circ',[5,28], emat(0xd6fff4,0xc6ffe8,0.85)); moon.position.set(40,17,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0x8ffff0, transparent:true, opacity:0.13, depthWrite:false}));
  moonH.position.set(40,17,-31.2); S.add(moonH);

  // three-depth Ghost Harbor skyline (wreck ribs / dock+galleon+lighthouse / dry-dune hills + brine glow)
  w4Parallax(S, -8, 170);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 28, 124, 'harbor');       // the one tower void between the two shore spans — the whole climb hangs over it

  // exit + the D4 tail. clutter placed manually on the two GROUND spans only (the middle is all void/tower)
  w4LevelFinish(G, -8, 170, null);
  w4Clutter(G, -8, 28, 'harbor');
  w4Clutter(G, 124, 168, 'harbor');

  return {spawnX: 0, exitX: 160};
}

function updateW4L3(G, dt){
  updateLevelCommon(G, dt);
  // THE BEAM CLOCK — deterministic from level start. One sweep per period; the reveal wave travels left->right,
  // flaring each ghost plank as it passes (the planks are always solid — this is a READING challenge, not a trap).
  W4L3_beamT += dt;
  const period = 3.6, w = TAU/period;
  const sweep = (W4L3_beamT % period) / period;                       // 0..1
  if(W4L3_beacon) W4L3_beacon.rotation.y = W4L3_beamT * w;            // the visible blades sweep in sync
  if(W4L3_beaconCore) W4L3_beaconCore.material.emissiveIntensity = 1.1 + Math.sin(W4L3_beamT*w)*0.6;
  if(W4L3_lampLight) W4L3_lampLight.intensity = 42 + Math.sin(W4L3_beamT*w)*16;
  for(const pk of W4L3_planks){
    let d = sweep - pk.u; d = ((d % 1) + 1) % 1;                      // fraction of a cycle since the beam last found this plank
    const flare = Math.max(0, 1 - d*5), f2 = flare*flare;            // sharp flare, quick fade (~0.7s bright per 3.6s)
    pk.mat.emissiveIntensity = 0.14 + f2*1.7;
    pk.mat.opacity = 0.5 + f2*0.5;                                    // dim & ghostly in the dark, solid-bright in the light
  }
}

W4_LEVELS.push({id:'w4l3', district:'w4', name:'THE LIGHTHOUSE', build:buildW4L3, update:updateW4L3, parTime:160});

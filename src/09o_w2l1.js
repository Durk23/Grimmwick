// ============ W2-1 — RAVENMOOR GATE (District 2, Level 1 — the cemetery's cold welcome) ============
// The graveyard on-ramp: harder and TENSER than the Pumpkin Patch, but still the district's front
// door. Signature gimmick: the TOMBSTONE-HOP RHYTHM — flat-topped grave slabs you flow across in a
// hopping cadence — twisted by CROW-FLOCK AIR PRESSURE (DiveCrows: a fixed patrol loop, a CAW, a
// pull-up, then a snapshot dive; a sidestep always beats it). Full introduce->twist->escalate->master arc:
//   INTRODUCE  the hop on SAFE ground over a scuttling Gravemite (beat 1)
//   TWIST      one friendly gap + the first lone crow (beat 2); then the hop OVER A VOID with a crow
//              diving and the district's first Golden Pumpkin dangled up a committed double (beat 3)
//   BREATHE    the Urn Garden — a Restless Urn gamble in a clear pocket, a fresh grave, a Skelly (beat 4)
//   ESCALATE   THE MURDER — a two-crow flock wheeling over a saw-toothed crossing (beat 5)
//   MASTER     the grand two-span crossing — a crow over span one, a shy Boo drifting span two
//              (stare-freeze is the counter), a refuge island between — into the inner GATE (beat 6)
// Cold moonlit cemetery throughout (w2 SURFACE parallax / ambience / deco — mausoleums, iron fences,
// weeping angels, bone piles). Structured chaos, not clutter: 9 threats over ~192 units, singles and
// telegraphed set-pieces with real breathing room. Deterministic to the pebble — fixed placements,
// fixed dive clocks, seeded rand() only inside baked cosmetic deco. No Math.random on the critical path.
function buildW2L1(G){
  const S = G.scene;
  levelBegin(G);
  G.lightPools = [];   // D2 darkness contract (no Wisps in a surface level, but honour it — hero lanterns still pool warmth)

  // palette handles for this course
  const GA  = 0x323b31;   // cold graveyard turf
  const GB  = 0x2d3730;   // the tended garden plot (cooler, darker)
  const GC  = 0x343247;   // grey-violet stone by the inner gate
  const GST = 0x4a4660;   // carved rest-stone (refuge island + the high grave-ledge)

  // ---- baked tombstone stepping-stones: a flat tomb SLAB you land on + a headstone marker behind ----
  // Collider = the flat top (axis-aligned, always level to stand on). Visuals bake into `graves` (one
  // draw call). Over a void, baseY drops so the slab reads as a monument rising from the hollow.
  const graves = new THREE.Group();
  const hopStone = (x, topY, opts={})=>{
    const w = opts.w!==undefined?opts.w:1.7, d = opts.d!==undefined?opts.d:2.2;
    const baseY = opts.baseY!==undefined?opts.baseY:0, h = topY - baseY;
    G.world.addBox(x, baseY, 0, w, h, d, {});                                   // the standable top sits at topY
    const body = mesh('box',[w, h, d*0.86], mat(W2PAL.stone)); body.position.set(x, baseY+h/2, 0);
    const lipCol = new THREE.Color(W2PAL.stoneL).multiplyScalar(1.18).getHex();
    const lip = mesh('box',[w, 0.12, d*0.86+0.16], mat(lipCol)); lip.position.set(x, topY-0.02, 0);   // landing beacon
    const marker = new THREE.Group();                                          // a headstone at the BACK edge (out of the landing lane)
    const mSlab = mesh('box',[w*0.66,0.9,0.26], mat(W2PAL.stoneD)); mSlab.position.y=0.45;
    const mCap  = mesh('cyl',[w*0.33,w*0.33,0.26,10], mat(W2PAL.stoneD)); mCap.rotation.x=Math.PI/2; mCap.position.y=0.9;
    const moss  = mesh('sph',[0.16,6,5], mat(W2PAL.moss)); moss.position.set(-w*0.18,0.28,0.12); moss.scale.set(1.2,0.7,0.4);
    marker.add(mSlab,mCap,moss); marker.position.set(x, topY, -d*0.33); crook(marker,0.05);
    graves.add(body, lip, marker);
  };
  // a candy arc tracing one hop from stone-top to stone-top (teaches the cadence, telegraphs the jump)
  const hopCandy = (xa,ya,xb,yb,n=4)=>{
    candyLine(G, [[xa, ya+0.5, 0],[(xa+xb)/2, Math.max(ya,yb)+1.2, 0],[xb, yb+0.5, 0]], n);
  };

  // =============================== BEAT 1 — THE GATE (x -8..22): introduce the hop, safe over ground ===============================
  groundX(G, -8, 22, GA);
  signPost(G, 1.5, 1.6, -0.2, 'RAVENMOOR CEMETERY. Mind the crows — they remember faces. And mind your step: some of the stones mind you back.');
  w2Lantern(G, 3, 0, -1.8, {light:true, lightR:12});          // the gate's one warm glow — hero light #1
  G.ents.add(new BonkLantern(G, 6, 1.4, 0, 'shield'));         // a gentle gift for the cold welcome
  // THE SALT CRYPT — the district's armoury: a glowing ward-crypt in a clear FOREGROUND pocket just off
  // the gate lane. It has NO ambush, so opening is always a safe, deliberate act (CLEAR-PATCH honoured —
  // the nearest patrol, the Gravemite at x13, is >5u off). Grants the persistent SALT SHAKER (spin flings
  // salt that pops ghosts/wisps/gravemites); it CARRIES level-to-level through District 2, lost only on a
  // death — re-arm lanterns wait in 2-3 and 2-5. Placed early so the player arms up for the whole cemetery.
  { const sc = new SaltCrypt(5, 0, 2.0, -0.2);
    G.ents.add(sc); G.coffins.push(sc);
    G.world.addBox(5, 0, 2.0, 1.5, 0.9, 1.9, {}); }             // solid off-lane plinth (never blocks the z=0 run)
  hopStone(9, 1.0); hopStone(12.5, 1.3); hopStone(16, 1.1); hopStone(19.5, 1.4);
  hopCandy(9,1.0, 12.5,1.3, 3); hopCandy(12.5,1.3, 16,1.1, 3); hopCandy(16,1.1, 19.5,1.4, 3);
  G.ents.add(new Gravemite(G, 13, 0, 0, {range:3, axis:'x', speed:4.1}));  // knee-high pest scuttling UNDER the hop lane — livelier (+14%) — hop past, or drop-stomp it
  candyLine(G, [[-6,0.9,0],[-4,0.9,0],[-2,0.9,0]], 3);

  // =============================== BEAT 2 — FIRST GAP & FIRST CROW (x 22..42): the air lane arrives ===============================
  groundX(G, 22, 30, GA);
  signPost(G, 24, 1.6, 0.15, 'The dead here keep to themselves. The CROWS do not.');
  hopStone(32, 1.3, {baseY:-4});                               // one stone over the first (friendly) void — two tiny hops
  groundX(G, 34, 45, GA);
  G.ents.add(new DiveCrow(G, 30, 4.2, 0, {phase:0, period:4.4, range:6, aggroR:6}));   // learn the caw->dive in isolation
  hopCandy(30,0.0, 32,1.3, 3); hopCandy(32,1.3, 34,0.0, 3);
  candyLine(G, [[36,0.9,0],[38.5,0.9,0]], 2);
  G.ents.add(new Checkpoint(40, 0, 1.4, 0, {noLight:true}));

  // =============================== BEAT 3 — THE HOLLOW (x 45..67): TWIST — hop the void under a diving crow + the GOLD ===============================
  // The gimmick's real face: the same cadence, now over a drop, a crow weaving your arcs, and the
  // district's first Golden Pumpkin dangled up a committed double-jump — visible the entire crossing.
  w2Lantern(G, 44, 0, -1.8);                                   // the last warm light before the void (emissive only — no light cost)
  const holl = [[47,1.5],[50.5,1.9],[54,1.6],[57.5,2.0],[61,1.6],[64.5,1.4]];
  for(const [x,ty] of holl) hopStone(x, ty, {baseY:-5});
  for(let i=0;i<holl.length-1;i++) hopCandy(holl[i][0],holl[i][1], holl[i+1][0],holl[i+1][1], 3);
  G.ents.add(new DiveCrow(G, 54, 5.0, 0, {phase:0.6, period:4.2, range:6, aggroR:6}));
  // GOLDEN PUMPKIN idx 0 — VISIBLE BUT TRICKY: a floating grave-ledge up a double off the tall stones,
  // over the void with the crow harassing. Thin slab (never blocks the low rhythm below it).
  platform(G, 52, 4.5, 0, 2.0, 2.4, GST);
  { const mk = new THREE.Group();                              // a headstone crowning the high ledge (baked)
    const s = mesh('box',[1.0,0.9,0.26], mat(W2PAL.stoneD)); s.position.y=0.45;
    const c = mesh('cyl',[0.5,0.5,0.26,10], mat(W2PAL.stoneD)); c.rotation.x=Math.PI/2; c.position.y=0.9;
    mk.add(s,c); mk.position.set(52, 4.5, -0.8); crook(mk,0.05); graves.add(mk); }
  candyLine(G, [[50.5,2.6,0],[51.4,4.0,0],[52,4.9,0]], 4);     // traces the double up to the ledge
  G.ents.add(new GoldPumpkin(52, 5.2, 0, 0));
  groundX(G, 67, 74, GA);
  G.ents.add(new Checkpoint(70, 0, 1.4, 1, {noLight:true}));
  candyLine(G, [[68,0.9,0],[70.5,1.3,0],[72.5,0.9,0]], 3);     // breadcrumb out of the hollow — the landing never reads as a full stop

  // =============================== BEAT 4 — THE URN GARDEN (x 74..96): breather · the Restless Urn · a Skelly ===============================
  groundX(G, 74, 96, GB);
  w2Lantern(G, 79, 0, -1.8, {light:true, lightR:12});          // warm pool over the garden — hero light #2
  // QUIET STORYTELLING PROP (never signposted): a fresh grave with a single pale flower, off in the
  // foreground. Story-readers pause; everyone else walks past. A recent burial, in a town of the risen.
  { const fg = new THREE.Group();
    const mound = mesh('box',[1.8,0.34,1.3], mat(0x2a2118)); mound.position.y=0.17;   // dark fresh soil
    const hs = mesh('box',[0.7,0.9,0.16], mat(W2PAL.stoneL)); hs.position.set(0,0.75,-0.55);
    const hc = mesh('cyl',[0.35,0.35,0.16,10], mat(W2PAL.stoneL)); hc.rotation.x=Math.PI/2; hc.position.set(0,1.2,-0.55);
    const stem = mesh('cyl',[0.02,0.02,0.36,4], mat(0x4a6b3a)); stem.position.set(0.22,0.35,0.18);
    const bloom = mesh('sph',[0.1,7,6], emat(0xffd9ec,0xff9ecf,0.8)); bloom.position.set(0.22,0.56,0.18);
    fg.add(mound,hs,hc,stem,bloom); fg.position.set(77,0,1.4); fg.rotation.y=-0.15; S.add(fg); }
  // THE RESTLESS URN — a CLEAR pocket off the running lane; nearest patrol (the Skelly) is 7u away
  const urn = new RestlessUrn(82, 0, 1.5, -0.2);
  urn.promptLabel = '⚱️ Disturb the restless urn...?';
  G.ents.add(urn); G.coffins.push(urn);
  G.world.addBox(82, 0, 1.5, 1.5, 1.1, 1.5, {});               // solid urn plinth (off-lane, never blocks the path)
  G.ents.add(new Skelly(G, 91, 0, 0, {px:2}));                 // patrols 89..93 — the district's first real bruiser (7u clear of the urn)
  candyLine(G, [[74.5,0.9,0],[76,0.9,0]], 2);
  candyLine(G, [[93.8,0.9,0],[95.2,0.9,0]], 2);
  // HIGH ROAD — three floating grave-slabs over the garden's low walk: a SECOND visible route that
  // crosses in sight (the Heart glints overhead as you run the garden — the "next run I'm going up there" itch)
  // and keeps the breather ENGAGED (an optional climb) without adding intensity. Thin slabs; never block the low lane.
  platform(G, 77, 2.8, 0, 2.4, 2.2, GST); platform(G, 80.5, 3.0, 0, 2.4, 2.2, GST); platform(G, 84, 2.8, 0, 2.4, 2.2, GST);
  G.ents.add(new Heart(80.5, 3.7, 0));                         // the reward glinting over the low road
  candyLine(G, [[76,1.4,0],[76.5,2.4,0],[77,3.2,0]], 3);       // traces the entry double up
  candyLine(G, [[78.5,3.4,0],[82,3.4,0],[85.5,3.2,0]], 4);     // the high reward line + drop-off
  // spend-the-buff rhythm: a shield to cash straight into the murder bombardment (nervous players arm up here)
  G.ents.add(new BonkLantern(G, 94.5, 1.7, 0, 'shield'));

  // =============================== BEAT 5 — THE MURDER (x 96..124): ESCALATE — a crow flock over a saw-toothed crossing ===============================
  groundX(G, 96, 100, GA);
  w2Lantern(G, 100, 0, -1.8);                                  // landmark at the launch point (emissive only)
  G.ents.add(new Checkpoint(99, 0, 1.4, 2, {noLight:true}));
  G.ents.add(new Gravemite(G, 97, 0, 0, {range:2, axis:'x'}));  // a low pest right before you commit to the hop
  const murd = [[102,1.5],[105.5,2.2],[109,1.4],[112.5,2.3],[116,1.6],[119,1.3]];   // up/down/up — hop AND dodge at once
  for(const [x,ty] of murd) hopStone(x, ty, x===112.5?{baseY:-5,w:2.8,d:2.4}:{baseY:-5});   // widen the mid stone for a ground pest
  for(let i=0;i<murd.length-1;i++) hopCandy(murd[i][0],murd[i][1], murd[i+1][0],murd[i+1][1], 3);
  // ESCALATE BY ADDING A LANE (not more crows): a Gravemite skitters the WIDE landing stone right where
  // DiveCrow@113 dives — hop-timing + air-dodge + a ground pest at once, a true multi-lane pinch.
  G.ents.add(new Gravemite(G, 112.5, 2.3, 0, {range:0.8, axis:'x', speed:3.4}));
  // the flock: two crows on the same clock, offset half a cycle (homes 6u apart) — their dives stagger
  // into a dodge rhythm as you advance through their aggro zones. Each dive: caw, pull-up, snapshot, arc.
  G.ents.add(new DiveCrow(G, 107, 5.2, 0, {phase:0.0, period:3.7, range:6, aggroR:7.0}));   // tighter dive cadence + a touch more reach (harder D2 pass)
  G.ents.add(new DiveCrow(G, 113, 4.8, 0, {phase:2.0, period:3.7, range:6, aggroR:7.0}));   // still phase-offset ~½ cycle → alternating, never simultaneous
  groundX(G, 120, 134, GA);
  // the run-in to the master crossing no longer flatlines: a Coffin Hopper (its every-4th-hop TRIP is a
  // telegraphed free-stomp — a DISTINCT ground rhythm, not another gravemite) re-primes momentum into the finale.
  G.ents.add(new CoffinHopper(G, 126, 0, 0, {range:3.5, dir:1, hopDist:1.6}));   // patrols 122.5..129.5
  candyLine(G, [[122,1.0,0],[125,1.5,0],[128,1.5,0],[131,1.0,0]], 4);            // pulls toward the master gate at x134
  G.ents.add(new Checkpoint(133, 0, 1.4, 3, {noLight:true}));

  // =============================== BEAT 6 — THE MASTER CROSSING & THE INNER GATE (x 134..186): MASTER + finish ===============================
  signPost(G, 129, 1.6, 0.2, 'THE INNER GATE — beyond here the graves go DOWN. Watch the ghost on the last span: shy, but he shoves.');
  w2Lantern(G, 133, 0, -1.8);
  // span one — tombstones under a diving crow
  const sp1 = [[137,1.6],[140.5,2.1],[144,1.5],[147.5,2.2]];
  for(const [x,ty] of sp1) hopStone(x, ty, {baseY:-5});
  for(let i=0;i<sp1.length-1;i++) hopCandy(sp1[i][0],sp1[i][1], sp1[i+1][0],sp1[i+1][1], 3);
  hopCandy(134,0.0, 137,1.6, 3);
  G.ents.add(new DiveCrow(G, 142, 5.2, 0, {phase:1.0, period:4.2, range:6, aggroR:6}));
  // the refuge island — mercy mid-crossing: solid carved stone, a heart, a warm hero lantern (#3)
  groundX(G, 150, 154, GST);
  w2Lantern(G, 151, 0, -1.8, {light:true, lightR:12});
  G.ents.add(new Heart(152, 1.1, 0));
  // span two — the bolder span; a shy Boo drifts it. Moving RIGHT = facing him = he freezes (the counter,
  // a callback to every Boo you've stared down). A stomp-bounce off his crown is the bonus line.
  const sp2 = [[157,1.7],[160.5,2.1],[164,1.6],[167.5,1.4]];
  for(const [x,ty] of sp2) hopStone(x, ty, {baseY:-5});
  for(let i=0;i<sp2.length-1;i++) hopCandy(sp2[i][0],sp2[i][1], sp2[i+1][0],sp2[i+1][1], 3);
  hopCandy(154,0.0, 157,1.7, 3); hopCandy(167.5,1.4, 170,0.0, 3);
  G.ents.add(new Boo(G, 161, 1.9, 0, {speed:2.2, range:9}));
  // the final approach + THE RAVENMOOR GATE (the descent, foreshadowed)
  groundX(G, 170, 186, GC);
  w2Lantern(G, 172, 0, -1.8);
  G.ents.add(new Gravemite(G, 177, 0, 0, {range:2.5, axis:'x', speed:3.8}));   // one low pest keeps the master walk-in honest (owner: no empty stretches); 4.5u clear of the span-two Boo
  candyLine(G, [[171,0.9,0],[173.5,0.9,0],[176,0.9,0],[178.5,0.9,0]], 4);
  G._gateGlow = mesh('sph',[0.42,10,8], emat(W2PAL.crystal, W2PAL.crystal, 0.9));
  G._gateGlow.position.set(184, 2.5, -1.0); S.add(G._gateGlow);

  // =============================== DECO · MOON · AMBIENT LIFE · CLUTTER ===============================
  const deco = new THREE.Group();
  // the entrance gate
  deco.add(mausoleum(-6.5, -2.6, 1.0, true));
  deco.add(mausoleum(-6.5, 2.8, 0.85, false));
  deco.add(catacombArch(-2, -0.9, 1.1));
  ironFence(deco, -8,-3.2, 22,-3.2, 15);
  // background cemetery — placed over the SOLID strips only, so nothing floats above a void
  for(const [x,z,s,lit] of [[26,-2.6,0.8,false],[37,-3.0,0.9,true],[85,-2.8,0.95,false],[92,-3.2,0.85,true],[126,-2.9,0.9,false],[172,-2.6,1.15,true]])
    deco.add(mausoleum(x,z,s,lit));
  for(const [x,z] of [[19,-2.4],[43,2.4],[86,-2.2],[123,2.5],[132,-2.4],[173,2.4],[182,-2.6]])
    deco.add(weepingStatue(x,z));
  for(const [x,z] of [[8,-2.8],[37,1.6],[75,-2.6],[95,2.2],[121,-2.7],[178,2.0]]) deco.add(bonePile(x,z));
  for(const [x,z] of [[15,2.2],[84,2.3],[130,2.2],[181,2.2]]) deco.add(boneRow(x,z));
  ironFence(deco, 74,-3.2, 96,-3.2, 14);
  ironFence(deco, 120,-3.2, 134,-3.2, 9);
  ironFence(deco, 170,-3.2, 186,-3.2, 10);
  // foreground silhouettes (z>0) for depth framing, over solid strips
  for(const [x,z] of [[14,2.4],[41,2.6],[88,2.5],[127,2.6],[184,2.5]]) deco.add(grave(x,z));
  // the inner gate's DESCENT — a dark stairway falling into black behind the arch (foreshadows the catacombs)
  for(let i=0;i<4;i++){ const st=mesh('box',[2.6,0.4,1.6-i*0.2], mat(0x18142a)); st.position.set(178.5+i*0.35, -0.2-i*0.45, -1.3); deco.add(st); }
  S.add(bakeGroup(deco));
  S.add(bakeGroup(graves));

  // the cold moon, hung far behind the skyline
  const moon = mesh('circ',[6,28], emat(0xdfe8f2,0xdfe8f2,0.85)); moon.position.set(24,17,-34); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',9,28), new THREE.MeshBasicMaterial({color:0x9fb0cc, transparent:true, opacity:0.16, depthWrite:false}));
  moonH.position.set(24,17,-34.2); S.add(moonH);

  // reactive critters — perched crows that flap off when approached (one keeps vigil over the fresh grave)
  G.ents.add(new Crow(10, 0.95, -2.6));
  G.ents.add(new Crow(76, 0.95, 1.9));      // watching the fresh grave
  G.ents.add(new Crow(128, 0.95, -2.5));
  G.ents.add(new Crow(179, 0.95, 2.2));

  // three-depth cold-cemetery skyline behind everything
  w2Parallax(S, -8, 190, 'surface');

  // exit + the D2 tail (checkpoint/bats/ambience). clutterTheme null -> placed manually, so no clutter floats over a void.
  exitGate(G, 184);
  w2LevelFinish(G, -8, 190, 'surface', null);
  for(const [a,b] of [[-8,22],[22,30],[34,45],[67,74],[74,96],[96,100],[120,134],[150,154],[170,186]])
    w2Clutter(G, a, b, 'grave');

  return {spawnX: 0, exitX: 184};
}

function updateW2L1(G, dt){
  updateLevelCommon(G, dt);
  if(G._gateGlow) G._gateGlow.scale.setScalar(1 + Math.sin(G.time*2.5)*0.16);   // the inner gate breathes a cold light
}

W2_LEVELS.push({id:'w2l1', district:'w2', name:'RAVENMOOR GATE', build:buildW2L1, update:updateW2L1, parTime:150});

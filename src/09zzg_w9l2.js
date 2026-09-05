// ============ LEVEL 9-2 — THE MUSIC BOX GLADE (District 9 · Evergreen Deep · the whispering pines) ============
// POST-STORY MASTERY BAND (owner lock): Evergreen Deep plays past District 5 — but stays MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away).
// 9-2 is the district's SONIC HEART: the carols the festival never finished. CAROL BOO TRIOS sing in rounds
// — three voices on ONE shared clock, one verse each, and every verse ends in a swoop-lunge ON THE LAST BEAT.
// The singing IS the telegraph; the STARE is the counter (stage fright silences a verse). The level teaches
// the round, threads it through wreath-fire, hangs it over a candy-cane ravine, and then hands the baton to
// THE GIANT MUSIC BOX — whose rotation IS the third trio's carol clock. Platforming synced to the tune.
// 13 threats: 6 Carol Boos (two trios) + 2 Wreath Wisps + 2 Ornament Spiders (among decoy baubles) +
// 1 Tinsel Tangler + 2 Blizzard Bats. NO Golden Pumpkin (9-2 keeps none). THE DISTRICT WARP lives here:
// the QUIET CAROL chimes on the knoll spur (purple-lantern tell, low-high-middle). NO Leap of Faith
// (both of the game's two are placed and sacred).
//
//   BEAT 1 THE CHOIR HOLLOW (INTRODUCE)  x -8..34   — CP0 (noLight). The Advent Stump in its clear pocket,
//          the round-sign, the conductor's stand waiting in the snow. Trio ONE sings on safe flat ground:
//          learn verse->swoop->next verse with all the room in the world.
//   BEAT 2 THE WREATH LANE (TWIST)       x 34..63   — trio TWO strung ACROSS two Wreath Wisp ovals: thread
//          the holly-fire rings BETWEEN verses (candy waits in the holes — speedrun bait). The Tinsel
//          Tangler works the far end: its lasso steals SPEED, not hearts. Time attack begins.
//   BEAT 3 THE CANE-SWING RAVINE (ESCALATE) x 63..92 — three candy-cane pendulum platforms cross a dressed
//          crevasse while trio two's last singer works the near lip at your back: swoop timing vs swing
//          timing. HIGH ROAD: pine-trunk climb -> branch line (Ornament Spider among decoys, Blizzard Bat
//          above, bat-wings lantern at the crown). The island hearth's UPDRAFT crosses low road to high.
//   BEAT 4 THE BREATH (lantern · spur)   x 92..124  — THE lantern (x98, ~54% — the level's ONE lit
//          checkpoint), a shield lantern, the QUIET CAROL on its root-knoll spur, then the garland walk
//          under Ornament Spider #2 to the hollow's lip.
//   BEAT 5 THE GIANT MUSIC BOX (MASTER)  x 124..150 — the jewel over the deep hollow: walk onto a bottom
//          pin as it sweeps the case (step-up 0.2 — never a precision leap), ride the RIGHT side up as the
//          tune plays, leap from the top arc to the exit bough. Trio THREE is tuned to the box: carol
//          period = the drum's rotation (9.0s, both clocks phase 0) — the singers harmonize with the pins.
//   BEAT 6 THE FADING SONG (exhale · gate) x 150..186 — bough-stair descent under Blizzard Bat #2, the
//          last sign, the lit landing, the gate at 180.
//
// ROUTES (2-3 visible, junctions sighted): LOW = ground lane -> cane swings -> music box pins. HIGH = the
// pine-trunk climb at x62.5 onto the branch line over the whole ravine (its candy halo is visible from the
// boarding step — the "next run I'm going up there" itch); the island updraft at x77.5 crosses LOW to HIGH
// mid-ravine (the junction verb). EXPERT = the bat-wings crown prize (18s of flutter for the sprint to the
// hollow) and THE QUIET CAROL warp (knoll spur x108 -> x176): ring low-high-middle and skip the master —
// the speedrun meta. Nothing on the critical path waits longer than the box's 1.8s pin cadence.
//
// COMPARABLE HEIGHTS (owner law — all mains <=2.2 rise, <=4 tap / <=5.5 held gaps; swings/updraft/box gate the rest):
//   boarding step 65.2 rise 1.4 (tap) · step -> swing #1 near apex (67.63, 2.81): 1.4u across, 1.4 up, gated
//   by the swing verb (sign-taught, candy-traced) · swing transfers 73.37->75.63 and 81.37->83.63 = 2.26u
//   at MATCHED apexes (phases 0/1.7/0 on one 3.4s clock: facing apexes freeze at the same instant) · swing
//   #3 apex 89.37 -> far lip 92 = 2.1u drop-across (tap) · climb volume 0->5.3; branch hops rise <=0.4,
//   edge gaps 1.6-2.2 (tap) · knoll mound 1.35 (tap, solid from ground — no head-bonk underpass) · jetty:
//   lip 124 -> step 126.2 gap 2.2, rises 0.9/1.0 -> case base top 1.0 (gap 2.1) · base -> bottom pin top
//   1.2 = 0.2 STEP-UP (walk on; physics step-up 0.45) · pin at a~30 deg (140.6, 5.7, rising) -> exit ledge
//   edge 144.5 = 3.9u HELD with upward carrier assist (over-clearance) · bough stairs drop 1.4/1.7 then a
//   safe 2.9 drop to ground (falls onto ground are free — pits alone bill a heart).
// HEARTS ALWAYS: wisp rims, swoops, spiders, bats, ravine/hollow plunges = exactly 1 heart each (pit price
// via killY + lantern walk-back). The Tangler's lasso costs TIME only (40% slow 1.2s — spin shakes it).
// DETERMINISM: every clock fixed from level start — trio 1/2 share ONE 6.0s carol (phase 0, verses 0/1/2),
// the swings ride ONE 3.4s clock (phases 0/1.7/0), the box turns at TAU/9 (9.0s rotation) and trio 3 sings
// period 9.0 phase 0 — one shared downbeat. No Math.random on the critical path (rand() bakes deco only).
//
// ---- THE HARMONIZATION LEDGER (trio 3 vs the drum — both clocks start at 0 on build):
//   verse 0 (t 0..3, swoop 2.16..3.0)  menaces the JETTY hop (boo x127, tip 124.4..129.6, dip to y1.3)
//   verse 1 (t 3..6, swoop 5.16..6.0)  menaces the CROWN pass (boo x138 hover 8.9, dip to 7.3). Pins cross
//     the crown (a=90 deg) at t = 0.45, 2.25, 4.05, 5.85, 7.65 (+9k): ONLY the 5.85 crossing falls in the
//     bite — four safe crown rides per rotation, one contested (stare it down or take the earlier pin).
//   verse 2 (t 6..9, swoop 8.16..9.0)  menaces the EXIT LEDGE (boo x146.5 hover 7.9, tip 143.9..149.1,
//     dip to 6.3) — it punishes loiterers on the bough, not the leap itself (dismount windows barely clip).
//   Pin bottom-crossings (boarding beats): t = 1.35, 3.15, 4.95, 6.75, 8.55 — a pin every 1.8s, forever. ----

// ---- THE QUIET PROP: a conductor's stand knee-high to Pip, a tiny baton still resting across the desk,
// facing a neat semicircle of little snow-mounds arranged like a choir. Somebody taught the ghosts their
// rounds, and the choir is still holding the pose. Never signposted; fully baked; story-readers stop. ----
function w9l2Conductor(x, z){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.04,0.06,0.65,5], mat(W9PAL.barkD)); pole.position.set(x, 0.32, z); g.add(pole);
  const desk = mesh('box',[0.5,0.34,0.05], mat(W9PAL.bark)); desk.position.set(x, 0.72, z); desk.rotation.x=-0.5; g.add(desk);
  const baton = mesh('cyl',[0.015,0.02,0.42,4], mat(0xf0e6c8)); baton.position.set(x+0.04, 0.82, z+0.06); baton.rotation.z=1.35; baton.rotation.x=-0.4; g.add(baton);
  const snowD = mesh('sph',[0.09,5,4], mat(W9PAL.snow)); snowD.scale.y=0.5; snowD.position.set(x, 0.9, z-0.03); g.add(snowD);   // snow settled on the desk, undisturbed
  for(let i=0;i<6;i++){   // the choir — six little mounds in a patient semicircle, facing the stand
    const a = -0.5 + i/5;
    const mx = x + Math.sin(a*1.9)*1.5, mz = z + 1.1 + Math.cos(a*1.9)*0.6;
    const m2 = mesh('sph',[0.24+((i*7)%3)*0.03, 6, 5], mat(W9PAL.snow)); m2.scale.y=0.72; m2.position.set(mx, 0.16, mz); g.add(m2);
    const cap2 = mesh('sph',[0.1,5,4], mat(0xeef4ff)); cap2.position.set(mx, 0.34, mz); g.add(cap2);   // a tilted little head
  }
  return g;
}

// ---- decoy baubles (the Ornament Spider's cover): identical hang-state silhouettes — thread, ball, gilt
// cap — baked dead. By 9-2 the player checks EVERYTHING for legs; most of these are exactly what they seem. ----
function w9l2Decoy(x, y, color){
  const g = new THREE.Group();
  const thread = mesh('cyl',[0.015,0.015,1.3,4], mat(0x8a8f9a)); thread.position.set(x, y+0.75, 0); g.add(thread);
  const ball = mesh('sph',[0.34,10,9], emat(color, color, 0.35)); ball.position.set(x, y, 0); g.add(ball);
  const cap = mesh('cyl',[0.1,0.12,0.12,8], mat(0xc9a24a)); cap.position.set(x, y+0.38, 0); g.add(cap);
  const band = mesh('tor',[0.34,0.03,4,14], emat(0xffd23f,0xc9a24a,0.4)); band.rotation.x=Math.PI/2; band.position.set(x, y+0.05, 0); g.add(band);
  return g;
}

// ---- a climbable GIANT PINE TRUNK: chunky bark visual + branch stubs + a {type:'climb'} world volume
// (press UP to grab, boosted hop off the top — the constitution's fun-climb law). ----
function w9l2TrunkClimb(G, deco, x, h){
  const trunk = mesh('cyl',[0.55,0.8,h+0.8,9], mat(W9PAL.bark)); trunk.position.set(x, (h+0.8)/2-0.4, -0.55); deco.add(trunk);
  for(let i=0;i<5;i++){ const stub = mesh('cyl',[0.07,0.1,0.9,5], mat(W9PAL.barkD));
    stub.position.set(x+(i%2?0.45:-0.45), 0.9+i*(h-1.2)/4, -0.4); stub.rotation.z=(i%2?-1:1)*1.2; deco.add(stub); }
  for(let i=0;i<3;i++){ const tuft = mesh('cone',[0.7,1.1,6], mat(W9PAL.pine)); tuft.position.set(x+(i%2?0.7:-0.7), 1.6+i*(h-1.6)/2, -0.8); tuft.rotation.z=(i%2?-0.5:0.5); deco.add(tuft); }
  return G.world.addBox(x, 0, 0, 1.1, h, 1.2, {type:'climb'});
}

function buildW9L2(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;                 // needled snow-pack — every precision beat lives on grip
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();                // the festival strings that never came down

  // =============================== BEAT 1 — THE CHOIR HOLLOW (x -8..34): INTRODUCE the round ===============================
  groundX(G, -8, 66, SNOW);                 // one grippy forest-floor run to the ravine lip at 66
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  // SPAWN SAFETY (idle player at x0/z0, CP0 respawn at x2/z1.6): nearest FIXED threat = trio 1's westmost
  // singer (home 16, swoop tip 16-2.6=13.4, touch reach 13.4-0.66-0.4=12.3 -> 10.3u clear) · stump-ambush
  // spiders (opt-in, player-opened) unfold at x 4.6..9.4 on z0 threads — CP0's z1.6 sits outside their
  // 0.62 touchR, and the kit's 1s spawnGrace holds besides · tangler home 59.5 (worst lasso reach 50.8 ->
  // 48.8u) · wisp 1 worst rim 41.0 (39u) · no baubles or cane sweeps west of 66 · music-box pins fixed at
  // x>=135 · bats live past x81 even after post-dive drift. The hollow is a true classroom.
  signPost(G, 4.5, 1.7, -0.12, "The carolers never finished the last song. Three voices, three verses, round and round - and every verse ends in a POUNCE on the last beat. Stare a singer down and its part goes missing. Conduct accordingly.");
  // THE ADVENT STUMP — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math): trio 1's
  // westmost swoop tip is 13.4 (6.4u clear of x7) · tangler worst lasso 50.8 (43.8u) · wisp rims never west
  // of 41.0 (34u) · spiders 2's wake needs px within 3 of 116 · bats' worst trigger-drift 91.0 (84u) ·
  // trio 3 lives past 124. Opening door 25 is a deliberate, safe act; the ornament ambush emerges on the
  // kit's fixed scatter with 1s of harmless grace.
  { const st = new AdventStump(7, 0, -1.1, 0.35); G.coffins.push(st); G.ents.add(st); }
  // THE QUIET PROP (never signposted): the conductor's stand, the resting baton, the snow-mound choir
  deco.add(w9l2Conductor(11.5, -2.3));
  candyLine(G, [[10,0.9,0],[13,0.9,0]], 2);
  // TRIO ONE — the round, on open ground (ONE 6.0s carol, phase 0, verses 0/1/2 left to right). Each
  // singer's swoop covers home±2.6 and dips to y1.3 on the last beat of ITS verse only: walk the lane,
  // hear the voice, know the pounce. Hover 2.7 — a walker never touches a singer that isn't swooping.
  G.ents.add(new CarolBoo(G, 17,   2.7, 0, {verse:0, period:6.0, phase:0}));   // retune-verify: 16→17 buys the Advent Stump a clean 6.9u strict clear-patch margin
  G.ents.add(new CarolBoo(G, 20.5, 2.7, 0, {verse:1, period:6.0, phase:0}));
  G.ents.add(new CarolBoo(G, 25,   2.7, 0, {verse:2, period:6.0, phase:0}));
  candyLine(G, [[15,0.9,0],[18,1.2,0],[21,1.2,0],[24,0.9,0],[27,0.9,0]], 5);   // the dodge lane, traced between verses
  // two decorated pines + the first sagging garland — the hollow still dressed for the festival
  deco.add(w6Pine(13.5, -2.9, 1.3)); deco.add(w6Pine(27.5, -3.0, 1.4));
  for(const [ox,oy] of [[12.8,2.6],[14.2,3.4],[26.8,2.9],[28.3,3.8]]){ const cc=pick([W9PAL.ornR,W9PAL.ornG,0x7ae8ff]);
    const orn=mesh('sph',[0.16,6,5], emat(cc,cc,0.7)); orn.position.set(ox,oy,-2.6); deco.add(orn); }
  w6String(L, 13.5, 5.1, 27.5, 5.2, {z:-2.2});
  G.ents.add(new Crow(30, 0.95, 2.1));      // forest crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE WREATH LANE (x 34..63): TWIST — thread the round ===============================
  signPost(G, 37.5, 1.7, 0.1, "Holly-fire wreaths: the RING burns, the HOLE forgives. Jump through the middle - between verses, if you please.");
  // THE WISP LANE (retune-verify fix: trio two is GONE — three trios blew the 13-threat census its own
  // header promised; the two wisps + the tangler carry this beat, and the missing choir IS the story:
  // the round that used to sing here stopped mid-verse). Both wisps ride ONE 6.0s clock (phases 1.5/4.5).
  G.ents.add(new WreathWisp(G, 44.5, 2.3, 0, {phase:1.5, rx:2.2, ry:0.7, period:6.0}));
  G.ents.add(new WreathWisp(G, 57, 2.4, 0, {phase:4.5, rx:2.4, ry:0.8, period:6.0}));
  G.ents.add(new Candy(44.5, 2.3, 0));      // in wisp 1's hole — the speedrun bait (thread, don't wait)
  G.ents.add(new Candy(57, 2.4, 0));        // in wisp 2's hole — same dare, faster company
  candyLine(G, [[36,0.9,0],[39,0.9,0]], 2);
  candyLine(G, [[42.5,1.1,0],[44.5,1.6,0],[46.5,1.1,0]], 3);   // the threading arc, drawn through the lane
  candyLine(G, [[51,0.9,0],[55,0.9,0]], 2);
  signPost(G, 49.8, 1.7, -0.1, "Mind the tinsel-tangler: its loop steals SPEED, not hearts. A quick spin shakes the glitter. Racers, you have been warned.");
  // TINSEL TANGLER — the time attack (patrol 57.1..61.9, wakeR 5.5, 0.7s glitter-twirl telegraph, loop
  // reach ~wakeR+3.2 = 8.7 -> worst 50.8..68.2). Its lasso costs 1.2s at 40% — a heartless toll booth at
  // the ravine door. Sign readers at z1.7 sit outside the loop's 1.0 z-catch.
  G.ents.add(new TinselTangler(G, 59.5, 0, 0, {phase:0, range:2.4, dir:1, speed:1.4, wakeR:5.5, lassoP:4.0}));
  deco.add(w6Pine(35, -3.1, 1.1)); deco.add(w6SnowmanDeco(50.5, -2.6, 0.7, 0.4));

  // =============================== BEAT 3 — THE CANE-SWING RAVINE (x 63..92): ESCALATE — swoop vs swing ===============================
  // The crevasse (66..92, winter-dressed). Trio two's LAST singer (home 54, tip 56.6) and the tangler
  // (loop to 68.2, z-gated) keep the boarding honest: board during verses 0/1, or stare verse 2 quiet.
  // Worst pinch at the lip = trailing verse + tangler loop + the pit itself = 3 systems (cap 4 holds).
  signPost(G, 62.2, 1.7, 0.08, "Candy canes swing true. Board at the TOP of the arc, where the world holds its breath - and hop cane to cane when both bow to each other.");
  // HIGH-ROAD JUNCTION — the trunk climb (visible branch-candy halo overhead sells the route from here)
  const climbTop = 5.3;
  w9l2TrunkClimb(G, deco, 62.5, climbTop);
  candyLine(G, [[62.5,2.2,0],[62.5,4.2,0]], 2);   // rhythm candy up the bark (fun-climb law)
  platform(G, 65.2, 1.4, 0, 2, 1.5, W9PAL.bark);  // the boarding step — a snow-capped stump shelf
  candyLine(G, [[66.3,2.2,0],[67.6,3.4,0]], 2);   // the boarding arc, traced to swing #1's near apex
  // THREE CANE SWINGS on ONE 3.4s clock (phases 0 / 1.7 / 0): apexes 67.63/73.37 · 75.63/81.37 · 83.63/89.37
  // at y2.81. Opposite phases mean facing apexes FREEZE at the same instant — the 2.26u transfers are taps
  // between two held breaths. Fixed pendulums, fixed forever.
  w9CaneSwing(G, {x:70.5, pivotY:5.6, len:4.0, amp:0.8, period:3.4, phase:0});
  w9CaneSwing(G, {x:78.5, pivotY:5.6, len:4.0, amp:0.8, period:3.4, phase:1.7});
  w9CaneSwing(G, {x:86.5, pivotY:5.6, len:4.0, amp:0.8, period:3.4, phase:0});
  candyLine(G, [[74.5,3.5,0],[80.4,3.6,0]], 2);   // the two transfer moments, marked mid-air
  candyLine(G, [[90.6,3.3,0],[91.8,1.2,0]], 2);   // the dismount line onto the far lip
  // THE HEARTH ISLAND — low-road refuge + the LOW->HIGH crossing: a woodcutter's chimney still breathing.
  // Jump into the smoke column and the warm lift carries you to the branch line (junction verb, visible
  // from both routes). A missed swing transfer lands here instead of the spikes — mercy with a bonus exit.
  platform(G, 77.5, 0.7, 0, 2.4, 1.6, W9PAL.bark);
  w9Updraft(G, 77.5, {w:1.8, top:6.6, baseY:0.7});
  candyLine(G, [[77.5,1.6,0],[77.5,3.4,0],[77.5,5.0,0]], 3);   // the column, traced upward
  // THE BRANCH LINE (high road, y5.5-6.0, edge gaps 1.6-2.2, rises <=0.4)
  platform(G, 65.8, 5.5, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 69.6, 5.8, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 73.4, 5.6, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 77.8, 6.0, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 81.9, 5.7, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 85.9, 6.0, 0, 2.2, 1.4, W9PAL.pineD);
  platform(G, 89.8, 5.5, 0, 2.4, 1.4, W9PAL.pineD);
  candyLine(G, [[66,6.4,0],[70,6.7,0],[74,6.5,0],[82,6.6,0],[90,6.4,0]], 5);   // the sky halo — the itch, visible from the swings
  // ORNAMENT SPIDER #1 — hangs in the b3->b4 hop lane among THREE dead-honest decoys (hangY 7.6, reels
  // 5.1..7.6 on a 2.8s thread clock, wakeR 3). The gap it guards is the high road's toll: pass when it
  // reels HIGH, or stomp the bauble that blinked.
  deco.add(w9l2Decoy(71.9, 7.4, W9PAL.ornG)); deco.add(w9l2Decoy(74.1, 7.7, 0x7ae8ff)); deco.add(w9l2Decoy(77.3, 7.5, W9PAL.ornE));
  G.ents.add(new OrnamentSpider(G, 75.5, 7.6, 0, {phase:0.6, dropY:5.1, wakeR:3.0, period:2.8, color:W9PAL.ornR}));
  // BLIZZARD BAT #1 — owns the crown airspace (patrol 81..86 at y7.8, squeak telegraph, snapshot dive).
  // Worst trigger-drift reach 86+4+2=92 — 6u short of the lit lantern. High-road pinch = spider + bat +
  // pit = 3 systems (cap holds; the swings below never share the bat).
  G.ents.add(new BlizzardBat(G, 83.5, 7.8, 0, {phase:0.9, range:2.5, period:3.5, aggroR:4}));
  G.ents.add(new BonkLantern(G, 85.8, 7.2, 0, 'bat'));   // the crown prize: 18s of wings for the sprint to the hollow (expert line)
  pitDressing(G, 66, 92, 'winter');
  G.ents.add(new Crow(64.2, 0.95, 2.3));    // forest crow #2 — at the lip, staring into the ravine (the house tell: a crow marks an edge)

  // =============================== BEAT 4 — THE BREATH (x 92..124): lantern · the Quiet Carol spur ===============================
  groundX(G, 92, 124, SNOW);
  G.ents.add(new Heart(94.5, 1.0, 0));                       // mercy after the ravine, before the exam's last page
  G.ents.add(new BonkLantern(G, 96.3, 1.5, 0, 'shield'));    // armor for the box
  // THE lantern — the level's ONE lit checkpoint (x98 of a 180u run = 54%). Rest-pocket math, idle player
  // at 98 (z1.6): swing #3's worst seat reach 89.37+0.5=89.87 (8.1u clear) · bat #1 worst trigger-drift 92
  // (6u) · spider #2 wakes only within 3 of x116 (15u) and its thread never leaves x116 · trio 3's westmost
  // swoop tip 124.4, touch 123.7 (25.7u) · tangler worst loop 68.2 (29.8u) · bat #2 worst reach 147.3
  // (49u) · music-box pins fixed at x>=135 · the Quiet Carol is passive · no baubles placed in this level.
  // The pocket is a true breath.
  G.ents.add(new Checkpoint(98, 0, 1.6, 1));
  candyLine(G, [[95.5,0.9,0],[97,0.9,0]], 2);
  // THE QUIET CAROL — the district warp, on its root-knoll spur (a solid mound off the racing line: hop it
  // or skip it). The lone PURPLE lantern-glow overhead is the learned tell. Ring the chimes LOW, HIGH,
  // MIDDLE (spin beside each) and the pines open the old sled path: warp to x176, just shy of the gate,
  // with the level's full candy bonus. The chime riddle is the skill gate; once per run.
  { const kn = new THREE.Group();
    const mound = mesh('sph',[2.0,9,7], mat(W9PAL.bark)); mound.scale.set(1.0,0.72,0.7); mound.position.set(108, 0.55, 0); kn.add(mound);
    const capK = mesh('sph',[1.9,9,7], mat(W9PAL.snow)); capK.scale.set(0.95,0.5,0.62); capK.position.set(108, 1.05, 0); kn.add(capK);
    for(let i=0;i<3;i++){ const root = mesh('cyl',[0.09,0.14,1.4,5], mat(W9PAL.barkD)); root.position.set(106.9+i*1.1, 0.35, 0.7); root.rotation.z=0.9-(i*0.9); kn.add(root); }
    deco.add(kn); }
  G.world.addBox(108, 0, 0, 3.4, 1.35, 2.4, {});             // the knoll — solid from the ground (no underpass, no head-bonk)
  G.ents.add(new QuietCarol(G, 108, {warpX:176, candy:40}));
  candyLine(G, [[106.6,2.6,0],[109.4,2.6,0]], 2);
  deco.add(w6Pine(104.5, -3.0, 1.2)); deco.add(w6Pine(111.5, -2.9, 1.3));
  // THE GARLAND WALK — Ornament Spider #2 hangs over the approach lane among two decoys (hangY 4.6, reels
  // 1.1..4.6, wakeR 3): it rattles, unfolds 0.6s, then sweeps the whole lane on its thread — pass on the
  // up-reel. The garland overhead sells the disguise.
  deco.add(w6Pine(113, -2.8, 1.4)); deco.add(w6Pine(120.5, -2.9, 1.4));
  w6String(L, 113, 5.4, 120.5, 5.5, {z:-1.9});
  deco.add(w9l2Decoy(113.2, 4.5, W9PAL.ornE)); deco.add(w9l2Decoy(118.8, 4.7, W9PAL.ornG));
  G.ents.add(new OrnamentSpider(G, 116, 4.6, 0, {phase:1.7, dropY:1.1, wakeR:3.0, period:3.0, color:0x7ae8ff}));
  candyLine(G, [[114.2,0.9,0],[116,0.9,0],[117.8,0.9,0]], 3);   // the pass-on-the-up-reel rhythm
  signPost(G, 120.6, 1.7, -0.1, "The Great Music Box. Walk onto a pin as it sweeps the case, rise with the RIGHT side, leap at the crown. It has waited a hundred years for somebody who knows the tune.");

  // =============================== BEAT 5 — THE GIANT MUSIC BOX (x 124..150): MASTER — ride the tune ===============================
  // The deep hollow (124..150, winter-dressed). The jetty steps to the case; the case BASE gets a matching
  // collider (top y1.0 — the kit's base mesh spans 0.4..1.0 exactly): stand INSIDE the machine while the
  // bottom pins sweep past at top 1.2 — a 0.2 STEP-UP, so boarding is a walk, never a precision leap
  // (mill-wheel law: cadence 1.8s, no stop demanded). Ride the right side up; the drum plays each pin's
  // note as it crosses the comb. TRIO THREE sings the box's own rotation (period 9.0, phase 0 — see the
  // harmonization ledger up top). Master pinch = trio + pit + pins = 2 threat systems.
  platform(G, 127.3, 0.9, 0, 2.2, 1.5, W9PAL.bark);          // jetty step 1 (verse 0's swoop dips to 1.3 here — its verse only)
  platform(G, 130.9, 1.0, 0, 2.2, 1.5, W9PAL.bark);          // jetty step 2
  G.world.addBox(138, 0.4, 0, 7.8, 0.6, 3.2, {});            // the case base — matches the kit's base mesh exactly
  w9MusicBox(G, {x:138, y:4.2, r:3.0, speed:TAU/9, pins:5}); // THE JEWEL — 9.0s rotation, 5 pins, pentatonic comb
  G.ents.add(new CarolBoo(G, 127,   2.9, 0, {verse:0, period:9.0, phase:0}));   // the jetty singer
  G.ents.add(new CarolBoo(G, 138,   8.9, 0, {verse:1, period:9.0, phase:0}));   // the crown singer (stare = turn and face it mid-ride)
  G.ents.add(new CarolBoo(G, 146.5, 7.9, 0, {verse:2, period:9.0, phase:0}));   // the exit-bough singer
  candyLine(G, [[128.4,1.8,0],[132,1.9,0]], 2);              // the jetty line
  candyLine(G, [[135,1.9,0],[137,1.9,0]], 2);                // "walk on here" — the bottom-pin sweep, traced
  candyLine(G, [[140.9,3.4,0],[141.3,5.2,0]], 2);            // the right-side rise
  G.ents.add(new Candy(138, 7.8, 0));                        // the crown note
  candyLine(G, [[142.3,6.5,0],[144,6.4,0]], 2);              // the dismount arc — THE racing line off the top
  platform(G, 146, 6.0, 0, 3, 1.6, W9PAL.pineD);             // the exit bough (verse 2 punishes loitering here, never the leap)
  pitDressing(G, 124, 150, 'winter');

  // =============================== BEAT 6 — THE FADING SONG (x 150..186): exhale, bookend, gate ===============================
  groundX(G, 150, 186, SNOW);
  platform(G, 150.2, 4.6, 0, 2.6, 1.5, W9PAL.pineD);         // bough stair 1 (drop 1.4)
  platform(G, 153.8, 2.9, 0, 2.6, 1.5, W9PAL.pineD);         // bough stair 2 (drop 1.7, then a free 2.9 drop to ground)
  // BLIZZARD BAT #2 — contests the descent (patrol 153.5..158.5 at y5.2; worst reach 147.3..164.7 — it
  // grazes the exit bough's edge, which is the point: dismount and GO). Exit pinch = trio verse 2 + bat = 2.
  G.ents.add(new BlizzardBat(G, 156, 5.2, 0, {phase:1.6, range:2.5, period:3.7, aggroR:4.2}));
  candyLine(G, [[151,5.5,0],[154.6,3.8,0]], 2);              // the stair line
  candyLine(G, [[160,0.9,0],[163.5,0.9,0]], 2);
  G.ents.add(new Crow(163, 0.95, 2.2));     // forest crow #3 — unbothered, as ever
  signPost(G, 168.5, 1.7, -0.1, "Past the glade the round still turns - three voices, then the box, then the quiet. You walked the whole tune and it never once caught you flat. The conductor would have bowed.");
  candyLine(G, [[172,0.9,0],[175,0.9,0]], 2);
  deco.add(w6LightPost(173, -1.9, 3)); deco.add(w6LightPost(180.5, -1.9, 3));
  w6String(L, 173, 2.95, 180.5, 2.95, {z:-1.8});             // the last string — a landing worth lighting
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(179, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 180);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  deco.add(w6Pine(-5.5, -2.9, 1.3)); deco.add(w6Pine(94.5, -3.1, 1.2)); deco.add(w6Pine(152.5, -2.9, 1.4)); deco.add(w6Pine(184, -2.8, 1.3));
  deco.add(w6SnowmanDeco(159.5, -2.6, 0.7, 0.5)); deco.add(w6GiftBox(170.8, -2.2, 0.7));
  // the exit bough's tree — a great trunk holding the dismount platform (visual only; the platform is the collider)
  { const bt = mesh('cyl',[0.6,0.9,6.6,9], mat(W9PAL.bark)); bt.position.set(146.8, 2.7, -0.9); bt.rotation.z=0.08; deco.add(bt);
    const bb = mesh('cyl',[0.16,0.22,3,6], mat(W9PAL.barkD)); bb.position.set(146, 5.6, -0.5); bb.rotation.z=Math.PI/2-0.1; deco.add(bb); }
  // FOREGROUND silhouettes (z>0): leaning pines + a fallen giant ornament framing the depth
  for(const [fx,fs,fr] of [[33,1.1,0.12],[76,1.2,-0.1],[133,1.3,0.08]]){
    const p = mesh('cone',[1.3*fs, 3.4*fs, 6], mat(0x0e1a26)); p.position.set(fx, 1.4*fs, 2.7); p.rotation.z=fr; deco.add(p);
  }
  { const bigOrn = mesh('sph',[0.9,10,8], mat(0x1a2432)); bigOrn.position.set(99.5, 0.5, 2.8); deco.add(bigOrn);
    const bigCap = mesh('cyl',[0.24,0.28,0.3,8], mat(0x2a3444)); bigCap.position.set(100.2, 1.1, 2.8); bigCap.rotation.z=-0.7; deco.add(bigCap); }
  S.add(bakeGroup(deco));

  // the winter moon through the canopy, low beyond the glade
  const moon = mesh('circ',[3.6,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(120, 15, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',5.8,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(120, 15, -30.2); S.add(moonH);

  w9Parallax(S, -8, 186);
  w9LevelFinish(G, -8, 186, null);          // null clutter: the span crosses two pits (w7l4 precedent) —
  w9Clutter(G, -8, 65.5, 'forest');         // ...so the solid spans are cluttered manually
  w9Clutter(G, 92.5, 123.5, 'forest');
  w9Clutter(G, 150.5, 186, 'forest');

  // festival strings live (shared mats + one twinkle ticker)
  w6LightsFinish(G, L);

  return {spawnX: 0, exitX: 180};
}

function updateW9L2(G, dt){
  updateLevelCommon(G, dt);
}

W9_LEVELS.push({id:'w9l2', district:'w9', name:'THE MUSIC BOX GLADE', build:buildW9L2, update:updateW9L2, parTime:160});

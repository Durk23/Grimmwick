// ============ LEVEL 7-1 — THE LONG WALK OUT (District 7 · Frostmere · Frozen Lake Fell) ============
// EXAM-BAND FROM THE FIRST STEP (owner call): Lake Fell opens one column right of D5 — everyone here has
// cleared Glimmerfields, so 7-1 INTRODUCES the district's centerpiece at heat: 12 threats, the CRACKING ICE
// as the signature gimmick (introduce→twist→escalate→master), CP0 + exactly ONE lit lantern at ~54%, and
// still MAIN-GAME FAIR — hearts always, every telegraph ≥0.6s, ≤4 simultaneous threats, fixed clocks, one
// good run away. Leaving the last fisher village onto the great white ice: a county of frozen lake under
// the aurora, worked by brass machines, walked by a sleeping bear. The loneliness IS the atmosphere — the
// only lights out here are the sky, the machines, and the one lantern you fight to.
//   BEAT 1 THE LAST FISHER VILLAGE      x -8..26   — CP0, the Fisher's Hut gamble in its clear pocket, the
//          MILL WHEEL at the fishery (ride a paddle to GOLDEN PUMPKIN #0 over the crown — visible-but-
//          tricky, glowing over the village the whole level), the last light string in thirty miles.
//   BEAT 2 THE FIRST STEP OUT (INTRO)   x 26..40   — a 2-panel CrackIce crossing between grippy shores,
//          budget 1.4 (the forgiving hello). The sign teaches the district's one law: the lake holds
//          walkers, not standers. The shoal beyond hides THE QUIET PROP in an up-heaved pane of ice.
//   BEAT 3 THE LONG RUNS (TWIST)        x 40..70   — fishing holes + the ICE ANGLER stalking beneath (its
//          glow follows your feet through the glass), then a 6-panel run at DEFAULT budget with penguin
//          traffic tobogganing across it. A Snow-Boo works the run — frozen solid it's a standable block,
//          and standing ON THE BOO doesn't feed a panel's crack budget: the sanctioned rest island.
//   BEAT 4 THE SLEEPWALKER'S SHORE      x 70..104  — ONE Somnambear dreams her old patrol on grippy snow
//          ("let sleeping bears walk"). The DEMO POCKET: two crack panels at the shore's edge with a frost-
//          crusted candy cache visible under the glass — wake her at the pocket and her slam SHATTERS the
//          near panel, popping the cache up through the opening (the interaction, shown ONCE, in a safe
//          spot; the reward for brave observation). THE lantern at x99 (~54%) caps the shore.
//   BEAT 5 THE POLISHER BASIN (ESCALATE) x 104..137.6 — a 14-panel basin trundled end-to-end by THE ICE
//          POLISHER. THE ROUTE CHOICE: ride her riveted roof (slow, dry, crack-proof — the machine as
//          moving refuge) or run the panels (fast, but the crack budget + her brush + the second Angler
//          under every panel you open). A Blizzard Bat dives the back half — the roof is safe from the
//          lake, never from the sky.
//   BEAT 6 THE MASTER STRETCH           x 137.6..176 — everything composed on one 8-panel run: a Polar Cub
//          bowling the lane (held-hop it, candy-arc-traced), a second bat on its own clock, the second
//          Snow-Boo whose frozen block is now load-bearing rest tech, then a second cub lane working the
//          far snow. Keep moving. That was always the lesson.
//   BEAT 7 THE FAR SHORE                x 176..190  — quiet. A sign, a crow, the gate. The fell ahead.
// Reads UNMISTAKABLY Lake Fell: W7PAL glass-white expanse under the deep 0x0a1428 night, the moon glade,
// pressure-ridge silhouettes near and far-shore village lights across miles of white, wind-driven snow,
// brass machine lanterns the only warmth. Light strings SPARINGLY (one, at the village — this district is
// darker and lonelier than Glimmerfields; its light is the aurora and the machines).
// Comparable heights (tap 1.8 / held 2.6 / double 3.3): the whole road is FLAT (lake) — rises are all
// contraption-gated: polisher roof top 1.8 (held 2.6, +0.8 over-clearance, candy-traced) · mill paddles
// board at ~0.7 at the wheel's bottom (tap) · frozen-boo perch ~1.7-2.0 (optional tech, never required).
// No jumpable void gaps anywhere — the openings in the lake are self-made and REFREEZE in 3.2s (kit
// guarantee: a route never soft-locks). HEARTS ALWAYS: the plunge, the holes, the brush, every enemy —
// 1 heart each, never more; the plunge charges heart + lantern walk-back via the kit's G.onPlayerFell.
// CRACK PANELS ARE SLICK (tag:'ice', kit default) — no beat ever demands a precision stop on one: every
// legal stop is a grippy shore, the polisher roof, or a frozen boo. Deterministic to the flake: polisher/
// wheel/cub/bat/panel clocks fixed from level start, fixed enemy phases, NO Math.random on the critical
// path (seeded rand()/drop-scatter only inside baked deco and payouts).
// THREATS (12): 1 Somnambear · 3 Frostbite Penguins · 2 Snow-Boos · 2 Ice Anglers · 2 Blizzard Bats ·
// 2 Polar Cub lanes. Plus machines: 1 Ice Polisher (brush hazard), 1 Mill Wheel (benign ride).
// GP: #0 only (the district's other two live deeper in the fell). NO BellBuoy here (another level hosts
// the district warp). NO Leap of Faith — both of the game's two are placed and sacred.

// ---- THE QUIET PROP: a child's crayon drawing of a smiling bear, frozen INTO the ice — an up-heaved pane
// at the shoal's edge, the paper caught mid-sink years ago, sketch lines still bright through the glass.
// Somebody out here loved that bear before it started sleepwalking. Never signposted; fully baked;
// story-readers stop dead at it, everyone else walks past. That's the point. ----
function w7l1CrayonSlab(x, z){
  const g = new THREE.Group();
  // the pane — pressure-heaved clear ice, tilted toward the road
  const glass = new THREE.Mesh(geo('box',1.7,1.35,0.16),
    new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.14, transparent:true, opacity:0.38}));
  glass.position.set(x, 0.72, z); glass.rotation.z = 0.07; g.add(glass);
  // the paper, caught deeper in — pale, edges gone soft
  const paper = mesh('box',[1.14,0.9,0.02], mat(0xe8e4d4)); paper.position.set(x, 0.7, z-0.055); paper.rotation.z = 0.07; g.add(paper);
  // crayon strokes (thin emissive lines, a kid's steady-enough hand): the bear — round, patient, SMILING
  const stroke = (px,py,r,arc,rz,col)=>{ const s=mesh('tor',[r,0.018,4,12,arc||TAU], emat(col,col,0.6)); s.position.set(px,py,z-0.035); s.rotation.z=rz||0; g.add(s); };
  stroke(x-0.08, 0.58, 0.27, TAU, 0, 0x9a6a3a);                    // body
  stroke(x+0.14, 0.92, 0.155, TAU, 0, 0x9a6a3a);                   // head
  stroke(x+0.06, 1.06, 0.045, TAU, 0, 0x9a6a3a);                   // ear
  stroke(x+0.24, 1.06, 0.045, TAU, 0, 0x9a6a3a);                   // other ear
  stroke(x+0.15, 0.86, 0.07, Math.PI, Math.PI, 0xd8434a);          // THE SMILE (red crayon, upside-down arc)
  for(const ex of [-0.05,0.07]){ const eye=mesh('sph',[0.022,4,4], emat(0x2a2a38,0x2a2a38,0.5)); eye.position.set(x+0.15+ex, 0.97, z-0.035); g.add(eye); }
  for(const [lx,rz2] of [[-0.22,0.25],[0.05,-0.2]]){ const leg=mesh('box',[0.03,0.16,0.018], emat(0x9a6a3a,0x9a6a3a,0.55)); leg.position.set(x+lx, 0.36, z-0.035); leg.rotation.z=rz2; g.add(leg); }
  stroke(x-0.42, 1.0, 0.085, TAU, 0, 0xe8b83a);                    // a scribbled sun (there hasn't been one for a while)
  for(let i=0;i<4;i++){ const a=i/4*TAU+0.4; const ray=mesh('box',[0.028,0.09,0.018], emat(0xe8b83a,0xe8b83a,0.55)); ray.position.set(x-0.42+Math.cos(a)*0.16, 1.0+Math.sin(a)*0.16, z-0.035); ray.rotation.z=a+Math.PI/2; g.add(ray); }
  const ground=mesh('box',[0.9,0.02,0.018], emat(0x5a8a4a,0x5a8a4a,0.5)); ground.position.set(x-0.05,0.31,z-0.035); ground.rotation.z=0.06; g.add(ground);   // a wobbly ground line
  // drifted snow holding the pane up
  const drift=mesh('sph',[0.75,8,6], mat(W6PAL.snow)); drift.scale.y=0.35; drift.position.set(x,0.05,z); g.add(drift);
  const chip=mesh('cone',[0.1,0.35,4], emat(W7PAL.glass,0x4a8ec8,0.35)); chip.position.set(x-0.75,0.2,z+0.1); chip.rotation.z=0.5; g.add(chip);
  return g;
}

// ---- the fishery shack (baked deco — the mill wheel needs a WORKPLACE): timber, one warm window, fish
// crates, and a push-sled half-buried where somebody stopped pushing. The last roof before the ice. ----
function w7l1Fishery(x, z){
  const g = new THREE.Group();
  const body=mesh('box',[3.2,2.4,1.8], mat(0x4a3c2e)); body.position.set(x,1.2,z); crook(body,0.04); g.add(body);
  const roof=mesh('box',[3.7,0.3,2.2], mat(0x342a20)); roof.position.set(x,2.55,z); roof.rotation.z=0.05; g.add(roof);
  const cap=mesh('box',[3.7,0.16,2.25], mat(W6PAL.pineSnow)); cap.position.set(x,2.78,z); cap.rotation.z=0.05; g.add(cap);
  const win=mesh('box',[0.5,0.5,0.1], emat(W6PAL.window,W6PAL.window,0.85)); win.position.set(x-0.7,1.45,z+0.92); g.add(win);
  const pipe=mesh('cyl',[0.09,0.09,0.9,6], mat(0x2a3048)); pipe.position.set(x+1.1,3.1,z); pipe.rotation.z=0.06; g.add(pipe);
  for(let i=0;i<3;i++){ const c=mesh('box',[0.6,0.4,0.5], mat(0x5a4a38)); c.position.set(x+2.2+(i%2)*0.3, 0.2+(i>1?0.42:0), z+0.4); crook(c,0.08); g.add(c); }
  // the sled: two runners and a board, nose in a drift — going nowhere
  const dr=mesh('sph',[0.5,7,5], mat(W6PAL.snow)); dr.scale.y=0.4; dr.position.set(x-2.6,0.08,z+0.8); g.add(dr);
  for(const s of [-1,1]){ const run=mesh('box',[1.1,0.05,0.05], mat(0x6a4a34)); run.position.set(x-2.3,0.14,z+0.8+s*0.2); run.rotation.z=0.2; g.add(run); }
  const board=mesh('box',[0.9,0.04,0.44], mat(0x5a4a38)); board.position.set(x-2.25,0.3,z+0.8); board.rotation.z=0.2; g.add(board);
  return g;
}

// ---- foreground pressure ridge (z>0 silhouettes — the lake fighting itself, framing the depth) ----
function w7l1Ridge(x, z, s=1){
  const g = new THREE.Group();
  const m1=mesh('box',[1.8*s,0.9*s,0.4], mat(0x131f38)); m1.position.set(x,0.3*s,z); m1.rotation.z=0.42; g.add(m1);
  const m2=mesh('box',[1.3*s,0.7*s,0.4], mat(0x18263f)); m2.position.set(x+0.9*s,0.26*s,z+0.1); m2.rotation.z=-0.5; g.add(m2);
  const sh=mesh('cone',[0.2*s,1.05*s,4], mat(0x1c2c48)); sh.position.set(x+0.25*s,0.75*s,z); sh.rotation.z=0.18; g.add(sh);
  return g;
}

function buildW7L1(G){
  const S = G.scene;
  levelBegin(G);
  // FRESH ANGLER MENU (defensive — the kit only ||=s this array, and it lives on G, not the scene: stale
  // holes from a previous area could give this level's Anglers phantom lunge points at old coordinates)
  G._anglerHoles = [];

  const SNOW = W6PAL.snowD;                 // grippy shore snowpack (the safe stuff — walk, stand, breathe)
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();                // the village's ONE light string (sparingly — this is the dark district)

  // =============================== BEAT 1 — THE LAST FISHER VILLAGE (x -8..26) ===============================
  groundX(G, -8, 26, SNOW);
  // CP0 — start (exam law: unlit). SPAWN SAFETY, idle player at x0..2: nearest hostile reach is Penguin #1's
  // worst-case toboggan floor 27.8 (patrol min 36.7 − slide 8.9) and it can't even WAKE until the player
  // stands at x≥31.7 · every other threat's reach starts x≥33 (see the hut pocket math below) · the mill
  // wheel's paddles sweep 9.75..18.25 and are machinery, not a threat. Untouchable at rest.
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));
  signPost(G, 5, 1.7, -0.12, "THE LONG WALK OUT. Last village for thirty miles, last grip underfoot for three. The lake ahead is one frozen county - and it has OPINIONS about visitors. Walk like you mean it.");
  // the last lights: one string between two posts, then nothing but aurora until the far shore
  deco.add(w6LightPost(-2, -1.8, 3)); deco.add(w6LightPost(4, -1.8, 3));
  w6String(L, -2, 2.95, 4, 2.95, {z:-1.7});
  candyLine(G, [[5,0.9,0],[8.5,0.9,0],[12,0.9,0]], 3);
  // THE FISHER'S HUT — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math):
  // nearest patroller is Penguin #1 (home 38.5, patrol min 36.7, max toboggan 36.7-8.9=27.8 → 20.8u clear) ·
  // Somnambear reach 80-(0.45s swipe 3.15 + touchR 1.25)=75.6 → 68u · Angler #1 active x≥33 AND it can only
  // bite at holes (nearest hole x42.8, 35u) · Snow-Boo #1 leashed chase floor x41 · cubs/bats live x117+.
  // The wheel's paddles sweep 9.75..18.25 — machinery, not a threat (benign nudge). Opening the hut is a
  // deliberate, safe act; its cub ambush spawns on the kit's 1s grace. All enemy reach ≥6u by 14u+ margin.
  { const hut = new FisherHut(7, 0, -0.9, 0.15); G.coffins.push(hut); G.ents.add(hut); }
  // THE MILL WHEEL at the fishery — the fell's machines introduced at their friendliest: six paddle-gondolas
  // on a fixed 0.5 rad/s clock. Board a paddle at the bottom (~0.7, a tap) as it swings low, ride the RIGHT
  // side up and around to the crown. GOLDEN PUMPKIN #0 floats over the crown at y8.8 (paddle top there 7.71,
  // dy 0.29 into the 1.5 pickup radius — collected standing, no leap needed): VISIBLE-BUT-TRICKY, glowing
  // over the village from anywhere in Beat 1. Contraption-gated height (comparable-heights law: the wheel IS
  // the verb, and the candy arc below traces the ride).
  w7MillWheel(G, {x:14, y:4.2, r:3.4, speed:0.5});
  G.ents.add(new GoldPumpkin(14, 8.8, 0, 0));
  candyLine(G, [[16.6,2.2,0],[17.3,4.6,0],[15.9,7.2,0]], 3);           // the paddle-ride, traced up the right side
  deco.add(w7l1Fishery(11, -3.2));
  G.ents.add(new Crow(20, 0.95, 2.3));                                 // fell crow #1 — flaps off as you commit to the ice
  signPost(G, 23, 1.7, 0.1, "THE LAKE HOLDS WALKERS, NOT STANDERS. Keep your feet moving and the ice keeps its temper. Stop to admire the view, and the view opens. The snow shoals grip - catch your breath THERE.");

  // =============================== BEAT 2 — THE FIRST STEP OUT (x 26..40): INTRODUCE the CrackIce ===============================
  // Two panels between grippy shores, budget 1.4 (vs the 1.1 default — the one mercy this district extends,
  // and the last). Stand and you get the full grammar: spiderweb → CREAK+shudder → shatter → the plunge
  // (heart + lantern walk-back via the kit). Panels are SLICK (kit default) — but nothing asks you to stop.
  w7CrackLake(G, 26, 30.8, {budget:1.4});
  candyLine(G, [[27.2,0.9,0],[29.6,0.9,0]], 2);                        // one candy per panel: touch, don't linger
  groundX(G, 30.8, 40, SNOW);                                          // the shoal — grippy, safe, and it keeps a secret
  // PENGUIN #1 — parked PAST the crossing (patrol 36.7..40.3, wakeR 5 → it can only trigger once the player
  // is at x≥31.7, i.e. already OFF the panels: the intro crossing stays pure). Squawk 0.6s, then the toboggan
  // — fought on grippy shoal snow, the fair way to meet one.
  G.ents.add(new FrostbitePenguin(G, 38.5, 0, 0, {phase:0.3, range:1.8, dir:-1}));
  // THE QUIET PROP — the crayon bear in the up-heaved pane, at the shoal's back edge. No sign. No arrow.
  deco.add(w7l1CrayonSlab(34.2, -1.4));

  // =============================== BEAT 3 — THE LONG RUNS (x 40..74.5): TWIST — traffic + the thing below ===============================
  // Solid slick ice with two fishing holes — the ICE ANGLER's menu. The holes are stepped-in hazards (a heart,
  // never more) with a 2.0u honest lane between their boxes (edges 43.6/45.6, candy centered at 44.6); the
  // Angler below needs ~2u of your lingering near an opening before its 0.7s glow+bubble telegraph, then the
  // lunge. HEARTS-ALWAYS discipline: NOTHING else is placed at the holes — the Angler is the holes' one voice.
  w6IceX(G, 40, 48);
  signPost(G, 40.8, 1.7, -0.1, "FISHING HOLES. Something pale down there reads your footsteps through the glass and knows exactly what a lingering snack looks like. Cross briskly. Fish politely.");
  w7FishHole(G, 42.8, 1.6);
  w7FishHole(G, 46.4, 1.6);
  candyLine(G, [[44.6,0.9,0],[47.4,0.9,0]], 2);
  // ANGLER #1 — home 46, range 13 → stalks x33..59: both holes plus the whole panel run beyond. Under solid
  // ice it is pure dread (the glow pacing your feet); every hole and every panel YOU open is its door.
  G.ents.add(new IceAngler(G, 46, 0, 0, {phase:0.4, range:13}));
  // THE 6-PANEL RUN at DEFAULT budget (1.1s) with PENGUIN TRAFFIC — the twist: the crack clock now shares
  // the lane with two toboggan clocks. Their squawks (0.6s) tell you when to hop; the panels tell you to
  // never stop deciding. Wake zones: #2 43.8..58.2 · #3 52.8..67.2 — overlap 52.8..58.2 where both can run.
  w7CrackLake(G, 48, 62.4);
  G.ents.add(new FrostbitePenguin(G, 51, 0, 0, {phase:0.9, range:2.2}));
  G.ents.add(new FrostbitePenguin(G, 60, 0, 0, {phase:1.7, range:2.2, dir:-1}));
  // SNOW-BOO #1 — works the run's heart (home 55, leashed chaseR 14 → active 41..69, floats home after).
  // THE SANCTIONED REST: stare it SOLID and stand on its block — you're on the boo's collider, not a panel,
  // so the crack budget never fills. The district's stand-still tech, taught mid-run where it matters.
  // Worst-case simultaneity at x~55: penguin #2 + penguin #3 + boo + (Angler only if a panel is open right
  // there — it opens behind you) = 3 typical, 4 momentary worst-case. At the cap, never over it.
  G.ents.add(new SnowBoo(G, 55, 0, 0, {phase:0.6, speed:2.0, range:9, freezeMax:2.6}));
  candyLine(G, [[49.2,0.9,0],[53.2,0.9,0],[57.2,0.9,0],[61.2,0.9,0]], 4);   // the run rhythm: a panel a stride
  w6IceX(G, 62.4, 70);                                                 // the breather shelf — slick but SOLID, no holes:
                                                                       // the mid-lake rest pocket (stand here all night);
                                                                       // grippy shore snow takes over at 70 (Beat 4's lip)

  // =============================== BEAT 4 — THE SLEEPWALKER'S SHORE (x 74.5..104): the bear + the demo ===============================
  // (The demo pocket's w7CrackLake call is deferred to the TAIL of this build — see the loud comment there:
  // the kit binds G._bearSlam to the LAST lake built, and the bear must be wired to THIS pocket.)
  groundX(G, 79.3, 104, SNOW);                                         // the shore proper (the pocket spans 74.5..79.3)
  groundX(G, 70, 74.5, SNOW);                                          // grippy lip before the pocket — wait on THIS side
  signPost(G, 72, 1.7, -0.12, "LET SLEEPING BEARS WALK. She dreams an old patrol and harms nobody who leaves her to it. Wake her and the whole floor remembers - every pane of it near her paws. Some folk call that a warning. Observant folk call it a KEY.");
  // THE SOMNAMBEAR — patrol 80..90 on grippy snow, asleep = a soft wall (touchDamage 0; hop her with a held
  // jump, 2.6 over her 1.9 back, or time your pass). Wake her (bump / hit / stand in her path): 0.7s rear-up
  // roar (telegraph law), ONE 7u/s blind swipe (reach ≤ patrol ± 4.4 incl. touchR → 75.6..94.4), then she
  // yawns and dreams on. Her wake-slam calls G._bearSlam r3.2 — from her patrol floor (x80) that reaches the
  // demo pocket's NEAR panel (cx 78.1, 1.9u) but not the far one (75.7, 4.3u) and no other lake in the level
  // (long runs end 62.4, basin starts 104): the demo fires exactly where designed, nowhere else.
  G.ents.add(new Somnambear(G, 85, 0, 0, {phase:0, range:5, speed:0.9, dir:-1}));
  // THE CACHE — a frost-crusted crate of the fisher's lost haul, visible under the near panel's glass all
  // level (temptation + observation): baked below at y-1.15 with candy-glints. When the pocket first opens
  // (the bear's slam is the designed key; a nerves-of-steel self-crack also counts — the lake doesn't ask
  // how), the watcher below pops the haul UP through the opening — candy fountains onto the ice, magnet
  // range, reachable before the 3.2s refreeze with seconds to spare. BURST candy is dropped, not placed:
  // the all-candy star never depends on waking a bear (stars stay honest).
  { const crate=mesh('box',[0.9,0.62,0.7], mat(0x4a3c2e)); crate.position.set(78.1,-1.15,0); crook(crate,0.06); deco.add(crate);
    const frost=mesh('box',[0.95,0.1,0.75], mat(W6PAL.pineSnow)); frost.position.set(78.1,-0.82,0); deco.add(frost);
    for(let i=0;i<4;i++){ const gl=mesh('sph',[0.07,5,4], emat(0xffd23f,0xffd23f,0.7)); gl.position.set(77.75+i*0.24,-0.72,0.18-(i%2)*0.3); deco.add(gl); } }
  candyLine(G, [[71,0.9,0],[73.2,0.9,0]], 2);
  candyLine(G, [[92,0.9,0],[95.5,0.9,0]], 2);
  G.ents.add(new Crow(92.5, 0.95, 2.2));                               // fell crow #2 — pointedly unimpressed by the bear
  // THE LANTERN — the level's ONE lit checkpoint (exam law: CP0 + one, x99 = 54% of the 198u walk).
  // REST-POCKET MATH, idle player at 99 (body 98.6..99.4): bear worst-case swipe reach 94.4 (4.2u clear;
  // an idle player can never wake her — path-wake needs |dx|<1.8, patrol max 90) · polisher brush leftmost
  // bite 103.8 at her x0 turn (4.4u clear of body edge) · Bat #1 trigger zone 117.5..130.5, −2u drift floor
  // 115.5 (16u) · Angler #2 bites only at openings, and no hole or panel exists within 5u of the lantern ·
  // cub lanes start x144 / end x161 (45u) · Boo #1 leash ceiling 69, Boo #2 leash floor 142 (both float
  // home from an idle player at 99). Untouchable at rest.
  G.ents.add(new Checkpoint(99, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 101, 1.5, 0, 'shield'));               // armor for the basin — the exam's essay question
  signPost(G, 102.4, 1.7, 0.1, "THE POLISHER works the night shift, end to end, and stops for NOBODY. Her roof is the driest road on the fell - climb aboard and ride. Her brush is NOT a handshake. Choose: her pace, or your feet.");

  // =============================== BEAT 5 — THE POLISHER BASIN (x 104..137.6): ESCALATE — machine vs feet ===============================
  // 14 panels, default budget, trundled by THE ICE POLISHER (fixed ping-pong 106↔135 at 2.2u/s — a 13s lap,
  // readable from the lip before you commit). THE ROUTE CHOICE, both lines candy-traced and both visible
  // from the lip (junction-sightline law): LOW/FAST — run the panels: crack budget + the brush (front-facing,
  // bites below y0.85 — hop the whole machine with a held 2.6 over her 1.8 roof, or step around her turn) +
  // Angler #2 beneath (home 120, range 16 → the WHOLE basin: every panel you open is its door — the lake
  // punishes standing twice now). SAFE/SLOW — a held jump onto her ROOF (top 1.8, +0.8 clearance): crack-
  // proof, brush-proof (rider at 1.8 > the brush's 0.85 ceiling), moving refuge... but not SKY-proof: Bat #1
  // dives the back half (patrol 121.5..126.5 at y5.2, aggro 4 → trigger 117.5..130.5, squeak-telegraphed
  // snapshot dive) — the honest trade printed on the route. Worst-case simultaneity: brush + bat + (Angler
  // needs an opening) = 2-3, cap respected.
  w7CrackLake(G, 104, 137.6);
  w7IcePolisher(G, {x0:106, x1:135, speed:2.2, phase:0});
  G.ents.add(new IceAngler(G, 120, 0, 0, {phase:1.1, range:16}));
  G.ents.add(new BlizzardBat(G, 124, 5.2, 0, {phase:0.5, range:2.5, period:3.6, aggroR:4}));
  candyLine(G, [[107,0.9,0],[113,0.9,0],[119,0.9,0],[125,0.9,0],[131,0.9,0]], 5);   // the panel line — a stride apiece
  candyLine(G, [[110,2.7,0],[118,2.7,0],[126,2.7,0],[134,2.7,0]], 4);               // the roof line, overhead the whole way
  G.ents.add(new Heart(126, 2.9, 0));                                  // roof-rider's prize — visible from the panels below:
                                                                       // "next run I'm riding that machine"
  groundX(G, 137.6, 143, SNOW);                                        // the far lip — grippy landing, a breath before the exam

  // =============================== BEAT 6 — THE MASTER STRETCH (x 143..176): everything, composed ===============================
  // 8 panels, three clocks, zero new rules: CUB LANE #1 bowls the run head-on (144→158 at 4.4u/s, fixed
  // roller clock — a 1.7-tall furry boulder: HELD-hop it, 2.6 vs 1.7, the candy arc traces the hop) while
  // BAT #2 dives on its own cycle (patrol 149.5..154.5 y5, trigger 145.5..158.5) and SNOW-BOO #2 (home 156,
  // active 142..170) drifts the lane. THE GRADUATION: freeze the boo ON the run and PERCH — the rest-island
  // tech from Beat 3, now load-bearing (let the cub pass under you, let the bat waste its dive). Then CUB
  // LANE #2 works the far snow (175→161, staggered clock, dodged on GRIP — fair ground for the last fight).
  // Simultaneity by zone: x144..158 cub1+bat2+boo = 3 · x161..175 cub2+boo(+bat drift edge 160.5) = 3. ✓cap
  w7CrackLake(G, 143, 162.2);
  G.ents.add(new PolarCub(G, 144, 0, 0, {x1:158, speed:4.4, phase:0, pause:1.2}));
  G.ents.add(new PolarCub(G, 175, 0, 0, {x1:161, speed:4.0, phase:1.6, pause:1.4}));
  G.ents.add(new BlizzardBat(G, 152, 5.0, 0, {phase:1.2, range:2.5, period:3.4, aggroR:4}));
  G.ents.add(new SnowBoo(G, 156, 0, 0, {phase:1.3, speed:2.1, range:9, freezeMax:2.6}));
  candyLine(G, [[144.2,0.9,0],[147,0.9,0]], 2);
  candyLine(G, [[149.5,1.0,0],[152,2.3,0],[154.5,1.0,0]], 3);          // the held-hop arc, traced over the cub lane
  candyLine(G, [[158.6,0.9,0],[161,0.9,0]], 2);
  groundX(G, 162.2, 190, SNOW);                                        // the far shore — cub lane #2's ground, then quiet

  // =============================== BEAT 7 — THE FAR SHORE (x 176..190) ===============================
  candyLine(G, [[168,0.9,0],[172,0.9,0],[176,0.9,0]], 3);
  G.ents.add(new Crow(181, 0.95, 2.4));                                // fell crow #3 — it walked. Obviously.
  signPost(G, 180, 1.7, -0.1, "FAR SHORE. You crossed the fell's front porch - the lake only gets deeper, colder, and more mechanical from here. Somewhere out there a bell-buoy still remembers the old channel. Sleep warm. You earned it.");
  exitGate(G, 186);

  // =============================== THE DEMO POCKET (built LAST — load-bearing build order) ===============================
  // ⚠️ DO NOT MOVE THIS CALL EARLIER: w7CrackLake OVERWRITES G._bearSlam with each call, binding the bear's
  // wake-slam to the most recent lake's panels. The Somnambear (patrol 80..90, slam r3.2) can only ever
  // reach THIS pocket (76.8..93.2 covers panel cx 78.1 alone) — so the pocket must be the LAST lake built
  // for the slam→shatter→cache demo to fire. Every other lake sits outside her reach; nothing else changes.
  const demoPanels = w7CrackLake(G, 74.5, 79.3, {budget:1.1});
  // the cache-watcher: pops the haul the first time the pocket opens (bear slam or self-crack — either way,
  // deterministic response to a player-driven key). cull:false — the moment must never be missed off-screen.
  G.ents.add({ dead:false, cull:false, isEnemy:false, fired:false, group:new THREE.Group(),
    update(dt, GG){
      if(this.fired) return;
      for(const p of demoPanels){
        if(p.open){ this.fired = true;
          candyBurst(GG, new THREE.Vector3(78.1, 0.5, 0), 14);         // the haul, up through the opening
          GG.fx.spawn(new THREE.Vector3(78.1, 0.3, 0), 0xffd23f, 14, {speed:3.5, life:0.6});
          AUDIO.goldPumpkin && AUDIO.goldPumpkin();
          window.UI && UI.toast('🍬 The old winter cache bobs up through the broken ice!');
          break;
        }
      }
    } });

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // shore pines where there's still soil for them (the ice itself stays bare — the loneliness read)
  deco.add(w6Pine(-6, -2.9, 1.2)); deco.add(w6Pine(1, -3.1, 1.0)); deco.add(w6Pine(22, -2.8, 1.1));
  deco.add(w6Pine(178, -3.0, 1.2)); deco.add(w6Pine(185, -2.7, 1.4)); deco.add(w6Pine(189, -3.1, 1.0));
  deco.add(w6SnowmanDeco(18, -2.5, 0.7, 0.4));                         // the village's own snowman, built RIGHT (they know the wrong kind)
  // FOREGROUND pressure ridges (z>0) framing the crossing — the lake's slow violence, silhouetted
  deco.add(w7l1Ridge(-3, 2.5, 1.1)); deco.add(w7l1Ridge(37, 2.6, 0.9)); deco.add(w7l1Ridge(66, 2.5, 1.2));
  deco.add(w7l1Ridge(100, 2.7, 1.0)); deco.add(w7l1Ridge(140, 2.5, 1.15)); deco.add(w7l1Ridge(183, 2.6, 0.95));
  S.add(bakeGroup(deco));

  // the winter moon, low over the far shore — the moon glade in the parallax lies straight beneath it
  const moon = mesh('circ',[3.8,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(96, 16, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.2,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(96, 16, -30.2); S.add(moonH);

  // three-depth Lake Fell skyline (pressure ridges / the far-shore village's thread of light / the great fells)
  w7Parallax(S, -8, 190);

  // the village's one light string comes alive (the rest of the level's light is aurora + machine lanterns)
  w6LightsFinish(G, L);

  // W7 tail (checkpoint/bats/ambience/aurora/retint), then clutter placed manually on SOLID spans only —
  // the w6l5 precedent: never bake clutter over CrackIce (props would float over open water), and the shoal
  // keeps itself bare so the crayon slab reads alone.
  w7LevelFinish(G, -8, 190, null);
  w7Clutter(G, -8, 25.5, 'lake');
  w7Clutter(G, 40, 48, 'lake');
  w7Clutter(G, 62.6, 74, 'lake');
  w7Clutter(G, 79.8, 103.5, 'lake');
  w7Clutter(G, 138, 142.5, 'lake');
  w7Clutter(G, 162.6, 190, 'lake');

  return {spawnX: 0, exitX: 186};
}

function updateW7L1(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none — the lakes, polisher, wheel, cubs, bats, and the cache-watcher are all cull:false
  // G.ents tickers on fixed clocks, and every enemy carries a fixed phase. The long walk out is identical
  // every attempt (determinism rule): death costs progress, never knowledge.
}

W7_LEVELS.push({id:'w7l1', district:'w7', name:'THE LONG WALK OUT', build:buildW7L1, update:updateW7L1, parTime:175});

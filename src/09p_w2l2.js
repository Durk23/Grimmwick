// ============ W2-2 — THE WEEPING ROWS (Ravenmoor Cemetery · surface→dusk) ============
// District 2's DARKNESS SHOWCASE. Signature gimmick: WISPS + LIGHT MANAGEMENT. Between the
// always-lit HAVENS the graveyard goes dark, and will-o-wisps hunt anyone caught in the black.
// The tool is w2DarkLantern: dark until you reach it, then it blooms a safe pool that makes every
// wisp recoil (the Wisp reads G.lightPools via playerLit()). Full kishotenketsu arc:
//   INTRODUCE (x9..24)  — one wisp, one relightable lantern: learn "reach the light = safe".
//   TWIST     (x37..45) — a dark VOID you cross by lighting a slab-candle mid-jump, two wisps over it.
//   ESCALATE  (x57..92) — a CHAIN of three dark lanterns, wisps + a Gravemite guarding the gaps.
//   MASTER    (x104..140) — the long dark run: thread lantern→lantern past wisps, a void, and a Skelly.
// Candy trails always point from one lantern to the next (the darkness's breadcrumbs). Ground reads
// literally darker in the dark stretches, warm where a lantern burns. 4 checkpoints, every one parked
// in an always-lit haven so a respawn is never into the black beside a wisp. Structured chaos, not
// clutter: 9 threats over ~160 units, all deterministic — fixed patrols, telegraphed lunges, and
// wisps that are HARMLESS the instant you stand in light (never a cheap hit). ~4 minutes; par 155.
//
// LIGHT-POOL LAYOUT (lane coverage, x-range a wisp-repelling pool spans on z=0):
//   Havens  (w2Lantern, lit from frame one):  H1 -3.8..7.8 · H2 24.2..35.8 · H3 45.2..56.8 ·
//                                             H4 92.2..103.8 · H5 139.2..150.8
//   Relights(w2DarkLantern, dark until reached, then bloom): L1 x16 · L2 x41(slab) · L3 x62 · L4 x76 ·
//                                             L5 x88 · L6 x110 · L7 x126 · L8 x136  (each ~±4.9u)
//   Real PointLights (budget): H1, H3, H5, L2, + the urn glow = 5 (< the ~6 cap); every other pool
//   reads by its warm ground-disc + emissive flame so the light stays cheap.
function buildW2L2(G){
  const S = G.scene;
  levelBegin(G);
  G.lightPools = [];   // D2 contract #1: reset before any lantern pushes its pool (levelBegin does this too)
  const HAV = 0x33424c, DARK = 0x212c34, STONE = 0x4a4660;   // lit-ground · dark-ground · slab

  // painterly cold graveyard backdrop (headstone skyline, cold hills, teal crypt-town)
  w2Parallax(S, -8, 152, 'surface');

  // ================= BEAT 0: THE GATE OF ROWS (x -8..9) — a warm, safe welcome =================
  groundX(G, -8, 9, HAV);
  w2Lantern(G, 2, 0, 1.5, {r:6, light:true, lightR:12});          // HAVEN 1 — lit from the start
  G.ents.add(new Checkpoint(2, 0, 1.4, 0, {noLight:true}));       // CP0 sits inside H1's pool
  signPost(G, 5, 1.8, -0.2, "THE WEEPING ROWS. Keep to the lanternlight, little one. What waits between the stones does not like to be seen. — R. Gravely, Sexton");
  candyLine(G, [[6,0.9,0],[10.5,0.9,0],[14.5,0.9,0]], 5);         // breadcrumb into the first dark

  // ================= BEAT 1: INTRODUCE — one wisp, one candle (x 9..24) =================
  // The teaching beat: past H1's glow the ground darkens and a single wisp drifts in. Walk up to
  // the dark lantern (it lights on proximity, like a checkpoint) and the wisp shrinks away. Gentle.
  groundX(G, 9, 24, DARK);
  G.ents.add(new Wisp(G, 12, 1.4, 0));                            // W1 — slow, telegraphed, out-walkable
  w2DarkLantern(G, 16, 0, 0.8, {r:5});                           // L1 — reach it to bloom the first safe pool
  candyLine(G, [[18,0.9,0],[22,0.9,0],[26,0.9,0]], 4);           // lit corridor L1 → H2 (the reward for lighting)

  // ================= BEAT 1½: HAVEN 2 (x 24..37) =================
  groundX(G, 24, 37, HAV);
  w2Lantern(G, 30, 0, 1.5, {r:6});                              // HAVEN 2 (emissive pool — no real light, budget)
  G.ents.add(new Checkpoint(30, 0, 1.4, 1, {noLight:true}));    // CP1
  signPost(G, 34, 1.8, 0.18, "The candle on the far slab still burns for someone. Reach it, and the wisps will hide their faces. Mind the sunken row. — R. Gravely");
  // the haven no longer flatlines: a Coffin Hopper primes the stomp-verb (its every-4th-hop TRIP is a free
  // stomp) the instant before the sunken-row void, and re-primes momentum on the way out.
  G.ents.add(new CoffinHopper(G, 34, 0, 0, {range:2.2}));       // patrols 31.8..36.2 (off-lane sign at z1.8 stays clear)

  // ================= BEAT 2: TWIST — the sunken row (void x 37..45) =================
  // A collapsed grave-row: a dark chasm with a lone stone SLAB standing in the middle, its candle
  // gone out. Two wisps hover over the breach. Hop to the slab and its candle relights (L2 blooms a
  // wide pool) — both wisps recoil, and the far hop lands safe. Falling costs a heart + a walk-back.
  platform(G, 41, 1.2, 0, 2.4, 3, STONE);                      // the standing slab — top y1.2, x39.8..42.2
  w2DarkLantern(G, 41, 1.2, 0, {r:5.5, light:true, lightR:11});// L2 — the dramatic mid-void relight
  G.ents.add(new Wisp(G, 38, 1.6, 0, {range:8}));              // W2 — presses the approach hop
  G.ents.add(new Wisp(G, 43, 1.6, 0, {range:8}));              // W3 — presses the far hop
  candyLine(G, [[35,0.9,0],[37.6,2.4,0],[40,1.9,0]], 4);       // arc onto the slab
  candyLine(G, [[42,1.9,0],[43.6,2.4,0],[46,0.9,0]], 4);       // arc off to solid ground

  // ================= BEAT 2½: HAVEN 3 (x 45..57) =================
  groundX(G, 45, 57, HAV);
  w2Lantern(G, 51, 0, 1.5, {r:6, light:true, lightR:12});      // HAVEN 3 — real light anchors the mid-level
  G.ents.add(new Checkpoint(51, 0, 1.4, 2, {noLight:true}));   // CP2
  signPost(G, 54, 1.8, -0.15, "Light the whole row, quick as you can. A dark you linger in is a dark that finds you.");

  // ================= BEAT 3: ESCALATE — the chain of candles (x 57..92) =================
  // Three dark lanterns in a row with real dark gaps between their pools. You dash gap → light →
  // dash gap → light. A wisp guards the first entry, a Gravemite skitters the middle gap (ground +
  // air = D2's first combos), a wisp holds the last gap. Candy threads every dash.
  groundX(G, 57, 92, DARK);
  w2DarkLantern(G, 62, 0, 0.8, {r:5});                         // L3
  w2DarkLantern(G, 76, 0, 0.8, {r:5});                         // L4
  w2DarkLantern(G, 88, 0, 0.8, {r:5});                         // L5
  G.ents.add(new Wisp(G, 59, 1.4, 0));                         // W4 — the entry dash (H3 edge → L3)
  G.ents.add(new Gravemite(G, 70, 0, 0, {range:3, speed:3.8}));// low pest in the L3→L4 gap (its own beat) — nudged +12%
  // AIRBORNE CASTER — D2's new ranged air threat: a floating skull-witch hovering over the open dark ground
  // between L3 and the gravemite, lobbing a slow arcing violet bolt at a SNAPSHOT of the player (one sidestep
  // beats it — never homing). Fires only while you're within ~9u AND still ahead of it: RUN PAST (reach L4's
  // light ~x71) to shut it off, or STOMP it (hp2). Its own high lane, clear of the gravemite's ground patrol
  // (67-73); 14u from CP2 so no respawn drops you under its fire. Deterministic clock; bolts land on solid ground.
  G.ents.add(new AirborneCaster(G, 65, 4.6, 0, {aggroR:9, arcX:1.5, arcY:0.4, period:3.2, tele:0.65, firstCast:1.2, hp:2}));
  G.ents.add(new Wisp(G, 82, 1.4, 0));                         // W5 — the L4→L5 gap
  candyLine(G, [[49,0.9,0],[54,0.9,0],[59,0.9,0]], 5);         // H3 → L3
  candyLine(G, [[64,0.9,0],[70,0.9,0],[74,0.9,0]], 5);         // L3 → L4 (traces past the gravemite)
  candyLine(G, [[79,0.9,0],[83,0.9,0],[87,0.9,0]], 5);         // L4 → L5
  candyLine(G, [[90,0.9,0],[94,0.9,0]], 3);                    // L5 → H4

  // ---- HIGH ROAD (the level's missing second route): a stone grave-ledge chain riding OVER the dark
  // L3–L5 corridor, launched from Haven 3's light. It crosses the low lane IN SIGHT — the low-roader
  // threading the black sees the Heart glinting overhead (the "next run I'm going up there" itch), and
  // the AirborneCaster@65 now arcs its bolts UP at high-road runners so the richer route is the harder one.
  platform(G, 55, 1.6, 0, 2.4, 2.8, STONE);                   // launch step, inside H3's safe glow
  platform(G, 61, 3.3, 0, 2.6, 2.8, STONE);                   // over L3
  platform(G, 67, 3.4, 0, 2.6, 2.8, STONE);                   // over the caster / gravemite
  platform(G, 73, 3.3, 0, 2.6, 2.8, STONE);
  platform(G, 79, 3.4, 0, 2.6, 2.8, STONE);
  platform(G, 85, 3.4, 0, 2.6, 2.8, STONE);
  G.ents.add(new Heart(73, 4.0, 0));                          // the reward, in sight of the low road
  candyLine(G, [[52,0.9,0],[54,1.4,0],[55.5,1.9,0]], 3);      // stair up into the light
  candyLine(G, [[57.5,2.0,0],[59,3.0,0],[61,3.6,0]], 3);      // up onto the first ledge
  candyLine(G, [[63.6,3.8,0],[65,4.2,0],[67,3.8,0]], 3);      // arc each high gap (D3 arc shape)
  candyLine(G, [[69.6,3.8,0],[71,4.2,0],[73,3.8,0]], 3);
  candyLine(G, [[75.6,3.8,0],[77,4.2,0],[79,3.8,0]], 3);
  candyLine(G, [[81.6,3.8,0],[83,4.2,0],[85,3.8,0]], 3);
  candyLine(G, [[85,3.6,0],[89,2.1,0],[92,0.9,0]], 4);        // descent back down into Haven 4

  // ================= BEAT 3½: HAVEN 4 + the RESTLESS URN (x 92..104) =================
  groundX(G, 92, 104, HAV);
  w2Lantern(G, 98, 0, 1.5, {r:6});                            // HAVEN 4 (emissive pool)
  G.ents.add(new Checkpoint(98, 0, 1.4, 3, {noLight:true}));  // CP3 — the last checkpoint, before the long dark
  // the D2 gamble, in a clear LIT pocket (CLEAR-PATCH LAW: no patrol within ~6u; the pool keeps it safe)
  const urn = new RestlessUrn(95, 0, 1.7, -0.2);
  G.ents.add(urn); G.coffins.push(urn);                       // updateLevelCommon renders its prompt + open()
  G.world.addBox(95, 0, 1.7, 1.6, 1.2, 1.6, {});             // solid plinth

  // ================= BEAT 4: MASTER — the long dark (x 104..140) =================
  // The mastery run. Only a few candles light the way; between them the dark stretches longer and the
  // wisps thicken. Light L6, thread the widest dark gap (with a sunken void and a wisp over it) to L7,
  // then a Skelly patrols the last dark thread to L8. Deterministic to the step — the "I know this
  // walk by heart" climax, right where Ravenmoor starts to slope down toward the catacombs.
  groundX(G, 104, 117.5, DARK);
  signPost(G, 101, 1.8, 0.2, "The long dark has but a few candles left. Watch your footing over the fallen row — and never, ever stop moving.");
  w2DarkLantern(G, 110, 0, 0.8, {r:5});                       // L6
  G.ents.add(new Wisp(G, 108, 1.4, 0, {speed:1.6}));         // W6 — the H4 edge → L6 dash (nudged +14% for the master run)
  candyLine(G, [[102,0.9,0],[106,0.9,0],[109,0.9,0]], 4);     // H4 → L6

  // the fallen row (void 117.5..120.5) — the MASTER's gimmick peak: escalate by ADDING A LANE. The wisp
  // presses the APPROACH; a fixed-clock DiveCrow owns the CROSSING (a moving snapshot-dive over a gap tops
  // the twist's two STATIC wisps). A fair 1-2 rhythm — never a simultaneous double-hit.
  G.ents.add(new Wisp(G, 114, 1.6, 0, {range:5, speed:1.6}));  // W7 — now presses the approach to the void
  G.ents.add(new DiveCrow(G, 119, 4.4, 0, {range:4, aggroR:6, period:4.0, phase:1.5}));  // owns the crossing
  candyLine(G, [[113,0.9,0],[116,1.7,0],[119,1.7,0],[123,0.9,0]], 6);   // arcs the void, L6 → L7

  groundX(G, 120.5, 134, DARK);
  w2DarkLantern(G, 126, 0, 0.8, {r:5});                       // L7
  // THE SET-PIECE (the master's memorable moment): THE LOST TOUR GROUP — six hand-holding skeletons
  // shuffling behind a guide-wisp through the darkest thread. Thread the intact (harmless) line, or break
  // it for a 4s scatter-chase in the black. Region-native catacomb comedy, and the last D1-reused Skelly is gone.
  G.ents.add(new LostTourGroup(G, 131, 0, 0, {range:3.5, speed:0.9}));   // shuffles 127.5..134.5 in the dark
  candyLine(G, [[129,0.9,0],[133,0.9,0],[136,0.9,0]], 4);     // L7 → L8 (traces the safe side past the line)
  w2DarkLantern(G, 136, 0, 0.8, {r:5});                       // L8 — the last candle before the light

  // ================= BEAT 5: HAVEN 5 + the gate (x 134..152) =================
  groundX(G, 134, 152, HAV);
  w2Lantern(G, 145, 0, 1.5, {r:6, light:true, lightR:12});    // HAVEN 5 — warmth returns; the relief
  candyLine(G, [[140,0.9,0],[144,0.9,0],[147,0.9,0]], 4);     // L8 → the gate
  G.ents.add(new Gravemite(G, 146, 0, 0, {range:2, speed:3.4}));   // one last beat so the walk to the gate never flatlines (skitters 144..148)

  // the quiet prop (never signposted): a child's small grave in the haven's glow, a knitted scarf
  // draped over the stone and one little candle still lit beside it — someone from the Quiet Side
  // still visits. (Ravenmoor is where Pip will find Granny Wick; her knitting is here first.)
  {
    const q = new THREE.Group();
    q.add(grave(0, 0, 0.1));
    const scarf = mesh('box',[0.95,0.14,0.26], emat(0x8a4a6e, 0x5a2e48, 0.35));   // warm knit, softly lifted
    scarf.position.set(0, 0.72, 0.12); scarf.rotation.z = 0.06; q.add(scarf);
    const cflame = mesh('sph',[0.09,7,6], emat(0xffe0a0, 0xffb02e, 1));           // a candle that never went out
    cflame.position.set(0.42, 0.32, 0.18); q.add(cflame);
    const cwax = mesh('cyl',[0.05,0.06,0.18,6], mat(0xe8e2d0)); cwax.position.set(0.42, 0.18, 0.18); q.add(cwax);
    q.position.set(141, 0, -2.7); S.add(q);
  }

  // ================= DECO: the weeping rows + graveyard dressing (all baked — one draw call) =================
  const deco = new THREE.Group();
  // wrought-iron railing along the back, split around the two voids
  ironFence(deco, -8,-3.6, 37,-3.6, 24);
  ironFence(deco, 45,-3.6, 117.5,-3.6, 45);
  ironFence(deco, 120.5,-3.6, 152,-3.6, 20);
  // the rows themselves — neat headstones front and back, void gaps left open
  for(let x=-6; x<150; x+=3.2){
    if((x>37&&x<45)||(x>117.5&&x<120.5)) continue;
    deco.add(grave(x, -2.9, rand(-0.16,0.16)));
    if(rand()<0.7) deco.add(grave(x+1.4, 2.9, rand(-0.16,0.16)));
  }
  // grieving-angel statues punctuating the rows (the level's namesake silhouette)
  for(let x=8; x<148; x+=14){
    if((x>37&&x<45)||(x>117&&x<121)) continue;
    deco.add(weepingStatue(x, (Math.floor(x/14)%2)?-4.4:4.2));
  }
  // mausoleums looming in the deep background
  for(const mx of [-3, 26, 56, 86, 116, 146]) deco.add(mausoleum(mx, -7.6, rand(0.8,1.1), rand()<0.5));
  // bone piles scattered off the path
  for(let i=0;i<9;i++){
    const bx = rand(-6,148); if((bx>37&&bx<45)||(bx>117.5&&bx<120.5)) continue;
    deco.add(bonePile(bx, rand()<0.5?-3.5:3.5));
  }
  S.add(bakeGroup(deco));

  // reactive ambient crows (flap off when Pip nears) — life among the stones
  G.ents.add(new Crow(20, 0.95, -2.7));
  G.ents.add(new Crow(70, 0.95, 2.8));
  G.ents.add(new Crow(125, 0.95, -2.6));

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 37, 45, 'grave');           // the sunken row (the L2 slab rises from the bed)
  pitDressing(G, 117.5, 120.5, 'grave');     // the fallen row

  // ================= tail: exit gate, ambience, bats, clutter (voids left clean) =================
  exitGate(G, 148);
  w2LevelFinish(G, -8, 152, 'surface', null);   // checkpoint/bats/cold-mist ambience; clutter placed by hand below
  // themed ground clutter over the SOLID strips only — nothing floats over the two voids
  w2Clutter(G, -8, 9,   'grave');
  w2Clutter(G, 9, 24,   'grave');
  w2Clutter(G, 24, 37,  'grave');
  w2Clutter(G, 45, 57,  'grave');
  w2Clutter(G, 57, 92,  'grave');
  w2Clutter(G, 92, 104, 'grave');
  w2Clutter(G, 104, 117.5, 'grave');
  w2Clutter(G, 120.5, 134, 'grave');
  w2Clutter(G, 134, 152, 'grave');

  return {spawnX: 0, exitX: 148};
}

// wisps + lanterns + checkpoints self-update through G.ents; light pools + prompts through
// updateLevelCommon. Nothing bespoke to tick — the darkness mechanic is entirely data-driven.
function updateW2L2(G, dt){
  updateLevelCommon(G, dt);
}

W2_LEVELS.push({id:'w2l2', district:'w2', name:'THE WEEPING ROWS', build:buildW2L2, update:updateW2L2, parTime:155});

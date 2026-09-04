// ============ LEVEL 6-3 — ICICLE GROTTO (District 6 · FROSTMERE · Glimmerfields) ============
// The festival road ducks UNDER the frozen waterfall — a blue-dark grotto hung with SPIKE ICICLES, the
// district's ceiling-lane gimmick played start to finish, and Frostmere's CLIMB level (owner law 6a: climbing
// is FUN — the frozen waterfall is a BRANCHING climb with rhythm candy and boosted-hop targets, never a
// ladder-chore). Signature gimmick: DROPPING SPIKE ICICLES — shimmer + drip + growing floor-glow (~0.7s, the
// bombardment telegraph language) then the drop; a graze costs a heart, never a one-shot.
// RETUNE (owner call, Sept 4 2026): Glimmerfields is POST-STORY — the unofficial mastery exam, one column
// RIGHT of D5 on the curve, main-game fair (never Kaizo/Nightmare). This pass: 13 roaming threats on three
// lanes (ground penguins/snowmen · float Snow-Boos · air Blizzard Bats) + 16 SpikeIcicles whose phases compose
// into TWO readable left-to-right waves + the meaner TRIPLETS mid-boss (Gourd Triplets tradition —
// deterministic take-turns rollers) + a second gap (the undercut) + the ice-run-INTO-crevasse master beat.
// Checkpoint law tightened to the D5 rule: CP0 + ONE lit lantern at 51% — the walk-back is part of the price.
//   BEAT 1 THE LAST LAMPPOSTS (approach)      x -8..28  — CP0. The village's last festival lights; one
//          Frostbite Penguin to warm up on; the MYSTERY IGLOO in a clear pocket; the grotto mouth looms.
//   BEAT 2 THE FIRST DRIPS (INTRODUCE)        x 28..54  — under the ice ceiling: TWO icicles over safe flat
//          ground (period 4.2, staggered), the whole telegraph readable at leisure; a penguin patrols the
//          pocket BETWEEN the columns (ground+ceiling composing from the introduce); a Snow-Boo drifts in.
//   BEAT 3 THE EMBEDDED STAIR (TWIST)         x 54..84  — embed-icicles bite the snow and STAY: standable
//          stumps that OPEN the high road (stump -> stump -> ledges, shield lantern up top); a SNOW-BOO
//          HOVERS THE STUMPS (stare it into its block = a bonus step — pressure that doubles as route tech);
//          a penguin works the low lane, a late icicle + the Spooky Snowman guard the convergence.
//   BEAT 4 THE FROZEN WATERFALL (the CLIMB)   x 84..118 — CP1 at x90 (the level's ONE lit lantern, 51%). The
//          cliff: climb the frozen cascade. JUNCTION at the notch — LEFT strand: rhythm candy + the GOLDEN
//          PUMPKIN alcove · RIGHT/straight: the quick way. THE FALLS' OWN TEETH (retune): one icicle beside
//          EACH strand, half-period staggered — dodge WHILE climbing by clinging the candy-marked safe side
//          (the D5 chain). WAVE #1 (three columns, 0.7 steps) + TWO staggered Blizzard Bats work the shelf;
//          Bat Wings at the lip; THE UNDERCUT (retune, gap #2): the descent ledges now hover a 4u void while
//          the third bat dives the lane. Quiet prop at the base.
//   BEAT 5 THE SNOWBALL TRIPLETS (MID-BOSS)   x 120..146 — the grotto's festival-lit great hall (no lantern —
//          the exam's walk-back rule): three rollers take turns charging on fixed staggered clocks, GROWING
//          as they roll — retuned meaner (speed 3.8, grown top 2.4 vs the 2.6 held jump). Hop them, or stomp
//          each once (they die on stomp) — pure attention test, announced with full pomp.
//   BEAT 6 THE DRIPSTONE WAY (ESCALATE+MASTER) x 146..176 — THE ICE RUN (tag:'ice') carries your momentum
//          INTO the crevasse hop off an honest snow lip, then the CORRIDOR: WAVE #2 — SIX columns at exact
//          0.7 steps (a perfect 4.2s loop, no two fall together) — the dodge rhythm IS the path, and under it
//          the full exam: a Snow-Boo (freeze = your own pause button), a diving corridor bat, a second Spooky
//          Snowman that hops exactly when you look up at a telegraph, and a rear-guard penguin.
// Reads UNMISTAKABLY Frostmere-underground: W6PAL moonlit snow outside, blue-dark ice-rock walls + warm
// lantern pools inside (3 real lamp PointLights, emissive fakes elsewhere — igloo + GP + CP1 + 3 pools make
// 6 total, the budget ceiling; CP2's removal freed the third pool), festival strings some villager hung right
// through the cave, aurora glimpses at both mouths. Comparable heights throughout (tap 1.8 / held 2.6 /
// double 3.3; max main-route rise 1.5, the one big rise is a GATED climb; crevasse 4.4 = a comfortable held
// hop, candy-arc telegraphed; undercut hops <=1u across, all descending). ICE (tag:'ice') appears ONCE, as
// the crevasse's run-up (retune, Sept 4 2026: 6-3+ may compose slick+gap — momentum management off an honest
// snow lip; 6-1/6-2 still keep the verbs apart, they teach). Deterministic to the tooth — icicle clocks fixed
// from level start (the embed stumps have ALWAYS landed by the time anyone reaches them), roller clocks
// fixed, seeded rand() only inside baked cosmetic deco. No Math.random on the critical path. NO Leap of
// Faith (both already placed — sacred).

// ---- a frozen CASCADE: the visible climbable — translucent ice columns + ripple knuckles merged to ONE
// transparent draw call (mergeStrands; bakeGroup would discard the glassy opacity). Caller adds the matching
// {type:'climb'} volume; returns the shared material so the build can register one cheap shimmer ticker. ----
function w6l3Cascade(S, x, y0, y1, w){
  const fallM = new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.3, transparent:true, opacity:0.6});
  const g = new THREE.Group();
  const n = Math.max(3, Math.floor(w/0.35));
  for(let i=0;i<n;i++){
    const cx = x - w/2 + (i+0.5)*(w/n);
    const col = new THREE.Mesh(geo('cyl', rand(0.11,0.19), rand(0.15,0.24), (y1-y0)*rand(0.86,1), 6), fallM);
    col.position.set(cx+rand(-0.06,0.06), (y0+y1)/2, rand(-0.5,0.4)); col.rotation.z=rand(-0.03,0.03); g.add(col);
  }
  for(let i=0;i<Math.floor((y1-y0)/1.1);i++){    // frozen ripple knuckles — the water caught mid-tumble
    const rp = new THREE.Mesh(geo('sph', rand(0.18,0.3), 7, 6), fallM);
    rp.position.set(x+rand(-w/2,w/2), y0+0.6+i*1.1, rand(-0.35,0.45)); rp.scale.y=0.5; g.add(rp);
  }
  S.add(mergeStrands(g, fallM));
  return fallM;
}

// ---- a warm grotto LAMP on a post: cage + flame + halo. real:true spends one of the level's three true
// PointLights (max ~6/scene incl. igloo, GP and the one lit checkpoint); false = emissive fake, zero cost. ----
function w6l3Lamp(G, deco, x, y, real){
  const g = new THREE.Group();
  const post = mesh('cyl',[0.07,0.1,y,6], mat(W6PAL.woodD)); post.position.set(x,y/2,-0.9); g.add(post);
  const cage = mesh('box',[0.4,0.46,0.4], mat(0x2a3048)); cage.position.set(x,y+0.2,-0.9); g.add(cage);
  const flame = mesh('sph',[0.13,7,6], emat(0xffc87a,0xffb85e,1)); flame.position.set(x,y+0.2,-0.9); g.add(flame);
  deco.add(g);
  const halo = new THREE.Mesh(geo('sph',0.5,8,7), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0.15, depthWrite:false}));
  halo.position.set(x,y+0.2,-0.9); G.scene.add(halo);   // UNBAKED — transparency dies in the bake
  if(real){ const li = new THREE.PointLight(0xffb069, 46, 9); li.position.set(x,y+0.6,0.4); G.scene.add(li); }
}

// ---- a grotto CEILING SLAB: the cave read — a dark overhanging ice shelf across the lane, its underside
// fringed with SMALL cosmetic icicles kept at z<-1.4 so they can never be mistaken for the big z=0 hazard
// columns (which carry root + glow + telegraph). Built into the caller's bake. ----
function w6l3Ceiling(deco, x1, x2, underY){
  const w = x2-x1, cx=(x1+x2)/2;
  const slab = mesh('box',[w,1.3,8], mat(0x16223c)); slab.position.set(cx, underY+0.65, -1); deco.add(slab);
  const fringe = mat(0x2a3e60);
  for(let x=x1+0.8; x<x2-0.4; x+=rand(1.1,2.2)){
    const ic = mesh('cone',[rand(0.08,0.16), rand(0.3,0.6), 5], fringe);
    ic.rotation.x=Math.PI; ic.position.set(x, underY-0.2, rand(-3.4,-1.5)); deco.add(ic);
  }
}

function buildW6L3(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const SNOW = W6PAL.snowD;     // the moonlit-then-cavern snow road
  const LEDGE = 0x9db4dc;       // frost-stone high-road ledges
  const ROCK  = 0x1a2a4a;       // grotto wall ice-rock

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();        // festival strings — 5 shared bulb materials, one twinkle ticker

  // =============================== BEAT 1 — THE LAST LAMPPOSTS (x -8..28): approach + igloo ===============================
  groundX(G, -8, 96, SNOW);                                            // the road runs unbroken to the waterfall cliff at 96
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "ICICLE GROTTO. The road goes UNDER the frozen falls - and the ceiling in there has TEETH. When an icicle shimmers and drips, its landing spot glows. That glow is a promise. Don't stand on promises.");
  // FROSTBITE PENGUIN #1 — one polite patroller on open snow to warm up on (squawk = the telegraph; the slide
  // runs its fixed length and it waddles home). REACH MATH: patrol 11.8..16.2, wakeR 5 -> it engages players
  // 6.8..21.2 only — an idle spawn at x2 is 4.8u outside its sight, and the igloo@22 sits 0.8u past the wake
  // zone (patrol edge 5.8u from the door ~= the ~6u clear-patch law; fleet-blessed placement, unchanged).
  // (retune-verify fix: the beat-1 warm-up penguin is GONE — home 6 slid through CP0, home 14's slide
  // envelope crossed the igloo pocket at x22 by 3.1u; no home on this stretch satisfies both laws, and the
  // beat-2 penguin between the icicle columns teaches the squawk just as well. Roaming threats: 12.)
  candyLine(G, [[6,0.9,0],[10,0.9,0],[13,0.9,0]], 3);
  G.ents.add(new Crow(14, 0.95, 2.2));                                 // winter crow #1 — flaps off when neared
  // the village's last festival strings (the kit's marquee — someone lit the way to the falls)
  deco.add(w6LightPost(9, -1.6, 3.2)); deco.add(w6LightPost(15, -1.6, 3.2)); deco.add(w6LightPost(21, -1.6, 3.2));
  w6String(L, 9, 3.2, 15, 3.2, {}); w6String(L, 15, 3.2, 21, 3.2, {});
  // THE MYSTERY IGLOO — the Frostmere gamble, in a CLEAR POCKET (CLEAR-PATCH LAW, re-audited for the retune:
  // penguin#1's patrol edge is 5.8u left and its wake zone stops 0.8u short of the door; penguin#2@40's worst
  // toboggan reach is x28.9 — 6.9u clear; the first icicle column is 14u right; all four Blizzard Bat homes sit
  // 77u+ deep in the grotto (they drift toward the player after diving — kept far by design); Snow-Boo homes at
  // 49/60.5/161 are all >=27u past the igloo and leashed to chaseR 14 of home. Opening is a deliberate safe
  // act; the penguin ambush spawns on its own ring with 1s grace.)
  { const ig = new MysteryIgloo(22, 0, -0.5, 0.18); G.coffins.push(ig); G.ents.add(ig); }

  // =============================== BEAT 2 — THE FIRST DRIPS (x 28..54): INTRODUCE the icicle ===============================
  // the grotto mouth: ceiling drops to 7.0, walls close in, the last string of bulbs crosses the arch
  w6l3Ceiling(deco, 30, 54, 7.0);
  w6String(L, 23, 6.4, 29, 6.4, {sag:0.5});                            // the last string, slung across the mouth (clear of the slab)
  signPost(G, 31, 1.7, 0.1, "Mind the drips. An icicle always warns you THREE ways - it shimmers, it drips, and the floor below it glows. Then it stops being an icicle and starts being a spear. Regrows every time, on the dot.");
  // TWO SpikeIcicles over safe flat ground — the full telegraph readable at leisure (period 4.2, staggered
  // phases; fixed clocks from level start — the same wave every run, the determinism covenant)
  G.ents.add(new SpikeIcicle(G, 36, 7.0, {period:4.2, phase:0.0}));
  G.ents.add(new SpikeIcicle(G, 44, 7.0, {period:4.2, phase:2.1}));
  candyLine(G, [[32.5,0.9,0],[34.5,0.9,0]], 2);                        // candy parks you SHORT of each column...
  candyLine(G, [[39,0.9,0],[41.5,0.9,0]], 3);                          // ...then pulls you through on the gap in the clock
  // FROSTBITE PENGUIN #2 (RETUNE) — patrols the pocket BETWEEN the columns, so the introduce already composes
  // ground+ceiling: cross column one on its clock, hop the squawk->toboggan (a tap always clears a penguin),
  // cross column two. Patrol 37.8..42.2 stays clear of both drop zones (35.5..36.5 / 43.5..44.5) — the pockets
  // are the fight floor, the columns stay pure timing. Slide reach 28.9 = 6.9u clear of the igloo@22.
  G.ents.add(new FrostbitePenguin(G, 40, 0, 0, {phase:0.9, range:2.2, dir:-1, speed:1.3}));
  w6l3Lamp(G, deco, 40, 2.6, true);                                    // REAL LIGHT #1 — the first warm pool in the dark
  // SNOW-BOO #1 — the stare rule's winter twist arrives: face it and it freezes into a STANDABLE ice block
  G.ents.add(new SnowBoo(G, 49, 0, 0, {phase:0.0, speed:2.0, range:10}));
  candyLine(G, [[47.5,0.9,0],[50.5,0.9,0]], 3);

  // =============================== BEAT 3 — THE EMBEDDED STAIR (x 54..84): TWIST — icicles that STAY ===============================
  w6l3Ceiling(deco, 56, 84, 9.0);                                      // the cave hall rises — headroom for the high road
  signPost(G, 56, 1.7, -0.1, "Some icicles bite the snow and STAY. A rude arrival - a polite staircase. The high shelf keeps its sweets for climbers.");
  // the TWIST: two embed-icicles drop ONCE and stand forever as stumps — they OPEN the high road. Their fixed
  // clocks land them within seconds of level start, so the stair has always already been built when you arrive.
  G.ents.add(new SpikeIcicle(G, 59, 9.0, {period:4.2, phase:0.7, embed:true, len:1.8}));    // stump top ~1.1
  G.ents.add(new SpikeIcicle(G, 62, 9.0, {period:4.2, phase:1.6, embed:true, len:2.6}));    // stump top ~1.6
  // SNOW-BOO #2 (RETUNE) — HOVERS THE STUMPS: it drifts the stair whenever your back is turned, and the
  // counter is the level's own verb — STARE it mid-climb and its ice block (floats ~1.3, top ~2.8) freezes
  // into a BONUS STEP toward the first ledge at 3.1. Pressure that doubles as route tech, the D5 way.
  // Home 60.5 = 38.5u from the igloo (>=15u boo law); leashed chaseR 14 -> it never sees CP0 or CP1.
  G.ents.add(new SnowBoo(G, 60.5, 1.3, 0, {phase:1.3, speed:2.0, range:10}));
  // THE HIGH ROAD — stump -> stump -> frost ledges (every rise <=1.5, slight over-clearance throughout)
  platform(G, 65.5, 3.1, 0, 3, 3, LEDGE);                              // spans 64..67 (+1.5 off stump B)
  platform(G, 70, 4.4, 0, 3.5, 3, LEDGE);                              // spans 68.25..71.75 (+1.3)
  platform(G, 75, 4.4, 0, 4, 3, LEDGE);                                // spans 73..77
  candyLine(G, [[59,2.1,0],[62,2.6,0],[64.5,3.6,0]], 3);               // candy traces the stump stair
  candyLine(G, [[66,5.0,0],[70,5.2,0],[74,5.2,0]], 4);                 // JUNCTION RULE: the low road SEES this overhead
  G.ents.add(new BonkLantern(G, 75.5, 5.5, 0, 'shield'));              // high-road reward — a Gummy Shield
  // the LOW ROAD stays busy beneath: a penguin patrols under the ledges (wake check is height-gated — it only
  // squawks at low-roaders), and the routes CONVERGE at 77 under a late icicle + the Spooky Snowman
  G.ents.add(new FrostbitePenguin(G, 68, 0, 0, {phase:0.6, range:2.2, dir:-1, speed:1.3}));
  candyLine(G, [[68,0.9,0],[72,0.9,0]], 3);
  G.ents.add(new SpikeIcicle(G, 79, 9.0, {period:4.2, phase:1.4}));    // the convergence column — both roads read it
  // THE SPOOKY SNOWMAN — perfectly still while watched, hops closer when you look away (and you WILL look away:
  // there's an icicle telegraph overhead). Eyes flare cyan mid-hop; stomp pops the head for the comedy window.
  // aggroR trimmed 7->5.0 for CP1@90 (retune): a rightward-passing player can bait it at most ~3u east (hop
  // ~1.7u per ~1.3s vs run speed), so its drag-east worst case is ~x84 -> engage ceiling 89.0 < the lantern.
  // 5.0 still blankets the whole 77..83.5 convergence, where every route crosses within 4u of it.
  G.ents.add(new SpookySnowman(G, 81, 0, 0, {phase:0.0, watchR:11, aggroR:4.5}));   // retune-verify: 4.5 keeps a drag-east kite ≥1.5u short of CP1's lantern
  candyLine(G, [[77.5,0.9,0],[83,0.9,0]], 3);

  // =============================== BEAT 4 — THE FROZEN WATERFALL (x 84..118): the CLIMB + CP1 + GP #1 ===============================
  // CP1 — THE level's ONE lit lantern (retune: mastery-exam checkpoint law, CP0 + one mid lantern; the
  // walk-back is part of the price). x90 = 51% of the 176u course, at the falls' foot.
  // RESPAWN-SAFETY REACH MATH (do not regress): penguin#3@68 engages <=75.2 (patrol 65.8..70.2 + wakeR 5) ·
  // snowman@81 aggroR 5.0, drag-east worst case ~x84 -> engage ceiling 89.0 · climb-icicle drop lanes are
  // 91.2..92.2 and 94.2..95.2 (nearest edge 1.2u clear of an idle player at 90; fixed clocks, floor glows) ·
  // bat#2 patrols >=97.4 with aggroR 4.0 -> engages >=93.4. Nothing reaches a player idling at the lantern.
  G.ents.add(new Checkpoint(90, 0, 1.6, 1));
  signPost(G, 88, 1.7, -0.12, "THE FROZEN FALLS. Hold UP on the ice to climb - JUMP off with a big hop. At the notch, choose your strand: LEFT is the long way, all sweets and a golden glow. STRAIGHT UP is the quick way. And mind the falls' own TEETH - icicles grow on frozen water, and they keep the same old clock. Cling wide of the shimmer.");
  // the cliff massif: the road ends at a 7.2 wall; the shelf on top IS the route (falls off the climb land on
  // soft snow at the base — a climb miss costs seconds, never a heart: climbing stays FUN, owner law 6a)
  { const m = mesh('box',[18,7.2,10], mat(SNOW)); m.position.set(105,3.6,0); S.add(m);
    const lipC = new THREE.Color(SNOW).multiplyScalar(1.4).getHex();
    const lip = mesh('box',[18,0.16,10.25], mat(lipC)); lip.position.set(105,7.28,0); S.add(lip);
    G.world.addBox(105, 0, 0, 18, 7.2, 10, {}); }
  // THE MAIN CASCADE (the RIGHT/quick branch): one great frozen fall down the face — climb it top to bottom
  const cascadeM = w6l3Cascade(S, 95.3, 0, 7.8, 1.6);
  G.world.addBox(95.3, 0, 0, 1.1, 7.8, 1.2, {type:'climb'});
  w6l3Lamp(G, deco, 91, 2.8, true);                                    // REAL LIGHT #2 — the pool at the foot of the falls
                                                                       // (scene total 6: igloo + GP + CP1 + 3 pools = the ceiling)
  candyLine(G, [[95.5,1.8,0],[95.5,3.4,0],[95.5,4.6,0]], 3);           // rhythm candy up the main strand — parked on
                                                                       // the SAFE cling side (east of the tooth's lane)
  // THE JUNCTION NOTCH — a frost ledge jutting left at 4.6: hop off here for the brave branch
  platform(G, 93.6, 4.6, 0, 2.0, 2.6, LEDGE);                          // spans 92.6..94.6
  candyLine(G, [[93.6,5.3,0],[92.5,5.6,0]], 2);                        // the quiet lure LEFT (toward the gold glow)
  // THE LEFT BRANCH — a freestanding side-spout pillar: candy all the way up, the GOLDEN PUMPKIN at the top
  const pillarM = w6l3Cascade(S, 92.2, 4.2, 9.8, 0.9);
  G.world.addBox(92.2, 4.6, 0, 1.1, 5.0, 1.2, {type:'climb'});
  candyLine(G, [[92.45,6.6,0],[92.45,8.0,0],[92.45,9.2,0]], 3);        // pillar rhythm candy — the safe cling side
  platform(G, 90, 9.2, 0, 2.6, 2.6, LEDGE);                            // the hidden alcove (boosted hop LEFT off the pillar)
  G.ents.add(new GoldPumpkin(90, 10.0, 0, 1));                         // GOLDEN PUMPKIN idx 1 — behind the branch; its
                                                                       // gold PointLight glow bleeds across the main wall
  platform(G, 93.8, 8.4, 0, 2.2, 2.6, LEDGE);                          // the way back: alcove -> return ledge -> shelf
  candyLine(G, [[93.8,9.0,0],[95.5,8.2,0]], 2);
  candyLine(G, [[96.6,8.0,0],[98.5,8.0,0]], 2);                        // the shortcut's climb-exit hop target on the lip
  // THE FALLS' OWN TEETH (RETUNE — dodge WHILE climbing, the D5 chain): one icicle rooted in EACH frozen
  // strand, phases a half-period apart so exactly one side works at a time. Drop lanes (|dx|<0.5): main
  // strand 94.2..95.2 -> SAFE CLING 95.2..95.85, where the rhythm candy sits · pillar 91.2..92.2 -> SAFE
  // CLING 92.2..92.75, ditto. The 0.7s shimmer+drip reads at eye level on the wall; a graze costs a heart and
  // a hop-off lands on soft snow (seconds) — never both. The notch ledge keeps an honest 92.6..94.2 stand-and-
  // choose span clear of both lanes, and the return ledge at y8.4 rides ABOVE the main tooth's whole path.
  G.ents.add(new SpikeIcicle(G, 94.7, 7.5, {period:4.2, phase:3.0}));
  G.ents.add(new SpikeIcicle(G, 91.7, 9.6, {period:4.2, phase:0.9}));
  // THE SHELF CROSSING — WAVE #1 (RETUNE): three columns at exact 0.7 steps rolling left-to-right across the
  // shelf, TWO phase-staggered Blizzard Bats in the grotto air. Pockets 103.5..106 and 107..109.5 are the
  // safe lanes; bat #2 guards the lip candy so the climb-exit hop is a decision, not a freebie.
  w6l3Ceiling(deco, 96, 118, 11.2);
  G.ents.add(new SpikeIcicle(G, 103,   11.2, {period:4.2, phase:0.6, floorY:7.2}));
  G.ents.add(new SpikeIcicle(G, 106.5, 11.2, {period:4.2, phase:1.3, floorY:7.2}));
  G.ents.add(new SpikeIcicle(G, 110,   11.2, {period:4.2, phase:2.0, floorY:7.2}));
  G.ents.add(new BlizzardBat(G, 99.8, 9.6, 0, {phase:1.8, range:2.4, period:3.6, aggroR:4.0}));   // bat #2 THE LIP GUARD (RETUNE — engages >=93.4, clear of CP1@90)
  G.ents.add(new BlizzardBat(G, 106, 9.9, 0, {phase:0.2, range:3, period:3.6, aggroR:4.5}));   // bat #1 THE SHELF BAT (84u+ from the igloo)
  candyLine(G, [[100.5,8.0,0],[106.5,8.0,0],[112.5,8.0,0]], 3);        // the dodge rhythm traced along the shelf
  G.ents.add(new BonkLantern(G, 113.5, 8.6, 0, 'bat'));                // Bat Wings at the lip — GLIDE the undercut (a toy with a target)
  // THE UNDERCUT (RETUNE — the level's second gap): the great-hall floor now starts at 118, opening a 4u void
  // under the descent (massif east face 114 -> floor 118, pitDressing'd, visible from the lip). The frost
  // ledges HOVER the void — lip(7.28) -> 4.8 (spans 115..117.6) -> 2.4 (spans 118..120.6) -> floor: every hop
  // <=1u across and descending (over-clearance law), while bat #3 dives the lane on its fixed clock. A miss
  // costs a heart + the CP1 walk-back (the exam's price); a confident runner long-jumps the whole thing.
  platform(G, 116.3, 4.8, 0, 2.6, 3, LEDGE);                           // spans 115..117.6
  platform(G, 119.3, 2.4, 0, 2.6, 3, LEDGE);                           // spans 118..120.6
  groundX(G, 118, 142.5, SNOW);                                        // the great-hall floor (ends at the ICE RUN — beat 6)
  G.ents.add(new Heart(116.3, 5.7, 0));                                // a heart riding the void hop — the exam is kind, once
  candyLine(G, [[118.6,3.1,0],[120,3.3,0]], 2);
  G.ents.add(new BlizzardBat(G, 114.5, 6.5, 0, {phase:1.4, range:2.5, period:3.6, aggroR:3.5}));   // bat #3 THE DESCENT DIVER — home hovers the undercut void, flagging it (CP2 is gone; nearest respawn is CP1@90, 24.5u west — no dive lane touches a respawn)

  // =============================== BEAT 5 — THE SNOWBALL TRIPLETS (x 120..146): MID-BOSS ===============================
  // (RETUNE: CP2 deleted per the mastery-exam checkpoint law — CP0 + the ONE lit lantern at x90. A triplets
  //  death now walks back through the falls climb; the D5 rule says the walk-back is part of the price.)
  // announced with full pomp (the Gourd Triplets tradition — a loving nod, deterministic take-turns patterns)
  signPost(G, 123, 1.7, 0.12, "PRESENTING... THE SNOWBALL TRIPLETS! Undefeated! (Nobody has checked.) They start small. They do not STAY small. They were ASKED to charge one at a time. They are TRIPLETS. And they have been PRACTICING. Hop the little ones - or flatten each brother once.");
  G.ents.add(new Crow(126, 0.95, 2.4));                                // winter crow #2 — flees as the show begins
  // the festival-lit great hall: villagers strung the arena for the show
  w6l3Ceiling(deco, 120, 146, 12.0);
  deco.add(w6LightPost(125, -1.8, 3.4)); deco.add(w6LightPost(134, -1.8, 3.4)); deco.add(w6LightPost(143, -1.8, 3.4));
  w6String(L, 125, 3.4, 134, 3.4, {}); w6String(L, 134, 3.4, 143, 3.4, {});
  deco.add(w6GiftBox(124.5, -2.2, 0.8)); deco.add(w6GiftBox(143.5, -2.1, 0.7));   // presents for the winners
  // THE TRIPLETS (RETUNED MEANER — owner call Sept 4: speed 3.8, r1 1.2) — three rollers on one lane,
  // staggered exact thirds of the shared 6.14s beat (18u/3.8 + 1.4 pause), alternating directions; each GROWS
  // as it rolls (r0 0.35 -> r1 1.2: grown top 2.4 vs the 2.6 held jump — 0.2 over-clearance at the very worst
  // end of the lane, comfy anywhere earlier). Hop the big end with a HELD jump, or stomp: one stomp each, forever.
  G.ents.add(new SnowballRoller(G, 142, 0, 0, {x1:124, speed:3.8, r0:0.35, r1:1.2, pause:1.4, phase:0.0}));
  G.ents.add(new SnowballRoller(G, 124, 0, 0, {x1:142, speed:3.8, r0:0.35, r1:1.2, pause:1.4, phase:2.046}));
  G.ents.add(new SnowballRoller(G, 142, 0, 0, {x1:124, speed:3.8, r0:0.35, r1:1.2, pause:1.4, phase:4.092}));
  candyLine(G, [[128,2.7,0],[133,2.7,0],[138,2.7,0]], 3);              // hop-height candy — the arc that clears a grown ball
  candyLine(G, [[126,0.9,0],[140,0.9,0]], 2);

  // =============================== BEAT 6 — THE DRIPSTONE WAY (x 146..176): ESCALATE + MASTER + finish ===============================
  signPost(G, 140.5, 1.7, -0.1, "THE DRIPSTONE WAY. First: the floor ahead turns to GLASS, and past the glass the mountain yawned once and never shut its mouth. Carry your speed across the ice and JUMP from the snow lip. Then the ceiling plays its tune LEFT to RIGHT, round and round - dance the drops like a song you know.");
  // THE ICE RUN INTO THE CREVASSE (RETUNE — the master beat composes slick+gap, sanctioned for 6-3+): 4.4u of
  // glossy tag:'ice' (the kit's emissive sheen strip telegraphs the surface change from a screen away), then a
  // 1.1u HONEST SNOW LIP — grippy, wide enough to check your speed and set the takeoff — then the 4.4u held
  // hop (comfortable vs the 5.5 ceiling), candy-arc telegraphed. Momentum management, never a blind slide-off:
  // the lip is the promise kept. The fall costs a heart + the CP1 walk-back (pitDressing = the visible danger).
  w6IceX(G, 142.5, 146.9);
  groundX(G, 146.9, 148, SNOW);                                        // the honest snow lip at the crack's edge
  candyLine(G, [[147,1.3,0],[150.2,2.9,0],[153.6,1.3,0]], 3);
  groundX(G, 152.4, 180, SNOW);
  // THE ICICLE WAVE — WAVE #2 (RETUNE: grown to SIX columns at exact 0.7 steps, 3.2 spacing — six phases
  // cover the full 4.2 period, a PERFECT LOOP: as each drops the next shimmers, no two ever fall together,
  // and the wave rolls left-to-right forever at ~4.6u/s. Ride it. Drop zones are 1u wide, so every pocket is
  // a 2.2u safe lane, and the crevasse landing keeps a 1.3u clear shelf (152.4..153.7) before column one.
  w6l3Ceiling(deco, 153.4, 172, 7.0);
  w6String(L, 158, 5.8, 164, 5.8, {sag:0.5});                          // someone lit the way out, bless them
  G.ents.add(new SpikeIcicle(G, 154.2, 7.0, {period:4.2, phase:0.0}));
  G.ents.add(new SpikeIcicle(G, 157.4, 7.0, {period:4.2, phase:0.7}));
  G.ents.add(new SpikeIcicle(G, 160.6, 7.0, {period:4.2, phase:1.4}));
  G.ents.add(new SpikeIcicle(G, 163.8, 7.0, {period:4.2, phase:2.1}));
  G.ents.add(new SpikeIcicle(G, 167,   7.0, {period:4.2, phase:2.8}));
  G.ents.add(new SpikeIcicle(G, 170.2, 7.0, {period:4.2, phase:3.5}));
  candyLine(G, [[155.8,0.9,0],[159,0.9,0],[162.2,0.9,0],[165.4,0.9,0],[168.6,0.9,0]], 5);   // candy sits in the wave's safe pockets
  // THE CORRIDOR GAUNTLET (RETUNE — the exam proper: every verb the level taught, composed under the wave;
  // all three lanes busy, every threat on its own fixed clock, the pockets always safe from the ceiling):
  // SNOW-BOO #3 — drifts when unwatched; STARE it into a standable ice block: the level's own learned verbs
  // stack — freeze yourself a pause button between drops (the block is safe, the glow never lies).
  G.ents.add(new SnowBoo(G, 161, 0, 0, {phase:0.8, speed:2.0, range:10, freezeMax:2.4}));
  // BAT #4 THE CORRIDOR BAT — works the low grotto air under the 7.0 ceiling; squeak-telegraphed snapshot
  // dive through the pockets. Level-wide bat phases staggered: 0.2 / 1.4 / 1.8 / 2.6 — never two at once.
  G.ents.add(new BlizzardBat(G, 162.6, 5.2, 0, {phase:2.6, range:2.6, period:3.6, aggroR:3.5}));
  // SPOOKY SNOWMAN #2 — parked in the 167/170.2 pocket: it hops exactly when you look UP at a telegraph (the
  // watched-rule played against the wave). Edge-guarded hops, eyes flare mid-hop, stomp pops the head — and
  // the crevasse means it can never be kited west of x152.4 toward the lantern.
  G.ents.add(new SpookySnowman(G, 168.5, 0, 0, {phase:0.4, watchR:11, aggroR:7}));
  // PENGUIN #4 THE REAR GUARD — patrol 170.8..175.2 sits fully clear of column six's 169.7..170.7 drop zone;
  // its toboggan hunts corridor dawdlers from behind. Hop it — the x14 verb, at exam grade.
  G.ents.add(new FrostbitePenguin(G, 173, 0, 0, {phase:0.5, range:2.2, dir:-1, speed:1.3}));
  w6l3Lamp(G, deco, 165, 2.6, true);                                   // REAL LIGHT #3 (the slot CP2's lantern freed) —
                                                                       // the gauntlet must READ. Budget: igloo + GP + CP1 + 3 pools = 6, the ceiling
  // the run-out: back under the open sky and the aurora
  candyLine(G, [[172.5,0.9,0],[174.5,0.9,0]], 2);
  G.ents.add(new Crow(174, 0.95, 2.3));                                // winter crow #3
  signPost(G, 173, 1.7, 0.1, "Out the far side, and the falls still standing - stubborn old thing. Glimmerfields glitters on ahead. Don't drip on the way out.");
  exitGate(G, 176);

  // =============================== THE QUIET PROP (never signposted) ===============================
  // A miner's lantern frozen INSIDE a boulder of grotto ice — still lit. Somebody walked this way under the
  // mountain long before the festival, set their lantern down, and the falls froze around it mid-glow. The
  // flame never went out. Nobody in Grimmwick has the heart to chip it free. UNBAKED (the ice must stay glassy).
  { const q = new THREE.Group();
    const block = new THREE.Mesh(geo('box',1.4,1.7,1.1), new THREE.MeshLambertMaterial({color:W6PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.22, transparent:true, opacity:0.55}));
    block.position.set(89.5,0.85,-1.8); crook(block,0.05); q.add(block);
    const cage = mesh('box',[0.3,0.36,0.3], mat(0x2a3048)); cage.position.set(89.4,0.8,-1.8); q.add(cage);
    const flame = mesh('sph',[0.11,7,6], emat(0xffc87a,0xffb85e,1)); flame.position.set(89.4,0.78,-1.8); q.add(flame);
    const halo = new THREE.Mesh(geo('sph',0.42,8,7), new THREE.MeshBasicMaterial({color:0xffb85e, transparent:true, opacity:0.18, depthWrite:false}));
    halo.position.set(89.4,0.78,-1.8); q.add(halo);
    S.add(q); }

  // =============================== DECO · WALLS · SILHOUETTES · PARALLAX ===============================
  // the grotto's back walls: blue-dark ice-rock behind each cave span, studded with baked frost crystals
  for(const [wx1,wx2,wh] of [[30,54,9.5],[56,84,11.5],[84,120,14.5],[120,146,15],[152,172,9.5]]){
    const wm = mesh('box',[wx2-wx1, wh, 1.6], mat(ROCK)); wm.position.set((wx1+wx2)/2, wh/2, -4.4); deco.add(wm);
    for(let i=0;i<Math.floor((wx2-wx1)/3);i++){
      const cr = mesh('cone',[rand(0.1,0.2), rand(0.3,0.6), 5], emat(0x7ae8ff,0x58c8f0,0.7));
      cr.position.set(rand(wx1+1,wx2-1), rand(0.8,wh*0.6), -3.5); cr.rotation.z=rand(-0.5,0.5); deco.add(cr); }
  }
  // the two grotto MOUTHS: ice-rock pillars + lintels framing the way in and the way out
  for(const mx of [29, 173]){
    const pl2 = mesh('box',[1.4,8.2,1.4], mat(ROCK)); pl2.position.set(mx,4.1,-2.6); crook(pl2,0.05); deco.add(pl2);
    const ln = mesh('box',[4.6,1.2,1.4], mat(ROCK)); ln.position.set(mx+1.2,8.4,-2.6); deco.add(ln); }
  // scattered snow on the shelf crossing (w6Clutter is ground-level only — dress the high road by hand)
  for(let i=0;i<10;i++){ const lump = mesh('sph',[rand(0.16,0.34),6,5], mat(W6PAL.snow)); lump.scale.y=0.5;
    lump.position.set(rand(97,113), 7.28, rand(-2.4,2.4)); deco.add(lump); }
  // FOREGROUND silhouettes (z>0): dark ice spears inside the grotto, pines + a snowman at the open ends
  for(const [fx,fh] of [[34,1.6],[63,2.0],[101,1.5],[129,2.2],[158,1.8]]){
    const sp = mesh('cone',[0.34,fh,5], mat(0x101a2e)); sp.position.set(fx,fh/2,2.8); sp.rotation.z=rand(-0.1,0.1); deco.add(sp);
    const sp2 = mesh('cone',[0.2,fh*0.6,5], mat(0x101a2e)); sp2.position.set(fx+0.7,fh*0.3,3.1); deco.add(sp2); }
  deco.add(w6Pine(-3, 2.8, 1.2)); deco.add(w6Pine(12, 3.0, 0.9)); deco.add(w6Pine(178, 2.7, 1.1));
  deco.add(w6SnowmanDeco(17, 2.6, 0.5, -0.4));                         // a REAL decorative snowman (the still kind... probably)
  S.add(bakeGroup(deco));

  // festival strings live (5 merged bulb draws + the one twinkle ticker)
  w6LightsFinish(G, L);

  // the cascades shimmer — one cheap ticker breathes both frozen falls
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), group:new THREE.Group(),
    update(dt){ this.t+=dt;
      cascadeM.emissiveIntensity = 0.3 + Math.sin(this.t*1.7)*0.1;
      pillarM.emissiveIntensity = 0.3 + Math.sin(this.t*1.7+1.4)*0.1; } });

  // three-depth Frostmere skyline (snowdrifts+birches / lamplit village / blue peaks) + aurora via the tail
  w6Parallax(S, -8, 180);

  // themed death-pit dressing (the level's TWO voids — the undercut + the crevasse; the fall is the hazard)
  pitDressing(G, 114, 118, 'winter');
  pitDressing(G, 148, 152.4, 'winter');

  // exit + the W6 tail. clutter split by hand around the massif, both voids and the ice run (no props poking
  // through — and the glassy run stays CLEAN: glossy = slick must read at a glance)
  w6LevelFinish(G, -8, 180, null);
  w6Clutter(G, -8, 96, 'winter');
  w6Clutter(G, 118, 142.5, 'winter');
  w6Clutter(G, 152.4, 178, 'winter');

  return {spawnX: 0, exitX: 176};
}

function updateW6L3(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the icicle clocks, roller clocks, bulb twinkle, aurora and cascade shimmer
  // all self-tick deterministically through G.ents from their fixed phases. The frozen lantern stays frozen.
}

W6_LEVELS.push({id:'w6l3', district:'w6', name:'ICICLE GROTTO', build:buildW6L3, update:updateW6L3, parTime:165});   // par +5s for the retune's clock-waits (climb teeth, meaner triplets) — the time star stays honest-tough

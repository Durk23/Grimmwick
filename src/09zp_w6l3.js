// ============ LEVEL 6-3 — ICICLE GROTTO (District 6 · FROSTMERE · Glimmerfields) ============
// The festival road ducks UNDER the frozen waterfall — a blue-dark grotto hung with SPIKE ICICLES, the
// district's ceiling-lane gimmick played start to finish, and Frostmere's CLIMB level (owner law 6a: climbing
// is FUN — the frozen waterfall is a BRANCHING climb with rhythm candy and boosted-hop targets, never a
// ladder-chore). Signature gimmick: DROPPING SPIKE ICICLES — shimmer + drip + growing floor-glow (~0.7s, the
// bombardment telegraph language) then the drop; a graze costs a heart, never a one-shot. Full
// introduce->twist->escalate->master at D3 density ("fairly competitive" — 10 threats on three lanes:
// ground penguins/snowman/boos · grotto-air Blizzard Bats · the icicle ceiling lane), plus the district
// MID-BOSS: THE SNOWBALL TRIPLETS (Gourd Triplets tradition — deterministic take-turns rollers).
//   BEAT 1 THE LAST LAMPPOSTS (approach)      x -8..28  — CP0. The village's last festival lights; one
//          Frostbite Penguin to warm up on; the MYSTERY IGLOO in a clear pocket; the grotto mouth looms.
//   BEAT 2 THE FIRST DRIPS (INTRODUCE)        x 28..54  — under the ice ceiling: TWO icicles over safe flat
//          ground (period 4.2, staggered), the whole telegraph readable at leisure; a Snow-Boo drifts in.
//   BEAT 3 THE EMBEDDED STAIR (TWIST)         x 54..84  — embed-icicles bite the snow and STAY: standable
//          stumps that OPEN the high road (stump -> stump -> ledges, shield lantern up top); a penguin works
//          the low lane beneath, a late icicle + the Spooky Snowman guard the convergence. Routes cross in sight.
//   BEAT 4 THE FROZEN WATERFALL (the CLIMB)   x 84..118 — CP1. The cliff: climb the frozen cascade. JUNCTION
//          at the notch — LEFT strand: rhythm candy + the GOLDEN PUMPKIN alcove (its gold glow visible from
//          the main wall) · RIGHT/straight: the quick way to the shelf. Icicles + a Blizzard Bat work the
//          shelf crossing; Bat Wings at the lip; a bat-diver harries the ledge descent. Quiet prop at the base.
//   BEAT 5 THE SNOWBALL TRIPLETS (MID-BOSS)   x 120..146 — CP2. The grotto's festival-lit great hall: three
//          rollers take turns charging the arena on fixed staggered clocks, GROWING as they roll. Hop them,
//          or stomp each once (they die on stomp) — pure attention test, announced with full pomp.
//   BEAT 6 THE DRIPSTONE WAY (ESCALATE+MASTER) x 146..176 — a crevasse hop, then the icicle CORRIDOR: five
//          columns whose phases compose into a readable left-to-right WAVE — the dodge rhythm IS the path.
//          A Snow-Boo drifts the corridor (stare it into a standable ice block: your own pause button).
// Reads UNMISTAKABLY Frostmere-underground: W6PAL moonlit snow outside, blue-dark ice-rock walls + warm
// lantern pools inside (2 real PointLights, emissive fakes elsewhere — igloo + GP + CP1 + CP2 make 6 total,
// the budget ceiling), festival strings some villager hung right through the cave, aurora glimpses at both
// mouths. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; max main-route rise 1.5, the one
// big rise is a GATED climb; crevasse 4.4 = a comfortable held hop, candy-arc telegraphed). ICE (tag:'ice')
// is deliberately ABSENT — slick floors never combine with the crevasse in 6-1..6-3 (owner law). Deterministic
// to the tooth — icicle clocks fixed from level start (the embed stumps have ALWAYS landed by the time anyone
// reaches them), roller clocks fixed, seeded rand() only inside baked cosmetic deco. No Math.random on the
// critical path. NO Leap of Faith (both already placed — sacred).

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

// ---- a warm grotto LAMP on a post: cage + flame + halo. real:true spends one of the level's two true
// PointLights (max ~6/scene incl. igloo, GP and the two lit checkpoints); false = emissive fake, zero cost. ----
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
  // runs its fixed length and it waddles home). Patrol reach 3.8..8.2 — a full 13.8u clear of the igloo@22.
  G.ents.add(new FrostbitePenguin(G, 14, 0, 0, {phase:0.0, range:2.2, dir:1, speed:1.2}));   // fleet-audit fix: home 6 slid its toboggan back through CP0 — from 14 its wakeR can't even see an idle spawn player
  candyLine(G, [[6,0.9,0],[10,0.9,0],[13,0.9,0]], 3);
  G.ents.add(new Crow(14, 0.95, 2.2));                                 // winter crow #1 — flaps off when neared
  // the village's last festival strings (the kit's marquee — someone lit the way to the falls)
  deco.add(w6LightPost(9, -1.6, 3.2)); deco.add(w6LightPost(15, -1.6, 3.2)); deco.add(w6LightPost(21, -1.6, 3.2));
  w6String(L, 9, 3.2, 15, 3.2, {}); w6String(L, 15, 3.2, 21, 3.2, {});
  // THE MYSTERY IGLOO — the Frostmere gamble, in a CLEAR POCKET (CLEAR-PATCH LAW: penguin#1's patrol reach ends
  // 13.8u left; the first icicle column is 14u right; both Blizzard Bat homes sit 80u+ deep in the grotto (they
  // drift toward the player after diving — kept far by design); SnowBoo#1@49 is a leashless drifter like w5l1's
  // Shadow Copies, but it lives 27u PAST the igloo and only closes on a player who has already moved on. Opening
  // is a deliberate safe act; the penguin ambush spawns on its own ring with 1s grace.)
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
  G.ents.add(new SpookySnowman(G, 81, 0, 0, {phase:0.0, watchR:11, aggroR:7}));
  candyLine(G, [[77.5,0.9,0],[83,0.9,0]], 3);

  // =============================== BEAT 4 — THE FROZEN WATERFALL (x 84..118): the CLIMB + CP1 + GP #1 ===============================
  G.ents.add(new Checkpoint(85, 0, 1.6, 1));                           // CP1 — LIT, mid-level checkpoint #1
  signPost(G, 88, 1.7, -0.12, "THE FROZEN FALLS. Hold UP on the ice to climb - JUMP off with a big hop. At the notch, choose your strand: LEFT is the long way, all sweets and a golden glow. STRAIGHT UP is the quick way. A waterfall has no wrong way up - only a braver one.");
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
                                                                       // (scene total 6: igloo + GP + CP1 + CP2 + 2 pools = the ceiling)
  candyLine(G, [[95.3,1.8,0],[95.3,3.4,0],[95.3,4.6,0]], 3);           // rhythm candy up the main strand
  // THE JUNCTION NOTCH — a frost ledge jutting left at 4.6: hop off here for the brave branch
  platform(G, 93.6, 4.6, 0, 2.0, 2.6, LEDGE);                          // spans 92.6..94.6
  candyLine(G, [[93.6,5.3,0],[92.5,5.6,0]], 2);                        // the quiet lure LEFT (toward the gold glow)
  // THE LEFT BRANCH — a freestanding side-spout pillar: candy all the way up, the GOLDEN PUMPKIN at the top
  const pillarM = w6l3Cascade(S, 92.2, 4.2, 9.8, 0.9);
  G.world.addBox(92.2, 4.6, 0, 1.1, 5.0, 1.2, {type:'climb'});
  candyLine(G, [[92.2,6.6,0],[92.2,8.0,0],[92.2,9.2,0]], 3);
  platform(G, 90, 9.2, 0, 2.6, 2.6, LEDGE);                            // the hidden alcove (boosted hop LEFT off the pillar)
  G.ents.add(new GoldPumpkin(90, 10.0, 0, 1));                         // GOLDEN PUMPKIN idx 1 — behind the branch; its
                                                                       // gold PointLight glow bleeds across the main wall
  platform(G, 93.8, 8.4, 0, 2.2, 2.6, LEDGE);                          // the way back: alcove -> return ledge -> shelf
  candyLine(G, [[93.8,9.0,0],[95.5,8.2,0]], 2);
  candyLine(G, [[96.6,8.0,0],[98.5,8.0,0]], 2);                        // the shortcut's climb-exit hop target on the lip
  // THE SHELF CROSSING — icicles hang from the high vault; a Blizzard Bat works the grotto air
  w6l3Ceiling(deco, 96, 118, 11.2);
  G.ents.add(new SpikeIcicle(G, 103, 11.2, {period:4.2, phase:0.6, floorY:7.2}));
  G.ents.add(new SpikeIcicle(G, 110, 11.2, {period:4.2, phase:2.7, floorY:7.2}));
  G.ents.add(new BlizzardBat(G, 106, 9.9, 0, {phase:0.2, range:3, period:3.6, aggroR:4.5}));   // grotto air #1 (84u+ from the igloo)
  candyLine(G, [[100.5,8.0,0],[106.5,8.0,0],[112.5,8.0,0]], 3);        // the dodge rhythm traced along the shelf
  G.ents.add(new BonkLantern(G, 113.5, 8.6, 0, 'bat'));                // Bat Wings at the lip — GLIDE the descent (a toy)
  // THE DESCENT — frost ledges step down the far face (every drop a safe fall onto ground at 114+)
  platform(G, 116.3, 4.8, 0, 2.6, 3, LEDGE);                           // spans 115..117.6
  platform(G, 119.3, 2.4, 0, 2.6, 3, LEDGE);                           // spans 118..120.6
  groundX(G, 114, 148, SNOW);                                          // the great-hall floor
  G.ents.add(new Heart(116.3, 5.7, 0));                                // a heart before the triplets — D3 is kind, once
  candyLine(G, [[118.6,3.1,0],[120,3.3,0]], 2);
  G.ents.add(new BlizzardBat(G, 114.5, 6.5, 0, {phase:1.4, range:2.5, period:3.6, aggroR:3.5}));   // grotto air #2 — dives the descent (fleet-audit fix: re-homed off CP2's lantern — a triplets death must never respawn into a dive lane)

  // =============================== BEAT 5 — THE SNOWBALL TRIPLETS (x 120..146): MID-BOSS + CP2 ===============================
  G.ents.add(new Checkpoint(121.5, 0, 1.6, 2));                        // CP2 — LIT, mid-level checkpoint #2 (>100u rule)
  // announced with full pomp (the Gourd Triplets tradition — a loving nod, deterministic take-turns patterns)
  signPost(G, 123, 1.7, 0.12, "PRESENTING... THE SNOWBALL TRIPLETS! Undefeated! (Nobody has checked.) They start small. They do not STAY small. They were ASKED to charge one at a time. They are TRIPLETS. Hop the little ones - or flatten each brother once.");
  G.ents.add(new Crow(126, 0.95, 2.4));                                // winter crow #2 — flees as the show begins
  // the festival-lit great hall: villagers strung the arena for the show
  w6l3Ceiling(deco, 120, 146, 12.0);
  deco.add(w6LightPost(125, -1.8, 3.4)); deco.add(w6LightPost(134, -1.8, 3.4)); deco.add(w6LightPost(143, -1.8, 3.4));
  w6String(L, 125, 3.4, 134, 3.4, {}); w6String(L, 134, 3.4, 143, 3.4, {});
  deco.add(w6GiftBox(124.5, -2.2, 0.8)); deco.add(w6GiftBox(143.5, -2.1, 0.7));   // presents for the winners
  // THE TRIPLETS — three rollers on one lane, staggered thirds of a shared beat, alternating directions; each
  // GROWS as it rolls (r0 0.35 -> r1 1.1 — hop the big end with a HELD jump, or stomp: one stomp each, forever)
  G.ents.add(new SnowballRoller(G, 142, 0, 0, {x1:124, speed:3.6, r0:0.35, r1:1.1, pause:1.4, phase:0.0}));
  G.ents.add(new SnowballRoller(G, 124, 0, 0, {x1:142, speed:3.6, r0:0.35, r1:1.1, pause:1.4, phase:2.1}));
  G.ents.add(new SnowballRoller(G, 142, 0, 0, {x1:124, speed:3.6, r0:0.35, r1:1.1, pause:1.4, phase:4.2}));
  candyLine(G, [[128,2.7,0],[133,2.7,0],[138,2.7,0]], 3);              // hop-height candy — the arc that clears a grown ball
  candyLine(G, [[126,0.9,0],[140,0.9,0]], 2);

  // =============================== BEAT 6 — THE DRIPSTONE WAY (x 146..176): ESCALATE + MASTER + finish ===============================
  signPost(G, 147, 1.7, -0.1, "THE DRIPSTONE WAY. The ceiling plays its tune LEFT to RIGHT, round and round - dance the drops like a song you know. And mind the crack in the floor. The mountain yawned once and never shut its mouth.");
  // the CREVASSE — a 4.4u held hop (comfortable vs the 5.5 ceiling), candy-arc telegraphed; the fall costs a
  // heart + the walk back to CP2 (pitDressing = the visible danger; NEVER combined with slick ice here)
  candyLine(G, [[147,1.3,0],[150.2,2.9,0],[153.6,1.3,0]], 3);
  groundX(G, 152.4, 180, SNOW);
  // THE ICICLE WAVE — five columns, phases at exact 0.7 steps (= one telegraph): as each drops, the NEXT starts
  // shimmering — the wave rolls left-to-right forever and the dodge rhythm IS the path. MASTER the gimmick here.
  w6l3Ceiling(deco, 154, 172, 7.0);
  w6String(L, 158, 5.8, 164, 5.8, {sag:0.5});                          // someone lit the way out, bless them
  G.ents.add(new SpikeIcicle(G, 156,   7.0, {period:4.2, phase:0.0}));
  G.ents.add(new SpikeIcicle(G, 159.5, 7.0, {period:4.2, phase:0.7}));
  G.ents.add(new SpikeIcicle(G, 163,   7.0, {period:4.2, phase:1.4}));
  G.ents.add(new SpikeIcicle(G, 166.5, 7.0, {period:4.2, phase:2.1}));
  G.ents.add(new SpikeIcicle(G, 170,   7.0, {period:4.2, phase:2.8}));
  candyLine(G, [[157.8,0.9,0],[161.2,0.9,0],[164.7,0.9,0],[168.3,0.9,0]], 4);   // candy sits in the wave's safe pockets
  // SNOW-BOO #2 — drifts the corridor when unwatched; STARE it into a standable ice block: the level's own
  // learned verbs stack — freeze yourself a pause between drops (the block is safe, the glow never lies)
  G.ents.add(new SnowBoo(G, 161, 0, 0, {phase:0.8, speed:2.0, range:10, freezeMax:2.4}));
  w6l3Lamp(G, deco, 165, 2.6, false);                                  // emissive fake — the corridor's warm dot
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

  // themed death-pit dressing (the crevasse ONLY — the one void in the level; the fall is the hazard)
  pitDressing(G, 148, 152.4, 'winter');

  // exit + the W6 tail. clutter split by hand around the massif and the crevasse (no props poking through)
  w6LevelFinish(G, -8, 180, null);
  w6Clutter(G, -8, 96, 'winter');
  w6Clutter(G, 114, 148, 'winter');
  w6Clutter(G, 152.4, 178, 'winter');

  return {spawnX: 0, exitX: 176};
}

function updateW6L3(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the icicle clocks, roller clocks, bulb twinkle, aurora and cascade shimmer
  // all self-tick deterministically through G.ents from their fixed phases. The frozen lantern stays frozen.
}

W6_LEVELS.push({id:'w6l3', district:'w6', name:'ICICLE GROTTO', build:buildW6L3, update:updateW6L3, parTime:160});

// ============ LEVEL 7-3 — THE FROZEN TRAWLER (District 7 · Frostmere · Frozen Lake Fell) ============
// THE CLIMB LEVEL (constitution 6a: every district ships one). The LUCKY CATCH — a great fishing trawler
// locked keel-deep in the ice, mid-lake, a county of white in every direction. Her crew set the galley
// table, put down their spoons, and walked home across the ice a hundred winters ago. The salvage saws
// beside her hull never got the memo. BEYOND-D5 BAND from the first step (Lake Fell is post-post-story):
// exactly CP0 + ONE lit lantern at ~51%, chained set-pieces composing 2-3 mechanics — but MAIN-GAME FAIR:
// hearts-always, every telegraph >=0.6s (squawk 0.6 · icicle shimmer 0.7 · angler bubbles 0.7 · bear roar
// 0.7 · bat squeak->impact ~1.0 · crack-panel spiderweb->CREAK->shatter over 1.1s stood), <=4 simultaneous
// threats at the single worst seam, every clock fixed from level start, one-good-run-away.
//   BEAT 1 THE NEAR SHORE            x -8..22    — CP0. The Fisher's Hut in its clear pocket (CLEAR-PATCH
//          law, worst-case reach math pinned below), a staring crow, and the wreck black on the horizon.
//   BEAT 2 THE CRACKING CROSSING     x 22..46    — w7CrackLake, introduced SOLO: stand still and the lake
//          counts you down (spiderweb -> CREAK -> plunge = heart + lantern walk-back, the kit price).
//          Slick underfoot (tag ice) — the route asks PACE, never a precision stop. Candy sets the tempo.
//   BEAT 3 THE RING OF HOLES (TWIST) x 46..60    — clear glass ice (translucent — you SEE them circling),
//          two drilled fishing holes, TWO Ice Anglers hunting them (0.7s glow+bubble telegraph, stomp the
//          lunge to pop one), a local penguin tobogganing its home rink. Move your boots.
//   BEAT 4 THE SAWYARD (ESCALATE)    x 60..70.5  — the salvage crew's timber track: TWO traveling saw
//          blades shuttling one slot on mirrored clocks — they meet in the middle; follow a blade or hop
//          it, never argue with the middle. THE lantern (x69.2) burns at the yard's end, under the stern.
//   BEAT 5 THE CLIMB (MASTER pt.1)   x 70..95    — hull ladder -> aft deck (Snow-Boo works the hatch) ->
//          ratlines at the mast. BRANCH LEFT: the crow's-nest lines (Blizzard Bat #1 rounds the mast; nest
//          = rest pocket, Heart + BAT WINGS). BRANCH RIGHT: the quick BOOM-WALK (Bat #2 contests it).
//          LOW: the main deck under the boom — a SpikeIcicle TRIO works the planks, Boo #2 + Bat #2 at the
//          seam (worst honest stack: boo + bat + one icicle clock + a second telegraphing = 4, THE cap).
//          SECRET: two open hatches drop into THE HOLD — the sleepwalking Somnambear walks his rounds over
//          the ship's own crack-ice floor (her keel is torn out; the lake IS the deck down there). Wake him
//          and his slam widens the holes. GOLDEN PUMPKIN idx1 glows through the breach planks; the chain
//          up is the only door out, and the watchman patrols between. The galley table waits, still set.
//   BEAT 6 THE POLAR TRIPLETS (MID-BOSS) x 95.5..104.5 — three bear cubs rolling the tilted foredeck in
//          staggered thirds (the Gourd Triplets tradition, now fluffy): fixed lanes, fixed clocks, stomp
//          each once while the others roll — or dance through and let them keep the ship.
//   BEAT 7 THE LONG WAY HOME         x 105..148  — down the bow, one last cracking sprint (pace, mastered,
//          alone with the aurora), a penguin with opinions on the home shore, and the gate.
// Reads UNMISTAKABLY Lake Fell: W7PAL white ice on the deep night, the aurora + the wreck's one surviving
// ghost-light string as the only festivity, anglers glowing under your feet, the far-shore village a thin
// line of warm windows you are very far from. Three lanes busy the whole ship (deck/boom/hold + two bats).
// COMPARABLE HEIGHTS (tap 1.8 / held 2.6 / double 3.3): deck steps 0.4/0.6, shelf step 0.4 (walk-up),
// hatch gaps 2.0/2.2 tap-clear, bow re-climb 1.8/2.1/2.1 — everything higher is CLIMB-gated (ladder 5.8,
// ratlines 8.6, nest lines 11.6, chain 5.6), each verb candy-traced. NO Leap of Faith (both are placed and
// sacred). NO warp (the Bell-Buoy belongs to its own level). GP idx1 lives here; idx0/idx2 elsewhere in w7.
// HEARTS ALWAYS: every blade/icicle/lunge/swipe/deer-less hazard costs a heart; both lakes charge the kit's
// plunge (heart + lantern walk-back); fish holes are the kit's shallow dunk. Nothing one-shots. NEVER an
// extra hazard stacked AT a hole (the anglers ARE the kit's hole-users, 0.7s-telegraphed). Deterministic to
// the flake: saws/icicles/cubs/bats/bear on fixed clocks + phases, NO Math.random on the critical path;
// rand() only inside baked deco.
//
// ---- REACH-MATH LEDGER (pinned; re-run the height audit if any number moves) ----
// CP0 (x2, body 1.6..2.4): hut ambush = opt-in (kit spawnGrace 1s) · penguin#1 patrol 51..55 wakeR 5, max
//   left slide 51-8.9=42.1 (39.7u clear) · anglers lunge only at holes (nearest 49.2) · everything else is
//   on or under the ship (68u+). IDLE-SAFE.
// THE LANTERN (x69.2, body 68.8..69.6): saw blades cx<=66.8 + 0.85 bite = 67.65 (1.15 clear) · penguin#1
//   max RIGHT slide 55+8.9=63.9 (4.9) · angler#2 nearest hole 56.4 (12.4) · boo#1 home (78.5,5.0) leashed
//   chaseR 4.5 -> active only inside x74..83 (9.3) · bear sealed in the hold · bat#1/#2 trigger edges 78.8/
//   83.5, both far up the ship · cubs live at deck y6. IDLE-SAFE.
// FISHER'S HUT (x9): nearest worst-case reach = penguin#1 slide to 42.1 -> 33u clear (law asks 6). Its own
//   ambush cubs (lanes to x22.3 / x-5.3) are the kit's sanctioned, grace-protected exception. CLEAR.
// THE HOLD (bear home 80.7, range 1.9 -> sleepwalks 78.8..82.6): wake zone = patrol +-1.8 -> 77.0..84.4 ·
//   worst swipe = wake at 82.6 + 7u/s*0.45 lunge = 85.75 center + touchR 1.25 = 87.0 reach · slam (panel
//   shatter r3.2) covers cx 75.6..85.8 -> chain panel cx75.2 NEVER shatters (0.4 margin), all others can.
//   GP at 88.5 (1.5u past worst swipe) · chain base x75 (2.0u left of wake zone) · aft-hatch drop lands
//   x~75 (safe), mast-hatch drop lands x~86 (1.6u right of wake zone). The lip 86.2..87.0 is contested
//   ONLY after a wake the player caused, behind a 0.7s roar. STAGED CLEAR OF THE GP ROUTE.
// CROW'S NEST (x80.3..82.9, y11.8): bat#1 flies y10.6 and only dives targets BELOW 11.1 -> the nest is the
//   climb's rest pocket, by construction.
// ----------------------------------------------------------------------------------------------------

// ---- clear glass ice — the RING band: same translucent glass as the CrackLake panels (the anglers must
// READ through the floor — an opaque w6IceX would hide the whole mechanic) but STATIC: it never cracks.
// Slick (tag ice). Dark water + drowned gleams below, kit-matched at y-2.6. ----
function w7l3GlassIce(G, x1, x2){
  const w = x2-x1, cx = (x1+x2)/2;
  const water = mesh('box',[w,0.5,9], emat(W7PAL.water, W7PAL.waterG, 0.35)); water.position.set(cx,-2.6,0); G.scene.add(water);
  const gl = new THREE.Group();
  for(let i=0;i<Math.floor(w/2.2);i++){ const s=mesh('sph',[rand(0.05,0.1),4,4], emat(0x2a6a9a,0x2a6a9a,0.8)); s.position.set(rand(x1,x2), rand(-2.2,-1.4), rand(-1.5,1.5)); gl.add(s); }
  G.scene.add(bakeGroup(gl));
  const slab = new THREE.Mesh(geo('box', w, 0.3, 5), new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.18, transparent:true, opacity:0.82}));
  slab.position.set(cx,-0.15,0); G.scene.add(slab);
  // pressure seams so 14u of glass doesn't read as one blank pane (baked)
  const seams = new THREE.Group();
  for(let sx=x1+2.6; sx<x2-1; sx+=rand(2.2,3.4)){ const ln=mesh('box',[rand(0.8,1.6),0.02,0.05], mat(0x9ab4d8)); ln.position.set(sx,0.02,rand(-1.6,1.6)); ln.rotation.y=rand(TAU); seams.add(ln); }
  G.scene.add(bakeGroup(seams));
  G.world.addBox(cx,-0.3,0,w,0.3,5,{tag:'ice'});
}

// ---- the hull rope ladder (the w4l3 idiom, lake-industry skinned): hemp side-ropes + driftwood rungs,
// baked; the verb is the separate {type:'climb'} volume the caller lays. ----
function w7l3Ladder(x, y0, y1){
  const g = new THREE.Group();
  const rm = mat(W7PAL.rope), rung = mat(0x6a5238);
  for(const sx of [-0.3, 0.3]){ const rope=mesh('cyl',[0.045,0.045,(y1-y0),5], rm); rope.position.set(x+sx,(y0+y1)/2,0); crook(rope,0.02); g.add(rope); }
  for(let y=y0+0.4; y<y1; y+=0.55){ const r=mesh('cyl',[0.04,0.04,0.72,5], rung); r.rotation.z=Math.PI/2; r.position.set(x,y,0); g.add(r); }
  const cap=mesh('sph',[0.16,6,5], mat(W6PAL.snow)); cap.scale.y=0.4; cap.position.set(x,y1+0.05,0); g.add(cap);   // snow on the top rung
  return g;
}

// ---- ratlines — the shroud-and-crossrope web every trawler wears. Two tarred shrouds + rope steps +
// one diagonal stay so it reads RIGGING, not ladder. Baked visual; climb volume laid by the caller. ----
function w7l3Ratlines(x, y0, y1, lean=0){
  const g = new THREE.Group();
  const rm = mat(0x2e2620);
  for(const sx of [-0.42, 0.42]){
    const h = y1-y0;
    const rope = mesh('cyl',[0.035,0.045,h,5], rm);
    rope.position.set(x+sx+lean*0.5, y0+h/2, 0); rope.rotation.z = lean*0.12; g.add(rope);
  }
  for(let y=y0+0.35; y<y1; y+=0.55){
    const k=(y-y0)/(y1-y0);
    const r = mesh('cyl',[0.028,0.028,0.86,4], rm); r.rotation.z=Math.PI/2; r.position.set(x+lean*k, y, 0); g.add(r);
  }
  const stay = mesh('cyl',[0.025,0.025,(y1-y0)*1.12,4], rm); stay.position.set(x+0.15,(y0+y1)/2,0.12); stay.rotation.z=0.35; g.add(stay);
  return g;
}

// ---- the hold chain — fat frozen links up through the aft hatch (the windlass never finished hauling).
// Baked visual; the climb volume is the caller's. ----
function w7l3Chain(x, y0, y1){
  const g = new THREE.Group();
  const lm = mat(W7PAL.steel);
  let flip=false;
  for(let y=y0+0.15; y<y1; y+=0.3){
    const link = mesh('tor',[0.14,0.045,5,10], lm); link.position.set(x,y,0);
    link.rotation.y = flip?Math.PI/2:0; flip=!flip; g.add(link);
  }
  const ic = mesh('cone',[0.05,0.3,4], emat(W7PAL.glass,0x4a8ec8,0.4)); ic.rotation.x=Math.PI; ic.position.set(x+0.12,y0+0.5,0.1); g.add(ic);
  return g;
}

// ---- THE QUIET PROP: the galley table, set for a crew that walked home across the ice — three bowls,
// two cups, stools tucked in neat... and ONE chair pulled back from the table, turned toward the shore.
// Whoever sat there left first, and the others followed. A single candle, long cold. Never signposted;
// fully baked; visible in the hold's cross-section as you climb past. Story-readers stop. That's the point. ----
function w7l3Galley(x, z){
  const g = new THREE.Group();
  const wd = mat(0x5a4632), wdD = mat(0x3a2c1e);
  const top = mesh('box',[2.2,0.1,1.0], wd); top.position.set(x,0.78,z); g.add(top);
  for(const [lx,lz] of [[-0.9,-0.35],[0.9,-0.35],[-0.9,0.35],[0.9,0.35]]){ const leg=mesh('box',[0.09,0.75,0.09], wdD); leg.position.set(x+lx,0.4,z+lz); g.add(leg); }
  for(const bx of [-0.6,0,0.6]){ const bowl=mesh('sph',[0.14,7,5], mat(0x8a94a8)); bowl.scale.y=0.45; bowl.position.set(x+bx,0.88,z-0.12); g.add(bowl); }
  for(const cx2 of [-0.3,0.42]){ const cup=mesh('cyl',[0.06,0.05,0.12,7], mat(0x9aa4b8)); cup.position.set(x+cx2,0.9,z+0.22); g.add(cup); }
  const candle=mesh('cyl',[0.035,0.04,0.16,6], mat(0xe8e0c8)); candle.position.set(x+0.05,0.91,z); g.add(candle);   // cold. no flame. they took the light with them
  for(const sx of [-0.85,0.15,0.85]){ const stool=mesh('cyl',[0.16,0.14,0.42,7], wdD); stool.position.set(x+sx,0.21,z+0.62); g.add(stool); }
  const seat=mesh('box',[0.42,0.06,0.42], wd); seat.position.set(x-1.55,0.46,z+0.5); seat.rotation.y=0.7; g.add(seat);       // the pulled-back chair,
  const back=mesh('box',[0.06,0.55,0.42], wd); back.position.set(x-1.74,0.76,z+0.62); back.rotation.y=0.7; g.add(back);      // turned toward the shore
  for(const [lx,lz] of [[-0.16,-0.16],[0.16,-0.16],[-0.16,0.16],[0.16,0.16]]){ const cl=mesh('box',[0.05,0.44,0.05], wdD); cl.position.set(x-1.55+lx*1.4,0.22,z+0.5+lz*1.4); g.add(cl); }
  return g;
}

function buildW7L3(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW  = W6PAL.snowD;    // wind-packed shore snow
  const DECK  = 0x584636;       // her weathered deck timber
  const HULLC = 0x342718;       // tarred hull planking

  const deco = new THREE.Group();            // every static bakes to one draw call at the tail
  const L = w6LightsBegin();                 // the wreck's one surviving ghost-light string (+ the home posts)

  // =============================== BEAT 1 — THE NEAR SHORE (x -8..22) ===============================
  groundX(G, -8, 22, SNOW);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start (exam law: this + ONE lantern)
  signPost(G, 5, 1.7, -0.12, "THE LUCKY CATCH. She hauled her last nets a hundred winters ago and the lake closed its hand around her. The salvage crew's saws are still running. The crew is still... somewhere. Climb her if you must.");
  // THE FISHER'S HUT — the gamble, in its clear pocket (reach ledger above: 33u to the nearest worst case)
  { const h = new FisherHut(9, 0, -0.9, 0.12); G.coffins.push(h); G.ents.add(h); }
  G.ents.add(new Crow(14, 0.95, 2.3));                                 // lake crow #1 — flaps off when neared
  candyLine(G, [[5.5,0.9,0],[11.5,0.9,0]], 3);
  signPost(G, 19.3, 1.7, 0.1, "THE LAKE KEEPS SCORE. Stand anywhere too long and it starts the arithmetic - spiderweb, CREAK, splash. Keep moving and it never finishes the math. The ice heals behind you. It always does.");
  // an abandoned catch-sled half-drifted-in (shore dressing, baked)
  { const sl=mesh('box',[1.5,0.18,0.7], mat(0x5a4632)); sl.position.set(16.5,0.2,-1.8); sl.rotation.z=0.06; deco.add(sl);
    for(const rz of [-0.32,0.32]){ const run=mesh('box',[1.8,0.07,0.09], mat(0x3a2c1e)); run.position.set(16.5,0.08,-1.8+rz); deco.add(run); }
    const dr=mesh('sph',[0.5,7,5], mat(W6PAL.snow)); dr.scale.y=0.4; dr.position.set(17.1,0.2,-1.7); deco.add(dr); }

  // =============================== BEAT 2 — THE CRACKING CROSSING (x 22..46): the mechanic, SOLO ===============================
  // w7CrackLake #1 (panels cx 23.2..44.8). Slick + cracking — the level's whole lesson in one clean span:
  // PACE. Nothing else hunts here (anglers need holes; holes here are player-made). Candy sets the tempo.
  w7CrackLake(G, 22, 46);
  candyLine(G, [[25,0.9,0],[44,0.9,0]], 6);                            // one candy per stride — the no-stop rhythm

  // =============================== BEAT 3 — THE RING OF HOLES (x 46..60): TWIST — things use the holes ===============================
  w7l3GlassIce(G, 46, 60);                                             // translucent: you SEE the hunters circling
  signPost(G, 46.8, 1.7, -0.1, "THE RING. The crew drilled these holes; something below inherited them. A warm little light rising under the ice is NOT the sunrise - it is an invitation you should decline. Move your boots.");
  w7FishHole(G, 49.2, 1.6);                                            // the drilled ring — permanent, registered
  w7FishHole(G, 56.4, 1.6);                                            //   on the anglers' menu (kit dunk price only)
  // TWO Ice Anglers — both live under translucent floor their whole active band (never under opaque snow):
  // #1 active 25..51 (lake A player-holes + ring hole 49.2) · #2 active 46..61 (both ring holes). Lunge =
  // 0.7s glow+bubbles at the hole, stomp mid-lunge pops it. Fixed phases; player-reactive, hole-gated.
  G.ents.add(new IceAngler(G, 38, 0, 0, {phase:0.0, range:13, speed:2.6}));
  G.ents.add(new IceAngler(G, 53.5, 0, 0, {phase:1.7, range:7.5, speed:2.8}));
  // a local penguin on its home rink (slides faster on home ice — the w6l5 precedent). Patrol 51..55 sits
  // between the holes with 1u margins — never a hazard stacked AT a hole.
  G.ents.add(new FrostbitePenguin(G, 53, 0, 0, {phase:0.7, range:2.0, slideSpeed:9.5}));
  candyLine(G, [[48,0.9,0],[58.5,0.9,0]], 4);                          // 48/51.5/55/58.5 — every piece off the holes
  G.ents.add(new Crow(59.3, 0.95, 2.2));                               // lake crow #2, watching the sawyard (the house tell)

  // =============================== BEAT 4 — THE SAWYARD (x 60..70.5): ESCALATE — the machines ===============================
  groundX(G, 60, 70.5, SNOW);
  signPost(G, 60.3, 1.7, 0.12, "SALVAGE YARD. Two blades, one track, zero supervision for a hundred years. Follow a blade or hop it - and never argue with the middle, that's where they meet to gossip.");
  // TWO traveling saw blades, one slot, MIRRORED clocks (period 3.4, phase 0 / 3.4 = half of the 6.8s
  // ping-pong): they cross at x64.15 every cycle. Counters, both taught by the sign + the visible motion:
  // shadow a blade down the track, or tap-hop one (bite tops out at y1.35; tap apex 1.8 clears).
  w7IceSaw(G, {x0:61.5, x1:66.8, y:0.55, period:3.4, phase:0});
  w7IceSaw(G, {x0:61.5, x1:66.8, y:0.55, period:3.4, phase:3.4});
  candyLine(G, [[62.2,0.9,0],[66.2,0.9,0]], 3);                        // the track rhythm, traced
  // the yard itself: sawhorses, a plank stack, cut lake-glass blocks awaiting a wagon that never came (baked)
  { for(const hx of [61.8, 65.6]){ for(const s of [-1,1]){ const leg=mesh('box',[0.08,0.7,0.5], mat(0x3a2c1e)); leg.position.set(hx+s*0.35,0.35,-1.7); leg.rotation.z=s*0.35; deco.add(leg); }
      const bar=mesh('box',[1.3,0.12,0.14], mat(0x5a4632)); bar.position.set(hx,0.72,-1.7); deco.add(bar); }
    for(let i=0;i<4;i++){ const pl=mesh('box',[2.6,0.09,0.4], mat(0x5a4632)); pl.position.set(68.6,0.1+i*0.11,-1.9+i*0.05); pl.rotation.y=rand(-0.08,0.08); deco.add(pl); }
    for(const [bx,by] of [[63.4,0.3],[64.1,0.3],[63.75,0.85]]){ const blk=new THREE.Mesh(geo('box',0.6,0.55,0.6), new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.75})); blk.position.set(bx,by,-2.1); deco.add(blk); } }
  // THE LANTERN — the level's ONE lit checkpoint (x69.2 ≈ 51% of the run to the gate at 143; the exam law).
  // Idle-safe by the ledger up top: saw bite <=67.65, penguin slide <=63.9, boo leash floor x74, bear sealed.
  // Death anywhere on the ship walks back to HERE — re-earning the ladder is part of the price.
  G.ents.add(new Checkpoint(69.2, 0, 1.6, 1));

  // =============================== BEAT 5 — THE SHIP (x 70..95): THE CLIMB ===============================
  // ---- the hull (solid blocks + their VISIBLE planked masses — physics is invisible boxes, meshes are
  //      the ship; the hold between them stays dollhouse-open, which is exactly how a cutaway reads) ----
  G.world.addBox(72.5, 0, 0, 3, 5.0, 4, {});                           // stern block x71..74 (top = aft deck y5.0)
  G.world.addBox(99.5, 0, 0, 12, 6.0, 4, {});                          // bow block x93.5..105.5 (top = foredeck y6.0)
  { const stern=mesh('box',[3,5.0,3.8], mat(HULLC)); stern.position.set(72.5,2.5,0); deco.add(stern);
    const sSheer=mesh('box',[3.1,0.3,3.9], mat(0x241a10)); sSheer.position.set(72.5,4.7,0); deco.add(sSheer);
    const plate=mesh('box',[1.25,0.5,0.06], mat(W7PAL.brassD)); plate.position.set(72.5,3.8,1.93); deco.add(plate);        // her name plate — salt-scoured smooth
    const plateIn=mesh('box',[1.05,0.34,0.05], mat(0x241a10)); plateIn.position.set(72.5,3.8,1.96); deco.add(plateIn);
    const bow=mesh('box',[12,6.0,3.8], mat(HULLC)); bow.position.set(99.5,3.0,0); deco.add(bow);
    const bSheer=mesh('box',[12.1,0.3,3.9], mat(0x241a10)); bSheer.position.set(99.5,5.65,0); deco.add(bSheer);
    const bWater=mesh('box',[12.1,0.24,3.9], mat(0x5a6478)); bWater.position.set(99.5,0.55,0); deco.add(bWater); }         // the old waterline, a lake too late
  // THE HULL LADDER — the gated way up (5.8 top: the exit hop clears the bulwark). Candy climbs it with you.
  deco.add(w7l3Ladder(70.3, 0.3, 5.7));
  G.world.addBox(70.3, 0, 0, 1.0, 5.8, 1.2, {type:'climb'});
  candyLine(G, [[70.3,2.0,0],[70.3,5.2,0]], 3);
  // ---- AFT DECK (y5.0, x71..81) — split by the AFT HATCH (74..76, 2.0u tap gap · also hold door #1) ----
  platform(G, 72.5, 5.0, 0, 3, 4, DECK);
  platform(G, 78.5, 5.0, 0, 5, 4, DECK);
  candyLine(G, [[73.5,5.9,0],[75,6.4,0],[76.5,5.9,0]], 3);            // the hatch-hop arc (and the hold's open lid)
  // THE HOLD CHAIN — the only road OUT of the hold, up through the aft hatch (windlass chain, frozen taut)
  deco.add(w7l3Chain(75, 0.2, 5.4));
  G.world.addBox(75, 0, 0, 0.9, 5.6, 1.2, {type:'climb'});
  // SNOW-BOO #1 — works the aft deck + the chain exit (leashed chaseR 4.5 -> active x74..83 only; the
  // lantern below at 69.2 stays 9.3u outside its world). Stare it solid: the ice block is a standable
  // step right where the chain tops out — the learned rule IS the counter, both directions.
  { const b1 = new SnowBoo(G, 78.5, 5.0, 0, {phase:0.4, speed:2.1, range:8, freezeMax:2.4}); b1.chaseR = 4.5; G.ents.add(b1); }
  // the wheelhouse — dark windows, snow on the roof, the wheel still lashed (deco, stern end, background lane)
  { const wh=mesh('box',[2.3,1.9,1.5], mat(HULLC)); wh.position.set(72.6,6.0,-1.5); deco.add(wh);
    const roof=mesh('box',[2.5,0.16,1.7], mat(0x241a10)); roof.position.set(72.6,7.0,-1.5); deco.add(roof);
    const snowc=mesh('box',[2.5,0.14,1.6], mat(W6PAL.snow)); snowc.position.set(72.6,7.12,-1.5); deco.add(snowc);
    for(const wx of [-0.7,0,0.7]){ const win=mesh('box',[0.44,0.5,0.08], emat(0x223354,0x3a5a8a,0.15)); win.position.set(72.6+wx,6.25,-0.72); deco.add(win); }   // cold panes — nobody's home
    const funnel=mesh('cyl',[0.22,0.28,1.1,8], mat(0x6e222c)); funnel.position.set(73.6,7.6,-1.7); funnel.rotation.z=-0.06; deco.add(funnel); }
  // ---- MAIN DECK (y5.4): deck A x81..84.9 · THE MAST HATCH 84.9..87.1 (2.2u tap gap · hold door #2,
  //      the RIGGING DROP — hop off the ratlines and fall clean through) · deck B x87.1..93.5 ----
  platform(G, 82.95, 5.4, 0, 3.9, 4, DECK);
  platform(G, 90.3, 5.4, 0, 6.4, 4, DECK);
  G.ents.add(new BonkLantern(G, 81.9, 6.9, 0, 'shield'));              // armor before the icicle seam — the essay question
  candyLine(G, [[84.4,6.3,0],[86,7.0,0],[87.6,6.3,0]], 3);            // the mast-hatch arc (jump it... or don't. the glow below is a door)
  candyLine(G, [[89,6.3,0],[93,6.3,0]], 2);
  // SNOW-BOO #2 — deck A's resident (leashed chaseR 5 -> active x<=88.5): stare it SOLID to take it out
  // of the dance for 2.6s while you read the icicle clocks — the freeze buys the read, never the dodge
  // (icicles fall from above; nothing stops those but your feet). The district trade, taught at altitude.
  { const b2 = new SnowBoo(G, 83.5, 5.4, 0, {phase:1.1, speed:2.2, range:8, freezeMax:2.6}); b2.chaseR = 5; G.ents.add(b2); }
  // ---- THE MAST + RIGGING (x84) — lower ratlines 5.4->8.6, nest lines 8.0->11.6 (they overlap 83.45..83.95
  //      so a climber transfers left mid-air-free; the verb chain is continuous) ----
  { const mast=mesh('cyl',[0.22,0.3,8.4,9], mat(0x3e3020)); mast.position.set(84,9.5,-0.2); mast.rotation.z=-0.025; deco.add(mast);
    const mastCap=mesh('sph',[0.28,7,5], mat(W6PAL.snow)); mastCap.scale.y=0.5; mastCap.position.set(83.9,13.7,-0.2); deco.add(mastCap); }
  deco.add(w7l3Ratlines(84, 5.4, 8.6, 0));
  G.world.addBox(84, 5.4, 0, 1.1, 3.2, 1.2, {type:'climb'});
  candyLine(G, [[84,6.6,0],[84,8.4,0]], 3);                            // rung by rung — the climb-verb telegraph
  deco.add(w7l3Ratlines(83.4, 8.0, 11.6, -0.3));
  G.world.addBox(83.4, 8.0, 0, 1.1, 3.6, 1.2, {type:'climb'});
  // ---- THE BOOM (y8.0, x84.7..95) — the quick right-branch: a spar-walk over the icicle seam, contested
  //      by both bats, ending in a clean drop at the Triplets' door (the landing pocket 94.5..95.5 is
  //      clear of icicle 93.0's column AND of cub lane reach 95.65 — pinned). ----
  platform(G, 89.85, 8.0, 0, 10.3, 0.9, DECK);
  { const spar=mesh('cyl',[0.13,0.17,10.6,7], mat(0x3e3020)); spar.rotation.z=Math.PI/2; spar.position.set(89.85,7.62,0); deco.add(spar);
    const rope=mesh('cyl',[0.03,0.03,10.0,4], mat(0x2e2620)); rope.rotation.z=Math.PI/2; rope.position.set(89.8,7.25,0.25); deco.add(rope);   // the foot-rope
    const tackle=mesh('sph',[0.2,6,5], mat(W7PAL.brassD)); tackle.position.set(94.6,7.35,0.1); deco.add(tackle); }
  candyLine(G, [[86,8.9,0],[93.5,8.9,0]], 3);
  // ---- THE CROW'S NEST (x80.3..82.9, y11.8) — the left branch's prize + the climb's rest pocket ----
  platform(G, 81.6, 11.8, 0, 2.6, 2, DECK);
  { const rail=mesh('cyl',[0.9,1.0,0.7,10,1,true], mat(HULLC)); rail.position.set(81.6,12.2,0); deco.add(rail);
    const strut=mesh('cyl',[0.06,0.08,2.4,5], mat(0x3e3020)); strut.position.set(82.9,11.0,-0.15); strut.rotation.z=0.75; deco.add(strut);
    const nsnow=mesh('sph',[0.7,7,5], mat(W6PAL.snow)); nsnow.scale.y=0.25; nsnow.position.set(81.3,12.55,0); deco.add(nsnow); }
  G.ents.add(new Heart(81.0, 12.7, 0));
  G.ents.add(new BonkLantern(G, 82.2, 13.1, 0, 'bat'));                // BAT WINGS at the masthead — earn the sky, spend it on the boom and the Triplets
  candyLine(G, [[80.8,12.7,0],[82.4,12.7,0]], 3);
  // BLIZZARD BAT #1 — rounds the mast (squeak->impact ~1.0s of warning): contests the nest lines below
  // y11.1 and the boom's first steps; can NEVER dive a player standing ON the nest (y11.8 > trigger band).
  G.ents.add(new BlizzardBat(G, 84, 10.6, 0, {phase:0.8, range:2.2, period:3.2, aggroR:3.0}));
  // BLIZZARD BAT #2 — works the boom's middle + deck B (patrol 86.7..90.3; trigger edge 93.5 — the
  // Triplets' arena at 95.65+ stays bat-free so the mid-boss holds its own 3-threat cap).
  G.ents.add(new BlizzardBat(G, 88.5, 9.6, 0, {phase:1.9, range:1.8, period:3.6, aggroR:3.2}));
  // ---- THE ICICLE SEAM — the trio under the boom, working deck B on three staggered clocks (shimmer +
  //      drip + floor-glow, 0.7s). Honest lanes 88.7..90.1 and 91.1..92.5 between columns; worst simul-
  //      taneity at the seam = boo#2 + bat#2 + one falling + one telegraphing = 4, THE CAP, all separate
  //      clocks, all telegraphed — and the stared-solid boo is the cover that buys the read. ----
  G.ents.add(new SpikeIcicle(G, 88.2, 7.9, {period:4.2, phase:0.0, len:1.05, floorY:5.4}));
  G.ents.add(new SpikeIcicle(G, 90.6, 7.9, {period:4.7, phase:1.6, len:1.05, floorY:5.4}));
  G.ents.add(new SpikeIcicle(G, 93.0, 7.9, {period:5.2, phase:3.2, len:1.05, floorY:5.4}));

  // ---- THE HOLD (x74..93.5 below decks) — her keel is torn out: the LAKE is the floor down there.
  //      Door #1 = the aft hatch (drop at ~75, safe by the ledger) · door #2 = the rigging drop through
  //      the mast hatch (lands ~86, on the shelf lip's panel — move, that's the house rule). The GP shelf
  //      (x86..93.5, y0.4 — a walk-up step, never a precision stop on cracking ice) carries GOLDEN
  //      PUMPKIN idx1; its glow bleeds through the breach planks to the sawyard below. The SOMNAMBEAR
  //      walks his rounds between the doors — the reach ledger up top stages every number. ----
  G.world.addBox(89.75, 0, 0, 7.5, 0.4, 4, {});                        // the cargo shelf (solid — the one dry plank left)
  { const shelfM=mesh('box',[7.5,0.4,4], mat(0x4a3826)); shelfM.position.set(89.75,0.2,0); deco.add(shelfM); }
  G.ents.add(new GoldPumpkin(88.5, 1.4, 0, 1));                        // GP idx1 — its own light IS the breach glow
  signPost(G, 77.2, 1.5, 0.15, "SHHH. The watchman sleeps on his rounds. Wake him and he swings exactly ONCE - then dreams on and forgets you. The floor takes notes either way. Tiptoe, or time the yawn.");
  G.ents.add(new Somnambear(G, 80.7, 0, 0, {phase:0.6, range:1.9, dir:1, speed:0.85, candy:8}));
  candyLine(G, [[78.6,0.9,0],[83.4,0.9,0]], 3);                        // the tiptoe line, right through his dream
  candyLine(G, [[91.5,1.3,0],[92.8,1.3,0]], 2);                        // the far corner's spare change
  // THE QUIET PROP — the galley table, still set (back wall of the hold; read it from the rigging, or don't)
  deco.add(w7l3Galley(77.5, -1.7));
  // hull cross-section dressing: far-side planking + ribs, portholes dark; foreground BREACH planks (z>0,
  // x86.5..90) with gaps — the Golden Pumpkin's glow escapes between them (the secret's honest tell)
  { for(let i=0;i<3;i++){ const strake=mesh('box',[36,0.85,0.3], mat(i%2?HULLC:0x2b2014)); strake.position.set(88,0.6+i*1.62,-2.35); strake.rotation.z=0.004*(i-1); deco.add(strake); }
    const sheer=mesh('box',[36,0.3,0.32], mat(0x241a10)); sheer.position.set(88,4.9,-2.35); deco.add(sheer);
    for(let rx=71.5; rx<105; rx+=3.1){ const rib=mesh('box',[0.35,4.9,0.12], mat(0x241a10)); rib.position.set(rx,2.45,-2.2); deco.add(rib); }
    for(const px of [76.5, 84.2, 92.0]){ const port=mesh('circ',[0.28,10], mat(0x101828)); port.position.set(px,3.3,-2.18); deco.add(port);
      const rim=mesh('tor',[0.3,0.045,5,12], mat(W7PAL.brassD)); rim.position.set(px,3.3,-2.16); deco.add(rim); }
    for(let i=0;i<3;i++){ const bp=mesh('box',[0.42,3.4,0.12], mat(0x2b2014)); bp.position.set(87.1+i*1.25,1.7,1.7); bp.rotation.z=rand(-0.06,0.06); deco.add(bp); } }   // the breach planks — mind the gaps
  // pressure-ridge collar — the lake's grip on her hull (baked slabs both shoulders of the waterline)
  { for(let cx=71; cx<105; cx+=rand(2.4,4.2)){ const slab=new THREE.Mesh(geo('box',rand(0.8,1.6),rand(0.35,0.8),0.5), new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.7}));
      slab.position.set(cx, rand(0.1,0.45), rand()<0.5?1.9:-1.95); slab.rotation.z=rand(-0.5,0.5); deco.add(slab); } }

  // =============================== BEAT 6 — THE POLAR TRIPLETS (x95.5..104.5): THE MID-BOSS ===============================
  // The foredeck (bow block top, y6.0) — dressed as her listing bow: leaning rails, a dead winch, snow
  // drifted hard against the port side. Three cubs, three lanes, staggered THIRDS (period 2.99s, phases
  // 0/1.0/2.0 — the Gourd Triplets clock, fluffy edition): fixed lanes 96.5<->104, speed 4.3, stomp each
  // once while the others roll. Pure attention test; 3 threats, its own cap; no bat reaches past 93.5.
  { const planks=mesh('box',[12,0.14,4], mat(DECK)); planks.position.set(99.5,5.92,0); planks.rotation.z=0.012; deco.add(planks);   // the visual list (kept UNDER collider top 6.0 — feet never sink) — colliders stay honest and flat
    for(let px=94.5; px<105; px+=1.7){ const seam=mesh('box',[0.06,0.02,3.8], mat(0x3a2c1e)); seam.position.set(px,5.99,0); deco.add(seam); }
    for(const rx of [95, 99.5, 104]){ const post=mesh('box',[0.14,0.9,0.14], mat(HULLC)); post.position.set(rx,6.45,-1.85); post.rotation.z=-0.08; deco.add(post); }
    const rail=mesh('cyl',[0.05,0.05,10.4,5], mat(HULLC)); rail.rotation.z=Math.PI/2; rail.position.set(99.5,6.9,-1.87); deco.add(rail);
    const drift=mesh('sph',[2.6,8,6], mat(W6PAL.snow)); drift.scale.set(1.6,0.28,0.5); drift.position.set(100,6.2,-1.6); deco.add(drift);
    const winch=mesh('cyl',[0.5,0.5,1.1,10], mat(W7PAL.brassD)); winch.rotation.x=Math.PI/2; winch.position.set(94.6,6.5,-1.4); deco.add(winch);
    const wrope=mesh('cyl',[0.04,0.04,1.8,4], mat(0x2e2620)); wrope.position.set(94.6,6.2,-0.9); wrope.rotation.z=1.2; deco.add(wrope); }
  signPost(G, 94.9, 1.8, -0.1, "THE POLAR TRIPLETS! They rolled aboard. Nobody rolled them off. Three lanes, three tempers, one tilted deck - mind the rhythm and mind your shins.");
  G.ents.add(new PolarCub(G, 96.5, 6.0, 0, {x1:104,  speed:4.3, phase:0.0, pause:1.25}));
  G.ents.add(new PolarCub(G, 104,  6.0, 0, {x1:96.5, speed:4.3, phase:1.0, pause:1.25}));
  G.ents.add(new PolarCub(G, 96.5, 6.0, 0, {x1:104,  speed:4.3, phase:2.0, pause:1.25}));
  candyLine(G, [[98,7.4,0],[100.3,7.4,0],[102.6,7.4,0]], 3);          // the hop arcs, traced at cub-clearing height

  // =============================== BEAT 7 — THE LONG WAY HOME (x105..148) ===============================
  // down the bow (drops free; the return climb is 2.1/1.8 — the whole ship stays honestly re-climbable
  // for pumpkin hunters), then the lake one last time — the lesson, mastered, with nobody watching.
  { const prow=mesh('box',[2.6,6.4,3.2], mat(HULLC)); prow.position.set(106.3,3.0,0); prow.rotation.z=-0.18; deco.add(prow);       // her bow shoulder (visual — the block collider carries it)
    const sprit=mesh('cyl',[0.09,0.14,4.6,6], mat(0x3e3020)); sprit.position.set(107.6,7.0,-0.4); sprit.rotation.z=-1.05; deco.add(sprit);
    const bcap=mesh('sph',[0.3,6,5], mat(W6PAL.snow)); bcap.scale.y=0.4; bcap.position.set(109.6,8.0,-0.4); deco.add(bcap); }
  platform(G, 107.3, 4.2, 0, 2.4, 3, DECK);                            // spans 106.1..108.5 (drop 1.8)
  platform(G, 109.9, 2.1, 0, 2.2, 3, DECK);                            // spans 108.8..111 (drop 2.1, then 2.1 to the ice)
  G.ents.add(new Heart(107.3, 5.0, 0));                                // the guardian's-blessing echo after the Triplets
  candyLine(G, [[106.5,5.2,0],[109.5,3.1,0],[111.8,0.9,0]], 3);       // the graceful line down, traced
  groundX(G, 110.8, 114, SNOW);
  w7CrackLake(G, 114, 133);                                            // the mastery sprint — same law, no hand-holding
  candyLine(G, [[116,0.9,0],[131,0.9,0]], 6);
  groundX(G, 133, 148, SNOW);
  // one last local with opinions about visitors (patrol 134.8..139.2 — squawk 0.6s, the learned rule)
  G.ents.add(new FrostbitePenguin(G, 137, 0, 0, {phase:1.3, range:2.2}));
  G.ents.add(new Crow(135.5, 0.95, 2.3));                              // lake crow #3, unbothered, as ever
  // the home shore's little lit posts — the far village reaching out a hand (the level's ONE festive string)
  deco.add(w6LightPost(138.5, -1.8, 3)); deco.add(w6LightPost(142.5, -1.8, 3));
  w6String(L, 138.5, 2.95, 142.5, 2.95, {z:-1.7});
  candyLine(G, [[135.5,0.9,0],[140.5,0.9,0]], 2);
  exitGate(G, 143);

  // =============================== THE HOLD FLOOR — BUILT LAST, ON PURPOSE ===============================
  // w7CrackLake binds G._bearSlam to the panels of the MOST RECENT call — the Somnambear lives HERE, so
  // this lake must be the last one built (the approach + homeward lakes are out of his reach anyway; his
  // slam radius check (|cx-bx|<3.2 from x<=82.6) could never touch panels at cx>=115 regardless — this
  // ordering just makes the wiring correct AND obvious). Panels cx 75.2..84.8; the chain panel (75.2)
  // survives every possible slam by 0.4u — the door out never locks (and panels refreeze in 3.2s besides).
  w7CrackLake(G, 74, 86);

  // =============================== DECO · GHOST LIGHTS · SKY · PARALLAX ===============================
  // her one surviving festival string — mast to bow rail, still faithfully twinkling over a dead ship
  w6String(L, 83.9, 13.4, 100, 7.4, {z:-0.6, sag:0.9});
  // nets + floats on the rails (baked): the catch that never came home
  { const net1=mesh('cyl',[0.02,0.02,2.6,4], mat(0x2e2620)); net1.position.set(79.5,4.4,1.6); net1.rotation.z=0.5; deco.add(net1);
    const net2=mesh('cyl',[0.02,0.02,2.2,4], mat(0x2e2620)); net2.position.set(80.1,4.2,1.62); net2.rotation.z=-0.4; deco.add(net2);
    for(const [fx,fy] of [[79.1,3.4],[80.6,3.2],[79.9,3.0]]){ const fl=mesh('sph',[0.14,6,5], mat(W7PAL.buoy)); fl.position.set(fx,fy,1.6); deco.add(fl); }
    const barrel=mesh('cyl',[0.34,0.38,0.8,9], mat(0x4a3826)); barrel.position.set(92.3,0.8,0.9); crook(barrel,0.08); deco.add(barrel);   // the far-corner barrel (its candy noted above)
    const bsnow=mesh('sph',[0.3,6,5], mat(W6PAL.snow)); bsnow.scale.y=0.4; bsnow.position.set(92.3,1.22,0.9); deco.add(bsnow); }
  // foreground ice ridges (z>0) framing the crossing — depth, the checklist's silhouette lane
  { for(const [rx,rs] of [[30,1.1],[52,0.8],[121,1.0]]){ const rg=new THREE.Mesh(geo('box',1.8*rs,0.7*rs,0.5), new THREE.MeshLambertMaterial({color:0x1a2846, transparent:false}));
      rg.position.set(rx,0.3*rs,2.6); rg.rotation.z=rand(-0.3,0.3); deco.add(rg);
      const sh=mesh('cone',[0.25*rs,0.9*rs,4], mat(0x223354)); sh.position.set(rx+0.7,0.55*rs,2.65); sh.rotation.z=rand(-0.2,0.2); deco.add(sh); } }
  S.add(bakeGroup(deco));

  // the cold moon, low behind the wreck — she is the level's whole horizon
  const moon = mesh('circ',[3.8,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(60, 15.5, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.2,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(60, 15.5, -30.2); S.add(moonH);

  w7Parallax(S, -8, 148);                                              // pressure ridges / the far-shore village / the great fells
  w6LightsFinish(G, L);                                                // both strings live on the kit's one twinkle ticker

  // W7 tail (checkpoint/bats/ambience/aurora/retint) — clutter laid MANUALLY on the solid snow spans only
  // (the lakes keep their glass, the ring keeps its seams, the decks carry their own dressing)
  w7LevelFinish(G, -8, 148, null);
  w7Clutter(G, -8, 21.5, 'lake');
  w7Clutter(G, 60.5, 70, 'lake');
  w7Clutter(G, 133.5, 148, 'lake');

  return {spawnX: 0, exitX: 143};
}

function updateW7L3(G, dt){
  updateLevelCommon(G, dt);
  // No bespoke glue: the saws/icicles/cubs/bats ride fixed G.ents clocks, both lakes run their own kit
  // tickers, the bear's slam is wired by the (deliberately last-built) hold lake, and the lights twinkle
  // on the kit ticker. The whole ship plays IDENTICALLY every attempt — death costs progress, never
  // knowledge (the determinism rule; the speedrun covenant).
}

W7_LEVELS.push({id:'w7l3', district:'w7', name:'THE FROZEN TRAWLER', build:buildW7L3, update:updateW7L3, parTime:155});

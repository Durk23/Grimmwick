// ============ LEVEL 7-5 — URSA'S CRADLE (District 7 · Frostmere · Frozen Lake Fell) ============
// THE DISTRICT EXAM on the deepest ice (owner difficulty lock: BEYOND D5 from level one — the post-story
// mastery-exam band, still MAIN-GAME FAIR: hearts-always, every telegraph >=0.6s, <=4 simultaneous threats,
// fixed clocks, one-good-run-away). This close to the guardian, HER BREATHING IS IN THE LEVEL'S BONES —
// a slow cosmetic camera-swell every ~6s (fixed clock, one tiny ticker; the Cradle Gate's glow breathes
// with it). 15 threats, EXACTLY CP0 (noLight) + ONE lit lantern at ~54%, chained set-pieces composing 2-3
// mechanics through the escalate/master beats:
//   BEAT 1 THE LAST SHORE            x -8..34   — CP0, the FISHER'S HUT in its clear pocket (CLEAR-PATCH
//          law, math pinned below), Polar Cub lane #1 to warm the hop timing, a crow, the long white quiet.
//   BEAT 2 THE POLISHER PROMENADE    x 34..62   — set-piece #1: the ICE POLISHER ping-pongs a freshly-slicked
//          glaze (tag ice) while WRAITHDEER LANE A sweeps the air at y3.2 on a 13.5s clock. TWO ROUTES that
//          swap under the bells: GROUND dodges the spinning brush (front-mounted, 0.75u bite) but is SAFE
//          from lane A (bite floor py>1.6 — grounded py0 never touches it); the ROOF (top y1.8, board with a
//          held jump) rides above the brush but sits square in A's bite (rider py1.8 in the 1.6..4.1 window)
//          — bells ring 1s early: drop off, let the herd pass, reboard. A Snow-Boo works the glaze so nobody
//          camps the machine's turn-around.
//   BEAT 3 THE SAWYARD               x 62..96.8 — set-piece #2: an ICE-SAW PAIR FLANKING A CRACK RUN. Saw L
//          gates the grip apron in (x62.5..66.5), then 9.6u of CrackIce (stand still ~1.1s and the panel
//          spiderwebs→CREAKS→drops you to the plunge: heart + lantern walk-back, kit-charged), then saw R
//          gates the exit apron (x77.2..81.2) with Polar Cub lane #2 and a Blizzard Bat diving the rejoin.
//          Both saws live on GRIP ground — never a blade over a cracking panel (the no-hazard-at-a-hole law),
//          and never a precision stop demanded ON a panel: the panels only ask you to KEEP MOVING.
//   BEAT 4 THE LANTERN REST          x 95..104  — THE lit lantern (x95, ~54% of the 175u run; rest-pocket
//          math pinned at the placement) + a shield bonk-lantern, then the FISHING NOTICE and hole #1.
//   BEAT 5 THE FISHERY (ESCALATE)    x 104..131.5 — set-piece #3, the exam's essay question: TWO CrackIce
//          fields with a 3.5u solid island between, TWO Ice Anglers stalking beneath (0.7s glow+bubble
//          telegraph, they lunge through fish holes AND any panel you let shatter), a Frostbite Penguin
//          patrolling the west field — and the island is not an island: SOMNAMBEAR #1 sleepwalks it. Cross
//          her honestly (wake→0.7s roar→whiff the one swipe→walk the 1.4s yawn) or clear her with a full
//          double-jump (wake box |dy|<2.0 — apex 3.3 sails over; candy arc telegraphs the verb). Wake her
//          and her slam SHATTERS the panels at both island edges (3.2u radius) — the anglers get a menu.
//   BEAT 6 THE STAMPEDE (MASTER)     x 131.5..157 — the district's bombardment analogue: THREE Wraithdeer
//          lanes at staggered heights/periods over the final CrackIce field. Lane B LOW y1.4 (bites grounded:
//          jump it, held/double — bite ceiling py<2.3, held apex 2.6 clears +0.3) · lane A MID y3.2 (misses
//          grounded by 1.6u, punishes jumps and roof-riders — the promenade's lesson, escalated) · lane C
//          HIGH y4.6 (bites 3.0..5.5 — only the brave: the ROPE-TOW line). Jingle bells 1s before every
//          sweep; the dodge rhythm IS the path; candy traces the ground weave and the tow line; safe pockets
//          between lanes always exist (grounded is safe from A and C; airborne timing beats B). The rope-tow
//          rides the field at seat y2.8 (safe from B, contested by A) and swings to its APEX at the far
//          wheel — GOLDEN PUMPKIN #2 hangs off the apex leap, candy-arc telegraphed, lane C guarding it.
//          A spike-icicle trio + penguin #2 gauntlet caps the boarding shore first.
//   BEAT 7 THE CRADLE GATE           x 156.8..181 — the quiet after. A Snow-Boo and SOMNAMBEAR #2 hold the
//          last shore (stare one, dance the other), the QUIET PROP waits on a pressure ridge, and TWO GREAT
//          ICE PAWS arch over the road — she is close, and the arch glows in time with her breath.
// Reads UNMISTAKABLY Lake Fell: W7PAL white expanse under the deep 0x0a1428 night, aurora riding huge, the
// far-shore village a thin lonely line, wind-driven snow, machine lanterns — light strings used ONCE (the
// tow cable), because this district is darker and lonelier than Glimmerfields on purpose.
// Comparable heights (tap 1.8 / held 2.6 / double 3.3): main road FLAT the whole way — every rise is gated
// and verb-telegraphed (polisher roof 1.8 held-jump board · boarding platform 2.9 DOUBLE-gated, candy-traced,
// <=3.0 law · T-bar seat 2.8 a step DOWN from it · GP apex leap = tow-gated). No involuntary gaps anywhere: crack panels tile flush
// with every shore (coverage arithmetic pinned per field), holes are self-made and refreeze in 3.2s.
// HEARTS ALWAYS: every deer/saw/brush/icicle/lunge/swipe costs exactly 1 heart; the plunge charges the pit
// price via the kit (heart + lantern walk-back) — nothing one-shots. DETERMINISM: every machine, lane, and
// icicle on a fixed clock from level start; the bear/anglers/penguins are player-reactive state machines
// with fixed phases; NO Math.random on the critical path (the Fisher's Hut gamble is opt-in by law).
// GP: #2 of the district (idx 1), tow-apex skill-gated. NO warp here (the Bell-Buoy keeps its own level).
// NO Leap of Faith — both of the game's two are placed and sacred.

// ---- THE QUIET PROP: an enormous shed WINTER COAT of white fur, draped over a pressure ridge — folded
// NEATLY, collar squared, toggles done up. She was here. And she was tidy. Never signposted; fully baked;
// story-readers stop cold, everyone else walks past a snowdrift with buttons. That's the point. ----
function w7l5ShedCoat(x, z){
  const g = new THREE.Group();
  const iceM = new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.75});
  // the pressure ridge it rests on — two up-thrust slabs
  const s1 = new THREE.Mesh(geo('box',2.6,1.1,1.2), iceM); s1.position.set(x-0.6,0.5,z); s1.rotation.z=0.22; g.add(s1);
  const s2 = new THREE.Mesh(geo('box',2.2,0.9,1.1), iceM); s2.position.set(x+0.9,0.42,z-0.3); s2.rotation.z=-0.18; g.add(s2);
  // the coat: three folded layers of fur, each a soft flattened slab, squared like laundry
  const fur = emat(0xf4f1e8, 0x9aa4c0, 0.14), furD = emat(0xdcd8cc, 0x8a94b0, 0.12);
  const f1 = mesh('sph',[1.7,10,8], fur);  f1.scale.set(1.05,0.24,0.62); f1.position.set(x,1.18,z); g.add(f1);
  const f2 = mesh('sph',[1.45,10,8], furD); f2.scale.set(1.05,0.22,0.6); f2.position.set(x+0.05,1.5,z); g.add(f2);
  const f3 = mesh('sph',[1.2,10,8], fur);  f3.scale.set(1.05,0.2,0.58); f3.position.set(x-0.02,1.76,z); g.add(f3);
  // the collar, folded back just so
  const col = mesh('box',[1.15,0.14,0.5], furD); col.position.set(x-0.05,1.92,z+0.25); col.rotation.x=0.3; g.add(col);
  // two wooden toggle-buttons, done up even in storage (tidy)
  for(const bx of [-0.3,0.3]){ const tg = mesh('cyl',[0.05,0.05,0.22,5], mat(0x5a4a38)); tg.rotation.z=Math.PI/2; tg.position.set(x+bx,1.66,z+0.5); g.add(tg); }
  // fur tufts along the fold edges (the texture read)
  for(let i=0;i<7;i++){ const t = mesh('cone',[0.05,0.16,4], fur); t.position.set(x-0.85+i*0.29, 1.3+((i%3)*0.26), z+0.5); t.rotation.x=0.7; g.add(t); }
  return g;
}

// ---- THE CRADLE GATE: two great ice paws rising from either side of the road, fingers arching over the
// lane — built, not bought: forearm slabs, pads, four curling fingers + claws per paw, all one shared
// translucent ice material (bakes to one call). She is close. ----
function w7l5Paws(x){
  const g = new THREE.Group();
  const iceM = new THREE.MeshLambertMaterial({color:W7PAL.glass, emissive:0x4a8ec8, emissiveIntensity:0.22, transparent:true, opacity:0.8});
  for(const s of [-1,1]){
    const fore = new THREE.Mesh(geo('box',2.2,5.2,2.0), iceM);
    fore.position.set(x, 2.3, s*3.3); fore.rotation.x = -s*0.42; g.add(fore);
    const pad = new THREE.Mesh(geo('sph',1.35,10,8), iceM);
    pad.scale.set(0.9,0.55,1); pad.position.set(x, 4.9, s*2.15); pad.rotation.x=-s*0.5; g.add(pad);
    for(let f=0;f<4;f++){
      const fx = x - 1.05 + f*0.7;
      const fin = new THREE.Mesh(geo('cyl',0.2,0.3,2.1,6), iceM);
      fin.position.set(fx, 5.7, s*1.15); fin.rotation.x = -s*1.05; g.add(fin);
      const claw = new THREE.Mesh(geo('cone',0.14,0.5,5), iceM);
      claw.position.set(fx, 6.28, s*0.28); claw.rotation.x = -s*1.5; g.add(claw);
    }
  }
  // frost heave where the paws grip the lake
  for(const s of [-1,1]) for(let i=0;i<4;i++){
    const sh = new THREE.Mesh(geo('cone',rand(0.15,0.3),rand(0.5,1.0),4), iceM);
    sh.position.set(x+rand(-1.4,1.4), 0.25, s*rand(2.2,3.6)); sh.rotation.z=rand(-0.3,0.3); g.add(sh);
  }
  return g;
}

function buildW7L5(G){
  const S = G.scene;
  levelBegin(G);
  G._anglerHoles = [];              // fresh menu every build — a re-entered level must not keep last run's holes

  const SHORE = W7PAL.iceD;         // grip shore-ice color (groundX adds its bright lip)
  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();        // ONE string in this whole level (the tow cable) — the lonely-lake rule

  // =============================== BEAT 1 — THE LAST SHORE (x -8..34) ===============================
  groundX(G, -8, 34, SHORE);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — the only start you get
  signPost(G, 5, 1.7, -0.12, "URSA'S CRADLE. Feel the lake rise and fall? That isn't wind. That's BREATHING. Walk soft, dodge sharp, and when you hear sleigh bells - believe them.");
  // THE FISHER'S HUT — the gamble, in its CLEAR POCKET. CLEAR-PATCH law, worst-case reach math (hut x12):
  //   Cub lane #1 starts x24, min ball edge 24-0.85=23.15 -> 11.15u clear · deer lane A's overshoot ends
  //   x29 AND its y3.2 bite (py>1.6) can never touch a hut-shopper anyway · Snow-Boo #1 (home 46) is
  //   LEASHED chaseR 14 -> active only while the player stands x>=32, 20u clear · polisher brush min reach
  //   x33.9, 21.9u · everything else lives past x62. Opening is a deliberate safe act; the ambush (4 cubs)
  //   spawns on the kit's 1.0s grace and bowls into empty shore.
  { const h = new FisherHut(12, 0, -0.6, 0.15); G.coffins.push(h); G.ents.add(h); }
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12.8,0.9,0]], 3);
  G.ents.add(new Crow(18, 0.95, 2.3));                                 // lake crow #1 — flaps off when neared
  // POLAR CUB LANE #1 — the warm-up hop (fixed clock; stompable; ends before the polisher's dance floor).
  // SPAWN SAFETY (idle at CP0, body edge x2.4): nearest active reach = this lane's 23.15 (20.75u clear);
  // deer lane A never bites grounded and stops at x29; the hut is passive. An idle spawn is untouchable.
  G.ents.add(new PolarCub(G, 24, 0, 0, {x1:40, speed:3.4, phase:0.0, pause:1.3}));
  candyLine(G, [[27,1.0,0],[29.5,2.2,0],[32,1.0,0]], 3);               // the hop arc, traced

  // =============================== BEAT 2 — THE POLISHER PROMENADE (x 34..62) ===============================
  // Set-piece #1: machine route UNDER a deer lane. The glaze is TAG ICE (slick — freshly polished, the
  // machine's whole job); the two routes trade safety under lane A's 13.5s clock (see header math).
  w6IceX(G, 34, 62);
  signPost(G, 31.5, 1.7, 0.1, "THE POLISHER makes the lake shine and does not care who is standing on it. The roof is a fine ride. But when you hear sleigh bells, get DOWN - the herd sweeps high, and it does not steer.");
  w7IcePolisher(G, {x0:36, x1:58, speed:2.7, phase:0});                // ping-pong 8.1s each way, brush forward
  // WRAITHDEER LANE A — the long haunt: one air lane at y3.2 sweeping x152->33 (runT 10.8s, period 13.5,
  // 1s jingle before every entry). The player meets this SAME team three times: here over the polisher
  // (introduce), overhead through the mid-level (twist: it owns the sky), and as the stampede's mid lane
  // (master). Bite window at y3.2: 1.6 < py < 4.1 — grounded is ALWAYS safe from A; roof-riders and
  // jumpers are not. Deterministic to the bell.
  G.ents.add(new WraithdeerTeam(G, {x0:152, x1:33, y:3.2, n:4, period:13.5, phase:0, speed:11}));
  // SNOW-BOO #1 — glaze pressure (leashed chaseR 14 -> active zone x32..60): stare it solid for a breather
  // block; its shatter is grumpy but slow. Keeps the polisher's turn-arounds from becoming camp spots.
  G.ents.add(new SnowBoo(G, 46, 0, 0, {phase:0.7, speed:2.0, range:9, freezeMax:2.4}));
  candyLine(G, [[40,2.6,0],[45,2.6,0],[50,2.6,0],[55,2.6,0]], 4);      // the ROOF line (rider center y2.6)...
  candyLine(G, [[42,0.9,0],[48,0.9,0],[54,0.9,0]], 3);                 // ...and the ground dodge line below it
  //                                                                      (the junction rule: each road sees the other's candy)

  // =============================== BEAT 3 — THE SAWYARD (x 62..96.8) ===============================
  // Set-piece #2: the IceSaw pair FLANKING the crack run — blades on grip ground, panels between them.
  groundX(G, 62, 67, SHORE);                                           // entry apron (grip — a fair stop before saw L)
  signPost(G, 63, 1.7, -0.1, "THE SAWYARD. The blades keep their own clocks - hop them, never race them. Past the blades the young ice cracks under PATIENCE: keep moving and it holds you. Stand admiring the view and it remembers your weight.");
  w7IceSaw(G, {x0:62.5, x1:66.5, y:0.55, period:2.6, phase:0});        // saw L — gate in (tap 1.8 clears the blade top 1.35)
  candyLine(G, [[62.6,1.0,0],[64.5,2.3,0],[66.4,1.0,0]], 3);           // the hop arc over the slot
  // THE CRACK RUN — panels tile x67..76.6 (cx 68.2/70.6/73.0/75.4, coverage = last cx + 1.2 = 76.6; the
  // exit apron begins flush at 76.6 — no involuntary gap). Slick AND cracking: it only ever asks motion.
  w7CrackLake(G, 67, 77);
  const _slamA = G._bearSlam;                                          // (bear-slam hooks chained at the tail — see below)
  candyLine(G, [[68.2,0.9,0],[71.8,0.9,0],[75.4,0.9,0]], 3);           // keep-moving rhythm, one candy per panel-and-a-half
  groundX(G, 76.6, 104, SHORE);                                        // exit apron + the lantern shore (grip)
  w7IceSaw(G, {x0:77.2, x1:81.2, y:0.55, period:3.2, phase:1.6});      // saw R — gate out, off-phase from L
  candyLine(G, [[77.4,1.0,0],[79.2,2.3,0],[81.0,1.0,0]], 3);
  // POLAR CUB LANE #2 + BLIZZARD BAT — the rejoin is contested (saw R + cub + bat = 3 simultaneous, the cap
  // respected). Bat is squeak-telegraphed snapshot-dive with post-dive drift (the re-home rule): home 83.5,
  // range 2.5 -> max patrol 86, aggroR 3.5 -> trigger edge 89.5, +2u drift = 91.5 — see the lantern math.
  G.ents.add(new PolarCub(G, 82.5, 0, 0, {x1:90.5, speed:3.8, phase:1.2, pause:1.1}));
  G.ents.add(new BlizzardBat(G, 83.5, 5.0, 0, {phase:0.9, range:2.5, period:3.6, aggroR:3.5}));
  candyLine(G, [[85,0.9,0],[89,0.9,0]], 2);

  // =============================== BEAT 4 — THE LANTERN REST (x 95..104) ===============================
  // THE lantern — the level's ONE lit checkpoint (exam law: CP0 + one; x95 of the 175u run = 54%).
  // REST-POCKET MATH, idle player at x95 (body edge 95.4): bat trigger+drift tops out 91.5 (3.9u clear) ·
  // cub lane #2 max ball edge 91.35 (4.05u) · saw R track ends 81.2 · angler #1 (home 111, range 12)
  // activates only when the player crosses x99 (3.6u clear; and it only bites through holes — nearest is
  // hole #1 at x102.8, 7.4u) · penguin #1 min patrol 106.6, wakeR 5 -> wake edge 101.6 (6.2u — an idle
  // player can never wake it) · deer lane A passes overhead at y3.2: bite floor py>1.6, an idle GROUNDED
  // player is untouchable by geometry, forever · bear #1 lives on the island at 117.75. The pocket holds.
  G.ents.add(new Checkpoint(95, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 98, 1.5, 0, 'shield'));                // armor before the essay question
  signPost(G, 101, 1.7, -0.1, "FISHING NOTICE: something down there fishes BACK. Bubbles and a rising glow mean an open hole is about to bite - be elsewhere. And the sleeper on the island? She wakes cross, swings ONCE, forgets. Be elsewhere for the once.");
  w7FishHole(G, 102.8, 1.6);                                           // hole #1 — the anglers' standing menu (visible rim, tap-hop wide)

  // =============================== BEAT 5 — THE FISHERY (x 104..131.5): ESCALATE — panels + anglers + penguins + the bear ===============================
  // Field WEST: panels tile x104..116.0 (cx 105.2..114.8, coverage 116.0 — flush with the island at 116).
  w7CrackLake(G, 104, 117);
  const _slamB = G._bearSlam;
  // Field EAST: panels tile x119.5..131.5 (cx 120.7..130.3, coverage 131.5 — flush with the boarding shore).
  groundX(G, 116, 119.5, SHORE, 10);                                   // THE ISLAND — 3.5u of grip... and her
  w7CrackLake(G, 119.5, 131.6);
  const _slamC = G._bearSlam;
  // ICE ANGLERS — the glow under your feet. #1 stalks x99..123 (home 111), #2 stalks x114..138 (home 126).
  // They lunge ONLY through openings: hole #1, any panel you let shatter, and whatever the bear opens.
  // 0.7s glow+bubble telegraph, stomp mid-lunge pops them (the brave line).
  G.ents.add(new IceAngler(G, 111, 0, 0, {phase:0.0, speed:2.7, range:12}));
  G.ents.add(new IceAngler(G, 126, 0, 0, {phase:2.0, speed:2.7, range:12}));
  // FROSTBITE PENGUIN #1 — patrols the west panels (106.6..111.4): its squawk-toboggan forces the hop that
  // spreads your crack budget across panels. It cannot crack panels; only your patience can.
  G.ents.add(new FrostbitePenguin(G, 109, 0, 0, {phase:0.4, range:2.4, dir:1}));
  candyLine(G, [[106,0.9,0],[110,0.9,0],[114,0.9,0]], 3);
  // SOMNAMBEAR #1 — the island IS the bear (home 117.75, range 1.0, dreamwalk 0.65): patrol 116.75..118.75,
  // path-wake box +-1.8 sweeps 114.95..120.55 — the whole island and both panel edges. Cross her honest
  // (wake -> 0.7s roar -> back off 4.5u, the swipe reaches wake-spot + 3.15 lunge + 1.25 paw ~= 4.4 -> walk
  // the 1.4s yawn) or clear her entirely: the wake box needs |dy|<2.0, so a full DOUBLE-JUMP (apex 3.3)
  // sails over a dreaming bear — the candy arc below telegraphs exactly that verb. WAKE CONSEQUENCE (pinned):
  // her slam shatters panels within 3.2u — from patrol extremes that reaches cx 114.8 and 120.7, the panels
  // hugging the island: wake her and the island becomes a moat with anglers in it, for 3.2s. Your choice.
  // Or skip the island: the panels tile continuously — she is optional relief with a price.
  G.ents.add(new Somnambear(G, 117.75, 0, 0, {phase:0.0, range:1.0, dir:1, speed:0.65}));
  G.ents.add(new Heart(117.75, 3.9, 0));                               // the island's why — hangs at double-jump height over her patrol
  candyLine(G, [[115.9,1.2,0],[117.75,3.4,0],[119.6,1.2,0]], 3);       // the over-the-bear arc (apex 3.4 = the double-jump read)
  G.ents.add(new Crow(118.8, 0.95, 1.7));                              // lake crow #2 — perched on the sleeper's rump, unbothered
  candyLine(G, [[122,0.9,0],[126,0.9,0],[130,0.9,0]], 3);              // east-field keep-moving rhythm

  // =============================== BEAT 6 — THE STAMPEDE (x 131.5..157): MASTER — three herds over the last ice ===============================
  groundX(G, 131.5, 140, SHORE);                                       // the boarding shore (grip)
  signPost(G, 130.6, 1.7, 0.1, "THE STAMPEDE. Three herds run this stretch. The LOW one leaps over you if you leap first. The HIGH ones only bite the brave. The tow still runs, rain or wraiths - but the tow does not stop for reindeer.");
  // THE ICICLE GAUNTLET — a pressure-ridge cornice with the spike trio on staggered clocks (shimmer + drip
  // + floor target-glow, the district's one warning language), penguin #2 tobogganing beneath: dodge the
  // slide without standing in a glow column. Deer lane B's overshoot reaches x138 at worst — max simultaneous
  // here = one icicle + penguin + B's tail = 3, capped.
  for(const cx of [132.9, 135.3, 137.7]){
    const slab = mesh('box',[2.6,0.5,2.2], mat(W6PAL.snowD)); slab.position.set(cx, 5.6, -0.8); slab.rotation.z=(cx%2<1?0.03:-0.03); deco.add(slab);
    const lump = mesh('sph',[0.5,7,5], mat(W6PAL.snow)); lump.scale.y=0.5; lump.position.set(cx-0.6, 5.9, -0.6); deco.add(lump);
  }
  G.ents.add(new SpikeIcicle(G, 133,   5.4, {period:4.6, phase:0.0, len:1.15}));
  G.ents.add(new SpikeIcicle(G, 135.2, 5.4, {period:5.0, phase:1.7, len:1.15}));
  G.ents.add(new SpikeIcicle(G, 137.4, 5.4, {period:5.4, phase:3.1, len:1.15}));
  G.ents.add(new FrostbitePenguin(G, 135, 0, 0, {phase:1.1, range:1.6, dir:-1}));
  candyLine(G, [[133,0.9,0],[136.1,0.9,0],[139,0.9,0]], 3);            // the slalom line — placed between the glow columns
  // THE FINAL CRACKICE FIELD — panels tile x140..156.8 (cx 141.2..155.6, coverage 156.8 — flush with the
  // cradle shore). The dodge rhythm is the path: you cannot stand still (the budget), you cannot jump on
  // reflex (lane A), you cannot stay down when B's bells ring (lane B). Read the bells, weave the weave.
  w7CrackLake(G, 140, 157);
  const _slamD = G._bearSlam;
  // LANES B + C (lane A already sweeps here — its long haunt ends at x33). Staggered heights AND periods:
  //   B LOW  y1.4, period 7.5: bites py<2.3 (grounded: JUMP it — held 2.6 clears +0.3, double is comfy).
  //   C HIGH y4.6, period 9.0: bites 3.0<py<5.5 (grounded safe by 3.0u; the tow's apex and top run are not).
  //   A MID  y3.2, period 13.5: the big wave — misses grounded, sweeps the tow's bottom-run seat (py2.8).
  // Three fixed clocks, three distinct verbs, jingle 1s ahead of each; trains cross any x in ~0.5s. Worst
  // legal moment = three trains at once = 3 threats, capped, all telegraphed, all deterministic.
  G.ents.add(new WraithdeerTeam(G, {x0:160, x1:142, y:1.4, n:3, period:7.5, phase:2.5, speed:11}));
  G.ents.add(new WraithdeerTeam(G, {x0:162, x1:139, y:4.6, n:4, period:9.0, phase:5.0, speed:12}));
  candyLine(G, [[143,0.9,0],[147.5,0.9,0],[151.5,0.9,0],[155.5,0.9,0]], 4);   // the ground weave
  candyLine(G, [[148.4,1.1,0],[149.7,2.9,0],[151,1.1,0]], 3);          // mid-field hop arc — "jump the LOW lane HIGH"
  // THE ROPE-TOW — the GP line. Boarding platform y2.9 — a DOUBLE-JUMP rise (<=3.0 law, candy-traced below;
  // the tow is the expert line, its front door is allowed to ask for the verb). HEIGHT MATH (pinned): lane
  // B's overshoot reaches x138, worst bite ceiling py < (1.4+0.18 bob)+0.9 = 2.48 — a y1.4 queue platform
  // here would be bitten every 7.5s; at 2.9 a waiting player clears B by 0.42. Lane A (bite 1.42..4.28
  // worst) still sweeps the platform AND the bottom-run seat (py2.8) on its 13.5s clock — bells say wait or
  // hop down; bars come every 4.4s. The far-wheel swing then lifts you into lane C's altitude: the apex is
  // earned, not given. Seat 2.8 is a step DOWN from the platform; bars never cross it (bottom run starts x142).
  platform(G, 140.6, 2.9, 0, 2.2, 3, W6PAL.snow);                      // spans 139.5..141.7
  { const leg = mesh('cyl',[0.16,0.26,2.6,6], mat(W7PAL.rope)); leg.position.set(140.6,1.3,-1.2); deco.add(leg); }
  w7RopeTow(G, {x0:142, x1:157, y:2.6, n:3, speed:2.6});
  candyLine(G, [[139.9,1.3,0],[140.6,2.7,0],[141.1,3.9,0]], 3);        // the rise arc — apex 3.9 reads DOUBLE JUMP
  candyLine(G, [[146,3.5,0],[150,3.5,0],[154,3.5,0]], 3);              // the ride line (seat-height center) — visible from the ground weave
  // GOLDEN PUMPKIN #2 — SKILL-GATED: ride to the far wheel, let the bar swing you to its APEX (seat y4.5,
  // feet 4.72), and LEAP (+held: apex feet 7.3) off the top of the arc, over the field's edge, through lane
  // C's altitude, onto the cradle shore. The candy arc below IS the jump-off telegraph (the skill-gate law).
  // Unreachable any other way: from ground, double apex 3.3 -> center 4.1, far below the 6.9 grab.
  candyLine(G, [[156.8,5.3,0],[157.8,6.2,0],[158.4,6.8,0]], 3);        // the apex arc
  G.ents.add(new GoldPumpkin(158.6, 6.9, 0, 2));   // fleet-audit fix: idx 1 collided with w7l3's hold pumpkin — the district set is 0 (7-1), 1 (7-3), 2 (here)

  // =============================== BEAT 7 — THE CRADLE GATE (x 156.8..181) ===============================
  groundX(G, 156.8, 181, SHORE);
  G.ents.add(new Heart(160.5, 1.0, 0));                                // post-stampede mercy, visible from the field's last panels
  // THE QUIET PROP — the folded coat on its ridge (background lane, never signposted)
  deco.add(w7l5ShedCoat(159.8, -2.3));
  // THE LAST GUARDS — a Snow-Boo drifting the approach (leash trimmed so it can NEVER wander onto the
  // stampede field: home 162.5, chaseR 7 -> active zone 155.5..169.5, and the field's panels end at 156.8;
  // worst-case at the field lip = boo + lane A + lane B tails = 3, capped) and SOMNAMBEAR #2 dreaming the
  // road (home 166, range 2.2, patrol 163.8..168.2, wake sweep 162..170). GP-leap landing zone 158.5..160
  // stays 2u clear of her wake box; her slam's max reach (wake at 163.8 - 3.2 = 160.6) can never touch the
  // field's panels at 156.8 — the finale never re-opens the lake behind you. Stare the boo, dance the bear.
  { const b2 = new SnowBoo(G, 162.5, 0, 0, {phase:1.4, speed:2.2, range:9, freezeMax:2.4}); b2.chaseR=7; G.ents.add(b2); }
  G.ents.add(new Somnambear(G, 166, 0, 0, {phase:2.0, range:2.2, dir:-1, speed:0.8}));
  candyLine(G, [[164,0.9,0],[169,0.9,0]], 2);
  // sign sits PAST bear #2's wake sweep (162..170) at x171, z1.7 — reading it can never wake her
  signPost(G, 171, 1.7, -0.1, "SHE DREAMS PAST THE ARCH. Wipe your feet. Hush your bells. Bring your warmest hello.");
  G.ents.add(new Crow(168.9, 0.95, 2.3));                              // lake crow #3 — at the threshold, unbothered by any of it (z2.3: outside her wake box's |dz|<1.4)
  // THE CRADLE GATE — two great ice paws arching the road, glowing in time with her breath (the ticker below)
  deco.add(w7l5Paws(170.5));
  const archLight = new THREE.PointLight(0x7ae8ff, 20, 13); archLight.position.set(170.5, 4.5, 0); S.add(archLight);
  exitGate(G, 175);

  // =============================== THE BEAR-SLAM CHAIN + HER BREATHING ===============================
  // Four w7CrackLake calls each install their own G._bearSlam — chain them so EITHER bear's wake reaches
  // whichever field is actually nearby (each captured hook keeps its own stale-area guard from the kit).
  { const slams = [_slamA, _slamB, _slamC, _slamD].filter(f=>!!f);
    G._bearSlam = (bx, r)=>{ for(const f of slams) f(bx, r); }; }
  // HER BREATHING — the level's bones. One fixed 6s clock from level start: a slow cosmetic camera-swell,
  // deeper the closer you walk to the cradle, the arch glow swelling with it, a sub-bass sigh when near the
  // gate. COSMETIC ONLY — it moves no collider, times no hazard, and touches no clock but its own.
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt, GG){
      const prev = this.t; this.t += dt;
      const k = (this.t % 6) / 6;                                      // 0..1 through each breath
      const swell = Math.sin(k*Math.PI);                               // in... and out
      if(archLight) archLight.intensity = 20 + swell*8;                // the arch breathes with her
      if(Math.floor(prev/6) !== Math.floor(this.t/6)){                 // the inhale — once per cycle
        const pl = GG.player;
        const prox = pl ? Math.min(1, Math.max(0, (pl.pos.x+8)/183)) : 0;
        GG.camc && GG.camc.shake(0.03 + 0.035*prox, 0.7);
        if(pl && pl.pos.x > 120) AUDIO.noise && AUDIO.noise({t:1.1, vol:0.04+0.03*prox, fFrom:80, fTo:44});
      }
    } });

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // shoreline pines bracket the level; the open lake between stays BARE — the loneliness is the design
  deco.add(w6Pine(-5, -2.9, 1.2)); deco.add(w6Pine(9, -3.1, 1.0)); deco.add(w6Pine(26, -2.8, 1.3));
  deco.add(w6Pine(163, -3.0, 1.1)); deco.add(w6Pine(178, -2.8, 1.4));
  // the fishery's dark work-shack, shut for the season (background deco near the fields)
  { const shack = mesh('box',[1.8,1.6,1.4], mat(0x3c3024)); shack.position.set(108, 0.8, -3.4); deco.add(shack);
    const roofS = mesh('cone',[1.6,0.9,4], mat(0x2a2118)); roofS.position.set(108, 1.98, -3.4); roofS.rotation.y=Math.PI/4; deco.add(roofS);
    const capS = mesh('cone',[1.62,0.34,4], mat(W6PAL.pineSnow)); capS.position.set(108, 2.28, -3.4); capS.rotation.y=Math.PI/4; deco.add(capS); }
  // FOREGROUND silhouettes (z>0): up-thrust shard rafts framing depth along the open ice
  for(const [fx,fs] of [[38,1.0],[71,0.8],[113,1.1],[147,0.9],[173,1.0]]){
    const shardM = new THREE.MeshLambertMaterial({color:0x16223e, transparent:true, opacity:0.96});
    for(let i=0;i<3;i++){ const sh = new THREE.Mesh(geo('box',rand(0.6,1.3)*fs, rand(0.4,1.1)*fs, 0.4), shardM);
      sh.position.set(fx+rand(-1.4,1.4), rand(0.1,0.5), 2.7); sh.rotation.z=rand(-0.5,0.5); deco.add(sh); }
  }
  S.add(bakeGroup(deco));
  // the one light string this lonely district allows: the tow's cable, strung by the fishery crew
  w6String(L, 142, 5.45, 157, 5.45, {z:-0.9, sag:0.8});
  w6LightsFinish(G, L);
  // the winter moon, low over the far shore
  const moon = mesh('circ',[3.8,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(95, 14, -30); S.add(moon);

  // three-depth Lake Fell skyline (pressure ridges / the far-shore village line / the great fells) + the
  // BIG aurora + wind-snow + blowing banks, all via the kit tail. Clutter placed MANUALLY on grip spans
  // only — clutter baked over crack panels would float over open water when they shatter.
  w7Parallax(S, -8, 181);
  w7LevelFinish(G, -8, 181, null);
  w7Clutter(G, -8, 33.5, 'lake');
  w7Clutter(G, 77, 103.5, 'lake');
  w7Clutter(G, 157.2, 181, 'lake');

  return {spawnX: 0, exitX: 175};
}

function updateW7L5(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none — the breathing ticker, bear-slam chain, deer lanes, saws, polisher, tow, and
  // icicles are all cull:false G.ents tickers on fixed clocks from level start; the anglers/bears/penguins/
  // boos carry fixed phases and player-reactive state machines. The whole exam is identical every attempt
  // (determinism rule) — death costs progress, never knowledge.
}

W7_LEVELS.push({id:'w7l5', district:'w7', name:"URSA'S CRADLE", build:buildW7L5, update:updateW7L5, parTime:180});

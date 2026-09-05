// ============ LEVEL 8-1 — THE FIRST SHAFT (District 8 · Frostmere · The Icicle Mines) ============
// POST-STORY MASTERY BAND (owner lock): the Mines open BEYOND District 5 — but stay MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away).
// 8-1 is the district's front door: the descent from the snowy surface adit into the glittering dark,
// and the level that TEACHES the mines' three laws — RIDE THE LINE (minecart platforms), THE KNOCK
// (tap... tap... TAP means stand off), and TRUST NO TREASURE (a still jewel is a jewel; a glinting one
// is a grin). Then it composes them: knocks over the boarding wait, a bat on the ride, a mimic pocket
// ON a cart route, and the SHAFT JUNCTION — two cart lines at offset phases under a knocking ceiling
// fringe with a moth working the transfer air.
//
// 12 threat systems: 2 KnockerSprite + 3 GemMimic + 2 Rubblekin + 2 CrystalMoth + 2 BlizzardBat +
// 1 GravelTriplet lane. NO boulder spawner (the avalanche is a deeper level's voice), NO warp (the
// Off-Limits Bucket lives elsewhere in the district), NO Leap of Faith (both of the game's two are
// placed and sacred). Golden Pumpkin idx 0 rides the headframe tower over the entrance.
//
//   BEAT 1 THE ADIT YARD              x -8..30   — CP0 (noLight) in the snow. The Glimmering Geode in its
//          clear pocket, the welcome sign, the headframe tower (GP0 on top — visible-but-tricky: a
//          candy-traced double-jump off the first cart's west kiss point), and the quiet prop waiting
//          on its beam by the portal. Nothing bites on the surface.
//   BEAT 2 RIDE THE LINE (INTRODUCE)  x 30..46   — chasm A. Two carts on equal spans, phased to KISS at
//          mid-chasm once per cycle (edge gap 0.1u at the kiss — step across). The sign teaches the
//          machine once; missing the hop costs a ride back, not a heart.
//   BEAT 3 THE GRAVEL GALLERY         x 46..64   — landing + the district's rolling-trio tradition: one
//          GravelTriplet lane (62->50, fixed clock), hop cues traced. Chain + ladder on-ramps to the
//          HIGH SCAFFOLD road overhead (candy halo visible from below — the junction itch).
//   BEAT 4 THE JEWEL FIELD (INTRODUCE) x 64..84  — seven REAL crystal clusters on the walking line and
//          ONE Gem Mimic among them (x73.5 — the glint is the tell). Crystal Moth #1 owns the air lane
//          above the field's spine: the ground never lies upward, jumpers mind the moth.
//   BEAT 5 THE LANTERN                x ~96..112 — THE lit checkpoint (x106, 50.5% of the 210u course —
//          the level's ONE lit lantern), shield Bonk Lantern, breath. Reach math pinned below.
//   BEAT 6 THE KNOCKER WALL (INTRODUCE) x 112..125 — safe ground, low wall face: the glow crawls x113.5
//          ->121, knocks tap-tap-TAP (0.9s audible), ALWAYS bursts at x121 — the fixed knock-spot is
//          the miners' oldest law, fully learnable. The spot sits 4u shy of the boarding lip: the wait
//          for cart B happens under the knocks (carts + knockers composing, the TWIST's first page).
//   BEAT 7 CHASM B — THE TWIST        x 125..141 — one long cart ride under Blizzard Bat #1's squeak-dive.
//          Board on the knock rhythm, ride through the dive, hop off past the far lip.
//   BEAT 8 CHASM C — THE ESCALATE     x 148..166 — a mimic pocket ON the cart route: two carts hand off
//          across a treasure island (top y0.8) whose centerpiece jewel is Gem Mimic #2. Landing wakes
//          it (0.6s glint), stomp it or hop its one snap, board the far cart. Rubblekin #1 guards the
//          west approach lip — the floor lies down here too.
//   BEAT 9 THE SHAFT JUNCTION (MASTER) x 172..194 — two cart lines at offset phases (equal 14u spans,
//          phased to kiss stair-stepped at the x183.5 seam every 8.75s), the hanging-fringe CEILING
//          knocker over the low line (knock-spot x177.5, burst swings DOWN through the rider lane),
//          and Crystal Moth #2's violet figure-eight guarding the transfer air. Three clocks, one ride.
//   BEAT 10 THE LAMP ROOM (exhale · gate) x 194..210 — Rubblekin #2 (rebuilt-angry pebbles) + Blizzard
//          Bat #2 contest the walk-up; the gate's warm lamp ends the shift.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the main line, carts and all · HIGH = the timber
// scaffold over beats 3-4 (chain on-ramp x47.2, ladder x65.4, ~9 candy + Gem Mimic #3 hiding amber
// among amber decoys — the floor lies up here too; falls land on GROUND, never void) · the GP0
// headframe detour off cart A1's kiss point (candy-traced double-jump) is the third visible ask.
// COMPARABLE HEIGHTS (all low rails y0.7 -> cart standing top 1.95; high rail y2.7 -> top 3.95):
//   board low cart from ground: rise 1.95 (held 2.6 law, 0.65 over-clearance) · island 0.8 -> cart:
//   rise 1.15 (tap 1.8) · cart -> island: hop DOWN 1.15 · D1 -> D2 transfer: rise 2.0, stair-stepped
//   1.0u x-offset at the kiss (held 2.6, 0.6 margin, no ceiling bonk — offset clears D2's box side) ·
//   cart A1 top -> headframe deck 4.6: rise 2.65 <= 3.0 double law, candy-traced · scaffold rises
//   <=0.5, edge gaps 0.9-1.4 (tap) · cart-kiss edge gaps 0.1u growing 5.2u/s -> ~1.3s honest window.
// HEARTS ALWAYS: every chasm is a heart + lantern walk-back (killY -14, winter pitDressing beds);
// knocker/mimic/pebble/moth/bat/roller all cost exactly 1; no spike one-shots anywhere.
// DETERMINISM: every cart, knocker, moth, bat, and the roller ride fixed clocks/phases from level
// start; knock-spots are FIXED (the glide always knocks at its x1); mimics/rubblekin are fixed-home
// player-reactive wakes (the IceAngler precedent — determinism holds); no Math.random on the critical
// path (rand() only inside baked deco, kit-standard).
//
// ---- CP0 SPAWN SAFETY (idle at x0/z0, CP0 respawn x2/z1.6): nearest FIXED bite = the gravel lane
// (touch min 50-0.76=49.2 -> 47u clear) · mimic #1 worst snap reach 73.5-2.6-3.4=67.5 (65u) · moth #1
// swing min 78-3.4-0.95=73.65 (71u) · knocker #1 burst zone 121-1.4=119.6 (117u) · bat #1 trigger-drift
// min 133-2.5-4.5-2=124 (122u) · rubble #1 wake+waddle reach 145-4.2-4=136.8 (134u) · carts are
// platforms, never teeth · the Geode's mimic-nest ambush is player-opened (1s spawnGrace, staggered)
// and its widest-flung nest mimic (x18.1, spawned on the z0 lane, wakeR 9) needs |dx|<9: an idle spawn
// at x0 (9.1u+ clear) and the CP0 respawn at x2/z1.6 (dx 10.9, and dz 1.6 misses the <1.6 gate besides)
// can never wake one — nests only bite the walker who opened them. All clear. ----
// ---- LANTERN SAFETY (the ONE lit checkpoint, x106 z1.6; idle reader at x106/z0, body edge 106.42):
// knocker #1 burst zone min 119.6 (13.2u) · knock-wall glide is harmless (touchDamage 0 outside burst) ·
// mimic #1 reach max 79.5 (26u) · mimic #3 reach max 90.9 AND 4.2u overhead (elevated, clear) · moth #1
// swing max 82.35 (23u) · gravel touch max 62.8 (43u) · bat #1 trigger-drift min 124 (17.6u) · rubble #1
// reach min 136.8 (30u) · chasm B lip x125 (18.6u) · no boulder lanes, no bucket lines, no drill tracks
// in this level. The pocket is a true breath. ----
// ---- GEODE CLEAR-PATCH (x15.5 z-1.35, worst-case reach): gravel touch min 49.2 (33.7u clear) ·
// mimic #1 reach min 67.5 (52u) · knocker burst 119.6 (104u) · all other fixed threats >100u east.
// Opening it is a deliberate safe act; the nest ambush spawns on the kit's 1s grace, staggered. ----

// ---- THE HEADFRAME: the winding tower over the portal — four battered legs, cross-braces, the great
// idle cable wheel (z-0.8, out of the deck-stander's head arc). Deck collider laid by platform() in the
// build; GP0 floats over the crown. All baked. ----
function w8l1Headframe(x){
  const g = new THREE.Group();
  for(const s of [-1,1]) for(const zz of [-0.7,0.7]){
    const leg = mesh('box',[0.3,4.8,0.3], mat(W8PAL.timber)); leg.position.set(x+s*1.55, 2.3, zz); leg.rotation.z = -s*0.1; g.add(leg);
    const foot = mesh('box',[0.5,0.3,0.5], mat(W8PAL.timberD)); foot.position.set(x+s*1.8, 0.15, zz); g.add(foot);
  }
  for(const by of [1.6,3.2]){ const brace = mesh('box',[3.3,0.22,0.26], mat(W8PAL.timberD)); brace.position.set(x, by, -0.7); brace.rotation.z = by>2?-0.06:0.06; g.add(brace); }
  const wheel = mesh('cyl',[0.85,0.85,0.2,12], mat(W8PAL.steel)); wheel.rotation.x = Math.PI/2; wheel.position.set(x, 6.0, -0.8); g.add(wheel);
  for(let i=0;i<4;i++){ const spoke = mesh('box',[1.5,0.09,0.06], mat(W8PAL.brassD)); spoke.rotation.z = i*Math.PI/4; spoke.position.set(x, 6.0, -0.68); g.add(spoke); }
  const stand = mesh('box',[0.24,1.4,0.24], mat(W8PAL.timber)); stand.position.set(x, 5.1, -0.8); g.add(stand);
  const cable = mesh('cyl',[0.035,0.035,5.6,4], mat(0x1a1626)); cable.position.set(x-1.3, 3.2, -0.8); cable.rotation.z = 0.45; g.add(cable);
  return g;
}

// ---- THE QUIET PROP: a lunch pail and a thermos on a shoring beam by the portal, lid open, sandwich
// still half in its paper — the whistle blew a hundred years ago and nobody ever came back for it.
// Never signposted; fully baked; story-readers stop, everyone else walks past. ----
function w8l1LunchBeam(x, z){
  const g = new THREE.Group();
  for(const s of [-0.65,0.65]){ const post = mesh('box',[0.14,1.1,0.16], mat(W8PAL.timberD)); post.position.set(x+s, 0.55, z); g.add(post); }
  const beam = mesh('box',[1.7,0.14,0.32], mat(W8PAL.timber)); beam.position.set(x, 1.15, z); beam.rotation.z = 0.015; g.add(beam);
  const pail = mesh('cyl',[0.18,0.15,0.3,8], mat(0x6a7080)); pail.position.set(x-0.35, 1.38, z); g.add(pail);
  const lid = mesh('cyl',[0.18,0.18,0.03,8], mat(0x7a8090)); lid.position.set(x-0.09, 1.24, z+0.1); lid.rotation.z = 1.25; g.add(lid);   // the lid, open, leaning
  const handle = mesh('tor',[0.13,0.02,4,10,Math.PI], mat(0x4a5058)); handle.position.set(x-0.35, 1.53, z); g.add(handle);
  const thermos = mesh('cyl',[0.09,0.09,0.34,7], mat(0x8a3a3a)); thermos.position.set(x+0.28, 1.4, z-0.03); g.add(thermos);
  const cap = mesh('cyl',[0.07,0.07,0.07,7], mat(0xc9ccd8)); cap.position.set(x+0.28, 1.6, z-0.03); g.add(cap);
  const paper = mesh('box',[0.3,0.015,0.2], mat(0xe8e4da)); paper.position.set(x+0.02, 1.23, z+0.02); paper.rotation.y = 0.3; g.add(paper);
  const sandwich = mesh('box',[0.16,0.08,0.12], mat(0xd8c9a0)); sandwich.position.set(x+0.0, 1.28, z+0.02); sandwich.rotation.y = 0.3; g.add(sandwich);
  return g;
}

function buildW8L1(G){
  const S = G.scene;
  levelBegin(G);

  const ROCK = 0x322a46;                    // the mine floor (lip auto-brightens into a crystal-dust sheen)
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE ADIT YARD (x -8..30) ===============================
  groundX(G, -8, 22, W6PAL.snowD);          // the surface: packed yard snow up to the portal
  groundX(G, 22, 30, ROCK);                 // ...and the first rock floor under the arch
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  signPost(G, 6, 1.7, -0.12, "THE ICICLE MINES. The night shift never ended - the whistle blew a hundred years ago and the carts still run on time. Mind the glitter. Some of it minds you back.");
  G.ents.add(new Crow(12, 0.95, 2.1));      // winter crow #1 — flaps off when neared
  // THE GLIMMERING GEODE — the gamble, in its CLEAR POCKET (ledger in the header: nearest fixed bite 33.7u)
  { const gd = new GlimmeringGeode(15.5, 0, -1.35, 0.3); G.coffins.push(gd); G.ents.add(gd); }
  deco.add(w6Pine(-5, -2.9, 1.2)); deco.add(w6Pine(10, -3.2, 1.0));       // the last trees before the underworld
  { const drift = mesh('sph',[1.3,8,6], mat(W6PAL.snow)); drift.scale.y = 0.4; drift.position.set(21.2, 0.15, -1.9); deco.add(drift); }
  // the portal arch + the rock above it (deco depth z<0 — nothing overhead ever bonks a jumper)
  deco.add(w8TimberFrame(21.5, 4.6));
  { const lintel = mesh('box',[7,2.4,1.2], mat(W8PAL.rockD)); lintel.position.set(21.5, 6.3, -1.6); deco.add(lintel);
    deco.add(w8CrystalCluster(19.8, -1.5, 1.1, W8PAL.crysC)); }
  // THE HEADFRAME + GP0 (idx 0, visible-but-tricky): deck 4.6 — a candy-traced DOUBLE-JUMP (rise 2.65 <= 3.0
  // law) off cart A1's top (1.95) at its west kiss point x26. Deck spans 22.3..25.3 (cart west edge 25.05 —
  // 0.25 overlap only, so a jumper from the cart's middle never bonks the deck's underside).
  deco.add(w8l1Headframe(23.8));
  platform(G, 23.8, 4.6, 0, 3.0, 2.0, W8PAL.timberD);
  G.ents.add(new GoldPumpkin(23.8, 5.5, 0, 0));
  candyLine(G, [[25.8,3.4,0],[24.8,4.6,0]], 2);                            // the trace — the double-jump telegraph
  // THE QUIET PROP — the lunch that never got eaten, on its beam by the portal
  deco.add(w8l1LunchBeam(29.2, -2.1));
  signPost(G, 28, 1.7, 0.1, "RIDE THE LINE. The carts keep the old schedule - board when one draws level, and step across where two lines kiss. The company thanks you for standing clear of the buffers.");
  candyLine(G, [[28.5,0.9,0],[29.6,0.9,0]], 2);

  // =============================== BEAT 2 — RIDE THE LINE (x 30..46): INTRODUCE the carts ===============================
  // Equal 10.5u spans at speed 2.6 (P 4.038); A2's phase = P so the carts KISS at mid-chasm (edges 37.45 vs
  // 37.55 — 0.1u, step across) once per 8.08s cycle. The gap grows at 5.2u/s: ~1.3s honest window, and a
  // missed hop is a free ride back, never a heart. A missed JUMP is the chasm's price: heart + CP0 walk-back.
  pitDressing(G, 30, 46, 'winter');
  w8Rails(G, 26, 49, 0.7);
  w8Cart(G, {x0:26,   x1:36.5, y:0.7, speed:2.6, phase:0});
  w8Cart(G, {x0:38.5, x1:49,   y:0.7, speed:2.6, phase:4.04});   // phase = P (10.5/2.6) -> the kiss
  // trestle posts down into the dark (deco — the rails needed legs)
  for(const tx of [33, 39, 45]) for(const s of [-0.55,0.55]){
    const post = mesh('box',[0.18,4.9,0.18], mat(W8PAL.timberD)); post.position.set(tx, -1.8, s); deco.add(post);
  }
  candyLine(G, [[31,3.2,0],[35,3.2,0]], 3);                                // ride line, west span
  candyLine(G, [[37.2,3.5,0],[38.8,3.5,0]], 2);                            // the kiss-step, arced
  candyLine(G, [[42,3.2,0],[46,3.2,0]], 3);                                // ride line, east span

  // =============================== BEAT 3 — THE GRAVEL GALLERY (x 46..64) + THE HIGH SCAFFOLD ===============================
  groundX(G, 46, 125, ROCK);                // one long rock floor: gallery, jewel field, lantern, knocker wall
  signPost(G, 46.5, 1.7, -0.1, "Runaway ore rolls this gallery on the quarter bell. The company apologizes for the rolling stock. Again.");
  G.ents.add(new GravelTriplet(G, 62, 0, 0, {x1:50, speed:4.6, phase:1.2, pause:1.6}));   // the trio tradition — one fixed lane, head-on
  candyLine(G, [[52,0.9,0],[56.5,0.9,0],[60,0.9,0]], 3);                   // the hop rhythm, traced
  // HIGH ROAD ON-RAMP #1: the winding chain (the mines' climb flavor) right at the cart A2 landing — the
  // scaffold's candy halo is visible overhead from the whole gallery (the "next run I'm going up there" itch)
  w5Chain(G, 47.2, 0, 4.6);
  const DECKS = [[50.5,3.9],[54.6,4.3],[58.7,3.9],[63.0,4.4],[67.3,4.0],[71.6,4.5],[76.0,4.1],[80.4,4.6],[85.5,4.2],[89.6,3.8]];
  for(const [dx,dy] of DECKS){
    platform(G, dx, dy, 0, dx===85.5?4.2:3.2, 1.7, W8PAL.timber);
    for(const s of [-1.1,1.1]){ const post = mesh('box',[0.16,dy-0.5,0.18], mat(W8PAL.timberD)); post.position.set(dx+s, (dy-0.5)/2, -0.85); deco.add(post); }   // z-0.85: clear of the roller's 0.8 reach
  }
  // HIGH ROAD ON-RAMP #2: a timber ladder out of the jewel field (visible rungs + its own climb volume)
  G.world.addBox(65.4, 0, 0, 1.0, 4.0, 1.2, {type:'climb'});
  for(const s of [-0.35,0.35]){ const rail = mesh('box',[0.07,4.2,0.09], mat(W8PAL.timber)); rail.position.set(65.4+s, 2.1, 0.5); deco.add(rail); }
  for(let ry=0.4; ry<4.0; ry+=0.45){ const rung = mesh('box',[0.72,0.06,0.08], mat(W8PAL.timberD)); rung.position.set(65.4, ry, 0.5); deco.add(rung); }
  candyLine(G, [[51,5.0,0],[55,5.4,0]], 2);                                // the scaffold halo — visible from the floor
  candyLine(G, [[59,5.0,0],[63.5,5.5,0],[68,5.1,0]], 3);
  candyLine(G, [[72.5,5.6,0],[77,5.2,0]], 2);
  candyLine(G, [[82,5.7,0],[89.6,4.9,0]], 2);
  // GEM MIMIC #3 — the high road's toll: amber, hiding among AMBER decoys on the wide deck (x85.5, top 4.2;
  // snap reach 83.7..87.5 stays ON the 83.4..87.6 deck — a hit knocks you to the GROUND below, never a void)
  { const c1 = w8CrystalCluster(84.2, 0.45, 0.8, W8PAL.crysA); c1.position.y = 4.2; deco.add(c1);
    const c2 = w8CrystalCluster(86.9, -0.3, 0.8, W8PAL.crysA); c2.position.y = 4.2; deco.add(c2);
    const c3 = w8CrystalCluster(79.6, 0.4, 0.85, W8PAL.crysA); c3.position.y = 4.6; deco.add(c3); }
  G.ents.add(new GemMimic(G, 85.6, 4.2, 0.1, {phase:0, wakeR:2.0, color:0xffb85e}));

  // =============================== BEAT 4 — THE JEWEL FIELD (x 64..84): INTRODUCE the mimic ===============================
  signPost(G, 66, 1.7, 0.12, "NOT EVERY JEWEL IS A JEWEL. A true crystal sleeps still. If one GLINTS at you - it is not glinting, it is grinning.");
  // seven REAL violet clusters on the natural walking line... and ONE that grins (x73.5 — glint 0.6s, one
  // snap-hop, re-disguise). Size + station tell them from baked clutter; only the GLINT tells the liar.
  for(const [cx,cz,cs] of [[68,0.8,1.0],[70.5,-0.55,1.15],[72.8,0.35,1.0],[75.2,-0.8,1.2],[77.6,0.55,1.05],[80,-0.35,1.15],[82.3,0.7,1.0]])
    deco.add(w8CrystalCluster(cx, cz, cs, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 73.5, 0, 0.1, {phase:0, wakeR:2.6, color:0xb08aff}));
  // CRYSTAL MOTH #1 — the field's air lane (figure-eight 74.6..81.4, y1.9..3.3 — under the scaffold decks'
  // 3.6 undersides; its touch band never reaches a grounded walker: it exists to make JUMPING a decision)
  G.ents.add(new CrystalMoth(G, 78, 2.6, 0, {phase:0.7, rx:3.4, ry:0.7, period:5.8}));
  candyLine(G, [[68.5,0.9,0],[71,0.9,0]], 2);                              // the honest line between the jewels
  candyLine(G, [[76.5,0.9,0],[79.5,0.9,0],[82.5,0.9,0]], 3);
  G.ents.add(new Crow(93, 0.95, 2.1));      // winter crow #2 — staring back down the field

  // =============================== BEAT 5 — THE LANTERN (x ~96..112): the ONE lit checkpoint ===============================
  // x106 of a 210u course = 50.5% (exam law). Pocket ledger pinned in the header — a true breath.
  G.ents.add(new Checkpoint(106, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 103.5, 1.5, 0, 'shield'));  // armor before the exam's second page
  candyLine(G, [[103,0.9,0],[105,0.9,0]], 2);

  // =============================== BEAT 6 — THE KNOCKER WALL (x 112..125): INTRODUCE the knock ===============================
  signPost(G, 109.5, 1.7, -0.1, "When the rock taps - tap... tap... TAP - that is a knocker asking you to STAND OFF. Three knocks means it is coming through. Old law. Good law.");
  // the low face: a rock wall along the back of the lane; the glow crawls x113.5->121 and ALWAYS knocks at
  // x121 (the glide law: the knock-spot is fixed forever). Safe ground, full 0.9s audible lesson, and the
  // spot sits 4u shy of the boarding lip: waiting for cart B = reading the knocks (the twist begins here).
  { const wall = mesh('box',[11.5,2.3,0.9], mat(W8PAL.rockL)); wall.position.set(117.2, 1.15, -1.0); deco.add(wall);
    const cap = mesh('box',[11.9,0.4,1.1], mat(W8PAL.rockD)); cap.position.set(117.2, 2.5, -1.0); deco.add(cap);
    deco.add(w8CrystalCluster(112.5, -0.7, 0.9, W8PAL.crysC)); deco.add(w8CrystalCluster(121.8, -0.75, 0.85, W8PAL.crysC)); }
  G.ents.add(new KnockerSprite(G, 117, 0.95, -0.25, {phase:0.8, x0:113.5, x1:121, wallY:0.95, period:7.0, speed:2.0}));
  candyLine(G, [[114,0.9,0],[117.5,0.9,0],[123.5,0.9,0]], 3);              // the walk past the face — the last one waits beyond the knock-spot

  // =============================== BEAT 7 — CHASM B (x 125..141): THE TWIST — ride under the dive ===============================
  pitDressing(G, 125, 141, 'winter');
  w8Rails(G, 122, 144, 0.7);
  w8Cart(G, {x0:122.5, x1:143.5, y:0.7, speed:3.0, phase:0.5});   // one long shuttle, 7s each way
  for(const tx of [128, 134, 140]) for(const s of [-0.55,0.55]){
    const post = mesh('box',[0.18,4.9,0.18], mat(W8PAL.timberD)); post.position.set(tx, -1.8, s); deco.add(post);
  }
  // BLIZZARD BAT #1 — owns the mid-chasm air (patrol 130.5..135.5 at y5.2): squeak telegraph, snapshot dive
  // at where you WERE — the cart carries you out of it if you keep your nerve. Worst mid-ride pinch: bat +
  // the fall = 2 systems (the knock-spot's burst zone ends at 121.95, before the rails' first plank).
  G.ents.add(new BlizzardBat(G, 133, 5.2, 0, {phase:1.1, range:2.5, period:3.6, aggroR:4.5}));
  candyLine(G, [[128,3.35,0],[133,3.35,0],[139,3.35,0]], 3);               // the ride line — collected sitting down

  // =============================== BEAT 8 — CHASM C (x 148..166): THE ESCALATE — a mimic pocket ON the route ===============================
  groundX(G, 141, 148, ROCK);               // the west approach lip
  candyLine(G, [[143,0.9,0],[144.5,0.9,0]], 2);
  // RUBBLEKIN #1 — an innocent rubble pile RIGHT where cart B sets you down (wakes at 4.2, assembles 0.7s,
  // clocked pebble lobs). The honest read: stomp it (it scatters, rebuilds once, angrier) before boarding C1.
  G.ents.add(new Rubblekin(G, 145, 0, 0, {phase:0, wakeR:4.2, speed:1.6, lobP:3.2}));
  pitDressing(G, 148, 166, 'winter');
  // THE TREASURE ISLAND — a rock pier mid-chasm (top y0.8), crowned in violet jewels... one of which is
  // GEM MIMIC #2. C1's east edge stops 0.25u short of the island (hop DOWN 1.15); C2's west edge starts
  // 0.25u past it (hop UP 1.15, tap law). Landing wakes the mimic (0.6s glint): stomp it or clear its one
  // 1.9u snap (snap lands 155.6..159.4 — always ON the 155.4..159.6 island, never a float over the void).
  platform(G, 157.5, 0.8, 0, 4.2, 2.4, W8PAL.rockL);
  { const pier = mesh('cyl',[1.5,2.1,4.6,7], mat(W8PAL.rockD)); pier.position.set(157.5, -1.9, 0); deco.add(pier); }
  { const c1 = w8CrystalCluster(156.3, 0.5, 1.0, W8PAL.crysV); c1.position.y = 0.8; deco.add(c1);
    const c2 = w8CrystalCluster(158.6, -0.4, 1.1, W8PAL.crysV); c2.position.y = 0.8; deco.add(c2); }
  G.ents.add(new GemMimic(G, 157.5, 0.8, 0.1, {phase:0, wakeR:2.3, color:0xb08aff}));
  w8Rails(G, 145, 155, 0.7);
  w8Rails(G, 160, 170, 0.7);
  w8Cart(G, {x0:145.5, x1:154.2, y:0.7, speed:2.7, phase:0.3});
  w8Cart(G, {x0:160.8, x1:169.5, y:0.7, speed:2.7, phase:1.6});
  for(const tx of [150.5, 164]) for(const s of [-0.55,0.55]){
    const post = mesh('box',[0.18,4.9,0.18], mat(W8PAL.timberD)); post.position.set(tx, -1.8, s); deco.add(post);
  }
  candyLine(G, [[148.5,3.2,0],[152,3.2,0]], 2);                            // ride C1
  candyLine(G, [[154.8,2.6,0],[156.4,2.0,0]], 2);                          // the hop down, arced
  candyLine(G, [[159.4,2.3,0],[160.8,2.9,0]], 2);                          // ...and back up
  candyLine(G, [[163.5,3.2,0],[166.5,3.2,0]], 2);                          // ride C2

  // =============================== BEAT 9 — THE SHAFT JUNCTION (x 172..194): MASTER ===============================
  groundX(G, 166, 172, ROCK);               // the junction lip — the breath before the exam
  G.ents.add(new Heart(168, 1.0, 0));       // mercy at the door (the w7l4 mid-lake precedent)
  candyLine(G, [[167.5,0.9,0],[169.5,0.9,0]], 2);
  pitDressing(G, 172, 194, 'winter');
  // TWO CART LINES AT OFFSET PHASES: equal 14u spans at 3.2 (P 4.375); D2's phase = P, so the carts KISS
  // stair-stepped at the x183.5 seam every 8.75s — D2's west cart hangs 1.0u west-offset ABOVE D1's east
  // point (tops 1.95 / 3.95, box bottom 3.7 vs rider head 3.2: 0.5 clear), so the transfer is an up-left
  // held hop onto a stair, never a blind leap into a ceiling.
  w8Rails(G, 167, 184, 0.7);
  w8Rails(G, 180, 197, 2.7);
  w8Cart(G, {x0:169.5, x1:183.5, y:0.7, speed:3.2, phase:0});
  w8Cart(G, {x0:182.5, x1:196.5, y:2.7, speed:3.2, phase:4.375});   // phase = P (14/3.2) -> the stair-kiss
  for(const tx of [176, 182, 190]) for(const s of [-0.55,0.55]){
    const post = mesh('box',[0.18,4.9,0.18], mat(W8PAL.timberD)); post.position.set(tx, -1.8, s); deco.add(post);
  }
  // the high line's trestle: tall standards down into the pit mid-span, a short one rooted on the far shore
  for(const tx of [186.5, 192]) for(const s of [-0.55,0.55]){   // east of D1's widest sweep (184.45) — no cart clip
    const hleg = mesh('box',[0.2,6.8,0.2], mat(W8PAL.steel)); hleg.position.set(tx, -0.8, s); deco.add(hleg);
  }
  for(const s of [-0.55,0.55]){ const hleg = mesh('box',[0.2,2.6,0.2], mat(W8PAL.steel)); hleg.position.set(196.2, 1.3, s); deco.add(hleg); }
  // THE CEILING KNOCKER — a fringe of hanging rock teeth over the LOW line (x170.5..178.5, z-0.62, tips to
  // ~2.4 — flanking the lane, never clipping a rider at z+-0.42). Knocker #2 glides the fringe at wallY 2.6
  // (>2 = ceiling law: the burst swings DOWN through the rider lane) and ALWAYS knocks at x177.5 — the low
  // ride crosses a fixed thunder-spot on a 6.6s clock. Its touch band [2.6..3.35] vs the D1 rider's
  // 1.95..3.2 body: a 0.6u honest overlap; jumping INTO it is wrong, riding the cart's far end through the
  // spot (or timing the pass between knocks) is the master read. The 0.9s tap-tap-TAP carries over the pit.
  { const rib = mesh('box',[9.5,0.6,1.0], mat(W8PAL.rockD)); rib.position.set(174.5, 3.75, -0.9); deco.add(rib);
    for(let tx=170.8; tx<178.6; tx+=0.9){ const tooth = mesh('cone',[0.13,rand(0.7,1.1),5], mat(W8PAL.rockL)); tooth.rotation.x = Math.PI; tooth.position.set(tx, 3.0, -0.62); deco.add(tooth); }
    deco.add(w8CrystalCluster(171.5, -1.0, 0.9, W8PAL.crysA)); }
  G.ents.add(new KnockerSprite(G, 174, 2.6, -0.35, {phase:3.2, x0:170.5, x1:177.5, wallY:2.6, period:6.6, speed:2.2}));
  // CRYSTAL MOTH #2 — violet, working the transfer air (x181.9..187.1, y3.8..5.6 — low point grazes just
  // under the D2 cart's 3.95 top, never through its box): the seam hop and D2's first stretch answer to
  // her. Worst junction pinch: knocker + moth + the fall = 3 systems (cap holds).
  G.ents.add(new CrystalMoth(G, 184.5, 4.7, 0, {phase:1.7, rx:2.6, ry:0.9, period:5.6, color:0xb08aff}));
  candyLine(G, [[172.5,3.2,0],[176,3.2,0],[179.8,3.2,0]], 3);              // the low ride — through the thunder-spot's rhythm
  candyLine(G, [[184.2,3.4,0],[183.2,4.4,0],[182.6,5.2,0]], 3);            // the stair-hop trace at the seam
  candyLine(G, [[187,5.3,0],[190.5,5.3,0],[194,5.3,0]], 3);                // the high ride home

  // =============================== BEAT 10 — THE LAMP ROOM (x 194..210): exhale, contest, gate ===============================
  groundX(G, 194, 214, ROCK);
  // RUBBLEKIN #2 — the runout's floor-lie, one rebuild angrier (its wake zone 195.5..205.5 is the fight
  // lane; the outro sign at 207.6 sits beyond both its wake and bat #2's worst trigger-drift reach 206.2)
  G.ents.add(new Rubblekin(G, 200.5, 0, 0, {phase:0, wakeR:5, speed:1.9, lobP:2.6}));
  G.ents.add(new BlizzardBat(G, 197.5, 6.0, 0, {phase:0.9, range:2.2, period:3.4, aggroR:4.5}));   // y6.0: patrol band never brushes a D2 rider's 5.2 head — only the squeak-dive threatens
  candyLine(G, [[198,0.9,0],[201.5,0.9,0]], 2);
  G.ents.add(new Crow(206, 0.95, 2.2));     // winter crow #3 — clocked out long ago
  signPost(G, 207.6, 1.7, -0.1, "End of the First Shaft. Deeper galleries past the gate - the drills are still singing down there. Clock out at the lamp room; nobody else ever did.");
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(208.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 210);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // set-dressing crystal clumps in the mid-depth (big, deep, and OFF the walking line — station and size
  // keep them from ever reading as decoy-field jewels, per the never-confuse law)
  deco.add(w8CrystalCluster(52.5, -2.6, 1.6, W8PAL.crysC));
  deco.add(w8CrystalCluster(95,   -2.7, 1.8, W8PAL.crysV));
  deco.add(w8CrystalCluster(120,  -2.5, 1.4, W8PAL.crysA));
  deco.add(w8CrystalCluster(167.5,-2.6, 1.5, W8PAL.crysV));
  deco.add(w8CrystalCluster(196.5,-2.7, 1.7, W8PAL.crysC));
  for(const fx of [86, 96.5, 145.7, 196]) deco.add(w8TimberFrame(fx, 3.6));   // shoring cadence on the solid runs
  // FOREGROUND silhouettes (z>0): dark stalagmite teeth framing the depth
  for(const [fx,fs] of [[40,1.1],[88,1.4],[132,1.2],[178,1.3],[203,1.0]]){
    const tooth = mesh('cone',[0.6*fs, 1.9*fs, 5], mat(0x150f22)); tooth.position.set(fx, 0.6, 2.7); tooth.rotation.z = rand(-0.12,0.12); deco.add(tooth);
  }
  S.add(bakeGroup(deco));

  w8Parallax(S, -8, 212);
  w8LevelFinish(G, -8, 212, null);          // null clutter: baked props must never hover over the four chasms...
  w8Clutter(G, -8, 29.5, 'mine');           // ...so the solid spans are cluttered manually (w7l4 precedent)
  w8Clutter(G, 46.5, 124.5, 'mine');
  w8Clutter(G, 141.5, 147.5, 'mine');
  w8Clutter(G, 166.5, 171.5, 'mine');
  w8Clutter(G, 194.5, 209, 'mine');

  return {spawnX: 0, exitX: 210};
}

function updateW8L1(G, dt){
  updateLevelCommon(G, dt);
}

W8_LEVELS.push({id:'w8l1', district:'w8', name:'THE FIRST SHAFT', build:buildW8L1, update:updateW8L1, parTime:165});

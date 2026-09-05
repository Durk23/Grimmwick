// ============ LEVEL 8-5 — PRISMUS'S THRESHOLD (District 8 · Frostmere · The Icicle Mines) ============
// POST-STORY MASTERY BAND: the district EXAM at the sealed crystal cathedral door — every machine the mines
// taught, chained back-to-back, MAIN-GAME FAIR (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat
// systems anywhere, fixed clocks from level start, one-good-run-away). 15 threats: 3 Knocker Sprites +
// 3 Gem Mimics + 2 Rubblekin + 2 Crystal Moths + 2 Blizzard Bats + 1 Snow-Boo + 2 Gravel Triplet lanes —
// plus stalactite waves (SpikeIcicle clocks), 2 traveling drills, a cart relay, a bucket line, a seesaw pair.
// NO warp (the Off-Limits Bucket lives in another level), NO Leap of Faith (both are placed and sacred).
// GOLDEN PUMPKIN idx 2 — skill-gated: leap from the seesaw's apex onto the crystal balcony over the
// Shard-Fall's mouth (the candy arc telegraphs the double-jump line).
//
//   BEAT 1 THE THRESHOLD CAMP        x -8..29    — CP0 (noLight). The Glimmering Geode in its clear pocket,
//          the exam sign, decoy crystals hiding Gem Mimic #1. The last flat ground before the machines.
//   BEAT 2 THE CART RELAY (compose)  x 29..59    — two ore-cart lanes over the great crevasse, handing off at
//          the sorting island ON ONE 10s CLOCK (catch lane 1 at its west end and lane 2 arrives at the island
//          the second you do — the relay is learnable as a single loop). Overhead, a 4-column stalactite wave
//          on the SAME 5s clock teaches the 0.7-step shard language; Blizzard Bat #1 contests lane 2's air.
//   BEAT 3 THE KNOCKER CORRIDOR      x 59..94    — the walls are the enemy: three rock faces, offset knocks
//          (tap-tap-TAP every 2s somewhere). FLOOR lane: two low faces + Rubblekin #1 + Gem Mimic #2 among
//          decoys. CATWALK lane (chain-gated, x63): the high face knocks at head height instead. No lane is
//          free; both are candy-traced.
//   BEAT 4 THE LANTERN LANDING       x 94..108   — THE lit lantern (x100, 54% of the 200u run — the exam's
//          ONE checkpoint), a shield lantern, a heart, and the drill-floor sign. A true breath (math below).
//   BEAT 5 THE DRILL CROSSING        x 108..141  — TWO drills share the floor on offset shuttles (safe strip
//          x124.7..127.3 between their tracks — where a Snow-Boo haunts: stare it SOLID and its ice block is
//          the one stand the drills can't reach). Overhead, the ore-bucket line rides the whole corridor.
//   BEAT 6 THE COUNTERWEIGHT GALLERY x 141..158  — the seesaw pair under a moth-crossed air lane, Rubblekin #2
//          pressuring the boarding. Ride B to its apex → the candy arc points at the GP balcony.
//   BEAT 7 THE SHARD-FALL (master)   x 158..183  — the mines' bombardment: TEN stalactite columns on one
//          rolling west→east wave (period 7.0s, phases stepping 0.7 — exactly one column falls every 0.7s,
//          safe strips always readable, run WITH the wave). Gravel Triplets roll two fixed lanes head-on;
//          Blizzard Bat #2 owns the late air. Gem Mimic #3 guards the mouth among real clusters.
//   BEAT 8 THE GREAT DARK DOORS      x 183..192  — the sealed cathedral door, the lantern sign, the empty
//          canary cage (the quiet prop), and the gate.
//
// ROUTES (2-3 visible, junctions sighted): LOW = floor the whole way — carts, corridor floor, drill floor,
// shard run · HIGH = the corridor CATWALK (chain at x63, its candy visible from the floor) and the BUCKET LINE
// over both drills (boarding stairs beside the drill floor's mouth — riders watch the drills grind below) ·
// SKILL = seesaw-apex leap to the GP balcony (candy-arc telegraphed; moth #2 crosses the leap lane).
// COMPARABLE HEIGHTS (all mains <=2.2 · doubles <=3.0 candy-traced · gaps <=4 tap): cart board 1.25 (tap 1.8,
// over-clearance) · island hop 0.35 · catwalk pad gaps 1.0-1.6 (tap) · chain gates the catwalk (climb verb) ·
// bucket stairs 1.4/1.2 then a 1.0 hop to the seat · seesaw board 1.08 at trough (tap; held reaches half the
// cycle) · frozen-boo block top ~2.03 (held 2.6) · GP leap: 2.75 gap + 1.22 rise off the apex (double 3.3,
// candy-arced) · everything else is drops.
// HEARTS ALWAYS: every machine costs exactly 1 (drill band, knocker burst, icicle, pebble, moth, bat, roller);
// the crevasse is the kit's full pit price (spike-bed show + heart + lantern walk-back). No instant death.
// DETERMINISM: every contraption and enemy carries a fixed phase from level start; the cart relay, the wave
// clocks, the drill shuttles and the seesaw all repeat exactly (rand() lives only inside baked deco, kit-
// standard; the Geode's gamble RNG is opt-in side content, never the critical path).
//
// ---- CLEAR-PATCH (Geode x11.5, worst-case reach math): Gem Mimic #1 at x24 (wake 2.6 + snap 3.4 → reaches
// x18.0 → 6.5u clear) · Bat #1 trigger min 52.5-2.5-4=46, post-dive drift -2 → 44 (32.5u) · cart-bay icicles
// x33+ (danger edge 32.5 → 21u) · knocker faces from x63.5, burst+touch 1.4+0.6 → 61.5 (50u) · Rubblekin #1
// x81 (wakeR 5.5+4 → 71.5; 60u) · Snow-Boo leashed to home 126 (never west of ~110) · mimic-nest ambush
// spawns ride the kit's fixed ring + 1.0s spawnGrace. Every reach >=6u — opening is a deliberate, safe act. ----
// ---- CP0 SAFETY (spawn x0 / lantern x2, z1.6): nearest fixed bite is Gem Mimic #1's west reach x18.0 →
// 16u clear; everything else is 40u+ (ledger above). ----
// ---- LIT-LANTERN SAFETY (x100, z1.6): behind — knocker #3 face ends 90, burst+touch reach 92.0 (8.0u) ·
// Rubblekin #1 reach 81+9.5=90.5 (9.5u) · Gem Mimic #2 reach 76+6=82 (18u). Ahead — drill A track min bite
// 112-1.7=110.3 (10.3u) · bucket movers harmless · Snow-Boo leash floor ~110 (10u) · moths min x144.3 ·
// Rubblekin #2 reach 144-9.5=134.5 · triplets/shards x161+ · bat #2 trigger-drift min 173.5-2.5-4-2=165.
// The landing is a true breath. ----

// ---- THE QUIET PROP: a miner's canary perch by the great doors — cage door standing open, perch empty,
// a tiny knitted blanket folded neatly inside. The last crew out of the deep made sure the canary went home
// first. Never signposted; fully baked; story-readers stop, everyone else walks past. ----
function w8l5Canary(x, z){
  const g = new THREE.Group();
  const post = mesh('cyl',[0.05,0.07,1.25,5], mat(W8PAL.timberD)); post.position.set(x, 0.62, z); g.add(post);
  const arm = mesh('box',[0.5,0.05,0.05], mat(W8PAL.timber)); arm.position.set(x+0.2, 1.25, z); g.add(arm);
  // the cage — brass rings + a few fine bars, hung from the arm
  const cy = 0.78;
  for(const ry of [cy+0.32, cy-0.28]){ const ring = mesh('tor',[0.26,0.02,4,12], mat(W8PAL.brass)); ring.rotation.x = Math.PI/2; ring.position.set(x+0.38, ry, z); g.add(ring); }
  for(let i=0;i<5;i++){ const a = i/5*TAU + 0.3; if(i===2) continue;   // one bar missing where the door swings
    const bar = mesh('cyl',[0.012,0.012,0.62,3], mat(W8PAL.brassD)); bar.position.set(x+0.38+Math.cos(a)*0.26, cy+0.02, z+Math.sin(a)*0.26); g.add(bar); }
  const top = mesh('sph',[0.09,6,5], mat(W8PAL.brass)); top.scale.y=0.6; top.position.set(x+0.38, cy+0.4, z); g.add(top);
  // the door — hinged OPEN, forever
  const door = mesh('box',[0.02,0.5,0.24], mat(W8PAL.brassD)); door.position.set(x+0.62, cy+0.02, z+0.2); door.rotation.y = 0.9; g.add(door);
  // the empty perch, and the tiny knitted blanket folded on the cage floor
  const perch = mesh('cyl',[0.015,0.015,0.3,3], mat(W8PAL.timber)); perch.rotation.z = Math.PI/2; perch.position.set(x+0.38, cy+0.06, z); g.add(perch);
  const blanket = mesh('box',[0.2,0.045,0.15], mat(0xc94a3a)); blanket.position.set(x+0.33, cy-0.24, z+0.04); blanket.rotation.y=0.25; g.add(blanket);
  const fold = mesh('box',[0.14,0.045,0.1], mat(0xd97a4a)); fold.position.set(x+0.36, cy-0.2, z+0.02); fold.rotation.y=0.4; g.add(fold);
  return g;
}

// ---- THE GREAT DARK DOORS — the sealed crystal cathedral: two vast slabs behind the gate, a violet rose
// window high above, crystal-trimmed jambs. Light leaks from the seam; the gate is how you knock. (Baked.) ----
function w8l5Doors(x){
  const g = new THREE.Group();
  for(const s of [-1,1]){
    const slab = mesh('box',[3.4,9.4,0.6], mat(0x1a1428)); slab.position.set(x+s*1.78, 4.7, -2.9); g.add(slab);
    const trim = mesh('box',[0.24,9.0,0.65], mat(W8PAL.brassD)); trim.position.set(x+s*0.35, 4.5, -2.88); g.add(trim);
    for(let i=0;i<3;i++){ const stud = mesh('sph',[0.14,5,4], mat(W8PAL.brass)); stud.position.set(x+s*2.6, 1.6+i*2.6, -2.58); stud.scale.z=0.5; g.add(stud); }
    const jamb = mesh('box',[0.8,10.2,0.9], mat(W8PAL.rockD)); jamb.position.set(x+s*3.9, 5.1, -3.0); g.add(jamb);
    const jc = w8CrystalCluster(x+s*3.9, -2.55, 1.1, W8PAL.crysV); jc.position.y = 0; g.add(jc);
  }
  const seam = mesh('box',[0.12,8.6,0.1], emat(W8PAL.crysV, W8PAL.crysV, 0.9)); seam.position.set(x, 4.3, -2.56); g.add(seam);
  const lintel = mesh('box',[8.6,0.9,0.9], mat(W8PAL.rockD)); lintel.position.set(x, 9.8, -3.0); g.add(lintel);
  const rose = mesh('tor',[0.95,0.12,6,18], mat(W8PAL.brassD)); rose.position.set(x, 8.1, -2.7); g.add(rose);
  const roseG = mesh('circ',[0.85,14], emat(0x5a3a8e, W8PAL.crysV, 0.7)); roseG.position.set(x, 8.1, -2.66); g.add(roseG);
  for(let i=0;i<6;i++){ const a=i/6*TAU; const spoke = mesh('box',[0.06,1.7,0.06], mat(W8PAL.brassD)); spoke.position.set(x, 8.1, -2.62); spoke.rotation.z=a; g.add(spoke); }
  return g;
}

// ---- rock roof slab + trestle legs (shared little builders for the two roofed spans + the crevasse rails) ----
function w8l5Roof(x1, x2, y){
  const g = new THREE.Group();
  const slab = mesh('box',[x2-x1, 0.9, 3.4], mat(W8PAL.rockD)); slab.position.set((x1+x2)/2, y+0.45, -0.5); g.add(slab);
  for(let x=x1+1.5; x<x2-1; x+=rand(2.5,4)){   // hanging rock teeth + dim crystal nubs (deco — the LIVE icicles are the clocked ones)
    const th = mesh('cone',[rand(0.2,0.4), rand(0.5,1.0), 5], mat(W8PAL.rock)); th.rotation.x=Math.PI; th.position.set(x, y-0.25, rand(-1.6,0.6)); g.add(th);
    if(rand()<0.35){ const nub = mesh('cone',[0.12,0.35,5], emat(W8PAL.crysC,W8PAL.crysC,0.35)); nub.rotation.x=Math.PI; nub.position.set(x+0.5, y-0.15, rand(-1.4,0.2)); g.add(nub); }
  }
  return g;
}
function w8l5Trestle(x){
  const g = new THREE.Group();
  for(const s of [-0.55,0.55]){ const leg = mesh('box',[0.18,4.4,0.2], mat(W8PAL.timberD)); leg.position.set(x, -2.2, s); g.add(leg); }
  const brace = mesh('box',[0.16,3.2,0.16], mat(W8PAL.timber)); brace.position.set(x, -2.4, 0); brace.rotation.x=0.5; g.add(brace);
  const cap = mesh('box',[0.6,0.16,1.5], mat(W8PAL.timber)); cap.position.set(x, -0.12, 0); g.add(cap);
  return g;
}

function buildW8L5(G){
  const S = G.scene;
  levelBegin(G);

  const deco = new THREE.Group();            // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE THRESHOLD CAMP (x -8..29) ===============================
  groundX(G, -8, 29.9, W8PAL.rock);          // the west landing, up to the crevasse lip at 30
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  signPost(G, 5.5, 1.7, -0.12, "PRISMUS'S THRESHOLD. Past this gallery: the door. Carts, buckets, knocks and shard-light - everything the mines taught you, all at once. The old crews called this stretch the interview.");
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 2);
  // THE GLIMMERING GEODE — the gamble, in its CLEAR POCKET (full reach ledger in the header; every fixed
  // bite >=6u out; the mimic-nest ambush emerges on the kit's ring + 1s grace). Deliberate act, never a trap.
  { const gd = new GlimmeringGeode(11.5, 0, -0.9, 0.25); G.coffins.push(gd); G.ents.add(gd); }
  G.ents.add(new Crow(17, 0.95, 2.1));       // mine crow #1 — flaps off when neared
  // GEM MIMIC #1 among two REAL clusters (the decoy law: it is exactly as boring as its neighbors until it
  // GLINTS — 0.6s rattle telegraph, then one 3.4u snap). Reaches x18.0 west (geode 6.5u) / x30.0 east (the lip).
  deco.add(w8CrystalCluster(21.2, -0.7, 0.9, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 24, 0, -0.2, {phase:0.4, wakeR:2.6, color:0xb08aff}));
  deco.add(w8CrystalCluster(26.6, 0.8, 0.8, W8PAL.crysV));
  deco.add(w8TimberFrame(19, 3.6));          // the shaft mouth — timber shoring frames the way in
  deco.add(w8TimberFrame(27.5, 3.8));

  // =============================== BEAT 2 — THE CART RELAY (x 29..59): compose carts + shard wave ===============================
  // The great crevasse. Rails bridge it on trestles; TWO cart lanes hand off at the sorting island on ONE
  // 10s clock: catch lane 1 at its west end (t=10n) and lane 2 arrives at the island exactly as you do
  // (phase 5.0 — the relay is a single learnable loop). Cart platform tops ~1.25 (board: tap, over-clearance).
  pitDressing(G, 30, 58, 'winter');          // the crevasse shows its teeth (heart + lantern walk-back, never death)
  w8Rails(G, 28.2, 59.8, 0);
  for(const tx of [33.5, 39, 48.5, 54]) deco.add(w8l5Trestle(tx));
  w8Cart(G, {x0:29, x1:43, y:0, speed:2.8, phase:0});      // west lane — span 14 at 2.8 = P 5.0 each way
  w8Cart(G, {x0:45.5, x1:59, y:0, speed:2.7, phase:5.0});  // east lane — span 13.5 at 2.7 = P 5.0, half-cycle offset = the relay
  platform(G, 43.8, 0.9, 0, 2.0, 2.2, W8PAL.rockL);                      // the sorting island (top 0.9 — the mid-relay refuge; NO icicle above it: a readable safe strip)
  G.ents.add(new Heart(43.8, 1.7, 0));                                   // mercy at the handoff
  candyLine(G, [[26.5,0.9,0],[28.5,1.9,0],[30,2.2,0]], 3);               // the boarding arc
  candyLine(G, [[35,2.4,0],[40,2.4,0]], 2);                              // lane 1's ride line
  candyLine(G, [[44,2.0,0],[49,2.4,0],[53.5,2.4,0]], 3);                 // island hop + lane 2
  // THE STALACTITE WAVE, first taste: four columns over the lanes on the SAME 5s clock as the carts (the whole
  // relay repeats exactly every 10s) with 0.7 phase steps INSIDE each pair — the shard language, taught where
  // the forward ride is always clean and the dawdler meets the drop. Shatter depth -2.6 (into the dark below
  // the rails); the shimmer + drip at eye level is the >=0.6s telegraph.
  deco.add(w8l5Roof(29, 59, 6.2));
  G.ents.add(new SpikeIcicle(G, 33, 5.7, {period:5.0, phase:1.2, len:1.2, floorY:-2.6}));
  G.ents.add(new SpikeIcicle(G, 38, 5.7, {period:5.0, phase:0.5, len:1.2, floorY:-2.6}));
  G.ents.add(new SpikeIcicle(G, 50, 5.7, {period:5.0, phase:3.7, len:1.2, floorY:-2.6}));
  G.ents.add(new SpikeIcicle(G, 55, 5.7, {period:5.0, phase:3.0, len:1.2, floorY:-2.6}));
  // BLIZZARD BAT #1 — contests lane 2's air (squeak telegraph, snapshot dive, never homing). Patrol 50..55
  // at y4.6; trigger window 46..61 (+/-2 drift) — never near the geode pocket or the lit lantern (ledger).
  G.ents.add(new BlizzardBat(G, 52.5, 4.6, 0, {phase:0.8, range:2.5, period:3.6, aggroR:4}));

  // =============================== BEAT 3 — THE KNOCKER CORRIDOR (x 59..94): the walls are the enemy ===============================
  groundX(G, 58.1, 192, W8PAL.rock);         // one long floor from the east lip to the doors (machines carve it up from here)
  // corridor dressing: the great back wall, the knee-high knocker ridge along the lane, the high face band
  { const wall = mesh('box',[34, 7.2, 1.2], mat(W8PAL.rockD)); wall.position.set(76.5, 3.6, -2.4); deco.add(wall);
    const ridge = mesh('box',[33, 1.7, 0.8], mat(W8PAL.rockL)); ridge.position.set(76.5, 0.85, -0.95); deco.add(ridge);   // the LOW faces' rock
    const brow  = mesh('box',[17, 1.6, 0.7], mat(W8PAL.rockL)); brow.position.set(77, 4.85, -0.85); deco.add(brow); }     // the HIGH face beside the catwalk
  signPost(G, 60.8, 1.7, 0.1, "The walls do the knocking here - three faces, three tempers, never together. Tap... tap... TAP means MOVE. The catwalk is no safer, little light. It only knocks from up there.");
  // THREE KNOCKER SPRITES — offset thirds of one 6s clock: a knock lands somewhere every 2s, never twice at
  // once (the <=4 law's friend). Faces hug the lane (z-0.35/-0.3) so the burst bites where the glow says.
  G.ents.add(new KnockerSprite(G, 68.5, 1.0, -0.35, {phase:0.0, x0:63.5, x1:73.5, wallY:1.0, period:6.0, speed:2.2}));   // low face, west
  G.ents.add(new KnockerSprite(G, 77,   4.75, -0.3, {phase:2.0, x0:70,   x1:84,   wallY:4.75, period:6.0, speed:2.4})); // the HIGH face — head height on the catwalk only
  G.ents.add(new KnockerSprite(G, 84,   1.0, -0.35, {phase:4.0, x0:78.5, x1:90,   wallY:1.0, period:6.0, speed:2.2}));   // low face, east
  // FLOOR lane pressure: Rubblekin #1 (0.7s assembly telegraph, clocked pebbles) + Gem Mimic #2 in the gap
  // between the two low faces, among decoys. Floor worst-case: one knocker burst + rubblekin + mimic = 3.
  G.ents.add(new Rubblekin(G, 81, 0, 0.3, {phase:0.6, wakeR:5.5, speed:1.6, lobP:3.4}));
  deco.add(w8CrystalCluster(74.2, 0.9, 0.85, W8PAL.crysC));
  G.ents.add(new GemMimic(G, 76, 0, -0.3, {phase:1.1, wakeR:2.6, color:0x7ae8ff}));
  deco.add(w8CrystalCluster(78, -0.6, 0.75, W8PAL.crysC));
  candyLine(G, [[66,0.9,0],[71,0.9,0],[76,0.9,0]], 3);
  candyLine(G, [[82,0.9,0],[87,0.9,0]], 2);
  // THE CATWALK — the high road (visible from the floor: its candy is the junction itch). Chain-gated at x63
  // (climb is the verb; boosted hop off the top). Pads y4.2, gaps 1.0-1.6 (tap law); knocker #2 works the
  // whole middle stretch at head height. Bat-wings lantern crowns the far end — 18s for the landing ahead.
  w5Chain(G, 63.2, 0.4, 4.9, 0);
  candyLine(G, [[63.2,2.5,0],[63.2,4.5,0]], 2);
  for(const [px,pw] of [[66.8,3.0],[71.0,3.0],[75.6,3.0],[80.2,3.0],[84.8,3.0],[89.0,3.0]])
    platform(G, px, 4.2, 0, pw, 1.8, W8PAL.timber);
  candyLine(G, [[71,5.1,0],[78,5.1,0],[85,5.1,0]], 3);
  G.ents.add(new BonkLantern(G, 89, 5.7, 0, 'bat'));
  deco.add(w8TimberFrame(65, 3.4)); deco.add(w8TimberFrame(92.5, 3.6));

  // =============================== BEAT 4 — THE LANTERN LANDING (x 94..108): the breath ===============================
  // THE lantern — the level's ONE lit checkpoint (x100 of the 200u run = 54%). Full rest-pocket ledger in the
  // header: nearest bite behind is knocker #3's 92.0, ahead is drill A's 110.3 — an 8u/10u true breath.
  G.ents.add(new Checkpoint(100, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 97.8, 1.5, 0, 'shield'));   // armor before the exam's second page
  G.ents.add(new Heart(102.5, 1.0, 0));
  candyLine(G, [[97,0.9,0],[99.5,0.9,0]], 2);
  signPost(G, 104.6, 1.7, -0.1, "Two drills share the floor ahead and neither one yields. Ride the buckets over, or walk the floor and learn their shifts. The pale fellow between the tracks freezes politely if you look at him - fine footing, while it lasts.");
  deco.add(w8CrystalCluster(95, -1.2, 1.1, W8PAL.crysA));   // amber crystals warm the landing (emissive fakes — the lantern is the real light)
  deco.add(w8CrystalCluster(106, 1.0, 0.7, W8PAL.crysA));

  // =============================== BEAT 5 — THE DRILL CROSSING (x 108..141): two shuttles + the sky road ===============================
  // Drill bands bite below y1.4 only — a tap-jump clears every pass; the frozen boo (block top ~2.03) and the
  // buckets are the two stands the bits can't reach. Tracks: A 112..123, B 129..138 — the safe strip between
  // worst bites is x124.7..127.3, readable and fixed.
  w8Drill(G, {x0:112, x1:123, y:0.7, period:4.6, phase:0.7});
  w8Drill(G, {x0:129, x1:138, y:0.7, period:5.2, phase:2.9});
  candyLine(G, [[114,0.9,0],[119,0.9,0],[123.5,0.9,0]], 3);   // the floor rhythm, traced
  candyLine(G, [[131,0.9,0],[135.5,0.9,0]], 2);
  // SNOW-BOO — haunts the safe strip (home 126): un-stared it drifts at your back while you count drill
  // shifts; stared, it freezes SOLID into the corridor's one standable refuge (sign-hinted, level-taught).
  G.ents.add(new SnowBoo(G, 126, 0, 0, {phase:0.3, speed:2.1, range:9, freezeMax:2.6}));
  // THE BUCKET LINE — the high road over BOTH drills (no warp here — this line's off-limits bucket is another
  // level's legend). Bottom-run seats at y3.4 (tops 3.62), a fresh seat rounds the near wheel every ~6.5s.
  // Boarding stairs sit just clear of drill A's worst bite (110.3); falling mid-crossing lands on the drill
  // floor — a heart, never a hole.
  w8BucketLine(G, {x0:112, x1:138, y:3.4, n:4, speed:2.2});
  platform(G, 107.6, 1.4, 0, 1.6, 1.6, W8PAL.timber);        // stair 1 (rise 1.4)
  platform(G, 109.4, 2.6, 0, 1.6, 1.6, W8PAL.timberD);       // stair 2 (rise 1.2; seat hop 1.0)
  candyLine(G, [[107.6,2.3,0],[109.4,3.5,0],[111.5,4.3,0]], 3);   // the boarding arc
  candyLine(G, [[120,4.4,0],[128,4.4,0],[136,4.4,0]], 3);         // the ride line
  platform(G, 140.8, 2.6, 0, 2.2, 1.8, W8PAL.timber);        // the dismount (drop from the seat; drill B's reach ends at 139.7 and can't bite this height)

  // =============================== BEAT 6 — THE COUNTERWEIGHT GALLERY (x 141..158): seesaw under moths ===============================
  // The pair shares one 5.6s clock: A (x146.75) and B (x152.25) counterweigh — board low (trough top 1.08,
  // tap), ride high (apex top 4.08). TWO Crystal Moths cross the airspace on fixed figure-eights; Rubblekin #2
  // pressures the boarding. Worst pocket = moth + moth + rubblekin = 3 systems.
  w8Seesaw(G, {x:149.5, gap:5.5, y0:2.3, amp:1.5, period:5.6, phase:0});
  G.ents.add(new CrystalMoth(G, 147.5, 3.4, 0, {phase:0.0, rx:3.2, ry:1.1, period:5.6, color:0x7ae8ff}));
  G.ents.add(new CrystalMoth(G, 154,   4.6, 0, {phase:2.0, rx:3.0, ry:1.1, period:6.4, color:0xb08aff}));   // crosses the GP leap lane — thread the eight
  G.ents.add(new Rubblekin(G, 144, 0, -0.3, {phase:1.8, wakeR:5.5, speed:1.7, lobP:3.2}));
  candyLine(G, [[145,1.2,0],[146.75,2.0,0]], 2);              // the boarding trace
  G.ents.add(new Crow(143, 0.95, 2.2));                       // mine crow #2 — unimpressed by counterweights
  signPost(G, 156.8, 1.7, 0.1, "Past here the ceiling sheds its shards in one long wave, west to east - walk WITH it, never against it. And mind the counterweights: the old lifts carry more than ore, for anyone bold at the top.");
  // THE GP BALCONY — Golden Pumpkin idx 2, skill-gated: leap from B's apex (top 4.08) across 2.75u onto the
  // crystal balcony (top 5.3) over the Shard-Fall's mouth. The candy arc IS the telegraph (double-jump line,
  // 1.22 rise — comfortably under the 3.0 double law); moth #2's eight crosses the lane on its fixed clock.
  platform(G, 158.2, 5.3, 0, 4.4, 2.2, W8PAL.rockL);
  candyLine(G, [[152.25,4.9,0],[154.6,5.8,0],[156.6,6.3,0]], 3);   // the arc off the apex
  candyLine(G, [[157.4,6.1,0],[159.6,6.1,0]], 2);
  { const gp = new GoldPumpkin(158.6, 6.3, 0, 2); G.ents.add(gp); }   // idx 2 — the balcony prize
  deco.add(w8CrystalCluster(160.1, -0.9, 1.0, W8PAL.crysV));         // balcony edge crystals (drop back down at 160)

  // =============================== BEAT 7 — THE SHARD-FALL (x 158..183): the mines' bombardment ===============================
  // TEN columns, ONE rolling wave: period 7.0s, phases step 0.7 west→east — exactly one column falls every
  // 0.7s, the wave sweeps at ~2.9u/s and wraps seamlessly. Every column keeps the full 0.7s shimmer + drip +
  // floor target-glow (the learned language); the safe strips between glows are always readable. Run WITH it.
  deco.add(w8l5Roof(162, 182.5, 6.6));
  for(let k=0;k<10;k++){
    G.ents.add(new SpikeIcicle(G, 163+k*2, 6.0, {period:7.0, phase:6.3-k*0.7, len:1.3}));
  }
  candyLine(G, [[164,0.9,0],[168,0.9,0],[172,0.9,0],[176,0.9,0],[180,0.9,0]], 5);   // the with-the-wave line
  // GRAVEL TRIPLET LANES — head-on rollers under the wave, both on ONE 5.0s period, half-offset: lane 1 rolls
  // 173→162 (runT 2.5 + pause 2.5), lane 2 rolls 182→173.2 (runT 2.0 + pause 3.0, phase 2.5) — the clocks
  // guarantee the two never coexist in the seam at ~173 (lane 2 dies at t=4.5+5n, lane 1 spawns at t=5n).
  // Tap clears the 0.8 crown (the owner's tap law). Mimic #3 guards the mouth among decoys.
  G.ents.add(new GravelTriplet(G, 173, 0, 0, {x1:162,   speed:4.4, phase:0.0, pause:2.5}));
  G.ents.add(new GravelTriplet(G, 182, 0, 0, {x1:173.2, speed:4.4, phase:2.5, pause:3.0}));
  deco.add(w8CrystalCluster(158.9, 0.9, 0.8, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 160.5, 0, 0.2, {phase:2.2, wakeR:2.6, color:0xb08aff}));
  deco.add(w8CrystalCluster(162.4, -0.8, 0.9, W8PAL.crysV));
  // BLIZZARD BAT #2 — the late air (patrol 171..176 at y5.4, between wave columns' hang line and the floor
  // fight). Worst instant anywhere in the run: falling column + one triplet + the bat = 3 systems (cap holds).
  G.ents.add(new BlizzardBat(G, 173.5, 5.4, 0, {phase:1.6, range:2.5, period:3.8, aggroR:4}));

  // =============================== BEAT 8 — THE GREAT DARK DOORS (x 183..192): exhale · the prop · the gate ===============================
  deco.add(w8l5Doors(190));
  signPost(G, 185.5, 1.7, -0.1, "He swallowed every light in the deep so no one could take his. Lanterns fix that.");
  deco.add(w8l5Canary(186.8, -1.5));         // the quiet prop — never signposted
  candyLine(G, [[184.5,0.9,0],[187,0.9,0]], 2);
  deco.add(w8CrystalCluster(184, 1.1, 0.9, W8PAL.crysA));
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(188.5, 3.6, -1); S.add(lamp); }   // the door's warm welcome — the exam ends in lantern-light
  exitGate(G, 190);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // FOREGROUND silhouettes (z>0): stalagmite teeth + a wrecked ore cart framing the depth
  for(const [fx,fh] of [[36,1.6],[72,2.1],[118,1.8],[167,2.3]]){
    const st = mesh('cone',[0.7,fh,5], mat(0x120d1e)); st.position.set(fx, fh*0.3, 2.7); deco.add(st);
  }
  { const wreck = mesh('box',[1.7,0.8,1.0], mat(0x120d1e)); wreck.position.set(97, 0.3, 2.6); wreck.rotation.z=0.5; deco.add(wreck);
    const ww = mesh('cyl',[0.24,0.24,0.12,8], mat(0x120d1e)); ww.rotation.x=Math.PI/2; ww.position.set(96.2, 0.9, 2.6); deco.add(ww); }
  S.add(bakeGroup(deco));

  w8Parallax(S, -8, 192);
  // manual clutter spans (w7l4 precedent): the crevasse must stay bare, and the drill floor + shard run stay
  // clean so machine tells and mimic glints never fight random glitter for the eye
  w8LevelFinish(G, -8, 192, null);
  w8Clutter(G, -8, 28, 'mine');
  w8Clutter(G, 59, 108, 'mine');
  w8Clutter(G, 142, 160, 'mine');
  w8Clutter(G, 183, 190, 'mine');

  return {spawnX: 0, exitX: 190};
}

function updateW8L5(G, dt){
  updateLevelCommon(G, dt);
}

W8_LEVELS.push({id:'w8l5', district:'w8', name:"PRISMUS'S THRESHOLD", build:buildW8L5, update:updateW8L5, parTime:195});

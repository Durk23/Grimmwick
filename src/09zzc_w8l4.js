// ============ LEVEL 8-4 — THE BOULDER RUN (District 8 · Frostmere · The Icicle Mines) ============
// POST-STORY MASTERY BAND (beyond District 5, main-game FAIR: hearts-always, telegraphs >=0.6s, <=4
// simultaneous threat systems, fixed clocks, one-good-run-away). 8-4 is the mines' AVALANCHE level: every
// FIVE HEARTBEATS the deep WHUMPS (both release chutes share ONE synchronized 5s clock — the whole level
// breathes on it) and a giant glowing crystal boulder comes bowling head-on down the gallery, rolling its
// whole run and dying at the end of it — the west gallery's balls thunder into THE COLLAPSE PIT, the east
// gallery's shatter against the boulder graveyard at the breach. The learned counters, now glowing:
// double-jump it (3.3 apex vs the 2.4 crown), spin-shatter it (candy), or stomp-RIDE it (bounce ~vy 10.5).
// 14 threats: 2 Knocker Sprites + 3 Gem Mimics + 2 Rubblekins + 1 Crystal Moth + 2 Blizzard Bats +
// 2 crystal drills + 1 stalactite arch + the avalanche clock itself (two synchronized chutes).
// NO Golden Pumpkin (8-4 keeps none), NO warp (the Off-Limits Bucket lives in another level), NO Leap of
// Faith (both of the game's two are placed and sacred).
//
//   BEAT 1 THE MINEHEAD             x -8..24     — CP0 (noLight). The Glimmering Geode in its clear pocket,
//          a shield lantern, the WHUMP sign, and the quiet prop waiting beside the track. Nothing rolls here.
//   BEAT 2 THE COLLAPSE PIT + INTRODUCE  x 24..58 — the pit (4.5u, held-comfy) where every west-gallery
//          boulder ends; read the count from the SAFE lip, watching them die, then cross into open gallery
//          floor: dodge the boulder ONLY. A Rubblekin keeps the ground honest, a Crystal Moth owns the air.
//   BEAT 3 THE ORE LINE (TWIST)     x 58..91     — boulders + cart lines: chain-hung loading docks (top 2.9,
//          a candy-traced double) board two rail-cart routes at y2.5 — hop a cart and let the ball pass
//          beneath (rider feet 3.75 vs the 2.4 crown). A Blizzard Bat contests the line; Rubblekin #2 makes
//          the low road pay attention. Junction itch: the ride-candy at y4.7 is visible from the floor.
//   BEAT 4 THE LANTERN LANDING      x 91..108    — the breath between galleries (lane A releases at 93 and
//          rolls WEST; lane B dies at 106): THE lantern (x99, ~54% — the level's ONE lit checkpoint), a
//          heart, the timber scaffold + ladder climb (bat-wings lantern on the deck, sightline east), and
//          the boulder graveyard where lane B's balls burst.
//   BEAT 5 THE DEEP WORKINGS (ESCALATE) x 108..144 — boulders + drill tracks + knocker faces: a stalactite
//          arch welcomes you in, two drills walk their slots on the 5s clock, and the roof KNOCKS — tap,
//          tap, TAP — then reaches down at the knock point. Jump the drills LOW; save the double. Old
//          chains hang from the shelves: the roof has handles when the floor is busy.
//   BEAT 6 THE LONG GALLERY (MASTER) x 144..170  — boulder rhythm + the amber shard bed (three segments,
//          two clean pockets) + the WHUMP-synced counterweight seesaw riding above it + gem-mimic pockets
//          flanking the landings, candy tracing the surviving line. Bat #2 owns the sprint out.
//   BEAT 7 THE CLOCK-OUT (exhale · gate) x 170..183 — pass under lane B's chute on the count (the amber
//          landing-glow marks the drop), the sendoff sign, the gate.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the gallery floor end to end, counting WHUMPs · HIGH =
// docks → carts (twist) and the seesaw sky-ride (master — its candy halo reads from the shard bed) ·
// EXPERT = stomp-RIDE the boulders (sign 1 winks at it, never required) + the chain-hangs + a continuous
// cart-line run. Comparable heights: main-route rises <=1.8 (none over a step) · dock tops 2.9 and seesaw-low
// 2.78 are candy-traced DOUBLE routes (<=3.0 law, 0.4+ under the 3.3 apex) · dock→cart 0.85 tap ·
// pit gap 4.5 held (<=5.5) · shard-segment hops 3.2-3.4 tap (<=4) · seesaw transfer edge-gap 4.0 with a
// 2.4 drop · everything higher is contraption/climb-gated with the verb traced.
// HEARTS ALWAYS: boulder contact = 1 heart + away-knockback; the pit is the kit's full price (heart +
// lantern walk-back, pitDressing 'winter'); drills/knockers/shards/mimics/pebbles all cost exactly 1.
// DETERMINISM: both chutes ride ONE fixed 5s clock from level start (firstAt 1.6 — synchronized WHUMP);
// drills period 5, seesaw period 5 (the level breathes together); knockers burst at their FIXED far-end
// knock points (x 124 / 139.5) on fixed periods; every enemy carries a fixed phase; NO Math.random on the
// critical path (rand() only inside baked deco, kit-standard).
//
// ---- THE BORE-GAUGE BOULDER (why r is 1.2, not w6's 1.4): the mines' galleries are machine country. At
// r 1.2 the crown (2.4) passes UNDER the y2.5 rails, cart bellies (2.55), dock slabs (2.6) and seesaw
// low-point (2.5) with zero clip, and every in-lane solid top sits above the ball's groundHeight window
// (center 1.2 + 0.5 + 0.6 = 2.3) so a rolling ball can never vault onto a dock or platform. One gauge,
// zero jank — and a tighter bore reads right for a bored tunnel. ----
// ---- THE HONEST CROWN (why updateW8L4 normalizes headH): AvalancheBall ships headH = r*2, which puts the
// base touch window 1.05u ABOVE the visible crown — a dock/cart rider at 2.9/3.75 would be bitten by a
// ball they visibly cleared. headH = r+0.15 makes the bite window top EXACTLY the crown (2.4) and drops
// the stomp window onto the visible top (feet 2.2..3.1) — riding reads true, stomping reads true. The
// grounded-bite assist (w7l4 precedent) keeps floor-standers honest with a feet-below-center cap so a
// player on a dock is never phantom-hit. ----
// ---- BALL-TERRITORY LAW (this file's collider audit): lane A owns x<=91.5, lane B owns 106.4..172.6;
// inside those spans NO solid collider keeps a top in (0, 2.3] at z crossing 0 (vault jank), and NO solid
// underside sits below 2.4 (clip jank). In-lane solids: docks 2.6..2.9 ✓ · cart movers min 3.5 ✓ ·
// seesaw movers min 2.5 ✓ · chains/ladder are 'climb' type (balls ignore) ✓ · shard beds are 'hazard'
// (balls ignore) ✓ · scaffold deck (3.7..4.2) lives in the safe pocket anyway ✓. ----

// ---- THE RELEASE CHUTE (baked deco — the boulders need a visible SOURCE): a timber headframe over the
// lane, a tilted steel chute, a violet corruption-ring at the mouth, tomorrow's rounds waiting by the
// legs, and an amber machine-lamp. The WHUMP fires on release; the drop zone below wears a growing AMBER
// target-glow (the mines' machines warn in amber — drill sparks, dock lamps, this) for ~0.7s before AND
// during every fall. The mortar idiom, learned long ago, kept honest underground. ----
function w8l4Chute(x){
  const g = new THREE.Group();
  for(const s of [-1,1]){
    const leg = mesh('box',[0.3,6.2,0.34], mat(W8PAL.timberD)); leg.position.set(x+s*1.2, 3.1, -1.7); leg.rotation.z = -s*0.07; g.add(leg);
    const foot = mesh('box',[0.7,0.3,0.7], mat(W8PAL.rockD)); foot.position.set(x+s*1.35, 0.15, -1.7); g.add(foot);
  }
  const cross = mesh('box',[3.2,0.28,0.3], mat(W8PAL.timber)); cross.position.set(x, 6.2, -1.7); g.add(cross);
  const chute = mesh('box',[2.1,0.2,1.5], mat(W8PAL.steel)); chute.position.set(x, 6.0, -0.8); chute.rotation.x = 0.52; g.add(chute);
  const ring = mesh('tor',[0.85,0.07,5,14], emat(W8PAL.crysV, W8PAL.crysV, 0.7)); ring.rotation.x = Math.PI/2; ring.position.set(x, 5.7, -0.1); g.add(ring);
  const b1 = mesh('sph',[0.85,10,8], emat(0x4a4058, W8PAL.crysV, 0.3)); b1.position.set(x+1.95, 0.7, -2.0); g.add(b1);
  const b2 = mesh('sph',[0.7,10,8], emat(0x4a4058, W8PAL.crysV, 0.25)); b2.position.set(x-2.0, 0.58, -2.1); g.add(b2);
  const lamp = mesh('sph',[0.11,6,5], emat(W8PAL.crysA, W8PAL.crysA, 1)); lamp.position.set(x, 6.5, -1.6); g.add(lamp);
  return g;
}

// ---- THE QUIET PROP: a pyramid of crystal spheres stacked with terrible care beside the track, and a
// slate propped against it, scratched edge to edge with tally rows — 4,999. Somebody down here was one
// sphere short of five thousand and stopped counting forever. Never signposted; fully baked; the count
// stays unfinished. ----
function w8l4Tally(x, z){
  const g = new THREE.Group();
  const cm = new THREE.MeshLambertMaterial({color:0xd8ecff, emissive:0x8ab8e0, emissiveIntensity:0.3});
  for(const [n, y] of [[3,0.2],[2,0.52],[1,0.83]]){
    for(let i=0;i<n;i++){
      const s = new THREE.Mesh(geo('sph',0.2,8,7), cm);
      s.position.set(x + (i-(n-1)/2)*0.38, y, z + (3-n)*0.05);
      g.add(s);
    }
  }
  const slate = mesh('box',[0.62,0.46,0.05], mat(0x2a2436)); slate.position.set(x+0.78, 0.3, z+0.32); slate.rotation.z = -0.16; slate.rotation.y = 0.32; g.add(slate);
  for(let i=0;i<5;i++){ // the tally scratches — rows and rows, and the last row one mark short
    const sc = mesh('box',[0.1,0.018,0.012], mat(0xbcd2e8));
    sc.position.set(x+0.66+(i%2)*0.17, 0.44-Math.floor(i/2)*0.11, z+0.35); sc.rotation.z = (i%2? 0.55:-0.08); sc.rotation.y = 0.32; g.add(sc);
  }
  const dust = mesh('sph',[0.55,7,5], mat(W8PAL.rockD)); dust.scale.y=0.2; dust.position.set(x, 0.03, z); g.add(dust);
  return g;
}

// ---- THE LOADING DOCK: a chain-hung timber slab over the lane — the ore line's boarding step and a
// standing boulder-refuge. Slab top 2.9 (candy-traced double route, 0.4 under the 3.3 apex), underside 2.6
// (the 2.4 crown clears by 0.2), top above the ball's 2.3 ground window (no vault). Gantry legs at z±1.5
// clear the ball's 1.2 half-width. ----
function w8l4Dock(G, deco, x){
  G.world.addBox(x, 2.6, 0, 1.6, 0.3, 1.7, {});
  const slab = mesh('box',[1.6,0.3,1.7], mat(W8PAL.timber)); slab.position.set(x, 2.75, 0); deco.add(slab);
  const lip = mesh('box',[1.66,0.06,1.76], mat(W8PAL.timberD)); lip.position.set(x, 2.93, 0); deco.add(lip);
  for(const s of [-1,1]) for(const zz of [-1.5,1.5]){
    const leg = mesh('box',[0.24,4.9,0.28], mat(W8PAL.timberD)); leg.position.set(x+s*0.55, 2.45, zz); deco.add(leg);
  }
  for(const s of [-0.55,0.55]){ const beam = mesh('box',[0.26,0.26,3.3], mat(W8PAL.timber)); beam.position.set(x+s, 4.85, 0); deco.add(beam); }
  for(const hx of [-0.55,0.55]) for(const hz of [-0.6,0.6]){
    const chain = mesh('cyl',[0.03,0.03,1.95,4], mat(0x1a1626)); chain.position.set(x+hx, 3.9, hz); deco.add(chain);
  }
  const lamp = mesh('sph',[0.1,6,5], emat(W8PAL.crysA, W8PAL.crysA, 0.9)); lamp.position.set(x, 3.35, 0.7); deco.add(lamp);
}

// ---- THE KNOCKER SHELF: a rock overhang (bottom 4.8 — a 3.3 double's head at 4.55 clears by 0.25) for a
// ceiling Knocker Sprite to live in, posts at z-1.4 (inner face -1.25 vs the ball's 1.2 bulge — no graze),
// cold-blue hanging crystals so the shelf reads as rock, never as treasure. ----
function w8l4Shelf(deco, x1, x2){
  const cx=(x1+x2)/2, w=x2-x1;
  const slab = mesh('box',[w,0.5,1.8], mat(W8PAL.rockL)); slab.position.set(cx, 5.05, -0.4); deco.add(slab);
  for(const px of [x1+0.3, x2-0.3]){ const post = mesh('box',[0.3,4.8,0.3], mat(W8PAL.timberD)); post.position.set(px, 2.4, -1.4); deco.add(post); }
  for(let i=0;i<3;i++){ const cr = mesh('cone',[0.18,0.7,5], emat(W8PAL.crysC, W8PAL.crysC, 0.5)); cr.rotation.x=Math.PI; cr.position.set(x1+1+i*((w-2)/2), 4.5, -0.9); deco.add(cr); }
}

// ---- THE AMBER SHARD BED: the master gallery's hazard crystal — HOT AMBER, tall, jagged, matching its
// hitbox (thornsX law: box inset 0.2, height 0.55 — bites only where shards stand; a tap clears it).
// Deco crystals everywhere else are small cold cyan/violet: hazard reads distinct at a glance. Balls
// ignore hazard boxes and simply grind through the tips — they're a boulder. ----
function w8l4Shards(G, deco, x1, x2){
  G.world.addBox((x1+x2)/2, 0, 0, (x2-x1)-0.4, 0.55, 2.6, {type:'hazard', damage:1});
  const hotM = emat(W8PAL.crysA, 0xff9a3e, 0.85);
  for(let i=0;i<Math.floor((x2-x1)*3);i++){
    const sh = new THREE.Mesh(geo('cone', rand(0.09,0.16), rand(0.5,0.85), 5), hotM);
    sh.position.set(rand(x1+0.25,x2-0.25), 0.26, rand(-1.2,1.2)); sh.rotation.z = rand(-0.3,0.3);
    deco.add(sh);
  }
}

function buildW8L4(G){
  const S = G.scene;
  levelBegin(G);

  const ROCK = W8PAL.rock;
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE MINEHEAD (x -8..24) ===============================
  groundX(G, -8, 24, ROCK);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  // SPAWN SAFETY (idle player at x0/z0, CP0 respawn at x2): lane A boulders' bite is cut at the pit's east
  // lip 28.5 — worst touch reach 28.5-1.14 = 27.4 → 25.4u clear · lane B never exists west of 106.4 ·
  // Rubblekin #1 reach 44-(5.5+4) = 34.5 → 32.5u · moth min 48.8 · bat #1 trigger-drift min 58.5 · the
  // Geode's opt-in mimic nest spawns at 11.9..17.1 with wakeR 9 — wake edge 11.9-9 = 2.9, so a player
  // idling AT CP0 (x2) sits outside it; every snap carries its own 0.6s glint besides. All clear.
  deco.add(w8TimberFrame(4));               // the minehead shoring, with the last warm lamp on it
  { const lamp = new THREE.PointLight(0xffb85e, 26, 9); lamp.position.set(4, 3.2, -1); S.add(lamp); }
  { const lg = mesh('sph',[0.12,6,5], emat(0xffd98a, 0xffb85e, 1)); lg.position.set(4, 3.3, -1.2); deco.add(lg); }
  signPost(G, 6, 1.7, -0.12, "THE BOULDER RUN. Every fifth heartbeat the deep goes WHUMP and bowls one down the gallery. Hop it, crack it with a well-timed spin, or ride its back like the old haulers did. Rule of the run: count to five, then move.");
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 2);
  // THE GLIMMERING GEODE — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math, geode
  // x14.5): lane A boulder touch reach 27.4 → 12.9u clear (>=6u law honored 2x over) · Rubblekin #1 reach
  // 34.5 → 20u · moth 48.8 → 34.3u · bat #1 58.5 → 44u · mimics all >=140 · knockers/drills >=114. The
  // nest ambush (30%) spawns ON the geode's own ring with the kit's 1s grace + staggered 0.6s glints —
  // opening is a deliberate safe act; the gamble is the CHOICE.
  { const gd = new GlimmeringGeode(14.5, 0, -1.1, 0.3); G.coffins.push(gd); G.ents.add(gd); }
  G.ents.add(new BonkLantern(G, 21, 1.6, 0, 'shield'));       // armor before the exam — last ball-free spot
  // THE QUIET PROP (never signposted): the sphere pyramid and the slate that reads 4,999
  deco.add(w8l4Tally(19.5, -2.3));
  G.ents.add(new Crow(22, 0.95, 2.1));      // mine crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE COLLAPSE PIT + INTRODUCE (x 24..58) ===============================
  // THE PIT (24..28.5): where every west-gallery boulder ends — they tumble the lip and the collapse
  // swallows them (endX 27: the bite cuts at 28.5, EXACTLY the east lip, so a dying ball can never clip a
  // crosser; it bursts loot-free at the pit mouth). 4.5u = a held jump with margin. The sign sits on the
  // SAFE west lip: read, watch a boulder die, learn the count — the junction sightline IS the lesson.
  signPost(G, 22, -1.7, 0.15, "The floor gave way in the year of the long shift - now every boulder the deep throws ends up down there. Watch one go. Count the WHUMPs while you watch. Then cross like you mean it.");
  pitDressing(G, 24, 28.5, 'winter');
  candyLine(G, [[21.5,0.9,0],[24,1.2,0],[26.3,2.2,0],[29.3,0.9,0]], 4);   // the held-jump arc, traced
  groundX(G, 28.5, 186, ROCK);              // the gallery proper — one flat run to the gate (flat is the boulder level's law)
  // INTRODUCE: open floor, ball only. Learn the three counters before the machines arrive.
  candyLine(G, [[33,0.9,0],[37,0.9,0],[41,0.9,0]], 3);
  G.ents.add(new Rubblekin(G, 44, 0, 0, {phase:0.5, wakeR:5.5, speed:1.6, lobP:3.4}));   // ground pressure — no camping between WHUMPs
  candyLine(G, [[46.5,0.9,0],[48.5,2.9,0],[50.5,0.9,0]], 3);              // the double-over-the-ball arc, traced
  G.ents.add(new CrystalMoth(G, 52, 3.6, 0, {phase:0.8, rx:3.2, ry:1.1, period:5.2, color:0x7ae8ff}));  // the air lane exists — look up before you leap (sweep 2.5..4.7, clear of the 2.4 crown)
  G.ents.add(new Crow(57, 0.95, 2.3));      // mine crow #2 — staring down the ore line (the house tell)

  // =============================== BEAT 3 — THE ORE LINE (x 58..91): TWIST — carts over the lane ===============================
  // Two chain-hung docks board two cart routes at rail y2.5: rider feet 3.75, cart belly 2.55, rail tops
  // 2.56 — the 2.4 crown clears ALL of it with zero clip, and dock/cart tops sit above the ball's 2.3
  // ground window so nothing vaults. Standing on a dock or cart = boulder-proof; the ground below stays
  // the honest low road. Cart clocks: 10.6u/2.6 and 7.6u/2.6 shuttles, fixed from level start.
  w8l4Dock(G, deco, 59.5);
  signPost(G, 57.8, -1.5, 0.1, "THE ORE LINE. The carts mind their own business, two heads above the trouble. The boulders keep the floor. Stand on the one and forgive the other.");
  candyLine(G, [[58.4,1.3,0],[59.0,2.7,0],[59.5,3.7,0]], 3);              // the boarding double, traced (arc ends above the slab top 2.9)
  w8Rails(G, 61, 74, 2.5);
  w8Cart(G, {x0:62.2, x1:72.8, y:2.5, speed:2.6, phase:0});
  candyLine(G, [[63.5,4.7,0],[67.5,4.7,0],[71.5,4.7,0]], 3);              // the ride line — visible from the floor (junction itch)
  candyLine(G, [[65,0.9,0],[69,0.9,0],[73,0.9,0]], 3);                    // the low road keeps its own rhythm
  // BLIZZARD BAT #1 — contests the cart lane (patrol 65..70 at y5.4; squeak telegraph, snapshot dive).
  // Trigger-drift reach 58.5..76.5: never west of the geode law, never near the lantern (22.5u short).
  G.ents.add(new BlizzardBat(G, 67.5, 5.4, 0, {phase:0.5, range:2.5, period:3.6, aggroR:4}));
  w8l4Dock(G, deco, 76);                                                  // the transfer dock between routes
  candyLine(G, [[75.6,1.6,0],[76.4,3.4,0]], 2);
  w8Rails(G, 78, 88, 2.5);
  w8Cart(G, {x0:79.2, x1:86.8, y:2.5, speed:2.6, phase:1.4});
  candyLine(G, [[80.5,4.7,0],[83.5,4.7,0],[86.5,4.7,0]], 3);
  // RUBBLEKIN #2 — assembles under the second span: the low road pays attention while riders glide.
  // Reach 82+(5.5+4) = 91.5 → 7.5u short of the lantern pocket. Its pebble apex (~2.0) never reaches a rider.
  G.ents.add(new Rubblekin(G, 82, 0, 0, {phase:1.3, wakeR:5.5, speed:1.8, lobP:3.0}));
  candyLine(G, [[81,0.9,0],[86,0.9,0]], 2);

  // =============================== BEAT 4 — THE LANTERN LANDING (x 91..108): the breath ===============================
  // LANE A's CHUTE — released at (93, 4.6): a 0.6s fall (>=0.6s telegraph law) under the WHUMP and the
  // growing amber LANDING-glow. The ball keeps its 5u/s throw while falling, drifts 2.97 and lands at
  // ~90.0 — cart 2's east edge (87.75) stays 1.1u clear of the low-fall bite window (91.7..90.0). Crossers
  // leaving the ore line pass under the throw: the glow disc marks the LANDING, and the 5-count makes
  // "don't dawdle under the chute" an honest lesson, not a trap.
  deco.add(w8l4Chute(93));
  const spA = new CrystalBoulderSpawner(G, {x:93, y:4.6, dir:-1, speed:5, r:1.2, period:5, firstAt:1.6, endX:27});
  G.ents.add(spA);
  const discA = new THREE.Mesh(geo('circ',1.4,16), new THREE.MeshBasicMaterial({color:W8PAL.crysA, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
  discA.rotation.x = -Math.PI/2; discA.position.set(90.1, 0.12, 0); S.add(discA);   // at the LANDING x, not the release x
  // THE lantern — the level's ONE lit checkpoint (x99 of a 183u run ≈ 54%). Rest-pocket math, idle player
  // at 99/z0 (side-mode damps z to 0 — safety is pinned in X, never in z): lane A balls live only west of
  // their release 93, and can bite a grounded player only after landing → worst reach 90.0+1.14 = 91.1
  // (7.9u clear) · lane B balls die at endX 106, bite cut at 107.5 → worst reach 106.4 (7.4u) · stalactite
  // arch danger edge 110.1 (11.1u) · drill #1 reach min 114.3 (15.3u) · knocker bursts at 124/139.5 (25u+)
  // · mimic #1 zone min 140.2 (41u) · bat #1 worst trigger-drift 76.5 (22.5u), bat #2 min 161.5 (62u) ·
  // Rubblekin #2 reach 91.5 (7.5u) · moth max 55.2 (44u). The pocket is a true breath.
  G.ents.add(new Checkpoint(99, 0, 1.6, 1));
  G.ents.add(new Heart(101.5, 1.0, 0));
  candyLine(G, [[95.5,0.9,0],[97.5,0.9,0]], 2);
  signPost(G, 97, 0.15, -0.1, "Past the boulder graveyard the drills walk their slots, and the rock overhead KNOCKS - tap, tap, TAP - then it reaches down where it knocked. Three knocks is one breath. Spend it somewhere else. The old chains still hold: when the floor is busy, the roof has handles.");
  // THE SCAFFOLD — the mines' timber climb (mandated flavor): ladder volume up the west face, deck at 4.2
  // with the bat-wings lantern and the sightline east over the deep workings. Lives wholly inside the safe
  // pocket (91.5..106.4), so its legs can stand on the floor without ever meeting a ball.
  platform(G, 103, 4.2, 0, 2.6, 1.7, W8PAL.timber);
  G.world.addBox(101.4, 0, 0, 0.7, 4.2, 1.1, {type:'climb'});
  { // visible ladder + deck legs (deco)
    for(const s of [-0.35,0.35]){ const rail = mesh('box',[0.07,4.3,0.07], mat(W8PAL.timber)); rail.position.set(101.4, 2.15, s); deco.add(rail); }
    for(let i=0;i<9;i++){ const rung = mesh('cyl',[0.035,0.035,0.8,5], mat(W8PAL.timberD)); rung.rotation.x = Math.PI/2; rung.position.set(101.4, 0.4+i*0.45, 0); deco.add(rung); }
    for(const [lx,lz] of [[101.9,-0.7],[101.9,0.7],[104.1,-0.7],[104.1,0.7]]){
      const leg = mesh('box',[0.22,3.7,0.24], mat(W8PAL.timberD)); leg.position.set(lx, 1.85, lz); deco.add(leg);
    }
  }
  G.ents.add(new BonkLantern(G, 103, 5.5, 0, 'bat'));         // the deck prize: 18s of wings for the deep workings
  candyLine(G, [[101.6,2.6,0],[103,5.2,0]], 2);               // the ladder, traced
  // THE BOULDER GRAVEYARD — where lane B's balls die (endX 106): shattered rounds and violet shards heaped
  // at the breach. The east gallery announces itself by its dead.
  for(let i=0;i<4;i++){
    const half = mesh('sph',[rand(0.5,0.8),8,6], emat(0x4a4058, W8PAL.crysV, 0.2));
    half.scale.y = 0.5; half.position.set(104+i*1.15, 0.15, (i%2? 1.2:-1.1)); deco.add(half);
    const shard = mesh('cone',[0.16,rand(0.5,0.9),5], emat(W8PAL.crysV, W8PAL.crysV, 0.5));
    shard.position.set(104.5+i*1.0, 0.3, (i%2? -0.7:0.8)); shard.rotation.z = rand(-0.4,0.4); deco.add(shard);
  }
  G.ents.add(new Crow(107.5, 0.95, 2.2));   // mine crow #3 — perched over the graveyard, marking the edge
  signPost(G, 104.5, -0.2, 0.1, "In the long gallery: the AMBER shards are hungry - the cold blue ones only glitter. The counterweights breathe with the mountain, five beats a side. And if a crystal winks at you... it isn't a crystal.");

  // =============================== BEAT 5 — THE DEEP WORKINGS (x 108..144): ESCALATE ===============================
  // THE STALACTITE ARCH — two crystal icicles on staggered clocks (shimmer + drip + growing floor-glow,
  // the learned language) welcome you into ball territory. Pinch here: ball + icicle = 2.
  { const lintel = mesh('box',[5.2,0.6,1.6], mat(W8PAL.rockL)); lintel.position.set(111.7, 5.55, -0.5); deco.add(lintel);
    for(const px of [109.6,113.8]){ const pil = mesh('box',[0.5,5.3,0.6], mat(W8PAL.rockD)); pil.position.set(px, 2.65, -1.35); deco.add(pil); } }
  G.ents.add(new SpikeIcicle(G, 110.6, 5.0, {period:4.6, phase:0.6, len:1.15}));
  G.ents.add(new SpikeIcicle(G, 112.8, 5.0, {period:5.4, phase:2.3, len:1.15}));
  candyLine(G, [[110,0.9,0],[112,0.9,0]], 2);                 // the slalom line, between the drop columns
  // DRILL #1 — walks its slot 116..126 on the 5s heartbeat (bit reach 114.3..127.7, bite zone feet 0..1.4:
  // any jump clears it). KNOCKER #1 lives in the shelf above (glide 117..124, knock+burst ALWAYS at x124 —
  // the fixed far end of its glide, 0.9s of audible taps first): its down-lunge bites feet 3.15..5.15, so
  // jump the drill LOW at the knock spot and save the double — the candy at y2 traces exactly that.
  // Composed pinch: ball + drill + knocker = 3 (cap 4 holds with headroom).
  w8Drill(G, {x0:116, x1:126, y:0.7, period:5, phase:1.2});
  w8l4Shelf(deco, 117, 124.5);
  G.ents.add(new KnockerSprite(G, 120.5, 4.4, 0, {x0:117, x1:124, wallY:4.4, period:6.5}));
  w5Chain(G, 119.5, 2.6, 4.5);                                // hangs from the shelf — the roof's handle (links start at 2.6, above the 2.4 crown; balls ignore climb volumes)
  candyLine(G, [[117.5,2.0,0],[121,2.0,0],[124.5,2.0,0]], 3); // stay-low singles, traced under the knocks
  G.ents.add(new Candy(119.5, 4.3, 0));                       // one on the chain — the handle, telegraphed
  // the between-drills pocket (127.7..130.3) — one breath, one heart
  G.ents.add(new Heart(129, 1.0, 0));
  candyLine(G, [[128.3,0.9,0],[129.9,0.9,0]], 2);
  // DRILL #2 + KNOCKER #2 — same lesson, offset clocks (drill phase 3.7 weaves against #1; knocker knocks
  // at x139.5, period 7): the exit of the workings is a low-jump reading exam under the boulder rhythm.
  w8Drill(G, {x0:132, x1:142, y:0.7, period:5, phase:3.7});
  w8l4Shelf(deco, 133, 140.5);
  G.ents.add(new KnockerSprite(G, 136, 4.4, 0, {x0:133.8, x1:139.5, wallY:4.4, period:7, phase:2.5}));
  w5Chain(G, 134.5, 2.6, 4.5);
  candyLine(G, [[133.5,2.0,0],[137,2.0,0],[140.5,2.0,0]], 3);
  G.ents.add(new Candy(134.5, 4.3, 0));

  // =============================== BEAT 6 — THE LONG GALLERY (x 144..170): MASTER ===============================
  // The full composition: the amber shard bed in three segments (148..151.2 · 152.8..156.2 · 157.8..160.5,
  // clean 1.6u pockets between), the counterweight seesaw riding the WHUMP clock above it, gem mimics
  // seeded in the crystal gardens at the landings, and the boulder rhythm through all of it. Candy traces
  // the surviving line. Worst pinches (audited): approach 140.2..143.7 = ball + drill#2 + mimic#1 = 3 ·
  // pockets = ball + shards + mimic = 3 · sprint 161.5..169.5 = ball + mimic#3 + bat#2 = 3. Never 4.
  // GEM MIMIC #1 — seeded in the west garden (violet, like its decoys; the GLINT is the tell, taught by
  // the sign). Zone 140.2..152.2 (wake 2.6 + 3.4 snap).
  deco.add(w8CrystalCluster(144.6, 0.8, 0.5, W8PAL.crysV));
  deco.add(w8CrystalCluster(145.2, -0.9, 0.7, W8PAL.crysV));
  deco.add(w8CrystalCluster(146.9, 1.2, 0.6, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 146.2, 0, 0.3, {phase:0.4, wakeR:2.6}));
  candyLine(G, [[146.5,0.9,0],[149.6,2.2,0],[152,0.9,0]], 3); // hop segment 1 into pocket 1, traced
  w8l4Shards(G, deco, 148, 151.2);
  // THE SEESAW — period 5, phased so platform A scoops LOW at its boarding pocket ~0.8s AFTER each ball
  // passes its x (ball crosses x151.4 at t≡0.72 mod 5; A bottoms at t≡1.55): board on the WHUMP's heels.
  // Geometry: y0 3.7 amp 1.2 → low top 2.78 (candy-traced double from the pocket), high top 5.18, underside
  // never below 2.5 (crown 2.4 clears; low top 2.78 > the 2.3 ground window — balls can't vault it, and a
  // rider at 2.78+ sits above the 2.4 bite window: the ride is ALWAYS boulder-proof; the risk lives in the
  // boarding and the pockets, which is the point). Transfer: A-high → B-low, 4.0u edge gap with a 2.4 drop.
  w8Seesaw(G, {x:154.4, gap:6, y0:3.7, amp:1.2, period:5, phase:2.2});
  candyLine(G, [[151.9,2.0,0],[151.4,3.5,0]], 2);             // the boarding double, traced
  candyLine(G, [[154.4,5.9,0],[157.4,4.2,0]], 2);             // the sky halo — visible from the bed (junction itch)
  w8l4Shards(G, deco, 152.8, 156.2);
  // GEM MIMIC #2 — one cold crystal sitting IN the amber bed (the odd one out — the sign's wink). Wakes as
  // you hop segment 2 overhead; its snap carries it INTO pocket 2 (lands ~158.2, clean ground), where its
  // 1.1s rest is the stomp window — the loop polices the pocket without ever asking you to fight in shards
  // (from the pocket edge, spin reach ~2.1 also answers it). Zone 148.8..160.8 (west of bat #2's 161.5).
  deco.add(w8CrystalCluster(153.9, 0.9, 0.55, W8PAL.crysV));
  deco.add(w8CrystalCluster(155.8, -1.1, 0.6, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 154.8, 0, -0.3, {phase:1.1, wakeR:2.6}));
  candyLine(G, [[156.9,0.9,0],[159.1,2.2,0],[161.3,0.9,0]], 3);   // pocket 2 → over segment 3 → out
  w8l4Shards(G, deco, 157.8, 160.5);
  // GEM MIMIC #3 — the east garden: you're past the bed, you relax, a crystal winks. Zone 157.5..169.5.
  deco.add(w8CrystalCluster(162.4, -1.0, 0.7, W8PAL.crysV));
  deco.add(w8CrystalCluster(164.3, 1.1, 0.8, W8PAL.crysV));
  deco.add(w8CrystalCluster(165.1, -0.6, 0.5, W8PAL.crysV));
  deco.add(w8CrystalCluster(162.8, 0.9, 0.55, W8PAL.crysV));
  G.ents.add(new GemMimic(G, 163.5, 0, 0.3, {phase:1.8, wakeR:2.6}));
  // BLIZZARD BAT #2 — owns the sprint-out airspace (patrol 166..171 at y5.4, trigger reach from 161.5:
  // east of the shard bed's 160.5 tail, so the bed never sits under a dive).
  G.ents.add(new BlizzardBat(G, 168.5, 5.4, 0, {phase:1.7, range:2.5, period:3.8, aggroR:4.5}));
  candyLine(G, [[164,0.9,0],[166.5,0.9,0]], 2);               // the contested sprint, traced

  // =============================== BEAT 7 — THE CLOCK-OUT (x 170..183): exhale, chute, gate ===============================
  // LANE B's CHUTE — released at (172, 4.6): same synchronized WHUMP, same amber landing-glow (the idiom
  // was learned at lane A). The 2.97 throw-drift lands the ball at ~169.0; a grounded walker east of 170.1
  // is untouchable, and the disc + the count make passing under the throw the level's final small exam.
  deco.add(w8l4Chute(172));
  const spB = new CrystalBoulderSpawner(G, {x:172, y:4.6, dir:-1, speed:5, r:1.2, period:5, firstAt:1.6, endX:106});
  G.ents.add(spB);
  const discB = new THREE.Mesh(geo('circ',1.4,16), new THREE.MeshBasicMaterial({color:W8PAL.crysA, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
  discB.rotation.x = -Math.PI/2; discB.position.set(169.1, 0.12, 0); S.add(discB);
  signPost(G, 177.5, -1.7, 0.12, "End of the run. The deep kept throwing; you kept running. The old crews would have tipped their hardhats. Clock out, hauler.");
  candyLine(G, [[176.5,0.9,0],[179,0.9,0]], 2);
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(181.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 183);
  // real lights: minehead + geode + CP1 + gate = 4 (<=6; every crystal elsewhere is an emissive fake)

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // gallery shoring — timber frames pacing the whole run (z-1.6, behind the ball's bulge)
  for(const fx of [34, 46, 70, 84, 109, 128, 147, 166]) deco.add(w8TimberFrame(fx));
  // big cold background crystals (|z|>=2 — never amber, never in reach: hazard stays distinct)
  deco.add(w8CrystalCluster(31, -2.2, 1.6, W8PAL.crysC));
  deco.add(w8CrystalCluster(49, -2.4, 1.3, W8PAL.crysV));
  deco.add(w8CrystalCluster(95.5, -2.1, 1.8, W8PAL.crysC));
  deco.add(w8CrystalCluster(143, -2.3, 1.5, W8PAL.crysC));
  deco.add(w8CrystalCluster(174.5, -2.2, 1.2, W8PAL.crysV));
  // FOREGROUND silhouettes (z>0): stalagmite teeth + a dead ore cart framing the depth
  for(const [fx,fr] of [[38,0.3],[88,-0.3],[126,0.35],[158,-0.25]]){
    const tooth = mesh('cone',[0.9,2.2,5], mat(0x140f22)); tooth.position.set(fx, 0.8, 2.7); tooth.rotation.z = fr*0.3; deco.add(tooth);
  }
  { const dc = mesh('box',[1.6,0.9,1.2], mat(0x18131f)); dc.position.set(112, 0.4, 2.9); dc.rotation.z = 0.5; deco.add(dc); }
  S.add(bakeGroup(deco));

  // level-local glue handles for updateW8L4 (rebuilt fresh every switchArea — area-stamped against stale reads)
  G._w8br = { area:G.area, drops:[ {x:93, sp:spA, disc:discA}, {x:172, sp:spB, disc:discB} ] };

  w8Parallax(S, -8, 186);
  w8LevelFinish(G, -8, 186, null);          // null clutter: baked props must not float over the collapse pit...
  w8Clutter(G, -8, 23.4, 'mine');           // ...so the solid spans are cluttered manually (w7l4 precedent)
  w8Clutter(G, 29.1, 185.5, 'mine');

  return {spawnX: 0, exitX: 183};
}

function updateW8L4(G, dt){
  updateLevelCommon(G, dt);
  const L4 = G._w8br; if(!L4 || L4.area !== G.area) return;
  const pl = G.player;
  let hotA = false, hotB = false;
  for(const e of G.ents.list){
    if(e.dead || !e.isEnemy || !(e instanceof CrystalBoulder)) continue;
    // THE HONEST CROWN (see header): normalize each ball's headH once so the bite window's top IS the
    // visible crown (2.4) and the stomp window sits on the visible top — dock/cart/seesaw riders above
    // 2.4 are truly safe, stomp-riders connect where they aim.
    if(e._w8h === undefined){ e._w8h = 1; e.headH = e.r + 0.15; }
    const bp = e.group.position, bx = bp.x;
    if(e.falling){                                           // fresh round still in the air — keep its landing zone lit
      // the fall sweeps x with the 5u/s throw: lane A 93->90.0, lane B 172->169.0 (windows cover the arcs)
      if(Math.abs(bx - 91.5) < 2.6) hotA = true;
      if(Math.abs(bx - 170.5) < 2.6) hotB = true;
      continue;
    }
    // grounded-bite assist (w7l4 precedent, hearts-always: 1 heart, i-frames gate repeats, knockback is
    // never a zero vector) — WITH a feet-below-center cap so a player standing on a dock/cart/seesaw
    // above the ball is never phantom-hit by the assist.
    if(e.touchDamage && pl && !pl.dead && pl.grounded && pl.pos.y < bp.y && Math.abs(pl.pos.z) < 1.3 &&
       Math.abs(pl.pos.x - bx) < e.r*0.9 + 0.35){
      pl.damage(1, new THREE.Vector3(bx + (pl.pos.x >= bx ? -0.4 : 0.4), pl.pos.y, 0));
    }
  }
  // the drop-zone telegraphs: each chute's amber floor-glow grows through the last 0.7s before its release
  // (read straight off the spawner clocks — perfectly synced, no parallel timer to drift) and holds while
  // the round falls. The mortar idiom, kept honest at both ends of the mine.
  for(const D of L4.drops){
    const warn = (D.sp.nextAt - D.sp.t) < 0.7;
    const hot = warn || (D.x < 130 ? hotA : hotB);
    const m = D.disc.material;
    m.opacity = hot ? Math.min(0.5, m.opacity + dt*2.2) : Math.max(0, m.opacity - dt*3);
    if(hot) D.disc.scale.setScalar(0.6 + m.opacity*0.9 + Math.sin(G.time*22)*0.06);
  }
}

W8_LEVELS.push({id:'w8l4', district:'w8', name:'THE BOULDER RUN', build:buildW8L4, update:updateW8L4, parTime:185});

// ============ LEVEL 9-1 — THE GARLAND ROAD (District 9 · Frostmere · Evergreen Deep) ============
// POST-STORY MASTERY BAND (owner lock): the whispering pines open BEYOND District 5 — but stay MAIN-GAME
// FAIR (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away).
// 9-1 is the road into the deep: garlanded end to end between pine-post pairs — and HALF THE STRINGS ARE
// DARK. The festival went quiet mid-song here, and this level teaches the forest's three opening lies:
//   TRUST NO DECORATION  (the Ornament Spider — the rattle is the tell, the thread is the lane)
//   MIND THE TINSEL FOLK (the Tangler taxes your HURRY, never your hearts — the speedrun-era threat)
//   THE ORNAMENTS SWING  (W9Bauble wrecking-pendulums — over safe ground first, then over the gap)
// ...then composes them: the ORNAMENT PARADE (rolling triplet + swinging bauble under the high pine road)
// and THE DARK STRETCH — a long unlit run where bauble arcs + two spider threads + a tangler weave while
// the candy traces the fast line. The road relights for the walk out.
//
// 12 threat systems: 3 OrnamentSpider + 2 TinselTangler + 2 WreathWisp + 2 BlizzardBat + 1 SnowBoo +
// 2 BaubleTriplet lanes (plus 5 W9Bauble pendulum contraptions on fixed clocks — hazards, not enemies).
// NO warp (the Quiet Carol lives in another level), NO Leap of Faith (both of the game's two are placed
// and sacred). Golden Pumpkin idx 0 crowns the tallest garland post — visible-but-tricky.
//
//   BEAT 1 THE ROAD IN            x -8..28   — CP0 (noLight). One warm string, then the first DARK string
//          (the quiet, shown before it's ever dangerous). The Advent Stump gamble in its clear pocket,
//          the welcome sign, and the quiet prop waiting against its pine. Nothing bites here.
//   BEAT 2 THE ORNAMENT LESSON    x 28..46   — a great bough hung with FIVE real baubles (reds among
//          them — color is never the tell) and ONE that rattles: OrnamentSpider #1 at the walking line.
//          Wake it, read the 0.6s unfold, pass on its reel rhythm. The sign teaches the rattle once.
//   BEAT 3 TINSEL SNOW            x 46..66   — open snow: TinselTangler #1 (the mandated lesson sign),
//          WreathWisp #1's low oval (rim burns, CENTER is safe — candy in the hole = the thread bait),
//          Blizzard Bat #1's squeak-dive overhead. Three systems, all learnable at walking pace.
//   BEAT 4 THE WRECKING GARLANDS  x 66..92   — W9Bauble #1 swings over SAFE ground (cross behind it, the
//          sign teaches the swing once) · the GP TOWER detour (ledge -> double-jump, candy-traced) ·
//          then the TWIST: Bauble #2 swings over the level's one GAP (86.4..91 — held-jump law, timed).
//   BEAT 5 THE LANTERN            x 92..108  — THE lit checkpoint (x100 = 52.6% of the 190u course — the
//          level's ONE lit lantern), shield Bonk Lantern, breath. Rest-pocket ledger pinned below.
//   BEAT 6 THE ORNAMENT PARADE    x 108..131 — ESCALATE pt 1: BaubleTriplet lane #1 rolls the road
//          head-on under W9Bauble #3's low swing, while the HIGH PINE ROAD (trunk-climb on-ramp ->
//          branch decks, candy halo visible from below) crosses overhead — the junction itch.
//   BEAT 7 THE DARK STRETCH       x 131..166 — ESCALATE pt 2 -> MASTER: the unlit run. Spider #2 hangs
//          the seam bough (spiders + baubles composing over the road), then arc #4, Tangler #2's weave,
//          Spider #3's thread, arc #5 — with SnowBoo #1 drifting the middle dark (stare = ice block =
//          the one safe stand). Candy traces the fast line the whole way. Don't stop walking.
//   BEAT 8 THE RELIT RUNOUT       x 166..190 — the strings come back on. WreathWisp #2's farewell hoop,
//          BaubleTriplet lane #2, Blizzard Bat #2 on the walk up, the gate's warm welcome.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the garland road itself, end to end · HIGH = the PINE
// ROAD over the parade (climb-pine on-ramp x109.5, five branch decks x113.5..129.5, ~7 candy overhead —
// visible from the whole parade below) · the GP TOWER detour (ledge x75.2 -> double-jump to the crown
// x78.6) is the third visible ask. The dark stretch's traced fast line is the expert texture on LOW.
// COMPARABLE HEIGHTS (jump model law): critical path is FLAT except the one 4.6u gap (held law <=5.5) ·
// triplet crown 1.64 -> tap 1.8 clears (owner speedrun rule: a tap always clears common enemies) ·
// tangler loop tops out y1.5 -> tap clears · ledge rise 2.0 (held 2.6, 0.6 margin) · ledge -> tower
// crown rise 2.6 / span 3.4 (double law <=3.0/<=4, candy-traced) · climb pine gates the high road
// (climb verb, boosted exit hop) · branch rises <=0.5, branch edge gaps 0.8-1.9 (tap law).
// HEARTS ALWAYS: the gap is a heart + lantern walk-back (killY -14, winter pitDressing bed); baubles,
// spiders, wisp rims, bats, triplets, boo all cost exactly 1; the tangler's lasso costs TIME only.
// DETERMINISM: every pendulum, spider, wisp, tangler, bat, boo and both triplet lanes ride fixed
// phases/clocks from level start; spider wakes are fixed-home player-reactive (the IceAngler/GemMimic
// precedent — determinism holds); no Math.random on the critical path (rand() only inside baked deco
// and the opt-in stump gamble, kit-standard).
//
// ---- PENDULUM ARC LEDGER (W9Bauble hit check: |dx|<r+0.3, |pl.y+0.6-by|<r+0.4 — r 0.7 => bands 1.0/1.1):
//   #1 x70   pivot 4.6 len 3.4 amp 0.90 P3.0 -> sweep 67.34..72.66, ball low y1.2 (bites walkers), apex y2.49
//   #2 x88.7 pivot 4.9 len 3.1 amp 0.85 P3.2 -> sweep 86.37..91.03 (the GAP), low y1.8 (bites the jump arc
//      mid-gap), apex y2.85 AT the lips — but a lip-STANDER (center 0.6) reads dy 2.25 > 1.1: waiting at
//      either lip is always safe; only the crossing itself is timed. Half-swing 1.6s ≈ crossing time.
//   #3 x122  pivot 4.8 len 3.5 amp 0.85 P2.9 -> sweep 119.37..124.63, low y1.3 · branch riders clear:
//      ball max center y 2.49 + 1.1 band = 3.59 < deck 3.7 (the high road sails over the swing)
//   #4 x141  pivot 4.7 len 3.4 amp 0.85 P3.1 -> sweep 138.37..143.63, low y1.3 (the dark's first arc)
//   #5 x160.5 pivot 4.6 len 3.3 amp 0.90 P2.7 -> sweep 157.92..163.08, low y1.3 (the dark's last word) ----
// ---- CP0 SPAWN SAFETY (idle at x0/z0, CP0 respawn x2/z1.6): nearest FIXED bite = spider #1 reel lane
// (touch 37-0.62-3.0 wake... touch min 33.38 -> 31.4u clear) · tangler #1 worst lasso reach 52.5-3.2-0.55
// = 48.75 (46.8u) · bat #1 worst trigger-drift 54.8-4.2-2 = 48.6 (46.6u) · wisp #1 rim min x 57.03 AND
// grounded-immune (ring band 0.73..1.37 vs grounded dy 1.6..2.4 — a walker can never touch it) · bauble
// #1 x-reach min 66.34 · triplet #1 reach min 112.2 · stump-ambush spiders are player-opened (kit's 1s
// grace) and reel only their own lanes 12.1..16.9 (touch min 11.48 -> 9.5u clear of the respawn). Clear. ----
// ---- LANTERN SAFETY (the ONE lit checkpoint, x100 z1.6; idle reader at x100/z0): west — bauble #2
// x-reach max 92.03 (8u) · gap lip 91 (9u) · east — triplet #1 lane reach min 112.2 (12.2u) · bauble #3
// x-reach min 118.37 (18.4u) · spider #2 wake ring min 130.8 · boo #1 leashed chaseR 11 off home 146
// (never west of 135) · tangler #2 lasso min 142.05 · bat #2 worst trigger-drift 176-4.2-2 = 169.8 · wisp #2
// rim min x 167.43 · shield lantern x97.4 is a friend. The pocket is a true breath. ----
// ---- ADVENT STUMP CLEAR-PATCH (x14.5 z-1.4, worst-case reach): spider #1 touch min 33.38 (18.9u clear) ·
// tangler #1 lasso min 48.75 (34.2u) · bat #1 worst 48.6 (34.1u) · everything else lives east of x66.
// The >=6u law is honored 3x over; opening is a deliberate safe act (ambush on the kit's 1s grace). ----

// ---- REAL BAUBLES (the decoys — build them so the spider has somewhere to hide): wire, glass ball,
// gilt cap, window-shine. Deco only, no collider; the RATTLE is the only tell, never the look. ----
function w9l1RealBauble(x, ballY, boughY, col, s=1){
  const g = new THREE.Group();
  const wire = mesh('cyl',[0.015,0.015,Math.max(0.2,boughY-ballY-0.3*s),4], mat(0x8a8f9a));
  wire.position.set(x, (boughY+ballY)/2+0.15*s, 0); g.add(wire);
  const ball = mesh('sph',[0.3*s,10,9], new THREE.MeshLambertMaterial({color:col, emissive:col, emissiveIntensity:0.35}));
  ball.position.set(x, ballY, 0); g.add(ball);
  const cap = mesh('cyl',[0.09*s,0.11*s,0.1,8], mat(0xc9a24a)); cap.position.set(x, ballY+0.34*s, 0); g.add(cap);
  const shine = mesh('sph',[0.07*s,5,4], emat(0xffffff,0xffffff,0.6)); shine.position.set(x-0.11*s, ballY+0.11*s, 0.24*s); g.add(shine);
  return g;
}
// ---- A HANGING BOUGH — the bark beam the baubles (and their impostors) hang from, needle-dressed ----
function w9l1Bough(x1, x2, y){
  const g = new THREE.Group();
  const beam = mesh('cyl',[0.13,0.17,(x2-x1),6], mat(W9PAL.bark)); beam.rotation.z = Math.PI/2; beam.position.set((x1+x2)/2, y, -0.15); g.add(beam);
  for(let bx=x1+0.7; bx<x2-0.4; bx+=rand(1.1,1.8)){
    const tuft = mesh('cone',[rand(0.28,0.42),rand(0.5,0.8),6], mat(W9PAL.pine)); tuft.position.set(bx, y+0.25, -0.2); tuft.rotation.z = rand(-2.6,-0.5); g.add(tuft);
  }
  const snow = mesh('box',[(x2-x1)*0.8,0.07,0.3], mat(W9PAL.snow)); snow.position.set((x1+x2)/2, y+0.17, -0.15); g.add(snow);
  return g;
}
// ---- DARK GARLAND POST + DARK STRING — the quiet, made visible: same posts, same sagging wire, but the
// bulbs are cold dead glass. Half this road stopped singing; these are the halves. All baked. ----
function w9l1DarkPost(x, z){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.09,0.13,3.0,6], mat(W9PAL.barkD)); pole.position.set(x,1.5,z); g.add(pole);
  for(let i=0;i<4;i++){ const wrap = mesh('tor',[0.16,0.045,4,10], mat(W9PAL.pine)); wrap.position.set(x, 0.5+i*0.72, z); wrap.rotation.x = Math.PI/2 - 0.25; g.add(wrap); }
  const cage = mesh('box',[0.34,0.4,0.34], mat(0x1c2230)); cage.position.set(x,3.15,z); g.add(cage);
  const dead = mesh('sph',[0.12,6,5], mat(0x2a3040)); dead.position.set(x,3.12,z); g.add(dead);   // a lantern nobody relit
  return g;
}
function w9l1DarkString(g, x1,y1, x2,y2, z=-1.9){
  const segs = Math.max(6, Math.floor(Math.hypot(x2-x1,y2-y1)*1.2));
  const sag = Math.min(1.2, Math.hypot(x2-x1,y2-y1)*0.09);
  let px=x1, py=y1;
  for(let i=1;i<=segs;i++){
    const t=i/segs, qx=lerp(x1,x2,t), qy=lerp(y1,y2,t)-Math.sin(t*Math.PI)*sag;
    const w = mesh('cyl',[0.015,0.015,Math.hypot(qx-px,qy-py),3], mat(0x141a2c));
    w.position.set((px+qx)/2,(py+qy)/2,z); w.rotation.z = Math.atan2(qx-px,qy-py)*-1+Math.PI; g.add(w);
    if(i<segs){ const bulb = mesh('sph',[0.075,5,4], mat(0x232a3c)); bulb.position.set(qx,qy-0.09,z); g.add(bulb); }   // dead glass — the quiet
    px=qx; py=qy;
  }
}
// ---- THE GP TOWER — the tallest garland post on the road, wound in garland, crowned by the prize ----
function w9l1Tower(x){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.14,0.2,4.35,7], mat(W9PAL.bark)); pole.position.set(x,2.175,-0.85); g.add(pole);
  for(let i=0;i<7;i++){ const wrap = mesh('tor',[0.26,0.06,4,12], mat(W9PAL.pine)); wrap.position.set(x, 0.4+i*0.58, -0.85); wrap.rotation.x = Math.PI/2 - 0.3; wrap.rotation.z = i*0.5; g.add(wrap); }
  for(let i=0;i<5;i++){ const cc = pick([W9PAL.ornR,W9PAL.ornG,0x7ae8ff]);
    const orn = mesh('sph',[0.09,5,4], emat(cc,cc,0.75)); orn.position.set(x+Math.cos(i*2.2)*0.3, 0.7+i*0.78, -0.85+Math.sin(i*2.2)*0.3); g.add(orn); }
  const foot = mesh('sph',[0.5,7,5], mat(W9PAL.snow)); foot.scale.y=0.4; foot.position.set(x,0.1,-0.85); g.add(foot);
  return g;
}
// ---- THE CLIMB PINE — the district's climbable: a bark trunk with nub-holds (the visible verb), foliage
// pushed behind the climb face, snow on every tier. The volume is laid by the caller. ----
function w9l1ClimbPine(x){
  const g = new THREE.Group();
  const trunk = mesh('cyl',[0.3,0.42,4.8,7], mat(W9PAL.bark)); trunk.position.set(x,2.4,0); g.add(trunk);
  for(let i=0;i<7;i++){ const nub = mesh('sph',[0.1,5,4], mat(W9PAL.barkD)); nub.position.set(x+(i%2?0.26:-0.26), 0.6+i*0.6, 0.18); g.add(nub); }
  for(let tier=0;tier<3;tier++){
    const tr = mesh('cone',[1.7-tier*0.4, 1.6, 7], mat(tier%2?W9PAL.pine:W9PAL.pineD)); tr.position.set(x, 2.6+tier*1.15, -0.95); g.add(tr);
    const cap = mesh('cone',[1.55-tier*0.4, 0.5, 7], mat(W9PAL.snow)); cap.position.set(x, 3.2+tier*1.15, -0.95); g.add(cap);
  }
  return g;
}
// ---- THE QUIET PROP (never signposted): a wooden sled parked NEATLY against a pine, rope handle worn
// smooth from years of mittened hands — and two smaller sleds beside it, one barely bigger than a
// shoebox. Three sizes. Somebody was teaching somebody. The road is still waiting for the snow day. ----
function w9l1Sleds(x, z){
  const g = new THREE.Group();
  const sled = (sx, s, lean)=>{
    const sg = new THREE.Group();
    for(const side of [-0.3*s, 0.3*s]){
      const runner = mesh('box',[1.5*s,0.07*s,0.07*s], mat(W9PAL.barkD)); runner.position.set(0,0.08*s,side); sg.add(runner);
      const curl = mesh('tor',[0.14*s,0.035*s,4,8,Math.PI], mat(W9PAL.barkD)); curl.position.set(0.75*s,0.2*s,side); sg.add(curl);
    }
    for(let i=0;i<4;i++){ const slat = mesh('box',[0.2*s,0.04*s,0.72*s], mat(0x6a5238)); slat.position.set(-0.55*s+i*0.34*s, 0.16*s, 0); sg.add(slat); }
    sg.position.set(sx, 0.05, z); sg.rotation.z = lean; sg.rotation.y = rand(-0.15,0.15);
    return sg;
  };
  g.add(sled(x, 1.0, 0.5));            // the big one, leaned against the trunk
  const rope = mesh('tor',[0.16,0.035,4,10], mat(0x9a8a6a)); rope.position.set(x+0.55, 0.6, z+0.32); rope.rotation.x = 1.2; g.add(rope);   // the handle, worn smooth
  g.add(sled(x+1.15, 0.62, 0.35));     // the middle one
  g.add(sled(x+1.95, 0.34, 0.1));      // barely bigger than a shoebox
  const drift = mesh('sph',[0.7,7,5], mat(W9PAL.snow)); drift.scale.y=0.35; drift.position.set(x+0.9, 0.05, z-0.3); g.add(drift);
  return g;
}

function buildW9L1(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;                 // the packed road (grippy — every precision beat lives on it)
  const DARKSNOW = 0x2b3450;                // the unlit stretch — the road itself goes quiet
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();                // the LIT half of the strings (the dark half is bespoke, baked)

  // =============================== BEAT 1 — THE ROAD IN (x -8..28) ===============================
  groundX(G, -8, 86.4, SNOW);               // one grippy road to the west lip of the gap
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  signPost(G, 6, 1.7, -0.12, "THE GARLAND ROAD. Every pine dressed, every post strung - and half the strings went dark mid-carol. The forest is still listening for the next verse. Walk soft, and don't hum.");
  // the first LIT pair — the last of the festival that kept singing
  deco.add(w6LightPost(4, -2.0, 3)); deco.add(w6LightPost(11, -2.0, 3));
  w6String(L, 4, 2.95, 11, 2.95, {z:-1.9});
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 2);
  // THE ADVENT STUMP — the gamble, in its CLEAR POCKET (ledger in the header: nearest fixed bite 18.9u)
  { const st = new AdventStump(14.5, 0, -1.4, 0.3); G.coffins.push(st); G.ents.add(st); }
  // ...and the first DARK pair, right where anyone will see it: the quiet, introduced before it matters
  deco.add(w9l1DarkPost(16, -2.0)); deco.add(w9l1DarkPost(24, -2.0));
  w9l1DarkString(deco, 16, 2.95, 24, 2.95);
  // THE QUIET PROP — the three sleds, parked neatly, still waiting for the snow day
  deco.add(w6Pine(21.5, -2.9, 1.25));
  deco.add(w9l1Sleds(20.8, -2.0));
  G.ents.add(new Crow(25.5, 0.95, 2.1));    // forest crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE ORNAMENT LESSON (x 28..46) ===============================
  // The great bough: FIVE real baubles (reds included — color is never the tell) and ONE OrnamentSpider
  // at the walking line (x37). The rattle + 0.6s unfold is the whole lesson; its reel rides a fixed 3.0s
  // lane y0.9..3.2. Pass on the beat (candy marks both shoulders of the thread), spin it, or stomp it.
  deco.add(w6Pine(29.5, -1.5, 1.5)); deco.add(w6Pine(42.5, -1.5, 1.5));
  deco.add(w9l1Bough(29, 43, 4.6));
  deco.add(w9l1RealBauble(31.5, 3.3, 4.6, W9PAL.ornG));
  deco.add(w9l1RealBauble(33.5, 3.1, 4.6, 0x7ae8ff, 0.9));
  deco.add(w9l1RealBauble(35.2, 3.4, 4.6, W9PAL.ornR, 1.05));     // a red one two steps from the liar
  deco.add(w9l1RealBauble(39.3, 3.2, 4.6, W9PAL.ornE));
  deco.add(w9l1RealBauble(41.4, 3.35, 4.6, W9PAL.ornR, 0.95));
  G.ents.add(new OrnamentSpider(G, 37, 3.2, 0, {phase:0, dropY:0.9, wakeR:3.0, period:3.0, color:0xd83a4a}));
  signPost(G, 30, 1.7, 0.1, "Five of those baubles came out of Granny's box. One did not. If a decoration RATTLES at you - it is not a decoration. Let it introduce itself, then mind the thread.");
  candyLine(G, [[31,0.9,0],[33,0.9,0]], 2);                       // the approach — walking pace, eyes up
  candyLine(G, [[35.6,0.9,0],[38.4,0.9,0]], 2);                   // both shoulders of the thread — pass on the reel's beat

  // =============================== BEAT 3 — TINSEL SNOW (x 46..66) ===============================
  // Open snow, three honest systems: the Tangler's 0.7s twirl + loop (tops y1.5 — a tap clears it, a
  // spin shakes it off), Bat #1's squeak-dive from y5.2, and Wisp #1's slow low oval — rim burns,
  // CENTER is safe (ring band 0.73..1.37 vs grounded dy 1.6..2.4: a walker literally cannot touch it;
  // a held jump threads the hole, and the hole keeps candy — the speedrun bait, exactly as advertised).
  // sign clearances: tangler #1 gremlin min x52.5 — a reader at 46.5 sits 6.0u off (outside the 5.5 wake
  // ring: reading never even starts the lasso clock) and 2.25u clear of the worst lasso reach 48.75.
  signPost(G, 46.5, 1.7, -0.12, "Mind the tinsel folk - they don't want your hearts, they want your HURRY. A little hop beats the lasso; a good spin shakes it off. The wreaths burn only at the rim. The middle is for the brave.");
  candyLine(G, [[49.5,0.9,0],[51,0.9,0]], 2);
  G.ents.add(new TinselTangler(G, 55, 0, 0, {phase:0, range:2.5, dir:1, speed:1.4, wakeR:5.5, lassoP:4.0}));
  G.ents.add(new BlizzardBat(G, 57, 5.2, 0, {phase:0.5, range:2.2, period:3.5, aggroR:4.2}));
  candyLine(G, [[53,0.9,0],[55,1.7,0],[57,0.9,0]], 3);            // the loop-hop, arced over the lasso line
  G.ents.add(new WreathWisp(G, 61, 2.6, 0, {phase:0.8, rx:2.6, ry:0.4, period:6.4}));
  G.ents.add(new Candy(61, 2.6, 0));                              // IN the hole — thread it or leave it
  candyLine(G, [[63.8,0.9,0]], 1);
  G.ents.add(new Crow(64.5, 0.95, 2.2));    // forest crow #2 — watching the wreath go round

  // =============================== BEAT 4 — THE WRECKING GARLANDS (x 66..92): swing, tower, TWIST ===============================
  // W9BAUBLE #1 over SAFE ground (arc ledger in header: sweep 67.34..72.66, low y1.2). The sign teaches
  // the swing once; the candy INSIDE the sweep traces the timed dash — cross behind the ball, never through.
  // sign clearance: bauble #1's ground-bite zone (ball center y < 1.7 => |theta| < 0.55) spans x67.2..72.8
  // with the 1.0 x-band — a reader at 66.0 stands 1.2u clear, and the ball is always HIGH when it's near him.
  signPost(G, 66.0, 1.7, 0.1, "The big ornaments took up the wrecking trade when the music stopped. A swing keeps perfect time, all night, every night. Cross BEHIND it. Never argue with a pendulum.");
  G.ents.add(new W9Bauble(G, 70, 4.6, {len:3.4, amp:0.9, period:3.0, phase:0, r:0.7, color:W9PAL.ornR}));
  candyLine(G, [[68.5,0.9,0],[71.5,0.9,0]], 2);                   // the dash line, inside the sweep — timed, not brave
  // THE GP TOWER (Golden Pumpkin idx 0 — visible-but-tricky): the tallest garland post on the road.
  // Ledge x75.2 y2.0 (held 2.6 law, 0.6 margin; bauble #1's x-reach tops at 73.66 — 0.74u clear of the
  // ledge's 74.4 edge, and a ledge-stander center 2.6 vs ball apex y2.49 reads dx>=1.9: standing is safe)
  // -> DOUBLE-JUMP to the crown x78.6 y4.6 (rise 2.6 <= 3.0 law, span 3.4 <= 4, candy-traced; bauble #2's
  // x-reach starts at 85.37 — 6u clear). Never requires touching a hazard. The lit sag-string between the
  // tower and its mate makes the prize readable from the whole beat.
  platform(G, 75.2, 2.0, 0, 1.6, 1.6, W9PAL.bark);
  { const leg = mesh('box',[0.2,1.9,0.2], mat(W9PAL.barkD)); leg.position.set(75.2, 0.95, -0.7); deco.add(leg); }
  candyLine(G, [[74,1.4,0],[75.2,2.6,0]], 2);                     // the ledge ask
  deco.add(w9l1Tower(78.6));
  platform(G, 78.6, 4.6, 0, 1.4, 1.8, W9PAL.pineD);               // the crown (box spans z -0.9..0.9 — reachable from the z0 lane)
  G.ents.add(new GoldPumpkin(78.6, 5.5, 0, 0));
  candyLine(G, [[76.4,3.4,0],[77.5,4.3,0],[78.6,5.2,0]], 3);      // the double-jump trace
  deco.add(w9l1DarkPost(82.6, -1.1));                             // the mate post — dark, of course
  w6String(L, 78.6, 4.5, 82.6, 3.4, {z:-1.0, sag:0.7});           // the tower's own string still burns
  // THE TWIST — Bauble #2 over the GAP (86.4..91, 4.6u — held law): the swing owns the crossing, the lips
  // stay safe to wait on (ledger above), and the half-swing IS the metronome. Fall = heart + walk-back.
  pitDressing(G, 86.4, 91, 'winter');
  G.ents.add(new W9Bauble(G, 88.7, 4.9, {len:3.1, amp:0.85, period:3.2, phase:1.6, r:0.7, color:0x7ae8ff}));
  candyLine(G, [[85.8,1.2,0],[88.7,2.9,0],[91.5,1.2,0]], 3);      // the crossing arc, timed to the far apex

  // =============================== BEAT 5 — THE LANTERN (x 92..108): the ONE lit checkpoint ===============================
  groundX(G, 91, 131, SNOW);
  // x100 of a 190u course = 52.6% (exam law). Rest-pocket ledger pinned in the header — a true breath.
  G.ents.add(new Checkpoint(100, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 97.4, 1.5, 0, 'shield'));         // armor before the parade and the dark
  candyLine(G, [[97,0.9,0],[99,0.9,0]], 2);
  deco.add(w6LightPost(95.5, -2.0, 3)); deco.add(w6LightPost(103, -2.0, 3));
  w6String(L, 95.5, 2.95, 103, 2.95, {z:-1.9});                   // the lantern's own lit string — the last warm pair
  deco.add(w6SnowmanDeco(105.5, -2.4, 0.7, -0.4));                // somebody's greeter, still smiling at the dark

  // =============================== BEAT 6 — THE ORNAMENT PARADE (x 108..131): ESCALATE pt 1 ===============================
  // BaubleTriplet lane #1 rolls the road HEAD-ON (127.5 -> 113, 4.4u/s, fixed 4.8s clock — crown 1.64,
  // tap clears; lane reach 112.2..128.28 keeps both the climb foot at 110 AND the dark sign's reader at
  // 130.5 clear) under W9Bauble #3's low swing (sweep 119.37..124.63). Compose: hop the roller on the
  // traced cues, dash the swing's window. Worst pinch on the road: triplet + bauble = 2 systems.
  G.ents.add(new BaubleTriplet(G, 127.5, 0, 0, {x1:113, speed:4.4, phase:0.6, pause:1.5, color:0xd83a4a}));
  G.ents.add(new W9Bauble(G, 122, 4.8, {len:3.5, amp:0.85, period:2.9, phase:0.7, r:0.7, color:W9PAL.ornG}));
  candyLine(G, [[112.5,0.9,0],[115.5,0.9,0]], 2);
  candyLine(G, [[117.8,1.7,0]], 1);                               // hop cue #1 — outside the swing's reach
  candyLine(G, [[121,0.9,0],[123.2,0.9,0]], 2);                   // the swing window dash
  candyLine(G, [[126.5,1.7,0],[128.8,0.9,0]], 2);                 // hop cue #2, and out
  deco.add(w6LightPost(112, -2.0, 3)); deco.add(w6LightPost(120, -2.0, 3));
  w6String(L, 112, 2.95, 120, 2.95, {z:-1.9});                    // one last lit span...
  deco.add(w9l1DarkPost(124, -2.0)); deco.add(w9l1DarkPost(132, -2.0));
  w9l1DarkString(deco, 124, 2.95, 132, 2.95);                     // ...then the quiet takes the road
  // THE HIGH PINE ROAD — the district's climbable, made a route: trunk-climb on-ramp (x109.5, nub-holds,
  // boosted exit hop) -> five branch decks over the whole parade (rises <=0.5, edge gaps 0.8-1.9 tap;
  // deck 3.7 clears bauble #3's 3.59 worst reach — riders sail over the swing). The candy halo is visible
  // from the road below: the "next run I'm going up there" itch. Triplet lane reach min 112.2 keeps the
  // climb foot (body 110) 2.2u clear. Falls land on ROAD, never void.
  deco.add(w9l1ClimbPine(109.5));
  G.world.addBox(109.5, 0, 0, 1.0, 4.6, 1.2, {type:'climb'});
  const BRANCHES = [[113.5,3.8],[117.5,4.1],[121.5,3.7],[125.5,4.2],[129.5,3.8]];
  for(const [bx,by] of BRANCHES){
    platform(G, bx, by, 0, 3.2, 1.7, W9PAL.pineD);
    { const arm = mesh('cyl',[0.12,0.16,2.4,5], mat(W9PAL.bark)); arm.rotation.z = Math.PI/2; arm.position.set(bx-1.2, by-0.35, -0.8); deco.add(arm);
      const tuft = mesh('cone',[0.5,0.9,6], mat(W9PAL.pine)); tuft.position.set(bx+1.1, by+0.3, -0.8); tuft.rotation.z = -1.9; deco.add(tuft); }
  }
  candyLine(G, [[109.5,5.0,0],[111.5,4.8,0]], 2);                 // the climb-exit hop, traced
  candyLine(G, [[113.5,4.9,0],[117.5,5.2,0],[121.5,4.8,0]], 3);   // the halo — visible from the parade floor
  candyLine(G, [[125.5,5.3,0],[129.5,4.9,0]], 2);                 // ...ending on a view of the dark stretch

  // =============================== BEAT 7 — THE DARK STRETCH (x 131..166): ESCALATE pt 2 -> MASTER ===============================
  groundX(G, 131, 166, DARKSNOW);           // the unlit run — even the road forgets its color
  // sign clearances: triplet #1 lane reach max 128.28 (2.2u) · spider #2 wake ring min 130.8 (a reader at
  // 130.5 never rings it — the HEART at 131.2 is the doorbell, on purpose).
  signPost(G, 130.5, 1.7, -0.1, "Past this post the carol stopped MID-NOTE, and nobody relit the strings. The road runs straight and the candy knows the way. Whatever rattles out there - don't stop walking.");
  G.ents.add(new Heart(131.2, 1.0, 0));     // mercy at the door (the w7l4 mid-lake precedent)... and the
  // heart sits 2.8u inside spider #2's wake ring: taking it RINGS the doorbell. The rattle answers from
  // the dark — 0.6s of warning, thread touch 3.4u away. The dark introduces itself honestly.
  // SPIDER THREAD #1 of the dark (spiders + baubles composing over the road): the seam bough at the last
  // light's edge — two dead-glass decoys and the gilt one that rattles (x134, reel y0.9..3.4, P3.0).
  deco.add(w9l1Bough(131.5, 138.5, 4.8));
  deco.add(w9l1RealBauble(132.2, 3.5, 4.8, 0x3aa060, 0.9));
  deco.add(w9l1RealBauble(136.4, 3.3, 4.8, W9PAL.ornR));
  G.ents.add(new OrnamentSpider(G, 134, 3.4, 0, {phase:0.4, dropY:0.9, wakeR:3.2, period:3.0, color:0xffd23f}));
  candyLine(G, [[132.8,0.9,0],[135.2,0.9,0]], 2);                 // the fast line runs UNDER the thread on the reel's beat
  // ARC #4 (sweep 138.37..143.63) — the window dash, traced
  G.ents.add(new W9Bauble(G, 141, 4.7, {len:3.4, amp:0.85, period:3.1, phase:0.4, r:0.7, color:W9PAL.ornR}));
  candyLine(G, [[139.3,0.9,0],[142.7,0.9,0]], 2);
  // SNOWBOO #1 — the middle dark's drifter (home 146, leashed chaseR 11 — active x135..157 only). Stare
  // it SOLID: the ice block is the dark's one safe stand (and a step, if you're clever). The winter rule,
  // rediscovered where it matters most. It never reaches the lantern pocket or the runout. (SnowBoo
  // doesn't unpack a chaseR opt — set the property on the instance, the w6l2 precedent.)
  { const sb = new SnowBoo(G, 146, 0, 0, {phase:0.3, speed:1.9, range:8, freezeMax:2.6}); sb.chaseR = 11; G.ents.add(sb); }
  // TANGLER #2 — the weave (patrol 145.8..150.2, lasso airspace 142.05..153.95): in the dark, HURRY is
  // exactly what you're spending. Jump the loop on the traced cue; a spin shakes the tinsel early.
  G.ents.add(new TinselTangler(G, 148, 0, 0, {phase:0.9, range:2.2, dir:-1, speed:1.5, wakeR:5.5, lassoP:3.6}));
  candyLine(G, [[146.6,0.9,0],[148.2,1.7,0],[149.8,0.9,0]], 3);   // the loop-hop, arced
  // SPIDER THREAD #2 (x154, reel y0.9..3.3, P2.7 — a half-beat quicker than its cousin: the master's
  // detail). Its bough hangs one cyan decoy and one green; the lasso's worst reach (153.95) grazes the
  // thread's shoulder — the weave's designed pinch: tangler + spider + boo = 3 systems (cap holds).
  deco.add(w9l1Bough(151, 157.5, 4.5));
  deco.add(w9l1RealBauble(151.9, 3.2, 4.5, 0x7ae8ff, 0.9));
  deco.add(w9l1RealBauble(156.3, 3.35, 4.5, W9PAL.ornE));
  G.ents.add(new OrnamentSpider(G, 154, 3.3, 0, {phase:1.1, dropY:0.9, wakeR:3.0, period:2.7, color:0x7ae8ff}));
  candyLine(G, [[152.8,0.9,0],[155.2,0.9,0]], 2);
  // ARC #5 (sweep 157.92..163.08) — the dark's last word, a hair faster (P2.7)
  G.ents.add(new W9Bauble(G, 160.5, 4.6, {len:3.3, amp:0.9, period:2.7, phase:1.9, r:0.65, color:0x7ae8ff}));
  candyLine(G, [[158.8,0.9,0],[162.2,0.9,0]], 2);
  candyLine(G, [[165,0.9,0]], 1);                                 // ...and out
  // the dark's dead strings overhead — three spans of cold glass between unlit posts
  deco.add(w9l1DarkPost(136, -2.0)); deco.add(w9l1DarkPost(146, -2.0));
  deco.add(w9l1DarkPost(156, -2.0)); deco.add(w9l1DarkPost(166, -2.0));
  w9l1DarkString(deco, 136, 2.95, 146, 2.95);
  w9l1DarkString(deco, 146, 2.95, 156, 2.95);
  w9l1DarkString(deco, 156, 2.95, 166, 2.95);
  G.ents.add(new Crow(167.5, 0.95, 2.2));   // forest crow #3 — sitting exactly where the light comes back

  // =============================== BEAT 8 — THE RELIT RUNOUT (x 166..190): exhale, hoop, gate ===============================
  groundX(G, 166, 194, SNOW);
  // WREATH WISP #2 — the farewell hoop (oval 168.8..173.2, grounded-immune like its sister): one last
  // thread for the runners, candy in the hole, nothing owed. Then BaubleTriplet lane #2 (184 -> 169,
  // green, 4.6u/s) keeps the hop rhythm honest, and Bat #2 (home 178 — worst trigger-drift 186.2, 1.4u
  // shy of the outro sign's reader, the w8l1 margin) contests the last stretch of sky. Worst runout
  // pinch: wisp + triplet = 2, or triplet + bat = 2 (a true exhale, with teeth).
  G.ents.add(new WreathWisp(G, 171, 2.6, 0, {phase:0.2, rx:2.2, ry:0.4, period:6.0}));
  G.ents.add(new Candy(171, 2.6, 0));                             // in the hole, one more time
  G.ents.add(new BaubleTriplet(G, 184, 0, 0, {x1:169, speed:4.6, phase:1.2, pause:1.3, color:0x3aa060}));
  G.ents.add(new BlizzardBat(G, 178, 5.2, 0, {phase:1.6, range:2.0, period:3.7, aggroR:4.2}));
  candyLine(G, [[173.5,0.9,0],[177,1.6,0],[180.5,0.9,0]], 3);     // the hop rhythm, traced home
  deco.add(w6LightPost(168.5, -2.0, 3)); deco.add(w6LightPost(176, -2.0, 3));
  w6String(L, 168.5, 2.95, 176, 2.95, {z:-1.9});                  // the strings come back on...
  deco.add(w6LightPost(179.5, -2.0, 3)); deco.add(w6LightPost(187, -2.0, 3));
  w6String(L, 179.5, 2.95, 187, 2.95, {z:-1.9});                  // ...two whole spans of them
  signPost(G, 187.6, 1.7, -0.1, "The lights burn again past here - somebody kept THESE strings fed all along. The deep pines are listening for you now. Bring the song back whole, will you?");
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(188.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 190);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // roadside pines pacing the whole march (the garland road is a road THROUGH trees — never open field)
  deco.add(w6Pine(-5, -2.9, 1.3)); deco.add(w6Pine(50.5, -3.1, 1.1)); deco.add(w6Pine(60, -2.8, 1.4));
  deco.add(w6Pine(93, -3.0, 1.2)); deco.add(w6Pine(107.5, -2.9, 1.1));
  deco.add(w6Pine(139, -2.8, 1.5)); deco.add(w6Pine(149.5, -3.1, 1.2)); deco.add(w6Pine(162, -2.9, 1.4));   // the dark keeps its trees — they just stopped glittering
  deco.add(w6Pine(174, -3.0, 1.2)); deco.add(w6Pine(191.5, -2.8, 1.3));
  deco.add(w6GiftBox(9.5, -1.9, 0.7)); deco.add(w6GiftBox(101.5, -1.8, 0.6));   // parcels nobody collected
  // FOREGROUND silhouettes (z>0): dark pine teeth framing the depth
  for(const [fx,fs] of [[38,1.1],[84,1.3],[128,1.2],[158,1.4],[182,1.0]]){
    const tooth = mesh('cone',[0.7*fs, 2.2*fs, 5], mat(0x0e1826)); tooth.position.set(fx, 0.7, 2.7); tooth.rotation.z = rand(-0.1,0.1); deco.add(tooth);
  }
  deco.add(w6Pine(-3, 2.5, 1.2)); deco.add(w6Pine(191, 2.6, 1.2));
  S.add(bakeGroup(deco));

  w9Parallax(S, -8, 194);
  w9LevelFinish(G, -8, 194, null);          // null clutter: baked props must never float over the gap...
  w9Clutter(G, -8, 86, 'forest');           // ...so the solid spans are cluttered manually (w7l4/w8l1 precedent)
  w9Clutter(G, 91.4, 193, 'forest');

  // festival strings live (shared mats + one twinkle ticker — the LIT half only; the dark half is baked glass)
  w6LightsFinish(G, L);

  return {spawnX: 0, exitX: 190};
}

function updateW9L1(G, dt){
  updateLevelCommon(G, dt);
}

W9_LEVELS.push({id:'w9l1', district:'w9', name:'THE GARLAND ROAD', build:buildW9L1, update:updateW9L1, parTime:150});

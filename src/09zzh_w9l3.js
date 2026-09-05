// ============ LEVEL 9-3 — THE WOODCUTTERS' CAMP (District 9 · Frostmere · Evergreen Deep) ============
// POST-STORY MASTERY BAND (owner lock): Evergreen Deep sits BEYOND District 5 — main-game fair forever
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away).
// 9-3 is the district's CLIMB level (owner law 6a — climbing is FUN, never a ladder-chore): the camp's
// GREAT PINE, a giant decorated trunk scaled on branch platforms + bark-rung climb volumes, with the camp's
// two stone cookhouse CHIMNEYS breathing warm smoke (w9Updraft) as the vertical express. The saws went
// quiet mid-shift; the carols went quiet mid-verse; the ornaments in the boughs were never all ornaments.
// 13 threats: 3 Ornament Spiders (bough thread-lanes beside the climb — the D5 dodge-while-climbing chain)
// + 2 Tinsel Tanglers + 1 Somnambear (the log yard below the pine — reuse #1) + 2 Carol Boos (a DUET,
// verses 0 and 2 on one clock: the middle verse is two seconds of silence, because the middle singer never
// came back — the incomplete round is the joke) + 2 Blizzard Bats (reuse #2) + THE BAUBLE TRIPLETS x3
// (mid-boss, X-3 tradition). NO warp (the Quiet Carol lives in another level), NO Leap of Faith (both of
// the game's two are placed and sacred). GOLDEN PUMPKIN idx 1 in the Great Pine's hollow.
//
//   BEAT 1 THE CAMP GATE (arrive)        x -8..24    — CP0 (noLight). The ADVENT STUMP gamble in its clear
//          pocket, the camp's last warm string, the quiet prop waiting off the path. Nothing bites here.
//   BEAT 2 THE SAW YARD (INTRODUCE)      x 24..51    — the duet sings its broken round over the yard (the
//          singing IS the telegraph; staring silences a verse), a Tinsel Tangler works the low lane while
//          the log-pile high line rides above its lasso, and the flume channel cuts the yard (gap #1, 3.4u).
//   BEAT 3 THE SAWDUST FLOOR (MID-BOSS)  x 54.4..86  — THE BAUBLE TRIPLETS: three giant glass ornaments
//          rolling three staggered lanes on ONE 7.5s clock (a ball every 2.5s, thirds — take-turns
//          tradition). Tap-hop clears every crown (1.64 < tap 1.8, owner speedrun rule); stomp each once
//          to end the parade. Pomp sign, as required by law.
//   BEAT 4 THE GREAT PINE (the CLIMB)    x 86..142   — CP1 at x92 (the level's ONE lit lantern, 53.8%).
//          JUNCTION at the foot — LEFT/EXPRESS: hop into the chimney smoke and ride the updrafts past the
//          branch gaps (harder aim, more candy, sails clean over the sleepwalking bear) · RIGHT/LADDER:
//          branch-hop + two bark-rung climb strips spiraling the trunk (steady, spider-contested). The
//          Somnambear sleepwalks the log yard at the base (soft wall asleep; cross her path and she wakes —
//          0.7s roar, ONE blind swipe, then she forgets). Ornament Spiders reel fixed thread-lanes beside
//          the hops (decoy baubles hang everywhere — count the legs); a Blizzard Bat owns the canopy air.
//          The GOLDEN PUMPKIN glows through a knothole in the trunk — entered by ducking BEHIND the bark
//          from the east bough's notch (the z<0 route read). Exit east over the stacked TIMBER WALL.
//   BEAT 5 THE GARLAND RUN (MASTER)      x 142..172  — the full composition: three ornament wrecking-
//          pendulums marching on one 3s clock family, a Tinsel Tangler taxing your run-up, the crevasse
//          (gap #2, 4.6u held) jumped THROUGH the middle pendulum's arc, and a Blizzard Bat contesting the
//          landing. Candy traces the racing line beat by beat. Then the gate, and a cocoa you'll never get.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the yard floor + the pine-base log yard (anyone finishes
// here... eventually — the wall forces the climb, but every fall lands on soft snow: a miss costs seconds,
// never a heart, owner law 6a) · HIGH/STEADY = the log-pile line (yard) and the branch ladder (pine) ·
// EXPRESS = the chimney updrafts — visible smoking from the CP1 junction, their candy glittering in the
// columns while ladder players hop below (the "next run I'm going up there" itch; it IS the speedrun line:
// every mechanic's fast answer — spiders stomp mid-reel, the bear is overflown, the triplets tap-hop).
// COMPARABLE HEIGHTS: main steps <=1.9 (b1) · ladder rises 1.8 with 3.5u hops (tap-gap law <=4) · climb
// strips gate everything above 2.2 (the verb is telegraphed by sign + rungs) · updraft tops 7.2/12.2 clear
// their landings (7.2>5.4 ledge, 12.2>11.2 bough — over-clearance, owner law) · gap #1 3.4u tap · gap #2
// 4.6u held (<=5.5) · descents all drop. HEARTS ALWAYS: every hazard costs exactly 1; both pits are
// registered + dressed (winter teeth); no one-shots anywhere.
// DETERMINISM: triplets share ONE fixed 7.5s clock (phases 0/2.5/5.0) rolling since level start; the duet
// shares ONE 6s carol (verses 0/2, phase 0 both — lockstep); every spider/bat/tangler/bauble carries a
// fixed phase; rand() only inside baked deco (kit-standard). NO Math.random on the critical path.
//
// SPAWN SAFETY (idle at x0/z0, CP0 respawn x2/z1.6): stump ambush spiders (opt-in, player-opened) reel
// lanes 11.6..16.4, min touch 10.98 → 9.0u clear · Carol Boo #1 swoop+touch min 28.5-2.6-0.66=25.2 →
// 23.2u · Tangler #1 lasso min 30.4-3.2=27.2 → 25.2u · triplets die >=59 (touch 58.2) · bear swipe min
// 96.5 · everything east of that is a postcode away. All clear.
// CP1 SAFETY (idle at x92): triplet touch max 84.82 → 7.2u clear · bear swipe min reach 100-3.5=96.5 →
// 4.5u (she bites only when her PATH is crossed — an idle lantern-stander never wakes her) · chimney #1
// x98 is a harmless warm lift · spider #1 wake floor 109.8, touch 112.38 → 20.4u · bat #1 trigger floor
// 124.5-2.2-4.5=117.8, post-dive drift -2 → 115.8 → 23.8u · shield lantern 89.6 is a gift. A true breath.
// ADVENT STUMP CLEAR-PATCH (x14, the law >=6u vs worst-case reach): Carol Boo #1 swoop+touch 25.2 →
// 11.2u clear (~1.9x the law) · Tangler #1 lasso reach 27.2 → 13.2u · bear 96.5 · CP0 foot traffic is
// candy and crows. Opening door twenty-five is a deliberate, safe act; the ambush spiders spawn on the
// kit's fixed scatter ring with the 1s grace. The gamble is the CHOICE, never a cheap hit.

// ---- THE QUIET PROP (never signposted): an axe left buried in a chopping stump, one red mitten still on
// the haft where a hand let go mid-swing, and a ring of tiny pine cones somebody small arranged around it
// afterward, evenly, carefully, like a memorial. Fully baked; story-readers stop, everyone else walks past. ----
function w9l3AxeMemorial(x, z){
  const g = new THREE.Group();
  const stump = mesh('cyl',[0.55,0.7,0.85,9], mat(W9PAL.bark)); stump.position.set(x,0.42,z); g.add(stump);
  const capS = mesh('cyl',[0.58,0.58,0.1,9], mat(W9PAL.snow)); capS.position.set(x,0.9,z); g.add(capS);
  const haft = mesh('cyl',[0.045,0.055,1.3,6], mat(0x6a5238)); haft.position.set(x+0.42,1.35,z); haft.rotation.z=-0.55; g.add(haft);
  const head = mesh('box',[0.34,0.2,0.09], mat(0x8a8f9a)); head.position.set(x+0.06,0.98,z); head.rotation.z=-0.55; g.add(head);
  const mitt = mesh('sph',[0.11,7,6], emat(0xd83a4a,0x8a1e2c,0.2)); mitt.scale.set(1,0.8,0.7); mitt.position.set(x+0.72,1.68,z); g.add(mitt);
  const thumb = mesh('sph',[0.05,5,4], emat(0xd83a4a,0x8a1e2c,0.2)); thumb.position.set(x+0.63,1.62,z+0.09); g.add(thumb);
  for(let i=0;i<7;i++){ const a=i/7*TAU; const cone2=mesh('sph',[0.09,5,4], mat(W9PAL.barkD)); cone2.scale.y=1.5;
    cone2.position.set(x+Math.cos(a)*1.15, 0.1, z+Math.sin(a)*1.15*0.7); g.add(cone2); }
  return g;
}

// ---- a woodcutter cookhouse hull for each chimney (the stack itself comes from w9Updraft) — baked ----
function w9l3Hut(x){
  const g = new THREE.Group();
  const body = mesh('box',[2.6,1.7,1.8], mat(W9PAL.bark)); body.position.set(x-0.9,0.85,-1.9); g.add(body);
  const roof = mesh('box',[3.0,0.24,2.1], mat(W9PAL.barkD)); roof.position.set(x-0.9,1.8,-1.9); roof.rotation.z=0.07; g.add(roof);
  const snowR = mesh('box',[2.9,0.14,2.0], mat(W9PAL.snow)); snowR.position.set(x-0.9,1.96,-1.9); snowR.rotation.z=0.07; g.add(snowR);
  const win = mesh('box',[0.4,0.4,0.06], emat(0xffb85e,0xff9a50,0.8)); win.position.set(x-1.4,0.95,-0.98); g.add(win);
  return g;
}

// ---- a DECOY bauble: identical dress to the Ornament Spider's disguise, zero legs — the "check
// everything for teeth" joke, laid on thick. Baked (real spiders sway a whisper in their hang state;
// the perfectly-still ones are the honest ones — observation is the counter-skill). ----
function w9l3Decoy(x, y, cc){
  const g = new THREE.Group();
  const wire = mesh('cyl',[0.015,0.015,1.0,4], mat(0x8a8f9a)); wire.position.set(x,y+0.85,0); g.add(wire);
  const ball = mesh('sph',[0.34,10,9], emat(cc,cc,0.35)); ball.position.set(x,y,0); g.add(ball);
  const cap = mesh('cyl',[0.1,0.12,0.12,8], mat(0xc9a24a)); cap.position.set(x,y+0.38,0); g.add(cap);
  const band = mesh('tor',[0.34,0.03,4,14], emat(0xffd23f,0xc9a24a,0.4)); band.rotation.x=Math.PI/2; band.position.set(x,y+0.05,0); g.add(band);
  return g;
}

// ---- bark rungs + rope loops dressing a climb strip (the verb made visible; the volume is the caller's) ----
function w9l3Rungs(x, y0, y1){
  const g = new THREE.Group();
  for(let y=y0+0.3; y<y1; y+=0.75){
    const peg = mesh('cyl',[0.05,0.07,0.6,5], mat(W9PAL.barkD)); peg.rotation.z=Math.PI/2; peg.position.set(x,y,0.1); g.add(peg);
    if(((y*4)|0)%3===0){ const loop = mesh('tor',[0.16,0.035,5,10], mat(0x9a8a5a)); loop.position.set(x+0.28,y+0.35,0.1); g.add(loop); }
  }
  return g;
}

// ---- a stacked log pile (visual for the yard's high-line platforms) ----
function w9l3LogPile(x, y, w){
  const g = new THREE.Group();
  for(let r2=0;r2<2;r2++) for(let i=0;i<3;i++){
    const log = mesh('cyl',[0.32,0.36,w,7], mat(i%2?W9PAL.bark:0x4a3a2a));
    log.rotation.x=Math.PI/2; log.position.set(x-0.7+i*0.7-(r2*0.35), y-0.95+r2*0.62, 0); g.add(log);
  }
  const capS = mesh('box',[w*0.62,0.1,1.6], mat(W9PAL.snow)); capS.position.set(x-0.15,y-0.28,0); g.add(capS);
  return g;
}

function buildW9L3(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;                 // packed forest floor — grippy everywhere (no slick in a climb level)
  const BARK = W9PAL.bark;
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();                // two strings: the camp's welcome and the gate's farewell

  // =============================== BEAT 1 — THE CAMP GATE (x -8..24) ===============================
  groundX(G, -8, 51, SNOW);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  signPost(G, 6, 1.7, -0.12, "THE WOODCUTTERS' CAMP. The saws stopped mid-cut and the carol stopped mid-verse - the middle singer never came back, and the other two are still holding his part open. Mind the yard. Everything here kept working. Nothing here kept friendly.");
  deco.add(w6LightPost(3, -2.0, 3)); deco.add(w6LightPost(9.5, -2.0, 3));
  w6String(L, 3, 2.95, 9.5, 2.95, {z:-1.9});
  { const lamp = new THREE.PointLight(0xffb85e, 20, 9); lamp.position.set(7, 3.2, -1.5); S.add(lamp); }   // REAL LIGHT #1 — the camp's last warm pool
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 2);
  // THE ADVENT STUMP — the gamble, in its CLEAR POCKET (reach ledger in the header; law honored ~1.9x)
  { const st = new AdventStump(14, 0, -0.9, 0.2); G.coffins.push(st); G.ents.add(st); }
  // THE QUIET PROP (never signposted): the axe, the mitten, the ring of little cones
  deco.add(w9l3AxeMemorial(19.2, -2.1));
  deco.add(w6GiftBox(11, -2.6, 0.7)); deco.add(w6GiftBox(11.7, -2.4, 0.55));
  deco.add(w6SnowmanDeco(-4.5, -2.6, 0.8, 0.4));
  G.ents.add(new Crow(24.5, 0.95, 2.1));    // camp crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE SAW YARD (x 24..51): INTRODUCE ===============================
  // THE DUET — Carol Boos on ONE 6s carol, verses 0 and 2 (phase 0 both, lockstep): sing 0-2s, SILENCE 2-4s
  // (the missing middle voice), sing 4-6s. The singing is the telegraph; the swoop lands on each verse's
  // last beat; STARING at a singer gives it stage fright and silences that verse — conduct the round.
  G.ents.add(new CarolBoo(G, 28.5, 2.7, 0, {verse:0, period:6.0, range:9, phase:0.0}));
  G.ents.add(new CarolBoo(G, 38.5, 2.9, 0, {verse:2, period:6.0, range:9, phase:0.0}));
  // the third music stand, empty, snow on the sheet — the round's missing chair (sign #1 carries the joke)
  { const pole = mesh('cyl',[0.03,0.04,1.1,5], mat(W9PAL.barkD)); pole.position.set(33.5,0.55,-1.9); deco.add(pole);
    const board = mesh('box',[0.5,0.4,0.05], mat(0xf0e6c8)); board.position.set(33.5,1.2,-1.9); board.rotation.x=-0.4; deco.add(board);
    const snowB = mesh('box',[0.46,0.05,0.3], mat(W9PAL.snow)); snowB.position.set(33.5,1.32,-1.85); snowB.rotation.x=-0.4; deco.add(snowB); }
  // TINSEL TANGLER #1 — the low lane's time tax (0.7s glitter-twirl, then the loop; spin shakes it off).
  // Its lasso tops out at y1.5 — the LOG-PILE HIGH LINE rides clean above it (risk trade: the duet swoops
  // dip to y1.1..1.3, so the piles trade lasso pressure for song pressure — the routes CROSS here).
  G.ents.add(new TinselTangler(G, 33, 0, 0, {phase:0.6, range:2.6, dir:1, speed:1.4, wakeR:5.5, lassoP:4.0}));
  platform(G, 30.8, 1.7, 0, 2.6, 2.4, BARK);  deco.add(w9l3LogPile(30.8, 1.7, 2.2));
  platform(G, 35.0, 2.2, 0, 2.4, 2.4, BARK);  deco.add(w9l3LogPile(35.0, 2.2, 2.0));
  candyLine(G, [[27,0.9,0],[33,0.9,0],[39,0.9,0]], 3);       // the low line — through the tangler's beat
  candyLine(G, [[30.8,2.6,0],[33,3.0,0],[35,3.2,0]], 3);     // the pile line — the high road's itch
  deco.add(w6Pine(26, -3.2, 1.6)); deco.add(w6Pine(44.5, -3.4, 1.9));
  deco.add(w9l3Decoy(26.2, 4.6, W9PAL.ornR)); deco.add(w9l3Decoy(45, 5.2, 0x7ae8ff));   // decoys start EARLY — paranoia is free
  // GAP #1 — THE FLUME CHANNEL (3.4u, tap law <=4): the camp's log-slide cut, teeth dressed below.
  // Crow #2 marks the lip (the house tell: a crow marks an edge).
  G.ents.add(new Crow(49.8, 0.95, 2.2));
  candyLine(G, [[50.2,1.0,0],[52.7,2.2,0],[55.2,1.0,0]], 3); // the arc, traced
  pitDressing(G, 51, 54.4, 'winter');

  // =============================== BEAT 3 — THE SAWDUST FLOOR (x 54.4..86): THE BAUBLE TRIPLETS ===============================
  groundX(G, 54.4, 151.3, SNOW);
  // the sawdust carpet — the mill floor reads underfoot
  { const dust = mesh('box',[26,0.08,7], mat(0x8a6f4a)); dust.position.set(71,0.05,0); deco.add(dust);
    const saw = mesh('cyl',[1.3,1.3,0.12,16], mat(0x8a8f9a)); saw.position.set(59,1.1,-2.6); saw.rotation.x=0.2; deco.add(saw);
    const sawMount = mesh('box',[1.8,0.9,0.8], mat(W9PAL.barkD)); sawMount.position.set(59,0.45,-2.7); deco.add(sawMount); }
  signPost(G, 56.8, 1.7, 0.1, "The Triplets remain. We have stopped asking why.");
  // sign clearance: T1's dying ball reaches 59-0.82=58.18 (1.4u clear of a reader — w7l4 precedent 1.1u) ·
  // gap #1's east lip is 3.8u clear of every dying ball. Reading is a breath, not a trap.
  // ONE shared clock (speed 4.2 over 21u lanes = 5.0s run + 2.5s pause = 7.5s period), phases in exact
  // thirds: a ball enters every 2.5s from a different mouth (76/80/84 — three staggered lanes, take-turns
  // tradition). Crown tops 1.64 — a TAP (1.8) always clears (owner speedrun rule). Stomp each once to end
  // the parade (attention test: stomp one while the next rolls). Rolling since level start — they have
  // ALWAYS been rolling; nobody asks why.
  G.ents.add(new BaubleTriplet(G, 80, 0, 0, {x1:59, speed:4.2, phase:0,   pause:2.5, color:0xd83a4a}));
  G.ents.add(new BaubleTriplet(G, 82, 0, 0, {x1:61, speed:4.2, phase:2.5, pause:2.5, color:0xffd23f}));
  G.ents.add(new BaubleTriplet(G, 84, 0, 0, {x1:63, speed:4.2, phase:5.0, pause:2.5, color:0x3aa060}));
  candyLine(G, [[64,2.5,0],[68,2.5,0]], 2);                  // the hop rhythm, traced at crown-clear height
  candyLine(G, [[72,2.5,0],[76,2.5,0]], 2);
  G.ents.add(new Heart(87, 1.0, 0));                         // mercy after the parade, before the pine

  // =============================== BEAT 4 — THE GREAT PINE (x 86..142): the CLIMB ===============================
  G.ents.add(new BonkLantern(G, 89.6, 1.5, 0, 'shield'));    // armor before the boughs
  candyLine(G, [[88,0.9,0],[90.5,0.9,0]], 2);
  // CP1 — THE level's ONE lit lantern (x92 of the -8..178 span = 53.8%; the walk-back is part of the price).
  // Reach ledger pinned in the header — nothing reaches an idle player here.
  G.ents.add(new Checkpoint(92, 0, 1.6, 1));
  signPost(G, 94.4, 1.7, -0.1, "THE GREAT PINE. Two roads up. The cookhouse chimneys breathe WARM - hop into the smoke and it carries you (mind your aim; smoke is not a staircase). Or take the branch road - hold UP on the bark to climb, big hop off the top. The boughs are decorated. Count the legs before you trust a bauble.");
  // THE LOG YARD BELOW — Somnambear sleepwalks the pine's base (patrol 100..106): a soft wall asleep,
  // 0.7s rear-up roar + ONE 7u/s blind swipe if her path is crossed (swipe reach 96.5..109.5 — never the
  // lantern, never the ladder foot at 110.9). The EXPRESS sails clean over her; ladder walkers pay the
  // telegraphed toll once per approach. Climb falls land on soft snow beside her — seconds, not hearts
  // (owner law 6a), and she only bites the careless.
  G.ents.add(new Somnambear(G, 103, 0, 0, {phase:0.3, range:3.0, dir:1, speed:0.85}));
  { const yardLogs = w9l3LogPile(100.5, 1.1, 2.4); yardLogs.position.z=-2.6; deco.add(yardLogs); }
  { const yardLogs2 = w9l3LogPile(107.5, 1.1, 2.0); yardLogs2.position.z=-2.8; deco.add(yardLogs2); }
  // --- THE EXPRESS (LEFT): two chimney updrafts. Column w1.8 (|dx|<0.9 — the aim IS the price), lift
  // caps at vy 5.2, tops over-clear their landings (7.2 > ledge 5.4 · 12.2 > bough 11.2, comparable-heights
  // law). Chimney #1 -> garland ledge -> hop the 1.4u to chimney #2's smoke (airborne over the bear) ->
  // drift right at the crown onto the west bough. Candy glitters inside both columns — the racing line. ---
  deco.add(w9l3Hut(98)); deco.add(w9l3Hut(105));
  w9Updraft(G, 98,  {w:1.8, top:7.2});
  w9Updraft(G, 105, {w:1.8, top:12.2});
  platform(G, 101.5, 5.4, 0, 2.4, 2.4, BARK);                // the garland ledge between the smokes
  candyLine(G, [[98,3.4,0],[98,5.6,0]], 2);                  // column #1, traced
  candyLine(G, [[99.9,6.9,0],[101.5,6.3,0]], 2);             // the hop-off arc
  candyLine(G, [[105,4.2,0],[105,7.2,0],[105,10.2,0]], 3);   // column #2 — the long breath
  candyLine(G, [[106.4,12.0,0],[107.9,11.8,0]], 2);          // the drift-right landing line
  // --- THE LADDER (RIGHT): branch-hop + two bark-rung climb strips. Rises 1.8-1.9, hops <=3.5 (tap law),
  // everything higher gated by the climb verb. SPIDER #1's thread-lane (x113, reel 2.6..6.8) crosses the
  // b1->b2 hop arc — time it or stomp it mid-reel (the fast answer); ground walkers pass UNDER its lane
  // untouched (reel floor 2.6 vs head 1.65). ---
  platform(G, 110.9, 1.9, 0, 2.6, 2.4, BARK);                // b1
  platform(G, 114.4, 3.7, 0, 2.4, 2.4, BARK);                // b2
  candyLine(G, [[111.8,3.2,0],[113,3.8,0],[114.2,3.2,0]], 3);// the timed hop, traced through the thread-lane
  G.world.addBox(117.9, 2.6, 0, 1.1, 5.6, 1.2, {type:'climb'});   // CLIMB A — bark rungs, y2.6..8.2
  deco.add(w9l3Rungs(117.9, 2.6, 8.2));
  candyLine(G, [[117.9,4.6,0],[117.9,6.6,0]], 2);            // climb rhythm
  platform(G, 114.9, 8.3, 0, 2.2, 2.4, BARK);                // b3 — the spiral turns (boosted hop LEFT off A;
                                                             // headroom to the west bough: head 9.95 < bottom 10.7)
  G.world.addBox(117.9, 8.6, 0, 1.1, 3.0, 1.2, {type:'climb'});   // CLIMB B — rope loops, y8.6..11.6
  deco.add(w9l3Rungs(117.9, 8.6, 11.6));
  candyLine(G, [[116.5,12.2,0],[120.6,11.6,0]], 2);          // the top-out choice: LEFT is always safe, RIGHT
                                                             // crosses SPIDER #2's lane (the guard — time it)
  // THE BOUGHS — the canopy highway, split at the trunk (west y11.2, east y10.4 — trees grow how they like)
  platform(G, 111.9, 11.2, 0, 10.2, 2.8, BARK);              // west bough: 106.8..117.0
  platform(G, 123.5, 10.4, 0, 7.8, 2.8, BARK);               // east bough: 119.6..127.4
  candyLine(G, [[122.5,11.4,0],[125.5,11.4,0]], 2);
  // ORNAMENT SPIDERS — fixed thread-lanes beside the climbs (the D5 dodge-while-you-climb chain). Each
  // rattles + unfolds 0.6s on wake (the telegraph floor), reels its lane forever, re-disguises when left.
  // #1 x113 (reel 2.6..6.8) the b1->b2 hop · #2 x119.4 (reel 9.0..12.6) the top-out's right hop + the
  // hollow notch · #3 x128.3 (reel 5.6..11.8) the descent gap to the timber wall (0.3u clear of the bough
  // lip — standing at the lip is safe; the HOP is the timed move). All stompable mid-reel: the fast line.
  G.ents.add(new OrnamentSpider(G, 113,   6.8, 0, {phase:0.4, dropY:2.6, wakeR:3.2, period:3.4, color:0xd83a4a}));
  G.ents.add(new OrnamentSpider(G, 119.4, 12.6, 0, {phase:1.1, dropY:9.0, wakeR:3.0, period:3.0, color:0xffd23f}));
  G.ents.add(new OrnamentSpider(G, 128.3, 11.8, 0, {phase:2.2, dropY:5.6, wakeR:3.4, period:3.6, color:0x3aa060}));
  // ...and the DECOYS they hide among (count the legs)
  deco.add(w9l3Decoy(109.8, 9.6, W9PAL.ornR)); deco.add(w9l3Decoy(112.6, 9.9, 0x3aa060));
  deco.add(w9l3Decoy(115.3, 6.2, 0x7ae8ff));  deco.add(w9l3Decoy(122.6, 9.3, W9PAL.ornR));
  deco.add(w9l3Decoy(126.3, 9.5, W9PAL.ornG));
  // BLIZZARD BAT #1 — the canopy air (patrol 122.3..126.7 at y13.6, trigger floor 117.8): the bough
  // crossing is contested from above (squeak, snapshot dive — keep walking and it misses). The express and
  // the ladder's lower half are bat-free; worst simultaneous on the east bough = spider + bat = 2.
  G.ents.add(new BlizzardBat(G, 124.5, 13.6, 0, {phase:0.7, range:2.2, period:3.6, aggroR:4.5}));
  G.ents.add(new BonkLantern(G, 125.9, 12.4, 0, 'bat'));     // the crown prize: 18s of wings for the run home
  // THE HOLLOW — GOLDEN PUMPKIN idx 1. Its amber glow bleeds through a KNOTHOLE in the trunk's face
  // (visible from the whole climb — the lure); the way in is the notch at the east bough's west edge:
  // step off hugging the trunk and drop BEHIND the bark (the z<0 route read — the back-branch's visual
  // bough curls behind the trunk at z-1.3, the foreground bark shells at z+0.75 swallow Pip whole) onto
  // the hidden branch at y6.3. Getting out is a drop to soft snow and a re-climb — exploration's tax.
  platform(G, 121.0, 6.3, 0, 2.2, 2.0, BARK);                // the back-branch: 119.9..122.1
  G.ents.add(new GoldPumpkin(121.3, 7.3, 0, 1));             // its own PointLight IS the knothole glow
  candyLine(G, [[120.6,9.4,0],[121.2,7.8,0]], 2);            // the quiet lure down the notch
  { const shellM = mat(W9PAL.barkD);
    const sh1 = mesh('box',[1.0,2.6,0.3], shellM); sh1.position.set(120.7,7.0,0.75); sh1.rotation.z=0.06; deco.add(sh1);
    const sh2 = mesh('box',[0.8,2.6,0.3], shellM); sh2.position.set(122.3,7.0,0.75); sh2.rotation.z=-0.05; deco.add(sh2);
    const knot = mesh('tor',[0.26,0.08,6,14], mat(W9PAL.bark)); knot.position.set(121.45,7.05,0.78); deco.add(knot);
    const knotGlow = mesh('circ',[0.24,12], emat(0xffb85e,0xffa040,1.1)); knotGlow.position.set(121.45,7.05,0.79); deco.add(knotGlow);
    const backBough = mesh('cyl',[0.22,0.3,3.4,7], mat(W9PAL.bark)); backBough.rotation.z=1.35; backBough.position.set(121.6,6.0,-1.3); deco.add(backBough); }
  // THE TRUNK + CANOPY (visual only — no collider: the base stays an open recovery lane, and the hollow's
  // exit drop can always walk back west to re-climb)
  { const trunk = mesh('cyl',[2.1,2.9,15.5,12], mat(W9PAL.bark)); trunk.position.set(118.6,7.75,-2.4); deco.add(trunk);
    for(let i=0;i<5;i++){ const ridge = mesh('box',[0.3,rand(3,6),0.25], mat(W9PAL.barkD)); ridge.position.set(116.9+i*0.85, rand(3,9), -0.85+((i%2)?-0.3:0.1)); deco.add(ridge); }
    for(let t2=0;t2<3;t2++){ const tier = mesh('cone',[6.2-t2*1.5, 3.4, 9], mat(t2%2?W9PAL.pine:W9PAL.pineD)); tier.position.set(118.6, 13.6+t2*2.1, -2.6); deco.add(tier);
      const capT = mesh('cone',[5.4-t2*1.4, 1.1, 9], mat(W9PAL.snow)); capT.position.set(118.6, 14.7+t2*2.1, -2.6); deco.add(capT); }
    // bough arms under the platforms + the spiders' anchor spurs
    const armW = mesh('cyl',[0.32,0.55,10.6,7], mat(W9PAL.bark)); armW.rotation.z=Math.PI/2; armW.position.set(112.2,10.9,-0.6); deco.add(armW);
    const armE = mesh('cyl',[0.28,0.5,8.2,7], mat(W9PAL.bark)); armE.rotation.z=Math.PI/2; armE.position.set(123.4,10.1,-0.6); deco.add(armE);
    const spur1 = mesh('cyl',[0.09,0.13,2.0,6], mat(W9PAL.bark)); spur1.rotation.z=Math.PI/2; spur1.position.set(113,8.1,-0.4); deco.add(spur1);
    const spur3 = mesh('cyl',[0.09,0.13,2.2,6], mat(W9PAL.bark)); spur3.rotation.z=Math.PI/2; spur3.position.set(128.3,13.1,-0.4); deco.add(spur3); }
  // THE TIMBER WALL — the camp's great stacked cut, sealing the ground road (6.6 > every ungated jump):
  // the canopy IS the way over. Descend its top ridge and the log-end steps beyond.
  G.world.addBox(132.5, 0, 0, 9, 6.6, 10, {});
  { for(let row=0;row<4;row++) for(let i=0;i<5;i++){
      const log = mesh('cyl',[0.85,0.85,8.6,9], mat((row+i)%2?W9PAL.bark:0x4a3a2a));
      log.rotation.x=Math.PI/2; log.position.set(128.9+i*1.8, 0.85+row*1.62, -0.7); deco.add(log);
      const ring = mesh('circ',[0.68,10], mat(0x6a5238)); ring.position.set(128.9+i*1.8, 0.85+row*1.62, 3.62); deco.add(ring); }
    const capW = mesh('box',[9,0.18,8.8], mat(W9PAL.snow)); capW.position.set(132.5,6.68,-0.7); deco.add(capW); }
  candyLine(G, [[128.3,9.4,0],[129.8,7.8,0]], 2);            // the descent hop — timed through SPIDER #3's lane
  G.ents.add(new Heart(134, 7.4, 0));                        // mercy on the ridge — the exam's second page waits
  platform(G, 138.7, 4.4, 0, 2.2, 2.4, BARK);                // log-end steps down the far side
  platform(G, 141.2, 2.2, 0, 2.0, 2.4, BARK);
  candyLine(G, [[137.8,5.8,0],[140.2,3.6,0]], 2);

  // =============================== BEAT 5 — THE GARLAND RUN (x 142..172): MASTER ===============================
  // The full composition: three ORNAMENT WRECKING-PENDULUMS on one 3s clock family (phases 1.0/2.0/0.0 — a
  // marching wave), TANGLER #2 taxing the run-up (lasso reach 140.6..151.4 — it can tag the very lip, but
  // tinsel only SLOWS: spin it off at the candy beat before you commit to the gap), the CREVASSE (4.6u held,
  // <=5.5 law) jumped THROUGH pendulum #2's arc at its away-beat, and BAT #2 contesting the landing. Worst
  // simultaneous at the gap: bauble + tangler + bat = 3 systems (cap holds). Every beat fixed-clock.
  deco.add(w6Pine(144, -3.6, 2.3)); deco.add(w6Pine(153.5, -3.8, 2.6)); deco.add(w6Pine(163, -3.6, 2.2));
  G.ents.add(new W9Bauble(G, 146.4, 4.9, {len:3.7, amp:0.8, period:3.0, phase:1.0, r:0.7, color:0xd83a4a}));
  G.ents.add(new W9Bauble(G, 153.6, 5.2, {len:3.7, amp:0.8, period:3.0, phase:2.0, r:0.7, color:0xffd23f}));
  G.ents.add(new W9Bauble(G, 162.4, 5.0, {len:3.7, amp:0.8, period:3.0, phase:0.0, r:0.7, color:0x3aa060}));
  G.ents.add(new TinselTangler(G, 146, 0, 0, {phase:1.4, range:2.2, dir:-1, speed:1.5, wakeR:5.5, lassoP:3.6}));
  candyLine(G, [[143.4,1.0,0],[146.4,2.3,0],[149.4,1.0,0]], 3);   // through pendulum #1 on its beat; the 149.4
                                                                  // candy is the SHAKE-IT-OFF stop before the gap
  G.ents.add(new Crow(150.6, 0.95, 2.2));                    // crow #3 marks the edge, as crows do
  pitDressing(G, 151.3, 155.9, 'winter');                    // GAP #2 — the crevasse under the middle ornament
  candyLine(G, [[150.6,1.2,0],[153.6,2.7,0],[156.6,1.2,0]], 3);   // the held arc, traced through the swing window
  G.ents.add(new BlizzardBat(G, 159.5, 5.6, 0, {phase:2.1, range:2.2, period:3.8, aggroR:4.5}));
  candyLine(G, [[158.6,1.0,0],[162.4,2.3,0],[166,1.0,0]], 3);     // the landing sprint — pendulum #3's beat
  signPost(G, 169.4, 1.7, -0.1, "The garland run. They strung every light for a festival that never came - and you climbed the Great Pine and came down the far side anyway. The woodcutters would have bought you a cocoa. Mind the last ornaments. They swing with feelings.");
  // sign clearances: bat #2 trigger+drift max 159.5+2.2+4.5+2=168.2 (1.2u clear) · pendulum #3 sweep max
  // 165.1+0.7=165.8 (3.6u) · the gate is a gate. Reading is a breath.
  groundX(G, 155.9, 178, SNOW);
  deco.add(w6LightPost(166.5, -1.9, 3)); deco.add(w6LightPost(170.5, -1.9, 3));
  w6String(L, 166.5, 2.95, 170.5, 2.95, {z:-1.8});
  deco.add(w6SnowmanDeco(168, -2.4, 0.7, 0.5));
  candyLine(G, [[169.5,0.9,0],[171,0.9,0]], 2);
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(172.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 172);
  // LIGHT BUDGET: camp lamp + AdventStump glow + CP1 + GoldPumpkin + gate lamp = 5 real PointLights (<=6).

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // FOREGROUND silhouettes (z>0): near-black pine shoulders + drift slabs framing the depth
  for(const [fx,fr] of [[40,0.35],[90,-0.3],[120,0.3],[160,-0.35]]){
    const slab = mesh('box',[1.6,1.1,0.5], mat(0x0e1826)); slab.position.set(fx, 0.4, 2.7); slab.rotation.z = fr; deco.add(slab);
  }
  deco.add(w6Pine(-4, 2.6, 1.3)); deco.add(w6Pine(96.5, 2.5, 1.1)); deco.add(w6Pine(175, 2.5, 1.2));
  S.add(bakeGroup(deco));

  // the winter moon through the canopy, low beyond the Great Pine
  const moon = mesh('circ',[3.6,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(112, 16, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',5.8,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(112, 16, -30.2); S.add(moonH);

  w9Parallax(S, -8, 178);
  w9LevelFinish(G, -8, 178, null);           // null clutter: baked props must not float over the two pits
                                             // (w7l4 precedent) — the solid spans are cluttered manually
  w9Clutter(G, -8, 50.6, 'forest');
  w9Clutter(G, 54.8, 150.9, 'forest');
  w9Clutter(G, 156.3, 178, 'forest');

  // festival strings live (shared mats + one twinkle ticker)
  w6LightsFinish(G, L);

  return {spawnX: 0, exitX: 172};
}

function updateW9L3(G, dt){
  updateLevelCommon(G, dt);
}

W9_LEVELS.push({id:'w9l3', district:'w9', name:"THE WOODCUTTERS' CAMP", build:buildW9L3, update:updateW9L3, parTime:190});

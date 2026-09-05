// ============ LEVEL 8-3 — THE DEEP FACE (District 8 · The Icicle Mines · the glittering dark) ============
// POST-STORY MASTERY BAND (beyond D5, MAIN-GAME FAIR): hearts-always, telegraphs >=0.6s (knock 0.9s / glint
// 0.6s / icicle shimmer 0.7s), <=4 simultaneous threat systems anywhere, every clock fixed from level start,
// one-good-run-away. 8-3 is the district's CLIMB level: the great working face of the mine, scaled on hanging
// CLOCK-CHAINS (w5Chain — the mines inherited the castle's ironmongery) and TIMBER LADDERS, with the miners'
// oldest warning living IN the rock: a Knocker Sprite always finishes its glide AT THE CHAIN COLUMN and knocks
// three times (tap... tap... TAP, 0.9s, fully audible) before bursting out — the D5 dodge-while-climbing chain,
// worked three times up the face. Checkpoint law: EXACTLY CP0 (noLight) + ONE lit lantern at the HALF-FACE
// LANDING (x83 of -8..170 ≈ 51%). NO warp here (the Off-Limits Bucket rides another level), NO Golden Pumpkins
// beyond idx 1 (the vug), NO Leap of Faith (both of the game's two are placed and sacred).
//
//   BEAT 1 THE ADIT (warm-up)            x -8..30   — CP0 (noLight), the knock-warning sign, a Rubblekin pile
//          among honest rubble, Crystal Moth air lane, the last kind lamplight before the face.
//   BEAT 2 THE LOWER FACE (INTRODUCE)    x 30..53   — THE BRANCHING CLIMB. LEFT CHAIN-LINE: chain -> ledge ->
//          chain into the CRYSTAL VUG (GOLDEN PUMPKIN idx 1 — its amber glow visible through a gap in the
//          scaffold boards from the ladder route: the junction itch). RIGHT TIMBER LADDER: the foreman's quick
//          way. Knocker #1 bursts at the vug chain's column; falls here land on safe adit ground (gentle intro
//          even in the mastery tier — w5l4's courtyard law).
//   BEAT 3 THE GALLERY & THE WINZE (TWIST) x 53..69 — Gem Mimic among decoy clusters on Bench One, a Blizzard
//          Bat overhead, then out over THE WINZE (true void — heart + walk-back): stalactite clocks over the
//          gallery hops, a Crystal Moth stitched to the seesaw's own 5.6s clock.
//   BEAT 4 THE OVERHANG & THE COUNTERWEIGHT x 66..79 — the mid-face brow can't be climbed; the SEESAW PAIR is
//          the only way: board LOW, ride HIGH, drop to the sunken twin at the apex, ride HIGH again, jump at
//          apex onto the lip — candy marks every beat of the dance.
//   BEAT 5 THE HALF-FACE LANDING (breath) x 79..90  — THE lantern (the level's ONE lit checkpoint), a shield
//          lantern, and the QUIET PROP chiseled into the face beside it.
//   BEAT 6 THE UPPER FACE (ESCALATE)     x 90..114  — the full composition: chain #3 through Knocker #2's
//          burst point -> stalactite slalom on the high bench -> chain #4 through Knocker #3 -> THE CREST
//          (Blizzard Bat air + a Gem Mimic among the crest crystals + a mercy Heart + a bat-wings lantern).
//   BEAT 7 THE DESCENT (exhale w/ teeth)  x 114..131 — three big free-fall steps down the far side (the
//          climb-exit hop finally gets its targets), candy tracing the drop lines.
//   BEAT 8 THE SORTING FLOOR (MASTER)    x 131..170 — MID-BOSS: THE GRAVEL TRIPLETS on staggered thirds of one
//          shared 5.4s clock (the proud Frostmere tradition, sign included), then the GLIMMERING GEODE in its
//          clear pocket, then the gate.
//
// ROUTES (2-3 visible, junction sighted): LOW/QUICK = the timber ladders (the foreman's way — faster, plainer) ·
// HIGH/RICH = the chain-line (rhythm candy up every strand + the vug's Golden Pumpkin; carries the knocker
// pressure — reward scales with risk) · the vug itself is the expert pocket (its glow visible from the ladder
// through the scaffold-board gap: "next run I'm going up there").
//
// COMPARABLE-HEIGHTS LEDGER (jump model: tap 1.8 / held 2.6 / double 3.3; steps <=2.2; gaps <=4 tap, <=5.5 held):
//   ledge rises on foot: G1 +0.4 · G2 +0.4 · U0 +0.4 · U2 +0.6 · brow lip +0.32 — all trivial over-clearance.
//   gaps: bench->G1 2.5 (over SAFE ground) · G1->G2 2.0 · G2->seesaw-A 3.5 · A->B 4.0 (falling transfer, drop
//   4.8) · B-apex->lip 2.0 (+0.32) · U1->U2 1.0 · descent hops 1.5 (drops 4.6-5.2, falls are free) · vug->bench
//   1.3 (drop 3.4). Every rise over 2.2 is GATED: chains/ladders (climb verb) or the seesaw (machine).
// DETERMINISM: every knocker/icicle/seesaw/moth/bat/triplet runs a fixed period+phase from level start; the
// moth at the winze shares the seesaw's 5.6s clock so the overhang composition repeats EXACTLY; the triplets
// share one 5.4s clock in staggered thirds. No Math.random on the critical path (rand() only in baked deco).
// HEARTS ALWAYS: knock-burst/mimic-snap/pebble/icicle/moth/bat/triplet all cost exactly 1; the winze and the
// upper-face void are the kit's full pit price (heart + lantern walk-back), dressed 'winter' so the danger reads.
//
// SPAWN SAFETY (CP0 at x2/z1.6, body edge 2.4): Rubblekin x16 wakeR 5.5, treat reach wakeR+4 -> floor 6.5
// (4.1u clear; it only waddles while the player is NEAR — never leashes back to the lantern) · Moth #1 min
// reach 24-3.2-0.6=20.2 (17.8u) · Knocker #1 is harmless while gliding and its burst hitbox lives at its x1
// column 39.8±0.6 (face-lunge allowance ±2.0 -> min 37.8, 35u) AND in a y-window (5.0..6.95) no ground-stander
// can enter · Mimic #1 worst snap reach 49.5-2.6-3.4-0.66=42.8, at bench height y6 besides (40u) · Bat #1
// trigger-drift min 51.5-2.5-4.5-2=42.5 (40u) · icicles ≥57.4, at height · seesaw movers harmless · triplets
// ≥139.2 · geode ambush opt-in at 166. All clear.
// LANTERN SAFETY (CP1 at x83/y11.6 on the landing, body 82.6..83.4): Knocker #2 burst point x1=94.4 (±2.0 ->
// 92.4, 9.0u) AND its y-window (12.8..14.75) is unreachable from the 11.6 deck (stander top 12.8 misses it —
// double-locked) · icicle columns ≥96.4-0.5=95.9 (12.5u), and they fall onto U1's 15.6 floor, a different deck
// · Moth #2 max reach 66+2.2+0.6=68.8 (13.8u) · Bat #1 max trigger-drift 51.5+2.5+4.5+2=60.5 (22u) · Bat #2
// min 111-2.5-4.5-2=102 (18.6u) · Mimic #2 min reach 110.5-2.6-3.4-0.66=103.8, at y19.4 besides (20u) ·
// seesaw B swings a fixed 75..77 column, never nearer than 5.6u and it is a platform, not a threat · void lips
// at 79 and 90 sit 3.6u/6.6u off the lantern. The pocket is a true breath.
// GEODE CLEAR-PATCH (x166, worst-case reach): triplet lanes end at 157, ball touch reach 157+0.76=157.76
// (8.2u clear, >=6 law honored) · crow at 161 is harmless deco · Bat #2 worst drift 120 (46u) · Mimic #2 max
// reach 114.6 (51u) · Rubblekin treat-reach 25.5 (140u) · nothing patrols past 158. Opening is a deliberate,
// safe act; the mimic-nest ambush spawns on the kit's 1s grace, scattered ±1.4/±2.6.

// ---- THE QUIET PROP: initials and a heart chiseled into the deep face beside the half-way lantern, ringed by
// five-bar tally clusters — hundreds of shifts counted down one wall of rock, and someone to come home to.
// Never signposted, never glowing; story-readers stop, everyone else climbs past. Fully baked. ----
function w8l3ChiselHeart(x, y, z){
  const g = new THREE.Group();
  const slab = mesh('box',[1.8,1.3,0.1], mat(W8PAL.rockL)); g.add(slab);              // the smoothed patch of face
  const gm = mat(0x1c1626);                                                            // groove-dark
  // initial glyph left (an E-ish mark)
  { const sp=mesh('box',[0.05,0.34,0.04], gm); sp.position.set(-0.42,0.14,0.06); g.add(sp);
    for(const yy of [0.30,0.14,-0.02]){ const arm=mesh('box',[0.16,0.05,0.04], gm); arm.position.set(-0.33,yy,0.06); g.add(arm); } }
  // the heart, center — carved a little deeper than everything else
  { const hm = mat(0x141020);
    for(const s of [-1,1]){ const lobe=mesh('sph',[0.09,7,6], hm); lobe.position.set(s*0.07,0.22,0.06); lobe.scale.z=0.4; g.add(lobe); }
    const tip=mesh('cone',[0.13,0.2,4], hm); tip.rotation.x=Math.PI; tip.rotation.y=Math.PI/4; tip.position.set(0,0.08,0.06); tip.scale.z=0.4; g.add(tip); }
  // initial glyph right (an M-ish mark)
  { for(const sx of [0.28,0.5]){ const v=mesh('box',[0.05,0.34,0.04], gm); v.position.set(sx,0.14,0.06); g.add(v); }
    for(const s of [-1,1]){ const d=mesh('box',[0.05,0.2,0.04], gm); d.position.set(0.39+s*0.05,0.2,0.06); d.rotation.z=s*0.55; g.add(d); } }
  // the tally ring — five-bar gates arcing around the pair, worn shallower with age
  for(let c=0;c<7;c++){
    const a = Math.PI*0.15 + (c/6)*Math.PI*0.7;
    const cx = Math.cos(a)*0.72, cy = -0.28 - Math.sin(a)*0.22;
    for(let i=0;i<4;i++){ const t=mesh('box',[0.025,0.13,0.03], gm); t.position.set(cx-0.075+i*0.05, cy, 0.06); g.add(t); }
    const x5=mesh('box',[0.025,0.2,0.03], gm); x5.position.set(cx, cy, 0.065); x5.rotation.z=0.9; g.add(x5);
  }
  g.position.set(x,y,z);
  return g;
}

// ---- timber ladder: the scaffold climb (visible rails + rungs, baked) over a standard {type:'climb'} volume —
// same grab/boost contract as w5Chain, the mines' quick-route flavor. ----
function w8l3Ladder(G, x, y0, y1){
  const g = new THREE.Group(), h = y1-y0;
  for(const s of [-0.28,0.28]){ const rail=mesh('box',[0.09,h,0.09], mat(W8PAL.timber)); rail.position.set(x+s, y0+h/2, 0); g.add(rail); }
  for(let yy=y0+0.25; yy<y1-0.08; yy+=0.38){ const rung=mesh('cyl',[0.045,0.045,0.62,5], mat(W8PAL.timberD)); rung.rotation.z=Math.PI/2; rung.position.set(x, yy, 0); g.add(rung); }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, y0, 0, 0.9, h, 1.2, {type:'climb'});
}

// ---- deck signpost: the kit's signPost plants at y0, but the counterweight must be taught where it stands —
// same pole/board, planted on a ledge; the prompt check is x/z-only so it reads exactly like a ground sign. ----
function w8l3HighSign(G, x, y, z, ry, text){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(W8PAL.timberD)); pole.position.y=0.7; g.add(pole);
  const board = mesh('box',[1.5,0.8,0.1], mat(W8PAL.timber)); board.position.y=1.5; crook(board,0.04); g.add(board);
  g.position.set(x,y,z); g.rotation.y=ry;
  G.scene.add(g);
  G.signs.push({x,z,text});
}

function buildW8L3(G){
  const S = G.scene;
  levelBegin(G);

  const ROCK  = W8PAL.rock;    // main ground + working ledges
  const ROCKL = W8PAL.rockL;   // landing ledges (the "step here" read)
  const ROCKD = W8PAL.rockD;   // the vug + face slabs (dark = special/backing)
  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE ADIT (x -8..30) ===============================
  groundX(G, -8, 56, ROCK);                                  // one rock floor to the winze lip at 56 — the whole
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));  // lower face falls SAFE. CP0 — start (exam law).
  signPost(G, 5.5, 1.7, -0.12, "THE DEEP FACE. Grab a chain or a ladder with UP, leap off with a boost. And mind the miners' oldest rule: when the rock knocks three times, it is not asking to come in - it is coming OUT. Count the knocks. Be elsewhere.");
  // the last kind lamplight before the face (real light #1 of 4)
  { const post=mesh('box',[0.22,3.0,0.24], mat(W8PAL.timberD)); post.position.set(7,1.5,-1.5); deco.add(post);
    const lamp=mesh('sph',[0.2,8,6], emat(W8PAL.crysA,W8PAL.crysA,0.9)); lamp.position.set(7,3.1,-1.3); deco.add(lamp);
    const pl0=new THREE.PointLight(0xffb85e, 26, 9); pl0.position.set(7,3.0,-0.8); S.add(pl0); }
  deco.add(w8TimberFrame(4)); deco.add(w8TimberFrame(12)); deco.add(w8TimberFrame(20)); deco.add(w8TimberFrame(28));
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 3);
  // RUBBLEKIN #1 — an innocent pile among honest rubble (the pile-lesson; decoy rocks bake beside it).
  // Spawn ledger: wake edge 10.5, waddle treat-reach floor 6.5 — CP0 stays 4.1u clear (see header).
  G.ents.add(new Rubblekin(G, 16, 0, 0, {phase:0, wakeR:5.5, speed:1.7, lobP:3.2}));
  for(const [rx,rz] of [[13.5,-1.1],[14.8,0.9],[18.2,-0.7],[17.4,1.2]]){ const rb=mesh('sph',[rand(0.22,0.34),7,6], emat(0x4a4058,0x241c30,0.12)); rb.scale.y=0.7; rb.position.set(rx,0.12,rz); deco.add(rb); }
  candyLine(G, [[13,0.9,0],[19,0.9,0]], 3);
  G.ents.add(new Crow(9, 0.95, 2.2));                        // tunnel crow #1 — the miners fed them; they stayed
  // CRYSTAL MOTH #1 — the air lane exists from the first minute (figure-eight over the adit's end)
  G.ents.add(new CrystalMoth(G, 24, 3.2, 0, {phase:0.6, rx:3.2, ry:1.1, period:5.2, color:0x7ae8ff}));
  candyLine(G, [[22,2.2,0],[24,3.0,0],[26,2.2,0]], 3);       // trace the duck-or-time rhythm under the moth

  // =============================== BEAT 2 — THE LOWER FACE (x 30..53): INTRODUCE — the branching climb ===============================
  signPost(G, 35, 1.7, 0.12, "The face splits here. CHAINS on the left: the long way, the rich way. LADDERS on the right: the foreman's way. The face does not care which you take - it knocks for everyone.");
  // LEFT CHAIN-LINE (rich): chain #1 -> ledge L1 -> chain #2 -> THE CRYSTAL VUG (GP idx 1) -> drop to Bench One
  w5Chain(G, 37.4, 0.2, 5.3);                                 // CHAIN #1 — ground -> L1 (sits 0.6 LEFT of L1's edge, tops 0.7 ABOVE its 4.6 deck: clean pop-out, the w5l4 idiom)
  candyLine(G, [[37.4,1.8,0],[37.4,4.6,0]], 3);               // rhythm candy up the strand
  platform(G, 39.5, 4.6, 0, 3, 3, ROCK);                      // LEDGE L1 (top 4.6, spans 38..41)
  w5Chain(G, 39.7, 4.4, 10.1);                                // CHAIN #2 — L1 -> the vug (grab from L1; tops 0.7 above the 9.4 vug deck)
  candyLine(G, [[39.7,5.6,0],[39.7,8.4,0]], 3);
  // KNOCKER #1 — lives in the lower face. It glides harmless (the traveling lantern-bump), then ALWAYS knocks
  // and bursts at its x1 = the CHAIN #2 COLUMN (39.8), y-window 5.0..6.95: only a climber mid-strand can be
  // bitten — L1 deck-standers (4.6, top 5.8 < window against the 6.2 wallY... the touch law needs pl.y>5.0 AND
  // pl.y<6.95 with pl.y+1.2>6.2 -> a 4.6 stander tops at 5.8 and misses) and ground walkers are safe. Count the
  // 0.9s of taps from the strand, then be above or below the bump. The D5 chain-dodge, mineral edition.
  G.ents.add(new KnockerSprite(G, 37, 6.2, 0, {phase:0, x0:34.0, x1:39.8, wallY:6.2, period:6.5, speed:2.0}));
  // THE CRYSTAL VUG — the expert pocket. GOLDEN PUMPKIN idx 1 glows amber through a deliberate gap in the
  // scaffold boards (foreground planks, z>0): from the ladder route you SEE the glow before you can name it.
  platform(G, 42, 9.4, 0, 3.4, 3, ROCKD);                     // the vug alcove (top 9.4, spans 40.3..43.7)
  G.ents.add(new GoldPumpkin(42, 10.6, 0, 1));                // GOLDEN PUMPKIN idx 1 — the chain-line's prize
  { const c1=w8CrystalCluster(41.0, -0.9, 0.9, W8PAL.crysA); c1.position.y=9.4; deco.add(c1);
    const c2=w8CrystalCluster(43.0, 0.7, 0.7, W8PAL.crysA); c2.position.y=9.4; deco.add(c2);
    const vglow=new THREE.Mesh(geo('circ',1.05,14), new THREE.MeshBasicMaterial({color:W8PAL.crysA, transparent:true, opacity:0.26, depthWrite:false}));
    vglow.position.set(42,10.6,-0.5); S.add(vglow); }         // the amber halo behind the gold (emissive fake — no real light)
  candyLine(G, [[41,10.2,0],[43,10.2,0]], 2);
  // the scaffold boards over the vug's front — four planks, one MISSING: the glow leaks through the gap
  for(const px of [40.6,41.3,43.0,43.7]){ const plank=mesh('box',[0.55,2.6,0.12], mat(W8PAL.timber)); plank.position.set(px,10.0,0.95); plank.rotation.z=rand(-0.03,0.03); deco.add(plank); }
  // RIGHT LADDER (quick): straight up to Bench One — plainer, faster, out of knocker #1's reach (x window 37.8..41.8 at worst)
  w8l3Ladder(G, 44.4, 0.2, 6.7);                              // LADDER #1 — ground -> Bench One (sits 0.6 left of the bench edge, tops 0.7 above the 6.0 deck)
  candyLine(G, [[44.4,2.0,0],[44.4,6.0,0]], 3);

  // =============================== BEAT 3 — BENCH ONE & THE WINZE (x 45..69): TWIST ===============================
  platform(G, 49, 6.0, 0, 8, 3, ROCKL);                       // BENCH ONE (top 6.0, spans 45..53) — both routes land here
  // GEM MIMIC #1 among REAL decoy clusters (the treasure-with-teeth lesson: exactly as boring as the real ones
  // until it GLINTS + rattles 0.6s). Snap range 46.1..52.9 stays on the bench — it never hops the lip.
  G.ents.add(new GemMimic(G, 49.5, 6.0, 0, {phase:0, wakeR:2.6, color:0xb08aff}));
  { const d1=w8CrystalCluster(46.2, -0.8, 0.7); d1.position.y=6.0; deco.add(d1);
    const d2=w8CrystalCluster(47.6, 0.9, 0.6); d2.position.y=6.0; deco.add(d2);
    const d3=w8CrystalCluster(51.6, -0.6, 0.8); d3.position.y=6.0; deco.add(d3); }
  candyLine(G, [[46.5,6.9,0],[48,6.9,0]], 2);
  // BLIZZARD BAT #1 — owns the bench airspace (patrol 49..54 at y9; squeak-telegraphed snapshot dive, the
  // learned rule). Trigger min 44.5 — the vug lip (43.7) can never wake it; the GP grab stays a clean pocket.
  G.ents.add(new BlizzardBat(G, 51.5, 9.0, 0, {phase:0.4, range:2.5, period:3.5, aggroR:4.5}));
  // ...and out over THE WINZE (the deep shaft — TRUE void, heart + walk-back; dressed so the danger reads)
  platform(G, 57.5, 6.4, 0, 4, 3, ROCK);                      // GALLERY G1 (top 6.4, spans 55.5..59.5)
  platform(G, 63.5, 6.8, 0, 4, 3, ROCK);                      // GALLERY G2 (top 6.8, spans 61.5..65.5)
  G.ents.add(new Heart(63.5, 7.8, 0));                        // mercy before the machine
  // STALACTITE CLUSTER #1 — two staggered ceiling-seam clocks over the gallery hops (shimmer + drip + growing
  // floor-glow ~0.7s, the learned winter language); they fall onto the G-decks, never into the boarding jump
  G.ents.add(new SpikeIcicle(G, 58.6, 10.4, {period:4.6, phase:0.0, len:1.2, floorY:6.4}));
  G.ents.add(new SpikeIcicle(G, 62.4, 10.6, {period:5.0, phase:1.7, len:1.2, floorY:6.8}));
  candyLine(G, [[59.0,7.6,0],[60.5,8.0,0],[62.0,7.6,0]], 3);  // the G1->G2 arc, threaded between the drop columns
  // CRYSTAL MOTH #2 — stitched to the SEESAW'S OWN 5.6s CLOCK so the whole overhang composition repeats
  // exactly (one super-pattern, learnable forever). Sweep 63.8..68.2: it dips lowest over the boarding GAP —
  // the jump to the seesaw is timed against its figure-eight, while a stander on G2 is never touched (its low
  // point at the deck lip passes 8.27, a stander tops at 8.0).
  G.ents.add(new CrystalMoth(G, 66, 8.8, 0, {phase:1.4, rx:2.2, ry:1.2, period:5.6, color:0xb08aff}));

  // =============================== BEAT 4 — THE OVERHANG & THE COUNTERWEIGHT (x 66..79) ===============================
  w8l3HighSign(G, 63.0, 6.8, -1.1, 0.1, "THE COUNTERWEIGHT. Two platforms, one chain, one pulley: as one rises its twin sinks. Board it LOW, ride it HIGH - and when it breathes at the top, JUMP. The overhang forgives nothing else.");
  // the brow itself — a great rock mass jutting from the face (pure deco, z<0 and high: it never clips a jump
  // arc; its job is to say "you cannot climb THIS" while the machine below says "so ride")
  { const brow=mesh('box',[11,2.6,2.2], mat(ROCKD)); brow.position.set(74,15.2,-2.6); brow.rotation.z=0.06; deco.add(brow);
    const lip2=mesh('sph',[1.4,8,6], mat(ROCKD)); lip2.scale.set(1.6,0.6,1); lip2.position.set(69.5,14.1,-2.6); deco.add(lip2); }
  // THE SEESAW PAIR (fixed 5.6s clock): A at x70 (spans 69..71) rides 6.48..11.28 (top), B at x76 (75..77)
  // rides the mirror 11.28..6.48. The dance: G2 lip -> tap the 3.5u gap onto A LOW (6.48, a 0.3 drop —
  // over-clearance law) -> ride to apex -> at the top, B sits at ITS bottom: step off RIGHT and fall 4.8 onto
  // the twin (4.0u forward drop) -> B rises as A sinks -> at B's apex, tap 2.0u onto the brow lip (11.6, +0.32).
  // A miss is the winze's honest price (heart + walk-back), never a crush — the platforms are the way, not a trap.
  w8Seesaw(G, {x:73, gap:6, y0:8.6, amp:2.4, period:5.6, phase:0});
  candyLine(G, [[66.8,7.6,0],[68.4,7.9,0],[69.9,7.6,0]], 3);  // the boarding arc (timed against the moth's dip)
  candyLine(G, [[71.5,12.2,0],[73.5,10.0,0],[75.5,8.2,0]], 3);// the apex transfer — the drop line onto the twin
  candyLine(G, [[77.6,12.3,0],[79.4,12.5,0]], 2);             // the apex jump — candy marks the top of the breath

  // =============================== BEAT 5 — THE HALF-FACE LANDING (x 79..90): the breath + THE lantern ===============================
  platform(G, 84.5, 11.6, 0, 11, 3.4, ROCKL);                 // THE LANDING (top 11.6, spans 79..90) — wide, warm, safe
  G.ents.add(new Checkpoint(83, 11.6, 1.6, 1));               // THE lantern — the ONE lit checkpoint (x83 of -8..170 ≈ 51%; full pocket ledger in the header)
  G.ents.add(new BonkLantern(G, 81, 13.1, 0, 'shield'));      // armor before the exam's second page
  candyLine(G, [[85,12.3,0],[86.5,12.3,0]], 2);
  // THE QUIET PROP — chiseled into the face right beside the lantern's light, where a resting climber's eye
  // falls: initials, a heart, and seven five-bar tallies. Hundreds of shifts. Somebody counted every one.
  deco.add(w8l3ChiselHeart(87.8, 12.85, -0.72));

  // =============================== BEAT 6 — THE UPPER FACE (x 90..114): ESCALATE — the full composition ===============================
  platform(G, 92, 12.0, 0, 3.5, 3, ROCK);                     // STEP U0 (top 12.0, spans 90.25..93.75)
  w5Chain(G, 94.4, 11.6, 16.3);                               // CHAIN #3 — U0 -> U1 (jump-grab off U0's right edge, the w5l4 chain-B idiom; tops 0.7 above U1)
  candyLine(G, [[94.4,13.0,0],[94.4,15.6,0]], 3);
  // KNOCKER #2 — bursts at chain #3's column (x1 94.4), y-window 12.8..14.75: U0 standers (12.0) and landing
  // strollers (11.6) are double-locked out; only the mid-strand climber answers the knocks. Period offset from
  // #1 so the face never syncs into a single memorized beat.
  G.ents.add(new KnockerSprite(G, 92, 14.0, 0, {phase:2.1, x0:89.5, x1:94.4, wallY:14.0, period:6.0, speed:2.0}));
  platform(G, 98, 15.6, 0, 6, 3, ROCK);                       // BENCH U1 (top 15.6, spans 95..101)
  // STALACTITE CLUSTER #2 — three staggered clocks over U1: the slalom bench (candy threads the safe columns)
  G.ents.add(new SpikeIcicle(G, 96.4, 19.6, {period:4.4, phase:0.8, len:1.2, floorY:15.6}));
  G.ents.add(new SpikeIcicle(G, 98.4, 19.8, {period:4.8, phase:2.3, len:1.2, floorY:15.6}));
  G.ents.add(new SpikeIcicle(G, 100.4, 19.6, {period:5.2, phase:3.9, len:1.2, floorY:15.6}));
  candyLine(G, [[97.4,16.4,0],[99.4,16.4,0]], 2);             // between the drop columns
  platform(G, 104, 16.2, 0, 4, 3, ROCK);                      // STEP U2 (top 16.2, spans 102..106)
  w5Chain(G, 106.6, 16.0, 20.1);                              // CHAIN #4 — U2 -> the crest (jump-grab off U2's edge; tops 0.7 above the 19.4 deck)
  candyLine(G, [[106.6,17.0,0],[106.6,19.3,0]], 2);
  // KNOCKER #3 — the last word in the face: bursts at chain #4's column (x1 106.6), y-window 17.0..18.95 —
  // U2 standers (16.2) and crest walkers (19.4) both sit outside it. Three knockers, one rule, zero cheap hits.
  G.ents.add(new KnockerSprite(G, 109, 18.2, 0, {phase:4.2, x0:111.5, x1:106.6, wallY:18.2, period:5.8, speed:2.2}));
  platform(G, 110.5, 19.4, 0, 7, 3.2, ROCKL);                 // THE CREST (top 19.4, spans 107..114)
  G.ents.add(new Heart(108.3, 20.4, 0));                      // mercy on the summit (outside the mimic's 107.9 wake edge)
  // GEM MIMIC #2 among the crest's decoy garden (snap range 107.1..113.9 — never off the deck)
  G.ents.add(new GemMimic(G, 110.5, 19.4, 0, {phase:1.2, wakeR:2.6, color:0x7ae8ff}));
  { const d4=w8CrystalCluster(108.8, 0.8, 0.7, 0x7ae8ff); d4.position.y=19.4; deco.add(d4);
    const d5=w8CrystalCluster(112.3, -0.9, 0.8, 0x7ae8ff); d5.position.y=19.4; deco.add(d5); }
  // BLIZZARD BAT #2 — the crest air (patrol 108.5..113.5 at y22.6): summit pinch = bat + mimic = 2, +knocker #3
  // only for a climber still topping out = 3 worst-case. The 4-cap holds everywhere on the face.
  G.ents.add(new BlizzardBat(G, 111, 22.6, 0, {phase:1.8, range:2.5, period:3.7, aggroR:4.5}));
  G.ents.add(new BonkLantern(G, 113.8, 20.9, 0, 'bat'));      // the crown prize: 18s of wings for the descent (timed pickup — works even in Nightmare, it's level design)
  candyLine(G, [[108,20.1,0],[109.5,20.1,0]], 2);

  // =============================== BEAT 7 — THE DESCENT (x 114..131): the climb-exit hop gets its targets ===============================
  platform(G, 117.5, 14.8, 0, 4, 3, ROCK);                    // D1 (top 14.8, spans 115.5..119.5) — 1.5u hop, 4.6 drop
  platform(G, 123, 9.6, 0, 4, 3, ROCK);                       // D2 (top 9.6, spans 121..125)
  platform(G, 128.5, 4.8, 0, 4, 3, ROCK);                     // D3 (top 4.8, spans 126.5..130.5) — last step to the floor
  candyLine(G, [[114.5,19.8,0],[116.5,17.0,0],[118,15.6,0]], 3);   // the first drop line, drawn in sugar
  candyLine(G, [[120.5,14.2,0],[122,10.6,0]], 2);

  // =============================== BEAT 8 — THE SORTING FLOOR (x 131..170): MID-BOSS + the geode + the gate ===============================
  groundX(G, 130.5, 178, ROCK);                               // overlaps D3's lip — no seam gap at the bottom of the last drop
  w8Rails(G, 133, 170, 0);                                    // the ore lanes the triplets roll (baked rails + sleepers)
  deco.add(w8TimberFrame(136)); deco.add(w8TimberFrame(146)); deco.add(w8TimberFrame(156));
  candyLine(G, [[132,0.9,0],[134,0.9,0]], 2);
  signPost(G, 134.5, 1.7, -0.1, "NOTICE FROM MANAGEMENT: the sorting floor is once again experiencing rolling stock. Three of it. Taking turns. Frostmere's triplet situation remains under review. Please time your crossing and do not feed them.");
  // THE GRAVEL TRIPLETS — the mid-boss slot (the proud Mario Land 2 tradition, fourth verse): three lanes on
  // ONE shared 5.4s clock in staggered thirds (runT 3.78 + pause 1.62; phases 0/1.8/3.6). Two lanes roll west,
  // one rolls east — cross like traffic, or stomp one for candy (rock top 1.6: a TAP clears, the speedrun law).
  // Worst overlap = 3 balls live at once, and nothing else patrols the arena: the 4-cap holds with room.
  G.ents.add(new GravelTriplet(G, 157, 0, 0, {x1:140, speed:4.5, phase:0.0, pause:1.62}));
  G.ents.add(new GravelTriplet(G, 140, 0, 0, {x1:157, speed:4.5, phase:1.8, pause:1.62}));
  G.ents.add(new GravelTriplet(G, 157, 0, 0, {x1:140, speed:4.5, phase:3.6, pause:1.62}));
  candyLine(G, [[142,0.9,0],[146,0.9,0],[150,0.9,0]], 3);     // the crossing rhythm, traced
  candyLine(G, [[153,0.9,0],[156,0.9,0]], 2);
  G.ents.add(new Crow(161, 0.95, 2.3));                       // tunnel crow #2 — supervising, unhelpfully
  // THE GLIMMERING GEODE — the gamble, in its CLEAR POCKET (full worst-case ledger in the header: triplet reach
  // 157.76 -> 8.2u clear; nothing else lives past 158). Opening is a deliberate act; the nest ambush spawns
  // on the kit's 1s grace ring. The gate's warm light is 6u further on — temptation, then home.
  { const gg = new GlimmeringGeode(166, 0, -0.6, 0.15); G.coffins.push(gg); G.ents.add(gg); }
  { const gl=new THREE.PointLight(0xffb85e, 24, 10); gl.position.set(171,3.4,-1); S.add(gl); }   // the gate's welcome (real light #4 of 4: adit + CP1 + geode + this)
  exitGate(G, 172);

  // =============================== DECO · THE FACE · SILHOUETTES · TAIL ===============================
  // THE DEEP FACE itself — a continuous cliff of dark slabs just behind the play lane (z<0, baked): the rock the
  // chains hang from, the knockers glide through, and the tallies are cut into. Panels step up with the climb.
  for(const [px,py,pw,ph2] of [[38,4,10,10],[47,7,10,14],[60,8,14,10],[85,13,14,9],[97,14,14,12],[110,17,12,12]]){
    const panel=mesh('box',[pw,ph2,0.8], mat(ROCKD)); panel.position.set(px,py,-1.15); deco.add(panel);
  }
  // deeper shoring + seams behind the face
  for(const [px,py] of [[42,9],[63,10],[95,16],[108,20]]){
    const beam=mesh('box',[4.2,0.32,0.5], mat(W8PAL.timberD)); beam.position.set(px,py,-1.0); beam.rotation.z=rand(-0.04,0.04); deco.add(beam);
  }
  // glinting seams on the face (emissive fakes — never real lights, never mimic-shaped: seams, not clusters)
  for(const [px,py,cc] of [[36,7.5,W8PAL.crysC],[52,10,W8PAL.crysV],[66,12,W8PAL.crysC],[91,16,W8PAL.crysV],[103,19,W8PAL.crysA]]){
    const seam=mesh('box',[0.12,rand(0.8,1.4),0.1], emat(cc,cc,0.7)); seam.position.set(px,py,-0.7); seam.rotation.z=rand(-0.4,0.4); deco.add(seam);
  }
  // foreground silhouettes (z>0): stalagmite teeth + a leaning wheel framing the depth
  for(const [fx,fs] of [[33,1.1],[77,0.9],[124,1.2],[160,1.0]]){
    const st=mesh('cone',[0.7*fs,2.2*fs,5], mat(0x140f22)); st.position.set(fx,0.9*fs,2.8); deco.add(st);
  }
  { const fw=mesh('cyl',[0.9,0.9,0.2,10], mat(0x140f22)); fw.rotation.z=0.5; fw.position.set(143,0.8,3.2); deco.add(fw); }
  S.add(bakeGroup(deco));

  // the winze + the upper-face void, dressed so the danger reads from every lip (visual — the fall IS the price)
  pitDressing(G, 56, 79, 'winter');
  pitDressing(G, 90.5, 115.4, 'winter');
  pitDressing(G, 119.6, 120.9, 'winter');
  pitDressing(G, 125.1, 126.4, 'winter');

  w8Parallax(S, -8, 178);
  w8LevelFinish(G, -8, 178, null);   // null clutter: the span crosses the winze (kit law) — solid floors clutter manually
  w8Clutter(G, -8, 55, 'mine');
  w8Clutter(G, 131.5, 177, 'mine');

  return {spawnX: 0, exitX: 172};
}

function updateW8L3(G, dt){
  updateLevelCommon(G, dt);
  // every machine and creature here self-ticks through G.ents on its own fixed clock (knockers, icicles, the
  // seesaw, the moth, the triplets, the geode) — nothing bespoke touches the critical path.
}

W8_LEVELS.push({id:'w8l3', district:'w8', name:'THE DEEP FACE', build:buildW8L3, update:updateW8L3, parTime:170});

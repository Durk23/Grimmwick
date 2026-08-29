// ============ W1-5 — THE KING'S DOORSTEP (the only all-new level of the split) ============
// The last walk before the Pumpkin King — District 1's mastery exam, still ~95% clearable but EARNED.
// Signature gimmick: GOURD BOUNCE-CHAINS. Introduced (one safe bounce over a baby gap),
// twisted (bounces across the royal mud), escalated (briar sail + the King's moat, now a
// MID-level gate), then the King's processional — a rolling rhythm of gourds at alternating
// heights, a grand double-void crossing with a Boo drifting the second arc. THEN the true
// final exam: THE MASTERY MEDLEY, a victory-lap gauntlet that strings every verb the Patch
// taught — BOUNCE → CARRIAGE (mover) → CLIMB → GHOST STEP → SPRING — into one clean line of
// candy up the King's rampart, a high line paying a Moon Drop. And still last, the climax:
// the SEED BOMBARDMENT gauntlet under the King's own artillery, then the gate.
// Structured chaos, not clutter: ~17 threats over ~200 units, singles and telegraphed
// set-pieces, never gangs — and every placement, volley, dive, mover, and volley on a fixed clock.
function buildW1L5(G){
  const S = G.scene;
  levelBegin(G);
  G._w1l5Flare = 0;

  // ================= BEAT 1: The forbidden bounce (x -8..13) =================
  groundX(G, -8, 5, 0x3f5c4c);
  groundX(G, 9, 43, 0x49603f);
  signPost(G, 1.5, 1.8, -0.25, 'His Majesty is NOT receiving visitors. Absolutely NO bouncing on the royal gourds. - The Management');
  G.ents.add(new BonkLantern(G, 3, 1.3, 0, 'shield'));
  bigPumpkin(G, 7, -0.6, 0, 1.6);   // the baby gap below is double-jumpable — the gourd just makes it FUN
  candyLine(G, [[0.5,0.8,0],[3.2,0.8,0]], 4);
  candyLine(G, [[4.5,1.6,0],[7,3.6,0],[9.5,1.6,0]], 5);  // the arc teaches the bounce
  // the pre-boss treat: a coffin tucked BEHIND spawn — a clear pocket, no patrols near it;
  // the red glow at your back on frame one is the whole invitation (clear-patch law)
  const cof = new CursedCoffin(-4, 0, 1.9, 0.35);
  G.ents.add(cof); G.coffins.push(cof);
  G.world.addBox(-4, 0, 1.9, 1.4, 0.9, 2.4, {});
  G.ents.add(new Boo(G, 11, 0, 0, {speed:2.0, range:9}));
  G.ents.add(new Rat(G, 15, 0, 0));

  // ================= BEAT 2: The royal mud (x 16..28) — twist: bounce OVER a hazard =================
  mudPitX(G, 21, 10);
  bigPumpkin(G, 17.5, -0.5, 0, 1.7);
  bigPumpkin(G, 22.5, -0.5, 0, 1.9);
  candyLine(G, [[15.5,1.8,0],[17.5,3.9,0],[20,2.8,0]], 5);
  candyLine(G, [[20,2.8,0],[22.5,4.1,0],[25.6,1.6,0]], 5);
  G.ents.add(new Hopper(G, 27, 0, 0, {aggroR:8}));  // times its arcs against your bounces
  // HIGH SHELF: pound-mega-bounce a mud gourd (or double-jump off a bounce) — visible candy overhead
  platform(G, 20, 4.6, 0, 2.6, 3, 0x5a4066);
  platform(G, 24.5, 5.2, 0, 2.6, 3, 0x5a4066);
  candyLine(G, [[20,5.8,0],[24.5,6.4,0]], 4);
  G.ents.add(new Heart(24.5, 6.6, 0));
  candyLine(G, [[22.5,3.2,0],[23.5,4.6,0],[24.5,5.9,0]], 4);   // traces the pound-mega-bounce arc up to the shelf — the trail teaches the move
  G.ents.add(new SwoopBat(G, 20, 5.4, 0, {range:4}));          // wings over the mud gourds — patrol line clears the shelf slab

  // ================= BEAT 3: The briar row (x 28..42) — ground pressure between bounces =================
  G.ents.add(new Skelly(G, 30, 0, 0, {px:1.5}));
  bigPumpkin(G, 32.6, -0.5, 0, 1.6);   // escalate: one clean bounce sails the whole briar
  thornsX(G, 37, 6);
  platform(G, 37, 1.3, 0, 2.6, 3, 0x5a4066);  // the honest low hop for non-bouncers
  candyLine(G, [[32.6,3.6,0],[36.5,4.9,0],[40.3,2,0]], 5);
  G.ents.add(new Checkpoint(41.6, 0, 1.4, 0));   // clear of the briar hazard box (ends x40) — respawn must never overlap a hazard
  G.ents.add(new Spider(G, 42.3, 4.2, 0, {groundY:0}));  // hangs in plain sight over the fence line

  // ================= BEAT 4: The King's moat (x 43..53) — the mid-level gate over the void =================
  // One threat owns this beat: the Boo weaving your arcs. Stare to freeze — the counter
  // you will need again over the second void of the master crossing.
  bigPumpkin(G, 46, 0.3, 0, 1.6);
  bigPumpkin(G, 49.8, 1.0, 0, 1.4);
  G.ents.add(new Boo(G, 47.8, 2.2, 0, {speed:2.4, range:9}));
  candyLine(G, [[43.5,2.6,0],[46,4.4,0],[48.6,3.2,0]], 5);
  candyLine(G, [[48.6,3.2,0],[49.8,5.2,0],[52.6,2.2,0]], 4);

  // ================= BEAT 5: The processional rhythm (x 53..83) — mastery, part one =================
  // Gourds at alternating heights roll across three royal mud pools; a Hopper holds each dry
  // gap, a swoop bat weaves the tall arcs. Candy traces every flight. Pool one is a breather —
  // the chaos here is motion (arcs, mud shimmer, the bat's loop), not bodies.
  groundX(G, 53, 83, 0x49603f);
  G.ents.add(new Checkpoint(55.2, 0, 1.4, 1));   // lantern before the rhythm begins
  signPost(G, 54.4, 1.8, -0.2, "The King's processional route. The gourds are CEREMONIAL. They are not a rhythm game. Do NOT bounce them in sequence. - The Management");
  // pool one — low gourd into raised gourd
  mudPitX(G, 60.5, 6);                            // mud x 57.5..63.5
  bigPumpkin(G, 59, -0.5, 0, 1.7);                // top ~0.89
  bigPumpkin(G, 62.5, 0.9, 0, 1.35);              // raised on a plinth — top ~2.01
  candyLine(G, [[56.5,1.2,0],[58,2.4,0],[59,2.2,0]], 4);
  candyLine(G, [[59,2.6,0],[60.8,4.2,0],[62.5,3.4,0]], 5);
  candyLine(G, [[62.5,3.4,0],[64.2,5.0,0],[66,2.0,0]], 5);
  G.ents.add(new Hopper(G, 65.2, 0, 0, {aggroR:7}));   // holds the first dry gap — hop the hopper mid-chain
  // pool two — the tall pair, with the HIGH SHELF crowning it
  mudPitX(G, 70, 6);                              // mud x 67..73
  bigPumpkin(G, 68.6, -0.5, 0, 1.5);              // top ~0.73
  bigPumpkin(G, 71.9, 1.1, 0, 1.45);              // raised — top ~2.29
  G.ents.add(new SwoopBat(G, 70, 4.7, 0, {range:4.5, phase:0.6}));  // weaves the tall arcs — squeak, then a fixed dive
  candyLine(G, [[66.8,1.4,0],[68.6,2.2,0]], 3);
  candyLine(G, [[68.6,2.4,0],[70.3,4.0,0],[71.9,3.6,0]], 5);
  candyLine(G, [[71.9,3.6,0],[73.6,5.3,0],[75.4,2.0,0]], 5);
  // the shelf: pound-mega-bounce the raised gourd — bat wings wait above for the voids ahead
  platform(G, 68.5, 6.1, 0, 2.6, 3, 0x5a4066);
  platform(G, 74.8, 6.5, 0, 2.6, 3, 0x5a4066);   // offset RIGHT of the launch gourd — the shelf must never seal its own mega-bounce column
  candyLine(G, [[71.9,3.5,0],[73.3,5.4,0],[74.8,6.3,0]], 4);   // the mega-bounce trail teaches the way up (launch, steer right, land)
  candyLine(G, [[68.5,6.9,0],[74.8,7.3,0]], 4);
  G.ents.add(new Heart(68.5, 7.2, 0));
  G.ents.add(new BonkLantern(G, 74.8, 7.1, 0, 'bat'));   // high-road reward: wings for the crossing
  G.ents.add(new Hopper(G, 75, 0, 0, {aggroR:6}));       // holds the second dry gap
  // pool three — one grand gourd, one clean sail
  mudPitX(G, 78.6, 4.2);                          // mud x 76.5..80.7
  bigPumpkin(G, 78.6, -0.5, 0, 1.9);              // top ~1.06 — the King-sized sendoff
  candyLine(G, [[76.6,1.6,0],[78.6,2.6,0]], 3);
  candyLine(G, [[78.6,2.8,0],[80.4,4.3,0],[82.2,1.6,0]], 5);

  // ================= BEAT 6: The master crossing (x 83..108) — TWO voids, one refuge =================
  G.ents.add(new Checkpoint(81.5, 0, 1.4, 2));   // lantern before the grand crossing — clear of pool three (ends x80.7)
  signPost(G, 82.4, 1.8, 0.22, 'BRIDGE OUT. (His Majesty ate it.) Gourd crossing only. Mind the ghost over the second span: he is bolder than he looks. - The Management');
  // void one (x 83..93): two pillared gourds, no enemies — the void IS the test
  bigPumpkin(G, 86, 0.4, 0, 1.6);                 // top ~1.71
  bigPumpkin(G, 89.8, 1.1, 0, 1.4);               // top ~2.25
  candyLine(G, [[83.4,1.4,0],[84.8,2.6,0],[86,2.6,0]], 4);
  candyLine(G, [[86,3.2,0],[87.9,4.9,0],[89.8,3.2,0]], 5);
  candyLine(G, [[89.8,3.6,0],[91.4,5.2,0],[93.6,1.8,0]], 5);
  // the refuge island (x 93..97.5): a stone rest carved for the King's messengers
  groundX(G, 93, 97.5, 0x5a5472);
  G.ents.add(new Heart(94.6, 1.1, 0));
  G.ents.add(new BonkLantern(G, 96.2, 1.6, 0, 'shield'));   // mercy before the bolder span
  candyLine(G, [[94,1,0],[96.5,1,0]], 3);
  // void two (x 97.5..108): the bolder span — a lone Boo drifts the arc; stare-freeze is the counter
  bigPumpkin(G, 100.5, 0.6, 0, 1.5);              // top ~1.83
  bigPumpkin(G, 104.6, 1.4, 0, 1.3);              // top ~2.47
  G.ents.add(new Boo(G, 102.5, 2.4, 0, {speed:2.4, range:10}));
  candyLine(G, [[98,1.5,0],[99.4,2.7,0],[100.5,2.7,0]], 4);
  candyLine(G, [[100.5,3.2,0],[102.5,5.0,0],[104.6,3.4,0]], 5);
  candyLine(G, [[104.6,3.8,0],[106.6,5.5,0],[108.6,2.0,0]], 5);
  // stonework: crooked columns hold every void gourd, plinths lift the raised rhythm gourds,
  // twin pylons shoulder the island — the whole chain reads FAIR from the checkpoint
  const stonework = new THREE.Group();
  for(const [px,py] of [[86,-3.3],[89.8,-2.7],[100.5,-3.2],[104.6,-2.5]]){
    const col = mesh('box',[1.3,7,1.3], mat(0x4a4160)); col.position.set(px,py,0); crook(col,0.05); stonework.add(col);
  }
  for(const [px,ph,py] of [[62.5,1.6,0.3],[71.9,2.0,0.4]]){
    const pl = mesh('box',[1.1,ph,1.1], mat(0x4a4160)); pl.position.set(px,py,0); crook(pl,0.04); stonework.add(pl);
  }
  for(const px of [94.2, 96.3]){
    const py = mesh('box',[1.7,9,1.7], mat(0x504a68)); py.position.set(px,-4.6,0); crook(py,0.04); stonework.add(py);
  }
  S.add(bakeGroup(stonework));

  // ================= BEAT 6½: THE MASTERY MEDLEY (x 108..177) — District 1's final exam =================
  // The victory lap. Every verb the Patch taught, in sequence, traced in one line of candy through
  // all five stations: the BOUNCE, the CARRIAGE (moving platform), the CLIMB, the GHOST STEP, the
  // SPRING. Each announced by the Management; a harder high line over the first pays a Moon Drop.
  // Deterministic to the pebble — the "I know this place by heart" moment, right on the King's
  // rampart. The master crossing's void-two lands you here.
  groundX(G, 108, 116, 0x4c3f5e);
  G.ents.add(new Checkpoint(109.5, 0, 1.4, 3));   // THE ONE mercy before the exam (checkpoint #4)
  signPost(G, 110.6, -0.25, 0.2, 'THE ROYAL EXAMINATION. Five stations, one of each, in order. Show His Majesty what the Patch taught you. Do NOT show off. - The Management');
  signPost(G, 114, 0.25, -0.15, 'Station the First: THE BOUNCE.');
  candyLine(G, [[110,1,0],[112,1,0],[114.5,1.1,0]], 3);

  // --- Station 1: THE BOUNCE (void 116..125) — gourd chain, with a HIGH LINE to a power-up ---
  bigPumpkin(G, 119, 0.2, 0, 1.5);     // top ~1.43, bounce
  bigPumpkin(G, 122.5, 0.6, 0, 1.4);   // top ~1.75, bounce
  candyLine(G, [[115,1.3,0],[117,2.8,0],[119,2.4,0]], 4);
  candyLine(G, [[119,2.8,0],[120.7,4.6,0],[122.5,3.4,0]], 5);
  candyLine(G, [[122.5,3.6,0],[124,5.0,0],[125.5,2.0,0]], 5);   // the low line: bounce on across to G1
  // HIGH LINE (richer reward): pound-mega-bounce the raised gourd up to the shelf, offset right of the launch
  platform(G, 126, 6.4, 0, 3, 3, 0x5a4066);
  candyLine(G, [[122.5,3.5,0],[124,5.4,0],[125.6,6.2,0]], 4);   // traces launch → steer right → land
  G.ents.add(new BonkLantern(G, 126, 7.0, 0, 'moon'));          // the reward: a Moon Drop for the road ahead
  candyLine(G, [[124.7,7.0,0],[127.3,7.0,0]], 4);
  G.ents.add(new SwoopBat(G, 120, 5.0, 0, {range:4.2, phase:0.3}));   // the air lane weaving the bounce arcs

  // --- G1 + Station 2: THE CARRIAGE (moving platform, void 131..139) ---
  groundX(G, 125, 131, 0x4c3f5e);
  signPost(G, 127, -0.2, 0.15, "Station the Second: THE MOVING PLATFORM. (A ceremonial carriage. Do NOT enjoy the ride.) - The Management");
  const carriage = ()=>{
    const g = new THREE.Group();
    const deck = mesh('box',[3.2,0.5,2.6], mat(0x6a4a86)); deck.position.y=0.25;   // local 0..0.5 = collider top
    const trim = mesh('box',[3.4,0.12,2.8], emat(0xc9a227,0x7a5a10,0.4)); trim.position.y=0.5;
    for(const wx of [-1.1,1.1]) for(const wz of [-1,1]){
      const wheel = mesh('cyl',[0.3,0.3,0.16,10], mat(0x2c2140)); wheel.rotation.z=Math.PI/2; wheel.position.set(wx,0.02,wz); g.add(wheel);
    }
    g.add(deck, trim); S.add(g); return g;
  };
  // fixed clock from level start — deterministic shuttle, kisses both edges (period 5s)
  G.world.addMover(3.2, 0.5, 2.6, t=>new THREE.Vector3(lerp(131.5,138.5, 0.5+0.5*Math.sin(t*TAU/5)), 1.1, 0), carriage);
  candyLine(G, [[130.5,1.0,0],[131.6,1.9,0]], 2);
  candyLine(G, [[133.5,2.0,0],[135.5,2.0,0],[137.5,2.0,0]], 3);
  candyLine(G, [[138.4,1.9,0],[139.6,1.0,0]], 2);

  // --- G2 + Station 3: THE CLIMB (the King's rampart wall + a vine) ---
  groundX(G, 139, 145, 0x4c3f5e);
  signPost(G, 140.5, 0.25, -0.15, 'Station the Third: THE CLIMB. Up the rampart, if you please. - The Management');
  const rampart = mesh('box',[8,3.6,3], mat(0x4a4160)); rampart.position.set(149,1.8,0); S.add(rampart);   // axis-aligned to its collider
  G.world.addBox(149, 0, 0, 8, 3.6, 3, {});     // solid; top y3.6 = G3 walkway, x145..153
  const cren = new THREE.Group();               // crenellations (deco only)
  for(let cx=146; cx<=152; cx+=1.5){ const b = mesh('box',[0.7,0.6,1.2], mat(0x554a70)); b.position.set(cx,3.9,0); cren.add(b); }
  S.add(bakeGroup(cren));
  buildVine(G, 144.5, 0, 3.7);                   // climb box y0..3.7, rooted on G2 at the wall's foot
  candyLine(G, [[144.5,1.2,0],[144.5,2.5,0],[144.5,3.6,0]], 3);   // up the vine...
  candyLine(G, [[145.2,4.2,0],[146,3.9,0]], 2);                    // ...then the boosted hop onto the rampart top
  G.ents.add(new Hopper(G, 142, 0, 0, {aggroR:5}));   // ground pressure at the wall's foot — hop it, then climb

  // --- G3 rampart top → Station 4: THE GHOST STEP (void 153..157) ---
  // A shy Boo is the only stone across the breach. Face him (moving right IS facing him) to hold him
  // still, then stomp-bounce off his head. He survives EVERY step (hp 99) — so on any walk-back the
  // stone is still here: the ghost step can never softlock.
  {  // signPost roots at y0; this station lives on the rampart top, so build its sign by hand up here
    const sg = new THREE.Group();
    const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(PAL.woodD)); pole.position.y=0.7;
    const board = mesh('box',[1.5,0.8,0.1], mat(PAL.wood)); board.position.y=1.5; crook(board,0.04);
    sg.add(pole,board); sg.position.set(151.2, 3.6, 0.35); sg.rotation.y=-0.15; S.add(sg);
    G.signs.push({x:151.2, z:0.35, text:'Station the Fourth: THE GHOST STEP. Look him dead in the eye, then step across his head. - The Management'});
  }
  const stepBoo = new Boo(G, 155, 3.2, 0, {speed:2.0, range:8});   // hover ~3.55, head-top ~4.65
  stepBoo.hp = 99;   // a stepping stone, never a kill
  stepBoo.anchor = true;   // pinned to x=155: the stone stays put through stomps and walk-backs (deterministic)
  G.ents.add(stepBoo);
  candyLine(G, [[153.5,3.9,0],[154.3,4.6,0],[155,4.3,0]], 3);   // the leap to his head
  candyLine(G, [[155,4.7,0],[156,6.2,0],[157.3,4.0,0]], 4);     // the stomp-bounce arc onto G4

  // --- G4 landing + a stair back down to the courtyard floor ---
  platform(G, 159, 3.6, 0, 4, 3, 0x4a4160);      // catches the ghost step, top y3.6, x157..161
  platform(G, 161.5, 2.4, 0, 2.2, 3, 0x4a4160);  // step down (drop 1.2)
  platform(G, 163.5, 1.1, 0, 2.2, 3, 0x4a4160);  // step down (drop 1.3)
  candyLine(G, [[159.5,4.0,0],[161.5,2.8,0],[163.5,1.5,0],[165.5,0.9,0]], 5);

  // --- G5 + Station 5: THE SPRING (void 169..177; only a wound spring reaches the shelf) ---
  groundX(G, 164, 169, 0x4c3f5e);
  signPost(G, 165, 0.25, 0.15, INPUT.isTouch ?
    'Station the Fifth and Final: THE SPRING. Hold 💥 to wind, let go to fly. Mind the gap. - The (nervous) Management' :
    'Station the Fifth and Final: THE SPRING. Hold K to wind, let go to fly. Mind the gap. - The (nervous) Management');
  const springboard = mesh('box',[1.4,0.18,2.2], emat(0xffd34d,0x7a5a10,0.4)); springboard.position.set(166.5,0.09,0); S.add(springboard);
  platform(G, 172.5, 3.7, 0, 9, 3, 0x5a4066);    // the spring shelf: top y3.7 (above double's 3.3, under spring's 4.4), x168..177
  candyLine(G, [[166.5,1.1,0],[166.9,3.5,0],[168.2,3.9,0]], 3);   // wind → launch → steer → land
  candyLine(G, [[169.5,3.9,0],[172,3.9,0],[175.5,3.9,0]], 4);     // walk the shelf, then drop onto the King's floor

  // ================= BEAT 7: THE DOORSTEP (x 177..201.5) — the SEED BOMBARDMENT, then the gate =================
  // The owner's intense-fight archetype: ground enemies to weave while the sky rains fixed,
  // telegraphed artillery. Impacts land ≥4u from the void edge so knockback can never chain a fall.
  groundX(G, 177, 201.5, 0x4c3f68);
  signPost(G, 178.3, 1.8, 0.25, 'TURN BACK. The King is in a MOOD tonight, and he has SEEDS. Management accepts no responsibility for squashings. - The Management');
  G.ents.add(new Hopper(G, 181.5, 0, 0, {aggroR:4.5}));    // the gauntlet's doorman — aggro reach ends AT the void lip, never hops out over it
  G.ents.add(new Skelly(G, 185, 0, 0, {px:2}));            // patrols the middle of the rain
  G.ents.add(new Boo(G, 188.5, 0, 0, {speed:2.2, range:7}));  // creeps while your eyes are on the sky
  candyLine(G, [[181.8,0.8,0],[191.2,0.8,0]], 7);          // the trail threads the safe rhythm
  candyLine(G, [[194.2,0.8,0],[197.6,0.8,0]], 3);          // ...and the quiet walk to the gate
  signPost(G, 194.5, 1.8, -0.2, 'His Majesty will see you now. RUN. - The (former) Management');

  // ---- THE KING'S SEED BOMBARDMENT (x ~181..192) — a fixed clock from level start ----
  // Two 3-shot sweeps per 7.2s cycle, offset by 2 units — the safe spots of one sweep are
  // the impact spots of the other. Each impact telegraphed 0.7s by a growing red target
  // ring, then a seed arcs in from the King and bursts: 1 heart in a small radius,
  // i-frames make repeats fair. Deterministic — same volley, same rhythm, every attempt.
  {
    const VOLLEY = [[0.8,181.5],[1.6,185.5],[2.4,189.5],[4.0,183.5],[4.8,187.5],[5.6,191.5]];
    const PERIOD = 7.2, TEL = 0.7, FLIGHT = 0.5;
    const bomb = {group:new THREE.Group(), dead:false, cull:false, t:0, slots:[]};
    for(const [vt,vx] of VOLLEY){
      const disc = new THREE.Mesh(geo('circ',1.1,18), new THREE.MeshBasicMaterial({color:0xff4030, transparent:true, opacity:0, side:THREE.DoubleSide}));
      disc.rotation.x = -Math.PI/2; disc.position.set(vx,0.07,0); disc.visible = false;
      const seed = new THREE.Mesh(geo('sph',0.3,7,6), emat(0xf2e2a8, 0xffb02e, 0.6));
      seed.scale.set(0.8,1.25,0.8); seed.visible = false;
      bomb.group.add(disc, seed);
      bomb.slots.push({vt, vx, disc, seed, whistled:false});
    }
    bomb.update = function(dt){
      const prev = this.t % PERIOD;
      this.t += dt;
      const ph = this.t % PERIOD;
      const pl = G.player;
      const near = pl && Math.abs(pl.pos.x - 186.5) < 26;   // presentation gate only — the clock never stops
      for(const s of this.slots){
        // telegraph: the target ring grows and pulses on the landing spot
        if(ph >= s.vt - TEL && ph < s.vt){
          const u = (ph - (s.vt - TEL)) / TEL;
          s.disc.visible = true;
          s.disc.material.opacity = 0.22 + 0.5*u + Math.sin(this.t*22)*0.08;
          s.disc.scale.setScalar(0.35 + 0.75*u);
        } else s.disc.visible = false;
        // the seed arcs in from the King's horizon
        if(ph >= s.vt - FLIGHT && ph < s.vt){
          const u = (ph - (s.vt - FLIGHT)) / FLIGHT;
          s.seed.visible = true;
          s.seed.position.set(s.vx + 9*(1-u), 0.3 + 12.5*(1-u*u), -4.5*(1-u));
          s.seed.rotation.z = u*9;
          if(!s.whistled){
            s.whistled = true;
            G._w1l5Flare = 0.45;                             // the King's eyes flare as he spits
            if(near) AUDIO.noise({t:0.35, vol:0.1, fFrom:2400, fTo:500});
          }
        } else { s.seed.visible = false; if(ph < s.vt - FLIGHT) s.whistled = false; }
        // impact
        if(prev < s.vt && ph >= s.vt){
          const ip = new THREE.Vector3(s.vx, 0.15, 0);
          if(near){
            G.fx.spawn(ip, 0xffb02e, 12, {speed:4, life:0.4});
            G.fx.spawn(ip, 0xf2e2a8, 8, {speed:3, life:0.5});
            AUDIO.noise({t:0.22, vol:0.2, fFrom:600, fTo:70});
            G.camc.shake(0.14, 0.18);
          }
          if(pl && !pl.dead && Math.abs(pl.pos.x - s.vx) < 1.35 && Math.abs(pl.pos.z) < 1.8 && pl.pos.y < 1.25){
            // knockback always pushes AWAY from the burst (never a zero vector)
            pl.damage(1, new THREE.Vector3(s.vx - (pl.pos.x >= s.vx ? 0.4 : -0.4), 0, 0));
          }
        }
      }
    };
    G.ents.add(bomb);
  }

  const court = new THREE.Group();
  fenceRun(court, 177, -3.4, 201.5, -3.4, 12);
  // the royal carpet, rolled out the whole approach
  const carpet = mesh('box',[22,0.06,2.2], mat(0x4a2a6e)); carpet.position.set(189,0.06,0);
  const trimA = mesh('box',[22,0.05,0.18], emat(0xc9a227,0x7a5a10,0.35)); trimA.position.set(189,0.09,1.15);
  const trimB = trimA.clone(); trimB.position.z = -1.15;
  court.add(carpet, trimA, trimB);
  // the crowd: pumpkins gathered at the gate end — past the rain, faces turned to the door
  for(let i=0;i<12;i++){
    const p = pumpkinDeco(rand(186,200.5), rand(-3,-1.7), rand(0.5,1.05), rand(0,1)<0.75);
    p.rotation.y = 1.1+rand(-0.4,0.4); court.add(p);
  }
  for(let i=0;i<6;i++){
    const p = pumpkinDeco(rand(190,199.5), rand(2.1,3.1), rand(0.5,0.9), rand(0,1)<0.7);
    p.rotation.y = 1.3+rand(-0.4,0.4); court.add(p);
  }
  // jack-o'-lantern torch posts lining the whole approach (emissive fakes — no real lights)
  for(const tx of [179, 183, 187, 191, 195]) for(const tz of [-2.2, 2.2]){
    const pole = mesh('cyl',[0.09,0.12,1.7,6], mat(PAL.woodD)); pole.position.set(tx,0.85,tz);
    const top = pumpkinDeco(tx, tz, 0.65, true); top.position.y = 1.7;
    court.add(pole, top);
  }
  // royal banners
  for(const bx of [181, 186, 191, 196]){
    const bp = mesh('cyl',[0.06,0.08,3.4,5], mat(PAL.woodD)); bp.position.set(bx,1.7,-2.6);
    const cloth = mesh('box',[0.95,1.9,0.07], mat(0x5a2a6e)); cloth.position.set(bx,2.6,-2.4); crook(cloth,0.03);
    const band = mesh('box',[0.95,0.2,0.09], emat(0xc9a227,0x7a5a10,0.35)); band.position.set(bx,3.42,-2.4);
    court.add(bp, cloth, band);
  }
  // the island's torch and a messenger's grave — the refuge tells its own small story
  {
    const ipole = mesh('cyl',[0.09,0.12,1.7,6], mat(PAL.woodD)); ipole.position.set(93.7,0.85,-1.8);
    const itop = pumpkinDeco(93.7, -1.8, 0.6, true); itop.position.y = 1.7;
    court.add(ipole, itop, grave(96.9, -1.5, 0.2));
  }
  S.add(bakeGroup(court));
  // THE KING LOOMS: a mountain of a pumpkin on the horizon behind his gate
  const king = new THREE.Group();
  const kb = mesh('sph',[7,12,10], mat(0x171126)); kb.position.set(204,3.2,-19); kb.scale.set(1.15,0.85,1.15);
  const ks = mesh('cyl',[0.7,1.1,2.6,6], mat(0x100c1c)); ks.position.set(204,9.6,-19);
  for(let i=0;i<6;i++){
    const a = i/6*TAU;
    const pt = mesh('cone',[0.55,1.7,4], mat(0x241c40));
    pt.position.set(204+Math.cos(a)*3.4, 8.8, -19+Math.sin(a)*3.4);
    king.add(pt);
  }
  king.add(kb, ks);
  S.add(bakeGroup(king));
  const eyeM = new THREE.MeshBasicMaterial({color:0xffb02e, transparent:true, opacity:0.5});
  const eyeL = new THREE.Mesh(geo('cone',0.75,1.1,3), eyeM); eyeL.position.set(201.9,4.8,-11.6);
  const eyeR = eyeL.clone(); eyeR.position.x = 206.1;
  S.add(eyeL, eyeR);
  G._w1l5Eyes = [eyeL, eyeR];

  // ================= approach deco + ambient life =================
  const deco = new THREE.Group();
  fenceRun(deco, -8, -3.4, 43, -3.4, 22);
  for(let i=0;i<9;i++) deco.add(grave(rand(-6,41), rand(-5.5,-2.2)));
  for(let i=0;i<6;i++) deco.add(deadTree(rand(-6,42), rand(-8,-4.5), rand(0.8,1.4)));
  for(let i=0;i<7;i++) deco.add(pumpkinDeco(rand(-4,42), rand(-2.9,-1.8), rand(0.5,0.95), rand(0,1)<0.45));
  for(let i=0;i<4;i++) deco.add(grave(rand(2,40), rand(2.6,3.4)));
  for(let i=0;i<4;i++) deco.add(pumpkinDeco(rand(3,41), rand(2.4,3.2), rand(0.55,0.95), false));
  // the processional stretch — deco held clear of the mud pools (|z| > 2.6)
  fenceRun(deco, 53, -3.4, 83, -3.4, 14);
  for(let i=0;i<6;i++) deco.add(grave(rand(54,82), rand(-5.5,-2.9)));
  for(let i=0;i<4;i++) deco.add(deadTree(rand(54,82), rand(-8,-4.6), rand(0.8,1.4)));
  for(let i=0;i<5;i++) deco.add(pumpkinDeco(rand(54,82), rand(-3.3,-2.8), rand(0.5,0.9), rand(0,1)<0.5));
  for(let i=0;i<3;i++) deco.add(grave(rand(56,80), rand(2.7,3.4)));
  for(let i=0;i<4;i++) deco.add(pumpkinDeco(rand(56,80), rand(2.7,3.2), rand(0.55,0.9), false));
  // the MASTERY MEDLEY approach — deco only over its solid y0 strips (voids + rampart stay clear)
  for(const [gx1,gx2] of [[108,116],[125,131],[139,145],[164,169]]){
    fenceRun(deco, gx1, -3.4, gx2, -3.4, Math.max(3, Math.round((gx2-gx1)/1.6)));
    deco.add(grave(rand(gx1+0.6,gx2-0.6), rand(-5.2,-4)));
    if(rand()<0.7) deco.add(deadTree(rand(gx1,gx2), rand(-8,-5.4), rand(0.8,1.3)));
    deco.add(pumpkinDeco(rand(gx1+0.6,gx2-0.6), rand(-3.2,-2.8), rand(0.5,0.9), rand(0,1)<0.5));
    if(rand()<0.6) deco.add(pumpkinDeco(rand(gx1+0.6,gx2-0.6), rand(2.7,3.2), rand(0.55,0.9), false));
  }
  S.add(bakeGroup(deco));
  G.ents.add(new Crow(16.5, 0.95, -2.6));
  G.ents.add(new Crow(64.4, 0.95, 2.8));
  G.ents.add(new Crow(128.5, 0.95, 2.5));   // the medley, perched by the carriage stop
  G.ents.add(new Crow(142, 0.95, -2.4));    // the rampart foot
  G.ents.add(new Crow(197.5, 0.95, 2.5));   // the Doorstep, shifted with the court
  // the quiet prop: the King's #1 fan — a tiny pumpkin in a paper crown on the last
  // fencepost before the moat, gazing down the whole processional at the gate it can never reach
  const fan = new THREE.Group();
  const fp = pumpkinDeco(0, 0, 0.42, false);
  const crown = mesh('cyl',[0.14,0.15,0.1,6], mat(0xf2e2a8)); crown.position.y = 0.32;
  for(let i=0;i<5;i++){
    const a = i/5*TAU;
    const pt = mesh('cone',[0.035,0.09,3], mat(0xf2e2a8));
    pt.position.set(Math.cos(a)*0.11, 0.4, Math.sin(a)*0.11);
    fan.add(pt);
  }
  fan.add(fp, crown);
  fan.position.set(43, 0.9, -3.4); fan.rotation.y = 1.25;
  S.add(fan);

  exitGate(G, 199);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 5, 9, 'patch');         // the forbidden-bounce baby gap
  pitDressing(G, 43, 53, 'patch');       // the King's moat
  pitDressing(G, 83, 93, 'patch');       // master crossing — void one
  pitDressing(G, 97.5, 108, 'patch');    // master crossing — void two
  pitDressing(G, 116, 125, 'patch');     // medley station 1: the bounce void
  pitDressing(G, 131, 139, 'patch');     // medley station 2: the carriage void
  pitDressing(G, 153, 157, 'patch');     // medley station 4: the ghost-step breach
  pitDressing(G, 169, 177, 'patch');     // medley station 5: the spring gap (under the shelf)

  levelFinish(G, -8, 202, null);        // ambience spans the full course; clutter placed manually below
  buildClutter(G, -8, 5, 'grave');      // intro stretch (baby gap 5..9 stays clean)
  buildClutter(G, 9, 15.5, 'grave');    // graveyard, split around the royal mud (16..26)
  buildClutter(G, 26.5, 43, 'grave');
  buildClutter(G, 53, 57, 'grave');     // processional dry strips only — mud pools + voids stay clean
  buildClutter(G, 63.8, 66.8, 'grave');
  buildClutter(G, 73.2, 76.2, 'grave');
  buildClutter(G, 80.9, 83, 'grave');
  buildClutter(G, 93.3, 97.2, 'grave'); // the refuge island
  buildClutter(G, 108, 116, 'grave');   // the MEDLEY — y0 strips only (voids + rampart + shelves stay clean)
  buildClutter(G, 125, 131, 'grave');
  buildClutter(G, 139, 145, 'grave');
  buildClutter(G, 164, 169, 'grave');
  buildClutter(G, 177, 201, 'grave');   // the courtyard
  return {spawnX: 0, exitX: 199};
}

function updateW1L5(G, dt){
  updateLevelCommon(G, dt);
  // the King's eyes smoulder on the horizon — and FLARE when he spits a seed
  if(G._w1l5Flare) G._w1l5Flare = Math.max(0, G._w1l5Flare - dt*1.2);
  if(G._w1l5Eyes) G._w1l5Eyes[0].material.opacity = 0.4 + Math.sin(G.time*0.8)*0.22 + (G._w1l5Flare||0);
}

W1_LEVELS.push({id:'w1l5', district:'w1', name:"THE KING'S DOORSTEP", build:buildW1L5, update:updateW1L5, parTime:160});

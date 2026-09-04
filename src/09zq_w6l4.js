// ============ LEVEL 6-4 — GLIMMERGLADE (District 6 · Frostmere · Glimmerfields) ============
// The glade where the festival lights went OUT. Every string hangs dead between its posts, the frost has
// crept over doors and bridges, and one candle burns in one cottage window because somebody never gave up.
// This is Frostmere's PUZZLE-PLATFORMING beat and the district's signature verb made whole: LIGHT THAWS ICE —
// spin a dark W6Lantern lit and its linked ThawBlock MELTS open. Introduce it under light pressure, twist it
// into a ROUTE CHOICE (melting is forever — the frozen top WAS the high road), escalate it into flames you
// FIGHT for, then mid-slide between thaw pockets while a snowball owns the lane, and master it at the GLADE
// STAR: one whack and the whole glade blazes back — under falling ice.
//
// RETUNE (owner call, Sept 4 2026): Glimmerfields is POST-STORY MASTERY — one column right of D5, still
// main-game fair. This is w6's "the first flame you fight for" level made total: EVERY lantern-lighting
// moment is now contested. 14 threats over 3 lanes (D5's 5-5 ran 13), TWO checkpoints only (CP0 + one lit
// lantern at 55% — the walk-back is part of the price, the D5 law), ice+void composed honestly (this level's
// district licence: both pond pits have marked lips, arcs, and a signpost), and the finale bridge runs its
// staggered melt under a three-icicle WAVE. Full introduce->twist->escalate->master:
//   BEAT 1 THE DARK GLADE (INTRODUCE)       x -8..36  — CP0. Snow-Boo #1 drifts the gloom and CONTESTS the
//          first lantern pair (stare = a standable ice block — the verb that buys every window in this
//          level). Dead strings overhead; a startled winter crow.
//   BEAT 2 THE FROZEN SHELF (TWIST)         x 36..64  — the ThawBlock BRIDGE-BLOCKER route choice: frozen,
//          its top is the STAIR to a slick high road; melted, it's the DOOR to the low road. A Frostbite
//          Penguin squawks the junction while you decide, Blizzard Bat #3 owns the shelf air (and its Bat
//          Wings reward), penguin #1 patrols the low road — both routes contested, choice intact.
//   BEAT 3 THE GUARDED FLAMES (ESCALATE A)  x 64..110 — the Mystery Igloo in its clear pocket; the QUIET
//          PROP cottage; GOLDEN PUMPKIN #2 sealed in a ThawBlock VAULT, its lantern flanked by TWO Spooky
//          Snowmen; then CP1 — THE one lit mid lantern (x97.5, 55%) — in the level's engineered hush; then
//          wall D fought for past a penguin patrol while Snow-Boo #2 drifts in off the pit lip.
//   BEAT 4 THE THAW POCKETS (ESCALATE B — THE SET-PIECE) x 108..134 — pit #1, land ON ice, spin lantern E
//          under Blizzard Bat #1's beat; then the ROLLER CORRIDOR: a snowball lane crosses the pond between
//          walls E and F and lantern F stands MID-LANE — spin-light in stride (hop the ball, spin the flame)
//          or bonk the wall and reset against the next ball. Then pit #2, jumped FROM the ice at slide speed
//          (momentum management — the 6-4 licence). Three winter mechanics composed: ice + thaw + roller.
//   BEAT 5 THE GLADE STAR (MASTER · finish) x 134..164 — skate IN on fresh ice: a growing Snowball Roller
//          owns the lane, Spooky Snowman #3 creeps it, a Snow-Boo and Blizzard Bat #2 crowd the star pole —
//          then the STAR SWITCH: every dead string blazes on while three ice walls melt in 0.5s sequence
//          across the chasm bridge... which is capped by THREE SpikeIcicles dropping in a phase wave. Time
//          the whack, run the melt, thread the wave. The level's firework moment, now a mastery exam.
//   RUN-OUT                                 x 164..185 — the town-side strings still burn; the gate under
//          festival light.
// Reads UNMISTAKABLY Glimmerfields: W6PAL moonlit snow + blue-violet night, dead bulb-strings that WAKE, warm
// lantern pools pushed into G.lightPools, icy-cyan cold spirits, snow-shouldered pines, the aurora breathing
// over the far peaks. Three lanes busy the whole way (ground penguins/snowmen/rollers · air Blizzard Bats on
// staggered phases 0.3/0.7/1.1 with periods 3.2/3.0/3.4 — never synced · float/ceiling Snow-Boos and the
// bridge icicles). Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; main-route step-ups <=2.0,
// pit gaps 4.4 and 4.0 (held clears with margin), every blocker wall h>=3.6 = clearly GATED on the lantern
// verb, never almost-jumpable). Deterministic to the tooth — fixed enemy phases, both rollers on fixed lane
// clocks, the icicle wave on fixed 4.2s clocks (phases 0/1.4/2.8), the star's melt stagger on a fixed 0.5s
// cadence, lanterns/thaws one-way switches; seeded rand() only inside baked cosmetic deco. No Math.random on
// the critical path. NO Leap of Faith (both already live elsewhere — sacred). HEARTS ALWAYS: pits cost a
// heart + the lantern walk-back, nothing one-shots; telegraphs never dip below 0.6s (icicle tele 0.7s,
// penguin squawk 0.5s + visible approach, rollers visible their whole run).
//
// SPAWN SAFETY (the law: no threat reaches an IDLE player at either respawn point — reach math):
//   CP0 (x2):  boo #1 home x18, leash chaseR 14 < distance 16 (2.0u margin — never chases a spawner);
//              penguin #3 wake edge = patrol min 30.5 - wakeR 4.5 = x26 (24u clear); everything else >40u.
//   CP1 (x97.5): snowman B home 90 + aggroR 5.5 = reach x95.5 (2.0u margin; snowmen only move when the
//              player is inside aggroR of them); penguin #2 wake edge = patrol min 103.3 - wakeR 4.5 =
//              x98.8 (1.3u margin — an idle player never triggers the squawk, so the 8u slide never comes);
//              boo #2 home 115.5, leash edge 115.5-14 = x101.5 (4.0u margin); bat #1 dive-aggro edge =
//              patrol min 114.5 - aggroR 4.5 = x110 (12.5u); snowman #3/roller lanes/icicles all >37u.
// CLEAR-PATCH LAW (igloo @ x71, interact edge ~x73.8): penguin #1's patrol tops out at x52.6 (19u clear,
// wakeR 5 can't reach); snowman A homes at x84 with aggroR 5.5 (creep edge x78.5 — 4.7u outside the
// interact edge, and snowmen don't patrol); Blizzard Bat homes are 17.7u/45u/73u away (they drift after
// diving — kept far per the air-diver rule); Snow-Boo homes (18/115.5/143) are all >=15u from the igloo per
// the boo-leash law; roller lane #1 ends at x120.6 (46.8u). Opening stays a deliberate safe act.

// ---- THE QUIET PROP: a snowed-in cottage at the glade's edge, dark like everything else — except ONE window,
// lit by one stubborn candle, a wrapped gift waiting on the doorstep and the path swept clear. Somebody in the
// dark glade never stopped expecting the festival back. Never signposted. Fully baked, utterly still. ----
function w6l4Cottage(x, z){
  const g = new THREE.Group();
  const wood = mat(W6PAL.wood), woodD = mat(W6PAL.woodD);
  const body = mesh('box',[3.0,2.2,1.8], wood); body.position.set(x,1.1,z); g.add(body);
  const roof = mesh('cone',[2.4,1.5,4], woodD); roof.position.set(x,2.9,z); roof.rotation.y=Math.PI/4; g.add(roof);
  const cap = mesh('cone',[2.0,0.55,4], mat(W6PAL.pineSnow)); cap.position.set(x,3.35,z); cap.rotation.y=Math.PI/4; g.add(cap);   // snow on the ridge
  const chim = mesh('box',[0.34,0.9,0.34], woodD); chim.position.set(x-0.9,3.1,z); g.add(chim);
  const door = mesh('box',[0.7,1.25,0.1], woodD); door.position.set(x-0.72,0.62,z+0.92); g.add(door);
  const knob = mesh('sph',[0.045,5,4], mat(0xc9a24a)); knob.position.set(x-0.5,0.62,z+0.99); g.add(knob);
  // THE window — the one warm light in the whole dark glade (emissive fake; the real lights stay in budget)
  const win = mesh('box',[0.56,0.62,0.1], emat(W6PAL.window,W6PAL.window,0.95)); win.position.set(x+0.62,1.4,z+0.92); g.add(win);
  for(const [fx,fy,fw,fh] of [[0.62,1.4,0.64,0.06],[0.62,1.4,0.06,0.7]]){ const fr=mesh('box',[fw,fh,0.12], woodD); fr.position.set(x+fx,fy,z+0.94); g.add(fr); }
  const candle = mesh('cyl',[0.05,0.05,0.2,5], mat(0xf0e6c8)); candle.position.set(x+0.62,1.2,z+0.98); g.add(candle);
  const flame = mesh('sph',[0.05,5,4], emat(0xffd23f,0xffb85e,1)); flame.position.set(x+0.62,1.34,z+0.98); g.add(flame);
  // the swept path (dark against the snow — somebody shovels it every morning) and the waiting gift
  const p1 = mesh('box',[0.8,0.05,1.1], mat(0x8a7458)); p1.position.set(x-0.72,0.05,z+1.6); g.add(p1);
  const p2 = mesh('box',[0.8,0.05,0.9], mat(0x8a7458)); p2.position.set(x-0.72,0.05,z+2.5); g.add(p2);
  g.add(w6GiftBox(x-1.5, z+1.2, 0.8, 0xd83a4a));
  // snow drifted against the walls — the glade pressing in
  for(const [dx,dz,s] of [[-1.6,0.5,0.7],[1.6,-0.3,0.6],[0.4,1.0,0.5]]){ const dr=mesh('sph',[s,7,5], mat(W6PAL.snow)); dr.scale.y=0.4; dr.position.set(x+dx,0.1,z+dz); g.add(dr); }
  crook(g, 0.02);
  return g;
}

// ---- THE GLADE STAR: the master switch — a gold star crowning the last lantern-pole, every dead string in the
// glade running home to it. UNBAKED (it pulses, and spins once lit); its pole extension bakes with the deco. ----
function w6l4StarPole(x){
  const grp = new THREE.Group();
  const starMat = new THREE.MeshLambertMaterial({color:0xffd23f, emissive:0xffd23f, emissiveIntensity:0.14});
  const core = new THREE.Mesh(geo('sph',0.22,8,7), starMat); grp.add(core);
  for(let i=0;i<5;i++){ const a=i/5*TAU + Math.PI/2;
    const pt = new THREE.Mesh(geo('cone',0.11,0.52,4), starMat);
    pt.position.set(Math.cos(a)*0.36, Math.sin(a)*0.36, 0); pt.rotation.z = a - Math.PI/2; grp.add(pt); }
  grp.position.set(x, 3.35, 0);
  return {grp, starMat};
}

// dark-string finish: same merge as w6LightsFinish (5 shared bulb materials, 5 draw calls) but NO twinkle
// ticker and the bulbs sit at glassy 0.05 opacity — dead glass on dark wire until the star wakes them.
function w6l4DarkFinish(G, L){
  G.scene.add(bakeGroup(L.wires));
  const mats = [];
  for(const [bg,bm] of L.sets){ if(bg.children.length){ bm.opacity = 0.05; G.scene.add(mergeStrands(bg,bm)); mats.push(bm); } }
  return mats;
}

function buildW6L4(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const SNOW  = W6PAL.snowD;   // moonlit snowbank ground
  const LEDGE = W6PAL.snow;    // brighter snow-shelf platforms (the bridge, the GP column)

  const deco = new THREE.Group();          // all static scenery bakes to one draw call at the tail
  const L2 = w6LightsBegin();              // THE DEAD STRINGS — built dark, woken by the star (see the ticker)

  // =============================== BEAT 1 — THE DARK GLADE (x -8..36): INTRODUCE, contested ===============================
  groundX(G, -8, 110, SNOW);                                            // the snow road runs unbroken to pit #1 at 110
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));             // CP0 — start
  signPost(G, 5, 1.7, -0.12, "GLIMMERGLADE. The night the flame went out, every festival string in the glade went dark with it - and the frost moved in behind them. But the ice remembers warmth: LIGHT SOMETHING. Give a dark lantern a good whack and see what lets go.");
  // SNOW-BOO #1 — the teaching chaser AND the first flame's keeper: it drifts at you the moment you look away;
  // STARE it and it freezes into a standable ice block (learned in 6-1 — here it LIVES in the dark, and it
  // will tail you right into lantern A's pocket: freeze it to buy the spin window, or pop it for the drop).
  // Home x18 — leashed chaseR 14 stops 2u short of an idle player at CP0 (spawn-safety law; was x14).
  G.ents.add(new SnowBoo(G, 18, 0.4, 0, {phase:0.0, speed:1.8}));
  candyLine(G, [[8,0.9,0],[11,0.9,0],[14,0.9,0]], 3);                   // the candy road walks you into the lesson
  G.ents.add(new Crow(9, 0.95, 2.4));                                   // reactive winter crow — flaps off when neared
  // THE FIRST PAIR — lantern A + wall A on flat ground, boo #1 drifting the pocket. Spin the lantern (attack
  // within ~1.7u), the wall melts, the verb is yours — earned, not handed (this district's whole thesis).
  // Wall h4.0 = clearly GATED (double 3.3 can't scrape it — never almost-jumpable, per comparable-heights law).
  const lanA = new W6Lantern(G, 22, 0); G.ents.add(lanA);
  G.ents.add(new ThawBlock(G, 25.5, 0, 2.0, 4.0, {lantern:lanA}));
  candyLine(G, [[19.5,0.9,0],[23,0.9,0],[27,0.9,0]], 3);                // the arc walks you lantern -> doorway
  candyLine(G, [[31,0.9,0],[34,0.9,0]], 2);

  // =============================== BEAT 2 — THE FROZEN SHELF (x 36..64): TWIST — a contested CHOICE ===============================
  signPost(G, 34, 1.7, 0.1, "Mind how you melt. Frozen, that block is a STAIR to the high shelf. Melted, it's a DOOR to the easy road. The glade doesn't refreeze - and it doesn't judge.");
  // PENGUIN #3 (retune) — the junction's heckler: it patrols the choice-point itself, so reading the sign and
  // lighting lantern B happen under squawk pressure (0.5s telegraph + the whole waddle visible — tap clears it).
  G.ents.add(new FrostbitePenguin(G, 32.5, 0, 0, {phase:0.2, range:2.0, dir:1, speed:1.25}));
  // THE BRIDGE-BLOCKER — block B plugs the ground path at 2.0 tall: hop its top (main-route step-up 2.0 <= 2.1)
  // and it's the stair onto the slick high road; light lantern B and it's a door onto the safe low road. The
  // choice is real but never a trap: double-jump (3.3 onto the 2.6 shelf) re-opens the high road after a melt.
  const lanB = new W6Lantern(G, 36.5, 0); G.ents.add(lanB);
  G.ents.add(new ThawBlock(G, 40, 0, 2.2, 2.0, {lantern:lanB}));
  candyLine(G, [[40,3.1,0],[42.5,3.3,0]], 2);                           // the frozen-stair lure, visible from the ground
  // HIGH ROAD — a slick ice-shelf hop line (over safe ground the whole way: ice NEVER hangs over void here —
  // that composition waits for beat 4, this level's licence). Gaps ~0.9, rises <=0.6: tap-hops with slide.
  w6IcePlat(G, 44,   2.6, 0, 2.6, 3);
  w6IcePlat(G, 47.5, 3.2, 0, 2.6, 3);
  w6IcePlat(G, 51,   3.6, 0, 2.6, 3);
  w6IcePlat(G, 54.5, 3.2, 0, 2.6, 3);
  w6IcePlat(G, 58,   2.4, 0, 2.6, 3);
  candyLine(G, [[44,3.4,0],[47.5,4.0,0],[51,4.4,0]], 3);                // high-road candy IN PLAIN SIGHT overhead
  candyLine(G, [[54.5,4.0,0],[58,3.2,0]], 2);                          //   (the low road looks up and itches — junction law)
  G.ents.add(new BonkLantern(G, 51, 4.9, 0, 'bat'));                    // shelf reward — Bat Wings for the road ahead
  // BLIZZARD BAT #3 (retune) — the shelf's air lane: squeak-telegraphed snapshot dive guarding the reward and
  // the back half of the hop line. Phase 0.7 / period 3.0 — staggered against bats #1 and #2, never synced.
  // Home 17.7u from the igloo (air-diver rule: divers drift after diving, kept far).
  G.ents.add(new BlizzardBat(G, 53.5, 5.6, 0, {phase:0.7, range:2.5, period:3.0, aggroR:4.5}));
  // LOW ROAD — the melted door's easy line, patrolled honest: penguin #1's squawk IS the telegraph
  G.ents.add(new FrostbitePenguin(G, 50, 0, 0, {phase:0.0, range:2.6, dir:1, speed:1.2}));
  candyLine(G, [[46,0.9,0],[50,0.9,0],[54,0.9,0]], 3);
  candyLine(G, [[62,0.9,0],[64.5,0.9,0]], 2);                           // both roads rejoin here

  // =============================== BEAT 3 — THE GUARDED FLAMES (x 64..110): ESCALATE A + igloo + GP vault + CP1 ===============================
  // THE MYSTERY IGLOO — Frostmere's gamble, in its CLEAR POCKET (the numbers live in the header: every patrol/
  // dive/leash reach 4.7u+ outside the interact edge by construction — the level's one deliberate hush)
  const igloo = new MysteryIgloo(71, 0, -0.4, -0.15);
  G.coffins.push(igloo); G.ents.add(igloo);
  // the quiet prop sits at the route's edge past the igloo — one lit window in the dark (never signposted)
  deco.add(w6l4Cottage(78, -2.9));
  candyLine(G, [[76,0.9,0],[80,0.9,0]], 2);
  // THE GP VAULT (visible-but-tricky + skill-gated in one): Golden Pumpkin #2 glows gold through a ThawBlock
  // vault high on a snow column — its lantern stands on open ground BETWEEN two Spooky Snowmen, who hold
  // perfectly still while watched and hop closer every moment you're busy spinning. Light it under the creep,
  // then the climb (set RIGHT of the guard pocket, clear of both hop lanes): ground -> 2.5 is the DOUBLE-JUMP
  // gate (3.3 clears with margin; candy telegraphs the verb), 2.5 -> 4.4 a held hop. The vault top (6.0) is
  // standable while frozen — the pumpkin waits inside the ice until lantern C takes the flame.
  G.ents.add(new SpookySnowman(G, 84, 0, 0, {phase:0.0, aggroR:5.5}));  // fleet-audit tune: aggroR 7 double-creep made lighting lantern C a guaranteed hit — 5.5 keeps it hot, not rigged
  G.ents.add(new SpookySnowman(G, 90, 0, 0, {phase:0.9, aggroR:5.5}));
  const lanC = new W6Lantern(G, 87, 0); G.ents.add(lanC);
  platform(G, 93, 2.5, 0, 2.6, 3, LEDGE);                               // spans 91.7..94.3 — the double-jump gate
  platform(G, 96, 4.4, 0, 2.6, 3, LEDGE);                               // spans 94.7..97.3 (+1.9 held, 0.4 gap)
  const vault = new ThawBlock(G, 96, 4.4, 1.8, 1.6, {lantern:lanC});    // the vault — melts when lantern C lights
  G.ents.add(vault);
  // GOLDEN PUMPKIN #2 spawns ON MELT, not at build (fleet-audit fix: the 1.5u pickup radius reached through
  // the frozen wall from the platform lip — sealed-until-the-thaw must be geometric TRUTH, not decoration)
  _w6l4vault = vault; _w6l4gp = false;
  candyLine(G, [[90.5,1.2,0],[93,3.4,0],[94.7,4.6,0]], 3);              // the climb traced (telegraphs the double-jump)
  deco.add(w6SnowmanDeco(87.5, -2.4, 0.9, 0.4));                        // one INNOCENT deco snowman among the guards — good luck
  // CP1 — THE one lit mid-level lantern (retune: was two, at 66 and 135.5 — D5 law says ONE, and the walk-back
  // is part of the price). x97.5 = 55% of the course, in an ENGINEERED HUSH between the guard pockets:
  // snowman B's creep reach tops at 95.5 (2.0u short), penguin #2's wake edge is 98.8 (1.3u past), boo #2's
  // leash edge is 101.5 (4.0u past). An idle player here is untouchable — the reach math is the placement.
  G.ents.add(new Checkpoint(97.5, 0, 1.6, 1));                          // CP1 — LIT. Every death past here walks from HERE.
  // WALL D — the first flame you FIGHT for, now a proper toll: lantern D behind penguin #2's patrol while
  // Snow-Boo #2 drifts in off the pit lip (freeze the boo, bait the squawk, spin the lantern in the gap — the
  // whole level's toolkit in one pocket). Penguin slideT trimmed to 0.9 so a baited right-slide dies sooner.
  G.ents.add(new FrostbitePenguin(G, 104.8, 0, 0, {phase:0.5, range:1.5, dir:-1, speed:1.3, wakeR:4.5, slideT:0.9}));
  G.ents.add(new SnowBoo(G, 115.5, 0.4, 0, {phase:0.6, speed:2.0}));    // boo #2 — home ON the pond edge past the pit; its
                                                                        //   14u leash pulls it across pit #1 at anyone past x101.5
  const lanD = new W6Lantern(G, 102.8, 0); G.ents.add(lanD);
  G.ents.add(new ThawBlock(G, 106, 0, 2.0, 4.0, {lantern:lanD}));
  candyLine(G, [[100,0.9,0],[101.8,0.9,0]], 2);

  // =============================== BEAT 4 — THE THAW POCKETS (x 108..134): ESCALATE B — THE SET-PIECE ===============================
  signPost(G, 108, 1.7, -0.1, "Two bites of void with a frozen pond between them - and something keeps ROLLING across the far half. Spin the lanterns IN STRIDE (the ice lets go faster than you think), hop what rolls at you, and JUMP when the pond runs out. Don't stop sliding.");
  // PIT #1 (x 110..114.4, gap 4.4 — held clears with margin; honest lips, winter dressing below): the district
  // licence at work — you LAND ON ICE off a void jump, sliding straight into lantern E's spin window. Boo #2
  // drifts at you across the gap (stare-freeze it mid-air and its 2.2s block is a stepping stone — the same
  // blessed expert line as the chasm) and bat #1 works the pond air (dive-aggro edge x110: a player reading
  // the beat from the lip at 109.5 is safe; step in to bait the dive, jump on its recovery).
  w6IceX(G, 114.4, 130);                                                // POND A + the roller corridor — tag:'ice', slick underfoot
  candyLine(G, [[109,1.4,0],[112.2,2.3,0],[115.2,1.3,0]], 3);          // the arc traces the jump
  const lanE = new W6Lantern(G, 116.6, 0); G.ents.add(lanE);
  G.ents.add(new ThawBlock(G, 119, 0, 1.8, 4.0, {lantern:lanE}));      // wall E spans 118.1..119.9
  candyLine(G, [[115.6,0.9,0],[117.8,0.9,0]], 2);
  G.ents.add(new BlizzardBat(G, 117, 5.4, 0, {phase:0.3, range:2.5, period:3.2, aggroR:4.5}));   // bat #1 — the pond's sky
  // THE ROLLER CORRIDOR — the chained set-piece: between walls E and F a snowball lane crosses the pond
  // (125.6 -> 120.6 on a fixed 2.9s clock, growing 0.35 -> 0.8 as it comes: tap-hoppable early, held late)
  // and lantern F stands MID-LANE at 124.5 — spin-light IN STRIDE, hopping the ball as you swing (a spin
  // lands airborne too), or bonk the frozen wall and reset against the next ball. Clean window between balls
  // ~1.5s; the hop-over is ALWAYS available; a mistimed run costs a bump, never a cheap hit. The ball dies
  // 0.7u past wall E's face and spawns 0.15u short of wall F's — it never clips unmelted ice.
  G.ents.add(new SnowballRoller(G, 125.6, 0, 0, {x1:120.6, speed:3.6, r0:0.35, r1:0.8, pause:1.5, phase:0.0}));
  const lanF = new W6Lantern(G, 124.5, 0); G.ents.add(lanF);
  G.ents.add(new ThawBlock(G, 127, 0, 1.8, 4.0, {lantern:lanF}));      // wall F spans 126.1..127.9
  candyLine(G, [[121.3,0.9,0],[123,0.9,0],[124.7,0.9,0]], 3);
  // PIT #2 (x 130..134, gap 4.0) — the gap AFTER the ice run (momentum management, the retune's new licence
  // for 6-3/6-4/6-5): 2.1u of reaction ice past wall F's doorway, the glassy sheen ends visibly at the lip,
  // the arc traces the jump, and the sign called it. Land ON ice again — beat 5 skates in.
  candyLine(G, [[128.8,1.3,0],[131.9,2.2,0],[135,1.3,0]], 3);          // the exit arc — jump where the candy jumps

  // =============================== BEAT 5 — THE GLADE STAR (x 134..164): MASTER + the firework finale ===============================
  w6IceX(G, 134, 142);                                                  // the skate-in — pit #2 lands on ice, momentum carries
  groundX(G, 142, 152, SNOW);                                           // honest snow under the star pole (the whack itself is stable)
  // THE GAUNTLET — four threats on four readable clocks, no checkpoint here anymore (retune: the finale is
  // walked from CP1 — the D5 price): roller #2 rolls 148 -> 138 growing knee-high (hop early = tap, late =
  // held), Spooky Snowman #3 creeps the icy half while you watch the lane, a Snow-Boo drifts the gloom
  // (freeze it — the block is a step OVER the roller, the level teaching itself) and Blizzard Bat #2 dives
  // the sky (phase 1.1 / period 3.4 — staggered against #1 and #3). Stare control vs lane timing: watching
  // the snowman and boo makes them safe, but the roller demands the lane and the bat punishes lingering.
  G.ents.add(new SpookySnowman(G, 140.5, 0, 0, {phase:0.4, aggroR:5.5}));
  G.ents.add(new SnowballRoller(G, 148, 0, 0, {x1:138, speed:3.6, r0:0.35, r1:0.85, pause:1.4, phase:0.6}));
  G.ents.add(new SnowBoo(G, 143, 0.4, 0, {phase:1.2, speed:2.2}));
  G.ents.add(new BlizzardBat(G, 145, 5.6, 0, {phase:1.1, range:3.5, period:3.4, aggroR:5}));
  candyLine(G, [[138.5,0.9,0],[141.5,0.9,0],[144.5,0.9,0],[147,0.9,0]], 4);   // the hop rhythm, traced
  signPost(G, 147, 1.7, 0.1, "THE GLADE STAR. Every string in Glimmerfields runs home to that pole - the whole glade went dark the night it did. One good WHACK should do it. Be ready to RUN - and watch the ice-teeth over the bridge. They drop in a wave.");
  // THE STAR SWITCH — lantern G (r:14, the master pool) wears the gold star; my ticker below does the fireworks
  const lanStar = new W6Lantern(G, 150, 0, {r:14}); G.ents.add(lanStar);
  const star = w6l4StarPole(150); S.add(star.grp);
  const starLight = new THREE.PointLight(0xffd23f, 0, 16); starLight.position.set(150, 3.4, 0); S.add(starLight);
  { const ext = mesh('cyl',[0.05,0.07,1.9,5], mat(W6PAL.woodD)); ext.position.set(150, 2.15, 0); deco.add(ext); }   // the pole runs up from the cage to the star
  // THE CHASM (x 152..164): a snow-shelf bridge with three frozen walls sealing it — h3.6 on the segs means no
  // double-jump sneaks by (gated on the star, telegraphed by the sign + the star's ember pulse). Bridge hops
  // are small (gaps <=1.4, rises <=1.1) — the challenge is the RUN: hit the star and H1 melts NOW, H2 at
  // +0.5s, H3 at +1.0s while every dead string in the glade blazes on overhead... and (retune) THREE
  // SpikeIcicles cap the bridge from the festival wire, dropping in a left-to-right WAVE (fixed 4.2s clocks,
  // phases 0 / 1.4 / 2.8; 0.7s shimmer + growing floor glow each — the bombardment language). The icicle
  // clock runs from level start, so the wave's alignment with YOUR run is set by WHEN you whack the star:
  // stand at the pole, read the wave, swing on the beat. That's the mastery exam — the spin itself becomes a
  // timed input. Mortar-free otherwise: no shells, no chasers on the bridge; hanging icicles are harmless
  // until they fall, and every drop is readable from the lip before you ever commit.
  // KNOWN EXPERT LINE (blessed, not a bug): boo #3 can be lured over the chasm, stare-frozen mid-air, and its
  // 2.2s ice block double-jumped from to clear a sealed wall — a starless cheese demanding total mastery of the
  // district verb. That's joy #2 (The Hunt) doing its job; casual play never brushes it, the star route stands.
  platform(G, 154.6, 0.6, 0, 2.4, 3, LEDGE);                            // spans 153.4..155.8
  platform(G, 158.4, 1.1, 0, 2.4, 3, LEDGE);                            // spans 157.2..159.6
  platform(G, 162.2, 0.6, 0, 2.4, 3, LEDGE);                            // spans 161.0..163.4
  const melt2 = {lit:false}, melt3 = {lit:false};                       // proxy links — the star ticker staggers them
  G.ents.add(new ThawBlock(G, 154.6, 0.6, 1.4, 3.6, {lantern:lanStar}));
  G.ents.add(new ThawBlock(G, 158.4, 1.1, 1.4, 3.6, {lantern:melt2}));
  G.ents.add(new ThawBlock(G, 162.2, 0.6, 1.4, 3.6, {lantern:melt3}));
  // THE ICICLE WAVE — hangYs sit on the dead string's sag line (the wire grew teeth when the glade froze);
  // each targets its own bridge platform (floorY = the plat top), tips hang 0.6u+ above a runner's head.
  G.ents.add(new SpikeIcicle(G, 154.6, 3.6, {floorY:0.6, phase:0.0, period:4.2}));
  G.ents.add(new SpikeIcicle(G, 158.9, 4.95, {floorY:1.1, phase:1.4, period:4.2}));
  G.ents.add(new SpikeIcicle(G, 162.2, 3.8, {floorY:0.6, phase:2.8, period:4.2}));
  candyLine(G, [[153.5,1.6,0],[156.4,2.1,0]], 2);                       // bridge candy sits clear of every frozen wall
  candyLine(G, [[160.3,2.1,0],[163.3,1.6,0]], 2);                       //   and every icicle column (nothing baits a drop)

  // =============================== RUN-OUT (x 164..185): the town side still burns ===============================
  groundX(G, 164, 185, SNOW);
  candyLine(G, [[167,0.9,0],[171,0.9,0],[175,0.9,0]], 3);
  G.ents.add(new Crow(168, 0.95, 2.3));                                 // the second winter crow sees you out
  exitGate(G, 178);

  // =============================== THE DEAD STRINGS (all wake at the star) + THE LIT TOWN-SIDE SET ===============================
  // dead set L2: every string in the glade proper, hung dark — the level's whole story in glass and wire
  w6String(L2, 2,3.2, 12,3.4);   w6String(L2, 12,3.4, 22,3.2);          // the entrance road
  w6String(L2, 40,5.6, 51,6.0);  w6String(L2, 51,6.0, 61,5.4);          // over the frozen shelf
  w6String(L2, 68,4.0, 80,4.2);                                         // the igloo hush
  w6String(L2, 136,4.0, 150,3.2);                                       // the last string runs home into the star pole
  w6String(L2, 150,3.4, 158.4,5.2); w6String(L2, 158.4,5.2, 166,3.8);   // ACROSS the chasm — the blaze you run under (and the wire the icicles grew from)
  const darkMats = w6l4DarkFinish(G, L2);
  for(const [px,ph] of [[2,3.2],[12,3.4],[22,3.2],[40,5.6],[51,6.0],[61,5.4],[68,4.0],[80,4.2],[136,4.0]]) deco.add(w6LightPost(px, -1.6, ph));
  { const bp = w6LightPost(158.4, -1.2, 4.1); bp.position.y = 1.1; deco.add(bp); }   // the bridge's own post rides seg 2
  // lit set: past the chasm the strings never went out — the way home, burning in plain sight from the bridge
  const L = w6LightsBegin();
  w6String(L, 166,3.6, 172,3.9); w6String(L, 172,3.9, 178,3.7);
  w6LightsFinish(G, L);
  for(const [px,ph] of [[166,3.6],[172,3.9],[178,3.7]]) deco.add(w6LightPost(px, -1.6, ph));

  // =============================== THE STAR TICKER — ignition, stagger, blaze ===============================
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,9), lt:-1, group:new THREE.Group(),
    update(dt){
      this.t += dt;
      if(!lanStar.lit){ star.starMat.emissiveIntensity = 0.14 + Math.sin(this.t*1.7)*0.07; return; }   // the faint ember promise
      if(this.lt < 0){                                                  // IGNITION — one frame of firework bookkeeping
        this.lt = 0;
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        G.camc.shake(0.3, 0.5);
        G.fx.spawn(new THREE.Vector3(150, 3.4, 0), 0xffd23f, 30, {speed:6, life:1});
      }
      this.lt += dt;
      if(this.lt >= 0.5 && !melt2.lit) melt2.lit = true;                // wall H2 lets go...
      if(this.lt >= 1.0 && !melt3.lit) melt3.lit = true;                // ...then H3 — run the bridge as it opens
      const k = Math.min(1, this.lt/1.5);
      for(let i=0;i<darkMats.length;i++) darkMats[i].opacity = k*(0.72 + Math.sin(this.t*2.1 + i*1.35)*0.26);
      star.starMat.emissiveIntensity = 1.1 + Math.sin(this.t*6)*0.35;
      star.grp.rotation.z += dt*0.9;                                    // the star spins like a pinwheel, lit
      starLight.intensity = Math.min(46, starLight.intensity + dt*40);
    } });

  // =============================== DECO · PINES · MOON · PARALLAX ===============================
  // background pines pressing in on the glade (baked), a watcher-snowman deep in the trees
  deco.add(w6Pine(10, -3.0, 1.5)); deco.add(w6Pine(30, -2.6, 1.7)); deco.add(w6Pine(46, -3.2, 1.4));
  deco.add(w6Pine(74, -3.4, 1.6)); deco.add(w6Pine(96, -2.8, 1.5)); deco.add(w6Pine(131, -3.0, 1.6));
  deco.add(w6Pine(155, -3.2, 1.8)); deco.add(w6Pine(182, -2.7, 1.5));
  deco.add(w6SnowmanDeco(118, -3.1, 0.7, -0.3));                        // someone built him facing the pond. why.
  deco.add(w6GiftBox(65, -2.3, 0.85)); deco.add(w6GiftBox(174, -2.1, 0.9, 0x3aa060));
  // FOREGROUND silhouettes (z>0) framing depth — snow-shouldered pines up front, one little watcher
  deco.add(w6Pine(14, 2.4, 1.1)); deco.add(w6Pine(57, 2.6, 1.3)); deco.add(w6Pine(98, 2.4, 1.2));
  deco.add(w6Pine(139, 2.5, 1.1)); deco.add(w6Pine(170, 2.4, 1.2));
  deco.add(w6SnowmanDeco(33, 2.5, 0.85, 2.6));
  S.add(bakeGroup(deco));

  // a high cold winter moon over the peaks
  const moon = mesh('circ',[4.2,28], emat(0xe8eeff,0xd8e4ff,0.85)); moon.position.set(75,16,-30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.8,28), new THREE.MeshBasicMaterial({color:0x9ab4e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(75,16,-30.2); S.add(moonH);

  // three-depth Glimmerfields skyline (snowdrifts & birches / the lamplit village / the great blue peaks) + aurora
  w6Parallax(S, -8, 185);

  // themed crevasse dressing under all three true pits (visual — the fall is the hazard; a heart + the walk back)
  pitDressing(G, 110, 114.4, 'winter');
  pitDressing(G, 130, 134, 'winter');
  pitDressing(G, 152, 164, 'winter');

  // exit + the W6 tail. clutter placed manually on the SNOW spans only (both ponds keep their baked sparkle
  // flecks; nothing scatters over the three pits or under the bridge)
  w6LevelFinish(G, -8, 185, null);
  w6Clutter(G, -8, 108, 'winter');
  w6Clutter(G, 142, 150, 'winter');
  w6Clutter(G, 164, 183, 'winter');

  return {spawnX: 0, exitX: 178};
}

let _w6l4vault = null, _w6l4gp = false;   // rebuilt every entry (build resets both)
function updateW6L4(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: the vault's pumpkin materializes the moment the thaw opens it — never collectable
  // through ice. Already-banked pumpkins stay banked (same got-filter rule switchArea applies at build).
  if(!_w6l4gp && _w6l4vault && _w6l4vault.melting){
    _w6l4gp = true;
    const got = (G.save.gp && G.save.gp.w6) || [];
    if(!got[2] && !(G.runPumpkins && G.runPumpkins[2])){
      G.ents.add(new GoldPumpkin(96, 5.2, 0, 2));
      G.fx.spawn(new THREE.Vector3(96, 5.2, 0), 0xffd23f, 14, {speed:3, life:0.6});
    }
  }
  // (lanterns, thaw blocks, both roller clocks, the icicle wave, the aurora and the bulb sets all self-tick
  // deterministically through G.ents from their fixed clocks; the melt stagger is the star ticker's 0.5s
  // cadence — covenant holds.)
}

W6_LEVELS.push({id:'w6l4', district:'w6', name:'GLIMMERGLADE', build:buildW6L4, update:updateW6L4, parTime:168});

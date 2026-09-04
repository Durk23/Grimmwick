// ============ LEVEL 6-4 — GLIMMERGLADE (District 6 · Frostmere · Glimmerfields) ============
// The glade where the festival lights went OUT. Every string hangs dead between its posts, the frost has
// crept over doors and bridges, and one candle burns in one cottage window because somebody never gave up.
// This is Frostmere's PUZZLE-PLATFORMING beat and the district's signature verb made whole: LIGHT THAWS ICE —
// spin a dark W6Lantern lit and its linked ThawBlock MELTS open. Introduce it safely, twist it into a ROUTE
// CHOICE (melting is forever — the frozen top WAS the high road), escalate it under enemy pressure and then
// mid-slide between thaw pockets, and master it at the GLADE STAR: one whack and the whole glade blazes back.
// Full introduce->twist->escalate->master at D3 density ("fairly competitive": 10 threats, 3 lanes), every
// element clocked and telegraphed — structured chaos, never bullet-hell:
//   BEAT 1 THE DARK GLADE (INTRODUCE)       x -8..36  — CP0. A Snow-Boo drifts the gloom (stare = a standable
//          ice block — the D4 rule's winter twist); the FIRST lantern+wall pair on flat safe ground. Dead
//          strings overhead; a startled winter crow.
//   BEAT 2 THE FROZEN SHELF (TWIST)         x 36..64  — a ThawBlock BRIDGE-BLOCKER: frozen, its top is the
//          STAIR to a slick high road (ice platforms, more candy, Bat Wings); melted, it's the DOOR to the
//          safe low road (a penguin patrols it). Melting is a CHOICE — the glade doesn't refreeze.
//   BEAT 3 THE GUARDED FLAMES (ESCALATE A)  x 64..108 — CP1 (lit). The Mystery Igloo in its clear pocket; the
//          QUIET PROP cottage; GOLDEN PUMPKIN #2 sealed in a ThawBlock VAULT high overhead, its lantern
//          flanked by TWO Spooky Snowmen (light it while they creep); then wall D's lantern behind a
//          Frostbite Penguin + a Snow-Boo — the first flame you fight for.
//   BEAT 4 THE THAW POCKETS (ESCALATE B)    x 108..134 — pit #1, then the ice pond: spin the lantern IN
//          STRIDE and carry momentum through walls E and F as they open (the collider ghosts in a tenth of a
//          second — faster than your slide). A Blizzard Bat works the air lane. (6-4 is the one level before
//          6-5 allowed to combine ice with void — both pits have honest snow lips, gaps <=4.4.)
//   BEAT 5 THE GLADE STAR (MASTER · finish) x 134..164 — CP2 (lit). A growing Snowball Roller owns the lane,
//          a Snow-Boo and a Blizzard Bat crowd the approach — then the STAR SWITCH: spin the star-pole and
//          EVERY dead string in the glade blazes on while three ice walls melt in sequence across the chasm
//          bridge. Run it as it opens. The level's firework moment.
//   RUN-OUT                                 x 164..185 — the town-side strings still burn; the gate under
//          festival light.
// Reads UNMISTAKABLY Glimmerfields: W6PAL moonlit snow + blue-violet night, dead bulb-strings that WAKE, warm
// lantern pools pushed into G.lightPools, icy-cyan cold spirits, snow-shouldered pines, the aurora breathing
// over the far peaks. Three lanes busy the whole way (ground snowmen/penguins/roller · air Blizzard Bats ·
// floating Snow-Boos). Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; main-route step-ups
// <=2.1, pit gaps <=4.4, every blocker wall h>=3.6 = clearly GATED on the lantern verb, never almost-jumpable).
// Deterministic to the tooth — fixed enemy phases, the roller on a fixed lane clock, the star's melt stagger on
// a fixed 0.5s cadence, lanterns/thaws one-way switches; seeded rand() only inside baked cosmetic deco. No
// Math.random on the critical path. NO Leap of Faith (both already live elsewhere — sacred). HEARTS ALWAYS:
// pits cost a heart + the lantern walk-back, nothing one-shots.
// CLEAR-PATCH LAW (igloo @ x71): zero patrol/dive coverage within ~6u by construction — penguin #1's patrol
// tops out at x52.6 (19u clear, wakeR 5 can't reach), snowman A homes at x84 with aggroR 7 (the igloo's
// interact edge x73.8 sits 10u+ outside his creep trigger), both Blizzard Bat homes are 52u/74u away (they
// drift after diving — kept far per the air-diver rule), the roller lane ends at x138. Snow-Boos are
// stare-controlled chasers with no patrol home (the w5l1 Shadow-Copy precedent): boo #1 is the beat-1 teaching
// kill and the level's own verb freezes any tag-along harmless — opening stays a deliberate safe act.

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

  // =============================== BEAT 1 — THE DARK GLADE (x -8..36): INTRODUCE light-thaws-ice ===============================
  groundX(G, -8, 110, SNOW);                                            // the snow road runs unbroken to pit #1 at 110
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));             // CP0 — start
  signPost(G, 5, 1.7, -0.12, "GLIMMERGLADE. The night the flame went out, every festival string in the glade went dark with it - and the frost moved in behind them. But the ice remembers warmth: LIGHT SOMETHING. Give a dark lantern a good whack and see what lets go.");
  // SNOW-BOO #1 — the teaching chaser: it drifts at you the moment you look away; STARE it and it freezes into
  // a standable ice block (the D4 rule's winter twist, learned in 6-1 — here it LIVES in the dark). The candy
  // road walks you straight into the lesson; almost every run pops it here for the drop.
  G.ents.add(new SnowBoo(G, 14, 0.4, 0, {phase:0.0, speed:1.8}));
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12,0.9,0]], 3);
  G.ents.add(new Crow(9, 0.95, 2.4));                                   // reactive winter crow — flaps off when neared
  // THE FIRST PAIR — lantern A + wall A on flat safe ground: nothing else nearby, nothing rushed. Spin the
  // lantern (attack within ~1.7u), the wall melts, the verb is yours. Wall h4.0 = clearly GATED (double 3.3
  // can't scrape it — never almost-jumpable, per comparable-heights law).
  const lanA = new W6Lantern(G, 22, 0); G.ents.add(lanA);
  G.ents.add(new ThawBlock(G, 25.5, 0, 2.0, 4.0, {lantern:lanA}));
  candyLine(G, [[19.5,0.9,0],[23,0.9,0],[27,0.9,0]], 3);                // the arc walks you lantern -> doorway
  candyLine(G, [[31,0.9,0],[34,0.9,0]], 2);

  // =============================== BEAT 2 — THE FROZEN SHELF (x 36..64): TWIST — melting is a CHOICE ===============================
  signPost(G, 34, 1.7, 0.1, "Mind how you melt. Frozen, that block is a STAIR to the high shelf. Melted, it's a DOOR to the easy road. The glade doesn't refreeze - and it doesn't judge.");
  // THE BRIDGE-BLOCKER — block B plugs the ground path at 2.0 tall: hop its top (main-route step-up 2.0 <= 2.1)
  // and it's the stair onto the slick high road; light lantern B and it's a door onto the safe low road. The
  // choice is real but never a trap: double-jump (3.3 onto the 2.6 shelf) re-opens the high road after a melt.
  const lanB = new W6Lantern(G, 36.5, 0); G.ents.add(lanB);
  G.ents.add(new ThawBlock(G, 40, 0, 2.2, 2.0, {lantern:lanB}));
  candyLine(G, [[40,3.1,0],[42.5,3.3,0]], 2);                           // the frozen-stair lure, visible from the ground
  // HIGH ROAD — a slick ice-shelf hop line (over safe ground the whole way: ice NEVER hangs over void here —
  // that combination waits for beat 4, this level's one licence). Gaps ~0.9, rises <=0.6: tap-hops with slide.
  w6IcePlat(G, 44,   2.6, 0, 2.6, 3);
  w6IcePlat(G, 47.5, 3.2, 0, 2.6, 3);
  w6IcePlat(G, 51,   3.6, 0, 2.6, 3);
  w6IcePlat(G, 54.5, 3.2, 0, 2.6, 3);
  w6IcePlat(G, 58,   2.4, 0, 2.6, 3);
  candyLine(G, [[44,3.4,0],[47.5,4.0,0],[51,4.4,0]], 3);                // high-road candy IN PLAIN SIGHT overhead
  candyLine(G, [[54.5,4.0,0],[58,3.2,0]], 2);                          //   (the low road looks up and itches — junction law)
  G.ents.add(new BonkLantern(G, 51, 4.9, 0, 'bat'));                    // shelf reward — Bat Wings for the road ahead
  // LOW ROAD — the melted door's easy line, patrolled honest: penguin #1's squawk IS the telegraph
  G.ents.add(new FrostbitePenguin(G, 50, 0, 0, {phase:0.0, range:2.6, dir:1, speed:1.2}));
  candyLine(G, [[46,0.9,0],[50,0.9,0],[54,0.9,0]], 3);
  candyLine(G, [[62,0.9,0],[64.5,0.9,0]], 2);                           // both roads rejoin here

  // =============================== BEAT 3 — THE GUARDED FLAMES (x 64..108): ESCALATE A + CP1 + igloo + GP vault ===============================
  G.ents.add(new Checkpoint(66, 0, 1.6, 1));                            // CP1 — LIT, first of the two mid lanterns
  // THE MYSTERY IGLOO — Frostmere's gamble, in its CLEAR POCKET (the numbers live in the header comment: every
  // patrol/dive home 10u+ away by construction; the pocket is the level's one deliberate hush before the fight)
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
  // WALL D — the first flame you FIGHT for: lantern D behind a penguin's patrol with a Snow-Boo drifting in
  // (freeze the boo, bait the squawk, spin the lantern in the gap — the whole level's toolkit in one pocket)
  G.ents.add(new FrostbitePenguin(G, 99.5, 0, 0, {phase:0.5, range:2.0, dir:-1, speed:1.3, wakeR:4.5}));
  G.ents.add(new SnowBoo(G, 104, 0.4, 0, {phase:0.6, speed:2.0}));      // the wall's keeper, drifting before the ice
  const lanD = new W6Lantern(G, 102.5, 0); G.ents.add(lanD);
  G.ents.add(new ThawBlock(G, 105.5, 0, 2.0, 4.0, {lantern:lanD}));
  candyLine(G, [[99,0.9,0],[101,0.9,0]], 2);

  // =============================== BEAT 4 — THE THAW POCKETS (x 108..134): ESCALATE B — momentum between melts ===============================
  signPost(G, 108, 1.7, -0.1, "The pond ahead is pure ice - slick as a Boo's manners - and more frost-walls squat on it. Spin their lanterns IN STRIDE: the ice lets go faster than you think. Whatever you do, don't stop sliding.");
  // PIT #1 (x 110..114.4, gap 4.4 — held clears with margin; honest snow lips, winter dressing below): the one
  // district licence at work — you LAND ON ICE off a void jump. Room to gather yourself before wall E.
  w6IceX(G, 114.4, 134);                                                // the frozen pond — tag:'ice', slick underfoot
  candyLine(G, [[109,1.4,0],[112.2,2.3,0],[115.2,1.3,0]], 3);          // the arc traces the jump
  // THE MOMENTUM PAIRS — lantern then wall, 3u apart: at slide speed the collider ghosts (0.1s) before you
  // arrive. Learn it on E, own it on F. A mistimed spin just means a bump and a re-approach — never a hit.
  const lanE = new W6Lantern(G, 117.5, 0); G.ents.add(lanE);
  G.ents.add(new ThawBlock(G, 120.5, 0, 1.8, 4.0, {lantern:lanE}));
  candyLine(G, [[116.5,0.9,0],[118.5,0.9,0]], 2);
  const lanF = new W6Lantern(G, 125, 0); G.ents.add(lanF);
  G.ents.add(new ThawBlock(G, 128, 0, 1.8, 4.0, {lantern:lanF}));
  candyLine(G, [[122,0.9,0],[124.5,0.9,0],[127,0.9,0]], 3);
  // BLIZZARD BAT #1 — the air lane over the pond (squeak-telegraphed snapshot dive; home 52u from the igloo)
  G.ents.add(new BlizzardBat(G, 123, 5.4, 0, {phase:0.3, range:3, period:3.2, aggroR:4.5}));
  candyLine(G, [[130,1.0,0],[132.5,1.1,0]], 2);                         // skate-out candy under the bat's beat

  // =============================== BEAT 5 — THE GLADE STAR (x 134..164): MASTER + CP2 + the firework finale ===============================
  groundX(G, 134, 152, SNOW);
  G.ents.add(new Checkpoint(135.5, 0, 1.6, 2));                         // CP2 — LIT, second mid lantern (finale falls walk from HERE)
  // THE ROLLER LANE — a snowball rolls 148 -> 138 on a fixed clock, GROWING as it comes (cute at the far end,
  // knee-high boulder by yours): hop it early and it's a tap, hop it late and it wants the held jump. Learn the
  // lane. A Snow-Boo drifts the gloom (freeze it — the block is a step OVER the roller, the level teaching
  // itself) and Blizzard Bat #2 dives the sky: three lanes, every threat on its own readable clock.
  G.ents.add(new SnowballRoller(G, 148, 0, 0, {x1:138, speed:3.4, r0:0.35, r1:0.85, pause:1.4, phase:0.6}));
  G.ents.add(new SnowBoo(G, 143, 0.4, 0, {phase:1.2, speed:2.2}));
  G.ents.add(new BlizzardBat(G, 145, 5.6, 0, {phase:1.1, range:3.5, period:3.4, aggroR:5}));
  candyLine(G, [[138.5,0.9,0],[141.5,0.9,0],[144.5,0.9,0],[147,0.9,0]], 4);   // the hop rhythm, traced
  signPost(G, 147, 1.7, 0.1, "THE GLADE STAR. Every string in Glimmerfields runs home to that pole - the whole glade went dark the night it did. One good WHACK should do it. Word of advice: be ready to RUN.");
  // THE STAR SWITCH — lantern G (r:14, the master pool) wears the gold star; my ticker below does the fireworks
  const lanStar = new W6Lantern(G, 150, 0, {r:14}); G.ents.add(lanStar);
  const star = w6l4StarPole(150); S.add(star.grp);
  const starLight = new THREE.PointLight(0xffd23f, 0, 16); starLight.position.set(150, 3.4, 0); S.add(starLight);
  { const ext = mesh('cyl',[0.05,0.07,1.9,5], mat(W6PAL.woodD)); ext.position.set(150, 2.15, 0); deco.add(ext); }   // the pole runs up from the cage to the star
  // THE CHASM = PIT #2 (x 152..164): a snow-shelf bridge with three frozen walls sealing it — h3.6 on the segs
  // means no double-jump sneaks by (gated on the star, telegraphed by the sign + the star's ember pulse).
  // Bridge hops are small (gaps <=1.4, rises <=1.1) — the challenge is the RUN, not the jumps: hit the star and
  // H1 melts NOW, H2 at +0.5s, H3 at +1.0s while every dead string in the glade blazes on overhead.
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
  candyLine(G, [[153.5,1.6,0],[156.4,2.1,0]], 2);                       // bridge candy sits clear of every frozen wall
  candyLine(G, [[160.3,2.1,0],[163.3,1.6,0]], 2);                       //   (nothing to vacuum through the ice)

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
  w6String(L2, 150,3.4, 158.4,5.2); w6String(L2, 158.4,5.2, 166,3.8);   // ACROSS the chasm — the blaze you run under
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

  // themed crevasse dressing under both true pits (visual — the fall is the hazard; a heart + the walk back)
  pitDressing(G, 110, 114.4, 'winter');
  pitDressing(G, 152, 164, 'winter');

  // exit + the W6 tail. clutter placed manually on the SNOW spans only (the pond keeps its baked sparkle flecks;
  // nothing scatters over the two pits or under the bridge)
  w6LevelFinish(G, -8, 185, null);
  w6Clutter(G, -8, 108, 'winter');
  w6Clutter(G, 134, 150, 'winter');
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
  // (lanterns, thaw blocks, the roller clock, the aurora and the bulb sets all self-tick deterministically
  // through G.ents from their fixed clocks; the melt stagger is the star ticker's 0.5s cadence — covenant holds.)
}

W6_LEVELS.push({id:'w6l4', district:'w6', name:'GLIMMERGLADE', build:buildW6L4, update:updateW6L4, parTime:160});

// ============ LEVEL 3-2 — THE WEB GALLERY (District 3 · Witchwood) ============
// THE spider level AND the district's CLIMBING SHOWCASE. Signature gimmick:
// GIANT-WEB CLIMBING (w3Web {type:'climb'} volumes) played as the movement language,
// with a constant, fair, TELEGRAPHED spider swarm layered over it. Full arc:
//   ACT 1 THE FOREST EDGE (INTRODUCE) x -6..40 — learn the web: one giant web up to a
//         reward ledge, the first WEBLING walling the lane (spin to tear / wait / climb over),
//         a Widowmite swarm, a drop-Spider. Gentle, low-road always open.
//   ACT 2 THE BRANCHING WEBS (TWIST) x 40..78 — climb a web to a JUNCTION and CHOOSE a
//         strand: the bravest, highest branch hides the GOLDEN PUMPKIN (the "behind a secret"
//         one). Then the first WEB-STRAND TRAVERSE: crawl a wide web across a ravine like a
//         spider. A MYSTERY CAULDRON gamble waits in a clear pocket past the crossing.
//   ACT 3 THE GALLERY (ESCALATE) x 78..120 — the gallery proper: a WEBLING-walled corridor
//         (break through low or take the high catwalk over the top), a second mandatory
//         web-traverse over a THORN PIT (a Webling walls the far exit as you land), and a
//         playful climb->boosted-hop->climb COMBO high road to a Heart peak, all under
//         Widowmite swarms + drop-Spiders.
//   ACT 4 THE GRAND WEB (MASTER) x 120..158 — one climactic climb: web -> mid-ledge (a
//         Webling walls it mid-climb) -> web -> summit + BAT WINGS, then GLIDE the whole
//         gallery down to the exit. Master beat combines every web verb learned.
// Runs along +X at the z=0 lane; two designed void gaps (58..66, 96..104) are the only lethal
// falls and each has a checkpoint just before it and a candy-traced web crossing (honest, never
// a leap of faith). All static deco BAKED; the web-gallery keeps to a tight ~6-light budget
// (GoldPumpkin + Mystery Cauldron + 2 lit checkpoints). Uses the D3 kit (09u_w3kit): w3Web,
// w3Parallax/w3Ambience via w3LevelFinish, w3Clutter, MysteryCauldron, braidedTree/hangingWeb/
// mushroomCluster/potionBottle/willOWisp; and the Witchwood roster (07w): Webling/WebWall,
// Widowmite, plus reused drop-Spiders + a few Swoop Bats (07_enemies).

function buildW3L2(G){
  const S = G.scene;
  levelBegin(G);

  // ================= ACT 1 — THE FOREST EDGE (INTRODUCE) x -6..40 =================
  groundX(G, -6, 40, W3PAL.ground);
  signPost(G, 2, 0, -0.12, INPUT.isTouch ?
    'THE WEB GALLERY. Touch a giant web and hold UP to climb - hold a direction to crawl across - JUMP to leap off. SPIN tears a WEBLING\'s wall.' :
    'THE WEB GALLERY. Grab a giant web (UP) and climb - hold a direction to crawl across - SPACE to leap off. A SPIN tears down a WEBLING\'s wall (or climb over it).');
  G.ents.add(new Checkpoint(4, 0, 0, 0, {noLight:true}));            // CP0 — start, before the first web
  // a telegraphed Widowmite swarm of 3 — easy 1-hit stomps to learn the district's pest
  G.ents.add(new Widowmite(G, 9,  0, 0, {range:2.0, phase:0.0}));
  G.ents.add(new Widowmite(G, 11, 0, 0, {range:2.0, phase:0.6}));
  G.ents.add(new Widowmite(G, 13, 0, 0, {range:2.0, phase:1.2}));
  candyLine(G, [[5,0.8,0],[8,0.8,0]], 4);

  // INTRODUCE the web climb — an optional high road: giant web -> reward ledge (the low road runs on)
  w3Web(G, 17, 0, 4.6, 0, 3);
  candyLine(G, [[17,1.4,0],[17,2.8,0],[17,4.0,0]], 3);              // rhythm candy up the strands
  platform(G, 20, 4.6, 0, 4.5, 3, W3PAL.bark);                     // the reward ledge (top 4.6, near the web top)
  G.ents.add(new Heart(21, 5.5, 0));
  candyLine(G, [[18.6,5.1,0],[22,5.1,0]], 3);
  candyLine(G, [[19,0.8,0],[22,0.8,0]], 3);                        // ground candy under the ledge — low road stays fed
  // (drop off the ledge's right edge back to the ground — a safe fall, high road rejoins low road)

  signPost(G, 24, 0, 0.12, 'A WEBLING! It weaves a wall across the lane. SPIN to tear it down, wait for it to rot away, or take the high strands over.');
  G.ents.add(new Webling(G, 30, 0, 0, {phase:1.0, period:5.5, firstWeb:2.0}));   // INTRODUCE the web-wall
  candyLine(G, [[26,0.8,0],[28,0.8,0]], 3);
  G.ents.add(new Widowmite(G, 33, 0, 0, {range:2.5, phase:0.4}));
  G.ents.add(new Spider(G, 36, 5, 0, {groundY:0}));                // INTRODUCE the drop-Spider
  candyLine(G, [[35,0.8,0],[38,0.8,0]], 3);

  // ================= ACT 2 — THE BRANCHING WEBS (TWIST) x 40..78 =================
  groundX(G, 40, 58, W3PAL.ground);                               // low road up to the ravine lip
  groundX(G, 66, 78, W3PAL.ground);                               // far bank (gap A: 58..66)
  signPost(G, 43, 0, -0.1, 'BRANCHING WEBS. Climb, then CHOOSE a strand. The bravest, highest climb hides the witch\'s gold.');

  // the branch web: climb to a JUNCTION, pick RIGHT (forward high road) or LEFT (the secret GP climb)
  w3Web(G, 47, 0, 6.6, 0, 3);
  candyLine(G, [[47,1.4,0],[47,3.2,0],[47,5.0,0],[47,6.2,0]], 4);
  // RIGHT branch — the obvious forward high road (candy + a shield for the crossing), spills back to ground
  platform(G, 51, 6.6, 0, 5, 3, W3PAL.bark);
  candyLine(G, [[49,7.1,0],[53,7.1,0]], 4);
  G.ents.add(new BonkLantern(G, 53.5, 7.6, 0, 'shield'));
  platform(G, 54.5, 3.6, 0, 3, 3, W3PAL.barkL);                   // a step down toward the ravine lip
  candyLine(G, [[53.5,4.2,0],[55.5,4.2,0]], 3);
  // LEFT branch — the "behind a secret" climb: a subtler, HIGHER web up to the Golden Pumpkin
  platform(G, 43.5, 6.6, 0, 3.5, 3, W3PAL.barkD);                 // the left nook (leap off the web to reach it)
  w3Web(G, 42, 6.6, 11.2, 0, 2.6);                                // the brave upper climb
  candyLine(G, [[42,7.4,0],[42,8.8,0],[42,10.2,0]], 3);           // the quiet lure upward
  platform(G, 40, 11.2, 0, 3.5, 3, W3PAL.barkD);                  // the hidden high alcove
  G.ents.add(new GoldPumpkin(40, 12.0, 0, 1));                    // GOLDEN PUMPKIN idx 1
  { const w = hangingWeb(38.4, -0.4, 1.1); w.position.y = 11.2; S.add(bakeGroup((()=>{const g=new THREE.Group(); g.add(w); return g;})())); }  // a torn web frames the prize

  // low-road pressure through Act 2a (the high road SEES the GP web overhead — routes cross)
  G.ents.add(new Widowmite(G, 45, 0, 0, {range:2.0, phase:0.2}));
  G.ents.add(new Spider(G, 49, 5, 0, {groundY:0}));
  candyLine(G, [[44,0.8,0],[48,0.8,0]], 4);
  G.ents.add(new Webling(G, 54, 0, 0, {phase:0.5, period:5.0}));
  G.ents.add(new Widowmite(G, 56, 0, 0, {range:1.8, phase:0.9}));
  G.ents.add(new Checkpoint(54, 0, 1.6, 1));                      // CP1 — lit, just before the ravine traverse

  // THE WEB-STRAND TRAVERSE — crawl a WIDE web across the ravine (gap A x58..66) like a spider
  signPost(G, 57, 0, 0.1, 'The webbing bridges the ravine - GRAB it and crawl across. Nothing solid below.');
  w3Web(G, 62, 0.4, 4.2, 0, 8.6);                                 // grab from the near lip, crawl right, exit on the far bank
  candyLine(G, [[58.5,1.6,0],[62,2.4,0],[65.5,1.6,0]], 6);        // the crossing line
  G.ents.add(new SwoopBat(G, 62, 4.6, 0, {range:3.2, period:3.6, phase:0.3}));   // the lone air threat over the gap (fixed patrol)
  S.add(bakeGroup((()=>{ const g=new THREE.Group();              // deep thorns in the ravine — the honest "don't fall" read
    for(const sx of [59,61.5,64]){ const th=mesh('cone',[0.22,rand(1.0,1.6),5], emat(0x7a3fbf,0x5b2fa0,0.5)); th.position.set(sx,-3.4,rand(-0.6,0.6)); crook(th,0.12); g.add(th); }
    return g; })()));

  // far bank (x66..78) — a CLEAR POCKET for the Mystery Cauldron (no patrol within ~6u), then CP-run
  candyLine(G, [[67,0.8,0],[69,0.8,0]], 3);
  signPost(G, 68.5, 0, -0.1, 'The witch\'s brewing cauldron, unwatched. A dip is a gamble - sweets, treasure... or a nest of widows.');
  { const cauldron = new MysteryCauldron(71, 0, -1.7, 0);        // the D3 gamble container (Widowmite ambush on the clear-patch ring)
    G.ents.add(cauldron); G.coffins.push(cauldron);
    G.world.addBox(71, 0, -1.7, 2.0, 1.6, 2.0, {}); }
  candyLine(G, [[73.5,0.8,0],[76.5,0.8,0]], 3);

  // ================= ACT 3 — THE GALLERY (ESCALATE) x 78..120 =================
  groundX(G, 78, 96, W3PAL.ground);                               // corridor floor up to gap B
  groundX(G, 104, 120, W3PAL.ground);                             // floor after gap B
  signPost(G, 79, 0, 0.1, 'THE WEB GALLERY proper. Weblings wall every lane - break through low, or take the high strands over the top.');

  // --- the WEBLING-walled corridor (x80..92): break through, or the high catwalk over it ---
  G.ents.add(new Webling(G, 83, 0, 0, {phase:0.0, period:5.0, firstWeb:1.5}));
  G.ents.add(new Webling(G, 89, 0, 0, {phase:2.6, period:5.0}));
  G.ents.add(new Widowmite(G, 85, 0, 0, {range:2.5, phase:0.3}));
  G.ents.add(new Widowmite(G, 87, 0, 0, {range:2.5, phase:1.1}));
  G.ents.add(new Spider(G, 86, 5.5, 0, {groundY:0}));
  candyLine(G, [[80,0.8,0],[82,0.8,0]], 3);
  candyLine(G, [[90,0.8,0],[92,0.8,0]], 3);
  // HIGH ROAD — climb over the whole corridor on the catwalk (candy reward; low road sees it above)
  w3Web(G, 81, 0, 5.0, 0, 3);
  candyLine(G, [[81,1.4,0],[81,3.0,0],[81,4.4,0]], 3);
  platform(G, 86, 5.0, 0, 9, 2.6, W3PAL.bark);                    // the catwalk over the corridor
  candyLine(G, [[82.5,5.5,0],[89.5,5.5,0]], 5);
  G.ents.add(new Spider(G, 86, 6.8, 0, {groundY:5.0}));           // a gallery tenant drops onto the catwalk slab

  // breather (x92..96) — never a dead stretch
  candyLine(G, [[92.5,0.8,0],[95,0.8,0]], 3);
  G.ents.add(new Widowmite(G, 94, 0, 0, {range:2.0, phase:0.7}));

  // --- the GALLERY TRAVERSE #2 over a THORN PIT (gap B x96..104): mandatory crawl, walled far exit ---
  G.ents.add(new Checkpoint(93, 0, 1.6, 2, {noLight:true}));      // CP2 — just before the thorn-pit traverse
  w3Web(G, 100, 0.4, 4.5, 0, 8.6);
  candyLine(G, [[96,1.6,0],[100,2.6,0],[104,1.6,0]], 6);
  G.ents.add(new SwoopBat(G, 100, 5.0, 0, {range:3.0, period:3.3, phase:1.0}));   // owns the air over the pit
  S.add(bakeGroup((()=>{ const g=new THREE.Group();              // thorns in the pit — the tell is real
    for(let i=0;i<7;i++){ const th=mesh('cone',[0.22,rand(1.2,1.9),5], emat(0x7a3fbf,0x5b2fa0,0.5)); th.position.set(rand(97,103),-3.6,rand(-1.4,1.4)); crook(th,0.12); g.add(th); }
    return g; })()));
  G.ents.add(new Webling(G, 105.5, 0, 0, {phase:0.0, period:5.0, firstWeb:1.2}));  // walls the far exit as you land — tear it, or wait it out

  // --- the CLIMB->HOP->CLIMB COMBO high road (x106..118) to a Heart peak, over a busy low road ---
  candyLine(G, [[106,0.8,0],[109,0.8,0]], 3);
  G.ents.add(new Widowmite(G, 108, 0, 0, {range:2.5, phase:0.5}));
  G.ents.add(new Widowmite(G, 110, 0, 0, {range:2.5, phase:1.3}));
  w3Web(G, 107, 0, 4.6, 0, 3);                                    // combo step 1
  candyLine(G, [[107,1.4,0],[107,3.0,0],[107,4.2,0]], 3);
  platform(G, 110, 4.6, 0, 3.5, 3, W3PAL.bark);                   // boosted-hop landing
  candyLine(G, [[109,5.1,0],[111,5.1,0]], 3);
  w3Web(G, 113, 4.6, 9.0, 0, 2.6);                               // combo step 2 — climb from the ledge
  candyLine(G, [[113,5.6,0],[113,7.0,0],[113,8.4,0]], 3);
  platform(G, 116, 9.0, 0, 4, 3, W3PAL.barkD);                    // the combo peak
  G.ents.add(new Heart(116.5, 9.8, 0));                          // the climb's prize
  candyLine(G, [[114.5,9.5,0],[117.5,9.5,0]], 3);
  G.ents.add(new SwoopBat(G, 116, 9.4, 0, {range:3.0, period:3.2, phase:0.6}));  // guards the high air
  // low road under it stays honest
  G.ents.add(new Spider(G, 112, 5.5, 0, {groundY:0}));
  candyLine(G, [[111,0.8,0],[114,0.8,0]], 3);
  G.ents.add(new Webling(G, 116, 0, 0, {phase:1.4, period:5.0}));
  candyLine(G, [[117,0.8,0],[119,0.8,0]], 3);

  // ================= ACT 4 — THE GRAND WEB (MASTER) x 120..158 =================
  groundX(G, 120, 158, W3PAL.ground);
  G.ents.add(new Checkpoint(120, 0, 1.6, 3));                     // CP3 — lit, before the grand master climb
  signPost(G, 121, 0, 0.1, 'THE GRAND WEB. One last climb - mind the widows on the strands and the wall between them. Bat wings wait at the top.');

  // the grand climb: web -> mid-ledge (a Webling walls it MID-CLIMB) -> web -> summit + BAT WINGS
  w3Web(G, 124, 0, 6.0, 0, 3.4);
  candyLine(G, [[124,1.4,0],[124,3.0,0],[124,4.6,0],[124,5.6,0]], 4);
  platform(G, 128, 6.0, 0, 4.5, 3, W3PAL.bark);                   // the mid-ledge
  G.ents.add(new Webling(G, 128, 6.0, 0, {phase:0.6, period:5.0, wallH:2.6}));    // walls the ledge mid-climb — the escalation
  w3Web(G, 131, 6.0, 11.0, 0, 2.6);                              // the upper climb off the mid-ledge
  candyLine(G, [[131,7.0,0],[131,8.6,0],[131,10.2,0]], 3);
  platform(G, 134, 11.0, 0, 4.5, 3, W3PAL.barkD);                // the summit
  G.ents.add(new Spider(G, 133, 12.5, 0, {groundY:11.0}));       // a summit tenant
  G.ents.add(new BonkLantern(G, 135, 11.8, 0, 'bat'));           // BAT WINGS — the master reward + the glide-down toy
  candyLine(G, [[132.5,11.6,0],[136,11.6,0]], 3);
  // low road under the grand climb stays alive (webs are climb-only, not solid — a walker passes beneath)
  G.ents.add(new Spider(G, 130, 5, 0, {groundY:0}));
  candyLine(G, [[126,0.8,0],[130,0.8,0],[134,0.8,0]], 4);

  // THE QUIET PROP (never signposted): a witch's tea-for-two under the trees, both chairs long
  // cobwebbed, two cups set out, a wilted flower drooping in a potion bottle. She laid a place for
  // a guest who never came. (Story-readers will feel it - Grimmwick's whole ache in one still table.)
  { const q = new THREE.Group();
    const post = mesh('cyl',[0.07,0.09,0.55,6], mat(W3PAL.hutD)); post.position.y=0.28;
    const top  = mesh('cyl',[0.52,0.52,0.09,12], mat(W3PAL.hut)); top.position.y=0.56;
    q.add(post, top);
    for(const sx of [-0.85, 0.85]){                              // two little stools, facing in
      const sl = mesh('cyl',[0.045,0.06,0.42,5], mat(W3PAL.hutD)); sl.position.set(sx,0.2,0);
      const st = mesh('cyl',[0.2,0.2,0.07,9], mat(W3PAL.hut)); st.position.set(sx,0.42,0);
      q.add(sl, st);
    }
    const cupL = mesh('cyl',[0.07,0.055,0.1,8], mat(0xd8d2e4)); cupL.position.set(-0.22,0.62,0.12);
    const cupR = mesh('cyl',[0.07,0.055,0.1,8], mat(0xd8d2e4)); cupR.position.set(0.24,0.62,-0.1);
    const vase = mesh('sph',[0.09,8,7], emat(W3PAL.potionP,W3PAL.potionP,0.5)); vase.position.set(0,0.66,0); vase.scale.set(1,1.2,1);
    const stem = mesh('cyl',[0.012,0.012,0.18,4], mat(W3PAL.canopy)); stem.position.set(0.03,0.8,0); stem.rotation.z=0.5;   // drooping
    const bloom= mesh('sph',[0.05,6,5], mat(0x8a6f9e)); bloom.position.set(0.11,0.86,0);
    q.add(cupL, cupR, vase, stem, bloom);
    // a faint cobweb drape over the whole setting
    for(let i=0;i<4;i++){ const st2=mesh('cyl',[0.012,0.012,rand(0.6,1.0),4], mat(W3PAL.web)); st2.position.set(rand(-0.7,0.7),rand(0.5,1.1),rand(-0.3,0.3)); st2.rotation.z=rand(-1,1); st2.rotation.y=rand(TAU); q.add(st2); }
    q.position.set(152, 0, -2.6); q.rotation.y=0.4;
    S.add(bakeGroup(q)); }

  // the glide-down run-out to the gate (bat wings trace this line; the low road walks it)
  candyLine(G, [[136.5,11.4,0],[139,8.0,0],[142,3.5,0],[145,0.9,0]], 8);
  G.ents.add(new Widowmite(G, 143, 0, 0, {range:2.5, phase:0.4}));
  G.ents.add(new Webling(G, 146, 0, 0, {phase:0.3, period:5.0}));       // one last wall
  G.ents.add(new Widowmite(G, 149, 0, 0, {range:2.0, phase:1.0}));
  G.ents.add(new Spider(G, 151, 5, 0, {groundY:0}));
  candyLine(G, [[141,0.8,0],[144,0.8,0]], 3);
  candyLine(G, [[150,0.8,0],[154,0.8,0]], 4);

  exitGate(G, 156);

  // ================= BACKDROP / AMBIENCE / CLUTTER =================
  w3Parallax(S, -8, 160);                                         // three-depth Witchwood skyline + potion glow

  // baked accent deco — midground braided trees, tree-strung webs, mushrooms + potion bottles,
  // foreground silhouettes. Placed off the two void gaps for the near/ground pieces.
  { const deco = new THREE.Group();
    const treeXs = [-4, 8, 22, 34, 45, 70, 80, 92, 110, 124, 140, 154];
    for(const tx of treeXs){ deco.add(braidedTree(tx, rand(-7.5,-4.5), rand(0.9,1.5))); }
    // hanging webs strung between the trees (lifted into the forks)
    for(const [wx,wz,wy,ws] of [[10,-4.4,2.6,1.2],[33,-4.6,3.0,1.3],[70,-4.4,2.4,1.1],[92,-4.8,3.2,1.4],[125,-4.4,2.8,1.2]]){
      const w = hangingWeb(wx, wz, ws); w.position.y = wy; deco.add(w);
    }
    // ground jewels — mushroom clusters + potion bottles on the walkable stretches (never over a gap)
    for(const [mx,mz] of [[6,-2.7],[26,-3.0],[46,-2.8],[74,-2.9],[86,2.9],[112,-2.8],[128,3.0],[150,-2.8]]) deco.add(mushroomCluster(mx, mz, rand(0.8,1.2)));
    for(const [px,pz] of [[3,-2.4],[36,2.7],[68,-2.5],[108,2.8],[144,-2.5]]) deco.add(potionBottle(px, pz));
    // foreground silhouettes (z>0) for depth framing — a couple of dark braided trees
    for(const fx of [30, 88, 148]){ const ft = braidedTree(fx, rand(2.8,3.6), rand(0.9,1.3)); deco.add(ft); }
    S.add(bakeGroup(deco)); }
  // live will-o'-wisps for glow accents through the gallery (soft emissive glows, no PointLight)
  for(const [wx,wy] of [[15,2.2],[52,3.0],[85,2.4],[118,2.6],[138,3.2]]) S.add(willOWisp(wx, wy, -3.2));

  // bats + spore/mote/firefly ambience + checkpoint(=spawn); clutter done manually (split around the voids)
  w3LevelFinish(G, -8, 160, null);
  w3Clutter(G, -6, 40, 'forest');     // Act 1
  w3Clutter(G, 40, 58, 'forest');     // Act 2a (stops at gap A)
  w3Clutter(G, 66, 78, 'forest');     // Act 2b (resumes past gap A)
  w3Clutter(G, 78, 96, 'forest');     // Act 3a (stops at gap B)
  w3Clutter(G, 104, 120, 'forest');   // Act 3b (resumes past gap B)
  w3Clutter(G, 120, 158, 'forest');   // Act 4

  return {spawnX:0, exitX:156};
}

function updateW3L2(G, dt){
  updateLevelCommon(G, dt);
}

W3_LEVELS.push({id:'w3l2', district:'w3', name:'THE WEB GALLERY', build:buildW3L2, update:updateW3L2, parTime:155});

// ============ LEVEL 6-1 — LANTERN LANE (District 6 · FROSTMERE · Glimmerfields) ============
// The arrival road: from the ferry landing up into Glimmerfields, strung END TO END with winterfest light
// strings — the expansion's BEAUTY STATEMENT (owner seed: "good winter lights" — this is the most decorated
// level in the game: one unbroken chain of bulb-strings post to post to rooftop to maypole to the gate arch,
// glowing gift piles, bulb-wrapped pines, lamplit cottages). Signature gimmick: THE ICE PATCHES — the ponds
// froze over the ROAD this year, so short glassy runs (tag:'ice' — 06_player swaps friction) interrupt the
// snow. Introduce SAFELY -> twist -> escalate -> master (kishotenketsu), at D3 "fairly competitive" warmth
// since it's the district opener — 8 threats on three lanes, never empty, everything telegraphed:
//   BEAT 1 THE FERRY ROAD (INTRODUCE ice)      x -8..33  — CP0. A flat 5u ice patch on safe snow; the sign
//          warns about the frozen road. One decorative snowman TURNS ITS HEAD to watch Pip pass (the
//          foreshadow) — then the first REAL Spooky Snowman lands among a decoy cluster (the horror-comedy:
//          some snowmen are real; the decoys make the real ones land).
//   BEAT 2 THE VILLAGE GREEN (HIGH ROAD)        x 33..66  — a bulb-wrapped CLIMB POLE up to a rooftop run
//          over two cottages (snow-drifted eaves at y 3.2 / 4.2), a Gummy-Shield lantern its reward; the
//          route crowns at the MAYPOLE — the tallest light post on the lane — with GOLDEN PUMPKIN #0
//          floating above it (double-jump off the far eave). A 2nd snowman + a drifting Snow-Boo below.
//   BEAT 3 THE FROZEN RISE (TWIST)              x 66..85  — CP1 (lit). An ice patch ON A SLIGHT RISE: a snow
//          shelf with a glassy top — land sliding, manage the momentum, shoot off the far edge onto soft snow.
//   BEAT 4 THE POND CROSSING (ESCALATE)         x 85..108 — two ice-patch lanes with Frostbite Penguins
//          waddling them (squawk-telegraphed belly-slides); a Blizzard Bat works the snow breather between.
//   BEAT 5 THE LANE'S END (MASTER · finish)     x 108..183 — CP2, the Mystery Igloo in its clear pocket,
//          then THE LONG FREEZE: a 10u ice run into TWO friendly gaps (3.5u, SNOW on both sides — ice never
//          touches a pit lip in 6-1..6-3, owner law) with candy arcing the jumps; a farewell decoy cluster
//          hides the last real snowman on the run to the gate.
// Reads UNMISTAKABLY Glimmerfields: W6PAL moonlit snow + deep blue-violet night, warm bulb-strings overhead
// the WHOLE way, lamplit cottage skyline, aurora ribbons, snowfall. Three lanes busy throughout (ground
// snowmen/penguins · air Blizzard Bats + the Snow-Boo · the rooftop road). Comparable heights (tap 1.8 /
// held 2.6 / double 3.3; every rise slight-over-clearance — shelf 1.4, eave hop +1.0, GP rise 2.8; the one
// 3.2 rise is GATED by the climb pole with candy telegraphing the verb; gaps 3.5 <= 4 tap). NO Leap of Faith
// (the game's two are placed and sacred). Deterministic to the flake — fixed enemy phases, fixed clocks,
// seeded rand() only inside baked cosmetic deco. No Math.random on the critical path (the igloo's gamble is
// opt-in side content, where RNG legally lives).

// ---- THE WATCHER: a decorative snowman near the start whose head SLOWLY turns to follow Pip pass — the
// foreshadow moment, before the level teaches that some snowmen are real. Cosmetic only: never moves, never
// harms, eyes stay plain coal (no cyan tell — it isn't hunting, it's just... watching). Unbaked by design. ----
class W6L1Watcher {
  constructor(x, z){
    this.group = new THREE.Group(); this.dead=false; this.cull=true; this.isEnemy=false; this.t=0;
    this.x=x; this.z=z;
    const snow = mat(W6PAL.snow), snowD = mat(W6PAL.snowD);
    const b1 = mesh('sph',[0.5,10,9], snow);  b1.position.y=0.42; this.group.add(b1);
    const b2 = mesh('sph',[0.36,10,9], snowD); b2.position.y=1.0; this.group.add(b2);
    for(const s of [-1,1]){ const arm=mesh('cyl',[0.025,0.035,0.6,4], mat(0x4a3826)); arm.position.set(s*0.42,1.05,0); arm.rotation.z=s*1.25; this.group.add(arm); }
    const scarf = mesh('tor',[0.24,0.07,6,12], emat(0x3aa060,0x1e6038,0.25)); scarf.position.y=1.26; scarf.rotation.x=0.18; this.group.add(scarf);
    // the head is its own group so it can turn — carrot, coal eyes, and hat ride along
    this.headG = new THREE.Group();
    const skull = mesh('sph',[0.26,10,9], snow); this.headG.add(skull);
    for(const e of [-0.09,0.09]){ const c=mesh('sph',[0.03,4,4], mat(0x1a1a28)); c.position.set(e,0.07,0.22); this.headG.add(c); }
    const carrot = mesh('cone',[0.05,0.24,5], mat(0xe8833a)); carrot.rotation.x=Math.PI/2; carrot.position.set(0,0,0.3); this.headG.add(carrot);
    const brim = mesh('cyl',[0.2,0.2,0.04,10], mat(0x1e1a2c)); brim.position.y=0.2; this.headG.add(brim);
    const top = mesh('cyl',[0.13,0.14,0.2,10], mat(0x1e1a2c)); top.position.y=0.32; crook(top,0.08); this.headG.add(top);
    this.headG.position.y=1.46; this.group.add(this.headG);
    this.group.position.set(x,0,z);
  }
  update(dt, G){
    this.t+=dt;
    const pl=G.player; if(!pl) return;
    const dx=pl.pos.x-this.x, dz=pl.pos.z-this.z, d=Math.hypot(dx,dz);
    // SLOW is the whole trick — a turn you only catch from the corner of your eye (damp rate 0.6)
    const target = (d<15) ? Math.atan2(dx, dz) : 0;
    this.headG.rotation.y = damp(this.headG.rotation.y, target, 0.6, dt);
  }
}

// ---- a Glimmerfields COTTAGE (background deco, z<0): timber body, peaked snow-capped roof, warm windows,
// wreathed door, eave-bulb dots. The STANDABLE part is a separate snow-drifted eave platform at z=0 (the
// low road walks beneath it) — the cottage behind sells the read. Fully baked by the caller. ----
function w6l1Cottage(x, z, bw, bh){
  const g = new THREE.Group();
  const body = mesh('box',[bw,bh,2.4], mat(W6PAL.wood)); body.position.set(x,bh/2,z); g.add(body);
  for(const cx of [-1,1]){ const post=mesh('box',[0.24,bh,0.26], mat(W6PAL.woodD)); post.position.set(x+cx*(bw/2-0.14),bh/2,z+1.1); g.add(post); }
  const roof = mesh('cone',[bw*0.78,1.9,4], mat(W6PAL.woodD)); roof.position.set(x,bh+0.85,z); roof.rotation.y=Math.PI/4; g.add(roof);
  const cap  = mesh('cone',[bw*0.8,0.55,4], mat(W6PAL.pineSnow)); cap.position.set(x,bh+1.6,z); cap.rotation.y=Math.PI/4; g.add(cap);   // snow on the ridge
  const chim = mesh('box',[0.34,0.9,0.34], mat(W6PAL.woodD)); chim.position.set(x+bw*0.28,bh+1.35,z); g.add(chim);
  const chimSnow = mesh('box',[0.4,0.1,0.4], mat(W6PAL.pineSnow)); chimSnow.position.set(x+bw*0.28,bh+1.83,z); g.add(chimSnow);
  for(const wx of [-bw*0.24, bw*0.24]){ const win=mesh('box',[0.44,0.56,0.1], emat(W6PAL.window,W6PAL.window,0.9)); win.position.set(x+wx,bh*0.55,z+1.25); g.add(win); }
  const door = mesh('box',[0.55,1.0,0.1], mat(W6PAL.woodD)); door.position.set(x,0.5,z+1.25); g.add(door);
  const wreath = mesh('tor',[0.17,0.05,6,12], mat(W6PAL.pine)); wreath.position.set(x,0.95,z+1.32); g.add(wreath);
  const berry = mesh('sph',[0.04,4,4], emat(0xd83a4a,0x8a1e2c,0.6)); berry.position.set(x,0.8,z+1.34); g.add(berry);
  for(let bI=0;bI<5;bI++){ const cc=pick(W6PAL.bulbs); const bb=mesh('sph',[0.06,5,4], emat(cc,cc,0.95)); bb.position.set(x-bw*0.38+bI*bw*0.19, bh+0.12, z+1.28); g.add(bb); }   // eave dots
  return g;
}

// ---- ICICLE FRINGE for a snow eave/shelf lip — tiny glassy teeth hanging from the front edge (baked; pure
// cosmetic, no hazard — 6-1's icicles only decorate; the DROPPING kind waits for a later level). ----
function w6l1Fringe(x1, x2, y, z){
  const g = new THREE.Group();
  for(let x=x1+0.3; x<x2-0.2; x+=rand(0.5,0.85)){
    const ic = mesh('cone',[rand(0.04,0.07),rand(0.18,0.38),5], emat(W6PAL.ice,0x4a9ed0,0.4));
    ic.rotation.x=Math.PI; ic.position.set(x, y-rand(0.1,0.18), z); g.add(ic);
  }
  return g;
}

// ---- a GLOWING GIFT PILE: presents heaped on a warm pool of bulb-light (emissive fake — the real-light
// budget stays with the maypole + the igloo). The festival's generosity, scattered along the whole lane. ----
function w6l1GiftPile(x, z, s=1){
  const g = new THREE.Group();
  const pool = mesh('circ',[1.1*s,14], emat(0xffc87a,0xffb85e,0.5)); pool.rotation.x=-Math.PI/2; pool.position.set(x,0.04,z); g.add(pool);
  g.add(w6GiftBox(x-0.4*s, z-0.15*s, 0.95*s, 0xd83a4a));
  g.add(w6GiftBox(x+0.42*s, z+0.2*s, 0.8*s, 0x3aa060));
  g.add(w6GiftBox(x+0.05*s, z-0.4*s, 0.7*s, 0x4a7ae0));
  const topper = w6GiftBox(x-0.05*s, z, 0.55*s, 0xffd23f); topper.position.y=0.42*s; g.add(topper);
  const cane = mesh('cyl',[0.035,0.035,0.5*s,5], mat(0xf0f0f0)); cane.position.set(x+0.7*s,0.25*s,z); cane.rotation.z=-0.3; g.add(cane);
  const hook = mesh('tor',[0.09,0.035,4,8,Math.PI], mat(0xd83a4a)); hook.position.set(x+0.78*s,0.52*s,z); g.add(hook);
  return g;
}

// ---- a FESTIVE PINE: the kit pine wrapped in a spiral of bulbs (baked dots — the LIVE twinkle belongs to
// the strings overhead; the pines just glow steady, the way real yard-trees do behind real fairy lights). ----
function w6l1FestivePine(x, z, s=1){
  const g = w6Pine(x, z, s);
  for(let i=0;i<10;i++){
    const a=i*2.05, r=(1.2-i*0.095)*s, y=(0.85+i*0.245)*s;
    const cc=pick(W6PAL.bulbs);
    const bb=mesh('sph',[0.055*s+0.02,5,4], emat(cc,cc,0.95)); bb.position.set(x+Math.cos(a)*r, y, z+Math.sin(a)*r*0.6); g.add(bb);
  }
  return g;
}

function buildW6L1(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const SNOW = W6PAL.snowD;     // the moonlit road (groundX auto-lifts a bright lip — reads like fresh powder)
  const EAVE = W6PAL.pineSnow;  // snow-drifted rooftop eaves — the high road

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE FERRY ROAD (x -8..33): INTRODUCE ice + the snowman rule ===============================
  groundX(G, -8, 16, SNOW);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "WELCOME TO GLIMMERFIELDS! Mind your boots - the ponds froze over the ROAD this year. Glassy ground slides underfoot, so take little hops, not big strides. Follow the lights: they're strung all the way to the festival!");
  candyLine(G, [[4,0.9,0],[8,0.9,0],[12,0.9,0]], 3);
  // THE FORESHADOW — a "decorative" snowman by the fence line whose head slowly turns to watch Pip pass
  G.ents.add(new W6L1Watcher(11, -2.1));
  // ICE PATCH #1 (INTRODUCE, x 16..21): flat, safe, 5u — feel the slide with nothing at stake
  w6IceX(G, 16, 21);
  candyLine(G, [[16.8,0.9,0],[20.2,0.9,0]], 3);                        // the glide line — coast through it
  groundX(G, 21, 88, SNOW);                                            // one long snow slab under beats 1-3
  G.ents.add(new Crow(23, 0.95, 2.2));                                 // reactive winter crow — flaps off when neared
  // THE DECOY CLUSTER + SPOOKY SNOWMAN #1: three snowmen by the road... one of them is REAL (moves only when
  // you're NOT looking — eyes flare cyan mid-hop, the tell you can trust). Decoys sit OFF the lane (z<0) so
  // only the real one can ever touch you — observation is the counter-skill, never a cheap hit.
  deco.add(w6SnowmanDeco(24.5, -1.6, 0.95, 0.3));
  deco.add(w6SnowmanDeco(29, -1.3, 0.9, -0.4));
  G.ents.add(new SpookySnowman(G, 27, 0, 0, {phase:0.0, watchR:11, aggroR:7.5}));
  candyLine(G, [[24,0.9,0],[27,0.9,0],[30,0.9,0]], 3);                 // candy through the cluster — collect while WATCHING

  // =============================== BEAT 2 — THE VILLAGE GREEN (x 33..66): the HIGH ROAD + GP #0 ===============================
  signPost(G, 33, 1.8, 0.1, "LANTERN LANE. Somebody strung every post, eave and pine from here to the square. Climb the bright pole for the rooftop view! And if you were thinking of counting the snowmen... don't. They don't like being counted.");
  // the CLIMB POLE — a bulb-wrapped pole (the gated way up: eave 1's 3.2 rise exceeds the 3.0 double-jump
  // ceiling, so the verb is CLIMB, telegraphed by candy straight up the pole per the comparable-heights law)
  { const pole = mesh('cyl',[0.09,0.12,3.6,6], mat(W6PAL.woodD)); pole.position.set(37,1.8,0); S.add(pole);
    const knob = mesh('sph',[0.14,6,5], mat(0xbfd0ec)); knob.position.set(37,3.66,0); S.add(knob);
    const poleDeco = new THREE.Group();
    for(let i=0;i<9;i++){ const a=i*1.7, cc=pick(W6PAL.bulbs);
      const bb=mesh('sph',[0.06,5,4], emat(cc,cc,0.95)); bb.position.set(37+Math.cos(a)*0.16, 0.4+i*0.36, Math.sin(a)*0.16); poleDeco.add(bb); }
    deco.add(poleDeco); }
  G.world.addBox(37, 0, 0, 1.1, 3.4, 1.2, {type:'climb'});
  candyLine(G, [[37,1.7,0],[37,2.7,0],[37,3.6,0]], 3);                 // straight up — the climb telegraph
  // the two cottages (background, z -4) + their snow-drifted EAVE platforms over the lane (the rooftop run;
  // undersides at 2.7/3.7 — the low road walks beneath, seeing the high-road candy overhead at the junction)
  deco.add(w6l1Cottage(42, -4, 4.4, 2.6));
  deco.add(w6l1Cottage(50.5, -4, 4.2, 3.4));
  platform(G, 42, 3.2, 0, 6, 2.6, EAVE);                               // EAVE 1 (spans 39..45) — boosted hop off the pole top
  platform(G, 50.5, 4.2, 0, 6, 2.6, EAVE);                             // EAVE 2 (spans 47.5..53.5; gap 2.5, rise 1.0 — held, over-clearance)
  deco.add(w6l1Fringe(39, 45, 2.95, 1.25));                            // icicle teeth under both lips (cosmetic)
  deco.add(w6l1Fringe(47.5, 53.5, 3.95, 1.25));
  candyLine(G, [[40.5,3.9,0],[44,3.9,0]], 3);                          // eave 1 run
  candyLine(G, [[45.7,4.3,0],[47.3,4.9,0]], 2);                        // the hop across (traces the arc)
  candyLine(G, [[49.5,4.9,0],[52.5,4.9,0]], 2);                        // eave 2 run
  G.ents.add(new BonkLantern(G, 50.5, 5.4, 0, 'shield'));              // high-road reward — a Gummy Shield
  // THE MAYPOLE — the tallest light post on the lane (every string in the village chains through its crown),
  // with GOLDEN PUMPKIN #0 floating above it: visible-but-tricky (glows over the low road all beat, but only
  // the high road reaches — double-jump off eave 2, rise 2.8, candy-traced)
  { const mp = mesh('cyl',[0.1,0.15,6.0,7], mat(W6PAL.woodD)); mp.position.set(56.5,3.0,-0.6); S.add(mp);
    const mpDeco = new THREE.Group();
    for(let i=0;i<12;i++){ const a=i*1.9, cc=pick(W6PAL.bulbs);
      const bb=mesh('sph',[0.065,5,4], emat(cc,cc,0.95)); bb.position.set(56.5+Math.cos(a)*0.2, 0.5+i*0.46, -0.6+Math.sin(a)*0.2); mpDeco.add(bb); }
    deco.add(mpDeco);
    const star = mesh('sph',[0.22,8,7], emat(0xffd23f,0xffd23f,1)); star.position.set(56.5,6.3,-0.6); S.add(star);
    const halo = new THREE.Mesh(geo('sph',0.55,8,7), new THREE.MeshBasicMaterial({color:0xffd23f, transparent:true, opacity:0.16, depthWrite:false}));
    halo.position.set(56.5,6.3,-0.6); S.add(halo);
    // the level's ONE added real light — the maypole's warm pool on the lane (igloo carries its own; budget kept)
    const glow = new THREE.PointLight(0xffc87a, 45, 13); glow.position.set(56.5, 5.4, 0.6); S.add(glow); }
  G.ents.add(new GoldPumpkin(56.5, 7.0, 0, 0));                        // GOLDEN PUMPKIN #0 — over safe snow (a miss just drops to the green)
  candyLine(G, [[54.3,5.3,0],[55.4,6.2,0],[56.5,7.0,0]], 3);           // ...and the double-jump trace up into it
  // the LOW ROAD stays busy below: SPOOKY SNOWMAN #2 among cottage-yard decoys, the SNOW-BOO drifting in
  // (a converging chaser like w5l1's Shadow Copies — it resolves HERE in beat 2, 55+u clear of the igloo's
  // pocket; stare it and it freezes into a STANDABLE ice block, the rule the district builds on)
  deco.add(w6SnowmanDeco(44.5, -1.5, 0.85, 0.5));
  deco.add(w6SnowmanDeco(49.5, -1.7, 0.95, -0.3));
  G.ents.add(new SpookySnowman(G, 47, 0, 0, {phase:0.35, watchR:11, aggroR:7.5}));
  G.ents.add(new SnowBoo(G, 62, 0, 0, {phase:0.4, speed:2.0, range:10}));
  candyLine(G, [[36,0.9,0],[40,0.9,0]], 2);
  candyLine(G, [[48,0.9,0],[53,0.9,0]], 2);
  // BLIZZARD BAT #1 — the air lane past the maypole (squeak-telegraphed snapshot dive, the learned rule in
  // frost-white; base reach 60.5..65.5 — 4u clear of the GP jump, 54+u clear of the igloo per CLEAR-PATCH +
  // the divers-drift-toward-the-player rule)
  G.ents.add(new BlizzardBat(G, 63, 5.4, 0, {phase:0.2, range:2.5, period:3.4, aggroR:4.5}));

  // =============================== BEAT 3 — THE FROZEN RISE (x 66..85): TWIST — ice on a slight rise ===============================
  G.ents.add(new Checkpoint(70, 0, 1.6, 1));                           // CP1 — LIT, the first of the two mid lanterns (>100u rule)
  // a snow shelf with a GLASSY TOP (rise 1.4 — tap clears it with margin): jump on carrying speed, slide the
  // 8u run, shoot off the far edge onto soft snow. Momentum management with zero stakes — the twist teaches
  // what the master beat will demand.
  w6IcePlat(G, 77, 1.4, 0, 8, 6);                                      // the icy shelf top (spans 73..81)
  { const fill = mesh('box',[8,0.95,5.7], mat(SNOW)); fill.position.set(77,0.45,0); deco.add(fill);   // the drift it sits on
    deco.add(w6l1Fringe(73, 81, 1.15, 3.0)); }                         // icicle teeth on the lip
  candyLine(G, [[70,0.9,0],[72.4,1.6,0]], 2);                          // the run-up arc onto it
  candyLine(G, [[74.5,2.2,0],[77,2.2,0],[79.5,2.2,0]], 3);             // the slide line across the glass
  candyLine(G, [[81.4,1.8,0],[82.6,1.2,0]], 2);                        // the shoot-off arc back to snow

  // =============================== BEAT 4 — THE POND CROSSING (x 85..108): ESCALATE — penguin lanes ===============================
  signPost(G, 85, 1.8, -0.1, "POND CROSSING. The penguins found the ice first, and they do NOT share. When one squawks with both flippers up - that's your half-second to hop. Catch your breath on the snow between ponds.");
  // ICE PATCH #2 (x 88..96) with FROSTBITE PENGUIN #1 waddling it — squawk (~0.5s, flippers up) then a flat
  // fast belly-slide; you dodge ON the ice (the twist's momentum lesson, now under pressure)
  w6IceX(G, 88, 96);
  G.ents.add(new FrostbitePenguin(G, 92, 0, 0, {phase:0.0, range:2.4, dir:1, wakeR:5}));
  candyLine(G, [[88.6,0.9,0],[95.4,0.9,0]], 4);
  // the snow BREATHER (x 96..100) — where BLIZZARD BAT #2 dives (dodging happens on TRACTION, kind for 6-1;
  // base reach 96..100 — 20u clear of the igloo, honoring CLEAR-PATCH + the diver-drift rule)
  groundX(G, 96, 100, SNOW);
  G.ents.add(new BlizzardBat(G, 98, 5.0, 0, {phase:1.6, range:2, period:3.2, aggroR:4.5}));
  // ICE PATCH #3 (x 100..106) with PENGUIN #2 — tighter lane, opposite phase; its longest slide (trigger at
  // the lane's right lip + 9u of belly) tops out ~112.5, a clear 7.5u short of the igloo's pocket
  w6IceX(G, 100, 106);
  G.ents.add(new FrostbitePenguin(G, 102.6, 0, 0, {phase:0.7, range:1.6, dir:-1, wakeR:5}));
  candyLine(G, [[100.6,0.9,0],[105.4,0.9,0]], 3);
  groundX(G, 106, 140, SNOW);                                          // the long snow shoulder into the master beat
  G.ents.add(new Crow(109, 0.95, -2.2));                               // reactive critter #2

  // =============================== BEAT 5 — THE LANE'S END (x 108..183): MASTER + igloo + finish ===============================
  candyLine(G, [[110,0.9,0],[115,0.9,0]], 3);
  // THE MYSTERY IGLOO — Frostmere's gamble, in a CLEAR POCKET per the law: nearest patrol/dive reach is the
  // penguin's ~112.5 slide-max (7.5u), bat #2 tops out at 100 (20u), snowman #3 homes at 169.5 (49u) — the
  // peek is a deliberate safe act; the ambush penguins spawn on the kit's fixed ring with 1s grace
  { const ig = new MysteryIgloo(120, 0, 0.3, -0.25); G.coffins.push(ig); G.ents.add(ig); }
  candyLine(G, [[125,0.9,0],[130,0.9,0]], 2);
  // ---- THE QUIET PROP (never signposted): a snow family just off the road — two big snowmen leaning close,
  // and between them a tiny lopsided third, built by small mittened hands... the mittens themselves left
  // behind in the snow beside it, forgotten in the hurry to show somebody. Story-readers gasp; everyone
  // else walks past three snowmen. ----
  deco.add(w6SnowmanDeco(127.4, -2.4, 1.0, 0.55));
  deco.add(w6SnowmanDeco(129.4, -2.4, 0.82, -0.6));
  deco.add(w6SnowmanDeco(128.5, -2.0, 0.34, 0.1));
  { for(const mx of [129.0, 129.25]){ const mit=mesh('sph',[0.07,6,5], mat(0xd83a4a)); mit.scale.y=0.6; mit.position.set(mx,0.05,-1.85); deco.add(mit); } }
  signPost(G, 133, 1.7, 0.12, "THE LONG FREEZE. One glassy run, then the road's cracked clean through - twice. Snow holds firm on either side, so slide, set your feet, and jump where the candy flies.");
  G.ents.add(new Checkpoint(136, 0, 1.6, 2));                          // CP2 — LIT, right before the master gauntlet
  // THE MASTER RUN: ICE PATCH #4 (x 140..150, the level's longest) — then 4.5u of snow to plant your feet
  // (ice NEVER touches a pit lip in 6-1..6-3, owner law) before two friendly 3.5u gaps with candy arcing the
  // jumps. A miss costs a heart + the walk from CP2, never a life with hearts in hand.
  w6IceX(G, 140, 150);
  candyLine(G, [[140.8,0.9,0],[149.2,0.9,0]], 4);                      // the long glide line
  groundX(G, 150, 154.5, SNOW);                                        // the plant-your-feet lip
  // GAP #1 (154.5..158, 3.5u — comfortable tap, snow both sides)
  groundX(G, 158, 163, SNOW);                                          // the mid island (its light post rides here)
  // GAP #2 (163..166.5, 3.5u)
  groundX(G, 166.5, 183, SNOW);
  candyLine(G, [[153.6,1.0,0],[155.4,2.0,0],[157.1,2.0,0],[158.9,1.0,0]], 4);   // arc over gap 1 — jump where the candy flies
  candyLine(G, [[162.1,1.0,0],[163.9,2.0,0],[165.6,2.0,0],[167.4,1.0,0]], 4);   // arc over gap 2 (arcs 1's landing + 2's takeoff keep the island fed)
  // THE FAREWELL CLUSTER + SPOOKY SNOWMAN #3: land from gap 2 into a little crowd of snowmen seeing you off
  // to the gate... one is real. Watch it while you back toward the arch — the level's rule, mastered.
  deco.add(w6SnowmanDeco(167.6, -1.3, 0.9, 0.4));
  deco.add(w6SnowmanDeco(171.5, -1.6, 0.95, -0.2));
  deco.add(w6SnowmanDeco(173.8, -1.1, 0.8, 0.6));
  G.ents.add(new SpookySnowman(G, 169.5, 0, 0, {phase:0.7, watchR:11, aggroR:7.5}));
  candyLine(G, [[170.5,0.9,0],[173.5,0.9,0]], 2);
  exitGate(G, 177);

  // =============================== THE WINTERFEST LIGHT STRINGS — end to end (the beauty statement) ===============================
  // one unbroken chain of bulb-strings from the ferry landing to the gate arch: post to post, up the cottage
  // rooflines to the maypole's crown, back down the lane, ACROSS both gaps, and converging on the exit gate.
  // The kit merges every bulb into 5 twinkling draw calls; posts bake with the deco.
  { const L = w6LightsBegin();
    const tops = [[-6,3.3],[6,3.5],[20,3.3],[33,3.5],[42,4.6],[50.5,5.6],[56.5,6.3],[70,3.5],[84,3.3],[98,3.5],[112,3.3],[126,3.5],[138,3.3],[152,3.5],[160.5,3.3],[170,3.5],[176.6,5.0]];
    for(let i=0;i<tops.length-1;i++) w6String(L, tops[i][0],tops[i][1], tops[i+1][0],tops[i+1][1]);
    w6String(L, 56.5,6.3, 48,4.0, {z:-1.2});                           // the maypole's crown radiates
    w6String(L, 56.5,6.3, 64,3.6, {z:-1.2});
    w6String(L, 116,3.3, 122,3.3, {z:-2.6, sag:0.7});                  // a double-strand over the igloo pocket
    w6LightsFinish(G, L);
    // the posts under the chain (the roofline anchors at 42/50.5/56.5/176.6 are the cottages/maypole/gate)
    for(const [px,py] of tops){ if(px===42||px===50.5||px===56.5||px===176.6) continue; deco.add(w6LightPost(px, -1.8, py-0.2)); } }

  // =============================== DECO · PINES · GIFTS · MOON · PARALLAX ===============================
  // bulb-wrapped pines and glowing gift piles the whole way down the lane (background z<0)
  deco.add(w6l1FestivePine(-4, -2.6, 1.1)); deco.add(w6l1FestivePine(9, -3.0, 1.25));
  deco.add(w6l1FestivePine(31, -2.7, 1.0)); deco.add(w6l1FestivePine(60, -3.1, 1.3));
  deco.add(w6l1FestivePine(74, -3.4, 1.1)); deco.add(w6l1FestivePine(103, -2.8, 1.2));
  deco.add(w6l1FestivePine(124, -3.0, 1.05)); deco.add(w6l1FestivePine(143, -2.9, 1.2));
  deco.add(w6l1FestivePine(159.5, -2.6, 0.9)); deco.add(w6l1FestivePine(181, -2.7, 1.15));
  deco.add(w6Pine(17, -3.3, 0.9)); deco.add(w6Pine(46, -3.4, 0.85)); deco.add(w6Pine(95, -3.2, 1.0)); deco.add(w6Pine(136, -3.3, 0.9));
  deco.add(w6l1GiftPile(34, -2.3, 1)); deco.add(w6l1GiftPile(68, -2.5, 0.9));
  deco.add(w6l1GiftPile(131.5, -2.2, 1)); deco.add(w6l1GiftPile(175.5, -2.3, 0.9));
  // FOREGROUND silhouettes (z>0) framing depth — pines, a small snowman, a gift pile up front
  deco.add(w6l1FestivePine(14, 2.6, 0.9)); deco.add(w6Pine(91, 2.8, 1.05)); deco.add(w6Pine(148, 2.7, 0.95));
  deco.add(w6SnowmanDeco(65, 2.5, 0.5, 2.6));
  deco.add(w6l1GiftPile(118, 2.3, 0.85));
  deco.add(w6l1FestivePine(172, 2.6, 0.8));
  S.add(bakeGroup(deco));

  // a big cold winter moon over the village
  const moon = mesh('circ',[4.2,28], emat(0xe6ecff,0xd6e0f8,0.85)); moon.position.set(70,15.5,-30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.8,28), new THREE.MeshBasicMaterial({color:0xaec4ee, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(70,15.5,-30.2); S.add(moonH);

  // three-depth Glimmerfields skyline (snowdrifts & birches / lamplit village + snow pines / great blue peaks)
  w6Parallax(S, -8, 183);

  // themed crevasse dressing under the two gaps only (visual — the fall is the hazard; a heart + CP2 walk-back)
  pitDressing(G, 154.5, 158, 'winter');
  pitDressing(G, 163, 166.5, 'winter');

  // exit + the winter tail (fog/sky retint, aurora, snowfall, bulb twinkle). Clutter placed manually on the
  // SNOW spans only — never on the ice patches (powder on glare ice reads wrong), never in the gaps, split
  // around the frozen-rise shelf so no baked prop pokes through its top (the w1l2 lesson, learned)
  w6LevelFinish(G, -8, 183, null);
  w6Clutter(G, -8, 16, 'winter');
  w6Clutter(G, 21, 72.5, 'winter');
  w6Clutter(G, 81.5, 88, 'winter');
  w6Clutter(G, 106, 140, 'winter');
  w6Clutter(G, 150, 154, 'winter');
  w6Clutter(G, 158.5, 162.5, 'winter');
  w6Clutter(G, 167, 183, 'winter');

  return {spawnX: 0, exitX: 177};
}

function updateW6L1(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the Watcher registers its own G.ents ticker, the kit's bulb-twinkle and
  // aurora tickers were installed by w6LightsFinish/w6LevelFinish, and every enemy runs a fixed-phase clock.
}

W6_LEVELS.push({id:'w6l1', district:'w6', name:'LANTERN LANE', build:buildW6L1, update:updateW6L1, parTime:155});

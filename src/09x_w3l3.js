// ============ W3-3 — THE CAULDRON CLEARING (Witchwood) ============
// District 3's potion showcase, ~4 min. Sorts after 09u_w3kit (u<x) so the D3 kit is ready:
// W3PAL, W3_LEVELS, MysteryCauldron, CauldronDip, w3Parallax/w3LevelFinish/w3Clutter, braidedTree,
// witchHut, cauldronDeco, willOWisp, potionBottle, mushroomCluster + the roster (Webling/Widowmite)
// from 07w and Spider from 07_enemies.
//
// SIGNATURE GIMMICK: CAULDRON DIPS (repeatable brew-buff vessels) + POTION-LOB HAZARDS.
// Full kishotenketsu arc:
//   INTRODUCE (x -8..44)  — a hero CauldronDip teaches the vessel in a clear patch; glowing potion
//                           platforms teach the standable brew-slabs; first light spiders.
//   TWIST (x 44..96)      — spend the brew: a WINGS dip before a goo-strip potion-platform span, a
//                           SHIELD dip before a drop-spider gauntlet; the Webling weaves its web-walls.
//   ESCALATE (x 96..130)  — THE BOILING CROSSING: the FIRST potion-lob (gentle, 2 marks, wide lanes)
//                           teaches the read, the Mystery Cauldron tempts, then a true void spanned by
//                           a moving potion ferry.
//   MASTER (x 130..196)   — THE CAULDRON GAUNTLET: the D3 BOMBARDMENT — witch-pots lob arcing goo on a
//                           FIXED clock, telegraphed 0.7s, bursting into brief goo puddles, safe lanes
//                           that WALK FORWARD, while 3-4 ground threats keep you moving. Then the gate.
// Structured chaos, not clutter: singles + telegraphed set-pieces over ~200 units, every volley/dip/
// mover on a fixed clock from level start (determinism). The whole course runs on solid ground at y>=0
// (goo strips are hazard STRIPS over the floor — fall in = 1 heart + i-frames, climb back out; one true
// void, crossed by the ferry), so camMinY stays 0. GoldPumpkins live in 3-1/3-2/3-5 — NONE here.

// --- the D3 potion-lob emitter (self-contained ents entity; cull:false; deterministic fixed clock) ---
// marks: [[fireTime, x], ...] within one PERIOD. A violet TELEGRAPH ring grows on the ground ~TEL ahead,
// then a goo-potion bottle ARCS in from an overhead spitter over FLIGHT, bursts on the mark, and leaves a
// sickly-green goo PUDDLE that stays hazardous for PUDDLE seconds (i-frames keep repeats fair; knockback
// always points away). A presentation gate (near) mutes fx/sfx off-camera — the clock itself never stops.
function makePotionLob(G, opts){
  const S = G.scene;
  const VOLLEY = opts.marks, PERIOD = opts.period;
  const TEL = opts.tel||0.7, FLIGHT = opts.flight||0.65, PUDDLE = opts.puddle||1.0;
  const CEN = opts.cen, srcDX = opts.srcDX!==undefined?opts.srcDX:2.6, srcY = opts.srcY||6.6, presR = opts.presR||27;
  const lob = { group:new THREE.Group(), dead:false, cull:false, t:opts.phase||0, slots:[] };
  for(const [vt, vx] of VOLLEY){
    const ring = new THREE.Mesh(geo('circ',1.3,22), new THREE.MeshBasicMaterial({color:0xb06bff, transparent:true, opacity:0, side:THREE.DoubleSide}));
    ring.rotation.x = -Math.PI/2; ring.position.set(vx, 0.06, 0); ring.visible = false;
    // the lobbed goo-potion bottle (violet witch-brew — reads as incoming magic)
    const bg = new THREE.Group();
    const body = mesh('sph',[0.22,8,7], emat(W3PAL.brewV, W3PAL.brewV, 0.85)); body.scale.set(1,1.2,1);
    const neck = mesh('cyl',[0.06,0.09,0.14,6], emat(W3PAL.brewV, W3PAL.brewV, 0.5)); neck.position.y = 0.24;
    bg.add(body, neck); bg.visible = false;
    // the lingering goo puddle (sickly green — distinct from the violet incoming ring)
    const pud = new THREE.Mesh(geo('circ',1.15,20), new THREE.MeshBasicMaterial({color:0x9dff6e, transparent:true, opacity:0, side:THREE.DoubleSide}));
    pud.rotation.x = -Math.PI/2; pud.position.set(vx, 0.05, 0); pud.visible = false;
    lob.group.add(ring, bg, pud);
    lob.slots.push({ vt, vx, ring, bg, pud, srcX:vx-srcDX, whistled:false });
  }
  S.add(lob.group);
  const modw = (a)=>((a%PERIOD)+PERIOD)%PERIOD;   // phase distance since an event, wrapping cleanly
  lob.update = function(dt){
    const prev = this.t%PERIOD; this.t += dt; const ph = this.t%PERIOD;
    const pl = G.player;
    const near = pl && Math.abs(pl.pos.x - CEN) < presR;
    for(const s of this.slots){
      // TELEGRAPH — the violet mark grows on the ground
      const te = modw(ph - (s.vt - TEL));
      if(te < TEL){
        const u = te/TEL; s.ring.visible = true;
        s.ring.material.opacity = 0.18 + 0.5*u + Math.sin(this.t*20)*0.06;
        s.ring.scale.setScalar(0.5 + 0.6*u);
      } else s.ring.visible = false;
      // THE ARC — bottle tossed from the overhead spitter down onto the mark
      const lf = modw(ph - (s.vt - FLIGHT));
      if(lf < FLIGHT){
        const u = lf/FLIGHT; s.bg.visible = true;
        s.bg.position.set(lerp(s.srcX, s.vx, u), lerp(srcY, 0.4, u) + 1.7*Math.sin(u*Math.PI), 0);
        s.bg.rotation.z = this.t*6;
        if(!s.whistled && near){ s.whistled = true; AUDIO && AUDIO.tone && AUDIO.tone({f:520,f2:200,type:'sawtooth',t:0.18,vol:0.1}); }
      } else { s.bg.visible = false; if(modw(ph - s.vt) > FLIGHT) s.whistled = false; }
      // IMPACT — burst + shake at the crossing of vt (skip the once-per-period wrap frame)
      if(prev < ph && prev < s.vt && ph >= s.vt && near){
        const ip = new THREE.Vector3(s.vx, 0.3, 0);
        G.fx.spawn(ip, 0x9dff6e, 12, {speed:4, life:0.4});
        G.fx.spawn(ip, W3PAL.brewV, 8, {speed:3, life:0.5});
        AUDIO && AUDIO.noise && AUDIO.noise({t:0.2, vol:0.15, fFrom:700, fTo:110});
        G.camc.shake(0.1, 0.14);
      }
      // LINGERING GOO PUDDLE — visual fade + a persistent hazard (pd runs 0..PUDDLE from the impact)
      const pd = modw(ph - s.vt);
      if(pd < PUDDLE){
        const u = pd/PUDDLE; s.pud.visible = true;
        s.pud.material.opacity = 0.55*(1 - u*0.7);
        s.pud.scale.setScalar(0.85 + u*0.45);
        if(pl && !pl.dead && Math.abs(pl.pos.x - s.vx) < 1.25 && Math.abs(pl.pos.z) < 1.7 && pl.pos.y < 1.25){
          pl.damage(1, new THREE.Vector3(s.vx - (pl.pos.x >= s.vx ? 0.6 : -0.6), 0, 0));   // knockback away
        }
      } else s.pud.visible = false;
    }
  };
  return lob;
}

function buildW3L3(G){
  const S = G.scene;
  levelBegin(G);

  // parallax forest backdrop across the whole course
  w3Parallax(S, -12, 204);

  // baked deco collectors (statics → one draw call each); PDECO = potion-platform emissive trim
  const DECO = new THREE.Group();
  const PDECO = new THREE.Group();

  // a GLOWING POTION PLATFORM: a violet brew-slab with an emissive lip + an underside potion drip
  const potionPlat = (x, y, z, w=2.4)=>{
    platform(G, x, y, z, w, 3, W3PAL.cauldronR);
    const lip = mesh('box',[w,0.12,3.05], emat(W3PAL.brew, W3PAL.brew, 0.7)); lip.position.set(x, y+0.03, z); PDECO.add(lip);
    const drip = mesh('sph',[0.16,6,5], emat(W3PAL.brewV, W3PAL.brewV, 0.7)); drip.position.set(x, y-0.35, z); drip.scale.y = 1.6; PDECO.add(drip);
  };
  // a GOO HAZARD STRIP over the solid floor (undergroundRiver model: fall in = 1 heart + i-frames)
  const gooStrip = (x1, x2)=>{
    const w = Math.abs(x2-x1), cx = (x1+x2)/2;
    const bed  = mesh('box',[w,0.4,4.6], mat(0x17261d)); bed.position.set(cx,-0.1,0);
    const surf = mesh('box',[w,0.12,4.2], emat(0x3aa06a,0x2f7a50,0.5)); surf.position.set(cx,0.05,0);
    S.add(bed, surf);
    G.world.addBox(cx, -0.05, 0, w, 0.4, 4.2, {type:'hazard', damage:1});
  };

  // ================= grounds (solid y=0; goo strips ride on top; one true void for the ferry) =================
  groundX(G, -8, 116, W3PAL.ground);      // beats 1-3
  // VOID 116..124 — the ferry chasm (the level's one true pit)
  groundX(G, 124, 202, W3PAL.ground);     // the crossing landing → the gauntlet → the gate

  // ================= BEAT 1: THE BREWING CLEARING (x -8..44) — INTRODUCE the dip + potion platforms =================
  signPost(G, 2.5, 1.6, 0.12, 'THE CAULDRON CLEARING. Dip into a bubbling cauldron for a lucky brew... and mind the pots that spit. This is a witch\'s kitchen.');
  // hero CauldronDip — the teaching vessel, in a clear pocket (nearest patrol is the widowmites at x22, >12u)
  G.ents.add(new CauldronDip(9, 0, 0, {light:true}));   // default cycle shield→moon→bat→salt; a real light marks the hero pot
  DECO.add(cauldronDeco(9, -3.3, 1.15));
  DECO.add(braidedTree(-4, -4.2, 1.1)); DECO.add(braidedTree(14, -4.6, 0.9)); DECO.add(braidedTree(33, -4.0, 1.05));
  DECO.add(mushroomCluster(4, 2.7, 1.0)); DECO.add(mushroomCluster(27, -2.6, 1.1));
  S.add(willOWisp(6, 2.1, -1.4)); S.add(willOWisp(20, 2.6, -1.8));   // live wisp accents (kept unbaked for translucency)
  candyLine(G, [[3,0.9,0],[6,0.9,0],[9,1.1,0]], 4);
  // glowing potion platforms — the high candy line (teaches the standable brew-slabs)
  potionPlat(15, 1.5, 0); potionPlat(19.5, 2.0, 0);
  candyLine(G, [[13,1.0,0],[15,1.9,0],[17,2.1,0]], 3);
  candyLine(G, [[19.5,2.4,0],[21.5,2.0,0],[23.5,1.2,0]], 3);
  G.ents.add(new Heart(19.5, 2.7, 0));
  // first light spiders — a Widowmite swarm (easy stomps), then a drop-Spider
  G.ents.add(new Widowmite(G, 22, 0, 0, {range:2.4, dir:1,  phase:0.0}));
  G.ents.add(new Widowmite(G, 25, 0, 0, {range:2.4, dir:-1, phase:0.7}));
  candyLine(G, [[27,0.9,0],[30,0.9,0]], 3);
  G.ents.add(new Spider(G, 32, 5, 0, {groundY:0}));
  candyLine(G, [[34,0.9,0],[37,0.9,0]], 3);
  // THE QUIET PROP (never signposted): Granny Wick's abandoned knitting nook — a cold cauldron, a stump
  // stool, a half-knit red scarf still on the needles, a ball of yarn rolled off into the moss. Someone
  // was waiting here for a friend who never came. Story-readers pause; everyone else walks past.
  {
    const t = new THREE.Group();
    const cold  = mesh('sph',[0.5,10,8], mat(W3PAL.cauldron)); cold.position.set(38,0.5,-3.6); cold.scale.set(1,0.9,1);
    const stump = mesh('cyl',[0.42,0.5,0.5,9], mat(W3PAL.barkD)); stump.position.set(39.2,0.25,-3.4);
    const scarf = mesh('box',[0.5,0.08,0.34], mat(0xcf5a6a)); scarf.position.set(39.2,0.54,-3.4); crook(scarf,0.1);
    const nd1 = mesh('cyl',[0.02,0.02,0.42,4], mat(PAL.bone)); nd1.rotation.z=0.5;  nd1.position.set(39.35,0.62,-3.4);
    const nd2 = mesh('cyl',[0.02,0.02,0.42,4], mat(PAL.bone)); nd2.rotation.z=-0.4; nd2.position.set(39.05,0.6,-3.4);
    const yarn = mesh('sph',[0.16,8,7], mat(0xcf5a6a)); yarn.position.set(40.2,0.16,-3.0);
    t.add(cold, stump, scarf, nd1, nd2, yarn); DECO.add(t);
  }
  G.ents.add(new Checkpoint(40, 0, 1.3, 0, {noLight:true}));   // CP1 — clear of the spider

  // ================= BEAT 2: BREW-POWERED (x 44..96) — TWIST: spend the brew =================
  signPost(G, 46, 1.5, -0.1, 'A witch\'s brew is for spending. Dip, then leap — the wings won\'t wait.');
  DECO.add(witchHut(46, -4.4, 1.0));
  // WINGS dip in a clear pocket right before the goo span (dip → flutter/glide the whole crossing)
  G.ents.add(new CauldronDip(49, 0, 0, {cycle:['bat']}));
  DECO.add(cauldronDeco(49, 2.7, 0.9));
  // THE GOO SPAN — a hazard strip crossed by glowing potion platforms (comfortable ~3u tap gaps; wings glide it)
  gooStrip(53, 76);
  potionPlat(56, 1.6, 0); potionPlat(61.5, 1.9, 0); potionPlat(67, 1.6, 0); potionPlat(72.5, 1.9, 0);
  candyLine(G, [[54,1.4,0],[56,2.1,0],[58,2.3,0]], 3);
  candyLine(G, [[61.5,2.4,0],[64,2.6,0],[67,2.1,0]], 4);
  candyLine(G, [[67,2.1,0],[70,2.6,0],[72.5,2.4,0]], 3);
  S.add(willOWisp(64, 3.2, -1.5));
  // the Webling plants past the span — weaves a breakable web-wall across the lane on a fixed clock
  G.ents.add(new Webling(G, 78, 0, 0, {phase:0.0, period:6, firstWeb:2.4, webLife:3.6, wallH:3.0}));
  candyLine(G, [[80,0.9,0],[82.5,0.9,0]], 3);
  // SHIELD dip in a clear pocket before the drop-spider gauntlet (nearest patrol: spiders at x90, >5u; Webling x78, ~6u)
  G.ents.add(new CauldronDip(84, 0, 0, {cycle:['shield']}));
  DECO.add(mushroomCluster(84, 2.6, 1.0));
  G.ents.add(new Heart(87, 1.0, 0));
  G.ents.add(new Checkpoint(86, 0, 1.3, 1, {noLight:true}));   // CP2 — before the spider gauntlet
  // THE DROP-SPIDER GAUNTLET — two drop-Spiders bracketing a Widowmite swarm (the shield buys a push-through)
  G.ents.add(new Spider(G, 90, 5, 0, {groundY:0}));
  G.ents.add(new Widowmite(G, 92, 0, 0, {range:2.2, dir:1,  phase:0.3}));
  G.ents.add(new Widowmite(G, 96, 0, 0, {range:2.2, dir:-1, phase:1.0}));
  G.ents.add(new Spider(G, 94, 5, 0, {groundY:0}));
  DECO.add(braidedTree(90, -4.4, 1.15)); DECO.add(braidedTree(72, -4.6, 0.95));

  // ================= BEAT 3: THE BOILING CROSSING (x 96..130) — ESCALATE: first lob + gamble + the ferry =================
  signPost(G, 100, 1.5, 0.1, 'The pots here spit their brew. It lands where the ring glows — read the mark, take the open ground.');
  DECO.add(witchHut(103, -4.6, 1.05));
  // THE FIRST POTION-LOB — gentle: two marks, a long 4.5s period, wide safe lanes (teaches the read before the gauntlet)
  G.ents.add(makePotionLob(G, { marks:[[0.8,105],[2.5,113]], period:4.5, tel:0.7, flight:0.6, puddle:0.9, cen:109, presR:20 }));
  candyLine(G, [[100,0.9,0],[103,0.9,0]], 3);
  // THE MYSTERY CAULDRON — the D3 gamble, in a CLEAR pocket off the lane (dip → a Widowmite swarm); nearest
  // patrol is the widowmites at x114 (>5u) and its ambush ring spawns on its own fixed scatter with spawnGrace
  const myst = new MysteryCauldron(108, 0, -2.0, -0.2);
  G.ents.add(myst); G.coffins.push(myst);
  G.world.addBox(108, 0, -2.0, 1.6, 1.4, 1.6, {});   // solid footprint — you disturb it, you don't walk through it
  // a ground Widowmite swarm keeps you honest under the lobs (the archetype: ground pressure + sky)
  G.ents.add(new Widowmite(G, 111, 0, 0, {range:2.0, dir:1,  phase:0.2}));
  G.ents.add(new Widowmite(G, 114, 0, 0, {range:2.0, dir:-1, phase:0.9}));
  // THE FERRY CHASM (x116..124): a moving glowing-potion platform shuttling the void on a fixed clock from
  // level start, kissing both lips (period 4.5s). Miss = a fall to killY → walk back to CP3. Comparable
  // heights: lip slabs + ferry deck all sit at surface y≈1.5, ~3.5u tap hops on either side.
  potionPlat(114, 1.5, 0);    // left lip (over the ground edge)
  potionPlat(126, 1.5, 0);    // right lip (over the landing)
  const potionFerry = ()=>{
    const g = new THREE.Group();
    const deck = mesh('box',[2.4,0.5,2.4], mat(W3PAL.cauldronR)); deck.position.y=0.25;
    const glow = mesh('box',[2.6,0.12,2.6], emat(W3PAL.brew,W3PAL.brew,0.65)); glow.position.y=0.5;
    for(const wx of [-0.8,0.8]){ const b = mesh('sph',[rand(0.1,0.16),6,5], emat(W3PAL.brewV,W3PAL.brewV,0.85)); b.position.set(wx,0.62,-0.8); g.add(b); }
    g.add(deck, glow); S.add(g); return g;
  };
  G.world.addMover(2.4, 0.5, 2.4, t=>new THREE.Vector3(lerp(117.5, 122.5, 0.5+0.5*Math.sin(t*TAU/4.5)), 1.0, 0), potionFerry);
  candyLine(G, [[114,2.0,0],[117.5,2.0,0]], 2);
  candyLine(G, [[122.5,2.0,0],[126,2.0,0]], 2);
  G.ents.add(new Checkpoint(130, 0, 1.3, 2));   // CP3 — before the gauntlet (KEEPS its light: a beacon into the storm)

  // ================= BEAT 4: THE CAULDRON GAUNTLET (x 130..196) — MASTER: THE POTION-LOB BOMBARDMENT =================
  // a MOON/WINGS dip offered before the storm (help, in a clear pocket) + a heart
  G.ents.add(new CauldronDip(133, 0, 0, {cycle:['moon','bat'], light:true}));
  G.ents.add(new Heart(136, 1.0, 0));
  signPost(G, 138, 1.5, -0.1, 'THE CAULDRON GAUNTLET. When the pots boil over, the floor between the marks is yours — take it and don\'t stop.');
  // background spitter cauldrons on ledges (deco justifying the overhead lobs)
  DECO.add(cauldronDeco(146, -3.6, 1.4)); DECO.add(cauldronDeco(164, -3.7, 1.4)); DECO.add(cauldronDeco(182, -3.6, 1.4));
  DECO.add(witchHut(158, -5.0, 1.1));
  // 3-4 ground threats so you can never camp a safe pocket while the sky rains — spread through the gauntlet
  G.ents.add(new Widowmite(G, 146, 0, 0, {range:2.6, dir:1,  phase:0.1}));
  G.ents.add(new Widowmite(G, 150, 0, 0, {range:2.6, dir:-1, phase:0.8}));
  G.ents.add(new Webling(G, 158, 0, 0, {phase:2.0, period:6.5, firstWeb:3.0, webLife:3.4, wallH:3.0}));
  G.ents.add(new Spider(G, 168, 5, 0, {groundY:0}));
  G.ents.add(new Widowmite(G, 174, 0, 0, {range:2.6, dir:1,  phase:0.4}));
  G.ents.add(new Widowmite(G, 178, 0, 0, {range:2.6, dir:-1, phase:1.2}));
  // THE BOMBARDMENT (x ~142..177) — two offset 3-lob sweeps per 8s cycle; sweep B lands in sweep A's safe
  // pockets so the open lanes WALK FORWARD as you dodge. Telegraphed 0.7s, brief goo puddles, ~2 bottles
  // airborne at once — SNES-Mario, never bullet-hell. Fixed clock from level start (the D3 owner archetype).
  G.ents.add(makePotionLob(G, {
    marks:[ [0.9,142],[2.1,156],[3.3,170],    // sweep A
            [4.6,149],[5.8,163],[7.0,177] ],  // sweep B — fills A's gaps
    period:8.0, tel:0.7, flight:0.65, puddle:1.0, cen:160, presR:30
  }));
  // the candy trail threads the safe rhythm forward through the storm
  candyLine(G, [[140,0.9,0],[153,0.9,0]], 7);
  candyLine(G, [[160,0.9,0],[176,0.9,0]], 7);
  G.ents.add(new Heart(172, 1.0, 0));
  G.ents.add(new Checkpoint(164, 0, 1.3, 3, {noLight:true}));   // CP4 — mid-gauntlet mercy
  S.add(willOWisp(150, 3.4, -1.6)); S.add(willOWisp(176, 3.0, -1.5));
  signPost(G, 188, 1.5, 0.1, 'The clearing quiets. The last pot has spat. Broomhilda\'s wood is close now.');
  candyLine(G, [[182,0.9,0],[186,0.9,0]], 3);
  DECO.add(mushroomCluster(190, -2.7, 1.1)); DECO.add(braidedTree(196, -4.4, 1.1));

  // ================= foreground/background silhouettes + ambient life =================
  for(const [x1,x2] of [[-6,12],[42,52],[98,112],[186,200]]){
    for(let x=x1; x<x2; x+=rand(4,7)){
      DECO.add(potionBottle(x, (rand()<0.5?-1:1)*rand(3.0,3.6)));
    }
  }
  S.add(bakeGroup(DECO));
  S.add(bakeGroup(PDECO));

  exitGate(G, 194);
  // D3 ambience tail (spores/potion motes + drifting bats + Witchwood backdrop) — clutter placed manually
  w3LevelFinish(G, -12, 204, null);
  // forest-floor clutter on the DRY strips only (never over the goo span 53-76 or the ferry void 116-124)
  w3Clutter(G, -8, 52, 'forest');
  w3Clutter(G, 76, 115, 'forest');
  w3Clutter(G, 124, 192, 'forest');

  return {spawnX: 0, exitX: 194};
}

function updateW3L3(G, dt){
  updateLevelCommon(G, dt);   // bats, ambience, coffin/cauldron + sign prompts; the lob emitters run as ents entities
}

W3_LEVELS.push({ id:'w3l3', district:'w3', name:'THE CAULDRON CLEARING', build:buildW3L3, update:updateW3L3, parTime:160 });

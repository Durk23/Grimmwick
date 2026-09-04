// ============ LEVEL 6-5 — GRUMBLE'S DOORSTEP (District 6 · Frostmere · Glimmerfields) ============
// The approach to Grumble's hill — the district's SET-PIECE finale and the week-one mastery exam. Somewhere up
// that hill, the corrupted guardian has turned the festival's snowball cannons on his own road: THE SNOWBALL
// BOMBARDMENT (the owner's archetype, made canon July 22 2026 — "3-4 ground enemies and something shot at them
// from the sky that needs to be dodged over and over"). Mortars lob arcing snowballs onto FIXED impact points on
// a FIXED repeating clock, every landing telegraphed ~0.7s by a growing CYAN target-glow on the ground (the
// SpikeIcicle glow idiom — Frostmere's one warning language), generous safe lanes between them, candy tracing the
// dodge rhythm. SMW Bullet-Bill-gauntlet energy: 3-4 simultaneous threats max, never bullet-hell. Full
// introduce->twist->escalate->master, mixing back in EVERY verb the week taught:
//   BEAT 1 THE LAST QUIET LANE            x -8..30   — CP0. Festival lights, the Mystery Igloo in its clear
//          pocket (CLEAR-PATCH law — nothing patrols within ~10u), a rolling snowball lane to warm up on, a
//          Spooky Snowman pretending very hard to be decoration. The QUIET PROP waits in a drift.
//   BEAT 2 THE FIRST BARRAGE (INTRODUCE)  x 30..64   — battery A: a 4-point left-to-right sweep on open snow,
//          a penguin lane underneath. THE HIGH ROAD branches up a ridge ABOVE the mortars' aim — harder jumps,
//          more candy, bombardment-free: the strategic trade, visible from below (the "next run" itch).
//   BEAT 3 THE GLAZE BARRAGE (TWIST)      x 64..96   — CP1. The same sweep... over ICE. Momentum vs pattern:
//          you can't stop quick on the glaze, so plan the stops. A Snow-Boo stared solid = mobile snow-fort.
//   BEAT 4 THE ICICLE PASS (ESCALATE)     x 96..132  — CP2. Mortars slalom with a SpikeIcicle ceiling stretch,
//          a growing snowball lane and a penguin between them — three lanes, every threat on its own clock.
//          A glacial crevasse (the level's one pit) caps the pass.
//   BEAT 5 GRUMBLE'S HILL (MASTER · gate) x 135.5..181 — the doorstep gauntlet: mortars on an ice apron, the
//          GARLAND CLIMB up the hill face (the gated verb, candy-telegraphed), the crest crossed UNDER FIRE
//          (Grumble shells his own doorstep now), a Blizzard Bat diving the top, then down to the door.
// Reads UNMISTAKABLY Glimmerfields: W6PAL moonlit snow on the deep blue-violet night, warm festival bulbs strung
// the whole way (five shared mats, one twinkle ticker), aurora ribbons, snowfall, cyan cold-spirit glow — and the
// far hill wears one ENORMOUS snowman silhouette, waiting. Three lanes busy throughout (ground penguins/snowmen/
// rollers/boos · air mortar arcs + Blizzard Bats · the icicle ceiling). Comparable heights (tap 1.8 / held 2.6 /
// double 3.3; main road flat + one 3.5u tap-gap; high-road rises <=1.7 with over-clearance; the 4.6 hill is CLIMB-
// gated, verb candy-telegraphed). HEARTS ALWAYS: every mortar/icicle/graze costs a heart, the crevasse costs a
// heart + the lantern walk-back — nothing one-shots. Deterministic to the flake: every battery on a fixed clock
// from level start, fixed enemy phases, NO Math.random on the critical path; seeded rand() only inside baked deco.
// GP: NONE (all three of the district's Golden Pumpkins live in 6-1..6-4). NO Old Shortcut here (the Wrong
// Snowman keeps his own level). NO Leap of Faith — both of the game's two are placed and sacred.

// ---- THE SNOWBALL MORTAR BATTERY — the set-piece engine, level-local. One ticker per battery, cull:false so
// the clock NEVER stops (determinism rule: same volley, same rhythm, every attempt — the presentation is gated
// by distance, the physics never is). Each slot: [time, x, floorY]. Telegraph = the growing cyan target-glow
// (SpikeIcicle's language, so the lesson carries); impact = 1 heart in a 0.9 radius + snow-burst; the snowball
// arcs in high from Grumble's hill (+x, background). i-frames make repeats fair; knockback always pushes AWAY. ----
function w6l5Mortar(G, opts){
  const PERIOD = opts.period, TEL = 0.7, FLIGHT = 0.55, CX = opts.cx;
  const bomb = {group:new THREE.Group(), dead:false, cull:false, isEnemy:false, t:0, slots:[]};
  for(const [vt, vx, fy0] of opts.volley){
    const fy = fy0 || 0;
    const disc = new THREE.Mesh(geo('circ',0.9,16), new THREE.MeshBasicMaterial({color:W6PAL.coldFx, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
    disc.rotation.x = -Math.PI/2; disc.position.set(vx, fy+0.1, 0); disc.visible = false;   // +0.1 clears the crest's sheen strip too
    const ball = new THREE.Mesh(geo('sph',0.42,9,8), emat(0xf0f4ff, 0x8aa4d0, 0.35));
    ball.visible = false;
    bomb.group.add(disc, ball);
    bomb.slots.push({vt, vx, fy, disc, ball, whooshed:false});
  }
  bomb.update = function(dt){
    const prev = this.t % PERIOD;
    this.t += dt;
    const ph = this.t % PERIOD;
    const pl = G.player;
    const near = pl && Math.abs(pl.pos.x - CX) < 26;   // presentation gate only — the clock never stops
    for(const s of this.slots){
      // telegraph: the cold blue target-glow grows and pulses on the landing spot (~0.7s of honest warning)
      if(ph >= s.vt - TEL && ph < s.vt){
        const u = (ph - (s.vt - TEL)) / TEL;
        s.disc.visible = true;
        s.disc.material.opacity = 0.16 + 0.42*u + Math.sin(this.t*22)*0.07;
        s.disc.scale.setScalar(0.35 + 0.7*u);
      } else s.disc.visible = false;
      // the snowball arcs in from the hill's horizon
      if(ph >= s.vt - FLIGHT && ph < s.vt){
        const u = (ph - (s.vt - FLIGHT)) / FLIGHT;
        s.ball.visible = true;
        s.ball.position.set(s.vx + 10*(1-u), s.fy + 0.42 + 13*(1-u*u), -5*(1-u));
        s.ball.rotation.z = u*7;
        if(!s.whooshed){ s.whooshed = true; if(near) AUDIO.noise && AUDIO.noise({t:0.3, vol:0.09, fFrom:1800, fTo:400}); }
      } else { s.ball.visible = false; if(ph < s.vt - FLIGHT) s.whooshed = false; }
      // impact — a heart in a small radius, never more (HEARTS ALWAYS); jumping over the burst is a real dodge
      if(prev < s.vt && ph >= s.vt){
        const ip = new THREE.Vector3(s.vx, s.fy+0.2, 0);
        if(near){
          G.fx.spawn(ip, 0xf0f4ff, 12, {speed:4, life:0.45});
          G.fx.spawn(ip, 0xbfe8ff, 7, {speed:3, life:0.5});
          AUDIO.noise && AUDIO.noise({t:0.2, vol:0.18, fFrom:500, fTo:60});
          G.camc.shake(0.13, 0.16);
        }
        if(pl && !pl.dead && Math.abs(pl.pos.x - s.vx) < 0.9 && Math.abs(pl.pos.z) < 1.8 &&
           pl.pos.y > s.fy - 0.6 && pl.pos.y < s.fy + 1.25){
          // knockback always pushes AWAY from the burst (never a zero vector)
          pl.damage(1, new THREE.Vector3(s.vx - (pl.pos.x >= s.vx ? 0.4 : -0.4), s.fy, 0));
        }
      }
    }
  };
  G.ents.add(bomb);
}

// ---- a SNOW MORTAR (baked deco — the volleys need a visible SOURCE): a drift-mound, a cold iron tube tilted
// down the road, a cyan corruption-ring at the muzzle, and a neat pyramid of ammo beside it. Aimed left, at you. ----
function w6l5MortarTube(x, y, z, s=1){
  const g = new THREE.Group();
  const mound = mesh('sph',[0.95*s,8,6], mat(W6PAL.snowD)); mound.scale.y=0.5; mound.position.set(x, y+0.1, z); g.add(mound);
  const tube = mesh('cyl',[0.26*s,0.36*s,1.25*s,8], mat(0x2a3048)); tube.position.set(x, y+0.8*s, z); tube.rotation.z=0.55; g.add(tube);
  const ring = mesh('tor',[0.27*s,0.045*s,5,12], emat(W6PAL.coldFx, W6PAL.coldFx, 0.8)); ring.position.set(x-0.34*s, y+1.32*s, z); ring.rotation.z=0.55; g.add(ring);
  for(let i=0;i<3;i++){ const ammo=mesh('sph',[0.2*s,7,6], mat(W6PAL.snow)); ammo.position.set(x+0.75*s+(i%2)*0.3*s, y+0.18*s+(i>1?0.3*s:0), z+0.2*s); g.add(ammo); }
  return g;
}

// ---- THE QUIET PROP: a mailbox buried to its shoulders in a drift, door frozen open, one letter caught
// mid-delivery — the envelope addressed with nothing but a tiny drawn heart. Somebody wrote to Grumble this
// winter. Never signposted; fully baked; story-readers stop, everyone else walks past. That's the point. ----
function w6l5Mailbox(x, z){
  const g = new THREE.Group();
  const drift = mesh('sph',[0.85,8,6], mat(W6PAL.snow)); drift.scale.y=0.5; drift.position.set(x, 0.12, z); g.add(drift);
  const post = mesh('cyl',[0.05,0.07,1.15,5], mat(W6PAL.woodD)); post.position.set(x, 0.55, z); post.rotation.z=0.09; g.add(post);
  const box = mesh('box',[0.62,0.34,0.34], mat(0x8a2e3a)); box.position.set(x+0.1, 1.18, z); box.rotation.z=0.09; g.add(box);
  const lid = mesh('cyl',[0.17,0.17,0.62,8,1,false,0,Math.PI], mat(0x6e222c)); lid.rotation.z=Math.PI/2; lid.position.set(x+0.1, 1.35, z); g.add(lid);
  const cap = mesh('sph',[0.24,7,5], mat(W6PAL.snow)); cap.scale.y=0.4; cap.position.set(x+0.08, 1.47, z); g.add(cap);   // snow on the roof
  const flag = mesh('box',[0.05,0.16,0.03], emat(0xd83a4a,0x8a1e2c,0.4)); flag.position.set(x+0.38, 1.4, z+0.12); g.add(flag);   // flag up — waiting for pickup
  const door = mesh('box',[0.3,0.3,0.03], mat(0x6e222c)); door.position.set(x+0.44, 1.02, z); door.rotation.z=-1.1; g.add(door);   // frozen mid-swing
  const env = mesh('box',[0.3,0.03,0.2], mat(0xf4f1e4)); env.position.set(x+0.4, 1.16, z); env.rotation.z=0.28; g.add(env);       // the letter, half out
  // the address: a tiny heart — two beads and a point, soft red glow (small enough to miss, warm enough to find)
  const hL = mesh('sph',[0.028,5,4], emat(0xd83a4a,0xd83a4a,0.6)); hL.position.set(x+0.4, 1.2, z+0.07);
  const hR = hL.clone(); hR.position.x = x+0.435; g.add(hL, hR);
  const hP = mesh('cone',[0.028,0.05,4], emat(0xd83a4a,0xd83a4a,0.6)); hP.rotation.z=Math.PI; hP.position.set(x+0.418, 1.165, z+0.07); g.add(hP);
  return g;
}

function buildW6L5(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const SNOW  = W6PAL.snowD;   // moonlit low-road snowpack
  const RIDGE = W6PAL.snow;    // the bright high-road ridge (brighter = the safe road reads from below)

  const deco = new THREE.Group();          // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();               // festival light strings — 5 shared mats + one twinkle ticker

  // =============================== BEAT 1 — THE LAST QUIET LANE (x -8..30) ===============================
  groundX(G, -8, 64, SNOW);                                            // snow road runs unbroken to the glaze at 64
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));            // CP0 — start
  signPost(G, 5, 1.7, -0.12, "GRUMBLE'S DOORSTEP. The hill lobs snowballs at anyone who knocks - watch the road: a cold blue glow marks where the sky lands next. Stand ANYWHERE else. Or take the ridge - he can't hit what flies above his aim.");
  // festival lights still strung down the lane — the town never stopped decorating his road
  deco.add(w6LightPost(6, -1.8, 3)); deco.add(w6LightPost(12, -1.8, 3));
  w6String(L, 6, 2.95, 12, 2.95, {z:-1.7});
  deco.add(w6LightPost(19, -1.9, 3)); deco.add(w6LightPost(27, -1.9, 3));
  w6String(L, 19, 2.95, 27, 2.95, {z:-1.8});
  candyLine(G, [[6,0.9,0],[9,0.9,0],[12,0.9,0]], 3);
  G.ents.add(new Crow(10, 0.95, 2.3));                                 // winter crow #1 — flaps off when neared
  // THE MYSTERY IGLOO — the gamble, in its CLEAR POCKET (CLEAR-PATCH law): roller lane starts at 24 (10u clear),
  // the snowman holds at 30 (a player at the igloo sits beyond its watchR — it stays pure decoration), mortars
  // begin at 37, bats live past 96. Opening it is a deliberate, safe act; the ambush spawns on the kit's 1s grace.
  { const ig = new MysteryIgloo(14, 0, -0.6, 0.35); G.coffins.push(ig); G.ents.add(ig); }
  // THE QUIET PROP (never signposted): the buried mailbox, one letter frozen mid-delivery, addressed with a heart
  deco.add(w6l5Mailbox(22.5, -1.9));
  // SNOWBALL ROLLER #1 — the week-one verb warms you up before the sky joins in (rolls INTO the barrage zone)
  G.ents.add(new SnowballRoller(G, 24, 0, 0, {x1:44, speed:3.0, r0:0.3, r1:0.9, pause:1.4, phase:0.0}));
  // SPOOKY SNOWMAN #1 — "decoration" at the barrage gate. Placed on open snow with room for its whole act:
  // head-pop, the blind waddle, the ANGRY rebuild — the rebuilt-and-furious pacing this doorstep deserves.
  G.ents.add(new SpookySnowman(G, 30, 0, 0, {phase:0.0, watchR:11, aggroR:7}));

  // =============================== BEAT 2 — THE FIRST BARRAGE (x 30..64): INTRODUCE the mortars ===============================
  // battery A — a 4-point sweep marching toward the hill (impacts 37/43/49/55, 6u apart: ~4.2u of safe lane
  // between any two craters). Learn the glow, learn the rhythm; candy sits exactly where the dodge does.
  w6l5Mortar(G, {period:6.4, cx:46, volley:[[0.9,37],[1.8,43],[2.7,49],[3.6,55]]});
  candyLine(G, [[40,0.9,0],[45.2,0.9,0]], 2);                          // the dodge rhythm, traced
  candyLine(G, [[52,0.9,0],[58,0.9,0]], 2);
  G.ents.add(new FrostbitePenguin(G, 46, 0, 0, {phase:0.4, range:2.4, dir:-1}));   // ground pressure under the sweep — no camping
  // THE HIGH ROAD — a ridge line ABOVE the mortars' aim (impacts only bite below y1.25): trade harder jumps for
  // bombardment safety. Every ledge visible from the low road, candy overhead the whole way (the junction rule).
  platform(G, 38, 1.7, 0, 2.6, 3, RIDGE);                              // R1 spans 36.7..39.3 (+1.7 held from snow — over-clearance)
  platform(G, 42.5, 3.2, 0, 3.0, 3, RIDGE);                            // R2 spans 41..44 (+1.5, gap 1.7 — comfy double)
  platform(G, 48, 3.8, 0, 3.4, 3, RIDGE);                              // R3 spans 46.3..49.7 (+0.6, gap 2.3)
  platform(G, 53.5, 3.6, 0, 3.0, 3, RIDGE);                            // R4 spans 52..55 (-0.2, gap 2.3)
  platform(G, 59, 4.0, 0, 3.0, 3, RIDGE);                              // R5 spans 57.5..60.5 (+0.4, gap 2.5)
  candyLine(G, [[38,2.5,0],[41,3.6,0],[42.5,4.0,0]], 3);              // candy telegraphs the way up...
  candyLine(G, [[48,4.6,0],[53.5,4.4,0]], 2);
  candyLine(G, [[59,4.8,0],[62,4.8,0]], 2);                            // ...and off the ridge toward CP1

  // =============================== BEAT 3 — THE GLAZE BARRAGE (x 64..96): TWIST — the sweep, on ice ===============================
  G.ents.add(new Checkpoint(61.5, 0, 1.6, 1));                         // CP1 — LIT, mid-level mercy before the glaze
  signPost(G, 63, 1.7, 0.1, "THE GLAZE. The barrage keeps its rhythm, but the ice keeps your speed - plan your stops before you need them. And a Boo stared solid makes a fine snow-fort, if you can bear the company.");
  w6IceX(G, 64, 96);                                                   // tag:'ice' — slick underfoot, glossy telegraphed sheen
  // battery B — the SAME learned sweep, one point longer, over the glaze: momentum vs pattern (the twist)
  w6l5Mortar(G, {period:7.0, cx:81, volley:[[1.0,69],[1.9,75],[2.8,81],[3.7,87],[4.6,93]]});
  candyLine(G, [[66,0.9,0],[72,0.9,0],[78,0.9,0]], 3);                // the safe-lane rhythm, traced across the ice
  candyLine(G, [[84,0.9,0],[90,0.9,0]], 2);
  G.ents.add(new FrostbitePenguin(G, 74, 0, 0, {phase:1.1, range:2.6, speed:1.3, slideSpeed:9.5}));   // a local — slides FASTER on home ice
  // SNOW-BOO #1 — the stare-freeze twist WORKS WITH the gimmick: stared solid it's a standable, mortar-proof
  // snow-fort (block top clears the impact window). The learned rule becomes cover. freezeMax up for real shelter.
  G.ents.add(new SnowBoo(G, 80, 0, 0, {phase:0.3, speed:2.0, range:9, freezeMax:2.6}));
  // the ridge carries on over the glaze — the dry, mortar-free road for those who can hold it
  platform(G, 65.5, 3.8, 0, 3.0, 3, RIDGE);                            // R6 spans 64..67 (gap 3.5 tap, -0.2)
  platform(G, 71, 4.2, 0, 3.0, 3, RIDGE);                              // R7 spans 69.5..72.5 (+0.4, gap 2.5)
  platform(G, 77, 3.9, 0, 3.4, 3, RIDGE);                              // R8 spans 75.3..78.7 (-0.3, gap 2.8)
  platform(G, 83, 4.3, 0, 3.0, 3, RIDGE);                              // R9 spans 81.5..84.5 (+0.4, gap 2.8)
  platform(G, 89, 3.4, 0, 3.0, 3, RIDGE);                              // R10 spans 87.5..90.5 (-0.9, gap 3.0)
  platform(G, 93, 1.8, 0, 2.6, 3, RIDGE);                              // step-down spans 91.7..94.3 — rejoin at the pass
  G.ents.add(new BonkLantern(G, 71, 5.6, 0, 'bat'));                   // high-road prize: BAT WINGS for the run ahead
  G.ents.add(new Heart(83, 5.4, 0));                                   // ...and the Heart the low road sees overhead
  candyLine(G, [[65.5,4.6,0],[71,5.0,0]], 2);
  candyLine(G, [[77,4.7,0],[83,5.1,0]], 2);
  candyLine(G, [[89,4.2,0],[93,2.6,0]], 2);
  // BLIZZARD BAT #1 — the air lane at the rejoin junction (squeak-telegraphed snapshot dive; drifts toward the
  // player after diving — homed 80u+ from the igloo, per the re-home/clear-patch rule)
  G.ents.add(new BlizzardBat(G, 96, 5.0, 0, {phase:0.5, range:3, period:3.4, aggroR:4.5}));
  G.ents.add(new Crow(95, 0.95, 2.4));                                 // winter crow #2, at the ice's edge

  // =============================== BEAT 4 — THE ICICLE PASS (x 96..132): ESCALATE — three lanes, three clocks ===============================
  groundX(G, 96, 132, SNOW);
  G.ents.add(new BonkLantern(G, 97.5, 1.5, 0, 'shield'));              // armor up — the pass is the exam's essay question
  G.ents.add(new Checkpoint(99, 0, 1.6, 2));                           // CP2 — LIT, the second mid lantern (>100u rule)
  signPost(G, 101, 1.7, -0.1, "THE COLD PANTRY LANE. Icicles above, mortars beyond, and something rolling in between. Grumble REALLY isn't taking visitors tonight. Prove him wrong.");
  // the snow cornice the icicles hang from (baked overhang deco — double-jump apex 3.3 never reaches 5.9)
  for(const cx of [104, 108.5, 113, 117.5, 122]){
    const slab = mesh('box',[4.2,0.5,2.4], mat(W6PAL.snowD)); slab.position.set(cx, 5.9, -0.9); slab.rotation.z = (cx%9<4?0.03:-0.03); deco.add(slab);
    const lump = mesh('sph',[0.55,7,5], mat(W6PAL.snow)); lump.scale.y=0.5; lump.position.set(cx-1, 6.2, -0.7); deco.add(lump);
  }
  // the ceiling lane — three icicles on staggered clocks (shimmer+drip+floor-glow telegraph, the kit's idiom)
  G.ents.add(new SpikeIcicle(G, 104, 5.6, {period:4.4, phase:0.0, len:1.2}));
  G.ents.add(new SpikeIcicle(G, 112, 5.6, {period:4.8, phase:1.4, len:1.2}));
  G.ents.add(new SpikeIcicle(G, 120, 5.6, {period:5.2, phase:2.8, len:1.2}));
  // battery C — three mortar points INTERLEAVED with the icicle columns: the ground is a slalom of distinct,
  // separately-clocked threat columns with 3u of honest lane between any two (structured chaos, never bullet-hell)
  w6l5Mortar(G, {period:6.8, cx:108, volley:[[0.8,100],[2.0,108],[3.2,116]]});
  // SNOWBALL ROLLER #2 — grows boulder-big right under the icicles (near-miss energy, fixed lane clock).
  // Lane starts at 101, past the CP2/shield rest pocket — the lantern stop stays a clean breath, not a clip.
  G.ents.add(new SnowballRoller(G, 101, 0, 0, {x1:124, speed:3.4, r0:0.35, r1:1.05, pause:1.2, phase:2.0}));
  G.ents.add(new FrostbitePenguin(G, 113, 0, 0, {phase:0.7, range:2.2, wakeR:5}));   // the ground lane's third voice
  candyLine(G, [[102,0.9,0],[106,0.9,0],[110,0.9,0]], 3);             // the slalom line — every piece on safe ground
  candyLine(G, [[114,0.9,0],[118,0.9,0],[122,0.9,0]], 3);
  // SPOOKY SNOWMAN #2 — guards the crevasse approach, REBUILT-ANGRY pacing: room behind you for the full
  // pop-waddle-rebuild arc while battery C still thumps at your back. Watch it or walk backward. Your pick.
  G.ents.add(new SpookySnowman(G, 126.5, 0, 0, {phase:0.6, watchR:11, aggroR:7.5}));
  // THE CREVASSE — the level's one pit (x 132..135.5, a 3.5u tap-clear gap; a miss = a heart + the CP2 walk-back,
  // HEARTS ALWAYS). Battery C's last crater lands 11u clear of the lip — knockback can never chain a fall.
  candyLine(G, [[130.8,1.0,0],[133.7,2.3,0],[136.6,1.0,0]], 3);       // the arc, traced

  // =============================== BEAT 5 — GRUMBLE'S HILL (x 135.5..181): MASTER — the doorstep gauntlet ===============================
  groundX(G, 135.5, 139, SNOW);                                        // a snow landing after the gap (generous, always)
  w6IceX(G, 139, 149.4);                                               // the ice apron up to the hill's foot
  // battery D — the master mix: two craters on the apron ICE, two on the CREST (Grumble shells his own doorstep
  // now — the one place the high ground stopped being safe; escalation with a wink at beat 2's trade)
  w6l5Mortar(G, {period:7.4, cx:148, volley:[[0.9,141.5,0],[1.8,146,0],[3.4,153,4.6],[4.3,157,4.6]]});
  candyLine(G, [[140,0.9,0],[143.8,0.9,0],[147.6,0.9,0]], 3);         // the apron rhythm
  // SNOW-BOO #2 — drifts the apron; the stared-solid snow-fort trick, one last time, where it matters most
  G.ents.add(new SnowBoo(G, 143.5, 0, 0, {phase:1.2, speed:2.2, range:8, freezeMax:2.6}));
  G.ents.add(new Crow(137.5, 0.95, 2.4));                              // winter crow #3, on the gap's far lip
  // THE HILL — a 4.6u face: too high for any jump, GATED by the GARLAND CLIMB (the comparable-heights law:
  // anything past 3.0 gets a verb, and the verb gets candy). The town strung his hill with lights; you climb them.
  { const hill = mesh('box',[10.6,4.6,6], mat(SNOW)); hill.position.set(154.7, 2.3, 0); S.add(hill);
    const sheen = mesh('box',[10.7,0.16,6.2], emat(W6PAL.snow, 0x8aa4d0, 0.18)); sheen.position.set(154.7, 4.6, 0); S.add(sheen);
    G.world.addBox(154.7, 0, 0, 10.6, 4.6, 6, {}); }
  G.world.addBox(149.15, 0, 0, 1.0, 5.0, 1.2, {type:'climb'});         // the garland climb (tops 5.0 — the exit hop clears the crest)
  w6String(L, 149.35, 0.35, 149.35, 4.85, {z:0.35, sag:0.15, segs:8}); // the climbable garland's twinkling visual
  candyLine(G, [[149.6,1.4,0],[149.6,2.8,0],[149.6,4.2,0]], 3);       // candy telegraphs the climb verb, rung by rung
  // THE CREST — crossed under battery D's fire (safe pockets at 150.5..152, ~155, and 158+), a bat diving the top
  { const cp1 = w6LightPost(151, -2.5, 1.2); cp1.position.y = 4.6; deco.add(cp1);     // posts lifted to the crest top
    const cp2 = w6LightPost(159, -2.5, 1.2); cp2.position.y = 4.6; deco.add(cp2); }
  w6String(L, 151, 5.75, 159, 5.75, {z:-2.4});                        // Winterfest lights right up to his door
  candyLine(G, [[151,5.5,0],[155,5.5,0],[158.5,5.5,0]], 3);           // the crest pockets, traced
  G.ents.add(new BlizzardBat(G, 155.5, 7.6, 0, {phase:1.3, range:2.5, period:3.8, aggroR:5}));
  // the mortars themselves crown the crest's back edge — you finally WALK PAST the things that shelled you
  deco.add(w6l5MortarTube(151.8, 4.6, -2.3, 0.9));
  deco.add(w6l5MortarTube(157.6, 4.6, -2.3, 0.9));
  // DESCEND the far side to the doorstep court (drops are free; the steps are the graceful line)
  groundX(G, 160, 181, SNOW);
  platform(G, 162, 3.0, 0, 2.6, 3, RIDGE);                             // spans 160.7..163.3 (drop 1.6)
  platform(G, 164.8, 1.5, 0, 2.4, 3, RIDGE);                           // spans 163.6..166 (drop 1.5)
  candyLine(G, [[162,3.5,0],[164.8,2.0,0],[167,0.9,0]], 3);
  // THE DOORSTEP COURT — quiet. Lights, a sign, and the door. The fight already happened; this is the knock.
  deco.add(w6LightPost(166.5, -1.9, 3)); deco.add(w6LightPost(172.5, -1.9, 3));
  w6String(L, 166.5, 2.95, 172.5, 2.95, {z:-1.8});
  candyLine(G, [[169.5,0.9,0],[171.5,0.9,0]], 2);
  G.ents.add(new Crow(168, 0.95, 2.2));                                // one last crow, unbothered by any of it
  signPost(G, 169, 1.7, -0.1, "GRUMBLE'S DOOR. Three hundred winters of being built by small hands - carrot noses, borrowed scarves, mitten pats goodnight. Whatever froze him isn't him. Go remind him.");
  { const lamp = new THREE.PointLight(0xffb85e, 26, 11); lamp.position.set(171, 3.6, -1); S.add(lamp); }   // the door's warm welcome — the level's one added real light
  exitGate(G, 174);

  // =============================== DECO · SILHOUETTES · THE WAITING GIANT · PARALLAX ===============================
  // background pines + snowfolk along the road (baked with everything else)
  deco.add(w6Pine(-5, -2.8, 1.3)); deco.add(w6Pine(17, -3.1, 1.1)); deco.add(w6Pine(35, -2.7, 1.4));
  deco.add(w6Pine(57, -3.0, 1.2)); deco.add(w6Pine(100, -3.2, 1.3)); deco.add(w6Pine(124, -2.8, 1.5));
  deco.add(w6Pine(138, -3.0, 1.1)); deco.add(w6Pine(163, -2.9, 1.3)); deco.add(w6Pine(178, -2.7, 1.2));
  deco.add(w6SnowmanDeco(44, -2.6, 0.8, 0.4)); deco.add(w6SnowmanDeco(119, -2.8, 0.7, -0.3));
  deco.add(w6GiftBox(167.8, -1.4, 0.9)); deco.add(w6GiftBox(170.4, -1.6, 0.7)); deco.add(w6GiftBox(169, -1.2, 0.6));   // presents left on his step
  // the mid-ground batteries that fired beats 2-4 (the arcs' source, visibly aimed down the road)
  deco.add(w6l5MortarTube(60, 0, -6.5, 1.1));
  deco.add(w6l5MortarTube(118, 0, -7, 1.2));
  // ridge supports — snowdrift pillars behind the lane (deco only; physics stays invisible boxes)
  for(const [px,py] of [[42.5,3.2],[53.5,3.6],[71,4.2],[83,4.3]]){
    const pil = mesh('cyl',[0.5,0.85,py,7], mat(W6PAL.snowD)); pil.position.set(px, py/2, -1.6); deco.add(pil);
  }
  // FOREGROUND silhouettes (z>0) framing depth — pines and one unimpressed snowman up front
  deco.add(w6Pine(-2, 2.6, 1.3)); deco.add(w6Pine(33, 2.8, 1.1)); deco.add(w6Pine(91, 2.5, 1.2));
  deco.add(w6Pine(129, 2.7, 1.4)); deco.add(w6Pine(176, 2.6, 1.2));
  deco.add(w6SnowmanDeco(47, 2.7, 0.9, -0.5)); deco.add(w6SnowmanDeco(168.5, 2.5, 0.8, 0.6));
  // THE WAITING GIANT — an enormous snowman silhouette on the hill past the gate, still as held breath.
  // Not signposted, not named. Everyone knows whose doorstep this is.
  deco.add(w6SnowmanDeco(190, -13.5, 5.5, -0.9));
  S.add(bakeGroup(deco));

  // the winter moon, low and cold behind the hill
  const moon = mesh('circ',[4.2,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(120, 15, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.8,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(120, 15, -30.2); S.add(moonH);

  // three-depth Glimmerfields skyline (snowdrifts & birches / the lamplit village / the great blue peaks) + aurora
  w6Parallax(S, -8, 181);

  // the crevasse's glacial dressing (visual — the fall is the hazard; heart + walk-back, never a death)
  pitDressing(G, 132, 135.5, 'winter');

  // festival lights live (5 draw calls + one twinkle ticker for every string in the level)
  w6LightsFinish(G, L);

  // exit + the W6 tail. Clutter placed manually on the SNOW spans only (the glaze keeps its frozen sparkle,
  // the crevasse stays bare, the crest is bare wind-scoured pack)
  w6LevelFinish(G, -8, 181, null);
  w6Clutter(G, -8, 63.5, 'winter');
  w6Clutter(G, 96.5, 131.5, 'winter');
  w6Clutter(G, 160, 181, 'winter');

  return {spawnX: 0, exitX: 174};
}

function updateW6L5(G, dt){
  updateLevelCommon(G, dt);
  // Bespoke ticking: none required — the mortar batteries are cull:false G.ents tickers on fixed clocks, the
  // icicles/rollers/boos/bats/snowmen carry fixed phases, the kit runs the lights/aurora/snowfall. The whole
  // bombardment is identical every attempt (determinism rule) — death costs progress, never knowledge.
}

W6_LEVELS.push({id:'w6l5', district:'w6', name:"GRUMBLE'S DOORSTEP", build:buildW6L5, update:updateW6L5, parTime:165});

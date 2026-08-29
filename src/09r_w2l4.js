// ============ W2-4 — THE GLITTERING DEEP (Ravenmoor Catacombs) ============
// District 2's crystal-cavern showcase, ~4 min. Sorts after 09n_w2kit (n<r) so the D2 kit,
// W2_LEVELS registry, RestlessUrn, undergroundRiver, crystalCluster, w2Parallax/Ambience are ready.
//
// SIGNATURE GIMMICK: CRYSTAL CAVERNS + UNDERGROUND RIVER + THE BAT BOMBARDMENT.
// Full kishotenketsu arc:
//   INTRODUCE (x0..40)   — crystals light the road; a first narrow stream taught with stepping crystals
//                          (crystal = safe stone · glowing river = a hazard, per hearts-always).
//   [a dark pocket x40..64] — a Wisp hunts in the dark; keep it in your sight or reach the lantern light.
//   TWIST (x64..104)     — THE CROSSING: the river at its widest, spanned only by crystal platforms.
//   ESCALATE (x104..150) — THE RUSHING DEEP: the same crossing, now under diving bats + a moving barge
//                          over a true chasm.
//   MASTER (x150..192)   — THE ROOST: the D2 BOMBARDMENT — bats pour from ceiling cracks on a FIXED clock,
//                          telegraphed 0.7s ahead, while 3-4 ground threats keep you moving. Then the gate.
// Structured chaos, not clutter: ~15 discrete threats over ~200 units, singles + telegraphed set-pieces,
// never gangs — every placement, volley, dive, and the barge on a fixed clock from level start (determinism).
// The whole level runs on solid ground at y>=0 (the river is a hazard STRIP over the floor, mud-pit model:
// fall in = 1 heart + i-frames, climb back onto a crystal), so camMinY stays 0 — no underground camera needed.
function buildW2L4(G){
  const S = G.scene;
  levelBegin(G);
  G.lightPools = [];   // D2 darkness-mechanic contract — reset right after levelBegin (the Wisp reads this)

  // palette handles for this level
  const FLOOR = 0x2b2540;                 // dark catacomb floor (groundX adds its own bright lip)
  const ROCKC = 0x2f5f66, ROCKV = 0x463a6b, ROCKG = 0x2f6b52;   // cyan / violet / green crystal-rock platforms
  const CYAN = W2PAL.crystal, VIOL = W2PAL.crystalV, GREN = W2PAL.crystalP;   // crystal glow colours (from the D2 kit)

  // ---- baked crystal deco collector (emissive-lifted, one draw call) ----
  const CDECO = new THREE.Group();
  const xtal = (x,y,z,s,col)=>{ const c = crystalCluster(x, z, s, col); c.position.y = y; CDECO.add(c); return c; };
  // a crystal PLATFORM: a standable slab framed by little glowing clusters (the level's light + landmarks)
  const crystalStep = (x,y,z,w,rock,col)=>{
    platform(G, x, y, z, w, 3, rock);
    xtal(x-w*0.28, y, -0.95, 0.5, col);
    xtal(x+w*0.28, y,  0.95, 0.42, col);
  };
  // baked scenery collector (stalagmites/stalactites/arches/bones/the quiet prop)
  const DECO = new THREE.Group();

  // parallax cave backdrop across the whole course
  w2Parallax(S, -12, 202, 'cave');

  // ================= grounds (solid y=0; rivers ride on top, one true chasm for the barge) =================
  groundX(G, -8, 64, FLOOR);      // beats 1-2
  groundX(G, 64, 124, FLOOR);     // the Crossing + the Rushing Deep's first half
  // VOID 124..131 — the barge chasm
  groundX(G, 131, 197, FLOOR);    // past the chasm through the Roost to the gate

  // ================= BEAT 1: THE DESCENT MOUTH (x -8..40) — introduce crystals + the river =================
  signPost(G, 2.5, 1.5, 0.12, 'THE GLITTERING DEEP. Mind the water: step crystal to crystal. It runs cold, and it runs deep.');
  // hero cluster with the one real budgeted light — the landmark that pulls you in
  xtal(7, 0, -0.6, 1.7, CYAN);
  const heroLight = new THREE.PointLight(0x63e6e2, 34, 12); heroLight.position.set(7, 1.7, -0.2); S.add(heroLight);
  xtal(-3.5, 0, -1.3, 0.7, VIOL); xtal(13, 0, 1.1, 0.6, GREN); xtal(18, 0, -1.4, 0.55, CYAN);
  candyLine(G, [[2,0.8,0],[5,0.8,0],[8.5,0.8,0]], 4);
  G.ents.add(new Gravemite(G, 12, 0, 0, {range:3, dir:1, speed:3.4}));   // first ground pest
  candyLine(G, [[14,0.8,0],[18,0.8,0],[22,0.8,0]], 4);
  G.ents.add(new Gravemite(G, 20, 0, 0, {range:2.6, dir:-1}));
  G.ents.add(new SwoopBat(G, 24, 3.6, 0, {range:4.5, period:3.6, phase:0.4}));   // first air lane — gentle patrol
  // FIRST STREAM (introduce the river): narrow, two stepping crystals, wadeable for a heart
  undergroundRiver(G, 28, 36, {hazard:true, d:4.2, speed:2.0});
  crystalStep(30, 1.2, 0, 2.2, ROCKC, CYAN);
  crystalStep(33.4, 1.5, 0, 2.2, ROCKV, VIOL);
  candyLine(G, [[28.4,1.4,0],[30,2.0,0],[31.5,1.7,0]], 4);
  candyLine(G, [[33.4,2.1,0],[35,1.5,0],[36.4,0.9,0]], 4);
  G.ents.add(new Checkpoint(38, 0, 1.3, 0, {noLight:true}));   // CP1 — clear of the stream (ends x36)

  // ================= BEAT 2: THE DARK POCKET (x 40..64) — the Wisp + the light =================
  DECO.add(catacombArch(43, -1.2, 1.0));       // background arch framing the descent into the dark
  signPost(G, 42, -0.3, 0.14, 'Wisps hate two things: being LOOKED at, and lantern light. Face them, or keep to the light.');
  G.ents.add(new Gravemite(G, 48, 0, 0, {range:2.6, dir:1}));
  // the district's CORE system finally becomes a real beat, not a walk-past: a ground hopper + a second
  // wisp flank the approach (D2's mandated "first combos" across lanes), and a mid-pocket relight lantern
  // (below) is the pressure valve — bloom its pool and the wisps recoil.
  G.ents.add(new CoffinHopper(G, 44, 0, 0, {range:2.5, dir:1}));            // ground lane (patrols 41.5..46.5)
  G.ents.add(new Wisp(G, 46, 1.4, 0, {range:8, speed:1.4, lunge:3.0}));    // flanks the approach alongside W@52
  // GP1 (SECRET): a low ledge up in the shadow, off the lit trail — easy to walk past
  crystalStep(47, 2.9, 0, 2.0, ROCKV, VIOL);
  candyLine(G, [[45,1.2,0],[46,2.2,0],[47,3.1,0]], 3);
  candyLine(G, [[46.7,3.5,0],[47.4,3.6,0]], 3);   // district's 3 GPs live in 2-1/2-3/2-5 — this secret ledge pays candy
  // the Wisp hunts the dark; facing it (moving in) holds it, but once you pass it stalks from behind
  G.ents.add(new Wisp(G, 52, 1.4, 0, {range:9, speed:1.4, lunge:3.0}));
  candyLine(G, [[50,0.8,0],[54,0.8,0],[58,0.8,0]], 4);
  // the mid-pocket RELIGHT (emissive pool — stays in the light budget): reach it to bloom a safe pool that
  // makes both wisps recoil, turning traversal into the intended lantern-to-lantern relight rhythm. Placed
  // PAST the GP1 secret ledge (x47) so that reward stays in the dark for the observant climber.
  w2DarkLantern(G, 55, 0, 0.7, {r:5, relightR:2.4});
  // the safe light-pool at the pocket's mouth (emissive halo/disc; no real light — stays in the light budget)
  w2Lantern(G, 61, 0, 0.7, {r:5.6, relightR:2.4});

  // ================= BEAT 3: THE CROSSING (x 64..104) — TWIST: the river at its widest =================
  G.ents.add(new Checkpoint(66, 0, 1.3, 1, {noLight:true}));   // CP2 — before the crossing
  signPost(G, 68, 1.4, -0.1, "THE CROSSING. The river's widest here. Crystals are your only road. Don't look down. There's nothing but cold.");
  undergroundRiver(G, 70, 98, {hazard:true, d:4.6, speed:2.4});
  // the road of crystal platforms — gaps ~3.4..3.8 (comfortable tap), rises <=0.7 (comparable heights)
  crystalStep(72,   1.5, 0, 2.4, ROCKC, CYAN);
  crystalStep(78.2, 2.0, 0, 2.4, ROCKV, VIOL);
  crystalStep(84.4, 1.6, 0, 2.4, ROCKG, GREN);
  crystalStep(90.6, 2.2, 0, 2.4, ROCKC, CYAN);
  crystalStep(96.4, 1.5, 0, 2.4, ROCKV, VIOL);
  candyLine(G, [[69.5,1.1,0],[71,2.0,0],[72,1.9,0]], 3);
  candyLine(G, [[72,2.1,0],[75,3.0,0],[78.2,2.4,0]], 4);
  candyLine(G, [[78.2,2.4,0],[81.3,3.1,0],[84.4,2.0,0]], 4);
  candyLine(G, [[84.4,2.0,0],[87.5,3.2,0],[90.6,2.6,0]], 4);
  candyLine(G, [[90.6,2.6,0],[93.5,2.4,0],[96.4,1.9,0]], 4);
  // HIGH LINE + GP0 (VISIBLE-BUT-TRICKY): a shelf above the crossing, one double-jump up — rich reward
  crystalStep(81, 4.0, 0, 2.6, ROCKV, VIOL);
  candyLine(G, [[84.4,2.2,0],[82.6,3.3,0],[81,4.4,0]], 3);
  candyLine(G, [[80.6,4.6,0],[81.4,4.7,0]], 4);   // high-shelf candy (GP collectibles are in 2-1/2-3/2-5)
  G.ents.add(new Heart(79.4, 4.7, 0));
  // extend the lone shelf into a real 2-hop HIGH ROAD (shelf 81 → step 87 → drop to low stone 90.6): the
  // "next run I'm going up there" itch now has a path to reward, spicier under the two air threats below.
  crystalStep(87, 4.3, 0, 2.4, ROCKG, GREN);
  candyLine(G, [[81,4.6,0],[84,5.0,0],[87,4.6,0]], 4);
  G.ents.add(new SwoopBat(G, 84, 5.4, 0, {range:4.2, period:4.0, phase:0.2}));   // HIGH air lane (y5.4)
  // LOW air lane (y3.6): a telegraphed snapshot-diver works the crossing's MIDDLE (stones 84.4/90.6) — the
  // D3 "add a lane" escalation, phase-staggered from the SwoopBat above. Home pulled to 86 so its base aggro
  // (≤x93.5) stays ~5u WEST of urn@101's open-zone — the last stone + urn approach stay calm (CLEAR-PATCH).
  G.ents.add(new DiveCrow(G, 86, 3.6, 0, {range:3, aggroR:4.5, period:4.6, phase:2.0}));

  // safe patch past the crossing — the Restless Urn (CLEAR-PATCH LAW) + the quiet prop
  const urn = new RestlessUrn(101, 0, -1.6, -0.2);   // no patrols within ~6u (nearest are x84 and x108)
  G.ents.add(urn); G.coffins.push(urn);
  G.world.addBox(101, 0, -1.6, 1.5, 1.1, 1.5, {});   // solid — you disturb it, you don't walk through it
  candyLine(G, [[99.5,0.8,0],[103,0.8,0]], 2);
  // THE QUIET PROP (never signposted): a lost crystal-miner's rest — a grave, a dark hand-lantern, a helmet,
  // a single crystal someone was reaching for. Story-readers pause; everyone else walks past.
  {
    const t = new THREE.Group();
    t.add(grave(103.5, -2.9, 0.1));
    const pole = mesh('cyl',[0.05,0.06,0.9,5], mat(W2PAL.iron)); pole.position.set(102.4,0.45,-2.9);
    const cage = mesh('box',[0.28,0.34,0.28], mat(W2PAL.iron)); cage.position.set(102.4,0.95,-2.9);
    const dead = mesh('sph',[0.11,7,6], emat(0x3a3550,0x3a3550,0.4)); dead.position.set(102.4,0.95,-2.9);   // a flame long gone out
    const helm = mesh('sph',[0.2,9,7,0,TAU,0,Math.PI/2], mat(W2PAL.stoneL)); helm.position.set(104.2,0.16,-2.75);
    const reach = mesh('cone',[0.09,0.34,5], emat(0x7dff9e,0x7dff9e,0.9)); reach.position.set(104.0,0.2,-2.4); reach.rotation.z=0.3;
    t.add(pole,cage,dead,helm,reach); DECO.add(t);
  }

  // ================= BEAT 4: THE RUSHING DEEP (x 104..150) — ESCALATE: river + bats + a moving barge =================
  G.ents.add(new Checkpoint(106, 0, 1.3, 2, {noLight:true}));   // CP3 — before the escalate
  signPost(G, 108, -0.3, 0.12, 'THE RUSHING DEEP. Bats roost where the water runs fast. Keep moving. They only dive when you dawdle.');
  G.ents.add(new Gravemite(G, 111, 0, 0, {range:2.4, dir:1, speed:4.0}));   // leftmost reach 108.6 → ≥7u clear of the urn at x101 (clear-patch law); nudged +11%
  // river R3 crossed on crystals WHILE two bats dive it (same crossing skill, now under air pressure)
  undergroundRiver(G, 110, 122, {hazard:true, d:4.4, speed:3.2});
  crystalStep(112,   1.6, 0, 2.4, ROCKC, CYAN);
  crystalStep(116.5, 2.0, 0, 2.4, ROCKV, VIOL);
  crystalStep(120.5, 1.6, 0, 2.4, ROCKG, GREN);
  candyLine(G, [[109.5,1.0,0],[111,1.9,0],[112,1.9,0]], 3);
  candyLine(G, [[112,2.1,0],[114.3,2.8,0],[116.5,2.4,0]], 4);
  candyLine(G, [[116.5,2.4,0],[118.5,2.1,0],[120.5,1.9,0]], 3);
  G.ents.add(new SwoopBat(G, 114, 3.4, 0, {range:4.0, period:3.0, phase:0.0}));   // snapshot dives — sidestep on the stones (tighter dive cadence)
  G.ents.add(new SwoopBat(G, 118, 4.0, 0, {range:4.0, period:3.4, phase:1.3}));
  // THE BARGE (D2 "moving platform over a hazard"): a crystal ferry shuttling the true chasm (x124..131),
  // fixed clock from level start, kissing both ledges (period 4.5s). Miss = 1 heart + walk back to CP3.
  const barge = ()=>{
    const g = new THREE.Group();
    const deck = mesh('box',[2.6,0.5,2.6], mat(ROCKC)); deck.position.y=0.25;
    const rim  = mesh('box',[2.8,0.12,2.8], emat(0x2a5a70,0x1c3a4a,0.4)); rim.position.y=0.5;
    for(const wx of [-0.8,0.8]){ const cr = mesh('cone',[0.12,0.5,5], emat(0x63e6e2,0x63e6e2,0.9)); cr.position.set(wx,0.75,-0.9); cr.rotation.z=rand(-0.2,0.2); g.add(cr); }
    g.add(deck, rim); S.add(g); return g;
  };
  G.world.addMover(2.6, 0.5, 2.6, t=>new THREE.Vector3(lerp(125.5,129.5, 0.5+0.5*Math.sin(t*TAU/4.5)), 1.1, 0), barge);
  candyLine(G, [[124,1.0,0],[125.5,1.9,0]], 2);
  candyLine(G, [[129.5,1.9,0],[131,1.0,0]], 2);
  // GP2 (SKILL-GATED): a ledge stranded over the chasm — only a double-jump from the barge's apex reaches it
  crystalStep(127.5, 4.0, 0, 2.0, ROCKV, VIOL);
  candyLine(G, [[126.6,2.6,0],[127.5,3.4,0],[127.5,4.4,0]], 3);
  candyLine(G, [[127.1,4.6,0],[127.9,4.7,0]], 4);   // barge-ledge candy reward (district GPs are in 2-1/2-3/2-5)
  // the tail up to the Roost
  candyLine(G, [[132,0.8,0],[136,0.8,0],[140,0.8,0]], 4);
  G.ents.add(new Gravemite(G, 136, 0, 0, {range:3, dir:-1}));
  // AIRBORNE CASTER — the escalation ramp INTO the Roost: a floating skull-witch hovering over the open tail
  // floor (solid 131..197), lobbing a slow arcing violet bolt at a SNAPSHOT of the player (one sidestep beats
  // it — never homing). RUN PAST (into the Roost, x>145) to shut it off, or STOMP it (hp2). Its own high lane,
  // ~3u clear of the Gravemite's ground patrol (133..139). It fires only at players to its LEFT, so respawning
  // at CP4 (x150, to its right) never drops you under its fire; CP3 is 37u back. Deterministic clock.
  G.ents.add(new AirborneCaster(G, 143, 4.2, 0, {aggroR:9, arcX:1.3, arcY:0.35, period:3.2, tele:0.65, firstCast:1.4, hp:2}));
  candyLine(G, [[143,0.8,0],[147,0.8,0]], 3);

  // ================= BEAT 5: THE ROOST (x 150..192) — MASTER: THE BAT BOMBARDMENT, then the gate =================
  G.ents.add(new Checkpoint(150, 0, 1.3, 3));   // CP4 — before the gauntlet (this one keeps its real light: a beacon)
  G.ents.add(new BonkLantern(G, 146, 1.5, 0, 'shield'));   // a shield offered before the storm
  G.ents.add(new Heart(148, 1.0, 0));
  signPost(G, 152, 1.5, -0.1, 'THE ROOST. When the ceiling shudders, MOVE. The floor between the marks is yours. Take it and don\'t stop.');
  DECO.add(catacombArch(151.5, -1.2, 1.05));
  // 3-4 ground threats so you can never camp a safe spot while the sky rains
  G.ents.add(new Gravemite(G, 160, 0, 0, {range:3, dir:1}));
  G.ents.add(new CoffinHopper(G, 172, 0, 0, {range:3, dir:-1}));   // variety under the bat-rain: a telegraphed free-stomp beat amid 8 identical gravemites
  G.ents.add(new Boo(G, 178, 0, 0, {speed:2.0, range:8}));       // creeps while your eyes are on the ceiling
  G.ents.add(new Gravemite(G, 185, 0, 0, {range:2.5, dir:1}));
  candyLine(G, [[156,0.8,0],[170,0.8,0]], 8);    // the trail threads the safe rhythm forward
  candyLine(G, [[176,0.8,0],[188,0.8,0]], 5);

  // ---- THE BAT BOMBARDMENT (x ~156..186) — a fixed clock from level start (the D2 owner archetype) ----
  // Two offset 3-drop sweeps per 8s cycle: sweep B lands in sweep A's safe pockets, so the safe lanes
  // WALK FORWARD as you dodge. Each drop is telegraphed 0.7s ahead by a growing ground ring + the ceiling
  // crack lighting up and dribbling dust, THEN a bat dives to the mark and bursts (1 heart, i-frames make
  // repeats fair, knockback always points away). At most ~2 bats airborne at once — SNES-Mario, not bullet-hell.
  {
    const GCEN = 171, CEIL = 7.4;
    const VOLLEY = [
      [0.8, 158], [1.9, 168], [3.0, 178],    // sweep A
      [4.5, 163], [5.6, 173], [6.7, 183],    // sweep B — fills A's gaps
    ];
    const PERIOD = 8.0, TEL = 0.7, FLIGHT = 0.6;
    const bomb = { group:new THREE.Group(), dead:false, cull:false, t:0, slots:[] };
    for(const [vt, vx] of VOLLEY){
      const ring = new THREE.Mesh(geo('circ',1.15,20), new THREE.MeshBasicMaterial({color:0xff3a6e, transparent:true, opacity:0, side:THREE.DoubleSide}));
      ring.rotation.x = -Math.PI/2; ring.position.set(vx, 0.07, 0); ring.visible = false;
      const crackMat = new THREE.MeshLambertMaterial({color:0x201a34, emissive:0xb37dff, emissiveIntensity:0});   // OWN material — per-crack glow
      const crack = new THREE.Mesh(geo('sph',0.55,7,6), crackMat); crack.position.set(vx, CEIL, -0.8); crack.scale.set(1.7,0.5,1);
      // the diving bat (dark, emissive-lifted so it reads against the ceiling)
      const bg = new THREE.Group();
      const body = mesh('sph',[0.34,8,7], emat(0x3a2f5e, 0x8a72c0, 0.6)); body.scale.set(1,0.85,0.8);
      const eL = mesh('sph',[0.06,6,6], emat(0xffd34d,0xffd34d,1)); eL.position.set(-0.11,0.05,0.24);
      const eR = eL.clone(); eR.position.x = 0.11;
      const wL = mesh('box',[0.6,0.05,0.34], emat(0x4a3d78,0x2a2050,0.5)); wL.position.x = -0.42;
      const wR = wL.clone(); wR.position.x = 0.42;
      bg.add(body, eL, eR, wL, wR); bg.visible = false;
      bomb.group.add(ring, crack, bg);
      bomb.slots.push({ vt, vx, ring, crackMat, bg, wL, wR, whistled:false });
    }
    bomb.update = function(dt){
      const prev = this.t % PERIOD;
      this.t += dt;
      const ph = this.t % PERIOD;
      const pl = G.player;
      const near = pl && Math.abs(pl.pos.x - GCEN) < 26;   // presentation gate only — the clock never stops
      for(const s of this.slots){
        // TELEGRAPH — the mark grows on the floor, the crack ignites and sheds dust
        if(ph >= s.vt - TEL && ph < s.vt){
          const u = (ph - (s.vt - TEL)) / TEL;
          s.ring.visible = true;
          s.ring.material.opacity = 0.2 + 0.55*u + Math.sin(this.t*22)*0.07;
          s.ring.scale.setScalar(0.4 + 0.7*u);
          s.crackMat.emissiveIntensity = 0.3 + 1.0*u;
          if(near && Math.random() < 0.28) G.fx.spawn(new THREE.Vector3(s.vx+rand(-0.3,0.3), CEIL-0.4, -0.6), 0xcfc9e6, 1, {speed:1.4, life:0.5, gravity:2, size:0.6});
        } else {
          s.ring.visible = false;
          s.crackMat.emissiveIntensity = damp(s.crackMat.emissiveIntensity, 0, 6, dt);
        }
        // THE DIVE — from the crack down to the mark
        if(ph >= s.vt - FLIGHT && ph < s.vt){
          const u = (ph - (s.vt - FLIGHT)) / FLIGHT;
          s.bg.visible = true;
          s.bg.position.set(s.vx, (CEIL-0.7) - (CEIL-0.7-0.4)*u*u, lerp(-0.8, 0, u));
          const f = Math.sin(this.t*26)*0.9; s.wL.rotation.z = f; s.wR.rotation.z = -f;
          if(!s.whistled){ s.whistled = true; if(near) AUDIO.noise({t:0.16, vol:0.14, fFrom:1700, fTo:900}); }   // the squeak IS the warning
        } else if(ph >= s.vt && ph < s.vt + 0.45){
          // peel back up out of frame after striking
          const u = (ph - s.vt) / 0.45;
          s.bg.visible = true;
          s.bg.position.y = 0.4 + (CEIL - 0.4)*u*u;
          const f = Math.sin(this.t*22)*0.9; s.wL.rotation.z = f; s.wR.rotation.z = -f;
        } else {
          s.bg.visible = false;
          if(ph < s.vt - FLIGHT) s.whistled = false;
        }
        // IMPACT
        if(prev < s.vt && ph >= s.vt){
          const ip = new THREE.Vector3(s.vx, 0.2, 0);
          if(near){
            G.fx.spawn(ip, 0xb37dff, 12, {speed:4, life:0.4});
            G.fx.spawn(ip, 0xcfc9e6, 8, {speed:3, life:0.5});
            AUDIO.noise({t:0.2, vol:0.16, fFrom:700, fTo:90});
            G.camc.shake(0.12, 0.16);
          }
          if(pl && !pl.dead && Math.abs(pl.pos.x - s.vx) < 1.35 && Math.abs(pl.pos.z) < 1.9 && pl.pos.y < 1.3){
            pl.damage(1, new THREE.Vector3(s.vx - (pl.pos.x >= s.vx ? 0.5 : -0.5), 0, 0));   // knockback always points away
          }
        }
      }
    };
    G.ents.add(bomb);
  }

  signPost(G, 189, 1.5, 0.1, 'The deep opens ahead. The light you carry now is your own.');

  // ================= foreground/background catacomb silhouettes + ambient life =================
  // stalactites hang at background depth; stalagmites rise as foreground frames — held off lane & hazards
  for(const [x1,x2] of [[-6,26],[38,68],[99,109],[132,194]]){
    for(let x=x1; x<x2; x+=rand(3.5,6)){
      DECO.add(stalactite(x, 8.4+rand(-0.4,0.9), rand(0.7,1.2), -3.6+rand(-0.6,0.6)));
      if(rand()<0.6) DECO.add(stalagmite(x+rand(-1,1), rand(0.7,1.2), (rand()<0.5?-1:1)*rand(3.0,3.6)));
    }
  }
  DECO.add(bonePile(16, -3.0)); DECO.add(bonePile(58, 3.0)); DECO.add(bonePile(141, -3.1)); DECO.add(bonePile(182, 3.0));
  S.add(bakeGroup(DECO));
  S.add(bakeGroup(CDECO));
  // reactive ambient critters (cave ravens) — flap off when approached, at background depth
  G.ents.add(new Crow(31, 0.95, -2.9));
  G.ents.add(new Crow(140, 0.95, 2.9));

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 124, 131, 'grave');   // the barge chasm

  exitGate(G, 195);
  // D2 ambience tail (cave motes + drifting bats + Ravenmoor backdrop) — pass null, clutter placed manually
  w2LevelFinish(G, -12, 202, 'cave', null);
  // catacomb clutter on the DRY strips only (never over the rivers 28-36 / 70-98 / 110-122 or the chasm 124-131)
  w2Clutter(G, -8, 27, 'catacomb');
  w2Clutter(G, 37, 69, 'catacomb');
  w2Clutter(G, 98, 109, 'catacomb');
  w2Clutter(G, 131, 194, 'catacomb');

  return {spawnX: 0, exitX: 195};
}

function updateW2L4(G, dt){
  updateLevelCommon(G, dt);   // bats, ambience, coffin/urn + sign prompts; the bombardment runs as an ents entity
}

W2_LEVELS.push({ id:'w2l4', district:'w2', name:'THE GLITTERING DEEP', build:buildW2L4, update:updateW2L4, parTime:160 });

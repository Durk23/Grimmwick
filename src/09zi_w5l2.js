// ============ LEVEL 5-2 — THE GEARWORKS (District 5 · The Cursed Castle) ============
// The Keep's guts: a grinding hall of frozen-then-turning cogs strung over black machine-pits, with the
// clockwork's great PENDULUM BLADES sweeping the gaps. This is the district's TIMING GAUNTLET and the
// mastery-exam tier: you cross on GEAR PLATFORMS (some fixed, some ferrying on a shared clock) while reading
// the steady, learnable swing of the blades — the swing IS the telegraph, a graze only costs a heart, never a
// one-shot. Full introduce->twist->escalate->master on the gear+blade timing:
//   BEAT 1 THE FOUNDRY FLOOR (INTRODUCE)  x -8..34  — re-teach the Keep: a Clockwork Knight to relearn the BOW
//          telegraph, the first standable cog, the first lone blade sweeping over solid ground (safe to learn).
//   BEAT 2 THE FIRST COGWAY (INTRODUCE)   x 34..58  — the floor gives out: a line of fixed cogs over the pit,
//          one blade to time mid-crossing, a Mirror Boo drifting the lane, then a rest ledge + the GRIMM GIFT.
//   BEAT 3 THE PENDULUM ROW (TWIST)       x 58..90  — FOUR blades on staggered phases rippling over a cog run:
//          the LOW road threads beneath them; a clock-chain climbs to the HIGH road (a Heart + Bat Wings + candy
//          over the low line, in plain sight overhead). Both rejoin at CP1, the level's one lit mid checkpoint.
//   BEAT 4 THE MOVING GEARS (ESCALATE)    x 90..122 — cogs that TRAVEL now: vertical bobbers + a horizontal
//          ferry on fixed clocks, blades between them, a Mirror Boo over the ferry, ending on a reward bay.
//   BEAT 5 THE GREAT GEARWORKS (MASTER)   x 122..178 — everything at once: fixed + ferrying cogs + blades, then
//          you drop to the ASSEMBLY FLOOR where a Knight, three Shadow-Copy chasers and a Swoop Bat close in
//          (the bombardment archetype: ground pressure + a diving sky lane) on the run to the throneward gate.
// Reads UNMISTAKABLY the Cursed Castle: W5PAL gunmetal masonry + verdigris brass cogs, clock-cream faces, cold
// shadow-purple, the one warm ember accent; near cog-teeth/pendulum silhouettes, a stopped clock-tower skyline,
// clock-soot drift + cold ember-sparks. Structured chaos over three lanes (ground Knights/Shadows · air Boos/
// Bats · the blade lane) — 10 enemies + a staggered blade gauntlet, every element on a fixed clock and telegraphed
// ~0.7s. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; cog gaps <=4; every blade graze is a
// heart, never a kill; the one big rise is a GATED clock-chain climb). Deterministic to the tooth — fixed
// placements, fixed swing/ferry clocks from level start; seeded rand() only inside baked cosmetic deco. GP: NONE
// (the high road pays a Heart + candy over the low line). NO Old Shortcut warp (that lives in 5-4).

// ---- a MOVING GEAR: a standable brass cog carried on a fixed clock (deterministic), spinning cosmetically. Uses
// the physics mover (carries the player like a platform); a light spin-ticker turns the visible cog. baseY is the
// STANDABLE-TOP rest height; amp = vertical travel, hamp = horizontal ferry travel (either/both), all on period. ----
function w5l2MovingGear(G, opts){
  const x=opts.x, baseY=opts.baseY, amp=opts.amp||0, hamp=opts.hamp||0;
  const period=opts.period||3.4, phase=opts.phase||0, w=opts.w||2.4, d=opts.d||3, col=opts.col||W5PAL.brass;
  const factory = ()=>{
    const g = new THREE.Group();
    const disc = mesh('cyl',[w*0.5, w*0.5, 0.4, 16], mat(col)); disc.rotation.x=Math.PI/2; disc.position.y=0.3; g.add(disc);
    const gear = bakeGroup(cogMesh(w*0.62, W5PAL.brassD)); gear.matrixAutoUpdate = true; gear.position.y=0.05; g.add(gear);   // one draw call per cog
    G.scene.add(g); return g;
  };
  const wob = TAU/period;
  const mv = G.world.addMover(w, 0.5, d, t=>new THREE.Vector3(
      x + (hamp ? Math.sin(t*wob + phase)*hamp : 0),
      baseY + (amp ? Math.sin(t*wob + phase)*amp : 0),
      0), factory);
  // cosmetic spin-ticker (the ferry/bob is deterministic in the mover; this only turns the visible cog)
  G.ents.add({ dead:false, cull:false, group:null, _g:mv.mesh, _s:opts.spin!==undefined?opts.spin:1.3,
    update(dt){ if(this._g && this._g.children[1]) this._g.children[1].rotation.z += this._s*dt; } });
  return mv;
}

// ---- COG-MOUSE: the level's reactive ambient critter. A tin field-mouse with little brass-cog ears that sniffs
// about the floor until Pip nears, then SCURRIES into a gear-hole and vanishes below (cosmetic; never a threat). ----
class W5CogMouse {
  constructor(x, z, holeX){
    this.group = new THREE.Group();
    const tinM = mat(W5PAL.steelD);
    const body = mesh('sph',[0.14,8,6], tinM); body.scale.set(1,0.8,1.5);
    const head = mesh('sph',[0.09,7,6], tinM); head.position.set(0,0.03,0.16);
    const earL = cogMesh(0.06, W5PAL.brass); earL.position.set(-0.07,0.12,0.02); earL.scale.setScalar(0.9);
    const earR = cogMesh(0.06, W5PAL.brass); earR.position.set(0.07,0.12,0.02); earR.scale.setScalar(0.9);
    const eye = mesh('sph',[0.022,5,4], emat(W5PAL.ember,W5PAL.ember,1)); eye.position.set(0.05,0.05,0.22);
    const tail = mesh('cyl',[0.012,0.02,0.32,4], tinM); tail.rotation.z=1.15; tail.position.set(0,0.01,-0.22);
    this.group.add(body, head, earL, earR, eye, tail);
    this.group.position.set(x, 0.14, z);
    this.state='idle'; this.t=rand(0,5); this.dead=false; this.cull=false; this.holeX=holeX; this.z=z;
  }
  update(dt, G){
    this.t += dt; const p = this.group.position, pl = G.player;
    if(this.state==='idle'){
      this.group.rotation.y = Math.sin(this.t*3)*0.4;                       // twitchy sniffing
      p.y = 0.14 + Math.abs(Math.sin(this.t*6))*0.015;
      if(pl && Math.abs(pl.pos.x-p.x)<3.4 && Math.abs(pl.pos.z-p.z)<3){
        this.state='scurry'; AUDIO.tone && AUDIO.tone({f:900,f2:1300,type:'square',t:0.08,vol:0.05});
      }
    } else if(this.state==='scurry'){
      const dx = this.holeX - p.x;
      p.x += Math.sign(dx)*6*dt;
      this.group.rotation.y = dx>0 ? Math.PI/2 : -Math.PI/2;
      p.y = 0.14 + Math.abs(Math.sin(this.t*22))*0.05;                      // scampering bob
      if(Math.abs(dx)<0.3) this.state='hide';
    } else {                                                                // dive into the gear-hole
      const s = Math.max(0.02, this.group.scale.x - dt*2.2); this.group.scale.setScalar(s);
      p.y = damp(p.y, -0.35, 6, dt);
      if(s<=0.06) this.dead=true;
    }
  }
}

function buildW5L2(G){
  const S = G.scene;
  levelBegin(G);

  // palette handles for this course
  const FLOOR = W5PAL.stone;    // gunmetal masonry ground
  const LEDGE = W5PAL.steel;    // cog-tooth steel landing ledges
  const BAY   = W5PAL.steelL;   // brighter reward-bay steel

  const deco = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE FOUNDRY FLOOR (x -8..34): INTRODUCE ===============================
  groundX(G, -8, 34, FLOOR);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));               // CP0 — start
  signPost(G, 4, 1.7, -0.12, "THE GEARWORKS. Every clock in the Keep is stopped - so the machine runs on YOU. Ride the cogs, and read the blades: they swing slow and true. Wait for the sweep, then run.");
  // the reactive critter: a cog-mouse that scurries into a floor gear-hole when neared
  G.ents.add(new W5CogMouse(8, 1.9, 11));
  // CLOCKWORK KNIGHT #1 — relearn the courtly BOW telegraph (the bow always gives you the out)
  G.ents.add(new ClockworkKnight(G, 15, 0, 0, {phase:0.0, range:2.4, wakeR:4.5}));
  candyLine(G, [[6,0.9,0],[9,0.9,0]], 3);
  candyLine(G, [[18,0.9,0],[21,0.9,0]], 2);
  gearPlat(G, 24, 1.3, {});                                               // the first standable cog (a raised step — learn to stand on it)
  candyLine(G, [[23,2.0,0],[25,2.0,0]], 2);
  // the first PENDULUM BLADE — over SOLID ground, so a mistimed run only costs a heart (introduce the timing)
  G.ents.add(new PendulumBlade(G, 28, 4.2, {len:3.3, amp:0.9, period:2.6, phase:0.0, r:0.55}));
  candyLine(G, [[26,0.9,0],[30,0.9,0]], 3);                              // the lure through the blade's low point
  signPost(G, 32, 1.7, 0.1, "The floor ends at the machine-pits. From here you cross on the cogs alone - one slip is a long way down. Time everything.");

  // =============================== BEAT 2 — THE FIRST COGWAY (x 34..58): INTRODUCE cog traversal over the pit ===============================
  // fixed cogs stepping over the machine-pit (a fall = a heart + the walk back to CP0 — the Keep is unforgiving).
  gearPlat(G, 38, 1.5, {});
  gearPlat(G, 42, 2.0, {});
  gearPlat(G, 46, 1.7, {});
  gearPlat(G, 50, 2.1, {});
  gearPlat(G, 54, 1.6, {});
  candyLine(G, [[36,2.0,0],[38,2.1,0]], 2); candyLine(G, [[40,2.5,0],[42,2.6,0]], 2);
  candyLine(G, [[44,2.3,0],[46,2.3,0]], 2); candyLine(G, [[48,2.7,0],[50,2.7,0]], 2);
  candyLine(G, [[52,2.2,0],[54,2.2,0]], 2);
  // one blade to time mid-crossing (over cog 46, top 1.7)
  G.ents.add(new PendulumBlade(G, 46, 5.0, {len:3.0, amp:0.85, period:2.8, phase:0.4, r:0.55}));
  // a MIRROR BOO drifting the lane (feint it — it slides to the side you DON'T approach from); leashed well clear of the gift
  G.ents.add(new MirrorBoo(G, 48, 4.2, 0, {range:3.5, mirror:0.8, phase:0.0}));
  // the rest ledge + the GRIMM GIFT — a CLEAR pocket (nearest patrol reach ~6.5u away; the gamble is a safe choice, never a cheap hit)
  platform(G, 59, 2.0, 0, 8, 3.4, LEDGE);                                // spans 55..63 — REACHES the chain@63, so you grab the vine from solid footing (no void-jump), and the low-road hop to gearPlat@66 shrinks to ~1.8u
  { const gift = new GrimmGift(58, 2.0, 1.1, -0.3); G.coffins.push(gift); G.ents.add(gift); }
  candyLine(G, [[56,2.6,0],[58,2.5,0]], 2);

  // =============================== BEAT 3 — THE PENDULUM ROW (x 58..90): TWIST — the staggered blade gauntlet + high/low split ===============================
  // FOUR blades on staggered phases ripple a wave across the cog run. The LOW road threads beneath; a CLOCK-CHAIN
  // climbs to the HIGH road (a Heart + Bat Wings + more candy, in plain sight overhead — the itch to go up next run).
  w5Chain(G, 63, 2.0, 6.2);                                              // the gated way up to the high road
  candyLine(G, [[63,3.3,0],[63,4.6,0],[63,5.9,0]], 3);                  // the quiet lure up the chain
  // LOW ROAD — fixed cogs beneath the blade wave
  gearPlat(G, 66, 1.6, {}); gearPlat(G, 70, 1.6, {}); gearPlat(G, 74, 1.6, {}); gearPlat(G, 78, 1.6, {}); gearPlat(G, 82, 1.6, {});
  candyLine(G, [[64,2.1,0],[66,1.9,0]], 2); candyLine(G, [[68,2.0,0],[72,2.0,0]], 3); candyLine(G, [[76,2.0,0],[80,2.0,0]], 3);
  // the staggered blade row (identical clocks, phase-offset — a learnable rolling wave; grazes cost a heart only)
  G.ents.add(new PendulumBlade(G, 70, 4.9, {len:3.0, amp:0.85, period:2.4, phase:0.0, r:0.55}));
  G.ents.add(new PendulumBlade(G, 74, 4.9, {len:3.0, amp:0.85, period:2.4, phase:0.6, r:0.55}));
  G.ents.add(new PendulumBlade(G, 78, 4.9, {len:3.0, amp:0.85, period:2.4, phase:1.2, r:0.55}));
  G.ents.add(new PendulumBlade(G, 82, 4.9, {len:3.0, amp:0.85, period:2.4, phase:1.8, r:0.55}));
  // HIGH ROAD — an elevated cog line with the reward, crossing IN SIGHT above the low line
  gearPlat(G, 66, 5.0, {col:W5PAL.verd}); gearPlat(G, 70, 5.0, {col:W5PAL.verd}); gearPlat(G, 74, 5.0, {col:W5PAL.verd}); gearPlat(G, 78, 5.0, {col:W5PAL.verd});   // high row pulled left so the leap OFF the chain@63 is ~1.8u, not 5u
  G.ents.add(new Heart(72, 5.9, 0));                                     // the high-road Heart the low road sees overhead
  G.ents.add(new BonkLantern(G, 74, 5.7, 0, 'bat'));                     // Bat Wings tucked on the high line (route reward)
  G.ents.add(new PendulumBlade(G, 74, 8.3, {len:3.0, amp:0.85, period:2.6, phase:0.5, r:0.55}));  // one blade for the high road too
  candyLine(G, [[68,5.5,0],[70,5.7,0]], 2); candyLine(G, [[72,6.1,0],[74,6.1,0]], 2); candyLine(G, [[76,5.9,0],[80,5.6,0]], 3);
  gearPlat(G, 84, 3.4, {col:W5PAL.verd});                               // high-road step-down toward the rejoin
  // SWOOP BAT #1 — the air lane diving over the row (fixed patrol, squeak-telegraphed snapshot dive)
  G.ents.add(new SwoopBat(G, 76, 8.2, 0, {phase:0.2, range:4, period:3.2, aggroR:5}));
  // both roads rejoin here
  platform(G, 86, 2.2, 0, 5, 3, LEDGE);                                 // spans 83.5..88.5
  G.ents.add(new ClockworkKnight(G, 87, 2.2, 0, {phase:0.5, range:1.4, wakeR:4}));  // a knight guarding the rejoin (tight range — stays on the ledge)
  G.ents.add(new Checkpoint(88, 2.2, 1.7, 1));                          // CP1 — LIT, the level's one mid checkpoint

  // =============================== BEAT 4 — THE MOVING GEARS (x 90..122): ESCALATE — cogs that travel ===============================
  gearPlat(G, 90, 2.2, {});                                             // fixed entry cog
  w5l2MovingGear(G, {x:94, baseY:2.2, amp:1.1, period:3.0, phase:0.0}); // vertical bobber — board it near mid-rise
  gearPlat(G, 98, 2.4, {});
  G.ents.add(new PendulumBlade(G, 98, 5.4, {len:3.0, amp:0.8, period:2.6, phase:0.3, r:0.55}));
  w5l2MovingGear(G, {x:102, baseY:2.2, hamp:3.0, period:4.0, phase:0.0}); // horizontal FERRY — ride it across the wide gap
  gearPlat(G, 108, 2.2, {});
  G.ents.add(new PendulumBlade(G, 108, 5.4, {len:3.0, amp:0.8, period:2.6, phase:1.0, r:0.55}));
  w5l2MovingGear(G, {x:112, baseY:2.4, amp:1.2, period:3.2, phase:1.0}); // second vertical bobber
  // MIRROR BOO #2 hovering over the ferry lane
  G.ents.add(new MirrorBoo(G, 104, 5.0, 0, {range:4, mirror:0.8, phase:0.5}));
  candyLine(G, [[90,2.9,0],[94,3.0,0]], 3); candyLine(G, [[98,3.1,0],[102,3.0,0]], 3); candyLine(G, [[108,2.9,0],[112,3.1,0]], 3);
  // the reward BAY — a wide rest ledge with a Gummy Shield before the final gauntlet
  platform(G, 118, 2.4, 0, 6, 3.4, BAY);                               // spans 115..121
  G.ents.add(new BonkLantern(G, 119, 3.6, 0, 'shield'));               // armor up for the master beat
  candyLine(G, [[116,3.0,0],[120,3.0,0]], 3);

  // =============================== BEAT 5 — THE GREAT GEARWORKS (x 122..178): MASTER — everything, then the assembly-floor melee ===============================
  gearPlat(G, 126, 2.0, {}); gearPlat(G, 130, 2.3, {});
  G.ents.add(new PendulumBlade(G, 130, 5.2, {len:3.0, amp:0.85, period:2.4, phase:0.2, r:0.55}));
  w5l2MovingGear(G, {x:134, baseY:2.2, hamp:3.2, period:3.6, phase:0.5}); // the last ferry
  gearPlat(G, 140, 2.1, {}); gearPlat(G, 144, 2.4, {});
  G.ents.add(new PendulumBlade(G, 144, 5.4, {len:3.0, amp:0.85, period:2.4, phase:1.1, r:0.55}));
  gearPlat(G, 148, 1.9, {});                                            // last cog — steps down to the assembly floor
  candyLine(G, [[126,2.9,0],[130,3.0,0]], 3); candyLine(G, [[140,2.9,0],[144,3.1,0]], 3);
  candyLine(G, [[146,2.5,0],[148,2.3,0]], 2);
  // THE ASSEMBLY FLOOR — solid ground for the fight (the bombardment archetype: ground pressure + a diving sky lane)
  groundX(G, 150, 178, FLOOR);
  candyLine(G, [[151,0.9,0],[155,0.9,0]], 3);
  G.ents.add(new ClockworkKnight(G, 158, 0, 0, {phase:0.3, range:2.6, wakeR:5}));   // KNIGHT #3
  G.ents.add(new ShadowCopy(G, 154, 0, 0, {phase:0.0, speed:2.4}));                 // three Shadow-Copies close in on the floor
  G.ents.add(new ShadowCopy(G, 160, 0, 0, {phase:0.5, speed:2.6}));
  G.ents.add(new ShadowCopy(G, 166, 0, 0, {phase:1.0, speed:2.4}));
  G.ents.add(new SwoopBat(G, 160, 4.5, 0, {phase:0.5, range:5, period:3.0, aggroR:6}));  // SWOOP BAT #2 — the sky lane over the melee
  candyLine(G, [[162,0.9,0],[165,0.9,0]], 3);
  G.ents.add(new W5CogMouse(153, 2.0, 156));                            // a second cog-mouse scurries off as the fight opens (life on the floor)

  exitGate(G, 172);

  // =============================== THE QUIET PROP (never signposted) ===============================
  // A clockmaker's bench, left mid-assembly: a half-built wind-up toy - a tin mouse with its side panel open on a
  // single bright cog, a brass key waiting in its back - and the dropped screwdriver and spring beside it. Someone
  // was making a child a toy the night the clocks stopped, and set the tools down for a moment that never ended.
  { const q = new THREE.Group();
    const woodM = mat(W5PAL.brassD), tinM = emat(W5PAL.steelL,W5PAL.steel,0.2), brassM = mat(W5PAL.brass);
    const benchTop = mesh('box',[1.3,0.1,0.7], woodM); benchTop.position.set(0,0.55,0); q.add(benchTop);
    for(const [lx,lz] of [[-0.52,0.26],[0.52,0.26],[-0.52,-0.26],[0.52,-0.26]]){ const lg=mesh('cyl',[0.05,0.05,0.55,5], woodM); lg.position.set(lx,0.28,lz); q.add(lg); }
    const bodyT = mesh('box',[0.3,0.36,0.24], tinM); bodyT.position.set(-0.12,0.82,0);          // the toy mouse body
    const headT = mesh('sph',[0.14,8,7], tinM); headT.position.set(-0.12,1.06,0.05);
    const earT  = mesh('cyl',[0.06,0.06,0.02,10], brassM); earT.position.set(-0.02,1.18,0.05);  // one brass-cog ear on
    const inner = cogMesh(0.11, W5PAL.brass); inner.position.set(-0.02,0.82,0.14);               // the exposed gear in the open panel
    const key   = mesh('tor',[0.08,0.02,4,10], brassM); key.position.set(-0.3,0.86,0); key.rotation.y=Math.PI/2;   // the wind-up key
    const keyStem = mesh('cyl',[0.02,0.02,0.14,5], brassM); keyStem.rotation.z=Math.PI/2; keyStem.position.set(-0.24,0.86,0);
    const driver = mesh('cyl',[0.02,0.02,0.24,5], mat(W5PAL.steelL)); driver.rotation.z=1.35; driver.position.set(0.34,0.62,0.12);  // dropped screwdriver
    const grip   = mesh('cyl',[0.035,0.035,0.08,6], mat(W5PAL.shadowL)); grip.rotation.z=1.35; grip.position.set(0.42,0.65,0.12);
    const spring = mesh('cyl',[0.05,0.05,0.12,6], brassM); spring.position.set(0.18,0.62,-0.16);                    // a loose spring
    const bit    = cogMesh(0.07, W5PAL.steelD); bit.position.set(0.02,0.61,-0.2); bit.rotation.x=Math.PI/2;
    q.add(bodyT, headT, earT, inner, key, keyStem, driver, grip, spring, bit);
    q.position.set(168, 0, 1.7); q.rotation.y=-0.4; deco.add(q); }

  // =============================== DECO · FOREGROUND · DEEP VOID · MOON · PARALLAX ===============================
  // background masonry & clockwork (baked): broken pillars, wall clock-faces, hanging chandeliers
  deco.add(brokenPillar(-4, -5, 1.2)); deco.add(brokenPillar(30, -5.5, 1.4));
  deco.add(brokenPillar(90, -5, 1.1)); deco.add(brokenPillar(150, -5.5, 1.3)); deco.add(brokenPillar(176, -5, 1.2));
  deco.add(clockFaceDeco(20, 5.4, -6, 1.3)); deco.add(clockFaceDeco(112, 6.0, -6.5, 1.5)); deco.add(clockFaceDeco(164, 5.2, -6, 1.2));
  deco.add(chandelier(46, 8.5, -4.5, 1.1)); deco.add(chandelier(104, 9.0, -4.5, 1.2)); deco.add(chandelier(160, 8.0, -4.5, 1.0));
  // the cog-mouse's gear-holes: half-buried floor cogs at each mouse's hole-x
  { const h1 = cogMesh(0.4, W5PAL.steelD); h1.position.set(11, 0.1, 1.9); h1.rotation.x=Math.PI/2; deco.add(h1);
    const h2 = cogMesh(0.4, W5PAL.steelD); h2.position.set(156, 0.1, 2.0); h2.rotation.x=Math.PI/2; deco.add(h2); }
  // FOREGROUND silhouettes (z>0) — cog-teeth and pillars framing the ends for depth
  deco.add(brokenPillar(27, 3.4, 1.6)); deco.add(brokenPillar(151, 3.5, 1.7));
  { const fc1 = cogMesh(1.1, 0x14121e); fc1.position.set(-2, 1.4, 4.2); deco.add(fc1);
    const fc2 = cogMesh(1.3, 0x14121e); fc2.position.set(174, 1.6, 4.4); deco.add(fc2); }
  S.add(bakeGroup(deco));

  // DEEP VOID — great slow cogs sunk far below the whole cogway (the "don't fall" read under the crossings)
  { const deep = new THREE.Group();
    for(const [x,z] of [[40,-1.2],[52,1.0],[74,-1.4],[100,1.2],[130,-1.2],[142,1.4]]) { const c=cogMesh(rand(1.8,2.8), 0x1a1826); c.position.set(x, 0, z); deep.add(c); }
    deep.position.y = -9; S.add(bakeGroup(deep)); }

  // a cold stopped moon-clock low behind the towers
  const moon = mesh('circ',[4.6,28], emat(W5PAL.cream,0xd8d0f0,0.7)); moon.position.set(96,15,-30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',7.5,28), new THREE.MeshBasicMaterial({color:W5PAL.shadowP, transparent:true, opacity:0.1, depthWrite:false}));
  moonH.position.set(96,15,-30.2); S.add(moonH);

  // three-depth Cursed-Castle skyline (near cog-teeth/pendulums · stopped clock-tower ramparts + Grimm's Keep · far spires)
  w5Parallax(S, -8, 180);

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 34, 55, 'castle');
  pitDressing(G, 63, 83.5, 'castle');
  pitDressing(G, 88.5, 115, 'castle');
  pitDressing(G, 121, 150, 'castle');

  // exit + the D5 tail. clutter placed manually on the two GROUND spans only (the middle is all pit/cog)
  w5LevelFinish(G, -8, 180, null);
  w5Clutter(G, -8, 34, 'castle');
  w5Clutter(G, 150, 178, 'castle');

  return {spawnX: 0, exitX: 172};
}

function updateW5L2(G, dt){
  updateLevelCommon(G, dt);
  // bespoke ticking: the gears (spin-tickers), the pendulum blades, the ferries (physics movers), the Mirror Boos
  // and the Shadow-Copies all self-tick deterministically through G.ents / world.movers from their fixed clocks —
  // no extra per-frame level logic is needed here (kept for the level-update contract + future tuning hooks).
}

W5_LEVELS.push({id:'w5l2', district:'w5', name:'THE GEARWORKS', build:buildW5L2, update:updateW5L2, parTime:165});

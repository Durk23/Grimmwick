// ============ LEVEL 5-5 — GRIMM'S APPROACH (District 5 · The Cursed Castle · the FINALE's doorstep) ============
// THE MASTERY EXAM. Everything the Keep taught, chained into one run to the throne: gear platforms, a pendulum
// blade over the void, clockwork knights (read the bow), shadow-copies pouring from Grimm's brew, mirror-boos,
// and — the signature — THE BOMBARDMENT: Grimm's RAIN OF EMBERS. From the rafters he hurls the stolen fire onto
// FIXED, telegraphed ground spots on a fixed clock (a ~0.7s growing target-glow before each hit) while shadow
// copies, a knight and a swoop-bat pressure the lane. The candy road weaves forward through the gaps, so dodging
// is a FORWARD DANCE, never a stand-and-pray. Full introduce->twist->escalate->master into the throne door:
//   BEAT 1 THE OUTER GATE (INTRODUCE)   x -8..30  — re-teach the verbs fast: a Clockwork Knight to bait the bow,
//          a Shadow Copy chaser, a spinning gear underfoot. Dense, but it hands you every tool back.
//   BEAT 2 THE GEAR LANDING (TWIST)     x 30..58  — a high road of gear platforms (a Heart overhead, seen from
//          the low lane) crossing a PENDULUM BLADE that guillotines the ground path; a Mirror Boo + two chasers.
//   BEAT 3 THE RAIN OF EMBERS (PEAK)    x 58..112 — THE BOMBARDMENT: the ember rain over a ground gauntlet with a
//          Knight, a Swoop Bat and a Shadow Copy. Follow the candy; keep moving. A Gummy Shield before you enter.
//   -- CP1 (LIT) on the calm landing at x116, a mercy Heart — the level's ONE mid checkpoint (D5 mastery rule). --
//   BEAT 4 THE SHADOW STEPS (ESCALATE)  x 120..142 — a gear-platform crossing over the VOID (static+moving cogs) past
//          a second PENDULUM BLADE. Fall = killY, back to CP1.
//   BEAT 5a THE HANGING CLOCK-CHAIN (GP)  x 142..156 — GOLDEN PUMPKIN #2 (idx 2): up a clock-chain a floor double
//          can't reach; the candy climbs it for you. Skill-gated on the climb.
//   BEAT 5b THE THRONE STEPS (finish)   x 156..192 — the last gauntlet (Knight · Mirror Boo · Swoop Bat), a
//          suspicious black GrimmGift in a clear pocket, the QUIET PROP on the steps, and the throne-room door.
// Reads UNMISTAKABLY the Cursed Castle: W5PAL gunmetal + verdigris brass, clock-face cream, shadow-purple, the one
// warm ember accent; a stopped-clock-tower skyline with Grimm's cracked clock-face, drifting clock-soot, cold
// ember-sparks, chandeliers and giant idle gears in the dark. Structured chaos over three lanes (ground knights/
// chasers · the pendulum + gear cogs · air bats + the ember rain) — 13 threats, every one on a fixed clock and
// telegraphed. Comparable heights throughout (tap 1.8 / held 2.6 / double 3.3; the void is gated gear-hops, the GP
// gated by a chain). Deterministic to the pebble — fixed placements/clocks; the ember rain resets its clock the
// instant you enter the gauntlet so its pattern is learnable; seeded rand() only inside baked cosmetic deco.

// ---- THE EMBER RAIN — the bombardment emitter (deterministic; reset per build; ticked in updateW5L5) ----
// Two ember-shells drop each beat onto FIXED columns on a fixed clock, marked ~0.7s early by a growing target ring.
// The clock RESETS the moment the player crosses into the gauntlet (a pure function of entry) so the pattern is the
// same every attempt and fully learnable. 5 of the 7 columns are always safe — the candy road threads them.
const W5L5_COLS = [64, 71, 78, 85, 92, 99, 106];
const W5L5_P    = 0.95;    // seconds between drop-beats
const W5L5_LEAD = 0.72;    // telegraph lead == the shell's fall time (glow and shell resolve together)
const W5L5_X1   = 59, W5L5_X2 = 109;   // the gauntlet's active x-window
let W5L5_rainOn = false, W5L5_rainT = 0, W5L5_beat = 0, W5L5_glows = [];

function buildW5L5(G){
  const S = G.scene;
  levelBegin(G);
  W5L5_rainOn = false; W5L5_rainT = 0; W5L5_beat = 0; W5L5_glows = [];

  // palette handles for the course
  const STONE  = W5PAL.stone;    // masonry gunmetal — the honest floor
  const STONED = W5PAL.stoneD;   // darker floor of the bombardment gauntlet (reads "danger zone")
  const BRASS  = W5PAL.brass;    // gear / ledge brass
  const deco   = new THREE.Group();   // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE OUTER GATE (x -8..30): INTRODUCE ===============================
  groundX(G, -8, 30, STONE);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start
  signPost(G, 4, 1.7, -0.14, "GRIMM'S APPROACH. Every clock in the Keep stopped the night he swallowed the flame. Past the gears and the shadows waits his throne. Keep your feet moving, Pip.");
  gearPlat(G, 12, 0.9, {w:3.2, d:3, spin:0.8});              // a low spinning cog underfoot — a floor you can stand on
  G.ents.add(new ClockworkKnight(G, 18, 0, 0, {phase:0.0, range:2.4, dir:-1}));   // BOW telegraph — re-learn it
  candyLine(G, [[6,0.95,0],[9,0.95,0]], 3);
  candyLine(G, [[13,1.6,0],[15,1.1,0]], 3);
  G.ents.add(new ShadowCopy(G, 24, 0, 0, {phase:0.3, speed:2.6}));   // lane chaser — outrun or bonk
  candyLine(G, [[20,0.95,0],[23,0.95,0]], 3);
  G.ents.add(new Crow(9, 0.95, 2.4));                        // reactive castle critter — flaps off when neared

  // =============================== BEAT 2 — THE GEAR LANDING (x 30..58): TWIST — gears + a blade ===============================
  groundX(G, 30, 58, STONE);
  // HIGH ROAD — a chain of gear platforms carrying a Heart (seen from the low lane: "next run I'm going up there")
  gearPlat(G, 34, 2.4, {spin:1.1});
  gearPlat(G, 38, 2.5, {spin:-1.0});
  gearPlat(G, 42, 2.4, {spin:1.3});
  candyLine(G, [[32,1.6,0],[34,2.9,0]], 3); candyLine(G, [[36,3.0,0],[38,3.0,0]], 2);
  candyLine(G, [[40,3.0,0],[42,2.9,0]], 2);
  G.ents.add(new Heart(38, 3.4, 0));                         // high-road reward, visible from the ground
  G.ents.add(new ShadowCopy(G, 36, 0, 0, {phase:0.6, speed:2.7}));   // low-lane chaser under the gears
  // THE PENDULUM BLADE — guillotines the honest ground path; time it at an extreme of the swing (steady, learnable)
  G.ents.add(new PendulumBlade(G, 46, 4.6, {len:4.0, amp:0.8, period:2.6, phase:0.0, r:0.6}));
  candyLine(G, [[44,0.95,0],[48,0.95,0]], 3);
  G.ents.add(new MirrorBoo(G, 50, 2.4, 0, {phase:0.0, range:3.5, mirror:0.8}));   // feint it, then cross
  G.ents.add(new ShadowCopy(G, 54, 0, 0, {phase:0.2, speed:2.8}));
  G.ents.add(new BonkLantern(G, 57, 2.5, 0, 'shield'));      // armor up — the rain is next
  candyLine(G, [[52,0.95,0],[55,0.95,0]], 3);

  // =============================== BEAT 3 — THE RAIN OF EMBERS (x 58..112): PEAK — THE BOMBARDMENT ===============================
  groundX(G, 58, 112, STONED);                               // continuous floor — the rain is heart-cost, never a pit
  signPost(G, 60, 1.7, 0.12, "THE RAIN OF EMBERS. Grimm hurls the stolen fire from the rafters - it always falls where it's marked. Follow the candy road and NEVER stand still.");
  // three ground/air pressers so the rain is a dance, not a puzzle you solve standing (the BOMBARDMENT archetype)
  G.ents.add(new ClockworkKnight(G, 74, 0, 0, {phase:0.4, range:3.0, dir:-1, wakeR:4.5}));
  G.ents.add(new SwoopBat(G, 86, 4.4, 0, {phase:0.3, range:4, period:3.2, aggroR:5}));
  G.ents.add(new ShadowCopy(G, 96, 0, 0, {phase:0.1, speed:3.0}));
  // THE CANDY ROAD — a forward hopping rhythm threading the safe columns (keep moving right = keep safe)
  candyLine(G, [[62,1.0,0],[66,1.5,0],[70,1.0,0]], 4);
  candyLine(G, [[74,1.0,0],[78,1.5,0],[82,1.0,0]], 4);
  candyLine(G, [[86,1.0,0],[90,1.5,0],[94,1.0,0]], 4);
  candyLine(G, [[98,1.0,0],[102,1.5,0],[106,1.0,0]], 4);
  // the rafters the rain falls from — a dark beam over the gauntlet (baked; the shells drop from y~8 beneath it)
  { const beam = mesh('box',[54,0.7,1.0], mat(W5PAL.stoneD)); beam.position.set(85, 9.2, -1.2); deco.add(beam);
    for(let x=64; x<=106; x+=7){ const hole=mesh('cyl',[0.4,0.4,0.6,8], emat(W5PAL.ember,W5PAL.ember,0.5)); hole.rotation.x=Math.PI/2; hole.position.set(x,9.0,-1.0); deco.add(hole); } }

  // =============================== THE LANDING + CP1 (x 112..120): the ONE mid checkpoint ===============================
  groundX(G, 112, 120, STONE);
  G.ents.add(new Heart(114, 1.4, 0));                        // mercy heart out of the rain
  G.ents.add(new Checkpoint(116, 0, 1.6, 1));                // CP1 — LIT, the level's single mid checkpoint
  candyLine(G, [[110,0.95,0],[113,0.95,0]], 3);

  // =============================== BEAT 4 — THE SHADOW STEPS (x 120..142): ESCALATE — gear-hops over the void ===============================
  // ground ends at 120; the void (killY) opens. Static cog -> a MOVING cog on a fixed clock -> static cog -> landing.
  const gearMover = ()=>{ const g=new THREE.Group();
    const top=mesh('cyl',[1.2,1.2,0.4,16], mat(BRASS)); top.rotation.x=Math.PI/2; top.position.y=0.2; g.add(top);
    const cog=cogMesh(1.35, W5PAL.brassD); cog.position.y=-0.05; g.add(cog);
    S.add(g); return g; };
  gearPlat(G, 123, 2.0, {spin:1.2});                         // step off the ground edge (gap 3, up 2.0 — held)
  G.world.addMover(2.4, 0.4, 3, t=> new THREE.Vector3(129 + Math.sin(t*1.2)*2.5, 1.6, 0), gearMover);  // cog top 2.0, rides 126.5..131.5
  candyLine(G, [[126,2.7,0],[132,2.7,0]], 3);
  gearPlat(G, 135, 2.0, {spin:-1.1});
  // a SECOND pendulum blade sweeps the static cog at 135 — cross when it's swung aside (telegraphed)
  G.ents.add(new PendulumBlade(G, 135, 6.0, {len:3.4, amp:0.75, period:2.6, phase:1.0, r:0.6}));
  platform(G, 139, 2.0, 0, 4, 3, STONE);                     // landing (spans 137..141)
  candyLine(G, [[133,2.7,0],[135,2.7,0],[137,2.5,0]], 3);

  // =============================== BEAT 5a — THE HANGING CLOCK-CHAIN (x 142..156): GOLDEN PUMPKIN idx 2 ===============================
  groundX(G, 142, 192, STONE);
  G.ents.add(new BonkLantern(G, 145, 1.4, 0, 'shield'));     // one more shield before the last gauntlet
  // GP #2 rides above a clock-chain climb: a floor double tops out ~3.3u — this ledge sits at 9. The candy climbs it.
  w5Chain(G, 148, 0.5, 8.5);
  candyLine(G, [[148,2.2,0],[148,4.6,0],[148,7.0,0]], 4);    // the quiet lure up the chain (telegraphs the climb)
  platform(G, 151, 9.0, 0, 3, 3, BRASS);                    // the GP ledge (leap off the chain top, +0.5)
  G.ents.add(new GoldPumpkin(151, 9.9, 0, 2));               // GOLDEN PUMPKIN idx 2 — skill-gated up the chain
  candyLine(G, [[149,8.9,0],[151,9.5,0]], 2);
  G.ents.add(new Crow(150, 0.95, 2.4));

  // =============================== BEAT 5b — THE THRONE STEPS (x 156..192): finish ===============================
  // THE GIFT — a suspicious black present in a CLEAR POCKET (x159): nearest patrol reach is the knight at 170 (>6u).
  const gift = new GrimmGift(159, 0, 0, -0.3);
  G.coffins.push(gift); G.ents.add(gift);
  candyLine(G, [[156,0.95,0],[157,0.95,0]], 2);
  // the last gauntlet — a knight to bow-bait, a mirror-boo to feint, a bat working the air over the throne steps
  G.ents.add(new ClockworkKnight(G, 170, 0, 0, {phase:0.2, range:3.0, dir:-1, wakeR:4.5}));
  G.ents.add(new MirrorBoo(G, 176, 2.6, 0, {phase:0.5, range:3.5, mirror:0.8}));
  G.ents.add(new SwoopBat(G, 182, 4.2, 0, {phase:0.6, range:3.5, period:3.4, aggroR:5}));
  candyLine(G, [[164,0.95,0],[167,0.95,0]], 3); candyLine(G, [[172,1.5,0],[175,1.5,0]], 3);
  signPost(G, 168, 1.7, -0.1, "THE THRONE STEPS. One last gauntlet, and the door beyond. He's been waiting a very long time, Pip - for anyone at all to come.");
  exitGate(G, 186);   // -> the throne room / the Grimm boss door

  // =============================== DECO · QUIET PROP · MOON · PARALLAX ===============================
  // castle machinery & masonry (baked): broken pillars, wall clock-faces, hanging chandeliers, idle giant gears
  deco.add(brokenPillar(-4, -5.5, 1.4)); deco.add(brokenPillar(33, -6, 1.2)); deco.add(brokenPillar(120, -5.5, 1.3));
  deco.add(brokenPillar(172, -6, 1.4));
  deco.add(clockFaceDeco(20, 5.2, -6, 1.2)); deco.add(clockFaceDeco(100, 6.0, -6.5, 1.4)); deco.add(clockFaceDeco(180, 5.4, -6, 1.2));
  deco.add(chandelier(26, 6.4, -3, 1.0)); deco.add(chandelier(70, 6.8, -3, 1.1)); deco.add(chandelier(164, 6.4, -3, 1.0));
  { const gears = new THREE.Group();
    for(const [x,z,r] of [[8,-7,2.4],[52,-8,3.2],[108,-7.5,2.8],[150,-8,3.0]]){ const c=cogMesh(r, 0x1e1c2a); c.position.set(x, rand(2,4), z); gears.add(c); }
    deco.add(gears); }
  // FOREGROUND SILHOUETTES (z>0) framing the run — near broken cog-teeth & pillars
  deco.add(brokenPillar(29, 3.4, 1.7)); deco.add(brokenPillar(157, 3.6, 1.7));
  { for(const x of [15, 118, 190]){ const c=cogMesh(1.6, 0x14121e); c.position.set(x, 0.6, 3.6); deco.add(c); } }

  // THE QUIET PROP (never signposted): the LAST unshattered festival lantern, still warm on the throne-room steps.
  // Every clock in the Keep is stopped and cold; every other light is shadow-purple. This one paper lantern - a
  // stray from the festival Grimm swallowed - never went out. It has been waiting on his doorstep the whole time,
  // holding a little warmth for whoever finally came. (The whole game is about relighting flames. Here's one that
  // never needed it.) Story-readers will feel it; everyone else hops the steps to the door.
  { const q = new THREE.Group();
    const step = mesh('box',[1.4,0.3,1.2], mat(W5PAL.stoneL)); step.position.set(0,0.15,0);
    const shade = mesh('sph',[0.34,12,10], emat(0xffdca0, W5PAL.ember, 0.9)); shade.position.set(0,0.72,0); shade.scale.set(1,1.15,1);
    const ribTop = mesh('cyl',[0.1,0.06,0.1,8], mat(W5PAL.brassD)); ribTop.position.set(0,1.06,0);
    const ribBot = mesh('cyl',[0.06,0.1,0.1,8], mat(W5PAL.brassD)); ribBot.position.set(0,0.36,0);
    const hook = mesh('tor',[0.09,0.02,4,8], mat(W5PAL.brass)); hook.position.set(0,1.18,0); hook.rotation.x=Math.PI/2;
    q.add(step, shade, ribTop, ribBot, hook);
    q.position.set(181, 0, 1.4); q.rotation.y=-0.3; S.add(q);   // kept live (its warm glow reads through the dark)
    const warm = new THREE.PointLight(W5PAL.ember, 20, 6); warm.position.set(181, 0.9, 1.4); S.add(warm); }

  // a cold stopped moon-clock low behind the Keep
  const moon = mesh('circ',[5,28], emat(W5PAL.creamD, W5PAL.cream, 0.7)); moon.position.set(96,17,-31); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',8,28), new THREE.MeshBasicMaterial({color:0xbfb2d8, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(96,17,-31.2); S.add(moonH);

  // three-depth clockwork skyline (cog-teeth & pendulums / rampart clock-tower + Grimm's cracked face / spires)
  w5Parallax(S, -8, 192);
  S.add(bakeGroup(deco));

  // themed death-pit dressing (visual — the fall is the hazard)
  pitDressing(G, 120, 137, 'castle');

  // the D5 tail: bats + clock-soot ambience; clutter split around the void (120..142 is all gear-hops)
  w5LevelFinish(G, -8, 192, null);
  w5Clutter(G, -8, 120, 'castle');
  w5Clutter(G, 142, 192, 'castle');

  return {spawnX: 0, exitX: 186};
}

function updateW5L5(G, dt){
  updateLevelCommon(G, dt);
  const pl = G.player;

  // THE EMBER RAIN — the bombardment clock. Resets the instant the player enters the gauntlet, so the drop pattern
  // is a pure function of entry and fully learnable (determinism covenant). Two shells per beat onto fixed columns;
  // a growing target ring marks each ~0.72s ahead; the shell falls in that same window (both cues, the whole time).
  const inRange = pl && !pl.dead && pl.pos.x > W5L5_X1 && pl.pos.x < W5L5_X2;
  if(inRange && !W5L5_rainOn){ W5L5_rainOn = true; W5L5_rainT = 0; W5L5_beat = 0; }
  else if(!inRange && W5L5_rainOn){ W5L5_rainOn = false; }
  if(W5L5_rainOn){
    W5L5_rainT += dt;
    while(W5L5_rainT >= W5L5_beat * W5L5_P){
      const n = W5L5_beat;
      const cols = [W5L5_COLS[n % 7], W5L5_COLS[(n + 3) % 7]];   // two danger columns; 5 of 7 stay safe
      for(const cx of cols){
        // the growing target ring on the ground (a live MeshBasic — grows + pulses over the lead, then vanishes)
        const ringMat = new THREE.MeshBasicMaterial({color:W5PAL.ember, transparent:true, opacity:0.5, side:THREE.DoubleSide, depthWrite:false});
        const ring = new THREE.Mesh(geo('tor',1.0,0.13,6,20), ringMat);
        ring.rotation.x = Math.PI/2; ring.position.set(cx, 0.07, 0);
        G.scene.add(ring); W5L5_glows.push({mesh:ring, mat:ringMat, t:0});
        // the ember-shell itself, falling straight down onto the marked column, landing as the ring completes
        G.ents.add(new CrabShell(G, cx, 8, 0, {targetX:cx, targetY:0, flight:W5L5_LEAD}));
      }
      W5L5_beat++;
    }
  }

  // tick + retire the target rings
  for(let i=W5L5_glows.length-1; i>=0; i--){
    const g = W5L5_glows[i]; g.t += dt;
    const u = g.t / W5L5_LEAD;                       // 0..1 over the telegraph
    g.mesh.scale.setScalar(0.42 + u*0.95);           // grow to full as the shell arrives
    g.mat.opacity = (0.35 + Math.sin(g.t*22)*0.2) * Math.max(0, 1 - u*0.15);
    if(g.t >= W5L5_LEAD){ G.scene.remove(g.mesh); W5L5_glows.splice(i,1); }
  }
}

W5_LEVELS.push({id:'w5l5', district:'w5', name:"GRIMM'S APPROACH", build:buildW5L5, update:updateW5L5, parTime:170});

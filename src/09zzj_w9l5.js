// ============ LEVEL 9-5 — TANNENBAUM'S GROVE (District w9 · Evergreen Deep · the whispering pines) ============
// THE EXAM AT THE GREAT TREE'S DOORSTEP. Post-story mastery band (beyond D5), MAIN-GAME FAIR: hearts-always,
// telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away. The mastery mix:
//   ORNAMENT-FALL  — the bombardment analogue: the canopy drops ornaments in a MARCHING WAVE, one drop lane per
//                    0.7s stepping west->east across the corridor, on ONE fixed level clock (P=6.3s — nine 0.7
//                    beats). Telegraph is the learned icicle language: 0.7s GLINT at the bough + a growing floor
//                    glow ring (void lanes swap the ring for a vertical shimmer-beam — no floor to ring), then a
//                    0.85-1.0s visible fall, shatter fx on the floor. ~1.5s total warning at ground level.
//   CANE SWINGS    — two candy-cane pendulum platforms over the ravine WHILE the wave continues: the drop lanes
//                    sit BETWEEN the swings' sweeps (>=1.05u clear of every apex seat), so riding is safe and the
//                    hops between are the timed part. Ride between drop columns.
//   THE CAROL ROUND + SPIDER GAUNTLET — a CarolBoo trio sharing ONE 6.9s carol (verses 0/1/2, west sings first),
//                    then ornament-spiders hiding among BAKED DECOY baubles under two wrecking-bauble arcs and
//                    two rolling BaubleTriplet lanes, with a bough HIGH ROAD above it all.
//   UPDRAFT FINALE — the woodcutter chimney lofts Pip to a descending bough road through the wave's last two
//                    drop lanes, down to the Great Tannenbaum's doorstep and the gate.
// 15 threats: 3 OrnamentSpider + 3 CarolBoo (trio) + 2 TinselTangler + 2 WreathWisp + 2 BlizzardBat (reuse #1)
// + 1 Somnambear (reuse #2) + 2 BaubleTriplet. NO warp (the Quiet Carol lives in another level), NO Leap of
// Faith (both of the game's two are placed and sacred). Golden Pumpkin idx 2 — skill-gated (swing-apex leap).
//
//   BEAT 1 THE GROVE ROAD (breath)        x -8..27   — CP0 (noLight), the Advent Stump gamble in its clear
//          pocket, and the quiet prop: paper-star strings between two pines, one string mended. Nothing bites.
//   BEAT 2 THE ORNAMENT CORRIDOR (INTRO)  x 27..62   — six drop lanes at x33+5k, phases 0.7k: learn the wave on
//          grippy ground. Tangler #1 attacks your TIME under it; Wisp #1 hangs hole-candy over lane 53.
//   BEAT 3 THE RAVINE OF CANES (TWIST)    x 62..96   — swing #1 -> rest island -> swing #2, drop lanes at 76.8
//          and 93.8 between the sweeps; Bat #1 dives island dawdlers. GP #2 bough off swing #2's far apex.
//   BEAT 4 THE LANTERN REST (breath)      x 96..112  — THE lit lantern (x102, ~53.7% of the -8..197 run — the
//          level's ONE lit checkpoint), a shield lantern, then the carol warms up ahead.
//   BEAT 5 THE CAROL ROUND (ESCALATE)     x 112..133 — the trio sings the round (the singing IS the telegraph;
//          staring silences a verse), Tangler #2 under the seams, Somnambear sleepwalking the east stretch.
//   BEAT 6 THE GAUNTLET (MASTER)          x 133..168 — spiders among decoys + wrecking-bauble arcs + two triplet
//          lanes below; trunk-climb HIGH ROAD on the boughs above (Wisp #2 + Bat #2 contest it; wings crown it).
//   BEAT 7 THE CHIMNEY FINALE (exhale-up) x 168..197 — ledge, updraft, two boughs down through the wave's last
//          lanes, the Great Tannenbaum, the sign, the gate.
//
// ROUTES (crossing at junctions): LOW = the ground gauntlet, thread spiders/triplets/baubles on their clocks ·
// HIGH = the bough road (its candy + the bat-wings lantern glow overhead at the gauntlet mouth — the "next run
// I'm going up there" itch; boarding via the trunk climb at x133.9) · EXPERT = the racing line — outrun-weave
// the wave (candy traces the safe-lane rhythm and the through-the-window arcs), thread the wisp holes, the
// swing-apex GP leap, and the wings crown to fly the finale. Nothing on the critical path waits: every drop
// lane has a 3.9u+ safe lane beside it, every swing boards on a ~3.4s cadence, the carol never blocks the road.
//
// REACH MATH (jump model: tap 1.8 / held 2.6 / double 3.3 · gaps <=4 tap, <=5.5 held · swings/climb/updraft gate the rest):
//   main-route step-ups: board A top 1.4 (held) · step B rise 0.8 · all other rises swing/climb/updraft-gated.
//   double-jump boards (<=3.0 law, candy-traced): A(1.4)->swing1 near apex y3.74 = 2.34 · B(1.6)->swing2 near
//   apex y3.97 = 2.37 · swing2 far apex(91.84,3.97)->GP bough(95.8,y5.4) = rise 1.43, dx 3.96 (skill gate).
//   gaps: lip64->A 1.0 · swing1 far apex(74.66)->island(78.8) dx 4.1 falling · island->B 0.5 · swing2 far
//   apex->lip96 dx 4.2 falling · gauntlet168->ledge170 2.0 tap · bough gaps <=2.8 · bough2(182.4)->doorstep(186)
//   3.6 falling. Swing sweeps vs drop lanes: seat max 75.16 vs lane edge 76.25 (1.09 clear) · seat max 92.34 vs
//   lane edge 93.25 (0.91 clear) — apexes are always safe seats; the WAVE times the hop, never the ride.
// DETERMINISM: one wave clock (P=6.3, phases fixed, fall height computed FROM the clock each frame — frame-drop
// proof); swings are movers phased at build; the carol trio shares period 6.9 with phase 0 (verses 0/1/2 stagger
// them); every enemy carries a fixed phase; rand() only inside baked deco. No RNG on the critical path.
// THREAT-SYSTEM CAP (<=4): B2 wave+tangler+wisp=3 · B3 wave+swing-timing+bat=3 · B5 carols+tangler+bear(opt-in)=3
// · B6 low worst pinch x156-162 spider#3+triplet#2+bat#2=3 (baubles end at 154.7) / high wisp+bat+bauble-tips=3 ·
// B7 wave alone. HEARTS ALWAYS: ornaments/baubles/rims/enemies cost exactly 1; the ravine is the kit's full pit
// price (heart + lantern walk-back); the tangler's lasso costs TIME, not hearts.
//
// SPAWN SAFETY (idle at x0/z0, CP0 respawn x2/z1.6): nearest FIXED reach = corridor drop lane min 32.45 (30.4u
// clear) · tangler #1 lasso worst 43.8-3.2-0.55=40.05 (38u) · wisp #1 rim min 49.8-1.05=48.75 · carol swoop min
// 117-2.6-0.66=113.7 · everything east of that. The Advent Stump ambush (x12+-2.4) is opt-in, player-opened,
// kit 1s grace — a respawner at x2 sits 7.2u+ from its nearest reel thread. All clear.
// LANTERN SAFETY (idle at x102/z1.6): ravine drop lane max 93.8+0.55=94.35 (7.65 clear, lanes never drift) ·
// bat #1 trigger+drift max 80+2+4+2=88 (14) · carol #1 swoop reach min 113.7 (11.7) · tangler #2 lasso min
// 116.6-3.75=112.85 (10.85) · bear swipe worst west 123-3.15-1.25=118.6 (16.6) · triplet #1 touch min 135.2 ·
// bauble arcs >=140.3 · swing sweep max 92.34 (9.66). A true breath.
// ADVENT STUMP CLEAR-PATCH (x12, z-0.9, CLEAR-PATCH law >=6u — held 3x over): tangler #1 lasso 40.05 (28u) ·
// drop lane 32.45 (20.4u) · wisp #1 rim 48.75 (36.7u) · no patrols west of x43.8. Opening is a deliberate safe
// act; the kit's ornament-spider ambush spawns on its fixed +-2.4 ring with the 1s spawnGrace.

// ---- THE ORNAMENT-FALL (the level's bombardment): one ticker, many columns, ONE clock. Each column: 0.7s
// GLINT (emissive pulse at the bough) + floor glow ring (grounded lanes) or a vertical shimmer-beam (void
// lanes — a ring at y-2.4 would be invisible from the lip, so the beam carries the same warning), then the
// ornament falls (y computed from the clock, g=26 — identical every run, every framerate), SHATTERS in its
// own colour, and regrows. Hit lane half-width 0.55 (the icicle's), damage 1, i-frames gate repeats. ----
function w9l5OrnamentFall(G, defs, P){
  const S = G.scene;
  const cols = defs.map((d, i)=>{
    const color = [W9PAL.ornR, 0xffd23f, W9PAL.ornE, 0x7ae8ff][i % 4];   // fixed per column — no RNG
    const g = new THREE.Group();
    const bough = mesh('cyl',[0.09,0.13,1.8,5], mat(W9PAL.bark)); bough.rotation.z=Math.PI/2; bough.position.set(d.x, d.topY+0.35, -0.3); g.add(bough);
    const tuft = mesh('cone',[0.6,1.0,6], mat(W9PAL.pineD)); tuft.position.set(d.x, d.topY+0.9, -0.35); g.add(tuft);
    const m = new THREE.MeshLambertMaterial({color, emissive:color, emissiveIntensity:0.35});
    const orn = new THREE.Group();
    orn.add(new THREE.Mesh(geo('sph',0.32,10,8), m));
    const capO = mesh('cyl',[0.09,0.11,0.12,7], mat(0xc9a24a)); capO.position.y=0.36; orn.add(capO);
    orn.position.set(d.x, d.topY, 0); g.add(orn);
    const fY = d.floorY !== undefined ? d.floorY : 0;
    const grounded = fY >= -0.5;
    let tele;
    if(grounded){
      tele = new THREE.Mesh(geo('circ',0.62,14), new THREE.MeshBasicMaterial({color, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide}));
      tele.rotation.x = -Math.PI/2; tele.position.set(d.x, fY+0.06, 0);
    } else {
      tele = new THREE.Mesh(new THREE.PlaneGeometry(1.0, d.topY+3), new THREE.MeshBasicMaterial({color, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
      tele.position.set(d.x, (d.topY-3)/2, -0.1);
    }
    g.add(tele); S.add(g);
    return {x:d.x, at:d.at, topY:d.topY, fY, grounded, m, orn, tele, color,
            fallT: Math.sqrt(2*(d.topY - fY)/26), sh:true, _tk:false};
  });
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:0, group:new THREE.Group(),
    update(dt, GG){
      this.t += dt;
      const pl = GG.player;
      for(const c of cols){
        const cyc = ((this.t - c.at) % P + P) % P;
        if(cyc < 0.7){                                       // TELEGRAPH — the glint + the ring/beam
          c.sh = false;
          c.orn.visible = true; c.orn.position.y = c.topY; c.orn.scale.setScalar(1); c.orn.rotation.z = 0;
          const k = cyc/0.7;
          c.m.emissiveIntensity = 0.35 + Math.abs(Math.sin(cyc*30))*0.9*k;
          if(c.grounded){ c.tele.material.opacity = k*0.45; c.tele.scale.setScalar(0.6+k*0.8); }
          else c.tele.material.opacity = k*0.22;
          if(!c._tk){ c._tk = true;
            if(pl && Math.abs(pl.pos.x-c.x)<24 && this.t>1) AUDIO.tone && AUDIO.tone({f:1568, type:'sine', t:0.1, vol:0.05}); }
        } else if(cyc < 0.7 + c.fallT){                      // THE FALL — position from the clock, not integration
          const ft = cyc - 0.7;
          const oy = c.topY - 13*ft*ft;
          c.orn.position.y = oy;
          c.orn.rotation.z += dt*6;
          c.m.emissiveIntensity = 0.7;
          if(pl && !pl.dead && Math.abs(pl.pos.x-c.x)<0.55 && Math.abs(pl.pos.z)<0.9 &&
             pl.pos.y < oy+0.4 && pl.pos.y+1.2 > oy-0.4){
            pl.damage(1, new THREE.Vector3(c.x, oy, 0));     // hearts-always; knockback away from the lane
          }
        } else {                                             // SHATTER (once) -> hide -> regrow at the bough
          if(!c.sh){ c.sh = true; c._tk = false;
            if(pl && Math.abs(pl.pos.x-c.x)<30 && this.t>1){
              GG.fx.spawn(new THREE.Vector3(c.x, c.fY+0.25, 0.2), c.color, 10, {speed:3.5, life:0.5});
              GG.fx.spawn(new THREE.Vector3(c.x, c.fY+0.25, 0.2), 0xffffff, 5, {speed:2.2, life:0.35});
              AUDIO.noise && AUDIO.noise({t:0.16, vol:0.12, fFrom:3200, fTo:900});
            }
            c.orn.visible = false;
          }
          c.tele.material.opacity = Math.max(0, c.tele.material.opacity - dt*3);
          const rg = cyc - (0.7 + c.fallT + 0.5);
          if(rg > 0){ c.orn.visible = true; c.orn.position.y = c.topY;
            c.orn.scale.setScalar(Math.min(1, rg/0.8)); c.m.emissiveIntensity = 0.35; }
        }
      }
    } });
}

// ---- THE QUIET PROP: hundreds of tiny handmade paper stars strung on thread between two pines — three strings,
// and the middle one visibly SNAPPED once: re-tied with a different colour of thread (festival red against the
// old grey), two little knots at the mend, the whole string sagging a touch lower for it. Somebody came back to
// fix it. Never signposted; fully baked; story-readers stop, everyone else walks past. ----
function w9l5PaperStars(x1, x2){
  const g = new THREE.Group();
  g.add(w6Pine(x1, -2.3, 1.15)); g.add(w6Pine(x2, -2.3, 1.25));
  const paper = mat(0xf0e6c8), paperNew = mat(0xfdfaf0);
  const threadOld = mat(0x8a8f9a), threadNew = mat(0xd83a4a);
  for(let row=0; row<3; row++){
    const y0 = 2.6 + row*0.55, segN = 12, mendA = (row===1) ? 7 : -1;
    const sag = row===1 ? 0.75 : 0.55;      // the mended string hangs lower — tied in a hurry, tied with love
    for(let i2=0;i2<segN;i2++){
      const t0=i2/segN, t1=(i2+1)/segN;
      const ax=lerp(x1,x2,t0), ay=y0-Math.sin(t0*Math.PI)*sag;
      const bx=lerp(x1,x2,t1), by=y0-Math.sin(t1*Math.PI)*sag;
      const isMend = row===1 && (i2===mendA || i2===mendA+1);
      const seg = mesh('cyl',[0.012,0.012,Math.hypot(bx-ax,by-ay),3], isMend?threadNew:threadOld);
      seg.position.set((ax+bx)/2,(ay+by)/2,-2.2);
      seg.rotation.z = Math.atan2(bx-ax, by-ay)*-1 + Math.PI;
      g.add(seg);
      if(i2<segN-1){ const st = mesh('sph',[0.055,4,3], isMend?paperNew:paper);   // low-poly = folded facets
        st.scale.set(1,1,0.55); st.rotation.z = i2*0.7; st.position.set(bx, by-0.07, -2.18); g.add(st); }
    }
    if(row===1) for(const kt of [mendA/segN, (mendA+2)/segN]){
      const kn = mesh('sph',[0.032,4,4], threadNew);
      kn.position.set(lerp(x1,x2,kt), y0-Math.sin(kt*Math.PI)*sag, -2.2); g.add(kn);
    }
  }
  return g;
}

// ---- in-lane great pine (baked framing — the trunks that hold the swings, the boughs, the canopy) ----
function w9l5GrovePine(x, z, h, s=1){
  const g = new THREE.Group();
  const trunk = mesh('cyl',[0.32*s,0.52*s,h*0.42,7], mat(W9PAL.bark)); trunk.position.set(x,h*0.21,z); g.add(trunk);
  for(let tier=0;tier<4;tier++){ const tr=mesh('cone',[(2.4-tier*0.45)*s, h*0.3, 7], mat(tier%2?W9PAL.pine:W9PAL.pineD)); tr.position.set(x, h*0.3+tier*h*0.17, z); g.add(tr); }
  const cap = mesh('cone',[0.6*s,h*0.14,7], mat(W9PAL.snow)); cap.position.set(x,h*0.93,z); g.add(cap);
  for(let o=0;o<5;o++){ const cc=[W9PAL.ornR,W9PAL.ornG,W9PAL.ornE,0x7ae8ff,W9PAL.ornR][o];
    const orn=mesh('sph',[0.14*s,6,5], emat(cc,cc,0.6)); orn.position.set(x+Math.sin(o*2.3)*1.3*s, h*0.32+o*h*0.13, z+0.75*s); g.add(orn); }
  return g;
}

// ---- decoy bauble (baked): a REAL ornament hanging exactly the way the spiders pretend to — same y, same
// colours, same gilt cap. By 9-5 the player checks everything for legs; the decoys are why. ----
function w9l5Decoy(x, hangY, color){
  const g = new THREE.Group();
  const bough = mesh('cyl',[0.07,0.1,1.6,5], mat(W9PAL.bark)); bough.rotation.z=Math.PI/2; bough.position.set(x,hangY+1.35,-0.15); g.add(bough);
  const thr = mesh('cyl',[0.014,0.014,1.2,3], mat(0x8a8f9a)); thr.position.set(x,hangY+0.7,0); g.add(thr);
  const ball = mesh('sph',[0.34,9,8], emat(color,color,0.35)); ball.position.set(x,hangY,0); g.add(ball);
  const capD = mesh('cyl',[0.1,0.12,0.12,7], mat(0xc9a24a)); capD.position.set(x,hangY+0.4,0); g.add(capD);
  return g;
}

// ---- THE GREAT TANNENBAUM (baked, behind the gate): the first tree they ever decorated — dozens of ornaments,
// ALL DARK (glass with the lights off, on a fixed spiral — he must look the same every visit)... except ONE,
// halfway up, still lit, waiting for the verse to resume. The sign at his feet says the rest. ----
function w9l5Tannenbaum(x, z){
  const g = new THREE.Group();
  const trunk = mesh('cyl',[0.9,1.4,6.5,9], mat(W9PAL.barkD)); trunk.position.set(x,3.2,z); g.add(trunk);
  for(let tier=0;tier<6;tier++){ const tr=mesh('cone',[6.2-tier*0.92, 4.6, 8], mat(tier%2?W9PAL.pineD:0x0e2018)); tr.position.set(x, 4.2+tier*2.2, z); g.add(tr); }
  const cap = mesh('cone',[1.1,2.4,7], mat(W9PAL.snow)); cap.position.set(x,17.4,z); g.add(cap);
  for(let i=0;i<22;i++){ const a=i*2.39996; const ty=4+((i*1.618)%1)*11.5;
    const rr=(1-ty/18)*5.2+0.8;
    const orn=mesh('sph',[0.26,7,6], mat([0x5a1e26,0x5a4a16,0x16321f,0x1c3a44][i%4]));   // colours with the lights OFF
    orn.position.set(x+Math.cos(a)*rr, ty, z+Math.sin(a)*rr*0.5+0.8); g.add(orn); }
  const lit = mesh('sph',[0.3,8,7], emat(0xffb85e,0xff9a50,1.1)); lit.position.set(x-1.8, 9.6, z+2.2); g.add(lit);
  const star = mesh('sph',[0.5,5,4], mat(0x3a3444)); star.scale.set(1,1.4,0.4); star.position.set(x,18.6,z); g.add(star);   // the dark star topper
  return g;
}

function buildW9L5(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;                 // packed forest floor — grippy everywhere (precision never on slick)
  const deco = new THREE.Group();
  const L = w6LightsBegin();

  // =============================== BEAT 1 — THE GROVE ROAD (x -8..27) ===============================
  groundX(G, -8, 64, SNOW);                 // one grippy run to the ravine lip at 64
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  deco.add(w6LightPost(4, -2.0, 3)); deco.add(w6LightPost(10, -2.0, 3));
  w6String(L, 4, 2.95, 10, 2.95, {z:-1.9});                   // the last kind string before the deep grove
  candyLine(G, [[5,0.9,0],[8.5,0.9,0]], 2);                                          // candy 2 (running total 2)
  // THE ADVENT STUMP — the gamble, in its CLEAR POCKET (full reach ledger in the header; nearest fixed reach
  // is the tangler's worst lasso at 40.05 — 28u clear, the law's 6u held 4x over). Ambush = the kit's ornament
  // spiders on their fixed +-2.4 ring, 1s spawnGrace: the gamble is the CHOICE, never a cheap hit.
  { const st = new AdventStump(12, 0, -0.9, 0.25); G.coffins.push(st); G.ents.add(st); }
  // THE QUIET PROP (never signposted): the paper-star strings, one mended in red
  deco.add(w9l5PaperStars(17.2, 24.6));
  G.ents.add(new Crow(26, 0.95, 2.2));      // grove crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE ORNAMENT CORRIDOR (x 27..62): INTRODUCE the wave ===============================
  signPost(G, 27.5, 1.7, -0.12, "The Grove decorates BACK. A glint in the canopy means an ornament is coming down - the glow marks the spot. They fall in a marching line, west to east, one beat apart, same song every time. Stand in the gaps; move on the shatter.");
  // sign clearance: drop lane min 32.45 (4.95u) · tangler #1 lasso worst 40.05 (12.5u). Reading is a breath.
  // Six grounded drop lanes at x33+5k — 3.9u safe lanes between (hit half-width 0.55). The wave marches east at
  // ~7.1u/s: run with it and it slowly overtakes; the counter is one beat's pause in a safe lane. SMW Bullet
  // Bill energy, never bullet-hell. Candy traces the safe-lane rhythm (the racing line).
  candyLine(G, [[35.5,0.9,0],[40.5,0.9,0],[45.5,0.9,0]], 3);                          // candy 3 (5)
  candyLine(G, [[50.5,0.9,0],[55.5,0.9,0]], 2);                                       // candy 2 (7)
  // TINSEL TANGLER #1 — attacks your TIME under the wave (lasso = 40% slow 1.2s; spin shakes it): get tangled
  // and the next drop lane closes on you. Patrol 43.8..47.4 threads BETWEEN lanes 43 and 48 (0.25u+ clear of
  // both edges — ornaments never appear to hit it). Twirl telegraph 0.7s, kit-standard.
  G.ents.add(new TinselTangler(G, 45.6, 0, 0, {phase:0.5, range:1.8, dir:1, speed:1.5, wakeR:5, lassoP:4.2}));
  // WREATH WISP #1 — slow fixed oval over lanes 50.5-55.5 (x49.8..54.2, y3.4..5.0): the rim costs a heart, the
  // HOLE is safe — and holds a candy at the oval's center (y4.2: above the ground magnet's base reach — bait
  // for a deliberate double-jump thread, the speedrun flourish).
  G.ents.add(new WreathWisp(G, 52, 4.2, 0, {phase:0.9, rx:2.2, ry:0.8, period:6.8}));
  G.ents.add(new Candy(52, 4.2, 0));                                                  // candy 1 (8) — the hole (12_main stamps _placed on every built Candy)
  deco.add(w9l5GrovePine(36, -2.6, 9, 1.0)); deco.add(w9l5GrovePine(56.5, -2.7, 10, 1.1));
  G.ents.add(new Crow(61.5, 0.95, 2.3));    // grove crow #2 — on the lip, watching the ravine (a crow marks an edge)

  // =============================== BEAT 3 — THE RAVINE OF CANES (x 62..96): TWIST — ride between drop lanes ===============================
  signPost(G, 63, 1.7, 0.1, "Candy-cane swings, still keeping the old tempo. Board at the TOP of a swing, step off at the other top. The canopy keeps dropping ornaments between them - the swings already know the rhythm. You will too.");
  // sign clearance: wisp #1 rim max 54.2+1.05=55.25 (7.75u) · nothing lives on the lip. Board platform A:
  platform(G, 66.2, 1.4, 0, 2.4, 1.6, W9PAL.pineD);            // lip64 -> A: gap 1.0, rise 1.4 (held, main law)
  candyLine(G, [[66.2,2.0,0],[67.6,2.9,0],[68.3,3.9,0]], 3);   // candy 3 (11) — the double-jump board arc
  // SWING #1 — pivot 71.5, sweep 68.34..74.66, apexes y3.74 (kit pendulum mover, fixed phase 0)
  w9CaneSwing(G, {x:71.5, pivotY:7.4, len:4.8, amp:0.72, period:3.4, phase:0});
  deco.add(w9l5GrovePine(71.5, -1.6, 11, 1.2));                // the pine that holds swing #1's bough
  // drop lane 76.8 (void — shimmer-beam telegraph) BETWEEN swing #1's sweep (seat max 75.16, 1.09 clear) and
  // the island (78.8): sit the apex safely, hop on the wave's rest beats. Candy arcs THROUGH the window.
  candyLine(G, [[75.6,3.9,0],[77.4,3.3,0],[79.3,1.9,0]], 3);   // candy 3 (14)
  // THE REST ISLAND — a stone spire mid-ravine (top y0.8): the only stand between swings
  platform(G, 81, 0.8, 0, 4.4, 3, W9PAL.pineD);
  { const spire = mesh('cone',[2.0,5.0,7], mat(0x2a2434)); spire.position.set(81,-2.2,0); deco.add(spire);
    const capI = mesh('box',[4.5,0.16,3.1], mat(W9PAL.snow)); capI.position.set(81,0.86,0); deco.add(capI); }
  G.ents.add(new Heart(81, 1.7, 0));                           // mercy mid-exam
  // BLIZZARD BAT #1 — dives island DAWDLERS (squeak telegraph, snapshot dive — sidestep on the 4.4u island).
  // Patrol 78..82 at y5.4; trigger+drift max 88 — 14u short of the lantern. Punishes camping, not resting.
  G.ents.add(new BlizzardBat(G, 80, 5.4, 0, {phase:0.7, range:2, period:3.6, aggroR:4}));
  platform(G, 84.6, 1.6, 0, 1.8, 1.6, W9PAL.pineD);            // step B: island->B rise 0.8, gap 0.5
  candyLine(G, [[83.9,2.2,0],[85.1,3.6,0]], 2);                // candy 2 (16) — the board-B arc
  // SWING #2 — pivot 88.5, sweep 85.16..91.84, apexes y3.97; phase 1.7 = half a period off swing #1 (the two
  // canes alternate — the ravine breathes left-right-left, learnable forever)
  w9CaneSwing(G, {x:88.5, pivotY:7.6, len:4.9, amp:0.75, period:3.4, phase:1.7});
  deco.add(w9l5GrovePine(88.5, -1.7, 11.5, 1.2));
  // drop lane 93.8 (void beam) between swing #2's sweep (seat max 92.34, 0.91 clear) and the far lip (96);
  // the dismount arc crosses it mid-flight — watch a beat from the apex, then go.
  candyLine(G, [[92.6,3.4,0],[94.6,2.0,0],[96.5,1.0,0]], 3);   // candy 3 (19) — the dismount line
  // GOLDEN PUMPKIN idx 2 — SKILL-GATED (the district's third): leap from swing #2's FAR apex (91.84, y3.97),
  // double-jump the candy arc to the high bough (95.8, y5.4 — rise 1.43, dx 3.96, tight and honest). The GP's
  // own glow is the junction sightline: visible from the corridor lip, all the way across the ravine.
  platform(G, 95.8, 5.4, 0, 2.0, 1.6, W9PAL.pineD);
  candyLine(G, [[92.5,4.7,0],[94.7,5.7,0],[95.6,6.3,0]], 3);   // candy 3 (22) — the apex-leap telegraph
  G.ents.add(new GoldPumpkin(95.8, 6.5, 0, 2));
  pitDressing(G, 64, 96, 'winter');                            // the ravine bed — heart + lantern price, never a life

  // =============================== BEAT 4 — THE LANTERN REST (x 96..112) ===============================
  groundX(G, 96, 168, SNOW);
  // THE lantern — the level's ONE lit checkpoint (x102 of the -8..197 run = 53.7%). Full idle-safety ledger in
  // the header: worst fixed reach is the ravine's last drop lane at 94.35 — 7.65u clear, and lanes never drift.
  G.ents.add(new Checkpoint(102, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 99.2, 1.5, 0, 'shield'));      // armor before the exam's second page
  candyLine(G, [[99.5,0.9,0],[101.2,0.9,0]], 2);               // candy 2 (24)
  deco.add(w6SnowmanDeco(105.5, -2.5, 0.75, 0.4));             // somebody's greeter, scarf frozen mid-wave
  G.ents.add(new Crow(108, 0.95, 2.1));                        // grove crow #3

  // =============================== BEAT 5 — THE CAROL ROUND (x 112..133): ESCALATE ===============================
  // THE TRIO — one carol, period 6.9, phase 0 for all three (they MUST share the clock; the verses stagger
  // them): west sings verse 0 first, the swoop lands on each verse's last beat (the singing IS the telegraph,
  // taught by this district's earlier rounds). Staring silences a verse — walk the round quiet, one voice at a
  // time, or dance the swoops (dip reach y0.8, +-2.6 of home). Hover y2.4-2.6: walking under a silent singer
  // is always safe; only the sung swoop bites.
  G.ents.add(new CarolBoo(G, 117, 2.4, 0, {verse:0, period:6.9, phase:0, range:9}));
  G.ents.add(new CarolBoo(G, 123, 2.6, 0, {verse:1, period:6.9, phase:0, range:9}));
  G.ents.add(new CarolBoo(G, 129, 2.4, 0, {verse:2, period:6.9, phase:0, range:9}));
  // TINSEL TANGLER #2 — under the #1/#2 verse seam (patrol 116.6..121.4): get lassoed and the NEXT verse's
  // swoop catches you slow. The time-attack composed with the round.
  G.ents.add(new TinselTangler(G, 119, 0, 0, {phase:1.3, range:2.4, dir:-1, speed:1.4, wakeR:5.5, lassoP:4.0}));
  // SOMNAMBEAR — sleepwalks the east stretch (patrol 123..130, soft wall, harmless asleep). Crossing her means
  // a spaced double-jump over (wake needs dx<1.8 AND y<2.0) or waking her on purpose: 0.7s roar telegraph, ONE
  // 7u/s swipe (reach east max 134.4 — she can graze triplet lane #1's mouth, opt-in, only at her waker), then
  // she forgets. A stomp wakes her AND bounces you clean past (vy 13) — both counters honest.
  G.ents.add(new Somnambear(G, 126.5, 0, 0, {phase:0.6, range:3.5, dir:1, speed:0.85}));
  candyLine(G, [[114,0.9,0],[118,0.9,0],[122,0.9,0]], 3);      // candy 3 (27) — the stare-walk rhythm
  candyLine(G, [[126,0.9,0],[130,0.9,0]], 2);                  // candy 2 (29)
  deco.add(w9l5GrovePine(120, -2.8, 10, 1.05));

  // =============================== BEAT 6 — THE GAUNTLET (x 133..168): MASTER ===============================
  signPost(G, 132.6, 1.7, 0.1, "Ornament check: the still ones are decor. The RATTLING ones are spiders. The giant swinging ones are simply rude, and the rolling ones come in threes. Welcome to the deep grove. The boughs above are quieter... ish.");
  // sign clearance: bear wake needs a reader west of 131.8 (patrol max 130 + 1.8 bump) — the sign sits at
  // 132.6, 0.8 past the wake line, and even a woken bear roars 0.7s first · triplet #1 touch min 135.2 (2.6u).
  // THE TRUNK CLIMB — the high road's door (climb volume x133.9, y0..5.3; 1.28u clear of triplet #1's spawn
  // touch at 135.2). Visible bark + branch stubs; climb-exit boosted hop tops onto bough #1.
  G.world.addBox(133.9, 0, 0, 1.1, 5.3, 1.2, {type:'climb'});
  { const bark = mesh('cyl',[0.4,0.55,5.6,7], mat(W9PAL.bark)); bark.position.set(133.9,2.8,-0.55); deco.add(bark);
    for(let b=0;b<5;b++){ const stub=mesh('cyl',[0.05,0.08,0.7,4], mat(W9PAL.barkD)); stub.position.set(133.9+(b%2?0.4:-0.4), 0.9+b*1.05, -0.3); stub.rotation.z=(b%2?-1:1)*1.2; deco.add(stub); }
    const capT = mesh('cone',[0.9,1.4,6], mat(W9PAL.pineD)); capT.position.set(133.9,6.0,-0.55); deco.add(capT); }
  // THE BOUGH HIGH ROAD — six pine-bough platforms (y4.6-5.0, gaps <=2.8 tap at height), above every triplet
  // lane and spider thread, safely OVER the bauble apexes (ball apex top 3.36+0.7=4.06; worst body gap 1.84 vs
  // the 1.1 hit window). Its candy + the wings lantern glow read from the gauntlet mouth — the junction itch.
  platform(G, 137.2, 4.6, 0, 2.2, 1.6, W9PAL.pineD);
  platform(G, 141.6, 4.9, 0, 2.2, 1.6, W9PAL.pineD);
  platform(G, 146.0, 4.6, 0, 2.2, 1.6, W9PAL.pineD);
  platform(G, 150.4, 4.9, 0, 2.2, 1.6, W9PAL.pineD);
  platform(G, 155.0, 4.6, 0, 2.2, 1.6, W9PAL.pineD);
  platform(G, 159.4, 4.4, 0, 2.2, 1.6, W9PAL.pineD);
  candyLine(G, [[137.2,5.7,0],[141.6,6.0,0],[146,5.7,0]], 3);  // candy 3 (32) — the sky line, visible from below
  candyLine(G, [[150.4,6.0,0],[155,5.7,0],[159.4,5.5,0]], 3);  // candy 3 (35)
  G.ents.add(new BonkLantern(G, 159.4, 5.9, 0, 'bat'));        // the crown prize: 18s of wings for the finale
  deco.add(w9l5GrovePine(137.8, -2.2, 12, 1.25)); deco.add(w9l5GrovePine(150, -2.3, 12.5, 1.25)); deco.add(w9l5GrovePine(160.5, -2.1, 11.5, 1.2));
  // THE SPIDERS AMONG THE DECOYS — three ornament spiders at hangY 3.9 hidden in a row of seven BAKED decoys
  // at the same y, same colours (rattle + 0.6s unfold telegraph; they reel 0.9..3.9 fixed lanes, re-disguise
  // when you leave). The high road passes safely over their heads — they wake and reel below, theatrically.
  for(const [dx2, dc] of [[138.2,0xffd23f],[141.8,0xd83a4a],[145.2,0x3aa060],[150.7,0x7ae8ff],[153.2,0xd83a4a],[156.6,0xffd23f],[160.2,0x3aa060]]) deco.add(w9l5Decoy(dx2, 3.9, dc));
  G.ents.add(new OrnamentSpider(G, 140, 3.9, 0, {phase:0.0, dropY:0.9, wakeR:3.2, period:2.9, color:0xd83a4a}));
  G.ents.add(new OrnamentSpider(G, 149, 3.9, 0, {phase:0.9, dropY:0.9, wakeR:3.2, period:2.9, color:0xffd23f}));
  G.ents.add(new OrnamentSpider(G, 158, 3.9, 0, {phase:1.7, dropY:0.9, wakeR:3.2, period:2.9, color:0x7ae8ff}));
  // THE WRECKING BAUBLES — two ornament pendulums over the low road (ball low y2.3, sweeps +-2.51): WALKING
  // under is always safe (body gap 1.7 vs the 1.1 window); a mistimed HOP into the arc costs the heart. The
  // triplet lanes below force hops — hop where the bauble ISN'T (the sweep covers only 5u of each 10u lane):
  // a positional counter first, a timing counter second. Fixed phases, half-offset.
  G.ents.add(new W9Bauble(G, 142.8, 5.8, {len:3.5, amp:0.8, period:3.0, phase:0, r:0.7, color:0xd83a4a}));
  G.ents.add(new W9Bauble(G, 152.2, 5.8, {len:3.5, amp:0.8, period:3.0, phase:1.5, r:0.7, color:0x7ae8ff}));
  // THE BAUBLE TRIPLET LANES — the trio tradition, in glass (r0.82: a TAP always clears them — the speedrun
  // law). Lane #1 rolls east under bauble #1; lane #2 rolls WEST under spider #3 and the bat.
  G.ents.add(new BaubleTriplet(G, 136, 0, 0, {x1:146, speed:4.6, phase:0.0, pause:1.4, color:0xd83a4a}));
  G.ents.add(new BaubleTriplet(G, 166, 0, 0, {x1:156, speed:4.6, phase:1.9, pause:1.4, color:0x3aa060}));
  candyLine(G, [[138,0.9,0],[143,0.9,0],[147.5,0.9,0]], 3);    // candy 3 (38) — the low-road hop rhythm
  candyLine(G, [[151.5,0.9,0],[156,0.9,0],[160.5,0.9,0]], 3);  // candy 3 (41)
  // WREATH WISP #2 — contests the HIGH road (oval x145.9..151.1, y5.4..6.8, right across boughs 3-4): thread
  // the hole (candy inside — high-road bait) or pop the rim and eat the time. BLIZZARD BAT #2 owns the
  // dismount airspace (patrol 160..164 at y5.0, aggro 4 — trigger-drift reach west ~154). Worst low pinch
  // x156-162: spider #3 + triplet #2 + bat = 3 systems; worst high pinch: wisp + bat + bauble tips = 3.
  G.ents.add(new WreathWisp(G, 148.5, 6.1, 0, {phase:2.1, rx:2.6, ry:0.7, period:7.0}));
  G.ents.add(new Candy(148.5, 6.1, 0));                        // candy 1 (42) — the high hole
  G.ents.add(new BlizzardBat(G, 162, 5.0, 0, {phase:1.1, range:2, period:3.7, aggroR:4}));

  // =============================== BEAT 7 — THE CHIMNEY FINALE (x 168..197): exhale, upward ===============================
  // gauntlet ground ends 168; the old woodcutter camp ledge sits across a 2.0 tap-gap
  groundX(G, 170, 174.5, SNOW);
  signPost(G, 170.7, 1.7, -0.14, "The woodcutters' camp. The chimney still breathes warm - stand in the smoke and UP you go. Last one to the Tannenbaum is a rotten egg.");
  // sign clearance: updraft column 171.4..173.2 (0.7u east — the smoke lofts, it never hurts) · finale drop
  // lane min 178.45 (7.75u) · bat #2 worst reach = patrol max 164 + aggro 4 + post-dive drift 2 = 170 — the
  // reader at 170.7 sits past its worst drift, and triggering it at all means standing back over the gauntlet
  // side of the 168..170 gap (snapshot dives, no homing — the learned bat law holds at the finale's door).
  w9Updraft(G, 172.3, {w:1.8, top:8.6, baseY:0});              // the kit builds the chimney stack + live smoke
  candyLine(G, [[172.3,2.6,0],[172.3,4.8,0],[172.3,7.0,0]], 3);   // candy 3 (45) — the column, traced straight up
  { const logs = new THREE.Group();
    for(let i=0;i<5;i++){ const lg=mesh('cyl',[0.11,0.13,0.8,6], mat(i%2?W6PAL.wood:0x584232)); lg.rotation.x=Math.PI/2; lg.position.set(170.6+(i%3)*0.3, 0.14+Math.floor(i/3)*0.24, -2.1); logs.add(lg); }
    deco.add(logs); }
  // THE DESCENT — two boughs down through the wave's LAST two drop lanes (178.45..179.55 and 183.05..184.15,
  // both strictly between the standing pockets: bough #1 spans 175.6..178.0, bough #2 180.0..182.4, doorstep
  // starts 186 — every landing sits >=0.45u outside a lane and >=1.0u outside the hit width). Loft, drift
  // right, and step down on the beats you have counted since x33. The exam's last word is its first word.
  platform(G, 176.8, 5.2, 0, 2.4, 1.6, W9PAL.pineD);
  platform(G, 181.2, 3.8, 0, 2.4, 1.6, W9PAL.pineD);
  candyLine(G, [[176.8,6.1,0],[181.2,4.7,0]], 2);              // candy 2 (47)
  deco.add(w9l5GrovePine(183, -2.5, 12, 1.2));
  pitDressing(G, 168, 170, 'winter');
  pitDressing(G, 174.5, 186, 'winter');

  // =============================== THE DOORSTEP (x 186..197): the sign, the tree, the gate ===============================
  groundX(G, 186, 197, SNOW);
  candyLine(G, [[187,0.9,0],[190.8,0.9,0]], 2);                // candy 2 (49 placed — within the 35-60 budget)
  signPost(G, 189.5, 1.7, -0.1, "He was the FIRST tree they ever decorated. Three hundred years of being the center of it. Then the song stopped mid-verse.");
  deco.add(w9l5Tannenbaum(194.5, -5));                         // the Great Tannenbaum — dark but for one ornament
  deco.add(w6LightPost(187, -1.9, 3)); deco.add(w6LightPost(191.5, -1.9, 3));
  w6String(L, 187, 2.95, 191.5, 2.95, {z:-1.8});               // one last string — lit for him, not by him
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(192.5, 3.4, -1); S.add(lamp); }
  exitGate(G, 192);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // light budget: Advent Stump glow + GP glow + lit lantern + gate lamp = 4 real PointLights (<=6 law)
  deco.add(w6Pine(-5, -2.8, 1.2)); deco.add(w6Pine(30.5, 2.6, 1.1)); deco.add(w6Pine(111.5, -2.6, 1.15));
  // FOREGROUND silhouettes (z>0): near-black pine cones framing the depth
  for(const [fx2,fs] of [[50,1.1],[98,1.25],[128,1.05],[165,1.2]]){
    const sil = mesh('cone',[1.3*fs, 3.6*fs, 6], mat(0x0c1420)); sil.position.set(fx2, 1.5*fs, 2.7); deco.add(sil);
  }
  S.add(bakeGroup(deco));

  // the winter moon through the canopy, low over the grove
  const moon = mesh('circ',[4.0,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(110, 15, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.4,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(110, 15, -30.2); S.add(moonH);

  // THE WAVE — one clock (P=6.3), every lane phased 0.7 apart: corridor 0..3.5, ravine 4.2/4.9, finale 0/0.7
  // (the finale lanes reuse the early beat slots — by then the corridor is 145u behind you; one song, one march)
  w9l5OrnamentFall(G, [
    {x:33,   topY:9.5,  at:0.0},              // corridor — grounded (floor rings)
    {x:38,   topY:9.5,  at:0.7},
    {x:43,   topY:9.5,  at:1.4},
    {x:48,   topY:9.5,  at:2.1},
    {x:53,   topY:9.5,  at:2.8},
    {x:58,   topY:9.5,  at:3.5},
    {x:76.8, topY:10,   at:4.2, floorY:-2.4}, // ravine — void (shimmer-beams), between the swings' sweeps
    {x:93.8, topY:10,   at:4.9, floorY:-2.4},
    {x:179,  topY:10.5, at:0.0, floorY:-2.4}, // finale — void, between the descent boughs
    {x:183.6,topY:10.5, at:0.7, floorY:-2.4},
  ], 6.3);

  w9Parallax(S, -8, 197);
  w9LevelFinish(G, -8, 197, null);            // null clutter: baked props must not float over the two ravines
  w9Clutter(G, -8, 63.5, 'forest');           // ...so the solid spans are cluttered manually (w7l4 precedent)
  w9Clutter(G, 96.5, 167.5, 'forest');
  w9Clutter(G, 186, 197, 'forest');

  w6LightsFinish(G, L);                       // festival strings live (shared mats + one twinkle ticker)

  return {spawnX: 0, exitX: 192};
}

function updateW9L5(G, dt){
  updateLevelCommon(G, dt);
}

W9_LEVELS.push({id:'w9l5', district:'w9', name:"TANNENBAUM'S GROVE", build:buildW9L5, update:updateW9L5, parTime:190});

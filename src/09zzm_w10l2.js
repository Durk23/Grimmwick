// ============ LEVEL 10-2 — THE ADVENT HALL (District 10 · The Aurora Palace · where the cold sits crowned) ============
// WINTER FINALE BAND (owner lock): the summit of the beyond-D5 curve — the ultimate exam, still MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away, never
// Kaizo). 10-2 is the CLOCKWORK DOOR WALL level: the palace counts its days on great calendar doors that open
// and shut on fixed clocks — the way through is whichever number is lit, and the calendar does not wait.
// Introduce (one wall, generous slots) → twist (doors at DIFFERENT HEIGHTS choose your route) → escalate (two
// walls back to back, offset phases: thread both in one committed run, or wait out a cycle in the antechamber)
// → master (THE LONG CALENDAR: three walls, marching toy soldiers lending their hats in the corridors, and a
// posted Herald whose gust covers one door's approach on alternating cycles).
// 14 movers/threats: 11 enemies (2 FrostKnight + 2 FrostHerald + 2 MirrorFrost + 1 AuroraWisp + 2 FlurryTriplet
// + 2 SnowBoo) + 3 toy-soldier hat platforms (harmless — the Guard is far too polite). NO Golden Pumpkin,
// NO warp (the guest chair lives in another level), NO Leap of Faith (both of the game's two are placed and sacred).
//
//   BEAT 1 THE RECEIVING LINE       x -8..26   — CP0 (noLight), the court's welcome, SnowBoo #1 (the winter
//          stare rule, refreshed), gap #1 (x19..22 — the masons stopped coming too).
//   BEAT 2 THE CLOAKROOM            x 26..48   — FrostChest gamble in its clear pocket; the quiet prop waits
//          behind a little open door at the back of the hall. Nothing bites here.
//   BEAT 3 THE FIRST DOOR (INTRO)   x 48..66   — WALL 1: floor door + balcony door on GENEROUS slots (period 9,
//          something is open 6s of every 9). Steps up teach that doors live at heights; both roads rejoin.
//   BEAT 4 THE MIRROR GALLERY       x 66..86   — MirrorFrost #1: the pane walks AGAINST your own velocity.
//          The feint taught here is the master exam's secret rhythm (your dodge steps move the mirror too).
//   BEAT 5 THE TWIST                x 86..112  — WALL 2: the two doors CHOOSE YOUR ROUTE. Floor door → gap #2
//          + FrostKnight corridor (the toll). Balcony door (via the VELVET BANNER climb) → shelf line + candy.
//   BEAT 6 THE LANTERN              x ~112     — THE lit checkpoint (x112 of a 210 run ≈ 53%). A true breath.
//   BEAT 7 THE ESCALATE             x 114..138 — WALLS 3+4 back to back, phases 1.4s apart: the brisk guest
//          threads both floors in one stride (the racing line); the patient guest waits in the antechamber
//          (proven safe below). The high thread runs the same gauntlet under the AuroraWisp's freezing wake.
//   BEAT 8 THE HERALD'S POST        x 138..152 — FrostHerald #1 alone with a sign: read the horn once, in
//          isolation (0.7s raise + rising third → gust lane; hop it or stomp him). Heart + shield before the exam.
//   BEAT 9 THE LONG CALENDAR (MASTER) x 152..192 — WALLS 5/6/7 on one shared 8s clock, phases 0 / 1.2 / 2.4:
//          the committed floor thread IS the racing line (candy through all three doorways). Corridor A-B:
//          FrostKnight #2 (reach tuned flush to both faces — waiting at a shut door is CONTESTED; the pedestal,
//          the shelf and the hat are the refuges) + Herald #2 posted at the B door, period 16 = his gust covers
//          the approach on ALTERNATING door cycles. Corridor B-C: MirrorFrost #2 — thread the door while your
//          own feints walk the pane. Soldiers march every corridor; their hats are the high line.
//   BEAT 10 THE FAREWELL            x 192..206 — SnowBoo #2 + FlurryTriplet #2 keep the walk-up honest, the
//          court says the quiet part almost out loud, gate at 202.
//
// THE WALL CLOCKS (all fixed from level start; a door's number glows 0.7s before it shuts — the kit's warning):
//   W1 intro   x58   period 9  openT 3.0  phase 0    floor open t 0-3    · balcony t 6-9      (mod 9)
//   W2 twist   x93   period 8  openT 2.4  phase 0    floor t 0-2.4      · balcony t 4.8-7.2   (mod 8)
//   W3 esc-A   x120  period 8  openT 2.0  phase 0    floor t 0-2        · high t 4-6
//   W4 esc-B   x131  period 8  openT 2.0  phase 6.6  floor t 1.4-3.4    · high t 5.4-7.4      (thread: +1.4s)
//   W5 cal-A   x162  period 8  openT 2.0  phase 0    floor t 0-2        · high t 4-6
//   W6 cal-B   x174  period 8  openT 2.0  phase 6.8  floor t 1.2-3.2    · high t 5.2-7.2      (thread: +1.2s)
//   W7 cal-C   x186  period 8  openT 2.0  phase 5.6  floor t 2.4-4.4    · high t 6.4-8.4      (thread: +2.4s)
// Thread math at honest sprint (~6.5-8u/s): 11-12u corridors cross in 1.5-1.9s → every window is made with
// 0.7-1.4s in hand. Miss one and the antechambers/corridors are the wait (max wait < one 8-9s period).
//
// ROUTES (2-3 visible, junctions sighted): LOW = the floor doors + corridors (the safe read) · HIGH = balcony
// doors via steps, the velvet banner climb, and the soldiers' hats — more candy, the wisp and the timing to pay
// for it (every balcony's candy is visible from the floor: the "next run I'm going up there" itch) · FAST LINE =
// the committed door-threads on the phase beats — candy traces the racing line through every open doorway, and
// every machine has a fast answer: stomp Herald #1, pound a Knight (one-shot), feint a Mirror once and sprint,
// ride the phase cascade through the Long Calendar without ever stopping dead.
// COMPARABLE HEIGHTS: main route is FLAT; steps/pedestals 1.5 (tap 1.8, over-clearance) · pedestal→hat 2.0 and
// shelf 3.0 via 1.5+1.5 steps or the banner climb (double 3.3 also reaches, candy-traced) · gaps: #1 3.0 and
// #2 3.5 (tap law <=4), high-shelf gaps 1.6-2.6 · doorways 2.3 tall (player 1.5) · walls 8.5 tall — NO verb
// clears them (double off a hat 3.5+3.3=6.8; spring off a shelf 3.0+4.4=7.4; both < 8.5 — anti-cheese margin).
// HEARTS ALWAYS: a shutting door never bites — it POLITELY SQUEEZES the player out of the doorway along x
// (lane plugs are full-depth so the push resolves in x, never a crush, never damage); every enemy costs
// exactly 1; pits are the kit's full pit price (heart + lantern walk-back).
// DETERMINISM: every wall/herald/wisp/flurry/soldier rides a fixed clock+phase from level start; knights,
// mirrors and boos are player-reactive on fixed homes (the w7l4 angler precedent); Math.random appears only in
// cosmetic kit particles and the opt-in gamble.
//
// ---- WHY w10l2Wall EXISTS (the kit workaround, pinned): w10AdventWall adds ONE always-solid full-wall box,
// and its shut-door plug sits at z 0.2..1.6 — a z-damped lane player is only NUDGED by it. As shipped, a door
// can neither open a passage (monolith stays solid) nor reliably block one (plug is off-lane). The wrapper
// re-types the kit's monolith to 'ghost' (it is the FIRST collider the kit adds — col-order dependency, pinned
// here), carves real solid segments around each door's y-band (so doorways are true holes with thresholds and
// lintels), and adds full-depth LANE plugs that MIRROR the kit plugs' solid/ghost state — the kit's own clock
// stays the single source of truth. (EntityMgr iterates NEWEST-FIRST, so the mirror ent — added after the kit
// ent — reads the plug's previous-frame type: a one-frame lag, invisible against 0.7s warnings and 2s+
// windows, and always on the FORGIVING side at the shut edge. w10l5 mirrors its backers the same way.) ----
function w10l2Wall(G, opts){
  const i0 = G.world.cols.length;                       // kit's first addBox = the monolith
  const made = w10AdventWall(G, opts);
  G.world.cols[i0].type = 'ghost';                      // neutralized — segments below are the real wall
  const x = opts.x, w = opts.w, h = opts.h;
  const dys = made.map(m => m.dy).sort((a,b)=>a-b);
  let y = 0;
  for(const dy of dys){
    if(dy - y > 0.05) G.world.addBox(x, y, 0, w, dy - y, 3, {});   // sliver between stacked doors = the high threshold
    y = dy + 2.3;
  }
  if(h - y > 0.05) G.world.addBox(x, y, 0, w, h - y, 3, {});       // the lintel run to the wall top
  // doorway insets — dark arches behind the sliding panels so an open door READS open (w10l5 parity)
  { const ig = new THREE.Group();
    for(const m of made){ const inset = mesh('box',[1.5,2.1,0.05], emat(0x0a0c1c, 0x141c34, 0.25)); inset.position.set(m.dx, m.dy+1.15, 1.51); ig.add(inset); }
    G.scene.add(bakeGroup(ig)); }
  const plugs = made.map(m => ({kit:m.plug, lane:G.world.addBox(m.dx, m.dy, 0, w + 0.2, 2.3, 3, {})}));
  G.ents.add({ dead:false, cull:false, isEnemy:false, group:new THREE.Group(),
    update(){ for(const p of plugs) p.lane.type = p.kit.type; } });
  return made;
}

// ---- THE VELVET BANNER — this level's climbable flavor (climb volume + visible velvet runner): a court
// banner hung to the twist balcony. Velvet = climbable is the hall's language; the climb-exit boosted hop
// has candy targets. Returns baked deco; the climb volume is added here (w5Chain idiom). ----
function w10l2Banner(G, x, topY){
  const g = new THREE.Group();
  const rod = mesh('cyl',[0.05,0.05,1.5,6], mat(W10PAL.regalG)); rod.rotation.z = Math.PI/2; rod.position.set(x, topY+0.5, 0); g.add(rod);
  for(const s of [-1,1]){
    const strip = mesh('box',[0.42,topY+0.35,0.06], mat(s>0?W10PAL.velvet:W10PAL.velvetD));
    strip.position.set(x+s*0.24, (topY+0.35)/2+0.12, -0.04); g.add(strip);
    const fringe = mesh('box',[0.42,0.14,0.08], mat(W10PAL.regalG)); fringe.position.set(x+s*0.24, 0.16, -0.02); g.add(fringe);
  }
  const gem = mesh('sph',[0.1,6,5], emat(W10PAL.frost, W10PAL.frost, 0.8)); gem.position.set(x, topY*0.6, 0.03); g.add(gem);
  G.world.addBox(x, 0, 0, 0.9, topY+0.3, 1.2, {type:'climb'});
  return g;
}

// ---- THE QUIET PROP: behind a little door at floor level — a door that stands open, has ALWAYS stood open —
// a tiny table set for two. Two cups. One chair. Ten thousand years of perfect manners and nobody to pour for;
// they kept the second cup out anyway. Never signposted; fully baked; story-readers stop, everyone else walks
// past a small open door in a very large hall. ----
function w10l2TableForTwo(x, z){
  const g = new THREE.Group();
  // the little annex — back panel, side jambs, a low roof, and the door swung wide on its hinge (forever)
  const back = mesh('box',[3.0,2.3,0.14], mat(W10PAL.wall)); back.position.set(x, 1.15, z-1.0); g.add(back);
  const roof = mesh('box',[3.2,0.2,2.0], mat(0x2a3a60)); roof.position.set(x, 2.3, z-0.2); g.add(roof);
  for(const s of [-1,1]){ const jamb = mesh('box',[0.16,1.9,0.16], mat(0x2a3a60)); jamb.position.set(x+s*0.62, 0.95, z+0.7); g.add(jamb); }
  const lintel = mesh('box',[1.5,0.18,0.2], mat(W10PAL.regalG)); lintel.position.set(x, 1.95, z+0.7); g.add(lintel);
  const door = mesh('box',[1.05,1.75,0.08], mat(W10PAL.regalS)); door.position.set(x-1.06, 0.9, z+0.42); door.rotation.y = 2.1; g.add(door);   // swung wide, always
  // the table — round, dusted with frost, kept ready
  const top = mesh('cyl',[0.55,0.6,0.1,10], mat(0x5a3a20)); top.position.set(x, 0.62, z-0.25); g.add(top);
  const leg = mesh('cyl',[0.08,0.12,0.6,6], mat(0x4a2f1a)); leg.position.set(x, 0.31, z-0.25); g.add(leg);
  const cloth = mesh('cyl',[0.5,0.5,0.03,10], mat(W10PAL.velvet)); cloth.position.set(x, 0.685, z-0.25); g.add(cloth);
  // two cups — one at the chair, one across from it, facing nothing
  for(const s of [-1,1]){
    const cup = mesh('cyl',[0.07,0.05,0.1,7], mat(W10PAL.regalS)); cup.position.set(x+s*0.26, 0.75, z-0.25); g.add(cup);
    const hd = mesh('tor',[0.05,0.015,4,8,Math.PI], mat(W10PAL.regalS)); hd.position.set(x+s*0.35, 0.76, z-0.25); hd.rotation.z = s>0?-0.4:2.7; g.add(hd);
  }
  // one chair. only one was ever needed. they set two places anyway.
  const seat = mesh('box',[0.44,0.08,0.42], mat(0x5a3a20)); seat.position.set(x-0.65, 0.36, z-0.25); g.add(seat);
  const backr = mesh('box',[0.08,0.6,0.42], mat(0x5a3a20)); backr.position.set(x-0.86, 0.66, z-0.25); g.add(backr);
  for(const [lx,lz] of [[-0.47,-0.42],[-0.47,-0.08],[-0.83,-0.42],[-0.83,-0.08]]){
    const cl = mesh('box',[0.05,0.36,0.05], mat(0x4a2f1a)); cl.position.set(x+lx, 0.18, z+lz); g.add(cl);
  }
  // a candle burning COLD between the cups (the clutter language) + frost settled on the tabletop's far edge
  const cand = mesh('cyl',[0.05,0.06,0.24,6], mat(W10PAL.regalS)); cand.position.set(x, 0.8, z-0.42); g.add(cand);
  const fl = mesh('sph',[0.05,5,4], emat(0x7ae8ff, 0x7ae8ff, 0.9)); fl.position.set(x, 0.95, z-0.42); g.add(fl);
  const frost = mesh('sph',[0.2,6,5], mat(0xdfe8fa)); frost.scale.y = 0.3; frost.position.set(x+0.4, 0.68, z-0.38); g.add(frost);
  return g;
}

// ---- palace candelabra (baked deco — cold flames, no real lights) ----
function w10l2Candelabra(x, z){
  const g = new THREE.Group();
  const stem = mesh('cyl',[0.07,0.12,2.0,7], mat(0x2a3a60)); stem.position.set(x, 1.0, z); g.add(stem);
  const base = mesh('cyl',[0.35,0.42,0.12,8], mat(0x2a3a60)); base.position.set(x, 0.06, z); g.add(base);
  for(const s of [-1,0,1]){
    if(s!==0){ const arm = mesh('tor',[0.28,0.035,4,8,Math.PI], mat(W10PAL.regalG)); arm.position.set(x+s*0.14, 1.9, z); arm.rotation.z = s>0?-Math.PI/2:Math.PI; g.add(arm); }
    const cup = mesh('cyl',[0.07,0.05,0.1,6], mat(W10PAL.regalG)); cup.position.set(x+s*0.42, s===0?2.16:1.98, z); g.add(cup);
    const fl = mesh('sph',[0.06,5,4], emat(0x7ae8ff, 0x7ae8ff, 0.9)); fl.position.set(x+s*0.42, s===0?2.3:2.12, z); g.add(fl);
  }
  return g;
}

function buildW10L2(G){
  const S = G.scene;
  levelBegin(G);

  const FLOOR = W10PAL.iceD;                 // grippy palace parquet-ice (precision door beats live on honest footing)
  const deco = new THREE.Group();            // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE RECEIVING LINE (x -8..26) ===============================
  groundX(G, -8, 19, FLOOR);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  // SPAWN SAFETY (idle player at x0/z0, CP0 respawn at x2/z1.6): SnowBoo #1 home x15 with chaseR 11 — an idler
  // at x2 sits at hd 13 > 11, so the boo floats HOME, never to the lantern (worst lured bite <=25.5, opt-in) ·
  // FrostChest ambush lanes (chest x35.5, kit offsets ±10): left lanes end x22.9/24.1 → bites >=22.14 (20u
  // clear) · Mirror #1 bites >=71.84 · Knight #1 reach <=109.68 · all later systems >=119. Door walls, soldiers
  // and shutting plugs are HARMLESS everywhere (push-out, never damage). The line receives; it does not bite.
  signPost(G, 7, -0.15, -0.1, "THE ADVENT HALL. The court has kept every day of ten thousand years. You are, if we may say so, punctual at last.");
  candyLine(G, [[4.5,0.9,0],[7.5,0.9,0]], 2);
  // the stare rule, refreshed — freeze it into a standing block. Leash PINNED on the instance (SnowBoo doesn't
  // unpack a chaseR opt — the w6l2 gotcha; the leash reads this.chaseR||14, and 14 would chase a CP0 idler at hd 13)
  { const b1 = new SnowBoo(G, 15, 0, 0, {phase:0.4, speed:2.0, range:9, freezeMax:2.4}); b1.chaseR = 11; G.ents.add(b1); }
  G.ents.add(new Crow(12, 0.95, 2.1));       // winter crow #1 — court raven, unimpressed
  // GAP #1 (x19..22, 3.0u tap law) — even the masons stopped coming; the candy arc teaches the hop
  pitDressing(G, 19, 22, 'winter');
  candyLine(G, [[18.5,1.0,0],[20.5,2.2,0],[22.5,1.0,0]], 3);

  // =============================== BEAT 2 — THE CLOAKROOM (x 26..48) ===============================
  groundX(G, 22, 95.4, FLOOR);               // one long hall run to gap #2's west lip
  candyLine(G, [[27,0.9,0],[29.5,0.9,0],[32,0.9,0]], 3);
  // THE FROST-LOCKED CHEST — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math): SnowBoo #1
  // maximum lured approach = leash edge player x26 → boo x24.8 + touchR 0.72 = 25.52 (9.98u clear) · Mirror #1
  // clamps at x72.5, bites >=71.84 (36u) · Knight #1 left reach >=98.32 (63u) · everything else lives past x119 ·
  // CP0 20u+ from the nearest ambush-lane bite. Opening is a deliberate, safe act; the flurry ambush spawns on
  // the kit's 1s grace, and its lanes (25.5..48.4 at worst) never reach a checkpoint or a wall's waiting face.
  { const c = new FrostChest(35.5, 0, -0.9, 0.3); G.coffins.push(c); G.ents.add(c); }
  // THE QUIET PROP (never signposted): the little door that always stood open, and the table set for two
  deco.add(w10l2TableForTwo(44, -2.35));
  deco.add(w10l2Candelabra(29, -2.6));

  // =============================== BEAT 3 — THE FIRST DOOR (x 48..66): INTRODUCE the calendar ===============================
  // sign tucked back at z-1.9 (readers stand x49.5..51.3 — 0.24u clear of the chest's worst right-lane bite
  // at 49.26; opt-in ambush, telegraphed rolling ball, w7l4's 1.1u-margin precedent honored in spirit)
  signPost(G, 50.4, -1.9, 0.15, "The doors keep the calendar. The calendar does not wait. Kindly pass while your number is lit - and do stand clear when it dims.");
  platform(G, 52.6, 1.5, 0, 2.4, 2.6, W10PAL.regalS);     // steps to the balcony door — 1.5 rises, over-clearance
  platform(G, 56.1, 3.0, 0, 2.2, 2.6, W10PAL.regalS);     // shelf flush to the wall face (55.0..57.2)
  w10l2Wall(G, {x:58, w:1.6, h:8.5, period:9, openT:3.0, phase:0,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});   // floor t0-3 · balcony t6-9 — something is open 6s of every 9
  platform(G, 59.9, 3.0, 0, 2.2, 2.6, W10PAL.regalS);     // landing balcony (58.8..61.0), then drop home — both roads rejoin
  candyLine(G, [[56.5,0.9,0],[58,0.9,0],[59.5,0.9,0]], 3);      // the floor thread
  candyLine(G, [[56.8,3.9,0],[58,3.9,0],[59.2,3.9,0]], 3);      // the balcony pays — visible from below (junction itch)
  G.ents.add(new Crow(64, 0.95, 2.2));       // crow #2 — watches the doors. has seen every one of them.

  // =============================== BEAT 4 — THE MIRROR GALLERY (x 66..86) ===============================
  signPost(G, 68, -0.1, -0.12, "The gallery remembers every guest who never came. If your reflection walks against you, give it a step it does not want - then take the one it leaves.");
  // Mirror #1 — home 77.5, hall clamp 72.5..82.5 (bites 71.84..83.16: sign readers at <=70.6 stay 1.2u clear;
  // the banner's base at 89 stays 5.8u clear). The feint taught here is the Long Calendar's secret rhythm.
  G.ents.add(new MirrorFrost(G, 77.5, 0, 0, {phase:0, range:5, mirror:1}));
  candyLine(G, [[72,0.9,0],[76,0.9,0],[80,0.9,0]], 3);          // the dash-past line
  deco.add(w10l2Candelabra(70, -2.6)); deco.add(w10l2Candelabra(85, -2.6));

  // =============================== BEAT 5 — THE TWIST (x 86..112): the doors choose your route ===============================
  // THE VELVET BANNER — climb to the balcony shelf (89.6..92.2, flush to wall 2's face); the twist junction:
  // from the wall's foot you SEE the balcony candy and the shelf line beyond the wall
  deco.add(w10l2Banner(G, 89, 3.0));
  candyLine(G, [[89,1.8,0],[89,3.6,0]], 2);                     // rungs up the velvet + the climb-exit hop target
  platform(G, 90.9, 3.0, 0, 2.6, 2.6, W10PAL.regalS);
  w10l2Wall(G, {x:93, w:1.6, h:8.5, period:8, openT:2.4, phase:0,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});   // floor t0-2.4 · balcony t4.8-7.2 — pick your road by its clock
  // HIGH ROAD — shelf line (misses demote to the floor corridor, live ground; the first hop threads the open
  // balcony doorway itself: shelf edge 92.2 → p1 at 94.3, a 2.1u tap through the door)
  platform(G, 95.9, 3.0, 0, 3.2, 2.6, W10PAL.regalS);           // p1 (94.3..97.5) — over gap #2's void: a missed board here pays the pit price
  platform(G, 100.6, 3.0, 0, 3.0, 2.6, W10PAL.regalS);          // p2 (99.1..102.1), 1.6u gap
  platform(G, 105.8, 3.0, 0, 2.8, 2.6, W10PAL.regalS);          // p3 (104.4..107.2), 2.3u gap, then drop to the lantern
  candyLine(G, [[95.9,3.9,0],[100.6,3.9,0],[105.8,3.9,0]], 3);
  // LOW ROAD — the floor door pays a toll: GAP #2 (95.4..98.9, 3.5u) straight off the threshold (candy-arced),
  // then the knight corridor. Knight #1 home 104, range 1.5 (patrol 102.5..105.5): lunge reach 98.32..109.68 —
  // 0.58u past the gap's east lip at worst (noted), 2.32u short of the lantern. Bow 0.7s is the telegraph;
  // a pound one-shots him (the fast answer).
  pitDressing(G, 95.4, 98.9, 'winter');
  candyLine(G, [[94.9,1.0,0],[97.2,2.3,0],[99.4,1.0,0]], 3);
  G.ents.add(new FrostKnight(G, 104, 0, 0, {phase:0, range:1.5, dir:-1, speed:1.4}));
  candyLine(G, [[101.4,0.9,0],[104.8,0.9,0]], 2);

  // =============================== BEAT 6 — THE LANTERN (x ~112): the level's ONE lit checkpoint ===============================
  groundX(G, 98.9, 206, FLOOR);              // the hall's long east run
  // LANTERN SAFETY (idle at x112/z1.6, ~53% of the 210u run): Knight #1 worst reach 109.68 (2.32u + the z
  // offset) · Wisp wake bites >=x119 and only at |z|<0.9 · escalate walls/plugs harmless · Herald #1 beam
  // >=142.5 · flurry lanes >=152 · Mirror #2 >=175.74 · SnowBoo #2 leash needs a player past x181.5. A breath.
  G.ents.add(new Checkpoint(112, 0, 1.6, 1));
  candyLine(G, [[110.4,0.9,0],[113.6,0.9,0]], 2);

  // =============================== BEAT 7 — THE ESCALATE (x 114..138): two doors, one stride ===============================
  signPost(G, 114.6, 1.4, 0.12, "Two doors keep two clocks, a breath apart. The brisk guest threads both in one stride. The patient guest is welcome in the antechamber, for as long as patience takes.");
  platform(G, 116.6, 1.5, 0, 2.2, 2.6, W10PAL.regalS);          // steps to the high thread
  platform(G, 118.3, 3.0, 0, 1.8, 2.6, W10PAL.regalS);          // launch shelf flush to wall 3 (117.4..119.2)
  w10l2Wall(G, {x:120, w:1.6, h:8.5, period:8, openT:2.0, phase:0,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});
  w10l2Wall(G, {x:131, w:1.6, h:8.5, period:8, openT:2.0, phase:6.6,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});     // +1.4s: enter A on its beat, sprint 11u, B opens as you arrive
  // THE ANTECHAMBER (ground 120.8..130.2) — the safe line, PROVEN: the wisp's wake rides y3.8..5.4 and its
  // bite window needs wake y < 1.5 to touch a floor-stander — it NEVER threatens the ground (high thread only).
  // No other system reaches between the walls. Waiting here is honest rest on the exam's hardest page.
  platform(G, 122.6, 3.0, 0, 3.2, 2.6, W10PAL.regalS);          // high mid-ledges (121.0..124.2 · 126.8..130.0), 2.6u gap
  platform(G, 128.4, 3.0, 0, 3.2, 2.6, W10PAL.regalS);
  platform(G, 133.6, 3.0, 0, 2.4, 2.6, W10PAL.regalS);          // exit shelf past wall 4, then drop
  G.ents.add(new AuroraWisp(G, {x0:119.5, x1:131.5, y:4.6, period:7, amp:0.8, phase:2.1, color:0x7ae8ff}));
  candyLine(G, [[119.6,0.9,0],[125.5,0.9,0],[131.4,0.9,0]], 3); // the floor racing line
  candyLine(G, [[122.6,3.9,0],[125.5,4.1,0],[128.4,3.9,0]], 3); // the high thread — cross the wake on the fade
  deco.add(w10l2Candelabra(137, -2.6));

  // =============================== BEAT 8 — THE HERALD'S POST (x 138..152): read the horn once, alone ===============================
  signPost(G, 139.5, -0.1, -0.1, "When the Herald raises his horn, the hall observes a brief, forceful silence. You may hop the announcement. He has never once minded.");
  // Herald #1 at 147.5 (dir -1): beam lane 142.5..146.7 at y0.9 on a 5.2s clock — sign readers at <=142.1 stay
  // clear; the candy arc traces the hop over gust and trumpeter both; a stomp deletes him (the fast answer)
  G.ents.add(new FrostHerald(G, 147.5, 0, 0, {phase:1.0, period:5.2, reach:4.2, dir:-1}));
  candyLine(G, [[143.8,1.0,0],[145.6,2.5,0],[148.2,1.0,0]], 3);
  G.ents.add(new Heart(149.8, 1.0, 0));                          // mercy before the exam
  G.ents.add(new BonkLantern(G, 150.9, 1.6, 0, 'shield'));       // armor for the Long Calendar

  // =============================== BEAT 9 — THE LONG CALENDAR (x 152..192): MASTER ===============================
  // sign before the flurry lane (reader edge 152.5 vs the lane's spawn-end bite from 151.24 — the orb spawns
  // small with a visible puff and rolls one way on a fixed clock; reading is a breath, not a trap)
  signPost(G, 149.9, 1.5, 0.14, "THE LONG CALENDAR. Three doors, one appointment, no waiting room. The Guard will lend the tops of their hats. They are far too polite to object.");
  // APPROACH CORRIDOR (152..161.2): Flurry #1 rolls its lane (152.0..156.7 with touch), the pedestal (top 1.5 —
  // a flurry's bite window tops out at y1.29: pedestal-standers are safe) boards Soldier #1's hat (top 3.5,
  // a 2.0u step) for the high line THROUGH wall 5's balcony door
  G.ents.add(new FlurryTriplet(G, 152.8, 0, 0, {x1:155.9, speed:4.4, phase:0.6, pause:1.1}));
  candyLine(G, [[152.4,0.9,0],[154.5,2.0,0],[156.6,0.9,0]], 3);  // the hop rhythm over the lane
  platform(G, 157.6, 1.5, 0, 1.8, 2.4, W10PAL.regalS);           // boarding pedestal (156.7..158.5)
  w10Soldier(G, {x0:158.2, x1:161, y:0, speed:1.4, phase:0});    // Soldier #1 — marches to wall 5's face and about-turns
  w10l2Wall(G, {x:162, w:1.6, h:8.5, period:8, openT:2.0, phase:0,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});      // CAL-A
  platform(G, 163.7, 3.0, 0, 1.8, 2.4, W10PAL.regalS);           // high shelf behind A (162.8..164.6)
  // CORRIDOR A-B (162.8..173.2): Knight #2 home 168 range 1.0 — his lunge reaches 162.82..173.18, tuned FLUSH
  // to both wall faces (never clips a wall, ALWAYS contests a door-hugger: waiting on the floor is a dodge, not
  // a nap — the pedestal at 171 (top 1.5, above his 1.35 bite window), the shelf and the hat are the refuges).
  // Herald #2 stands doorman at wall 6 (z-1.05 — out of the walk lane, beam still owns it): period 16 = his
  // gust (167.6..171.8 at y0.9) covers the B-door approach on ALTERNATING open cycles; phase 6.0 lays the blast
  // across every second t 9.2-10.2 window while the t 1.2-3.2 windows stay clean. Read which cycle you're on.
  // Simultaneity here: door clocks + knight + herald = 3 systems (cap 4 honored; soldiers are furniture).
  G.ents.add(new FrostKnight(G, 168, 0, 0, {phase:0.5, range:1.0, dir:1, speed:1.3}));
  G.ents.add(new FrostHerald(G, 172.6, 0, -1.05, {phase:6.0, period:16, reach:4.2, dir:-1}));
  platform(G, 171, 1.5, 0, 1.8, 2.4, W10PAL.regalS);             // the waiter's pedestal (170.1..171.9) — boards Soldier #2
  w10Soldier(G, {x0:169.8, x1:172.6, y:0, speed:1.4, phase:1.0}); // Soldier #2 — the hat over the contested wait
  w10l2Wall(G, {x:174, w:1.6, h:8.5, period:8, openT:2.0, phase:6.8,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});      // CAL-B (+1.2s)
  platform(G, 175.7, 3.0, 0, 1.8, 2.4, W10PAL.regalS);           // high shelf behind B (174.8..176.6)
  // CORRIDOR B-C (174.8..185.2): Mirror #2 (clamp 176.4..183.6) — the master twist: every dodge-step you take
  // walks the pane too; thread the C door while FEINTING the mirror off your line (taught in the gallery).
  // Soldier #3 marches the whole corridor — the hat line rides above the mirror's reach.
  G.ents.add(new MirrorFrost(G, 180, 0, 0, {phase:0.6, range:3.6, mirror:1}));
  w10Soldier(G, {x0:177.4, x1:184.4, y:0, speed:1.8, phase:0.4}); // Soldier #3
  w10l2Wall(G, {x:186, w:1.6, h:8.5, period:8, openT:2.0, phase:5.6,
    doors:[{dx:0, dy:0, slot:0}, {dx:0, dy:3.0, slot:2}]});      // CAL-C (+2.4s — the committed thread's last beat)
  platform(G, 187.7, 3.0, 0, 1.8, 2.4, W10PAL.regalS);           // high shelf behind C, then drop to the farewell
  candyLine(G, [[162,0.9,0],[168,0.9,0],[174,0.9,0],[180,0.9,0],[186,0.9,0]], 5);   // THE RACING LINE — through all three doorways on the phase cascade
  candyLine(G, [[163.7,3.9,0],[171,4.3,0],[175.7,3.9,0],[181,4.3,0],[187.7,3.9,0]], 5);   // the hat line — visible from the floor
  deco.add(w10l2Candelabra(158, -2.7)); deco.add(w10l2Candelabra(190.5, -2.6));

  // =============================== BEAT 10 — THE FAREWELL (x 192..206) ===============================
  // the walk-up stays honest (fabric law): SnowBoo #2 (leashed off home 195.5) + Flurry #2's one-way lane
  // (192.5→198; sign readers at >=198.2 sit 1.4u into its telegraphed east end — the ball is loud, slow, and
  // pauses in plain sight; w7l4's flush-margin precedent)
  G.ents.add(new SnowBoo(G, 195.5, 0, 0, {phase:1.2, speed:2.1, range:9, freezeMax:2.4}));
  G.ents.add(new FlurryTriplet(G, 192.5, 0, 0, {x1:198, speed:4.2, phase:2.0, pause:1.2}));
  G.ents.add(new Crow(191, 0.95, 2.1));      // crow #3 — sees you out. almost nods.
  candyLine(G, [[194,0.9,0],[197,0.9,0]], 2);
  signPost(G, 200.8, 1.5, 0.1, "You kept the appointment ten thousand years of doors were set for. The court is - forgive us - the court is very glad you came.");
  candyLine(G, [[200.2,0.9,0],[201.4,0.9,0]], 2);
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(200.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome — the hall's one warm thing
  exitGate(G, 202);

  // =============================== DECO · RUNNER · SILHOUETTES · PARALLAX · TAIL ===============================
  // THE VELVET RUNNER — the court carpet down the whole hall (skipping the two gaps): it quietly marks the
  // racing line the candy traces
  for(const [r1,r2] of [[-7,18.6],[22.4,95],[99.3,204]]){
    const run = mesh('box',[r2-r1,0.05,1.5], mat(W10PAL.velvet)); run.position.set((r1+r2)/2, 0.06, 0); deco.add(run);
    for(const zz of [-0.85,0.85]){ const trim = mesh('box',[r2-r1,0.06,0.08], mat(W10PAL.regalG)); trim.position.set((r1+r2)/2, 0.065, zz); deco.add(trim); }
  }
  // FOREGROUND silhouettes (z>0): fallen balustrade runs + drapes framing the depth
  for(const [fx,fr] of [[34,0.35],[74,-0.3],[117,0.3],[156,-0.35],[196,0.3]]){
    const chunk = mesh('box',[1.7,1.0,0.5], mat(0x101830)); chunk.position.set(fx, 0.38, 2.7); chunk.rotation.z = fr; deco.add(chunk);
  }
  for(const dx of [-4, 108.5]){ const drape = mesh('cone',[0.9,2.6,5], mat(0x141c34)); drape.position.set(dx, 1.2, 2.8); deco.add(drape); }
  S.add(bakeGroup(deco));

  w10Parallax(S, -8, 206);
  w10LevelFinish(G, -8, 206, null);          // null clutter: baked props must not float over the two gaps (w7l4 precedent)
  w10Clutter(G, -8, 18.6, 'palace');         // ...so the solid spans are cluttered manually
  w10Clutter(G, 22.4, 95, 'palace');
  w10Clutter(G, 99.3, 204, 'palace');

  return {spawnX: 0, exitX: 202};
}

function updateW10L2(G, dt){
  updateLevelCommon(G, dt);
  // no level glue needed: every wall's lane plugs mirror the kit clocks via their own ents (see w10l2Wall),
  // heralds/soldiers/wisp/flurries self-drive on fixed phases — determinism lives in the constructors above
}

W10_LEVELS.push({id:'w10l2', district:'w10', name:'THE ADVENT HALL', build:buildW10L2, update:updateW10L2, parTime:185});

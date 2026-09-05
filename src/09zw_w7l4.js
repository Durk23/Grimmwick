// ============ LEVEL 7-4 — THE AVALANCHE LAKE (District 7 · Frostmere · Frozen Lake Fell) ============
// POST-STORY MASTERY BAND (owner lock): Lake Fell opens one column PAST District 5 — but stays MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threats, fixed clocks, one-good-run-away). 7-4 is the
// district's AVALANCHE level and its signature interplay: every FIVE HEARTBEATS the fell WHUMPS (both calving
// gantries share ONE synchronized 5s clock — the whole level breathes on it) and a GIANT boulder crosses the
// great cracked ice head-on, SMASHING THE LAKE AS IT ROLLS. The player reads THREE clocks at once:
//   1. the 5s WHUMP           (when the next boulder comes — dodge it: double-jump, spin-shatter, stomp-ride)
//   2. the panel REFREEZE     (the boulder's wake of holes sews shut ~3.2s later — sprint the healed panels)
//   3. the ANGLER lunges      (the pale things under the ice hunt every fresh hole — 0.7s glow+bubbles, then teeth)
// 14 threats: 3 Ice Anglers + 2 Somnambears (shore bookends) + 2 Frostbite Penguins + 2 Snow-Boos +
// 2 Blizzard Bats + 2 Polar Cubs + 1 spike-icicle cluster at the narrows. NO Golden Pumpkin (7-4 keeps none),
// NO warp (the Bell Buoy lives in another level), NO Leap of Faith (both of the game's two are placed and sacred).
//
//   BEAT 1 THE FISHER'S SHORE            x -8..30    — CP0 (noLight). The Fisher's Hut gamble in its clear pocket,
//          the WHUMP sign, and the quiet prop waiting in a drift. Nothing bites here; the lake glitters ahead.
//   BEAT 2 THE SHORE FIELD (INTRODUCE)   x 30..58    — grippy shore-pack: dodge the boulder ONLY. Lane A's balls
//          arrive head-on every 5s (they've already crossed the whole west lake — the junction sightline: you
//          WATCH the lake smash ahead of you before you ever step on it). A cub lane + a penguin keep the ground
//          honest; Somnambear #1 sleepwalks the last stretch — wake her and she slams the lake's entry panels.
//   BEAT 3 THE WEST LAKE (TWIST)         x 58..91.6  — boulders over CrackIce: dodge the ball, then mind its WAKE.
//          The stride-smash bites the SAME panels every pass (the lake's SCARS — fixed grid, learnable forever);
//          scars gape ~3.2s then heal. A Snow-Boo works the span (stare it solid: the ice block is the one place
//          on the lake where standing costs no crack budget) and a Blizzard Bat dives the dawdlers.
//   BEAT 4 THE NARROWS (breath + slalom) x 91.6..106 — solid shoal. THE lantern (x95.6, ~53% — the level's ONE
//          lit checkpoint), a shield lantern, then the pressure-ridge arch: 3 icicle clocks over grippy snow.
//   BEAT 5 THE EAST LAKE (ESCALATE)      x 106..131  — boulders + wake + ICE ANGLERS hunting the fresh scars.
//          Two anglers patrol under the glass; every hole the wake opens is a mouth for ~3.2s.
//   BEAT 6 THE MILL RUN (MASTER)         x 131..151.6 — the full composition, with the great MILL WHEEL mid-lake
//          as the high-road refuge: ride a paddle over a boulder pass (and over the hungry floor — two anglers
//          share the scar under the wheel), drop behind the ball and sprint the healed panels to the far shore.
//   BEAT 7 THE FAR SHORE (exhale · gate) x 151.6..186 — Somnambear #2 bookends the exit lip (waking her re-smashes
//          the last panels), a cub lane and a local penguin on the walk up, then the gate.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the lake surface itself, read the three clocks · REFUGE/HIGH =
// the frozen-boo blocks (west) and the MILL WHEEL sky-ride (east — its candy halo is visible from the surface:
// the "next run I'm going up there" itch) · EXPERT = stomp-RIDE the boulders (bounce vy 10.5-13 leaps whole
// scar-clusters in one arc; taught by w6l5, winked at by the shore sign, never required).
// Comparable heights: the course is FLAT — no main-route rise over 1.5 (shield lantern float), wheel boarding is
// a 1.2u tap onto the lowest paddle (tap 1.8, over-clearance), scar gaps are single 2.4u panels (tap law <=4),
// solid runs between scars are 4.8u (no precision stop demanded on slick — the cracking-panel law).
// HEARTS ALWAYS: boulder contact = 1 heart + away-knockback; the plunge is the kit's full pit price (heart +
// lantern walk-back via G.onPlayerFell); icicles/anglers/deer— no deer here —/enemies all cost exactly 1.
// DETERMINISM: both calving gantries ride ONE fixed 5s clock from level start (firstAt 1.6, synchronized WHUMP);
// the stride-smash bites fixed grid panels (same scars, every ball, every run); every enemy carries a fixed
// phase; NO Math.random on the critical path (rand() only inside baked deco, kit-standard).
//
// ---- THE STRIDE-SMASH (why updateW7L4 does NOT slam at the ball's center x): _bearSlam(bx,1.3) would always
// shatter the panel SUPPORTING the ball (panel half-width 1.2 < 1.3) — the boulder undermines itself and drowns
// within a second of entering the lake, and a full-width wake (16u of simultaneous open water at 5u/s x 3.2s
// refreeze) is uncrossable under the <=5.5u gap law. So the smash rides the TRAILING edge instead: as each ball
// rolls, it punches every 3rd panel of one fixed level-wide grid (idx%3===0) the moment its trail passes —
// panels shatter along its path and refreeze behind it (the brief's read), the ball never breaks its own floor,
// the wake is a learnable slalom (2.4u tap-gaps, 4.8u solid islands), and the anglers hunt the fresh holes. ----

// ---- THE CALVING GANTRY (baked deco — the boulders need a visible SOURCE): a brass A-frame over the lane,
// a tilted chute, a cyan corruption-ring at the mouth, two giant rounds waiting beside the legs. The WHUMP
// fires on release; the drop zone below wears a growing cyan target-glow (the district's one warning language)
// for ~0.7s before AND during every fall — the mortar idiom, learned in Glimmerfields, kept honest here. ----
function w7l4Gantry(x){
  const g = new THREE.Group();
  for(const s of [-1,1]){
    const leg = mesh('cyl',[0.16,0.22,6.4,7], mat(W7PAL.brassD)); leg.position.set(x+s*1.15, 3.2, -1.7); leg.rotation.z = -s*0.08; g.add(leg);
    const foot = mesh('sph',[0.34,7,5], mat(W6PAL.snow)); foot.scale.y=0.45; foot.position.set(x+s*1.35, 0.12, -1.7); g.add(foot);
  }
  const cross = mesh('box',[3.1,0.22,0.24], mat(W7PAL.brass)); cross.position.set(x, 6.35, -1.7); g.add(cross);
  const chute = mesh('box',[2.0,0.18,1.4], mat(W7PAL.steel)); chute.position.set(x, 6.6, -0.8); chute.rotation.x = 0.5; chute.rotation.z = 0.06; g.add(chute);
  const ring = mesh('tor',[0.8,0.07,5,14], emat(W6PAL.coldFx, W6PAL.coldFx, 0.7)); ring.rotation.x = Math.PI/2; ring.position.set(x, 6.25, -0.1); g.add(ring);
  const b1 = mesh('sph',[0.9,10,8], mat(W6PAL.snowD)); b1.position.set(x+1.9, 0.75, -1.9); g.add(b1);
  const b2 = mesh('sph',[0.75,10,8], mat(W6PAL.snowD)); b2.position.set(x-2.0, 0.62, -2.1); g.add(b2);
  return g;
}

// ---- THE QUIET PROP: a sledge buried to its rails in a shore drift, one runner tipped up at the sky, still
// loaded with firewood somebody never delivered — the rope still coiled, ready to pull. Some house across the
// lake went cold waiting. Never signposted; fully baked; story-readers stop, everyone else walks past. ----
function w7l4Sledge(x, z){
  const g = new THREE.Group();
  const drift = mesh('sph',[1.15,8,6], mat(W6PAL.snow)); drift.scale.y=0.42; drift.position.set(x-0.3, 0.1, z); g.add(drift);
  const runnerUp = mesh('box',[1.7,0.09,0.09], mat(W6PAL.woodD)); runnerUp.position.set(x+0.55, 0.62, z+0.4); runnerUp.rotation.z = 0.62; g.add(runnerUp);
  const curl = mesh('tor',[0.16,0.045,4,8,Math.PI], mat(W6PAL.woodD)); curl.position.set(x+1.26, 1.12, z+0.4); curl.rotation.z = 0.62; g.add(curl);
  const runnerDn = mesh('box',[1.9,0.09,0.09], mat(W6PAL.woodD)); runnerDn.position.set(x+0.2, 0.16, z-0.42); runnerDn.rotation.z = 0.07; g.add(runnerDn);
  for(let i=0;i<4;i++){ const slat = mesh('box',[0.16,0.05,0.95], mat(W6PAL.wood)); slat.position.set(x-0.35+i*0.36, 0.34+i*0.05, z); slat.rotation.z = 0.1; g.add(slat); }
  for(let i=0;i<5;i++){ // the firewood — split rounds, stacked with care, going nowhere
    const log = mesh('cyl',[0.11,0.13,0.7,6], mat(i%2?W6PAL.wood:0x584232));
    log.rotation.x = Math.PI/2; log.position.set(x-0.25+(i%3)*0.3, 0.52+Math.floor(i/3)*0.24, z+0.05); log.rotation.z = rand(-0.08,0.08); g.add(log);
  }
  const rope = mesh('tor',[0.2,0.05,5,10], mat(W7PAL.rope)); rope.rotation.x = Math.PI/2; rope.position.set(x-1.05, 0.14, z+0.3); g.add(rope);
  const cap = mesh('sph',[0.5,7,5], mat(W6PAL.snow)); cap.scale.y=0.35; cap.position.set(x+0.15, 0.62, z-0.1); g.add(cap);   // snow settled on the load
  return g;
}

function buildW7L4(G){
  const S = G.scene;
  levelBegin(G);

  const SNOW = W6PAL.snowD;                 // packed shore snow (grippy — every precision beat lives on it)
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail
  const L = w6LightsBegin();                // two short festival strings only — this lake is darker and lonelier

  // =============================== BEAT 1 — THE FISHER'S SHORE (x -8..30) ===============================
  groundX(G, -8, 58, SNOW);                 // one grippy shore-pack run to the west lake's lip at 58
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  // SPAWN SAFETY (idle player at x0/z0, CP0 respawn at x2/z1.6): nearest FIXED bite = a dying lane-A boulder
  // (bite cut at endX+1.5=31.5; touch reach 31.5-1.33=30.2 → 28u clear) · cub lane starts 33 (touch min 32.2) ·
  // penguin patrol min 36.6, wakeR 5 (needs px<41.6 to even squawk) · bear #1 swipe min reach 50.5-3.5=47 ·
  // bat #1 trigger min 68-2.5-4.5=61, post-dive drift -2 → 59 · no deer lanes in this level · hut-ambush cubs
  // (opt-in, player-opened) roll lanes at z0 — CP0's z1.6 sits outside their 0.81 touchR. All clear.
  signPost(G, 5.5, 1.7, -0.12, "THE AVALANCHE LAKE. Every fifth heartbeat the fell WHUMPS and bowls a boulder across the ice. Hop it, crack it with a well-timed spin, or ride its back like the old ferrymen did. Never argue with it.");
  // one warm string over the fisher's landing — the last kind light before the open ice
  deco.add(w6LightPost(3, -2.0, 3)); deco.add(w6LightPost(9.5, -2.0, 3));
  w6String(L, 3, 2.95, 9.5, 2.95, {z:-1.9});
  candyLine(G, [[5,0.9,0],[8,0.9,0]], 2);
  // THE FISHER'S HUT — the gamble, in its CLEAR POCKET (CLEAR-PATCH law, worst-case reach math): lane-A boulders
  // stop biting at x31.5 (touch to 30.2 → 18.2u clear) · cub #1 lane 33..44.8 (20.2u) · penguin #1 worst slide
  // reach 39-2.4-8.9=27.7 (15.7u) · bear #1 swipe reach min 47 (35u) and SLAM zone min 50.5-3.2=47.3 (35.3u —
  // the >=8u slam law, honored 4x over) · boos leashed 14 off homes 76/120 (never west of 62) · bats live past
  // x61 even after drift. Opening the hut is a deliberate, safe act; the cub ambush spawns on the kit's 1s grace.
  { const h = new FisherHut(12, 0, -0.9, 0.25); G.coffins.push(h); G.ents.add(h); }
  // THE QUIET PROP (never signposted): the buried sledge, one runner up, still loaded with somebody's firewood
  deco.add(w7l4Sledge(20.5, -2.2));
  G.ents.add(new Crow(24, 0.95, 2.1));      // winter crow #1 — flaps off when neared

  // =============================== BEAT 2 — THE SHORE FIELD (x 30..58): INTRODUCE the boulder ===============================
  // Lane A's balls (released over the west lake's far lip at x91, synchronized WHUMP clock) exit the ice at 58
  // and roll this field head-on, dying at 30 (touchDamage cuts at 31.5 — a dying ball can't clip the shore rest).
  // Grippy snow, ball only: learn the dodge (double-jump clears the 2.8 crown with the 3.3 double; spin-shatter
  // = candy; stomp = the bounce) before the lake adds its wake. Candy pockets trace where the dodge breathes.
  candyLine(G, [[34,0.9,0],[38.5,0.9,0],[43,0.9,0]], 3);
  G.ents.add(new PolarCub(G, 33, 0, 0, {x1:44, speed:3.4, phase:0.8, pause:1.2}));        // cub lane #1 — small ball under the big ball (two sizes, one lesson)
  G.ents.add(new FrostbitePenguin(G, 39, 0, 0, {phase:0.4, range:2.4, dir:-1}));          // ground pressure — no camping between WHUMPs
  signPost(G, 47.5, 1.7, 0.1, "The boulders SMASH the lake as they roll - always the same panels. The scars gape a few breaths, then the cold sews them shut. Cross behind a boulder on the healed ice... and never linger on a scar.");
  // sign clearances: bear #1 patrol min 50.5 (3.0u — outside her 1.8u wake bump) · penguin patrol max 41.4 +
  // wakeR 5 = 46.4 (1.1u shy of a reader at 47.5) · cub touch max 44.8 (2.7u). Reading is a breath, not a trap.
  // SOMNAMBEAR #1 — the west bookend. Sleepwalks the last shore stretch (soft wall, harmless asleep); cross her
  // path and she WAKES: 0.7s rear-up roar (the telegraph), ONE 7u/s blind swipe, then she forgets. Her wake-slam
  // shatters CrackIce within 3.2u — patrol right edge 57.5 + 3.2 = 60.7 reaches the lake's ENTRY panel (59.2):
  // waking her mid-run doubles the hole chaos, exactly as advertised. Swipe worst reach 57.5+3.5=61 (onto the
  // lip), 47 on the left — never near hut or CP0.
  G.ents.add(new Somnambear(G, 54, 0, 0, {phase:0.0, range:3.5, dir:1, speed:0.85}));
  G.ents.add(new Crow(57, 0.95, 2.3));      // winter crow #2 — on the lip, staring at the lake (the house tell: a crow marks an edge)

  // =============================== BEAT 3 — THE WEST LAKE (x 58..91.6): TWIST — the wake ===============================
  // 14 CrackIce panels (2.4u grid anchored at 58 — ONE grid for both lakes, so the scars are level-law).
  // Stride-smash scars (idx%3===0): x 59.2, 66.4, 73.6, 80.8, 88.0 — five fixed holes per pass, open ~3.2s.
  // The entry panel IS a scar: the arc candy hops you over it to 61.6 (never punched) from step one.
  const slams = [];
  w7CrackLake(G, 58, 92, {});   slams.push(G._bearSlam);
  candyLine(G, [[58,1.0,0],[59.2,2.0,0],[61.6,1.0,0]], 3);                // the entry arc — over the first scar
  candyLine(G, [[64,0.9,0],[71.2,0.9,0],[78.4,0.9,0]], 3);                // the safe-panel line (never-punched panels only)
  candyLine(G, [[84.8,0.9,0],[90.4,0.9,0]], 2);   // 84.8 sits 1.1u clear of the calf-landing bite edge (85.9); 90.4 only ever has calves harmlessly HIGH overhead
  G.ents.add(new Heart(78.4, 1.0, 0));                                     // mercy mid-lake, on solid grid (idx 8 — never a scar)
  // SNOW-BOO #1 — works the twist span (home 76, leashed chaseR 14 → active 62..90). Stare it SOLID: the ice
  // block is the one place on the whole lake where standing still costs no crack budget — the twist's rest trick,
  // learned on Glimmerfields boos, discovered here. Un-frozen it drifts at your back while you count WHUMPs.
  G.ents.add(new SnowBoo(G, 76, 0, 0, {phase:0.9, speed:2.1, range:9, freezeMax:2.6}));
  // BLIZZARD BAT #1 — dives the mid-lake dawdlers (squeak telegraph, snapshot dive). Patrol 65.5..70.5 at y5;
  // trigger max 68+2.5+4.5=75 (+2 post-dive drift = 77) — 18.6u short of the lit lantern, 6u+ clear of the hut law.
  G.ents.add(new BlizzardBat(G, 68, 5.0, 0, {phase:0.5, range:2.5, period:3.4, aggroR:4}));
  // LANE A's CALVING GANTRY — released at (91, 6.2): a 0.69s fall (>=0.6s telegraph law) under the WHUMP and
  // the growing cyan LANDING-glow. The calf keeps its 5u/s throw while it falls (AvalancheBall moves x mid-air),
  // so it drifts 3.45u and lands at x~87.5 — ON scar panel 88.0, which is ALWAYS healed by landing time (each
  // cycle it's punched at phase 2.46 and refrozen by 0.66 of the next; the landing comes at 2.29 — a 1.6s
  // margin on one fixed clock; only a player's own cracking can open the pad, their doing, their spectacle).
  // Crossers exiting the lake pass under the throw — the glow disc marks the LANDING, and the 5-count makes
  // "don't dawdle at the lip" an honest lesson, not a trap.
  deco.add(w7l4Gantry(91));
  const spA = new AvalancheSpawner(G, {x:91, y:6.2, dir:-1, speed:5, r:1.4, period:5, firstAt:1.6, endX:30});
  G.ents.add(spA);
  const discA = new THREE.Mesh(geo('circ',1.5,16), new THREE.MeshBasicMaterial({color:W6PAL.coldFx, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
  discA.rotation.x = -Math.PI/2; discA.position.set(87.6, 0.12, 0); S.add(discA);   // at the LANDING x, not the release x

  // =============================== BEAT 4 — THE NARROWS (x 91.6..106): the breath, then the slalom ===============================
  groundX(G, 91.6, 106, SNOW);              // the solid shoal — grippy, boulder-free (neither lane crosses it)
  // THE lantern — the level's ONE lit checkpoint (x95.6 of a 180u run ≈ 53%). Rest-pocket math, idle player at
  // 95.6 (body edge 95.2/96.0): lane A's worst bite is its calf-landing zone 85.9..89.2 (6.4u clear) · lane B bite cut at
  // endX+1.5=106.1, touch min reach 104.8 (9.2u) · icicle columns 99.4/101.6/103.8 ±0.5 (nearest danger edge
  // 98.9 → 3.3u) · anglers lunge only through holes and the nearest hole that can open is panel 109.6 (east
  // scar; touch min 108.9 → 13.3u) · boo #120 leashed 14 (needs player x>=106) · bear #2 swipe min reach
  // 152-4-3.5=144.5 · bat #2 trigger-drift min 146-2.5-4.5-2=137 · cub #2 lane min 163.2 · penguin #2 min slide
  // reach 158.7 · no deer lanes in this level. The pocket is a true breath.
  G.ents.add(new Checkpoint(95.6, 0, 1.6, 1));
  G.ents.add(new BonkLantern(G, 93.2, 1.5, 0, 'shield'));   // armor before the exam's second page
  candyLine(G, [[93.2,0.9,0],[95,0.9,0]], 2);
  signPost(G, 97.4, 1.7, -0.1, "Past the arch, something pale hunts the open scars - a glow, bubbles, then TEETH. Keep your toes off fresh holes. And the old mill still turns out there: when the floor is hungry, ride the sky.");
  // THE PRESSURE-RIDGE ARCH — up-thrust slabs meeting overhead (baked, NO collider: the double-jump apex 3.3
  // never reaches the 5.4 hang, and nothing bonks a head mid-slalom)
  for(const [ax,rot] of [[98.5,0.5],[105.0,-0.5]]){
    const slab = mesh('box',[1.1,4.6,2.2], new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.85})); slab.position.set(ax, 2.1, -0.6); slab.rotation.z = rot; deco.add(slab);
    const cap = mesh('sph',[0.7,7,5], mat(W6PAL.snow)); cap.scale.y=0.45; cap.position.set(ax+(rot>0?1.1:-1.1), 4.35, -0.6); deco.add(cap);
  }
  { const roof = mesh('box',[7.4,0.6,2.4], mat(W6PAL.snowD)); roof.position.set(101.7, 5.75, -0.6); roof.rotation.z = 0.03; deco.add(roof);
    const lump = mesh('sph',[0.6,7,5], mat(W6PAL.snow)); lump.scale.y=0.5; lump.position.set(100.4, 6.05, -0.5); deco.add(lump); }
  // THE ICICLE CLUSTER — three staggered clocks under the arch (shimmer + drip + growing floor-glow, ~0.7s,
  // the learned Frostmere language) over GRIPPY snow: precision dodging never happens on slick (cracking-panel law)
  G.ents.add(new SpikeIcicle(G, 99.4, 5.4, {period:4.4, phase:0.0, len:1.2}));
  G.ents.add(new SpikeIcicle(G, 101.6, 5.4, {period:4.8, phase:1.5, len:1.2}));
  G.ents.add(new SpikeIcicle(G, 103.8, 5.4, {period:5.2, phase:3.0, len:1.2}));
  candyLine(G, [[100.5,0.9,0],[102.7,0.9,0],[105.4,0.9,0]], 3);           // the slalom line — between the drop columns

  // =============================== BEAT 5 — THE EAST LAKE (x 106..131): ESCALATE — anglers in the wake ===============================
  // 19 panels on the same level grid (106 = 58 + 20x2.4 — the scars stay one law). Stride scars east:
  // x 109.6, 116.8, 124.0, 131.2, 138.4, 145.6. Entry panel 107.2 (idx 20) is NEVER punched — a solid welcome.
  w7CrackLake(G, 106, 151.6, {}); slams.push(G._bearSlam);
  // merge both lakes' slam hooks: Somnambear wakes and the stride-smash reach WHICHEVER lake is near (each
  // stored closure guards its own panels + build-area, so stale scenes stay silent)
  G._bearSlam = (bx, r)=>{ for(const s of slams) s(bx, r); };
  candyLine(G, [[108.4,0.9,0],[109.6,1.9,0],[112,0.9,0]], 3);             // the first east scar, arced
  candyLine(G, [[114.4,0.9,0],[119.2,0.9,0],[121.6,0.9,0]], 3);           // safe-panel rhythm (never-punched grid only)
  candyLine(G, [[126.4,0.9,0],[128.8,0.9,0]], 2);
  // ICE ANGLERS #1/#2 — the escalate's voice: pale glows stalking UNDER the glass, harmless through the ice,
  // lunging up through whatever the wake (or a bear, or your own feet) opens. 0.7s glow+bubbles; a stomp
  // mid-lunge pops them. #1 hunts scars 109.6/116.8 (home 112, range 10) · #2 hunts 124/131.2 and shares the
  // mill scar 138.4 (home 128, range 10). Fixed homes, player-reactive stalking — determinism holds.
  G.ents.add(new IceAngler(G, 112, 0, 0, {phase:0.7, speed:2.7, range:10}));
  G.ents.add(new IceAngler(G, 128, 0, 0, {phase:1.9, speed:2.6, range:10}));
  // SNOW-BOO #2 — drifts the escalate (home 120, active 106..134): frozen solid it's the only crack-free stand
  // out here... unless you park it over a scar, where a lunge can still nip your boots. Choose your fort.
  G.ents.add(new SnowBoo(G, 120, 0, 0, {phase:0.3, speed:2.2, range:9, freezeMax:2.6}));

  // =============================== BEAT 6 — THE MILL RUN (x 131..151.6): MASTER — the full composition ===============================
  // THE MILL WHEEL — the fishery's great half-frozen waterwheel, still turning over the lake at x137: six level
  // paddles, lowest tops ~1.2 (a tap-jump from the solid panel at 136 — boarding cadence every ~2.1s, never a
  // precision stop), crowns at ~7.6. THE HIGH-ROAD REFUGE: ride a paddle over a boulder pass and over the mill
  // scar (138.4 — anglers #2 AND #3 share it: the floor under the wheel is the hungriest on the lake, which is
  // the POINT), then drop behind the ball and sprint the healed panels. Designed pinch = ball + 2 anglers = 3;
  // the bat waits past 143 so the wheel itself never sits at the 4-cap.
  w7MillWheel(G, {x:137, y:4.4, r:3.2, speed:0.55});
  candyLine(G, [[133.6,0.9,0],[136,0.9,0],[136.8,1.9,0]], 3);             // the boarding hop, traced from solid grid
  candyLine(G, [[134.6,8.3,0],[137,8.6,0],[139.4,8.3,0]], 3);             // the sky halo — visible from the surface (junction itch)
  G.ents.add(new BonkLantern(G, 137, 8.8, 0, 'bat'));                     // the crown prize: 18s of wings for the sprint home
  // ICE ANGLER #3 — the master's floor (home 144, range 10): hunts the mill scar 138.4 and the exit scars
  // 145.6 (+ any hole Somnambear #2 slams open at the lip). Three glows under the glass, all on fixed homes.
  G.ents.add(new IceAngler(G, 144, 0, 0, {phase:3.1, speed:2.8, range:10}));
  // BLIZZARD BAT #2 — owns the post-wheel airspace (patrol 143.5..148.5 at y5.2): the "sprint the healed
  // panels" exit is contested from above. Worst pinch on the sprint: ball + angler #3 + bat = 3 (cap holds;
  // the two-angler mill scar is refuge-adjacent, not sprint-adjacent).
  G.ents.add(new BlizzardBat(G, 146, 5.2, 0, {phase:1.6, range:2.5, period:3.8, aggroR:4.5}));
  candyLine(G, [[140.8,0.9,0],[143.2,0.9,0],[147.2,0.9,0]], 3);           // the sprint line — solid panels, 1.2u clear of the calf-landing bite edge (148.4)
  candyLine(G, [[152.4,0.9,0],[154.8,0.9,0]], 2);                         // ...and off the lake (under the harmless HIGH part of the throw, past the landing zone)
  // LANE B's CALVING GANTRY — released at (153.5, 6.2): same 0.69s fall, same synchronized WHUMP, same cyan
  // LANDING-glow (the idiom was learned at lane A). The 3.45u throw-drift lands the calf at x~150.0 — on panel
  // 150.4, which is NEVER a stride scar (idx 38); only a woken Somnambear #2 can open that pad (she slams it —
  // wake her and you cost yourself a boulder to the deep: opt-in chaos, self-balancing). The ball then crosses
  // the whole east lake and dies on the narrows' right lip (endX 104.6; bite cut at 106.1 keeps the shoal honest).
  deco.add(w7l4Gantry(153.5));
  const spB = new AvalancheSpawner(G, {x:153.5, y:6.2, dir:-1, speed:5, r:1.4, period:5, firstAt:1.6, endX:104.6});
  G.ents.add(spB);
  const discB = new THREE.Mesh(geo('circ',1.5,16), new THREE.MeshBasicMaterial({color:W6PAL.coldFx, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
  discB.rotation.x = -Math.PI/2; discB.position.set(150.1, 0.12, 0); S.add(discB);   // at the LANDING x, not the release x

  // =============================== BEAT 7 — THE FAR SHORE (x 151.6..186): exhale, bookend, gate ===============================
  groundX(G, 151.6, 186, SNOW);
  // SOMNAMBEAR #2 — the east bookend, sleepwalking the exit lip (patrol 152..160). Wake her stepping off the
  // lake and her slam (reach down to 148.8) smashes the exit panel 150.4 behind you — hole chaos doubled at the
  // finish line, exactly the bookend promise (and the next lane-B calf drowns in her hole: waking her costs a
  // boulder cycle too). Her swipe reaches ~147.6 onto the last panel at worst and 167.7 up the shore — both
  // opt-in: she bites only when woken, and only whoever woke her is standing there.
  G.ents.add(new Somnambear(G, 156, 0, 0, {phase:1.3, range:4, dir:-1, speed:0.9}));
  G.ents.add(new PolarCub(G, 164, 0, 0, {x1:174, speed:3.8, phase:1.7, pause:1.0}));      // cub lane #2 — the walk-up keeps its bounce
  candyLine(G, [[166,0.9,0],[169.5,0.9,0],[173,0.9,0]], 3);               // the cub-dodge rhythm, traced
  G.ents.add(new FrostbitePenguin(G, 170, 0, 0, {phase:1.0, range:2.6, dir:1}));          // one last local with opinions
  G.ents.add(new Crow(163, 0.95, 2.2));    // winter crow #3 — unbothered, as ever
  signPost(G, 177, 1.7, -0.1, "The far shore. The fell keeps throwing; the lake keeps mending; the pale ones keep hoping. You crossed anyway. The ferrymen would have tipped their hats.");
  candyLine(G, [[177.5,0.9,0],[179,0.9,0]], 2);
  deco.add(w6LightPost(176, -1.9, 3)); deco.add(w6LightPost(182, -1.9, 3));
  w6String(L, 176, 2.95, 182, 2.95, {z:-1.8});                            // the second (and last) string — a landing worth lighting
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(180.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome
  exitGate(G, 180);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // sparse shores — this district is darker and lonelier than Glimmerfields; the aurora and the machines do the lighting
  deco.add(w6Pine(-5, -2.9, 1.2)); deco.add(w6Pine(27, -3.1, 1.0)); deco.add(w6Pine(183.5, -2.8, 1.3));
  deco.add(w6SnowmanDeco(158.5, -2.7, 0.7, 0.5));                          // somebody's greeter on the far landing
  { for(let i=0;i<4;i++){ const blk = mesh('box',[0.9,0.5,0.7], new THREE.MeshLambertMaterial({color:W7PAL.glass, transparent:true, opacity:0.8})); blk.position.set(167.5+(i%2)*1.0, 0.25+Math.floor(i/2)*0.52, -2.4); blk.rotation.y = i*0.3; deco.add(blk); } }   // the ice harvest, stacked and abandoned
  // FOREGROUND silhouettes (z>0): tilted pressure slabs + shore pines framing the depth
  for(const [fx,fr] of [[40,0.4],[85,-0.35],[130,0.3],[168,-0.4]]){
    const slab = mesh('box',[1.6,1.1,0.5], mat(0x121c34)); slab.position.set(fx, 0.4, 2.7); slab.rotation.z = fr; deco.add(slab);
  }
  deco.add(w6Pine(-3, 2.6, 1.2)); deco.add(w6Pine(181, 2.5, 1.2));
  S.add(bakeGroup(deco));

  // the winter moon, low over the far shore line
  const moon = mesh('circ',[4.0,28], emat(0xe4ecff, 0xcfdcf6, 0.85)); moon.position.set(100, 15, -30); S.add(moon);
  const moonH = new THREE.Mesh(geo('circ',6.4,28), new THREE.MeshBasicMaterial({color:0x9ab8e6, transparent:true, opacity:0.12, depthWrite:false}));
  moonH.position.set(100, 15, -30.2); S.add(moonH);

  // level-local glue handles for updateW7L4 (rebuilt fresh every switchArea — area-stamped against stale reads)
  G._l4 = { area:G.area, drops:[ {x:91, sp:spA, disc:discA}, {x:153.5, sp:spB, disc:discB} ] };

  w7Parallax(S, -8, 186);
  w7LevelFinish(G, -8, 186, null);          // null clutter: the lakes must stay bare (baked props can't float over shattered panels)
  w7Clutter(G, -8, 57.5, 'lake');           // ...so the solid spans are cluttered manually (w6l5 precedent)
  w7Clutter(G, 91.8, 105.8, 'lake');
  w7Clutter(G, 152, 186, 'lake');

  // festival strings live (shared mats + one twinkle ticker)
  w6LightsFinish(G, L);

  return {spawnX: 0, exitX: 180};
}

function updateW7L4(G, dt){
  updateLevelCommon(G, dt);
  const L4 = G._l4; if(!L4 || L4.area !== G.area) return;
  const pl = G.player;
  let hotA = false, hotB = false;
  // ---- THE BOULDER GLUE: every live AvalancheBall smashes the lake as it rolls — via the TRAILING-EDGE
  // STRIDE-PUNCH (see the header: a center-x slam would shatter the ball's own floor and drown it, and a
  // full wake is uncrossable; the stride keeps the intent — wake of holes, refreeze behind, anglers hunting —
  // while the scars stay a fixed, learnable grid). Plus the grounded-bite assist: the base touchPlayer
  // measures against the ball's CENTER (gh+1.4), which a grounded Pip's 1.25 top never reaches — without this,
  // standing in the boulder's path would be accidentally safe and the whole level would lie. ----
  for(const e of G.ents.list){
    if(e.dead || !e.isEnemy || e.constructor.name !== 'AvalancheBall') continue;
    const bx = e.group.position.x;
    if(e.falling){                                           // fresh calf, still in the air — keep its landing zone lit
      // the fall sweeps x with the 5u/s throw: lane A 91->87.5, lane B 153.5->150.0 (windows cover the whole arc)
      if(Math.abs(bx - 89.3) < 2.3) hotA = true;
      if(Math.abs(bx - 151.8) < 2.3) hotB = true;
      continue;
    }
    // the stride-punch: one shared 2.4u grid anchored at x58 (both lakes align to it — 106 = 58 + 20x2.4).
    // The trail point rides 2.5u behind the ball (strictly clear of its supporting panel, half-width 1.2);
    // each time it crosses onto a new grid cell with idx%3===0, THAT panel shatters — same scars, every pass.
    const tx = bx - e.dir*2.5;
    const idx = Math.floor((tx - 58) / 2.4);
    if(e._l4i === undefined) e._l4i = idx;                   // baseline on the landing frame — no retro-punching
    while(e._l4i !== idx){
      e._l4i += Math.sign(idx - e._l4i);
      if(((e._l4i % 3) + 3) % 3 === 0){
        G._bearSlam && G._bearSlam(58 + 1.2 + e._l4i*2.4, 0.6);   // r 0.6 → exactly that one panel (calls over shore grid are no-ops)
      }
    }
    // grounded-bite assist (hearts-always: 1 heart, i-frames gate repeats, knockback pushes AWAY — never a zero vector)
    if(e.touchDamage && pl && !pl.dead && pl.grounded && Math.abs(pl.pos.z) < 1.3 &&
       Math.abs(pl.pos.x - bx) < e.r*0.9 + 0.35){
      pl.damage(1, new THREE.Vector3(bx + (pl.pos.x >= bx ? -0.4 : 0.4), pl.pos.y, 0));
    }
  }
  // ---- the drop-zone telegraphs: each gantry's cyan floor-glow grows through the last 0.7s before its
  // release (read straight off the spawner clocks — perfectly synced, no parallel timer to drift) and holds
  // while the calf falls. The mortar idiom, kept honest at both ends of the lake. ----
  for(const D of L4.drops){
    const warn = (D.sp.nextAt - D.sp.t) < 0.7;
    const hot = warn || (D.x < 100 ? hotA : hotB);
    const m = D.disc.material;
    m.opacity = hot ? Math.min(0.5, m.opacity + dt*2.2) : Math.max(0, m.opacity - dt*3);
    if(hot) D.disc.scale.setScalar(0.6 + m.opacity*0.9 + Math.sin(G.time*22)*0.06);
  }
}

W7_LEVELS.push({id:'w7l4', district:'w7', name:'THE AVALANCHE LAKE', build:buildW7L4, update:updateW7L4, parTime:175});

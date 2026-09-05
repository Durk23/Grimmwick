// ============ LEVEL 10-4 — THE AURORA GALLERY (District 10 · The Aurora Palace · where the cold sits crowned) ============
// WINTER FINALE BAND (owner lock): the summit of the beyond-D5 curve — the ultimate exam, still MAIN-GAME FAIR
// (hearts-always, telegraphs >=0.6s, <=4 simultaneous threat systems, fixed clocks, one-good-run-away). 10-4 is
// the district's AVALANCHE level in royal dress: every FIVE SECONDS a great BELL tolls somewhere down the hall
// and a FROST ORB — translucent palace ice, aurora-lit, wearing a crown of spikes — is bowled the length of the
// gallery beneath the rose windows. The player reads THREE clocks at once:
//   1. the 5s BELL          (when the next orb comes — leap it, spin-shatter it, or stomp-RIDE its crown)
//   2. the WISP-WAKE fade   (aurora ribbons trail freezing wakes that bite 0.8s then forgive — cross on the fade)
//   3. the MIRROR halls     (walking panes that return your every step — feint them, jump them, or shatter them)
// ...then the back half composes the machines ON the same heartbeat: a frozen fountain whose pillar is the
// refuge an orb thunders under (ESCALATE), and two toy soldiers marching the balcony span in exactly one bell
// each — the ride ABOVE the rhythm (MASTER). ONE clock, phase-shifted by distance: that is the speedrun music.
// 15 threats: 3 Mirror Frosts + 3 Aurora Wisps + 2 Frost Heralds + 2 Frost Knights + 2 Snow-Boos + 2 marching
// toy soldiers + the twin bell-lanes (one shared 5s orb heartbeat, both arches tolling as one bell at t≡1.8).
// NO Golden Pumpkin (10-4 keeps none), NO warp (the guest chair waits in another level), NO Leap of Faith
// (both of the game's two are placed and sacred).
//
//   BEAT 1 THE ANTECHAMBER          x -8..22     — CP0 (noLight). The Frost-Locked Chest in its clear pocket,
//          the bell sign, and the quiet prop: the portrait gallery painted by someone never in any frame.
//   BEAT 2 THE LONG GALLERY (INTRO) x 25..62     — grippy parquet, orb rhythm ONLY (plus one boo, one mirror):
//          lane A's orbs arrive head-on every bell, dying at 30 — you WATCH the gallery get bowled from the
//          antechamber door before you ever step in (the junction sightline). A spring-gated windowsill at 47
//          is the one orb-proof perch on the floor route (candy column telegraphs the verb).
//   BEAT 3 THE WISP AISLE (TWIST)   x 62..86     — orbs + wake fade + the herald's horn, in strict alternation
//          (orb sweeps the horn lane t≡0..1, beam burns t≡1.6..2.6 — never a stacked wall). Tapestry climb to
//          a y3.4 ledge road above all of it: the high road, crowned by 18s of bat wings.
//   BEAT 4 THE LANDING (breath)     x 86..99     — bell-arch A at the lip, THE lantern (x94, ~55% — the level's
//          ONE lit checkpoint), a shield lantern, and BOTH back-half machines taught from the one true breath
//          (the w7l4 narrows-sign law): the parade sign (soldiers march here first — 10-5 inherits them) and
//          the fountain sign. Then gap #2.
//   BEAT 5 THE FOUNTAIN COURT (ESC) x 102.6..133 — lane B beneath wisp #3 and the knight's walk — and the
//          frozen fountain at 118, phase-locked so its pillar HOLDS exactly when the orb passes under it.
//          Bubbles(t≡3.6) → rise(4.3) → pillar up(4.8) → THE ORB THUNDERS THROUGH BENEATH(0.8..1.6) → toll(1.8)
//          → cracks(1.5) → shatter(2.15), dropping you behind the departing orb. Ride the refuge or jump the crown.
//   BEAT 6 THE ROYAL BALCONY (MSTR) x 133..163   — the full composition: soldiers #1 (136..146) and #2 (148..158)
//          each cross their span in EXACTLY one bell (speed 2, span 10, phases 0/5) and kiss at t≡5 mod 10 —
//          the hat-to-hat transfer — while an orb sweeps beneath the landing rider 0.2s later. Floor route runs
//          mirror #3 + boo #2 + knight #2 under the ride; herald #2 gates the dismount ledge on its own horn.
//   BEAT 7 THE GREAT DOORS (exhale) x 163..178   — bell-arch B, the court's farewell, the gate at 172.
//
// ROUTES (2-3 visible, junctions sighted): LOW = the gallery floor, read the three clocks · HIGH = the tapestry
// ledge road (beat 3) and the soldier hat-ride (beat 6 — its candy halo at y4.3 is visible from the floor: the
// "next run I'm going up there" itch) · EXPERT = stomp-RIDE the orb crowns (bounce vy 10.5 leaps whole beats in
// one arc; winked at by the antechamber sign, taught by six winter levels, never required).
// COMPARABLE HEIGHTS: main floor is FLAT; gap #1 = 3.0u (tap law <=4), gap #2 = 3.6u (held law <=5.5, tap
// possible); ledge-road hops are 1.5u at equal height; plinth chain 1.2 -> 3.3 (steps 1.2 / 2.1 <= 2.2) ·
// windowsill y3.4 and plinth2 y3.3 are SPRING/step-gated (spring apex ~4.4 law <=4.0 gate, candy-telegraphed) ·
// tapestry ledge y3.4 is CLIMB-gated · hat boarding from plinth2 is a +0.2 walk-on (step-up 0.45). Never exact.
// HEARTS ALWAYS: orb contact = 1 heart (never more); gaps cost the kit's pit price (heart + lantern walk-back);
// geyser shatter and pillar drops are HARMLESS — in this palace only enemies and wakes bite.
// DETERMINISM: both bell-lanes ride ONE fixed 5s clock from level start (firstAt 1.8, synchronized toll); the
// geyser (phase 2.8), soldiers (phases 0/5), heralds (phases 2.6/1.7) and every wisp/knight/mirror carry fixed
// phases; NO Math.random on the critical path (rand() only inside baked deco + the opt-in chest gamble).
//
// ---- THE FROST ORB LEDGER (why r=1.1, from 03/06/07 source constants — pin before retuning ANYTHING):
//   · grounded bite is NATIVE: ball center y = r = 1.1 < player height 1.25, so Enemy.touchPlayer's
//     `pl.y+height > p.y` test passes for a grounded Pip — 10-4 needs NONE of w7l4's grounded-bite glue.
//   · bite ceiling = r + headH - 0.15 = 1.1 + 2.09 - 0.15 = 3.04 (headH overridden to 1.9r): soldier-hat
//     riders stand at 3.50 (the mover fn's y is the col FLOOR — the col rides 3.28..3.50 → +0.46 clear),
//     plinth2/dismount perch 3.3 (+0.26), ledge road 3.4 (+0.36), geyser cap 3.86 (+0.82).
//   · the orb TERRAIN-FOLLOWS (kit law — groundHeight probe reads tops <= 2.2): it CRESTS plinth1 (top 1.2)
//     and tumbles off the far side. Crested, its center rides at 2.3 and its 1.045 touch reach caps at
//     x132.86 — 0.24u shy of plinth2's lip (133.1): the wait perch is clear even of the climbing orb (this
//     clearance is WHY plinth1 sits at 130.8, not flush against the plinth2 step). A plinth1-stander is
//     bitten grounded or crested alike — the STEP-not-perch note below is load-bearing.
//   · stomp window = r + headH ± (-0.35..+0.55) = 2.84..3.74 — a falling player crosses it before the bite
//     band, same relationship as the shipped AvalancheBall; crown-riding carries over from Frostmere.
//   · dodge: crown top 2.2 — a held single (2.6) clears it, a double (3.3) clears it fat (over-clearance law).
//   · a dying orb is harmless (touchDamage cuts at endX+1.5, inherited) and orbs spawn with 0.7s of grace
//     (the BELL is the release telegraph — nobody is ever hit by an orb materializing in a doorway).
// ---- SPAWN SAFETY (idle at x0/z0, CP0 respawn x2/z1.6): lane A orbs die at endX 30 (bite cut 31.5, touch
// edge 30.45 → 28u clear) · Snow-Boo #1 leashed chaseR 9 off home 40 (engages only px>=31) · mirror #1 hall
// clamp 43 (touch 42.34) · wisps live past 64 · chest flurries (opt-in, PLAYER-opened at the chest) roll z0
// lanes ending at x1.4 worst — the perpendicular pass leaves CP0's z1.6 a full 1.6u off the lane, outside
// their 0.76 touchR (w7l4 hut-cub precedent) · everything east is past 65. The antechamber is a true parlor.
// ---- LANTERN SAFETY (idle at x94/z1.6, the ONE lit checkpoint): lane A bites only at x<=83.55 (0.7s spawn
// grace ends at x82.5 + touch 1.05 → 10.4u clear) · wisp #2 lane caps at 86 (head/wake reach 86.55 → 7.4u) ·
// mirror #2 hall clamp 84 (touch 84.66 → 9.3u) · herald #1 beam 65..69.2 (24.8u) · wisp #3 lane floors at 104
// (window edge 103.45 → 9.4u) · lane B dies at 106 (bite cut 107.5, touch edge 106.45 → 12.4u) · knight #1
// worst west reach = patrol 124.6 - lunge 3.4 - touch 0.78 = 120.4 (26.4u) · gap #2 is a pit, not
// a bite. The pocket is a true breath.
// ---- CLEAR-PATCH (FrostChest x14/z-0.9, worst-case reach math): lane A touch edge 30.45 (16.4u) · boo #1
// engagement floor 31 (17u) · mirror #1 touch 42.34 (28u) · herald #1 beam floor 65 (51u) · all knights/wisps/
// soldiers live past 100. Opening is a deliberate safe act; the flurry ambush spawns on the kit's 1s grace.
// ---- BALCONY FLOOR NOTE: plinth1 (y1.2, surface 129.8..131.8) sits INSIDE lane B's bite band — it is a
// STEP, not a perch (the orb crests it t≡3.44..3.84 each bell, and knight #1's east lunge reaches 133.58
// across it, bow-telegraphed); plinth2 (y3.3 — above the orb's 3.04 ceiling AND the knight's 1.35 bite
// ceiling, his true guard) is the wait. The hop across: 1.3u gap + 2.1 rise, held-jump law. ----

// ---- THE FROST ORB — the palace's avalanche, level-local (BlizzardBat material-swap precedent: NEVER tint
// the cached mat()/emat() factories — fresh materials, hoisted once so the 5s spawn clock never churns). ----
let _w10l4M = null;
class FrostOrb extends AvalancheBall {
  constructor(G, x, y, opts={}){
    super(G, x, y, opts);
    if(!_w10l4M) _w10l4M = {
      orb:   new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x58c8e8, emissiveIntensity:0.55, transparent:true, opacity:0.72}),
      fleck: new THREE.MeshLambertMaterial({color:W10PAL.regalG, emissive:0x9a7a2a, emissiveIntensity:0.35}),
    };
    this.headH = this.r*1.9;                    // bite ceiling 3.04 — the whole high-road ledger hangs on this
    this.ball.material = _w10l4M.orb;
    this.ball.children.forEach(c=>{ c.material = _w10l4M.fleck; c.scale.setScalar(0.6); });   // the snow-flecks become gilt inclusions
    for(let i=0;i<8;i++){                        // the crown of small spikes — royalty rolls armed
      const a=i/8*TAU; const spike=new THREE.Mesh(geo('cone',0.15,0.48,4), _w10l4M.orb);
      spike.position.set(Math.cos(a)*this.r*0.96, Math.sin(a)*this.r*0.96, 0); spike.rotation.z=a-Math.PI/2; this.ball.add(spike);
    }
    const core=mesh('sph',[0.3,8,7], emat(0x7ae8ff,0x7ae8ff,0.9)); this.ball.add(core);   // the cold heart
  }
}
// ---- the release clock: same fixed heartbeat as the fell's spawner, but the voice is a deep BELL TOLL (the
// court does not WHUMP), and every newborn orb carries 0.7s of spawn grace — the toll IS the telegraph, so
// walkers passing a bell-arch are never bitten by an orb still clearing its own doorway. ----
class FrostOrbSpawner extends AvalancheSpawner {
  update(dt, G){
    this.t += dt;
    if(this.t >= this.nextAt){
      this.nextAt += this.period;
      const orb = new FrostOrb(G, this.x, this.y, this.o);
      orb.spawnGrace = 0.7;                                        // harmless for its first 3.5u (kit-standard grace hook)
      G.ents.add(orb);
      G.fx.spawn(new THREE.Vector3(this.x, this.y+1.3, 0), 0xbfe8ff, 8, {speed:2.5, life:0.5});
      AUDIO.tone && AUDIO.tone({f:92, f2:58, type:'sine', t:1.2, vol:0.22});       // the toll — count your five seconds
      AUDIO.tone && AUDIO.tone({f:184, f2:116, type:'triangle', t:0.6, vol:0.08}); // its bronze overtone
      AUDIO.noise && AUDIO.noise({t:0.1, vol:0.07, fFrom:900, fTo:200});           // the clapper's strike
    }
  }
}

// ---- THE BELL-ARCH (baked deco — every orb needs a visible SOURCE): an ice doorway across the lane, a great
// gilt bell hung in the lintel (the toll's voice made visible), an aurora glow-curtain the orb bursts through,
// and spare rounds waiting by the posts (the calving-gantry idiom, dressed for court). ----
function w10l4BellArch(x){
  const g = new THREE.Group();
  for(const s of [-1,1]){
    const post = mesh('box',[0.7,4.6,0.7], mat(W10PAL.wall)); post.position.set(x, 2.3, s*1.55); g.add(post);
    const capP = mesh('box',[0.95,0.35,0.95], mat(0x2a3a60)); capP.position.set(x, 4.65, s*1.55); g.add(capP);
  }
  const lintel = mesh('box',[1.1,0.6,4.3], mat(0x2a3a60)); lintel.position.set(x, 5.1, 0); g.add(lintel);
  const bell = mesh('cone',[0.55,0.8,10], mat(W10PAL.regalG)); bell.position.set(x, 4.55, 0); g.add(bell);
  const clap = mesh('sph',[0.12,6,5], mat(0x2a3a60)); clap.position.set(x, 4.12, 0); g.add(clap);
  const glowP = new THREE.Mesh(geo('plane',2.0,3.6), new THREE.MeshBasicMaterial({color:0x58c8e8, transparent:true, opacity:0.26, side:THREE.DoubleSide, depthWrite:false}));
  glowP.rotation.y = Math.PI/2; glowP.position.set(x, 1.9, 0); g.add(glowP);   // the hall beyond — orbs burst through it
  const spare = new THREE.Mesh(geo('sph',0.75,10,8), new THREE.MeshLambertMaterial({color:W10PAL.ice, emissive:0x4a9ed0, emissiveIntensity:0.3, transparent:true, opacity:0.7}));
  spare.position.set(x+0.9, 0.75, -2.4); g.add(spare);
  const spare2 = spare.clone(); spare2.scale.setScalar(0.78); spare2.position.set(x-1.0, 0.6, 2.3); g.add(spare2);
  return g;
}

// ---- THE QUIET PROP: the portrait gallery. Eight gilt frames — every guardian this town ever loved, each
// painted SMALL and low in its canvas, in loving detail, from far away... because the painter watched them all
// from the palace windows and was invited to none of it. At the row's head: an easel with its canvas turned to
// face the wall (the one portrait never started), a stool, and a palette frozen mid-mix. Never signposted;
// fully baked; story-readers stop cold, everyone else walks past. ----
function w10l4Portraits(z){
  const g = new THREE.Group();
  const frameM = mat(W10PAL.regalG);
  const canvasM = new THREE.MeshLambertMaterial({color:0x141d38, emissive:0x0a1226, emissiveIntensity:0.5});
  const SUBJ = [
    (x,y)=>{ const s=mesh('sph',[0.15,8,7], emat(0xe8791e,0x8a3c0a,0.35)); s.position.set(x,y,z+0.09); g.add(s);              // I — the Pumpkin King, mid-laugh
      const cr=mesh('cyl',[0.09,0.07,0.06,6], mat(W10PAL.regalG)); cr.position.set(x,y+0.15,z+0.09); g.add(cr); },
    (x,y)=>{ const sl=mesh('box',[0.16,0.24,0.04], mat(0x6f7488)); sl.position.set(x,y+0.02,z+0.09); g.add(sl);               // II — Mossgrave, moss and all
      for(const [mx,my] of [[-0.05,0.1],[0.06,-0.03]]){ const mo=mesh('sph',[0.03,5,4], emat(0x6fae4c,0x3f7a2c,0.5)); mo.position.set(x+mx,y+my,z+0.11); g.add(mo); } },
    (x,y)=>{ const brim=mesh('cyl',[0.1,0.11,0.02,8], mat(0x3d2a5e)); brim.position.set(x-0.02,y+0.04,z+0.09); g.add(brim);   // III — Broomhilda, hat at an angle
      const crown=mesh('cone',[0.06,0.16,7], mat(0x3d2a5e)); crown.position.set(x-0.02,y+0.13,z+0.09); crown.rotation.z=0.22; g.add(crown);
      const brm=mesh('cyl',[0.012,0.012,0.3,4], mat(0x4a3222)); brm.position.set(x+0.09,y-0.04,z+0.09); brm.rotation.z=0.9; g.add(brm); },
    (x,y)=>{ const gh=new THREE.Mesh(geo('cone',0.09,0.2,7), new THREE.MeshLambertMaterial({color:0xbfe8dc, emissive:0x63e6e2, emissiveIntensity:0.35, transparent:true, opacity:0.7}));
      gh.position.set(x,y+0.02,z+0.09); g.add(gh);                                                                            // IV — Captain Wraith, mist under a tricorn
      const tri=mesh('box',[0.16,0.03,0.08], mat(0x1a1a2e)); tri.position.set(x,y+0.14,z+0.09); g.add(tri); },
    (x,y)=>{ const bd=mesh('sph',[0.13,8,6], mat(0x7a8aa8)); bd.scale.y=0.85; bd.position.set(x,y,z+0.09); g.add(bd);         // V — Grumble, brows first
      for(const s2 of [-1,1]){ const br=mesh('box',[0.08,0.025,0.03], mat(0xdfe8fa)); br.position.set(x+s2*0.05,y+0.08,z+0.16); br.rotation.z=s2*0.35; g.add(br); } },
    (x,y)=>{ const bd=mesh('sph',[0.13,8,6], mat(0x5e4630)); bd.position.set(x,y,z+0.09); g.add(bd);                          // VI — Ursa, ears like moons
      for(const s2 of [-1,1]){ const ear=mesh('sph',[0.045,6,5], mat(0x5e4630)); ear.position.set(x+s2*0.09,y+0.11,z+0.09); g.add(ear); } },
    (x,y)=>{ const pr=mesh('cone',[0.08,0.24,5], emat(0xb08aff,0x7a4fd0,0.7)); pr.position.set(x,y+0.02,z+0.09); g.add(pr);   // VII — Prismus, light holding still
      const gl=mesh('sph',[0.03,5,4], emat(0x7ae8ff,0x7ae8ff,1)); gl.position.set(x+0.07,y+0.12,z+0.11); g.add(gl); },
    (x,y)=>{ const tr=mesh('cone',[0.1,0.26,7], mat(0x1e4030)); tr.position.set(x,y+0.03,z+0.09); g.add(tr);                  // VIII — Tannenbaum, star kept lit
      const star=mesh('sph',[0.025,5,4], emat(0xffd23f,0xb8901e,0.9)); star.position.set(x,y+0.2,z+0.09); g.add(star); },
  ];
  for(let i=0;i<8;i++){
    const fx = 13.6 + i*1.18;
    const frame = mesh('box',[0.92,1.12,0.07], frameM); frame.position.set(fx, 1.72, z); g.add(frame);
    const canvas = new THREE.Mesh(geo('box',0.78,0.98,0.03), canvasM); canvas.position.set(fx, 1.72, z+0.03); g.add(canvas);
    SUBJ[i](fx, 1.55);                          // each likeness small and low in its frame — painted from far away
  }
  // the ninth: turned to the wall before it was ever begun
  for(const s of [-1,1]){ const leg=mesh('cyl',[0.03,0.035,1.5,5], mat(0x4a3a2c)); leg.position.set(12.2+s*0.3, 0.72, z+0.15); leg.rotation.z=s*0.14; g.add(leg); }
  const leg3=mesh('cyl',[0.03,0.035,1.4,5], mat(0x4a3a2c)); leg3.position.set(12.2, 0.68, z+0.42); leg3.rotation.x=-0.2; g.add(leg3);
  const back=mesh('box',[0.7,0.9,0.04], mat(0x8a7a5e)); back.position.set(12.2, 1.25, z+0.1); g.add(back);            // the canvas-back, all anyone will ever see
  const brace=mesh('box',[0.08,0.86,0.05], mat(0x6f6248)); brace.position.set(12.2, 1.25, z+0.13); g.add(brace);
  const stool=mesh('cyl',[0.22,0.26,0.42,8], mat(0x4a3a2c)); stool.position.set(11.3, 0.21, z+0.5); g.add(stool);
  const pal=mesh('cyl',[0.2,0.2,0.03,9], mat(0x8a7a5e)); pal.position.set(11.3, 0.45, z+0.5); pal.rotation.z=0.06; g.add(pal);
  for(const [px,pz,pc] of [[-0.08,0.05,0xe8791e],[0.06,0.09,0x6fae4c],[0.02,-0.08,0xb08aff]]){
    const blob=mesh('sph',[0.035,5,4], new THREE.MeshLambertMaterial({color:pc, emissive:0x223052, emissiveIntensity:0.4})); blob.scale.y=0.5; blob.position.set(11.3+px, 0.48, z+0.5+pz); g.add(blob);   // paint, frozen mid-mix
  }
  const brush=mesh('cyl',[0.012,0.012,0.34,4], mat(0x4a3222)); brush.position.set(11.5, 0.47, z+0.62); brush.rotation.z=1.35; g.add(brush);
  return g;
}

// ---- TAPESTRY CLIMB — the district's climbable, hung where the high road begins: a velvet runner with the
// court's frost-sigil stitched in, climbable to the ledge road (climb volume on the lane, cloth at wall depth). ----
function w10l4Tapestry(G, deco, x, h){
  const cloth = mesh('box',[0.95,h,0.09], mat(W10PAL.velvet)); cloth.position.set(x, h/2+0.08, -0.6); deco.add(cloth);
  const hem = mesh('box',[1.0,0.14,0.11], mat(W10PAL.regalG)); hem.position.set(x, 0.14, -0.6); deco.add(hem);
  const rod = mesh('cyl',[0.06,0.06,1.5,6], mat(W10PAL.regalG)); rod.rotation.z=Math.PI/2; rod.position.set(x, h+0.2, -0.6); deco.add(rod);
  for(const [sx,sy] of [[0,0.5],[0.24,0.32],[-0.24,0.32],[0,0.14],[0,0.68]]){
    const st = mesh('sph',[0.045,5,4], emat(W10PAL.frost,W10PAL.frost,0.7)); st.position.set(x+sx, h*0.5+sy, -0.54); deco.add(st);   // the stitched sigil
  }
  G.world.addBox(x, 0, 0, 0.9, h, 1.2, {type:'climb'});
}

function buildW10L4(G){
  const S = G.scene;
  levelBegin(G);

  const FLOOR = W10PAL.iceD;                // polished palace parquet (grippy — the precision lives on timing, not traction)
  const deco = new THREE.Group();           // all static scenery bakes to one draw call at the tail

  // =============================== BEAT 1 — THE ANTECHAMBER (x -8..22) ===============================
  groundX(G, -8, 22, FLOOR);
  G.ents.add(new Checkpoint(2, 0, 1.6, 0, {noLight:true}));   // CP0 — start (exam law: CP0 + ONE lit lantern)
  signPost(G, 6.5, 1.7, -0.1, "Welcome, guest, to the Aurora Gallery. The court advises: at each tolling of the bell, the gallery is bowled. One clears the orb with a leap, shatters it with a well-put spin, or - as the pages did, when nobody watched - rides its crown.");
  candyLine(G, [[8,0.9,0],[11,0.9,0]], 2);
  // THE FROST-LOCKED CHEST — the gamble, in its CLEAR POCKET (reach ledger in the header; nearest fixed bite 16.4u)
  { const ch = new FrostChest(14, 0, -0.9, 0.35); G.coffins.push(ch); G.ents.add(ch); }
  // THE QUIET PROP (never signposted): eight loving portraits, one turned-away canvas, a palette frozen mid-mix
  deco.add(w10l4Portraits(-2.7));
  G.ents.add(new Crow(20, 2.3, -2.62));     // palace crow #1 — perched on Tannenbaum's frame, marks the gap ahead
  candyLine(G, [[21,1.0,0],[23.5,2.1,0],[26,1.0,0]], 3);      // the arc over gap #1 (3.0u — tap law, friendly door)
  pitDressing(G, 22, 25, 'winter');

  // =============================== BEAT 2 — THE LONG GALLERY (x 25..62): INTRODUCE the orb ===============================
  groundX(G, 25, 99, FLOOR);                // one parquet run to gap #2 at 99
  // LANE A — released through bell-arch A at x86 on the shared heartbeat (firstAt 1.8, every 5s), rolling west
  // head-on and dying at 30 (bite cut 31.5 — a dying orb can never clip the antechamber door). The junction
  // sightline: you WATCH the gallery get bowled from the doorway before you ever step in.
  const spA = new FrostOrbSpawner(G, {x:86, y:0, dir:-1, speed:5, r:1.1, period:5, firstAt:1.8, endX:30});
  G.ents.add(spA);
  // mirror-sign pocket (w7l4 sign-clearance law): lane A's worst touch edge 30.45 (1.45u clear of a reader at
  // 29) · boo #1 engagement floor 31 (2u) · mirror #1 hall touch edge 42.34 (13.3u). Reading is a breath.
  signPost(G, 29, 1.6, 0.15, "The mirrors of this hall return every step given to them. Approach, and be approached. One passes a mirror by stepping where it cannot follow - or, frankly, above it.");
  candyLine(G, [[33,0.9,0],[38.5,0.9,0],[44,0.9,0]], 3);      // the dodge pockets — where the rhythm breathes
  { const b = new SnowBoo(G, 40, 0, -0.4, {phase:0.7, speed:2.0, range:9, freezeMax:2.6}); b.chaseR = 9; G.ents.add(b); }   // leashed: engages 31..49 only (CLEAR-PATCH + sign-pocket law)
  G.ents.add(new MirrorFrost(G, 48, 0, 0, {range:5, phase:0.3}));   // hall 43..53 — the palace remembers everyone who walked it
  // THE WINDOWSILL — the floor route's ONE orb-proof perch (y3.4 > bite ceiling 3.04): spring-gated (apex ~4.4),
  // its candy column telegraphs the verb (FEEL-PASS law). A stationary spring-winder mirrors to a stationary mirror.
  platform(G, 47, 3.4, 0, 2.4, 2, 0x8a9cc8);
  candyLine(G, [[47,1.6,0],[47,2.7,0],[47,3.95,0]], 3);
  candyLine(G, [[52,3.6,0],[56,3.6,0]], 2);                    // the EXPERT arc — crown-ride height, visible from the floor

  // =============================== BEAT 3 — THE WISP AISLE (x 62..86): TWIST — the wake fade ===============================
  // aisle-sign NOTE (pinned honestly — there is no shore in this level): x62 sits inside lane A, so a reader
  // shares the ground with the bell (the whole gallery is bowled; that IS the level). The fee is fair: the orb
  // is watched head-on from 24u out and crosses x62 at toll+4.8 of 5.0 — one unhurried hop per bell, with the
  // NEXT toll ringing 0.2s before each arrival as the metronome. Wisp #1's floor is 63.95; the still spots are
  // x<60.95 between passes and the tapestry pocket at 63.1.
  signPost(G, 62, 1.7, -0.12, "The ribbons of the first sky do not pause for visitors. Their wake bites while it burns and forgives as it fades. Cross behind them, never beneath. The herald will announce himself; he always has.");
  // TAPESTRY CLIMB — boards the ledge road (y3.4, climb-gated per the heights law): three sills, 1.5u hops,
  // above the wakes (cap 2.5+0.4=2.9), above the beam (band 0.55..1.25), above the orbs (ceiling 3.04).
  w10l4Tapestry(G, deco, 63.1, 3.6);
  platform(G, 65.8, 3.4, 0, 3, 2, 0x8a9cc8);
  platform(G, 70.3, 3.4, 0, 3, 2, 0x8a9cc8);
  platform(G, 74.8, 3.4, 0, 3, 2, 0x8a9cc8);
  candyLine(G, [[65.8,4.1,0],[70.3,4.1,0],[74.3,4.1,0]], 3);   // the high line — the itch, visible from the herald's lane
  G.ents.add(new BonkLantern(G, 74.8, 4.9, 0, 'bat'));         // the crown of the high road: 18s of wings for the court
  // WISPS #1/#2 — fixed sine lanes at biting height (wakes dip to ~0.7-0.9; they bite grounded players only on
  // the low dips — the fade IS the countdown). Lane #1 floors at 64.5: the tapestry pocket at 63.1 stays a breath.
  G.ents.add(new AuroraWisp(G, {x0:64.5, x1:74, y:1.7, period:6, amp:0.8, phase:0.8, color:0x58e0a8}));
  G.ents.add(new AuroraWisp(G, {x0:74.5, x1:86, y:1.6, period:7, amp:0.9, phase:2.2, color:0xb08aff}));
  // FROST HERALD #1 — the horn lane (beam 65..69.2 at band 0.55..1.25, hop it). Phase 2.6 sets the blow at
  // t≡1.6..2.6 while the orb sweeps 70->65 at t≡0..1: strict ALTERNATION, never a stacked wall (cap law).
  G.ents.add(new FrostHerald(G, 70, 0, 0, {phase:2.6, period:5.0, reach:4.2, dir:-1}));
  G.ents.add(new MirrorFrost(G, 80, 0, 0, {range:4, phase:1.2}));   // hall 76..84, under wisp #2 — floor pinch orb+wake+mirror = 3
  candyLine(G, [[64,0.9,0],[68.5,0.9,0],[73,0.9,0]], 3);
  candyLine(G, [[79,0.9,0],[83,0.9,0]], 2);

  // =============================== BEAT 4 — THE LANDING (x 86..99): the breath ===============================
  deco.add(w10l4BellArch(86));              // bell-arch A — lane A's source, tolling at the landing's lip
  // THE PARADE SIGN — the soldiers are NEW here (the district's first; the narrows-sign law: teach the machine
  // from the breath before it). Sign pocket for a reader at 87.6: lane A bites <=83.55 (4.05u) · wisp #2's
  // head/wake caps at 86.55 (1.05u — the w7l4 penguin-sign margin) · lane B >=106.45 · all else per the
  // lantern ledger above. Reading is a breath.
  signPost(G, 87.6, 1.7, -0.14, "Beyond the fountain court, the Palace Guard march the balcony. Each spans his post in exactly one tolling of the bell, and the two meet, hat to hat, at the change. The hats are flat, the pace is sworn, and the court sees no reason a guest of quality should walk.");
  G.ents.add(new Heart(89, 1.0, 0));        // mercy before the second page
  G.ents.add(new BonkLantern(G, 91.5, 1.5, 0, 'shield'));      // armor before the court
  candyLine(G, [[90,0.9,0],[92.5,0.9,0]], 2);
  G.ents.add(new Checkpoint(94, 0, 1.6, 1));                   // THE lantern — the level's ONE lit checkpoint (~55%; pocket ledger in header)
  signPost(G, 96.5, 1.7, 0.1, "The fountains keep the oldest rhythm in the palace: bell, breath, rise. When the gallery is bowled, the court stands upon the water. In ten thousand years it has never once been late.");
  G.ents.add(new Crow(97.5, 0.95, 2.1));    // palace crow #2 — staring at the gap (the house tell: a crow marks an edge)
  candyLine(G, [[98.2,1.0,0],[100.8,2.1,0],[103.4,1.0,0]], 3); // the arc over gap #2 (3.6u — held law, tap possible)
  pitDressing(G, 99, 102.6, 'winter');

  // =============================== BEAT 5 — THE FOUNTAIN COURT (x 102.6..133): ESCALATE — the refuge ===============================
  groundX(G, 102.6, 178, FLOOR);
  // LANE B — released through bell-arch B at x165 on the SAME heartbeat (firstAt 1.8 — both arches toll as one
  // bell), rolling the whole back half and dying at 106 (bite cut 107.5: gap #2 jumpers land on honest ground).
  const spB = new FrostOrbSpawner(G, {x:165, y:0, dir:-1, speed:5, r:1.1, period:5, firstAt:1.8, endX:106});
  G.ents.add(spB);
  G.ents.add(new AuroraWisp(G, {x0:104, x1:114, y:2.0, amp:0.8, period:6.5, phase:1.1, color:0x7ae8ff}));   // air pressure on the run-in (window edge 103.45 spares the gap landing)
  candyLine(G, [[107,0.9,0],[111,0.9,0],[115,0.9,0]], 3);
  // THE FROZEN FOUNTAIN — phase-locked to the heartbeat (period 5, phase 2.8; cyc = lt+2.8 mod 5, kit timeline
  // teleAt 1.4): bubbles t≡3.6 → rise 4.3 → pillar holds 4.8..2.15 → THE ORB PASSES BENEATH at t≡1.2 (arrival =
  // firstAt 1.8 + 47u/5 ≡ 1.2; ±2u sweep ≡0.8..1.6, all inside the hold, 1.0s/0.55s margins) → cracks warn from
  // 1.5 → shatter 2.15, dropping the rider ~4.7u BEHIND the departing orb (it exits west, never returns).
  // The pillar is the refuge; the orb glitters straight through the frozen spray beneath the cap (cap col min
  // 3.6 > the ball's 2.2 ground-probe — it never treats the fountain as terrain).
  // Late arrivals can't board mid-hold (cap 3.86 > double 3.3) — they double-jump the crown instead, as taught.
  w10Geyser(G, 118, {period:5.0, phase:2.8, height:3.6, holdT:2.4});
  candyLine(G, [[117.2,4.5,0],[118.8,4.5,0]], 2);              // the cap halo — traces the ride up
  { const courtL = new THREE.PointLight(0x9ac8ff, 30, 15); courtL.position.set(118, 7, -1.5); S.add(courtL); }   // the court's own cold chandelier-glow
  // FROST KNIGHT #1 — walks the court's east porch (patrol 124.6..129.4 — his walk stops 0.4u shy of
  // plinth1's west face, so the guard never clips the stone). His wake needs a player below y1.8:
  // fountain-cap riders never trigger him; his east lunge reaches 133.58 — plinth1 is contested, bow-telegraphed.
  G.ents.add(new FrostKnight(G, 127, 0, 0, {phase:0.6, range:2.4, dir:-1, speed:1.5}));
  candyLine(G, [[122.5,0.9,0],[124.8,0.9,0]], 2);              // the knight-bait line

  // =============================== BEAT 6 — THE ROYAL BALCONY (x 133..163): MASTER — the ride above the rhythm ===============================
  // Boarding: plinth chain 1.2 -> 3.3 (steps 1.2/2.1 + a 1.3u held hop, heights law) — plinth1 is a STEP
  // (inside the lane's bite band, crested t≡3.44..3.84 each bell), plinth2 is the safe WAIT (y3.3 — above
  // the orb's 3.04 ceiling and the knight's 1.35 bite ceiling; balcony-floor ledger in the header).
  platform(G, 130.8, 1.2, 0, 2, 2, 0x8a9cc8);
  platform(G, 134.2, 3.3, 0, 2.2, 2, 0x8a9cc8);
  // THE SOLDIERS — each crosses his 10u span in EXACTLY one bell (speed 2, P=5; phases 0/5): they meet at their
  // inner ends every t≡5 mod 10 — the hat-to-hat transfer (2u centers, 0.7u col gap) — and 0.2s after the leap
  // an orb sweeps beneath the landing rider (orb at 149 at t≡5: release 1.8 + 16u/5). Deterministic drama.
  w10Soldier(G, {x0:136, x1:146, y:0, speed:2, phase:0});
  w10Soldier(G, {x0:148, x1:158, y:0, speed:2, phase:5});
  candyLine(G, [[139,4.3,0],[143,4.3,0],[151,4.3,0],[155,4.3,0]], 4);   // the hat line — visible from the floor (the itch)
  candyLine(G, [[147,4.6,0]], 1);                                       // the transfer arc
  // the floor route under the ride: mirror + boo + knight share the stretch in staggered zones (pinch <=3 + orbs...
  // zones: mirror 135..143 & boo 138..158 & orb =3 · boo & knight 149.9..155.1 & orb =3 — the cap holds everywhere)
  G.ents.add(new MirrorFrost(G, 139, 0, 0, {range:4, phase:0.9}));
  { const b2 = new SnowBoo(G, 148, 0, -0.3, {phase:1.5, speed:2.1, range:9, freezeMax:2.6}); b2.chaseR = 10; G.ents.add(b2); }
  G.ents.add(new FrostKnight(G, 152.5, 0, 0, {phase:1.9, range:2.6, dir:1, speed:1.6}));
  candyLine(G, [[137,0.9,0],[142,0.9,0],[147,0.9,0]], 3);
  // the balcony loggia (baked): columns + rail behind the march — sells the high road as ARCHITECTURE
  for(let bx=135.5; bx<=159.5; bx+=4.8){
    const col2 = mesh('cyl',[0.16,0.2,3.1,7], mat(0x2a3a60)); col2.position.set(bx, 1.55, -1.62); deco.add(col2);
  }
  { const rail = mesh('box',[25.5,0.18,0.24], mat(W10PAL.regalS)); rail.position.set(147.5, 3.25, -1.62); deco.add(rail); }
  G.ents.add(new Crow(150, 3.5, -1.55));    // palace crow #3 — on the rail, unimpressed by the parade
  // THE DISMOUNT LEDGE (y3.3 — above the lane's ceiling, clear of soldier #2's head by 1.3u) and its gatekeeper:
  // FROST HERALD #2 blows west along the rider band (beam 157.2..161.4 at 3.85..4.55 — floor walkers below are
  // never touched). Phase 1.7 puts the blow at t≡2.5..3.5 mod 5: the rhythm rider (dismounting t≡0) never meets
  // it; the dawdler and the second-lap tourist do. The horn-raise is the 0.7s courtesy, as ever.
  platform(G, 161.4, 3.3, 0, 3, 2, 0x8a9cc8);
  G.ents.add(new FrostHerald(G, 162.2, 3.3, 0, {phase:1.7, period:5.0, reach:4.2, dir:-1}));

  // =============================== BEAT 7 — THE GREAT DOORS (x 163..178): exhale, toll, gate ===============================
  deco.add(w10l4BellArch(165));             // bell-arch B — lane B's source (orbs carry 0.7s grace: harmless until x161.5)
  signPost(G, 168, 1.7, -0.1, "You have crossed the gallery that was painted for guests who never came. The court notes, for the record, that you DID come. It will be spoken of, warmly, for the next ten thousand years.");
  candyLine(G, [[166.5,0.9,0],[169.5,0.9,0]], 2);
  { const lamp = new THREE.PointLight(0xffb85e, 24, 10); lamp.position.set(172.5, 3.4, -1); S.add(lamp); }   // the gate's warm welcome — the first warm light since the antechamber
  exitGate(G, 172);

  // =============================== DECO · SILHOUETTES · PARALLAX · TAIL ===============================
  // velvet runners along the processional route (thin — blob shadows peek at the edges), gilt end-caps
  for(const [r1,r2] of [[4,20],[27,58],[64,84],[104,130],[136,156]]){
    const run = mesh('box',[r2-r1,0.05,1.5], mat(W10PAL.velvet)); run.position.set((r1+r2)/2, 0.1, 0); deco.add(run);
    for(const re of [r1,r2]){ const capR = mesh('box',[0.3,0.06,1.56], mat(W10PAL.regalG)); capR.position.set(re, 0.1, 0); deco.add(capR); }
  }
  // chandeliers, hung high and burning cold (baked, emissive — the real-light budget stays at 4/6)
  for(const cx of [36, 70, 122, 146]){
    const ring = mesh('tor',[0.7,0.06,5,14], mat(W10PAL.regalG)); ring.rotation.x=Math.PI/2; ring.position.set(cx, 6.8, -1.2); deco.add(ring);
    for(let ci=0; ci<5; ci++){ const a=ci/5*TAU; const fl = mesh('sph',[0.07,5,4], emat(0x7ae8ff,0x7ae8ff,0.9)); fl.position.set(cx+Math.cos(a)*0.7, 6.95, -1.2+Math.sin(a)*0.7); deco.add(fl); }
    const chain = mesh('cyl',[0.03,0.03,2.4,4], mat(0x2a3a60)); chain.position.set(cx, 8.2, -1.2); deco.add(chain);
  }
  // FOREGROUND silhouettes (z>0): fallen column drums + a tipped candelabrum framing the depth
  for(const [fx,fr] of [[40,0.4],[85,-0.3],[130,0.35],[168,-0.4]]){
    const drum = mesh('cyl',[0.55,0.6,1.1,8], mat(0x121c34)); drum.position.set(fx, 0.4, 2.7); drum.rotation.z=Math.PI/2+fr; deco.add(drum);
  }
  { const cand = mesh('cyl',[0.06,0.1,1.7,6], mat(0x121c34)); cand.position.set(107, 0.4, 2.6); cand.rotation.z=1.2; deco.add(cand); }
  S.add(bakeGroup(deco));

  w10Parallax(S, -8, 178);
  w10LevelFinish(G, -8, 178, null);         // null clutter: baked props must not float over the two gaps (w7l4 precedent)...
  w10Clutter(G, -8, 21.5, 'palace');        // ...so the solid spans are cluttered manually
  w10Clutter(G, 25.5, 98.5, 'palace');
  w10Clutter(G, 103.2, 177, 'palace');

  return {spawnX: 0, exitX: 172};
}

function updateW10L4(G, dt){
  updateLevelCommon(G, dt);
  // no level-local glue: the bells, the fountain, the soldiers and the horns all share the one fixed heartbeat
  // through their own entities — 10-4's composition is pure phase, which is exactly the point.
}

W10_LEVELS.push({id:'w10l4', district:'w10', name:'THE AURORA GALLERY', build:buildW10L4, update:updateW10L4, parTime:170});

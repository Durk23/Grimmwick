// ============ D3 KIT — Witchwood building blocks (haunted witch forest) ============
// Sorts after 09_levelkit.js (so LEVEL_LISTS + the shared kit exist) and after the D2 kit/levels,
// and before the future D3 level files (09u... < 09v...). REUSES 09_levelkit's levelBegin/exitGate/
// updateLevelCommon and 00_utils/08_hub builders wherever they fit; this file only adds what Witchwood
// needs on top. All static deco is BAKED (bakeGroup) — zero draw-call cost; potion/cauldron/wisp glows
// are EMISSIVE fakes (bakeGroup lifts emissive into vertex colour), so the ≤6 real-PointLight budget
// stays free for the few hero lanterns/cauldrons that actually ask for opts.light.
// Determinism: cosmetic scatter uses rand() (switchArea seeds per area — identical every replay); the
// CauldronDip's brew choice is seeded per placement so a dip is replayable, pebble for pebble.
//
// ONE CONTRACT D3 LEVEL FILES SHOULD HONOUR (documented here because this kit can't edit levelFinish):
//   AMBIENCE — call w3LevelFinish(G, x1, x2, clutterTheme) as the build tail INSTEAD of 09_levelkit's
//   levelFinish (whose buildAmbience paints the orange Pumpkin-Patch skyline). w3LevelFinish sets
//   G.checkpoint / G.bats / G.amb the same way, but with Witchwood's spore-and-potion backdrop.

// ---- Witchwood palette: cold green-violet woods, glowing potion teal-green, web off-white ----
const W3PAL = {
  bark:     0x352c46,  barkD:    0x241d33,  barkL:    0x463a5c,   // crooked braided-tree trunks (violet-brown)
  canopy:   0x2f4636,  canopyD:  0x1f3026,  canopyL:  0x3d5a45,   // deep forest foliage (green-violet)
  ground:   0x2b3a30,  groundD:  0x1d2a22,  groundL:  0x3d5140,   // mossy forest floor
  hillNear: 0x243a30,  hillFar:  0x172619,                        // misty tree-mass hills
  potion:   0x53e6b0,  potionV:  0x9d7bff,  potionP:  0x7dffce,   // glowing potion teal-green · violet · pale
  web:      0xe6e6f2,  webD:     0xb9b9cc,                        // spider-web off-white
  cauldron: 0x1a2620,  cauldronR:0x3a3048,                        // iron cauldron body · rim
  brew:     0x5cf2b0,  brewV:    0xb06bff,                        // bubbling cauldron glow (teal / violet froth)
  hut:      0x4a3a2c,  hutD:     0x352a1f,  hutRoof:  0x3a2f4a,    // witch-hut timber brown · violet thatch
  hutWin:   0xffd15e,                                             // warm glowing hut window
  cap:      0xd0463e,  capL:     0xe86a52,  spot:     0xf2e6d0,   // toadstool red caps · cream spots
  wisp:     0x9dffe0,                                             // will-o'-wisp glow
};

// =============================== 1) BACKDROPS + AMBIENCE ===============================
// w3Parallax(S, x1, x2): baked three-depth forest skyline — near crooked trees, a witch-hut/crooked-
// cottage silhouette row at mid-depth, far misty tree masses — plus a floating potion-glow band so the
// district reads as an enchanted wood the instant it loads.
function w3Parallax(S, x1, x2){
  // NEAR — a ragged line of crooked tree silhouettes (trunk + canopy blob), leaning every which way
  const near = new THREE.Group();
  for(let x=x1-30; x<x2+30; x+=rand(6,10)){
    const hh = rand(4,7);
    const tr = mesh('cyl',[0.5,0.85,hh,6], mat(W3PAL.barkD)); tr.position.set(x, hh/2-1, -13); crook(tr,0.12); near.add(tr);
    for(let c=0;c<2;c++){
      const cn = mesh('sph',[rand(1.6,2.6),9,7], mat(c?W3PAL.canopyD:0x1a2a20));
      cn.position.set(x+rand(-1,1), hh-0.5+rand(-0.4,0.8), -13.4); cn.scale.set(1.2,0.9,0.7); near.add(cn);
    }
  }
  S.add(bakeGroup(near));
  // MID — a crooked-cottage / witch-hut skyline row with a few warm glowing windows
  const town = new THREE.Group();
  for(let x=x1-18; x<x2+18; x+=rand(12,20)){
    const bw=rand(2,3), bh=rand(2.6,4.2);
    const b = mesh('box',[bw,bh,1.4], mat(0x1c1726)); b.position.set(x,bh/2,-19); crook(b,0.05); town.add(b);
    const roof = mesh('cone',[bw*0.85,rand(1.8,2.6),4], mat(0x241a30)); roof.position.set(x, bh+0.9, -19); roof.rotation.y=Math.PI/4; crook(roof,0.06); town.add(roof);
    // a crooked witch-hat lean to some roofs
    if(rand()<0.5) roof.rotation.z = rand(-0.18,0.18);
    if(rand()<0.85){ const w=mesh('box',[0.3,0.4,0.1], emat(W3PAL.hutWin,W3PAL.hutWin,0.9)); w.position.set(x+rand(-0.5,0.5), rand(1,2.4), -18.2); town.add(w); }
  }
  S.add(bakeGroup(town));
  // FAR — soft misty tree masses receding into the fog
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(11,17)){
    const h=mesh('sph',[rand(8,14),8,6], mat(W3PAL.hillFar)); h.position.set(x, rand(-3,0), -28); h.scale.set(1,rand(0.55,0.8),0.6); far.add(h);
  }
  S.add(bakeGroup(far));
  // POTION-GLOW MIDGROUND — a scatter of emissive potion motes hanging in the wood (baked emissive fakes)
  const glow = new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/5);i++){
    const cc = pick([W3PAL.potion, W3PAL.potionV, W3PAL.potionP]);
    const g = mesh('sph',[rand(0.14,0.28),6,5], emat(cc,cc,0.95));
    g.position.set(rand(x1,x2), rand(1.5,6), rand(-9,-4)); glow.add(g);
  }
  S.add(bakeGroup(glow));
}

// w3Ambience(S, x1, x2): drifting spores + floating potion motes (the "leaf" channel), fireflies (the
// "flies" channel) and slow green mist banks (the "clouds" channel) — returned in the exact shape
// 09_levelkit's updateAmbience already animates ({flies, leaves, clouds, x1, x2}), so no engine edit.
function w3Ambience(S, x1, x2){
  // leaves channel — repurposed as drifting spores / floating potion motes (small glowing discs)
  const leaves = [];
  for(let i=0;i<15;i++){
    const cc = pick([W3PAL.potion, W3PAL.potionP, W3PAL.wisp, 0xbfae6a]);   // teal/pale potion motes + a few pale spores
    const lf = new THREE.Mesh(geo('circ',0.14,6), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0.6, side:THREE.DoubleSide, depthWrite:false}));
    lf.userData = {x0:rand(x1,x2), y0:rand(3,9), sp:rand(0.4,1.0), ph:rand(9), sw:rand(0.9,2.0)};
    S.add(lf); leaves.push(lf);
  }
  // flies channel — fireflies / wisp-glints pulsing through the midground (greenish potion light)
  const fg = new THREE.BufferGeometry(); const fp=[];
  for(let i=0;i<44;i++) fp.push(rand(x1,x2), rand(0.5,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:W3PAL.wisp, size:0.14, transparent:true, opacity:0.85}));
  S.add(flies);
  // clouds channel — slow low-drifting green mist banks
  const clouds = [];
  for(let i=0;i<4;i++){
    const cl = new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x24382c, transparent:true, opacity:0.42}));
    cl.scale.set(1.9,0.24,0.6);
    cl.userData = {y:rand(0.5,1.6), sp:rand(0.3,0.7), x:rand(x1-20,x2+20)};
    cl.position.set(cl.userData.x, cl.userData.y, -3.5);
    S.add(cl); clouds.push(cl);
  }
  return {flies, leaves, clouds, x1, x2};
}

// w3LevelFinish(G, x1, x2, clutterTheme): the D3 build tail — the drop-in replacement for
// 09_levelkit.levelFinish (whose ambience is Pumpkin-Patch orange). Sets checkpoint / bats / amb + clutter.
function w3LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 7, 34);
  G.amb  = w3Ambience(G.scene, x1, x2);
  if(clutterTheme) w3Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) DECO BUILDERS (baked by caller) ===============================
// These builders take NO G and add NO collider — they return a Group the caller merges with bakeGroup
// (one draw call). Add a platform()/addBox collider yourself where a piece is meant to be standable.

// braidedTree(x,z,s): the district's signature — a crooked twisted trunk (two braided strands winding
// round each other) topped with a knot of deep green-violet foliage.
function braidedTree(x, z, s=1){
  const g = new THREE.Group();
  const bark=mat(W3PAL.bark), barkD=mat(W3PAL.barkD);
  const H = 3.2*s;
  // two intertwining trunk strands — the "braid"
  for(let strand=0; strand<2; strand++){
    const ph = strand*Math.PI;
    for(let y=0; y<H; y+=0.34*s){
      const t=y/H;
      const seg = mesh('cyl',[0.13*s*(1-t*0.4), 0.16*s*(1-t*0.4), 0.4*s, 6], strand?barkD:bark);
      seg.position.set(x+Math.sin(y*2.4+ph)*0.16*s, y+0.2*s, z+Math.cos(y*2.4+ph)*0.16*s);
      seg.rotation.z = Math.sin(y*2.4+ph)*0.3;
      g.add(seg);
    }
  }
  // gnarled branches reaching out
  for(let i=0;i<3;i++){
    const br = mesh('cyl',[0.04*s,0.09*s,rand(0.9,1.5)*s,5], barkD);
    br.position.set(x+rand(-0.2,0.2)*s, (2.0+i*0.4)*s, z+rand(-0.2,0.2)*s);
    br.rotation.z = rand(0.5,1.1)*(i%2?1:-1); br.rotation.x = rand(-0.5,0.5);
    g.add(br);
  }
  // foliage knot — overlapping squashed spheres, a hint of violet on the crown
  for(let i=0;i<4;i++){
    const cn = mesh('sph',[rand(1.0,1.6)*s, 9, 7], i===3?mat(W3PAL.canopyL):mat(i%2?W3PAL.canopy:W3PAL.canopyD));
    cn.position.set(x+rand(-0.7,0.7)*s, H+rand(-0.2,0.6)*s, z+rand(-0.5,0.5)*s);
    cn.scale.set(1.2,0.85,1.0); g.add(cn);
  }
  // NO group rotation: children sit at absolute world coords, and bakeGroup bakes matrixWorld —
  // a group rotation would spin the whole tree about the world origin and fling it across the level.
  // (the per-segment braid twist above already makes it look crooked.)
  return g;
}

// witchHut(x,z,s): a crooked cottage up on stilts with a tall witch-hat roof and a warm glowing window.
function witchHut(x, z, s=1){
  const g = new THREE.Group();
  const timber=mat(W3PAL.hut), timberD=mat(W3PAL.hutD), thatch=mat(W3PAL.hutRoof);
  const floorY = 1.8*s;
  // four crooked stilt legs + cross-braces
  for(const [lx,lz] of [[-0.8,-0.7],[0.8,-0.7],[-0.8,0.7],[0.8,0.7]]){
    const leg = mesh('cyl',[0.09*s,0.13*s,floorY,5], timberD);
    leg.position.set(x+lx*s, floorY/2, z+lz*s); crook(leg,0.08); g.add(leg);
  }
  const deck = mesh('box',[2.1*s,0.16*s,1.9*s], timberD); deck.position.set(x,floorY,z); g.add(deck);
  // leaning hut body
  const body = mesh('box',[1.7*s,1.5*s,1.5*s], timber); body.position.set(x,floorY+0.85*s,z); crook(body,0.05); g.add(body);
  // plank seams
  for(let i=0;i<3;i++){ const pl=mesh('box',[1.72*s,0.05*s,1.52*s], timberD); pl.position.set(x,floorY+0.4*s+i*0.42*s,z); g.add(pl); }
  // tall crooked witch-hat roof (overhanging)
  const roof = mesh('cone',[1.5*s,2.0*s,5], thatch); roof.position.set(x,floorY+2.5*s,z); roof.rotation.y=Math.PI/5; roof.rotation.z=rand(-0.12,0.12); g.add(roof);
  const roofTip = mesh('sph',[0.12*s,6,5], mat(W3PAL.barkD)); roofTip.position.set(x,floorY+3.5*s,z); g.add(roofTip);
  // warm glowing window + door
  const win = mesh('box',[0.55*s,0.6*s,0.08], emat(W3PAL.hutWin,W3PAL.hutWin,0.9)); win.position.set(x,floorY+0.9*s,z+0.78*s); g.add(win);
  const sill = mesh('box',[0.65*s,0.09*s,0.12*s], timberD); sill.position.set(x,floorY+0.56*s,z+0.79*s); g.add(sill);
  const door = mesh('box',[0.5*s,0.9*s,0.06], timberD); door.position.set(x-0.55*s,floorY+0.55*s,z+0.76*s); g.add(door);
  // crooked chimney with a faint smoke puff
  const chim = mesh('box',[0.24*s,0.7*s,0.24*s], timberD); chim.position.set(x+0.55*s,floorY+2.4*s,z-0.3*s); crook(chim,0.1); g.add(chim);
  const puff = mesh('sph',[0.22*s,6,5], emat(0x3a4a40,0x2a3830,0.4)); puff.position.set(x+0.55*s,floorY+3.0*s,z-0.3*s); g.add(puff);
  g.position.set(0,0,0);
  return g;
}

// cauldronDeco(x,z,s): a fat iron cauldron on a tripod, bubbling with emissive teal brew (pure deco —
// emissive-only glow, no PointLight; a level drops a real budgeted light on a hero cauldron itself).
function cauldronDeco(x, z, s=1){
  const g = new THREE.Group();
  const iron=mat(W3PAL.cauldron), rim=mat(W3PAL.cauldronR);
  // tripod legs
  for(let i=0;i<3;i++){ const a=i/3*TAU; const leg=mesh('cyl',[0.05*s,0.06*s,0.6*s,4], iron); leg.position.set(x+Math.cos(a)*0.35*s, 0.3*s, z+Math.sin(a)*0.35*s); leg.rotation.z=Math.cos(a)*0.25; leg.rotation.x=-Math.sin(a)*0.25; g.add(leg); }
  const belly = mesh('sph',[0.7*s,12,10], iron); belly.position.set(x,0.85*s,z); belly.scale.set(1,0.9,1); g.add(belly);
  const lip = mesh('cyl',[0.66*s,0.72*s,0.16*s,12], rim); lip.position.set(x,1.28*s,z); g.add(lip);
  // bubbling brew surface + a few rising bubbles (emissive fakes)
  const brew = mesh('cyl',[0.6*s,0.6*s,0.08,12], emat(W3PAL.brew,W3PAL.brew,0.95)); brew.position.set(x,1.3*s,z); g.add(brew);
  for(let i=0;i<4;i++){ const b=mesh('sph',[rand(0.07,0.13)*s,6,5], emat(i%2?W3PAL.brewV:W3PAL.brew, W3PAL.brew, 0.9)); b.position.set(x+rand(-0.4,0.4)*s, 1.32*s+rand(0,0.3)*s, z+rand(-0.4,0.4)*s); g.add(b); }
  // no group rotation — children are at absolute coords; a group rotation would fling the baked cauldron off-origin
  return g;
}

// hangingWeb(x,z,s): a corner web of off-white strands strung from a top anchor down into view (all
// geometry sits in POSITIVE local y, ~0..1.4*s, so it's visible placed at ground OR lifted into a tree
// fork via `.position.y`). Baked as thin solid lines so the merge keeps them crisp. Deco only — for a
// CLIMBABLE web use w3Web below.
function hangingWeb(x, z, s=1){
  const g = new THREE.Group();
  const wm=mat(W3PAL.web), wmD=mat(W3PAL.webD);
  const top=1.4*s, spokes=7;
  // radial spokes fanning down-and-out from the top anchor to the spread base
  for(let i=0;i<spokes;i++){
    const a=Math.PI*(0.15+0.7*(i/(spokes-1)));            // fan direction
    const spread=Math.cos(a)*1.2*s, drop=top*rand(0.7,1.0);
    const len=Math.hypot(spread, drop);
    const sp=mesh('cyl',[0.012*s,0.012*s,len,4], wm);
    sp.position.set(spread/2, top-drop/2, 0);
    sp.rotation.z=Math.atan2(drop, spread)-Math.PI/2; g.add(sp);
  }
  // concentric strand arcs bridging the spokes (an upper half-web)
  for(let r=1;r<=3;r++){
    const rr=1.1*s*r/3.2;
    const ring=mesh('tor',[rr,0.011*s,4,10, Math.PI], wmD); ring.rotation.z=Math.PI; ring.position.set(0,top,0); g.add(ring);
  }
  g.position.set(x,0,z);
  return g;
}

// mushroomCluster(x,z,s): a knot of red toadstools with cream-spotted caps — Witchwood's ground jewel.
function mushroomCluster(x, z, s=1){
  const g = new THREE.Group();
  const n=3+Math.floor(rand(0,3));
  for(let i=0;i<n;i++){
    const mx=x+rand(-0.5,0.5)*s, mz=z+rand(-0.5,0.5)*s, ms=rand(0.6,1.1)*s;
    const stem=mesh('cyl',[0.09*ms,0.12*ms,0.4*ms,6], mat(0xe7ded0)); stem.position.set(mx,0.2*ms,mz); crook(stem,0.08);
    const cap=mesh('sph',[0.28*ms,9,7], i%2?mat(W3PAL.capL):mat(W3PAL.cap)); cap.position.set(mx,0.42*ms,mz); cap.scale.set(1.2,0.7,1.2);
    g.add(stem,cap);
    for(let sdot=0;sdot<3;sdot++){ const dot=mesh('sph',[0.045*ms,5,4], mat(W3PAL.spot)); const a=rand(TAU); dot.position.set(mx+Math.cos(a)*0.16*ms, 0.5*ms, mz+Math.sin(a)*0.16*ms); g.add(dot); }
  }
  return g;
}

// potionBottle(x,z): a little corked bottle of glowing brew — the quiet witch-shop touch.
function potionBottle(x, z){
  const g = new THREE.Group();
  const cc = pick([W3PAL.potion, W3PAL.potionV, W3PAL.potionP]);
  const body = mesh('sph',[0.16,9,8], emat(cc,cc,0.7)); body.position.set(x,0.16,z); body.scale.set(1,1.15,1);
  const neck = mesh('cyl',[0.05,0.07,0.14,7], emat(cc,cc,0.4)); neck.position.set(x,0.34,z);
  const cork = mesh('cyl',[0.06,0.05,0.08,7], mat(0x8a6f3e)); cork.position.set(x,0.43,z);
  g.add(body,neck,cork);
  return g;
}

// willOWisp(x,y,z): a floating will-o'-wisp — an emissive fake-light (NOT a real PointLight, keeps the
// budget free). A bright emissive core inside a soft transparent halo (MeshBasicMaterial so it reads as
// a GLOW regardless of scene lighting — a shaded Lambert sphere would just look like a grey ball). Add
// it LIVE (don't bake) so the halo keeps its translucency; a level can bob/pulse it.
function willOWisp(x, y=1.6, z=0){
  const g = new THREE.Group();
  const core = mesh('sph',[0.12,8,7], emat(0xffffff, W3PAL.wisp, 1));
  const halo = new THREE.Mesh(geo('sph',0.28,10,8), new THREE.MeshBasicMaterial({color:W3PAL.wisp, transparent:true, opacity:0.4, depthWrite:false}));
  const halo2 = new THREE.Mesh(geo('sph',0.19,10,8), new THREE.MeshBasicMaterial({color:0xd6fff0, transparent:true, opacity:0.55, depthWrite:false}));
  g.add(halo, halo2, core);
  g.position.set(x,y,z);
  return g;
}

// =============================== 3) CLIMBABLES (D3 flavour — the Web Gallery) ===============================
// Modelled on 00_utils.buildWebNet: a translucent web wall + a {type:'climb'} world volume (press up to
// grab, climb in four directions, jump off with a boosted hop). Kept LIVE (not baked) so the web stays
// see-through. w3Web spans an arbitrary vertical band [y0,y1] so it works as a wall OR a big gallery net.
function w3Web(G, x, y0, y1, z=0, w=3){
  const g = new THREE.Group();
  const wm = new THREE.MeshLambertMaterial({color:W3PAL.web, transparent:true, opacity:0.7, side:THREE.DoubleSide});
  const h = y1-y0;
  // vertical strands
  for(let i=0;i<=Math.floor(w/0.6);i++){
    const v = new THREE.Mesh(geo('cyl',0.026,0.026,h,4), wm);
    v.position.set(x-w/2+i*0.6, y0+h/2, z); g.add(v);
  }
  // horizontal strands
  for(let j=0;j<=Math.floor(h/0.6);j++){
    const hz = new THREE.Mesh(geo('cyl',0.026,0.026,w,4), wm);
    hz.rotation.z=Math.PI/2; hz.position.set(x, y0+j*0.6+0.1, z); g.add(hz);
  }
  // a couple of diagonal guy-strands for that hand-spun look
  for(let d=-1;d<=1;d+=2){
    const diag = new THREE.Mesh(geo('cyl',0.02,0.02,Math.hypot(w,h),4), wm);
    // a cylinder's axis is VERTICAL — lean it by the COMPLEMENT so it lies corner-to-corner
    // (atan2(h,w) left wide webs with near-upright strands stabbing past the top and bottom)
    diag.position.set(x, y0+h/2, z); diag.rotation.z = d*(Math.PI/2 - Math.atan2(h,w)); g.add(diag);
  }
  G.scene.add(mergeStrands(g, wm));   // ~15-24 transparent strand meshes → 1 draw call (w3l2 has 10 webs)
  return G.world.addBox(x, y0, z, w, h, 1.2, {type:'climb'});
}

// =============================== 4) MYSTERY CAULDRON — the D3 gamble container ===============================
// Witchwood's CursedCoffin/RestlessUrn equivalent: SAME gamble table (8% 1-UP / 24% jackpot / 38% treats /
// 30% ambush), SAME CLEAR-PATCH LAW (levels place it in a clear pocket, no patrols within ~6u), SAME 1s
// spawnGrace on the ambush — but the ambush is a WIDOWMITE SWARM pouring out of the brew. Integrates
// EXACTLY like CursedCoffin: has .opened / .group.position / .open(G) / .promptLabel; a level pushes it to
// G.coffins AND G.ents.add(...)s it, so 09_levelkit.updateLevelCommon renders the interact prompt + calls
// .open(G) on interact. (updateLevelCommon's default prompt string is coffin-worded; .promptLabel is
//  carried for when that shared prompt is generalised.)
class MysteryCauldron {
  constructor(x, y, z, ry=0){
    this.group = new THREE.Group();
    const iron=mat(W3PAL.cauldron), rim=mat(W3PAL.cauldronR), stone=mat(0x4a4650);
    // stone hearth base the cauldron squats on
    const slab = mesh('box',[2.0,0.24,2.0], stone); slab.position.y=0.12;
    // three log/stone tripod legs
    for(let i=0;i<3;i++){ const a=i/3*TAU; const leg=mesh('cyl',[0.09,0.11,0.7,5], iron); leg.position.set(Math.cos(a)*0.55,0.45,Math.sin(a)*0.55); leg.rotation.z=Math.cos(a)*0.22; leg.rotation.x=-Math.sin(a)*0.22; this.group.add(leg); }
    // the big cauldron belly (its own group so it can shudder)
    this.pot = new THREE.Group();
    const belly = mesh('sph',[1.0,14,12], iron); belly.position.y=0.9; belly.scale.set(1,0.92,1);
    const lip = mesh('cyl',[0.94,1.02,0.2,14], rim); lip.position.y=1.5;
    const handL = mesh('tor',[0.16,0.05,5,10], rim); handL.position.set(-0.98,1.0,0); handL.rotation.y=Math.PI/2;
    const handR = handL.clone(); handR.position.x=0.98;
    // glowing bubbling brew surface + rising bubbles (own material instance — emat() is cached/shared,
    // so we clone before animating emissiveIntensity to avoid flickering every other brew in the level)
    this.brew = mesh('cyl',[0.88,0.88,0.1,14], emat(W3PAL.brew,W3PAL.brew,0.95).clone()); this.brew.position.y=1.52;
    this.bubbles=[];
    for(let i=0;i<5;i++){ const b=mesh('sph',[rand(0.09,0.16),6,5], emat(i%2?W3PAL.brewV:W3PAL.brew,W3PAL.brew,0.9)); b.position.set(rand(-0.55,0.55),1.55+rand(0,0.35),rand(-0.55,0.55)); this.bubbles.push(b); this.pot.add(b); }
    // the cursed red gem bobbing on the surface — temptation, visible from across the clearing
    this.gem = mesh('sph',[0.14,8,7], emat(0xff2040,0xff2040,1)); this.gem.position.set(0,1.6,0.7);
    this.pot.add(belly, lip, handL, handR, this.brew, this.gem);
    this.glow = new THREE.PointLight(0x40e6a0, 22, 8); this.glow.position.set(0,1.9,0);   // hero cauldron earns one real light
    this.group.add(slab, this.pot, this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🫧 Dip into the bubbling cauldron...?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      this.gem.scale.setScalar(1+Math.sin(this.t*3)*0.25);
      this.glow.intensity = 16+Math.sin(this.t*2.4)*10;
      this.brew.material.emissiveIntensity = 0.85+Math.sin(this.t*4)*0.15;
      this.bubbles.forEach((b,i)=>{ b.position.y = 1.55 + ((this.t*0.7+i*0.3)%0.4); b.scale.setScalar(0.6+Math.sin(this.t*5+i)*0.4); });
      this.pot.position.y = Math.sin(this.t*2.2)*0.02;   // a restless simmer
    } else {
      this.glow.intensity = damp(this.glow.intensity, 0, 2, dt);
      this.brew.material.emissiveIntensity = damp(this.brew.material.emissiveIntensity, 0.2, 3, dt);
    }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    AUDIO.tone({f:170,f2:60,type:'sawtooth',t:0.7,vol:0.22});
    AUDIO.noise({t:0.5,vol:0.18,fFrom:1300,fTo:180});   // a thick glugging bubble-burst
    G.camc.shake(0.2,0.4);
    const scene = G.scene;   // payout must land in THE SAME scene — a switchArea inside the 650ms window would spawn into the new area
    setTimeout(()=>{
      if(G.scene !== scene) return;
      const r = Math.random();
      if(r < 0.08){
        // GHOSTLY 1-UP — the rarest prize
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1);
        G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.2,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.7,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart(); AUDIO.ghostGiggle();
        UI.updateHUD();
        UI.toast('🫧👻 A GHOSTLY 1-UP bubbled up from the brew! Lives: '+G.save.lives);
      } else if(r < 0.32){
        // JACKPOT — candy fountain + a heart + a random POWER-UP
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.2,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.0, 0));
        G.ents.add(new PowerUp(p.x+1.2, p.y+1.7, p.z, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.5,p.z), PAL.gold, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin();
        UI.toast('🫧✨ JACKPOT! The witch\'s good brew: candy, a heart, AND a treasure!');
      } else if(r < 0.7){
        // modest treats
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.2,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.5,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy(0);
        UI.toast('🫧 A few candied newts... and a mouthful of pondwater.');
      } else {
        // AMBUSH — a WIDOWMITE SWARM skitters out of the pot!
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.5,p.z), 0xb06bff, 22, {speed:4.5});
        AUDIO.bossRoar();
        G.camc.shake(0.4,0.45);
        _cauldronAmbush(G, p);
        UI.toast('🫧🕷️ WIDOWMITES!! The whole brood was NESTING in the brew!!');
      }
    }, 650);
  }
}
// Ambush helper — spawns the Widowmite swarm on the CLEAR-PATCH scatter ring with a 1s harmless grace.
// Falls back to Spider if the D3 roster (Widowmite) hasn't concatenated yet (keeps the kit standalone-safe).
function _cauldronAmbush(G, p){
  const offs = [-2.6, -1.4, 1.4, 2.6];   // fixed scatter ring — never on the player, tight enough for the pocket
  const Mite = (typeof Widowmite!=='undefined') ? Widowmite : Spider;
  for(let i=0;i<offs.length;i++){
    const bx = p.x+offs[i];
    // spawn ON THE LANE (z=0) — the player is z-locked to 0 in side mode and Widowmite patrols only
    // its spawn axis (never migrates in z), so an off-lane spawn could never touch the player.
    const m = new Mite(G, bx, 0.35, 0, {groundY:0});
    if(m.thread){ m.thread.visible=false; }     // Spider-fallback: skip the drop-in thread
    if('state' in m) m.state = 'chase';
    m.group.position.set(bx, 0.35, 0);
    m.spawnGrace = 1.0;                          // a breath to react before they can bite (the gamble is never a cheap hit)
    G.ents.add(m);
  }
}

// =============================== 5) CAULDRON DIP — the repeatable brew-buff vessel ===============================
// A small bubbling cauldron the player JUMPS INTO. On touch it grants a RANDOM short timed brew-buff by
// reusing the existing power-up grants (Gummy Shield / Moon Drop / Bat Wings / Salt Shaker), then goes
// dormant for a few seconds and RE-ARMS — a repeatable-per-placement power vessel (a bonk lantern, but a
// cauldron). The brew is picked from a fixed cycle whose START index is seeded per placement (switchArea
// seeds rand()), so a dip is fully DETERMINISTIC / replayable. Add via G.ents.add(new CauldronDip(...)).
class CauldronDip {
  constructor(x, y, z, opts={}){
    this.group = new THREE.Group();
    const iron=mat(W3PAL.cauldron), rim=mat(W3PAL.cauldronR);
    for(let i=0;i<3;i++){ const a=i/3*TAU; const leg=mesh('cyl',[0.05,0.06,0.5,4], iron); leg.position.set(Math.cos(a)*0.34,0.28,Math.sin(a)*0.34); leg.rotation.z=Math.cos(a)*0.24; leg.rotation.x=-Math.sin(a)*0.24; this.group.add(leg); }
    const belly = mesh('sph',[0.62,12,10], iron); belly.position.y=0.78; belly.scale.set(1,0.9,1);
    const lip = mesh('cyl',[0.58,0.64,0.14,12], rim); lip.position.y=1.16;
    this.brew = mesh('cyl',[0.52,0.52,0.08,12], emat(W3PAL.brew,W3PAL.brew,0.95).clone()); this.brew.position.y=1.18;   // own instance (see MysteryCauldron note): emissiveIntensity is animated per-vessel
    this.bubbles=[];
    for(let i=0;i<3;i++){ const b=mesh('sph',[rand(0.06,0.11),6,5], emat(W3PAL.brew,W3PAL.brew,0.9)); b.position.set(rand(-0.3,0.3),1.2+rand(0,0.2),rand(-0.3,0.3)); this.bubbles.push(b); this.group.add(b); }
    this.group.add(belly, lip, this.brew);
    // optional real light for a hero placement — otherwise emissive-only to respect the ≤6 budget
    this.light = opts.light ? new THREE.PointLight(0x40e6a0, 18, 7) : null;
    if(this.light){ this.light.position.y=1.5; this.group.add(this.light); }
    this.group.position.set(x, y===undefined?0:y, z);
    // fixed brew cycle; START index seeded per placement (deterministic under the seeded RNG)
    this.cycle = opts.cycle || ['shield','moon','bat','salt'];
    this.ci = Math.floor(rand()*this.cycle.length);
    this.r = opts.r || 1.5;                 // dip radius (player jumps in)
    this.cool = opts.cool || 6;             // seconds dormant after a dip before it re-arms
    this.armed = true; this.cd = 0;
    this.dead = false; this.t = rand(0,9); this.cull = false;
  }
  update(dt, G){
    this.t += dt;
    // brew simmer + bubbles
    this.bubbles.forEach((b,i)=>{ b.position.y = 1.2 + ((this.t*0.8+i*0.3)%0.28); b.scale.setScalar(0.6+Math.sin(this.t*6+i)*0.4); });
    if(this.armed){
      this.brew.material.emissiveIntensity = 0.85+Math.sin(this.t*5)*0.15;
      if(this.light) this.light.intensity = 15+Math.sin(this.t*4)*4;
      this.brew.scale.setScalar(1+Math.sin(this.t*3)*0.03);
    } else {
      this.cd -= dt;
      this.brew.material.emissiveIntensity = 0.14;    // dim while spent
      if(this.light) this.light.intensity = damp(this.light.intensity, 2, 3, dt);
      if(this.cd<=0){ this.armed=true; G.fx.spawn(new THREE.Vector3(this.group.position.x,this.group.position.y+1.3,this.group.position.z), W3PAL.brew, 8, {speed:1.6, gravity:1}); }
    }
    const pl = G.player;
    if(this.armed && pl && !pl.dead){
      const p=this.group.position;
      if(Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) < this.r && pl.pos.y < p.y+1.7 && pl.pos.y > p.y-0.5){
        this._dip(G, pl);
      }
    }
  }
  _dip(G, pl){
    this.armed = false; this.cd = this.cool;
    const p = this.group.position;
    const brew = this.cycle[this.ci % this.cycle.length]; this.ci++;
    // splash fanfare
    G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), W3PAL.brew, 20, {speed:3.5, life:0.7, gravity:5, size:0.6});
    G.camc.shake(0.1,0.2);
    AUDIO.goldPumpkin();
    AUDIO.noise({t:0.25,vol:0.14,fFrom:1400,fTo:300});
    if(brew==='shield'){ pl.gainShield(); UI.toast('🫧🛡️ BUBBLE BREW! A gummy shield: absorbs one hit.'); }
    else if(brew==='bat'){ pl.gainBat(); UI.toast('🫧🦇 SWOOP BREW! Bat Wings: jump again in the air to flutter!'); AUDIO.ghostGiggle(); }
    else if(brew==='salt'){ pl.armWeapon('salt'); UI.toast('🫧🧂 SOUR BREW! Salt Shaker armed: SPIN to fling it!'); }
    else { pl.moonT = 10; UI.toast('🫧🌙 MOON BREW! Unstoppable for 10 seconds!'); }
  }
}

// =============================== 6) LEVEL REGISTRY ===============================
// D3 level files self-register into W3_LEVELS: {id:'w3l1', district:'w3', name, build, update, parTime}.
const W3_LEVELS = [];
LEVEL_LISTS.push(W3_LEVELS);   // findLevel() now resolves w3 levels once files register

// =============================== 7) THEMED CLUTTER (own copy — 00_utils.buildClutter can't be edited here) ===============================
// w3Clutter(G, x1, x2, theme): baked forest-floor clutter. theme 'forest' (roots, ferns, toadstools,
// twig-bones, pale web wisps, potion pebbles). Split the span around any pit so nothing floats over a void.
function w3Clutter(G, x1, x2, theme='forest'){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.24){ // gnarled root hump
      const root=mesh('tor',[rand(0.12,0.22),0.05,4,8, Math.PI], mat(W3PAL.barkD)); root.rotation.x=Math.PI/2; root.position.set(x,0.05,z); crook(root,0.2); g.add(root);
    } else if(r<0.46){ // fern / grass tuft
      const tuft=mesh('cone',[0.09,rand(0.25,0.5),4], mat(pick([W3PAL.canopy,W3PAL.canopyL]))); tuft.position.set(x,0.2,z); crook(tuft,0.28); g.add(tuft);
    } else if(r<0.64){ // little red toadstool
      const stem=mesh('cyl',[0.04,0.05,0.14,5], mat(0xe7ded0)); stem.position.set(x,0.07,z); const cap=mesh('sph',[0.12,7,6], mat(W3PAL.cap)); cap.position.set(x,0.16,z); cap.scale.set(1.2,0.7,1.2); g.add(stem,cap);
    } else if(r<0.8){ // twig / bone
      const bone=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.05,z); g.add(bone);
    } else if(r<0.92){ // pale web wisp on the ground
      const wm=mat(W3PAL.web); for(let s=0;s<3;s++){ const st=mesh('cyl',[0.012,0.012,rand(0.3,0.5),4], wm); st.rotation.z=Math.PI/2; st.rotation.y=rand(TAU); st.position.set(x+rand(-0.15,0.15),0.04,z+rand(-0.15,0.15)); g.add(st); }
    } else { // potion pebble (faint glow)
      const cc=pick([W3PAL.potion,W3PAL.potionV]); const pb=mesh('sph',[rand(0.07,0.12),5,4], emat(cc,cc,0.5)); pb.position.set(x,0.06,z); pb.scale.y=0.6; g.add(pb);
    }
  }
  G.scene.add(bakeGroup(g));
}

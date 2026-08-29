// ============ D4 KIT — Ghost Harbor building blocks (dried seabed + the haunted galleon Salty Phantom) ============
// Sorts after 09_levelkit.js + the D2/D3 kits and levels (09za... > 09z_w3l5) and before the D4 level files
// (09za < 09zb...). REUSES 09_levelkit's levelBegin/exitGate/updateLevelCommon, 00_utils builders, and D2's
// w2BellRope (a rope is a rope — the ship rigging swings the same). All static deco is BAKED (bakeGroup, one
// draw call); tide-pool water / lantern / gold glows are EMISSIVE fakes so the ≤6 real-PointLight budget stays
// free. Determinism: cosmetic scatter uses rand() (seeded per area — identical every replay); the tide clock,
// cannon aim clock, rolling-hazard clocks and TreasureChest scatter ring are all fixed from level start.
//
// ONE CONTRACT D4 LEVEL FILES HONOUR: call w4LevelFinish(G, x1, x2, clutterTheme) as the build tail INSTEAD of
// 09_levelkit's levelFinish (whose ambience paints the orange Pumpkin-Patch skyline). w4LevelFinish sets
// G.checkpoint / G.bats / G.amb the same way, with Ghost Harbor's salt-mist-and-brine backdrop.

// ---- Ghost Harbor palette: bleached driftwood, cracked teal-grey seabed, barnacle green, ghost-lantern green ----
const W4PAL = {
  wood:     0x8a7a5c,  woodD:    0x5f5138,  woodL:    0xa89772,   // bleached driftwood / dock timber
  hull:     0x4a4038,  hullD:    0x2f2822,  hullL:    0x685a4c,   // dark wreck hull planking
  seabed:   0x33484a,  seabedD:  0x22333a,  seabedL:  0x466062,   // cracked teal-grey dry seabed
  hillNear: 0x2a3e40,  hillFar:  0x1a2a2e,                        // dry dune-seabed hills
  water:    0x3fd6c8,  waterD:   0x27a89e,  waterP:   0x8ffff0,   // glowing tide-pool water (teal)
  coral:    0x9d6a86,  coralD:   0x6a4058,  coralP:   0xd98fb0,   // dead-coral mauve
  barnacle: 0x6a8a5a,  barnacleD:0x47613b,                        // barnacle green
  rope:     0xb8a072,  ropeD:    0x8a744c,                        // hemp rope / rigging
  brass:    0x8a7b3a,  verdigris:0x4a9a80,                        // brass / verdigris fittings
  lantern:  0x9fffca,  lanternU: 0x2a5a4a,                        // ghost-lantern green (lit / unlit)
  sail:     0x4a5a5c,  sailD:    0x333f42,                        // tattered ghost-sail
  gold:     0xffcf5e,                                             // treasure gold-light
};

// =============================== 1) BACKDROPS + AMBIENCE ===============================
// w4Parallax(S, x1, x2): baked three-depth harbor skyline — near dead-coral & wreck-rib silhouettes, a mid
// stranded-hull / dock-crane row with the SALTY PHANTOM galleon looming + a lighthouse, far dry-dune hills
// under a low teal moon; plus a floating brine-glow band so the district reads as a dried haunted harbor instantly.
function w4Parallax(S, x1, x2){
  // NEAR — jagged dead-coral fans + broken wreck ribs poking out of the seabed
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(5,9)){
    if(rand()<0.5){ // coral fan
      const cc = rand()<0.5?W4PAL.coralD:0x4a3040;
      for(let b=0;b<4;b++){ const arm=mesh('cyl',[0.1,0.16,rand(2,3.5),5], mat(cc)); arm.position.set(x+rand(-0.4,0.4), rand(0.5,1.4), -12.5); arm.rotation.z=rand(-0.6,0.6); crook(arm,0.2); near.add(arm); }
    } else { // wreck rib
      const rib=mesh('tor',[rand(1.4,2.4),0.12,4,10, Math.PI], mat(W4PAL.hullD)); rib.position.set(x, -0.4, -12.8); rib.rotation.z=rand(-0.3,0.3); near.add(rib);
    }
  }
  S.add(bakeGroup(near));
  // MID — a stranded-hull / dock skyline, a lighthouse, and the Salty Phantom galleon looming
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(12,20)){
    const bw=rand(3,5), bh=rand(2.4,4);
    const hull = mesh('box',[bw,bh,1.4], mat(0x1e2a2c)); hull.position.set(x,bh/2,-19); hull.rotation.z=rand(-0.12,0.12); mid.add(hull);
    if(rand()<0.5){ const mast=mesh('cyl',[0.12,0.16,rand(2.5,4),5], mat(0x18201f)); mast.position.set(x+rand(-1,1), bh+1.4, -19); mid.add(mast); }
  }
  // the galleon silhouette (a big tilted hull with three masts + tattered sails) somewhere mid-span
  { const gx = (x1+x2)/2 + 8; const g = galleonSilhouette(gx, -19.5, 1.5); mid.add(g); }
  // a lighthouse near the start
  { const lx = x1 - 4; const tower=mesh('cyl',[1.1,1.5,7,10], mat(0x232f30)); tower.position.set(lx,3.5,-20); mid.add(tower);
    const cap=mesh('cyl',[1.4,1.1,1.2,10], mat(0x1a2424)); cap.position.set(lx,7.3,-20); mid.add(cap);
    const lamp=mesh('sph',[0.7,8,7], emat(W4PAL.lantern,W4PAL.lantern,0.8)); lamp.position.set(lx,7.3,-19.6); mid.add(lamp); }
  S.add(bakeGroup(mid));
  // FAR — soft dry-dune seabed hills receding into brine fog
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(11,17)){
    const h=mesh('sph',[rand(9,15),8,6], mat(W4PAL.hillFar)); h.position.set(x, rand(-4,-1), -28); h.scale.set(1,rand(0.5,0.75),0.6); far.add(h);
  }
  S.add(bakeGroup(far));
  // BRINE-GLOW MIDGROUND — a scatter of emissive teal motes hanging in the fog (baked emissive fakes)
  const glow = new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/6);i++){
    const cc = pick([W4PAL.water, W4PAL.waterP, W4PAL.lantern]);
    const g = mesh('sph',[rand(0.12,0.24),6,5], emat(cc,cc,0.9));
    g.position.set(rand(x1,x2), rand(1.5,6), rand(-9,-4)); glow.add(g);
  }
  S.add(bakeGroup(glow));
}

// galleonSilhouette(x,z,s): the looming Salty Phantom for the parallax — a big listing hull, three masts,
// tattered sails, a green stern-lantern. Deco only (returned as a group for the caller to bake).
function galleonSilhouette(x, z, s=1){
  const g = new THREE.Group();
  const hull=mat(0x141c1e);
  const body = mesh('box',[7*s,2.6*s,1.6], hull); body.position.set(x,1.6*s,z); body.rotation.z=0.12; g.add(body);
  const prow = mesh('cone',[1.0*s,2.2*s,4], hull); prow.rotation.z=-Math.PI/2+0.12; prow.position.set(x+3.8*s,2.0*s,z); g.add(prow);
  for(let m=-1;m<=1;m++){
    const mast=mesh('cyl',[0.14*s,0.18*s,4.6*s,6], hull); mast.position.set(x+m*2.2*s, 4.4*s, z); mast.rotation.z=0.12; g.add(mast);
    const sail=mesh('box',[1.5*s,1.8*s,0.05], mat(W4PAL.sailD)); sail.position.set(x+m*2.2*s+0.3, 4.2*s, z+0.2); sail.rotation.z=0.12; g.add(sail);
  }
  const lantern=mesh('sph',[0.34*s,8,7], emat(W4PAL.lantern,W4PAL.lantern,0.9)); lantern.position.set(x-3.4*s, 2.8*s, z+0.3); g.add(lantern);
  return g;
}

// w4Ambience(S, x1, x2): drifting salt-mist + sea-foam motes (the "leaves" channel), brine sparks (the
// "flies" channel) and low fog banks rolling over the seabed (the "clouds" channel) — returned in the exact
// shape 09_levelkit's updateAmbience already animates ({flies, leaves, clouds, x1, x2}).
function w4Ambience(S, x1, x2){
  const leaves = [];
  for(let i=0;i<16;i++){
    const cc = pick([0xdfe8e6, W4PAL.waterP, 0xcfe0da, W4PAL.lantern]);   // pale salt-mist + foam + a few brine glints
    const lf = new THREE.Mesh(geo('circ',0.13,6), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0.55, side:THREE.DoubleSide, depthWrite:false}));
    lf.userData = {x0:rand(x1,x2), y0:rand(3,9), sp:rand(0.35,0.9), ph:rand(9), sw:rand(0.8,1.8)};
    S.add(lf); leaves.push(lf);
  }
  const fg = new THREE.BufferGeometry(); const fp=[];
  for(let i=0;i<40;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:W4PAL.waterP, size:0.13, transparent:true, opacity:0.8}));
  S.add(flies);
  const clouds = [];
  for(let i=0;i<5;i++){
    const cl = new THREE.Mesh(geo('sph',rand(6,9),8,6), new THREE.MeshBasicMaterial({color:0x2a3a3c, transparent:true, opacity:0.4}));
    cl.scale.set(2.1,0.22,0.6);
    cl.userData = {y:rand(0.4,1.4), sp:rand(0.25,0.6), x:rand(x1-20,x2+20)};
    cl.position.set(cl.userData.x, cl.userData.y, -3.5);
    S.add(cl); clouds.push(cl);
  }
  return {flies, leaves, clouds, x1, x2};
}

// w4LevelFinish(G, x1, x2, clutterTheme): the D4 build tail — drop-in for 09_levelkit.levelFinish.
function w4LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 6, 34);   // wheeling gulls/bats over the harbor
  G.amb  = w4Ambience(G.scene, x1, x2);
  if(clutterTheme) w4Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) DECO BUILDERS (baked by caller) ===============================
// shipwreckRib(x,z,s): a beached wreck-hull section — curved ribs + planking, half-buried in the seabed.
function shipwreckRib(x, z, s=1){
  const g = new THREE.Group();
  const hull=mat(W4PAL.hull), hullD=mat(W4PAL.hullD);
  for(let i=0;i<5;i++){ const rib=mesh('tor',[1.2*s+i*0.12*s,0.09*s,4,10, Math.PI], i%2?hullD:hull); rib.position.set(x-1+i*0.5*s, 0, z); rib.rotation.z=rand(-0.1,0.1); g.add(rib); }
  for(let p=0;p<3;p++){ const plank=mesh('box',[2.6*s,0.14*s,0.3*s], hullD); plank.position.set(x, 0.4*s+p*0.5*s, z-0.6*s); plank.rotation.z=rand(-0.08,0.08); g.add(plank); }
  // a barnacle crust
  for(let b=0;b<5;b++){ const bar=mesh('sph',[rand(0.08,0.14)*s,6,5], mat(W4PAL.barnacle)); bar.position.set(x+rand(-1.2,1.2)*s, rand(0.2,1)*s, z+0.1); g.add(bar); }
  return g;
}

// deadCoral(x,z,s): a mauve dead-coral fan — Ghost Harbor's ground jewel.
function deadCoral(x, z, s=1){
  const g = new THREE.Group();
  const n=3+Math.floor(rand(0,3));
  for(let i=0;i<n;i++){
    const cc = i%2?mat(W4PAL.coral):mat(W4PAL.coralD);
    const arm=mesh('cyl',[0.05*s,0.09*s,rand(0.4,0.9)*s,5], cc); arm.position.set(x+rand(-0.3,0.3)*s, rand(0.2,0.4)*s, z+rand(-0.2,0.2)*s); arm.rotation.z=rand(-0.7,0.7); crook(arm,0.25); g.add(arm);
    // little branch tips
    for(let t=0;t<2;t++){ const tip=mesh('sph',[0.06*s,5,4], mat(W4PAL.coralP)); tip.position.set(x+rand(-0.4,0.4)*s, rand(0.5,0.9)*s, z); g.add(tip); }
  }
  return g;
}

// tidePoolDeco(x,z,s): a glowing teal tide-pool puddle set into the dry seabed (emissive water disc + rim).
function tidePoolDeco(x, z, s=1){
  const g = new THREE.Group();
  const pool = new THREE.Mesh(geo('circ',0.9*s,16), new THREE.MeshBasicMaterial({color:W4PAL.water, transparent:true, opacity:0.7, depthWrite:false}));
  pool.rotation.x=-Math.PI/2; pool.position.set(x,0.03,z); g.add(pool);
  const rim=mesh('tor',[0.9*s,0.08*s,5,16], mat(W4PAL.seabedL)); rim.rotation.x=Math.PI/2; rim.position.set(x,0.03,z); g.add(rim);
  for(let i=0;i<3;i++){ const gl=mesh('sph',[0.05*s,5,4], emat(W4PAL.waterP,W4PAL.waterP,0.9)); gl.position.set(x+rand(-0.5,0.5)*s,0.08,z+rand(-0.5,0.5)*s); g.add(gl); }
  return g;
}

// crate(x,y,z,s): a lashed dock crate (a standable prop when the caller adds a collider under it).
function crate(x, y, z, s=1){
  const g = new THREE.Group();
  const box=mesh('box',[0.95*s,0.95*s,0.95*s], mat(W4PAL.wood)); box.position.set(x,y+0.475*s,z); g.add(box);
  const frameM=mat(W4PAL.woodD);
  for(const e of [[-0.48,0],[0.48,0],[0,-0.48],[0,0.48]]){ const b=mesh('box',[e[0]?0.06*s:0.99*s,0.99*s,e[1]?0.06*s:0.99*s], frameM); b.position.set(x+e[0]*s,y+0.475*s,z+e[1]*s); g.add(b); }
  return g;
}

// dockCrane(x,z,s): a rusted harbor crane silhouette with a dangling hook (deco).
function dockCrane(x, z, s=1){
  const g = new THREE.Group();
  const steel=mat(0x3a4648);
  const post=mesh('box',[0.3*s,4.5*s,0.3*s], steel); post.position.set(x,2.25*s,z); g.add(post);
  const arm=mesh('box',[3.2*s,0.28*s,0.28*s], steel); arm.position.set(x+1.2*s,4.4*s,z); arm.rotation.z=-0.12; g.add(arm);
  const cable=mesh('cyl',[0.03*s,0.03*s,1.8*s,4], mat(W4PAL.ropeD)); cable.position.set(x+2.6*s,3.5*s,z); g.add(cable);
  const hook=mesh('tor',[0.14*s,0.05*s,4,8, Math.PI], mat(W4PAL.brass)); hook.position.set(x+2.6*s,2.5*s,z); g.add(hook);
  return g;
}

// =============================== 3) TIDE PLATFORMS (D4 signature — the dry-tide rhythm) ===============================
// tidePlat(G, x, baseY, opts): a barnacled slab on the SHARED tide clock — rises above / sinks below the lane on a
// fixed sine (deterministic from level start; set amp/phase/freq per slab so a row makes a walkable rhythm). Returns
// the mover. Falling off when a slab is low costs a heart. Standable top = the mover's collider top.
function tidePlat(G, x, baseY, opts={}){
  const amp = opts.amp!==undefined?opts.amp:1.6, freq = opts.freq||1.2, phase = opts.phase||0;
  const w = opts.w||2.2, d = opts.d||3;
  const slab = ()=>{
    const grp = new THREE.Group();
    const top = mesh('box',[w,0.5,d], mat(W4PAL.seabed)); top.position.y=0.25; grp.add(top);
    const lip = mesh('box',[w+0.12,0.12,d+0.12], emat(W4PAL.barnacle,W4PAL.barnacle,0.3)); lip.position.y=0.5; grp.add(lip);
    for(let b=0;b<4;b++){ const bar=mesh('sph',[rand(0.06,0.1),5,4], mat(W4PAL.barnacleD)); bar.position.set(rand(-w*0.4,w*0.4),0.5,rand(-d*0.3,d*0.3)); grp.add(bar); }
    // a teal water sheen dripping off the top
    const sheen = mesh('box',[w*0.9,0.05,d*0.9], emat(W4PAL.water,W4PAL.water,0.5)); sheen.position.y=0.52; grp.add(sheen);
    G.scene.add(grp); return grp;
  };
  return G.world.addMover(w, 0.5, d, t=>new THREE.Vector3(x, baseY + Math.sin(t*freq + phase)*amp, 0), slab);
}

// =============================== 4) CANNON-LAUNCH (D4 boarding mechanic — DKC barrel) ===============================
// CannonBarrel: walk in → the barrel CAPTURES you (input locked via pl.captured; the barrel holds your position and
// shows a dotted AIM ARC previewing the launch) → press JUMP to fire along the current aim. The aim sweeps on a FIXED
// sine so the fire window is learnable/speedrunnable. Add via G.ents.add(new CannonBarrel(x,y,z,opts)).
class CannonBarrel {
  constructor(x, y, z, opts={}){
    this.group = new THREE.Group();
    const brass=mat(W4PAL.brass), verd=mat(W4PAL.verdigris), wood=mat(W4PAL.woodD);
    const base = mesh('cyl',[0.7,0.8,0.7,12], wood); base.position.y=0.35; this.group.add(base);
    for(const by of [0.2,0.55]){ const band=mesh('cyl',[0.72,0.72,0.08,12], verd); band.position.y=by; this.group.add(band); }
    // the barrel muzzle (rotates to show aim) — its own pivot group
    this.barrel = new THREE.Group();
    const tube = mesh('cyl',[0.34,0.4,1.4,12], brass); tube.position.y=0.7; this.barrel.add(tube);
    const rim = mesh('cyl',[0.42,0.42,0.14,12], verd); rim.position.y=1.35; this.barrel.add(rim);
    this.barrel.position.y=0.7; this.group.add(this.barrel);
    this.group.position.set(x,y,z);
    // aim-arc preview dots (emissive; toggled on while captured)
    this.dots=[]; for(let i=0;i<7;i++){ const d=mesh('sph',[0.09,6,5], emat(W4PAL.gold,W4PAL.gold,1)); d.visible=false; this.group.add(d); this.dots.push(d); }
    this.face = opts.dir||1;
    this.aimMin = opts.aimMin!==undefined?opts.aimMin:0.5;   // radians from horizontal
    this.aimMax = opts.aimMax!==undefined?opts.aimMax:1.15;
    this.aimPeriod = opts.aimPeriod||1.8;
    this.power = opts.power||16;
    this.r = opts.r||1.1; this.oneShot=!!opts.oneShot;
    this.captured=false; this.spent=false; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this._fireCool=0;   // brief post-fire immunity so a just-launched player clears the capture radius (never re-grabbed)
    this.aim=this.aimMin;
  }
  update(dt, G){
    this.t += dt;
    if(this._fireCool>0) this._fireCool -= dt;
    const pl = G.player, p = this.group.position;
    // aim sweep (fixed clock)
    const u = 0.5 + 0.5*Math.sin(this.t*(TAU/this.aimPeriod));
    this.aim = this.aimMin + (this.aimMax-this.aimMin)*u;
    this.barrel.rotation.z = this.face>0 ? -(Math.PI/2 - this.aim) : (Math.PI/2 - this.aim);
    // capture on touch (never re-grab a player who JUST fired — ents.update runs after player.update, so the
    // launched player is still inside the capture radius for a frame or two)
    if(!this.captured && !this.spent && this._fireCool<=0 && pl && !pl.dead && !pl.captured){
      if(Math.hypot(pl.pos.x-p.x, pl.pos.z-p.z) < this.r && Math.abs(pl.pos.y-p.y) < 1.8){
        this.captured = true; pl.captured = true; pl.vel.set(0,0,0);
        AUDIO.tone && AUDIO.tone({f:220,f2:330,type:'square',t:0.12,vol:0.12});
        if(window.UI) UI.toast('💣 In the cannon! Time your JUMP — you fire where it points.');
      }
    }
    if(this.captured){
      if(!pl || pl.dead){ this.captured=false; if(pl) pl.captured=false; this.dots.forEach(d=>d.visible=false); return; }   // released on death — never freeze the next life
      pl.pos.set(p.x, p.y+0.7, 0); pl.group.position.copy(pl.pos); pl.vel.set(0,0,0);
      // draw the aim arc (preview the parabola under the player's rising gravity ~24)
      const vx=Math.cos(this.aim)*this.power*this.face, vy=Math.sin(this.aim)*this.power, g=24;
      for(let i=0;i<this.dots.length;i++){
        const tt=(i+1)*0.11; this.dots[i].visible=true;
        this.dots[i].position.set((p.x + vx*tt) - p.x, (p.y+0.7 + vy*tt - 0.5*g*tt*tt) - p.y, 0);
        this.dots[i].scale.setScalar(1 - i*0.09);
      }
      if(INPUT.jumpEdge){
        INPUT.jumpEdge = false; this.captured=false; pl.captured=false; this._fireCool=0.5;
        // _springAir=true + jumpT=0 exempt the launch from the variable-jump cut (06_player.js:~433), so a
        // TAP fires the full arc — otherwise releasing jump instantly clamps vy to 6.5 and drops you short.
        pl.vel.set(vx, vy, 0); pl.grounded=false; pl.canDouble=true; pl.pounding=false; pl._springAir=true; pl.jumpT=0; pl.launchT=0.8;
        this.dots.forEach(d=>d.visible=false);
        if(this.oneShot) this.spent=true;
        AUDIO.jump && AUDIO.jump(); AUDIO.noise && AUDIO.noise({t:0.2,vol:0.2,fFrom:700,fTo:200}); G.camc.shake(0.35,0.3);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+0.9,0), W4PAL.gold, 16, {speed:4, life:0.5});
      }
    } else { this.dots.forEach(d=>d.visible=false); }
  }
}

// =============================== 5) LISTING DECK (visual roll) ===============================
// deckList(G, group, opts): tilts a DECK GROUP ±amp radians on a fixed sine for the LOOK of a rolling ship (the felt
// danger is the rolling-cannonball hazards a level adds on a fixed clock; AABB colliders can't rotate, so the tilt is
// cosmetic). The group MUST be built around its own local pivot (children positioned relative to the group origin,
// group placed via .position) so rotation.z tilts it IN PLACE rather than flinging it about the world origin.
function deckList(G, group, opts={}){
  const amp = opts.amp!==undefined?opts.amp:0.13, period = opts.period||4.5, ph = opts.phase||0;
  const ticker = { dead:false, cull:false, isEnemy:false, t:rand(0,2), group:new THREE.Group(),
    update(dt){ this.t+=dt; group.rotation.z = Math.sin(this.t*(TAU/period)+ph)*amp; } };
  G.ents.add(ticker);
  return ticker;
}

// rollingBall(G, x1, x2, y, opts): a cannonball that rolls x1→x2 along the deck on a fixed clock, respawning at x1 —
// the deck's felt hazard. A hazard entity (touchDamage, cull:false, never a kill). Stomp/spin does nothing (it's iron);
// you JUMP it. Deterministic (x is a pure fn of the clock + phase).
class RollingBall {
  constructor(G, x1, x2, y, opts={}){
    this.G=G; this.x1=x1; this.x2=x2; this.y=y; this.speed=opts.speed||5; this.phase=opts.phase||0;
    this.r=opts.r||0.4; this.dead=false; this.cull=false; this.isEnemy=false;
    this.group=new THREE.Group();
    this.ball=mesh('sph',[this.r,12,10], emat(0x2a2622,0x141210,0.3)); this.ball.position.y=this.r; this.group.add(this.ball);
    this.shadow=blobShadow(this.r*1.1); G.scene.add(this.shadow);
    G.scene.add(this.group);
    this.span=x2-x1; this.t=this.phase;
  }
  update(dt, G){
    this.t+=dt;
    const travel=((this.t*this.speed)%this.span);
    const p=this.group.position; p.x=this.x1+travel; p.y=this.y;
    this.ball.rotation.z -= (this.speed/this.r)*dt;
    const gh=G.world.groundHeight(p.x,0,p.y+0.3); if(gh>-Infinity){ this.shadow.visible=true; this.shadow.position.set(p.x,gh+0.02,0); } else this.shadow.visible=false;
    const pl=G.player;
    if(pl && !pl.dead && Math.abs(pl.pos.x-p.x)<this.r+0.35 && Math.abs(pl.pos.z)<1 && pl.pos.y < p.y+this.r*2-0.15 && pl.pos.y+pl.height>p.y){
      pl.damage(1, new THREE.Vector3(p.x,p.y,0));
    }
  }
}

// =============================== 6) TREASURE CHEST — the D4 gamble container ===============================
// Ghost Harbor's CursedCoffin/RestlessUrn/MysteryCauldron equivalent: SAME gamble table (8% 1-UP / 24% jackpot /
// 38% treats / 30% ambush), SAME CLEAR-PATCH LAW + 1s spawnGrace — but the ambush is BOO BUCCANEERS bursting out of
// the chest. Integrates like CursedCoffin: has .opened / .group.position / .open(G) / .promptLabel; a level pushes it
// to G.coffins AND G.ents.add(...)s it, so updateLevelCommon renders the prompt + calls .open(G) on interact.
class TreasureChest {
  constructor(x, y, z, ry=0){
    this.group = new THREE.Group();
    const wood=mat(W4PAL.hull), woodD=mat(W4PAL.hullD), brass=mat(W4PAL.brass);
    const base = mesh('box',[1.3,0.7,0.9], wood); base.position.y=0.35; this.group.add(base);
    for(const bx of [-0.5,0.5]){ const strap=mesh('box',[0.1,0.72,0.92], brass); strap.position.set(bx,0.35,0); this.group.add(strap); }
    // the domed lid (its own group so it can rattle)
    this.lid = new THREE.Group();
    const dome = mesh('cyl',[0.45,0.45,1.3,10, 1, false, 0, Math.PI], wood); dome.rotation.z=Math.PI/2; dome.position.y=0.7; this.lid.add(dome);
    const lock = mesh('box',[0.2,0.24,0.1], brass); lock.position.set(0,0.62,0.46); this.lid.add(lock);
    this.group.add(this.lid);
    // barnacles + gold light leaking from the seams (emissive)
    for(let b=0;b<5;b++){ const bar=mesh('sph',[rand(0.05,0.09),5,4], mat(W4PAL.barnacle)); bar.position.set(rand(-0.6,0.6),rand(0.1,0.6),0.46); this.group.add(bar); }
    this.seam = mesh('box',[1.2,0.06,0.02], emat(W4PAL.gold,W4PAL.gold,1)); this.seam.position.set(0,0.68,0.47); this.group.add(this.seam);
    this.glow = new THREE.PointLight(W4PAL.gold, 16, 7); this.glow.position.set(0,0.9,0.3); this.group.add(this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🗝️ Pry open the barnacled chest...?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      const pulse = 0.7+Math.sin(this.t*3)*0.3;
      this.seam.material.emissiveIntensity = pulse;
      this.glow.intensity = 12+Math.sin(this.t*2.4)*8;
      this.lid.rotation.x = Math.sin(this.t*2.2)*0.015;   // a restless creak
    } else {
      this.glow.intensity = damp(this.glow.intensity, 0, 2, dt);
      this.seam.material.emissiveIntensity = damp(this.seam.material.emissiveIntensity, 0.15, 3, dt);
    }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    this.lid.rotation.x = -1.1;   // fling the lid open
    AUDIO.tone && AUDIO.tone({f:200,f2:90,type:'sawtooth',t:0.5,vol:0.2});
    AUDIO.noise && AUDIO.noise({t:0.3,vol:0.16,fFrom:1200,fTo:220});
    G.camc.shake(0.2,0.4);
    const scene = G.scene;   // payout must land in THE SAME scene — a switchArea inside the 650ms window would spawn into the new area
    setTimeout(()=>{
      if(G.scene !== scene) return;
      const r = Math.random();
      if(r < 0.08){
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1);
        G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD();
        window.UI && UI.toast('🗝️👻 A GHOSTLY 1-UP floated out of the hold! Lives: '+G.save.lives);
      } else if(r < 0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.0, 0));
        G.ents.add(new PowerUp(p.x+1.2, p.y+1.4, p.z, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), W4PAL.gold, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('🗝️✨ JACKPOT! A pirate\'s hoard — candy, a heart, AND a treasure!');
      } else if(r < 0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('🗝️ A few candies... and a lot of wet sand.');
      } else {
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), 0x8fd8c0, 22, {speed:4.5});
        AUDIO.bossRoar && AUDIO.bossRoar();
        G.camc.shake(0.4,0.45);
        _treasureAmbush(G, p);
        window.UI && UI.toast('🗝️🏴‍☠️ BOO BUCCANEERS!! The whole crew was hiding in the hold!!');
      }
    }, 650);
  }
}
// Ambush helper — Boo Buccaneers burst out on the CLEAR-PATCH scatter ring with a 1s harmless grace. Falls back to
// Boo if the D4 roster hasn't concatenated yet (keeps the kit standalone-safe). Spawns ON THE LANE (z=0).
function _treasureAmbush(G, p){
  const offs = [-2.6, -1.4, 1.4, 2.6];
  const Ghost = (typeof BooBuccaneer!=='undefined') ? BooBuccaneer : Boo;
  for(let i=0;i<offs.length;i++){
    const bx = p.x+offs[i];
    const m = new Ghost(G, bx, p.y+0.2, 0, {});
    m.group.position.set(bx, p.y+0.2, 0);
    m.spawnGrace = 1.0;
    G.ents.add(m);
  }
}

// =============================== 7) LEVEL REGISTRY ===============================
// D4 level files self-register into W4_LEVELS: {id:'w4l1', district:'w4', name, build, update, parTime}.
const W4_LEVELS = [];
LEVEL_LISTS.push(W4_LEVELS);   // findLevel() now resolves w4 levels once files register

// =============================== 8) THEMED CLUTTER ===============================
// w4Clutter(G, x1, x2, theme): baked seabed clutter. theme 'harbor' (dead coral, barnacle rocks, driftwood, rope
// coils, shells, bones, glowing brine pebbles). Split the span around any pit so nothing floats over a void.
function w4Clutter(G, x1, x2, theme='harbor'){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.2){ // dead-coral nub
      const cc=pick([W4PAL.coral,W4PAL.coralD]); const arm=mesh('cyl',[0.05,0.08,rand(0.25,0.5),5], mat(cc)); arm.position.set(x,0.18,z); arm.rotation.z=rand(-0.6,0.6); crook(arm,0.2); g.add(arm);
    } else if(r<0.4){ // barnacle rock
      const rock=mesh('sph',[rand(0.14,0.24),6,5], mat(W4PAL.seabedL)); rock.position.set(x,0.08,z); rock.scale.y=0.7; g.add(rock);
      if(rand()<0.6){ const bar=mesh('sph',[0.06,5,4], mat(W4PAL.barnacle)); bar.position.set(x+0.1,0.18,z); g.add(bar); }
    } else if(r<0.56){ // driftwood plank
      const pl=mesh('box',[rand(0.4,0.8),0.08,0.18], mat(W4PAL.woodD)); pl.rotation.y=rand(TAU); pl.position.set(x,0.05,z); g.add(pl);
    } else if(r<0.72){ // rope coil
      const rp=mesh('tor',[rand(0.14,0.2),0.04,4,10], mat(W4PAL.rope)); rp.rotation.x=Math.PI/2; rp.position.set(x,0.05,z); g.add(rp);
    } else if(r<0.86){ // spiral shell
      const sh=mesh('cone',[0.1,0.24,6], mat(pick([0xd8c8b0,W4PAL.coralP]))); sh.rotation.z=rand(-0.5,0.5); sh.position.set(x,0.12,z); g.add(sh);
    } else if(r<0.94){ // twig-bone (fish spine)
      const bone=mesh('cyl',[0.02,0.02,rand(0.25,0.4),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.04,z); g.add(bone);
    } else { // glowing brine pebble
      const cc=pick([W4PAL.water,W4PAL.waterP]); const pb=mesh('sph',[rand(0.06,0.1),5,4], emat(cc,cc,0.6)); pb.position.set(x,0.05,z); pb.scale.y=0.6; g.add(pb);
    }
  }
  G.scene.add(bakeGroup(g));
}

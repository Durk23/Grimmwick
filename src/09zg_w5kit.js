// ============ D5 KIT — Cursed Castle building blocks (Grimm's clockwork keep · the finale) ============
// Sorts after 09_levelkit + the D2/D3/D4 kits & levels (09zg... > 09zf_w4l5) and before the D5 level files
// (09zg < 09zh...). REUSES 09_levelkit's levelBegin/exitGate/updateLevelCommon, 00_utils builders, and D2's
// w2BellRope (a chain is a chain — clock chains climb the same). All static deco is BAKED (bakeGroup); gear/
// ember/shadow glows are EMISSIVE fakes so the ≤6 real-PointLight budget stays free. Determinism: cosmetic
// scatter uses rand() (seeded per area = identical replay); the gear/pendulum/warp clocks are fixed from level start.
//
// ONE CONTRACT D5 LEVELS HONOUR: call w5LevelFinish(G, x1, x2, clutterTheme) as the build tail INSTEAD of
// 09_levelkit's levelFinish. w5LevelFinish sets G.checkpoint / G.bats / G.amb with the castle's clock-soot backdrop.

// ---- Cursed Castle palette: gunmetal + verdigris brass, cold shadow-purple, clock-cream, ember-orange accent ----
const W5PAL = {
  stone:    0x3a3a46,  stoneD:   0x26262f,  stoneL:   0x50505e,   // castle masonry gunmetal
  brass:    0x9a8a4a,  brassD:   0x5a4f20,  verd:     0x4a8a72,   // brass / verdigris clockwork
  steel:    0x6a6f7a,  steelD:   0x40444d,  steelL:   0x8a8f9a,   // cog-tooth steel
  shadow:   0x2a2440,  shadowP:  0x6a3fbf,  shadowL:  0x3f3560,   // Grimm's shadow-purple
  cream:    0xe8e2d0,  creamD:   0xb8b2a0,                        // clock-face cream
  ember:    0xff8a3a,  emberL:   0xffca6a,                        // the stolen-ember warm accent
  hillNear: 0x241f30,  hillFar:  0x171322,                        // jagged mountain spires
  chain:    0x5a5a66,                                             // pendulum chain steel
};

// =============================== 1) BACKDROPS + AMBIENCE ===============================
function w5Parallax(S, x1, x2){
  // NEAR — broken cog-teeth + pendulum silhouettes poking up
  const near = new THREE.Group();
  for(let x=x1-28; x<x2+28; x+=rand(5,9)){
    if(rand()<0.5){ const cog=cogMesh(rand(1.2,2.2), 0x14121e); cog.position.set(x, rand(-0.5,1), -12.5); near.add(cog); }
    else { const pend=mesh('cyl',[0.06,0.08,rand(2.5,4),5], mat(0x14121e)); pend.position.set(x, rand(1,2.5), -12.8); pend.rotation.z=rand(-0.2,0.2); near.add(pend);
      const bob=mesh('sph',[0.4,8,7], mat(0x14121e)); bob.position.set(x, rand(-0.5,0.5), -12.8); near.add(bob); }
  }
  S.add(bakeGroup(near));
  // MID — castle-rampart / stopped-clock-tower skyline with Grimm's Keep + a giant cracked clock-face
  const mid = new THREE.Group();
  for(let x=x1-16; x<x2+16; x+=rand(11,18)){
    const bw=rand(3,5), bh=rand(3,5.5);
    const tower = mesh('box',[bw,bh,1.4], mat(0x1c1a28)); tower.position.set(x,bh/2,-19); mid.add(tower);
    const cren = mesh('box',[bw,0.5,1.4], mat(0x15131f)); cren.position.set(x,bh+0.2,-19); mid.add(cren);   // crenellations
    if(rand()<0.4){ const roof=mesh('cone',[bw*0.6,1.8,4], mat(0x161320)); roof.position.set(x,bh+1.1,-19); mid.add(roof); }
  }
  // the giant cracked clock-face on Grimm's Keep
  { const gx=(x1+x2)/2 - 6; const face=mesh('cyl',[3.2,3.2,0.4,20], emat(W5PAL.cream,0x2a2436,0.15)); face.position.set(gx,7,-20.5);
    const rim=mesh('tor',[3.2,0.3,6,20], mat(W5PAL.brassD)); rim.position.set(gx,7,-20.3);
    const hMin=mesh('box',[0.14,2.4,0.1], mat(0x1a1626)); hMin.position.set(gx,7.8,-20.1); hMin.rotation.z=0.6;
    const hHr=mesh('box',[0.18,1.5,0.1], mat(0x1a1626)); hHr.position.set(gx,7.5,-20.1); hHr.rotation.z=-1.1;
    mid.add(face,rim,hMin,hHr); }
  S.add(bakeGroup(mid));
  // FAR — jagged mountain spires under a stopped moon-clock
  const far = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(9,15)){ const spire=mesh('cone',[rand(3,6),rand(8,16),4], mat(W5PAL.hillFar)); spire.position.set(x,rand(-2,2),-28); far.add(spire); }
  S.add(bakeGroup(far));
  // EMBER-GLOW MIDGROUND — a scatter of cold ember + shadow motes
  const glow = new THREE.Group();
  for(let i=0;i<Math.floor((x2-x1)/6);i++){ const cc=pick([W5PAL.ember,W5PAL.shadowP,W5PAL.emberL]); const g=mesh('sph',[rand(0.1,0.22),6,5], emat(cc,cc,0.85)); g.position.set(rand(x1,x2), rand(1.5,6), rand(-9,-4)); glow.add(g); }
  S.add(bakeGroup(glow));
}

// cogMesh(r, col): a toothed gear disc (deco or a platform's visual). Returned centered at origin in x-y.
function cogMesh(r, col){
  const g = new THREE.Group();
  const disc = mesh('cyl',[r*0.8, r*0.8, 0.3, 16], mat(col)); disc.rotation.x=Math.PI/2; g.add(disc);
  const hub = mesh('cyl',[r*0.28, r*0.28, 0.36, 10], mat(col)); hub.rotation.x=Math.PI/2; g.add(hub);
  const nteeth = Math.max(8, Math.floor(r*8));
  for(let i=0;i<nteeth;i++){ const a=i/nteeth*TAU; const tooth=mesh('box',[r*0.22,r*0.26,0.28], mat(col)); tooth.position.set(Math.cos(a)*r*0.9, Math.sin(a)*r*0.9, 0); tooth.rotation.z=a; g.add(tooth); }
  return g;
}

function w5Ambience(S, x1, x2){
  // leaves channel — drifting clock-soot + cog-dust flecks
  const leaves = [];
  for(let i=0;i<16;i++){ const cc=pick([0x8a8478, 0x6a6f7a, W5PAL.emberL, W5PAL.shadowL]); const lf=new THREE.Mesh(geo('circ',0.12,5), new THREE.MeshBasicMaterial({color:cc, transparent:true, opacity:0.5, side:THREE.DoubleSide, depthWrite:false})); lf.userData={x0:rand(x1,x2), y0:rand(3,9), sp:rand(0.3,0.8), ph:rand(9), sw:rand(0.7,1.6)}; S.add(lf); leaves.push(lf); }
  const fg = new THREE.BufferGeometry(); const fp=[]; for(let i=0;i<40;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-8,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:W5PAL.ember, size:0.12, transparent:true, opacity:0.75}));
  S.add(flies);
  const clouds = [];
  for(let i=0;i<5;i++){ const cl=new THREE.Mesh(geo('sph',rand(6,9),8,6), new THREE.MeshBasicMaterial({color:0x241f30, transparent:true, opacity:0.42})); cl.scale.set(2.1,0.22,0.6); cl.userData={y:rand(0.4,1.4), sp:rand(0.25,0.6), x:rand(x1-20,x2+20)}; cl.position.set(cl.userData.x, cl.userData.y, -3.5); S.add(cl); clouds.push(cl); }
  return {flies, leaves, clouds, x1, x2};
}

function w5LevelFinish(G, x1, x2, clutterTheme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 6, 34);
  G.amb  = w5Ambience(G.scene, x1, x2);
  if(clutterTheme) w5Clutter(G, x1, x2, clutterTheme);
}

// =============================== 2) DECO BUILDERS (baked by caller) ===============================
function brokenPillar(x, z, s=1){
  const g = new THREE.Group();
  const h = rand(2,4)*s;
  const shaft = mesh('cyl',[0.4*s,0.5*s,h,10], mat(W5PAL.stone)); shaft.position.set(x,h/2,z); g.add(shaft);
  for(let i=0;i<3;i++){ const band=mesh('cyl',[0.52*s,0.52*s,0.12*s,10], mat(W5PAL.stoneD)); band.position.set(x,h*0.3+i*h*0.25,z); g.add(band); }
  const cap = mesh('box',[1.1*s,0.4*s,1.1*s], mat(W5PAL.stoneL)); cap.position.set(x,h+0.2*s,z); crook(cap,0.05); g.add(cap);
  return g;
}
function clockFaceDeco(x, y, z, s=1){
  const g = new THREE.Group();
  const face = mesh('cyl',[1.2*s,1.2*s,0.2*s,18], emat(W5PAL.cream,0x2a2436,0.12)); face.rotation.x=Math.PI/2; face.position.set(x,y,z); g.add(face);
  const rim = mesh('tor',[1.2*s,0.12*s,6,18], mat(W5PAL.brass)); rim.position.set(x,y,z); g.add(rim);
  for(let i=0;i<12;i++){ const a=i/12*TAU; const tick=mesh('box',[0.05*s,0.16*s,0.06], mat(W5PAL.stoneD)); tick.position.set(x+Math.cos(a)*1.0*s, y+Math.sin(a)*1.0*s, z+0.11*s); tick.rotation.z=a; g.add(tick); }
  const hMin=mesh('box',[0.06*s,0.9*s,0.05], mat(0x1a1626)); hMin.position.set(x,y+0.3*s,z+0.12*s); hMin.rotation.z=0.5; g.add(hMin);
  const hHr =mesh('box',[0.08*s,0.6*s,0.05], mat(0x1a1626)); hHr.position.set(x,y+0.15*s,z+0.12*s); hHr.rotation.z=-1.2; g.add(hHr);
  return g;
}
function chandelier(x, y, z, s=1){
  const g = new THREE.Group();
  const chain = mesh('cyl',[0.03*s,0.03*s,1.2*s,4], mat(W5PAL.chain)); chain.position.set(x,y+0.6*s,z); g.add(chain);
  const ring = mesh('tor',[0.6*s,0.06*s,5,12], mat(W5PAL.brassD)); ring.rotation.x=Math.PI/2; ring.position.set(x,y,z); g.add(ring);
  for(let i=0;i<5;i++){ const a=i/5*TAU; const candle=mesh('cyl',[0.05*s,0.06*s,0.2*s,6], mat(W5PAL.cream)); candle.position.set(x+Math.cos(a)*0.6*s,y+0.12*s,z+Math.sin(a)*0.6*s); g.add(candle); const fl=mesh('sph',[0.06*s,6,5], emat(W5PAL.ember,W5PAL.ember,1)); fl.position.set(x+Math.cos(a)*0.6*s,y+0.28*s,z+Math.sin(a)*0.6*s); g.add(fl); }
  return g;
}

// =============================== 3) GEAR PLATFORMS (D5 signature) ===============================
// gearPlat(G, x, y, opts): a standable brass cog that SPINS steadily. pass opts.spin for the turn rate/direction,
// opts.safeWin to tune the dwell budget, opts.grind:false for a plain static cog. For a MOVING gear, a level uses
// G.world.addMover with a cog mesh factory (deterministic). Standable top = the collider top at y. Adds mesh+collider+ticker.
// GEARS TURN + THE SPIKE GAP (owner call, July 2026): the cog spins steadily like a normal gear. There's a safe
// GAP at the top (flanked by two teeth) where you stand — but you can't dwell there. Linger past the safe window
// and a SPIKE rises through the gap (0.5s telegraph: it climbs into view, tip reddens, a warning ring flares +
// a "coming around" whir) then STRIKES — a heart-cost hit that flings you off the way the cog turns. Hopping/
// walking off resets it, so normal hop-to-hop flow (well under the window) never triggers it — only camping does.
// Deterministic (budget = time-stood), telegraphed (rising spike + ring + sound). Pass grind:false for a static cog.
function gearPlat(G, x, y, opts={}){
  const w = opts.w||2.4, d = opts.d||3, col = opts.col||W5PAL.brass;
  const spin = opts.spin!==undefined?opts.spin:1.2;
  const grind = opts.grind!==false;            // grind:false = a static decorative cog (no carry)
  const R = w*0.62, rimR = R*0.8;              // cog outer teeth radius · solid rim (disc) radius
  // THE COG IS THE PLATFORM (owner call, Aug 2026): its top rim sits exactly at the standable top y —
  // Pip's feet on the actual wheel, teeth poking up beside him. (The old flat top-disc collider floated
  // mid-face, reading as an invisible shelf inside the gear.)
  const gear = bakeGroup(cogMesh(R, W5PAL.brassD)); gear.matrixAutoUpdate = true;
  gear.position.set(x, y - rimR, 0); G.scene.add(gear);
  const hub = mesh('cyl',[R*0.28, R*0.28, 0.55, 10], mat(col)); hub.rotation.x = Math.PI/2;
  hub.position.set(x, y - rimR, 0.12); G.scene.add(hub);      // fixed center pin the wheel turns around
  G.world.addBox(x, y-0.4, 0, w, 0.4, d, {});
  if(grind){                                    // two fixed teeth frame the "stand here" gap at the top
    for(const s of [-1, 1]){ const t = mesh('cone',[0.17, 0.46, 6], mat(W5PAL.brassD)); t.position.set(x + s*w*0.40, y+0.04, 0.15); G.scene.add(t); }
  }
  // THE TURNING WHEEL CARRIES YOU: standing riders drift at the rim's true surface speed — stand still
  // ~1.5s and you ride off the edge; keep moving (walk 7.2 >> carry ~1.4) and it never bites. Replaces the
  // old delayed spike: the rotation itself is the hazard now — always visible, perfectly deterministic.
  const carry = Math.abs(spin) * rimR;
  const dir = -Math.sign(spin) || -1;           // positive spin = counter-clockwise = the top moves toward -x
  G.ents.add({ dead:false, cull:false, isEnemy:false, t:rand(0,3), group:new THREE.Group(),
    update(dt){
      this.t += dt;
      gear.rotation.z += spin*dt;
      if(!grind) return;
      const pl = G.player;
      if(pl && !pl.dead && pl.grounded && Math.abs(pl.pos.x-x) < w*0.5+0.55 && Math.abs(pl.pos.z) < d*0.6 && Math.abs(pl.pos.y-y) < 0.4){
        pl.pos.x += dir*carry*dt;
        // reached the rim's edge on the turning side → TIP OFF: clear the toe-hang fudge and let gravity take it
        // (without this the edge-forgiveness margin left riders dangling half-off, looking stuck)
        if((pl.pos.x - x)*dir > w*0.5 - 0.05){
          pl.pos.x += dir*0.45; pl.vel.x = dir*3.0; pl.grounded = false;
        }
      }
    } });
}

// =============================== 4) PENDULUM BLADE (clockwork hazard) ===============================
// PendulumBlade(G, x, pivotY, opts): a blade swinging on a fixed arc/clock from a pivot. Heart-cost graze (never a
// one-shot); telegraphed by its steady, learnable swing. Add via G.ents.add. Deterministic (angle = fn of the clock).
class PendulumBlade {
  constructor(G, x, pivotY, opts={}){
    this.G=G; this.x=x; this.pivotY=pivotY; this.len=opts.len||3.2; this.amp=opts.amp||1.0; this.period=opts.period||2.4;
    this.phase=opts.phase||0; this.r=opts.r||0.6; this.dead=false; this.cull=false; this.isEnemy=false; this.t=this.phase;
    this.group=new THREE.Group();
    const pivot=mesh('sph',[0.2,8,7], mat(W5PAL.brassD)); pivot.position.set(x,pivotY,0); this.group.add(pivot);
    this.arm=new THREE.Group(); this.arm.position.set(x,pivotY,0);
    const rod=mesh('cyl',[0.05,0.06,this.len,6], mat(W5PAL.chain)); rod.position.y=-this.len/2; this.arm.add(rod);
    const blade=mesh('cyl',[this.r,this.r,0.12,3], emat(0xb8bcc8,0x6a6f7a,0.4)); blade.rotation.x=Math.PI/2; blade.position.y=-this.len; this.arm.add(blade);
    const edge=mesh('tor',[this.r,0.05,3,12], emat(0xd8dce8,0x8a8f9a,0.5)); edge.rotation.x=Math.PI/2; edge.position.y=-this.len; this.arm.add(edge);
    this.group.add(this.arm); G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    const ang = Math.sin(this.t*(TAU/this.period))*this.amp;
    this.arm.rotation.z = ang;
    const bx = this.x + Math.sin(ang)*this.len, by = this.pivotY - Math.cos(ang)*this.len;
    const pl=G.player;
    if(pl && !pl.dead && Math.abs(pl.pos.x-bx)<this.r+0.3 && Math.abs(pl.pos.z)<1.2 && Math.abs(pl.pos.y+0.6-by)<this.r+0.4){
      pl.damage(1, new THREE.Vector3(bx,by,0));
    }
  }
}

// =============================== 5) CLOCK-CHAIN CLIMB ===============================
// w5Chain(G, x, y0, y1, z=0): a hanging pendulum chain you climb (press up), leap off with a boosted hop.
function w5Chain(G, x, y0, y1, z=0){
  const g = new THREE.Group();
  const links = Math.floor((y1-y0)/0.3);
  for(let i=0;i<links;i++){ const lk=mesh('tor',[0.08,0.03,4,8], mat(W5PAL.chain)); lk.rotation.x=(i%2)?Math.PI/2:0; lk.position.set(x, y0+i*0.3, z); g.add(lk); }
  G.scene.add(bakeGroup(g));   // static links → one draw call (matches w2Chain's already-baked idiom)
  return G.world.addBox(x, y0, z, 0.9, y1-y0, 1.2, {type:'climb'});
}

// =============================== 6) GRIMM'S GIFT — the D5 gamble container ===============================
// A black present with a silver ribbon... suspicious. SAME gamble table + CLEAR-PATCH + 1s spawnGrace — but the
// ambush is SHADOW-COPIES OF PIP (ShadowCopy) bursting out. Integrates like CursedCoffin (.opened/.group.position/
// .open(G)/.promptLabel; a level pushes it to G.coffins AND G.ents.add()s it).
class GrimmGift {
  constructor(x, y, z, ry=0){
    this.group = new THREE.Group();
    const boxM=emat(0x1a1626,0x0e0a16,0.2), ribbon=emat(0xc9ccd8,0x8a8f9a,0.5);
    const box = mesh('box',[1.1,1.0,1.1], boxM); box.position.y=0.5; this.group.add(box);
    for(const r of [[1,0,0],[0,0,1]]){ const band=mesh('box',[r[0]?1.14:0.16,1.04,r[2]?1.14:0.16], ribbon); band.position.y=0.5; this.group.add(band); }
    this.lid = new THREE.Group();
    const lidBox=mesh('box',[1.2,0.3,1.2], boxM); lidBox.position.y=0; this.lid.add(lidBox);
    // a big silly bow on top
    for(const s of [-1,1]){ const loop=mesh('tor',[0.2,0.07,5,12], ribbon); loop.position.set(s*0.2,0.28,0); loop.rotation.y=Math.PI/2; this.lid.add(loop); }
    this.lid.position.y=1.15; this.group.add(this.lid);
    // suspicious purple glow leaking from the seams
    this.seam = mesh('box',[1.12,0.05,1.12], emat(W5PAL.shadowP,W5PAL.shadowP,1)); this.seam.position.y=1.0; this.group.add(this.seam);
    this.glow = new THREE.PointLight(W5PAL.shadowP, 14, 7); this.glow.position.set(0,1.2,0); this.group.add(this.glow);
    this.group.position.set(x,y,z); this.group.rotation.y=ry;
    this.opened=false; this.dead=false; this.t=rand(0,9);
    this.promptLabel='🎁 Open the mysterious black gift...?';
  }
  update(dt, G){
    this.t += dt;
    if(!this.opened){
      const pulse=0.6+Math.sin(this.t*3)*0.4; this.seam.material.emissiveIntensity=pulse; this.glow.intensity=10+Math.sin(this.t*2.4)*7;
      this.lid.position.y = 1.15 + Math.sin(this.t*2.2)*0.02;   // a restless twitch
    } else { this.glow.intensity=damp(this.glow.intensity,0,2,dt); this.seam.material.emissiveIntensity=damp(this.seam.material.emissiveIntensity,0.15,3,dt); }
  }
  open(G){
    if(this.opened) return;
    this.opened = true;
    const p = this.group.position;
    this.lid.position.y = 1.6;
    AUDIO.tone && AUDIO.tone({f:180,f2:70,type:'sawtooth',t:0.5,vol:0.2});
    AUDIO.noise && AUDIO.noise({t:0.3,vol:0.16,fFrom:1200,fTo:200});
    G.camc.shake(0.2,0.4);
    const scene = G.scene;   // payout must land in THE SAME scene — a switchArea inside the 650ms window would spawn into the new area
    setTimeout(()=>{
      if(G.scene !== scene) return;
      const r = Math.random();
      if(r < 0.08){
        G.save.lives = Math.min(9, (G.save.lives!==undefined?G.save.lives:5)+1); G.persist();
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 10);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.4,p.z), 0xb4ffd0, 26, {speed:4, life:1});
        AUDIO.heart && AUDIO.heart(); AUDIO.ghostGiggle && AUDIO.ghostGiggle();
        window.UI && UI.updateHUD(); window.UI && UI.toast('🎁👻 A GHOSTLY 1-UP! Grimm left a kind gift after all. Lives: '+G.save.lives);
      } else if(r < 0.32){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 25);
        G.ents.add(new Heart(p.x-1, p.y+1.0, 0)); G.ents.add(new PowerUp(p.x+1.2, p.y+1.2, 0, pick(['shield','moon','bat'])));
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), W5PAL.emberL, 26, {speed:5, life:0.9});
        AUDIO.goldPumpkin && AUDIO.goldPumpkin();
        window.UI && UI.toast('🎁✨ JACKPOT! Candy, a heart, AND a treasure. The good kind of surprise!');
      } else if(r < 0.7){
        candyBurst(G, new THREE.Vector3(p.x,p.y+1.0,p.z), 8);
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), PAL.candy1, 10, {speed:3});
        AUDIO.candy && AUDIO.candy(0);
        window.UI && UI.toast('🎁 A few candies... and a puff of cold soot.');
      } else {
        G.fx.spawn(new THREE.Vector3(p.x,p.y+1.3,p.z), W5PAL.shadowP, 22, {speed:4.5});
        AUDIO.bossRoar && AUDIO.bossRoar(); G.camc.shake(0.4,0.45);
        _giftAmbush(G, p);
        window.UI && UI.toast('🎁🫥 SHADOW-PIPS!! Grimm poured copies of YOU out of the box!!');
      }
    }, 650);
  }
}
function _giftAmbush(G, p){
  const offs = [-2.6, -1.4, 1.4, 2.6];
  const Ghost = (typeof ShadowCopy!=='undefined') ? ShadowCopy : Boo;
  for(let i=0;i<offs.length;i++){
    const bx = p.x+offs[i];
    const m = new Ghost(G, bx, p.y+0.2, 0, {});
    m.group.position.set(bx, p.y+0.2, 0); m.spawnGrace = 1.0; G.ents.add(m);
  }
}

// =============================== 7) MIDNIGHT CLOCK — the D5 Old Shortcut warp ===============================
// A giant stopped clock. Hit the MINUTE gear then the HOUR gear IN ORDER (spin/pound/salt near each) → the face
// swings open → warp to the level end + full candy bonus (once per run). Add via G.ents.add; the level passes the
// warp target x. Wrong order (hour first) resets — the two-step order is the skill gate.
class MidnightClock {
  constructor(G, x, y, opts={}){
    this.G=G; this.dead=false; this.cull=false; this.isEnemy=false; this.t=rand(0,3);
    this.warpX = opts.warpX!==undefined?opts.warpX:x+8; this.candy = opts.candy||40; this.used=false;
    this.minuteHit=false;
    this.group=new THREE.Group();
    const face=mesh('cyl',[2.2,2.2,0.4,20], emat(W5PAL.cream,0x2a2436,0.1)); face.rotation.x=Math.PI/2; face.position.set(x,y,-0.4); this.group.add(face);
    const rim=mesh('tor',[2.2,0.2,6,20], mat(W5PAL.brassD)); rim.position.set(x,y,-0.2); this.group.add(rim);
    // MINUTE gear (small, high) + HOUR gear (big, low) — the two hit targets; a lone PURPLE lantern is the tell it's special
    this.minG = cogMesh(0.5, W5PAL.brass); this.minG.position.set(x-0.7, y+0.9, 0.1); this.group.add(this.minG);
    this.hourG = cogMesh(0.8, W5PAL.verd); this.hourG.position.set(x+0.6, y-0.7, 0.1); this.group.add(this.hourG);
    this.tell = mesh('sph',[0.2,8,7], emat(W5PAL.shadowP,W5PAL.shadowP,1)); this.tell.position.set(x, y+2.6, 0.1); this.group.add(this.tell);
    this.x=x; this.y=y;
    G.scene.add(this.group);
  }
  update(dt, G){
    this.t+=dt;
    this.tell.scale.setScalar(1+Math.sin(this.t*3)*0.25);
    this.minG.rotation.z += (this.minuteHit?3:0.4)*dt;
    this.hourG.rotation.z -= 0.3*dt;
    if(this.used) return;
    const pl=G.player;
    if(!pl || pl.dead) return;
    // a hit = a spin (attackT) or pound near a gear
    const hitting = pl.attackT>0 || pl.pounding;
    if(hitting){
      const dMin = Math.hypot(pl.pos.x-(this.x-0.7), pl.pos.y-(this.y+0.9));
      const dHour = Math.hypot(pl.pos.x-(this.x+0.6), pl.pos.y-(this.y-0.7));
      if(!this.minuteHit && dMin<1.6){ this.minuteHit=true; AUDIO.stomp && AUDIO.stomp(); G.fx.spawn(new THREE.Vector3(this.x-0.7,this.y+0.9,0.2), W5PAL.brass, 12, {speed:3}); window.UI && UI.toast('🕛 The MINUTE gear turns... now the HOUR.'); }
      else if(this.minuteHit && dHour<1.8){ this._open(G); }
      else if(!this.minuteHit && dHour<1.8){ G.fx.spawn(new THREE.Vector3(this.x+0.6,this.y-0.7,0.2), 0x888888, 6, {speed:2}); }   // hour-first does nothing
    }
  }
  _open(G){
    this.used=true;
    AUDIO.goldPumpkin && AUDIO.goldPumpkin(); G.camc.shake(0.5,0.5);
    G.fx.spawn(new THREE.Vector3(this.x,this.y,0.3), W5PAL.emberL, 30, {speed:6, life:1});
    window.UI && UI.toast('🕛✨ MIDNIGHT! The clock face swings open: a shortcut through time!');
    // warp: award the level's candy bonus + teleport to the end (the level's exit run-in)
    G.addCandy(this.candy);   // same award idiom as the D1/D4 warps (sets _dirty + HUD refresh)
    G.persist && G.persist();
    G._warpUsed = true;
    const pl=G.player; pl.pos.set(this.warpX, 2, 0); pl.vel.set(0,0,0);
    window.UI && UI.updateHUD();
  }
}

// =============================== 8) LEVEL REGISTRY ===============================
const W5_LEVELS = [];
LEVEL_LISTS.push(W5_LEVELS);

// =============================== 9) THEMED CLUTTER ===============================
// w5Clutter(G, x1, x2, theme): baked castle-floor clutter (cog scraps, broken clock hands, gears, chain links,
// candle stubs, bones, ember pebbles). Split the span around any pit.
function w5Clutter(G, x1, x2, theme='castle'){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.0);
  for(let i=0;i<n;i++){
    const x=rand(x1,x2), z=rand(-2.8,2.8), r=rand();
    if(r<0.2){ const cog=cogMesh(rand(0.18,0.34), W5PAL.steelD); cog.position.set(x,0.1,z); cog.rotation.x=Math.PI/2; g.add(cog); }
    else if(r<0.38){ const rock=mesh('box',[rand(0.2,0.4),rand(0.15,0.3),rand(0.2,0.4)], mat(W5PAL.stoneD)); rock.rotation.y=rand(TAU); rock.position.set(x,0.1,z); g.add(rock); }
    else if(r<0.54){ const hand=mesh('box',[0.05,rand(0.3,0.6),0.04], mat(0x1a1626)); hand.rotation.z=rand(TAU); hand.position.set(x,0.06,z); g.add(hand); }
    else if(r<0.7){ const lk=mesh('tor',[rand(0.1,0.16),0.03,4,8], mat(W5PAL.chain)); lk.rotation.x=Math.PI/2; lk.position.set(x,0.05,z); g.add(lk); }
    else if(r<0.84){ const candle=mesh('cyl',[0.05,0.06,rand(0.12,0.24),6], mat(W5PAL.cream)); candle.position.set(x,0.1,z); g.add(candle); if(rand()<0.5){ const fl=mesh('sph',[0.05,5,4], emat(W5PAL.ember,W5PAL.ember,1)); fl.position.set(x,0.24,z); g.add(fl); } }
    else if(r<0.93){ const bone=mesh('cyl',[0.02,0.02,rand(0.25,0.4),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.04,z); g.add(bone); }
    else { const cc=pick([W5PAL.ember,W5PAL.shadowP]); const pb=mesh('sph',[rand(0.06,0.1),5,4], emat(cc,cc,0.6)); pb.position.set(x,0.05,z); pb.scale.y=0.6; g.add(pb); }
  }
  G.scene.add(bakeGroup(g));
}

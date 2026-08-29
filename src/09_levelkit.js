// ============ LEVEL KIT — shared side-scroll scaffolding + level registry ============
// Levels run along +X. The play lane is z=0; z<0 is background depth, z>0 foreground.
function grave(x,z,ry){
  const g = new THREE.Group();
  const slab = mesh('box',[0.8,1.1,0.22], mat(0x6b6580)); slab.position.y=0.55;
  const top = mesh('cyl',[0.4,0.4,0.22,10], mat(0x6b6580)); top.rotation.x=Math.PI/2; top.position.y=1.1;
  g.add(slab,top); g.position.set(x,0,z); g.rotation.y=ry!==undefined?ry:rand(-0.3,0.3); crook(g,0.05);
  return g;
}
function bigPumpkin(G, x,y,z, s, bouncy=true){
  const g = new THREE.Group();
  const body = mesh('sph',[s,12,10], emat(PAL.pumpkin, 0x7a3000, 0.25)); body.scale.set(1.12,0.82,1.12);
  for(let i=0;i<4;i++){
    const seg = mesh('sph',[s,10,9], mat(PAL.pumpkinD));
    seg.scale.set(1.05,0.78,0.25); seg.rotation.y=i*Math.PI/4;
    g.add(seg);
  }
  const stem = mesh('cyl',[s*0.1,s*0.16,s*0.4,6], mat(PAL.stem)); stem.position.y=s*0.85;
  g.add(body,stem);
  g.position.set(x, y+s*0.05, z);
  G.scene.add(g);
  const top = y + s*0.82;
  G.world.addBox(x, y-0.4, z, s*1.5, top-y+0.4, s*1.5, bouncy?{type:'bounce', bounce:13}:{});
  return g;
}
function hayBale(G,x,y,z,w=2,h=1.2,d=1.4,ry=0){
  const b = mesh('box',[w,h,d], mat(0xc2a24f));
  const band1 = mesh('box',[w+0.04,0.12,d+0.04], mat(0x8a6f2e)); band1.position.y=0;
  const g = new THREE.Group(); g.add(b,band1);
  g.position.set(x,y+h/2,z); g.rotation.y=ry;
  G.scene.add(g);
  G.world.addBox(x,y,z,w,h,d,{});
  return g;
}
function platform(G,x,y,z,w,d,color,opts={}){
  const m = mesh('box',[w,0.5,d], mat(color||0x4a3a6e));
  m.position.set(x,y-0.25,z);
  G.scene.add(m);
  G.world.addBox(x,y-0.5,z,w,0.5,d,opts);
  return m;
}
// ground running along X
function groundX(G, x1, x2, color, d=10){
  const w = Math.abs(x2-x1), cx = (x1+x2)/2;
  const m = mesh('box',[w,1.2,d], mat(color||PAL.grass));
  m.position.set(cx,-0.6,0);
  // bright grass lip on top edge (reads like SMW's ground highlight)
  const lipColor = new THREE.Color(color||PAL.grass).multiplyScalar(1.45).getHex();
  const lip = mesh('box',[w,0.14,d+0.25], mat(lipColor));
  lip.position.set(cx,0.02,0);
  G.scene.add(m, lip);
  G.world.addBox(cx,-1.2,0,w,1.2,d,{});
}
function mudPitX(G, x, w){
  const m = mesh('box',[w,0.14,5], emat(0x6b48b8, 0x4a2f90, 0.65));
  m.position.set(x,0.03,0);
  G.scene.add(m);
  G.world.addBox(x,-0.05,0,w,0.4,5,{type:'hazard',damage:1});
}
function signPost(G,x,z,ry,text){
  const g = new THREE.Group();
  const pole = mesh('cyl',[0.07,0.09,1.4,5], mat(PAL.woodD)); pole.position.y=0.7;
  const board = mesh('box',[1.5,0.8,0.1], mat(PAL.wood)); board.position.y=1.5; crook(board,0.04);
  g.add(pole,board);
  g.position.set(x,0,z); g.rotation.y=ry;
  G.scene.add(g);
  G.signs.push({x,z,text});
}
// PIT DRESSING (owner call, Aug 2026): death pits were an invisible fall — "hard to tell and not too
// interesting". Every true void pit now shows its DANGER: a themed bed of spikes/bones/thorns down in the
// dark (visual only — the fall itself already costs the heart via killY, so no double-hit collider).
// Sits at y≈-4 so it reads from the pit lip but never clips a jump path. NEVER placed on a Leap of Faith.
const PIT_FX = {   // per-theme: danger glow color, eruption burst colors, rising-mote colors
  patch:  { glow:0xff5030, burst:[0xff8c2e,0xff5030], mote:0xff8c2e },
  grave:  { glow:0x9fe066, burst:[0x9fe066,0xd8ffd0], mote:0x9fe066 },
  wood:   { glow:0x8a5fd0, burst:[0xb37dff,0x8a5fd0], mote:0xb37dff },
  harbor: { glow:0x63e6e2, burst:[0x63e6e2,0xbafcf8], mote:0x63e6e2 },
  castle: { glow:0xff8a3a, burst:[0xffa030,0xff5030], mote:0xffc060 },
};
function pitDressing(G, x1, x2, theme, bedTop=-4.3){   // bedTop: spike-base height — deepen for pits whose lips sit below 0
  if(G._pitArea !== G.area){ G.pits = []; G._pitTicker = null; G._pitArea = G.area; }   // areas that skip levelBegin (tutorial) must not inherit stale pits
  const g = new THREE.Group();
  const BY = bedTop;
  const w = x2-x1, cx = (x1+x2)/2, n = Math.max(4, Math.floor(w*2.6));
  const base = mesh('box',[w+0.6, 0.5, 3.4], mat(0x120d1e)); base.position.set(cx, BY-0.3, 0); g.add(base);   // the dark pit floor
  for(let i=0;i<n;i++){
    const px = x1+0.3+rand(0, Math.max(0.1, w-0.6)), pz = rand(-1.2,1.2);
    if(theme==='grave'){        // bone spikes + the odd skull
      const b = mesh('cone',[0.16,rand(0.9,1.5),5], mat(PAL.bone)); b.position.set(px,BY,pz); b.rotation.z=rand(-0.25,0.25); g.add(b);
      if(i%5===0){ const sk = mesh('sph',[0.22,7,6], mat(PAL.bone)); sk.position.set(px,BY+0.05,pz); sk.scale.y=0.85; g.add(sk); }
    } else if(theme==='wood'){  // giant witchwood thorns + CRASHED BROOMSTICKS (owner call: Broomhilda's fallen fliers) + a glowing shroom
      const th = mesh('cone',[0.2,rand(1.0,1.7),5], emat(0x8a5fd0,0x5a2fa0,0.55)); th.position.set(px,BY,pz); th.rotation.z=rand(-0.3,0.3); g.add(th);
      if(i%4===0){   // a wrecked broom stuck handle-down, bristles up — tilted like a dart that missed
        const br = new THREE.Group();
        const shaft = mesh('cyl',[0.05,0.06,1.5,5], mat(0x4a3222)); shaft.position.y=0.55; br.add(shaft);
        const wrap = mesh('cyl',[0.1,0.1,0.1,6], mat(0x8a5fd0)); wrap.position.y=1.12; br.add(wrap);
        const bristles = mesh('cone',[0.19,0.5,6], mat(0xb8923a)); bristles.position.y=1.42; br.add(bristles);
        br.position.set(px,BY,pz); br.rotation.z=rand(-0.45,0.45); br.rotation.x=rand(-0.2,0.2);
        g.add(br);
      }
      if(i%7===0){   // a fallen witch hat, crumpled on the bed beside the wrecks — the rest of the story
        const hat = new THREE.Group();
        const brim = mesh('cyl',[0.34,0.38,0.05,10], mat(0x3d2a5e)); hat.add(brim);
        const crown = mesh('cone',[0.2,0.55,8], mat(0x3d2a5e)); crown.position.y=0.28; crown.rotation.z=rand(-0.35,0.35); hat.add(crown);
        const band = mesh('cyl',[0.21,0.22,0.08,8], mat(0x8a5fd0)); band.position.y=0.07; hat.add(band);
        hat.position.set(px, BY+0.03, pz); hat.rotation.z=rand(-0.5,0.5); hat.rotation.y=rand(0,3);
        g.add(hat);
      }
      if(i%6===0){ const sh = mesh('sph',[0.14,6,5], emat(0x9fe066,0x6fb040,0.8)); sh.position.set(px,BY,pz); g.add(sh); }
    } else if(theme==='harbor'){ // dead coral spears + splintered ship timbers
      const c = mesh('cone',[0.17,rand(0.8,1.4),4], mat(0x9a8f86)); c.position.set(px,BY,pz); c.rotation.z=rand(-0.35,0.35); g.add(c);
      if(i%4===0){ const t = mesh('box',[0.16,rand(0.9,1.4),0.16], mat(0x4a3a30)); t.position.set(px,BY+0.2,pz); t.rotation.z=rand(-0.5,0.5); g.add(t); }
    } else if(theme==='castle'){ // iron spikes rising from MOLTEN forge-glow (lava seams between the teeth)
      const s = mesh('cone',[0.15,rand(1.0,1.6),4], mat(0x6a6f7a)); s.position.set(px,BY,pz); g.add(s);
      if(i%5===0){ const gt = mesh('box',[0.4,0.5,0.24], mat(0x5a4f20)); gt.position.set(px,BY+0.05,pz); gt.rotation.z=rand(-0.4,0.4); g.add(gt); }
      if(i%3===0){ const lv = mesh('box',[rand(0.7,1.6),0.14,rand(0.6,1.4)], emat(0xff6a20,0xff4a10,1.0)); lv.position.set(px,BY-0.02,pz); g.add(lv); }
    } else {                    // 'patch' default (owner call, Aug 2026): SPOOKY PUMPKINS — rotting gourds with jagged
      // glowing jack-o'-faces glaring up from the pit. Instantly reads "not the bouncy kind" — the friendly
      // pumpkins bounce you, THESE end you. Bramble thorns between them keep the bed spiky.
      if(i%2===0){
        const s = rand(0.55,0.9);
        const pk = new THREE.Group();
        const body = mesh('sph',[0.5,10,8], mat(0x6a2a08)); body.scale.set(1.15,0.8,1.15); pk.add(body);   // rotten dark orange
        const stem = mesh('cone',[0.09,0.3,5], mat(0x2a3a18)); stem.position.y=0.44; stem.rotation.z=rand(-0.5,0.5); pk.add(stem);
        const faceM = emat(0xff8a2e, 0xff5a10, 1.0);
        const eL = mesh('cone',[0.1,0.16,3], faceM); eL.position.set(-0.17,0.12,0.44); eL.rotation.x=0.35; eL.rotation.z=Math.PI;   // angry down-point eyes
        const eR = eL.clone(); eR.position.x=0.17; pk.add(eL,eR);
        for(let t=0;t<3;t++){ const tooth = mesh('cone',[0.07,0.12,3], faceM); tooth.position.set(-0.14+t*0.14, -0.14+(t%2?0.05:0), 0.46); tooth.rotation.x=0.3; if(t%2) tooth.rotation.z=Math.PI; pk.add(tooth); }   // jagged grin
        pk.scale.setScalar(s); pk.position.set(px, BY+0.34*s, pz); pk.rotation.y=rand(-0.6,0.6);
        g.add(pk);
      } else {
        const th = mesh('cone',[0.15,rand(0.7,1.2),5], mat(0x3a2a20)); th.position.set(px,BY,pz); th.rotation.z=rand(-0.3,0.3); g.add(th);
      }
      if(i%5===0){ const fl = mesh('cone',[0.14,rand(0.4,0.7),5], emat(0xff8c2e,0xff5020,0.95)); fl.position.set(px,BY+0.05,pz); g.add(fl); }
    }
  }
  G.scene.add(bakeGroup(g));
  // the danger glow stays UNBAKED so it can breathe (pulse) — an emissive fake, no light
  const fx = PIT_FX[theme]||PIT_FX.patch;
  const gl = new THREE.Mesh(geo('plane', Math.max(0.5,w-0.4), 1.2), new THREE.MeshBasicMaterial({color:fx.glow, transparent:true, opacity:0.10, depthWrite:false, side:THREE.DoubleSide}));
  gl.rotation.x = -Math.PI/2; gl.position.set(cx, BY+0.6, 0); G.scene.add(gl);
  (G.pits ||= []).push({x1, x2, cx, theme, glow:gl, bedY:BY, th:BY+1.6, moteY:BY+0.4});
  ensurePitTicker(G);
}
// register a fall zone WITHOUT building a spike bed — for pits whose visual bottom already exists
// (the glowing potion-bogs in w1l4/w3l4): the Mario impact sequence fires AT that surface (a brew
// SPLASH), and the motes rise from it like bubbles. Never used on a Leap of Faith.
function pitRegister(G, x1, x2, theme, bedTop, moteY){
  if(G._pitArea !== G.area){ G.pits = []; G._pitTicker = null; G._pitArea = G.area; }
  (G.pits ||= []).push({x1, x2, cx:(x1+x2)/2, theme, glow:null, bedY:bedTop, th:bedTop+1.6, moteY: moteY!==undefined?moteY:bedTop+1.5});
  ensurePitTicker(G);
}
function ensurePitTicker(G){
  // ONE shared ticker per level animates every pit: glow pulse + slow rising motes (embers/wisps/spores/mist/sparks/bubbles)
  if(G._pitTicker) return;
  G._pitTicker = { dead:false, cull:false, group:new THREE.Group(), t:0,
    update(dt){
      this.t += dt;
      const px = G.player ? G.player.pos.x : 0;
      for(const p of G.pits){
        if(Math.abs(p.cx - px) > 46) continue;
        if(p.glow) p.glow.material.opacity = 0.10 + Math.sin(G.time*2.2 + p.cx)*0.045;
        if(this.t > 0.34){
          const f = PIT_FX[p.theme]||PIT_FX.patch;
          G.fx.spawn(new THREE.Vector3(p.x1+rand(0.3, Math.max(0.4,(p.x2-p.x1)-0.6)), p.moteY, rand(-0.8,0.8)), f.mote, 1, {speed:0.5, gravity:-1.6, life:1.4, size:0.5});
        }
      }
      if(this.t > 0.34) this.t = 0;
    } };
  G.ents.add(G._pitTicker);
}
// THE DEATH ACTION (owner call, Aug 2026): falling into a pit isn't a quiet fade — the pit ERUPTS.
// Fires once as Pip passes the spike bed: themed burst + thud + shake, and Pip vanishes INTO it
// (visibility restored in onPlayerFell). Only fires inside a registered pit, so descending routes,
// Leaps of Faith and mid-jump dips never trigger it.
function pitImpactCheck(G, pl, dt){
  const py = pl._pitPy ?? pl.pos.y; pl._pitPy = pl.pos.y;
  // ---- THE SPIKE-HIT SEQUENCE (owner: "like in Mario") — Pip LANDS on the spikes, takes the hit
  // visibly (squash + flash + burst), then does the classic death pop: a flip up and drop. ----
  if(G._pitSeq){
    const s = G._pitSeq; s.t += dt;
    G._camDip = s.bedY + 2.2;                       // hold the camera down on the doom for the whole show
    if(s.t < 0.55){                                 // impaled: squashed flat on the spike tips, trembling
      pl.pos.set(s.x, s.y, 0);
      pl.group.position.set(s.x + Math.sin(s.t*70)*0.03, s.y, 0);
      if(pl.body){ pl.body.scale.set(1.25, 0.55, 1.25); pl.body.rotation.z = Math.sin(s.t*60)*0.06; }
    } else {                                        // the Mario pop: leap up, tumble, fall back past the bed
      const t2 = s.t - 0.55;
      if(!s.popped){ s.popped = true; AUDIO.jump && AUDIO.jump(); if(pl.body) pl.body.scale.set(0.9, 1.25, 0.9); }
      pl.pos.set(s.x, s.y + 9*t2 - 13*t2*t2, 0);
      pl.group.position.copy(pl.pos);
      if(pl.body) pl.body.rotation.z += dt*10;
      if(t2 > 1.1 || pl.pos.y < s.y - 5){           // show's over — the usual fall bookkeeping (heart + lantern)
        G._pitSeq = null;
        if(pl.body){ pl.body.rotation.z = 0; pl.body.scale.set(1,1,1); }
        pl.captured = false;
        G.onPlayerFell();
      }
    }
    return;
  }
  G._camDip = null;
  if(pl.dead) return;
  // while falling into a registered pit, release the camera's vertical floor so the impact is ON SCREEN
  // (phones crop the frame vertically — without the dip the show plays below the bottom edge)
  if(pl.vel.y < -1 && pl.pos.y < 1.2){
    for(const p of (G.pits||[])){
      if(pl.pos.x >= p.x1-0.5 && pl.pos.x <= p.x2+0.5){ G._camDip = p.bedY + 2.2; break; }
    }
  }
  if(pl.vel.y > -3) return;
  for(const p of (G.pits||[])){
    if(pl.pos.x < p.x1-0.5 || pl.pos.x > p.x2+0.5) continue;
    if(!(py > p.th && pl.pos.y <= p.th)) continue;  // fire exactly as Pip lands on THIS pit's spike tips
    if(G.time - (G._pitFXT||-9) < 0.8) return;
    G._pitFXT = G.time;
    const f = PIT_FX[p.theme]||PIT_FX.patch;
    // LAND on the spikes (captured = we drive the show; physics + killY wait for us)
    pl.captured = true; pl.vel.set(0,0,0);
    G._pitSeq = {t:0, x:pl.pos.x, y:p.th-0.45, bedY:p.bedY, popped:false};
    pl.pos.set(G._pitSeq.x, G._pitSeq.y, 0); pl.group.position.copy(pl.pos);
    // the GEYSER + the hit: themed fountain up past the lip, red hit burst, hurt feedback
    G.fx.spawn(new THREE.Vector3(pl.pos.x, p.th+0.2, 0.3), f.burst[0], 16, {speed:10, life:1.2, gravity:10, size:1.2});
    G.fx.spawn(new THREE.Vector3(pl.pos.x, p.th,     0.3), f.burst[1], 12, {speed:4,  life:0.8, gravity:6,  size:0.9});
    G.fx.spawn(new THREE.Vector3(pl.pos.x, p.th+0.6, 0.3), 0xff5555, 8, {speed:3, life:0.5});
    AUDIO.hurt(); AUDIO.poundHit();
    window.UI && UI.hurtFlash && UI.hurtFlash();
    G.camc.shake(0.35, 0.4);
    G.hitstop = 0.06;                               // the landing BITES
    return;
  }
}
function thornsX(G, x, w){
  const tG = new THREE.Group();
  for(let i=0;i<Math.floor(w*4.5);i++){                                  // DENSER so the bed reads as filled (no misleading gaps over the hazard)
    const th = mesh('cone',[0.15,rand(0.55,0.8),5], emat(0x8a5fd0,0x6a3fc0,0.7));   // taller + brighter so the spikes clearly match their hitbox
    th.position.set(x+rand(-w/2,w/2), 0.25, rand(-1.2,1.2));
    th.rotation.z=rand(-0.3,0.3);
    tG.add(th);
  }
  G.scene.add(bakeGroup(tG));
  // hazard box INSET + shorter than the visible bed: only bites where the spikes actually are (fixes "it got me and I didn't touch it"), and a jump clears 0.55 comfortably
  G.world.addBox(x,0,0,w-0.4,0.55,2.6,{type:'hazard',damage:1});
}

// level registry — each level file self-registers: W1_LEVELS.push({id,district,name,build,update,parTime})
const W1_LEVELS = [];
const LEVEL_LISTS = [W1_LEVELS]; // future districts append their arrays here
function findLevel(id){
  for(const list of LEVEL_LISTS) for(const l of list) if(l.id===id) return l;
  return null;
}

// FIRST call in every level build
function levelBegin(G){
  G.signs = [];
  G.coffins = [];
  G._warpUsed = false;
  G._leaped = false;
  G._exitHit = false;
  G.spawnPoint.set(0,0.6,0);
  G.pits = [];
  G._pitTicker = null;   // scene rebuild dropped the old ticker with the old EntityMgr
  G._pitFXT = -9;
  G._pitSeq = null;
  G._camDip = null;
  G.world.killY = -14;
  G.camMinY = 0;   // side-camera vertical floor; a level that descends underground lowers this
  G.lightPools = [];   // D2 darkness mechanic: lit lanterns push {x,z,r}; Wisps read this to know where it's safe
}

// end-of-level relight arch — the boss gate's visual language, scaled down
function exitGate(G, x){
  const S = G.scene;
  const gGate = new THREE.Group();
  const gL = mesh('box',[0.8,5,0.8], mat(0x38294f)); gL.position.set(x-1.4,2.5,-1.2);
  const gR = gL.clone(); gR.position.x=x+1.4;
  const gT = mesh('box',[3.6,0.8,1], mat(0x38294f)); gT.position.set(x,5.2,-1.2);
  const crest = pumpkinDeco(0,0,1,true); crest.position.set(x,5.7,-1.2);
  gGate.add(gL,gR,gT,crest);
  S.add(gGate);
  const doorPm = new THREE.MeshBasicMaterial({color:PAL.pumpkin, transparent:true, opacity:0.4, side:THREE.DoubleSide, depthWrite:false});
  const doorPortal = new THREE.Mesh(geo('plane',2.6,4), doorPm);
  // in FRONT of the pillar faces (-0.8) — level backdrop geometry at the arch's depth was slicing the glow
  // in half in some levels (w2l3's bell tower); renderOrder wins the transparent sort vs darkness/mist layers
  doorPortal.position.set(x,2.3,-0.55);
  doorPortal.renderOrder = 5;
  S.add(doorPortal);
  G.lvlPortal = doorPortal;
  G.world.addBox(x-0.6,0,0, 1.2,3.5,4, {type:'trigger', onTouch:()=>{
    // a teleport-style warp (D5's midnight clock) finishes via this gate — pass {warp:true} so it grants the documented warp stars
    if(!G._exitHit && G.state==='play'){ G._exitHit=true;
      // THE GATE CELEBRATION (owner: crossing must FEEL like winning) — triumphant leap, candy fireworks,
      // portal flare, banner; the clear card waits a beat so the moment lands first
      const pl = G.player;
      if(pl){ pl.vel.set(3.5, 9.5, 0); pl.grounded = false; }
      G.hitstop = 0.1;
      G.camc.shake(0.25, 0.35);
      if(G.lvlPortal) G.lvlPortal.material.opacity = 0.95;
      window.UI && UI.finaleBanner && UI.finaleBanner('✨ LEVEL CLEAR! ✨', 1300);
      const scene = G.scene;
      for(let i=0;i<3;i++) setTimeout(()=>{ if(G.scene!==scene) return;
        G.fx.spawn(new THREE.Vector3(x+rand(-2.5,1.5), 3.2+rand(0,3), 0.3), pick([0xff5ea8,0x63e6e2,0xffd23f,0xff8c2e,0xb37dff]), 22, {speed:6, life:1, gravity:2});
        candyBurst(G, new THREE.Vector3(x-0.5, 3, 0), 4);
      }, 120+i*240);
      G.completeLevel(G._warpUsed?{warp:true}:{});
    }
  }});
  G.world.addBox(x+2.5,0,0, 3,9,12,{});
  G.world.addBox(-10.5,0,0, 3,9,12,{});
  G.world.addBox(-8.75,-1.2,0, 4.5,1.2,10,{});   // hidden floor to the back wall — no untelegraphed pit behind spawn
}

// common tail for every level build
function levelFinish(G, x1, x2, theme){
  G.checkpoint.copy(G.spawnPoint);
  G.bats = makeBats(G.scene, 6, 30);
  G.amb = buildAmbience(G.scene, x1, x2);
  if(theme) buildClutter(G, x1, x2, theme);   // pass null and clutter manually when the span crosses a pit
}

// first-time coaching (owner call, Aug 2026: "teach as it goes") — one toast, at the exact moment
// the move is first NEEDED, once per save. The How to Play card is the reference; this is the teacher.
function hintOnce(G, key, msg){
  if(!G.save.hints) G.save.hints = {};
  if(G.save.hints[key]) return;
  G.save.hints[key] = 1; G.persist();
  UI.toast(msg, 4600);
}
function coachCheck(G, pl, dt){
  if(!G.levelDef || G.levelDef.district !== 'w1') return;   // District 1 is the teacher; later districts trust you
  const J = INPUT.isTouch ? 'JUMP' : 'SPACE';
  if(G.levelDef.id === 'w1l1'){
    if(!pl.grounded){ pl._airT = (pl._airT||0) + dt; if(pl._airT > 0.35) hintOnce(G, 'dbl', '👟 Press '+J+' again IN THE AIR — Pip can DOUBLE-JUMP!'); }
    else pl._airT = 0;
    if(!G.save.hints || !G.save.hints.bonk){
      for(const e of G.ents.list){ if(e.isEnemy && !e.dead && e.group && Math.abs(e.group.position.x - pl.pos.x) < 6){
        hintOnce(G, 'bonk', '🎃 Jump ON enemies to bonk them — or press '+(INPUT.isTouch?'SPIN':'J')+' to whack!'); break; } }
    }
  }
  if(!G.save.hints || !G.save.hints.gap){
    for(const p of (G.pits||[])){ const d = p.x1 - pl.pos.x; if(d > 0 && d < 4){
      hintOnce(G, 'gap', '🕳️ A gap! HOLD '+J+' for a big hop — and you can jump AGAIN mid-air.'); break; } }
  }
}
function updateLevelCommon(G, dt){
  updateBats(G.bats, dt);
  updateAmbience(G.amb, G.time);
  if(G.lvlPortal) G.lvlPortal.material.opacity = 0.32+Math.sin(G.time*3)*0.12;
  const pl = G.player;
  if(!pl) return;
  pitImpactCheck(G, pl, dt);
  coachCheck(G, pl, dt);
  let prompt = null;
  for(const c of (G.coffins||[])){
    if(!c.opened && c.group.position.distanceTo(pl.pos)<2.8){ prompt={kind:'coffin', label:c.promptLabel||'⚰️ Open the cursed coffin...?', coffin:c}; break; }
  }
  if(!prompt) for(const s of G.signs){
    if(Math.hypot(s.x-pl.pos.x, s.z-pl.pos.z)<2.6){ prompt={kind:'sign', label:'📖 Read sign', sign:s}; break; }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge){
    if(prompt.kind==='coffin') prompt.coffin.open(G);
    else UI.dialogue('🪧', prompt.sign.text);
  }
}

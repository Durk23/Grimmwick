// ============ HUB — Grimmwick town square ============
const WORLDS = [
  {key:'w1', name:'Pumpkin Patch',  sub:'The Harvest District', guardian:'The Pumpkin King', angle: -0.62, color:PAL.pumpkin, open:true},
  {key:'w2', name:'Ravenmoor Cemetery', sub:'The Silent District', guardian:'Mossgrave, the Tombstone Titan', angle: -1.42, color:0x9fe066, open:false, req:'w1'},
  {key:'w3', name:'Witchwood',      sub:'The Wild District',    guardian:'Broomhilda the Broom Witch', angle: Math.PI+1.42, color:0xb37dff, open:false, req:'w2'},
  {key:'w4', name:'Ghost Harbor',   sub:'The Dried-Up District',   guardian:'Captain Wraith',   angle: Math.PI+0.62, color:0x63e6e2, open:false, req:'w3'},
  {key:'w5', name:'Cursed Castle',  sub:'Grimm\'s Keep',        guardian:'Grimm, the Forgotten Guest', angle: Math.PI, color:0xff5e7a, open:false, req:'w4'},
];

function buildHouse(x,z,rotY,w,h,c1,c2,winColor){
  const g = new THREE.Group();
  const base = mesh('box',[w,h,w*0.8], mat(c1)); base.position.y=h/2;
  // crooked upper floor
  const up = mesh('box',[w*1.08,h*0.6,w*0.84], mat(c2)); up.position.y=h+h*0.3; up.rotation.y=rand(-0.05,0.05); up.rotation.z=rand(-0.04,0.04);
  // roof
  const roof = mesh('cone',[w*0.95,h*0.85,4], mat(PAL.roof)); roof.position.y=h*1.6+h*0.42; roof.rotation.y=Math.PI/4; roof.rotation.z=rand(-0.06,0.06);
  // chimney (tagged so the hub can hang smoke off its world position after placement)
  const chim = mesh('box',[0.3,0.8,0.3], mat(c2)); chim.position.set(w*0.25, h*1.8, 0); chim.userData.chimTop=true;
  g.add(base,up,roof,chim);
  // glowing windows (tagged glow — the hub extracts them live so baking the house doesn't kill their night-glow)
  const wm = emat(winColor, winColor, 1);
  for(let i=0;i<2;i++){
    const win = mesh('box',[0.42,0.5,0.05], wm); win.userData.glow=true;
    win.position.set(-w/4+i*w/2, h*0.55, w*0.4+0.01);
    g.add(win);
    const win2 = mesh('box',[0.36,0.44,0.05], wm); win2.userData.glow=true;
    win2.position.set(-w/4+i*w/2, h*1.28, w*0.42+0.01);
    win2.rotation.copy(up.rotation);
    g.add(win2);
  }
  const door = mesh('box',[0.55,0.9,0.06], mat(0x33254a)); door.position.set(0,0.45,w*0.4+0.02);
  g.add(door);
  g.position.set(x,0,z); g.rotation.y=rotY;
  return g;
}
function deadTree(x,z,s=1){
  const g = new THREE.Group();
  const trunk = mesh('cyl',[0.14*s,0.22*s,2.4*s,6], mat(0x241a33)); trunk.position.y=1.2*s; trunk.rotation.z=rand(-0.12,0.12);
  g.add(trunk);
  for(let i=0;i<3;i++){
    const br = mesh('cyl',[0.03*s,0.08*s,1.3*s,5], mat(0x241a33));
    br.position.set(rand(-0.3,0.3)*s, (1.8+i*0.35)*s, rand(-0.3,0.3)*s);
    br.rotation.z = rand(0.5,1.1)*(i%2?1:-1);
    br.rotation.x = rand(-0.5,0.5);
    g.add(br);
  }
  g.position.set(x,0,z);
  return g;
}
function fenceRun(g, x1,z1,x2,z2,seg){
  for(let i=0;i<=seg;i++){
    const t=i/seg;
    const post = mesh('box',[0.12,0.9,0.12], mat(PAL.woodD));
    post.position.set(lerp(x1,x2,t), 0.45, lerp(z1,z2,t));
    post.rotation.z=rand(-0.08,0.08);
    g.add(post);
  }
  const rail = mesh('box',[Math.hypot(x2-x1,z2-z1),0.08,0.06], mat(PAL.wood));
  rail.position.set((x1+x2)/2, 0.62, (z1+z2)/2);
  rail.rotation.y = -Math.atan2(z2-z1, x2-x1);
  g.add(rail);
}
function pumpkinDeco(x,z,s=1,lit=false){
  const g = new THREE.Group();
  const body = mesh('sph',[0.4*s,9,7], mat(PAL.pumpkin)); body.position.y=0.32*s; body.scale.set(1.15,0.85,1.15);
  const stem = mesh('cyl',[0.05*s,0.08*s,0.2*s,5], mat(PAL.stem)); stem.position.y=0.68*s;
  g.add(body,stem);
  if(lit){
    const fm = emat(0xffe08a,0xffb02e,1);
    const eL = mesh('cone',[0.07*s,0.1*s,3], fm); eL.position.set(-0.14*s,0.4*s,0.36*s);
    const eR = eL.clone(); eR.position.x=0.14*s;
    const mo = mesh('box',[0.2*s,0.05*s,0.04], fm); mo.position.set(0,0.26*s,0.38*s);
    g.add(eL,eR,mo);
  }
  g.position.set(x,0,z);
  return g;
}

// detach userData.glow / userData.live tagged meshes from a placed group, preserving their world
// transforms — the remaining (non-emissive) group can then be baked without killing self-glow or animation refs
function extractLive(group){
  group.updateMatrixWorld(true);
  const out=[];
  group.traverse(o=>{ if(o.isMesh && (o.userData.glow || o.userData.live)) out.push(o); });
  const p=new THREE.Vector3(), q=new THREE.Quaternion(), sc=new THREE.Vector3();
  for(const o of out){
    o.matrixWorld.decompose(p,q,sc);
    o.parent.remove(o);
    o.position.copy(p); o.quaternion.copy(q); o.scale.copy(sc);
  }
  return out;
}

function buildHub(G){
  const S = G.scene;
  const R = 26; // town radius
  // ground: big cobble disc + outer grass
  const ground = mesh('cyl',[R,R,1,28], mat(PAL.path)); ground.position.y=-0.5; S.add(ground);
  G.world.addBox(0,-1,0, R*2,1,R*2,{});
  const outer = mesh('cyl',[R+22,R+22,0.8,24], mat(PAL.ground)); outer.position.y=-0.62; S.add(outer);
  // cobble detail circles
  const deco = new THREE.Group();
  for(let i=0;i<26;i++){
    const c = mesh('cyl',[rand(0.4,0.9),rand(0.4,0.9),0.04,7], mat(0x554478));
    const a=rand(TAU), r=rand(3,R-2);
    c.position.set(Math.cos(a)*r, 0.02, Math.sin(a)*r);
    deco.add(c);
  }
  // ---- THE EVERFLAME (story centerpiece — currently stolen/dim) ----
  const plinthG = new THREE.Group();
  const plinth = mesh('cyl',[2.6,3.1,1.1,10], mat(0x3d2f5c)); plinth.position.y=0.55; plinthG.add(plinth);
  const bowl = mesh('cyl',[1.9,1.3,1,10], mat(0x322550)); bowl.position.y=1.6; plinthG.add(bowl);
  // giant carved jack-o-lantern brazier, hollow & dark
  const jack = mesh('sph',[1.5,12,10], emat(0xc7803a, 0x7a4a10, 0.35)); jack.position.y=2.9; jack.scale.set(1.15,0.9,1.15); plinthG.add(jack);
  const fm = emat(0x453035, 0x221a20, 0.4);
  const jeL = mesh('cone',[0.3,0.42,3], fm); jeL.position.set(-0.55,3.15,1.32); plinthG.add(jeL);
  const jeR = jeL.clone(); jeR.position.x=0.55; plinthG.add(jeR);
  const jmo = mesh('box',[1.1,0.2,0.1], fm); jmo.position.set(0,2.6,1.4); plinthG.add(jmo);
  // tiny sad ember floating inside
  G.hubEmber = mesh('sph',[0.16,8,6], emat(0xff7b2e,0xff7b2e,1)); G.hubEmber.position.set(0,3.1,0); plinthG.add(G.hubEmber);
  if(G.save.embers>=5){
    // THE EVERFLAME WHOLE — after the finale the town's heart properly BURNS (the ending's promise, kept at home)
    const fl = new THREE.Mesh(geo('cone',0.85,2.1,9), new THREE.MeshLambertMaterial({color:0xffa050, emissive:0xff8a3a, emissiveIntensity:1.1, transparent:true, opacity:0.94}));
    fl.position.set(0,4.0,0); plinthG.add(fl);
    const flIn = new THREE.Mesh(geo('cone',0.45,1.4,7), new THREE.MeshLambertMaterial({color:0xfff2c4, emissive:0xffd98a, emissiveIntensity:1.4}));
    flIn.position.set(0,3.85,0); plinthG.add(flIn);
    G.hubEmber = fl;                                   // the pulse target becomes the big flame
    // and the great jack-o'-lantern's face finally lights warm (it was dark and sad all game)
    jeL.material = emat(0xffe08a, 0xffb02e, 1); jeR.material = jeL.material; jmo.material = jeL.material;

    // ---- GRIMM, THE NIGHT-WATCHMAN — the ending's promise, standing right there by the flame ----
    const grimm = new THREE.Group();
    const gm = new THREE.MeshLambertMaterial({color:0x5a5578, emissive:0xff9a50, emissiveIntensity:0.28});
    const hood = new THREE.Mesh(geo('sph',0.52,11,9), gm); hood.scale.set(1,1.25,0.9); hood.position.y=1.05; grimm.add(hood);
    const cowl = new THREE.Mesh(geo('cone',0.56,0.9,9), gm); cowl.position.y=1.45; grimm.add(cowl);
    const robe = new THREE.Mesh(geo('cone',0.62,1.3,9), gm); robe.position.y=0.55; grimm.add(robe);
    const geL = mesh('sph',[0.09,7,6], emat(0xffb46a,0xff9a3a,1)); geL.position.set(-0.17,1.12,0.42);
    const geR = geL.clone(); geR.position.x=0.17; grimm.add(geL,geR);
    const lampArm = new THREE.Group();
    const pole = mesh('cyl',[0.03,0.03,0.7,5], mat(0x3a3448)); pole.rotation.z=0.9; pole.position.set(0.5,1.05,0); lampArm.add(pole);
    const lamp = mesh('box',[0.22,0.3,0.22], mat(0x2a2438)); lamp.position.set(0.82,0.85,0); lampArm.add(lamp);
    const lampGlow = mesh('sph',[0.09,7,6], emat(0xffd98a,0xffb02e,1.3)); lampGlow.position.copy(lamp.position); lampArm.add(lampGlow);
    grimm.add(lampArm);
    grimm.position.set(-4.6, 0.1, 6.2); grimm.rotation.y = 0.7;   // across the square from the Mayor, lantern toward the flame
    S.add(grimm);
    G.hubGrimm = grimm;
    G.ents.add({ dead:false, cull:false, group:new THREE.Group(), t:rand(0,9), update(dt){
      this.t += dt;
      grimm.position.y = 0.1 + Math.sin(this.t*1.1)*0.05;       // the gentle watchman sway
      lampArm.rotation.z = Math.sin(this.t*1.4)*0.08;           // lantern swings softly
      // FESTIVAL FIREWORKS — bursts over the rooftops all night long
      if(!this._fw || this.t > this._fw){
        this._fw = this.t + rand(1.8, 3.2);
        G.fx.spawn(new THREE.Vector3(rand(-18,18), rand(13,19), rand(-16,-6)),
          pick([0xff5ea8,0x63e6e2,0xffd23f,0xff8c2e,0xb37dff,0x9fe066]), 22, {speed:5.5, life:1.1, gravity:2.5, size:1.1});
      }
    }});
  }
  G.hubEmberLight = new THREE.PointLight(0xff8c3e, 45, 15); G.hubEmberLight.position.set(0,3.4,0); plinthG.add(G.hubEmberLight);
  S.add(plinthG);
  G.world.addMesh(plinth); G.world.addMesh(bowl);
  G.world.addBox(0,2.1,0, 2.4,1.8,2.4,{});

  // ---- houses ring (bodies BAKED into deco; windows extracted live so they keep their glow) ----
  const houseCols = [[0x4a3566,0x5c4380],[0x3d4a66,0x4a5c80],[0x59396b,0x6b4580],[0x445536,0x556b45]];
  G.hubWindows = [];            // a few get a cloned material for night-flicker micro-motion
  const chimneyTips = [];       // world positions for chimney smoke
  for(let i=0;i<9;i++){
    const a = (i/9)*TAU + 0.22;
    // leave gaps at gate angles
    let skip=false;
    for(const w of WORLDS){ if(Math.abs(angleLerp(0, w.angle-a, 1))<0.34) skip=true; }
    if(skip) continue;
    const r = R+6.5;
    const [c1,c2] = pick(houseCols);
    const h = buildHouse(Math.sin(a)*r, Math.cos(a)*r, -a+Math.PI, rand(3.2,4.4), rand(2.6,3.4), c1, c2, pick([PAL.window,0xffa04a,0x9fe0ff]));
    for(const wm of extractLive(h)){ S.add(wm); G.hubWindows.push(wm); }
    h.traverse(o=>{ if(o.userData.chimTop){ const wp=new THREE.Vector3(); o.getWorldPosition(wp); wp.y+=0.5; chimneyTips.push(wp); } });
    deco.add(h);                // body/roof/door bake to the one static mesh
  }
  // clone materials on 3 windows so flickering them can't touch the shared emat cache
  for(let i=0;i<Math.min(3,G.hubWindows.length);i++){ const w=G.hubWindows[i*2%G.hubWindows.length]; w.material=w.material.clone(); w.userData.flick=rand(9); }
  // ---- lamps (pole/cage baked; bulb live for glow) ----
  G.hubLamps = [];
  const lampPos = [];
  for(let i=0;i<5;i++){
    const a = (i/5)*TAU+0.5;
    const g = new THREE.Group();
    const pole = mesh('cyl',[0.09,0.13,3.1,6], mat(0x241c38)); pole.position.y=1.55; crook(pole,0.04);
    const lant = mesh('box',[0.5,0.55,0.5], mat(0x241c38)); lant.position.y=3.15;
    const bulb = mesh('sph',[0.17,7,6], emat(PAL.window,PAL.window,1)); bulb.position.y=3.15; bulb.userData.glow=true;
    g.add(pole,lant,bulb);
    g.position.set(Math.sin(a)*12, 0, Math.cos(a)*12);
    for(const b of extractLive(g)) S.add(b);
    deco.add(g);
    lampPos.push(new THREE.Vector3(g.position.x, 3.25, g.position.z));
    G.world.addBox(g.position.x, 0, g.position.z, 0.35,3,0.35,{});
    if(i<3){
      const l = new THREE.PointLight(0xffc95e, 55, 13);
      l.position.set(g.position.x, 3.2, g.position.z);
      S.add(l);
      G.hubLamps.push(l);
    }
  }
  // ---- deco: trees, pumpkins, fences, hay ----
  for(let i=0;i<10;i++){
    const a=rand(TAU), r=rand(R+2,R+16);
    deco.add(deadTree(Math.sin(a)*r, Math.cos(a)*r, rand(0.8,1.5)));
  }
  for(let i=0;i<12;i++){
    const a=rand(TAU), r=rand(5,R-3);
    deco.add(pumpkinDeco(Math.sin(a)*r, Math.cos(a)*r, rand(0.7,1.3), Math.random()<0.5));
  }
  // (deco bakes ONCE at the end of buildHub — gates + the festival dressing below join it first)

  // ---- the five district gates ----
  G.gates = [];
  for(const w of WORLDS){
    const g = new THREE.Group();
    const x = Math.sin(w.angle)*(R-1.2), z = Math.cos(w.angle)*(R-1.2);
    const beaten = G.save.worlds[w.key];
    const open = w.open || (w.req && G.save.worlds[w.req]) || false;   // a district opens once you've freed the previous guardian
    // arch
    const pL = mesh('box',[0.7,4.6,0.7], mat(0x38294f)); pL.position.set(-1.9,2.3,0);
    const pR = pL.clone(); pR.position.x=1.9;
    const top = mesh('box',[4.6,0.8,0.9], mat(0x38294f)); top.position.y=4.7; crook(top,0.03);
    g.add(pL,pR,top);
    // lantern pair — lit if beaten (district relit!)
    for(const sx of [-1.9,1.9]){
      const litc = beaten ? w.color : 0x3a3350;
      const lb = mesh('sph',[0.22,7,6], emat(litc, litc, beaten?1:0.35)); lb.position.set(sx,4.15,0.45); lb.userData.glow=true;
      g.add(lb);
    }
    if(open){
      // swirling portal
      const pm = new THREE.MeshBasicMaterial({color:w.color, transparent:true, opacity:0.35, side:THREE.DoubleSide});
      const portal = new THREE.Mesh(geo('plane',3.1,3.8), pm);
      portal.position.y=2.2; portal.userData.live=true;
      g.add(portal);
      w.portalMesh = portal;
      const ring = mesh('tor',[1.7,0.09,6,24], emat(w.color,w.color,0.9));
      ring.position.y=2.2; ring.userData.live=true; g.add(ring);
      w.ringMesh = ring;
    } else {
      // boarded up + chains
      for(let i=0;i<3;i++){
        const board = mesh('box',[3.6,0.5,0.12], mat(PAL.wood));
        board.position.set(0,1.1+i*1.1,0); board.rotation.z=rand(-0.15,0.15);
        g.add(board);
      }
      const lock = mesh('sph',[0.35,7,6], mat(0x8a8a99)); lock.position.set(0,2.2,0.3); lock.scale.set(0.8,1,0.4);
      g.add(lock);
    }
    g.position.set(x,0,z);
    g.rotation.y = w.angle+Math.PI;
    for(const lv of extractLive(g)) S.add(lv);   // lantern orbs + portal/ring stay live (glow + animation refs)
    deco.add(g);                                  // arch/boards/lock bake with the rest
    // colliders: pillars, and a trigger for open gates
    const px1 = x+Math.cos(w.angle)*(-1.9), pz1 = z-Math.sin(w.angle)*(-1.9);
    const px2 = x+Math.cos(w.angle)*(1.9), pz2 = z-Math.sin(w.angle)*(1.9);
    G.world.addBox(px1,0,pz1, 0.8,4.6,0.8,{});
    G.world.addBox(px2,0,pz2, 0.8,4.6,0.8,{});
    if(!open){
      G.world.addBox(x,0,z, 4,4,0.8,{});
    }
    G.gates.push({w, x, z, open, beaten});
  }
  // invisible town boundary
  for(let i=0;i<20;i++){
    const a=(i/20)*TAU;
    let nearGate = false;
    for(const w of WORLDS){ if(w.open && Math.abs(angleLerp(0,w.angle-a,1))<0.25) nearGate=true; }
    if(nearGate) continue;
    G.world.addBox(Math.sin(a)*(R+2.5), 0, Math.cos(a)*(R+2.5), 6,6,3, {});
  }

  // ================= FESTIVAL DRESSING (the pop pass — statics all bake into `deco`) =================
  // ---- radiating cobble paths, plaza to each district gate ----
  for(const w of WORLDS){
    const dx=Math.sin(w.angle), dz=Math.cos(w.angle);
    for(let r=4.6; r<R-1.6; r+=2.1){
      const seg = mesh('box',[2.0,0.08,2.3], mat(0x6b5aa4));
      seg.position.set(dx*r, 0.03, dz*r);
      seg.rotation.y = w.angle + rand(-0.06,0.06);
      deco.add(seg);
    }
  }
  // path-edge glow dots — merged into ONE always-bright mesh
  { const dm = new THREE.MeshBasicMaterial({color:0xffb85e}); const dots = new THREE.Group();
    for(const w of WORLDS) for(let r=6; r<R-2; r+=3.4) for(const s of [-1,1]){
      const d = new THREE.Mesh(geo('sph',0.07,5,4), dm);
      d.position.set(Math.sin(w.angle)*r + Math.cos(w.angle)*1.35*s, 0.12, Math.cos(w.angle)*r - Math.sin(w.angle)*1.35*s);
      dots.add(d);
    }
    S.add(mergeStrands(dots, dm)); }

  // ---- festival string lights lamp-to-lamp (the town is DRESSED for the festival) ----
  { const wires = new THREE.Group();
    const bulbSets = [ [new THREE.Group(), new THREE.MeshBasicMaterial({color:0xffb85e})],
                       [new THREE.Group(), new THREE.MeshBasicMaterial({color:0xff8fc8})],
                       [new THREE.Group(), new THREE.MeshBasicMaterial({color:0x8fe0ff})] ];
    for(let i=0;i<lampPos.length;i++){
      const a=lampPos[i], b=lampPos[(i+1)%lampPos.length], segs=9;
      for(let s2=0;s2<=segs;s2++){
        const t2=s2/segs, sag=Math.sin(t2*Math.PI)*1.1;
        const px=lerp(a.x,b.x,t2), py=lerp(a.y,b.y,t2)-sag, pz=lerp(a.z,b.z,t2);
        if(s2<segs){
          const t3=(s2+1)/segs, sag3=Math.sin(t3*Math.PI)*1.1;
          const qx=lerp(a.x,b.x,t3), qy=lerp(a.y,b.y,t3)-sag3, qz=lerp(a.z,b.z,t3);
          const len=Math.hypot(qx-px,qy-py,qz-pz);
          const wseg=mesh('cyl',[0.015,0.015,len,3], mat(0x1c1630));
          wseg.position.set((px+qx)/2,(py+qy)/2,(pz+qz)/2);
          wseg.lookAt(qx,qy,qz); wseg.rotateX(Math.PI/2);
          wires.add(wseg);
        }
        if(s2>0 && s2<segs){
          const [bg,bm] = bulbSets[(i+s2)%3];
          const bulb=new THREE.Mesh(geo('sph',0.09,5,4), bm);
          bulb.position.set(px,py-0.12,pz); bg.add(bulb);
        }
      }
    }
    deco.add(wires);
    for(const [bg,bm] of bulbSets) if(bg.children.length) S.add(mergeStrands(bg,bm));   // 3 candy-color bulb meshes total
  }

  // ---- EMBER BRAZIER RING around the Everflame — one per district, RELIGHTS in its color as you free its guardian ----
  G.hubBraziers = [];
  for(const w of WORLDS){
    const bx=Math.sin(w.angle)*6.4, bz=Math.cos(w.angle)*6.4;
    const bowl=mesh('cyl',[0.42,0.3,0.5,8], mat(0x3d2f5c)); bowl.position.set(bx,0.55,bz); deco.add(bowl);
    const stem=mesh('cyl',[0.12,0.18,0.6,6], mat(0x322550)); stem.position.set(bx,0.15,bz); deco.add(stem);
    G.world.addBox(bx,0,bz,0.7,1,0.7,{});
    if(G.save.worlds[w.key]){
      const flame=new THREE.Mesh(geo('cone',0.2,0.55,6), new THREE.MeshLambertMaterial({color:w.color, emissive:w.color, emissiveIntensity:1}));
      flame.position.set(bx,1.05,bz); S.add(flame);
      const halo=new THREE.Mesh(geo('sph',0.42,8,6), new THREE.MeshBasicMaterial({color:w.color, transparent:true, opacity:0.22, depthWrite:false}));
      halo.position.set(bx,1.0,bz); S.add(halo);
      G.hubBraziers.push({flame, halo, ph:rand(9)});
    } else {
      const coals=mesh('sph',[0.18,6,5], mat(0x241a33)); coals.position.set(bx,0.85,bz); coals.scale.y=0.5; deco.add(coals);
    }
  }

  // ---- market corner beside the Costume Cauldron ----
  { const stall=new THREE.Group();
    const table=mesh('box',[2.6,0.8,1.3], mat(PAL.wood)); table.position.y=0.4; stall.add(table);
    for(const sx of [-1.1,1.1]) for(const sz of [-0.5,0.5]){ const p=mesh('cyl',[0.05,0.05,2.2,5], mat(PAL.woodD)); p.position.set(sx,1.1,sz); stall.add(p); }
    const canopy=mesh('cone',[2.1,0.8,4], mat(0xc2483e)); canopy.position.y=2.5; canopy.rotation.y=Math.PI/4; stall.add(canopy);
    stall.position.set(-11.5,0,1.6); stall.rotation.y=1.05; deco.add(stall);
    G.world.addBox(-11.5,0,1.6, 2.6,1.2,1.5,{});
    const am=new THREE.MeshBasicMaterial({color:0xd8383e}); const apples=new THREE.Group();   // candy apples, merged = 1 call
    for(let i=0;i<6;i++){ const ap=new THREE.Mesh(geo('sph',0.09,6,5), am); ap.position.set(-11.5+((i%3)-1)*0.5, 0.95, 1.6+(i<3?-0.3:0.3)); apples.add(ap); }
    S.add(mergeStrands(apples, am));
    for(const [cx,cz,ry] of [[-9.6,3.4,0.4],[-12.6,4.0,1.1],[-10.4,4.4,0.8]]){ const c=mesh('box',[0.75,0.75,0.75], mat(PAL.woodD)); c.position.set(cx,0.37,cz); c.rotation.y=ry; deco.add(c); }
    const bar=mesh('cyl',[0.42,0.46,0.9,8], mat(0x5a4066)); bar.position.set(-13.2,0.45,2.6); deco.add(bar);
    G.world.addBox(-11,0,3.9, 3.2,0.9,1.6,{});
  }

  // ---- the wishing well ----
  { const wx=9.5, wz=-5.5;
    for(let i=0;i<8;i++){ const a2=i/8*TAU; const st=mesh('box',[0.42,0.55,0.3], mat(0x4a3e6e)); st.position.set(wx+Math.cos(a2)*0.75, 0.27, wz+Math.sin(a2)*0.75); st.rotation.y=-a2; deco.add(st); }
    for(const s of [-1,1]){ const p=mesh('box',[0.1,1.5,0.1], mat(PAL.woodD)); p.position.set(wx+s*0.75,1.2,wz); deco.add(p); }
    const roof=mesh('cone',[1.15,0.7,4], mat(PAL.roof)); roof.position.set(wx,2.2,wz); roof.rotation.y=Math.PI/4; deco.add(roof);
    const bar=mesh('cyl',[0.05,0.05,1.5,5], mat(PAL.wood)); bar.rotation.z=Math.PI/2; bar.position.set(wx,1.75,wz); deco.add(bar);
    const rope=mesh('cyl',[0.02,0.02,0.8,4], mat(0xc2a24f)); rope.position.set(wx,1.35,wz); deco.add(rope);
    const bucket=mesh('cyl',[0.14,0.11,0.2,7], mat(PAL.woodD)); bucket.position.set(wx,0.95,wz); deco.add(bucket);
    G.hubWellGlow=new THREE.Mesh(geo('circ',0.62,10), new THREE.MeshBasicMaterial({color:0x63e6c2, transparent:true, opacity:0.4, depthWrite:false}));
    G.hubWellGlow.rotation.x=-Math.PI/2; G.hubWellGlow.position.set(wx,0.42,wz); S.add(G.hubWellGlow);
    G.world.addBox(wx,0,wz,1.9,0.9,1.9,{});
  }

  // ---- the QUIET PROP: the festival guest book — five lines of signatures... and one line never signed ----
  { const lect=new THREE.Group();
    const post=mesh('cyl',[0.09,0.13,1.1,6], mat(PAL.woodD)); post.position.y=0.55; lect.add(post);
    const top=mesh('box',[0.85,0.07,0.62], mat(PAL.wood)); top.position.y=1.14; top.rotation.x=-0.32; lect.add(top);
    const page=mesh('box',[0.66,0.025,0.46], mat(0xe8e4d8)); page.position.y=1.19; page.rotation.x=-0.32; lect.add(page);
    for(let i=0;i<5;i++){ if(i===3) continue;   // the empty line is Grimm's — never signposted, story-readers gasp
      const ln=mesh('box',[0.4,0.012,0.035], mat(0x4a3e6e));
      ln.position.set(0, 1.20+(0.15-i*0.075)*0.95*0.31, (0.15-i*0.075)*0.95); ln.rotation.x=-0.32; lect.add(ln); }
    const quill=mesh('cone',[0.02,0.3,4], mat(0xe8e4d8)); quill.position.set(0.28,1.3,0.08); quill.rotation.z=-0.6; lect.add(quill);
    lect.position.set(-3.1,0,2.7); lect.rotation.y=Math.atan2(3.1,-2.7);
    deco.add(lect);
    G.world.addBox(-3.1,0,2.7,0.5,1.1,0.5,{});
  }

  // ---- ground clutter — every couple of units, ALL BAKED (the levels' detail law, at home) ----
  { const excl=[[0,10,2.2],[-6.5,5.5,3],[4.2,6.5,2.4],[9.5,-5.5,2.4],[-11.5,1.6,2.8],[-3.1,2.7,1.2],[0,0,4.8]];
    let placed=0;
    for(let i=0;i<240 && placed<80;i++){
      const a2=rand(TAU), r=rand(4.8,R+14);
      const x=Math.cos(a2)*r, z=Math.sin(a2)*r;
      let bad=false;
      for(const [ex,ez,er] of excl) if((x-ex)*(x-ex)+(z-ez)*(z-ez)<er*er) bad=true;
      for(const w of WORLDS){ if(Math.abs(angleLerp(0, w.angle-Math.atan2(x,z), 1))<0.13 && r>18) bad=true; }
      if(bad) continue;
      placed++;
      const kind=rand();
      if(kind<0.22){ const leaf=mesh('circ',[rand(0.3,0.55),6], mat(pick([0x8a4a2e,0x7a5a2e,0x6a3a4e]))); leaf.rotation.x=-Math.PI/2; leaf.position.set(x,0.035,z); leaf.material.side=THREE.DoubleSide; deco.add(leaf); }
      else if(kind<0.45){ const tuft=mesh('cone',[0.09,rand(0.25,0.45),4], mat(0x3f5a4a)); tuft.position.set(x,0.18,z); crook(tuft,0.25); deco.add(tuft); }
      else if(kind<0.62){ const peb=mesh('sph',[rand(0.08,0.18),5,4], mat(0x565070)); peb.position.set(x,0.06,z); peb.scale.y=0.55; deco.add(peb); }
      else if(kind<0.76){ const shr=mesh('sph',[0.09,6,5], mat(0x8a5a9e)); shr.position.set(x,0.12,z); const st2=mesh('cyl',[0.03,0.04,0.12,4], mat(0xd8d4c8)); st2.position.set(x,0.05,z); deco.add(shr); deco.add(st2); }
      else if(kind<0.9){ const hay=mesh('cyl',[0.02,0.02,rand(0.25,0.45),3], mat(0xc2a24f)); hay.rotation.z=rand(1,2); hay.rotation.y=rand(TAU); hay.position.set(x,0.05,z); deco.add(hay); }
      else { const bone=mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.05,z); deco.add(bone); }
    }
    // a lost witch hat beside the Witchwood path (someone left in a hurry)
    const hat=new THREE.Group();
    const brim=mesh('cyl',[0.42,0.46,0.06,9], mat(0x3a2d55)); brim.position.y=0.04; hat.add(brim);
    const hcone=mesh('cone',[0.26,0.6,8], mat(0x3a2d55)); hcone.position.y=0.35; hcone.rotation.z=0.35; hat.add(hcone);
    const hband=mesh('cyl',[0.27,0.28,0.09,9], mat(PAL.pumpkin)); hband.position.y=0.12; hat.add(hband);
    hat.position.set(Math.sin(WORLDS[2].angle)*16.5+1.2, 0, Math.cos(WORLDS[2].angle)*16.5); deco.add(hat);
  }

  // ---- outer woods thickened + a distant glowing village on the hills ----
  for(let i=0;i<8;i++){ const a2=rand(TAU), r=rand(R+4,R+18); deco.add(deadTree(Math.sin(a2)*r, Math.cos(a2)*r, rand(0.9,1.6))); }
  { for(let i=0;i<9;i++){ const a2=(i/9)*TAU+0.3; const h=mesh('sph',[rand(9,15),9,7], mat(0x241c44)); h.position.set(Math.sin(a2)*(R+30), rand(-4,-1), Math.cos(a2)*(R+30)); h.scale.y=rand(0.35,0.5); deco.add(h); }
    const fm2=new THREE.MeshBasicMaterial({color:0xffc95e}); const fw=new THREE.Group();
    for(let i=0;i<14;i++){ const a2=rand(TAU); const wpt=new THREE.Mesh(geo('box',0.22,0.3,0.22), fm2); wpt.position.set(Math.sin(a2)*(R+26+rand(0,6)), rand(1.5,4.5), Math.cos(a2)*(R+26+rand(0,6))); fw.add(wpt); }
    S.add(mergeStrands(fw, fm2)); }   // far village windows: 1 warm mesh

  // ---- fences + crows near the spawn approach (reactive critters — they flap off) ----
  fenceRun(deco, 6.5, 11.5, 10.5, 11.5, 4);
  fenceRun(deco, -4.5, 13.5, -0.5, 13.5, 4);
  G.ents.add(new Crow(8.5, 0.75, 11.5));
  G.ents.add(new Crow(-2.5, 0.75, 13.5));

  // ---- MOG THE CAT — the town's reactive critter (scampers between three fixed spots) ----
  { const cat=new THREE.Group(); const cm=mat(0x17121f);
    const body=mesh('sph',[0.2,8,6], cm); body.scale.set(1,0.85,1.5); body.position.y=0.22; cat.add(body);
    const head=mesh('sph',[0.14,7,6], cm); head.position.set(0,0.38,0.26); cat.add(head);
    for(const s of [-1,1]){ const ear=mesh('cone',[0.05,0.12,4], cm); ear.position.set(0.07*s,0.52,0.24); cat.add(ear); }
    for(const s of [-1,1]){ const eye=mesh('sph',[0.022,4,4], emat(0xffd34d,0xffd34d,1)); eye.position.set(0.05*s,0.4,0.38); cat.add(eye); }
    const tail=mesh('cyl',[0.025,0.04,0.42,5], cm); tail.position.set(0,0.34,-0.3); tail.rotation.x=0.9; cat.add(tail);
    cat.position.set(10.8,0,-3.9);
    S.add(cat);
    G.hubCat={g:cat, tail, spots:[[10.8,-3.9],[5.2,-10.6],[13.6,1.8]], i:0, moving:false, mt:0};
  }

  // ---- chimney smoke (micro-motion — nothing in Grimmwick is perfectly still) ----
  G.hubSmoke=[];
  for(const tip of chimneyTips.slice(0,3)){
    for(let i=0;i<3;i++){
      const puff=new THREE.Mesh(geo('sph',0.16,6,5), new THREE.MeshBasicMaterial({color:0x9a8fb8, transparent:true, opacity:0.22, depthWrite:false}));
      puff.position.copy(tip); S.add(puff);
      G.hubSmoke.push({m:puff, x:tip.x, y:tip.y, z:tip.z, ph:i/3, sp:rand(0.25,0.4)});
    }
  }

  // ---- fireflies over the square + falling autumn leaves ----
  { const fg=new THREE.BufferGeometry(); const fp=[];
    for(let i=0;i<44;i++){ const a2=rand(TAU), r=rand(6,22); fp.push(Math.sin(a2)*r, rand(0.5,4), Math.cos(a2)*r); }
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
    G.hubFlies=new THREE.Points(fg, new THREE.PointsMaterial({color:0xffd9a0, size:0.14, transparent:true, opacity:0.8}));
    S.add(G.hubFlies); }
  G.hubLeaves=[];
  for(let i=0;i<12;i++){
    const lf=new THREE.Mesh(geo('circ',0.16,5), new THREE.MeshBasicMaterial({color:pick([0xd97a2e,0xb5522e,0x8a6f2e,0x7a4a8f]), side:THREE.DoubleSide}));
    lf.userData={x0:rand(-20,20), z0:rand(-20,20), y0:rand(4,9), sp:rand(0.5,1.0), ph:rand(9), sw:rand(0.8,1.8)};
    S.add(lf); G.hubLeaves.push(lf);
  }

  // ---- Mayor Boo NPC ----
  const mayor = new THREE.Group();
  const mm = new THREE.MeshLambertMaterial({color:0xf6f4ff, transparent:true, opacity:0.95});
  const mb = new THREE.Mesh(geo('sph',0.85,12,10), mm); mb.position.y=1.25; mb.scale.set(1,1.15,1);
  const mtail = new THREE.Mesh(geo('cone',0.7,1,9), mm); mtail.position.y=0.45; mtail.rotation.x=Math.PI;
  const meL = mesh('sph',[0.1,6,6], mat(0x14101f)); meL.position.set(-0.26,1.42,0.72);
  const meR = meL.clone(); meR.position.x=0.26;
  const brow = mesh('box',[0.24,0.06,0.05], mat(0xd8d4f0)); brow.position.set(-0.26,1.58,0.74); brow.rotation.z=0.2;
  const brow2 = brow.clone(); brow2.position.x=0.26; brow2.rotation.z=-0.2;
  // mayor's top hat + sash
  const hatB = mesh('cyl',[0.5,0.5,0.08,10], mat(0x241c38)); hatB.position.y=2.05;
  const hatT = mesh('cyl',[0.34,0.36,0.6,10], mat(0x241c38)); hatT.position.y=2.4;
  const band = mesh('cyl',[0.365,0.375,0.14,10], mat(PAL.pumpkin)); band.position.y=2.18;
  const sash = mesh('tor',[0.55,0.09,6,16], mat(PAL.pumpkin)); sash.position.y=1.15; sash.rotation.x=0.5; sash.rotation.z=0.6;
  const stache = mesh('box',[0.4,0.09,0.06], mat(0xd0ccec)); stache.position.set(0,1.22,0.78);
  mayor.add(mb,mtail,meL,meR,brow,brow2,hatB,hatT,band,sash,stache);
  mayor.position.set(4.2,0.35,6.5);
  S.add(mayor);
  G.mayor = mayor;
  G.mayorHome = mayor.position.clone();

  // ---- Costume Cauldron shop stall ----
  const shop = new THREE.Group();
  const table = mesh('box',[3.2,0.9,1.6], mat(PAL.wood)); table.position.y=0.45;
  for(const sx of [-1.4,1.4]) for(const sz of [-0.6,0.6]){
    const p = mesh('cyl',[0.06,0.06,2.6,5], mat(PAL.woodD)); p.position.set(sx,1.3,sz); shop.add(p);
  }
  const canopy = mesh('cone',[2.6,1,4], mat(0x8e5bd9)); canopy.position.y=3; canopy.rotation.y=Math.PI/4;
  const cauldron = mesh('sph',[0.6,10,8], mat(0x1e1830)); cauldron.position.y=1.25; cauldron.scale.set(1,0.85,1);
  const brew = mesh('cyl',[0.5,0.5,0.1,10], emat(0x7dff9e,0x7dff9e,1)); brew.position.y=1.55;
  const brewLight = new THREE.PointLight(0x7dff9e, 32, 8); brewLight.position.set(0,2,0);
  shop.add(table,canopy,cauldron,brew,brewLight);
  shop.position.set(-6.5,0,5.5);
  shop.rotation.y = 0.6;
  S.add(shop);
  G.world.addBox(-6.5,0,5.5, 3.2,1.4,1.8,{});
  G.shopPos = new THREE.Vector3(-6.5,0,5.5);
  G.brewMesh = brew;

  // ---- ambient wandering boos (harmless deco) ----
  G.hubBoos = [];
  for(let i=0;i<3;i++){
    const bg = new THREE.Group();
    const m = new THREE.MeshLambertMaterial({color:0xf2f0ff, transparent:true, opacity:0.5});
    const b = new THREE.Mesh(geo('sph',0.32,8,7), m); b.position.y=0.5;
    const tl = new THREE.Mesh(geo('cone',0.26,0.4,7), m); tl.position.y=0.15; tl.rotation.x=Math.PI;
    const e1 = mesh('sph',[0.05,5,5], mat(0x14101f)); e1.position.set(-0.1,0.56,0.28);
    const e2 = e1.clone(); e2.position.x=0.1;
    bg.add(b,tl,e1,e2);
    bg.position.set(rand(-14,14),rand(0.5,2),rand(-14,14));
    bg.userData = {a:rand(TAU), r:rand(6,15), sp:rand(0.1,0.25), yo:rand(0.5,2), t:rand(10)};
    S.add(bg);
    G.hubBoos.push(bg);
  }
  // ---- THE GOLDEN GUIDE ARROW (town tutorial) — hovers over your current objective: Mayor Boo first,
  // then glides to the next district gate. Same gold-arrow language the finale uses — "go here" ----
  { const mk = new THREE.Group();
    const arrow = new THREE.Mesh(geo('cone',0.3,0.62,6), new THREE.MeshLambertMaterial({color:0xffd23f, emissive:0xffb020, emissiveIntensity:1}));
    arrow.rotation.x = Math.PI; mk.add(arrow);
    const ring = new THREE.Mesh(geo('tor',0.44,0.05,6,18), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0.8}));
    mk.add(ring);
    mk.position.set(G.mayor.position.x, 3.6, G.mayor.position.z);
    S.add(mk);
    G.hubGuide = mk;
  }
  // ---- bats ----
  G.bats = makeBats(S, 9, 40);
  G.hubTime = 0;
  // ---- BAKE every static in the town (houses, gates, lamps, paths, market, well, clutter, woods) → one draw call ----
  S.add(bakeGroup(deco));
  // spawn
  G.spawnPoint.set(0,0.6,10);
  G.world.killY = -20;
}

function makeBats(S, n, spread){
  const bats = [];
  for(let i=0;i<n;i++){
    const g = new THREE.Group();
    const batM = emat(0x6a5a9e, 0x9a86d8, 0.75);   // emissive-lifted so the wheeling bats READ against dark skies (was near-black)
    const body = mesh('sph',[0.14,6,5], batM);
    const wL = mesh('box',[0.5,0.04,0.22], batM); wL.position.x=-0.3;
    const wR = wL.clone(); wR.position.x=0.3;
    const glow = new THREE.Mesh(geo('sph',0.28,8,7), new THREE.MeshBasicMaterial({color:0xa694e0, transparent:true, opacity:0.16, depthWrite:false}));
    g.add(body,wL,wR,glow);
    g.userData={a:rand(TAU), r:rand(8,spread), h:rand(5,11), sp:rand(0.3,0.8), t:rand(10), wL, wR};
    S.add(g);
    bats.push(g);
  }
  return bats;
}
function updateBats(bats, dt){
  if(!bats) return;
  for(const b of bats){
    const u = b.userData;
    u.t += dt; u.a += u.sp*dt;
    b.position.set(Math.cos(u.a)*u.r, u.h+Math.sin(u.t*2)*0.8, Math.sin(u.a)*u.r);
    b.rotation.y = -u.a+Math.PI;
    const flap = Math.sin(u.t*16)*0.7;
    u.wL.rotation.z = flap; u.wR.rotation.z = -flap;
  }
}

function updateHub(G, dt){
  G.hubTime += dt;
  const t = G.hubTime;
  // ember pulse
  if(G.hubEmber){
    G.hubEmber.scale.setScalar(1+Math.sin(t*3)*0.25);
    G.hubEmberLight.intensity = 36+Math.sin(t*3)*12 + (G.save.embers*15);
  }
  // lamps flicker
  G.hubLamps && G.hubLamps.forEach((l,i)=>{ l.intensity = 48+Math.sin(t*11+i*2)*7+rand(-2,2); });
  // portal spin
  for(const w of WORLDS){
    if(w.ringMesh){ w.ringMesh.rotation.z = t*1.2; w.ringMesh.scale.setScalar(1+Math.sin(t*2.4)*0.05); }
    if(w.portalMesh){ w.portalMesh.material.opacity = 0.28+Math.sin(t*3)*0.1; }
  }
  // mayor bob
  if(G.mayor){
    G.mayor.position.y = G.mayorHome.y + Math.sin(t*1.8)*0.18;
    if(G.player){
      const d = G.mayor.position.distanceTo(G.player.pos);
      if(d<8) G.mayor.rotation.y = angleDamp(G.mayor.rotation.y, Math.atan2(G.player.pos.x-G.mayor.position.x, G.player.pos.z-G.mayor.position.z), 4, dt);
    }
  }
  if(G.brewMesh) G.brewMesh.position.y = 1.55+Math.sin(t*4)*0.04;
  // ember braziers flicker in their district colors (the relight-progress ring)
  if(G.hubBraziers) for(const b of G.hubBraziers){ b.flame.scale.setScalar(1+Math.sin(t*7+b.ph)*0.18); b.halo.material.opacity=0.16+Math.sin(t*5+b.ph)*0.08; }
  // chimney smoke drifts up and fades
  if(G.hubSmoke) for(const s of G.hubSmoke){ const f=((t*s.sp)+s.ph)%1; s.m.position.set(s.x+Math.sin(t*1.6+s.ph*7)*0.25*f, s.y+f*2.6, s.z); s.m.scale.setScalar(0.6+f*1.4); s.m.material.opacity=0.26*(1-f); }
  // fireflies + falling leaves
  if(G.hubFlies) updateFireflies(G.hubFlies, t);
  if(G.hubLeaves) for(const lf of G.hubLeaves){ const u=lf.userData; const fall=((t*u.sp+u.ph)%1); lf.position.set(u.x0+Math.sin(t*1.3+u.ph)*u.sw, u.y0*(1-fall), u.z0); lf.rotation.set(Math.sin(t*2+u.ph)*1.2, t*1.5+u.ph, 0); }
  // a few windows flicker (cloned materials only — never the shared cache)
  if(G.hubWindows) for(const w of G.hubWindows){ if(w.userData.flick!==undefined) w.material.emissiveIntensity=0.85+Math.sin(t*9+w.userData.flick)*0.25; }
  // the wishing well breathes
  if(G.hubWellGlow) G.hubWellGlow.material.opacity=0.3+Math.sin(t*2.2)*0.12;
  // Mog the cat — tail sway; scampers to the next spot when approached
  if(G.hubCat){
    const c=G.hubCat; c.tail.rotation.z=Math.sin(t*3)*0.4;
    const pl2=G.player;
    if(!c.moving && pl2){
      const dx=pl2.pos.x-c.g.position.x, dz=pl2.pos.z-c.g.position.z;
      if(dx*dx+dz*dz<2.3*2.3){ c.moving=true; c.i=(c.i+1)%c.spots.length; c.mt=0; AUDIO.tone && AUDIO.tone({f:880,f2:1240,type:'sine',t:0.12,vol:0.07}); }
    }
    if(c.moving){
      const [tx,tz]=c.spots[c.i]; c.mt+=dt;
      const dx=tx-c.g.position.x, dz=tz-c.g.position.z, d=Math.hypot(dx,dz);
      if(d<0.15){ c.moving=false; c.g.position.y=0; }
      else { c.g.position.x+=dx/d*6.5*dt; c.g.position.z+=dz/d*6.5*dt; c.g.position.y=Math.abs(Math.sin(c.mt*14))*0.28; c.g.rotation.y=Math.atan2(dx,dz); }
    }
  }
  // the golden guide arrow: over Mayor Boo until you've met him, then it glides to the next district gate
  if(G.hubGuide){
    let tx=null, ty=0, tz=0;
    if(!G.save.metMayor && G.mayor){ tx=G.mayor.position.x; ty=3.6; tz=G.mayor.position.z; }
    else {
      const next = G.gates && G.gates.find(gt=>gt.open && !G.save.worlds[gt.w.key]);
      if(next){ tx=next.x*0.9; ty=6.2; tz=next.z*0.9; }   // pulled slightly toward town so it reads from the square
    }
    if(tx===null){ G.hubGuide.visible=false; }
    else {
      G.hubGuide.visible=true;
      G.hubGuide.position.x = damp(G.hubGuide.position.x, tx, 2.5, dt);
      G.hubGuide.position.z = damp(G.hubGuide.position.z, tz, 2.5, dt);
      G.hubGuide.position.y = ty + Math.abs(Math.sin(t*3))*0.45;
      G.hubGuide.rotation.y = t*2;
      G.hubGuide.children[1].scale.setScalar(1+Math.sin(t*6)*0.18);
    }
  }
  // ambient boos drift
  for(const b of G.hubBoos){
    const u=b.userData; u.t+=dt; u.a+=u.sp*dt;
    b.position.set(Math.cos(u.a)*u.r, u.yo+0.6+Math.sin(u.t*1.5)*0.4, Math.sin(u.a)*u.r);
    b.rotation.y = -u.a;
  }
  updateBats(G.bats, dt);

  // ---- interactions ----
  const pl = G.player;
  if(!pl) return;
  let prompt = null;
  // mayor
  if(G.mayor.position.distanceTo(pl.pos)<3.2) prompt = {kind:'mayor', label:'💬 Talk to Mayor Boo'};
  // Grimm the night-watchman (post-festival only)
  else if(G.hubGrimm && G.hubGrimm.position.distanceTo(pl.pos)<3.2) prompt = {kind:'grimm', label:'🏮 Talk to Grimm'};
  // shop
  else if(G.shopPos.distanceTo(pl.pos)<3.6) prompt = {kind:'shop', label:'🎩 Costume Cauldron'};
  else {
    for(const gate of G.gates){
      const d = Math.hypot(gate.x-pl.pos.x, gate.z-pl.pos.z);
      if(d<3.4){
        const built = (typeof LEVEL_LISTS!=='undefined') && LEVEL_LISTS.some(L=>L.some(l=>l.district===gate.w.key));
        // WALK THROUGH the portal to auto-enter — no interact press needed when you step into an open, built gate
        if(gate.open && built && d<1.7){ AUDIO.portal(); G.openMap(gate.w.key||'w1'); return; }
        prompt = !gate.open ? {kind:'locked', gate, label:'🔒 '+gate.w.name+' — locked'}
               : built ? {kind:'enter', gate, label:'🎃 Walk into '+gate.w.name}
               : {kind:'soon', gate, label:'🚧 '+gate.w.name+' — coming soon!'};
        break;
      }
    }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge){
    if(prompt.kind==='mayor'){
      UI.mayorDialogue();
      if(!G.save.metMayor){ G.save.metMayor=true; G.persist();
        UI.toast('🎃 Follow the golden arrow — WALK INTO a glowing gate to pick a level!'); }
    }
    else if(prompt.kind==='grimm'){
      const lines = [
        '"Night-watchman Grimm, at your service. First shift in four hundred years... I brought snacks."',
        '"The lanterns stay lit better when someone WANTS them lit. Who knew."',
        '"They put my name in the festival guest book. In INK, Pip. In ink."',
        '"The other spirits race each other through the districts now — the 🏮 Night Board, they call it. Loud. Wonderful."',
        '"You can always visit. That is the strangest, warmest thing anyone has ever told me."',
      ];
      G._grimmLine = ((G._grimmLine??-1)+1) % lines.length;
      UI.dialogue('🫥', lines[G._grimmLine]);
    }
    else if(prompt.kind==='shop') UI.openShop();
    else if(prompt.kind==='enter'){ AUDIO.portal(); G.openMap(prompt.gate.w.key||'w1'); }
    else if(prompt.kind==='soon') UI.toast('🚧 '+prompt.gate.w.name+' is still being built — coming very soon!');
    else if(prompt.kind==='locked') UI.toast('🔒 This district is still dark... free the other guardians first!');
  }
}

// ============ THE BEAUTIFUL MAP — a living illustrated night-map of Grimmwick ============
// buildMapScene(G, district) → {scene, camera, anchors, update, dispose}
// Overhead-tilted storybook view of the whole town: the Everflame plaza at center,
// five districts arranged around it, the district's level path winding through the
// Pumpkin Patch as glowing lantern nodes. Self-contained: never touches G.scene/G.world;
// reads only G.save (embers, worlds, levels). The DOM layer projects `anchors` for
// labels & hit-targets. Perf: everything static is baked, ≤3 point lights, no shadows.
function buildMapScene(G, district){
  district = district || 'w1';
  const sv = (G && G.save) || {};
  const embers = sv.embers || 0;
  const wSave  = sv.worlds || {};
  const lvSave = sv.levels || {};

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.night);
  scene.fog = new THREE.Fog(PAL.fog, 70, 200);

  // dispose bookkeeping — ONLY things created here (never the shared geo()/mat() caches)
  const ownGeos = [], ownMats = [];
  const bake = grp => { const m = bakeGroup(grp); ownGeos.push(m.geometry); ownMats.push(m.material); scene.add(m); return m; };
  const ownMat = m => { ownMats.push(m); return m; };

  // ---- lighting: same recipe as the game so the map reads as the SAME world ----
  scene.add(new THREE.HemisphereLight(0x9a8fd8, 0x453564, 1.45));
  const moonDir = new THREE.DirectionalLight(0xaab8ff, 1.3);
  moonDir.position.set(45, 70, -35);
  scene.add(moonDir);

  // ---- camera: tilted ~50° down — patch + town fill the frame, districts at the edges,
  // the island floating in a starry void with the moon hanging low behind the castle ----
  const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 400);
  const camBase = new THREE.Vector3(0, 70, 62);
  const camTgt  = new THREE.Vector3(0, 0.5, 2);
  camera.position.copy(camBase);
  camera.lookAt(camTgt);
  // wide screens: hold the HORIZONTAL view constant instead of the vertical one, so the
  // level board fills landscape width rather than shrinking into the middle with margins
  const fitCam = (aspect)=>{
    camera.aspect = aspect;
    const land = aspect > 1.05;
    camera.fov = land ? Math.max(30, 2*Math.atan(Math.tan(58*Math.PI/360)/aspect)*180/Math.PI) : 50;
    camTgt.set(0, 0.5, aspect > 1.8 ? 15 : (land ? 13 : 2));   // landscape looks at the board; wide phones aim lower still so the bottom node's label clears the frame
    camera.updateProjectionMatrix();
  };
  fitCam(innerWidth/innerHeight);
  const onResize = ()=>{ fitCam(innerWidth/innerHeight); };
  addEventListener('resize', onResize);

  // locked districts render darker & desaturated — tone() dims a hex toward misty blue-grey
  const _tc = new THREE.Color(), _tg = new THREE.Color();
  function tone(hex, on){
    if(on) return hex;
    _tc.set(hex);
    const l = (_tc.r+_tc.g+_tc.b)/3;
    _tg.setRGB(l*0.5, l*0.55, l*0.82);
    _tc.lerp(_tg, 0.62);
    return _tc.getHex();
  }

  // ======================= SKY =======================
  // stars (fog off so they stay crisp)
  {
    const starGeo = new THREE.BufferGeometry();
    const spts = [];
    for(let i=0;i<340;i++){
      const a=rand(TAU), b=rand(0.04,1.25), r=170;
      spts.push(Math.cos(a)*Math.cos(b)*r, Math.sin(b)*r, Math.sin(a)*Math.cos(b)*r);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(spts,3));
    ownGeos.push(starGeo);
    scene.add(new THREE.Points(starGeo, ownMat(new THREE.PointsMaterial({color:0xcfd4ff, size:0.5, sizeAttenuation:false, fog:false}))));
  }
  // big low moon hanging in the void beyond the castle (the island floats — the moon
  // sits below the map plane so the tilted-down camera still catches it at the frame top)
  {
    const mm = ownMat(new THREE.MeshBasicMaterial({color:PAL.moon, fog:false}));
    const moon = new THREE.Mesh(geo('circ',15,26), mm);
    moon.position.set(-58, -36, -150); moon.lookAt(camBase);
    const halo = new THREE.Mesh(geo('circ',23,26), ownMat(new THREE.MeshBasicMaterial({color:PAL.moon, transparent:true, opacity:0.15, fog:false, depthWrite:false})));
    halo.position.copy(moon.position).multiplyScalar(1.012); halo.lookAt(camBase);
    const crater = new THREE.Mesh(geo('circ',2.6,12), ownMat(new THREE.MeshBasicMaterial({color:0xe8dba8, fog:false})));
    crater.position.copy(moon.position).multiplyScalar(0.99); crater.position.x-=4; crater.position.y+=3.2; crater.lookAt(camBase);
    scene.add(moon, halo, crater);
  }

  // ======================= THE ISLAND =======================
  {
    const g = new THREE.Group();
    const base = mesh('cyl',[54,57,2.4,30], mat(0x2c2254)); base.position.y=-1.25; g.add(base);
    const under = mesh('cyl',[44,53,4,24], mat(0x1d1640)); under.position.y=-4.1; g.add(under);
    const tip = mesh('cone',[44,10,20], mat(0x171232)); tip.position.y=-11; tip.rotation.x=Math.PI; g.add(tip);
    // soft rim bumps so the edge isn't a perfect circle
    for(let i=0;i<12;i++){
      const a=(i/12)*TAU+rand(-0.15,0.15), r=52+rand(-2,2);
      const b = mesh('sph',[rand(4,7),8,6], mat(0x281f4c));
      b.position.set(Math.cos(a)*r, rand(-1.4,-0.9), Math.sin(a)*r);
      b.scale.y=rand(0.16,0.26);
      g.add(b);
    }
    // two tiny companion islets adrift in the void (storybook charm)
    for(const [ix,iy,iz,is] of [[-66,-13,4,3.2],[63,-17,-14,2.6]]){
      const top = mesh('cyl',[is,is*1.1,0.7,10], mat(0x2c2254)); top.position.set(ix,iy,iz);
      const bot = mesh('cone',[is*0.95,is*1.6,9], mat(0x1d1640)); bot.position.set(ix,iy-1.1,iz); bot.rotation.x=Math.PI;
      g.add(top,bot);
      g.add(deadTree(ix+rand(-1,1), iz+rand(-1,1), rand(0.7,1))); // tree lands at y0 — reparent below
      const t = g.children[g.children.length-1]; t.position.y = iy+0.3;
      if(Math.random()<0.8){ const pp = pumpkinDeco(ix-1, iz+0.8, 0.6, true); pp.position.y=iy+0.3; g.add(pp); }
    }
    bake(g);
  }

  // ======================= TOWN CENTER =======================
  // huddle of lit cottages around the Everflame plaza
  {
    const g = new THREE.Group();
    const plaza = mesh('cyl',[9.5,10.2,0.34,22], mat(PAL.path)); plaza.position.y=0.12; g.add(plaza);
    for(let i=0;i<22;i++){
      const a=rand(TAU), r=rand(2.5,8.6);
      const c = mesh('cyl',[rand(0.35,0.7),rand(0.35,0.7),0.05,7], mat(0x554478));
      c.position.set(Math.cos(a)*r, 0.31, Math.sin(a)*r);
      g.add(c);
    }
    // cottages ring — gap left toward the Patch (+z)
    const houseCols = [[0x4a3566,0x5c4380],[0x3d4a66,0x4a5c80],[0x59396b,0x6b4580]];
    for(let i=0;i<9;i++){
      const a=(i/9)*TAU+0.18;
      if(Math.abs(angleLerp(0,-a,1))<0.5) continue;   // town gate gap faces +z
      const r=7.9, [c1,c2]=pick(houseCols);
      const h = buildHouse(Math.sin(a)*r, Math.cos(a)*r, -a+Math.PI, rand(2.0,2.7), rand(1.7,2.1), c1, c2, pick([PAL.window,0xffa04a,0x9fe0ff]));
      g.add(h);
    }
    // plaza lamp posts (emissive fakes)
    for(let i=0;i<3;i++){
      const a=(i/3)*TAU+0.9;
      const pole = mesh('cyl',[0.07,0.1,2.1,5], mat(0x241c38)); pole.position.set(Math.cos(a)*5.2,1.05,Math.sin(a)*5.2); crook(pole,0.04);
      const bulb = mesh('sph',[0.16,7,6], emat(PAL.window,PAL.window,1)); bulb.position.set(Math.cos(a)*5.2,2.2,Math.sin(a)*5.2);
      g.add(pole,bulb);
    }
    // town gate arch onto the patch road
    const gL = mesh('box',[0.5,2.6,0.5], mat(0x38294f)); gL.position.set(-1.5,1.3,9.8);
    const gR = gL.clone(); gR.position.x=1.5;
    const gT = mesh('box',[3.6,0.5,0.6], mat(0x38294f)); gT.position.set(0,2.75,9.8); crook(gT,0.03);
    const gPk = pumpkinDeco(0,0,0.7,true); gPk.position.set(0,3,9.8);
    g.add(gL,gR,gT,gPk);
    // Everflame plinth + brazier (the ember itself stays live below)
    const plinth = mesh('cyl',[1.7,2.1,0.8,10], mat(0x3d2f5c)); plinth.position.y=0.55; g.add(plinth);
    const bowl = mesh('cyl',[1.25,0.85,0.7,10], mat(0x322550)); bowl.position.y=1.25; g.add(bowl);
    const jack = mesh('sph',[1,12,10], emat(0xc7803a,0x7a4a10,0.3)); jack.position.y=2.1; jack.scale.set(1.15,0.88,1.15); g.add(jack);
    bake(g);
  }
  // the Everflame ember — grows & brightens with every recovered ember (0–5)
  const emberR = 0.22 + embers*0.085;
  const emberMat = ownMat(new THREE.MeshLambertMaterial({color:0xffb35e, emissive:0xff7b2e, emissiveIntensity:1}));
  const ember = new THREE.Mesh(geo('sph',1,10,8), emberMat);
  ember.scale.setScalar(emberR);
  ember.position.set(0,2.35,0);
  const emberHaloMat = ownMat(new THREE.MeshBasicMaterial({color:0xff9a4a, transparent:true, opacity:0.16+embers*0.03, depthWrite:false}));
  const emberHalo = new THREE.Mesh(geo('sph',1,10,8), emberHaloMat);
  emberHalo.scale.setScalar(emberR*3.2);
  emberHalo.position.copy(ember.position);
  scene.add(ember, emberHalo);
  const emberLight = new THREE.PointLight(0xff8c3e, 90+embers*28, 28);
  emberLight.position.set(0,3.6,0);
  scene.add(emberLight);

  // ======================= PUMPKIN PATCH (the level path lives here) =======================
  // node states — same rule as the level-select list: done / first-undone=avail / lock
  const ids = [1,2,3,4,5].map(n=>district+'l'+n);
  let availSeen = false;
  const nodeSt = ids.map(id=>{
    if(lvSave[id] && lvSave[id].done) return 'done';
    if(!availSeen){ availSeen=true; return 'avail'; }
    return 'lock';
  });
  const bossSt = wSave[district] ? 'done' : ((lvSave[ids[4]]&&lvSave[ids[4]].done) ? 'avail' : 'lock');

  // the winding road — anchors ≥6u apart, unoccluded (tall deco stays off the path's camera side)
  const nodePos = [
    new THREE.Vector3(-10, 0, 14  ),
    new THREE.Vector3(-19, 0, 21.5),
    new THREE.Vector3( -8, 0, 29.5),
    new THREE.Vector3(  4.5,0, 32.5),
    new THREE.Vector3( 15.5,0, 26.5),
  ];
  const bossPos = new THREE.Vector3(20.5, 0, 15.5);   // spread wide — every node ≥12u from its neighbors so taps never fight
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,0,10.5), ...nodePos, bossPos,
  ], false, 'catmullrom', 0.35);
  const SAMPLES = 96;
  const roadPts = curve.getPoints(SAMPLES);   // build-time only
  const nearestIdx = p => {
    let bi=0, bd=1e9;
    for(let i=0;i<roadPts.length;i++){ const d=roadPts[i].distanceToSquared(p); if(d<bd){bd=d;bi=i;} }
    return bi;
  };
  const distToRoad = (x,z)=>{
    let bd=1e9;
    for(let i=0;i<roadPts.length;i+=2){ const dx=roadPts[i].x-x, dz=roadPts[i].z-z; const d=dx*dx+dz*dz; if(d<bd)bd=d; }
    return Math.sqrt(bd);
  };
  // the path glows as far as the adventure has reached
  let litIdx = 0;
  for(let n=0;n<5;n++) if(nodeSt[n]==='done'||nodeSt[n]==='avail') litIdx = nearestIdx(nodePos[n]);
  if(bossSt!=='lock') litIdx = roadPts.length-1;

  {
    const g = new THREE.Group();
    // tilled field, warm soil, soft dark border so the edge isn't a hard CG rectangle
    const skirt = mesh('box',[48.5,0.16,32.5], mat(0x372a50)); skirt.position.set(0,0.04,26); g.add(skirt);
    const field = mesh('box',[46,0.2,30], mat(0x523a54)); field.position.set(0,0.1,26); g.add(field);
    for(let k=0;k<10;k++){
      const row = mesh('box',[41,0.06,0.5], mat(0x452c50));
      row.position.set(rand(-1.5,1.5), 0.2, 13+k*2.9);
      g.add(row);
    }
    // grass tufts softening the field border
    for(let i=0;i<40;i++){
      const onX = Math.random()<0.5;
      const x = onX ? pick([-23.4,23.4])+rand(-0.9,0.9) : rand(-23,23);
      const z = onX ? rand(12,40.5) : pick([11.6,40.6])+rand(-0.9,0.9);
      const tuft = mesh('cone',[0.22,rand(0.5,0.95),4], mat(0x3f5a55));
      tuft.position.set(x,0.3,z); crook(tuft,0.3);
      g.add(tuft);
    }
    // the road: a continuous dirt ribbon with glowing cobbles marking progress
    for(let i=0;i<roadPts.length;i++){
      const p = roadPts[i];
      const rb = mesh('cyl',[0.85,0.85,0.05,7], mat(0x6b5589));
      rb.position.set(p.x, 0.225, p.z);
      g.add(rb);
    }
    for(let i=0;i<roadPts.length;i+=2){
      const p = roadPts[i];
      const lit = i<=litIdx;
      const c = mesh('cyl',[rand(0.3,0.42),rand(0.3,0.42),0.1,6], lit ? emat(0xffca6e,0xff9a3e,0.85) : mat(0x51447c));
      c.position.set(p.x+rand(-0.15,0.15), 0.28, p.z+rand(-0.15,0.15));
      g.add(c);
    }
    // pumpkins everywhere (clear of the road & nodes)
    for(let i=0;i<34;i++){
      const x=rand(-21,21), z=rand(12.5,39.5);
      if(distToRoad(x,z)<2.4) continue;
      if(Math.hypot(bossPos.x-x, bossPos.z-z)<4.8) continue;
      g.add(pumpkinDeco(x,z,rand(0.7,1.5), Math.random()<0.45));
      if(i%3===0){ g.add(pumpkinDeco(x+rand(-1.4,1.4), z+rand(-1.4,1.4), rand(0.5,0.8), false)); }
    }
    // fences along the field edges
    fenceRun(g, -22.5,13, -22.5,39, 9);
    fenceRun(g,  22.5,13,  22.5,40, 9);
    fenceRun(g, -22.5,40.5, -8,41.5, 5);
    fenceRun(g,  8,41.5,  22.5,40.5, 5);
    // little barn + silo (east, behind the boss knoll — never between camera and a node)
    {
      const bx=18.5, bz=33.5;
      const barn = mesh('box',[5,3.2,4], mat(0x94484f)); barn.position.set(bx,1.6,bz);
      const roof = mesh('cone',[3.9,2.4,4], mat(0x7a4056)); roof.position.set(bx,4.3,bz); roof.rotation.y=Math.PI/4;
      const door = mesh('box',[1.4,1.8,0.1], mat(0x3a2232)); door.position.set(bx,0.9,bz-2.02);
      const loft = mesh('box',[0.9,0.9,0.1], emat(PAL.window,PAL.window,1)); loft.position.set(bx,3.6,bz-2.03); loft.rotation.z=Math.PI/4;
      const silo = mesh('cyl',[1.1,1.2,3.8,10], mat(0x8a7a9e)); silo.position.set(bx-4.2,1.9,bz+0.5);
      const cap = mesh('sph',[1.15,10,7], mat(0x5c4370)); cap.position.set(bx-4.2,3.9,bz+0.5); cap.scale.y=0.6;
      g.add(barn,roof,door,loft,silo,cap);
    }
    // scarecrow (west field)
    {
      const sx=-15.5, szz=31;
      const pole = mesh('cyl',[0.07,0.09,2.2,5], mat(PAL.woodD)); pole.position.set(sx,1.1,szz); crook(pole,0.05);
      const arms = mesh('box',[1.7,0.09,0.09], mat(PAL.woodD)); arms.position.set(sx,1.7,szz); arms.rotation.z=rand(-0.08,0.08);
      const head = pumpkinDeco(sx,0,0.55,true); head.position.y=1.95; head.position.z=szz;
      g.add(pole,arms,head);
    }
    // hay bales + a couple of dead trees at the corners
    for(const [hx,hz] of [[-19,15.5],[20,37],[-9.5,37.5]]){
      const b = mesh('box',[1.5,0.9,1.1], mat(0x8f7642)); b.position.set(hx,0.55,hz); b.rotation.y=rand(TAU); g.add(b);
    }
    g.add(deadTree(-21.5,41.5,1.2), deadTree(21.8,12,1));
    // the boss knoll
    const knoll = mesh('sph',[3.6,12,9], mat(0x51406e)); knoll.position.set(bossPos.x+0.4,0,bossPos.z); knoll.scale.y=0.42; g.add(knoll);
    g.add(pumpkinDeco(bossPos.x-2.6, bossPos.z+2.4, 0.8, false), pumpkinDeco(bossPos.x+2.9, bossPos.z-2, 0.7, false));
    bake(g);
  }

  // ---- level nodes: five little lantern posts + the crowned jack-o'-lantern knoll ----
  const anchors = [];
  const flames = [];               // live pulsing bits (flame spheres + halos)
  const nodeStatics = new THREE.Group();   // all posts/pads/crown/boss pumpkin → ONE bake
  function lanternNode(p, st, i){
    const pad = mesh('cyl',[1.5,1.62,0.14,10], st==='lock' ? mat(0x4d4172) : emat(0x9a7444,0xff9a3e,0.45));
    pad.position.set(p.x,0.32,p.z); nodeStatics.add(pad);
    const pole = mesh('cyl',[0.11,0.15,2.1,6], mat(0x241c38)); pole.position.set(p.x,1.35,p.z); crook(pole,0.03); nodeStatics.add(pole);
    const arm = mesh('box',[0.7,0.1,0.1], mat(0x241c38)); arm.position.set(p.x+0.26,2.45,p.z); nodeStatics.add(arm);
    const cage = mesh('box',[0.56,0.66,0.56], mat(0x241c38)); cage.position.set(p.x+0.55,2.05,p.z); nodeStatics.add(cage);
    const fmat = ownMat(new THREE.MeshLambertMaterial({color:0xffe08a, emissive:0xffb02e, emissiveIntensity: st==='lock'?0.06:1}));
    if(st==='lock'){ fmat.color.set(0x2c2640); fmat.emissive.set(0x14101f); }
    const flame = new THREE.Mesh(geo('sph',0.24,8,6), fmat);
    flame.position.set(p.x+0.55,2.05,p.z);
    const hmat = ownMat(new THREE.MeshBasicMaterial({color:0xffb35e, transparent:true, opacity: st==='lock'?0:0.2, depthWrite:false}));
    const halo = new THREE.Mesh(geo('sph',0.95,8,6), hmat);
    halo.position.copy(flame.position);
    scene.add(flame, halo);
    flames.push({flame, halo, fmat, hmat, st, ph:rand(TAU), base:flame.position.y});
    anchors.push({id:ids[i], pos:flame.position.clone()});
  }
  nodePos.forEach((p,i)=>lanternNode(p, nodeSt[i], i));
  // boss node — crowned jack-o'-lantern on the knoll (static → baked; only its halo lives)
  {
    const ky = 1.35;
    const pk = pumpkinDeco(bossPos.x, 0, 1.7, bossSt!=='lock');
    pk.position.y = ky; pk.position.z = bossPos.z;
    nodeStatics.add(pk);
    const crownMat = bossSt==='lock' ? mat(0x6a5a30) : emat(PAL.gold,0x8a6a00,0.5);
    const band = mesh('cyl',[0.42,0.46,0.16,8], crownMat);
    band.position.set(bossPos.x, ky+1.28, bossPos.z);
    nodeStatics.add(band);
    for(let i=0;i<5;i++){
      const a=(i/5)*TAU;
      const sp = mesh('cone',[0.09,0.28,4], crownMat);
      sp.position.set(bossPos.x+Math.cos(a)*0.4, ky+1.47, bossPos.z+Math.sin(a)*0.4);
      nodeStatics.add(sp);
    }
    const bmat = ownMat(new THREE.MeshBasicMaterial({color:0xff9a3e, transparent:true, opacity: bossSt==='lock'?0:(bossSt==='done'?0.3:0.2), depthWrite:false}));
    const bhalo = new THREE.Mesh(geo('sph',1.5,10,8), bmat);
    bhalo.position.set(bossPos.x, ky+0.7, bossPos.z);
    scene.add(bhalo);
    flames.push({flame:null, halo:bhalo, fmat:null, hmat:bmat, st:bossSt==='avail'?'avail':(bossSt==='done'?'done':'lock'), ph:rand(TAU), base:ky, isBoss:true});
    anchors.push({id:'boss', pos:new THREE.Vector3(bossPos.x, ky+1.3, bossPos.z)});
  }
  bake(nodeStatics);
  // pulsing warm light rides on the active node (the "you are here" beacon)
  let beaconAt = nodePos[0];
  for(let n=0;n<5;n++) if(nodeSt[n]==='avail') beaconAt = nodePos[n];
  if(bossSt==='avail' || (bossSt==='done' && nodeSt.every(s=>s==='done'))) beaconAt = bossPos;
  // (three r165 physical falloff — intensity ≈ what you want at 1u, so big numbers for area washes)
  const beacon = new THREE.PointLight(0xffb35e, 70, 15);
  beacon.position.set(beaconAt.x, 3.2, beaconAt.z);
  scene.add(beacon);
  // soft warm wash over the whole field so the pumpkins glow
  const patchLight = new THREE.PointLight(0xff8c3e, 260, 48);
  patchLight.position.set(0, 9, 26);
  scene.add(patchLight);

  // ======================= THE FOUR OUTER DISTRICTS =======================
  const unlocked = key => key===district || !!wSave[key];
  const mists = [];
  function mistOver(x,z,r){
    const m = new THREE.Mesh(geo('circ',1,20), ownMat(new THREE.MeshBasicMaterial({color:0xbfc4e8, transparent:true, opacity:0.11, depthWrite:false})));
    m.rotation.x = -Math.PI/2;
    m.position.set(x,2.4,z);
    m.scale.setScalar(r);
    m.renderOrder = 1;
    scene.add(m);
    mists.push(m);
  }
  function relitLanterns(g, x1,z1, x2,z2){
    for(const [lx,lz] of [[x1,z1],[x2,z2]]){
      const pole = mesh('cyl',[0.08,0.11,1.9,5], mat(0x241c38)); pole.position.set(lx,0.95,lz);
      const bulb = mesh('sph',[0.17,7,6], emat(PAL.window,PAL.window,1)); bulb.position.set(lx,2,lz);
      g.add(pole,bulb);
    }
  }

  // ---- Ravenmoor Cemetery (west hill) ----
  {
    const on = unlocked('w2');
    const g = new THREE.Group();
    const cx=-33, cz=-5;
    const mound = mesh('sph',[13,14,10], mat(tone(0x2d3350,on))); mound.position.set(cx,-0.4,cz); mound.scale.set(1,0.24,0.85); g.add(mound);
    const hillY=(dx,dz)=>{ const q=1-(dx*dx)/(13*13)-(dz*dz)/(11*11); return q>0 ? 0.24*13*Math.sqrt(q)-0.4 : 0; };
    for(let i=0;i<13;i++){
      const a=rand(TAU), r=rand(2,9.5);
      const dx=Math.cos(a)*r, dz=Math.sin(a)*r*0.85;
      const slab = mesh('box',[0.75,1.05,0.2], mat(tone(0x8b86a2,on))); slab.position.set(cx+dx, hillY(dx,dz)+0.5, cz+dz); crook(slab,0.12);
      const top = mesh('cyl',[0.37,0.37,0.2,8], mat(tone(0x8b86a2,on))); top.rotation.x=Math.PI/2; top.position.set(cx+dx, hillY(dx,dz)+1.02, cz+dz);
      g.add(slab,top);
    }
    g.add(deadTree(cx-2, cz-3, 1.5), deadTree(cx+6, cz+4, 1.1), deadTree(cx-8, cz+3, 1));
    // tiny mausoleum
    const mau = mesh('box',[2.2,1.6,1.6], mat(tone(0x555a78,on))); mau.position.set(cx+3, hillY(3,-4)+0.8, cz-4);
    const ped = mesh('cone',[1.5,0.9,4], mat(tone(0x474c66,on))); ped.position.set(cx+3, hillY(3,-4)+2, cz-4); ped.rotation.y=Math.PI/4;
    g.add(mau,ped);
    if(wSave.w2) relitLanterns(g, cx-4,cz+6, cx+5,cz+1);
    bake(g);
    if(!on) mistOver(cx,cz,13);
  }

  // ---- Witchwood (east forest) ----
  {
    const on = unlocked('w3');
    const g = new THREE.Group();
    const cx=33, cz=2;
    const floor = mesh('cyl',[12,13,0.3,16], mat(tone(0x233832,on))); floor.position.set(cx,0.05,cz); g.add(floor);
    for(let i=0;i<15;i++){
      const a=rand(TAU), r=rand(1.5,10.5);
      const tx=cx+Math.cos(a)*r, tz=cz+Math.sin(a)*r*0.9;
      const th=rand(2.6,4.6);
      const trunk = mesh('cyl',[0.16,0.3,th,6], mat(tone(0x2a2138,on))); trunk.position.set(tx,th/2,tz); trunk.rotation.z=rand(-0.16,0.16); trunk.rotation.x=rand(-0.1,0.1);
      g.add(trunk);
      for(let k=0;k<2;k++){
        const c = mesh('sph',[rand(0.9,1.6),8,6], mat(tone(k?0x2e4a3d:0x43305e,on)));
        c.position.set(tx+rand(-0.7,0.7), th-0.3+k*0.9, tz+rand(-0.7,0.7));
        c.scale.y=rand(0.7,0.9);
        g.add(c);
      }
    }
    // witch hut on stilts, one green window
    const hx=cx-1, hz=cz-2;
    for(const [sx,szz] of [[-0.8,-0.6],[0.8,-0.6],[-0.8,0.6],[0.8,0.6]]){
      const st = mesh('cyl',[0.08,0.1,1.6,5], mat(tone(0x241c38,on))); st.position.set(hx+sx,0.8,hz+szz); crook(st,0.06); g.add(st);
    }
    const cabin = mesh('box',[2.4,1.6,2], mat(tone(0x3a2c4e,on))); cabin.position.set(hx,2.3,hz); crook(cabin,0.03);
    const hroof = mesh('cone',[1.9,1.9,4], mat(tone(0x2a1f3e,on))); hroof.position.set(hx,4,hz); hroof.rotation.y=Math.PI/4; crook(hroof,0.05);
    const hwin = mesh('box',[0.4,0.44,0.06], on ? emat(0x7dff9e,0x7dff9e,1) : mat(0x2a3a30)); hwin.position.set(hx,2.35,hz+1.02);
    g.add(cabin,hroof,hwin);
    // a bubbling cauldron clearing — the district's potion-glow seen from above
    const cpot = mesh('sph',[0.55,9,7], mat(tone(0x1e1830,on))); cpot.position.set(cx+5.5,0.5,cz+5.5); cpot.scale.y=0.8;
    const cbrew = mesh('cyl',[0.44,0.44,0.1,10], on ? emat(0x7dff9e,0x7dff9e,1) : emat(0x2e4a3a,0x2e6a4a,0.5)); cbrew.position.set(cx+5.5,0.82,cz+5.5);
    g.add(cpot,cbrew);
    if(wSave.w3) relitLanterns(g, cx-6,cz+7, cx+6,cz+6);
    bake(g);
    if(!on) mistOver(cx,cz,13);
  }

  // ---- Ghost Harbor (southwest — the DRIED-UP seabed, ship beached on its side) ----
  {
    const on = unlocked('w4');
    const g = new THREE.Group();
    const cx=-34, cz=24;
    const bed = mesh('cyl',[10.5,11.5,0.3,18], mat(tone(0x685f4e,on))); bed.position.set(cx,0.05,cz); g.add(bed);
    // fissure cracks
    for(let i=0;i<11;i++){
      const a=rand(TAU), r=rand(1,9.5);
      const cr = mesh('box',[rand(1.6,3.4),0.05,rand(0.12,0.2)], mat(tone(0x4a4552,on)));
      cr.position.set(cx+Math.cos(a)*r, 0.22, cz+Math.sin(a)*r);
      cr.rotation.y=rand(TAU);
      g.add(cr);
    }
    // tide-pool puddles (faint glow)
    for(let i=0;i<3;i++){
      const a=rand(TAU), r=rand(3,8);
      const tp = mesh('cyl',[rand(0.5,0.9),rand(0.5,0.9),0.06,10], on ? emat(0x2e5a58,0x63e6e2,0.35) : mat(tone(0x3a4a52,false)));
      tp.position.set(cx+Math.cos(a)*r, 0.22, cz+Math.sin(a)*r);
      g.add(tp);
    }
    // the Salty Phantom, beached on her side (one tilted hull, ribs showing, masts low)
    const sx=cx-1, szz=cz-2;
    const shipTilt = 0.5, shipYaw = 0.55;
    const hull = mesh('sph',[2.2,12,9], mat(tone(0x6a4e66,on))); hull.position.set(sx,1,szz); hull.scale.set(2.6,0.95,0.85); hull.rotation.z=shipTilt; hull.rotation.y=shipYaw;
    const deckStripe = mesh('sph',[2.24,10,8], mat(tone(0x8a6f84,on))); deckStripe.position.set(sx,1.15,szz); deckStripe.scale.set(2.5,0.35,0.8); deckStripe.rotation.z=shipTilt; deckStripe.rotation.y=shipYaw;
    g.add(hull,deckStripe);
    // exposed rib arcs at the broken stern
    for(let i=0;i<3;i++){
      const rib = mesh('tor',[0.9-i*0.12,0.07,5,10], mat(tone(0x8a86a0,on)));
      rib.position.set(sx+3.4+i*0.7, 0.9, szz+1.6+i*0.5); rib.rotation.y=shipYaw+0.3; rib.rotation.z=0.3;
      g.add(rib);
    }
    // two tilted masts w/ tattered sails
    for(const [mx,mzz,tilt] of [[sx-1.6,szz-0.7,1.0],[sx+1.4,szz+0.7,1.15]]){
      const mast = mesh('cyl',[0.09,0.11,4.6,5], mat(tone(0x4a3a5a,on))); mast.position.set(mx,1.9,mzz); mast.rotation.z=tilt;
      const sail = mesh('box',[2,1.3,0.06], mat(tone(0x9a98b4,on))); sail.position.set(mx-1.5,2.6,mzz); sail.rotation.z=tilt*0.8; crook(sail,0.1);
      g.add(mast,sail);
    }
    // dead coral
    for(let i=0;i<4;i++){
      const a=rand(TAU), r=rand(5,9.5);
      const co = mesh('cone',[0.2,rand(0.5,0.9),5], mat(tone(0x6a5a6e,on)));
      co.position.set(cx+Math.cos(a)*r, 0.45, cz+Math.sin(a)*r); crook(co,0.3);
      g.add(co);
    }
    if(wSave.w4) relitLanterns(g, cx+7,cz-5, cx-6,cz+6);
    bake(g);
    if(!on) mistOver(cx,cz,12);
  }

  // ---- Cursed Castle (far north ridge, one baleful window) ----
  const balefulPos = new THREE.Vector3(6, 10.4, -41.15);
  {
    const on = unlocked('w5');
    const g = new THREE.Group();
    const cx=6, cz=-44;
    const ridge = mesh('sph',[12,14,10], mat(tone(0x201839,on))); ridge.position.set(cx,-0.5,cz); ridge.scale.set(1.7,0.45,0.62); g.add(ridge);
    const topY=4.6;
    const keep = mesh('box',[7,8.5,5.5], mat(tone(0x191330,on))); keep.position.set(cx,topY+4,cz); g.add(keep);
    const spire = mesh('cyl',[1.2,1.6,10,8], mat(tone(0x140e26,on))); spire.position.set(cx,topY+10.5,cz-0.5);
    const scap = mesh('cone',[1.8,4,8], mat(tone(0x1d1336,on))); scap.position.set(cx,topY+17.4,cz-0.5);
    g.add(spire,scap);
    for(const [tx,tzz,th] of [[cx-4.6,cz+1.4,7],[cx+4.8,cz+1.2,8],[cx-3.6,cz-2.6,9],[cx+3.9,cz-2.8,6.4]]){
      const tw = mesh('cyl',[1,1.3,th,8], mat(tone(0x191330,on))); tw.position.set(tx,topY+th/2,tzz);
      const tc = mesh('cone',[1.5,3,8], mat(tone(0x231939,on))); tc.position.set(tx,topY+th+1.4,tzz);
      g.add(tw,tc);
    }
    const wall = mesh('box',[13,2.2,1], mat(tone(0x191330,on))); wall.position.set(cx,topY+1.1,cz+3.2); g.add(wall);
    g.add(deadTree(cx-8.5,cz+5,1.5), deadTree(cx+9.5,cz+4.5,1.3));
    if(wSave.w5) relitLanterns(g, cx-5,cz+6, cx+5,cz+6);
    bake(g);
    if(!on) mistOver(cx,cz+1,13);
  }
  // the one baleful window — always burning (Grimm is home)
  const balefulMat = ownMat(new THREE.MeshLambertMaterial({color:0xff4a3e, emissive:0xff2e1e, emissiveIntensity:1}));
  const baleful = new THREE.Mesh(geo('box',0.8,1.1,0.1), balefulMat);
  baleful.position.copy(balefulPos);
  const balefulHaloMat = ownMat(new THREE.MeshBasicMaterial({color:0xff4a3e, transparent:true, opacity:0.16, depthWrite:false}));
  const balefulHalo = new THREE.Mesh(geo('sph',1.4,8,6), balefulHaloMat);
  balefulHalo.position.copy(balefulPos);
  scene.add(baleful, balefulHalo);

  // ======================= SKY LIFE & MICRO-MOTION =======================
  // drifting clouds + their dim roaming ground shadows
  const clouds = [];
  {
    const cmat = ownMat(new THREE.MeshLambertMaterial({color:0x767aa8, transparent:true, opacity:0.32, depthWrite:false}));
    const smat = ownMat(new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.1, depthWrite:false}));
    for(let i=0;i<4;i++){
      // puffy three-lobe cloud
      const cl = new THREE.Group();
      const R = rand(2.6,3.8);
      for(const [ox,oy,os] of [[-R*1.1,0,0.72],[0,R*0.28,1],[R*1.15,-R*0.05,0.6]]){
        const puff = new THREE.Mesh(geo('sph',1,9,7), cmat);
        puff.scale.set(R*os*1.5, R*os*0.55, R*os*0.95);
        puff.position.set(ox,oy,0);
        cl.add(puff);
      }
      const sh = new THREE.Mesh(geo('circ',1,16), smat);
      sh.rotation.x=-Math.PI/2; sh.renderOrder=1;
      sh.scale.setScalar(R*2.4);
      const u = {x:rand(-55,55), z:rand(-40,8), y:rand(30,35), sp:rand(0.55,1.1)};
      cl.position.set(u.x,u.y,u.z);
      sh.position.set(u.x,0.42,u.z);
      scene.add(cl,sh);
      clouds.push({cl,sh,u});
    }
  }
  // fireflies over the Patch
  let flies;
  {
    const fg = new THREE.BufferGeometry();
    const fp=[];
    for(let i=0;i<26;i++) fp.push(rand(-19,19), rand(0.8,3.4), rand(12,40));
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
    ownGeos.push(fg);
    flies = new THREE.Points(fg, ownMat(new THREE.PointsMaterial({color:0xc8f28e, size:0.38, transparent:true, opacity:0.8})));
    scene.add(flies);
  }
  // path shimmer — sparse warm points floating just over the lit cobbles
  let shimmer=null;
  if(litIdx>0){
    const sg = new THREE.BufferGeometry();
    const spp=[];
    for(let i=0;i<=litIdx;i+=6) spp.push(roadPts[i].x, 0.55, roadPts[i].z);
    sg.setAttribute('position', new THREE.Float32BufferAttribute(spp,3));
    ownGeos.push(sg);
    shimmer = new THREE.Points(sg, ownMat(new THREE.PointsMaterial({color:0xffca6e, size:0.3, transparent:true, opacity:0.3, depthWrite:false})));
    scene.add(shimmer);
  }
  // bats wheeling around the castle spire
  const batPivot = new THREE.Group();
  batPivot.position.set(6, 12, -44);
  scene.add(batPivot);
  const bats = makeBats(batPivot, 3, 11);

  // ======================= UPDATE / DISPOSE =======================
  let t = rand(20);   // desync the sines from the game clock
  function update(dt){
    t += dt;
    // gentle storybook camera drift (±0.5u, slow)
    camera.position.set(
      camBase.x + Math.sin(t*0.10)*0.5,
      camBase.y + Math.sin(t*0.073)*0.3,
      camBase.z + Math.cos(t*0.083)*0.35
    );
    camera.lookAt(camTgt);
    // Everflame breath
    const eb = 1 + Math.sin(t*3)*0.18 + Math.sin(t*7.3)*0.06;
    ember.scale.setScalar(emberR*eb);
    emberHalo.scale.setScalar(emberR*3.2*(1+Math.sin(t*2.1)*0.12));
    emberLight.intensity = 90 + embers*28 + Math.sin(t*3)*22;
    // lantern flames
    for(let i=0;i<flames.length;i++){
      const f = flames[i];
      if(f.st==='lock') continue;
      const p = Math.sin(t*2.6+f.ph);
      if(f.st==='avail'){
        f.halo.material.opacity = 0.22 + p*0.13;
        f.halo.scale.setScalar((f.isBoss?1:0.9)*(1+p*0.18));
        if(f.fmat) f.fmat.emissiveIntensity = 1 + p*0.5;
      } else {
        f.halo.material.opacity = (f.isBoss?0.28:0.16) + p*0.05;
        if(f.fmat) f.fmat.emissiveIntensity = 0.9 + p*0.18;
      }
      if(f.flame){
        f.flame.scale.setScalar(f.st==='avail' ? 1+p*0.22 : 1);
        f.flame.position.y = f.base + Math.sin(t*1.8+f.ph)*0.03;
      }
    }
    beacon.intensity = 70 + Math.sin(t*2.6)*26;
    // baleful castle window
    balefulMat.emissiveIntensity = 0.8 + Math.sin(t*1.3)*0.2 + Math.sin(t*6.7)*0.08;
    balefulHaloMat.opacity = 0.13 + Math.sin(t*1.3)*0.05;
    // clouds drift, shadows follow
    for(let i=0;i<clouds.length;i++){
      const c = clouds[i];
      c.u.x += c.u.sp*dt;
      if(c.u.x > 62) c.u.x = -62;
      c.cl.position.x = c.u.x;
      c.cl.position.y = c.u.y + Math.sin(t*0.4+i*2)*0.5;
      c.sh.position.x = c.u.x;
    }
    // fireflies + path shimmer + mist breathing
    updateFireflies(flies, t);
    if(shimmer){ shimmer.material.opacity = 0.2 + Math.sin(t*2.2)*0.13; shimmer.position.y = Math.sin(t*1.1)*0.1; }
    for(let i=0;i<mists.length;i++){
      mists[i].rotation.z += dt*0.02;
      mists[i].material.opacity = 0.09 + Math.sin(t*0.5+i*1.7)*0.03;
    }
    updateBats(bats, dt);
  }

  function dispose(){
    removeEventListener('resize', onResize);
    for(const g of ownGeos) g.dispose();
    for(const m of ownMats) m.dispose();
    // shared geo()/mat() caches are deliberately untouched
  }

  return {scene, camera, anchors, fitCam, update, dispose};
}

// ============ PLAYER — Pip the trick-or-treater, costumes, moveset ============
const COSTUMES = {
  kid:      {name:'Just Pip',      price:0,    body:0xe8503c, accent:0x4d7bc4, hat:'none',  cape:null,     human:true, flannel:true, desc:'The smallest kid in Grimmwick. Red flannel, white tee, bravery by nature.'},
  hoodie:   {name:'Pumpkin Hoodie', price:0,   body:0xff8c42, accent:0x4a3a6e, hat:'none',  cape:null,     human:true, retired:true, desc:'Pip\'s old favorite. Hoodie by Gran, worn soft at the sleeves.'},
  ghost:    {name:'Gran\'s Ghost Sheet', price:0, body:0xf2f0ff, accent:0xd8d4f0, hat:'none', cape:null, retired:true,   desc:'The sheet Gran sewed, crooked eye-holes and all. An heirloom.'},
  pumpkin:  {name:'Pumpkin Pal',   price:150,  body:0xff8c2e, accent:0xd96a12, hat:'stem',  cape:null,     retired:true, desc:'Round, orange, and proud of it.'},
  witch:    {name:'Witchling',     price:250,  body:0x8e5bd9, accent:0x5b3a8e, hat:'witch', cape:null,     desc:'Comes with a very pointy hat.'},
  vampire:  {name:'Count Pip',     price:250,  body:0xe8e4f0, accent:0x1a1128, hat:'none',  cape:0x8f1030, desc:'Vants to collect your candy.'},
  mummy:    {name:'Wrap Star',     price:350,  body:0xd9d2b8, accent:0xb8b096, hat:'none',  cape:null,  retired:true,     desc:'It took forever to get dressed.'},
  skeleton: {name:'Mr. Bones',     price:500,  body:0x2a2438, accent:0xe8e4d8, hat:'none',  cape:null,     desc:'Rattles when he double-jumps.'},
  ember:    {name:'Ember Spirit',  price:0, pass:'Tier 5', body:0xff5ea8, accent:0xffd166, glow:0xff2e10, trail:0xff8c2e, hat:'none', cape:0xff8c2e, desc:'Season 1 Pass · Tier 5. Burns bright. Never burns out.'},
  nightstitch: {name:'NIGHTSTITCH', price:2000, body:0x2c2a6e, accent:0x63e6e2, glow:0x2a3fd0, trail:0x63e6e2, stitched:true, hat:'none', cape:0x1c1a4e, desc:'Stitched from the night sky itself. The rarest thread in Grimmwick.'},
  wolfpup:   {name:'Wolf Pup', price:450, body:0x8a6a4a, accent:0x5a4632, hat:'none', cape:null, desc:'Awooo! Fur by moonlight, zoomies by midnight.'},
  candycorn: {name:'Candy Corn', price:350, body:0xfff6e0, accent:0xff8c2e, hat:'none', cape:null, desc:'Three flavors of controversy in one costume.'},
  doctor:    {name:'Doctor Pip', price:400, body:0xf4f4f8, accent:0x63b6a8, hat:'none', cape:null, human:true, desc:'The night shift. Prescribes candy, twice daily.'},
  police:    {name:'Officer Pip', price:400, body:0x2c3a5e, accent:0xffd23f, hat:'none', cape:null, human:true, desc:'Grimmwick\'s finest. Writes tickets for insufficient spookiness.'},
  zoe:       {name:'ZOE THE WITCHLING', price:20000, character:true, pron:'her', body:0x7a4fc9, accent:0x3d2178, trail:0xb37dff, hat:'witch', cape:null, human:true, desc:'Her double-jump pops her onto the broom. Hold JUMP to glide on witch-magic.'},
  grimm:     {name:'GRIMM', price:0, character:true, pron:'him', body:0x5a5578, accent:0x3a3658, glow:0xff9a50, trail:0xff9a50, hat:'none', cape:null, desc:'The Forgotten Guest, playable. His double-jump is a SHADOW LEAP: a forward phase through danger itself.'},
};

// ============ MASKS — the wardrobe's first slot: wear any mask over ANY costume ============
// All designs ORIGINAL (folklore + generic shapes only — no film/game likenesses, ever).
const MASKS = {
  pumpkinhead: {name:'Pumpkin Head', price:400, icon:'🎃', desc:'The classic. Nobody will know it\'s you. (Everybody will know it\'s you.)'},
  hockey:      {name:'Hockey Mask',  price:250, icon:'🏒', desc:'Straight from the equipment shed. The scuffs are all original.'},
  witchhat:    {name:'Witch\'s Hat', price:300, icon:'🧙', desc:'Properly crooked, personally enchanted. Fits over anything.'},
  starcrown:   {name:'THE STAR CROWN', price:0, earned:75, icon:'👑', desc:'All 75 stars. Every level, every challenge. Cannot be bought, only EARNED.'},
};
function buildMask(key){
  const g = new THREE.Group();
  if(key==='pumpkinhead'){        // a whole jack-o'-lantern worn over the head — lobed, lit from within
    const bodyM = mat(0xff8c2e), lobeM = mat(0xf27f24);
    const pk = mesh('sph',[0.5,14,12], bodyM); pk.scale.set(1.08,0.92,1.08); g.add(pk);
    for(const s of [-1,1]){       // side lobes give it the real gourd silhouette
      const lobe = mesh('sph',[0.42,12,10], lobeM); lobe.scale.set(0.62,0.88,1.0); lobe.position.set(s*0.3,0,0); g.add(lobe);
    }
    const ridge = mesh('sph',[0.46,12,10], lobeM); ridge.scale.set(0.34,0.94,1.04); g.add(ridge);
    const stem = mesh('cyl',[0.055,0.09,0.26,6], mat(0x4a5a28)); stem.position.set(0.02,0.5,0); stem.rotation.z=0.28; g.add(stem);
    const leaf = mesh('sph',[0.09,6,5], mat(0x5a7a32)); leaf.position.set(-0.1,0.5,0.04); leaf.scale.set(1.6,0.35,0.9); leaf.rotation.z=0.4; g.add(leaf);
    // the carved face — candlelight leaking through the cuts
    const fm = emat(0xffe9a8, 0xffb02e, 1.2);
    const eL = mesh('cone',[0.12,0.17,3], fm); eL.position.set(-0.18,0.09,0.46); eL.rotation.x=0.32; g.add(eL);
    const eR = eL.clone(); eR.position.x=0.18; g.add(eR);
    const mo = mesh('box',[0.3,0.06,0.06], fm); mo.position.set(0,-0.16,0.48); g.add(mo);
    const t1 = mesh('box',[0.055,0.08,0.06], fm); t1.position.set(-0.09,-0.12,0.48); g.add(t1);
    const t2 = t1.clone(); t2.position.set(0.1,-0.2,0.48); g.add(t2);
    const t3 = mesh('box',[0.045,0.06,0.06], fm); t3.position.set(0.01,-0.12,0.48); g.add(t3);
    const innerGlow = new THREE.Mesh(geo('sph',0.2,8,7), new THREE.MeshBasicMaterial({color:0xffb84a, transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false}));
    innerGlow.position.set(0,-0.02,0.3); g.add(innerGlow);
  } else if(key==='hockey'){       // vintage goalie mask — vents, honest scuffs, wraparound straps. OUR design, no film markings
    const shellM = mat(0xf2eee2);
    const m = mesh('sph',[0.44,14,12], shellM); m.scale.set(0.98,1.14,0.55); m.position.z=0.15; g.add(m);
    const brow = mesh('sph',[0.44,12,10], shellM); brow.scale.set(0.9,0.4,0.5); brow.position.set(0,0.3,0.17); g.add(brow);
    // breathing vents — two neat columns of holes below the eyes + a chin row
    for(const [hx,hy] of [[-0.1,-0.04],[0.1,-0.04],[-0.14,-0.13],[0.14,-0.13],[-0.08,-0.22],[0.08,-0.22],[0,-0.31]]){
      const h = mesh('cyl',[0.022,0.022,0.06,6], mat(0x241f30)); h.rotation.x=Math.PI/2; h.position.set(hx,hy,0.43); g.add(h);
    }
    // deep-set eye holes
    for(const s of [-1,1]){ const e = mesh('sph',[0.085,8,7], mat(0x100d18)); e.position.set(s*0.15,0.12,0.4); e.scale.set(1.15,1.3,0.5); g.add(e); }
    // the honest scuffs — three faint scratch nicks, ours alone
    for(const [sx,sy,sr] of [[-0.22,0.02,0.5],[0.2,-0.08,-0.4],[0.12,0.24,0.25]]){
      const sc = mesh('box',[0.1,0.012,0.02], mat(0xcfc9b8)); sc.position.set(sx,sy,0.44); sc.rotation.z=sr; g.add(sc);
    }
    // straps wrap the whole way round to a back plate
    for(const s of [-1,1]){
      const st1 = mesh('box',[0.34,0.05,0.05], mat(0xff8c2e)); st1.position.set(s*0.3,0.1,-0.04); st1.rotation.y=s*0.6; g.add(st1);
      const st2 = mesh('box',[0.34,0.05,0.05], mat(0xff8c2e)); st2.position.set(s*0.3,-0.08,-0.04); st2.rotation.y=s*0.6; g.add(st2);
    }
    const back = mesh('box',[0.14,0.22,0.05], mat(0xe0dccc)); back.position.set(0,0.02,-0.36); g.add(back);
  } else if(key==='witchhat'){     // properly crooked witch's hat — layered brim, bent tip, moon-gold band
    const hm = mat(0x342647), hmD = mat(0x271c38);
    const brim = mesh('cyl',[0.56,0.6,0.05,12], hm); brim.position.y=0.32; brim.rotation.z=0.06; brim.rotation.x=0.05; g.add(brim);
    const brimRoll = mesh('tor',[0.57,0.035,6,16], hmD); brimRoll.position.y=0.33; brimRoll.rotation.x=Math.PI/2-0.05; brimRoll.rotation.z=0.06; g.add(brimRoll);
    const crown1 = mesh('cone',[0.34,0.5,10], hm); crown1.position.set(0.01,0.55,0); crown1.rotation.z=0.08; g.add(crown1);
    const crown2 = mesh('cone',[0.2,0.42,9], hm); crown2.position.set(0.06,0.86,0); crown2.rotation.z=0.3; g.add(crown2);
    const tip = mesh('cone',[0.1,0.3,8], hmD); tip.position.set(0.17,1.06,0); tip.rotation.z=0.85; g.add(tip);
    const band = mesh('cyl',[0.315,0.35,0.1,10], emat(0x8a5fd0,0x5a3fa0,0.35)); band.position.y=0.38; band.rotation.z=0.06; g.add(band);
    const buckle = mesh('box',[0.1,0.09,0.03], mat(0xffd23f)); buckle.position.set(0,0.38,0.34); g.add(buckle);
    const moon = mesh('sph',[0.045,6,5], emat(0xffd98a,0xffb02e,0.9)); moon.position.set(0.2,0.4,0.26); g.add(moon);
  }
  else if(key==='starcrown'){      // the 75-star crown — gold points, star jewels, and one floating star. Earned, never sold.
    const goldM = emat(0xffd23f, 0xb8860a, 0.6), gemM = emat(0x63e6e2, 0x2a9aa0, 0.9);
    const band = mesh('cyl',[0.34,0.36,0.14,10], goldM); band.position.y=0.42; g.add(band);
    for(let i=0;i<5;i++){
      const a = (i/5)*Math.PI*2 + 0.3;
      const pt = mesh('cone',[0.07,0.22,4], goldM); pt.position.set(Math.cos(a)*0.32, 0.58, Math.sin(a)*0.32); g.add(pt);
      if(i%2===0){ const gem = mesh('sph',[0.04,6,5], gemM); gem.position.set(Math.cos(a)*0.36, 0.44, Math.sin(a)*0.36); g.add(gem); }
    }
    const star = new THREE.Group();
    for(const rz of [0, Math.PI/2]){ const bar = mesh('box',[0.16,0.05,0.05], emat(0xffe9a8,0xffd23f,1.2)); bar.rotation.z=rz; star.add(bar); }
    for(const rz of [Math.PI/4, -Math.PI/4]){ const bar = mesh('box',[0.11,0.04,0.04], emat(0xffe9a8,0xffd23f,1)); bar.rotation.z=rz; star.add(bar); }
    star.position.set(0, 0.86, 0); g.add(star);
    const halo = new THREE.Mesh(geo('sph',0.14,8,7), new THREE.MeshBasicMaterial({color:0xffd98a, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false}));
    halo.position.copy(star.position); g.add(halo);
  }
  g.position.set(0, 1.18, 0.02);
  return g;
}

class Player {
  constructor(scene, G){
    this.G = G;
    this.scene = scene;
    this.pos = new THREE.Vector3(0,1,0);
    this.vel = new THREE.Vector3();
    this.radius = 0.42; this.height = 1.25; this.stepH = 0.45;
    this.grounded = false; this.groundCol = null;
    this.facing = 0;
    this.maxHearts = ((G.save && G.save.maxHearts) || 3) + (G.save && G.save.cozy ? 2 : 0);
    this.hearts = this.maxHearts;
    this.lastSafe = new THREE.Vector3(0,1,8);
    this.shield = false; this.shieldMesh = null;
    this.moonT = 0; this._moonFx = 0;
    this.batT = 0; this.batFlutters = 0; this.wingL = null; this.wingR = null;
    this.climbing = false;
    this.iframes = 0;
    this.blinkT = 0;
    this.zoeGlideT = 0; this._zoeDJ = false; this.zoeGliding = false;
    this.dead = false;
    this.canDouble = true;
    this.coyote = 0; this.jumpBuf = 0;
    this.pounding = false; this.poundHover = 0;
    this.attackT = 0; this.attackCD = 0;
    this.saltCD = 0;   // Salt Shaker throw cadence (persistent weapon; equipped via G.carryWeapon)
    this.hitSet = new Set();
    this.squash = 1; this.squashV = 0;
    this.animT = 0;
    this.landedFx = true;
    this.group = new THREE.Group();
    this.shadow = blobShadow(0.62);
    scene.add(this.group, this.shadow);
    this.buildRig(G.save.equipped||'kid');
  }
  buildRig(costumeKey, maskKeyOverride){
    this.costumeKey = costumeKey;
    this.grimmAura = null; this.grimmLight = null;
    this.zoeBroom = null; this.zoeBroomBack = null;
    const c = COSTUMES[costumeKey]||COSTUMES.kid;
    while(this.group.children.length) this.group.remove(this.group.children[0]);
    const body = new THREE.Group();
    // sheet/body: cone with rounded top
    const bodyMat = c.glow ? emat(c.body, c.glow, 0.4) : mat(c.body);
    const skin = mat(0xf2c096);
    if(!c.flannel){
      const sheet = mesh('cone',[0.52,1.05,9], bodyMat);
      sheet.position.y=0.62;
      body.add(sheet);
    }
    const head = mesh('sph',[0.42,12,10], c.human ? skin : bodyMat);
    head.position.y=1.18; head.scale.set(1,0.95,1);
    if(c.human){
      // hair: messy chestnut mop with a swoosh
      const hairM = mat(0x5a3a26);
      const hair = mesh('sph',[0.43,10,9], hairM); hair.position.set(0,1.32,-0.06); hair.scale.set(1,0.8,0.95);
      const swoosh = mesh('sph',[0.14,7,6], hairM); swoosh.position.set(0.12,1.6,0.18); swoosh.scale.set(1.6,0.6,0.9); swoosh.rotation.z=-0.3;
      body.add(hair, swoosh);
      if(!c.flannel){
        // hood (down) around the neck + zipper stripe on the hoodie
        const hood = mesh('tor',[0.3,0.12,7,14], mat(c.accent)); hood.position.set(0,1.0,-0.12); hood.rotation.x=1.2;
        const zip = mesh('box',[0.05,0.6,0.04], mat(c.accent)); zip.position.set(0,0.46,0.44);   // stops at the collar — it was riding up over the chin
        const pocket = mesh('box',[0.4,0.2,0.06], mat(c.accent)); pocket.position.set(0,0.34,0.48);
        body.add(hood, zip, pocket);
      }
    }
    // eyes
    const eyeM = mat(0x14101f);
    const e1 = mesh('sph',[0.075,6,6], eyeM); e1.position.set(-0.15,1.26,0.36); e1.scale.set(1,1.5,0.6);
    const e2 = e1.clone(); e2.position.x=0.15;
    // rosy cheeks
    const chM = mat(0xffb0c0);
    const ch1 = mesh('sph',[0.05,6,6], chM); ch1.position.set(-0.24,1.14,0.33); ch1.scale.set(1,0.7,0.5);
    const ch2 = ch1.clone(); ch2.position.x=0.24;
    if(c.flannel){
      // === Just Pip: OPEN red flannel over a white tee, jeans, white sneakers ===
      // faint emissive lift so the hero pops against the purple night (moonlight is a backlight)
      // brighter emissive lift so Pip clearly reads red-torso / white-chest / white-feet in the dark levels (owner readability pass)
      const red = emat(c.body, 0x9a2810, 0.7), redD = emat(0xb83828, 0x6a1810, 0.4);
      const denim = emat(c.accent, 0x233a66, 0.5), denimD = mat(0x4a6aa0);
      const white = emat(0xf8f5ee, 0x54505e, 0.55), shoeW = emat(0xf8f8fa, 0x4a4652, 0.6), shoeG = mat(0xdadce2);
      // white t-shirt — the visible center chest + a white ring at the neckline
      const tee = mesh('cyl',[0.30,0.335,0.52,10], white); tee.position.y=0.72;
      // jean hips tuck under the tee
      const hips = mesh('cyl',[0.315,0.27,0.26,10], denim); hips.position.y=0.36;
      // flannel shell wraps back + sides, open at the front (gap shows the tee)
      const shell = new THREE.Mesh(geo('cyl',0.345,0.385,0.46,12,1,true,0.62,TAU-1.24), red);
      shell.position.y=0.725;
      // plaid hint: two thin darker bands + two thin back stripes (subtle gingham)
      const band1 = new THREE.Mesh(geo('cyl',0.360,0.364,0.05,12,1,true,0.62,TAU-1.24), redD); band1.position.y=0.83;
      const band2 = new THREE.Mesh(geo('cyl',0.380,0.384,0.05,12,1,true,0.62,TAU-1.24), redD); band2.position.y=0.60;
      const bs1 = new THREE.Mesh(geo('cyl',0.352,0.392,0.46,3,1,true,Math.PI-0.55,0.14), redD); bs1.position.y=0.725;
      const bs2 = new THREE.Mesh(geo('cyl',0.352,0.392,0.46,3,1,true,Math.PI+0.41,0.14), redD); bs2.position.y=0.725;
      // open front flap panels, slightly apart — unbuttoned
      const flapL = mesh('box',[0.15,0.48,0.05], red); flapL.position.set(-0.155,0.72,0.30); flapL.rotation.y=-0.42;
      const flapR = mesh('box',[0.15,0.48,0.05], red); flapR.position.set(0.155,0.72,0.30); flapR.rotation.y=0.42;
      for(const f of [flapL,flapR]){
        const vs = mesh('box',[0.03,0.49,0.055], redD); vs.position.x=0.035;
        const hs = mesh('box',[0.16,0.03,0.055], redD); hs.position.y=0.08;
        f.add(vs,hs);
      }
      // small collar
      const collar = mesh('tor',[0.24,0.06,6,14], redD); collar.position.set(0,1.03,0); collar.rotation.x=1.35;
      // jeans legs + white Converse-style sneakers (foot groups keep the run-swing anim)
      const mkLeg = (sx)=>{
        const gp = new THREE.Group();
        const jean = mesh('cyl',[0.105,0.12,0.32,8], denim); jean.position.y=0.29;
        const cuff = mesh('cyl',[0.115,0.122,0.06,8], denimD); cuff.position.y=0.16;
        const shoe = mesh('sph',[0.135,8,6], shoeW); shoe.position.set(0,0.02,0.05); shoe.scale.set(0.9,0.75,1.35);
        const toe = mesh('sph',[0.09,6,5], shoeG); toe.position.set(0,0,0.21); toe.scale.set(1.05,0.68,0.9);
        const sole = mesh('box',[0.21,0.05,0.36], shoeG); sole.position.set(0,-0.04,0.06);
        gp.add(jean,cuff,shoe,toe,sole);
        gp.position.set(sx,0.1,0.05);
        return gp;
      };
      this.footL = mkLeg(-0.17); this.footR = mkLeg(0.17);
      // red flannel sleeves with cuffs + skin hands
      const mkArm = (sx)=>{
        const gp = new THREE.Group();
        const sleeve = mesh('sph',[0.13,7,6], red); sleeve.scale.set(1,1.42,1);
        const cuffA = mesh('cyl',[0.095,0.105,0.045,7], redD); cuffA.position.y=-0.135;
        const hand = mesh('sph',[0.09,6,5], skin); hand.position.y=-0.235;
        gp.add(sleeve,cuffA,hand);
        gp.position.set(sx,0.78,0);
        return gp;
      };
      this.armL = mkArm(-0.48); this.armR = mkArm(0.48);
      body.add(tee, hips, shell, band1, band2, bs1, bs2, flapL, flapR, collar,
               this.footL, this.footR, this.armL, this.armR);
    } else {
      // stubby feet
      const fM = c.human ? mat(0xf4f4f8) : mat(c.accent);
      this.footL = mesh('sph',[0.13,7,6], fM); this.footL.position.set(-0.18,0.1,0.05);
      this.footR = mesh('sph',[0.13,7,6], fM); this.footR.position.set(0.18,0.1,0.05);
      // arms
      this.armL = mesh('sph',[0.13,7,6], bodyMat); this.armL.position.set(-0.48,0.78,0); this.armL.scale.set(1,1.5,1);
      this.armR = mesh('sph',[0.13,7,6], bodyMat); this.armR.position.set(0.48,0.78,0); this.armR.scale.set(1,1.5,1);
      body.add(this.footL, this.footR, this.armL, this.armR);
    }
    // candy bag (attack weapon) in right hand
    this.bag = new THREE.Group();
    const sack = mesh('sph',[0.2,8,7], mat(0xc27a3f)); sack.scale.set(1,1.15,1);
    const tie = mesh('cyl',[0.055,0.075,0.12,6], mat(0x8a5228)); tie.position.y=0.24;
    this.bag.add(sack,tie);
    this.bag.position.set(0.58,0.62,0.1);
    body.add(head, e1,e2, ch1,ch2, this.bag);
    // costume extras
    if(c.hat==='witch'){
      const brim = mesh('cyl',[0.5,0.5,0.05,10], mat(0x2a1f3d)); brim.position.y=1.5;
      const cone = mesh('cone',[0.3,0.62,9], mat(0x2a1f3d)); cone.position.y=1.82; cone.rotation.z=0.12;
      body.add(brim,cone);
    }
    if(c.hat==='stem'){
      const stem = mesh('cyl',[0.06,0.1,0.25,6], mat(PAL.stem)); stem.position.y=1.62;
      const leaf = mesh('sph',[0.1,6,5], mat(PAL.stem)); leaf.position.set(0.12,1.56,0); leaf.scale.set(1.4,0.4,1);
      body.add(stem,leaf);
      // jack-o-lantern face lines
      const ridge = mesh('sph',[0.42,10,8], mat(c.accent)); ridge.position.y=1.18; ridge.scale.set(0.94,0.9,0.3); ridge.position.z=-0.12;
      body.add(ridge);
    }
    if(c.cape){
      const cape = mesh('cone',[0.55,1.1,3], mat(c.cape));
      cape.position.set(0,0.68,-0.22); cape.rotation.x=0.28;
      body.add(cape);
      const collar = mesh('cone',[0.28,0.3,6], mat(0x1a1128)); collar.position.y=1.0; collar.rotation.x=Math.PI;
      body.add(collar);
    }
    if(c.stitched){
      // glowing stitch-seams wrap the outfit
      for(let i=0;i<4;i++){
        const seam = mesh('tor',[0.4-i*0.07, 0.028, 5, 12], emat(c.accent, c.accent, 0.9));
        seam.rotation.x = Math.PI/2 + rand(-0.15,0.15);
        seam.position.y = 0.32 + i*0.26;
        body.add(seam);
      }
      const crown = mesh('tor',[0.3, 0.03, 5, 12], emat(c.accent, c.accent, 0.9));
      crown.rotation.x = Math.PI/2; crown.position.y = 1.42;
      body.add(crown);
    }
    if(costumeKey==='mummy'){
      for(let i=0;i<3;i++){
        const wrap = mesh('tor',[0.36-i*0.06, 0.045, 5, 10], mat(c.accent));
        wrap.rotation.x=Math.PI/2+rand(-0.25,0.25); wrap.position.y=0.42+i*0.32;
        body.add(wrap);
      }
    }
    if(costumeKey==='skeleton'){   // Mr. Bones, done properly: glow-in-the-dark skull face + full painted bones
      const boneM = emat(0xf0ecdd, 0x8a8570, 0.5), sockM = mat(0x0c0a14);
      // the skull face — a bone plate over the dark head, big sockets, nose slit, a proud grin
      const plate = mesh('sph',[0.4,12,10], boneM); plate.position.set(0,1.18,0.2); plate.scale.set(0.95,0.9,0.62); body.add(plate);
      const sL = mesh('sph',[0.1,7,6], sockM); sL.position.set(-0.14,1.24,0.48); body.add(sL);
      const sR = sL.clone(); sR.position.x=0.14; body.add(sR);
      const nose = mesh('cone',[0.045,0.08,3], sockM); nose.position.set(0,1.1,0.5); nose.rotation.x=-0.3; body.add(nose);
      for(let i=0;i<4;i++){ const t=mesh('box',[0.045,0.07,0.04], boneM); t.position.set(-0.105+i*0.07,0.96,0.46); body.add(t); }
      const gum = mesh('box',[0.32,0.025,0.045], sockM); gum.position.set(0,1.0,0.46); body.add(gum);
      // spine + rib cage down the front
      const spine = mesh('box',[0.05,0.62,0.04], boneM); spine.position.set(0,0.6,0.43); body.add(spine);
      for(let i=0;i<4;i++){
        const rib = mesh('tor',[0.3-i*0.045, 0.03, 5, 12], boneM);
        rib.rotation.x=Math.PI/2; rib.position.y=0.82-i*0.13; rib.scale.z=0.55; body.add(rib);
      }
      // pelvis V + femur stripes on the lower cone
      for(const s of [-1,1]){
        const hip = mesh('box',[0.05,0.2,0.04], boneM); hip.position.set(s*0.09,0.31,0.44); hip.rotation.z=s*0.5; body.add(hip);
        const femur = mesh('box',[0.05,0.24,0.04], boneM); femur.position.set(s*0.13,0.12,0.5); femur.rotation.z=s*0.12; body.add(femur);
        const knob = mesh('sph',[0.04,5,4], boneM); knob.position.set(s*0.14,0.02,0.52); body.add(knob);
      }
    }
    if(costumeKey==='wolfpup'){     // furry ears, a happy tail, and a little snout
      for(const s of [-1,1]){ const ear=mesh('cone',[0.13,0.26,5], mat(c.body)); ear.position.set(s*0.24,1.62,0); body.add(ear);
        const inner=mesh('cone',[0.06,0.13,5], mat(0xd8a87e)); inner.position.set(s*0.24,1.6,0.05); body.add(inner); }
      const snout = mesh('sph',[0.16,8,6], mat(0x9a7a58)); snout.position.set(0,1.12,0.38); snout.scale.set(1,0.7,0.9); body.add(snout);
      const nose = mesh('sph',[0.06,6,5], mat(0x14101f)); nose.position.set(0,1.15,0.5); body.add(nose);
      const tail = mesh('cone',[0.12,0.5,6], mat(c.body)); tail.position.set(0,0.5,-0.42); tail.rotation.x=1.0; body.add(tail);
    }
    if(costumeKey==='candycorn'){   // the three sacred stripes
      const band = mesh('cyl',[0.43,0.49,0.34,10], mat(0xff8c2e)); band.position.y=0.62; body.add(band);
      const tip = mesh('cone',[0.2,0.34,9], mat(0xffd23f)); tip.position.y=1.62; body.add(tip);
    }
    if(costumeKey==='doctor'){      // white coat + stethoscope + the classic head mirror
      const steth = mesh('tor',[0.22,0.03,6,14], mat(0x3a3448)); steth.position.set(0,0.98,0.1); steth.rotation.x=0.5; body.add(steth);
      const bell = mesh('cyl',[0.06,0.06,0.04,8], mat(0x9aa0aa)); bell.position.set(0.12,0.72,0.42); bell.rotation.x=Math.PI/2; body.add(bell);
      const mirror = mesh('cyl',[0.1,0.1,0.03,10], mat(0xd8dce6)); mirror.position.set(0,1.55,0.28); mirror.rotation.x=0.6; body.add(mirror);
      const strap = mesh('tor',[0.42,0.025,5,14], mat(0xf4f4f8)); strap.position.set(0,1.42,0); strap.rotation.x=1.35; body.add(strap);
      for(const [px,py] of [[-0.16,0.55],[0.16,0.55]]){ const pk=mesh('box',[0.16,0.14,0.04], mat(0xe8e8f0)); pk.position.set(px,py,0.4); body.add(pk); }   // coat pockets
    }
    if(costumeKey==='police'){      // peaked cap + gold badge — Grimmwick's finest
      const capB = mesh('cyl',[0.4,0.44,0.18,10], mat(0x22304e)); capB.position.set(0,1.52,0); body.add(capB);
      const capT = mesh('sph',[0.4,10,8], mat(0x22304e)); capT.scale.set(1,0.4,1); capT.position.set(0,1.6,0); body.add(capT);
      const brim = mesh('cyl',[0.26,0.3,0.05,10], mat(0x14101f)); brim.position.set(0,1.44,0.3); brim.rotation.x=0.12; brim.scale.z=0.6; body.add(brim);
      const cbadge = mesh('cyl',[0.07,0.07,0.03,6], mat(0xffd23f)); cbadge.position.set(0,1.54,0.4); cbadge.rotation.x=Math.PI/2; body.add(cbadge);
      const badge = mesh('cyl',[0.09,0.09,0.03,6], mat(0xffd23f)); badge.position.set(-0.18,0.85,0.42); badge.rotation.x=Math.PI/2; body.add(badge);
      const belt = mesh('cyl',[0.42,0.46,0.1,10], mat(0x14101f)); belt.position.y=0.42; body.add(belt);
      const buckle = mesh('box',[0.12,0.09,0.04], mat(0xffd23f)); buckle.position.set(0,0.42,0.44); body.add(buckle);
    }
    if(costumeKey==='zoe'){         // ZOE THE WITCHLING — braids, star belt, and the broom that earns her keep
      const braidM = mat(0x8a4a2a), tieM = mat(0xffd23f);
      for(const sx of [-1,1]){
        for(let i=0;i<3;i++){ const b=mesh('sph',[0.09-i*0.012,6,5], braidM); b.position.set(sx*0.34, 1.18-i*0.14, -0.02); body.add(b); }
        const tie=mesh('cyl',[0.045,0.05,0.05,6], tieM); tie.position.set(sx*0.34, 0.78, -0.02); body.add(tie);
      }
      const belt = mesh('tor',[0.35,0.045,5,12], mat(0x2a1f3d)); belt.position.y=0.62; belt.rotation.x=Math.PI/2; body.add(belt);
      const star = mesh('cyl',[0.09,0.09,0.03,5], emat(0xffd23f,0xb8901a,0.6)); star.position.set(0,0.62,0.42); star.rotation.x=Math.PI/2; body.add(star);
      // the broom: slung across her back on foot, underneath her in flight
      const mkBroom = ()=>{
        const g2 = new THREE.Group();
        const stick = mesh('cyl',[0.035,0.045,1.3,6], mat(0x8a5a2e)); stick.rotation.x=Math.PI/2; g2.add(stick);
        const bris = mesh('cone',[0.13,0.42,7], mat(0xc9a05a)); bris.rotation.x=-Math.PI/2; bris.position.z=-0.8; g2.add(bris);
        const band = mesh('cyl',[0.07,0.08,0.07,6], tieM); band.rotation.x=Math.PI/2; band.position.z=-0.6; g2.add(band);
        return g2;
      };
      this.zoeBroomBack = mkBroom(); this.zoeBroomBack.position.set(0,0.75,-0.3); this.zoeBroomBack.rotation.set(0.35,0.25,0.5); body.add(this.zoeBroomBack);
      this.zoeBroom = mkBroom(); this.zoeBroom.position.set(0,0.02,0.1); this.zoeBroom.visible=false; body.add(this.zoeBroom);
    }
    if(costumeKey==='grimm'){       // THE FORGOTTEN GUEST — hooded robe, ember eyes, his watch-lantern on the belt
      const trimM = mat(c.accent);
      // deep hood: swept sphere over the head + peaked cowl, rim framing the face
      const hoodB = mesh('sph',[0.46,10,9], bodyMat); hoodB.position.set(0,1.24,-0.08); hoodB.scale.set(1.04,1.12,0.95); body.add(hoodB);
      const cowl = mesh('cone',[0.42,0.6,9], bodyMat); cowl.position.set(0,1.66,-0.05); cowl.rotation.x=-0.12; body.add(cowl);
      const rim = mesh('tor',[0.34,0.07,6,14], trimM); rim.position.set(0,1.26,0.16); rim.rotation.x=1.32; body.add(rim);
      // ember eyes burn through the hood shadow (cover the standard dark eyes)
      const emE = emat(0xffb46a,0xff9a3a,1);
      const gE1 = mesh('sph',[0.085,7,6], emE); gE1.position.set(-0.15,1.26,0.38); gE1.scale.set(1,1.4,0.6); body.add(gE1);
      const gE2 = gE1.clone(); gE2.position.x=0.15; body.add(gE2);
      // rope belt + the night-watchman's tiny lantern
      const belt = mesh('tor',[0.37,0.045,5,12], mat(0x8a6a3a)); belt.position.y=0.52; belt.rotation.x=Math.PI/2; body.add(belt);
      const cage = mesh('box',[0.11,0.15,0.11], trimM); cage.position.set(-0.42,0.48,0.14);
      const lglow = mesh('sph',[0.05,6,5], emat(0xffd98a,0xffb02e,1)); lglow.position.copy(cage.position);
      const lcap = mesh('cone',[0.08,0.07,6], trimM); lcap.position.set(-0.42,0.58,0.14);
      body.add(cage,lglow,lcap);
      // tattered hem
      for(let i=0;i<5;i++){ const a=i/5*TAU+0.3; const tat=mesh('cone',[0.09,0.17,4], bodyMat); tat.position.set(Math.sin(a)*0.42,0.07,Math.cos(a)*0.42); tat.rotation.x=Math.PI; body.add(tat); }
      // THE GLOW — a breathing ember aura + a real carried light (the night-watchman brings the light with him)
      this.grimmAura = new THREE.Mesh(geo('sph',0.78,14,11),
        new THREE.MeshBasicMaterial({color:0xff9a50, transparent:true, opacity:0.13, blending:THREE.AdditiveBlending, depthWrite:false}));
      this.grimmAura.position.y=0.85; this.grimmAura.scale.set(1,1.35,1); body.add(this.grimmAura);
      this.grimmLight = new THREE.PointLight(0xff9a50, 42, 9); this.grimmLight.position.y=1.0; body.add(this.grimmLight);
    }
    // ---- THE MASK SLOT (wardrobe brick #1): any mask over any costume ----
    const mk = maskKeyOverride !== undefined ? maskKeyOverride : (this.G && this.G.save ? this.G.save.mask : null);
    if(mk && typeof MASKS !== 'undefined' && MASKS[mk]) body.add(buildMask(mk));
    // persistent-weapon tell: a little salt shaker on Pip's belt when the Salt Shaker is equipped.
    // buildRig runs on every switchArea (Player is rebuilt per area), so reading G.carryWeapon here
    // is exactly what re-arms the weapon's visible tell after crossing between levels.
    this.saltTell = null;
    if(this.G && this.G.carryWeapon==='salt'){ this.saltTell = this._makeSaltTell(); body.add(this.saltTell); }
    this.body = body;
    this.group.add(body);
  }
  _makeSaltTell(){
    const shaker = new THREE.Group();
    const glass = mesh('cyl',[0.085,0.1,0.19,8], emat(0xf4f6ff, 0xbfe0ff, 0.4));
    const saltFill = mesh('cyl',[0.07,0.085,0.11,8], emat(0xffffff, 0xffffff, 0.45)); saltFill.position.y=-0.03;
    const cap = mesh('cyl',[0.095,0.085,0.06,8], mat(0xc9ccd6)); cap.position.y=0.12;
    const knob = mesh('sph',[0.035,6,5], mat(0xd6d9e2)); knob.position.y=0.16;
    shaker.add(glass, saltFill, cap, knob);
    shaker.position.set(-0.46, 0.5, 0.14); shaker.rotation.z = 0.25;
    return shaker;
  }
  // --- persistent weapon: equip + show the belt tell WITHOUT rebuilding the rig (rebuild would orphan an active shield/wings) ---
  armWeapon(w){
    this.G.carryWeapon = w;
    this.saltCD = 0;                 // first throw is instant
    if(w==='salt' && !this.saltTell && this.body){ this.saltTell = this._makeSaltTell(); this.body.add(this.saltTell); }
  }
  // --- fling a pinch of salt forward along the facing x-direction (side-scroller) ---
  throwSalt(){
    const G = this.G;
    this.saltCD = 0.35;                              // pleasant tap-to-throw cadence
    const dir = Math.sin(this.facing) >= 0 ? 1 : -1; // +x when facing right, -x when facing left
    const x = this.pos.x + dir*0.55, y = this.pos.y + 0.72, z = this.pos.z;
    G.ents.add(new SaltPinch(G, x, y, z, dir));
    AUDIO.tone({f:1250, f2:1550, type:'sine', t:0.05, vol:0.08});
    AUDIO.noise({t:0.05, vol:0.07, fFrom:6500, fTo:3200});   // a light "shk!" shake
    G.fx.spawn(new THREE.Vector3(x,y,z), 0xffffff, 3, {speed:1.6, life:0.22, gravity:3, size:0.45});
  }
  heal(n){ this.hearts = Math.min(this.maxHearts, this.hearts+n); if(window.UI) UI.updateHUD(); }
  gainShield(){
    if(this.shield) return;
    this.shield = true;
    this.shieldMesh = new THREE.Mesh(geo('sph',0.85,12,10), new THREE.MeshLambertMaterial({color:0x63c6e6, transparent:true, opacity:0.28, emissive:0x2a7fa8, emissiveIntensity:0.4}));
    this.shieldMesh.position.y = 0.8;
    this.group.add(this.shieldMesh);
  }
  gainBat(){
    this.batT = 18;
    if(!this.wingL){
      const wm = new THREE.MeshLambertMaterial({color:0x5b3a8e, emissive:0x3d2178, emissiveIntensity:0.4, side:THREE.DoubleSide});
      this.wingL = new THREE.Mesh(geo('box',0.7,0.04,0.4), wm);
      this.wingL.position.set(-0.55,1.0,-0.15);
      this.wingR = this.wingL.clone();
      this.wingR.position.x = 0.55;
      this.body.add(this.wingL, this.wingR);
    }
  }
  loseBat(){
    this.batT = 0;
    if(this.wingL){ this.body.remove(this.wingL); this.body.remove(this.wingR); this.wingL = this.wingR = null; }
  }
  breakShield(){
    this.shield = false;
    if(this.shieldMesh){ this.group.remove(this.shieldMesh); this.shieldMesh = null; }
  }
  damage(n, fromPos){
    if(this.iframes>0 || this.dead || this.G.state!=='play') return;
    if(this.moonT>0) return; // moon rush: untouchable
    if(this.shield){
      this.breakShield();
      this.iframes = 1.2;
      AUDIO.stomp();
      this.G.camc.shake(0.2,0.3);
      this.G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.8,this.pos.z), 0x63c6e6, 16, {speed:4});
      if(window.UI) UI.toast('🛡️ Shield took the hit!');
      return;
    }
    this.hearts -= n;
    if(this.G.area!=='hub') this.G.runDamage = (this.G.runDamage||0)+n;
    if(this.G.save) this.G.save.damageLifetime = (this.G.save.damageLifetime||0) + n;   // Night Board tiebreaker
    this.iframes = 1.4;
    AUDIO.hurt();
    this.G.camc.shake(0.35, 0.4);
    if(window.UI){ UI.updateHUD(); UI.hurtFlash(); }
    if(fromPos){
      const dx=this.pos.x-fromPos.x, dz=this.pos.z-fromPos.z;
      const d=Math.hypot(dx,dz)||1;
      this.vel.x = dx/d*9; this.vel.z = dz/d*9; this.vel.y = 6;
      this.grounded=false;
    }
    this.G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+1,this.pos.z), 0xff5555, 8, {speed:3});
    if(this.hearts<=0) this.die();
  }
  die(){
    if(this.dead) return;
    this.dead = true;
    this.G.carryWeapon = null;   // carried weapon (Salt Shaker) is LOST on death — "continues till a death"
    if(this.saltTell){ if(this.saltTell.parent) this.saltTell.parent.remove(this.saltTell); this.saltTell=null; }   // clear the belt tell so it doesn't linger after respawn
    AUDIO.gameover();
    this.G.onPlayerDeath();
  }
  respawn(p){
    this.pos.copy(p);
    this.vel.set(0,0,0);
    this.hearts = this.maxHearts;
    this.dead = false;
    this.iframes = 2;
    this.pounding = false;
    this.captured = false;   // a death while inside a cannon barrel must never leave the next life frozen
    this.launchT = 0;
    if(window.UI) UI.updateHUD();
  }
  bounceOff(vy=9){ this.vel.y = vy; this.grounded=false; this.canDouble=true; this.pounding=false; }
  update(dt){
    const G = this.G;
    if(this.dead) return;
    this.animT += dt;
    if(this.iframes>0) this.iframes -= dt;
    if(this.attackCD>0) this.attackCD -= dt;
    if(this.saltCD>0) this.saltCD -= dt;

    // captured by a cannon barrel (DKC-style launch): the barrel holds our position and fires us on JUMP.
    // Skip all self-control/physics while captured; the CannonBarrel (09za_w4kit) drives pos + group.position.
    if(this.captured) return;

    // --- climbing (vines / web-nets — Mario-style) ---
    let onClimbable = null;
    for(const c of G.world.cols){
      if(c.type!=='climb') continue;
      const nx = clamp(this.pos.x, c.min.x, c.max.x), nz = clamp(this.pos.z, c.min.z, c.max.z);
      const dx = this.pos.x-nx, dz = this.pos.z-nz;
      if(dx*dx+dz*dz < this.radius*this.radius && this.pos.y+this.height > c.min.y && this.pos.y < c.max.y){
        onClimbable = c; break;
      }
    }
    const upHeld = INPUT.moveY < -0.4;
    const downHeld = INPUT.moveY > 0.4;
    if(!this.climbing && onClimbable && upHeld && !this.pounding){
      this.climbing = true;
      this.vel.set(0,0,0);
      AUDIO.tone({f:500,f2:650,type:'sine',t:0.08,vol:0.1});
    }
    if(this.climbing){
      if(!onClimbable){
        this.climbing = false;
        if(this.vel.y>0) this.vel.y = 5; // top-exit hop
      } else if(INPUT.jumpEdge){
        this.climbing = false;
        this.vel.y = 8.8;
        this.vel.x = INPUT.moveX*5;
        this.canDouble = true;
        INPUT.jumpEdge = false;
        this.jumpBuf = 0;
        AUDIO.jump();
      } else if(this.grounded && downHeld){
        this.climbing = false;
      } else {
        const climbSpeed = 4.2;
        this.vel.y = (upHeld? climbSpeed : (downHeld? -climbSpeed : 0));
        this.vel.x = INPUT.moveX*2.2;
        this.vel.z = damp(this.vel.z, 0, 8, dt);
        this.pos.z = damp(this.pos.z, (onClimbable.min.z+onClimbable.max.z)/2, 8, dt);
        // LEDGE ASSIST: if a ledge lip overhangs part of the strand and blocks the ascent (head bonk =
        // no upward progress despite holding up), slide toward the strand's open center instead of pinning
        // the player under the lip ("the rope went straight into a block" — young-tester report)
        if(upHeld && this._climbPrevY!==undefined && (this.pos.y - this._climbPrevY) < climbSpeed*dt*0.25){
          const ccx = (onClimbable.min.x+onClimbable.max.x)/2;
          if(Math.abs(ccx - this.pos.x) > 0.05) this.pos.x += Math.sign(ccx - this.pos.x)*2.8*dt;
        }
        this._climbPrevY = this.pos.y;
        // climb wiggle
        this.body.rotation.z = Math.sin(this.animT*10)*0.08;
        this.footL.position.z = 0.05+Math.sin(this.animT*10)*0.15;
        this.footR.position.z = 0.05-Math.sin(this.animT*10)*0.15;
      }
    }
    if(!this.climbing) this._climbPrevY = undefined;

    // --- input & horizontal movement ---
    let md, mag;
    if(G.mode==='side'){
      // SMW-style: left/right only, locked to the lane (z=0)
      md = {x: INPUT.moveX, z: 0};
      mag = Math.abs(INPUT.moveX);
      this.vel.z = damp(this.vel.z, 0, 6, dt);
      this.pos.z = damp(this.pos.z, 0, 8, dt);
    } else {
      md = G.camc.moveDir();
      mag = Math.hypot(md.x, md.z);
    }
    // moon rush: faster, sparkling, enemies crumble on contact
    if(this.moonT>0){
      this.moonT -= dt;
      this._moonFx -= dt;
      if(this._moonFx<=0){
        this._moonFx = 0.07;
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+rand(0.2,1.2),this.pos.z), pick([0xffe08a,0xb37dff,0xfff2c4]), 2, {speed:1.5, life:0.4, gravity:1, size:0.7});
      }
      for(const e of G.ents.list){
        if(!e.isEnemy || e.dead) continue;
        const ep = e.group.position;
        if(Math.hypot(ep.x-this.pos.x, ep.z-this.pos.z) < 1.15 && Math.abs(ep.y-this.pos.y) < 1.6) e.takeHit(this,'moon');
      }
      if(this.moonT<=0 && window.UI) UI.toast('🌙 ...the moonlight fades.');
    }
    const speed = 7.2 * (this.moonT>0 ? 1.35 : 1);
    const accel = this.grounded ? 50 : 28;
    if(this.climbing){ /* velocities set by climb logic above */ }
    else if(this.blinkT>0){   // Grimm's shadow phase: locked burst along the leap direction, afterimages trailing
      this.blinkT -= dt;
      this.vel.x = this._blinkVX; if(G.mode==='side') this.vel.z = 0; else this.vel.z = this._blinkVZ;
      G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.55,this.pos.z), 0x5a3fa0, 2, {speed:0.6, life:0.35, gravity:0, size:0.9});
      G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.7,this.pos.z), 0xff9a50, 1, {speed:0.9, life:0.3, gravity:0, size:0.6});
    }
    else if(this.launchT>0 && !this.grounded){ this.launchT -= dt; }   // cannon launch: ballistic — preserve horizontal momentum (air friction would bleed the arc short)
    else if(mag>0.01 && !this.pounding && !(this.springT>0)){   // a winding spring holds its ground
      this.vel.x = damp(this.vel.x, md.x*speed, accel/speed, dt);
      if(G.mode!=='side') this.vel.z = damp(this.vel.z, md.z*speed, accel/speed, dt);
      this.facing = angleDamp(this.facing, G.mode==='side' ? (md.x>0?Math.PI/2:-Math.PI/2) : Math.atan2(md.x, md.z), 12, dt);
    } else {
      const fr = this.grounded?11:1.5;
      this.vel.x = damp(this.vel.x, 0, fr, dt);
      this.vel.z = damp(this.vel.z, 0, fr, dt);
    }

    // --- jumping ---
    if(this.grounded){ this.coyote = 0.12; this.canDouble = true; this.batFlutters = 0; this._springAir = false; this._zoeDJ = false; this.zoeGlideT = 1.6; }
    else this.coyote -= dt;
    this.jumpT = (this.jumpT||0) + dt;
    if(INPUT.jumpEdge) this.jumpBuf = 0.14; else this.jumpBuf -= dt;
    if(this.jumpBuf>0 && !this.pounding && !this.climbing){
      if(this.coyote>0){
        this.vel.y = 10.0; this.grounded=false; this.coyote=0; this.jumpBuf=0; this.jumpT=0; this._springAir=false;
        AUDIO.jump();
        this.squashV = 6;
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.1,this.pos.z), 0xcccccc, 5, {speed:1.5, life:0.3, gravity:2, size:0.7});
      } else if(this.canDouble){
        this.vel.y = 9.0; this.canDouble=false; this.jumpBuf=0; this.jumpT=0; this._springAir=false;
        AUDIO.djump();
        this.squashV = 6;
        if(this.costumeKey==='skeleton') AUDIO.noise({t:0.15,vol:0.1,fFrom:3000,fTo:1000});
        if(this.costumeKey==='zoe'){
          // BROOM GLIDE armed: same rise as any double-jump (height gates stay honest);
          // holding JUMP on the way down floats her on the broom while the magic lasts.
          this._zoeDJ = true;
          G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.5,this.pos.z), 0xb37dff, 6, {speed:1.6, life:0.4, gravity:0.5, size:0.7});
        }
        if(this.costumeKey==='grimm'){
          // SHADOW LEAP — same rise as any double-jump (height gates stay honest), plus a
          // short forward phase with ghost i-frames. Direction locks at the leap.
          this.blinkT = 0.13;
          this._blinkVX = Math.sin(this.facing)*24;
          this._blinkVZ = G.mode==='side' ? 0 : Math.cos(this.facing)*24;
          this.iframes = Math.max(this.iframes, 0.45);
          AUDIO.noise({t:0.14,vol:0.14,fFrom:1600,fTo:250});
        }
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.6,this.pos.z), PAL.purpleFx, 8, {speed:2, life:0.35, gravity:1});
      } else if(this.batT>0 && this.batFlutters<4){
        // bat-wing flutter: up to 4 extra wing-beats per airtime
        this.vel.y = 6.8; this.batFlutters++; this.jumpBuf=0;
        AUDIO.tone({f:500+this.batFlutters*80, f2:700+this.batFlutters*80, type:'sine', t:0.1, vol:0.12});
        this.squashV = 4;
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.9,this.pos.z), 0x8e5bd9, 5, {speed:1.8, life:0.3, gravity:1, size:0.6});
      }
    }
    // variable jump height — but every jump keeps full power for its first 0.10s,
    // so touch TAPS still get a strong arc (a tap used to be cut to a stunted hop)
    if(!INPUT.jumpHeld && this.jumpT>0.10 && this.vel.y>6.5 && !this.pounding && !this._springAir) this.vel.y = 6.5;   // tap apex ~1.8 — always clears common enemies (speedrun rule)

    // --- spring charge: hold pound on the ground — squiiish down, release to LAUNCH ---
    if(this.grounded && !this.climbing && !this.pounding && INPUT.poundHeld){
      const was = this.springT||0;
      this.springT = Math.min(was+dt, 0.6);
      if(was<0.6 && this.springT>=0.6) AUDIO.tone({f:300, f2:520, type:'sine', t:0.12, vol:0.15});   // fully wound
      this.squash = damp(this.squash, 1-0.4*(this.springT/0.6), 14, dt); this.squashV = 0;
      if(Math.floor(this.springT*8)!==Math.floor(was*8))
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.2,this.pos.z), 0xffd34d, 1, {speed:1.2, life:0.25, size:0.5});
    } else if((this.springT||0)>0){
      if(this.grounded && this.springT>0.18){
        const k = this.springT/0.6;
        this.vel.y = 11 + 3.5*k;                       // ~2.9u quick-release … ~4.4u fully wound (mega-bounce stays king)
        this.grounded=false; this.jumpT=0; this.canDouble=true; this._springAir=true;   // no hold-lift stacking
        this.squashV = 12;
        AUDIO.bounce(); AUDIO.jump();
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.1,this.pos.z), 0xffd34d, 10, {speed:3, life:0.35, gravity:2});
      }
      this.springT = 0;
    }

    // --- ground pound ---
    if(INPUT.poundEdge && !this.grounded && !this.pounding){
      this.pounding = true; this.poundHover = 0.14;
      this.vel.set(0,2,0);
      AUDIO.pound();
    }
    if(this.pounding){
      if(this.poundHover>0){ this.poundHover-=dt; this.vel.y=1.5; this.body.rotation.x += dt*22; }
      else { this.vel.y = -27; this.body.rotation.x = 0; }
    }

    // --- attack (bag spin) + salt throw when the Salt Shaker is equipped ---
    if(INPUT.attackEdge && !this.pounding){
      if(this.attackCD<=0){
        this.attackT = 0.34; this.attackCD = 0.42;
        this.hitSet.clear();
        AUDIO.swing();
      }
      // salt is an ADDED projectile on the same button, on its own faster cooldown (the bag-swing stays)
      if(this.G.carryWeapon==='salt' && this.saltCD<=0) this.throwSalt();
    }
    if(this.attackT>0){
      this.attackT -= dt;
      // damage enemies in radius
      for(const e of G.ents.list){
        if(!e.isEnemy || e.dead || this.hitSet.has(e)) continue;
        const p = e.group.position;
        const dx=p.x-this.pos.x, dz=p.z-this.pos.z, dy=(p.y+e.hitY||p.y)-(this.pos.y+0.7);
        if(dx*dx+dz*dz < 1.8*1.8+ (e.hitR||0)*(e.hitR||0) && Math.abs(dy)<1.6){
          this.hitSet.add(e);
          e.takeHit(this, 'swing');
        }
      }
    }

    // --- bat wings timer, glide, flap animation ---
    if(this.batT>0){
      this.batT -= dt;
      const flap = this.grounded ? Math.sin(this.animT*4)*0.25 : Math.sin(this.animT*16)*0.7;
      if(this.wingL){ this.wingL.rotation.z = 0.35+flap; this.wingR.rotation.z = -0.35-flap; }
      if(this.batT<=0){ this.loseBat(); if(window.UI) UI.toast('🦇 ...the wings fold away.'); }
    }

    // --- gravity ---
    // long-hold lift: holding jump keeps you rising farther (tap arcs unchanged; no effect on bounces/pound)
    const lift = INPUT.jumpHeld && this.vel.y>0 && this.jumpT<0.22 && !this.pounding && !this._springAir;
    if(!this.climbing) this.vel.y -= (lift?16:24)*dt;
    if(this.vel.y < -26 && !this.pounding) this.vel.y = -26;
    if(this.batT>0 && !this.pounding && this.vel.y < -4.5) this.vel.y = -4.5; // gentle bat glide
    const zg = this.costumeKey==='zoe' && this._zoeDJ && !this.grounded && !this.pounding && !this.climbing && INPUT.jumpHeld && this.vel.y < 0 && this.zoeGlideT > 0;
    if(zg){
      if(!this.zoeGliding) AUDIO.tone({f:620, f2:880, type:'triangle', t:0.18, vol:0.13});   // hop-on chime
      this.zoeGlideT -= dt;
      if(this.vel.y < -2.0) this.vel.y = -2.0;   // the broom carries her
      G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.1,this.pos.z), 0xb37dff, 1, {speed:0.7, life:0.4, gravity:-0.5, size:0.6});
      if(Math.random()<0.3) G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.05,this.pos.z), 0xffd23f, 1, {speed:0.5, life:0.35, gravity:-0.3, size:0.5});
    }
    this.zoeGliding = zg;

    // --- physics ---
    const wasGrounded = this.grounded;
    G.world.step(this, dt, {
      onBounce: ()=>{ AUDIO.bounce(); this.canDouble=true; this.squashV=8; this.lastBounce=G.time; this._springAir=true; if(this.pounding){this.vel.y*=1.35; this.pounding=false;} G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y,this.pos.z), PAL.pumpkin, 8, {speed:3, life:0.4}); },
      // ^ _springAir on bounce: the variable-jump release-cut was chopping EVERY bounce (13→6.5) for anyone not
      //   holding jump — i.e. every touch player. Bounces are launches: uncuttable, no hold-lift, per the jump model.
      onHardLand: ()=>{},
      onHazard: (c)=>{ this.damage(1, new THREE.Vector3((c.min.x+c.max.x)/2, c.min.y, (c.min.z+c.max.z)/2)); },
      onFall: ()=>{ G.onPlayerFell(); },
    });

    // landing
    if(!wasGrounded && this.grounded){
      if(this.pounding){
        this.pounding = false;
        AUDIO.poundHit();
        G.camc.shake(0.5, 0.3);
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.1,this.pos.z), 0xbbaaff, 16, {speed:5, life:0.5, gravity:6});
        // pound damages nearby enemies
        for(const e of G.ents.list){
          if(!e.isEnemy || e.dead) continue;
          const p=e.group.position;
          if(Math.hypot(p.x-this.pos.x,p.z-this.pos.z)<2.6 && Math.abs(p.y-this.pos.y)<1.6) e.takeHit(this,'pound');
        }
        if(G.boss && !G.boss.dead && G.boss.onPlayerPound) G.boss.onPlayerPound(this.pos);
      } else {
        AUDIO.land();
      }
      this.squashV = -8;
      G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.05,this.pos.z), 0x888899, 4, {speed:1.2, life:0.25, gravity:2, size:0.6});
    }

    // --- stomp check on enemies (falling onto them) ---
    if(this.vel.y < -1){
      for(const e of G.ents.list){
        if(!e.isEnemy || e.dead || e.noStomp) continue;
        const p = e.group.position;
        const top = p.y + (e.headH||1.0);
        const dx=p.x-this.pos.x, dz=p.z-this.pos.z;
        const rr = (e.hitR||0.6)+this.radius;
        if(dx*dx+dz*dz < rr*rr && this.pos.y > top-0.35 && this.pos.y < top+0.55){
          e.takeHit(this, this.pounding?'pound':'stomp');
          this.bounceOff(this.pounding?13:10.5);
          G.hitstop = 0.045;
          AUDIO.stomp();
          this.squashV = 8;
        }
      }
    }

    if(this.grounded) this.lastSafe.copy(this.pos);
    // costume run-trail (pass cosmetics)
    const cz = COSTUMES[this.costumeKey];
    if(this.zoeBroom){
      this.zoeBroom.visible = !!this.zoeGliding;
      this.zoeBroomBack.visible = !this.zoeGliding;
    }
    if(this.grimmAura){
      const tt = G.time, flare = this.blinkT>0 ? 0.3 : 0;
      this.grimmAura.material.opacity = 0.11 + 0.05*Math.sin(tt*2.6) + flare;
      this.grimmAura.rotation.y = tt*0.4;
      if(this.grimmLight) this.grimmLight.intensity = 42 + Math.sin(tt*7.3)*6 + Math.sin(tt*13.1)*3 + (this.blinkT>0?45:0);
    }
    if(cz && cz.trail){
      this._trailT = (this._trailT||0)-dt;
      if(this._trailT<=0 && Math.hypot(this.vel.x,this.vel.z)>4){
        this._trailT = 0.09;
        G.fx.spawn(new THREE.Vector3(this.pos.x,this.pos.y+0.25,this.pos.z), cz.trail, 2, {speed:0.8, life:0.45, gravity:-1, size:0.7});
      }
    }

    // --- visuals ---
    this.group.position.copy(this.pos);
    this.group.rotation.y = this.facing;
    // squash & stretch
    this.squash += this.squashV*dt;
    this.squashV += (1-this.squash)*160*dt;
    this.squashV *= Math.exp(-12*dt);
    this.squash = clamp(this.squash, 0.55, 1.5);
    this.body.scale.set(2-this.squash, this.squash, 2-this.squash);
    // run bob & lean
    const runSpeed = Math.hypot(this.vel.x,this.vel.z);
    if(this.grounded && runSpeed>0.5){
      this.body.position.y = Math.abs(Math.sin(this.animT*11))*0.08;
      this.body.rotation.x = 0.12*Math.min(runSpeed/7,1);
      const sw = Math.sin(this.animT*11)*0.35;
      this.footL.position.z = 0.05+sw*0.3; this.footR.position.z = 0.05-sw*0.3;
      this.armL.rotation.x = -sw*1.4; this.armR.rotation.x = sw*1.4;
    } else {
      this.body.position.y = 0;
      if(!this.pounding) this.body.rotation.x = this.grounded?0:clamp(-this.vel.y*0.02,-0.25,0.3);
      this.armL.rotation.x = this.grounded?0:-0.8;
      this.armR.rotation.x = this.grounded?0:-0.8;
    }
    // attack spin visual
    if(this.attackT>0){
      const t = 1-(this.attackT/0.34);
      this.body.rotation.y = t*Math.PI*2;
      this.bag.position.set(Math.sin(t*TAU)*0.85, 0.7, Math.cos(t*TAU)*0.85);
      this.bag.scale.setScalar(1.4);
    } else {
      this.body.rotation.y = 0;
      this.bag.position.set(0.58,0.62,0.1);
      this.bag.scale.setScalar(1);
    }
    // i-frame flicker
    this.group.visible = this.iframes>0 ? (Math.floor(this.iframes*14)%2===0) : true;
    // shadow
    const gh = G.world.groundHeight(this.pos.x, this.pos.z, this.pos.y+0.1);
    if(gh>-Infinity){
      this.shadow.visible = true;
      this.shadow.position.set(this.pos.x, gh+0.02, this.pos.z);
      const h = clamp(this.pos.y-gh, 0, 8);
      this.shadow.scale.setScalar(clamp(1-h*0.07, 0.35, 1));
    } else this.shadow.visible = false;
  }
}

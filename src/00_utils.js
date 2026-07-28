// ============ GRIMMWICK — utils, palette, geometry helpers ============
const PAL = {
  night:    0x1b1438,
  fog:      0x2e2258,
  moon:     0xfff2c4,
  ground:   0x3c2f6a,
  path:     0x5c4a8c,
  grass:    0x3f5a55,
  pumpkin:  0xff8c2e,
  pumpkinD: 0xd96a12,
  stem:     0x5f8a3a,
  ghost:    0xf2f0ff,
  bone:     0xe8e4d8,
  wood:     0x5a4066,
  woodD:    0x453153,
  roof:     0x6a3c8f,
  window:   0xffc95e,
  candy1:   0xff5ea8,
  candy2:   0x63e6e2,
  candy3:   0xffd166,
  hazard:   0x7a3fbf,
  vine:     0x4f7a35,
  gold:     0xffd23f,
  spider:   0x3a2d4d,
  purpleFx: 0xb37dff,
  greenFx:  0x7dff9e,
};

// seedable PRNG — switchArea seeds per area, so deco scatter is IDENTICAL every replay
// (the determinism covenant, extended: a level replays the same down to the last pebble)
let _rngS = 123456789;
const srand = s => { _rngS = (s>>>0)||1; };
const seedFrom = str => { let h=2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h>>>0; };
const _rng = () => { _rngS = (_rngS*1664525 + 1013904223)>>>0; return _rngS/4294967296; };
const rand = (a=1, b) => (b===undefined ? _rng()*a : a + _rng()*(b-a));
const randi = (a,b) => Math.floor(rand(a, b+0.9999));
const pick = arr => arr[Math.floor(_rng()*arr.length)];
const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const lerp = (a,b,t) => a+(b-a)*t;
// framerate-independent damping
const damp = (a,b,s,dt) => lerp(a,b,1-Math.exp(-s*dt));
const TAU = Math.PI*2;
function angleLerp(a,b,t){ let d=(b-a)%TAU; if(d>Math.PI)d-=TAU; if(d<-Math.PI)d+=TAU; return a+d*t; }
function angleDamp(a,b,s,dt){ return angleLerp(a,b,1-Math.exp(-s*dt)); }

// ---- cached materials ----
const _matCache = new Map();
function mat(color, opts={}){
  const key = color+'|'+JSON.stringify(opts);
  if(_matCache.has(key)) return _matCache.get(key);
  const m = new THREE.MeshLambertMaterial(Object.assign({color}, opts));
  _matCache.set(key, m);
  return m;
}
function emat(color, emissive, ei=0.6, opts={}){
  return mat(color, Object.assign({emissive, emissiveIntensity:ei}, opts));
}

// ---- geometry cache ----
const _geoCache = new Map();
function geo(kind, ...args){
  const key = kind+args.join(',');
  if(_geoCache.has(key)) return _geoCache.get(key);
  let g;
  switch(kind){
    case 'box': g = new THREE.BoxGeometry(...args); break;
    case 'sph': g = new THREE.SphereGeometry(...args); break;
    case 'cone': g = new THREE.ConeGeometry(...args); break;
    case 'cyl': g = new THREE.CylinderGeometry(...args); break;
    case 'tor': g = new THREE.TorusGeometry(...args); break;
    case 'circ': g = new THREE.CircleGeometry(...args); break;
    case 'plane': g = new THREE.PlaneGeometry(...args); break;
  }
  _geoCache.set(key, g);
  return g;
}
function mesh(kind, args, color, opts){
  return new THREE.Mesh(geo(kind, ...args), typeof color==='object'&&color.isMaterial ? color : mat(color, opts||{}));
}

// ---- static geometry merging (perf: one draw call per merged chunk) ----
// bake a group's meshes into a single vertex-colored mesh
function bakeGroup(group, opts={}){
  group.updateMatrixWorld(true);
  const pos=[], norm=[], col=[];
  const c = new THREE.Color();
  const nrmMat = new THREE.Matrix3();
  group.traverse(o=>{
    if(!o.isMesh) return;
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry;
    const p = g.attributes.position, n = g.attributes.normal;
    nrmMat.getNormalMatrix(o.matrixWorld);
    c.copy(o.material.color);
    if(o.material.emissiveIntensity>0 && o.material.emissive && (o.material.emissive.r+o.material.emissive.g+o.material.emissive.b)>0){
      // brighten baked emissive-ish parts slightly
      c.lerp(o.material.emissive, 0.5);
    }
    const v = new THREE.Vector3(), nv = new THREE.Vector3();
    for(let i=0;i<p.count;i++){
      v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);
      nv.fromBufferAttribute(n,i).applyMatrix3(nrmMat).normalize();
      pos.push(v.x,v.y,v.z); norm.push(nv.x,nv.y,nv.z); col.push(c.r,c.g,c.b);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(norm,3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({vertexColors:true}));
  m.matrixAutoUpdate = false;
  return m;
}

// ---- blob shadow ----
const _blobMat = new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.34, depthWrite:false});
function blobShadow(size=0.9){
  const m = new THREE.Mesh(geo('circ', size, 14), _blobMat);
  m.rotation.x = -Math.PI/2;
  m.renderOrder = 2;
  return m;
}

// ---- tiny helper: crooked rotation for spooky charm ----
function crook(o, amt=0.06){ o.rotation.z += rand(-amt,amt); o.rotation.x += rand(-amt,amt); return o; }

// ---- simple particle system ----
class Particles {
  constructor(scene, max=260){
    this.scene = scene;
    this.pool = [];
    this.live = [];
    this.max = max;
    this.geo = geo('box', 0.14,0.14,0.14);
  }
  spawn(pos, color, n=8, opt={}){
    for(let i=0;i<n;i++){
      if(this.live.length>=this.max) break;
      let p = this.pool.pop();
      if(!p){
        p = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({color:0xffffff, transparent:true}));
      }
      p.material.color.set(color);
      p.material.opacity = 1;
      p.position.copy(pos);
      p.position.x += rand(-0.2,0.2); p.position.y += rand(-0.1,0.3); p.position.z += rand(-0.2,0.2);
      const sp = opt.speed||3;
      p.userData.v = new THREE.Vector3(rand(-sp,sp), rand(sp*0.5, sp*1.4), rand(-sp,sp));
      p.userData.g = opt.gravity!==undefined?opt.gravity:9;
      p.userData.life = p.userData.maxLife = opt.life||rand(0.4,0.8);
      p.userData.spin = rand(-8,8);
      const s = opt.size||rand(0.6,1.4);
      p.scale.setScalar(s);
      p.userData.s0 = s;
      this.scene.add(p);
      this.live.push(p);
    }
  }
  update(dt){
    for(let i=this.live.length-1;i>=0;i--){
      const p = this.live[i];
      p.userData.life -= dt;
      if(p.userData.life<=0){
        this.scene.remove(p); this.pool.push(p); this.live.splice(i,1); continue;
      }
      p.userData.v.y -= p.userData.g*dt;
      p.position.addScaledVector(p.userData.v, dt);
      p.rotation.x += p.userData.spin*dt; p.rotation.y += p.userData.spin*0.7*dt;
      const t = p.userData.life/p.userData.maxLife;
      p.material.opacity = t;
      p.scale.setScalar(p.userData.s0*(0.3+0.7*t));
    }
  }
  clear(){
    for(const p of this.live){ this.scene.remove(p); this.pool.push(p); }
    this.live.length = 0;
  }
}


// ---- side-view scenery: parallax hills, distant town, fireflies ----
function buildParallax(S, x1, x2){
  const span=Math.abs(x2-x1)+80;
  // near hills
  const hills1 = new THREE.Group();
  for(let x=x1-30; x<x2+30; x+=rand(9,14)){
    const h = mesh('sph',[rand(6,11),10,8], mat(0x2c2254));
    h.position.set(x, rand(-4,-1), -14); h.scale.y=rand(0.35,0.55);
    hills1.add(h);
  }
  S.add(bakeGroup(hills1));
  // far hills
  const hills2 = new THREE.Group();
  for(let x=x1-40; x<x2+40; x+=rand(14,20)){
    const h = mesh('sph',[rand(10,16),9,7], mat(0x221a44));
    h.position.set(x, rand(-5,-2), -28); h.scale.y=rand(0.4,0.6);
    hills2.add(h);
  }
  S.add(bakeGroup(hills2));
  // distant glowing town silhouettes
  const town = new THREE.Group();
  for(let x=x1-20; x<x2+20; x+=rand(24,40)){
    const n=randi(2,4);
    for(let i=0;i<n;i++){
      const bx=x+i*rand(2.5,4);
      const b = mesh('box',[rand(1.6,2.6), rand(2,4.5), 1.5], mat(0x1c1538));
      b.position.set(bx, 1.2, -20);
      town.add(b);
      const r = mesh('cone',[rand(1,1.5), rand(1.2,2), 4], mat(0x241c44));
      r.position.set(bx, b.geometry.parameters.height+1.8, -20); r.rotation.y=Math.PI/4;
      town.add(r);
      if(rand()<0.8){
        const w = mesh('box',[0.3,0.4,0.1], emat(PAL.window,PAL.window,1));
        w.position.set(bx+rand(-0.5,0.5), rand(1,2.6), -19.2);
        town.add(w);
      }
    }
  }
  S.add(bakeGroup(town));
  // fireflies drifting through the scene
  const fg = new THREE.BufferGeometry();
  const fp=[]; const n=46;
  for(let i=0;i<n;i++) fp.push(rand(x1,x2), rand(0.4,7), rand(-7,2.5));
  fg.setAttribute('position', new THREE.Float32BufferAttribute(fp,3));
  const flies = new THREE.Points(fg, new THREE.PointsMaterial({color:0xd6ff9e, size:0.14, transparent:true, opacity:0.85}));
  S.add(flies);
  return flies;
}
function buildAmbience(S, x1, x2){
  const flies = buildParallax(S, x1, x2);
  // falling autumn leaves
  const leaves = [];
  for(let i=0;i<14;i++){
    const lf = mesh('circ',[0.16,5], mat(pick([0xd97a2e,0xb5522e,0x8a6f2e,0x7a4a8f])));
    lf.material.side = THREE.DoubleSide;
    lf.userData = {x0:rand(x1,x2), y0:rand(4,10), sp:rand(0.5,1.1), ph:rand(9), sw:rand(0.8,1.8)};
    S.add(lf);
    leaves.push(lf);
  }
  // drifting clouds across the moon
  const clouds = [];
  for(let i=0;i<3;i++){
    const cl = new THREE.Mesh(geo('sph',rand(5,8),8,6), new THREE.MeshBasicMaterial({color:0x2a2250, transparent:true, opacity:0.55}));
    cl.scale.set(1.6,0.35,0.5);
    cl.userData = {y:rand(48,62), sp:rand(0.4,0.9), x:rand(x1-30,x2+30)};
    cl.position.set(cl.userData.x, cl.userData.y, -80);
    S.add(cl);
    clouds.push(cl);
  }
  return {flies, leaves, clouds, x1, x2};
}
function updateAmbience(amb, t){
  if(!amb) return;
  if(amb.flies) updateFireflies(amb.flies, t);
  if(amb.leaves) for(const lf of amb.leaves){
    const u = lf.userData;
    const fall = ((t*u.sp + u.ph) % 1);
    lf.position.set(u.x0 + Math.sin(t*1.3+u.ph)*u.sw, u.y0*(1-fall), rand ? (lf.position.z||rand(-4,2)) : 0);
    if(fall<0.02) lf.position.z = rand(-4,2);
    lf.rotation.set(Math.sin(t*2+u.ph)*1.2, t*1.5+u.ph, 0);
  }
  if(amb.clouds) for(const cl of amb.clouds){
    const u = cl.userData;
    u.x += u.sp*0.016;
    if(u.x > amb.x2+40) u.x = amb.x1-40;
    cl.position.x = u.x;
  }
}
// themed ground clutter — baked, zero runtime cost
function buildClutter(G, x1, x2, theme){
  const g = new THREE.Group();
  const n = Math.floor((x2-x1)/2.2);
  for(let i=0;i<n;i++){
    const x = rand(x1,x2), z = rand(-2.8,2.8);
    const r = rand();
    if(theme==='grave'){
      if(r<0.3) { const rock = mesh('sph',[rand(0.1,0.22),6,5], mat(0x565070)); rock.position.set(x,0.08,z); rock.scale.y=0.6; g.add(rock); }
      else if(r<0.5){ const bone = mesh('cyl',[0.03,0.03,rand(0.3,0.5),4], mat(PAL.bone)); bone.rotation.z=Math.PI/2; bone.rotation.y=rand(TAU); bone.position.set(x,0.05,z); g.add(bone); }
      else if(r<0.75){ const tuft = mesh('cone',[0.08,rand(0.2,0.4),4], mat(0x2e4438)); tuft.position.set(x,0.15,z); crook(tuft,0.2); g.add(tuft); }
      else { const shroom = mesh('sph',[0.09,6,5], mat(0x8a5a9e)); shroom.position.set(x,0.12,z); const st=mesh('cyl',[0.03,0.04,0.12,4], mat(0xd8d4c8)); st.position.set(x,0.05,z); g.add(shroom,st); }
    } else if(theme==='farm'){
      if(r<0.4){ const hay = mesh('cyl',[0.02,0.02,rand(0.25,0.45),3], mat(0xc2a24f)); hay.rotation.z=rand(1,2); hay.rotation.y=rand(TAU); hay.position.set(x,0.05,z); g.add(hay); }
      else if(r<0.7){ const tuft = mesh('cone',[0.09,rand(0.25,0.45),4], mat(0x3f5a3f)); tuft.position.set(x,0.16,z); crook(tuft,0.25); g.add(tuft); }
      else { const pebble = mesh('sph',[rand(0.08,0.15),5,4], mat(0x6b5a4e)); pebble.position.set(x,0.06,z); pebble.scale.y=0.5; g.add(pebble); }
    } else { // garden
      if(r<0.5){ const tuft = mesh('cone',[0.09,rand(0.3,0.5),4], mat(0x2e4a3d)); tuft.position.set(x,0.18,z); crook(tuft,0.3); g.add(tuft); }
      else { const th = mesh('cone',[0.06,rand(0.15,0.3),4], emat(0x7a3fbf,0x5b2fa0,0.3)); th.position.set(x,0.1,z); g.add(th); }
    }
  }
  G.scene.add(bakeGroup(g));
}
function updateFireflies(flies, t){
  if(!flies) return;
  flies.material.opacity = 0.6+Math.sin(t*1.7)*0.25;
  flies.position.y = Math.sin(t*0.5)*0.4;
  flies.position.x = Math.sin(t*0.23)*1.2;
}


// ---- climbables: vine and web-net (world volume type 'climb') ----
function buildVine(G, x, z, h){
  const g = new THREE.Group();
  for(let y=0; y<h; y+=0.5){
    const seg = mesh('cyl',[0.07,0.09,0.55,5], mat(PAL.vine));
    seg.position.set(x+Math.sin(y*2.2)*0.12, y+0.25, z);
    seg.rotation.z = Math.sin(y*2.2)*0.18;
    g.add(seg);
    if(rand()<0.5){
      const leaf = mesh('sph',[0.14,6,5], mat(0x5f8a3a));
      leaf.position.set(x+Math.sin(y*2.2)*0.12+rand(-0.2,0.2), y+0.25, z+0.08);
      leaf.scale.set(1.3,0.4,0.8);
      g.add(leaf);
    }
  }
  G.scene.add(bakeGroup(g));
  return G.world.addBox(x, 0, z, 1.1, h, 1.2, {type:'climb'});
}
// merge a group of SAME-material meshes into ONE mesh that KEEPS that material — for transparent strands
// (webs) where bakeGroup's opaque vertex-color rebuild would discard the opacity. Reads geometry attributes
// without mutating (safe with the cached geo() factory).
function mergeStrands(group, material){
  group.updateMatrixWorld(true);
  const pos=[], norm=[];
  const v=new THREE.Vector3(), nv=new THREE.Vector3(), nm=new THREE.Matrix3();
  group.traverse(o=>{
    if(!o.isMesh) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry;
    const p=g.attributes.position, n=g.attributes.normal;
    nm.getNormalMatrix(o.matrixWorld);
    for(let i=0;i<p.count;i++){
      v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);
      nv.fromBufferAttribute(n,i).applyMatrix3(nm).normalize();
      pos.push(v.x,v.y,v.z); norm.push(nv.x,nv.y,nv.z);
    }
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(norm,3));
  const m=new THREE.Mesh(g, material);
  m.matrixAutoUpdate=false;
  return m;
}
function buildWebNet(G, x, z, w, h){
  const g = new THREE.Group();
  const wm = new THREE.MeshLambertMaterial({color:0xd8d8e8, transparent:true, opacity:0.7});
  for(let i=0;i<=Math.floor(w/0.6);i++){
    const v = new THREE.Mesh(geo('cyl',0.025,0.025,h,4), wm);
    v.position.set(x-w/2+i*0.6, h/2, z);
    g.add(v);
  }
  for(let j=0;j<=Math.floor(h/0.6);j++){
    const hz = new THREE.Mesh(geo('cyl',0.025,0.025,w,4), wm);
    hz.rotation.z = Math.PI/2;
    hz.position.set(x, j*0.6+0.2, z);
    g.add(hz);
  }
  G.scene.add(mergeStrands(g, wm));   // ~20 transparent strand meshes → 1 sorted+blended draw call
  return G.world.addBox(x, 0, z, w, h, 1.2, {type:'climb'});
}

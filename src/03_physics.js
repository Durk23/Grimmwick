// ============ PHYSICS — AABB colliders, step-up, bounce, hazards, moving platforms ============
// Entity contract: {pos:Vector3 (feet), vel:Vector3, radius, height, grounded, groundCol}
class PhysWorld {
  constructor(){
    this.cols = [];       // {min,max,type,bounce,damage,platform,tag,onTouch}
    this.movers = [];     // moving platform controllers
    this.killY = -24;
  }
  reset(){ this.cols.length=0; this.movers.length=0; }
  addBox(cx, cy, cz, w, h, d, opts={}){
    const col = {
      min: new THREE.Vector3(cx-w/2, cy, cz-d/2),
      max: new THREE.Vector3(cx+w/2, cy+h, cz+d/2),
      type: opts.type||'solid',
      bounce: opts.bounce||0,
      damage: opts.damage||0,
      tag: opts.tag||null,
      onTouch: opts.onTouch||null,
      mesh: opts.mesh||null,
      vel: null, // for movers
    };
    this.cols.push(col);
    return col;
  }
  addMesh(m, opts={}){
    const box = new THREE.Box3().setFromObject(m);
    const col = {
      min: box.min.clone(), max: box.max.clone(),
      type: opts.type||'solid', bounce: opts.bounce||0, damage: opts.damage||0,
      tag: opts.tag||null, onTouch: opts.onTouch||null, mesh: m, vel: null,
    };
    this.cols.push(col);
    return col;
  }
  // moving platform: fn(t) returns Vector3 center-bottom position
  addMover(w, h, d, fn, meshBuilder){
    const col = this.addBox(0,0,0,w,h,d,{type:'solid'});
    col.vel = new THREE.Vector3();
    const mover = {col, fn, t:0, w,h,d, mesh:meshBuilder?meshBuilder():null, lastPos:new THREE.Vector3()};
    const p0 = fn(0);
    this._placeMover(mover, p0);
    mover.lastPos.copy(p0);
    this.movers.push(mover);
    return mover;
  }
  _placeMover(m, p){
    m.col.min.set(p.x-m.w/2, p.y, p.z-m.d/2);
    m.col.max.set(p.x+m.w/2, p.y+m.h, p.z+m.d/2);
    if(m.mesh) m.mesh.position.set(p.x, p.y, p.z);
  }
  updateMovers(dt){
    for(const m of this.movers){
      m.t += dt;
      const p = m.fn(m.t);
      m.col.vel = m.col.vel||new THREE.Vector3();
      m.col.vel.copy(p).sub(m.lastPos).divideScalar(Math.max(dt,1e-5));
      this._placeMover(m, p);
      m.lastPos.copy(p);
    }
  }
  // highest solid top under (x,z) at or below y+0.5 (for shadows & ground checks)
  groundHeight(x, z, y){
    let best = -Infinity;
    for(const c of this.cols){
      if(c.type!=='solid' && c.type!=='bounce') continue;
      if(x>c.min.x-0.01 && x<c.max.x+0.01 && z>c.min.z-0.01 && z<c.max.z+0.01){
        if(c.max.y <= y+0.6 && c.max.y > best) best = c.max.y;
      }
    }
    return best;
  }
  step(e, dt, cb={}){
    const r = e.radius, stepH = e.stepH!==undefined?e.stepH:0.42;
    // ---- horizontal ----
    e.pos.x += e.vel.x*dt;
    e.pos.z += e.vel.z*dt;
    const feet = e.pos.y, head = e.pos.y+e.height;
    for(const c of this.cols){
      if(c.type==='ghost'||c.type==='climb') continue;
      // vertical overlap of body (with small skin so standing-on doesn't count)
      if(head <= c.min.y+0.02 || feet >= c.max.y-0.02) {
        // hazard volumes still trigger on feet graze — but ONLY when actually over the box in XZ
        // (without the XZ test, a wide dynamic hazard like the bilge flood damaged the player anywhere in the
        //  level whenever its rising surface crossed their feet height — the "invisible damage" bug)
        if(c.type==='hazard' && head>c.min.y && feet<c.max.y){
          const gx = clamp(e.pos.x, c.min.x, c.max.x), gz = clamp(e.pos.z, c.min.z, c.max.z);
          if((e.pos.x-gx)*(e.pos.x-gx) + (e.pos.z-gz)*(e.pos.z-gz) < r*r) this._touch(e,c,cb);
        }
        continue;
      }
      // circle vs AABB in XZ
      const nx = clamp(e.pos.x, c.min.x, c.max.x);
      const nz = clamp(e.pos.z, c.min.z, c.max.z);
      let dx = e.pos.x-nx, dz = e.pos.z-nz;
      const d2 = dx*dx+dz*dz;
      if(d2 < r*r){
        if(c.type==='hazard'||c.type==='trigger'){ this._touch(e,c,cb); if(c.type==='trigger') continue; if(c.type==='hazard') continue; }
        // step-up: low obstacle while grounded-ish
        if(c.max.y - feet <= stepH && e.vel.y<=0.01){
          e.pos.y = c.max.y;
          continue;
        }
        if(d2>1e-9){
          const d = Math.sqrt(d2), push = (r-d);
          dx/=d; dz/=d;
          e.pos.x += dx*push; e.pos.z += dz*push;
          const vn = e.vel.x*dx + e.vel.z*dz;
          if(vn<0){ e.vel.x -= vn*dx; e.vel.z -= vn*dz; }
        } else {
          // near the top of a floor-like box? snap up instead of launching sideways
          const dTop = c.max.y - feet;
          if(dTop >= -0.01 && dTop <= 1.0){ e.pos.y = c.max.y; continue; }
          // center inside box: push out along smallest axis
          const px = Math.min(e.pos.x-c.min.x+r, c.max.x-e.pos.x+r);
          const pz = Math.min(e.pos.z-c.min.z+r, c.max.z-e.pos.z+r);
          if(px<pz) e.pos.x += (e.pos.x-c.min.x < c.max.x-e.pos.x) ? -(px) : px;
          else e.pos.z += (e.pos.z-c.min.z < c.max.z-e.pos.z) ? -(pz) : pz;
        }
      }
    }
    // ---- vertical ----
    const prevFeet = e.pos.y;
    e.pos.y += e.vel.y*dt;
    e.grounded = false;
    e.groundCol = null;
    for(const c of this.cols){
      if(c.type==='ghost'||c.type==='trigger'||c.type==='climb') continue;
      // XZ footprint overlap
      const nx = clamp(e.pos.x, c.min.x, c.max.x);
      const nz = clamp(e.pos.z, c.min.z, c.max.z);
      const dx = e.pos.x-nx, dz = e.pos.z-nz;
      if(dx*dx+dz*dz > r*r*0.7) continue;
      // landing
      if(e.vel.y<=0 && prevFeet >= c.max.y-0.35 && e.pos.y <= c.max.y){
        if(c.type==='hazard'){ this._touch(e,c,cb); continue; }
        e.pos.y = c.max.y;
        if(c.bounce>0){
          e.vel.y = c.bounce;
          if(cb.onBounce) cb.onBounce(c);
        } else {
          if(e.vel.y < -13 && cb.onHardLand) cb.onHardLand(e.vel.y);
          e.vel.y = 0;
          e.grounded = true;
          e.groundCol = c;
        }
        if(c.onTouch) this._touch(e,c,cb);
      }
      // ceiling bump
      else if(e.vel.y>0 && prevFeet+e.height <= c.min.y+0.3 && e.pos.y+e.height >= c.min.y){
        if(c.type==='hazard') { this._touch(e,c,cb); continue; }
        e.pos.y = c.min.y-e.height;
        e.vel.y = Math.min(e.vel.y, 0);
      }
    }
    // carried by moving platform
    if(e.grounded && e.groundCol && e.groundCol.vel){
      e.pos.x += e.groundCol.vel.x*dt;
      e.pos.z += e.groundCol.vel.z*dt;
      if(e.groundCol.vel.y<0) e.pos.y += e.groundCol.vel.y*dt;
    }
    if(e.pos.y < this.killY && cb.onFall) cb.onFall();
  }
  _touch(e, c, cb){
    if(c.onTouch) c.onTouch(e);
    if(c.type==='hazard' && cb.onHazard) cb.onHazard(c);
  }
}

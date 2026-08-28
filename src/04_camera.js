// ============ CAMERA — smooth third-person follow with orbit ============
class CamCtrl {
  constructor(camera){
    this.cam = camera;
    this.yaw = Math.PI;         // behind player facing -Z start
    this.pitch = 0.42;
    this.dist = 8.2;
    this.pos = new THREE.Vector3(0,6,10);
    this.look = new THREE.Vector3();
    this.shakeT = 0; this.shakeAmt = 0;
    this.autoRotate = true;
  }
  snapSide(player){
    this.sideLook = 0;
    this.pos.set(player.pos.x, player.pos.y+2.3, 11.5);
    this.cam.position.copy(this.pos);
    this.cam.lookAt(player.pos.x, player.pos.y+1.4, 0);
  }
  snapBehind(target, yaw){
    this.yaw = yaw!==undefined?yaw:this.yaw;
    const p = this._desired(target);
    this.pos.copy(p);
    this.look.copy(target).add(new THREE.Vector3(0,1.4,0));
  }
  _desired(target){
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    return new THREE.Vector3(
      target.x + Math.sin(this.yaw)*this.dist*cp,
      target.y + this.dist*sp + 1.2,
      target.z + Math.cos(this.yaw)*this.dist*cp
    );
  }
  update(dt, player, world){
    // ---- SIDE-SCROLL MODE (SMW-style): fixed side camera, lookahead ----
    if(window.G && G.mode==='side'){
      this.sideLook = damp(this.sideLook||0, clamp(player.vel.x*0.5,-3,3), 2.5, dt);
      const tx = player.pos.x + this.sideLook;
      let floorY = (window.G && typeof G.camMinY==='number') ? G.camMinY : 0;   // levels that go underground (crypt) lower camMinY so the camera follows down
      if(window.G && typeof G._camDip==='number') floorY = Math.min(floorY, G._camDip);   // pit-fall dip: the doom at the bottom must be ON SCREEN (phones crop vertically)
      const ty = Math.max(player.pos.y, floorY);
      this.pos.x = damp(this.pos.x, tx, 8, dt);
      this.pos.y = damp(this.pos.y, ty+2.3, 4, dt);
      this.pos.z = damp(this.pos.z, 11.5, 6, dt);
      this.cam.position.copy(this.pos);
      if(this.shakeT>0){
        this.shakeT -= dt;
        const sh = this.shakeAmt*(this.shakeT>0?this.shakeT:0);
        this.cam.position.x += rand(-sh,sh); this.cam.position.y += rand(-sh,sh);
      }
      this.cam.lookAt(this.pos.x, this.pos.y-0.85, 0);
      return;
    }
    // manual orbit
    this.yaw -= INPUT.camDX;
    this.pitch = clamp(this.pitch + INPUT.camDY, 0.12, 0.9);
    // gentle auto-align behind movement when player runs & no recent manual input
    const t = performance.now()/1000;
    const moving = Math.hypot(player.vel.x, player.vel.z) > 2.2;
    if(this.autoRotate && moving && t-INPUT.lastManualCam > 1.6){
      const moveDir = Math.atan2(player.vel.x, player.vel.z);
      const behind = moveDir + Math.PI;
      // only auto-align when running away from / across the camera —
      // never when backing toward it (prevents spiral feedback)
      let diff = (behind-this.yaw)%TAU; if(diff>Math.PI)diff-=TAU; if(diff<-Math.PI)diff+=TAU;
      if(Math.abs(diff) < 2.2) this.yaw = angleDamp(this.yaw, behind, 0.9, dt);
    }
    const target = player.pos;
    const des = this._desired(target);
    // keep camera above nearby ground
    if(world){
      const gh = world.groundHeight(des.x, des.z, des.y+3);
      if(gh > -Infinity && des.y < gh+0.6) des.y = gh+0.6;
    }
    this.pos.x = damp(this.pos.x, des.x, 7, dt);
    this.pos.y = damp(this.pos.y, des.y, 6, dt);
    this.pos.z = damp(this.pos.z, des.z, 7, dt);
    const lookT = new THREE.Vector3(target.x, target.y+1.5, target.z);
    this.look.x = damp(this.look.x, lookT.x, 11, dt);
    this.look.y = damp(this.look.y, lookT.y, 8, dt);
    this.look.z = damp(this.look.z, lookT.z, 11, dt);
    this.cam.position.copy(this.pos);
    if(this.shakeT>0){
      this.shakeT -= dt;
      const s = this.shakeAmt*(this.shakeT>0?this.shakeT:0);
      this.cam.position.x += rand(-s,s);
      this.cam.position.y += rand(-s,s);
      this.cam.position.z += rand(-s,s);
    }
    this.cam.lookAt(this.look);
  }
  shake(amt=0.3, t=0.35){ this.shakeAmt = amt/Math.max(t,0.01); this.shakeT = t; }
  // camera-relative input direction on XZ plane
  moveDir(){
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw); // forward
    const rx = -fz, rz = fx;                                   // right
    return {
      x: fx*(-INPUT.moveY) + rx*INPUT.moveX,
      z: fz*(-INPUT.moveY) + rz*INPUT.moveX,
    };
  }
}

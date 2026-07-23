// ============ INPUT — keyboard + touch (virtual joystick, buttons, cam drag) ============
class InputSys {
  constructor(){
    this.keys = {};
    this.moveX = 0; this.moveY = 0;          // -1..1 stick
    this.jumpHeld = false; this.jumpEdge = false;
    this.attackEdge = false;
    this.poundEdge = false;
    this.interactEdge = false;
    this.pauseEdge = false;
    this.camDX = 0; this.camDY = 0;          // camera orbit delta this frame
    this.lastManualCam = -99;
    this.isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints>0;
    this.anyEdge = false;                     // any press (for title screen)
    this._stick = {active:false, id:-1, ox:0, oy:0, x:0, y:0};
    this._cam = {active:false, id:-1, lx:0, ly:0};
    this._mouseDown = false;
    this._bind();
  }
  _bind(){
    addEventListener('keydown', e=>{
      if(e.repeat) return;
      this.keys[e.code] = true;
      this.anyEdge = true;
      if(e.code==='Space'){ this.jumpEdge=true; }
      if(e.code==='KeyJ'||e.code==='KeyF'||e.code==='Enter'){ this.attackEdge=true; }
      if(e.code==='KeyK'||e.code==='ShiftLeft'){ this.poundEdge=true; }
      if(e.code==='KeyE'){ this.interactEdge=true; }
      if(e.code==='Escape'||e.code==='KeyP'){ this.pauseEdge=true; }
      if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    });
    addEventListener('keyup', e=>{ this.keys[e.code]=false; });
    // mouse camera drag (desktop)
    addEventListener('mousedown', e=>{
      if(e.target.closest && e.target.closest('.ui-block')) return;
      this._mouseDown = true; this._cam.lx=e.clientX; this._cam.ly=e.clientY;
      this.anyEdge = true;
    });
    addEventListener('mousemove', e=>{
      if(this._mouseDown){
        this.camDX += (e.clientX-this._cam.lx)*0.0045;
        this.camDY += (e.clientY-this._cam.ly)*0.003;
        this._cam.lx=e.clientX; this._cam.ly=e.clientY;
        this.lastManualCam = performance.now()/1000;
      }
    });
    addEventListener('mouseup', ()=>{ this._mouseDown=false; });

    // ---- touch ----
    const opts = {passive:false};
    addEventListener('touchstart', e=>{
      this.anyEdge = true;
      for(const t of e.changedTouches){
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if(el && el.closest && el.closest('.ui-block')) continue; // buttons handle themselves
        if(t.clientX < innerWidth*0.45 && !this._stick.active){
          this._stick.active=true; this._stick.id=t.identifier;
          this._stick.ox=t.clientX; this._stick.oy=t.clientY;
          this._stick.x=t.clientX; this._stick.y=t.clientY;
          if(window.UI) UI.showStick(t.clientX, t.clientY);
          e.preventDefault();
        } else if(!this._cam.active){
          this._cam.active=true; this._cam.id=t.identifier;
          this._cam.lx=t.clientX; this._cam.ly=t.clientY;
          e.preventDefault();
        }
      }
    }, opts);
    addEventListener('touchmove', e=>{
      for(const t of e.changedTouches){
        if(this._stick.active && t.identifier===this._stick.id){
          this._stick.x=t.clientX; this._stick.y=t.clientY;
          if(window.UI) UI.moveStick(this._stick);
          e.preventDefault();
        } else if(this._cam.active && t.identifier===this._cam.id){
          this.camDX += (t.clientX-this._cam.lx)*0.006;
          this.camDY += (t.clientY-this._cam.ly)*0.004;
          this._cam.lx=t.clientX; this._cam.ly=t.clientY;
          this.lastManualCam = performance.now()/1000;
          e.preventDefault();
        }
      }
    }, opts);
    const endTouch = e=>{
      for(const t of e.changedTouches){
        if(t.identifier===this._stick.id){ this._stick.active=false; this._stick.id=-1; if(window.UI) UI.hideStick(); }
        if(t.identifier===this._cam.id){ this._cam.active=false; this._cam.id=-1; }
      }
    };
    addEventListener('touchend', endTouch); addEventListener('touchcancel', endTouch);
  }
  // ---- gamepad (Xbox / PlayStation / MFi via the standard Gamepad API) ----
  pollGamepad(){
    if(this._gpBroken) return {gx:0, gy:0};
    let gps = [];
    try{
      gps = (typeof navigator!=='undefined' && navigator.getGamepads) ? (navigator.getGamepads()||[]) : [];
    }catch(e){
      this._gpBroken = true;   // some browsers refuse the Gamepad API here — play on without it
      return {gx:0, gy:0};
    }
    let gp = null;
    for(const g of gps){ if(g && g.connected){ gp = g; break; } }
    this.gpActive = !!gp;
    if(!gp){ this._gpPrev = null; this.gpJumpHeld = false; return {gx:0, gy:0}; }
    const dz = v => Math.abs(v) > 0.22 ? v : 0;
    let gx = dz(gp.axes[0]||0), gy = dz(gp.axes[1]||0);
    const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed);
    if(b(14)) gx = -1; if(b(15)) gx = 1;   // d-pad left/right
    if(b(12)) gy = -1; if(b(13)) gy = 1;   // d-pad up/down
    const prev = this._gpPrev || {};
    const edge = i => b(i) && !prev[i];
    if(edge(0)){ this.jumpEdge = true; this.anyEdge = true; }      // A / Cross
    this.gpJumpHeld = b(0);
    if(edge(2)){ this.attackEdge = true; this.anyEdge = true; }    // X / Square
    if(edge(1) || edge(5)){ this.poundEdge = true; this.anyEdge = true; } // B / Circle / RB
    if(edge(3)){ this.interactEdge = true; this.anyEdge = true; }  // Y / Triangle
    if(edge(9)){ this.pauseEdge = true; this.anyEdge = true; }     // Start / Options
    const np = {};
    for(let i=0;i<gp.buttons.length;i++) np[i] = b(i);
    this._gpPrev = np;
    return {gx, gy};
  }
  // called by UI buttons
  pressJump(){ this.jumpEdge=true; this._touchJumpHeld=true; this.anyEdge=true; }
  releaseJump(){ this._touchJumpHeld=false; }
  pressAttack(){ this.attackEdge=true; this.anyEdge=true; }
  pressPound(){ this.poundEdge=true; this.anyEdge=true; }
  pressInteract(){ this.interactEdge=true; this.anyEdge=true; }

  update(){
    const gpad = this.pollGamepad();
    // keyboard move
    let kx = (this.keys['KeyD']||this.keys['ArrowRight']?1:0) - (this.keys['KeyA']||this.keys['ArrowLeft']?1:0);
    let ky = (this.keys['KeyS']||this.keys['ArrowDown']?1:0) - (this.keys['KeyW']||this.keys['ArrowUp']?1:0);
    if(gpad.gx!==0 || gpad.gy!==0){ kx = gpad.gx; ky = gpad.gy; }
    if(this._stick.active){
      const dx = this._stick.x-this._stick.ox, dy = this._stick.y-this._stick.oy;
      const r = 52;
      kx = clamp(dx/r,-1,1); ky = clamp(dy/r,-1,1);
      const len = Math.hypot(kx,ky);
      if(len>1){ kx/=len; ky/=len; }
      if(len<0.16){ kx=0; ky=0; }
    } else {
      const len = Math.hypot(kx,ky);
      if(len>1){ kx/=len; ky/=len; }
    }
    this.moveX=kx; this.moveY=ky;
    this.jumpHeld = (this.isTouch ? !!this._touchJumpHeld : !!this.keys['Space']) || !!this.gpJumpHeld;
  }
  endFrame(){
    this.jumpEdge=false; this.attackEdge=false; this.poundEdge=false;
    this.interactEdge=false; this.pauseEdge=false; this.anyEdge=false;
    this.camDX=0; this.camDY=0;
  }
}
const INPUT = new InputSys();

window.INPUT = INPUT;

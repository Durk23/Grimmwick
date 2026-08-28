// ============ AUDIO — WebAudio synthesized SFX + spooky waltz ============
class AudioSys {
  constructor(){
    this.ctx = null;
    this.sfxVol = 0.8; this.musVol = 0.5;
    this.musicOn = true; this.sfxOn = true;
    this._musicTimer = null;
    this._step = 0;
  }
  init(){
    if(this.ctx) return;
    try{
      this.ctx = new (window.AudioContext||window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 1; this.master.connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain(); this.sfxBus.gain.value = this.sfxVol; this.sfxBus.connect(this.master);
      this.musBus = this.ctx.createGain(); this.musBus.gain.value = this.musVol; this.musBus.connect(this.master);
      // gentle echo for spookiness
      const dly = this.ctx.createDelay(0.6); dly.delayTime.value = 0.28;
      const fb = this.ctx.createGain(); fb.gain.value = 0.25;
      const wet = this.ctx.createGain(); wet.gain.value = 0.18;
      this.musBus.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(this.master);
      this.startMusic();
    }catch(e){ console.warn('audio unavailable', e); }
  }
  resume(){ if(this.ctx && this.ctx.state==='suspended') this.ctx.resume(); }
  setSfxVol(v){ this.sfxVol=v; if(this.sfxBus) this.sfxBus.gain.value=v; }
  setMusVol(v){ this.musVol=v; if(this.musBus) this.musBus.gain.value=v; }

  tone({f=440, f2, type='sine', t=0.15, vol=0.5, attack=0.004, bus, slideT}){
    if(!this.ctx || !this.sfxOn) return;
    const c = this.ctx, now = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, now);
    if(f2!==undefined) o.frequency.exponentialRampToValueAtTime(Math.max(f2,1), now+(slideT||t));
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now+attack);
    g.gain.exponentialRampToValueAtTime(0.001, now+t);
    o.connect(g); g.connect(bus||this.sfxBus);
    o.start(now); o.stop(now+t+0.05);
  }
  noise({t=0.2, vol=0.4, fFrom=3000, fTo=300}){
    if(!this.ctx || !this.sfxOn) return;
    const c = this.ctx, now = c.currentTime;
    const len = Math.floor(c.sampleRate*t);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
    const src = c.createBufferSource(); src.buffer = buf;
    const flt = c.createBiquadFilter(); flt.type='lowpass';
    flt.frequency.setValueAtTime(fFrom, now);
    flt.frequency.exponentialRampToValueAtTime(Math.max(fTo,40), now+t);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now+t);
    src.connect(flt); flt.connect(g); g.connect(this.sfxBus);
    src.start(now);
  }
  // ---- sfx library ----
  jump(){ this.tone({f:330,f2:660,type:'square',t:0.16,vol:0.16}); }
  djump(){ this.tone({f:440,f2:880,type:'square',t:0.18,vol:0.16}); this.tone({f:660,f2:990,type:'sine',t:0.14,vol:0.1}); }
  land(){ this.noise({t:0.08,vol:0.14,fFrom:900,fTo:200}); }
  pound(){ this.tone({f:520,f2:80,type:'sawtooth',t:0.22,vol:0.2}); }
  poundHit(){ this.noise({t:0.25,vol:0.4,fFrom:1200,fTo:80}); this.tone({f:90,f2:40,type:'sine',t:0.3,vol:0.5}); }
  swing(){ this.noise({t:0.12,vol:0.2,fFrom:4000,fTo:800}); }
  candy(n=0){ const f=[784,880,988,1175][n%4]; this.tone({f,f2:f*1.5,type:'sine',t:0.12,vol:0.14}); }
  heart(){ this.tone({f:523,f2:784,type:'sine',t:0.3,vol:0.25}); this.tone({f:659,f2:1046,type:'sine',t:0.35,vol:0.18}); }
  hurt(){ this.tone({f:280,f2:120,type:'sawtooth',t:0.25,vol:0.3}); this.noise({t:0.15,vol:0.2,fFrom:2000,fTo:300}); }
  stomp(){ this.tone({f:700,f2:200,type:'square',t:0.15,vol:0.25}); this.noise({t:0.1,vol:0.2,fFrom:2500,fTo:400}); }
  enemyPoof(){ this.noise({t:0.3,vol:0.25,fFrom:1800,fTo:200}); this.tone({f:600,f2:150,type:'triangle',t:0.25,vol:0.15}); }
  bounce(){ this.tone({f:200,f2:520,type:'sine',t:0.2,vol:0.3}); }
  ghostGiggle(){ const b=880; [0,0.09,0.18].forEach((d,i)=>setTimeout(()=>this.tone({f:b*(1+i*0.12),f2:b*(1.3+i*0.12),type:'sine',t:0.1,vol:0.12}),d*1000)); }
  checkpoint(){ [523,659,784].forEach((f,i)=>setTimeout(()=>this.tone({f,f2:f*1.2,type:'triangle',t:0.2,vol:0.2}),i*90)); }
  goldPumpkin(){ [523,659,784,1046,1318].forEach((f,i)=>setTimeout(()=>this.tone({f,type:'triangle',t:0.3,vol:0.22}),i*100)); }
  ui(){ this.tone({f:600,f2:800,type:'sine',t:0.07,vol:0.12}); }
  buy(){ [660,880,1100].forEach((f,i)=>setTimeout(()=>this.tone({f,type:'sine',t:0.15,vol:0.18}),i*70)); }
  portal(){ this.tone({f:200,f2:900,type:'sine',t:0.7,vol:0.2}); this.tone({f:150,f2:600,type:'triangle',t:0.7,vol:0.15}); }
  bossRoar(){ this.tone({f:150,f2:60,type:'sawtooth',t:0.7,vol:0.4}); this.noise({t:0.6,vol:0.3,fFrom:800,fTo:100}); }
  bossHit(){ this.tone({f:400,f2:100,type:'square',t:0.3,vol:0.35}); this.noise({t:0.3,vol:0.3,fFrom:2000,fTo:200}); }
  shockwave(){ this.noise({t:0.4,vol:0.35,fFrom:600,fTo:60}); }
  victory(){ [523,659,784,1046,784,1046,1318].forEach((f,i)=>setTimeout(()=>this.tone({f,type:'square',t:0.22,vol:0.16}),i*130)); }
  gameover(){ [400,350,300,200].forEach((f,i)=>setTimeout(()=>this.tone({f,f2:f*0.8,type:'triangle',t:0.4,vol:0.2}),i*250)); }

  // ---- mood-driven music: hub waltz / level adventure / boss drive ----
  setMood(m){
    this.mood = m;
    this._step = 0;
  }
}
const AUDIO = new AudioSys();
window.AUDIO = AUDIO;   // exposed like window.UI — used by tooling (preview recorder) and console debugging


// ================= richer procedural score =================
AudioSys.prototype.startMusic = function(){
  if(this._musicTimer || !this.ctx) return;
  this.mood = this.mood || 'hub';
  const MOODS = {
    hub:   { step:0.22, bass:[147,0,0,110,0,0,131,0,0,98,0,0], chords:[[220,262],[175,220],[196,247],[165,196]],
             lead:[294,0,349,330,0,294,262,0,294,247,0,220,294,0,349,392,0,440,349,0,330,294,0,262],
             drums:false, leadType:'sine', vib:5.5, vol:1.0 },
    level: { step:0.155, bass:[110,110,0,110,131,0,98,98,0,98,117,0,87,87,0,87,110,0,98,98,0,98,131,0],
             chords:[[220,262,330],[196,247,294],[175,220,262],[196,247,294]],
             lead:[330,0,392,440,392,0,330,294,0,330,392,0,440,0,523,494,440,0,392,330,0,294,330,0],
             drums:true, leadType:'triangle', vib:4, vol:0.9 },
    boss:  { step:0.125, bass:[98,98,98,104,98,98,98,93,98,98,98,104,110,110,104,98],
             chords:[[196,233],[185,233],[196,247],[175,220]],
             lead:[392,0,466,0,392,440,0,392,0,466,523,0,466,440,0,392],
             drums:true, leadType:'sawtooth', vib:7, vol:0.85 },
  };
  let step = 0;
  const tick = ()=>{
    this._lastTick = performance.now();   // heartbeat for the main-loop watchdog — a silent death gets restarted
    if(!this.musicOn || !this.ctx){ this._musicTimer = setTimeout(tick, 250); return; }   // keep the loop alive while muted — a bare return kills music forever
    const M = MOODS[this.mood] || MOODS.hub;
    const c = this.ctx, now = c.currentTime;
    const n = step;
    // bass
    const b = M.bass[n % M.bass.length];
    if(b) this.tone({f:b, type:'triangle', t:M.step*1.8, vol:0.34*M.vol, bus:this.musBus});
    // chords: offbeat plucks
    const bar = Math.floor(n / 8) % M.chords.length;
    if(n % (M.drums?4:6) === 2){
      for(const f of M.chords[bar]) this.tone({f, type:'sine', t:M.step*1.5, vol:0.07*M.vol, bus:this.musBus});
    }
    // lead with vibrato
    const L = M.lead[n % M.lead.length];
    if(L && Math.floor(n / M.lead.length) % 2 === 0){
      const o=c.createOscillator(), g=c.createGain(), lfo=c.createOscillator(), lg=c.createGain();
      o.type=M.leadType; o.frequency.value=L;
      lfo.frequency.value=M.vib; lg.gain.value=4; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.11*M.vol, now+0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now+M.step*1.9);
      o.connect(g); g.connect(this.musBus);
      o.start(now); lfo.start(now); o.stop(now+M.step*2); lfo.stop(now+M.step*2);
    }
    // drums: soft kick on beat, noise hat on offbeats
    if(M.drums){
      if(n % 4 === 0) this.tone({f:120, f2:45, type:'sine', t:0.12, vol:0.3, bus:this.musBus});
      if(n % 2 === 1) this.noiseHat(0.05, 0.05);
    }
    step++;
    this._musicTimer = setTimeout(tick, ((MOODS[this.mood]||MOODS.hub).step)*1000);
  };
  this._musicTimer = setTimeout(tick, 50);
};
AudioSys.prototype.noiseHat = function(t, vol){
  if(!this.ctx || !this.musicOn) return;
  const c=this.ctx, now=c.currentTime;
  const len=Math.floor(c.sampleRate*t);
  const buf=c.createBuffer(1,len,c.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len);
  const src=c.createBufferSource(); src.buffer=buf;
  const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6000;
  const g=c.createGain(); g.gain.value=vol;
  src.connect(hp); hp.connect(g); g.connect(this.musBus);
  src.start(now);
};
// candy combo: rising pentatonic run that resets after a pause (DKC-style)
AudioSys.prototype.candy = function(){
  const now = performance.now();
  if(!this._comboT || now - this._comboT > 1200) this._combo = 0;
  this._comboT = now;
  const scale = [784, 880, 988, 1175, 1319, 1568, 1760, 1976];
  const f = scale[Math.min(this._combo, scale.length-1)];
  this._combo = (this._combo||0) + 1;
  this.tone({f, f2:f*1.4, type:'sine', t:0.11, vol:0.15});
};
AudioSys.prototype.oneUp = function(){
  [523,659,784,1046,1319].forEach((f,i)=>setTimeout(()=>this.tone({f,type:'triangle',t:0.18,vol:0.2}),i*90));
};

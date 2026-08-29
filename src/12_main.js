// ============ MAIN — game state, scenes, save, loop ============

// ---- safe storage (works in app, browser, and sandboxed previews) ----
const Store = {
  mem:{},
  get(k){ try{ return localStorage.getItem(k) ?? this.mem[k] ?? null; }catch(e){ return this.mem[k] ?? null; } },
  set(k,v){ this.mem[k]=v; try{ localStorage.setItem(k,v); }catch(e){} },
  del(k){ delete this.mem[k]; try{ localStorage.removeItem(k); }catch(e){} },
};

const G = {
  state:'boot', area:'hub', mode:'free',
  time:0, fps:60,
  save:null,
  spawnPoint: new THREE.Vector3(0,1,8),
  checkpoint: new THREE.Vector3(0,1,8),
  runPumpkins:[false,false,false],
  runCandy0:0, runT0:0,
  _dirty:false,
  boss:null,

  loadSave(){
    try{
      const raw = Store.get('grimmwick_save') || Store.get('hollowville_save');
      if(raw) this.save = JSON.parse(raw);
    }catch(e){}
    if(!this.save || !this.save.owned){
      this.save = { candy:0, embers:0, worlds:{}, gp:{}, owned:['kid'], equipped:'kid', seenIntro:false, maxHearts:3 };
    }
    if(!this.save.maxHearts) this.save.maxHearts = 3;
    if(this.save.upMagnet===undefined) this.save.upMagnet = 0;
    if(!this.save.claimed) this.save.claimed = [];
    if(this.save.candyLifetime===undefined) this.save.candyLifetime = this.save.candy||0;   // old saves: seed with the balance
    if(this.save.playT===undefined) this.save.playT = 0;
    if(this.save.damageLifetime===undefined){
      this.save.damageLifetime = 0;
      // a save with real progress predates damage tracking — its counter starts false-zero. Fastest Night
      // stays fair (playT is honest) but the damage tiebreak goes worst-case and Pure Night is off-limits.
      if(Object.keys(this.save.levels||{}).length > 0 || (this.save.playT||0) > 60) this.save.dmgUntracked = true;   // damage AND deaths both started false-zero on these saves
    }
    if(this.save.deathsLifetime===undefined) this.save.deathsLifetime = 0;
    // legacy saves that already beat Grimm (finished before the Night Board existed): GRANDFATHER them in.
    // Their clock is playT at migration — honest or WORSE (includes post-game wandering), and the unknowable
    // stats take worst-case tiebreaks, so the entry can never rank unfairly high. A fresh run replaces it.
    if(this.save.nightDone===undefined) this.save.nightDone = (this.save.embers||0) >= 5;
    if(this.save.nightDone && this.save.nightT===undefined){
      this.save.nightT = this.save.playT||0;
      this.save.nightDmg = 999; this.save.nightDeaths = 99;
      this.save.nightCandy = this.save.candyLifetime||0;
      this.save.nightEligible = (this.save.playT||0) > 60;
      this.save.nightSubmitted = true;
      if(this.save.nightEligible){
        const cs = Math.round(this.save.nightT*100);
        const stars = Object.values(this.save.levels||{}).reduce((s,l)=>s + (l.stars ? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
        const q = this.save.pendingScores || (this.save.pendingScores = {});
        q['grimmwick.night'] = { v: cs*1e9 + 99*1e7 + 999*1e4 + (9999 - Math.min(this.save.nightCandy||0,9999)), c: stars };
      }
    }
    if(this.save.lives===undefined) this.save.lives = 5;
    if(this.save.cozy===undefined) this.save.cozy = false;
    if(this.save.tutDone===undefined) this.save.tutDone = false;
    if(!this.save.owned.includes('kid')) this.save.owned.unshift('kid');
    if(this.save.mask===undefined) this.save.mask = null;        // the wardrobe's mask slot
    if(!this.save.ownedMasks) this.save.ownedMasks = [];
    if(this.save.mask && typeof MASKS!=='undefined' && !MASKS[this.save.mask]) this.save.mask = null;              // curated away
    if(this.save.equipped && typeof COSTUMES!=='undefined' && !COSTUMES[this.save.equipped]) this.save.equipped = 'kid';
    if(this.save.pass===undefined) this.save.pass = false;
    if(this.save.seenShop===undefined) this.save.seenShop = !!this.save.metMayor;   // the cauldron tour is for brand-new players only
    if(!this.save.levels) this.save.levels = {};
    if(!this.save.best) this.save.best = {};
    // pre-level-select saves: a beaten World 1 counts as all five levels cleared
    if(this.save.worlds.w1 && !Object.keys(this.save.levels).length){
      for(const id of ['w1l1','w1l2','w1l3','w1l4','w1l5']) this.save.levels[id] = {done:true, stars:{}, best:null};
    }
  },
  persist(){ Store.set('grimmwick_save', JSON.stringify(this.save)); },
  resetSave(){
    // a reset clears PROGRESS, never PROPERTY: costumes, masks, the Star Crown, and the Pass survive.
    // (This also makes Reset Save the official fresh-run button for the Flawless Night board.)
    const w = this.save || {};
    const fresh = { candy:0, embers:0, worlds:{}, gp:{},
      owned: w.owned||['kid'], equipped: w.equipped||'kid',
      ownedMasks: w.ownedMasks||[], mask: w.mask||null,
      pass: !!w.pass, seenIntro:false, maxHearts:3 };
    Store.set('grimmwick_save', JSON.stringify(fresh));
    Store.del('hollowville_save');
  },

  addCandy(n){
    this.save.candy += n;
    this.save.candyLifetime = (this.save.candyLifetime||0) + n;   // total ever collected — spending never subtracts
    this._dirty = true;
    UI.updateHUD();
  },
  setCheckpoint(x,y,z){ this.checkpoint.set(x,y,z); },
  collectGoldPumpkin(idx){
    this.runPumpkins[idx] = true;
    UI.updateHUD();
    UI.toast('🎃 Golden Pumpkin! ('+this.runPumpkins.filter(Boolean).length+'/3)');
  },

  // ---------- scene management ----------
  initRenderer(){
    this.renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
    this.basePR = Math.min(devicePixelRatio||1, 2);
    this.renderer.setPixelRatio(this.basePR);
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.62;   // brighter overall so surfaces POP (the dark sky/fog stays moody)
    document.body.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 260);
    this.camc = new CamCtrl(this.camera);
    addEventListener('resize', ()=>{
      this.camera.aspect = innerWidth/innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  },
  freshScene(fogNear, fogFar){
    const s = new THREE.Scene();
    s.background = new THREE.Color(PAL.night);
    s.fog = new THREE.Fog(PAL.fog, fogNear, fogFar);
    const hemi = new THREE.HemisphereLight(0xb0a6e8, 0x5f4d86, 2.0);   // stronger fill + lighter ground-bounce so FLOORS/surfaces read (was 1.35, floors went too dark)
    const moonL = new THREE.DirectionalLight(0xbcc8ff, 1.55);          // brighter moon for surface definition
    moonL.position.set(30,50,-20);
    s.add(hemi, moonL);
    // stars
    const starGeo = new THREE.BufferGeometry();
    const sp = [];
    for(let i=0;i<380;i++){
      const a=rand(TAU), b=rand(0.05,1.2), r=150;
      sp.push(Math.cos(a)*Math.cos(b)*r, Math.sin(b)*r, Math.sin(a)*Math.cos(b)*r);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp,3));
    s.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xcfd4ff, size:0.5, sizeAttenuation:false})));
    // GRAPHICS LIFT (owner call, Aug 2026 — "a minor upgrade as a whole game"): a second layer of
    // brighter warm-tinted stars, faint nebula washes, and a deeper layered moon glow. One shared
    // function → every area in the game gets the richer night at zero per-level cost.
    const starGeo2 = new THREE.BufferGeometry();
    const sp2 = [];
    for(let i=0;i<120;i++){
      const a=rand(TAU), b=rand(0.08,1.25), r=149;
      sp2.push(Math.cos(a)*Math.cos(b)*r, Math.sin(b)*r, Math.sin(a)*Math.cos(b)*r);
    }
    starGeo2.setAttribute('position', new THREE.Float32BufferAttribute(sp2,3));
    s.add(new THREE.Points(starGeo2, new THREE.PointsMaterial({color:0xffe9c4, size:1.1, sizeAttenuation:false, transparent:true, opacity:0.9})));
    for(const [nx,ny,nc,nr,no] of [[-70,45,0x6a4fd0,34,0.05],[80,30,0x2a6a7a,42,0.045],[-20,70,0x8a3a6a,30,0.04]]){
      const neb = new THREE.Mesh(geo('circ',nr,20), new THREE.MeshBasicMaterial({color:nc, transparent:true, opacity:no, blending:THREE.AdditiveBlending, depthWrite:false}));
      neb.position.set(nx,ny,-120); neb.lookAt(0,0,0); s.add(neb);
    }
    // moon + layered halo
    const moon = new THREE.Mesh(geo('circ',9,24), new THREE.MeshBasicMaterial({color:PAL.moon}));
    moon.position.set(55,62,-95); moon.lookAt(0,0,0);
    const halo = new THREE.Mesh(geo('circ',14,24), new THREE.MeshBasicMaterial({color:PAL.moon, transparent:true, opacity:0.16}));
    halo.position.copy(moon.position).multiplyScalar(1.01); halo.lookAt(0,0,0);
    const halo2 = new THREE.Mesh(geo('circ',22,24), new THREE.MeshBasicMaterial({color:0xd8ceff, transparent:true, opacity:0.07, blending:THREE.AdditiveBlending, depthWrite:false}));
    halo2.position.copy(moon.position).multiplyScalar(1.02); halo2.lookAt(0,0,0);
    const crater = new THREE.Mesh(geo('circ',1.7,12), new THREE.MeshBasicMaterial({color:0xe8dba8}));
    crater.position.copy(moon.position).multiplyScalar(0.99); crater.position.x-=2.5; crater.position.y+=2; crater.lookAt(0,0,0);
    s.add(moon, halo, halo2, crater);
    return s;
  },
  switchArea(area){
    const def = findLevel(area);
    this.area = area;
    this.levelDef = def || null;
    this.mode = (area==='hub') ? 'free' : 'side';
    this._entering = false;
    this.boss = null;
    if(window.UI && UI.hideBossBar) UI.hideBossBar();   // pause-menu exits skip defeat(), which was the only other hider
    // drop refs into the outgoing scene graph — any one of these pins the WHOLE dead scene (and its GPU buffers) in memory
    this.lvlPortal = this.warpPortal = this.tutPortal = this._gateGlow = null;
    this.hubEmber = this.hubEmberLight = this.hubLamps = this.gates = this.mayor = this.mayorHome = this.brewMesh = this.hubBoos = null;
    this.hubBraziers = this.hubSmoke = this.hubFlies = this.hubLeaves = this.hubCat = this.hubWindows = this.hubWellGlow = this.hubGuide = null;
    this.signs = this.coffins = this.bats = this.amb = null;
    if(this.ents) this.ents.clear();
    if(this.fx) this.fx.clear();
    const isBossArea = area.startsWith('boss');
    if(isBossArea) this.bossDistrict = 'w'+area.slice(4);   // keep bossDistrict correct even on debug ?scene= jumps
    this.scene = this.freshScene(isBossArea?14:20, isBossArea?70:95);
    this.world = this.world || new PhysWorld();
    this.world.reset();
    this.ents = new EntityMgr(this.scene);
    this.fx = new Particles(this.scene);
    AUDIO.setMood(area==='hub' ? 'hub' : (isBossArea ? 'boss' : 'level'));
    srand(seedFrom(area));   // deco scatter is seeded per area — a level replays IDENTICALLY, pebble for pebble
    if(area==='hub') buildHub(this);
    else if(area==='boss1') buildBossArena(this);
    else if(area==='boss2' && typeof buildBossArena2==='function') buildBossArena2(this);
    else if(area==='boss3' && typeof buildBossArena3==='function') buildBossArena3(this);
    else if(area==='boss4' && typeof buildBossArena4==='function') buildBossArena4(this);
    else if(area==='boss5' && typeof buildBossArena5==='function') buildBossArena5(this);
    else if(area==='tut') buildTutorial(this);
    else if(def) def.build(this);
    // all-candy star baseline: what the build itself placed
    this.levelCandyTotal = 0;
    for(const e of this.ents.list) if(e instanceof Candy){ this.levelCandyTotal++; e._placed = true; }
    // player
    this.player = new Player(this.scene, this);
    this.player.pos.copy(this.spawnPoint);
    this.checkpoint.copy(this.spawnPoint);
    // remove already-collected golden pumpkins
    const got = this.save.gp[def ? def.district : 'w1']||[];
    for(const e of this.ents.list){
      if(e instanceof GoldPumpkin && got[e.idx]) e.dead = true;
      if(e instanceof GoldPumpkin && this.runPumpkins[e.idx]) e.dead = true;
    }
    if(this.mode==='side') this.camc.snapSide(this.player);
    else this.camc.snapBehind(this.player.pos, Math.atan2(this.player.pos.x, this.player.pos.z)+0);
    UI.updateHUD();
  },
  // ---------- flow ----------
  begin(){
    UI.hideTitle();
    this.save.seenIntro = true;
    this.persist();
    if(!this.save.tutDone){
      this._tutDone = false;
      this.state='transition';
      UI.fade(true, 350);
      setTimeout(()=>{
        this.switchArea('tut');
        this.state='play';
        UI.fade(false, 450);
        UI.levelIntro("GRAN'S BACKYARD", 'Learn the moves, little boo!');
      }, 400);
      return;
    }
    this.state='play';
    UI.fade(false, 700);
    UI.toast('Find Mayor Boo by the Everflame 👻');
  },
  finishTutorial(){
    this.save.tutDone = true;
    this.persist();
    AUDIO.checkpoint();
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      this.switchArea('hub');
      this.state='play';
      UI.fade(false, 450);
      UI.toast("🧵 \"That's my little hero.\" Find Mayor Boo by the Everflame 👻");
    }, 500);
  },
  enterLevel(id){
    const def = findLevel(id);
    if(!def){ if(this.state==='map') this.state='play'; UI.toast('🌘 That road is still dark...'); return; }
    if(UI.hideMap) UI.hideMap();
    if(this.mapView){ this.mapView.dispose && this.mapView.dispose(); this.mapView = null; }
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      this.currentLevel = id;
      // seed with banked district pumpkins so the HUD count and spawn filter stay honest
      this.runPumpkins = (this.save.gp[def.district]||[false,false,false]).slice();
      this.runCandy0=this.save.candy; this.runT0=this.time;
      this.runT = 0;   // per-level clock — only ticks while actually playing
      this.runCandyPicked = 0;
      this.runDamage = 0;
      this.runCozy = !!this.save.cozy;
      this.save.lives = 5; this.save.lastLevel = id; this.persist();
      this.switchArea(id);
      this.state='play';
      UI.fade(false, 450);
      const dWorld = (typeof WORLDS!=='undefined') ? WORLDS.find(x=>x.key===def.district) : null;
      const dList = (typeof LEVEL_LISTS!=='undefined') ? LEVEL_LISTS.find(L=>L.includes(def)) : null;
      const dNum = dList ? dList.indexOf(def)+1 : 1;
      UI.levelIntro(def.name, (dWorld?dWorld.name:'Grimmwick')+' · Level '+dNum);
    }, 500);
  },
  completeLevel(opts={}){
    if(this.state!=='play' || !this.levelDef) return;
    const def = this.levelDef, id = def.id;
    this.state='levelclear';
    AUDIO.checkpoint(); AUDIO.goldPumpkin();
    const secsF = Math.round((this.runT||0)*100)/100;   // bests keep centiseconds — the district boards deserve real precision
    const secs = Math.floor(secsF);
    const collected = this.runCandyPicked||0;
    const skip = opts.warp||opts.leap;   // secret finishes honor their promised rewards
    const stars = {
      time: skip ? true : secs <= def.parTime,
      candy: skip ? true : collected >= this.levelCandyTotal,
      clean: opts.leap ? true : (this.runDamage||0)===0,
    };
    const rec = this.save.levels[id] || (this.save.levels[id] = {done:false, stars:{}, best:null});
    rec.done = true;
    const isRecord = !this.runCozy && secsF>=3 && (!rec.best || secsF<rec.best);
    if(!this.runCozy){
      rec.stars.time = rec.stars.time||stars.time;
      rec.stars.candy = rec.stars.candy||stars.candy;
      rec.stars.clean = rec.stars.clean||stars.clean;
      if(isRecord) rec.best = secsF;
    }
    // bank golden pumpkins at every clear — no longer lost if you stop before the boss
    const prev = this.save.gp[def.district]||[false,false,false];
    this.save.gp[def.district] = prev.map((v,i)=>v||this.runPumpkins[i]);
    this.persist();
    // next level comes from the level's OWN district registry (W1_LEVELS-only lookup left D2-5 with no NEXT button)
    const list = (typeof LEVEL_LISTS!=='undefined') ? (LEVEL_LISTS.find(L=>L.includes(def))||W1_LEVELS) : W1_LEVELS;
    const idx = list.indexOf(def);
    const nextId = (idx>=0 && idx<list.length-1) ? list[idx+1].id : null;
    const fmt = t => Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
    const stats = { levelId:id, levelName:def.name, time:fmt(secs), best:fmt(rec.best||secs), isRecord,
      stars, candy:collected, candyTotal:this.levelCandyTotal, nextId, cozy:this.runCozy };
    window.NightBoard && NightBoard.onLevelClear(this, id);
    setTimeout(()=>UI.levelClear(stats), 1500);   // let the gate celebration land before the card
  },
  openMap(district){
    if(this.state!=='play') return;
    this.state='map';
    this.mapView = ((district||'w1')==='w1' && typeof buildMapScene==='function') ? buildMapScene(this, district||'w1') : null;   // 3D "beautiful map" is Patch-only for now; other districts use the clean DOM map
    UI.showMap(district||'w1');
  },
  closeMap(){
    if(UI.hideMap) UI.hideMap();
    if(this.mapView){ this.mapView.dispose && this.mapView.dispose(); this.mapView = null; }
    if(this.state==='map') this.state='play';
    // step BACK OUT of the gate: closing while standing in the portal's auto-enter radius
    // instantly re-opened the map (the first-visit exit trap) — nudge Pip toward town
    if(this.area==='hub' && this.player && this.gates){
      for(const gate of this.gates){
        const dx=this.player.pos.x-gate.x, dz=this.player.pos.z-gate.z, d=Math.hypot(dx,dz);
        if(d<2.4){
          let ux=dx/(d||1), uz=dz/(d||1);
          if(d<0.1){ const gm=Math.hypot(gate.x,gate.z)||1; ux=-gate.x/gm; uz=-gate.z/gm; }   // standing dead-center: step toward town
          this.player.pos.x = gate.x+ux*3.2; this.player.pos.z = gate.z+uz*3.2;
          this.camc.snapBehind && this.camc.snapBehind(this.player.pos);
          break;
        }
      }
    }
  },
  toMap(district){
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      this.switchArea('hub');
      this.state='map';
      this.mapView = ((district||'w1')==='w1' && typeof buildMapScene==='function') ? buildMapScene(this, district||'w1') : null;
      UI.showMap(district||'w1');
      UI.fade(false, 450);
    }, 500);
  },
  bossAreaFor(district){ return ({w1:'boss1',w2:'boss2',w3:'boss3',w4:'boss4',w5:'boss5'})[district]; },
  bossBuilt(area){ return area==='boss1' || (area==='boss2' && typeof buildBossArena2==='function') || (area==='boss3' && typeof buildBossArena3==='function') || (area==='boss4' && typeof buildBossArena4==='function') || (area==='boss5' && typeof buildBossArena5==='function'); },
  startBoss(district){
    // district-aware boss router (the map's boss node calls this). Defers politely if a boss isn't built yet.
    district = district || 'w1';
    const area = this.bossAreaFor(district);
    if(!area || !this.bossBuilt(area)){ UI.toast('🔒 That guardian is not ready yet. Coming soon!'); return; }
    this.bossDistrict = district;
    if(UI.hideMap) UI.hideMap();
    if(this.mapView){ this.mapView.dispose && this.mapView.dispose(); this.mapView = null; }
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      // a fresh guardian attempt: its own clock, damage tally, and full lives
      this.runCandy0=this.save.candy; this.runT0=this.time;
      this.runT=0; this.runCandyPicked=0; this.runDamage=0; this.runCozy=!!this.save.cozy;
      this.runPumpkins=(this.save.gp[district]||[false,false,false]).slice();
      this.save.lives=5; this.persist();
      this.switchArea(area);
      this.state='play';
      UI.fade(false, 450);
    }, 500);
  },
  returnToHub(afterVictory){
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      this.switchArea('hub');
      this.state='play';
      UI.fade(false, 450);
      if(afterVictory) UI.toast(this.save.embers>=5 ? '🎆 THE EVERFLAME BURNS WHOLE! The festival is ON! Happy Halloween, Grimmwick!' : '🔥 The Everflame flickers a little brighter...');
    }, 500);
  },
  onPlayerFell(){
    const pl = this.player;
    pl.group.visible = true;   // the pit eruption hides him mid-fall — always restore, even into death
    pl._pitPy = undefined;
    if(pl.dead) return;
    pl.damage(1);
    if(!pl.dead){
      const h = pl.hearts;             // falls hurt — respawn must not refill
      pl.respawn(this.checkpoint);
      pl.hearts = h;
      UI.updateHUD();
      if(this.mode==='side') this.camc.snapSide(pl); else this.camc.snapBehind(pl.pos);
    }
  },
  onPlayerDeath(){
    this.save.deathsLifetime = (this.save.deathsLifetime||0) + 1;   // Night Board tiebreaker
    this.save.lives = Math.max(0, (this.save.lives??5)-1);
    this.persist();
    this.state='dead';
    UI.updateHUD();
    setTimeout(()=>{
      if(this.save.lives>0) UI.deathScreen();
      else UI.gameOverScreen();
    }, 900);
  },
  buyPassTest(){
    // TEST-MODE purchase — real StoreKit replaces this at wrap time
    if(this.save.pass) return;
    this.save.pass = true;
    if(!this.save.owned.includes('nightstitch')) this.save.owned.push('nightstitch');
    // grant, don't auto-equip — the player chooses when to wear it (owner call: no surprise costume swap)
    this.persist();
    AUDIO.buy(); AUDIO.goldPumpkin();
    UI.toast('🌙 SPOOK PASS ACTIVE: NIGHTSTITCH unlocked! Equip it any time in the Costume Cauldron.');
  },
  toggleCozy(){
    this.save.cozy = !this.save.cozy;
    if(this.save.cozy) this.runCozy = true;   // turning cozy ON mid-run taints THIS run — no cozy-assisted records/stars (turning it off never untaints)
    this.persist();
    if(this.player){
      this.player.maxHearts = (this.save.maxHearts||3) + (this.save.cozy?2:0);
      if(this.save.cozy) this.player.hearts = Math.min(this.player.hearts+2, this.player.maxHearts);
      else this.player.hearts = Math.min(this.player.hearts, this.player.maxHearts);
    }
    UI.updateHUD();
    UI.toast(this.save.cozy ? '🧸 Cozy Mode ON: extra hearts, gentler enemies. Records paused.' : '🔥 Cozy Mode OFF: full challenge, records live!');
  },
  gameOverRestart(){
    this.save.lives = 5;
    this.persist();
    const gs = document.getElementById('gameover-screen');
    if(gs) gs.style.display='none';
    if(this.area.startsWith('boss')) this.startBoss(this.bossDistrict||'w1');
    else this.enterLevel(this.levelDef ? this.levelDef.id : (this.save.lastLevel||'w1l1'));
  },
  candyContinue(){
    const COST = 500;
    if(this.save.candy < COST) return;
    this.save.candy -= COST;
    this.save.lives = 3;
    this.persist();
    const gs = document.getElementById('gameover-screen');
    if(gs) gs.style.display='none';
    const pl = this.player;
    pl.respawn(this.checkpoint);
    if(this.mode==='side') this.camc.snapSide(pl); else this.camc.snapBehind(pl.pos);
    this.state='play';
    AUDIO.heart();
    UI.updateHUD();
    UI.toast('🍬 The night gives you another chance. 3 lives!');
  },
  reviveHere(){
    const COST = 200;
    if(this.save.candy < COST || !this.player) return;
    this.save.candy -= COST;
    this.persist();
    const ds = document.getElementById('death-screen');
    if(ds) ds.style.display='none';
    const pl = this.player;
    pl.pos.copy(pl.lastSafe || this.checkpoint);
    pl.vel.set(0,0,0);
    pl.dead = false;
    pl.pounding = false;
    pl.iframes = 2.5;
    pl.hearts = Math.min(2, pl.maxHearts);
    this.save.lives = Math.min(9, (this.save.lives??5)+1); // Second Wind refunds the life
    this.state = 'play';
    if(this.mode==='side') this.camc.snapSide(pl); else this.camc.snapBehind(pl.pos);
    AUDIO.heart();
    UI.updateHUD();
    UI.toast('🍬 Second Wind! Right back in the fight!');
  },
  respawnPlayer(){
    const ds = document.getElementById('death-screen');
    if(ds) ds.style.display='none';
    if(this.area.startsWith('boss')){
      // fresh boss fight (rebuild the current boss arena)
      const ba = this.area;
      this.state='transition';
      UI.fade(true,400);
      setTimeout(()=>{ this.switchArea(ba); this.state='play'; UI.fade(false,400); },450);
      return;
    }
    this.player.respawn(this.checkpoint);
    if(this.mode==='side') this.camc.snapSide(this.player); else this.camc.snapBehind(this.player.pos);
    this.state='play';
  },
  onBossDefeated(){
    // record progress; a guardian's blessing refills your lives
    const district = this.bossDistrict || 'w1';
    const bestKey = district+'boss';
    this.save.lives = 5;
    this.save.worlds[district] = true;
    // one ember per freed district — the Everflame grows with each
    this.save.embers = Object.keys(this.save.worlds).filter(k=>this.save.worlds[k]).length;
    const prev = this.save.gp[district]||[false,false,false];
    this.save.gp[district] = prev.map((v,i)=>v||this.runPumpkins[i]);
    this.persist();
    const secsF = Math.round((this.runT||this.time-this.runT0)*100)/100;
    const secs = Math.floor(secsF);
    if(!this.save.best) this.save.best = {};
    // boss-only clock under its own key — legacy full-run bests preserved, never compared
    const prevBest = this.save.best[bestKey];
    const isRecord = !this.runCozy && secsF >= 5 && (!prevBest || secsF < prevBest);   // cozy runs & debug runs don't set records
    if(isRecord) this.save.best[bestKey] = secsF;
    this.persist();
    const fmt = t => Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
    const stats = {
      district,
      candy: this.save.candy-this.runCandy0+0,
      gp: this.runPumpkins.filter(Boolean).length,
      time: fmt(secs),
      best: fmt(this.save.best[bestKey]),
      isRecord,
      dmg: this.runDamage||0,
      cozy: this.runCozy,
      // whole-night totals for the finale card ("candy collected: 0" only counted the boss fight)
      lifeCandy: this.save.candyLifetime||0,
      playT: Math.floor(this.save.playT||0),
    };
    // THE NIGHT BOARD — first full completion locks in the whole-night numbers (Fastest Night spec:
    // total play-clock from New Game to inviting Grimm; damage + candy lifetime counters break ties)
    if(district==='w5' && !this.save.nightDone){
      this.save.nightDone = true;
      this.save.nightEligible = !this.save.nightCozy;   // ANY cozy time during the night = no board entry (Pip still wins his party)
      this.save.nightT = this.save.playT||0;
      this.save.nightDmg = this.save.dmgUntracked ? 999 : (this.save.damageLifetime||0);   // untracked saves take the worst tiebreak, honestly
      this.save.nightDeaths = this.save.dmgUntracked ? 99 : Math.min(this.save.deathsLifetime||0, 99);
      this.save.nightCandy = this.save.candyLifetime||0;
      this.persist();
    }
    window.NightBoard && NightBoard.onBossDefeated(this, district);
    setTimeout(()=>{ this.state='victory'; UI.victoryScreen(stats); }, 4200);
  },
  onEnemyKilled(){},

  // ---------- boot & loop ----------
  boot(){
    this.loadSave();
    this.initRenderer();
    UI.init(this);
    this.switchArea('hub');
    this.state='title';
    UI.showTitle();
    UI.fade(false, 800);
    // try to start the title waltz immediately — native WKWebView usually allows it; browsers that
    // refuse (suspended ctx) keep today's behavior: audio unlocks on the first tap as before
    try { AUDIO.init(); AUDIO.resume(); } catch(e) {}
    // debug hooks
    const params = new URLSearchParams(location.search);
    window.__game = {
      G, errors:[],
      warp:(x,y,z)=>{ G.player.pos.set(x,y,z); G.player.vel.set(0,0,0); },
      state:()=>({state:G.state, area:G.area, pos:G.player&&G.player.pos.toArray().map(v=>+v.toFixed(2)), hearts:G.player&&G.player.hearts, candy:G.save.candy, fps:+G.fps.toFixed(1), ents:G.ents.list.length, boss:G.boss?{hp:G.boss.hp,state:G.boss.state}:null}),
      start:()=>{ if(G.state==='title'){ AUDIO.init(); G.begin(); } },
      scene:(a)=>{ a = (a==='level1') ? 'w1l1' : a; UI.hideTitle(); if(findLevel(a)){ G.save.tutDone=true; G.enterLevel(a); } else { G.switchArea(a); G.state='play'; } },
    };
    addEventListener('error', e=>{ window.__game.errors.push(String(e.message)); });
    if(params.get('test')){
      AUDIO.musicOn = false; AUDIO.sfxOn = false;
      this.save.tutDone = true;
      this.begin();
      if(params.get('scene')) window.__game.scene(params.get('scene'));
    }
    this._last = null; // first RAF timestamp becomes the epoch — never mix clocks
    this._fpsAcc=0; this._fpsN=0; this._lowT=0;
    requestAnimationFrame(t=>this.loop(t));
  },
  loop(now){
    requestAnimationFrame(t=>this.loop(t));
    try{ this._loopBody(now); }
    catch(e){
      console.error(e);
      if(window.__game) __game.errors.push('LOOP: '+String(e).slice(0,200));
      this._loopErrs = (this._loopErrs||0)+1;
      if(this._loopErrs===1 && window.UI && UI.toast) try{ UI.toast('⚠️ A little hiccup! The night is fixing itself…'); }catch(_){}
      try{ this.renderer.render(this.scene, this.camera); }catch(_){}
    }
  },
  _loopBody(now){
    if(this._last===null){ this._last = now; return; }
    let dt = (now-this._last)/1000;
    this._last = now;
    if(dt<=0) return;        // RAF can replay/misorder timestamps — never step backwards
    if(dt>0.05) dt = 0.05;
    // hit-stop: a few frozen frames on big impacts = weight
    if(this.hitstop>0){ this.hitstop -= dt; this.renderer.render(this.scene, this.camera); return; }
    this.time += dt;
    // fps tracking + adaptive quality
    this._fpsAcc += 1/Math.max(dt,1e-4); this._fpsN++;
    if(this._fpsN>=30){
      this.fps = this._fpsAcc/this._fpsN; this._fpsAcc=0; this._fpsN=0;
      if(this.fps<40){ this._lowT++; } else this._lowT=0;
      if(this._lowT>=3 && this.basePR>1){
        this.basePR = Math.max(1, this.basePR-0.5);
        this.renderer.setPixelRatio(this.basePR);
        this._lowT=0;
      }
    }
    INPUT.update();
    if(window.__fr && window.__fr.length<300 && this.player){
      const p=this.player;
      window.__fr.push([+this.time.toFixed(3), +p.pos.x.toFixed(2),+p.pos.y.toFixed(3),+p.pos.z.toFixed(2), +p.vel.x.toFixed(2),+p.vel.y.toFixed(2),+p.vel.z.toFixed(2), p.grounded?1:0, p.hearts, +p.iframes.toFixed(2), p.jumpBuf>0?1:0, p.coyote>0?1:0, this.state]);
    }

    if(this.state==='title'){
      // slow cinematic orbit of the town
      const a = this.time*0.12;
      this.camera.position.set(Math.sin(a)*20, 7.5+Math.sin(this.time*0.3)*1.2, Math.cos(a)*20);
      this.camera.lookAt(0,3,0);
      updateHub(this, dt*0.6);
      this.fx.update(dt);
      if(INPUT.anyEdge && !(window.UI && UI.overlayOpen && UI.overlayOpen())){   // Night Board / How-to over the title swallow the tap-to-start
        AUDIO.init(); AUDIO.resume();
        if(!this.save.seenIntro){ this.state='intro'; UI.startIntro(()=>this.begin()); }
        else this.begin();
      }
    }
    else if(this.state==='play'){
      AUDIO.resume();
      // AUDIO WATCHDOG (owner report: sound dies after minutes on device) — iOS can interrupt/suspend the
      // context (notifications, focus changes) or starve the music timer; if the tick heartbeat goes quiet
      // or the context leaves 'running', restart cleanly. Self-healing within ~4s, no user action needed.
      if(AUDIO.ctx){
        if(AUDIO.ctx.state !== 'running') AUDIO.resume();
        if(AUDIO._lastTick && performance.now() - AUDIO._lastTick > 4000){
          clearTimeout(AUDIO._musicTimer); AUDIO._musicTimer = null; AUDIO._lastTick = performance.now();
          AUDIO.startMusic();
        }
      }
      this.save.playT = (this.save.playT||0) + dt;   // lifetime play clock (persists with the regular save cadence)
      if(this.save.cozy && !this.save.nightDone && !this.save.nightCozy) this.save.nightCozy = true;   // any cozy minute taints the night's board eligibility
      if(INPUT.pauseEdge){ UI.togglePause(); INPUT.endFrame(); return; }
      if(this.area!=='hub' && this.area!=='tut') this.runT = (this.runT||0)+dt;
      this.world.updateMovers(dt);
      this.player.update(dt);
      const eDt = dt * (this.save.cozy ? 0.72 : 1);   // Cozy Mode: enemies at 72% speed
      this.ents.update(eDt, this);
      if(this.boss) this.boss.update(eDt);
      if(this.area==='hub') updateHub(this, dt);
      else if(this.levelDef) this.levelDef.update(this, dt);
      else if(this.area==='tut') updateTutorial(this, dt);
      else { updateBats(this.bats, dt); updateAmbience(this.amb, this.time); UI.setPrompt(null); }
      this.fx.update(dt);
      this.camc.update(dt, this.player, this.world);
      if(this._dirty && Math.floor(this.time)%2===0){ this._dirty=false; this.persist(); }
    }
    else if(this.state==='dead'){
      this.fx.update(dt);
      this.ents.update(dt, this);
    }
    else if(this.state==='victory' || this.state==='paused' || this.state==='shop' || this.state==='intro' || this.state==='map' || this.state==='levelclear'){
      // idle simmer
      if(this.boss && this.state==='victory') this.boss.update(dt*0.5);
      if(this.state==='levelclear' && this.player){   // the gate celebration: victory leap + candy pops keep simming (damage() is state-gated, so the lap is invincible)
        this.world.updateMovers(dt); this.player.update(dt); this.ents.update(dt, this); this.camc.update(dt, this.player, this.world);
      }
      if(this.state==='map'){
        if(UI.mapNav) UI.mapNav();   // gamepad drives the map
        if(this.mapView){ this.mapView.update(dt); UI.positionMapNodes && UI.positionMapNodes(this.mapView); }
      }
      this.fx.update(dt);
    }
    if(this.state==='map' && this.mapView){
      this.mapView.camera.aspect = this.camera.aspect;
      this.mapView.camera.updateProjectionMatrix();
      this.renderer.render(this.mapView.scene, this.mapView.camera);
    } else this.renderer.render(this.scene, this.camera);
    INPUT.endFrame();
  },
};
window.G = G;
G.boot();

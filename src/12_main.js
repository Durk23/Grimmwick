// ============ MAIN — game state, scenes, save, loop ============

// ---- safe storage (works in app, browser, and sandboxed previews) ----
// THE SAVE VAULT (iOS wrap only): every save write also lands in the native SaveVault plugin
// (UserDefaults + iCloud key-value storage), so saves survive app updates AND deletion, and follow
// the player's iCloud account to a new device. localStorage stays the live copy while it exists;
// the vault restores into EMPTY installs only (see loadSave) — same-device play never fights the cloud.
const Vault = ()=> (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SaveVault) || null;
const Store = {
  mem:{},
  get(k){ try{ return localStorage.getItem(k) ?? this.mem[k] ?? null; }catch(e){ return this.mem[k] ?? null; } },
  set(k,v){
    if(G._restoring) return;                       // a vault restore is landing — nothing may stomp it (reload imminent)
    this.mem[k]=v; try{ localStorage.setItem(k,v); }catch(e){}
    // vault write-through: only real saves, and never while the boot-time restore question is unsettled —
    // a virgin boot must never overwrite a real cloud save that just hasn't synced down yet (audit fix)
    if(k==='grimmwick_save' && !G._vaultPending && G._saveVaultable()){
      const V=Vault(); if(V){ try{ V.set({key:k, value:v}).catch(()=>{}); }catch(e){} }
    }
  },
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
    let parsed = false;
    try{
      const raw = Store.get('grimmwick_save') || Store.get('hollowville_save');
      if(raw){ this.save = JSON.parse(raw); parsed = true; }
    }catch(e){}
    // ---- BOOT ORCHESTRATION: vault first, Candy Shop second (audit-hardened — order is law) ----
    // (1) Settle the vault-restore question with cloud write-through suppressed, so a fresh boot can
    //     never overwrite the real cloud copy. The vault is consulted whenever no save with REAL PLAY
    //     (completed levels/worlds) lives here — corrupt saves, virgin saves, and candy-only saves
    //     from a boot-window grant must never block the lifeboat.
    // (2) Only then attach the Candy Shop grant pipe — a purchase recovered at launch can neither block
    //     a restore nor die in the restore's reload (unconfirmed grants re-deliver / replay).
    // (3) The native cloudChanged event re-runs the same adoption when a slow iCloud sync lands late;
    //     until then (or a 2-minute grace) vault writes stay suppressed so the incoming copy is safe.
    { const V = Vault();
      const realPlay = parsed && this.save && !!(Object.keys(this.save.levels||{}).length || Object.keys(this.save.worlds||{}).length || this.save.nightDone);
      this._vaultPending = !!(V && !realPlay);
      const decided = (V && !realPlay)
        ? V.get({}).then(r=>{
            this._adoptVault(r && r.value);   // reloads on success; vetoes or falls through otherwise
            if(r && r.value) this._vaultPending = false;
            else setTimeout(()=>{ this._vaultPending = false; if(this.save) this.persist(); }, 120000);
            // ^ no cloud answer yet: iCloud's first download can land minutes late on a new device —
            //   hold the vault-write gate so this fresh boot can't overwrite the incoming copy
          }).catch(()=>{ this._vaultPending = false; })
        : Promise.resolve();
      if(V){ try{ V.addListener('cloudChanged', d=>this._adoptVault(d && d.value)); }catch(e){} }
      decided.then(()=>this._hookCandyShop()).catch(()=>this._hookCandyShop());
    }
    try{ if(sessionStorage.getItem('gw_vault_restored')){ sessionStorage.removeItem('gw_vault_restored');
      setTimeout(()=>{ if(window.UI) UI.toast('☁️ Your save flew back from the clouds.', 4200); }, 2600); } }catch(e){}
    setTimeout(()=>this._checkForUpdate(), 8000);   // after boot settles; no-op on web and when checked recently
    if(!this.save || !this.save.owned){
      this.save = { candy:0, embers:0, worlds:{}, gp:{}, owned:['kid'], equipped:'kid', seenIntro:false, maxHearts:3 };
    }
    this._migrateSave();
  },
  // every schema backfill lives HERE so both boot and the vault's in-place adoption run the same
  // migrations (audit fix — an adopted older-schema save must never skip a backfill)
  _migrateSave(){
    if(!this.save.maxHearts) this.save.maxHearts = 3;
    if(this.save.upMagnet===undefined) this.save.upMagnet = 0;
    if(!this.save.trickOff) this.save.trickOff = {};   // per-trick equip toggles (owner call: tricks stack — equip any or all)
    if(!this.save.iapSeen) this.save.iapSeen = [];      // granted StoreKit transaction ids — the double-grant guard
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
    if(!this.save.nm) this.save.nm = {levels:{}, v:2};   // NIGHTMARE MODE progress lives apart — the 75 crown stars are never touched
    if(this.save.nm && !this.save.nm.v){
      // pre-1.3 nightmare data predates the cozy guard (shipped 1.2 could bank cozy-assisted bests, and
      // the coronation must never trust them): clears stay remembered, but times + conquest re-prove honestly
      this.save.nm.v = 2;
      this.save.nm.conquered = false;
      for(const k in (this.save.nm.levels||{})) this.save.nm.levels[k].best = null;
    }
    // legacy saves that already beat Grimm (finished before the Night Board existed): GRANDFATHER them in.
    // Their clock is playT at migration — honest or WORSE (includes post-game wandering), and the unknowable
    // stats take worst-case tiebreaks, so the entry can never rank unfairly high. A fresh run replaces it.
    if(this.save.nightDone===undefined) this.save.nightDone = (this.save.embers||0) >= 5;
    if(this.save.nightDone && this.save.owned && !this.save.owned.includes('grimm')) this.save.owned.push('grimm');   // existing finishers get playable Grimm
    if(!this.save.crownMoment){
      const totS = Object.values(this.save.levels||{}).reduce((s,l)=>s + (l.stars? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
      if(totS >= 75){   // earned before auto-grant existed: crown them now, celebrate on boot
        this.save.crownMoment = true;
        const om = this.save.ownedMasks || (this.save.ownedMasks = []);   // v1.0 saves predate the wardrobe — init before reading
        if(!om.includes('starcrown')) om.push('starcrown');
        this.save.mask = 'starcrown';
        this.persist();   // the crown is granted ONCE — never refire the fanfare on the next boot
        setTimeout(()=>{ window.UI && UI.toast('👑 ALL 75 STARS! THE STAR CROWN IS YOURS. Wear it proud, Pip!', 7000); window.AUDIO && AUDIO.goldPumpkin(); }, 4000);
        setTimeout(()=>{ window.NightBoard && NightBoard.refreshNight(this); if(!this.save.cozy && window.NightBoard) NightBoard.checkFlawless(this); }, 7000);   // cozy pauses records — same guard as every other call site
      }
    }
    if(this.save.nightDone && this.save.nightT===undefined){
      this.save.nightT = this.save._finishT !== undefined ? this.save._finishT : (this.save.playT||0);
      this.save.nightDmg = 999; this.save.nightDeaths = 99;
      this.save.nightCandy = this.save.candyLifetime||0;
      this.save.nightEligible = (this.save.playT||0) > 60 && !this.save.cozy;   // cozy players get no auto-entry — Reset Save starts an eligible run
      this.save.nightSubmitted = true;
      if(this.save.nightEligible){
        const cs = Math.round(this.save.nightT*100);
        const stars = Object.values(this.save.levels||{}).reduce((s,l)=>s + (l.stars ? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
        const q = this.save.pendingScores || (this.save.pendingScores = {});
        // v3 composite: stars in the score (dmg 998 = the grandfather notch so refreshes can supersede)
        q['grimmwick.night'] = { v: cs*1e9 + 99*1e7 + 998*1e4 + (75 - Math.min(stars,75))*1e2, c: this.save.candyLifetime||0 };
      }
    }
    if(this.save.lives===undefined) this.save.lives = 5;
    if(this.save.cozy===undefined) this.save.cozy = false;
    if(this.save.tutDone===undefined) this.save.tutDone = false;
    if(!this.save.owned.includes('kid')) this.save.owned.unshift('kid');
    if(this.save.mask===undefined) this.save.mask = null;        // the wardrobe's mask slot
    if(!this.save.ownedMasks) this.save.ownedMasks = [];
    if(this.save.mask && typeof MASKS!=='undefined' && !MASKS[this.save.mask]) this.save.mask = null;              // curated away
    if(this.save.nm && this.save.nm.conquered){   // conquered before the regalia existed: crown them on boot
      if(!this.save.owned.includes('nightbreaker')) this.save.owned.push('nightbreaker');
      if(!this.save.ownedMasks.includes('nightcrown')) this.save.ownedMasks.push('nightcrown');
    }
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
    this._vaultForce = true;   // a reset MUST reach the vault (bypasses the virgin gate) — a reinstall must never resurrect pre-reset progress
    // a reset clears PROGRESS, never PROPERTY: candy, costumes, masks, the Star Crown, and the Pass survive.
    // (Candy joined the property list Sept 3 2026, owner call — bought or earned, a wallet is never wiped.
    // Reset Save remains the official fresh-run button for the Flawless Night board: stars, levels, and
    // the clock reset; the candy balance doesn't touch any of those.)
    const w = this.save || {};
    const fresh = { candy: w.candy|0, candyLifetime: w.candyLifetime|0, embers:0, worlds:{}, gp:{},
      owned: w.owned||['kid'], equipped: w.equipped||'kid',
      ownedMasks: w.ownedMasks||[], mask: w.mask||null,
      pass: !!w.pass, firstFlame: !!w.firstFlame, firstFlameOff: !!w.firstFlameOff,
      blackFlame: !!w.blackFlame, blackFlameOff: !!w.blackFlameOff,   // the Nightmare's reigning flame is rank-based property, like the First
      emberPop: !!w.emberPop, batWings: !!w.batWings, gummyGuard: !!w.gummyGuard, sweetTooth: !!w.sweetTooth,   // bought tricks are PROPERTY — they survive the fresh-run reset (Nightmare seals them anyway)
      trickOff: {ember:true, bat:true, guard:true, sweet:true},   // a FRESH RUN starts with every trick RESTING (audit fix: equipped-by-default re-tainted Flawless on frame one of the reset — re-equip in the Cauldron any time, knowingly)
      iapSeen: w.iapSeen || [],     // granted-transaction ledger survives resets (a reset must never re-grant old purchases)
      pendingScores: w.pendingScores || undefined,   // earned scores queued offline survive the fresh-run reset
      seenIntro:false, maxHearts:3 };
    Store.set('grimmwick_save', JSON.stringify(fresh));
    Store.del('hollowville_save');
  },

  // ---- the Save Vault's JS half ----
  // A save is worth vaulting once it carries real play (or when resetSave forces the write) — virgin
  // boot saves never reach the cloud, so a fresh install can't clobber a backup mid-sync (audit fix).
  _saveVaultable(){
    if(this._vaultForce) return true;
    const s = this.save; if(!s) return false;
    // REAL PLAY only — watching the intro is not progress worth beating a 40-hour cloud save to the
    // punch (audit fix: seenIntro flipped within seconds and opened the clobber window on slow syncs)
    return !!(Object.keys(s.levels||{}).length || Object.keys(s.worlds||{}).length || s.nightDone);
  },
  // The one adoption path (boot get + late cloudChanged both land here). Adopts ONLY over a save with
  // no real play; a launch-recovered candy purchase on the fresh boot is merged in, never lost.
  _adoptVault(value){
    if(this._restoring) return;
    const s = this.save;
    if(s && (Object.keys(s.levels||{}).length || Object.keys(s.worlds||{}).length || s.nightDone)){
      this._vaultPending = false;   // real play here — never clobber it; writes may flow (last-writer wins, documented)
      return;
    }
    if(!value || !s) return;
    let cloud = null; try{ cloud = JSON.parse(value); }catch(e){ return; }   // never spend the restore on garbage
    if(!cloud || !cloud.owned) return;
    // 1.3.1 HOTFIX (the Reset Save black screen): three locks against the adopt-reload loop.
    // (1) NEVER adopt a vault save with no real play — there is nothing worth restoring, and adopting
    //     a virgin save over a virgin save re-triggered adoption on every boot, reloading forever.
    if(!(Object.keys(cloud.levels||{}).length || Object.keys(cloud.worlds||{}).length || cloud.nightDone)) return;
    // (2) if the vault holds exactly what is already stored, there is nothing to do
    try{ if(localStorage.getItem('grimmwick_save') === value) return; }catch(e){}
    // (3) at most ONE adoption attempt per session chain — sessionStorage survives our own reload
    try{ if(sessionStorage.getItem('gw_adopted')) return; sessionStorage.setItem('gw_adopted','1'); }catch(e){}
    if((s.candy|0) || (s.iapSeen||[]).length){   // carry a boot-window grant into the adopted save
      cloud.candy = (cloud.candy|0) + (s.candy|0);
      cloud.iapSeen = [...new Set([...(cloud.iapSeen||[]), ...(s.iapSeen||[])])];
    }
    let out = null; try{ out = JSON.stringify(cloud); }catch(e){ return; }
    this._restoring = true;                      // Store.set is dead from here — nothing may stomp the restore
    try{ localStorage.setItem('grimmwick_save', out); }
    catch(e){
      // storage down: adopt in place — same migrations as a boot, no reload
      this.save = cloud; Store.mem['grimmwick_save'] = out; this._restoring = false;
      try{ this._migrateSave(); }catch(_){}
      if(window.UI && UI.updateHUD) UI.updateHUD();
      return;
    }
    try{ sessionStorage.setItem('gw_vault_restored','1'); }catch(e){}   // cosmetic toast flag — must never veto the reload
    location.reload();                           // cleanest restore: boot again as if the save never left
  },
  // CANDY SHOP grant pipe — attached only AFTER the vault decision settles. The ONE place purchased
  // candy lands: inline buys, Ask-to-Buy approvals hours later, and crash-recovered transactions all
  // arrive here, deduped by txid, and are CONFIRMED back to native only after the save is persisted —
  // Apple's transaction stays open until the candy is durably granted (two-phase; audit fix).
  // Bought candy skips candyLifetime, so "most candy collected" (the board tiebreak) stays earned-only.
  _hookCandyShop(){
    try{
      const CS = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CandyShop;
      if(!CS || this._csHooked) return;
      this._csHooked = true;
      CS.addListener('grant', d=>{
        if(!d || !d.candy || !d.txid || this._restoring) return;   // mid-restore grants stay unconfirmed → re-deliver next boot
        const seen = this.save.iapSeen || (this.save.iapSeen = []);
        if(!seen.includes(d.txid)){
          seen.push(d.txid); while(seen.length>30) seen.shift();
          this.save.candy += d.candy; this.persist();
          if(window.AUDIO) AUDIO.buy();
          if(window.UI){ UI.updateHUD(); UI.toast('🍬 +'+d.candy.toLocaleString()+' candy! Sweet.', 4200);
            if(this.state==='shop' && UI._shopTab==='candy') UI.renderShop('candy'); }
        }
        // confirm ONLY when the txid is provably on disk — if localStorage is down the grant lives in
        // memory this session, the transaction stays open, and next launch re-delivers (dedupe absorbs it)
        let landed = false;
        try{ landed = (localStorage.getItem('grimmwick_save')||'').includes(d.txid); }catch(e){}
        if(landed){ try{ CS.confirm({txid: d.txid}).catch(()=>{}); }catch(e){} }   // ack AFTER durable persist — the sale completes now
      });
      // re-offer grants notified in a previous page life (the restore reload consumes retained events;
      // the native pending map survives webview reloads, so replay hands them straight back)
      try{ CS.replay({}).catch(()=>{}); }catch(e){}
    }catch(e){}
  },

  // UPDATE NUDGE (native builds, once a day): asks Apple's public lookup API for the current store
  // version and compares against the running binary. If the store is ahead: one friendly toast + an
  // Update button in the pause menu. Never nags, never blocks — most players auto-update anyway;
  // this catches the rest and speeds up launch windows.
  async _checkForUpdate(){
    try{
      const V = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SaveVault;
      if(!V || !V.appVersion) return;
      const last = +(Store.get('gw_upd_check')||0);
      if(Date.now() - last < 20*3600*1000) return;   // at most ~once a day
      Store.set('gw_upd_check', String(Date.now()));
      const mine = ((await V.appVersion())||{}).version;
      if(!mine) return;
      const r = await fetch('https://itunes.apple.com/lookup?id=6804521352&t='+Date.now());
      const j = await r.json();
      const store = j && j.results && j.results[0] && j.results[0].version;
      if(!store || store === mine) return;
      const num = v => v.split('.').slice(0,3).reduce((s,x,i)=>s + (parseInt(x)||0)/Math.pow(1000,i), 0);
      if(num(store) <= num(mine)) return;            // never nudge sideways or backward
      this._updateAvail = store;
      setTimeout(()=>{ if(window.UI) UI.toast('🆕 A Grimmwick update is out! New treats await — grab it from the pause menu.', 5200); }, 12000);
    }catch(e){}
  },

  // Apple's rate-this-app card (owner spec, Sept 4 2026): asked only at HAPPY moments — a 3-star
  // level win (daylight or nightmare) or a boss defeat — at most 3 invitations per save, spaced by
  // 10+ minutes of playtime, never on cozy runs, never at boot, never near failure. iOS additionally
  // enforces its own 3-shows-per-year cap, so generous asks stay tasteful on the player's screen.
  _maybeAskReview(){
    try{
      const P = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.GameCenter;
      if(!P || !P.requestReview) return;
      const s = this.save;
      if(s.rateAsks===undefined) s.rateAsks = s.rateAsked ? (s.rateAsked==='night'?2:1) : 0;   // migrate the old two-ask ledger
      if(s.rateAsks >= 3) return;                                    // three invitations per save, ever
      if((s.playT||0) - (s.rateAskAt||0) < 600 && s.rateAsks > 0) return;   // let 10+ minutes of play breathe between asks
      s.rateAsks++; s.rateAskAt = s.playT||0;
      this.persist();
      setTimeout(()=>{ try{ P.requestReview(); }catch(e){} }, 3500);   // after the victory fanfare breathes
    }catch(e){}
  },

  starsOn(id){
    const r = this.save && this.save.levels && this.save.levels[id];
    if(!r || !r.stars) return 0;
    return (r.stars.time?1:0)+(r.stars.candy?1:0)+(r.stars.clean?1:0);
  },
  nmStarsOn(id){
    const r = this.save && this.save.nm && this.save.nm.levels && this.save.nm.levels[id];
    if(!r || !r.stars) return 0;
    return (r.stars.time?1:0)+(r.stars.candy?1:0)+(r.stars.clean?1:0);
  },
  // a level counts as CLEARED when beaten in EITHER mode — normal or nightmare (owner call, Sept 3
  // 2026: a nightmare clear unlocks the next lantern too). Records/stars stay per-mode; only the
  // unlock chain reads this.
  levelCleared(id){
    const s = this.save; if(!s) return false;
    if(s.levels && s.levels[id] && s.levels[id].done) return true;
    return !!(s.nm && s.nm.levels && s.nm.levels[id] && s.nm.levels[id].done);
  },

  // a bought trick counts only while EQUIPPED in the Cauldron (they stack; the Nightmare check stays at each call site)
  trickOn(k){
    const s = this.save; if(!s) return false;
    const owned = k==='ember' ? s.emberPop : k==='bat' ? s.batWings : k==='guard' ? s.gummyGuard : s.sweetTooth;
    return !!owned && !(s.trickOff && s.trickOff[k]);
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
    if(area==='hub' || area==='tut' || area.startsWith('boss')) this.nightmare = false;
    window.UI && UI.closeDialogue && UI.closeDialogue();   // never carry a stale speech card across areas
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
    this.nightmare = !!this.nmSel;   // Nightmare is ALWAYS available (owner call, Sept 1 2026) — normal district gates still decide WHICH levels are open
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
      this.save.lives = this.nightmare ? 3 : 5; this.save.lastLevel = id; this.persist();
      this.switchArea(id);
      this.state='play';
      UI.fade(false, 450);
      const dWorld = (typeof WORLDS!=='undefined') ? WORLDS.find(x=>x.key===def.district) : null;
      const dList = (typeof LEVEL_LISTS!=='undefined') ? LEVEL_LISTS.find(L=>L.includes(def)) : null;
      const dNum = dList ? dList.indexOf(def)+1 : 1;
      UI.levelIntro(def.name, this.nightmare ? '🌑 NIGHTMARE · '+(dWorld?dWorld.name:'Grimmwick') : (dWorld?dWorld.name:'Grimmwick')+' · Level '+dNum);
      if(this.nightmare) setTimeout(()=>this._nightmareTint(), 650);
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
    if(this.nightmare){
      // nightmare clears track separately: done + best + NIGHTMARE'S OWN STARS (owner call, Sept 3
      // 2026 — option A). Same three hunts under nightmare law (no lanterns, 3 lives), which makes
      // them brutal badges — and the ladder: 3 nightmare stars open the next nightmare lantern.
      // The 75 daylight crown stars are a separate set and are never touched.
      const rec = (this.save.nm.levels[id] = this.save.nm.levels[id] || {done:false, best:null});
      rec.done = true;
      if(secsF>=3 && !this.runCozy && (!rec.best || secsF<rec.best)) rec.best = secsF;   // cozy softens nightmare (0.72×dt beats the 1.25×) — cozy runs never bank bests (audit fix)
      if(!this.runCozy){   // cozy banks neither bests nor nightmare stars
        const skipN = opts.warp||opts.leap;
        rec.stars = rec.stars || {};
        if(skipN || secs <= def.parTime) rec.stars.time = true;
        if(skipN || collected >= this.levelCandyTotal) rec.stars.candy = true;
        if(opts.leap || (this.runDamage||0)===0) rec.stars.clean = true;
        if(this.nmStarsOn(id)===3) this._maybeAskReview();   // a full 3-🌑 nightmare clear is peak joy — the perfect moment to ask
      }
      // THE NIGHTMARE board: once all 25 are conquered, the sum of bests goes up — and every
      // improved best resubmits (lower total, Game Center accepts — a living entry)
      if(window.NightBoard && !this.runCozy){
        const tot = NightBoard.nightmareTotal(this);
        if(tot != null){
          GC.submit('grimmwick.nightmare', Math.round(tot*100), 25);
          if(!this.save.nm.conquered){ this.save.nm.conquered = true;
            // THE CORONATION (owner call, Sept 2 2026): conquering all 25 grants the full regalia —
            // NIGHTBREAKER (the outfit) + THE NIGHTMARE CROWN (black iron, next to the Star Crown).
            // Honest by construction: cozy runs bank no bests, so nightmareTotal (and this block) never
            // fires for them. Earn-only forever — never sold, never granted any other way.
            if(!this.save.owned.includes('nightbreaker')) this.save.owned.push('nightbreaker');
            if(!this.save.ownedMasks.includes('nightcrown')) this.save.ownedMasks.push('nightcrown');
            setTimeout(()=>UI.toast('🌑 THE NIGHTMARE IS CONQUERED. Your total time is on the board.', 6200), 2600);
            setTimeout(()=>{ UI.toast('👑 NIGHTBREAKER + THE NIGHTMARE CROWN ARE YOURS. Woven from the dark you beat. (Wear them in the Cauldron.)', 7500); AUDIO.goldPumpkin(); }, 9200); }
        }
      }
      const prevGp = this.save.gp[def.district]||[false,false,false];
      this.save.gp[def.district] = prevGp.map((v,i)=>v||this.runPumpkins[i]);
      this.persist();
      const list2 = (typeof LEVEL_LISTS!=='undefined') ? (LEVEL_LISTS.find(L=>L.includes(def))||W1_LEVELS) : W1_LEVELS;
      const idx2 = list2.indexOf(def);
      const fmt2 = t => Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
      setTimeout(()=>UI.levelClear({ levelId:id, levelName:def.name, time:fmt2(secs), best:fmt2(rec.best||secs),
        isRecord:false, stars:rec.stars||{}, candy:collected, candyTotal:this.levelCandyTotal,
        nextId:(idx2>=0 && idx2<list2.length-1 && this.nmStarsOn(id)===3) ? list2[idx2+1].id : null, cozy:false, nightmare:true }), 1500);
        // ^ THE NIGHTMARE LADDER (owner call, option A): the next nightmare opens only on all 3
        //   NIGHTMARE stars for this level — fully independent of daylight progress
      return;
    }
    const skip = opts.warp||opts.leap;   // secret finishes honor their promised rewards
    const stars = {
      time: skip ? true : secs <= def.parTime,
      candy: skip ? true : collected >= this.levelCandyTotal,
      clean: opts.leap ? true : (this.runDamage||0)===0,
    };
    if(stars.time && stars.candy && stars.clean && !this.runCozy) this._maybeAskReview();   // a 3-star win earns the ask (owner spec)
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
    // THE 75TH STAR — the crown arrives the INSTANT it's earned, with fanfare (never behind a claim button)
    if(!this.save.crownMoment){
      const tot = Object.values(this.save.levels||{}).reduce((s,l)=>s + (l.stars? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
      if(tot >= 75){
        this.save.crownMoment = true;
        if(!this.save.ownedMasks.includes('starcrown')) this.save.ownedMasks.push('starcrown');
        this.save.mask = 'starcrown';
        if(this.player) this.player.buildRig(this.save.equipped||'kid');
        this.persist();
        setTimeout(()=>{ AUDIO.goldPumpkin(); UI.toast('👑 ALL 75 STARS! THE STAR CROWN IS YOURS. You ARE the night, Pip!', 7000); }, 2400);
      }
    }
    setTimeout(()=>UI.levelClear(stats), 1500);   // let the gate celebration land before the card
  },
  openMap(district){
    this._mapDistrict = district || 'w1';
    if(this.state!=='play') return;
    this.state='map';
    this.mapView = ((district||'w1')==='w1' && !this.nmSel && typeof buildMapScene==='function') ? buildMapScene(this, district||'w1') : null;   // 3D "beautiful map" is Patch-only (and daylight-only: nightmare view uses the DOM map)
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
      this.mapView = ((district||'w1')==='w1' && !this.nmSel && typeof buildMapScene==='function') ? buildMapScene(this, district||'w1') : null;
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
    if(this.area==='tut' && !this.save.tutDone){ this.save.tutDone = true; this.persist(); }   // walking out counts — never replay Gran's yard on next launch
    this.state='transition';
    UI.fade(true, 450);
    setTimeout(()=>{
      this.switchArea('hub');
      this.state='play';
      UI.fade(false, 450);
      if(afterVictory) UI.toast(this.save.embers>=5 ? '🎆 THE EVERFLAME BURNS WHOLE! The festival is ON, Grimmwick!' : '🔥 The Everflame flickers a little brighter...');
    }, 500);
  },
  _nightmareTint(){
    // crimson wash: every light in the scene leans blood-red, plus a low red ambient
    this.scene.traverse(o=>{ if(o.isLight && o.color) o.color.lerp(new THREE.Color(0xff2038), 0.4); });
    this.scene.add(new THREE.AmbientLight(0x40000a, 0.55));
  },
  onPlayerFell(){
    const pl = this.player;
    pl.group.visible = true;   // the pit eruption hides him mid-fall — always restore, even into death
    pl._pitPy = undefined;
    if(pl.dead) return;
    if(this.nightmare && this.levelDef){
      // THE NIGHTMARE COVENANT: falls restart the level. No lanterns. No mercy. (Owner spec.)
      const id = this.levelDef.id;
      pl.dead = true;
      UI.toast('🌑 The nightmare does not forgive.'+((this.save.emberPop||this.save.batWings||this.save.gummyGuard||this.save.sweetTooth)?' Your tricks sleep here.':''));
      this.state='transition'; UI.fade(true, 400);
      setTimeout(()=>{ this.enterLevel(id); }, 450);
      return;
    }
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
    if(this.area==='tut'){ this.switchArea('tut'); this.state='play'; UI.fade(false, 450); }   // a new player who falls in Gran's yard tries Gran's yard again
    else if(this.area.startsWith('boss')) this.startBoss(this.bossDistrict||'w1');
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
    const secsF = Math.round(((this._bossEndT !== undefined ? this._bossEndT : (this.runT||this.time-this.runT0)))*100)/100;
    delete this._bossEndT;   // w5 stamps this at the invite so the tap-paced ending never pollutes the boss record
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
      if(!this.save.owned.includes('grimm')) this.save.owned.push('grimm');   // GRIMM BECOMES PLAYABLE — the story's promise
      this.save.nightEligible = !this.save.nightCozy;   // ANY cozy time during the night = no board entry (Pip still wins his party)
      this.save.nightT = this.save._finishT !== undefined ? this.save._finishT : (this.save.playT||0);
      this.save.nightDmg = this.save.dmgUntracked ? 999 : (this.save.damageLifetime||0);   // untracked saves take the worst tiebreak, honestly
      this.save.nightDeaths = this.save.dmgUntracked ? 99 : Math.min(this.save.deathsLifetime||0, 99);
      this.save.nightCandy = this.save.candyLifetime||0;
      this.persist();
    }
    window.NightBoard && NightBoard.onBossDefeated(this, district);
    this._maybeAskReview();
    if(this.save._finishT !== undefined){ delete this.save._finishT; this.persist(); }
    if(district==='w5'){
      // the finale lands IN the festival: fireworks, the whole flame, the town that remembers —
      // the celebration is the payoff, the keepsake card follows once it has breathed
      const ps = UI.el && UI.el('pause-screen'); if(ps) ps.style.display='none';   // a pause pressed during the fade must not strand its menu
      this.switchArea('hub');
      this.state = 'play';
      UI.fade(false, 800);
      setTimeout(()=>{ UI.toast('🎆 THE FESTIVAL! The whole town remembers Grimm!', 5200); }, 1100);
      const showEnd = ()=>{
        if(this.area !== 'hub') return;                       // they wandered into a level — the card yields (stats live on the Night Board)
        if(this.state !== 'play'){ setTimeout(showEnd, 1200); return; }   // pause/shop/map open — wait for a clean moment
        this.state='victory'; UI.victoryScreen(stats);
      };
      setTimeout(showEnd, 8500);
    } else setTimeout(()=>{ this.state='victory'; UI.victoryScreen(stats); }, 4200);
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
      this.save.playT = (this.save.playT||0) + dt;
      this._ptAcc = (this._ptAcc||0) + dt;   // flush the clock every few seconds — force-quitting must never refund run time
      if(this._ptAcc > 4){ this._ptAcc = 0; this.persist(); }
      if(this.save.cozy && !this.save.nightDone && !this.save.nightCozy) this.save.nightCozy = true;   // any cozy minute taints the night's board eligibility
      // THE FLAWLESS RULE (owner call, Sept 2 2026): an EQUIPPED trick taints Flawless eligibility until the
      // flawless run is captured — money can never touch the First Flame. THE NIGHT stays open to everything;
      // nightmare needs no taint (it seals tricks outright). Reset Save = the fresh eligible run, as ever.
      if(!this.save.flawlessT && !this.save.nightTricked && !this.nightmare &&
         (this.trickOn('ember')||this.trickOn('bat')||this.trickOn('guard')||this.trickOn('sweet'))){
        this.save.nightTricked = true;   // said out loud the moment it happens — never a silent disqualification (audit fix)
        UI.toast('🏆 A trick is awake! This run counts everywhere except FLAWLESS NIGHT. (Reset Save starts a pure run.)', 6600);
      }
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
      if(this.mapView.fitCam) this.mapView.fitCam(this.camera.aspect);
      else { this.mapView.camera.aspect = this.camera.aspect; this.mapView.camera.updateProjectionMatrix(); }
      this.renderer.render(this.mapView.scene, this.mapView.camera);
    } else this.renderer.render(this.scene, this.camera);
    INPUT.endFrame();
  },
};
window.G = G;
G.boot();

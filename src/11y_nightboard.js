// ============ THE NIGHT BOARD — leaderboards (Game Center) ============
// The competitive layer for a short game: "beat it" is night one, "beat it in 41 minutes untouched"
// is the next three months. Boards (owner spec): FASTEST NIGHT — time to beat the whole game, ties
// broken by least damage, then most candy (one lower-is-better int64 composite) · PURE NIGHT —
// no-damage full runs, fastest wins · CANDY HOARD — most candy ever collected · one district board
// per district (sum of your best level times + boss best). Native bridge: GameCenterPlugin.swift
// (Capacitor 8, registered in MyViewController). Web/test builds run fully local — the Night Board
// then shows YOUR numbers and invites you to the App Store version to compete.

const GC = {
  authed: false, alias: null, _authing: null,
  plugin(){ try{ return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.GameCenter) || null; }catch(e){ return null; } },
  native(){ return !!this.plugin(); },
  signIn(){
    const p = this.plugin(); if(!p) return Promise.resolve(false);
    if(this.authed) return Promise.resolve(true);
    if(this._authing) return this._authing;   // one in-flight auth at a time — a second call would orphan the first native promise
    this._authing = (async () => {
      try{ const r = await p.signIn(); this.authed = !!(r && r.authenticated); this.alias = (r && r.alias) || null; }
      catch(e){ this.authed = false; }
      this._authing = null;
      if(this.authed) Night.flushPending();
      return this.authed;
    })();
    return this._authing;
  },
  async submit(board, value){
    const p = this.plugin();
    if(!p || !this.authed){ Night.queuePending(board, value); return; }
    try{ await p.submit({ board, value: Math.round(value) }); }catch(e){ Night.queuePending(board, value); }
  },
  async load(board, friends, count=25){
    const p = this.plugin(); if(!p || !this.authed) return null;
    try{ return await p.loadBoard({ board, friends: !!friends, count }); }catch(e){ return null; }
  },
};
window.GC = GC;

// centiseconds → "41:23.45" / "1h 02:03"
function fmtCS(cs){
  cs = Math.max(0, Math.floor(cs));
  const t = Math.floor(cs/100), c = cs%100;
  const h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = t%60;
  if(h) return h+'h '+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  return m+':'+String(s).padStart(2,'0')+'.'+String(c).padStart(2,'0');
}
// the FASTEST NIGHT composite (owner spec) — decode shows the time; damage/candy break ties invisibly
function encodeNight(timeCS, dmg, candy){ return timeCS*1e7 + Math.min(dmg,999)*1e4 + (9999 - Math.min(candy,9999)); }

const NIGHT_BOARDS = [
  { key:'fastest', id:'grimmwick.fastestnight', icon:'🏆', name:'FASTEST NIGHT', sub:'Beat the whole game. Ties: least damage, then most candy.', lower:true,
    fmt: v => fmtCS(Math.floor(v/1e7)) },
  { key:'pure', id:'grimmwick.purenight', icon:'💜', name:'PURE NIGHT', sub:'Untouched full runs — not one heart lost. Fastest wins.', lower:true, fmt: fmtCS },
  { key:'candy', id:'grimmwick.candyhoard', icon:'🍬', name:'CANDY HOARD', sub:'Most candy ever collected, across all your nights.', lower:false, fmt: v => (+v).toLocaleString() },
  { key:'w1', id:'grimmwick.w1.night', icon:'🎃', name:'PUMPKIN PATCH', sub:'Your best level times + boss, added up.', lower:true, fmt: fmtCS },
  { key:'w2', id:'grimmwick.w2.night', icon:'🪦', name:'RAVENMOOR', sub:'Your best level times + boss, added up.', lower:true, fmt: fmtCS },
  { key:'w3', id:'grimmwick.w3.night', icon:'🕷️', name:'WITCHWOOD', sub:'Your best level times + boss, added up.', lower:true, fmt: fmtCS },
  { key:'w4', id:'grimmwick.w4.night', icon:'⚓', name:'GHOST HARBOR', sub:'Your best level times + boss, added up.', lower:true, fmt: fmtCS },
  { key:'w5', id:'grimmwick.w5.night', icon:'🕰️', name:'CURSED CASTLE', sub:'Your best level times + boss, added up.', lower:true, fmt: fmtCS },
];

const Night = {
  // ---- district sum-of-bests: all 5 level bests + the boss best must exist ----
  districtCS(G, w){
    const sv = G.save; let sum = 0;
    if(typeof LEVEL_LISTS === 'undefined') return null;
    let n = 0;
    for(const list of LEVEL_LISTS) for(const l of list){
      if(l.district !== w) continue; n++;
      const rec = sv.levels && sv.levels[l.id];
      if(!rec || rec.best == null) return null;
      sum += rec.best;
    }
    if(!n) return null;
    const boss = sv.best && sv.best[w+'boss'];
    if(boss == null) return null;
    return Math.round((sum + boss) * 100);
  },
  // ---- your local values per board (the web fallback + the "you" row) ----
  localValue(G, key){
    const sv = G.save;
    if(key === 'fastest') return sv.nightDone && sv.nightT ? encodeNight(Math.round(sv.nightT*100), sv.nightDmg||0, Math.min(sv.nightCandy||0,9999)) : null;
    if(key === 'pure')    return sv.nightDone && sv.nightT && (sv.nightDmg||0) === 0 ? Math.round(sv.nightT*100) : null;
    if(key === 'candy')   return sv.candyLifetime || null;
    return this.districtCS(G, key);
  },
  // ---- submissions (queued while signed out; Game Center keeps each player's best) ----
  queuePending(board, value){
    const G = window.G; if(!G || !G.save) return;
    const q = G.save.pendingScores || (G.save.pendingScores = {});
    const b = NIGHT_BOARDS.find(x => x.id === board);
    if(q[board] == null || (b && !b.lower ? value > q[board] : value < q[board])) q[board] = value;
    G.persist && G.persist();
  },
  flushPending(){
    const G = window.G; if(!G || !G.save || !G.save.pendingScores) return;
    const q = G.save.pendingScores; G.save.pendingScores = {};
    for(const board in q) GC.submit(board, q[board]);
    G.persist && G.persist();
  },
  submitDistrict(G, w){
    const cs = this.districtCS(G, w);
    if(cs != null) GC.submit('grimmwick.'+w+'.night', cs);
  },
  onLevelClear(G, levelId){
    // CANDY HOARD is a lifetime collection stat, not a skill record — cozy candy counts, by design
    if(G.save.candyLifetime) GC.submit('grimmwick.candyhoard', G.save.candyLifetime);
    if(G.save.cozy || G.runCozy) return;             // cozy runs never touch the TIME boards
    this.submitDistrict(G, levelId.slice(0,2));
  },
  onBossDefeated(G, w){
    if(G.save.candyLifetime) GC.submit('grimmwick.candyhoard', G.save.candyLifetime);
    if(!(G.save.cozy || G.runCozy)) this.submitDistrict(G, w);
    // the whole-night boards check ELIGIBILITY, not the live toggle — a night with any cozy minute
    // in it (nightEligible false) never submits, and a cozy first-clear can't sneak in via a re-fight
    if(w === 'w5' && G.save.nightDone && !G.save.nightSubmitted){
      G.save.nightSubmitted = true;
      const timeCS = Math.round((G.save.nightT||0)*100);
      if(timeCS > 0 && G.save.nightEligible !== false){
        GC.submit('grimmwick.fastestnight', encodeNight(timeCS, G.save.nightDmg||0, Math.min(G.save.nightCandy||0, 9999)));
        if((G.save.nightDmg||0) === 0 && !G.save.dmgUntracked) GC.submit('grimmwick.purenight', timeCS);
      }
      G.persist();
    }
  },

  // ================= THE NIGHT BOARD UI (jewel, not menu) =================
  _built: false, _sel: 'fastest', _friends: false,
  build(){
    if(this._built) return; this._built = true;
    const css = document.createElement('style');
    css.textContent = `
      #nb-screen { position:fixed; inset:0; z-index:60; display:none; background:radial-gradient(120% 100% at 50% 0%, #241a3e 0%, #120c22 55%, #0b0716 100%); color:#efe7ff; font-family:-apple-system,'SF Pro Rounded','Segoe UI',system-ui,sans-serif; }
      #nb-wrap { position:absolute; inset:0; display:flex; flex-direction:column; padding:calc(10px + env(safe-area-inset-top)) calc(14px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left)); box-sizing:border-box; }
      #nb-head { display:flex; align-items:center; gap:10px; }
      #nb-head h2 { font-size:20px; letter-spacing:2px; color:#ffd98a; text-shadow:0 0 18px rgba(255,180,60,.45), 0 2px 6px #000; margin:0; flex:1; }
      #nb-x { width:38px; height:38px; border-radius:12px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.2); color:#fff; font-size:17px; font-weight:900; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      #nb-tabs { display:flex; gap:6px; overflow-x:auto; -webkit-overflow-scrolling:touch; touch-action:pan-x; padding:8px 0 6px; scrollbar-width:none; }
      #nb-tabs::-webkit-scrollbar { display:none; }
      .nb-tab { flex:0 0 auto; padding:7px 12px; border-radius:14px; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.14); font-size:12.5px; font-weight:800; cursor:pointer; white-space:nowrap; }
      .nb-tab.on { background:rgba(255,170,60,.18); border-color:#ffb35e; color:#ffd98a; box-shadow:0 0 14px rgba(255,170,60,.25); }
      #nb-sub { font-size:12px; opacity:.75; margin:2px 2px 6px; }
      #nb-list { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; touch-action:pan-y; border-radius:16px; background:rgba(255,255,255,.045); border:1.5px solid rgba(255,255,255,.1); padding:6px; }
      .nb-row { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:12px; font-size:14.5px; }
      .nb-row.me { background:rgba(255,170,60,.14); border:1.5px solid rgba(255,180,90,.4); font-weight:800; }
      .nb-rank { width:44px; font-weight:900; color:#ffd98a; }
      .nb-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .nb-score { font-weight:900; font-variant-numeric:tabular-nums; }
      .nb-note { padding:20px 16px; text-align:center; opacity:.8; font-size:13.5px; line-height:1.55; }
      #nb-foot { display:flex; gap:8px; align-items:center; padding-top:8px; }
      #nb-friends { padding:7px 13px; border-radius:14px; background:rgba(255,255,255,.07); border:1.5px solid rgba(255,255,255,.16); font-size:12.5px; font-weight:800; cursor:pointer; }
      #nb-friends.on { background:rgba(120,200,255,.16); border-color:#63c6e6; color:#bfeaff; }
      #nb-you { flex:1; text-align:right; font-size:12.5px; opacity:.85; font-variant-numeric:tabular-nums; }
    `;
    document.head.appendChild(css);
    const el = document.createElement('div');
    el.id = 'nb-screen'; el.className = 'ui-block';
    el.innerHTML = `<div id="nb-wrap">
      <div id="nb-head"><h2>🏮 THE NIGHT BOARD</h2><div id="nb-x">✕</div></div>
      <div id="nb-tabs">${NIGHT_BOARDS.map(b=>`<div class="nb-tab" data-k="${b.key}">${b.icon} ${b.name}</div>`).join('')}</div>
      <div id="nb-sub"></div>
      <div id="nb-list"></div>
      <div id="nb-foot"><div id="nb-friends">👥 Friends</div><div id="nb-you"></div></div>
    </div>`;
    document.body.appendChild(el);
    const bind = (window.UI && UI.bindTap) ? UI.bindTap : (e,f)=>e.addEventListener('mousedown',f);
    bind(el.querySelector('#nb-x'), ()=>this.close());
    bind(el.querySelector('#nb-friends'), ()=>{ this._friends=!this._friends; el.querySelector('#nb-friends').classList.toggle('on', this._friends); this.render(); });
    el.querySelectorAll('.nb-tab').forEach(t => bind(t, ()=>{ this._sel = t.dataset.k; el.querySelectorAll('.nb-tab').forEach(x=>x.classList.toggle('on', x.dataset.k===this._sel)); this.render(); }));
    document.addEventListener('keydown', e => {   // Escape closes the board (and never leaks to the game)
      if(e.key === 'Escape' && el.style.display === 'block'){ e.preventDefault(); e.stopPropagation(); this.close(); }
    }, true);
  },
  async open(){
    this.build();
    const el = document.getElementById('nb-screen');
    el.style.display = 'block';
    el.querySelectorAll('.nb-tab').forEach(x=>x.classList.toggle('on', x.dataset.k===this._sel));
    AUDIO.ui && AUDIO.ui();
    this.render();                                    // paint your local numbers immediately…
    if(GC.native() && !GC.authed){ await GC.signIn(); this.render(); }   // …then retry auth on every open (Settings round-trips included)
  },
  close(){ const el = document.getElementById('nb-screen'); if(el) el.style.display='none'; if(window.UI) UI._ovCloseT = performance.now(); AUDIO.ui && AUDIO.ui(); },
  async render(){
    const G = window.G, el = document.getElementById('nb-screen');
    if(!el || el.style.display==='none') return;
    const b = NIGHT_BOARDS.find(x=>x.key===this._sel);
    el.querySelector('#nb-sub').textContent = b.sub;
    const list = el.querySelector('#nb-list');
    const mine = this.localValue(G, b.key);
    el.querySelector('#nb-you').textContent = mine != null ? ('Your best: '+b.fmt(mine)) : 'No entry yet — go earn one!';
    if(!GC.native()){
      list.innerHTML = `<div class="nb-note">🕯️ The spirits post scores from the App Store version.<br>${mine!=null ? 'Your local best here: <b>'+b.fmt(mine)+'</b>' : 'Finish the night to set your first mark!'}</div>`;
      return;
    }
    if(!GC.authed){
      list.innerHTML = `<div class="nb-note">👻 Sign in to Game Center to join the board.<br><span style="opacity:.7">(Settings → Game Center — then reopen the Night Board)</span></div>`;
      return;
    }
    list.innerHTML = `<div class="nb-note">🔮 Consulting the spirits…</div>`;
    const want = this._sel + ':' + this._friends;
    const r = await GC.load(b.id, this._friends, 25);
    if(this._sel + ':' + this._friends !== want) return;   // switched tab or scope while loading
    if(r && r.error){
      list.innerHTML = `<div class="nb-note">🌫️ The spirits can't reach Game Center right now — try again in a moment.</div>`;
      return;
    }
    if(!r || !r.entries || !r.entries.length){
      list.innerHTML = `<div class="nb-note">${this._friends ? 'No friends on this board yet — recruit some rivals! 👥' : 'The board is empty — be the FIRST name on it. 🏮'}</div>`;
      return;
    }
    list.innerHTML = r.entries.map(e =>
      `<div class="nb-row${e.me?' me':''}"><div class="nb-rank">${e.me?'⭐':''}#${e.rank}</div><div class="nb-name">${String(e.name||'???').replace(/[<>&]/g,'')}</div><div class="nb-score">${b.fmt(e.value)}</div></div>`
    ).join('');
    if(r.localRank && !r.entries.some(e=>e.me)){
      list.innerHTML += `<div class="nb-row me"><div class="nb-rank">⭐#${r.localRank}</div><div class="nb-name">${String(GC.alias||'You').replace(/[<>&]/g,'')}</div><div class="nb-score">${r.localValue!=null?b.fmt(r.localValue):''}</div></div>`;
    }
  },
};
window.NightBoard = Night;

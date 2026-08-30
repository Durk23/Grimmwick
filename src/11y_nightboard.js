// ============ THE NIGHT BOARD — leaderboards (Game Center) ============
// TWO boards, owner spec (Aug 2026 — "just those 2 tabs"):
//   🏆 FLAWLESS NIGHT — the mastery board: finish the game with ALL 75 STARS (3 per level);
//      rank = your total play-clock from New Game to the moment the last requirement lands.
//   🌙 THE NIGHT — everyone who beats the game, with the full stat line per row:
//      time · ⭐ stars · 🍬 candy · 💜 damage · ☠️ deaths.
// One int64 score ranks (time → deaths → damage → candy, all within JS-safe 2^53):
//   score = timeCS*1e9 + min(deaths,99)*1e7 + min(dmg,999)*1e4 + (9999 - min(candy,9999))
// The star count rides Game Center's per-entry CONTEXT field. Cozy-tainted nights never submit.
// Native bridge: GameCenterPlugin.swift (Capacitor 8, registered in MyViewController).

const GC = {
  authed: false, alias: null, _authing: null,
  plugin(){ try{ return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.GameCenter) || null; }catch(e){ return null; } },
  native(){ return !!this.plugin(); },
  signIn(){
    const p = this.plugin(); if(!p) return Promise.resolve(false);
    if(this.authed){ Night.flushPending(); return Promise.resolve(true); }   // already in: retry anything still queued
    if(this._authing) return this._authing;   // one in-flight auth — a second call would orphan the first native promise
    this._authing = (async () => {
      try{ const r = await p.signIn(); this.authed = !!(r && r.authenticated); this.alias = (r && r.alias) || null; }
      catch(e){ this.authed = false; }
      this._authing = null;
      if(this.authed) Night.flushPending();
      return this.authed;
    })();
    return this._authing;
  },
  lastError: null,
  async submit(board, value, context){
    const p = this.plugin();
    if(!p || !this.authed){ Night.queuePending(board, value, context); return; }
    try{ await p.submit({ board, value: Math.round(value), context: Math.round(context||0) }); this.lastError = null; }
    catch(e){ this.lastError = (e && e.message) || String(e); Night.queuePending(board, value, context); }
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
// the composite v3: rank by time, ties by deaths, then damage, then STARS (more = better).
// Stars live IN the score so earning one post-completion strictly improves it — Game Center then
// accepts the resubmit and the board's star count stays LIVE. Candy rides the context field
// (uncapped). Fits in 2^53 (timeCS ≤ 3.6e6 → 3.6e15).
function encodeNight(timeCS, deaths, dmg, stars){
  return timeCS*1e9 + Math.min(Math.max(deaths,0),99)*1e7 + Math.min(Math.max(dmg,0),999)*1e4 + (75 - Math.min(Math.max(stars,0),75))*1e2;
}
function decodeNight(v){
  const timeCS = Math.floor(v/1e9);
  const deaths = Math.floor(v/1e7) % 100;
  const dmg = Math.floor(v/1e4) % 1000;
  const stars = 75 - (Math.floor(v/1e2) % 100);
  return { timeCS, deaths, dmg, stars: Math.max(0, Math.min(75, stars)) };
}

const NIGHT_BOARDS = [
  { key:'flawless', id:'grimmwick.flawless', icon:'🏆', name:'FLAWLESS NIGHT',
    sub:'ALL 75 stars: every level, every challenge. Fastest total clock wins. The mastery board.' },
  { key:'night', id:'grimmwick.night', icon:'🌙', name:'THE NIGHT',
    sub:'Everyone who saved Grimmwick. Fastest night wins; fewest deaths breaks ties.' },
];

const Night = {
  totalStars(G){
    return Object.values(G.save.levels||{}).reduce((s,l)=>s + (l.stars ? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
  },
  // ---- local values (the web fallback + your-best row) ----
  localValue(G, key){
    const sv = G.save;
    if(key==='night') return sv.nightDone && sv.nightT && sv.nightEligible!==false
      ? encodeNight(Math.round(sv.nightT*100), sv.nightDeaths||0, this._dmgFor(sv), this.totalStars(G)) : null;
    if(key==='flawless') return sv.flawlessT
      ? encodeNight(Math.round(sv.flawlessT*100), sv.flawlessDeaths||0, sv.flawlessDmg||0, 75) : null;
    return null;
  },
  // grandfathered saves report damage 998 instead of the untracked 999: the one-notch dip makes the
  // re-encoded score strictly better than their legacy entry, so the star-refresh replaces it. Shown as '–' either way.
  _dmgFor(sv){ return sv.dmgUntracked ? 998 : Math.min(sv.nightDmg||0, 997); },
  // THE LIVING ENTRY: after completion, every star earned (and better stats) re-improves the score,
  // so the board reflects the player's CURRENT stars, not completion-day stars.
  refreshNight(G){
    const sv = G.save;
    if(!sv.nightDone || sv.nightEligible===false || !sv.nightSubmitted) return;
    const timeCS = Math.round((sv.nightT||0)*100);
    if(timeCS<=0) return;
    GC.submit('grimmwick.night', encodeNight(timeCS, sv.nightDeaths||0, this._dmgFor(sv), this.totalStars(G)), Math.min(sv.candyLifetime||0, 999999999));
  },
  // ---- submissions (queued while signed out; Game Center keeps each player's best) ----
  queuePending(board, value, context){
    const G = window.G; if(!G || !G.save) return;
    const q = G.save.pendingScores || (G.save.pendingScores = {});
    if(q[board] == null || value < q[board].v) q[board] = { v: value, c: context||0 };   // both boards are lower-is-better
    G.persist && G.persist();
  },
  flushPending(){
    const G = window.G; if(!G || !G.save || !G.save.pendingScores) return;
    const q = G.save.pendingScores; G.save.pendingScores = {};
    const known = NIGHT_BOARDS.map(b=>b.id);
    for(const board in q){
      if(!known.includes(board)) continue;                          // purge queue entries from retired board ids
      const e = q[board];
      GC.submit(board, typeof e==='object' ? e.v : e, typeof e==='object' ? e.c : 0);
    }
    G.persist && G.persist();
  },
  // THE FLAWLESS CHECK — fires on every clear/boss: the moment a save has the finished game AND all 75
  // stars (in any order, across any number of nights), the clock stops and the run is banked. Cozy taints it.
  checkFlawless(G){
    const sv = G.save;
    if(sv.flawlessT || sv.nightCozy) return;
    if(!sv.nightDone || this.totalStars(G) < 75) return;
    sv.flawlessT = sv._finishT !== undefined ? sv._finishT : (sv.playT||0);   // finale-path completions use the invite-moment stamp
    sv.flawlessDeaths = sv.dmgUntracked ? 99 : Math.min(sv.deathsLifetime||0, 99);
    sv.flawlessDmg = sv.dmgUntracked ? 999 : (sv.damageLifetime||0);
    sv.flawlessCandy = sv.candyLifetime||0;
    G.persist();
    UI.toast('🏆 FLAWLESS NIGHT! All 75 stars! Your time is on the board: '+fmtCS(Math.round(sv.flawlessT*100)), 5200);
    GC.submit('grimmwick.flawless', encodeNight(Math.round(sv.flawlessT*100), sv.flawlessDeaths, sv.flawlessDmg, sv.flawlessCandy), 75);
  },
  // THE FIRST FLAME — one player in the world wears it: the reigning Flawless champion.
  // Checked on boot and board open; state flips fire the take/lose toasts.
  async checkFirstFlame(G){
    if(!G || !G.save || !GC.native() || !GC.authed) return;
    const r = await GC.load('grimmwick.flawless', false, 1);
    if(!r || r.error) return;
    const had = !!G.save.firstFlame;
    const isChamp = r.localRank === 1;
    if(isChamp === had) return;
    G.save.firstFlame = isChamp;
    G.persist && G.persist();
    if(isChamp){
      window.UI && UI.toast('🔥 THE FIRST FLAME IS YOURS. The Everflame favors the fastest flawless night. Guard it.', 6800);
      window.AUDIO && AUDIO.goldPumpkin();
    } else {
      const champ = (r.entries && r.entries[0] && !r.entries[0].me && r.entries[0].name) ? r.entries[0].name : 'a new champion';
      window.UI && UI.toast('🔥 The First Flame has passed to '+champ+'. Take it back.', 6800);
    }
    if(G.player) G.player.buildRig(G.save.equipped||'kid');
  },
  onLevelClear(G, levelId){
    if(!(G.save.cozy || G.runCozy)) this.checkFlawless(G);
    this.refreshNight(G);
  },
  onBossDefeated(G, w){
    if(w === 'w5' && G.save.nightDone && !G.save.nightSubmitted){
      G.save.nightSubmitted = true;
      G.persist();
    }
    if(!(G.save.cozy || G.runCozy)) this.checkFlawless(G);
    this.refreshNight(G);
  },

  // ================= THE NIGHT BOARD UI (two tabs, jewel not menu) =================
  _built: false, _sel: 'flawless', _friends: false,
  build(){
    if(this._built) return; this._built = true;
    const css = document.createElement('style');
    css.textContent = `
      #nb-screen { position:fixed; inset:0; z-index:60; display:none; background:radial-gradient(120% 100% at 50% 0%, #241a3e 0%, #120c22 55%, #0b0716 100%); color:#efe7ff; font-family:-apple-system,'SF Pro Rounded','Segoe UI',system-ui,sans-serif; }
      #nb-wrap { position:absolute; inset:0; display:flex; flex-direction:column; padding:calc(10px + env(safe-area-inset-top)) calc(14px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left)); box-sizing:border-box; }
      #nb-head { display:flex; align-items:center; gap:10px; }
      #nb-head h2 { font-size:20px; letter-spacing:2px; color:#ffd98a; text-shadow:0 0 18px rgba(255,180,60,.45), 0 2px 6px #000; margin:0; flex:1; }
      #nb-x { width:38px; height:38px; border-radius:12px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.2); color:#fff; font-size:17px; font-weight:900; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      #nb-tabs { display:flex; gap:8px; padding:8px 0 6px; }
      .nb-tab { flex:1; text-align:center; padding:9px 12px; border-radius:14px; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.14); font-size:13.5px; font-weight:800; cursor:pointer; white-space:nowrap; }
      .nb-tab.on { background:rgba(255,170,60,.18); border-color:#ffb35e; color:#ffd98a; box-shadow:0 0 14px rgba(255,170,60,.25); }
      #nb-sub { font-size:12px; opacity:.75; margin:2px 2px 6px; text-align:center; }
      #nb-list { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; touch-action:pan-y; border-radius:16px; background:rgba(255,255,255,.045); border:1.5px solid rgba(255,255,255,.1); padding:6px; }
      .nb-row { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:12px; font-variant-numeric:tabular-nums; }
      .nb-row.me { background:rgba(255,170,60,.14); border:1.5px solid rgba(255,180,90,.4); }
      .nb-rank { width:44px; font-weight:900; font-size:15px; color:#ffd98a; flex:0 0 auto; }
      .nb-main { flex:1; min-width:0; }
      .nb-name { font-size:14.5px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .nb-stats { font-size:11.5px; opacity:.72; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .nb-time { font-weight:900; font-size:15px; text-align:right; flex:0 0 auto; }
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
    if(GC.native()){ await GC.signIn(); this.render(); this.checkFirstFlame(window.G); }   // auth (or retry queued submits) on every open
  },
  close(){ const el = document.getElementById('nb-screen'); if(el) el.style.display='none'; if(window.UI) UI._ovCloseT = performance.now(); AUDIO.ui && AUDIO.ui(); },
  _row(rank, name, v, candyCtx, me){
    const d = decodeNight(v);
    return `<div class="nb-row${me?' me':''}">
      <div class="nb-rank">${me?'⭐':''}#${rank}</div>
      <div class="nb-main">
        <div class="nb-name">${String(name||'???').replace(/[<>&"]/g,'')}</div>
        <div class="nb-stats">⭐${d.stars} · 🍬${candyCtx!=null&&candyCtx>0?(+candyCtx).toLocaleString():'–'} · ☠️${d.deaths>=99?'–':d.deaths}</div>
      </div>
      <div class="nb-time">${fmtCS(d.timeCS)}</div>
    </div>`;
  },
  async render(){
    const G = window.G, el = document.getElementById('nb-screen');
    if(!el || el.style.display==='none') return;
    const b = NIGHT_BOARDS.find(x=>x.key===this._sel);
    el.querySelector('#nb-sub').textContent = b.sub;
    const list = el.querySelector('#nb-list');
    const mine = this.localValue(G, b.key);
    const nPend = Object.keys(G.save.pendingScores||{}).length;
    el.querySelector('#nb-you').textContent = (mine != null ? ('Your best: '+fmtCS(decodeNight(mine).timeCS))
      : (b.key==='flawless' ? `Stars: ${this.totalStars(G)}/75. Earn them ALL to enter!` : 'Finish the night to enter!'))
      + (nPend && GC.authed ? ' · 📮 posting…' : '');
    if(nPend && GC.authed && GC.lastError && !this._errToasted){ this._errToasted = true;
      UI.toast('📮 Score queued. Game Center said: "'+GC.lastError.slice(0,80)+'". New boards can take a while, it will keep retrying!', 5200); }
    const hdr = '';
    if(!GC.native()){
      list.innerHTML = hdr + (mine!=null
        ? this._row('–', 'You (local)', mine, b.key==='flawless'?75:this.totalStars(G), true)
        : `<div class="nb-note">🕯️ The spirits post scores from the App Store version.<br>${b.key==='flawless' ? 'All 75 stars + the fastest clock = the top of this board.' : 'Finish the night to set your mark!'}</div>`);
      return;
    }
    if(!GC.authed){
      list.innerHTML = `<div class="nb-note">👻 Sign in to Game Center to join the board.<br><span style="opacity:.7">(Settings → Game Center, then reopen the Night Board)</span></div>`;
      return;
    }
    list.innerHTML = `<div class="nb-note">🔮 Consulting the spirits…</div>`;
    const want = this._sel + ':' + this._friends;
    const r = await GC.load(b.id, this._friends, 25);
    if(this._sel + ':' + this._friends !== want) return;   // switched tab or scope mid-load
    if(r && r.error){
      list.innerHTML = `<div class="nb-note">🌫️ The spirits can't reach Game Center right now. Try again in a moment.</div>`;
      return;
    }
    if(!r || !r.entries || !r.entries.length){
      list.innerHTML = `<div class="nb-note">${this._friends ? 'No friends on this board yet. Recruit some rivals! 👥' : 'The board is empty. Be the FIRST name on it. 🏮'}</div>`;
      return;
    }
    list.innerHTML = hdr + r.entries.map(e => this._row(e.rank, (this._sel==='flawless' && e.rank===1 ? '🔥 ' : '')+e.name, e.value, e.context, e.me)).join('');
    if(r.localRank && !r.entries.some(e=>e.me)){
      list.innerHTML += this._row(r.localRank, GC.alias||'You', r.localValue!=null?r.localValue:0, r.localContext!=null?r.localContext:null, true);
    }
  },
};
window.NightBoard = Night;
// boot check: sign in quietly, flush queued scores, see whether the First Flame still burns here
setTimeout(()=>{ try{ if(GC.native()) GC.signIn().then(()=>{ Night.flushPending(); Night.checkFirstFlame(window.G); }); }catch(e){} }, 6000);

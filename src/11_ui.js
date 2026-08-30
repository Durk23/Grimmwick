// ============ UI — HUD, title, dialogue, store, pause, boss bar, touch ============
const STORY_SLIDES = [
  {icon:'🌕', text:'Welcome to GRIMMWICK, the town where Halloween never ends. Every 100 years, the Ember Moon rises to recharge the Everflame... the magical bonfire that keeps every ghost friendly and every candy sweet.\n\n(Nobody remembers why the town is called Grimmwick. Not even the Mayor.)'},
  {icon:'🌑', text:'But tonight, moments before the ceremony, a jealous shadow named GRIMM swallowed the flame and shattered it into five embers, scattering them across the five districts. The beloved guardians who found them have been corrupted by ember-fire!'},
  {icon:'🍬', text:'Everyone always says Pip is too small for adventures.\n\nEveryone is about to be wrong.\n\nGrab your candy bag. Free the guardians. RELIGHT THE NIGHT!'},
];
const MAYOR_LINES = [
  '"Pip! Thank goodness you\'re here. Grimm\'s shadow put every grown-up spirit into a gloomy sleepwalk. You\'re the only one he overlooked. Being small has its perks!"',
  '"Each guardian clutches a stolen ember. Start with the PUMPKIN KING: the Pumpkin Patch gate is the only one still open. He was the kindest of them all... bring him back to us."',
  '"Collect candy 🍬 and trade it at the Costume Cauldron! Keep an eye out: 3 GOLDEN PUMPKINS are hidden in every district. They say golden pumpkins sweeten the Everflame."',
  '"Boos are terribly shy: stare right at them and they freeze! The Pumpkin King, though... he\'s not shy. Bring your bouncing shoes, little one."',
];

const UI = {
  init(G){
    this.G = G;
    const css = document.createElement('style');
    css.textContent = `
      * { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; margin:0; padding:0; box-sizing:border-box; }
      html,body { overflow:hidden; background:#0d0a18; height:100%; }
      #ui { position:fixed; inset:0; pointer-events:none; font-family:-apple-system,'SF Pro Rounded','Segoe UI',system-ui,sans-serif; color:#fff; z-index:10; }
      .ui-block { pointer-events:auto; }
      .btn { background:linear-gradient(180deg,#7b4fd4,#5b35a8); border:none; border-radius:16px; color:#fff; font-weight:800; font-size:17px; padding:13px 26px; box-shadow:0 4px 0 #3d2178, 0 6px 14px rgba(0,0,0,.4); cursor:pointer; font-family:inherit; }
      .btn:active { transform:translateY(3px); box-shadow:0 1px 0 #3d2178; }
      .btn.orange { background:linear-gradient(180deg,#ff9d3e,#e8701a); box-shadow:0 4px 0 #9c4a0e, 0 6px 14px rgba(0,0,0,.4); }
      .btn.ghost2 { background:rgba(255,255,255,.12); box-shadow:none; border:2px solid rgba(255,255,255,.25); }
      /* HUD */
      #hud { position:absolute; top:calc(10px + env(safe-area-inset-top)); left:calc(12px + env(safe-area-inset-left)); display:flex; flex-direction:column; gap:6px; }
      #hearts { font-size:26px; letter-spacing:2px; filter:drop-shadow(0 2px 3px rgba(0,0,0,.6)); }
      .hud-pill { background:rgba(20,12,40,.72); border:1.5px solid rgba(255,255,255,.14); border-radius:20px; padding:5px 14px; font-size:16px; font-weight:800; width:max-content; box-shadow:0 2px 8px rgba(0,0,0,.35); }
      #pauseBtn { position:absolute; top:calc(10px + env(safe-area-inset-top)); right:calc(12px + env(safe-area-inset-right)); width:46px; height:46px; border-radius:14px; background:rgba(20,12,40,.72); border:1.5px solid rgba(255,255,255,.18); color:#fff; font-size:20px; }
      /* boss bar */
      #bossbar { position:absolute; top:calc(12px + env(safe-area-inset-top)); left:50%; transform:translateX(-50%); text-align:center; display:none; }
      #bossname { font-size:15px; font-weight:900; text-shadow:0 2px 4px #000; letter-spacing:1px; color:#ffb35e; }
      #bosshp { display:flex; gap:6px; justify-content:center; margin-top:4px; }
      .bhp { width:44px; height:14px; border-radius:7px; background:#3a2a55; border:2px solid #1c1230; }
      .bhp.on { background:linear-gradient(180deg,#ff9d3e,#ff5030); box-shadow:0 0 10px #ff7030; }
      /* prompt + dialogue */
      #prompt { position:absolute; bottom:150px; left:50%; transform:translateX(-50%); display:none; font-size:12px; padding:5px 13px; border-radius:13px; background:rgba(28,18,52,.5) !important; border:1px solid rgba(255,255,255,.16) !important; color:rgba(255,255,255,.9) !important; box-shadow:none !important; font-weight:600; }
      #dlg { position:absolute; left:50%; bottom:calc(24px + env(safe-area-inset-bottom)); transform:translateX(-50%); width:min(640px, 92vw); background:rgba(22,14,44,.94); border:2px solid #8e5bd9; border-radius:20px; padding:16px 20px; display:none; font-size:16.5px; line-height:1.45; box-shadow:0 10px 30px rgba(0,0,0,.6); }
      #dlg .ic { font-size:30px; float:left; margin-right:12px; }
      #dlg .tap { opacity:.6; font-size:12px; margin-top:8px; text-align:right; }
      /* toast */
      #toast { position:absolute; top:22%; left:50%; transform:translateX(-50%); background:rgba(22,14,44,.92); border:1.5px solid rgba(255,255,255,.2); padding:10px 22px; border-radius:30px; font-weight:800; font-size:16px; opacity:0; transition:opacity .3s; white-space:nowrap; max-width:92vw; text-overflow:ellipsis; overflow:hidden; }
      /* touch controls */
      #stick { position:absolute; width:110px; height:110px; border-radius:50%; background:rgba(255,255,255,.07); border:2px solid rgba(255,255,255,.2); display:none; }
      #nub { position:absolute; width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,.35); left:29px; top:29px; }
      #touchBtns { position:absolute; right:calc(14px + env(safe-area-inset-right)); bottom:calc(20px + env(safe-area-inset-bottom)); display:none; flex-direction:column; align-items:flex-end; gap:12px; }
      .tbtn { border-radius:50%; border:2.5px solid rgba(255,255,255,.35); color:#fff; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,.4); }
      #btnA { width:84px; height:84px; font-size:22px; background:radial-gradient(circle at 35% 30%, #8e5bd9, #5b35a8); }
      #btnB { width:64px; height:64px; font-size:15px; background:radial-gradient(circle at 35% 30%, #ff9d3e, #e8701a); margin-right:92px; margin-bottom:-66px; }
      #btnC { width:56px; height:56px; font-size:20px; background:radial-gradient(circle at 35% 30%, #63c6e6, #2a7fa8); margin-right:8px; }
      /* landscape + touch: keep dialogue/sign text clear of the right-hand action buttons (owner: horizontal is the primary orientation) */
      @media (orientation:landscape){ .touch #dlg{ left:16px; right:210px; transform:none; width:auto; max-width:600px; margin-inline:auto; } .touch #prompt{ bottom:200px; } }
      /* town interactions pop — a real orange button you can't miss (levels keep the quiet pill) */
      #prompt.hot { background:linear-gradient(180deg,#ffb02e,#ff7b2e) !important; border:1px solid #ffd98a !important; color:#2a1608 !important; font-weight:800; font-size:14px; padding:8px 18px; box-shadow:0 0 18px rgba(255,150,40,.55), 0 3px 10px rgba(0,0,0,.4) !important; animation:promptPulse 1.6s ease-in-out infinite; }
      @keyframes promptPulse { 0%,100%{ transform:translateX(-50%) scale(1); } 50%{ transform:translateX(-50%) scale(1.07); } }
      /* full screens */
      /* pointer-events:auto is LOAD-BEARING: without it an overflowing card can't be touch-scrolled in landscape,
         stranding everything below the fold (including the close button) */
      .screen { position:absolute; inset:0; background:rgba(10,6,22,.88); display:none; align-items:center; flex-direction:column; gap:18px; text-align:center; overflow-y:auto; -webkit-overflow-scrolling:touch; touch-action:pan-y; box-sizing:border-box; pointer-events:auto; padding:calc(16px + env(safe-area-inset-top)) calc(20px + env(safe-area-inset-left)) calc(16px + env(safe-area-inset-bottom)) calc(20px + env(safe-area-inset-right)); }
      .xClose { position:absolute; top:10px; right:10px; width:38px; height:38px; border-radius:12px; background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.28); color:#fff; font-size:17px; font-weight:800; font-family:inherit; cursor:pointer; line-height:1; z-index:2; }
      .xClose:active { background:rgba(255,255,255,.22); }
      /* auto-margin centering that degrades to a scroll when the card is taller than the viewport (landscape safe) */
      .screen:not(#map-screen)::before { content:""; margin-top:auto; flex:0 0 0; }
      .screen:not(#map-screen)::after { content:""; margin-bottom:auto; flex:0 0 0; }
      .card { position:relative; background:rgba(26,16,50,.97); border:2px solid #8e5bd9; border-radius:26px; padding:26px 30px; max-width:min(680px,94vw); flex:0 0 auto; box-shadow:0 20px 60px rgba(0,0,0,.7); }
      @media (max-height:540px){ .screen{gap:8px;} .card{padding:12px 22px;border-radius:18px;} .card h2{margin:2px 0;font-size:19px;} .card>div:first-child{font-size:24px;} .btn{padding:8px 20px;font-size:15px;} .cstarRow{margin:5px 0 2px;} .cstar{padding:5px 6px 4px;} .cstar .big{font-size:22px;} .cstar .lbl{font-size:10.5px;margin-top:2px;} #clearStats{margin:4px 0 !important;} .clearBtns{flex-direction:row !important;flex-wrap:wrap;justify-content:center;} .clearBtns .btn{flex:1 1 30%;} }
      #title-screen { display:flex; background:transparent; pointer-events:auto; }
      #logo { font-size:min(13vw,84px); font-weight:900; letter-spacing:2px; color:#ffb35e; text-shadow:0 0 30px #ff8c2e88, 0 4px 0 #7a3040, 0 8px 0 #4a1f30, 0 12px 24px #000; transform:rotate(-2deg); }
      #logo .v { color:#b37dff; text-shadow:0 0 30px #8e5bd988, 0 4px 0 #3d2178, 0 8px 0 #241245, 0 12px 24px #000; }
      #tagline { font-size:19px; font-weight:800; color:#e8dcff; text-shadow:0 2px 8px #000; opacity:.92; }
      #tap { margin-top:26px; font-size:17px; animation:pulse 1.4s infinite; text-shadow:0 2px 6px #000; font-weight:800; }
      @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
      #introSlide { font-size:18px; line-height:1.55; white-space:pre-line; }
      /* level card */
      #lvlcard { position:absolute; top:26%; width:100%; text-align:center; display:none; pointer-events:none; }
      #lvlname { font-size:min(9vw,52px); font-weight:900; color:#ffb35e; text-shadow:0 3px 0 #7a3040, 0 8px 22px #000; }
      #lvlsub { font-size:18px; font-weight:800; color:#e8dcff; text-shadow:0 2px 8px #000; margin-top:6px; }
      /* store */
      .tabs { display:flex; gap:8px; justify-content:center; margin-bottom:14px; }
      .tab { padding:9px 18px; border-radius:14px; background:rgba(255,255,255,.08); font-weight:800; cursor:pointer; border:2px solid transparent; font-size:15px; }
      .tab.on { background:#5b35a8; border-color:#b37dff; }
      #shopGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; text-align:left; }
      .item { background:rgba(255,255,255,.06); border:2px solid rgba(255,255,255,.14); border-radius:18px; padding:14px; }
      .item .sw { width:100%; height:52px; border-radius:12px; margin-bottom:8px; border:2px solid rgba(0,0,0,.3); }
      .item h4 { font-size:15px; margin-bottom:2px; }
      .item p { font-size:12px; opacity:.75; line-height:1.3; min-height:31px; }
      .item .buy { margin-top:8px; width:100%; padding:8px; font-size:14px; border-radius:12px; }
      .ribbon { background:linear-gradient(90deg,#ff9d3e,#ff5ea8); border-radius:10px; font-size:12.5px; font-weight:800; padding:6px 12px; display:inline-block; margin-bottom:10px; }
      .tier { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.05); border-radius:12px; padding:8px 12px; margin-bottom:6px; font-size:14px; text-align:left; }
      .tier .n { font-weight:900; color:#ffb35e; width:52px; }
      .passhead { background:linear-gradient(100deg,#5b35a8,#a83e8f,#e8701a); border-radius:18px; padding:16px; margin-bottom:12px; box-shadow:0 6px 20px rgba(142,91,217,.35); }
      .passhead h3 { font-size:22px; text-shadow:0 2px 6px #000; letter-spacing:1px; }
      .passhead p { font-size:13px; opacity:.95; margin-top:4px; }
      .tierrow { display:grid; grid-template-columns:40px 1fr 1.2fr; gap:7px; margin-bottom:6px; text-align:left; }
      .tn { font-weight:900; color:#ffb35e; display:flex; align-items:center; justify-content:center; font-size:13px; background:rgba(255,255,255,.05); border-radius:10px; }
      .tcell { border-radius:12px; padding:8px 11px; font-size:13px; background:rgba(255,255,255,.05); display:flex; align-items:center; }
      .tcell.prem { background:linear-gradient(135deg, rgba(142,91,217,.4), rgba(255,94,168,.28)); border:1.5px solid #b37dff; }
      .tcell.marquee { background:linear-gradient(135deg, rgba(255,157,62,.35), rgba(255,94,168,.35)); border:2px solid #ffd23f; box-shadow:0 0 16px rgba(255,210,63,.35); font-weight:800; font-size:13.5px; }
      .trackhead { display:grid; grid-template-columns:40px 1fr 1.2fr; gap:7px; margin-bottom:6px; font-size:12px; font-weight:900; opacity:.8; text-align:center; }
      /* district map */
      #map-screen { background:linear-gradient(180deg,#070414 0%,#150d33 52%,#241548 100%); pointer-events:auto; overflow:hidden; gap:10px; }
      #mapSky { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      #mapMoon { position:absolute; top:7%; right:9%; width:70px; height:70px; border-radius:50%; background:radial-gradient(circle at 38% 34%, #fff8dc, #ffd98a 62%, #e8a950); box-shadow:0 0 60px 20px rgba(255,208,120,.22); }
      .mstar { position:absolute; border-radius:50%; background:#fff; animation:mtwinkle 3s ease-in-out infinite; }
      @keyframes mtwinkle { 0%,100%{opacity:.12} 50%{opacity:.9} }
      .mcloud { position:absolute; height:46px; border-radius:60px; background:rgba(140,110,210,.14); filter:blur(12px); animation:mdrift linear infinite; }
      @keyframes mdrift { from{transform:translateX(-40vw)} to{transform:translateX(140vw)} }
      #mapVig { position:absolute; inset:0; box-shadow:inset 0 0 150px 55px rgba(4,2,12,.8); }
      #mapHead { position:relative; z-index:2; margin-top:calc(6px + env(safe-area-inset-top)); }
      #mapTitle { font-size:min(6.5vw,32px); font-weight:900; letter-spacing:2px; color:#ffb35e; text-shadow:0 3px 0 #7a3040, 0 6px 18px #000; }
      #mapEmber { font-size:14.5px; font-weight:800; color:#e8dcff; opacity:.92; margin-top:4px; text-shadow:0 2px 6px #000; }
      #mapCozy { font-size:13px; font-weight:800; color:#ffd9a8; margin-top:3px; text-shadow:0 2px 6px #000; }
      #mapWrap { position:relative; z-index:2; width:min(880px,92vw); height:min(56vh,430px); }
      #mapSvg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
      #mapHint { position:relative; z-index:2; font-size:12.5px; font-weight:800; opacity:.55; text-shadow:0 2px 4px #000; }
      #mapClose { position:absolute; top:calc(10px + env(safe-area-inset-top)); right:calc(12px + env(safe-area-inset-right)); width:46px; height:46px; border-radius:14px; background:rgba(20,12,40,.75); border:1.5px solid rgba(255,255,255,.28); color:#fff; font-size:19px; font-weight:800; font-family:inherit; z-index:3; cursor:pointer; }
      .mnode { position:absolute; width:118px; margin-left:-59px; margin-top:-30px; text-align:center; cursor:pointer; z-index:2; }
      .mnode.lock { cursor:default; }
      .mnode .mring { position:absolute; left:50%; top:27px; width:62px; height:62px; margin:-31px 0 0 -31px; border-radius:50%; border:3px dashed rgba(255,225,160,.95); opacity:0; animation:mspin 9s linear infinite; }
      .mnode.sel .mring { opacity:1; }
      @keyframes mspin { to{ transform:rotate(360deg); } }
      .mlamp { position:relative; font-size:38px; line-height:54px; height:54px; filter:grayscale(.15) brightness(.9); }
      .mnode.done .mlamp { filter:drop-shadow(0 0 10px #ffb35e) drop-shadow(0 0 26px rgba(255,150,60,.55)); }
      .mnode.avail .mlamp { animation:mpulse 1.5s ease-in-out infinite; }
      @keyframes mpulse { 0%,100%{ filter:drop-shadow(0 0 4px #ffb35e); transform:scale(1);} 50%{ filter:drop-shadow(0 0 18px #ffd27a); transform:scale(1.12);} }
      .mnode.lock .mlamp { filter:grayscale(1) brightness(.45); }
      .mnode.mboss.avail .mlamp { animation:mpulseB 1.3s ease-in-out infinite; }
      @keyframes mpulseB { 0%,100%{ filter:drop-shadow(0 0 6px #b34aff) brightness(.85); transform:scale(1);} 50%{ filter:drop-shadow(0 0 22px #ff3a60) brightness(1.1); transform:scale(1.1);} }
      .mcrown { position:absolute; top:-16px; left:50%; transform:translateX(-50%) rotate(-8deg); font-size:20px; }
      .mstars { font-size:15px; letter-spacing:2px; height:22px; line-height:20px; }
      .mnode.done .mstars { display:inline-block; background:rgba(12,8,26,.78); border-radius:10px; padding:0 8px; box-shadow:0 1px 6px rgba(0,0,0,.5); }
      .mstars .off { filter:grayscale(1); opacity:.3; }
      .mname { font-size:12px; font-weight:900; line-height:1.2; text-shadow:0 2px 4px #000; margin-top:2px; }
      .mtime { font-size:10.5px; font-weight:700; opacity:.75; margin-top:2px; text-shadow:0 1px 3px #000; }
      .mnode.lock .mname, .mnode.lock .mtime { opacity:.55; }
      .mnode.sel { z-index:4; }
      /* short screens (landscape phones): the nodes crowd — keep lamps + STARS, hide the prose off unselected nodes */
      @media (max-height:560px){
        .mlamp { font-size:30px; line-height:42px; height:42px; }
        .mnode:not(.sel):not(.mboss) .mname, .mnode:not(.sel) .mtime { display:none; }
        .mnode.mboss:not(.sel) .mname { font-size:10.5px; }
      }
      /* level clear */
      #clearName { font-size:15px; font-weight:800; color:#e8dcff; opacity:.9; letter-spacing:1px; }
      .cstarRow { display:flex; gap:12px; justify-content:center; margin:12px 0 2px; }
      .cstar { width:98px; background:rgba(255,255,255,.06); border:2px solid rgba(255,255,255,.14); border-radius:16px; padding:10px 6px 8px; opacity:0; transform:scale(.4); animation:cstarIn .45s cubic-bezier(.34,1.56,.64,1) forwards; }
      .cstar:nth-child(1){ animation-delay:.15s } .cstar:nth-child(2){ animation-delay:.55s } .cstar:nth-child(3){ animation-delay:.95s }
      @keyframes cstarIn { to{ opacity:1; transform:scale(1);} }
      .cstar .big { font-size:28px; }
      .cstar.off .big { filter:grayscale(1); opacity:.35; }
      .cstar .lbl { font-size:11.5px; font-weight:800; opacity:.9; margin-top:4px; }
      /* rotate-to-landscape hint (portrait + touch only; non-blocking, dismissible) */
      #rotateHint { position:fixed; inset:0; z-index:70; background:rgba(10,6,22,.93); display:none; flex-direction:column; align-items:center; justify-content:center; gap:20px; text-align:center; pointer-events:auto; }
      #rotPhone { width:64px; height:110px; border:5px solid #ffb35e; border-radius:14px; position:relative; animation:rotTip 2.2s ease-in-out infinite; box-shadow:0 0 24px rgba(255,140,46,.35); }
      #rotPhone::after { content:"🎃"; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:30px; }
      @keyframes rotTip { 0%,18%{ transform:rotate(0deg);} 45%,80%{ transform:rotate(-90deg);} 100%{ transform:rotate(-90deg);} }
      #rotateHint h3 { color:#ffb35e; font-size:22px; text-shadow:0 2px 8px #000; }
      #rotateHint p { opacity:.8; font-size:14.5px; }
      #fade { position:fixed; inset:0; background:#0d0a18; opacity:1; transition:opacity .5s; pointer-events:none; z-index:50; }
      #hurtvig { position:fixed; inset:0; box-shadow:inset 0 0 120px 40px rgba(255,30,50,.55); opacity:0; transition:opacity .4s; pointer-events:none; z-index:40; }
      .heartsRow { font-size:34px; }
      #dbg { position:fixed; bottom:2px; left:4px; font-size:10px; opacity:.45; z-index:60; pointer-events:none; }
    `;
    document.head.appendChild(css);
    const ui = document.createElement('div');
    ui.id='ui';
    ui.innerHTML = `
      <div id="hud">
        <div id="hearts">♥♥♥</div>
        <div class="hud-pill">🍬 <span id="candyN">0</span></div>
        <div class="hud-pill" id="livesPill" style="display:none">👻 ×<span id="livesN">5</span></div>
        <div class="hud-pill" id="gpPill" style="display:none">🎃 <span id="gpN">0/3</span></div>
        <div class="hud-pill" id="emberPill">🔥 <span id="emberN">0/5</span> embers</div>
      </div>
      <button id="pauseBtn" class="ui-block">⚙️</button>
      <div id="bossbar"><div id="bossname"></div><div id="bosshp"></div></div>
      <button id="prompt" class="btn orange ui-block"></button>
      <div id="dlg" class="ui-block"><span class="ic"></span><span class="tx"></span><div class="tap">tap to close</div></div>
      <div id="toast"></div>
      <div id="stick"><div id="nub"></div></div>
      <div id="touchBtns">
        <div id="btnC" class="tbtn ui-block">💥</div>
        <div id="btnB" class="tbtn ui-block">SPIN</div>
        <div id="btnA" class="tbtn ui-block">JUMP</div>
      </div>
      <div id="lvlcard"><div id="lvlname"></div><div id="lvlsub"></div></div>
      <div id="title-screen" class="screen">
        <div id="logo">GRIMM<span class="v">WICK</span></div>
        <div id="tagline">🎃 Relight the Night 🎃</div>
        <div id="tap">– tap anywhere to play –</div>
        <div style="display:flex;gap:10px;margin-top:26px">
          <button id="nightBtnTitle" class="btn ghost2 ui-block">🏮 The Night Board</button>
          <button id="howBtnTitle" class="btn ghost2 ui-block">📖 How to Play</button>
        </div>
        <div style="opacity:.55;font-size:12px;margin-top:14px">v1.0 · all 5 districts</div>
      </div>
      <div id="intro-screen" class="screen"><div class="card">
        <button id="introSkip" class="xClose ui-block" title="Skip">✕</button>
        <div style="font-size:44px" id="introIcon">🌕</div>
        <div id="introSlide" style="margin:14px 0"></div>
        <button id="introNext" class="btn orange ui-block">Next ➜</button>
      </div></div>
      <div id="pause-screen" class="screen"><div class="card">
        <button id="pauseX" class="xClose ui-block" title="Close">✕</button>
        <h2 style="margin-bottom:16px">⏸️ Paused</h2>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn ui-block" id="resumeBtn">▶️ Resume</button>
          <button class="btn ghost2 ui-block" id="pauseRestartBtn">🔁 Restart Level</button>
          <button class="btn ghost2 ui-block" id="pauseMapBtn">🗺️ Level Select (Map)</button>
          <button class="btn ghost2 ui-block" id="nightBtn">🏮 The Night Board</button>
          <button class="btn ghost2 ui-block" id="townBtn">🏘️ Return to Town</button>
          <div style="display:flex;align-items:center;gap:10px;justify-content:space-between"><span>🎵 Music</span><input type="range" id="musVol" class="ui-block" min="0" max="100" value="50" style="width:150px"></div>
          <div style="display:flex;align-items:center;gap:10px;justify-content:space-between"><span>🔊 Sounds</span><input type="range" id="sfxVol" class="ui-block" min="0" max="100" value="80" style="width:150px"></div>
          <button class="btn ghost2 ui-block" id="cozyBtn">🧸 Cozy Mode: OFF</button>
          <button class="btn ghost2 ui-block" id="howBtn">📖 How to Play</button>
          <button class="btn ghost2 ui-block" id="resetBtn">🗑️ Reset Save (outfits stay)</button>
          <button class="btn ghost2 ui-block" id="feedbackBtn">💬 Send Feedback</button>
        </div>
      </div></div>
      <div id="shop-screen" class="screen"><div class="card">
        <button id="shopX" class="xClose ui-block" title="Close">✕</button>
        <h2 style="margin-bottom:4px">🎩 Costume Cauldron</h2>
        <div style="opacity:.8;font-size:14px;margin-bottom:12px">Your candy: 🍬 <span id="shopCandy">0</span></div>
        <div class="tabs">
          <div class="tab on ui-block" data-tab="costumes">Costumes</div>
          <div class="tab ui-block" data-tab="ups">⬆️ Level Ups</div>
          <div class="tab ui-block" data-tab="chars">Characters</div>
        </div>
        <div id="shopBody"></div>
        <button class="btn ui-block" id="shopClose" style="margin-top:14px">Done</button>
      </div></div>
      <div id="map-screen" class="screen">
        <div id="mapSky"></div>
        <div id="mapHead">
          <div id="mapTitle"></div>
          <div id="mapEmber"></div>
          <div id="mapCozy" style="display:none">🧸 cozy night, records asleep</div>
          <div id="mapHint">← → choose &nbsp;·&nbsp; Enter start &nbsp;·&nbsp; Esc town</div>
        </div>
        <div id="mapWrap"></div>
        <button id="mapClose" class="ui-block">✕</button>
      </div>
      <div id="clear-screen" class="screen"><div class="card">
        <div style="font-size:46px">🏮</div>
        <h2 style="margin:6px 0;color:#ffb35e">LEVEL CLEAR!</h2>
        <div id="clearName"></div>
        <div id="clearStars" class="cstarRow"></div>
        <div id="clearStats" style="font-size:15px;opacity:.92;margin:8px 0"></div>
        <div class="clearBtns" style="display:flex;flex-direction:column;gap:10px">
          <button class="btn orange ui-block" id="clearNext">▶️ NEXT LEVEL</button>
          <button class="btn ui-block" id="clearReplay">🔁 REPLAY</button>
          <button class="btn ghost2 ui-block" id="clearMap">🗺️ MAP</button>
        </div>
      </div></div>
      <div id="death-screen" class="screen"><div class="card">
        <div style="font-size:50px">👻</div>
        <h2 style="margin:10px 0">The night got you!</h2>
        <p style="opacity:.8;margin-bottom:16px">Don't worry. Grimmwick believes in you.</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn ui-block" id="reviveBtn" style="display:none">🍬 Second Wind: revive here (200 candy)</button>
          <button class="btn orange ui-block" id="respawnBtn">🕯️ Back to the lantern</button>
        </div>
      </div></div>
      <div id="gameover-screen" class="screen"><div class="card">
        <div style="font-size:52px">🌑</div>
        <h2 style="margin:10px 0;color:#ff5e7a">OUT OF LIVES!</h2>
        <p style="opacity:.85;margin-bottom:14px">The night got the better of you this time...</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn ui-block" id="continueBtn" style="display:none">🍬 Keep going from the lantern: 3 lives (500 candy)</button>
          <button class="btn orange ui-block" id="gameoverBtn">🔁 Restart the level (5 fresh lives)</button>
        </div>
      </div></div>
      <div id="victory-screen" class="screen"><div class="card">
        <div id="vEmoji" style="font-size:54px">🔥</div>
        <h2 id="vTitle" style="margin:8px 0;color:#ffb35e">GUARDIAN FREED!</h2>
        <p id="vBody" style="font-size:16px;line-height:1.5;margin-bottom:8px"></p>
        <div id="vstats" style="font-size:15px;opacity:.9;margin:10px 0"></div>
        <button class="btn orange ui-block" id="vHome">🏘️ Return to Grimmwick</button>
      </div></div>
      <div id="finaleBanner" style="display:none;position:fixed;left:0;right:0;top:26%;z-index:60;text-align:center;pointer-events:none;padding:0 6vw;
        font-family:inherit;font-weight:900;font-size:clamp(22px,4.6vw,42px);color:#ffe9c4;
        text-shadow:0 0 18px rgba(255,160,60,.9),0 0 60px rgba(255,120,40,.55),0 3px 0 rgba(40,10,50,.8);opacity:0;transition:opacity .45s"></div>
      <div id="rotateHint" class="ui-block">
        <div id="rotPhone"></div>
        <h3>Turn sideways to play!</h3>
        <p>Grimmwick plays best in landscape 🏮<br><span style="opacity:.6;font-size:12.5px">– tap anywhere to keep playing upright –</span></p>
      </div>
      <div id="vig" style="position:fixed;inset:0;pointer-events:none;z-index:5;box-shadow:inset 0 0 140px 46px rgba(8,4,20,.5)"></div>
      <div id="hurtvig"></div>
      <div id="fade"></div>
      <div id="dbg"></div>
    `;
    document.body.appendChild(ui);
    this.el = id=>document.getElementById(id);
    // wire buttons.
    // bindTap = TAP DETECTION for buttons inside scrollable screens: touchstart no longer preventDefaults
    // (so a thumb-drag scrolls the card instead of auto-clicking whatever it lands on); the action fires on
    // touchend only if the finger barely moved. preventDefault there kills iOS's ghost mousedown; the
    // lastTouch guard is belt-and-braces for the dangerous buttons (reset save, candy spends).
    let lastTouch = 0;
    const bindTap = (e,fn)=>{ let sx=0, sy=0, st=0, live=false;
      e.addEventListener('touchstart', ev=>{ ev.stopPropagation(); const t=ev.changedTouches[0]; sx=t.clientX; sy=t.clientY; st=performance.now(); live=true; },{passive:true});
      e.addEventListener('touchmove', ev=>{ if(!live) return; const t=ev.changedTouches[0]; if(Math.hypot(t.clientX-sx, t.clientY-sy) > 12) live=false; },{passive:true});
      e.addEventListener('touchend', ev=>{ if(!live) return; live=false; const t=ev.changedTouches[0];
        if(Math.hypot(t.clientX-sx, t.clientY-sy) <= 12 && performance.now()-st < 700){ ev.preventDefault(); ev.stopPropagation(); lastTouch=performance.now(); fn(); } },{passive:false});
      e.addEventListener('touchcancel', ()=>{ live=false; });
      e.addEventListener('mousedown', ev=>{ if(performance.now()-lastTouch < 800) return; ev.stopPropagation(); fn(); });
    };
    this.bindTap = bindTap;   // renderShop/renderMap rebuild DOM and rebind with this
    const tap = (id,fn)=>bindTap(this.el(id), fn);
    // instant = the old fire-on-touchstart path — ONLY for gameplay controls over the canvas where
    // latency matters and preventDefault also keeps the touch from spawning the joystick underneath
    const instant = (id,fn)=>{ const e=this.el(id);
      e.addEventListener('touchstart', ev=>{ev.preventDefault();ev.stopPropagation();fn();},{passive:false});
      e.addEventListener('mousedown', ev=>{ev.stopPropagation();fn();});
    };
    instant('pauseBtn', ()=>this.togglePause());
    tap('resumeBtn', ()=>this.togglePause(false));
    // Night Board / How-to open OVER the pause menu — the game stays paused behind them
    tap('nightBtn', ()=>{ window.NightBoard && NightBoard.open(); });
    tap('nightBtnTitle', ()=>{ window.NightBoard && NightBoard.open(); });
    tap('howBtn', ()=>this.showHowTo());
    tap('howBtnTitle', ()=>this.showHowTo());
    tap('townBtn', ()=>{ this.togglePause(false); G.returnToHub(false); });
    tap('pauseRestartBtn', ()=>{ this.togglePause(false); AUDIO.ui(); if(G.area.startsWith('boss')) G.startBoss(G.bossDistrict||'w1'); else if(G.levelDef) G.enterLevel(G.levelDef.id); });
    tap('pauseMapBtn', ()=>{ this.togglePause(false); AUDIO.ui(); const d = G.levelDef ? G.levelDef.id.slice(0,2) : (G.bossDistrict||'w1'); G.toMap(d); });
    tap('cozyBtn', ()=>{ G.toggleCozy(); this.el('cozyBtn').textContent = '🧸 Cozy Mode: '+(G.save.cozy?'ON':'OFF'); });
    tap('feedbackBtn', ()=>{ AUDIO.ui();   // opens the Mail composer — a player choosing to write is not data collection
      window.location.href = 'mailto:grimmwickgame@gmail.com?subject=' + encodeURIComponent('Grimmwick Feedback')
        + '&body=' + encodeURIComponent('\n\n--\nGrimmwick v1.0 · from the pause menu'); });
    tap('resetBtn', ()=>{ if(this._resetArm){ G.resetSave(); location.reload(); } else { this._resetArm=true; this.el('resetBtn').textContent='⚠️ Really? Tap again'; } });
    tap('shopClose', ()=>this.closeShop());
    tap('shopX', ()=>this.closeShop());
    tap('pauseX', ()=>this.togglePause(false));
    tap('introSkip', ()=>{ AUDIO.ui(); this.el('intro-screen').style.display='none'; this._introDone && this._introDone(); });
    tap('mapClose', ()=>{ AUDIO.ui(); this.hideMap(); G.closeMap(); });
    tap('clearNext', ()=>{ const s=this._clearStats; this.el('clear-screen').style.display='none'; AUDIO.ui(); if(s&&s.nextId) G.enterLevel(s.nextId); });
    tap('clearReplay', ()=>{ const s=this._clearStats; this.el('clear-screen').style.display='none'; AUDIO.ui(); if(s) G.enterLevel(s.levelId); });
    tap('clearMap', ()=>{ const s=this._clearStats; this.el('clear-screen').style.display='none'; AUDIO.ui(); G.toMap((s&&s.levelId&&s.levelId.slice(0,2))||'w1'); });
    // fullbleed map: swallow background touches so they never reach the game input layer
    const ms=this.el('map-screen');
    ms.addEventListener('touchstart', e=>e.stopPropagation(), {passive:true});
    ms.addEventListener('mousedown', e=>e.stopPropagation());
    tap('respawnBtn', ()=>{ this.el('death-screen').style.display='none'; G.respawnPlayer(); });
    tap('reviveBtn', ()=>{ G.reviveHere(); });
    tap('vHome', ()=>{ this.el('victory-screen').style.display='none'; G.returnToHub(true); });
    tap('gameoverBtn', ()=>G.gameOverRestart());
    tap('continueBtn', ()=>G.candyContinue());
    tap('introNext', ()=>this.nextIntro());
    instant('prompt', ()=>INPUT.pressInteract());
    // rotate-to-landscape hint: shown ONCE at boot when a touch device starts in portrait; gone on rotate or tap
    instant('rotateHint', ()=>{ this._rotDone = true; this.el('rotateHint').style.display='none'; });
    const rotCheck = ()=>{
      if(this._rotDone) return;
      const portrait = window.innerHeight > window.innerWidth;
      if(!portrait){ this._rotDone = true; this.el('rotateHint').style.display='none'; return; }   // rotated — hint done for this session
      this.el('rotateHint').style.display='flex';
    };
    addEventListener('resize', ()=>{ if(!this._rotDone && window.innerWidth > window.innerHeight){ this._rotDone = true; this.el('rotateHint').style.display='none'; } });
    if(INPUT.isTouch) setTimeout(rotCheck, 600);   // at boot, after the fade begins — title is visible behind it
    this.el('dlg').addEventListener('mousedown', ()=>this.closeDialogue());
    this.el('dlg').addEventListener('touchstart', e=>{e.preventDefault();this.closeDialogue();},{passive:false});
    // touch action buttons
    const bA=this.el('btnA');
    bA.addEventListener('touchstart', e=>{e.preventDefault();e.stopPropagation();INPUT.pressJump();},{passive:false});
    bA.addEventListener('touchend', e=>{INPUT.releaseJump();});
    bA.addEventListener('touchcancel', e=>{INPUT.releaseJump();});
    instant('btnB', ()=>INPUT.pressAttack());
    const bC=this.el('btnC');   // pound needs press AND release — grounded hold = spring charge
    bC.addEventListener('touchstart', e=>{e.preventDefault();e.stopPropagation();INPUT.pressPound();},{passive:false});
    bC.addEventListener('touchend', e=>{INPUT.releasePound();});
    bC.addEventListener('touchcancel', e=>{INPUT.releasePound();});
    // volume sliders
    this.el('musVol').addEventListener('input', e=>AUDIO.setMusVol(e.target.value/100));
    this.el('sfxVol').addEventListener('input', e=>AUDIO.setSfxVol(e.target.value/100));
    // shop tabs
    document.querySelectorAll('.tab').forEach(t=>{
      bindTap(t, ()=>{ document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on')); t.classList.add('on'); this.renderShop(t.dataset.tab); });
    });
    if(INPUT.isTouch){ this.el('touchBtns').style.display='flex'; document.documentElement.classList.add('touch'); }
  },
  // ---------- title & intro ----------
  showTitle(){ this.el('title-screen').style.display='flex'; this.el('hud').style.display='none'; this.el('pauseBtn').style.display='none'; },
  hideTitle(){ this.el('title-screen').style.display='none'; this.el('hud').style.display='flex'; this.el('pauseBtn').style.display='block'; },
  startIntro(done){
    this._introDone = done; this._slide = 0;
    this.el('intro-screen').style.display='flex';
    this.showSlide();
  },
  showSlide(){
    const s = STORY_SLIDES[this._slide];
    this.el('introIcon').textContent = s.icon;
    this.el('introSlide').textContent = s.text;
    this.el('introNext').textContent = this._slide===STORY_SLIDES.length-1 ? '🎃 Begin!' : 'Next ➜';
  },
  nextIntro(){
    AUDIO.ui();
    this._slide++;
    if(this._slide>=STORY_SLIDES.length){
      this.el('intro-screen').style.display='none';
      this._introDone && this._introDone();
    } else this.showSlide();
  },
  // ---------- HUD ----------
  updateHUD(){
    const G=this.G, pl=G.player;
    if(pl){
      let h=''; for(let i=0;i<pl.maxHearts;i++) h += i<pl.hearts?'❤️':'🖤';
      this.el('hearts').textContent = h;
    }
    this.el('candyN').textContent = G.save.candy;
    this.el('emberN').textContent = G.save.embers+'/5';
    const inLevel = !!G.levelDef || G.area.startsWith('boss');
    this.el('gpPill').style.display = inLevel?'block':'none';
    this.el('livesPill').style.display = inLevel?'block':'none';
    this.el('livesN').textContent = G.save.lives??5;
    this.el('emberPill').style.display = inLevel?'none':'block';
    if(inLevel) this.el('gpN').textContent = G.runPumpkins.filter(Boolean).length+'/3';
  },
  hurtFlash(){
    const v=this.el('hurtvig'); v.style.opacity=1;
    setTimeout(()=>v.style.opacity=0, 300);
  },
  // ---------- prompt & dialogue ----------
  setPrompt(p){
    const el = this.el('prompt');
    if(!p){ el.style.display='none'; this._prompt=null; return; }
    this._prompt = p;
    el.style.display='block';
    el.classList.toggle('hot', !!p.hot);
    el.textContent = p.label + (INPUT.isTouch?'':'  (E)');
  },
  dialogue(icon, text){
    const d = this.el('dlg');
    d.querySelector('.ic').textContent = icon;
    d.querySelector('.tx').textContent = text;
    d.style.display='block';
    AUDIO.ui();
    clearTimeout(this._dlgT);
    this._dlgT = setTimeout(()=>this.closeDialogue(), 9000);
  },
  closeDialogue(){ this.el('dlg').style.display='none'; },
  mayorDialogue(){
    this._mayorI = (this._mayorI===undefined?0:this._mayorI+1)%MAYOR_LINES.length;
    this.dialogue('👻', MAYOR_LINES[this._mayorI]);
  },
  toast(msg, ms){
    if(!msg) return;
    const t=this.el('toast');
    t.textContent=msg; t.style.opacity=1;
    clearTimeout(this._toastT);
    this._toastT=setTimeout(()=>t.style.opacity=0, ms||2600);
  },
  // an overlay (Night Board / How-to) is showing — the title's tap-to-start must not fire beneath it
  overlayOpen(){
    const nb = document.getElementById('nb-screen'), how = document.getElementById('how-screen');
    return (nb && nb.style.display === 'block') || (how && how.style.display === 'flex')
      || performance.now() - (this._ovCloseT||0) < 350;   // the closing tap itself must not fall through to tap-to-start
  },
  // ---------- HOW TO PLAY (the reference card — the real teaching happens in-level) ----------
  showHowTo(){
    let el = this.el('how-screen');
    if(!el){
      el = document.createElement('div');
      el.id='how-screen'; el.className='screen ui-block';
      el.style.cssText = "position:fixed;z-index:65;background:rgba(10,6,22,.94);color:#fff;font-family:-apple-system,'SF Pro Rounded','Segoe UI',system-ui,sans-serif";   // lives on body: needs its own stacking + font + WHITE text (body styles don't apply)
      document.body.appendChild(el);
    }
    const touch = INPUT.isTouch;
    const rows = touch ? [
      ['🕹️','Left thumb anywhere','walk & run'],
      ['🟣','JUMP','hop · press AGAIN in the air = DOUBLE-JUMP · HOLD = higher'],
      ['🟠','SPIN','bonk enemies & lanterns'],
      ['💥','POUND','slam down · HOLD it standing still, release = SPRING JUMP'],
      ['👆','Walk up to things','signs, coffins & friends show a button'],
    ] : [
      ['🕹️','WASD / arrows','walk & run'],
      ['⬜','SPACE','jump · press AGAIN in the air = DOUBLE-JUMP · HOLD = higher'],
      ['🅹','J','spin: bonk enemies & lanterns'],
      ['🅺','K','ground-pound · HOLD standing still, release = SPRING JUMP'],
      ['🅴','E','talk, read & open things'],
    ];
    el.innerHTML = `<div class="card" style="max-width:520px">
      <button id="howX" class="xClose ui-block">✕</button>
      <h2>📖 How to Play</h2>
      <div style="text-align:left;font-size:14px;line-height:1.5;margin:10px 0 4px">
        ${rows.map(r=>`<div style="display:flex;gap:10px;margin:7px 0"><div style="width:26px;text-align:center">${r[0]}</div><b style="min-width:${touch?118:106}px">${r[1]}</b><div style="opacity:.85">${r[2]}</div></div>`).join('')}
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.15)">
          <b>🎩 Tricks of the night</b>
          <div style="opacity:.85;margin-top:5px">👟 Bounce off enemies' heads · 🕸️ press UP on webs, vines &amp; chains to CLIMB · 👀 STARE at a Boo and it freezes · 🎃 ground-pound a giant pumpkin for a MEGA-BOUNCE · 🏮 checkpoint lanterns remember your place</div>
        </div>
        <div style="margin-top:8px;opacity:.6;font-size:12.5px">🎮 Controllers work too: stick to move, A jump, X spin, B pound.</div>
      </div>
    </div>`;
    this.bindTap(el.querySelector('#howX'), ()=>{ el.style.display='none'; this._ovCloseT = performance.now(); AUDIO.ui(); });
    el.style.display='flex';
    AUDIO.ui();
  },
  // ---------- level card ----------
  levelIntro(name, sub){
    const c=this.el('lvlcard');
    clearTimeout(this._lvlT1); clearTimeout(this._lvlT2);   // a re-entry within 3.5s must not have stale timers hide the new card
    this.el('lvlname').textContent=name;
    this.el('lvlsub').textContent=sub;
    c.style.display='block'; c.style.opacity=1; c.style.transition='';
    this._lvlT1 = setTimeout(()=>{ c.style.transition='opacity 1s'; c.style.opacity=0; }, 2400);
    this._lvlT2 = setTimeout(()=>{ c.style.display='none'; c.style.transition=''; }, 3500);
  },
  // ---------- boss bar ----------
  showBossBar(name, hp, max){
    this.el('bossbar').style.display='block';
    this.el('bossname').textContent = '👑 '+name;
    const bar=this.el('bosshp'); bar.innerHTML='';
    for(let i=0;i<max;i++){ const d=document.createElement('div'); d.className='bhp'+(i<hp?' on':''); bar.appendChild(d); }
  },
  updateBossBar(hp){
    document.querySelectorAll('.bhp').forEach((d,i)=>d.classList.toggle('on', i<hp));
  },
  hideBossBar(){ this.el('bossbar').style.display='none'; },
  // ---------- touch stick ----------
  showStick(x,y){ const s=this.el('stick'); s.style.display='block'; s.style.left=(x-55)+'px'; s.style.top=(y-55)+'px'; },
  moveStick(st){ const n=this.el('nub'); const dx=clamp(st.x-st.ox,-40,40), dy=clamp(st.y-st.oy,-40,40); n.style.left=(29+dx)+'px'; n.style.top=(29+dy)+'px'; },
  hideStick(){ this.el('stick').style.display='none'; const n=this.el('nub'); n.style.left='29px'; n.style.top='29px'; },
  // ---------- pause ----------
  togglePause(force){
    const G=this.G;
    const show = force!==undefined?force:(G.state!=='paused');
    if(show && G.state!=='play') return;
    this._resetArm=false; this.el('resetBtn').textContent='🗑️ Reset Save (outfits stay)';
    if(show){ G.state='paused'; this.el('pause-screen').style.display='flex'; this.el('cozyBtn').textContent = '🧸 Cozy Mode: '+(this.G.save.cozy?'ON':'OFF');
      const inLevel = !!G.levelDef || G.area.startsWith('boss');   // Restart/Map only make sense inside a level or boss
      this.el('pauseRestartBtn').style.display = inLevel?'block':'none';
      this.el('pauseMapBtn').style.display = inLevel?'block':'none'; }
    else { G.state='play'; this.el('pause-screen').style.display='none'; }
    AUDIO.ui();
  },
  // ---------- shop ----------
  openShop(){
    if(this.G.state==='play'){ this.G.state='shop'; this.el('shop-screen').style.display='flex'; this.renderShop('costumes'); AUDIO.ui();
      if(!this.G.save.seenShop){ this.G.save.seenShop = true; this.G.persist(); }   // first-visit tour complete — the arrow moves on to the gates
    }
  },
  closeShop(){ this.el('shop-screen').style.display='none'; this.G.state='play'; AUDIO.ui(); },
  // real 3D portrait of Pip WEARING a costume — a tiny offscreen render of the actual rig, cached per key
  // (owner call, Aug 2026: the cauldron sold looks blind — you never saw the outfit until you were wearing it)
  costumePreview(key, mask){
    this._pvCache = this._pvCache || {};
    const ck = key + '|' + (mask||'');
    if(this._pvCache[ck] !== undefined) return this._pvCache[ck];
    let url = null;
    try{
      if(!this._pvR){
        this._pvR = new THREE.WebGLRenderer({alpha:true, antialias:true, preserveDrawingBuffer:true});
        this._pvR.setSize(180, 210);
        this._pvScene = new THREE.Scene();
        this._pvScene.add(new THREE.AmbientLight(0xbfb8e8, 1.15));
        const dir = new THREE.DirectionalLight(0xfff2d8, 1.7); dir.position.set(1.5, 2.5, 2.5); this._pvScene.add(dir);
        this._pvCam = new THREE.PerspectiveCamera(34, 180/210, 0.1, 20);
        this._pvCam.position.set(0.42, 1.25, 3.2); this._pvCam.lookAt(0, 0.8, 0);
      }
      const fake = { group: new THREE.Group() };   // buildRig only needs .group (its G.carryWeapon read is guarded)
      Player.prototype.buildRig.call(fake, key, mask||null);
      fake.group.rotation.y = 0.38;                // 3/4 hero pose
      this._pvScene.add(fake.group);
      this._pvR.render(this._pvScene, this._pvCam);
      url = this._pvR.domElement.toDataURL();
      this._pvScene.remove(fake.group);
    }catch(e){ url = null; }
    this._pvCache[ck] = url;
    return url;
  },
  renderShop(tab){
    const G=this.G, body=this.el('shopBody');
    this.el('shopCandy').textContent = G.save.candy;
    if(tab==='costumes'){
      body.innerHTML = '<div style="opacity:.75;font-size:13px;margin-bottom:10px">❤️ Hearts &amp; upgrades moved to the <b>⬆️ Level Ups</b> tab!</div><div id="shopGrid"></div>';
      const grid = body.querySelector('#shopGrid');
      // ---- THE MASK RACK — one accessory slot, any mask over any costume ----
      const mh = document.createElement('div');
      mh.style.cssText = 'grid-column:1/-1;margin:14px 0 2px;font-weight:900;letter-spacing:2px;color:#ffd98a;text-shadow:0 0 12px rgba(255,180,60,.4)';
      mh.textContent = '🎭 MASKS: wear one over ANY costume';
      grid.appendChild(mh);
      const wornCostume = G.save.equipped || 'kid';
      for(const mkey in MASKS){
        const m = MASKS[mkey];
        const ownedM = G.save.ownedMasks.includes(mkey);
        const wearing = G.save.mask === mkey;
        const div = document.createElement('div');
        div.className = 'item';
        const pv = this.costumePreview(wornCostume, mkey);
        div.innerHTML = `<div class="sw" style="height:110px;background:radial-gradient(ellipse at 50% 82%, rgba(0,0,0,.35), transparent 60%), linear-gradient(135deg,#3a2f5a66 60%,#5a3f7a66)">${pv?`<img src="${pv}" style="height:100%;width:auto;display:block;margin:0 auto;filter:drop-shadow(0 3px 5px rgba(0,0,0,.45))" alt="">`:`<div style="font-size:52px;line-height:110px">${m.icon}</div>`}</div>
          <h4>${m.icon} ${m.name}</h4><p>${m.desc}</p>
          <button class="btn buy ui-block ${wearing?'ghost2':(ownedM?'':(m.earned?'ghost2':'orange'))}">${wearing?'✓ On · tap to take off':(ownedM?'Wear it':(m.earned?'⭐ Earn all '+m.earned+' stars':'🍬 '+m.price))}</button>`;
        const btn = div.querySelector('button');
        this.bindTap(btn, ()=>{
          if(wearing){ G.save.mask = null; }
          else if(ownedM){ G.save.mask = mkey; }
          else if(m.earned){ AUDIO.ui(); this.toast('👑 The Star Crown can\'t be bought. Earn all '+m.earned+' stars! (Check ⬆️ Level Ups)'); return; }
          else if(G.save.candy >= m.price){ G.save.candy -= m.price; G.save.ownedMasks.push(mkey); G.save.mask = mkey; AUDIO.buy(); this.toast('🎭 New mask: '+m.name+'!'); }
          else { AUDIO.hurt(); this.toast('Not enough candy! Bonk more Boos 🍬'); return; }
          G.player && G.player.buildRig(G.save.equipped||'kid');
          G.persist(); AUDIO.buy();
          this.renderShop('costumes'); this.updateHUD();
        });
        grid.appendChild(div);
      }
      const ch = document.createElement('div');
      ch.style.cssText = 'grid-column:1/-1;margin:14px 0 2px;font-weight:900;letter-spacing:2px;color:#ffd98a;text-shadow:0 0 12px rgba(255,180,60,.4)';
      ch.textContent = '🎩 COSTUMES: whole new looks';
      grid.appendChild(ch);
      for(const key in COSTUMES){
        const c = COSTUMES[key];
        if(c.pass && !G.save.owned.includes(key)) continue;   // v1.0 launch: pass-exclusive looks hidden until the Spook Pass ships (owners from testing keep theirs)
        if(c.retired || c.character) continue;   // retired looks are off the rack; characters live in their own section above
        const owned = G.save.owned.includes(key);
        const equipped = G.save.equipped===key;
        const div = document.createElement('div');
        div.className='item';
        const cs = '#'+c.body.toString(16).padStart(6,'0');
        const ac = '#'+c.accent.toString(16).padStart(6,'0');
        const passBadge = c.pass ? `<div style="position:absolute;top:8px;right:8px;background:linear-gradient(90deg,#8e5bd9,#ff5ea8);border-radius:8px;font-size:10.5px;font-weight:900;padding:3px 7px">🌕 PASS</div>` : '';
        div.style.position='relative';
        const pv = this.costumePreview(key);
        const swInner = pv ? `<img src="${pv}" style="height:100%;width:auto;display:block;margin:0 auto;filter:drop-shadow(0 3px 5px rgba(0,0,0,.45))" alt="">` : '';
        div.innerHTML = `${passBadge}<div class="sw" style="height:110px;background:linear-gradient(135deg,${cs}44 60%,${ac}66), radial-gradient(ellipse at 50% 82%, rgba(0,0,0,.35), transparent 60%)${c.glow?';box-shadow:0 0 18px '+cs+' inset, 0 0 12px '+cs:''}">${swInner}</div>
          <h4>${c.name}</h4><p>${c.desc}</p>
          <button class="btn buy ui-block ${equipped?'ghost2':(owned?'':'orange')}">${equipped?'✓ Equipped':(owned?'Equip':(c.pass?'Try it (Pass)':(c.price===0?'Free':'🍬 '+c.price)))}</button>`;
        const btn = div.querySelector('button');
        const act = ev=>{
          ev.stopPropagation();
          if(equipped) return;
          if(owned || c.price===0){ G.save.equipped=key; G.player&&G.player.buildRig(key); G.persist(); AUDIO.buy(); }
          else if(G.save.candy>=c.price){ G.save.candy-=c.price; G.save.owned.push(key); G.save.equipped=key; G.player&&G.player.buildRig(key); G.persist(); AUDIO.buy(); this.toast('🎉 New costume: '+c.name+'!'); }
          else { AUDIO.hurt(); this.toast('Not enough candy! Bonk more Boos 🍬'); }
          this.renderShop('costumes'); this.updateHUD();
        };
        this.bindTap(btn, ()=>act({stopPropagation(){}}));
        grid.appendChild(div);
      }
    } else if(tab==='ups'){
      // ---- LEVEL UPS: earned star milestones (free) + candy-bought permanent upgrades. Never real money. ----
      const totalStars = Object.values(G.save.levels||{}).reduce((s,l)=>s + (l.stars? (l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0) : 0), 0);
      const claimed = G.save.claimed || (G.save.claimed = []);
      const wire = (btn, fn)=>this.bindTap(btn, fn);
      const grantHeart = ()=>{ if(G.save.maxHearts<5){ G.save.maxHearts++; if(G.player){ G.player.maxHearts=G.save.maxHearts+(G.save.cozy?2:0); G.player.hearts=G.player.maxHearts; } this.toast('❤️ Max hearts: '+G.save.maxHearts+'!'); return true; } return false; };
      const MILES = [
        {id:'s5',  at:5,  label:'🍬 200 candy',            grant:()=>{ G.addCandy(200); }},
        {id:'s12', at:12, label:'❤️ +1 MAX HEART',          grant:()=>{ if(!grantHeart()){ G.addCandy(400); this.toast('❤️ Hearts maxed: 🍬 400 instead!'); } }},
        {id:'s20', at:20, label:'🍬 600 + 👻 1-UP',         grant:()=>{ G.addCandy(600); G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+1); }},
        {id:'s30', at:30, label:'❤️ +1 MAX HEART',          grant:()=>{ if(!grantHeart()){ G.addCandy(900); this.toast('❤️ Hearts maxed: 🍬 900 instead!'); } }},
        {id:'s45', at:45, label:'🍬 2000 + 👻👻👻 3 1-UPs', grant:()=>{ G.addCandy(2000); G.save.lives=Math.min(9,(G.save.lives!==undefined?G.save.lives:5)+3); }},
        {id:'s75', at:75, label:'👑 THE STAR CROWN + 🍬 3000: the FLAWLESS reward', grant:()=>{
          G.addCandy(3000);
          if(!G.save.ownedMasks.includes('starcrown')) G.save.ownedMasks.push('starcrown');
          G.save.mask='starcrown'; G.player && G.player.buildRig(G.save.equipped||'kid');
          AUDIO.goldPumpkin(); this.toast('👑 THE STAR CROWN! All 75 stars. You ARE the night, Pip.', 5200); }},
      ];
      body.innerHTML = `
        <div class="ribbon">⭐ Earn stars in levels (fast · all-candy · no-damage) to LEVEL UP, plus candy upgrades below</div>
        <div style="font-weight:900;font-size:17px;margin-bottom:8px">⭐ Your stars: ${totalStars} / 75</div>
        <div id="mileList" style="text-align:left;margin-bottom:14px"></div>
        <div id="upGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;text-align:left"></div>`;
      const ml = body.querySelector('#mileList');
      for(const m of MILES){
        const done = claimed.includes(m.id), ready = !done && totalStars>=m.at;
        const row = document.createElement('div');
        row.className='tier';
        row.innerHTML = `<span class="n">${m.at}⭐</span><span style="flex:1">${m.label}</span>
          <button class="btn buy ui-block ${ready?'orange':'ghost2'}" style="padding:7px 14px;font-size:13.5px">${done?'✓ Claimed':(ready?'CLAIM!':`${totalStars}/${m.at}`)}</button>`;
        const btn = row.querySelector('button');
        if(ready) wire(btn, ()=>{ claimed.push(m.id); m.grant(); G.persist(); AUDIO.buy(); this.renderShop('ups'); this.updateHUD(); });
        ml.appendChild(row);
      }
      const ug = body.querySelector('#upGrid');
      // heart containers (also earnable free at 12⭐/30⭐ — both roads end at 5 hearts)
      const hPrice = {3:500, 4:1500}[G.save.maxHearts];
      const hDiv = document.createElement('div'); hDiv.className='item';
      hDiv.innerHTML = `<div class="sw" style="background:linear-gradient(135deg,#ff4d6d 60%,#8f1030);display:flex;align-items:center;justify-content:center;font-size:30px">❤️</div>
        <h4>Heart Container</h4><p>${G.save.maxHearts>=5?'FIVE hearts. A true legend of Grimmwick.':'One more heart, forever. Also FREE at 12⭐ and 30⭐!'}</p>
        <button class="btn buy ui-block ${hPrice?'orange':'ghost2'}">${hPrice?('🍬 '+hPrice+' · heart #'+(G.save.maxHearts+1)):'✓ MAXED'}</button>`;
      if(hPrice) wire(hDiv.querySelector('button'), ()=>{
        if(G.save.candy>=hPrice){ G.save.candy-=hPrice; grantHeart(); G.persist(); AUDIO.buy(); }
        else { AUDIO.hurt(); this.toast('Not enough candy! Bonk more Boos 🍬'); }
        this.renderShop('ups'); this.updateHUD();
      });
      ug.appendChild(hDiv);
      // candy magnet ranks (QoL pull radius — candy comes to you)
      const mRank = G.save.upMagnet||0;
      const mPrice = mRank===0?400:(mRank===1?900:null);
      const mDiv = document.createElement('div'); mDiv.className='item';
      mDiv.innerHTML = `<div class="sw" style="background:linear-gradient(135deg,#ffd23f 60%,#b8860b);display:flex;align-items:center;justify-content:center;font-size:30px">🧲</div>
        <h4>Candy Magnet ${mRank>0?['','I','II'][mRank]+' owned':''}</h4><p>${mRank>=2?'Max pull. Candy practically begs to be caught.':'Candy leaps to you from farther away.'+(mRank===1?' One rank left!':' Two ranks.')}</p>
        <button class="btn buy ui-block ${mPrice?'orange':'ghost2'}">${mPrice?('🍬 '+mPrice+' · rank '+['I','II'][mRank]):'✓ MAXED'}</button>`;
      if(mPrice) wire(mDiv.querySelector('button'), ()=>{
        if(G.save.candy>=mPrice){ G.save.candy-=mPrice; G.save.upMagnet=(G.save.upMagnet||0)+1; G.persist(); AUDIO.buy(); this.toast('🧲 Candy Magnet rank '+['','I','II'][G.save.upMagnet]+'!'); }
        else { AUDIO.hurt(); this.toast('Not enough candy! Bonk more Boos 🍬'); }
        this.renderShop('ups'); this.updateHUD();
      });
      ug.appendChild(mDiv);
    } else if(tab==='chars'){
      body.innerHTML = `<div id="shopGrid"></div>`;
      const grid = body.querySelector('#shopGrid');
      const isChar = k => !!(COSTUMES[k] && COSTUMES[k].character);
      const playingPip = !isChar(G.save.equipped||'kid');
      // --- PIP — the hero, wearing whatever costume was last equipped ---
      const pipLook = playingPip ? (G.save.equipped||'kid') : (G.save.prevCostume||'kid');
      const pipDiv = document.createElement('div');
      pipDiv.className='item';
      const pipPv = this.costumePreview(pipLook, G.save.mask);
      pipDiv.innerHTML = `<div class="sw" style="height:110px;background:radial-gradient(ellipse at 50% 82%, rgba(0,0,0,.35), transparent 60%), linear-gradient(135deg,#f2f0ff33 60%,#d8d4f066)">${pipPv?`<img src="${pipPv}" style="height:100%;width:auto;display:block;margin:0 auto;filter:drop-shadow(0 3px 5px rgba(0,0,0,.45))" alt="">`:''}</div>
        <h4>Pip</h4><p>The smallest hero in Grimmwick. Never underestimated twice.</p>
        <button class="btn buy ui-block ${playingPip?'ghost2':'orange'}">${playingPip?'✓ Playing':'Play as Pip'}</button>`;
      this.bindTap(pipDiv.querySelector('button'), ()=>{
        if(playingPip) return;
        G.save.equipped = G.save.prevCostume||'kid'; G.player && G.player.buildRig(G.save.equipped);
        G.persist(); AUDIO.buy(); this.renderShop('chars'); this.updateHUD();
      });
      grid.appendChild(pipDiv);
      // --- CHARACTER UNLOCKS — Zoe is candy-bought, Grimm is story-earned (never sold) ---
      for(const key in COSTUMES){
        const c = COSTUMES[key];
        if(!c.character) continue;
        const owned = G.save.owned.includes(key);
        const equipped = G.save.equipped===key;
        const buyable = c.price > 0;
        const div = document.createElement('div');
        div.className='item';
        const pv = this.costumePreview(key);
        const dark = !owned && !buyable;   // story characters hide until earned; buyable ones show off
        const swInner = pv ? `<img src="${pv}" style="height:100%;width:auto;display:block;margin:0 auto;filter:${dark?'brightness(0.12) drop-shadow(0 0 8px rgba(120,80,200,.6))':'drop-shadow(0 3px 5px rgba(0,0,0,.45))'}" alt="">` : '';
        div.innerHTML = `<div class="sw" style="height:110px;background:radial-gradient(ellipse at 50% 82%, rgba(255,150,60,.18), transparent 60%), linear-gradient(135deg,#2c2450 60%,#4a3a6e)">${swInner}</div>
          <h4>${dark?'? ? ?':c.name}</h4><p>${dark?'Someone is still waiting for an invitation. Finish the story to meet him.':c.desc}</p>
          <button class="btn buy ui-block ${equipped?'ghost2':(owned||buyable?'orange':'ghost2')}">${equipped?'✓ Playing':(owned?'Play as '+(c.pron||'them'):(buyable?'🍬 '+c.price:'🕯️ Save the night to unlock'))}</button>`;
        this.bindTap(div.querySelector('button'), ()=>{
          if(equipped) return;
          if(!owned && !buyable){ AUDIO.ui(); this.toast('🕯️ Grimm joins you when the story is done. Save the night!'); return; }
          if(!owned){
            if(G.save.candy < c.price){ AUDIO.hurt(); this.toast('Not enough candy! Bonk more Boos 🍬'); return; }
            G.save.candy -= c.price; G.save.owned.push(key);
            this.toast('🧙 '+c.name+' JOINS THE NIGHT!');
          }
          if(!isChar(G.save.equipped||'kid')) G.save.prevCostume = G.save.equipped||'kid';   // remember Pip's look for the way back
          G.save.equipped = key; G.player && G.player.buildRig(key);
          G.persist(); AUDIO.buy(); this.renderShop('chars'); this.updateHUD();
        });
        grid.appendChild(div);
      }
    } else {
      // 25 tiers — one per level completed. [free, premium, marquee?]
      setTimeout(()=>{
        const b=document.getElementById('buyPassBtn');
        if(b){
          this.bindTap(b, ()=>{ G.buyPassTest(); this.renderShop('pass'); });
        }
      },0);
      const T = [
        ['🍬 50','🍬 500 + 🔥 EMBERLING: a pet wisp that orbits you', 1],
        ['🍬 50','🎨 Ember-orange bag skin'],
        ['🍭 Candy-swirl trail (3 uses)','🍬 300'],
        ['🍬 75','💫 Sparkle jump-puffs'],
        ['🍬 75','👻 EMBER SPIRIT costume: glows + fire run-trail', 1],
        ['🍬 100','🍬 400'],
        ['🎨 Rusty bag skin','🦴 Bone-rattle footsteps'],
        ['🍬 100','🎩 Tiny top hat (any costume)'],
        ['🍬 100','🍬 500'],
        ['🧵 Patchwork Pip costume','☄️ CANDY COMET jump-trail', 1],
        ['🍬 150','🎨 Witchwood-green bag skin'],
        ['🍬 150','🍬 600'],
        ['✨ Purple jump-puffs','🕸️ Cobweb cape'],
        ['🍬 150','🍬 600'],
        ['🍬 200','🧙 ZOE THE WITCHLING: playable character', 1],
        ['🍬 200','🎨 Harbor-teal bag skin'],
        ['🍬 200','🍬 800'],
        ['🌙 Moon-white bag skin','⚓ Ghost-anchor backbling'],
        ['🍬 250','🍬 800'],
        ['🍬 250','🧹 MOLTEN GOURD broom skin (for District 3\'s broom)', 1],
        ['🍬 300','🍬 1000'],
        ['🎨 Midnight bag skin','🌫️ Fog-walker aura'],
        ['🍬 300','🍬 1000'],
        ['🍬 350','👑 Ember crown (any costume)'],
        ['🎉 500 + fireworks','😈 GRIMM\'S HERALD: animated shadow costume + title + 🍬 1500', 1],
      ];
      const totPrem = 8000;
      body.innerHTML = `
        <div class="passhead">
          <h3>🌕 SEASON 1: THE EMBER MOON</h3>
          ${G.save.pass
            ? '<p style="font-weight:900;font-size:15px;margin-top:8px">✅ PASS ACTIVE: Nightstitch unlocked instantly. Climb those tiers!</p>'
            : '<button id="buyPassBtn" class="btn orange ui-block" style="margin-top:10px;font-size:16px">🌙 GET THE PASS · $4.99 · NIGHTSTITCH outfit INSTANTLY (test: free)</button>'}
          <p>25 tiers: climb one for every level you complete. Free track for everyone. Spook Pass unlocks the right column. <b>${totPrem.toLocaleString()}+ candy</b> in the premium track alone, enough for every Heart Container and half the store.</p>
          <p style="margin-top:6px;font-weight:800">Arrives with the App Store release · nothing here is pay-to-win, it's pay-to-SPARKLE ✨</p>
        </div>
        <div style="display:grid;grid-template-columns:40px 1fr 1.2fr;gap:7px;margin-bottom:6px;text-align:left">
          <div class="tn">⚡</div>
          <div class="tcell">–</div>
          <div class="tcell marquee">🌙 NIGHTSTITCH outfit: yours the INSTANT you buy</div>
        </div>
        <div class="trackhead"><span></span><span>FREE</span><span>🎃 SPOOK PASS</span></div>
        ${T.map((t,i)=>`<div class="tierrow">
          <div class="tn">${i+1}</div>
          <div class="tcell">${t[0]}</div>
          <div class="tcell ${t[2]?'marquee':'prem'}">${t[1]}</div>
        </div>`).join('')}`;
    }
  },
  // ---------- district map (level select) ----------
  showMap(district){
    const G=this.G;
    this._mapDistrict = district||'w1';
    // night sky: stars + drifting clouds + moon — built once, cheap CSS anims
    if(!this._skyBuilt){
      this._skyBuilt = true;
      let h = '<div id="mapMoon"></div>';
      for(let i=0;i<40;i++){
        const s=(1.4+Math.random()*1.8).toFixed(1);
        h += `<div class="mstar" style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*90).toFixed(1)}%;width:${s}px;height:${s}px;animation-delay:${(Math.random()*3).toFixed(2)}s;animation-duration:${(2.2+Math.random()*2.4).toFixed(2)}s"></div>`;
      }
      for(let i=0;i<3;i++)
        h += `<div class="mcloud" style="top:${9+i*14}%;width:${190+i*80}px;animation-duration:${55+i*28}s;animation-delay:-${13+i*21}s"></div>`;
      this.el('mapSky').innerHTML = h + '<div id="mapVig"></div>';
    }
    const world = (typeof WORLDS!=='undefined' && WORLDS.find(w=>w.key===this._mapDistrict)) || {name:'Pumpkin Patch', guardian:'The Guardian'};
    const dNum = parseInt(this._mapDistrict.slice(1),10)||1;
    const beaten = !!(G.save.worlds && G.save.worlds[this._mapDistrict]);
    this.el('mapTitle').textContent = world.name.toUpperCase()+' · District '+dNum;
    this.el('mapEmber').textContent = beaten ? '🔥 Ember recovered! The district burns warm again!' : '🌑 Ember stolen. '+world.guardian+' still holds it';
    this.el('mapCozy').style.display = G.save.cozy ? 'block' : 'none';
    this.el('mapHint').style.display = INPUT.isTouch ? 'none' : 'block';
    this.renderMap(world, dNum, beaten);
    this.setPrompt(null);
    // 3D map scene behind (the beautiful map): hide the CSS sky, let the render through
    const has3D = !!this.G.mapView;
    this.el('mapSky').style.display = has3D ? 'none' : 'block';
    this.el('map-screen').style.background = has3D ? 'transparent' : '';
    this.el('map-screen').style.display='flex';
    this.el('hud').style.display='none';
    this.el('pauseBtn').style.display='none';
    if(INPUT.isTouch) this.el('touchBtns').style.display='none';
    // keyboard nav — attached ONLY while the map is open; removed in hideMap (capture so INPUT never sees these keys)
    this._mapKey = e=>{
      const nodes=this._mapNodes||[];
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
        e.preventDefault(); e.stopPropagation();
        const dir=e.key==='ArrowLeft'?-1:1;
        let i=this._mapSel+dir;
        while(i>=0 && i<nodes.length && nodes[i].st==='lock') i+=dir;
        if(i>=0 && i<nodes.length && i!==this._mapSel){ this._mapSetSel(i); AUDIO.ui(); }
      } else if(e.key==='Enter'||e.key===' '){
        e.preventDefault(); e.stopPropagation();
        this._mapActivate(this._mapSel);
      } else if(e.key==='Escape'){
        e.preventDefault(); e.stopPropagation();
        AUDIO.ui(); this.hideMap(); this.G.closeMap();
      }
    };
    window.addEventListener('keydown', this._mapKey, true);
    AUDIO.ui();
  },
  hideMap(){
    if(this._mapKey){ window.removeEventListener('keydown', this._mapKey, true); this._mapKey=null; }
    this.el('map-screen').style.display='none';
    this.el('hud').style.display='flex';
    this.el('pauseBtn').style.display='block';
    if(INPUT.isTouch) this.el('touchBtns').style.display='flex';
  },
  renderMap(world, dNum, beaten){
    const G=this.G, district=this._mapDistrict;
    let levels = [];
    if(typeof LEVEL_LISTS!=='undefined') for(const list of LEVEL_LISTS) for(const l of list) if(l.district===district) levels.push(l);
    if(!levels.length) levels = [1,2,3,4,5].map(n=>({id:district+'l'+n, name:'LEVEL '+dNum+'-'+n, parTime:0}));
    const sv = G.save.levels || {};
    const fmt = s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
    // node models: done / avail (first not-done) / lock
    const nodes=[]; let availSeen=false;
    levels.forEach(lv=>{
      const rec = sv[lv.id]||{};
      const st = rec.done ? 'done' : (!availSeen ? (availSeen=true,'avail') : 'lock');
      nodes.push({id:lv.id, name:lv.name, par:lv.parTime, best:rec.best, stars:rec.stars||{}, st});
    });
    const bossReady = !!(sv[levels[levels.length-1].id]||{}).done;
    nodes.push({boss:true, name:(world.guardian||'The Guardian').toUpperCase(), st: beaten?'done':(bossReady?'avail':'lock')});
    this._mapNodes = nodes;
    // winding dotted path through the lantern positions (percent coords)
    const POS=[[12,80],[32,60],[20,34],[46,19],[64,48],[84,22]];
    const P = nodes.map((n,i)=>{ const p=POS[Math.min(i,POS.length-1)]; return [p[0]*10, p[1]*5.6]; });
    let d='M '+P[0][0]+' '+P[0][1];
    for(let i=1;i<P.length;i++){
      const a=P[i-1], b=P[i], mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
      const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1, bow=30*(i%2?1:-1);
      d += ' Q '+(mx-dy/L*bow).toFixed(1)+' '+(my+dx/L*bow).toFixed(1)+' '+b[0]+' '+b[1];
    }
    let html = this.G.mapView ? '' : `<svg id="mapSvg" viewBox="0 0 1000 560" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="rgba(255,205,130,.45)" stroke-width="5" stroke-dasharray="0.1 16" stroke-linecap="round"/></svg>`;
    nodes.forEach((n,i)=>{
      const p=POS[Math.min(i,POS.length-1)];
      const lamp = n.boss ? '<span class="mcrown">👑</span>🎃' : '🏮';
      const starIcon = {time:'⏱', candy:'🍬', clean:'💜'};   // a missed star shows WHAT to hunt, not just that something's missing
      const stars = (!n.boss && n.st==='done')
        ? ['time','candy','clean'].map(k=>n.stars[k]?'<span>⭐</span>':`<span class="off">${starIcon[k]}</span>`).join('')
        : '&nbsp;';
      const label = n.boss ? n.name : dNum+'-'+(i+1)+' · '+n.name;
      let sub;
      if(n.boss) sub = n.st==='done' ? '🔥 relit · fight again?' : (n.st==='avail' ? 'the guardian stirs…' : '🔒 clear '+dNum+'-'+levels.length);
      else {
        const bits=[];
        if(n.par) bits.push('par '+fmt(n.par));
        if(n.best!=null) bits.push('best '+fmt(n.best));
        sub = bits.length ? '⏱ '+bits.join(' · ') : (n.st==='lock' ? '🔒' : '&nbsp;');
      }
      html += `<div class="mnode ui-block ${n.st}${n.boss?' mboss':''}" data-i="${i}" style="left:${p[0]}%;top:${p[1]}%">
        <div class="mring"></div>
        <div class="mlamp">${lamp}</div>
        <div class="mstars">${stars}</div>
        <div class="mname">${label}</div>
        <div class="mtime">${sub}</div>
      </div>`;
    });
    const wrap=this.el('mapWrap');
    wrap.innerHTML = html;
    wrap.querySelectorAll('.mnode').forEach(nd=>{
      this.bindTap(nd, ()=>this._mapActivate(+nd.dataset.i));   // tap-detect: a drag-brush across a lantern no longer launches a level
    });
    // default selection: the pulsing node, else the furthest unlocked one
    let sel = nodes.findIndex(n=>n.st==='avail');
    if(sel<0){ sel = nodes.length-1; while(sel>0 && nodes[sel].st==='lock') sel--; }
    this._mapSetSel(sel);
  },
  _mapSetSel(i){
    this._mapSel = i;
    this.el('mapWrap').querySelectorAll('.mnode').forEach(nd=>nd.classList.toggle('sel', +nd.dataset.i===i));
  },
  _mapActivate(i){
    const n=(this._mapNodes||[])[i]; if(!n) return;
    if(n.st==='lock'){ this.toast(n.boss ? '🔒 Light every lantern on the path first!' : '🔒 Beat the lantern before this one first!'); return; }
    this._mapSetSel(i);
    AUDIO.ui();
    this.hideMap();
    if(n.boss) this.G.startBoss(this._mapDistrict); else this.G.enterLevel(n.id);
  },
  positionMapNodes(mv){
    // project the 3D lantern anchors onto the screen and pin the DOM nodes to them
    const wrap = this.el('mapWrap'); if(!wrap || !mv || !mv.anchors) return;
    const rect = wrap.getBoundingClientRect();
    if(!this._projV) this._projV = new THREE.Vector3();
    wrap.querySelectorAll('.mnode').forEach(nd=>{
      const i = +nd.dataset.i;
      const id = (typeof W1_LEVELS!=='undefined' && i<W1_LEVELS.length) ? W1_LEVELS[i].id : 'boss';
      const a = mv.anchors.find(x=>x.id===id); if(!a) return;
      this._projV.copy(a.pos).project(mv.camera);
      nd.style.left = (((this._projV.x*0.5+0.5)*innerWidth - rect.left))+'px';
      nd.style.top  = (((-this._projV.y*0.5+0.5)*innerHeight - rect.top))+'px';
    });
  },
  mapNav(){
    // gamepad drives the map — called each frame from the loop while state==='map'
    // (keyboard arrows/Enter/Space are captured by _mapKey and never reach INPUT, so no double-fire)
    if(!this._mapNodes || this.el('map-screen').style.display==='none') return;
    const ax = INPUT.moveX||0;
    const t = performance.now();
    if(Math.abs(ax)>0.5){
      if(!this._mapNavT || t-this._mapNavT>260){
        this._mapNavT = t;
        const dir = ax>0?1:-1, nodes=this._mapNodes;
        let i=this._mapSel+dir;
        while(i>=0 && i<nodes.length && nodes[i].st==='lock') i+=dir;
        if(i>=0 && i<nodes.length && i!==this._mapSel){ this._mapSetSel(i); AUDIO.ui(); }
      }
    } else this._mapNavT = 0;
    if(INPUT.jumpEdge || INPUT.interactEdge) this._mapActivate(this._mapSel);
    else if(INPUT.pauseEdge){ AUDIO.ui(); this.hideMap(); this.G.closeMap(); }
  },
  // ---------- level clear ----------
  levelClear(stats){
    this._clearStats = stats;
    const fmt = v => typeof v==='number' ? (Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0')) : v;
    this.el('clearName').textContent = stats.levelName || '';
    const st = stats.stars||{};
    // missed stars must READ as missed — ✖ icon + dimmed card + "missed:" prefix (a dim ⭐ still read as earned).
    // In Cozy they're not "missed", they're ASLEEP (💤) — cozy pauses earning, and the card says so loudly.
    const slot = (on,lbl)=>{ const won = on && !stats.cozy;
      if(stats.cozy) return `<div class="cstar off" style="opacity:.6"><div class="big">💤</div><div class="lbl">${lbl}</div></div>`;
      return `<div class="cstar${won?'':' off'}"${won?'':' style="opacity:.5"'}><div class="big">${won?'⭐':'✖️'}</div><div class="lbl">${won?lbl:'missed: '+lbl}</div></div>`; };
    this.el('clearStars').innerHTML =
      slot(st.time, '⏱ fast') +
      slot(st.candy, '🍬 '+(stats.candy??0)+'/'+(stats.candyTotal??0)) +
      slot(st.clean, '💜 no damage');
    const rec = stats.cozy ? `<div style="margin-top:8px;padding:7px 12px;background:rgba(255,180,90,.14);border:1px solid rgba(255,180,90,.35);border-radius:12px;font-weight:800">🧸 Cozy Mode is ON: stars &amp; best times are asleep.<br><span style="font-weight:600;opacity:.85">Turn Cozy off in the ⚙️ pause menu to earn them!</span></div>`
      : stats.isRecord ? `<div style="margin-top:8px;font-weight:900;color:#ffd23f;font-size:18px">🏆 NEW RECORD: ${fmt(stats.time)}!</div>`
      : (stats.best!=null ? `<div style="margin-top:6px;opacity:.85">🏆 Your best: <b>${fmt(stats.best)}</b></div>` : '');
    this.el('clearStats').innerHTML = `⏱️ Time: <b>${fmt(stats.time)}</b>${rec}`;
    this.el('clearNext').style.display = stats.nextId ? 'block' : 'none';
    this.setPrompt(null);
    this.el('clear-screen').style.display='flex';
  },
  // ---------- death & victory ----------
  deathScreen(){
    this.el('death-screen').style.display='flex';
    this.el('reviveBtn').style.display = this.G.save.candy>=200 ? 'block' : 'none';
    const p = this.el('death-screen').querySelector('p');
    p.innerHTML = 'Don\'t worry. Grimmwick believes in you.<br><b style="font-size:18px">👻 Lives left: '+this.G.save.lives+'</b>';
  },
  gameOverScreen(){
    this.el('gameover-screen').style.display='flex';
    this.el('continueBtn').style.display = this.G.save.candy>=500 ? 'block' : 'none';
    AUDIO.gameover();
  },
  victoryScreen(stats){
    const rec = stats.cozy ? `<div style="margin-top:6px;opacity:.85">🧸 Cozy run, records take a nap</div>` : stats.isRecord
      ? `<div style="margin-top:8px;font-weight:900;color:#ffd23f;font-size:18px">🏆 NEW RECORD: ${stats.time}!</div>`
      : `<div style="margin-top:6px;opacity:.85">🏆 Your best: <b>${stats.best}</b></div>`;
    // per-guardian copy — the finale gets its own ending card, not a "guardian freed" one
    const COPY = {
      w1:{e:'🎃', t:'GUARDIAN FREED!', b:'The Pumpkin King is himself again, and the first ember is yours! The Harvest District glows warm tonight.'},
      w2:{e:'🪦', t:'GUARDIAN FREED!', b:'Mossgrave settles back into his hill with a happy rumble. The second ember is yours! Ravenmoor\'s lanterns glow green tonight.'},
      w3:{e:'🧹', t:'GUARDIAN FREED!', b:'Broomhilda cackles a THANK-you and loops the moon. The third ember is yours! Witchwood\'s cauldrons bubble bright tonight.'},
      w4:{e:'⚓', t:'GUARDIAN FREED!', b:'Captain Wraith tips his hat as THE SEA RUSHES BACK. The fourth ember is yours! Ghost Harbor floats again tonight.'},
      w5:{e:'🎆', t:'THE NIGHT IS RELIT!', b:'Grimm said yes.<br>The Everflame burns whole again. Every district is safe and bright. Grimm, the spirit no one ever invited, is now the town\'s night-watchman, keeping every lantern lit.<br><b>You saved Grimmwick, Pip. Happy Halloween. 🏮</b><br><span style="opacity:.8;font-size:13px">He\'s waiting by the Everflame in town. Go say hello.</span>'},
    };
    const c = COPY[stats.district] || COPY.w1;
    this.el('vEmoji').textContent = c.e;
    const vt = this.el('vTitle'); vt.textContent = c.t;
    if(stats.district==='w5'){ vt.style.color='#ffd23f'; vt.style.fontSize='26px'; vt.style.textShadow='0 0 16px rgba(255,180,60,.7)'; }
    else { vt.style.color='#ffb35e'; vt.style.fontSize=''; vt.style.textShadow=''; }
    this.el('vBody').innerHTML = c.b + (stats.district==='w5' ? '' : '<br><b>👻 A blessing from the guardian: lives refilled!</b>');
    if(stats.district==='w5'){
      // THE END card — the whole night in a clean keepsake grid, and the door to what's next
      const sv = G.save;
      const pt = stats.playT||0, fmtT = t => (t>=3600 ? Math.floor(t/3600)+'h ' : '') + Math.floor((t%3600)/60)+'m '+(Math.floor(t)%60)+'s';
      const starsEarned = Object.values(sv.levels||{}).reduce((s,l)=>s+(l.stars?(l.stars.time?1:0)+(l.stars.candy?1:0)+(l.stars.clean?1:0):0),0);
      const gpFound = Object.values(sv.gp||{}).reduce((s,a)=>s+(a||[]).filter(Boolean).length,0);
      const box = (e,v,l)=>`<div style="flex:1 1 96px;max-width:130px;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.16);border-radius:14px;padding:8px 4px"><div style="font-size:20px">${e}</div><div style="font-weight:900;font-size:15.5px">${v}</div><div style="font-size:10.5px;opacity:.75;margin-top:1px">${l}</div></div>`;
      const dmgBox = sv.dmgUntracked ? '' : box('💜', (sv.nightDmg??0), 'hearts lost');
      this.el('vstats').innerHTML =
        `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:6px 0 10px">
          ${box('⏱️', fmtT(pt), 'the whole night')}${box('🍬', (stats.lifeCandy||0).toLocaleString(), 'candy collected')}${dmgBox}${box('⭐', starsEarned+'/75', 'stars earned')}${box('🎃', gpFound+'/15', 'golden pumpkins')}
        </div>
        <div style="opacity:.85;font-size:13.5px;line-height:1.5">The night isn't over. Every district still glows.<br>Hunt the stars, find the Old Shortcuts... and race the night itself. 🏮</div>
        <button id="vNight" class="btn ghost2 ui-block" style="margin-top:10px">🏮 See the Night Board</button>${rec}`;
      const vb = document.getElementById('vNight');
      if(vb) this.bindTap(vb, ()=>window.NightBoard && NightBoard.open());
    } else {
      this.el('vstats').innerHTML = `🍬 Candy collected: <b>${stats.candy}</b> &nbsp;·&nbsp; 🎃 Golden Pumpkins: <b>${stats.gp}/3</b><br>⏱️ Time: <b>${stats.time}</b>${rec}`;
    }
    this.el('vHome').textContent = stats.district==='w5' ? '🎉 Join the festival in town!' : '🏘️ Return to Grimmwick';
    this.el('victory-screen').style.display='flex';
  },
  // big cinematic center-screen text for the finale beats — unmissable, unlike a toast
  finaleBanner(text, holdMs=2600){
    const b = this.el('finaleBanner');
    clearTimeout(this._fbT1); clearTimeout(this._fbT2);
    b.textContent = text;
    b.style.display='block';
    requestAnimationFrame(()=>{ b.style.opacity=1; });
    this._fbT1 = setTimeout(()=>{ b.style.opacity=0; }, holdMs);
    this._fbT2 = setTimeout(()=>{ b.style.display='none'; }, holdMs+500);
  },
  fade(toBlack, dur=500){
    const f=this.el('fade');
    f.style.transition=`opacity ${dur}ms`;
    f.style.opacity = toBlack?1:0;
  },
};
window.UI = UI;

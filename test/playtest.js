// Headless playtest: boot, hub, map flow, all five W1 levels, level-clear, boss.
const { chromium } = require('playwright');
const path = require('path');

(async ()=>{
  // cloud sandbox has a preinstalled chromium; on a normal machine Playwright resolves its own
  const exe = require('fs').existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch({
    executablePath: exe,
    args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--disable-gpu-sandbox'],
  });
  const page = await browser.newPage({viewport:{width:1280,height:720}});
  const consoleErrs = [];
  page.on('console', m=>{ if(m.type()==='error') consoleErrs.push(m.text().slice(0,300)); });
  page.on('pageerror', e=>consoleErrs.push('PAGEERROR: '+String(e).slice(0,300)));
  let failed = false;
  const check = (name, ok)=>{ console.log((ok?'OK  ':'FAIL')+' '+name); if(!ok) failed = true; };

  const url = 'file://'+path.join(__dirname,'..','dist','grimmwick.html')+'?test=1';
  await page.goto(url);
  await page.waitForTimeout(3000);

  const shot = (n)=>page.screenshot({path:path.join(__dirname, n)});
  const state = ()=>page.evaluate(()=>window.__game ? window.__game.state() : null);
  const errs = ()=>page.evaluate(()=>window.__game ? window.__game.errors : ['no __game']);
  // wait for GAME-seconds (headless RAF throttling makes wall-clock unreliable)
  const gameWait = (secs)=>page.evaluate(async (s)=>{
    const t0 = window.G.time;
    await new Promise(res=>{ const iv=setInterval(()=>{ if(window.G.time-t0>s){clearInterval(iv);res();} },50); });
  }, secs);

  let s = await state();
  console.log('BOOT:', JSON.stringify(s));
  check('boots into hub play', s && s.state==='play' && s.area==='hub');
  await shot('shot_hub.png');

  // hub walk (free mode)
  await page.keyboard.down('s');
  const walk = await page.evaluate(async ()=>{
    const G = window.G;
    const t0 = G.time, x0 = G.player.pos.x, z0 = G.player.pos.z;
    await new Promise(res=>{ const iv=setInterval(()=>{ if(G.time-t0>1.5){clearInterval(iv);res();} },50); });
    const d = Math.hypot(G.player.pos.x-x0, G.player.pos.z-z0);
    return +(d/(G.time-t0)).toFixed(2);
  });
  await page.keyboard.up('s');
  check('hub walk speed '+walk, walk>4);

  // map flow
  await page.evaluate(()=>window.G.openMap('w1'));
  await page.waitForTimeout(400);
  s = await state();
  check('map opens (state=map)', s && s.state==='map');
  await shot('shot_map.png');
  await page.evaluate(()=>window.G.closeMap());
  await page.waitForTimeout(200);
  s = await state();
  check('map closes back to play', s && s.state==='play');

  // each level: enter, verify side-scroll movement with a real held key, screenshot
  const levels = ['w1l1','w1l2','w1l3','w1l4','w1l5','w2l1','w2l2','w2l3','w2l4','w2l5'];
  for(const id of levels){
    await page.evaluate((i)=>window.__game.scene(i), id);
    await page.waitForTimeout(1400);
    s = await state();
    check(id+' loads', s && s.state==='play' && s.area===id);
    // run right like a player: held direction + a hop every half game-second.
    // assert MAX x reached — a fall + checkpoint respawn (by design) may reset the final position
    let maxX = 0;
    await page.keyboard.down('d');
    for(let i=0;i<8;i++){
      await gameWait(0.5);
      await page.keyboard.press('Space');
      s = await state();
      if(s && s.pos) maxX = Math.max(maxX, s.pos[0]);
    }
    await page.keyboard.up('d');
    await page.waitForTimeout(300);
    check(id+' side movement maxX='+maxX.toFixed(1), maxX>3);
    await shot('shot_'+id+'.png');
  }

  // level-clear flow: walk into w1l1's exit gate for real
  await page.evaluate(()=>window.__game.scene('w1l1'));
  await page.waitForTimeout(1400);
  const gateX = await page.evaluate(()=>{
    const trigs = window.G.world.cols.filter(c=>c.type==='trigger');
    return Math.max(...trigs.map(c=>c.min.x));
  });
  console.log('w1l1 exit trigger min.x =', gateX);
  await page.evaluate((x)=>window.__game.warp(x-3, 1, 0), gateX);
  await page.keyboard.down('d');
  await gameWait(1.5);
  await page.keyboard.up('d');
  await page.waitForTimeout(900);
  const clear = await page.evaluate(()=>({
    state: window.G.state,
    saved: window.G.save.levels && window.G.save.levels.w1l1,
  }));
  check('exit gate → levelclear state', clear.state==='levelclear');
  check('w1l1 saved done', !!(clear.saved && clear.saved.done));
  check('w1l1 stars object saved', !!(clear.saved && clear.saved.stars));
  await shot('shot_levelclear.png');

  // NEXT LEVEL from the clear screen
  await page.evaluate(()=>window.G.enterLevel('w1l2'));
  await page.waitForTimeout(1400);
  s = await state();
  check('next-level into w1l2', s && s.state==='play' && s.area==='w1l2');

  // bosses — Pumpkin King (w1) and Mossgrave (w2)
  for(const [dist, area] of [['w1','boss1'],['w2','boss2']]){
    await page.evaluate((d)=>window.G.startBoss(d), dist);
    await page.waitForTimeout(1800);
    s = await state();
    check(area+' loads with boss', s && s.area===area && !!s.boss);
    await page.keyboard.down('a');
    await gameWait(1.5);
    await page.keyboard.up('a');
    await page.keyboard.press('Space');
    await page.waitForTimeout(1200);
    await shot('shot_'+area+'.png');
  }

  const gameErrs = await errs();
  check('zero game errors', gameErrs.length===0);
  check('zero console errors', consoleErrs.length===0);
  if(gameErrs.length) console.log('game errors:', JSON.stringify(gameErrs.slice(0,5)));
  if(consoleErrs.length) console.log('console errors:', JSON.stringify(consoleErrs.slice(0,5)));

  await browser.close();
  if(failed){ console.error('PLAYTEST FAILED'); process.exit(1); }
  console.log('PLAYTEST PASSED');
})().catch(e=>{ console.error('TEST CRASH', e); process.exit(1); });

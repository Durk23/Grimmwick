// Headless playtest: load game, verify no errors, simulate input, screenshot.
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

  const url = 'file://'+path.join(__dirname,'..','dist','grimmwick.html')+'?test=1';
  await page.goto(url);
  await page.waitForTimeout(3500);

  const shot = (n)=>page.screenshot({path:path.join(__dirname, n)});
  const state = ()=>page.evaluate(()=>window.__game ? window.__game.state() : null);
  const errs = ()=>page.evaluate(()=>window.__game ? window.__game.errors : ['no __game']);

  let s = await state();
  console.log('BOOT state:', JSON.stringify(s));
  console.log('game errors:', JSON.stringify(await errs()));
  console.log('console errors:', JSON.stringify(consoleErrs));
  await shot('shot_hub.png');

  // walk for 1.5 GAME-seconds (headless RAF throttling makes wall-clock unreliable)
  await page.keyboard.down('s');
  const walk = await page.evaluate(async ()=>{
    const G = window.G;
    const t0 = G.time, x0 = G.player.pos.x, z0 = G.player.pos.z;
    await new Promise(res=>{ const iv=setInterval(()=>{ if(G.time-t0>1.5){clearInterval(iv);res();} },50); });
    const d = Math.hypot(G.player.pos.x-x0, G.player.pos.z-z0);
    return {gameDt:+(G.time-t0).toFixed(2), dist:+d.toFixed(2), speed:+(d/(G.time-t0)).toFixed(2)};
  });
  await page.keyboard.up('s');
  console.log('WALK (game-time):', JSON.stringify(walk), walk.speed>4 ? 'OK' : 'FAIL');
  s = await state();
  // jump
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  s = await state();
  console.log('mid-jump y:', s && s.pos && s.pos[1]);
  await page.waitForTimeout(800);

  // walk near mayor & everflame for a nicer screenshot
  await page.evaluate(()=>window.__game.warp(3,1,8));
  await page.waitForTimeout(600);
  await shot('shot_hub2.png');

  // level 1
  await page.evaluate(()=>window.__game.scene('level1'));
  await page.waitForTimeout(1800);
  s = await state();
  console.log('LEVEL1 state:', JSON.stringify(s));
  await shot('shot_level_start.png');
  // run forward into the level
  await page.keyboard.down('w');
  await page.waitForTimeout(2500);
  await page.keyboard.up('w');
  await page.waitForTimeout(400);
  s = await state();
  console.log('level after run:', JSON.stringify(s));
  await shot('shot_level_run.png');
  // warp to pumpkin field & barn for screenshots
  await page.evaluate(()=>window.__game.warp(0,1,-60));
  await page.waitForTimeout(700);
  await shot('shot_pumpkin_field.png');
  await page.evaluate(()=>window.__game.warp(0,1,-88));
  await page.waitForTimeout(700);
  await shot('shot_barn.png');
  await page.evaluate(()=>window.__game.warp(0,1,-125));
  await page.waitForTimeout(700);
  await shot('shot_garden.png');
  console.log('after warps:', JSON.stringify(await state()));

  // boss
  await page.evaluate(()=>window.__game.scene('boss1'));
  await page.waitForTimeout(2500);
  s = await state();
  console.log('BOSS state:', JSON.stringify(s));
  await shot('shot_boss.png');
  // survive a few seconds of the fight
  await page.keyboard.down('a');
  await page.waitForTimeout(1500);
  await page.keyboard.up('a');
  await page.keyboard.press('Space');
  await page.waitForTimeout(2500);
  s = await state();
  console.log('boss after 4s:', JSON.stringify(s));
  await shot('shot_boss_fight.png');

  console.log('FINAL game errors:', JSON.stringify(await errs()));
  console.log('FINAL console errors:', JSON.stringify(consoleErrs.slice(0,10)));
  await browser.close();
})().catch(e=>{ console.error('TEST CRASH', e); process.exit(1); });

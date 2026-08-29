// ============ TUTORIAL — Gran's Backyard Course ============
function buildTutorial(G){
  const S = G.scene;
  G.signs = [];
  G.coffins = [];
  // cozy backyard: ground, fences, Gran's house silhouette
  groundX(G, -8, 88, 0x3f5544);
  const deco = new THREE.Group();
  fenceRun(deco, -8, -3.2, 88, -3.2, 30);
  fenceRun(deco, -8, 3.2, 88, 3.2, 30);
  // Gran's cottage in the background
  const cot = new THREE.Group();
  const cw = mesh('box',[6,4,3], mat(0x5c4380)); cw.position.set(-2,2,-6);
  const cr = mesh('cone',[4.6,2.6,4], mat(0x6a3c8f)); cr.position.set(-2,5.3,-6); cr.rotation.y=Math.PI/4;
  const cwin = mesh('box',[1,1.1,0.1], emat(PAL.window,PAL.window,1)); cwin.position.set(-2,2.2,-4.4);
  cot.add(cw,cr,cwin);
  deco.add(cot);
  for(let i=0;i<8;i++) deco.add(pumpkinDeco(rand(-4,84), rand(-2.6,-1.8), rand(0.5,0.9), Math.random()<0.5));
  for(let i=0;i<5;i++) deco.add(deadTree(rand(0,84), rand(-8,-4.5), rand(0.8,1.2)));
  S.add(bakeGroup(deco));

  // 1) run
  signPost(G, 3, 1.8, -0.2, INPUT.isTouch ?
    'Push the stick and RUN, little boo! - Gran \u2665' :
    'Hold D (or \u2192) and RUN, little boo! - Gran \u2665');
  candyLine(G, [[6,0.8,0],[14,0.8,0]], 5);

  // 2) jump + double jump (hay steps, no pits — nothing here can hurt you)
  signPost(G, 19, 1.8, 0.2, INPUT.isTouch ?
    'Tap JUMP... then tap it AGAIN in the air. My double-boo bounce! - Gran \u2665' :
    'SPACE to JUMP... and press it AGAIN in the air. My double-boo bounce! - Gran \u2665');
  hayBale(G, 24, 0, 0, 2.2, 1.2, 1.6);
  hayBale(G, 28, 0, 0, 2.2, 2.4, 1.6);
  candyLine(G, [[24,2,0],[28,3.6,0]], 4);

  // 3) climb the web-net
  signPost(G, 34, 1.8, -0.25, INPUT.isTouch ?
    'See the practice web? Push the stick UP to CLIMB it. The spiders lent it to me. - Gran \u2665' :
    'See the practice web? Hold UP (or W) to CLIMB it. The spiders lent it to me. - Gran \u2665');
  buildWebNet(G, 38, 0.4, 1.8, 3.6);
  platform(G, 41.5, 3.4, 0, 3, 3, 0x5a4066);
  candyLine(G, [[38,2,0],[41.5,4.6,0]], 4);

  // 4) spin attack targets
  signPost(G, 47, 1.8, 0.2, INPUT.isTouch ?
    'Tap SPIN to swing your candy bag at the practice lanterns! Or BONK them from above. - Gran \u2665' :
    'SPIN your candy bag (J) at the practice lanterns! Or BONK them from above. - Gran \u2665');
  G.ents.add(new BonkLantern(G, 51, 1.3, 0, 'candy'));
  G.ents.add(new BonkLantern(G, 54, 1.3, 0, 'candy'));

  // 5) ground pound mega-bounce
  // practice partners — Gran arranged volunteers (they drop candy, teaching pickups too)
  signPost(G, 51, 1.8, -0.15, 'That Boo volunteered for bonking practice. Such a nice boy. Give him a good WHACK. - Gran ♥');
  G.ents.add(new Boo(G, 54, 0, 0, {speed:1.5, range:5}));
  G.ents.add(new Hopper(G, 68, 0, 0, {aggroR:4}));
  signPost(G, 59, 1.8, -0.2, INPUT.isTouch ?
    'Jump, then press \ud83d\udca5 in the air: the GROUND POUND! Pound the big pumpkin for a MEGA bounce! - Gran \u2665' :
    'Jump, then press K in the air: the GROUND POUND! Pound the big pumpkin for a MEGA bounce! - Gran \u2665');
  bigPumpkin(G, 63.5, -0.5, 0, 1.8);
  // the mega-bounce target: wide, close to the pumpkin, and WELL under the ~7u bounce apex — a first-ever
  // pound-bounce should land it easily (owner playtest: 5.6 @ 5u of air-steer was too hard for a tutorial)
  platform(G, 66.5, 3.9, 0, 5, 3, 0x4a3a6e);   // under the plain-bounce apex (~4.5) with margin, above double-jump reach (3.3) — the pound-teach still matters, but a good bounce alone can make it
  candyLine(G, [[63.5,3.2,0],[64.8,5.2,0],[66.5,4.9,0]], 4);   // the candy arc TRACES the bounce path (telegraph rule)
  G.ents.add(new Heart(66.5, 4.9, 0));

  signPost(G, 71.5, 1.8, -0.2, INPUT.isTouch ?
    'One more trick! Stand still and HOLD \ud83d\udca5... squiiiish... now let go. SPROING! - Gran \u2665' :
    'One more trick! Stand still and HOLD K... squiiiish... now let go. SPROING! - Gran \u2665');
  // 6) checkpoint + go
  signPost(G, 74, 1.8, 0.2, 'Light every lantern you pass: they remember your place. Now off you go, my little hero. - Gran \u2665');
  G.ents.add(new Checkpoint(77, 0, 1.4, 0));
  // gate to town
  const gL = mesh('box',[0.8,5,0.8], mat(0x38294f)); gL.position.set(81,2.5,-1);
  const gR = gL.clone(); gR.position.x=84;
  const gT = mesh('box',[3.8,0.8,1], mat(0x38294f)); gT.position.set(82.5,5.2,-1);
  S.add(gL,gR,gT);
  const pm = new THREE.MeshBasicMaterial({color:0xffc95e, transparent:true, opacity:0.35, side:THREE.DoubleSide});
  const portal = new THREE.Mesh(geo('plane',2.8,4.2), pm);
  portal.position.set(82.5,2.4,-1);
  S.add(portal);
  G.tutPortal = portal;
  G.world.addBox(82.5,0,0, 1.4,4.5,4, {type:'trigger', onTouch:()=>{
    if(G.state==='play' && !G._tutDone){ G._tutDone=true; G.finishTutorial(); }
  }});
  G.world.addBox(88.5,0,0, 3,8,12,{});
  G.world.addBox(-10.5,0,0, 3,8,12,{});
  G.spawnPoint.set(0,0.6,0);
  G.checkpoint.copy(G.spawnPoint);
  G.world.killY = -14;
  G.bats = makeBats(S, 4, 24);
  G.amb = buildAmbience(S, -10, 90);
  buildClutter(G, -6, 84, 'farm');
  G.ents.add(new Crow(45, 0.9, -2.8));
  pitDressing(G, -9, -8, 'patch');   // the 1-unit slot behind spawn — even Gran's backyard shows its danger
}
function updateTutorial(G, dt){
  updateBats(G.bats, dt);
  updateAmbience(G.amb, G.time);
  if(G.tutPortal) G.tutPortal.material.opacity = 0.3+Math.sin(G.time*3)*0.1;
  const pl = G.player;
  if(!pl) return;
  pitImpactCheck(G, pl, dt);
  let prompt = null;
  for(const s of G.signs){
    if(Math.hypot(s.x-pl.pos.x, s.z-pl.pos.z)<2.6){ prompt={kind:'sign', label:'\ud83d\udc9c Read Gran\'s note', sign:s}; break; }
  }
  // Gran doesn't wait to be read \u2014 walk near a lesson and she calls it out (once per save per sign).
  // Kids sprint past signs; the lessons still land. The read-prompt stays for the full note.
  for(const s of G.signs){
    if(Math.abs(s.x-pl.pos.x) < 3.4){
      const key = 'tut'+Math.round(s.x);
      if(!G.save.hints) G.save.hints = {};
      if(!G.save.hints[key]){ G.save.hints[key] = 1; G.persist(); UI.toast(s.text, 5200); }
      break;
    }
  }
  UI.setPrompt(prompt);
  if(prompt && INPUT.interactEdge) UI.dialogue('\ud83e\uddf5', prompt.sign.text);
}

// ============ W1-5 — THE KING'S DOORSTEP (the only all-new level of the split) ============
// The last walk before the Pumpkin King — District 1's peak, still ~95% clearable but ALIVE.
// Signature gimmick: GOURD BOUNCE-CHAINS. Introduced (one safe bounce over a baby gap),
// twisted (bounces across the royal mud), escalated (a full chain over the King's moat
// with a Boo weaving between the arcs). Every threat fixed, visible, and telegraphed.
function buildW1L5(G){
  const S = G.scene;
  levelBegin(G);

  // ================= BEAT 1: The forbidden bounce (x -8..13) =================
  groundX(G, -8, 5, 0x3f5c4c);
  groundX(G, 9, 43, 0x49603f);
  signPost(G, 1.5, 1.8, -0.25, 'His Majesty is NOT receiving visitors. Absolutely NO bouncing on the royal gourds. — The Management');
  G.ents.add(new BonkLantern(G, 3, 1.3, 0, 'shield'));
  bigPumpkin(G, 7, -0.6, 0, 1.6);   // the baby gap below is double-jumpable — the gourd just makes it FUN
  candyLine(G, [[0.5,0.8,0],[3.2,0.8,0]], 4);
  candyLine(G, [[4.5,1.6,0],[7,3.6,0],[9.5,1.6,0]], 5);  // the arc teaches the bounce
  G.ents.add(new Boo(G, 11, 0, 0, {speed:2.0, range:9}));
  // the pre-boss treat: a coffin tucked on the foreground side
  const cof = new CursedCoffin(11.5, 0, 1.9, 0.35);
  G.ents.add(cof); G.coffins.push(cof);
  G.world.addBox(11.5, 0, 1.9, 1.4, 0.9, 2.4, {});
  G.ents.add(new Checkpoint(13, 0, 1.4, 0));
  G.ents.add(new Rat(G, 15, 0, 0));

  // ================= BEAT 2: The royal mud (x 16..28) — twist: bounce OVER a hazard =================
  mudPitX(G, 21, 10);
  bigPumpkin(G, 17.5, -0.5, 0, 1.7);
  bigPumpkin(G, 22.5, -0.5, 0, 1.9);
  candyLine(G, [[15.5,1.8,0],[17.5,3.9,0],[20,2.8,0]], 5);
  candyLine(G, [[20,2.8,0],[22.5,4.1,0],[25.6,1.6,0]], 5);
  G.ents.add(new Hopper(G, 27, 0, 0, {aggroR:8}));  // times its arcs against your bounces
  // HIGH SHELF: pound-mega-bounce a mud gourd (or double-jump off a bounce) — visible candy overhead
  platform(G, 20, 4.6, 0, 2.6, 3, 0x5a4066);
  platform(G, 24.5, 5.2, 0, 2.6, 3, 0x5a4066);
  candyLine(G, [[20,5.8,0],[24.5,6.4,0]], 4);
  G.ents.add(new Heart(24.5, 6.6, 0));

  // ================= BEAT 3: The briar row (x 28..42) — ground pressure between bounces =================
  G.ents.add(new Skelly(G, 30, 0, 0, {px:1.5}));
  bigPumpkin(G, 32.6, -0.5, 0, 1.6);   // escalate: one clean bounce sails the whole briar
  thornsX(G, 37, 6);
  platform(G, 37, 1.3, 0, 2.6, 3, 0x5a4066);  // the honest low hop for non-bouncers
  candyLine(G, [[32.6,3.6,0],[36.5,4.9,0],[40.3,2,0]], 5);
  G.ents.add(new Checkpoint(41.6, 0, 1.4, 1));   // clear of the briar hazard box (ends x40) — respawn must never overlap a hazard
  G.ents.add(new Spider(G, 42.3, 4.2, 0, {groundY:0}));  // hangs in plain sight over the fence line

  // ================= BEAT 4: The King's moat (x 43..53) — mastery: bounce-chain over the void =================
  bigPumpkin(G, 46, 0.3, 0, 1.6);
  bigPumpkin(G, 49.8, 1.0, 0, 1.4);
  const pillars = new THREE.Group();  // crooked stone columns hold the moat gourds — reads fair
  for(const [px,py] of [[46,-3.4],[49.8,-2.7]]){
    const col = mesh('box',[1.3,7,1.3], mat(0x4a4160)); col.position.set(px,py,0); crook(col,0.05); pillars.add(col);
  }
  S.add(bakeGroup(pillars));
  G.ents.add(new Boo(G, 47.8, 2.2, 0, {speed:2.4, range:9}));  // weaves between your arcs — stare to freeze
  candyLine(G, [[43.5,2.6,0],[46,4.4,0],[48.6,3.2,0]], 5);
  candyLine(G, [[48.6,3.2,0],[49.8,5.2,0],[52.6,2.2,0]], 4);

  // ================= BEAT 5: THE DOORSTEP (x 53..58) — the old Section-E grandeur =================
  groundX(G, 53, 58.5, 0x4c3f68);
  G.ents.add(new Hopper(G, 54.8, 0, 0, {aggroR:6}));  // the King's last guard
  candyLine(G, [[53.6,0.8,0],[55.4,0.8,0]], 3);
  signPost(G, 53.8, 1.8, 0.25, 'TURN BACK. The King is in a MOOD tonight. Management accepts no responsibility for squashings. — The Management');
  const court = new THREE.Group();
  fenceRun(court, 53, -3.4, 58.5, -3.4, 3);
  // the crowd: pumpkins gathered at the doorstep, faces turned to the gate
  for(let i=0;i<9;i++){
    const p = pumpkinDeco(rand(52.8,58), rand(-3,-1.7), rand(0.5,1.05), Math.random()<0.75);
    p.rotation.y = 1.1+rand(-0.4,0.4); court.add(p);
  }
  for(let i=0;i<4;i++){
    const p = pumpkinDeco(rand(53.2,57.5), rand(2.1,3.1), rand(0.5,0.9), Math.random()<0.7);
    p.rotation.y = 1.3+rand(-0.4,0.4); court.add(p);
  }
  // jack-o'-lantern torch posts flanking the approach
  for(const tz of [-2.2, 2.2]){
    const pole = mesh('cyl',[0.09,0.12,1.7,6], mat(PAL.woodD)); pole.position.set(52.6,0.85,tz);
    const top = pumpkinDeco(52.6, tz, 0.7, true); top.position.y = 1.7;
    court.add(pole, top);
  }
  // royal banners
  for(const bx of [54.4, 57.6]){
    const bp = mesh('cyl',[0.06,0.08,3.4,5], mat(PAL.woodD)); bp.position.set(bx,1.7,-2.6);
    const cloth = mesh('box',[0.95,1.9,0.07], mat(0x5a2a6e)); cloth.position.set(bx,2.6,-2.4); crook(cloth,0.03);
    const band = mesh('box',[0.95,0.2,0.09], emat(0xc9a227,0x7a5a10,0.35)); band.position.set(bx,3.42,-2.4);
    court.add(bp, cloth, band);
  }
  S.add(bakeGroup(court));
  // THE KING LOOMS: a mountain of a pumpkin on the horizon behind his gate
  const king = new THREE.Group();
  const kb = mesh('sph',[7,12,10], mat(0x171126)); kb.position.set(61,3.2,-19); kb.scale.set(1.15,0.85,1.15);
  const ks = mesh('cyl',[0.7,1.1,2.6,6], mat(0x100c1c)); ks.position.set(61,9.6,-19);
  for(let i=0;i<6;i++){
    const a = i/6*TAU;
    const pt = mesh('cone',[0.55,1.7,4], mat(0x241c40));
    pt.position.set(61+Math.cos(a)*3.4, 8.8, -19+Math.sin(a)*3.4);
    king.add(pt);
  }
  king.add(kb, ks);
  S.add(bakeGroup(king));
  const eyeM = new THREE.MeshBasicMaterial({color:0xffb02e, transparent:true, opacity:0.5});
  const eyeL = new THREE.Mesh(geo('cone',0.75,1.1,3), eyeM); eyeL.position.set(58.9,4.8,-11.6);
  const eyeR = eyeL.clone(); eyeR.position.x = 63.1;
  S.add(eyeL, eyeR);
  G._w1l5Eyes = [eyeL, eyeR];

  // ================= approach deco + ambient life =================
  const deco = new THREE.Group();
  fenceRun(deco, -8, -3.4, 43, -3.4, 22);
  for(let i=0;i<9;i++) deco.add(grave(rand(-6,41), rand(-5.5,-2.2)));
  for(let i=0;i<6;i++) deco.add(deadTree(rand(-6,42), rand(-8,-4.5), rand(0.8,1.4)));
  for(let i=0;i<7;i++) deco.add(pumpkinDeco(rand(-4,42), rand(-2.9,-1.8), rand(0.5,0.95), Math.random()<0.45));
  for(let i=0;i<4;i++) deco.add(grave(rand(2,40), rand(2.6,3.4)));
  for(let i=0;i<4;i++) deco.add(pumpkinDeco(rand(3,41), rand(2.4,3.2), rand(0.55,0.95), false));
  S.add(bakeGroup(deco));
  G.ents.add(new Crow(16.5, 0.95, -2.6));
  G.ents.add(new Crow(57.4, 0.95, 2.5));
  // the quiet prop: the King's #1 fan — a tiny pumpkin in a paper crown on the last
  // fencepost, gazing across the moat at the gate it can never reach
  const fan = new THREE.Group();
  const fp = pumpkinDeco(0, 0, 0.42, false);
  const crown = mesh('cyl',[0.14,0.15,0.1,6], mat(0xf2e2a8)); crown.position.y = 0.32;
  for(let i=0;i<5;i++){
    const a = i/5*TAU;
    const pt = mesh('cone',[0.035,0.09,3], mat(0xf2e2a8));
    pt.position.set(Math.cos(a)*0.11, 0.4, Math.sin(a)*0.11);
    fan.add(pt);
  }
  fan.add(fp, crown);
  fan.position.set(43, 0.9, -3.4); fan.rotation.y = 1.25;
  S.add(fan);

  exitGate(G, 56);
  levelFinish(G, 9, 43, 'grave');       // ambience span keeps kit clutter off both gaps
  buildClutter(G, -8, 5, 'grave');      // intro stretch
  buildClutter(G, 53, 58, 'grave');     // the courtyard
  return {spawnX: 0, exitX: 56};
}

function updateW1L5(G, dt){
  updateLevelCommon(G, dt);
  // the King's eyes smoulder on the horizon (both eyes share one material)
  if(G._w1l5Eyes) G._w1l5Eyes[0].material.opacity = 0.4+Math.sin(G.time*0.8)*0.22;
}

W1_LEVELS.push({id:'w1l5', district:'w1', name:"THE KING'S DOORSTEP", build:buildW1L5, update:updateW1L5, parTime:65});

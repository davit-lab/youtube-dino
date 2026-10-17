const assert=require('node:assert/strict');const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const b=await chromium.launch({headless:true,args:['--no-sandbox']});try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>1);await p.goto(process.env.GAME_URL||'http://localhost:3000');await p.waitForTimeout(700);
const r=await p.evaluate(()=>{
 state.settings.sfxVolume=0;state.settings.difficulty='normal';state.upgrades.shield=false;
 const check=(v,s)=>{if(!v)throw Error(s);},result={};
 for(const type of STAGE_ZOMBIE_TYPES){
  loadLevel(14);state.mode='playing';state.lives=8;zombies=[];const saved=level.plats;
  level.plats=[{x:0,y:GROUND_Y,w:900,h:100}];
  resetPlayer({x:300,y:GROUND_Y-54});player.invuln=0;player.hasShield=false;
  const z=makeStageZombie({x:100,floor:GROUND_Y,type,lo:90,hi:120});let maxX=z.x;
  for(let i=0;i<800&&state.lives===8;i++){updateZombies(16.67);maxX=Math.max(maxX,z.x);}
  result[type]={attacked:state.lives<8,leftTinyPatrol:maxX>120};check(result[type].attacked,`${type} must damage player`);check(result[type].leftTinyPatrol,`${type} must pursue`);level.plats=saved;
 }
 loadLevel(14);state.mode='playing';const saved=level.plats;
 level.plats=[{x:0,y:GROUND_Y,w:200,h:20,oneWay:true},{x:200,y:GROUND_Y-32,w:200,h:20,oneWay:true}];
 const z={x:100,y:GROUND_Y-58,w:40,h:58,floor:GROUND_Y,stageVariant:'rootbound'};moveZombieOnGround(z,280);check(z.x===280&&z.floor===GROUND_Y-32,'cross connected stair');
 level.plats=[{x:0,y:GROUND_Y,w:200,h:20,oneWay:true},{x:350,y:GROUND_Y,w:200,h:20,oneWay:true}];Object.assign(z,{x:100,y:GROUND_Y-58,floor:GROUND_Y});moveZombieOnGround(z,400);check(z.x<200,'stop at gap');
 level.plats=[{x:0,y:GROUND_Y,w:700,h:100},{x:220,y:GROUND_Y-130,w:30,h:130}];Object.assign(z,{x:100,y:GROUND_Y-58,floor:GROUND_Y});moveZombieOnGround(z,400);check(z.x+z.w<=220,'stop at wall');level.plats=saved;
 loadLevel(0);state.mode='playing';zombies=[];const plats=level.plats;level.plats=[{x:0,y:GROUND_Y,w:200,h:100},{x:200,y:GROUND_Y,w:300,h:100}];
 resetPlayer({x:300,y:GROUND_Y-54});player.invuln=0;player.hasShield=false;spawnZombie(100,GROUND_Y-56,'slow');const native=zombies[0];
 for(let i=0;i<500&&!player.isBitten;i++)updateZombies(16.67);
 check(player.isBitten&&native.x>200,'native crosses seam and attacks');level.plats=plats;
 return {...result,stairs:true,gaps:true,walls:true,nativeAttack:true};
});assert.deepEqual(errors,[]);console.log('PASS',r);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});

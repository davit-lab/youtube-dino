const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.requestAnimationFrame=()=>1);await page.goto(process.env.GAME_URL||'http://localhost:3000');await page.waitForTimeout(700);
 const result=await page.evaluate(()=>{
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  state.settings.sfxVolume=0;state.settings.difficulty='normal';
  const advance=ms=>{while(ms>0){const dt=Math.min(100,ms);ZombieRespawns.update(dt);ms-=dt;}};
  loadLevel(0);state.mode='playing';zombies=[];spawnZombie(500,GROUND_Y-54,'slow');
  let z=zombies[0];const originalHp=z.maxHealth,source=z.respawnSource;
  for(let attempt=0;attempt<4;attempt++){
   z=zombies.find(z=>z.respawnSource===source);z.x=550;z.health=0;updateZombies(0);
   check(ZombieRespawns.pending.length===1,'one native timer');advance(2999);check(zombies.length===0,'native not early');advance(1);
   check(zombies.length===1&&zombies[0].x===500&&zombies[0].health===originalHp,'native repeated spawn at original position with full health');
  }
  zombies[0].health=0;updateZombies(0);state.mode='paused';advance(5000);check(ZombieRespawns.pending[0].remaining===3000,'pause freezes timer');state.mode='playing';
  Object.defineProperty(document,'hidden',{configurable:true,value:true});advance(5000);check(ZombieRespawns.pending[0].remaining===3000,'hidden freezes timer');delete document.hidden;
  loadLevel(14);state.mode='playing';check(ZombieRespawns.pending.length===0,'level entry clears native timer');zombies=[];
  const s={x:600,floor:GROUND_Y,type:'rootbound',lo:580,hi:700,spawned:true};
  for(let attempt=0;attempt<4;attempt++){
   z=attempt===0?makeStageZombie(s):zombies.find(z=>z.spawn===s);const hp=z.maxHealth;
   z.health=0;updateStageZombie(z,0,zombies.indexOf(z));updateStageZombie(z,0,zombies.indexOf(z));check(ZombieRespawns.pending.length===1,'stage timer deduplicated');
   advance(2999);check(!zombies.some(z=>z.spawn===s&&z.health>0),'stage not early');advance(1);
   check(zombies.filter(z=>z.spawn===s&&z.health>0).length===1,'one stage respawn');check(zombies.find(z=>z.spawn===s&&z.health>0).health===hp,'stage full health');
   zombies=zombies.filter(z=>z.health>0);
  }
  z=zombies[0];z.health=0;updateStageZombie(z,0,0);resetStageEnemies(level,true);check(ZombieRespawns.pending.length===0,'checkpoint clears timer');
  zombies=[];z=makeStageZombie(s);z.health=0;updateStageZombie(z,0,0);
  for(let i=0;i<stageTuning().cap;i++)makeStageZombie({...s,x:700+i*50});advance(3000);check(ZombieRespawns.waiting(s),'cap delays spawn');
  zombies=zombies.filter(z=>z.spawn===s);ZombieRespawns.update(0);check(zombies.filter(z=>z.health>0).length===1,'pending spawn resumes after cap opens');
  const seal=level.stagecraft.hazards.find(h=>h.type==='seal');
  loadLevel(19);state.mode='playing';zombies=[];const h=level.stagecraft.hazards.find(h=>h.type==='seal');
  const grouped=makeStageZombie({...s,x:h.x+60,floor:h.y},h.id);grouped.health=0;updateStageZombie(grouped,0,0);h.done=true;advance(3000);check(ZombieRespawns.pending.length===0&&!zombies.some(z=>z.health>0),'completed encounter stays completed');
  loadLevel(20);state.mode='playing';advance(5000);check(ZombieRespawns.pending.length===0,'no enemies leak into flappy');
  loadLevel(21);state.mode='playing';advance(5000);check(ZombieRespawns.pending.length===0,'no enemies leak into snake');
  return {nativeRepeated:true,stageRepeated:true,exactThreeSeconds:true,fullHealth:true,pause:true,hidden:true,cleanup:true,cap:true,encounterCompletion:true};
 });assert.deepEqual(errors,[]);console.log('PASS',result);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});

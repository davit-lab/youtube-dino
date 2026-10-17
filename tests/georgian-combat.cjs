const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');(async()=>{const b=await chromium.launch({headless:true,args:['--no-sandbox']});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>1);await p.goto('http://localhost:3000');await p.waitForTimeout(700);const r=await p.evaluate(()=>{state.settings.sfxVolume=0;for(let n=0;n<22;n++){loadLevel(n);state.mode='playing';if(n<20){for(const x of [200,level.width*.4,level.width*.75]){resetPlayer({x,y:GROUND_Y-54});loop(performance.now());}if(n>=14){resetPlayer({x:level.journey.start+50,y:GROUND_Y-54});updateJourney(16);drawJourneyStory();}}else if(n===20){for(const s of ['READY','PLAYING','PAUSED','GAME_OVER','COMPLETE']){FlappyFlight.attempt.state=s;FlappyFlight.frame(0);}}else{for(const s of ['READY','PLAYING','PAUSED','GAME_OVER','COMPLETE']){SnakeDino.attempt.state=s;SnakeDino.frame(0);}}}SnakeDino.leave();loadLevel(14);for(const mode of ['menu','settings','shop','dailyquests','levelselect','paused','gameover','win']){state.mode=mode;loop(performance.now());}return [...GameGeorgian.missing];});require('node:assert/strict').deepEqual(r,[]);console.log('PASS: Georgian text across levels 1–22, menus, objectives and result screens');const combat=await p.evaluate(()=>{
 state.settings.difficulty='normal';state.settings.sfxVolume=0;loadLevel(14);state.mode='playing';
 const prevRandom=Math.random;Math.random=()=>.8;zombies=[];spawnZombie(500,GROUND_Y-54,'slow');Math.random=prevRandom;
 const expected=Math.ceil(Math.round((10+14)*level.zombieHpMult)*1.75);if(zombies[0].health!==expected)throw Error('native health scaling');
 const hp={};for(const type of ['rootbound','worker','guardian']){
  zombies=[];const z=makeStageZombie({x:500,floor:GROUND_Y,type,lo:480,hi:650});hp[type]=z.health;
  const initial=z.health;for(let i=0;i<initial-1;i++)z.health-=damageStageZombie(z,{damage:1,vx:1,y:z.y+5});
  updateStageZombie(z,16,0);if(z.health!==1||z.phase==='dead')throw Error('enemy died early');
  const kills=state.zombiesKilledInLevel;z.health-=damageStageZombie(z,{damage:1,vx:1,y:z.y+5});updateStageZombie(z,16,0);updateStageZombie(z,16,0);
  if(z.phase!=='dead'||state.zombiesKilledInLevel!==kills+1)throw Error('death credit');
 }
 if(hp.rootbound!==10||hp.worker!==12||hp.guardian!==14)throw Error('stage health');
 state.settings.difficulty='easy';zombies=[];const easy=makeStageZombie({x:500,floor:GROUND_Y,type:'rootbound',lo:480,hi:650}).health;
 state.settings.difficulty='hardcore';zombies=[];const hard=makeStageZombie({x:500,floor:GROUND_Y,type:'rootbound',lo:480,hi:650}).health;
 if(easy!==8||hard!==13)throw Error('difficulty health');return {native:expected,...hp,easy,hard};
});console.log('PASS tougher zombies and exactly-once kill credit:',combat);
await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{state.settings.sfxVolume=0;state.mode='menu';drawMenu();});await p.screenshot({path:'artifacts/georgian-menu.png'});
await p.evaluate(()=>{loadLevel(14);state.mode='playing';resetPlayer({x:level.journey.start+100,y:GROUND_Y-54});updateJourney(16);loop(performance.now());});await p.screenshot({path:'artifacts/georgian-missions.png'});
await p.evaluate(()=>{loadLevel(20);state.mode='playing';FlappyFlight.frame(0);});await p.screenshot({path:'artifacts/georgian-flappy.png'});
await p.evaluate(()=>{loadLevel(21);state.mode='playing';SnakeDino.frame(0);});await p.screenshot({path:'artifacts/georgian-snake.png'});require('node:assert/strict').deepEqual(errors,[]);await b.close()})();

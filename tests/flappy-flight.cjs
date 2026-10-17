const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});try{
const page=await browser.newPage({viewport:{width:1000,height:850}}), errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>1);
await page.goto(process.env.GAME_URL||'http://localhost:3000');await page.waitForTimeout(1000);
const result=await page.evaluate(()=>{
 state.settings.sfxVolume=0;loadLevel(20);state.mode='playing';const f=FlappyFlight,c=f.config,g=f.attempt;
 const checks={registration:MAX_LEVELS===22&&LEVELS.length===22,ready:g.state==='READY'};
 let prev=285;for(let i=0;i<10000;i++){let next=f.gapCenter(prev);if(next<160||next>410||Math.abs(next-prev)>85)throw Error('unreachable gap');prev=next;}
 checks.generator=true;f.flap();checks.flap=g.vy===-330&&g.state==='PLAYING';
 f.frame(.01);const y=g.y;f.pause();for(let i=0;i<100;i++)f.frame(.033);checks.pause=y===g.y;f.pause();
 g.y=285;g.pipes=[{x:90,center:285,gap:178,scored:false}];checks.gap=!f.collides(g.pipes[0]);g.y=200;checks.cap=f.collides(g.pipes[0]);g.y=285;
 g.pipes=[{x:20,center:285,gap:178,scored:false}];f.step(c.step);checks.singleScore=g.score===1;f.step(c.step);checks.noDuplicate=g.score===1;
 g.score=49;g.pipes=[{x:20,center:285,gap:178,scored:false}];g.y=285;g.vy=0;f.step(c.step);checks.complete=g.state==='COMPLETE'&&state.flappy21.completed&&g.score===50;
 f.frame(.01);return checks;
});Object.values(result).forEach(v=>assert.equal(v,true));
await page.screenshot({path:'artifacts/flappy-complete.png'});
await page.evaluate(()=>{const r=canvas.getBoundingClientRect();canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.left+r.width*.5,clientY:r.top+r.height*380/640}));});
assert.equal(await page.evaluate(()=>FlappyFlight.attempt.endless),true);
await page.evaluate(()=>{FlappyFlight.flap();FlappyFlight.attempt.y=560;FlappyFlight.step(1/120);FlappyFlight.frame(0);});
assert.equal(await page.evaluate(()=>FlappyFlight.attempt.state),'DYING');
await page.screenshot({path:'artifacts/flappy-hit.png'});
await page.evaluate(()=>{for(let i=0;i<150;i++)FlappyFlight.step(1/120);FlappyFlight.frame(0);});
assert.equal(await page.evaluate(()=>FlappyFlight.attempt.state),'GAME_OVER');
assert.equal(await page.evaluate(()=>state.flappy21.completed),true);
await page.evaluate(()=>{for(let i=0;i<15;i++){loadLevel(20);state.mode='playing';}FlappyFlight.frame(.01);});
await page.keyboard.down('Space');const vy=await page.evaluate(()=>FlappyFlight.attempt.vy);await page.keyboard.down('Space');await page.keyboard.up('Space');assert.equal(vy,-330);
await page.evaluate(()=>FlappyFlight.frame(0));
await page.screenshot({path:'artifacts/flappy-flight.png'});
const flight=await page.evaluate(()=>{
 loadLevel(19);state.mode='playing';finalBoss.dead=true;levelClear();const unlock=state.unlockedLevels>=21;
 loadLevel(20);state.mode='playing';const f=FlappyFlight,g=f.attempt;f.flap();let time=0;
 for(let i=0;i<20000&&g.state==='PLAYING';i++){
   const next=g.pipes.find(p=>p.x+66>88),target=next?.center||285;
   if(g.y>target+20&&g.vy>0)f.flap();f.step(1/120);time+=1/120;
 }
 return {unlock,state:g.state,score:g.score,time};
});assert.equal(flight.unlock,true);assert.equal(flight.state,'COMPLETE');assert.equal(flight.score,50);assert.ok(flight.time>=90&&flight.time<=120);console.log('Full flight:',flight);
await page.reload();await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>state.flappy21.completed),true);
await page.evaluate(()=>{loadLevel(0);state.mode='playing';loop(performance.now());});assert.deepEqual(errors,[]);
console.log('PASS',result,'endless, death sequence, repeated entry, keyboard, saved completion, level 1 render; no browser errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});

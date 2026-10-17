const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});try{
const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>1);
await page.goto(process.env.GAME_URL||'http://localhost:3000');await page.waitForTimeout(800);
const checks=await page.evaluate(()=>{
 const f=SnakeDino,c=f.config;state.settings.sfxVolume=0;
 const check=(v,msg)=>{if(!v)throw Error(msg);};
 const load=()=>{loadLevel(21);state.mode='playing';f.start();return f.attempt;};
 const setBody=(g,b)=>{g.body=b;g.occupied=new Set(b.map(p=>p.y*24+p.x));g.queue=[];};
 let g=load();check(MAX_LEVELS===22&&LEVELS.length===22&&g.body.length===5,'registration');
 check(!f.turn('left'),'reverse rejected');check(f.turn('up')&&f.turn('left'),'two turns accepted');check(!f.turn('down'),'buffer limit');f.tick();check(g.body[0].y===9&&g.body[0].x===11,'first turn');f.tick();check(g.body[0].x===10&&g.body[0].y===9,'second turn');
 g=load();setBody(g,[{x:5,y:5},{x:5,y:6},{x:4,y:6},{x:4,y:5}]);g.dir={x:-1,y:0};g.food={x:20,y:15};f.tick();check(g.state==='PLAYING'&&g.body.length===4&&g.occupied.size===4,'vacating tail');
 g=load();setBody(g,[{x:5,y:5},{x:5,y:6},{x:4,y:6},{x:4,y:5}]);g.dir={x:-1,y:0};g.food={x:4,y:5};f.tick();check(g.state==='DYING','growing tail collision');
 g=load();for(let i=0;i<3000;i++){const food=f.spawnFood();check(food.x>=0&&food.x<24&&food.y>=0&&food.y<20&&!g.occupied.has(food.y*24+food.x),'food free');}
 g.food={x:12,y:10};f.tick();check(g.foodCount===1&&g.score===10&&g.body.length===6,'single food growth');f.tick();check(g.score===10&&g.body.length===6,'no double growth');
 const h=JSON.stringify(g.body),time=g.time;f.pause();for(let i=0;i<50;i++)f.advance(.2);check(JSON.stringify(g.body)===h&&g.time===time,'pause frozen');f.pause();check(g.accumulator===0&&g.queue.length===0,'resume cleared');
 Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));check(g.state==='PAUSED','hidden auto pause');
 Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));f.advance(3);check(g.state==='PAUSED','visible stays paused');f.pause();check(g.accumulator===0,'no tab catch-up');delete document.hidden;
 g=load();const positions=[];for(const fps of [30,60,144]){g=load();g.food={x:0,y:0};for(let i=0;i<fps;i++)f.advance(1/fps);positions.push(g.body[0].x);}check(positions.every(x=>x===17),'frame rate independence');
 g=load();g.foodCount=39;g.score=390;g.food={x:12,y:10};f.tick();check(g.state==='COMPLETE'&&g.foodCount===40&&g.score===400&&state.snake22.completed,'40th food completion');
 const before=JSON.stringify({b:g.body,d:g.dir,f:g.food,s:g.score});f.endless();check(g.state==='READY'&&g.endless&&g.resumeEndless,'endless explicit resume');check(JSON.stringify({b:g.body,d:g.dir,f:g.food,s:g.score})===before,'endless identity');f.start();check(g.state==='PLAYING','endless starts');
 setBody(g,[{x:23,y:10},{x:22,y:10},{x:21,y:10},{x:20,y:10},{x:19,y:10}]);g.dir={x:1,y:0};f.tick();check(g.state==='DYING'&&g.reason==='Wall collision','wall death');f.advance(.2);check(g.state==='DYING','visible death hold');for(let i=0;i<5;i++)f.advance(.2);check(g.state==='GAME_OVER'&&state.snake22.completed,'endless death preserves completion');
 g=load();const all=[];for(let y=0;y<20;y++)for(let x=0;x<24;x++)if(x!==12||y!==10)all.push({x,y});
 // Near-full occupancy tests success without a random-retry loop.
 setBody(g,[{x:11,y:10},...all.filter(p=>p.x!==11||p.y!==10)]);g.dir={x:1,y:0};g.food={x:12,y:10};g.foodCount=39;f.tick();check(g.state==='COMPLETE'&&g.boardFull&&g.body.length===480&&g.food===null,'board full success');
 for(let i=0;i<20;i++){g=load();check(g.queue.length===0&&g.score===0&&g.body.length===5,'restart reset');}
 f.frame(0);return {registration:true,buffer:true,tail:true,food:true,growth:true,pause:true,frameRates:true,completion:true,endless:true,boardFull:true,restarts:true};
});console.log(checks);await page.screenshot({path:'artifacts/snake-dino-playing.png'});
await page.keyboard.press('ArrowUp');assert.equal(await page.evaluate(()=>SnakeDino.attempt.queue.length),1);
await page.keyboard.down('ArrowLeft');await page.keyboard.down('ArrowLeft');await page.keyboard.up('ArrowLeft');assert.equal(await page.evaluate(()=>SnakeDino.attempt.queue.length),2);
await page.keyboard.press('KeyP');await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>SnakeDino.attempt.queue.length),0);
await page.evaluate(()=>{SnakeDino.leave();state.mode='levelselect';drawDirtLevelSelect();});
await page.evaluate(()=>{const b=dirtLevelBlock(21),r=canvas.getBoundingClientRect();state.unlockedLevels=22;canvas.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.left+(b.x+64)*r.width/W,clientY:r.top+(b.y+30)*r.height/H}));});assert.equal(await page.evaluate(()=>SnakeDino.attempt.state),'READY');
await page.evaluate(()=>SnakeDino.frame(0));await page.screenshot({path:'artifacts/snake-dino-ready.png'});
await page.evaluate(()=>{localStorage.setItem('geodino_flappy21',JSON.stringify({completed:true,campaignBest:50}));localStorage.setItem('geodino_unlocked_levels','21');});
await page.reload();await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>state.unlockedLevels),22);assert.equal(await page.evaluate(()=>state.snake22.completed),true);
await page.evaluate(()=>{loadLevel(20);state.mode='playing';FlappyFlight.frame(0);loadLevel(0);state.mode='playing';loop(performance.now());});
const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));await mobile.addInitScript(()=>window.requestAnimationFrame=()=>1);await mobile.goto(process.env.GAME_URL||'http://localhost:3000');await mobile.waitForTimeout(700);await mobile.evaluate(()=>{state.settings.sfxVolume=0;loadLevel(21);state.mode='playing';SnakeDino.frame(0);});
const r=await mobile.locator('#game').boundingBox();assert.ok(Math.abs(r.width/r.height-600/760)<.01);
await mobile.touchscreen.tap(r.x+r.width*.5,r.y+r.height*.5);
await mobile.touchscreen.tap(r.x+r.width*298/600,r.y+r.height*626/760);assert.equal(await mobile.evaluate(()=>SnakeDino.attempt.queue.length),1);
await mobile.evaluate(()=>{
 const r=canvas.getBoundingClientRect(),x=r.left+r.width*.5,y=r.top+r.height*.4;
 canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:12,pointerType:'touch',isPrimary:true,clientX:x,clientY:y}));
 canvas.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:12,pointerType:'touch',isPrimary:true,clientX:x-50,clientY:y}));
});assert.equal(await mobile.evaluate(()=>SnakeDino.attempt.queue.length),2);
await mobile.evaluate(()=>{window.dispatchEvent(new Event('blur'));});assert.equal(await mobile.evaluate(()=>SnakeDino.attempt.state),'PAUSED');
await mobile.evaluate(()=>{SnakeDino.pause();SnakeDino.frame(0);});await mobile.screenshot({path:'artifacts/snake-dino-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS desktop keyboard, selection, persistence, prior levels, mobile tap/D-pad and framing; no browser errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});

/* Classic integer-grid Snake; rendered and advanced by the campaign's shared loop. */
const SnakeDino = (() => {
  const C=Object.freeze({cols:24,rows:20,cell:22,boardX:36,boardY:110,width:600,height:760,
    target:40,startLength:5,earlyMs:150,middleMs:135,lateMs:120,endlessMinMs:95,deathSeconds:.85});
  const dirs={right:{x:1,y:0},down:{x:0,y:1},left:{x:-1,y:0},up:{x:0,y:-1}};
  const art={};
  for(const kind of ['characters','heads'])for(const pose of ['idle','slither_01','slither_02','eat','hit','dead']){
    const im=new Image();im.src=`assets/snake-dino-level-22-assets/${kind}/${pose}.png`;art[`${kind}/${pose}`]=im;
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let g,active=false,swipe=null;
  const key=p=>p.y*C.cols+p.x;
  const same=(a,b)=>a.x===b.x&&a.y===b.y;
  function interval(food,endless=false){return endless?Math.max(C.endlessMinMs,C.lateMs-(food-C.target)*.6):food<10?C.earlyMs:food<25?C.middleMs:C.lateMs;}
  function records(){return state.snake22 ||= {completed:false,campaignBest:0,endlessBest:0,bestLength:5};}
  function persist(){const r=records(),field=g.endless?'endlessBest':'campaignBest';r[field]=Math.max(r[field]||0,g.score);r.bestLength=Math.max(r.bestLength||5,g.body.length);saveData();}
  function enter(){
    if(actx?.state==='suspended')actx.resume().catch(()=>{});
    active=true;document.body.classList.add('snake-dino');canvas.style.aspectRatio='600 / 760';
    for(const k of Object.keys(keys))keys[k]=false;
    const body=Array.from({length:C.startLength},(_,i)=>({x:11-i,y:10}));
    g={state:'READY',body,occupied:new Set(body.map(key)),dir:dirs.right,queue:[],food:{x:16,y:10},foodCount:0,score:0,
      endless:false,time:0,accumulator:0,eatTime:0,deathTime:0,guard:0,particles:[],reason:'',pausedFrom:null,resumeEndless:false,milestone:0};swipe=null;
  }
  function leave(){if(!active)return;if(actx?.state==='suspended')actx.resume().catch(()=>{});active=false;swipe=null;g.queue=[];document.body.classList.remove('snake-dino');canvas.style.aspectRatio='';}
  function owns(){return active&&level?.isSnakeLevel&&['playing','paused'].includes(state.mode);}
  function sound(type){const a={eat:[720,.09,1150],hit:[160,.15,45],win:[640,.23,1280],start:[400,.06,600]}[type];beep(a[0],a[1],'triangle',.045,0,a[2]);}
  function loaded(){return Object.values(art).every(im=>im.complete&&im.naturalWidth);}
  function start(){if(!loaded())return;try{ac().resume().catch(()=>{});}catch{};g.state='PLAYING';g.resumeEndless=false;g.accumulator=0;g.guard=.12;sound('start');}
  function turn(direction){
    if(!['READY','PLAYING'].includes(g.state))return false;
    const d=typeof direction==='string'?dirs[direction]:direction;if(!d)return false;
    const last=g.queue.at(-1)||g.dir;
    if(same(d,last)&&g.state==='READY'){start();return true;}
    if(same(d,last)||d.x===-last.x&&d.y===-last.y||g.queue.length>=2)return false;
    if(g.state==='READY')start();
    if(g.state!=='PLAYING')return false;
    g.queue.push(d);return true;
  }
  function spawnFood(random=Math.random){
    const free=[];for(let y=0;y<C.rows;y++)for(let x=0;x<C.cols;x++)if(!g.occupied.has(key({x,y})))free.push({x,y});
    const head=g.body[0], spaced=free.filter(p=>{const d=Math.abs(p.x-head.x)+Math.abs(p.y-head.y);return d>=16&&d<=24;});
    const choices=spaced.length?spaced:free;
    return choices.length?choices[Math.min(choices.length-1,Math.floor(Math.max(0,random())*choices.length))]:null;
  }
  function complete(boardFull=false){
    g.state='COMPLETE';g.accumulator=0;g.queue=[];g.boardFull=boardFull;
    const r=records();if(!r.completed)trackQuestProgress('level_win',1);r.completed=true;state.levelStars[21]=3;persist();sound('win');
  }
  function die(reason){if(g.state!=='PLAYING')return;g.state='DYING';g.reason=reason;g.deathTime=0;g.accumulator=0;g.queue=[];persist();sound('hit');}
  function tick(){
    if(g.state!=='PLAYING')return;
    if(g.queue.length)g.dir=g.queue.shift();
    const h=g.body[0],next={x:h.x+g.dir.x,y:h.y+g.dir.y},eating=g.food&&same(next,g.food),tail=g.body.at(-1);
    if(next.x<0||next.x>=C.cols||next.y<0||next.y>=C.rows){die('Wall collision');return;}
    if(g.occupied.has(key(next))&&(eating||!same(next,tail))){die('Self collision');return;}
    if(!eating){g.body.pop();g.occupied.delete(key(tail));}
    g.body.unshift(next);g.occupied.add(key(next));
    if(eating){
      g.foodCount++;g.score+=10;g.eatTime=.16;sound('eat');
      if(!reduced.matches)for(let i=0;i<8;i++)g.particles.push({x:next.x+.5,y:next.y+.5,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:.3});
      if(g.foodCount%10===0)g.milestone=1;
      g.food=spawnFood();persist();
      if(!g.food){complete(true);return;}
      if(!g.endless&&g.foodCount===C.target){complete();return;}
    }
  }
  function pause(){
    if(['READY','PLAYING','DYING'].includes(g.state)){g.pausedFrom=g.state;g.state='PAUSED';g.queue=[];g.accumulator=0;swipe=null;if(actx)actx.suspend().catch(()=>{});}
    else if(g.state==='PAUSED'){g.state=g.pausedFrom;g.accumulator=0;g.queue=[];if(actx)actx.resume().catch(()=>{});}
  }
  function advance(dt){
    if(g.state==='PAUSED'||document.hidden)return;
    dt=Math.max(0,Math.min(.25,dt));g.time+=dt;g.guard=Math.max(0,g.guard-dt);
    g.eatTime=Math.max(0,g.eatTime-dt);g.milestone=Math.max(0,g.milestone-dt);
    if(g.state==='DYING'){g.deathTime+=dt;if(g.deathTime>=C.deathSeconds){g.state='GAME_OVER';g.guard=.35;}return;}
    if(g.state!=='PLAYING')return;
    for(const p of g.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}g.particles=g.particles.filter(p=>p.life>0);
    g.accumulator+=dt;let steps=0;
    while(g.state==='PLAYING'&&g.accumulator+1e-9>=interval(g.foodCount,g.endless)/1000&&steps<2){
      g.accumulator-=interval(g.foodCount,g.endless)/1000;tick();steps++;
    }
    if(steps===2)g.accumulator=Math.min(g.accumulator,interval(g.foodCount,g.endless)/1000*.5);
  }
  function pose(){const s=g.state==='PAUSED'?g.pausedFrom:g.state;if(s==='DYING')return g.deathTime<.18?'hit':'dead';if(s==='GAME_OVER')return 'dead';if(s==='READY')return 'idle';if(g.eatTime>0)return 'eat';return Math.floor(g.time*6)%2?'slither_01':'slither_02';}
  function box(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function text(s,x,y,size=16,c='#eee9db',align='left'){ctx.fillStyle=c;ctx.font=`bold ${size}px monospace`;ctx.textAlign=align;ctx.fillText(s,x,y);}
  function fullArt(pose,x,y,w=160){const im=art[`characters/${pose}`];if(im.naturalWidth)ctx.drawImage(im,x-w/2,y-w*.4,w,w*.8);}
  function bodyCell(p,index){
    const size=C.cell,cx=C.boardX+(p.x+.5)*size,cy=C.boardY+(p.y+.5)*size;
    const neighbors=[g.body[index-1],g.body[index+1]].filter(Boolean);
    if(index===g.body.length-1&&neighbors.length){
      const n=neighbors[0],angle=Math.atan2(n.y-p.y,n.x-p.x);
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
      box(1,-9,10,18,'#080e22');box(-5,-6,7,12,'#080e22');box(-9,-2,5,4,'#080e22');
      box(2,-7,9,14,'#7041a3');box(-3,-4,6,8,'#7041a3');box(0,0,11,5,'#5ac8d1');
      ctx.restore();return;
    }
    // Axis-aligned half-cell connections create both straights and elbows without diagonal cuts.
    for(const [width,color] of [[18,'#080e22'],[14,'#7041a3'],[6,'#5ac8d1']]){
      box(cx-width/2,cy-width/2,width,width,color);
      for(const n of neighbors){const dx=n.x-p.x,dy=n.y-p.y;
        box(dx<0?cx-size/2:cx-width/2,dy<0?cy-size/2:cy-width/2,dx?size/2+width/2:width,dy?size/2+width/2:width,color);
      }
    }
    if(index===g.body.length-1){box(cx-4,cy-4,8,8,'#9571bd');}
  }
  const pad=[{d:'up',x:262,y:596,label:'↑'},{d:'left',x:184,y:674,label:'←'},{d:'down',x:262,y:674,label:'↓'},{d:'right',x:340,y:674,label:'→'}];
  function button(label,y){box(125,y,350,40,'#55427a');box(128,y+3,344,34,'#27223d');text(label,300,y+26,17,'#f2ead9','center');}
  function draw(){
    ctx.save();ctx.setTransform(W/C.width,0,0,H/C.height,0,0);ctx.imageSmoothingEnabled=false;
    box(0,0,600,760,'#101426');
    fullArt(pose(),53,51,90);text('SNAKE DINO',105,34,23);text(`${g.endless?'ENDLESS':'LEVEL 22'}   FOOD ${g.foodCount}/${C.target}`,105,61,16);
    text(`SCORE ${g.score}   ${interval(g.foodCount,g.endless)} ms/cell`,105,86,14,'#a7bbc8');
    box(530,20,42,42,'#34324a');text('Ⅱ',551,48,23,'#eee9db','center');
    ctx.save();if(g.state==='DYING'&&g.deathTime<.18&&!reduced.matches)ctx.translate(Math.sin(g.deathTime*180)*2,0);
    box(28,102,544,456,'#675181');box(32,106,536,448,'#29223c');
    for(let y=0;y<C.rows;y++)for(let x=0;x<C.cols;x++)box(C.boardX+x*22,C.boardY+y*22,22,22,(x+y)%2?'#191f32':'#1b2236');
    if(g.food){const x=C.boardX+g.food.x*22,y=C.boardY+g.food.y*22;box(x+5,y+5,13,13,'#0a1020');box(x+6,y+6,11,11,'#e74c58');box(x+8,y+7,3,3,'#ffb0a2');box(x+11,y+2,3,5,'#80b980');}
    for(let i=g.body.length-1;i>=0;i--)bodyCell(g.body[i],i);
    const h=g.body[0],hx=C.boardX+(h.x+.5)*22,hy=C.boardY+(h.y+.5)*22,im=art[`heads/${pose()}`];
    // Head content bounds are ~254×247 on a 320px canvas: 30px draw gives 24px visible art.
    if(im.naturalWidth)ctx.drawImage(im,hx-15,hy-15,30,30);
    box(hx+g.dir.x*9-2,hy+g.dir.y*9-2,4,4,'#fff3b0');
    if(!reduced.matches)for(const p of g.particles)box(C.boardX+p.x*22,C.boardY+p.y*22,3,3,'#ffac9b');
    ctx.restore();
    text(g.milestone>0?`${g.foodCount} FOOD — KEEP GOING!`:'Arrows / WASD · Swipe or D-pad',300,582,14,'#b9b4c9','center');
    for(const b of pad){box(b.x,b.y,72,72,'#554677');box(b.x+3,b.y+3,66,66,'#302840');text(b.label,b.x+36,b.y+46,28,'#eae6d9','center');}
    text('P / Esc: pause',76,640,13,'#b9b4c9');text('Tap arena',468,636,12,'#b9b4c9','center');text('to begin',468,654,12,'#b9b4c9','center');
    if(g.state==='READY'&&!g.resumeEndless){
      box(99,192,402,277,'#101426');text('LEVEL 22 — SNAKE DINO',300,222,21,'#f1e5c9','center');fullArt('idle',300,295,190);
      text(`Eat ${C.target} food in one run`,300,380,18,'#f1e5c9','center');text('5 segments · solid walls',300,408,15,'#b7bad0','center');
      text(loaded()?'Enter / Space / tap to start':'Loading character…',300,441,16,'#78d1d3','center');
    }
    if(g.state==='READY'&&g.resumeEndless){box(113,265,374,98,'#101426');text('ENDLESS READY',300,300,22,'#eee9db','center');text('Tap / Enter to resume',300,337,17,'#78d1d3','center');}
    if(g.state==='DYING'){fullArt(pose(),300,643,210);}
    if(['PAUSED','GAME_OVER','COMPLETE'].includes(g.state)){
      box(86,147,428,407,'#0b1020');box(90,151,420,399,'#27223d');
      text(g.state==='COMPLETE'?(g.boardFull?'ARENA CLEARED!':'SNAKE DINO COMPLETE!'):g.state==='PAUSED'?'PAUSED':'GAME OVER',300,184,22,'#f1e5c9','center');
      fullArt(g.state==='GAME_OVER'?'dead':g.state==='PAUSED'?'idle':'eat',300,235,160);
      text(`Score ${g.score} · Food ${g.foodCount}/${C.target}`,300,300,18,'#eee9db','center');
      const r=records();text(`Campaign best ${r.campaignBest||0} · Endless ${r.endlessBest||0}`,300,327,14,'#b9b4c9','center');
      text(`Best length ${r.bestLength||5} · Length ${g.body.length}`,300,350,14,'#b9b4c9','center');
      text(g.state==='GAME_OVER'?g.reason:g.state==='COMPLETE'?'Campaign saved':'Movement and audio frozen',300,376,14,'#78d1d3','center');
      button(g.state==='PAUSED'?'Resume':g.state==='COMPLETE'&&!g.boardFull?'Continue Endless':'Replay Level 22',395);
      button('Replay Level 22',444);button('Campaign return',493);
    }
    ctx.restore();
  }
  function frame(dt){document.getElementById('mobileControls').style.display='none';document.getElementById('topBarControls').style.display='none';advance(dt);draw();}
  function endless(){if(g.state!=='COMPLETE'||g.boardFull)return;g.endless=true;g.state='READY';g.resumeEndless=true;g.accumulator=0;g.queue=[];persist();}
  function action(x,y){
    if(['PAUSED','GAME_OVER','COMPLETE'].includes(g.state)){
      if(g.guard>0||x<125||x>475)return;
      if(y>=493&&y<=533){persist();leave();state.mode='levelselect';}
      else if(y>=444&&y<=484)enter();
      else if(y>=395&&y<=435){if(g.state==='PAUSED')pause();else if(g.state==='COMPLETE'&&!g.boardFull)endless();else enter();}
      return;
    }
    if(x>=530&&y<=65){pause();return;}
    const p=pad.find(b=>x>=b.x&&x<=b.x+72&&y>=b.y&&y<=b.y+72);
    if(p){turn(p.d);return;}
    if(g.state==='READY')start();
  }
  window.addEventListener('keydown',e=>{
    if(!owns()||e.target?.matches('input,textarea'))return;
    e.stopImmediatePropagation();const map={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
    if(map[e.code]||['Space','Enter','KeyP','Escape','KeyR'].includes(e.code)){e.preventDefault();if(e.repeat)return;
      if(e.code==='KeyP'||e.code==='Escape')pause();
      else if(map[e.code])turn(map[e.code]);
      else if(e.code==='KeyR'&&['GAME_OVER','PAUSED'].includes(g.state)&&g.guard===0)enter();
      else if(['Space','Enter'].includes(e.code)){if(g.state==='READY')start();else if(g.state==='PAUSED')pause();else if(g.state==='GAME_OVER'&&g.guard===0)enter();}
    }
  },true);
  function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*600/r.width,y:(e.clientY-r.top)*760/r.height};}
  window.addEventListener('pointerdown',e=>{
    if(!owns()||e.target!==canvas)return;e.preventDefault();e.stopImmediatePropagation();if(!e.isPrimary&&e.pointerType==='touch')return;
    try{if(actx&&g.state!=='PAUSED')actx.resume().catch(()=>{});}catch{}
    const p=point(e);if(g.state==='PLAYING'&&p.y>=110&&p.y<=550){swipe={...p,id:e.pointerId};if(e.isTrusted)canvas.setPointerCapture?.(e.pointerId);}else action(p.x,p.y);
  },{capture:true,passive:false});
  window.addEventListener('pointerup',e=>{
    if(!owns()||!swipe||e.pointerId!==swipe.id)return;e.preventDefault();e.stopImmediatePropagation();const p=point(e),dx=p.x-swipe.x,dy=p.y-swipe.y;swipe=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;turn(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');
  },{capture:true,passive:false});
  window.addEventListener('pointercancel',()=>swipe=null);
  for(const type of ['mousedown','touchstart','touchmove'])window.addEventListener(type,e=>{if(owns()&&e.target===canvas){e.preventDefault();e.stopImmediatePropagation();}},{capture:true,passive:false});
  for(const type of ['blur','resize'])window.addEventListener(type,()=>{if(owns()&&g.state!=='PAUSED')pause();});
  document.addEventListener('visibilitychange',()=>{if(owns()&&document.hidden&&g.state!=='PAUSED')pause();});
  return {enter,leave,frame,advance,tick,turn,start,pause,endless,spawnFood,interval,config:C,get attempt(){return g;}};
})();

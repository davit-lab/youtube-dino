/* Level 21 uses the existing canvas, loop, audio mixer and save lifecycle. */
const FlappyFlight = (() => {
  const C = Object.freeze({ target: 50, width: 360, height: 640, ground: 570,
    gravity: 1100, flap: -330, maxFall: 600, pipeWidth: 62, spacing: 240,
    speed: 124, gap: 178, step: 1 / 120 });
  const images = {};
  for (const [name, count] of Object.entries({ idle:4, flap:4, glide:1, fall:2, hit:1, death:4 }))
    for (let i=1;i<=count;i++) { const key=`${name}_0${i}`; const im=new Image(); im.src=`assets/flappy-level-21-assets/frames/${key}.png`; images[key]=im; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let g, active=false;
  // A bounded random walk keeps all gaps reachable; injectable random supports tests.
  function gapCenter(previous, random=Math.random) { return Math.max(160, Math.min(410, previous + (random()*2-1)*85)); }
  function tuning(score, endless=false) {
    const t=Math.max(0, Math.min(1,(score-15)/20));
    return { speed:C.speed*(1+0.12*t) + (endless?Math.min(16,Math.max(0,score-C.target)*0.25):0),
      gap:C.gap-8*t-(endless?Math.min(12,Math.max(0,score-C.target)*0.2):0) };
  }
  function records() { return state.flappy21 ||= { campaignBest:0, endlessBest:0, completed:false, medal:0 }; }
  function persist() {
    const r=records(); r[g.endless?'endlessBest':'campaignBest']=Math.max(r[g.endless?'endlessBest':'campaignBest']||0,g.score);
    r.medal=Math.max(r.medal||0,g.score>=C.target?3:g.score>=25?2:g.score>=10?1:0); saveData();
  }
  function enter() {
    active=true; document.body.classList.add('flappy-flight');
    canvas.style.aspectRatio='360 / 640';
    for(const k of Object.keys(keys)) keys[k]=false;
    g={state:'READY', y:285, vy:0, score:0, endless:false, pipes:[], pool:[], particles:[],
      time:0, flapTime:99, deathTime:0, groundOffset:0, accumulator:0, guard:0, previous:285, pausedFrom:null};
  }
  function leave() { if(actx?.state==='suspended')actx.resume().catch(()=>{}); active=false; document.body.classList.remove('flappy-flight'); canvas.style.aspectRatio=''; }
  function owns() { return active && level?.isFlappyLevel && ['playing','paused'].includes(state.mode); }
  function sound(type) {
    const spec={flap:[600,.07,240],point:[900,.09,1400],hit:[180,.12,60],land:[100,.07,45]}[type];
    beep(spec[0],spec[1],'triangle',.045,0,spec[2]);
  }
  function pipe(x) { const p=g.pool.pop()||{}; g.previous=gapCenter(g.previous); Object.assign(p,{x,center:g.previous,gap:tuning(g.score,g.endless).gap,scored:false}); return p; }
  function flap() {
    if(g.state==='READY') { if(!Object.values(images).every(im=>im.complete&&im.naturalWidth)) return; g.state='PLAYING'; g.pipes.push(pipe(390),pipe(630),pipe(870)); }
    if(g.state!=='PLAYING') return;
    g.vy=C.flap; g.flapTime=0; sound('flap');
    if(!reduced.matches) for(let i=0;i<5;i++) g.particles.push({x:86,y:g.y+8,vx:-30-Math.random()*40,vy:(Math.random()-.5)*60,life:.3});
  }
  function pause() {
    if(['READY','PLAYING','DYING'].includes(g.state)){g.pausedFrom=g.state;g.state='PAUSED';g.accumulator=0;if(actx)actx.suspend().catch(()=>{});}
    else if(g.state==='PAUSED'){g.state=g.pausedFrom;g.accumulator=0;if(actx)actx.resume().catch(()=>{});}
  }
  function hit() { if(g.state!=='PLAYING')return; g.state='DYING';g.deathTime=0;g.vy=Math.max(0,g.vy); sound('hit');persist(); }
  function collides(p) {
    const top=p.center-p.gap/2, bottom=p.center+p.gap/2;
    const x=88,y=g.y-15;
    const overlap=(px,pw,py,ph)=>x<px+pw&&x+24>px&&y<py+ph&&y+30>py;
    return overlap(p.x,C.pipeWidth,0,top-20)||overlap(p.x-4,C.pipeWidth+8,top-20,20)||
      overlap(p.x,C.pipeWidth,bottom+20,C.ground-bottom-20)||overlap(p.x-4,C.pipeWidth+8,bottom,20);
  }
  function complete() {
    g.state='COMPLETE'; const r=records(); if(!r.completed) trackQuestProgress('level_win',1);
    r.completed=true;state.unlockedLevels=Math.max(state.unlockedLevels||1,22);state.levelStars[20]=3; persist(); sound('point');
  }
  function step(dt) {
    g.time+=dt;g.flapTime+=dt;g.guard=Math.max(0,g.guard-dt);
    if(g.state==='READY')return;
    if(g.state==='DYING') {
      g.deathTime+=dt;
      if(g.deathTime>.14){g.vy=Math.min(C.maxFall,g.vy+C.gravity*dt);g.y=Math.min(C.ground-12,g.y+g.vy*dt);}
      if(g.y>=C.ground-12&&g.deathTime>.8){g.state='GAME_OVER';g.guard=.35;sound('land');}
      return;
    }
    if(g.state!=='PLAYING')return;
    g.vy=Math.min(C.maxFall,g.vy+C.gravity*dt);g.y+=g.vy*dt;
    if(g.y<22){g.y=22;g.vy=Math.max(0,g.vy);}
    const speed=tuning(g.score,g.endless).speed;
    g.groundOffset=(g.groundOffset+speed*dt)%24;
    for(const p of g.pipes)p.x-=speed*dt;
    if(g.y+15>=C.ground||g.pipes.some(collides)){hit();return;}
    for(const p of g.pipes)if(!p.scored&&p.x+C.pipeWidth+4<88){
      p.scored=true;g.score++;persist();sound('point');
      if(!g.endless&&g.score>=C.target){complete();return;}
    }
    while(g.pipes.length&&g.pipes[0].x+C.pipeWidth+4<0)g.pool.push(g.pipes.shift());
    if(!g.pipes.length||g.pipes.at(-1).x<600)g.pipes.push(pipe(g.pipes.length?g.pipes.at(-1).x+C.spacing:390));
    g.particles=g.particles.filter(p=>(p.life-=dt)>0);
    for(const p of g.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;}
  }
  function text(s,x,y,size=16,color='#fff') { ctx.font=`bold ${size}px monospace`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#30453d';ctx.strokeText(s,x,y);ctx.fillStyle=color;ctx.fillText(s,x,y); }
  function box(x,y,w,h,color) {ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function drawPipe(p) {
    const top=p.center-p.gap/2,bottom=p.center+p.gap/2;
    for(const [y,h] of [[-4,top+4],[bottom,C.ground-bottom]]){
      box(p.x,y,C.pipeWidth,h,'#294b22');box(p.x+3,y,56,h,'#78bc38');box(p.x+7,y,9,h,'#b2df61');box(p.x+47,y,9,h,'#4d8c29');
    }
    for(const y of [top-20,bottom]){box(p.x-4,y,70,20,'#294b22');box(p.x-1,y+3,64,14,'#78bc38');box(p.x+3,y+4,10,11,'#b2df61');box(p.x+50,y+3,10,14,'#4d8c29');}
  }
  function pose() {
    if(g.state==='DYING'||g.state==='GAME_OVER'||(g.state==='PAUSED'&&g.pausedFrom==='DYING')) return g.deathTime<.14?'hit_01':`death_0${Math.min(4,1+Math.floor((g.deathTime-.14)*9))}`;
    const s=g.state==='PAUSED'?g.pausedFrom:g.state;
    if(s==='READY')return `idle_0${1+Math.floor(g.time*7)%4}`;
    if(g.flapTime<4/14)return `flap_0${1+Math.floor(g.flapTime*14)}`;
    return g.vy<100?'glide_01':g.vy<300?'fall_01':'fall_02';
  }
  function button(label,y) {box(50,y,260,35,'#314b31');box(53,y+3,254,29,'#ead7a2');text(label,180,y+23,14,'#fff4d3');}
  const digits=['111101101101111','010110010010111','111001111100111','111001111001111','101101111001001','111100111001111','111100111101111','111001001001001','111101111101111','111101111001111'];
  function scoreDigits() {
    const value=String(g.score), unit=6, width=value.length*24-6, left=(360-width)/2;
    for(let n=0;n<value.length;n++)for(let i=0;i<15;i++)if(digits[+value[n]][i]==='1'){
      const x=left+n*24+(i%3)*unit,y=35+Math.floor(i/3)*unit;
      box(x-2,y-2,unit+4,unit+4,'#30453d');
    }
    for(let n=0;n<value.length;n++)for(let i=0;i<15;i++)if(digits[+value[n]][i]==='1')
      box(left+n*24+(i%3)*unit,35+Math.floor(i/3)*unit,unit,unit,'#fff');
  }
  function draw() {
    ctx.save();ctx.setTransform(W/360,0,0,H/640,0,0);ctx.imageSmoothingEnabled=false;
    box(0,0,360,640,'#80ced6');
    for(let i=0;i<5;i++){let x=((i*112-g.groundOffset*.15+400)%560)-100;box(x,95+(i%3)*61,70,16,'#eef8df');box(x+15,85+(i%3)*61,38,14,'#eef8df');}
    for(let i=0;i<14;i++){box(i*30,505-(i%3)*11,28,65,'#a5d6a0');box(i*30+6,496-(i%3)*11,17,15,'#a5d6a0');}
    ctx.save();if(g.state==='DYING'&&g.deathTime<.18&&!reduced.matches)ctx.translate(Math.sin(g.deathTime*180)*2,0);
    g.pipes.forEach(drawPipe);
    box(0,570,360,70,'#dfcb91');box(0,570,360,4,'#37502b');box(0,574,360,12,'#88c640');box(0,586,360,4,'#f6e8ad');
    for(let i=-1;i<17;i++){box(i*24-g.groundOffset,577,12,4,'#c4e16c');box(i*24-g.groundOffset,600,5,4,'#c4ad73');}
    for(const p of g.particles)box(p.x,p.y,3,3,'#fff6ca');
    const im=images[pose()],hover=g.state==='READY'&&!reduced.matches?Math.sin(g.time*4)*3:0;
    // Common 320px pivot, scale .175: idle bounds 199x266 become 35x47.
    if(im?.naturalWidth)ctx.drawImage(im,72,g.y-28+hover,56,56);
    ctx.restore();
    if(g.state==='DYING'&&g.deathTime<.08&&!reduced.matches){ctx.fillStyle='#ffffff88';ctx.fillRect(0,0,360,640);}
    scoreDigits();text(`${g.endless?'ENDLESS':`CAMPAIGN ${g.score}/${C.target}`}`,180,102,12);
    box(308,14,38,32,'#314b31');text('Ⅱ',327,37,22);
    if(g.state==='READY'){text('LEVEL 21',180,200,25);text('FLAPPY FLIGHT',180,232,25);text(`Clear ${C.target} pipe pairs`,180,355,17);text('Space / ↑ / W / tap',180,384,15);text('Tap to take flight',180,414,15);if(!Object.values(images).every(im=>im.naturalWidth))text('Loading character…',180,444,13);}
    if(['PAUSED','GAME_OVER','COMPLETE'].includes(g.state)){
      box(25,170,310,360,'#f0dfb0');box(30,175,300,350,'#b4cb84');
      text(g.state==='COMPLETE'?'FLIGHT COMPLETE!':g.state==='PAUSED'?'PAUSED':'FLIGHT OVER',180,211,24);
      text(`Score: ${g.score}`,180,246,20);
      const r=records();text(`Campaign best: ${r.campaignBest||0}`,180,275,14);text(`Endless best: ${r.endlessBest||0}`,180,298,14);
      text(`Medal: ${['—','BRONZE','SILVER','GOLD'][r.medal||0]}`,180,322,14);text(`Campaign: ${Math.min(g.score,C.target)}/${C.target}`,180,344,13);
      button(g.state==='COMPLETE'?'Continue Endless':g.state==='PAUSED'?'Resume':'Restart Level 21',365);
      button('Replay Level 21',412);button('Campaign return',459);
    }
    ctx.restore();
  }
  function frame(dt) {
    document.getElementById('mobileControls').style.display='none';
    document.getElementById('topBarControls').style.display='none';
    if(!document.hidden&&g.state!=='PAUSED'){
      g.accumulator+=Math.min(.05,dt);
      while(g.accumulator>=C.step){step(C.step);g.accumulator-=C.step;}
    }
    draw();
  }
  function action(y) {
    try{ac().resume();}catch{}
    if(g.state==='PAUSED'||g.state==='COMPLETE'||g.state==='GAME_OVER'){
      if(g.guard>0)return;
      if(y>=459&&y<=494){persist();leave();state.mode='levelselect';return;}
      if(y>=412&&y<=447){enter();return;}
      if(y>=365&&y<=400){
        if(g.state==='PAUSED')pause();
        else if(g.state==='GAME_OVER')enter();
        else {g.endless=true;g.state='READY';g.y=285;g.vy=0;g.pipes=[];g.previous=285;g.flapTime=99;g.accumulator=0;persist();}
      }
      return;
    }
    flap();
  }
  window.addEventListener('keydown',e=>{
    if(!owns()||e.target?.matches('input,textarea'))return;
    e.stopImmediatePropagation();
    if(['Space','ArrowUp','KeyW','KeyP','Escape','Enter','KeyR'].includes(e.code)){
      e.preventDefault();if(e.repeat)return;
      if(e.code==='KeyP'||e.code==='Escape')pause();
      else if(e.code==='KeyR'&&g.state==='GAME_OVER'&&g.guard===0)enter();
      else if(g.state==='PAUSED'&&['Space','Enter'].includes(e.code))pause();
      else if(g.state==='GAME_OVER'||g.state==='COMPLETE')action(380);
      else flap();
    }
  },true);
  window.addEventListener('pointerdown',e=>{
    if(!owns()||e.target!==document.getElementById('game'))return;
    e.preventDefault();e.stopImmediatePropagation();
    const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*360/r.width,y=(e.clientY-r.top)*640/r.height;
    if(x>=308&&y<50)pause();else action(y);
  },{capture:true,passive:false});
  for(const type of ['mousedown','touchstart']) window.addEventListener(type,e=>{if(owns()&&e.target===canvas){e.preventDefault();e.stopImmediatePropagation();}},{capture:true,passive:false});
  for(const type of ['blur','resize'])window.addEventListener(type,()=>{if(owns()&&g.state!=='PAUSED')pause();});
  document.addEventListener('visibilitychange',()=>{if(owns()&&document.hidden&&g.state!=='PAUSED')pause();});
  return {enter,leave,frame,step,gapCenter,tuning,collides,flap,pause,hit,config:C,get attempt(){return g;}};
})();

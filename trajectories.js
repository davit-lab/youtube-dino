/* Distinct mandatory expeditions replace the repeated flat service passages. */
const EXPEDITION_PLANS = [
 {name:'THE SUNKEN AQUEDUCT',task:'Recover the three floodgate stones',mode:'collect',kind:'rootbound',color:'#749b68',
  points:[[0,0],[450,0],[1250,320],[2350,320],[3150,80],[3800,-180],[4800,-330],[5700,-120],[6500,140],[7500,140],[8350,-60],[9100,0]],
  rooms:[[650,2200,'ROOT STAIRWELL'],[6250,1450,'LOWER WATER GALLERY']],goals:[2,6,9]},
 {name:'THE WINDWARD SUMMITS',task:'Land on the three summit flags',mode:'land',kind:'windborne',color:'#acc7bc',
  points:[[0,0],[450,-60],[1200,-270],[2100,-470],[3000,-680],[2400,-870],[3300,-1060],[4400,-920],[5400,-650],[6450,-780],[7350,-450],[8300,-200],[9100,0]],
  rooms:[],goals:[4,6,9],sky:true},
 {name:'THE FREIGHT REBELLION',task:'Shoot three power relays to break the blockade',mode:'shoot',kind:'worker',color:'#6c99a5',
  points:[[0,0],[700,0],[1450,240],[2700,240],[3500,20],[4300,-220],[5100,-420],[4600,-600],[5700,-600],[6650,-240],[7600,-80],[8350,80],[9100,0]],
  rooms:[[900,2100,'DRAINAGE STAIRS'],[7700,950,'ARMORED SERVICE VAULT']],goals:[3,7,11]},
 {name:'THE SPIRAL ORE SHAFT',task:'Defeat each mine foreman, then recover the ore',mode:'clear',kind:'miner',color:'#b29b79',
  points:[[0,0],[400,0],[1300,300],[2350,480],[1700,720],[2850,870],[4000,870],[4850,600],[5600,310],[6400,0],[7150,-230],[8050,-100],[9100,0]],
  rooms:[[500,1800,'FIRST DESCENT'],[2350,2300,'DEEP ORE STAIRS'],[4800,1600,'THE RETURN SHAFT']],goals:[3,5,8]},
 {name:'THE BASALT SKY FORGE',task:'Turn three cooling wheels: crouch beside each wheel',mode:'valve',kind:'cinder',color:'#bb7953',
  points:[[0,0],[600,-100],[1450,-330],[2300,-510],[3200,-740],[4100,-550],[5050,-240],[5900,160],[6900,300],[7700,80],[8250,-260],[9100,0]],
  rooms:[[5600,1750,'DOWNSTAIRS TO THE COOLING FORGE']],goals:[4,8,10],sky:true},
 {name:'THE LIGHTHOUSE SWITCHBACK',task:'Ignite the beacons in order, then face the World Eater',mode:'beacon',kind:'guardian',color:'#91b5be',
  points:[[0,0],[450,-70],[1250,-300],[2200,-550],[1550,-760],[2600,-980],[3650,-720],[4450,-430],[5250,-130],[6200,220],[7350,220],[8300,-100],[9100,0]],
  rooms:[[5700,2050,'DESCEND THROUGH THE SEA CRYPT']],goals:[3,5,10]}
];
function installDistinctTrajectories(worlds){
 const G=GROUND_Y;
 worlds.forEach((l,i)=>{
  const j=l.journey,plan=EXPEDITION_PLANS[i],start=j.start,end=start+9100;
  j.distinct=true;j.plan={...plan,intro:`${plan.name}: ${plan.task}. Follow the marked stairs and arrows.`};j.zones=[];j.hazards=[];
  j.route=[];j.rooms=[];j.nodes=[];j.goals=[false,false,false];
  // Remove the old flat extension, including its shared note / pump / delivery tasks.
  l.plats=l.plats.flatMap(p=>{
   if(p.x+p.w<=start||p.x>=end)return [p];
   const out=[];if(p.x<start)out.push({...p,w:start-p.x});if(p.x+p.w>end)out.push({...p,x:end,w:p.x+p.w-end});return out;
  });
  for(const field of ['coins','coinBags','supplyCaches','encounters','obstacles','spikes','crushers','firejets','steamVents'])
   l[field]=(l[field]||[]).filter(o=>o.x<start||o.x>=end);
  l.stagecraft.spawns=l.stagecraft.spawns.filter(o=>o.x<start||o.x>=end);
  l.checkpoints=l.checkpoints.filter(o=>o.x<start||o.x>=end);
  l.sections=l.sections.filter(o=>o.x<start||o.x>=end);
  const points=plan.points.map(([x,depth])=>({x:start+x,y:G+depth}));
  const platform=(x,y,w=140,extra={})=>{const p={x,y,w,h:24,oneWay:true,journeyTerrain:true,expedition:true,...extra};l.plats.push(p);j.route.push(p);return p;};
  for(let n=0;n<points.length-1;n++){
   const a=points[n],b=points[n+1],dx=b.x-a.x,dy=b.y-a.y;
   const sky=plan.sky&&a.y<G-180&&b.y<G-180;
   const count=Math.max(1,Math.ceil(Math.abs(dx)/(sky?145:90)),Math.ceil(Math.abs(dy)/40));
   for(let k=0;k<count;k++){
    const t=k/count,x=a.x+dx*t,y=a.y+dy*t;
    if(dy!==0||k===0)platform(x-15,y,dy===0?Math.abs(dx)+15:sky?115:Math.ceil(Math.abs(dx)/count),{routeLeg:n,sky,stair:!sky&&dy!==0,h:dy===0?20:Math.max(6,Math.min(18,Math.abs(dy)/count-3))});
    if(k%3===1)l.coins.push({x:x+25,y:y-46,w:22,h:22,taken:false});
   }
   // Broad safe landings at each turn, goal and checkpoint.
   platform(b.x-15,b.y,115,{routeLanding:true,routeLeg:n});
  }
  j.traversal=j.route.slice();
  platform(start-100,G,210);platform(end-90,G,240);
  for(const [offset,width,label] of plan.rooms){
   const members=j.route.filter(p=>p.x>=start+offset&&p.x<start+offset+width&&!p.sky);
   const room={x:start+offset,w:width,label,tiles:members};j.rooms.push(room);
   for(const p of members){
    const roof={x:p.x,y:p.y-206,w:p.w,h:20,expeditionRoof:true,journeyRoof:true};
    // A lower switchback's roof must never cut through an upper stair or its jump clearance.
    if(!j.route.some(q=>roof.x<q.x+q.w&&roof.x+roof.w>q.x&&roof.y<q.y+5&&roof.y+roof.h>q.y-160))l.plats.push(roof);
   }
  }
  plan.goals.forEach((at,k)=>{
   const p=points[at],node={x:p.x+35,y:p.y-64,w:32,h:54,index:k,held:0,done:false};j.nodes.push(node);
   const cp={x:p.x-20,y:p.y,active:false,expedition:true};l.checkpoints.push(cp);
   l.supplyCaches.push({x:p.x+100,y:p.y-38,w:40,h:38,taken:false});
  });
  if(plan.mode==='clear')for(const node of j.nodes){
   const options=j.traversal.filter(p=>Math.abs(p.x-node.x)>170&&Math.abs(p.x-node.x)<380&&Math.abs(p.y-(node.y+64))<160);
   const p=options.sort((a,b)=>Math.abs(a.x-node.x)-Math.abs(b.x-node.x))[0];
   if(p){const s={x:p.x+25,y:p.y-58,floor:p.y,type:'miner',lo:p.x+8,hi:p.x+p.w-48,spawned:false,expedition:true,defeated:false};node.defender=s;l.stagecraft.spawns.push(s);}
  }
  // Patrols use actual route surfaces, without adding floors across descending stairs.
  for(let n=3;n<j.traversal.length;n+=5){
   const p=j.traversal[n],sx=p.x+40;
   if(l.checkpoints.some(c=>Math.abs(c.x-sx)<160))continue;
   l.stagecraft.spawns.push({x:sx,y:p.y-58,floor:p.y,type:plan.kind,lo:p.x+12,hi:p.x+p.w-48,spawned:false,expedition:true});
  }
  // Additional squads in the original half make the entire level feel populated.
  const existing=l.stagecraft.spawns.filter(s=>s.x<start);
  for(const s of existing.filter((_,n)=>n%2===0)){
   const support=l.plats.find(p=>!p.vx&&!p.vy&&!p.stagecraft&&p.x<=s.x+160&&p.x+p.w>=s.x+220&&Math.abs(p.y-s.floor)<5);
   if(support)l.stagecraft.spawns.push({...s,x:s.x+165,lo:s.x+125,hi:Math.min(support.x+support.w-60,s.x+290),spawned:false});
  }
  l.sections.push(...points.filter((_,n)=>n%2===0).map((p,n)=>({x:p.x,title:`${plan.name} · ${n+1}`})));
  l.height=Math.max(l.height||H,H+1250);l.expeditionPlan=plan;
  l.checkpoints.sort((a,b)=>a.x-b.x);l.sections.sort((a,b)=>a.x-b.x);
  // Place every checkpoint on a genuine static support (also fixes old floating checkpoints).
  for(const c of l.checkpoints){
   if(!l.plats.some(p=>!p.vx&&!p.vy&&!p.expeditionRoof&&p.x<=c.x&&p.x+p.w>=c.x+38&&Math.abs(p.y-c.y)<4))
    platform(c.x-55,c.y,180,{checkpointLanding:true});
  }
  cleanExpeditionPlatforms(l);
  tidyStaticPlatformEdges(l);
 });
}
function updateDistinctJourney(dt){
 const j=level.journey;
 if(!j.introduced&&player.x>j.start-180){j.introduced=true;journeyMessage(j.plan.intro,8500);}
 for(const n of j.nodes){
  if(j.goals[n.index])continue;
  const near=overlap(player,{x:n.x-15,y:n.y-10,w:65,h:80});
  let done=false;
  if(j.plan.mode==='collect')done=near;
  if(j.plan.mode==='clear')done=near&&!!n.defender?.defeated;
  if(j.plan.mode==='land')done=near&&player.onGround&&Math.abs(player.y+player.h-(n.y+64))<12;
  if(j.plan.mode==='valve'){n.held=near&&journeyDuckHeld()?n.held+dt:0;done=n.held>=500;}
  if(j.plan.mode==='beacon')done=near&&j.goals.slice(0,n.index).every(Boolean);
  if(done){j.goals[n.index]=true;n.done=true;sfxBell();journeyMessage(`${j.plan.task} · ${j.goals.filter(Boolean).length}/3`,3000);}
 }
 j.gate.open=j.goals.every(Boolean);
}
function hitDistinctJourney(b){
 const j=level.journey;if(j.plan.mode!=='shoot')return false;
 for(const n of j.nodes)if(!j.goals[n.index]&&overlap({x:b.x-5,y:b.y-5,w:10,h:10},n)){
  j.goals[n.index]=true;n.done=true;j.gate.open=j.goals.every(Boolean);sfxBell();journeyMessage(`RELAY DISABLED · ${j.goals.filter(Boolean).length}/3`,2500);return true;
 }
 return false;
}
function drawDistinctJourneyBackdrop(){
 const j=level.journey;ctx.save();
 for(const room of j.rooms)for(const p of room.tiles){
  const x=p.x-camX;if(x+p.w<0||x>W)continue;
  ctx.fillStyle='#151f29';ctx.fillRect(x,p.y-186,p.w,186);
  ctx.fillStyle=level.expeditionPlan.color;ctx.fillRect(x,p.y-187,p.w,6);
  ctx.fillStyle='#3a414c';ctx.fillRect(x+8,p.y-175,9,175);ctx.fillRect(x+8,p.y-175,p.w-8,8);
  ctx.fillStyle='#e5c486';ctx.fillRect(x+32,p.y-161,9,12);
 }
 ctx.restore();
}
function drawDistinctJourneyObjects(){
 const j=level.journey;
 for(const n of j.nodes){
  const x=n.x-camX;if(x<-80||x>W+80)continue;
  const color=j.goals[n.index]?'#8fcb87':'#ebc66d';
  ctx.fillStyle=color;
  if(j.plan.mode==='land'){
   ctx.fillRect(x+3,n.y,4,64);ctx.fillRect(x+7,n.y+3,29,20);
  }else if(j.plan.mode==='valve'){
   ctx.fillRect(x+12,n.y+33,7,31);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.strokeRect(x,n.y+6,30,30);ctx.fillRect(x+12,n.y+8,6,26);ctx.fillRect(x+2,n.y+18,26,6);
  }else if(j.plan.mode==='beacon'){
   ctx.fillRect(x+3,n.y+28,25,36);ctx.fillRect(x-3,n.y+18,37,13);ctx.fillRect(x+9,n.y+2,13,16);
  }else if(j.plan.mode==='collect'){
   ctx.fillRect(x+7,n.y+8,16,8);ctx.fillRect(x+2,n.y+16,26,28);ctx.fillRect(x+7,n.y+44,16,8);
  }else{
   ctx.fillRect(x,n.y+8,30,38);ctx.fillStyle='#283346';ctx.fillRect(x+5,n.y+13,20,27);
  }
  ctx.fillStyle=j.goals[n.index]?'#8fcb87':'#ebc66d';ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.fillText(j.goals[n.index]?'✓':String(n.index+1),x+15,n.y+34);
  ctx.font='12px sans-serif';ctx.fillStyle='#f2e3be';ctx.fillText(j.plan.mode==='shoot'?'SHOOT':j.plan.mode==='valve'?'CROUCH':j.plan.mode==='land'?'LAND':j.plan.mode==='clear'?'CLEAR MINERS':'COLLECT',x+15,n.y-8);
 }
 for(let i=0;i<j.route.length;i+=5){const p=j.route[i],next=j.route[i+1];if(!next)continue;const x=p.x-camX;if(x<0||x>W)continue;ctx.fillStyle='#d7c897';ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.fillText(next.x<p.x?'←':next.y<p.y?'↗':next.y>p.y?'↘':'→',x+30,p.y-70);}
}

// Keep collision and visible slabs identical: merge flat duplicates, then trim
// slab undersides where a lower stair begins. Machinery keeps its own objects.
function cleanExpeditionPlatforms(l){
 const floors=l.plats.filter(p=>p.expedition).sort((a,b)=>a.y-b.y||a.x-b.x),merged=[];
 for(const p of floors){
  const prior=merged.find(q=>Math.abs(q.y-p.y)<.01&&q.x<=p.x+p.w+.01&&q.x+q.w>=p.x-.01);
  if(prior){const right=Math.max(prior.x+prior.w,p.x+p.w);prior.x=Math.min(prior.x,p.x);prior.w=right-prior.x;prior.h=Math.min(prior.h,p.h);}
  else merged.push({...p});
 }
 for(const p of merged)for(const q of merged){
  if(q.y>p.y+.01&&q.y<p.y+p.h+2&&q.x<p.x+p.w&&q.x+q.w>p.x)p.h=Math.max(2,q.y-p.y-2);
 }
 l.plats=l.plats.filter(p=>!p.expedition).concat(merged);
 l.journey.route=merged;
 for(const room of l.journey.rooms)room.tiles=merged.filter(p=>!p.sky&&p.x<room.x+room.w&&p.x+p.w>room.x);
}

function tidyStaticPlatformEdges(l){
 const moving=new Set(l.stagecraft.hazards.filter(h=>['tilt','ring','counterweight','bucket','crane'].includes(h.type)).flatMap(h=>h.pads));
 const staticSlabs=l.plats.filter(p=>!p.vx&&!p.vy&&!moving.has(p)&&!p.journeyRoof&&p.h<=50);
 for(const p of staticSlabs){
  if(p.y<GROUND_Y-25&&!p.expedition)p.h=Math.min(p.h,18);
  for(const q of l.plats){
   const depth=q.y-p.y;
   if(q!==p&&depth>1&&depth<p.h+1&&q.x<p.x+p.w&&q.x+q.w>p.x)p.h=Math.max(1,depth-1);
  }
 }
}

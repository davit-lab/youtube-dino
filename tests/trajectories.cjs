const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1400,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>1);await page.goto('http://localhost:3000');await page.waitForTimeout(700);
const report=await page.evaluate(()=>{
 const results=[];state.settings.sfxVolume=0;state.settings.highJumpAssist=false;state.upgrades.doubleJump=false;
 for(let n=14;n<20;n++){
  loadLevel(n);state.mode='playing';const original=level,j=level.journey;
  const r={level:n+1,name:j.plan.name,spawns:level.stagecraft.spawns.length,descent:Math.max(...j.route.map(p=>p.y))-GROUND_Y,ascent:GROUND_Y-Math.min(...j.route.map(p=>p.y)),leftTurns:j.traversal.filter((p,i,a)=>i&&p.x<a[i-1].x).length,failures:[]};
  const slabs=level.plats.filter(p=>p.expedition);let overlaps=0;
  for(let a=0;a<slabs.length;a++)for(let b=a+1;b<slabs.length;b++){const p=slabs[a],q=slabs[b];if(p.x<q.x+q.w-.01&&p.x+p.w>q.x+.01&&p.y<q.y+q.h-.01&&p.y+p.h>q.y+.01)overlaps++;}
  r.platformOverlaps=overlaps;
  const mini={...original,stagecraft:null,journey:null,flag:null,obstacles:[],checkpoints:[],coins:[],coinBags:[],supplyCaches:[],relics:[],doors:[],encounters:[],wildlife:[],winds:[],lavas:[],spikes:[],firejets:[],conveyors:[],steamVents:[],crushers:[],birds:[],barrelLanes:[],routes:[]};
  // Each adjacent authored landing is tested with all expedition collision geometry present.
  const route=j.traversal;
  for(let k=0;k<route.length-1;k++){
   const a=route[k],b=route[k+1];if(Math.abs(a.x-b.x)<2&&Math.abs(a.y-b.y)<2)continue;
   level=mini;zombies=[];bullets=[];particles=[];resetPlayer({x:Math.abs(b.x-a.x)>300?(b.x>a.x?a.x+a.w-36:a.x+4):a.x+20,y:a.y-54});player.onGround=true;player.invuln=999999;player.vx=player.vy=0;
   const target=b.x>=a.x?b.x+b.w-36:b.x+5;let reached=false;
   for(let f=0;f<110;f++){
    keys.ArrowRight=player.x<target-5;keys.ArrowLeft=player.x>target+5;
    keys.Space=f===0&&(b.y<a.y-2||(b.x>a.x?b.x-a.x-a.w:a.x-b.x-b.w)>8);
    updatePlayer(16.67);keys.Space=false;
    if(player.onGround&&player.y+player.h<=b.y+10&&player.y+player.h>=b.y-145&&player.x+32>b.x&&player.x<b.x+b.w){reached=true;break;}
    if(player.dead||player.isFalling)break;
   }
   if(!reached)r.failures.push({k,from:[Math.round(a.x-j.start),Math.round(a.y-GROUND_Y)],to:[Math.round(b.x-j.start),Math.round(b.y-GROUND_Y)],actual:[Math.round(player.x-j.start),Math.round(player.y+player.h-GROUND_Y)]});
  }
  level=original;resetJourney(level);state.mode='playing';player.dead=player.isFalling=false;
  for(const node of j.nodes){player.x=node.x;player.y=node.y+64-54;player.w=32;player.h=54;player.onGround=true;keys.ArrowDown=true;
   if(j.plan.mode==='clear'){if(!node.defender)throw Error('missing mine defender');const z=makeStageZombie(node.defender);z.health=0;updateStageZombie(z,16.67,zombies.indexOf(z));}
   if(j.plan.mode==='shoot')hitJourneyTarget({x:node.x+10,y:node.y+20});else for(let t=0;t<20;t++)updateJourney(33);
  }keys.ArrowDown=false;r.goals=j.goals.every(Boolean)&&j.gate.open;
  resetJourney(original,true);r.checkpointRetainsGoals=j.goals.every(Boolean);resetJourney(original,false);r.restartClearsGoals=!j.goals.some(Boolean);results.push(r);
 }
 return results;
});console.log(JSON.stringify(report,null,2));assert.deepEqual(errors,[]);for(const r of report){assert.equal(r.platformOverlaps,0);assert.equal(r.goals,true);assert.equal(r.checkpointRetainsGoals,true);assert.equal(r.restartClearsGoals,true);assert.ok(r.spawns>=15);assert.deepEqual(r.failures,[],`Level ${r.level} route`);}
for(const [n,at,label] of [[14,2,'aqueduct'],[15,6,'sky'],[17,5,'mine'],[19,5,'lighthouse']]){await page.evaluate(({n,at})=>{loadLevel(n);state.mode='playing';const p=EXPEDITION_PLANS[n-14].points[at];resetPlayer({x:level.journey.start+p[0],y:GROUND_Y+p[1]-54});player.onGround=true;camY=player.y-(GROUND_Y-120);loop(performance.now());},{n,at});await page.screenshot({path:`artifacts/trajectory-${label}.png`});}
console.log('PASS distinct trajectories, objective types, replay/checkpoint state, native-physics edges, renders');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});

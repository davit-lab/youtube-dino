/* Gameplay-time respawns share the existing update loop; no background timers. */
const ZombieRespawns = (() => {
  const DELAY_MS=3000;
  let pending=[];
  function reset(){pending=[];}
  function schedule(z){
    const source=z.stageVariant?z.spawn:z.respawnSource;
    if(!source||pending.some(p=>p.source===source))return;
    pending.push({source,remaining:DELAY_MS,level,group:z.group||null,stage:!!z.stageVariant,
      template:z.stageVariant?null:{...z,x:z.respawnX,y:z.respawnY,health:z.maxHealth,vx:0,vy:0,animT:0,facing:1}});
  }
  function encounterOver(p){
    if(!p.group)return false;
    if(p.group==='world-eater')return finalBoss.dead;
    return !!p.level.stagecraft?.hazards.find(h=>h.id===p.group&&h.type==='seal')?.done;
  }
  function update(dt){
    if(state.mode!=='playing'||document.hidden||player.dead||player.isFalling)return;
    for(let i=pending.length-1;i>=0;i--){
      const p=pending[i];
      if(p.level!==level||encounterOver(p)){pending.splice(i,1);continue;}
      p.remaining=Math.max(0,p.remaining-Math.max(0,Math.min(100,dt)));
      if(p.remaining>0)continue;
      if(p.stage){
        // Keep pending spawns out of geometry and respect the existing active budget.
        if(stageAlive().length>=stageTuning().cap||!stageSpawnSafe(p.source))continue;
        if(zombies.some(z=>z.spawn===p.source&&z.health>0)){pending.splice(i,1);continue;}
        p.source.spawned=true;
        makeStageZombie(p.source,p.group);
      }else{
        zombies.push({...p.template});
      }
      pending.splice(i,1);
    }
  }
  function waiting(source){return pending.some(p=>p.source===source);}
  return {schedule,update,reset,waiting,delay:DELAY_MS,get pending(){return pending;}};
})();

/* Ground pursuit crosses connected ledges, but stops at real gaps and walls. */
function moveZombieOnGround(z, targetX) {
  let floor=z.floor ?? z.y+z.h;
  const distance=targetX-z.x,count=Math.max(1,Math.ceil(Math.abs(distance)/5));
  for(let i=0;i<count;i++){
    const x=z.x+distance/count,center=x+z.w/2;
    const support=level.plats.filter(p=>p.enabled!==false&&!p.journeyRoof&&p.y>=floor-48&&p.y<=floor+64&&center>=p.x&&center<=p.x+p.w)
      .sort((a,b)=>Math.abs(a.y-floor)-Math.abs(b.y-floor))[0];
    if(!support)break;
    const body={x,y:support.y-z.h,w:z.w,h:z.h-2};
    if(level.plats.some(p=>p!==support&&p.enabled!==false&&!p.oneWay&&overlap(body,p))||
       (level.doors||[]).some(d=>!d.open&&overlap(body,d))||
       (level.obstacles||[]).some(o=>['crate','crawl'].includes(o.kind)&&overlap(body,o)))break;
    z.x=x;floor=support.y;z.y=floor-z.h;
  }
  if(z.stageVariant)z.floor=floor;
}

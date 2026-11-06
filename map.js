const TILE_W = 62, TILE_H = 32;
function polygon(ctx, points, fill, stroke="#263a39") {
  ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=stroke; ctx.lineWidth=1; ctx.stroke();
}
function diamond(ctx,x,y,w,h,color) { polygon(ctx,[[x,y-h/2],[x+w/2,y],[x,y+h/2],[x-w/2,y]],color); }
function building(ctx,x,y,type,variant=0) {
  const colors = type==="farm"?["#b99c61","#d3b56b"]:type==="factory"?["#806b60","#b96b55"]:["#6d8880","#83a6a0"];
  const w=32,h=22,z=variant%3*3;
  polygon(ctx,[[x-w/2,y-z],[x,y-h-z],[x+w/2,y-z],[x,y+h-z]],colors[0]);
  polygon(ctx,[[x-w/2,y-z],[x,y-h-z],[x,y-h/2-z],[x-w/2,y+h/2-z]],colors[1]);
  polygon(ctx,[[x,y-h-z],[x+w/2,y-z],[x+w/2,y+h/2-z],[x,y-z]],colors[0]);
  polygon(ctx,[[x-w/2,y-h-z],[x,y-h-12-z],[x+w/2,y-h-z],[x,y-h/2-z]],"#b8a58b");
  if(type==="factory"){
    ctx.fillStyle="#a9b1a9";ctx.fillRect(x+8,y-h-23-z,5,18);ctx.fillStyle="#71817c";ctx.fillRect(x+10,y-h-27-z,9,5);
  } else if(type==="farm"){
    ctx.fillStyle="#5c694e";ctx.fillRect(x-4,y-7-z,8,9);
  } else {
    ctx.fillStyle="#d6c9a7";ctx.fillRect(x-4,y-9-z,8,13);
  }
}
export function drawMap(canvas,state) {
  const rect=canvas.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));
  const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
  const W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);
  const cols=10,rows=9,ox=W/2,oy=H*.47;
  // River and distant terrain
  ctx.fillStyle="#34565a";ctx.beginPath();ctx.moveTo(0,H*.16);ctx.bezierCurveTo(W*.35,H*.25,W*.48,H*.02,W,H*.18);ctx.lineTo(W,H*.34);ctx.bezierCurveTo(W*.6,H*.17,W*.3,H*.42,0,H*.31);ctx.fill();
  ctx.fillStyle="#71806a";ctx.globalAlpha=.14;ctx.fillRect(0,H*.72,W,H*.28);ctx.globalAlpha=1;
  for(let sum=0;sum<cols+rows-1;sum++){
    for(let x=0;x<cols;x++){
      const y=sum-x;if(y<0||y>=rows)continue;
      const px=ox+(x-y)*TILE_W/2, py=oy+(x+y)*TILE_H/2;
      const shade=((x*7+y*3)%5)*2;
      diamond(ctx,px,py,TILE_W,TILE_H,`rgb(${70+shade},${91+shade},${72+shade})`);
      if((x+y)%4===0) {
        ctx.fillStyle="#a2aa8b";ctx.globalAlpha=.18;ctx.fillRect(px-1,py-2,2,4);ctx.globalAlpha=1;
      }
    }
  }
  // A small town cluster, scaled to available canvas
  const scale=Math.min(1,W/760,H/470);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);ctx.translate(-ox,-oy);
  const positions=[];
  for(let i=0;i<state.farms;i++)positions.push({x:ox-190+(i%3)*62,y:oy+10+Math.floor(i/3)*42,t:"farm"});
  for(let i=0;i<state.factories;i++)positions.push({x:ox+65+(i%2)*65,y:oy+5+Math.floor(i/2)*48,t:"factory"});
  for(let i=0;i<state.civic;i++)positions.push({x:ox-20+(i%2)*54,y:oy-90+Math.floor(i/2)*45,t:"civic"});
  positions.sort((a,b)=>a.y-b.y).forEach((p,i)=>building(ctx,p.x,p.y,p.t,i));
  // Roads
  ctx.strokeStyle="#c2b18a";ctx.globalAlpha=.55;ctx.lineWidth=4;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(ox-245,oy+100);ctx.lineTo(ox-80,oy+25);ctx.lineTo(ox+80,oy+45);ctx.lineTo(ox+220,oy-40);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  ctx.restore();
  // Snow specks
  ctx.fillStyle="#dce5dc";ctx.globalAlpha=.45;
  for(let i=0;i<38;i++){const x=(i*97%Math.max(1,W)),y=(i*53%Math.max(1,H));ctx.fillRect(x,y,1.5,1.5);}
  ctx.globalAlpha=1;
  ctx.fillStyle="#e0d7c1";ctx.font="10px monospace";ctx.fillText("VOLGA REGION",16,22);
}

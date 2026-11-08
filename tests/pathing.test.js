const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:700,height:450}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(__dirname,'pathing-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');await d('setTime',0.0);await d('godmode');
const A=await d('arena');console.log('arena',A);check('flat arena built',!!A);
const [X,Z,H]=A;
async function trial(name,wallH,half,wallZ,expectReach){
  await d('wall',X,Z,H,wallZ,half,wallH);
  await p.evaluate(([X,Z,H])=>{const D=window.__debug;D.tp(X+0.5,H+0.01,Z+0.5);D.spawn(X+0.5,H,Z-8);},[X,Z,H]);
  let min=99;const t0=Date.now();let last=null;
  while(Date.now()-t0<28000){await p.waitForTimeout(500);const m=await d('mob'),pp=await d('ppos');if(!m)break;last=m;min=Math.min(min,Math.hypot(m.x-pp[0],m.z-pp[2]));if(min<1.3)break;}
  console.log(name,'closest',min.toFixed(2),JSON.stringify(last));
  check(name,expectReach?min<1.6:true,'closest '+min.toFixed(2));
  await d('clearWall',X,Z,H,wallZ,half,wallH);
}
await trial('crawler climbs a one-block step',1,8,-4,true);
await trial('crawler walks around a short two-block wall',2,2,-4,true);
await trial('crawler walks around a medium two-block wall',2,4,-4,true);
check('no page errors',errs.length===0,errs.join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

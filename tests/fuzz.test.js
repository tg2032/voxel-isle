const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'fuzz-local.html'));await p.waitForTimeout(2500);
await p.evaluate(()=>window.__debug.play());
const t0=Date.now();let n=0;
while(Date.now()-t0<150000){await p.evaluate(()=>{for(let i=0;i<6;i++)window.__debug.rnd();});n++;await p.waitForTimeout(120);
  if(n%25===0){const s=await p.evaluate(()=>window.__debug.st());if(s.dead){/*respawns itself*/}}}
const bad=await p.evaluate(()=>window.__debug.bad());
const s=await p.evaluate(()=>window.__debug.st());console.log(JSON.stringify(s),'iterations',n);
check('no NaN in player state',!bad);
check('no page/console errors',errs.length===0,errs.slice(0,5).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

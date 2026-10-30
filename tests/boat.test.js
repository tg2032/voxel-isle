const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'boat-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
const deep=await d('deep');console.log('deep water',deep);check('found open water',!!deep);
const sea=await d('sea');
await p.evaluate(([w,s])=>window.__debug.tp(w[0]+0.5,s-0.8,w[1]+0.5),[deep,sea]);
check('touch boat button hidden until a boat exists',(await d('tboat'))===true);
await p.evaluate(()=>window.__debug.toggle());check('cannot board without a boat',(await d('on'))===false&&/Craft a boat/.test(await d('toast')||''));
await d('give','wood',6);check('craft boat (6 wood)',(await d('craft','boat'))===true&&(await d('inv','boat'))===1&&(await d('inv','wood'))===0);
check('touch boat button appears',(await d('tboat'))===false);
// land: cannot board
const land=await d('land');await p.evaluate(([l])=>window.__debug.tp(l[0]+0.5,l[2]+0.5,l[1]+0.5),[land]);await p.waitForTimeout(300);
await p.evaluate(()=>window.__debug.toggle());check('cannot board on land',(await d('on'))===false&&/in water/.test(await d('toast')||''),await d('toast'));
// board
await p.evaluate(([w,s])=>window.__debug.tp(w[0]+0.5,s-0.8,w[1]+0.5),[deep,sea]);await p.waitForTimeout(200);
await p.evaluate(()=>{window.__debug.setOxygen(10);window.__debug.toggle();});
check('boards in water',(await d('on'))===true&&(await d('meshVisible')));
await p.waitForTimeout(800);const pos=await d('pos');
check('floats at the surface',Math.abs(pos[1]-(sea-0.1))<0.15,pos[1].toFixed(2));
check('boat keeps oxygen refilling',(await d('oxygen'))>10.5,await d('oxygen'));
// speed
await p.evaluate(()=>window.__debug.kd('KeyW'));const a=await d('pos');const t0=Date.now();await p.waitForTimeout(900);const c=await d('pos');await p.evaluate(()=>window.__debug.ku('KeyW'));
const v=Math.hypot(c[0]-a[0],c[2]-a[2])/((Date.now()-t0)/1000);console.log('boat speed',v.toFixed(2));
check('boat moves',v>0.5&&(await d('on')));
// presence + remote boat
await d('mockPeers',[{id:'x1',pr:{x:20.5,y:5,z:20.5,yaw:0,dead:false,b:1}},{id:'x2',pr:{x:22.5,y:5,z:20.5,yaw:0,dead:false}}]);const mine=await d('sendNow');await p.waitForTimeout(1200);
check('presence flag b is 1 in a boat',mine&&mine.b===1,JSON.stringify(mine&&mine.b));
check('remote player in a boat shows one',(await d('boatOf','x1'))===true&&(await d('boatOf','x2'))===null);
await d('setPeer','x1',{x:20.5,y:5,z:20.5,yaw:0,dead:false,b:0});await p.waitForTimeout(800);check('remote boat disappears when they leave it',(await d('boatOf','x1'))===false);
// get out manually, and auto-dismount on shore
await p.evaluate(()=>window.__debug.toggle());check('R gets you out',(await d('on'))===false);
await p.evaluate(()=>window.__debug.toggle());check('can board again',(await d('on'))===true);
await p.evaluate(([l])=>window.__debug.tp(l[0]+0.5,l[2]+0.5,l[1]+0.5),[land]);await p.waitForTimeout(700);
check('leaving the water auto-dismounts',(await d('on'))===false);
check('no page/console errors',errs.length===0,errs.slice(0,4).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'fishing-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
const w=await d('deep');const sea=4;
const faceWater=()=>p.evaluate(([w])=>window.__debug.stage(w[0]+0.5,4.5,w[1]+0.9,0,-0.45),[w]);
await faceWater();await p.evaluate(()=>window.__debug.press());
check('casting without a rod asks you to craft one',(await d('phase'))===null&&/Craft a fishing rod/.test(await d('toast')||''));
check('cast button hidden until you own a rod',(await d('tfish'))===true);
await d('give','wood',2);await d('give','leaves',3);check('rod needs 3 wood',(await d('craft','rod'))===false);
await d('give','wood',3);check('craft a rod',(await d('craft','rod'))===true&&(await d('inv','rod'))===1);
check('cast button appears',(await d('tfish'))===false);
// looking at the sky: no cast
await p.evaluate(([w])=>{window.__debug.stage(w[0]+0.5,4.5,w[1]+0.9,0,0.4);window.__debug.press();},[w]);
check('cannot cast at the sky',(await d('phase'))===null&&/open water/.test(await d('toast')||''),await d('toast'));
// cast
await p.evaluate(([w])=>{window.__debug.stage(w[0]+0.5,4.5,w[1]+0.9,0,-0.45);window.__debug.press();},[w]);
check('cast: waiting for a bite, bobber visible',(await d('phase'))==='wait'&&(await d('bobberVisible')));
await p.evaluate(()=>{window.__debug.forceWait();window.__debug.press();});
check('pulling early gives nothing and resets',(await d('phase'))===null&&/Too early/.test(await d('toast')||'')&&(await d('bobberVisible'))===false);
// bite and catch
await p.evaluate(([w])=>{const D=window.__debug;D.stage(w[0]+0.5,4.5,w[1]+0.9,0,-0.45);D.press();D.forceBite();},[w]);
check('bite',(await d('phase'))==='bite');
const before=JSON.parse(await d('food')).fish+await d('inv','gold')+await d('inv','emerald')+await d('inv','diamond')+await d('inv','leaves');
await p.evaluate(()=>window.__debug.press());
const after=JSON.parse(await d('food')).fish+await d('inv','gold')+await d('inv','emerald')+await d('inv','diamond')+await d('inv','leaves');
check('catching something ends the cast and gives one item',after===before+1&&(await d('phase'))===null,await d('toast'));
// missed bite
await p.evaluate(([w])=>{const D=window.__debug;D.stage(w[0]+0.5,4.5,w[1]+0.9,0,-0.45);D.press();D.forceBite();D.expire();},[w]);
await p.waitForTimeout(500);check('a missed bite: the fish gets away',(await d('phase'))===null&&/got away/.test(await d('toast')||''),await d('toast'));
// loot table
const c=await d('rig',2000);console.log('2000 catches',JSON.stringify(c));
check('loot table: mostly fish, rare treasure',c.fish>1600&&c.fish<1850&&c.gold>100&&c.emerald>30&&c.diamond>5&&c.diamond<50,JSON.stringify(c));
const ef=await d('eatFish');check('fish is food (+5 hunger)',Math.abs(ef[0]-10)<0.3&&ef[1]===1,JSON.stringify(ef));
check('no page/console errors',errs.length===0,errs.slice(0,3).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

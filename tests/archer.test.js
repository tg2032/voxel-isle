const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:700,height:450}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'archer-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');await d('setTime',0.0);
const A=await d('arena');const [X,Z,H]=A;console.log('arena',A);
check('night spawns include archers, never more than 2',await (async()=>{const r=await d('spawnNight');const n=+r.split('/')[0];return n>=0&&n<=2;})());
await p.evaluate(([X,Z,H])=>{const D=window.__debug;D.tp(X+0.5,H+0.01,Z+0.5);D.setHp(20);},[X,Z,H]);
const a=await p.evaluate(([X,Z,H])=>window.__debug.archer(X+0.5,H,Z-9),[X,Z,H]);
check('archer: recognised from its max health, tinted, holds a bow',a.archer&&a.mat&&a.bow>=1,JSON.stringify(a));
// let it work: it should close to bow range and shoot
let minD=99,maxA=0,t0=Date.now(),hpMin=20;
while(Date.now()-t0<30000){await p.waitForTimeout(400);const m=await d('mob'),pp=await d('pp');if(!m)break;const dd=Math.hypot(m.x-pp[0],m.z-pp[1]);minD=Math.min(minD,dd);maxA=Math.max(maxA,await d('arrows'));hpMin=Math.min(hpMin,await d('hp'));if(hpMin<20&&maxA>0)break;}
console.log('closest',minD.toFixed(1),'max arrows',maxA,'hp min',hpMin);
check('it shoots arrows',maxA>0);
check('it keeps bow range: closes to about 5-9 blocks but never to melee range',minD>3.5&&minD<10.5,minD.toFixed(2));
check('its arrows hurt the player',hpMin<20,String(hpMin));
// visual-only arrows (what other clients see) do no damage
await d('clear');await p.evaluate(([X,Z,H])=>{const D=window.__debug;D.tp(X+0.5,H+0.01,Z+0.5);D.setHp(20);},[X,Z,H]);
await d('visualArrow');await p.waitForTimeout(2500);check('arrows spawned by a remote host never damage you locally',(await d('hp'))===20,String(await d('hp')));
// a wall between archer and player blocks the shot (line of sight)
await d('clear');await p.evaluate(([X,Z,H])=>{const D=window.__debug;D.tp(X+0.5,H+0.01,Z+0.5);D.setHp(20);D.archer(X+0.5,H,Z-9);D.wall(X,Z,H,-4,5,4);},[X,Z,H]);
const blocked=await d('tryShoot');check('no shot through a solid wall',blocked[0]===false&&blocked[1]===0,JSON.stringify(blocked));
await d('clearWall',X,Z,H,-4,5,4);const open=await d('tryShoot');check('clear line of sight: it shoots',open[0]===true&&open[1]===1,JSON.stringify(open));
check('no page/console errors',errs.length===0,errs.slice(0,3).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

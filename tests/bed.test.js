const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' @'+String(e.stack).split('\n').slice(1,3).join(';')));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'bed-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
check('bed geometry exists and slot 13 is the bed',(await d('geoOk'))&&(await d('items'))[12]==='bed');
await d('give','wood',2);await d('give','leaves',6);check('bed needs 3 wood + 6 leaves',(await d('craft','bed'))===false);
await d('give','wood',3);check('craft bed',(await d('craft','bed'))===true&&(await d('inv','bed'))===1&&(await d('inv','leaves'))===0);
const [fx,fz,fh]=await d('flat');
await p.evaluate(([x,z,h])=>{const D=window.__debug;D.clearMobs();D.sel(12);D.tp(x+0.5,h+0.01,z+2.5);D.look(0,-0.9);D.sync();D.place();},[fx,fz,fh]);
const tgt=await p.evaluate(([x,z,h])=>{const D=window.__debug;return [D.at(x,h,z+1),D.at(x,h,z),D.at(x,h,z+2)];},[fx,fz,fh]);
// find where the bed landed
let bed=null;for(const [dx,dz] of [[0,0],[0,1],[0,-1]]){if((await d('at',fx+dx,fh,fz+dz))==='bed')bed=[fx+dx,fh,fz+dz];}
console.log('bed at',bed,JSON.stringify(tgt));
check('bed placed',!!bed&&(await d('inv','bed'))===0);
if(!bed){console.log('FAILED');await b.close();return;}
// daytime: only sets the respawn point
await d('setTime',0.5);await d('useBed',...bed);
check('daytime: respawn point set, no sleeping',JSON.stringify(await d('bedPos'))===JSON.stringify(bed)&&(await d('sleeping'))===false&&/only sleep at night/.test(await d('toast')||''),await d('toast'));
check('daytime stays daytime',Math.abs((await d('time'))-0.5)<0.01);
// night with a monster next to the bed
await d('setTime',0.0);await d('crawler',bed[0]+3.5,bed[1],bed[2]+0.5);await p.evaluate(([b])=>window.__debug.tp(b[0]+0.5,b[1]+0.01,b[2]+1.5),[bed]);
await d('useBed',...bed);check('cannot sleep with a monster nearby',(await d('sleeping'))===false&&/monsters nearby/.test(await d('toast')||''),await d('toast'));
// night, clear: sleep
await d('clearMobs');await d('setHp',5);await d('setTime',0.0);await d('useBed',...bed);
check('sleep starts: screen fades out',(await d('sleeping'))===true);
await p.waitForTimeout(1600);
check('morning: the sun is up and health restored',(await d('sun'))>0.2&&(await d('hp'))>=20,`sun ${await d('sun')} hp ${await d('hp')}`);
await p.waitForTimeout(2200);check('fade is gone afterwards',(await d('sleeping'))===false&&(await d('fadeOn'))===false);
// a roof right above the bed makes it unsafe: respawn falls back to the island centre
await d('setBlock',bed[0],bed[1]+1,bed[2],'stone');await p.evaluate(()=>window.__debug.tp(2.5,12,2.5));await d('kill');await p.waitForTimeout(2500);
const unsafe=await d('pos');check('bed with a block over it is not used for respawn',Math.hypot(unsafe[0]-(bed[0]+0.5),unsafe[2]-(bed[2]+0.5))>3,JSON.stringify(unsafe));
await d('setBlock',bed[0],bed[1]+1,bed[2],null);await d('useBed',...bed);await p.waitForTimeout(100);
// respawn at the bed
await p.evaluate(()=>window.__debug.tp(2.5,12,2.5));await d('kill');check('died',(await d('dead'))===true);
await p.waitForTimeout(2500);const rp=await d('pos');
check('respawn at the bed',Math.hypot(rp[0]-(bed[0]+0.5),rp[2]-(bed[2]+0.5))<1.2&&(await d('dead'))===false,JSON.stringify(rp));
// saved
await d('save');await p.reload();await p.waitForTimeout(2500);
check('bed location survives a reload',JSON.stringify(await p.evaluate(()=>JSON.parse(localStorage.getItem('voxelSave1')).bed))===JSON.stringify(bed));
check('no page/console errors',errs.length===0,errs.slice(0,4).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

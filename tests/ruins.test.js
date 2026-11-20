const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'ruins-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
const ruins=JSON.parse(await d('ruins'));console.log('ruins',JSON.stringify(ruins));
check('3 ruins were generated',ruins.length===3);
for(const [x,y,z] of ruins){
  check(`ruin at ${x},${z}: chest in the middle marked as a ruin chest`,(await d('at',x,y,z))==='chest'&&(await d('chestKind',x,y,z))===2);
  check('   walls are stone, corners 3 high',(await d('at',x-2,y+2,z-2))==='stone'&&(await d('at',x+2,y+2,z+2))==='stone');
  check('   ground is on land above sea level',(await d('base',x,z))>=6);
}
check('the ruins can be entered (a gap in the wall)',(await d('reach')).every(Boolean),JSON.stringify(await d('reach')));
const [x0,y0,z0]=ruins[0];
const rich=JSON.parse(await d('loot',x0,y0,z0)),plain=JSON.parse(await d('plain',x0,y0,z0));
check('ruin loot is richer: more gold and diamond, plus emeralds and apples',rich.gold>=plain.gold+6&&rich.diamond>=plain.diamond+2&&rich.emerald>=2&&rich.apple>=1,JSON.stringify(rich));
await d('openChest',x0,y0,z0);const rows=await d('rows');console.log(rows.join(', '));
check('opening shows the rich loot',rows.some(r=>r.startsWith('Emerald:'))&&rows.some(r=>r.startsWith('Golden Apple:')));
await p.reload();await p.waitForTimeout(2500);
check('ruins are identical after a reload (deterministic)',await d('ruins')===JSON.stringify(ruins));
check('no page/console errors',errs.length===0,errs.slice(0,3).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

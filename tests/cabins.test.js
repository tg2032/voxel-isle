const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'ruins-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
const cabins=JSON.parse(await d('cabins')),ruins=JSON.parse(await d('ruins'));console.log('cabins',JSON.stringify(cabins));
check('at least one cabin was generated (the island has little flat dry land)',cabins.length>=1);
check('cabins keep their distance from ruins and each other',cabins.every(c=>ruins.concat(cabins.filter(o=>o!==c)).every(o=>Math.hypot(o[0]-c[0],o[2]-c[2])>=8)));
for(const [x,y,z] of cabins){
  check(`cabin at ${x},${z}: wooden walls 3 high, roof over the middle`,(await d('at',x-2,y,z-2))==='wood'&&(await d('at',x+2,y+2,z+2))==='wood'&&(await d('at',x,y+3,z))==='wood');
  check('   furnished: chest (supplies), bed and a torch',(await d('chestKind',x-1,y,z-1))===3&&(await d('at',x+1,y,z+1))==='bed'&&(await d('at',x+1,y,z-1))==='torch');
}
check('every cabin has a 2-high door gap',(await d('cabinDoor')).every(Boolean),JSON.stringify(await d('cabinDoor')));
const [cx,cy,cz]=cabins[0];
const loot=JSON.parse(await d('cabinLoot',cx-1,cy,cz-1));check('cabin chest holds basic supplies',loot.wood>=6&&loot.torch>=4&&loot.arrows>=6&&loot.apple===1&&!loot.diamond&&!loot.emerald,JSON.stringify(loot));
// sleep in the cabin bed at night
await d('setTime',0.0);await d('clearMobs');await p.evaluate(([x,y,z])=>window.__debug.tp(x+0.5,y+0.01,z+0.5),[cx,cy,cz]);
await d('useBed',cx+1,cy,cz+1);
check('the cabin bed works: you sleep until morning and it becomes your spawn',(await d('sleeping'))===true&&JSON.stringify(await d('bedPos'))===JSON.stringify([cx+1,cy,cz+1]));
await p.reload();await p.waitForTimeout(2500);
check('cabins are identical after a reload',await d('cabins')===JSON.stringify(cabins));
check('no page/console errors',errs.length===0,errs.slice(0,3).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

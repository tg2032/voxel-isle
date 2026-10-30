const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const ctx=await b.newContext({viewport:{width:800,height:500}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'smoke-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
// world
for(const t of ['gold_ore','diamond_ore','emerald_ore','lava','bedrock','chest']) check('world has '+t,(await d('count',t))>0);
check('treasure chests registered',(await d('wc'))>0);
check('hotbar has 12 items',(await d('items')).length===12);
// every recipe is craftable with enough materials and has an effect
const ids=await d('recipes');console.log(ids.join(','));
for(const m of ['wood','stone','gold','diamond','emerald','leaves']) await d('give',m,200);
let okAll=true;const bad=[];for(const id of ids){const r=await d('craft',id);if(!r){okAll=false;bad.push(id);}}
check('every recipe craftable ('+ids.length+')',okAll,bad.join(','));
check('gear reached top tiers',JSON.stringify(await d('tiers'))==='[2,2,2,4]',JSON.stringify(await d('tiers')));
check('charm + apple + seeds in pack',(await d('inv','charm'))>=1&&(await d('inv','apple'))>=1&&(await d('inv','sprout'))>=4);
// survival
await d('give','charm',1);await d('hit',200,true);check('charm saves from lethal damage',!(await d('dead'))&&(await d('inv','charm'))===0);
await p.waitForTimeout(4200);await d('give','apple',1);await d('setHp',3);await d('apple');check('golden apple heals',(await d('hp'))===13,await d('hp'));
// armor reduces
await d('setHp',20);await d('hit',10,false,'crawler');const afterHit=await d('hp');check('armor+shield reduce enemy damage',afterHit>=16,afterHit);
// mining speeds
check('diamond pickaxe mines stone faster than hand',(await d('mineNeed','stone','pickaxe'))<(await d('mineNeed','stone','grass')));
check('emerald harder than diamond',(await d('mineNeed','emerald_ore','sword'))>(await d('mineNeed','diamond_ore','sword')));
// boss
check('boss spawns big with 160 HP and dies to damage',(await d('bossCycle'))==='ok');
// gear validation
check('gear validator accepts good, rejects bad',JSON.stringify(await d('parse',[1,2,1,9,4]))==='[1,2,1,9,4]'&&(await d('parse',[9,0,0,0,0]))===null&&(await d('parse','x'))===null);
await d('saveReload');
check('no page/console errors',errs.length===0,errs.slice(0,4).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

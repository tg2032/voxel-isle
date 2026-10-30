const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
let fails=0;const check=(n,ok,x='')=>{if(!ok)fails++;console.log(`${ok?'PASS':'FAIL'}  ${n} ${x}`);};
const p=await (await b.newContext({viewport:{width:800,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text());});
await p.goto('file://'+path.resolve(__dirname,'features-local.html'));await p.waitForTimeout(2500);
const d=(f,...a)=>p.evaluate(([f,a])=>window.__debug[f](...a),[f,a]);
await d('play');
/* ---- farming ---- */
const [ox,oz,oh]=await d('flat');
const aim=()=>p.evaluate(([x,z,h])=>{const D=window.__debug;D.tp(x+0.5,h+0.01,z+2.5);D.look(0,-0.9);D.sync();return D.tgt();},[ox,oz,oh]);
const t=await aim();const x=t[0],z=t[2],h=t[1]+1;
await d('sel',11);await d('give','sprout',3);await aim();await d('place');
check('seeds plant on grass',(await d('at',x,h,z))==='sprout'&&(await d('inv','sprout'))===2);
await d('setBlock',x+1,h-1,z,'stone');await p.evaluate(([x,z,h])=>{const D=window.__debug;D.tp(x+1.5,h+0.01,z+2.5);D.look(0,-0.9);D.sync();},[ox,oz,oh]);
const st=await d('tgt');await d('setBlock',st[0],st[1],st[2],'stone');await d('place');
check('seeds refuse stone',(await d('at',st[0],st[1]+1,st[2]))===null&&(await d('inv','sprout'))===2);
await d('scan');await d('age',60000);check('still a seedling after 60 s',(await d('at',x,h,z))==='sprout');
await d('age',60000);check('ripens to wheat',(await d('at',x,h,z))==='wheat');
await p.evaluate(([x,z,h])=>{const D=window.__debug;D.sel(0);D.tp(x+0.5,h+0.01,z+2.5);D.look(0,-0.5);D.sync();D.hold(true);},[ox,oz,oh]);
await p.waitForTimeout(2500);await d('hold',false);await p.waitForTimeout(1200);
check('harvest removes the crop',(await d('at',x,h,z))===null);
check('wheat is food',(await d('setFood',2),await d('setHunger',5),await d('eat'),Math.abs((await d('hunger'))-9)<0.3));
await d('setBlock',x+4,h,z,'sprout');await d('setBlock',x+4,h-1,z,'dirt');await d('scan');await d('setBlock',x+4,h-1,z,null);await d('scan');
check('crop without soil is uprooted',(await d('at',x+4,h,z))===null);
/* ---- shared chests ---- */
await d('mockDb');const k=(await d('wc'))[0];const [cx,cy,cz]=k.split(',').map(Number);
await d('openChest',cx,cy,cz);await d('chestClick','chest',0,1);
let sets=await d('sets');check('taking from a chest pushes it to the db',sets.length===1&&sets[0][0]==='chests/'+k.replace(/,/g,'_'),JSON.stringify(sets[0]));
await d('remoteChest',{k,items:{diamond:3}});check('a remote update refreshes the open chest',/Diamond:3/.test((await d('chestRows')).join()));
await d('remoteChest',{k:'999,1,1',items:{gold:1}});await d('remoteChest',null);check('junk chest updates are ignored',(await d('chestData','999,1,1'))===null);
/* ---- HUD: target label, position readout ---- */
await d('setBlock',ox,oh+1,oz-3,'chest');
await p.evaluate(([x,z,h])=>{const D=window.__debug;D.tp(x+0.5,h+0.01,z+0.5);D.look(0,0);D.sync();},[ox,oz,oh]);await p.waitForTimeout(1500);
check('label names the chest and how to open it',/Chest .* open/.test(await d('label')||''),await d('label'));
await p.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV'})));await p.waitForTimeout(1200);
check('V shows coordinates and heading',/^X \d+\s+Y \d+\s+Z \d+\s+(N|NE|E|SE|S|SW|W|NW)/.test(await d('posText')||''),await d('posText'));
/* ---- sprint ---- */
await p.evaluate(([x,z,h])=>{const D=window.__debug;D.setBlock(x,h+1,z-3,null);D.setHunger(18);D.kd('KeyW');D.kd('ShiftLeft');},[ox,oz,oh]);await p.waitForTimeout(700);
check('Shift+W sprints and widens the FOV',(await d('sprinting'))===true&&(await d('fov'))>70.5);
await d('setHunger',3);await p.waitForTimeout(400);check('no sprint when nearly starving',(await d('sprinting'))===false);
check('no page/console errors',errs.length===0,errs.slice(0,4).join('|'));
console.log(fails?'FAILED':'ALL PASSED');await b.close();})();

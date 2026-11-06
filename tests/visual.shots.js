const { chromium } = require('playwright');
const S=(process.argv[2]||'.')+'/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const p=await (await b.newContext({viewport:{width:900,height:520}})).newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+require('path').resolve(__dirname,'visual-local.html'));await p.waitForTimeout(2500);
const f=await p.evaluate(()=>window.__debug.flat());console.log('flat',f);
// boss + crawler at night
await p.evaluate(([f])=>{const D=window.__debug;D.play();D.setTime(0.0);D.tp(f[0]+0.5,f[2]+0.01,f[1]+0.5);D.look(0,-0.05);D.boss(f[0]+0.5,f[2],f[1]-7);D.crawler(f[0]-2.5,f[2],f[1]-5);D.freeze();D.posOn();D.apple();},[f]);
await p.waitForTimeout(2500);await p.screenshot({path:S+'v-boss.png'});
// crops + chest + torch daytime
await p.evaluate(([f])=>{const D=window.__debug;D.setTime(0.5);D.tp(f[0]+0.5,f[2]+0.01,f[1]+0.5);D.look(0,-0.35);for(let i=-2;i<=2;i++){D.setBlock(f[0]+i,f[2],f[1]-3,i%2?'sprout':'wheat');}D.setBlock(f[0]+3,f[2],f[1]-3,'chest');D.setBlock(f[0]-3,f[2],f[1]-3,'emerald_ore');D.setBlock(f[0]-4,f[2],f[1]-3,'gold_ore');},[f]);
await p.waitForTimeout(2000);await p.screenshot({path:S+'v-farm.png'});
await b.close();})();

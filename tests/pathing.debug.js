window.__debug={play:function(){locked=true;syncOverlay();},
 setTime:function(t){dayElapsed=t*DAY_LENGTH;updateSky(0);},
 arena:function(){var best=null;for(var x=8;x<34&&!best;x++)for(var z=14;z<36&&!best;z++){var ok=true,hmax=0;for(var dx=-8;dx<=8;dx++)for(var dz=-12;dz<=2;dz++){var h=terrainHeightAt(x+dx,z+dz);if(h<SEA_LEVEL+1)ok=false;if(h>hmax)hmax=h;}if(ok)best=[x,z,hmax];}
  if(!best)return null;var X=best[0],Z=best[1],H=best[2];
  for(var dx=-8;dx<=8;dx++)for(var dz=-12;dz<=2;dz++){var top=terrainHeightAt(X+dx,Z+dz);for(var y=top;y<H;y++){if(!blockAt.has(key(X+dx,y,Z+dz)))addBlock('stone',X+dx,y,Z+dz);}
   for(var y2=H;y2<H+3;y2++){if(blockAt.has(key(X+dx,y2,Z+dz)))removeBlock(X+dx,y2,Z+dz);}}
  return best;},
 wall:function(X,Z,H,z,half,h){for(var dx=-half;dx<=half;dx++)for(var y=H;y<H+h;y++)addBlock('stone',X+dx,y,Z+z);},
 clearWall:function(X,Z,H,z,half,h){for(var dx=-half;dx<=half;dx++)for(var y=H;y<H+h;y++)if(blockAt.has(key(X+dx,y,Z+z)))removeBlock(X+dx,y,Z+z);},
 tp:function(x,y,z){player.pos.set(x,y,z);player.vel.set(0,0,0);},
 godmode:function(){invulnUntil=performance.now()+1e9;player.maxHp=9999;player.hp=9999;},
 spawn:function(x,y,z){monsters.slice().forEach(removeMob);var m=createMob(9100,x,y,z,29,'crawler');m.speed=2.5;m.dmg=1;return true;},
 mob:function(){var m=monsters.filter(function(q){return q.id===9100;})[0];return m?{x:m.x,y:m.y,z:m.z,side:m.steerSide||0}:null;},
 trace:function(n){window.__tr=[];var c=0;function f(){var m=monsters.filter(function(q){return q.id===9100;})[0];if(m)window.__tr.push([+m.x.toFixed(3),+m.z.toFixed(3),m.steerSide||0]);if(++c<n)requestAnimationFrame(f);}f();}, gettrace:function(){return window.__tr;}, ppos:function(){return [player.pos.x,player.pos.y,player.pos.z];}};

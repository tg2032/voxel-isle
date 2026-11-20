window.__debug={play:function(){locked=true;syncOverlay();},
 setTime:function(t){dayElapsed=t*DAY_LENGTH;updateSky(0);},
 arena:function(){worldRuins.forEach(function(r){for(var dx=-2;dx<=2;dx++)for(var dz=-2;dz<=2;dz++)for(var y=r[1];y<r[1]+4;y++)if(blockAt.has(key(r[0]+dx,y,r[2]+dz)))removeBlock(r[0]+dx,y,r[2]+dz);});var best=null;for(var x=8;x<34&&!best;x++)for(var z=14;z<36&&!best;z++){var ok=true,hmax=0;for(var dx=-5;dx<=5;dx++)for(var dz=-10;dz<=2;dz++){var h=terrainHeightAt(x+dx,z+dz);if(h<SEA_LEVEL+1)ok=false;if(h>hmax)hmax=h;}if(ok)best=[x,z,hmax];}
  if(!best)return null;var X=best[0],Z=best[1],H=best[2];
  for(var dx=-5;dx<=5;dx++)for(var dz=-10;dz<=2;dz++){var top=terrainHeightAt(X+dx,Z+dz);for(var y=top;y<H;y++){if(!blockAt.has(key(X+dx,y,Z+dz)))addBlock('stone',X+dx,y,Z+dz);}
   for(var y2=H;y2<H+3;y2++){if(blockAt.has(key(X+dx,y2,Z+dz)))removeBlock(X+dx,y2,Z+dz);}}
  return best;},
 tp:function(x,y,z){player.pos.set(x,y,z);player.vel.set(0,0,0);},
 archer:function(x,y,z){monsters.slice().forEach(removeMob);var m=createMob(9400,x,y,z,ARCHER_HP,'crawler');m.speed=2.2;m.dmg=3;ensureArcher(m);return {archer:!!m.archer,bow:m.group.userData.arms[1].children.length,mat:m.group.children[0].material===archerBodyMat};},
 mob:function(){var m=monsters.filter(function(q){return q.id===9400;})[0];return m?{x:m.x,y:m.y,z:m.z,shot:m.lastShot||0}:null;},
 clear:function(){monsters.slice().forEach(removeMob);enemyArrows.forEach(function(a){scene.remove(a.mesh);});enemyArrows.length=0;}, tryShoot:function(){var m=monsters.filter(function(q){return q.id===9400;})[0];m.speed=0;var tg={x:player.pos.x,y:player.pos.y,z:player.pos.z,peer:null};var n=enemyArrows.length;var r=archerShoot(m,tg,performance.now());return [r,enemyArrows.length-n];}, clearWall:function(X,Z,H,z,half,h){for(var dx=-half;dx<=half;dx++)for(var y=H;y<H+h;y++)if(blockAt.has(key(X+dx,y,Z+z)))removeBlock(X+dx,y,Z+z);}, arrows:function(){return enemyArrows.length;}, pp:function(){return [player.pos.x,player.pos.z];}, hp:function(){return player.hp;}, setHp:function(h){player.maxHp=Math.max(player.maxHp,h);player.hp=h;invulnUntil=0;},
 wall:function(X,Z,H,z,half,h){for(var dx=-half;dx<=half;dx++)for(var y=H;y<H+h;y++)addBlock('stone',X+dx,y,Z+z);},
 visualArrow:function(){var n=enemyArrows.length;spawnEnemyArrow(player.pos.x,player.pos.y+1,player.pos.z-5,0,0,3,false);return enemyArrows.length-n;}, safe:function(){invulnUntil=0;}, 
 spawnNight:function(){setTimeout(function(){},0);var c=0;monsters.slice().forEach(removeMob);var r=Math.random;for(var i=0;i<400;i++){spawnMob();}return monsters.filter(function(m){return m.archer;}).length+'/'+monsters.length;}, nf:function(){return difficulty().nf;}};

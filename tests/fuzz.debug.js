window.__debug={play:function(){locked=true;syncOverlay();},
 st:function(){return {x:player.pos.x,y:player.pos.y,z:player.pos.z,hp:player.hp,dead:player.dead,hunger:hunger,mobs:monsters.length,drops:drops.length,sel:selected};},
 rnd:function(){var r=Math.random;
  var a=Math.floor(r()*12);
  if(a===0){player.pos.set(2+r()*40,3+r()*12,2+r()*40);player.vel.set(0,0,0);}
  else if(a===1){player.yaw=r()*6.28;player.pitch=(r()-0.5)*2.6;}
  else if(a===2){selectSlot(Math.floor(r()*ITEMS.length));}
  else if(a===3){doSecondary();}
  else if(a===4){primaryHeld=!primaryHeld;}
  else if(a===5){RECIPES.forEach(function(rc){Object.keys(rc.cost).forEach(function(k){inventory[k]=Math.max(inventory[k]||0,rc.cost[k]);});if(r()<0.4&&canAfford(rc.cost)){Object.keys(rc.cost).forEach(function(k){inventory[k]-=rc.cost[k];});rc.apply();}});}
  else if(a===6){eatFood();useApple();}
  else if(a===7){dayElapsed=r()*DAY_LENGTH;}
  else if(a===8){['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft'].forEach(function(c){keys[c]=r()<0.5;});}
  else if(a===9){inventory.sprout=5;inventory.stone=5;inventory.torch=5;inventory.chest=3;}
  else if(a===10){damagePlayer(Math.floor(r()*15),0,0,r()<0.5,'fall');}
  else if(a===11){var h=raycastBlock();if(h&&blockAt.get(key(h.x,h.y,h.z))==='chest')openChest(h.x,h.y,h.z);else if(chestOpen)closeChest();}
 }, bad:function(){return [player.pos.x,player.pos.y,player.pos.z,player.hp,hunger].some(function(v){return !isFinite(v);});}};

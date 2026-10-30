window.__debug={tp:function(x,y,z){player.pos.set(x,y,z);player.vel.set(0,0,0);},
 flat:function(){for(var x=4;x<40;x++)for(var z=10;z<40;z++){var ok=true;for(var i=0;i<8&&ok;i++){if(terrainHeightAt(x,z-i)!==terrainHeightAt(x,z)||terrainHeightAt(x,z-i)<5)ok=false;}if(ok)return [x,z,terrainHeightAt(x,z)];}return null;},
 setHunger:function(h){hunger=h;}, sprinting:function(){return sprinting;}, tsprint:function(){return tSprint;}, posText:function(){return posEl.hidden?null:posEl.textContent;},
 playing:function(){return document.body.classList.contains('playing');}, tgtPlace:function(){return JSON.stringify(inventory.stone);}};

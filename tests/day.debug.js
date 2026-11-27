window.__debug={play:function(){locked=true;syncOverlay();},
 setT:function(t){dayElapsed=t*DAY_LENGTH;}, tick:function(dt){updateSky(dt);}, day:function(){return dayNumber;}, setDay:function(n){dayNumber=n;}, clock:function(){return clockTimeEl.textContent;}, save:function(){savePlayer();}, pause:function(){window.__keep=dayElapsed;}, 
 hp:function(nf){return crawlerHp(nf);}, diff:function(){return difficulty().hp;}, useBedAt:function(){}, sleepCount:function(){return 0;}};

# Browser tests

Playwright + Chromium, driven through a debug hook (`window.__debug`) that `build.py` injects into a local copy of the game.

```
cp <three@0.128.0>/build/three.min.js tests/      # npm pack three@0.128.0
python3 tests/build.py smoke && node tests/smoke.test.js   # recipes, ores, charm, apple, armor, boss, gear validator
python3 tests/build.py fuzz  && node tests/fuzz.test.js    # 150 s of random actions, fails on any page error / NaN
python3 tests/build.py features && node tests/features.test.js   # farming, shared chests, target label, position readout, sprint
python3 tests/build.py touch && node tests/touch.test.js         # phone: tap to play, stick sprint, tap-the-clock readout
python3 tests/build.py peers && node tests/peers.test.js         # other players: gear in presence, avatar armor/tools, cleanup
python3 tests/build.py boat && node tests/boat.test.js           # boat: craft, board in water, float, speed, shore dismount, shown to other players
python3 tests/build.py pathing && node tests/pathing.test.js     # crawlers: climb one-block steps, walk around walls instead of stopping
python3 tests/build.py bed && node tests/bed.test.js             # bed: craft, place, set respawn, sleep through the night, respawn at the bed
python3 tests/build.py animals && node tests/animals.test.js     # sheep: mesh, drops (mutton + wool), spawning, mutton as food, wool bed
python3 tests/build.py fishing && node tests/fishing.test.js     # fishing: craft a rod, cast at water, bite window, loot table, fish as food
python3 tests/build.py ruins && node tests/ruins.test.js         # ruins: 3 crumbled stone enclosures with richer chests, deterministic
python3 tests/build.py archer && node tests/archer.test.js       # archers: keep bow range, shoot (line of sight), arrows hurt only via the host
python3 tests/build.py day && node tests/day.test.js             # day counter: ticks at sunrise, once per night, survives a reload
python3 tests/build.py ruins && node tests/cabins.test.js        # cabins: wooden shelter with roof, door, torch, bed (sleepable) and a supplies chest
python3 tests/build.py visual && node tests/visual.shots.js <outdir>   # screenshots: boss at night, farm, ores, HUD (for eyeballing, no assertions)
```

Run `node` with `NODE_PATH` pointing at the global playwright install if needed. The generated `*-local.html` files are git-ignored.

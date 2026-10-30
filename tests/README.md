# Browser tests

Playwright + Chromium, driven through a debug hook (`window.__debug`) that `build.py` injects into a local copy of the game.

```
cp <three@0.128.0>/build/three.min.js tests/      # npm pack three@0.128.0
python3 tests/build.py smoke && node tests/smoke.test.js   # recipes, ores, charm, apple, armor, boss, gear validator
python3 tests/build.py fuzz  && node tests/fuzz.test.js    # 150 s of random actions, fails on any page error / NaN
```

Run `node` with `NODE_PATH` pointing at the global playwright install if needed. The generated `*-local.html` files are git-ignored.

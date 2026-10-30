"""Builds tests/<name>-local.html: index.html + a debug hook file (tests/<name>.debug.js) + a local three.min.js.
Usage: python3 tests/build.py smoke   (needs tests/three.min.js, e.g. from `npm pack three@0.128.0`)"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
name = sys.argv[1]
src = open(os.path.join(here, '..', 'index.html')).read().replace(
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js')
dbg = open(os.path.join(here, name + '.debug.js')).read()
anchor = 'updateHearts();\nloading.hidden = true;\noverlay.hidden = false;\nanimate();'
assert anchor in src, 'anchor not found: index.html changed?'
open(os.path.join(here, name + '-local.html'), 'w').write(src.replace(anchor, anchor.replace('animate();', dbg + '\nanimate();')))

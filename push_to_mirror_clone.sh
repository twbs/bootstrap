#!/bin/bash
export ts=`date +%s` && cd ../bootstrap-gh-pages && git add . -A && git commit -m "gh-pages $ts" && git push origin gh-pages
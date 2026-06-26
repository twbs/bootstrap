#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p comments
w() { cat > "comments/$1.txt"; }

# ---- A: resolved by the v6 rewrite ----
w 29378 <<'EOF'
v6-dev auto-initializes tooltips and popovers via event delegation (`data-bs-toggle="tooltip"`/`"popover"`), so the manual "opt-in for performance" step no longer applies to them. Closing — please open a new issue if a specific component in v6-dev still needs this documented.
EOF
w 36544 <<'EOF'
v6-dev's Carousel `interval` accepts only a number (`DefaultType.interval: 'number'`); pausing and autoplay are governed by the separate `pause`/`autoplay` options. Closing as done — please open a new issue if you need more here in v6-dev.
EOF
w 36916 <<'EOF'
v6-dev ships as ESM with named exports and an `exports` map rather than separately-loaded IIFE files, so the manual script load-order concerns from 5.2 no longer apply. Closing — please open a new issue if you hit a dependency problem in v6-dev.
EOF
w 37245 <<'EOF'
v6-dev disposes any existing instance bound to an element before creating a new one (in the base component), so the faulty silent re-set is fixed. Closing — please open a new issue if you still see a stale instance in v6-dev.
EOF
w 37265 <<'EOF'
v6-dev guards the transition-completion callback against a disposed instance (`if (!this._element) return`), so disposing a toast mid-transition no longer throws on `classList`. Closing — please open a new issue if you can still reproduce it in v6-dev.
EOF
w 37969 <<'EOF'
v6-dev rebuilds Carousel on native CSS scroll-snap, so swipe/drag is owned by the browser and no longer conflicts with autoplay (the old `touch`/`ride` options are gone). Closing — please open a new issue if swipe misbehaves in v6-dev.
EOF
w 38914 <<'EOF'
v6-dev removed the jQuery plugin bridge entirely — Bootstrap's JS is ESM-only and is no longer registered as a jQuery plugin, so the `$.fn`-based usage this depends on isn't supported. Closing — please open a new issue if you hit a non-jQuery bundler problem in v6-dev.
EOF
w 39094 <<'EOF'
In v6-dev, function options are called with the attached element as both the first argument and the `this` reference (the documented behavior since 5.3). Closing as working-as-documented — please open a new issue if a specific option doesn't follow that contract in v6-dev.
EOF

# ---- B: won't-fix / superseded ----
w 38189 <<'EOF'
This came from initializing a component against a missing/invalid target, leaving its config undefined. v6-dev's base component returns early when the target element can't be resolved, so that specific crash path is gone. Closing — please open a new issue if you can reproduce a config error on a valid target in v6-dev.
EOF

echo "--- posting + closing A+B ---"
for n in 29378 36544 36916 37245 37265 37969 38914 39094 38189; do
  if gh issue close "$n" --comment "$(cat comments/$n.txt)" >/dev/null 2>err.log; then
    echo "closed #$n"
  else
    echo "FAILED #$n: $(cat err.log)"
  fi
done
rm -f err.log

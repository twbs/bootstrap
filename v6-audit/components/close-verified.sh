#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p comments
w() { cat > "comments/$1.txt"; }

w 39081 <<'EOF'
v6-dev's tooltip no longer toggles on `show()` — calling `show()` on an already-visible tooltip keeps it shown (verified against a build). Closing — please open a new issue if it persists in v6-dev.
EOF
w 40524 <<'EOF'
v6-dev's `setContent()` now updates a visible popover in place and keeps it shown rather than hiding it (verified against a build). Closing — please open a new issue if it persists in v6-dev.
EOF
w 41588 <<'EOF'
v6-dev's Menu no longer throws when the toggle is removed from the DOM while open — verified by yanking the element mid-open and then closing. Closing — please open a new issue if you can still trigger it in v6-dev.
EOF
w 37363 <<'EOF'
v6-dev positions tooltips with Floating UI; when there's room the requested `placement` is honored and it only flips when there isn't space (verified `placement: 'right'` stays on the right). Closing — please open a new issue if a tooltip ignores its placement with space available in v6-dev.
EOF
w 39984 <<'EOF'
In v6-dev, Menu (the Dropdown successor) is retokenized for color modes, and a navbar under a parent `data-bs-theme="dark"` renders with dark-appropriate colors (light text on a dark background). Closing — please open a new issue if a specific case still doesn't pick up the dark theme in v6-dev.
EOF
w 36944 <<'EOF'
Tested on the WebKit (Safari) engine in v6-dev and tooltips show on a radio input. Closing — please reopen with a reduced case if you still see it on a current iOS/macOS Safari in v6-dev.
EOF
w 34400 <<'EOF'
A menu toggle is a toggle, not a navigation link — v6-dev intentionally suppresses the `href` on `data-bs-toggle="menu"` so the click opens the menu instead of navigating. Use a separate element if you need a real link. Closing as by-design — please open a new issue if you have a case this doesn't cover in v6-dev.
EOF
w 39945 <<'EOF'
v6-dev wires tooltips with `aria-describedby` pointing at the tip (which has `role="tooltip"`), the standard pattern for exposing the text to assistive tech. Closing — please open a new issue if a specific screen reader still doesn't announce it in v6-dev (include the SR/browser/version).
EOF

echo "--- posting + closing ---"
for n in 39081 40524 41588 37363 39984 36944 34400 39945; do
  if gh issue close "$n" --comment "$(cat comments/$n.txt)" >/dev/null 2>err.log; then
    echo "closed #$n"
  else
    echo "FAILED #$n: $(cat err.log)"
  fi
done
rm -f err.log

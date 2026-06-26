#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p comments
write() { cat > "comments/$1.txt"; }

write 38887 <<'EOF'
v6-dev binds the keydown/click listeners once when the instance is created rather than on each open, so they no longer stack up. Closing — please open a new issue if you still see duplicates in v6-dev.
EOF

write 41473 <<'EOF'
v6-dev guards the transition-completion callback against a disposed instance, so hide() followed by dispose() no longer throws. Closing — please open a new issue if it persists in v6-dev.
EOF

write 38162 <<'EOF'
v6-dev rebuilds offcanvas as a `drawer` on the native `<dialog>` element, and Escape is handled in both the modal and non-modal cases, so `backdrop: false` still closes on Esc. Closing — please open a new issue if it persists in v6-dev.
EOF

write 37155 <<'EOF'
v6-dev uses the native `<dialog>` element, where Escape fires the native `cancel` event independently of any backdrop click, so Esc still closes a static-backdrop drawer. Closing — please open a new issue if it persists in v6-dev.
EOF

write 39408 <<'EOF'
v6-dev's drawer can run non-modal (`backdrop: false` with `scroll: true`), which uses the native `<dialog>` `show()` and leaves elements outside the drawer focusable — including popups from third-party widgets. Closing — please open a new issue if that doesn't cover your case in v6-dev.
EOF

write 37613 <<'EOF'
v6-dev supports an instant, non-animated close via the `dialog-instant`/`drawer-instant` class, which skips the exit transition and closes synchronously. Closing — please open a new issue if you need more control in v6-dev.
EOF

write 41430 <<'EOF'
v6-dev's dialog/drawer no longer measure scrollbar width, so the forced reflow from that path is gone. Closing — please open a new issue with a reduced example if you still hit a slowdown in v6-dev.
EOF

write 40640 <<'EOF'
v6-dev exposes dialog width as a `--dialog-width` custom property, so you can set per-dialog widths (including via media queries) without recompiling Sass. Closing — please open a new issue if you need more here in v6-dev.
EOF

write 39780 <<'EOF'
v6-dev ignores re-entrant clicks while a drawer is transitioning, so a quick second click during the open animation no longer corrupts the state. Closing — please open a new issue if you can still reproduce in v6-dev.
EOF

write 38515 <<'EOF'
v6-dev's modal runs on the native `<dialog>` element, so content outside it is inert by design — place the toast inside the dialog, or run it non-modal (`modal: false`), to keep it focusable. Closing — please open a new issue if that doesn't cover your case in v6-dev.
EOF

write 41606 <<'EOF'
v6-dev relies on the native `<dialog>` element's focus handling rather than our old focus-trap sentinels, so the stray stop on a hidden element shouldn't occur. Closing — please open a new issue if you still see it in v6-dev.
EOF

write 41059 <<'EOF'
v6-dev opens modal drawers with the native `<dialog>` `showModal()`, which makes background content inert at the platform level rather than relying on `aria-modal`, so TalkBack should stay within the drawer. Closing — please open a new issue if it persists on Android in v6-dev.
EOF

echo "Wrote comment files for: 38887 41473 38162 37155 39408 37613 41430 40640 39780 38515 41606 41059"

#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p comments

write() { cat > "comments/$1.txt"; }

write 33727 <<'EOF'
v6-dev rebuilds modals on the native `<dialog>` element, so there's no separate backdrop node to leave behind. Closing as resolved there — please open a new issue if this persists for you in v6-dev.
EOF

write 34309 <<'EOF'
v6-dev moves to the native `<dialog>` element and its `::backdrop`, so there's no backdrop node or root to configure anymore. Closing — please open a new issue if you hit something similar in v6-dev.
EOF

write 36463 <<'EOF'
In v6-dev the body keeps its open class as long as any modal dialog is still open, so this is handled. Closing — please open a new issue if it resurfaces in v6-dev.
EOF

write 38814 <<'EOF'
v6-dev rebuilds modals on the native `<dialog>` element, so the old `.modal`/`.modal-dialog` container model (and this positioning case) no longer applies. Closing — please open a new issue if you need this in v6-dev.
EOF

write 39258 <<'EOF'
v6-dev drops our custom focus-trap for modals and relies on the native `<dialog>` element's built-in focus handling, so this conflict shouldn't occur. Closing — please open a new issue if you still see it in v6-dev.
EOF

write 39862 <<'EOF'
This was our custom focus-trap. v6-dev uses the native `<dialog>` element's built-in focus handling, so there's no scripted refocus to scroll the page. Closing — please open a new issue if it persists in v6-dev.
EOF

write 40873 <<'EOF'
In v6-dev the backdrop is the native `::backdrop` and transitions alongside the dialog in CSS, so the stagger is gone and timing is yours to control. Closing — please open a new issue if you need more here in v6-dev.
EOF

write 41005 <<'EOF'
v6-dev moves modals to the native `<dialog>` element, so we no longer toggle `aria-hidden` ourselves and this warning goes away. Closing — please open a new issue if you still see it in v6-dev.
EOF

write 41958 <<'EOF'
This was our custom focus-trap; v6-dev uses the native `<dialog>` element's built-in focus handling, so there's no scripted refocus to scroll the body. Closing — please open a new issue if it persists in v6-dev.
EOF

write 42440 <<'EOF'
We're not changing this in v5. v6-dev rebuilds modals on the native `<dialog>` element, which uses the `[open]` attribute rather than inline `display` styles, so there's nothing to allow-list. Closing — please open a new issue if CSP is still a problem in v6-dev.
EOF

write 42503 <<'EOF'
v6-dev uses the native `<dialog>` element's built-in focus handling, which doesn't depend on surrounding DOM order, so this case is covered. Closing — please open a new issue if it persists in v6-dev.
EOF

echo "Wrote $(ls comments/*.txt | wc -l | tr -d ' ') comment files."

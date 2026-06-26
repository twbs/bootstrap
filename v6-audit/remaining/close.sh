#!/usr/bin/env bash
cd "$(git rev-parse --show-toplevel)"
C=.context/issue-audit/remaining/comments; mkdir -p "$C"
w() { cat > "$C/$1.txt"; }
REPO=twbs/bootstrap

# resolved by v6 work
w 36459 <<'EOF'
v6-dev rewrote form validation around `:user-invalid`/`:user-valid` (behind `[data-bs-validate]`) instead of `.was-validated` + `:valid`/`:invalid`, so a pre-filled value no longer auto-validates or overrides `.is-invalid`. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 39721 <<'EOF'
v6-dev rebuilds the carousel on native CSS scroll-snap, so the v5 transform/`deltaX` touch code behind the reversed iOS swipe is gone (and Safari 12 is below v6's browser baseline). Closing as resolved in v6-dev — please open a new issue if you see reversed swiping on a current iOS Safari there.
EOF
w 36391 <<'EOF'
This tracked StackBlitz fixes for the v5 (Hugo) docs; v6-dev ships a fresh StackBlitz integration, so the per-example checklist here is obsolete. Closing — please open a new issue for any specific broken StackBlitz example in the v6-dev docs.
EOF
w 42543 <<'EOF'
v6-dev migrated off Popper to Floating UI, and the docs link to floating-ui.com rather than popper.js.org. Closing as resolved in v6-dev — please open a new issue if you spot a stale Popper link there.
EOF
w 37283 <<'EOF'
v6-dev bundles its positioning dependency from `js/src` rather than `node_modules`, so the `*.js.map` files no longer carry the broken vendor paths described here. Closing as resolved in v6-dev — please open a new issue if a map path is wrong there.
EOF

# won't-fix
w 41240 <<'EOF'
The scroll landing mid-content when one accordion panel closes as another opens is the browser's scroll-anchoring behavior, not something Collapse controls — addressing it would mean animating page scroll, which is out of scope. Closing as won't-fix — please open a new issue if you can show a Collapse-side cause in v6-dev.
EOF
w 35722 <<'EOF'
This advice is jQuery-era (`$(window).on('load')`) and tied to the v5 carousel init model; v6-dev's carousel uses a different (CSS scroll-snap) init, so the wording no longer applies (the original PRs were closed unmerged). Closing — please open a new issue if the v6-dev carousel docs need a specific clarification.
EOF
w 42522 <<'EOF'
v6-dev's docs no longer include a Translations page (the community-translations listing was dropped), so there's nowhere to add this. Closing — please open a new issue if translation listings return to the v6-dev docs.
EOF
w 41390 <<'EOF'
This is a v5-line `.browserslistrc` update; v6-dev already targets far newer browsers, so it doesn't apply here — it belongs on the v5 branch. Closing.
EOF

echo "=== resolved: v6 label + project + close ==="
for n in 36459 39721 36391 42543 37283; do
  gh api "repos/$REPO/issues/$n/labels" --method POST -f "labels[]=v6" >/dev/null 2>&1
  gh issue close "$n" --comment "$(cat "$C/$n.txt")" >/dev/null 2>&1
  gh project item-add 38 --owner twbs --url "https://github.com/twbs/bootstrap/issues/$n" >/dev/null 2>&1 && echo "✓ #$n labeled+closed+project" || echo "✗ #$n"
done
echo "=== won't-fix: close ==="
for n in 41240 35722 42522 41390; do
  gh issue close "$n" --comment "$(cat "$C/$n.txt")" >/dev/null 2>&1 && echo "✓ #$n closed" || echo "✗ #$n"
done

#!/usr/bin/env bash
cd "$(git rev-parse --show-toplevel)"
C=.context/issue-audit/pr-close-comments; mkdir -p "$C"
w() { cat > "$C/$1.txt"; }

w 35393 <<'EOF'
v6-dev rebuilds Modal as the native `<dialog>`-based Dialog, and #42544 restores focus to the trigger with `{ preventScroll: true }` on close — covering the same #35391 this fixes. Since this targets v5 and isn't slated for a v5.x release, closing in favor of the v6 work. Thanks for the fix.
EOF
w 38857 <<'EOF'
v6-dev's Dialog/Drawer `dispose()` now closes the element and clears the body scroll-lock when disposed while open (#35934, in #42544), covering the body-attribute cleanup here. Closing in favor of the v6 work since this targets v5 and isn't slated for a v5.x release. Thanks!
EOF
w 40789 <<'EOF'
Fixed in v6-dev by #42545, which moves the dialog scroll-lock to `:root` so it co-locates with `scrollbar-gutter: stable` (no content shift / white gutter) — the same #40659 this addresses. Closing in favor of the v6 work; thanks for the investigation here.
EOF
w 40851 <<'EOF'
Fixed in v6-dev by #42551, which makes `show()` honor content supplied via `setContent()` (#40525) — the same issue this fixes. Closing in favor of the v6 work since it targets v5. Thanks!
EOF
w 40994 <<'EOF'
Addressed in v6-dev by #42550 (#40993), which fills the bottom popover arrow with the header background via `:has(+ .popover-header)`. Closing in favor of the v6 work; thanks for tackling this.
EOF
w 42527 <<'EOF'
Fixed in v6-dev by #42551, which keeps the menu open for clicks inside a form within it (#41803) — the same fix as here. Closing in favor of the v6 work since it targets v5. Thanks!
EOF
w 39441 <<'EOF'
In v6-dev the `$navbar-light-*`/`$navbar-dark-*` Sass variables were removed entirely — navbar color now flows through the theme-token system (`--fg-body` / `light-dark()`), so the renamed aliases here no longer apply (#39070). Closing in favor of the v6 approach. Thanks for surfacing the naming issue.
EOF

for n in 35393 38857 40789 40851 40994 42527 39441; do
  gh pr close "$n" --comment "$(cat "$C/$n.txt")" >/dev/null 2>&1 && echo "✓ closed PR #$n" || echo "✗ #$n failed"
done

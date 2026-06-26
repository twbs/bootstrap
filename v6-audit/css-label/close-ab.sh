#!/usr/bin/env bash
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
mkdir -p .context/issue-audit/css-label/comments
C=.context/issue-audit/css-label/comments
w() { cat > "$C/$1.txt"; }
REPO=twbs/bootstrap

# ---------- A: resolved by v6-dev work (v6 label + close) ----------
w 41192 <<'EOF'
v6-dev's breakpoint mixins use modern range syntax (`width < $max`) with no `-0.02px` subtraction, so there's no longer a value to factor into a variable. Closing as resolved in v6-dev — please open a new issue if something similar comes up there.
EOF
w 40961 <<'EOF'
v6-dev's utility generation now emits only the functional `hover:` variant (no redundant default class). Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 41289 <<'EOF'
v6-dev paints the relevant SVGs with `mask-image` + `currentcolor` via a shared `mask-icon` mixin (close button, navbar toggler, carousel controls). Closing as largely done in v6-dev — please open a new issue for any specific element still using a background-image there.
EOF
w 38479 <<'EOF'
v6-dev handles the legend/gutter spacing with the gap-based layout that's now standard (the workaround noted here). Closing as resolved in v6-dev — please open a new issue if you hit a real gap problem there.
EOF
w 39097 <<'EOF'
v6-dev nests the `.btn-check` input inside its label, so `position: absolute` resolves against the label and the scroll-to-top focus jump is gone. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 39239 <<'EOF'
v6-dev applies checked styling to the input itself (`appearance: none` + `:checked`), and toggle buttons expect the input nested inside the label, so the embedded-checkbox pattern is supported. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 39851 <<'EOF'
v6-dev drives the range thumb radius through a `--range-thumb-border-radius` token (radius is token-based now), so it's controllable rather than the browser default. Closing as resolved in v6-dev — please open a new issue if you need more there.
EOF
w 41137 <<'EOF'
v6-dev already exposes these as CSS variables (`--control-checked-bg` / `--control-checked-border-color`), so check/radio checked colors are themeable without a Sass rebuild. Closing as resolved in v6-dev — please open a new issue if it doesn't cover your case there.
EOF
w 38213 <<'EOF'
v6-dev's navbar toggler is a `.btn` with `--btn-bg`/`--btn-hover-bg` tokens plus toggler border tokens, and its icon is a `currentcolor` mask — so background, hover, border, and icon color are all customizable. Closing as resolved in v6-dev — please open a new issue if you need more there.
EOF
w 39085 <<'EOF'
v6-dev's outline buttons derive distinct hover and active backgrounds (different oklch lightness/chroma), so they're no longer identical. Closing as resolved in v6-dev — please open a new issue if it persists there. (Sticky-hover on touch is a separate concern.)
EOF
w 39481 <<'EOF'
v6-dev's `.btn-close` is painted with a `currentcolor` CSS mask (`--btn-close-color: inherit`) instead of the old white-only filter, so its color is freely customizable and follows the theme. Closing as resolved in v6-dev — please open a new issue if it doesn't cover your case there.
EOF
w 38853 <<'EOF'
v6-dev colors `.btn-close` with `currentcolor`, so `data-bs-theme="dark"` works whether it's on the button itself or a parent. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 38779 <<'EOF'
v6-dev replaces the `text-bg-*`/contextual table classes with the `.theme-*` token system — `<tr class="theme-…">` recolors the row through theme tokens. Closing as resolved in v6-dev — please open a new issue if you hit a coloring gap there.
EOF
w 41725 <<'EOF'
v6-dev uses distinct tokens for action vs disabled list-group items (`--list-group-action-color` vs `--list-group-disabled-color`), so action items no longer look disabled. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 41806 <<'EOF'
v6-dev sets `text-decoration: none` on `.list-group-item-action` at the base level, so active items don't gain a hover underline even with underlined link-hover. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 38973 <<'EOF'
v6-dev removes `.navbar-dark` and reworks the navbar onto theme tokens — a dark navbar is `bg-primary` + `data-bs-theme="dark"`, and inner dropdowns can be scoped with their own `data-bs-theme`. The old divergence no longer applies. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 39070 <<'EOF'
v6-dev removes the `$navbar-light/dark-*` variables; navbar color now uses theme-aware tokens (`--fg-body`/`light-dark()`), so the confusingly-named variable is gone. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 40414 <<'EOF'
v6-dev sets `color-scheme` per theme on `:root`/`[data-bs-theme]`, so the browser scrollbars match the active theme. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 39597 <<'EOF'
v6-dev's navbar toggler icon is a `currentcolor` mask, so it's visible in both light and dark without a separate light-mode variable. Closing as resolved in v6-dev — please open a new issue if a standalone toggler outside `.navbar` needs more there.
EOF
w 35988 <<'EOF'
v6-dev rewrites the breadcrumb divider as an SVG mask icon (no text value directive), so the RTLCSS-after-compression error no longer occurs. Closing as resolved in v6-dev — please open a new issue if it persists there.
EOF
w 36595 <<'EOF'
v6-dev's token system feeds non-null maps, so the compiled CSS no longer emits empty custom properties. Closing as resolved in v6-dev — please open a new issue if you find an empty `--var: ;` there.
EOF
w 38094 <<'EOF'
v6-dev already ships `$enable-smooth-scroll: false` as the default, so smooth scrolling is off out of the box. Closing as resolved in v6-dev.
EOF

# ---------- B: won't-fix / by-design (close only, no label) ----------
w 34497 <<'EOF'
`.col` is a flex item (`flex: 1 1 0`) without `min-width: 0` by design, so wide content overflowing the grid is standard flexbox behavior — set `min-width: 0`/`overflow` on the column. Closing as by-design — please open a new issue if you see a genuine regression in v6-dev.
EOF
w 38404 <<'EOF'
Same as the general `.col` overflow behavior: a flex column without `min-width: 0` lets wide `<pre>` content overflow — standard flexbox, fixable with `min-width: 0`/`overflow` on the column. Closing as by-design — please open a new issue if you see a regression in v6-dev.
EOF
w 36026 <<'EOF'
The floating-label placeholder is intentionally transparent — it drives the label's float transition via `:placeholder-shown`. An always-visible placeholder isn't supported by that pattern. Closing as by-design — please open a new issue if you have a different case in v6-dev.
EOF
w 34184 <<'EOF'
Bootstrap's table cell styles are scoped via `> :not(caption) > * > *`, which requires a row group (`<thead>`/`<tbody>`/`<tfoot>`). A bare `<tr>` with no row group is out of scope. Closing as by-design — wrap rows in a `<tbody>`.
EOF
w 38750 <<'EOF'
The white iframe background comes from the embedded third-party content's own `color-scheme`/background — Bootstrap can't style cross-origin iframe internals. Closing as out of scope — please open a new issue if you find a Bootstrap-side cause in v6-dev.
EOF
w 40652 <<'EOF'
v6-dev no longer computes per-color foregrounds with a WCAG color-contrast Sass function — theme contrast tokens are author-defined under the oklch/token model, so switching the algorithm to APCA doesn't apply. Closing — please open a new issue if you'd like to discuss contrast tokens for v6-dev.
EOF
w 38889 <<'EOF'
Gradient borders require `border-image`, which isn't expressible through `border-color`; it's out of scope for a core utility but achievable with your own `border-image` CSS. Closing as won't-fix — please open a new issue if you have a token-based proposal for v6-dev.
EOF
w 39386 <<'EOF'
A bare `.toast` has no positioning by design — toasts are meant to live inside a `.toast-container`, which owns position/z-index. Closing as by-design — please open a new issue if the container doesn't cover your case in v6-dev.
EOF

A_ISSUES="41192 40961 41289 38479 39097 39239 39851 41137 38213 39085 39481 38853 38779 41725 41806 38973 39070 40414 39597 35988 36595 38094"
B_ISSUES="34497 38404 36026 34184 38750 40652 38889 39386"

echo "=== A: v6 label + comment + close ==="
for n in $A_ISSUES; do
  gh api "repos/$REPO/issues/$n/labels" --method POST -f "labels[]=v6" >/dev/null 2>&1
  gh issue close "$n" --comment "$(cat "$C/$n.txt")" >/dev/null 2>&1 && echo "✓ #$n labeled v6 + closed" || echo "✗ #$n FAILED"
done

echo "=== B: comment + close (by-design) ==="
for n in $B_ISSUES; do
  gh issue close "$n" --comment "$(cat "$C/$n.txt")" >/dev/null 2>&1 && echo "✓ #$n closed" || echo "✗ #$n FAILED"
done

echo "$A_ISSUES" > .context/issue-audit/css-label/_v6_project_pending.txt
echo "done"

#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p comments
w() { cat > "comments/$1.txt"; }

# ---- Resolved by the rewrite ----
w 33957 <<'EOF'
v6-dev rebuilds dropdowns as the Menu component on Floating UI, which positions menus the same way everywhere — there's no longer a special case that skipped auto-positioning inside nav. Closing — please open a new issue if auto-placement misbehaves in a navbar in v6-dev.
EOF
w 34110 <<'EOF'
Menu (the v6 successor to Dropdown) is built on Floating UI and exposes the positioning strategy directly via the `strategy` option / `data-bs-strategy`, so you can set `fixed` without a custom config. Closing — please open a new issue if you need more control in v6-dev.
EOF
w 35774 <<'EOF'
Menu on Floating UI supports `container` (render the menu elsewhere, e.g. on `<body>`), `boundary`, and `strategy: 'fixed'`, which covers positioning out of clipping/overflow ancestors. Closing — please open a new issue if these don't cover your case in v6-dev.
EOF
w 35793 <<'EOF'
v6-dev's Menu returns focus to the toggle when it's closed with the Escape key. Closing — please open a new issue if focus isn't restored as expected in v6-dev.
EOF
w 36789 <<'EOF'
This warning came from Popper, which v6-dev no longer uses — Menu is built on Floating UI, so the `dropdown-menu` margin warning is gone. Closing — please open a new issue if you hit positioning problems in v6-dev.
EOF
w 37428 <<'EOF'
v6-dev's Menu guards the keydown handler against a toggle with no associated menu, so Escape no longer throws. Closing — please open a new issue if you can still reproduce it in v6-dev.
EOF
w 37474 <<'EOF'
v6-dev always initializes the tooltip's active-trigger state, so `_isWithActiveTrigger` can no longer hit the undefined value it was choking on. Closing — please open a new issue if the error resurfaces in v6-dev.
EOF
w 38842 <<'EOF'
Menu (the v6 Dropdown successor) now has a `container` option, so you can render the menu on `<body>` or another element to escape `overflow` ancestors. Closing — please open a new issue if you need more here in v6-dev.
EOF
w 39103 <<'EOF'
v6-dev ships a dedicated Combobox component for exactly this — a text input paired with a filterable menu. Closing in favor of Combobox — please open a new issue if it doesn't cover your use case in v6-dev.
EOF
w 39692 <<'EOF'
v6-dev's tooltips now dismiss on the Escape key (WCAG 1.4.13). Closing — please open a new issue if it doesn't work as expected in v6-dev.
EOF

# ---- Won't-fix / by-design ----
w 37977 <<'EOF'
The input-plus-menu pattern this targets is now served by the dedicated Combobox component in v6-dev, and Menu's focus handling is tied to its keyboard semantics, so we're not adding a focus opt-out to `show()`. Closing — Combobox is the recommended path; please open a new issue if it doesn't fit your case.
EOF
w 38874 <<'EOF'
Rather than auto-adding a class for HTML tooltips, use `customClass` (`data-bs-custom-class`) to target them, together with the `--tooltip-max-width` custom property for sizing. Closing as working-as-intended — please open a new issue if that approach falls short in v6-dev.
EOF
w 39182 <<'EOF'
This is intentional: only one instance per component key is allowed, but different components use different keys (`bs.menu` vs `bs.tooltip`), so you can still attach both to one element — the message is a guard, not a hard limit. Closing — please open a new issue if you hit a genuine conflict in v6-dev.
EOF
w 41148 <<'EOF'
A dropdown rendered with the `.show` class in markup never instantiates a Menu, so Floating UI positioning never runs — positioning only applies when the menu is opened via `show()` or the data API. This is by design. Closing — please open a new issue if positioning is wrong after opening a menu normally in v6-dev.
EOF
w 41182 <<'EOF'
The select's arrow is a background image, and the browser's autofill styling replaces the control's background, overwriting the arrow. That's a browser limitation we can't override from CSS on a form control. Closing as won't-fix — please open a new issue if you find a workable approach in v6-dev.
EOF
w 41344 <<'EOF'
Same root as the initial-`.show` positioning case (#41148): a dropdown opened by hand-adding `.show` has no Menu instance, so the auto-close machinery (which only tracks menus it opened) can't close it. Open it via `show()` or the data API and `auto-close` works. Closing — please open a new issue if auto-close misbehaves on a normally-opened menu in v6-dev.
EOF
w 41354 <<'EOF'
This comes from HTML semantics: a `<button>` inside a `<form>` defaults to `type="submit"`, so Enter in the input activates it. Set `type="button"` on the menu toggle. Closing as not a Bootstrap bug — please open a new issue if you see it with an explicit `type="button"` in v6-dev.
EOF

echo "Wrote $(ls comments/*.txt | wc -l | tr -d ' ') comment files."

Three small docs fixes, one per commit:

- **Navbar menu toggles use `<button>`** — replace the navbar dropdown toggles' `<a href="#" role="button" data-bs-toggle="menu">` with semantic `<button type="button">` (`.nav-link` already resets button styling). Fixes #40995.
- **Document toggling a menu via the JS API** — the "Via JavaScript" section only showed instantiation; added an example using `getOrCreateInstance().show()/hide()/toggle()`. Fixes #37042.
- **Document delegated tooltips** — added an example initializing one Tooltip on a parent with the `selector` option to cover many (and dynamically-added) triggers. Fixes #41020.

markdownlint + prettier pass on all three files.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

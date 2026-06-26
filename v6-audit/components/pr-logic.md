Two menu/popover logic fixes, one per commit:

- **Popover/Tooltip: show content set only via `setContent()`** — `show()` gates on `_isWithContent()`, which read the configured title/content and ignored content supplied through `setContent()`. A popover whose content was set only via `setContent()` could never be shown. Count `setContent()` content in the gate (shared `_hasNewContent()` helper). Fixes #40525.
- **Menu: keep open when clicking inside a form within the menu** — `clearMenus` only skipped auto-close for `input/select/option/textarea/form` tag names, so clicking a form's `<label>`/button/etc. inside a menu closed it — breaking the documented forms-in-menu example. Skip auto-close for any click inside a form contained in the menu. Fixes #41803.

Unit tests added for both (each verified to fail without its fix); full suite passes; lint clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

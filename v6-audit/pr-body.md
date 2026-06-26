Two small dialog/drawer fixes, one per commit:

- **Don't scroll the page when restoring focus on close** — restore focus to the trigger with `{ preventScroll: true }`, so the page no longer jumps to the trigger (or to the top when `scroll-padding-top` is set). Fixes #38070, #41615, #35391.
- **Restore body scroll when disposed while open** — `dispose()` now closes the native `<dialog>` and removes the `dialog-open` body class if the instance is torn down while still open (e.g. an SPA route change), instead of leaving `overflow: hidden` stuck on the body. Fixes #35934, #39910.

Unit tests added/updated for both; full suite passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

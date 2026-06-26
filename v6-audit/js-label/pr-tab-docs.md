Two small fixes:

- **Tab: don't hijack modifier+arrow shortcuts** — `_keydown` called `preventDefault()` on arrow keys regardless of modifiers, so Alt+Left/Right (browser history) and similar were swallowed inside a tablist. Ignore the event when alt/ctrl/meta is held. Fixes #38565. (unit test added, verified to fail without the fix)
- **Docs: clarify Escape in menu auto-close** — document that <kbd>Esc</kbd> closes the menu while focus is within it (regardless of `autoClose`) and returns focus to the toggle. Fixes #38035.

Full suite passes; eslint + markdownlint + prettier clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

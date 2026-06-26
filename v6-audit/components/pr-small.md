Three small tooltip/popover/menu fixes, one per commit:

- **Menu: don't hijack arrow keys in contenteditable** — the keydown handler only exempted `<input>`/`<textarea>`, so arrow keys were captured inside contenteditable hosts (rich-text editors). Treat contenteditable targets like inputs. Fixes #41021.
- **Popover: match bottom arrow fill to header background** — a bottom-placed popover with a header filled its arrow with `--popover-bg`, so it didn't match the header it points into. Use `--popover-header-bg` when a header follows (`:has(+ .popover-header)`). Fixes #40993.
- **Docs: clarify title/content function arguments** — the function receives the attached element as its first argument (and as `this`), not just `this`. Fixes #40571.

Menu fix has a unit test; popover arrow verified against a build (arrow matches header bg with a header, body bg without). Full suite passes; lint/stylelint clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

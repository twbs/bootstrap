Two small tooltip/popover correctness fixes, one per commit:

- **Reset hover state when show is prevented** — a prevented (or not-in-DOM) `show()` returned early without clearing `_isHovered`, leaving it stuck `true`. For click-triggered tips that made every later click hit the `_enter()` early-return, so the tip never reopened after one `preventDefault()`. Fixes #39861.
- **Coerce boolean title/content to strings** — `data-bs-title="true"` / `data-bs-content="false"` are auto-converted to booleans by the data-API, which failed the `(null|string|element|function)` type check and threw. Extends the existing number→string coercion in `_configAfterMerge` to booleans. Fixes #41925.

Unit tests added for both; full suite passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

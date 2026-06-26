## Problem

Opening a dialog/drawer can shift page content sideways, and with `scrollbar-gutter: stable` the reserved gutter renders as a bare white strip instead of the dimmed overlay (#40659).

## Cause

`scrollbar-gutter: stable` is on `:root` (`_root.scss`), so the viewport scrollbar and its reserved gutter live on `<html>`. But the scroll-lock applied `overflow: hidden` to `<body>`. Because `<html>`'s overflow is `visible`, the body→viewport overflow-propagation quirk hides the scrollbar at the viewport level while the gutter reservation stays on `<html>` — and in that split state browsers don't reliably honor the gutter, so content reflows and the gutter strip falls outside the native `::backdrop`.

## Fix

Apply the `dialog-open` lock to the **root element** (`<html>`), co-locating `overflow: hidden` with `scrollbar-gutter: stable`. The gutter stays reserved while the scrollbar hides (no shift), and since `<html>` is the viewport scroller the `::backdrop` covers the gutter (no white strip).

- `dialog-base.js`: toggle `dialog-open` on `document.documentElement` instead of `document.body`.
- `_dialog.scss`: scope the rule to `:root.dialog-open`.
- Tests + migration note updated.

Fixes #39221, #39972, #40908, #40659.

## Verification

- Unit suite passes (1107); lint/stylelint clean.
- Scripted a Chromium check confirming the root-level lock blocks user (wheel) scrolling. The no-shift gutter behavior is a scrollbar-rendering property that headless Chromium can't reproduce (no scrollbar layout), so a quick visual check on Windows/Linux (classic scrollbars) before merge is worthwhile.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

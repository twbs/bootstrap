# Tooltip / Popover / Dropdown→Menu issue triage (v6-dev) — 56 issues

Big levers in v6: Popper → **Floating UI** (tooltip, popover, menu); Dropdown → **Menu**;
new dedicated **Combobox** (and chips/datepicker/otp-input); Menu gained Escape, arrow/Home/End
nav, submenus, `autoClose`, `container`, `strategy`. Tooltip gained **Escape dismiss** + `aria-label`.

## No longer applicable — CLOSE: resolved by the rewrite (10)
| # | Why |
|---|-----|
| 33957 | nav-dropdown positioning — Menu always runs Floating UI (no nav exception) [verify in navbar] |
| 34110 | expose Popper "strategy" — Menu now has a `strategy` option (`data-bs-strategy`) |
| 35774 | body/boundary positioning — Menu `container` + `boundary` + `strategy:fixed` |
| 35793 | a11y focus return on close — Menu Escape focuses the toggle |
| 36789 | Popper margin warning — Popper is gone |
| 37428 | Escape keydown TypeError — guarded (`if (!getToggleButton) return`) |
| 37474 | `_isWithActiveTrigger` error — `_activeTrigger` always initialized |
| 38842 | configurable container — Menu has a `container` option |
| 39103 | dropdown+input — now the dedicated **Combobox** component |
| 39692 | tooltip Escape dismiss — **already implemented** in v6 tooltip.js |

## No longer applicable — CLOSE: won't-fix / by-design (7)
| # | Why |
|---|-----|
| 37977 | `preventFocus` on show — input+toggle is Combobox's job; focus is integral |
| 38874 | CSS class for HTML tooltip — use `customClass` + `--tooltip-max-width` |
| 39182 | one-instance-per-element — intentional; Menu/Tooltip use different keys (non-blocking) |
| 41148 | manual `.show` class never inits Menu — by design + old markup. DUP of 41344 |
| 41182 | select arrow vs autofill — browser limitation |
| 41344 | initial `.show` + autoClose — by design. DUP of 41148 |
| 41354 | Enter submits form — `<button>` defaults to `type=submit`; HTML behavior |

## Docs (6)
37042 (toggle via JS), 37665 (tooltip usage snippet), 40571 (content-function docs),
40822 (getInstance description), 40995 (`a.dropdown-toggle` → `<button>`), 41020 (tooltip `selector` docs).

## Likely resolved — VERIFY then close (11)
| # | Check |
|---|-------|
| 34400 | toggle still `preventDefault()`s links — confirm desired v6 behavior |
| 37363 | tooltip honors `placement` (Floating UI flip) — runtime check |
| 38200 | popover arrow at fractional zoom — check 110/125% |
| 38414 | Firefox mobile-emulation double-toggle — manual repro |
| 39081 | second `.show()` keeps tooltip shown — runtime check |
| 39945 | SR announcement — `aria-label` added; test NVDA/VO |
| 39984 | dark menu/navbar under parent dark wrapper — runtime check |
| 40524 | `setContent()` re-shows (no longer hides) a shown popover — runtime check |
| 40624 | popover border/arrow overlap — check on 1080p display |
| 41588 | `_completeHide` TypeError — test with DOM-removing 3rd-party widget |
| 36944 | tooltip on radio (iOS Safari focus) — mostly browser; verify |

## Worth doing — KEEP (bugs, 18)
37206 (setContent tears down shown popover), 37935 (tooltip dead in `.form-floating` — label `pointer-events:none`),
38597 (tooltip z-index over fixed navbar), 39010 (click+focus can't combine to dismiss),
39026 (`abbr[title]` underline stripped by `_fixTitle`), 39861 (`preventDefault` on show blocks reopening — `_isHovered` not reset),
40525 (setContent→show fails `_isWithContent` gate; near-dup 40524), 40993 (bottom popover arrow bg ≠ header),
41021 (contenteditable arrow keys blocked in menu), 41049 (menu width in collapsed navbar),
41167 (arrow nav dead when toggle is `<input>` — maybe Combobox/wontfix, maintainer call),
41630 (tabs + tab-menu keyboard nav), 41670 (menu in table clipped by row stacking),
41803 (label click in form-in-menu closes menu), 41869 (autoClose:outside + keyboard leaves multiple shown),
41925 (`data-bs-content="true"/"false"` coerced to boolean → TypeError), 42065 (tooltip/popover not hoverable — WCAG 1.4.13),
**42443 (SECURITY: `data:text/html` passes the tooltip/popover URL sanitizer)**.

## Worth doing — KEEP (features, 4)
31088 (don't dismiss popover on click-inside / allow text selection), 37205 (caret indicator for menus),
38801 (arrow-key cycling / menubar APG), 38858 (log the offending DOM node on duplicate-instance error).

# CSS-label audit — 78 issues (not previously triaged)

88 open css-labeled; 10 already covered in prior passes. These 78 grouped by recommended action.

## A. Close now — resolved by the v6 CSS rewrite (24)
| # | Why |
|---|-----|
| 41192 | range breakpoint mixins use `(width < $max)` — no `-0.02px` subtraction to parameterize |
| 40961 | utility `state` generation now emits only the functional `hover:` variant (no useless default) |
| 41289 | `mask-icon` mixin in use (close button, navbar toggler, carousel) — SVG→mask-image largely done |
| 38479 | legend/gutter — gap-based layout is the v6 standard (reporter filed for docs only) |
| 39097 | `.btn-check` input now nested in label → no scroll-to-(0,0) focus jump |
| 39239 | checkbox/radio checked styling on the input via `appearance:none`+`:checked` |
| 39851 | range thumb radius is token-driven (`--range-thumb-border-radius`), not browser default |
| 41137 | `--control-checked-bg`/`-border-color` already CSS vars in `_root.scss` |
| 38213 | navbar toggler is a `.btn` with bg/hover tokens + currentcolor mask icon |
| 39085 | `.btn-outline` hover vs active now distinct (oklch lightness/chroma) |
| 39481 | `.btn-close` uses currentcolor mask + `--btn-close-color: inherit` (freely colorable) |
| 38853 | `.btn-close` colored by currentcolor → `data-bs-theme="dark"` on the button works |
| 38779 | tables read `--theme-*` tokens now (the v5 `text-bg-*`-on-table complaint is moot) |
| 41725 | list-group action vs disabled colors now distinct tokens (`--fg-2` vs `--fg-3`) |
| 41806 | `.list-group-item-action` sets `text-decoration:none` at base (active no longer underlines on hover) |
| 38973 | navbar reworked to theme tokens; `bg-primary`+`data-bs-theme="dark"` replaces `.navbar-dark` |
| 39070 | `$navbar-light/dark-*` removed; navbar color uses `--fg-body`/`light-dark()` |
| 40414 | `_root.scss` sets `color-scheme` per theme → fixes dark scrollbars in light theme |
| 39597 | navbar toggler icon is a currentcolor mask → visible in both modes |
| 35988 | breadcrumb divider rewritten to SVG mask (no text value directive → RTLCSS issue gone) |
| 36595 | dist CSS has zero empty custom properties (token maps fed non-null) |
| 38094 | `$enable-smooth-scroll: false` is already the v6 default |
| 40849 | node-sass dropped + `@use "sass:…"` → Sass 1.79 deprecations gone |
| 40962 | source uses `@use` throughout + namespaced fns → 1.80+ deprecations resolved (tests still `@import`, not shipped) |

## B. Close now — won't-fix / by-design (9)
| # | Why |
|---|-----|
| 34497, 38404 | `.col` is flex `1 1 0` with no `min-width:0` by design — overflow is standard flexbox (user-side fix) |
| 33861 | no `%placeholder` utility generation; `@extend`-of-utilities is an anti-pattern |
| 36026 | floating-label placeholder is intentionally transparent (drives the label transition) |
| 34184 | table cell scoping `> :not(caption) > * > *` requires a row group by design |
| 38750 | white iframe = third-party content's own color-scheme (can't style cross-origin) |
| 40652 | v6 contrast tokens are author-defined (oklch); WCAG/APCA contrast fn no longer used |
| 38889 | gradient borders need `border-image`, not `border-color` — out of scope for core |
| 39386 | bare `.toast` has no position by design; toasts live in `.toast-container` |

## C. Keep — real bugs (12)
| # | Issue |
|---|-------|
| 40702 | `.row > *` applies gutter `margin-top` to `.w-100` column breaks |
| 36656 | input-group doesn't style `.form-control-plaintext` (wraps/misaligns) |
| 39257 | floating label stuck raised for date/time inputs (no `:placeholder-shown`) |
| 39899 | floating label stays raised on cleared-but-`:autofill` inputs (Firefox) |
| 40879 | browser-autofilled values don't trigger JS `.was-validated` |
| 40557 | disabled buttons use opacity → tint against colored backgrounds |
| 37821 | progress bar clips its text label at 0%/very-narrow |
| 41596 | `.progress-stacked` resizes instantly (transition only on inner bar) |
| 36943 | `text-truncate` adds extra height on block/inline-block (no `vertical-align`) — 1-line fix |
| 37909 | `<pre>` horizontal scrollbar covers last code line (flagged a v6 breaking-change target) |
| 39507 | length vars (`$spacer`, etc.) can't be runtime `calc()`/`var()` (compile-time multiply) |
| **42546** | **v6-dev far-right blank strip = `scrollbar-gutter: stable` on `:root` (`_root.scss:177`)** — a real tradeoff that interacts with the dialog scroll-lock (PR #42545). Worth reconsidering (e.g. stable only while a dialog is open). |

## D. Keep — feature requests (19)
36330 (utilities responsive subset), 40567 (min-vh-25/50/75), 40859 (visually-hidden breakpoints),
40927 (breakpoint indicator), 41055 (dvh/svh/lvh units), 41371 (per-side border-width utils),
41227 (hover media query), 39727 (aria-disabled = disabled CSS), 39867 (floating labels for file input),
37345 (numbered list-group `start`), 41500 (pagination `.page-text`), 39053 (dark-mode shadows),
39265 (nav-underline aligned to navbar bottom), 39609 (auto-merge `$custom-colors`), 36607 (abbr underline w/o hover),
36688 (`:host` for shadow DOM), 38150 (transition/animation utilities), 41047 (`--fade-transition` CSS var),
40688 (`[hidden]` scoped to allow `until-found`).

## E. Needs verify / runtime check (14)
38651 (nested grid gutter deform), 41213 (box-sizing:inherit — design call), 38808 (validation focus-ring color),
39199 (form-text inline-form layout), 39522 (legend in floating form), 40827 (`.focus-within` helper),
38980 (table directional border vs inset shadow), 41554 / 41790 (visually-hidden table Chrome scrollbar),
41723 (table bg clips rounded wrapper), 39150 (list-group flush+horizontal borders), 38480 (border contrast ratio),
40872 (`$body-bg` as `var()` build), 42485 (tab border seam at fractional zoom).

### Quick wins worth noting
- **Small bug fixes:** 36943 (text-truncate `vertical-align:top`), 37821/41596 (progress), 40702 (row gutter), 39507.
- **Easy features:** 40567 (min-vh-*), 40859 (visually-hidden breakpoints), 40688 (`[hidden]` until-found).
- **#42546** ties directly to the dialog scroll-lock — flag for a design decision.

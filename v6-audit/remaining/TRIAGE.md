# Remaining 33 (the tail outside js/css/feature labels) — triaged

## Close — resolved by v6 work (5) → v6 label + project + close
| # | Why |
|---|-----|
| 36459 | validation rewritten to `:user-invalid`/`:user-valid` behind `[data-bs-validate]`; pre-filled value no longer conflicts |
| 39721 | carousel rebuilt on CSS scroll-snap (the v5 transform/touch swipe code is gone; Safari 12 is below v6 baseline) |
| 36391 | v5-era StackBlitz tracking issue; v6 has a fresh StackBlitz integration — checklist obsolete |
| 42543 | docs no longer link popper.js.org — tooltip/popover/menu point to Floating UI |
| 37283 | Popper now bundled from `js/src` (no `node_modules/@popperjs` map paths) — broken-vendor-path gone |

## Close — won't-fix (4) → close, no label
| # | Why |
|---|-----|
| 41240 | accordion scroll-jump is browser scroll-anchoring, not collapse code (maintainer: out of scope) |
| 35722 | jQuery-era `$(window).on('load')` carousel advice; v6 carousel init model differs — original PRs closed unmerged |
| 42522 | v6 docs ship no Translations page (community-translations listing dropped) |
| 41390 | v5-only `.browserslistrc` bump; v6 already targets far newer browsers — belongs on the v5 line |

## Keep — real bugs (8)
| # | Issue |
|---|-------|
| 42328 | toggle buttons don't set `aria-pressed="false"` at init (button.js only sets it on click) — labeled v6 |
| 41883 | accordion double-open race (dup of #35685/#39385) |
| 40997 | `parseSelector` over-escapes after `#`, breaking `data-bs-target="#id:not(.show)"` complex selectors |
| 39428 | legend `float`/`clear` reboot pattern forces reflow on `getBoundingClientRect` (has-pr #39498) |
| 39237 | `--toast-spacing` defined on `.toast` but consumed on `.toast-container` → lost via a wrapper (trivial fix) |
| 37478 | BrowserStack CI reliability (still wired in `.github/workflows/browserstack.yml`) |
| 41438 | `release-zip` packages stray `.DS_Store` files (no exclusion in the zip step) |
| 41810 | production `dist/*.min.{js,css}` still emit `sourceMappingURL` comments |

## Keep — features (4)
28968 (unified enter/leave transition classes), 41380 (maintainers' own post-Astro docs tracking issue),
39776 (`change-version.mjs` should rewrite docs content aliases), 41497 (form-validation a11y — ARIA/`aria-live` wiring).

## Docs (10)
**42422** (homepage/example source references undefined `var(--bs-primary)` → white-on-white — fix in `site/src/components/home/ComponentUtilities.astro` + list-groups example CSS), 40833 (carousel-after-load needs manual init), 36978 (`col-auto`), 37262 (heroes screenshot), 37614 (select `aria-hidden`), 38434 (Sass utilities API section → reusable Astro component), 40769 (valid/invalid-feedback docs), 41873 (toast usability caution), 41895 (nested collapse example), 41944 (color-contrast note → mention native `contrast-color()`).

## Needs-verify (2)
38847 (horizontal card reworked to `.card-row`/`.card-img-*` — recheck small-breakpoint corners), 39404 (dashboard example rebuilt with sticky sidebar — recheck whole-page-scroll).

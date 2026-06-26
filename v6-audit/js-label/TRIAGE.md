# `js`-label audit — 41 new issues (not previously triaged)

73 open `js`-labeled issues; 32 already handled in the dialog/drawer + tooltip/popover/menu passes.
These 41 are the remainder, grouped by recommended course of action.

## A. Close now — resolved by the v6 rewrite (9)
| # | Why |
|---|-----|
| 29378 | tooltips/popovers now auto-init via DATA_API delegation — the "opt-in for perf" caveat is gone |
| 36431 | ScrollSpy rebuilt on IntersectionObserver (configurable threshold/rootMargin, auto root) |
| 36544 | Carousel `interval` is number-only now (`DefaultType.interval: 'number'`) |
| 36916 | ESM with named exports + `exports`/`type:module`; no separate-file load-order problem |
| 37245 | base-component disposes the prior instance before re-set (faulty re-set fixed) |
| 37265 | Toast null-`classList` crash guarded by `_queueCallback` `if (!this._element) return` |
| 37969 | Carousel on native CSS scroll-snap — browser owns swipe; old touch/ride conflict gone |
| 38914 | jQuery plugin bridge removed entirely — jQuery integration unsupported in v6 |
| 39094 | function `this`/first-arg = element matches the documented v5.3+ contract (not a bug) |

## B. Close now — won't-fix (1)
| # | Why |
|---|-----|
| 38189 | bad/undefined target — base-component now returns early; specific crash path gone (see 38373) |

## C. Docs (3)
| # | Fix |
|---|-----|
| 41650 | Carousel `.to()` docs example passes strings; should pass numbers |
| 35900 | navbar anchor behind fixed bar → document `scroll-margin-top` (CSS, not JS) |
| 38035 | dropdown `autoClose:false` description — minor clarification (likely close) |

## D. Small, clear fixes — actionable now
| # | Fix | Size |
|---|-----|------|
| 38565 | tab `_keydown` `preventDefault()`s arrows unconditionally → guard `event.altKey`/modifiers so Alt+←/→ history nav works | small JS |
| 37858 / 39198 / 39248 | ScrollSpy calls `findOne(decodeURI(anchor.hash))` unescaped → route through `parseSelector`/`CSS.escape` (one fix, 3 issues; 39248≡39198≡37858 same root) | small-medium JS |
| 35776 | `show()`/`hide()` rely on getter side-effects a minifier can strip → use explicit `reflow()` | small JS |

## E. Keep — real bugs, medium/larger
| # | Issue |
|---|-------|
| 35685 / 39385 | accordion race — quickly toggling siblings can open both (`_isTransitioning`); dup pair |
| 40841 | Collapse `aria-expanded` stuck `true` when trigger targets the `.collapse` class |
| 40526 | ScrollSpy smooth-scroll doesn't move focus to target (a11y regression) |
| 36387 | ScrollSpy `smoothScroll` `preventDefault()` → URL hash never updates |
| 36912 | sticky-navbar/scroll-margin visual offset (clusters with 35900) |
| 41361 | ScrollSpy active items discontinuous (IO "only while intersecting" — likely WONTFIX/design) |
| 38517 | memory leak — `data.js` `elementMap` is a `Map`, not `WeakMap`; removed elements never GC'd |

## F. Feature requests / architecture (keep, roadmap)
| # | Request |
|---|---------|
| 36399 | add `table`/`thead`/`tbody`/`tr`/`td`/`th` to sanitizer allowlist |
| 33761 | rename Alert close event to fit `hidden.bs.*` convention (v6 breaking-change window) |
| 34299 | auto-expand collapse/tab/accordion when its id is in the URL fragment |
| 34836 | remove Collapse `toggle` option (API cleanup) |
| 39540 | Collapse auto-close on outside click |
| 41151 | Collapse `before.show` lifecycle hook (for opacity transitions) |
| 41170 | new Bottom Sheet component |
| 37573 | make show/hide/toggle return a Promise |
| 39301 | option to disable EventHandler automatic listener assignments |
| 41003 | support Shadow DOM for JS plugins |
| 41116 | simplify `bootstrapDelegationHandler` using `Element.closest` (perf) |

## G. Needs verify / maintainer decision (3)
| # | Check |
|---|-------|
| 36931 | switch `mouseenter→mouseover` workaround to native `mouseenter`/`pointerenter`? (still mapped) |
| 37575 | tree-shaking — `sideEffects` lists `js/src/*.js` and modules self-register DATA_API; verify `import { Button }` prunes others |
| 38373 | passing a jQuery/non-DOM object fails silently — should v6 throw a clear error? (overlaps 38189) |

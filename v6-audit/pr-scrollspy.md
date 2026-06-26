## Problem

ScrollSpy chose the active section with a scroll-direction flag + a sequential `offsetTop` tiebreaker that mutated state while walking IntersectionObserver entries. IO delivers entries in no guaranteed order, so when several sections shared the viewport (e.g. the docs right-rail TOC) the highlight was wrong. Coarse defaults also left stale gaps, smooth scroll suppressed the URL hash, focus wasn't managed, and ids with dots/special characters threw.

## Change

Deterministic, geometry-based detection:

- The active section is the **deepest one whose top has scrolled to/above an activation line** near the top of the scroll root, read fresh from `getBoundingClientRect()` on each rAF-throttled scroll — order-independent, immune to section height, no ties. At the bottom the last section wins; above the first, nothing is active.
- **`scrollend`** (with a scroll-idle fallback) settles the final state, restores the URL hash via `history.replaceState`, and moves focus to the target section after a smooth-scroll click.
- Section ids are escaped via `parseSelector`, so dotted/special-character ids no longer throw.
- New `topMargin` option positions the activation line (default `12%`); `rootMargin`/`threshold`/`target`/`smoothScroll` remain.

Supersedes #41016 (its ratio-based selection mis-handles tall sections). Fixes #37858, #39198, #39248, #36387, #40526.

## Verification

- Full unit suite green (1111), lint clean. Added regression tests: multiple-sections-visible determinism, bottom-forces-last, special-character-id escaping, and the settle→hash/focus behavior.
- Verified end-to-end in a real browser against the built bundle (multiple visible → correct single highlight, bottom → last, smooth-scroll click → URL hash + focus).

The docs right-rail TOC uses Bootstrap ScrollSpy directly, so it's fixed transitively.

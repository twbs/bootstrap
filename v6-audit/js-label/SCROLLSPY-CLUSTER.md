# ScrollSpy cluster — review holistically, DON'T close/fix piecemeal

ScrollSpy was rebuilt on IntersectionObserver in v5.2, and there's active churn: a
community member is proposing a full rewrite for v6 (#41900, "broken when switching to
the observer API"), and three open PRs already target pieces of this. Course of action:
**consolidate around the in-flight PRs + the rewrite proposal before touching any of these.**

## Open ScrollSpy issues (9)
| # | Title | Maps to |
|---|-------|---------|
| 37858 | invalid querySelector `#div-2.1` | **PR #41726 (Closes)** |
| 39198 | creates invalid query selector | **PR #41726 (Closes)** |
| 39248 | anchor using dots | **PR #41726 (Closes)** |
| 41361 | active elements discontinuous | **PR #41016** (improve active feedback) |
| 40526 | focus shift bug | PR #41016 / #40653 area |
| 36387 | smoothScroll prevents URL hash change | PR #40653 (tests) — fix TBD |
| 36912 | root-margin disabled by smoothScroll off | smoothScroll behavior cluster |
| 36431 | "not behaving correctly" (broad) | overall rework / #41900 |
| 41900 | **proposal: full ScrollSpy rewrite for v6** | needs maintainer review of approach |
| (35900) | navbar anchor behind fixed bar | adjacent — CSS `scroll-margin-top`, DOCS |

## Open ScrollSpy PRs
| PR | Title | Closes / addresses |
|----|-------|--------------------|
| #41726 | Normalize selector operation in scrollspy | #39198, #37858, #39248 (+#35566) |
| #41016 | ScrollSpy: improve active feedback | 41361 (none-active / post-click) |
| #40653 | Add test cases for SmoothScroll spec | 36387 / 40526 area |
| #36648 | Hash/History helper (offcanvas) | tangential — mentions scrollspy |
| #39291 | Docs: deprecated dark variants | tangential |

## Recommended course of action
1. **Decide on #41900's rewrite proposal first** — it reframes whether the others are individual fixes or superseded by a rewrite.
2. If keeping the current component: **review/merge #41726** (closes 3 selector issues), then **#41016** (active feedback → 41361/40526).
3. Treat 36387/36912 (smoothScroll + URL hash + scroll-margin) as one sub-decision.
4. 35900 → docs (`scroll-margin-top`), not ScrollSpy JS.

> NOTE: these are **removed** from the general js-label buckets. In particular **#36431 was pulled OUT of bucket A** (it was "resolved by IO rewrite," but the cluster shows the IO rewrite is itself contested). The selector trio (37858/39198/39248) was pulled out of the "small fixes" bucket since PR #41726 already handles them.

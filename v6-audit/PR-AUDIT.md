# v5 PRs touching v6-rewritten components — port vs obsolete

83 of 138 open `main`(v5) PRs touch a component v6 rewrote. (These target v5, so they may still be valid for the v5 line — this is purely about whether to **port** the work into v6-dev.)

## ⭐ PORT-CANDIDATES — fix an issue still OPEN in v6 (worth porting / linking)
High value first (fix a confirmed v6 bug):

| v5 PR | Ports to fix open v6 issue | What |
|---|---|---|
| [#42528](https://github.com/twbs/bootstrap/pull/42528) (cleaner) / [#41889](https://github.com/twbs/bootstrap/pull/41889) | [#41869](https://github.com/twbs/bootstrap/issues/41869) | multiple submenus stay open during keyboard nav |
| [#42466](https://github.com/twbs/bootstrap/pull/42466) | [#42328](https://github.com/twbs/bootstrap/issues/42328) | toggle buttons don't seed `aria-pressed` from initial `.active` |
| [#41421](https://github.com/twbs/bootstrap/pull/41421) | [#39026](https://github.com/twbs/bootstrap/issues/39026) | `abbr[title]` underline stripped when it has a tooltip |
| [#39483](https://github.com/twbs/bootstrap/pull/39483) | (open) | floating-label text cut off in `<select>` |

Features still wanted in v6:

| v5 PR | Open v6 issue | What |
|---|---|---|
| [#35151](https://github.com/twbs/bootstrap/pull/35151) | [#42065](https://github.com/twbs/bootstrap/issues/42065) | hoverable/dismissable tooltips (WCAG 1.4.13) |
| [#36155](https://github.com/twbs/bootstrap/pull/36155) | [#36026](https://github.com/twbs/bootstrap/issues/36026) | always-visible floating labels |
| [#36648](https://github.com/twbs/bootstrap/pull/36648) | [#36647](https://github.com/twbs/bootstrap/issues/36647) | offcanvas/drawer close on browser back button |
| [#39477](https://github.com/twbs/bootstrap/pull/39477) | [#39433](https://github.com/twbs/bootstrap/issues/39433) | xxl dialog size |
| [#36125](https://github.com/twbs/bootstrap/pull/36125) | [#35998](https://github.com/twbs/bootstrap/issues/35998) | `.sticky-thead` sticky table headers |
| [#38167](https://github.com/twbs/bootstrap/pull/38167) / [#38296](https://github.com/twbs/bootstrap/pull/38296) | [#38150](https://github.com/twbs/bootstrap/issues/38150) | animation/transition utilities (dupes — pick one) |
| [#35465](https://github.com/twbs/bootstrap/pull/35465) / [#37398](https://github.com/twbs/bootstrap/pull/37398) | (utilities API) | programmatic utilities-map mixins |
| [#36332](https://github.com/twbs/bootstrap/pull/36332) | [#35664](https://github.com/twbs/bootstrap/issues/35664) / [#39290](https://github.com/twbs/bootstrap/issues/39290) | `setConfig` post-creation (⚠ edits removed util files — needs rework) |
| [#37162](https://github.com/twbs/bootstrap/pull/37162) / [#38056](https://github.com/twbs/bootstrap/pull/38056) | [#36688](https://github.com/twbs/bootstrap/issues/36688) | shadow-DOM `:host` support (two approaches) |
| [#41710](https://github.com/twbs/bootstrap/pull/41710) | [#35941](https://github.com/twbs/bootstrap/issues/35941) | forced-colors / high-contrast focus support |
| [#41711](https://github.com/twbs/bootstrap/pull/41711) | [#35793](https://github.com/twbs/bootstrap/issues/35793)-adjacent | enforce focus on menu trigger after selection (partial) |
| [#41195](https://github.com/twbs/bootstrap/pull/41195) | (open) | `$grid-breakpoint` max-offset Sass var |
| [#42453](https://github.com/twbs/bootstrap/pull/42453) | [#42447](https://github.com/twbs/bootstrap/issues/42447) | Sass `luminance` breaks on non-integer color channels |

## ✅ SUPERSEDED by v6 work — resolved
Closed in favor of the v6 PR:

| v5 PR (closed) | Superseded by |
|---|---|
| [#35393](https://github.com/twbs/bootstrap/pull/35393), [#38857](https://github.com/twbs/bootstrap/pull/38857) | [#42544](https://github.com/twbs/bootstrap/pull/42544) (focus-restore scroll + dispose) |
| [#40789](https://github.com/twbs/bootstrap/pull/40789) | [#42545](https://github.com/twbs/bootstrap/pull/42545) (scrollbar-gutter / scroll-lock) |
| [#40851](https://github.com/twbs/bootstrap/pull/40851) | [#42551](https://github.com/twbs/bootstrap/pull/42551) (popover setContent→show) |
| [#40994](https://github.com/twbs/bootstrap/pull/40994) | [#42550](https://github.com/twbs/bootstrap/pull/42550) (popover arrow with header) |
| [#42527](https://github.com/twbs/bootstrap/pull/42527) | [#42551](https://github.com/twbs/bootstrap/pull/42551) (forms-in-menu clicks) |
| [#39441](https://github.com/twbs/bootstrap/pull/39441) | v6 navbar theme-token rewrite ([#39070](https://github.com/twbs/bootstrap/issues/39070)) |

Kept open by maintainer (tracked for a v5.x release — **don't** close):

| v5 PR | Note |
|---|---|
| [#41157](https://github.com/twbs/bootstrap/pull/41157) | ≈ [#42550](https://github.com/twbs/bootstrap/pull/42550) (menu contenteditable) — added to v5.4.0 |
| [#41016](https://github.com/twbs/bootstrap/pull/41016), [#41726](https://github.com/twbs/bootstrap/pull/41726) | ≈ [#42557](https://github.com/twbs/bootstrap/pull/42557) (ScrollSpy) — added to v5.4.0 |
| [#42511](https://github.com/twbs/bootstrap/pull/42511) | list-group action color ([#41725](https://github.com/twbs/bootstrap/issues/41725) resolved in v6) — added to v5.4.0 |
| [#38079](https://github.com/twbs/bootstrap/pull/38079) | offcanvas focus-scroll — in v5.4.0 / v5.3.4 project |
| [#39091](https://github.com/twbs/bootstrap/pull/39091), [#39295](https://github.com/twbs/bootstrap/pull/39295), [#39107](https://github.com/twbs/bootstrap/pull/39107) | v5.3 color-mode groundwork (superseded by v6 `.theme-*` tokens) — in v5.4.0 project |
| [#38917](https://github.com/twbs/bootstrap/pull/38917) | closed manually |

## ♻️ OBSOLETE for v6 — v6 already resolves it differently (no port)
**Accordion double-open race** ([#41893](https://github.com/twbs/bootstrap/pull/41893); issues [#41883](https://github.com/twbs/bootstrap/issues/41883) / [#35685](https://github.com/twbs/bootstrap/issues/35685) / [#39385](https://github.com/twbs/bootstrap/issues/39385)) — **verified resolved**: v6's accordion is native `<details name>` with zero JS, so exclusivity is browser-enforced synchronously (couldn't double-open even by forcing `.open=true` on all items same-tick). #41893 patches `collapse.js`, which the v6 accordion doesn't use. (Legacy `.collapse`+`data-bs-parent` accordions still use collapse.js and could still race — but that's not the v6 documented accordion.)


dropdown→Menu: [#34120](https://github.com/twbs/bootstrap/pull/34120), [#34349](https://github.com/twbs/bootstrap/pull/34349), [#35692](https://github.com/twbs/bootstrap/pull/35692), [#35901](https://github.com/twbs/bootstrap/pull/35901), [#37755](https://github.com/twbs/bootstrap/pull/37755) ·
modal→native Dialog: [#36737](https://github.com/twbs/bootstrap/pull/36737), [#38564](https://github.com/twbs/bootstrap/pull/38564), [#41607](https://github.com/twbs/bootstrap/pull/41607), [#41867](https://github.com/twbs/bootstrap/pull/41867), [#42504](https://github.com/twbs/bootstrap/pull/42504) ·
offcanvas aria-modal: [#38462](https://github.com/twbs/bootstrap/pull/38462) ·
button/switch/link tokens: [#38062](https://github.com/twbs/bootstrap/pull/38062), [#38109](https://github.com/twbs/bootstrap/pull/38109), [#38277](https://github.com/twbs/bootstrap/pull/38277), [#38352](https://github.com/twbs/bootstrap/pull/38352), [#39098](https://github.com/twbs/bootstrap/pull/39098), [#39099](https://github.com/twbs/bootstrap/pull/39099) ·
navbar/theme/color-scheme: [#39109](https://github.com/twbs/bootstrap/pull/39109), [#39989](https://github.com/twbs/bootstrap/pull/39989), [#41194](https://github.com/twbs/bootstrap/pull/41194), [#41232](https://github.com/twbs/bootstrap/pull/41232), [#41320](https://github.com/twbs/bootstrap/pull/41320), [#41419](https://github.com/twbs/bootstrap/pull/41419) ·
tables/utilities: [#38826](https://github.com/twbs/bootstrap/pull/38826), [#38991](https://github.com/twbs/bootstrap/pull/38991) ·
tooltip handlers: [#40856](https://github.com/twbs/bootstrap/pull/40856) ·
menu parent: [#41037](https://github.com/twbs/bootstrap/pull/41037) ·
text-wrap utils already shipped: [#41491](https://github.com/twbs/bootstrap/pull/41491) ·
collapse focus-scroll: [#41633](https://github.com/twbs/bootstrap/pull/41633).

## 🤔 CONSIDER — proposals / behavioral calls reshaped (not settled) by the rewrite
[#34396](https://github.com/twbs/bootstrap/pull/34396) (dropdown click-inside),
[#36135](https://github.com/twbs/bootstrap/pull/36135) (don't close on input click),
[#38828](https://github.com/twbs/bootstrap/pull/38828) (menu arrow cycling),
[#39235](https://github.com/twbs/bootstrap/pull/39235) (`.bg-*-subtle` + opacity),
[#39825](https://github.com/twbs/bootstrap/pull/39825) (docs navbar focus-visible),
[#39941](https://github.com/twbs/bootstrap/pull/39941) (keep authored `role="dialog"`),
[#40553](https://github.com/twbs/bootstrap/pull/40553) (drawer scroll-after-close option),
[#40574](https://github.com/twbs/bootstrap/pull/40574) (bubbling-phase delegation),
[#40976](https://github.com/twbs/bootstrap/pull/40976) (grid debug class),
[#41080](https://github.com/twbs/bootstrap/pull/41080) (condensed-navbar dropdown),
[#41715](https://github.com/twbs/bootstrap/pull/41715) ([#39290](https://github.com/twbs/bootstrap/issues/39290) dialog dynamic configs),
[#42055](https://github.com/twbs/bootstrap/pull/42055) / [#42479](https://github.com/twbs/bootstrap/pull/42479) (Sass/JSDoc docs).

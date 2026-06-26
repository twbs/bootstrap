# v6-dev Issue Audit — Master Ledger

Single consolidated pickup point for the whole issue triage. Every triaged issue across all label passes, with its disposition, the v6 PR that fixes it (if any), and its **live GitHub state** at last sync.

- **Total triaged:** 262 issues · **✅ closed:** 109 · **⬜ still open:** 153
- **Status** = live issue state on GitHub. **✅ = closed** (actioned/resolved). **⬜ = open** (still on the backlog, or its fix is in an unmerged PR — see PR column).
- Re-sync anytime with `v6-audit/sync-ledger.sh` (re-pulls live `gh` state and regenerates this file).

**Disposition key:** `CLOSE-RESOLVED` fixed by the v6 rewrite · `CLOSE-WONTFIX` by-design/out-of-scope · `KEEP-BUG` real v6 bug · `KEEP-FEATURE` feature/roadmap · `DOCS` docs-only · `VERIFY` likely-resolved, confirm before close · `NEEDS-VERIFY` needs device/visual repro.

Source tables: `AUDIT.md`/`BATCH2.md` (Dialog/Drawer), `components/TRIAGE.md` (Tooltip/Popover/Menu), `js-label/TRIAGE.md` + `SCROLLSPY-CLUSTER.md` (JS/ScrollSpy), `css-label/TRIAGE.md` (CSS), `remaining/TRIAGE.md` (tail). PR↔issue map in `HANDOFF.md §8`; v5-PR port analysis in `PR-AUDIT.md`.

## Dialog/Drawer

### KEEP-BUG (17)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [34213](https://github.com/twbs/bootstrap/issues/34213) |  | `hide()` still returns early while `_isTransitioning` |
| ⬜ | [36962](https://github.com/twbs/bootstrap/issues/36962) |  | Responsive `lg:drawer` dismiss `.closest('.drawer')` won't match (labeled v6) |
| ⬜ | [39900](https://github.com/twbs/bootstrap/issues/39900) |  | NVDA reads all modal content on launch; needs SR testing |
| ⬜ | [39972](https://github.com/twbs/bootstrap/issues/39972) | [#42545](https://github.com/twbs/bootstrap/pull/42545) | `dialog-open` bare overflow:hidden, no gutter compensation → shift |
| ⬜ | [42459](https://github.com/twbs/bootstrap/issues/42459) |  | Dialog content overflows on resize (reported on v6-dev) |
| ⬜ | [38070](https://github.com/twbs/bootstrap/issues/38070) | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Close scrolls back to trigger (focus w/o `{preventScroll}`) |
| ⬜ | [41615](https://github.com/twbs/bootstrap/issues/41615) | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Close scrolls to top w/ `scroll-padding-top` |
| ⬜ | [35391](https://github.com/twbs/bootstrap/issues/35391) | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Restore focus with `{preventScroll:true}` |
| ⬜ | [36681](https://github.com/twbs/bootstrap/issues/36681) |  | Offcanvas anchor click stops scrolling (Chrome) |
| ⬜ | [35934](https://github.com/twbs/bootstrap/issues/35934) | [#42544](https://github.com/twbs/bootstrap/pull/42544) | `dispose()` on open modal leaves body mutations |
| ⬜ | [39910](https://github.com/twbs/bootstrap/issues/39910) | [#42544](https://github.com/twbs/bootstrap/pull/42544) | `dispose()` doesn't reset scrollbars |
| ⬜ | [39221](https://github.com/twbs/bootstrap/issues/39221) | [#42545](https://github.com/twbs/bootstrap/pull/42545) | Offcanvas open 1px displacement (scrollbar) |
| ⬜ | [40659](https://github.com/twbs/bootstrap/issues/40659) | [#42545](https://github.com/twbs/bootstrap/pull/42545) | `scrollbar-gutter:stable` shifts content + white gutters |
| ⬜ | [40908](https://github.com/twbs/bootstrap/issues/40908) | [#42545](https://github.com/twbs/bootstrap/pull/42545) | Safari offcanvas open changes window width → media query |
| ⬜ | [39270](https://github.com/twbs/bootstrap/issues/39270) |  | navbar-offcanvas translateY page-width overflow (check) |
| ⬜ | [39287](https://github.com/twbs/bootstrap/issues/39287) |  | Initial transition missing when placement set via JS |
| ✅ | [41307](https://github.com/twbs/bootstrap/issues/41307) |  | Modal scale/position w/ pinch-zoom iOS (likely wontfix) |

### VERIFY (15)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [38447](https://github.com/twbs/bootstrap/issues/38447) |  | Non-modal `show()` gets no aria-modal; verify backdrop:false+scroll:false |
| ✅ | [38887](https://github.com/twbs/bootstrap/issues/38887) |  | Listeners bound once in constructor, not per-open |
| ✅ | [41473](https://github.com/twbs/bootstrap/issues/41473) |  | `_queueCallback` guards null element |
| ✅ | [38162](https://github.com/twbs/bootstrap/issues/38162) |  | dialog-base non-modal Esc handler |
| ✅ | [37155](https://github.com/twbs/bootstrap/issues/37155) |  | Native `cancel` fires on Esc after backdrop click |
| ✅ | [39408](https://github.com/twbs/bootstrap/issues/39408) |  | `modal:false` → native non-modal allows outside focus |
| ✅ | [38515](https://github.com/twbs/bootstrap/issues/38515) |  | Native top-layer/inert by design; use `modal:false` |
| ✅ | [39780](https://github.com/twbs/bootstrap/issues/39780) |  | `_isTransitioning` blocks toggle mid-transition |
| ✅ | [41606](https://github.com/twbs/bootstrap/issues/41606) |  | Native dialog focus handling |
| ✅ | [41059](https://github.com/twbs/bootstrap/issues/41059) |  | `showModal()` native top-layer/inert |
| ⬜ | [34584](https://github.com/twbs/bootstrap/issues/34584) |  | Native non-modal `show()` semantics |
| ✅ | [37613](https://github.com/twbs/bootstrap/issues/37613) |  | `dialog-instant` class → `_isAnimated()` false |
| ✅ | [41430](https://github.com/twbs/bootstrap/issues/41430) |  | No ScrollBarHelper / width measurement |
| ✅ | [40640](https://github.com/twbs/bootstrap/issues/40640) |  | `--dialog-width` token settable per element |
| ✅ | [39987](https://github.com/twbs/bootstrap/issues/39987) |  | Native `::backdrop`; verify manual-pointer-open case |

### DOCS (1)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [39415](https://github.com/twbs/bootstrap/issues/39415) |  | offcanvas-navbar example uses non-standard `offcanvas-collapse` |

### KEEP-FEATURE (10)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [35664](https://github.com/twbs/bootstrap/issues/35664) |  | `setOptions()` after creation |
| ⬜ | [41188](https://github.com/twbs/bootstrap/issues/41188) |  | Reliable transition-complete callback/API |
| ⬜ | [31266](https://github.com/twbs/bootstrap/issues/31266) |  | Chainable `.on()` listener method |
| ⬜ | [37158](https://github.com/twbs/bootstrap/issues/37158) |  | Keyboard-escape & focus options for Toasts |
| ⬜ | [38911](https://github.com/twbs/bootstrap/issues/38911) |  | Responsive offcanvas placement per breakpoint |
| ⬜ | [39290](https://github.com/twbs/bootstrap/issues/39290) |  | Re-evaluate modal configs on `show()` |
| ⬜ | [39433](https://github.com/twbs/bootstrap/issues/39433) |  | `modal-xxl` size (has-pr) |
| ⬜ | [41580](https://github.com/twbs/bootstrap/issues/41580) |  | Close-button a11y without CSS |
| ⬜ | [37916](https://github.com/twbs/bootstrap/issues/37916) |  | Make hide-on-window-resize optional |
| ⬜ | [36647](https://github.com/twbs/bootstrap/issues/36647) |  | Close offcanvas on browser back button |

### CLOSE-RESOLVED (11)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [33727](https://github.com/twbs/bootstrap/issues/33727) |  | No separate backdrop div to leak (native `::backdrop`) |
| ✅ | [34309](https://github.com/twbs/bootstrap/issues/34309) |  | Native `::backdrop` — no backdrop element/root to configure |
| ✅ | [36463](https://github.com/twbs/bootstrap/issues/36463) |  | `_closeAndCleanup` keeps `dialog-open` while any modal dialog remains |
| ✅ | [38814](https://github.com/twbs/bootstrap/issues/38814) |  | `.modal` container model gone; native dialog is the element |
| ✅ | [39258](https://github.com/twbs/bootstrap/issues/39258) |  | Dialog/drawer no longer use the custom FocusTrap util |
| ✅ | [39862](https://github.com/twbs/bootstrap/issues/39862) |  | Tab-cycle page scroll was custom focus-trap; native trap now |
| ✅ | [40873](https://github.com/twbs/bootstrap/issues/40873) |  | `::backdrop` transitions with the dialog in CSS |
| ✅ | [41005](https://github.com/twbs/bootstrap/issues/41005) |  | No manual `aria-hidden`; top layer + native inert |
| ✅ | [41958](https://github.com/twbs/bootstrap/issues/41958) |  | Shift-Tab bg scroll was custom focus-trap; native trap |
| ✅ | [42440](https://github.com/twbs/bootstrap/issues/42440) |  | Native dialog uses `[open]`, no inline `display` styles (CSP) |
| ✅ | [42503](https://github.com/twbs/bootstrap/issues/42503) |  | Native focus trap; DOM order irrelevant |

## Tooltip/Popover/Menu

### KEEP-BUG (18)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [37206](https://github.com/twbs/bootstrap/issues/37206) |  | setContent tears down shown popover |
| ⬜ | [37935](https://github.com/twbs/bootstrap/issues/37935) |  | tooltip dead in `.form-floating` (label pointer-events:none) |
| ⬜ | [38597](https://github.com/twbs/bootstrap/issues/38597) |  | tooltip z-index over fixed navbar |
| ⬜ | [39010](https://github.com/twbs/bootstrap/issues/39010) |  | click+focus can't combine to dismiss |
| ⬜ | [39026](https://github.com/twbs/bootstrap/issues/39026) |  | `abbr[title]` underline stripped by `_fixTitle` |
| ⬜ | [39861](https://github.com/twbs/bootstrap/issues/39861) | [#42548](https://github.com/twbs/bootstrap/pull/42548) | preventDefault on show blocks reopening (`_isHovered` not reset) |
| ⬜ | [40525](https://github.com/twbs/bootstrap/issues/40525) | [#42551](https://github.com/twbs/bootstrap/pull/42551) | setContent→show fails `_isWithContent` gate |
| ⬜ | [40993](https://github.com/twbs/bootstrap/issues/40993) | [#42550](https://github.com/twbs/bootstrap/pull/42550) | bottom popover arrow bg ≠ header |
| ⬜ | [41021](https://github.com/twbs/bootstrap/issues/41021) | [#42550](https://github.com/twbs/bootstrap/pull/42550) | contenteditable arrow keys blocked in menu |
| ⬜ | [41049](https://github.com/twbs/bootstrap/issues/41049) |  | menu width in collapsed navbar |
| ✅ | [41167](https://github.com/twbs/bootstrap/issues/41167) |  | arrow nav dead when toggle is `<input>` (maybe Combobox) |
| ⬜ | [41630](https://github.com/twbs/bootstrap/issues/41630) |  | tabs + tab-menu keyboard nav |
| ⬜ | [41670](https://github.com/twbs/bootstrap/issues/41670) |  | menu in table clipped by row stacking |
| ⬜ | [41803](https://github.com/twbs/bootstrap/issues/41803) | [#42551](https://github.com/twbs/bootstrap/pull/42551) | label click in form-in-menu closes menu |
| ⬜ | [41869](https://github.com/twbs/bootstrap/issues/41869) |  | autoClose:outside + keyboard leaves multiple shown |
| ⬜ | [41925](https://github.com/twbs/bootstrap/issues/41925) | [#42548](https://github.com/twbs/bootstrap/pull/42548) | `data-bs-content` "true"/"false" coerced to boolean → TypeError |
| ⬜ | [42065](https://github.com/twbs/bootstrap/issues/42065) |  | tooltip/popover not hoverable (WCAG 1.4.13) |
| ⬜ | [42443](https://github.com/twbs/bootstrap/issues/42443) | [#42549](https://github.com/twbs/bootstrap/pull/42549) | SECURITY: `data:text/html` passes the URL sanitizer |

### VERIFY (8)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [34400](https://github.com/twbs/bootstrap/issues/34400) |  | toggle still preventDefaults links — confirm v6 behavior |
| ✅ | [37363](https://github.com/twbs/bootstrap/issues/37363) |  | tooltip honors `placement` (Floating UI flip) |
| ✅ | [39081](https://github.com/twbs/bootstrap/issues/39081) |  | second `.show()` keeps tooltip shown |
| ✅ | [39945](https://github.com/twbs/bootstrap/issues/39945) |  | SR announcement — `aria-label` added; test NVDA/VO |
| ✅ | [39984](https://github.com/twbs/bootstrap/issues/39984) |  | dark menu/navbar under dark wrapper |
| ✅ | [40524](https://github.com/twbs/bootstrap/issues/40524) |  | `setContent()` re-shows shown popover |
| ✅ | [41588](https://github.com/twbs/bootstrap/issues/41588) |  | `_completeHide` TypeError w/ DOM-removing widget |
| ✅ | [36944](https://github.com/twbs/bootstrap/issues/36944) |  | tooltip on radio (iOS Safari focus) — mostly browser |

### NEEDS-VERIFY (3)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [38200](https://github.com/twbs/bootstrap/issues/38200) |  | popover arrow at fractional zoom (visual 110/125%) |
| ⬜ | [38414](https://github.com/twbs/bootstrap/issues/38414) |  | Firefox mobile-emulation double-toggle (no Firefox here) |
| ⬜ | [40624](https://github.com/twbs/bootstrap/issues/40624) |  | popover border/arrow overlap (1080p visual) |

### DOCS (6)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [37042](https://github.com/twbs/bootstrap/issues/37042) | [#42552](https://github.com/twbs/bootstrap/pull/42552) | toggle via JS docs |
| ✅ | [37665](https://github.com/twbs/bootstrap/issues/37665) |  | tooltip usage snippet |
| ⬜ | [40571](https://github.com/twbs/bootstrap/issues/40571) | [#42550](https://github.com/twbs/bootstrap/pull/42550) | content-function docs |
| ✅ | [40822](https://github.com/twbs/bootstrap/issues/40822) |  | getInstance description |
| ⬜ | [40995](https://github.com/twbs/bootstrap/issues/40995) | [#42552](https://github.com/twbs/bootstrap/pull/42552) | `a.dropdown-toggle` → `<button>` |
| ⬜ | [41020](https://github.com/twbs/bootstrap/issues/41020) | [#42552](https://github.com/twbs/bootstrap/pull/42552) | tooltip `selector` docs |

### KEEP-FEATURE (4)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [31088](https://github.com/twbs/bootstrap/issues/31088) |  | don't dismiss popover on click-inside / allow text selection |
| ⬜ | [37205](https://github.com/twbs/bootstrap/issues/37205) |  | caret indicator for menus |
| ⬜ | [38801](https://github.com/twbs/bootstrap/issues/38801) |  | arrow-key cycling / menubar APG |
| ⬜ | [38858](https://github.com/twbs/bootstrap/issues/38858) |  | log offending DOM node on duplicate-instance error |

### CLOSE-RESOLVED (10)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [33957](https://github.com/twbs/bootstrap/issues/33957) |  | Menu always runs Floating UI (no nav exception) |
| ✅ | [34110](https://github.com/twbs/bootstrap/issues/34110) |  | Menu now has a `strategy` option |
| ✅ | [35774](https://github.com/twbs/bootstrap/issues/35774) |  | Menu `container` + `boundary` + `strategy:fixed` |
| ✅ | [35793](https://github.com/twbs/bootstrap/issues/35793) |  | Menu Escape focuses the toggle |
| ✅ | [36789](https://github.com/twbs/bootstrap/issues/36789) |  | Popper is gone (Floating UI) |
| ✅ | [37428](https://github.com/twbs/bootstrap/issues/37428) |  | Escape keydown guarded (`if (!getToggleButton) return`) |
| ✅ | [37474](https://github.com/twbs/bootstrap/issues/37474) |  | `_activeTrigger` always initialized |
| ✅ | [38842](https://github.com/twbs/bootstrap/issues/38842) |  | Menu has a `container` option |
| ✅ | [39103](https://github.com/twbs/bootstrap/issues/39103) |  | Now the dedicated Combobox component |
| ✅ | [39692](https://github.com/twbs/bootstrap/issues/39692) |  | Tooltip Escape dismiss already implemented in v6 |

### CLOSE-WONTFIX (7)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [37977](https://github.com/twbs/bootstrap/issues/37977) |  | input+toggle is Combobox's job; focus is integral |
| ✅ | [38874](https://github.com/twbs/bootstrap/issues/38874) |  | use `customClass` + `--tooltip-max-width` |
| ✅ | [39182](https://github.com/twbs/bootstrap/issues/39182) |  | One-instance-per-element intentional (different keys) |
| ✅ | [41148](https://github.com/twbs/bootstrap/issues/41148) |  | manual `.show` class never inits Menu — by design (DUP 41344) |
| ✅ | [41182](https://github.com/twbs/bootstrap/issues/41182) |  | select arrow vs autofill — browser limitation |
| ✅ | [41344](https://github.com/twbs/bootstrap/issues/41344) |  | initial `.show` + autoClose — by design (DUP 41148) |
| ✅ | [41354](https://github.com/twbs/bootstrap/issues/41354) |  | Enter submits form — `<button>` type=submit HTML behavior |

## ScrollSpy

### KEEP-BUG (7)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [37858](https://github.com/twbs/bootstrap/issues/37858) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | invalid querySelector `#div-2.1` (selector escaping) |
| ⬜ | [39198](https://github.com/twbs/bootstrap/issues/39198) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | creates invalid query selector (selector escaping) |
| ⬜ | [39248](https://github.com/twbs/bootstrap/issues/39248) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | anchor using dots (selector escaping) |
| ⬜ | [40526](https://github.com/twbs/bootstrap/issues/40526) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | smooth-scroll doesn't move focus to target (a11y) |
| ⬜ | [36387](https://github.com/twbs/bootstrap/issues/36387) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | smoothScroll preventDefault → URL hash never updates |
| ⬜ | [36912](https://github.com/twbs/bootstrap/issues/36912) |  | root-margin disabled by smoothScroll off (cluster 35900) |
| ⬜ | [41361](https://github.com/twbs/bootstrap/issues/41361) |  | active items discontinuous (IO "only while intersecting") |

### KEEP-FEATURE (1)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [41900](https://github.com/twbs/bootstrap/issues/41900) |  | proposal: full ScrollSpy rewrite (superseded by #42557 approach) |

## JS (misc)

### KEEP-BUG (6)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [38565](https://github.com/twbs/bootstrap/issues/38565) | [#42553](https://github.com/twbs/bootstrap/pull/42553) | tab `_keydown` preventDefaults arrows unconditionally (Alt+←/→) |
| ⬜ | [35776](https://github.com/twbs/bootstrap/issues/35776) |  | show()/hide() rely on getter side-effects a minifier can strip |
| ✅ | [35685](https://github.com/twbs/bootstrap/issues/35685) |  | accordion race — toggling siblings can open both (dup 39385) |
| ✅ | [39385](https://github.com/twbs/bootstrap/issues/39385) |  | accordion race (dup 35685) |
| ⬜ | [40841](https://github.com/twbs/bootstrap/issues/40841) |  | Collapse `aria-expanded` stuck true when trigger targets `.collapse` |
| ⬜ | [38517](https://github.com/twbs/bootstrap/issues/38517) |  | memory leak — `data.js` elementMap is Map not WeakMap |

### NEEDS-VERIFY (3)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [36931](https://github.com/twbs/bootstrap/issues/36931) |  | switch mouseenter→mouseover workaround to native? |
| ⬜ | [37575](https://github.com/twbs/bootstrap/issues/37575) |  | tree-shaking — verify `import { Button }` prunes others |
| ⬜ | [38373](https://github.com/twbs/bootstrap/issues/38373) |  | non-DOM object fails silently — should v6 throw? (overlaps 38189) |

### DOCS (3)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [41650](https://github.com/twbs/bootstrap/issues/41650) |  | Carousel `.to()` docs example passes strings; should be numbers |
| ⬜ | [35900](https://github.com/twbs/bootstrap/issues/35900) |  | navbar anchor behind fixed bar → document `scroll-margin-top` |
| ⬜ | [38035](https://github.com/twbs/bootstrap/issues/38035) | [#42553](https://github.com/twbs/bootstrap/pull/42553) | dropdown `autoClose:false` description clarification |

### KEEP-FEATURE (11)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [36399](https://github.com/twbs/bootstrap/issues/36399) |  | add table/thead/tbody/tr/td/th to sanitizer allowlist |
| ⬜ | [33761](https://github.com/twbs/bootstrap/issues/33761) |  | rename Alert close event to `hidden.bs.*` convention |
| ⬜ | [34299](https://github.com/twbs/bootstrap/issues/34299) |  | auto-expand collapse/tab/accordion when id in URL fragment |
| ⬜ | [34836](https://github.com/twbs/bootstrap/issues/34836) |  | remove Collapse `toggle` option (API cleanup) |
| ⬜ | [39540](https://github.com/twbs/bootstrap/issues/39540) |  | Collapse auto-close on outside click |
| ⬜ | [41151](https://github.com/twbs/bootstrap/issues/41151) |  | Collapse `before.show` lifecycle hook |
| ⬜ | [41170](https://github.com/twbs/bootstrap/issues/41170) |  | new Bottom Sheet component |
| ⬜ | [37573](https://github.com/twbs/bootstrap/issues/37573) |  | make show/hide/toggle return a Promise |
| ⬜ | [39301](https://github.com/twbs/bootstrap/issues/39301) |  | option to disable EventHandler auto listener assignments |
| ⬜ | [41003](https://github.com/twbs/bootstrap/issues/41003) |  | support Shadow DOM for JS plugins |
| ⬜ | [41116](https://github.com/twbs/bootstrap/issues/41116) |  | simplify bootstrapDelegationHandler using Element.closest |

### CLOSE-RESOLVED (9)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [29378](https://github.com/twbs/bootstrap/issues/29378) |  | tooltips/popovers auto-init via DATA_API delegation |
| ⬜ | [36431](https://github.com/twbs/bootstrap/issues/36431) | [#42557](https://github.com/twbs/bootstrap/pull/42557) | ScrollSpy rebuilt on IntersectionObserver |
| ✅ | [36544](https://github.com/twbs/bootstrap/issues/36544) |  | Carousel `interval` is number-only now |
| ✅ | [36916](https://github.com/twbs/bootstrap/issues/36916) |  | ESM named exports; no load-order problem |
| ✅ | [37245](https://github.com/twbs/bootstrap/issues/37245) |  | base-component disposes prior instance before re-set |
| ✅ | [37265](https://github.com/twbs/bootstrap/issues/37265) |  | Toast null-classList crash guarded |
| ✅ | [37969](https://github.com/twbs/bootstrap/issues/37969) |  | Carousel on CSS scroll-snap — old touch/ride conflict gone |
| ✅ | [38914](https://github.com/twbs/bootstrap/issues/38914) |  | jQuery plugin bridge removed entirely |
| ✅ | [39094](https://github.com/twbs/bootstrap/issues/39094) |  | function this/first-arg = element (documented contract) |

### CLOSE-WONTFIX (1)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [38189](https://github.com/twbs/bootstrap/issues/38189) |  | bad/undefined target — base-component returns early now |

## CSS

### KEEP-BUG (12)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [40702](https://github.com/twbs/bootstrap/issues/40702) |  | `.row > *` applies gutter margin-top to `.w-100` column breaks |
| ⬜ | [36656](https://github.com/twbs/bootstrap/issues/36656) |  | input-group doesn't style `.form-control-plaintext` |
| ⬜ | [39257](https://github.com/twbs/bootstrap/issues/39257) |  | floating label stuck raised for date/time inputs |
| ⬜ | [39899](https://github.com/twbs/bootstrap/issues/39899) |  | floating label stays raised on cleared-but-:autofill (Firefox) |
| ⬜ | [40879](https://github.com/twbs/bootstrap/issues/40879) |  | browser-autofilled values don't trigger `.was-validated` |
| ⬜ | [40557](https://github.com/twbs/bootstrap/issues/40557) |  | disabled buttons use opacity → tint against colored bg |
| ⬜ | [37821](https://github.com/twbs/bootstrap/issues/37821) |  | progress bar clips its text label at 0%/very-narrow |
| ⬜ | [41596](https://github.com/twbs/bootstrap/issues/41596) |  | `.progress-stacked` resizes instantly (transition only on inner) |
| ⬜ | [36943](https://github.com/twbs/bootstrap/issues/36943) |  | `text-truncate` adds extra height (no vertical-align) — 1-line fix |
| ⬜ | [37909](https://github.com/twbs/bootstrap/issues/37909) |  | `<pre>` horizontal scrollbar covers last code line |
| ⬜ | [39507](https://github.com/twbs/bootstrap/issues/39507) |  | length vars can't be runtime calc()/var() (compile-time multiply) |
| ⬜ | [42546](https://github.com/twbs/bootstrap/issues/42546) |  | v6-dev far-right blank strip = `scrollbar-gutter:stable` on :root (ties to #42545) |

### NEEDS-VERIFY (14)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [38651](https://github.com/twbs/bootstrap/issues/38651) |  | nested grid gutter deform |
| ⬜ | [41213](https://github.com/twbs/bootstrap/issues/41213) |  | box-sizing:inherit — design call |
| ⬜ | [38808](https://github.com/twbs/bootstrap/issues/38808) |  | validation focus-ring color |
| ⬜ | [39199](https://github.com/twbs/bootstrap/issues/39199) |  | form-text inline-form layout |
| ⬜ | [39522](https://github.com/twbs/bootstrap/issues/39522) |  | legend in floating form |
| ⬜ | [40827](https://github.com/twbs/bootstrap/issues/40827) |  | `.focus-within` helper |
| ✅ | [38980](https://github.com/twbs/bootstrap/issues/38980) |  | table directional border vs inset shadow |
| ⬜ | [41554](https://github.com/twbs/bootstrap/issues/41554) |  | visually-hidden table Chrome scrollbar (dup 41790) |
| ⬜ | [41790](https://github.com/twbs/bootstrap/issues/41790) |  | visually-hidden table Chrome scrollbar (dup 41554) |
| ⬜ | [41723](https://github.com/twbs/bootstrap/issues/41723) |  | table bg clips rounded wrapper |
| ⬜ | [39150](https://github.com/twbs/bootstrap/issues/39150) |  | list-group flush+horizontal borders |
| ⬜ | [38480](https://github.com/twbs/bootstrap/issues/38480) |  | border contrast ratio (1.63:1) |
| ✅ | [40872](https://github.com/twbs/bootstrap/issues/40872) |  | `$body-bg` as var() build |
| ⬜ | [42485](https://github.com/twbs/bootstrap/issues/42485) |  | tab border seam at fractional zoom |

### KEEP-FEATURE (19)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [36330](https://github.com/twbs/bootstrap/issues/36330) |  | utilities responsive subset |
| ⬜ | [40567](https://github.com/twbs/bootstrap/issues/40567) |  | min-vh-25/50/75 |
| ⬜ | [40859](https://github.com/twbs/bootstrap/issues/40859) |  | visually-hidden breakpoints |
| ⬜ | [40927](https://github.com/twbs/bootstrap/issues/40927) |  | breakpoint indicator |
| ⬜ | [41055](https://github.com/twbs/bootstrap/issues/41055) |  | dvh/svh/lvh units |
| ⬜ | [41371](https://github.com/twbs/bootstrap/issues/41371) |  | per-side border-width utils |
| ⬜ | [41227](https://github.com/twbs/bootstrap/issues/41227) |  | hover media query |
| ⬜ | [39727](https://github.com/twbs/bootstrap/issues/39727) |  | aria-disabled = disabled CSS |
| ⬜ | [39867](https://github.com/twbs/bootstrap/issues/39867) |  | floating labels for file input |
| ⬜ | [37345](https://github.com/twbs/bootstrap/issues/37345) |  | numbered list-group `start` |
| ⬜ | [41500](https://github.com/twbs/bootstrap/issues/41500) |  | pagination `.page-text` |
| ⬜ | [39053](https://github.com/twbs/bootstrap/issues/39053) |  | dark-mode shadows |
| ⬜ | [39265](https://github.com/twbs/bootstrap/issues/39265) |  | nav-underline aligned to navbar bottom |
| ⬜ | [39609](https://github.com/twbs/bootstrap/issues/39609) |  | auto-merge `$custom-colors` |
| ⬜ | [36607](https://github.com/twbs/bootstrap/issues/36607) |  | abbr underline without hover |
| ⬜ | [36688](https://github.com/twbs/bootstrap/issues/36688) |  | `:host` for shadow DOM |
| ⬜ | [38150](https://github.com/twbs/bootstrap/issues/38150) |  | transition/animation utilities |
| ⬜ | [41047](https://github.com/twbs/bootstrap/issues/41047) |  | `--fade-transition` CSS var |
| ⬜ | [40688](https://github.com/twbs/bootstrap/issues/40688) |  | `[hidden]` scoped to allow until-found |

### CLOSE-RESOLVED (24)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [41192](https://github.com/twbs/bootstrap/issues/41192) |  | range breakpoint mixins use `(width < $max)` — no -0.02px |
| ✅ | [40961](https://github.com/twbs/bootstrap/issues/40961) |  | utility state generation emits only functional `hover:` variant |
| ✅ | [41289](https://github.com/twbs/bootstrap/issues/41289) |  | mask-icon mixin in use — SVG→mask-image largely done |
| ✅ | [38479](https://github.com/twbs/bootstrap/issues/38479) |  | gap-based layout is the v6 standard (docs-only report) |
| ✅ | [39097](https://github.com/twbs/bootstrap/issues/39097) |  | `.btn-check` input nested in label → no scroll-to-(0,0) jump |
| ✅ | [39239](https://github.com/twbs/bootstrap/issues/39239) |  | checkbox/radio checked styling via appearance:none+:checked |
| ✅ | [39851](https://github.com/twbs/bootstrap/issues/39851) |  | range thumb radius is token-driven |
| ✅ | [41137](https://github.com/twbs/bootstrap/issues/41137) |  | `--control-checked-bg/-border-color` already CSS vars |
| ✅ | [38213](https://github.com/twbs/bootstrap/issues/38213) |  | navbar toggler is a `.btn` with tokens + currentcolor mask |
| ✅ | [39085](https://github.com/twbs/bootstrap/issues/39085) |  | `.btn-outline` hover vs active now distinct (oklch) |
| ✅ | [39481](https://github.com/twbs/bootstrap/issues/39481) |  | `.btn-close` currentcolor mask + `--btn-close-color:inherit` |
| ✅ | [38853](https://github.com/twbs/bootstrap/issues/38853) |  | `.btn-close` colored by currentcolor → dark theme works |
| ✅ | [38779](https://github.com/twbs/bootstrap/issues/38779) |  | tables read `--theme-*` tokens now |
| ✅ | [41725](https://github.com/twbs/bootstrap/issues/41725) |  | list-group action vs disabled colors now distinct tokens |
| ✅ | [41806](https://github.com/twbs/bootstrap/issues/41806) |  | `.list-group-item-action` text-decoration:none at base |
| ✅ | [38973](https://github.com/twbs/bootstrap/issues/38973) |  | navbar reworked to theme tokens (`.navbar-dark` replaced) |
| ✅ | [39070](https://github.com/twbs/bootstrap/issues/39070) |  | `$navbar-light/dark-*` removed; uses `--fg-body`/light-dark() |
| ✅ | [40414](https://github.com/twbs/bootstrap/issues/40414) |  | `color-scheme` per theme → fixes dark scrollbars in light |
| ✅ | [39597](https://github.com/twbs/bootstrap/issues/39597) |  | navbar toggler icon currentcolor mask → visible both modes |
| ✅ | [35988](https://github.com/twbs/bootstrap/issues/35988) |  | breadcrumb divider SVG mask (RTLCSS issue gone) |
| ✅ | [36595](https://github.com/twbs/bootstrap/issues/36595) |  | dist CSS has zero empty custom properties |
| ✅ | [38094](https://github.com/twbs/bootstrap/issues/38094) |  | `$enable-smooth-scroll:false` already the v6 default |
| ⬜ | [40849](https://github.com/twbs/bootstrap/issues/40849) |  | node-sass dropped + `@use "sass:…"` → 1.79 deprecations gone |
| ⬜ | [40962](https://github.com/twbs/bootstrap/issues/40962) |  | `@use` throughout + namespaced fns → 1.80+ deprecations resolved |

### CLOSE-WONTFIX (9)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [34497](https://github.com/twbs/bootstrap/issues/34497) |  | `.col` flex 1 1 0 with no min-width:0 by design |
| ✅ | [38404](https://github.com/twbs/bootstrap/issues/38404) |  | `.col` flex overflow is standard flexbox (user-side fix) |
| ⬜ | [33861](https://github.com/twbs/bootstrap/issues/33861) |  | no `%placeholder` utility gen; @extend-of-utilities anti-pattern |
| ✅ | [36026](https://github.com/twbs/bootstrap/issues/36026) |  | floating-label placeholder intentionally transparent |
| ✅ | [34184](https://github.com/twbs/bootstrap/issues/34184) |  | table cell scoping requires a row group by design |
| ✅ | [38750](https://github.com/twbs/bootstrap/issues/38750) |  | white iframe = third-party color-scheme (can't style cross-origin) |
| ✅ | [40652](https://github.com/twbs/bootstrap/issues/40652) |  | v6 contrast tokens author-defined (oklch); WCAG fn unused |
| ✅ | [38889](https://github.com/twbs/bootstrap/issues/38889) |  | gradient borders need border-image — out of scope for core |
| ✅ | [39386](https://github.com/twbs/bootstrap/issues/39386) |  | bare `.toast` has no position by design (toast-container) |

## Remaining

### KEEP-BUG (8)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [42328](https://github.com/twbs/bootstrap/issues/42328) |  | toggle buttons don't set `aria-pressed="false"` at init (labeled v6) |
| ✅ | [41883](https://github.com/twbs/bootstrap/issues/41883) |  | accordion double-open race (dup 35685/39385) |
| ⬜ | [40997](https://github.com/twbs/bootstrap/issues/40997) |  | `parseSelector` over-escapes after # (breaks complex selectors) |
| ⬜ | [39428](https://github.com/twbs/bootstrap/issues/39428) |  | legend float/clear reboot forces reflow (has-pr 39498) |
| ⬜ | [39237](https://github.com/twbs/bootstrap/issues/39237) |  | `--toast-spacing` defined on .toast but consumed on container |
| ⬜ | [37478](https://github.com/twbs/bootstrap/issues/37478) |  | BrowserStack CI reliability |
| ⬜ | [41438](https://github.com/twbs/bootstrap/issues/41438) |  | release-zip packages stray .DS_Store files |
| ⬜ | [41810](https://github.com/twbs/bootstrap/issues/41810) |  | production dist min files still emit sourceMappingURL comments |

### NEEDS-VERIFY (2)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [38847](https://github.com/twbs/bootstrap/issues/38847) |  | horizontal card → .card-row; recheck small-breakpoint corners |
| ⬜ | [39404](https://github.com/twbs/bootstrap/issues/39404) |  | dashboard example rebuilt sticky sidebar; recheck whole-page scroll |

### DOCS (10)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [42422](https://github.com/twbs/bootstrap/issues/42422) |  | homepage example references undefined `var(--bs-primary)` (white-on-white) |
| ⬜ | [40833](https://github.com/twbs/bootstrap/issues/40833) |  | carousel-after-load needs manual init |
| ⬜ | [36978](https://github.com/twbs/bootstrap/issues/36978) |  | `col-auto` docs |
| ⬜ | [37262](https://github.com/twbs/bootstrap/issues/37262) |  | heroes screenshot |
| ⬜ | [37614](https://github.com/twbs/bootstrap/issues/37614) |  | select `aria-hidden` |
| ⬜ | [38434](https://github.com/twbs/bootstrap/issues/38434) |  | Sass utilities API section → reusable Astro component |
| ⬜ | [40769](https://github.com/twbs/bootstrap/issues/40769) |  | valid/invalid-feedback docs |
| ⬜ | [41873](https://github.com/twbs/bootstrap/issues/41873) |  | toast usability caution |
| ⬜ | [41895](https://github.com/twbs/bootstrap/issues/41895) |  | nested collapse example |
| ⬜ | [41944](https://github.com/twbs/bootstrap/issues/41944) |  | color-contrast note → mention native contrast-color() |

### KEEP-FEATURE (4)

| | # | PR | Notes |
|---|---|---|---|
| ⬜ | [28968](https://github.com/twbs/bootstrap/issues/28968) |  | unified enter/leave transition classes |
| ⬜ | [41380](https://github.com/twbs/bootstrap/issues/41380) |  | maintainers' post-Astro docs tracking issue |
| ⬜ | [39776](https://github.com/twbs/bootstrap/issues/39776) |  | `change-version.mjs` should rewrite docs content aliases |
| ⬜ | [41497](https://github.com/twbs/bootstrap/issues/41497) |  | form-validation a11y — ARIA/aria-live wiring |

### CLOSE-RESOLVED (5)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [36459](https://github.com/twbs/bootstrap/issues/36459) |  | validation rewritten to :user-invalid/:user-valid |
| ✅ | [39721](https://github.com/twbs/bootstrap/issues/39721) |  | carousel rebuilt on CSS scroll-snap (Safari 12 below baseline) |
| ✅ | [36391](https://github.com/twbs/bootstrap/issues/36391) |  | v5-era StackBlitz tracking issue; v6 has fresh integration |
| ✅ | [42543](https://github.com/twbs/bootstrap/issues/42543) |  | docs no longer link popper.js.org → Floating UI |
| ✅ | [37283](https://github.com/twbs/bootstrap/issues/37283) |  | Popper bundled from js/src (broken vendor-path gone) |

### CLOSE-WONTFIX (4)

| | # | PR | Notes |
|---|---|---|---|
| ✅ | [41240](https://github.com/twbs/bootstrap/issues/41240) |  | accordion scroll-jump is browser scroll-anchoring (out of scope) |
| ✅ | [35722](https://github.com/twbs/bootstrap/issues/35722) |  | jQuery-era window load carousel advice; v6 init model differs |
| ✅ | [42522](https://github.com/twbs/bootstrap/issues/42522) |  | v6 docs ship no Translations page |
| ✅ | [41390](https://github.com/twbs/bootstrap/issues/41390) |  | v5-only .browserslistrc bump; belongs on v5 line |

## Quick view — open KEEP-BUGs (the live backlog)

| # | Area | PR | Notes |
|---|---|---|---|
| [34213](https://github.com/twbs/bootstrap/issues/34213) | Dialog/Drawer |  | `hide()` still returns early while `_isTransitioning` |
| [36962](https://github.com/twbs/bootstrap/issues/36962) | Dialog/Drawer |  | Responsive `lg:drawer` dismiss `.closest('.drawer')` won't match (labeled v6) |
| [39900](https://github.com/twbs/bootstrap/issues/39900) | Dialog/Drawer |  | NVDA reads all modal content on launch; needs SR testing |
| [39972](https://github.com/twbs/bootstrap/issues/39972) | Dialog/Drawer | [#42545](https://github.com/twbs/bootstrap/pull/42545) | `dialog-open` bare overflow:hidden, no gutter compensation → shift |
| [42459](https://github.com/twbs/bootstrap/issues/42459) | Dialog/Drawer |  | Dialog content overflows on resize (reported on v6-dev) |
| [38070](https://github.com/twbs/bootstrap/issues/38070) | Dialog/Drawer | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Close scrolls back to trigger (focus w/o `{preventScroll}`) |
| [41615](https://github.com/twbs/bootstrap/issues/41615) | Dialog/Drawer | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Close scrolls to top w/ `scroll-padding-top` |
| [35391](https://github.com/twbs/bootstrap/issues/35391) | Dialog/Drawer | [#42544](https://github.com/twbs/bootstrap/pull/42544) | Restore focus with `{preventScroll:true}` |
| [36681](https://github.com/twbs/bootstrap/issues/36681) | Dialog/Drawer |  | Offcanvas anchor click stops scrolling (Chrome) |
| [35934](https://github.com/twbs/bootstrap/issues/35934) | Dialog/Drawer | [#42544](https://github.com/twbs/bootstrap/pull/42544) | `dispose()` on open modal leaves body mutations |
| [39910](https://github.com/twbs/bootstrap/issues/39910) | Dialog/Drawer | [#42544](https://github.com/twbs/bootstrap/pull/42544) | `dispose()` doesn't reset scrollbars |
| [39221](https://github.com/twbs/bootstrap/issues/39221) | Dialog/Drawer | [#42545](https://github.com/twbs/bootstrap/pull/42545) | Offcanvas open 1px displacement (scrollbar) |
| [40659](https://github.com/twbs/bootstrap/issues/40659) | Dialog/Drawer | [#42545](https://github.com/twbs/bootstrap/pull/42545) | `scrollbar-gutter:stable` shifts content + white gutters |
| [40908](https://github.com/twbs/bootstrap/issues/40908) | Dialog/Drawer | [#42545](https://github.com/twbs/bootstrap/pull/42545) | Safari offcanvas open changes window width → media query |
| [39270](https://github.com/twbs/bootstrap/issues/39270) | Dialog/Drawer |  | navbar-offcanvas translateY page-width overflow (check) |
| [39287](https://github.com/twbs/bootstrap/issues/39287) | Dialog/Drawer |  | Initial transition missing when placement set via JS |
| [37206](https://github.com/twbs/bootstrap/issues/37206) | Tooltip/Popover/Menu |  | setContent tears down shown popover |
| [37935](https://github.com/twbs/bootstrap/issues/37935) | Tooltip/Popover/Menu |  | tooltip dead in `.form-floating` (label pointer-events:none) |
| [38597](https://github.com/twbs/bootstrap/issues/38597) | Tooltip/Popover/Menu |  | tooltip z-index over fixed navbar |
| [39010](https://github.com/twbs/bootstrap/issues/39010) | Tooltip/Popover/Menu |  | click+focus can't combine to dismiss |
| [39026](https://github.com/twbs/bootstrap/issues/39026) | Tooltip/Popover/Menu |  | `abbr[title]` underline stripped by `_fixTitle` |
| [39861](https://github.com/twbs/bootstrap/issues/39861) | Tooltip/Popover/Menu | [#42548](https://github.com/twbs/bootstrap/pull/42548) | preventDefault on show blocks reopening (`_isHovered` not reset) |
| [40525](https://github.com/twbs/bootstrap/issues/40525) | Tooltip/Popover/Menu | [#42551](https://github.com/twbs/bootstrap/pull/42551) | setContent→show fails `_isWithContent` gate |
| [40993](https://github.com/twbs/bootstrap/issues/40993) | Tooltip/Popover/Menu | [#42550](https://github.com/twbs/bootstrap/pull/42550) | bottom popover arrow bg ≠ header |
| [41021](https://github.com/twbs/bootstrap/issues/41021) | Tooltip/Popover/Menu | [#42550](https://github.com/twbs/bootstrap/pull/42550) | contenteditable arrow keys blocked in menu |
| [41049](https://github.com/twbs/bootstrap/issues/41049) | Tooltip/Popover/Menu |  | menu width in collapsed navbar |
| [41630](https://github.com/twbs/bootstrap/issues/41630) | Tooltip/Popover/Menu |  | tabs + tab-menu keyboard nav |
| [41670](https://github.com/twbs/bootstrap/issues/41670) | Tooltip/Popover/Menu |  | menu in table clipped by row stacking |
| [41803](https://github.com/twbs/bootstrap/issues/41803) | Tooltip/Popover/Menu | [#42551](https://github.com/twbs/bootstrap/pull/42551) | label click in form-in-menu closes menu |
| [41869](https://github.com/twbs/bootstrap/issues/41869) | Tooltip/Popover/Menu |  | autoClose:outside + keyboard leaves multiple shown |
| [41925](https://github.com/twbs/bootstrap/issues/41925) | Tooltip/Popover/Menu | [#42548](https://github.com/twbs/bootstrap/pull/42548) | `data-bs-content` "true"/"false" coerced to boolean → TypeError |
| [42065](https://github.com/twbs/bootstrap/issues/42065) | Tooltip/Popover/Menu |  | tooltip/popover not hoverable (WCAG 1.4.13) |
| [42443](https://github.com/twbs/bootstrap/issues/42443) | Tooltip/Popover/Menu | [#42549](https://github.com/twbs/bootstrap/pull/42549) | SECURITY: `data:text/html` passes the URL sanitizer |
| [37858](https://github.com/twbs/bootstrap/issues/37858) | ScrollSpy | [#42557](https://github.com/twbs/bootstrap/pull/42557) | invalid querySelector `#div-2.1` (selector escaping) |
| [39198](https://github.com/twbs/bootstrap/issues/39198) | ScrollSpy | [#42557](https://github.com/twbs/bootstrap/pull/42557) | creates invalid query selector (selector escaping) |
| [39248](https://github.com/twbs/bootstrap/issues/39248) | ScrollSpy | [#42557](https://github.com/twbs/bootstrap/pull/42557) | anchor using dots (selector escaping) |
| [40526](https://github.com/twbs/bootstrap/issues/40526) | ScrollSpy | [#42557](https://github.com/twbs/bootstrap/pull/42557) | smooth-scroll doesn't move focus to target (a11y) |
| [36387](https://github.com/twbs/bootstrap/issues/36387) | ScrollSpy | [#42557](https://github.com/twbs/bootstrap/pull/42557) | smoothScroll preventDefault → URL hash never updates |
| [36912](https://github.com/twbs/bootstrap/issues/36912) | ScrollSpy |  | root-margin disabled by smoothScroll off (cluster 35900) |
| [41361](https://github.com/twbs/bootstrap/issues/41361) | ScrollSpy |  | active items discontinuous (IO "only while intersecting") |
| [38565](https://github.com/twbs/bootstrap/issues/38565) | JS (misc) | [#42553](https://github.com/twbs/bootstrap/pull/42553) | tab `_keydown` preventDefaults arrows unconditionally (Alt+←/→) |
| [35776](https://github.com/twbs/bootstrap/issues/35776) | JS (misc) |  | show()/hide() rely on getter side-effects a minifier can strip |
| [40841](https://github.com/twbs/bootstrap/issues/40841) | JS (misc) |  | Collapse `aria-expanded` stuck true when trigger targets `.collapse` |
| [38517](https://github.com/twbs/bootstrap/issues/38517) | JS (misc) |  | memory leak — `data.js` elementMap is Map not WeakMap |
| [40702](https://github.com/twbs/bootstrap/issues/40702) | CSS |  | `.row > *` applies gutter margin-top to `.w-100` column breaks |
| [36656](https://github.com/twbs/bootstrap/issues/36656) | CSS |  | input-group doesn't style `.form-control-plaintext` |
| [39257](https://github.com/twbs/bootstrap/issues/39257) | CSS |  | floating label stuck raised for date/time inputs |
| [39899](https://github.com/twbs/bootstrap/issues/39899) | CSS |  | floating label stays raised on cleared-but-:autofill (Firefox) |
| [40879](https://github.com/twbs/bootstrap/issues/40879) | CSS |  | browser-autofilled values don't trigger `.was-validated` |
| [40557](https://github.com/twbs/bootstrap/issues/40557) | CSS |  | disabled buttons use opacity → tint against colored bg |
| [37821](https://github.com/twbs/bootstrap/issues/37821) | CSS |  | progress bar clips its text label at 0%/very-narrow |
| [41596](https://github.com/twbs/bootstrap/issues/41596) | CSS |  | `.progress-stacked` resizes instantly (transition only on inner) |
| [36943](https://github.com/twbs/bootstrap/issues/36943) | CSS |  | `text-truncate` adds extra height (no vertical-align) — 1-line fix |
| [37909](https://github.com/twbs/bootstrap/issues/37909) | CSS |  | `<pre>` horizontal scrollbar covers last code line |
| [39507](https://github.com/twbs/bootstrap/issues/39507) | CSS |  | length vars can't be runtime calc()/var() (compile-time multiply) |
| [42546](https://github.com/twbs/bootstrap/issues/42546) | CSS |  | v6-dev far-right blank strip = `scrollbar-gutter:stable` on :root (ties to #42545) |
| [42328](https://github.com/twbs/bootstrap/issues/42328) | Remaining |  | toggle buttons don't set `aria-pressed="false"` at init (labeled v6) |
| [40997](https://github.com/twbs/bootstrap/issues/40997) | Remaining |  | `parseSelector` over-escapes after # (breaks complex selectors) |
| [39428](https://github.com/twbs/bootstrap/issues/39428) | Remaining |  | legend float/clear reboot forces reflow (has-pr 39498) |
| [39237](https://github.com/twbs/bootstrap/issues/39237) | Remaining |  | `--toast-spacing` defined on .toast but consumed on container |
| [37478](https://github.com/twbs/bootstrap/issues/37478) | Remaining |  | BrowserStack CI reliability |
| [41438](https://github.com/twbs/bootstrap/issues/41438) | Remaining |  | release-zip packages stray .DS_Store files |
| [41810](https://github.com/twbs/bootstrap/issues/41810) | Remaining |  | production dist min files still emit sourceMappingURL comments |


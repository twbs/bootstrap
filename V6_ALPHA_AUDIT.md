# Bootstrap v6.0.0-alpha1 — Source Audit

Scope: `scss/`, `js/src/`, and `site/src` (authoring sources only — `site/dist`, `site/public`, and other generated output were excluded). All findings below were verified directly against this repository (`/Users/ju/twbs/bootstrap`, package.json `version: 6.0.0-alpha1`), current as of `2026-07-28`.

**Legend** — Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low. Status: ✅ Done · 🟡 Partial · ⬜ Open.

---

## Executive summary

**Round 3 update (post-merge re-audit):** a large amount of work landed on `v6-dev` since the previous pass of this audit, so this round redoes the analysis from scratch rather than just diffing. The headline changes: **the entire JavaScript source was migrated to TypeScript** (`js/src/*.js` → `js/src/*.ts`, plus follow-up commits that tightened the public type surface, added a consumer-facing `.d.ts` check, and fixed bugs found during the migration); **the navbar's responsive behavior was migrated from Collapse (`.navbar-collapse`) to Drawer/Menu**, with `.navbar-collapse` removed; **eight brand-new components shipped** (Chips, Combobox, Datepicker, Nav-overflow, OTP Input, Range, Strength, Toggler); **the dist build switched from Rollup to Rolldown**; **new CSS Grid container-query utilities landed** (`.contains-inline` / `.contains-size`); and **a large batch of docs pages had deprecated v5 utility classes replaced** (`.bg-dark`, `.text-bg-dark`, `.display-4`–`.display-6`, `.fs-5`/`.fs-6`, etc.). All five fixes logged in the previous round (accordion, chip, pagination, drawer, the dead SCSS test import) landed for real as separate merged PRs, and a sixth item (chip's commented-out focus ring) turned out to be fixed too, as a side effect of other work.

This round re-verified every previous finding against the current source (new `.ts` paths and line numbers where applicable), audited the TypeScript migration file-by-file against this repo's stated conventions (`AGENTS.md`), and re-read **every page** under `site/src/content/docs/` (135 files across components, forms, layout, helpers, utilities, getting-started, customize, guides, and content) plus the docs site's own UI infrastructure (`site/src/components`, `site/src/layouts`, `site/src/libs`). Net result:

- **7 previous findings are now confirmed fixed**, with no regressions.
- **Most previously-open findings are still open**, re-verified against the current `.ts`/`.scss`/`.mdx` sources with fresh line numbers.
- **13 new findings** came out of the TypeScript migration itself and the full page-by-page docs re-read — most notably a **factually-wrong Sass code sample** in `text-alignment.mdx`, a **stale dependency declaration** in `navbar.mdx` left over from the Collapse→Drawer migration, and a cluster of **unsafe TypeScript casts** (`as unknown as string`, `as any`) that paper over the same ARIA-boolean and third-party-library-typing gaps the pre-TS code had.
- **Two new hypotheses raised and investigated during this round were traced and disproven** — see [Round 3 — false positives ruled out](#round-3--false-positives-ruled-out). That exercise is a useful reminder that an initial pass over the 29 component docs pages reported "no issues" for all of them, but direct verification of one of its "clean" pages (`navbar.mdx`) turned up a real, concrete finding — every "no issues" claim below has been spot-checked, not just accepted.

The `--bs-` prefix mechanism (previously undocumented) is now explained in `sass.mdx`. **Correction from this round's own re-audit:** `site/src/pages/docs/versions.astro`'s hardcoded `'5.3'` "Latest" badge was previously flagged here as this audit's single highest-impact bug. On reconsideration that was backwards — v6.0.0-alpha1 isn't the production-recommended release yet, so continuing to badge v5.3 as "Latest" while separately badging v6.0 as "Alpha" is the *correct* current behavior, not a defect (see [finding 28](#28-versionsastro-current-version-detection-hardcoded-to-53), downgraded and re-characterized accordingly).

## Status dashboard

### Fixed since the last audit

| Finding | Area | Severity | Status |
|---|---|---|---|
| Dead `variables-dark` import / dormant SCSS test files | scss/tests | 🟠 High | ✅ Done |
| Undefined `--accordion-timing` custom property | scss | 🔴 Critical | ✅ Done |
| Undefined `--chip-min-height` custom property | scss | 🔴 Critical | ✅ Done |
| Chip's commented-out focus ring | scss / a11y | 🟡 Medium | ✅ Done |
| Hardcoded `--bs-` prefix in pagination size tokens | scss / design-tokens | 🟠 High | ✅ Done |
| Duplicated comment line in `_drawer.scss` | scss | 🟢 Low | ✅ Done |
| The `--bs-` prefix mechanism was undocumented | site/src / design-tokens | 🟡 Medium | ✅ Done |
| `css-grid.mdx` stale v5.1.0 "experimental" callout ([finding 22](#22-css-gridmdx-stale-v510-experimental-callout)) | site/src | 🟢 Low | ✅ Done |
| `customize/options.mdx` stale "(New in v5.2.0)" callout ([finding 27](#27-customizeoptionsmdx-stale-new-in-v520-callout)) | site/src | 🟢 Low | ✅ Done |
| `customize/options.mdx`'s `$enable-deprecation-messages` row stale "removed in `v6`" wording (now that this *is* v6) | site/src | 🟢 Low | ✅ Done |
| `text-alignment.mdx` Sass sample contradicts the real source ([finding 23](#23-text-alignmentmdx-sass-sample-contradicts-the-real-source)) | site/src | 🟠 High | ✅ Done |
| `font-family.mdx` Sass code sample is missing a shipped value ([finding 24](#24-font-familymdx-sass-sample-is-missing-a-shipped-value)) | site/src | 🟢 Low | ✅ Done |
| `.placeholder-glow`/`.placeholder-wave` missing `prefers-reduced-motion` guard ([finding 6](#6-missing-prefers-reduced-motion-guard-in-_placeholderscss)) | scss / a11y | 🟠 High | ✅ Done |
| `user-select.mdx` never documents the shipped `.user-select-text` utility ([finding 25](#25-user-selectmdx-never-documents-the-shipped-user-select-text-utility)) | site/src | 🟡 Medium | ✅ Done |

### Open findings

| # | Finding | Area | Severity | Status |
|---|---|---|---|---|
| [1](#1-breakpoint-map-assertions-commented-out) | Breakpoint map assertions commented out in `_config.scss` | scss | 🟠 High | ⬜ Open |
| [2](#2-duplicated-saturate180-backdrop-filter) | Duplicated `saturate(180%)` backdrop-filter across 5 components | scss | 🟡 Medium | ⬜ Open |
| [3](#3-open-todo-v6-markers) | Open `TODO: v6` markers in `_navbar.scss`, `layout/_grid.scss` | scss | 🟡 Medium | ⬜ Open |
| [4](#4-stylelint-disable-volume) | High stylelint-disable count (~164 across 74 files) | scss | 🟢 Low | ⬜ Open |
| [5](#5-rtl-breaking-physical-properties) | Physical (`left`/`right`) properties break RTL in tooltip/popover arrows, avatar, datepicker, stepper | scss / a11y | 🟠 High | ⬜ Open |
| [7](#7-navbar-brand-missing-a-focus-visible-ring) | `.navbar-brand` has no `:focus-visible` ring | scss / a11y | 🟡 Medium | ⬜ Open |
| [8](#8-list-group-action-uses-focus-instead-of-focus-visible) | `.list-group-item-action` uses `:focus` instead of `:focus-visible` | scss / a11y | 🟡 Medium | ⬜ Open |
| [9](#9-menu-border-tokens-commented-out-but-still-referenced) | `_menu.scss` border tokens commented out of the token map yet still referenced via fallback | scss | 🟢 Low | ⬜ Open |
| [10](#10-two-competing-event-trigger-conventions) | Two competing event-trigger conventions (`eventName()` wrapper vs. direct constants) | js | 🟠 High | ⬜ Open |
| [11](#11-popover-template-uses-the-wrong-aria-role) | Popover template uses `role="tooltip"` (in both `popover.ts` and its docs) | js / a11y | 🟠 High | ⬜ Open |
| [12](#12-tab-silently-no-ops-instead-of-throwing) | Tab silently no-ops instead of throwing (`TODO: should throw... in v6`) | js | 🟠 High | ⬜ Open |
| [13](#13-menu-focus-option-inconsistency) | Menu focus option inconsistency | js | 🟢 Low | ⬜ Open |
| [14](#14-ios-touchmouseover-workaround-duplicated-and-now-asymmetric) | iOS touch/mouseover workaround duplicated in `tooltip.ts`/`menu.ts`, and asymmetric within `menu.ts` itself | js | 🟢 Low | ⬜ Open |
| [15](#15-deprecated-backward-compat-code-still-active) | Deprecated backward-compat code still active (`toast.ts`, `tooltip.ts`) | js | 🟢 Low | ⬜ Open |
| [16](#16-aria-boolean-state-coerced-via-as-unknown-as-string) | ARIA boolean state coerced via `as unknown as string` instead of explicit strings | js | 🟡 Medium | ⬜ Open |
| [17](#17-dialogdrawer-event-constant-gaps-plus-a-magic-string) | Dialog/Drawer event-constant gaps plus a magic-string event name | js | 🟡 Medium | ⬜ Open |
| [18](#18-unsafe-as-any-casts-to-the-datepickers-third-party-options) | Unsafe `as any` casts to the datepicker's third-party (VCP) options | js | 🟡 Medium | ⬜ Open |
| [19](#19-non-null-assertions-on-possibly-null-dom-references) | Non-null assertions on possibly-null DOM references | js | 🟡 Medium | ⬜ Open |
| [20](#20-type-level-tests-dont-cover-most-of-the-new-components) | Type-level tests don't cover 7 of 8 new components (plus Button/ScrollSpy/Tab) | js | 🟡 Medium | ⬜ Open |
| [21](#21-navbarmdx-lists-a-stale-collapse-dependency) | `navbar.mdx` lists a stale "Collapse" dependency left over from the Drawer migration | site/src | 🟡 Medium | ⬜ Open |
| [26](#26-customizeoverviewmdx-stale-modals-reference) | `customize/overview.mdx` stale "modals" reference | site/src | 🟢 Low | ⬜ Open |
| [28](#28-versionsastro-current-version-detection-hardcoded-to-53) | `versions.astro` hardcodes current-version detection to the string `'5.3'` (intentional while v6 is alpha; re-characterized this round) | site/src | 🟢 Low | ⬜ Open |
| [29](#29-previous-version-links-hardcoded-instead-of-config-driven) | Previous-release version links hardcoded in `Versions.astro` | site/src | 🟢 Low | ⬜ Open |
| [30](#30-copy-code-buttons-accessible-name-relies-on-title-alone) | Copy-code button's accessible name relies on `title` alone (`Code.astro` and `CodeCopy.astro`) | site/src / a11y | 🟡 Medium | ⬜ Open |
| [31](#31-theme-toggle-aria-label-is-static-and-redundant) | Theme-toggle button's `aria-label` is static and redundant with a `.visually-hidden` span | site/src / a11y | 🟡 Medium | ⬜ Open |
| [32](#32-no-single-extend-the-theme-walkthrough) | No single "extend the theme" walkthrough in the docs | site/src / design-tokens | 🟡 Medium | ⬜ Open |
| [33](#33-no-stated-token-stability-contract) | No stated token stability contract for `--component-*` tokens | site/src / design-tokens | 🟢 Low | ⬜ Open |

Findings 32–33 are carried forward unchanged from the previous round (design-tokens documentation gaps); they were not the focus of this round's re-audit and are called out as such in their own section.

---

## SCSS findings (`scss/`)

### Fixed since the last audit

- **Accordion transition token** — [scss/_accordion.scss](scss/_accordion.scss#L18-L20) now correctly reads `--accordion-transition: var(--accordion-transition-property) var(--accordion-transition-timing),` — the undefined `--accordion-timing` reference is gone. Verified directly; no regression.
- **Chip dismiss button size** — [scss/_chip.scss](scss/_chip.scss#L119-L120) and [L141-L142](scss/_chip.scss#L141-L142) now correctly reference `var(--chip-dismiss-size)` for both `width` and `height`. Verified directly; no regression.
- **Chip focus ring** — newly confirmed fixed this round (it was still listed as open in the previous audit): [scss/_chip.scss](scss/_chip.scss#L136) now has an active `@include focus-ring();` inside `.chip-dismiss`'s `:focus-visible` state — it's no longer commented out. The companion `// @include transition(opacity .15s ease-in-out);` line wasn't restored; it was removed entirely rather than uncommented, so the dismiss button's opacity change is now instant. That reads like a deliberate cleanup rather than a regression (nothing else in the file references an opacity transition for this element), so no fix is suggested — noted for completeness only.
- **Pagination token prefix** — [scss/_pagination.scss](scss/_pagination.scss#L124-L128) now consistently uses the unprefixed `var(--btn-input-#{$size}-*)` convention; the hardcoded `--bs-btn-input-#{$size}-min-height` literal is gone.
- **Drawer duplicate comment** — no duplicate comment remains in [scss/_drawer.scss](scss/_drawer.scss).
- **Dead `variables-dark` import in SCSS mixin tests** — remains fixed; `scss/tests/mixins/_color-mode-media-query.test.scss` and `_color-mode-data.test.scss` are registered in `scss/tests/jasmine.cjs`'s `spec_files` and pass (`npm run css-test` → 41 specs, 0 failures, re-confirmed this round). The separate, pre-existing `luminance()`/`color-contrast()` function bug in `_functions.scss` that blocked re-enabling `_color-contrast.test.scss` is still there and still out of scope for this audit's fix branch.

### 1. Breakpoint map assertions commented out
**Area:** scss · **Severity:** 🟠 High · **Status:** ⬜ Open (unchanged)

- [scss/_config.scss](scss/_config.scss#L112-L113): `_assert-ascending($breakpoints, ...)` and `_assert-starts-at-zero(...)` are still commented out.
- **Impact:** a misconfigured `$breakpoints` map (out of order, or not starting at 0) will silently produce broken responsive behavior instead of a clear Sass error.
- **Fix:** re-enable, or add a code comment explaining why validation was intentionally dropped.

### 2. Duplicated `saturate(180%)` backdrop-filter
**Area:** scss · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged)

- Repeated literal across 5 files: [_card.scss](scss/_card.scss#L138), [_drawer.scss](scss/_drawer.scss#L249), [_menu.scss](scss/_menu.scss#L136), [_navbar.scss](scss/_navbar.scss#L306), [_toasts.scss](scss/_toasts.scss#L92).
- **Fix:** hoist into a shared token (e.g. `--backdrop-filter` in `_root.scss`) and reference it everywhere.

### 3. Open `TODO: v6` markers
**Area:** scss · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged)

- [scss/_navbar.scss](scss/_navbar.scss#L9): "fix nav-link-height and navbar-brand-height, which we previously calculated with font-size, line-height, and block padding" — the recent navbar rework (Collapse → Drawer/Menu, the navbar-brand/nav-link theme-color fix, the cropped-content fix) touched this file extensively but did not resolve this specific TODO.
- [scss/layout/_grid.scss](scss/layout/_grid.scss#L5): "check gap utilities as replacement for gutter classes from v5" (line number shifted by one since the last audit; content unchanged).
- **Fix:** convert each to a linked GitHub issue and reference the issue number in the comment, or resolve now if scope allows.

### 4. stylelint-disable volume
**Area:** scss · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- Now roughly 164 `stylelint-disable` occurrences across 74 files, up from 101/42 at the last audit — expected given how much SCSS landed with the new components and the navbar rework, not itself a regression.
- **Fix:** not urgent; consider tightening `stylelint.config.mjs` rule scoping to shrink the count where disables share one root cause.

### 5. RTL-breaking physical properties
**Area:** scss / a11y · **Severity:** 🟠 High · **Status:** ⬜ Open (unchanged, re-verified with fresh line numbers)

The `top`/`bottom` (block-direction) placements below are unaffected by `dir="rtl"` and don't need changing — only the `start`/`end` (inline-direction) ones do:

- [scss/_tooltip.scss](scss/_tooltip.scss#L69-L78): `.bs-tooltip-end .tooltip-arrow` positions with `left:` (L70) and its `&::before` with `right: -1px` (L75), while the adjacent `border-inline-end-color` (L77) on the very same rule already correctly uses a logical property. `.bs-tooltip-start .tooltip-arrow` ([L91-L100](scss/_tooltip.scss#L91-L100)) mirrors this with `right:`/`left: -1px` next to a correct `border-inline-start-color`. The class names already encode logical direction (`start`/`end`); the position offsets don't follow through.
- [scss/_popover.scss](scss/_popover.scss#L98-L117): `.bs-popover-end > .popover-arrow` uses `left:` (L100, L110, L115) alongside correct `border-inline-end-color` declarations in the same rules. `.bs-popover-start > .popover-arrow` ([L160-L174](scss/_popover.scss#L160-L174)) mirrors this with `right:` alongside correct `border-inline-start-color`.
- [scss/_avatar.scss](scss/_avatar.scss#L96-L97): `.avatar-status` positions with `right:`/`bottom:` instead of `inset-inline-end`/`inset-block-end`.
- [scss/_avatar.scss](scss/_avatar.scss#L129) and [L135](scss/_avatar.scss#L135): avatar-stack overlap uses `margin-left` instead of `margin-inline-start`.
- [scss/_datepicker.scss](scss/_datepicker.scss#L135-L148): the `[data-vc="controls"]` grid uses `right: 0; left: 0;` (L138-139) and `padding-right`/`padding-left` (L145-146) instead of `inset-inline: 0` and `padding-inline`.
- [scss/_stepper.scss](scss/_stepper.scss#L48-L50): inside the `stepper-horizontal()` mixin, `&:last-child::after { right: 100%; }` sits directly below `inset-inline-start`/`inset-inline-end` declarations (L42-43) in the same block — a single physical-property line dropped into an otherwise fully logical rule.
- [scss/_drawer.scss](scss/_drawer.scss#L255-L266): `.drawer-sheet` still uses `right`/`bottom`/`left` — still low-risk since the values are symmetric (`0`), but worth fixing for consistency with the rest of the file if the sheet variant ever gets an asymmetric inset.
- **Fix:** convert each to its logical equivalent. Tooltip/popover arrow placement is the highest-value fix given how widely those components are used.

### 6. Missing `prefers-reduced-motion` guard in `_placeholder.scss`
**Area:** scss / a11y · **Severity:** 🟠 High · **Status:** ✅ Done

- [scss/_placeholder.scss](scss/_placeholder.scss#L49-L69): `.placeholder-glow` and `.placeholder-wave` now each guard their infinite 2s `animation` with `@if $enable-reduced-motion { @media (prefers-reduced-motion: reduce) { animation: none; } }`, matching the convention used in [_progress.scss](scss/_progress.scss) and [_spinner.scss](scss/_spinner.scss). Verified in the compiled `dist/css/bootstrap.css` output.

### 7. `.navbar-brand` missing a `:focus-visible` ring
**Area:** scss / a11y · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged, re-verified after the navbar rework)

- [scss/_navbar.scss](scss/_navbar.scss#L128-L143): `.navbar-brand` still only styles `&:hover, &:focus { color: ... }` (L138-141) — no `:focus-visible` block. This section of the file was rewritten as part of the recent "Fix navbar-brand and nav-link ignoring theme-* accent color classes" commit (it now correctly reads `color: var(--theme-fg, var(--navbar-brand-color))`), but the missing focus-visible ring wasn't part of that fix.
- `.nav-link` in [scss/_nav.scss](scss/_nav.scss) still adds a dedicated `:focus-visible` ring via `@include focus-ring(true)`, so the inconsistency stands.
- The docs site's own `site/src/scss/_navbar.scss` override was checked too — it adds a `:focus:not(:focus-visible)` rule, but only for `[data-bs-toggle="menu"]` triggers (the version-switcher/theme-toggle buttons), not for `.navbar-brand`, so it doesn't address this gap either.
- **Fix:** add a matching `&:focus-visible { @include focus-ring(true); }` block to `.navbar-brand`.

### 8. `.list-group-item-action` uses `:focus` instead of `:focus-visible`
**Area:** scss / a11y · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged)

- [scss/_list-group.scss](scss/_list-group.scss#L111-L120): `&:hover, &:focus { z-index: 1; color: ...; background-color: ...; }` (inside `.list-group-item-action:not(.active)`) is still the only remaining plain `:focus` selector in the interactive-component set.
- **Fix:** change to `&:hover, &:focus-visible` for consistency with the rest of the interactive-component styling.

### 9. Menu border tokens commented out but still referenced
**Area:** scss · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- [scss/_menu.scss](scss/_menu.scss#L23-L25): `--menu-border-color`, `--menu-border-radius`, and `--menu-border-width` are still commented out of the `$menu-tokens` map, yet [L77-78](scss/_menu.scss#L77-L78) still consumes them via `var(..., fallback)`. `.menu` remains the only component whose border isn't independently themeable via its own component token.
- **Fix:** either uncomment the three tokens, or remove the commented lines and document that menu intentionally inherits the global border tokens.

### Newly reviewed this round (no issues found)

- **Navbar's Collapse → Drawer/Menu migration** — [scss/_navbar.scss](scss/_navbar.scss) was checked for leftover `.navbar-collapse` CSS. None found; the file has been fully reworked around the drawer/menu-based responsive pattern with no dead code from the old approach.
- **`scss/_nav-overflow.scss`** (new file, never previously audited) — full review: uses logical properties throughout, no undefined custom-property references, no animations (so no reduced-motion gap), and its token map is internally consistent.
- **CSS Grid container-query utilities** — implemented via the `"container"` entry in the utilities API map ([scss/_utilities.scss](scss/_utilities.scss#L98-L104): `class: contains`, values `inline → inline-size`, `size → size`), which matches [container-queries.mdx](site/src/content/docs/utilities/container-queries.mdx)'s documented `.contains-inline`/`.contains-size` classes exactly. No issues found.

### Architecture inventory (verified, for reference; unchanged from the previous round)
- Entry: [scss/bootstrap.scss](scss/bootstrap.scss) uses `@forward` (not legacy `@import`) for the whole tree: `banner → colors → root → content/layout/forms/buttons → components → helpers → utilities/api`.
- Cascade layers declared once in [_root.scss](scss/_root.scss#L8): `colors, config, root, reboot, layout, content, forms, components, custom, helpers, utilities`.
- Design tokens: colors defined as `oklch()` values in [_colors.scss](scss/_colors.scss), semantic theme built in [_theme.scss](scss/_theme.scss) using `light-dark()` and `color-mix(in oklch, …)`, output as CSS custom properties via the tiny [mixins/_tokens.scss](scss/mixins/_tokens.scss) `@mixin tokens($map)`. Each component defines its own `$component-tokens` map merged through `defaults()` from [_config.scss](scss/_config.scss#L8-L26).
- No duplicate `divide()` function issue here (that was a `bootstrap-v5` finding — confirmed not present in this repo).

---

## JavaScript / TypeScript findings (`js/src/`)

The entire JS source moved from `js/src/*.js` to TypeScript (`js/src/*.ts`) since the last audit, alongside several review/fixup commits ("Fix component bugs found during the TypeScript migration", "Address review findings on the TypeScript migration", "Tighten the public type surface from the review", "Lock the type surface with access modifiers and honest nullability", "Add a consumer-facing check of the shipped type declarations"). This section re-verifies every previous JS finding against the current `.ts` source and adds findings specific to the migration itself and to the eight brand-new components (Chips, Combobox, Datepicker, Nav-overflow, OTP Input, Range, Strength, Toggler).

**Convention compliance checked and confirmed clean:** every `_`-prefixed instance member is `protected` (never `private`), instance fields consistently use `declare`, constructor `element` params stay optional, imports consistently use `.js` extensions (correct per this repo's Rolldown/`extensionAlias` setup), and there's no stray semicolon/formatting drift.

### 10. Two competing event-trigger conventions
**Area:** js · **Severity:** 🟠 High · **Status:** ⬜ Open (still present, more entrenched than before)

- [js/src/tooltip.ts](js/src/tooltip.ts#L64-L67) still declares bare, unnamespaced event constants (`const EVENT_HIDE = 'hide'`, etc.) and fires them through a `this.constructor.eventName(EVENT_SHOW)` wrapper (e.g. [L261](js/src/tooltip.ts#L261), [L309](js/src/tooltip.ts#L309), [L326](js/src/tooltip.ts#L326), [L359](js/src/tooltip.ts#L359)).
- This is no longer just a tooltip quirk: [js/src/dialog-base.ts](js/src/dialog-base.ts#L90) — the shared base class for **both** Dialog and Drawer — fires its `shown` event via the same style of wrapper: `this.constructor.eventName('shown')`. That's a reasonable design for a shared base class serving multiple subclasses, but it means the wrapper pattern and the "namespaced constant + direct `EventHandler.trigger`" pattern used by every other component (`collapse.ts`, `toast.ts`, `carousel.ts`, etc.) now coexist as two established conventions rather than one being a clear outlier.
- **Impact:** this is public API surface (`el.addEventListener('hide.bs.tooltip', …)`). An alpha is the right time to pick one convention; shipping two into a stable release makes a future refactor of either family riskier.
- **Fix:** pick one pattern — most components use namespaced constants + direct trigger, but Dialog/Drawer's shared-base use case for a generic `eventName()` helper is legitimate, so the more realistic fix is to formally adopt *both* (documented as such) or move tooltip onto the majority pattern to shrink the exception to just the dialog family.

### 11. Popover template uses the wrong ARIA role
**Area:** js / a11y · **Severity:** 🟠 High · **Status:** ⬜ Open (unchanged)

- [js/src/popover.ts](js/src/popover.ts#L35): `template: '<div class="popover" role="tooltip">' + …` — unchanged from the pre-TS source.
- This is also **documented as the default** in [popover.mdx](site/src/content/docs/components/popover.mdx)'s `template` option row, which quotes the same `role="tooltip"` markup — so fixing the JS requires a matching one-line docs update.
- Popovers aren't tooltips semantically (they can hold interactive/rich content and are dismissed differently); `role="tooltip"` misinforms assistive technology per WCAG 4.1.2.
- **Fix:** change to `role="dialog"` (or drop the role), and update `popover.mdx`'s documented default `template` value to match.

### 12. Tab silently no-ops instead of throwing
**Area:** js · **Severity:** 🟠 High · **Status:** ⬜ Open (unchanged)

- [js/src/tab.ts](js/src/tab.ts#L56-L65):
  ```ts
  constructor(element?: string | Element | null) {
    super(element)
    this._parent = this._element.closest(SELECTOR_TAB_PANEL)

    if (!this._parent) {
      return
      // TODO: should throw exception in v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_TAB_PANEL}`)
    }
  ```
- The comment already flags this as "should throw in v6" — this alpha *is* v6, so the decision is overdue.
- **Fix:** either uncomment the `throw` or remove the TODO and document the silent no-op as intentional.

### 13. Menu focus option inconsistency
**Area:** js · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- [js/src/menu.ts](js/src/menu.ts#L243) uses `this._element.focus({ focusVisible: false })` while `dialog.ts`, `drawer.ts`, `carousel.ts`, and `tab.ts` all use `focus({ preventScroll: true })`.
- **Fix:** standardize on `{ preventScroll: true }` unless Menu has a documented reason for `focusVisible: false`.

### 14. iOS touch/mouseover workaround duplicated and now asymmetric
**Area:** js · **Severity:** 🟢 Low · **Status:** ⬜ Open (refined this round)

- [js/src/tooltip.ts](js/src/tooltip.ts#L302) (add) and [L338](js/src/tooltip.ts#L338) (remove) still carry the unconditional `if ('ontouchstart' in document.documentElement) { for (const element of document.body.children) { EventHandler.on/off(element, 'mouseover', noop) } }` workaround.
- [js/src/menu.ts](js/src/menu.ts#L237) has the **same workaround but with an added condition** on the "add" side only — `if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV))` — while the matching "remove" call at [L312](js/src/menu.ts#L312) has no such condition. This is harmless at runtime (removing a listener that was never added is a no-op) but it's now an asymmetry *within* `menu.ts` itself, on top of no longer matching `tooltip.ts`'s copy verbatim.
- **Fix:** extract to a shared helper in `js/src/util/index.ts`, and make the add/remove condition symmetric within menu's own usage.

### 15. Deprecated backward-compat code still active
**Area:** js · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- [js/src/toast.ts](js/src/toast.ts#L31): `const CLASS_NAME_HIDE = 'hide' // @deprecated - kept here only for backwards compatibility` is still applied/removed at runtime ([L106](js/src/toast.ts#L106), [L125](js/src/toast.ts#L125)).
- [js/src/tooltip.ts](js/src/tooltip.ts#L717): `data-bs-original-title` is still set with a `// DO NOT USE IT. Is only for backwards compatibility` comment.
- **Fix:** since this is already v6, decide: drop now, or explicitly document the compat window and when it ends.

### 16. ARIA boolean state coerced via `as unknown as string`
**Area:** js · **Severity:** 🟡 Medium · **Status:** ⬜ Open (new shape, same root issue)

The TypeScript migration gave `setAttribute`'s value parameter a strict `string` type, and rather than switching these call sites to explicit `'true'`/`'false'` string literals (the majority convention — see `combobox.ts` lines 274/278 below), several were ported with an `as unknown as string` cast that silently preserves the old raw-boolean behavior:

- [js/src/tab.ts](js/src/tab.ts#L120): `element.setAttribute('aria-selected', true as unknown as string)`, and similarly at [L146](js/src/tab.ts#L146), [L205](js/src/tab.ts#L205) (`aria-selected`), and [L249](js/src/tab.ts#L249) (`aria-expanded`).
- [js/src/button.ts](js/src/button.ts#L37): `this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE) as unknown as string)`.
- [js/src/collapse.ts](js/src/collapse.ts#L260): `element.setAttribute('aria-expanded', isOpen as unknown as string)`. (`collapse.ts` also has an unrelated, more defensible cast at [L152](js/src/collapse.ts#L152) — `this._element.style[dimension] = 0 as unknown as string` — coercing a numeric CSS style value, not an ARIA boolean; not part of this finding.)
- [js/src/combobox.ts](js/src/combobox.ts#L269): `item.setAttribute('aria-selected', item.classList.contains(CLASS_NAME_SELECTED) as unknown as string)` — inconsistent with the very same file's [L274](js/src/combobox.ts#L274) and [L278](js/src/combobox.ts#L278), which correctly use explicit `'false'`/`'true'` string literals a few lines later.
- `setAttribute` still stringifies its argument at runtime either way, so this remains a style/type-safety issue rather than a functional bug — but `as unknown as string` is a double-cast specifically designed to bypass TypeScript's type checker, which is a stronger smell in a strict, newly-typed codebase than the plain-JS raw-boolean version was.
- **Fix:** replace each cast with an explicit `'true'`/`'false'` string literal (or a small `toBooleanAttribute()` helper), matching `menu.ts`/`dialog.ts`/`combobox.ts`'s own majority convention.

### 17. Dialog/Drawer event-constant gaps plus a magic string
**Area:** js · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged, with more precise detail)

- [js/src/dialog.ts](js/src/dialog.ts#L24-L26) declares `EVENT_SHOW`, `EVENT_HIDDEN`, and `EVENT_CANCEL` — still no `EVENT_SHOWN` constant.
- [js/src/dialog.ts](js/src/dialog.ts#L163), in the dialog-swap-in logic, fires/listens for the shown event via an inline template string: `` EventHandler.one(target, `shown${EVENT_KEY}`, () => { … }) ``.
- [js/src/dialog-base.ts](js/src/dialog-base.ts#L90) fires the *same* event through yet a third spelling: `this.constructor.eventName('shown')`. So there are now three different ways "the shown event" gets referenced across these two files, and no declared `EVENT_SHOWN` constant anywhere in the dialog family.
- [js/src/drawer.ts](js/src/drawer.ts#L27-L30) still only declares `EVENT_LOAD_DATA_API`, `EVENT_HIDDEN`, and `EVENT_RESIZE` — no `EVENT_SHOW`/`EVENT_SHOWN`, even though `Drawer extends DialogBase` and fires both.
- **Fix:** add an explicit `EVENT_SHOWN` constant (in `dialog.ts` or hoisted into `dialog-base.ts` since it's shared), and use it consistently instead of the inline template string and the `eventName('shown')` call.

### 18. Unsafe `as any` casts to the datepicker's third-party options
**Area:** js · **Severity:** 🟡 Medium · **Status:** ⬜ Open (new, TS migration)

- [js/src/datepicker.ts](js/src/datepicker.ts#L342-L376) casts seven separate Bootstrap config values to `any` when building the options object passed to the third-party `vanilla-calendar-pro` library: `positionToInput` (L342), `firstWeekday` (L343), `selectionDatesMode` (L345), `displayMonthsCount` (L347), `selectedMonth` (L367), `dateMin` (L372), `dateMax` (L376).
- `any` fully disables type checking for these call sites — if Bootstrap's config type or the upstream library's option type ever drifts, nothing will catch the mismatch at compile time.
- **Fix:** define a narrow intermediate type describing the subset of VCP's options actually used, and map Bootstrap's config onto it explicitly instead of casting to `any`.

### 19. Non-null assertions on possibly-null DOM references
**Area:** js · **Severity:** 🟡 Medium · **Status:** ⬜ Open (new, TS migration)

- [js/src/strength.ts](js/src/strength.ts#L84): `SelectorEngine.findOne('.strength-text', this._element.parentElement!)` — `.parentElement` is typed nullable and the `!` assumes it never is.
- [js/src/strength.ts](js/src/strength.ts#L126): `SelectorEngine.findOne<HTMLInputElement>('input[type="password"]', parent!)`, where `parent` ([L125](js/src/strength.ts#L125)) is `this._element.parentElement`, the same possibly-null value.
- [js/src/collapse.ts](js/src/collapse.ts#L79): `SelectorEngine.find(selector!)`, where `selector` can legitimately be `null`.
- These aren't necessarily wrong in practice (a mounted component's element normally does have a parent), but the assertions hide a real edge case rather than guarding it, and are exactly the kind of thing that turns into a production crash if a component is ever constructed on a detached element.
- **Fix:** use optional chaining with an explicit fallback or an early-return null check instead of `!`.

### 20. Type-level tests don't cover most of the new components
**Area:** js · **Severity:** 🟡 Medium · **Status:** ⬜ Open (new, TS migration)

- [js/tests/types/api.ts](js/tests/types/api.ts#L10-L20) and [js/tests/types/consumer.ts](js/tests/types/consumer.ts#L17-L27) — the compile-time checks for the public TypeScript API (source and shipped `.d.ts`, respectively) — import exactly: `Alert, Carousel, Collapse, Dialog, Drawer, Menu, Popover, Range, Toast, Tooltip`.
- That's 10 of the ~20 public components. Missing entirely: `Button`, `Chips`, `Combobox`, `Datepicker`, `NavOverflow`, `OtpInput`, `ScrollSpy`, `Strength`, `Tab`, `Toggler` — i.e. 7 of the 8 brand-new components (only `Range` is covered) plus three pre-existing ones.
- **Impact:** if any of these components' public types are wrong (a config option typed as required but actually optional, a method with the wrong return type, etc.), nothing catches it until a consumer trips over it after adopting the type.
- **Fix:** add the missing components to both `api.ts` and `consumer.ts` before v6.0.0 stable, prioritizing the new form components.

### New components reviewed this round
Chips, Combobox, Datepicker, Nav-overflow, OTP Input, Range, Strength, and Toggler were each read in full and given the same scrutiny as the rest (event naming, ARIA correctness, focus management, `dispose()` cleanup). Aside from the Combobox/Datepicker/Strength issues captured above (findings 16, 18, 19), no further issues were found: event constants are namespaced consistently, listeners are cleaned up in `dispose()`, and ARIA attributes elsewhere in these files use explicit string literals correctly.

### Previously ruled-out false positives (re-checked, still not reproducible)
- **Tooltip escape-key handler null-dereference** and **Combobox missing keyboard navigation** — both re-confirmed not reproducible against the current `.ts` source; see the original analysis in [Round 2 — false positives ruled out](#round-2--false-positives-ruled-out) below, which still applies verbatim to `tooltip.ts`/`combobox.ts`.

---

## Site docs findings (`site/src`) — page by page

### Components (`site/src/content/docs/components/`)

All 29 pages were read in full, including the four components that are new since the last audit (Drawer, Menu, Nav-overflow, Toggler) and cross-referenced against their `.ts`/`.scss` sources. `accordion.mdx`, `alert.mdx`, `avatar.mdx`, `badge.mdx`, `breadcrumb.mdx`, `button-group.mdx`, `button.mdx`, `card.mdx`, `carousel.mdx`, `close-button.mdx`, `collapse.mdx`, `dialog.mdx`, `list-group.mdx`, `pagination.mdx`, `placeholder.mdx`, `progress.mdx`, `scrollspy.mdx`, `spinner.mdx`, `stepper.mdx`, `tab.mdx`, `toasts.mdx`, and `tooltip.mdx` (21 pages) are consistent with their sources — correct `### Dependencies` placement, no leftover Modal/Offcanvas/`.navbar-collapse` terminology outside legitimate historical/migration context, and no deprecated utility classes. `drawer.mdx`, `menu.mdx`, `nav-overflow.mdx`, and `toggler.mdx` were read in full as brand-new pages and are accurate against `js/src/drawer.ts`, `menu.ts`, `nav-overflow.ts`, and `toggler.ts` respectively. `popover.mdx`'s documented `role="tooltip"` default is covered under [finding 11](#11-popover-template-uses-the-wrong-aria-role) above (it's accurate to the current code, the code itself is what needs to change).

### 21. `navbar.mdx` lists a stale "Collapse" dependency
**Area:** site/src · **Severity:** 🟡 Medium · **Status:** ⬜ Open (new)

- [navbar.mdx](site/src/content/docs/components/navbar.mdx#L8-L11) frontmatter still declares:
  ```yaml
  deps:
    - title: Drawer
    - title: Collapse
    - title: Menu
  ```
- This `deps:` field renders as a visible "depends on" line in the page's meta info bar ([site/src/components/PageMeta.astro](site/src/components/PageMeta.astro#L36)), read by every visitor — it isn't the auto-generated `<JsDependencies>` import-graph table (which this page doesn't use), so it doesn't self-correct.
- Verified via a full-file search: every other "collapse" occurrence in `navbar.mdx` is either the generic English verb ("navbars that never collapse") or an explanatory heading ("Collapsed content") — there is no `data-bs-toggle="collapse"`, no `.collapse`/`.navbar-collapse` class, anywhere in the page's examples. All of them use `data-bs-toggle="drawer"` / `<dialog class="drawer ...">` instead, consistent with the Collapse → Drawer navbar migration. `accordion.mdx` (which genuinely still uses Collapse under the hood) correctly has no such stale entry.
- **Fix:** remove `- title: Collapse` from `navbar.mdx`'s frontmatter.

### Forms, layout, and helpers (`site/src/content/docs/forms/`, `layout/`, `helpers/`)

All 17 forms pages, 8 layout pages, and 8 helpers pages were read in full. The six forms pages covering brand-new components — `chips.mdx`, `combobox.mdx`, `datepicker.mdx`, `otp-input.mdx`, `password-strength.mdx`, `range.mdx` — were cross-checked option-by-option, method-by-method against `js/src/chips.ts`, `combobox.ts`, `datepicker.ts`, `otp-input.ts`, `strength.ts`, and `range.ts`; all documented options/methods/events match the implementation, including `password-strength.mdx`'s `<JsDependencies component="strength" name="password strength" />`, which correctly points at the actual `strength.ts` basename despite the page's different name. `checkbox.mdx`, `field.mdx`, `floating-labels.mdx`, `form-adorn.mdx`, `form-control.mdx`, `input-group.mdx`, `layout.mdx`, `overview.mdx`, `radio.mdx`, `switch.mdx`, `validation.mdx`, `breakpoints.mdx`, `columns.mdx`, `containers.mdx`, `grid.mdx`, `gutters.mdx`, `utilities.mdx`, `z-index.mdx`, `focus-ring.mdx`, `icon-link.mdx`, `position.mdx`, `stacks.mdx`, `stretched-link.mdx`, `text-truncation.mdx`, `vertical-rule.mdx`, and `visually-hidden.mdx` have no findings — frontmatter, `[[docsref:...]]` links, and class references all check out, including `gutters.mdx` (whose documented `.gx-*`/`.gy-*`/`.g-*` behavior matches `scss/layout/_grid.scss` even though the file's own `TODO: v6` about gap utilities, [finding 3](#3-open-todo-v6-markers), remains unresolved).

### 22. `css-grid.mdx` stale v5.1.0 "experimental" callout
**Area:** site/src · **Severity:** 🟢 Low · **Status:** ✅ Done

- [css-grid.mdx](site/src/content/docs/layout/css-grid.mdx#L13) opened with "our CSS Grid system is experimental and opt-in as of v5.1.0!" — a leftover v5-era callout that read oddly on a page shipping v6, and didn't cross-link to the newer [container-queries.mdx](site/src/content/docs/utilities/container-queries.mdx), which covers a related but distinct feature (`.contains-*` utilities vs. CSS Grid itself).
- **Fixed:** the callout now reads "our CSS Grid system is opt-in!" (still opt-in via `$enable-cssgrid`, no longer framed as a recent/experimental addition) and links to `container-queries.mdx`. `customize/options.mdx`'s `$enable-cssgrid` row, which had the same stale "experimental" wording, was updated to match and now links to this page.

### 23. `text-alignment.mdx` Sass sample contradicts the real source
**Area:** site/src · **Severity:** 🟠 High · **Status:** ✅ Done

- [text-alignment.mdx](site/src/content/docs/utilities/text-alignment.mdx#L52-L63) documented the utilities API entry as:
  ```scss
  "text-align": (
    responsive: true,
    property: text-align,
    class: text,
    values: (
      start: left,
      end: right,
      center: center,
    )
  ),
  ```
  but the actual entry in [scss/_utilities.scss](scss/_utilities.scss#L714-L721) is `start: start, end: end, center: center` — logical keywords, not `left`/`right`. This wasn't just cosmetic: the doc's version actively misrepresented the utility as using physical (non-RTL-aware) values, when the real implementation is already correctly RTL-safe.
- **Fixed:** the code sample now reads `start: start, end: end, center: center`, matching `scss/_utilities.scss`.

### 24. `font-family.mdx` Sass sample is missing a shipped value
**Area:** site/src · **Severity:** 🟢 Low · **Status:** ✅ Done

- [font-family.mdx](site/src/content/docs/utilities/font-family.mdx#L29) previously hardcoded a stale Sass code sample showing only `values: (monospace: var(--#{$prefix}font-monospace))`, missing the `body` value that [scss/_utilities.scss](scss/_utilities.scss#L677-L684) defines (`"monospace": var(--font-mono), "body": var(--body-font-family)`).
- **Fixed:** `font-family.mdx`'s "Sass utilities API" section — and every other utility doc page's, per commit `f39e617d3` ("Docs: use `<ScssDocs>` shortcode for all 'Sass utilities API' sections") — now renders via the `<ScssDocs name="utils-font-family" file="scss/_utilities.scss" />` shortcode instead of a hand-maintained static sample. That shortcode extracts the live content between the `// scss-docs-start/end utils-font-family` markers at build time, so the rendered sample always matches the real source, including both `monospace` and `body`. Verified directly; no regression.

### 25. `user-select.mdx` never documents the shipped `.user-select-text` utility
**Area:** site/src · **Severity:** 🟡 Medium · **Status:** ✅ Done

- [scss/_utilities.scss](scss/_utilities.scss#L912-L917) defines `"user-select": (property: user-select, values: all auto text none)` — four values, including `text` (i.e. a real, shipped `.user-select-text` class).
- [user-select.mdx](site/src/content/docs/utilities/user-select.mdx) never mentioned `.user-select-text` anywhere: not in "Basic usage", and not in "Use cases". The Sass code sample already renders live via the `<ScssDocs name="utils-user-select">` shortcode, so it already included `text`.
- **Fixed:** added a `.user-select-text` example and use-case bullet to `user-select.mdx`.

### Getting started, customize, guides, and content

All 6 getting-started pages, 9 customize pages, 7 guides pages, 5 content pages, and `docsref.mdx` were read in full. `getting-started/javascript.mdx` — the page most likely to be stale after a JS→TypeScript migration — was checked especially closely: its ESM import examples match `js/src/index.ts`'s actual exports, and it accurately covers TypeScript type availability. `guides/migration.mdx` thoroughly and correctly documents the Modal→Dialog rename, the Offcanvas→Drawer rename, the Collapse→Drawer navbar change, and the deprecated-utility-class replacements — a full-text search for `navbar-collapse`, `offcanvas`, `modal`, and the specific deprecated classes (`.bg-dark`, `.display-4`–`.display-6`, `.fs-5`/`.fs-6`, `.bg-body-secondary`/`-tertiary`, etc.) confirms every remaining mention in the docs tree is either in this migration guide (as an explicit old→new mapping) or a legitimate generic/historical usage — none are live, un-migrated references. `customize/sass.mdx` now documents the `--bs-` prefix PostCSS mechanism (see the [Fixed since the last audit](#fixed-since-the-last-audit) list). `getting-started/accessibility.mdx`, `approach.mdx`, `browsers-devices.mdx`, `css-variables.mdx`, `install.mdx`, `customize/color-modes.mdx`, `color.mdx`, `components.mdx`, `optimize.mdx`, `rtl.mdx`, `theme.mdx`, `guides/contribute.mdx`, `npm.mdx`, `parcel.mdx`, `quickstart.mdx`, `vite.mdx`, `webpack.mdx`, `content/images.mdx`, `prose.mdx`, `reboot.mdx`, `tables.mdx`, `typography.mdx`, and `docsref.mdx` have no findings.

### 26. `customize/overview.mdx` stale "modals" reference
**Area:** site/src · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- [customize/overview.mdx](site/src/content/docs/customize/overview.mdx#L61): "Close button (used in alerts and modals)" — should say "dialogs" since Modal was renamed to Dialog in v6.
- **Fix:** change "modals" to "dialogs".

### 27. `customize/options.mdx` stale "(New in v5.2.0)" callout
**Area:** site/src · **Severity:** 🟢 Low · **Status:** ✅ Done

- [customize/options.mdx](site/src/content/docs/customize/options.mdx#L21) had the `$enable-container-classes` row still carrying "(New in v5.2.0)", which read oddly on a page shipping a major version later.
- **Fixed:** the version callout was dropped. While fixing this, the same page's `$enable-deprecation-messages` row was also found to say warnings are for mixins/functions "planned to be removed in `v6`" — stale now that this alpha *is* v6 (and `scss/mixins/_deprecate.scss`'s `deprecate()` mixin currently has zero call sites, so nothing is actually pending removal). Reworded to "planned to be removed in a future major version" so the row doesn't need editing again at every major release.

### Utilities (`site/src/content/docs/utilities/`)

All 46 pages were read in full and cross-checked against `scss/_utilities.scss`. Besides findings 23–25 above, `align-content.mdx`, `align-items.mdx`, `align-self.mdx`, `api.mdx`, `aspect-ratio.mdx`, `background.mdx`, `border-color.mdx`, `border-radius.mdx`, `border.mdx`, `colors.mdx`, `container-queries.mdx`, `display.mdx`, `divide.mdx`, `flex.mdx`, `float.mdx`, `font-size.mdx`, `font-style.mdx`, `font-weight.mdx`, `gap.mdx`, `grid.mdx`, `height.mdx`, `justify-content.mdx`, `justify-items.mdx`, `line-height.mdx`, `link.mdx`, `margin.mdx`, `object-fit.mdx`, `opacity.mdx`, `overflow.mdx`, `padding.mdx`, `place-items.mdx`, `pointer-events.mdx`, `position.mdx`, `shadows.mdx`, `space.mdx`, `text-decoration.mdx`, `text-transform.mdx`, `text-wrapping.mdx`, `theme.mdx`, `vertical-align.mdx`, `visibility.mdx`, `width.mdx`, and `z-index.mdx` all match their Sass source, including `divide.mdx` (the duplicate-`divide()`-function bug from the separate `bootstrap-v5` repo doesn't apply here) and `theme.mdx` (distinct in scope from `customize/theme.mdx`, with no content overlap or contradiction between the two).

---

## Site infrastructure findings (`site/src/components` · `site/src/layouts` · `site/src/libs`)

Every file under `site/src/components/` (including `footer/`, `head/`, `header/`, `home/`, `icons/`, `shortcodes/`), `site/src/layouts/` (including `partials/`), and `site/src/libs/` was read this round.

### 28. `versions.astro` current-version detection hardcoded to `'5.3'`
**Area:** site/src · **Severity:** 🟢 Low (downgraded from 🔴 Critical — corrected) · **Status:** ⬜ Open (re-characterized this round: not a bug)

- [site/src/pages/docs/versions.astro](site/src/pages/docs/versions.astro#L31-L34):
  ```astro
  // TODO: revert to getConfig().docs_version once we have v6.0.0 released
  // const isCurrentVersion = version === getConfig().docs_version
  const isCurrentVersion = version === '5.3'
  const isAlpha = version === '6.0'
  ```
- **Correction:** previous rounds of this audit flagged this as a critical bug ("badges v5.3 as Latest while shipping v6"). That was the wrong read. v6.0.0-alpha1 is not yet the version recommended for production use — v5.3 still is, until v6 reaches a stable release. Continuing to badge v5.3 as "Latest" (production-recommended) while separately badging v6.0 as "Alpha" (via `isAlpha`) is therefore the *correct*, intentional behavior for the `/docs/versions/` page today, not a defect. The code's own comment confirms this was deliberate, with a planned revert once v6.0.0 ships as stable — not an oversight.
- The only real remaining risk is procedural, not behavioral: the revert is tracked solely by a source-code comment rather than a linked issue or release checklist, so it's easy to forget when v6.0.0 stable actually ships. That's the same class of gap as [finding 29](#29-previous-version-links-hardcoded-instead-of-config-driven) below — a hardcoded, non-config-driven value that needs a manual edit at the right moment.
- **Fix:** no code change needed now. Consider linking the `TODO` to a tracked GitHub issue (e.g. "flip this when #NNNN closes") so the revert is discoverable from the release checklist and not only from reading source comments.

### 29. Previous-version links hardcoded instead of config-driven
**Area:** site/src · **Severity:** 🟢 Low · **Status:** ⬜ Open (unchanged)

- [site/src/components/header/Versions.astro](site/src/components/header/Versions.astro#L29-L32) still hardcodes the "Previous releases" menu as literal `<a href="https://getbootstrap.com/docs/5.3/">`, `.../4.6/`, `.../3.4/`, `.../2.3.2/` links, while the current-version entry just above ([L19-24](site/src/components/header/Versions.astro#L19-L24)) correctly derives its link from `getConfig()`.
- **Fix:** move the previous-release list into `config.yml` and map over it here.

### 30. Copy-code button's accessible name relies on `title` alone
**Area:** site/src / a11y · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged, now spans two files)

- [site/src/components/shortcodes/Code.astro](site/src/components/shortcodes/Code.astro#L238-L241) (and again at [L273-L276](site/src/components/shortcodes/Code.astro#L273-L276) for the nested-in-`<Example>` variant): `<button type="button" class="btn btn-xs btn-icon bg-transparent" title="Copy" data-bd-clipboard>` with only an `aria-hidden` SVG inside.
- A second, new-since-the-last-audit file has the identical pattern: [site/src/components/shortcodes/CodeCopy.astro](site/src/components/shortcodes/CodeCopy.astro#L28-L31).
- **Fix:** add an explicit `aria-label="Copy to clipboard"` to all three button instances so the accessible name doesn't depend on `title` fallback behavior.

### 31. Theme-toggle `aria-label` is static and redundant
**Area:** site/src / a11y · **Severity:** 🟡 Medium · **Status:** ⬜ Open (unchanged)

- [site/src/layouts/partials/ThemeToggler.astro](site/src/layouts/partials/ThemeToggler.astro#L9-L16): the button still has a static `aria-label="Toggle theme (auto)"` that never reflects the actually-selected theme, and a `.visually-hidden` "Toggle theme" span that `aria-label` makes redundant for screen-reader users.
- **Fix:** pick one accessible-name mechanism, and update the client-side theme-switching script to keep it in sync with the active theme.

### Verified clean this round

- **`site/src/libs/js-dependencies.ts`** — traced the import graphs of every new component (`chips.ts`, `combobox.ts`, `datepicker.ts`, `nav-overflow.ts`, `otp-input.ts`, `range.ts`, `strength.ts`, `toggler.ts`); every local file and third-party package they import already has a `FILE_DESCRIPTIONS`/`PACKAGE_DESCRIPTIONS` label. No missing entries, so this file — and the `<JsDependencies>` tables it powers across the new component docs — is up to date.
- **`JsDependencies.astro`, `JsDocs.astro`, `JsDataAttributes.mdx`** — all still function correctly against the TypeScript source.

---

## Design tokens & Sass customization

This section was not the focus of this round's re-audit (no evidence surfaced that the underlying architecture changed), so it's carried forward with only the two status updates below. It's included here for completeness since it documents Bootstrap's Sass customization surface against the goal of being a forkable, themeable design-system foundation.

### How customization works today (verified previously; spot-checked this round, unchanged)

Bootstrap v6 exposes **three layered, independently overridable customization mechanisms**:

1. **Sass variable overrides** via `@use "bootstrap" with (...)` — standard `!default` variables like `$enable-rounded`, `$spacer`, `$min-contrast-ratio` ([_config.scss](scss/_config.scss)).
2. **Sass map overrides**, merged non-destructively through the shared `defaults()` helper ([_config.scss](scss/_config.scss#L8-L26)):
   - Primitive palette: `$colors` in [_colors.scss](scss/_colors.scss#L29-L52) — 16 base hues defined in **`oklch()`**, with 13 shades each generated from those primitives.
   - Semantic theme: `$theme-colors` in [_theme.scss](scss/_theme.scss#L82) — each entry is itself a sub-map of `base/fg/fg-emphasis/bg/bg-subtle/bg-muted/border/focus-ring/contrast`, with dark-mode variants expressed inline via `light-dark()` and `color-mix(in oklch, …)`.
   - Component tokens: every component defines its own `$component-tokens` map, also mergeable via `defaults()`.
3. **Runtime CSS custom-property overrides** — every layer ultimately resolves to `var(--token)` chains output by [`@mixin tokens($map)`](scss/mixins/_tokens.scss), so a consumer can re-theme large parts of the system with no Sass recompile at all.

Dark mode is a first-class consequence of this: `:root` is declared `color-scheme: light dark` and every color token is authored with `light-dark()` ([_root.scss](scss/_root.scss#L188-L206)). CSS cascade layers are declared once, in a fixed order: `colors, config, root, reboot, layout, content, forms, components, custom, helpers, utilities` ([_root.scss](scss/_root.scss#L8)), with a `custom` layer deliberately positioned between `components` and `helpers`/`utilities` as an `!important`-free override seam.

The `--bs-` prefix seen throughout the docs is **not** part of the Sass token output — every token map in `scss/` emits **unprefixed** custom properties. The `bs-` prefix is added afterward by [`postcss-prefix-custom-properties`](build/postcss.config.mjs#L38-L43).

### Strengths

- **Three-tier token model (primitive → semantic → component)** — mergeable at every tier via `defaults()`, not an all-or-nothing override.
- **oklch() + color-mix() removes an entire category of maintenance work**: adopters don't hand-author a parallel dark palette.
- **Zero-JS, zero-duplicate-CSS dark mode** — no theming runtime to ship.
- **The `custom` cascade layer** gives downstream design systems a guaranteed, `!important`-free override point.
- **`$enable-*` flags** give a coarse but effective way to strip Bootstrap's own visual opinions.

### Gaps and risks

The hardcoded `--bs-` literal in `_pagination.scss` (previously tracked here) is now fixed — see [Fixed since the last audit](#fixed-since-the-last-audit). The undocumented `--bs-` prefix mechanism (previously tracked here) is also now fixed: `sass.mdx` documents the PostCSS step.

### 32. No single "extend the theme" walkthrough
**Area:** site/src / design-tokens · **Severity:** 🟡 Medium · **Status:** ⬜ Open (carried forward, not re-verified this round)

- `sass.mdx`, `color.mdx`, `theme.mdx`, and `options.mdx` each correctly document one layer of the system, but there's no single tutorial chaining all three tiers together (add a primitive → wire it into `$theme-colors` → confirm it flows through to root tokens, utilities, and component tokens automatically).
- **Fix:** add a worked example (ideally in `theme.mdx` or a new `guides/build-a-theme.mdx`).

### 33. No stated token stability contract
**Area:** site/src / design-tokens · **Severity:** 🟢 Low · **Status:** ⬜ Open (carried forward, not re-verified this round)

- There's still no documented policy on which `--component-*` tokens are considered stable across versions vs. internal implementation detail.
- **Fix:** not urgent for alpha, but worth a short "token stability" note before a stable v6.0.0.

---

## Fix log

Chronological record of fixes applied during the original audit session. Full detail lives with each numbered finding above. No source-code fixes were applied during this round's update — this round was a research/re-verification pass only, requested explicitly to update the audit analysis itself.

- Branch `v6-dev-jd-fix-scss-test-imports` (off `v6-dev-jd-source-audit`), later merged to `v6-dev` as separate PRs (confirmed via `git log`, e.g. #42746 and the companion accordion/chip/pagination/drawer fix commits):
  - Rewrote/split the dead-import SCSS test files (`_color-mode-media-query.test.scss`, `_color-mode-data.test.scss`); `_color-contrast.test.scss`'s import was fixed but it remains excluded from `spec_files` pending a separate, pre-existing `luminance()`/`color-contrast()` function bug in `_functions.scss` unrelated to this audit's scope.
  - Fixed the hardcoded `--bs-btn-input-*` reference in `_pagination.scss`.
  - Fixed the `--accordion-transition` reference to use `--accordion-transition-timing` instead of the undefined `--accordion-timing`.
  - Fixed `.chip-dismiss` to reference the existing `--chip-dismiss-size` token instead of the undefined `--chip-min-height`.
  - Removed the duplicated comment line in `_drawer.scss`.
- Landed independently on `v6-dev` since then (not part of this audit's fix branch, but verified this round): chip's commented-out focus ring was restored, and `sass.mdx` picked up documentation of the `--bs-` prefix mechanism.
- Verified live in the original session: `npm run css-test` → 41 specs, 0 failures.
- Verified live this round: `npm run css-lint` clean; `npm run js-lint` → 1 pre-existing false-positive parse error (ESLint's markdown plugin trying to parse a deliberately-incomplete JS code fragment quoted in *this file*, `V6_ALPHA_AUDIT.md` itself, as standalone JS — not a source bug) plus pre-existing test-file warnings (`max-nested-callbacks`, `max-lines` in `js/tests/unit/*.spec.js`); no new lint regressions.

## Verification notes

- All file/line references above were confirmed via direct `grep_search`/`read_file` against this repo. This round's JS/TS findings were additionally cross-checked with targeted `grep_search` passes across `js/src/*.ts` to pin down exact current line numbers rather than relying solely on a single research pass.
- Nothing here is carried over from the separate `bootstrap-v5` (v5.3.8) repository explored in an earlier session — that repo's findings (e.g., a duplicate `divide()` function) were re-checked again this round and still do **not** apply to v6.
- This round's docs re-read covered `site/src/content/docs/**/*.mdx` in full (135 files) plus `site/src/components`, `site/src/layouts`, and `site/src/libs`. An initial research pass over the 29 component docs pages reported no issues at all; direct spot-checking of that claim (reading `navbar.mdx`, `collapse.mdx`, `drawer.mdx`, `menu.mdx`, `toggler.mdx`, and `nav-overflow.mdx` in full, then grepping every `deps:` frontmatter block across all 29 pages) turned up [finding 21](#21-navbarmdx-lists-a-stale-collapse-dependency) — a reminder that "no issues found" claims in this kind of pass need independent verification, not just acceptance.
- Not covered in depth: full `stylelint`/`eslint` rule audits beyond the counts noted above, and `js/tests/unit/*.spec.js` runtime-test coverage gaps (distinct from the type-level test gap in [finding 20](#20-type-level-tests-dont-cover-most-of-the-new-components)).

## Round 2 — false positives ruled out

A second, more skeptical audit pass necessarily produces some hypotheses that don't survive direct verification. Recorded here for transparency rather than silently dropped:

- **Tooltip escape-key handler null-dereference.** Hypothesis: `tooltip.ts`'s escape-key check could throw if `this.tip` is `null`. Traced every code path that nulls `this.tip` against every place the escape listener is removed: both call sites remove the `keydown` listener **synchronously and unconditionally before** `this.tip` can become `null`, and JS's single-threaded execution means no event can fire in the gap. Not reproducible — no fix needed. Re-confirmed this round against the current `.ts` source.
- **Combobox missing keyboard navigation.** Hypothesis: `combobox.ts` has no arrow-key/Home/End handling, unlike `menu.ts`. Disproven by direct inspection: `combobox.ts` wires up `_handleToggleKeydown`/`_handleMenuKeydown` on both the toggle and the menu, implementing `ArrowUp`/`ArrowDown`/`Home`/`End` handling consistent with `menu.ts`. No gap here. Re-confirmed this round.
- **`aria-selected`/`aria-pressed` boolean arguments as a functional bug.** Hypothesis (initially raised as high-severity): passing a raw boolean to `setAttribute('aria-selected', true)` breaks ARIA semantics. In practice `setAttribute` always stringifies its second argument, so the DOM ends up with the correct `"true"`/`"false"` string either way — downgraded from a functional bug to the style-consistency note now at [finding 16](#16-aria-boolean-state-coerced-via-as-unknown-as-string) above.

## Round 3 — false positives ruled out

- **`ButtonPlayground.astro` icon-only button missing an `aria-label`.** Hypothesis raised by an initial research pass: the interactive button-builder's icon-only template has no accessible name. Disproven by direct inspection: [site/src/components/shortcodes/ButtonPlayground.astro](site/src/components/shortcodes/ButtonPlayground.astro#L149) defines the default icon-only button with `aria-label="Icon only"` already present, and the snippet-generator code ([L182-L186](site/src/components/shortcodes/ButtonPlayground.astro#L182-L186)) explicitly reads the live button's `aria-label` and reproduces it in the generated markup. Not reproducible — no fix needed.
- **`ExamplesMain.astro` thumbnail images with empty `alt=""`.** Hypothesis: the examples-gallery thumbnails are missing alt text. Disproven by direct inspection: each thumbnail `<img alt="">` ([site/src/layouts/partials/ExamplesMain.astro](site/src/layouts/partials/ExamplesMain.astro#L76)) sits inside the same `<a>` as a visible `<h3>{example.name}</h3>` heading, so the link's accessible name is already correctly derived from the heading text. An empty `alt` on a purely decorative thumbnail next to visible naming text is the standard, correct pattern (it avoids the example's name being announced twice) — not a bug.


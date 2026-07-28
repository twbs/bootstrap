---
name: bootstrap-v4-v6-migration
description: Migrate a project from Bootstrap 4 to Bootstrap 6. Use when upgrading from Bootstrap 4, jumping two major versions, or updating v4 class names, data attributes, forms, and JavaScript across the v4-to-v5 and v5-to-v6 steps.
guide: /guides/migration
---

# Bootstrap v4 to v6 Migration

There is no direct v4 to v6 path. Migrate in two stages — v4 to v5 first (this skill), then v5 to v6 (the `bootstrap-v5-v6-migration` skill). Skipping the middle stage doesn't work, because many v4 names were renamed in v5 and renamed *again* in v6: `.text-primary` becomes `.fg-primary` only after passing through v5, and `.badge-primary` becomes `.badge-subtle .theme-primary` by way of `.badge.bg-primary`.

## Workflow

Work through each step in order. After each step, search the codebase for remaining v4 patterns before moving on.

- [ ] Step 1: Plan the two-stage migration
- [ ] Step 2: v4 to v5 — dependencies, build, and Sass
- [ ] Step 3: v4 to v5 — JavaScript
- [ ] Step 4: v4 to v5 — classes and attributes
- [ ] Step 5: v5 to v6 — hand off to the v6 migration skill
- [ ] Step 6: Verify

---

## Step 1: Plan the two-stage migration

1. Get the project onto Bootstrap 5 and **working** — build passing, pages rendering, tests green — before touching v6. Landing the v5 stage as its own commit (or PR) keeps the two rename waves separable when something breaks.
2. Inventory what you're dealing with first. The v4 features that cost the most time are custom forms, `.input-group-append` / `.input-group-prepend`, jumbotrons, `.media` objects, `.card-deck` / `.card-columns`, and any jQuery that calls Bootstrap plugins.
3. Decide about jQuery separately. Bootstrap 5 dropped it, but your app may use it for other things; removing Bootstrap's dependency on it does not require removing jQuery itself.
4. Note the browser floor. Bootstrap 5 drops IE, and Bootstrap 6 requires `oklch()` and `color-mix()` support.

---

## Step 2: v4 to v5 — dependencies, build, and Sass

1. Update the dependency and drop the jQuery/Popper v1 pair:

   ```sh
   npm i --save bootstrap@5 @popperjs/core
   npm uninstall popper.js
   ```

   `popper.js` (v1) is replaced by `@popperjs/core` (v2). Bootstrap 5's bundle includes Popper; the standalone `bootstrap.js` does not.

2. Switch the Sass compiler to Dart Sass (`npm i --save-dev sass`). Node Sass / LibSass is not supported. Keep using `@import` for now — v5 still uses it; the move to `@use` happens in the v6 stage.

3. Sass maps no longer merge automatically. In v4, adding one key to `$theme-colors` was enough; in v5 you must define the complete map, including the keys you're keeping.

4. Update renamed functions and mixins:

   | v4 | v5 |
   | --- | --- |
   | `color-yiq()` | `color-contrast()` |
   | `theme-color()`, `gray()` | Removed — reference `$theme-colors` / `$grays` directly |
   | `theme-color-level()` | `tint-color()` / `shade-color()` |
   | `lighten()` / `darken()` | `tint-color()` / `shade-color()` |
   | `media-breakpoint-down(md)` | `media-breakpoint-down(lg)` — takes the breakpoint itself, not the next one down |
   | `media-breakpoint-between(sm, md)` | `media-breakpoint-between(sm, lg)` — same shift on the upper bound |

   The breakpoint parameter change is silent: nothing errors, your media queries just apply one breakpoint off. Audit every call.

5. Print styles, `$enable-*` flags, and the utility API all changed shape in v5. If you generated custom utilities with v4 mixins, rewrite them through v5's `$utilities` map.

---

## Step 3: v4 to v5 — JavaScript

1. Namespace every data attribute with `bs`. This is a mechanical but wide-reaching change:

   | v4 | v5 |
   | --- | --- |
   | `data-toggle` | `data-bs-toggle` |
   | `data-target` | `data-bs-target` |
   | `data-dismiss` | `data-bs-dismiss` |
   | `data-parent` | `data-bs-parent` |
   | `data-ride` | `data-bs-ride` |
   | `data-slide`, `data-slide-to` | `data-bs-slide`, `data-bs-slide-to` |
   | `data-spy` | `data-bs-spy` |
   | `data-backdrop`, `data-keyboard` | `data-bs-backdrop`, `data-bs-keyboard` |
   | `data-content`, `data-placement`, `data-trigger` | `data-bs-content`, `data-bs-placement`, `data-bs-trigger` |

   Any option passed as an attribute follows the same rule: `data-<option>` becomes `data-bs-<option>`.

2. Replace jQuery plugin calls with constructors or static getters:

   ```js
   // v4
   $('#myModal').modal('show')
   $('#myTooltip').tooltip()

   // v5
   const modal = new bootstrap.Modal(document.querySelector('#myModal'))
   modal.show()

   bootstrap.Tooltip.getOrCreateInstance(document.querySelector('#myTooltip'))
   ```

3. Replace jQuery event handlers with native listeners. Bootstrap 5 dispatches native `CustomEvent`s, so `$(el).on('shown.bs.modal', …)` stops firing:

   ```js
   // v5
   document.querySelector('#myModal').addEventListener('shown.bs.modal', event => {
     // event.relatedTarget replaces event.relatedTarget from the jQuery event
   })
   ```

4. Smaller API renames:

   - `_getInstance()` → `getInstance()`, and prefer the new `getOrCreateInstance()`.
   - The sanitizer option `whiteList` → `allowList`.
   - Tooltip and Popover `title` / `content` still accept functions, but `this` is no longer the jQuery element.

5. If you relied on jQuery's `noConflict` or on `$.fn.button('toggle')`-style calls, rewrite them against the class API — there is no jQuery interface left to shim.

---

## Step 4: v4 to v5 — classes and attributes

### Directional utilities become logical (RTL support)

| v4 | v5 |
| --- | --- |
| `.ml-*`, `.mr-*` | `.ms-*`, `.me-*` |
| `.pl-*`, `.pr-*` | `.ps-*`, `.pe-*` |
| `.float-left`, `.float-right` | `.float-start`, `.float-end` |
| `.text-left`, `.text-right` | `.text-start`, `.text-end` |
| `.border-left`, `.border-right` | `.border-start`, `.border-end` |
| `.rounded-left`, `.rounded-right` | `.rounded-start`, `.rounded-end` |
| `.dropleft`, `.dropright` | `.dropstart`, `.dropend` |

The responsive variants follow the same rename (`.ml-md-3` → `.ms-md-3`).

### Typography and helpers

| v4 | v5 |
| --- | --- |
| `.font-weight-bold`, `-normal`, `-light`, `-bolder`, `-lighter` | `.fw-bold`, `.fw-normal`, `.fw-light`, `.fw-bolder`, `.fw-lighter` |
| `.font-italic` | `.fst-italic` |
| `.text-monospace` | `.font-monospace` |
| `.sr-only`, `.sr-only-focusable` | `.visually-hidden`, `.visually-hidden-focusable` |
| `.embed-responsive`, `.embed-responsive-16by9` | `.ratio`, `.ratio-16x9` |
| `.text-justify`, `.text-hide`, `.pre-scrollable` | Removed |
| `.rounded-sm`, `.rounded-lg` | `.rounded-1`, `.rounded-3` |

### Forms

This is the largest v4 to v5 rewrite: custom form controls were merged into the standard classes.

| v4 | v5 |
| --- | --- |
| `.custom-select` | `.form-select` |
| `.custom-range` | `.form-range` |
| `.custom-file`, `.form-control-file` | `.form-control` (on `<input type="file">`) |
| `.form-control-range` | `.form-range` |
| `.custom-control.custom-checkbox` | `.form-check` |
| `.custom-control.custom-radio` | `.form-check` |
| `.custom-control.custom-switch` | `.form-check.form-switch` |
| `.custom-control-input` | `.form-check-input` |
| `.custom-control-label` | `.form-check-label` |
| `.custom-control-inline` | `.form-check-inline` |
| `.form-group` | Spacing utilities, e.g. `.mb-3` |
| `.form-row` | `.row` plus gutter utilities (`.g-*`) |
| `.form-inline` | Grid or flex utilities (`.row .row-cols-lg-auto`, `.d-flex`) |
| `<label>` with no class | `<label class="form-label">` |

Input groups lose their wrappers: delete `.input-group-append` and `.input-group-prepend` and place `.input-group-text`, buttons, and controls as direct children of `.input-group`. Validation feedback moves out of the removed wrappers too.

### Components dropped or restructured

| v4 | v5 |
| --- | --- |
| `.jumbotron` | Removed — compose with `.bg-*`, `.p-*`, `.rounded-*` |
| `.media` | Removed — use `.d-flex` and gap/margin utilities |
| `.card-deck`, `.card-columns` | Removed — use the grid, or CSS columns for masonry |
| `.close` | `.btn-close` (drop the `&times;` child; the icon is a background image) |
| `.badge-primary` and friends | `.badge` plus `.bg-primary` |
| `.badge-pill` | `.rounded-pill` |
| `.btn-block` | A `.d-grid` wrapper (add `.gap-*` for stacked buttons) |
| `.thead-light`, `.thead-dark` | `.table-light`, `.table-dark` on `<thead>` |
| `.arrow` (tooltip/popover) | `.tooltip-arrow`, `.popover-arrow` |
| `.carousel-item-left`, `-right` | `.carousel-item-start`, `-end` |

Badges also lost their link styling — a `<a class="badge">` no longer gets hover/focus states.

### Grid, navbars, and navs

- `.no-gutters` → `.g-0`, and gutters are now controlled by the `.g-*`, `.gx-*`, `.gy-*` utilities.
- A new `xxl` breakpoint (1400px) exists; existing `xl` classes keep their meaning.
- Navbars now require a container inside `.navbar` (`<nav class="navbar"><div class="container">…`).
- For tabs and pills, `.active` moves from `.nav-item` to `.nav-link`. `.nav-item` is optional as a wrapper.
- `.dropdown-menu` items can be `<button>` or `<a>`; `.dropdown-item-text` was added for plain text.

---

## Step 5: v5 to v6 — hand off to the v6 migration skill

Once the project builds and renders on Bootstrap 5, switch to the **`bootstrap-v5-v6-migration`** skill and work through its steps. Do not attempt those renames while v4 patterns are still present — its find-and-replace steps assume v5 names.

That stage covers, among other things:

- `@import` to `@use`, and the move from Sass scalars to CSS token maps
- Popper to Floating UI
- The `md:` responsive prefix syntax replacing `-md-` infixes
- Modal to Dialog, Offcanvas to Drawer, Dropdown to Menu
- `.btn-primary` to `.btn-solid .theme-primary`, and `.text-*` to `.fg-*`
- ESM-only JavaScript with no `window.bootstrap` global

Two v4-era details worth flagging before you start it: the `.close` → `.btn-close` element you produced in Step 4 keeps that name in v6 (but must stay empty, with no child SVG), and the `.form-check` markup you just wrote gets rebuilt again into v6's `.check` / `.radio` / `.switch` structure.

---

## Step 6: Verify

1. Build the project and fix compilation errors before looking at the rendered output.
2. Search for leftover v4 patterns:
   - `data-toggle=`, `data-target=`, `data-dismiss=`, `data-ride=`, `data-slide`, `data-spy=` (should all be `data-bs-*`)
   - `class="close"`, `&times;` inside a close button (should be `.btn-close`)
   - `badge-`, `badge-pill` (should be `.badge .bg-*` / `.rounded-pill`)
   - `custom-select`, `custom-control`, `custom-switch`, `custom-range`, `custom-file`
   - `form-group`, `form-row`, `form-inline`, `input-group-append`, `input-group-prepend`
   - `\bm[lr]-`, `\bp[lr]-`, `float-left`, `float-right`, `text-left`, `text-right`, `border-left`, `border-right`
   - `font-weight-`, `font-italic`, `text-monospace`
   - `no-gutters`, `sr-only`, `embed-responsive`, `jumbotron`, `media-body`, `card-deck`, `card-columns`, `btn-block`, `thead-light`, `thead-dark`, `pre-scrollable`, `text-justify`
   - `\$(`, `jQuery(` near Bootstrap plugin names (`.modal(`, `.tooltip(`, `.collapse(`)
   - `theme-color(`, `color-yiq(`, `theme-color-level(`, `media-breakpoint-down(`
3. Click through every interactive component — the data attribute renames fail silently, so a missed `data-toggle` looks like a dead button rather than an error.
4. Check forms especially closely: custom controls, input groups, and validation feedback all changed structure.
5. Then move to Step 5 and repeat this discipline for the v6 stage.

---
name: bootstrap-v5-v6-migration
description: Migrate projects from Bootstrap 5 to Bootstrap 6. Use when upgrading Bootstrap, migrating v5 to v6, or updating Bootstrap class names, components, Sass, or JavaScript to the latest version.
---

# Bootstrap v5 to v6 Migration

## Workflow

Work through each phase in order. After each phase, search the codebase for remaining v5 patterns before moving on.

- [ ] Phase 1: Update dependencies and build setup
- [ ] Phase 2: Rename CSS classes and data attributes
- [ ] Phase 3: Restructure component HTML
- [ ] Phase 4: Update JavaScript
- [ ] Phase 5: Update Sass
- [ ] Phase 6: Verify

---

## Phase 1: Dependencies & Build

1. Update `package.json`: `"bootstrap": "^6.0.0"`
2. Replace `@popperjs/core` with `@floating-ui/dom`
3. If using Datepicker, add peer dep `vanilla-calendar-pro`
4. Sass: replace all `@import` with `@use` (Node Sass is no longer supported)

```scss
// v5
@import "bootstrap/scss/bootstrap";

// v6
@use "bootstrap/scss/bootstrap";

// v6 with overrides
@use "bootstrap/scss/bootstrap" with (
  $spacer: 1rem
);
```

---

## Phase 2: CSS Class & Attribute Renames

### Responsive & state prefix syntax

v6 moves breakpoints and pseudo-states from infix/suffix to prefix with colon. Also renames `xxl` to `2xl`.

**Pattern:** `.{class}-{bp}-{value}` becomes `.{bp}:{class}-{value}` and `.{class}-{bp}` becomes `.{bp}:{class}`

| v5 | v6 |
|---|---|
| `.d-md-none`, `.p-lg-3` | `.md:d-none`, `.lg:p-3` |
| `.col-md-6` | `.md:col-6` |
| `.row-cols-md-3` | `.md:row-cols-3` |
| `.offset-md-2` | `.md:offset-2` |
| `.g-md-3`, `.gx-md-3` | `.md:g-3`, `.md:gx-3` |
| `.g-col-md-4` | `.md:g-col-4` |
| `.container-sm` | `.sm:container` |
| `.navbar-expand-md` | `.md:navbar-expand` |
| `.offcanvas-md` | `.md:drawer` |
| `.table-responsive-md` | `.md:table-responsive` |
| `.list-group-horizontal-md` | `.md:list-group-horizontal` |
| `.sticky-md-top` | `.md:sticky-top` |
| `.vstack-md` | `.md:vstack` |
| `.dialog-fullscreen-sm-down` | `.sm-down:dialog-fullscreen` |
| `.d-print-none` | `.print:d-none` |
| `.opacity-50-hover` | `.hover:opacity-50` |

### Component renames

Three components have been fully renamed. Find-and-replace these prefixes across classes, data attributes, events, JS imports, and CSS variables.

**Modal -> Dialog**

| Scope | v5 | v6 |
|---|---|---|
| Classes | `.modal`, `.modal-header/body/footer/title` | `.dialog`, `.dialog-header/body/footer/title` |
| Sizes | `.modal-sm/lg/xl/fullscreen` | `.dialog-sm/lg/xl/fullscreen` |
| Data attrs | `data-bs-toggle="modal"`, `data-bs-dismiss="modal"` | `data-bs-toggle="dialog"`, `data-bs-dismiss="dialog"` |
| JS export | `Modal` | `Dialog` |
| Events | `*.bs.modal` | `*.bs.dialog` |
| CSS vars | `--modal-*` | `--dialog-*` |
| Body class | `.modal-open` on `<body>` | `.dialog-open` on `<html>` |

Remove `.modal-dialog` and `.modal-content` wrappers entirely — see Phase 3.

**Offcanvas -> Drawer**

| Scope | v5 | v6 |
|---|---|---|
| Classes | `.offcanvas`, `.offcanvas-start/end/top/bottom/header/body/title` | `.drawer`, `.drawer-start/end/top/bottom/header/body/title` |
| Data attrs | `data-bs-toggle="offcanvas"`, `data-bs-dismiss="offcanvas"` | `data-bs-toggle="drawer"`, `data-bs-dismiss="drawer"` |
| JS export | `Offcanvas` | `Drawer` |
| Events | `*.bs.offcanvas` | `*.bs.drawer` |
| CSS vars | `--offcanvas-*` | `--drawer-*` |
| Sass | `$zindex-offcanvas` | `$zindex-drawer` |

**Dropdown -> Menu**

| Scope | v5 | v6 |
|---|---|---|
| Classes | `.dropdown-menu`, `.dropdown-item`, `.dropdown-divider`, `.dropdown-header` | `.menu`, `.menu-item`, `.menu-divider`, `.menu-header` |
| Data attrs | `data-bs-toggle="dropdown"` | `data-bs-toggle="menu"` |
| JS export | `Dropdown` | `Menu` |
| Events | `*.bs.dropdown` | `*.bs.menu` |
| Sass | `$zindex-dropdown` | `$zindex-menu` |

Also remove: `.dropdown-toggle` (no longer needed), `.dropdown` wrapper, `.dropdown-toggle-split`. See Phase 3 for new markup.

### Button & badge variants -> theme tokens

Per-color classes are replaced by variant + `.theme-*` composition. Apply to all colors (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`).

| v5 | v6 |
|---|---|
| `.btn-primary` | `.btn-solid .theme-primary` |
| `.btn-outline-primary` | `.btn-outline .theme-primary` |
| `.alert-primary` | `.alert .theme-primary` |
| `.badge.bg-primary` | `.badge-subtle .theme-primary` |

New button variants: `.btn-solid`, `.btn-outline`, `.btn-subtle`, `.btn-text`, `.btn-styled`, `.btn-link`.

### Utility class renames

| v5 | v6 |
|---|---|
| `.text-primary`, `.text-danger`, etc. | `.fg-primary`, `.fg-danger`, etc. |
| `.text-muted` | `.fg-secondary` |
| `.mh-*` | `.max-h-*` |
| `.mw-*` | `.max-w-*` |
| `.form-select` | `.form-control` (on `<select>`) |
| `.clearfix` | `.d-flow-root` |
| `.has-validation` | Remove (no longer needed) |

### Font size classes

v6 replaces the numeric scale with t-shirt sizes (ascending). The full v6 scale is `xs sm md lg xl 2xl 3xl 4xl 5xl 6xl`. The rem values below are the **v5** sizes, shown only to help you match each class.

| v5 (size) | v6 |
|---|---|
| `.fs-1` (2.5rem) | `.fs-4xl` |
| `.fs-2` (2rem) | `.fs-3xl` |
| `.fs-3` (1.75rem) | `.fs-2xl` |
| `.fs-4` (1.5rem) | `.fs-xl` |
| `.fs-5` (1.25rem) | `.fs-lg` |
| `.fs-6` (1rem) | `.fs-md` |

Note: in v6, `lg` and larger are **fluid `clamp()` values** that scale with the viewport between a min and a max (e.g. `4xl` is `clamp(2.25rem, 1.75rem + 2.5vw, 3rem)`); `xs`/`sm`/`md` stay fixed. So sizes won't match v5 exactly — the mapping preserves the relative scale, not the precise rem.

### Spacer scale

Keys 3-5 have changed values. To preserve v5 spacing: `.p-3` (1rem) -> `.p-4`, `.p-4` (1.5rem) -> `.p-6`, `.p-5` (3rem) -> `.p-9`.

| Key | v5 | v6 |
|---|---|---|
| 3 | `1rem` | `0.75rem` |
| 4 | `1.5rem` | `1rem` |
| 5 | `3rem` | `1.25rem` |
| 6-9 | — | `1.5rem`, `2rem`, `2.5rem`, `3rem` |

### Form validation

| v5 | v6 |
|---|---|
| `.needs-validation` on `<form>` | `data-bs-validate` on `<form>` |
| `.was-validated` via JS | Remove — `:user-invalid` handles it |
| `<div class="valid-tooltip">` | `<div class="tooltip valid-tooltip">` |
| `<div class="invalid-tooltip">` | `<div class="tooltip invalid-tooltip">` |

---

## Phase 3: Structural HTML Changes

These components have fundamentally new markup, not just class renames.

### Dialog (was Modal)

Remove the `.modal-dialog` and `.modal-content` wrappers. Use a single `<dialog>` element. The backdrop is now native `::backdrop`.

```html
<!-- v5 -->
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">Content</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- v6 -->
<dialog class="dialog" id="exampleDialog">
  <div class="dialog-header">
    <h5 class="dialog-title">Title</h5>
    <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>
  </div>
  <div class="dialog-body">Content</div>
  <div class="dialog-footer">
    <button class="btn-solid theme-secondary" data-bs-dismiss="dialog">Close</button>
  </div>
</dialog>
```

### Accordion

Replace Collapse JS with native `<details>`/`<summary>`. The `name` attribute creates exclusive groups (replaces `data-bs-parent`). Add `.accordion-icon` SVG inside `<summary>`. Remove `.accordion-button` and `.accordion-collapse`.

```html
<!-- v5 -->
<div class="accordion" id="myAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
        Item 1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#myAccordion">
      <div class="accordion-body">Content</div>
    </div>
  </div>
</div>

<!-- v6 -->
<div class="accordion">
  <details class="accordion-item" name="myAccordion" open>
    <summary class="accordion-header">
      Item 1
      <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
    </summary>
    <div class="accordion-body">Content</div>
  </details>
</div>
```

### Menu (was Dropdown)

Remove `.dropdown` wrapper and `.dropdown-toggle`. Flatten `<ul><li><a>` to `<div><a>`. Toggle and `.menu` are siblings.

```html
<!-- v5 -->
<div class="dropdown">
  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">Menu</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Other</a></li>
  </ul>
</div>

<!-- v6 -->
<button class="btn-solid theme-secondary" data-bs-toggle="menu">Menu</button>
<div class="menu">
  <a class="menu-item" href="#">Action</a>
  <hr class="menu-divider">
  <a class="menu-item" href="#">Other</a>
</div>
```

### Close button

The markup does **not** change — `.btn-close` stays an empty element. Do **not** add a child SVG (that double-renders the icon). What changed is internal: v6 draws the icon with a CSS `mask` (`--btn-close-icon`) over `background-color: currentcolor`, so the button now inherits the current text `color` instead of a fixed image.

```html
<!-- v5 and v6 — identical markup -->
<button type="button" class="btn-close" aria-label="Close"></button>
```

Because the icon is `currentcolor`, the v5 `.btn-close-white` variant is **removed** — to get a light close button, set the text color (e.g. place it in a dark `.theme-*` context or add a `.fg-*` / `color` utility) instead.

### Checkbox

Replace `.form-check` wrapper with `.check`. Add an SVG with `.checked` and `.indeterminate` paths. Radios (`.radio`) and switches (`.switch`) use similar wrappers but do not need SVG icons.

```html
<!-- v5 -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="check1">
  <label class="form-check-label" for="check1">Check me</label>
</div>

<!-- v6 -->
<div class="form-field">
  <div class="check">
    <input type="checkbox" id="check1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path class="checked" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 8 3 3 5-5"/>
      <path class="indeterminate" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 8.5h6"/>
    </svg>
  </div>
  <label for="check1">Check me</label>
</div>
```

Radio and switch equivalents:

```html
<!-- v6 radio -->
<div class="form-field">
  <input type="radio" id="radio1" class="radio">
  <label for="radio1">Pick me</label>
</div>

<!-- v6 switch -->
<div class="form-field">
  <div class="switch">
    <input type="checkbox" id="switch1" role="switch" switch>
  </div>
  <label for="switch1">Toggle me</label>
</div>
```

### Toggle buttons

Input is now nested inside the label. `.btn-check` goes on the label. No `id`/`for` needed.

```html
<!-- v5 -->
<input type="checkbox" class="btn-check" id="toggle1" autocomplete="off">
<label class="btn btn-outline-primary" for="toggle1">Toggle</label>

<!-- v6 -->
<label class="btn-check btn-solid theme-primary">
  <input type="checkbox" autocomplete="off">
  Toggle
</label>
```

### Breadcrumbs

Add `.breadcrumb-link` on `<a>` elements. Add `.breadcrumb-divider` separator elements between items (replaces `::before` pseudo-elements).

```html
<!-- v5 -->
<ol class="breadcrumb">
  <li class="breadcrumb-item"><a href="#">Home</a></li>
  <li class="breadcrumb-item active">Library</li>
</ol>

<!-- v6 -->
<ol class="breadcrumb">
  <li class="breadcrumb-item"><a class="breadcrumb-link" href="#">Home</a></li>
  <li class="breadcrumb-divider">/</li>
  <li class="breadcrumb-item"><a class="breadcrumb-link active" href="#">Library</a></li>
</ol>
```

---

## Phase 4: JavaScript

### ESM-only

All dist files are now ES modules. No more UMD bundles or `window.bootstrap` global.

```html
<!-- v5 -->
<script src="bootstrap.bundle.min.js"></script>

<!-- v6 -->
<script type="module" src="bootstrap.bundle.min.js"></script>
```

Replace global namespace access with imports:

```js
// v5
const tooltip = bootstrap.Tooltip.getOrCreateInstance(el)

// v6
import { Tooltip } from './bootstrap.bundle.min.js'
const tooltip = Tooltip.getOrCreateInstance(el)
```

Data attribute APIs (`data-bs-toggle`, etc.) are unchanged — just add `type="module"` to the script tag. Bundler imports (`import { X } from 'bootstrap'`) work as before.

### Renamed JS exports

| v5 | v6 |
|---|---|
| `Modal` | `Dialog` |
| `Offcanvas` | `Drawer` |
| `Dropdown` | `Menu` |

### Popper -> Floating UI

Replace `@popperjs/core` with `@floating-ui/dom`. Rename the `popperConfig` option to `floatingConfig` on Tooltip, Popover, and Menu.

### Removed

- jQuery support
- `bootstrap.esm.js` / `bootstrap.esm.min.js` — use `bootstrap.js`
- `js/index.umd.js`

### Validation JS

```js
// v5
document.querySelectorAll('.needs-validation')
form.classList.add('was-validated')

// v6
document.querySelectorAll('form[data-bs-validate]')
// Remove the was-validated line entirely
```

---

## Phase 5: Sass

### Renamed files

| v5 | v6 |
|---|---|
| `_variables.scss` | `_config.scss` |
| `_variables-dark.scss` | Removed (merged into `_theme.scss`) |
| `_maps.scss` | Removed |
| `_placeholders.scss` | `_placeholder.scss` |
| `_spinners.scss` | `_spinner.scss` |
| `_form-check.scss` | `_checkbox.scss`, `_radio.scss`, `_switch.scss` |
| `mixins/_forms.scss` | `mixins/_form-validation.scss` |
| `forms/_form-variables.scss` | Removed |
| `vendor/_rfs.scss` | Removed |

### Renamed variables and functions

| v5 | v6 |
|---|---|
| `$grid-breakpoints` | `$breakpoints` |
| `$border-radius`, `$border-radius-sm/lg/xl/xxl`, `$border-radius-pill` | Removed — see the radius scale below |
| `$text-muted` | Use secondary color |
| `$hr-bg-color` | `$hr-border-color` |
| `$hr-height` | `$hr-border-width` |
| `$zindex-dropdown` | `$zindex-menu` |
| `$zindex-offcanvas` | `$zindex-drawer` |
| `$form-validation-states` | `$validation-states` |
| `$btn-close-white-filter` | `$btn-close-filter-dark` |
| `add()` / `subtract()` | `calc()` |
| `breakpoint-infix()` | `breakpoint-prefix()` (returns `"md\:"` not `"-md"`) |
| `$infix` (in loop mixins) | `$prefix` |
| `$prefix` (CSS var prefix) | Removed — use PostCSS instead |

### Border radius scale

The `$border-radius-*` variables are gone. v6 uses a single base `$radius: .5rem` and a `$radii` map (keys `0`–`9`, e.g. `5: $radius`, `9: $radius * 3`), exposed as `--radius-0`–`--radius-9` tokens (plus `--radius-pill`). The `.rounded-*` utilities now span `0`–`9` and map to different values than v5, so shift class numbers up to keep the same roundness (e.g. `.rounded-1` → `.rounded-3`, `.rounded-3` → `.rounded-5`). Override the base or the map entries rather than the old per-size variables:

```scss
@use "bootstrap/scss/bootstrap" with (
  $radius: .375rem // scales the whole map
);
```

### Removed (no replacement)

- `$nested-kbd-font-weight`
- `$enable-validation-icons`
- `$accordion-button-focus-border-color`, `$tooltip-arrow-color`
- `$popover-arrow-color`, `$popover-arrow-outer-color`
- `$alert-bg-scale`, `$alert-border-scale`, `$alert-color-scale`
- `$list-group-item-bg-scale`, `$list-group-item-color-scale`
- `$carousel-dark-indicator-active-bg`, `$carousel-dark-caption-color`, `$carousel-dark-control-icon-filter`
- `$dropdown-header-padding`
- All `*-focus-box-shadow` variables — use `focus-ring()` mixin with `--focus-ring-*` CSS custom properties
- RFS mixins — use `clamp()` for responsive sizing
- `create-css-vars()` mixin
- `muted`, `black-50`, `white-50` from text color utilities map

### Utility API

Removed `css-var`, `css-variable-name`, and `local-vars` options. Use `property` map and `variables` instead.

---

## Rebuilt behavior & new components

Beyond the renames above, several things changed how a v5 project behaves or what's available. Check the docs for full markup/options.

### Carousel — rebuilt on CSS scroll-snap

The markup (`.carousel` → `.carousel-inner` → `.carousel-item`) and the JS API (`next`/`prev`/`to`/`cycle`/`pause`, `slide`/`slid` events) are preserved, but several things changed:

- **`ride` → `autoplay` (boolean, opt-in).** `data-bs-ride="carousel"` becomes `data-bs-autoplay="true"`; `{ ride: 'carousel' }` becomes `{ autoplay: true }`. Default is `autoplay: false`, so a v5 carousel that auto-advanced now sits still until you opt in. Interacting with an autoplaying carousel now **permanently stops** it (WCAG 2.2.2).
- **`wrap` → `ends`.** `wrap: true` → `ends: "wrap"` (or the new default `"loop"`); `wrap: false` → `ends: "stop"`. Set via `data-bs-ends`. The `touch` option is removed (native scroll handles it).
- **Removed classes:** `.carousel-control-prev/next` (compose a `.btn-icon` + `data-bs-slide` + `.carousel-icon-prev/next`), `.carousel-caption` (use your own markup), `.carousel-dark` (use `data-bs-theme="dark"`), `.carousel-stacked` (now the default), and the transitional `.carousel-item-start/end/next/prev`. Overlaid controls now require `.carousel-overlay`. Control-icon classes renamed `.carousel-control-prev-icon` → `.carousel-icon-prev` (and `-next`).

### New components (didn't exist in v5)

| Component | Trigger / hook | Purpose |
|---|---|---|
| Combobox | `data-bs-toggle="combobox"` | Filterable/autocomplete select built on Menu |
| Chip / Chip input | `.chip`, `.chip-input` (`data-bs-chips`) | Tags / tokens + interactive entry |
| Datepicker | `data-bs-toggle="datepicker"` | Date picker (peer dep `vanilla-calendar-pro`) |
| Range | `.form-range` (+ `data-bs-bubble`, ticks) | Enhanced range slider with a value bubble |
| Strength | `data-bs-strength` | Password-strength meter |
| OTP input | `data-bs-otp` | One-time-code input |
| Nav overflow | `.nav-overflow` | Collapses overflowing nav items into a menu |
| Toggler | `data-bs-toggle="toggler"` | Generic class/attribute toggler |
| Submenu | `.submenu` (within Menu) | Nested menus (`submenuTrigger`, `submenuDelay`) |
| Stepper | `.stepper` | Multi-step workflow (CSS-only) |
| Avatar | `.avatar` | Avatars with sizes, status, `.avatar-stack` (CSS-only) |
| Form adorn | `.form-adorn` | Icon/text decoration on inputs (CSS-only) |
| Prose | `.prose` / `.not-prose` | Rich-typography scoping (CSS-only) |

### Removed / changed internals

- **`util/backdrop.js` removed.** Dialog and Drawer use the native `<dialog>` element, so the backdrop is the native `::backdrop` (no JS backdrop, no manual `aria-hidden`/focus-trap/scrollbar handling). If you imported `bootstrap/js/src/util/backdrop` directly, it's gone.
- **CSS `@layer`.** Component styles are wrapped in cascade layers (`colors, theme, config, root, reboot, layout, content, forms, components, custom, helpers, utilities`). Unlayered author CSS now wins over Bootstrap regardless of source order — if your v5 overrides relied on specificity or load order, re-check them.
- **`--bs-*-rgb` variables removed.** The `$*-rgb` Sass vars and `--bs-*-rgb` custom properties are gone. Replace `rgba(var(--bs-primary-rgb), .5)` with `color-mix(in oklab, var(--bs-primary), transparent 50%)` (or use the color directly).

---

## Phase 6: Verify

1. Build the project and fix any compilation errors.
2. Search for remaining v5 patterns:
   - `modal` classes/attributes (should be `dialog`)
   - `offcanvas` (should be `drawer`)
   - `dropdown` (should be `menu`)
   - `d-md-`, `d-lg-`, `col-md-`, etc. (should use `md:` prefix syntax)
   - `btn-primary`, `btn-outline-` (should use `.btn-solid .theme-*`)
   - `.text-primary`, `.text-danger` (should be `.fg-*`)
   - `@import` in Sass (should be `@use`)
   - `form-select` (should be `form-control`)
   - `was-validated`, `needs-validation` (should be `data-bs-validate`)
   - `popperConfig` (should be `floatingConfig`)
   - `form-check` (should be `check`, `radio`, or `switch`)
   - `var(--bs-*-rgb)` / `rgba(var(--bs-…-rgb)` (removed — use `color-mix()`)
   - `$border-radius` Sass vars (removed — use `$radius` / `$radii` / `--radius-*`)
   - child `<svg>` inside `.btn-close` (should be empty — icon is a CSS mask)
   - `.btn-close-white` (removed — set text `color` instead)
   - `data-bs-ride` (renamed to `data-bs-autoplay`); `wrap:` carousel option (now `ends:`)
   - `.carousel-control-prev/next`, `.carousel-caption`, `.carousel-dark`, `.carousel-stacked` (all removed)
   - `.fs-1`–`.fs-6` (should be `.fs-4xl` … `.fs-md`)
   - `.link-offset-*` / `.link-underline-*` (now `.underline-offset-*` / `.underline-*`)
3. Test in browser — v6 requires support for `oklch()` and `color-mix()`.

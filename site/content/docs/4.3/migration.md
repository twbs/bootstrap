---
layout: docs
title: Migrating to v5
description: Track and review changes to the Bootstrap source files, documentation, and components to help you migrate from v4 to v5.
group: migration
aliases: "/migration/"
toc: true
---

## Browser support

See the browser and devices page for details on what is currently supported in Bootstrap 5. Since v4, here's what's changed to our browser support:

- Dropped support for Internet Explorer 10 and 11
- Dropped support for Firefox NN - MM
- Dropped support for Safari NN
- Dropped support for iOS Safari NN
- Dropped support for Chrome NN
- Dropped support for Android NN

## Sass

Changes to our source Sass files and compiled CSS.

- Removed `hover`, `hover-focus`, `plain-hover-focus`, and `hover-focus-active` mixins. Use regular CSS syntax for these moving forward. [See #28267](https://github.com/twbs/bootstrap/pull/28267).
- Remove previously deprecated mixins
  - `float()`
  - `form-control-mixin()`
  - `nav-divider()`
  - `retina-img()`
  - `text-hide()` (also dropped the associated utility class, `.text-hide`)
  - `visibility()`
  - `form-control-focus()`
- **Todo:** New variables?
- **Todo:** Rearrange forms source files (under `scss/forms/`)
- **Todo:** Rearrange grid source files (under `scss/grid/`)
- Removed print styles and `$enable-print-styles` variable. Print display classes, however, have remained intact. [See #28339](https://github.com/twbs/bootstrap/pull/28339).
- Dropped `color()`, `theme-color()` & `gray()` functions in favor of variables. [See #29083](https://github.com/twbs/bootstrap/pull/29083)
- The `theme-color-level()` function is renamed to `color-level()` and now accepts any color you want instead of only `$theme-color` colors. [See #29083](https://github.com/twbs/bootstrap/pull/29083)
- `$enable-grid-classes` doesn't disable the generation of container classes anymore [See #29146](https://github.com/twbs/bootstrap/pull/29146)
- Line heights are dropped from several components to simplify our codebase. The `button-size()` and `pagination-size()` do not accept line height parameters anymore. [See #29271](https://github.com/twbs/bootstrap/pull/29271)
- The `button-variant()` mixin now accepts 3 optional color parameters, for each button state, to override the color provided by `color-contrast()`. By default, these parameters will find which color provides more contrast against the button state's background color with `color-contrast()`.
- The `button-outline-variant()` mixin now accepts an additional argument, `$active-color`, for setting the button's active state text color. By default, this parameter will find which color provides more contrast against the button's active background color with `color-contrast()`.
- Ditch the Sass map merges, which makes it easier to remove redundant values. Keep in mind you now have to define all values in the Sass maps like `$theme-colors`. Check out how to deal with Sass maps on the [theming documentation]({{< docsref "/getting-started/theming#maps-and-loops" >}}).
- `color-yiq()` function is renamed to `color-contrast()` since it's not related to YIQ colorspace anymore — [See #30168](https://github.com/twbs/bootstrap/pull/30168/) — and related variables are renamed alongside:
  - `$yiq-contrasted-threshold` is renamed `$min-contrast-ratio`,
  - `$yiq-text-dark` and `$yiq-text-light` are respectively renamed `$color-contrast-dark` and `$color-contrast-light`.

## JavaScript

Changes to our source and compiled JavaScript files.

- Dropped jQuery dependency and rewrote plugins to be in regular JavaScript.
- Removed underscore from public static methods like `_getInstance()` → `getInstance()`.

## Grid and layout

Changes to any layout tools and our grid system.

- Dropped `.media` component as it can be built with utility classes. [See #28265](https://github.com/twbs/bootstrap/pull/28265).
- Remove `position: relative` from grid columns.
- The horizontal padding is added to the direct children in a row instead of the columns themselves.
  - This simplifies our codebase.
  - The column classes can now be used stand alone. Whenever they are used outside a `.row`, horizontal padding won't be added.
- Responsive gutter classes can be used to control the gutter width in as well horizontal, vertical or both directions.
- The gutter width is now set in `rem` and decreased from `30px` to `1.5rem` (24px).
- `bootstrap-grid.css` now only applies `box-sizing: border-box` to the column instead of resetting the global box-sizing. This way the grid system can be used, even if `box-sizing: border-box` in not applied to each element.

## Content, Reboot, etc

Changes to Reboot, typography, tables, and more.

- [RFS]({{< docsref "/getting-started/rfs" >}}) enabled for automated font size rescaling. [See #29152](https://github.com/twbs/bootstrap/pull/29152)
- Reset default horizontal `padding-left` on `<ul>` and `<ol>` elements from browser default `40px` to `2rem`.
- Simplified table styles (no more 2px border on `thead > th` elements) and tightened cell padding.
- Dropped `.pre-scrollable` class. [See #29135](https://github.com/twbs/bootstrap/pull/29135)
- `.text-*` utilities do not add hover and focus states to links anymore. `.link-*` helper classes can be used instead. [See #29267](https://github.com/twbs/bootstrap/pull/29267)
- Drop `.text-justify` class. [See #229793](https://github.com/twbs/bootstrap/pull/29793)

## Forms

- Rearranged form documentation under its own top-level section.
  - Split out old Forms page into several subpages
  - Moved input groups docs under new Forms section
- Rearranged source Sass files under `scss/forms/`, including moving over input group styles.
- Combined native and custom checkboxes and radios into single `.form-check` class.
  - New checks support sizing via `em`/`font-size` or explicit modifier classes now.
  - New checks now appear larger by default for improved usability.
  - Dropped `.custom-control` and associated classes.
  - Renamed most `$custom-control` variables to `$form-control` ones.
- Combined native and custom selects into `.form-select`.
  - Dropped `.custom-select` and associated classes.
  - Renamed most `$custom-select` variables to `$form-select` ones.
- Updated file input component with same overall design, but improved HTML.
  - Refactored `.form-file` markup to resolve some visual bugs while allowing translation and button text changes via HTML instead of CSS.
  - Dropped native `.form-control-file` and `.form-control-range` components entirely.
  - Renamed `.custom-file` to `.form-file` (including variables).
  - Added support for `:focus` and `:disabled` styles.
- Renamed `.custom-range` to `.form-range` (including variables).
- Dropped `.form-group` for margin utilities (we've replaced our docs examples with `.mb-3`).
- Dropped `.form-row` for the more flexible grid gutters.
- Dropped `.form-inline` for the more flexible grid.
- Dropped support for `.form-control-plaintext` inside `.input-group`s.
- Dropped `.form-text` as existing utilities cover this use class's former use case (e.g., `.mt-2`, `.text-small`, and/or `.text-muted`).
- Dropped `.input-group-append` and `.input-group-prepend`. You can now just add buttons and `.input-group-text` as direct children of the input groups.
- Form labels now require the `.form-label` class. Sass variables are now available to style form labels to your needs. [See #30476](https://github.com/twbs/bootstrap/pull/30476)

## Components

### Disabled states

- Disabled states of the buttons, close button, pagination link & form range now have `pointer-events: none` added. This simplifies our codebase and makes it easier to override active states in CSS. [#29296](https://github.com/twbs/bootstrap/pull/29296).

### Alerts

- **Todo:** Remove auto-darkening of `<hr>` elements in `.alert-*` class variants. `<hr>`s use `rgba()` for their color, so these should naturally blend anyway.

### Badges

Badges were overhauled to better differentiate themselves from buttons and to better utilize utility classes.

- **Todo:** Removed and replaced `.badge` modifier classes with background utility classes (e.g., use `.bg-primary` instead of `.badge-primary`)
- **Todo:** Removed `.badge-pill` for the `.rounded-pill` utility class
- **Todo:** Removed badge's hover and focus styles for `a.badge` and `button.badge`.

### Cards

- Removed the card columns in favor of a Masonry grid [See #28922](https://github.com/twbs/bootstrap/pull/28922).
- Removed card decks in favor of the grid which adds more flexibility over responsive behaviour.

### Jumbotron

- The jumbotron component is removed in favor of utility classes like `.bg-light` for the background color and `.p-*` classes to control padding.

### Navbars

- All navbars now require a container within. This drastically simplifies spacing requirements and removes the need for extensive CSS overrides we added for responsive containers in v4.

### Pagination

- Pagination links now have customizable `margin-left` that are dynamically rounded on all corners when separated from one another.

### Popovers

- Renamed `.arrow` to `.popover-arrow`

### Tooltips

- Renamed `.arrow` to `.tooltip-arrow`

## Accessibility

- `.sr-only-focusable` does not require `.sr-only` anymore. [See #28720](https://github.com/twbs/bootstrap/pull/28720).

## Utilities

- Renamed `.text-monospace` to `.font-monospace`
- Decreased the number of responsive order utilities per breakpoint. The highest order utility with a number now is `.order-5` instead of `.order-12`. [See #28874](https://github.com/twbs/bootstrap/pull/28874).
- New `line-height` utilities: `.lh-1`, `.lh-sm`, `.lh-base` and `.lh-lg`. See [here]({{< docsref "/utilities/text#line-height" >}}).
- Added `.bg-body` for quickly setting the `<body>`'s background to additional elements.
- **Todo:** Drop `.text-hide` as it's an antiquated method for hiding text that shouldn't be used anymore
- **Todo:** Split utilities into property-value utility classes and helpers

## Docs

-  Removed "Wall of browser bugs" page because it has become obsolete

## Build tools

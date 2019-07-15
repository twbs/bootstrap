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

- Dropped support for Internet Explorer NN
- Dropped support for Firefox NN - MM
- Dropped support for Safari NN
- Dropped support for iOS Safari NN
- Dropped support for Chrome NN
- Dropped support for Android NN

## Sass

Changes to our source Sass files and compiled CSS.

- Removed `hover`, `hover-focus`, `plain-hover-focus`, and `hover-focus-active` mixins. Use regular CSS syntax for these moving forward. [See #28267](https://github.com/twbs/bootstrap/pull/28267).
- **Todo:** Remove previously deprecated mixins
  - `float()`
  - `form-control-mixin()`
  - `retina-img()`
  - `text-hide()` (also dropped the associated utility class, `.text-hide`)
  - `visibility()`
- **Todo:** New variables?
- **Todo:** Rearrange forms source files (under `scss/forms/`)
- **Todo:** Rearrange grid source files (under `scss/grid/`)
- Removed print styles and `$enable-print-styles` variable. Print display classes, however, have remained intact. [See #28339](https://github.com/twbs/bootstrap/pull/28339).

## JavaScript

Changes to our source and compiled JavaScript files.

- Dropped jQuery dependency and rewrote plugins to be in regular JavaScript.

## Grid and layout

Changes to any layout tools and our grid system.

- Dropped `.media` component as it can be built with utility classes. [See #28265](https://github.com/twbs/bootstrap/pull/28265).
- **Todo:** Remove `position: relative` from grid columns
- **Todo:** Integrate CSS grid into our grid system

## Content, Reboot, etc

Changes to Reboot, typography, tables, and more.

- **Todo:** Make RFS enabled by default
- Reset default horizontal `padding-left` on `<ul>` and `<ol>` elements from browser default `40px` to `2rem`.
- Simplified table styles (no more 2px border on `thead > th` elements) and tightened cell padding.

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
- Dropped support for `.form-control-plaintext` inside `.input-group`s.

## Components

### Alerts

- **Todo:** Remove auto-darkening of `<hr>` elements in `.alert-*` class variants. `<hr>`s use `rgba()` for their color, so these should naturally blend anyway.

### Badges

Badges were overhauled to better differentiate themselves from buttons and to better utilize utility classes.

- **Todo:** Removed and replaced `.badge` modifier classes with background utility classes (e.g., use `.bg-primary` instead of `.badge-primary`)
- **Todo:** Removed `.badge-pill` for the `.rounded-pill` utility class
- **Todo:** Removed badge's hover and focus styles for `a.badge` and `button.badge`.

### Icons (New!)

- Added new Bootstrap icons to the project for our documentation, form controls, and more.
- Removed Open Iconic icons from project source code for form controls.

### Jumbotron

- The jumbotron component is removed in favor of utility classes like `.bg-light` for the background color and `.p-*` classes to control padding.

### Popovers

- Renamed `.arrow` to `.popover-arrow`

### Tooltips

- Renamed `.arrow` to `.tooltip-arrow`

## Accessibility

- `.sr-only-focusable` does not require `.sr-only` anymore. [See #28720](https://github.com/twbs/bootstrap/pull/28720).

## Utilities

- Renamed `.text-monospace` to `.font-monospace`
- Decreased the number of responsive order utilities per breakpoint. The highest order utility with a number now is `.order-5` instead of `.order-12`. [See #28874](https://github.com/twbs/bootstrap/pull/28874).
- **Todo:** Drop `.text-hide` as it's an antiquated method for hiding text that shouldn't be used anymore
- **Todo:** Split utilities into property-value utility classes and helpers

## Build tools

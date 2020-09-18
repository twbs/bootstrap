---
layout: docs
title: Migrating to v5
description: Track and review changes to the Bootstrap source files, documentation, and components to help you migrate from v4 to v5.
group: migration
aliases: "/migration/"
toc: true
---

## v5.0.0-alpha2

### Sass

- "Screen reader" classes are now "visually hidden" classes.
  - Changed the Sass file from `scss/helpers/_screenreaders.scss` to `scss/helpers/_visually-hidden.scss`
  - Renamed `.sr-only` and `.sr-only-focusable` to `.visually-hidden` and `.visually-hidden-focusable`
  - Renamed `sr-only()` and `sr-only-focusable()` mixins to `visually-hidden()` and `visually-hidden-focusable()`.
- Add border width utility, see [31484](https://github.com/twbs/bootstrap/pull/31484)

### Docs

- Renamed "Screen readers" helper page to "Visually hidden", and filename to `visually-hidden`
- Renamed "Checks" page to "Checks & radios", and filename to `checks-radios`
- Improved documentation of check/radio powered button groups

### Reboot

- Updated `th` styling to use a default `null` value for `font-weight` and inherit `text-align` instead of setting explicitly.

### Colors

- Bumped color contrast ratio from 3:1 to 4.5:1.
- Set `$black` as color contrast color instead of `$gray-900`.
- Improved `$green` (and its theme alias `$success`) color to reach new minimum color contrast (moving from `#28a745` to `#198754`).
- Improved `$cyan` (and its theme alias `$info`) color to be more vibrant (moving from `#17a2b8` to `#0dcaf0`).

### Forms

- Resized checks and radios to be `1em` instead of `1.25em` in an effort to make them scale better with custom `$font-size-base` values and more.

### Components

### Badges

- Increased default padding for badges from `.25em`/`.5em` to `.35em`/`.65em`.

#### Buttons

- Disabled states of buttons are easier to customize thanks to additional arguments in the `button-variant()` mixin. [See #30639.](https://github.com/twbs/bootstrap/pull/30639)

#### Navs

- Added new `null` variables for `font-size`, `font-weight`, `color`, and `:hover` `color` to the `.nav-link` class.

#### Popovers

- Renamed `whiteList` option to `allowList`.

#### Toasts

- Made default toast duration 5 seconds.
- Removed `overflow: hidden` from toasts and replaced with proper `border-radius`s with `calc()` functions.

#### Tooltips

- Renamed `whiteList` option to `allowList`.

---

## v5.0.0-alpha1

### Browser support

See the browser and devices page for details on what is currently supported in Bootstrap 5. Since v4, here's what's changed to our browser support:

- Dropped support for Internet Explorer 10 and 11
- Dropped support for Microsoft Edge < 16
- Dropped support for Firefox < 60
- Dropped support for Safari < 10
- Dropped support for iOS Safari < 10
- Dropped support for Chrome < 60
- Dropped support for Android < 6

### Sass

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
- Rearranged forms source files under `scss/forms/`. [See Forms section for more details.](#forms)
- Removed print styles and `$enable-print-styles` variable. Print display classes, however, have remained intact. [See #28339](https://github.com/twbs/bootstrap/pull/28339).
- Dropped `color()`, `theme-color()` & `gray()` functions in favor of variables. [See #29083](https://github.com/twbs/bootstrap/pull/29083)
- The `theme-color-level()` function is renamed to `color-level()` and now accepts any color you want instead of only `$theme-color` colors. [See #29083](https://github.com/twbs/bootstrap/pull/29083)
- `$enable-grid-classes` doesn't disable the generation of container classes anymore [See #29146](https://github.com/twbs/bootstrap/pull/29146)
- Renamed `$enable-prefers-reduced-motion-media-query` and `$enable-pointer-cursor-for-buttons` to `$enable-reduced-motion` and `$enable-button-pointers` for brevity.
- Line heights are dropped from several components to simplify our codebase. The `button-size()` and `pagination-size()` do not accept line height parameters anymore. [See #29271](https://github.com/twbs/bootstrap/pull/29271)
- The `button-variant()` mixin now accepts 3 optional color parameters, for each button state, to override the color provided by `color-contrast()`. By default, these parameters will find which color provides more contrast against the button state's background color with `color-contrast()`.
- The `button-outline-variant()` mixin now accepts an additional argument, `$active-color`, for setting the button's active state text color. By default, this parameter will find which color provides more contrast against the button's active background color with `color-contrast()`.
- Ditch the Sass map merges, which makes it easier to remove redundant values. Keep in mind you now have to define all values in the Sass maps like `$theme-colors`. Check out how to deal with [Sass maps]({{< docsref "/customize/sass#maps-and-loops" >}}).
- `color-yiq()` function and related variables are renamed to `color-contrast()` since it's not related to YIQ colorspace anymore. [See #30168.](https://github.com/twbs/bootstrap/pull/30168/)
  - `$yiq-contrasted-threshold` is renamed to `$min-contrast-ratio`.
  - `$yiq-text-dark` and `$yiq-text-light` are respectively renamed to `$color-contrast-dark` and `$color-contrast-light`.
- Linear gradients are simplified when gradients are enabled and therefore, `gradient-bg()` now only accepts an optional `$color` parameter.
- The `bg-gradient-variant()` mixin is removed since the `.bg-gradient` class can now be used to add gradients to elements instead of the `.bg-gradient-*` classes.
- The `media-breakpoint-down()` uses the breakpoint itself instead of the next breakpoint. Use `media-breakpoint-down(lg)` instead of `media-breakpoint-down(md)` to target viewports smaller than the `lg` breakpoint.
- The `media-breakpoint-between()` mixin's second parameter also uses the breakpoint itself instead of the next breakpoint. Use `media-between(sm, lg)` instead of `media-breakpoint-between(sm, md)` to target viewports between the `sm` and `lg` breakpoints.
- The `box-shadow()` mixin now better supports `none` and `null` with multiple arguments. Now you can pass multiple arguements with either value, and get the expected output. [See #30394](https://github.com/twbs/bootstrap/pull/30394).
- Each `border-radius()` mixin now has a default value. You can now call these mixins without specifying a border radius value and the `$border-radius` variable will be used. [See #31571](https://github.com/twbs/bootstrap/pull/31571)

### JavaScript

Changes to our source and compiled JavaScript files.

- Dropped jQuery dependency and rewrote plugins to be in regular JavaScript.
- Removed underscore from public static methods like `_getInstance()` → `getInstance()`.

### Color system

We've updated the color system that powers Bootstrap to improve color contrast and provide a much more extensive set of colors.

- Updated blue and pink base colors (`-500`) to ensure WCAG 2.1 AA contrast.
- Added new tints and shades for every color, providing nine separate colors for each base color, as new Sass variables.
- To support our color system, we've added new custom `tint-color()` and `shade-color()` functions to mix our colors appropriately.

### Grid and layout

Changes to any layout tools and our grid system.

- Dropped the `.media` component as it can be built with utility classes. [See #28265](https://github.com/twbs/bootstrap/pull/28265).
- Remove `position: relative` from grid columns.
- The horizontal padding is added to the direct children in a row instead of the columns themselves.
  - This simplifies our codebase.
  - The column classes can now be used stand alone. Whenever they are used outside a `.row`, horizontal padding won't be added.
- The responsive gutter classes can be used to control the gutter width in horizontal, vertical or both directions.
- The gutter width is now set in `rem` and decreased from `30px` to `1.5rem` (24px).
- `bootstrap-grid.css` now only applies `box-sizing: border-box` to the column instead of resetting the global box-sizing. This way the grid system can be used, even if `box-sizing: border-box` is not applied to each element.

### Content, Reboot, etc

Changes to Reboot, typography, tables, and more.

- [RFS]({{< docsref "/getting-started/rfs" >}}) enabled for automated font size rescaling. [See #29152](https://github.com/twbs/bootstrap/pull/29152)
- Reset default horizontal `padding-left` on `<ul>` and `<ol>` elements from browser default `40px` to `2rem`.
- Simplified table styles (no more odd top border) and tightened cell padding.
- Nested tables do not inherit styles anymore.
- `.thead-light` and `.thead-dark` are dropped in favor of the `.table-*` variant classes which can be used for all table elements (`thead`, `tbody`, `tfoot`, `tr`, `th` and `td`).
- The `table-row-variant()` mixin is renamed to `table-variant()` and accepts only 2 parameters: `$color` (colon name) and `$value` (color code). The border color and accent colors are automatically calculated based on the table factor variables.
- Split table cell padding variables into `-y` and `-x`.
- Dropped `.pre-scrollable` class. [See #29135](https://github.com/twbs/bootstrap/pull/29135)
- `.text-*` utilities do not add hover and focus states to links anymore. `.link-*` helper classes can be used instead. [See #29267](https://github.com/twbs/bootstrap/pull/29267)
- Drop `.text-justify` class. [See #29793](https://github.com/twbs/bootstrap/pull/29793)

### Typography

- Removed `$display-*` variables for a new `$display-font-sizes` Sass map.
- Removed individual `$display-*-weight` variables for a single `$display-font-weight`.
- Added two new `.display-*` heading styles, `.display-5` and `.display-6`.
- Resized existing display headings for a slightly more consistent set of `font-size`s.

### Forms

- Rearranged form documentation under its own top-level section.
  - Split out old Forms page into several subpages
  - Moved input groups docs under the new Forms section
- Rearranged source Sass files under `scss/forms/`, including moving over input group styles.
- Combined native and custom checkboxes and radios into single `.form-check` class.
  - New checks support sizing via `em`/`font-size` or explicit modifier classes now.
  - New checks now appear larger by default for improved usability.
  - Dropped `.custom-control` and associated classes.
  - Renamed most `$custom-control` variables to `$form-control` ones.
- Combined native and custom selects into `.form-select`.
  - Dropped `.custom-select` and associated classes.
  - Renamed most `$custom-select` variables to `$form-select` ones.
- Updated file input component with the same overall design, but improved HTML.
  - Refactored `.form-file` markup to resolve some visual bugs while allowing translation and button text changes via HTML instead of CSS.
  - Dropped native `.form-control-file` and `.form-control-range` components entirely.
  - Renamed `.custom-file` to `.form-file` (including variables).
  - Added support for `:focus` and `:disabled` styles.
- Renamed `.custom-range` to `.form-range` (including variables).
- Dropped `.form-group` for margin utilities (we've replaced our docs examples with `.mb-3`).
- Dropped `.form-row` for the more flexible grid gutters.
- Dropped `.form-inline` for the more flexible grid.
- Dropped support for `.form-control-plaintext` inside `.input-group`s.
- Dropped `.input-group-append` and `.input-group-prepend`. You can now just add buttons and `.input-group-text` as direct children of the input groups.
- Form labels now require the `.form-label` class. Sass variables are now available to style form labels to your needs. [See #30476](https://github.com/twbs/bootstrap/pull/30476)

### Components

- Unified `padding` values for alerts, breadcrumbs, cards, dropdowns, list groups, modals, popovers, and tooltips to be based on our `$spacer` variable. [See #30564](https://github.com/twbs/bootstrap/pull/30564).

#### Disabled states

- Disabled states of the buttons, close button, pagination link & form range now have `pointer-events: none` added. This simplifies our codebase and makes it easier to override active states in CSS. [#29296](https://github.com/twbs/bootstrap/pull/29296).

#### Alerts

- Removed auto-darkening of `<hr>` elements in `.alert-*` class variants. `<hr>`s use `rgba()` for their color, so these should naturally blend anyway.

#### Badges

Badges were overhauled to better differentiate themselves from buttons and to better utilize utility classes.

- Removed and replaced `.badge` modifier classes with background utility classes (e.g., use `.bg-primary` instead of `.badge-primary`)
- Removed `.badge-pill` for the `.rounded-pill` utility class
- Removed badge's hover and focus styles for `a.badge` and `button.badge`.

#### Buttons

- The checkbox/radio toggle is removed from the button plugin in favour of a CSS only solution, which is documented in the [form checks and radios]({{< docsref "/forms/checks-radios#toggle-buttons" >}}) docs. The `.btn-check` class can be added to inputs, any label with `.btn` and modifier class can be used to theme the labels. [See #30650](https://github.com/twbs/bootstrap/pull/30650).

#### Cards

- Removed the card columns in favor of a Masonry grid [See #28922](https://github.com/twbs/bootstrap/pull/28922).
- Removed card decks in favor of the grid which adds more flexibility over responsive behavior.

#### Jumbotron

- The jumbotron component is removed in favor of utility classes like `.bg-light` for the background color and `.p-*` classes to control padding.

#### Navbars

- All navbars now require a container within. This drastically simplifies spacing requirements and removes the need for extensive CSS overrides we added for responsive containers in v4.

#### Pagination

- Pagination links now have customizable `margin-left` that are dynamically rounded on all corners when separated from one another.

#### Popovers

- Renamed `.arrow` to `.popover-arrow`

#### Tooltips

- Renamed `.arrow` to `.tooltip-arrow`

### Accessibility

- Unlike the old `.sr-only-focusable`, which only worked in combination with `.sr-only`, `.sr-only-focusable` can be used as a standalone class without `.sr-only`. [See #28720](https://github.com/twbs/bootstrap/pull/28720).

### Utilities

- Renamed `.text-monospace` to `.font-monospace`
- Decreased the number of responsive order utilities per breakpoint. The highest order utility with a number now is `.order-5` instead of `.order-12`. [See #28874](https://github.com/twbs/bootstrap/pull/28874).
- New `line-height` utilities: `.lh-1`, `.lh-sm`, `.lh-base` and `.lh-lg`. See [here]({{< docsref "/utilities/text#line-height" >}}).
- Added `.bg-body` for quickly setting the `<body>`'s background to additional elements.
- Drop `.text-hide` as it's an antiquated method for hiding text that shouldn't be used anymore
- Split utilities into property-value utility classes and helpers
- Negative margin utilities are disabled by default. You can re-enable them by setting `$enable-negative-margins: true`, but keep in mind this can increase the file size quite a lot.

### Docs

- Removed "Wall of browser bugs" page because it has become obsolete
- Switched from Jekyll to Hugo

### Build tools

- Updated all devDependencies
- We support only the latest Node.js LTS releases which are 10 and 12 at the time of writing

---
layout: docs
title: Migrating to v4
group: migration
---

Bootstrap 4 is a major rewrite of almost the entire project. The most notable changes are summarized immediately below, followed by more specific class and behavioral changes to relevant components.

{% callout info %}
**Heads up!** This will be in flux as work on the v4 alphas progresses. Until then consider it incomplete, and we'd love pull requests to help keep it up to date.
{% endcallout %}

## Summary

Here are the big ticket items you'll want to be aware of when moving from v3 to v4.

### Browser support

- Dropped IE8, IE9, and iOS 6 support. v4 is now only IE10+ and iOS 7+. For sites needing either of those, use v3.
- Added official support for Android v5.0 Lollipop's Browser and WebView. Earlier versions of the Android Browser and WebView remain only unofficially supported.

### Global changes

- Flexbox is enabled by default. In general this means a move away from floats and more across our components.
- Switched from [Less](http://lesscss.org/) to [Sass](http://sass-lang.com/) for our source CSS files.
- Switched from `px` to `rem` as our primary CSS unit, though pixels are still used for media queries and grid behavior as viewports are not affected by type size.
- Global font-size increased from `14px` to `16px`.
- Added a new grid tier for smaller devices at `576px` and below (our new `xs` tier).
- Replaced the separate optional theme with configurable options via SCSS variables (e.g., `$enable-gradients: true`).

### Grid system

- Added support for flexbox in the grid mixins and predefined classes.
- As part of flexbox, included support for vertical and horizontal alignment classes.
- Overhauled grid mixins to merge `make-col-span` into `make-col` for a singular mixin.
- Added a new `sm` grid tier below `768px` for more granular control. We now have `xs`, `sm`, `md`, `lg`, and `xl`. This also means every tier has been bumped up one level (so `.col-md-6` in v3 is now `.col-lg-6` in v4).
- Changed grid system media query breakpoints and container widths to account for new grid tier and ensure columns are evenly divisible by `12` at their max width.
- Grid breakpoints and container widths are now handled via Sass maps (`$grid-breakpoints` and `$container-max-widths`) instead of a handful of separate variables. These replace the `@screen-*` variables entirely and allow you to fully customize the grid tiers.
- Media queries have also changed. Instead of repeating our media query declarations with the same value each time, we now have `@include media-breakpoint-up/down/only`. Now, instead of writing `@media (min-width: @screen-sm-min) { ... }`, you can write `@include media-breakpoint-up(sm) { ... }`.

### Components

- Dropped panels, thumbnails, and wells for a new all-encompassing component, cards.
- Dropped the Glyphicons icon font. If you need icons, some options are:
  - the upstream version of [Glyphicons](https://glyphicons.com/)
  - [Octicons](https://octicons.github.com/)
  - [Font Awesome](http://fontawesome.io/)
- Dropped the Affix jQuery plugin. We recommend using a `position: sticky` polyfill instead. [See the HTML5 Please entry](http://html5please.com/#sticky) for details and specific polyfill recommendations.
  - If you were using Affix to apply additional, non-`position` styles, the polyfills might not support your use case. One option for such uses is the third-party [ScrollPos-Styler](https://github.com/acch/scrollpos-styler) library.
- Dropped the pager component as it was essentially slightly customized buttons.
- Refactored nearly all components to use more un-nested classes instead of children selectors.

### Misc
- Non-responsive usage of Bootstrap is no longer supported.
- Dropped the online Customizer in favor of more extensive setup documentation and customized builds.

## By component

This list highlights key changes by component between v3.x.x and v4.0.0.

### Reboot

New to Bootstrap 4 is the Reboot, a new stylesheet that builds on Normalize with our own somewhat opinionated reset styles. Selectors appearing in this file only use elements—there are no classes here. This isolates our reset styles from our component styles for a more modular approach. Some of the most important resets this includes are the `box-sizing: border-box` change, moving from `em` to `rem` units on many elements, link styles, and many form element resets.

### Typography

- Moved all `.text-` utilities to the `_utilities.scss` file.
- Dropped `.page-header` as, aside from the border, all its styles can be applied via utilities.
- `.dl-horizontal` has been dropped. Instead, use `.row` on `<dl>` and use grid column classes (or mixins) on its `<dt>` and `<dd>` children.
- Custom `<blockquote>` styling has moved to classes—`.blockquote` and the `.blockquote-reverse` modifier.
- `.list-inline` now requires that its children list items have the new `.list-inline-item` class applied to them.

### Images

- Renamed `.img-responsive` to `.img-fluid`.
- Renamed `.img-rounded` to `.rounded`
- Renamed `.img-circle` to `.rounded-circle`

### Tables

- Nearly all instances of the `>` selector have been removed, meaning nested tables will now automatically inherit styles from their parents. This greatly simplifies our selectors and potential customizations.
- Responsive tables no longer require a wrapping element. Instead, just put the `.table-responsive` right on the `<table>`.
- Renamed `.table-condensed` to `.table-sm` for consistency.
- Added a new `.table-inverse` option.
- Added table header modifiers: `.thead-default` and `.thead-inverse`.
- Renamed contextual classes to have a `.table-`-prefix. Hence `.active`, `.success`, `.warning`, `.danger` and `.table-info` to `.table-active`, `.table-success`, `.table-warning`, `.table-danger` and `.table-info`.

### Forms

- Moved element resets to the `_reboot.scss` file.
- Renamed `.control-label` to `.form-control-label`.
- Renamed `.input-lg` and `.input-sm` to `.form-control-lg` and `.form-control-sm`, respectively.
- Dropped `.form-group-*` classes for simplicity's sake. Use `.form-control-*` classes instead now.
- Dropped `.help-block` and replaced it with `.form-text` for block-level help text. For inline help text and other flexible options, use utility classes like `.text-muted`.
- Horizontal forms overhauled:
  - Dropped the `.form-horizontal` class requirement.
  - `.form-group` no longer applies styles from the `.row` via mixin, so `.row` is now required for horizontal grid layouts (e.g., `<div class="form-group row">`).
  - Added new `.form-control-label` class to vertically center labels with `.form-control`s.
- Added custom forms support (for checkboxes, radios, selects, and file inputs).

### Buttons

- Renamed `.btn-default` to `.btn-secondary`.
- Dropped the `.btn-xs` class entirely as `.btn-sm` is proportionally much smaller than v3's.
- The [stateful button](https://getbootstrap.com/javascript/#buttons-methods) feature of the `button.js` jQuery plugin has been dropped. This includes the `$().button(string)` and `$().button('reset')` methods. We advise using a tiny bit of custom JavaScript instead, which will have the benefit of behaving exactly the way you want it to.
  - Note that the other features of the plugin (button checkboxes, button radios, single-toggle buttons) have been retained in v4.

### Button group

- Rewrote component with flexbox.
- Dropped the `.btn-group-xs` class entirely given removal of `.btn-xs`.
- Removed explicit spacing between button groups in button toolbars; use margin utilities now.
- Improved documentation for use with other components.

### Dropdowns

- Switched from parent selectors to singular classes for all components, modifiers, etc.
- Simplified dropdown styles to no longer ship with upward or downward facing arrows attached to the dropdown menu.
- Dropdowns can be built with `<div>`s or `<ul>`s now.
- Rebuilt dropdown styles and markup to provide easy, built-in support for `<a>` and `<button>` based dropdown items.
- Renamed `.divider` to `.dropdown-divider`.
- Dropdown items now require `.dropdown-item`.
- Dropdown toggles no longer require an explicit `<span class="caret"></span>`; this is now provided automatically via CSS's `::after` on `.dropdown-toggle`.

### Grid system

- Added a new `576px` grid breakpoint as `sm`, meaning there are now five total tiers (`xs`, `sm`, `md`, `lg`, and `xl`).
- Renamed the responsive grid modifier classes from `.col-{breakpoint}-{modifier}-{size}` to `.{modifier}-{breakpoint}-{size}` for simpler grid classes. For example, instead of `.col-md-3.col-md-push-9` it's `.col-md-3.push-md-9`.
- Overhauled the grid mixins to merge `make-col` and `make-col-span` into a single `make-col` mixin, thereby ensuring mixins and predefined classes utilize the same float/flex behaviors.
- Added flexbox utility classes for grid system and components.

### List groups

- Rewrote component with flexbox.
- Replaced `a.list-group-item` with an explicit class, `.list-group-item-action`, for styling link and button versions of list group items.
- Added `.list-group-flush` class for use with cards.

### Modal

- Rewrote component with flexbox.
- Given move to flexbox, alignment of dismiss icons in the header is likely broken as we're no longer using floats. Floated content comes first, but with flexbox that's no longer the case. Update your dismiss icons to come after modal titles to fix.
- The `remote` option (which could be used to automatically load and inject external content into a modal) and the corresponding `loaded.bs.modal` event were removed. We recommend instead using client-side templating or a data binding framework, or calling [jQuery.load](https://api.jquery.com/load/) yourself.

### Navs

- Rewrote component with flexbox.
- Dropped nearly all `>` selectors for simpler styling via un-nested classes.
- Instead of HTML-specific selectors like `.nav > li > a`, we use separate classes for `.nav`s, `.nav-item`s, and `.nav-link`s. This makes your HTML more flexible while bringing along increased extensibility.

### Navbar

The navbar has been entirely rewritten in flexbox with improved support for alignment, responsiveness, and customization.

- Responsive navbar behaviors are now applied to the `.navbar` class via the **required** `.navbar-toggleable-{breakpoint}` where you choose where to collapse the navbar. Previously this was a Less variable modification and required recompiling.
- `.navbar-default` is now `.navbar-light`, though `.navbar-inverse` remains the same. **One of these is required on each navbar.** However, these classes no longer set `background-color`s; instead they essentiatlly only affect `color`.
- Navbars now require a background declaration of some kind. Choose from our background utilities (`.bg-*`) or set your own with the light/inverse classes above [for mad customization]({{ site.baseurl }}/components/navbar/#color-schemes).
- Given flexbox styles, navbars can now use flexbox utilities for easy alignment options.
- `.navbar-toggle` is now `.navbar-toggler` and has different styles and inner markup (no more three `<span>`s).
- Dropped the `.navbar-form` class entirely. It's no longer necessary; instead, just use `.form-inline` and apply margin utilities as necessary.
- Navbars no longer include `margin-bottom` or `border-radius` by default. Use utilities as necessary.
- All examples featuring navbars have been updated to include new markup.

### Pagination

- Rewrote component with flexbox.
- Explicit classes (`.page-item`, `.page-link`) are now required on the descendants of `.pagination`s
- Dropped the `.pager` component entirely as it was little more than customized outline buttons.

### Breadcrumbs

- An explicit class, `.breadcrumb-item`, is now required on the descendants of `.breadcrumb`s

### Labels and badges

- Renamed `.label` to `.badge` to disambiguate from the `<label>` element.
- Dropped the `.badge` component as it was nearly identical to labels. Use the `.badge-pill` modifier together with the label component instead for that rounded look.
- Badges are no longer floated automatically in list groups and other components. Utility classes are now required for that.

### Panels, thumbnails, and wells

Dropped entirely for the new card component.

#### Panels

- `.panel` to `.card`, now built with flexbox.
- `.panel-default` removed and no replacement.
- `.panel-group` removed and no replacement. `.card-group` is not a replacement, it is different.
- `.panel-heading` to `.card-header`
- `.panel-title` to `.card-title`. Depending on the desired look, you may also want to use [heading elements or classes]({{ site.baseurl }}/content/typography/#headings) (e.g. `<h3>`, `.h3`) or bold elements or classes (e.g. `<strong>`, `<b>`, [`.font-weight-bold`]({{ site.baseurl }}/utilities/typography/#font-weight-and-italics)). Note that `.card-title`, while similarly named, produces a different look than `.panel-title`.
- `.panel-body` to `.card-block`
- `.panel-footer` to `.card-footer`
- `.panel-primary` to `.card-primary` and `.card-inverse` (or use `.bg-primary` on `.card-header`)
- `.panel-success` to `.card-success` and `.card-inverse` (or use `.bg-success` on `.card-header`)
- `.panel-info` to `.card-info` and `.card-inverse` (or use `.bg-info` on `.card-header`)
- `.panel-warning` to `.card-warning` and `.card-inverse` (or use `.bg-warning` on `.card-header`)
- `.panel-danger` to `.card-danger` and `.card-inverse` (or use `.bg-danger` on `.card-header`)

### Tooltips

- Removed support for `auto` placement options.

### Popovers

- Removed support for `auto` placement options.

### Carousel

- Overhauled the entire component to simplify design and styling. We have fewer styles for you to override, new indicators, and new icons.
- All CSS has been un-nested and renamed, ensuring each class is prefixed with `.carousel-`.
  - For carousel items, `.next`, `.prev`, `.left`, and `.right` are now `.carousel-item-next`, `.carousel-item-prev`, `.carousel-item-left`, and `.carousel-item-right`.
  - `.item` is also now `.carousel-item`.
  - For prev/next controls, `.carousel-control.right` and `.carousel-control.left` are now `.carousel-control-right` and `.carousel-control-left`, meaning they no longer require a specific base class.
- Removed all responsive styling, deferring to utilities (e.g., showing captions on certain viewports) and custom styles as needed.
- Removed image overrides for images in carousel items, deferring to utilities.
- Tweaked the Carousel example to include the new markup and styles.

### Utilities

- Made display utilities responsive (e.g., `.d-none` and `d-{sm,md,lg,xl}-none`).
- Added `.float-{sm,md,lg,xl}-{left,right,none}` classes for responsive floats and removed `.pull-left` and `.pull-right` since they're redundant to `.float-left` and `.float-right`.
- Added responsive variations to our text alignment classes `.text-{sm,md,lg,xl}-{left,center,right}`.
- Added new margin auto utilities for all sides, plus vertical and horizontal shorthands.
- Added boatload of flexbox utilities.
- Dropped `.center-block` for the new `.mx-auto` class.

### Vendor prefix mixins
Bootstrap 3's [vendor prefix](http://webdesign.about.com/od/css/a/css-vendor-prefixes.htm) mixins, which were deprecated in v3.2.0, have been removed in Bootstrap 4. Since we use [Autoprefixer](https://github.com/postcss/autoprefixer), they're no longer necessary.

Removed the following mixins: `animation`, `animation-delay`, `animation-direction`, `animation-duration`, `animation-fill-mode`, `animation-iteration-count`, `animation-name`, `animation-timing-function`, `backface-visibility`, `box-sizing`, `content-columns`, `hyphens`, `opacity`, `perspective`, `perspective-origin`, `rotate`, `rotateX`, `rotateY`, `scale`, `scaleX`, `scaleY`, `skew`, `transform-origin`, `transition-delay`, `transition-duration`, `transition-property`, `transition-timing-function`, `transition-transform`, `translate`, `translate3d`, `user-select`

## Documentation

Our documentation received an upgrade across the board as well. Here's the low down:

- We're still using Jekyll, but we have custom plugins in the mix:
  - `example.rb` is a fork of the default `highlight.rb` plugin, allowing for easier example-code handling.
  - `callout.rb` is a similar fork of that, but designed for our special docs callouts.
- All docs content has been rewritten in Markdown (instead of HTML) for easier editing.
- Pages have been reorganized for simpler content and a more approachable hierarchy.
- We moved from regular CSS to SCSS to take full advantage of Bootstrap's variables, mixins, and more.

### Responsive utilities

All `@screen-` variables have been removed in v4.0.0. Use the `media-breakpoint-up()`, `media-breakpoint-down()`, or `media-breakpoint-only()` Sass mixins or the `$grid-breakpoints` Sass map instead.

The responsive utility classes have also been overhauled.

- The `.hidden` and `.show` classes have been removed because they conflicted with jQuery's `$(...).hide()` and `$(...).show()` methods. Instead, try toggling the `[hidden]` attribute, use inline styles like `style="display: none;"` and `style="display: block;"`, or toggle the `.invisible` class.
- The old classes (`.hidden-xs` `.hidden-sm` `.hidden-md` `.hidden-lg` `.visible-xs-block` `.visible-xs-inline` `.visible-xs-inline-block` `.visible-sm-block` `.visible-sm-inline` `.visible-sm-inline-block` `.visible-md-block` `.visible-md-inline` `.visible-md-inline-block` `.visible-lg-block` `.visible-lg-inline` `.visible-lg-inline-block`) are gone.
- They have been replaced by `.hidden-xs-up` `.hidden-xs-down` `.hidden-sm-up` `.hidden-sm-down` `.hidden-md-up` `.hidden-md-down` `.hidden-lg-up` `.hidden-lg-down`.
- The `.hidden-*-up` classes hide the element when the viewport is at the given breakpoint or larger (e.g. `.hidden-md-up` hides an element on medium, large, and extra-large devices).
- The `.hidden-*-down` classes hide the element when the viewport is at the given breakpoint or smaller (e.g. `.hidden-md-down` hides an element on extra-small, small, and medium devices).

Rather than using explicit `.visible-*` classes, you make an element visible by simply not hiding it at that screen size. You can combine one `.hidden-*-up` class with one `.hidden-*-down` class to show an element only on a given interval of screen sizes (e.g. `.hidden-sm-down.hidden-xl-up` shows the element only on medium and large devices).

Note that the changes to the grid breakpoints in v4 means that you'll need to go one breakpoint larger to achieve the same results (e.g. `.hidden-md` is more similar to `.hidden-lg-down` than to `.hidden-md-down`). The new responsive utility classes don't attempt to accommodate less common cases where an element's visibility can't be expressed as a single contiguous range of viewport sizes; you will instead need to use custom CSS in such cases.

## Misc notes to prioritize

- Removed the `min--moz-device-pixel-ratio` typo hack for retina media queries
- Change buttons' `[disabled]` to `:disabled` as IE9+ supports `:disabled`. However `fieldset[disabled]` is still necessary because [native disabled fieldsets are still buggy in IE11](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset#Browser_compatibility).

TODO: audit list of stuff in v3 that was marked as deprecated

## Additional notes
- Removed support for styled nested tables (for now)

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

- Dropped IE8 and iOS 6 support. v4 is now only IE9+ and iOS 7+. For sites needing either of those, use v3.
- Added official support for Android v5.0 Lollipop's Browser and WebView. Earlier versions of the Android Browser and WebView remain only unofficially supported.

### Global changes

- Switched from [Less](http://lesscss.org/) to [SCSS](http://sass-lang.com/) for our source CSS files.
- Switched from `px` to `rem` as our primary CSS unit.
- Global font-size increased from `14px` to `16px`.
- Added a new grid tier for ~`480px` and below.
- Replaced the separate optional theme with configurable options via SCSS variables (e.g., `$enable-gradients: true`).

### Components

- Dropped panels, thumbnails, and wells for a new all-encompassing component, cards.
- Dropped the Glyphicons icon font. If you need icons, some options are:
  - the upstream version of [Glyphicons](http://glyphicons.com/)
  - [Octicons](https://octicons.github.com/)
  - [Font Awesome](https://fortawesome.github.io/Font-Awesome/)
- Dropped the Affix jQuery plugin. We recommend using a `position: sticky` polyfill instead. [See the HTML5 Please entry](http://html5please.com/#sticky) for details and specific polyfill recommendations.
  - If you were using Affix to apply additional, non-`position` styles, the polyfills might not support your use case. One option for such uses is the third-party [ScrollPos-Styler](https://github.com/acch/scrollpos-styler) library.
- Refactored nearly all components to use more unnested classes instead of children selectors.

### Misc
- Non-responsive usage of Bootstrap is no longer supported.
- Dropped the online Customizer in favor of more extensive setup documentation and customized builds.

## By component

This list highlights key changes by component between v3.x.x and v4.0.0.

### Reboot

New to Bootstrap 4 is the Reboot, a new stylesheet that builds on Normalize with our own somewhat opinionated reset styles. Selectors appearing in this file only use elements—there are no classes here. This isolates our reset styles from our component styles for a more modular approach. Some of the most important resets this includes are the `box-sizing: border` change, moving from `rem` to `em` units on many elements, link styles, and many form element resets.

### Typography

- Moved all `.text-` utilities to the `_utilities.scss` file.
- Dropped the `.page-header` class entirely.
- `.dl-horizontal` now requires grid classes, increasing flexbility in column widths.
- Custom `<blockquote>` styling has moved to classes—`.blockquote` and the `.blockquote-reverse` modifier.

### Images

- Renamed `.img-responsive` to `.img-fluid`.

### Tables

- Nearly all instances of the `>` selector have been removed, meaning nested tables will now automatically inherit styles from their parents. This greatly simplifies our selectors and potential customizations.
- Responsive tables no longer require a wrapping element. Instead, just put the `.table-responsive` right on the `<table>`.
- Renamed `.table-condensed` to `.table-sm` for consistency.
- Added a new `.table-inverse` option.
- Added a new `.table-reflow` option.
- Added table header modifers: `.thead-default` and `.thead-inverse`

### Forms

- Moved element resets to the `_reboot.scss` file.
- Renamed `.control-label` to `.form-control-label`.
- Renamed `.input-lg` and `.input-sm` to `.form-control-lg` and `.form-control-sm`, respectively.
- Dropped `.form-group-*` classes for simplicity's sake. Use `.form-control-*` classes instead now.
- Horizontal forms overhauled:
  - Dropped the `.form-horizontal` class requirement.
  - `.form-group` no longer mixins the `.row` class, so it's now required for grid layouts.
  - Added new `.form-control-label` class to vertically center labels with `.form-control`s.

### Buttons

- Renamed `.btn-default` to `.btn-secondary`.
- Dropped the `.btn-xs` class entirely.
- The [stateful button](http://getbootstrap.com/javascript/#buttons-methods) feature of the `button.js` jQuery plugin has been dropped. This includes the `$().button(string)` and `$().button('reset')` methods. We advise using a tiny bit of custom JavaScript instead, which will have the benefit of behaving exactly the way you want it to.
  - Note that the other features of the plugin (button checkboxes, button radios, single-toggle buttons) have been retained in v4.

### Grid system

- Added a new `~480px` grid breakpoint, meaning there are now five total tiers.

### Button group

- Dropped the `.btn-group-xs` class entirely.

### Navs

- Dropped nearly all `>` selectors for simpler styling via un-nested classes.
- Instead of HTML-specific selectors like `.nav > li > a`, we use separate classes for `.nav`s, `.nav-item`s, and `.nav-link`s. This makes your HTML more flexible while bringing along increased extensibility.

### Navbar

- Dropped the `.navbar-form` class entirely. It's no longer necessary.

### Pager

- Renamed `.previous` and `.next` to `.pager-prev` and `.pager-next`.

### Pagination

- Explicit classes (`.page-item`, `.page-link`) are now required on the descendants of `.pagination`s

### Panels, thumbnails, and wells

Dropped entirely for the new card component.

#### Panels

- `.panel` to `.card`
- `.panel-default` removed and no replacement
- `.panel-heading` to `.card-header`
- `.panel-title` to `.card-title`
- `.panel-body` to `.card-block`
- `.panel-footer` to `.card-footer`
- `.panel-primary` to `.card-primary` and `.card-inverse`
- `.panel-success` to `.card-success` and `.card-inverse`
- `.panel-info` to `.card-info` and `.card-inverse`
- `.panel-warning` to `.card-warning` and `.card-inverse`
- `.panel-danger` to `.card-danger` and `.card-inverse`

### Carousel

- Renamed `.item` to `.carousel-item`.

### Utilities

- Added `.pull-{xs,sm,md,lg,xl}-{left,right,none}` classes for responsive floats
- Removed `.pull-left` and `.pull-right` since they're redundant to `.pull-xs-left` and `.pull-xs-right`

## Documentation

Our documentation received an upgrade across the board as well. Here's the low down:

- We're still using Jekyll, but we have custom plugins in the mix:
  - `example.rb` is a fork of the default `highlight.rb` plugin, allowing for easier example-code handling.
  - `callout.rb` is a similar fork of that, but designed for our special docs callouts.
- All docs content has been rewritten in Markdown (instead of HTML) for easier editing.
- Pages have been reorganized for simpler content and a more approachable hierarchy.
- We moved from regular CSS to SCSS to take full advantage of Bootstrap's variables, mixins, and more.

## What's new

We've added new components and changed some existing ones. Here are the new or updated styles.

| Component | Description |
| --- | --- |
| Cards | New, more flexible component to replace v3's panels, thumbnails, and wells. |
| New navbar | Replaces the previous navbar with a new, simpler component. |
| New progress bars | Replaces the old `.progress` `<div>` with a real `<progress>` element. |
| New table variants | Adds `.table-inverse`, table head options, replaces `.table-condensed` with `.table-sm`, and `.table-reflow`. |
| New utility classes | |

TODO: audit new classes that didn't exist in v3

## What's removed
The following components have been removed in v4.0.0.

| Component | Removed from 3.x.x | 4.0.0 Equivalent |
| --- | --- | --- |
| Panels |  | Cards |
| Thumbnails |  | Cards |
| Wells |  | Cards |
| Justified navs | | |

TODO: audit classes in v3 that aren't present in v4

### Responsive utilities

The following deprecated variables have been removed in v4.0.0:

* `@screen-phone`, `@screen-tablet`, `@screen-desktop`, `@screen-lg-desktop`. Use the more abstract `$screen-{xs,sm,md,lg,xl}-*` variables instead.
* `@screen-sm`, `@screen-md`, `@screen-lg`. Use the more clearly named `$screen-{xs,sm,md,lg,xl}-min` variables instead.
* `@screen-xs`, `@screen-xs-min`. The extra small breakpoint has no lower bound, so these variables were logically absurd. Reformulate your expression in terms of `$screen-xs-max` instead.

The responsive utility classes have also been overhauled.

- The old classes (`.hidden-xs` `.hidden-sm` `.hidden-md` `.hidden-lg` `.visible-xs-block` `.visible-xs-inline` `.visible-xs-inline-block` `.visible-sm-block` `.visible-sm-inline` `.visible-sm-inline-block` `.visible-md-block` `.visible-md-inline` `.visible-md-inline-block` `.visible-lg-block` `.visible-lg-inline` `.visible-lg-inline-block`) are gone.
- They have been replaced by `.hidden-xs-up` `.hidden-xs-down` `.hidden-sm-up` `.hidden-sm-down` `.hidden-md-up` `.hidden-md-down` `.hidden-lg-up` `.hidden-lg-down`.
- The `.hidden-*-up` classes hide the element when the viewport is at the given breakpoint or larger (e.g. `.hidden-md-up` hides an element on medium, large, and extra-large devices).
- The `.hidden-*-down` classes hide the element when the viewport is at the given breakpoint or smaller (e.g. `.hidden-md-down` hides an element on extra-small, small, and medium devices).

Rather than using explicit `.visible-*` classes, you make an element visible by simply not hiding it at that screen size. You can combine one `.hidden-*-up` class with one `.hidden-*-down` class to show an element only on a given interval of screen sizes (e.g. `.hidden-sm-down.hidden-xl-up` shows the element only on medium and large devices).

Note that the changes to the grid breakpoints in v4 means that you'll need to go one breakpoint larger to achieve the same results (e.g. `.hidden-md` is more similar to `.hidden-lg-down` than to `.hidden-md-down`). The new responsive utility classes don't attempt to accommodate less common cases where an element's visibility can't be expressed as a single contiguous range of viewport sizes; you will instead need to use custom CSS in such cases.

## Misc notes to prioritize

- Removed the `min--moz-device-pixel-ratio` typo hack for retina media queries
- Dropped `.hidden` and `.show` because they conflict with jQuery's `$(...).hide()` and `$(...).show()` methods.
- Change buttons' `[disabled]` to `:disabled` as IE9+ supports `:disabled`. However `fieldset[disabled]` is still necessary because [native disabled fieldsets are still buggy in IE11](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset#Browser_compatibility).

TODO: audit list of stuff in v3 that was marked as deprecated

## Additional notes
- Removed support for styled nested tables (for now)

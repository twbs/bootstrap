---
layout: page
title: Migrating to v4.x.x
---

Bootstrap 4 is a major rewrite of almost the entire project. The most notable changes are summarized immediately below, followed by more specific class and behavioral changes to relevant components.

## Summary

Here are the big ticket items you'll want to be aware of when moving from v3 to v4.

- Dropped IE8 and iOS 6 support. v4 is now only IE9+ and iOS 7+. For sites needing either of those, use v3.
- Added official support for Android v5.0 Lollipop's Browser and WebView. Earlier versions of the Android Browser and WebView remain only unofficially supported.
- Switched from `px` to `rem` as our primary CSS unit.
- Media queries are now in `em`s instead of `px`s.
- Global font-size increased from `14px` to `16px`.
- Dropped panels, thumbnails, and wells for a new all-encompassing component, cards.
- Switched from LESS to SCSS for our source CSS files.
- Added a new grid tier for ~`480px` and below.
- Dropped the Glyphicons icon font.
- Dropped the Affix jQuery plugin. We recommend using a `position: sticky` polyfill instead. [See the HTML5 Please entry](http://html5please.com/#sticky) for details and specific polyfill recommendations.
- Refactored nearly all components to use more unnested classes instead of children selectors.
- Non-responsive usage of Bootstrap is no longer supported.
- Images are now responsive (via `max-width`) by default.
- Dropped the online Customizer in favor of more extensive setup documentation.
- Replaced the separate optional theme with configurable options via SCSS variables (e.g., `@enable-gradients: true`).

## By component

This table shows the style changes between v3.x.x and v4.0.0.

### Tables

- Nearly all instances of the `>` selector have been removed, meaning nested tables will now automatically inherit styles from their parents. This greatly simplifies our selectors and potential customizations.
- Responsive tables no longer require a wrapping element. Instead, just put the `.table-responsive` right on the `<table>`.
- Changed `.table-condensed` to `.table-sm` for consistency.
- Added a new `.table-inverse` option.

### Pager

- Changed `.previous` and `.next` to `.pager-prev` and `.pager-next`.

### Carousel

- Changed `.item` to `.carousel-item`.

## Documentation

Our documentation has received an upgrade across the board as well. Here's the low down:

- We're still using Jekyll, but we've got a custom plugin in the mix (`example.rb`) for easier example-code handling.
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
| New table variants | |
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

TODO: audit classes in v4 that aren't present in v4

### Responsive utilities

The following deprecated Less/SCSS variables have been removed in v4.0.0:

* `@screen-phone`, `@screen-tablet`, `@screen-desktop`, `@screen-lg-desktop`. Use the more abstract `$screen-{xs,sm,md,lg,xl}-*` variables instead.
* `@screen-sm`, `@screen-md`, `@screen-lg`. Use the more clearly named `$screen-{xs,sm,md,lg,xl}-min` variables instead.
* `@screen-xs`, `@screen-xs-min`. The extra small breakpoint has no lower bound, so these variables were logically absurd. Reformulate your expression in terms of `$screen-xs-max` instead.
* `@grid-float-breakpoint`

The responsive utility classes have been overhauled. The old classes (`.hidden-xs` `.hidden-sm` `.hidden-md` `.hidden-lg` `.visible-xs-block` `.visible-xs-inline` `.visible-xs-inline-block` `.visible-sm-block` `.visible-sm-inline` `.visible-sm-inline-block` `.visible-md-block` `.visible-md-inline` `.visible-md-inline-block` `.visible-lg-block` `.visible-lg-inline` `.visible-lg-inline-block`) are gone. They have been replaced by `.hidden-xs-up` `.hidden-xs-down` `.hidden-sm-up` `.hidden-sm-down` `.hidden-md-up` `.hidden-md-down` `.hidden-lg-up` `.hidden-lg-down`. The `.hidden-*-up` classes hide the element when the viewport is at the given breakpoint or wider (e.g. `.hidden-md-up` hides an element on medium, large, and extra-large devices). The `.hidden-*-down` classes hide the element when the viewport is at the given breakpoint or smaller (e.g. `.hidden-md-down` hides an element on extra-small, small, and medium devices). Rather than using explicit `.visible-*` classes, you make an element visible by simply not hiding it at that screen size. You can combine one `.hidden-*-up` class with one `.hidden-*-down` class to show an element only on a given interval of screen sizes (e.g. `.hidden-sm-down.hidden-xl-up` shows the element only on medium and large devices). Note that the changes to the grid breakpoints in v4 means that you'll need to go one breakpoint larger to achieve the same results (e.g. `.hidden-md` is more similar to `.hidden-lg-down` than to `.hidden-md-down`). .The new responsive utility classes don't attempt to accommodate less common cases where an element's visibility can't be expressed as a single contiguous range of viewport sizes; you will instead need to use custom CSS in such cases.

## Misc notes to prioritize

- Removed the `min--moz-device-pixel-ratio` typo hack for retina media queries
- Dropped `.hidden` and `.show` because it interferes with jQuery's `$(...).hide()`.
- Change buttons' `[disabled]` to `:disabled` as IE9+ supports `:disabled`. However `fieldset[disabled]` is still necessary because [native disabled fieldsets are still buggy in IE11](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset#Browser_compatibility).

TODO: audit list of stuff in v3 that was marked as deprecated

## Additional notes
- Removed support for styled nested tables (for now)

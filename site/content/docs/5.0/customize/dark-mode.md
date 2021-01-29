---
layout: docs
title: Dark Mode
description: Use Bootstrap's dark mode to build OS dark mode aware sites.
group: customize
toc: true
---

Use Bootstrap's dark mode to build OS dark mode aware sites.

## Dark Mode

Bootstrap 5 includes an experimental variant that incorporates a super-set CSS that contains both default light CSS and a dark CSS version that can be activated by the browser leveraging the `preferes-color-scheme` media query.

## Variable defaults

Theme builders should continue to leverage the `scss/_variables.scss` variables for default and primary color schemes.  (In Bootstrap the default scheme is "light".)  A second variable defaults file is provided in `scss/_variables-alt.scss` and theme builder should encode their secondary scolor scheme into this file or its derivitive.  (In Bootstrap-Dark the scondary scheme is "dark".)

## Toggeling Color Schemes

In this experimental stage the toggle of light to dark (and Vis-à-vis) is driven by the browsers that support dark mode (see: [MDN prefers-color-scheme > Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme#browser_compatibility)) and will fall back to light only (default) for non-supported browsers.

Should you wish to add user based interaction, e.g. Dark Mode Toggle Button, then you'd need to create the appropriate JavaScript to drive this UX.

A custom variant of Bootstrap can also be built using the `prefers-color-scheme` mixin.  For example, adding the follwing lines to your SCSS:

```scss
$enable-color-schemes: true;
$default-color-scheme: "body.dark";
```

will create a variant that is by default the Bootstrap light color scheme, but will switch to the dark scheme if a `.dark` class is added to the `body` tag.


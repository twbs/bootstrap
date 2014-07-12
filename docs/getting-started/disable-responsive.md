---
layout: page
title: Disable responsiveness
---

Bootstrap automatically adapts your pages for various screen sizes. Here's how to disable this feature so your page works like in [this non-responsive example](../examples/non-responsive/).

- Omit the viewport `<meta>`
- Override the `width` on the `.container` for each grid tier with a single width, for example `width: 970px !important;` Be sure that this comes after the default Bootstrap CSS. You can optionally avoid the `!important` with media queries or some selector-fu.
- If using navbars, remove all navbar collapsing and expanding behavior.
- For grid layouts, use `.col-xs-*` classes in addition to, or in place of, the medium/large ones. Don't worry, the extra-small device grid scales to all resolutions.

You'll still need Respond.js for IE8 (since our media queries are still there and need to be processed). This disables the "mobile site" aspects of Bootstrap.

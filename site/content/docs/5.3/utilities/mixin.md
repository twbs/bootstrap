---
layout: docs
title: Utility mixin
description: Don't want to use utility classes directly in your HTML? Use the `util()` mixin to compose custom component styles in your source Sass files.
group: utilities
aliases: "/docs/5.1/utilities/mixin/"
toc: true
---

## How it works

Bootstrap generates hundreds of utilities to quickly and easily style elements through the addition of classes in your HTML. Now with Bootstrap v5.3.0, you can add utilities in your custom Sass with the `util()` mixin. Using the [utility API]({{< docsref "/utilities/api" >}}), we generate placeholders for every utility that can be included via Sass mixin. Use the mixin in your own Sass files to include quick styles, override defaults, or compose entire components.

```html
<!-- Utility classes -->
<div class="d-inline-flex p-4 mb-md-3">...</div>

<!-- Utility mixin -->
<div class="test">...</div>
```

## Motivation

There are two major motivations for creating the utility mixin:

1. **Bootstrap should be as approachable and useful to as many people as possible.** This is why we provide compiled ready-to-go distribution files alongside source Sass and JavaScript. Similarly, not every situation calls for only pre-built components or all utilities.

2. **Working with utilities is systems-based development.** No matter where you apply your styles, you can now think and develop with the same powerful system of responsive property-value pairings, in your HTML or in your Sass.

The `util()` mixin takes something familiar and brings it into a new context, allowing you to style with a utility-based approach no matter where you apply your styles without ever changing how you think about CSS. It makes Bootstrap even more flexible and powerful, without forcing your hand into a particular development methodology.

## Example

Consider this `.test` example. We've set the display, added padding, included a responsive margin, and a custom color.

```scss
.test {
  @include util(d-inline-flex);
  @include util(p-4);
  @include util(mb-md-3);
  color: purple;
}
```

Which outputs to the following:

```css
.test {
  display: inline-flex;
  padding: 1.5rem;
  color: purple;
}

@media (min-width: 768px) {
  .test {
    margin-bottom: 1rem;
  }
}
```

## Working responsively

While you can include responsive utilities individually, Sass will generate multiple media queries each time you include a responsive utility with the `util()` mixin. When you have multiple responsive values, use media queries to group them.

```scss
// Avoid this
.test {
  @include util(p-3);
  @include util(p-md-5);
  @include util(mb-3);
  @include util(mb-md-5);
}

// Do this
.test {
  @include util(p-3);
  @include util(mb-3);

  @include media-breakpoint-up(md) {
    @include util(p-5);
    @include util(mb-5);
  }
}
```

This way, you only output one media query in your compiled CSS and no further optimization or action is needed to clean up the output.


## Custom setup

Want to use only the utilities and mixin in your own project? In your project's Sass file, include the following:

```scss
// Required Bootstrap imports
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

// Import the utilities maps and mixins
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/utilities/api";

// Write your own styles
.test {
  @include util(d-inline-flex);
  @include util(p-4);
  @include util(mb-md-3);
  color: purple;
}
```

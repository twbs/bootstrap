---
layout: docs
title: Components
description: Learn how and why we build nearly all our components responsively and with base and modifier classes.
group: customize
toc: true
---

Many of Bootstrap's components and utilities are built with `@each` loops that iterate over a Sass map. This is especially helpful for generating variants of a component by our `$theme-colors` and creating responsive variants for each breakpoint. As you customize these Sass maps and recompile, you'll automatically see your changes reflected in these loops.

## Modifiers

Many of Bootstrap's components are built with a base-modifier class approach. This means the bulk of the styling is contained to a base class (e.g., `.btn`) while style variations are confined to modifier classes (e.g., `.btn-danger`). These modifier classes are built from the `$theme-colors` map to make customizing the number and name of our modifier classes.

Here are two examples of how we loop over the `$theme-colors` map to generate modifiers to the `.alert` component and all our `.bg-*` background utilities.

{{< highlight scss >}}
// Generate alert modifier classes
@each $color, $value in $theme-colors {
  .alert-#{$color} {
    @include alert-variant(color-level($color, -10), color-level($color, -9), color-level($color, 6));
  }
}

// Generate `.bg-*` color utilities
@each $color, $value in $theme-colors {
  @include bg-variant('.bg-#{$color}', $value);
}
{{< /highlight >}}

## Responsive

These Sass loops aren't limited to color maps, either. You can also generate responsive variations of your components or utilities. Take for example our responsive text alignment utilities where we mix an `@each` loop for the `$grid-breakpoints` Sass map with a media query include.

{{< highlight scss >}}
@each $breakpoint in map-keys($grid-breakpoints) {
  @include media-breakpoint-up($breakpoint) {
    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);

    .text#{$infix}-left   { text-align: left !important; }
    .text#{$infix}-right  { text-align: right !important; }
    .text#{$infix}-center { text-align: center !important; }
  }
}
{{< /highlight >}}

Should you need to modify your `$grid-breakpoints`, your changes will apply to all the loops iterating over that map.

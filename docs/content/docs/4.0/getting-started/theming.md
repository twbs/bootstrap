---
layout: docs
title: Theming Bootstrap
description: Customize Bootstrap 4 with our new built-in Sass variables for global style preferences for easy theming and component changes.
group: getting-started
toc: true
aliases: "/docs/4.0/getting-started/options/"
---

## Introduction

In Bootstrap 3, theming was largely driven by variable overrides in LESS, custom CSS, and a separate theme stylesheet that we included in our `dist` files. With some effort, one could completely redesign the look of Bootstrap 3 without touching the core files. Bootstrap 4 provides a familiar, but slightly different approach.

Now, theming is accomplished by Sass variables, Sass maps, and custom CSS. There's no more dedicated theme stylesheet; instead, you can enable the built-in theme to add gradients, shadows, and more.

## Sass

Utilize our source Sass files to take advantage of variables, maps, mixins, and more.

### File structure

Whenever possible, avoid modifying Bootstrap's core files. For Sass, that means creating your own stylesheet that imports Bootstrap so you can modify and extend it. Assuming you've downloaded our source files or are using a package manager, you'll have a file structure that looks like this:

{{< highlight text >}}
your-project/
├── scss
│   └── custom.scss
└── node_modules/
    └── bootstrap
        ├── js
        └── scss
{{< /highlight >}}

In your `custom.scss`, you'll import Bootstrap's source Sass files. You have two options: include all of Bootstrap, or pick the parts you need. We encourage the latter, though be aware there are some requirements and dependencies across our components. You also will need to include some JavaScript for our plugins.

{{< highlight sass >}}
// Custom.scss
// Option A: Include all of Bootstrap

@import "node_modules/bootstrap/scss/bootstrap";
{{< /highlight >}}

{{< highlight sass >}}
// Custom.scss
// Option B: Include parts of Bootstrap

// Required
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/variables";
@import "node_modules/bootstrap/scss/mixins";

// Optional
@import "node_modules/bootstrap/scss/reboot";
@import "node_modules/bootstrap/scss/type";
@import "node_modules/bootstrap/scss/images";
@import "node_modules/bootstrap/scss/code";
@import "node_modules/bootstrap/scss/grid";
{{< /highlight >}}

With that setup in place, you can begin to modify any of the Sass variables and maps in your `custom.scss`. You can also start to add parts of Bootstrap under the `// Optional` section as needed.

### Variable defaults

Every Sass variable in Bootstrap 4 includes the `!default` flag allowing you to override the variable's default value in your own Sass without modifying Bootstrap's source code. Copy and paste variables as needed, modify their values, and remove the `!default` flag. If a variable has already been assigned, then it won't be re-assigned by the default values in Bootstrap.

Variable overrides within the same Sass file can come before or after the default variables. However, when overriding across Sass files, your overrides must come before you import Bootstrap's Sass files.

Here's an example that changes the `background-color` and `color` for the `<body>` when importing and compiling Bootstrap via npm:

{{< highlight sass >}}
// Your variable overrides
$body-bg: #000;
$body-color: #111;

// Bootstrap and its default variables
@import "node_modules/bootstrap/scss/bootstrap";
{{< /highlight >}}

Repeat as necessary for any variable in Bootstrap, including the global options below.

### Maps and loops

Bootstrap 4 includes a handful of Sass maps, key value pairs that make it easier to generate families of related CSS. We use Sass maps for our colors, grid breakpoints, and more. Just like Sass variables, all Sass maps include the `!default` flag and can be overridden and extended.

For example, to modify an existing color in our `$theme-colors` map, add the following to your custom Sass file:

{{< highlight sass >}}
$theme-colors: (
  "primary": #0074d9,
  "danger": #ff4136
);
{{< /highlight >}}

To add a new color to `$theme-colors`, add the new key and value:

{{< highlight sass >}}
$theme-colors: (
  "custom-color": #900
);
{{< /highlight >}}

### Functions

Bootstrap utilizes several Sass functions, but only a subset are applicable to general theming. We've included three functions for getting values from the color maps:

{{< highlight sass >}}
@function color($key: "blue") {
  @return map-get($colors, $key);
}

@function theme-color($key: "primary") {
  @return map-get($theme-colors, $key);
}

@function gray($key: "100") {
  @return map-get($grays, $key);
}
{{< /highlight >}}

These allow you to pick one color from a Sass map much like how you'd use a color variable from v3.

{{< highlight sass >}}
.custom-element {
  color: gray("100");
  background-color: theme-color("dark");
}
{{< /highlight >}}

We also have another function for getting a particular _level_ of color from the `$theme-colors` map. Negative level values will lighten the color, while higher levels will darken.

{{< highlight sass >}}
@function theme-color-level($color-name: "primary", $level: 0) {
  $color: theme-color($color-name);
  $color-base: if($level > 0, #000, #fff);
  $level: abs($level);

  @return mix($color-base, $color, $level * $theme-color-interval);
}
{{< /highlight >}}

In practice, you'd call the function and pass in two parameters: the name of the color from `$theme-colors` (e.g., primary or danger) and a numeric level.

{{< highlight sass >}}
.custom-element {
  color: theme-color-level(primary, -10);
}
{{< /highlight >}}

Additional functions could be added in the future or your own custom Sass to create level functions for additional Sass maps, or even a generic one if you wanted to be more verbose.

### Color contrast

One additional function we include in Bootstrap is the color contrast function, `color-yiq`. It utilizes the [YIQ color space](https://en.wikipedia.org/wiki/YIQ) to automatically return a light (`#fff`) or dark (`#111`) contrast color based on the specified base color. This function is especially useful for mixins or loops where you're generating multiple classes.

For example, to generate color swatches from our `$theme-colors` map:

{{< highlight sass >}}
@each $color, $value in $theme-colors {
  .swatch-#{$color} {
    color: color-yiq($value);
  }
}
{{< /highlight >}}

It can also be used for one-off contrast needs:

{{< highlight sass >}}
.custom-element {
  color: color-yiq(#000); // returns `color: #fff`
}
{{< /highlight >}}

You can also specify a base color with our color map functions:

{{< highlight sass >}}
.custom-element {
  color: color-yiq(theme-color("dark")); // returns `color: #fff`
}
{{< /highlight >}}

## Sass options

Customize Bootstrap 4 with our built-in custom variables file and easily toggle global CSS preferences with new `$enable-*` Sass variables. Override a variable's value and recompile with `npm run test` as needed.

You can find and customize these variables for key global options in our `_variables.scss` file.

| Variable                    | Values                             | Description                                                                            |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `$spacer`                   | `1rem` (default), or any value > 0 | Specifies the default spacer value to programmatically generate our [spacer utilities]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/utilities/spacing/). |
| `$enable-rounded`           | `true` (default) or `false`        | Enables predefined `border-radius` styles on various components.                       |
| `$enable-shadows`           | `true` or `false` (default)        | Enables predefined `box-shadow` styles on various components.                          |
| `$enable-gradients`         | `true` or `false` (default)        | Enables predefined gradients via `background-image` styles on various components.      |
| `$enable-transitions`       | `true` (default) or `false`        | Enables predefined `transition`s on various components.                                |
| `$enable-hover-media-query` | `true` or `false` (default)        | ...                                                                                    |
| `$enable-grid-classes`      | `true` (default) or `false`        | Enables the generation of CSS classes for the grid system (e.g., `.container`, `.row`, `.col-md-1`, etc.).     |
| `$enable-caret`             | `true` (default) or `false`        | Enables pseudo element caret on `.dropdown-toggle`.                                    |
| `$enable-print-styles`      | `true` (default) or `false`        | Enables styles for optimizing printing.                                |

## Color

Many of Bootstrap's various components and utilities are built through a series of colors defined in a Sass map. This map can be looped over in Sass to quickly generate a series of rulesets.

### All colors

All colors available in Bootstrap 4, are available as Sass variables and a Sass map in our `scss/_variables.scss` file. This will be expanded upon in subsequent minor releases to add additional shades, much like the [grayscale palette](#grays) we already include.

<div class="row">
  {% for color in .Site.Data.colors %}
    {% unless color.name == "white" or color.name == "gray" or color.name == "gray-dark" %}
    <div class="col-md-4">
        <div class="p-3 mb-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    </div>
    {% endunless %}
  {% endfor %}
</div>

Here's how you can use these in your Sass:

{{< highlight sass >}}
// With variable
.alpha { color: $purple; }

// From the Sass map with our `color()` function
.beta { color: color("purple"); }
{{< /highlight >}}

[Color utility classes]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/utilities/colors/) are also available for setting `color` and `background-color`.

{{< callout info >}}
In the future, we'll aim to provide Sass maps and variables for shades of each color as we've done with the grayscale colors below.
{{< /callout >}}

### Theme colors

We use a subset of all colors to create a smaller color palette for generating color schemes, also available as Sass variables and a Sass map in our `scss/_variables.scss` file.

<div class="row">
  {% for color in .Site.Data.theme-colors %}
    <div class="col-md-4">
      <div class="p-3 mb-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    </div>
  {% endfor %}
</div>

### Grays

An expansive set of gray variables and a Sass map in `scss/_variables.scss` for consistent shades of gray across your project.

<div class="row mb-3">
  <div class="col-md-4">
    {% for color in .Site.Data.grays %}
      <div class="p-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    {% endfor %}
  </div>
</div>

Within `_variables.scss`, you'll find our color variables and Sass map. Here's an example of the `$colors` Sass map:

{{< highlight sass >}}
$colors: (
  "blue": $blue,
  "indigo": $indigo,
  "purple": $purple,
  "pink": $pink,
  "red": $red,
  "orange": $orange,
  "yellow": $yellow,
  "green": $green,
  "teal": $teal,
  "cyan": $cyan,
  "white": $white,
  "gray": $gray-600,
  "gray-dark": $gray-800
) !default;
{{< /highlight >}}

Add, remove, or modify values within the map to update how they're used in many other components. Unfortunately at this time, not _every_ component utilizes this Sass map. Future updates will strive to improve upon this. Until then, plan on making use of the `${color}` variables and this Sass map.

## Components

Many of Bootstrap's components and utilities are built with `@each` loops that iterate over a Sass map. This is especially helpful for generating variants of a component by our `$theme-colors` and creating responsive variants for each breakpoint. As you customize these Sass maps and recompile, you'll automatically see your changes reflected in these loops.

### Modifiers

Many of Bootstrap's components are built with a base-modifier class approach. This means the bulk of the styling is contained to a base class (e.g., `.btn`) while style variations are confined to modifier classes (e.g., `.btn-danger`). These modifier classes are built from the `$theme-colors` map to make customizing the number and name of our modifier classes.

Here are two examples of how we loop over the `$theme-colors` map to generate modifiers to the `.alert` component and all our `.bg-*` background utilities.

{{< highlight sass >}}
// Generate alert modifier classes
@each $color, $value in $theme-colors {
  .alert-#{$color} {
    @include alert-variant(theme-color-level($color, -10), theme-color-level($color, -9), theme-color-level($color, 6));
  }
}

// Generate `.bg-*` color utilities
@each $color, $value in $theme-colors {
  @include bg-variant('.bg-#{$color}', $value);
}
{{< /highlight >}}

### Responsive

These Sass loops aren't limited to color maps, either. You can also generate responsive variations of your components or utilities. Take for example our responsive text alignment utilities where we mix an `@each` loop for the `$grid-breakpoints` Sass map with a media query include.

{{< highlight sass >}}
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

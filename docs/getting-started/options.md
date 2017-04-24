---
layout: docs
title: Customization options
description: Customize Bootstrap with Sass variables, easily toggling global preferences with a quick recompile.
group: getting-started
---

Customize Bootstrap 4 with our built-in custom variables file and easily toggle global CSS preferences with new `$enable-*` Sass variables. Override a variable's value and recompile with `npm run test` as needed.

## Customizing variables

Bootstrap 4 ships with a `_custom.scss` file for easy overriding of default variables in `/scss/_variables.scss`. Copy and paste relevant lines from there into the `_custom.scss` file, modify the values, and recompile your Sass to change our default values. **Be sure to remove the `!default` flag from override values.**

For example, to change out the `background-color` and `color` for the `<body>`, you'd do the following:

{% highlight scss %}
// Bootstrap overrides
//
// Copy variables from `_variables.scss` to this file to override default values
// without modifying source files.

$body-bg:    $gray-dark;
$body-color: $gray-light;
{% endhighlight %}

Do the same for any variable you need to override, including the global options listed below.

## Global options

You can find and customize these variables for key global options in our `_variables.scss` file.

| Variable                    | Values                             | Description                                                                            |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `$spacer`                   | `1rem` (default), or any value > 0 | Specifies the default spacer value to programmatically generate our [spacer utilities](/utilities/spacing/). |
| `$enable-rounded`           | `true` (default) or `false`        | Enables predefined `border-radius` styles on various components.                       |
| `$enable-shadows`           | `true` or `false` (default)        | Enables predefined `box-shadow` styles on various components.                          |
| `$enable-gradients`         | `true` or `false` (default)        | Enables predefined gradients via `background-image` styles on various components.      |
| `$enable-transitions`       | `true` (default) or `false`        | Enables predefined `transition`s on various components.                                |
| `$enable-hover-media-query` | `true` or `false` (default)        | ...                                                                                    |
| `$enable-grid-classes`      | `true` (default) or `false`        | Enables the generation of CSS classes for the grid system (e.g., `.container`, `.row`, `.col-md-1`, etc.).     |
| `$enable-print-styles`      | `true` (default) or `false`        | Enables styles for optimizing printing.                                |

## Colors

Many of Bootstrap's various components and utilities are built through a series of colors defined in a Sass map. This map can be looped over in Sass to quickly generate a series of rulesets.

<div class="row">
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-red-light">Light</div>
    <div class="p-3 bg-red">Red</div>
    <div class="p-3 bg-red-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-orange-light">Light</div>
    <div class="p-3 bg-orange">Orange</div>
    <div class="p-3 bg-orange-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-yellow-light">Light</div>
    <div class="p-3 bg-yellow">Yellow</div>
    <div class="p-3 bg-yellow-dark">Dark</div>
  </div>

  <div class="col-md-4 mb-3">
    <div class="p-3 bg-green-light">Light</div>
    <div class="p-3 bg-green">Green</div>
    <div class="p-3 bg-green-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-teal-light">Light</div>
    <div class="p-3 bg-teal">Teal</div>
    <div class="p-3 bg-teal-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-blue-light">Light</div>
    <div class="p-3 bg-blue">Blue</div>
    <div class="p-3 bg-blue-dark">Dark</div>
  </div>

  <div class="col-md-4 mb-3">
    <div class="p-3 bg-pink-light">Light</div>
    <div class="p-3 bg-pink">Pink</div>
    <div class="p-3 bg-pink-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-purple-light">Light</div>
    <div class="p-3 bg-purple">Purple</div>
    <div class="p-3 bg-purple-dark">Dark</div>
  </div>
  <div class="col-md-4 mb-3">
    <div class="p-3 bg-gray-light">Light</div>
    <div class="p-3 bg-gray">Gray</div>
    <div class="p-3 bg-gray-dark">Dark</div>
  </div>

</div>

---
layout: docs
title: Customization options
group: getting-started
---

With Bootstrap 4, we've added a handful of global options for easily customizing all the components in your project. These options are handled by Sass variables. Simply change a variable's value and recompile with the included Gruntfile.

## Available variables

You can find and customize these variables in our `_variables.scss` file.

| Variable                    | Values                             | Description                                                             |
| --------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `$spacer`                   | `1rem` (default), or any value > 0 | Specifies the default spacer value for our spacer utilities.            |
| `$enable-flex`              | `true` or `false` (default)        | Swaps `float` and `display: table` styles for `display: flex`.          |
| `$enable-rounded`           | `true` (default) or `false`        | Enables predefined `border-radius` styles on various components.        |
| `$enable-shadows`           | `true` or `false` (default)        | Enables predefined `box-shadow` styles on various components.           |
| `$enable-gradients`         | `true` or `false` (default)        | Enables predefined gradients via `background-image` various components. |
| `$enable-transitions`       | `true` (default) or `false`        | Enables predefined `transition`s on various components.                 |
| `$enable-hover-media-query` | `true` or `false` (default)        | ...                                                                     |

## Color palette

Bootstrap's color palette includes a numerical range of shades for each base color, heavily inspired by [Google's color palette](https://www.google.com/design/spec/style/color.html#color-color-palette). Base colors, which utilize Sass color functions to generate each additional shade, are indicated at the top of each stacked palette.

<div class="row">
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base gray-500">500</div>
    <div class="color-slab gray-100">100</div>
    <div class="color-slab gray-200">200</div>
    <div class="color-slab gray-300">300</div>
    <div class="color-slab gray-400">400</div>
    <div class="color-slab gray-500">500</div>
    <div class="color-slab gray-600">600</div>
    <div class="color-slab gray-700">700</div>
    <div class="color-slab gray-800">800</div>
    <div class="color-slab gray-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base blue-500">500</div>
    <div class="color-slab blue-100">100</div>
    <div class="color-slab blue-200">200</div>
    <div class="color-slab blue-300">300</div>
    <div class="color-slab blue-400">400</div>
    <div class="color-slab blue-500">500</div>
    <div class="color-slab blue-600">600</div>
    <div class="color-slab blue-700">700</div>
    <div class="color-slab blue-800">800</div>
    <div class="color-slab blue-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base green-500">500</div>
    <div class="color-slab green-100">100</div>
    <div class="color-slab green-200">200</div>
    <div class="color-slab green-300">300</div>
    <div class="color-slab green-400">400</div>
    <div class="color-slab green-500">500</div>
    <div class="color-slab green-600">600</div>
    <div class="color-slab green-700">700</div>
    <div class="color-slab green-800">800</div>
    <div class="color-slab green-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base teal-500">500</div>
    <div class="color-slab teal-100">100</div>
    <div class="color-slab teal-200">200</div>
    <div class="color-slab teal-300">300</div>
    <div class="color-slab teal-400">400</div>
    <div class="color-slab teal-500">500</div>
    <div class="color-slab teal-600">600</div>
    <div class="color-slab teal-700">700</div>
    <div class="color-slab teal-800">800</div>
    <div class="color-slab teal-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base orange-500">500</div>
    <div class="color-slab orange-100">100</div>
    <div class="color-slab orange-200">200</div>
    <div class="color-slab orange-300">300</div>
    <div class="color-slab orange-400">400</div>
    <div class="color-slab orange-500">500</div>
    <div class="color-slab orange-600">600</div>
    <div class="color-slab orange-700">700</div>
    <div class="color-slab orange-800">800</div>
    <div class="color-slab orange-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base red-500">500</div>
    <div class="color-slab red-100">100</div>
    <div class="color-slab red-200">200</div>
    <div class="color-slab red-300">300</div>
    <div class="color-slab red-400">400</div>
    <div class="color-slab red-500">500</div>
    <div class="color-slab red-600">600</div>
    <div class="color-slab red-700">700</div>
    <div class="color-slab red-800">800</div>
    <div class="color-slab red-900">900</div>
  </div>
</div>

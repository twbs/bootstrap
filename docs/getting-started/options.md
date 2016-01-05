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
    <div class="color-slab color-slab-base foreground-500">500</div>
    <div class="color-slab foreground-100">100</div>
    <div class="color-slab foreground-200">200</div>
    <div class="color-slab foreground-300">300</div>
    <div class="color-slab foreground-400">400</div>
    <div class="color-slab foreground-500">500</div>
    <div class="color-slab foreground-600">600</div>
    <div class="color-slab foreground-700">700</div>
    <div class="color-slab foreground-800">800</div>
    <div class="color-slab foreground-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base primary-500">
      500
    </div>
    <div class="color-slab primary-100">100</div>
    <div class="color-slab primary-200">200</div>
    <div class="color-slab primary-300">300</div>
    <div class="color-slab primary-400">400</div>
    <div class="color-slab primary-500">500</div>
    <div class="color-slab primary-600">600</div>
    <div class="color-slab primary-700">700</div>
    <div class="color-slab primary-800">800</div>
    <div class="color-slab primary-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base success-500">500</div>
    <div class="color-slab success-100">100</div>
    <div class="color-slab success-200">200</div>
    <div class="color-slab success-300">300</div>
    <div class="color-slab success-400">400</div>
    <div class="color-slab success-500">500</div>
    <div class="color-slab success-600">600</div>
    <div class="color-slab success-700">700</div>
    <div class="color-slab success-800">800</div>
    <div class="color-slab success-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base info-500">500</div>
    <div class="color-slab info-100">100</div>
    <div class="color-slab info-200">200</div>
    <div class="color-slab info-300">300</div>
    <div class="color-slab info-400">400</div>
    <div class="color-slab info-500">500</div>
    <div class="color-slab info-600">600</div>
    <div class="color-slab info-700">700</div>
    <div class="color-slab info-800">800</div>
    <div class="color-slab info-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base warning-500">500</div>
    <div class="color-slab warning-100">100</div>
    <div class="color-slab warning-200">200</div>
    <div class="color-slab warning-300">300</div>
    <div class="color-slab warning-400">400</div>
    <div class="color-slab warning-500">500</div>
    <div class="color-slab warning-600">600</div>
    <div class="color-slab warning-700">700</div>
    <div class="color-slab warning-800">800</div>
    <div class="color-slab warning-900">900</div>
  </div>
  <div class="col-sm-6 col-md-4 color-palette">
    <div class="color-slab color-slab-base danger-500">500</div>
    <div class="color-slab danger-100">100</div>
    <div class="color-slab danger-200">200</div>
    <div class="color-slab danger-300">300</div>
    <div class="color-slab danger-400">400</div>
    <div class="color-slab danger-500">500</div>
    <div class="color-slab danger-600">600</div>
    <div class="color-slab danger-700">700</div>
    <div class="color-slab danger-800">800</div>
    <div class="color-slab danger-900">900</div>
  </div>
</div>

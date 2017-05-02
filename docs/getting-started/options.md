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
  {% for color in site.data.colors %}
    <div class="col-md-4 mb-3">
      {% unless color.name == "white" or color.name == "gray" or color.name == "gray-dark" %}
        <div class="p-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
      {% endunless %}
    </div>
  {% endfor %}
</div>

<div class="row">
  {% for color in site.data.grays %}
    <div class="col-md-4 mb-3">
      <div class="p-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    </div>
  {% endfor %}
</div>

Within `_variables.scss`, you'll find our color variables and Sass map. Here's an example of the `$colors` Sass map:

{% highlight scss %}
$colors: (
  red: $red,
  orange: $orange,
  yellow: $yellow,
  green: $green,
  teal: $teal,
  blue: $blue,
  pink: $pink,
  purple: $purple,
  white: $white,
  gray: $gray-light,
  gray-dark: $gray-dark
) !default;
{% endhighlight %}

Add, remove, or modify values within the map to update how they're used in many other components. Unfortunately at this time, not _every_ component utilizes this Sass map. Future updates will strive to improve upon this. Until then, plan on making use of the `${color}` variables and this Sass map.

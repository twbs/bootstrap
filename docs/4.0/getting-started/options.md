---
layout: docs
title: Customization options
description: Customize Bootstrap 4 with our new built-in Sass variables for global style preferences for easy theming and component changes.
group: getting-started
toc: true
---

## Customizing variables

Every Sass variable in Bootstrap 4 includes the `!default` flag, meaning you can override that default value in your own Sass even after that original variable's been defined. Copy and paste variables as needed, modify the values, remove the `!default` flag, and recompile.

For example, to change out the `background-color` and `color` for the `<body>`, you'd do the following:

{% highlight scss %}
$body-bg:    $gray-900;
$body-color: $gray-600;
{% endhighlight %}

Do the same for any variable you need to override, including the global options listed below.

## Global options

Customize Bootstrap 4 with our built-in custom variables file and easily toggle global CSS preferences with new `$enable-*` Sass variables. Override a variable's value and recompile with `npm run test` as needed.

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

## Color

Many of Bootstrap's various components and utilities are built through a series of colors defined in a Sass map. This map can be looped over in Sass to quickly generate a series of rulesets.

### All colors

All colors available in Bootstrap 4, available as Sass variables and a Sass map in our `scss/_variables.scss` file. This will be expanded upon in subsequent minor releases to add additional shades, much like the [grayscale palette](#grays) we already include.

<div class="row">
  {% for color in site.data.colors %}
    <div class="col-md-4">
      {% unless color.name == "white" or color.name == "gray" or color.name == "gray-dark" %}
        <div class="p-3 mb-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
      {% endunless %}
    </div>
  {% endfor %}
</div>

Here's how you can use these in your Sass:

{% highlight scss %}
// With variable
.alpha { color: $purple; }

// From the Sass map with our `color()` function
.beta { color: color("purple"); }
{% endhighlight %}

[Color utility classes]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/colors/) are also available for setting `color` and `background-color`.

{% callout info %}
In the future, we'll aim to provide Sass maps and variables for shades of each color as we've done with the grayscale colors below.
{% endcallout %}

### Theme colors

We use a subset of all colors to create a smaller color palette for generating color schemes, also available as Sass variables and a Sass map in our `scss/_variables.scss` file.

<div class="row">
  {% for color in site.data.theme-colors %}
    <div class="col-md-4">
      <div class="p-3 mb-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    </div>
  {% endfor %}
</div>

### Grays

An expansive set of gray variables and a Sass map in `scss/_variables.scss` for consistent shades of gray across your project.

<div class="row mb-3">
  <div class="col-md-4">
    {% for color in site.data.grays %}
      <div class="p-3 swatch-{{ color.name }}">{{ color.name | capitalize }}</div>
    {% endfor %}
  </div>
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
  gray: $gray-600,
  gray-dark: $gray-900
) !default;
{% endhighlight %}

Add, remove, or modify values within the map to update how they're used in many other components. Unfortunately at this time, not _every_ component utilizes this Sass map. Future updates will strive to improve upon this. Until then, plan on making use of the `${color}` variables and this Sass map.

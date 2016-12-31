---
layout: docs
title: Customization options
description: Customize Bootstrap with Sass variables, easily toggling global preferences with a quick recompile.
group: getting-started
---

Customize Bootstrap 4 with our built-in custom variables file and easily toggle global CSS preferences with new `$enable-*` Sass variables. Override a variable's value and recompile with the included Gruntfile as needed.

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
| `$spacer`                   | `1rem` (default), or any value > 0 | Specifies the default spacer value for our spacer utilities.                           |
| `$enable-rounded`           | `true` (default) or `false`        | Enables predefined `border-radius` styles on various components.                       |
| `$enable-shadows`           | `true` or `false` (default)        | Enables predefined `box-shadow` styles on various components.                          |
| `$enable-gradients`         | `true` or `false` (default)        | Enables predefined gradients via `background-image` styles on various components.      |
| `$enable-transitions`       | `true` (default) or `false`        | Enables predefined `transition`s on various components.                                |
| `$enable-hover-media-query` | `true` or `false` (default)        | ...                                                                                    |
| `$enable-grid-classes`      | `true` (default) or `false`        | Enables the generation of CSS classes for the grid system (e.g., `.container`, `.row`, `.col-md-1`, etc.).     |
| `$enable-print-styles`      | `true` (default) or `false`        | Enables styles for optimizing printing.                                |

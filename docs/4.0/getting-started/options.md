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
$body-bg:    $gray-dark;
$body-color: $gray-light;
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

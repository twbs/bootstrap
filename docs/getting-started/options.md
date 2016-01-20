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

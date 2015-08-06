---
layout: page
title: Customize CSS
group: getting-started
---

New to Bootstrap 4, variable-based customization is a way for folks to quickly enable or disable global styles across all of Bootstrap's CSS. Simply update a variable's value and recompile using our Gruntfile.

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

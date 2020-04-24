---
layout: docs
title: Options
description: Quickly customize Bootstrap with built-in variables to easily toggle global CSS preferences for controlling style and behavior.
group: customize
---

Customize Bootstrap with our built-in custom variables file and easily toggle global CSS preferences with new `$enable-*` Sass variables. Override a variable's value and recompile with `npm run test` as needed.

You can find and customize these variables for key global options in Bootstrap's `scss/_variables.scss` file.

{{< bs-table "table text-left" >}}
| Variable                       | Values                             | Description                                                                            |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `$spacer`                      | `1rem` (default), or any value > 0 | Specifies the default spacer value to programmatically generate our [spacer utilities]({{< docsref "/utilities/spacing" >}}). |
| `$enable-rounded`              | `true` (default) or `false`        | Enables predefined `border-radius` styles on various components. |
| `$enable-shadows`              | `true` or `false` (default)        | Enables predefined `box-shadow` styles on various components. |
| `$enable-gradients`            | `true` or `false` (default)        | Enables predefined gradients via `background-image` styles on various components. |
| `$enable-transitions`          | `true` (default) or `false`        | Enables predefined `transition`s on various components. |
| `$enable-reduced-motion`       | `true` (default) or `false`        | Enables the [`prefers-reduced-motion` media query]({{< docsref "/getting-started/accessibility#reduced-motion" >}}), which suppresses certain animations/transitions based on the users' browser/operating system preferences. |
| `$enable-grid-classes`         | `true` (default) or `false`        | Enables the generation of CSS classes for the grid system (e.g. `.row`, `.col-md-1`, etc.). |
| `$enable-caret`                | `true` (default) or `false`        | Enables pseudo element caret on `.dropdown-toggle`. |
| `$enable-button-pointers`      | `true` (default) or `false`        | Add "hand" cursor to non-disabled button elements. |
| `$enable-rfs`                  | `true` (default) or `false`        | Globally enables [RFS]({{< docsref "/getting-started/rfs" >}}). |
| `$enable-validation-icons`     | `true` (default) or `false`        | Enables `background-image` icons within textual inputs and some custom forms for validation states. |
| `$enable-negative-margins`     | `true` or `false` (default)        | Enables the generation of [negative margin utilities]({{< docsref "/utilities/spacing#negative-margin" >}}). |
| `$enable-deprecation-messages` | `true` or `false` (default)        | Set to `true` to show warnings when using any of the deprecated mixins and functions that are planned to be removed in `v5`. |
| `$enable-important-utilities`  | `true` (default) or `false`        | Enables the `!important` suffix in utility classes. |
{{< /bs-table >}}

---
layout: docs
title: Focus ring
description: Utility classes that allows you to add and modify custom focus ring styles to elements and components.
group: helpers
toc: true
---

The `.focus-ring` helper removes the default `outline` on `:focus`, replacing it with a `box-shadow` that can be more broadly customized. The new shadow is made up of a series of CSS variables, inherited from the `:root` level, that can be modified for any element or component.

## Example

Click into the example below and press <kbd>Tab</kbd> to see the focus ring in action.

{{< example >}}
<a href="#" class="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2">
  Custom focus ring
</a>
{{< /example >}}

## Customize

Modify the styling of a focus ring with our CSS variables, Sass variables, utilities, or custom styles.

### CSS variables

Modify the `--bs-focus-ring-*` CSS variables as needed to change the default appearance.

{{< example >}}
<a href="#" class="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" style="--bs-focus-ring-color: rgba(var(--bs-success-rgb), .25)">
  Green focus ring
</a>
{{< /example >}}

### Sass

Customize the Sass variables to modify all usage of the focus ring styles across your Bootstrap-powered project.

{{< scss-docs name="focus-ring-variables" file="scss/_variables.scss" >}}

### Utilities

In addition to `.focus-ring`, we have several `.focus-ring-*` utilities to modify the helper class defaults. Modify the color with any of our theme colors.

{{< example >}}
<a href="#" class="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-2">
  Danger focus ring
</a>
{{< /example >}}

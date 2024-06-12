---
layout: docs
title: Close button
description: A generic close button for dismissing content like modals and alerts.
group: components
toc: true
---

## Example

Provide an option to dismiss or close a component with `.btn-close`. Default styling is limited, but highly customizable. Modify the Sass variables to replace the default `background-image`. **Be sure to include text for screen readers**, as we've done with `aria-label`.

{{< example >}}
<button type="button" class="btn-close" aria-label="Close"></button>
{{< /example >}}

## Disabled state

Disabled close buttons change their `opacity`. We've also applied `pointer-events: none` and `user-select: none` to preventing hover and active states from triggering.

{{< example >}}
<button type="button" class="btn-close" disabled aria-label="Close"></button>
{{< /example >}}

## Dark variant

{{< deprecated-in "5.3.0" >}}

{{< callout warning >}}
**Heads up!** As of v5.3.0, the `.btn-close-white` class is deprecated. Instead, use `data-bs-theme="dark"` to change the color mode of the close button.
{{< /callout >}}

Add `data-bs-theme="dark"` to the `.btn-close`, or to its parent element, to invert the close button. This uses the `filter` property to invert the `background-image` without overriding its value.

{{< example class="bg-dark" >}}
<div data-bs-theme="dark">
  <button type="button" class="btn-close" aria-label="Close"></button>
  <button type="button" class="btn-close" disabled aria-label="Close"></button>
</div>
{{< /example >}}

## CSS

### Variables

{{< added-in "5.3.0" >}}

As part of Bootstrap's evolving CSS variables approach, close button now uses local CSS variables on `.btn-close` for enhanced real-time customization. Values for the CSS variables are set via Sass, so Sass customization is still supported, too.

{{< scss-docs name="close-css-vars" file="scss/_close.scss" >}}

### Sass variables

{{< scss-docs name="close-variables" file="scss/_variables.scss" >}}

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

{{< callout info >}}
**Heads up!** As of v5.3.0, the `.btn-close-white` class is deprecated. Instead, use `data-bs-theme="dark"` to change the color mode of the close button.
{{< /callout >}}

Add `data-bs-theme="dark"` to the `.btn-close`, or to its parent element, to invert the close button. This uses the `filter` property to invert the `background-image` without overriding its value.

{{< example class="bg-dark" >}}
<div data-bs-theme="dark">
  <button type="button" class="btn-close" aria-label="Close"></button>
  <button type="button" class="btn-close" disabled aria-label="Close"></button>
</div>
{{< /example >}}

## Sass

### Variables

{{< scss-docs name="close-variables" file="scss/_variables.scss" >}}

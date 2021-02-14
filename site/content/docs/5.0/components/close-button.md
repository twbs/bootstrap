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

## White variant

Change the default `.btn-close` to be white with the `.btn-close-white` class. This class uses the `filter` property to invert the `background-image`.

{{< example class="bg-dark" >}}
<button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
<button type="button" class="btn-close btn-close-white" disabled aria-label="Close"></button>
{{< /example >}}

## Sass

### Variables

{{< scss-docs name="close-variables" file="scss/_variables.scss" >}}

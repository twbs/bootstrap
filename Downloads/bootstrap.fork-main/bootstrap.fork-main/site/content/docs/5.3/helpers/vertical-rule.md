---
layout: docs
title: Vertical rule
description: Use the custom vertical rule helper to create vertical dividers like the `<hr>` element.
group: helpers
toc: true
added:
  version: "5.1"
---

## How it works

Vertical rules are inspired by the `<hr>` element, allowing you to create vertical dividers in common layouts. They're styled just like `<hr>` elements:

- They're `1px` wide
- They have `min-height` of `1em`
- Their color is set via `currentColor` and `opacity`

Customize them with additional styles as needed.

## Example

{{< example >}}
<div class="vr"></div>
{{< /example >}}

Vertical rules scale their height in flex layouts:

{{< example >}}
<div class="d-flex" style="height: 200px;">
  <div class="vr"></div>
</div>
{{< /example >}}

## With stacks

They can also be used in [stacks]({{< docsref "/helpers/stacks" >}}):

{{< example class="bd-example-flex" >}}
<div class="hstack gap-3">
  <div class="p-2">First item</div>
  <div class="p-2 ms-auto">Second item</div>
  <div class="vr"></div>
  <div class="p-2">Third item</div>
</div>
{{< /example >}}

## CSS

### Sass variables

Customize the vertical rule Sass variable to change its width.

{{< scss-docs name="vr-variables" file="scss/_variables.scss" >}}

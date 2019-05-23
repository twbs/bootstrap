---
layout: docs
title: Position
description: Use these helpers for quickly configuring the position of an element.
group: helpers
toc: true
---

## Fixed top

Position an element at the top of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add additional CSS.

{{< highlight html >}}
<div class="fixed-top">...</div>
{{< /highlight >}}

## Fixed bottom

Position an element at the bottom of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add additional CSS.

{{< highlight html >}}
<div class="fixed-bottom">...</div>
{{< /highlight >}}

## Sticky top

Position an element at the top of the viewport, from edge to edge, but only after you scroll past it. The `.sticky-top` utility uses CSS's `position: sticky`, which isn't fully supported in all browsers.

**IE11 and IE10 will render `position: sticky` as `position: relative`.** As such, we wrap the styles in a `@supports` query, limiting the stickiness to only browsers that can render it properly.

{{< highlight html >}}
<div class="sticky-top">...</div>
{{< /highlight >}}

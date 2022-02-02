---
layout: docs
title: Orientation
description: Control the orientation of elements.
group: utilities
---

```html
<div class="rotate-45">...</div>
<div class="rotate-90">...</div>
<div class="rotate-135">...</div>
<div class="rotate-180">...</div>
<div class="rotate-225">...</div>
<div class="rotate-270">...</div>
<div class="rotate-315">...</div>
```

```scss
// Class
.rotate-45 {
  transform: rotate(45deg) !important;
}
.rotate-90 {
  transform: rotate(90deg) !important;
}
.rotate-135 {
  transform: rotate(135deg) !important;
}
.rotate-180 {
  transform: rotate(180deg) !important;
}
.rotate-225 {
  transform: rotate(225deg) !important;
}
.rotate-270 {
  transform: rotate(270deg) !important;
}
.rotate-315 {
  transform: rotate(315deg) !important;
}
```

Flip elements:

{{< example >}}
<div class="flip-horizontal">Flip DOM element horizontally</div>
<div class="flip-vertical">Flip DOM element vertically</div>
{{< /example >}}

```scss
// Class
.flip-horizontal {
  transform: scaleX(-1) !important;
}
.flip-vertical {
  transform: scaleY(-1) !important;
}
```

## Sass

### Utilities API

Orientation utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]({{< docsref "/utilities/api#using-the-api" >}})

{{< scss-docs name="utils-orientation" file="scss/_utilities.scss" >}}

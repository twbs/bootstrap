---
layout: docs
title: Borders
description: Use border utilities to quickly style the border and border-radius of an element. Great for images, buttons, or any other element.
group: utilities
toc: true
---

## Border

Use border utilities to add or remove an element's borders. Choose from all borders or one at a time.

### Additive

{{< example class="bd-example-border-utils" >}}
<span class="border"></span>
<span class="border-top"></span>
<span class="border-right"></span>
<span class="border-bottom"></span>
<span class="border-left"></span>
{{< /example >}}

### Subtractive

{{< example class="bd-example-border-utils bd-example-border-utils-0" >}}
<span class="border-0"></span>
<span class="border-top-0"></span>
<span class="border-right-0"></span>
<span class="border-bottom-0"></span>
<span class="border-left-0"></span>
{{< /example >}}

## Border color

Change the border color using utilities built on our theme colors. We've also included a subset of our gray colors to provide more flexibility.

{{< example class="bd-example-border-utils" >}}
{{< border.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="border border-{{ .name }}"></span>
{{- end -}}
{{< /border.inline >}}
<span class="border border-white"></span>
<span class="border border-gray-500"></span>
<span class="border border-gray-700"></span>
<span class="border border-black"></span>
{{< /example >}}

The gray `border-color` utilities differ slightly than our `background-color` utilities so that there's some slight contrast between the two.

{{< example >}}
<div class="p-3 mb-1 bg-light border"></div>
<div class="p-3 mb-1 bg-gray border border-gray-500"></div>
<div class="p-3 mb-1 bg-secondary border border-gray-700"></div>
<div class="p-3 mb-1 bg-dark border border-black"></div>
{{< /example >}}

## Border-radius

Add classes to an element to easily round its corners.

{{< example class="bd-example-radius-utils" >}}
{{< placeholder width="75" height="75" class="radius" title="Example rounded image" >}}
{{< placeholder width="75" height="75" class="radius-t" title="Example top rounded image" >}}
{{< placeholder width="75" height="75" class="radius-r" title="Example right rounded image" >}}
{{< placeholder width="75" height="75" class="radius-b" title="Example bottom rounded image" >}}
{{< placeholder width="75" height="75" class="radius-l" title="Example left rounded image" >}}
{{< placeholder width="75" height="75" class="radius-circle" title="Completely round image" >}}
{{< placeholder width="150" height="75" class="radius-pill" title="Rounded pill image" >}}
{{< placeholder width="75" height="75" class="radius-0" title="Example non-rounded image (overrides rounding applied elsewhere)" >}}
{{< /example >}}

### Sizes

Similar to our spacing scales, there's a scale option for our `border-radius`: `0`, `1`, `2`, and `3`.

{{< example class="bd-example-rounded-utils" >}}
{{< placeholder width="75" height="75" class="radius-1" title="Example small rounded image" >}}
{{< placeholder width="75" height="75" class="radius-2" title="Example rounded image" >}}
{{< placeholder width="75" height="75" class="radius-3" title="Example large rounded image" >}}
{{< /example >}}

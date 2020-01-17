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

Change the border color using utilities built on our theme colors.

{{< example class="bd-example-border-utils" >}}
{{< border.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="border border-{{ .name }}"></span>
{{- end -}}
{{< /border.inline >}}
<span class="border border-white"></span>
{{< /example >}}

## Border-radius

Add classes to an element to easily round its corners.

{{< example >}}
{{< placeholder width="75" height="75" class="border-radius" title="Example rounded image" >}}
{{< placeholder width="75" height="75" class="rounded-top" title="Example top rounded image" >}}
{{< placeholder width="75" height="75" class="rounded-right" title="Example right rounded image" >}}
{{< placeholder width="75" height="75" class="rounded-bottom" title="Example bottom rounded image" >}}
{{< placeholder width="75" height="75" class="rounded-left" title="Example left rounded image" >}}
{{< placeholder width="75" height="75" class="border-radius-circle" title="Completely round image" >}}
{{< placeholder width="150" height="75" class="border-radius-pill" title="Rounded pill image" >}}
{{< placeholder width="75" height="75" class="border-radius-0" title="Example non-rounded image (overrides rounding applied elsewhere)" >}}
{{< /example >}}


## Sizes

Use the border-radius factors for larger or smaller border-radius sizes. Sizes range from `0` to `3`.

{{< example >}}
{{< placeholder width="75" height="75" class="border-radius-0" title="Example non-rounded image" >}}
{{< placeholder width="75" height="75" class="border-radius-1" title="Example small rounded image" >}}
{{< placeholder width="75" height="75" class="border-radius-2" title="Example default rounded image" >}}
{{< placeholder width="75" height="75" class="border-radius-3" title="Example large rounded image" >}}
{{< /example >}}

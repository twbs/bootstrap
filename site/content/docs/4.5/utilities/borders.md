---
layout: docs
title: Borders
description: Use border utilities to quickly style the border and border-radius of an element. Great for images, buttons, or any other element.
group: utilities
aliases: "/docs/4.5/utilities/"
toc: true
---

## Border

Use border utilities to add or remove an element's borders. Choose from all borders or one at a time.

### Additive

<div class="bd-example-border-utils">
{{< example >}}
<span class="border"></span>
<span class="border-top"></span>
<span class="border-right"></span>
<span class="border-bottom"></span>
<span class="border-left"></span>
{{< /example >}}
</div>

### Subtractive

<div class="bd-example-border-utils bd-example-border-utils-0">
{{< example >}}
<span class="border-0"></span>
<span class="border-top-0"></span>
<span class="border-right-0"></span>
<span class="border-bottom-0"></span>
<span class="border-left-0"></span>
{{< /example >}}
</div>

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

<div class="bd-example bd-example-images">
  {{< placeholder width="75" height="75" class="rounded" title="Example rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-top" title="Example top rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-right" title="Example right rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-bottom" title="Example bottom rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-left" title="Example left rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-circle" title="Completely round image" >}}
  {{< placeholder width="150" height="75" class="rounded-pill" title="Rounded pill image" >}}
  {{< placeholder width="75" height="75" class="rounded-0" title="Example non-rounded image (overrides rounding applied elsewhere)" >}}
</div>

```html
<img src="..." alt="..." class="rounded">
<img src="..." alt="..." class="rounded-top">
<img src="..." alt="..." class="rounded-right">
<img src="..." alt="..." class="rounded-bottom">
<img src="..." alt="..." class="rounded-left">
<img src="..." alt="..." class="rounded-circle">
<img src="..." alt="..." class="rounded-pill">
<img src="..." alt="..." class="rounded-0">
```

## Sizes

Use `.rounded-lg` or `.rounded-sm` for larger or smaller border-radius.

<div class="bd-example bd-example-images">
  {{< placeholder width="75" height="75" class="rounded-sm" title="Example small rounded image" >}}
  {{< placeholder width="75" height="75" class="rounded-lg" title="Example large rounded image" >}}
</div>

```html
<img src="..." alt="..." class="rounded-sm">
<img src="..." alt="..." class="rounded-lg">
```

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

Add `.rounded` classes to an element to round the corners via `border-radius`. Rounded utilities include a subset of sizes from our `$spacing` Sass map, as well as options for circle and pill shapes and a default `.rounded` class that uses our `$border-radius` variable.

{{< example class="bd-example-rounded-utils" >}}
{{< placeholder width="80" height="80" class="rounded-0" title="Rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-1" title="Rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-2" title="Rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-3" title="Rounded image" >}}
{{< placeholder width="80" height="80" class="rounded" title="Example rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-circle" title="Completely round image" >}}
{{< placeholder width="160" height="80" class="rounded-pill" title="Rounded pill image" >}}
{{< /example >}}

### Rounded sides

You can also round just one side of an element. Please note that you cannot set `.rounded-{0|1|2|3}` on one side at this time, only our default `$border-radius`.

{{< example class="bd-example-rounded-utils" >}}
{{< placeholder width="80" height="80" class="rounded-top" title="Example top rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-right" title="Example right rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-bottom" title="Example bottom rounded image" >}}
{{< placeholder width="80" height="80" class="rounded-left" title="Example left rounded image" >}}
{{< /example >}}

---
layout: docs
title: Float
description: Toggle floats on any element, across any breakpoint, using our responsive float utilities.
group: utilities
toc: true
---

## Overview

These utility classes float an element to the left or right, or disable floating, based on the current viewport size using the [CSS `float` property](https://developer.mozilla.org/en-US/docs/Web/CSS/float). `!important` is included to avoid specificity issues. These use the same viewport breakpoints as our grid system. Please be aware float utilities have no effect on flex items.

{{< example >}}
<div class="float-start">Float start on all viewport sizes</div><br>
<div class="float-end">Float end on all viewport sizes</div><br>
<div class="float-none">Don't float on all viewport sizes</div>
{{< /example >}}

## Responsive

Responsive variations also exist for each `float` value.

{{< example >}}
<div class="float-sm-start">Float start on viewports sized SM (small) or wider</div><br>
<div class="float-md-start">Float start on viewports sized MD (medium) or wider</div><br>
<div class="float-lg-start">Float start on viewports sized LG (large) or wider</div><br>
<div class="float-xl-start">Float start on viewports sized XL (extra-large) or wider</div><br>
{{< /example >}}

Here are all the support classes:

{{< markdown >}}
{{< float.inline >}}
{{- range $.Site.Data.breakpoints }}
- `.float{{ .abbr }}-start`
- `.float{{ .abbr }}-end`
- `.float{{ .abbr }}-none`
{{- end -}}
{{< /float.inline >}}
{{< /markdown >}}

## CSS

### Sass utilities API

Float utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]({{< docsref "/utilities/api#using-the-api" >}})

{{< scss-docs name="utils-float" file="scss/_utilities.scss" >}}

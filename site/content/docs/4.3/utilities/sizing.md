---
layout: docs
title: Sizing
description: Easily make an element as wide or as tall with our width and height utilities.
group: utilities
toc: true
---

## Relative to the parent

Width and height utilities are generated from the `$sizes` Sass map in `_variables.scss`. Includes support for `25%`, `50%`, `75%`, `100%`, and `auto` by default. Modify those values as you need to generate different utilities here.

{{< example >}}
<div class="w-25 p-3 mb-1" style="background-color: #eee;">.w-25</div>
<div class="w-50 p-3 mb-1" style="background-color: #eee;">.w-50</div>
<div class="w-75 p-3 mb-1" style="background-color: #eee;">.w-75</div>
<div class="w-100 p-3 mb-1" style="background-color: #eee;">.w-100</div>
<div class="w-auto p-3" style="background-color: #eee;">.w-auto</div>
{{< /example >}}

{{< example >}}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="h-25 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 25%</div>
  <div class="h-50 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 50%</div>
  <div class="h-75 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 75%</div>
  <div class="h-100 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 100%</div>
  <div class="h-auto d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height auto</div>
</div>
{{< /example >}}

You can also use `max-width: 100%;` and `max-height: 100%;` utilities as needed.

{{< example >}}
{{< placeholder width="100%" height="100" class="mw-100" text="Max-width 100%" >}}
{{< /example >}}

{{< example >}}
<div style="height: 100px; background-color: rgba(255,0,0,.1);">
  <div class="mh-100" style="width: 100px; height: 200px; background-color: rgba(0,0,255,.1);">Max-height 100%</div>
</div>
{{< /example >}}

## Responsive

The `width` and `height` utilities are also responsive and can be adjusted by breakpoint. Here's the same example from above, but overridden from the medium breakpoint and up.

**Please note that `max-width`, `max-height`, and viewport size utilities are not currently responsive.**

{{< example >}}
<div class="w-25 w-md-100 p-3 mb-1" style="background-color: #eee;">.w-md-100</div>
<div class="w-50 w-md-75 p-3 mb-1" style="background-color: #eee;">.w-md-75</div>
<div class="w-75 w-md-50 p-3 mb-1" style="background-color: #eee;">.w-md-50</div>
<div class="w-100 w-md-25 p-3 mb-1" style="background-color: #eee;">.w-md-25</div>
<div class="w-auto w-md-100 p-3" style="background-color: #eee;">.w-md-100</div>
{{< /example >}}}

## Relative to the viewport

You can also use utilities to set the width and height relative to the viewport.

{{< highlight html >}}
<div class="min-vw-100">Min-width 100vw</div>
<div class="min-vh-100">Min-height 100vh</div>
<div class="vw-100">Width 100vw</div>
<div class="vh-100">Height 100vh</div>
{{< /highlight >}}

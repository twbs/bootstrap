---
layout: docs
title: Sizing
description: Easily make an element as wide or as tall with our width and height utilities.
group: utilities
toc: true
---

## Relative to the parent

Width and height utilities are generated from the utility API in `_utilities.scss`. Includes support for `25%`, `50%`, `75%`, `100%`, and `auto` by default. Modify those values as you need to generate different utilities here.

### Width utilities

{{< example >}}
<div class="w-25 p-3 bg-light border">Width 25%</div>
<div class="w-50 p-3 bg-light border">Width 50%</div>
<div class="w-75 p-3 bg-light border">Width 75%</div>
<div class="w-100 p-3 bg-light border">Width 100%</div>
<div class="w-auto p-3 bg-light border">Width auto</div>
{{< /example >}}

### Responsive width utilities

Responsive variants can be used together with other utilities to create responsive floated images. In the following example the `w-md-50` set the width of the image to 50% above the `md` breakpoint. Make sure to wrap the content in a [`.clearfix`]({{< docsref "/helpers/clearfix" >}}) wrapper to clear the float if the text is shorter.

{{< example >}}
<div class="clearfix">
  {{< placeholder width="100%" height="210" class="w-md-50 float-md-right mb-3 ml-md-3" text="Responsive floated image" >}}

  <p>
    Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue. Fusce dapibus, tellus ac cursus commodo, tortor mauris paddenstoel nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>

  <p>
    Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Id nullam tellus relem amet commodo telemque olemit. Sed posuere consectetur est at lobortis. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
  </p>

  <p>
    Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lantaarnpaal quam venenatis vestibulum. Donec sed odio dui. Maecenas faucibus mollis interdum. Nullam quis risus eget urna salsa tequila vel eu leo. Donec id elit non mi porta gravida at eget metus.
  </p>
</div>
{{< /example >}}

### Height utilities

Unlike the widths, height utilities have no responsive variants by default, but these can easily be turned on by switching on the `responsive` key in the [utility API]({{< docsref "/utilities/api" >}}).

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

## Relative to the viewport

You can also use utilities to set the width and height relative to the viewport.

{{< highlight html >}}
<div class="min-vw-100">Min-width 100vw</div>
<div class="min-vh-100">Min-height 100vh</div>
<div class="vw-100">Width 100vw</div>
<div class="vh-100">Height 100vh</div>
{{< /highlight >}}

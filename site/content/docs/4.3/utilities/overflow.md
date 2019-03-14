---
layout: docs
title: Overflow
description: Use these shorthand utilities for quickly configuring how content overflows an element.
group: utilities
---

Barebones `overflow` functionality is provided for two values by default, and they are not responsive.

<div class="bd-example d-md-flex">
  <div class="overflow-auto p-3 mb-3 mb-md-0 mr-md-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-auto</code> on an element with set width and height dimensions. By design, this content will vertically scroll.
  </div>
  <div class="overflow-hidden p-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-hidden</code> on an element with set width and height dimensions.
  </div>
</div>

{{< highlight html >}}
<div class="overflow-auto">...</div>
<div class="overflow-hidden">...</div>
{{< /highlight >}}

Using Sass variables, you may customize the overflow utilities by changing the `$overflows` variable in `_variables.scss`.

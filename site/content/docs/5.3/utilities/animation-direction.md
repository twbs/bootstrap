---
layout: docs
title: Animation direction
description: Control the animation direction of elements with animation-direction utilities.
group: utilities
---

Set the `animation direction` of elements with our animation-direction utilities. 

Add `.animation-direction-reverse`, `.animation-direction-alternate` or `.animation-direction-alternate-reverse` as needed.

{{< example >}}
<div class="spinner-border animation-direction-reverse" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-grow animation-direction-reverse" style="width: 3rem; height: 3rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-border animation-direction-alternate" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
{{< /example >}}

## Sass

### Utilities API

Animation direction utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]({{< docsref "/utilities/api#using-the-api" >}})

{{< scss-docs name="utils-animation-direction" file="scss/_utilities.scss" >}}

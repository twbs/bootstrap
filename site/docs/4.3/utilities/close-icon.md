---
layout: docs
title: Close icon
description: Use a generic close icon for dismissing content like modals and alerts.
group: utilities
---

**Be sure to include text for screen readers**, as we've done with `aria-label`.

{% capture example %}
<button type="button" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
{% endcapture %}
{% include example.html content=example %}

## Variables
| Variable | Default | Description |
| --- | --- | --- |
| $close-font-size | $font-size-base * 1.5 | Determines the font size for the close icon. Please note that `$font-size-base` by default is 16px.|
| $close-font-weight | $font-weight-bold | Determines the font eight for close icon. `$font-weight-bold` by default is 700. |
| $close-color | $black (`#000`) | Determines the font color of the close button.  |
| $close-text-shadow | 0 1px 0 $white | Determines the shadow cast by the close button. Please note that `$white` by default is `#fff` |
---
layout: docs
title: Text truncation
description: Truncate long strings of text with an ellipsis.
group: helpers
toc: false
---

For longer content, you can add a `.text-truncate` class to truncate the text with an ellipsis. **Requires `display: inline-block` or `display: block`.**

{{< example >}}
<!-- Block level -->
<div class="row">
  <div class="col-2 text-truncate">
    Yeah, we maxed our credit cards and got kicked out.
  </div>
</div>

<!-- Inline level -->
<span class="d-inline-block text-truncate" style="max-width: 150px;">
  Yeah, we maxed our credit cards and got kicked out.
</span>
{{< /example >}}

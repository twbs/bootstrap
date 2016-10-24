---
layout: docs
title: Display property
group: utilities
---

Use `.d-block`, `.d-inline`, or `.d-inline-block` to simply set an element's [`display` property](https://developer.mozilla.org/en-US/docs/Web/CSS/display) to `block`, `inline`, or `inline-block` (respectively).

To make an element `display: none`, use our [responsive utilities]({{ site.baseurl }}/layout/responsive-utilities/) instead.

{% example html %}
<div class="d-inline bg-success">Inline</div>
<div class="d-inline bg-success">Inline</div>
{% endexample %}

{% example html %}
<span class="d-block bg-primary">Block</span>
{% endexample %}

{% example html %}
<div class="d-inline-block bg-warning">
  <h3>inline-block</h3>
  Boot that strap!
</div>
<div class="d-inline-block bg-warning">
  <h3>inline-block</h3>
  Strap that boot!
</div>
{% endexample %}

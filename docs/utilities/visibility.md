---
layout: docs
title: Visibility
group: utilities
---

Set the `visibility` of elements with our visibility utilities. These do not modify the `display` value at all and are helpful for hiding content from most users, but still keeping them for screen readers.

Apply `.visible` or `.invisible` as needed.

{% highlight html %}
<div class="visible">...</div>
<div class="invisible">...</div>
{% endhighlight %}

{% highlight scss %}
// Class
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}

// Usage as a mixin
.element {
  @include invisible(visible);
}
.element {
  @include invisible(hidden);
}
{% endhighlight %}

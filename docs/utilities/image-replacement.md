---
layout: docs
title: Image replacement
group: utilities
---

Utilize the `.text-hide` class or mixin to help replace an element's text content with a background image.

{% highlight html %}
<h1 class="text-hide">Custom heading</h1>
{% endhighlight %}

{% highlight scss %}
// Usage as a mixin
.heading {
  @include text-hide;
}
{% endhighlight %}

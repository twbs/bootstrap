---
layout: docs
title: Image replacement
description: Swap text for background images with the image replacement class.
group: utilities
toc: true
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

The `.text-hide` class is useful for when you want the benefits heading tags like accessibility and SEO, but want to utilize your brand's logo image instead of text.

{% example html %}
<h1 class="text-hide" style="background-image: url('/assets/brand/bootstrap-solid.svg'); width: 50px; height: 50px;">Bootstrap</h1>
{% endexample %}
{% highlight html %}
<h1 class="text-hide logo">Bootstrap</h1>
{% endhighlight %}
{% highlight scss %}
.logo {
  background-image: url('/assets/brand/bootstrap-solid.svg');
}
{% endhighlight %}


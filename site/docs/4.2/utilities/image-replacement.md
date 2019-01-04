---
layout: docs
title: Image replacement
description: Swap text for background images with the image replacement class.
group: utilities
toc: true
---

{% capture callout %}
##### Warning

The `text-hide()` class and mixin has been deprecated as of v4.1. It will be removed entirely in v5.
{% endcapture %}
{% include callout.html content=callout type="warning" %}

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

Use the `.text-hide` class to maintain the accessibility and SEO benefits of heading tags, but want to utilize a `background-image` instead of text.

<div class="bd-example">
  <h1 class="text-hide" style="background-image: url('{{ site.baseurl }}/docs/{{ site.docs_version }}/assets/brand/bootstrap-solid.svg'); width: 50px; height: 50px;">Bootstrap</h1>
</div>

{% highlight html %}
<h1 class="text-hide" style="background-image: url('..');">Bootstrap</h1>
{% endhighlight %}

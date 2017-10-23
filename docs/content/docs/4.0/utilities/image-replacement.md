---
layout: docs
title: Image replacement
description: Swap text for background images with the image replacement class.
menu:
  docs:
    parent: utilities
toc: true
---

Utilize the `.text-hide` class or mixin to help replace an element's text content with a background image.

{{< highlight html >}}
<h1 class="text-hide">Custom heading</h1>
{{< /highlight >}}

{{< highlight scss >}}
// Usage as a mixin
.heading {
  @include text-hide;
}
{{< /highlight >}}

Use the `.text-hide` class to maintain the accessibility and SEO benefits of heading tags, but want to utilize a `background-image` instead of text.

{% example html %}
<h1 class="text-hide" style="background-image: url('/assets/brand/bootstrap-solid.svg'); width: 50px; height: 50px;">Bootstrap</h1>
{% endexample %}

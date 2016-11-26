---
layout: docs
title: Borders
group: utilities
---

Use border utilities to quickly style the `border` and `border-radius` of an element. Great for images, buttons, or any other element.

## Border

Add classes to an element to remove all borders or some borders.

<div class="bd-example-border-utils">
{% example html %}
<span class="border-0"></span>
<span class="border-top-0"></span>
<span class="border-right-0"></span>
<span class="border-bottom-0"></span>
<span class="border-left-0"></span>
{% endexample %}
</div>

## Border-radius

Add classes to an element to easily round its corners.

<div class="bd-example bd-example-images">
  <img data-src="holder.js/100x100" class="rounded" alt="Example rounded image">
  <img data-src="holder.js/100x100" class="rounded-top" alt="Example top rounded image">
  <img data-src="holder.js/100x100" class="rounded-right" alt="Example right rounded image">
  <img data-src="holder.js/100x100" class="rounded-bottom" alt="Example bottom rounded image">
  <img data-src="holder.js/100x100" class="rounded-left" alt="Example left rounded image">
  <img data-src="holder.js/100x100" class="rounded-circle" alt="Completely round image">
</div>

{% highlight html %}
<img src="..." alt="..." class="rounded">
<img src="..." alt="..." class="rounded-top">
<img src="..." alt="..." class="rounded-right">
<img src="..." alt="..." class="rounded-bottom">
<img src="..." alt="..." class="rounded-left">
<img src="..." alt="..." class="rounded-circle">
{% endhighlight %}

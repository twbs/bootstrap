---
layout: docs
title: Borders
group: utilities
redirect_from: "/utilities/"
---

Use border utilities to quickly style the `border` and `border-radius` of an element. Great for images, buttons, or any other element.

## Border

Add classes to an element to remove all borders or some borders.

<div class="bd-example-border-utils">
{% example html %}
<span class="d-inline-block p-4 border border-gray"></span>
<span class="d-inline-block p-4 border border-gray border-0"></span>
<span class="d-inline-block p-4 border border-gray border-top-0"></span>
<span class="d-inline-block p-4 border border-gray border-right-0"></span>
<span class="d-inline-block p-4 border border-gray border-bottom-0"></span>
<span class="d-inline-block p-4 border border-gray border-left-0"></span>
{% endexample %}
</div>

Change the color of a border with `border-color` utilities.

<div class="bd-example-border-utils">
{% example html %}
{% for color in site.data.colors %}
<span class="d-inline-block p-4 border border-{{ color.name }}"></span>{% endfor %}
{% endexample %}
</div>

## Border-radius

Add classes to an element to easily round its corners.

<div class="bd-example bd-example-images">
  <img data-src="holder.js/75x75" class="rounded" alt="Example rounded image">
  <img data-src="holder.js/75x75" class="rounded-top" alt="Example top rounded image">
  <img data-src="holder.js/75x75" class="rounded-right" alt="Example right rounded image">
  <img data-src="holder.js/75x75" class="rounded-bottom" alt="Example bottom rounded image">
  <img data-src="holder.js/75x75" class="rounded-left" alt="Example left rounded image">
  <img data-src="holder.js/75x75" class="rounded-circle" alt="Completely round image">
  <img data-src="holder.js/75x75" class="rounded-0" alt="Example non-rounded image (overrides rounding applied elsewhere)">
</div>

{% highlight html %}
<img src="..." alt="..." class="rounded">
<img src="..." alt="..." class="rounded-top">
<img src="..." alt="..." class="rounded-right">
<img src="..." alt="..." class="rounded-bottom">
<img src="..." alt="..." class="rounded-left">
<img src="..." alt="..." class="rounded-circle">
<img src="..." alt="..." class="rounded-0">
{% endhighlight %}

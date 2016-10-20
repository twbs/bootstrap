---
layout: docs
title: Sizing and positioning
group: utilities
---

## Fixed positioning

The `.pos-f-t` class can be used to easily position elements at the top of the viewport and make them as wide as the viewport. **Be sure you understand the ramifications of fixed-position elements within your project.** Here's how the class is defined:

{% highlight scss %}
.pos-f-t {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: $zindex-navbar-fixed;
}
{% endhighlight %}


## Width and height

Easily make an element as wide or as tall as its parent using the `.w-100` and `.h-100` utility classes.

{% example html %}
<img class="w-100" data-src="holder.js/200px100?outline=yes&text=Width%20%3D%20100%25" alt="Width = 100%">
{% endexample %}

{% example html %}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="h-100" style="width: 100px; background-color: rgba(0,0,255,0.1);">Full height</div>
</div>
{% endexample %}

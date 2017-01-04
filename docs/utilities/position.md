---
layout: docs
title: Position
group: utilities
---

Position utilities are helpful for quickly placing a component outside the normal document flow. Choose from a handful of fixed or sticky position classes as needed.

### Fixed top

Position an element at the top of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add aditional CSS.

{% highlight html %}
<div class="fixed-top">...</div>
{% endhighlight %}

### Fixed bottom

Position an element at the bottom of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add aditional CSS.

{% highlight html %}
<div class="fixed-bottom">...</div>
{% endhighlight %}

### Sticky top

Position an element at the top of the viewport, from edge to edge, but only after you scroll past it. The `.sticky-top` utility uses CSS's `position: sticky`, which isn't fully supported in all browsers.

{% highlight html %}
<div class="sticky-top">...</div>
{% endhighlight %}

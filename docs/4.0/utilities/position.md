---
layout: docs
title: Position
description: Use these shorthand utilities for quickly configuring the position of an element.
group: utilities
toc: true
---

## Fixed top

Position an element at the top of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add aditional CSS.

{% highlight html %}
<div class="fixed-top">...</div>
{% endhighlight %}

## Fixed bottom

Position an element at the bottom of the viewport, from edge to edge. Be sure you understand the ramifications of fixed position in your project; you may need to add aditional CSS.

{% highlight html %}
<div class="fixed-bottom">...</div>
{% endhighlight %}

## Sticky top

Position an element at the top of the viewport, from edge to edge, but only after you scroll past it. The `.sticky-top` utility uses CSS's `position: sticky`, which isn't fully supported in all browsers.

**Microsoft Edge and IE11 will render `position: sticky` as `position: relative`.** As such, we wrap the styles in a `@supports` query, limiting the stickiness to only browsers that properly can render it.

{% highlight html %}
<div class="sticky-top">...</div>
{% endhighlight %}

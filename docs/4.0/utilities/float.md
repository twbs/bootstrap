---
layout: docs
title: Float
description: Toggle floats on any element, across any breakpoint, using our responsive float utilities.
group: utilities
toc: true
---

## Overview

These utility classes float an element to the left or right, or disable floating, based on the current viewport size using the [CSS `float` property](https://developer.mozilla.org/en-US/docs/Web/CSS/float). `!important` is included to avoid specificity issues. These use the same viewport breakpoints as our grid system.

## Classes

Toggle a float with a class:

{% example html %}
<div class="float-left">Float left on all viewport sizes</div><br>
<div class="float-right">Float right on all viewport sizes</div><br>
<div class="float-none">Don't float on all viewport sizes</div>
{% endexample %}

## Mixins

Or by Sass mixin:

{% highlight scss %}
.element {
  @include float-left;
}
.another-element {
  @include float-right;
}
.one-more {
  @include float-none;
}
{% endhighlight %}

## Responsive

Responsive variations also exist for each `float` value.

{% example html %}
<div class="float-sm-left">Float left on viewports sized SM (small) or wider</div><br>
<div class="float-md-left">Float left on viewports sized MD (medium) or wider</div><br>
<div class="float-lg-left">Float left on viewports sized LG (large) or wider</div><br>
<div class="float-xl-left">Float left on viewports sized XL (extra-large) or wider</div><br>
{% endexample %}

Here are all the support classes;

{% for bp in site.data.breakpoints %}
- `.float{{ bp.abbr }}-left`
- `.float{{ bp.abbr }}-right`
- `.float{{ bp.abbr }}-none`{% endfor %}

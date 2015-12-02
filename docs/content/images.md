---
layout: docs
title: Images
group: content
---

Opt your images into responsive behavior (so they never become larger than their parent elements) and add lightweight styles to them—all via classes.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Responsive images

Images in Bootstrap are made responsive with `.img-fluid`. `max-width: 100%;` and `height: auto;` are applied to the image so that it scales with the parent element.

<div class="bd-example">
  <img data-src="holder.js/100px250" class="img-fluid" alt="Generic responsive image">
</div>

{% highlight html %}
<img src="..." class="img-fluid" alt="Responsive image">
{% endhighlight %}

{% callout warning %}
#### SVG images and IE 9-10

In Internet Explorer 9-10, SVG images with `.img-fluid` are disproportionately sized. To fix this, add `width: 100% \9;` where necessary. This fix improperly sizes other image formats, so Bootstrap doesn't apply it automatically.
{% endcallout %}

## Image shapes

Add classes to an `<img>` element to easily style images in any project.

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="img-rounded" alt="A generic square placeholder image with rounded corners">
  <img data-src="holder.js/200x200" class="img-circle" alt="A generic square placeholder image where only the portion within the circle circumscribed about said square is visible">
  <img data-src="holder.js/200x200" class="img-thumbnail" alt="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera">
</div>

{% highlight html %}
<img src="..." alt="..." class="img-rounded">
<img src="..." alt="..." class="img-circle">
<img src="..." alt="..." class="img-thumbnail">
{% endhighlight %}

## Aligning images

Align images with the [helper float classes]({{ site.baseurl }}/components/utilities/#floats) or [text alignment classes]({{ site.baseurl }}/components/utilities/#text-alignment). A simple centering class can also be used for `block` level images.

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="img-rounded pull-xs-left" alt="A generic square placeholder image with rounded corners">
  <img data-src="holder.js/200x200" class="img-rounded pull-xs-right" alt="A generic square placeholder image with rounded corners">
</div>

{% highlight html %}
<img src="..." class="img-rounded pull-xs-left" alt="...">
<img src="..." class="img-rounded pull-xs-right" alt="...">
{% endhighlight %}

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="img-rounded center-block" style="display: block;" alt="A generic square placeholder image with rounded corners">
</div>

{% highlight html %}
<img src="..." class="img-rounded center-block" style="display: block;" alt="...">
{% endhighlight %}

<div class="bd-example bd-example-images">
  <div class="text-xs-center">
    <img data-src="holder.js/200x200" class="img-rounded" alt="A generic square placeholder image with rounded corners">
  </div>
</div>

{% highlight html %}
<div class="text-xs-center">
  <img src="..." class="img-rounded" alt="...">
</div>
{% endhighlight %}

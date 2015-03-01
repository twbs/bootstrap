---
layout: page
title: Images
---

Opt your images into responsive behavior (so they never become larger than their parent elements) and add lightweight styles to them—all via classes.

## Responsive images

Images in Bootstrap 3 can be made responsive-friendly via the addition of the `.img-responsive` class. This applies `max-width: 100%;` and `height: auto;` to the image so that it scales nicely to the parent element.

<div class="bs-example">
<img data-src="holder.js/100%x250" class="img-responsive" alt="Generic responsive image">
</div>

{% highlight html %}
<img src="..." class="img-responsive" alt="Responsive image">
{% endhighlight %}

<div class="bs-callout bs-callout-warning">
<h4>SVG images and IE 9-10</h4>
<p>In Internet Explorer 9-10, SVG images with <code>.img-responsive</code> are disproportionately sized. To fix this, add <code>width: 100% \9;</code> where necessary. Bootstrap doesn't apply this automatically as it causes complications to other image formats.</p>
</div>

## Image shapes

Add classes to an `<img>` element to easily style images in any project.

<div class="bs-example bs-example-images">
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

To center images with `.img-responsive`, use `.center-block`. For all other images, use `.text-center`. [See the helper classes section](/css/helpers) for more details about `.center-block` usage.

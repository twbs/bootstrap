---
layout: docs
title: Images
description: Documentation and examples for styling images with Bootstrap.
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
#### SVG images and IE 10

In Internet Explorer 10, SVG images with `.img-fluid` are disproportionately sized. To fix this, add `width: 100% \9;` where necessary. This fix improperly sizes other image formats, so Bootstrap doesn't apply it automatically.
{% endcallout %}

## Image thumbnails

In addition to our [border-radius utilities]({{ site.baseurl }}/utilities/borders/), you can use `.img-thumbnail` to give an image a rounded 1px border appearance.

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="img-thumbnail" alt="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera">
</div>

{% highlight html %}
<img src="..." alt="..." class="img-thumbnail">
{% endhighlight %}

### Nav Thumbnail

Thumbnail for use in a navbar

<div class="bd-example">
  <div class="card my-4">
    <div class="navbar">
      <ul class="nav nav-buttons card-buttons">
        <li class="nav-item">
          <img data-src="holder.js/120x49?auto=yes" class="img-thumbnail nav-thumbnail" alt="A generic square placeholder image with rounded corners">
        </li>
        <li class="nav-item">
          <button type="button" class="btn btn-secondary">Button</button>
        </li>
        <li class="nav-item">
          <div class="btn-group">
            <button type="button" data-toggle="dropdown" class="btn btn-secondary dropdown-toggle">Dropdown</button>
            <div class="dropdown-menu">
              <a href="mailto:" class="dropdown-item">E-Mail</a>
              <div class="dropdown-divider"></div>
              <h6 class="dropdown-header">Social</h6>
              <a href="#" class="dropdown-item">Facebook</a>
              <a href="#" class="dropdown-item">Twitter</a>
              <a href="#" class="dropdown-item">Google Plus</a>
              <a href="#" class="dropdown-item">LinkedIn</a>
            </div>
          </div>
        </li>
        <li class="nav-item">
          <button type="button" class="btn btn-secondary">Button</button>
        </li>
        <li class="ml-auto">
          <a href="#" class="btn btn-cta btn-primary">Start Engines</a>
        </li>
      </ul>
    </div>
  </div>
</div>

{% highlight html %}
<ul class="nav nav-buttons card-buttons">
  <li class="nav-item">
    <img data-src="holder.js/120x49?auto=yes" class="img-thumbnail nav-thumbnail" alt="A generic square placeholder image with rounded corners">
  </li>
  <li class="nav-item">
    ...
  </li>
</ul>
{% endhighlight %}

## Aligning images

Align images with the [helper float classes]({{ site.baseurl }}/utilities/responsive-helpers/#responsive-floats) or [text alignment classes]({{ site.baseurl }}/utilities/typography/#text-alignment). `block`-level images can be centered using [the `.mx-auto` margin utility class]({{ site.baseurl }}/utilities/spacing/#horizontal-centering).

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="rounded float-left" alt="A generic square placeholder image with rounded corners">
  <img data-src="holder.js/200x200" class="rounded float-right" alt="A generic square placeholder image with rounded corners">
</div>

{% highlight html %}
<img src="..." class="rounded float-left" alt="...">
<img src="..." class="rounded float-right" alt="...">
{% endhighlight %}

<div class="bd-example bd-example-images">
  <img data-src="holder.js/200x200" class="rounded mx-auto d-block" alt="A generic square placeholder image with rounded corners">
</div>

{% highlight html %}
<img src="..." class="rounded mx-auto d-block" alt="...">
{% endhighlight %}

<div class="bd-example bd-example-images">
  <div class="text-center">
    <img data-src="holder.js/200x200" class="rounded" alt="A generic square placeholder image with rounded corners">
  </div>
</div>

{% highlight html %}
<div class="text-center">
  <img src="..." class="rounded" alt="...">
</div>
{% endhighlight %}

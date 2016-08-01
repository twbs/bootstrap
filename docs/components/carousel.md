---
layout: docs
title: Carousel
group: components
---

A slideshow component for cycling through elements—images or slides of text—like a carousel. In browsers where the [Page Visibility API](http://www.w3.org/TR/page-visibility/) is supported, the carousel will avoid sliding when the webpage is not visible to the user (such as when the browser tab is inactive, the browser window is minimized, etc.). **Nested carousels are not supported.**

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

{% example html %}
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner" role="listbox">
    <div class="carousel-item active">
      <img data-src="holder.js/900x500/auto/#777:#555/text:First slide" alt="First slide">
    </div>
    <div class="carousel-item">
      <img data-src="holder.js/900x500/auto/#666:#444/text:Second slide" alt="Second slide">
    </div>
    <div class="carousel-item">
      <img data-src="holder.js/900x500/auto/#555:#333/text:Third slide" alt="Third slide">
    </div>
  </div>
  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
    <span class="icon-prev" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
    <span class="icon-next" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
{% endexample %}

{% callout warning %}
#### Transition animations not supported in Internet Explorer 9

Bootstrap exclusively uses CSS3 for its animations, but Internet Explorer 9 doesn't support the necessary CSS properties. Thus, there are no slide transition animations when using that browser. We have intentionally decided not to include jQuery-based fallbacks for the transitions.
{% endcallout %}

{% callout warning %}
#### Initial active element required

The `.active` class needs to be added to one of the slides. Otherwise, the carousel will not be visible.
{% endcallout %}

### Optional captions

Add captions to your slides easily with the `.carousel-caption` element within any `.carousel-item`. Place just about any optional HTML within there and it will be automatically aligned and formatted.

<div class="bd-example">
  <div id="carousel-example-captions" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carousel-example-captions" data-slide-to="0" class="active"></li>
      <li data-target="#carousel-example-captions" data-slide-to="1"></li>
      <li data-target="#carousel-example-captions" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner" role="listbox">
      <div class="carousel-item active">
        <img data-src="holder.js/900x500/auto/#777:#777" alt="First slide image">
        <div class="carousel-caption">
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </div>
      </div>
      <div class="carousel-item">
        <img data-src="holder.js/900x500/auto/#666:#666" alt="Second slide image">
        <div class="carousel-caption">
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div class="carousel-item">
        <img data-src="holder.js/900x500/auto/#555:#555" alt="Third slide image">
        <div class="carousel-caption">
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </div>
      </div>
    </div>
    <a class="left carousel-control" href="#carousel-example-captions" role="button" data-slide="prev">
      <span class="icon-prev" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#carousel-example-captions" role="button" data-slide="next">
      <span class="icon-next" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</div>

{% highlight html %}
<div class="carousel-item">
  <img src="..." alt="...">
  <div class="carousel-caption">
    <h3>...</h3>
    <p>...</p>
  </div>
</div>
{% endhighlight %}

{% callout danger %}
#### Accessibility issue

The carousel component is generally not compliant with accessibility standards. If you need to be compliant, please consider other options for presenting your content.
{% endcallout %}

## Usage

### Multiple carousels

Carousels require the use of an `id` on the outermost container (the `.carousel`) for carousel controls to function properly. When adding multiple carousels, or when changing a carousel's `id`, be sure to update the relevant controls.

### Via data attributes

Use data attributes to easily control the position of the carousel. `data-slide` accepts the keywords `prev` or `next`, which alters the slide position relative to its current position. Alternatively, use `data-slide-to` to pass a raw slide index to the carousel `data-slide-to="2"`, which shifts the slide position to a particular index beginning with `0`.

The `data-ride="carousel"` attribute is used to mark a carousel as animating starting at page load. **It cannot be used in combination with (redundant and unnecessary) explicit JavaScript initialization of the same carousel.**

### Via JavaScript

Call carousel manually with:

{% highlight js %}
$('.carousel').carousel()
{% endhighlight %}

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-interval=""`.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 50px;">Type</th>
       <th style="width: 50px;">Default</th>
       <th>Description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>interval</td>
       <td>number</td>
       <td>5000</td>
       <td>The amount of time to delay between automatically cycling an item. If false, carousel will not automatically cycle.</td>
     </tr>
     <tr>
       <td>pause</td>
       <td>string | null</td>
       <td>"hover"</td>
       <td>If set to <code>"hover"</code>, pauses the cycling of the carousel on <code>mouseenter</code> and resumes the cycling of the carousel on <code>mouseleave</code>. If set to <code>null</code>, hovering over the carousel won't pause it.</td>
     </tr>
     <tr>
       <td>wrap</td>
       <td>boolean</td>
       <td>true</td>
       <td>Whether the carousel should cycle continuously or have hard stops.</td>
     </tr>
     <tr>
       <td>keyboard</td>
       <td>boolean</td>
       <td>true</td>
       <td>Whether the carousel should react to keyboard events.</td>
     </tr>
    </tbody>
  </table>
</div>

### Methods

#### `.carousel(options)`

Initializes the carousel with an optional options `object` and starts cycling through items.

{% highlight js %}
$('.carousel').carousel({
  interval: 2000
})
{% endhighlight %}

#### `.carousel('cycle')`

Cycles through the carousel items from left to right.

#### `.carousel('pause')`

Stops the carousel from cycling through items.

#### `.carousel(number)`

Cycles the carousel to a particular frame (0 based, similar to an array).

#### `.carousel('prev')`

Cycles to the previous item.

#### `.carousel('next')`

Cycles to the next item.

### Events

Bootstrap's carousel class exposes two events for hooking into carousel functionality. Both events have the following additional properties:

- `direction`: The direction in which the carousel is sliding (either `"left"` or `"right"`).
- `relatedTarget`: The DOM element that is being slid into place as the active item.

All carousel events are fired at the carousel itself (i.e. at the `<div class="carousel">`).

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 150px;">Event Type</th>
       <th>Description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>slide.bs.carousel</td>
       <td>This event fires immediately when the <code>slide</code> instance method is invoked.</td>
     </tr>
     <tr>
       <td>slid.bs.carousel</td>
       <td>This event is fired when the carousel has completed its slide transition.</td>
     </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myCarousel').on('slide.bs.carousel', function () {
  // do something…
})
{% endhighlight %}

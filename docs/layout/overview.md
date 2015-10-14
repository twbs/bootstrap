---
layout: docs
title: Overview
group: layout
redirect_from: "/layout/"
---

Bootstrap includes several components and options for laying out your project, including wrapping containers, a powerful grid system, a flexible media object, and responsive utility classes.

## Containers

Containers are the most basic layout element in Bootstrap and are **required when using our grid system**. Choose from a responsive, fixed-width container (meaning it's `max-width` changes at each breakpoint) or fluid-width (meaning it's `100%` wide all the time).

While containers *can* be nested, most layouts do not require a nested container.

<div class="bd-example">
  <div class="bd-example-container">
    <div class="bd-example-container-header"></div>
    <div class="bd-example-container-sidebar"></div>
    <div class="bd-example-container-body"></div>
  </div>
</div>

{% highlight html %}
<div class="container">
  <!-- Content here -->
</div>
{% endhighlight %}

Use `.container-fluid` for a full width container, spanning the entire width of the viewport.

<div class="bd-example">
  <div class="bd-example-container bd-example-container-fluid">
    <div class="bd-example-container-header"></div>
    <div class="bd-example-container-sidebar"></div>
    <div class="bd-example-container-body"></div>
  </div>
</div>

{% highlight html %}
<div class="container-fluid">
  ...
</div>
{% endhighlight %}


## Responsive breakpoints

Since Bootstrap is developed to be mobile first, we use a handful of [media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries) to create sensible breakpoints for our layouts and interfaces. These breakpoints are mostly based on minimum viewport widths and allow us to scale up elements as the viewport changes.

Bootstrap primarily uses the following media query ranges—or breakpoints—in our source Sass files for our layout, grid system, and components.

{% highlight scss %}
// Extra small devices (portrait phones, less than ???px)
// No media query since this is the default in Bootstrap

// Small devices (landscape phones, 34em and up)
@media (min-width: 34em) { ... }

// Medium devices (tablets, 48em and up)
@media (min-width: 48em) { ... }

// Large devices (desktops, 62em and up)
@media (min-width: 62em) { ... }

// Extra large devices (large desktops, 75em and up)
@media (min-width: 75em) { ... }
{% endhighlight %}

Since we write our source CSS in Sass, all our media queries are available via Sass mixins:

{% highlight scss %}
@include media-breakpoint-up(xs) { ... }
@include media-breakpoint-up(sm) { ... }
@include media-breakpoint-up(md) { ... }
@include media-breakpoint-up(lg) { ... }
@include media-breakpoint-up(xl) { ... }

// Example usage:
@include media-breakpoint-up(sm) {
  .some-class {
    display: block;
  }
}
{% endhighlight %}

We occasionally use media queries that go in the other direction (the given screen size *or smaller*):

{% highlight scss %}
// Extra small devices (portrait phones, less than 34em)
@media (max-width: 33.9em) { ... }

// Small devices (landscape phones, less than 48em)
@media (max-width: 47.9em) { ... }

// Medium devices (tablets, less than 62em)
@media (max-width: 61.9em) { ... }

// Large devices (desktops, less than 75em)
@media (max-width: 74.9em) { ... }

// Extra large devices (large desktops)
// No media query since the extra-large breakpoint has no upper bound on its width
{% endhighlight %}

Once again, these media queries are also available via Sass mixins:

{% highlight scss %}
@include media-breakpoint-down(xs) { ... }
@include media-breakpoint-down(sm) { ... }
@include media-breakpoint-down(md) { ... }
@include media-breakpoint-down(lg) { ... }
@include media-breakpoint-down(xl) { ... }
{% endhighlight %}

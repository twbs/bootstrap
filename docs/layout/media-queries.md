---
layout: page
title: Media queries
---

Since Bootstrap is designed to be mobile-first, we employ media queries in our CSS to create responsive pages and components. Media queries allow you to group rulesets by a handful of parameters, most notably viewport dimensions, to gracefully scale content across devices.

### Common queries

Bootstrap uses the following media query ranges in our source Sass files for key breakpoints in our layout, grid system, and components.

{% highlight scss %}
/* Extra small devices (phones, less than 768px) */
/* No media query since this is the default in Bootstrap */

/* Small devices (tablets, 768px and up) */
@media (min-width: @screen-sm-min) { ... }

/* Medium devices (desktops, 992px and up) */
@media (min-width: @screen-md-min) { ... }

/* Large devices (large desktops, 1200px and up) */
@media (min-width: @screen-lg-min) { ... }
{% endhighlight %}

We occasionally expand on these media queries to include a <code>max-width</code> to limit CSS to a narrower set of devices.

{% highlight scss %}
@media (max-width: @screen-xs-max) { ... }
@media (min-width: @screen-sm-min) and (max-width: @screen-sm-max) { ... }
@media (min-width: @screen-md-min) and (max-width: @screen-md-max) { ... }
@media (min-width: @screen-lg-min) { ... }
{% endhighlight %}

### Sass mixins

The above media queries are also available via Sass mixins:

{% highlight scss %}
// List of mixins
@include media-xs { ... }
@include media-sm { ... }
@include media-sm-max { ... }
@include media-md { ... }
@include media-md-max { ... }
@include media-lg { ... }

// Usage
@include media-xs {
  .element {
    display: block;
  }
}
{% endhighlight %}

---
layout: page
title: Media queries
group: layout
---

Since Bootstrap is designed to be mobile-first, we employ media queries in our CSS to create responsive pages and components.

Media queries allow you to group rulesets by a handful of parameters, most notably viewport dimensions, to gracefully scale content across devices. Bootstrap mainly uses the following media query ranges in our source Sass files for key breakpoints in our layout, grid system, and components.

{% highlight scss %}
/* Extra small devices (portrait phones, less than ???px) */
/* No media query since this is the default in Bootstrap */

/* Small devices (landscape phones, 34em and up) */
@media (min-width: 34em) { ... }

/* Medium devices (tablets, 48em and up) */
@media (min-width: 48em) { ... }

/* Large devices (desktops, 62em and up) */
@media (min-width: 62em) { ... }

/* Extra large devices (large desktops, 75em and up) */
@media (min-width: 75em) { ... }
{% endhighlight %}

These media queries are available via Sass mixins:
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
/* Extra small devices (portrait phones, less than 34em) */
@media (max-width: 33.9em) { ... }

/* Small devices (landscape phones, less than 48em) */
@media (max-width: 47.9em) { ... }

/* Medium devices (tablets, less than 62em) */
@media (max-width: 61.9em) { ... }

/* Large devices (desktops, less than 75em) */
@media (max-width: 74.9em) { ... }

/* Extra large devices (large desktops) */
/* No media query since the extra-large breakpoint has no upper bound on its width */
{% endhighlight %}

These media queries are available via Sass mixins:
{% highlight scss %}
@include media-breakpoint-down(xs) { ... }
@include media-breakpoint-down(sm) { ... }
@include media-breakpoint-down(md) { ... }
@include media-breakpoint-down(lg) { ... }
@include media-breakpoint-down(xl) { ... }
{% endhighlight %}

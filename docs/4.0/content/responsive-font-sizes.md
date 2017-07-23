---
layout: docs
title: Responsive font sizes
description: Documentation and examples for responsive font sizes in Bootstrap.
group: content
toc: true
---

## Responsive font sizes
Bootstrap uses <a href="https://github.com/MartijnCuppens/rfs" target="_blank" rel="noopener">RFS</a> to control its font-size. RFS is an SCSS-mixin which automatically calculates the correct font size based on the browsers screen width. You just have got to define your font-size for big screens and the font size will automatically decrease for smaller screens.

## How to use
The RFS-mixin accepts as well numbers (eg. `20`) as numbers with `px`-suffix (eg `20px`). On all other values (like 50%, 1.2em, inherit,...) no fluid rescaling is applied.
{% highlight scss %}
.post-title {
  @include rfs($font-size-lg);
}

.post-label {
  @include rfs(14);
}
{% endhighlight %}

## Disable responsive font sizes
Responsive font sizes can easily be disabled by setting `$enable-responsive-font-sizes` to `false`.

## Alternative responsive font sizing
It's also possible to make use of rem units to control the font-size. If you prefer this method, make sure you have set `$rfs-minimum-font-size-unit` to `rem` (default) and `$enable-responsive-font-sizes` to `false` (not default).

Here’s an example of it in practice. Choose whatever `font-size`s and media queries you wish.

{% highlight scss %}
html {
  font-size: 14px;
}

@include media-breakpoint-up(sm) {
  html {
    font-size: 16px;
  }
}

@include media-breakpoint-up(md) {
  html {
    font-size: 20px;
  }
}

@include media-breakpoint-up(lg) {
  html {
    font-size: 28px;
  }
}
{% endhighlight %}

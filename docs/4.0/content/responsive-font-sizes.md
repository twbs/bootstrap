---
layout: docs
title: Responsive font sizes
description: Documentation and examples for responsive font sizes in Bootstrap.
group: content
toc: true
---

## Responsive font sizes
Bootstrap uses <a href="https://github.com/MartijnCuppens/rfs" target="_blank" rel="noopener">RFS</a> to control its font size. RFS is an SCSS-mixin which automatically calculates the correct font size based on the browsers screen width. You just have got to define your font size for big screens and the font size will automatically decrease for smaller screens.

### How to use
The RFS-mixin accepts as well numbers (eg. `20`) as numbers with `px`-suffix (eg `20px`). On all other values (like 50%, 1.2em, inherit,...) no fluid rescaling is applied.
{% highlight scss %}
.post-title {
  @include rfs(20);
}
{% endhighlight %}

With the SCSS-input of above, the following css will be generated:
{% highlight css %}
.post-title {
  font-size: 20px;
}
@media (max-width: 1200px) {
  .post-title {
    font-size: calc(13.6px + 0.53333vw);
  }
}
{% endhighlight %}

### Changing the responsive font size configuration
In the following examples of the configuration, the same input is used:
{% highlight scss %}
.post-title {
  @include rfs(20);
}
{% endhighlight %}

#### $rfs-minimum-font-size
Font sizes which are calculated by RFS will never be lower than this size. However, you can still pass a smaller font size to RFS, but then RFS won't dynamically scale this font size.

`$rfs-minimum-font-size: 14` :
{% highlight css %}
.post-title {
  font-size: 20px;
}
@media (max-width: 1200px) {
  .post-title {
    font-size: calc(15.2px + 0.4vw);
  }
}
{% endhighlight %}

#### $rfs-minimum-font-size-unit
This is the unit in which the css is rendered. Possible units are `px` and `rem`. This setting doesn't influence $rfs-minimum-font-size, which will always be configured in px.

`$rfs-minimum-font-size-unit: rem` :
{% highlight css %}
.post-title {
  font-size: 1.25rem;
}
@media (max-width: 1200px) {
  .post-title {
    font-size: calc(0.85rem + 0.53333vw);
  }
}
{% endhighlight %}

#### $rfs-breakpoint
Above this breakpoint, the font size will be equal to the font size you passed to the mixin, below this breakpoint, font-sizes will dynamically scale down.

`$rfs-breakpoint: 1000px` :
{% highlight css %}
.post-title {
  font-size: 20px;
}
@media (max-width: 1000px) {
  .post-title {
    font-size: calc(13.6px + 0.64vw);
  }
}
{% endhighlight %}

#### $rfs-breakpoint-unit
The width of `$rfs-breakpoint` will be rendered in this unit. Possible units are `px`, `em` and `rem`. This setting doesn't influence `$rfs-breakpoint`, which will always be configured in `px`.

`$rfs-breakpoint-unit: em` :
{% highlight css %}
.post-title {
  font-size: 20px;
}
@media (max-width: 75em) {
  .post-title {
    font-size: calc(13.6px + 0.53333vw);
  }
}
{% endhighlight %}

#### $rfs-factor
This factor determines the influence of RFS. The lower this value, the less difference between the font size on small and wide screens. The higher this value, the more difference between small and wide screens. Be aware that the higher this value is, the less difference there is between the fontsizes of titles and text on small screens.

`$rfs-factor: 10` :
{% highlight css %}
.post-title {
  font-size: 20px;
}
@media (max-width: 1200px) {
  .post-title {
    font-size: calc(12.8px + 0.6vw);
  }
}
{% endhighlight %}


## Disable responsive font sizes
Responsive font sizes can easily be disabled by setting `$enable-responsive-font-sizes` to `false`.

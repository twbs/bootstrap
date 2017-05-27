---
layout: docs
title: Spacing
group: utilities
---

Assign responsive-friendly `margin` or `padding` values to an element or a subset of its sides with shorthand classes. Includes support for individual properties, all properties, and vertical and horizontal properties. Classes are built from a default Sass map ranging from `.25rem` to `3rem`.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Notation

Spacing utilities that apply to all breakpoints, from `xs` to `xl`, have no breakpoint abbreviation in them. This is because those classes are applied from `min-width: 0` and up, and thus are not bound by a media query. The remaining breakpoints, however, do include a breakpoint abbreviation.

The classes are named using the format `{property}{sides}-{size}` for `xs` and `{property}{sides}-{breakpoint}-{size}` for `sm`, `md`, `lg`, and `xl`.

Where *property* is one of:

* `m` - for classes that set `margin`
* `p` - for classes that set `padding`

Where *sides* is one of:

* `t` - for classes that set `margin-top` or `padding-top`
* `b` - for classes that set `margin-bottom` or `padding-bottom`
* `l` - for classes that set `margin-left` or `padding-left`
* `r` - for classes that set `margin-right` or `padding-right`
* `x` - for classes that set both `*-left` and `*-right`
* `y` - for classes that set both `*-top` and `*-bottom`
* blank - for classes that set a `margin` or `padding` on all 4 sides of the element

Where *size* is one of:

* `0` - for classes that eliminate the `margin` or `padding` by setting it to `0`
* `1` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * .25` or `$spacer-y * .25`
* `2` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * .5` or `$spacer-y * .5`
* `3` - (by default) for classes that set the `margin` or `padding` to `$spacer-x` or `$spacer-y`
* `4` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * 1.5` or `$spacer-y * 1.5`
* `5` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * 3` or `$spacer-y * 3`

(You can add more sizes by adding entries to the `$spacers` Sass map variable.)

## Examples

Here are some representative examples of these classes:

{% highlight scss %}
.mt-0 {
  margin-top: 0 !important;
}

.ml-1 {
  margin-left: ($spacer-x * .25) !important;
}

.px-2 {
  padding-left: ($spacer-x * .5) !important;
  padding-right: ($spacer-x * .5) !important;
}

.p-3 {
  padding: $spacer-y $spacer-x !important;
}
{% endhighlight %}

### Horizontal centering
Additionally, Bootstrap also includes an `.mx-auto` class for horizontally centering fixed-width block level content—that is, content that has `display: block` and a `width` set—by setting the horizontal margins to `auto`.

<div class="bd-example">
  <div class="mx-auto" style="width: 200px; background-color: rgba(86,61,124,.15);">
    Centered element
  </div>
</div>

{% highlight html %}
<div class="mx-auto" style="width: 200px;">
  Centered element
</div>
{% endhighlight %}

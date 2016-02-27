---
layout: docs
title: Flexbox grid system
group: layout
---

Fancy a more modern grid system? [Enable flexbox support in Bootstrap](/getting-started/flexbox) to take full advantage of CSS's Flexible Box module for even more control over your site's layout, alignment, and distribution of content.

Bootstrap's flexbox grid includes support for every feature from our [default grid system](/layout/grid), and then some. Please read the [default grid system docs](/layout/grid) before proceeding through this page. Features that are covered there are only summarized here. Please note that **Internet Explorer 9 does not support flexbox**, so proceed with caution when enabling it.

{% callout warning %}
**Heads up!** The flexbox grid documentation is only functional when flexbox support is explicitly enabled.
{% endcallout %}

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## How it works

The flexbox grid system behaves similar to our default grid system, but with a few notable differences:

- [Grid mixins](/layout/grid#sass-mixins) and [predefined classes](/layout/grid#predefined-classes) include support for flexbox. Just [enable flexbox support](/getting-started/flexbox) to utilize them as you would otherwise.
- Nesting, offsets, pushes, and pulls are all supported in the flexbox grid system.
- Flexbox grid columns without a set width will automatically layout with equal widths. For example, four columns will each automatically be 25% wide.
- Flexbox grid columns have significantly more alignment options available, including vertical alignment.
- Unlike the default grid system where a grid column starts as full-width in the `xs` tier, flexbox requires a `.col-{breakpoint}` class for each tier.

Chill? Awesome—keep reading for more information and some code snippets.

## Auto-layout columns

When flexbox support is enabled, you can utilize breakpoint-specific column classes for equal-width columns. Add any number of `.col-{breakpoint}`s for each breakpoint you need and you're good to go. For example, here's are two grid layouts that apply to every device and viewport possible.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col-xs">
      1 of 2
    </div>
    <div class="col-xs">
      1 of 2
    </div>
  </div>
  <div class="row">
    <div class="col-xs">
      1 of 3
    </div>
    <div class="col-xs">
      1 of 3
    </div>
    <div class="col-xs">
      1 of 3
    </div>
  </div>
</div>
{% endexample %}
</div>

Auto-layout for flexbox grid columns also means you can set the width of one column and the others will automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col-xs">
      1 of 3
    </div>
    <div class="col-xs-6">
      2 of 3 (wider)
    </div>
    <div class="col-xs">
      3 of 3
    </div>
  </div>
</div>
{% endexample %}
</div>

## Responsive flexbox

Unlike the default grid system, the flexbox grid requires a class for full-width columns. If you have a `.col-sm-6` and don't add `.col-xs-12`, your `xs` grid will not render correctly. Note that flexbox grid tiers still scale up across breakpoints, so if you want two 50% wide columns across `sm`, `md`, and `lg`, you only need to set `.col-sm-6`.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      1 of 2 (stacked on mobile)
    </div>
    <div class="col-xs-12 col-sm-6">
      1 of 2 (stacked on mobile)
    </div>
  </div>
</div>
{% endexample %}
</div>

## Vertical alignment

Use the flexbox alignment utilities to vertically align columns.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row flex-items-xs-top">
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
  </div>
  <div class="row flex-items-xs-middle">
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
  </div>
  <div class="row flex-items-xs-bottom">
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
    <div class="col-xs">
      One of three columns
    </div>
  </div>
</div>
{% endexample %}
</div>

<div class="bd-example-row bd-example-row-flex-cols">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col-xs flex-xs-top">
      One of three columns
    </div>
    <div class="col-xs flex-xs-middle">
      One of three columns
    </div>
    <div class="col-xs flex-xs-bottom">
      One of three columns
    </div>
  </div>
</div>
{% endexample %}
</div>

## Horizontal alignment

Flexbox utilities for horizontal alignment also exist for a number of layout options.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row flex-items-xs-left">
    <div class="col-xs-4">
      One of two columns
    </div>
    <div class="col-xs-4">
      One of two columns
    </div>
  </div>
  <div class="row flex-items-xs-center">
    <div class="col-xs-4">
      One of two columns
    </div>
    <div class="col-xs-4">
      One of two columns
    </div>
  </div>
  <div class="row flex-items-xs-right">
    <div class="col-xs-4">
      One of two columns
    </div>
    <div class="col-xs-4">
      One of two columns
    </div>
  </div>
  <div class="row flex-items-xs-around">
    <div class="col-xs-4">
      One of two columns
    </div>
    <div class="col-xs-4">
      One of two columns
    </div>
  </div>
  <div class="row flex-items-xs-between">
    <div class="col-xs-4">
      One of two columns
    </div>
    <div class="col-xs-4">
      One of two columns
    </div>
  </div>
</div>
{% endexample %}
</div>

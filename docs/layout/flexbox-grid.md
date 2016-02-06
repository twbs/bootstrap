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
- Flexbox grid columns without a set width will automatically layout with even widths. For example, four columns will each automatically be 25% wide.
- Flexbox grid columns have significantly more alignment options available, including vertical alignment.

Chill? Awesome—keep reading for more information and some code snippets.

## Auto-layout columns

As mentioned above, flexbox grid columns will automatically layout with even widths. Add any number of `.col`s and you're good to go.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
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
    <div class="col">
      One of three columns
    </div>
    <div class="col col-md-6">
      One of three columns
    </div>
    <div class="col">
      One of three columns
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
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
  <div class="row flex-items-xs-center">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
  <div class="row flex-items-xs-bottom">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
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
    <div class="col flex-xs-top">
      One of three columns
    </div>
    <div class="col flex-xs-center">
      One of three columns
    </div>
    <div class="col flex-xs-bottom">
      One of three columns
    </div>
  </div>
</div>
{% endexample %}
</div>

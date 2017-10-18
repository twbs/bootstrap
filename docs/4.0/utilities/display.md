---
layout: docs
title: Display property
description: Quickly and responsively toggle the display value of components and more with our display utilities. Includes support for some of the more common values, as well as some extras for controlling display when printing.
group: utilities
toc: true
---

## How it Works

Change the `display` value of elements with our responsive-friendly display utility classes.

The [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property accepts lots of values, and we support many of them with utility classes. We purposefully don't provide them all.

## Notation

The classes are named using the format 
* `d-{display}` - for all content
* `d-{breakpoint}-{display}` - ** for the named breakpoint ( `sm`, `md`, `lg`, `xl`) and above.**

Where *display* is one of:

* `none`
* `inline`
* `inline-block`
* `block`
* `table`
* `table-cell`
* `flex`
* `inline-flex`

For example, `d-lg-none` sets `display:none` on screens larger than the lg breakpoint.

Combine these classes to get the effect you need.

## Examples

{% example html %}
<div class="d-inline bg-success">d-inline</div>
<div class="d-inline bg-success">d-inline</div>
{% endexample %}

{% example html %}
<span class="d-block bg-primary">d-block</span>
<span class="d-block bg-primary">d-block</span>
{% endexample %}

## Hiding Elements

For faster mobile-friendly development, use responsive display classes for showing and hiding elements by device. Avoid creating entirely different versions of the same site, instead hide element responsively for each screen size.

To hide elements simply use the `.d-none` class or one of the `.d-{sm,md,lg,xl}-none` classes for any responsive screen variation.

To show an element only on a given interval of screen sizes you can combine one `.d-*-none` class with a `.d-*-*` class, for example `.d-none.d-md-block.d-xl-none` will hide the element for all screen sizes except on medium and large devices.

| Screen Size        | Class |
| ---                | --- |
| Hidden on all      | `d-none` |
| Hidden only on xs  | `d-none d-sm-block` |
| Hidden only on sm  | `d-sm-none d-md-block` |
| Hidden only on md  | `d-md-none d-lg-block` |
| Hidden only on lg  | `d-lg-none d-xl-block` |
| Hidden only on xl  | `d-xl-none` |
| Visible on all     | `d-block` |
| Visible only on xs | `d-block d-sm-none` |
| Visible only on sm | `d-none d-sm-block d-md-none` |
| Visible only on md | `d-none d-md-block d-lg-none` |
| Visible only on lg | `d-none d-lg-block d-xl-none` |
| Visible only on xl | `d-none d-xl-block` |

{% example html %}
<div class="d-lg-none">hide on screens wider than lg</div>
<div class="d-none d-lg-block">hide on screens smaller than lg</div>
{% endexample %}

## Display in print

Change the `display` value of elements when printing with our print display utility classes.

| Class | Print style |
| --- | --- |
| `.d-print-block` | Applies `display: block` to the element when printing |
| `.d-print-inline` | Applies `display: inline` to the element when printing |
| `.d-print-inline-block` | Applies `display: inline-block` to the element when printing |
| `.d-print-none` | Applies `display: none` to the element when printing |

The print and display classes can be combined.

{% example html %}
<div class="d-print-none">Screen Only (hide on print)</div>
<div class="d-none d-print-block">Print Only (hide on screen)</div>
<div class="d-none d-lg-block d-print-block">(lg or wider) screen and print only. Hide on smaller than lg screen.</div>
{% endexample %}

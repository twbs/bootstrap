---
layout: docs
title: Display property
description: Quickly and responsively toggle the display value of components and more with our display utilities. Includes support for some of the more common values, as well as some extras for controlling display when printing.
group: utilities
toc: true
---

## Common `display` values

The [`display` property](https://developer.mozilla.org/en-US/docs/Web/CSS/display) accepts a handful of values and we support many of them with utility classes. We purposefully don't provide every value as a utility, so here's what we support:

- `.d-none`
- `.d-inline`
- `.d-inline-block`
- `.d-block`
- `.d-table`
- `.d-table-cell`
- `.d-flex`
- `.d-inline-flex`

Put them to use by applying any of the classes to an element of your choice. For example, here's how you could use the inline, block, or inline-block utilities (the same applies to the other classes).

{% example html %}
<div class="d-inline bg-success">d-inline</div>
<div class="d-inline bg-success">d-inline</div>
{% endexample %}

{% example html %}
<span class="d-block bg-primary">d-block</span>
{% endexample %}

{% example html %}
<div class="d-inline-block bg-warning">d-inline-block</div>
<div class="d-inline-block bg-warning">d-inline-block</div>
{% endexample %}

Responsive variations also exist for every single utility mentioned above.

{% for bp in site.data.breakpoints %}
- `.d{{ bp.abbr }}-none`
- `.d{{ bp.abbr }}-inline`
- `.d{{ bp.abbr }}-inline-block`
- `.d{{ bp.abbr }}-block`
- `.d{{ bp.abbr }}-table`
- `.d{{ bp.abbr }}-table-cell`
- `.d{{ bp.abbr }}-flex`
- `.d{{ bp.abbr }}-inline-flex`{% endfor %}

## Hiding Elements

To hide elements simply use the `.d-none` class or one of the `.d-{sm,md,lg,xl}-none` classes for any responsive screen variation.

To show an element only on a given interval of screen sizes you can combine one `.d-*-none` class with a `.d-*-block` class, for example `.d-none.d-md-block.d-xl-none` will hide the element for all screen sizes but it will shows it only on medium and large devices.

## Display in print

Change the `display` value of elements when printing with our print display utilities.

| Class | Print style |
| --- | --- |
| `.d-print-block` | Applies `display: block` to the element when printing |
| `.d-print-inline` | Applies `display: inline` to the element when printing |
| `.d-print-inline-block` | Applies `display: inline-block` to the element when printing |
| `.d-print-none` | Applies `display: none` to the element when printing |

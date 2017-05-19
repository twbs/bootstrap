---
layout: docs
title: Display property
group: utilities
---

Quickly and responsively toggle the `display` value of components and more with our display utilities. Includes support for some of the more common values, as well as some extras for controlling `display` when printing.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Common `display` values

The [`display` property](https://developer.mozilla.org/en-US/docs/Web/CSS/display) accepts a handful of values and we support many of them with utility classes. We purposefully don't provide every value as a utility, so here's what we support:

- `.display-none`
- `.display-inline`
- `.display-inline-block`
- `.display-block`
- `.display-table`
- `.display-table-cell`
- `.display-flex`
- `.display-inline-flex`

Put them to use by applying any of the classes to an element of your choice. For example, here's how you could use the inline, block, or inline-block utilities (the same applies to the other classes).

{% example html %}
<div class="display-inline bg-success">display-inline</div>
<div class="display-inline bg-success">display-inline</div>
{% endexample %}

{% example html %}
<span class="display-block bg-primary">display-block</span>
{% endexample %}

{% example html %}
<div class="display-inline-block bg-warning">display-inline-block</div>
<div class="display-inline-block bg-warning">display-inline-block</div>
{% endexample %}

Responsive variations also exist for every single utility mentioned above.

{% for bp in site.data.breakpoints %}
- `.display{{ bp.abbr }}-none`
- `.display{{ bp.abbr }}-inline`
- `.display{{ bp.abbr }}-inline-block`
- `.display{{ bp.abbr }}-block`
- `.display{{ bp.abbr }}-table`
- `.display{{ bp.abbr }}-table-cell`
- `.display{{ bp.abbr }}-flex`
- `.display{{ bp.abbr }}-inline-flex`{% endfor %}

## Display in print

Change the `display` value of elements when printing with our print display utilities.

| Class | Print style |
| --- | --- |
| `.display-print-block` | Applies `display: block` to the element when printing |
| `.display-print-inline` | Applies `display: inline` to the element when printing |
| `.display-print-inline-block` | Applies `display: inline-block` to the element when printing |
| `.display-print-none` | Applies `display: none` to the element when printing |

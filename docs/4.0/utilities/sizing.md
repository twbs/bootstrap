---
layout: docs
title: Sizing
description: Easily make an element as wide or as tall (relative to its parent) with our width and height utilities.
group: utilities
toc: true
---

## Overview

Width and height utilities are generated from the `$sizes` Sass map in `_variables.scss`. Includes support for `25%`, `50%`, `75%`, and `100%` by default. Modify those values as you need to generate different sizing utilities.

## Notation

Sizing utilities are named using the format `{property}-{size}` for `xs` and `{property}-{breakpoint}-{size}` for `sm`, `md`, `lg`, and `xl`.

Where *property* is one of:

* `w` - for classes that set `width`
* `h` - for classes that set `height`

Where *size* is one of:

* `25` - (by default) for classes that set the `width` or `height` to `25%`
* `50` - (by default) for classes that set the `width` or `height` to `50%`
* `75` - (by default) for classes that set the `width` or `height` to `75%`
* `100` - (by default) for classes that set the `width` or `height` to `100%`

(You can add more sizes by adding entries to the `$sizes` Sass map in `_variables.scss`)

## Examples

{% example html %}
<div class="w-25 p-3" style="background-color: #eee;">Width 25%</div>
<div class="w-50 p-3" style="background-color: #eee;">Width 50%</div>
<div class="w-75 p-3" style="background-color: #eee;">Width 75%</div>
<div class="w-100 p-3" style="background-color: #eee;">Width 100%</div>
{% endexample %}

{% example html %}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="h-25 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 25%</div>
  <div class="h-50 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 50%</div>
  <div class="h-75 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 75%</div>
  <div class="h-100 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 100%</div>
</div>
{% endexample %}

You can also use `max-width: 100%;` and `max-height: 100%;` utilities as needed.

{% example html %}
<img class="mw-100" data-src="holder.js/1000px100?text=Max-width%20%3D%20100%25" alt="Max-width 100%">
{% endexample %}

{% example html %}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="mh-100" style="width: 100px; height: 200px; background-color: rgba(0,0,255,0.1);">Max-height 100%</div>
</div>
{% endexample %}

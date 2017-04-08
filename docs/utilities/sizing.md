---
layout: docs
title: Sizing
group: utilities
---

Easily make an element as tall (relative to its parent) with our height utilities. Includes support for `25%`, `50%`, `75%`, and `100%` by default. Mix and match with our existing grid classes for controlling `width`.

Height utilities are generated from the `$sizes` Sass map in `_variables.scss`. Modify those values as you need to generate different utilities here.

{% example html %}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="h-25 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 25%</div>
  <div class="h-50 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 50%</div>
  <div class="h-75 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 75%</div>
  <div class="h-100 d-inline-block" style="width: 120px; background-color: rgba(0,0,255,.1)">Height 100%</div>
</div>
{% endexample %}

Use `max-width: 100%;` and `max-height: 100%;` utilities as needed.

{% example html %}
<img class="mw-100" data-src="holder.js/1000px100?text=Max-width%20%3D%20100%25" alt="Max-width 100%">
{% endexample %}

{% example html %}
<div style="height: 100px; background-color: rgba(255,0,0,0.1);">
  <div class="mh-100" style="width: 100px; height: 200px; background-color: rgba(0,0,255,0.1);">Max-height 100%</div>
</div>
{% endexample %}

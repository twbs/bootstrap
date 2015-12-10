---
layout: docs
title: Labels
group: components
---

Small and adaptive tag for adding context to just about any content.

## Example

Labels scale to match the size of the immediate parent element by using relative font sizing and `em` units.

{% example html %}
<h1>Example heading <span class="label label-default">New</span></h1>
<h2>Example heading <span class="label label-default">New</span></h2>
<h3>Example heading <span class="label label-default">New</span></h3>
<h4>Example heading <span class="label label-default">New</span></h4>
<h5>Example heading <span class="label label-default">New</span></h5>
<h6>Example heading <span class="label label-default">New</span></h6>
{% endexample %}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a label.

{% example html %}
<span class="label label-default">Default</span>
<span class="label label-primary">Primary</span>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Danger</span>
{% endexample %}

## Pill labels

Use the `.label-pill` modifier class to make labels more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{% example html %}
<span class="label label-pill label-default">Default</span>
<span class="label label-pill label-primary">Primary</span>
<span class="label label-pill label-success">Success</span>
<span class="label label-pill label-info">Info</span>
<span class="label label-pill label-warning">Warning</span>
<span class="label label-pill label-danger">Danger</span>
{% endexample %}

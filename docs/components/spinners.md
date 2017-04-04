---
layout: docs
title: Spinners
group: components
redirect_from: "/components/"
---

Use Bootstrap's custom spinners to show loading state for page, components, elements, and more. Includes support for a handful of contextual variations, sizes, states, and more.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Default Spinner

Bootstrap includes spinners which can be used to reflect loading state of the component.

{% example html %}
<div class="spinner" role="progressbar">Loading</div>
{% endexample %}

## Sizes

Need different sizes? Spinners include standard Bootstrap's sizing! Add `.spinner-lg`, `.spinner-sm` or `.spinner-xs` for additional sizes.

{% example html %}
<!-- Large Spinner -->
<div class="spinner spinner-lg" role="progressbar">Loading</div>
{% endexample %}

{% example html %}
<!-- Small Spinner -->
<div class="spinner spinner-sm" role="progressbar">Loading</div>
{% endexample %}

{% example html %}
<!-- Extra Small Spinner -->
<div class="spinner spinner-xs" role="progressbar">Loading</div>
{% endexample %}

## Positioning

Spinners can be positioned in three different ways.

### Default

The default positioning centers spinner horizontally within parent container.

{% example html %}
<div class="spinner" role="progressbar">Loading</div>
{% endexample %}

### Center

It is possible to center spinner both horizontally and vertically by setting a `spinner-center` class.

{% example html %}
<div style="height: 200px">
  <div class="spinner spinner-center" role="progressbar">Loading</div>
</div>
{% endexample %}

### Inline

To create inline positioned spinner just add `spinner-inline` class.
 
{% example html %}
<div class="spinner spinner-inline" role="progressbar">Loading</div>
{% endexample %}

{% callout info %}
#### Incorrect positioning

In case of incorrect positioning try adding `position` property to the parent container. 
{% endcallout %}

## Variations

Spinners come with few styling variations. Just add corresponding CSS class.

### Circle (default)

{% example html %}
<div class="spinner" role="progressbar">Loading</div>
{% endexample %}

### Comet

{% example html %}
<div class="spinner spinner-comet" role="progressbar">Loading</div>
{% endexample %}

### Hourglass

{% example html %}
<div class="spinner spinner-hourglass" role="progressbar">Loading</div>
{% endexample %}

### Dots

{% example html %}
<div class="spinner spinner-dots" role="progressbar">Loading</div>
{% endexample %}

## Styles

Spinners implement Bootstrap's six styles to represent context.

### Light background

Spinner is primary styled for containers with light background.

#### Default

{% example html %}
<div class="spinner spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-inline spinner-comet" role="progressbar">Loading</div>
<div class="spinner spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

#### Primary

{% example html %}
<div class="spinner spinner-primary spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-primary spinner-inline spinner-comet spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-primary spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-primary spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

#### Success

{% example html %}
<div class="spinner spinner-success spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-success spinner-inline spinner-comet" role="progressbar">Loading</div>
<div class="spinner spinner-success spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-success spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

#### Info

{% example html %}
<div class="spinner spinner-info spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-info spinner-inline spinner-comet" role="progressbar">Loading</div>
<div class="spinner spinner-info spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-info spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

#### Warning

{% example html %}
<div class="spinner spinner-warning spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-warning spinner-inline spinner-comet" role="progressbar">Loading</div>
<div class="spinner spinner-warning spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-warning spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

#### Danger

{% example html %}
<div class="spinner spinner-danger spinner-inline" role="progressbar">Loading</div>
<div class="spinner spinner-danger spinner-inline spinner-comet" role="progressbar">Loading</div>
<div class="spinner spinner-danger spinner-inline spinner-hourglass" role="progressbar">Loading</div>
<div class="spinner spinner-danger spinner-inline spinner-dots" role="progressbar">Loading</div>
{% endexample %}

### Dark background

Currently only white color for spinner is supported for dark backgrounds. To create white spinner just 
add `spinner-white` class.

{% example html %}
<div style="background: #333; padding: 15px 5px">
  <div class="spinner spinner-white spinner-inline" role="progressbar">Loading</div>
  <div class="spinner spinner-white spinner-inline spinner-comet" role="progressbar">Loading</div>
  <div class="spinner spinner-white spinner-inline spinner-hourglass" role="progressbar">Loading</div>
  <div class="spinner spinner-white spinner-inline spinner-dots" role="progressbar">Loading</div>
</div>

{% endexample %}

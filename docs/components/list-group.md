---
layout: docs
title: List group
description: Learn about Bootstrap's list group component for rendering series of related content.
group: components
---

List groups are a flexible and powerful component for displaying not only simple lists of elements, but complex ones with custom content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basic example
The most basic list group is simply an unordered list with list items, and the proper classes. Build upon it with the options that follow, or your own CSS as needed.

{% example html %}
<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
{% endexample %}

## Tags

Add tags to any list group item to show unread counts, activity, etc.

{% example html %}
<ul class="list-group">
  <li class="list-group-item">
    <span class="tag tag-default tag-pill float-xs-right">14</span>
    Cras justo odio
  </li>
  <li class="list-group-item">
    <span class="tag tag-default tag-pill float-xs-right">2</span>
    Dapibus ac facilisis in
  </li>
  <li class="list-group-item">
    <span class="tag tag-default tag-pill float-xs-right">1</span>
    Morbi leo risus
  </li>
</ul>
{% endexample %}

## Disabled items

Add `.disabled` to a `.list-group-item` to gray it out to appear disabled.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item disabled">
    Cras justo odio
  </a>
  <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item">Morbi leo risus</a>
  <a href="#" class="list-group-item">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item">Vestibulum at eros</a>
</div>
{% endexample %}

## Anchors and buttons

Use anchors or buttons to create actionable list group items with hover, disabled, and active states by adding `.list-group-item-action`. This separate class contains a few overrides to add compatibility for `<a>`s and `<button>`s, as well as the hover and focus states.

Be sure to **not use the standard `.btn` classes here**.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item active">
    Cras justo odio
  </a>
  <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item list-group-item-action">Morbi leo risus</a>
  <a href="#" class="list-group-item list-group-item-action">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item list-group-item-action disabled">Vestibulum at eros</a>
</div>
{% endexample %}

{% example html %}
<div class="list-group">
  <button type="button" class="list-group-item list-group-item-action active">
    Cras justo odio
  </button>
  <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
  <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
  <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
  <button type="button" class="list-group-item list-group-item-action disabled">Vestibulum at eros</button>
</div>
{% endexample %}

## Contextual classes

Use contextual classes to style list items, default or linked. Also includes `.active` state.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action list-group-item-success">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-info">Cras sit amet nibh libero</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-warning">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-danger">Vestibulum at eros</a>
</div>
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Custom content

Add nearly any HTML within, even for linked list groups like the one below.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">
    <h5 class="list-group-item-heading">List group item heading</h5>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
  <a href="#" class="list-group-item list-group-item-action">
    <h5 class="list-group-item-heading">List group item heading</h5>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
  <a href="#" class="list-group-item list-group-item-action">
    <h5 class="list-group-item-heading">List group item heading</h5>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
</div>
{% endexample %}

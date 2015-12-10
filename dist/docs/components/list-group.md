---
layout: docs
title: List group
group: components
---

List groups are a flexible and powerful component for displaying not only simple lists of elements, but complex ones with custom content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basic example
<p>The most basic list group is simply an unordered list with list items, and the proper classes. Build upon it with the options that follow, or your own CSS as needed.</p>

{% example html %}
<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
{% endexample %}

## Labels

Add labels to any list group item to show unread counts, activity, etc.

{% example html %}
<ul class="list-group">
  <li class="list-group-item">
    <span class="label label-default label-pill pull-xs-right">14</span>
    Cras justo odio
  </li>
  <li class="list-group-item">
    <span class="label label-default label-pill pull-xs-right">2</span>
    Dapibus ac facilisis in
  </li>
  <li class="list-group-item">
    <span class="label label-default label-pill pull-xs-right">1</span>
    Morbi leo risus
  </li>
</ul>
{% endexample %}

## Linked items

Linkify list group items by using anchor tags instead of list items (that also means a parent `<div>` instead of an `<ul>`). No need for individual parents around each element.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item active">
    Cras justo odio
  </a>
  <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item">Morbi leo risus</a>
  <a href="#" class="list-group-item">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item">Vestibulum at eros</a>
</div>
{% endexample %}

## Button items

List group items may be buttons instead of list items (that also means a parent `<div>` instead of an `<ul>`). No need for individual parents around each element. **Don't use the standard `.btn` classes here.**

{% example html %}
<div class="list-group">
  <button type="button" class="list-group-item">Cras justo odio</button>
  <button type="button" class="list-group-item">Dapibus ac facilisis in</button>
  <button type="button" class="list-group-item">Morbi leo risus</button>
  <button type="button" class="list-group-item">Porta ac consectetur ac</button>
  <button type="button" class="list-group-item">Vestibulum at eros</button>
</div>
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

## Contextual classes

Use contextual classes to style list items, default or linked. Also includes `.active` state.

{% example html %}
<ul class="list-group">
  <li class="list-group-item list-group-item-success">Dapibus ac facilisis in</li>
  <li class="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
  <li class="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
  <li class="list-group-item list-group-item-danger">Vestibulum at eros</li>
</ul>
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item list-group-item-info">Cras sit amet nibh libero</a>
  <a href="#" class="list-group-item list-group-item-warning">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
</div>
{% endexample %}

## Custom content

Add nearly any HTML within, even for linked list groups like the one below.

{% example html %}
<div class="list-group">
  <a href="#" class="list-group-item active">
    <h4 class="list-group-item-heading">List group item heading</h4>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
  <a href="#" class="list-group-item">
    <h4 class="list-group-item-heading">List group item heading</h4>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
  <a href="#" class="list-group-item">
    <h4 class="list-group-item-heading">List group item heading</h4>
    <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
  </a>
</div>
{% endexample %}

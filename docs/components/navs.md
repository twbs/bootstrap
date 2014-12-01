---
layout: page
title: Navs
---

Navigation available in Bootstrap share general markup and styles, from the base `.nav` class to the active and disabled states. Swap modifier classes to switch between each style.

## Regarding accessibility

If you are using navs to provide a navigation bar, be sure to add a `role="navigation"` to the most logical parent container of the `<ul>`, or wrap a `<nav>` element around the whole navigation. Do not add the role to the `<ul>` itself, as this would prevent it from being announced as an actual list by assistive technologies.

## Base nav

Roll your own navigation style by extending the base `.nav` component. All Bootstrap's nav components are built on top of this. Includes styles for the disabled state, but **not the active state**.

{% example html %}
<ul class="nav">
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Another link</a>
  </li>
  <li class="nav-item disabled">
    <a class="nav-link" href="#">Disabled</a>
  </li>
</ul>
{% endexample %}

Classes are used throughout, so your markup can be super flexible. Use `<ul>`s like above, or roll your own with say a `<nav>` element.

{% example html %}
<nav class="nav">
  <a class="nav-link active" href="#">Active</a>
  <a class="nav-link" href="#">Link</a>
  <a class="nav-link" href="#">Another link</a>
  <a class="nav-link disabled" href="#">Disabled</a>
</nav>
{% endexample %}

## Tabs

Takes the basic nav from above and adds the `.nav-tabs` class to generate a tabbed interface. Use them to create tabbable regions with our [tab JavaScript plugin](../javascript/tabs).

{% example html %}
<ul class="nav nav-tabs">
  <li class="nav-item active" role="presentation">
    <a href="#" class="nav-link">Active</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Link</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Another link</a>
  </li>
  <li class="nav-item disabled" role="presentation">
    <a href="#" class="nav-link">Disabled</a>
  </li>
</ul>
{% endexample %}

## Pills

Take that same HTML, but use `.nav-pills` instead:

{% example html %}
<ul class="nav nav-pills">
  <li class="nav-item active" role="presentation">
    <a href="#" class="nav-link">Active</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Link</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Another link</a>
  </li>
  <li class="nav-item disabled" role="presentation">
    <a href="#" class="nav-link">Disabled</a>
  </li>
</ul>
{% endexample %}

## Stacked pills

Just add `.nav-stacked` to the `.nav.nav-pills`.

{% example html %}
<ul class="nav nav-pills nav-stacked">
  <li class="nav-item active" role="presentation">
    <a href="#" class="nav-link">Active</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Link</a>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Another link</a>
  </li>
  <li class="nav-item disabled" role="presentation">
    <a href="#" class="nav-link">Disabled</a>
  </li>
</ul>
{% endexample %}

## Using dropdowns

Add dropdown menus with a little extra HTML and the [dropdowns JavaScript plugin]({{ site.baseurl }}javascript/#dropdowns).

### Tabs with dropdowns

{% example html %}
<ul class="nav nav-tabs">
  <li class="nav-item active" role="presentation">
    <a href="#" class="nav-link">Active</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
    <ul class="dropdown-menu" role="menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Another link</a>
  </li>
  <li class="nav-item disabled" role="presentation">
    <a href="#" class="nav-link">Disabled</a>
  </li>
</ul>
{% endexample %}

### Pills with dropdowns

{% example html %}
<ul class="nav nav-pills">
  <li class="nav-item active" role="presentation">
    <a href="#" class="nav-link">Active</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
    <ul class="dropdown-menu" role="menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </li>
  <li class="nav-item" role="presentation">
    <a href="#" class="nav-link">Another link</a>
  </li>
  <li class="nav-item disabled" role="presentation">
    <a href="#" class="nav-link">Disabled</a>
  </li>
</ul>
{% endexample %}

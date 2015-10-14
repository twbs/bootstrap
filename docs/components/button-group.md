---
layout: docs
title: Button group
group: components
---

Group a series of buttons together on a single line with the button group. Add on optional JavaScript radio and checkbox style behavior with [our buttons plugin](../javascript/#buttons).

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basic example

Wrap a series of buttons with `.btn` in `.btn-group`.

{% example html %}
<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-secondary">Left</button>
  <button type="button" class="btn btn-secondary">Middle</button>
  <button type="button" class="btn btn-secondary">Right</button>
</div>
{% endexample %}

## Button toolbar

Combine sets of button groups into button toolbars for more complex components.

{% example html %}
<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div class="btn-group" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
    <button type="button" class="btn btn-secondary">4</button>
  </div>
  <div class="btn-group" role="group" aria-label="Second group">
    <button type="button" class="btn btn-secondary">5</button>
    <button type="button" class="btn btn-secondary">6</button>
    <button type="button" class="btn btn-secondary">7</button>
  </div>
  <div class="btn-group" role="group" aria-label="Third group">
    <button type="button" class="btn btn-secondary">8</button>
  </div>
</div>
{% endexample %}

## Sizing

Instead of applying button sizing classes to every button in a group, just add `.btn-group-*` to each `.btn-group`, including each one when nesting multiple groups.

<div class="bd-example">
  <div class="btn-group btn-group-lg" role="group" aria-label="Large button group">
    <button type="button" class="btn btn-secondary">Left</button>
    <button type="button" class="btn btn-secondary">Middle</button>
    <button type="button" class="btn btn-secondary">Right</button>
  </div>
  <br>
  <div class="btn-group" role="group" aria-label="Default button group">
    <button type="button" class="btn btn-secondary">Left</button>
    <button type="button" class="btn btn-secondary">Middle</button>
    <button type="button" class="btn btn-secondary">Right</button>
  </div>
  <br>
  <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
    <button type="button" class="btn btn-secondary">Left</button>
    <button type="button" class="btn btn-secondary">Middle</button>
    <button type="button" class="btn btn-secondary">Right</button>
  </div>
  <br>
  <div class="btn-group btn-group-xs" role="group" aria-label="Extra small button group">
    <button type="button" class="btn btn-secondary">Left</button>
    <button type="button" class="btn btn-secondary">Middle</button>
    <button type="button" class="btn btn-secondary">Right</button>
  </div>
</div>

{% highlight html %}
<div class="btn-group btn-group-lg" role="group" aria-label="...">...</div>
<div class="btn-group" role="group" aria-label="...">...</div>
<div class="btn-group btn-group-sm" role="group" aria-label="...">...</div>
<div class="btn-group btn-group-xs" role="group" aria-label="...">...</div>
{% endhighlight %}

## Nesting

Place a `.btn-group` within another `.btn-group` when you want dropdown menus mixed with a series of buttons.

{% example html %}
<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-secondary">1</button>
  <button type="button" class="btn btn-secondary">2</button>

  <div class="btn-group" role="group">
    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropdown
    </button>
    <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
      <li><a href="#">Dropdown link</a></li>
      <li><a href="#">Dropdown link</a></li>
    </ul>
  </div>
</div>
{% endexample %}

## Vertical variation

Make a set of buttons appear vertically stacked rather than horizontally. **Split button dropdowns are not supported here.**

<div class="bd-example">
  <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
    <button type="button" class="btn btn-secondary">Button</button>
    <button type="button" class="btn btn-secondary">Button</button>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop1">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <button type="button" class="btn btn-secondary">Button</button>
    <button type="button" class="btn btn-secondary">Button</button>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop2" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop2">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop3" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop3">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop4" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop4">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
  </div>
</div>

{% highlight html %}
<div class="btn-group-vertical">
  ...
</div>
{% endhighlight %}

## Tooltips and popovers

Due to the specific implementation (and some other components), a bit of special casing is required for tooltips and popovers within button groups. **You'll have to specify the option `container: 'body'`** to avoid unwanted side effects (such as the element growing wider and/or losing its rounded corners when the tooltip or popover is triggered).

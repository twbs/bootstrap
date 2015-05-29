---
layout: page
title: Dropdowns
---

Toggleable, contextual menu for displaying lists of links. Made interactive with the included dropdown JavaScript plugin.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Wrap the dropdown's trigger and the dropdown menu within `.dropdown`, or another element that declares `position: relative;`. Then add the menu's HTML.

{% example html %}
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
    Dropdown
  </button>
  <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
    <li role="presentation">
      <a role="menuitem" tabindex="-1" href="#">Action</a>
    </li>
    <li role="presentation">
      <a role="menuitem" tabindex="-1" href="#">Another action</a>
    </li>
    <li role="presentation">
      <a role="menuitem" tabindex="-1" href="#">Something else here</a>
    </li>
  </ul>
</div>
{% endexample %}

## Alignment

By default, a dropdown menu is automatically positioned 100% from the top and along the left side of its parent. Add `.dropdown-menu-right` to a `.dropdown-menu` to right align the dropdown menu.

{% callout warning %}
#### May require additional positioning

Dropdowns are automatically positioned via CSS within the normal flow of the document. This means dropdowns may be cropped by parents with certain `overflow` properties or appear out of bounds of the viewport. Address these issues on your own as they arise.
{% endcallout %}

{% highlight html %}
<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">
  ...
</ul>
{% endhighlight %}

## Menu headers

Add a header to label sections of actions in any dropdown menu.

{% example html %}
<ul class="dropdown-menu" role="menu">
  <li role="presentation" class="dropdown-header">Dropdown header</li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Action</a>
  </li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Another action</a>
  </li>
</ul>
{% endexample %}

## Menu dividers

Separate groups of related menu items with a divider.

{% example html %}
<ul class="dropdown-menu" role="menu">
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Action</a>
  </li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Another action</a>
  </li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Something else here</a>
  </li>
  <li role="presentation" class="dropdown-divider"></li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Separated link</a>
  </li>
</ul>
{% endexample %}

## Disabled menu items

Add `.disabled` to a `<li>` in the dropdown to disable the link.

{% example html %}
<ul class="dropdown-menu" role="menu">
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Regular link</a>
  </li>
  <li role="presentation" class="disabled">
    <a role="menuitem" tabindex="-1" href="#">Disabled link</a>
  </li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">Another link</a>
  </li>
</ul>
{% endexample %}

## Usage

Via data attributes or JavaScript, the dropdown plugin toggles hidden content (dropdown menus) by toggling the `.open` class on the parent list item.

On mobile devices, opening a dropdown adds a `.dropdown-backdrop` as a tap area for closing dropdown menus when tapping outside the menu, a requirement for proper iOS support. **This means that switching from an open dropdown menu to a different dropdown menu requires an extra tap on mobile.**

Note: The `data-toggle="dropdown"` attribute is relied on for closing dropdown menus at an application level, so it's a good idea to always use it.

### Via data attributes

Add `data-toggle="dropdown"` to a link or button to toggle a dropdown.

{% highlight html %}
<div class="dropdown">
  <button id="dLabel" type="button" data-toggle="dropdown">
    Dropdown trigger
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
    ...
  </ul>
</div>
{% endhighlight %}

To keep URLs intact with link buttons, use the `data-target` attribute instead of `href="#"`.

{% highlight html %}
<div class="dropdown">
  <a id="dLabel" data-target="#" href="http://example.com" data-toggle="dropdown">
    Dropdown trigger
    <span class="caret"></span>
  </a>

  <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
    ...
  </ul>
</div>
{% endhighlight %}

### Via JavaScript

Call the dropdowns via JavaScript:

{% highlight js %}
$('.dropdown-toggle').dropdown()
{% endhighlight %}

{% callout info %}
#### `data-toggle="dropdown"` still required

Regardless of whether you call your dropdown via JavaScript or instead use the data-api, `data-toggle="dropdown"` is always required to be present on the dropdown's trigger element.
{% endcallout %}

### Options

*None.*

### Methods

#### $().dropdown('toggle')

Toggles the dropdown menu of a given navbar or tabbed navigation.

### Events

All dropdown events are fired at the `.dropdown-menu`'s parent element and have a `relatedTarget` property, whose value is the toggling anchor element.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 150px;">Event Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>show.bs.dropdown</td>
        <td>This event fires immediately when the show instance method is called.</td>
      </tr>
      <tr>
        <td>shown.bs.dropdown</td>
        <td>This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions, to complete).</td>
      </tr>
      <tr>
        <td>hide.bs.dropdown</td>
        <td>This event is fired immediately when the hide instance method has been called.</td>
      </tr>
      <tr>
        <td>hidden.bs.dropdown</td>
        <td>This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions, to complete).</td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myDropdown').on('show.bs.dropdown', function () {
  // do something…
})
{% endhighlight %}

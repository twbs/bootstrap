---
layout: page
title: Dropdowns
---

Toggleable, contextual menu for displaying lists of links. Made interactive with the [dropdown JavaScript plugin]({{ site.bsaeurl }}javascript/#dropdowns).

### Example

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

### Alignment

By default, a dropdown menu is automatically positioned 100% from the top and along the left side of its parent. Add `.dropdown-menu-right` to a `.dropdown-menu` to right align the dropdown menu.

<div class="bs-callout bs-callout-warning">
  <h4>May require additional positioning</h4>
  <p>Dropdowns are automatically positioned via CSS within the normal flow of the document. This means dropdowns may be cropped by parents with certain <code>overflow</code> properties or appear out of bounds of the viewport. Address these issues on your own as they arise.</p>
</div>

{% highlight html %}
<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">
  ...
</ul>
{% endhighlight %}

### Menu headers

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

### Menu dividers

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

### Disabled menu items

Add `.disabled` to a `<li>` in the dropdown to disable the link.

{% example html %}
<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu3">
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

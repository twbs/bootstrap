---
layout: page
title: Dropdowns
---

Add dropdown menus to nearly anything with this simple plugin, including the navbar, tabs, and pills.

### Within navbars

<div class="bs-example">
  <nav id="navbar-example" class="navbar navbar-default navbar-static" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-example-js-navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Project Name</a>
      </div>
      <div class="collapse navbar-collapse bs-example-js-navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <button id="drop1" type="button" class="dropdown-toggle" data-toggle="dropdown">
              Dropdown
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
              <li role="presentation" class="divider"></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <button id="drop2" type="button" class="dropdown-toggle" data-toggle="dropdown">
              Dropdown 2
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="drop2">
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
              <li role="presentation" class="divider"></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li id="fat-menu" class="dropdown">
            <button id="drop3" type="button" class="dropdown-toggle" data-toggle="dropdown">
              Dropdown 3
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="drop3">
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
              <li role="presentation" class="divider"></li>
              <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
            </ul>
          </li>
        </ul>
      </div><!-- /.nav-collapse -->
    </div><!-- /.container-fluid -->
  </nav> <!-- /navbar-example -->
</div> <!-- /example -->

### Within pills

<div class="bs-example">
  <ul class="nav nav-pills" role="tablist">
    <li role="presentation" class="active"><a href="#">Regular link</a></li>
    <li role="presentation" class="dropdown">
      <button id="drop4" type="button" data-toggle="dropdown">
        Dropdown
      </button>
      <ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
        <li role="presentation" class="divider"></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
      </ul>
    </li>
    <li role="presentation" class="dropdown">
      <button id="drop5" type="button" data-toggle="dropdown">
        Dropdown 2
      </button>
      <ul id="menu2" class="dropdown-menu" role="menu" aria-labelledby="drop5">
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
        <li role="presentation" class="divider"></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
      </ul>
    </li>
    <li role="presentation" class="dropdown">
      <button id="drop6" type="button" data-toggle="dropdown">
        Dropdown 3
      </button>
      <ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Another action</a></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Something else here</a></li>
        <li role="presentation" class="divider"></li>
        <li role="presentation"><a role="menuitem" tabindex="-1" href="http://twitter.com/fat">Separated link</a></li>
      </ul>
    </li>
  </ul>
</div>

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
  <a id="dLabel" data-target="#" href="http://example.com" type="button" data-toggle="dropdown">
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

<div class="bs-callout bs-callout-info">
  <h4><code>data-toggle="dropdown"</code> still required</h4>
  <p>Regardless of whether you call your dropdown via JavaScript or instead use the data-api, <code>data-toggle="dropdown"</code> is always required to be present on the dropdown's trigger element.</p>
</div>

### Options

*None.*

### Methods

#### $().dropdown('toggle')

Toggles the dropdown menu of a given navbar or tabbed navigation.

### Events

All dropdown events are fired at the `.dropdown-menu`'s parent element.

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
        <td>This event fires immediately when the show instance method is called. The toggling anchor element is available as the <code>relatedTarget</code> property of the event.</td>
      </tr>
      <tr>
        <td>shown.bs.dropdown</td>
        <td>This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions, to complete).  The toggling anchor element is available as the <code>relatedTarget</code> property of the event.</td>
      </tr>
      <tr>
        <td>hide.bs.dropdown</td>
        <td>This event is fired immediately when the hide instance method has been called. The toggling anchor element is available as the <code>relatedTarget</code> property of the event.</td>
      </tr>
      <tr>
        <td>hidden.bs.dropdown</td>
        <td>This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions, to complete). The toggling anchor element is available as the <code>relatedTarget</code> property of the event.</td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myDropdown').on('show.bs.dropdown', function () {
  // do something…
})
{% endhighlight %}

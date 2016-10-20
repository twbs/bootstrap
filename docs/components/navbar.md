---
layout: docs
title: Navbar
description: Documentation and examples for Bootstrap's powerful, responsive navigation header.
group: components
---

The navbar is a wrapper that positions branding, navigation, and other elements into a concise header. It's easily extensible and thanks to our Collapse plugin, it can easily integrate responsive behaviors.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basics

Here's what you need to know before getting started with the navbar:

- Navbars require a wrapping `.navbar` and a [color scheme](#color-schemes).
- Navbars and their contents are fluid by default. Use [optional containers](#containers) to limit their horizontal width.
- Use `.float-*-left` and `.float-*-right` to quickly align sub-components.
- Ensure accessibility by using a `<nav>` element or, if using a more generic element such as a `<div>`, add a `role="navigation"` to every navbar to explicitly identify it as a landmark region for users of assistive technologies.

## Supported content

Navbars come with built-in support for a handful of sub-components. Mix and match from the following as needed:

- `.navbar-brand` for your company, product, or project name
- `.navbar-nav` for a full-height and lightweight navigation (including support for dropdowns)
- `.navbar-toggler` for use with our collapse plugin and other [navigation toggling](#collapsible-content) behaviors.
- Inline forms with `.float-` utilities for form controls and components.
- `.navbar-text` for adding vertically centered strings of text.

Here's an example of all the sub-components included in a default, non-responsive light themed navbar. [See the responsive examples](#collapsible-content) for collapsing nav support.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">Navbar</a>
  <ul class="nav navbar-nav">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="http://example.com" id="supportedContentDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
      <div class="dropdown-menu" aria-labelledby="supportedContentDropdown">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </li>
  </ul>
  <form class="form-inline float-xs-right">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-outline-success" type="submit">Search</button>
  </form>
</nav>
{% endexample %}

### Brand

The `.navbar-brand` can be applied to most elements, but an anchor works best as some elements might require utility classes or custom styles.

{% example html %}
<!-- As a link -->
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">Navbar</a>
</nav>

<!-- As a heading -->
<nav class="navbar navbar-light bg-faded">
  <h1 class="navbar-brand mb-0">Navbar</h1>
</nav>
{% endexample %}

Adding images to the `.navbar-brand` will likely always require custom styles or utilities to properly size. Here are some examples to demonstrate.

{% example html %}
<!-- Just an image -->
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">
    <img src="{{ site.baseurl }}/assets/brand/bootstrap-solid.svg" width="30" height="30" alt="">
  </a>
</nav>
{% endexample %}

{% example html %}
<!-- Image and text -->
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">
    <img src="{{ site.baseurl }}/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt="">
    Bootstrap
  </a>
</nav>
{% endexample %}

### Nav

Navbar navigation is similar to our regular nav options—use the `.nav` base class with a modifier to achieve a particular look. In this case you'll want `.nav.navbar-nav`.

Active states—with `.active`—to indicate the current page can be applied directly to `.nav-link`s or their immediate parent `.nav-item`s.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <ul class="nav navbar-nav">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Features</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Pricing</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">About</a>
    </li>
  </ul>
</nav>
{% endexample %}

And because we use classes for our navs, you can avoid the list-based approach entirely if you like.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <div class="nav navbar-nav">
    <a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
    <a class="nav-item nav-link" href="#">Features</a>
    <a class="nav-item nav-link" href="#">Pricing</a>
    <a class="nav-item nav-link" href="#">About</a>
  </div>
</nav>
{% endexample %}

You may also utilize dropdowns in your navbar nav. Dropdown menus require a wrapping element for positioning, so be sure to use separate and nested elements for `.nav-item` and `.nav-link` as shown below.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <ul class="nav navbar-nav">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Features</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Pricing</a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown link
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </li>
  </ul>
</nav>
{% endexample %}

### Forms

Place various form controls and components within a navbar with `.form-inline`. Align them with `.float-` utilities as needed.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <form class="form-inline float-xs-left">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-outline-success" type="submit">Search</button>
  </form>
</nav>
{% endexample %}

Input groups work, too:

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <form class="form-inline float-xs-left">
    <div class="input-group">
      <span class="input-group-addon" id="basic-addon1">@</span>
      <input type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
    </div>
  </form>
</nav>
{% endexample %}

Various buttons are supported as part of these navbar forms, too. This is also a great reminder that vertical alignment utilites can be used to align different sized elements.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <form class="form-inline float-xs-left">
    <button class="btn btn-outline-success" type="button">Main button</button>
    <button class="btn btn-sm align-middle btn-outline-secondary" type="button">Smaller button</button>
  </form>
</nav>
{% endexample %}

### Text

Navbars may contain bits of text with the help of `.navbar-text`. This class adjusts vertical alignment and horizontal spacing for strings of text.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <span class="navbar-text">
    Navbar text with an inline element
  </span>
</nav>
{% endexample %}

Using our utility classes, you can change the alignment and appearance of your navbar text.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <span class="navbar-text float-xs-right text-muted">
    Muted navbar text that's floated right
  </span>
</nav>
{% endexample %}

Similarly, you can use utility classes to align navbar text to other navbar elements like the brand and navigation (which are automatically floated already).

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">Navbar</a>
  <span class="navbar-text float-xs-left">
    Navbar text that's floated left
  </span>
</nav>
{% endexample %}

## Color schemes

Theming the navbar has never been easier thanks to the combination of a simple link color modifier class and `background-color` utilities. Put another way, you specify light or dark and apply a background color.

Here are some examples to show what we mean.

<div class="bd-example">
  <nav class="navbar navbar-dark bg-inverse">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">About</a>
      </li>
    </ul>
    <form class="form-inline float-xs-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-outline-info" type="submit">Search</button>
    </form>
  </nav>
  <nav class="navbar navbar-dark bg-primary">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">About</a>
      </li>
    </ul>
    <form class="form-inline float-xs-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-outline-secondary" type="submit">Search</button>
    </form>
  </nav>
  <nav class="navbar navbar-light" style="background-color: #e3f2fd;">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">About</a>
      </li>
    </ul>
    <form class="form-inline float-xs-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-outline-primary" type="submit">Search</button>
    </form>
  </nav>
</div>

{% highlight html %}
<nav class="navbar navbar-dark bg-inverse">
  <!-- Navbar content -->
</nav>

<nav class="navbar navbar-dark bg-primary">
  <!-- Navbar content -->
</nav>

<nav class="navbar navbar-light" style="background-color: #e3f2fd;">
  <!-- Navbar content -->
</nav>
{% endhighlight %}

## Containers

Although it's not required, you can wrap a navbar in a `.container` to center it on a page or add one within to only center the contents of a [fixed or static top navbar](#placement).

{% example html %}
<div class="container">
  <nav class="navbar navbar-light bg-faded">
    <a class="navbar-brand" href="#">Navbar</a>
  </nav>
</div>
{% endexample %}

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <div class="container">
    <a class="navbar-brand" href="#">Navbar</a>
  </div>
</nav>
{% endexample %}

## Placement

Navbars can be statically placed (their default behavior), static without rounded corners, or fixed to the top or bottom of the viewport.

{% example html %}
<nav class="navbar navbar-full navbar-light bg-faded">
  <a class="navbar-brand" href="#">Full width</a>
</nav>
{% endexample %}

{% example html %}
<nav class="navbar navbar-fixed-top navbar-light bg-faded">
  <a class="navbar-brand" href="#">Fixed top</a>
</nav>
{% endexample %}

{% example html %}
<nav class="navbar navbar-fixed-bottom navbar-light bg-faded">
  <a class="navbar-brand" href="#">Fixed bottom</a>
</nav>
{% endexample %}


## Collapsible content

Our collapse plugin allows you to use a `<button>` or `<a>` to toggle hidden content.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar" aria-controls="exCollapsingNavbar" aria-expanded="false" aria-label="Toggle navigation"></button>
  <div class="collapse" id="exCollapsingNavbar">
    <div class="bg-inverse text-muted p-1">
      <h4>Collapsed content</h4>
      <span class="text-muted">Toggleable via the navbar brand.</span>
    </div>
  </div>
</nav>
{% endexample %}

For more complex navbar patterns, like those used in Bootstrap v3, use the `.navbar-toggleable-*` classes in conjunction with the `.navbar-toggler`. These classes override our responsive utilities to show navigation only when content is meant to be shown.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <button class="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
  <div class="collapse navbar-toggleable-md" id="navbarResponsive">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="http://example.com" id="responsiveNavbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
        <div class="dropdown-menu" aria-labelledby="responsiveNavbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
    </ul>
    <form class="form-inline float-lg-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </div>
</nav>
{% endexample %}

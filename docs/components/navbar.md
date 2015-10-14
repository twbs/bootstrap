---
layout: docs
title: Navbar
group: components
---

The navbar is a simple wrapper for positioning branding, navigation, and other elements into a concise navigation header. It's easily extensible and, with the help of our collapse plugin, it can easily integrate offscreen content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basics

Here's what you need to know before getting started with the navbar:

- Navbars require a wrapping `.navbar` and a color scheme class (either `.navbar-default` or `.navbar-inverse`).
- When using multiple components in a navbar, some [alignment classes](#alignment) are required.
- Navbars and their contents are fluid by default. Use [optional containers](#containers) to limit their horizontal width.
- Use `.pull-left` and `.pull-right` to quickly align sub-components.
- Ensure accessibility by using a `<nav>` element or, if using a more generic element such as a `<div>`, add a `role="navigation"` to every navbar to explicitly identify it as a landmark region for users of assistive technologies.

## Supported content

Navbars come with built-in support for a handful of sub-components. Mix and match from the following as you need:

- `.navbar-brand` for your company, product, or project name
- `.navbar-nav` for a full-height and lightweight navigation (including support for dropdowns)
- `.navbar-form` for vertically centering default-sized inputs and buttons.
- `.navbar-toggler` for use with our collapse plugin and other navigation toggling behaviors.

Here's an example of all the sub-components included in a default, light navbar:

{% example html %}
<nav class="navbar navbar-light bg-faded">
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
  <form class="form-inline navbar-form pull-right">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-success-outline" type="submit">Search</button>
  </form>
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
    <form class="form-inline navbar-form pull-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-info-outline" type="submit">Search</button>
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
    <form class="form-inline navbar-form pull-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-secondary-outline" type="submit">Search</button>
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
    <form class="form-inline navbar-form pull-right">
      <input class="form-control" type="text" placeholder="Search">
      <button class="btn btn-primary-outline" type="submit">Search</button>
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

Although it's not required, you can wrap a navbar in a `.container` to center it on a page or add one within to only center the contents of the navbar.

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

Navbars can be statically placed (their default behavior), or fixed to the top or bottom of the viewport.

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
<div class="collapse" id="exCollapsingNavbar">
  <div class="bg-inverse p-a">
    <h4>Collapsed content</h4>
    <span class="text-muted">Toggleable via the navbar brand.</span>
  </div>
</div>
<nav class="navbar navbar-light bg-faded">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar">
    &#9776;
  </button>
</nav>
{% endexample %}

For more complex navbar patterns, like those used in Bootstrap v3, use the `.navbar-toggleable-*` classes in conjunction with the `.navbar-toggler`. These classes override our responsive utilities to show navigation only when content is meant to be shown.

{% example html %}
<nav class="navbar navbar-light bg-faded">
  <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
    &#9776;
  </button>
  <div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2">
    <a class="navbar-brand" href="#">Responsive navbar</a>
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
  </div>
</nav>
{% endexample %}

---
layout: page
title: Navbar
---

The navbar is a simple wrapper for positioning branding, navigation, and other elements. It's easily extensible and with the help of our collapse plugin it can easily integrate offscreen content.

### Basics

Here's what you need to know before getting started with the navbar:

- Navbars require a wrapping `.navbar` and either a color scheme class or custom styles.
- When using multiple components in a navbar, some [alignment classes](#alignment) are required.
- Navbars and their contents are fluid by default. Use [optional containers](#containers) to limit their horizontal width.
- Ensure accessibility by using a `<nav>` element or, if using a more generic element such as a `<div>`, add a `role="navigation"` to every navbar to explicitly identify it as a landmark region for users of assistive technologies.

### Branding

Name your company, product, or project with `.navbar-brand`.

{% example html %}
<nav class="navbar navbar-default">
  <h3 class="navbar-brand">
    <a href="#">Navbar</a>
  </h3>
</nav>
{% endexample %}

### Navigation

Use `.nav-pills` within a navbar for basic navigation.

{% example html %}
<nav class="navbar navbar-default">
  <ul class="nav nav-pills">
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

### Inline forms

Add an `.inline-form` within the navbar with nearly any combination of form controls and buttons.

{% example html %}
<nav class="navbar navbar-default">
  <form class="form-inline">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
</nav>
{% endexample %}

### Containers

Although it's not required, you can wrap a navbar in a `.container` or add one within for basic horizontal control.

{% example html %}
<nav class="navbar navbar-default">
  <div class="container">
    <h3 class="navbar-brand">
      <a href="#">Navbar</a>
    </h3>
  </div>
</nav>
{% endexample %}

{% example html %}
<div class="container">
  <nav class="navbar navbar-default">
    <h3 class="navbar-brand">
      <a href="#">Navbar</a>
    </h3>
  </nav>
</div>
{% endexample %}

### Alignment

Use `.pull-left` or `.pull-right` to align multiple elements within the navbar.

{% example html %}
<nav class="navbar navbar-default">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav nav-pills pull-left">
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
  <ul class="nav nav-pills pull-right">
    <li class="nav-item">
      <a class="nav-link" href="#">Help</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Sign out</a>
    </li>
  </ul>
</nav>
{% endexample %}

### Inverse color scheme

Replace `.navbar-default` with `.navbar-inverse` for a darker background color and white text.

{% example html %}
<nav class="navbar navbar-inverse">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav nav-pills pull-left">
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
  <form class="form-inline pull-right">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
</nav>
{% endexample %}

### Condensed

Condensed navbars provide a similar aesthetic to Bootstrap 3's navbar. It cuts the padding down, enables full-height navigation, and tweaks vertical alignment for search forms, buttons, and more. It's also available in both default and inverse schemes.

{% example html %}
<nav class="navbar navbar-default navbar-condensed">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav navbar-nav pull-left">
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
  <form class="form-inline pull-right">
    <input class="form-control form-control-sm" type="text" placeholder="Search">
    <button class="btn btn-sm btn-primary" type="submit">Search</button>
  </form>
</nav>

<nav class="navbar navbar-inverse navbar-condensed">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav navbar-nav pull-left">
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
  <form class="form-inline pull-right">
    <input class="form-control form-control-sm" type="text" placeholder="Search">
    <button class="btn btn-sm btn-primary" type="submit">Search</button>
  </form>
</nav>
{% endexample %}


### Collapsible content

Our collapse plugin allows you to use a `<button>` or `<a>` to toggle hidden content.

{% example html %}
<div class="collapse" id="exCollapsingNavbar">
  <div class="inverse p-a">
    <h4>Collapsed content</h4>
    <p>Toggleable via the navbar brand.</p>
  </div>
</div>
<nav class="navbar navbar-default">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar">
    &#9776;
  </button>
</nav>
{% endexample %}

For more complex navbar patterns, like those used in Bootstrap v3, use the `.navbar-toggleable-*` classes in conjunction with the `.navbar-toggler`. These classes override our responsive utilities to show navigation only when content is meant to be shown.

{% example html %}
<nav class="navbar navbar-default">
  <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
    &#9776;
  </button>
  <div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2">
    <h4>Collapsed on xs devices</h4>
    <p>Toggleable via the navbar brand.</p>
  </div>
</nav>
{% endexample %}



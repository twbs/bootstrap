---
layout: page
title: New navbar
---

The navbar is a simple wrapper for positioning branding, navigation, and other elements. It's easily extensible and with the help of our collapse plugin it can easily integrate offscreen content.

### Basics

Here's what you need to know before getting started with the navbar:

- Navbars require a wrapping `.navbar` and either a color scheme class or custom styles.
- When using multiple components in a navbar, some [alignment classes](#alignment) are required.
- Navbars and their contents are fluid by default. Use [optional containers](#containers) to limit their horizontal width.

### Branding

Name your company, product, or project with `.navbar-brand`.

{% example html %}
<div class="navbar navbar-default">
  <h3 class="navbar-brand">
    <a href="#">Navbar</a>
  </h3>
</div>
{% endexample %}

### Navigation

Use `.nav-pills` within a navbar for basic navigation.

{% example html %}
<div class="navbar navbar-default">
  <ul class="nav nav-pills">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home</a>
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
{% endexample %}

### Inline forms

Add an `.inline-form` within the navbar with nearly any combination of form controls and buttons.

{% example html %}
<div class="navbar navbar-default">
  <form class="form-inline">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
</div>
{% endexample %}

### Containers

Although it's not required, you can wrap a navbar in a `.container` or add one within for basic horizontal control.

{% example html %}
<div class="navbar navbar-default">
  <div class="container">
    <h3 class="navbar-brand">
      <a href="#">Navbar</a>
    </h3>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="container">
  <div class="navbar navbar-default">
    <h3 class="navbar-brand">
      <a href="#">Navbar</a>
    </h3>
  </div>
</div>
{% endexample %}

### Alignment

Use `.pull-left` or `.pull-right` to align multiple elements within the navbar.

{% example html %}
<div class="navbar navbar-default">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav nav-pills pull-left">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home</a>
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
</div>
{% endexample %}

### Inverse color scheme

Replace `.navbar-default` with `.navbar-inverse` for a darker background color and white text.

{% example html %}
<div class="navbar navbar-inverse">
  <h3 class="navbar-brand pull-left">
    <a href="#">Navbar</a>
  </h3>
  <ul class="nav nav-pills pull-left">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home</a>
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
</div>
{% endexample %}

### Collapsible content

Our collapse plugin allows you to use a `<button>` to toggle hidden content.

{% example html %}
<div class="collapse" id="navbar-header">
  <div class="inverse p-a">
    <h3>Collapsed content</h3>
    <p>Toggleable via the navbar brand.</p>
  </div>
</div>
<div class="navbar navbar-default">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-header">
    &#9776;
  </button>
</div>
{% endexample %}

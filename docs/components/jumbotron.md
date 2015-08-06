---
layout: page
title: Jumbotron
group: components
---

A lightweight, flexible component that can optionally extend the entire viewport to showcase key marketing messages on your site.

## Example

{% example html %}
<div class="jumbotron">
  <h1 class="jumbotron-heading">Hello, world!</h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <p class="lead"><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
</div>
{% endexample %}

To make the jumbotron full width, and without rounded corners, add the `.jumbotron-fluid` modifier class and add a `.container` or `.container-fluid` within.

{% example html %}
<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="jumbotron-heading">Fluid jumbotron</h1>
    <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of it's parent.</p>
  </div>
</div>
{% endexample %}

Jumbotrons also come with an adaptive `hr`—just add `.jumbotron-hr` to the element and the `border-top-color` will be tinted based on the jumbotron background.

{% example html %}
<div class="jumbotron">
  <h1 class="jumbotron-heading">Jumbotron <code>hr</code></h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <hr class="jumbotron-hr">
  <p class="lead"><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
</div>
{% endexample %}

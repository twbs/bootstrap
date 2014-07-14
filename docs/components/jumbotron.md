---
layout: page
title: Jumbotron
---

A lightweight, flexible component that can optionally extend the entire viewport to showcase key content on your site.

{% example html %}
<div class="jumbotron">
  <h1>Hello, world!</h1>
  <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <p><a class="btn btn-primary btn-lg" role="button">Learn more</a></p>
</div>
{% endexample %}

To make the jumbotron full width, and without rounded corners, place it outside all `.container`s and instead add a `.container` within.

{% example html %}
<div class="jumbotron">
  <div class="container">
    ...
  </div>
</div>
{% endexample %}

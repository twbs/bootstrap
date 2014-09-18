---
layout: page
title: Jumbotron
---

A lightweight, flexible component that can optionally extend the entire viewport to showcase key content on your site.

{% example html %}
<div class="jumbotron">
  <h1 class="jumbotron-heading">Hello, world!</h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <p class="lead"><a class="btn btn-primary btn-lg" role="button">Learn more</a></p>
</div>
{% endexample %}

To make the jumbotron full width, and without rounded corners, place it outside all `.container`s and instead add a `.container` within.

{% highlight html %}
<div class="jumbotron">
  <div class="container">
    ...
  </div>
</div>
{% endhighlight %}

Jumbotrons also come with an adaptive `hr`—just add `.jumbotron-hr` to the element and the `border-top-color` will be tinted based on the jumbotron background.

{% example html %}
<div class="jumbotron">
  <h1 class="jumbotron-heading">Jumbotron <code>hr</code></h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <hr class="jumbotron-hr">
  <p class="lead"><a class="btn btn-primary btn-lg" role="button">Learn more</a></p>
</div>
{% endexample %}

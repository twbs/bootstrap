---
layout: single
title: Bootstrap grid masonry example
description: This example illustrates how to integrate the [Masonry plugin](https://masonry.desandro.com/) with the Bootstrap grid. More options & documentation can be found on their [documentation site](https://masonry.desandro.com/).
include_docs_stylesheets: true
active_menu: "example"
extra_js:
  - src: "https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"
    integrity: "sha256-Nn1q/fx0H7SNLZMQ5Hw5JLaTRZp0yILA/FRexe19VdI="
    async: true
---

Masonry is not included in Bootstrap, but can easily be added by including your locally hosted file or using the following hosted javascript file:

```js
<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js" integrity="sha256-Nn1q/fx0H7SNLZMQ5Hw5JLaTRZp0yILA/FRexe19VdI=" crossorigin="anonymous" async></script>
```

By adding `data-masonry='{"percentPosition": true }'` to the `.row` wrapper, we can combine the powers of Bootstrap's responsive grid and Masonry's positioning.

{{< example >}}
<div class="row" data-masonry='{"percentPosition": true }'>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card">
      {{< placeholder width="100%" height="160" class="card-img-top" text="Image cap" >}}
      <div class="card-body">
        <h5 class="card-title">Card title that wraps to a new line</h5>
        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card p-3">
      <blockquote class="blockquote mb-0 card-body">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer class="blockquote-footer">
          <small class="text-muted">
            Someone famous in <cite title="Source Title">Source Title</cite>
          </small>
        </footer>
      </blockquote>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card">
      {{< placeholder width="100%" height="160" class="card-img-top" text="Image cap" >}}
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card bg-primary text-white text-center p-3">
      <blockquote class="blockquote mb-0">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
        <footer class="blockquote-footer text-white">
          <small>
            Someone famous in <cite title="Source Title">Source Title</cite>
          </small>
        </footer>
      </blockquote>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This card has a regular title and short paragraphy of text below it.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card">
      {{< placeholder width="100%" height="260" class="card-img" text="Card image" >}}
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card p-3 text-right">
      <blockquote class="blockquote mb-0">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer class="blockquote-footer">
          <small class="text-muted">
            Someone famous in <cite title="Source Title">Source Title</cite>
          </small>
        </footer>
      </blockquote>
    </div>
  </div>
  <div class="col-sm-6 col-lg-4 mb-4">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is another card with title and supporting text below. This card has some additional content to make it slightly taller overall.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
{{< /example >}}

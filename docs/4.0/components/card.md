---
layout: docs
title: Cards
description: Bootstrap's cards provide a flexible and extensible content container with multiple variants and options.
group: components
toc: true
---

## About

A **card** is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.

If you're familiar with Bootstrap 3, cards replace our old panels, wells, and thumbnails. Similar functionality to those components is available as modifier classes for cards.

## Example

Cards are built with as little markup and styles as possible, but still manage to deliver a ton of control and customization. Built with flexbox, they offer easy alignment and mix well with other Bootstrap components.

Below is an example of a basic card with mixed content and a fixed width. Cards have no fixed width to start, so they'll naturally fill the full width of its parent element. This is easily customized with our various [sizing options](#sizing).

{% example html %}
<div class="card" style="width: 20rem;">
  <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Content types

Cards support a wide variety of content, including images, text, list groups, links, and more. Below are examples of what's supported.

### Blocks

The building block of a card is the `.card-body`. Use it whenever you need a padded section within a card.

{% example html %}
<div class="card">
  <div class="card-body">
    This is some text within a card block.
  </div>
</div>
{% endexample %}

### Titles, text, and links

Card titles are used by adding `.card-title` to a `<h*>` tag. In the same way, links are added and placed next to each other by adding `.card-link` to  a `<a>` tag.

Subtitles are used by adding a `.card-subtitle` to a `<h*>` tag. If the `.card-title` and the `.card-subtitle` items are placed in a `.card-body` item, the card title and subtitle are aligned nicely.

{% example html %}
<div class="card" style="width: 20rem;">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
{% endexample %}

### Images

`.card-img-top` places an image to the top of the card. With `.card-text`, text can be added to the card. Text within `.card-text` can also be styled with the standard HTML tags.

{% example html %}
<div class="card" style="width: 20rem;">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
{% endexample %}

### List groups

Create lists of content in a card with a flush list group.

{% example html %}
<div class="card" style="width: 20rem;">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>
{% endexample %}

### Kitchen sink

Mix and match multiple content types to create the card you need, or throw everything in there. Shown below are image styles, blocks, text styles, and a list group—all wrapped in a fixed-width card.

{% example html %}
<div class="card" style="width: 20rem;">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
  <div class="card-body">
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
{% endexample %}

### Header and footer

Add an optional header and/or footer within a card.

{% example html %}
<div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

Card headers can be styled by adding `.card-header` to `<h*>` elements.

{% example html %}
<div class="card">
  <h4 class="card-header">Featured</h4>
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="card">
  <div class="card-header">
    Quote
  </div>
  <div class="card-body">
    <blockquote class="blockquote mb-0">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="card text-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer text-muted">
    2 days ago
  </div>
</div>
{% endexample %}

## Sizing

Cards assume no specific `width` to start, so they'll be 100% wide unless otherwise stated. You can change this as needed with custom CSS, grid classes, grid Sass mixins, or utilities.

### Using grid markup

Using the grid, wrap cards in columns and rows as needed.

{% example html %}
<div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Special title treatment</h4>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Special title treatment</h4>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</div>
{% endexample %}

### Using utilities

Use our handful of [available sizing utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/sizing/) to quickly set a card's width.

{% example html %}
<div class="card w-75">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Button</a>
  </div>
</div>

<div class="card w-50">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Button</a>
  </div>
</div>
{% endexample %}

### Using custom CSS

Use custom CSS in your stylesheets or as inline styles to set a width.

{% example html %}
<div class="card" style="width: 20rem;">
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Text alignment

You can quickly change the text alignment of any card—in its entirety or specific parts—with our [text align classes]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/text/#text-alignment).

{% example html %}
<div class="card" style="width: 20rem;">
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-center" style="width: 20rem;">
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-right" style="width: 20rem;">
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Navigation

Add some navigation to a card's header (or block) with Bootstrap's [nav components]({{ site.baseurl }}/docs/{{ site.docs_version }}/components/navs/).

{% example html %}
<div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-pills card-header-pills">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Images

Cards include a few options for working with images. Choose from appending "image caps" at either end of a card, overlaying images with card content, or simply embedding the image in a card.

### Image caps

Similar to headers and footers, cards can include top and bottom "image caps"—images at the top or bottom of a card.

{% example html %}
<div class="card mb-3">
  <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>
<div class="card">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
  <img class="card-img-bottom" data-src="holder.js/100px180/" alt="Card image cap">
</div>
{% endexample %}

### Image overlays

Turn an image into a card background and overlay your card's text. Depending on the image, you may or may not need additional styles or utilities.

{% example html %}
<div class="card bg-dark text-white">
  <img class="card-img" data-src="holder.js/100px270/#55595c:#373a3c/text:Card image" alt="Card image">
  <div class="card-img-overlay">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text">Last updated 3 mins ago</p>
  </div>
</div>
{% endexample %}

## Card styles

Cards include various options for customizing their backgrounds, borders, and color.

### Background and color

Use [text and background utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/colors/) to change the appearance of a card.

{% example html %}
{% for color in site.data.theme-colors %}
<div class="card{% unless color.name == "light" %} text-white{% endunless %} bg-{{ color.name }} mb-3" style="max-width: 20rem;">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h4 class="card-title">{{ color.name | capitalize }} card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>{% endfor %}
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

### Border

Use [border utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/borders/) to change just the `border-color` of a card. Note that you can put `.text-{color}` classes on the parent `.card` or a subset of the card's contents as shown below.

{% example html %}
{% for color in site.data.theme-colors %}
<div class="card border-{{ color.name }} mb-3" style="max-width: 20rem;">
  <div class="card-header">Header</div>
  <div class="card-body{% unless color.name == "light" %} text-{{ color.name }}{% endunless %}">
    <h4 class="card-title">{{ color.name | capitalize }} card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>{% endfor %}
{% endexample %}

### Mixins utilities

You can also change the borders on the card header and footer as needed, and even remove their `background-color` with `.bg-transparent`.

{% example html %}
<div class="card border-success mb-3" style="max-width: 20rem;">
  <div class="card-header bg-transparent border-success">Header</div>
  <div class="card-body text-success">
    <h4 class="card-title">Success card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <div class="card-footer bg-transparent border-success">Footer</div>
</div>
{% endexample %}

## Card layout

In addition to styling the content within cards, Bootstrap includes a few options for laying out series of cards. For the time being, **these layout options are not yet responsive**.

### Card groups

Use card groups to render cards as a single, attached element with equal width and height columns. Card groups use `display: flex;` to achieve their uniform sizing.

{% example html %}
<div class="card-group">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endexample %}

When using card groups with footers, their content will automatically line up.

{% example html %}
<div class="card-group">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>
{% endexample %}

### Card decks

Need a set of equal width and height cards that aren't attached to one another? Use card decks.

{% example html %}
<div class="card-deck">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endexample %}

Just like with card groups, card footers in decks will automatically line up.

{% example html %}
<div class="card-deck">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>
{% endexample %}

### Card columns

Cards can be organized into [Masonry](http://masonry.desandro.com)-like columns with just CSS by wrapping them in `.card-columns`. Cards are built with CSS `column` properties instead of flexbox for easier alignment. Cards are ordered from top to bottom and left to right.

**Heads up!** Your mileage with card columns may vary. To prevent cards breaking across columns, we must set them to `display: inline-block` as `column-break-inside: avoid` isn't a bulletproof solution yet.

{% example html %}
<div class="card-columns">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title that wraps to a new line</h4>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
  </div>
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
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card bg-primary p-3 text-center">
    <blockquote class="blockquote mb-0">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
      <footer class="blockquote-footer">
        <small>
          Someone famous in <cite title="Source Title">Source Title</cite>
        </small>
      </footer>
    </blockquote>
  </div>
  <div class="card text-center">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img" data-src="holder.js/100px260/" alt="Card image">
  </div>
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
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endexample %}

Card columns can also be extended and customized with some additional code. Shown below is an extension of the `.card-columns` class using the same CSS we use—CSS columns— to generate a set of responsive tiers for changing the number of columns.

{% highlight scss %}
.card-columns {
  @include media-breakpoint-only(lg) {
    column-count: 4;
  }
  @include media-breakpoint-only(xl) {
    column-count: 5;
  }
}
{% endhighlight %}

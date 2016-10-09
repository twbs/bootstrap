---
layout: docs
title: Cards
description: Bootstrap Cards provide a flexible and extensible content container with multiple variants and options.
group: components
---

A **card** is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.

If you're familiar with Bootstrap 3, cards replace our old panels, wells, and thumbnails. Similar functionality to those components is available as modifier classes for cards.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Cards require a small amount of markup and classes to provide you with as much control as possible. These classes and markup are flexible though and can typically be remixed and extended with ease. For example, if your card has no flush content like images, feel free to put the `.card-block` class on the `.card` element to consolidate your markup.

{% example html %}
<div class="card">
  <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Content types

Cards support a wide variety of content, including images, text, list groups, links, and more. Mix and match multiple content types to create the card you need.

{% example html %}
<div class="card">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
  <div class="card-block">
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
{% endexample %}

Lists can be added to a card by adding a list group.

{% example html %}
<div class="card">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>
{% endexample %}

`.card-img-top` places an image to the top of the card. With `.card-text`, text can be added to the card. Text within `.card-text` can also be styled with the standard HTML tags.

{% example html %}
<div class="card">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-block">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
{% endexample %}

Card titles are used by adding `.card-title` to a `<h*>` tag. In the same way, links are added and placed next to each other by adding `.card-link` to  a `<a>` tag.

{% example html %}
<div class="card card-block">
  <h4 class="card-title">Card title</h4>
  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  <a href="#" class="card-link">Card link</a>
  <a href="#" class="card-link">Another link</a>
</div>
{% endexample %}

Subtitles are used by adding a `.card-subtitle` to an `<h*>` tag. If the `.card-title` and the `.card-subtitle` items are placed in a `.card-block` item, the card title and subtitle are aligned nicely.

The multiple content types can be easily combined to create the card you need. See below for an example.

{% example html %}
<div class="card">
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <h6 class="card-subtitle text-muted">Support card subtitle</h6>
  </div>
  <img data-src="holder.js/100px180/?text=Image" alt="Card image">
  <div class="card-block">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
{% endexample %}

## Sizing

Constrain the width of cards via custom CSS, our predefined grid classes, or with custom styles using our grid mixins.

Using the grid:

{% example html %}
<div class="row">
  <div class="col-sm-6">
    <div class="card card-block">
      <h3 class="card-title">Special title treatment</h3>
      <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card card-block">
      <h3 class="card-title">Special title treatment</h3>
      <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
</div>
{% endexample %}

Using custom widths:

{% example html %}
<div class="card card-block" style="width: 18rem;">
  <h3 class="card-title">Special title treatment</h3>
  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  <a href="#" class="btn btn-primary">Go somewhere</a>
</div>
{% endexample %}

## Text alignment

You can quickly change the text alignment of any card—in its entirety or specific parts—with our [text align classes]({{ site.baseurl }}/utilities/typography/#text-alignment).

{% example html %}
<div class="card card-block">
  <h4 class="card-title">Special title treatment</h4>
  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  <a href="#" class="btn btn-primary">Go somewhere</a>
</div>

<div class="card card-block text-xs-center">
  <h4 class="card-title">Special title treatment</h4>
  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  <a href="#" class="btn btn-primary">Go somewhere</a>
</div>

<div class="card card-block text-xs-right">
  <h4 class="card-title">Special title treatment</h4>
  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  <a href="#" class="btn btn-primary">Go somewhere</a>
</div>
{% endexample %}

## Header and footer

Add an optional header and/or footer within a card.

{% example html %}
<div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-block">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

Card headers can be styled by adding `.card-header` to `<h*>` elements.

{% example html %}
<div class="card">
  <h3 class="card-header">Featured</h3>
  <div class="card-block">
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
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="card text-xs-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-block">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer text-muted">
    2 days ago
  </div>
</div>
{% endexample %}

## Header nav

Use Bootstrap's nav pills or tabs within a card header. Be sure to always include a `.pull-*-*` utility class for proper alignment.

{% example html %}
<div class="card text-xs-center">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs float-xs-left">
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
  <div class="card-block">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="card text-xs-center">
  <div class="card-header">
    <ul class="nav nav-pills card-header-pills float-xs-left">
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
  <div class="card-block">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Image caps

Similar to headers and footers, cards include top and bottom image caps.

{% example html %}
<div class="card">
  <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>
<div class="card">
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
  <img class="card-img-bottom" data-src="holder.js/100px180/" alt="Card image cap">
</div>
{% endexample %}

## Image overlays

Turn an image into a card background and overlay your card's text. Depending on the image, you may or may not need `.card-inverse` (see below).

{% example html %}
<div class="card card-inverse">
  <img class="card-img" data-src="holder.js/100px270/#55595c:#373a3c/text:Card image" alt="Card image">
  <div class="card-img-overlay">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>
{% endexample %}

## Inverted text

Cards include a class for quickly toggling **the text color**. By default, cards use dark text and assume a light background. **Add `.card-inverse` for white text** and specify the `background-color` and `border-color` to go with it.

You can also use `.card-inverse` with the [contextual backgrounds variants](#background-variants).

{% example html %}
<div class="card card-inverse" style="background-color: #333; border-color: #333;">
  <div class="card-block">
    <h3 class="card-title">Special title treatment</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endexample %}

## Background variants

Cards include their own variant classes for quickly changing the `background-color` and `border-color` of a card. **Darker colors require the use of `.card-inverse`.**

{% example html %}
<div class="card card-inverse card-primary text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-inverse card-success text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-inverse card-info text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-inverse card-warning text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-inverse card-danger text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Outline variants

In need of a colored card, but not the hefty background colors they bring? Replace the default modifier classes with the `.card-outline-*` ones to style just the `border-color` of a card.

{% example html %}
<div class="card card-outline-primary text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-outline-secondary text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-outline-success text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-outline-info text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-outline-warning text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
<div class="card card-outline-danger text-xs-center">
  <div class="card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
{% endexample %}

## Groups

Use card groups to render cards as a single, attached element with equal width and height columns. By default, card groups use `display: table;` and `table-layout: fixed;` to achieve their uniform sizing. However, enabling [flexbox mode]({{ site.baseurl }}/getting-started/flexbox/) can switch that to use `display: flex;` and provide the same effect.

Only applies to small devices and above.

{% example html %}
<div class="card-group">
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endexample %}

## Decks

Need a set of equal width and height cards that aren't attached to one another? Use card decks. By default, card decks require two wrapping elements: `.card-deck-wrapper` and a `.card-deck`. We use table styles for the sizing and the gutters on `.card-deck`. The `.card-deck-wrapper` is used to negative margin out the `border-spacing` on the `.card-deck`.

Only applies to small devices and above.

**ProTip!** If you enable [flexbox mode]({{ site.baseurl }}/getting-started/flexbox/), you can remove the `.card-deck-wrapper`.

{% example html %}
<div class="card-deck-wrapper">
  <div class="card-deck">
    <div class="card">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
      <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
    <div class="card">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
      <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
    <div class="card">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
      <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Columns

Cards can be organized into [Masonry](http://masonry.desandro.com)-like columns with just CSS by wrapping them in `.card-columns`. Cards are ordered from top to bottom and left to right when wrapped in `.card-columns`.

Only applies to small devices and above.

**Heads up!** This is **not available in IE9 and below** as they have no support for the [`column-*` CSS properties](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_multi-column_layouts).

{% example html %}
<div class="card-columns">
  <div class="card">
    <img class="card-img-top img-fluid" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">Card title that wraps to a new line</h4>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
  </div>
  <div class="card card-block">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>
        <small class="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </small>
      </footer>
    </blockquote>
  </div>
  <div class="card">
    <img class="card-img-top img-fluid" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card card-block card-inverse card-primary text-xs-center">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
      <footer>
        <small>
          Someone famous in <cite title="Source Title">Source Title</cite>
        </small>
      </footer>
    </blockquote>
  </div>
  <div class="card card-block text-xs-center">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
  <div class="card">
    <img class="card-img img-fluid" data-src="holder.js/100px260/" alt="Card image">
  </div>
  <div class="card card-block text-xs-right">
    <blockquote class="card-blockquote">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer>
        <small class="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </small>
      </footer>
    </blockquote>
  </div>
  <div class="card card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
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

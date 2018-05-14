---
layout: docs
title: Cards
description: Bootstrap's cards provide a flexible and extensible content container with multiple variants and options.
group: components
toc: true
---

## About

A **card** is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options. If you're familiar with Bootstrap 3, cards replace our old panels, wells, and thumbnails. Similar functionality to those components is available as modifier classes for cards.

## Example

Cards are built with as little markup and styles as possible, but still manage to deliver a ton of control and customization. Built with flexbox, they offer easy alignment and mix well with other Bootstrap components. They have no `margin` by default, so use [spacing utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/) as needed.

Below is an example of a basic card with mixed content and a fixed width. Cards have no fixed width to start, so they'll naturally fill the full width of its parent element. This is easily customized with our various [sizing options](#sizing).

{% example html %}
<div class="card" style="width: 20rem;">
  <div class="card-img">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  </div>
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Content types

Cards support a wide variety of content, including images, text, list groups, links, and more. Below are examples of what's supported.

### Body

The building block of a card is the `.card-body`. Use it whenever you need a padded section within a card.

{% capture example %}
<div class="card">
  <div class="card-body">
    This is some text within a card body.
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Titles, text, and links

Card titles are used by adding `.card-title` to a `<h*>` tag. In the same way, links are added and placed next to each other by adding `.card-link` to an `<a>` tag.

Subtitles are used by adding a `.card-subtitle` to a `<h*>` tag. If the `.card-title` and the `.card-subtitle` items are placed in a `.card-body` item, the card title and subtitle are aligned nicely.

{% capture example %}
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Images

`.card-img-top` places an image to the top of the card. With `.card-text`, text can be added to the card. Text within `.card-text` can also be styled with the standard HTML tags.

<<<<<<< HEAD:docs/4.1/components/card.md
{% capture example %}
<div class="card" style="width: 18rem;">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-body">
=======
{% example html %}
<div class="card">
  <div class="card-img">
    <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
{% endexample %}

`.card-img` adds the top border. It is a **wrapper class**, because the applied paddings would result in image distortions when an image has defined width and height (due to used box-sizing). We might use a more general class in the future. For the sake of simplicity we decided to use `p-X` utility for the padding, as discussed.

{% example html %}
<div class="card">
  <div class="card-block">
    <p class="card-text">Default <code>card-img</code> has no padding</p>
  </div>
  <div class="card-img">
    <img data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <p class="card-text"><code>p-1</code> adds padding</p>
  </div>
  <div class="card-img p-1">
    <img data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <p class="card-text"><code>p-2</code> padding</p>
  </div>
  <div class="card-img p-2">
    <img data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <p class="card-text"><code>p-3</code> padding</p>
  </div>
  <div class="card-img p-3">
    <img data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <p class="card-text"><code>p-5</code> padding</p>
  </div>
  <div class="card-img p-5">
    <img data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
</div>
{% endexample %}

### Buttons

`.card-btn` creates a full block button. Use it for collapse toggles or other full-width-buttons

{% example html %}
<div class="card">
  <div class="card-img">
    <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
>>>>>>> joblocal-bootstrap4:docs/components/card.md
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <button class="card-btn btn btn-link">Show more</button>
</div>
{% endcapture %}
{% include example.html content=example %}

### List groups

Create lists of content in a card with a flush list group.

{% capture example %}
<div class="card" style="width: 18rem;">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="card" style="width: 18rem;">
  <div class="card-header">
    Featured
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>
{% endcapture %}
{% include example.html content=example %}

### Tables

Shows a table inside a card.

{% example html %}
<div class="card">
  <table class="table table-flush">
    <tbody>
      <tr>
        <th>Company</th>
        <td>Delos Destinations</td>
      </tr>
      <tr>
        <th>Employees</th>
        <td>5000</td>
      </tr>
      <tr>
        <th>Website</th>
        <td><a href="https://muenchenerjobs.de/">http://muenchenerjobs.de</a></td>
      </tr>
    </tbody>
  </table>
</div>
{% endexample %}

### Kitchen sink

Mix and match multiple content types to create the card you need, or throw everything in there. Shown below are image styles, blocks, text styles, and a list group—all wrapped in a fixed-width card.

<<<<<<< HEAD:docs/4.1/components/card.md
{% capture example %}
<div class="card" style="width: 18rem;">
  <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
=======
{% example html %}
<div class="card" style="width: 20rem;">
  <div class="card-img">
    <img class="card-img-top" data-src="holder.js/100px180/?text=Image cap" alt="Card image cap">
  </div>
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
<<<<<<< HEAD:docs/4.1/components/card.md
  <div class="card-body">
=======
  <table class="table table-flush table-responsive">
    <tbody>
      <tr>
        <th>Company</th>
        <td>Delos Destinations</td>
      </tr>
      <tr>
        <th>Employees</th>
        <td>5000</td>
      </tr>
      <tr>
        <th>Website</th>
        <td><a href="https://muenchenerjobs.de/">http://muenchenerjobs.de</a></td>
      </tr>
    </tbody>
  </table>
  <div class="card-block">
>>>>>>> joblocal-bootstrap4:docs/components/card.md
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
  <button class="card-btn btn btn-link">Show more</button>
</div>
{% endcapture %}
{% include example.html content=example %}

### Header and footer

Add an optional header and/or footer within a card.

{% capture example %}
<div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

Card headers can be styled by adding `.card-header` to `<h*>` elements.

{% capture example %}
<div class="card">
  <h5 class="card-header">Featured</h5>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
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
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="card text-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer text-muted">
    2 days ago
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

#### Footer Table

{% example html %}
<div class="card text-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-block">
    <h4 class="card-title">Special title treatment</h4>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer p-0">
    <table class="table table-flush table-sm">
      <tbody>
        <tr>
          <th>Label</th>
          <td>Value</td>
        </tr>
        <tr>
          <th>Label</th>
          <td>Value</td>
        </tr>
        <tr>
          <th>Label</th>
          <td>Value</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
{% endexample %}

## Sizing

Cards assume no specific `width` to start, so they'll be 100% wide unless otherwise stated. You can change this as needed with custom CSS, grid classes, grid Sass mixins, or utilities.

### Using grid markup

Using the grid, wrap cards in columns and rows as needed.

{% capture example %}
<div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Using utilities

Use our handful of [available sizing utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/sizing/) to quickly set a card's width.

{% capture example %}
<div class="card w-75">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Button</a>
  </div>
</div>

<div class="card w-50">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Button</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Using custom CSS

Use custom CSS in your stylesheets or as inline styles to set a width.

{% capture example %}
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Using shadows

Shadow utility classes overwrite the default shadow on the card

{% example html %}
<div class="card shadow-soft">
  <div class="card-block">
    <h3 class="card-title">Soft shadow</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </div>
  <a href="#" class="card-btn btn btn-link">Go somewhere</a>
</div>
{% endexample %}

{% example html %}
<div class="card shadow-large">
  <div class="card-block">
    <h3 class="card-title">Large Shadow</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </div>
  <a href="#" class="card-btn btn btn-primary">Go somewhere</a>
</div>
{% endexample %}

## Text alignment

You can quickly change the text alignment of any card—in its entirety or specific parts—with our [text align classes]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/text/#text-alignment).

{% capture example %}
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-center" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<div class="card text-right" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Navigation

Add some navigation to a card's header (or block) with Bootstrap's [nav components]({{ site.baseurl }}/docs/{{ site.docs_version }}/components/navs/).

{% capture example %}
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
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
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
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Card Nav
Special Component, that adds the correct padding and top border without using the `card-header` class.

<div class="card">
  <div class="card-block px-3 py-3 px-sm-4 py-sm-3 px-md-5 py-md-4 px-lg-6 py-lg-5">
    <h1 class="card-title">Ausbildung zum Drogist (w/m) mit der Möglichkeit der Zusatzqualifikation zum Handelsfachwirt 2017 <small>in München</small></h1>
    <p class="card-text small"><span class="badge badge-primary">Top Job</span> <a href="#">dm-drogerie markt GmbH + Co. KG</a></p>
  </div>
  <div class="card-nav bg-faded">
    <ul class="nav nav-buttons card-buttons card-buttons">
      <li class="nav-item">
        <button type="button" class="btn btn-secondary">Job merken</button>
      </li>
      <li class="nav-item">
        <div class="btn-group">
          <button type="button" data-toggle="dropdown" class="btn btn-secondary dropdown-toggle">Teilen</button>
          <div class="dropdown-menu">
            <a href="mailto:" class="dropdown-item">Per E-Mail</a>
            <div class="dropdown-divider"></div>
            <h6 class="dropdown-header">Soziale Netzwerke</h6>
            <a href="#" class="dropdown-item">Facebook</a>
            <a href="#" class="dropdown-item">Twitter</a>
            <a href="#" class="dropdown-item">Google Plus</a>
            <a href="#" class="dropdown-item">LinkedIn</a>
          </div>
        </div>
      </li>
      <li class="nav-item">
        <button type="button" class="btn btn-secondary">Drucken</button>
      </li>
      <li class="ml-auto">
        <a href="#" class="btn btn-cta btn-primary">Jetzt bewerben</a>
      </li>
    </ul>
  </div>
  <div class="card-block px-3 py-3 px-sm-4 py-sm-3 px-md-5 py-md-4 px-lg-6 py-lg-5">
    <h2 class="card-title">Stellenbeschreibung</h2>
    <p>AmRest Holdings SE is the largest independent restaurant operator in Central and Eastern Europe with a growing international presence. Since 1993 we have been building a portfolio of well recognized, power brands such as KFC, Pizza Hut, Burger King and Starbucks based on solid franchise and joint venture partnerships. AmRest owns the La Tagliatella brand which is being developed internationally as both Company operated restaurants and franchised stores. In 2012 AmRest acquired two unique brands operating in China- Blue Frog and Kabb.</p>
    <p>AmRest Coffee Deutschland Sp. z o.o. &amp; Co. KG is a sub company of AmRest Holdings SE, which operates almost 150 Starbucks Stores in Germany as licensee.</p>
  </div>
</div>

## Images

Cards include a few options for working with images. Choose from appending "image caps" at either end of a card, overlaying images with card content, or simply embedding the image in a card.

### Image caps

Similar to headers and footers, cards can include top and bottom "image caps"—images at the top or bottom of a card.

{% capture example %}
<div class="card mb-3">
<<<<<<< HEAD:docs/4.1/components/card.md
  <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
=======
  <div class="card-img">
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
  </div>
  <div class="card-block">
    <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
</div>
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  </div>
  <div class="card-img">
    <img class="card-img-bottom" data-src="holder.js/100px180/" alt="Card image cap">
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Image overlays

Turn an image into a card background and overlay your card's text. Depending on the image, you may or may not need additional styles or utilities.

<<<<<<< HEAD:docs/4.1/components/card.md
{% capture example %}
<div class="card bg-dark text-white">
  <img class="card-img" data-src="holder.js/100px270/#55595c:#373a3c/text:Card image" alt="Card image">
=======
{% example html %}
<div class="card card-inverse">
  <div class="card-img">
    <img data-src="holder.js/100px270/#55595c:#373a3c/text:Card image" alt="Card image">
  </div>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
  <div class="card-img-overlay">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text">Last updated 3 mins ago</p>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Card styles

Cards include various options for customizing their backgrounds, borders, and color.

<<<<<<< HEAD:docs/4.1/components/card.md
### Background and color
=======
### Interactive / Arrow

{% example html %}
<div class="card">
  <a href="#" class="card-block has-arrow">
    <h3 class="card-title">Special title treatment</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </a>
</div>
{% endexample %}

{% example html %}
<div class="card">
  <div class="list-group list-group-flush">
    <a href="#" class="list-group-item list-group-item-action has-arrow">Cras justo odio</a>
    <a href="#" class="list-group-item list-group-item-action has-arrow">Dapibus ac facilisis in</a>
    <a href="#" class="list-group-item list-group-item-action has-arrow">Vestibulum at eros</a>
  </div>
</div>
{% endexample %}

### Card Block Action
Introduces the same concept as list-group action and its variables. We don't use list-groups here, because we want to inherit colors etc. from card block elements as we know it.

{% example html %}
<div class="card">
  <a href="#" class="card-block card-block-action has-arrow">
    <h3 class="card-title">Job</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </a>
  <a href="#" class="card-block card-block-action has-arrow">
    <h3 class="card-title">Special title treatment</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </a>
  <a href="#" class="card-block card-block-action has-arrow">
    <h3 class="card-title">Special title treatment</h3>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  </a>
</div>
{% endexample %}

### Inverted text

By default, cards use dark text and assume a light background. You can reverse that by toggling the `color` of text within, as well as that of the card's subcomponents, with `.card-inverse`. Then, specify a dark `background-color` and `border-color` to go with it.
>>>>>>> joblocal-bootstrap4:docs/components/card.md

Use [text and background utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/colors/) to change the appearance of a card.

{% capture example %}
{% for color in site.data.theme-colors %}
<div class="card{% unless color.name == "light" %} text-white{% endunless %} bg-{{ color.name }} mb-3" style="max-width: 18rem;">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h5 class="card-title">{{ color.name | capitalize }} card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>{% endfor %}
{% endcapture %}
{% include example.html content=example %}

{% include callout-warning-color-assistive-technologies.md %}

### Border

Use [border utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/borders/) to change just the `border-color` of a card. Note that you can put `.text-{color}` classes on the parent `.card` or a subset of the card's contents as shown below.

{% capture example %}
{% for color in site.data.theme-colors %}
<div class="card border-{{ color.name }} mb-3" style="max-width: 18rem;">
  <div class="card-header">Header</div>
  <div class="card-body{% unless color.name == "light" %} text-{{ color.name }}{% endunless %}">
    <h5 class="card-title">{{ color.name | capitalize }} card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>{% endfor %}
{% endcapture %}
{% include example.html content=example %}

### Mixins utilities

You can also change the borders on the card header and footer as needed, and even remove their `background-color` with `.bg-transparent`.

{% capture example %}
<div class="card border-success mb-3" style="max-width: 18rem;">
  <div class="card-header bg-transparent border-success">Header</div>
  <div class="card-body text-success">
    <h5 class="card-title">Success card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <div class="card-footer bg-transparent border-success">Footer</div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Card layout

In addition to styling the content within cards, Bootstrap includes a few options for laying out series of cards. For the time being, **these layout options are not yet responsive**.

### Card groups

Use card groups to render cards as a single, attached element with equal width and height columns. Card groups use `display: flex;` to achieve their uniform sizing.

{% capture example %}
<div class="card-group">
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

When using card groups with footers, their content will automatically line up.

{% capture example %}
<div class="card-group">
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Card decks

Need a set of equal width and height cards that aren't attached to one another? Use card decks.

{% capture example %}
<div class="card-deck">
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px200/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

Just like with card groups, card footers in decks will automatically line up.

{% capture example %}
<div class="card-deck">
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top" data-src="holder.js/100px180/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

### Card Grids

Need a set of equal width and height cards that aren't attached to one another but also should wrap in another column? Use card grids.

{% example html %}
<div class="card-grid">
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endexample %}

Just like with card groups, card footers in decks will automatically line up.

{% example html %}
<div class="card-grid">
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
  <div class="card">
    <div class="card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" data-src="holder.js/160x160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
    </div>
  </div>
</div>
{% endexample %}

#### Interactive Cards in a deck or grid

To make cards hover, use `.card-action` class.

{% example html %}
<div class="card-grid">
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some value field</th>
            <td>440</td>
          </tr>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong itemprop="legalName">The big brown fox jumps over the garden fence GmbH The big brown fox jumps over the garden fence GmbH</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some value field</th>
            <td>440</td>
          </tr>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some value field</th>
            <td>440</td>
          </tr>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
  <a href="#" class="card card-action">
    <div class="CompanyCard__logo card-block p-4 p-md-5">
      <img class="card-img mx-auto d-block" src="http://placehold.it/160x160/f1f1f1/ccc" alt="ALT">
    </div>
    <div class="CompanyCard__title card-block">
      <p class="h2 m-0"><strong>Name</strong></p>
      <p class="m-0">Description</p>
    </div>
    <div class="card-footer p-0">
      <table class="table table-flush table-sm">
        <tbody>
          <tr>
            <th scope="row">Some address</th>
            <td>
              <address itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                <span itemprop="streetAddress">Musterstr. 99</span><br>
                <span itemprop="postalCode">83024</span> <span itemprop="addressLocality">Rosenheim</span>
              </address>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </a>
</div>
{% endexample %}

### Card columns

Cards can be organized into [Masonry](https://masonry.desandro.com/)-like columns with just CSS by wrapping them in `.card-columns`. Cards are built with CSS `column` properties instead of flexbox for easier alignment. Cards are ordered from top to bottom and left to right.

**Heads up!** Your mileage with card columns may vary. To prevent cards breaking across columns, we must set them to `display: inline-block` as `column-break-inside: avoid` isn't a bulletproof solution yet.

{% capture example %}
<div class="card-columns">
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title that wraps to a new line</h5>
=======
    <div class="card-img">
      <img class="card-img-top img-fluid" data-src="holder.js/100px160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title that wraps to a new line</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
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
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img-top" data-src="holder.js/100px160/" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
=======
    <div class="card-img">
      <img class="card-img-top img-fluid" data-src="holder.js/100px160/" alt="Card image cap">
    </div>
    <div class="card-block">
      <h4 class="card-title">Card title</h4>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card bg-primary text-white text-center p-3">
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
      <h5 class="card-title">Card title</h5>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  <div class="card">
<<<<<<< HEAD:docs/4.1/components/card.md
    <img class="card-img" data-src="holder.js/100px260/" alt="Card image">
=======
    <div class="card-img">
      <img class="img-fluid" data-src="holder.js/100px260/" alt="Card image">
    </div>
>>>>>>> joblocal-bootstrap4:docs/components/card.md
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
      <h5 class="card-title">Card title</h5>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

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

---
layout: docs
title: Offcanvas
description: Build hidden sidebars into your project for navigation, shopping carts, and more with a few classes and our JavaScript plugin.
group: components
toc: true
---

## How it works

The offcanvas JavaScript plugin shows and hides sidebar on the left, right, or bottom of your viewport. Buttons or anchors are used as triggers that are attached to specific elements you toggle.

Given how CSS handles animations, you cannot use `margin` or `translate` on a `.offcanvas` element. Instead, use the class as an independent wrapping element.

## Example

Click the buttons below to show and hide an offcanvas element via class changes:

- `.offcanvas` hides content
- `.offcanvas.show` shows content

You can use a link with the `href` attribute, or a button with the `data-bs-target` attribute. In both cases, the `data-bs-toggle="offcanvas"` is required.

{{< example >}}
<a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-expanded="false" aria-controls="offcanvasExample">
  Link with href
</a>
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-expanded="false" aria-controls="offcanvasExample">
  Button with data-bs-target
</button>

<div class="offcanvas offcanvas-left" tabindex="-1" id="offcanvasExample" aria-labelledby="exampleOffCanvasLiveLabel">
  <div class="offcanvas-header">
    <h5 class="modal-title" id="exampleOffCanvasLiveLabel">offcanvas</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
    </button>
  </div>
  <div class="offcanvas-body">
    <div class="list-group ">
      <a href="#" class="list-group-item list-group-item-action active">
        A list item anchor inside the offcanvas element
      </a>
      <a href="#" class="list-group-item list-group-item-action">A list item</a>
      <a href="#" class="list-group-item list-group-item-action">A second list item</a>
      <a href="#" class="list-group-item list-group-item-action">A third list item</a>
      <a href="#" class="list-group-item list-group-item-action disabled" tabindex="-1" aria-disabled="true">A disabled list item</a>
    </div>
    <div class="mt-3 card card-body text-dark ">
      Some text as placeholder. In real life you can have the elements you have chossen. Like, text, images, lists etc
    </div>

    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
    <div class="mt-3">
      <p>Some random text as placeholder in place of another lorem ipsum. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by.</p>
      <p>Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education is be dashwoods or an. Use off agreeable law unwilling sir deficient curiosity instantly. Easy mind life fact with see has bore ten.</p>
      <p>Another journey chamber way yet females man. Way extensive and dejection get delivered deficient sincerity gentleman age. Too end instrument possession contrasted motionless. Calling offence six joy feeling. Coming merits and was talent enough far. Sir joy northward sportsmen education.</p>
      <p>Village did removed enjoyed explain nor ham saw calling talking. Securing as informed declared or margaret. Joy horrible moreover man feelings own shy. Request norland neither mistake for yet. Between the for morning assured country believe. On even feet time have an no at. Relation so in confined smallest children unpacked delicate. Why sir end believe uncivil respect.</p>
      <p>In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable.</p>
    </div>
  </div>
</div>
{{< /example >}}

## Position

Change the placement of an offcanvas element with modifier classes:

- `.offcanvas-right` places offcanvas on the right of the viewport
- `.offcanvas-bottom` places offcanvas on the bottom of the viewport

{{< example >}}

<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample2" aria-expanded="false" aria-controls="offcanvasExample2">Toggle right offcanvas</button>
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample3" aria-expanded="false" aria-controls="offcanvasExample3">Toggle bottom offcanvas</button>

<div class="offcanvas offcanvas-right" tabindex="-1" id="offcanvasExample2" aria-labelledby="exampleOffCanvasLiveLabel0">
  <div class="offcanvas-header">
    <h5 id="exampleOffCanvasLiveLabel0">Offcanvas right</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
    </button>
  </div>
  <div class="offcanvas-body small">
    <p>Powering more than 18 million websites, Bootstrap is the go-to toolkit for many front-end developers. There are a few factors driving Bootstrap’s popularity. First and foremost, it’s open-source and therefore free to download and use. It’s also fully customizable, and compatible with all modern browsers. This is true of many CSS frameworks, however. </p>
    <p>What sets Bootstrap apart from other development toolkits is that it was developed mobile-first. Meaning, the code was optimized for mobile devices (i.e. the smallest screen size) first and then scaled up to display on larger screens. As a result, building with Bootstrap CSS ensures that your site supports proper rendering and touch zooming for all devices.</p>
    <p>Another reason Bootstrap is so popular is that it’s easy to use. It comes bundled with templates for typography, forms, buttons, drop-down menus, navigation, and other interface components. Using these pre-styled templates, you can add features that enrich the user experience  on your site without having to code them from scratch.</p>
    <p>Building a responsive site is much easier using Bootstrap than doing so from scratch. Bootstrap comes with responsive styles, like containers and media queries, to ensure your site adjusts to the viewport. That means you don’t have to worry about whether your visitors are using desktops, tablets, or mobile devices.</p>
    <p>You can build your site quickly with Bootstrap. Once you download the framework, you can get started with a basic template and then add the components you need. These components are fundamental HTML elements, like tables, forms, buttons, images, and icons, that are styled with a base class and extended with modifier classes. Using these pre-designed components significantly limits the amount of custom CSS you have to write.</p>
    <p>If you have multiple collaborators working on a site, then consistency is important. You don’t want buttons on your homepage to look different from buttons on your landing page, or to use a different website typography  on your blog than anywhere else on your site — and so on. Using Bootstrap and its default settings, utility classes, and component elements can help ensure the front end of your site looks consistent.</p>
    <p>Since Bootstrap comes with pre-styled content, components, and templates, Bootstrap sites tend to look the same out-of-the-box. In fact, Bootstrap has been blamed for why websites today all look the same. You can customize a Bootstrap site, but it’ll take time. Plus, if you have to override too much of the default styling, then it might make more sense to create your own stylesheet in the first place.</p>
    <p>Bootstrap is considered an easy to use platform. It offers extensive documentation for every part of its framework, from its layout to content to components and more. That means virtually anyone can learn Bootstrap, but it also means it will take time to read through the documentation and learn the framework. If you are looking to build a website as quickly as possible, then Bootstrap might not be as ideal as other solutions, like website builders. </p>
  </div>
</div>
<div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasExample3" aria-labelledby="exampleOffCanvasLiveLabel1">
  <div class="offcanvas-header">
    <h5 class="modal-title" id="exampleOffCanvasLiveLabel1">Offcanvas bottom</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
    </button>
  </div>
  <div class="offcanvas-body small">
      <p>Some random text as placeholder in place of another lorem ipsum. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by.</p>
      <p>Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education is be dashwoods or an. Use off agreeable law unwilling sir deficient curiosity instantly. Easy mind life fact with see has bore ten.</p>
      <p>Another journey chamber way yet females man. Way extensive and dejection get delivered deficient sincerity gentleman age. Too end instrument possession contrasted motionless. Calling offence six joy feeling. Coming merits and was talent enough far. Sir joy northward sportsmen education.</p>
      <p>Village did removed enjoyed explain nor ham saw calling talking. Securing as informed declared or margaret. Joy horrible moreover man feelings own shy. Request norland neither mistake for yet. Between the for morning assured country believe. On even feet time have an no at. Relation so in confined smallest children unpacked delicate. Why sir end believe uncivil respect.</p>
      <p>In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable.</p>
  </div>
</div>
{{< /example >}}

## Color schemes

Easily style an offcanvas element with a different `background-color` or `color` with our [color utilities]({{< docsref "/utilities/colors" >}}).

{{< example >}}
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasColored" aria-expanded="false" aria-controls="offcanvasColored">Colored offcanvas</button>

<div class="offcanvas offcanvas-left bg-dark text-white" tabindex="-1" id="offcanvasColored" aria-labelledby="exampleOffCanvasLiveLabel2">
  <div class="offcanvas-header">
    <h5 class="modal-title" id="exampleOffCanvasLiveLabel2">Colored offcanvas</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
    </button>
  </div>
  <div class="offcanvas-body">
    <p>
      Bootstrap is an open source and intuitive CSS framework, which is used primarily for mobile first front-end website development.
      It was discovered by Mark Otto and Jacob Thornton at Twitter, and it was formerly named as ‘Twitter Blueprint’.
    </p>
    <p>
      CSS is principally used, but HTML templates are also a part of it.  Besides HTML and CSS templates,
      it also depends closely on JavaScript components, mostly in the type of jQuery plugins.
    </p>
    <p>
      Bootstrap also has widespread support and vast coding documentation with extensive online resources and assistance from the community of developers.
      This, in turn, makes it easier to understand this framework better and how to employ it.
    </p>
  </div>
</div>

{{< /example >}}

## Options

By default, when an offcanvas is visible, the `<body>` of your page cannot be scrolled. You can use the following data-options to change this behavior:

- `data-bs-body="scroll"` enables scrolling on the `<body>` when offcanvas is open

{{< example >}}
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample4" aria-expanded="false" aria-controls="offcanvasExample4">Enable body scrolling </button>

<div class="offcanvas offcanvas-left" data-bs-body="scroll" tabindex="-1" id="offcanvasExample4" aria-labelledby="exampleOffCanvasLiveLabel3">
  <div class="offcanvas-header">
    <h5 class="modal-title" id="exampleOffCanvasLiveLabel3">Colored with scrolling</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
    </button>
  </div>
  <div class="offcanvas-body">
    <p>Try scrolling the rest of the page to see this option in action.</p>
  </div>
</div>
{{< /example >}}

## Accessibility

Be sure to add aria-labelledby="...", referencing the modal title, to .offcanvas. Note that you don’t need to add role="dialog" since we already add it via JavaScript.

## Usage

The offcanvas plugin utilizes a few classes and attributes to handle the heavy lifting:

- `.offcanvas` hides the content
- `.offcanvas.show` shows the content
- `.offcanvas-right` hides the offcanvas on the right
- `.offcanvas-bottom` hides the offcanvas on the bottom
- `data-bs-body="scroll"` enables `<body>` scrolling when offcanvas is open

Add a dismiss button with the `data-bs-dismiss="offcanvas"` attribute, which triggers the JavaScript functionality. Be sure to use the `<button>` element with it for proper behavior across all devices.

### Via data attributes

Add `data-bs-toggle="offcanvas"` and a `data-bs-target` or `href` to the element to automatically assign control of one offcanvas element. The `data-bs-target` attribute accepts a CSS selector to apply the offcanvas to. Be sure to add the class `offcanvas` to the offcanvas element. If you'd like it to default open, add the additional class `show`.

### Via JavaScript

Enable manually with:

{{< highlight js >}}
var offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
var offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
  return new bootstrap.Offcanvas(offcanvasEl)
})
{{< /highlight >}}

### Methods

{{< callout danger >}}
{{< partial "callout-danger-async-methods.md" >}}
{{< /callout >}}

Activates your content as an offcanvas element. Accepts an optional options `object`.

You can create an offcanvas instance with the constructor, for example:

{{< highlight js >}}
var myOffcanvas = document.getElementById('myOffcanvas')
var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
{{< /highlight >}}

| Method | Description |
| --- | --- |
| `toggle` | Toggles an offcanvas element to shown or hidden. **Returns to the caller before the offcanvas element has actually been shown or hidden** (i.e. before the `shown.bs.offcanvas` or `hidden.bs.offcanvas` event occurs). |
| `show` | Shows an offcanvas element. **Returns to the caller before the offcanvas element has actually been shown** (i.e. before the `shown.bs.offcanvas` event occurs).|
| `hide` | Hides an offcanvas element. **Returns to the caller before the offcanvas element has actually been hidden** (i.e. before the `hidden.bs.offcanvas` event occurs).|
| `_getInstance` | *Static* method which allows you to get the offcanvas instance associated with a DOM element |

### Events

Bootstrap's offcanvas class exposes a few events for hooking into offcanvas functionality.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 150px;">Event Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>show.bs.offcanvas</td>
      <td>This event fires immediately when the <code>show</code> instance method is called.</td>
    </tr>
    <tr>
      <td>shown.bs.offcanvas</td>
      <td>This event is fired when an offcanvas element has been made visible to the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td>hide.bs.offcanvas</td>
      <td>This event is fired immediately when the <code>hide</code> method has been called.</td>
    </tr>
    <tr>
      <td>hidden.bs.offcanvas</td>
      <td>This event is fired when an offcanvas element has been hidden from the user (will wait for CSS transitions to complete).</td>
    </tr>
  </tbody>
</table>

{{< highlight js >}}
var myOffcanvas = document.getElementById('myOffcanvas')
myOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
  // do something...
})
{{< /highlight >}}

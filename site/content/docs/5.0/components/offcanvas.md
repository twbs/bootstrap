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

You can use a link with the `href` attribute, or a button with the `data-target` attribute. In both cases, the `data-toggle="offcanvas"` is required.

{{< example >}}
<a class="btn btn-primary" data-toggle="offcanvas" href="#offcanvasExample" role="button" aria-expanded="false" aria-controls="offcanvasExample">
  Link with href
</a>
<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasExample" aria-expanded="false" aria-controls="offcanvasExample">
  Button with data-target
</button>

<div class="offcanvas bg-dark text-white" tabindex="-1" id="offcanvasExample">
  <div class="offcanvas-header">
    <div>Offcanvas</div>
    <button type="button" class="close text-reset" data-dismiss="offcanvas" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="offcanvas-body">
    <div class="list-group ">
      <a href="#" class="list-group-item list-group-item-action active">
        Cras justo odio
      </a>
      <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
      <a href="#" class="list-group-item list-group-item-action">Morbi leo risus</a>
      <a href="#" class="list-group-item list-group-item-action">Porta ac consectetur ac</a>
      <a href="#" class="list-group-item list-group-item-action disabled" tabindex="-1" aria-disabled="true">Vestibulum at eros</a>
    </div>
    <div class="mt-3 card card-body text-dark ">
      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
    </div>

    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
    <div class="mt-3">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam bibendum ante ac est viverra tincidunt. Suspendisse lobortis lorem nec est congue, sed scelerisque mauris iaculis. Phasellus enim lorem, sagittis a eros at, feugiat tempor leo. Nunc in massa nibh. Vivamus vestibulum orci sem, et consectetur velit laoreet eget.</p>
      <p>Curabitur et suscipit justo, sed pretium enim. Vivamus lobortis dapibus purus, eget pharetra nibh tincidunt in. Integer accumsan elit nisi, eget commodo magna vehicula ut. Cras nec pellentesque diam. Donec porta posuere urna in pellentesque. Nulla facilisi. Aliquam erat volutpat.</p>
      <p>Donec lobortis eget tortor ac mattis. Maecenas sit amet sollicitudin libero. Quisque sodales pulvinar ipsum, vel fermentum enim convallis a. Proin rutrum orci scelerisque, accumsan quam vel, hendrerit erat. Cras vitae mauris vel massa sollicitudin scelerisque posuere sed lorem. Aenean volutpat libero non urna elementum aliquet.</p>
      <p>Phasellus eros ex, efficitur in ex et, maximus lobortis magna. Suspendisse convallis, neque a varius tempor, nisi tellus blandit velit, at dignissim nibh ligula et leo. Mauris vel elit sit amet sem blandit congue. Pellentesque vulputate, nibh quis semper pharetra, tellus nunc pretium mi, et volutpat purus turpis porttitor lectus.</p>
      <p>Proin rhoncus tortor ac dictum varius. Praesent congue condimentum tempus. Ut nec purus ut orci feugiat tristique sit amet sit amet mi. Etiam malesuada nibh sed porta faucibus. Aliquam dolor orci, gravida vel augue in, auctor eleifend lectus. Fusce viverra varius elementum. Nam quis ipsum eu ante venenatis vehicula. Duis eu nibh eget nulla interdum condimentum.</p>
    </div>
  </div>
</div>
{{< /example >}}

## Position

Change the placement of an offcanvas element with modifier classes:

- `.offcanvas-right` places offcanvas on the right of the viewport
- `.offcanvas-bottom` places offcanvas on the bottom of the viewport

{{< example >}}

<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasExample2" aria-expanded="false" aria-controls="offcanvasExample2">Toggle right offcanvas</button>
<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasExample3" aria-expanded="false" aria-controls="offcanvasExample3">Toggle bottom offcanvas</button>

<div class="offcanvas bg-dark text-white offcanvas-right" tabindex="-1" id="offcanvasExample2">
  <div class="offcanvas-header">
    <div>Offcanvas right</div>
    <button type="button" class="close text-reset" data-dismiss="offcanvas" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</div>
<div class="offcanvas bg-dark text-white offcanvas-bottom" tabindex="-1" id="offcanvasExample3">
  <div class="offcanvas-header">
    <div>Offcanvas bottom</div>
    <button type="button" class="close text-reset" data-dismiss="offcanvas" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</div>
{{< /example >}}

## Color schemes

Easily style an offcanvas element with a different `background-color` or `color` with our [color utilities]({{< docsref "/utilities/colors" >}}).

{{< example >}}
<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasColored" aria-expanded="false" aria-controls="offcanvasColored">Colored offcanvas</button>

<div class="offcanvas bg-primary text-white" data-body="scroll" tabindex="-1" id="offcanvasColored">
  <div class="offcanvas-header">
    Colored offcanvas
  </div>
</div>

{{< /example >}}

## Options

By default, when an offcanvas is visible, the `<body>` of your page cannot be scrolled. You can use the following data-options to change this behavior:

- `data-body="scroll"` enables scrolling on the `<body>` when offcanvas is open
- `data-body="backdrop"` disables scrolling and creates a backdrop over the `<body>` when offcanvas is open

{{< example >}}
<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasExample4" aria-expanded="false" aria-controls="offcanvasExample4">Enable body scrolling </button>
<button class="btn btn-primary" type="button" data-toggle="offcanvas" data-target="#offcanvasExample5" aria-expanded="false" aria-controls="offcanvasExample5">Body backdrop</button>

<div class="offcanvas bg-dark text-white" data-body="scroll" tabindex="-1" id="offcanvasExample4">
  <div class="offcanvas-header">
    Offcanvas with scrolling
  </div>
  <div class="offcanvas-body">
    <p>Try scrolling the rest of the page to see this option in action.</p>
  </div>
</div>
<div class="offcanvas bg-dark text-white" data-body="backdrop" tabindex="-1" id="offcanvasExample5">
  <div class="offcanvas-header">
    Offcanvas with backdrop
  </div>
  <div class="offcanvas-body">
    <p>Try clicking on the page's content to toggle the offcanvas.</p>
  </div>
</div>
{{< /example >}}

## Accessibility

For more information refer to collapsible [accessibility docs]({{< docsref "/components/collapse#accessibility" >}}).

## Usage

The offcanvas plugin utilizes a few classes and attributes to handle the heavy lifting:

- `.offcanvas` hides the content
- `.offcanvas.show` shows the content
- `.offcanvas-right` hides the offcanvas on the right
- `.offcanvas-bottom` hides the offcanvas on the bottom
- `data-body="scroll"` enables `<body>` scrolling when offcanvas is open
- `data-body="backdrop"` disables `<body>` scrolling and adds backdrop when offcanvas is open

Add a dismiss button with the `data-dismiss="offcanvas"` attribute, which triggers the JavaScript functionality. Be sure to use the `<button>` element with it for proper behavior across all devices.

### Via data attributes

Add `data-toggle="offcanvas"` and a `data-target` or `href` to the element to automatically assign control of one offcanvas element. The `data-target` attribute accepts a CSS selector to apply the offcanvas to. Be sure to add the class `offcanvas` to the offcanvas element. If you'd like it to default open, add the additional class `show`.

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

Activates your content as a offcanvas element. Accepts an optional options `object`.

You can create a offcanvas instance with the constructor, for example:

{{< highlight js >}}
var myOffcanvas = document.getElementById('myOffcanvas')
var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
{{< /highlight >}}

| Method | Description |
| --- | --- |
| `toggle` | Toggles a offcanvas element to shown or hidden. **Returns to the caller before the offcanvas element has actually been shown or hidden** (i.e. before the `shown.bs.offcanvas` or `hidden.bs.offcanvas` event occurs). |
| `show` | Shows a offcanvas element. **Returns to the caller before the offcanvas element has actually been shown** (i.e. before the `shown.bs.offcanvas` event occurs).|
| `hide` | Hides a offcanvas element. **Returns to the caller before the offcanvas element has actually been hidden** (i.e. before the `hidden.bs.offcanvas` event occurs).|
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
      <td>This event is fired when a offcanvas element has been made visible to the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td>hide.bs.offcanvas</td>
      <td>This event is fired immediately when the <code>hide</code> method has been called.</td>
    </tr>
    <tr>
      <td>hidden.bs.offcanvas</td>
      <td>This event is fired when a offcanvas element has been hidden from the user (will wait for CSS transitions to complete).</td>
    </tr>
  </tbody>
</table>

{{< highlight js >}}
var myOffcanvas = document.getElementById('myOffcanvas')
myOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
  // do something...
})
{{< /highlight >}}

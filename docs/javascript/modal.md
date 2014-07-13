---
layout: page
title: Modal
---

Modals are streamlined, but flexible, dialog prompts with the minimum required functionality and smart defaults.

<div class="bs-callout bs-callout-warning" id="callout-stacked-modals">
  <h4>Overlapping modals not supported</h4>
  <p>Be sure not to open a modal while another is still visible. Showing more than one modal at a time requires custom code.</p>
</div>
<div class="bs-callout bs-callout-warning" id="callout-modal-markup-placement">
  <h4>Modal markup placement</h4>
  <p>Always try to place a modal's HTML code in a top-level position in your document to avoid other components affecting the modal's appearance and/or functionality.</p>
</div>
<div class="bs-callout bs-callout-warning">
  <h4>Mobile device caveats</h4>
  <p>There are some caveats regarding using modals on mobile devices. <a href="../getting-started/#support-fixed-position-keyboards">See our browser support docs</a> for details.</p>
</div>

### Static example

A rendered modal with header, body, and set of actions in the footer.</p>

<div class="bs-example bs-example-modal">
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          <h4 class="modal-title">Modal title</h4>
        </div>
        <div class="modal-body">
          <p>One fine body&hellip;</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
</div>

{% highlight html %}
<div class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
        <p>One fine body&hellip;</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
{% endhighlight %}

### Live demo

Toggle a modal via JavaScript by clicking the button below. It will slide down and fade in from the top of the page.

<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
        <h4>Text in a modal</h4>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

        <h4>Popover in a modal</h4>
        <p>This <a href="#" role="button" class="btn btn-secondary popover-test" title="A Title" data-content="And here's some amazing content. It's very engaging. right?">button</a> should trigger a popover on click.</p>

        <h4>Tooltips in a modal</h4>
        <p><a href="#" class="tooltip-test" title="Tooltip">This link</a> and <a href="#" class="tooltip-test" title="Tooltip">that link</a> should have tooltips on hover.</p>

        <hr>

        <h4>Overflowing text to show scroll behavior</h4>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>

    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div>

<div class="bs-example" style="padding-bottom: 24px;">
  <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
    Launch demo modal
  </button>
</div>

{% highlight html %}
<!-- Button trigger modal -->
<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
{% endhighlight %}

<div class="bs-callout bs-callout-warning">
  <h4>Make modals accessible</h4>
  <p>Be sure to add <code>role="dialog"</code> to <code>.modal</code>, <code>aria-labelledby="myModalLabel"</code> attribute to reference the modal title, and <code>aria-hidden="true"</code> to tell assistive technologies to skip the modal's DOM elements.</p>
  <p>Additionally, you may give a description of your modal dialog with <code>aria-describedby</code> on <code>.modal</code>.</p>
</div>

<div class="bs-callout bs-callout-info">
  <h4>Embedding YouTube videos</h4>
  <p>Embedding YouTube videos in modals requires additional JavaScript not in Bootstrap to automatically stop playback and more. <a href="http://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal">See this helpful Stack Overflow post</a> for more information.</p>
</div>

## Optional sizes

Modals have two optional sizes, available via modifier classes to be placed on a `.modal-dialog`.

<div class="bs-example">
  <button class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">Large modal</button>
  <button class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-sm">Small modal</button>
</div>

{% highlight html %}
<!-- Large modal -->
<button class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">Large modal</button>

<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      ...
    </div>
  </div>
</div>

<!-- Small modal -->
<button class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-sm">Small modal</button>

<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      ...
    </div>
  </div>
</div>
{% endhighlight %}

<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">

      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myLargeModalLabel">Large modal</h4>
      </div>
      <div class="modal-body">
        ...
      </div>
    </div>
  </div>
</div>

<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">

      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="mySmallModalLabel">Small modal</h4>
      </div>
      <div class="modal-body">
        ...
      </div>
    </div>
  </div>
</div>

## Remove animation

For modals that simply appear rather than fade in to view, remove the `.fade` class from your modal markup.

{% highlight html %}
<div class="modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
  ...
</div>
{% endhighlight %}

## Usage

The modal plugin toggles your hidden content on demand, via data attributes or JavaScript. It also adds `.modal-open` to the `<body>` to override default scrolling behavior and generates a `.modal-backdrop` to provide a click area for dismissing shown modals when clicking outside the modal.

### Via data attributes

Activate a modal without writing JavaScript. Set `data-toggle="modal"` on a controller element, like a button, along with a `data-target="#foo"` or `href="#foo"` to target a specific modal to toggle.

{% highlight html %}
<button type="button" data-toggle="modal" data-target="#myModal">Launch modal</button>
{% endhighlight %}

### Via JavaScript

Call a modal with id `myModal` with a single line of JavaScript:

{% highlight js %}$('#myModal').modal(options){% endhighlight %}

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-backdrop=""`.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 50px;">type</th>
       <th style="width: 50px;">default</th>
       <th>description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>backdrop</td>
       <td>boolean or the string <code>'static'</code></td>
       <td>true</td>
       <td>Includes a modal-backdrop element. Alternatively, specify <code>static</code> for a backdrop which doesn't close the modal on click.</td>
     </tr>
     <tr>
       <td>keyboard</td>
       <td>boolean</td>
       <td>true</td>
       <td>Closes the modal when escape key is pressed</td>
     </tr>
     <tr>
       <td>show</td>
       <td>boolean</td>
       <td>true</td>
       <td>Shows the modal when initialized.</td>
     </tr>
    </tbody>
  </table>
</div>

### Methods

#### .modal(options)

Activates your content as a modal. Accepts an optional options `object`.

{% highlight js %}
$('#myModal').modal({
  keyboard: false
})
{% endhighlight %}

#### .modal('toggle')

Manually toggles a modal. **Returns to the caller before the modal has actually been shown or hidden** (i.e. before the `shown.bs.modal` or `hidden.bs.modal` event occurs).

{% highlight js %}$('#myModal').modal('toggle'){% endhighlight %}

#### .modal('show')

Manually opens a modal. **Returns to the caller before the modal has actually been shown** (i.e. before the `shown.bs.modal` event occurs).

{% highlight js %}$('#myModal').modal('show'){% endhighlight %}

#### .modal('hide')

Manually hides a modal. **Returns to the caller before the modal has actually been hidden** (i.e. before the `hidden.bs.modal` event occurs).

{% highlight js %}$('#myModal').modal('hide'){% endhighlight %}

### Events

Bootstrap's modal class exposes a few events for hooking into modal functionality.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 150px;">Event Type</th>
       <th>Description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>show.bs.modal</td>
       <td>This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.</td>
     </tr>
     <tr>
       <td>shown.bs.modal</td>
       <td>This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.</td>
     </tr>
     <tr>
       <td>hide.bs.modal</td>
       <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
     </tr>
     <tr>
       <td>hidden.bs.modal</td>
       <td>This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete).</td>
     </tr>
     <tr>
       <td>loaded.bs.modal</td>
       <td>This event is fired when the modal has loaded content using the <code>remote</code> option.</td>
     </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myModal').on('hidden.bs.modal', function (e) {
  // do something...
})
{% endhighlight %}

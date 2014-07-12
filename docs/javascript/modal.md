---
layout: page
title: Modal
---

<div class="bs-docs-section">
  <h1 id="modals" class="page-header">Modals <small>modal.js</small></h1>

  <h2 id="modals-examples">Examples</h2>
  <p>Modals are streamlined, but flexible, dialog prompts with the minimum required functionality and smart defaults.</p>

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

  <h3>Static example</h3>
  <p>A rendered modal with header, body, and set of actions in the footer.</p>
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
  </div><!-- /example -->
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

  <h3>Live demo</h3>
  <p>Toggle a modal via JavaScript by clicking the button below. It will slide down and fade in from the top of the page.</p>
  <!-- sample modal content -->
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
  </div><!-- /.modal -->

  <div class="bs-example" style="padding-bottom: 24px;">
    <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
      Launch demo modal
    </button>
  </div><!-- /example -->
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

  <h2 id="modals-sizes">Optional sizes</h2>
  <p>Modals have two optional sizes, available via modifier classes to be placed on a <code>.modal-dialog</code>.</p>
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

  <!--  Modal content for the above example -->
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
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
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
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

  <h2 id="modals-remove-animation">Remove animation</h2>
  <p>For modals that simply appear rather than fade in to view, remove the <code>.fade</code> class from your modal markup.</p>
{% highlight html %}
<div class="modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
  ...
</div>
{% endhighlight %}

  <h2 id="modals-usage">Usage</h2>
  <p>The modal plugin toggles your hidden content on demand, via data attributes or JavaScript. It also adds <code>.modal-open</code> to the <code>&lt;body&gt;</code> to override default scrolling behavior and generates a <code>.modal-backdrop</code> to provide a click area for dismissing shown modals when clicking outside the modal.</p>

  <h3>Via data attributes</h3>
  <p>Activate a modal without writing JavaScript. Set <code>data-toggle="modal"</code> on a controller element, like a button, along with a <code>data-target="#foo"</code> or <code>href="#foo"</code> to target a specific modal to toggle.</p>
{% highlight html %}
<button type="button" data-toggle="modal" data-target="#myModal">Launch modal</button>
{% endhighlight %}

  <h3>Via JavaScript</h3>
  <p>Call a modal with id <code>myModal</code> with a single line of JavaScript:</p>
  {% highlight js %}$('#myModal').modal(options){% endhighlight %}

  <h3>Options</h3>
  <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-backdrop=""</code>.</p>
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
  </div><!-- /.table-responsive -->

  <h3>Methods</h3>

  <h4>.modal(options)</h4>
  <p>Activates your content as a modal. Accepts an optional options <code>object</code>.</p>
{% highlight js %}
$('#myModal').modal({
  keyboard: false
})
{% endhighlight %}

  <h4>.modal('toggle')</h4>
  <p>Manually toggles a modal. <strong>Returns to the caller before the modal has actually been shown or hidden</strong> (i.e. before the <code>shown.bs.modal</code> or <code>hidden.bs.modal</code> event occurs).</p>
  {% highlight js %}$('#myModal').modal('toggle'){% endhighlight %}

  <h4>.modal('show')</h4>
  <p>Manually opens a modal. <strong>Returns to the caller before the modal has actually been shown</strong> (i.e. before the <code>shown.bs.modal</code> event occurs).</p>
  {% highlight js %}$('#myModal').modal('show'){% endhighlight %}

  <h4>.modal('hide')</h4>
  <p>Manually hides a modal. <strong>Returns to the caller before the modal has actually been hidden</strong> (i.e. before the <code>hidden.bs.modal</code> event occurs).</p>
  {% highlight js %}$('#myModal').modal('hide'){% endhighlight %}

  <h3>Events</h3>
  <p>Bootstrap's modal class exposes a few events for hooking into modal functionality.</p>
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
  </div><!-- /.table-responsive -->
{% highlight js %}
$('#myModal').on('hidden.bs.modal', function (e) {
  // do something...
})
{% endhighlight %}
</div>

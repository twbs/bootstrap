---
layout: page
title: Alerts
---

Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages. For inline dismissal, use the [alerts jQuery plugin]({{ site.baseurl }}javascript/#alerts).

Wrap any text and an optional dismiss button in `.alert` and one of the four contextual classes (e.g., `.alert-success`) for basic alert messages.

<div class="bs-callout bs-callout-info">
  <h4>No default class</h4>
  <p>Alerts don't have default classes, only base and modifier classes. A default gray alert doesn't make too much sense, so you're required to specify a type via contextual class. Choose from success, info, warning, or danger.</p>
</div>

{% example html %}
<div class="alert alert-success" role="alert">
  <strong>Well done!</strong> You successfully read this important alert message.
</div>
<div class="alert alert-info" role="alert">
  <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
</div>
<div class="alert alert-warning" role="alert">
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</div>
<div class="alert alert-danger" role="alert">
  <strong>Oh snap!</strong> Change a few things up and try submitting again.
</div>
{% endexample %}

### Dismissing

Build on any alert by adding an optional `.alert-dismissible` and [close button]().

{% example html %}
<div class="alert alert-warning alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    <span class="sr-only">Close</span>
  </button>
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</div>
{% endexample %}

<div class="bs-callout bs-callout-warning">
  <h4>Ensure proper behavior across all devices</h4>
  <p>Be sure to use the <code>&lt;button&gt;</code> element with the <code>data-dismiss="alert"</code> data attribute.</p>
</div>

### Link color

Use the `.alert-link` utility class to quickly provide matching colored links within any alert.

{% example html %}
<div class="alert alert-success" role="alert">
  <strong>Well done!</strong> You successfully read <a href="#" class="alert-link">this important alert message</a>.
</div>
<div class="alert alert-info" role="alert">
  <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
</div>
<div class="alert alert-warning" role="alert">
  <strong>Warning!</strong> Better check yourself, you're <a href="#" class="alert-link">not looking too good</a>.
</div>
<div class="alert alert-danger" role="alert">
  <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
</div>
{% endexample %}


## Examples

{% example html %}
<div class="alert alert-warning alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    <span class="sr-only">Close</span>
  </button>
  <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
</div>
{% endexample %}

When using a `.close` button, it must be the first child of the `.alert-dismissible` and no text content may come before it in the markup.

{% example html %}
<div class="alert alert-danger alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
  <h5 class="alert-heading">Sorry, something went wrong.</h5>
  <p>Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
  <p>
    <button type="button" class="btn btn-danger">Take this action</button>
    <button type="button" class="btn btn-secondary">Or do this</button>
  </p>
</div>
{% endexample %}

## Usage

Enable dismissal of an alert via JavaScript:

{% highlight js %}
$(".alert").alert()
{% endhighlight %}

### Markup

Just add `data-dismiss="alert"` to your close button to automatically give an alert close functionality. Closing an alert removes it from the DOM.

{% highlight html %}
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
  <span class="sr-only">Close</span>
</button>
{% endhighlight %}

To have your alerts use animation when closing, make sure they have the `.fade` and `.in` classes already applied to them.

### Methods

#### $().alert()

Makes an alert listen for click events on descendant elements which have the `data-dismiss="alert"` attribute. (Not necessary when using the data-api's auto-initialization.)

#### $().alert('close')

Closes an alert by removing it from the DOM. If the `.fade` and `.in` classes are present on the element, the alert will fade out before it is removed.

{% highlight js %}$(".alert").alert('close'){% endhighlight %}

### Events

Bootstrap's alert plugin exposes a few events for hooking into alert functionality.

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
        <td>close.bs.alert</td>
        <td>This event fires immediately when the <code>close</code> instance method is called.</td>
      </tr>
      <tr>
        <td>closed.bs.alert</td>
        <td>This event is fired when the alert has been closed (will wait for CSS transitions to complete).</td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myAlert').on('closed.bs.alert', function () {
  // do something…
})
{% endhighlight %}

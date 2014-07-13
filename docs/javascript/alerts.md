---
layout: page
title: Alerts
---

Add dismiss functionality to all alert messages with this plugin.

## Examples

{% example html %}
<div class="alert alert-warning alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
    <span class="sr-only">Close</span>
  </button>
  <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
</div>
{% endexample %}

{% example html %}
<div class="alert alert-danger alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
  <h4>Oh snap! You got an error!</h4>
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

Just add `data-dismiss="alert"` to your close button to automatically give an alert close functionality.

{% highlight html %}
<button type="button" class="close" data-dismiss="alert">
  <span aria-hidden="true">&times;</span>
  <span class="sr-only">Close</span>
</button>
{% endhighlight %}

### Methods

#### $().alert()

Wraps all alerts with close functionality. To have your alerts animate out when closed, make sure they have the `.fade` and `.in` class already applied to them.

#### .alert('close')

Closes an alert.

{% highlight js %}$(".alert").alert('close'){% endhighlight %}

### Events

Bootstrap's alert class exposes a few events for hooking into alert functionality.

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
$('#my-alert').on('closed.bs.alert', function () {
  // do something…
})
{% endhighlight %}

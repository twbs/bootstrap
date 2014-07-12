---
layout: page
title: Alerts
---

<div class="bs-docs-section">
  <h1 id="alerts" class="page-header">Alert messages <small>alert.js</small></h1>

  <h2 id="alerts-examples">Example alerts</h2>
  <p>Add dismiss functionality to all alert messages with this plugin.</p>
  <div class="bs-example">
    <div class="alert alert-warning fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
      <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
    </div>
  </div><!-- /example -->

  <div class="bs-example">
    <div class="alert alert-danger fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
      <h4>Oh snap! You got an error!</h4>
      <p>Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
      <p>
        <button type="button" class="btn btn-danger">Take this action</button>
        <button type="button" class="btn btn-secondary">Or do this</button>
      </p>
    </div>
  </div><!-- /example -->


  <h2 id="alerts-usage">Usage</h2>
  <p>Enable dismissal of an alert via JavaScript:</p>
  {% highlight js %}$(".alert").alert(){% endhighlight %}

  <h3>Markup</h3>
  <p>Just add <code>data-dismiss="alert"</code> to your close button to automatically give an alert close functionality.</p>
  {% highlight html %}<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>{% endhighlight %}

  <h3>Methods</h3>

  <h4>$().alert()</h4>
  <p>Wraps all alerts with close functionality. To have your alerts animate out when closed, make sure they have the <code>.fade</code> and <code>.in</code> class already applied to them.</p>

  <h4>.alert('close')</h4>
  <p>Closes an alert.</p>
  {% highlight js %}$(".alert").alert('close'){% endhighlight %}


  <h3>Events</h3>
  <p>Bootstrap's alert class exposes a few events for hooking into alert functionality.</p>
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
  </div><!-- /.table-responsive -->
{% highlight js %}
$('#my-alert').on('closed.bs.alert', function () {
  // do something…
})
{% endhighlight %}
</div>
